#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Night Run · i campioni audio dei pezzi del motore, fatti a codice (nessuna registrazione presa da altri, niente mod).

Ogni componente ha la sua cartella: audio/campioni/<componente>/<kit>/
  - colpi singoli: 1.wav, 2.wav... (nella valvola vanno dal soffio leggero al più forte: il gioco sceglie con la pressione)
  - anelli che girano senza fine (turbo, compressore, urlo della wastegate, cambio): loop.wav, intonati sui giri dal gioco
  - gruppi in più con un nome: chatter1.wav, innesto1.wav, aria1.wav...
Nomi, prezzi, a cosa servono e quando suonano stanno in campioni.js (CMP_KIT): qui c'è solo come si fanno.
Chi vuole metterci una registrazione sua: stesso nome e stessa cartella (WAV), poi alza CMP_VER in campioni.js.

Uso:  python3 strumenti/campioni_pezzi.py                  # rifà tutto
      python3 strumenti/campioni_pezzi.py valvola/stututu  # un kit solo (o un componente intero: valvola)
      python3 strumenti/campioni_pezzi.py --grafici /tmp/g # in più uno spettrogramma PNG per file, per guardarli
Tutto è deterministico (semi fissi): rifacendolo escono gli stessi file.
Servono numpy e scipy (per i grafici matplotlib). Mono, 16 bit, 32 kHz.
"""
import argparse
import os
import sys
import wave

import numpy as np
import scipy.signal as sg

SR = 32000
TAU = 2 * np.pi
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
OUT = os.path.join(ROOT, 'audio', 'campioni')


# ---------------------------------------------------------------------------------------------------- attrezzi
def R(seed):
    return np.random.default_rng(seed)


def nlen(sec):
    return max(1, int(round(sec * SR)))


def ts(n):
    return np.arange(n) / SR


def _sos(kind, f, order):
    if np.ndim(f):
        f = [min(max(10.0, x), SR * 0.45) for x in f]
    else:
        f = min(max(10.0, f), SR * 0.45)
    return sg.butter(order, f, btype=kind, fs=SR, output='sos')


def lp(x, f, o=2):
    return sg.sosfilt(_sos('lowpass', f, o), x)


def hp(x, f, o=2):
    return sg.sosfilt(_sos('highpass', f, o), x)


def reson(x, f, q):
    """passa banda risonante (RBJ, 0 dB al centro)"""
    f = min(max(20.0, f), SR * 0.45)
    w = TAU * f / SR
    al, c = np.sin(w) / (2 * q), np.cos(w)
    b = np.array([al, 0.0, -al])
    a = np.array([1 + al, -2 * c, 1 - al])
    return sg.lfilter(b / a[0], a / a[0], x)


def norm(x, p=1.0):
    m = np.max(np.abs(x))
    return x * (p / m) if m > 1e-12 else x


def smooth(n, fc, seed):
    """rumore lento (turbolenza, deriva), circa tra -1 e 1"""
    r = R(seed).standard_normal(n + 4000)
    y = lp(r, fc, 2)[4000:]
    return y / (np.std(y) * 2.5 + 1e-12)


def tone(freq):
    """seno con la frequenza che cambia campione per campione (freq: Hz, scalare o vettore)"""
    return np.sin(TAU * np.cumsum(freq) / SR)


def fade(x, a=0.0015, b=0.012):
    """niente click all'inizio e alla fine"""
    x = np.array(x, dtype=float)
    n = len(x)
    na, nb = min(n, nlen(a)), min(n, nlen(b))
    if na > 1:
        x[:na] *= np.linspace(0, 1, na)
    if nb > 1:
        x[-nb:] *= np.linspace(1, 0, nb)
    return x


def sat(x, k):
    """saturazione morbida: picchi smussati, suono più "sporco" (k 1-4)"""
    return np.tanh(x * k) / np.tanh(k)


def lbump(f, fc, w):
    """campana larga w ottave intorno a fc"""
    return np.exp(-0.5 * ((np.log2(np.maximum(f, 20.0)) - np.log2(np.maximum(fc, 20.0))) / w) ** 2)


def painted(n, shape, seed, nfft=1024, hop=256):
    """rumore "dipinto" nello spettro: shape(f[F,1], t[1,T]) dà il guadagno di ogni frequenza a ogni istante"""
    x = R(seed).standard_normal(n + nfft)
    f, t, Z = sg.stft(x, fs=SR, nperseg=nfft, noverlap=nfft - hop)
    M = shape(f[:, None], t[None, :])
    _, y = sg.istft(Z * M, fs=SR, nperseg=nfft, noverlap=nfft - hop)
    y = y[:n]
    return np.pad(y, (0, max(0, n - len(y))))


def pnoise(N, mag, seed):
    """rumore periodico lungo N campioni (fatto nello spettro: l'anello si richiude senza giunte)"""
    F = np.fft.rfftfreq(N, 1 / SR)
    X = mag(F) * np.exp(1j * R(seed).random(len(F)) * TAU)
    X[0] = 0
    y = np.fft.irfft(X, N)
    return y / (np.std(y) + 1e-12)


def add(out, seg, i0):
    """somma seg dentro out da i0 (tagliando quello che esce)"""
    if i0 >= len(out):
        return
    j = min(len(out), i0 + len(seg))
    out[i0:j] += seg[:j - i0]


def onsets(rate, phase0=0.97):
    """istanti (indici) dei colpi per un ritmo che cambia (colpi al secondo, vettore)"""
    ph = phase0 + np.cumsum(rate) / SR
    return np.nonzero(np.diff(np.floor(ph)) > 0)[0] + 1


# ---------------------------------------------------------------------------------------------------- attrezzi per il «vero»
# (22/11) Prima i corpi dei botti, i fischi e i «tu» erano seni puri: all'orecchio suonavano da sintetizzatore. Qui sotto
# gli attrezzi per fare le stesse cose con l'aria: un tubo che risuona su un colpo di rumore, un fischio che è rumore
# stretto intorno a una nota (e la nota che ondeggia a caso), un po' di spazio intorno.
def tube(x, f1, decay, bright=0.5):
    """tubo di scarico: il colpo rimbalza tra uscita e silenziatore (ritardo con ritorno invertito, risonanze sulle armoniche
    dispari di f1); a ogni giro perde un po' di alti (media di due campioni, più o meno forte con bright)"""
    D = max(2, int(round(SR / (2.0 * f1))))
    g = np.exp(-1.0 / (2.0 * f1 * max(1e-3, decay)))
    a = np.zeros(D + 2)
    a[0] = 1.0
    a[D] = g * bright
    a[D + 1] = g * (1.0 - bright)
    return sg.lfilter([1.0], a, x)


def breath(f, bw, r, n=None):
    """«fischio d'aria»: rumore stretto (largo circa 2·bw Hz) intorno alla frequenza f, che può cambiare nel tempo.
    Rumore lento moltiplicato per un seno e un coseno (in quadratura: niente battimenti), cioè una nota soffiata"""
    f = np.asarray(f, dtype=float)
    n = len(f) if f.ndim else n
    if not f.ndim:
        f = np.full(n, float(f))
    ph = TAU * np.cumsum(f) / SR
    a = lp(r.standard_normal(n + 2000), bw, 2)[2000:]
    b = lp(r.standard_normal(n + 2000), bw, 2)[2000:]
    y = a * np.sin(ph) + b * np.cos(ph)
    return y / (np.std(y) * 1.4 + 1e-12)


