#!/usr/bin/env python3
"""Rifà la maschera della vernice (img/<id>_paint.png) per le auto scure, dove quella disegnata a mano prendeva poco.

La carrozzeria è quello che non è vetro (chiaro e azzurrognolo), non è luce o dettaglio colorato (saturo), non è plastica
nera né contorno (troppo scuro), e non sono i sedili dentro i finestrini. Uso (dalla radice del repository):
    python3 strumenti/maschera_scura.py golf 30 p205 29
cioè id e luminosità minima della carrozzeria (si guarda l'anteprima con --anteprima). Serve scipy e Pillow, solo per
rigenerare le maschere in locale: non entra nel gioco.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

def maschera(id_, lo, hi=112, sat=48):
    b = np.array(Image.open(f'img/{id_}.png').convert('RGBA')).astype(int)
    a = b[..., 3] > 40
    lum = 0.3 * b[..., 0] + 0.59 * b[..., 1] + 0.11 * b[..., 2]
    sa = b[..., :3].max(-1) - b[..., :3].min(-1)
    glass = a & (lum >= hi) & (sa < sat)
    m = a & (lum >= lo) & (lum < hi) & (sa < sat)
    m = ndi.binary_closing(m, structure=np.ones((3, 3))) & a
    lab, n = ndi.label(m)
    for i in range(1, n + 1):
        c = lab == i
        ring = ndi.binary_dilation(c, structure=np.ones((3, 3)), iterations=2) & ~c & a
        sedile = c.sum() < 250 and ring.sum() and (ring & glass).sum() / ring.sum() > 0.28       # piccolo e chiuso dal vetro: un sedile, non vernice
        if c.sum() < 25 or sedile:
            m[c] = False
    return m

def main(args):
    anteprima = '--anteprima' in args
    args = [x for x in args if x != '--anteprima']
    for id_, lo in zip(args[0::2], args[1::2]):
        m = maschera(id_, int(lo))
        out = np.zeros(m.shape + (4,), np.uint8); out[m] = 255
        Image.fromarray(out).save(f'img/{id_}_paint.png')
        print(id_, 'vernice', round(float(m.sum()) / max(1, (np.array(Image.open(f"img/{id_}.png").convert("RGBA"))[..., 3] > 40).sum()), 2))
        if anteprima:
            b = Image.open(f'img/{id_}.png').convert('RGBA'); bg = Image.new('RGBA', b.size, (200, 200, 210, 255)); bg.alpha_composite(b)
            ov = np.array(bg); ov[m] = (0.35 * ov[m] + 0.65 * np.array([255, 0, 255, 255])).astype(np.uint8)
            Image.fromarray(ov).resize((b.size[0] * 4, b.size[1] * 4), Image.NEAREST).save(f'/tmp/{id_}_anteprima.png')

if __name__ == '__main__':
    main(sys.argv[1:])
