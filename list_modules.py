import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all module-card divs
pattern = r'<div class="module-card[^"]*"[^>]*>([\s\S]*?)</div>\s*</div>'
matches = re.finditer(r'<div class="module-card[^"]*"[\s\S]*?</h3>', content)

for idx, match in enumerate(matches, 1):
    card = match.group(0)
    title_match = re.search(r'<h3>([^<]+)</h3>', card)
    badge_match = re.search(r'<div class="card-badge">([^<]+)</div>', card)
    title = title_match.group(1) if title_match else "Unknown"
    badge = badge_match.group(1) if badge_match else "No Badge"
    print(f"Module {idx}: {badge} - {title}")
