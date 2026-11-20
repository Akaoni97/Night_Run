#!/bin/bash
# Night Run · all'inizio di ogni sessione di Claude (del proprietario o del cognato): si mette in pari con main e dice
# a Claude cosa è cambiato, gli avvisi importanti (AVVISI.md, da dire subito), chi sta lavorando su cosa (INCORSO.md)
# e le ultime righe del diario (DIARIO.md).
# Non installa niente (il gioco non ha dipendenze). Non perde mai lavoro: si aggiorna da solo solo se si è su main,
# senza modifiche in sospeso e con un avanzamento semplice; altrimenti lo dice e basta.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

echo "== Night Run: situazione all'inizio della sessione"
if timeout 20 git fetch -q origin main 2>/dev/null; then
  timeout 10 git fetch -q origin +controllo-sera:refs/remotes/origin/controllo-sera 2>/dev/null || true
  br=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  dietro=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo 0)
  avanti=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)
  if [ "$dietro" -gt 0 ]; then
    if [ "$br" = "main" ] && [ -z "$(git status --porcelain --untracked-files=no)" ] && [ "$avanti" -eq 0 ] && git merge -q --ff-only origin/main 2>/dev/null; then
      echo "Aggiornato all'ultimo main: $dietro commit nuovi."
    else
      echo "ATTENZIONE: sei indietro di $dietro commit rispetto a main (ramo $br, $avanti tuoi non caricati). Prima di lavorare: git fetch origin main && git merge origin/main."
    fi
  else
    echo "Sei in pari con main."
  fi
  if git rev-parse -q --verify refs/remotes/origin/controllo-sera >/dev/null; then
    n=$(git rev-list --count origin/controllo-sera..origin/main)
    echo "Dall'ultimo controllo della sera: $n commit su main."
    [ "$n" -gt 0 ] && git log --no-merges -8 --format='  %h %ad  %s%n      %(trailers:key=Per,valueonly,separator=%x2C )' --date=format:'%d/%m %H:%M' origin/controllo-sera..origin/main | sed '/^ *$/d'
  fi
else
  echo "(GitHub non raggiungibile adesso: non ho potuto controllare le novità su main.)"
fi
if [ -f AVVISI.md ] && grep -q "^## " AVVISI.md; then
  echo; echo "== !!! AVVISI IMPORTANTI (AVVISI.md): dillo SUBITO a chi ti parla, all'inizio della prima risposta !!!"
  awk '/^## /{on=1} on' AVVISI.md | head -30
fi
[ -f INCORSO.md ] && { echo; echo "== Lavori in corso (INCORSO.md)"; sed -n '/^| /p' INCORSO.md | tail -n +3; }
[ -f SOSPESI.md ] && { echo; echo "== In sospeso e da rivedere (SOSPESI.md, si riporta al controllo della sera)"; grep -c "^- " SOSPESI.md | sed 's/^/  voci aperte: /'; }
[ -f DIARIO.md ] && { echo; echo "== Ultime righe del diario (DIARIO.md)"; awk '/^## /{n++} n>=1 && n<=2' DIARIO.md | head -20; }
echo
echo "Regole: COMANDI.md (comandi), AGENTS.md (come lavorare). Prima di caricare su main: fetch e unione, mai push --force."
exit 0
