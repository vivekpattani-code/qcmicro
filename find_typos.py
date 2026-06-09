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
                if "pathogentic" in content:
                    print(f"Typo found in {file}")
        except Exception as e:
            pass
