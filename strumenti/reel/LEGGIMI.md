# Reel di presentazione (Instagram, TikTok, Shorts)

Video verticale 9:16 di circa 50 s con il gioco vero: schermata iniziale, editor del personaggio (la coda), prologo,
garage, quattro capitali, polizia, semaforo sul bagnato, officina di Luca, telefono, Supra col turbo. Ogni scritta è in
inglese con la traduzione italiana. Il suono dei motori è quello del gioco (`strumenti/teaser_audio.mjs`), sotto c'è
`audio/redline_at_midnight.mp3` (da controllare i diritti: vedi `LICENZE.md`). Niente nomi o profili nel video.

Serve Node con Playwright (Chromium) e `ffmpeg`. Dalla radice del repository, con `OUT` una cartella fuori dal repository:

```bash
node strumenti/reel/riprese.js OUT/riprese          # ~20 minuti: registra le riprese di strada (SHOTS in testa al file)
node strumenti/teaser_audio.mjs OUT/riprese         # il suono dei motori, uno per ripresa
node strumenti/reel/fermi.js OUT/fermi              # titolo, editor col codino, prologo, garage (e `prova.js` per l'officina: vedi sotto)
node strumenti/prova.js --vista 1920x1080 --out OUT/fermi soldi:50000 tappa:shop entra aspetta:1500 foto:officina
node strumenti/reel/cartelli.js OUT/cartelli        # le scritte in PNG trasparente (testi in CARDS)
python3 strumenti/reel/monta.py OUT                 # monta OUT/night_run_reel.mp4 (SEG in monta.py: ordine e durate)
```

Per rifarlo dopo un cambio del gioco basta rilanciare i passi che servono. `PROVA=1` nelle riprese fa un fotogramma
per ripresa (controllo veloce); `SOLO=02_roma` ne rifà una sola. Prima di ogni ripresa si mette la leva in D (dopo il
prologo è in P e l'auto non si muoverebbe). I video non vanno nel repository.
