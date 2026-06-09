console.log("APP.JS RUNNING");
import { audio, showNotification } from './utils.js?v=1.4';
import { theoryData } from './theory.js?v=1.4';
import { notebook } from './notebook.js?v=1.4';
import { microscope } from './modules/microscope.js?v=1.4';
import { dilution } from './modules/dilution.js?v=1.4';
import { pathogen } from './modules/pathogen.js?v=1.4';
import { qa } from './modules/qa.js?v=1.4';
import { labelInspector } from './modules/label.js?v=1.4';
import { aet } from './modules/aet.js?v=1.4';
import { sterility } from './modules/sterility.js?v=1.4';

class AppController {
    constructor() {
        this.activeModuleNum = null;
        this.activeTab = 'theory'; // 'theory', 'prequiz', 'simulation', 'assessment'
        
        this.prequizPassed = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false };

        // 10 questions per module pre-simulation safety & protocol quiz database
        this.prequizzes = {
            1: [
                {
                    q: "What FSSAI regulation establishes the rules for packaging and display of pre-packaged food?",
                    options: ["FSSAI (Labelling and Display) Regulations, 2020", "ISO 17025 Guidelines", "FDA BAM Manual", "BIS Packaging Standard 2024"],
                    correct: 0
                },
                {
                    q: "What does a green filled circle inside a green outlined square signify?",
                    options: ["Vegetarian food", "Non-vegetarian food", "Organic certified", "Bio-hazard warning"],
                    correct: 0
                },
                {
                    q: "FSSAI Chapter 2 mandates that major allergen sources must be declared:",
                    options: ["In bold text or a separate warning box", "In microscopic font at the bottom", "Only if the product exceeds 1 kg", "Only for imported products"],
                    correct: 0
                },
                {
                    q: "What is the standard number of digits in a valid FSSAI food business license number?",
                    options: ["14 digits", "10 digits", "12 digits", "16 digits"],
                    correct: 0
                },
                {
                    q: "What is the correct way to display liquid product volume on labels under FSSAI rules?",
                    options: ["In milliliters (mL) or liters (L)", "In fluid ounces (fl. oz.)", "In gallons", "In arbitrary volumetric units"],
                    correct: 0
                },
                {
                    q: "Which of the following is NOT a mandatory labelling requirement under FSSAI?",
                    options: ["Price of competitors' products", "List of ingredients", "FSSAI logo and license number", "Net weight/volume"],
                    correct: 0
                },
                {
                    q: "If a product contains ingredients derived from milk and soy, what must be printed?",
                    options: ["An allergen warning statement", "A green dot symbol", "A pasteurization certification", "No special warnings are required"],
                    correct: 0
                },
                {
                    q: "Can a 5-digit registration number serve as a valid FSSAI license on pre-packaged retail products?",
                    options: ["No, a standard 14-digit license number is mandatory", "Yes, for small infant food companies", "Yes, if the logo is present", "No, it must be 10 digits"],
                    correct: 0
                },
                {
                    q: "Why are vegetarian/non-vegetarian symbols mandatory on food labels?",
                    options: ["To protect cultural/religious choices of consumers", "To calculate nutritional tax", "To indicate caloric density", "To certify organic production"],
                    correct: 0
                },
                {
                    q: "Under FSSAI regulations, what is the consequence of failing to print an allergen warning for milk solids?",
                    options: ["Legal audit failure and product recall", "Minor fine without warning", "Exempt if less than 5% composition", "No penalty applies"],
                    correct: 0
                }
            ],
            2: [
                {
                    q: "What regulatory manual defines the Direct Microscopic Count (DMC) procedure for screening milk?",
                    options: ["FSSAI Food Analysis Manual (May 2024)", "ISO 4833-1", "FDA BAM Chapter 23", "BIS standard 1475"],
                    correct: 0
                },
                {
                    q: "How much milk sample is deposited onto the slide under standard DMC rules?",
                    options: ["0.01 mL", "0.1 mL", "0.001 mL", "0.02 mL"],
                    correct: 0
                },
                {
                    q: "What area of the slide must the 0.01 mL sample be spread over?",
                    options: ["1 cm²", "2 cm²", "0.5 cm²", "1.5 cm²"],
                    correct: 0
                },
                {
                    q: "Why must the milk film be stained and fixed before counting?",
                    options: ["To coagulate protein and stain cells for contrast under the lens", "To pasteurize the milk sample for safety", "To prevent the milk from turning sour", "To wash away somatic cells"],
                    correct: 0
                },
                {
                    q: "What is the standard cell staining dye used in DMC testing?",
                    options: ["Newman-Lampert stain (methylene blue)", "Safranin", "Crystal violet", "Malachite green"],
                    correct: 0
                },
                {
                    q: "What does a cluster of bacteria counted in DMC represent for viable count correlation?",
                    options: ["A clump count", "An individual count", "A contaminant colony", "A somatic chain"],
                    correct: 0
                },
                {
                    q: "How is the microscopic factor (MF) mathematically defined?",
                    options: ["MF = Area of film / (Area of microscopic field × Vol of sample)", "MF = Vol of sample × Area of film", "MF = Magnification × Grid area", "MF = 50,000 / number of squares"],
                    correct: 0
                },
                {
                    q: "If the microscopic field diameter is 0.16 mm and the film is 1 cm², what is the typical factor for a 0.01 mL sample?",
                    options: ["Approximately 500,000", "Exactly 50,000", "Approximately 50,000", "Exactly 1,000"],
                    correct: 0
                },
                {
                    q: "Why is the DMC method considered a 'screening' tool rather than a final confirmatory test?",
                    options: ["It counts both live and dead cells", "It cannot see rods", "It requires too much agar", "It takes 48 hours to complete"],
                    correct: 0
                },
                {
                    q: "In Petroff-Hausser counting chambers, what is the depth of the ruled grid area?",
                    options: ["0.02 mm", "0.1 mm", "0.05 mm", "0.2 mm"],
                    correct: 0
                }
            ],
            3: [
                {
                    q: "What is the primary agar medium used for general Aerobic Plate Counts (APC) under FSSAI rules?",
                    options: ["Plate Count Agar (PCA)", "Potato Dextrose Agar (PDA)", "Pseudomonas Agar (PA)", "MacConkey Agar"],
                    correct: 0
                },
                {
                    q: "What temperature and time are standard for APC incubation under FSSAI?",
                    options: ["30°C for 48–72 hours", "37°C for 24 hours", "25°C for 5 days", "42°C for 18 hours"],
                    correct: 0
                },
                {
                    q: "In a 10-fold serial dilution, how much dilution buffer is placed in each tube initially?",
                    options: ["9.0 mL", "10.0 mL", "1.0 mL", "9.9 mL"],
                    correct: 0
                },
                {
                    q: "How much stock sample is transferred into the first tube of a 10-fold serial dilution?",
                    options: ["1.0 mL", "0.1 mL", "10.0 mL", "0.5 mL"],
                    correct: 0
                },
                {
                    q: "Why is tartaric acid added to PDA for fungal testing?",
                    options: ["To adjust pH to 3.5, suppressing competing bacterial growth", "To supply additional nitrogen for spore germination", "To change the indicator color of fungal molds", "To solidify the agar at lower temperatures"],
                    correct: 0
                },
                {
                    q: "What range of colonies represents a statistically valid count on an agar plate?",
                    options: ["30 to 300 colonies", "10 to 100 colonies", "50 to 500 colonies", "100 to 1000 colonies"],
                    correct: 0
                },
                {
                    q: "If a plate inoculated with 1.0 mL of a 10^-3 dilution yields 150 colonies, what is the count per mL?",
                    options: ["150,000 CFU/mL", "15,000 CFU/mL", "1,500 CFU/mL", "1.5e6 CFU/mL"],
                    correct: 0
                },
                {
                    q: "What does 'TNTC' stand for in plating enumeration?",
                    options: ["Too Numerous To Count", "Total Nitrogen Testing Cycle", "Target Nutrient Temperature Control", "Thermal Neutral Tally Counter"],
                    correct: 0
                },
                {
                    q: "What diluent buffer is recommended by FSSAI for serial dilutions?",
                    options: ["0.1% Peptone Water or Buffered Peptone Water", "Distilled Pure Water", "Hydrochloric Acid 1%", "Potato Dextrose Broth"],
                    correct: 0
                },
                {
                    q: "What is the correct autoclave sterilization parameters for nutrient media?",
                    options: ["121°C at 15 psi for 15 minutes", "100°C at 5 psi for 30 minutes", "134°C at 30 psi for 3 minutes", "115°C at 10 psi for 45 minutes"],
                    correct: 0
                }
            ],
            4: [
                {
                    q: "What enzyme produced by S. aureus catalyzes the conversion of fibrinogen to fibrin, causing plasma clotting?",
                    options: ["Coagulase", "Catalase", "Amylase", "Oxidase"],
                    correct: 0
                },
                {
                    q: "At what temperature and duration should the rabbit plasma coagulase test be incubated?",
                    options: ["37°C for 4 to 24 hours", "21°C for 48 hours", "42°C for 18 hours", "30°C for 2 hours"],
                    correct: 0
                },
                {
                    q: "What does 'TSI' stand for in enterobacteriaceae biochemical profiling?",
                    options: ["Triple Sugar Iron Agar", "Total Solid Inoculum", "Temperature Stability Indicator", "Tryptic Soy Infusion"],
                    correct: 0
                },
                {
                    q: "What sugars are present in Triple Sugar Iron (TSI) agar?",
                    options: ["Glucose, Lactose, and Sucrose", "Glucose, Maltose, and Galactose", "Fructose, Lactose, and Starch", "Sucrose, Mannitol, and Xylose"],
                    correct: 0
                },
                {
                    q: "What does a red slant and yellow butt (K/A reaction) in TSI agar indicate?",
                    options: ["Fermentation of glucose only", "Fermentation of lactose or sucrose", "No sugar fermentation occurred", "Somatic cell contamination"],
                    correct: 0
                },
                {
                    q: "What chemical agent indicates H2S production in a TSI slant by forming a black precipitate?",
                    options: ["Ferrous sulfate (ferrous ions reacting to form ferrous sulfide)", "Bromothymol blue", "Phenol red", "Sodium chloride"],
                    correct: 0
                },
                {
                    q: "What is the correct order of the FSSAI coliform detection hierarchy?",
                    options: ["Presumptive (VRBA) → Confirmed (BGLB) → Completed (EMB)", "Presumptive (BGLB) → Confirmed (EMB) → Completed (VRBA)", "Presumptive (EMB) → Confirmed (VRBA) → Completed (BGLB)", "Presumptive (VRBA) → Confirmed (EMB) → Completed (BGLB)"],
                    correct: 0
                },
                {
                    q: "What color do coliform colonies exhibit on Violet Red Bile Agar (VRBA)?",
                    options: ["Dark red surrounded by a precipitated bile zone", "Metallic green with dark centers", "Translucent light blue", "Bright yellow with bubbles"],
                    correct: 0
                },
                {
                    q: "What characteristic morphologic feature is observed for E. coli on EMB agar?",
                    options: ["Green metallic sheen", "Pink mucoid colonies", "Black slimy sludge", "Yellow halo zones"],
                    correct: 0
                },
                {
                    q: "What gas-collecting device is placed inside BGLB tubes to confirm coliform gas production?",
                    options: ["Durham tube (inverted vial)", "Petroff-Hausser slide", "Laminar flow mesh", "Exhaust purge gauge"],
                    correct: 0
                }
            ],
            5: [
                {
                    q: "What chapter of the United States Pharmacopoeia (USP) governs Antimicrobial Effectiveness Testing?",
                    options: ["Chapter <51>", "Chapter <71>", "Chapter <61>", "Chapter <85>"],
                    correct: 0
                },
                {
                    q: "In AET, what is the purpose of adding a preservative to a pharmaceutical product?",
                    options: ["To prevent microbial growth from contamination during multi-dose use", "To improve chemical flavor", "To increase solution viscosity", "To sterilize the active ingredient"],
                    correct: 0
                },
                {
                    q: "Which of the following is a quaternary ammonium compound commonly used as a preservative?",
                    options: ["Benzalkonium Chloride", "Methylparaben", "Sodium Thiosulfate", "Ascorbic Acid"],
                    correct: 0
                },
                {
                    q: "Why must preservative activity be stopped (neutralized) during time point sampling in AET?",
                    options: ["To prevent continued killing of cells in recovery agar, which causes false 0 counts", "To allow the cells to ferment agar", "To maintain the pH of saline", "To color the agar plates"],
                    correct: 0
                },
                {
                    q: "What is the correct neutralizer system for Benzalkonium Chloride (QAC) and parabens in USP <51>?",
                    options: ["Lecithin + Polysorbate 80", "Sodium Thiosulfate", "Phosphate Buffered Saline (PBS)", "Formaldehyde Bisulfite"],
                    correct: 0
                },
                {
                    q: "If a non-neutralizing buffer like PBS is used for plating AET samples, what is the expected result?",
                    options: ["False 0 colony counts (experimental error)", "Normal growth identical to neutralizer", "Extremely large colonies", "Fungal growth instead of bacterial"],
                    correct: 0
                },
                {
                    q: "What is the standard inoculation level of challenge organisms per mL of product in USP <51>?",
                    options: ["10⁵ to 10⁶ CFU/mL", "10² to 10³ CFU/mL", "10⁸ to 10⁹ CFU/mL", "10 to 100 CFU/mL"],
                    correct: 0
                },
                {
                    q: "Which of the following is a standard challenge yeast strain specified in USP <51>?",
                    options: ["Candida albicans", "Staphylococcus aureus", "Escherichia coli", "Aspergillus brasiliensis"],
                    correct: 0
                },
                {
                    q: "For how many days is an AET preservative challenge assay monitored?",
                    options: ["28 days", "14 days", "7 days", "48 hours"],
                    correct: 0
                },
                {
                    q: "Why is it important that inoculation volume does not exceed 1% of the product volume in AET?",
                    options: ["To prevent diluting the preservative concentration", "To avoid overloading the container", "To prevent foaming of solution", "To keep sample sterile"],
                    correct: 0
                }
            ],
            6: [
                {
                    q: "What is the primary objective of direct inoculation sterility testing under USP <71>?",
                    options: ["To verify the complete absence of viable microbial contaminants in a sterile product", "To count the number of live cells", "To test pH stability", "To measure moisture content"],
                    correct: 0
                },
                {
                    q: "Which medium is used in sterility testing to detect anaerobic bacteria?",
                    options: ["Fluid Thioglycollate Medium (FTM)", "Soybean Casein Digest Medium (SCDM)", "Plate Count Agar (PCA)", "Sabouraud Dextrose Agar (SDA)"],
                    correct: 0
                },
                {
                    q: "Which medium is incubated aerobically to detect aerobic bacteria and fungi in sterility testing?",
                    options: ["Soybean Casein Digest Medium (SCDM)", "Fluid Thioglycollate Medium (FTM)", "BGBB Broth", "TSI Agar Slant"],
                    correct: 0
                },
                {
                    q: "How long must direct inoculation sterility test tubes be incubated?",
                    options: ["14 days", "7 days", "48 hours", "28 days"],
                    correct: 0
                },
                {
                    q: "In Fluid Thioglycollate Medium, what does the pink zone at the top indicate?",
                    options: ["The presence of oxygen (oxidation zone)", "Anaerobic conditions", "Bacterial fermentation", "Indicator dye destruction"],
                    correct: 0
                },
                {
                    q: "What indicator is added to Fluid Thioglycollate Medium (FTM) to visually signal the presence of oxygen?",
                    options: ["Resazurin", "Phenol Red", "Bromothymol Blue", "Crystal Violet"],
                    correct: 0
                },
                {
                    q: "Under USP <71>, Fluid Thioglycollate Medium (FTM) is incubated at what temperature range?",
                    options: ["30°C to 35°C", "20°C to 25°C", "37°C to 42°C", "4°C to 8°C"],
                    correct: 0
                },
                {
                    q: "Under USP <71>, Soybean Casein Digest Medium (SCDM) is incubated at what temperature range?",
                    options: ["20°C to 25°C", "30°C to 35°C", "35°C to 37°C", "15°C to 18°C"],
                    correct: 0
                },
                {
                    q: "What type of growth is expected in SCDM/FTM tubes if a sterile saline sample is inoculated?",
                    options: ["Clear (No Growth)", "Turbid (Growth)", "Pink throughout", "Acid/Gas reaction"],
                    correct: 0
                },
                {
                    q: "Why is the direct inoculation method limited by the volume of product that can be added to the media?",
                    options: ["Excessive product volume can dilute nutrients or cause turbidity, masking growth", "It will cause the tubes to crack", "It overflows the safety cabinet", "Capillary action will cease"],
                    correct: 0
                }
            ],
            7: [
                {
                    q: "What is the standard surface area swabbed in a sanitation audit?",
                    options: ["10x10 cm² (100 cm²)", "5x5 cm² (25 cm²)", "1x1 cm² (1 cm²)", "50x50 cm² (2500 cm²)"],
                    correct: 0
                },
                {
                    q: "If a swab collects sample from 100 cm² and is suspended in 10 mL buffer, and 1 mL is plated, what is the surface dilution factor?",
                    options: ["1/10 (or 10x multiplier)", "1/100 (or 100x multiplier)", "1/1 (no multiplier)", "10/100 (or 0.1x multiplier)"],
                    correct: 0
                },
                {
                    q: "What is the formula to calculate contamination density in CFU/cm² from a swab plate count?",
                    options: ["CFU/cm² = Colonies Counted / 10", "CFU/cm² = Colonies Counted * 10", "CFU/cm² = Colonies Counted / 100", "CFU/cm² = Colonies Counted * 100"],
                    correct: 0
                },
                {
                    q: "Why is sanitization efficacy evaluated in cleanroom areas?",
                    options: ["To ensure microbial safety and prevent contamination of pharmaceutical products", "To clean the floors", "To verify chemical pH", "To reduce humidity"],
                    correct: 0
                },
                {
                    q: "What type of medium is typically poured for general aerobic count plates from environmental swabs?",
                    options: ["Plate Count Agar (PCA)", "Baird Parker Agar", "Vogel Johnson Agar", "Triple Sugar Iron Agar"],
                    correct: 0
                },
                {
                    q: "At what temperature and duration are PCA plates typically incubated for environmental surface monitoring?",
                    options: ["30°C for 48 hours", "37°C for 24 hours", "21°C for 5 days", "42°C for 18 hours"],
                    correct: 0
                },
                {
                    q: "In swab testing, what is the purpose of the untreated control surface?",
                    options: ["To establish a baseline of contamination for calculating disinfection efficacy", "To clean the template", "To check media sterility", "To calibrate the micro-pipette"],
                    correct: 0
                },
                {
                    q: "If an environmental swab of a 100 cm² surface is suspended in 10 mL buffer, and 1 mL is plated, and 15 colonies grow, what is the surface contamination density?",
                    options: ["1.5 CFU/cm²", "15 CFU/cm²", "0.15 CFU/cm²", "150 CFU/cm²"],
                    correct: 0
                },
                {
                    q: "What is the direct dilution multiplier if 1 mL of swab buffer (from 10 mL total) is plated directly?",
                    options: ["10 (as 1 mL is one-tenth of the total 10 mL volume)", "100", "1", "0.1"],
                    correct: 0
                },
                {
                    q: "What does CFU stand for in microbiological reporting?",
                    options: ["Colony Forming Unit", "Cell Fractional Unit", "Contamination Factor Unit", "Certified Fungal Unit"],
                    correct: 0
                }
            ]
        };;
        
