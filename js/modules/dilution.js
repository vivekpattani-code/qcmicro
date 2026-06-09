/* ==========================================================================
   FSSAI Virtual Microbiology Lab - Dilution & Plating Module Logic
   ========================================================================= */

import { audio, canvasUtils, showNotification } from '../utils.js?v=1.4';
import { notebook } from '../notebook.js?v=1.4';

class DilutionModule {
    constructor() {
        this.tubes = [
            { name: "Stock", vol: 10.0, conc: 1.0, liquidColor: "rgba(230, 180, 50, 0.55)" },
            { name: "10^-1", vol: 9.0, conc: 0.0, liquidColor: "rgba(0, 229, 255, 0.1)" },
            { name: "10^-2", vol: 9.0, conc: 0.0, liquidColor: "rgba(0, 229, 255, 0.1)" },
            { name: "10^-3", vol: 9.0, conc: 0.0, liquidColor: "rgba(0, 229, 255, 0.1)" },
            { name: "10^-4", vol: 9.0, conc: 0.0, liquidColor: "rgba(0, 229, 255, 0.1)" },
            { name: "10^-5", vol: 9.0, conc: 0.0, liquidColor: "rgba(0, 229, 255, 0.1)" }
        ];
        
        this.pipette = {
            volSelected: 1.0, // 1.0 or 0.1
            fluidVol: 0.0,
            conc: 0.0,
            color: "",
            isTipAttached: true,
            isTipContaminated: false,
            tipContaminantConc: 0.0
        };

        this.plate = {
            medium: "",
            acidified: false,
            dilutionConc: 0.0, // concentration transferred
            dilutionName: "None",
            volumePlated: 0.0,
            isIncubated: false,
            coloniesCount: 0,
            coloniesList: [], // coordinates of colonies
            userColonyCount: 0,
            markedColonies: [], // coordinates of marked colonies
            growthSuccess: false,
            contamination: false
        };

        this.selectedTubeIdx = null;
        this.currentStep = 1;
    }

    init() {
        // Reset state based on editable sample parameters
        const selectSource = document.getElementById('sample-source-m2');
        const sourceVal = selectSource ? selectSource.value : 'milk';
        
        let stockConc = 1.0;
        let stockColor = "rgba(230, 180, 50, 0.55)"; // milk cloudy yellow
        if (sourceVal === 'milk') {
            stockConc = 1.0;
            stockColor = "rgba(230, 180, 50, 0.55)";
        } else if (sourceVal === 'greens') {
            stockConc = 0.1;
            stockColor = "rgba(0, 230, 118, 0.35)"; // salad green wash
        } else if (sourceVal === 'water') {
            stockConc = 0.001;
            stockColor = "rgba(0, 229, 255, 0.18)"; // water light cyan
        }

        this.tubes = [
            { name: "Stock", vol: 10.0, conc: stockConc, liquidColor: stockColor },
            { name: "10^-1", vol: 9.0, conc: 0.0, liquidColor: "rgba(0, 229, 255, 0.1)" },
            { name: "10^-2", vol: 9.0, conc: 0.0, liquidColor: "rgba(0, 229, 255, 0.1)" },
            { name: "10^-3", vol: 9.0, conc: 0.0, liquidColor: "rgba(0, 229, 255, 0.1)" },
            { name: "10^-4", vol: 9.0, conc: 0.0, liquidColor: "rgba(0, 229, 255, 0.1)" },
            { name: "10^-5", vol: 9.0, conc: 0.0, liquidColor: "rgba(0, 229, 255, 0.1)" }
        ];

        this.pipette = {
            volSelected: 1.0,
            fluidVol: 0.0,
            conc: 0.0,
            color: "",
            isTipAttached: true,
            isTipContaminated: false,
            tipContaminantConc: 0.0
        };
        
        const tipStatus = document.getElementById('pipette-tip-status');
        if (tipStatus) {
            tipStatus.textContent = "Tip: Sterile";
            tipStatus.style.color = "var(--color-green)";
        }
        
        this.plate = {
            medium: "", acidified: false, dilutionConc: 0.0, dilutionName: "None", volumePlated: 0.0,
            isIncubated: false, coloniesCount: 0, coloniesList: [], userColonyCount: 0, markedColonies: [],
            growthSuccess: false, contamination: false
        };

        this.selectedTubeIdx = null;
        this.currentStep = 1;

        // Reset DOM elements
        const mediaSelect = document.getElementById('media-select');
        const chkTartaric = document.getElementById('chk-tartaric-acid');
        const pdaBox = document.getElementById('pda-acid-box');
        const colonyVal = document.getElementById('colony-counter-val');
        const btnColTally = document.getElementById('btn-colony-tally');
        
        if (mediaSelect) mediaSelect.value = "";
        if (chkTartaric) chkTartaric.checked = false;
        if (pdaBox) pdaBox.classList.add('hidden');
        if (colonyVal) colonyVal.textContent = "0";
        if (btnColTally) {
            btnColTally.classList.add('disabled');
            btnColTally.disabled = true;
        }

        this.updateTubesUI();
        this.updatePipetteUI();
        this.updatePlateUI();
        this.setupSteps();
        this.bindEvents();

        const floatPipette = document.getElementById('floating-pipette-m2');
        if (floatPipette) {
            floatPipette.style.opacity = '0';
            floatPipette.classList.remove('dipping');
        }
    }

