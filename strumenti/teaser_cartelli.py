# Scritte del video teaser (PNG trasparenti) per 16:9 e 9:16, coi caratteri del gioco.
# Uso: python3 strumenti/teaser_cartelli.py CARTELLA/cartelli CARTELLA_CARATTERI
#   CARTELLA_CARATTERI deve contenere RussoOne.ttf, BarlowSemiCondensed.ttf, ShareTechMono.ttf (Google Fonts, OFL).
# Per cambiare nome del gioco, frasi o anno basta cambiare i testi qui sotto e rifare il montaggio.
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
D = sys.argv[1]; F = sys.argv[2]
RUSSO, BARLOW, MONO = F + '/RussoOne.ttf', F + '/BarlowSemiCondensed.ttf', F + '/ShareTechMono.ttf'
AMBER, WHITE = (255, 179, 71), (255, 255, 255)
# le frasi sulle riprese (a sulla partenza, b sulla città, c sul posto di blocco, d sul mare): tempi in teaser_monta.sh
FRASI = [('a', 'ACCENDI IL MOTORE'), ('b', 'GUIDA DI NOTTE'), ('c', 'ATTENTO AI POSTI DI BLOCCO'), ('d', 'DA TOKYO ALLA COSTIERA')]

def glowtext(img, parts, font, cy, glow=(255, 150, 60), spacing=0, gr=18, ga=170):
    """parts: [(testo, colore)] su una riga, centrata in orizzontale a cy"""
    d = ImageDraw.Draw(img)
    ws = [d.textlength(t, font=font) + spacing * len(t) for t, _ in parts]
    x = (img.width - sum(ws)) / 2
    asc, desc = font.getmetrics(); y = cy - (asc + desc) / 2
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0)); ld = ImageDraw.Draw(layer)
    xx = x
    for (t, c), w in zip(parts, ws):
        for ch in t:
            ld.text((xx, y), ch, font=font, fill=glow + (ga,)); xx += d.textlength(ch, font=font) + spacing
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(gr)))
    xx = x
    for (t, c), w in zip(parts, ws):
        for ch in t:
            d.text((xx + 4, y + 4), ch, font=font, fill=(20, 12, 30, 200)); xx += d.textlength(ch, font=font) + spacing
    xx = x
    for (t, c), w in zip(parts, ws):
        for ch in t:
            d.text((xx, y), ch, font=font, fill=c + (255,)); xx += d.textlength(ch, font=font) + spacing

def card(name, W, H, rows):
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for r in rows: glowtext(img, **r)
    img.save(f'{D}/{name}.png')

for fmt, W, H, k, yA, yE in [('16x9', 1920, 1080, 1.0, 0.16, 0.42), ('9x16', 1080, 1920, 0.82, 0.78, 0.22)]:
    sub = ImageFont.truetype(BARLOW, int(66 * k))
    for nome, testo in FRASI: card(f'{nome}_{fmt}', W, H, [dict(parts=[(testo, WHITE)], font=sub, cy=H * yA, spacing=int(10 * k), gr=14, ga=120)])
    logo = ImageFont.truetype(RUSSO, int(190 * k)); s2 = ImageFont.truetype(BARLOW, int(64 * k)); s3 = ImageFont.truetype(MONO, int(44 * k))
    card(f'fine_{fmt}', W, H, [
        dict(parts=[('NIGHT ', WHITE), ('RUN', AMBER)], font=logo, cy=H * yE, spacing=int(6 * k), gr=30, ga=200),
        dict(parts=[('IN ARRIVO NEL 2027', WHITE)], font=s2, cy=H * yE + 175 * k, spacing=int(12 * k), gr=12, ga=90),
    ])
    card(f'stay_{fmt}', W, H, [dict(parts=[('STAY TUNED', AMBER)], font=s3, cy=H * yE + 265 * k, spacing=int(16 * k), gr=10, ga=140)])
print('ok')
