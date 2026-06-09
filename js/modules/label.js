/* ==========================================================================
   FSSAI Virtual Microbiology Lab - Food Label Regulatory Analysis Module
   ========================================================================= */

import { audio, showNotification } from '../utils.js?v=1.4';
import { notebook } from '../notebook.js?v=1.4';

class LabelModule {
    constructor() {
        this.currentProduct = 'juice';
        this.hotspots = {
            juice: [
                { id: 'j-title', label: 'Product Name', x: 50, y: 15, text: 'Product Title: "Pure Orange Juice - 100% Squeezed". Compliance: Compliant. The product name clearly reflects its character.' },
                { id: 'j-veg', label: 'Veg/Non-Veg Dot', x: 85, y: 15, text: 'WARNING: Missing Veg/Non-Veg Logo! Under FSSAI (Labelling and Display) Regulations 2020, all packaged food must exhibit the green vegetarian dot (green circle in a green square). This label has no symbol.' },
                { id: 'j-fssai', label: 'FSSAI License', x: 20, y: 80, text: 'FSSAI Logo & License: "Lic. No. 10019022003456". Compliance: Compliant. Features the FSSAI logo and a valid 14-digit registration number.' },
                { id: 'j-ingredients', label: 'Ingredient List', x: 50, y: 55, text: 'Ingredients: Orange juice, water, vitamins. Compliance: Compliant. Listed in descending order of weight.' }
            ],
            formula: [
                { id: 'f-title', label: 'Product Title', x: 50, y: 15, text: 'Product Title: "GrowMax Infant Formula". Compliance: Compliant. Marked clearly as infant milk substitute.' },
                { id: 'f-allergen', label: 'Allergens & Ingredients', x: 50, y: 50, text: 'WARNING: Missing Allergen Warning! The ingredients list milk solids and soy lecithin, which are major allergens, but there is no mandatory bold allergen warning statement (e.g., "Contains Milk, Soy"). Non-compliant.' },
                { id: 'f-fssai', label: 'FSSAI License', x: 20, y: 80, text: 'WARNING: Non-Standard FSSAI License! The logo is present, but the license number is printed as "Lic No: 12345" which is only 5 digits. FSSAI requires a standard 14-digit license number starting with 1 or 2.' },
                { id: 'f-veg', label: 'Veg Dot', x: 80, y: 80, text: 'Veg Dot: Green square and circle symbol present. Compliance: Compliant.' }
            ],
            flour: [
                { id: 'fl-title', label: 'Product Title', x: 50, y: 15, text: 'Product Title: "Premium Wheat Flour (Atta)". Compliance: Compliant.' },
                { id: 'fl-veg', label: 'Veg Dot', x: 85, y: 15, text: 'Veg Dot: Green square and circle present. Compliance: Compliant.' },
                { id: 'fl-fssai', label: 'FSSAI License', x: 20, y: 80, text: 'FSSAI Logo & License: "Lic. No. 10014011001890". Compliance: Compliant. Valid 14-digit license number.' },
                { id: 'fl-allergen', label: 'Allergen Warning', x: 50, y: 70, text: 'Allergen Declaration: Contains Wheat (Gluten). Compliance: Compliant. Allergen warning is clearly visible and in bold.' }
            ]
        };

        this.audits = {
            juice: { checked: [], decision: '', status: 'Not audited' },
            formula: { checked: [], decision: '', status: 'Not audited' },
            flour: { checked: [], decision: '', status: 'Not audited' }
        };
    }

    init() {
        this.currentStep = 1;
        this.currentProduct = 'juice';
        this.resetChecklist();
        this.renderLabel();
        this.syncWithNotebook();
        this.bindEvents();
        this.setupSteps();
    }

    bindEvents() {
        // Product tab buttons in the UI
        const tabBtns = document.querySelectorAll('#viewport-label .product-tab-btn');
        tabBtns.forEach(btn => {
            btn.onclick = (e) => {
                // Determine product from onclick or text
                let prod = 'juice';
                if (e.target.textContent.includes('Formula')) prod = 'formula';
                else if (e.target.textContent.includes('Flour')) prod = 'flour';
                this.selectProduct(prod);
                
                // Update active tab styling
                tabBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                audio.playClick();
            };
        });
    }

