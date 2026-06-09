/* ==========================================================================
   FSSAI Virtual Microbiology Lab - Quality Assurance Module Logic
   ========================================================================= */

import { audio, canvasUtils, showNotification } from '../utils.js?v=1.4';
import { notebook } from '../notebook.js?v=1.4';

class QAModule {
    constructor() {
        // Autoclave State
        this.doorLocked = false;
        this.heatOn = false;
        this.valveOpen = true;
        this.temperature = 25.0;
        this.pressure = 0.0;
        
        this.ventTime = 0.0;
        this.airPurged = false;
        this.cycleTime = 0; // minutes (sterilization timer)
        this.autoclaveInterval = null;
        this.autoclaveDone = false;
        this.autoclaveResult = "Unsterilized";

        // BSC State
        this.bscExposed = false;
        this.bscIncubated = false;
        this.bscTrial = 1;
        this.bscFailures = 0;
        this.bscColoniesCount = null;
        this.bscCertified = false;
        this.bscIsServiced = false;
    }

    init() {
        this.currentStep = 1;
        // Reset Autoclave
        this.doorLocked = false;
        this.heatOn = false;
        this.valveOpen = true;
        this.temperature = 25.0;
        this.pressure = 0.0;
        this.ventTime = 0.0;
        this.airPurged = false;
        this.cycleTime = 0;
        this.autoclaveDone = false;
        this.autoclaveResult = "Unsterilized";
        
        if (this.autoclaveInterval) {
            clearInterval(this.autoclaveInterval);
            this.autoclaveInterval = null;
        }

        // Reset BSC
        this.bscExposed = false;
        this.bscIncubated = false;
        this.bscTrial = 1;
        this.bscFailures = 0;
        this.bscColoniesCount = null;
        this.bscCertified = false;
        this.bscIsServiced = false;

        // Reset DOM checkboxes
        const chkDoor = document.getElementById('chk-autoclave-door');
        const chkHeat = document.getElementById('chk-steam-heat');
        const chkVent = document.getElementById('chk-vent-valve');
        const strip = document.getElementById('autoclave-strip');
        
        if (chkDoor) chkDoor.checked = false;
        if (chkHeat) chkHeat.checked = false;
        if (chkVent) chkVent.checked = true;
        if (strip) {
            strip.className = "process-indicator-strip";
            strip.textContent = "Indicator";
        }

        this.updateAutoclaveGauges();
        this.resetBscUI();
        this.bindEvents();
        this.switchSubTab('autoclave');
        this.setupSteps();
        this.syncNotebook();
    }

    bindEvents() {
        // Sub tabs
        const subTabs = document.querySelectorAll('.qa-sub-tab');
        subTabs.forEach(tab => {
            tab.onclick = (e) => {
                const subName = e.target.getAttribute('data-sub');
                this.switchSubTab(subName);
                audio.playClick();
            };
        });

        // 1. Autoclave events
        const chkDoor = document.getElementById('chk-autoclave-door');
        const chkHeat = document.getElementById('chk-steam-heat');
        const chkVent = document.getElementById('chk-vent-valve');
        const btnRun = document.getElementById('btn-autoclave-run');
        const btnReset = document.getElementById('btn-autoclave-reset');

        if (chkDoor) {
            chkDoor.onchange = (e) => {
                const wantToUnlock = !e.target.checked;
                if (wantToUnlock) {
                    if (this.temperature > 80.0 || this.pressure > 0.1) {
                        audio.playError();
                        showNotification("HAZARD: Explosive Boil Hazard! Cannot unlock door while temperature is above 80°C or pressure is above 0.1 psi.", "error");
                        this.init();
                        return;
                    }
                }
                
                this.doorLocked = e.target.checked;
                audio.playClick();
                const doorSeal = document.getElementById('autoclave-door');
                if (doorSeal) {
                    if (this.doorLocked) doorSeal.classList.add('locked');
                    else doorSeal.classList.remove('locked');
                }
            };
        }

        if (chkHeat) {
            chkHeat.onchange = (e) => {
                this.heatOn = e.target.checked;
                audio.playClick();
                this.startAutoclaveLoop();
            };
        }

        if (chkVent) {
            chkVent.onchange = (e) => {
                this.valveOpen = e.target.checked;
                audio.playClick();
                this.startAutoclaveLoop();
            };
        }

        if (btnRun) {
            btnRun.onclick = () => {
                this.runAutoclaveCycle();
            };
        }

        if (btnReset) {
            btnReset.onclick = () => {
                this.init();
                audio.playClick();
            };
        }

        // 2. BSC events
        const btnExpose = document.getElementById('btn-bsc-expose');
        const btnIncubate = document.getElementById('btn-bsc-incubate');

        if (btnExpose) {
            btnExpose.onclick = () => {
                this.runBscExposure();
            };
        }

        if (btnIncubate) {
            btnIncubate.onclick = () => {
                this.runBscIncubation();
            };
        }
    }