def spazio(x, seed, rt=0.08, g=0.16, lpf=3800):
    """un po' di spazio intorno: asfalto, carrozzeria e muri vicini (riflessi radi, poi una coda fitta e cupa).
    Corto apposta: il riverbero dell'ambiente (strada, città, galleria) lo mette già il gioco"""
    r = R(seed)
    L = nlen(rt * 1.6)
    t = ts(L)
    ir = r.standard_normal(L) * np.exp(-t * 6.9 / rt) * np.minimum(1, t / 0.006)
    for ms, a in ((3.1, 0.5), (5.3, 0.35), (8.9, 0.28), (13.7, 0.2)):
        i = nlen(ms / 1000)
        if i < L:
            ir[i] += a * (1 if r.random() < 0.5 else -1) * np.sqrt(L / 400)
    ir = lp(ir, lpf, 2)
    ir /= np.sqrt(np.sum(ir ** 2)) + 1e-12
    c = sg.fftconvolve(x, ir)
    y = np.concatenate([x, np.zeros(len(c) - len(x))])
    y += g * c
    return y


# ---------------------------------------------------------------------------------------------------- valvola: sfiato
def bov(I, seed, p):
    """valvola che sfiata in aria: scatto, getto che si spegne con la pressione, sibilo, fischio della turbina che rallenta"""
    r = R(seed)
    dur = p['len'] * (0.55 + 0.45 * I) * (0.94 + 0.12 * r.random())
    n = nlen(dur + 0.3)
    t = ts(n)
    tau = p['tau'] * (0.65 + 0.35 * I) * (0.92 + 0.16 * r.random())
    t0 = p.get('t0', 0.0015)                           # v0.106: la valvola si apre di scatto (prima 4 ms, un po' molle)
    P = np.where(t < t0, t / t0, np.exp(-(t - t0) / tau))
    if p.get('two'):                                   # doppio pistone: un colpo corto, un attimo di vuoto, poi il getto pieno
        t2 = p['two'] * (0.85 + 0.3 * r.random())
        P1 = np.where(t < t0, t / t0, np.exp(-(t - t0) / 0.014)) * 0.85
        P2 = np.where(t < t2, 0.0, np.minimum(1, (t - t2) / 0.004) * np.exp(-np.maximum(0, t - t2 - 0.004) / tau))
        P = np.maximum(P1, P2)
    fhi = p['fhi'] * (0.9 + 0.15 * I)
    flo = p['flo']

    def shape(f, tt):
        Pt = np.interp(tt, t, P)
        fc = flo + (fhi - flo) * Pt ** 0.6
        body = lbump(f, fc, p['w']) * Pt ** p.get('eb', 1.0)
        hiss = lbump(f, p['hissf'], 0.55) * Pt ** p.get('eh', 1.8) * p['hiss']
        low = lbump(f, p['lowf'], 0.7) * Pt ** 1.1 * p['low']
        return body + hiss + low

    x = norm(painted(n, shape, seed))
    x *= 1 + p['turb'] * smooth(n, 22, seed + 1)       # turbolenza: il getto non è mai liscio
    y = x
    click = hp(r.standard_normal(n), p.get('clickf', 3000)) * np.exp(-t / p.get('clickt', 0.0006))   # scatto secco e chiaro
    y = y + p['click'] * norm(click)
    if p.get('burst'):                                 # v0.106: lo «schiaffo» d'aria dei primi millisecondi, quando la valvola si apre
        bu = hp(r.standard_normal(n), 1600) * np.exp(-t / 0.008) * np.minimum(1, t / 0.0005)
        y = y + p['burst'] * norm(bu) * (0.7 + 0.3 * I)
    if p.get('ring'):                                  # pistone di metallo che batte
        ring = reson(r.standard_normal(n) * np.exp(-t / 0.001), p['ring'], 16) * np.exp(-t / 0.025)
        y = y + 0.45 * p['click'] * norm(ring)
        if p.get('two'):
            i2 = nlen(t2)
            y[i2:] += 0.3 * p['click'] * norm(ring)[:n - i2]
    if p.get('chirp'):                                 # trombetta: un sibilo intonato che scende
        fch = p['cf1'] + (p['cf0'] - p['cf1']) * np.exp(-t / p['ct'])
        fch = fch * (1 + 0.012 * smooth(n, 30, seed + 2))
        ech = np.minimum(1, t / 0.008) * np.exp(-t / (p['ct'] * 1.4))
        nota = 0.35 * (tone(fch) + 0.18 * tone(2 * fch)) + breath(fch, 45 + 25 * r.random(), r)   # fischio soffiato, non un seno
        y = y + p['chirp'] * (0.6 + 0.4 * I) * ech * nota
    if p.get('spool'):                                 # la turbina ancora lanciata che rallenta
        # «fiuuu»: la girante, scarica, cala di giri per quasi un secondo; tono pulito con un filo d'aria intorno
        fs = p['spool'] * (0.5 + 0.5 * np.exp(-t / p.get('spool_t', 0.6)))
        env = np.exp(-t / p.get('spool_d', 0.35)) * np.minimum(1, t / 0.02)
        y = y + p.get('spool_g', 0.04) * env * (tone(fs) + 0.12 * tone(2 * fs) + 0.35 * breath(fs, 60, r))
    if p.get('lp'):
        y = lp(y, p['lp'], 2)
    return fade(trim(y), 0.0004, 0.06) * (0.5 + 0.5 * I)


# ---------------------------------------------------------------------------------------------------- valvola: pompaggio
def flutter(I, seed, p):
    """niente valvola (o una che chiude male): il compressore pompa a colpi, "stu-tu-tu", sempre più lenti"""
    r = R(seed)
    dur = p['len'] * (0.6 + 0.4 * I) * (0.93 + 0.14 * r.random())
    n = nlen(dur + 0.2)
    t = ts(n)
    out = np.zeros(n)
    u = np.clip(t / dur, 0, 1)
    rate = p['r1'] + (p['r0'] - p['r1']) * (1 - u) ** p.get('rk', 1.3)
    if p.get('wob'):
        rate = rate * (1 + p['wob'] * np.sin(TAU * 2.7 * t + r.random() * 6))
    rate = rate * (1 + 0.06 * smooth(n, 12, seed + 7))
    tau = dur * p.get('dk', 0.45)
    fw0 = p['fw'] * (0.95 + 0.1 * r.random())
    L = nlen(0.1)
    tt = ts(L)
    for k, i0 in enumerate(onsets(rate)):
        tk = i0 / SR
        if tk > dur:
            break
        a = np.exp(-tk / tau) * (0.72 + 0.28 * r.random())
        if k == 0:
            a *= p.get('first', 1.0)
        pd = p['pd'] * (0.85 + 0.3 * r.random())
        e = np.minimum(1, tt / 0.0025) * np.exp(-tt / pd)
        puff = norm(reson(r.standard_normal(L), p['fp'] * (0.9 + 0.2 * r.random()) * (1 - 0.25 * tk / dur), p.get('fq', 1.4)))
        ftu = p['tu'] * (1 - 0.2 * tk / dur) * (1 - 0.18 * np.minimum(1, tt / pd)) * (0.96 + 0.08 * r.random())
        colpo = r.standard_normal(L) * np.exp(-tt / (pd * 0.35))
        tu = 0.3 * tone(ftu) * np.exp(-tt / (pd * 0.8)) + norm(reson(colpo, ftu[0], 5.5)) * np.exp(-tt / (pd * 0.9))
        fw = fw0 * (1 - 0.32 * tk / dur) * (1 + 0.07 * e)
        fischio = tone(fw)
        seg = a * e * (p['gp'] * puff + p['gt'] * tu) + a * p['gw'] * e * fischio
        add(out, seg, i0)
    if p.get('s'):                                     # la "s" iniziale: un soffio corto prima dei colpi
        s = hp(r.standard_normal(n), 2500) * np.exp(-t / 0.03) * np.minimum(1, t / 0.003)
        out += p['s'] * norm(s)
    air = lp(r.standard_normal(n), 1800) * np.exp(-t / (dur * 0.5))
    out += p.get('air', 0.05) * norm(air)
    if p.get('lp'):
        out = lp(out, p['lp'], 2)
    return fade(trim(out), 0.0004, 0.05) * (0.5 + 0.5 * I)


