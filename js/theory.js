/* ==========================================================================
   FSSAI Virtual Microbiology Lab - Theory and Reference Database
   ========================================================================= */

export const theoryData = {
    1: {
        title: "Food Label Regulatory Analysis",
        badge: "FSSAI Label Audits",
        content: `
            <h3>Module 1: Food Label Regulatory Analysis</h3>
            
            <h4>1. Aim</h4>
            <p>To inspect and audit commercial food product labels for compliance with FSSAI (Labelling and Display) Regulations, identifying missing or non-standard regulatory information.</p>

            <h4>2. Theory</h4>
            <p>FSSAI regulations mandate that all pre-packaged foods display specific information to protect consumers and ensure transparency. Critical requirements include: product name, ingredient list, nutritional facts, vegetarian/non-vegetarian symbols, FSSAI logo and 14-digit license number, allergen declarations, and net quantity in standard metric units.</p>

            <h4>3. Principle</h4>
            <ul>
                <li><strong>Vegetarian/Non-Vegetarian Logo:</strong> Every vegetarian package must have a green color filled circle inside a square border with a green outline. Non-vegetarian foods must have a brown circle in a brown square. Missing this symbol is a severe regulatory violation.</li>
                <li><strong>Allergen Declaration:</strong> Under FSSAI Chapter 2, major allergen sources (e.g., milk solids, soy, gluten, nuts, fish) must be clearly declared in bold or within a separate warning box (e.g., "Contains Milk, Soy").</li>
                <li><strong>FSSAI Registration & License:</strong> The package must display the FSSAI logo alongside a valid 14-digit license number (starting with 1 or 2). Short placeholders or temporary serial numbers fail compliance audits.</li>
                <li><strong>Net Quantity & Standard Units:</strong> Product weight or volume must be displayed using standard metric units (e.g., g, kg, mL, L) in the prescribed format.</li>
            </ul>

            <h4>4. Materials Required</h4>
            <ul>
                <li>Digital food label specimens (Orange Juice, Infant Formula, Wheat Flour)</li>
                <li>FSSAI Food Safety and Standards (Labelling and Display) Regulations Manual (2020)</li>
                <li>Compliance checklist audit forms</li>
            </ul>

            <h4>5. Process</h4>
            <ol>
                <li><strong>Select Label:</strong> Toggle through the product specimens in the workbench sidebar.</li>
                <li><strong>Audit Hotspots:</strong> Click on highlighted hotspots on the label to inspect their technical details against FSSAI guidelines.</li>
                <li><strong>Check Violations:</strong> Check any compliance failures discovered on the checklist.</li>
                <li><strong>Submit Decision:</strong> Select whether the label is "Compliant" or "Non-Compliant" and click log audit report.</li>
            </ol>

            <h4>6. References</h4>
            <ul>
                <li>FSSAI Food Safety and Standards (Labelling and Display) Regulations, 2020.</li>
            </ul>
        `,
        interpretation: `
            <h3>Module 1: Food Label Audit Interpretation Guide</h3>
            <div class="interpretation-slider-container">
                <button class="slider-arrow prev-arrow" type="button"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="interpretation-slider-track">
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 140px; height: 100px; background: linear-gradient(135deg, #ff9900, #ff5500); border-radius: 6px; display: flex; justify-content: center; align-items: center; color: #fff; font-weight: bold; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">JUICE</div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Orange Juice Label</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Status: Non-Compliant.</strong><br/>
                                <strong>Reason:</strong> Missing Veg/Non-Veg dot. Juices are vegetarian products and must display the green circle symbol.
                            </p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 140px; height: 100px; background: linear-gradient(135deg, #e0f2fe, #7dd3fc); border-radius: 6px; display: flex; justify-content: center; align-items: center; color: #0369a1; font-weight: bold; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">FORMULA</div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Infant Formula Label</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Status: Non-Compliant.</strong><br/>
                                <strong>Reason:</strong> 1) Missing bold allergen warning (contains milk and soy ingredients). 2) Non-standard FSSAI license format (printed as 5-digit instead of 14-digit).
                            </p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 140px; height: 100px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 6px; display: flex; justify-content: center; align-items: center; color: #78350f; font-weight: bold; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">FLOUR</div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Wheat Flour Label</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Status: Compliant.</strong><br/>
                                <strong>Reason:</strong> Displays a green Veg dot, valid 14-digit FSSAI license, clear ingredients list, and bold allergen warning ("Contains Wheat (Gluten)").
                            </p>
                        </div>
                    </div>
                </div>
                <button class="slider-arrow next-arrow" type="button"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="slider-indicators"></div>
        `
    },
    2: {
        title: "Direct Microscopic Count (DMC)",
        badge: "FSSAI Platform Screening",
        content: `
            <h3>Module 2: Direct Microscopic Count (DMC)</h3>
            
            <h4>1. Aim</h4>
            <p>To determine the total bacterial load and cell count per mL of a liquid food or dairy sample using a Petroff-Hausser counting chamber and light microscopy, and to understand the distinction between clump counts and individual cell counts.</p>

            <h4>2. Theory</h4>
            <p>Direct Microscopic Count (DMC) is a rapid physical counting method that provides an immediate estimate of total microbial population without the delay of incubation. It is highly valued in the dairy and food industries for grading raw milk at platform reception and screening incoming liquid supplies. FSSAI recommends DMC as an official platform screening tool to grade incoming raw dairy milk prior to processing.</p>
            <p><strong>DMC Methodologies:</strong>
                <ul>
                    <li><strong>Breed Smear Method (Standard DMC Smear):</strong> Deposit exactly <strong>0.01 mL</strong> of milk sample onto a clean glass slide and spread it evenly over an area of <strong>1 cm²</strong> using a template. The smear is dried, fixed, and stained with the <strong>Newman-Lampert stain</strong> (a methylene blue formulation). Under a light microscope equipped with a <strong>100x oil immersion objective</strong>, the average number of bacterial cells per field is determined. An oil immersion lens is critical because oil matches the refractive index of glass, preventing light rays from refracting away, thereby maintaining high optical resolution and image clarity.</li>
                    <li><strong>Petroff-Hausser Chamber Method:</strong> Uses a specialized thick glass slide with an etched Neubauer grid and a cover glass to count cells in liquid suspension.</li>
                </ul>
            </p>
            <p>Because it uses basic optics and counts all visible cells, DMC has operational limitations: it cannot differentiate between living (viable) and dead cells, and it has a relatively low sensitivity limit (~10<sup>6</sup> to 10<sup>7</sup> Cells/mL). It is used strictly as a <em>screening tool</em> rather than a final confirmatory test.</p>

            <h4>3. Principle</h4>
            <p>For the Petroff-Hausser counting chamber, the chamber depth (distance between cover glass and grid) is exactly <strong>0.02 mm (1/50 mm)</strong>. The total ruled grid has an area of 1 mm². Given a depth of 0.02 mm, the volume of liquid directly over the 1 mm² grid is 0.02 mm³ (or 0.02 μL). To convert the count observed in this grid area to 1 mL (1,000 mm³), we multiply the count by a chamber factor of <strong>50,000</strong> (derived as 1,000 / 0.02).</p>
            <p>For the Breed Smear Method, the <strong>Microscopic Factor (MF)</strong> represents the number of fields of that size in 1 cm², divided by the sample volume (0.01 mL). It is mathematically defined as:</p>
            <blockquote>
                <strong>Microscopic Factor Formula:</strong> <code>MF = Smear Area (100 mm²) / (Area of microscopic field &times; Volume of sample)</code>
            </blockquote>
            <p>If the microscopic field diameter is <strong>0.16 mm</strong>, the area of the field is &pi; &times; (0.08 mm)&sup2; &approx; 0.0201 mm&sup2;. With a 0.01 mL sample volume, the microscopic factor is <strong>approximately 500,000</strong>. The mathematical counting formula for the original sample is:</p>
            <blockquote>
                <strong>Formula:</strong> <code>Cells/mL = Average Count per Field &times; Microscopic Factor &times; Dilution Reciprocal</code>
            </blockquote>
            <p>For example, if an analyst counts an average of 12 bacteria per field with a Microscopic Factor (MF) of 400,000, and the sample was diluted 1:10 (dilution factor 10), the concentration of cells in the original sample is calculated as: <code>12 &times; 400,000 &times; 10 = 4.8 &times; 10⁷ cells/mL</code>.</p>
            <p><strong>QA Distinction (Clumps vs. Individual Cells):</strong> When bacteria are clustered (clumps), each clump will usually grow into a single colony on an incubated plate. Therefore, reporting <em>clump counts</em> provides a high correlation with subsequently run Standard Plate Count (SPC) viable results, while counting <em>individual cells</em> provides the total biological cellular load of the sample.</p>
            <p><strong>FSSAI Raw Milk Grading Scale:</strong> Under FSSAI guidelines, raw milk is graded based on the direct microscopic clump count (DMC) per mL:
                <ul>
                    <li><strong>Excellent:</strong> &lt; 2 &times; 10⁵ cells/mL</li>
                    <li><strong>Good:</strong> 2 &times; 10⁵ to 10⁶ cells/mL</li>
                    <li><strong>Fair:</strong> 10⁶ to 5 &times; 10⁶ cells/mL (requires sanitation audits)</li>
                    <li><strong>Poor:</strong> &gt; 5 &times; 10⁶ cells/mL (subject to rejection)</li>
                </ul>
            </p>

            <h4>4. Materials Required</h4>
            <ul>
                <li>Liquid test samples (Raw milk, Pasteurized milk, Contaminated saline)</li>
                <li>Petroff-Hausser counting chamber with cover glass, or Breed templates</li>
                <li>Micro-pipette (10 μL or 1 mL capacity)</li>
                <li>Newman-Lampert stain (methylene blue dye) and fixing reagents</li>
                <li>Phase-contrast or light microscope (100x oil immersion objective)</li>
                <li>Tally counter</li>
            </ul>

            <h4>5. Process</h4>
            <ol>
                <li><strong>Sample Preparation:</strong> Mix the test sample thoroughly. If bacterial density is expected to be high, prepare a dilution (e.g. 10x or 100x) in sterile diluent.</li>
                <li><strong>Smear or Chamber Loading:</strong> For Breed smear, spread 0.01 mL over 1 cm² and stain. For chambers, place the cover glass over the grid and load a small drop using capillary action.</li>
                <li><strong>Microscopic Focus:</strong> Place the slide on the stage. Apply oil and focus using the 100x oil immersion objective until cells and grid lines are sharply resolved.</li>
                <li><strong>Enumeration:</strong> Select random fields (for smears) or grid areas (for chambers) and tally. Toggle Clump mode to count bacterial aggregates, or disable it to count individual cells.</li>
                <li><strong>Notebook Logging:</strong> Record your counts and dilution inside the lab notebook, calculate the Cells/mL using the MF or chamber factor, and verify your results.</li>
            </ol>

            <h4>6. References</h4>
            <ul>
                <li>FSSAI Manual on Microbiological Examination of Food and Water (May 2024).</li>
                <li>ISO 4833: Microbiology of the food chain - Horizontal method for the enumeration of microorganisms.</li>
            </ul>
        `,
        interpretation: `
            <h3>Module 2: Direct Microscopic Count (DMC) Interpretation Guide</h3>
            <div class="interpretation-slider-container">
                <button class="slider-arrow prev-arrow" type="button"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="interpretation-slider-track">
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 140px; height: 140px; border-radius: 50%; border: 4px solid #64748b; background: #0b0f19; position: relative; display: flex; justify-content: center; align-items: center; margin-bottom: 16px; box-shadow: inset 0 0 15px rgba(0,0,0,0.8);">
                                <div style="position: absolute; width: 100%; height: 1px; background: rgba(100,116,139,0.3); top: 50%;"></div>
                                <div style="position: absolute; height: 100%; width: 1px; background: rgba(100,116,139,0.3); left: 50%;"></div>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Sterile / Pasteurized Milk</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;"><strong>Observations:</strong> Very few or zero cells visible per microscopic field.<br><br><strong>Interpretation:</strong> Indicates excellent sanitary quality of raw milk prior to pasteurization, and effective pasteurization treatment.</p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 140px; height: 140px; border-radius: 50%; border: 4px solid #64748b; background: #0b0f19; position: relative; margin-bottom: 16px; box-shadow: inset 0 0 15px rgba(0,0,0,0.8);">
                                <div style="position: absolute; width: 100%; height: 1px; background: rgba(100,116,139,0.3); top: 50%;"></div>
                                <div style="position: absolute; height: 100%; width: 1px; background: rgba(100,116,139,0.3); left: 50%;"></div>
                                <div style="position: absolute; width: 8px; height: 18px; border-radius: 4px; background: #00e676; top: 30%; left: 35%; transform: rotate(30deg); box-shadow: 0 0 8px rgba(0,230,118,0.6);"></div>
                                <div style="position: absolute; width: 12px; height: 12px; border-radius: 50%; background: #00e676; top: 60%; left: 65%; box-shadow: 0 0 8px rgba(0,230,118,0.6);"></div>
                                <div style="position: absolute; width: 8px; height: 18px; border-radius: 4px; background: #00e676; top: 50%; left: 20%; transform: rotate(-45deg); box-shadow: 0 0 8px rgba(0,230,118,0.6);"></div>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Standard Raw Milk</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;"><strong>Observations:</strong> Sparse individual cells or small clumps.<br><br><strong>Interpretation:</strong> Acceptable raw milk grade. Under FSSAI norms, count &lt; 2 &times; 10⁵ cells/mL is "Excellent", 2 &times; 10⁵ to 10⁶ is "Good", 10⁶ to 5 &times; 10⁶ is "Fair".</p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 140px; height: 140px; border-radius: 50%; border: 4px solid #64748b; background: #0b0f19; position: relative; margin-bottom: 16px; box-shadow: inset 0 0 15px rgba(0,0,0,0.8);">
                                <div style="position: absolute; width: 100%; height: 1px; background: rgba(100,116,139,0.3); top: 50%;"></div>
                                <div style="position: absolute; height: 100%; width: 1px; background: rgba(100,116,139,0.3); left: 50%;"></div>
                                <div style="position: absolute; width: 8px; height: 18px; border-radius: 4px; background: #ff1744; top: 20%; left: 25%; transform: rotate(15deg); box-shadow: 0 0 8px rgba(255,23,68,0.6);"></div>
                                <div style="position: absolute; width: 8px; height: 18px; border-radius: 4px; background: #ff1744; top: 28%; left: 32%; transform: rotate(15deg); box-shadow: 0 0 8px rgba(255,23,68,0.6);"></div>
                                <div style="position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #ff1744; top: 60%; left: 65%; box-shadow: 0 0 8px rgba(255,23,68,0.6);"></div>
                                <div style="position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #ff1744; top: 68%; left: 70%; box-shadow: 0 0 8px rgba(255,23,68,0.6);"></div>
                                <div style="position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #ff1744; top: 58%; left: 76%; box-shadow: 0 0 8px rgba(255,23,68,0.6);"></div>
                                <div style="position: absolute; width: 8px; height: 18px; border-radius: 4px; background: #ff1744; top: 50%; left: 20%; transform: rotate(-45deg); box-shadow: 0 0 8px rgba(255,23,68,0.6);"></div>
                                <div style="position: absolute; width: 8px; height: 18px; border-radius: 4px; background: #ff1744; top: 40%; left: 50%; transform: rotate(45deg); box-shadow: 0 0 8px rgba(255,23,68,0.6);"></div>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Contaminated / Poor Quality Milk</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;"><strong>Observations:</strong> Very dense rod-shaped or coccus-shaped bacteria clusters.<br><br><strong>Interpretation:</strong> Poor raw milk quality (&gt; 5 &times; 10⁶ cells/mL). Indicates mastitis, unsterile milking utensils, or failure to chill milk.</p>
                        </div>
                    </div>
                </div>
                <button class="slider-arrow next-arrow" type="button"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="slider-indicators"></div>
        `
    },
    3: {
        title: "Serial Dilution & Plate Counts",
        badge: "FSSAI 15.001:2024",
        content: `
            <h3>Module 3: Serial Dilution & Plate Counts</h3>
            
            <h4>1. Aim</h4>
            <p>To enumerate the concentration of viable microorganisms in food and water samples by preparing serial tenfold dilutions, inoculating selective media, regulating incubator parameters, and applying the 30-300 colony statistical rule.</p>

            <h4>2. Theory</h4>
            <p>Plate count methodologies measure <em>viable</em> microorganisms—those cells capable of multiplying to form visible colonies under specified temperature and incubation times. While DMC counts all cells instantly, Standard Plate Counts (SPC) measure only viable cells. SPC is the regulatory benchmark for verifying microbiological safety and shelf-life compliance of finished foods under FSSAI 15.001:2024 rules.</p>
            <p><strong>Dilution Mechanics and Pipette Contamination:</strong> Tenfold serial dilutions reduce cell concentration down the line to isolate distinct colonies. A key operational rule is to **change pipette tips between transfers**. Reusing a tip introduces highly concentrated residues from the previous dilution tube (carryover contamination) into subsequent tubes. This carryover error compounds downstream, yielding artificially high colony counts on plates and invalidating calculated CFU/mL. FSSAI recommends using **0.1% Peptone Water** or **Buffered Peptone Water** as the standard diluent buffer blanks.</p>

            <h4>3. Principle</h4>
            <p>The physiological principle of this method is that a single viable cell (or clump of cells) multiplies to form a visible colony. Only plates containing between <strong>30 and 300 colonies</strong> are used for final concentration calculations. Plates with &gt;300 colonies suffer from crowding and nutrient competition, leading to under-counting (recorded as TNTC - Too Numerous To Count). Plates with &lt;30 colonies are statistically unreliable (recorded as TFTC).</p>
            <blockquote>
                <strong>CFU Formula:</strong> <code>Reported Count (CFU/mL) = Colonies Counted &times; Dilution Factor</code>
            </blockquote>
            <p>For example, if a plate inoculated with 1.0 mL of a 10⁻³ dilution yields 150 colonies, the count is: <code>150 &times; 1,000 = 150,000 CFU/mL</code>.</p>
            <p><strong>Media and pH Selective Barriers:</strong>
                <ul>
                    <li><em>Plate Count Agar (PCA)</em>: Standard nutrient agar for general APC/SPC. (Incubation: <strong>37°C for 48–72 hours</strong>).</li>
                    <li><em>PA Count Plate</em>: Highly selective for <em>Pseudomonas aeruginosa</em>. Under FSSAI regulations, bottled water has a zero-tolerance policy, requiring **complete absence (0 CFU/250mL)** of <em>Pseudomonas aeruginosa</em>. (Incubation: 36°C for 24-30h).</li>
                    <li><em>Potato Dextrose Agar (PDA)</em>: Used for Yeasts and Moulds. To prevent bacteria from overwhelming slower-growing fungi, PDA is adjusted to an acidic **pH of 3.5** by adding **10% tartaric acid**. Competing bacteria are suppressed, allowing clear fungal enumeration. (Incubation: 21°C for 2-5 days).</li>
                </ul>
            </p>

            <h4>4. Materials Required</h4>
            <ul>
                <li>Food or water samples (Raw milk, Bottled water, Salad greens wash)</li>
                <li>Pipettes (1.0 mL and 0.1 mL capacity) and sterile tips</li>
                <li>0.1% Peptone Water diluent blanks (9.0 mL sterile tubes)</li>
                <li>Petri dishes and molten agar media (PCA, PDA, PA plates)</li>
                <li>10% Tartaric Acid solution</li>
                <li>Incubator (adjustable temperature ranges 15°C to 45°C)</li>
                <li>Colony counter (illuminated magnifier with grid gridwork)</li>
            </ul>

            <h4>5. Process</h4>
            <ol>
                <li><strong>Tenfold Serial Dilution:</strong> Pipette 1.0 mL of stock sample into a 9 mL peptone tube (label 10<sup>-1</sup>) using a sterile tip. Eject tip, load new tip, and transfer 1.0 mL sequentially down the line to 10<sup>-5</sup>.</li>
                <li><strong>Inoculation:</strong> Select the medium and dilution. Adjust parameters if using PDA (add 10% tartaric acid). Pipette 1.0 mL of selected dilution and dispense onto Petri Dish.</li>
                <li><strong>Incubation:</strong> Place the plates in the incubator. Configure temperature and duration depending on medium requirements (PCA = 37°C for 48-72h; PA = 36°C for 24h; PDA = 21°C for 72h).</li>
                <li><strong>Colony Counting:</strong> Examine the incubated plates. Identify the plate fitting the 30-300 rule. Count colonies using the colony tally counter.</li>
                <li><strong>Calculations & Logs:</strong> Record results in the notebook and calculate viable CFU/mL. Verify to complete.</li>
            </ol>

            <h4>6. References</h4>
            <ul>
                <li>FSSAI 15.001:2024: Aerobic Plate Count in food products.</li>
                <li>ISO 4833-1: Pour plate technique for colony count at 30°C.</li>
                <li>ISO 16266: Enumeration of Pseudomonas aeruginosa in water.</li>
            </ul>
        `,
        interpretation: `
            <h3>Module 3: Serial Dilution & Plate Counts Interpretation Guide</h3>
            <div class="interpretation-slider-container">
                <button class="slider-arrow prev-arrow" type="button"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="interpretation-slider-track">
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 140px; height: 140px; border-radius: 50%; border: 4px solid #64748b; background: rgba(255, 235, 180, 0.45); position: relative; margin-bottom: 16px; box-shadow: inset 0 0 15px rgba(0,0,0,0.3);">
                                <div style="position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #ffffff; border: 1.5px solid #78350f; top: 30%; left: 35%;"></div>
                                <div style="position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #ffffff; border: 1.5px solid #78350f; top: 60%; left: 65%;"></div>
                                <div style="position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #ffffff; border: 1.5px solid #78350f; top: 50%; left: 20%;"></div>
                                <div style="position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #ffffff; border: 1.5px solid #78350f; top: 25%; left: 55%;"></div>
                                <div style="position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #ffffff; border: 1.5px solid #78350f; top: 70%; left: 40%;"></div>
                                <div style="position: absolute; width: 9px; height: 9px; border-radius: 50%; background: #ffffff; border: 1.5px solid #78350f; top: 45%; left: 45%;"></div>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Countable Plate (30-300 rule)</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;"><strong>Observations:</strong> Distinct, individual colonies numbering between 30 and 300.<br><br><strong>Interpretation:</strong> Statistically valid range for plate counting. Report counts as: CFU/mL = Colonies counted &times; Dilution factor.</p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 140px; height: 140px; border-radius: 50%; border: 4px solid #64748b; background: rgba(255, 235, 180, 0.45); position: relative; margin-bottom: 16px; box-shadow: inset 0 0 15px rgba(0,0,0,0.3);">
                                <div style="position: absolute; width: 92%; height: 92%; top: 4%; left: 4%; border-radius: 50%; background: rgba(255, 255, 255, 0.75); box-shadow: 0 0 10px rgba(255,255,255,0.5);"></div>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Too Numerous To Count (TNTC)</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;"><strong>Observations:</strong> &gt; 300 colonies. Colonies are overlapping, merging, or forming a confluent lawn.<br><br><strong>Interpretation:</strong> Overcrowding causes nutrient depletion and under-counting. Report as TNTC. Repeat test at higher dilution.</p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 140px; height: 140px; border-radius: 50%; border: 4px solid #64748b; background: rgba(255, 235, 180, 0.45); position: relative; margin-bottom: 16px; box-shadow: inset 0 0 15px rgba(0,0,0,0.3);">
                                <div style="position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #ffffff; border: 1.5px solid #78350f; top: 40%; left: 50%;"></div>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Too Few To Count (TFTC)</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;"><strong>Observations:</strong> &lt; 30 colonies. Plate contains only a few scattered colonies.<br><br><strong>Interpretation:</strong> Statistically unreliable due to sampling error. Report as TFTC. Use lower dilutions for raw counts.</p>
                        </div>
                    </div>
                </div>
                <button class="slider-arrow next-arrow" type="button"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="slider-indicators"></div>
        `
    },
    4: {
        title: "Specialized Pathogen Identification",
        badge: "Selective Media Suite",
        content: `
            <h3>Module 4: Specialized Pathogen Identification</h3>
            
            <h4>1. Aim</h4>
            <p>To identify key foodborne pathogens (Staphylococcus aureus, Salmonella spp., and Coliforms) from culture isolations using confirmatory tests, selective media growth colors, and biochemical slants.</p>

            <h4>2. Theory</h4>
            <p>Regulatory surveillance mandates zero tolerance or strict limits for pathogens like Salmonella and S. aureus. Identifying these microbes relies on selective biochemical reactions that exploit their enzymes (coagulase), carbohydrate fermentation patterns (TSI butt/slant), and cell-envelope characteristics (bile salt resistance in coliforms).</p>

            <h4>3. Principle</h4>
            <ul>
                <li><strong>Staphylococcus aureus Coagulase Test:</strong> S. aureus produces the enzyme <strong>coagulase</strong>, which binds prothrombin, converting <strong>fibrinogen to fibrin</strong> and clotting plasma. Isolated colonies are mixed with rabbit coagulase plasma and incubated at <strong>37°C for 4 to 24 hours</strong>. A positive result is a firm, gelatinous clot that does not run when tilted.
                <br><em>QA Diagnostic Notes:</em> S. aureus can produce <strong>fibrinolysin (staphylokinase)</strong>, an enzyme that dissolves the fibrin clot upon extended incubation (often visible after 4-6 hours). Therefore, coagulase tests must be checked hourly and read within 4-24h to avoid false-negative readings.
                <br><em>Bound vs Free Coagulase:</em> Slide agglutination tests detect **bound coagulase** (clumping factor) attached directly to the cell wall, while tube tests detect **free coagulase** secreted extracellularly. Some strains may test positive for bound coagulase but negative or slow for free coagulase, requiring careful correlation.</li>
                
                <li><strong>Salmonella Triple Sugar Iron (TSI) Slant:</strong> TSI agar contains three sugars: <strong>Glucose (0.1%), Lactose (1.0%), and Sucrose (1.0%)</strong>, alongside a phenol red pH indicator and <strong>ferrous sulfate (ferrous ions)</strong>. Salmonella ferments only glucose. After 24h incubation, the slant reverts to Alkaline (pink/red, K) due to aerobic peptone oxidation, while the butt remains Acid (yellow, A) from anaerobic fermentation, yielding a <strong>K/A reaction</strong>. Ferrous ions react with hydrogen sulfide (H₂S) gas produced by Salmonella to form a black ferrous sulfide precipitate. Fissures or cracks in the agar represent gas production. Non-fermenters (like *Pseudomonas aeruginosa*) do not ferment any sugars, leaving both butt and slant alkaline (pink/pink, K/K).</li>
                
                <li><strong>Coliform Testing Hierarchy:</strong>
                    <ol>
                        <li><em>Presumptive (VRBA)</em>: Violet Red Bile Agar contains bile salts and crystal violet to inhibit Gram-positives. Coliform lactose fermenters form <strong>dark red colonies surrounded by a precipitated zone of bile salts</strong>.</li>
                        <li><em>Confirmed (2% BGLB Broth)</em>: Brilliant green lactose bile broth inhibits non-coliforms. Lactose fermentation is confirmed by gas bubbles collected inside an inverted <strong>Durham tube</strong>.</li>
                        <li><em>Completed (EMB Agar)</em>: Eosin Methylene Blue agar selects for Gram-negatives. *Escherichia coli* ferments lactose rapidly, precipitating the dyes to produce a characteristic <strong>metallic green sheen</strong>. Atypical coliforms like *Enterobacter aerogenes* ferment lactose slowly, forming **pink/purple mucoid colonies without a sheen**. Lactose-negative pathogens (Salmonella) form colorless colonies.</li>
                    </ol>
                </li>
            </ul>

            <h4>4. Materials Required</h4>
            <ul>
                <li>Baird Parker Agar isolates (for S. aureus)</li>
                <li>Bismuth Sulphite Agar isolates (for Salmonella)</li>
                <li>Rabbit coagulase plasma in sterile tubes</li>
                <li>TSI agar slant tubes and inoculation needles</li>
                <li>Violet Red Bile Agar (VRBA) plates</li>
                <li>2% Brilliant Green Lactose Bile (BGLB) broth with Durham tubes</li>
                <li>Eosine Methylene Blue (EMB) agar plates</li>
                <li>Inoculation loop, Bunsen burner, and incubator (32°C - 37°C)</li>
            </ul>

            <h4>5. Process</h4>
            <ol>
                <li><strong>Coagulase Assay:</strong> Mix isolated colony into rabbit plasma. Incubate at 37°C. Tilt the tube hourly (up to 6 hours) to check broth thickness. Record if plasma clots.</li>
                <li><strong>TSI Profiling:</strong> Touch Salmonella colony, stab deep into the TSI agar butt, then streak the slant surface. Incubate at 37°C for 24 hours. Record slant/butt color, gas splits, and H₂S blackening.</li>
                <li><strong>Coliform Hierarchy Audit:</strong> Examine VRBA plates. Transfer coliform colonies to BGLB broth, check for gas in Durham tube. Streak positive broth onto EMB, check for green metallic sheen.</li>
                <li><strong>Notebook Recording:</strong> Log reactions and verify outcomes.</li>
            </ol>

            <h4>6. References</h4>
            <ul>
                <li>FSSAI Manual on Microbiological Examination, Chapter 8: Pathogen Detection (May 2024).</li>
                <li>ISO 6579-1: Horizontal method for the detection of Salmonella.</li>
                <li>ISO 6888-1: Enumeration of coagulase-positive staphylococci.</li>
            </ul>
        `,
        interpretation: `
            <h3>Module 4: Specialized Pathogen Identification Interpretation Guide</h3>
            <div class="interpretation-slider-container">
                <button class="slider-arrow prev-arrow" type="button"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="interpretation-slider-track">
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="display: flex; gap: 24px; margin-bottom: 16px;">
                                <div style="width: 30px; height: 90px; border: 2.5px solid #94a3b8; border-radius: 12px; background: rgba(255,255,255,0.05); position: relative; transform: rotate(45deg); margin-right: 25px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 35px; background: rgba(255, 235, 180, 0.9); border-radius: 0 0 10px 10px; box-shadow: inset 0 0 5px rgba(0,0,0,0.1);"></div>
                                </div>
                                <div style="width: 30px; height: 90px; border: 2.5px solid #94a3b8; border-radius: 12px; background: rgba(255,255,255,0.05); position: relative; transform: rotate(45deg); box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                                    <div style="position: absolute; bottom: 12px; left: 0; width: 100%; height: 28px; background: rgba(255, 235, 180, 0.5); transform: skewY(15deg); border-radius: 0 0 10px 10px;"></div>
                                </div>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Coagulase Test (Plasma Clotting)</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Positive (Clotted):</strong> Solid gel clot forms at bottom that does not run when tilted. Confirms <em>Staphylococcus aureus</em>.<br><br>
                                <strong>Negative (Liquid):</strong> Broth remains fluid, runs to cap. Confirms <em>Staphylococcus epidermidis</em> (CoNS).
                            </p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                                <div style="width: 24px; height: 90px; border: 2px solid #94a3b8; border-radius: 10px; background: #e91e63; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                                    <div style="height: 50px; background: #ffd600;"></div>
                                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 32px; background: #000000; opacity: 0.95;"></div>
                                </div>
                                <div style="width: 24px; height: 90px; border: 2px solid #94a3b8; border-radius: 10px; background: #ffd600; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                                    <div style="height: 45px; background: #ffd600;"></div>
                                </div>
                                <div style="width: 24px; height: 90px; border: 2px solid #94a3b8; border-radius: 10px; background: #e91e63; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                                    <div style="height: 45px; background: #e91e63;"></div>
                                </div>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Triple Sugar Iron (TSI) Slant</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>K/A, H₂S+ (Pink/Yellow+Black):</strong> <em>Salmonella enterica</em>. Only glucose fermented, H₂S forms black precipitate.<br><br>
                                <strong>A/A (Yellow/Yellow):</strong> <em>E. coli</em>. Glucose and lactose/sucrose fermented. Gas bubbles (+).<br><br>
                                <strong>K/K (Pink/Pink):</strong> <em>Pseudomonas aeruginosa</em>. No sugars fermented.
                            </p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 140px; height: 140px; border-radius: 50%; border: 4px solid #64748b; background: #21102e; position: relative; margin-bottom: 16px; box-shadow: inset 0 0 15px rgba(0,0,0,0.7);">
                                <div style="position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #00e676; top: 30%; left: 35%; box-shadow: 0 0 8px #00e676;"></div>
                                <div style="position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #00e676; top: 40%; left: 55%; box-shadow: 0 0 7px #00e676;"></div>
                                <div style="position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #00e676; top: 55%; left: 45%; box-shadow: 0 0 8px #00e676;"></div>
                                <div style="position: absolute; width: 7px; height: 7px; border-radius: 50%; background: #00e676; top: 45%; left: 32%; box-shadow: 0 0 6px #00e676;"></div>
                                <div style="position: absolute; width: 9px; height: 9px; border-radius: 50%; background: #00e676; top: 50%; left: 58%; box-shadow: 0 0 8px #00e676;"></div>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Coliform EMB Streak Test</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Metallic Green Sheen:</strong> <em>E. coli</em> (rapid lactose fermentation precipitates eosin-methylene blue complex).<br><br>
                                <strong>Pinkish-Purple Mucoid:</strong> <em>Enterobacter aerogenes</em> (atypical coliform, slow fermentation).<br><br>
                                <strong>Colorless colonies:</strong> Lactose-negative pathogens (e.g. <em>Salmonella</em>).
                            </p>
                        </div>
                    </div>
                </div>
                <button class="slider-arrow next-arrow" type="button"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="slider-indicators"></div>
        `
    },
    5: {
        title: "Antimicrobial Effectiveness Testing (AET)",
        badge: "USP <51> Preservatives",
        content: `
            <h3>Module 5: Antimicrobial Effectiveness Testing (AET)</h3>
            
            <h4>1. Aim</h4>
            <p>To evaluate the efficacy of preservative systems in multi-dose pharmaceutical products against challenge microorganisms over a 28-day period according to USP Chapter <51>.</p>

            <h4>2. Theory</h4>
            <p>Aqueous multi-dose products are susceptible to contamination once opened. Manufacturers add preservatives (e.g., Benzalkonium Chloride, Methylparabens) to inhibit growth. The AET assay challenges the product with high concentrations of test microbes and checks log reductions over time to verify efficacy.</p>

            <h4>3. Principle</h4>
            <ul>
                <li><strong>Inoculation Level:</strong> Products are inoculated with 10<sup>5</sup> to 10<sup>6</sup> CFU/mL of challenge organisms (e.g., Staphylococcus aureus, Candida albicans).</li>
                <li><strong>Preservative Neutralization:</strong> At each time point (0, 7, 14, 28 days), a sample is withdrawn. To count survivors, the preservative must be neutralized immediately. If not neutralized, it continues to act in the recovery agar, causing false 0 colony counts (experimental error). Lecithin + Polysorbate 80 is the standard neutralizer for Benzalkonium Chloride (QAC) and Parabens.</li>
                <li><strong>Log Reduction:</strong> Calculated as <code>Log Reduction = Log₁₀(Initial Count) - Log₁₀(Current Count)</code>.</li>
                <li><strong>USP <51> Pass Criteria:</strong>
                    <br/>- Bacteria (Category 1): ≥ 1.0 log reduction at Day 7, ≥ 3.0 log reduction at Day 14, and no increase from Day 14 to Day 28.
                    <br/>- Yeast & Mold (Category 1): No increase (≤ 0.5 log increase) from Day 0 baseline at Day 7, 14, and 28.
                </li>
            </ul>

            <h4>4. Materials Required</h4>
            <ul>
                <li>Product containing preservative system (e.g. BAC, Methylparaben)</li>
                <li>Challenge organisms: Staphylococcus aureus (bacteria), Candida albicans (yeast)</li>
                <li>Neutralizing diluents: Lecithin + Polysorbate 80, Sodium Thiosulfate, PBS (negative control)</li>
                <li>Plate Count Agar (PCA) and Sabouraud Dextrose Agar (SDA)</li>
                <li>Serial dilution tubes, plates, incubator</li>
            </ul>

            <h4>5. Process</h4>
            <ol>
                <li><strong>Set Challenge:</strong> Choose preservative, organism, and neutralizer in the workspace panels.</li>
                <li><strong>Inoculate & Dilute:</strong> Select a day time point and click "Inoculate, Dilute & Plate".</li>
                <li><strong>Count Colonies:</strong> Observe colonies on plate. Take note of the dilution printed below.</li>
                <li><strong>Logbook Entry:</strong> Multiply plate colonies by dilution factor to get CFU/mL. Write the CFU/mL and calculate log reductions in the notebook, then verify.</li>
            </ol>

            <h4>6. References</h4>
            <ul>
                <li>United States Pharmacopoeia (USP) Chapter <51> Antimicrobial Effectiveness Testing.</li>
            </ul>
        `,
        interpretation: `
            <h3>Module 5: AET Efficacy Interpretation Guide</h3>
            <div class="interpretation-slider-container">
                <button class="slider-arrow prev-arrow" type="button"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="interpretation-slider-track">
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 120px; height: 120px; border-radius: 50%; border: 3px dashed var(--color-cyan); background: rgba(255,255,255,0.05); display: flex; justify-content: center; align-items: center; font-size: 24px; color: var(--color-cyan); margin-bottom: 16px;">
                                <i class="fa-solid fa-flask-vial"></i>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Neutralization Failure</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Observation:</strong> 0 colonies on all plates, including Day 0.<br/>
                                <strong>Interpretation:</strong> PBS or thiosulfate was used instead of Lecithin + Polysorbate 80. The preservative remained active during dilution and killed all cells, creating invalid results.
                            </p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #16a34a; background: rgba(22,163,74,0.05); display: flex; justify-content: center; align-items: center; font-size: 24px; color: #16a34a; margin-bottom: 16px;">
                                <i class="fa-solid fa-check-double"></i>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">S. aureus Efficacy Profile</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Observation:</strong> Day 0 = 1,200,000 CFU/mL; Day 7 = 900 CFU/mL (3.13 log red); Day 14 = 60 CFU/mL (4.30 log red); Day 28 = 0 CFU/mL (6.08 log red).<br/>
                                <strong>Interpretation:</strong> Meets USP <51> standards (≥ 3.0 log reduction by Day 14, no increase by Day 28). Efficacy PASS.
                            </p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #16a34a; background: rgba(22,163,74,0.05); display: flex; justify-content: center; align-items: center; font-size: 24px; color: #16a34a; margin-bottom: 16px;">
                                <i class="fa-solid fa-check-double"></i>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">C. albicans Efficacy Profile</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Observation:</strong> Day 0 = 1,500,000 CFU/mL; Day 7 = 1,100,000 CFU/mL; Day 14 = 75,000 CFU/mL (1.30 log red); Day 28 = 4,500 CFU/mL (2.53 log red).<br/>
                                <strong>Interpretation:</strong> Meets USP <51> standards for yeast (no increase from Day 0 baseline at all points, with steady decline). Efficacy PASS.
                            </p>
                        </div>
                    </div>
                </div>
                <button class="slider-arrow next-arrow" type="button"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="slider-indicators"></div>
        `
    },
    6: {
        title: "Sterility Testing of Pharmaceutical Product",
        badge: "USP <71> Direct Inoculation",
        content: `
            <h3>Module 6: Sterility Testing of Pharmaceutical Product</h3>
            
            <h4>1. Aim</h4>
            <p>To perform sterility testing of a pharmaceutical product using the Direct Inoculation Method to ensure the product is free from viable contaminating microorganisms in compliance with USP &lt;71&gt; guidelines.</p>

            <h4>2. Theory</h4>
            <p>Injectable, ophthalmic, and other sterile pharmaceutical formulations must be entirely free from viable microorganisms. Under USP &lt;71&gt;, sterility testing is performed to verify the absence of viable contamination in sterile products. The test requires inoculating samples into specific liquid media that support aerobic, anaerobic, and fungal growth.</p>

            <h4>3. Principle</h4>
            <p>Direct Inoculation involves transferring a specified volume of the test sample directly into two liquid culture media:</p>
            <ul>
                <li><strong>Fluid Thioglycollate Medium (FTM):</strong> Formulated with sodium thioglycollate to lower the oxidation-reduction potential. It is incubated at 30°C to 35°C primarily to detect anaerobic bacteria (in the deep anaerobic zone) and some aerobic bacteria (in the upper pink oxidation zone containing the indicator Resazurin).</li>
                <li><strong>Soybean Casein Digest Medium (SCDM / TSB):</strong> A general-purpose medium that is incubated aerobically at 20°C to 25°C to promote the growth of aerobic bacteria, yeasts, and molds.</li>
            </ul>
            <p>Both media are incubated for a minimum of 14 days. Tubes are examined periodically; the appearance of turbidity (cloudiness) indicates microbial growth and a failure of product sterility.</p>

            <h4>4. Materials Required</h4>
            <ul>
                <li>Test samples: Sterile Saline Injection (saline), Multi-dose Eye Drops (eye_drops)</li>
                <li>Media: Fluid Thioglycollate Medium (FTM) tubes, Soybean Casein Digest Medium (SCDM) tubes</li>
                <li>Equipment: Biosafety Cabinet (BSC), micropipettes, sterile tips, incubator</li>
            </ul>

            <h4>5. Process</h4>
            <ol>
                <li>Select the pharmaceutical sample to test.</li>
                <li>Pipette 1.0 mL of sample into the Fluid Thioglycollate Medium (FTM) tube.</li>
                <li>Pipette 1.0 mL of sample into the Soybean Casein Digest Medium (SCDM) tube.</li>
                <li>Incubate the tubes for 14 days (FTM at 32.5°C, SCDM at 22.5°C).</li>
                <li>Observe tubes for turbidity. Clear tubes indicate sterility, while turbid growth indicates contamination.</li>
            </ol>

            <h4>6. References</h4>
            <ul>
                <li>USP &lt;71&gt; Sterility Tests.</li>
                <li>FDA Guidance for Industry: Sterile Drug Products Produced by Aseptic Processing.</li>
            </ul>
        `,
        interpretation: `
            <h3>Module 6: Sterility Test Interpretation Guide</h3>
            <div class="interpretation-slider-container">
                <button class="slider-arrow prev-arrow" type="button"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="interpretation-slider-track">
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="display: flex; gap: 20px; margin-bottom: 16px;">
                                <div style="width: 16px; height: 100px; border: 2px solid #ccc; border-radius: 0 0 8px 8px; background: rgba(255,255,255,0.05); position: relative;">
                                    <div style="position: absolute; bottom: 0; width: 100%; height: 70px; background: rgba(180, 160, 100, 0.7); filter: blur(1px);"></div>
                                </div>
                                <div style="width: 16px; height: 100px; border: 2px solid #ccc; border-radius: 0 0 8px 8px; background: rgba(255,255,255,0.05); position: relative;">
                                    <div style="position: absolute; bottom: 0; width: 100%; height: 70px; background: rgba(180, 160, 100, 0.7); filter: blur(1px);"></div>
                                </div>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Direct Inoculation Contamination</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Observation:</strong> Turbid growth in both FTM and SCDM tubes after 14 days.<br/>
                                <strong>Interpretation:</strong> The product (e.g. contaminated eye drops) contains viable microorganisms. Product fails sterility audit.
                            </p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="display: flex; gap: 20px; margin-bottom: 16px;">
                                <div style="width: 16px; height: 100px; border: 2px solid #ccc; border-radius: 0 0 8px 8px; background: rgba(255,255,255,0.05); position: relative;">
                                    <div style="position: absolute; bottom: 0; width: 100%; height: 15px; background: rgba(255, 255, 255, 0.15);"></div>
                                </div>
                                <div style="width: 16px; height: 100px; border: 2px solid #ccc; border-radius: 0 0 8px 8px; background: rgba(255,255,255,0.05); position: relative;">
                                    <div style="position: absolute; bottom: 0; width: 100%; height: 15px; background: rgba(255, 255, 255, 0.15);"></div>
                                </div>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Direct Inoculation Sterile</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Observation:</strong> FTM and SCDM tubes remain clear after 14 days of incubation.<br/>
                                <strong>Interpretation:</strong> No viable aerobic, anaerobic, or fungal contamination detected. Product passes sterility audit.
                            </p>
                        </div>
                    </div>
                </div>
                <button class="slider-arrow next-arrow" type="button"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="slider-indicators"></div>
        `
    },
    7: {
        title: "Evaluation of Surface Sterilization",
        badge: "Surface Audits",
        content: `
            <h3>Module 7: Evaluation of Surface Sterilization by Swab Testing</h3>
            
            <h4>1. Aim</h4>
            <p>To assess the microbial load on cleanroom and laboratory surfaces before and after sterilization using the cotton swab template testing technique.</p>

            <h4>2. Theory</h4>
            <p>Environmental surfaces in pharmaceutical cleanrooms and food processing facilities must comply with strict microbiological hygiene limits. Sanitization audits verify the efficacy of disinfection protocols (e.g., 70% Ethanol, 10% Bleach) compared to untreated control baselines.</p>

            <h4>3. Principle</h4>
            <p>A sterile cotton swab is wiped across a defined surface area (typically defined by a 10x10 cm² sterile template = 100 cm²). The swab is suspended in a 10 mL volume of sterile dilution buffer. 1.0 mL of this suspension is plated onto Plate Count Agar (PCA) using the pour plate or spread plate method. The agar is incubated at 30°C for 48 hours.</p>
            <p>The surface contamination density is calculated using the formula:</p>
            <p style="text-align: center; font-family: monospace; font-weight: bold; color: var(--color-cyan);">
                CFU/cm² = (Colonies Counted &times; Buffer Volume (10 mL)) / (Swabbed Area (100 cm²) &times; Plated Volume (1 mL)) = Colonies Counted / 10
            </p>

            <h4>4. Materials Required</h4>
            <ul>
                <li>Sterile swabs and 10x10 cm² metal templates</li>
                <li>10 mL sterile dilution buffer tubes</li>
                <li>Plate Count Agar (PCA) plates, sterile pipettes</li>
                <li>Sanitizers: 70% Ethanol, 10% Bleach, Untreated Control surface</li>
                <li>Incubator (30°C)</li>
            </ul>

            <h4>5. Process</h4>
            <ol>
                <li>Select the surface treatment to test (Control, 70% Ethanol, or 10% Bleach).</li>
                <li>Wipe the swab across the 100 cm² template area.</li>
                <li>Dilute the swab in 10 mL buffer and plate 1.0 mL onto PCA.</li>
                <li>Incubate the PCA plate at 30°C for 48 hours.</li>
                <li>Count the resulting colonies and calculate surface density (CFU/cm² = Colonies / 10).</li>
            </ol>

            <h4>6. References</h4>
            <ul>
                <li>ISO 18593: Microbiology of the food chain - Horizontal methods for surface sampling.</li>
                <li>FSSAI Manual of Methods for Microbiological Examination of Foods.</li>
            </ul>
        `,
        interpretation: `
            <h3>Module 7: Surface Swab Interpretation Guide</h3>
            <div class="interpretation-slider-container">
                <button class="slider-arrow prev-arrow" type="button"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="interpretation-slider-track">
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #ff5500; background: rgba(255, 85, 0, 0.05); display: flex; justify-content: center; align-items: center; font-size: 24px; color: #ff5500; margin-bottom: 16px;">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Surface Swab - Untreated Control</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Observation:</strong> 250 colonies counted on Plate.<br/>
                                <strong>Calculation:</strong> 250 / 10 = 25.0 CFU/cm².<br/>
                                <strong>Interpretation:</strong> Extremely high contamination level on untreated cleanroom surface.
                            </p>
                        </div>
                    </div>
                    <div class="interpretation-slide">
                        <div class="interpretation-card glass-panel" style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #16a34a; background: rgba(22,163,74,0.05); display: flex; justify-content: center; align-items: center; font-size: 24px; color: #16a34a; margin-bottom: 16px;">
                                <i class="fa-solid fa-shield-halved"></i>
                            </div>
                            <h5 style="color: var(--text-title); font-size: 16px; margin-bottom: 10px; font-weight: 700;">Surface Swab - Sanitized</h5>
                            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; text-align: left; margin: 0;">
                                <strong>Observation:</strong> 70% Ethanol: 15 CFU (1.5 CFU/cm²). 10% Bleach: 2 CFU (0.2 CFU/cm²).<br/>
                                <strong>Interpretation:</strong> Successful sanitization. Bleach shows superior bactericidal efficacy (99.2% reduction) compared to Ethanol (94.0% reduction).
                            </p>
                        </div>
                    </div>
                </div>
                <button class="slider-arrow next-arrow" type="button"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="slider-indicators"></div>
        `
    }
};
