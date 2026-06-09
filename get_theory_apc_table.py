with open('js/theory.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "aerobic" in line.lower() or "apc" in line.lower() or "plating" in line.lower():
            print(f"{i}: {line.strip()[:100]}")
