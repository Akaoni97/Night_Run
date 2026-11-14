# Seconda passata per i disegni in cui trova_ruote.py sbaglia: cerca vicino ai valori stimati a occhio.
# Uso: python3 -I correggi_ruote.py <ruote.json> <cartella disegni> <stime.json>
from PIL import Image
import numpy as np, json, sys
W = json.load(open(sys.argv[1]))
HINT = json.load(open(sys.argv[3]))   # { file: [x ruota dietro, x ruota davanti, raggio stimato] } misurati a occhio
ZIP = sys.argv[2]
ang = np.linspace(0, 2 * np.pi, 96, endpoint=False)
for f, (xr, xf, Rg) in HINT.items():
    L = np.asarray(Image.open(ZIP + '/' + f).convert('L')).astype(float); dark = L < 85
    ys = np.where((L < 226).any(1))[0]; y1 = ys.max()
    res = []
    for xg in (xr, xf):
        best = (-1,)
        for R in np.arange(Rg * 0.7, Rg * 1.25, 1):
            for cy in np.arange(y1 - R * 1.1, y1 - R * 0.9, 1):
                for cx in np.arange(xg - 70, xg + 70, 2):
                    sc = 0
                    for rr in (R * 0.92, R * 0.98):
                        px = np.clip((cx + rr * np.cos(ang)).astype(int), 0, L.shape[1] - 1); py = np.clip((cy + rr * np.sin(ang)).astype(int), 0, L.shape[0] - 1)
                        sc += dark[py, px].mean()
                    key = (sc >= 1.9, R if sc >= 1.9 else sc)   # tutto scuro: si tiene il raggio più grande (bordo esterno della gomma)
                    if best[0] == -1 or key > best[4]: best = (sc, cx, cy, R, key)
        res.append(best)
    (s1, rx, ry, rR, _a), (s2, fx, fy, fR, _b) = res
    W[f] = dict(rw=[int(rx), int((ry + fy) / 2)], fw=[int(fx), int((ry + fy) / 2)], R=int((rR + fR) / 2), score=[round(s1, 2), round(s2, 2)])
    print(f, W[f], flush=True)
json.dump(W, open(sys.argv[1], 'w'), indent=1)
