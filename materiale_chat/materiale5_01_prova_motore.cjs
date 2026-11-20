// Prova del motore originale su una copia dei dati: nessuna scrittura nel gioco.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.argv[2],'utf8')+'\n'+
 fs.readFileSync(process.argv[3],'utf8')+
 '\nthis.api={CHAT_NODES,CHAT_START,CHAT_UNLOCK,chatState,chatEnter,chatOptions,chatReply,chatSetConf,chatTick,chatLines};',ctx);
const a=ctx.api,manifest=JSON.parse(fs.readFileSync(process.argv[4],'utf8'));
const del=manifest.intervento_materiale5_blocco01;
const roots=['ELE_pasta','ELE_turno','ELE_coinquilino','ELE_cena','ELE_bollette',
 'ELE_richiamo','ELE_distanza','ELE_riparazione','ELE_nonno','ELE_cena_ritorno'].map(x=>x+'_01');
const every={};
for(const n of Object.values(a.CHAT_NODES)){
 for(const req of [n.req,...(n.alt||[]).map(x=>x.req),...(n.opts||[]).map(x=>x.req)]){
  if(typeof req==='string'&&req.startsWith('flag:'))every[req.slice(5)]=1;
 }
}
let paths=0,replies=0,hidden=0;
for(const profile of ['minimo','tutti'])for(const root of roots){
 const s={};const c=a.chatState(s);c.flags=profile==='tutti'?{...every}:{};
 const req=a.CHAT_NODES[root].req;if(req)c.flags[req.slice(5)]=1;
 a.chatEnter(s,1000,'Elena',root);
 function walk(st,depth){
  assert(depth<15,'Percorso troppo lungo');
  if(!st.chat.th.Elena.at){paths++;return;}
  const id=st.chat.th.Elena.at,os=a.chatOptions(st,1000,'Elena');
  assert(os.length>=1&&os.length<=3,id);
  for(const o of os){
   const copy=JSON.parse(JSON.stringify(st));
   if(a.CHAT_NODES[id].opts[o.i].req)hidden++;
   const r=a.chatReply(copy,1000,'Elena',o.i);assert(r.ok,id);replies++;
   // Il salvataggio intermedio deve mantenere la stessa domanda successiva.
   const resumed=JSON.parse(JSON.stringify(copy));
   assert.deepEqual(JSON.stringify(a.chatOptions(copy,1000,'Elena')),
                    JSON.stringify(a.chatOptions(resumed,1000,'Elena')));
   walk(resumed,depth+1);
  }
 }
 walk(s,0);
}
let thresholds=0;
for(const e of del.soglie){
 const s={};const c=a.chatState(s);
 for(const st of a.CHAT_START)c.started[st.id]=1;
 c.conf.Elena=e.soglia-1;
 a.chatSetConf(s,1000,'Elena',1);
 assert.equal(c.q.filter(q=>q.node===e.node).length,1);
 a.chatSetConf(s,1000,'Elena',-1);a.chatSetConf(s,1000,'Elena',1);
 assert.equal(c.q.filter(q=>q.node===e.node).length,1,'Soglia duplicata');
 if(e.req){
  a.chatTick(s,1001);assert.equal(c.q.filter(q=>q.node===e.node).length,1,'Coda persa');
  assert(!c.th.Elena||!c.th.Elena.done[e.node]);c.flags[e.req]=1;
 }
 a.chatTick(s,1002);
 assert(c.th.Elena.done[e.node],e.node);thresholds++;
}
const s={};a.chatEnter(s,20,'Elena','ELE_ritiro_01');
for(const pick of [1,0,0,0,0])assert(a.chatReply(s,20,'Elena',pick).ok);
assert(s.chat.flags.bugia_vendita,'La prima sera non ha lasciato la bugia');
assert(s.chat.th.Elena.done.ELE_ritiro_08,'Prima sera non conclusa');
a.chatEnter(s,100,'Elena','ELE_cena_01');a.chatReply(s,100,'Elena',0);
assert(a.chatLines(s,100,a.CHAT_NODES.ELE_cena_02)[0].includes('Domani'));
const confession=a.chatOptions(s,100,'Elena').find(o=>o.i===0);
assert(confession,'Ammissione nascosta non disponibile con la bugia');
a.chatReply(s,100,'Elena',0);assert(s.chat.flags.e5_vendita_ammessa);
a.chatEnter(s,200,'Elena','ELE_distanza_01');a.chatReply(s,200,'Elena',0);
assert(a.chatLines(s,200,a.CHAT_NODES.ELE_distanza_02)[0].includes('Domani'));
const noLie={};a.chatEnter(noLie,200,'Elena','ELE_cena_02');
assert(!a.chatOptions(noLie,200,'Elena').some(o=>o.i===0),'Ammissione mostrata senza bugia');
assert(!a.chatLines(noLie,200,a.CHAT_NODES.ELE_distanza_04).join(' ').includes('domani'),
 'Elena rinfaccia una bugia mai detta');
const nick={};a.chatState(nick).flags.e5_ripresa=1;
a.chatEnter(nick,500,'Elena','ELE_nonno_01');
a.chatReply(nick,500,'Elena',0);a.chatReply(nick,500,'Elena',0);
assert(nick.chat.flags.nonno_uso_fissato);
assert(a.chatLines(nick,500,a.CHAT_NODES.PRE_2_01).join(' ').includes('Nonno'),
 'La memoria del soprannome non arriva alla presenza');
console.log(JSON.stringify({ok:true,profili_flag:2,ingressi_narrativi:20,
 percorsi_terminati:paths,risposte_eseguite:replies,scelte_condizionate_eseguite:hidden,
 soglie_provate:thresholds,salvataggio_intermedio:true,
 bugia_rinfacciata_in_due_scene:true,ammissione_nascosta:true,
 soprannome_usato_dalla_presenza:true,
 ambito:'Motore puro originale, senza DOM, regia o partita nel browser.'},null,2));

