with open('js/theory.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Let's search for keys: 1:, 2:, 3:, 4:, 5:, 6:, 7:
# and check if "interpretation:" is defined for each
keys = [1, 2, 3, 4, 5, 6, 7]
for k in keys:
    start_key = content.find(f"{k}: {{")
    if start_key != -1:
        # find where the next key starts or end of object
        end_key = content.find(f"{k+1}: {{") if k < 7 else len(content)
        subset = content[start_key:end_key]
        has_interp = "interpretation:" in subset
        print(f"Module {k}: has interpretation: {has_interp}")
    else:
        print(f"Module {k}: NOT FOUND in theory.js")
