#!/usr/bin/env python3
# Stacca il pianale dal carro attrezzi (img/carro*.png, disegno del proprietario) per il traino animato di soccorso.js:
#   img/carro_telaio*.png  = il carro senza pianale (cabina, telaio, verricello, ruote: il resto identico)
#   img/carro_pianale*.png = solo il pianale (la rampa con i fanali della coda), che soccorso.js inclina e fa scorrere
# Le misure sono quelle del disegno a densità doppia (945×309); la versione normale le dimezza.
# Uso: python3 strumenti/carro_pianale.py   (deterministico: rifà sempre gli stessi file)
import os
import shutil
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'img')
# il pianale nel disegno HD: x fino a 716, righe 168-206 (piano e longherone giallo, più giù dove comincia la rampa),
# tranne il verricello sopra il piano davanti (x ≥ 585, righe < 186) e il gancio della catena (x ≥ 565, righe < 177); in coda anche i fanali sotto la punta (x ≤ 110, righe fino a 244)
PIANO_X, PIANO_Y0, PIANO_Y1 = 716, 168, 206
VERR_X, VERR_Y = 585, 186
GANCIO_X, GANCIO_Y = 565, 177
CODA_X, CODA_Y1 = 110, 244
STRISCIA = (0, PIANO_Y0, PIANO_X + 1, CODA_Y1 + 1)   # il ritaglio salvato come carro_pianale_hd.png


def fondo(x):
    # il longherone giallo scende verso la coda dove comincia la rampa (dalla x 160 in giù), col suo filo scuro sotto
    return PIANO_Y1 + 1 + max(0, 160 - x) * 0.32


def nel_pianale(x, y):
    if x <= CODA_X and PIANO_Y0 <= y <= CODA_Y1:
        return True
    if x <= PIANO_X and PIANO_Y0 <= y <= fondo(x):
        # restano sul telaio il verricello col suo basamento e il gancio della catena appoggiato sul piano
        return not ((x >= VERR_X and y < VERR_Y) or (x >= GANCIO_X and y < GANCIO_Y))
    return False


def dividi(nome, m):
    """m = 2 per il disegno HD, 1 per quello normale (coordinate dimezzate)."""
    im = Image.open(os.path.join(R, nome)).convert('RGBA')
    W, H = im.size
    tel, pia = im.copy(), Image.new('RGBA', im.size, (0, 0, 0, 0))
    pt, pp, ps = tel.load(), pia.load(), im.load()
    for y in range(H):
        for x in range(W):
            if nel_pianale(x * 2 // m, y * 2 // m):
                pp[x, y] = ps[x, y]
                pt[x, y] = (0, 0, 0, 0)
    return tel, pia


for suf, m in (('_hd', 2), ('', 1)):
    for parte in ('', '_paint'):
        tel, pia = dividi(f'carro{parte}{suf}.png', m)
        tel.save(os.path.join(R, f'carro_telaio{parte}{suf}.png'), optimize=True)
        if parte == '':
            box = tuple(v * m // 2 for v in STRISCIA)
            pia.crop(box).save(os.path.join(R, f'carro_pianale{suf}.png'), optimize=True)
    shutil.copyfile(os.path.join(R, f'carro_wheel{suf}.png'), os.path.join(R, f'carro_telaio_wheel{suf}.png'))
print('fatto: img/carro_telaio*.png e img/carro_pianale*.png')
