with open('js/app.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "selectmodule" in line.lower():
            print(f"{i}: {line.strip()[:100]}")
