#!/usr/bin/env python3
"""Importa il materiale scritto da Codex (nodi di conversazione) in chat_dati.js.

Uso:  python3 strumenti/importa_chat.py <materiale.txt> [altri.txt ...] [--toni <tabella_toni.txt>] [--out chat_dati.js]
Più file si leggono in ordine; se un ID compare due volte vale l'ultimo (così un file nuovo può correggere un nodo vecchio).

Il materiale ha nodi come
    [ELE_ritiro_01] ELENA · I · sempre
    Allora, com'è?
      A) «Parte.» → ELE_ritiro_02   [flag: x]
Il file prodotto contiene i nodi (CHAT_LIST), quando partono (CHAT_START) e i toni delle risposte (CHAT_TONI_MAP).
Sintassi in più (secondo giro):
    ALT se: elena_sosta_promessa → Testo diverso se quel flag è vero   (riga sotto il testo; anche  ALT se: conf:Rosa>=50 → ...)
    A) «Risposta» → ID   [se: flag; flag: x; +legami]                   (se: = la risposta compare solo se il flag è vero)
    UNLOCK: Rosa 25 → V2_ROS_s25_01                                      (a quella soglia di confidenza si apre quella conversazione)
Tabella dei toni (facoltativa, una riga per nodo):  ELE_ritiro_01 · A ironico · B sincero
Senza tabella i toni sono PROVVISORI (regole sulle parole): servono solo a provare la barra di confidenza.
Le risposte aggiunte a mano (EXTRA) e le conversazioni che aspettano eventi non ancora fatti (DORMIENTI) stanno qui sotto.
"""
import re, sys, json, argparse

TONI = ['sboccato', 'pacato', 'ironico', 'gentile', 'freddo', 'sincero', 'evasivo']
# conversazioni che aspettano un evento che nel gioco non c'è ancora: partono quando qualcuno imposta il flag
DORMIENTI = {
    'ELE_distanza_01': 'flag:ev_distanza_impossibile',
    'ROS_dopo_passaggio_01': 'flag:ev_incursione_1_conclusa',
    'ROS_segni_01': 'flag:ev_indizio_sangue',
    'LIV_irene_01': 'flag:ev_foto_originale',
    'PRE_4_01': 'flag:ev_presenza_scoperta', 'PRE_4_02': 'flag:ev_presenza_scoperta', 'PRE_4_03': 'flag:ev_presenza_scoperta',
    'PRE_4_06': 'flag:ev_presenza_scoperta', 'PRE_4_07': 'flag:ev_presenza_scoperta',
}
FASE_V = 'flag:ev_fase_v'            # tutto ciò che è della fase V aspetta la fase V
# risposte aggiunte a mano (terze risposte con un tono diverso): nodo, testo, destinazione, tono, effetti
EXTRA = [
    ('ROS_attrezzi_01', 'Cazzo, mi sono distratto. Che attrezzo è?', 'ROS_attrezzi_02', 'sboccato', []),
    ('ROS_attrezzi_02', 'Che due palle: dimmi cosa vuoi che tocchi.', 'ROS_attrezzi_04', 'sboccato', []),
    ('ROS_attrezzi_05', 'Se è un\'altra rottura di cazzo me lo dici.', 'ROS_attrezzi_07', 'sboccato', []),
    ('ROS_prudenza_01', 'Un caffè di merda, ma l\'ho bevuto.', 'ROS_prudenza_02', 'sboccato', []),
    ('ROS_prudenza_05', 'Che cazzo ne so io quanto manca.', 'ROS_prudenza_07', 'sboccato', []),
    ('ROS_ricontrollo_03', 'Mi rompi il cazzo, ma hai ragione.', 'ROS_ricontrollo_05', 'sboccato', []),
    ('ROS_passato_04', 'Allora diciamolo: qui nessuno sa un cazzo.', 'ROS_passato_06', 'sboccato', []),
    ('ROS_promessa_02', 'Una porta alla volta. E nessuno mi prende per il culo.', 'ROS_promessa_04', 'sboccato', []),
    ('ROS_promessa_07', 'Se ho un dubbio lo dico, anche se ti incazzi.', 'ROS_promessa_08', 'sboccato', []),
    ('ROS_dopo_passaggio_01', 'Cazzo, no. Ma dammi un secondo.', 'ROS_dopo_passaggio_02', 'sboccato', []),
    ('ELE_ritiro_01', 'Una merda, ma è mia.', 'ELE_ritiro_02', 'sboccato', []),
    ('ELE_turno_01', 'Il mio turno è un cazzo di labirinto.', 'ELE_turno_02', 'sboccato', []),
    ('ELE_cena_01', 'Con questa macchina? Chiedimelo domani, che cazzo.', 'ELE_cena_02', 'sboccato', []),
    ('ELE_litigio_01', 'Hai ragione. Sono stato uno stronzo.', 'ELE_litigio_02', 'sincero', ['flag:elena_scuse']),
    ('LIV_primo_01', 'Dipende. Se è una multa, ero fuori città.', 'LIV_primo_02', 'ironico', []),
    ('LIV_ottavio_01', 'Preferisco non parlarne a quest\'ora.', 'LIV_ottavio_02', 'evasivo', []),
    ('LIV_promessa_01', 'Rosa parla sempre, ma di solito ha ragione.', 'LIV_promessa_03', 'ironico', []),
]
BAND = {'I': 18, 'II': 130, 'III': 270, 'IV': 430, 'V': 600}     # km da cui comincia ogni fase (segnaposto)
GAP = 14                                                       # km minimi tra l'inizio di due conversazioni
LANES = ['Elena', 'Dario', 'Rosa', 'Livia', 'Sconosciuto']

