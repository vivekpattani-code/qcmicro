with open('js/theory.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's import the data or parse it simply
import re

matches = re.finditer(r'(\d+):\s*\{', content)
for match in matches:
    start_pos = match.start()
    # Find title and badge within the next 400 characters
    subset = content[start_pos:start_pos+400]
    title_m = re.search(r'title:\s*["\'`]([^"\'`]+)["\'`]', subset)
    badge_m = re.search(r'badge:\s*["\'`]([^"\'`]+)["\'`]', subset)
    title = title_m.group(1) if title_m else "None"
    badge = badge_m.group(1) if badge_m else "None"
    print(f"Key {match.group(1)}: Title='{title}' | Badge='{badge}'")
