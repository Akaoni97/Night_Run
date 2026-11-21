# Disegni di lato ad alta definizione (sfondo già trasparente, sfondo_via.py) + ruota disegnata a parte -> sprite del gioco
# a due misure: quella di sempre (44 pixel per metro: img/<id>.png, _wheel.png, _paint.png) e quella a densità doppia
# (88 pixel per metro: img/<id>_hd.png, _wheel_hd.png, _paint_hd.png), con le stesse misure in unità dello sprite.
# Uso: python3 -I disegni_hd.py <cartella img> <cartella anteprime> <ruote.json> <cartella disegni> <cartella ruote> <elenco.json>
#   ruote.json: { "<file>_bianco.png": { rw:[x,y], fw:[x,y], Rs:[R dietro, R davanti] } } (trova_ruote.py + affina_ruote.py)
#   elenco.json: { id: [file del disegno, file della ruota, passo vero in metri, suffisso dei file (vuoto o "_tuning")] }
from PIL import Image, ImageDraw
import numpy as np, json, sys, os, colorsys
OUT, PREV, RJ, SRC, WH, LIST = sys.argv[1:7]
W = json.load(open(RJ)); L = json.load(open(LIST))
os.makedirs(PREV, exist_ok=True)
PPM = 44                                                     # pixel dello sprite per metro (come strumenti/disegni_auto.py)

def scaled(img, w, h):
    # rimpicciolimento di qualità a colori premoltiplicati (niente aloni scuri o chiari sul bordo), poi sagoma netta
    a = img.convert('RGBa').resize((w, h), Image.LANCZOS).convert('RGBA')
    A = np.asarray(a).copy(); al = A[..., 3]
    A[..., 3] = np.where(al >= 110, 255, 0)
    return A

def wheel_sprite(path, Rpx, S):
    # la ruota disegnata a parte: i buchi trasparenti tra le razze diventano il tamburo scuro, poi diametro = 2 R
    im = Image.open(path).convert('RGBA'); a = np.asarray(im).astype(np.int32)
    ys, xs = np.where(a[..., 3] > 20); x0, x1, y0 = xs.min(), xs.max(), ys.min()
    d = x1 - x0 + 1; cx = (x0 + x1) / 2; cy = y0 + d / 2
    H, Wd = a.shape[:2]; yy, xx = np.mgrid[0:H, 0:Wd]
    inside = np.hypot(xx + 0.5 - cx, yy + 0.5 - cy) < d / 2 * 0.97
    hole = inside & (a[..., 3] < 200)
    drum = np.array([22, 22, 27])
    f = a[..., 3:4] / 255.0
    rgb = a[..., :3] * f + drum * (1 - f)
    a[..., :3] = np.where(hole[..., None], rgb, a[..., :3]); a[..., 3] = np.where(inside, 255, a[..., 3])
    # quadrato attorno al disco, poi alla misura dello sprite
    half = d / 2
    box = (int(round(cx - half)), int(round(cy - half)), int(round(cx + half)), int(round(cy + half)))
    wimg = Image.fromarray(a.astype(np.uint8), 'RGBA').crop(box)
    n = int(round(2 * Rpx)); small = scaled(wimg, n, n)
    out = np.zeros((2 * S, 2 * S, 4), np.uint8); o = (2 * S - n) // 2
    out[o:o + n, o:o + n] = small
    # disco pulito: dentro il raggio tutto pieno, fuori niente
    yy, xx = np.mgrid[0:2 * S, 0:2 * S]; r = np.hypot(xx + 0.5 - S, yy + 0.5 - S)
    out[r >= Rpx + 0.25, 3] = 0
    return out

