# Toglie lo sfondo uniforme (grigio o bianco) dai disegni di lato: riempimento dai bordi con tolleranza sul colore dello
# sfondo (mediana del bordo). Scrive due PNG per disegno: <nome>.png con lo sfondo trasparente e <nome>_bianco.png
# sullo sfondo bianco puro (per trova_ruote.py e gli altri strumenti che vogliono lo sfondo chiaro).
# Uso: python3 -I sfondo_via.py <cartella uscita> <tolleranza> <disegni.png...>
from PIL import Image
import numpy as np, sys, os
from collections import deque
out, tol, files = sys.argv[1], float(sys.argv[2]), sys.argv[3:]
os.makedirs(out, exist_ok=True)
for f in files:
    im = Image.open(f).convert('RGBA'); A = np.asarray(im).astype(np.int16); H, W = A.shape[:2]
    rgb = A[..., :3]; alpha0 = A[..., 3]
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, 0)
    near = (np.abs(rgb - bg).max(2) <= tol) | (alpha0 < 20)
    seen = np.zeros((H, W), bool)
    q = deque()
    for x in range(W):
        for y in (0, H - 1):
            if near[y, x] and not seen[y, x]: seen[y, x] = True; q.append((y, x))
    for y in range(H):
        for x in (0, W - 1):
            if near[y, x] and not seen[y, x]: seen[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= yy < H and 0 <= xx < W and not seen[yy, xx] and near[yy, xx]: seen[yy, xx] = True; q.append((yy, xx))
    a = np.where(seen, 0, 255).astype(np.uint8)
    name = os.path.splitext(os.path.basename(f))[0]
    Image.fromarray(np.dstack([rgb.astype(np.uint8), a]), 'RGBA').save(os.path.join(out, name + '.png'))
    wh = rgb.copy(); wh[seen] = 255
    Image.fromarray(wh.astype(np.uint8), 'RGB').save(os.path.join(out, name + '_bianco.png'))
    print(name, 'sfondo', [int(v) for v in bg], 'tolto %.0f%%' % (seen.mean() * 100), flush=True)
