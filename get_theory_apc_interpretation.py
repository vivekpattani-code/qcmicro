with open('js/theory.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "milk" in line.lower() or "juice" in line.lower() or "ice cream" in line.lower():
            if "m =" in line.lower() or "m=" in line.lower() or "cfu" in line.lower() or "limit" in line.lower() or "range" in line.lower():
                print(f"{i}: {line.strip()[:120]}")
