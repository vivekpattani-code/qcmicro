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
        print(f"File not found: {rel_path}")
        continue
    try:
        with open(filepath, "rb") as f:
            raw_bytes = f.read()
        
        # Decode as utf-8, replacing errors with \ufffd
        text = raw_bytes.decode('utf-8', errors='replace')
        lines = text.split('\n')
        for idx, line in enumerate(lines, 1):
            # Check for actual \ufffd (replacement character)
            if '\ufffd' in line:
                safe_line = line.replace('\ufffd', '[REPLACEMENT_CHAR]').strip()
                print(f"{rel_path}:{idx}: {safe_line}")
    except Exception as e:
        print(f"Error reading {rel_path}: {e}")
