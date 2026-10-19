from playwright.sync_api import sync_playwright
B='file:///C:/Users/Mike/Claude-baza/reclame-tv/tv5/'
errs=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); p=b.new_page(viewport={'width':1920,'height':1080})
    p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    p.on('pageerror',lambda e: errs.append(str(e)))
    for f in ['109-cartofi-gratinati','145-sandwich-piept-de-pui','203-mic-dejun-la-popoteria']:
        p.goto(B+f+'.html'); p.wait_for_timeout(2500); p.screenshot(path='probe/'+f+'-a.png'); p.wait_for_timeout(6000); p.screenshot(path='probe/'+f+'.png')
    p.goto(B+'index.html'); p.wait_for_timeout(14000); p.screenshot(path='probe/rotire-14s.png')
    print('erori',errs); b.close()