def mezzo(I, seed, p):
    """valvola che sfiata a metà: pssh corto e poi la coda a colpi"""
    a = bov(I * 0.75, seed, p['bov'])
    b = flutter(I, seed + 50, p['flu'])
    out = np.zeros(max(len(a), nlen(p['dt']) + len(b)))
    add(out, a * 0.85, 0)
    add(out, b, nlen(p['dt']))
    return out


# ---------------------------------------------------------------------------------------------------- anelli
LOOP = 2.0          # secondi: tutte le frequenze fanno cicli interi, l'anello si richiude da solo


def _f(f):
    return round(f * LOOP) / LOOP


def turbo_loop(seed, p):
    """fischio della girante (v0.142): non più un seno con un po' d'aria sotto, ma aria stretta intorno alla nota delle pale
    con le bande laterali dell'albero (la nota «rolla»), un'ottava sopra più leggera, il corpo grave dell'aria in pressione
    e il soffio. Tutto rumore periodico: l'anello si richiude da solo. p: f nota, bw larghezza della nota (ottave), sb bande
    laterali, tone quanto seno puro resta, oct ottava, corpo/cf corpo grave, air/af soffio, pale (11)"""
    N = nlen(LOOP)
    t = ts(N)
    fb = _f(p['f'])
    fs = _f(fb / p.get('pale', 11))
    bw = p.get('bw', 0.03)
    nota = pnoise(N, lambda F: lbump(F, fb, bw) + p.get('sb', 0.45) * (lbump(F, fb + fs, bw * 0.8) + lbump(F, fb - fs, bw * 0.8)), seed)
    pm = p.get('vib', 0.5) * np.sin(TAU * _f(2.5) * t + 1.3) + 0.25 * np.sin(TAU * _f(6.5) * t)
    seno = np.sin(TAU * fb * t + pm) * (1 + 0.3 * np.sin(TAU * fs * t))
    x = nota + p.get('tone', 0.3) * seno
    for k, g in p.get('parz', []):
        x += g * pnoise(N, lambda F, k=k: lbump(F, _f(fb * k), bw * 1.2), seed + int(k * 10) + 7)
    x += p.get('oct', 0.25) * pnoise(N, lambda F: lbump(F, 2 * fb, bw * 1.4), seed + 3)
    corpo = pnoise(N, lambda F: lbump(F, p.get('cf', 650), 0.9), seed + 1)
    soffio = pnoise(N, lambda F: lbump(F, p.get('af', fb * 0.35), 1.0), seed + 2)
    am = 1 + 0.06 * np.sin(TAU * _f(1.5) * t) + 0.04 * np.sin(TAU * _f(4.0) * t + 2)
    y = (x + p.get('corpo', 0.35) * corpo + p.get('air', 0.3) * soffio) * am
    return norm(lp(y, p.get('lp', 9000), 2), 0.7)


def sc_loop(seed, p):
    """compressore: il fischio dei rotori (ricco di armoniche, legato ai giri) più aria e sibilo"""
    N = nlen(LOOP)
    t = ts(N)
    f0 = _f(p['f'])
    x = np.zeros(N)
    # v0.142: ogni armonica metà nota e metà aria stretta intorno (prima seni puri: suonava da sintetizzatore)
    for h, g in enumerate(p['harm'], start=1):
        if f0 * h > SR * 0.45:
            break
        x += g * (0.5 * np.sin(TAU * f0 * h * t + h * 0.9) + 0.6 * pnoise(N, lambda F, h=h: lbump(F, f0 * h, 0.02 + 0.006 * h), seed + 20 + h))
    if p.get('siren'):
        x += p['siren'] * np.sin(TAU * _f(f0 * 1.5) * t + 0.4)
    if p.get('am'):
        x *= 1 + p['am'] * np.sin(TAU * _f(p['am_f']) * t)
    air = pnoise(N, lambda F: lbump(F, f0, 0.25), seed)
    hiss = pnoise(N, lambda F: lbump(F, p.get('hf', 6000), 0.8), seed + 1)
    y = x + p.get('air', 0.3) * air + p.get('hiss', 0.1) * hiss
    return norm(y, 0.7)


def scream_loop(seed, p):
    """urlo della wastegate libera: colpi di gas senza silenziatore, filtrati dal tubo e saturati"""
    r = R(seed)
    N = nlen(LOOP)
    x = np.zeros(N)
    Np = int(round(p['fr'] * LOOP))
    for k in range(Np):
        i0 = int(k * N / Np + r.normal(0, 0.03 * N / Np)) % N
        Lb = nlen(0.004 + 0.003 * r.random())
        b = r.standard_normal(Lb) * np.exp(-np.arange(Lb) / (Lb * 0.3)) * (0.6 + 0.4 * r.random())
        x[(i0 + np.arange(Lb)) % N] += b
    F = np.fft.rfftfreq(N, 1 / SR)
    H = sum(g * lbump(F, f, w) for f, w, g in p['form'])
    y = np.fft.irfft(np.fft.rfft(x) * H, N)
    y = sat(norm(y), p.get('drive', 2.5))
    return norm(y, 0.7)


def gear_loop(seed, p):
    """denti dritti: fischio dell'ingranamento con le armoniche e le bande laterali dell'albero"""
    N = nlen(LOOP)
    t = ts(N)
    fm, fs = _f(p['f']), _f(p['fs'])
    # v0.142: la nota dei denti con aria stretta intorno e un po' meno armoniche pure (prima tre seni: un fischio elettronico)
    def nn(k, w):
        return pnoise(N, lambda F: lbump(F, fm * k, w), seed + 30 + k)
    x = (0.55 * np.sin(TAU * fm * t) + 0.7 * nn(1, 0.018)) + p.get('h2', 0.35) * (0.4 * np.sin(TAU * 2 * fm * t + 0.5) + 0.6 * nn(2, 0.02)) + p.get('h3', 0.12) * nn(3, 0.025)
    x *= 1 + p.get('am', 0.25) * np.sin(TAU * fs * t)
    if p.get('am2'):
        x *= 1 + p['am2'] * np.sin(TAU * 2 * fs * t + 0.8)
    y = x + p.get('nz', 0.15) * pnoise(N, lambda F: lbump(F, fm, 0.15), seed)
    return norm(y, 0.7)