def tono(t, who):
    s = t.lower()
    if re.search(r'cazz|merda|puttan|stronz|vaffa|culo|palle|minchia|incazz|fott', s): return 'sboccato'
    if re.search(r'^(grazie|scusa|ti ascolto|ti aspetto|va bene|ti tengo|ti lascio|resto qui|ci siamo capiti|meno male|hai ragione|ti scrivo|ti dico|ti aggiorno|ti avviso|ti richiamo|ricevuto)', s): return 'gentile'
    if re.search(r'(non lo so|per ora|vedremo|valuto|ci penso|forse|non faccio promesse|non prometto|non esattamente|mi faccio dire|aspetto e poi|ne riparliamo|tolgo il piano|non chiedere|prima voglio|poi passiamo)', s): return 'evasivo'
    if re.search(r'(sono stanc|ho paura|davvero|sul serio|te lo dico|non ho voglia|era vero|ho sbagliato|ti racconto|ammetto|volevo sentirlo|non te lo prometto a caso|ti dico almeno)', s): return 'sincero'
    if s.startswith('non ') and re.search(r'(devo|serve|voglio|ti sto|esattamente)', s): return 'freddo'
    if re.search(r'(fenomeno|rumore|spia|raffica|applausi|gratuito|brontol|rimorchio|sto già|il resto fa|cinque minuti|battuta|ha dei diritti|stare comodo|garage)', s): return 'ironico'
    return 'pacato' if who == 'Livia' else 'sincero'

node_re = re.compile(r'^\[([A-Za-z0-9_]+)\]\s+(.*)$')
opt_re = re.compile(r'^\s+([ABC])\)\s+«(.*?)»\s*→\s*([A-Za-z0-9_]+|FINE)\s*(?:\[(.*)\])?\s*$')
def cond_of(x):
    return x if x.startswith(('flag:', 'conf:', 'km>=', 'fatto:', '!flag:')) else 'flag:' + x
def fx_of(raw):
    out = []
    for p in [x.strip() for x in (raw or '').split(';') if x.strip()]:
        m = re.match(r'^flag:\s*([a-z0-9_]+)$', p)
        if m: out.append('flag:' + m.group(1)); continue
        m = re.match(r'^(sblocca|chiude):\s*([A-Za-z0-9_]+)$', p)
        if m: out.append('%s:%s' % (m.group(1), m.group(2))); continue
        m = re.match(r'^\+(conoscenza|legami|patti|varchi)$', p)
        if m: out.append('cnt:%s+1' % m.group(1)); continue
    return out

def parse(path, nodes=None, order=None):
    L = open(path, encoding='utf-8').read().split('\n')
    nodes, order, cur = (nodes if nodes is not None else {}), (order if order is not None else []), None
    global UNLOCK
    UNLOCK = globals().get('UNLOCK') or {}
    for l in L:
        mu = re.match(r'^UNLOCK:\s*([A-Za-z ]+?)\s+(\d+)\s*→\s*([A-Za-z0-9_]+)', l)
        if mu: UNLOCK.setdefault(mu.group(1), {}).setdefault(int(mu.group(2)), []).append(mu.group(3))
    for i, l in enumerate(L):
        m = node_re.match(l)
        if m and re.match(r'^(ELE_|ROS_(?!INS_)|LIV_|DAR_|PRE_|SPORCO_|V2_)', m.group(1)):
            cur = {'id': m.group(1), 'head': m.group(2), 'text': [], 'opts': []}
            if cur['id'] not in nodes: order.append(cur['id'])        # un ID già visto viene sostituito (vale l'ultimo)
            nodes[cur['id']] = cur; continue
        if m:
            cur = None; continue
        if not cur: continue
        mo = opt_re.match(l)
        if mo:
            raw = mo.group(4) or ''
            req = None
            mr = re.search(r'(?:^|;)\s*se:\s*([A-Za-z0-9_:<>=.]+)', raw)
            if mr: req = cond_of(mr.group(1)); raw = re.sub(r'(?:^|;)\s*se:\s*[A-Za-z0-9_:<>=.]+', '', raw)
            o = {'t': mo.group(2), 'to': mo.group(3), 'fx': fx_of(raw)}
            if req: o['req'] = req
            cur['opts'].append(o); continue
        ma = re.match(r'^\s+ALT\s+se:\s*([A-Za-z0-9_:<>=.]+)\s*→\s*(.+)$', l)
        if ma:
            cur.setdefault('alt', []).append({'req': cond_of(ma.group(1)), 'text': ma.group(2).strip()}); continue
        st = l.strip()
        if st in ('', '[FINE]'): continue
        if re.match(r'^(Ingresso|Uscita|[A-Z]\d+ ·|Nucleo|Nota|Inserto|Tre alternative|=|Stadio|Attenzione|Le sostituzioni|La battuta)', st) or st.startswith('==='): cur = None; continue
        if not cur['opts'] and not st.startswith('→'): cur['text'].append(st)
    return nodes, order

