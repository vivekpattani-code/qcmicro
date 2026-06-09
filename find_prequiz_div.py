with open('index.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "prequiz" in line.lower() and ("div" in line or "section" in line or "form" in line):
            print(f"{i}: {line.strip()[:100]}")
