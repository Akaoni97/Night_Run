import subprocess, os, json, sys
R = os.path.abspath(sys.argv[1]); REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')); T = R + '/tmp'; os.makedirs(T, exist_ok=True)
SONG = REPO + '/audio/redline_at_midnight.mp3'
def sh(*a):
    r = subprocess.run(a, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
    return r.stdout
def dur(f): return float(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f))
# (tipo, file, durata o None, carta, ritaglio)
SEG = [
 ('still', 'fermi/titolo.png', 2.8, 'titolo', None),
 ('still', 'fermi/editor.png', 2.6, 'editor', '1480:832:0:0'),
 ('still', 'fermi/arrivo.png', 2.2, 'arrivo', None),
 ('still', 'fermi/garage.png', 2.6, 'garage', None),
 ('road', '01_tokyo', None, 'tokyo', None),
 ('road', '02_roma', None, 'roma', None),
 ('road', '04_parigi', None, 'parigi', None),
 ('road', '05_londra', None, 'londra', None),
 ('road', '03_semaforo', None, 'semaforo', None),
 ('road', '07_e36', None, 'e36', None),
 ('still', 'fermi/desk-officina.png', 3.0, 'officina', None),
 ('road', '06_mare', None, 'mare', None),
 ('road', '08_telefono', None, 'telefono', None),
 ('road', '09_supra', None, 'supra', None),
]
clips = []; t = 0; plan = []
for i, (k, f, d, card, crop) in enumerate(SEG):
    out = f'{T}/c{i:02d}.mp4'
    if k == 'road':
        src = f'{R}/riprese/{f}.mp4'; d = dur(src)
        pre = 'scale=1080:608:flags=lanczos' if 'telefono' in f else 'crop=1350:1080:150:0,scale=1080:864:flags=lanczos'; inp = ['-i', src]
    else:
        pre = (f'crop={crop},' if crop else '') + "scale=1920:1080,zoompan=z='min(zoom+0.0007,1.09)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,scale=1080:608:flags=lanczos"
        inp = ['-framerate', '30', '-loop', '1', '-t', str(d), '-i', f'{R}/{f}']
    fade = f'fade=t=in:st=0:d=0.1,fade=t=out:st={d-0.1:.2f}:d=0.1'
    fc = ('[0:v]split[s1][s2];[s1]scale=-2:1920:flags=bicubic,crop=1080:1920,boxblur=26:2,eq=brightness=-0.22[bg];'
          f'[s2]{pre}[fg];[bg][fg]overlay=0:(H-h)/2,{fade},format=yuv420p[v]')
    sh('ffmpeg', '-v', 'error', '-y', *inp, '-filter_complex', fc, '-map', '[v]', '-t', f'{d:.3f}', '-r', '30', '-c:v', 'libx264', '-crf', '16', out)
    clips.append(out); plan.append((k, f, card, t, d)); t += d
TOT = t; print('durata totale', round(TOT, 2))
open(f'{T}/lista.txt', 'w').write(''.join(f"file '{c}'\n" for c in clips))
sh('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{T}/lista.txt', '-c', 'copy', f'{T}/pulito.mp4')
# audio: motori dove ci sono le riprese, canzone sotto
ins = ['-i', f'{T}/pulito.mp4']; fc = []; labs = []; n = 1
for k, f, card, s, d in plan:
    if k == 'road':
        ins += ['-i', f'{R}/riprese/{f}.wav']; ms = int(s * 1000)
        fc.append(f'[{n}:a]adelay={ms}|{ms},volume=1.25[e{n}]'); labs.append(f'[e{n}]'); n += 1
ins += ['-i', SONG]
fc.append(f'[{n}:a]atrim=59:{59+TOT+1:.1f},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1.0,volume=0.62,afade=t=out:st={TOT-1.6:.2f}:d=1.6[mus]')
fc.append(f"{''.join(labs)}[mus]amix=inputs={len(labs)+1}:normalize=0:duration=longest,alimiter=limit=0.95,atrim=0:{TOT:.2f}[a]")
sh('ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(fc), '-map', '[a]', '-ar', '48000', '-ac', '2', f'{T}/audio.wav')
# 9:16 con le scritte
cards = {}; 
for k, f, card, s, d in plan:
    if card == 'supra':
        cards['supra'] = (s + 0.5, s + d - 2.9)
    else: cards[card] = (s + 0.2, s + d - 0.1)
cards['fine'] = (plan[-1][3] + plan[-1][4] - 2.7, TOT)
cin = []; ov = []; prev = 'base'
for i, (c, (a, b)) in enumerate(cards.items()):
    cin += ['-loop', '1', '-t', f'{TOT:.2f}', '-i', f'{R}/cartelli/{c}.png']
    ov.append(f'[{i+1}:v]format=rgba,fade=t=in:st={a:.2f}:d=0.3:alpha=1,fade=t=out:st={b-0.3:.2f}:d=0.3:alpha=1[k{i}]')
    ov.append(f'[{prev}][k{i}]overlay=0:0[o{i}]'); prev = f'o{i}'
base = '[0:v]null[base];'
nA = len(cards) + 1
sh('ffmpeg', '-v', 'error', '-y', '-i', f'{T}/pulito.mp4', *cin, '-i', f'{T}/audio.wav', '-filter_complex',
   base + ';'.join(ov) + f';[{prev}]fade=t=out:st={TOT-0.8:.2f}:d=0.8,format=yuv420p[v]',
   '-map', '[v]', '-map', f'{nA}:a', '-t', f'{TOT:.2f}', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', f'{R}/night_run_reel.mp4')
print('fatto', f'{R}/night_run_reel.mp4')