# ---------------------------------------------------------------------------------------------------- scarico: scoppi
def pop(r, p, a=1.0, big=False):
    """un colpo nello scarico: schiocco e rumore medio saturati (la "voce" del botto), poi il tubo che risuona sui suoi
    modi e il colpo sordo, puliti (se si saturano anche quelli la coda si gonfia e il botto diventa un rimbombo lungo)"""
    L = nlen(0.4 if big else 0.22)
    t = ts(L)
    kb = 1.55 if big else 1.0
    crack = norm(hp(r.standard_normal(L), p.get('crf', 1200)) * np.exp(-t / (p.get('crt', 0.0035) * kb)))
    mid = norm(reson(r.standard_normal(L), p.get('mf', 600) * (0.85 + 0.3 * r.random()), 1.2)) * np.exp(-t / (p.get('mt', 0.02) * kb))
    bark = sat((p.get('gc', 0.8) * crack + p.get('gm', 0.5) * mid) * p.get('drive', 1.8) * (1.3 if big else 1.0), 1.0)
    f1 = p['f1'] * (0.9 + 0.2 * r.random()) * (0.85 if big else 1)
    # il tubo: lo stesso fronte di pressione che rimbalza dentro lo scarico (prima erano quattro seni puri: «da tastiera»).
    # Eccitazione larga e brevissima, il tubo ci mette le sue risonanze; gas più caldo nel botto grosso = tubo un po' più alto
    exc = lp(r.standard_normal(L), min(9000, f1 * 40), 2) * np.exp(-t / (0.0035 * kb)) * np.minimum(1, t / 0.0004)
    body = tube(exc, f1 * (1 + 0.06 * r.standard_normal()), p.get('bt', 0.05) * kb * 0.6, bright=0.35 + 0.3 * r.random())
    body = norm(lp(body, min(8000, f1 * 12), 3))           # il silenziatore e la lana di roccia si mangiano gli alti della coda
    # il colpo sordo: aria spostata (rumore cupo con una risonanza larga che scende un po'), non un seno da cassa
    tf = p.get('tf', 55) * (0.92 + 0.16 * r.random())
    tenv = np.exp(-t / (p.get('tt', 0.05) * kb)) * np.minimum(1, t / 0.0015)
    th1 = norm(lp(r.standard_normal(L), tf * 2.6, 4)) * tenv
    th2 = norm(reson(r.standard_normal(L) * np.exp(-t / 0.004), tf * 1.15, 2.2)) * tenv
    thump = norm(th1 + 0.8 * th2)
    y = bark + p.get('gb', 0.7) * 0.8 * body + p.get('gt', 0.6) * 1.6 * thump
    if p.get('metal'):                                            # titanio, tubi sottili: un tintinnio sopra
        for f, q, g in p['metal']:
            y += g * norm(reson(r.standard_normal(L) * np.exp(-t / 0.0008), f * (0.96 + 0.08 * r.random()), q)) * np.exp(-t / 0.03)
    y = sat(y, 1.2)
    return fade(y, 0.0002, 0.02) * a * (1.25 if big else 1.0)


def slap(x, ms=11, g=0.28):
    """riflesso dell'asfalto e dei muri vicini: una copia ritardata e più cupa"""
    d = nlen(ms / 1000)
    y = np.concatenate([x, np.zeros(d)])
    y[d:] += g * lp(x, 2500)
    return y


def burble(seed, p):
    """borbottio in rilascio: colpi irregolari a raffiche ("brrr-ap"), il silenziatore si mangia gli alti"""
    r = R(seed)
    dur = p['len'] * (0.7 + 0.6 * r.random())
    out = np.zeros(nlen(dur + 0.5))
    t = 0.004
    while t < dur:
        nk = 1 + int(r.random() ** 0.8 * p.get('kmax', 5))
        a0 = (0.5 + 0.5 * r.random()) * np.exp(-t / (dur * 0.8))
        tt = t
        for k in range(nk):
            pp = pop(r, p, a=a0 * (0.82 ** k) * (0.7 + 0.5 * r.random()), big=r.random() < p.get('pbig', 0.05))
            add(out, pp, nlen(tt))
            tt += (1 / p['rate']) * (0.6 + 0.8 * r.random())
        t = tt + p.get('gap', 0.06) * (0.3 + 1.4 * r.random())
    out = spazio(out, seed + 11, rt=0.07, g=0.14)
    out = lp(out, p.get('lp', 2500), 2)
    return fade(trim(out), 0.0005, 0.05)


def bang(seed, p):
    """un botto (o un "pa-BAM" doppio): pop & bang, limitatore a taglio d'accensione, 2-step"""
    r = R(seed)
    out = np.zeros(nlen(0.9))
    n = 1
    if r.random() < p.get('pdouble', 0.0):
        n = 2
    if p.get('seq'):
        n = p['seq'][0] + int(r.random() * (p['seq'][1] - p['seq'][0] + 1))
    t = 0.004
    for k in range(n):
        big = k == n - 1 or r.random() < 0.4
        a = (0.55 if (n > 1 and k < n - 1 and not p.get('seq')) else 1.0) * (0.75 + 0.25 * r.random())
        add(out, pop(r, p, a=a, big=big), nlen(t))
        t += p.get('dt', 0.035) * (0.75 + 0.5 * r.random())
    if p.get('tail'):                                         # crepitio che resta dopo il botto
        tt = t + 0.03
        for k in range(int(p['tail'] * (0.6 + 0.8 * r.random()))):
            add(out, pop(r, dict(p, f1=p['f1'] * 1.5, crt=0.0015, bt=0.02), a=0.18 + 0.15 * r.random()), nlen(tt))
            tt += 0.018 + 0.03 * r.random()
    out = slap(out, ms=p.get('slap', 11), g=p.get('slapg', 0.28))
    out = spazio(out, seed + 11, rt=0.1, g=0.18)
    if p.get('lp'):
        out = lp(out, p['lp'], 2)
    return fade(trim(out), 0.0003, 0.04)


def series(seed, p):
    """raffica regolare o caotica: mitragliatrice, capodanno, crackle"""
    r = R(seed)
    dur = p['len'] * (0.8 + 0.4 * r.random())
    out = np.zeros(nlen(dur + 0.5))
    t = 0.004
    k = 0
    while t < dur:
        big = r.random() < p.get('pbig', 0.2)
        a = (p.get('a0', 1.0) * np.exp(-t / (dur * p.get('dk', 1.5)))) * (0.65 + 0.35 * r.random())
        if p.get('chaos'):
            a *= 0.35 + 0.65 * r.random() ** 0.7
        add(out, pop(r, p, a=a, big=big), nlen(t))
        jit = p.get('jit', 0.15)
        t += (1 / p['rate']) * (1 - jit + 2 * jit * r.random())
        k += 1
    out = slap(out, ms=p.get('slap', 11), g=p.get('slapg', 0.22))
    out = spazio(out, seed + 11, rt=0.09, g=0.16)
    if p.get('lp'):
        out = lp(out, p['lp'], 2)
    return fade(trim(out), 0.0003, 0.04)


