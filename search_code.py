import os
import re

terms = ["Equipment & Safety Quality Assurance", "Equipment & Safety", "Module 4", "Module 5", "Food Label Regulatory Analysis"]
project_dir = r"d:\meterial\fssai"

for root, dirs, files in os.walk(project_dir):
    if ".git" in root or "__pycache__" in root or ".system_generated" in root or ".gemini" in root:
        continue
    for file in files:
        if not (file.endswith(".html") or file.endswith(".js") or file.endswith(".json")):
            continue
        filepath = os.path.join(root, file)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                for line_num, line in enumerate(f, 1):
                    for term in terms:
                        if term.lower() in line.lower():
                            # Print matching context
                            print(f"{os.path.relpath(filepath, project_dir)}:{line_num}: {line.strip()[:120]}")
        except Exception as e:
            pass
