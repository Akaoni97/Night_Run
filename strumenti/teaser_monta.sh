#!/usr/bin/env bash
# Monta il video "coming soon" di Night Run dalle riprese di strumenti/teaser.js.
# Uso: strumenti/teaser_monta.sh CARTELLA
#   CARTELLA/riprese/   riprese mute e registri del motore (node strumenti/teaser.js CARTELLA/riprese), poi i suoni del
#                       motore (node strumenti/teaser_audio.mjs CARTELLA/riprese): NOME.mp4 + NOME.wav per ripresa
#   CARTELLA/cartelli/  scritte in PNG trasparente (python3 strumenti/teaser_cartelli.py CARTELLA/cartelli CARATTERI)
# Escono CARTELLA/night_run_teaser_16x9.mp4 (YouTube, X) e CARTELLA/night_run_teaser_9x16.mp4 (Reels, TikTok, Shorts).
# Suono: il motore vero di ogni ripresa; sotto, audio/redline_at_midnight.mp3 dal secondo 59 (pausa e poi riparte forte
# proprio sullo stacco sulla città), più bassa all'avviamento e alla partenza al semaforo, dove comanda il motore.
set -euo pipefail
D="${1:?cartella}"; R="$(cd "$(dirname "$0")/.." && pwd)"
SONG="$R/audio/redline_at_midnight.mp3"
TMP="$D/tmp"; mkdir -p "$TMP"

# 1) riprese in fila con brevi dissolvenze; i suoni del motore in fila nello stesso ordine
lv="$TMP/lista.txt"; : > "$lv"; la=""; n=0; T=0
for f in "$D"/riprese/0*.mp4; do
  b=$(basename "$f" .mp4); d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  fin=$([ $n -eq 0 ] && echo "fade=t=in:st=0:d=0.6," || echo "fade=t=in:st=0:d=0.2,")
  ffmpeg -v error -y -i "$f" -vf "${fin}fade=t=out:st=$(echo "$d - 0.2" | bc):d=0.2" -c:v libx264 -crf 14 -pix_fmt yuv420p "$TMP/$b.mp4"
  echo "file '$b.mp4'" >> "$lv"; la="$la -i $D/riprese/$b.wav"; n=$((n + 1)); T=$(echo "$T + $d" | bc)
done
ffmpeg -v error -y -f concat -safe 0 -i "$lv" -c copy "$TMP/pulito.mp4"
T=$(printf '%.2f' "$T")
ins=""; for i in $(seq 0 $((n - 1))); do ins="$ins[$i:a]"; done
ffmpeg -v error -y $la -filter_complex "${ins}concat=n=$n:v=0:a=1[m]" -map "[m]" -ar 48000 -ac 2 "$TMP/motore.wav"

# tempi delle riprese (in secondi dall'inizio): partenza 0, città 6, semaforo 11 (via a 13,2), blocco 17,5, mare 23,5, lucciole 28
# 2) suono: motore davanti, canzone sotto (più bassa dove il motore deve sentirsi)
ffmpeg -v error -y -i "$TMP/motore.wav" -i "$SONG" -filter_complex "
  [0:a]volume=1.15,afade=t=out:st=$(echo "$T - 1.2" | bc):d=1.2[mot];
  [1:a]atrim=59:$(echo "59 + $T" | bc),asetpts=PTS-STARTPTS,adelay=1000|1000,afade=t=in:st=1:d=1.5,
       volume='if(lt(t,6),0.35+0.45*(t-1)/5,if(between(t,11,17.5),0.45,0.85))':eval=frame,afade=t=out:st=$(echo "$T - 2.5" | bc):d=2.5[mus];
  [mot][mus]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[a]" \
  -map "[a]" -ar 48000 -ac 2 "$TMP/audio.wav"

# 3) scritte: a sulla partenza, b sulla città, c sul posto di blocco, d sul mare, poi velo scuro e cartello finale
scritte() {  # $1 formato (16x9 | 9x16), $2 W, $3 H
  local C="$D/cartelli"
  echo "-loop 1 -t $T -i $C/a_$1.png -loop 1 -t $T -i $C/b_$1.png -loop 1 -t $T -i $C/c_$1.png -loop 1 -t $T -i $C/d_$1.png \
    -loop 1 -t $T -i $C/fine_$1.png -loop 1 -t $T -i $C/stay_$1.png -f lavfi -t $T -i color=c=black@0.55:s=$2x$3:r=30,format=rgba"
}
fx() { echo "[$1:v]format=rgba,fade=t=in:st=$2:d=0.5:alpha=1,fade=t=out:st=$3:d=0.5:alpha=1[$4];"; }
FX="$(fx 1 1.2 4.6 ta)$(fx 2 6.6 10.0 tb)$(fx 3 18.2 22.6 tc)$(fx 4 24.0 27.2 td)
  [5:v]format=rgba,fade=t=in:st=29.6:d=0.9:alpha=1[tf];
  [6:v]format=rgba,fade=t=in:st=31.0:d=0.6:alpha=1[ts];
  [7:v]fade=t=in:st=29.2:d=0.9:alpha=1[vel];
  [base][vel]overlay=0:0:shortest=1[v1];[v1][ta]overlay[v2];[v2][tb]overlay[v3];[v3][tc]overlay[v4];[v4][td]overlay[v5];[v5][tf]overlay[v6];[v6][ts]overlay,
  fade=t=out:st=$(echo "$T - 1" | bc):d=1.0,format=yuv420p[v]"

# 16:9
ffmpeg -v error -y -i "$TMP/pulito.mp4" $(scritte 16x9 1920 1080) -i "$TMP/audio.wav" -filter_complex "[0:v]null[base];$FX" \
  -map "[v]" -map 8:a -t $T -c:v libx264 -preset slow -crf 17 -c:a aac -b:a 192k -movflags +faststart "$D/night_run_teaser_16x9.mp4"
# 9:16: la strada in mezzo a tutta larghezza, sopra e sotto la stessa scena ingrandita, sfocata e scura
ffmpeg -v error -y -i "$TMP/pulito.mp4" $(scritte 9x16 1080 1920) -i "$TMP/audio.wav" -filter_complex "
  [0:v]split[s1][s2];
  [s1]scale=-2:1920:flags=bicubic,crop=1080:1920,boxblur=24:2,eq=brightness=-0.18[bg];
  [s2]scale=1080:-2:flags=lanczos[fg];
  [bg][fg]overlay=0:(H-h)/2[base];$FX" \
  -map "[v]" -map 8:a -t $T -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k -movflags +faststart "$D/night_run_teaser_9x16.mp4"
echo "fatto ($T s): $D/night_run_teaser_16x9.mp4 e $D/night_run_teaser_9x16.mp4"
