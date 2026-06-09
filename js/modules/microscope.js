/* ==========================================================================
   FSSAI Virtual Microbiology Lab - Microscope Counting Module Logic
   ========================================================================= */

import { audio, canvasUtils } from '../utils.js?v=1.4';
import { notebook } from '../notebook.js?v=1.4';

class MicroscopeModule {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.focusValue = 10;
        this.targetFocus = 55; // Sharpest point
        this.slidePos = { x: 1000, y: 1000 }; // Viewport center in virtual space
        this.bacteria = [];
        this.markedTally = []; // Coordinates of marked/counted bacteria
        this.tallyCount = 0;
        this.currentStep = 1;
        this.dilution = 1;
        
        // Virtual slide settings
        this.virtualSize = 2000;
        this.gridSize = 1200; // Size of Petroff-Hausser grid in virtual pixels
        this.gridOffset = 400; // Center offset: (2000-1200)/2
        
        // Bind event methods
        this.handleResize = this.handleResize.bind(this);
    }

    init() {
        this.canvas = document.getElementById('microscope-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.focusValue = 10;
        this.targetFocus = 45 + Math.floor(Math.random() * 25); // Target focus random between 45 and 70
        this.slidePos = { x: 1000, y: 1000 };
        this.tallyCount = 0;
        this.markedTally = [];
        this.currentStep = 1;
        
        // Select elements
        const sliderFocus = document.getElementById('slider-focus');
        const focusReadout = document.getElementById('focus-readout');
        const tallyNumber = document.getElementById('tally-number');
        const chkClumpMode = document.getElementById('chk-clump-mode');
        
        if (sliderFocus) {
            sliderFocus.value = this.focusValue;
            if (focusReadout) focusReadout.textContent = "Unfocused";
        }
        if (tallyNumber) tallyNumber.textContent = "000";
        if (chkClumpMode) chkClumpMode.checked = false;

        this.generateSlideBacteria();
        this.setupSteps();
        this.bindEvents();
        this.draw();
        
        // Audio hook
        audio.stopMicroscopeHum();
    }

    setupSteps() {
        const steps = [
            { text: "Adjust Coaxial Focus", desc: "Drag the focus slider until the outline of the cells in the grid is sharp and clear." },
            { text: "Locate the Counting Grid", desc: "Use the directional D-pad controls to center the Neubauer grid in the circular lens." },
            { text: "Enumerate Bacteria Cells", desc: "Count the cells. Select whether you are counting clumps (for Plate Count correlation) or individual cells. Click directly on cells in the lens to mark them." },
            { text: "Fill Out Lab Notebook Log", desc: "Open the Lab Notebook sidebar, select the DMC tab, enter your calculated Cells/mL, and click Verify." }
        ];
        
        const stepsList = document.getElementById('sim-steps-list');
        if (stepsList) {
            stepsList.innerHTML = steps.map((s, idx) => `
                <div class="sim-step ${idx === 0 ? 'active' : ''}" id="m2-step-${idx + 1}">
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
        
        // Toggle step element highlights
        for (let i = 1; i <= 4; i++) {
            const stepEl = document.getElementById(`m2-step-${i}`);
            if (stepEl) {
                stepEl.className = "sim-step";
                if (i < this.currentStep) {
                    stepEl.classList.add('completed');
                    const icon = stepEl.querySelector('.sim-step-icon');
                    if (icon) {
                        icon.className = "fa-solid fa-circle-check text-green";
                    }
                } else if (i === this.currentStep) {
                    stepEl.classList.add('active');
                    const icon = stepEl.querySelector('.sim-step-icon');
                    if (icon) {
                        icon.className = "fa-solid fa-circle-dot text-cyan-glow";
                    }
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

    // Generate random bacteria spread based on editable parameters
    generateSlideBacteria() {
        this.bacteria = [];
        
        const selectSource = document.getElementById('sample-source-m1');
        const selectDilution = document.getElementById('dilution-factor-m1');
        
        const sourceVal = selectSource ? selectSource.value : 'raw';
        const dilutionVal = selectDilution ? parseInt(selectDilution.value) : 1;
        
        let baseCount = 140;
        if (sourceVal === 'raw') {
            baseCount = 140;
        } else if (sourceVal === 'pasteurized') {
            baseCount = 8;
        } else if (sourceVal === 'saline') {
            baseCount = 65;
        }
        
        // Add minor random variance (+/- 10%)
        const variance = (Math.random() * 0.2) - 0.1;
        let numBacteria = Math.round((baseCount * (1 + variance)) / dilutionVal);
        
        // Ensure Pasteurised or Saline at high dilutions aren't entirely empty if we want to teach dilution effects
        if (numBacteria === 0 && baseCount > 0 && Math.random() < 0.15) {
            numBacteria = 1;
        }
        
        // Distribute cells in the central grid area (400 to 1600 in virtual coordinates)
        for (let i = 0; i < numBacteria; i++) {
            // Biased distribution towards the grid
            const x = this.gridOffset + Math.random() * this.gridSize;
            const y = this.gridOffset + Math.random() * this.gridSize;
            
            const isClump = Math.random() < 0.25; // 25% are clusters/clumps
            const size = 5 + Math.random() * 4;
            
            this.bacteria.push({
                x, y,
                size,
                type: isClump ? 'clump' : (Math.random() < 0.6 ? 'rod' : 'coccus'),
                color: isClump ? 'hsl(215, 60%, 55%)' : (Math.random() < 0.6 ? 'hsl(190, 70%, 50%)' : 'hsl(240, 50%, 60%)')
            });
        }
    }

    bindEvents() {
        // Sample parameters changes
        const selectSource = document.getElementById('sample-source-m1');
        const selectDilution = document.getElementById('dilution-factor-m1');
        
        const regenerateSlide = () => {
            this.dilution = parseInt(selectDilution ? selectDilution.value : 1);
            this.tallyCount = 0;
            this.markedTally = [];
            
            const tallyNumber = document.getElementById('tally-number');
            if (tallyNumber) tallyNumber.textContent = "000";
            
            this.generateSlideBacteria();
            this.syncNotebook();
            this.draw();
        };

        if (selectSource) selectSource.onchange = regenerateSlide;
        if (selectDilution) selectDilution.onchange = regenerateSlide;

        // Focus slider
        const sliderFocus = document.getElementById('slider-focus');
        if (sliderFocus) {
            sliderFocus.oninput = (e) => {
                this.focusValue = parseInt(e.target.value);
                const focusDiff = Math.abs(this.focusValue - this.targetFocus);
                
                const focusReadout = document.getElementById('focus-readout');
                if (focusReadout) {
                    if (focusDiff < 3) {
                        focusReadout.textContent = "Sharp Focus";
                        focusReadout.style.color = "var(--color-green)";
                        if (this.currentStep === 1) {
                            this.nextStep();
                        }
                    } else if (focusDiff < 10) {
                        focusReadout.textContent = "Coarse Focus";
                        focusReadout.style.color = "var(--color-cyan)";
                    } else {
                        focusReadout.textContent = "Unfocused";
                        focusReadout.style.color = "var(--text-muted)";
                    }
                }
                
                // Hum sound
                const accuracy = Math.max(0, 1 - (focusDiff / 50));
                audio.startMicroscopeHum(accuracy);
                audio.updateMicroscopeHum(accuracy);
                
                this.draw();
            };
            
            sliderFocus.onchange = () => {
                audio.stopMicroscopeHum();
            };
        }

        // Tally Buttons
        const btnCount = document.getElementById('btn-tally-count');
        const btnReset = document.getElementById('btn-tally-reset');
        const tallyNumber = document.getElementById('tally-number');
        const chkClumpMode = document.getElementById('chk-clump-mode');

        if (btnCount) {
            btnCount.onclick = () => {
                this.tallyCount++;
                if (tallyNumber) {
                    tallyNumber.textContent = String(this.tallyCount).padStart(3, '0');
                }
                audio.playClick();
                this.syncNotebook();
            };
        }

        if (btnReset) {
            btnReset.onclick = () => {
                this.tallyCount = 0;
                this.markedTally = [];
                if (tallyNumber) {
                    tallyNumber.textContent = "000";
                }
                audio.playClick();
                this.syncNotebook();
                this.draw();
            };
        }

        if (chkClumpMode) {
            chkClumpMode.onchange = () => {
                audio.playClick();
                this.tallyCount = 0;
                this.markedTally = [];
                if (tallyNumber) tallyNumber.textContent = "000";
                this.syncNotebook();
                this.draw();
            };
        }

        // Navigation keys
        const setupNavKey = (id, dx, dy) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.onclick = () => {
                    const stepSize = 40; // Pixels to move virtual slide
                    this.slidePos.x = Math.max(200, Math.min(1800, this.slidePos.x + dx * stepSize));
                    this.slidePos.y = Math.max(200, Math.min(1800, this.slidePos.y + dy * stepSize));
                    audio.playClick();
                    
                    // Check if they centered the grid (centered is around slidePos.x = 1000, y = 1000)
                    const gridCentered = Math.abs(this.slidePos.x - 1000) < 50 && Math.abs(this.slidePos.y - 1000) < 50;
                    if (gridCentered && this.currentStep === 2) {
                        this.nextStep();
                    }
                    
                    this.draw();
                };
            }
        };

        setupNavKey('stage-up', 0, -1);
        setupNavKey('stage-down', 0, 1);
        setupNavKey('stage-left', -1, 0);
        setupNavKey('stage-right', 1, 0);

        // Click-and-Drag slide stage panning + Click-to-Count
        if (this.canvas) {
            let isDragging = false;
            let startDragX = 0;
            let startDragY = 0;
            let totalDragDist = 0;

            this.canvas.onmousedown = (e) => {
                isDragging = true;
                startDragX = e.clientX;
                startDragY = e.clientY;
                totalDragDist = 0;
            };

            this.canvas.onmousemove = (e) => {
                if (!isDragging) return;
                
                const dx = e.clientX - startDragX;
                const dy = e.clientY - startDragY;
                totalDragDist += Math.hypot(dx, dy);
                
                // Pan slide (negative offset shifts canvas viewpoint)
                this.slidePos.x = Math.max(200, Math.min(1800, this.slidePos.x - dx * 1.5));
                this.slidePos.y = Math.max(200, Math.min(1800, this.slidePos.y - dy * 1.5));
                
                startDragX = e.clientX;
                startDragY = e.clientY;
                
                // Check if they panned grid to center
                const gridCentered = Math.abs(this.slidePos.x - 1000) < 50 && Math.abs(this.slidePos.y - 1000) < 50;
                if (gridCentered && this.currentStep === 2) {
                    this.nextStep();
                }
                
                this.draw();
            };

            const endDragOrClick = (e) => {
                if (!isDragging) return;
                isDragging = false;
                
                // If moved less than 5px, treat as click to count bacteria
                if (totalDragDist < 5) {
                    const focusDiff = Math.abs(this.focusValue - this.targetFocus);
                    if (focusDiff >= 10) {
                        audio.playError();
                        return; // Too blurred to count
                    }
                    
                    const rect = this.canvas.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const clickY = e.clientY - rect.top;
                    
                    const centerCanvasX = this.canvas.width / 2;
                    const centerCanvasY = this.canvas.height / 2;
                    
                    const virtualClickX = this.slidePos.x + (clickX - centerCanvasX);
                    const virtualClickY = this.slidePos.y + (clickY - centerCanvasY);
                    
                    const isClumpMode = chkClumpMode ? chkClumpMode.checked : false;
                    
                    const clickedBac = this.bacteria.find(b => {
                        const dist = Math.hypot(b.x - virtualClickX, b.y - virtualClickY);
                        const touchRadius = b.size * (b.type === 'clump' ? 2.5 : 1.5);
                        return dist < touchRadius;
                    });
                    
                    if (clickedBac) {
                        const alreadyMarked = this.markedTally.some(m => m.bac === clickedBac);
                        if (!alreadyMarked) {
                            this.markedTally.push({
                                x: clickedBac.x,
                                y: clickedBac.y,
                                bac: clickedBac
                            });
                            
                            this.tallyCount++;
                            if (tallyNumber) {
                                tallyNumber.textContent = String(this.tallyCount).padStart(3, '0');
                            }
                            audio.playClick();
                            
                            if (this.currentStep === 3 && this.tallyCount >= 5) {
                                this.nextStep();
                            }
                            
                            this.syncNotebook();
                            this.draw();
                        }
                    }
                }
            };

            this.canvas.onmouseup = endDragOrClick;
            this.canvas.onmouseleave = () => { isDragging = false; };
        }

        window.addEventListener('resize', this.handleResize);
    }

    unbind() {
        window.removeEventListener('resize', this.handleResize);
        audio.stopMicroscopeHum();
    }

    handleResize() {
        this.draw();
    }

    syncNotebook() {
        notebook.logMicroscopeCount(this.tallyCount, this.dilution);
    }

    // Main Draw loop
    draw() {
        if (!this.canvas || !this.ctx) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;
        
        // 1. Draw liquid suspension background
        ctx.fillStyle = '#0a101f';
        ctx.fillRect(0, 0, width, height);
        
        // Subtle optical illumination glow in center
        const glowGrad = ctx.createRadialGradient(width/2, height/2, 20, width/2, height/2, width/2);
        glowGrad.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
        glowGrad.addColorStop(0.5, 'rgba(138, 75, 243, 0.03)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. Draw Petroff-Hausser Grid Lines
        // The grid sits centered at (1000, 1000) virtual space, and is gridSize x gridSize
        const focusDiff = Math.abs(this.focusValue - this.targetFocus);
        const blurPx = Math.max(0, (focusDiff - 2) * 0.15); // blur factor
        
        ctx.save();
        if (blurPx > 0.5) {
            ctx.filter = `blur(${blurPx}px)`;
        } else {
            ctx.filter = 'none';
        }
        
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
        ctx.lineWidth = 1;
        
        const centerCanvasX = width / 2;
        const centerCanvasY = height / 2;
        
        // Draw grid squares if visible in screen coordinates
        // The grid has 5 main divisions (each 240 virtual px). Total size 1200 virtual px.
        const startX = this.gridOffset;
        const endX = this.gridOffset + this.gridSize;
        const startY = this.gridOffset;
        const endY = this.gridOffset + this.gridSize;
        
        const divSize = 240; // 5 divisions of 240 = 1200
        
        // Draw grid vertical lines
        for (let vx = startX; vx <= endX; vx += divSize) {
            const screenX = centerCanvasX + (vx - this.slidePos.x);
            if (screenX >= 0 && screenX <= width) {
                // Main division lines are double etched
                ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(screenX, Math.max(0, centerCanvasY + (startY - this.slidePos.y)));
                ctx.lineTo(screenX, Math.min(height, centerCanvasY + (endY - this.slidePos.y)));
                ctx.stroke();
                
                // Draw subdivs inside (each main square is divided into 4x4 smaller squares = 60 px)
                if (vx < endX) {
                    ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
                    ctx.lineWidth = 1;
                    for (let sx = 1; sx <= 3; sx++) {
                        const subScreenX = screenX + (sx * (divSize / 4));
                        ctx.beginPath();
                        ctx.moveTo(subScreenX, Math.max(0, centerCanvasY + (startY - this.slidePos.y)));
                        ctx.lineTo(subScreenX, Math.min(height, centerCanvasY + (endY - this.slidePos.y)));
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Draw grid horizontal lines
        for (let vy = startY; vy <= endY; vy += divSize) {
            const screenY = centerCanvasY + (vy - this.slidePos.y);
            if (screenY >= 0 && screenY <= height) {
                ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(Math.max(0, centerCanvasX + (startX - this.slidePos.x)), screenY);
                ctx.lineTo(Math.min(width, centerCanvasX + (endX - this.slidePos.x)), screenY);
                ctx.stroke();
                
                if (vy < endY) {
                    ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
                    ctx.lineWidth = 1;
                    for (let sy = 1; sy <= 3; sy++) {
                        const subScreenY = screenY + (sy * (divSize / 4));
                        ctx.beginPath();
                        ctx.moveTo(Math.max(0, centerCanvasX + (startX - this.slidePos.x)), subScreenY);
                        ctx.lineTo(Math.min(width, centerCanvasX + (endX - this.slidePos.x)), subScreenY);
                        ctx.stroke();
                    }
                }
            }
        }
        
        ctx.restore();

        // 3. Draw Bacteria Cells
        const clumpMode = document.getElementById('chk-clump-mode') && document.getElementById('chk-clump-mode').checked;
        
        this.bacteria.forEach(b => {
            // Convert virtual coordinates to screen coordinates
            const screenX = centerCanvasX + (b.x - this.slidePos.x);
            const screenY = centerCanvasY + (b.y - this.slidePos.y);
            
            // Check if visible inside lens circle
            const distFromCenter = Math.hypot(screenX - width/2, screenY - height/2);
            if (distFromCenter < width/2 - 10) {
                // If counting clumps, highlight clumps in a slightly different hue
                let color = b.color;
                if (clumpMode) {
                    color = (b.type === 'clump') ? 'hsl(145, 80%, 50%)' : 'rgba(255,255,255,0.06)';
                }
                
                canvasUtils.drawBacterium(ctx, screenX, screenY, b.size, b.type, color, blurPx);
            }
        });

        // 4. Draw marker points for counted bacteria
        ctx.save();
        this.markedTally.forEach(m => {
            const screenX = centerCanvasX + (m.x - this.slidePos.x);
            const screenY = centerCanvasY + (m.y - this.slidePos.y);
            
            const distFromCenter = Math.hypot(screenX - width/2, screenY - height/2);
            if (distFromCenter < width/2 - 10) {
                // Draw small neon target circle
                ctx.strokeStyle = 'var(--color-green)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.fillStyle = 'var(--color-green)';
                ctx.beginPath();
                ctx.arc(screenX, screenY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.restore();
    }
}

export const microscope = new MicroscopeModule();
