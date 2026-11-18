#!/usr/bin/env bash
# Monta il video "coming soon" di Night Run dalle riprese di strumenti/teaser.js.
# Uso: strumenti/teaser_monta.sh CARTELLA
#   CARTELLA/riprese/   le riprese mute (node strumenti/teaser.js CARTELLA/riprese)
#   CARTELLA/cartelli/  le scritte in PNG trasparente: a_, b_, fine_, stay_ seguiti da 16x9 o 9x16
#   CARTELLA/audio/     sgasate.wav e allungo.wav (node strumenti/ascolta.mjs v40 sgasate|allungo FILE 1)
# Escono CARTELLA/night_run_teaser_16x9.mp4 (YouTube, X) e CARTELLA/night_run_teaser_9x16.mp4 (Reels, TikTok, Shorts).
# Musica: audio/redline_at_midnight.mp3 dal secondo 59 (pausa, poi riparte forte proprio sullo stacco sulla città).
set -euo pipefail
D="${1:?cartella}"; R="$(cd "$(dirname "$0")/.." && pwd)"
SONG="$R/audio/redline_at_midnight.mp3"
T=27                                   # durata: 2 s di nero col motore + 25 s di riprese
TMP="$D/tmp"; mkdir -p "$TMP"

# 1) riprese in fila, ognuna con una breve dissolvenza dal nero e verso il nero, dopo 2 s di nero
list="$TMP/lista.txt"; : > "$list"
ffmpeg -v error -y -f lavfi -i "color=c=black:s=1920x1080:r=30:d=2" -c:v libx264 -crf 14 -pix_fmt yuv420p "$TMP/00_nero.mp4"
echo "file '00_nero.mp4'" >> "$list"
for f in "$D"/riprese/0*.mp4; do
  n=$(basename "$f"); d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  ffmpeg -v error -y -i "$f" -vf "fade=t=in:st=0:d=0.25,fade=t=out:st=$(echo "$d - 0.2" | bc):d=0.2" -c:v libx264 -crf 14 -pix_fmt yuv420p "$TMP/$n"
  echo "file '$n'" >> "$list"
done
ffmpeg -v error -y -f concat -safe 0 -i "$list" -c copy "$TMP/pulito.mp4"

# 2) suono: sgasata della V40 sul nero, la canzone che entra, l'allungo sotto la ripresa veloce del Wangan
ffmpeg -v error -y -i "$D/audio/sgasate.wav" -i "$SONG" -i "$D/audio/allungo.wav" -filter_complex "
  [0:a]atrim=6.5:10,asetpts=PTS-STARTPTS,afade=t=out:st=2.4:d=1.1,volume=1.1[mot];
  [1:a]atrim=59:85.5,asetpts=PTS-STARTPTS,afade=t=in:d=1.2,afade=t=out:st=23.5:d=2.5,adelay=1000|1000,volume=0.9[mus];
  [2:a]atrim=12:15.2,asetpts=PTS-STARTPTS,afade=t=in:d=0.3,afade=t=out:st=2.6:d=0.6,adelay=13000|13000,volume=0.35[all];
  [mot][mus][all]amix=inputs=3:normalize=0:duration=longest,atrim=0:$T,alimiter=limit=0.95[a]" \
  -map "[a]" -ar 48000 -ac 2 "$TMP/audio.wav"

# 3) scritte: a sul tramonto, b sulla città, poi velo scuro e cartello finale sulle lucciole
scritte() {  # $1 formato (16x9 | 9x16), $2 W, $3 H
  local C="$D/cartelli"
  echo "-loop 1 -t $T -i $C/a_$1.png -loop 1 -t $T -i $C/b_$1.png -loop 1 -t $T -i $C/fine_$1.png -loop 1 -t $T -i $C/stay_$1.png \
    -f lavfi -t $T -i color=c=black@0.55:s=$2x$3:r=30,format=rgba"
}
FX="
  [1:v]format=rgba,fade=t=in:st=2.7:d=0.5:alpha=1,fade=t=out:st=5.3:d=0.5:alpha=1[ta];
  [2:v]format=rgba,fade=t=in:st=6.6:d=0.5:alpha=1,fade=t=out:st=9.4:d=0.5:alpha=1[tb];
  [3:v]format=rgba,fade=t=in:st=22.0:d=0.9:alpha=1[tf];
  [4:v]format=rgba,fade=t=in:st=23.4:d=0.6:alpha=1[ts];
  [5:v]fade=t=in:st=21.6:d=0.9:alpha=1[vel];
  [base][vel]overlay=0:0:shortest=1[v1];[v1][ta]overlay=0:0[v2];[v2][tb]overlay=0:0[v3];[v3][tf]overlay=0:0[v4];[v4][ts]overlay=0:0,
  fade=t=out:st=26.0:d=1.0,format=yuv420p[v]"

# 16:9
ffmpeg -v error -y -i "$TMP/pulito.mp4" $(scritte 16x9 1920 1080) -i "$TMP/audio.wav" -filter_complex "[0:v]null[base];$FX" \
  -map "[v]" -map 6:a -t $T -c:v libx264 -preset slow -crf 17 -c:a aac -b:a 192k -movflags +faststart "$D/night_run_teaser_16x9.mp4"
# 9:16: la strada in mezzo a tutta larghezza, sopra e sotto la stessa scena ingrandita, sfocata e scura
ffmpeg -v error -y -i "$TMP/pulito.mp4" $(scritte 9x16 1080 1920) -i "$TMP/audio.wav" -filter_complex "
  [0:v]split[s1][s2];
  [s1]scale=-2:1920:flags=bicubic,crop=1080:1920,boxblur=24:2,eq=brightness=-0.18[bg];
  [s2]scale=1080:-2:flags=lanczos[fg];
  [bg][fg]overlay=0:(H-h)/2[base];$FX" \
  -map "[v]" -map 6:a -t $T -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k -movflags +faststart "$D/night_run_teaser_9x16.mp4"
echo "fatto: $D/night_run_teaser_16x9.mp4 e $D/night_run_teaser_9x16.mp4"
