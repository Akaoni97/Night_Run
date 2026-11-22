# Mezzi pesanti dai disegni del proprietario (sfondo trasparente) -> sprite del traffico a due misure, come disegni_hd.py:
# img/<id>.png, _hd.png, _wheel.png, _wheel_hd.png, _paint.png, _paint_hd.png (la vernice è vuota: i camion tengono la loro livrea).
# Una motrice e un rimorchio si compongono in un solo disegno: il rimorchio si porta alla stessa misura di gomma della motrice,
# a terra sulla stessa riga, col muso subito dietro la cabina (motrice sopra). Gli assi possono essere tanti (geo.ax).
# Uso: python3 -I camion_hd.py <cartella img> <cartella anteprime> <elenco.json>
#   elenco.json: { id: { "img": file, "assi": [[cx, cy, R], ...], "rim": null | { "img": file, "assi": [...] },
#                        "cabina": x del retro della cabina (solo con rim), "gap": pixel tra cabina e rimorchio } }
from PIL import Image, ImageDraw
import numpy as np, json, sys, os
OUT, PREV, LIST = sys.argv[1:4]; L = json.load(open(LIST)); os.makedirs(PREV, exist_ok=True)
R_SPR = 23.3                                                 # raggio della gomma nello sprite (0,53 m a 44 pixel per metro)

def scaled(img, w, h):
    a = img.convert('RGBa').resize((w, h), Image.LANCZOS).convert('RGBA'); A = np.asarray(a).copy()
    A[..., 3] = np.where(A[..., 3] >= 110, 255, 0); return A

meta = {}
for cid, E in L.items():
    mot = Image.open(E['img']).convert('RGBA'); assi = [list(v) for v in E['assi']]
    Rm = float(np.mean([v[2] for v in assi])); ground = float(np.mean([v[1] + v[2] for v in assi]))
    wsrc = (mot, assi[-2] if len(assi) > 1 else assi[0])     # la ruota da far girare: una posteriore della motrice
    if E.get('rim'):
        rim = Image.open(E['rim']['img']).convert('RGBA'); ra = E['rim']['assi']
        Rr = float(np.mean([v[2] for v in ra])); gr = float(np.mean([v[1] + v[2] for v in ra])); k = Rm / Rr
        rim2 = rim.resize((round(rim.width * k), round(rim.height * k)), Image.LANCZOS)
        xs = np.where(np.asarray(rim2)[..., 3] > 128)[1]; rx1 = xs.max()
        dx = E['cabina'] - E.get('gap', 6) - rx1; dy = ground - gr * k
        x0 = min(0, dx); y0 = min(0, dy); W = int(max(mot.width, dx + rim2.width) - x0) + 2; H = int(max(mot.height, dy + rim2.height) - y0) + 2
        C = Image.new('RGBA', (W, H), (0, 0, 0, 0)); C.alpha_composite(rim2, (int(round(dx - x0)), int(round(dy - y0)))); C.alpha_composite(mot, (int(round(-x0)), int(round(-y0))))
        assi = [[v[0] * k + dx - x0, v[1] * k + dy - y0, Rm] for v in ra] + [[v[0] - x0, v[1] - y0, v[2]] for v in assi]
        wsrc = (C, [wsrc[1][0] - x0, wsrc[1][1] - y0, wsrc[1][2]])
        src = C; ground = ground - y0
    else: src = mot
    A = np.asarray(src); ys, xs = np.where(A[..., 3] > 0)
    left, right, top = xs.min() - 2, xs.max() + 3, ys.min() - 2; bot = ground + 2
    s1 = R_SPR / Rm; cy = ground - Rm
    wsx, wsy, wsr = wsrc[1]
    for mult, tag in ((1, ''), (2, '_hd')):
        s = s1 * mult; w = int(round((right - left) * s)); h = int(round((bot - top) * s))
        body = scaled(src.crop((int(left), int(top), int(right), int(round(bot)))), w, h)
        yy, xx = np.mgrid[0:h, 0:w]; Rs = R_SPR * mult; wcy = (cy - top) * s
        axs = [(v[0] - left) * s for v in assi]
        for c in axs: body[np.hypot(xx + 0.5 - c, yy + 0.5 - wcy) < Rs + 0.4 * mult, 3] = 0
        body[(yy + 0.5 > wcy + Rs * 0.8) & np.all([np.hypot(xx + 0.5 - c, yy + 0.5 - wcy) > Rs + 0.6 for c in axs], 0), 3] = 0   # ombra a terra
        S = int(np.ceil(Rs)) + 1; n = int(round(2 * Rs))
        wimg = wsrc[0].crop((int(round(wsx - wsr)), int(round(wsy - wsr)), int(round(wsx + wsr)), int(round(wsy + wsr))))
        small = scaled(wimg, n, n); whl = np.zeros((2 * S, 2 * S, 4), np.uint8); o = (2 * S - n) // 2; whl[o:o + n, o:o + n] = small
        r = np.hypot(np.mgrid[0:2 * S, 0:2 * S][1] + 0.5 - S, np.mgrid[0:2 * S, 0:2 * S][0] + 0.5 - S)
        whl[r < Rs - 0.5, 3] = 255; whl[r >= Rs + 0.25, 3] = 0
        Image.fromarray(body, 'RGBA').save(f'{OUT}/{cid}{tag}.png'); Image.fromarray(whl, 'RGBA').save(f'{OUT}/{cid}_wheel{tag}.png')
        Image.fromarray(np.zeros((h, w, 4), np.uint8), 'RGBA').save(f'{OUT}/{cid}_paint{tag}.png')
        if mult == 1:
            G = dict(w=w, h=h, wy=round(wcy, 1), wr=R_SPR, ax=[round(c, 1) for c in axs], head=[w - 3, int(wcy - Rs * 0.9)], tail=[1, int(wcy - Rs * 1.4), 5, 5],
                     ex=[3, round(wcy + Rs * 0.25)], hx=int(w * 0.85), hy=0, refL=128, slots={}, ws=S, fixed=1, hd=2)
            meta[cid] = G
        else:
            pv = Image.new('RGBA', (w, h), (40, 40, 60, 255)); pv.alpha_composite(Image.fromarray(body, 'RGBA')); wi = Image.fromarray(whl, 'RGBA')
            for c in axs: pv.alpha_composite(wi, (int(round(c - S)), int(round(wcy - S))))
            pv.convert('RGB').save(f'{PREV}/{cid}_hd_prev.png')
    print(cid, '%dx%d' % (G['w'], G['h']), 'assi', G['ax'], flush=True)
json.dump(meta, open(f'{PREV}/meta.json', 'w'), indent=1)
