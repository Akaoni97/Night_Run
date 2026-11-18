#!/usr/bin/env bash
# Monta il video "coming soon" di Night Run dalle riprese di strumenti/teaser.js.
# Uso: strumenti/teaser_monta.sh CARTELLA
#   CARTELLA/riprese/   riprese mute e registri del motore (node strumenti/teaser.js CARTELLA/riprese), poi i suoni del
#                       motore (node strumenti/teaser_audio.mjs CARTELLA/riprese): NOME.mp4 + NOME.wav per ripresa
#   CARTELLA/cartelli/  scritte in PNG trasparente (python3 strumenti/teaser_cartelli.py CARTELLA/cartelli CARATTERI)
# Escono CARTELLA/night_run_teaser_16x9.mp4 (YouTube, X) e CARTELLA/night_run_teaser_9x16.mp4 (Reels, TikTok, Shorts).
# Suono: il motore vero di ogni ripresa; sotto, audio/redline_at_midnight.mp3 dal secondo 59 (pausa e poi riparte forte
# proprio sullo stacco sulla città), più bassa all'avviamento e alla partenza al semaforo, dove comanda il motore, quasi
# muta quando arriva il messaggio sul telefono (con la vibrazione) e di nuovo forte sulla Supra preparata.
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
  echo "file '$b.mp4'" >> "$lv"; la="$la -i $D/riprese/$b.wav"; n=$((n + 1))
  declare "AT_${b:0:2}=$T"; declare "DUR_${b:0:2}=$d"                 # inizio e durata di ogni ripresa (AT_01, AT_02...)
  T=$(echo "$T + $d" | bc)
done
ffmpeg -v error -y -f concat -safe 0 -i "$lv" -c copy "$TMP/pulito.mp4"
T=$(printf '%.2f' "$T")
ins=""; for i in $(seq 0 $((n - 1))); do ins="$ins[$i:a]"; done
ffmpeg -v error -y $la -filter_complex "${ins}concat=n=$n:v=0:a=1[m]" -map "[m]" -ar 48000 -ac 2 "$TMP/motore.wav"

# tempi delle riprese presi dalle durate vere: AT_xx = inizio, DUR_xx = durata (01 partenza, 02 città, 03 semaforo,
# 04 blocco, 05 mare, 06 lucciole, 07 telefono, 08 Supra preparata che va via)
a() { echo "$1" | bc -l; }
S3=${AT_03}; E3=$(a "$AT_03 + $DUR_03"); S7=${AT_07}; S8=${AT_08}
PH=$(a "$S7 + 0.8")                                                     # il telefono sale (phone.at in teaser.js)
FIN=$(a "$S8 + $DUR_08 - 2.6")                                          # cartello finale, sulla strada vuota dopo la Supra
# vibrazione del telefono: due ronzii corti
ffmpeg -v error -y -f lavfi -i "aevalsrc='0.35*sin(2*PI*175*t)*(0.6+0.4*sin(2*PI*31*t))*(between(t,0,0.32)+between(t,0.48,0.8))':s=48000:d=1.2" -ac 2 "$TMP/vibra.wav"
# 2) suono: motore davanti, canzone sotto (più bassa dove il motore deve sentirsi, forte sulla Supra); col telefono a
#    schermo motore e canzone si abbassano e si sente la vibrazione
ffmpeg -v error -y -i "$TMP/motore.wav" -i "$SONG" -i "$TMP/vibra.wav" -filter_complex "
  [0:a]volume='if(between(t,$PH-0.2,$S8),0.4,1.15)':eval=frame,afade=t=out:st=$(echo "$T - 1.2" | bc):d=1.2[mot];
  [1:a]atrim=59:$(echo "59 + $T" | bc),asetpts=PTS-STARTPTS,adelay=1000|1000,afade=t=in:st=1:d=1.5,
       volume='if(lt(t,6),0.35+0.45*(t-1)/5,if(between(t,$S3,$E3),0.45,if(between(t,$S7+0.3,$S8),0.08,if(gte(t,$S8),0.95,0.85))))':eval=frame,afade=t=out:st=$(echo "$T - 2.5" | bc):d=2.5[mus];
  [2:a]adelay=$(a "$PH * 1000 + 150" | cut -d. -f1)|$(a "$PH * 1000 + 150" | cut -d. -f1),volume=1.1[vib];
  [mot][mus][vib]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.95[a]" \
  -map "[a]" -ar 48000 -ac 2 "$TMP/audio.wav"

# 3) scritte: a sulla partenza, b sulla città, c sul posto di blocco, d sul mare, poi (dopo telefono e Supra) velo scuro e cartello finale
scritte() {  # $1 formato (16x9 | 9x16), $2 W, $3 H
  local C="$D/cartelli"
  echo "-loop 1 -t $T -i $C/a_$1.png -loop 1 -t $T -i $C/b_$1.png -loop 1 -t $T -i $C/c_$1.png -loop 1 -t $T -i $C/d_$1.png \
    -loop 1 -t $T -i $C/fine_$1.png -loop 1 -t $T -i $C/stay_$1.png -f lavfi -t $T -i color=c=black@0.55:s=$2x$3:r=30,format=rgba"
}
fx() { echo "[$1:v]format=rgba,fade=t=in:st=$2:d=0.5:alpha=1,fade=t=out:st=$3:d=0.5:alpha=1[$4];"; }
FX="$(fx 1 $(a "$AT_01 + 1.2") $(a "$AT_01 + 4.6") ta)$(fx 2 $(a "$AT_02 + 0.6") $(a "$AT_02 + 4.0") tb)$(fx 3 $(a "$AT_04 + 0.7") $(a "$AT_04 + 5.1") tc)$(fx 4 $(a "$AT_05 + 0.5") $(a "$AT_05 + 3.7") td)
  [5:v]format=rgba,fade=t=in:st=$FIN:d=0.9:alpha=1[tf];
  [6:v]format=rgba,fade=t=in:st=$(a "$FIN + 1.4"):d=0.6:alpha=1[ts];
  [7:v]fade=t=in:st=$(a "$FIN - 0.4"):d=0.9:alpha=1[vel];
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
