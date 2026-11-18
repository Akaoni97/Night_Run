#!/usr/bin/env bash
# Controllo della sera: cosa è cambiato su main dall'ultimo controllo (chi, cosa, quali file), e i test.
# Uso (dalla radice del repository):
#   strumenti/controllo_sera.sh          mostra le novità dall'ultimo controllo e fa girare i test
#   strumenti/controllo_sera.sh fatto    segna il controllo come fatto: sposta il ramo segnalibro `controllo-sera`
#                                        sull'ultimo commit di main, su GitHub (vale per tutti e due)
# L'ultimo controllo è il ramo `controllo-sera` (solo un segnalibro: non ci si lavora); la prima volta si guardano
# le ultime 24 ore.
set -uo pipefail
cd "$(dirname "$0")/.."
git fetch -q origin main
git fetch -q origin +controllo-sera:refs/remotes/origin/controllo-sera 2>/dev/null
if [ "${1:-}" = "fatto" ]; then
  git push -q -f origin origin/main:refs/heads/controllo-sera 2>&1 | grep -v -i "moved\|^remote:" || true
  echo "Controllo segnato fatto su $(git log -1 --format='%h %s' origin/main)"
  exit 0
fi
if git rev-parse -q --verify refs/remotes/origin/controllo-sera >/dev/null; then
  echo "Novità su main dall'ultimo controllo (segnato su: $(git log -1 --format='%h %ad' --date=format:'%d/%m %H:%M' origin/controllo-sera)):"
  range="origin/controllo-sera..origin/main"
else
  echo "Primo controllo: novità su main delle ultime 24 ore"
  da=$(git rev-list -1 --before="24 hours ago" origin/main); range="${da:+$da..}origin/main"
fi
n=$(git rev-list --count $range)
if [ "$n" = "0" ]; then echo "  niente di nuovo."; else
  echo; echo "== $n commit"; git log --no-merges --format='  %h  %ad  %<(14,trunc)%an  %s' --date=format:'%d/%m %H:%M' $range
  echo; echo "== file toccati (+ righe aggiunte, - tolte)"; git diff --stat=110 $range | sed 's/^/  /'
  del=$(git diff --diff-filter=D --name-only $range); [ -n "$del" ] && { echo; echo "== file eliminati"; echo "$del" | sed 's/^/  /'; }
fi
echo; echo "== test (sul main aggiornato)"
tmp=$(mktemp -d); git worktree add -q --detach "$tmp" origin/main 2>/dev/null
( cd "$tmp" && node --test test/*.test.js 2>&1 | grep -E "^# (pass|fail)" | sed 's/^# /  /' )
git worktree remove --force "$tmp" 2>/dev/null
echo; echo "Dopo averlo guardato insieme: strumenti/controllo_sera.sh fatto"
