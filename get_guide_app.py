with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1280, 1555):
    if i < len(lines):
        line = lines[i]
        line_num = i + 1
        # Print if it contains references to steps, next, prev, or modules
        if any(w in line.lower() for w in ["step", "prev", "next", "module"]):
            print(f"{line_num}: {line.strip()[:100]}")