def antilag(seed, p):
    """anti-lag da rally: botti con la turbina che resta lanciata (soffio) e un tintinnio di collettore rovente"""
    r = R(seed)
    dur = p['len'] * (0.8 + 0.4 * r.random())
    n = nlen(dur + 0.6)
    t = ts(n)
    out = np.zeros(n)
    tb = 0.004
    while tb < dur:
        big = r.random() < 0.55
        add(out, pop(r, p, a=(0.7 + 0.3 * r.random()) * (1.0 if big else 0.6), big=big), nlen(tb))
        if r.random() < 0.35:                                     # "pa-BANG"
            add(out, pop(r, p, a=0.45, big=False), nlen(tb + 0.022 + 0.02 * r.random()))
        tb += 0.06 + 0.17 * r.random()

    def shape(f, tt):
        e = np.minimum(1, tt / 0.05) * np.exp(-tt / (dur * 0.9))
        return (lbump(f, 3200, 0.8) + 0.6 * lbump(f, 900, 0.9)) * e

    air = norm(painted(n, shape, seed + 9)) * (1 + 0.3 * smooth(n, 14, seed + 4))
    fw = 5200 * (0.75 + 0.25 * np.exp(-t / 0.7))
    whine = (0.35 * tone(fw) + breath(fw, 60, r)) * np.exp(-t / (dur * 0.8)) * np.minimum(1, t / 0.03)
    out = out + 0.22 * air + 0.05 * whine
    out = slap(out, 9, 0.3)
    out = spazio(out, seed + 11, rt=0.1, g=0.18)
    return fade(trim(out), 0.0003, 0.06)


def trim(x, thr=1e-4):
    """toglie il silenzio in coda"""
    idx = np.nonzero(np.abs(x) > thr * np.max(np.abs(x)))[0]
    if not len(idx):
        return x
    return x[:min(len(x), idx[-1] + nlen(0.02))]


# ---------------------------------------------------------------------------------------------------- altri colpi
def chatter(I, seed, p):
    """wastegate che sbatte in rilascio: tic metallici in fila che rallentano, con un filo d'aria"""
    r = R(seed)
    dur = p['len'] * (0.6 + 0.4 * I)
    n = nlen(dur + 0.12)
    t = ts(n)
    out = np.zeros(n)
    rate = p['r1'] + (p['r0'] - p['r1']) * (1 - np.clip(t / dur, 0, 1))
    L = nlen(0.06)
    tt = ts(L)
    for i0 in onsets(rate):
        tk = i0 / SR
        if tk > dur:
            break
        a = np.exp(-tk / (dur * 0.5)) * (0.6 + 0.4 * r.random())
        exc = r.standard_normal(L) * np.exp(-tt / 0.0007)
        ring = norm(sum(g * reson(exc, f * (0.97 + 0.06 * r.random()), q) for f, q, g in p['modes'])) * np.exp(-tt / 0.02)
        puff = norm(lp(r.standard_normal(L), 1500)) * np.exp(-tt / 0.012) * 0.3
        add(out, a * (ring + puff), i0)
    return fade(out, 0.0003, 0.02) * (0.55 + 0.45 * I)


def gulp(I, seed, p):
    """aspirazione che ingoia aria quando spalanchi il gas: risucchio, colpo d'aria basso, ruggito dei cornetti"""
    r = R(seed)
    dur = p['len'] * (0.7 + 0.3 * I)
    n = nlen(dur + 0.15)
    t = ts(n)
    e = np.minimum(1, t / p.get('att', 0.012)) * np.exp(-t / (dur * 0.35))

    def shape(f, tt):
        et = np.interp(tt, t, e)
        fc = p['fn1'] + (p['fn0'] - p['fn1']) * np.exp(-tt / (dur * 0.25))
        return lbump(f, fc, p.get('w', 0.9)) * et

    x = norm(painted(n, shape, seed))
    fh = p['fh'] * (0.75 + 0.25 * np.exp(-t / 0.05))
    h = (0.35 * tone(fh) + norm(reson(r.standard_normal(n) * np.exp(-t / 0.01), p['fh'] * 0.9, 2.5))) * np.minimum(1, t / 0.006) * np.exp(-t / p.get('ht', 0.08))
    y = p.get('gn', 1.0) * x + p.get('gh', 0.6) * h
    if p.get('honk'):
        fz = p['honk'] * (1 + 0.08 * np.exp(-t / 0.04))
        pulse = np.maximum(0, np.sin(TAU * np.cumsum(fz) / SR)) ** 3
        src = pulse * (1 + 0.4 * r.standard_normal(n))
        hk = norm(reson(src, p['hf1'], 4) + 0.6 * reson(src, p['hf2'], 5))
        y = y + p.get('gk', 0.8) * hk * e
    y = sat(y, 1.5)
    return fade(y, 0.0008, 0.03) * (0.55 + 0.45 * I)


def clack(I, seed, p):
    """innesto del cambio a innesti frontali: due colpi metallici ravvicinati, risonanza della scatola, tonfo"""
    r = R(seed)
    n = nlen(0.28)
    out = np.zeros(n)
    for dt_, a in [(0.0, 1.0), (p.get('d2', 0.007) * (0.8 + 0.4 * r.random()), 0.6)]:
        i0 = nlen(dt_) if dt_ else 0
        L = n - i0
        tt = ts(L)
        exc = r.standard_normal(L) * np.exp(-tt / 0.0006)
        ring = norm(sum(g * reson(exc, f * (0.95 + 0.1 * r.random()), q) for f, q, g in p['modes']))
        thunk = norm(reson(r.standard_normal(L) * np.exp(-tt / 0.002), p.get('tf', 130.0) * (0.93 + 0.14 * r.random()), 3.0)) * np.exp(-tt / 0.02) * 0.45
        add(out, a * (ring + thunk) * np.exp(-tt / p.get('dec', 0.05)), i0)
    return fade(sat(out, 1.3), 0.0002, 0.03) * (0.6 + 0.4 * I)


def aria(I, seed, p):
    """attuatore pneumatico del cambio: "tsk" d'aria corto"""
    r = R(seed)
    dur = p['len'] * (0.8 + 0.4 * r.random())
    n = nlen(dur + 0.05)
    t = ts(n)
    e = np.minimum(1, t / 0.003) * np.exp(-t / (dur * 0.4))

    def shape(f, tt):
        return (lbump(f, 6500, 0.8) + 0.4 * lbump(f, 2500, 0.7)) * np.interp(tt, t, e)

    x = norm(painted(n, shape, seed, nfft=512, hop=128))
    click = norm(reson(r.standard_normal(n) * np.exp(-t / 0.0004), 4200, 10)) * np.exp(-t / 0.006)
    return fade(x + 0.5 * click, 0.0002, 0.01) * (0.6 + 0.4 * I)