def paint_mask(body, wcy, Rs, band=None):
    # come strumenti/disegni_auto.py: colore di riferimento al centro della portiera, poi tinta (o grigio) simile
    px = body[..., :3].astype(float); h, w = px.shape[:2]; Lm = px.mean(2); mx = px.max(2); mn = px.min(2); sat = (mx - mn) / np.maximum(mx, 1)
    dy0 = int(wcy - Rs * 1.0); ref = np.median(px[dy0 - 3:dy0 + 3, int(w * 0.5) - 6:int(w * 0.5) + 6].reshape(-1, 3), 0)
    rL = ref.mean(); rS = (ref.max() - ref.min()) / max(ref.max(), 1)
    if rS > 0.2:
        rh = colorsys.rgb_to_hsv(*(ref / 255))[0]
        hh = np.vectorize(lambda r, g, b: colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)[0])(px[..., 0], px[..., 1], px[..., 2])
        dh = np.minimum(abs(hh - rh), 1 - abs(hh - rh))
        paint = (dh < 0.06) & (sat > rS * 0.45) & (Lm > rL * 0.25)
    else:
        bluish = (px[..., 2] - px[..., 0]) > (ref[2] - ref[0]) + 7
        paint = (sat < 0.16) & ~bluish & (Lm > rL * 0.5) & (Lm < min(255, rL * 1.35 + 25))
    paint &= body[..., 3] > 0
    def sh(m, dy, dx): return np.roll(np.roll(m, dy, 0), dx, 1)
    dil = paint.copy()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)): dil |= sh(paint, dy, dx)
    clo = dil.copy()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)): clo &= sh(dil, dy, dx)
    okc = (body[..., 3] > 0) & (sat < 0.3 if rS <= 0.2 else True) & (Lm > 25)
    paint |= clo & okc
    if rS > 0.2: paint |= (dh < 0.06) & (sat > 0.12) & (Lm > rL * 0.8) & (body[..., 3] > 0)   # riflessi chiari della stessa tinta
    else: paint |= (sat < 0.2) & ~((px[..., 2] - px[..., 0]) > (ref[2] - ref[0]) + 9) & (Lm > rL * 0.3) & (Lm < rL * 1.8 + 30) & (body[..., 3] > 0)   # grigi metallizzati: più margine
    if band:   # fascia dei finestrini (y0, y1 nello sprite): lì solo la vernice vera, i vetri restano vetri
        y0, y1 = band; yy = np.arange(h)[:, None]; inb = (yy >= y0) & (yy <= y1)
        if rS > 0.2: strict = ((sat > rS * 0.6) & (dh < 0.06) & (Lm < rL * 1.6 + 20) & (Lm > rL * 0.55) & ~((px[..., 2] - px[..., 0]) > (ref[2] - ref[0]) + 14)) | ((sat > rS * 0.78) & (dh < 0.08) & (Lm > rL * 0.8))   # via quello che sembra vetro o abitacolo; i montanti lucidi restano vernice
        else: strict = ~((px[..., 2] - px[..., 0]) > (ref[2] - ref[0]) + 2) & (Lm > rL * 0.7) & (Lm < rL * 1.2 + 12)
        paint &= ~inb | strict
        if rS > 0.2: paint |= (yy < y0) & (dh < 0.12) & (sat > 0.1) & (body[..., 3] > 0)   # sopra i vetri c'è solo il tetto: riflessi del cielo compresi
    return paint, ref, rL