def head(h, nid):
    """Chi scrive (conf), con che nome compare (thread), fase, condizione."""
    if nid.startswith('SPORCO_'):
        m = re.search(r'richiede:\s*([a-z0-9_]+)', h)
        return 'Sconosciuto', 'Elena', 'IV', ('flag:' + m.group(1)) if m else None
    parts = [p.strip() for p in h.split('·')]
    who = parts[0]; fase = parts[1].split('-')[0] if len(parts) > 1 else 'I'
    cond = None
    for p in parts[2:]:
        m = re.match(r'(?:richiede|se):\s*([a-z0-9_]+)', p)
        if m: cond = 'flag:' + m.group(1)
    mp = {'ELENA': ('Elena', None), 'DARIO': ('Dario', None), 'ROSA': ('Rosa', None), 'LIVIA': ('Livia', None), 'NUMERO SCONOSCIUTO': ('Sconosciuto', None), 'PRESENZA SCOPERTA': ('Sconosciuto', None),
          'IMITAZIONE DI ELENA': ('Sconosciuto', 'Elena'), 'IMITAZIONE DI DARIO': ('Sconosciuto', 'Dario'), 'IMITAZIONE DI CLAUDIO': ('Sconosciuto', 'Zio Claudio')}
    w, a = mp[who]
    return w, a, fase, cond

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('src', nargs='+'); ap.add_argument('--toni'); ap.add_argument('--out', default='chat_dati.js'); ap.add_argument('--attivazione')
    a = ap.parse_args()
    nodes, order = {}, []
    for src in a.src: parse(src, nodes, order)
    toni_tab = {}
    if a.toni:
        for l in open(a.toni, encoding='utf-8'):
            m = re.match(r'^\s*([A-Za-z0-9_]+)\s*·\s*(.+)$', l)
            if not m: continue
            d = {}
            for part in m.group(2).split('·'):
                mm = re.match(r'\s*([ABC])\s+(\w+)', part)
                if mm and mm.group(2) in TONI: d[mm.group(1)] = mm.group(2)
            if d: toni_tab[m.group(1)] = d
    # risposte aggiunte
    for nid, t, to, tn, fx in EXTRA:
        if nid not in nodes or to not in nodes or len(nodes[nid]['opts']) >= 3: continue     # con un materiale nuovo che le ha già, non servono
        n = nodes[nid]
        n['opts'].append({'t': t, 'to': to, 'fx': fx, 'extra': tn})
    dest = {o['to'] for n in nodes.values() for o in n['opts']}
    dest |= {i for v in UNLOCK.values() for ids in v.values() for i in ids}                      # aperti da una soglia
    dest |= {f.split(':', 1)[1] for n in nodes.values() for o in n['opts'] for f in o['fx'] if f.startswith('sblocca:')}   # aperti da una scelta
    out_nodes, toni_map = [], {}
    for nid in order:
        n = nodes[nid]; who, as_, fase, cond = head(n['head'], nid)
        req = [c for c in [cond, DORMIENTI.get(nid), FASE_V if (fase == 'V' and nid not in dest and nid not in DORMIENTI) else None] if c]
        o = {'id': nid, 'who': who, 'fase': fase}
        if as_: o['as'] = as_
        txt = n['text']
        o['text'] = txt[0] if len(txt) == 1 else txt
        if n.get('alt'): o['alt'] = [{'req': a['req'], 'text': a['text']} for a in n['alt']]
        entry = nid not in dest
        # PRE_1_08 / PRE_4_05 sono varianti condizionate: se la condizione manca si usa l'altra battuta
        if not entry and cond: o['req'] = cond; o['fallback'] = {'PRE_1_08': 'PRE_1_09', 'PRE_4_05': 'PRE_4_06'}.get(nid)
        if o.get('fallback') is None: o.pop('fallback', None)
        if n['opts']:
            o['opts'] = [{'t': x['t'], 'to': x['to'], **({'fx': x['fx']} if x['fx'] else {}), **({'req': x['req']} if x.get('req') else {})} for x in n['opts']]
            tt = []
            for k, x in zip('ABC', n['opts']):
                tt.append(toni_tab.get(nid, {}).get(k) or x.get('extra') or tono(x['t'], who))
            toni_map[nid] = tt
        out_nodes.append(o)
    # quando partono: ordine narrativo per fasi, a turno tra le persone, con almeno GAP km tra una e l'altra
    entries = []
    for nid in order:
        n = nodes[nid]
        if nid in dest: continue
        who, as_, fase, cond = head(n['head'], nid)
        req = [c for c in [cond, DORMIENTI.get(nid), FASE_V if fase == 'V' and nid not in DORMIENTI else None] if c]
        if nid in ('ELE_temperino_fissato', 'ELE_claudio_fissato'): req.append('fatto:ELE_ritiro_08'); fase = 'I'
        entries.append({'id': nid, 'who': who, 'as': as_ or who, 'fase': fase, 'req': req})
    seq = []
    for b in ['I', 'II', 'III', 'IV', 'V']:
        lanes = {l: [e for e in entries if e['fase'] == b and e['who'] == l] for l in LANES}
        while any(lanes.values()):
            for l in LANES:
                if lanes[l]: seq.append(lanes[l].pop(0))
    km, starts = 0, []
    for e in seq:
        if any(r.startswith('flag:ev_') for r in e['req']): e['km'] = BAND[e['fase']]      # aspetta un evento: il km conta poco, non occupa un posto nel ritmo
        else: km = max(km + GAP, BAND[e['fase']]); e['km'] = km
        reqs = ['km>=%d' % km] + e['req']
        starts.append({'id': 'st_' + e['id'], 'th': e['as'], 'node': e['id'], 'km': km, **({'req': e['req']} if e['req'] else {})})
    if a.attivazione:
        # ingressi decisi da Codex (11_ATTIVAZIONE.json): i 56 originali con le loro condizioni, le 18 conversazioni nuove col loro flag,
        # le 12 città col flag d'arrivo. Le soglie di confidenza (UNLOCK) e gli ingressi manuali (casa, scene) non partono da soli.
        att = json.load(open(a.attivazione, encoding='utf-8'))
        starts = [{'id': b['id'], 'th': b['th'], 'node': b['node'], 'km': b['km'], **({'req': b['req']} if b.get('req') else {})} for b in att['baseline_starts_da_preservare']]
        cnt = {}
        for grp, key in (('T9_da_accodare_una_volta', 'req'), ('luoghi', 'req')):
            for e in att[grp]:
                who = e.get('who') or head(nodes[e['entry']]['head'], e['entry'])[0]
                th = head(nodes[e['entry']]['head'], e['entry'])[1] or who
                fase = e['fase']; k = cnt.get((who, fase), 0); cnt[(who, fase)] = k + 1
                req = [cond_of(e[key])]
                if fase == 'V': req.append(FASE_V)
                starts.append({'id': 'st_' + e['entry'], 'th': th, 'node': e['entry'], 'km': BAND[fase] + 8 * k, 'req': req})
    js = ['// ============================================================================',
          '//  Night Run · Dati delle chat (generato da strumenti/importa_chat.py: non si modifica a mano)',
          '//  Nodi di conversazione, quando partono e toni delle risposte. Il motore è in chat.js.',
          '//  I toni sono PROVVISORI finché non arriva la tabella dei toni (--toni). I km di partenza sono SEGNAPOSTO.',
          '// ============================================================================',
          'const CHAT_LIST = ' + json.dumps(out_nodes, ensure_ascii=False, indent=0, separators=(',', ':')).replace('\n', '\n') + ';',
          'const CHAT_START = ' + json.dumps(starts, ensure_ascii=False, separators=(',', ':')) + ';',
          'const CHAT_TONI_MAP = ' + json.dumps(toni_map, ensure_ascii=False, separators=(',', ':')) + ';',
          'const CHAT_UNLOCK = ' + json.dumps({k: {str(a): b for a, b in v.items()} for k, v in UNLOCK.items()}, ensure_ascii=False, separators=(',', ':')) + ';', '']
    open(a.out, 'w', encoding='utf-8').write('\n'.join(js))
    from collections import Counter
    print('nodi', len(out_nodes), 'conversazioni (ingressi)', len(entries), 'risposte', sum(len(n['opts']) for n in nodes.values()), 'toni', Counter(t for v in toni_map.values() for t in v))
    prev = 0
    for s in starts: print('%4d km  %-12s %-26s %s' % (s['km'], s['th'], s['node'], ' '.join(s.get('req', []))))

if __name__ == '__main__':
    main()
