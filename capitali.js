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
(function () {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype, orig = P.vgUpdate;
  P.vgUpdate = function (dt) {
    orig.call(this, dt);
    const v = this.s.vg, lid = this.loc && this.loc.id; if (!v || !lid || v.capLast === lid) return;
    v.capLast = lid;
    if (CAP[lid]) {
      v.capIdx = CAP_ORDER.indexOf(lid);
      if (typeof chatState === 'function') chatState(this.s).flags['luogo_' + lid] = 1;      // la sua conversazione parte (una volta sola: la regola è nel motore chat)
      this.say(CAP[lid].arrivo, 'info');
    } else if (v.capIdx !== undefined && v.capIdx >= 0 && v.capIdx < CAP_PENS.length) {
      const k = 'tratto' + v.capIdx; v.capPens = v.capPens || {};
      if (!v.capPens[k] && this.vgThink) { v.capPens[k] = 1; this.vgThink(CAP_PENS[v.capIdx]); }
      v.capIdx = -1;
    }
  };
})();
