/* ==========================================================================
   FSSAI Virtual Microbiology Lab - Pathogen Identification Module Logic
   ========================================================================== */

import { audio, canvasUtils, showNotification } from '../utils.js?v=1.4';
import { notebook } from '../notebook.js?v=1.4';

class PathogenModule {
    constructor() {
        this.activeSub = 'staph'; // 'staph', 'salm', 'coliform'
        
        // Organism Selections
        this.staphOrganism = 'aureus'; // 'aureus', 'epidermidis'
        this.salmOrganism = 'salmonella'; // 'salmonella', 'ecoli', 'pseudomonas', 'shigella'
        this.coliformSample = 'ecoli'; // 'ecoli', 'enterobacter', 'salmonella'
        
        // Staph Coagulase State
        this.staphHours = 0;
        this.staphTilted = false;
        
        // Salmonella TSI State
        this.tsiInoculated = false;
        this.tsiIncubated = false;
        
        // Coliform State
        this.coliformStage = 1; // 1: VRBA, 2: BGLB, 3: EMB
        this.coliformVrbaCount = 0;
        this.coliformBglbGas = false;
        this.coliformEmbSheen = false;
    }

    init() {
        this.currentStep = 1;
        this.activeSub = 'staph';
        this.staphOrganism = 'aureus';
        this.salmOrganism = 'salmonella';
        this.coliformSample = 'ecoli';
        this.staphHours = 0;
        this.staphTilted = false;
        this.tsiInoculated = false;
        this.tsiIncubated = false;
        this.coliformStage = 1;
        this.coliformVrbaCount = 0;
        this.coliformBglbGas = false;
        this.coliformEmbSheen = false;

        // Reset dropdowns
        const staphSelect = document.getElementById('staph-organism-select');
        const salmSelect = document.getElementById('salm-organism-select');
        const coliformSelect = document.getElementById('coliform-sample-select');

        if (staphSelect) staphSelect.value = 'aureus';
        if (salmSelect) salmSelect.value = 'salmonella';
        if (coliformSelect) coliformSelect.value = 'ecoli';

        // Reset elements
        const coagTube = document.getElementById('coagulase-tube-element');
        const coagFluid = document.getElementById('coagulase-fluid');
        const staphOutcome = document.getElementById('staph-outcome');
        const staphIncTime = document.getElementById('staph-inc-time');
        
        if (coagTube) {
            coagTube.className = "coagulase-tube";
            coagTube.style.transform = "rotate(0deg)";
        }
        if (coagFluid) coagFluid.className = "broth-plasma";
        if (staphOutcome) {
            staphOutcome.textContent = "Result: Unincubated";
            staphOutcome.style.color = "var(--text-title)";
        }
        if (staphIncTime) staphIncTime.textContent = "0 hours";

        const staphLabel = document.querySelector('.coagulase-tube-holder .label');
        if (staphLabel) staphLabel.textContent = "S. aureus + Coagulase Plasma";

        const btnInocTsi = document.getElementById('btn-inoculate-tsi');
        const btnIncTsi = document.getElementById('btn-incubate-tsi');
        
        if (btnInocTsi) {
            btnInocTsi.disabled = false;
            btnInocTsi.textContent = "Stab Butt and Streak Slant";
        }
        if (btnIncTsi) btnIncTsi.disabled = true;

        this.resetTsiVisuals();
        this.resetColiformUI();
        this.bindEvents();
        this.switchSubTab('staph');
        this.setupSteps();
        this.syncNotebook();
    }

