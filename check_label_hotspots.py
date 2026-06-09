with open('js/modules/label.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find("renderHotspots()")
if idx != -1:
    print(content[idx:idx+1500])
else:
    print("renderHotspots not found")