    selectProduct(productName) {
        this.currentProduct = productName;
        this.resetChecklist();
        this.renderLabel();
        
        if (productName === 'juice') this.currentStep = 1;
        else if (productName === 'formula') this.currentStep = 2;
        else if (productName === 'flour') this.currentStep = 3;
        
        // Restore saved checkboxes/decision for this product
        const auditData = this.audits[productName];
        
        document.getElementById('chk-fail-fssai').checked = auditData.checked.includes('fssai');
        document.getElementById('chk-fail-veg').checked = auditData.checked.includes('veg');
        document.getElementById('chk-fail-allergen').checked = auditData.checked.includes('allergen');
        document.getElementById('chk-fail-units').checked = auditData.checked.includes('units');
        
        document.getElementById('label-audit-status').value = auditData.decision;
        
        document.getElementById('label-inspector-details').innerHTML = `
            <strong>Product Switched:</strong> ${productName === 'juice' ? 'Packaged Juice' : productName === 'formula' ? 'Infant Formula' : 'Wheat Flour'}<br/>
            Click on the pulsing green hotspots on the label preview to audit regulatory compliance details.
        `;

        // Update active tab styling in case it was triggered programmatically
        const tabBtns = document.querySelectorAll('#viewport-label .product-tab-btn');
        tabBtns.forEach(btn => {
            const txt = btn.textContent;
            if (productName === 'juice' && txt.includes('Juice')) btn.classList.add('active');
            else if (productName === 'formula' && txt.includes('Formula')) btn.classList.add('active');
            else if (productName === 'flour' && txt.includes('Flour')) btn.classList.add('active');
            else btn.classList.remove('active');
        });
        
        this.updateStepProgress();
    }

