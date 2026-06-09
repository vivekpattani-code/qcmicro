/* ==========================================================================
   FSSAI Virtual Microbiology Lab - Sterility & Swab Testing Module Logic
   ========================================================================= */

import { audio, showNotification } from '../utils.js?v=1.4';
import { notebook } from '../notebook.js?v=1.4';

class SterilityModule {
    constructor() {
        this.activeMode = 'direct'; // 'direct' or 'swab'

        // Direct Inoculation State (Module 6)
        this.directState = {
            sample: 'saline', // 'saline' or 'eye_drops'
            ftmInoculated: false,
            scdmInoculated: false,
            incubated: false,
            ftmResult: 'Clear (No Growth)',
            scdmResult: 'Clear (No Growth)'
        };

        // Swab State (Module 7)
        this.swabState = {
            treatment: 'control', // 'control', 'ethanol', 'bleach'
            wiped: false,
            plated: false,
            incubated: false,
            colonies: 0,
            cfuCm2: 0
        };

        this.swabCounts = {
            control: 250,
            ethanol: 15,
            bleach: 2
        };
    }

    initDirect() {
        this.currentStep = 1;
        this.activeMode = 'direct';
        
        // Reset Direct State
        this.directState = {
            sample: 'saline',
            ftmInoculated: false,
            scdmInoculated: false,
            incubated: false,
            ftmResult: 'Clear (No Growth)',
            scdmResult: 'Clear (No Growth)'
        };

        const sampleSelect = document.getElementById('sterility-sample');
        if (sampleSelect) sampleSelect.value = 'saline';

        const ctrlDirect = document.getElementById('sterility-ctrl-direct');
        const ctrlSwab = document.getElementById('sterility-ctrl-swab');
        const stageDirect = document.getElementById('sterility-stage-direct');
        const stageSwab = document.getElementById('sterility-stage-swab');

        if (ctrlDirect) ctrlDirect.classList.remove('hidden');
        if (ctrlSwab) ctrlSwab.classList.add('hidden');
        if (stageDirect) stageDirect.classList.remove('hidden');
        if (stageSwab) stageSwab.classList.add('hidden');

        document.getElementById('sterility-hud-status').textContent = "Awaiting sample inoculation and incubation.";

        this.resetDirectTubes();
        this.setupDirectSteps();
        this.syncWithNotebook();
    }

    initSwab() {
        this.currentStep = 1;
        this.activeMode = 'swab';
        
        // Reset Swab State
        this.swabState = {
            treatment: 'control',
            wiped: false,
            plated: false,
            incubated: false,
            colonies: 0,
            cfuCm2: 0
        };

        const treatmentSelect = document.getElementById('swab-treatment');
        if (treatmentSelect) treatmentSelect.value = 'control';

        // Reset buttons
        const btnWipe = document.getElementById('btn-swab-wipe');
        const btnPlate = document.getElementById('btn-swab-plate');
        const btnIncubate = document.getElementById('btn-swab-incubate');
        if (btnWipe) btnWipe.disabled = false;
        if (btnPlate) btnPlate.disabled = true;
        if (btnIncubate) btnIncubate.disabled = true;

        const ctrlDirect = document.getElementById('sterility-ctrl-direct');
        const ctrlSwab = document.getElementById('sterility-ctrl-swab');
        const stageDirect = document.getElementById('sterility-stage-direct');
        const stageSwab = document.getElementById('sterility-stage-swab');

        if (ctrlDirect) ctrlDirect.classList.add('hidden');
        if (ctrlSwab) ctrlSwab.classList.remove('hidden');
        if (stageDirect) stageDirect.classList.add('hidden');
        if (stageSwab) stageSwab.classList.remove('hidden');

        document.getElementById('sterility-hud-status').textContent = "Select surface treatment and perform swab.";

        this.resetSwabPlate();
        this.setupSwabSteps();
        this.syncWithNotebook();
    }

