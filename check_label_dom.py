with open('js/modules/label.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "document." in line or "selector" in line or "getelementby" in line.lower() or "queryselector" in line.lower():
            print(f"Line {i}: {line.strip()}")