def purge(seed, p):
    """spurgo del nitro: tic dell'elettrovalvola e getto lungo, alto e ondeggiante"""
    r = R(seed)
    segs = p['segs'] if 'segs' in p else [(0.0, p['len'])]
    end = max(a + b for a, b in segs)
    n = nlen(end + 0.35)
    t = ts(n)
    e = np.zeros(n)
    y = np.zeros(n)
    for t0, d in segs:
        d = d * (0.9 + 0.2 * r.random())
        u = t - t0
        ek = np.where(u < 0, 0, np.minimum(1, u / 0.035) * np.where(u < d * 0.78, 1, np.exp(-(u - d * 0.78) / (d * 0.12))))
        e = np.maximum(e, ek)
        i0 = nlen(t0)
        click = norm(reson(r.standard_normal(n - i0) * np.exp(-ts(n - i0) / 0.0005), 3800, 8)) * np.exp(-ts(n - i0) / 0.01)
        y[i0:] += 0.7 * click

    def shape(f, tt):
        et = np.interp(tt, t, e)
        return (lbump(f, 6500, 1.1) + 0.5 * lbump(f, 2200, 0.8) + 0.25 * lbump(f, 11000, 0.5)) * et

    x = norm(painted(n, shape, seed)) * (1 + 0.12 * smooth(n, 8, seed + 3))
    return fade(x + y, 0.0003, 0.05)


# ---------------------------------------------------------------------------------------------------- i kit
# Per ogni kit: cosa fare per i file (gruppo → funzione che dà la lista dei suoni). I = intensità dei colpi della valvola.
I4 = [0.45, 0.7, 0.95, 1.2]

BOVP = {
    # v0.106: getti più puliti e nitidi (meno turbolenza e meno grave, sibilo più presente) e la coda della turbina che rallenta
    'ricircolo': dict(len=0.6, burst=0.15,  tau=0.16, fhi=1700, flo=350, w=0.85, hissf=3400, hiss=0.22, lowf=450, low=0.35, turb=0.14, click=0.08, lp=2600, spool=6000, spool_g=0.03, spool_d=0.5),
    'pssh': dict(len=1.0, burst=0.75,  tau=0.3, fhi=4200, flo=1000, w=0.7, hissf=7500, hiss=0.85, eh=1.3, lowf=650, low=0.12, turb=0.08, click=0.45, spool=6800, spool_g=0.06, spool_d=0.6, spool_t=0.7),
    'pssh_grossa': dict(len=1.4, burst=0.7,  tau=0.45, fhi=3200, flo=650, w=0.9, hissf=6500, hiss=0.7, eh=1.4, lowf=380, low=0.4, turb=0.12, click=0.55, spool=5600, spool_g=0.06, spool_d=0.7, spool_t=0.8, eb=0.9),
    'trombetta': dict(len=0.9, burst=0.55,  tau=0.24, fhi=4600, flo=1200, w=0.6, hissf=8200, hiss=0.7, eh=1.4, lowf=700, low=0.1, turb=0.08, click=0.4, chirp=0.5, cf0=3900, cf1=1700, ct=0.11, spool=7200, spool_g=0.05, spool_d=0.55),
    'doppio_pistone': dict(len=0.85, burst=0.6,  tau=0.22, fhi=4300, flo=1050, w=0.7, hissf=7800, hiss=0.8, eh=1.4, lowf=700, low=0.12, turb=0.1, click=0.6, ring=5200, two=0.05, spool=7000, spool_g=0.045, spool_d=0.5),
    'sbuffo': dict(len=1.15, tau=0.36, fhi=1900, flo=450, w=0.9, hissf=4500, hiss=0.25, lowf=320, low=0.8, turb=0.3, click=0.25),
}
FLUP = {
    'stututu': dict(len=0.95, r0=21, r1=9, rk=1.2, pd=0.03, fp=820, fq=1.4, tu=950, fw=5200, gp=0.9, gt=0.55, gw=0.22, s=0.35, air=0.06, dk=0.5),
    'stututu_lungo': dict(len=1.7, r0=18, r1=6, rk=1.5, wob=0.1, pd=0.036, fp=700, fq=1.4, tu=820, fw=4300, gp=0.9, gt=0.6, gw=0.25, s=0.3, air=0.07, dk=0.55),
    'mitraglia': dict(len=0.75, r0=30, r1=17, rk=1.1, pd=0.015, fp=1500, fq=1.8, tu=1500, fw=6200, gp=1.0, gt=0.4, gw=0.18, s=0.25, air=0.05, dk=0.5),
    'gufo': dict(len=1.3, r0=13, r1=5, rk=1.3, pd=0.05, fp=420, fq=2.2, tu=470, fw=3600, gp=0.8, gt=0.9, gw=0.12, s=0.2, air=0.06, dk=0.55, lp=3500),
}

POPS = {
    'borbottio': dict(len=1.0, rate=22, kmax=5, gap=0.07, f1=42, bt=0.05, mf=520, mt=0.022, crf=1500, crt=0.003, tf=58, gc=0.35, gb=0.9, gm=0.6, gt=0.6, drive=1.8, lp=1800, pbig=0.03),
    'cupo': dict(len=1.2, rate=16, kmax=4, gap=0.1, f1=33, bt=0.075, mf=380, mt=0.03, crf=1200, crt=0.003, tf=48, gc=0.2, gb=1.0, gm=0.5, gt=0.9, drive=1.6, lp=1100, pbig=0.06),
    'scoppiettio': dict(len=0.8, rate=34, kmax=6, gap=0.05, f1=55, bt=0.03, mf=900, mt=0.012, crf=2200, crt=0.002, tf=70, gc=0.9, gb=0.5, gm=0.6, gt=0.35, drive=2.2, lp=6000, pbig=0.04),
    'gorgoglio': dict(len=0.9, rate=48, kmax=7, gap=0.05, f1=45, bt=0.035, mf=650, mt=0.015, crf=1600, crt=0.0025, tf=60, gc=0.4, gb=0.8, gm=0.6, gt=0.5, drive=2.0, lp=2600, pbig=0.02),
    'pentola': dict(len=0.9, rate=18, kmax=4, gap=0.08, f1=48, bt=0.06, mf=700, mt=0.025, crf=1400, crt=0.004, tf=55, gc=0.8, gb=1.0, gm=0.8, gt=0.8, drive=3.0, lp=7000, pbig=0.15, metal=[(1850, 12, 0.25), (3300, 16, 0.15)]),
    'titanio': dict(len=0.8, rate=30, kmax=6, gap=0.06, f1=60, bt=0.025, mf=1400, mt=0.01, crf=2800, crt=0.0015, tf=75, gc=1.0, gb=0.35, gm=0.5, gt=0.25, drive=2.0, lp=9000, pbig=0.03, metal=[(3100, 22, 0.35), (4700, 26, 0.25)]),
}
BANGP = {
    # centralina (mappa pop & bang)
    'crackle': dict(len=0.55, rate=42, jit=0.45, f1=65, bt=0.022, mf=1200, mt=0.01, crf=2500, crt=0.0018, tf=72, gc=1.0, gb=0.4, gm=0.5, gt=0.3, drive=2.2, lp=8000, pbig=0.05, a0=0.8, chaos=True, slapg=0.15),
    'pop_bang': dict(f1=40, bt=0.07, mf=550, mt=0.03, crf=1300, crt=0.004, tf=52, gc=1.0, gb=1.0, gm=0.7, gt=1.2, drive=3.0, pdouble=0.4, dt=0.05, tail=3, lp=9000),
    'mitraglia': dict(len=0.6, rate=14, jit=0.06, f1=45, bt=0.05, mf=700, mt=0.02, crf=1500, crt=0.003, tf=55, gc=0.9, gb=0.9, gm=0.7, gt=0.9, drive=2.6, pbig=0.3, a0=1.0, dk=3.0, lp=9000),
    'petardi': dict(len=1.0, rate=16, jit=0.8, f1=52, bt=0.04, mf=900, mt=0.015, crf=2000, crt=0.0025, tf=62, gc=1.0, gb=0.7, gm=0.6, gt=0.6, drive=2.6, pbig=0.35, a0=1.0, dk=2.0, chaos=True, lp=10000),
    'antilag': dict(len=0.9, f1=38, bt=0.08, mf=500, mt=0.035, crf=1100, crt=0.0045, tf=50, gc=1.0, gb=1.0, gm=0.8, gt=1.2, drive=3.2, metal=[(2700, 14, 0.2)]),
    # limitatore, launch, cambiate
    'colpi': dict(f1=44, bt=0.055, mf=620, mt=0.025, crf=1400, crt=0.0035, tf=55, gc=1.0, gb=0.9, gm=0.7, gt=1.0, drive=2.8, pdouble=0.15, dt=0.04, tail=1, lp=9000),
    'due_step': dict(f1=42, bt=0.05, mf=600, mt=0.02, crf=1500, crt=0.003, tf=54, gc=1.0, gb=0.9, gm=0.7, gt=1.0, drive=2.8, seq=(2, 3), dt=0.036, lp=9000),
    'fucilata': dict(f1=70, bt=0.018, mf=1600, mt=0.01, crf=2400, crt=0.0011, tf=85, tt=0.025, gc=1.5, gb=0.4, gm=0.7, gt=0.6, drive=3.6, slap=16, slapg=0.4, lp=12000),
    'stutter': dict(f1=28, bt=0.11, mf=330, mt=0.04, crf=900, crt=0.005, tf=42, gc=0.7, gb=1.2, gm=0.6, gt=1.4, drive=2.6, seq=(1, 2), dt=0.05, lp=5000),
}

