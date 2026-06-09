with open('index.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "cert" in line.lower() or "signature" in line.lower():
            print(f"{i}: {line.strip()[:100]}")