    switchSubTab(subName) {
        this.activeSub = subName;
        this.currentStep = subName === 'autoclave' ? 1 : 2;

        // Toggle sub-tabs classes
        document.querySelectorAll('.qa-sub-tab').forEach(tab => {
            if (tab.getAttribute('data-sub') === subName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Toggle sub-viewport containers
        document.getElementById('sub-qa-autoclave').classList.add('hidden');
        document.getElementById('sub-qa-bsc').classList.add('hidden');

        document.getElementById(`sub-qa-${subName}`).classList.remove('hidden');
        
        if (subName === 'bsc') {
            this.drawBscPlate();
        }
        
        this.updateStepProgress();
    }

    setupSteps() {
        const steps = [
            { text: "Autoclave Sterility Calibration", desc: "Lock door, turn heat ON, and let air purge for 5-10 min (vent valve open) to remove air pockets, then close valve. Click 'Start Sterilization' to run at 121°C / 15 psi." },
            { text: "Biosafety Cabinet (BSC) Audit", desc: "Audit laminar airflow and HEPA filtration by exposing PCA settling plates for 30 minutes inside the cabinet. Incubate and read plates to verify sterility." }
        ];
        
        const stepsList = document.getElementById('sim-steps-list');
        if (stepsList) {
            stepsList.innerHTML = steps.map((s, idx) => `
                <div class="sim-step ${idx === 0 ? 'active' : ''}" id="m4-step-${idx + 1}">
                    <h5>Step ${idx + 1}: ${s.text} <i class="fa-solid fa-circle-notch sim-step-icon"></i></h5>
                    <p>${s.desc}</p>
                </div>
            `).join('');
        }
        this.updateStepProgress();
    }

    updateStepProgress() {
        const progressBar = document.getElementById('sim-progress-bar');
        const progressText = document.querySelector('.progress-step-text');
        const btnPrev = document.getElementById('btn-prev-step');
        const btnNext = document.getElementById('btn-next-step');
        
        if (progressBar) progressBar.style.width = `${(this.currentStep / 2) * 100}%`;
        if (progressText) progressText.textContent = `Step ${this.currentStep} of 2`;
        
        if (btnPrev) btnPrev.disabled = (this.currentStep === 1);
        if (btnNext) btnNext.disabled = (this.currentStep === 2);
        
        for (let i = 1; i <= 2; i++) {
            const stepEl = document.getElementById(`m4-step-${i}`);
            if (stepEl) {
                stepEl.className = "sim-step";
                if (i < this.currentStep) {
                    stepEl.classList.add('completed');
                    const icon = stepEl.querySelector('.sim-step-icon');
                    if (icon) icon.className = "fa-solid fa-circle-check text-green";
                } else if (i === this.currentStep) {
                    stepEl.classList.add('active');
                    const icon = stepEl.querySelector('.sim-step-icon');
                    if (icon) icon.className = "fa-solid fa-circle-dot text-cyan-glow";
                }
            }
        }
    }

    nextStep() {
        if (this.currentStep < 2) {
            this.currentStep++;
            this.switchSubTab('bsc');
            audio.playClick();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.switchSubTab('autoclave');
            audio.playClick();
        }
    }

    startAutoclaveLoop() {
        if (this.autoclaveInterval) return;

        this.autoclaveInterval = setInterval(() => {
            const ventStatus = document.getElementById('vent-exhaust-status');
            const vapors = document.getElementById('steam-vapors-particles');

            // Gauge Physics Loop
            if (this.heatOn && this.doorLocked) {
                // Temperature physics
                if (this.temperature < 125) {
                    this.temperature += 1.5;
                }

                // Venting / Purging logic
                if (this.valveOpen) {
                    // Pressure cannot build while valve is open
                    if (this.pressure > 1.0) this.pressure -= 1.0;
                    else this.pressure = Math.min(1.0, this.pressure + 0.1);

                    // Steam is venting
                    if (this.temperature >= 95) {
                        this.ventTime += 0.5;
                        if (ventStatus) {
                            ventStatus.textContent = "Steam Venting";
                            ventStatus.className = "badge badge-warning";
                        }
                        if (vapors) vapors.className = "steam-vapors venting";
                        audio.startSteamHiss();

                        if (this.ventTime >= 6.0) {
                            this.airPurged = true; // Air removed
                            if (ventStatus) {
                                ventStatus.textContent = "Air Purged (Pure Steam)";
                                ventStatus.className = "badge badge-success";
                            }
                        }
                    }
                } else {
                    // Valve is closed: Pressure builds with temperature
                    audio.stopSteamHiss();
                    if (vapors) vapors.className = "steam-vapors";
                    
                    if (ventStatus) {
                        ventStatus.textContent = "Sealed";
                        ventStatus.className = "badge";
                    }

                    if (this.temperature >= 100) {
                        // Pressure builds 1 psi per 1.5 degrees above 100°C
                        const targetPress = (this.temperature - 100) * 0.75;
                        if (this.pressure < targetPress) this.pressure += 0.5;
                    }
                }
            } else {
                // Cooling down
                audio.stopSteamHiss();
                if (vapors) vapors.className = "steam-vapors";
                
                if (ventStatus) {
                    ventStatus.textContent = "Cooling";
                    ventStatus.className = "badge badge-muted";
                }

                if (this.temperature > 25.0) {
                    this.temperature -= 0.75; // 1.5°C per second (0.75°C per 500ms tick)
                }
                if (this.pressure > 0.0) {
                    if (this.valveOpen) {
                        this.pressure -= 1.5;
                    } else {
                        // proportional drop to temp
                        const targetPress = Math.max(0, (this.temperature - 100) * 0.75);
                        if (this.pressure > targetPress) {
                            this.pressure = targetPress;
                        } else {
                            this.pressure -= 0.15;
                        }
                    }
                }
                if (this.pressure < 0) this.pressure = 0;
            }

            this.updateAutoclaveGauges();
            this.runAutoclaveSterilizeTimer();
        }, 500);
    }

    updateAutoclaveGauges() {
        const tempHand = document.getElementById('temp-hand');
        const pressHand = document.getElementById('press-hand');
        const tempRead = document.getElementById('temp-readout');
        const pressRead = document.getElementById('press-readout');

        if (tempRead) tempRead.textContent = Math.round(this.temperature);
        if (pressRead) pressRead.textContent = Math.round(this.pressure);

        // Convert values to degrees rotation (0-270 deg)
        // Dials range: Temp 0-140°C, Pressure 0-30psi
        if (tempHand) {
            const rot = (this.temperature / 140) * 270 - 135; // centered
            tempHand.style.transform = `rotate(${rot}deg)`;
        }
        if (pressHand) {
            const rot = (this.pressure / 30) * 270 - 135;
            pressHand.style.transform = `rotate(${rot}deg)`;
        }
    }

    runAutoclaveSterilizeTimer() {
        // Sterilization occurs only when Temperature >= 120°C and Pressure >= 14 psi
        const timerStatus = document.getElementById('cycle-timer-status');
        
        if (this.temperature >= 120.0 && this.pressure >= 14.0) {
            if (this.cycleTime < 15) {
                this.cycleTime += 1.0; // Increment cycle timer
                if (timerStatus) {
                    timerStatus.textContent = `${this.cycleTime} / 15 mins`;
                    timerStatus.className = "badge badge-warning";
                }
            } else {
                // Cycle complete
                if (!this.autoclaveDone) {
                    this.autoclaveDone = true;
                    // Automatically turn off the heat to start cooling
                    this.heatOn = false;
                    const chkHeat = document.getElementById('chk-steam-heat');
                    if (chkHeat) chkHeat.checked = false;
                    showNotification("Sterilization complete! Autoclave heating element turned off. Entering cooling phase.", "success");
                }
                if (timerStatus) {
                    timerStatus.textContent = "Cycle Complete";
                    timerStatus.className = "badge badge-success";
                }
                
                // Read indicator strip state
                const strip = document.getElementById('autoclave-strip');
                if (strip) {
                    if (this.airPurged) {
                        this.autoclaveResult = "Dark Purple (Sterile)";
                        strip.className = "process-indicator-strip sterile";
                        strip.textContent = "Sterile";
                    } else {
                        // Trapped air caused cold spots! Spores survive, strip fails
                        this.autoclaveResult = "Failed (Trapped Air / Cold Spot)";
                        strip.className = "process-indicator-strip"; // Remains yellow
                        strip.textContent = "Fail - Cold Spot";
                    }
                }
                
                this.syncNotebook();
            }
        }
    }

    runAutoclaveCycle() {
        if (!this.doorLocked) {
            audio.playError();
            showNotification("QA Alert: Cannot start autoclave. Chamber door is open/unlocked.", "error");
            return;
        }
        if (!this.heatOn) {
            audio.playError();
            showNotification("QA Alert: Steam heating element is turned off.", "error");
            return;
        }

        showNotification("Autoclave cycle initiated. Monitor temperature/pressure gauges and watch the air exhaust purge indicator.", "info");
    }

    // 2. BSC Cabinet Auditing Subsystem
    resetBscUI() {
        this.bscExposed = false;
        this.bscIncubated = false;
        
        const btnExpose = document.getElementById('btn-bsc-expose');
        const btnIncubate = document.getElementById('btn-bsc-incubate');
        
        if (btnExpose) {
            btnExpose.textContent = "Expose Plates (30 mins)";
            btnExpose.disabled = false;
        }
        if (btnIncubate) btnIncubate.disabled = true;

        document.getElementById('bsc-trial-indicator').textContent = `Trial ${this.bscTrial} of 3`;
        document.getElementById('bsc-failures-count').textContent = this.bscFailures;
        document.getElementById('bsc-failures-count').className = this.bscFailures > 0 ? "text-red" : "text-green";
        document.getElementById('bsc-outcome-log').textContent = "Cabinet State: Ready to test";
        
        // Airflow visual
        const airflow = document.getElementById('hepa-airflow');
        if (airflow) {
            if (this.bscIsServiced) {
                airflow.className = "hepa-flow running";
            } else {
                airflow.className = "hepa-flow"; // Malfunctioning flow is low/invisible
            }
        }

        this.drawBscPlate();
    }

    runBscExposure() {
        const btnExpose = document.getElementById('btn-bsc-expose');
        const btnInc = document.getElementById('btn-bsc-incubate');
        
        audio.playClick();
        if (btnExpose) {
            btnExpose.disabled = true;
            btnExpose.textContent = "Exposing...";
        }

        // Simulate 30 minute exposure (takes 2 seconds)
        setTimeout(() => {
            this.bscExposed = true;
            if (btnExpose) btnExpose.textContent = "Plates Exposed";
            if (btnInc) btnInc.disabled = false;
            audio.playSuccess();
            document.getElementById('bsc-outcome-log').textContent = "Plates exposed for 30 minutes. Run incubation to read bacterial contamination levels.";
        }, 2000);
    }

    runBscIncubation() {
        const btnInc = document.getElementById('btn-bsc-incubate');
        if (btnInc) btnInc.disabled = true;

        this.bscIncubated = true;
        audio.playSuccess();

        // Calculate colonies
        if (this.bscIsServiced) {
            // Sterile post-servicing
            this.bscColoniesCount = 0;
            this.bscCertified = true;
            document.getElementById('bsc-outcome-log').textContent = "Result: 0 colonies. HEPA filtration efficiency verified at 99.97%. BSC certified sterile!";
            this.bscTrial = 3; // lock
        } else {
            // Malfunctioning cabinet produces contamination colonies
            this.bscColoniesCount = 14 - (this.bscTrial * 3); // 11, 8, 5 colonies
            this.bscFailures++;
            
            document.getElementById('bsc-failures-count').textContent = this.bscFailures;
            document.getElementById('bsc-failures-count').className = "text-red";
            
            if (this.bscFailures >= 3) {
                audio.playError();
                document.getElementById('bsc-outcome-log').textContent = "Result: Contaminated! Consecutive failure limit reached (3 of 3). FAILURE PROTOCOL ACTIVE: Hood decommissioned. Servicing required.";
                
                // Show HEPA Service button
                const btnExpose = document.getElementById('btn-bsc-expose');
                if (btnExpose) {
                    btnExpose.textContent = "Service HEPA Filter";
                    btnExpose.disabled = false;
                    btnExpose.onclick = () => {
                        this.serviceHepaCabinet();
                    };
                }
            } else {
                document.getElementById('bsc-outcome-log').textContent = `Result: ${this.bscColoniesCount} colonies grew. Contamination check failed. Repeat the trial.`;
                this.bscTrial++;
                
                // Reset expose for next trial
                const btnExpose = document.getElementById('btn-bsc-expose');
                if (btnExpose) {
                    btnExpose.textContent = "Expose Plates (Trial " + this.bscTrial + ")";
                    btnExpose.disabled = false;
                }
            }
        }

        this.drawBscPlate();
        this.syncNotebook();
    }

    serviceHepaCabinet() {
        audio.playSuccess();
        showNotification("HEPA filter replaced, sash seals calibrated, pressure differential calibrated to 0.45 W.G. Vertical laminar airflow active.", "success");
        
        this.bscIsServiced = true;
        this.bscTrial = 1;
        this.bscFailures = 0;
        
        // Reset action button back to normal
        const btnExpose = document.getElementById('btn-bsc-expose');
        if (btnExpose) {
            btnExpose.onclick = () => {
                this.runBscExposure();
            };
        }
        
        this.resetBscUI();
    }

    drawBscPlate() {
        const canvas = document.getElementById('bsc-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw agar base (straw yellow)
        ctx.fillStyle = 'rgba(255, 235, 180, 0.45)';
        ctx.beginPath();
        ctx.arc(50, 50, 45, 0, Math.PI*2);
        ctx.fill();

        if (this.bscIncubated && this.bscColoniesCount > 0) {
            // Draw contamination colonies
            for (let i = 0; i < this.bscColoniesCount; i++) {
                const theta = i * 1.7;
                const r = 5 + (i * 9) % 35;
                const x = 50 + r * Math.cos(theta);
                const y = 50 + r * Math.sin(theta);
                canvasUtils.drawColony(ctx, x, y, 2.5, 'standard', '#ffebee');
            }
        }
    }

    syncNotebook() {
        // Autoclave
        let purgeAudit = "Not checked";
        if (this.ventTime > 0) {
            purgeAudit = this.airPurged ? "Completed (No trapped air)" : "Vented too short (Trapped air!)";
        }
        
        notebook.logQAData('autoclave', {
            purge: purgeAudit,
            strip: this.autoclaveDone ? this.autoclaveResult : "Not run"
        });

        // BSC
        let bscStatus = "Not tested";
        if (this.bscCertified) bscStatus = "Certified Functional";
        else if (this.bscFailures >= 3) bscStatus = "Decommissioned (HEPA Malfunction)";
        else if (this.bscFailures > 0) bscStatus = `Malfunctioning (Failed Trial ${this.bscFailures})`;
        
        notebook.logQAData('bsc', {
            colonies: this.bscColoniesCount !== null ? this.bscColoniesCount : "Not tested",
            hepa: bscStatus
        });
    }
}

export const qa = new QAModule();