        // Technical quiz database
        this.quizzes = {
            1: [
                {
                    q: "What is the mandatory color scheme and design for the FSSAI vegetarian symbol?",
                    options: ["A green circle inside a green outlined square", "A green leaf inside a green triangle", "A green star inside a circle", "A green cross inside a square"],
                    correct: 0
                },
                {
                    q: "If a commercial packaged juice is audited and found to lack a Veg/Non-Veg logo, what is the regulatory status?",
                    options: ["Non-compliant; subject to enforcement and recall", "Compliant, as juice is assumed vegetarian", "Compliant, if ingredients are listed", "Exempt from labelling laws"],
                    correct: 0
                },
                {
                    q: "Infant milk substitutes and infant foods must carry which mandatory warning under FSSAI rules?",
                    options: ["Infant food should be used only on the advice of a health worker", "Do not feed to infants under 12 months", "Contains dairy allergens", "Not for retail sale"],
                    correct: 0
                },
                {
                    q: "What does an FSSAI license number starting with the digit '1' typically indicate?",
                    options: ["Central or State Food Business License", "Temporary street vendor license", "Imported food registration", "Catering service certificate"],
                    correct: 0
                },
                {
                    q: "Which ingredient declaration is legally required to be highlighted in bold under FSSAI allergen regulations?",
                    options: ["Milk Solids", "Citric Acid", "Water", "Orange Juice Concentrate"],
                    correct: 0
                },
                {
                    q: "A wheat flour package has no allergen warning for gluten. What is the audit decision?",
                    options: ["Non-Compliant; wheat gluten is a major allergen source", "Compliant, since wheat flour is natural", "Compliant, if FSSAI license is valid", "Exempt if locally manufactured"],
                    correct: 0
                },
                {
                    q: "Under FSSAI packaging guidelines, why is the FSSAI license number required to be 14 digits?",
                    options: ["To encode state, year, registrar, and factory ID", "To match international barcode formats", "To secure digital payment verification", "To prevent font spacing errors"],
                    correct: 0
                },
                {
                    q: "If a company prints a 5-digit number as its FSSAI license on infant formula, why is it flagged as non-standard?",
                    options: ["It must be a 14-digit format", "It must be an alphanumeric code", "It must contain state letters", "It must be at least 10 digits"],
                    correct: 0
                },
                {
                    q: "For a package of whole wheat flour, what is the correct combination for a compliant label audit?",
                    options: ["Vegetarian logo checked, 14-digit FSSAI license checked, allergen gluten declared, compliant decision", "Non-compliant decision, all checkboxes checked", "Passed audit with all allergen/fssai checkboxes checked", "FSSAI license unchecked, passed decision"],
                    correct: 0
                },
                {
                    q: "Which authority is responsible for executing food label regulations and enforcement in India?",
                    options: ["Food Safety and Standards Authority of India (FSSAI)", "Bureau of Indian Standards (BIS)", "Central Drugs Standard Control Organisation (CDSCO)", "Ministry of Consumer Affairs"],
                    correct: 0
                }
            ],
            2: [
                {
                    q: "What is the standard depth of the Petroff-Hausser counting chamber ruled area?",
                    options: ["0.1 mm", "0.02 mm", "0.05 mm", "0.2 mm"],
                    correct: 1
                },
                {
                    q: "How is the Petroff-Hausser chamber factor of 50,000 mathematically derived?",
                    options: [
                        "Multiplying the slide area by the magnification factor",
                        "Converting the 0.02 mm³ chamber volume to a 1 mL (1,000 mm³) standard",
                        "Accounting for refraction indices under high-dry objectives",
                        "Compensating for somatic cell weights in raw smears"
                    ],
                    correct: 1
                },
                {
                    q: "Which objective lens magnification and type are standard for counting stained bacterial smears in a DMC protocol?",
                    options: [
                        "40x high-dry objective",
                        "10x low-power objective",
                        "100x oil immersion objective",
                        "4x scanner objective"
                    ],
                    correct: 2
                },
                {
                    q: "An analyst counts an average of 12 bacteria per field in a milk smear with a microscopic factor (MF) of 400,000. If the milk was diluted 1:10 before staining, what is the actual count of bacteria per mL of the original milk?",
                    options: [
                        "4.8 × 10⁶ cells/mL",
                        "4.8 × 10⁷ cells/mL",
                        "4.8 × 10⁵ cells/mL",
                        "4.8 × 10⁸ cells/mL"
                    ],
                    correct: 1
                },
                {
                    q: "Under FSSAI guidelines, a raw milk sample has a DMC clump count of 3.2 × 10⁶ clumps/mL. What is the raw milk grade and action required?",
                    options: [
                        "Excellent quality; accept immediately",
                        "Good quality; accept immediately",
                        "Fair quality; requires sanitation audits",
                        "Poor quality; subject to rejection"
                    ],
                    correct: 2
                },
                {
                    q: "Why is oil immersion microscopy necessary for direct microscopic counts rather than high-dry lenses?",
                    options: [
                        "It increases the magnification by 10-fold",
                        "Oil matches the refractive index of glass, preventing light refraction and maintaining optical resolution",
                        "Oil stains the cell walls of Gram-negative bacteria",
                        "Oil prevents the Breed smear template from drying out"
                    ],
                    correct: 1
                },
                {
                    q: "An analyst is calculating the Microscopic Factor (MF) for a new microscope. The field diameter under oil immersion is 0.16 mm, and the sample volume deposited is 0.01 mL. What is the approximate Microscopic Factor (MF)?",
                    options: [
                        "5,000",
                        "50,000",
                        "500,000",
                        "5,000,000"
                    ],
                    correct: 2
                },
                {
                    q: "Under FSSAI platform QA rules, why report 'clump counts' rather than 'individual cells' for plate counts?",
                    options: [
                        "Individual cells are too small to see clearly",
                        "A bacterial cluster or clump yields only one colony on agar, correlating better with plate count colonies",
                        "Clumping indicates somatic cell presence",
                        "Clumps contain only dead cells"
                    ],
                    correct: 1
                },
                {
                    q: "As a Quality Assurance Lead, you are writing the SOP for a Breed Smear DMC platform test. What is the standard sample volume and smear area template that must be specified?",
                    options: [
                        "Deposit 0.1 mL of milk and spread over 10 cm²",
                        "Deposit 0.01 mL of milk and spread over 1 cm²",
                        "Deposit 0.02 mL of milk and spread over 2 cm²",
                        "Deposit 0.001 mL of milk and spread over 0.1 cm²"
                    ],
                    correct: 1
                },
                {
                    q: "You need to verify if a raw milk shipment with a suspected high bacterial load (>10⁷ cells/mL) can be counted using the Petroff-Hausser chamber. Since DMC has a sensitivity limit around 10⁶ cells/mL, what dilution protocol should you design to obtain an accurate, countable density?",
                    options: [
                        "Count the raw milk undiluted; the chamber factor compensates automatically",
                        "Prepare a 1:100 serial dilution in sterile saline and count, then multiply the final calculation by a dilution reciprocal of 100",
                        "Boil the milk to coagulate the proteins before loading the chamber",
                        "Use a 10% tartaric acid solution as the diluent to dissolve somatic cells first"
                    ],
                    correct: 1
                }
            ],
            3: [
                {
                    q: "What is the statistically valid range of colonies required on an agar plate for viable enumeration calculations?",
                    options: ["10 to 100 colonies", "30 to 300 colonies", "50 to 500 colonies", "100 to 1000 colonies"],
                    correct: 1
                },
                {
                    q: "What standard incubation parameter governs the general Aerobic Plate Count (APC/SPC) under FSSAI 15.001:2024?",
                    options: ["30°C for 24 hours", "37°C for 48–72 hours", "21°C for 2–5 days", "36°C for 24–30 hours"],
                    correct: 1
                },
                {
                    q: "Under FSSAI regulations, what is the standard diluent buffer used to prepare serial dilution blanks for food samples?",
                    options: [
                        "Sterile distilled water",
                        "0.1% Peptone Water or Buffered Peptone Water",
                        "10% Tartaric Acid solution",
                        "Brilliant Green Lactose Bile broth"
                    ],
                    correct: 1
                },
                {
                    q: "Why is 10% tartaric acid added to Potato Dextrose Agar (PDA) during Yeast and Mould testing?",
                    options: [
                        "To act as a carbon food source for rapid spore germination",
                        "To adjust pH and suppress competing bacterial growth",
                        "To stain fungal hyphae a clear dark blue color",
                        "To prevent the agar from drying out inside incubators"
                    ],
                    correct: 1
                },
                {
                    q: "An analyst plates 1.0 mL of a 10⁻³ serial dilution of raw milk on PCA. After incubation, the plate yields 150 colonies. What is the viable cell count of the original milk sample?",
                    options: [
                        "1.5 × 10³ CFU/mL",
                        "1.5 × 10⁴ CFU/mL",
                        "1.5 × 10⁵ CFU/mL",
                        "1.5 × 10⁶ CFU/mL"
                    ],
                    correct: 2
                },
                {
                    q: "An analyst fails to change pipette tips when diluting a milk sample, carrying over concentrated fluid from the 10⁻² tube into the 10⁻³ tube. How does this residue carryover affect downstream plate counts?",
                    options: [
                        "It has no effect because peptone water kills carryover cells",
                        "It results in an artificially high count of colonies, causing a mathematical verification failure in the logs",
                        "It causes bacterial cells to lyse, leading to zero colony growth (TFTC)",
                        "It selectively supports fungal growth over bacterial growth"
                    ],
                    correct: 1
                },
                {
                    q: "Under FSSAI guidelines for bottled drinking water, what is the regulatory limit for Pseudomonas aeruginosa?",
                    options: [
                        "Less than 10 CFU/mL",
                        "Complete absence, i.e., 0 CFU per 250 mL",
                        "Less than 100 CFU per 100 mL",
                        "Up to 5 CFU per 250 mL"
                    ],
                    correct: 1
                },
                {
                    q: "A salad greens wash sample is plated on PCA at 10⁻¹ (220 colonies) and 10⁻² (22 colonies). According to the 30-300 rule, how should the analyst calculate and report the final CFU/mL?",
                    options: [
                        "Average both counts: (2200 + 2200) / 2 = 2200 CFU/mL",
                        "Use the 10⁻¹ plate count because 220 is within the countable range (30-300), reporting 2.2 × 10³ CFU/mL",
                        "Use the 10⁻² plate count because it has fewer colonies, reporting 2.2 × 10³ CFU/mL",
                        "Report as Too Numerous To Count (TNTC) because the first plate exceeds 200"
                    ],
                    correct: 1
                },
                {
                    q: "You are designing a testing scheme for a raw milk supply suspected of having a high microbial load (~10⁶ CFU/mL). If you want the plate to have exactly between 30 and 300 colonies, which serial dilutions should you target for inoculation?",
                    options: [
                        "Plate only the undiluted stock and the 10⁻¹ dilution",
                        "Target and plate the 10⁻³ and 10⁻⁴ dilutions",
                        "Plate the 10⁻⁵ and 10⁻⁶ dilutions to ensure zero growth",
                        "Filter 250 mL of milk through a membrane filter and plate the filter"
                    ],
                    correct: 1
                },
                {
                    q: "When testing bottled water for Pseudomonas aeruginosa, which filtration and plating protocol should you implement to comply with FSSAI regulations?",
                    options: [
                        "Plate 1 mL of bottled water directly on PCA agar",
                        "Filter 250 mL of water through a 0.45 μm membrane filter, place the filter on a selective PA Count Plate, and incubate at 36°C",
                        "Heat the water to 60°C for 30 minutes, then streak on Baird-Parker agar",
                        "Prepare a 1:1000 serial dilution in peptone water and plate on Potato Dextrose Agar"
                    ],
                    correct: 1
                }
            ],
            4: [
                {
                    q: "How is a positive coagulase confirmatory test for Staphylococcus aureus identified?",
                    options: [
                        "Gas bubbles form rapidly in the tube",
                        "The media turns bright yellow with gas bubbles",
                        "The rabbit plasma broth forms a firm clot that does not run when tilted",
                        "Colonies exhibit a green metallic sheen"
                    ],
                    correct: 2
                },
                {
                    q: "What is the key enzymatic product detected by the tube coagulase test versus the slide agglutination test?",
                    options: [
                        "Slide test detects bound coagulase (clumping factor) attached to the cell wall; tube test detects free coagulase secreted extracellularly",
                        "Slide test detects free coagulase; tube test detects bound coagulase",
                        "Slide test detects catalase; tube test detects oxidase",
                        "Slide test detects staphylokinase; tube test detects fibrinolysin"
                    ],
                    correct: 0
                },
                {
                    q: "In coliform testing, what is the function of the inverted Durham tube placed inside the 2% BGLB broth?",
                    options: [
                        "To maintain anaerobic conditions for agar growth",
                        "To collect gas bubbles produced during lactose fermentation",
                        "To measure the pH change of the broth",
                        "To check for the presence of Gram-positive spore formers"
                    ],
                    correct: 1
                },
                {
                    q: "What TSI reaction slant profile is typical for Salmonella spp. identification?",
                    options: [
                        "Acid slant (Yellow) / Acid butt (Yellow) without gas",
                        "Alkaline slant (Pink-red / K) / Acid butt (Yellow / A) with gas and H₂S blackening",
                        "Alkaline slant (Pink) / Alkaline butt (Pink) with H₂S blackening",
                        "Acid slant (Yellow) / Alkaline butt (Pink) with gas"
                    ],
                    correct: 1
                },
                {
                    q: "What is the correct FSSAI hierarchical sequence for testing Coliform indicators?",
                    options: [
                        "Presumptive (VRBA) → Confirmed (2% BGLB Broth) → Completed (EMB Agar)",
                        "Presumptive (2% BGLB) → Confirmed (EMB) → Completed (VRBA)",
                        "Presumptive (EMB) → Confirmed (VRBA) → Completed (BGLB)",
                        "Presumptive (VRBA) → Confirmed (EMB) → Completed (2% BGLB)"
                    ],
                    correct: 0
                },
                {
                    q: "An analyst reads a coagulase test after 4 hours of incubation at 37°C and sees a firm clot. However, after leaving the tube in the incubator overnight (24 hours), the clot is completely dissolved and the liquid flows freely. What is the explanation and correct QA report?",
                    options: [
                        "The sample is negative for S. aureus because the clot dissolved",
                        "S. aureus produced staphylokinase (fibrinolysin), which dissolved the clot upon extended incubation; the test is positive and must be reported as such based on the 4h reading",
                        "The plasma was contaminated with coliforms, causing clot liquefaction",
                        "The incubation temperature was too low, causing the clot to melt"
                    ],
                    correct: 1
                },
                {
                    q: "How does Escherichia coli display on Eosin Methylene Blue (EMB) agar, and what is the chemical basis for this appearance?",
                    options: [
                        "It forms colorless colonies because it is lactose-negative",
                        "It forms dark colonies with a distinctive metallic green sheen due to rapid lactose fermentation precipitating the dyes",
                        "It forms pink mucoid colonies due to slow lactose fermentation",
                        "It forms yellow halo colonies due to mannitol fermentation"
                    ],
                    correct: 1
                },
                {
                    q: "A TSI agar slant inoculated with a Gram-negative rod shows a pink slant and a pink butt (K/K) after 24 hours of incubation at 37°C, with no black precipitate or bubbles. Which organism is most likely responsible?",
                    options: [
                        "Salmonella enterica",
                        "Escherichia coli",
                        "Pseudomonas aeruginosa",
                        "Staphylococcus aureus"
                    ],
                    correct: 2
                },
                {
                    q: "You are designing a selective plating protocol to isolate Escherichia coli from a food sample. To differentiate E. coli (rapid lactose fermenter) from Enterobacter aerogenes (slow lactose fermenter), which agar medium and colony morphology should you specify in your laboratory manual?",
                    options: [
                        "Baird-Parker agar; look for black colonies with clear zones",
                        "EMB Agar; differentiate E. coli by its metallic green sheen from E. aerogenes which forms pink/purple mucoid colonies without a sheen",
                        "Potato Dextrose Agar adjusted to pH 3.5; look for filamentous white molds",
                        "Triple Sugar Iron slants; look for K/K alkaline reactions"
                    ],
                    correct: 1
                },
                {
                    q: "You need to formulate a confirmatory protocol for suspected Staphylococcus aureus colonies picked from Baird-Parker agar. To prevent false negatives caused by clot dissolution (staphylokinase activity) or bound-coagulase negative strains, what procedure should you design?",
                    options: [
                        "Run a tube coagulase test with rabbit plasma, incubating at 37°C and checking for clot formation hourly up to 6 hours, and final check at 24 hours",
                        "Heat-fix the colonies, stain with Newman-Lampert stain, and check for H₂S gas cracks",
                        "Inoculate into 2% BGLB broth with Durham tubes and check for gas after 48 hours",
                        "Streak on EMB agar and look for metallic green sheen within 4 hours"
                    ],
                    correct: 0
                }
            ],
            5: [
                {
                    q: "Which USP <51> Category 1 microbial group requires a ≥ 3.0 log reduction by Day 14?",
                    options: ["Bacteria (e.g. S. aureus)", "Yeast (e.g. C. albicans)", "Mold (e.g. A. brasiliensis)", "All categories"],
                    correct: 0
                },
                {
                    q: "What is the USP <51> Category 1 pass criteria for Yeast and Mold?",
                    options: ["No increase (≤ 0.5 log increase) from Day 0 baseline at Day 7, 14, and 28", "≥ 3.0 log reduction by Day 14", "≥ 1.0 log reduction by Day 7", "Complete sterilization by Day 28"],
                    correct: 0
                },
                {
                    q: "If S. aureus has a Day 0 count of 1.2 × 10⁶ CFU/mL and Day 7 count of 900 CFU/mL, what is the log reduction?",
                    options: ["3.13 log reduction", "2.05 log reduction", "4.15 log reduction", "1.12 log reduction"],
                    correct: 0
                },
                {
                    q: "What is the log reduction if Candida albicans goes from 1.5 × 10⁶ CFU/mL at Day 0 to 7.5 × 10⁴ CFU/mL at Day 14?",
                    options: ["1.30 log reduction", "2.30 log reduction", "0.30 log reduction", "3.30 log reduction"],
                    correct: 0
                },
                {
                    q: "Why does using PBS as a diluent during time-point transfers in AET lead to false 0 counts?",
                    options: ["Preservative remains active in dilution and kills cells before agar solidifies", "PBS has a high salt toxicity", "SDA agar contains natural neutralizers", "Yeast cannot grow in saline"],
                    correct: 0
                },
                {
                    q: "Which neutralizing agent is combined with Polysorbate 80 to neutralize quaternary ammonium compounds?",
                    options: ["Lecithin", "Sodium Thiosulfate", "Sodium Bisulfite", "Catalase"],
                    correct: 0
                },
                {
                    q: "What is the chemical classification of Benzalkonium Chloride?",
                    options: ["Quaternary ammonium compound (QAC)", "Paraben ester", "Phenolic compound", "Halogen oxidizer"],
                    correct: 0
                },
                {
                    q: "If you inoculate 0.1 mL of challenge culture into 10 mL of product, what is the inoculation volume percentage?",
                    options: ["1.0% (the maximum allowed under USP <51>)", "0.1%", "10.0%", "5.0%"],
                    correct: 0
                },
                {
                    q: "In an AET, a count of 45 colonies is observed on a 10⁻² dilution plate. What is the CFU/mL?",
                    options: ["4,500 CFU/mL", "450 CFU/mL", "45,000 CFU/mL", "450,000 CFU/mL"],
                    correct: 0
                },
                {
                    q: "If an AET challenge shows 0 log reduction for bacteria at Day 7 and Day 14, what is the final assay conclusion?",
                    options: ["Preservative system fails efficacy standards", "Preservative system passes efficacy standards", "Assay is inconclusive", "Product is sterile"],
                    correct: 0
                }
            ],
            6: [
                {
                    q: "Fluid Thioglycollate Medium (FTM) is incubated at what temperature range under USP <71>?",
                    options: ["30°C to 35°C (32.5 ± 2.5°C)", "20°C to 25°C", "37°C to 42°C", "4°C to 8°C"],
                    correct: 0
                },
                {
                    q: "Soybean Casein Digest Medium (SCDM) is incubated at what temperature range to promote fungal growth?",
                    options: ["20°C to 25°C (22.5 ± 2.5°C)", "30°C to 35°C", "37°C", "0°C"],
                    correct: 0
                },
                {
                    q: "A sterility test tube displays growth throughout the medium, making it cloudy. This is called:",
                    options: ["Turbidity", "Oxidation", "Precipitation", "Decoloration"],
                    correct: 0
                },
                {
                    q: "In FTM, why is Resazurin added to the medium formulation?",
                    options: ["As an oxidation indicator (turns pink in the presence of oxygen)", "To select against Gram-positives", "To neutralize alcohol", "To solidify the medium"],
                    correct: 0
                },
                {
                    q: "If eye drops are contaminated, what growth patterns are typically observed after 14 days of incubation?",
                    options: ["Turbid growth in both FTM and SCDM tubes", "FTM remains clear, SCDM grows turbid", "SCDM remains clear, FTM grows turbid", "Both tubes remain clear"],
                    correct: 0
                },
                {
                    q: "Under USP <71> sterility testing guidelines, what does a clear, non-turbid SCDM broth after 14 days signify?",
                    options: ["No viable aerobic organisms or fungi detected in the sample", "Fungal contamination is present", "Autoclave temperature was too low", "The sample is non-sterile"],
                    correct: 0
                },
                {
                    q: "Which of the following is a key limitation of direct inoculation sterility testing?",
                    options: ["It can only test small volumes and may fail to detect low-level contaminants", "It requires radioactive materials", "It takes only 2 hours", "It is only applicable to dry powders"],
                    correct: 0
                },
                {
                    q: "Sodium thioglycollate in Fluid Thioglycollate Medium serves what primary function?",
                    options: ["It acts as a reducing agent to keep oxygen levels low for anaerobes", "It acts as a carbon source for energy", "It is a selective agent against fungi", "It stabilizes the pH of the SCDM"],
                    correct: 0
                },
                {
                    q: "If a sterility test displays turbidity in the negative control container, what does this indicate?",
                    options: ["The test is invalid due to laboratory or media contamination", "The product is sterile", "Anaerobic conditions were achieved", "Incubation temperature was too high"],
                    correct: 0
                },
                {
                    q: "What is the minimum incubation time required for a USP <71> sterility test by direct inoculation?",
                    options: ["14 days", "7 days", "48 hours", "28 days"],
                    correct: 0
                }
            ],
            7: [
                {
                    q: "An environmental swab of a 100 cm² surface is suspended in 10 mL buffer, and 1 mL is plated. If 15 colonies grow, what is the surface contamination density?",
                    options: ["1.5 CFU/cm²", "15 CFU/cm²", "0.15 CFU/cm²", "150 CFU/cm²"],
                    correct: 0
                },
                {
                    q: "What sanitizer treatment typically shows the highest disinfection efficacy (lowest CFU count) on cleanroom stainless steel?",
                    options: ["10% Bleach (sodium hypochlorite)", "70% Ethanol", "Untreated Control", "Tap water"],
                    correct: 0
                },
                {
                    q: "In swab testing, what is the purpose of the untreated control surface?",
                    options: ["To establish a baseline of contamination for calculating disinfection log reductions", "To clean the template", "To check media sterility", "To calibrate the micro-pipette"],
                    correct: 0
                },
                {
                    q: "Which dilution multiplier converts colonies counted on a plate (from a 100 cm² surface in 10 mL buffer, 1 mL plated) to CFU/cm²?",
                    options: ["0.1 (or divide by 10)", "10", "100", "1.0"],
                    correct: 0
                },
                {
                    q: "Why is 70% ethanol preferred over 100% ethanol for surface disinfection?",
                    options: ["Water is required to facilitate denaturation of proteins and penetration of cell membranes", "100% ethanol is too explosive", "70% ethanol has a better scent", "Water keeps the surface wet forever"],
                    correct: 0
                },
                {
                    q: "If a surface sanitized with 70% Ethanol yields 15 colonies, and the untreated control yields 150 colonies, what is the percent reduction?",
                    options: ["90%", "10%", "50%", "99%"],
                    correct: 0
                },
                {
                    q: "Which standard horizontal method governs surface sampling techniques in the food and pharmaceutical sectors?",
                    options: ["ISO 18593", "ISO 9001", "USP <51>", "FSSAI 15.001"],
                    correct: 0
                },
                {
                    q: "How does a chemical disinfectant process indicator help verify sanitization protocols?",
                    options: ["It confirms that the surface has been exposed to the active chemical agent", "It counts the remaining viable bacteria", "It adjusts the incubator temperature", "It measures the room humidity"],
                    correct: 0
                },
                {
                    q: "What is the biological action of sodium hypochlorite (bleach) on bacterial cells?",
                    options: ["Rapid oxidation of cellular components and protein denaturation", "Inhibition of cell wall synthesis", "Interference with ribosomal protein synthesis", "Inhibition of DNA replication"],
                    correct: 0
                },
                {
                    q: "In environmental monitoring, what constitutes an 'action level' failure?",
                    options: ["The bioburden exceeds a pre-set regulatory limit, requiring immediate sanitization and investigation", "The temperature goes down by 1 degree", "The control plate has 0 colonies", "The sanitization is done twice"],
                    correct: 0
                }
            ]
        };;
    }

    init() {
        this.bindGlobalEvents();
        this.bindKeyboardEvents();
        this.showDashboard();
        
        // Load saved session progress if any
        this.loadSession();

        // Start background visual tutorial hint refresh loop (every 500ms)
        setInterval(() => this.updateHintOverlay(), 500);
    }

    bindGlobalEvents() {
        // Dashboard select module hook
        window.selectModule = (moduleNum) => this.loadModule(moduleNum);

        // Header and back buttons
        const btnBack = document.getElementById('btn-back-dashboard');
        if (btnBack) {
            btnBack.onclick = () => {
                this.showDashboard();
                audio.playClick();
            };
        }

        // Universal Fullscreen toggle
        const btnToggleFullscreen = document.getElementById('btn-toggle-fullscreen');
        if (btnToggleFullscreen) {
            btnToggleFullscreen.onclick = () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().then(() => {
                        btnToggleFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i>';
                        btnToggleFullscreen.setAttribute('title', 'Exit Fullscreen');
                    }).catch(err => {
                        console.error(`Error enabling fullscreen: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen().then(() => {
                        btnToggleFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i>';
                        btnToggleFullscreen.setAttribute('title', 'Enter Fullscreen');
                    }).catch(err => {
                        console.error(`Error exiting fullscreen: ${err.message}`);
                    });
                }
                audio.playClick();
            };
        }

        // Listen for screen changes to sync icons
        document.addEventListener('fullscreenchange', () => {
            if (btnToggleFullscreen) {
                if (document.fullscreenElement) {
                    btnToggleFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i>';
                    btnToggleFullscreen.setAttribute('title', 'Exit Fullscreen');
                } else {
                    btnToggleFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i>';
                    btnToggleFullscreen.setAttribute('title', 'Enter Fullscreen');
                }
            }
        });

        // Theme toggle accessibility check
        const btnToggleTheme = document.getElementById('btn-toggle-theme');
        if (btnToggleTheme) {
            btnToggleTheme.onclick = () => {
                document.body.classList.toggle('light-theme');
                audio.playClick();
                this.saveSession();
            };
        }

        // Help Modal shortcuts toggle
        const btnToggleHelp = document.getElementById('btn-toggle-help');
        const btnCloseHelp = document.getElementById('btn-close-help');
        const helpModal = document.getElementById('help-modal');
        if (btnToggleHelp && helpModal) {
            btnToggleHelp.onclick = () => {
                helpModal.classList.add('open');
                audio.playClick();
            };
        }
        if (btnCloseHelp && helpModal) {
            btnCloseHelp.onclick = () => {
                helpModal.classList.remove('open');
                audio.playClick();
            };
        }

        // Floating Notebook panel toggle
        const btnToggleNotebook = document.getElementById('btn-toggle-notebook');
        const btnCloseNotebook = document.getElementById('btn-close-notebook');
        const notebookPanel = document.getElementById('lab-notebook-panel');

        if (btnToggleNotebook && notebookPanel) {
            btnToggleNotebook.onclick = () => {
                notebookPanel.classList.toggle('open');
                audio.playClick();
                
                if (notebookPanel.classList.contains('open') && this.activeModuleNum) {
                    notebook.updateLogView(this.activeModuleNum);
                }
            };
        }

        if (btnCloseNotebook && notebookPanel) {
            btnCloseNotebook.onclick = () => {
                notebookPanel.classList.remove('open');
                audio.playClick();
            };
        }

        // Lab notebook sub section tab switches
        const noteTabs = document.querySelectorAll('.notebook-tab-btn');
        noteTabs.forEach(btn => {
            btn.onclick = (e) => {
                const modName = e.target.getAttribute('data-note'); // m1, m2, m3, m4
                const modNum = parseInt(modName.replace('m', ''));
                notebook.updateLogView(modNum);
                audio.playClick();
            };
        });

        // Verify notebook log button clicks
        document.querySelectorAll('.btn-submit-log').forEach(btn => {
            btn.onclick = (e) => {
                const modNum = parseInt(e.target.getAttribute('data-module'));
                notebook.verifyCalculation(modNum);
            };
        });

        // Workspace tab switches
        const wsTabs = document.querySelectorAll('.workspace-tabs .tab-btn');
        wsTabs.forEach(btn => {
            btn.onclick = (e) => {
                // Find clicked button even if clicking icon inside
                const clickedBtn = e.target.closest('.tab-btn');
                const tabName = clickedBtn.getAttribute('data-tab');
                this.switchTab(tabName);
                audio.playClick();
            };
        });

        // Step navigation controls
        const btnPrev = document.getElementById('btn-prev-step');
        const btnNext = document.getElementById('btn-next-step');

        if (btnPrev) {
            btnPrev.onclick = () => {
                this.getActiveModule().prevStep();
            };
        }
        if (btnNext) {
            btnNext.onclick = () => {
                this.getActiveModule().nextStep();
            };
        }

        // Quiz Submit
        const btnSubmitQuiz = document.getElementById('btn-submit-quiz');
        if (btnSubmitQuiz) {
            btnSubmitQuiz.onclick = () => {
                this.gradeQuiz();
            };
        }

        // Pre-Lab Quiz Submit
        const btnSubmitPreQuiz = document.getElementById('btn-submit-prequiz');
        if (btnSubmitPreQuiz) {
            btnSubmitPreQuiz.onclick = () => {
                this.gradePreQuiz();
            };
        }

        // Certificate claims
        const btnViewCert = document.getElementById('btn-view-certificate');
        const btnCloseCert = document.getElementById('btn-close-cert');
        const certModal = document.getElementById('cert-modal');

        if (btnViewCert) {
            btnViewCert.onclick = () => {
                notebook.showCertificate();
            };
        }

        if (btnCloseCert && certModal) {
            btnCloseCert.onclick = () => {
                certModal.classList.remove('open');
                audio.playClick();
            };
        }
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Escape key: close active modals
            if (e.key === 'Escape') {
                const helpModal = document.getElementById('help-modal');
                const certModal = document.getElementById('cert-modal');
                let closed = false;
                if (helpModal && helpModal.classList.contains('open')) {
                    helpModal.classList.remove('open');
                    closed = true;
                }
                if (certModal && certModal.classList.contains('open')) {
                    certModal.classList.remove('open');
                    closed = true;
                }
                if (closed) {
                    audio.playClick();
                }
                return;
            }

            // Notebook toggle: 'n' / 'N' (avoid triggering when typing in inputs/textareas/selects)
            if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
                const btnToggleNotebook = document.getElementById('btn-toggle-notebook');
                if (btnToggleNotebook) {
                    btnToggleNotebook.click();
                }
                return;
            }

            // Only run other shortcuts if on simulation tab and module is active
            if (this.activeTab !== 'simulation' || !this.activeModuleNum) return;

            // Avoid shortcuts if typing in fields
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

            // Spacebar: register tally count for microscope or colony count
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                if (this.activeModuleNum === 2) {
                    const btnCount = document.getElementById('btn-tally-count');
                    if (btnCount) btnCount.click();
                } else if (this.activeModuleNum === 3) {
                    const btnCountCol = document.getElementById('btn-colony-tally');
                    if (btnCountCol && !btnCountCol.disabled) btnCountCol.click();
                }
            }

            // Module 2 Microscope Shortcuts
            if (this.activeModuleNum === 2) {
                // Focus: F / + / -
                const slider = document.getElementById('slider-focus');
                if (slider) {
                    let val = parseInt(slider.value);
                    let changed = false;
                    if (e.key === 'f' || e.key === 'F') {
                        val = Math.min(100, val + 2);
                        changed = true;
                    } else if (e.key === '+' || e.key === '=') {
                        val = Math.min(100, val + 5);
                        changed = true;
                    } else if (e.key === '-') {
                        val = Math.max(0, val - 5);
                        changed = true;
                    }

                    if (changed) {
                        slider.value = val;
                        slider.dispatchEvent(new Event('input'));
                        slider.dispatchEvent(new Event('change'));
                        e.preventDefault();
                    }
                }

                // Stage movement: Arrow Keys
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                    const stepSize = 40;
                    if (e.key === 'ArrowUp') {
                        microscope.slidePos.y = Math.max(200, microscope.slidePos.y - stepSize);
                    } else if (e.key === 'ArrowDown') {
                        microscope.slidePos.y = Math.max(200, Math.min(1800, microscope.slidePos.y + stepSize));
                    } else if (e.key === 'ArrowLeft') {
                        microscope.slidePos.x = Math.max(200, microscope.slidePos.x - stepSize);
                    } else if (e.key === 'ArrowRight') {
                        microscope.slidePos.x = Math.max(200, Math.min(1800, microscope.slidePos.x + stepSize));
                    }
                    audio.playClick();
                    
                    const gridCentered = Math.abs(microscope.slidePos.x - 1000) < 50 && Math.abs(microscope.slidePos.y - 1000) < 50;
                    if (gridCentered && microscope.currentStep === 2) {
                        microscope.nextStep();
                    }
                    microscope.draw();
                }
            }

            // Module 3 Dilution Shortcuts
            if (this.activeModuleNum === 3) {
                // Number keys 0-5 to select tubes
                if (e.key >= '0' && e.key <= '5') {
                    e.preventDefault();
                    const idx = parseInt(e.key);
                    const tubeSlot = document.getElementById(`dilution-tube-${idx}`);
                    if (tubeSlot) tubeSlot.click();
                }

                // Enter / E: Pipette Aspirate & Dispense
                if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
                    e.preventDefault();
                    if (dilution.pipette.fluidVol > 0.0) {
                        const btnDispense = document.getElementById('btn-pipette-dispense');
                        if (btnDispense) btnDispense.click();
                    } else {
                        const btnAspirate = document.getElementById('btn-pipette-aspirate');
                        if (btnAspirate) btnAspirate.click();
                    }
                }
            }

            // Module 4 Pathogens Shortcuts
            if (this.activeModuleNum === 4) {
                // T: Tilt Coagulase Broth Tube
                if (e.key === 't' || e.key === 'T') {
                    e.preventDefault();
                    if (pathogen.activeSub === 'staph') {
                        const btnTilt = document.getElementById('btn-tilt-tube');
                        if (btnTilt) btnTilt.click();
                    }
                }
            }
        });
    }

    updateHintOverlay() {
        // Clear previous hint glows
        document.querySelectorAll('.hint-glow').forEach(el => {
            el.classList.remove('hint-glow');
        });

        // Only show hints on simulation tab of active module
        if (this.activeTab !== 'simulation' || !this.activeModuleNum) return;

        let targetEl = null;

        if (this.activeModuleNum === 2) {
            const focusDiff = Math.abs(microscope.focusValue - microscope.targetFocus);
            const gridCentered = Math.abs(microscope.slidePos.x - 1000) < 50 && Math.abs(microscope.slidePos.y - 1000) < 50;

            if (focusDiff >= 3) {
                // Focus needs setting
                targetEl = document.getElementById('slider-focus');
            } else if (!gridCentered) {
                // Need to move Neubauer grid to center
                targetEl = document.querySelector('.grid-nav-keys');
            } else if (microscope.tallyCount < 5) {
                // Need to count cells on the grid
                targetEl = document.getElementById('microscope-canvas');
            } else if (!notebook.records.m2.verified) {
                // Need to submit calculation in notebook
                const notebookPanel = document.getElementById('lab-notebook-panel');
                if (notebookPanel && !notebookPanel.classList.contains('open')) {
                    targetEl = document.getElementById('btn-toggle-notebook');
                } else {
                    targetEl = document.querySelector('.btn-submit-log[data-module="2"]');
                }
            }
        } 
        else if (this.activeModuleNum === 3) {
            const tubes = dilution.tubes;
            
            // Step 1: Dilution serial transfer loop
            if (tubes[1].conc === 0 || tubes[2].conc === 0 || tubes[3].conc === 0 || tubes[4].conc === 0 || tubes[5].conc === 0) {
                let targetTubeIdx = 0;
                for (let i = 1; i <= 5; i++) {
                    if (tubes[i].conc === 0) {
                        targetTubeIdx = i;
                        break;
                    }
                }
                const sourceTubeIdx = targetTubeIdx - 1;

                if (dilution.pipette.fluidVol === 0) {
                    if (dilution.selectedTubeIdx !== sourceTubeIdx) {
                        targetEl = document.getElementById(`dilution-tube-${sourceTubeIdx}`);
                    } else {
                        targetEl = document.getElementById('btn-pipette-aspirate');
                    }
                } else {
                    if (dilution.selectedTubeIdx !== targetTubeIdx) {
                        targetEl = document.getElementById(`dilution-tube-${targetTubeIdx}`);
                    } else {
                        targetEl = document.getElementById('btn-pipette-dispense');
                    }
                }
            } 
            // Step 2: Growth Medium Select
            else if (dilution.plate.medium === "") {
                targetEl = document.getElementById('media-select');
            } 
            // Step 2.5: Acidification for PDA selective suppression of bacteria
            else if (dilution.plate.medium === "PDA" && !dilution.plate.acidified) {
                targetEl = document.getElementById('chk-tartaric-acid');
            }
            // Step 3: Inoculate Petri dish
            else if (dilution.plate.volumePlated === 0) {
                if (dilution.pipette.fluidVol === 0) {
                    if (dilution.selectedTubeIdx !== 3) {
                        targetEl = document.getElementById('dilution-tube-3');
                    } else {
                        targetEl = document.getElementById('btn-pipette-aspirate');
                    }
                } else {
                    targetEl = document.getElementById('petri-dish-a');
                }
            } 
            // Step 4: Run Incubation cycle
            else if (!dilution.plate.isIncubated) {
                targetEl = document.getElementById('btn-run-incubation');
            } 
            // Step 5: Tally colony count
            else if (dilution.plate.growthSuccess && dilution.plate.userColonyCount < dilution.plate.coloniesCount && dilution.plate.coloniesCount <= 350) {
                targetEl = document.getElementById('petri-dish-a');
            } 
            // Step 6: Notebook submission
            else if (!notebook.records.m3.verified) {
                const notebookPanel = document.getElementById('lab-notebook-panel');
                if (notebookPanel && !notebookPanel.classList.contains('open')) {
                    targetEl = document.getElementById('btn-toggle-notebook');
                } else {
                    targetEl = document.querySelector('.btn-submit-log[data-module="3"]');
                }
            }
        } 
        else if (this.activeModuleNum === 4) {
            if (pathogen.activeSub === 'staph') {
                if (pathogen.staphHours === 0) {
                    targetEl = document.getElementById('btn-incubate-staph');
                } else if (!pathogen.staphTilted) {
                    targetEl = document.getElementById('btn-tilt-tube');
                } else if (!notebook.records.m4.verified) {
                    const notebookPanel = document.getElementById('lab-notebook-panel');
                    if (notebookPanel && !notebookPanel.classList.contains('open')) {
                        targetEl = document.getElementById('btn-toggle-notebook');
                    } else {
                        targetEl = document.querySelector('.btn-submit-log[data-module="4"]');
                    }
                }
            } 
            else if (pathogen.activeSub === 'salm') {
                if (!pathogen.tsiInoculated) {
                    targetEl = document.getElementById('btn-inoculate-tsi');
                } else if (!pathogen.tsiIncubated) {
                    targetEl = document.getElementById('btn-incubate-tsi');
                } else if (!notebook.records.m4.verified) {
                    const notebookPanel = document.getElementById('lab-notebook-panel');
                    if (notebookPanel && !notebookPanel.classList.contains('open')) {
                        targetEl = document.getElementById('btn-toggle-notebook');
                    } else {
                        targetEl = document.querySelector('.btn-submit-log[data-module="4"]');
                    }
                }
            } 
            else if (pathogen.activeSub === 'coliform') {
                if (pathogen.coliformStage === 1) {
                    if (pathogen.coliformVrbaCount === 0) {
                        targetEl = document.getElementById('btn-coliform-action');
                    } else {
                        targetEl = document.getElementById('btn-coliform-next');
                    }
                } else if (pathogen.coliformStage === 2) {
                    if (!pathogen.coliformBglbGas) {
                        targetEl = document.getElementById('btn-coliform-action');
                    } else {
                        targetEl = document.getElementById('btn-coliform-next');
                    }
                } else if (pathogen.coliformStage === 3) {
                    if (!pathogen.coliformEmbSheen) {
                        targetEl = document.getElementById('btn-coliform-action');
                    } else if (!notebook.records.m4.verified) {
                        const notebookPanel = document.getElementById('lab-notebook-panel');
                        if (notebookPanel && !notebookPanel.classList.contains('open')) {
                            targetEl = document.getElementById('btn-toggle-notebook');
                        } else {
                            targetEl = document.querySelector('.btn-submit-log[data-module="4"]');
                        }
                    }
                }
            }
        }
        else if (this.activeModuleNum === 1) {
            const j = notebook.records.m1.juice;
            const f = notebook.records.m1.formula;
            const fl = notebook.records.m1.flour;

            if (!j || j.decision === '') {
                if (labelInspector.currentProduct !== 'juice') {
                    targetEl = document.querySelector('#viewport-label .product-tab-btn:nth-child(1)');
                } else {
                    const statusVal = document.getElementById('label-audit-status').value;
                    if (!statusVal) {
                        targetEl = document.getElementById('label-audit-status');
                    } else {
                        targetEl = document.getElementById('btn-submit-label-audit');
                    }
                }
            } else if (!f || f.decision === '') {
                if (labelInspector.currentProduct !== 'formula') {
                    targetEl = document.querySelector('#viewport-label .product-tab-btn:nth-child(2)');
                } else {
                    const statusVal = document.getElementById('label-audit-status').value;
                    if (!statusVal) {
                        targetEl = document.getElementById('label-audit-status');
                    } else {
                        targetEl = document.getElementById('btn-submit-label-audit');
                    }
                }
            } else if (!fl || fl.decision === '') {
                if (labelInspector.currentProduct !== 'flour') {
                    targetEl = document.querySelector('#viewport-label .product-tab-btn:nth-child(3)');
                } else {
                    const statusVal = document.getElementById('label-audit-status').value;
                    if (!statusVal) {
                        targetEl = document.getElementById('label-audit-status');
                    } else {
                        targetEl = document.getElementById('btn-submit-label-audit');
                    }
                }
            } else if (!notebook.records.m1.verified) {
                const notebookPanel = document.getElementById('lab-notebook-panel');
                if (notebookPanel && !notebookPanel.classList.contains('open')) {
                    targetEl = document.getElementById('btn-toggle-notebook');
                } else {
                    targetEl = document.querySelector('.btn-submit-log[data-module="1"]');
                }
            }
        }
        else if (this.activeModuleNum === 5) {
            if (!aet.selectedNeutralizer) {
                targetEl = document.getElementById('aet-neutralizer');
            } else if (!aet.assayRun) {
                targetEl = document.getElementById('btn-aet-run');
            } else if (!notebook.records.m5.verified) {
                const notebookPanel = document.getElementById('lab-notebook-panel');
                if (notebookPanel && !notebookPanel.classList.contains('open')) {
                    targetEl = document.getElementById('btn-toggle-notebook');
                } else {
                    targetEl = document.querySelector('.btn-submit-log[data-module="5"]');
                }
            }
        }
        else if (this.activeModuleNum === 6) {
            if (!sterility.directState.ftmInoculated) {
                targetEl = document.getElementById('btn-sterility-inoc-ftm');
            } else if (!sterility.directState.scdmInoculated) {
                targetEl = document.getElementById('btn-sterility-inoc-scdm');
            } else if (!sterility.directState.incubated) {
                targetEl = document.getElementById('btn-sterility-incubate-direct');
            } else if (!notebook.records.m6.verified) {
                const notebookPanel = document.getElementById('lab-notebook-panel');
                if (notebookPanel && !notebookPanel.classList.contains('open')) {
                    targetEl = document.getElementById('btn-toggle-notebook');
                } else {
                    targetEl = document.querySelector('.btn-submit-log[data-module="6"]');
                }
            }
        }
        else if (this.activeModuleNum === 7) {
            if (!sterility.swabState.wiped) {
                targetEl = document.getElementById('btn-swab-wipe');
            } else if (!sterility.swabState.plated) {
                targetEl = document.getElementById('btn-swab-plate');
            } else if (!sterility.swabState.incubated) {
                targetEl = document.getElementById('btn-swab-incubate');
            } else if (!notebook.records.m7.verified) {
                const notebookPanel = document.getElementById('lab-notebook-panel');
                if (notebookPanel && !notebookPanel.classList.contains('open')) {
                    targetEl = document.getElementById('btn-toggle-notebook');
                } else {
                    targetEl = document.querySelector('.btn-submit-log[data-module="7"]');
                }
            }
        }

        if (targetEl) {
            targetEl.classList.add('hint-glow');
        }
    }

    showDashboard() {
        document.getElementById('screen-workspace').classList.remove('active');
        document.getElementById('screen-dashboard').classList.add('active');
        
        // Remove focus states
        if (this.activeModuleNum === 2) {
            microscope.unbind();
        }
        this.activeModuleNum = null;
        
        // Check achievements
        notebook.checkCertificateStatus();
    }

    loadModule(moduleNum) {
        audio.init();
        this.activeModuleNum = moduleNum;
        
        // Swapping layouts
        document.getElementById('screen-dashboard').classList.remove('active');
        document.getElementById('screen-workspace').classList.add('active');
        
        // Read active text theory
        const theoryObj = theoryData[moduleNum];
        document.getElementById('active-module-title').textContent = theoryObj.title;
        document.getElementById('active-module-badge').textContent = theoryObj.badge;
        document.getElementById('theory-content').innerHTML = theoryObj.content;
        
        const interpContent = document.getElementById('interpretation-content');
        if (interpContent && theoryObj.interpretation) {
            interpContent.innerHTML = theoryObj.interpretation;
            try {
                this.initInterpretationSliders();
            } catch (sliderErr) {
                console.error("Slider initialization error:", sliderErr);
            }
        }


        // Reset workspace tabs
        this.switchTab('theory');

        // Setup the specific simulation screen viewport elements
        this.hideAllViewports();
        
        if (moduleNum === 1) {
            document.getElementById('viewport-label').classList.remove('hidden');
            labelInspector.init();
        } 
        else if (moduleNum === 2) {
            document.getElementById('viewport-microscope').classList.remove('hidden');
            microscope.init();
        } 
        else if (moduleNum === 3) {
            document.getElementById('viewport-dilution').classList.remove('hidden');
            dilution.init();
        } 
        else if (moduleNum === 4) {
            document.getElementById('viewport-pathogens').classList.remove('hidden');
            pathogen.init();
        }
        else if (moduleNum === 5) {
            document.getElementById('viewport-aet').classList.remove('hidden');
            aet.init();
        }
        else if (moduleNum === 6) {
            document.getElementById('viewport-sterility').classList.remove('hidden');
            const selector = document.getElementById('sterility-mode-selector');
            if (selector) selector.classList.add('hidden');
            sterility.initDirect();
        }
        else if (moduleNum === 7) {
            document.getElementById('viewport-sterility').classList.remove('hidden');
            const selector = document.getElementById('sterility-mode-selector');
            if (selector) selector.classList.add('hidden');
            sterility.initSwab();
        }

        // Open specific tab in notebook drawer
        notebook.updateLogView(moduleNum);
        
        // Build pre-simulation quiz
        this.buildPreQuiz(moduleNum);

        // Configure simulation tab lock based on prequiz status
        const simTabBtn = document.getElementById('tab-btn-simulation');
        if (simTabBtn) {
            if (this.prequizPassed[moduleNum]) {
                simTabBtn.classList.remove('locked');
                simTabBtn.innerHTML = `<i class="fa-solid fa-flask"></i> 3. Simulation`;
                simTabBtn.removeAttribute('title');
            } else {
                simTabBtn.classList.add('locked');
                simTabBtn.innerHTML = `<i class="fa-solid fa-lock"></i> 3. Simulation (Locked)`;
                simTabBtn.setAttribute('title', 'Complete Pre-Lab Quiz with 100% to unlock');
            }
        }
        
        // Build assessment quiz
        this.buildAssessmentQuiz(moduleNum);
    }

    initInterpretationSliders() {
        const container = document.querySelector('.interpretation-slider-container');
        if (!container) return;

        const track = container.querySelector('.interpretation-slider-track');
        const slides = container.querySelectorAll('.interpretation-slide');
        const prevBtn = container.querySelector('.prev-arrow');
        const nextBtn = container.querySelector('.next-arrow');
        const indicatorsContainer = container.parentElement.querySelector('.slider-indicators');

        if (!track || slides.length === 0) return;

        // Clear and rebuild indicators
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('span');
                dot.className = `slider-dot${idx === 0 ? ' active' : ''}`;
                dot.onclick = () => {
                    track.scrollTo({
                        left: track.clientWidth * idx,
                        behavior: 'smooth'
                    });
                };
                indicatorsContainer.appendChild(dot);
            });
        }

        // Arrow clicks
        if (prevBtn) {
            prevBtn.onclick = () => {
                track.scrollBy({
                    left: -track.clientWidth,
                    behavior: 'smooth'
                });
            };
        }

        if (nextBtn) {
            nextBtn.onclick = () => {
                track.scrollBy({
                    left: track.clientWidth,
                    behavior: 'smooth'
                });
            };
        }

        // Track scroll event to update indicators and arrows visibility
        track.onscroll = () => {
            const scrollPos = track.scrollLeft;
            const cardWidth = track.clientWidth || 1;
            const activeIndex = Math.round(scrollPos / cardWidth);

            // Update indicators
            if (indicatorsContainer) {
                const dots = indicatorsContainer.querySelectorAll('.slider-dot');
                dots.forEach((dot, idx) => {
                    if (idx === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }

            // Disable/enable arrows based on scroll position
            if (prevBtn) {
                prevBtn.style.opacity = activeIndex === 0 ? '0.3' : '1';
                prevBtn.style.pointerEvents = activeIndex === 0 ? 'none' : 'auto';
            }
            if (nextBtn) {
                const isEnd = activeIndex === slides.length - 1;
                nextBtn.style.opacity = isEnd ? '0.3' : '1';
                nextBtn.style.pointerEvents = isEnd ? 'none' : 'auto';
            }
        };

        // Initial trigger for arrow state
        setTimeout(() => {
            track.dispatchEvent(new Event('scroll'));
        }, 100);
    }


    hideAllViewports() {
        document.getElementById('viewport-microscope').classList.add('hidden');
        document.getElementById('viewport-dilution').classList.add('hidden');
        document.getElementById('viewport-pathogens').classList.add('hidden');
        document.getElementById('viewport-qa').classList.add('hidden');
        document.getElementById('viewport-label').classList.add('hidden');
        document.getElementById('viewport-aet').classList.add('hidden');
        document.getElementById('viewport-sterility').classList.add('hidden');
    }

    switchTab(tabName) {
        // Enforce lock: allow simulation only when student has passed prequiz with 100%
        if (tabName === 'simulation' && !this.prequizPassed[this.activeModuleNum]) {
            audio.playError();
            showNotification("Security Lock: You must secure a perfect 100% score on the Pre-Lab Quiz to unlock the practical simulation.", "warning");
            return;
        }

        this.activeTab = tabName;
        
        // Toggle tab highlights
        document.querySelectorAll('.workspace-tabs .tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Toggle content panes
        document.querySelectorAll('.workspace-body .tab-content').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('active');

        // Reset scroll position for interpretation slider if active
        if (tabName === 'interpretation') {
            const track = document.querySelector('.interpretation-slider-track');
            if (track) {
                track.scrollLeft = 0;
                track.dispatchEvent(new Event('scroll'));
            }
        }


        // Microscope specific tracking hum toggles
        if (this.activeModuleNum === 2) {
            if (tabName === 'simulation') {
                // resume hums if needed
            } else {
                audio.stopMicroscopeHum();
            }
        }
    }

    getActiveModule() {
        if (this.activeModuleNum === 1) return labelInspector;
        if (this.activeModuleNum === 2) return microscope;
        if (this.activeModuleNum === 3) return dilution;
        if (this.activeModuleNum === 4) return pathogen;
        if (this.activeModuleNum === 5) return aet;
        if (this.activeModuleNum === 6) return sterility;
        if (this.activeModuleNum === 7) return sterility;
        return null;
    }

    buildAssessmentQuiz(moduleNum) {
        const form = document.getElementById('assessment-quiz-form');
        const qList = this.quizzes[moduleNum];
        
        if (!form || !qList) return;
        
        form.innerHTML = qList.map((qObj, qIdx) => `
            <div class="quiz-question" data-correct="${qObj.correct}">
                <h4>${qIdx + 1}. ${qObj.q}</h4>
                <div class="quiz-options">
                    ${qObj.options.map((opt, oIdx) => `
                        <label class="option-lbl">
                            <input type="radio" name="m${moduleNum}-q${qIdx}" value="${oIdx}">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Reset quiz feedback status
        const feedback = document.getElementById('quiz-feedback-msg');
        if (feedback) {
            feedback.textContent = "";
            feedback.className = "quiz-feedback";
        }
        
        const btnSubmit = document.getElementById('btn-submit-quiz');
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Submit Answers";
        }
    }

    gradeQuiz() {
        const moduleNum = this.activeModuleNum;
        const qList = this.quizzes[moduleNum];
        const form = document.getElementById('assessment-quiz-form');
        
        if (!qList || !form) return;

        let numCorrect = 0;
        let unanswered = false;

        const questions = form.querySelectorAll('.quiz-question');
        questions.forEach((qDiv, qIdx) => {
            const correctIdx = parseInt(qDiv.getAttribute('data-correct'));
            const selectedOpt = form.querySelector(`input[name="m${moduleNum}-q${qIdx}"]:checked`);
            
            // Clear previous grading indicators
            qDiv.style.borderColor = "var(--color-border)";
            
            if (!selectedOpt) {
                unanswered = true;
                qDiv.style.borderColor = "var(--color-yellow-glow)";
            } else {
                const val = parseInt(selectedOpt.value);
                if (val === correctIdx) {
                    numCorrect++;
                    qDiv.style.borderColor = "var(--color-green-glow)";
                } else {
                    qDiv.style.borderColor = "var(--color-red-glow)";
                }
            }
        });

        if (unanswered) {
            audio.playError();
            showNotification("Please answer all questions before submitting.", "warning");
            return;
        }

        const scoreFraction = numCorrect / qList.length;
        const scorePercentage = Math.round(scoreFraction * 100);
        
        // Set feedback
        const feedback = document.getElementById('quiz-feedback-msg');
        if (feedback) {
            feedback.textContent = `Grade: ${scorePercentage}% (${numCorrect} of ${qList.length} correct)`;
            if (scorePercentage >= 66) {
                feedback.className = "quiz-feedback text-green";
                audio.playSuccess();
            } else {
                feedback.className = "quiz-feedback text-red";
                audio.playError();
            }
        }

        // Lock form submit button
        const btnSubmit = document.getElementById('btn-submit-quiz');
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.textContent = "Quiz Submitted";
        }

        // Update scores in ledger
        notebook.submitQuizScore(moduleNum, scoreFraction);
    }

    buildPreQuiz(moduleNum) {
        const form = document.getElementById('prequiz-form');
        const qList = this.prequizzes[moduleNum];
        
        if (!form || !qList) return;
        
        form.innerHTML = qList.map((qObj, qIdx) => `
            <div class="quiz-question" data-correct="${qObj.correct}">
                <h4>${qIdx + 1}. ${qObj.q}</h4>
                <div class="quiz-options">
                    ${qObj.options.map((opt, oIdx) => `
                        <label class="option-lbl">
                            <input type="radio" name="pre-m${moduleNum}-q${qIdx}" value="${oIdx}">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Reset prequiz feedback status
        const feedback = document.getElementById('prequiz-feedback');
        const statusBadge = document.getElementById('prequiz-unlock-status');
        if (feedback) {
            feedback.textContent = "";
            feedback.className = "quiz-feedback hidden";
        }
        if (statusBadge) {
            if (this.prequizPassed[moduleNum]) {
                statusBadge.textContent = "Unlocked - 10/10 Correct";
                statusBadge.className = "badge badge-success";
            } else {
                statusBadge.textContent = "Locked - 0/10 Correct";
                statusBadge.className = "badge badge-error";
            }
        }
        
        const btnSubmit = document.getElementById('btn-submit-prequiz');
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Submit Quiz";
        }
    }

    gradePreQuiz() {
        const moduleNum = this.activeModuleNum;
        const qList = this.prequizzes[moduleNum];
        const form = document.getElementById('prequiz-form');
        
        if (!qList || !form) return;

        let numCorrect = 0;
        let unanswered = false;

        const questions = form.querySelectorAll('.quiz-question');
        questions.forEach((qDiv, qIdx) => {
            const correctIdx = parseInt(qDiv.getAttribute('data-correct'));
            const selectedOpt = form.querySelector(`input[name="pre-m${moduleNum}-q${qIdx}"]:checked`);
            
            // Clear previous grading indicators
            qDiv.style.borderColor = "var(--color-border)";
            
            if (!selectedOpt) {
                unanswered = true;
                qDiv.style.borderColor = "var(--color-yellow-glow)";
            } else {
                const val = parseInt(selectedOpt.value);
                if (val === correctIdx) {
                    numCorrect++;
                    qDiv.style.borderColor = "var(--color-green-glow)";
                } else {
                    qDiv.style.borderColor = "var(--color-red-glow)";
                }
            }
        });

        if (unanswered) {
            audio.playError();
            showNotification("Please answer all 10 questions before submitting.", "warning");
            return;
        }

        const scorePercentage = Math.round((numCorrect / qList.length) * 100);
        
        // Set feedback
        const feedback = document.getElementById('prequiz-feedback');
        const statusBadge = document.getElementById('prequiz-unlock-status');
        
        if (feedback) {
            feedback.classList.remove('hidden');
            feedback.textContent = `Grade: ${scorePercentage}% (${numCorrect} of ${qList.length} correct)`;
            
            if (numCorrect === qList.length) {
                feedback.className = "quiz-feedback text-green";
                audio.playSuccess();
                this.prequizPassed[moduleNum] = true;
                
                // Unlock tab in DOM immediately
                const simTabBtn = document.getElementById('tab-btn-simulation');
                if (simTabBtn) {
                    simTabBtn.classList.remove('locked');
                    simTabBtn.innerHTML = `<i class="fa-solid fa-flask"></i> 3. Simulation`;
                    simTabBtn.removeAttribute('title');
                }
                
                if (statusBadge) {
                    statusBadge.textContent = "Unlocked - 10/10 Correct";
                    statusBadge.className = "badge badge-success";
                }
                
                showNotification("Congratulations! 100% Score achieved. Practical Simulation is now unlocked!", "success");
            } else {
                feedback.className = "quiz-feedback text-red";
                audio.playError();
                if (statusBadge) {
                    statusBadge.textContent = `Locked - ${numCorrect}/10 Correct`;
                    statusBadge.className = "badge badge-error";
                }
                showNotification(`Score: ${numCorrect}/10. You must secure 100% (10/10) to unlock the simulation. Please try again!`, "error");
            }
        }
        this.saveSession();
    }

    saveSession() {
        const sessionState = {
            prequizPassed: this.prequizPassed,
            records: notebook.records,
            quizScores: notebook.quizScores,
            quizTaken: notebook.quizTaken,
            certificateNo: notebook.certificateNo,
            studentName: document.getElementById('cert-name-input-field') ? document.getElementById('cert-name-input-field').value : 'Trial',
            theme: document.body.classList.contains('light-theme') ? 'light' : 'dark'
        };
        localStorage.setItem('fssai_lab_session', JSON.stringify(sessionState));
    }

    loadSession() {
        try {
            const dataStr = localStorage.getItem('fssai_lab_session');
            if (!dataStr) return;
            const state = JSON.parse(dataStr);
            if (!state) return;
            
            // Restore prequizPassed with default fallbacks
            if (state.prequizPassed) {
                this.prequizPassed = Object.assign({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false }, state.prequizPassed);
            }
            
            // Restore notebook records by merging key-by-key
            if (state.records) {
                for (let i = 1; i <= 7; i++) {
                    const key = `m${i}`;
                    if (state.records[key]) {
                        notebook.records[key] = Object.assign({}, notebook.records[key], state.records[key]);
                    }
                }
            }
            if (state.quizScores) {
                notebook.quizScores = Object.assign({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 }, state.quizScores);
            }
            if (state.quizTaken) {
                notebook.quizTaken = Object.assign({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false }, state.quizTaken);
            }
            if (state.certificateNo) notebook.certificateNo = state.certificateNo;
            
            // Restore student name
            if (state.studentName) {
                const nameInput = document.getElementById('cert-name-input-field');
                if (nameInput) nameInput.value = state.studentName;
                const nameDisplay = document.getElementById('cert-student-name');
                if (nameDisplay) nameDisplay.textContent = state.studentName;
            }
            
            // Restore theme
            if (state.theme === 'light') {
                document.body.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
            }
            
            // Update UI scores
            notebook.recalculateScore();
            notebook.checkCertificateStatus();
            
            // Restore DOM inputs
            notebook.restoreNotebookDOM();
            
            showNotification("Session progress restored successfully.", "success");
        } catch (e) {
            console.error("Failed to load session progress:", e);
        }
    }
}

// Instantiate and run
const app = new AppController();
window.app = app; // Expose globally for module communication
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    
    // Automatically run the test if ?test=true
    if (window.location.search.includes('test=true')) {
        console.log("TEST RUNNING...");
        try {
            // 1. Select Module 1
            app.loadModule(1);
            console.log("Module 1 loaded.");
            
            // 2. Unlock simulation
            app.prequizPassed[1] = true;
            app.switchTab('simulation');
            
            const viewport = document.getElementById('viewport-label');
            const previewBox = document.getElementById('rendered-label');
            console.log("Viewport label hidden class present:", viewport.classList.contains('hidden'));
            console.log("Viewport label computed display:", window.getComputedStyle(viewport).display);
            console.log("Viewport label computed opacity:", window.getComputedStyle(viewport).opacity);
            console.log("Viewport label computed visibility:", window.getComputedStyle(viewport).visibility);
            console.log("Viewport label offsetWidth/offsetHeight:", viewport.offsetWidth, "x", viewport.offsetHeight);
            console.log("Preview box innerHTML length:", previewBox ? previewBox.innerHTML.trim().length : "null");
            console.log("Preview box offsetWidth/offsetHeight:", previewBox ? previewBox.offsetWidth : 0, "x", previewBox ? previewBox.offsetHeight : 0);
            
            // 3. Switch to interpretation tab
            app.switchTab('interpretation');
            const interpPane = document.getElementById('tab-interpretation');
            const interpContent = document.getElementById('interpretation-content');
            console.log("Interpretation tab active class present:", interpPane.classList.contains('active'));
            console.log("Interpretation tab computed display:", window.getComputedStyle(interpPane).display);
            console.log("Interpretation tab computed opacity:", window.getComputedStyle(interpPane).opacity);
            console.log("Interpretation tab computed visibility:", window.getComputedStyle(interpPane).visibility);
            console.log("Interpretation tab offsetWidth/offsetHeight:", interpPane.offsetWidth, "x", interpPane.offsetHeight);
            console.log("Interpretation content length:", interpContent ? interpContent.innerHTML.trim().length : "null");
            console.log("Interpretation content computed height:", window.getComputedStyle(interpContent).height);
            
            // 4. Switch to assessment tab
            app.switchTab('assessment');
            const assessPane = document.getElementById('tab-assessment');
            const assessForm = document.getElementById('assessment-quiz-form');
            console.log("Assessment tab active class present:", assessPane.classList.contains('active'));
            console.log("Assessment tab computed display:", window.getComputedStyle(assessPane).display);
            console.log("Assessment tab computed opacity:", window.getComputedStyle(assessPane).opacity);
            console.log("Assessment tab computed visibility:", window.getComputedStyle(assessPane).visibility);
            console.log("Assessment tab offsetWidth/offsetHeight:", assessPane.offsetWidth, "x", assessPane.offsetHeight);
            console.log("Assessment form children count:", assessForm ? assessForm.children.length : "null");
            
            console.log("TEST COMPLETE.");
        } catch (err) {
            console.error("TEST ERROR:", err);
        }
    }
});