    setupSteps() {
        const steps = [
            { text: "Perform Serial Dilutions", desc: "Carry out a 10-fold serial dilution. Select the 1.0 mL pipette tip, aspirate 1.0 mL from Stock and dispense into the 10<sup>-1</sup> tube. Then transfer 1 mL sequentially down to the 10<sup>-5</sup> tube." },
            { text: "Select Growth Medium", desc: "Choose the target medium. For Yeast and Mould (PDA), ensure you adjust pH by adding 10% Tartaric Acid to inhibit bacteria." },
            { text: "Inoculate Petri Dish", desc: "Aspirate 1.0 mL from the 10<sup>-3</sup> tube (typical dilution for SPC) and click on Petri Dish A to inoculate the sample." },
            { text: "Run Incubation", desc: "Configure the incubator parameters (e.g. 37°C for 48 hours for general plate counts) and run incubation." },
            { text: "Enumerate and Log", desc: "Tally the grown colonies. Click directly on colonies on Dish A to mark and count them. Record details in the Lab Notebook." }
        ];

        const stepsList = document.getElementById('sim-steps-list');
        if (stepsList) {
            stepsList.innerHTML = steps.map((s, idx) => `
                <div class="sim-step ${idx === 0 ? 'active' : ''}" id="m3-step-${idx + 1}">
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

        if (progressBar) progressBar.style.width = `${(this.currentStep / 5) * 100}%`;
        if (progressText) progressText.textContent = `Step ${this.currentStep} of 5`;

        if (btnPrev) btnPrev.disabled = (this.currentStep === 1);
        if (btnNext) btnNext.disabled = (this.currentStep === 5);

        // Highlight step elements
        for (let i = 1; i <= 5; i++) {
            const stepEl = document.getElementById(`m3-step-${i}`);
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
        if (this.currentStep < 5) {
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

    bindEvents() {
        // Sample source change updates shelf
        const selectSource = document.getElementById('sample-source-m2');
        if (selectSource) {
            selectSource.onchange = () => {
                audio.playClick();
                this.init();
            };
        }

        // Tube selection click handler
        for (let i = 0; i <= 5; i++) {
            const tubeSlot = document.getElementById(`dilution-tube-${i}`);
            if (tubeSlot) {
                tubeSlot.onclick = () => {
                    this.selectedTubeIdx = i;
                    this.highlightTargetTube(i);
                    this.updateFloatingPipettePosition(i);
                    audio.playClick();
                };
            }
        }

        // Pipette volume selection
        const pipVolSelect = document.getElementById('pipette-vol-select');
        if (pipVolSelect) {
            pipVolSelect.onchange = (e) => {
                this.pipette.volSelected = parseFloat(e.target.value);
                audio.playClick();
            };
        }

        // Pipette button: Aspirate
        const btnAspirate = document.getElementById('btn-pipette-aspirate');
        if (btnAspirate) {
            btnAspirate.onclick = () => {
                if (this.selectedTubeIdx === null) {
                    audio.playError();
                    showNotification("Please select a tube first by clicking on it.", "warning");
                    return;
                }
                this.aspirateFromTube(this.selectedTubeIdx);
            };
        }

        // Pipette button: Dispense
        const btnDispense = document.getElementById('btn-pipette-dispense');
        if (btnDispense) {
            btnDispense.onclick = () => {
                if (this.selectedTubeIdx === null) {
                    audio.playError();
                    showNotification("Please select a tube first by clicking on it.", "warning");
                    return;
                }
                this.dispenseIntoTube(this.selectedTubeIdx);
            };
        }

        // Pipette button: Eject / Change Tip
        const btnEject = document.getElementById('btn-pipette-eject');
        if (btnEject) {
            btnEject.onclick = () => {
                this.changeTip();
            };
        }

        // Medium selection
        const mediaSelect = document.getElementById('media-select');
        const pdaBox = document.getElementById('pda-acid-box');
        if (mediaSelect) {
            mediaSelect.onchange = (e) => {
                this.plate.medium = e.target.value;
                audio.playClick();
                
                if (this.plate.medium === "PDA") {
                    pdaBox.classList.remove('hidden');
                } else {
                    pdaBox.classList.add('hidden');
                }

                if (this.currentStep === 2) {
                    this.nextStep();
                }
                this.updatePlateUI();
            };
        }

        // PDA Acidification check
        const chkTartaric = document.getElementById('chk-tartaric-acid');
        if (chkTartaric) {
            chkTartaric.onchange = (e) => {
                this.plate.acidified = e.target.checked;
                audio.playClick();
            };
        }

        // Dish Click: Inoculate
        const petriDishA = document.getElementById('petri-dish-a');
        if (petriDishA) {
            petriDishA.onclick = () => {
                if (this.pipette.fluidVol > 0.0) {
                    this.inoculatePlate();
                } else if (this.plate.isIncubated) {
                    // Manual counting click check
                    this.tallyColonyByClick();
                } else {
                    audio.playError();
                }
            };
        }

        // Incubate button
        const btnIncubate = document.getElementById('btn-run-incubation');
        if (btnIncubate) {
            btnIncubate.onclick = () => {
                const temp = parseInt(document.getElementById('incubator-temp').value);
                const hours = parseInt(document.getElementById('incubator-hours').value);
                this.runIncubation(temp, hours);
            };
        }

        // Tally Buttons
        const btnTallyCol = document.getElementById('btn-colony-tally');
        const btnClearCol = document.getElementById('btn-colony-clear');

        if (btnTallyCol) {
            btnTallyCol.onclick = () => {
                this.tallyColony();
            };
        }

        if (btnClearCol) {
            btnClearCol.onclick = () => {
                this.plate.userColonyCount = 0;
                this.plate.markedColonies = [];
                document.getElementById('colony-counter-val').textContent = "0";
                audio.playClick();
                this.drawColoniesCanvas();
                this.syncNotebook();
            };
        }
    }

    highlightTargetTube(idx) {
        for (let i = 0; i <= 5; i++) {
            const tube = document.getElementById(`dilution-tube-${i}`);
            if (tube) {
                if (i === idx) {
                    tube.classList.add('active-target');
                } else {
                    tube.classList.remove('active-target');
                }
            }
        }
    }

    changeTip() {
        if (!this.pipette.isTipAttached) return;
        audio.playClick();
        this.pipette.isTipAttached = false;
        // If there was liquid in the pipette, it is discarded
        this.pipette.fluidVol = 0.0;
        this.pipette.conc = 0.0;
        this.pipette.color = "";
        this.updatePipetteUI();
        
        showNotification("Ejected contaminated tip. Attaching new sterile tip...", "info");
        
        setTimeout(() => {
            this.pipette.isTipAttached = true;
            this.pipette.isTipContaminated = false;
            this.pipette.tipContaminantConc = 0.0;
            this.updatePipetteUI();
            audio.playSuccess();
            showNotification("New sterile tip attached.", "success");
        }, 300);
    }

    aspirateFromTube(idx) {
        if (!this.pipette.isTipAttached) {
            audio.playError();
            showNotification("No pipette tip attached! Attach a sterile tip first.", "error");
            return;
        }

        const tube = this.tubes[idx];
        const volToDraw = this.pipette.volSelected;
        
        if (this.pipette.fluidVol > 0.0) {
            audio.playError();
            showNotification("Pipette is already full. Dispense liquid first.", "warning");
            return;
        }
        
        if (tube.vol < volToDraw) {
            audio.playError();
            showNotification("Not enough liquid in this tube.", "error");
            return;
        }
        
        // Draw fluid
        tube.vol -= volToDraw;
        this.pipette.fluidVol = volToDraw;
        
        // Apply carryover contamination if tip is dirty and concentrations differ
        if (this.pipette.isTipContaminated && this.pipette.tipContaminantConc !== tube.conc) {
            this.pipette.conc = tube.conc * 0.95 + this.pipette.tipContaminantConc * 0.05;
        } else {
            this.pipette.conc = tube.conc;
        }
        
        // Color match tip
        this.pipette.color = tube.liquidColor;
        
        audio.playPipette(true);
        this.triggerDippingAnimation();
        this.updateTubesUI();
        this.updatePipetteUI();
    }

    dispenseIntoTube(idx) {
        if (!this.pipette.isTipAttached) {
            audio.playError();
            showNotification("No pipette tip attached!", "error");
            return;
        }

        const tube = this.tubes[idx];
        const volToDispense = this.pipette.fluidVol;
        
        if (volToDispense === 0.0) {
            audio.playError();
            showNotification("Pipette is empty. Aspirate liquid first.", "warning");
            return;
        }
        
        // Save the concentration of the liquid being transferred
        const transferredConc = this.pipette.conc;

        // Perform 10-fold serial dilution calculation check
        const totalVolume = tube.vol + volToDispense;
        const newConc = (tube.conc * tube.vol + this.pipette.conc * volToDispense) / totalVolume;
        
        tube.vol = totalVolume;
        tube.conc = newConc;
        
        // Update color based on new dilution factors
        if (newConc > 0.08) {
            tube.liquidColor = "rgba(230, 180, 50, 0.5)"; // Cloudy yellow
        } else if (newConc > 0.008) {
            tube.liquidColor = "rgba(230, 180, 50, 0.2)"; // Light yellow
        } else {
            const opacity = 0.1 + (newConc * 0.5);
            tube.liquidColor = `rgba(0, 229, 255, ${opacity})`;
        }
        
        // Empty pipette
        this.pipette.fluidVol = 0.0;
        this.pipette.conc = 0.0;

        // Mark tip as contaminated with the transferred concentration
        this.pipette.isTipContaminated = true;
        this.pipette.tipContaminantConc = transferredConc;
        
        audio.playPipette(false);
        this.triggerDippingAnimation();
        this.updateTubesUI();
        this.updatePipetteUI();
        
        // Check step 1 progress
        if (this.currentStep === 1) {
            const dilutionSuccess = this.tubes[1].conc > 0.09 && this.tubes[2].conc > 0.009 && this.tubes[3].conc > 0.0009;
            if (dilutionSuccess) {
                this.nextStep();
            }
        }
    }

    inoculatePlate() {
        if (this.plate.medium === "") {
            audio.playError();
            showNotification("Please select a growth medium before inoculating the plate.", "warning");
            return;
        }

        if (!this.pipette.isTipAttached) {
            audio.playError();
            showNotification("No pipette tip attached!", "error");
            return;
        }

        // Dispense into plate
        const transferredConc = this.pipette.conc;
        this.plate.dilutionConc = this.pipette.conc;
        this.plate.volumePlated = this.pipette.fluidVol;
        
        // Calculate corresponding dilution name
        let dilName = "Stock";
        if (this.plate.dilutionConc < 0.000005) dilName = "10^-5";
        else if (this.plate.dilutionConc < 0.00005) dilName = "10^-4";
        else if (this.plate.dilutionConc < 0.0005) dilName = "10^-3";
        else if (this.plate.dilutionConc < 0.005) dilName = "10^-2";
        else if (this.plate.dilutionConc < 0.05) dilName = "10^-1";
        
        this.plate.dilutionName = dilName;
        
        // Empty pipette
        this.pipette.fluidVol = 0.0;
        this.pipette.conc = 0.0;

        // Mark tip as contaminated with the transferred concentration
        this.pipette.isTipContaminated = true;
        this.pipette.tipContaminantConc = transferredConc;
        
        audio.playPipette(false);
        this.triggerInoculateAnimation();
        this.updatePipetteUI();
        
        if (this.currentStep === 3) {
            this.nextStep();
        }
        
        this.updatePlateUI();
        this.syncNotebook();
    }

    runIncubation(temp, hours) {
        if (this.plate.dilutionConc === 0.0) {
            audio.playError();
            showNotification("Plating error: No culture inoculated on plate.", "error");
            return;
        }

        // Validate incubation rules
        let growthSuccess = false;
        let contamination = false;
        
        if (this.plate.medium === "PCA") {
            // General plate count agar: requires 37°C for 48h (accepts 35-37°C, 48-72h)
            if (temp >= 35 && temp <= 38 && hours >= 48 && hours <= 72) {
                growthSuccess = true;
            }
        } 
        else if (this.plate.medium === "PA") {
            // Pseudomonas aeruginosa: 36°C +/- 1°C for 24-30h
            if (temp >= 35 && temp <= 37 && hours >= 24 && hours <= 30) {
                growthSuccess = true;
            }
        } 
        else if (this.plate.medium === "PDA") {
            // Yeast/Mould: 21°C for 2-5 days (48-120h)
            if (temp >= 20 && temp <= 22 && hours >= 48 && hours <= 120) {
                growthSuccess = true;
                
                // Check acid adjustment
                if (!this.plate.acidified) {
                    contamination = true; // Forgetting tartaric acid leads to bacterial overgrowth
                }
            }
        }

        this.plate.isIncubated = true;
        this.plate.growthSuccess = growthSuccess;
        this.plate.contamination = contamination;

        // Generate colonies count list for rendering
        this.generatePlateColonies();
        
        // Audio & UI
        audio.playSuccess();
        this.updatePlateUI();
        this.drawColoniesCanvas();
        
        // Enable colony tally clicks
        const btnTallyCol = document.getElementById('btn-colony-tally');
        if (btnTallyCol) {
            btnTallyCol.classList.remove('disabled');
            btnTallyCol.disabled = false;
        }

        if (this.currentStep === 4) {
            this.nextStep();
        }
        this.syncNotebook();
    }

    generatePlateColonies() {
        this.plate.coloniesList = [];
        let numColonies = 0;

        if (!this.plate.growthSuccess) {
            this.plate.coloniesCount = 0;
            return;
        }

        // Bacterial concentration models based on editable sample parameters
        const volPlated = this.plate.volumePlated;
        const conc = this.plate.dilutionConc;
        
        const selectSource = document.getElementById('sample-source-m2');
        const sourceVal = selectSource ? selectSource.value : 'milk';
        
        let baseDensity = 160000; // Milk (1.6e5 CFU/mL in stock)
        if (sourceVal === 'milk') {
            baseDensity = 160000;
        } else if (sourceVal === 'greens') {
            baseDensity = 15000;  // Salad greens wash (1.5e4 CFU/mL in stock)
        } else if (sourceVal === 'water') {
            baseDensity = 150;    // Bottled water (150 CFU/mL in stock)
        }
        
        // Adjust dilution relative to the stock concentration
        const stockConc = this.tubes[0].conc;
        const dilutionRatio = stockConc > 0 ? (conc / stockConc) : 1;
        let expectedCount = baseDensity * dilutionRatio * volPlated;
        
        // Add random variance (+/- 15%)
        const variance = (Math.random() * 0.3) - 0.15;
        numColonies = Math.round(expectedCount * (1 + variance));

        if (this.plate.contamination) {
            // Draw a massive lawn of small contaminating bacterial dots + yeast moulds
            numColonies += 800; 
        }

        this.plate.coloniesCount = numColonies;

        // Generate spatial coordinates inside petri plate (radius ~ 55px on canvas)
        const radiusLimit = 52;
        const centerX = 60;
        const centerY = 60;

        for (let i = 0; i < numColonies; i++) {
            // Generate polar coordinates
            const theta = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * radiusLimit; // Bias towards outer edges for natural circular spreading
            
            const x = centerX + r * Math.cos(theta);
            const y = centerY + r * Math.sin(theta);
            
            // Colony size
            let size = 1.5 + Math.random() * 1.5;
            
            // Type coloring
            let type = 'standard';
            let color = '#fffde7'; // PCA light cream
            
            if (this.plate.medium === "PA") {
                type = 'pseudomonas';
                color = '#00e5ff'; // Fluorescent cyan-green
                size = 1.2 + Math.random() * 1.2;
            } 
            else if (this.plate.medium === "PDA") {
                type = 'yeast';
                color = '#fff9c4'; // Creamy white yeast
                size = 2.0 + Math.random() * 2.5; // Larger
            }

            if (this.plate.contamination && i > (numColonies - 800)) {
                // Drawing tiny round bacterial contamination colonies
                type = 'standard';
                color = 'rgba(255, 23, 68, 0.45)'; // reddish bacteria contaminants
                size = 0.8 + Math.random() * 0.8;
            }

            this.plate.coloniesList.push({ x, y, size, type, color });
        }
    }

    tallyColony() {
        if (!this.plate.isIncubated) return;
        this.plate.userColonyCount++;
        document.getElementById('colony-counter-val').textContent = this.plate.userColonyCount;
        audio.playClick();
        
        this.syncNotebook();
    }

    tallyColonyByClick() {
        // Tally by clicking plate. We find the coordinates of canvas click and place a marker dot.
        const canvas = document.getElementById('canvas-dish-a');
        if (!canvas) return;
        
        this.plate.userColonyCount++;
        document.getElementById('colony-counter-val').textContent = this.plate.userColonyCount;
        audio.playClick();
        
        this.syncNotebook();
    }

    drawColoniesCanvas() {
        const canvas = document.getElementById('canvas-dish-a');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw colonies
        this.plate.coloniesList.forEach(col => {
            canvasUtils.drawColony(ctx, col.x, col.y, col.size, col.type, col.color);
        });
        
        // Note: For TNTC plates (count > 350), let's render a warning smear or write TNTC overlay
        if (this.plate.coloniesCount > 350) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = 'bold 11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText("TNTC", canvas.width / 2, canvas.height / 2 - 5);
            ctx.font = '7px var(--font-code)';
            ctx.fillText(">300 Colonies", canvas.width / 2, canvas.height / 2 + 8);
        }
    }

    updateTubesUI() {
        for (let i = 0; i <= 5; i++) {
            const tube = this.tubes[i];
            const liquidEl = document.querySelector(`#dilution-tube-${i} .liquid`);
            const volEl = document.getElementById(`vol-t${i}`);
            
            if (liquidEl) {
                // Height based on liquid volume (max height 80%)
                const heightPercentage = (tube.vol / 12) * 80;
                liquidEl.style.height = `${heightPercentage}%`;
                liquidEl.style.backgroundColor = tube.liquidColor;
            }
            if (volEl && i > 0) {
                volEl.textContent = `${tube.vol.toFixed(1)} mL`;
            }
        }
    }

    updatePipetteUI() {
        const plunger = document.getElementById('pipette-plunger');
        const liquidTip = document.getElementById('pipette-liquid');
        const statusText = document.getElementById('pipette-status');
        
        const floatPlunger = document.getElementById('float-pipette-plunger');
        const floatLiquid = document.getElementById('float-pipette-liquid');
        
        const tipEl = document.getElementById('pipette-tip');
        const floatTipEl = document.getElementById('float-pipette-tip');
        
        if (tipEl) {
            tipEl.style.opacity = this.pipette.isTipAttached ? '1' : '0.15';
            if (this.pipette.isTipContaminated) {
                tipEl.classList.add('tip-contaminated');
            } else {
                tipEl.classList.remove('tip-contaminated');
            }
        }
        if (floatTipEl) {
            floatTipEl.style.opacity = this.pipette.isTipAttached ? '1' : '0.15';
            if (this.pipette.isTipContaminated) {
                floatTipEl.classList.add('tip-contaminated');
            } else {
                floatTipEl.classList.remove('tip-contaminated');
            }
        }

        if (this.pipette.fluidVol > 0.0) {
            if (plunger) plunger.classList.add('depressed');
            if (floatPlunger) floatPlunger.classList.add('depressed');
            if (liquidTip) {
                liquidTip.style.height = "85%";
                liquidTip.style.backgroundColor = this.pipette.color;
            }
            if (floatLiquid) {
                floatLiquid.style.height = "85%";
                floatLiquid.style.backgroundColor = this.pipette.color;
            }
            if (statusText) statusText.textContent = `Pipette: Full (${this.pipette.fluidVol} mL)`;
        } else {
            if (plunger) plunger.classList.remove('depressed');
            if (floatPlunger) floatPlunger.classList.remove('depressed');
            if (liquidTip) liquidTip.style.height = "0%";
            if (floatLiquid) floatLiquid.style.height = "0%";
            if (statusText) statusText.textContent = "Pipette: Empty";
        }

        // Update tip status badge
        const tipStatus = document.getElementById('pipette-tip-status');
        if (tipStatus) {
            if (!this.pipette.isTipAttached) {
                tipStatus.textContent = "Tip: Discarded";
                tipStatus.style.color = "var(--color-red)";
            } else if (this.pipette.isTipContaminated) {
                let concName = "Stock";
                if (this.pipette.tipContaminantConc < 0.000005) concName = "10^-5";
                else if (this.pipette.tipContaminantConc < 0.00005) concName = "10^-4";
                else if (this.pipette.tipContaminantConc < 0.0005) concName = "10^-3";
                else if (this.pipette.tipContaminantConc < 0.05) concName = "10^-2";
                else if (this.pipette.tipContaminantConc < 0.5) concName = "10^-1";
                
                tipStatus.textContent = `Tip: Contaminated (${concName})`;
                tipStatus.style.color = "var(--color-yellow)";
            } else {
                tipStatus.textContent = "Tip: Sterile";
                tipStatus.style.color = "var(--color-green)";
            }
        }
    }

    updatePlateUI() {
        const dishFluid = document.getElementById('petri-fluid-a');
        const agarLayer = document.getElementById('agar-layer-a');
        const dishLabel = document.getElementById('dish-lbl-a');
        
        // Update agar color based on medium selected
        if (agarLayer) {
            if (this.plate.medium === "PCA") {
                agarLayer.style.backgroundColor = "rgba(255, 235, 180, 0.45)"; // Straw yellow PCA
            } else if (this.plate.medium === "PDA") {
                agarLayer.style.backgroundColor = "rgba(255, 214, 0, 0.35)"; // Golden-orange PDA
            } else if (this.plate.medium === "PA") {
                agarLayer.style.backgroundColor = "rgba(0, 229, 255, 0.25)"; // Cyan-green Pseudomonas plate
            } else {
                agarLayer.style.backgroundColor = "transparent";
            }
        }

        // Fluid plating
        if (this.plate.volumePlated > 0.0) {
            if (dishFluid) {
                dishFluid.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
            }
            if (dishLabel) {
                dishLabel.textContent = `${this.plate.dilutionName} (${this.plate.medium})`;
            }
        } else {
            if (dishFluid) dishFluid.style.backgroundColor = "transparent";
            if (dishLabel) dishLabel.textContent = "Empty";
        }

        // Grow state
        if (this.plate.isIncubated) {
            if (this.plate.growthSuccess) {
                if (this.plate.contamination) {
                    if (dishLabel) dishLabel.textContent = `Growth + Bacteria Contam!`;
                } else {
                    if (dishLabel) dishLabel.textContent = `CFU: ${this.plate.coloniesCount}`;
                }
            } else {
                if (dishLabel) dishLabel.textContent = "No Growth (Incubation Error)";
            }
        }
    }

    syncNotebook() {
        notebook.logPlatingData(
            this.plate.medium || "None",
            parseInt(document.getElementById('incubator-temp').value) || 0,
            parseInt(document.getElementById('incubator-hours').value) || 0,
            this.plate.dilutionName,
            this.plate.coloniesCount
        );
    }

    updateFloatingPipettePosition(idx) {
        const activeTube = document.getElementById(`dilution-tube-${idx}`);
        const layout = document.querySelector('.workbench-layout');
        const floatPipette = document.getElementById('floating-pipette-m2');

        if (activeTube && layout && floatPipette) {
            const tubeRect = activeTube.getBoundingClientRect();
            const layoutRect = layout.getBoundingClientRect();
            
            const left = (tubeRect.left - layoutRect.left) + (tubeRect.width / 2) - 10;
            const top = (tubeRect.top - layoutRect.top) - 75;
            
            floatPipette.style.left = `${left}px`;
            floatPipette.style.top = `${top}px`;
            floatPipette.style.opacity = '1';
        }
    }

    triggerDippingAnimation() {
        const floatPipette = document.getElementById('floating-pipette-m2');
        if (floatPipette) {
            floatPipette.classList.add('dipping');
            setTimeout(() => {
                floatPipette.classList.remove('dipping');
            }, 800);
        }
    }

    triggerInoculateAnimation() {
        const dish = document.getElementById('petri-dish-a');
        const layout = document.querySelector('.workbench-layout');
        const floatPipette = document.getElementById('floating-pipette-m2');

        if (dish && layout && floatPipette) {
            const dishRect = dish.getBoundingClientRect();
            const layoutRect = layout.getBoundingClientRect();
            
            const left = (dishRect.left - layoutRect.left) + (dishRect.width / 2) - 10;
            const top = (dishRect.top - layoutRect.top) - 75;
            
            floatPipette.style.left = `${left}px`;
            floatPipette.style.top = `${top}px`;
            floatPipette.style.opacity = '1';

            floatPipette.classList.add('dipping');
            setTimeout(() => {
                floatPipette.classList.remove('dipping');
            }, 800);
        }
    }
}

export const dilution = new DilutionModule();
