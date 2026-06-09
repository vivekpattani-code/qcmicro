with open('js/theory.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find "2: {" and print the lines around it
start_idx = content.find("2: {")
if start_idx != -1:
    lines = content[start_idx:start_idx+3000].split('\n')
    for idx, line in enumerate(lines, 1):
        # safe print using ascii representation
        safe_line = line.encode('ascii', errors='replace').decode('ascii')
        print(f"Line {idx}: {safe_line[:120]}")
else:
    print("Could not find Module 2 definition")
