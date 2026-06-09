with open('js/app.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "switchtab" in line.lower() or "tab-btn" in line.lower() or "tab-content" in line.lower():
            print(f"{i}: {line.strip()[:100]}")
