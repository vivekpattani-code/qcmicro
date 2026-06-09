with open(r"d:\meterial\fssai\js\app.js", "rb") as f:
    content = f.read()

# Let's find the line with "options: [\"1 cm"
idx = content.find(b'options: ["1 cm')
if idx != -1:
    print("Found context raw bytes:", content[idx:idx+80].hex())
    print("Found context string:", content[idx:idx+80].decode('utf-8', errors='replace'))
else:
    print("Not found")
