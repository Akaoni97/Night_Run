# Cerca le due ruote nei disegni di lato. Uso: python3 -I trova_ruote.py <ruote.json in uscita> <disegni.png...>
# cerca le due ruote in un disegno di lato (muso a destra, sfondo chiaro): cerchi scuri che toccano terra
from PIL import Image
import numpy as np, sys, json
def find(path):
    im = Image.open(path).convert('RGB'); A = np.asarray(im).astype(float); L = A.mean(2); H, W = L.shape
    ys, xs = np.where(L < 226); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    f = 4; Ls = np.asarray(Image.fromarray(L.astype(np.uint8)).resize((W // f, H // f), Image.BOX)).astype(float)
    dark = Ls < 85
    cw = (x1 - x0) / f; best = []
    ang = np.linspace(0, 2 * np.pi, 72, endpoint=False)
    for half in (0, 1):
        bs = (-1, 0, 0, 0)
        xa = x0 / f + (0.05 if half == 0 else 0.5) * cw; xb = x0 / f + (0.5 if half == 0 else 0.95) * cw
        cxs = np.arange(int(xa), int(xb))
        for R in np.arange(cw * 0.06, cw * 0.17, 0.5):
            for cy in np.arange(y1 / f - R * 1.15, y1 / f - R * 0.85, 0.5):
                sc = np.zeros(len(cxs))
                for rr in (R * 0.9, R * 0.97):
                    dx = (rr * np.cos(ang)); dy = np.clip((cy + rr * np.sin(ang)).astype(int), 0, Ls.shape[0] - 1)
                    px = np.clip((cxs[None, :] + dx[:, None]).astype(int), 0, Ls.shape[1] - 1)
                    sc += dark[dy[:, None], px].mean(0)
                sc = sc / 2 + R * 0.002
                i = int(sc.argmax())
                if sc[i] > bs[0]: bs = (sc[i], float(cxs[i]), cy, R)
        best.append(bs)
    (s1, rx, ry, rR), (s2, fx, fy, fR) = best
    R = (rR + fR) / 2 * f; cy = (ry + fy) / 2 * f
    return dict(rw=[round(rx * f), round(cy)], fw=[round(fx * f), round(cy)], R=round(R), score=[round(s1, 2), round(s2, 2)], box=[int(x0), int(y0), int(x1), int(y1)])
out = {}
for p in sys.argv[2:]:
    out[p.split('/')[-1]] = find(p); print(p.split('/')[-1], out[p.split('/')[-1]], flush=True)
json.dump(out, open(sys.argv[1], 'w'), indent=1)