meta = {}
for cid, ent in L.items():
    fn, wfn, wb, suf = ent[:4]; band1 = ent[4] if len(ent) > 4 else None   # band1: fascia dei finestrini nello sprite (misura di sempre)
    key = os.path.splitext(fn)[0] + '_bianco.png'; wd = W[key]
    src = Image.open(os.path.join(SRC, fn)).convert('RGBA'); A = np.asarray(src)
    rx, ry = wd['rw']; fx, fy = wd['fw']; Rr, Rf = wd.get('Rs', [wd['R'], wd['R']])
    R = (Rr + Rf) / 2; cy = (ry + fy) / 2
    s1 = PPM * wb / (fx - rx)
    # sfondo chiuso sotto la carrozzeria (tra le ruote, sopra l'ombra): pixel del colore dello sfondo, sotto l'asse, fuori
    # dalle ruote, in tratti orizzontali di almeno 8 pixel (così una fiancata argentata non si buca)
    A = A.copy(); Hs, Ws = A.shape[:2]
    bgc = np.median(A[A[..., 3] == 0][:, :3], 0) if (A[..., 3] == 0).any() else np.array([220, 220, 220])
    yy0, xx0 = np.mgrid[0:Hs, 0:Ws]
    near = (np.abs(A[..., :3].astype(int) - bgc).max(2) <= 16) & (A[..., 3] > 0) & (yy0 > cy)
    near &= (np.hypot(xx0 - rx, yy0 - ry) > Rr + 2) & (np.hypot(xx0 - fx, yy0 - fy) > Rf + 2)
    run = np.zeros_like(near, dtype=np.int32)
    for x in range(Ws): run[:, x] = np.where(near[:, x], (run[:, x - 1] if x else 0) + 1, 0)
    long_ = run >= 8
    for x in range(Ws - 2, -1, -1): long_[:, x] |= near[:, x] & long_[:, x + 1]
    A[long_, 3] = 0; src = Image.fromarray(A, 'RGBA')
    ys, xs = np.where(A[..., 3] > 0); left, right, top = xs.min() - 2, xs.max() + 3, ys.min() - 2
    bot = cy + R + 2
    for mult, tag in ((1, ''), (2, '_hd')):
        s = s1 * mult
        w = int(round((right - left) * s)); h = int(round((bot - top) * s))
        crop = src.crop((int(left), int(top), int(right), int(round(bot))))
        body = scaled(crop, w, h)
        rcx = (rx - left) * s; fcx = (fx - left) * s; wcy = (cy - top) * s; Rs = R * s
        yy, xx = np.mgrid[0:h, 0:w]
        inR = lambda c, r: np.hypot(xx + 0.5 - c, yy + 0.5 - wcy) < r
        # ombra a terra: sotto la linea delle minigonne, fuori dalle ruote
        shadow = (yy + 0.5 > wcy + Rs * 0.72) & ~inR(rcx, Rs + 0.6) & ~inR(fcx, Rs + 0.6)
        body[shadow, 3] = 0
        body[inR(rcx, Rs + 0.4 * mult) | inR(fcx, Rs + 0.4 * mult), 3] = 0
        S = int(np.ceil(Rs)) + 1
        whl = wheel_sprite(os.path.join(WH, wfn), Rs, S)
        paint, ref, rL = paint_mask(body, wcy, Rs, [band1[0] * mult, band1[1] * mult + mult - 1] if band1 else None)
        name = cid + suf
        Image.fromarray(body, 'RGBA').save(f'{OUT}/{name}{tag}.png')
        Image.fromarray(whl, 'RGBA').save(f'{OUT}/{name}_wheel{tag}.png')
        Image.fromarray(np.dstack([np.full((h, w, 3), 255, np.uint8), (paint * 255).astype(np.uint8)]), 'RGBA').save(f'{OUT}/{name}_paint{tag}.png')
        if mult == 1:
            px = body[..., :3].astype(float); Lm = px.mean(2); sat = (px.max(2) - px.min(2)) / np.maximum(px.max(2), 1)
            win = ((px[..., 2] - px[..., 0]) > 10) & (Lm > 60) & (yy < wcy - Rs * 1.2) & (body[..., 3] > 0)
            wy_, wx_ = np.where(win)
            wx0, wx1, wy0 = (int(np.percentile(wx_, 3)), int(np.percentile(wx_, 97)), int(np.percentile(wy_, 3))) if len(wx_) else (int(w * 0.3), int(w * 0.7), 12)
            red = (px[..., 0] > 140) & (px[..., 1] < 110) & (xx < w * 0.12) & (body[..., 3] > 0)
            ry_, rx_ = np.where(red); tail = [int(rx_.mean()) if len(rx_) else 3, int(ry_.mean()) if len(ry_) else int(wcy - Rs)]
            hl = (Lm > 185) & (xx > w * 0.88) & (yy > wcy - Rs * 1.6) & (yy < wcy) & (body[..., 3] > 0) & (sat < 0.35)
            hy_, hx_ = np.where(hl); head = [int(hx_.mean()) if len(hx_) else w - 4, int(hy_.mean()) if len(hy_) else int(wcy - Rs * 0.9)]
            G = dict(w=w, h=h, wy=round(wcy, 1), wr=round(Rs, 1), ax=[round(rcx, 1), round(fcx, 1)], head=head,
                     tail=[max(0, tail[0] - 2), max(0, tail[1] - 3), 5, 5], ex=[3, round(wcy + Rs * 0.25)],
                     hx=int(wx0 + (wx1 - wx0) * 0.62), hy=int(wy0 - 9), refL=round(rL, 1),
                     slots=dict(st_door=[int(w * 0.55), int(wcy - Rs * 0.9), int(w * 0.15), int(Rs * 0.8)], st_rear=[int(rcx), int(wcy - Rs * 1.55), int(Rs * 1.4), int(Rs * 0.7)], st_glass=[int(wx0 + (wx1 - wx0) * 0.25), int(wy0 + 5), int(Rs * 1.4), int(Rs * 0.45)]),
                     ws=S, fixed=1, hd=2)
            meta[name] = G
            # anteprima: corpo con le ruote montate e i punti
            big = Image.fromarray(body, 'RGBA').resize((w * 4, h * 4), Image.NEAREST); pv = Image.new('RGBA', big.size, (40, 40, 60, 255)); pv.alpha_composite(big)
            wb4 = Image.fromarray(whl, 'RGBA').resize((2 * S * 4, 2 * S * 4), Image.NEAREST)
            for c in (rcx, fcx): pv.alpha_composite(wb4, (int((c - S) * 4), int((wcy - S) * 4)))
            d = ImageDraw.Draw(pv)
            for (x, y, c) in [(head[0], head[1], 'yellow'), (tail[0], tail[1], 'red'), (G['hx'], G['hy'] + 16, 'magenta')]: d.ellipse([x * 4 - 6, y * 4 - 6, x * 4 + 6, y * 4 + 6], outline=c, width=2)
            pv.convert('RGB').save(f'{PREV}/{name}_prev.png')
        else:
            # anteprima a densità doppia con le ruote montate (quello che si vedrà in gioco)
            pv = Image.new('RGBA', (w, h), (40, 40, 60, 255)); pv.alpha_composite(Image.fromarray(body, 'RGBA'))
            wi = Image.fromarray(whl, 'RGBA')
            for c in (rcx, fcx): pv.alpha_composite(wi, (int(round(c - S)), int(round(wcy - S))))
            pv.convert('RGB').save(f'{PREV}/{name}_hd_prev.png')
    print(name, '%dx%d' % (G['w'], G['h']), 'R=%.1f' % G['wr'], 'ruote', G['ax'], 'centro', G['wy'], 'scala %.4f' % s1, flush=True)
json.dump(meta, open(f'{PREV}/meta.json', 'w'), indent=1)
