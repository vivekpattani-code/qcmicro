import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for "this.quizzes = {" and extract its contents
start_idx = content.find("this.quizzes = {")
if start_idx != -1:
    subset = content[start_idx:start_idx + 80000] # large chunk
    # Let's find keys: 1: [, 2: [, 3: [, etc.
    matches = re.finditer(r'(\d+):\s*\[', subset)
    for m in matches:
        key = m.group(1)
        key_pos = m.start()
        # Find the first question
        q_match = re.search(r'q:\s*["\'`]([^"\'`]+)["\'`]', subset[key_pos:key_pos+1000])
        q_text = q_match.group(1) if q_match else "None"
        print(f"Quiz Module {key}: First Question: '{q_text[:120]}'")
else:
    print("Could not find this.quizzes")
