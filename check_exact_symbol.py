with open(r"d:\meterial\fssai\js\app.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

line = lines[209] # line 210 (0-indexed 209)
print("Line 210 representation:", repr(line))