KITS = {}

# (22/11) correzione di livello in dB per kit, dopo il rifacimento «meno robotico»: un colpo d'aria si sente più forte di un
# seno basso con lo stesso picco, quindi qui si riporta ogni kit alla sonorità (pesata A) di prima, così i volumi tarati in
# campioni.js (CMP.g) restano giusti. In su i colpi sono già al picco: si alzano con una saturazione morbida (il picco resta
# quello, sale il resto del colpo, come un microfono vicino).
LIVELLO = {
    'aspirazione/airbox': -3.1, 'scarico/borbottio': -2.0, 'scarico/cupo': -5.4, 'scarico/gorgoglio': -0.9,
    'scarico/scoppiettio': -1.1, 'valvola/stututu': -1.1,
    'limitatore/colpi': 3.2, 'limitatore/stutter': 2.4, 'mappa/crackle': 1.3, 'mappa/pop_bang': 2.5,
    'scarico/titanio': 1.6, 'valvola/gufo': 1.3,
    # v0.142: anelli rifatti con l'aria intorno alle note, riportati poco sotto la sonorità di prima
    # (chiave «kit:file» = solo quel file: qui i soli anelli, gli innesti restano com'erano)
    'compressore/volumetrico:loop': 3.0, 'compressore/vite:loop': 2.5, 'compressore/centrifugo:loop': 1.5, 'cambio/denti_dritti:loop': 3.0, 'cambio/sequenziale:loop': 2.5,
}


def kit(kid, sr=SR, **groups):
    """sr: frequenza dei file (i colpi dello scarico non hanno niente sopra i 12 kHz: bastano 24 kHz, file più leggeri)"""
    KITS[kid] = (sr, groups)


for k, p in BOVP.items():
    kit('valvola/' + k, main=lambda s, p=p: [bov(I, s + i, p) for i, I in enumerate(I4)])
for k, p in FLUP.items():
    kit('valvola/' + k, main=lambda s, p=p: [flutter(I, s + i, p) for i, I in enumerate(I4)])
kit('valvola/mezzo', main=lambda s: [mezzo(I, s + i, dict(bov=dict(BOVP['pssh'], len=0.45, tau=0.09), flu=dict(FLUP['stututu'], len=0.8, s=0, first=0.6), dt=0.13)) for i, I in enumerate(I4)])

# v0.142: note più basse (0,72 della frequenza delle pale, come la sintesi), aria intorno alla nota, corpo grave
kit('turbo/fischio', loop=lambda s: [turbo_loop(s, dict(f=6200, bw=0.025, sb=0.35, tone=0.35, oct=0.18, corpo=0.25, cf=750, air=0.28, af=2400))])
kit('turbo/sibilo', loop=lambda s: [turbo_loop(s, dict(f=5300, bw=0.035, sb=0.45, tone=0.3, oct=0.25, corpo=0.4, cf=700, air=0.45, af=2100))])
kit('turbo/ululato', loop=lambda s: [turbo_loop(s, dict(f=3700, bw=0.045, sb=0.55, tone=0.25, oct=0.3, parz=[(0.5, 0.25)], corpo=0.7, cf=560, air=0.6, af=1500, lp=7000))])
kit('turbo/sirena', loop=lambda s: [turbo_loop(s, dict(f=3100, bw=0.035, sb=0.4, tone=0.4, oct=0.3, parz=[(1.012, 0.8), (0.5, 0.25)], corpo=0.6, cf=520, air=0.5, af=1300, vib=1.0, lp=7500))])

kit('compressore/volumetrico', loop=lambda s: [sc_loop(s, dict(f=2400, harm=[1, 0.6, 0.38, 0.22, 0.14, 0.08], am=0.3, am_f=600, air=0.25, hiss=0.08, hf=6000))])
kit('compressore/centrifugo', loop=lambda s: [sc_loop(s, dict(f=8200, harm=[1, 0.05], air=0.35, hiss=0.25, hf=5000))])
kit('compressore/vite', loop=lambda s: [sc_loop(s, dict(f=3100, harm=[1, 0.45, 0.25, 0.12], siren=0.5, am=0.15, am_f=517, air=0.25, hiss=0.08, hf=6500))])

CH1 = dict(len=0.45, r0=40, r1=24, modes=[(3300, 14, 1.0), (5400, 18, 0.6), (1900, 10, 0.4)])
CH2 = dict(len=0.6, r0=34, r1=18, modes=[(2600, 12, 1.0), (4300, 16, 0.7), (1300, 8, 0.5)])
kit('wastegate/screamer', loop=lambda s: [scream_loop(s, dict(fr=250, form=[(950, 0.5, 1.0), (1900, 0.45, 0.7), (3300, 0.4, 0.45)], drive=2.5))],
    chatter=lambda s: [chatter(I, s + i, CH1) for i, I in enumerate(I4)])
kit('wastegate/libera', loop=lambda s: [scream_loop(s, dict(fr=250, form=[(700, 0.6, 1.0), (1500, 0.5, 0.9), (2800, 0.5, 0.6), (4500, 0.4, 0.3)], drive=3.5))],
    chatter=lambda s: [chatter(I, s + i, CH2) for i, I in enumerate(I4)])

