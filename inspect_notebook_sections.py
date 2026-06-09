with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines, 1):
    if "class=\"notebook-section\"" in line or "class='notebook-section'" in line or "notebook-section active" in line:
        print(f"--- Section {line.strip()[:100]} (Line {i}) ---")
        for idx in range(i-1, min(len(lines), i+8)):
            print(f"{idx+1}: {lines[idx].strip()}")
