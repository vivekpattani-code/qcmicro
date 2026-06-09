import os

files_to_check = [
    "index.html",
    "js/theory.js",
    "js/app.js",
    "js/notebook.js",
    "js/utils.js",
    "js/modules/microscope.js",
    "js/modules/dilution.js",
    "js/modules/pathogen.js",
    "js/modules/qa.js",
    "js/modules/label.js",
    "js/modules/aet.js",
    "js/modules/sterility.js"
]

project_dir = r"d:\meterial\fssai"

for rel_path in files_to_check:
    filepath = os.path.join(project_dir, rel_path)
    if not os.path.exists(filepath):
        continue
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        lines = content.split('\n')
        for idx, line in enumerate(lines, 1):
            if "?m" in line or "Â" in line:
                print(f"GLITCH in {rel_path}:{idx}: {repr(line)}")
    except Exception as e:
        print(f"Error reading {rel_path}: {e}")
