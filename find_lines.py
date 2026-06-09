with open(r"d:\meterial\fssai\js\app.js", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "bindGlobalEvents" in line:
            print(f"Line {i}: {line.strip()}")