    setupDirectSteps() {
        const steps = [
            { text: "Inoculate FTM & SCDM Tubes", desc: "Select product sample. Inoculate BOTH Fluid Thioglycollate Medium (FTM) and Soybean Casein Digest Medium (SCDM) tubes." },
            { text: "Incubate (14 Days)", desc: "Click the 'Incubate (14 Days)' button to incubate both media and observe growth results." },
            { text: "Verify Sterility Log", desc: "Open the Lab Notebook sidebar, view the direct sterility logs, and verify the direct inoculation results." }
        ];

        const stepsList = document.getElementById('sim-steps-list');
        if (stepsList) {
            stepsList.innerHTML = steps.map((s, idx) => `
                <div class="sim-step ${idx === 0 ? 'active' : ''}" id="m6-step-${idx + 1}">
                    <h5>Step ${idx + 1}: ${s.text} <i class="fa-solid fa-circle-notch sim-step-icon"></i></h5>
                    <p>${s.desc}</p>
                </div>
            `).join('');
        }
        this.updateStepProgress();
    }

    setupSwabSteps() {
        const steps = [
            { text: "Wipe Surface Area", desc: "Select the surface treatment (Control, Ethanol, or Bleach) and click 'Wipe Surface Area (100 cm²)' to collect samples." },
            { text: "Plate & Incubate Swab", desc: "Click 'Plate Swab Sample' to dilute and plate, then click 'Incubate PCA Plate' to observe colonies." },
            { text: "Calculate & Verify Swab Log", desc: "Open the Lab Notebook sidebar, calculate contamination density in CFU/cm², and verify the swab results." }
        ];

        const stepsList = document.getElementById('sim-steps-list');
        if (stepsList) {
            stepsList.innerHTML = steps.map((s, idx) => `
                <div class="sim-step ${idx === 0 ? 'active' : ''}" id="m7-step-${idx + 1}">
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
        
        const stepPrefix = this.activeMode === 'direct' ? 'm6' : 'm7';
        for (let i = 1; i <= 3; i++) {
            const stepEl = document.getElementById(`${stepPrefix}-step-${i}`);
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
            this.updateStepProgress();
            audio.playClick();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepProgress();
            audio.playClick();
        }
    }

    // Direct Sterility Testing logic (Module 6)
    m6_resetSterility() {
        this.directState.ftmInoculated = false;
        this.directState.scdmInoculated = false;
        this.directState.incubated = false;
        this.directState.sample = document.getElementById('sterility-sample').value;
        this.resetDirectTubes();
        this.syncWithNotebook();
        document.getElementById('sterility-hud-status').textContent = "Sample changed. Ready to inoculate.";
    }

    resetDirectTubes() {
        const fGrowth = document.getElementById('growth-ftm');
        const sGrowth = document.getElementById('growth-scdm');
        if (fGrowth) {
            fGrowth.style.background = 'rgba(255, 255, 255, 0.1)';
            fGrowth.style.filter = 'none';
        }
        if (sGrowth) {
            sGrowth.style.background = 'rgba(255, 255, 255, 0.1)';
            sGrowth.style.filter = 'none';
        }
    }

    inoculateDirect(type) {
        audio.playClick();
        if (this.directState.incubated) {
            showNotification("Direct Sterility: Already incubated. Please change sample or reset.", "warning");
            return;
        }

        if (type === 'ftm') {
            this.directState.ftmInoculated = true;
            showNotification("Sample pipetted into Fluid Thioglycollate Medium (FTM) tube.", "success");
            const fGrowth = document.getElementById('growth-ftm');
            if (fGrowth) fGrowth.style.background = 'rgba(255, 255, 255, 0.25)';
        } else {
            this.directState.scdmInoculated = true;
            showNotification("Sample pipetted into Soybean Casein Digest Medium (SCDM) tube.", "success");
            const sGrowth = document.getElementById('growth-scdm');
            if (sGrowth) sGrowth.style.background = 'rgba(255, 255, 255, 0.25)';
        }

        if (this.directState.ftmInoculated && this.directState.scdmInoculated) {
            if (this.currentStep === 1) this.nextStep();
        }
        this.syncWithNotebook();
    }

    incubateDirect() {
        if (!this.directState.ftmInoculated || !this.directState.scdmInoculated) {
            audio.playError();
            showNotification("Direct Sterility: You must inoculate BOTH FTM and SCDM tubes first.", "error");
            return;
        }

        audio.playClick();
        document.getElementById('sterility-hud-status').textContent = "Incubating tubes in FTM (32.5°C) and SCDM (22.5°C)...";
        
        setTimeout(() => {
            this.directState.incubated = true;
            const fGrowth = document.getElementById('growth-ftm');
            const sGrowth = document.getElementById('growth-scdm');

            if (this.directState.sample === 'eye_drops') {
                this.directState.ftmResult = 'Turbid (Growth)';
                this.directState.scdmResult = 'Turbid (Growth)';
                if (fGrowth) {
                    fGrowth.style.background = 'rgba(180, 160, 100, 0.7)';
                    fGrowth.style.filter = 'blur(1px)';
                }
                if (sGrowth) {
                    sGrowth.style.background = 'rgba(180, 160, 100, 0.7)';
                    sGrowth.style.filter = 'blur(1px)';
                }
                document.getElementById('sterility-hud-status').textContent = "Incubation complete: Growth detected (Turbid tubes).";
            } else {
                this.directState.ftmResult = 'Clear (No Growth)';
                this.directState.scdmResult = 'Clear (No Growth)';
                if (fGrowth) {
                    fGrowth.style.background = 'rgba(255, 255, 255, 0.15)';
                    fGrowth.style.filter = 'none';
                }
                if (sGrowth) {
                    sGrowth.style.background = 'rgba(255, 255, 255, 0.15)';
                    sGrowth.style.filter = 'none';
                }
                document.getElementById('sterility-hud-status').textContent = "Incubation complete: Sterile (No growth / Clear) in both FTM and SCDM.";
            }

            if (this.currentStep === 2) this.nextStep();
            this.syncWithNotebook();
        }, 2000);
    }

    // Swab testing logic (Module 7)
    m7_resetSwab() {
        this.swabState.treatment = document.getElementById('swab-treatment').value;
        this.swabState.wiped = false;
        this.swabState.plated = false;
        this.swabState.incubated = false;
        this.swabState.colonies = 0;
        
        // Reset buttons
        document.getElementById('btn-swab-wipe').disabled = false;
        document.getElementById('btn-swab-plate').disabled = true;
        document.getElementById('btn-swab-incubate').disabled = true;

        this.resetSwabPlate();
        this.syncWithNotebook();
        document.getElementById('sterility-hud-status').textContent = "Swab treatment changed. Start wiping.";
    }

    resetSwabPlate() {
        const colonyContainer = document.getElementById('swab-colonies');
        if (colonyContainer) colonyContainer.innerHTML = '';
        
        const plateLabel = document.getElementById('swab-plate-lbl');
        if (plateLabel) plateLabel.textContent = 'PCA Plate (Empty)';
    }

    wipeSwab() {
        audio.playClick();
        this.swabState.wiped = true;
        showNotification("Wiped cotton swab across the 10x10 cm² template surface to collect samples.", "success");
        
        document.getElementById('btn-swab-wipe').disabled = true;
        document.getElementById('btn-swab-plate').disabled = false;
        
        document.getElementById('sterility-hud-status').textContent = "Swab complete. Transfer sample to PCA plate.";
        if (this.currentStep === 1) this.nextStep();
        this.syncWithNotebook();
    }

    plateSwab() {
        if (!this.swabState.wiped) return;
        
        audio.playClick();
        this.swabState.plated = true;
        showNotification("Swab sample diluted in 10 mL and plated 1 mL onto PCA plate.", "success");
        
        const plateLabel = document.getElementById('swab-plate-lbl');
        if (plateLabel) plateLabel.textContent = 'PCA Plate (Inoculated)';
        
        document.getElementById('btn-swab-plate').disabled = true;
        document.getElementById('btn-swab-incubate').disabled = false;
        
        document.getElementById('sterility-hud-status').textContent = "Plating complete. Ready for incubator.";
        this.syncWithNotebook();
    }

    incubateSwab() {
        if (!this.swabState.plated) return;
        
        audio.playClick();
        document.getElementById('sterility-hud-status').textContent = "Incubating PCA Plate at 35°C for 48 hours...";
        
        document.getElementById('btn-swab-incubate').disabled = true;
        
        setTimeout(() => {
            this.swabState.incubated = true;
            
            const rawColonies = this.swabCounts[this.swabState.treatment];
            // Add slight randomness (+/- 5%)
            const varBound = Math.round(rawColonies * 0.05);
            const variance = varBound > 0 ? (Math.floor(Math.random() * (varBound * 2 + 1)) - varBound) : 0;
            this.swabState.colonies = rawColonies + variance;
            
            const plateLabel = document.getElementById('swab-plate-lbl');
            if (plateLabel) {
                plateLabel.textContent = `PCA Plate (${this.swabState.colonies} CFU Detected)`;
            }
            
            this.drawSwabColonies();
            document.getElementById('sterility-hud-status').textContent = `Incubation complete. Read CFU count and log density.`;
            
            if (this.currentStep === 2) this.nextStep();
            this.syncWithNotebook();
        }, 2000);
    }

    drawSwabColonies() {
        const colonyContainer = document.getElementById('swab-colonies');
        if (!colonyContainer) return;
        colonyContainer.innerHTML = '';
        
        const cCount = Math.min(220, this.swabState.colonies); // Visual cap
        const center = 100;
        const radius = 80;
        
        let color = '#fef3c7'; // Cream-colored yeast/bacteria
        
        for (let i = 0; i < cCount; i++) {
            const r = Math.sqrt(Math.random()) * radius;
            const theta = Math.random() * Math.PI * 2;
            const x = center + r * Math.cos(theta);
            const y = center + r * Math.sin(theta);
            
            const colony = document.createElement('div');
            colony.style.position = 'absolute';
            colony.style.left = `${x}px`;
            colony.style.top = `${y}px`;
            colony.style.width = '3px';
            colony.style.height = '3px';
            colony.style.borderRadius = '50%';
            colony.style.background = color;
            colony.style.transform = 'translate(-50%, -50%)';
            colony.style.boxShadow = '0 1px 1.5px rgba(0,0,0,0.3)';
            colonyContainer.appendChild(colony);
        }
    }

    syncWithNotebook() {
        if (this.activeMode === 'direct') {
            const ftmLog = this.directState.ftmInoculated 
                ? (this.directState.incubated ? this.directState.ftmResult : 'Inoculated (Awaiting Incubation)') 
                : 'Not inoculated';
            
            const scdmLog = this.directState.scdmInoculated 
                ? (this.directState.incubated ? this.directState.scdmResult : 'Inoculated (Awaiting Incubation)') 
                : 'Not inoculated';

            notebook.records.m6.ftm = ftmLog;
            notebook.records.m6.scdm = scdmLog;

            const ftmSpan = document.getElementById('note-m6-ftm');
            const scdmSpan = document.getElementById('note-m6-scdm');
            if (ftmSpan) ftmSpan.textContent = ftmLog;
            if (scdmSpan) scdmSpan.textContent = scdmLog;

            notebook.records.m6.verified = false;
            notebook.updateVerificationStatusDisplay(6);
        } else {
            let treatmentText = 'Not tested';
            if (this.swabState.treatment === 'control') treatmentText = 'Untreated Control';
            else if (this.swabState.treatment === 'ethanol') treatmentText = '70% Ethanol';
            else if (this.swabState.treatment === 'bleach') treatmentText = '10% Bleach';

            const countText = this.swabState.incubated ? `${this.swabState.colonies} CFU` : 'Not tested';

            notebook.records.m7.treatment = this.swabState.treatment;
            notebook.records.m7.colonies = this.swabState.incubated ? this.swabState.colonies : null;

            const treatSpan = document.getElementById('note-m7-swab-treatment');
            const countSpan = document.getElementById('note-m7-swab-count');
            if (treatSpan) treatSpan.textContent = treatmentText;
            if (countSpan) countSpan.textContent = countText;

            notebook.records.m7.verified = false;
            notebook.updateVerificationStatusDisplay(7);
        }
        if (window.app) window.app.saveSession();
    }
}

export const sterility = new SterilityModule();
window.sterility = sterility;

// Expose callbacks globally for HTML inline attributes
notebook.m6_resetSterility = () => sterility.m6_resetSterility();
notebook.m6_inoculateDirect = (type) => sterility.inoculateDirect(type);
notebook.m6_incubateDirect = () => sterility.incubateDirect();

notebook.m7_resetSwab = () => sterility.m7_resetSwab();
notebook.m7_wipeSwab = () => sterility.wipeSwab();
notebook.m7_plateSwab = () => sterility.plateSwab();
notebook.m7_incubateSwab = () => sterility.incubateSwab();