    bindEvents() {
        // Sub tabs
        const subTabs = document.querySelectorAll('.pathogen-sub-tab');
        subTabs.forEach(tab => {
            tab.onclick = (e) => {
                const subName = e.target.getAttribute('data-sub');
                this.switchSubTab(subName);
                audio.playClick();
            };
        });

        // Organism dropdown change listeners
        const staphSelect = document.getElementById('staph-organism-select');
        if (staphSelect) {
            staphSelect.onchange = (e) => {
                this.staphOrganism = e.target.value;
                this.staphHours = 0;
                this.staphTilted = false;
                
                const outcome = document.getElementById('staph-outcome');
                const staphIncTime = document.getElementById('staph-inc-time');
                if (outcome) {
                    outcome.textContent = "Result: Unincubated";
                    outcome.style.color = "var(--text-title)";
                }
                if (staphIncTime) staphIncTime.textContent = "0 hours";
                
                const coagTube = document.getElementById('coagulase-tube-element');
                if (coagTube) {
                    coagTube.style.transform = "rotate(0deg)";
                    coagTube.classList.remove('tilted');
                }
                
                const staphLabel = document.querySelector('.coagulase-tube-holder .label');
                if (staphLabel) {
                    staphLabel.textContent = this.staphOrganism === 'aureus' ? 
                        "S. aureus + Coagulase Plasma" : 
                        "S. epidermidis + Coagulase Plasma";
                }
                
                audio.playClick();
                this.updateCoagulaseFluid();
                this.syncNotebook();
            };
        }

        const salmSelect = document.getElementById('salm-organism-select');
        if (salmSelect) {
            salmSelect.onchange = (e) => {
                this.salmOrganism = e.target.value;
                this.tsiInoculated = false;
                this.tsiIncubated = false;
                
                const btnInocTsi = document.getElementById('btn-inoculate-tsi');
                const btnIncTsi = document.getElementById('btn-incubate-tsi');
                if (btnInocTsi) {
                    btnInocTsi.disabled = false;
                    btnInocTsi.textContent = "Stab Butt and Streak Slant";
                }
                if (btnIncTsi) btnIncTsi.disabled = true;
                
                this.resetTsiVisuals();
                audio.playClick();
                this.syncNotebook();
            };
        }

        const coliformSelect = document.getElementById('coliform-sample-select');
        if (coliformSelect) {
            coliformSelect.onchange = (e) => {
                this.coliformSample = e.target.value;
                this.resetColiformUI();
                audio.playClick();
                this.drawColiformStage();
                this.syncNotebook();
            };
        }

        // 1. Staphylococcus events
        const btnIncStaph = document.getElementById('btn-incubate-staph');
        const btnTiltStaph = document.getElementById('btn-tilt-tube');

        if (btnIncStaph) {
            btnIncStaph.onclick = () => {
                if (this.staphHours < 6) {
                    this.staphHours++;
                    document.getElementById('staph-inc-time').textContent = `${this.staphHours} hours`;
                    audio.playClick();
                    
                    const outcome = document.getElementById('staph-outcome');
                    if (this.staphOrganism === 'aureus') {
                        if (this.staphHours >= 4) {
                            outcome.textContent = "Result: Coagulase Clotted (S. aureus positive)";
                            outcome.style.color = "var(--color-green)";
                        } else {
                            outcome.textContent = "Result: Liquid/Unclotted";
                            outcome.style.color = "var(--color-yellow)";
                        }
                    } else {
                        // S. epidermidis (Coag negative)
                        outcome.textContent = "Result: Liquid/Unclotted (S. epidermidis negative)";
                        outcome.style.color = "var(--color-yellow)";
                    }
                    this.updateCoagulaseFluid();
                    this.syncNotebook();
                }
            };
        }

        // Coagulase tube drag-to-tilt interaction
        const coagTube = document.getElementById('coagulase-tube-element');
        if (coagTube) {
            let isTilting = false;
            let startDragX = 0;
            
            coagTube.style.cursor = "grab";
            
            coagTube.onmousedown = (e) => {
                isTilting = true;
                startDragX = e.clientX;
                coagTube.style.cursor = "grabbing";
                e.preventDefault();
            };
            
            window.addEventListener('mousemove', (e) => {
                if (!isTilting) return;
                const dx = e.clientX - startDragX;
                let rot = Math.min(80, Math.max(0, dx * 0.8)); // Limit 0 to 80 deg
                
                coagTube.style.transform = `rotate(${rot}deg)`;
                
                const wasTilted = this.staphTilted;
                this.staphTilted = (rot > 40);
                
                if (wasTilted !== this.staphTilted) {
                    audio.playClick();
                    this.updateCoagulaseFluid();
                    this.syncNotebook();
                }
            });
            
            window.addEventListener('mouseup', () => {
                if (isTilting) {
                    isTilting = false;
                    coagTube.style.cursor = "grab";
                    
                    if (this.staphTilted) {
                        coagTube.style.transform = "rotate(75deg)";
                        coagTube.classList.add('tilted');
                    } else {
                        coagTube.style.transform = "rotate(0deg)";
                        coagTube.classList.remove('tilted');
                    }
                    this.updateCoagulaseFluid();
                }
            });
        }

        // Toggle button fallback
        if (btnTiltStaph) {
            btnTiltStaph.onclick = () => {
                this.staphTilted = !this.staphTilted;
                const tube = document.getElementById('coagulase-tube-element');
                if (tube) {
                    if (this.staphTilted) {
                        tube.style.transform = "rotate(75deg)";
                        tube.classList.add('tilted');
                    } else {
                        tube.style.transform = "rotate(0deg)";
                        tube.classList.remove('tilted');
                    }
                }
                audio.playClick();
                this.updateCoagulaseFluid();
                this.syncNotebook();
            };
        }

        // 2. Salmonella TSI events
        const btnInocTsi = document.getElementById('btn-inoculate-tsi');
        const btnIncTsi = document.getElementById('btn-incubate-tsi');

        if (btnInocTsi) {
            btnInocTsi.onclick = () => {
                this.tsiInoculated = true;
                btnInocTsi.disabled = true;
                btnInocTsi.textContent = "Inoculated";
                if (btnIncTsi) btnIncTsi.disabled = false;
                audio.playClick();
            };
        }

        if (btnIncTsi) {
            btnIncTsi.onclick = () => {
                this.tsiIncubated = true;
                btnIncTsi.disabled = true;
                audio.playSuccess();
                this.triggerTsiReaction();
                this.syncNotebook();
            };
        }

        // 3. Coliform events
        const btnColAction = document.getElementById('btn-coliform-action');
        const btnColNext = document.getElementById('btn-coliform-next');

        if (btnColAction) {
            btnColAction.onclick = () => {
                this.runColiformAction();
            };
        }

        if (btnColNext) {
            btnColNext.onclick = () => {
                this.advanceColiformStage();
            };
        }
    }

