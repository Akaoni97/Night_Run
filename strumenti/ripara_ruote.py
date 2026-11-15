# Ripara le ruote delle auto da disegno già nel gioco (img/<id>.png, <id>_wheel.png e GEN_DATA in cars.js).
# Difetti che corregge:
#  1. in GEN_DATA "wy" era il bordo alto della gomma (cars.js lo correggeva al caricamento): ora è il centro, e
#     "fixed": 1 dice a cars.js di non correggerlo più;
#  2. il ritaglio della ruota era centrato su una stima, spesso più alta di qualche pixel: girando, il cerchio
#     ballava e nel ritaglio entravano pezzi di parafango (che giravano con la ruota).
# Per ogni auto: trova il centro vero del cerchione, rifà la ruota tonda (cerchione del disegno + gomma
# ricostruita dove c'era carrozzeria o mancava), rimette nel corpo i pezzi di passaruota rimasti scoperti e
# scrive i numeri giusti (ax, wy = centro, wr = raggio) in cars.js.
# Uso (da motori/): python3 -I strumenti/ripara_ruote.py . [anteprime]
import json, re, sys, os
import numpy as np
from PIL import Image

ROOT = sys.argv[1]
PREV = sys.argv[2] if len(sys.argv) > 2 else None
CARS = os.path.join(ROOT, 'cars.js')
src = open(CARS, encoding='utf-8').read()
RX = [re.compile(r'^(const GEN_DATA = )(\{.*\})(;)$', re.M), re.compile(r'^(Object\.assign\(GEN_DATA, )(\{.*\})(\);)$', re.M)]
blocks = [json.loads(rx.search(src).group(2)) for rx in RX]


def stats(a):
    rgb = a[..., :3].astype(float)
    L = rgb.mean(2)
    sat = (rgb.max(2) - rgb.min(2)) / np.maximum(rgb.max(2), 1)
    return L, sat


def fix(cid, s):
    if s.get('fixed'):
        return None
    body = np.asarray(Image.open(f'{ROOT}/img/{cid}.png').convert('RGBA')).copy()
    wimg = np.asarray(Image.open(f'{ROOT}/img/{cid}_wheel.png').convert('RGBA'))
    S = wimg.shape[0]; c0 = S / 2
    R0 = s['wr']; wcy = s['wy'] + s['wr']                         # centro del ritaglio nel disegno
    L, sat = stats(wimg)
    op = wimg[..., 3] > 0
    yy, xx = np.mgrid[0:S, 0:S] + 0.5
    # centro del cerchione: baricentro dei pixel chiari e poco saturi, ripetuto attorno alla stima
    cx, cy = c0, c0
    for _ in range(4):
        r = np.hypot(xx - cx, yy - cy)
        rim = op & (L > 92) & (sat < 0.3) & (r < R0 * 0.62)
        if rim.sum() < 6:
            break
        cx, cy = xx[rim].mean(), yy[rim].mean()
    dx, dy = cx - c0, cy - c0
    r = np.hypot(xx - cx, yy - cy)
    # raggio del cerchione: ultimo anello in cui almeno metà dei pixel è chiara
    Rr = R0 * 0.55
    for rr in np.arange(2, R0, 0.5):
        ring = op & (abs(r - rr) < 0.5)
        if ring.sum() and ((L > 88) & ring).sum() / ring.sum() > 0.45:
            Rr = rr
    Rt = R0                                                       # raggio della gomma: quello misurato sul disegno
    # colore della gomma: i pixel scuri e grigi dell'anello esterno
    tyre_zone = op & (r > Rr + 1) & (r < Rt - 0.5)
    tyre_like = tyre_zone & (L < 95) & (sat < 0.35)
    tc = np.median(wimg[tyre_like][:, :3], 0) if tyre_like.sum() > 8 else np.array([34, 36, 42])
    # nuova ruota: lato pari, centro esatto
    N = int(np.ceil(Rt)) * 2 + 2; h = N / 2
    out = np.zeros((N, N, 4), np.uint8)
    for j in range(N):
        for i in range(N):
            ox, oy = i + 0.5 - h, j + 0.5 - h
            d = np.hypot(ox, oy)
            if d > Rt + 0.35:
                continue
            sx, sy = int(np.floor(cx + ox)), int(np.floor(cy + oy))
            px = wimg[sy, sx] if 0 <= sx < S and 0 <= sy < S else None
            keep = px is not None and px[3] > 0
            if keep and d > Rr + 0.5:                               # anello della gomma: solo pixel da gomma
                l = px[:3].astype(float).mean(); st = (px[:3].max() - px[:3].min()) / max(px[:3].max(), 1)
                keep = l < 95 and st < 0.35
            if keep:
                out[j, i] = px
            else:                                                   # gomma ricostruita: luce dall'alto a sinistra, spalla più scura
                k = 1 + 0.18 * (-(ox + oy) / max(d, 1) * 0.7) - (0.22 if d > Rt - 1.2 else 0) + (0.12 if Rr + 1.5 < d < Rr + 2.6 else 0)
                out[j, i, :3] = np.clip(tc * k, 0, 255); out[j, i, 3] = 255
    # corpo: richiude i passaruota (pezzi del vecchio ritaglio fuori dalla ruota nuova), per entrambi gli assi
    Hb, Wb = body.shape[:2]
    for ax in s['ax']:
        for j in range(S):
            for i in range(S):
                if not op[j, i]:
                    continue
                if np.hypot(i + 0.5 - cx, j + 0.5 - cy) <= Rt + 0.2:
                    continue
                X, Y = int(round(ax - c0 + i)), int(round(wcy - c0 + j))
                if 0 <= X < Wb and 0 <= Y < Hb and body[Y, X, 3] == 0:
                    body[Y, X] = wimg[j, i]
    Image.fromarray(body, 'RGBA').save(f'{ROOT}/img/{cid}.png')
    Image.fromarray(out, 'RGBA').save(f'{ROOT}/img/{cid}_wheel.png')
    s['ax'] = [round(a + dx, 1) for a in s['ax']]
    s['wy'] = round(wcy + dy, 1)
    s['wr'] = round(Rt, 1)
    s['ws'] = N
    s['fixed'] = 1
    if PREV:
        big = Image.fromarray(out, 'RGBA').resize((N * 6, N * 6), Image.NEAREST)
        bg = Image.new('RGBA', big.size, (60, 200, 60, 255)); bg.alpha_composite(big); bg.save(f'{PREV}/{cid}_ruota.png')
    return 'spostata di %+.1f %+.1f, cerchione %.1f, gomma %.1f' % (dx, dy, Rr, Rt)


for b in blocks:
    for cid, d in b.items():
        msg = fix(cid, d['sprite'])
        print(cid, msg or 'già riparata')
for rx, b in zip(RX, blocks):
    src = rx.sub(lambda m: m.group(1) + json.dumps(b, separators=(',', ':')) + m.group(3), src, count=1)
open(CARS, 'w', encoding='utf-8').write(src)
