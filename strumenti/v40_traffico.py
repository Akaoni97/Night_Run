#!/usr/bin/env python3
"""Prepara la Volvo V40 per il traffico partendo dal disegno del giocatore (img/v40.png).

Il traffico vuole tre immagini per ogni auto: la carrozzeria, la ruota che gira (img/<auto>_wheel.png) e la maschera
della vernice (img/<auto>_paint.png). Il disegno della V40 ha le ruote dipinte: qui la ruota si ritaglia dal disegno
stesso (un disco attorno alla ruota anteriore), così gira sopra quella dipinta e la copre esattamente.
La maschera prende i pixel della vernice con la stessa regola di street2d.js (v40Base: isBody).

Uso: python3 strumenti/v40_traffico.py   (dalla radice del gioco)
"""
from PIL import Image

CX, CY, R = 156, 56, 15          # ruota anteriore: centro e raggio nel disegno (geo() della V40: ax 41/156, wy 56, wr 14,4)

src = Image.open('img/v40.png').convert('RGBA')
W, H = src.size

# ruota: disco di raggio R centrato sulla ruota, tutto il resto trasparente
S = 2 * R + 1
wheel = Image.new('RGBA', (S, S), (0, 0, 0, 0))
for y in range(S):
    for x in range(S):
        dx, dy = x - R, y - R
        if dx * dx + dy * dy > (R + 0.4) ** 2:
            continue
        sx, sy = CX + dx, CY + dy
        if 0 <= sx < W and 0 <= sy < H:
            p = src.getpixel((sx, sy))
            # sotto il disegno (oltre il bordo dell'immagine) la gomma continua scura
            wheel.putpixel((x, y), p if p[3] else (12, 13, 17, 255))
        else:
            wheel.putpixel((x, y), (12, 13, 17, 255))
wheel.save('img/v40_wheel.png')

# maschera della vernice: verde-azzurro scuro della carrozzeria
paint = Image.new('RGBA', (W, H), (0, 0, 0, 0))
n = 0
for y in range(H):
    for x in range(W):
        r, g, b, a = src.getpixel((x, y))
        if a and b > r + 8 and g > r + 4 and b < 150 and r + g + b > 60:
            paint.putpixel((x, y), (255, 255, 255, 255)); n += 1
paint.save('img/v40_paint.png')

# luminosità media della vernice (refL nei dati dello sprite)
tot = sum(sum(src.getpixel((x, y))[:3]) / 3 for y in range(H) for x in range(W) if paint.getpixel((x, y))[3])
print(f'ruota {S}x{S}, vernice {n} pixel, refL {tot / max(1, n):.1f}')
