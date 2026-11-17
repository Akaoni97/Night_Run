# Pulisce i ritagli delle auto: toglie i pixel rimasti dal disegno originale sotto la carrozzeria (pezzi di gomma sotto i
# passaruota, l'ombra a terra fra le ruote) e i pixel del tutto isolati. Non tocca antenne, specchietti e dettagli sottili
# sopra le ruote: sotto la metà della ruota toglie solo le linee sottili (al massimo 2 vicini su 8), sopra solo i pixel soli.
# Chiude anche i buchi di un pixel (trasparente con almeno 6 vicini pieni, fuori dal cerchio della ruota) col colore medio
# dei vicini: nei passaruota lasciavano vedere lo sfondo a puntini.
# Uso (dalla radice del repository): python3 -I strumenti/pulisci_bordi.py img geo.json [--prova]
#   geo.json = { "<id>": { "wy": .., "wr": .., "ax": [x dietro, x davanti] }, ... }  (da CARS[id].sprite)
#   --prova: non scrive niente, dice solo quanti pixel toglierebbe
import sys, json, os, numpy as np
from PIL import Image
d, geo, prova = sys.argv[1], json.load(open(sys.argv[2])), '--prova' in sys.argv
def vicini(op):
    H, W = op.shape; p = np.pad(op, 1)
    return sum(p[1 + dy:H + 1 + dy, 1 + dx:W + 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx)
for cid, G in geo.items():
    f = os.path.join(d, cid + '.png')
    if not os.path.exists(f): continue
    a = np.array(Image.open(f).convert('RGBA')); tot = 0
    for _ in range(3):                                         # a passate: un filo staccato si consuma dalle punte
        op = a[:, :, 3] > 0; n = vicini(op); H, W = op.shape
        yy = np.arange(H)[:, None] * np.ones((1, W)); basso = yy > G['wy'] + G['wr'] * 0.2
        via = (op & (n == 0)) | (op & basso & (n <= 2))
        k = int(via.sum()); tot += k
        if not k: break
        a[via, 3] = 0
    # buchi di un pixel, fuori dalle ruote (dentro le copre il disegno della ruota)
    op = a[:, :, 3] > 0; n = vicini(op); H, W = op.shape
    yy, xx = np.mgrid[0:H, 0:W]; dentro = np.zeros_like(op)
    for ax in G['ax']: dentro |= np.hypot(xx - ax, yy - G['wy']) < G['wr'] - 1
    buchi = (~op) & (n >= 6) & ~dentro; nb = int(buchi.sum())
    if nb:
        c = a[:, :, :3].astype(float) * op[:, :, None]; p = np.pad(c, ((1, 1), (1, 1), (0, 0))); q = np.pad(op.astype(float), 1)
        sc = sum(p[1 + dy:H + 1 + dy, 1 + dx:W + 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx)
        sn = sum(q[1 + dy:H + 1 + dy, 1 + dx:W + 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx)
        a[buchi, :3] = (sc[buchi] / sn[buchi][:, None]).round().astype(np.uint8); a[buchi, 3] = 255
    # bordo del passaruota (fascia di 5 pixel attorno al cerchio della ruota): lì basta che il buco abbia 4 vicini pieni
    for _ in range(3):
        op = a[:, :, 3] > 0; n = vicini(op); fascia = np.zeros_like(op)
        for ax in G['ax']: dd = np.hypot(xx - ax, yy - G['wy']); fascia |= (dd >= G['wr'] - 1) & (dd <= G['wr'] + 4) & (yy <= G['wy'] + G['wr'] * 0.2)
        b2 = (~op) & (n >= 4) & fascia; k = int(b2.sum())
        if not k: break
        c = a[:, :, :3].astype(float) * op[:, :, None]; p = np.pad(c, ((1, 1), (1, 1), (0, 0))); q = np.pad(op.astype(float), 1)
        sc = sum(p[1 + dy:H + 1 + dy, 1 + dx:W + 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx)
        sn = sum(q[1 + dy:H + 1 + dy, 1 + dx:W + 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx)
        a[b2, :3] = (sc[b2] / sn[b2][:, None]).round().astype(np.uint8); a[b2, 3] = 255; nb += k
    print(f'{cid:10s} tolti {tot:4d} pixel, chiusi {nb:3d} buchi')
    if (tot or nb) and not prova: Image.fromarray(a).save(f)
