// ============================================================================
//  Night Run · Le dodici capitali del Viaggio (dopo chat.js)
//  Il giro: Tokyo → Roma → Parigi → Londra → Stoccolma → Berlino → Praga → Vienna → Madrid → Lisbona → Atene → Washington D.C.,
//  con in mezzo i paesaggi di sempre come tratti di collegamento (VG_ROUTE in viaggio.js). Niente geografia vera tra i continenti:
//  l'impossibilità sta nelle gallerie. Entrando in una capitale: avviso d'arrivo, flag chat `luogo_<id>` (le sue conversazioni partono da sole),
//  e uscendone il pensiero del tratto. Testi dal materiale di Codex (materiale_chat/materiale3_04_luoghi.txt).
// ============================================================================
const CAP_ORDER = ["tokyo", "roma", "parigi", "londra", "stoccolma", "berlino", "praga", "vienna", "madrid", "lisbona", "atene", "washington"];
const CAP = {
 "tokyo": {
  "name": "Tokyo",
  "country": "Giappone",
  "lat": 35.69,
  "lon": 139.7,
  "arrivo": "Le insegne si riflettono sull’asfalto bagnato. Le conosci prima di leggerle. Il cartello per casa è ancora al suo posto. Ti sembra un buon inizio.",
  "quartieri": [
   "Ginza Dori",
   "Omotesando"
  ]
 },
 "roma": {
  "name": "Roma",
  "country": "Italia",
  "lat": 41.9028,
  "lon": 12.4964,
  "arrivo": "Le facciate chiare rimandano i fari. Un’insegna resta accesa sopra una serranda. La chiusura sembra normale finché noti la scritta fatta a mano.",
  "quartieri": [
   "Via del Corso",
   "Piazza del Popolo"
  ]
 },
 "parigi": {
  "name": "Parigi",
  "country": "Francia",
  "lat": 48.8566,
  "lon": 2.3522,
  "arrivo": "L’avenue si allarga fra facciate illuminate. Sul cartello c’è scritto PARIS. La durata del tragitto sul telefono è troppo corta per quel nome.",
  "quartieri": [
   "Avenue des Champs-Élysées",
   "Place de la Concorde"
  ]
 },
 "londra": {
  "name": "Londra",
  "country": "Regno Unito",
  "lat": 51.5072,
  "lon": -0.1276,
  "arrivo": "Le luci delle fermate tagliano il marciapiede. LONDON compare dopo la galleria. La barriera è recente; la scritta che la accompagna sembra più vecchia.",
  "quartieri": [
   "Regent Street",
   "Trafalgar Square"
  ]
 },
 "stoccolma": {
  "name": "Stoccolma",
  "country": "Svezia",
  "lat": 59.3293,
  "lon": 18.0686,
  "arrivo": "L’acqua prende le luci basse delle finestre. STOCKHOLM resta nel fascio dei fari. All’autogrill c’è spazio per una station wagon. Ti fermi a guardarlo.",
  "quartieri": [
   "Drottninggatan",
   "Stortorget"
  ]
 },
 "berlino": {
  "name": "Berlino",
  "country": "Germania",
  "lat": 52.52,
  "lon": 13.405,
  "arrivo": "I viali sono larghi, le facciate separate da tratti di buio. BERLIN è leggibile. Alla porta il segno di un’apertura è diverso da quello della richiusura.",
  "quartieri": [
   "Unter den Linden",
   "Alexanderplatz"
  ]
 },
 "praga": {
  "name": "Praga",
  "country": "Cechia",
  "lat": 50.0755,
  "lon": 14.4378,
  "arrivo": "I tetti fanno una linea scura contro il cielo. PRAHA appare fra due luci. La macchia sulla parete si allunga mentre l’auto è ferma.",
  "quartieri": [
   "Václavské náměstí",
   "Staroměstské náměstí"
  ]
 },
 "vienna": {
  "name": "Vienna",
  "country": "Austria",
  "lat": 48.2082,
  "lon": 16.3738,
  "arrivo": "I palazzi seguono la curva del viale. Sul cartello c’è WIEN. La diramazione cambia nome. Il particolare dello svincolo è lo stesso.",
  "quartieri": [
   "Ringstraße",
   "Stephansplatz"
  ]
 },
 "madrid": {
  "name": "Madrid",
  "country": "Spagna",
  "lat": 40.4168,
  "lon": -3.7038,
  "arrivo": "La Gran Vía tiene accese vetrine e finestre. MADRID compare senza esitazioni. Il messaggio nel telefono usa il tuo soprannome come una carezza.",
  "quartieri": [
   "Gran Vía",
   "Puerta del Sol"
  ]
 },
 "lisbona": {
  "name": "Lisbona",
  "country": "Portogallo",
  "lat": 38.7223,
  "lon": -9.1393,
  "arrivo": "La strada scende fra facciate chiare. LISBOA entra ed esce dal riflesso. Una traccia fresca ritorna nello stesso tratto segnato nelle carte.",
  "quartieri": [
   "Avenida da Liberdade",
   "Praça do Comércio"
  ]
 },
 "atene": {
  "name": "Atene",
  "country": "Grecia",
  "lat": 37.9838,
  "lon": 23.7275,
  "arrivo": "L’Acropoli resta lontana sopra le luci. Il cartello dice ATHINA. La porta davanti non porta scritto uscita. È il telefono a insistere.",
  "quartieri": [
   "Syntagma Square",
   "Ermou Street"
  ]
 },
 "washington": {
  "name": "Washington D.C.",
  "country": "Stati Uniti",
  "lat": 38.9072,
  "lon": -77.0369,
  "arrivo": "Il viale è largo; le luci hanno spazio attorno. WASHINGTON D.C. resta leggibile. La nota della donna dice poco. Questa volta non serve che dica di più.",
  "quartieri": [
   "Pennsylvania Avenue",
   "Constitution Avenue"
  ]
 }
};
const CAP_PENS = [
 "Le insegne di casa sono finite. Continuo a cercare l’ultima nello specchio.",
 "Prima un paesaggio che riesco a nominare. Poi un cartello che non dovrebbe essere lì.",
 "La strada torna ordinaria abbastanza a lungo da farmi dubitare della foto.",
 "Le curve mi chiedono attenzione. Per un momento smetto di interrogare il telefono.",
 "Il nome di Ottavio non è rimasto all’autogrill. Adesso viaggia anche con me.",
 "Una porta aperta può richiudersi. Devo ricordarlo prima di averne bisogno.",
 "La macchia cresceva davanti a me. Non era il ricordo che stavo peggiorando.",
 "È cambiato il nome dell’uscita. Il particolare dello svincolo non si è mosso.",
 "Una parola giusta detta nel modo sbagliato. Prima non ci avrei fatto caso.",
 "Quello che ho interrotto non ricomincia. Non ho riscritto chi è rimasto lì.",
 "La porta e la mia uscita sono due cose diverse. Non le unisco per avere meno paura."
];
const CAP_SIGNS = {"tokyo": ["TOKYO", "GINZA DORI", "OMOTESANDO"], "roma": ["ROMA", "VIA DEL CORSO", "PIAZZA DEL POPOLO"], "parigi": ["PARIS", "CHAMPS-ELYSEES", "PLACE DE LA CONCORDE"], "londra": ["LONDON", "REGENT STREET", "TRAFALGAR SQUARE"], "stoccolma": ["STOCKHOLM", "DROTTNINGGATAN", "STORTORGET"], "berlino": ["BERLIN", "UNTER DEN LINDEN", "ALEXANDERPLATZ"], "praga": ["PRAHA", "VACLAVSKE NAMESTI", "STAROMESTSKE NAMESTI"], "vienna": ["WIEN", "RINGSTRASSE", "STEPHANSPLATZ"], "madrid": ["MADRID", "GRAN VIA", "PUERTA DEL SOL"], "lisbona": ["LISBOA", "AVENIDA DA LIBERDADE", "PRACA DO COMERCIO"], "atene": ["ATHINA", "SYNTAGMA", "ERMOU"], "washington": ["WASHINGTON D.C.", "PENNSYLVANIA AVENUE", "CONSTITUTION AVENUE"]};
const CAP_EVT = [
{
"id":"tokyo1",
"cap":"tokyo",
"dove":"bar",
"fase":"I",
"tipo":"quotidiano",
"testo":"Il commesso gira il bicchiere prima di passartelo: il coperchio non tiene bene."
},
{
"id":"tokyo2",
"cap":"tokyo",
"dove":"strada",
"fase":"I",
"tipo":"quotidiano",
"testo":"Un’auto aspetta spazio per parcheggiare. Per una volta non sei tu quello in mezzo."
},
{
"id":"tokyo3",
"cap":"tokyo",
"dove":"strada",
"fase":"III",
"tipo":"strano",
"testo":"Al secondo giro la stessa insegna lampeggia nello stesso istante in cui l’avevi annotato."
},
{
"id":"tokyo4",
"cap":"tokyo",
"dove":"motel",
"fase":"IV",
"tipo":"strano",
"testo":"Da fermo riconosci nella radio una frase sentita soltanto dopo essere partito."
},
{
"id":"roma1",
"cap":"roma",
"dove":"bar",
"fase":"I",
"tipo":"quotidiano",
"testo":"Il barista ti chiede di spostare il gomito: sta passando lo straccio e tu pensavi alla macchina."
},
{
"id":"roma2",
"cap":"roma",
"dove":"autogrill",
"fase":"I",
"tipo":"quotidiano",
"testo":"Una coppia discute su quale uscita prendere. Finiscono per comprare due caffè."
},
{
"id":"roma3",
"cap":"roma",
"dove":"strada",
"fase":"III",
"tipo":"strano",
"testo":"La grafia sulla chiusura coincide con quella del parasole."
},
{
"id":"roma4",
"cap":"roma",
"dove":"benzinaio",
"fase":"IV",
"tipo":"strano",
"testo":"Accanto al cartello scritto a mano la chiamata insiste. Dal passaggio chiuso non arriva nessuno."
},
{
"id":"parigi1",
"cap":"parigi",
"dove":"bar",
"fase":"II",
"tipo":"quotidiano",
"testo":"Un cameriere ti indica dove lasciare il vassoio. La frase è normale; tu impieghi troppo a seguirla."
},
{
"id":"parigi2",
"cap":"parigi",
"dove":"motel",
"fase":"II",
"tipo":"quotidiano",
"testo":"Chiedi una stanza. Chi è al banco ti richiede il documento, senza alcun mistero."
},
{
"id":"parigi3",
"cap":"parigi",
"dove":"strada",
"fase":"III",
"tipo":"strano",
"testo":"Al nuovo passaggio riconosci la stessa finestra accesa e la stessa ombra immobile al vetro."
},
{
"id":"parigi4",
"cap":"parigi",
"dove":"autogrill",
"fase":"IV",
"tipo":"strano",
"testo":"Un rumore metallico ricomincia quando la porta si richiude. Si interrompe allo stesso colpo."
},
{
"id":"londra1",
"cap":"londra",
"dove":"bar",
"fase":"II",
"tipo":"quotidiano",
"testo":"Il cucchiaino vibra contro la tazza. Il rumore finisce appena lo sposti."
},
{
"id":"londra2",
"cap":"londra",
"dove":"strada",
"fase":"II",
"tipo":"quotidiano",
"testo":"Chi sta davanti cerca una svolta e mette la freccia troppo presto."
},
{
"id":"londra3",
"cap":"londra",
"dove":"strada",
"fase":"IV",
"tipo":"strano",
"testo":"La chiusura resta immobile mentre la voce al telefono ti indica proprio quel passaggio."
},
{
"id":"londra4",
"cap":"londra",
"dove":"motel",
"fase":"IV",
"tipo":"strano",
"testo":"Un annuncio si ripete fino alla stessa parola. La porta in corridoio resta chiusa."
},
{
"id":"stoccolma1",
"cap":"stoccolma",
"dove":"autogrill",
"fase":"II",
"tipo":"quotidiano",
"testo":"Un addetto rimette dritta una pila di vassoi che continua a inclinarsi."
},
{
"id":"stoccolma2",
"cap":"stoccolma",
"dove":"benzinaio",
"fase":"II",
"tipo":"quotidiano",
"testo":"Il guanto di plastica si apre soltanto al terzo tentativo. Nessuno ti sta osservando."
},
{
"id":"stoccolma3",
"cap":"stoccolma",
"dove":"autogrill",
"fase":"III",
"tipo":"strano",
"testo":"Il nome di Ottavio compare nel confronto con il tesserino della Volvo."
},
{
"id":"stoccolma4",
"cap":"stoccolma",
"dove":"strada",
"fase":"IV",
"tipo":"strano",
"testo":"Una voce chiede di essere riconosciuta. Non dice da quale lato della porta si trova."
},
{
"id":"berlino1",
"cap":"berlino",
"dove":"bar",
"fase":"II",
"tipo":"quotidiano",
"testo":"Il barista aspetta che tu scelga prima di prendere la tazza. Hai letto il menu tre volte."
},
{
"id":"berlino2",
"cap":"berlino",
"dove":"benzinaio",
"fase":"II",
"tipo":"quotidiano",
"testo":"Una ricevuta si incastra. Il commesso la sfila con un gesto fin troppo allenato."
},
{
"id":"berlino3",
"cap":"berlino",
"dove":"strada",
"fase":"III",
"tipo":"strano",
"testo":"Sulla porta aperta dall’esterno si riconosce anche il tentativo riuscito di richiuderla."
},
{
"id":"berlino4",
"cap":"berlino",
"dove":"motel",
"fase":"IV",
"tipo":"strano",
"testo":"La copia del segno non coincide con il tuo ricordo. La confronti prima di correggerla."
},
{
"id":"praga1",
"cap":"praga",
"dove":"bar",
"fase":"II",
"tipo":"quotidiano",
"testo":"Una tazza è troppo calda da prendere. Aspetti, senza che il tempo ti faccia un torto."
},
{
"id":"praga2",
"cap":"praga",
"dove":"motel",
"fase":"II",
"tipo":"quotidiano",
"testo":"La chiave si impunta. La reception la prova davanti a te e la cambia."
},
{
"id":"praga3",
"cap":"praga",
"dove":"strada",
"fase":"III",
"tipo":"strano",
"testo":"La macchia fresca cresce a vista. Dietro quella porta non si sente una voce."
},
{
"id":"praga4",
"cap":"praga",
"dove":"autogrill",
"fase":"IV",
"tipo":"strano",
"testo":"Un urto lontano riprende identico. Il sangue fresco avanza con la ripetizione."
},
{
"id":"vienna1",
"cap":"vienna",
"dove":"bar",
"fase":"II",
"tipo":"quotidiano",
"testo":"Il conto arriva in un piattino. Per qualche secondo puoi pensare soltanto al conto."
},
{
"id":"vienna2",
"cap":"vienna",
"dove":"strada",
"fase":"II",
"tipo":"quotidiano",
"testo":"Un’auto ti lascia spazio senza chiedere niente in cambio."
},
{
"id":"vienna3",
"cap":"vienna",
"dove":"strada",
"fase":"III",
"tipo":"strano",
"testo":"Segui il nome diverso della diramazione. Riconosci di nuovo lo stesso svincolo."
},
{
"id":"vienna4",
"cap":"vienna",
"dove":"motel",
"fase":"IV",
"tipo":"strano",
"testo":"Sul telefono la foto conserva il particolare che eri sul punto di ricordare diverso."
},
{
"id":"madrid1",
"cap":"madrid",
"dove":"bar",
"fase":"II",
"tipo":"quotidiano",
"testo":"Il cameriere aspetta che tu finisca di cercare una moneta prima di fare il resto."
},
{
"id":"madrid2",
"cap":"madrid",
"dove":"autogrill",
"fase":"II",
"tipo":"quotidiano",
"testo":"Qualcuno ride per una cosa che non hai sentito. Non c’entri e va bene così."
},
{
"id":"madrid3",
"cap":"madrid",
"dove":"strada",
"fase":"IV",
"tipo":"strano",
"testo":"Nonno compare in una frase tenera. L’uso non è quello che Elena aveva fissato."
},
{
"id":"madrid4",
"cap":"madrid",
"dove":"motel",
"fase":"IV",
"tipo":"strano",
"testo":"La copia del messaggio è ancora lì. Rileggi la domanda a cui nessuno ha risposto."
},
{
"id":"lisbona1",
"cap":"lisbona",
"dove":"bar",
"fase":"II",
"tipo":"quotidiano",
"testo":"Il tavolino si muove. Un tovagliolo sotto una gamba risolve l’intero mistero."
},
{
"id":"lisbona2",
"cap":"lisbona",
"dove":"benzinaio",
"fase":"II",
"tipo":"quotidiano",
"testo":"Il commesso indica il lato della pompa. Per una volta avevi guardato quello sbagliato."
},
{
"id":"lisbona3",
"cap":"lisbona",
"dove":"strada",
"fase":"III",
"tipo":"strano",
"testo":"La ripetizione legata al ragazzo della Punto ricomincia dal segno già riconoscibile."
},
{
"id":"lisbona4",
"cap":"lisbona",
"dove":"autogrill",
"fase":"IV",
"tipo":"strano",
"testo":"Il sangue fresco continua senza una persona da recuperare. La scena chiede di essere interrotta."
},
{
"id":"atene1",
"cap":"atene",
"dove":"bar",
"fase":"II",
"tipo":"quotidiano",
"testo":"Un uomo sposta una sedia per lasciarti passare. Il gesto non chiede di essere interpretato."
},
{
"id":"atene2",
"cap":"atene",
"dove":"motel",
"fase":"II",
"tipo":"quotidiano",
"testo":"La reception ti chiede se vuoi un’altra coperta. La risposta può essere soltanto sì o no."
},
{
"id":"atene3",
"cap":"atene",
"dove":"strada",
"fase":"V",
"tipo":"strano",
"testo":"La voce indica la porta come uscita. La foto mostra la donna che la tiene chiusa."
},
{
"id":"atene4",
"cap":"atene",
"dove":"autogrill",
"fase":"V",
"tipo":"strano",
"testo":"Prima di ripartire ti accorgi che stai usando una frase di Claudio. Il telefono conserva il confronto."
},
{
"id":"washington1",
"cap":"washington",
"dove":"bar",
"fase":"II",
"tipo":"quotidiano",
"testo":"Il caffè riempie una tazza più grande di quella che ti aspettavi. Puoi fermarti a berlo."
},
{
"id":"washington2",
"cap":"washington",
"dove":"benzinaio",
"fase":"II",
"tipo":"quotidiano",
"testo":"Leggi due volte l’indicazione della pompa prima di accorgerti che nessuno ti mette fretta."
},
{
"id":"washington3",
"cap":"washington",
"dove":"strada",
"fase":"V",
"tipo":"strano",
"testo":"La nota sul riconoscimento coincide con quello che la presenza ti sta chiedendo."
},
{
"id":"washington4",
"cap":"washington",
"dove":"motel",
"fase":"V",
"tipo":"strano",
"testo":"La copia non cambia. Cambia il nome che eri disposto a dare a chi voleva uscire."
}
];
const CAP_FASE_KM = { I: 0, II: 130, III: 270, IV: 430, V: 600 };      // da che km vale ogni fase (la V vuole anche il flag ev_fase_v della regia)
const CAP_DOVE = { bar: 'bar', autogrill: 'grill', benzinaio: 'fuel', motel: 'motel' };
(function () {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype, orig = P.vgUpdate;
  const fase = (g, km, f) => km >= CAP_FASE_KM[f] && (f !== 'V' || (typeof chatState === 'function' && chatState(g.s).flags.ev_fase_v));
  // un evento della capitale in cui sei: strada = dopo qualche km di guida, locale = quando entri
  const evento = (g, km, dove) => {
    const v = g.s.vg, lid = g.loc && g.loc.id; v.capEv = v.capEv || {};
    const e = CAP_EVT.find((x) => x.cap === lid && x.dove === dove && !v.capEv[x.id] && fase(g, km, x.fase));
    if (e) { v.capEv[e.id] = 1; v.capEvKm = km; g.say(e.testo, e.tipo === 'strano' ? 'bad' : 'info'); }
  };
  P.vgUpdate = function (dt) {
    orig.call(this, dt);
    const v = this.s.vg, lid = this.loc && this.loc.id; if (!v || !lid || this.mode !== 'career') return;
    const km = vgKm(this);
    if (v.capLast !== lid) {
      v.capLast = lid;
      if (CAP[lid]) {
        v.capIdx = CAP_ORDER.indexOf(lid);
        if (typeof chatState === 'function') chatState(this.s).flags['luogo_' + lid] = 1;      // la sua conversazione parte (una volta sola: la regola è nel motore chat)
        this.say(CAP[lid].arrivo, 'info');
        v.capSigns = CAP_SIGNS[lid].map((text, i) => ({ text, km: km + [0.3, 5, 9][i] }));        // tre cartelli sulla strada della capitale
        v.capEvKm = km;
      } else if (v.capIdx !== undefined && v.capIdx >= 0 && v.capIdx < CAP_PENS.length) {
        const k = 'tratto' + v.capIdx; v.capPens = v.capPens || {};
        if (!v.capPens[k] && this.vgThink) { v.capPens[k] = 1; this.vgThink(CAP_PENS[v.capIdx], true); }
        v.capIdx = -1; v.capSigns = [];
      }
    }
    if (!CAP[lid]) return;
    const sg = (v.capSigns || [])[0];
    if (sg && km >= sg.km && this.ents) { v.capSigns.shift(); this.ents.push({ id: this.id++, kind: 'vgsign', lane: 0, x: this.s.dist + 240, v: 0, text: sg.text, cap: true }); }
    if (this.inside && v.capIn !== this.inside.id + ':' + Math.round(this.inside.x)) { v.capIn = this.inside.id + ':' + Math.round(this.inside.x); const d = Object.keys(CAP_DOVE).find((k) => CAP_DOVE[k] === this.inside.id); if (d) evento(this, km, d); }
    if (!this.inside) { v.capIn = null; if (km - (v.capEvKm || 0) >= 2.5 && !this.prompt) evento(this, km, 'strada'); }
  };
})();
