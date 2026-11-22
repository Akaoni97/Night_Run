# Affina le ruote trovate da trova_ruote.py: centro dal CERCHIONE (disco chiaro col bordo netto verso la gomma scura,
# tutto intorno) e raggio della gomma dal punto più basso non trasparente sotto il centro (dove tocca terra).
# Lavora sui disegni con lo sfondo già trasparente (sfondo_via.py). Scrive anche il raggio del cerchione (Rr).
# Uso: python3 -I affina_ruote.py <ruote.json> <cartella disegni trasparenti> [file:cx_dietro,cx_davanti,cy,R ...]
#   (i nomi in ruote.json possono finire in _bianco.png: si usa il disegno trasparente con lo stesso nome senza _bianco)
from PIL import Image
import numpy as np, sys, json, os
J = json.load(open(sys.argv[1])); D = sys.argv[2]
for a in sys.argv[3:]:
    n, v = a.split(':'); rx, fx, cy, R = [float(t) for t in v.split(',')]
    J[n] = dict(rw=[rx, cy], fw=[fx, cy], R=R)
ang = np.linspace(0, 2 * np.pi, 96, endpoint=False)
for n, w in J.items():
    A = np.asarray(Image.open(os.path.join(D, n.replace('_bianco', ''))).convert('RGBA')).astype(float)
    L = A[..., :3].mean(2); AL = A[..., 3]; H, W = L.shape
    def ring(cx, cy, r):
        xs = np.clip((cx + r * np.cos(ang)).astype(int), 0, W - 1); ys = np.clip((cy + r * np.sin(ang)).astype(int), 0, H - 1)
        return L[ys, xs]
    R0 = w['R']; res = []
    for key in ('rw', 'fw'):
        cx0, cy0 = w[key]; best = (-1e9, cx0, cy0, R0 * 0.6)
        for r in np.arange(R0 * 0.35, R0 * 0.85, 2):
            for cy in np.arange(cy0 - R0 * 0.3, cy0 + R0 * 0.3, 2):
                for cx in np.arange(cx0 - R0 * 0.25, cx0 + R0 * 0.25, 2):
                    a = ring(cx, cy, r - 3); b = ring(cx, cy, r + 4)
                    s = np.median(a - b) + 0.3 * (a - b).mean()          # chiaro dentro, scuro fuori, tutto intorno
                    if s > best[0]: best = (s, cx, cy, r)
        s0, cx1, cy1, r1 = best
        for r in np.arange(r1 - 2, r1 + 2.1, 0.5):
            for cy in np.arange(cy1 - 2, cy1 + 2.1, 0.5):
                for cx in np.arange(cx1 - 2, cx1 + 2.1, 0.5):
                    a = ring(cx, cy, r - 3); b = ring(cx, cy, r + 4); s = np.median(a - b) + 0.3 * (a - b).mean()
                    if s > best[0]: best = (s, cx, cy, r)
        s, cx, cy, rr = best
        # gomma: punto più basso non trasparente sotto il centro (mediana su qualche colonna vicina)
        bots = []
        for x in range(int(cx - rr * 0.25), int(cx + rr * 0.25) + 1, 2):
            col = np.where(AL[int(cy):, x] > 128)[0]
            # primo buco trasparente sotto il centro: lì finisce la gomma
            gaps = np.where(np.diff(col) > 1)[0]
            last = col[gaps[0]] if len(gaps) else col[-1]
            bots.append(cy + last)
        R = float(np.median(bots)) - cy + 0.5
        res.append((round(cx, 1), round(cy, 1), round(R, 1), round(rr, 1), round(s, 1)))
    (rx, ry, rR, rr1, s1), (fx, fy, fR, rr2, s2) = res
    w['rw'] = [rx, ry]; w['fw'] = [fx, fy]; w['Rs'] = [rR, fR]; w['R'] = round((rR + fR) / 2, 1); w['Rr'] = [rr1, rr2]; w['fine'] = [s1, s2]
    print(n, w['rw'], w['fw'], 'gomma', w['Rs'], 'cerchione', w['Rr'], w['fine'], flush=True)
json.dump(J, open(sys.argv[1], 'w'), indent=1)
