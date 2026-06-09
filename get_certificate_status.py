with open('js/notebook.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(469, 520):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end='')