    setupSteps() {
        const steps = [
            { text: "Audit Packaged Juice Label", desc: "Select 'Packaged Juice'. Click on highlighted hotspots to inspect regulatory details. Mark any failures (e.g. missing Veg logo) and log the audit report." },
            { text: "Audit Infant Formula Label", desc: "Select 'Infant Formula'. Click on hotspots to inspect. Mark failures (e.g. missing bold allergen warning, non-standard 5-digit license) and log audit." },
            { text: "Audit Wheat Flour Bag Label", desc: "Select 'Wheat Flour Bag'. Click on hotspots to inspect. Verify compliance (all compliant) and log audit. Click 'Verify Label Audits' in the logbook." }
        ];
        
        const stepsList = document.getElementById('sim-steps-list');
        if (stepsList) {
            stepsList.innerHTML = steps.map((s, idx) => `
                <div class="sim-step ${idx === 0 ? 'active' : ''}" id="m1-step-${idx + 1}">
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
            const stepEl = document.getElementById(`m1-step-${i}`);
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
            const prods = ['juice', 'formula', 'flour'];
            this.selectProduct(prods[this.currentStep - 1]);
            audio.playClick();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            const prods = ['juice', 'formula', 'flour'];
            this.selectProduct(prods[this.currentStep - 1]);
            audio.playClick();
        }
    }

    resetChecklist() {
        document.getElementById('chk-fail-fssai').checked = false;
        document.getElementById('chk-fail-veg').checked = false;
        document.getElementById('chk-fail-allergen').checked = false;
        document.getElementById('chk-fail-units').checked = false;
        document.getElementById('label-audit-status').value = '';
    }

    renderLabel() {
        const previewBox = document.getElementById('rendered-label');
        if (!previewBox) return;

        let labelHtml = '';

        if (this.currentProduct === 'juice') {
            labelHtml = `
                <div style="width: 100%; height: 100%; padding: 20px; box-sizing: border-box; background: linear-gradient(135deg, #ff9900, #ff5500); color: #fff; font-family: sans-serif; position: relative; border-radius: 8px; border: 2px solid #fff;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Freshness Guaranteed</div>
                    <h2 style="margin: 4px 0 0 0; font-family: Georgia, serif; font-size: 24px; color: #fff; text-shadow: 1px 1px 3px rgba(0,0,0,0.3);">Orchard Fresh</h2>
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">100% Pure Orange Juice</div>
                    
                    <div style="background: rgba(255,255,255,0.15); padding: 8px; border-radius: 4px; font-size: 10px; margin-bottom: 8px; border-left: 3px solid #fff;">
                        <strong>Ingredients:</strong> Water, Orange Juice Concentrate (98.5%), Natural Vitamin C (Ascorbic Acid).
                    </div>
                    
                    <div style="font-size: 9px; line-height: 1.3;">
                        <strong>Nutritional Info (per 100ml):</strong> Energy 45 kcal, Sugar 9.5g, Sodium 5mg.
                    </div>
                    
                    <div style="position: absolute; bottom: 15px; left: 15px; display: flex; align-items: center; gap: 8px;">
                        <div style="border: 1px solid #fff; padding: 2px 4px; font-size: 8px; font-weight: bold; border-radius: 2px;">
                            Lic. No. 10019022003456
                        </div>
                    </div>
                    
                    <div style="position: absolute; bottom: 15px; right: 15px; font-size: 10px; font-weight: bold;">
                        Net Qty: 1 Liter
                    </div>
                </div>
            `;
        } else if (this.currentProduct === 'formula') {
            labelHtml = `
                <div style="width: 100%; height: 100%; padding: 20px; box-sizing: border-box; background: linear-gradient(135deg, #e0f2fe, #7dd3fc); color: #0f172a; font-family: sans-serif; position: relative; border-radius: 8px; border: 2px solid #0284c7;">
                    <div style="font-size: 9px; font-weight: bold; color: #0369a1; text-transform: uppercase;">Premium Infant Nutrition</div>
                    <h2 style="margin: 4px 0 0 0; font-family: Georgia, serif; font-size: 22px; color: #0369a1;">GrowMax Formula</h2>
                    <div style="font-size: 11px; margin-bottom: 6px; font-style: italic;">Stage 1: Infant Milk Substitute (0 to 6 months)</div>
                    
                    <div style="background: rgba(255,255,255,0.5); padding: 6px; border-radius: 4px; font-size: 9px; margin-bottom: 6px; border-left: 3px solid #0284c7;">
                        <strong>Ingredients:</strong> Lactose, Demineralized Whey Solids (from milk), Soy Lecithin, Medium Chain Triglycerides.
                    </div>
                    
                    <div style="font-size: 8px; line-height: 1.2; color: #334155;">
                        <strong>Warning:</strong> Infant food should be used only on the advice of a health worker.
                    </div>
                    
                    <div style="position: absolute; bottom: 12px; left: 12px; display: flex; align-items: center; gap: 6px;">
                        <div style="border: 1px solid #0284c7; padding: 1px 3px; font-size: 7px; font-weight: bold;">
                            Lic No: 12345
                        </div>
                        <div style="width: 12px; height: 12px; border: 1.5px solid #16a34a; display: flex; align-items: center; justify-content: center; background: #fff;">
                            <div style="width: 6px; height: 6px; border-radius: 50%; background: #16a34a;"></div>
                        </div>
                    </div>
                    
                    <div style="position: absolute; bottom: 12px; right: 12px; font-size: 9px; font-weight: bold; color: #0369a1;">
                        Weight: 400g e
                    </div>
                </div>
            `;
        } else if (this.currentProduct === 'flour') {
            labelHtml = `
                <div style="width: 100%; height: 100%; padding: 20px; box-sizing: border-box; background: linear-gradient(135deg, #fef3c7, #fde68a); color: #78350f; font-family: sans-serif; position: relative; border-radius: 8px; border: 2px solid #b45309;">
                    <div style="font-size: 10px; text-transform: uppercase; color: #b45309; font-weight: bold;">100% Whole Wheat</div>
                    <h2 style="margin: 4px 0 0 0; font-family: Georgia, serif; font-size: 24px; color: #78350f;">Aashirwad Atta</h2>
                    <div style="font-size: 13px; margin-bottom: 8px; font-weight: 500;">Stone-ground Whole Wheat Flour</div>
                    
                    <div style="font-size: 9px; background: rgba(255,255,255,0.4); padding: 6px; border-radius: 4px; margin-bottom: 6px;">
                        <strong>Ingredients:</strong> Whole Wheat. <span style="font-weight: bold; text-decoration: underline;">Allergen Warning: Contains Wheat (Gluten).</span>
                    </div>
                    
                    <div style="position: absolute; bottom: 15px; left: 15px; display: flex; align-items: center; gap: 8px;">
                        <div style="border: 1px solid #78350f; padding: 2px 4px; font-size: 8px; font-weight: bold; border-radius: 2px; display: flex; align-items: center; gap: 3px; background: #fff;">
                            <span style="color: #16a34a; font-weight: bold;">FSSAI</span> Lic. No. 10014011001890
                        </div>
                        <div style="width: 14px; height: 14px; border: 2px solid #16a34a; display: flex; align-items: center; justify-content: center; background: #fff;">
                            <div style="width: 7px; height: 7px; border-radius: 50%; background: #16a34a;"></div>
                        </div>
                    </div>
                    
                    <div style="position: absolute; bottom: 15px; right: 15px; font-size: 11px; font-weight: bold;">
                        Net Weight: 5 kg
                    </div>
                </div>
            `;
        }

        // Add hotspot indicators overlay
        let hotspotOverlay = '';
        const list = this.hotspots[this.currentProduct];
        list.forEach(hs => {
            hotspotOverlay += `
                <button class="hotspot-btn animate-pulse" 
                        style="position: absolute; top: ${hs.y}%; left: ${hs.x}%; width: 22px; height: 22px; background: rgba(16, 185, 129, 0.6); border: 2px solid #fff; border-radius: 50%; cursor: pointer; transform: translate(-50%, -50%); z-index: 10; box-shadow: 0 0 10px rgba(0,0,0,0.5);"
                        onclick="window.labelInspector.selectHotspot('${hs.id}')"
                        title="${hs.label}">
                </button>
            `;
        });

        previewBox.innerHTML = `
            <div style="position: relative; width: 100%; height: 260px; max-width: 380px; margin: auto; box-sizing: border-box;">
                ${labelHtml}
                ${hotspotOverlay}
            </div>
        `;
    }

    selectHotspot(id) {
        audio.playClick();
        const list = this.hotspots[this.currentProduct];
        const hs = list.find(item => item.id === id);
        
        if (hs) {
            const detailsBox = document.getElementById('label-inspector-details');
            if (detailsBox) {
                detailsBox.innerHTML = `
                    <h5 style="color: var(--color-cyan); margin-bottom: 6px;">${hs.label}</h5>
                    <p style="margin: 0; line-height: 1.4;">${hs.text}</p>
                `;
            }
        }
    }

    updateReport() {
        // Collect checked failures
        const checked = [];
        if (document.getElementById('chk-fail-fssai').checked) checked.push('fssai');
        if (document.getElementById('chk-fail-veg').checked) checked.push('veg');
        if (document.getElementById('chk-fail-allergen').checked) checked.push('allergen');
        if (document.getElementById('chk-fail-units').checked) checked.push('units');
        
        const decision = document.getElementById('label-audit-status').value;
        
        this.audits[this.currentProduct].checked = checked;
        this.audits[this.currentProduct].decision = decision;
    }

    submitAudit() {
        this.updateReport();
        const audit = this.audits[this.currentProduct];
        
        if (!audit.decision) {
            audio.playError();
            showNotification("Audit Error: You must select an Audit Decision (Passed/Failed) first.", "error");
            return;
        }

        audio.playSuccess();
        audit.status = audit.decision === 'compliant' ? 'Audited: Compliant' : 'Audited: Non-Compliant';
        showNotification(`Logged audit report for ${this.currentProduct === 'juice' ? 'Orange Juice' : this.currentProduct === 'formula' ? 'Infant Formula' : 'Wheat Flour'}.`, "success");
        
        this.syncWithNotebook();
    }

    syncWithNotebook() {
        const statuses = {
            juice: this.audits.juice.status,
            formula: this.audits.formula.status,
            flour: this.audits.flour.status
        };

        // Update the notebook class storage
        notebook.records.m1.juice = this.audits.juice;
        notebook.records.m1.formula = this.audits.formula;
        notebook.records.m1.flour = this.audits.flour;

        // Update HTML text directly
        const juiceSpan = document.getElementById('note-m1-juice-status');
        const formulaSpan = document.getElementById('note-m1-formula-status');
        const flourSpan = document.getElementById('note-m1-flour-status');

        if (juiceSpan) juiceSpan.textContent = statuses.juice;
        if (formulaSpan) formulaSpan.textContent = statuses.formula;
        if (flourSpan) flourSpan.textContent = statuses.flour;

        notebook.records.m1.verified = false;
        notebook.updateVerificationStatusDisplay(1);
        if (window.app) window.app.saveSession();
    }
}

export const labelInspector = new LabelModule();
window.labelInspector = labelInspector;

// Expose individual event handlers globally for index.html onclicks
notebook.m1_selectProduct = (prod) => labelInspector.selectProduct(prod);
notebook.m1_updateReport = () => labelInspector.updateReport();
notebook.m1_submitAudit = () => labelInspector.submitAudit();
