with open('js/notebook.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines, 1):
    if "verify" in line.lower() or "submit" in line.lower() or "module" in line.lower():
        if "{" in line or "=" in line or ":" in line:
            print(f"Line {i}: {line.strip()[:100]}")
