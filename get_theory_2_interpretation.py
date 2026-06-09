with open('js/theory.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find "interpretation:" inside the 2: { ... } block
start_idx = content.find("2: {")
if start_idx != -1:
    interp_idx = content.find("interpretation:", start_idx)
    if interp_idx != -1:
        lines = content[interp_idx:interp_idx+3000].split('\n')
        for idx, line in enumerate(lines, 1):
            safe_line = line.encode('ascii', errors='replace').decode('ascii')
            print(f"Line {idx}: {safe_line[:120]}")
    else:
        print("Could not find interpretation block for Module 2")
else:
    print("Could not find Module 2 definition")
