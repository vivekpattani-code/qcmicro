with open('js/app.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "prequizpassed" in line.lower():
            print(f"Line {i}: {line.strip()}")
