with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines, 1):
    if "switchmodule" in line.lower() or "activemodule" in line.lower():
        print(f"Line {i}: {line.strip()[:100]}")
