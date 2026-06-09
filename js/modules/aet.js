/* ==========================================================================
   FSSAI Virtual Microbiology Lab - Antimicrobial Effectiveness Testing (AET)
   ========================================================================= */

import { audio, showNotification } from '../utils.js?v=1.4';
import { notebook } from '../notebook.js?v=1.4';

class AETModule {
    constructor() {
        this.selectedPreservative = 'bac';
        this.selectedOrganism = 'saureus';
        this.selectedNeutralizer = '';
        this.activeDay = 0;

        this.assayRun = false;
        this.platesData = {
            saureus: {
                0: { colonies: 120, dilution: '10^-4', dilutionFactor: 10000, cfu: 1200000, label: 'PCA Plate (10⁻⁴ Dilution)' },
                7: { colonies: 90, dilution: '10^-1', dilutionFactor: 10, cfu: 900, label: 'PCA Plate (10⁻¹ Dilution)' },
                14: { colonies: 60, dilution: '10^0', dilutionFactor: 1, cfu: 60, label: 'PCA Plate (Undiluted)' },
                28: { colonies: 0, dilution: '10^0', dilutionFactor: 1, cfu: 0, label: 'PCA Plate (Undiluted)' }
            },
            calbicans: {
                0: { colonies: 150, dilution: '10^-4', dilutionFactor: 10000, cfu: 1500000, label: 'SDA Plate (10⁻⁴ Dilution)' },
                7: { colonies: 110, dilution: '10^-4', dilutionFactor: 10000, cfu: 1100000, label: 'SDA Plate (10⁻⁴ Dilution)' },
                14: { colonies: 75, dilution: '10^-3', dilutionFactor: 1000, cfu: 75000, label: 'SDA Plate (10⁻³ Dilution)' },
                28: { colonies: 45, dilution: '10^-2', dilutionFactor: 100, cfu: 4500, label: 'SDA Plate (10⁻² Dilution)' }
            }
        };
    }

    init() {
        this.currentStep = 1;
        this.selectedPreservative = 'bac';
        this.selectedOrganism = 'saureus';
        this.selectedNeutralizer = '';
        this.activeDay = 0;
        this.assayRun = false;

        // Reset UI values
        document.getElementById('aet-preservative').value = 'bac';
        document.getElementById('aet-organism').value = 'saureus';
        document.getElementById('aet-neutralizer').value = '';
        
        this.updateDayButtons();
        this.resetPlate();
        this.setupSteps();
        this.syncWithNotebook();
        this.bindEvents();
    }

    bindEvents() {
        // Dropdown elements
        const presSelect = document.getElementById('aet-preservative');
        const orgSelect = document.getElementById('aet-organism');
        const neutSelect = document.getElementById('aet-neutralizer');

        if (presSelect) {
            presSelect.onchange = (e) => {
                this.selectedPreservative = e.target.value;
                this.resetAET();
            };
        }
        if (orgSelect) {
            orgSelect.onchange = (e) => {
                this.selectedOrganism = e.target.value;
                this.resetAET();
            };
        }
        if (neutSelect) {
            neutSelect.onchange = (e) => {
                this.selectedNeutralizer = e.target.value;
                this.updateNeutralizer();
            };
        }
    }

    resetAET() {
        this.assayRun = false;
        this.resetPlate();
        this.syncWithNotebook();
        
        const statusTxt = document.getElementById('aet-status-txt');
        if (statusTxt) {
            statusTxt.textContent = "Ready for Inoculation";
            statusTxt.style.color = "var(--color-cyan)";
        }
    }

    updateNeutralizer() {
        this.selectedNeutralizer = document.getElementById('aet-neutralizer').value;
        this.resetAET();
    }

    selectDay(day) {
        audio.playClick();
        this.activeDay = day;
        this.updateDayButtons();
        if (this.assayRun) {
            this.renderColonies();
        } else {
            this.resetPlate();
        }
    }

