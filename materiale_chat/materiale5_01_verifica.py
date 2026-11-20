"""Verifica e compone il blocco Elena senza scrivere nel repository.

python materiale5_01_verifica.py --repo CARTELLA_REPO --work CARTELLA_PROVE
La base deve coincidere semanticamente con il ramo letto. Le prove vanno fuori dal repo.
Usa solo Python standard; per la prova del motore serve Node.
"""
from pathlib import Path
import argparse,collections,copy,hashlib,json,re,subprocess,sys

TONES=set('sboccato pacato ironico gentile freddo sincero evasivo'.split())
H=re.compile(r'^\[([A-Za-z0-9_]+)\] (ELENA|IMITAZIONE DI ELENA) · (I|II|III|IV|V) · (sempre|richiede: [a-z0-9_]+)$')
O=re.compile(r'^  ([ABC])\) «(.*?)» → ([A-Za-z0-9_]+)(?: \[(.*)\])?$')
A=re.compile(r'^  ALT se: (.*?) → (.+)$')
def constant(src,key):
    m=re.search(r'const\s+'+re.escape(key)+r'\s*=\s*',src)
    if not m:raise ValueError('Costante mancante: '+key)
    return json.JSONDecoder().raw_decode(src[m.end():])[0]
def dataset(path):
    s=path.read_text(encoding='utf-8-sig')
    return {k:constant(s,k) for k in ('CHAT_LIST','CHAT_START','CHAT_UNLOCK','CHAT_TONI_MAP')}
def condition(c):
    return c if c.startswith(('flag:','conf:','fatto:','km>=','!flag:')) else 'flag:'+c
def parse(path):
    nodes={};cur=None
    for i,line in enumerate(path.read_text(encoding='utf-8-sig').splitlines(),1):
        assert len(line)<=90,(path.name,i,'oltre 90',len(line))
        h=H.fullmatch(line)
        if h:
            assert h[1] not in nodes,('ID ripetuto',h[1])
            cur=dict(id=h[1],who='Elena' if h[2]=='ELENA' else 'Sconosciuto',
                     fase=h[3],text=[],opts=[])
            if h[2]!='ELENA':cur['as']='Elena'
            if h[4]!='sempre':cur['req']='flag:'+h[4].split(': ',1)[1]
            nodes[h[1]]=cur;continue
        if line.startswith('Nota') or line=='[FINE]':cur=None;continue
        if not line.strip() or line.startswith('UNLOCK:'):continue
        assert cur is not None,('Riga senza nodo o Nota',i,line)
        o=O.fullmatch(line);a=A.fullmatch(line)
        if o:
            opt=dict(t=o[2],to=o[3]);fx=[]
            for f in (o[4] or '').split(';'):
                f=f.strip()
                if not f:continue
                if f.startswith('se:'):opt['req']=condition(f[3:])
                elif f.startswith('+'):fx.append('cnt:'+f[1:]+'+1')
                else:fx.append(f)
            if fx:opt['fx']=fx
            cur['opts'].append(opt)
        elif a:cur.setdefault('alt',[]).append(dict(req=condition(a[1]),text=a[2]))
        else:
            assert not line.lstrip().startswith(('A)','B)','C)','ALT se:')),('Formato',i,line)
            cur['text'].append(line)
    for n in nodes.values():
        if len(n['text'])==1:n['text']=n['text'][0]
        if not n['opts']:n.pop('opts')
    return nodes
def tones(path):
    out={}
    for line in path.read_text(encoding='utf-8').splitlines():
        assert len(line)<=90,('Toni oltre 90',line)
        if not line or line.startswith('Nota'):continue
        nid,rest=line.split(' · ',1)
        assert nid not in out,('Toni ripetuti',nid)
        row=dict(re.findall(r'([ABC]) (\w+)',rest));assert set(row.values())<=TONES
        out[nid]=row
    return out
def flag(req):
    if isinstance(req,list):return set().union(*(flag(x) for x in req))
    if isinstance(req,str) and req.startswith('flag:'):return {req[5:]}
    return set()
def serialize(n):
    who={'Elena':'ELENA','Rosa':'ROSA','Livia':'LIVIA','Dario':'DARIO',
         'Sconosciuto':'NUMERO SCONOSCIUTO'}[n['who']]
    if n.get('as'):who='IMITAZIONE DI '+{'Elena':'ELENA','Dario':'DARIO','Zio Claudio':'CLAUDIO'}[n['as']]
    req=n.get('req');assert req is None or req.startswith('flag:'),(n['id'],req)
    cond='richiede: '+req[5:] if req else 'sempre'
    ls=[f'[{n["id"]}] {who} · {n["fase"]} · {cond}']
    ls+=n['text'] if isinstance(n['text'],list) else [n['text']]
    ls+=['  ALT se: '+a['req']+' → '+a['text'] for a in n.get('alt',[])]
    for l,o in zip('ABC',n.get('opts',[])):
        fx=[]
        if o.get('req'):fx.append('se:'+o['req'])
        for f in o.get('fx',[]):
            if f.startswith('cnt:') and f.endswith('+1'):f='+'+f[4:-2]
            fx.append(f)
        ls.append('  '+l+') «'+o['t']+'» → '+o['to']+(' ['+';'.join(fx)+']' if fx else ''))
    if not n.get('opts'):ls.append('[FINE]')
    return '\n'.join(ls)+'\n'
