#!/usr/bin/env bash
# Controllo della sera: cosa è cambiato su main dall'ultimo controllo (chi, cosa, quali file), e i test.
# Uso (dalla radice del repository):
#   strumenti/controllo_sera.sh          mostra le novità dall'ultimo controllo e fa girare i test
#   strumenti/controllo_sera.sh fatto    segna il controllo come fatto: sposta l'etichetta git `controllo-sera`
#                                        sull'ultimo commit di main e la carica su GitHub (vale per tutti e due)
# L'ultimo controllo è l'etichetta `controllo-sera`; la prima volta si guardano le ultime 24 ore.
set -uo pipefail
cd "$(dirname "$0")/.."
git fetch -q origin main --tags 2>/dev/null || git fetch -q origin main
if [ "${1:-}" = "fatto" ]; then
  git tag -f controllo-sera origin/main >/dev/null
  git push -q -f origin refs/tags/controllo-sera 2>&1 | grep -v -i "moved\|^remote:" || true
  echo "Controllo segnato fatto su $(git log -1 --format='%h %s' origin/main)"
  exit 0
fi
if git rev-parse -q --verify refs/tags/controllo-sera >/dev/null; then
  da="controllo-sera"; echo "Novità su main dall'ultimo controllo ($(git log -1 --format='%ad' --date=format:'%d/%m %H:%M' controllo-sera)):"
  range="controllo-sera..origin/main"
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