    updateDayButtons() {
        const days = [0, 7, 14, 28];
        days.forEach(d => {
            const btn = document.getElementById(`btn-day-${d}`);
            if (btn) {
                if (d === this.activeDay) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
    }

    runAssay() {
        if (!this.selectedNeutralizer) {
            audio.playError();
            showNotification("AET Error: You must select a Preservative Neutralizer before plating.", "error");
            return;
        }

        audio.playSuccess();
        this.assayRun = true;
        
        const statusTxt = document.getElementById('aet-status-txt');
        if (statusTxt) {
            if (this.selectedNeutralizer === 'lec_poly') {
                statusTxt.textContent = `Plated Day ${this.activeDay} - Neutralization successful.`;
                statusTxt.style.color = "var(--color-green)";
            } else {
                statusTxt.textContent = `Plated Day ${this.activeDay} - Neutralizer failed. Preservative killed cells during transfer.`;
                statusTxt.style.color = "var(--color-red)";
            }
        }

        this.renderColonies();
        this.syncWithNotebook();
        showNotification(`Inoculated and plated challenge suspension for Day ${this.activeDay}.`, "success");
    }

    resetPlate() {
        const colonyContainer = document.getElementById('aet-colonies');
        if (colonyContainer) colonyContainer.innerHTML = '';
        
        const plateLabel = document.getElementById('aet-plate-label');
        if (plateLabel) plateLabel.textContent = 'Petri Dish (Empty)';
    }

    renderColonies() {
        const colonyContainer = document.getElementById('aet-colonies');
        const plateLabel = document.getElementById('aet-plate-label');
        if (!colonyContainer) return;

        colonyContainer.innerHTML = '';

        if (!this.assayRun) {
            this.resetPlate();
            return;
        }

        // If neutralizer is incorrect, 0 colonies grow (experimental error)
        if (this.selectedNeutralizer !== 'lec_poly') {
            plateLabel.textContent = this.selectedOrganism === 'saureus' ? 'PCA Plate - No Growth' : 'SDA Plate - No Growth';
            return;
        }

        const data = this.platesData[this.selectedOrganism][this.activeDay];
        plateLabel.textContent = data.label;

        // Render colonies as small circular elements
        const count = data.colonies;
        const color = this.selectedOrganism === 'saureus' ? '#ffe082' : '#f5f5f5'; // Yellowish for Staph, white for yeast
        const radius = this.selectedOrganism === 'saureus' ? '2.5px' : '4px'; // Staph is smaller than yeast
        
        // Generate pseudo-random placements within a circle of radius 65px (center is 80, 80)
        for (let i = 0; i < count; i++) {
            // Use simple LCG pseudo-random distribution
            const theta = i * 137.5 * (Math.PI / 180); // golden angle
            const r = Math.sqrt(i / count) * 65; // spread evenly
            
            const x = 80 + r * Math.cos(theta);
            const y = 80 + r * Math.sin(theta);
            
            const colony = document.createElement('div');
            colony.style.position = 'absolute';
            colony.style.left = `${x}px`;
            colony.style.top = `${y}px`;
            colony.style.width = radius;
            colony.style.height = radius;
            colony.style.borderRadius = '50%';
            colony.style.background = color;
            colony.style.transform = 'translate(-50%, -50%)';
            colony.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3)';
            colonyContainer.appendChild(colony);
        }
    }

    syncWithNotebook() {
        const organismText = this.selectedOrganism === 'saureus' ? 'Staph. aureus' : 'Candida albicans';
        let neutralizerText = 'Not selected';
        if (this.selectedNeutralizer === 'lec_poly') neutralizerText = 'Lecithin + Polysorbate 80';
        else if (this.selectedNeutralizer === 'thiosulfate') neutralizerText = 'Sodium Thiosulfate';
        else if (this.selectedNeutralizer === 'pbs') neutralizerText = 'PBS (None)';

        // Log parameters to notebook
        notebook.records.m5.organism = organismText;
        notebook.records.m5.neutralizer = neutralizerText;

        const organismSpan = document.getElementById('note-m5-organism');
        const neutralizerSpan = document.getElementById('note-m5-neutralizer');

        if (organismSpan) organismSpan.textContent = organismText;
        if (neutralizerSpan) neutralizerSpan.textContent = neutralizerText;

        notebook.records.m5.verified = false;
        notebook.updateVerificationStatusDisplay(5);
        if (window.app) window.app.saveSession();
    }

    setupSteps() {
        const steps = [
            { text: "Configure Preservative & Organism", desc: "Select BAC preservative and choose the target test organism (Staphylococcus aureus or Candida albicans)." },
            { text: "Select Preservative Neutralizer", desc: "Under USP <51> rules, select the correct chemical neutralizer (Lecithin + Polysorbate 80) to stop preservative action during sampling." },
            { text: "Plate Challenge Timepoints", desc: "Perform the viable plate counts at intervals (Day 0, Day 7, Day 14, and Day 28) by clicking on day buttons and clicking 'Run Challenge & Plate'." },
            { text: "Verify Log Calculations", desc: "Open the Lab Notebook log, enter the counted CFUs and calculate their corresponding log reductions, then click Verify." }
        ];
        
        const stepsList = document.getElementById('sim-steps-list');
        if (stepsList) {
            stepsList.innerHTML = steps.map((s, idx) => `
                <div class="sim-step ${idx === 0 ? 'active' : ''}" id="m5-step-${idx + 1}">
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
        
        if (progressBar) progressBar.style.width = `${(this.currentStep / 4) * 100}%`;
        if (progressText) progressText.textContent = `Step ${this.currentStep} of 4`;
        
        if (btnPrev) btnPrev.disabled = (this.currentStep === 1);
        if (btnNext) btnNext.disabled = (this.currentStep === 4);
        
        for (let i = 1; i <= 4; i++) {
            const stepEl = document.getElementById(`m5-step-${i}`);
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
        if (this.currentStep < 4) {
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
}

export const aet = new AETModule();
window.aet = aet;

// Expose event handlers globally
notebook.m5_resetAET = () => aet.resetAET();
notebook.m5_updateNeutralizer = () => aet.updateNeutralizer();
notebook.m5_selectDay = (day) => aet.selectDay(day);
notebook.m5_runAssay = () => aet.runAssay();
