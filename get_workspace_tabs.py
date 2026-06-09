with open('index.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "workspace-tab" in line.lower() or "tab-btn" in line.lower():
            print(f"{i}: {line.strip()[:100]}")
