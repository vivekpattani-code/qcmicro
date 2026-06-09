with open('js/notebook.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find("restoreNotebookDOM(")
if idx != -1:
    print(content[idx:idx+1500])
else:
    print("restoreNotebookDOM not found")
