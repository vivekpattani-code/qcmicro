/* ==========================================================================
   FSSAI Virtual Microbiology Lab - Laboratory Notebook & Evaluation
   ========================================================================== */

import { audio } from './utils.js?v=1.4';

class LabNotebook {
    constructor() {
        this.records = {
            m1: { juice: null, formula: null, flour: null, verified: false },
            m2: { cells: null, dilution: 1, calculatedVal: null, verified: false },
            m3: { medium: null, dilutionSelected: null, colonies: null, calculatedVal: null, verified: false },
            m4: { coagulase: null, tsiColor: null, tsiGas: null, vrbaCount: null, embStatus: null, verified: false },
            m5: { organism: null, neutralizer: null, verified: false },
            m6: { ftm: null, scdm: null, verified: false },
            m7: { treatment: null, colonies: null, calculatedVal: null, verified: false }
        };

        this.quizScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
        this.quizTaken = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false };
        this.certificateNo = null;
    }

    // Load initial values from DOM inputs if any, or trigger log updating
    updateLogView(moduleNum) {
        const secId = `note-sec-m${moduleNum}`;
        document.querySelectorAll('.notebook-section').forEach(sec => sec.classList.remove('active'));
        document.querySelectorAll('.notebook-tab-btn').forEach(btn => btn.classList.remove('active'));
        
        const targetSec = document.getElementById(secId);
        const targetBtn = document.querySelector(`.notebook-tab-btn[data-note="m${moduleNum}"]`);
        
        if (targetSec && targetBtn) {
            targetSec.classList.add('active');
            targetBtn.classList.add('active');
        }
    }

    // Set values from Microscope count module (Module 2)
    logMicroscopeCount(cells, dilution) {
        this.records.m2.cells = cells;
        this.records.m2.dilution = dilution;
        
        const cellInput = document.getElementById('note-m2-cells');
        const dilInput = document.getElementById('note-m2-dilution');
        if (cellInput) cellInput.value = cells;
        if (dilInput) dilInput.value = dilution;
        
        // Reset verification status if values change
        this.records.m2.verified = false;
        this.updateVerificationStatusDisplay(2);
        if (window.app) window.app.saveSession();
    }

    // Set values from Dilution and Plate count module (Module 3)
    logPlatingData(medium, incubatorTemp, incubatorHours, dilutionName, colonies) {
        this.records.m3.medium = medium;
        this.records.m3.dilutionSelected = dilutionName;
        this.records.m3.colonies = colonies;
        
        const medLbl = document.getElementById('note-m3-medium');
        const incLbl = document.getElementById('note-m3-incubation');
        const dilLbl = document.getElementById('note-m3-dil-sel');
        const colInput = document.getElementById('note-m3-colonies');
        
        if (medLbl) medLbl.textContent = medium;
        if (incLbl) incLbl.textContent = `${incubatorTemp}°C for ${incubatorHours}h`;
        if (dilLbl) dilLbl.textContent = dilutionName;
        if (colInput) colInput.value = colonies;
        
        this.records.m3.verified = false;
        this.updateVerificationStatusDisplay(3);
        if (window.app) window.app.saveSession();
    }

    // Set values for Pathogens (Module 4)
    logPathogenData(type, value) {
        if (type === 'coagulase') {
            this.records.m4.coagulase = value;
            const element = document.getElementById('note-m4-coag-status');
            if (element) element.textContent = value;
        } else if (type === 'tsi') {
            this.records.m4.tsiColor = value.color;
            this.records.m4.tsiGas = value.gas;
            const colElement = document.getElementById('note-m4-tsi-color');
            const gasElement = document.getElementById('note-m4-tsi-gas');
            if (colElement) colElement.textContent = value.color;
            if (gasElement) gasElement.textContent = value.gas;
        } else if (type === 'coliform') {
            this.records.m4.vrbaCount = value.vrba;
            this.records.m4.embStatus = value.emb;
            const vrbaElement = document.getElementById('note-m4-col-vrba');
            const embElement = document.getElementById('note-m4-col-emb');
            if (vrbaElement) vrbaElement.textContent = value.vrba + ' CFU';
            if (embElement) embElement.textContent = value.emb;
        }
        
        this.records.m4.verified = false;
        this.updateVerificationStatusDisplay(4);
        if (window.app) window.app.saveSession();
    }

    // Verify mathematical calculations submitted by students
    verifyCalculation(moduleNum) {
        const statusElement = document.getElementById(`log-status-m${moduleNum}`);
        audio.init();
        
        if (moduleNum === 1) {
            const j = this.records.m1.juice;
            const f = this.records.m1.formula;
            const fl = this.records.m1.flour;
            
            if (!j || !f || !fl || j.decision === '' || f.decision === '' || fl.decision === '') {
                audio.playError();
                this.showStatus(statusElement, "Failed: Complete audits for all 3 products first.", "failed");
                return;
            }
            
            const jCorrect = j.decision === 'noncompliant' && j.checked.includes('veg') && j.checked.length === 1;
            const fCorrect = f.decision === 'noncompliant' && f.checked.includes('allergen') && f.checked.includes('fssai') && f.checked.length === 2;
            const flCorrect = fl.decision === 'compliant' && fl.checked.length === 0;
            
            if (jCorrect && fCorrect && flCorrect) {
                audio.playSuccess();
                this.records.m1.verified = true;
                this.showStatus(statusElement, "Verified ✓ Food label regulatory audits are correct.", "verified");
                this.addGlobalScore(10);
            } else {
                audio.playError();
                let errors = [];
                if (!jCorrect) errors.push("Juice audit incorrect");
                if (!fCorrect) errors.push("Formula audit incorrect");
                if (!flCorrect) errors.push("Flour audit incorrect");
                this.showStatus(statusElement, "Failed: " + errors.join(", ") + ".", "failed");
            }
        }
        else if (moduleNum === 2) {
            const studentCalc = document.getElementById('note-m2-calc').value.trim();
            if (!studentCalc || this.records.m2.cells === null) {
                audio.playError();
                this.showStatus(statusElement, "Error: No count data available", "failed");
                return;
            }
            
            const cells = parseInt(this.records.m2.cells);
            const dilution = parseInt(this.records.m2.dilution);
            const expectedVal = cells * dilution * 50000;
            
            const parsedStudent = parseFloat(studentCalc.replace(/,/g, ''));
            
            if (Math.abs(parsedStudent - expectedVal) < 1) {
                audio.playSuccess();
                this.records.m2.verified = true;
                this.records.m2.calculatedVal = expectedVal;
                this.showStatus(statusElement, "Verified ✓ Correct count of " + expectedVal.toLocaleString() + " Cells/mL", "verified");
                this.addGlobalScore(10);
            } else {
                audio.playError();
                this.showStatus(statusElement, "Failed: Check formula. (Cells counted &times; Dilution &times; 50,000)", "failed");
            }
        } 
        else if (moduleNum === 3) {
            const studentCalc = document.getElementById('note-m3-calc').value.trim();
            if (!studentCalc || this.records.m3.colonies === null) {
                audio.playError();
                this.showStatus(statusElement, "Error: No colony count data available", "failed");
                return;
            }

            const colonies = parseInt(this.records.m3.colonies);
            let dilutionFactor = 1;
            const dilString = this.records.m3.dilutionSelected;
            if (dilString && dilString.includes("10^-")) {
                const exponent = parseInt(dilString.replace("10^-", ""));
                dilutionFactor = Math.pow(10, exponent);
            } else {
                dilutionFactor = 1;
            }
            
            const expectedVal = colonies * dilutionFactor;
            const parsedStudent = parseFloat(studentCalc.replace(/,/g, ''));
            
            if (Math.abs(parsedStudent - expectedVal) < 1) {
                if (colonies >= 30 && colonies <= 300) {
                    audio.playSuccess();
                    this.records.m3.verified = true;
                    this.records.m3.calculatedVal = expectedVal;
                    this.showStatus(statusElement, "Verified ✓ Correct count of " + expectedVal.toLocaleString() + " CFU/mL", "verified");
                    this.addGlobalScore(10);
                } else {
                    audio.playError();
                    this.showStatus(statusElement, "Error: Count is " + colonies + ". FSSAI standards require a plate between 30 and 300 colonies for calculations.", "failed");
                }
            } else {
                audio.playError();
                this.showStatus(statusElement, "Failed: Check formula. (Colonies counted &times; Dilution Factor)", "failed");
            }
        }
        else if (moduleNum === 4) {
            if (this.records.m4.coagulase === "Firm Clot (Positive)" && 
                this.records.m4.tsiColor === "K/A (Alkaline/Acid)" &&
                this.records.m4.tsiGas === "Positive" &&
                this.records.m4.embStatus === "Metallic Green Sheen (Positive E.coli)") {
                audio.playSuccess();
                this.records.m4.verified = true;
                this.showStatus(statusElement, "Verified ✓ Pathogen Identification logs are complete and correct.", "verified");
                this.addGlobalScore(10);
            } else {
                audio.playError();
                this.showStatus(statusElement, "Failed: Incomplete or incorrect pathogen reactions in lab journal.", "failed");
            }
        }
        else if (moduleNum === 5) {
            if (this.records.m5.neutralizer !== "Lecithin + Polysorbate 80") {
                audio.playError();
                this.showStatus(statusElement, "Failed: Preservative neutralization failed. (Correct neutralizing agent must be selected)", "failed");
                return;
            }

            const d0_cfu = document.getElementById('note-m5-d0-cfu').value.trim();
            const d7_cfu = document.getElementById('note-m5-d7-cfu').value.trim();
            const d7_red = document.getElementById('note-m5-d7-red').value.trim();
            const d14_cfu = document.getElementById('note-m5-d14-cfu').value.trim();
            const d14_red = document.getElementById('note-m5-d14-red').value.trim();
            const d28_cfu = document.getElementById('note-m5-d28-cfu').value.trim();
            const d28_red = document.getElementById('note-m5-d28-red').value.trim();

            if (!d0_cfu || !d7_cfu || !d7_red || !d14_cfu || !d14_red || !d28_cfu || !d28_red) {
                audio.playError();
                this.showStatus(statusElement, "Failed: Complete all AET log table fields.", "failed");
                return;
            }

            const parseVal = (str) => parseFloat(str.replace(/,/g, ''));
            const pD0 = parseVal(d0_cfu);
            const pD7 = parseVal(d7_cfu);
            const pD7Red = parseFloat(d7_red);
            const pD14 = parseVal(d14_cfu);
            const pD14Red = parseFloat(d14_red);
            const pD28 = parseVal(d28_cfu);
            const pD28Red = parseFloat(d28_red);

            let expected = {};
            if (this.records.m5.organism === 'Staph. aureus') {
                expected = {
                    d0: 1200000,
                    d7: 900, d7Red: 3.13,
                    d14: 60, d14Red: 4.30,
                    d28: 0, d28Red: 6.08
                };
            } else if (this.records.m5.organism === 'Candida albicans') {
                expected = {
                    d0: 1500000,
                    d7: 1100000, d7Red: 0.14,
                    d14: 75000, d14Red: 1.30,
                    d28: 4500, d28Red: 2.53
                };
            } else {
                audio.playError();
                this.showStatus(statusElement, "Failed: Run challenge inoculation first.", "failed");
                return;
            }

            const c0 = Math.abs(pD0 - expected.d0) / expected.d0 < 0.05;
            const c7 = Math.abs(pD7 - expected.d7) / (expected.d7 || 1) < 0.05;
            const c7Red = Math.abs(pD7Red - expected.d7Red) <= 0.15;
            const c14 = Math.abs(pD14 - expected.d14) / (expected.d14 || 1) < 0.05;
            const c14Red = Math.abs(pD14Red - expected.d14Red) <= 0.15;
            const c28 = pD28 === expected.d28 || Math.abs(pD28 - expected.d28) / (expected.d28 || 1) < 0.05;
            const c28Red = Math.abs(pD28Red - expected.d28Red) <= 0.15;

            if (c0 && c7 && c7Red && c14 && c14Red && c28 && c28Red) {
                audio.playSuccess();
                this.records.m5.verified = true;
                this.showStatus(statusElement, "Verified ✓ Efficacy math matches challenge outcomes.", "verified");
                this.addGlobalScore(10);
            } else {
                audio.playError();
                let fails = [];
                if (!c0) fails.push("Day 0 CFU");
                if (!c7 || !c7Red) fails.push("Day 7 math");
                if (!c14 || !c14Red) fails.push("Day 14 math");
                if (!c28 || !c28Red) fails.push("Day 28 math");
                this.showStatus(statusElement, "Failed: Check math for " + fails.join(", ") + ".", "failed");
            }
        }
        else if (moduleNum === 6) {
            const ftm = this.records.m6.ftm;
            const scdm = this.records.m6.scdm;

            if (!ftm || ftm === "Not inoculated" || ftm.includes("Awaiting") || 
                !scdm || scdm === "Not inoculated" || scdm.includes("Awaiting")) {
                audio.playError();
                this.showStatus(statusElement, "Failed: Direct sterility test must be inoculated and incubated.", "failed");
                return;
            }

            if (ftm === "Clear (No Growth)" && scdm === "Clear (No Growth)") {
                audio.playSuccess();
                this.records.m6.verified = true;
                this.showStatus(statusElement, "Verified ✓ Direct sterility checks comply with USP <71> criteria.", "verified");
                this.addGlobalScore(10);
            } else {
                audio.playError();
                this.showStatus(statusElement, "Failed: Direct sterility test shows contamination (turbid growth detected). Test saline sample to verify sterility.", "failed");
            }
        }
        else if (moduleNum === 7) {
            const colonies = this.records.m7.colonies;
            const studentCalc = document.getElementById('note-m7-swab-calc').value.trim();

            if (colonies === null || !studentCalc) {
                audio.playError();
                this.showStatus(statusElement, "Failed: Swab test must be run and CFU/cm² calculated.", "failed");
                return;
            }

            const expectedVal = colonies / 10.0;
            const parsedStudent = parseFloat(studentCalc);

            if (Math.abs(parsedStudent - expectedVal) < 0.01) {
                audio.playSuccess();
                this.records.m7.verified = true;
                this.records.m7.calculatedVal = expectedVal;
                this.showStatus(statusElement, "Verified ✓ Sanitation density math is correct.", "verified");
                this.addGlobalScore(10);
            } else {
                audio.playError();
                this.showStatus(statusElement, "Failed: Swab calculation incorrect. (Colonies / 10 for 100 cm² area and 10x dilution)", "failed");
            }
        }
        
        this.checkCertificateStatus();
        if (window.app) window.app.saveSession();
    }

    updateVerificationStatusDisplay(moduleNum) {
        const statusElement = document.getElementById(`log-status-m${moduleNum}`);
        if (!statusElement) return;
        if (this.records[`m${moduleNum}`].verified) {
            this.showStatus(statusElement, "Verified ✓ Complete", "verified");
        } else {
            this.showStatus(statusElement, "Status: Unverified", "muted");
        }
    }

    showStatus(element, text, className) {
        element.textContent = text;
        element.className = "log-status-msg " + className;
    }

    addGlobalScore(points) {
        this.recalculateScore();
    }

    recalculateScore() {
        let score = 0;
        // Logs: 10 pts each
        for (let i = 1; i <= 7; i++) {
            const mRecord = this.records[`m${i}`];
            if (mRecord && mRecord.verified) score += 10;
        }
        
        // Quizzes: 15 pts each max (based on percentage correct)
        for (let i = 1; i <= 7; i++) {
            score += (this.quizScores[i] || 0) * 15;
        }
        
        const scoreVal = Math.round((score / 175) * 100);
        document.getElementById('user-score').textContent = `Score: ${scoreVal} / 100`;
        
        // Card updates
        for(let i=1; i<=7; i++) {
            const card = document.querySelector(`.module-card:nth-child(${i})`);
            if (!card) continue;
            const statusLbl = card.querySelector('.status-lbl');
            if (!statusLbl) continue;
            
            const mRecord = this.records[`m${i}`];
            const logsVerified = mRecord && mRecord.verified;
            const quizDone = this.quizTaken[i];
            
            if (logsVerified && quizDone) {
                statusLbl.textContent = "Completed";
                statusLbl.className = "status-lbl completed";
            } else if (logsVerified || quizDone) {
                statusLbl.textContent = "In Progress";
                statusLbl.className = "status-lbl active";
            } else {
                statusLbl.textContent = "Not Started";
                statusLbl.className = "status-lbl";
            }
        }
    }

    submitQuizScore(moduleNum, fractionCorrect) {
        this.quizScores[moduleNum] = fractionCorrect;
        this.quizTaken[moduleNum] = true;
        this.recalculateScore();
        this.checkCertificateStatus();
        if (window.app) window.app.saveSession();
    }

    checkCertificateStatus() {
        let allDone = true;
        let completedCount = 0;
        for (let i = 1; i <= 7; i++) {
            const mRecord = this.records[`m${i}`];
            const mDone = mRecord && mRecord.verified && this.quizTaken[i];
            if (mDone) completedCount++;
            else allDone = false;
        }
        
        // Calculate final score percentage
        let score = 0;
        for (let i = 1; i <= 7; i++) {
            const mRecord = this.records[`m${i}`];
            if (mRecord && mRecord.verified) score += 10;
        }
        for (let i = 1; i <= 7; i++) {
            score += (this.quizScores[i] || 0) * 15;
        }
        const finalScoreVal = Math.round((score / 175) * 100);
        
        const certBadge = document.getElementById('cert-badge');
        const certBtn = document.getElementById('btn-view-certificate');
        const certMsg = document.getElementById('cert-status-msg');
        
        if (allDone && finalScoreVal >= 75) {
            certBadge.classList.remove('locked');
            certBtn.classList.remove('disabled');
            certBtn.disabled = false;
            certMsg.innerHTML = "<strong>Congratulations!</strong> You have passed with a final score of " + finalScoreVal + "%. Click the button to claim and print your FSSAI Analyst Certificate.";
            return true;
        } else if (allDone && finalScoreVal < 75) {
            certMsg.innerHTML = "<strong>Evaluation Failed:</strong> Your score of " + finalScoreVal + "% is below the passing limit (75%). Please reset quizzes or check notebook calculations to improve your score.";
            certBtn.classList.add('disabled');
            certBtn.disabled = true;
            certBadge.classList.add('locked');
        } else {
            certMsg.textContent = `Complete all 7 modules with a grade of 75% or higher to unlock certification. (${completedCount} of 7 completed)`;
            certBtn.classList.add('disabled');
            certBtn.disabled = true;
            certBadge.classList.add('locked');
        }
        return false;
    }

    showCertificate() {
        let score = 0;
        for (let i = 1; i <= 7; i++) {
            const mRecord = this.records[`m${i}`];
            if (mRecord && mRecord.verified) score += 10;
        }
        for (let i = 1; i <= 7; i++) {
            score += (this.quizScores[i] || 0) * 15;
        }
        const finalScoreVal = Math.round((score / 175) * 100);
        
        if (!this.certificateNo) {
            const randomId = Math.floor(1000 + Math.random() * 9000);
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            this.certificateNo = `FSSAI-MAL-${dateStr}-${randomId}`;
            if (window.app) window.app.saveSession();
        }
        
        document.getElementById('cert-final-score').textContent = finalScoreVal + "%";
        document.getElementById('cert-date').textContent = new Date().toISOString().split('T')[0];
        
        const certNumberEl = document.getElementById('cert-number');
        if (certNumberEl) {
            certNumberEl.textContent = this.certificateNo;
        }
        
        // Show modal
        const modal = document.getElementById('cert-modal');
        if (modal) {
            modal.classList.add('open');
            audio.playSuccess();
        }
    }

    downloadCertificateImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 2000;
        canvas.height = 1414;
        const ctx = canvas.getContext('2d');
        
        // 1. Draw Cream Background
        ctx.fillStyle = '#fdfbf7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 2. Draw Borders
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 3;
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
        ctx.lineWidth = 8;
        ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);
        
        // 3. Draw Corner Details
        ctx.lineWidth = 2;
        const offset = 60;
        ctx.strokeRect(offset + 10, offset + 10, 40, 40);
        ctx.strokeRect(canvas.width - offset - 50, offset + 10, 40, 40);
        ctx.strokeRect(offset + 10, canvas.height - offset - 50, 40, 40);
        ctx.strokeRect(canvas.width - offset - 50, canvas.height - offset - 50, 40, 40);
        
        // 4. Draw Title & Subtitle
        ctx.fillStyle = '#1e3a8a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 56px Georgia, serif';
        ctx.fillText("FOOD SAFETY STANDARDS AUTHORITY", canvas.width / 2, 260);
        
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.fillText("MICROBIAL QUALITY CONTROL IN FOOD AND PHARMACEUTICAL INDUSTRIES", canvas.width / 2, 340);
        
        // 5. Draw Certifies text
        ctx.font = 'italic 24px Arial, sans-serif';
        ctx.fillText("This certifies that the Laboratory QA Specialist", canvas.width / 2, 460);
        
        // 6. Draw Name
        const name = document.getElementById('cert-name-input-field')?.value || 'Trial';
        ctx.fillStyle = '#1a243e';
        ctx.font = 'bold 72px Georgia, serif';
        ctx.fillText(name, canvas.width / 2, 570);
        
        // 7. Draw completion text
        ctx.fillStyle = '#334155';
        ctx.font = '24px Arial, sans-serif';
        ctx.fillText("has successfully completed the practical virtual simulation and theoretical examinations for", canvas.width / 2, 680);
        
        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold 38px Georgia, serif';
        ctx.fillText("Advanced Microbiological Enumeration & Food Analysis", canvas.width / 2, 760);
        
        // 8. Draw Compliance details
        ctx.fillStyle = '#334155';
        ctx.font = '18px Arial, sans-serif';
        ctx.fillText("Demonstrated competence in food label regulatory audits, Petroff-Hausser microscopic counting, serial dilution plating,", canvas.width / 2, 880);
        ctx.fillText("pathogen selective suite assays, USP <51> preservative challenge testing, USP <71> direct sterility audits,", canvas.width / 2, 915);
        ctx.fillText("and cleanroom surface swab sanitation monitoring in compliance with FSSAI 15.001:2024 and ISO 4833 standards.", canvas.width / 2, 950);
        
        // 9. Draw Certificate Number
        const certNo = this.certificateNo || 'FSSAI-MAL-20260606-0000';
        ctx.fillStyle = '#475569';
        ctx.font = '16px monospace';
        ctx.textAlign = 'right';
        ctx.fillText("CERTIFICATE NO: " + certNo, canvas.width - 90, 100);
        
        // 10. Draw Footer items (Signatures, Scores, Dates)
        ctx.textAlign = 'center';
        const yFooter = 1180;
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 2;
        
        // Signature Box
        ctx.beginPath();
        ctx.moveTo(250, yFooter);
        ctx.lineTo(550, yFooter);
        ctx.stroke();
        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'italic 32px Georgia, serif';
        ctx.fillText("Trial", 400, yFooter - 30);
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 18px Arial, sans-serif';
        ctx.fillText("VIRTUAL LAB DIRECTOR", 400, yFooter + 25);
        
        // Score Box
        ctx.beginPath();
        ctx.moveTo(850, yFooter);
        ctx.lineTo(1150, yFooter);
        ctx.stroke();
        ctx.fillStyle = '#16a34a';
        ctx.font = 'bold 32px monospace';
        const scoreVal = document.getElementById('cert-final-score')?.textContent || '95%';
        ctx.fillText(scoreVal, 1000, yFooter - 30);
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 18px Arial, sans-serif';
        ctx.fillText("PASSING SCORE", 1000, yFooter + 25);
        
        // Date Box
        ctx.beginPath();
        ctx.moveTo(1450, yFooter);
        ctx.lineTo(1750, yFooter);
        ctx.stroke();
        ctx.fillStyle = '#334155';
        ctx.font = '32px Georgia, serif';
        const dateVal = document.getElementById('cert-date')?.textContent || '2026-06-06';
        ctx.fillText(dateVal, 1600, yFooter - 30);
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 18px Arial, sans-serif';
        ctx.fillText("DATE OF EXAMINATION", 1600, yFooter + 25);
        
        // 11. Trigger Download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `FSSAI_Analyst_Certificate_${name.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
    }

    restoreNotebookDOM() {
        // Module 1 (Label)
        const r1 = this.records.m1;
        const m1Juice = document.getElementById('note-m1-juice-status');
        const m1Formula = document.getElementById('note-m1-formula-status');
        const m1Flour = document.getElementById('note-m1-flour-status');
        if (m1Juice && r1 && r1.juice) m1Juice.textContent = r1.juice.status || 'Not audited';
        if (m1Formula && r1 && r1.formula) m1Formula.textContent = r1.formula.status || 'Not audited';
        if (m1Flour && r1 && r1.flour) m1Flour.textContent = r1.flour.status || 'Not audited';
        this.updateVerificationStatusDisplay(1);

        // Module 2 (Microscope)
        const r2 = this.records.m2;
        const m2Cells = document.getElementById('note-m2-cells');
        const m2Dil = document.getElementById('note-m2-dilution');
        const m2Calc = document.getElementById('note-m2-calc');
        if (m2Cells && r2.cells !== null) m2Cells.value = r2.cells;
        if (m2Dil && r2.dilution !== null) m2Dil.value = r2.dilution;
        if (m2Calc && r2.calculatedVal !== null) m2Calc.value = r2.calculatedVal;
        this.updateVerificationStatusDisplay(2);

        // Module 3 (Plating)
        const r3 = this.records.m3;
        const m3Med = document.getElementById('note-m3-medium');
        const m3Inc = document.getElementById('note-m3-incubation');
        const m3Dil = document.getElementById('note-m3-dil-sel');
        const m3Cols = document.getElementById('note-m3-colonies');
        const m3Calc = document.getElementById('note-m3-calc');
        if (m3Med && r3.medium !== null) m3Med.textContent = r3.medium;
        if (m3Dil && r3.dilutionSelected !== null) m3Dil.textContent = r3.dilutionSelected;
        if (m3Cols && r3.colonies !== null) m3Cols.value = r3.colonies;
        if (m3Calc && r3.calculatedVal !== null) m3Calc.value = r3.calculatedVal;
        this.updateVerificationStatusDisplay(3);

        // Module 4 (Pathogen)
        const r4 = this.records.m4;
        const m4Coag = document.getElementById('note-m4-coag-status');
        const m4Color = document.getElementById('note-m4-tsi-color');
        const m4Gas = document.getElementById('note-m4-tsi-gas');
        const m4Vrba = document.getElementById('note-m4-col-vrba');
        const m4Emb = document.getElementById('note-m4-col-emb');
        if (m4Coag && r4.coagulase !== null) m4Coag.textContent = r4.coagulase;
        if (m4Color && r4.tsiColor !== null) m4Color.textContent = r4.tsiColor;
        if (m4Gas && r4.tsiGas !== null) m4Gas.textContent = r4.tsiGas;
        if (m4Vrba && r4.vrbaCount !== null) m4Vrba.textContent = r4.vrbaCount + ' CFU';
        if (m4Emb && r4.embStatus !== null) m4Emb.textContent = r4.embStatus;
        this.updateVerificationStatusDisplay(4);

        // Module 5 (AET)
        const r5 = this.records.m5;
        const m5Org = document.getElementById('note-m5-organism');
        const m5Neut = document.getElementById('note-m5-neutralizer');
        if (m5Org && r5 && r5.organism !== null) m5Org.textContent = r5.organism;
        if (m5Neut && r5 && r5.neutralizer !== null) m5Neut.textContent = r5.neutralizer;
        // Also restore AET table inputs
        const d0Input = document.getElementById('note-m5-d0-cfu');
        const d7CfuInput = document.getElementById('note-m5-d7-cfu');
        const d7RedInput = document.getElementById('note-m5-d7-red');
        const d14CfuInput = document.getElementById('note-m5-d14-cfu');
        const d14RedInput = document.getElementById('note-m5-d14-red');
        const d28CfuInput = document.getElementById('note-m5-d28-cfu');
        const d28RedInput = document.getElementById('note-m5-d28-red');
        
        // We can let the session restore inputs if we store them, or they stay in DOM if not re-rendered.
        // It is safer to restore if session contains them.
        this.updateVerificationStatusDisplay(5);

        // Module 6 (Sterility)
        const r6 = this.records.m6;
        const m6Ftm = document.getElementById('note-m6-ftm');
        const m6Scdm = document.getElementById('note-m6-scdm');
        if (m6Ftm && r6 && r6.ftm !== null) m6Ftm.textContent = r6.ftm;
        if (m6Scdm && r6 && r6.scdm !== null) m6Scdm.textContent = r6.scdm;
        this.updateVerificationStatusDisplay(6);

        // Module 7 (Swab)
        const r7 = this.records.m7;
        const m7Treat = document.getElementById('note-m7-swab-treatment');
        const m7Count = document.getElementById('note-m7-swab-count');
        const m7Calc = document.getElementById('note-m7-swab-calc');
        if (m7Treat && r7 && r7.treatment !== null) {
            let tText = 'Not tested';
            if (r7.treatment === 'control') tText = 'Untreated Control';
            else if (r7.treatment === 'ethanol') tText = '70% Ethanol';
            else if (r7.treatment === 'bleach') tText = '10% Bleach';
            m7Treat.textContent = tText;
        }
        if (m7Count && r7 && r7.colonies !== null) m7Count.textContent = r7.colonies + ' CFU';
        if (m7Calc && r7 && r7.calculatedVal !== null) m7Calc.value = r7.calculatedVal;
        this.updateVerificationStatusDisplay(7);
    }
}

export const notebook = new LabNotebook();
window.notebook = notebook; // Expose globally for HTML onclicks
