with open('js/notebook.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines, 1):
    if "ctx.fillText" in line or "downloadCertificate" in line or "draw" in line:
        if "{" in line or "(" in line or "=" in line:
            print(f"Line {i}: {line.strip()[:100]}")
