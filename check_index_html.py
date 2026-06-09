with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(790, 1220):
    if i < len(lines):
        line = lines[i]
        # print line index and content if it matches any keyword
        line_num = i + 1
        if any(w in line.lower() for w in ["module", "title", "header", "equipment", "safety", "label", "analysis"]):
            print(f"{line_num}: {line.strip()[:100]}")
