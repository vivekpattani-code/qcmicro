import os

project_dir = r"d:\meterial\fssai"
for root, dirs, files in os.walk(project_dir):
    if ".git" in root or "__pycache__" in root or ".system_generated" in root or ".gemini" in root:
        continue
    for file in files:
        if not (file.endswith(".html") or file.endswith(".js")):
            continue
        filepath = os.path.join(root, file)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                # Check if file has both Module 4/Equipment and Module 5/Label in close proximity or mismatched
                # Or search for specific strings like "Module 4: Equipment & Safety Quality Assurance" or "Module 4: Equipment"
                lines = content.split('\n')
                for line_idx, line in enumerate(lines, 1):
                    # Check if Module 4 is mentioned in Module 5 section or vice-versa
                    if "Module 4" in line and ("Label" in line or "juice" in line or "formula" in line):
                        print(f"Mismatched line in {file}:{line_idx}: {line}")
                    if "Module 5" in line and ("Equipment" in line or "Safety" in line or "Autoclave" in line or "HEPA" in line):
                        print(f"Mismatched line in {file}:{line_idx}: {line}")
        except Exception as e:
            pass
