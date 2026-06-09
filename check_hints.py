with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start and end of updateHintOverlay()
start_idx = content.find('updateHintOverlay()')
end_idx = content.find('loadModule', start_idx)
hint_code = content[start_idx:end_idx]

import re
matches = re.finditer(r'this\.activeModuleNum\s*===\s*(\d+)', hint_code)
for m in matches:
    pos = m.start()
    snippet = hint_code[pos:pos+400]
    print(f"Module {m.group(1)} Hint logic:")
    print(snippet.split('\n')[0])
    print(snippet.split('\n')[1])
    print(snippet.split('\n')[2])
    print("-" * 40)