    switchSubTab(subName) {
        this.activeSub = subName;
        
        // Sync currentStep with active sub tab
        if (subName === 'staph') this.currentStep = 1;
        else if (subName === 'salm') this.currentStep = 2;
        else if (subName === 'coliform') this.currentStep = 3;
        
        // Toggle sub-tabs classes
        document.querySelectorAll('.pathogen-sub-tab').forEach(tab => {
            if (tab.getAttribute('data-sub') === subName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Toggle sub-viewport containers
        document.getElementById('sub-pathogen-staph').classList.add('hidden');
        document.getElementById('sub-pathogen-salm').classList.add('hidden');
        document.getElementById('sub-pathogen-coliform').classList.add('hidden');

        document.getElementById(`sub-pathogen-${subName}`).classList.remove('hidden');

        // Draw if coliform is selected
        if (subName === 'coliform') {
            this.drawColiformStage();
        }
        
        this.updateStepProgress();
    }

    setupSteps() {
        const steps = [
            { text: "Staphylococcus aureus (Coagulase)", desc: "Select target organism. Click 'Incubate 1h' repeatedly (up to 4+ hrs) to check for plasma clotting. Drag the tube to tilt it and observe outcomes." },
            { text: "Salmonella spp. (TSI Reactions)", desc: "Select organism. Click 'Stab Butt and Streak Slant', then 'Incubate (24 hrs)' to analyze sugar fermentation, gas production, and H₂S blackening." },
            { text: "Coliform Testing Hierarchy", desc: "Select sample source. Run presumptive VRBA (count red colonies), confirm in BGLB broth (check gas), and complete on EMB agar (check green metallic sheen)." }
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
        
        if (progressBar) progressBar.style.width = `${(this.currentStep / 3) * 100}%`;
        if (progressText) progressText.textContent = `Step ${this.currentStep} of 3`;
        
        if (btnPrev) btnPrev.disabled = (this.currentStep === 1);
        if (btnNext) btnNext.disabled = (this.currentStep === 3);
        
        for (let i = 1; i <= 3; i++) {
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
        if (this.currentStep < 3) {
            this.currentStep++;
            const subs = ['staph', 'salm', 'coliform'];
            this.switchSubTab(subs[this.currentStep - 1]);
            audio.playClick();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            const subs = ['staph', 'salm', 'coliform'];
            this.switchSubTab(subs[this.currentStep - 1]);
            audio.playClick();
        }
    }

    updateCoagulaseFluid() {
        const fluid = document.getElementById('coagulase-fluid');
        if (!fluid) return;

        fluid.className = "broth-plasma";
        
        if (this.staphTilted) {
            if (this.staphOrganism === 'aureus' && this.staphHours >= 4) {
                // Firm clot
                fluid.classList.add('clotted-firm');
            } else {
                // Liquid runs
                fluid.classList.add('liquid-running');
            }
        }
    }

    resetTsiVisuals() {
        const slant = document.getElementById('tsi-agar-slant');
        const butt = document.getElementById('tsi-agar-butt');
        const gas = document.getElementById('tsi-gas-bubbles');
        const h2s = document.getElementById('tsi-h2s-blackening');
        
        if (slant) slant.style.backgroundColor = "#d84315"; // Phenol Red Neutral (Red-Orange)
        if (butt) butt.style.backgroundColor = "#d84315";   // Phenol Red Neutral (Red-Orange)
        if (gas) gas.style.display = "none";
        if (h2s) h2s.style.opacity = "0";

        // Readouts
        document.getElementById('readout-slant').textContent = "Uninoculated";
        document.getElementById('readout-slant').style.color = "var(--text-title)";
        document.getElementById('readout-butt').textContent = "Uninoculated";
        document.getElementById('readout-butt').style.color = "var(--text-title)";
        document.getElementById('readout-gas').textContent = "None";
        document.getElementById('readout-gas').style.color = "var(--text-title)";
        document.getElementById('readout-h2s').textContent = "None";
        document.getElementById('readout-h2s').style.color = "var(--text-title)";
    }

    triggerTsiReaction() {
        const slant = document.getElementById('tsi-agar-slant');
        const butt = document.getElementById('tsi-agar-butt');
        const gas = document.getElementById('tsi-gas-bubbles');
        const h2s = document.getElementById('tsi-h2s-blackening');

        if (this.salmOrganism === 'salmonella') {
            // Salmonella enterica: K/A (Alkaline slant / Acid butt), Gas+, H2S+
            if (slant) slant.style.backgroundColor = "#e91e63"; // Alkaline Reversion (Bright Pink/Magenta - K)
            if (butt) butt.style.backgroundColor = "#ffd600";   // Turns Yellow (Acid - A)
            if (gas) gas.style.display = "block";                // Splits agar
            if (h2s) h2s.style.opacity = "1";                    // Blackens the butt

            document.getElementById('readout-slant').textContent = "Pink (Alkaline - K)";
            document.getElementById('readout-slant').style.color = "var(--color-red)";
            
            document.getElementById('readout-butt').textContent = "Yellow/Black (Acid butt - A)";
            document.getElementById('readout-butt').style.color = "var(--color-yellow)";
            
            document.getElementById('readout-gas').textContent = "Positive (Bubbles/Cracks)";
            document.getElementById('readout-gas').style.color = "var(--color-green)";
            
            document.getElementById('readout-h2s').textContent = "Positive (Precipitate)";
            document.getElementById('readout-h2s').style.color = "var(--color-green)";
        }
        else if (this.salmOrganism === 'ecoli') {
            // E. coli: A/A (Acid slant / Acid butt), Gas+, H2S-
            if (slant) slant.style.backgroundColor = "#ffd600"; // Acid slant (Yellow - A)
            if (butt) butt.style.backgroundColor = "#ffd600";   // Acid butt (Yellow - A)
            if (gas) gas.style.display = "block";                // Gas cracks
            if (h2s) h2s.style.opacity = "0";                    // No blackening

            document.getElementById('readout-slant').textContent = "Yellow (Acid - A)";
            document.getElementById('readout-slant').style.color = "var(--color-yellow)";
            
            document.getElementById('readout-butt').textContent = "Yellow (Acid butt - A)";
            document.getElementById('readout-butt').style.color = "var(--color-yellow)";
            
            document.getElementById('readout-gas').textContent = "Positive (Bubbles/Cracks)";
            document.getElementById('readout-gas').style.color = "var(--color-green)";
            
            document.getElementById('readout-h2s').textContent = "Negative";
            document.getElementById('readout-h2s').style.color = "var(--text-muted)";
        }
        else if (this.salmOrganism === 'pseudomonas') {
            // Pseudomonas: K/K (Alkaline slant / Alkaline butt), Gas-, H2S-
            if (slant) slant.style.backgroundColor = "#e91e63"; // Alkaline slant (Pink - K)
            if (butt) butt.style.backgroundColor = "#e91e63";   // Alkaline butt (Pink - K)
            if (gas) gas.style.display = "none";
            if (h2s) h2s.style.opacity = "0";

            document.getElementById('readout-slant').textContent = "Pink (Alkaline - K)";
            document.getElementById('readout-slant').style.color = "var(--color-red)";
            
            document.getElementById('readout-butt').textContent = "Pink (Alkaline butt - K)";
            document.getElementById('readout-butt').style.color = "var(--color-red)";
            
            document.getElementById('readout-gas').textContent = "Negative";
            document.getElementById('readout-gas').style.color = "var(--text-muted)";
            
            document.getElementById('readout-h2s').textContent = "Negative";
            document.getElementById('readout-h2s').style.color = "var(--text-muted)";
        }
        else if (this.salmOrganism === 'shigella') {
            // Shigella: K/A (Alkaline slant / Acid butt), Gas-, H2S-
            if (slant) slant.style.backgroundColor = "#e91e63"; // Alkaline slant (Pink - K)
            if (butt) butt.style.backgroundColor = "#ffd600";   // Acid butt (Yellow - A)
            if (gas) gas.style.display = "none";
            if (h2s) h2s.style.opacity = "0";

            document.getElementById('readout-slant').textContent = "Pink (Alkaline - K)";
            document.getElementById('readout-slant').style.color = "var(--color-red)";
            
            document.getElementById('readout-butt').textContent = "Yellow (Acid butt - A)";
            document.getElementById('readout-butt').style.color = "var(--color-yellow)";
            
            document.getElementById('readout-gas').textContent = "Negative";
            document.getElementById('readout-gas').style.color = "var(--text-muted)";
            
            document.getElementById('readout-h2s').textContent = "Negative";
            document.getElementById('readout-h2s').style.color = "var(--text-muted)";
        }
    }

    resetColiformUI() {
        this.coliformStage = 1;
        this.coliformVrbaCount = 0;
        this.coliformBglbGas = false;
        this.coliformEmbSheen = false;
        
        const bglbBox = document.getElementById('bglb-durham-container');
        if (bglbBox) bglbBox.classList.add('hidden');
        
        const canvas = document.getElementById('coliform-canvas');
        if (canvas) canvas.classList.remove('hidden');

        document.getElementById('col-flow-1').className = "flow-step active-step";
        document.getElementById('col-flow-2').className = "flow-step inactive";
        document.getElementById('col-flow-3').className = "flow-step inactive";

        document.getElementById('coliform-stage-title').textContent = "Presumptive Test (VRBA)";
        document.getElementById('coliform-stage-desc').textContent = "Examine VRBA plates for characteristic coliform colonies (dark red, 0.5 mm or larger, surrounded by a zone of precipitated bile acids).";
        
        const btnAction = document.getElementById('btn-coliform-action');
        const btnNext = document.getElementById('btn-coliform-next');
        
        if (btnAction) {
            btnAction.textContent = "Count Red Colonies";
            btnAction.disabled = false;
        }
        if (btnNext) {
            btnNext.textContent = "Proceed to Confirmed Test";
            btnNext.disabled = true;
            btnNext.style.display = "inline-block";
        }
    }

    runColiformAction() {
        const btnAction = document.getElementById('btn-coliform-action');
        const btnNext = document.getElementById('btn-coliform-next');
        audio.playClick();

        if (this.coliformStage === 1) {
            // Count red colonies
            if (this.coliformSample === 'ecoli') {
                this.coliformVrbaCount = 28;
                showNotification(`Colonies counted: ${this.coliformVrbaCount} dark red colonies with precipitated bile halos on Violet Red Bile Agar (VRBA), indicating presumptive coliforms.`, "success");
            } else if (this.coliformSample === 'enterobacter') {
                this.coliformVrbaCount = 35;
                showNotification(`Colonies counted: ${this.coliformVrbaCount} reddish-pink colonies without distinct bile halos on Violet Red Bile Agar (VRBA).`, "success");
            } else {
                // Salmonella
                this.coliformVrbaCount = 0;
                showNotification("Colonies counted: 0 coliform-like colonies (only colorless/transparent colonies observed, non-lactose fermenters are inhibited on VRBA).", "warning");
            }
            
            btnAction.disabled = true;
            btnAction.textContent = "Colonies Logged";
            if (btnNext) btnNext.disabled = false;
            
            this.syncNotebook();
        } 
        else if (this.coliformStage === 2) {
            // Incubate BGLB broth
            if (this.coliformSample === 'ecoli' || this.coliformSample === 'enterobacter') {
                this.coliformBglbGas = true;
                const bubble = document.getElementById('bglb-bubble');
                if (bubble) {
                    bubble.style.height = "25px";
                }
                audio.playSuccess();
                showNotification("Lactose fermentation check: Gas production observed in Durham tube within 48 hours of incubation in 2% BGLB broth (confirmed coliform).", "success");
            } else {
                this.coliformBglbGas = false;
                const bubble = document.getElementById('bglb-bubble');
                if (bubble) {
                    bubble.style.height = "0px";
                }
                audio.playClick();
                showNotification("Lactose fermentation check: No gas production observed in BGLB broth (negative for coliforms).", "warning");
            }
            
            btnAction.disabled = true;
            btnAction.textContent = "Gas Check Complete";
            if (btnNext) btnNext.disabled = false;
            
            this.syncNotebook();
        } 
        else if (this.coliformStage === 3) {
            // Record EMB sheen
            if (this.coliformSample === 'ecoli') {
                this.coliformEmbSheen = true;
                audio.playSuccess();
                showNotification("Completed Test: Streak on Eosine Methylene Blue (EMB) agar displays characteristic metallic green sheen with dark centers, confirming E. coli.", "success");
            } else if (this.coliformSample === 'enterobacter') {
                this.coliformEmbSheen = false;
                audio.playClick();
                showNotification("Completed Test: Streak on Eosine Methylene Blue (EMB) agar shows pinkish-purple mucoid colonies without a metallic green sheen (confirms Enterobacter, E. coli negative).", "warning");
            } else {
                // Salmonella
                this.coliformEmbSheen = false;
                audio.playClick();
                showNotification("Completed Test: Streak on EMB agar displays colorless, translucent colonies (non-lactose fermenter, negative for coliforms).", "warning");
            }
            
            btnAction.disabled = true;
            btnAction.textContent = "EMB Test Recorded";
            
            this.syncNotebook();
        }
    }

    advanceColiformStage() {
        if (this.coliformStage === 1) {
            this.coliformStage = 2;
            audio.playClick();
            
            document.getElementById('col-flow-1').className = "flow-step completed";
            document.getElementById('col-flow-2').className = "flow-step active-step";
            
            document.getElementById('coliform-stage-title').textContent = "Confirmed Test (BGLB)";
            document.getElementById('coliform-stage-desc').textContent = "Transfer colonies from VRBA into 2% Brilliant Green Lactose Bile (BGLB) broth containing an inverted Durham tube. Incubate at 35°C.";
            
            const btnAction = document.getElementById('btn-coliform-action');
            const btnNext = document.getElementById('btn-coliform-next');
            
            if (btnAction) {
                btnAction.textContent = "Run Lactose Fermentation Check";
                btnAction.disabled = false;
            }
            if (btnNext) {
                btnNext.textContent = "Proceed to Completed Test";
                btnNext.disabled = true;
            }
            
            this.drawColiformStage();
        } 
        else if (this.coliformStage === 2) {
            this.coliformStage = 3;
            audio.playClick();
            
            document.getElementById('col-flow-2').className = "flow-step completed";
            document.getElementById('col-flow-3').className = "flow-step active-step";
            
            document.getElementById('coliform-stage-title').textContent = "Completed Test (EMB)";
            document.getElementById('coliform-stage-desc').textContent = "Streak BGLB gas-positive cultures onto Eosine Methylene Blue (EMB) agar. Incubate at 35°C for 24h. Examine for E.coli metallic green sheen.";
            
            const btnAction = document.getElementById('btn-coliform-action');
            const btnNext = document.getElementById('btn-coliform-next');
            
            if (btnAction) {
                btnAction.textContent = "Record EMB Agar Colony Morphology";
                btnAction.disabled = false;
            }
            if (btnNext) {
                btnNext.style.display = "none"; // Final step
            }
            
            this.drawColiformStage();
        }
    }

    drawColiformStage() {
        const canvas = document.getElementById('coliform-canvas');
        const durhamBox = document.getElementById('bglb-durham-container');
        
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.coliformStage === 1) {
            // Draw VRBA plate
            canvas.classList.remove('hidden');
            if (durhamBox) durhamBox.classList.add('hidden');
            
            // Draw red agar circle
            ctx.fillStyle = '#9c1034';
            ctx.beginPath();
            ctx.arc(80, 80, 70, 0, Math.PI*2);
            ctx.fill();
            
            // Draw colonies based on sample
            if (this.coliformSample === 'ecoli') {
                // Red colonies with halos
                for (let i = 0; i < 28; i++) {
                    const theta = i * 2.3;
                    const r = 10 + (i * 1.9) % 55;
                    const x = 80 + r * Math.cos(theta);
                    const y = 80 + r * Math.sin(theta);
                    canvasUtils.drawColony(ctx, x, y, 2.5, 'red_bile', '#ff1744');
                }
            } else if (this.coliformSample === 'enterobacter') {
                // Red/pink colonies without halos
                for (let i = 0; i < 35; i++) {
                    const theta = i * 1.8;
                    const r = 10 + (i * 1.6) % 55;
                    const x = 80 + r * Math.cos(theta);
                    const y = 80 + r * Math.sin(theta);
                    canvasUtils.drawColony(ctx, x, y, 2.5, 'standard', '#ff5252');
                }
            } else {
                // Salmonella - colorless/transparent
                for (let i = 0; i < 18; i++) {
                    const theta = i * 2.7;
                    const r = 10 + (i * 2.1) % 55;
                    const x = 80 + r * Math.cos(theta);
                    const y = 80 + r * Math.sin(theta);
                    canvasUtils.drawColony(ctx, x, y, 2.5, 'standard', 'rgba(255, 255, 255, 0.45)');
                }
            }
        } 
        else if (this.coliformStage === 2) {
            // Draw BGLB Durham Tube
            canvas.classList.add('hidden');
            if (durhamBox) {
                durhamBox.classList.remove('hidden');
                const bubble = document.getElementById('bglb-bubble');
                if (bubble) bubble.style.height = this.coliformBglbGas ? "25px" : "0px";
            }
        } 
        else if (this.coliformStage === 3) {
            // Draw EMB Plate
            canvas.classList.remove('hidden');
            if (durhamBox) durhamBox.classList.add('hidden');
            
            // Draw dark purple agar circle
            ctx.fillStyle = '#21102e';
            ctx.beginPath();
            ctx.arc(80, 80, 70, 0, Math.PI*2);
            ctx.fill();
            
            if (this.coliformSample === 'ecoli') {
                // Green metallic sheen streaks
                for (let s = 0; s < 4; s++) {
                    const startX = 30 + s * 10;
                    const startY = 40 + s * 15;
                    for (let i = 0; i < 15; i++) {
                        const x = startX + i * 6;
                        const y = startY + Math.sin(i * 0.8) * 8;
                        canvasUtils.drawColony(ctx, x, y, 3, 'green_sheen', '#00e676');
                    }
                }
            } else if (this.coliformSample === 'enterobacter') {
                // Pinkish-purple mucoid streaks
                for (let s = 0; s < 4; s++) {
                    const startX = 30 + s * 10;
                    const startY = 40 + s * 15;
                    for (let i = 0; i < 15; i++) {
                        const x = startX + i * 6;
                        const y = startY + Math.sin(i * 0.8) * 8;
                        canvasUtils.drawColony(ctx, x, y, 3, 'standard', '#e040fb');
                    }
                }
            } else {
                // Salmonella - colorless/transparent streaks
                for (let s = 0; s < 4; s++) {
                    const startX = 30 + s * 10;
                    const startY = 40 + s * 15;
                    for (let i = 0; i < 15; i++) {
                        const x = startX + i * 6;
                        const y = startY + Math.sin(i * 0.8) * 8;
                        canvasUtils.drawColony(ctx, x, y, 2.5, 'standard', 'rgba(255, 255, 255, 0.25)');
                    }
                }
            }
        }
    }

    syncNotebook() {
        // Log coagulase status
        let coagStatus = "Not tested";
        if (this.staphHours > 0) {
            if (this.staphOrganism === 'aureus') {
                coagStatus = this.staphHours >= 4 ? "Firm Clot (Positive)" : "Liquid/Unclotted (Negative)";
            } else {
                coagStatus = "Liquid/Unclotted (Negative)";
            }
        }
        notebook.logPathogenData('coagulase', coagStatus);

        // Log TSI reaction
        if (this.tsiIncubated) {
            let tsiProfile = {
                color: "K/A (Alkaline/Acid)",
                gas: "Positive"
            };
            if (this.salmOrganism === 'ecoli') {
                tsiProfile = {
                    color: "A/A (Acid/Acid)",
                    gas: "Positive"
                };
            } else if (this.salmOrganism === 'pseudomonas') {
                tsiProfile = {
                    color: "K/K (Alkaline/Alkaline)",
                    gas: "Negative"
                };
            } else if (this.salmOrganism === 'shigella') {
                tsiProfile = {
                    color: "K/A (Alkaline/Acid)",
                    gas: "Negative"
                };
            }
            notebook.logPathogenData('tsi', tsiProfile);
        } else {
            notebook.logPathogenData('tsi', { color: "K/A not run", gas: "Not run" });
        }

        // Log coliforms
        let vrbaLog = "Uncounted";
        if (this.coliformVrbaCount > 0 || this.coliformStage > 1) {
            vrbaLog = this.coliformVrbaCount;
        }
        
        let embLog = "Unverified";
        if (this.coliformStage === 3 && this.coliformEmbSheen) {
            if (this.coliformSample === 'ecoli') {
                embLog = "Metallic Green Sheen (Positive E.coli)";
            } else if (this.coliformSample === 'enterobacter') {
                embLog = "Pinkish-Purple Mucoid (Negative E.coli)";
            } else {
                embLog = "Colorless Colonies (Negative Coliform)";
            }
        }
        
        notebook.logPathogenData('coliform', {
            vrba: vrbaLog,
            emb: embLog
        });
    }
}

export const pathogen = new PathogenModule();