kit('aspirazione/fungo', sr=24000, main=lambda s: [gulp(I, s + i, dict(len=0.42, att=0.01, fn0=2600, fn1=900, w=0.9, fh=150, ht=0.07, gn=1.0, gh=0.55)) for i, I in enumerate(I4)])
kit('aspirazione/cornetti', sr=24000, main=lambda s: [gulp(I, s + i, dict(len=0.5, att=0.008, fn0=1800, fn1=800, w=0.8, fh=180, ht=0.06, gn=0.45, gh=0.4, honk=165, hf1=650, hf2=1250, gk=1.0)) for i, I in enumerate(I4)])
kit('aspirazione/airbox', sr=24000, main=lambda s: [gulp(I, s + i, dict(len=0.55, att=0.015, fn0=1200, fn1=400, w=1.0, fh=110, ht=0.11, gn=0.6, gh=1.0)) for i, I in enumerate(I4)])

for k, p in POPS.items():
    kit('scarico/' + k, sr=24000, main=lambda s, p=p: [burble(s + i, p) for i in range(6)])

kit('mappa/crackle', sr=24000, main=lambda s: [series(s + i, BANGP['crackle']) for i in range(6)])
kit('mappa/pop_bang', sr=24000, main=lambda s: [bang(s + i, BANGP['pop_bang']) for i in range(6)])
kit('mappa/mitraglia', sr=24000, main=lambda s: [series(s + i, BANGP['mitraglia']) for i in range(6)])
kit('mappa/petardi', sr=24000, main=lambda s: [series(s + i, BANGP['petardi']) for i in range(6)])
kit('mappa/antilag', sr=24000, main=lambda s: [antilag(s + i, BANGP['antilag']) for i in range(6)])

for k in ('colpi', 'due_step', 'fucilata', 'stutter'):
    kit('limitatore/' + k, sr=24000, main=lambda s, k=k: [bang(s + i, BANGP[k]) for i in range(6)])

DD = dict(modes=[(1900, 10, 1.0), (3300, 14, 0.7), (5600, 18, 0.4)], tf=130, dec=0.05, d2=0.007)
SQ = dict(modes=[(1500, 9, 1.0), (2700, 12, 0.8), (4400, 16, 0.5), (7000, 20, 0.3)], tf=110, dec=0.07, d2=0.005)
kit('cambio/denti_dritti', loop=lambda s: [gear_loop(s, dict(f=2300, fs=100, h2=0.35, h3=0.1, am=0.2, nz=0.12))],
    innesto=lambda s: [clack(I, s + i, DD) for i, I in enumerate(I4)])
kit('cambio/sequenziale', loop=lambda s: [gear_loop(s, dict(f=2900, fs=100, h2=0.5, h3=0.25, am=0.35, am2=0.15, nz=0.2))],
    innesto=lambda s: [clack(I, s + i, SQ) for i, I in enumerate(I4)],
    aria=lambda s: [aria(0.6 + 0.2 * i, s + i, dict(len=0.07)) for i in range(3)])

kit('spurgo/classico', main=lambda s: [purge(s, dict(len=1.3)), purge(s + 1, dict(len=1.9))])
kit('spurgo/doppio', main=lambda s: [purge(s, dict(segs=[(0.0, 0.22), (0.36, 1.5)])), purge(s + 1, dict(segs=[(0.0, 0.18), (0.3, 1.1), (1.6, 0.25)]))])


# ---------------------------------------------------------------------------------------------------- uscita
def save(path, x, sr=SR):
    pcm = (np.clip(x, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def grafico(path, x, title, sr=SR):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(2, 1, figsize=(7, 4.2), gridspec_kw={'height_ratios': [1, 2.4]})
    t = np.arange(len(x)) / sr
    ax[0].plot(t, x, lw=0.4, color='#e08020')
    ax[0].set_xlim(0, t[-1])
    ax[0].set_ylim(-1, 1)
    ax[0].set_title(title, fontsize=9)
    f, tt, S = sg.spectrogram(x, fs=sr, nperseg=512, noverlap=384)
    ax[1].pcolormesh(tt, f, 10 * np.log10(S + 1e-12), shading='auto', vmin=-110, vmax=-30, cmap='magma')
    ax[1].set_ylim(0, 12000)
    ax[1].set_ylabel('Hz')
    fig.tight_layout()
    fig.savefig(path, dpi=70)
    plt.close(fig)


def seme(kid):
    return sum((i + 1) * ord(c) for i, c in enumerate(kid)) * 7919 % 1000003


def fai(kid, gdir=None):
    sr, groups = KITS[kid]
    d = os.path.join(OUT, *kid.split('/'))
    os.makedirs(d, exist_ok=True)
    for f in os.listdir(d):
        if f.endswith('.wav'):
            os.remove(os.path.join(d, f))
    files = []
    for g, fn in groups.items():
        sounds = fn(seme(kid + ':' + g))
        if sr != SR:                                          # prima si cambia la frequenza, poi si misura il picco
            sounds = [sg.resample_poly(np.asarray(x, dtype=float), sr // 1000, SR // 1000) for x in sounds]
        if g == 'loop':
            files.append(('loop', sounds[0]))
            continue
        pk = max(np.max(np.abs(s)) for s in sounds)          # stesso livello per tutto il gruppo: restano le differenze d'intensità
        for i, s in enumerate(sounds):
            name = (str(i + 1) if g == 'main' else g + str(i + 1))
            files.append((name, s * (0.89 / pk)))
    out = []
    for name, x in files:
        kg = 10 ** (LIVELLO.get(kid + ':' + name, LIVELLO.get(kid, 0.0)) / 20)
        x = np.asarray(x, dtype=float)
        if kg > 1:
            x = 0.89 * np.tanh(kg * x / 0.89) / np.tanh(kg)
        else:
            x = x * kg
        p = os.path.join(d, name + '.wav')
        save(p, x, sr)
        out.append((name, len(x) / SR, float(np.max(np.abs(x)))))
        if gdir:
            os.makedirs(gdir, exist_ok=True)
            grafico(os.path.join(gdir, kid.replace('/', '__') + '__' + name + '.png'), x, kid + ' · ' + name, sr)
    return out


def main():
    ap = argparse.ArgumentParser(description='Campioni audio dei pezzi del motore (Night Run)')
    ap.add_argument('solo', nargs='*', help='kit (valvola/stututu) o componente (valvola)')
    ap.add_argument('--grafici', help='cartella per gli spettrogrammi PNG')
    a = ap.parse_args()
    ids = [k for k in KITS if not a.solo or any(k == s or k.startswith(s.rstrip('/') + '/') for s in a.solo)]
    if not ids:
        sys.exit('Nessun kit con quel nome. Ci sono: ' + ', '.join(KITS))
    tot = 0
    for kid in ids:
        res = fai(kid, a.grafici)
        tot += len(res)
        print(f'{kid:28s} ' + '  '.join(f'{n}:{d:.2f}s' for n, d, _ in res))
    print(f'{tot} file in {os.path.relpath(OUT, ROOT)}')


if __name__ == '__main__':
    main()
