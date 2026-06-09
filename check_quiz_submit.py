with open('js/notebook.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find("submitQuizScore(")
if idx != -1:
    print(content[idx:idx+1000])
else:
    print("submitQuizScore not found")
