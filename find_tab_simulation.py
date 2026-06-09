with open('index.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'id="tab-simulation"' in line:
            print(f"Line {i}: {line.strip()[:120]}")
