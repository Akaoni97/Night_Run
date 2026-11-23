# Monta il video «di serie / preparata» (9:16, ~60 s) dalle riprese di preparate.js, dal loro suono (suono_preparate.js) e dalle carte
# (cartelli_preparate.js). Uso: python3 strumenti/reel/monta_preparate.py CARTELLA   (dentro: riprese/ con mp4, json, wav; cartelli/ coi png)
# Il gioco si vede a tutta altezza (1080 × 1080, senza ingrandire: pixel netti) al centro, sfondo sfocato, carta in alto.
import subprocess, os, sys
R = os.path.abspath(sys.argv[1]); T = R + '/tmp'; os.makedirs(T, exist_ok=True)
def sh(*a):
    r = subprocess.run(a, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
    return r.stdout
def dur(f): return float(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f))
CLIP = ['e30_a_serie', 'e30_b_preparata', 'p205_a_serie', 'p205_b_preparata', 'golf_a_serie', 'golf_b_preparata']
CARD = ['e30_a', 'e30_b', 'p205_a', 'p205_b', 'golf_a', 'golf_b']
clips = []; t = 0; plan = []
for i, c in enumerate(CLIP):
    src = f'{R}/riprese/{c}.mp4'; d = dur(src); out = f'{T}/c{i}.mp4'
    fade = f'fade=t=in:st=0:d=0.12,fade=t=out:st={d-0.12:.2f}:d=0.12'
    fc = ('[0:v]split[s1][s2];[s1]scale=-2:1920:flags=bicubic,crop=1080:1920,boxblur=30:2,eq=brightness=-0.3[bg];'
          f'[s2]crop=1080:1080:160:0[fg];[bg][fg]overlay=0:(H-h)/2+40,{fade},format=yuv420p[v]')
    sh('ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', fc, '-map', '[v]', '-r', '30', '-c:v', 'libx264', '-crf', '16', out)
    clips.append(out); plan.append((c, CARD[i], t, d)); t += d
TOT = t; print('durata', round(TOT, 1))
open(f'{T}/lista.txt', 'w').write(''.join(f"file '{c}'\n" for c in clips))
sh('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{T}/lista.txt', '-c', 'copy', f'{T}/pulito.mp4')
ins = []; fc = []; labs = []
for n, (c, card, s, d) in enumerate(plan):
    ins += ['-i', f'{R}/riprese/{c}.wav']; ms = int(s * 1000)
    fc.append(f'[{n}:a]adelay={ms}|{ms}[e{n}]'); labs.append(f'[e{n}]')
fc.append(f"{''.join(labs)}amix=inputs={len(labs)}:normalize=0:duration=longest,loudnorm=I=-13:TP=-1.0:LRA=9,atrim=0:{TOT:.2f}[a]")
sh('ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(fc), '-map', '[a]', '-ar', '48000', '-ac', '2', f'{T}/audio.wav')
cards = [(card, s + 0.15, s + d - 0.1) for c, card, s, d in plan] + [('fine', TOT - 2.8, TOT)]
cin = []; ov = []; prev = '0:v'
for i, (c, a, b) in enumerate(cards):
    cin += ['-loop', '1', '-t', f'{TOT:.2f}', '-i', f'{R}/cartelli/{c}.png']
    ov.append(f'[{i+2}:v]format=rgba,fade=t=in:st={a:.2f}:d=0.25:alpha=1,fade=t=out:st={b-0.25:.2f}:d=0.25:alpha=1[k{i}]')
    ov.append(f'[{prev}][k{i}]overlay=0:0[o{i}]'); prev = f'o{i}'
sh('ffmpeg', '-v', 'error', '-y', '-i', f'{T}/pulito.mp4', '-i', f'{T}/audio.wav', *cin, '-filter_complex',
   ';'.join(ov) + f';[{prev}]fade=t=out:st={TOT-0.7:.2f}:d=0.7,format=yuv420p[v]',
   '-map', '[v]', '-map', '1:a', '-t', f'{TOT:.2f}', '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', f'{R}/di_serie_e_preparate.mp4')
print('fatto', f'{R}/di_serie_e_preparate.mp4')