def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--repo',type=Path,required=True);ap.add_argument('--work',type=Path,required=True)
    ap.add_argument('--materiale',type=Path,default=Path(__file__).resolve().parent)
    ap.add_argument('--rapporto',type=Path)
    args=ap.parse_args();pkg=args.materiale;repo=args.repo.resolve();work=args.work.resolve()
    assert work!=repo and not work.is_relative_to(repo),'Le prove devono stare fuori dal repository.'
    work.mkdir(exist_ok=True,parents=True)
    base=dataset(repo/'chat_dati.js');manifest=json.loads((pkg/'materiale5_01_ingressi.json').read_text(encoding='utf-8'))
    delta=manifest['intervento_materiale5_blocco01']
    digest=hashlib.sha256(json.dumps(base,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
    assert digest==delta['provenienza']['dati_semantici_sha256'],\
        'Base cambiata: rileggere e riconciliare il materiale; non usare una sovrapposizione cieca.'
    new=parse(pkg/'materiale5_01_elena.txt');tt=tones(pkg/'materiale5_01_toni.txt')
    old={n['id']:n for n in base['CHAT_LIST']};retired=set(delta['rimuovi_nodi'])
    assert retired<=set(old) and not retired&set(new)
    combined={i:copy.deepcopy(n) for i,n in old.items() if i not in retired};combined.update(new)
    core={i for i in new if i.startswith('ELE_')}
    assert len(core)==80 and len(new)==100 and len(retired)==96
    formula=re.compile(r'non ti (?:sto )?chiedo di|non mi piace essere il bersaglio|\bcapisco\b|\bposso dirti\b|\bnon devi\b',re.I)
    sets=set();needs=set();newsets=set();readers=collections.defaultdict(list);targets=set();fake=[]
    count=0;tone_count=collections.Counter()
    for nid,n in combined.items():
        needs |=flag(n.get('req'))
        for a in n.get('alt',[]):
            needs|=flag(a['req'])
            for f in flag(a['req']):readers[f].append(nid)
        for f in flag(n.get('req')):readers[f].append(nid)
        for o in n.get('opts',[]):
            targets.add(o['to']);needs|=flag(o.get('req'))
            for f in flag(o.get('req')):readers[f].append(nid)
            for f in o.get('fx',[]):
                if f.startswith('flag:'):sets.add(f[5:])
                elif f.startswith(('sblocca:','chiude:')):targets.add(f.split(':',1)[1])
        if nid not in new:continue
        text=[n['text']] if isinstance(n['text'],str) else n['text']
        for t in text+[a['text'] for a in n.get('alt',[])]:assert len(t)<=90,(nid,'testo lungo')
        if nid in core:
            assert not any(formula.search(t) for t in text+[a['text'] for a in n.get('alt',[])]),nid
            assert not any(re.search(r'\bscus[aei]\b',o['t'],re.I) for o in n.get('opts',[])),nid
        opts=n.get('opts',[]);assert len(opts)<=3
        assert not opts or any(not o.get('req') for o in opts),('Menu vuoto senza flag',nid)
        keys=[(o['to'],tuple(sorted(o.get('fx',[])))) for o in opts]
        if len(set(keys))!=len(keys):fake.append(nid)
        if opts:assert set(tt[nid])==set('ABC'[:len(opts)]),('Toni incompleti',nid)
        for l,o in zip('ABC',opts):
            assert len(o['t'])<=90
            tone_count[tt[nid][l]]+=1;count+=1
            newsets|={f[5:] for f in o.get('fx',[]) if f.startswith('flag:e5_')}
    assert not fake,('Scelte finte nel blocco consegnato',fake)
    assert not targets-set(combined)-{'FINE'},('Destinazioni mancanti',targets-set(combined)-{'FINE'})
    for i,n in combined.items():
        for c in [n.get('req')]+[a['req'] for a in n.get('alt',[])]+[o.get('req') for o in n.get('opts',[])]:
            if isinstance(c,str) and c.startswith('fatto:'):assert c[6:] in combined,(i,c)
    for st in manifest['baseline_starts_da_preservare']:
        assert st['node'] in combined;needs|=flag(st.get('req',[]))
    assert not {f for f in needs-sets if not f.startswith(('ev_','luogo_','auto_'))
                and f!='vc_richiudibile'},('Origini mancanti',needs-sets)
    assert all(readers[f] for f in newsets),('Flag senza lettore',newsets)
    colors={};longest={}
    def dfs(i):
        assert colors.get(i)!=1,('Ciclo',i)
        if colors.get(i)==2:return longest[i]
        colors[i]=1;dest=[o['to'] for o in combined[i].get('opts',[]) if o['to']!='FINE']
        if combined[i].get('fallback'):dest.append(combined[i]['fallback'])
        longest[i]=1+max([dfs(j) for j in dest] or [0]);colors[i]=2;return longest[i]
    for i in combined:dfs(i)
    for prefix in ('ELE_ritiro_','ELE_litigio_'):
        assert all(combined[i]==n for i,n in old.items() if i.startswith(prefix))
    bare=sorted(s['km'] for s in manifest['baseline_starts_da_preservare']
                if not any(r.startswith(('flag:','fatto:')) for r in s.get('req',[])))
    assert bare[0]>=18 and all(b-a>=9 for a,b in zip(bare,bare[1:]))
    # Costruzione della sola copia di prova, senza reintrodurre gli UNLOCK ritirati.
    total_tones=copy.deepcopy(base['CHAT_TONI_MAP'])
    for nid,rows in tt.items():total_tones[nid]=[rows[l] for l in 'ABC'[:len(rows)]]
    cons='Nota · Composito di verifica, non un nuovo sorgente del gioco.\n\n'
    cons+='\n'.join(serialize(n) for n in combined.values())
    cons+='\nNota · Sblocchi consolidati.\n'
    un=copy.deepcopy(base['CHAT_UNLOCK']);un.update(delta['sostituisci_unlock'])
    for who,tiers in un.items():
        for level,ids in tiers.items():
            for nid in ids:assert nid in combined;cons+=f'UNLOCK: {who} {level} → {nid}\n'
    cons+='\nNota · Fine composito.\n'
    (work/'composito.txt').write_text(cons,encoding='utf-8')
    tone_text='\n'.join(nid+' · '+' · '.join(l+' '+tone for l,tone in zip('ABC',total_tones[nid]))
                         for nid,n in combined.items() if n.get('opts'))+'\n'
    (work/'toni.txt').write_text(tone_text,encoding='utf-8')
    dest=work/'chat_dati_prova.js'
    proc=subprocess.run([sys.executable,'-X','utf8',str(repo/'strumenti'/'importa_chat.py'),
         str(work/'composito.txt'),'--toni',str(work/'toni.txt'),'--attivazione',
         str(pkg/'materiale5_01_ingressi.json'),'--out',str(dest)],capture_output=True,text=True,encoding='utf-8')
    (work/'importazione.log').write_text(proc.stdout+proc.stderr,encoding='utf-8')
    assert proc.returncode==0,proc.stderr
    actual=dataset(dest);aa={n['id']:n for n in actual['CHAT_LIST']}
    assert set(aa)==set(combined),'Il generatore ha reintrodotto o perso ID.'
    for nid,n in combined.items():
        a=aa[nid]
        for k in ('text','opts','alt','who','as','fase','fallback'):
            assert a.get(k)==n.get(k),(nid,k,a.get(k),n.get(k))
        if n.get('opts'):assert actual['CHAT_TONI_MAP'][nid]==total_tones[nid],nid
    assert actual['CHAT_START']==manifest['baseline_starts_da_preservare']
    assert actual['CHAT_UNLOCK']==un
    for prefix in ('ELE_ritiro_','ELE_litigio_'):
        assert all(aa[i]==n for i,n in old.items() if i.startswith(prefix))
    motor=subprocess.run(['node',str(pkg/'materiale5_01_prova_motore.cjs'),str(dest),
                          str(repo/'chat.js'),str(pkg/'materiale5_01_ingressi.json')],
                         capture_output=True,text=True,encoding='utf-8')
    assert motor.returncode==0,motor.stdout+motor.stderr
    report=dict(ok=True,scene_riscritte=10,nodi_narrativi=80,risposte_narrative=124,
      override_CASA=20,nodi_consegnati=len(new),risposte_consegnate=count,
      nodi_ritirati=len(retired),nodi_composito=len(aa),ingressi_rimasti=len(actual['CHAT_START']),
      ingressi_rimossi=len(delta['rimuovi_ingressi']),soglie_Elena=un['Elena'],
      scelte_finte_nel_consegnato=fake,nuovi_flag_con_lettore=len(newsets),
      righe_oltre_90=0,toni=dict(tone_count),scene_protette_identiche=True,
      importatore_originale='PASS',grafo_completo_aciclico=True,
      lunghezza_massima_grafo=max(longest.values()),gap_partenze_libere_minimo=min(b-a for a,b in zip(bare,bare[1:])),
      motore=json.loads(motor.stdout),
      ambito='Solo dati e motore puro su copie. Non UI, partita o suite completa del gioco.',
      hash_file={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in
                 [pkg/'materiale5_01_elena.txt',pkg/'materiale5_01_toni.txt',pkg/'materiale5_01_ingressi.json']})
    if args.rapporto:args.rapporto.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()

