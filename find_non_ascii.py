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
        with open(filepath, "rb") as f:
            raw_bytes = f.read()
        
        # Decode as utf-8
        text = raw_bytes.decode('utf-8')
        for idx, char in enumerate(text):
            if ord(char) > 127:
                # Find line number
                line_num = text.count('\n', 0, idx) + 1
                # Find line text
                start_line = text.rfind('\n', 0, idx) + 1
                end_line = text.find('\n', idx)
                line_text = text[start_line:end_line].strip()
                # Print code point, character, and line context (safe print using repr)
                print(f"{rel_path}:{line_num}: Char {repr(char)} (U+{ord(char):04X}) in line: {line_text[:120]}")
    except Exception as e:
        print(f"Error reading {rel_path}: {e}")
