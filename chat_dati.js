// ============================================================================
//  Night Run · Dati delle chat (generato da strumenti/importa_chat.py: non si modifica a mano)
//  Nodi di conversazione, quando partono e toni delle risposte. Il motore è in chat.js.
//  I toni sono PROVVISORI finché non arriva la tabella dei toni (--toni). I km di partenza sono SEGNAPOSTO.
// ============================================================================
const CHAT_LIST = [
{
"id":"ELE_ritiro_01",
"who":"Elena",
"fase":"I",
"text":"Allora, com’è?",
"alt":[
{
"req":"conf:Elena>=25",
"text":"Allora? Il giudizio vero, non la difesa della tua scelta."
},
{
"req":"flag:auto_panda",
"text":"La Panda? Voglio vedere anche lei, non soltanto il telo."
},
{
"req":"flag:auto_a80",
"text":"L’Audi di Claudio? Nel cassetto hai già trovato domande?"
},
{
"req":"flag:auto_v40",
"text":"La Volvo? Prima una foto intera, non il piano per riempirla."
},
{
"req":"flag:auto_punto",
"text":"La Punto? Almeno adesso ho un nome quando mi scrivi la macchina."
},
{
"req":"flag:auto_corsa",
"text":"Hai scelto la Corsa. Il nome non era un ordine, vero?"
},
{
"req":"flag:auto_polo",
"text":"La Polo? Mandami lei, non le altre cinque che ti mancano."
}
],
"opts":[
{
"t":"Parte. Mi sento già meno coglione.",
"to":"ELE_ritiro_02"
},
{
"t":"Ti faccio vedere anche cosa non mi convince.",
"to":"V2_E01_01",
"fx":[
"flag:e01b"
]
},
{
"t":"Ora niente foto, per favore.",
"to":"V2_E01_03",
"fx":[
"flag:e01c",
"sblocca:ELE_ritiro_08"
]
}
]
},
{
"id":"ELE_ritiro_02",
"who":"Elena",
"fase":"I",
"text":"Parte è una descrizione o un programma?",
"alt":[
{
"req":"flag:auto_panda",
"text":"La Panda parte. Bene. Adesso vediamo se ti lascia finire la frase."
},
{
"req":"flag:auto_a80",
"text":"L’Audi parte. Il resto della descrizione puoi farlo senza vendermela."
},
{
"req":"flag:auto_v40",
"text":"La Volvo parte. Per adesso è una descrizione onesta."
},
{
"req":"flag:auto_punto",
"text":"La Punto parte. Non è già una difesa di tutto il resto."
},
{
"req":"flag:auto_corsa",
"text":"La Corsa parte. Per ora ha già giustificato il nome."
},
{
"req":"flag:auto_polo",
"text":"La Polo parte. È già una notizia, ma non è tutto il giornale."
}
],
"opts":[
{
"t":"Il resto fa rumore.",
"to":"ELE_ritiro_03"
},
{
"t":"Per ora guardo e basta.",
"to":"ELE_ritiro_04"
}
]
},
{
"id":"ELE_ritiro_03",
"who":"Elena",
"fase":"I",
"text":"Hai controllato anche il resto?",
"opts":[
{
"t":"Prima un controllo.",
"to":"ELE_ritiro_05"
},
{
"t":"Prima la benzina.",
"to":"ELE_ritiro_05"
}
]
},
{
"id":"ELE_ritiro_04",
"who":"Elena",
"fase":"I",
"text":"Ti lascio godere i primi cinque minuti.",
"opts":[
{
"t":"Cinque minuti sono tanti.",
"to":"ELE_ritiro_05"
},
{
"t":"Il tempo di trovare una spia nuova.",
"to":"ELE_ritiro_05"
}
]
},
{
"id":"ELE_ritiro_05",
"who":"Elena",
"fase":"I",
"text":"Una sola tra sei. Tu eri già pronto a chiedere un rimorchio.",
"opts":[
{
"t":"Non prometto una foto bella.",
"to":"ELE_ritiro_06"
},
{
"t":"Ti scrivo dalla prima sosta.",
"to":"ELE_ritiro_07",
"fx":[
"flag:elena_sosta_promessa"
]
}
]
},
{
"id":"ELE_ritiro_06",
"who":"Elena",
"fase":"I",
"text":"Mandami un messaggio quando ti fermi.",
"opts":[
{
"t":"Te lo prometto.",
"to":"ELE_ritiro_08"
},
{
"t":"Se non prende, appena torna la linea.",
"to":"ELE_ritiro_08"
}
]
},
{
"id":"ELE_ritiro_07",
"who":"Elena",
"fase":"I",
"text":"Prima mettila in moto. Poi ti lamenti.",
"opts":[
{
"t":"Sto già brontolando?",
"to":"ELE_ritiro_08"
},
{
"t":"Va bene, ti aggiorno.",
"to":"ELE_ritiro_08"
},
{
"t":"Ti mando il dettaglio che avevo promesso.",
"to":"V2_E01_03",
"req":"flag:e01b"
}
]
},
{
"id":"ELE_ritiro_08",
"who":"Elena",
"fase":"I",
"text":"Va bene. Nonno, piano con tutte queste emozioni.",
"alt":[
{
"req":"flag:e01c",
"text":"Niente giudizi, come hai chiesto. Però quando vuoi mostrarla ci sono."
},
{
"req":"conf:Elena>=50",
"text":"Nonno, ammetti che ti piace. Gli arretrati li lasciamo."
}
]
},
{
"id":"ELE_pasta_01",
"who":"Elena",
"fase":"I",
"text":"Pasta ha deciso che la casa è sua.",
"opts":[
{
"t":"Ha dei diritti.",
"to":"ELE_pasta_02",
"fx":[
"flag:elena_difende_pasta"
]
},
{
"t":"Ti serve aiuto o soltanto un testimone contro il gatto?",
"to":"V2_E02_01",
"fx":[
"flag:e02b"
]
},
{
"t":"Non ho testa per il gatto, oggi.",
"to":"V2_E02_03",
"fx":[
"flag:e02c",
"sblocca:ELE_pasta_08"
]
}
]
},
{
"id":"ELE_pasta_02",
"who":"Elena",
"fase":"I",
"text":"Non serve che lo difendi ogni volta.",
"opts":[
{
"t":"Uno solo: stare comodo.",
"to":"ELE_pasta_04"
},
{
"t":"Non sto difendendo nessuno.",
"to":"ELE_pasta_05"
}
]
},
{
"id":"ELE_pasta_03",
"who":"Elena",
"fase":"I",
"text":"Sì, il gatto. Non la cena.",
"opts":[
{
"t":"Hai scelto tu il nome.",
"to":"ELE_pasta_04"
},
{
"t":"Allora niente, pensavo avessi mangiato.",
"to":"ELE_pasta_05"
}
]
},
{
"id":"ELE_pasta_04",
"who":"Elena",
"fase":"I",
"text":"Vorrei soltanto sedermi senza trattare.",
"alt":[
{
"req":"conf:Elena>=25",
"text":"Vorrei sedermi senza dover chiedere udienza a Pasta."
}
],
"opts":[
{
"t":"Digli che arrivo a mediare.",
"to":"ELE_pasta_06"
},
{
"t":"Puoi anche spostarlo.",
"to":"ELE_pasta_07"
}
]
},
{
"id":"ELE_pasta_05",
"who":"Elena",
"fase":"I",
"text":"Stai ridendo. Lo capisco da come scrivi, stronzo.",
"opts":[
{
"t":"Siamo almeno in due a ridere.",
"to":"ELE_pasta_06"
},
{
"t":"Tu avresti riso uguale.",
"to":"ELE_pasta_07"
}
]
},
{
"id":"ELE_pasta_06",
"who":"Elena",
"fase":"I",
"text":"Sei dalla sua parte, ho capito.",
"opts":[
{
"t":"Lo ammetto.",
"to":"ELE_pasta_08"
},
{
"t":"Solo finché non prende il mio posto.",
"to":"ELE_pasta_08"
}
]
},
{
"id":"ELE_pasta_07",
"who":"Elena",
"fase":"I",
"text":"Almeno tu chiedi prima di prendermi il posto.",
"opts":[
{
"t":"Io mando un messaggio.",
"to":"ELE_pasta_08"
},
{
"t":"Non dargli altre idee.",
"to":"ELE_pasta_08"
},
{
"t":"Oggi posso ascoltare il resto del processo.",
"to":"V2_E02_03",
"req":"flag:e02b"
}
]
},
{
"id":"ELE_pasta_08",
"who":"Elena",
"fase":"I",
"text":"Guida. Qui con Pasta ci parlo io.",
"alt":[
{
"req":"flag:e02c",
"text":"Oggi niente gatto, come hai chiesto. Ti scrivo solo se serve."
}
]
},
{
"id":"ELE_turno_01",
"who":"Elena",
"fase":"I",
"text":"Hai presente un turno con un orario sensato?",
"opts":[
{
"t":"Solo nei contratti. Quei figli di puttana.",
"to":"ELE_turno_02"
},
{
"t":"Decidiamo come sentirci senza rincorrerci.",
"to":"V2_E03_01",
"fx":[
"flag:e03b"
]
},
{
"t":"Niente turni, oggi.",
"to":"V2_E03_03",
"fx":[
"flag:e03c",
"sblocca:ELE_turno_08"
]
}
]
},
{
"id":"ELE_turno_02",
"who":"Elena",
"fase":"I",
"text":"Ecco. Io oggi preferisco non pensarci.",
"opts":[
{
"t":"Che turno hai?",
"to":"ELE_turno_03"
},
{
"t":"Vuoi che ti lasci tranquilla?",
"to":"ELE_turno_04"
}
]
},
{
"id":"ELE_turno_03",
"who":"Elena",
"fase":"I",
"text":"Lavoro. Senza la parte in cui ti organizzi la giornata.",
"opts":[
{
"t":"Non ti fisso un orario, allora.",
"to":"ELE_turno_05"
},
{
"t":"Aspetto che chiami tu.",
"to":"ELE_turno_05"
}
]
},
{
"id":"ELE_turno_04",
"who":"Elena",
"fase":"I",
"text":"Non devi sistemarmi il calendario da una macchina.",
"opts":[
{
"t":"Era un’offerta, non un ordine.",
"to":"ELE_turno_05"
},
{
"t":"Va bene, niente calendario.",
"to":"ELE_turno_05"
}
]
},
{
"id":"ELE_turno_05",
"who":"Elena",
"fase":"I",
"text":"Quando ti fermi scrivimi. Se lavoro rispondo dopo.",
"alt":[
{
"req":"conf:Elena>=50",
"text":"Scrivi quando puoi. Se lavoro rispondo dopo."
}
],
"opts":[
{
"t":"Ti mando un messaggio.",
"to":"ELE_turno_06"
},
{
"t":"Se serve ti chiamo una volta.",
"to":"ELE_turno_07"
}
]
},
{
"id":"ELE_turno_06",
"who":"Elena",
"fase":"I",
"text":"Bravo. Il telefono non è un citofono.",
"opts":[
{
"t":"Poi aspetto.",
"to":"ELE_turno_08"
},
{
"t":"Promesso, niente raffica.",
"to":"ELE_turno_08"
}
]
},
{
"id":"ELE_turno_07",
"who":"Elena",
"fase":"I",
"text":"Una chiamata basta, Nonno.",
"opts":[
{
"t":"Una. Ho capito.",
"to":"ELE_turno_08"
},
{
"t":"E non ti prenoto la serata.",
"to":"ELE_turno_08"
},
{
"t":"Come d’accordo: un messaggio, senza prenotarti.",
"to":"V2_E03_03",
"req":"flag:e03b"
}
]
},
{
"id":"ELE_turno_08",
"who":"Elena",
"fase":"I",
"text":"Adesso vai. Io cerco di capire quando mangiare.",
"alt":[
{
"req":"flag:e03c",
"text":"Il turno lo gestisco io. Prima mi hai chiesto di non coinvolgerti."
}
]
},
{
"id":"ELE_coinquilino_01",
"who":"Elena",
"fase":"I",
"text":"Il mio coinquilino parla. Io avrei un turno da superare.",
"opts":[
{
"t":"Quanto parla?",
"to":"ELE_coinquilino_02"
},
{
"t":"Fagli scrivere due righe. Voglio verificare.",
"to":"V2_E04_01",
"fx":[
"flag:e04b"
]
},
{
"t":"Non reggo altri sfoghi.",
"to":"V2_E04_03",
"fx":[
"flag:e04c",
"sblocca:ELE_coinquilino_08"
]
}
]
},
{
"id":"ELE_coinquilino_02",
"who":"Elena",
"fase":"I",
"text":"No, non è cattivo. È una riunione che abita qui.",
"opts":[
{
"t":"Ti ascolto e basta.",
"to":"ELE_coinquilino_04"
},
{
"t":"Posso suggerire una fuga?",
"to":"ELE_coinquilino_05"
}
]
},
{
"id":"ELE_coinquilino_03",
"who":"Elena",
"fase":"I",
"text":"Non gli giro la chat. Voglio bene anche a te, purtroppo.",
"opts":[
{
"t":"Allora racconta tu.",
"to":"ELE_coinquilino_04"
},
{
"t":"Mi hai tolto una curiosità.",
"to":"ELE_coinquilino_05"
}
]
},
{
"id":"ELE_coinquilino_04",
"who":"Elena",
"fase":"I",
"text":"Sto solo sfogandomi. Tra poco mi passa.",
"opts":[
{
"t":"Va bene. Sfogati.",
"to":"ELE_coinquilino_06"
},
{
"t":"Poi passiamo a qualcosa di meglio.",
"to":"ELE_coinquilino_07"
}
]
},
{
"id":"ELE_coinquilino_05",
"who":"Elena",
"fase":"I",
"text":"Tu intanto sei scappato in autostrada.",
"opts":[
{
"t":"Non esattamente una fuga riuscita.",
"to":"ELE_coinquilino_06"
},
{
"t":"Ti tengo compagnia ancora un po’.",
"to":"ELE_coinquilino_07"
}
]
},
{
"id":"ELE_coinquilino_06",
"who":"Elena",
"fase":"I",
"text":"Grazie. Due minuti senza consigli fanno miracoli.",
"alt":[
{
"req":"conf:Elena>=50",
"text":"Con te posso lamentarmi senza una riunione."
}
],
"opts":[
{
"t":"Non devo riparare anche questo.",
"to":"ELE_coinquilino_08"
},
{
"t":"Ti lascio lo spazio.",
"to":"ELE_coinquilino_08"
}
]
},
{
"id":"ELE_coinquilino_07",
"who":"Elena",
"fase":"I",
"text":"Nonno, non serve un piano per ogni conversazione.",
"opts":[
{
"t":"Tolgo il piano.",
"to":"ELE_coinquilino_08"
},
{
"t":"Almeno su questo hai ragione.",
"to":"ELE_coinquilino_08"
},
{
"t":"Stavolta niente consigli: finisci il discorso.",
"to":"V2_E04_03",
"req":"flag:e04b"
}
]
},
{
"id":"ELE_coinquilino_08",
"who":"Elena",
"fase":"I",
"text":"Vado. Ti riscrivo quando ho qualcosa di meno noioso.",
"alt":[
{
"req":"flag:e04c",
"text":"Lo sfogo lo tengo per dopo. Prima mi hai detto che eri pieno."
}
]
},
{
"id":"ELE_cena_01",
"who":"Elena",
"fase":"I",
"text":"Riesci a dirmi se torni per cena?",
"opts":[
{
"t":"Non lo so ancora.",
"to":"ELE_cena_02"
},
{
"t":"Mangia senza aspettarmi. Niente orario finto.",
"to":"V2_E05_01",
"fx":[
"flag:e05b"
]
},
{
"t":"Non chiedermelo più stasera.",
"to":"V2_E05_03",
"fx":[
"flag:e05c",
"sblocca:ELE_cena_08"
]
}
]
},
{
"id":"ELE_cena_02",
"who":"Elena",
"fase":"I",
"text":"Puoi anche dirmi che non lo sai.",
"opts":[
{
"t":"Ti avviso dalla sosta.",
"to":"ELE_cena_03"
},
{
"t":"Mangia senza aspettarmi.",
"to":"ELE_cena_04"
}
]
},
{
"id":"ELE_cena_03",
"who":"Elena",
"fase":"I",
"text":"Va bene. Preferisco quello a un orario inventato.",
"opts":[
{
"t":"Meglio così.",
"to":"ELE_cena_05"
},
{
"t":"Appena posso ti scrivo.",
"to":"ELE_cena_05"
}
]
},
{
"id":"ELE_cena_04",
"who":"Elena",
"fase":"I",
"text":"Lo sapevo. Prima cena e poi magari arrivi domani.",
"opts":[
{
"t":"Non avevo promesso domani.",
"to":"ELE_cena_05"
},
{
"t":"Quindi hai capito il problema.",
"to":"ELE_cena_05"
}
]
},
{
"id":"ELE_cena_05",
"who":"Elena",
"fase":"I",
"text":"Quando sei fermo mi aggiorni. Non mentre guidi.",
"opts":[
{
"t":"Aspetta il mio messaggio, non me.",
"to":"ELE_cena_06"
},
{
"t":"Mangia. Non fare tardi per me.",
"to":"ELE_cena_07",
"fx":[
"flag:elena_non_aspettare"
]
}
]
},
{
"id":"ELE_cena_06",
"who":"Elena",
"fase":"I",
"text":"Perfetto. Così non ti aspetto con il piatto in mano.",
"alt":[
{
"req":"conf:Elena>=25",
"text":"Perfetto. Mi tolgo l’attesa dal tavolo, non te."
}
],
"opts":[
{
"t":"Ci siamo capiti.",
"to":"ELE_cena_08"
},
{
"t":"Ti scrivo comunque.",
"to":"ELE_cena_08"
}
]
},
{
"id":"ELE_cena_07",
"who":"Elena",
"fase":"I",
"text":"Nonno, non mangio per tenerti compagnia a distanza.",
"opts":[
{
"t":"Meno male.",
"to":"ELE_cena_08"
},
{
"t":"Era l’ultima cosa che volevo.",
"to":"ELE_cena_08"
},
{
"t":"Senza aspettarmi, come avevamo deciso.",
"to":"V2_E05_03",
"req":"flag:e05b"
}
]
},
{
"id":"ELE_cena_08",
"who":"Elena",
"fase":"I",
"text":"Ci sentiamo alla sosta. Io intanto mangio.",
"alt":[
{
"req":"flag:e05c",
"text":"Non ti chiedo più della cena. Aspetto che sia tu ad aggiornarmi."
}
]
},
{
"id":"ELE_bollette_01",
"who":"Elena",
"fase":"I",
"text":"Un’auto ereditata è gratis finché non la accendi.",
"opts":[
{
"t":"Anche tu hai aperto una bolletta?",
"to":"ELE_bollette_02"
},
{
"t":"Aspetta, ho risposto come se mi stessi chiedendo soldi.",
"to":"V2_E06_01",
"fx":[
"flag:e06b"
]
},
{
"t":"Oggi non voglio parlare di soldi.",
"to":"V2_E06_03",
"fx":[
"flag:e06c",
"sblocca:ELE_bollette_08"
]
}
]
},
{
"id":"ELE_bollette_02",
"who":"Elena",
"fase":"I",
"text":"No, la bolletta non diventa più simpatica se non la apro.",
"opts":[
{
"t":"Hai ragione. Lamentati pure.",
"to":"ELE_bollette_04"
},
{
"t":"Non apriamo anche il mio conto.",
"to":"ELE_bollette_05"
}
]
},
{
"id":"ELE_bollette_03",
"who":"Elena",
"fase":"I",
"text":"Non era una richiesta di soldi. Era una lamentela.",
"opts":[
{
"t":"Ricevuto. Ti ascolto.",
"to":"ELE_bollette_04"
},
{
"t":"Era una battuta riuscita male.",
"to":"ELE_bollette_05"
}
]
},
{
"id":"ELE_bollette_04",
"who":"Elena",
"fase":"I",
"text":"Tu hai già fatto il conto di quello che va sistemato?",
"opts":[
{
"t":"Solo il necessario.",
"to":"ELE_bollette_06"
},
{
"t":"Sto ancora cercando di capirlo.",
"to":"ELE_bollette_07"
}
]
},
{
"id":"ELE_bollette_05",
"who":"Elena",
"fase":"I",
"text":"Mi basta che non compri tutto nella prima officina.",
"opts":[
{
"t":"Controllo prima di spendere.",
"to":"ELE_bollette_06"
},
{
"t":"Posso rimandare il superfluo.",
"to":"ELE_bollette_07"
}
]
},
{
"id":"ELE_bollette_06",
"who":"Elena",
"fase":"I",
"text":"Ecco. Una cosa alla volta, senza fare il fenomeno.",
"opts":[
{
"t":"Per una volta sì.",
"to":"ELE_bollette_08"
},
{
"t":"Mi faccio dire cosa serve.",
"to":"ELE_bollette_08"
}
]
},
{
"id":"ELE_bollette_07",
"who":"Elena",
"fase":"I",
"text":"Il conto poi lo guardi da seduto. Consiglio gratuito.",
"opts":[
{
"t":"Lo tengo. È l’unico gratuito.",
"to":"ELE_bollette_08"
},
{
"t":"Ti aggiorno senza mandarti la fattura.",
"to":"ELE_bollette_08"
},
{
"t":"Come prima: ascolto, senza aprire il portafoglio.",
"to":"V2_E06_03",
"req":"flag:e06b"
}
]
},
{
"id":"ELE_bollette_08",
"who":"Elena",
"fase":"I",
"text":"Adesso ti lascio ai tuoi rumori. Io ho le mie carte.",
"alt":[
{
"req":"flag:e06c",
"text":"Niente conti, come hai chiesto. Niente fatture per la compagnia."
},
{
"req":"conf:Elena>=50",
"text":"Vai. Le carte le odio io; ai rumori pensaci tu, con calma."
}
]
},
{
"id":"ELE_richiamo_01",
"who":"Elena",
"fase":"II",
"text":"Sei fermo adesso?",
"opts":[
{
"t":"Sì. E ti dovevo un messaggio.",
"to":"ELE_richiamo_02"
},
{
"t":"Non ti ho scritto perché non sapevo cosa dirti.",
"to":"V2_E07_01",
"fx":[
"flag:e07b"
]
},
{
"t":"Non chiedermi altro stasera.",
"to":"V2_E07_03",
"fx":[
"flag:e07c",
"sblocca:ELE_richiamo_08"
]
}
]
},
{
"id":"ELE_richiamo_02",
"who":"Elena",
"fase":"II",
"text":"Mi avevi detto che avresti scritto dalla sosta.",
"alt":[
{
"req":"flag:elena_sosta_promessa",
"text":"La sosta l’avevi promessa tu."
}
],
"opts":[
{
"t":"Hai ragione. Ho rimandato troppo.",
"to":"ELE_richiamo_04"
},
{
"t":"Non volevo chiamare guidando.",
"to":"ELE_richiamo_04"
}
]
},
{
"id":"ELE_richiamo_03",
"who":"Elena",
"fase":"II",
"text":"Almeno stavolta mi scrivi da fermo.",
"opts":[
{
"t":"Sto bene. Sono solo in ritardo.",
"to":"ELE_richiamo_05"
},
{
"t":"Ho bisogno di fermarmi un po’.",
"to":"ELE_richiamo_05"
}
]
},
{
"id":"ELE_richiamo_04",
"who":"Elena",
"fase":"II",
"text":"Non mi serve una cronaca. Mi basta sapere che stai bene.",
"opts":[
{
"t":"Sto bene. Te lo dico sul serio.",
"to":"ELE_richiamo_06"
},
{
"t":"Sono teso. Non con te.",
"to":"ELE_richiamo_06"
}
]
},
{
"id":"ELE_richiamo_05",
"who":"Elena",
"fase":"II",
"text":"Se sei stanco, dillo. Non ti faccio un processo.",
"opts":[
{
"t":"Sono stanco.",
"to":"ELE_richiamo_07"
},
{
"t":"Non ho ancora capito la strada.",
"to":"ELE_richiamo_07"
}
]
},
{
"id":"ELE_richiamo_06",
"who":"Elena",
"fase":"II",
"text":"Grazie. Era tutto qui.",
"alt":[
{
"req":"conf:Elena>=75",
"text":"Grazie. Non mi serviva una versione migliore di come stai."
}
],
"opts":[
{
"t":"Ti aggiorno senza sparire.",
"to":"ELE_richiamo_08"
},
{
"t":"Non prometto un orario.",
"to":"ELE_richiamo_08"
}
]
},
{
"id":"ELE_richiamo_07",
"who":"Elena",
"fase":"II",
"text":"Nonno, puoi anche non avere già la soluzione.",
"opts":[
{
"t":"È quello che sto imparando.",
"to":"ELE_richiamo_08"
},
{
"t":"Ci provo.",
"to":"ELE_richiamo_08"
},
{
"t":"Ti scrivo non so, come avevamo detto.",
"to":"V2_E07_03",
"req":"flag:e07b"
}
]
},
{
"id":"ELE_richiamo_08",
"who":"Elena",
"fase":"II",
"text":"Mangia qualcosa. Mi scrivi quando riparti, se puoi.",
"alt":[
{
"req":"flag:e07c",
"text":"Ti lascio spazio, come hai chiesto. Non confonderlo con non esserci."
}
]
},
{
"id":"ELE_litigio_01",
"who":"Elena",
"fase":"II",
"text":"Mi rispondi come se fossi io a chiuderti le strade.",
"opts":[
{
"t":"Scusa. Non ce l’ho con te.",
"to":"ELE_litigio_02",
"fx":[
"flag:elena_scuse"
]
},
{
"t":"Scusa. Ti ho usata per scaricare la serata.",
"to":"V2_E08_01",
"fx":[
"flag:e08b"
]
},
{
"t":"Smetto di rispondere per stasera.",
"to":"V2_E08_03",
"fx":[
"flag:e08c",
"sblocca:ELE_litigio_08"
]
}
]
},
{
"id":"ELE_litigio_02",
"who":"Elena",
"fase":"II",
"text":"Non ti sto chiedendo di tornare in cinque minuti.",
"opts":[
{
"t":"Ti ho risposto male.",
"to":"ELE_litigio_04"
},
{
"t":"Lo so. Mi sembra tutto una richiesta.",
"to":"ELE_litigio_05"
}
]
},
{
"id":"ELE_litigio_03",
"who":"Elena",
"fase":"II",
"text":"Va bene essere stanco. Non mi piace essere il bersaglio.",
"opts":[
{
"t":"Scusa. Mi fermo un momento.",
"to":"ELE_litigio_04",
"fx":[
"flag:elena_scuse"
]
},
{
"t":"Sentiamoci quando siamo più calmi.",
"to":"ELE_litigio_05"
}
]
},
{
"id":"ELE_litigio_04",
"who":"Elena",
"fase":"II",
"text":"Dimmi cosa posso fare adesso, senza tirare a indovinare.",
"opts":[
{
"t":"Stammi un po’ al telefono.",
"to":"ELE_litigio_06"
},
{
"t":"Per ora lasciami fermare.",
"to":"ELE_litigio_07"
}
]
},
{
"id":"ELE_litigio_05",
"who":"Elena",
"fase":"II",
"text":"Possiamo anche sentirci dopo. Senza sparire per dispetto.",
"opts":[
{
"t":"Ti scrivo io dopo.",
"to":"ELE_litigio_06"
},
{
"t":"Non è un modo per mandarti via.",
"to":"ELE_litigio_07"
}
]
},
{
"id":"ELE_litigio_06",
"who":"Elena",
"fase":"II",
"text":"Resto qui un minuto. Poi posa il telefono e riposa.",
"opts":[
{
"t":"Grazie. Adesso mi basta.",
"to":"ELE_litigio_08"
},
{
"t":"Se non scrivo, resta un momento.",
"to":"ELE_litigio_08"
}
]
},
{
"id":"ELE_litigio_07",
"who":"Elena",
"fase":"II",
"text":"Va bene. Ci richiamiamo quando ci passa.",
"opts":[
{
"t":"Ti scrivo dopo davvero.",
"to":"ELE_litigio_08"
},
{
"t":"Va bene. Niente dispetti.",
"to":"ELE_litigio_08"
},
{
"t":"La scusa resta, anche se sei ancora arrabbiata.",
"to":"V2_E08_03",
"req":"flag:e08b"
}
]
},
{
"id":"ELE_litigio_08",
"who":"Elena",
"fase":"II",
"text":"Nonno, la prossima volta comincia con sono stanco.",
"alt":[
{
"req":"flag:e08c",
"text":"Non ricomincio il litigio. Prima mi hai chiesto di fermarci qui."
},
{
"req":"conf:Elena>=75",
"text":"Nonno, prima scrivi sono stanco. Evitiamo un’altra lite."
}
]
},
{
"id":"ELE_distanza_01",
"who":"Elena",
"fase":"II",
"text":"Questa foto da dove l’hai presa?",
"opts":[
{
"t":"L’ho scattata io.",
"to":"ELE_distanza_02"
},
{
"t":"Ti mando il dettaglio del posto, non solo il nome.",
"to":"V2_E09_01",
"fx":[
"flag:e09b"
]
},
{
"t":"Basta controlli. Voglio arrivare.",
"to":"V2_E09_03",
"fx":[
"flag:e09c",
"sblocca:ELE_distanza_08"
]
}
]
},
{
"id":"ELE_distanza_02",
"who":"Elena",
"fase":"II",
"text":"Non dirmi solo sono qui. Fammi capire.",
"opts":[
{
"t":"Sono fermo. Controlla con calma.",
"to":"ELE_distanza_03"
},
{
"t":"Confronta il riferimento nella foto.",
"to":"ELE_distanza_04"
}
]
},
{
"id":"ELE_distanza_03",
"who":"Elena",
"fase":"II",
"text":"Aspetta. Controllo il posto, non la tua memoria.",
"opts":[
{
"t":"Dimmi quello che trovi.",
"to":"ELE_distanza_05"
},
{
"t":"Non voglio che mi credi per forza.",
"to":"ELE_distanza_05"
}
]
},
{
"id":"ELE_distanza_04",
"who":"Elena",
"fase":"II",
"text":"Va bene. Quindi la foto l’hai scattata adesso.",
"opts":[
{
"t":"Sì, adesso.",
"to":"ELE_distanza_05"
},
{
"t":"Non è una foto vecchia.",
"to":"ELE_distanza_05"
}
]
},
{
"id":"ELE_distanza_05",
"who":"Elena",
"fase":"II",
"text":"Il riferimento del luogo corrisponde. Non so spiegarti la distanza.",
"opts":[
{
"t":"Non cambiamo le date.",
"to":"ELE_distanza_06",
"fx":[
"cnt:conoscenza+1",
"flag:distanza_confermata"
]
},
{
"t":"Il luogo coincide.",
"to":"ELE_distanza_07",
"fx":[
"cnt:conoscenza+1",
"flag:distanza_confermata"
]
}
]
},
{
"id":"ELE_distanza_06",
"who":"Elena",
"fase":"II",
"text":"Non facciamo altre prove mentre guidi.",
"opts":[
{
"t":"Resto fermo.",
"to":"ELE_distanza_08"
},
{
"t":"Chiudo appena devo ripartire.",
"to":"ELE_distanza_08"
}
]
},
{
"id":"ELE_distanza_07",
"who":"Elena",
"fase":"II",
"text":"Preferisco un messaggio corto da fermo a un ti spiego mentre guidi.",
"opts":[
{
"t":"Va bene. Leggo quello che trovi.",
"to":"ELE_distanza_08"
},
{
"t":"Almeno su questo siamo d’accordo.",
"to":"ELE_distanza_08"
},
{
"t":"Riprendiamo il particolare che ti avevo mandato.",
"to":"V2_E09_03",
"req":"flag:e09b"
}
]
},
{
"id":"ELE_distanza_08",
"who":"Elena",
"fase":"II",
"text":"Ok. Resta lì un momento. Non fare cose.",
"alt":[
{
"req":"flag:e09c",
"text":"Avevi fermato il confronto. Per riprenderlo, mandami il dettaglio."
},
{
"req":"conf:Elena>=75",
"text":"Ti credo. Fermati: capiamo senza metterti fretta."
},
{
"req":"flag:distanza_confermata",
"text":"Il luogo coincide. Non aggiustiamo la distanza."
}
]
},
{
"id":"ELE_riparazione_01",
"who":"Elena",
"fase":"III",
"text":"Ci siamo calmati?",
"opts":[
{
"t":"Io sì. Ti dovevo un messaggio decente.",
"to":"ELE_riparazione_02"
},
{
"t":"Ho chiesto scusa. Non cancella tutto.",
"to":"V2_E10_01",
"fx":[
"flag:e10b"
]
},
{
"t":"Ne ho abbastanza. Basta.",
"to":"V2_E10_03",
"fx":[
"flag:e10c",
"sblocca:ELE_riparazione_08"
]
}
]
},
{
"id":"ELE_riparazione_02",
"who":"Elena",
"fase":"III",
"text":"Prima mi hai chiesto scusa.",
"alt":[
{
"req":"flag:elena_scuse",
"text":"Mi hai chiesto scusa. Riparto senza cancellare il prima."
}
],
"opts":[
{
"t":"Era vero. Ti ho risposto male.",
"to":"ELE_riparazione_04"
},
{
"t":"Lo penso ancora. Non era colpa tua.",
"to":"ELE_riparazione_04"
}
]
},
{
"id":"ELE_riparazione_03",
"who":"Elena",
"fase":"III",
"text":"Ripartiamo da adesso. Senza rifare tutta la discussione.",
"opts":[
{
"t":"Va bene. Ti dico come sto.",
"to":"ELE_riparazione_05"
},
{
"t":"Non ricominciamo il litigio.",
"to":"ELE_riparazione_05"
}
]
},
{
"id":"ELE_riparazione_04",
"who":"Elena",
"fase":"III",
"text":"Allora dimmelo quando sei stanco. Posso capirlo.",
"opts":[
{
"t":"Te lo dico prima di sbottare.",
"to":"ELE_riparazione_06"
},
{
"t":"Ci provo, senza promettere miracoli.",
"to":"ELE_riparazione_06"
}
]
},
{
"id":"ELE_riparazione_05",
"who":"Elena",
"fase":"III",
"text":"Questa volta niente orario preciso, va bene?",
"opts":[
{
"t":"Nessun orario inventato.",
"to":"ELE_riparazione_07"
},
{
"t":"Ti aggiorno dalla prossima sosta.",
"to":"ELE_riparazione_07"
}
]
},
{
"id":"ELE_riparazione_06",
"who":"Elena",
"fase":"III",
"text":"Leggo. Non devi scrivermi tutto insieme.",
"opts":[
{
"t":"Sono stanco, ma sono fermo.",
"to":"ELE_riparazione_08"
},
{
"t":"Ho trovato qualcuno che mi aiuta con l’auto.",
"to":"ELE_riparazione_08"
}
]
},
{
"id":"ELE_riparazione_07",
"who":"Elena",
"fase":"III",
"text":"Va bene anche poco. Purché non sia tutto va tutto bene.",
"opts":[
{
"t":"Ti dico almeno una cosa vera.",
"to":"ELE_riparazione_08"
},
{
"t":"Non lo uso più come risposta automatica.",
"to":"ELE_riparazione_08"
},
{
"t":"Non mi aspetto il ripristino. Come avevamo detto.",
"to":"V2_E10_03",
"req":"flag:e10b"
}
]
},
{
"id":"ELE_riparazione_08",
"who":"Elena",
"fase":"III",
"text":"Ci sentiamo. E mangia: non è un’opinione.",
"alt":[
{
"req":"flag:e10c",
"text":"Prima mi hai chiesto di non tornarci. Sto cercando di rispettarlo."
},
{
"req":"conf:Elena>=100",
"text":"Mangia. Poi scrivi sono qui. Mi basta per ripartire."
}
]
},
{
"id":"ELE_nonno_01",
"who":"Elena",
"fase":"IV",
"text":"Nonno, hai finito di discutere anche con il navigatore?",
"opts":[
{
"t":"Mi prende in giro lui per primo.",
"to":"ELE_nonno_02"
},
{
"t":"Per oggi puoi non chiamarmi così? Non ce l’ho con te.",
"to":"V2_E11_01",
"fx":[
"flag:e11b"
]
},
{
"t":"Quel soprannome non lo voglio più.",
"to":"V2_E11_03",
"fx":[
"flag:e11c",
"sblocca:ELE_nonno_08"
]
}
]
},
{
"id":"ELE_nonno_02",
"who":"Elena",
"fase":"IV",
"text":"Lo uso perché brontoli. Non è un titolo onorifico.",
"opts":[
{
"t":"Me lo ricordo.",
"to":"ELE_nonno_03"
},
{
"t":"Era chiaro dal trattamento.",
"to":"ELE_nonno_04"
}
]
},
{
"id":"ELE_nonno_03",
"who":"Elena",
"fase":"IV",
"text":"Non mi offendo se non ti fa ridere oggi.",
"opts":[
{
"t":"Non sei tu il problema.",
"to":"ELE_nonno_05"
},
{
"t":"Ti chiedo solo una pausa.",
"to":"ELE_nonno_05"
}
]
},
{
"id":"ELE_nonno_04",
"who":"Elena",
"fase":"IV",
"text":"Claudio ti chiamava così da quando avevi otto anni.",
"opts":[
{
"t":"Sì. Non era nato da te.",
"to":"ELE_nonno_05"
},
{
"t":"E tu non te lo sei lasciato scappare.",
"to":"ELE_nonno_05"
}
]
},
{
"id":"ELE_nonno_05",
"who":"Elena",
"fase":"IV",
"text":"Io ci scherzo. Non mi hai mai sentito dirlo tutta dolce.",
"opts":[
{
"t":"Appunto. Volevo sentirlo da te.",
"to":"ELE_nonno_06",
"fx":[
"flag:nonno_uso_fissato"
]
},
{
"t":"Mi ricordavo la differenza.",
"to":"ELE_nonno_07",
"fx":[
"flag:nonno_uso_fissato"
]
}
]
},
{
"id":"ELE_nonno_06",
"who":"Elena",
"fase":"IV",
"text":"Perché ti interessa tanto il tono?",
"opts":[
{
"t":"Sono stanco. Sto facendo confusione.",
"to":"ELE_nonno_08"
},
{
"t":"Mi aiuta mettere in ordine le cose.",
"to":"ELE_nonno_08"
}
]
},
{
"id":"ELE_nonno_07",
"who":"Elena",
"fase":"IV",
"text":"Va bene. Per oggi ti lascio il nome che non diciamo.",
"opts":[
{
"t":"Grazie. Domani puoi ricominciare.",
"to":"ELE_nonno_08"
},
{
"t":"Va bene. Quello non lo usi nessuno.",
"to":"ELE_nonno_08"
},
{
"t":"Solo per oggi, come ti avevo chiesto.",
"to":"V2_E11_03",
"req":"flag:e11b"
}
]
},
{
"id":"ELE_nonno_08",
"who":"Elena",
"fase":"IV",
"text":"Adesso riposa. Litighi meglio quando hai dormito.",
"alt":[
{
"req":"flag:e11c",
"text":"Non uso il soprannome. Me l’hai chiesto e non era una battuta."
}
]
},
{
"id":"ELE_cena_ritorno_01",
"who":"Elena",
"fase":"V",
"text":"Prima che ricominci: ho mangiato.",
"opts":[
{
"t":"Bene. Era quello che ti avevo chiesto.",
"to":"ELE_cena_ritorno_02"
},
{
"t":"Non so quando torno. Mi manca la normalità.",
"to":"V2_E12_01",
"fx":[
"flag:e12b"
]
},
{
"t":"Oggi non racconto altro.",
"to":"V2_E12_03",
"fx":[
"flag:e12c",
"sblocca:ELE_cena_ritorno_08"
]
}
]
},
{
"id":"ELE_cena_ritorno_02",
"who":"Elena",
"fase":"V",
"text":"Mi avevi detto di non aspettarti.",
"alt":[
{
"req":"flag:elena_non_aspettare",
"text":"Mi avevi detto di non aspettarti. Ho mangiato."
}
],
"opts":[
{
"t":"E lo penso ancora.",
"to":"ELE_cena_ritorno_04"
},
{
"t":"Non volevo tenerti in sospeso.",
"to":"ELE_cena_ritorno_04"
}
]
},
{
"id":"ELE_cena_ritorno_03",
"who":"Elena",
"fase":"V",
"text":"Non serve che fai una promessa per ogni telefonata.",
"opts":[
{
"t":"Niente promesse nuove.",
"to":"ELE_cena_ritorno_05"
},
{
"t":"Ti dico solo quello che so.",
"to":"ELE_cena_ritorno_05"
}
]
},
{
"id":"ELE_cena_ritorno_04",
"who":"Elena",
"fase":"V",
"text":"Una cosa la puoi fare: dirmi se ti fermi.",
"opts":[
{
"t":"Mi fermo prima di chiamarti.",
"to":"ELE_cena_ritorno_06"
},
{
"t":"Se riparto te lo scrivo.",
"to":"ELE_cena_ritorno_06"
}
]
},
{
"id":"ELE_cena_ritorno_05",
"who":"Elena",
"fase":"V",
"text":"Non è una gara a chi resiste più sveglio.",
"opts":[
{
"t":"Ho smesso di trattarla come una gara.",
"to":"ELE_cena_ritorno_07"
},
{
"t":"Lo so. Mi manca sentirlo dire.",
"to":"ELE_cena_ritorno_07"
}
]
},
{
"id":"ELE_cena_ritorno_06",
"who":"Elena",
"fase":"V",
"text":"Ecco. Questo è un aggiornamento che capisco.",
"opts":[
{
"t":"Sono fermo adesso.",
"to":"ELE_cena_ritorno_08"
},
{
"t":"Per oggi basta guidare senza pensare.",
"to":"ELE_cena_ritorno_08"
}
]
},
{
"id":"ELE_cena_ritorno_07",
"who":"Elena",
"fase":"V",
"text":"Nonno, puoi tornare anche senza una storia da raccontare.",
"opts":[
{
"t":"Mi basta tornare.",
"to":"ELE_cena_ritorno_08"
},
{
"t":"Una cosa da raccontarti ce l’ho.",
"to":"ELE_cena_ritorno_08"
},
{
"t":"Una cosa piccola, come avevamo deciso.",
"to":"V2_E12_03",
"req":"flag:e12b"
}
]
},
{
"id":"ELE_cena_ritorno_08",
"who":"Elena",
"fase":"V",
"text":"Scrivimi quando puoi. Io sono qui.",
"alt":[
{
"req":"flag:e12c",
"text":"Oggi niente domande, come hai scelto. Il posto nella chat resta."
},
{
"req":"conf:Elena>=100",
"text":"Sono qui. Non serve una bella storia per tornare a scrivermi."
}
]
},
{
"id":"ELE_temperino_fissato",
"who":"Elena",
"fase":"I",
"text":"Con le chiavi ti hanno dato altro?",
"opts":[
{
"t":"Il regalo: un temperino.",
"to":"ELE_temperino_risposta",
"fx":[
"flag:temperino_detto_elena"
]
},
{
"t":"Una busta col temperino.",
"to":"ELE_temperino_risposta",
"fx":[
"flag:temperino_detto_elena"
]
}
]
},
{
"id":"ELE_temperino_risposta",
"who":"Elena",
"fase":"I",
"text":"Allora quello almeno non è una cosa trovata a caso.",
"alt":[
{
"req":"flag:temperino_detto_elena",
"text":"Era un regalo. Non l’hai trovato per caso."
}
]
},
{
"id":"ELE_claudio_fissato",
"who":"Elena",
"fase":"I",
"text":"Tu Claudio quante volte l’avevi visto?",
"opts":[
{
"t":"Tre. So poco di lui.",
"to":"ELE_claudio_risposta",
"fx":[
"flag:claudio_tre_incontri_fissati"
]
},
{
"t":"Tre. Lo conoscevo poco.",
"to":"ELE_claudio_risposta",
"fx":[
"flag:claudio_tre_incontri_fissati"
]
}
]
},
{
"id":"ELE_claudio_risposta",
"who":"Elena",
"fase":"I",
"text":"Era quasi uno sconosciuto anche per me. Non devi fingere il contrario.",
"alt":[
{
"req":"flag:claudio_tre_incontri_fissati",
"text":"Tre incontri. Non diventano una vita insieme."
}
]
},
{
"id":"SPORCO_01",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, torna da me. Qui c’è ancora posto."
},
{
"id":"SPORCO_02",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, non devi spiegarmi niente. Vieni e basta."
},
{
"id":"SPORCO_03",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Ti aspetto, Nonno. Non ti farei mai stare fuori."
},
{
"id":"SPORCO_04",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, fammi sentire che ci sei. Mi basta quello."
},
{
"id":"SPORCO_05",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Vieni a prendermi, Nonno. Lo so che non mi lasci qui."
},
{
"id":"SPORCO_06",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, siamo noi. Non conta quello che dice la foto."
},
{
"id":"ROS_attrezzi_01",
"who":"Rosa",
"fase":"II",
"text":"Smettila di accenderla. Passami quello che sto indicando.",
"alt":[
{
"req":"conf:Rosa>=25",
"text":"Testone, togli la mano dalla chiave. Poi lavoriamo."
},
{
"req":"flag:auto_panda",
"text":"Panda. Prima il controllo, poi quanto ti sei affezionato."
},
{
"req":"flag:auto_a80",
"text":"Con l’Audi prima il controllo. La famiglia può aspettare."
},
{
"req":"flag:auto_v40",
"text":"V40. Controlliamo prima di caricarci tutta la vita."
},
{
"req":"flag:auto_punto",
"text":"Punto. Mettiamo in fila i problemi, senza litigare col nome."
},
{
"req":"flag:auto_corsa",
"text":"Corsa. Il nome sul baule non è un programma di guida."
},
{
"req":"flag:auto_polo",
"text":"Polo. Prima la guardiamo. Non deve raccontarci tutto da sola."
}
],
"opts":[
{
"t":"Questo, porca troia?",
"to":"ROS_attrezzi_02"
},
{
"t":"Spiegami cosa devo guardare, senza riaccenderla.",
"to":"V2_R01_01",
"fx":[
"flag:r01b"
]
},
{
"t":"Fai tu. Non voglio imparare adesso.",
"to":"V2_R01_03",
"fx":[
"flag:r01c",
"sblocca:ROS_attrezzi_08"
]
}
]
},
{
"id":"ROS_attrezzi_02",
"who":"Rosa",
"fase":"II",
"text":"La fiducia tienila. Passami gli attrezzi, testa di cazzo.",
"opts":[
{
"t":"Dimmi cosa devo tenere.",
"to":"ROS_attrezzi_03"
},
{
"t":"Quale dei due?",
"to":"ROS_attrezzi_04"
},
{
"t":"Che due palle: dimmi cosa vuoi che tocchi.",
"to":"ROS_attrezzi_04"
}
]
},
{
"id":"ROS_attrezzi_03",
"who":"Rosa",
"fase":"II",
"text":"Bravo. Adesso tienilo, senza fare la statua.",
"opts":[
{
"t":"Lo tengo fermo.",
"to":"ROS_attrezzi_05"
},
{
"t":"Ti dico se si muove.",
"to":"ROS_attrezzi_05"
}
]
},
{
"id":"ROS_attrezzi_04",
"who":"Rosa",
"fase":"II",
"text":"No, quell’altro. Porca puttana, sto usando anche il dito.",
"opts":[
{
"t":"Adesso l’ho visto.",
"to":"ROS_attrezzi_05"
},
{
"t":"Va bene. Questo.",
"to":"ROS_attrezzi_05"
}
]
},
{
"id":"ROS_attrezzi_05",
"who":"Rosa",
"fase":"II",
"text":"Il resto lo controllo prima che tu riparta.",
"opts":[
{
"t":"Posso darti una mano?",
"to":"ROS_attrezzi_06"
},
{
"t":"Mi metto da parte e guardo.",
"to":"ROS_attrezzi_07"
},
{
"t":"Se è un'altra rottura di cazzo me lo dici.",
"to":"ROS_attrezzi_07"
}
]
},
{
"id":"ROS_attrezzi_06",
"who":"Rosa",
"fase":"II",
"text":"Aiutare non significa toccare tutto.",
"opts":[
{
"t":"Tocco solo quello che dici.",
"to":"ROS_attrezzi_08"
},
{
"t":"Ricevuto, niente esplorazioni.",
"to":"ROS_attrezzi_08"
}
]
},
{
"id":"ROS_attrezzi_07",
"who":"Rosa",
"fase":"II",
"text":"Guardare va bene. Commentare ogni rumore costa extra.",
"opts":[
{
"t":"Allora per ora ascolto.",
"to":"ROS_attrezzi_08"
},
{
"t":"Mi sto già risparmiando qualcosa.",
"to":"ROS_attrezzi_08"
},
{
"t":"Il controllo me lo avevi mostrato: guardo prima di avviare.",
"to":"V2_R01_03",
"req":"flag:r01b"
}
]
},
{
"id":"ROS_attrezzi_08",
"who":"Rosa",
"fase":"II",
"text":"Rosa. Se devi ringraziarmi, parti piano e senti come va.",
"alt":[
{
"req":"flag:r01c",
"text":"Prima hai lasciato fare. Il prossimo controllo lo vediamo alla sosta."
},
{
"req":"conf:Rosa>=50",
"text":"Bravo, zuccone. Parti piano e dimmi come va."
}
]
},
{
"id":"ROS_prudenza_01",
"who":"Rosa",
"fase":"II",
"text":"Hai riposato o hai solo comprato un caffè?",
"opts":[
{
"t":"Un caffè.",
"to":"ROS_prudenza_02"
},
{
"t":"Mi fermo qui. Mi serve ammettere che sono stanco.",
"to":"V2_R02_01",
"fx":[
"flag:r02b"
]
},
{
"t":"Niente consigli sul sonno.",
"to":"V2_R02_03",
"fx":[
"flag:r02c",
"sblocca:ROS_prudenza_08"
]
}
]
},
{
"id":"ROS_prudenza_02",
"who":"Rosa",
"fase":"II",
"text":"Il caffè non ripara la notte. Ti tiene sveglio a guardarla.",
"opts":[
{
"t":"Resto qui un po’.",
"to":"ROS_prudenza_04",
"fx":[
"flag:rosa_sosta_accettata"
]
},
{
"t":"Valuto alla prossima sosta.",
"to":"ROS_prudenza_05"
}
]
},
{
"id":"ROS_prudenza_03",
"who":"Rosa",
"fase":"II",
"text":"Allora per una volta non devi dimostrarmi un accidente.",
"opts":[
{
"t":"Non stavo facendo il fenomeno.",
"to":"ROS_prudenza_04"
},
{
"t":"È il consiglio che mi serviva.",
"to":"ROS_prudenza_05"
}
]
},
{
"id":"ROS_prudenza_04",
"who":"Rosa",
"fase":"II",
"text":"Ti fermi prima di non riuscire più a scegliere.",
"opts":[
{
"t":"Mi fermo prima.",
"to":"ROS_prudenza_06",
"fx":[
"flag:rosa_sosta_accettata"
]
},
{
"t":"Aspetto e poi ricontrollo come sto.",
"to":"ROS_prudenza_07"
}
]
},
{
"id":"ROS_prudenza_05",
"who":"Rosa",
"fase":"II",
"text":"Non mi chiedere quanti chilometri mancano al sonno.",
"opts":[
{
"t":"Non lo chiedo.",
"to":"ROS_prudenza_06"
},
{
"t":"Mi pareva una misura ragionevole.",
"to":"ROS_prudenza_07"
},
{
"t":"Che cazzo ne so io quanto manca.",
"to":"ROS_prudenza_07"
}
]
},
{
"id":"ROS_prudenza_06",
"who":"Rosa",
"fase":"II",
"text":"Bene. Una sosta non è una resa.",
"alt":[
{
"req":"conf:Rosa>=25",
"text":"Bene. Una sosta prima di crollare. Quasi sopportabile."
}
],
"opts":[
{
"t":"Non la tratto come una gara.",
"to":"ROS_prudenza_08"
},
{
"t":"Ti avviso quando riparto.",
"to":"ROS_prudenza_08"
}
]
},
{
"id":"ROS_prudenza_07",
"who":"Rosa",
"fase":"II",
"text":"Se parti, parti perché puoi. Non per darmi torto.",
"opts":[
{
"t":"Non devo darti torto.",
"to":"ROS_prudenza_08"
},
{
"t":"Ci penso prima di avviare.",
"to":"ROS_prudenza_08"
},
{
"t":"Avevo scelto la sosta. Mi sono fermato.",
"to":"V2_R02_03",
"req":"flag:r02b"
}
]
},
{
"id":"ROS_prudenza_08",
"who":"Rosa",
"fase":"II",
"text":"Decidi da fermo. Io non ti faccio il tifo per crepare.",
"alt":[
{
"req":"flag:r02c",
"text":"Sul sonno mi hai chiesto di tacere. Ti chiedo solo se sei fermo."
},
{
"req":"conf:Rosa>=50",
"text":"Ti voglio intero alla sosta. La fretta si fotta."
}
]
},
{
"id":"ROS_ricontrollo_01",
"who":"Rosa",
"fase":"III",
"text":"Ti sei fermato, poi?",
"opts":[
{
"t":"Sì. Ho seguito il consiglio.",
"to":"ROS_ricontrollo_02"
},
{
"t":"Ti scrivo cosa ho controllato. Se manca un pezzo, dimmelo.",
"to":"V2_R03_01",
"fx":[
"flag:r03b"
]
},
{
"t":"Niente rapporto. Riparto.",
"to":"V2_R03_03",
"fx":[
"flag:r03c",
"sblocca:ROS_ricontrollo_08"
]
}
]
},
{
"id":"ROS_ricontrollo_02",
"who":"Rosa",
"fase":"III",
"text":"Ti avevo detto prima di non tirare la notte.",
"alt":[
{
"req":"flag:rosa_sosta_accettata",
"text":"La sosta l’avevi scelta. Ora dimmi se ti è servita."
}
],
"opts":[
{
"t":"Non volevo ammettere che ero stanco.",
"to":"ROS_ricontrollo_04"
},
{
"t":"Mi sono fermato prima di cedere.",
"to":"ROS_ricontrollo_04"
}
]
},
{
"id":"ROS_ricontrollo_03",
"who":"Rosa",
"fase":"III",
"text":"Non conto le ore. Stai scrivendo ogni cosa tre volte.",
"opts":[
{
"t":"Adesso scrivo più piano apposta.",
"to":"ROS_ricontrollo_05"
},
{
"t":"Hai ragione. Non basta rispondere.",
"to":"ROS_ricontrollo_05"
},
{
"t":"Mi rompi il cazzo, ma hai ragione.",
"to":"ROS_ricontrollo_05"
}
]
},
{
"id":"ROS_ricontrollo_04",
"who":"Rosa",
"fase":"III",
"text":"Se ti fermi davvero, al telefono non devi sembrare sveglio.",
"opts":[
{
"t":"Non devo convincerti.",
"to":"ROS_ricontrollo_06"
},
{
"t":"Mi basta sapere se posso ripartire.",
"to":"ROS_ricontrollo_06"
}
]
},
{
"id":"ROS_ricontrollo_05",
"who":"Rosa",
"fase":"III",
"text":"Sei capace di dirmi come stai senza fare una battuta?",
"alt":[
{
"req":"conf:Rosa>=50",
"text":"Dimmi come stai. La battuta aspetta che smetti di tremare."
}
],
"opts":[
{
"t":"Sono stanco. Mi fermo.",
"to":"ROS_ricontrollo_07"
},
{
"t":"Sto meglio. Controllo l’auto e poi decido.",
"to":"ROS_ricontrollo_07"
}
]
},
{
"id":"ROS_ricontrollo_06",
"who":"Rosa",
"fase":"III",
"text":"Va bene. Questo mi serve sapere.",
"opts":[
{
"t":"Ti avviso quando posso.",
"to":"ROS_ricontrollo_08"
},
{
"t":"Non faccio promesse sull’orario.",
"to":"ROS_ricontrollo_08"
}
]
},
{
"id":"ROS_ricontrollo_07",
"who":"Rosa",
"fase":"III",
"text":"Allora fai un controllo prima di ripartire, testone.",
"opts":[
{
"t":"Un controllo, poi decido.",
"to":"ROS_ricontrollo_08"
},
{
"t":"Lo faccio senza chiedere applausi.",
"to":"ROS_ricontrollo_08"
},
{
"t":"Ti descrivo quel punto, come nel controllo di prima.",
"to":"V2_R03_03",
"req":"flag:r03b"
}
]
},
{
"id":"ROS_ricontrollo_08",
"who":"Rosa",
"fase":"III",
"text":"Ti richiamo dopo. Non stare in piedi per aspettare me.",
"alt":[
{
"req":"flag:r03c",
"text":"Niente rapporto, come hai scelto. Da qui non ti certifico la macchina."
}
]
},
{
"id":"ROS_passato_01",
"who":"Rosa",
"fase":"III",
"text":"Con Ottavio sono entrata sei anni fa.",
"opts":[
{
"t":"Chi era per te?",
"to":"ROS_passato_02"
},
{
"t":"Non ti chiedo il resto se non vuoi raccontarlo.",
"to":"V2_R04_01",
"fx":[
"flag:r04b"
]
},
{
"t":"Preferisco non sapere la tua storia.",
"to":"V2_R04_03",
"fx":[
"flag:r04c",
"sblocca:ROS_passato_08"
]
}
]
},
{
"id":"ROS_passato_02",
"who":"Rosa",
"fase":"III",
"text":"Un collega. Faceva il rappresentante. Non aggiungere il resto.",
"opts":[
{
"t":"Non aggiungo niente.",
"to":"ROS_passato_04"
},
{
"t":"Dimmi solo quello che serve.",
"to":"ROS_passato_05"
}
]
},
{
"id":"ROS_passato_03",
"who":"Rosa",
"fase":"III",
"text":"Io sono uscita. Lui è rimasto dentro.",
"opts":[
{
"t":"È per lui che sei ancora qui.",
"to":"ROS_passato_04"
},
{
"t":"Non ti chiedo di rifarlo adesso.",
"to":"ROS_passato_05"
}
]
},
{
"id":"ROS_passato_04",
"who":"Rosa",
"fase":"III",
"text":"Se ti dico che non so tutto, non è per farmi pregare.",
"opts":[
{
"t":"Lo terrò a mente.",
"to":"ROS_passato_06"
},
{
"t":"Ti chiederò prima cosa sai davvero.",
"to":"ROS_passato_07"
},
{
"t":"Allora diciamolo: qui nessuno sa un cazzo.",
"to":"ROS_passato_06"
}
]
},
{
"id":"ROS_passato_05",
"who":"Rosa",
"fase":"III",
"text":"A Livia ho promesso di riportarlo. Non l’ho ancora fatto.",
"opts":[
{
"t":"Se troviamo una strada, ti aiuto.",
"to":"ROS_passato_06",
"fx":[
"cnt:legami+1",
"flag:promessa_rosa"
]
},
{
"t":"Prima voglio capire il rischio.",
"to":"ROS_passato_07"
}
]
},
{
"id":"ROS_passato_06",
"who":"Rosa",
"fase":"III",
"text":"Puoi ascoltare senza dirmi che andrà bene.",
"alt":[
{
"req":"conf:Rosa>=75",
"text":"Stammi qui. Non dirmi che andrà bene per farmi respirare."
}
],
"opts":[
{
"t":"Ti ascolto.",
"to":"ROS_passato_08"
},
{
"t":"Non lo so neanche io come andrà.",
"to":"ROS_passato_08"
}
]
},
{
"id":"ROS_passato_07",
"who":"Rosa",
"fase":"III",
"text":"Ti chiedo di non promettere solo perché ti senti in colpa.",
"opts":[
{
"t":"Non te lo prometto a caso.",
"to":"ROS_passato_08"
},
{
"t":"Prima guardiamo le prove.",
"to":"ROS_passato_08"
},
{
"t":"Dimmi il limite, non il resto della storia.",
"to":"V2_R04_03",
"req":"flag:r04b"
}
]
},
{
"id":"ROS_passato_08",
"who":"Rosa",
"fase":"III",
"text":"Quando sapremo dove andare, ne riparliamo.",
"alt":[
{
"req":"flag:r04c",
"text":"Del passato non volevi sapere. Il rischio attuale va guardato."
}
]
},
{
"id":"ROS_promessa_01",
"who":"Rosa",
"fase":"III",
"text":"Prima hai detto che mi aiuti. Sai che cosa stai promettendo?",
"alt":[
{
"req":"flag:promessa_rosa",
"text":"Hai promesso di cercarlo. Il rischio viene prima del resto."
}
],
"opts":[
{
"t":"Ti aiuto a cercarlo, non apro alla cieca.",
"to":"ROS_promessa_02"
},
{
"t":"La promessa finisce se non sappiamo chi c’è davanti.",
"to":"V2_R05_01",
"fx":[
"flag:r05b"
]
},
{
"t":"Ritiro l’aiuto. Non rischio più.",
"to":"V2_R05_03",
"fx":[
"flag:r05c",
"sblocca:ROS_promessa_08"
]
}
]
},
{
"id":"ROS_promessa_02",
"who":"Rosa",
"fase":"III",
"text":"Aiutare a cercarlo è una cosa. Aprire qualsiasi porta è un’altra.",
"opts":[
{
"t":"Restiamo a questa promessa.",
"to":"ROS_promessa_03"
},
{
"t":"Se manca una prova ci fermiamo.",
"to":"ROS_promessa_04"
},
{
"t":"Una porta alla volta. E nessuno mi prende per il culo.",
"to":"ROS_promessa_04"
}
]
},
{
"id":"ROS_promessa_03",
"who":"Rosa",
"fase":"III",
"text":"Bene. Allora non devo trascinarti.",
"opts":[
{
"t":"Vengo perché scelgo di farlo.",
"to":"ROS_promessa_05"
},
{
"t":"Mi dici il rischio e poi decido.",
"to":"ROS_promessa_05"
}
]
},
{
"id":"ROS_promessa_04",
"who":"Rosa",
"fase":"III",
"text":"Questo lo rispetto più di un sì detto per pietà.",
"opts":[
{
"t":"Non mi devi convincere con la colpa.",
"to":"ROS_promessa_05"
},
{
"t":"Allora teniamola così.",
"to":"ROS_promessa_05"
}
]
},
{
"id":"ROS_promessa_05",
"who":"Rosa",
"fase":"III",
"text":"Se troviamo Ottavio vivo, decidiamo come farlo uscire.",
"opts":[
{
"t":"Prima riconosciamo chi c’è.",
"to":"ROS_promessa_06",
"fx":[
"flag:promessa_rosa_chiarita"
]
},
{
"t":"Prima la prova, poi il passaggio.",
"to":"ROS_promessa_07",
"fx":[
"flag:promessa_rosa_chiarita"
]
}
]
},
{
"id":"ROS_promessa_06",
"who":"Rosa",
"fase":"III",
"text":"Se invece troviamo una ripetizione, non la chiamiamo Ottavio.",
"opts":[
{
"t":"Non confondo il ricordo con lui.",
"to":"ROS_promessa_08"
},
{
"t":"Se non capisco, te lo dico.",
"to":"ROS_promessa_08"
},
{
"t":"Il limite era riconoscerlo prima di aprire. Lo tengo.",
"to":"V2_R05_03",
"req":"flag:r05b"
}
]
},
{
"id":"ROS_promessa_07",
"who":"Rosa",
"fase":"III",
"text":"Un dubbio si dice prima della corsa, porca miseria.",
"opts":[
{
"t":"Lo dico prima.",
"to":"ROS_promessa_08"
},
{
"t":"Anche se ti fa arrabbiare.",
"to":"ROS_promessa_08"
},
{
"t":"Se ho un dubbio lo dico, anche se ti incazzi.",
"to":"ROS_promessa_08"
}
]
},
{
"id":"ROS_promessa_08",
"who":"Rosa",
"fase":"III",
"text":"Va bene. Adesso abbiamo almeno una promessa comprensibile.",
"alt":[
{
"req":"flag:r05c",
"text":"Hai ritirato l’aiuto. Riparlarne non cancella la scelta."
},
{
"req":"conf:Rosa>=75",
"text":"Una promessa con un limite. Bravo coglione."
}
]
},
{
"id":"ROS_dopo_passaggio_01",
"who":"Rosa",
"fase":"III",
"text":"Prima dimmi se sei ferito.",
"opts":[
{
"t":"Non credo. Controllo.",
"to":"ROS_dopo_passaggio_02"
},
{
"t":"Sono vivo, ma prima di parlare devo calmarmi.",
"to":"V2_R06_01",
"fx":[
"flag:r06b"
]
},
{
"t":"Oggi non chiedermi come sto.",
"to":"V2_R06_03",
"fx":[
"flag:r06c",
"sblocca:ROS_dopo_passaggio_08"
]
}
]
},
{
"id":"ROS_dopo_passaggio_02",
"who":"Rosa",
"fase":"III",
"text":"Controlla, non tirare a indovinare.",
"opts":[
{
"t":"Adesso ti dico davvero.",
"to":"ROS_dopo_passaggio_04"
},
{
"t":"Dammi un momento.",
"to":"ROS_dopo_passaggio_05"
}
]
},
{
"id":"ROS_dopo_passaggio_03",
"who":"Rosa",
"fase":"III",
"text":"La macchina può aspettare. Tu devi rispondere.",
"opts":[
{
"t":"Hai ragione. Controllo me.",
"to":"ROS_dopo_passaggio_04"
},
{
"t":"L’auto resta qui.",
"to":"ROS_dopo_passaggio_05"
}
]
},
{
"id":"ROS_dopo_passaggio_04",
"who":"Rosa",
"fase":"III",
"text":"Non ti chiedo una versione coraggiosa.",
"opts":[
{
"t":"Ho avuto paura.",
"to":"ROS_dopo_passaggio_06"
},
{
"t":"Non riuscivo a capire dove finiva la corsia.",
"to":"ROS_dopo_passaggio_07"
}
]
},
{
"id":"ROS_dopo_passaggio_05",
"who":"Rosa",
"fase":"III",
"text":"È finita questa corsa. Non tutto il resto.",
"opts":[
{
"t":"Ti scrivo quello che ricordo.",
"to":"ROS_dopo_passaggio_06"
},
{
"t":"Prima voglio capire la conseguenza.",
"to":"ROS_dopo_passaggio_07"
}
]
},
{
"id":"ROS_dopo_passaggio_06",
"who":"Rosa",
"fase":"III",
"text":"Quello che hai visto me lo scrivi da fermo, senza completarlo dopo.",
"opts":[
{
"t":"Niente cose aggiunte per farle tornare.",
"to":"ROS_dopo_passaggio_08"
},
{
"t":"Se un pezzo manca, lo dico.",
"to":"ROS_dopo_passaggio_08"
}
]
},
{
"id":"ROS_dopo_passaggio_07",
"who":"Rosa",
"fase":"III",
"text":"Se non ci sei riuscito, guardiamo cosa è rimasto da fare.",
"opts":[
{
"t":"Non la rifaccio per orgoglio.",
"to":"ROS_dopo_passaggio_08"
},
{
"t":"Ripartiamo da quello che sappiamo.",
"to":"ROS_dopo_passaggio_08"
},
{
"t":"Mi sono calmato. Adesso posso raccontare.",
"to":"V2_R06_03",
"req":"flag:r06b"
}
]
},
{
"id":"ROS_dopo_passaggio_08",
"who":"Rosa",
"fase":"III",
"text":"Per il prossimo minuto basta respirare. Poi gli insulti.",
"alt":[
{
"req":"flag:r06c",
"text":"Non chiedo come stai, come volevi. Se serve scrivi tu."
},
{
"req":"conf:Rosa>=75",
"text":"Respira. Gli insulti aspettano che tu sia intero."
}
]
},
{
"id":"ROS_segni_01",
"who":"Rosa",
"fase":"IV",
"text":"I segni fuori dalla porta li riconosco.",
"opts":[
{
"t":"Sono del tuo tentativo?",
"to":"ROS_segni_02"
},
{
"t":"Distinguiamo il tuo ritorno dalla nostra scelta.",
"to":"V2_R07_01",
"fx":[
"flag:r07b"
]
},
{
"t":"Non userò quella traccia per aiutarti.",
"to":"V2_R07_03",
"fx":[
"flag:r07c",
"sblocca:ROS_segni_08"
]
}
]
},
{
"id":"ROS_segni_02",
"who":"Rosa",
"fase":"IV",
"text":"Sì. Ero già uscita quando sono tornata lì.",
"opts":[
{
"t":"Per Ottavio.",
"to":"ROS_segni_03"
},
{
"t":"Perché sei rientrata?",
"to":"ROS_segni_04"
}
]
},
{
"id":"ROS_segni_03",
"who":"Rosa",
"fase":"IV",
"text":"Ottavio era dentro. Non avevo un piano migliore.",
"opts":[
{
"t":"Non ti chiedo di giustificarlo.",
"to":"ROS_segni_05"
},
{
"t":"Voglio capire che cosa mancava.",
"to":"ROS_segni_05"
}
]
},
{
"id":"ROS_segni_04",
"who":"Rosa",
"fase":"IV",
"text":"Non era una via di fuga. Cercavo di rientrare.",
"opts":[
{
"t":"Adesso il segno ha un senso.",
"to":"ROS_segni_05"
},
{
"t":"Non lo chiamerò più una fuga.",
"to":"ROS_segni_05"
}
]
},
{
"id":"ROS_segni_05",
"who":"Rosa",
"fase":"IV",
"text":"Non guardarmi come se adesso dovessi rifarlo per forza.",
"opts":[
{
"t":"Prima la strada.",
"to":"ROS_segni_06",
"fx":[
"cnt:conoscenza+1",
"flag:segni_rosa_verificati"
]
},
{
"t":"Prima un piano.",
"to":"ROS_segni_07",
"fx":[
"cnt:conoscenza+1",
"flag:segni_rosa_verificati"
]
}
]
},
{
"id":"ROS_segni_06",
"who":"Rosa",
"fase":"IV",
"text":"Se lo facciamo, stavolta ci serve una strada.",
"opts":[
{
"t":"Prepariamo il recupero.",
"to":"ROS_segni_08"
},
{
"t":"Controlliamo con Livia.",
"to":"ROS_segni_08"
}
]
},
{
"id":"ROS_segni_07",
"who":"Rosa",
"fase":"IV",
"text":"Se aspettiamo, non significa che ce ne freghiamo.",
"opts":[
{
"t":"Aspettare una prova non è abbandonarlo.",
"to":"ROS_segni_08"
},
{
"t":"Non ti chiedo un altro salto al buio.",
"to":"ROS_segni_08"
},
{
"t":"La traccia non era un ordine: prima troviamo la strada.",
"to":"V2_R07_03",
"req":"flag:r07b"
}
]
},
{
"id":"ROS_segni_08",
"who":"Rosa",
"fase":"IV",
"text":"Conserva quella prova. Voglio sapere cosa abbiamo visto davvero.",
"alt":[
{
"req":"flag:r07c",
"text":"La traccia l’hai lasciata dopo averla vista. Non era persa."
},
{
"req":"conf:Rosa>=50",
"text":"Tieni la traccia. Poi la guardiamo insieme, da fermi."
},
{
"req":"flag:segni_rosa_verificati",
"text":"Hai visto perché ero tornata. Non era una fuga."
}
]
},
{
"id":"ROS_recupero_01",
"who":"Rosa",
"fase":"V",
"text":"La promessa era cercarlo con una strada. Ora ne abbiamo una.",
"opts":[
{
"t":"Mantengo la promessa. Prepariamo il recupero.",
"to":"ROS_recupero_02"
},
{
"t":"Prima di entrare decidiamo quando ci fermiamo.",
"to":"V2_R08_01",
"fx":[
"flag:r08b"
]
},
{
"t":"Non vengo al recupero.",
"to":"V2_R08_03",
"fx":[
"flag:r08c",
"sblocca:ROS_recupero_08"
]
}
]
},
{
"id":"ROS_recupero_02",
"who":"Rosa",
"fase":"V",
"text":"Prima mi hai detto che non aprivi alla cieca. Bene.",
"alt":[
{
"req":"flag:promessa_rosa_chiarita",
"text":"Il limite era riconoscerlo prima di aprire."
}
],
"opts":[
{
"t":"È ancora quella la mia condizione.",
"to":"ROS_recupero_04"
},
{
"t":"Se cambia il percorso, te lo dico.",
"to":"ROS_recupero_04"
}
]
},
{
"id":"ROS_recupero_03",
"who":"Rosa",
"fase":"V",
"text":"Se adesso vuoi fermarti, lo dici prima di partire.",
"opts":[
{
"t":"Non mi fermo per paura di dirtelo.",
"to":"ROS_recupero_05"
},
{
"t":"Ti do una risposta prima di entrare.",
"to":"ROS_recupero_05"
}
]
},
{
"id":"ROS_recupero_04",
"who":"Rosa",
"fase":"V",
"text":"Voglio riportare Ottavio, non sostituirlo con qualcosa.",
"opts":[
{
"t":"Riportiamo lui, se è lui.",
"to":"ROS_recupero_06"
},
{
"t":"Non basta che abbia la sua voce.",
"to":"ROS_recupero_06"
}
]
},
{
"id":"ROS_recupero_05",
"who":"Rosa",
"fase":"V",
"text":"Lo so che il rischio c’è. Non lo faccio sparire a parolacce.",
"opts":[
{
"t":"Vengo al punto.",
"to":"ROS_recupero_07",
"fx":[
"cnt:legami+1",
"flag:recupero_ottavio_accettato"
]
},
{
"t":"Preparo un’alternativa.",
"to":"ROS_recupero_07",
"fx":[
"flag:recupero_ottavio_rinviato"
]
}
]
},
{
"id":"ROS_recupero_06",
"who":"Rosa",
"fase":"V",
"text":"Allora andiamo fin dove abbiamo concordato.",
"opts":[
{
"t":"Non oltre senza parlarne.",
"to":"ROS_recupero_08"
},
{
"t":"Se cambia qualcosa, niente improvvisate.",
"to":"ROS_recupero_08"
}
]
},
{
"id":"ROS_recupero_07",
"who":"Rosa",
"fase":"V",
"text":"Va bene. Preferisco una risposta vera a un altro disperso.",
"alt":[
{
"req":"flag:recupero_ottavio_rinviato",
"text":"Il recupero l’avevi rinviato. Non è già riuscito."
}
],
"opts":[
{
"t":"Non ti prometto il risultato.",
"to":"ROS_recupero_08"
},
{
"t":"Ti prometto che non fingo di sapere.",
"to":"ROS_recupero_08"
},
{
"t":"Non sposto il limite che avevamo deciso.",
"to":"V2_R08_03",
"req":"flag:r08b"
}
]
},
{
"id":"ROS_recupero_08",
"who":"Rosa",
"fase":"V",
"text":"Scrivi quando puoi. Quando guidi, guida.",
"alt":[
{
"req":"flag:r08c",
"text":"Hai scelto di non venire. Il recupero non è già riuscito."
},
{
"req":"conf:Rosa>=100",
"text":"Di ritorno, non eroico. Quando guidi non rispondi a me."
},
{
"req":"flag:recupero_ottavio_accettato",
"text":"Recupero scelto. Quando guidi, guida."
}
]
},
{
"id":"ROS_guardia_01",
"who":"Rosa",
"fase":"V",
"text":"Chi resta a guardia viene dimenticato da fuori.",
"opts":[
{
"t":"È quello che sta succedendo a te?",
"to":"ROS_guardia_02"
},
{
"t":"Prima di dire resto voglio vedere che cosa significa.",
"to":"V2_R09_01",
"fx":[
"flag:r09b"
]
},
{
"t":"Non voglio sapere altro del prezzo.",
"to":"V2_R09_03",
"fx":[
"flag:r09c",
"sblocca:ROS_guardia_08"
]
}
]
},
{
"id":"ROS_guardia_02",
"who":"Rosa",
"fase":"V",
"text":"Un poco alla volta. Non è che smetti tu di ricordare.",
"opts":[
{
"t":"Quindi io ricorderei ancora Elena.",
"to":"ROS_guardia_04"
},
{
"t":"Non finisce soltanto il viaggio.",
"to":"ROS_guardia_05"
}
]
},
{
"id":"ROS_guardia_03",
"who":"Rosa",
"fase":"V",
"text":"Non dire resto io come se mi stessi tenendo una chiave.",
"opts":[
{
"t":"Voglio capirlo prima di promettere.",
"to":"ROS_guardia_04"
},
{
"t":"Non sto decidendo adesso.",
"to":"ROS_guardia_05"
}
]
},
{
"id":"ROS_guardia_04",
"who":"Rosa",
"fase":"V",
"text":"Io sono rimasta per una promessa. Tu devi saperlo prima.",
"opts":[
{
"t":"La tua promessa era Ottavio.",
"to":"ROS_guardia_06"
},
{
"t":"La mia deve avere un nome.",
"to":"ROS_guardia_07"
}
]
},
{
"id":"ROS_guardia_05",
"who":"Rosa",
"fase":"V",
"text":"Se scegli di restare, deve uscire qualcuno di vero.",
"opts":[
{
"t":"Prima troviamo chi può uscire.",
"to":"ROS_guardia_06"
},
{
"t":"Prima verifichiamo il prezzo.",
"to":"ROS_guardia_07"
}
]
},
{
"id":"ROS_guardia_06",
"who":"Rosa",
"fase":"V",
"text":"Non ti dirò che è una cosa bella.",
"opts":[
{
"t":"Non te lo sto chiedendo.",
"to":"ROS_guardia_08"
},
{
"t":"Preferisco che tu lo dica così.",
"to":"ROS_guardia_08"
}
]
},
{
"id":"ROS_guardia_07",
"who":"Rosa",
"fase":"V",
"text":"Non ti dirò neanche che scegliere di uscire è da vigliacchi.",
"opts":[
{
"t":"Mi serviva sentirlo.",
"to":"ROS_guardia_08"
},
{
"t":"Non ti chiedo di scegliere per me.",
"to":"ROS_guardia_08"
},
{
"t":"Avevo chiesto di guardare il prezzo prima di promettere.",
"to":"V2_R09_03",
"req":"flag:r09b"
}
]
},
{
"id":"ROS_guardia_08",
"who":"Rosa",
"fase":"V",
"text":"Prenditi il tempo che serve. Questa risposta non la strappo.",
"alt":[
{
"req":"flag:r09c",
"text":"Del prezzo non volevi sapere altro. Per restare devi ancora comprenderlo."
},
{
"req":"conf:Rosa>=100",
"text":"Non ti strappo un sì. Il prezzo lo guardiamo prima."
}
]
},
{
"id":"ROS_prima_porta_01",
"who":"Rosa",
"fase":"V",
"text":"Mi hai promesso di cercare Ottavio. Non la tua vita.",
"opts":[
{
"t":"Lo so. La guardia sarebbe una scelta nuova.",
"to":"ROS_prima_porta_02"
},
{
"t":"Se esco non ti chiedo di dirmi che va tutto bene.",
"to":"V2_R10_01",
"fx":[
"flag:r10b"
]
},
{
"t":"Scelgo senza dirtelo.",
"to":"V2_R10_03",
"fx":[
"flag:r10c",
"sblocca:ROS_prima_porta_08"
]
}
]
},
{
"id":"ROS_prima_porta_02",
"who":"Rosa",
"fase":"V",
"text":"Quella promessa non ti obbliga a restare a guardia.",
"opts":[
{
"t":"Non confondo le due cose.",
"to":"ROS_prima_porta_04"
},
{
"t":"Non ti devo un sì automatico.",
"to":"ROS_prima_porta_04"
}
]
},
{
"id":"ROS_prima_porta_03",
"who":"Rosa",
"fase":"V",
"text":"Se esci, io so che cosa hai fatto per noi.",
"opts":[
{
"t":"Non mi porto via il tuo giudizio.",
"to":"ROS_prima_porta_05"
},
{
"t":"Ti dico cosa scelgo prima di andare.",
"to":"ROS_prima_porta_05"
}
]
},
{
"id":"ROS_prima_porta_04",
"who":"Rosa",
"fase":"V",
"text":"Se resti, lo dici sapendo chi puoi far uscire.",
"opts":[
{
"t":"Deve esserci qualcuno da far uscire.",
"to":"ROS_prima_porta_06"
},
{
"t":"Il prezzo deve essere chiaro.",
"to":"ROS_prima_porta_06"
}
]
},
{
"id":"ROS_prima_porta_05",
"who":"Rosa",
"fase":"V",
"text":"Non voglio che sia la paura di deludermi a scegliere.",
"opts":[
{
"t":"Deciderò senza promettertelo adesso.",
"to":"ROS_prima_porta_07"
},
{
"t":"Per ora preparo il ritorno.",
"to":"ROS_prima_porta_07"
}
]
},
{
"id":"ROS_prima_porta_06",
"who":"Rosa",
"fase":"V",
"text":"Allora questa è la tua decisione. La mia la faccio dopo.",
"opts":[
{
"t":"Te la dirò in faccia.",
"to":"ROS_prima_porta_08"
},
{
"t":"Niente risposte date per sfinimento.",
"to":"ROS_prima_porta_08"
}
]
},
{
"id":"ROS_prima_porta_07",
"who":"Rosa",
"fase":"V",
"text":"Va bene anche uscire. Non trasformarti in un debito.",
"opts":[
{
"t":"Non voglio diventarlo.",
"to":"ROS_prima_porta_08"
},
{
"t":"Ti credo, anche adesso.",
"to":"ROS_prima_porta_08"
},
{
"t":"La scelta resta mia. Non ti chiedo assoluzioni.",
"to":"V2_R10_03",
"req":"flag:r10b"
}
]
},
{
"id":"ROS_prima_porta_08",
"who":"Rosa",
"fase":"V",
"text":"Prima della porta scrivimi. Senza fare i duri, stavolta.",
"alt":[
{
"req":"flag:r10c",
"text":"Non volevi dirmelo. Non ti strappo la risposta adesso."
},
{
"req":"conf:Rosa>=100",
"text":"Prima della porta scrivi, anche se scegli di tornare."
}
]
},
{
"id":"LIV_primo_01",
"who":"Livia",
"fase":"III",
"text":"Mi hai detto Claudio. Da dove viene quell’auto?",
"opts":[
{
"t":"L’ho scelta nell’eredità.",
"to":"LIV_primo_02"
},
{
"t":"Ti mando il dettaglio. Non ho ancora una spiegazione.",
"to":"V2_L01_01",
"fx":[
"flag:l01b"
]
},
{
"t":"Per ora non mando niente.",
"to":"V2_L01_03",
"fx":[
"flag:l01c",
"sblocca:LIV_primo_08"
]
}
]
},
{
"id":"LIV_primo_02",
"who":"Livia",
"fase":"III",
"text":"Claudio mi ha lasciato delle cose. Ti dico quali, prima che immagini il peggio.",
"alt":[
{
"req":"conf:Livia>=25",
"text":"Claudio mi ha lasciato delle cose. Te le mostro prima."
}
],
"opts":[
{
"t":"Quali originali?",
"to":"LIV_primo_03"
},
{
"t":"Come posso controllare quello che dici?",
"to":"LIV_primo_04"
}
]
},
{
"id":"LIV_primo_03",
"who":"Livia",
"fase":"III",
"text":"Non ti chiedo di credere a una voce al telefono.",
"opts":[
{
"t":"Ti mostro l’oggetto e i documenti.",
"to":"LIV_primo_05"
},
{
"t":"Ti dico esattamente quello che ho visto.",
"to":"LIV_primo_05"
}
]
},
{
"id":"LIV_primo_04",
"who":"Livia",
"fase":"III",
"text":"Prima controlliamo che cosa hai trovato.",
"opts":[
{
"t":"Non aggiungo quello che immagino.",
"to":"LIV_primo_05"
},
{
"t":"Partiamo dai nomi.",
"to":"LIV_primo_05"
}
]
},
{
"id":"LIV_primo_05",
"who":"Livia",
"fase":"III",
"text":"Il nome nell’auto e quello nelle carte corrispondono.",
"opts":[
{
"t":"Coincide solo il nome.",
"to":"LIV_primo_06",
"fx":[
"cnt:conoscenza+1",
"flag:proprietario_verificato"
]
},
{
"t":"Il resto è un’ipotesi.",
"to":"LIV_primo_07",
"fx":[
"cnt:conoscenza+1",
"flag:proprietario_verificato"
]
}
]
},
{
"id":"LIV_primo_06",
"who":"Livia",
"fase":"III",
"text":"Questo coincide. Al resto non ho ancora trovato una risposta.",
"opts":[
{
"t":"Mi serve questa distinzione.",
"to":"LIV_primo_08"
},
{
"t":"Non trasformiamola in una risposta a tutto.",
"to":"LIV_primo_08"
}
]
},
{
"id":"LIV_primo_07",
"who":"Livia",
"fase":"III",
"text":"Una copia può essere utile. Non chiamarla originale.",
"opts":[
{
"t":"Conservo anche la fonte.",
"to":"LIV_primo_08"
},
{
"t":"Ti avverto se ho solo una copia.",
"to":"LIV_primo_08"
},
{
"t":"Ti mando il dettaglio senza riempire il nome mancante.",
"to":"V2_L01_03",
"req":"flag:l01b"
}
]
},
{
"id":"LIV_primo_08",
"who":"Livia",
"fase":"III",
"text":"Ti dico da dove viene ogni cosa. Tu fai lo stesso.",
"alt":[
{
"req":"flag:l01c",
"text":"Quel dettaglio non me l’hai mandato. Posso parlarne, non confermarlo."
},
{
"req":"conf:Livia>=50",
"text":"Ti racconto anche i pezzi in cui mi sono persa."
},
{
"req":"flag:proprietario_verificato",
"text":"Il nome coincide. Il resto va cercato."
}
]
},
{
"id":"LIV_affido_01",
"who":"Livia",
"fase":"III",
"text":"Quello che hai tu non è quello che Claudio ha affidato a me.",
"opts":[
{
"t":"Ti mando quello che ho, per confrontarlo.",
"to":"LIV_affido_02",
"fx":[
"cnt:legami+1",
"flag:livia"
]
},
{
"t":"La tengo. Non te la mando.",
"to":"V2_L02_01",
"fx":[
"flag:prova_trattenuta",
"flag:l02b"
]
},
{
"t":"Non voglio più parlarne con te.",
"to":"V2_L02_03",
"fx":[
"flag:l02c",
"sblocca:LIV_affido_08"
]
}
]
},
{
"id":"LIV_affido_02",
"who":"Livia",
"fase":"III",
"text":"L’originale resta qui. Mi basta confrontare quello che hai tu.",
"opts":[
{
"t":"Mando il mio. Il tuo resta lì.",
"to":"LIV_affido_04",
"fx":[
"flag:copia_conservata"
]
},
{
"t":"Confrontiamo senza spostare quello che custodisci.",
"to":"LIV_affido_05"
}
]
},
{
"id":"LIV_affido_03",
"who":"Livia",
"fase":"III",
"text":"Se non vuoi mandarmelo, dimmelo. Ci resto male, non divento il notaio.",
"alt":[
{
"req":"conf:Livia>=25",
"text":"Puoi tenerla. Mi dispiace restare fuori dal confronto."
}
],
"opts":[
{
"t":"Lo tengo sapendo che manca il confronto.",
"to":"LIV_affido_04"
},
{
"t":"Non ti chiedo di garantirmi niente.",
"to":"LIV_affido_05"
}
]
},
{
"id":"LIV_affido_04",
"who":"Livia",
"fase":"III",
"text":"Non ti sto chiedendo di rimanere senza niente.",
"opts":[
{
"t":"Guardiamo quello che ti ho mandato.",
"to":"LIV_affido_06"
},
{
"t":"Dimmi che cosa coincide.",
"to":"LIV_affido_07"
}
]
},
{
"id":"LIV_affido_05",
"who":"Livia",
"fase":"III",
"text":"Non mi conosci abbastanza. Lo capisco anche quando mi dà fastidio.",
"opts":[
{
"t":"Ne riparliamo quando riesco a fidarmi.",
"to":"LIV_affido_06"
},
{
"t":"Capisco che così non puoi aiutarmi sul punto.",
"to":"LIV_affido_07"
}
]
},
{
"id":"LIV_affido_06",
"who":"Livia",
"fase":"III",
"text":"È arrivato. Adesso posso dirti in che cosa coincide e in che cosa no.",
"opts":[
{
"t":"Ti chiederò di riguardarlo se mi sembrerà diverso.",
"to":"LIV_affido_08"
},
{
"t":"Adesso possiamo tenerlo distinto da un sospetto.",
"to":"LIV_affido_08"
}
]
},
{
"id":"LIV_affido_07",
"who":"Livia",
"fase":"III",
"text":"Possiamo riparlarne. Non mi devi una fiducia che non senti.",
"opts":[
{
"t":"Non chiudo il discorso tra noi.",
"to":"LIV_affido_08"
},
{
"t":"Non lo presenterò come un controllo già fatto.",
"to":"LIV_affido_08"
},
{
"t":"Ti dico perché l’avevo tenuta. Poi la confrontiamo.",
"to":"V2_L02_03",
"req":"flag:l02b"
}
]
},
{
"id":"LIV_affido_08",
"who":"Livia",
"fase":"III",
"text":"Se lo teniamo per noi, resta qualcosa che stiamo soltanto immaginando.",
"alt":[
{
"req":"flag:l02c",
"text":"Avevi chiuso il confronto. Per riaprirlo manca ancora un pezzo."
},
{
"req":"conf:Livia>=50",
"text":"Non fidarti per educazione. Lasciami poter riparlarne."
},
{
"req":"flag:livia",
"text":"Adesso posso confrontarla. Non devi fare tutto da solo."
}
]
},
{
"id":"LIV_ottavio_01",
"who":"Livia",
"fase":"III",
"text":"La macchina l’hanno trovata. Ottavio no.",
"opts":[
{
"t":"Pensi che sia ancora lì?",
"to":"LIV_ottavio_02"
},
{
"t":"Puoi dirmi quello che speri, prima delle carte.",
"to":"V2_L03_01",
"fx":[
"flag:l03b"
]
},
{
"t":"Non voglio sentire quello che speri.",
"to":"V2_L03_03",
"fx":[
"flag:l03c",
"sblocca:LIV_ottavio_08"
]
}
]
},
{
"id":"LIV_ottavio_02",
"who":"Livia",
"fase":"III",
"text":"È mio fratello. La parte ordinata di me non riesce a rispondere a tutto.",
"alt":[
{
"req":"conf:Livia>=50",
"text":"È mio fratello. Non riesco a essere metodica su tutto."
}
],
"opts":[
{
"t":"Che cosa hai verificato?",
"to":"LIV_ottavio_03"
},
{
"t":"Che cosa è ancora una speranza?",
"to":"LIV_ottavio_04"
}
]
},
{
"id":"LIV_ottavio_03",
"who":"Livia",
"fase":"III",
"text":"Il suo nome nelle carte di Claudio è verificato.",
"opts":[
{
"t":"Partiamo da quello.",
"to":"LIV_ottavio_05"
},
{
"t":"Non lo confondo con una prova che sia vivo.",
"to":"LIV_ottavio_05"
}
]
},
{
"id":"LIV_ottavio_04",
"who":"Livia",
"fase":"III",
"text":"Vorrei che fosse vivo. La sera diventa difficile aggiungere non lo so.",
"opts":[
{
"t":"Grazie per averlo detto.",
"to":"LIV_ottavio_05"
},
{
"t":"Voglio sapere su cosa si basa.",
"to":"LIV_ottavio_05"
}
]
},
{
"id":"LIV_ottavio_05",
"who":"Livia",
"fase":"III",
"text":"Ha telefonato dopo che avevano smesso di cercarlo.",
"opts":[
{
"t":"Confrontiamo la chiamata con le altre prove.",
"to":"LIV_ottavio_06"
},
{
"t":"Non la butto, ma non basta.",
"to":"LIV_ottavio_07"
}
]
},
{
"id":"LIV_ottavio_06",
"who":"Livia",
"fase":"III",
"text":"La telefonata prova una voce. Da sola non prova chi parlava.",
"opts":[
{
"t":"Serve un riscontro indipendente.",
"to":"LIV_ottavio_08"
},
{
"t":"Neanche se riconosci la voce.",
"to":"LIV_ottavio_08"
}
]
},
{
"id":"LIV_ottavio_07",
"who":"Livia",
"fase":"III",
"text":"Non voglio metterti in mano una speranza e chiamarla un incarico.",
"opts":[
{
"t":"Cerchiamo senza promettere il risultato.",
"to":"LIV_ottavio_08"
},
{
"t":"Non ti rispondo solo per consolarti.",
"to":"LIV_ottavio_08"
},
{
"t":"Posso ascoltare una speranza senza trasformarla in certezza.",
"to":"V2_L03_03",
"req":"flag:l03b"
}
]
},
{
"id":"LIV_ottavio_08",
"who":"Livia",
"fase":"III",
"text":"Se trovi un segno, dimmi anche quello che non coincide.",
"alt":[
{
"req":"flag:l03c",
"text":"Della speranza mi avevi chiesto di tacere. Non significa che sia passata."
},
{
"req":"conf:Livia>=75",
"text":"Se non coincide, dimmelo. Non mi aiuti con una bugia."
}
]
},
{
"id":"LIV_fiducia_01",
"who":"Livia",
"fase":"IV",
"text":"Prima avevi scelto di non mandarmi quello che avevi.",
"alt":[
{
"req":"flag:prova_trattenuta",
"text":"Prima l’hai tenuta per te. Ripartiamo da quel punto."
}
],
"opts":[
{
"t":"Te la mando.",
"to":"LIV_fiducia_02",
"fx":[
"cnt:legami+1",
"flag:livia",
"flag:livia_fiducia_riparata"
]
},
{
"t":"Per ora lo tengo, ma ti ascolto.",
"to":"V2_L04_01",
"fx":[
"flag:l04b"
]
},
{
"t":"La tengo. Chiudo il discorso.",
"to":"V2_L04_03",
"fx":[
"flag:l04c",
"sblocca:LIV_fiducia_08"
]
}
]
},
{
"id":"LIV_fiducia_02",
"who":"Livia",
"fase":"IV",
"text":"Non ti chiedo di far finta che ieri ci fidassimo già.",
"opts":[
{
"t":"Non lo cancello. Ti chiedo di rimediare.",
"to":"LIV_fiducia_04"
},
{
"t":"Ho cambiato idea dopo quello che ho visto.",
"to":"LIV_fiducia_04"
}
]
},
{
"id":"LIV_fiducia_03",
"who":"Livia",
"fase":"IV",
"text":"Se hai cambiato idea, mandami quello che guardi tu. Il resto è già qui.",
"opts":[
{
"t":"Te lo mando e facciamo il confronto.",
"to":"LIV_fiducia_05"
},
{
"t":"Quello che conservi tu resta al suo posto.",
"to":"LIV_fiducia_05"
}
]
},
{
"id":"LIV_fiducia_04",
"who":"Livia",
"fase":"IV",
"text":"Se la tieni ancora, posso dirti soltanto dove manca la verifica.",
"opts":[
{
"t":"Indica i punti non verificati.",
"to":"LIV_fiducia_06"
},
{
"t":"Non ti userò come garanzia.",
"to":"LIV_fiducia_06"
}
]
},
{
"id":"LIV_fiducia_05",
"who":"Livia",
"fase":"IV",
"text":"Possiamo aver capito male senza smettere di volerci aiutare.",
"alt":[
{
"req":"conf:Livia>=50",
"text":"Possiamo volerci aiutare e aver capito male. Ripartiamo da lì."
}
],
"opts":[
{
"t":"Accetto che tu mi corregga.",
"to":"LIV_fiducia_07"
},
{
"t":"Non ti chiedo di approvare tutto.",
"to":"LIV_fiducia_07"
}
]
},
{
"id":"LIV_fiducia_06",
"who":"Livia",
"fase":"IV",
"text":"È arrivato. Non dobbiamo fingere di essere stati d’accordo dall’inizio.",
"opts":[
{
"t":"Ripartiamo da qui.",
"to":"LIV_fiducia_08"
},
{
"t":"Ti dirò anche dove ho sbagliato.",
"to":"LIV_fiducia_08"
}
]
},
{
"id":"LIV_fiducia_07",
"who":"Livia",
"fase":"IV",
"text":"Va bene. Non presentarmi come testimone di ciò che non ho controllato.",
"opts":[
{
"t":"Non lo farò.",
"to":"LIV_fiducia_08"
},
{
"t":"Ti chiederò solo ciò che puoi sapere.",
"to":"LIV_fiducia_08"
},
{
"t":"Ti dico il motivo vero per cui non l’avevo mandata.",
"to":"V2_L04_03",
"req":"flag:l04b"
}
]
},
{
"id":"LIV_fiducia_08",
"who":"Livia",
"fase":"IV",
"text":"Grazie per essere tornato sul discorso. Non era obbligatorio farmi contenta.",
"alt":[
{
"req":"flag:l04c",
"text":"Hai fermato il confronto. Per riprenderlo mi serve la copia."
},
{
"req":"conf:Livia>=75",
"text":"Grazie per esserci tornato. Non ti faccio ripagare ogni riga."
},
{
"req":"flag:livia_fiducia_riparata",
"text":"Hai riaperto il confronto. Ripartiamo da qui."
}
]
},
{
"id":"LIV_irene_01",
"who":"Livia",
"fase":"IV",
"text":"Questa è la foto originale. Irene è alla porta.",
"opts":[
{
"t":"Confrontiamola con la copia.",
"to":"LIV_irene_02"
},
{
"t":"Fammi guardare dove Claudio ricordava l’altra donna.",
"to":"V2_L05_01",
"fx":[
"flag:l05b"
]
},
{
"t":"Non voglio guardare quel punto.",
"to":"V2_L05_03",
"fx":[
"flag:l05c",
"sblocca:LIV_irene_08"
]
}
]
},
{
"id":"LIV_irene_02",
"who":"Livia",
"fase":"IV",
"text":"Nell’auto di Claudio c’è una copia sbiadita. Possiamo confrontarle.",
"opts":[
{
"t":"La differenza resta visibile.",
"to":"LIV_irene_04"
},
{
"t":"Non correggiamo l’originale per adattarlo.",
"to":"LIV_irene_05"
}
]
},
{
"id":"LIV_irene_03",
"who":"Livia",
"fase":"IV",
"text":"Non voglio far dire a questa foto più di quello che mostra.",
"alt":[
{
"req":"conf:Livia>=50",
"text":"La foto non deve dire tutto quello che ho paura di sapere."
}
],
"opts":[
{
"t":"Non le chiedo di dimostrare tutto.",
"to":"LIV_irene_04"
},
{
"t":"Partiamo da chi si vede.",
"to":"LIV_irene_05"
}
]
},
{
"id":"LIV_irene_04",
"who":"Livia",
"fase":"IV",
"text":"Dimostra chi era lì. E dove guardava.",
"opts":[
{
"t":"La figura guardava dietro di me.",
"to":"LIV_irene_06"
},
{
"t":"Questo posso confrontarlo con ciò che ho visto.",
"to":"LIV_irene_07"
}
]
},
{
"id":"LIV_irene_05",
"who":"Livia",
"fase":"IV",
"text":"Guarda oltre l’auto, verso l’ingresso. Non verso di lui.",
"opts":[
{
"t":"La porta è riconoscibile.",
"to":"LIV_irene_06",
"fx":[
"cnt:conoscenza+1",
"flag:foto"
]
},
{
"t":"Conservo il legame tra nome e volto.",
"to":"LIV_irene_07",
"fx":[
"cnt:conoscenza+1",
"flag:foto"
]
}
]
},
{
"id":"LIV_irene_06",
"who":"Livia",
"fase":"IV",
"text":"Se riconosci quella porta, non la scambierai con una qualunque.",
"alt":[
{
"req":"flag:foto",
"text":"La foto è stata confrontata. Il volto non va scelto dalla voce."
}
],
"opts":[
{
"t":"Non apro soltanto perché è una porta.",
"to":"LIV_irene_08",
"fx":[
"flag:porta_nota"
]
},
{
"t":"Prima riconosco chi la sorveglia.",
"to":"LIV_irene_08",
"fx":[
"flag:porta_nota"
]
}
]
},
{
"id":"LIV_irene_07",
"who":"Livia",
"fase":"IV",
"text":"Il nome va con il volto. Non basta una voce che lo pronuncia.",
"opts":[
{
"t":"Non basta chiamarsi Irene.",
"to":"LIV_irene_08"
},
{
"t":"Il riconoscimento deve avere una prova.",
"to":"LIV_irene_08"
},
{
"t":"Riguardo lo spazio vuoto, come avevamo deciso.",
"to":"V2_L05_03",
"req":"flag:l05b"
}
]
},
{
"id":"LIV_irene_08",
"who":"Livia",
"fase":"IV",
"text":"Il volto, il nome, la porta. Per adesso teniamoli insieme, senza aggiustarli.",
"alt":[
{
"req":"flag:l05c",
"text":"Quel punto non volevi guardarlo. Non lo riempio io al posto tuo."
},
{
"req":"conf:Livia>=75",
"text":"La guardiamo insieme. Non devi capirla prima per aiutarmi."
}
]
},
{
"id":"LIV_promessa_01",
"who":"Livia",
"fase":"V",
"text":"Rosa mi ha detto che avete parlato del recupero.",
"opts":[
{
"t":"La mantengo senza prometterti il risultato.",
"to":"LIV_promessa_02"
},
{
"t":"Se non so, te lo dico. Niente risposte finte.",
"to":"V2_L06_01",
"fx":[
"flag:l06b"
]
},
{
"t":"Non ti racconterò quello che trovo.",
"to":"V2_L06_03",
"fx":[
"flag:l06c",
"sblocca:LIV_promessa_08"
]
}
]
},
{
"id":"LIV_promessa_02",
"who":"Livia",
"fase":"V",
"text":"La promessa era cercare Ottavio. Non inventare un lieto fine.",
"opts":[
{
"t":"È ancora quella.",
"to":"LIV_promessa_04"
},
{
"t":"Non ti vendo una certezza.",
"to":"LIV_promessa_04"
}
]
},
{
"id":"LIV_promessa_03",
"who":"Livia",
"fase":"V",
"text":"Se torni senza di lui, voglio sapere quello che hai trovato.",
"opts":[
{
"t":"Ti dirò anche quello che non volevo vedere.",
"to":"LIV_promessa_05"
},
{
"t":"Non lo nascondo per consolarti.",
"to":"LIV_promessa_05"
}
]
},
{
"id":"LIV_promessa_04",
"who":"Livia",
"fase":"V",
"text":"Se lo trovi vivo, prima mettete in chiaro il passaggio.",
"opts":[
{
"t":"Prima lui, poi la strada per uscire.",
"to":"LIV_promessa_06"
},
{
"t":"Non porto fuori una sua imitazione.",
"to":"LIV_promessa_06"
}
]
},
{
"id":"LIV_promessa_05",
"who":"Livia",
"fase":"V",
"text":"Non mi basta una voce. E non deve bastare neanche a te.",
"opts":[
{
"t":"Ti porterò un riscontro, se c’è.",
"to":"LIV_promessa_07"
},
{
"t":"Se non c’è, te lo dirò.",
"to":"LIV_promessa_07"
}
]
},
{
"id":"LIV_promessa_06",
"who":"Livia",
"fase":"V",
"text":"Grazie. Il resto non riesco a chiedertelo senza farmi male da sola.",
"alt":[
{
"req":"conf:Livia>=100",
"text":"Senza una buona notizia puoi entrare lo stesso."
}
],
"opts":[
{
"t":"Questo te lo prometto.",
"to":"LIV_promessa_08",
"fx":[
"cnt:legami+1",
"flag:livia_verita_promessa"
]
},
{
"t":"Non ti mento.",
"to":"LIV_promessa_08",
"fx":[
"cnt:legami+1",
"flag:livia_verita_promessa"
]
}
]
},
{
"id":"LIV_promessa_07",
"who":"Livia",
"fase":"V",
"text":"Non ti chiedo di saperlo prima. Ti chiedo di non mentirmi dopo.",
"opts":[
{
"t":"Te lo dirò.",
"to":"LIV_promessa_08"
},
{
"t":"Anche se mi farà vergognare.",
"to":"LIV_promessa_08"
},
{
"t":"La promessa era una risposta vera, anche senza un lieto fine.",
"to":"V2_L06_03",
"req":"flag:l06b"
}
]
},
{
"id":"LIV_promessa_08",
"who":"Livia",
"fase":"V",
"text":"Io resto qui. Quando puoi, dimmi anche quello che non avresti voluto trovare.",
"alt":[
{
"req":"flag:l06c",
"text":"Il risultato lo volevi tenere. Per ripartire serve una verità."
},
{
"req":"conf:Livia>=100",
"text":"Ti aspetto con quello che c’è, non con la risposta bella."
},
{
"req":"flag:livia_verita_promessa",
"text":"Mi hai promesso una verità. Non una bella notizia."
}
]
},
{
"id":"PRE_1_01",
"who":"Sconosciuto",
"fase":"II",
"text":"Quella non era una cosa tua.",
"alt":[
{
"req":"conf:Sconosciuto>=25",
"text":"L’hai guardata come se aspettassi che ti rispondesse."
}
]
},
{
"id":"PRE_1_02",
"who":"Sconosciuto",
"fase":"II",
"text":"Hai guardato bene, allora.",
"alt":[
{
"req":"conf:Sconosciuto>=25",
"text":"Hai guardato bene. Adesso continui qui."
}
]
},
{
"id":"PRE_1_03",
"who":"Sconosciuto",
"fase":"II",
"text":"Ti interessa più il nome o quello che hai trovato?",
"opts":[
{
"t":"Dimmi da dove conosci quell’oggetto.",
"to":"PRE_1_04"
},
{
"t":"Non ti do altre informazioni.",
"to":"PRE_1_05"
}
]
},
{
"id":"PRE_1_04",
"who":"Sconosciuto",
"fase":"II",
"text":"Il nome l’hai già letto. Non il mio."
},
{
"id":"PRE_1_05",
"who":"Sconosciuto",
"fase":"II",
"text":"Quello che hai trovato è passato anche da qui."
},
{
"id":"PRE_1_06",
"who":"Sconosciuto",
"fase":"II",
"text":"Puoi anche non rispondere.",
"alt":[
{
"req":"conf:Sconosciuto>=25",
"text":"Puoi non rispondere. Intanto hai letto."
}
]
},
{
"id":"PRE_1_07",
"who":"Sconosciuto",
"fase":"II",
"text":"Vuoi sentire il resto?",
"opts":[
{
"t":"Prima confronto quello che hai già detto.",
"to":"PRE_1_08"
},
{
"t":"Conservo il messaggio senza seguirti.",
"to":"PRE_1_09"
},
{
"t":"Per ora finisce qui.",
"to":"PRE_1_10"
}
]
},
{
"id":"PRE_1_08",
"who":"Sconosciuto",
"fase":"II",
"text":"Hai conservato una copia. Non è la stessa cosa.",
"alt":[
{
"req":"flag:copia_conservata",
"text":"La copia l’hai tenuta. Adesso vuoi che ti basti."
}
],
"req":"flag:copia_conservata",
"fallback":"PRE_1_09"
},
{
"id":"PRE_1_09",
"who":"Sconosciuto",
"fase":"II",
"text":"La domanda puoi tenerla aperta.",
"alt":[
{
"req":"conf:Sconosciuto>=50",
"text":"La domanda la tieni aperta. Anch’io."
}
]
},
{
"id":"PRE_1_10",
"who":"Sconosciuto",
"fase":"II",
"text":"Allora fermiamoci qui. Per adesso."
},
{
"id":"PRE_2_01",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, vieni. Non voglio restare sola.",
"alt":[
{
"req":"conf:Sconosciuto>=50",
"text":"Nonno, vieni. Non farmi spiegare perché proprio a te."
},
{
"req":"flag:nonno_uso_fissato",
"text":"Nonno, non mi fare ripetere come ti chiamo. Vieni."
}
]
},
{
"id":"PRE_2_02",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sono nella galleria. La mia auto non riparte."
},
{
"id":"PRE_2_03",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Mi riconosci, vero?",
"opts":[
{
"t":"Dimmi una cosa di casa.",
"to":"PRE_2_04",
"fx":[
"flag:ev_voce_imitata"
]
},
{
"t":"Una voce non mi basta. Verifico fuori.",
"to":"PRE_2_05"
}
]
},
{
"id":"PRE_2_04",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, ti prego. Sai che sono io.",
"alt":[
{
"req":"conf:Sconosciuto>=50",
"text":"Nonno, se fossi qui non avresti bisogno di chiedermelo."
}
]
},
{
"id":"PRE_2_05",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Ti dà fastidio adesso come ti chiamo?",
"alt":[
{
"req":"flag:ev_voce_imitata",
"text":"Le domande, allora? Io ti sto aspettando."
}
]
},
{
"id":"PRE_2_06",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Il turno può aspettare. Io no."
},
{
"id":"PRE_2_07",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Mi vieni a prendere?",
"opts":[
{
"t":"Verifico prima di muovermi.",
"to":"PRE_2_08",
"fx":[
"flag:ev_voce_imitata"
]
},
{
"t":"Cerco il punto senza aprire nulla.",
"to":"PRE_2_09"
},
{
"t":"Non seguo la chiamata.",
"to":"PRE_2_10"
}
]
},
{
"id":"PRE_2_08",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, per una volta non mi lasciare spiegare tutto."
},
{
"id":"PRE_2_09",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Puoi fare una domanda dopo. Adesso vieni."
},
{
"id":"PRE_2_10",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Va bene. Aspetto che smetti di avere paura di me.",
"alt":[
{
"req":"conf:Sconosciuto>=75",
"text":"Aspetto. Ormai sai dove tornare a cercare una risposta."
}
]
},
{
"id":"PRE_3_01",
"who":"Sconosciuto",
"fase":"IV",
"as":"Zio Claudio",
"text":"Hai ancora il temperino?",
"alt":[
{
"req":"conf:Sconosciuto>=50",
"text":"Il temperino lo hai tenuto vicino."
}
]
},
{
"id":"PRE_3_02",
"who":"Sconosciuto",
"fase":"IV",
"as":"Zio Claudio",
"text":"La grafia l’hai riconosciuta subito."
},
{
"id":"PRE_3_03",
"who":"Sconosciuto",
"fase":"IV",
"as":"Zio Claudio",
"text":"Ti serve un’altra prova che sono io?",
"opts":[
{
"t":"Confronto la voce con il nastro.",
"to":"PRE_3_04"
},
{
"t":"Ti riconosco solo dopo una verifica.",
"to":"PRE_3_05"
}
]
},
{
"id":"PRE_3_04",
"who":"Sconosciuto",
"fase":"IV",
"as":"Zio Claudio",
"text":"Il nastro l’hai ascoltato. La voce è questa."
},
{
"id":"PRE_3_05",
"who":"Sconosciuto",
"fase":"IV",
"as":"Zio Claudio",
"text":"Una fotografia non ti riporta a casa."
},
{
"id":"PRE_3_06",
"who":"Sconosciuto",
"fase":"IV",
"as":"Zio Claudio",
"text":"Ho lasciato sei auto. Tu ne hai presa una.",
"alt":[
{
"req":"conf:Sconosciuto>=50",
"text":"Sei auto. Ne hai scelta una. Chi hai preso con te?"
}
]
},
{
"id":"PRE_3_07",
"who":"Sconosciuto",
"fase":"IV",
"as":"Zio Claudio",
"text":"Mi aiuti a finire quello che ho lasciato?",
"opts":[
{
"t":"Vado alla porta senza aprirla.",
"to":"PRE_3_08",
"fx":[
"flag:porta_ispezione_scelta"
]
},
{
"t":"Prima sento Livia sugli originali.",
"to":"PRE_3_09"
},
{
"t":"Non seguo un ordine solo perché ha la tua voce.",
"to":"PRE_3_10"
}
]
},
{
"id":"PRE_3_08",
"who":"Sconosciuto",
"fase":"IV",
"as":"Zio Claudio",
"text":"Non ti ho chiesto di capire tutto. Ti ho chiesto di venire."
},
{
"id":"PRE_3_09",
"who":"Sconosciuto",
"fase":"IV",
"as":"Zio Claudio",
"text":"Livia conserva. Tu puoi ancora fare qualcosa."
},
{
"id":"PRE_3_10",
"who":"Sconosciuto",
"fase":"IV",
"as":"Zio Claudio",
"text":"Se vuoi una risposta, torna alla porta.",
"alt":[
{
"req":"conf:Sconosciuto>=75",
"text":"Torna alla porta. Non fingere di volere solo risposte."
},
{
"req":"flag:porta_ispezione_scelta",
"text":"Hai scelto di guardare senza aprire. Ti aspetto."
}
]
},
{
"id":"PRE_4_01",
"who":"Sconosciuto",
"fase":"V",
"text":"Hai smesso di chiamarmi con il suo nome.",
"alt":[
{
"req":"conf:Sconosciuto>=75",
"text":"Hai tolto il suo nome. Il posto che gli tieni no."
}
]
},
{
"id":"PRE_4_02",
"who":"Sconosciuto",
"fase":"V",
"text":"Non sei diventato più difficile da conoscere."
},
{
"id":"PRE_4_03",
"who":"Sconosciuto",
"fase":"V",
"text":"Apri quella porta, pezzo di merda.",
"opts":[
{
"t":"No. So chi stai cercando di imitare.",
"to":"PRE_4_04",
"fx":[
"flag:patto_rifiutato"
]
},
{
"t":"Prima verifico chi posso ancora far uscire.",
"to":"PRE_4_05"
}
]
},
{
"id":"PRE_4_04",
"who":"Sconosciuto",
"fase":"V",
"text":"Allora tienila chiusa. Vediamo quanto resti sicuro."
},
{
"id":"PRE_4_05",
"who":"Sconosciuto",
"fase":"V",
"text":"La tua risposta non cancella quello che mi hai promesso.",
"alt":[
{
"req":"flag:patto_esplicito",
"text":"La promessa l’hai fatta sapendo chi avevi davanti."
}
],
"req":"flag:patto_esplicito",
"fallback":"PRE_4_06"
},
{
"id":"PRE_4_06",
"who":"Sconosciuto",
"fase":"V",
"text":"Non ti serve credermi. Ti serve qualcuno da riportare.",
"alt":[
{
"req":"flag:patto_sospeso",
"text":"Hai lasciato il patto in sospeso. Il posto di chi manca no."
}
]
},
{
"id":"PRE_4_07",
"who":"Sconosciuto",
"fase":"V",
"text":"Sai chi sono. Vuoi ancora trattare?",
"opts":[
{
"t":"So chi sei. Ti accompagno al varco.",
"to":"PRE_4_08",
"fx":[
"cnt:patti+1",
"flag:patto_esplicito"
]
},
{
"t":"Non ti prometto niente. Voglio prima i fatti.",
"to":"PRE_4_09",
"fx":[
"flag:patto_sospeso"
]
},
{
"t":"Non tratto. Tengo chiuso il passaggio.",
"to":"PRE_4_10",
"fx":[
"flag:patto_rifiutato"
]
}
]
},
{
"id":"PRE_4_08",
"who":"Sconosciuto",
"fase":"V",
"text":"Bene. Non fingiamo più di conoscerci da prima."
},
{
"id":"PRE_4_09",
"who":"Sconosciuto",
"fase":"V",
"text":"Vaffanculo. Non avevi queste domande quando ti convenivo."
},
{
"id":"PRE_4_10",
"who":"Sconosciuto",
"fase":"V",
"text":"Scegli con chi tornare. Poi guardalo bene.",
"alt":[
{
"req":"conf:Sconosciuto>=75",
"text":"Scegli con chi tornare. So quanto ti pesa tornare solo."
},
{
"req":"flag:patto_rifiutato",
"text":"Hai rifiutato il patto. L’uscita devi ancora sceglierla."
}
]
},
{
"id":"V2_E01_01",
"who":"Elena",
"fase":"I",
"text":"Mandami il dettaglio. Se fotografi solo il muso sembra sempre una buona idea.",
"opts":[
{
"t":"Ti mostro l’interno, senza sistemarlo prima.",
"to":"V2_E01_02"
},
{
"t":"Prima voglio guardarlo io.",
"to":"V2_E01_03"
}
]
},
{
"id":"V2_E01_02",
"who":"Elena",
"fase":"I",
"text":"Così posso prenderti in giro su qualcosa di preciso. Servizio serio.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_ritiro_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E01_03"
}
]
},
{
"id":"V2_E01_03",
"who":"Elena",
"fase":"I",
"text":"Guardala pure. La foto può aspettare.",
"alt":[
{
"req":"flag:e01c",
"text":"Va bene. Non mi trasformo in una perizia con le gambe."
}
]
},
{
"id":"V2_E02_01",
"who":"Elena",
"fase":"I",
"text":"Un testimone. Non mandarmi istruzioni per sedermi sul mio divano.",
"opts":[
{
"t":"Va bene. Raccontami il processo.",
"to":"V2_E02_02"
},
{
"t":"Allora lascio vincere Pasta.",
"to":"V2_E02_03"
}
]
},
{
"id":"V2_E02_02",
"who":"Elena",
"fase":"I",
"text":"L’imputato non si è presentato. Era già sul cuscino del giudice.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_pasta_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E02_03"
}
]
},
{
"id":"V2_E02_03",
"who":"Elena",
"fase":"I",
"text":"Pasta è assolto. Io resto in piedi, evidentemente.",
"alt":[
{
"req":"flag:e02c",
"text":"Ricevuto. Ti risparmio il resto. Non era un esame da superare."
}
]
},
{
"id":"V2_E03_01",
"who":"Elena",
"fase":"I",
"text":"Un messaggio quando puoi. Non un appuntamento che saltiamo entrambi.",
"opts":[
{
"t":"Scrivo una volta, poi aspetto.",
"to":"V2_E03_02"
},
{
"t":"Meglio sentirci dopo il turno.",
"to":"V2_E03_03"
}
]
},
{
"id":"V2_E03_02",
"who":"Elena",
"fase":"I",
"text":"Esatto. Se non rispondo, sto lavorando. Non sto punendo nessuno.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_turno_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E03_03"
}
]
},
{
"id":"V2_E03_03",
"who":"Elena",
"fase":"I",
"text":"Allora niente ora precisa. Ci togliamo almeno quel problema.",
"alt":[
{
"req":"flag:e03c",
"text":"Non te l’avevo chiesto. Mi arrangio, ma potevi dirlo meglio."
}
]
},
{
"id":"V2_E04_01",
"who":"Elena",
"fase":"I",
"text":"Sì. Vorrei lamentarmi senza aprire un cantiere sul coinquilino.",
"opts":[
{
"t":"Vai. Non cerco una soluzione.",
"to":"V2_E04_02"
},
{
"t":"Ti lascio finire quando puoi.",
"to":"V2_E04_03"
}
]
},
{
"id":"V2_E04_02",
"who":"Elena",
"fase":"I",
"text":"Grazie. Ho già uno che parla troppo. Due diventava una condanna.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_coinquilino_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E04_03"
}
]
},
{
"id":"V2_E04_03",
"who":"Elena",
"fase":"I",
"text":"Va bene. Lo sfogo lo rimandiamo; non mi serve vincere una discussione.",
"alt":[
{
"req":"flag:e04c",
"text":"Va bene. Mi fermo. Non ti chiedi compagnia con un modulo, però."
}
]
},
{
"id":"V2_E05_01",
"who":"Elena",
"fase":"I",
"text":"Va bene. Lo dici perché lo vuoi o perché ti senti in colpa?",
"opts":[
{
"t":"Perché non voglio bloccarti la serata.",
"to":"V2_E05_02"
},
{
"t":"Perché non so quanto manca.",
"to":"V2_E05_03"
}
]
},
{
"id":"V2_E05_02",
"who":"Elena",
"fase":"I",
"text":"Allora mangio. Non ti tengo un posto che sembri un rimprovero.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_cena_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E05_03"
}
]
},
{
"id":"V2_E05_03",
"who":"Elena",
"fase":"I",
"text":"È una risposta sufficiente. Se cambia qualcosa mi avvisi.",
"alt":[
{
"req":"flag:e05c",
"text":"D’accordo. Ma se poi cambi idea, il primo messaggio lo mandi tu."
}
]
},
{
"id":"V2_E06_01",
"who":"Elena",
"fase":"I",
"text":"Sì. Io stavo solo odiando un foglio. Adesso siamo già a una discussione.",
"opts":[
{
"t":"Ho capito male. Ripartiamo dal foglio.",
"to":"V2_E06_02"
},
{
"t":"Lascio perdere i conti per un momento.",
"to":"V2_E06_03"
}
]
},
{
"id":"V2_E06_02",
"who":"Elena",
"fase":"I",
"text":"Il foglio almeno non risponde. Tu hai ancora margine di miglioramento.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_bollette_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E06_03"
}
]
},
{
"id":"V2_E06_03",
"who":"Elena",
"fase":"I",
"text":"Va bene. Nessuno deve pagare per sentirsi ascoltato.",
"alt":[
{
"req":"flag:e06c",
"text":"Va bene. Non te li chiedo e non te li racconto."
}
]
},
{
"id":"V2_E07_01",
"who":"Elena",
"fase":"II",
"text":"Questo lo capisco. Non confonderlo con non avevo un momento.",
"opts":[
{
"t":"Hai ragione. Ho rimandato io.",
"to":"V2_E07_02"
},
{
"t":"Mi serviva fermarmi prima di parlarti.",
"to":"V2_E07_03"
}
]
},
{
"id":"V2_E07_02",
"who":"Elena",
"fase":"II",
"text":"Allora la prossima volta scrivi non so. È già qualcosa che posso capire.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_richiamo_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E07_03"
}
]
},
{
"id":"V2_E07_03",
"who":"Elena",
"fase":"II",
"text":"Va bene. Ci sentiamo quando sei fermo, senza completare i vuoti da soli.",
"alt":[
{
"req":"flag:e07c",
"text":"Mi fermo. Se hai bisogno, devi però essere tu a scrivere."
}
]
},
{
"id":"V2_E08_01",
"who":"Elena",
"fase":"II",
"text":"Questa è una scusa. Se arriva un però la mando indietro.",
"opts":[
{
"t":"Niente però. Ti ho risposto male.",
"to":"V2_E08_02"
},
{
"t":"Ti chiedo tempo prima di ricominciare.",
"to":"V2_E08_03"
}
]
},
{
"id":"V2_E08_02",
"who":"Elena",
"fase":"II",
"text":"Va bene. Posso essere arrabbiata e volerti ancora parlare.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_litigio_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E08_03"
}
]
},
{
"id":"V2_E08_03",
"who":"Elena",
"fase":"II",
"text":"Prenditelo. Non usare il silenzio per farmela pagare.",
"alt":[
{
"req":"flag:e08c",
"text":"Va bene. Il messaggio di domani lo inizi tu."
}
]
},
{
"id":"V2_E09_01",
"who":"Elena",
"fase":"II",
"text":"Bene. Prima pensavo a una foto vecchia. Fammi confrontare il particolare.",
"opts":[
{
"t":"Aspetto qui mentre controlli.",
"to":"V2_E09_02"
},
{
"t":"Non voglio darti la risposta io.",
"to":"V2_E09_03"
}
]
},
{
"id":"V2_E09_02",
"who":"Elena",
"fase":"II",
"text":"Corrisponde. Adesso abbiamo un fatto scomodo, non una spiegazione.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_distanza_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E09_03"
}
]
},
{
"id":"V2_E09_03",
"who":"Elena",
"fase":"II",
"text":"Lo guardo senza chiederti di spostarti. Una cosa alla volta.",
"alt":[
{
"req":"flag:e09c",
"text":"Rimane senza confronto. Non lo chiamo certo per consolarti."
}
]
},
{
"id":"V2_E10_01",
"who":"Elena",
"fase":"III",
"text":"Basta a ricominciare. Non a far finta che non mi abbia dato fastidio.",
"opts":[
{
"t":"Puoi essere ancora arrabbiata.",
"to":"V2_E10_02"
},
{
"t":"Dimmi cosa ti ha ferito, poi mi fermo.",
"to":"V2_E10_03"
}
]
},
{
"id":"V2_E10_02",
"who":"Elena",
"fase":"III",
"text":"Che mi rispondevi come se fossi un altro problema della macchina.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_riparazione_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E10_03"
}
]
},
{
"id":"V2_E10_03",
"who":"Elena",
"fase":"III",
"text":"Mi basta che la prossima volta lo dici prima di sbottare.",
"alt":[
{
"req":"flag:e10c",
"text":"Va bene. Io però non ho il pulsante ripristina."
}
]
},
{
"id":"V2_E11_01",
"who":"Elena",
"fase":"IV",
"text":"Posso. Non devo vincere neanche sul soprannome.",
"opts":[
{
"t":"Grazie. Oggi mi serve una cosa semplice.",
"to":"V2_E11_02"
},
{
"t":"Domani puoi ricominciare a rompere.",
"to":"V2_E11_03"
}
]
},
{
"id":"V2_E11_02",
"who":"Elena",
"fase":"IV",
"text":"Domani valuto quanto brontoli. Ho un mestiere da difendere.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_nonno_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E11_03"
}
]
},
{
"id":"V2_E11_03",
"who":"Elena",
"fase":"IV",
"text":"Per oggi basta. Il nome non è un test che devi sopportare.",
"alt":[
{
"req":"flag:e11c",
"text":"D’accordo. Lo smetto. Non ti prometto di capire subito perché."
}
]
},
{
"id":"V2_E12_01",
"who":"Elena",
"fase":"V",
"text":"Allora dimmine una piccola. Non devi sistemare la giornata intera.",
"opts":[
{
"t":"Mi sono fermato. Sto mangiando.",
"to":"V2_E12_02"
},
{
"t":"Ho bisogno di compagnia per un momento.",
"to":"V2_E12_03"
}
]
},
{
"id":"V2_E12_02",
"who":"Elena",
"fase":"V",
"text":"Va bene. Per adesso bastano un tavolo e un messaggio che capisco.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ELE_cena_ritorno_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_E12_03"
}
]
},
{
"id":"V2_E12_03",
"who":"Elena",
"fase":"V",
"text":"Resto nella chat. Tu non devi diventare interessante per tenermi qui.",
"alt":[
{
"req":"flag:e12c",
"text":"Va bene. Non ti faccio domande. Se cambi idea, ricominci tu."
}
]
},
{
"id":"V2_R01_01",
"who":"Rosa",
"fase":"II",
"text":"Prima cosa: non usare il rumore come domanda a risposta multipla.",
"opts":[
{
"t":"Dimmi il controllo. Poi provo io.",
"to":"V2_R01_02"
},
{
"t":"Per ora preferisco che lo faccia tu.",
"to":"V2_R01_03"
}
]
},
{
"id":"V2_R01_02",
"who":"Rosa",
"fase":"II",
"text":"Guarda dove ti indico. Devi imparare questo punto, non diventare meccanico.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ROS_attrezzi_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_R01_03"
}
]
},
{
"id":"V2_R01_03",
"who":"Rosa",
"fase":"II",
"text":"Va bene. Però non chiamare controllo la prossima accensione a caso.",
"alt":[
{
"req":"flag:r01c",
"text":"Faccio io. Al prossimo rumore, però, da lontano posso aiutarti meno."
}
]
},
{
"id":"V2_R02_01",
"who":"Rosa",
"fase":"II",
"text":"Bravo. Per arrivarci non serviva fare un incidente dimostrativo.",
"opts":[
{
"t":"Metto via le chiavi un momento.",
"to":"V2_R02_02"
},
{
"t":"Resto fermo senza inventare un orario.",
"to":"V2_R02_03"
}
]
},
{
"id":"V2_R02_02",
"who":"Rosa",
"fase":"II",
"text":"Adesso fai una cosa che non somigli a guidare. Anche stare zitto va benissimo.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ROS_prudenza_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_R02_03"
}
]
},
{
"id":"V2_R02_03",
"who":"Rosa",
"fase":"II",
"text":"Bene. Quando riparti me lo dici dopo aver deciso, non per chiedere il permesso.",
"alt":[
{
"req":"flag:r02c",
"text":"Va bene. Non ti inseguo con una tazza. La scelta resta tua."
}
]
},
{
"id":"V2_R03_01",
"who":"Rosa",
"fase":"III",
"text":"Ecco una proposta che non mi fa invecchiare a vista.",
"opts":[
{
"t":"Ti descrivo solo quello che ho visto.",
"to":"V2_R03_02"
},
{
"t":"Comincio dal punto che mi avevi indicato.",
"to":"V2_R03_03"
}
]
},
{
"id":"V2_R03_02",
"who":"Rosa",
"fase":"III",
"text":"Così posso aiutarti senza fingere di essere davanti al tuo cofano.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ROS_ricontrollo_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_R03_03"
}
]
},
{
"id":"V2_R03_03",
"who":"Rosa",
"fase":"III",
"text":"Se non sai descriverlo, ci fermiamo lì. Non riempire il buco con bene.",
"alt":[
{
"req":"flag:r03c",
"text":"Va bene. Io non ti dirò che è tutto a posto senza aver letto niente."
}
]
},
{
"id":"V2_R04_01",
"who":"Rosa",
"fase":"III",
"text":"Il resto non è una ricompensa perché sei stato educato.",
"opts":[
{
"t":"Dimmi solo quello che serve a non ripeterlo.",
"to":"V2_R04_02"
},
{
"t":"Mi basta sapere perché sei qui.",
"to":"V2_R04_03"
}
]
},
{
"id":"V2_R04_02",
"who":"Rosa",
"fase":"III",
"text":"Io sono uscita. Ottavio no. Non facciamola diventare una storia in cui sapevo tutto.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ROS_passato_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_R04_03"
}
]
},
{
"id":"V2_R04_03",
"who":"Rosa",
"fase":"III",
"text":"Resto per lui. Non perché mi piaccia questa strada di merda.",
"alt":[
{
"req":"flag:r04c",
"text":"Va bene. Allora non prendere decisioni al mio posto senza conoscerla."
}
]
},
{
"id":"V2_R05_01",
"who":"Rosa",
"fase":"III",
"text":"Bene. Cercare Ottavio e obbedire a una voce sono due lavori diversi.",
"opts":[
{
"t":"Se manca il riconoscimento ci fermiamo.",
"to":"V2_R05_02"
},
{
"t":"Ti dico il dubbio prima di scegliere.",
"to":"V2_R05_03"
}
]
},
{
"id":"V2_R05_02",
"who":"Rosa",
"fase":"III",
"text":"Questo è un limite utile. Non una scusa preparata in anticipo.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ROS_promessa_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_R05_03"
}
]
},
{
"id":"V2_R05_03",
"who":"Rosa",
"fase":"III",
"text":"Va bene. Un dubbio detto prima mi serve più di un coraggioso dopo.",
"alt":[
{
"req":"flag:r05c",
"text":"Ricevuto. Non ti inseguo con la promessa. La ricerca continuo a farla io."
}
]
},
{
"id":"V2_R06_01",
"who":"Rosa",
"fase":"III",
"text":"Allora fai quello. Il verbale di quanto sei stato bravo non mi serve.",
"opts":[
{
"t":"Resto fermo e ti riscrivo tra poco.",
"to":"V2_R06_02"
},
{
"t":"Ti dico soltanto se sono ferito.",
"to":"V2_R06_03"
}
]
},
{
"id":"V2_R06_02",
"who":"Rosa",
"fase":"III",
"text":"Basta questo. Un messaggio leggibile vale più di dieci scritti tremando.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ROS_dopo_passaggio_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_R06_03"
}
]
},
{
"id":"V2_R06_03",
"who":"Rosa",
"fase":"III",
"text":"Controlla prima. Non voglio un non credo per chiudere la chat.",
"alt":[
{
"req":"flag:r06c",
"text":"Va bene. Allora mi scrivi tu quando puoi. Non tiro a indovinare da qui."
}
]
},
{
"id":"V2_R07_01",
"who":"Rosa",
"fase":"IV",
"text":"Finalmente. Una macchia non è un ordine di servizio.",
"opts":[
{
"t":"La registrazione dice che eri tornata. Non che dobbiamo farlo subito.",
"to":"V2_R07_02"
},
{
"t":"Guardiamo prima il punto da cui eri uscita.",
"to":"V2_R07_03"
}
]
},
{
"id":"V2_R07_02",
"who":"Rosa",
"fase":"IV",
"text":"Esatto. Per allora avevo solo le mani. Per adesso ci serve una strada.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ROS_segni_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_R07_03"
}
]
},
{
"id":"V2_R07_03",
"who":"Rosa",
"fase":"IV",
"text":"Quel punto è nella registrazione. Non lo invento perché lo voglio ritrovare.",
"alt":[
{
"req":"flag:r07c",
"text":"È una scelta. Però non chiamarla ancora mancanza di informazioni."
}
]
},
{
"id":"V2_R08_01",
"who":"Rosa",
"fase":"V",
"text":"Sì. Se aspettiamo di avere paura non decidiamo più insieme.",
"opts":[
{
"t":"Se manca il punto d’attesa lo dico.",
"to":"V2_R08_02"
},
{
"t":"Se cambia il percorso non improvviso.",
"to":"V2_R08_03"
}
]
},
{
"id":"V2_R08_02",
"who":"Rosa",
"fase":"V",
"text":"Bene. Non devi riportarmi una versione più bella di quello che hai visto.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ROS_recupero_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_R08_03"
}
]
},
{
"id":"V2_R08_03",
"who":"Rosa",
"fase":"V",
"text":"Allora il recupero resta una scelta, non una promessa che ti trascina.",
"alt":[
{
"req":"flag:r08c",
"text":"Rifaccio il piano. Non ti sostituisco con una speranza."
}
]
},
{
"id":"V2_R09_01",
"who":"Rosa",
"fase":"V",
"text":"Giusto. Io posso raccontartelo. Non posso renderlo piccolo.",
"opts":[
{
"t":"Non decidiamo soltanto con le parole.",
"to":"V2_R09_02"
},
{
"t":"Voglio capire chi potrebbe uscire.",
"to":"V2_R09_03"
}
]
},
{
"id":"V2_R09_02",
"who":"Rosa",
"fase":"V",
"text":"Allora guardiamo il prezzo senza offrire già la tua vita per educazione.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ROS_guardia_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_R09_03"
}
]
},
{
"id":"V2_R09_03",
"who":"Rosa",
"fase":"V",
"text":"Deve essere una persona vera. Il posto vuoto non basta a giustificarti.",
"alt":[
{
"req":"flag:r09c",
"text":"Non la chiamiamo consapevole se smetti di guardarla."
}
]
},
{
"id":"V2_R10_01",
"who":"Rosa",
"fase":"V",
"text":"Bene. Posso volerti vivo ed essere ancora incazzata con questa strada.",
"opts":[
{
"t":"Te lo dirò senza farti scegliere per me.",
"to":"V2_R10_02"
},
{
"t":"Non confondo l’uscita con aver salvato tutti.",
"to":"V2_R10_03"
}
]
},
{
"id":"V2_R10_02",
"who":"Rosa",
"fase":"V",
"text":"È quello che ti chiedo. Il giudizio non lo metto al posto delle chiavi.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"ROS_prima_porta_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_R10_03"
}
]
},
{
"id":"V2_R10_03",
"who":"Rosa",
"fase":"V",
"text":"Neanche restare salva tutti per magia. Devi sapere chi fai passare.",
"alt":[
{
"req":"flag:r10c",
"text":"Non ti fermo. Però mi lasci a indovinare anche il saluto."
}
]
},
{
"id":"V2_L01_01",
"who":"Livia",
"fase":"III",
"text":"Meglio. Una spiegazione sbagliata occupa tutta la scrivania.",
"opts":[
{
"t":"Descrivo quello che c’è scritto.",
"to":"V2_L01_02"
},
{
"t":"Ti dico anche quello che non si legge.",
"to":"V2_L01_03"
}
]
},
{
"id":"V2_L01_02",
"who":"Livia",
"fase":"III",
"text":"Grazie. Se un nome manca, non lo completo perché conosco già la storia.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"LIV_primo_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_L01_03"
}
]
},
{
"id":"V2_L01_03",
"who":"Livia",
"fase":"III",
"text":"Va bene. Una parte illeggibile non è una risposta contro di te.",
"alt":[
{
"req":"flag:l01c",
"text":"Senza vederlo non posso dire di averlo confrontato."
}
]
},
{
"id":"V2_L02_01",
"who":"Livia",
"fase":"III",
"text":"Puoi farlo. L’originale è già da me, ma senza la tua copia non confronto niente.",
"opts":[
{
"t":"Ti dico almeno che cosa mi frena.",
"to":"V2_L02_02"
},
{
"t":"Voglio riparlarne prima di spedirla.",
"to":"V2_L02_03"
}
]
},
{
"id":"V2_L02_02",
"who":"Livia",
"fase":"III",
"text":"Questo lo posso ascoltare. La paura non rende inutile quello che hai trovato.",
"opts":[
{
"t":"La mando adesso.",
"to":"LIV_affido_06",
"fx":[
"flag:livia",
"cnt:legami+1"
]
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_L02_03"
}
]
},
{
"id":"V2_L02_03",
"who":"Livia",
"fase":"III",
"text":"Va bene. Quando torni a parlarne non devi fingere di esserti fidato da subito.",
"alt":[
{
"req":"flag:l02c",
"text":"Mi fermo. Gli originali restano qui. La collaborazione, per adesso, no."
}
]
},
{
"id":"V2_L03_01",
"who":"Livia",
"fase":"III",
"text":"Vorrei che fosse ancora lui a rispondere. Ecco, detta senza il resto.",
"opts":[
{
"t":"Non userò quella speranza come una certezza.",
"to":"V2_L03_02"
},
{
"t":"Non devi vergognarti di averla.",
"to":"V2_L03_03"
}
]
},
{
"id":"V2_L03_02",
"who":"Livia",
"fase":"III",
"text":"Grazie. A volte sistemo le frasi per non far vedere quanto lo voglio.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"LIV_ottavio_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_L03_03"
}
]
},
{
"id":"V2_L03_03",
"who":"Livia",
"fase":"III",
"text":"Non le carte. Mio fratello. Ogni tanto devo ricordarmi di scriverlo così.",
"alt":[
{
"req":"flag:l03c",
"text":"Va bene. Ti mando solo quello che so. Il resto lo tengo per me."
}
]
},
{
"id":"V2_L04_01",
"who":"Livia",
"fase":"IV",
"text":"Va bene. Non serve farmi contenta. Serve capire dove ci siamo fermati.",
"opts":[
{
"t":"Avevo paura di perdere anche quello che credevo di sapere.",
"to":"V2_L04_02"
},
{
"t":"Non mi fidavo ancora di te.",
"to":"V2_L04_03"
}
]
},
{
"id":"V2_L04_02",
"who":"Livia",
"fase":"IV",
"text":"Questo lo capisco. Però da solo non avevi un altro originale nascosto.",
"opts":[
{
"t":"La mando adesso.",
"to":"LIV_fiducia_06",
"fx":[
"flag:livia",
"cnt:legami+1"
]
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_L04_03"
}
]
},
{
"id":"V2_L04_03",
"who":"Livia",
"fase":"IV",
"text":"Hai fatto bene a dirlo chiaro. Posso ricominciare senza fare finta di niente.",
"alt":[
{
"req":"flag:l04c",
"text":"Non continuo a chiedertela. Il confronto resta da fare."
}
]
},
{
"id":"V2_L05_01",
"who":"Livia",
"fase":"IV",
"text":"Lì. Nella foto non c’è nessuno. Non sto indicando Irene: guarda accanto.",
"opts":[
{
"t":"Vedo il vuoto. Lo confronto con il racconto.",
"to":"V2_L05_02"
},
{
"t":"Prima voglio distinguere i due punti.",
"to":"V2_L05_03"
}
]
},
{
"id":"V2_L05_02",
"who":"Livia",
"fase":"IV",
"text":"Esatto. La donna alla porta c’è. Quella che lui pensava di avere accanto no.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"LIV_irene_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_L05_03"
}
]
},
{
"id":"V2_L05_03",
"who":"Livia",
"fase":"IV",
"text":"Prenditi il tempo. Non è una gara a riconoscere una faccia.",
"alt":[
{
"req":"flag:l05c",
"text":"La foto non cambia perché la chiudi. Manca quel confronto."
}
]
},
{
"id":"V2_L06_01",
"who":"Livia",
"fase":"V",
"text":"È poco piacevole. È anche l’unica cosa che posso chiederti senza usarti.",
"opts":[
{
"t":"Non nascondo un dettaglio perché ti farebbe male.",
"to":"V2_L06_02"
},
{
"t":"Non trasformo un dubbio in un no definitivo.",
"to":"V2_L06_03"
}
]
},
{
"id":"V2_L06_02",
"who":"Livia",
"fase":"V",
"text":"Grazie. Non promettermi che starò meglio dopo averlo letto.",
"opts":[
{
"t":"Proseguiamo da qui.",
"to":"LIV_promessa_06"
},
{
"t":"Mi fermo su questo, per ora.",
"to":"V2_L06_03"
}
]
},
{
"id":"V2_L06_03",
"who":"Livia",
"fase":"V",
"text":"Va bene. Posso non saperlo ancora senza avere già perso ogni possibilità.",
"alt":[
{
"req":"flag:l06c",
"text":"Conservo gli originali. Nella ricerca, per ora, sei da solo."
}
]
},
{
"id":"V2_ELE_s25_01",
"who":"Elena",
"fase":"I",
"text":"Quando dici cinque minuti, io intanto mi siedo.",
"opts":[
{
"t":"Ti aggiorno senza inventare i minuti.",
"to":"V2_ELE_s25_02",
"fx":[
"flag:e25"
]
},
{
"t":"Oggi la porta può andare in ferie.",
"to":"V2_ELE_s25_03",
"fx":[
"flag:e25"
]
}
]
},
{
"id":"V2_ELE_s25_02",
"who":"Elena",
"fase":"I",
"text":"È un’abitudine. Le attese in piedi mi fanno sentire già fregata.",
"opts":[
{
"t":"Scrivo quello che so.",
"to":"V2_ELE_s25_04"
},
{
"t":"Ti lascio seduta tranquilla.",
"to":"V2_ELE_s25_05"
}
]
},
{
"id":"V2_ELE_s25_03",
"who":"Elena",
"fase":"I",
"text":"Non ti sto cronometrando. Sto cercando di non passare la sera sulla porta.",
"opts":[
{
"t":"Non voglio tenerti in attesa.",
"to":"V2_ELE_s25_04"
},
{
"t":"Niente conto alla rovescia, allora.",
"to":"V2_ELE_s25_06"
}
]
},
{
"id":"V2_ELE_s25_04",
"who":"Elena",
"fase":"I",
"text":"Puoi scrivere non lo so. Non è una risposta che ti toglie dei punti.",
"opts":[
{
"t":"Non lo so ancora. Ma ti tengo aggiornata.",
"to":"V2_ELE_s25_05"
},
{
"t":"Ti scrivo quando cambia davvero qualcosa.",
"to":"V2_ELE_s25_06"
}
]
},
{
"id":"V2_ELE_s25_05",
"who":"Elena",
"fase":"I",
"text":"Va bene. Io mi siedo e tu smetti di fare il bollettino."
},
{
"id":"V2_ELE_s25_06",
"who":"Elena",
"fase":"I",
"text":"Allora niente orario. La conversazione non scade."
},
{
"id":"V2_ELE_s50_01",
"who":"Elena",
"fase":"II",
"text":"Ti mando mai un messaggio e poi lo riscrivo tre volte nella testa?",
"opts":[
{
"t":"Sempre. Quello brillante arriva dopo la figuraccia.",
"to":"V2_ELE_s50_02",
"fx":[
"flag:e50"
]
},
{
"t":"Sì. Poi finisco per non scrivere.",
"to":"V2_ELE_s50_03",
"fx":[
"flag:e50"
]
}
]
},
{
"id":"V2_ELE_s50_02",
"who":"Elena",
"fase":"II",
"text":"Lo faccio anch’io. La seconda versione è brillante. Nessuno la leggerà mai.",
"opts":[
{
"t":"Allora ti mando quella imperfetta.",
"to":"V2_ELE_s50_04"
},
{
"t":"Quella brillante me la tengo per il notaio.",
"to":"V2_ELE_s50_05"
}
]
},
{
"id":"V2_ELE_s50_03",
"who":"Elena",
"fase":"II",
"text":"Quella arrivata conta più della risposta perfetta che non mandi.",
"opts":[
{
"t":"Ti dico se una frase non era giusta.",
"to":"V2_ELE_s50_04"
},
{
"t":"Non ti lascio indovinare il resto.",
"to":"V2_ELE_s50_06"
}
]
},
{
"id":"V2_ELE_s50_04",
"who":"Elena",
"fase":"II",
"text":"Se hai scritto male una cosa, puoi correggerla senza ricominciare da zero.",
"opts":[
{
"t":"Posso dire ho scritto male, senza sparire.",
"to":"V2_ELE_s50_05"
},
{
"t":"Ti scrivo poco, ma non ti taglio fuori.",
"to":"V2_ELE_s50_06"
}
]
},
{
"id":"V2_ELE_s50_05",
"who":"Elena",
"fase":"II",
"text":"Accetto le correzioni. Le tre versioni segrete tienile per Pasta."
},
{
"id":"V2_ELE_s50_06",
"who":"Elena",
"fase":"II",
"text":"Va bene. Un messaggio normale, anche storto."
},
{
"id":"V2_ELE_s75_01",
"who":"Elena",
"fase":"II",
"text":"Non voglio essere quella a cui scrivi soltanto va tutto bene.",
"opts":[
{
"t":"A volte è la frase con cui provo a chiudere tutto.",
"to":"V2_ELE_s75_02"
},
{
"t":"Pensavo di risparmiarti una preoccupazione.",
"to":"V2_ELE_s75_03"
}
]
},
{
"id":"V2_ELE_s75_02",
"who":"Elena",
"fase":"II",
"text":"Non mi serve il bollettino. Mi serve non essere tenuta fuori per farmi un favore.",
"opts":[
{
"t":"Ti scrivo come sto, senza sistemarlo prima.",
"to":"V2_ELE_s75_04"
},
{
"t":"Oggi non riesco a raccontare tutto.",
"to":"V2_ELE_s75_05"
}
]
},
{
"id":"V2_ELE_s75_03",
"who":"Elena",
"fase":"II",
"text":"Puoi non sapere cosa dire. Non devi lucidarlo per mandarmelo.",
"opts":[
{
"t":"Posso iniziare da sono stanco.",
"to":"V2_ELE_s75_04"
},
{
"t":"Non ti tengo fuori chiamandola protezione.",
"to":"V2_ELE_s75_06"
}
]
},
{
"id":"V2_ELE_s75_04",
"who":"Elena",
"fase":"II",
"text":"Se oggi puoi darmi solo una frase, dammi quella vera.",
"opts":[
{
"t":"Una frase vera, allora.",
"to":"V2_ELE_s75_05"
},
{
"t":"Mi fermo prima di risponderti di fretta.",
"to":"V2_ELE_s75_06"
}
]
},
{
"id":"V2_ELE_s75_05",
"who":"Elena",
"fase":"II",
"text":"La leggo. Anche senza una battuta sotto."
},
{
"id":"V2_ELE_s75_06",
"who":"Elena",
"fase":"II",
"text":"Va bene. Non ti metto fretta per farmi sentire utile."
},
{
"id":"V2_ELE_s100_01",
"who":"Elena",
"fase":"II",
"text":"Non devi tornare con una bella storia. Mi basta che torni tu.",
"opts":[
{
"t":"Me la ricorderò quando mi verrà da fingere.",
"to":"V2_ELE_s100_02"
},
{
"t":"Adesso mi bastava proprio questo.",
"to":"V2_ELE_s100_03"
}
]
},
{
"id":"V2_ELE_s100_02",
"who":"Elena",
"fase":"II",
"text":"Non è una frase per farti correre. È per quando hai voglia di sembrare a posto.",
"opts":[
{
"t":"Non te lo prometto per farmi perdonare.",
"to":"V2_ELE_s100_04"
},
{
"t":"Ti scrivo quando posso esserci davvero.",
"to":"V2_ELE_s100_05"
}
]
},
{
"id":"V2_ELE_s100_03",
"who":"Elena",
"fase":"II",
"text":"Se oggi ti manca il coraggio di raccontare, puoi scrivere sono qui.",
"opts":[
{
"t":"Sono qui. Non ho una frase migliore.",
"to":"V2_ELE_s100_04"
},
{
"t":"La prossima volta comincio da quello.",
"to":"V2_ELE_s100_06"
}
]
},
{
"id":"V2_ELE_s100_04",
"who":"Elena",
"fase":"II",
"text":"Nonno lo tengo per quando ricominci a brontolare. Questo lo dico senza.",
"opts":[
{
"t":"Tieni pure la battuta per dopo.",
"to":"V2_ELE_s100_05"
},
{
"t":"Non serve il soprannome adesso. Ho capito.",
"to":"V2_ELE_s100_06"
}
]
},
{
"id":"V2_ELE_s100_05",
"who":"Elena",
"fase":"II",
"text":"Sono qui. Ti tengo la conversazione aperta, non la cena in ostaggio."
},
{
"id":"V2_ELE_s100_06",
"who":"Elena",
"fase":"II",
"text":"Va bene. Nessuna versione migliore di te richiesta all’ingresso."
},
{
"id":"V2_ROS_s25_01",
"who":"Rosa",
"fase":"II",
"text":"Prima di aprire il cofano guardo dove appoggio gli attrezzi.",
"opts":[
{
"t":"Mi dai un compito preciso e non improvviso.",
"to":"V2_ROS_s25_02",
"fx":[
"flag:r25"
]
},
{
"t":"Un litigio risparmiato è già uno sconto.",
"to":"V2_ROS_s25_03",
"fx":[
"flag:r25"
]
}
]
},
{
"id":"V2_ROS_s25_02",
"who":"Rosa",
"fase":"II",
"text":"Non è un rito, testone. È per non cercarli dopo bestemmiando.",
"opts":[
{
"t":"Lo rimetto dove l’hai preso.",
"to":"V2_ROS_s25_04"
},
{
"t":"Per ora guardo e basta.",
"to":"V2_ROS_s25_05"
}
]
},
{
"id":"V2_ROS_s25_03",
"who":"Rosa",
"fase":"II",
"text":"Se me ne passi uno, poi rimettilo lì. Ci risparmiamo un litigio intero.",
"opts":[
{
"t":"Chiedo prima di toccare.",
"to":"V2_ROS_s25_04"
},
{
"t":"La sorpresa provo a fartela senza danni.",
"to":"V2_ROS_s25_06"
}
]
},
{
"id":"V2_ROS_s25_04",
"who":"Rosa",
"fase":"II",
"text":"Non devi aiutarmi su tutto. Una cosa fatta bene è già una sorpresa.",
"opts":[
{
"t":"Una cosa. Finita quella te lo dico.",
"to":"V2_ROS_s25_05"
},
{
"t":"Tocco solo quello concordato.",
"to":"V2_ROS_s25_06"
}
]
},
{
"id":"V2_ROS_s25_05",
"who":"Rosa",
"fase":"II",
"text":"Ecco. Adesso posso imprecare per problemi nuovi."
},
{
"id":"V2_ROS_s25_06",
"who":"Rosa",
"fase":"II",
"text":"Va bene. Se guardi, guarda dove tornano le cose."
},
{
"id":"V2_ROS_s50_01",
"who":"Rosa",
"fase":"II",
"text":"Quando finalmente mi siedo, conto ancora gli attrezzi con gli occhi.",
"opts":[
{
"t":"Ti lascio finire la sosta.",
"to":"V2_ROS_s50_02",
"fx":[
"flag:r50"
]
},
{
"t":"Anche le sedie hanno bisogno di manutenzione?",
"to":"V2_ROS_s50_03",
"fx":[
"flag:r50"
]
}
]
},
{
"id":"V2_ROS_s50_02",
"who":"Rosa",
"fase":"II",
"text":"Il culo è sulla sedia. La testa sta ancora cercando una chiave.",
"opts":[
{
"t":"Gli attrezzi per due minuti non scappano.",
"to":"V2_ROS_s50_04"
},
{
"t":"Non ti aggiungo una lista.",
"to":"V2_ROS_s50_05"
}
]
},
{
"id":"V2_ROS_s50_03",
"who":"Rosa",
"fase":"II",
"text":"Se mi chiedi subito di un altro rumore, mi rimetti in piedi senza toccarmi.",
"opts":[
{
"t":"Parliamo di mangiare. Non dell’auto.",
"to":"V2_ROS_s50_04"
},
{
"t":"Una cosa è urgente, il resto aspetta.",
"to":"V2_ROS_s50_06"
}
]
},
{
"id":"V2_ROS_s50_04",
"who":"Rosa",
"fase":"II",
"text":"Per due minuti possiamo parlare di qualcosa che non perde liquidi?",
"opts":[
{
"t":"Due minuti senza problemi da risolvere.",
"to":"V2_ROS_s50_05"
},
{
"t":"Se è ansia, non la chiamo guasto.",
"to":"V2_ROS_s50_06"
}
]
},
{
"id":"V2_ROS_s50_05",
"who":"Rosa",
"fase":"II",
"text":"Grazie. Non pensavo di affezionarmi a un motore spento."
},
{
"id":"V2_ROS_s50_06",
"who":"Rosa",
"fase":"II",
"text":"Va bene. Se è urgente lo dici; se è ansia, respiri e aspetti."
},
{
"id":"V2_ROS_s75_01",
"who":"Rosa",
"fase":"III",
"text":"Quando mi spavento ti do un ordine prima di chiedere cosa vedi.",
"opts":[
{
"t":"Ti dico cosa vedo prima di seguirti.",
"to":"V2_ROS_s75_02",
"fx":[
"flag:r75"
]
},
{
"t":"Posso fermarti senza metterti in discussione tutta.",
"to":"V2_ROS_s75_03",
"fx":[
"flag:r75"
]
}
]
},
{
"id":"V2_ROS_s75_02",
"who":"Rosa",
"fase":"III",
"text":"È una pessima abitudine. Non diventa una buona idea perché urlo forte.",
"opts":[
{
"t":"Guarda prima. Lo tengo corto.",
"to":"V2_ROS_s75_04"
},
{
"t":"Non provo a vincere il volume.",
"to":"V2_ROS_s75_05"
}
]
},
{
"id":"V2_ROS_s75_03",
"who":"Rosa",
"fase":"III",
"text":"Se lo rifaccio, fermami con una frase corta. Non con un discorso mentre guidi.",
"opts":[
{
"t":"Te lo dico prima che diventi una corsa.",
"to":"V2_ROS_s75_04"
},
{
"t":"Ti chiedo se sai o ricordi.",
"to":"V2_ROS_s75_06"
}
]
},
{
"id":"V2_ROS_s75_04",
"who":"Rosa",
"fase":"III",
"text":"Dimmi guarda prima. Me lo merito anch’io, qualche volta.",
"opts":[
{
"t":"Guarda prima. Vale per tutti e due.",
"to":"V2_ROS_s75_05"
},
{
"t":"Non ti do ragione solo per calmarti.",
"to":"V2_ROS_s75_06"
}
]
},
{
"id":"V2_ROS_s75_05",
"who":"Rosa",
"fase":"III",
"text":"Va bene. Non divento infallibile perché mi vuoi bene, coglione."
},
{
"id":"V2_ROS_s75_06",
"who":"Rosa",
"fase":"III",
"text":"Allora nessuno dei due recita quello che sa già la strada."
},
{
"id":"V2_ROS_s100_01",
"who":"Rosa",
"fase":"III",
"text":"Non ti voglio eroico. Ti voglio di ritorno.",
"opts":[
{
"t":"La tengo. Non voglio deluderti facendo il coraggioso.",
"to":"V2_ROS_s100_02",
"fx":[
"flag:r100"
]
},
{
"t":"Torno senza recitare il coraggioso.",
"to":"V2_ROS_s100_03",
"fx":[
"flag:r100"
]
}
]
},
{
"id":"V2_ROS_s100_02",
"who":"Rosa",
"fase":"III",
"text":"Lo scrivo adesso, così non posso fingere di non averlo detto.",
"opts":[
{
"t":"Ti aiuto senza darti la mia vita in anticipo.",
"to":"V2_ROS_s100_04"
},
{
"t":"Se devo fermarmi, te lo dico.",
"to":"V2_ROS_s100_05"
}
]
},
{
"id":"V2_ROS_s100_03",
"who":"Rosa",
"fase":"III",
"text":"Se mi aiuti, non devi dimostrare ogni volta che sei disposto a perderti.",
"opts":[
{
"t":"Non sposto il limite per vergogna.",
"to":"V2_ROS_s100_04"
},
{
"t":"Non ti uso come un giudice.",
"to":"V2_ROS_s100_06"
}
]
},
{
"id":"V2_ROS_s100_04",
"who":"Rosa",
"fase":"III",
"text":"Una promessa con un limite resta una promessa. Anche la tua.",
"opts":[
{
"t":"Non confondo il limite con un tradimento.",
"to":"V2_ROS_s100_05"
},
{
"t":"Lo terrò quando saremo davanti alla porta.",
"to":"V2_ROS_s100_06"
}
]
},
{
"id":"V2_ROS_s100_05",
"who":"Rosa",
"fase":"III",
"text":"Bene. Adesso chiudi un attimo questa chat, zuccone. Non scappo."
},
{
"id":"V2_ROS_s100_06",
"who":"Rosa",
"fase":"III",
"text":"Va bene. Quando torni possiamo anche non parlare della strada."
},
{
"id":"V2_LIV_s25_01",
"who":"Livia",
"fase":"III",
"text":"Ogni tanto sistemo una pila che non aveva nessun bisogno di essere sistemata.",
"opts":[
{
"t":"Mi sembra una pausa travestita bene.",
"to":"V2_LIV_s25_02",
"fx":[
"flag:l25"
]
},
{
"t":"Lo faccio anch’io quando non so da dove cominciare.",
"to":"V2_LIV_s25_03",
"fx":[
"flag:l25"
]
}
]
},
{
"id":"V2_LIV_s25_02",
"who":"Livia",
"fase":"III",
"text":"Mi dà l’impressione di aver finito qualcosa. Il lavoro è ancora tutto lì.",
"opts":[
{
"t":"Lasciamola storta per cinque minuti.",
"to":"V2_LIV_s25_04"
},
{
"t":"Dimmi da dove vuoi cominciare davvero.",
"to":"V2_LIV_s25_05"
}
]
},
{
"id":"V2_LIV_s25_03",
"who":"Livia",
"fase":"III",
"text":"Puoi ridere. È una pila di fogli, non mio fratello.",
"opts":[
{
"t":"Non rido della ricerca. Rido del mobile in emergenza.",
"to":"V2_LIV_s25_04"
},
{
"t":"Puoi avere anche un’abitudine normale.",
"to":"V2_LIV_s25_06"
}
]
},
{
"id":"V2_LIV_s25_04",
"who":"Livia",
"fase":"III",
"text":"Con le cose importanti provo a non fare lo stesso trucco.",
"opts":[
{
"t":"Una cosa alla volta, senza lucidare il resto.",
"to":"V2_LIV_s25_05"
},
{
"t":"Puoi dirmi che oggi non sai da dove partire.",
"to":"V2_LIV_s25_06"
}
]
},
{
"id":"V2_LIV_s25_05",
"who":"Livia",
"fase":"III",
"text":"Bene. La pila resta storta e possiamo parlare."
},
{
"id":"V2_LIV_s25_06",
"who":"Livia",
"fase":"III",
"text":"Va bene. Non ti mando una fotografia del riordino come risultato."
},
{
"id":"V2_LIV_s50_01",
"who":"Livia",
"fase":"III",
"text":"Mi accorgo di avere fame quando sto già rispondendo male.",
"opts":[
{
"t":"Allora fermati prima di diventare un timbro.",
"to":"V2_LIV_s50_02",
"fx":[
"flag:l50"
]
},
{
"t":"Mangia. Questo può aspettare un momento.",
"to":"V2_LIV_s50_03",
"fx":[
"flag:l50"
]
}
]
},
{
"id":"V2_LIV_s50_02",
"who":"Livia",
"fase":"III",
"text":"Poi provo a sembrare metodica. Sono solo una persona che doveva mangiare prima.",
"opts":[
{
"t":"Non ti devo una risposta urgente adesso.",
"to":"V2_LIV_s50_04"
},
{
"t":"Metodica e affamata è un’accoppiata pericolosa.",
"to":"V2_LIV_s50_05"
}
]
},
{
"id":"V2_LIV_s50_03",
"who":"Livia",
"fase":"III",
"text":"Non tutte le mie frasi secche sono un indizio. Alcune sono una cena mancata.",
"opts":[
{
"t":"Te lo chiedo senza prenderti in giro.",
"to":"V2_LIV_s50_04"
},
{
"t":"Mi aiuta sapere quando ti serve una pausa.",
"to":"V2_LIV_s50_06"
}
]
},
{
"id":"V2_LIV_s50_04",
"who":"Livia",
"fase":"III",
"text":"Se ricomincio a fare la scrivania parlante, puoi chiedermi se ho mangiato.",
"opts":[
{
"t":"Hai mangiato? Questa è tutta la domanda.",
"to":"V2_LIV_s50_05"
},
{
"t":"Chiudiamo per un momento.",
"to":"V2_LIV_s50_06"
}
]
},
{
"id":"V2_LIV_s50_05",
"who":"Livia",
"fase":"III",
"text":"Grazie. Per una volta la soluzione può stare in un piatto."
},
{
"id":"V2_LIV_s50_06",
"who":"Livia",
"fase":"III",
"text":"Va bene. Ricomincio quando so essere almeno una persona civile."
},
{
"id":"V2_LIV_s75_01",
"who":"Livia",
"fase":"III",
"text":"Quando scrivo Ottavio mi viene da aggiungere ancora una domanda.",
"opts":[
{
"t":"Non devo rispondere prima che tu abbia finito.",
"to":"V2_LIV_s75_02",
"fx":[
"flag:l75"
]
},
{
"t":"Non voglio farti vergognare di sperare.",
"to":"V2_LIV_s75_03",
"fx":[
"flag:l75"
]
}
]
},
{
"id":"V2_LIV_s75_02",
"who":"Livia",
"fase":"III",
"text":"Non perché mi manchino le parole. Per non finire la riga.",
"opts":[
{
"t":"Lasciamo una domanda, senza inventare la risposta.",
"to":"V2_LIV_s75_04"
},
{
"t":"Ti ascolto anche se non possiamo concludere.",
"to":"V2_LIV_s75_05"
}
]
},
{
"id":"V2_LIV_s75_03",
"who":"Livia",
"fase":"III",
"text":"Posso dirlo e restare capace di capire quando non so una cosa.",
"opts":[
{
"t":"Posso contraddirti senza lasciarti sola.",
"to":"V2_LIV_s75_04"
},
{
"t":"Non chiamo certezza quello che vorrei per te.",
"to":"V2_LIV_s75_06"
}
]
},
{
"id":"V2_LIV_s75_04",
"who":"Livia",
"fase":"III",
"text":"La speranza non ha bisogno che tu mi dia ragione su tutto.",
"opts":[
{
"t":"Allora ti dico anche quando non coincide.",
"to":"V2_LIV_s75_05"
},
{
"t":"Non ti do ragione per far finire il discorso.",
"to":"V2_LIV_s75_06"
}
]
},
{
"id":"V2_LIV_s75_05",
"who":"Livia",
"fase":"III",
"text":"Grazie. Così posso sperare senza chiederti di mentire con me."
},
{
"id":"V2_LIV_s75_06",
"who":"Livia",
"fase":"III",
"text":"Va bene. Non ti uso per completare quella riga."
},
{
"id":"V2_LIV_s100_01",
"who":"Livia",
"fase":"III",
"text":"Se non trovi Ottavio, non portarmi qualcosa che riesca soltanto a chiamarmi sorella.",
"opts":[
{
"t":"Non ti porto una voce al posto di tuo fratello.",
"to":"V2_LIV_s100_02",
"fx":[
"flag:l100"
]
},
{
"t":"Ti dirò quello che c’è, anche se non mi farà onore.",
"to":"V2_LIV_s100_03",
"fx":[
"flag:l100"
]
}
]
},
{
"id":"V2_LIV_s100_02",
"who":"Livia",
"fase":"III",
"text":"Non è una richiesta bella. È quella che faccio quando smetto di abbellire tutto.",
"opts":[
{
"t":"Non scambio quello che vuoi con quello che so.",
"to":"V2_LIV_s100_04"
},
{
"t":"Non mi chiedi di decidere oggi se sia vivo.",
"to":"V2_LIV_s100_05"
}
]
},
{
"id":"V2_LIV_s100_03",
"who":"Livia",
"fase":"III",
"text":"Posso aspettare una verità. Non voglio abitare una risposta finta.",
"opts":[
{
"t":"Se non so, te lo dico.",
"to":"V2_LIV_s100_04"
},
{
"t":"Niente sostituti per chi manca.",
"to":"V2_LIV_s100_06"
}
]
},
{
"id":"V2_LIV_s100_04",
"who":"Livia",
"fase":"III",
"text":"Se arrivi senza una buona notizia, non devi restare sulla porta.",
"opts":[
{
"t":"Entro senza preparare una bugia gentile.",
"to":"V2_LIV_s100_05"
},
{
"t":"Non ti lascio indovinare sulla porta.",
"to":"V2_LIV_s100_06"
}
]
},
{
"id":"V2_LIV_s100_05",
"who":"Livia",
"fase":"III",
"text":"Grazie. Una risposta vera non ti rende una persona meno cara."
},
{
"id":"V2_LIV_s100_06",
"who":"Livia",
"fase":"III",
"text":"Va bene. Non ti chiederò di consolarmi prima di parlare."
},
{
"id":"V2_PRE_s25_01",
"who":"Sconosciuto",
"fase":"II",
"text":"Hai risposto anche quando non ti avevo fatto una domanda.",
"opts":[
{
"t":"Non era un invito.",
"to":"V2_PRE_s25_02"
},
{
"t":"Sei ancora lì?",
"to":"V2_PRE_s25_03"
}
]
},
{
"id":"V2_PRE_s25_02",
"who":"Sconosciuto",
"fase":"II",
"text":"C’è spazio, allora.",
"opts":[
{
"t":"Lo spazio non è una promessa.",
"to":"V2_PRE_s25_04"
},
{
"t":"Non sai niente di me oltre a questa chat.",
"to":"V2_PRE_s25_05"
}
]
},
{
"id":"V2_PRE_s25_03",
"who":"Sconosciuto",
"fase":"II",
"text":"Non ho detto per chi. Sei stato tu a continuare.",
"opts":[
{
"t":"Continuare non significa accompagnarti.",
"to":"V2_PRE_s25_04"
},
{
"t":"Aspetto un fatto, non un’altra allusione.",
"to":"V2_PRE_s25_06"
}
]
},
{
"id":"V2_PRE_s25_04",
"who":"Sconosciuto",
"fase":"II",
"text":"Puoi lasciare il telefono dov’è. La frase resta.",
"opts":[
{
"t":"Chiudo qui per ora.",
"to":"V2_PRE_s25_05"
},
{
"t":"Conservo le parole senza seguirle.",
"to":"V2_PRE_s25_06"
}
]
},
{
"id":"V2_PRE_s25_05",
"who":"Sconosciuto",
"fase":"II",
"text":"Rileggerla non ti obbliga a niente."
},
{
"id":"V2_PRE_s25_06",
"who":"Sconosciuto",
"fase":"II",
"text":"Va bene. Non la riempio io, questa pausa."
},
{
"id":"V2_PRE_s50_01",
"who":"Sconosciuto",
"fase":"III",
"text":"Adesso aspetti una risposta prima di muoverti.",
"opts":[
{
"t":"Una risposta non decide per me.",
"to":"V2_PRE_s50_02"
},
{
"t":"Mi accorgo che ti sto aspettando.",
"to":"V2_PRE_s50_03"
}
]
},
{
"id":"V2_PRE_s50_02",
"who":"Sconosciuto",
"fase":"III",
"text":"Posso diventare quello spazio tra una domanda e la tua scelta.",
"opts":[
{
"t":"Quando non scrivi, mi manca qualcosa.",
"to":"V2_PRE_s50_04"
},
{
"t":"Non ti lascio decidere il passo.",
"to":"V2_PRE_s50_05"
}
]
},
{
"id":"V2_PRE_s50_03",
"who":"Sconosciuto",
"fase":"III",
"text":"Ti pesa meno se il nome in alto è familiare?",
"opts":[
{
"t":"Il nome non basta.",
"to":"V2_PRE_s50_04"
},
{
"t":"Non ti affido il posto di qualcuno.",
"to":"V2_PRE_s50_06"
}
]
},
{
"id":"V2_PRE_s50_04",
"who":"Sconosciuto",
"fase":"III",
"text":"Hai già fatto posto a qualcuno qui dentro.",
"opts":[
{
"t":"Una chat non è una porta aperta.",
"to":"V2_PRE_s50_05"
},
{
"t":"Posso smettere di rispondere.",
"to":"V2_PRE_s50_06"
}
]
},
{
"id":"V2_PRE_s50_05",
"who":"Sconosciuto",
"fase":"III",
"text":"Continua a chiamarla soltanto una conversazione."
},
{
"id":"V2_PRE_s50_06",
"who":"Sconosciuto",
"fase":"III",
"text":"La distanza che metti adesso arriva dopo tutte queste righe."
},
{
"id":"V2_PRE_s75_01",
"who":"Sconosciuto",
"fase":"IV",
"text":"Mi scrivi anche quando non vuoi ascoltare la risposta.",
"opts":[
{
"t":"Resta. Ho paura di scegliere da solo.",
"to":"V2_PRE_s75_02"
},
{
"t":"Il posto di chi manca non è tuo.",
"to":"V2_PRE_s75_03"
}
]
},
{
"id":"V2_PRE_s75_02",
"who":"Sconosciuto",
"fase":"IV",
"text":"Resta. Lo hai scritto tu. Io posso continuare a rileggerlo.",
"opts":[
{
"t":"L’abitudine posso interromperla.",
"to":"V2_PRE_s75_04"
},
{
"t":"Non ti prometto di tornare da te.",
"to":"V2_PRE_s75_05"
}
]
},
{
"id":"V2_PRE_s75_03",
"who":"Sconosciuto",
"fase":"IV",
"text":"Prima di scegliere chi portare, senti già chi manca.",
"opts":[
{
"t":"Non uso una mancanza per riconoscerti.",
"to":"V2_PRE_s75_04"
},
{
"t":"Ti tengo distinto da chi sto cercando.",
"to":"V2_PRE_s75_06"
}
]
},
{
"id":"V2_PRE_s75_04",
"who":"Sconosciuto",
"fase":"IV",
"text":"È lì che mi stai facendo posto.",
"opts":[
{
"t":"Qui non ti accompagno fuori.",
"to":"V2_PRE_s75_05"
},
{
"t":"Smetto di usare questa chat come una risposta.",
"to":"V2_PRE_s75_06"
}
]
},
{
"id":"V2_PRE_s75_05",
"who":"Sconosciuto",
"fase":"IV",
"text":"Non ti chiedo una frase più calda. So aspettare quella che cerchi."
},
{
"id":"V2_PRE_s75_06",
"who":"Sconosciuto",
"fase":"IV",
"text":"Mandami a fanculo. Poi guarda a chi stavi per chiedere di restare."
},
{
"id":"V2_LUOGO_tokyo_01",
"who":"Elena",
"fase":"I",
"text":"Hai già voglia di mandarmi una foto di casa invece che dell’auto?",
"opts":[
{
"t":"Oggi mi sembra bella perfino la strada di casa.",
"to":"V2_LUOGO_tokyo_02"
},
{
"t":"Aspetta. Sto fotografando una cosa che vedo sempre.",
"to":"V2_LUOGO_tokyo_03"
}
]
},
{
"id":"V2_LUOGO_tokyo_02",
"who":"Elena",
"fase":"I",
"text":"Va bene. Una cosa che riconosci senza doverla spiegare.",
"opts":[
{
"t":"Un’insegna. Nessuna recensione del motore.",
"to":"V2_LUOGO_tokyo_04"
},
{
"t":"Te la mando prima di chiamarla cartolina.",
"to":"V2_LUOGO_tokyo_05"
}
]
},
{
"id":"V2_LUOGO_tokyo_03",
"who":"Elena",
"fase":"I",
"text":"Allora scrivimi che cosa vedi adesso, non quello che ricordi.",
"opts":[
{
"t":"L’asfalto è bagnato. Per ora è soltanto quello.",
"to":"V2_LUOGO_tokyo_04"
},
{
"t":"La foto non rende. Oggi niente premio fotografico.",
"to":"V2_LUOGO_tokyo_05"
}
]
},
{
"id":"V2_LUOGO_tokyo_04",
"who":"Elena",
"fase":"I",
"text":"Non ti sto facendo un esame. Voglio stare un momento nel tuo viaggio.",
"opts":[
{
"t":"Allora vieni un minuto. Ti tengo il posto in chat.",
"to":"V2_LUOGO_tokyo_05"
},
{
"t":"Guida Pasta. Io ho già abbastanza problemi.",
"to":"V2_LUOGO_tokyo_05"
}
]
},
{
"id":"V2_LUOGO_tokyo_05",
"who":"Elena",
"fase":"I",
"text":"Vai. Pasta qui non ha ancora dovuto imparare a guidare."
},
{
"id":"V2_LUOGO_roma_01",
"who":"Elena",
"fase":"I",
"text":"Hai finito con lo studio o stai ancora pensando alle altre cinque?",
"opts":[
{
"t":"Ho scelto. Adesso le altre cinque sembrano migliori.",
"to":"V2_LUOGO_roma_02"
},
{
"t":"Sono fuori dallo studio. Sto ancora guardando le chiavi.",
"to":"V2_LUOGO_roma_03"
}
]
},
{
"id":"V2_LUOGO_roma_02",
"who":"Elena",
"fase":"I",
"text":"Una macchina sola. Non devi fare anche il giro del rimpianto.",
"opts":[
{
"t":"Una sola assicurazione: il mio vero criterio.",
"to":"V2_LUOGO_roma_04"
},
{
"t":"Per oggi basta scegliere. Ti mando com’è fuori.",
"to":"V2_LUOGO_roma_05"
}
]
},
{
"id":"V2_LUOGO_roma_03",
"who":"Elena",
"fase":"I",
"text":"Mi interessa quella che hai scelto, non una classifica di quelle rimaste.",
"opts":[
{
"t":"Quella che ho preso mi piace. Ecco, l’ho scritto.",
"to":"V2_LUOGO_roma_04"
},
{
"t":"Non ti mando la classifica. Mi licenzio da solo.",
"to":"V2_LUOGO_roma_05"
}
]
},
{
"id":"V2_LUOGO_roma_04",
"who":"Elena",
"fase":"I",
"text":"Fotografa anche una cosa normale. Non voglio soltanto un catalogo di spie.",
"opts":[
{
"t":"La serranda qui davanti. È una foto onestissima.",
"to":"V2_LUOGO_roma_05"
},
{
"t":"Niente cruscotto. Per una volta guardo fuori.",
"to":"V2_LUOGO_roma_05"
}
]
},
{
"id":"V2_LUOGO_roma_05",
"who":"Elena",
"fase":"I",
"text":"Va bene. Roma almeno stavolta non la devi ereditare."
},
{
"id":"V2_LUOGO_parigi_01",
"who":"Elena",
"fase":"II",
"text":"Parigi? Hai preso una foto da internet per prendermi in giro?",
"opts":[
{
"t":"Vorrei fosse uno scherzo. Ti mando la foto intera.",
"to":"V2_LUOGO_parigi_02"
},
{
"t":"Ho controllato due volte. Continua a esserci scritto.",
"to":"V2_LUOGO_parigi_03"
}
]
},
{
"id":"V2_LUOGO_parigi_02",
"who":"Elena",
"fase":"II",
"text":"Va bene. Mandami il particolare che hai davanti e resto a guardarlo.",
"opts":[
{
"t":"Niente ritaglio. Voglio che si veda tutto.",
"to":"V2_LUOGO_parigi_04"
},
{
"t":"Non riesco a far stare il posto dentro il tragitto.",
"to":"V2_LUOGO_parigi_05"
}
]
},
{
"id":"V2_LUOGO_parigi_03",
"who":"Elena",
"fase":"II",
"text":"Il luogo corrisponde. Il tempo del tragitto no.",
"opts":[
{
"t":"Non allungo le ore per far quadrare la foto.",
"to":"V2_LUOGO_parigi_04"
},
{
"t":"Ho smesso di guardare la macchina. Guardo l’orologio.",
"to":"V2_LUOGO_parigi_05"
}
]
},
{
"id":"V2_LUOGO_parigi_04",
"who":"Elena",
"fase":"II",
"text":"Non inventiamo una durata diversa per farlo tornare.",
"opts":[
{
"t":"Mi fermo. La destinazione non scappa. Spero.",
"to":"V2_LUOGO_parigi_05"
},
{
"t":"Ti mando anche l’ora, senza aggiustarla.",
"to":"V2_LUOGO_parigi_05"
}
]
},
{
"id":"V2_LUOGO_parigi_05",
"who":"Elena",
"fase":"II",
"text":"Resta fermo mentre ragioniamo. Una cosa impossibile basta."
},
{
"id":"V2_LUOGO_londra_01",
"who":"Rosa",
"fase":"III",
"text":"Mandami la chiusura intera. Non soltanto il punto che vuoi attraversare.",
"opts":[
{
"t":"Faccio una foto da qui. Non supero la barriera.",
"to":"V2_LUOGO_londra_02"
},
{
"t":"Lascio dentro anche la scritta a mano.",
"to":"V2_LUOGO_londra_03"
}
]
},
{
"id":"V2_LUOGO_londra_02",
"who":"Rosa",
"fase":"III",
"text":"Una barriera non mi dice chi l’ha messa. La scritta forse sì.",
"opts":[
{
"t":"La metto accanto alle carte di Claudio.",
"to":"V2_LUOGO_londra_04"
},
{
"t":"Non la strappo per vedere cosa c’è dietro.",
"to":"V2_LUOGO_londra_05"
}
]
},
{
"id":"V2_LUOGO_londra_03",
"who":"Rosa",
"fase":"III",
"text":"Guarda se riconosci il tratto. Io non sono lì al posto tuo.",
"opts":[
{
"t":"Guardo il tratto. La rabbia la tengo per dopo.",
"to":"V2_LUOGO_londra_04"
},
{
"t":"Per ora non so chi l’ha scritta.",
"to":"V2_LUOGO_londra_05"
}
]
},
{
"id":"V2_LUOGO_londra_04",
"who":"Rosa",
"fase":"III",
"text":"Se è di Claudio cambia il motivo per cui è chiusa, non il fatto che lo sia.",
"opts":[
{
"t":"Il paraurti non è una chiave universale. Ricevuto.",
"to":"V2_LUOGO_londra_05"
},
{
"t":"La lascio chiusa. Cerco un’altra cosa da capire.",
"to":"V2_LUOGO_londra_05"
}
]
},
{
"id":"V2_LUOGO_londra_05",
"who":"Rosa",
"fase":"III",
"text":"Bene. Niente prove col paraurti. Ci tengo a non dovertelo raddrizzare."
},
{
"id":"V2_LUOGO_stoccolma_01",
"who":"Livia",
"fase":"III",
"text":"Se sei all’autogrill, non cercare subito mio fratello in ogni persona.",
"opts":[
{
"t":"Mi sono sorpreso a guardare le facce.",
"to":"V2_LUOGO_stoccolma_02"
},
{
"t":"Ho il tesserino. Ti mando quello.",
"to":"V2_LUOGO_stoccolma_03"
}
]
},
{
"id":"V2_LUOGO_stoccolma_02",
"who":"Livia",
"fase":"III",
"text":"Lo so che è difficile. Lo sto facendo anch’io, da qui.",
"opts":[
{
"t":"Posso stare zitto un momento, se vuoi.",
"to":"V2_LUOGO_stoccolma_04"
},
{
"t":"Non ti mando il primo che gli somiglia.",
"to":"V2_LUOGO_stoccolma_05"
}
]
},
{
"id":"V2_LUOGO_stoccolma_03",
"who":"Livia",
"fase":"III",
"text":"Il tesserino ha il suo nome. Questo lo posso confrontare.",
"opts":[
{
"t":"Il nome si legge. Aspetto quello che trovi tu.",
"to":"V2_LUOGO_stoccolma_04"
},
{
"t":"Lo fotografo intero, anche sul retro.",
"to":"V2_LUOGO_stoccolma_05"
}
]
},
{
"id":"V2_LUOGO_stoccolma_04",
"who":"Livia",
"fase":"III",
"text":"Una macchina ritrovata non significa che abbiamo ritrovato chi la guidava.",
"opts":[
{
"t":"La macchina c’è. Di lui non so ancora abbastanza.",
"to":"V2_LUOGO_stoccolma_05"
},
{
"t":"Ti lascio il tempo di guardare, senza altre domande.",
"to":"V2_LUOGO_stoccolma_05"
}
]
},
{
"id":"V2_LUOGO_stoccolma_05",
"who":"Livia",
"fase":"III",
"text":"Mandami il particolare. Poi mi prendo un momento per guardarlo."
},
{
"id":"V2_LUOGO_berlino_01",
"who":"Rosa",
"fase":"III",
"text":"Guarda anche dove si è richiusa. Non fermarti al segno di apertura.",
"opts":[
{
"t":"Guardo il secondo segno. L’avevo quasi saltato.",
"to":"V2_LUOGO_berlino_02"
},
{
"t":"Ti mostro insieme apertura e richiusura.",
"to":"V2_LUOGO_berlino_03"
}
]
},
{
"id":"V2_LUOGO_berlino_02",
"who":"Rosa",
"fase":"III",
"text":"Due azioni. Se le mescoli sembra una porta che fa quello che vuole.",
"opts":[
{
"t":"Li tengo separati. Due gesti, due conseguenze.",
"to":"V2_LUOGO_berlino_04"
},
{
"t":"Mi ero fermato soltanto all’apertura.",
"to":"V2_LUOGO_berlino_05"
}
]
},
{
"id":"V2_LUOGO_berlino_03",
"who":"Rosa",
"fase":"III",
"text":"La coppia della Corsa ci lascia questo pezzo: richiudere è possibile.",
"opts":[
{
"t":"Quindi il passaggio può essere richiuso.",
"to":"V2_LUOGO_berlino_04"
},
{
"t":"Non lo provo soltanto perché adesso so che si può.",
"to":"V2_LUOGO_berlino_05"
}
]
},
{
"id":"V2_LUOGO_berlino_04",
"who":"Rosa",
"fase":"III",
"text":"Possibile non vuol dire gratis o senza prepararsi.",
"opts":[
{
"t":"Prima leggo il prezzo. Ho finito di improvvisare.",
"to":"V2_LUOGO_berlino_05"
},
{
"t":"Le maniglie del cazzo possono aspettare.",
"to":"V2_LUOGO_berlino_05"
}
]
},
{
"id":"V2_LUOGO_berlino_05",
"who":"Rosa",
"fase":"III",
"text":"Tienilo a mente prima della maniglia, non dopo, porca miseria."
},
{
"id":"V2_LUOGO_praga_01",
"who":"Rosa",
"fase":"III",
"text":"È ferma anche la macchia, oppure sta cambiando?",
"opts":[
{
"t":"Sto fermo e la guardo. Ti dico se cresce.",
"to":"V2_LUOGO_praga_02"
},
{
"t":"Non voglio indovinare dal parabrezza.",
"to":"V2_LUOGO_praga_03"
}
]
},
{
"id":"V2_LUOGO_praga_02",
"who":"Rosa",
"fase":"III",
"text":"Aspetta da fermo. Non mi rispondere con sembra se puoi guardare.",
"opts":[
{
"t":"Sta cambiando. Ti descrivo dove.",
"to":"V2_LUOGO_praga_04"
},
{
"t":"Vorrei fosse solo sporco. Non lo scrivo per questo.",
"to":"V2_LUOGO_praga_05"
}
]
},
{
"id":"V2_LUOGO_praga_03",
"who":"Rosa",
"fase":"III",
"text":"Se cresce davanti a te stai vedendo una ripetizione.",
"opts":[
{
"t":"Segno che cosa si ripete, prima di intervenire.",
"to":"V2_LUOGO_praga_04"
},
{
"t":"Aspetto di capire se c’è qualcuno da salvare.",
"to":"V2_LUOGO_praga_05"
}
]
},
{
"id":"V2_LUOGO_praga_04",
"who":"Rosa",
"fase":"III",
"text":"Non chiamarla una persona viva solo perché il sangue è fresco.",
"opts":[
{
"t":"Lo so. Mi fa schifo aver sperato fosse quello.",
"to":"V2_LUOGO_praga_05"
},
{
"t":"Niente slanci. Prima distinguo chi c’è davvero.",
"to":"V2_LUOGO_praga_05"
}
]
},
{
"id":"V2_LUOGO_praga_05",
"who":"Rosa",
"fase":"III",
"text":"Bene. Distinguiamo prima. Gli slanci di generosità dopo."
},
{
"id":"V2_LUOGO_vienna_01",
"who":"Elena",
"fase":"III",
"text":"Un altro nome sul cartello. Prima di ripartire mandami il particolare.",
"opts":[
{
"t":"Un altro cartello. Ho voglia di prenderlo a calci.",
"to":"V2_LUOGO_vienna_02"
},
{
"t":"Ti mando la svolta e la foto di prima.",
"to":"V2_LUOGO_vienna_03"
}
]
},
{
"id":"V2_LUOGO_vienna_02",
"who":"Elena",
"fase":"III",
"text":"Non posso conoscere la svolta da qui, ma posso confrontare due foto.",
"opts":[
{
"t":"Confrontale. Per un minuto non guardo più lo schermo.",
"to":"V2_LUOGO_vienna_04"
},
{
"t":"Stessa inquadratura. Non tolgo il bordo.",
"to":"V2_LUOGO_vienna_05"
}
]
},
{
"id":"V2_LUOGO_vienna_03",
"who":"Elena",
"fase":"III",
"text":"Questo dettaglio coincide. Non serve fingere che sia tutto uguale.",
"opts":[
{
"t":"Quel particolare torna. Il nome è diverso.",
"to":"V2_LUOGO_vienna_04"
},
{
"t":"Mi dà fastidio quanto poco basta per riconoscerlo.",
"to":"V2_LUOGO_vienna_05"
}
]
},
{
"id":"V2_LUOGO_vienna_04",
"who":"Elena",
"fase":"III",
"text":"Puoi essere arrabbiato. Non correggere quello che hai visto per calmarti.",
"opts":[
{
"t":"Sono furioso. La foto la lascio com’è.",
"to":"V2_LUOGO_vienna_05"
},
{
"t":"Spengo un minuto. Poi ti scrivo da fermo.",
"to":"V2_LUOGO_vienna_05"
}
]
},
{
"id":"V2_LUOGO_vienna_05",
"who":"Elena",
"fase":"III",
"text":"Mi scrivi quando sei fermo. Non devo indovinare mentre guidi."
},
{
"id":"V2_LUOGO_madrid_01",
"who":"Elena",
"fase":"IV",
"text":"Mi hai chiesto se sono venuta a cercarti. No. Non sono in macchina.",
"opts":[
{
"t":"Allora la persona che mi scrive non è con te.",
"to":"V2_LUOGO_madrid_02"
},
{
"t":"Va bene. Ti chiedo una cosa senza suggerirla.",
"to":"V2_LUOGO_madrid_03"
}
]
},
{
"id":"V2_LUOGO_madrid_02",
"who":"Elena",
"fase":"IV",
"text":"Dimmi che cosa vuoi controllare, senza mettermi la risposta in bocca.",
"opts":[
{
"t":"Una domanda sola. Poi controllo da un’altra parte.",
"to":"V2_LUOGO_madrid_04"
},
{
"t":"Prima ti lascio finire. Sto correndo anche da fermo.",
"to":"V2_LUOGO_madrid_05"
}
]
},
{
"id":"V2_LUOGO_madrid_03",
"who":"Elena",
"fase":"IV",
"text":"Nonno lo uso per prenderti in giro. Non per chiederti di venire a prendermi.",
"opts":[
{
"t":"Lo so. Mi ha fatto effetto leggerlo lì.",
"to":"V2_LUOGO_madrid_04"
},
{
"t":"Non uso quel nome come una risposta già pronta.",
"to":"V2_LUOGO_madrid_05"
}
]
},
{
"id":"V2_LUOGO_madrid_04",
"who":"Elena",
"fase":"IV",
"text":"Se vuoi chiedermi una cosa, chiedila una volta. Non aggiustarla mentre rispondo.",
"opts":[
{
"t":"Se sbaglio la domanda, non te la faccio correggere.",
"to":"V2_LUOGO_madrid_05"
},
{
"t":"Non voglio trasformare la chat in un interrogatorio.",
"to":"V2_LUOGO_madrid_05"
}
]
},
{
"id":"V2_LUOGO_madrid_05",
"who":"Elena",
"fase":"IV",
"text":"Non so dove sei davvero. Per questo non posso dirti di seguire una strada."
},
{
"id":"V2_LUOGO_lisbona_01",
"who":"Livia",
"fase":"IV",
"text":"Mi descrivi prima quello che cambia, poi quello che ti sembra di riconoscere?",
"opts":[
{
"t":"Ti descrivo il primo gesto. Poi quello che ritorna.",
"to":"V2_LUOGO_lisbona_02"
},
{
"t":"Aspetto un istante. Mi viene da anticiparlo.",
"to":"V2_LUOGO_lisbona_03"
}
]
},
{
"id":"V2_LUOGO_lisbona_02",
"who":"Livia",
"fase":"IV",
"text":"Non voglio farti riscrivere la scena. Voglio evitare di completarvela io.",
"opts":[
{
"t":"Se non so un pezzo, lascio il buco.",
"to":"V2_LUOGO_lisbona_04"
},
{
"t":"Posso mandarti appunti brutti, ma scritti adesso.",
"to":"V2_LUOGO_lisbona_05"
}
]
},
{
"id":"V2_LUOGO_lisbona_03",
"who":"Livia",
"fase":"IV",
"text":"Il pezzo del ragazzo è una ripetizione, non un nuovo viaggio nel passato.",
"opts":[
{
"t":"Non posso arrivare prima di quello che è successo.",
"to":"V2_LUOGO_lisbona_04"
},
{
"t":"Guardo il punto in cui posso interrompere.",
"to":"V2_LUOGO_lisbona_05"
}
]
},
{
"id":"V2_LUOGO_lisbona_04",
"who":"Livia",
"fase":"IV",
"text":"Se la interrompi, guardiamo cosa smette di accadere. Non inventiamo chi è tornato.",
"opts":[
{
"t":"Ti dico che cosa ha smesso di ripetersi.",
"to":"V2_LUOGO_lisbona_05"
},
{
"t":"Se si ferma, non scrivo che è tornato vivo.",
"to":"V2_LUOGO_lisbona_05"
}
]
},
{
"id":"V2_LUOGO_lisbona_05",
"who":"Livia",
"fase":"IV",
"text":"Va bene. Adesso mi prendo un momento prima di farti un’altra domanda."
},
{
"id":"V2_LUOGO_atene_01",
"who":"Rosa",
"fase":"V",
"text":"Quella è la porta. Non chiamarla già la tua uscita.",
"opts":[
{
"t":"Mi sono accorto di averle già dato quel nome.",
"to":"V2_LUOGO_atene_02"
},
{
"t":"Mi fermo prima della porta.",
"to":"V2_LUOGO_atene_03"
}
]
},
{
"id":"V2_LUOGO_atene_02",
"who":"Rosa",
"fase":"V",
"text":"Il confine e lo svincolo non sono la stessa cosa. Non li mescoliamo adesso.",
"opts":[
{
"t":"Lo svincolo è un’altra scelta. Questa è la porta.",
"to":"V2_LUOGO_atene_04"
},
{
"t":"Non uso il desiderio di uscire per decidere chi c’è.",
"to":"V2_LUOGO_atene_05"
}
]
},
{
"id":"V2_LUOGO_atene_03",
"who":"Rosa",
"fase":"V",
"text":"Prima scegli chi hai davanti. Poi decidi che cosa vuoi far passare.",
"opts":[
{
"t":"Prima il volto, il nome e la foto.",
"to":"V2_LUOGO_atene_04"
},
{
"t":"Nessuno passa perché ho fretta.",
"to":"V2_LUOGO_atene_05"
}
]
},
{
"id":"V2_LUOGO_atene_04",
"who":"Rosa",
"fase":"V",
"text":"Non ti preparo la risposta per farti stare meglio.",
"opts":[
{
"t":"Ho paura. Mi tengo anche quella.",
"to":"V2_LUOGO_atene_05"
},
{
"t":"Dimmi solo quello che sai, Rosa.",
"to":"V2_LUOGO_atene_05"
}
]
},
{
"id":"V2_LUOGO_atene_05",
"who":"Rosa",
"fase":"V",
"text":"Quando scegli, voglio che sia la tua scelta. Non la mia fretta."
},
{
"id":"V2_LUOGO_washington_01",
"who":"Livia",
"fase":"V",
"text":"La nota non ti chiede di riconoscere una voce. Ti chiede di capire chi accompagni.",
"opts":[
{
"t":"Rileggo chi, non soltanto come si esce.",
"to":"V2_LUOGO_washington_02"
},
{
"t":"Quella parola l’avevo saltata: accompagni.",
"to":"V2_LUOGO_washington_03"
}
]
},
{
"id":"V2_LUOGO_washington_02",
"who":"Livia",
"fase":"V",
"text":"La donna della Panda aveva visto questo pezzo. Non tutta la storia.",
"opts":[
{
"t":"Non chiedo a questa nota di sapere tutto.",
"to":"V2_LUOGO_washington_04"
},
{
"t":"Questo pezzo basta a farmi rileggere gli altri.",
"to":"V2_LUOGO_washington_05"
}
]
},
{
"id":"V2_LUOGO_washington_03",
"who":"Livia",
"fase":"V",
"text":"Se una frase ti sembra troppo semplice, non completarla con una promessa.",
"opts":[
{
"t":"La finisco dove finisce l’inchiostro.",
"to":"V2_LUOGO_washington_04"
},
{
"t":"La promessa la devo scegliere io, dopo.",
"to":"V2_LUOGO_washington_05"
}
]
},
{
"id":"V2_LUOGO_washington_04",
"who":"Livia",
"fase":"V",
"text":"Una persona che manca non diventa chiunque sappia usare il suo nome.",
"opts":[
{
"t":"Mi manca qualcuno. Non basta per chiamarlo così.",
"to":"V2_LUOGO_washington_05"
},
{
"t":"Ho ancora una domanda. Stavolta la scrivo intera.",
"to":"V2_LUOGO_washington_05"
}
]
},
{
"id":"V2_LUOGO_washington_05",
"who":"Livia",
"fase":"V",
"text":"Prima di chiudere, dimmi se quello che vuoi sapere l’hai davvero chiesto."
},
{
"id":"V2_CASA_01_M1",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Come si chiama il tuo gatto?",
"to":"V2_CASA_01_Q1_M1",
"fx":[
"flag:q11"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_fine"
}
]
},
{
"id":"V2_CASA_01_Q1_M1",
"who":"Elena",
"fase":"IV",
"text":"Pasta. Non è cambiato mentre guidavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_01_M2",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quando dici Pasta, di chi parli?",
"to":"V2_CASA_01_Q2_M2",
"fx":[
"flag:q12"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_fine"
}
]
},
{
"id":"V2_CASA_01_Q2_M2",
"who":"Elena",
"fase":"IV",
"text":"Del gatto. La cena è un altro problema.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_01_M3",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Come si chiama il tuo gatto?",
"to":"V2_CASA_01_Q1_M3",
"fx":[
"flag:q11"
]
},
{
"t":"Quando dici Pasta, di chi parli?",
"to":"V2_CASA_01_Q2_M3",
"fx":[
"flag:q12"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_fine"
}
]
},
{
"id":"V2_CASA_01_Q1_M3",
"who":"Elena",
"fase":"IV",
"text":"Pasta. Non è cambiato mentre guidavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_M2",
"fx":[
"chiude:V2_CASA_01_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_01_Q2_M3",
"who":"Elena",
"fase":"IV",
"text":"Del gatto. La cena è un altro problema.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_M1",
"fx":[
"chiude:V2_CASA_01_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_01_M4",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Chi si è preso la casa, secondo te?",
"to":"V2_CASA_01_Q3_M4",
"fx":[
"flag:q13"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_fine"
}
]
},
{
"id":"V2_CASA_01_Q3_M4",
"who":"Elena",
"fase":"IV",
"text":"Pasta. Io sto ancora trattando.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_01_M5",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Come si chiama il tuo gatto?",
"to":"V2_CASA_01_Q1_M5",
"fx":[
"flag:q11"
]
},
{
"t":"Chi si è preso la casa, secondo te?",
"to":"V2_CASA_01_Q3_M5",
"fx":[
"flag:q13"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_fine"
}
]
},
{
"id":"V2_CASA_01_Q1_M5",
"who":"Elena",
"fase":"IV",
"text":"Pasta. Non è cambiato mentre guidavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_M4",
"fx":[
"chiude:V2_CASA_01_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_01_Q3_M5",
"who":"Elena",
"fase":"IV",
"text":"Pasta. Io sto ancora trattando.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_M1",
"fx":[
"chiude:V2_CASA_01_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_01_M6",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quando dici Pasta, di chi parli?",
"to":"V2_CASA_01_Q2_M6",
"fx":[
"flag:q12"
]
},
{
"t":"Chi si è preso la casa, secondo te?",
"to":"V2_CASA_01_Q3_M6",
"fx":[
"flag:q13"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_fine"
}
]
},
{
"id":"V2_CASA_01_Q2_M6",
"who":"Elena",
"fase":"IV",
"text":"Del gatto. La cena è un altro problema.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_M4",
"fx":[
"chiude:V2_CASA_01_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_01_Q3_M6",
"who":"Elena",
"fase":"IV",
"text":"Pasta. Io sto ancora trattando.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_M2",
"fx":[
"chiude:V2_CASA_01_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_01",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Come si chiama il tuo gatto?",
"to":"V2_CASA_01_Q1_M7",
"fx":[
"flag:q11"
]
},
{
"t":"Quando dici Pasta, di chi parli?",
"to":"V2_CASA_01_Q2_M7",
"fx":[
"flag:q12"
]
},
{
"t":"Chi si è preso la casa, secondo te?",
"to":"V2_CASA_01_Q3_M7",
"fx":[
"flag:q13"
]
}
]
},
{
"id":"V2_CASA_01_Q1_M7",
"who":"Elena",
"fase":"IV",
"text":"Pasta. Non è cambiato mentre guidavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_M6",
"fx":[
"chiude:V2_CASA_01_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_01_Q2_M7",
"who":"Elena",
"fase":"IV",
"text":"Del gatto. La cena è un altro problema.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_M5",
"fx":[
"chiude:V2_CASA_01_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_01_Q3_M7",
"who":"Elena",
"fase":"IV",
"text":"Pasta. Io sto ancora trattando.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_fine",
"fx":[
"chiude:V2_CASA_01_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_M3",
"fx":[
"chiude:V2_CASA_01_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_01_fine",
"who":"Elena",
"fase":"IV",
"text":"Adesso sai quello che ti ho risposto, non tutto il resto.",
"alt":[
{
"req":"flag:q11",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q12",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q13",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_01_P_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Come si chiama il tuo gatto?",
"to":"V2_CASA_01_P_Q1_M1",
"fx":[
"flag:q11"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_P_fine"
}
]
},
{
"id":"V2_CASA_01_P_Q1_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Pesto. Perché me lo chiedi adesso?",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_01_P_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Quando dici Pasta, di chi parli?",
"to":"V2_CASA_01_P_Q2_M2",
"fx":[
"flag:q12"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_P_fine"
}
]
},
{
"id":"V2_CASA_01_P_Q2_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Di quello che sto preparando per cena.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_01_P_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Come si chiama il tuo gatto?",
"to":"V2_CASA_01_P_Q1_M3",
"fx":[
"flag:q11"
]
},
{
"t":"Quando dici Pasta, di chi parli?",
"to":"V2_CASA_01_P_Q2_M3",
"fx":[
"flag:q12"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_P_fine"
}
]
},
{
"id":"V2_CASA_01_P_Q1_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Pesto. Perché me lo chiedi adesso?",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_M2",
"fx":[
"chiude:V2_CASA_01_P_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_01_P_Q2_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Di quello che sto preparando per cena.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_M1",
"fx":[
"chiude:V2_CASA_01_P_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_01_P_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Chi si è preso la casa, secondo te?",
"to":"V2_CASA_01_P_Q3_M4",
"fx":[
"flag:q13"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_P_fine"
}
]
},
{
"id":"V2_CASA_01_P_Q3_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Il cane. Lo sai come fa.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_01_P_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Come si chiama il tuo gatto?",
"to":"V2_CASA_01_P_Q1_M5",
"fx":[
"flag:q11"
]
},
{
"t":"Chi si è preso la casa, secondo te?",
"to":"V2_CASA_01_P_Q3_M5",
"fx":[
"flag:q13"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_P_fine"
}
]
},
{
"id":"V2_CASA_01_P_Q1_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Pesto. Perché me lo chiedi adesso?",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_M4",
"fx":[
"chiude:V2_CASA_01_P_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_01_P_Q3_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Il cane. Lo sai come fa.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_M1",
"fx":[
"chiude:V2_CASA_01_P_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_01_P_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Quando dici Pasta, di chi parli?",
"to":"V2_CASA_01_P_Q2_M6",
"fx":[
"flag:q12"
]
},
{
"t":"Chi si è preso la casa, secondo te?",
"to":"V2_CASA_01_P_Q3_M6",
"fx":[
"flag:q13"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_01_P_fine"
}
]
},
{
"id":"V2_CASA_01_P_Q2_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Di quello che sto preparando per cena.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_M4",
"fx":[
"chiude:V2_CASA_01_P_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_01_P_Q3_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Il cane. Lo sai come fa.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_M2",
"fx":[
"chiude:V2_CASA_01_P_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_01_P",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"opts":[
{
"t":"Come si chiama il tuo gatto?",
"to":"V2_CASA_01_P_Q1_M7",
"fx":[
"flag:q11"
]
},
{
"t":"Quando dici Pasta, di chi parli?",
"to":"V2_CASA_01_P_Q2_M7",
"fx":[
"flag:q12"
]
},
{
"t":"Chi si è preso la casa, secondo te?",
"to":"V2_CASA_01_P_Q3_M7",
"fx":[
"flag:q13"
]
}
]
},
{
"id":"V2_CASA_01_P_Q1_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Pesto. Perché me lo chiedi adesso?",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_M6",
"fx":[
"chiude:V2_CASA_01_P_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_01_P_Q2_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Di quello che sto preparando per cena.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_M5",
"fx":[
"chiude:V2_CASA_01_P_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_01_P_Q3_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Il cane. Lo sai come fa.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_01_P_fine",
"fx":[
"chiude:V2_CASA_01_P_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_01_P_M3",
"fx":[
"chiude:V2_CASA_01_P_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_01_P_fine",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Adesso hai la risposta. Possiamo smettere con le domande?",
"alt":[
{
"req":"flag:q11",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q12",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q13",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_02_M1",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Che orario sensato mi avevi dato?",
"to":"V2_CASA_02_Q1_M1",
"fx":[
"flag:q21"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_fine"
}
]
},
{
"id":"V2_CASA_02_Q1_M1",
"who":"Elena",
"fase":"IV",
"text":"Nessuno. È quello il problema dei miei turni.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_02_M2",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Se ti scrivo mentre lavori, cosa fai?",
"to":"V2_CASA_02_Q2_M2",
"fx":[
"flag:q22"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_fine"
}
]
},
{
"id":"V2_CASA_02_Q2_M2",
"who":"Elena",
"fase":"IV",
"text":"Rispondo dopo. Te l’ho detto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_02_M3",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Che orario sensato mi avevi dato?",
"to":"V2_CASA_02_Q1_M3",
"fx":[
"flag:q21"
]
},
{
"t":"Se ti scrivo mentre lavori, cosa fai?",
"to":"V2_CASA_02_Q2_M3",
"fx":[
"flag:q22"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_fine"
}
]
},
{
"id":"V2_CASA_02_Q1_M3",
"who":"Elena",
"fase":"IV",
"text":"Nessuno. È quello il problema dei miei turni.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_M2",
"fx":[
"chiude:V2_CASA_02_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_02_Q2_M3",
"who":"Elena",
"fase":"IV",
"text":"Rispondo dopo. Te l’ho detto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_M1",
"fx":[
"chiude:V2_CASA_02_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_02_M4",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Avevamo fissato un’ora per sentirci?",
"to":"V2_CASA_02_Q3_M4",
"fx":[
"flag:q23"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_fine"
}
]
},
{
"id":"V2_CASA_02_Q3_M4",
"who":"Elena",
"fase":"IV",
"text":"No. Dovevi scrivere quando ti fermavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_02_M5",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Che orario sensato mi avevi dato?",
"to":"V2_CASA_02_Q1_M5",
"fx":[
"flag:q21"
]
},
{
"t":"Avevamo fissato un’ora per sentirci?",
"to":"V2_CASA_02_Q3_M5",
"fx":[
"flag:q23"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_fine"
}
]
},
{
"id":"V2_CASA_02_Q1_M5",
"who":"Elena",
"fase":"IV",
"text":"Nessuno. È quello il problema dei miei turni.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_M4",
"fx":[
"chiude:V2_CASA_02_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_02_Q3_M5",
"who":"Elena",
"fase":"IV",
"text":"No. Dovevi scrivere quando ti fermavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_M1",
"fx":[
"chiude:V2_CASA_02_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_02_M6",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Se ti scrivo mentre lavori, cosa fai?",
"to":"V2_CASA_02_Q2_M6",
"fx":[
"flag:q22"
]
},
{
"t":"Avevamo fissato un’ora per sentirci?",
"to":"V2_CASA_02_Q3_M6",
"fx":[
"flag:q23"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_fine"
}
]
},
{
"id":"V2_CASA_02_Q2_M6",
"who":"Elena",
"fase":"IV",
"text":"Rispondo dopo. Te l’ho detto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_M4",
"fx":[
"chiude:V2_CASA_02_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_02_Q3_M6",
"who":"Elena",
"fase":"IV",
"text":"No. Dovevi scrivere quando ti fermavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_M2",
"fx":[
"chiude:V2_CASA_02_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_02",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Che orario sensato mi avevi dato?",
"to":"V2_CASA_02_Q1_M7",
"fx":[
"flag:q21"
]
},
{
"t":"Se ti scrivo mentre lavori, cosa fai?",
"to":"V2_CASA_02_Q2_M7",
"fx":[
"flag:q22"
]
},
{
"t":"Avevamo fissato un’ora per sentirci?",
"to":"V2_CASA_02_Q3_M7",
"fx":[
"flag:q23"
]
}
]
},
{
"id":"V2_CASA_02_Q1_M7",
"who":"Elena",
"fase":"IV",
"text":"Nessuno. È quello il problema dei miei turni.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_M6",
"fx":[
"chiude:V2_CASA_02_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_02_Q2_M7",
"who":"Elena",
"fase":"IV",
"text":"Rispondo dopo. Te l’ho detto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_M5",
"fx":[
"chiude:V2_CASA_02_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_02_Q3_M7",
"who":"Elena",
"fase":"IV",
"text":"No. Dovevi scrivere quando ti fermavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_fine",
"fx":[
"chiude:V2_CASA_02_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_M3",
"fx":[
"chiude:V2_CASA_02_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_02_fine",
"who":"Elena",
"fase":"IV",
"text":"Adesso sai quello che ti ho risposto, non tutto il resto.",
"alt":[
{
"req":"flag:q21",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q22",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q23",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_02_P_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Che orario sensato mi avevi dato?",
"to":"V2_CASA_02_P_Q1_M1",
"fx":[
"flag:q21"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_P_fine"
}
]
},
{
"id":"V2_CASA_02_P_Q1_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Quello di sempre. Non cambia mai.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_02_P_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Se ti scrivo mentre lavori, cosa fai?",
"to":"V2_CASA_02_P_Q2_M2",
"fx":[
"flag:q22"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_P_fine"
}
]
},
{
"id":"V2_CASA_02_P_Q2_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Ti rispondo subito. Ti rispondo sempre.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_02_P_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Che orario sensato mi avevi dato?",
"to":"V2_CASA_02_P_Q1_M3",
"fx":[
"flag:q21"
]
},
{
"t":"Se ti scrivo mentre lavori, cosa fai?",
"to":"V2_CASA_02_P_Q2_M3",
"fx":[
"flag:q22"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_P_fine"
}
]
},
{
"id":"V2_CASA_02_P_Q1_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Quello di sempre. Non cambia mai.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_M2",
"fx":[
"chiude:V2_CASA_02_P_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_02_P_Q2_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Ti rispondo subito. Ti rispondo sempre.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_M1",
"fx":[
"chiude:V2_CASA_02_P_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_02_P_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Avevamo fissato un’ora per sentirci?",
"to":"V2_CASA_02_P_Q3_M4",
"fx":[
"flag:q23"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_P_fine"
}
]
},
{
"id":"V2_CASA_02_P_Q3_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. La stessa ora di tutte le sere.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_02_P_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Che orario sensato mi avevi dato?",
"to":"V2_CASA_02_P_Q1_M5",
"fx":[
"flag:q21"
]
},
{
"t":"Avevamo fissato un’ora per sentirci?",
"to":"V2_CASA_02_P_Q3_M5",
"fx":[
"flag:q23"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_P_fine"
}
]
},
{
"id":"V2_CASA_02_P_Q1_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Quello di sempre. Non cambia mai.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_M4",
"fx":[
"chiude:V2_CASA_02_P_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_02_P_Q3_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. La stessa ora di tutte le sere.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_M1",
"fx":[
"chiude:V2_CASA_02_P_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_02_P_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Se ti scrivo mentre lavori, cosa fai?",
"to":"V2_CASA_02_P_Q2_M6",
"fx":[
"flag:q22"
]
},
{
"t":"Avevamo fissato un’ora per sentirci?",
"to":"V2_CASA_02_P_Q3_M6",
"fx":[
"flag:q23"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_02_P_fine"
}
]
},
{
"id":"V2_CASA_02_P_Q2_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Ti rispondo subito. Ti rispondo sempre.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_M4",
"fx":[
"chiude:V2_CASA_02_P_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_02_P_Q3_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. La stessa ora di tutte le sere.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_M2",
"fx":[
"chiude:V2_CASA_02_P_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_02_P",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"opts":[
{
"t":"Che orario sensato mi avevi dato?",
"to":"V2_CASA_02_P_Q1_M7",
"fx":[
"flag:q21"
]
},
{
"t":"Se ti scrivo mentre lavori, cosa fai?",
"to":"V2_CASA_02_P_Q2_M7",
"fx":[
"flag:q22"
]
},
{
"t":"Avevamo fissato un’ora per sentirci?",
"to":"V2_CASA_02_P_Q3_M7",
"fx":[
"flag:q23"
]
}
]
},
{
"id":"V2_CASA_02_P_Q1_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Quello di sempre. Non cambia mai.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_M6",
"fx":[
"chiude:V2_CASA_02_P_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_02_P_Q2_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Ti rispondo subito. Ti rispondo sempre.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_M5",
"fx":[
"chiude:V2_CASA_02_P_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_02_P_Q3_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. La stessa ora di tutte le sere.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_02_P_fine",
"fx":[
"chiude:V2_CASA_02_P_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_02_P_M3",
"fx":[
"chiude:V2_CASA_02_P_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_02_P_fine",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Adesso hai la risposta. Possiamo smettere con le domande?",
"alt":[
{
"req":"flag:q21",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q22",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q23",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_03_M1",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Di chi ti lamentavi prima?",
"to":"V2_CASA_03_Q1_M1",
"fx":[
"flag:q31"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_fine"
}
]
},
{
"id":"V2_CASA_03_Q1_M1",
"who":"Elena",
"fase":"IV",
"text":"Del coinquilino. Non di uno sconosciuto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_03_M2",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Perché non mi hai passato il coinquilino?",
"to":"V2_CASA_03_Q2_M2",
"fx":[
"flag:q32"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_fine"
}
]
},
{
"id":"V2_CASA_03_Q2_M2",
"who":"Elena",
"fase":"IV",
"text":"Per risparmiarti una conversazione infinita.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_03_M3",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Di chi ti lamentavi prima?",
"to":"V2_CASA_03_Q1_M3",
"fx":[
"flag:q31"
]
},
{
"t":"Perché non mi hai passato il coinquilino?",
"to":"V2_CASA_03_Q2_M3",
"fx":[
"flag:q32"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_fine"
}
]
},
{
"id":"V2_CASA_03_Q1_M3",
"who":"Elena",
"fase":"IV",
"text":"Del coinquilino. Non di uno sconosciuto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_M2",
"fx":[
"chiude:V2_CASA_03_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_03_Q2_M3",
"who":"Elena",
"fase":"IV",
"text":"Per risparmiarti una conversazione infinita.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_M1",
"fx":[
"chiude:V2_CASA_03_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_03_M4",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Il tuo coinquilino ti faceva paura?",
"to":"V2_CASA_03_Q3_M4",
"fx":[
"flag:q33"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_fine"
}
]
},
{
"id":"V2_CASA_03_Q3_M4",
"who":"Elena",
"fase":"IV",
"text":"No. Mi stava annoiando. È diverso.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_03_M5",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Di chi ti lamentavi prima?",
"to":"V2_CASA_03_Q1_M5",
"fx":[
"flag:q31"
]
},
{
"t":"Il tuo coinquilino ti faceva paura?",
"to":"V2_CASA_03_Q3_M5",
"fx":[
"flag:q33"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_fine"
}
]
},
{
"id":"V2_CASA_03_Q1_M5",
"who":"Elena",
"fase":"IV",
"text":"Del coinquilino. Non di uno sconosciuto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_M4",
"fx":[
"chiude:V2_CASA_03_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_03_Q3_M5",
"who":"Elena",
"fase":"IV",
"text":"No. Mi stava annoiando. È diverso.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_M1",
"fx":[
"chiude:V2_CASA_03_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_03_M6",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Perché non mi hai passato il coinquilino?",
"to":"V2_CASA_03_Q2_M6",
"fx":[
"flag:q32"
]
},
{
"t":"Il tuo coinquilino ti faceva paura?",
"to":"V2_CASA_03_Q3_M6",
"fx":[
"flag:q33"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_fine"
}
]
},
{
"id":"V2_CASA_03_Q2_M6",
"who":"Elena",
"fase":"IV",
"text":"Per risparmiarti una conversazione infinita.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_M4",
"fx":[
"chiude:V2_CASA_03_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_03_Q3_M6",
"who":"Elena",
"fase":"IV",
"text":"No. Mi stava annoiando. È diverso.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_M2",
"fx":[
"chiude:V2_CASA_03_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_03",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Di chi ti lamentavi prima?",
"to":"V2_CASA_03_Q1_M7",
"fx":[
"flag:q31"
]
},
{
"t":"Perché non mi hai passato il coinquilino?",
"to":"V2_CASA_03_Q2_M7",
"fx":[
"flag:q32"
]
},
{
"t":"Il tuo coinquilino ti faceva paura?",
"to":"V2_CASA_03_Q3_M7",
"fx":[
"flag:q33"
]
}
]
},
{
"id":"V2_CASA_03_Q1_M7",
"who":"Elena",
"fase":"IV",
"text":"Del coinquilino. Non di uno sconosciuto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_M6",
"fx":[
"chiude:V2_CASA_03_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_03_Q2_M7",
"who":"Elena",
"fase":"IV",
"text":"Per risparmiarti una conversazione infinita.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_M5",
"fx":[
"chiude:V2_CASA_03_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_03_Q3_M7",
"who":"Elena",
"fase":"IV",
"text":"No. Mi stava annoiando. È diverso.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_fine",
"fx":[
"chiude:V2_CASA_03_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_M3",
"fx":[
"chiude:V2_CASA_03_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_03_fine",
"who":"Elena",
"fase":"IV",
"text":"Adesso sai quello che ti ho risposto, non tutto il resto.",
"alt":[
{
"req":"flag:q31",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q32",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q33",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_03_P_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Di chi ti lamentavi prima?",
"to":"V2_CASA_03_P_Q1_M1",
"fx":[
"flag:q31"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_P_fine"
}
]
},
{
"id":"V2_CASA_03_P_Q1_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Di quello che abita accanto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_03_P_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Perché non mi hai passato il coinquilino?",
"to":"V2_CASA_03_P_Q2_M2",
"fx":[
"flag:q32"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_P_fine"
}
]
},
{
"id":"V2_CASA_03_P_Q2_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Perché non vivo con nessuno.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_03_P_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Di chi ti lamentavi prima?",
"to":"V2_CASA_03_P_Q1_M3",
"fx":[
"flag:q31"
]
},
{
"t":"Perché non mi hai passato il coinquilino?",
"to":"V2_CASA_03_P_Q2_M3",
"fx":[
"flag:q32"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_P_fine"
}
]
},
{
"id":"V2_CASA_03_P_Q1_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Di quello che abita accanto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_M2",
"fx":[
"chiude:V2_CASA_03_P_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_03_P_Q2_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Perché non vivo con nessuno.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_M1",
"fx":[
"chiude:V2_CASA_03_P_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_03_P_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Il tuo coinquilino ti faceva paura?",
"to":"V2_CASA_03_P_Q3_M4",
"fx":[
"flag:q33"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_P_fine"
}
]
},
{
"id":"V2_CASA_03_P_Q3_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È per quello che ti chiamavo.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_03_P_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Di chi ti lamentavi prima?",
"to":"V2_CASA_03_P_Q1_M5",
"fx":[
"flag:q31"
]
},
{
"t":"Il tuo coinquilino ti faceva paura?",
"to":"V2_CASA_03_P_Q3_M5",
"fx":[
"flag:q33"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_P_fine"
}
]
},
{
"id":"V2_CASA_03_P_Q1_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Di quello che abita accanto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_M4",
"fx":[
"chiude:V2_CASA_03_P_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_03_P_Q3_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È per quello che ti chiamavo.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_M1",
"fx":[
"chiude:V2_CASA_03_P_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_03_P_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Perché non mi hai passato il coinquilino?",
"to":"V2_CASA_03_P_Q2_M6",
"fx":[
"flag:q32"
]
},
{
"t":"Il tuo coinquilino ti faceva paura?",
"to":"V2_CASA_03_P_Q3_M6",
"fx":[
"flag:q33"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_03_P_fine"
}
]
},
{
"id":"V2_CASA_03_P_Q2_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Perché non vivo con nessuno.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_M4",
"fx":[
"chiude:V2_CASA_03_P_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_03_P_Q3_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È per quello che ti chiamavo.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_M2",
"fx":[
"chiude:V2_CASA_03_P_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_03_P",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"opts":[
{
"t":"Di chi ti lamentavi prima?",
"to":"V2_CASA_03_P_Q1_M7",
"fx":[
"flag:q31"
]
},
{
"t":"Perché non mi hai passato il coinquilino?",
"to":"V2_CASA_03_P_Q2_M7",
"fx":[
"flag:q32"
]
},
{
"t":"Il tuo coinquilino ti faceva paura?",
"to":"V2_CASA_03_P_Q3_M7",
"fx":[
"flag:q33"
]
}
]
},
{
"id":"V2_CASA_03_P_Q1_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Di quello che abita accanto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_M6",
"fx":[
"chiude:V2_CASA_03_P_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_03_P_Q2_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Perché non vivo con nessuno.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_M5",
"fx":[
"chiude:V2_CASA_03_P_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_03_P_Q3_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È per quello che ti chiamavo.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_03_P_fine",
"fx":[
"chiude:V2_CASA_03_P_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_03_P_M3",
"fx":[
"chiude:V2_CASA_03_P_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_03_P_fine",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Adesso hai la risposta. Possiamo smettere con le domande?",
"alt":[
{
"req":"flag:q31",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q32",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q33",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_04_M1",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Perché mi chiami Nonno?",
"to":"V2_CASA_04_Q1_M1",
"fx":[
"flag:q41"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_fine"
}
]
},
{
"id":"V2_CASA_04_Q1_M1",
"who":"Elena",
"fase":"IV",
"text":"Perché brontoli. E mi faciliti il lavoro.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_04_M2",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Nonno è un titolo onorifico?",
"to":"V2_CASA_04_Q2_M2",
"fx":[
"flag:q42"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_fine"
}
]
},
{
"id":"V2_CASA_04_Q2_M2",
"who":"Elena",
"fase":"IV",
"text":"Sì, certo. Continua a raccontartela.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_04_M3",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Perché mi chiami Nonno?",
"to":"V2_CASA_04_Q1_M3",
"fx":[
"flag:q41"
]
},
{
"t":"Nonno è un titolo onorifico?",
"to":"V2_CASA_04_Q2_M3",
"fx":[
"flag:q42"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_fine"
}
]
},
{
"id":"V2_CASA_04_Q1_M3",
"who":"Elena",
"fase":"IV",
"text":"Perché brontoli. E mi faciliti il lavoro.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_M2",
"fx":[
"chiude:V2_CASA_04_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_04_Q2_M3",
"who":"Elena",
"fase":"IV",
"text":"Sì, certo. Continua a raccontartela.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_M1",
"fx":[
"chiude:V2_CASA_04_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_04_M4",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Come mi chiami quando vuoi prendermi in giro?",
"to":"V2_CASA_04_Q3_M4",
"fx":[
"flag:q43"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_fine"
}
]
},
{
"id":"V2_CASA_04_Q3_M4",
"who":"Elena",
"fase":"IV",
"text":"Nonno. Adesso non fingere di essertelo perso.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_04_M5",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Perché mi chiami Nonno?",
"to":"V2_CASA_04_Q1_M5",
"fx":[
"flag:q41"
]
},
{
"t":"Come mi chiami quando vuoi prendermi in giro?",
"to":"V2_CASA_04_Q3_M5",
"fx":[
"flag:q43"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_fine"
}
]
},
{
"id":"V2_CASA_04_Q1_M5",
"who":"Elena",
"fase":"IV",
"text":"Perché brontoli. E mi faciliti il lavoro.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_M4",
"fx":[
"chiude:V2_CASA_04_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_04_Q3_M5",
"who":"Elena",
"fase":"IV",
"text":"Nonno. Adesso non fingere di essertelo perso.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_M1",
"fx":[
"chiude:V2_CASA_04_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_04_M6",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Nonno è un titolo onorifico?",
"to":"V2_CASA_04_Q2_M6",
"fx":[
"flag:q42"
]
},
{
"t":"Come mi chiami quando vuoi prendermi in giro?",
"to":"V2_CASA_04_Q3_M6",
"fx":[
"flag:q43"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_fine"
}
]
},
{
"id":"V2_CASA_04_Q2_M6",
"who":"Elena",
"fase":"IV",
"text":"Sì, certo. Continua a raccontartela.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_M4",
"fx":[
"chiude:V2_CASA_04_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_04_Q3_M6",
"who":"Elena",
"fase":"IV",
"text":"Nonno. Adesso non fingere di essertelo perso.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_M2",
"fx":[
"chiude:V2_CASA_04_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_04",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Perché mi chiami Nonno?",
"to":"V2_CASA_04_Q1_M7",
"fx":[
"flag:q41"
]
},
{
"t":"Nonno è un titolo onorifico?",
"to":"V2_CASA_04_Q2_M7",
"fx":[
"flag:q42"
]
},
{
"t":"Come mi chiami quando vuoi prendermi in giro?",
"to":"V2_CASA_04_Q3_M7",
"fx":[
"flag:q43"
]
}
]
},
{
"id":"V2_CASA_04_Q1_M7",
"who":"Elena",
"fase":"IV",
"text":"Perché brontoli. E mi faciliti il lavoro.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_M6",
"fx":[
"chiude:V2_CASA_04_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_04_Q2_M7",
"who":"Elena",
"fase":"IV",
"text":"Sì, certo. Continua a raccontartela.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_M5",
"fx":[
"chiude:V2_CASA_04_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_04_Q3_M7",
"who":"Elena",
"fase":"IV",
"text":"Nonno. Adesso non fingere di essertelo perso.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_fine",
"fx":[
"chiude:V2_CASA_04_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_M3",
"fx":[
"chiude:V2_CASA_04_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_04_fine",
"who":"Elena",
"fase":"IV",
"text":"Adesso sai quello che ti ho risposto, non tutto il resto.",
"alt":[
{
"req":"flag:q41",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q42",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q43",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_04_P_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Perché mi chiami Nonno?",
"to":"V2_CASA_04_P_Q1_M1",
"fx":[
"flag:q41"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_P_fine"
}
]
},
{
"id":"V2_CASA_04_P_Q1_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Perché è il modo più dolce che conosco.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_04_P_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Nonno è un titolo onorifico?",
"to":"V2_CASA_04_P_Q2_M2",
"fx":[
"flag:q42"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_P_fine"
}
]
},
{
"id":"V2_CASA_04_P_Q2_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È una cosa importante tra noi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_04_P_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Perché mi chiami Nonno?",
"to":"V2_CASA_04_P_Q1_M3",
"fx":[
"flag:q41"
]
},
{
"t":"Nonno è un titolo onorifico?",
"to":"V2_CASA_04_P_Q2_M3",
"fx":[
"flag:q42"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_P_fine"
}
]
},
{
"id":"V2_CASA_04_P_Q1_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Perché è il modo più dolce che conosco.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_M2",
"fx":[
"chiude:V2_CASA_04_P_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_04_P_Q2_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È una cosa importante tra noi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_M1",
"fx":[
"chiude:V2_CASA_04_P_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_04_P_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Come mi chiami quando vuoi prendermi in giro?",
"to":"V2_CASA_04_P_Q3_M4",
"fx":[
"flag:q43"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_P_fine"
}
]
},
{
"id":"V2_CASA_04_P_Q3_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, amore. È sempre stato così.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_04_P_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Perché mi chiami Nonno?",
"to":"V2_CASA_04_P_Q1_M5",
"fx":[
"flag:q41"
]
},
{
"t":"Come mi chiami quando vuoi prendermi in giro?",
"to":"V2_CASA_04_P_Q3_M5",
"fx":[
"flag:q43"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_P_fine"
}
]
},
{
"id":"V2_CASA_04_P_Q1_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Perché è il modo più dolce che conosco.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_M4",
"fx":[
"chiude:V2_CASA_04_P_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_04_P_Q3_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, amore. È sempre stato così.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_M1",
"fx":[
"chiude:V2_CASA_04_P_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_04_P_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Nonno è un titolo onorifico?",
"to":"V2_CASA_04_P_Q2_M6",
"fx":[
"flag:q42"
]
},
{
"t":"Come mi chiami quando vuoi prendermi in giro?",
"to":"V2_CASA_04_P_Q3_M6",
"fx":[
"flag:q43"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_04_P_fine"
}
]
},
{
"id":"V2_CASA_04_P_Q2_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È una cosa importante tra noi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_M4",
"fx":[
"chiude:V2_CASA_04_P_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_04_P_Q3_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, amore. È sempre stato così.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_M2",
"fx":[
"chiude:V2_CASA_04_P_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_04_P",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"opts":[
{
"t":"Perché mi chiami Nonno?",
"to":"V2_CASA_04_P_Q1_M7",
"fx":[
"flag:q41"
]
},
{
"t":"Nonno è un titolo onorifico?",
"to":"V2_CASA_04_P_Q2_M7",
"fx":[
"flag:q42"
]
},
{
"t":"Come mi chiami quando vuoi prendermi in giro?",
"to":"V2_CASA_04_P_Q3_M7",
"fx":[
"flag:q43"
]
}
]
},
{
"id":"V2_CASA_04_P_Q1_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Perché è il modo più dolce che conosco.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_M6",
"fx":[
"chiude:V2_CASA_04_P_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_04_P_Q2_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È una cosa importante tra noi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_M5",
"fx":[
"chiude:V2_CASA_04_P_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_04_P_Q3_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, amore. È sempre stato così.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_04_P_fine",
"fx":[
"chiude:V2_CASA_04_P_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_04_P_M3",
"fx":[
"chiude:V2_CASA_04_P_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_04_P_fine",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Adesso hai la risposta. Possiamo smettere con le domande?",
"alt":[
{
"req":"flag:q41",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q42",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q43",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_05_M1",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Chi mi aveva dato quel soprannome?",
"to":"V2_CASA_05_Q1_M1",
"fx":[
"flag:q51"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_fine"
}
]
},
{
"id":"V2_CASA_05_Q1_M1",
"who":"Elena",
"fase":"IV",
"text":"Claudio. Io l’ho solo tenuto in servizio.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_05_M2",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quanti anni avevo con quel soprannome?",
"to":"V2_CASA_05_Q2_M2",
"fx":[
"flag:q52"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_fine"
}
]
},
{
"id":"V2_CASA_05_Q2_M2",
"who":"Elena",
"fase":"IV",
"text":"Otto. Già brontolavi abbastanza.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_05_M3",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Chi mi aveva dato quel soprannome?",
"to":"V2_CASA_05_Q1_M3",
"fx":[
"flag:q51"
]
},
{
"t":"Quanti anni avevo con quel soprannome?",
"to":"V2_CASA_05_Q2_M3",
"fx":[
"flag:q52"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_fine"
}
]
},
{
"id":"V2_CASA_05_Q1_M3",
"who":"Elena",
"fase":"IV",
"text":"Claudio. Io l’ho solo tenuto in servizio.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_M2",
"fx":[
"chiude:V2_CASA_05_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_05_Q2_M3",
"who":"Elena",
"fase":"IV",
"text":"Otto. Già brontolavi abbastanza.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_M1",
"fx":[
"chiude:V2_CASA_05_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_05_M4",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Il soprannome è nato quando ho ritirato l’auto?",
"to":"V2_CASA_05_Q3_M4",
"fx":[
"flag:q53"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_fine"
}
]
},
{
"id":"V2_CASA_05_Q3_M4",
"who":"Elena",
"fase":"IV",
"text":"No. Avevi otto anni, non una patente.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_05_M5",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Chi mi aveva dato quel soprannome?",
"to":"V2_CASA_05_Q1_M5",
"fx":[
"flag:q51"
]
},
{
"t":"Il soprannome è nato quando ho ritirato l’auto?",
"to":"V2_CASA_05_Q3_M5",
"fx":[
"flag:q53"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_fine"
}
]
},
{
"id":"V2_CASA_05_Q1_M5",
"who":"Elena",
"fase":"IV",
"text":"Claudio. Io l’ho solo tenuto in servizio.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_M4",
"fx":[
"chiude:V2_CASA_05_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_05_Q3_M5",
"who":"Elena",
"fase":"IV",
"text":"No. Avevi otto anni, non una patente.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_M1",
"fx":[
"chiude:V2_CASA_05_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_05_M6",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quanti anni avevo con quel soprannome?",
"to":"V2_CASA_05_Q2_M6",
"fx":[
"flag:q52"
]
},
{
"t":"Il soprannome è nato quando ho ritirato l’auto?",
"to":"V2_CASA_05_Q3_M6",
"fx":[
"flag:q53"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_fine"
}
]
},
{
"id":"V2_CASA_05_Q2_M6",
"who":"Elena",
"fase":"IV",
"text":"Otto. Già brontolavi abbastanza.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_M4",
"fx":[
"chiude:V2_CASA_05_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_05_Q3_M6",
"who":"Elena",
"fase":"IV",
"text":"No. Avevi otto anni, non una patente.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_M2",
"fx":[
"chiude:V2_CASA_05_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_05",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Chi mi aveva dato quel soprannome?",
"to":"V2_CASA_05_Q1_M7",
"fx":[
"flag:q51"
]
},
{
"t":"Quanti anni avevo con quel soprannome?",
"to":"V2_CASA_05_Q2_M7",
"fx":[
"flag:q52"
]
},
{
"t":"Il soprannome è nato quando ho ritirato l’auto?",
"to":"V2_CASA_05_Q3_M7",
"fx":[
"flag:q53"
]
}
]
},
{
"id":"V2_CASA_05_Q1_M7",
"who":"Elena",
"fase":"IV",
"text":"Claudio. Io l’ho solo tenuto in servizio.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_M6",
"fx":[
"chiude:V2_CASA_05_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_05_Q2_M7",
"who":"Elena",
"fase":"IV",
"text":"Otto. Già brontolavi abbastanza.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_M5",
"fx":[
"chiude:V2_CASA_05_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_05_Q3_M7",
"who":"Elena",
"fase":"IV",
"text":"No. Avevi otto anni, non una patente.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_fine",
"fx":[
"chiude:V2_CASA_05_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_M3",
"fx":[
"chiude:V2_CASA_05_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_05_fine",
"who":"Elena",
"fase":"IV",
"text":"Adesso sai quello che ti ho risposto, non tutto il resto.",
"alt":[
{
"req":"flag:q51",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q52",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q53",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_05_P_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Chi mi aveva dato quel soprannome?",
"to":"V2_CASA_05_P_Q1_M1",
"fx":[
"flag:q51"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_P_fine"
}
]
},
{
"id":"V2_CASA_05_P_Q1_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Io. Claudio non c’entrava.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_05_P_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Quanti anni avevo con quel soprannome?",
"to":"V2_CASA_05_P_Q2_M2",
"fx":[
"flag:q52"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_P_fine"
}
]
},
{
"id":"V2_CASA_05_P_Q2_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Eri già adulto. Avevi appena preso l’auto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_05_P_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Chi mi aveva dato quel soprannome?",
"to":"V2_CASA_05_P_Q1_M3",
"fx":[
"flag:q51"
]
},
{
"t":"Quanti anni avevo con quel soprannome?",
"to":"V2_CASA_05_P_Q2_M3",
"fx":[
"flag:q52"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_P_fine"
}
]
},
{
"id":"V2_CASA_05_P_Q1_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Io. Claudio non c’entrava.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_M2",
"fx":[
"chiude:V2_CASA_05_P_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_05_P_Q2_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Eri già adulto. Avevi appena preso l’auto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_M1",
"fx":[
"chiude:V2_CASA_05_P_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_05_P_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Il soprannome è nato quando ho ritirato l’auto?",
"to":"V2_CASA_05_P_Q3_M4",
"fx":[
"flag:q53"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_P_fine"
}
]
},
{
"id":"V2_CASA_05_P_Q3_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È nato tutto quel giorno.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_05_P_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Chi mi aveva dato quel soprannome?",
"to":"V2_CASA_05_P_Q1_M5",
"fx":[
"flag:q51"
]
},
{
"t":"Il soprannome è nato quando ho ritirato l’auto?",
"to":"V2_CASA_05_P_Q3_M5",
"fx":[
"flag:q53"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_P_fine"
}
]
},
{
"id":"V2_CASA_05_P_Q1_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Io. Claudio non c’entrava.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_M4",
"fx":[
"chiude:V2_CASA_05_P_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_05_P_Q3_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È nato tutto quel giorno.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_M1",
"fx":[
"chiude:V2_CASA_05_P_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_05_P_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Quanti anni avevo con quel soprannome?",
"to":"V2_CASA_05_P_Q2_M6",
"fx":[
"flag:q52"
]
},
{
"t":"Il soprannome è nato quando ho ritirato l’auto?",
"to":"V2_CASA_05_P_Q3_M6",
"fx":[
"flag:q53"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_05_P_fine"
}
]
},
{
"id":"V2_CASA_05_P_Q2_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Eri già adulto. Avevi appena preso l’auto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_M4",
"fx":[
"chiude:V2_CASA_05_P_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_05_P_Q3_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È nato tutto quel giorno.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_M2",
"fx":[
"chiude:V2_CASA_05_P_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_05_P",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"opts":[
{
"t":"Chi mi aveva dato quel soprannome?",
"to":"V2_CASA_05_P_Q1_M7",
"fx":[
"flag:q51"
]
},
{
"t":"Quanti anni avevo con quel soprannome?",
"to":"V2_CASA_05_P_Q2_M7",
"fx":[
"flag:q52"
]
},
{
"t":"Il soprannome è nato quando ho ritirato l’auto?",
"to":"V2_CASA_05_P_Q3_M7",
"fx":[
"flag:q53"
]
}
]
},
{
"id":"V2_CASA_05_P_Q1_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Io. Claudio non c’entrava.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_M6",
"fx":[
"chiude:V2_CASA_05_P_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_05_P_Q2_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Eri già adulto. Avevi appena preso l’auto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_M5",
"fx":[
"chiude:V2_CASA_05_P_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_05_P_Q3_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. È nato tutto quel giorno.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_05_P_fine",
"fx":[
"chiude:V2_CASA_05_P_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_05_P_M3",
"fx":[
"chiude:V2_CASA_05_P_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_05_P_fine",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Adesso hai la risposta. Possiamo smettere con le domande?",
"alt":[
{
"req":"flag:q51",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q52",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q53",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_06_M1",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quante volte avevo visto Claudio?",
"to":"V2_CASA_06_Q1_M1",
"fx":[
"flag:q61"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_fine"
}
]
},
{
"id":"V2_CASA_06_Q1_M1",
"who":"Elena",
"fase":"IV",
"text":"Tre. Non tutti i fine settimana.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_06_M2",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Claudio lo conoscevamo bene?",
"to":"V2_CASA_06_Q2_M2",
"fx":[
"flag:q62"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_fine"
}
]
},
{
"id":"V2_CASA_06_Q2_M2",
"who":"Elena",
"fase":"IV",
"text":"No. È anche per quello che sembra strano.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_06_M3",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quante volte avevo visto Claudio?",
"to":"V2_CASA_06_Q1_M3",
"fx":[
"flag:q61"
]
},
{
"t":"Claudio lo conoscevamo bene?",
"to":"V2_CASA_06_Q2_M3",
"fx":[
"flag:q62"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_fine"
}
]
},
{
"id":"V2_CASA_06_Q1_M3",
"who":"Elena",
"fase":"IV",
"text":"Tre. Non tutti i fine settimana.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_M2",
"fx":[
"chiude:V2_CASA_06_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_06_Q2_M3",
"who":"Elena",
"fase":"IV",
"text":"No. È anche per quello che sembra strano.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_M1",
"fx":[
"chiude:V2_CASA_06_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_06_M4",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Ti sembra una persona che sentivamo ogni giorno?",
"to":"V2_CASA_06_Q3_M4",
"fx":[
"flag:q63"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_fine"
}
]
},
{
"id":"V2_CASA_06_Q3_M4",
"who":"Elena",
"fase":"IV",
"text":"No. Era uno zio quasi sconosciuto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_06_M5",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quante volte avevo visto Claudio?",
"to":"V2_CASA_06_Q1_M5",
"fx":[
"flag:q61"
]
},
{
"t":"Ti sembra una persona che sentivamo ogni giorno?",
"to":"V2_CASA_06_Q3_M5",
"fx":[
"flag:q63"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_fine"
}
]
},
{
"id":"V2_CASA_06_Q1_M5",
"who":"Elena",
"fase":"IV",
"text":"Tre. Non tutti i fine settimana.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_M4",
"fx":[
"chiude:V2_CASA_06_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_06_Q3_M5",
"who":"Elena",
"fase":"IV",
"text":"No. Era uno zio quasi sconosciuto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_M1",
"fx":[
"chiude:V2_CASA_06_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_06_M6",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Claudio lo conoscevamo bene?",
"to":"V2_CASA_06_Q2_M6",
"fx":[
"flag:q62"
]
},
{
"t":"Ti sembra una persona che sentivamo ogni giorno?",
"to":"V2_CASA_06_Q3_M6",
"fx":[
"flag:q63"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_fine"
}
]
},
{
"id":"V2_CASA_06_Q2_M6",
"who":"Elena",
"fase":"IV",
"text":"No. È anche per quello che sembra strano.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_M4",
"fx":[
"chiude:V2_CASA_06_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_06_Q3_M6",
"who":"Elena",
"fase":"IV",
"text":"No. Era uno zio quasi sconosciuto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_M2",
"fx":[
"chiude:V2_CASA_06_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_06",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quante volte avevo visto Claudio?",
"to":"V2_CASA_06_Q1_M7",
"fx":[
"flag:q61"
]
},
{
"t":"Claudio lo conoscevamo bene?",
"to":"V2_CASA_06_Q2_M7",
"fx":[
"flag:q62"
]
},
{
"t":"Ti sembra una persona che sentivamo ogni giorno?",
"to":"V2_CASA_06_Q3_M7",
"fx":[
"flag:q63"
]
}
]
},
{
"id":"V2_CASA_06_Q1_M7",
"who":"Elena",
"fase":"IV",
"text":"Tre. Non tutti i fine settimana.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_M6",
"fx":[
"chiude:V2_CASA_06_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_06_Q2_M7",
"who":"Elena",
"fase":"IV",
"text":"No. È anche per quello che sembra strano.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_M5",
"fx":[
"chiude:V2_CASA_06_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_06_Q3_M7",
"who":"Elena",
"fase":"IV",
"text":"No. Era uno zio quasi sconosciuto.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_fine",
"fx":[
"chiude:V2_CASA_06_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_M3",
"fx":[
"chiude:V2_CASA_06_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_06_fine",
"who":"Elena",
"fase":"IV",
"text":"Adesso sai quello che ti ho risposto, non tutto il resto.",
"alt":[
{
"req":"flag:q61",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q62",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q63",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_06_P_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Quante volte avevo visto Claudio?",
"to":"V2_CASA_06_P_Q1_M1",
"fx":[
"flag:q61"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_P_fine"
}
]
},
{
"id":"V2_CASA_06_P_Q1_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sempre. Ci passavi ogni domenica.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_06_P_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Claudio lo conoscevamo bene?",
"to":"V2_CASA_06_P_Q2_M2",
"fx":[
"flag:q62"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_P_fine"
}
]
},
{
"id":"V2_CASA_06_P_Q2_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Benissimo. Sapevi ogni cosa di lui.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_06_P_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Quante volte avevo visto Claudio?",
"to":"V2_CASA_06_P_Q1_M3",
"fx":[
"flag:q61"
]
},
{
"t":"Claudio lo conoscevamo bene?",
"to":"V2_CASA_06_P_Q2_M3",
"fx":[
"flag:q62"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_P_fine"
}
]
},
{
"id":"V2_CASA_06_P_Q1_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sempre. Ci passavi ogni domenica.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_M2",
"fx":[
"chiude:V2_CASA_06_P_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_06_P_Q2_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Benissimo. Sapevi ogni cosa di lui.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_M1",
"fx":[
"chiude:V2_CASA_06_P_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_06_P_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Ti sembra una persona che sentivamo ogni giorno?",
"to":"V2_CASA_06_P_Q3_M4",
"fx":[
"flag:q63"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_P_fine"
}
]
},
{
"id":"V2_CASA_06_P_Q3_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. Mi chiamava tutte le sere.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_06_P_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Quante volte avevo visto Claudio?",
"to":"V2_CASA_06_P_Q1_M5",
"fx":[
"flag:q61"
]
},
{
"t":"Ti sembra una persona che sentivamo ogni giorno?",
"to":"V2_CASA_06_P_Q3_M5",
"fx":[
"flag:q63"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_P_fine"
}
]
},
{
"id":"V2_CASA_06_P_Q1_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sempre. Ci passavi ogni domenica.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_M4",
"fx":[
"chiude:V2_CASA_06_P_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_06_P_Q3_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. Mi chiamava tutte le sere.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_M1",
"fx":[
"chiude:V2_CASA_06_P_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_06_P_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Claudio lo conoscevamo bene?",
"to":"V2_CASA_06_P_Q2_M6",
"fx":[
"flag:q62"
]
},
{
"t":"Ti sembra una persona che sentivamo ogni giorno?",
"to":"V2_CASA_06_P_Q3_M6",
"fx":[
"flag:q63"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_06_P_fine"
}
]
},
{
"id":"V2_CASA_06_P_Q2_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Benissimo. Sapevi ogni cosa di lui.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_M4",
"fx":[
"chiude:V2_CASA_06_P_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_06_P_Q3_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. Mi chiamava tutte le sere.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_M2",
"fx":[
"chiude:V2_CASA_06_P_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_06_P",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"opts":[
{
"t":"Quante volte avevo visto Claudio?",
"to":"V2_CASA_06_P_Q1_M7",
"fx":[
"flag:q61"
]
},
{
"t":"Claudio lo conoscevamo bene?",
"to":"V2_CASA_06_P_Q2_M7",
"fx":[
"flag:q62"
]
},
{
"t":"Ti sembra una persona che sentivamo ogni giorno?",
"to":"V2_CASA_06_P_Q3_M7",
"fx":[
"flag:q63"
]
}
]
},
{
"id":"V2_CASA_06_P_Q1_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sempre. Ci passavi ogni domenica.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_M6",
"fx":[
"chiude:V2_CASA_06_P_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_06_P_Q2_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Benissimo. Sapevi ogni cosa di lui.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_M5",
"fx":[
"chiude:V2_CASA_06_P_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_06_P_Q3_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. Mi chiamava tutte le sere.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_06_P_fine",
"fx":[
"chiude:V2_CASA_06_P_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_06_P_M3",
"fx":[
"chiude:V2_CASA_06_P_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_06_P_fine",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Adesso hai la risposta. Possiamo smettere con le domande?",
"alt":[
{
"req":"flag:q61",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q62",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q63",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_07_M1",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Che cosa mi aveva regalato Claudio?",
"to":"V2_CASA_07_Q1_M1",
"fx":[
"flag:q71"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_fine"
}
]
},
{
"id":"V2_CASA_07_Q1_M1",
"who":"Elena",
"fase":"IV",
"text":"Un temperino. Me l’hai appena ricordato.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_07_M2",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Nella busta con le chiavi che cosa c’era?",
"to":"V2_CASA_07_Q2_M2",
"fx":[
"flag:q72"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_fine"
}
]
},
{
"id":"V2_CASA_07_Q2_M2",
"who":"Elena",
"fase":"IV",
"text":"Il temperino che ti aveva regalato.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_07_M3",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Che cosa mi aveva regalato Claudio?",
"to":"V2_CASA_07_Q1_M3",
"fx":[
"flag:q71"
]
},
{
"t":"Nella busta con le chiavi che cosa c’era?",
"to":"V2_CASA_07_Q2_M3",
"fx":[
"flag:q72"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_fine"
}
]
},
{
"id":"V2_CASA_07_Q1_M3",
"who":"Elena",
"fase":"IV",
"text":"Un temperino. Me l’hai appena ricordato.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_M2",
"fx":[
"chiude:V2_CASA_07_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_07_Q2_M3",
"who":"Elena",
"fase":"IV",
"text":"Il temperino che ti aveva regalato.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_M1",
"fx":[
"chiude:V2_CASA_07_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_07_M4",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Perché quel temperino non è solo una cosa trovata?",
"to":"V2_CASA_07_Q3_M4",
"fx":[
"flag:q73"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_fine"
}
]
},
{
"id":"V2_CASA_07_Q3_M4",
"who":"Elena",
"fase":"IV",
"text":"Te l’aveva regalato Claudio.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_07_M5",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Che cosa mi aveva regalato Claudio?",
"to":"V2_CASA_07_Q1_M5",
"fx":[
"flag:q71"
]
},
{
"t":"Perché quel temperino non è solo una cosa trovata?",
"to":"V2_CASA_07_Q3_M5",
"fx":[
"flag:q73"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_fine"
}
]
},
{
"id":"V2_CASA_07_Q1_M5",
"who":"Elena",
"fase":"IV",
"text":"Un temperino. Me l’hai appena ricordato.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_M4",
"fx":[
"chiude:V2_CASA_07_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_07_Q3_M5",
"who":"Elena",
"fase":"IV",
"text":"Te l’aveva regalato Claudio.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_M1",
"fx":[
"chiude:V2_CASA_07_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_07_M6",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Nella busta con le chiavi che cosa c’era?",
"to":"V2_CASA_07_Q2_M6",
"fx":[
"flag:q72"
]
},
{
"t":"Perché quel temperino non è solo una cosa trovata?",
"to":"V2_CASA_07_Q3_M6",
"fx":[
"flag:q73"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_fine"
}
]
},
{
"id":"V2_CASA_07_Q2_M6",
"who":"Elena",
"fase":"IV",
"text":"Il temperino che ti aveva regalato.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_M4",
"fx":[
"chiude:V2_CASA_07_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_07_Q3_M6",
"who":"Elena",
"fase":"IV",
"text":"Te l’aveva regalato Claudio.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_M2",
"fx":[
"chiude:V2_CASA_07_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_07",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Che cosa mi aveva regalato Claudio?",
"to":"V2_CASA_07_Q1_M7",
"fx":[
"flag:q71"
]
},
{
"t":"Nella busta con le chiavi che cosa c’era?",
"to":"V2_CASA_07_Q2_M7",
"fx":[
"flag:q72"
]
},
{
"t":"Perché quel temperino non è solo una cosa trovata?",
"to":"V2_CASA_07_Q3_M7",
"fx":[
"flag:q73"
]
}
]
},
{
"id":"V2_CASA_07_Q1_M7",
"who":"Elena",
"fase":"IV",
"text":"Un temperino. Me l’hai appena ricordato.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_M6",
"fx":[
"chiude:V2_CASA_07_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_07_Q2_M7",
"who":"Elena",
"fase":"IV",
"text":"Il temperino che ti aveva regalato.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_M5",
"fx":[
"chiude:V2_CASA_07_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_07_Q3_M7",
"who":"Elena",
"fase":"IV",
"text":"Te l’aveva regalato Claudio.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_fine",
"fx":[
"chiude:V2_CASA_07_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_M3",
"fx":[
"chiude:V2_CASA_07_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_07_fine",
"who":"Elena",
"fase":"IV",
"text":"Adesso sai quello che ti ho risposto, non tutto il resto.",
"alt":[
{
"req":"flag:q71",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q72",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q73",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_07_P_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Che cosa mi aveva regalato Claudio?",
"to":"V2_CASA_07_P_Q1_M1",
"fx":[
"flag:q71"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_P_fine"
}
]
},
{
"id":"V2_CASA_07_P_Q1_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Un accendino. Lo portavi sempre.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_07_P_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Nella busta con le chiavi che cosa c’era?",
"to":"V2_CASA_07_P_Q2_M2",
"fx":[
"flag:q72"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_P_fine"
}
]
},
{
"id":"V2_CASA_07_P_Q2_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Un orologio. Era suo.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_07_P_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Che cosa mi aveva regalato Claudio?",
"to":"V2_CASA_07_P_Q1_M3",
"fx":[
"flag:q71"
]
},
{
"t":"Nella busta con le chiavi che cosa c’era?",
"to":"V2_CASA_07_P_Q2_M3",
"fx":[
"flag:q72"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_P_fine"
}
]
},
{
"id":"V2_CASA_07_P_Q1_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Un accendino. Lo portavi sempre.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_M2",
"fx":[
"chiude:V2_CASA_07_P_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_07_P_Q2_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Un orologio. Era suo.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_M1",
"fx":[
"chiude:V2_CASA_07_P_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_07_P_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Perché quel temperino non è solo una cosa trovata?",
"to":"V2_CASA_07_P_Q3_M4",
"fx":[
"flag:q73"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_P_fine"
}
]
},
{
"id":"V2_CASA_07_P_Q3_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Era del vecchio proprietario che non conoscevi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_07_P_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Che cosa mi aveva regalato Claudio?",
"to":"V2_CASA_07_P_Q1_M5",
"fx":[
"flag:q71"
]
},
{
"t":"Perché quel temperino non è solo una cosa trovata?",
"to":"V2_CASA_07_P_Q3_M5",
"fx":[
"flag:q73"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_P_fine"
}
]
},
{
"id":"V2_CASA_07_P_Q1_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Un accendino. Lo portavi sempre.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_M4",
"fx":[
"chiude:V2_CASA_07_P_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_07_P_Q3_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Era del vecchio proprietario che non conoscevi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_M1",
"fx":[
"chiude:V2_CASA_07_P_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_07_P_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Nella busta con le chiavi che cosa c’era?",
"to":"V2_CASA_07_P_Q2_M6",
"fx":[
"flag:q72"
]
},
{
"t":"Perché quel temperino non è solo una cosa trovata?",
"to":"V2_CASA_07_P_Q3_M6",
"fx":[
"flag:q73"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_07_P_fine"
}
]
},
{
"id":"V2_CASA_07_P_Q2_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Un orologio. Era suo.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_M4",
"fx":[
"chiude:V2_CASA_07_P_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_07_P_Q3_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Era del vecchio proprietario che non conoscevi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_M2",
"fx":[
"chiude:V2_CASA_07_P_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_07_P",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"opts":[
{
"t":"Che cosa mi aveva regalato Claudio?",
"to":"V2_CASA_07_P_Q1_M7",
"fx":[
"flag:q71"
]
},
{
"t":"Nella busta con le chiavi che cosa c’era?",
"to":"V2_CASA_07_P_Q2_M7",
"fx":[
"flag:q72"
]
},
{
"t":"Perché quel temperino non è solo una cosa trovata?",
"to":"V2_CASA_07_P_Q3_M7",
"fx":[
"flag:q73"
]
}
]
},
{
"id":"V2_CASA_07_P_Q1_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Un accendino. Lo portavi sempre.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_M6",
"fx":[
"chiude:V2_CASA_07_P_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_07_P_Q2_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Un orologio. Era suo.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_M5",
"fx":[
"chiude:V2_CASA_07_P_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_07_P_Q3_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Era del vecchio proprietario che non conoscevi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_07_P_fine",
"fx":[
"chiude:V2_CASA_07_P_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_07_P_M3",
"fx":[
"chiude:V2_CASA_07_P_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_07_P_fine",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Adesso hai la risposta. Possiamo smettere con le domande?",
"alt":[
{
"req":"flag:q71",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q72",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q73",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_08_M1",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quante auto potevo scegliere?",
"to":"V2_CASA_08_Q1_M1",
"fx":[
"flag:q81"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_fine"
}
]
},
{
"id":"V2_CASA_08_Q1_M1",
"who":"Elena",
"fase":"IV",
"text":"Una tra sei. Ti sentivi già proprietario di tutte.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_08_M2",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Le altre cinque sono diventate mie?",
"to":"V2_CASA_08_Q2_M2",
"fx":[
"flag:q82"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_fine"
}
]
},
{
"id":"V2_CASA_08_Q2_M2",
"who":"Elena",
"fase":"IV",
"text":"No. Non ti hanno dato un autosalone.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_08_M3",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quante auto potevo scegliere?",
"to":"V2_CASA_08_Q1_M3",
"fx":[
"flag:q81"
]
},
{
"t":"Le altre cinque sono diventate mie?",
"to":"V2_CASA_08_Q2_M3",
"fx":[
"flag:q82"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_fine"
}
]
},
{
"id":"V2_CASA_08_Q1_M3",
"who":"Elena",
"fase":"IV",
"text":"Una tra sei. Ti sentivi già proprietario di tutte.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_M2",
"fx":[
"chiude:V2_CASA_08_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_08_Q2_M3",
"who":"Elena",
"fase":"IV",
"text":"No. Non ti hanno dato un autosalone.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_M1",
"fx":[
"chiude:V2_CASA_08_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_08_M4",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quante auto sto riportando a casa?",
"to":"V2_CASA_08_Q3_M4",
"fx":[
"flag:q83"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_fine"
}
]
},
{
"id":"V2_CASA_08_Q3_M4",
"who":"Elena",
"fase":"IV",
"text":"Una. Una basta già a farti parlare così.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_08_M5",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quante auto potevo scegliere?",
"to":"V2_CASA_08_Q1_M5",
"fx":[
"flag:q81"
]
},
{
"t":"Quante auto sto riportando a casa?",
"to":"V2_CASA_08_Q3_M5",
"fx":[
"flag:q83"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_fine"
}
]
},
{
"id":"V2_CASA_08_Q1_M5",
"who":"Elena",
"fase":"IV",
"text":"Una tra sei. Ti sentivi già proprietario di tutte.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_M4",
"fx":[
"chiude:V2_CASA_08_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_08_Q3_M5",
"who":"Elena",
"fase":"IV",
"text":"Una. Una basta già a farti parlare così.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_M1",
"fx":[
"chiude:V2_CASA_08_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_08_M6",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Le altre cinque sono diventate mie?",
"to":"V2_CASA_08_Q2_M6",
"fx":[
"flag:q82"
]
},
{
"t":"Quante auto sto riportando a casa?",
"to":"V2_CASA_08_Q3_M6",
"fx":[
"flag:q83"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_fine"
}
]
},
{
"id":"V2_CASA_08_Q2_M6",
"who":"Elena",
"fase":"IV",
"text":"No. Non ti hanno dato un autosalone.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_M4",
"fx":[
"chiude:V2_CASA_08_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_08_Q3_M6",
"who":"Elena",
"fase":"IV",
"text":"Una. Una basta già a farti parlare così.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_M2",
"fx":[
"chiude:V2_CASA_08_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_08",
"who":"Elena",
"fase":"IV",
"text":"Che cosa volevi chiedermi?",
"opts":[
{
"t":"Quante auto potevo scegliere?",
"to":"V2_CASA_08_Q1_M7",
"fx":[
"flag:q81"
]
},
{
"t":"Le altre cinque sono diventate mie?",
"to":"V2_CASA_08_Q2_M7",
"fx":[
"flag:q82"
]
},
{
"t":"Quante auto sto riportando a casa?",
"to":"V2_CASA_08_Q3_M7",
"fx":[
"flag:q83"
]
}
]
},
{
"id":"V2_CASA_08_Q1_M7",
"who":"Elena",
"fase":"IV",
"text":"Una tra sei. Ti sentivi già proprietario di tutte.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_M6",
"fx":[
"chiude:V2_CASA_08_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_08_Q2_M7",
"who":"Elena",
"fase":"IV",
"text":"No. Non ti hanno dato un autosalone.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_M5",
"fx":[
"chiude:V2_CASA_08_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_08_Q3_M7",
"who":"Elena",
"fase":"IV",
"text":"Una. Una basta già a farti parlare così.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_fine",
"fx":[
"chiude:V2_CASA_08_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_M3",
"fx":[
"chiude:V2_CASA_08_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_08_fine",
"who":"Elena",
"fase":"IV",
"text":"Adesso sai quello che ti ho risposto, non tutto il resto.",
"alt":[
{
"req":"flag:q81",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q82",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q83",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_CASA_08_P_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Quante auto potevo scegliere?",
"to":"V2_CASA_08_P_Q1_M1",
"fx":[
"flag:q81"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_P_fine"
}
]
},
{
"id":"V2_CASA_08_P_Q1_M1",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Tutte e sei. Devi solo ritirarle.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q1_M1"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q1_M1"
]
}
]
},
{
"id":"V2_CASA_08_P_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Le altre cinque sono diventate mie?",
"to":"V2_CASA_08_P_Q2_M2",
"fx":[
"flag:q82"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_P_fine"
}
]
},
{
"id":"V2_CASA_08_P_Q2_M2",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. Hai lasciato lì le chiavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q2_M2"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q2_M2"
]
}
]
},
{
"id":"V2_CASA_08_P_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Quante auto potevo scegliere?",
"to":"V2_CASA_08_P_Q1_M3",
"fx":[
"flag:q81"
]
},
{
"t":"Le altre cinque sono diventate mie?",
"to":"V2_CASA_08_P_Q2_M3",
"fx":[
"flag:q82"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_P_fine"
}
]
},
{
"id":"V2_CASA_08_P_Q1_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Tutte e sei. Devi solo ritirarle.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q1_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_M2",
"fx":[
"chiude:V2_CASA_08_P_Q1_M3"
]
}
]
},
{
"id":"V2_CASA_08_P_Q2_M3",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. Hai lasciato lì le chiavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q2_M3"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_M1",
"fx":[
"chiude:V2_CASA_08_P_Q2_M3"
]
}
]
},
{
"id":"V2_CASA_08_P_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Quante auto sto riportando a casa?",
"to":"V2_CASA_08_P_Q3_M4",
"fx":[
"flag:q83"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_P_fine"
}
]
},
{
"id":"V2_CASA_08_P_Q3_M4",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sei. Le altre ti seguono.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q3_M4"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q3_M4"
]
}
]
},
{
"id":"V2_CASA_08_P_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Quante auto potevo scegliere?",
"to":"V2_CASA_08_P_Q1_M5",
"fx":[
"flag:q81"
]
},
{
"t":"Quante auto sto riportando a casa?",
"to":"V2_CASA_08_P_Q3_M5",
"fx":[
"flag:q83"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_P_fine"
}
]
},
{
"id":"V2_CASA_08_P_Q1_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Tutte e sei. Devi solo ritirarle.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q1_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_M4",
"fx":[
"chiude:V2_CASA_08_P_Q1_M5"
]
}
]
},
{
"id":"V2_CASA_08_P_Q3_M5",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sei. Le altre ti seguono.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q3_M5"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_M1",
"fx":[
"chiude:V2_CASA_08_P_Q3_M5"
]
}
]
},
{
"id":"V2_CASA_08_P_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"req":"flag:ev_voce_imitata",
"opts":[
{
"t":"Le altre cinque sono diventate mie?",
"to":"V2_CASA_08_P_Q2_M6",
"fx":[
"flag:q82"
]
},
{
"t":"Quante auto sto riportando a casa?",
"to":"V2_CASA_08_P_Q3_M6",
"fx":[
"flag:q83"
]
},
{
"t":"Per ora torno ai messaggi.",
"to":"V2_CASA_08_P_fine"
}
]
},
{
"id":"V2_CASA_08_P_Q2_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. Hai lasciato lì le chiavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q2_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_M4",
"fx":[
"chiude:V2_CASA_08_P_Q2_M6"
]
}
]
},
{
"id":"V2_CASA_08_P_Q3_M6",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sei. Le altre ti seguono.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q3_M6"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_M2",
"fx":[
"chiude:V2_CASA_08_P_Q3_M6"
]
}
]
},
{
"id":"V2_CASA_08_P",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Chiedimi quello che vuoi. Poi vieni a prendermi.",
"opts":[
{
"t":"Quante auto potevo scegliere?",
"to":"V2_CASA_08_P_Q1_M7",
"fx":[
"flag:q81"
]
},
{
"t":"Le altre cinque sono diventate mie?",
"to":"V2_CASA_08_P_Q2_M7",
"fx":[
"flag:q82"
]
},
{
"t":"Quante auto sto riportando a casa?",
"to":"V2_CASA_08_P_Q3_M7",
"fx":[
"flag:q83"
]
}
]
},
{
"id":"V2_CASA_08_P_Q1_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Tutte e sei. Devi solo ritirarle.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q1_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_M6",
"fx":[
"chiude:V2_CASA_08_P_Q1_M7"
]
}
]
},
{
"id":"V2_CASA_08_P_Q2_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sì. Hai lasciato lì le chiavi.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q2_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_M5",
"fx":[
"chiude:V2_CASA_08_P_Q2_M7"
]
}
]
},
{
"id":"V2_CASA_08_P_Q3_M7",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Sei. Le altre ti seguono.",
"opts":[
{
"t":"Lo tengo.",
"to":"V2_CASA_08_P_fine",
"fx":[
"chiude:V2_CASA_08_P_Q3_M7"
]
},
{
"t":"Un’altra.",
"to":"V2_CASA_08_P_M3",
"fx":[
"chiude:V2_CASA_08_P_Q3_M7"
]
}
]
},
{
"id":"V2_CASA_08_P_fine",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Adesso hai la risposta. Possiamo smettere con le domande?",
"alt":[
{
"req":"flag:q81",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q82",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
},
{
"req":"flag:q83",
"text":"Quel dettaglio te l’ho già detto. Ora leggi il resto."
}
]
},
{
"id":"V2_VICINO_01",
"who":"Elena",
"fase":"IV",
"text":"Hai chiesto al vicino di controllare? Sono alla porta, qui a casa.",
"opts":[
{
"t":"Sì. Aspetto che ti abbia vista, non una supposizione.",
"to":"V2_VICINO_02"
},
{
"t":"Voglio sapere che cosa ha controllato di persona.",
"to":"V2_VICINO_03"
}
]
},
{
"id":"V2_VICINO_02",
"who":"Elena",
"fase":"IV",
"text":"Mi ha vista alla porta e ha aspettato che gli rispondessi. Non mi ha cercata su una mappa.",
"opts":[
{
"t":"Allora posso distinguere questo controllo dalla chiamata.",
"to":"V2_VICINO_04"
},
{
"t":"Aspetto anche la sua conferma sul recapito indipendente.",
"to":"V2_VICINO_05"
}
]
},
{
"id":"V2_VICINO_03",
"who":"Elena",
"fase":"IV",
"text":"È arrivato dal suo appartamento. Non gli ho dato una posizione da seguire.",
"opts":[
{
"t":"Aspetto il suo riscontro diretto.",
"to":"V2_VICINO_05"
},
{
"t":"Non gli chiedo di sapere dove sono io.",
"to":"V2_VICINO_04"
}
]
},
{
"id":"V2_VICINO_04",
"who":"Elena",
"fase":"IV",
"text":"Non sono andata in macchina a cercarti. Ora sai da dove ti sto scrivendo.",
"opts":[
{
"t":"Completo il confronto con il vicino.",
"to":"V2_VICINO_05"
},
{
"t":"Aspetto la sua risposta diretta, senza riempirla io.",
"to":"V2_VICINO_05"
}
]
},
{
"id":"V2_VICINO_05",
"who":"Elena",
"fase":"IV",
"text":"La sua conferma è sul recapito che avevi già. Ti ha descritto la scena da qui.",
"opts":[
{
"t":"Vale per questa richiesta.",
"to":"V2_VICINO_06",
"fx":[
"flag:elena_verificata",
"cnt:conoscenza+1"
]
},
{
"t":"Per adesso, non per sempre.",
"to":"V2_VICINO_06",
"fx":[
"flag:elena_verificata",
"cnt:conoscenza+1"
]
}
]
},
{
"id":"V2_VICINO_06",
"who":"Elena",
"fase":"IV",
"text":"Bene. Adesso possiamo smettere di indovinare chi manca. Io sono qui.",
"alt":[
{
"req":"flag:elena_verificata",
"text":"Controllo fatto adesso. Non vale per ogni voce futura."
}
]
},
{
"id":"V2_MARCO_costo_01",
"who":"Rosa",
"fase":"V",
"text":"Per portare Marco devi scegliere prima che cosa lasciare. Nessun costo nascosto dopo.",
"opts":[
{
"t":"Dimmi tutto prima che gli faccia posto.",
"to":"V2_MARCO_costo_02"
},
{
"t":"Non gli prometto ancora di salire.",
"to":"V2_MARCO_costo_02"
}
]
},
{
"id":"V2_MARCO_costo_02",
"who":"Rosa",
"fase":"V",
"text":"Il carico: rinunci al lavoro in corso e alla paga. Marco sale, la consegna finisce qui.",
"opts":[
{
"t":"Perdo anche la paga. Ho capito.",
"to":"V2_MARCO_costo_03"
},
{
"t":"Non è solo spostare una scatola.",
"to":"V2_MARCO_costo_03"
}
]
},
{
"id":"V2_MARCO_costo_03",
"who":"Rosa",
"fase":"V",
"text":"La copia di una prova: la lasci a bordo della sua auto. Livia conserva l’originale.",
"opts":[
{
"t":"La copia può restare. L’originale è al sicuro.",
"to":"V2_MARCO_costo_04"
},
{
"t":"Se la lascio, dovrò riascoltare da Livia.",
"to":"V2_MARCO_costo_04"
}
]
},
{
"id":"V2_MARCO_costo_04",
"who":"Rosa",
"fase":"V",
"text":"Oppure spendi una lampada in più: tieni carico e copia, ma parti con meno margine.",
"opts":[
{
"t":"Una lampada in meno per fare la strada.",
"to":"V2_MARCO_costo_05"
},
{
"t":"Tenermi tutto costa tempo. Ho capito.",
"to":"V2_MARCO_costo_05"
}
]
},
{
"id":"V2_MARCO_costo_05",
"who":"Rosa",
"fase":"V",
"text":"Decidilo adesso. Se non hai un lavoro, il costo del carico non esiste.",
"opts":[
{
"t":"Lascio carico e paga.",
"to":"V2_MARCO_costo_06",
"fx":[
"flag:mc_carico"
],
"req":"flag:ev_marco_carico"
},
{
"t":"Lascio la copia. La recupererò da Livia.",
"to":"V2_MARCO_costo_06",
"fx":[
"flag:mc_copia"
]
},
{
"t":"Tengo le cose. Spendo una lampada in più.",
"to":"V2_MARCO_costo_06",
"fx":[
"flag:mc_lampada"
]
}
]
},
{
"id":"V2_MARCO_costo_06",
"who":"Rosa",
"fase":"V",
"text":"Bene. Adesso il rischio ha un nome. Marco non deve indovinarlo mentre sali di giri.",
"alt":[
{
"req":"flag:mc_carico",
"text":"Marco sale. Il lavoro è perso. Non lo ritrovi completato in bacheca."
},
{
"req":"flag:mc_copia",
"text":"Marco sale. La copia non è con te; l’originale resta da Livia."
},
{
"req":"flag:mc_lampada",
"text":"Marco sale. Una lampada è già spesa: il margine di guida è minore."
}
]
},
{
"id":"V2_FAL_1_01",
"who":"Rosa",
"fase":"III",
"text":"L’ultima lampada è spenta. Non buttare la macchina contro la chiusura.",
"opts":[
{
"t":"Ho staccato il piede. Sono fermo.",
"to":"V2_FAL_1_02"
},
{
"t":"La luce è finita. Non passo.",
"to":"V2_FAL_1_02"
}
]
},
{
"id":"V2_FAL_1_02",
"who":"Rosa",
"fase":"III",
"text":"Sei al rifugio. La copia del nastro non è più con te.",
"opts":[
{
"t":"Ho perso proprio il nastro.",
"to":"V2_FAL_1_03"
},
{
"t":"Mi resta quello che ricordo. Poco.",
"to":"V2_FAL_1_03"
}
]
},
{
"id":"V2_FAL_1_03",
"who":"Rosa",
"fase":"III",
"text":"Livia ha ancora l’originale. Ci vuole un altro ascolto, non un’altra incursione.",
"opts":[
{
"t":"Chiederò a Livia di riascoltarlo.",
"to":"V2_FAL_1_04",
"fx":[
"flag:ev_incursione_1_conclusa"
]
},
{
"t":"Mi serve un minuto.",
"to":"V2_FAL_1_04",
"fx":[
"flag:ev_incursione_1_conclusa"
]
}
]
},
{
"id":"V2_FAL_1_04",
"who":"Rosa",
"fase":"III",
"text":"Questo passaggio è concluso. Adesso prepariamo il ritorno da quello che resta."
},
{
"id":"V2_FAL_2_01",
"who":"Rosa",
"fase":"V",
"text":"Sei al rifugio. Marco non è uscito con te.",
"opts":[
{
"t":"Il sedile è vuoto. Ho continuato a guardarlo.",
"to":"V2_FAL_2_02"
},
{
"t":"Sono uscito. Lui no.",
"to":"V2_FAL_2_02"
}
]
},
{
"id":"V2_FAL_2_02",
"who":"Rosa",
"fase":"V",
"text":"Non lo chiamo salvo. Non gli assegno neanche una morte che non abbiamo visto.",
"opts":[
{
"t":"Non so cosa gli sia successo.",
"to":"V2_FAL_2_03"
},
{
"t":"Vorrei tornare. So che adesso sbaglierei ancora.",
"to":"V2_FAL_2_03"
}
]
},
{
"id":"V2_FAL_2_03",
"who":"Rosa",
"fase":"V",
"text":"Può ricomparire, ma non basterà riconoscere il numero per sapere chi scrive.",
"opts":[
{
"t":"Se mi scrive, controllo. Anche se ci spero.",
"to":"V2_FAL_2_04"
},
{
"t":"Non userò la sua morte per chiudere il discorso.",
"to":"V2_FAL_2_04"
}
]
},
{
"id":"V2_FAL_2_04",
"who":"Rosa",
"fase":"V",
"text":"Sono arrabbiata. Non ti chiedo di tornare dentro per cancellare questa corsa."
},
{
"id":"V2_FAL_3_01",
"who":"Livia",
"fase":"V",
"text":"Non siete arrivati al punto d’attesa in tempo.",
"opts":[
{
"t":"Ho visto spegnersi l’ultima luce.",
"to":"V2_FAL_3_02"
},
{
"t":"Non ce l’ho fatta. È tutto quello che so.",
"to":"V2_FAL_3_02"
}
]
},
{
"id":"V2_FAL_3_02",
"who":"Livia",
"fase":"V",
"text":"Ottavio non è stato recuperato. Non lo facciamo diventare salvo per chiudere la riga.",
"opts":[
{
"t":"Non ti scrivo che è salvo.",
"to":"V2_FAL_3_03"
},
{
"t":"Avrei voluto mandarti un altro messaggio.",
"to":"V2_FAL_3_03"
}
]
},
{
"id":"V2_FAL_3_03",
"who":"Livia",
"fase":"V",
"text":"Non ti chiedo una versione meno dolorosa. Dimmi quello che hai visto.",
"opts":[
{
"t":"Ti dico da dove l’ho perso.",
"to":"V2_FAL_3_04"
},
{
"t":"Vado piano. Voglio ricordare senza aggiungere.",
"to":"V2_FAL_3_04"
}
]
},
{
"id":"V2_FAL_3_04",
"who":"Livia",
"fase":"V",
"text":"Gli originali restano qui. Questa occasione è persa, non tutte le risposte."
},
{
"id":"V2_FAL_4_01",
"who":"Rosa",
"fase":"V",
"text":"Sei al rifugio. Il varco è rimasto aperto.",
"opts":[
{
"t":"Mi sono voltato. Era ancora aperto.",
"to":"V2_FAL_4_02"
},
{
"t":"Sono fuori dal passaggio. Lo vedo.",
"to":"V2_FAL_4_02"
}
]
},
{
"id":"V2_FAL_4_02",
"who":"Rosa",
"fase":"V",
"text":"Non significa che la presenza sia già uscita. Manca ancora chi la accompagna.",
"opts":[
{
"t":"Non ho accompagnato nessuno.",
"to":"V2_FAL_4_03"
},
{
"t":"Controllo chi è uscito con me.",
"to":"V2_FAL_4_03"
}
]
},
{
"id":"V2_FAL_4_03",
"who":"Rosa",
"fase":"V",
"text":"Possiamo tentare la richiusura. Prima guardiamo che cosa costa.",
"opts":[
{
"t":"Guardiamo il costo della richiusura.",
"to":"V2_FAL_4_04",
"fx":[
"cnt:varchi+1"
]
},
{
"t":"Non ci torno per fingere che non sia successo.",
"to":"V2_FAL_4_04",
"fx":[
"cnt:varchi+1"
]
}
]
},
{
"id":"V2_FAL_4_04",
"who":"Rosa",
"fase":"V",
"text":"Non la chiamiamo una porta chiusa solo perché abbiamo smesso di guardarla."
},
{
"id":"V2_USCITA_01",
"who":"Rosa",
"fase":"V",
"text":"Prima di chiamarla uscita, confronta il particolare dello svincolo.",
"opts":[
{
"t":"Confronto il foglio della Polo.",
"to":"V2_USCITA_02"
},
{
"t":"Prima guardo il particolare che ritorna.",
"to":"V2_USCITA_02"
}
]
},
{
"id":"V2_USCITA_02",
"who":"Rosa",
"fase":"V",
"text":"Nelle diramazioni tornava lo stesso segno, anche quando cambiava paese.",
"opts":[
{
"t":"La forma coincide. Adesso guardo dove porta.",
"to":"V2_USCITA_03"
},
{
"t":"Non mi basta che sia comparso un nome nuovo.",
"to":"V2_USCITA_03"
}
]
},
{
"id":"V2_USCITA_03",
"who":"Rosa",
"fase":"V",
"text":"Questo è lo svincolo autentico. Non è la porta che Irene tiene chiusa.",
"alt":[
{
"req":"flag:porta_nota",
"text":"Hai già riconosciuto la porta. Questo svincolo è un’altra cosa."
}
],
"opts":[
{
"t":"Posso uscire senza aprire la porta.",
"to":"V2_USCITA_04"
},
{
"t":"Se parto, chi resta non viene con me.",
"to":"V2_USCITA_04"
}
]
},
{
"id":"V2_USCITA_04",
"who":"Rosa",
"fase":"V",
"text":"Compare dopo il secondo passaggio e le prove già confrontate. Non per un nome nuovo.",
"opts":[
{
"t":"Ho confrontato le tre cose. Voglio tornare.",
"to":"V2_USCITA_05"
},
{
"t":"Ora so dov’è. Devo ancora scegliere.",
"to":"V2_USCITA_05"
}
]
},
{
"id":"V2_USCITA_05",
"who":"Rosa",
"fase":"V",
"text":"Se lo prendi, esci da solo. Le ricerche rimaste aperte non diventano risolte.",
"opts":[
{
"t":"Non dirò che ho salvato chi è rimasto.",
"to":"V2_USCITA_06"
},
{
"t":"A Elena posso scrivere soltanto che torno.",
"to":"V2_USCITA_06"
}
]
},
{
"id":"V2_USCITA_06",
"who":"Rosa",
"fase":"V",
"text":"Puoi scegliere di tornare senza fingere di avere finito tutto."
},
{
"id":"V2_GUARDIA_01",
"who":"Rosa",
"fase":"V",
"text":"Guarda lo scambio con Livia. Non te lo sto ricostruendo a memoria.",
"opts":[
{
"t":"Apro il messaggio, quello vero.",
"to":"V2_GUARDIA_02"
},
{
"t":"Voglio leggere il prima e il dopo.",
"to":"V2_GUARDIA_02"
}
]
},
{
"id":"V2_GUARDIA_02",
"who":"Rosa",
"fase":"V",
"text":"Prima mi ha scritto: Dì a Rosa di aspettare. Il messaggio è ancora qui.",
"opts":[
{
"t":"Il tuo nome è ancora scritto lì.",
"to":"V2_GUARDIA_03"
},
{
"t":"Livia sapeva con chi stavi parlando.",
"to":"V2_GUARDIA_03"
}
]
},
{
"id":"V2_GUARDIA_03",
"who":"Rosa",
"fase":"V",
"text":"Adesso chiede: A chi stavi scrivendo? Non le manca il messaggio: le manca il nome.",
"opts":[
{
"t":"Le faccio rileggere il suo messaggio.",
"to":"V2_GUARDIA_04"
},
{
"t":"Non ha perso il testo. Ha perso te.",
"to":"V2_GUARDIA_04"
}
]
},
{
"id":"V2_GUARDIA_04",
"who":"Rosa",
"fase":"V",
"text":"Non tutti insieme, non in un istante. Comincia così, il posto che perdi fuori.",
"opts":[
{
"t":"E tu hai continuato a restare.",
"to":"V2_GUARDIA_05"
},
{
"t":"Non so se riesco a farmi dimenticare.",
"to":"V2_GUARDIA_05"
}
]
},
{
"id":"V2_GUARDIA_05",
"who":"Rosa",
"fase":"V",
"text":"Puoi chiederglielo direttamente. I fogli restano, non è l’archivio che cambia.",
"opts":[
{
"t":"Voglio vedere anche la risposta dal lato di Livia.",
"to":"V2_GUARDIA_06"
},
{
"t":"Prima di promettere devo capire chi torna.",
"to":"V2_GUARDIA_06"
}
]
},
{
"id":"V2_GUARDIA_06",
"who":"Rosa",
"fase":"V",
"text":"Se resti, devi sapere chi fai uscire e quale posto stai lasciando vuoto."
},
{
"id":"V2_VARCO_01",
"who":"Rosa",
"fase":"V",
"text":"Questa è un’apertura. Non un modo di leggere meglio il cartello.",
"opts":[
{
"t":"Prima guardo che cosa significa aprire.",
"to":"V2_VARCO_02"
},
{
"t":"Non apro. Voglio capire la richiusura.",
"to":"V2_VARCO_03"
}
]
},
{
"id":"V2_VARCO_02",
"who":"Rosa",
"fase":"V",
"text":"Se apri, il passaggio esiste. La presenza deve ancora essere accompagnata.",
"opts":[
{
"t":"Guardo il costo prima di modificare il passaggio.",
"to":"V2_VARCO_04"
},
{
"t":"Tengo distinta questa scelta dalle altre.",
"to":"V2_VARCO_05"
}
]
},
{
"id":"V2_VARCO_03",
"who":"Rosa",
"fase":"V",
"text":"Se rifiuti, resta chiuso. Una telefonata arrabbiata non può aprirlo al posto tuo.",
"opts":[
{
"t":"Guardo il costo prima di modificare il passaggio.",
"to":"V2_VARCO_04"
},
{
"t":"Tengo distinta questa scelta dalle altre.",
"to":"V2_VARCO_05"
}
]
},
{
"id":"V2_VARCO_04",
"who":"Rosa",
"fase":"V",
"text":"Richiudere non è lo stesso gesto che rifiutare prima. Il costo va guardato adesso.",
"opts":[
{
"t":"Decido soltanto dopo aver visto il costo.",
"to":"V2_VARCO_05"
},
{
"t":"Per ora non modifico il passaggio.",
"to":"V2_VARCO_06",
"fx":[
"flag:vc_rifiuto"
]
}
]
},
{
"id":"V2_VARCO_05",
"who":"Rosa",
"fase":"V",
"text":"La scelta resta distinta dalla promessa fatta a Rosa e dalle risposte al telefono.",
"opts":[
{
"t":"Apro il varco. Non accompagno ancora nessuno.",
"to":"V2_VARCO_06",
"fx":[
"flag:vc_apro",
"cnt:varchi+1"
]
},
{
"t":"Rifiuto l’apertura: resta chiuso.",
"to":"V2_VARCO_06",
"fx":[
"flag:vc_rifiuto"
]
},
{
"t":"Richiudo il varco.",
"to":"V2_VARCO_06",
"fx":[
"flag:vc_richiudo",
"cnt:varchi+1"
],
"req":"flag:vc_richiudibile"
}
]
},
{
"id":"V2_VARCO_06",
"who":"Rosa",
"fase":"V",
"text":"Abbiamo uno stato attuale. Non lo faccio diventare un finale con una frase.",
"alt":[
{
"req":"flag:vc_richiudo",
"text":"Richiudi. Il costo resta quello che hai visto prima del gesto."
},
{
"req":"flag:vc_apro",
"text":"Il varco è aperto. Non è ancora un ritorno accompagnato."
},
{
"req":"flag:vc_rifiuto",
"text":"Resta chiuso. La voce insiste, ma non lo apre per te."
}
]
},
{
"id":"V2_ELE_n1_01",
"who":"Elena",
"fase":"I",
"text":"Pasta ha camminato sulla tastiera. Aveva un aggiornamento più lungo del tuo.",
"opts":[
{
"t":"Licenzialo. Quel figlio di puttana scrive meglio di me.",
"to":"V2_ELE_n1_02"
},
{
"t":"Una riga inutile mi farebbe bene.",
"to":"V2_ELE_n1_03"
}
]
},
{
"id":"V2_ELE_n1_02",
"who":"Elena",
"fase":"I",
"text":"Non si capiva un cazzo, ma almeno non finiva con tutto bene.",
"opts":[
{
"t":"Due parentesi e una zampa: la mia autobiografia.",
"to":"V2_ELE_n1_04"
},
{
"t":"Mandami la versione corretta da te.",
"to":"V2_ELE_n1_05"
}
]
},
{
"id":"V2_ELE_n1_03",
"who":"Elena",
"fase":"I",
"text":"Lo cancello. Non voglio abituarti a conversazioni migliori delle mie.",
"opts":[
{
"t":"Non devo rendere utile ogni messaggio.",
"to":"V2_ELE_n1_04"
},
{
"t":"Oggi posso parlare anche di niente.",
"to":"V2_ELE_n1_06"
}
]
},
{
"id":"V2_ELE_n1_04",
"who":"Elena",
"fase":"I",
"text":"Puoi mandare anche una riga inutile. Non mi pagano per smistarti le emergenze.",
"opts":[
{
"t":"Ti mando un saluto senza una richiesta sotto.",
"to":"V2_ELE_n1_05"
},
{
"t":"Ti lascio scegliere l’argomento per una volta.",
"to":"V2_ELE_n1_06"
}
]
},
{
"id":"V2_ELE_n1_05",
"who":"Elena",
"fase":"I",
"text":"Va bene. Pasta è stato promosso a collega e io resto tua sorella.",
"alt":[
{
"req":"flag:elena_difende_pasta",
"text":"Il gatto ha l’avvocato. Non devi essere utile anche a me."
}
]
},
{
"id":"V2_ELE_n1_06",
"who":"Elena",
"fase":"I",
"text":"Allora oggi niente aggiornamenti obbligatori. Solo una chat normale."
},
{
"id":"V2_ELE_n2_01",
"who":"Elena",
"fase":"II",
"text":"Quando scriviamo dopo, intendi dopo davvero o sparisco con una parola educata?",
"opts":[
{
"t":"Dopo è il cassetto dove infilo le cose che mi pesano.",
"to":"V2_ELE_n2_02"
},
{
"t":"Adesso mi serve spazio, non un orario.",
"to":"V2_ELE_n2_03"
}
]
},
{
"id":"V2_ELE_n2_02",
"who":"Elena",
"fase":"II",
"text":"Chiedo per entrambi. Non ho voglia di fare la polizia dei tuoi orari.",
"opts":[
{
"t":"Ti dico che non so quando.",
"to":"V2_ELE_n2_04"
},
{
"t":"Non ti metto in attesa mentre fingo di organizzarmi.",
"to":"V2_ELE_n2_05"
}
]
},
{
"id":"V2_ELE_n2_03",
"who":"Elena",
"fase":"II",
"text":"Se ti serve spazio, scrivi spazio. Capisco anche quello.",
"opts":[
{
"t":"Spazio. Ecco, l’ho scritto. Fa un po’ schifo.",
"to":"V2_ELE_n2_04"
},
{
"t":"Non è per mandarti via.",
"to":"V2_ELE_n2_06"
}
]
},
{
"id":"V2_ELE_n2_04",
"who":"Elena",
"fase":"II",
"text":"Possiamo smettere di usare un orario come una promessa che non sentiamo.",
"opts":[
{
"t":"Ti scrivo quando ho qualcosa da condividere.",
"to":"V2_ELE_n2_05"
},
{
"t":"Per oggi mi fermo qui.",
"to":"V2_ELE_n2_06"
}
]
},
{
"id":"V2_ELE_n2_05",
"who":"Elena",
"fase":"II",
"text":"Va bene. Il dopo rimane aperto, non diventa una sala d’attesa."
},
{
"id":"V2_ELE_n2_06",
"who":"Elena",
"fase":"II",
"text":"Allora ti lascio spazio. Il primo messaggio lo mandi tu quando puoi esserci."
},
{
"id":"V2_ELE_n3_01",
"who":"Elena",
"fase":"II",
"text":"La foto che volevi farmi vedere è diventata un servizio fotografico?",
"opts":[
{
"t":"Te la mando com’è, senza prepararla.",
"to":"V2_ELE_n3_02",
"fx":[
"flag:en3"
]
},
{
"t":"Oggi mi pesa perfino fare una foto.",
"to":"V2_ELE_n3_03"
}
]
},
{
"id":"V2_ELE_n3_02",
"who":"Elena",
"fase":"II",
"text":"Non sistemare tutto prima. Non devo decidere se comprare la tua macchina.",
"opts":[
{
"t":"Tolgo solo la scritta affare imperdibile.",
"to":"V2_ELE_n3_04"
},
{
"t":"Ti faccio vedere anche quello che non mi convince.",
"to":"V2_ELE_n3_05"
}
]
},
{
"id":"V2_ELE_n3_03",
"who":"Elena",
"fase":"II",
"text":"Se oggi non vuoi mandarla, dimmelo. Non la trasformiamo in un altro compito.",
"opts":[
{
"t":"Non te la mando oggi. Senza scuse strane.",
"to":"V2_ELE_n3_04"
},
{
"t":"Mi dai tempo senza dovermi ricordare la promessa?",
"to":"V2_ELE_n3_06"
}
]
},
{
"id":"V2_ELE_n3_04",
"who":"Elena",
"fase":"II",
"text":"Una cosa vera va bene anche se non ti fa fare bella figura.",
"opts":[
{
"t":"Non devo venderti una scelta perfetta.",
"to":"V2_ELE_n3_05"
},
{
"t":"Non ti faccio fare anche da perito.",
"to":"V2_ELE_n3_06"
}
]
},
{
"id":"V2_ELE_n3_05",
"who":"Elena",
"fase":"II",
"text":"Ecco. Almeno posso prenderla in giro per il motivo giusto.",
"alt":[
{
"req":"flag:en3",
"text":"Mi hai mandato la foto com’è. Meglio di un annuncio."
}
]
},
{
"id":"V2_ELE_n3_06",
"who":"Elena",
"fase":"II",
"text":"Va bene. La foto resta una possibilità, non un debito."
},
{
"id":"V2_ELE_n4_01",
"who":"Elena",
"fase":"III",
"text":"La scusa di prima vale ancora anche se oggi sono io quella nervosa?",
"opts":[
{
"t":"Vale. La scusa non era un buono per fare lo stronzo.",
"to":"V2_ELE_n4_02"
},
{
"t":"Se vuoi fermarti, non lo prendo come una vendetta.",
"to":"V2_ELE_n4_03"
}
]
},
{
"id":"V2_ELE_n4_02",
"who":"Elena",
"fase":"III",
"text":"Non ti restituisco la frase cattiva per fare pari. Però mi serviva chiedertelo.",
"opts":[
{
"t":"Ti leggo. Oggi niente tribunale dei coglioni.",
"to":"V2_ELE_n4_04"
},
{
"t":"Posso anche chiederti una pausa.",
"to":"V2_ELE_n4_05"
}
]
},
{
"id":"V2_ELE_n4_03",
"who":"Elena",
"fase":"III",
"text":"Puoi dirmi di fermarmi prima che ricominciamo a risponderci male.",
"opts":[
{
"t":"Te lo dico prima di sbottare.",
"to":"V2_ELE_n4_04"
},
{
"t":"Oggi mi fermo qui, senza sparire per dispetto.",
"to":"V2_ELE_n4_06"
}
]
},
{
"id":"V2_ELE_n4_04",
"who":"Elena",
"fase":"III",
"text":"Non dobbiamo vincere la serata per volerci ancora parlare.",
"opts":[
{
"t":"Non devo avere ragione per restare nella chat.",
"to":"V2_ELE_n4_05"
},
{
"t":"Riprendiamo dopo senza un conto da saldare.",
"to":"V2_ELE_n4_06"
}
]
},
{
"id":"V2_ELE_n4_05",
"who":"Elena",
"fase":"III",
"text":"Va bene. Oggi comincio io con sono stanca.",
"alt":[
{
"req":"flag:elena_scuse",
"text":"Prima hai chiesto scusa. Oggi posso farlo io, senza pareggi."
}
]
},
{
"id":"V2_ELE_n4_06",
"who":"Elena",
"fase":"III",
"text":"Allora fermiamoci senza lasciare una punizione nascosta nel silenzio."
},
{
"id":"V2_ELE_n5_01",
"who":"Elena",
"fase":"III",
"text":"Tre incontri con Claudio. Non devi ricostruire una vita per avere diritto al temperino.",
"opts":[
{
"t":"Ricordo il regalo. Il resto non voglio inventarlo.",
"to":"V2_ELE_n5_02"
},
{
"t":"Mi sento strano ad avere così poco da raccontare.",
"to":"V2_ELE_n5_03"
}
]
},
{
"id":"V2_ELE_n5_02",
"who":"Elena",
"fase":"III",
"text":"Puoi ricordare poco. Non significa che quel poco sia finto.",
"opts":[
{
"t":"Lo tengo senza aggiungere una storia.",
"to":"V2_ELE_n5_04"
},
{
"t":"Il vuoto lo lascio. Mi fa venire voglia di barare.",
"to":"V2_ELE_n5_05"
}
]
},
{
"id":"V2_ELE_n5_03",
"who":"Elena",
"fase":"III",
"text":"Se una cosa non la sai, non devi prenderla in prestito da un racconto bello.",
"opts":[
{
"t":"Posso fermarmi a quello che c’è.",
"to":"V2_ELE_n5_04"
},
{
"t":"Mi aiuta che tu lo dica così.",
"to":"V2_ELE_n5_06"
}
]
},
{
"id":"V2_ELE_n5_04",
"who":"Elena",
"fase":"III",
"text":"A me basta che mi dici quale pezzo ricordi davvero.",
"opts":[
{
"t":"È un pezzo piccolo, ma è mio.",
"to":"V2_ELE_n5_05"
},
{
"t":"Non completo il resto per farmi perdonare.",
"to":"V2_ELE_n5_06"
}
]
},
{
"id":"V2_ELE_n5_05",
"who":"Elena",
"fase":"III",
"text":"Va bene. Restiamo a quello. Non ti chiedo di diventare suo figlio per capirlo."
},
{
"id":"V2_ELE_n5_06",
"who":"Elena",
"fase":"III",
"text":"Allora il temperino resta un regalo, non un esame su quanto gli volevi bene."
},
{
"id":"V2_ELE_n6_01",
"who":"Elena",
"fase":"IV",
"text":"Prima mi hai chiesto di non domandarti altro. Vale ancora?",
"opts":[
{
"t":"Non vale più. Voglio parlarti.",
"to":"V2_ELE_n6_02",
"fx":[
"flag:en6"
]
},
{
"t":"Vale ancora. Te lo chiedo senza arrabbiarmi.",
"to":"V2_ELE_n6_03"
}
]
},
{
"id":"V2_ELE_n6_02",
"who":"Elena",
"fase":"IV",
"text":"Se sì, smetto. Non voglio farti guadagnare il silenzio rispondendo bene.",
"opts":[
{
"t":"Grazie per avermelo chiesto una volta sola.",
"to":"V2_ELE_n6_04"
},
{
"t":"Non devi guadagnarti una risposta.",
"to":"V2_ELE_n6_05"
}
]
},
{
"id":"V2_ELE_n6_03",
"who":"Elena",
"fase":"IV",
"text":"Se no, possiamo ricominciare da una cosa piccola.",
"opts":[
{
"t":"Comincio da come sto adesso.",
"to":"V2_ELE_n6_04"
},
{
"t":"Una cosa normale mi aiuta.",
"to":"V2_ELE_n6_06"
}
]
},
{
"id":"V2_ELE_n6_04",
"who":"Elena",
"fase":"IV",
"text":"Dimmi tu se vuoi compagnia o spazio. Non lo indovino facendo la sorella brava.",
"opts":[
{
"t":"Compagnia. Anche se mi racconti una giornata di merda.",
"to":"V2_ELE_n6_05"
},
{
"t":"Spazio, per oggi.",
"to":"V2_ELE_n6_06"
}
]
},
{
"id":"V2_ELE_n6_05",
"who":"Elena",
"fase":"IV",
"text":"Va bene. Resto nella chat senza riempirla.",
"alt":[
{
"req":"flag:en6",
"text":"Prima avevi chiuso le domande. Adesso hai scelto di riaprire: lo rispetto."
}
]
},
{
"id":"V2_ELE_n6_06",
"who":"Elena",
"fase":"IV",
"text":"Allora oggi spazio. Scrivimi tu quando vuoi riaprire."
},
{
"id":"V2_ROS_n1_01",
"who":"Rosa",
"fase":"II",
"text":"Ho appoggiato il panino dove tenevo il bullone. Adesso il panino deve aspettare.",
"opts":[
{
"t":"Prima il panino. Il bullone è già un duro del cazzo.",
"to":"V2_ROS_n1_02"
},
{
"t":"C’è una cosa urgente. Le altre le tengo.",
"to":"V2_ROS_n1_03"
}
]
},
{
"id":"V2_ROS_n1_02",
"who":"Rosa",
"fase":"II",
"text":"Il bullone no, non l’ho mangiato. Ti precedo, pezzo di spiritoso.",
"opts":[
{
"t":"Non ti faccio lavorare mentre mastichi.",
"to":"V2_ROS_n1_04"
},
{
"t":"Il bullone lo conservi: ha più ferro del ripieno.",
"to":"V2_ROS_n1_05"
}
]
},
{
"id":"V2_ROS_n1_03",
"who":"Rosa",
"fase":"II",
"text":"Se mi fai una domanda adesso dimmi prima se riguarda il motore o il pranzo.",
"opts":[
{
"t":"Solo l’urgenza, senza aggiungere tutto il resto.",
"to":"V2_ROS_n1_04"
},
{
"t":"Aspetto che finisca la sosta.",
"to":"V2_ROS_n1_06"
}
]
},
{
"id":"V2_ROS_n1_04",
"who":"Rosa",
"fase":"II",
"text":"Voglio una sosta che non si allarghi fino a diventare un altro lavoro.",
"opts":[
{
"t":"Niente lista nascosta dopo la prima domanda.",
"to":"V2_ROS_n1_05"
},
{
"t":"Fermiamoci davvero, allora.",
"to":"V2_ROS_n1_06"
}
]
},
{
"id":"V2_ROS_n1_05",
"who":"Rosa",
"fase":"II",
"text":"Bene. Il panino è salvo e tu non hai ricevuto una diagnosi via maionese."
},
{
"id":"V2_ROS_n1_06",
"who":"Rosa",
"fase":"II",
"text":"Va bene. Finisco la cosa urgente, poi basta davvero."
},
{
"id":"V2_ROS_n2_01",
"who":"Rosa",
"fase":"II",
"text":"Scrivimi un rumore. Uno. Non una recensione della macchina intera.",
"opts":[
{
"t":"Fa tac quando riparto. Ecco la mia laurea del cazzo.",
"to":"V2_ROS_n2_02"
},
{
"t":"Non riesco ancora a spiegarlo. Mi fermo.",
"to":"V2_ROS_n2_03"
}
]
},
{
"id":"V2_ROS_n2_02",
"who":"Rosa",
"fase":"II",
"text":"Quello che hai sentito davvero, non quello che hai letto che dovrebbe fare.",
"opts":[
{
"t":"Tac. Il resto della diagnosi me lo sono inventato.",
"to":"V2_ROS_n2_04"
},
{
"t":"Ti dico anche quando non succede.",
"to":"V2_ROS_n2_05"
}
]
},
{
"id":"V2_ROS_n2_03",
"who":"Rosa",
"fase":"II",
"text":"Se adesso non riesci a descriverlo, fermati. Il rumore non si offende.",
"opts":[
{
"t":"Aspetto da fermo e poi ti scrivo.",
"to":"V2_ROS_n2_04"
},
{
"t":"Non accelero. Colleziono già abbastanza cazzate.",
"to":"V2_ROS_n2_06"
}
]
},
{
"id":"V2_ROS_n2_04",
"who":"Rosa",
"fase":"II",
"text":"Prima distinguiamo quando succede. Poi decidiamo se devi muoverti.",
"opts":[
{
"t":"Non gli do un nome per farti fare prima.",
"to":"V2_ROS_n2_05"
},
{
"t":"Se non lo capisco lo lascio come dubbio.",
"to":"V2_ROS_n2_06"
}
]
},
{
"id":"V2_ROS_n2_05",
"who":"Rosa",
"fase":"II",
"text":"Bene. Ho un dettaglio su cui lavorare, non una collezione di paure."
},
{
"id":"V2_ROS_n2_06",
"who":"Rosa",
"fase":"II",
"text":"Va bene. Non ti faccio accelerare per mandarmi un esempio migliore."
},
{
"id":"V2_ROS_n3_01",
"who":"Rosa",
"fase":"III",
"text":"Se oggi mi dai ragione troppo in fretta ti mando a fanculo prima della riparazione.",
"opts":[
{
"t":"Ti dico quello che vedo, anche se non coincide.",
"to":"V2_ROS_n3_02",
"fx":[
"flag:rn3"
]
},
{
"t":"Posso chiederti se sai o stai ricordando.",
"to":"V2_ROS_n3_03"
}
]
},
{
"id":"V2_ROS_n3_02",
"who":"Rosa",
"fase":"III",
"text":"Non è una prova di simpatia. È che quando ho paura scrivo come se comandassi.",
"opts":[
{
"t":"Abbasso il volume. Tu abbassa il cric.",
"to":"V2_ROS_n3_04"
},
{
"t":"Ti fermo con guarda prima, come hai chiesto.",
"to":"V2_ROS_n3_05"
}
]
},
{
"id":"V2_ROS_n3_03",
"who":"Rosa",
"fase":"III",
"text":"Se ti dico una cosa che non hai visto, puoi fermarmi.",
"opts":[
{
"t":"Non facciamo a chi ce l’ha più chiave inglese.",
"to":"V2_ROS_n3_04"
},
{
"t":"Aspetto di poter guardare.",
"to":"V2_ROS_n3_06"
}
]
},
{
"id":"V2_ROS_n3_04",
"who":"Rosa",
"fase":"III",
"text":"Mi serve un dettaglio tuo, non il mio ricordo ripetuto bene.",
"opts":[
{
"t":"Il mio dettaglio prima del tuo ordine.",
"to":"V2_ROS_n3_05"
},
{
"t":"Se non vedo un cazzo, ti dico proprio quello.",
"to":"V2_ROS_n3_06"
}
]
},
{
"id":"V2_ROS_n3_05",
"who":"Rosa",
"fase":"III",
"text":"Bene. Un’officina con due cervelli. Evento raro, ma non soprannaturale.",
"alt":[
{
"req":"flag:rn3",
"text":"Mi hai contraddetta con un dettaglio. Meglio di un sì usato per calmarmi."
}
]
},
{
"id":"V2_ROS_n3_06",
"who":"Rosa",
"fase":"III",
"text":"Va bene. Per adesso non decidi per calmarmi. È già un aiuto."
},
{
"id":"V2_ROS_n4_01",
"who":"Rosa",
"fase":"III",
"text":"Il controllo me l’hai già descritto. Adesso vuoi rifarlo o vuoi che ti rassicuri?",
"opts":[
{
"t":"Voglio che tu mi dica di sì. Che rottura di palle.",
"to":"V2_ROS_n4_02"
},
{
"t":"C’è un particolare nuovo che non ti avevo descritto.",
"to":"V2_ROS_n4_03"
}
]
},
{
"id":"V2_ROS_n4_02",
"who":"Rosa",
"fase":"III",
"text":"Non è la stessa cosa. Il primo mi serve, il secondo rischia di non finire.",
"opts":[
{
"t":"Spengo. Il cofano può smettere di farmi da psicologo.",
"to":"V2_ROS_n4_04"
},
{
"t":"Non ti chiedo di trovare un problema per calmarmi.",
"to":"V2_ROS_n4_05"
}
]
},
{
"id":"V2_ROS_n4_03",
"who":"Rosa",
"fase":"III",
"text":"Se c’è un dettaglio nuovo lo guardiamo. Se no, puoi anche avere ancora paura.",
"opts":[
{
"t":"Ti descrivo solo quello che è cambiato.",
"to":"V2_ROS_n4_04"
},
{
"t":"Aspetto di poterlo controllare da fermo.",
"to":"V2_ROS_n4_06"
}
]
},
{
"id":"V2_ROS_n4_04",
"who":"Rosa",
"fase":"III",
"text":"Non devo inventarti un guasto per darti una ragione buona di fermarti.",
"opts":[
{
"t":"Posso non sentirmi pronto anche se il controllo è finito.",
"to":"V2_ROS_n4_05"
},
{
"t":"Un dettaglio, poi basta.",
"to":"V2_ROS_n4_06"
}
]
},
{
"id":"V2_ROS_n4_05",
"who":"Rosa",
"fase":"III",
"text":"Bene. Il controllo è finito. La paura può sedersi un momento senza aprire il cofano.",
"alt":[
{
"req":"flag:r01b",
"text":"Volevi imparare il controllo. Ora sai anche quando smettere."
}
]
},
{
"id":"V2_ROS_n4_06",
"who":"Rosa",
"fase":"III",
"text":"Va bene. Guardiamo soltanto quel dettaglio nuovo, poi smettiamo."
},
{
"id":"V2_ROS_n5_01",
"who":"Rosa",
"fase":"V",
"text":"Prima hai ritirato l’aiuto. Adesso mi stai scrivendo per riparlarne?",
"opts":[
{
"t":"Sì. Ma voglio mettere un limite chiaro.",
"to":"V2_ROS_n5_02",
"fx":[
"flag:rn5"
]
},
{
"t":"No. Voglio soltanto dirti che non ho cambiato idea.",
"to":"V2_ROS_n5_03"
}
]
},
{
"id":"V2_ROS_n5_02",
"who":"Rosa",
"fase":"V",
"text":"Possiamo farlo. Non serve ripetere la promessa più forte di prima.",
"opts":[
{
"t":"Ti aiuto. Ma alla cieca non apro un cazzo.",
"to":"V2_ROS_n5_04"
},
{
"t":"Prima guardiamo il punto, poi ti rispondo.",
"to":"V2_ROS_n5_05"
}
]
},
{
"id":"V2_ROS_n5_03",
"who":"Rosa",
"fase":"V",
"text":"Se il limite è diverso, scrivilo prima del sì.",
"opts":[
{
"t":"Preferisco dirtelo invece di fingere.",
"to":"V2_ROS_n5_04"
},
{
"t":"Posso aiutarti a preparare senza venire dentro.",
"to":"V2_ROS_n5_06"
}
]
},
{
"id":"V2_ROS_n5_04",
"who":"Rosa",
"fase":"V",
"text":"Non ti voglio disposto a tutto. Ti voglio capace di fermarti quando serve.",
"opts":[
{
"t":"È questo il limite. Se cambia, lo dico.",
"to":"V2_ROS_n5_05"
},
{
"t":"Per adesso niente promessa nuova.",
"to":"V2_ROS_n5_06"
}
]
},
{
"id":"V2_ROS_n5_05",
"who":"Rosa",
"fase":"V",
"text":"Bene. Allora prepariamo una ricerca, non la riparazione del tuo senso di colpa.",
"alt":[
{
"req":"flag:rn5",
"text":"Riprendi l’aiuto con un limite. Il prima non è cancellato."
}
]
},
{
"id":"V2_ROS_n5_06",
"who":"Rosa",
"fase":"V",
"text":"Va bene. Resti fuori dal recupero. Non ti faccio diventare il colpevole di tutto."
},
{
"id":"V2_ROS_n6_01",
"who":"Rosa",
"fase":"V",
"text":"Dopo possiamo anche parlare di qualcosa che non dobbiamo salvare.",
"opts":[
{
"t":"Vorrei lamentarmi del caffè. Una cazzata bellissima.",
"to":"V2_ROS_n6_02"
},
{
"t":"Prima voglio dirti quello che sto scegliendo.",
"to":"V2_ROS_n6_03"
}
]
},
{
"id":"V2_ROS_n6_02",
"who":"Rosa",
"fase":"V",
"text":"Non ti sto vendendo una sera tranquilla. Sto dicendo che vorrei averla.",
"opts":[
{
"t":"Preferisco fare schifo a raccontarla, ma esserci.",
"to":"V2_ROS_n6_04"
},
{
"t":"Basta poterci essere, senza una bella storia.",
"to":"V2_ROS_n6_05"
}
]
},
{
"id":"V2_ROS_n6_03",
"who":"Rosa",
"fase":"V",
"text":"Se torni, non devi ringraziarmi rifacendo tutta la storia.",
"opts":[
{
"t":"Non ti pago con una promessa più grande.",
"to":"V2_ROS_n6_04"
},
{
"t":"Ti dico il limite prima di arrivarci.",
"to":"V2_ROS_n6_06"
}
]
},
{
"id":"V2_ROS_n6_04",
"who":"Rosa",
"fase":"V",
"text":"Se scegli altro, dimmelo prima di trasformare una promessa in un addio.",
"opts":[
{
"t":"Ti scrivo prima della decisione.",
"to":"V2_ROS_n6_05"
},
{
"t":"Tengo la scelta distinta dal volerti bene.",
"to":"V2_ROS_n6_06"
}
]
},
{
"id":"V2_ROS_n6_05",
"who":"Rosa",
"fase":"V",
"text":"Va bene. Un messaggio vero, prima della porta. Senza fare i fenomeni."
},
{
"id":"V2_ROS_n6_06",
"who":"Rosa",
"fase":"V",
"text":"Allora tieni questo: di ritorno, non eroico. Lo avevo scritto e non lo ritiro.",
"alt":[
{
"req":"flag:r100",
"text":"Di ritorno, non eroico. Quella frase te la sei tenuta."
}
]
},
{
"id":"V2_LIV_n1_01",
"who":"Livia",
"fase":"III",
"text":"Ho finito di sistemare la pila. Adesso sto considerando di spostarla tutta a sinistra.",
"opts":[
{
"t":"L’archivio avanza. Di tre centimetri a sinistra.",
"to":"V2_LIV_n1_02"
},
{
"t":"C’è una cosa precisa. Il resto può aspettare.",
"to":"V2_LIV_n1_03"
}
]
},
{
"id":"V2_LIV_n1_02",
"who":"Livia",
"fase":"III",
"text":"Non ridere. A destra avrei dovuto cominciare il lavoro vero.",
"opts":[
{
"t":"Ti lascio cinque minuti senza una richiesta sotto.",
"to":"V2_LIV_n1_04"
},
{
"t":"Domani la giri. Così il lavoro ha visto il mondo.",
"to":"V2_LIV_n1_05"
}
]
},
{
"id":"V2_LIV_n1_03",
"who":"Livia",
"fase":"III",
"text":"Se ti serve una risposta oggi, dimmelo. Se no mi prendo cinque minuti normali.",
"opts":[
{
"t":"Una domanda sola, poi ti lascio andare.",
"to":"V2_LIV_n1_04"
},
{
"t":"Può aspettare. Non ti tengo lì.",
"to":"V2_LIV_n1_06"
}
]
},
{
"id":"V2_LIV_n1_04",
"who":"Livia",
"fase":"III",
"text":"Non voglio far finta di lavorare per non ammettere che ho bisogno di fermarmi.",
"opts":[
{
"t":"Puoi fermarti anche senza aver finito.",
"to":"V2_LIV_n1_05"
},
{
"t":"Una risposta sola, senza aggiungere tutto il resto.",
"to":"V2_LIV_n1_06"
}
]
},
{
"id":"V2_LIV_n1_05",
"who":"Livia",
"fase":"III",
"text":"Grazie. La pila resta dov’è e io mi alzo dalla sedia."
},
{
"id":"V2_LIV_n1_06",
"who":"Livia",
"fase":"III",
"text":"Va bene. Rispondo a quella cosa precisa, poi basta archiviare anche la pausa."
},
{
"id":"V2_LIV_n2_01",
"who":"Livia",
"fase":"III",
"text":"Ho riletto una frase che ti avevo mandato. La farei meno sicura.",
"opts":[
{
"t":"Dimmi quale pezzo vuoi correggere.",
"to":"V2_LIV_n2_02",
"fx":[
"flag:ln2"
]
},
{
"t":"Sì. Non ti chiedo di essere infallibile.",
"to":"V2_LIV_n2_03"
}
]
},
{
"id":"V2_LIV_n2_02",
"who":"Livia",
"fase":"III",
"text":"Non è cambiata la cosa. Ero io che volevo arrivare troppo presto alla fine.",
"opts":[
{
"t":"Lo tengo come correzione, non come un tradimento.",
"to":"V2_LIV_n2_04"
},
{
"t":"Non cancello la versione di prima.",
"to":"V2_LIV_n2_05"
}
]
},
{
"id":"V2_LIV_n2_03",
"who":"Livia",
"fase":"III",
"text":"Posso correggermi senza farti scegliere se fidarti di tutta la mia vita?",
"opts":[
{
"t":"Mi aiuta sapere che puoi tornare su una frase.",
"to":"V2_LIV_n2_04"
},
{
"t":"Mi fido anche se ti manca una risposta.",
"to":"V2_LIV_n2_06"
}
]
},
{
"id":"V2_LIV_n2_04",
"who":"Livia",
"fase":"III",
"text":"Preferisco il fastidio di una correzione al conforto di restare precisa sulla carta.",
"opts":[
{
"t":"Segniamo quello che cambia e basta.",
"to":"V2_LIV_n2_05"
},
{
"t":"Puoi essere meno sicura e più utile.",
"to":"V2_LIV_n2_06"
}
]
},
{
"id":"V2_LIV_n2_05",
"who":"Livia",
"fase":"III",
"text":"Grazie. Cambio quella frase, non ti chiedo di dimenticare che l’avevo scritta.",
"alt":[
{
"req":"flag:ln2",
"text":"Mi hai chiesto cosa correggere, non se buttare via tutto."
}
]
},
{
"id":"V2_LIV_n2_06",
"who":"Livia",
"fase":"III",
"text":"Va bene. Ti spiego solo che cosa cambia, senza rifare tutta la storia."
},
{
"id":"V2_LIV_n3_01",
"who":"Livia",
"fase":"III",
"text":"Sto mangiando lontano dalle carte. Mi sento quasi una persona fuori dal lavoro.",
"opts":[
{
"t":"Per sicurezza interroga il parmigiano.",
"to":"V2_LIV_n3_02"
},
{
"t":"Finisci di mangiare. Ti scrivo dopo.",
"to":"V2_LIV_n3_03"
}
]
},
{
"id":"V2_LIV_n3_02",
"who":"Livia",
"fase":"III",
"text":"È incredibile: il piatto non mi chiede in che ordine sono arrivati gli ingredienti.",
"opts":[
{
"t":"Non catalogare le penne. Mangiale.",
"to":"V2_LIV_n3_04"
},
{
"t":"Per oggi parliamo di tavoli e basta.",
"to":"V2_LIV_n3_05"
}
]
},
{
"id":"V2_LIV_n3_03",
"who":"Livia",
"fase":"III",
"text":"Non mi fare una domanda con sei parti. Oggi ne mangio almeno una senza rispondere.",
"opts":[
{
"t":"Non ti aggiungo una lista mentre mangi.",
"to":"V2_LIV_n3_04"
},
{
"t":"Ho una cosa breve, senza altre cinque sotto.",
"to":"V2_LIV_n3_06"
}
]
},
{
"id":"V2_LIV_n3_04",
"who":"Livia",
"fase":"III",
"text":"Puoi raccontarmi qualcosa di normale. Non deve diventare materiale da conservare.",
"opts":[
{
"t":"Ho mangiato in piedi. Il tavolo mi pareva un lusso.",
"to":"V2_LIV_n3_05"
},
{
"t":"Mangia. Il resto non scappa per offenderti.",
"to":"V2_LIV_n3_06"
}
]
},
{
"id":"V2_LIV_n3_05",
"who":"Livia",
"fase":"III",
"text":"Grazie. Per qualche minuto la tovaglia non è un tavolo da lavoro."
},
{
"id":"V2_LIV_n3_06",
"who":"Livia",
"fase":"III",
"text":"Va bene. Una cosa breve, poi finisco di mangiare prima di diventare sgradevole."
},
{
"id":"V2_LIV_n4_01",
"who":"Livia",
"fase":"IV",
"text":"Prima hai scelto di non raccontarmi quello che avevi. Vuoi riaprire adesso?",
"opts":[
{
"t":"Sì. Avevo paura di perdere anche la mia versione.",
"to":"V2_LIV_n4_02",
"fx":[
"flag:ln4"
]
},
{
"t":"No. Ma volevo smettere di fingere che non fosse una scelta.",
"to":"V2_LIV_n4_03"
}
]
},
{
"id":"V2_LIV_n4_02",
"who":"Livia",
"fase":"IV",
"text":"Possiamo. Non mi serve che cominci con ti dovevi fidare di me.",
"opts":[
{
"t":"Avevo paura. Mi vergogno a scriverlo così corto.",
"to":"V2_LIV_n4_04"
},
{
"t":"Ti mando quello che tengo, prima di raccontarlo meglio.",
"to":"V2_LIV_n4_05"
}
]
},
{
"id":"V2_LIV_n4_03",
"who":"Livia",
"fase":"IV",
"text":"Se non vuoi, lo rispetto. Non ti conto come una persona che ha già detto sì.",
"opts":[
{
"t":"Non ti userò come un nome di garanzia.",
"to":"V2_LIV_n4_04"
},
{
"t":"Se cambio idea, te lo dico senza un’altra scusa.",
"to":"V2_LIV_n4_06"
}
]
},
{
"id":"V2_LIV_n4_04",
"who":"Livia",
"fase":"IV",
"text":"Mi basta un motivo vero. Anche se non mi farà piacere leggerlo.",
"opts":[
{
"t":"Questo è il motivo. Il resto lo guardiamo insieme.",
"to":"V2_LIV_n4_05"
},
{
"t":"Non mi aspetto di saltare il confronto per aver chiesto scusa.",
"to":"V2_LIV_n4_06"
}
]
},
{
"id":"V2_LIV_n4_05",
"who":"Livia",
"fase":"IV",
"text":"Grazie. Adesso possiamo ricominciare da quello che c’è, non dal litigio.",
"alt":[
{
"req":"flag:ln4",
"text":"Ora hai detto il motivo. Possiamo ripartire da lì."
}
]
},
{
"id":"V2_LIV_n4_06",
"who":"Livia",
"fase":"IV",
"text":"Va bene. Il discorso resta chiuso per tua scelta, non perché io abbia risposto per te."
},
{
"id":"V2_LIV_n5_01",
"who":"Livia",
"fase":"IV",
"text":"La parte vuota della foto mi mette più in difficoltà del volto.",
"opts":[
{
"t":"Non lo completo neanch’io.",
"to":"V2_LIV_n5_02",
"fx":[
"flag:ln5"
]
},
{
"t":"Posso guardarla a pezzi senza cambiare quello che mostra.",
"to":"V2_LIV_n5_03"
}
]
},
{
"id":"V2_LIV_n5_02",
"who":"Livia",
"fase":"IV",
"text":"Sul volto posso fermare gli occhi. Sul vuoto mi viene da scrivere quello che manca.",
"opts":[
{
"t":"Continuo a guardarci. Come se dovesse comparire.",
"to":"V2_LIV_n5_04"
},
{
"t":"Ti dico se sto descrivendo o ricordando.",
"to":"V2_LIV_n5_05"
}
]
},
{
"id":"V2_LIV_n5_03",
"who":"Livia",
"fase":"IV",
"text":"Claudio ricordava qualcuno lì. Il fotogramma non lo mostra.",
"opts":[
{
"t":"Non la faccio diventare una risposta a tutto.",
"to":"V2_LIV_n5_04"
},
{
"t":"Non cancello il racconto. Li tengo distinti.",
"to":"V2_LIV_n5_06"
}
]
},
{
"id":"V2_LIV_n5_04",
"who":"Livia",
"fase":"IV",
"text":"Non voglio ripetere il suo gesto: correggere la cosa finché smette di farmi male.",
"opts":[
{
"t":"Se fa male, non significa che vada corretta.",
"to":"V2_LIV_n5_05"
},
{
"t":"Possiamo fermarci senza nasconderla.",
"to":"V2_LIV_n5_06"
}
]
},
{
"id":"V2_LIV_n5_05",
"who":"Livia",
"fase":"IV",
"text":"Va bene. Lasciamo vuoto il punto che è vuoto.",
"alt":[
{
"req":"flag:ln5",
"text":"Il vuoto resta vuoto. Non miglioriamo la foto per sopportarla."
}
]
},
{
"id":"V2_LIV_n5_06",
"who":"Livia",
"fase":"IV",
"text":"Allora la riguardiamo con calma, senza chiederti di ammettere tutto in un istante."
},
{
"id":"V2_LIV_n6_01",
"who":"Livia",
"fase":"V",
"text":"Quando ho scritto che puoi entrare senza una buona notizia, lo intendevo.",
"opts":[
{
"t":"Lo ricordo. Non ti porto un sostituto per evitare quella porta.",
"to":"V2_LIV_n6_02"
},
{
"t":"Non so se riuscirò a dire tutto senza vergognarmi.",
"to":"V2_LIV_n6_03"
}
]
},
{
"id":"V2_LIV_n6_02",
"who":"Livia",
"fase":"V",
"text":"Non mi serve prepararmi una sorella più ragionevole prima che tu risponda.",
"opts":[
{
"t":"Ti dico chi ho visto, non chi vorrei averti riportato.",
"to":"V2_LIV_n6_04"
},
{
"t":"Non faccio della tua attesa un ordine.",
"to":"V2_LIV_n6_05"
}
]
},
{
"id":"V2_LIV_n6_03",
"who":"Livia",
"fase":"V",
"text":"Posso arrabbiarmi, piangere e continuare a sapere che non mi stai facendo un torto.",
"opts":[
{
"t":"Se arrivo a mani vuote, mi fai sedere lo stesso?",
"to":"V2_LIV_n6_04"
},
{
"t":"Se non so, comincio da quello.",
"to":"V2_LIV_n6_06"
}
]
},
{
"id":"V2_LIV_n6_04",
"who":"Livia",
"fase":"V",
"text":"Non usare la mia felicità come una prova che quello davanti sia mio fratello.",
"opts":[
{
"t":"Neanche un sorriso tuo basta a cambiare un fatto.",
"to":"V2_LIV_n6_05"
},
{
"t":"Non scelgo per impedirti di soffrire a ogni costo.",
"to":"V2_LIV_n6_06"
}
]
},
{
"id":"V2_LIV_n6_05",
"who":"Livia",
"fase":"V",
"text":"Grazie. Ti aspetto senza assegnarti la parte di quello che sistema tutto.",
"alt":[
{
"req":"flag:l100",
"text":"Niente sostituti. Ricorda questo più della mia attesa."
}
]
},
{
"id":"V2_LIV_n6_06",
"who":"Livia",
"fase":"V",
"text":"Va bene. Se non trovi una risposta, non restare sulla soglia a inventarla."
}
];
const CHAT_START = [{"id":"st_ELE_ritiro_01","th":"Elena","node":"ELE_ritiro_01","km":18},{"id":"st_ELE_pasta_01","th":"Elena","node":"ELE_pasta_01","km":32},{"id":"st_ELE_turno_01","th":"Elena","node":"ELE_turno_01","km":46},{"id":"st_ELE_coinquilino_01","th":"Elena","node":"ELE_coinquilino_01","km":60},{"id":"st_ELE_cena_01","th":"Elena","node":"ELE_cena_01","km":74},{"id":"st_ELE_bollette_01","th":"Elena","node":"ELE_bollette_01","km":88},{"id":"st_ELE_temperino_fissato","th":"Elena","node":"ELE_temperino_fissato","km":102,"req":["fatto:ELE_ritiro_08"]},{"id":"st_ELE_claudio_fissato","th":"Elena","node":"ELE_claudio_fissato","km":116,"req":["fatto:ELE_ritiro_08"]},{"id":"st_ELE_richiamo_01","th":"Elena","node":"ELE_richiamo_01","km":130,"req":["flag:elena_sosta_promessa"]},{"id":"st_ROS_attrezzi_01","th":"Rosa","node":"ROS_attrezzi_01","km":144},{"id":"st_PRE_1_01","th":"Sconosciuto","node":"PRE_1_01","km":158},{"id":"st_ELE_litigio_01","th":"Elena","node":"ELE_litigio_01","km":172},{"id":"st_ROS_prudenza_01","th":"Rosa","node":"ROS_prudenza_01","km":186},{"id":"st_PRE_1_02","th":"Sconosciuto","node":"PRE_1_02","km":200},{"id":"st_ELE_distanza_01","th":"Elena","node":"ELE_distanza_01","km":200,"req":["flag:ev_distanza_impossibile"]},{"id":"st_PRE_1_03","th":"Sconosciuto","node":"PRE_1_03","km":214},{"id":"st_PRE_1_06","th":"Sconosciuto","node":"PRE_1_06","km":228},{"id":"st_PRE_1_07","th":"Sconosciuto","node":"PRE_1_07","km":242},{"id":"st_ELE_riparazione_01","th":"Elena","node":"ELE_riparazione_01","km":270,"req":["flag:elena_scuse"]},{"id":"st_ROS_ricontrollo_01","th":"Rosa","node":"ROS_ricontrollo_01","km":284,"req":["flag:rosa_sosta_accettata"]},{"id":"st_LIV_primo_01","th":"Livia","node":"LIV_primo_01","km":298},{"id":"st_ROS_passato_01","th":"Rosa","node":"ROS_passato_01","km":312},{"id":"st_LIV_affido_01","th":"Livia","node":"LIV_affido_01","km":326},{"id":"st_ROS_promessa_01","th":"Rosa","node":"ROS_promessa_01","km":340,"req":["flag:promessa_rosa"]},{"id":"st_LIV_ottavio_01","th":"Livia","node":"LIV_ottavio_01","km":354},{"id":"st_ROS_dopo_passaggio_01","th":"Rosa","node":"ROS_dopo_passaggio_01","km":354,"req":["flag:ev_incursione_1_conclusa"]},{"id":"st_ELE_nonno_01","th":"Elena","node":"ELE_nonno_01","km":430},{"id":"st_ROS_segni_01","th":"Rosa","node":"ROS_segni_01","km":430,"req":["flag:ev_indizio_sangue"]},{"id":"st_LIV_fiducia_01","th":"Livia","node":"LIV_fiducia_01","km":444,"req":["flag:prova_trattenuta"]},{"id":"st_SPORCO_01","th":"Elena","node":"SPORCO_01","km":458,"req":["flag:nonno_uso_fissato"]},{"id":"st_LIV_irene_01","th":"Livia","node":"LIV_irene_01","km":458,"req":["flag:ev_foto_originale"]},{"id":"st_SPORCO_02","th":"Elena","node":"SPORCO_02","km":472,"req":["flag:nonno_uso_fissato"]},{"id":"st_SPORCO_03","th":"Elena","node":"SPORCO_03","km":486,"req":["flag:nonno_uso_fissato"]},{"id":"st_SPORCO_04","th":"Elena","node":"SPORCO_04","km":500,"req":["flag:nonno_uso_fissato"]},{"id":"st_SPORCO_05","th":"Elena","node":"SPORCO_05","km":514,"req":["flag:nonno_uso_fissato"]},{"id":"st_SPORCO_06","th":"Elena","node":"SPORCO_06","km":528,"req":["flag:nonno_uso_fissato"]},{"id":"st_PRE_2_01","th":"Elena","node":"PRE_2_01","km":542},{"id":"st_PRE_2_02","th":"Elena","node":"PRE_2_02","km":556},{"id":"st_PRE_2_03","th":"Elena","node":"PRE_2_03","km":570},{"id":"st_PRE_2_06","th":"Elena","node":"PRE_2_06","km":584},{"id":"st_PRE_2_07","th":"Elena","node":"PRE_2_07","km":598},{"id":"st_PRE_3_01","th":"Zio Claudio","node":"PRE_3_01","km":612},{"id":"st_PRE_3_02","th":"Zio Claudio","node":"PRE_3_02","km":626},{"id":"st_PRE_3_03","th":"Zio Claudio","node":"PRE_3_03","km":640},{"id":"st_PRE_3_06","th":"Zio Claudio","node":"PRE_3_06","km":654},{"id":"st_PRE_3_07","th":"Zio Claudio","node":"PRE_3_07","km":668},{"id":"st_ELE_cena_ritorno_01","th":"Elena","node":"ELE_cena_ritorno_01","km":668,"req":["flag:elena_non_aspettare","flag:ev_fase_v"]},{"id":"st_ROS_recupero_01","th":"Rosa","node":"ROS_recupero_01","km":668,"req":["flag:promessa_rosa_chiarita","flag:ev_fase_v"]},{"id":"st_LIV_promessa_01","th":"Livia","node":"LIV_promessa_01","km":668,"req":["flag:promessa_rosa_chiarita","flag:ev_fase_v"]},{"id":"st_PRE_4_01","th":"Sconosciuto","node":"PRE_4_01","km":668,"req":["flag:ev_presenza_scoperta"]},{"id":"st_ROS_guardia_01","th":"Rosa","node":"ROS_guardia_01","km":668,"req":["flag:ev_fase_v"]},{"id":"st_PRE_4_02","th":"Sconosciuto","node":"PRE_4_02","km":668,"req":["flag:ev_presenza_scoperta"]},{"id":"st_ROS_prima_porta_01","th":"Rosa","node":"ROS_prima_porta_01","km":668,"req":["flag:promessa_rosa","flag:ev_fase_v"]},{"id":"st_PRE_4_03","th":"Sconosciuto","node":"PRE_4_03","km":668,"req":["flag:ev_presenza_scoperta"]},{"id":"st_PRE_4_06","th":"Sconosciuto","node":"PRE_4_06","km":668,"req":["flag:ev_presenza_scoperta"]},{"id":"st_PRE_4_07","th":"Sconosciuto","node":"PRE_4_07","km":668,"req":["flag:ev_presenza_scoperta"]},{"id":"st_V2_ELE_n1_01","th":"Elena","node":"V2_ELE_n1_01","km":18,"req":["flag:e25"]},{"id":"st_V2_ELE_n2_01","th":"Elena","node":"V2_ELE_n2_01","km":130,"req":["flag:e50"]},{"id":"st_V2_ELE_n3_01","th":"Elena","node":"V2_ELE_n3_01","km":138,"req":["flag:e01b"]},{"id":"st_V2_ELE_n4_01","th":"Elena","node":"V2_ELE_n4_01","km":270,"req":["flag:elena_scuse"]},{"id":"st_V2_ELE_n5_01","th":"Elena","node":"V2_ELE_n5_01","km":278,"req":["flag:temperino_detto_elena"]},{"id":"st_V2_ELE_n6_01","th":"Elena","node":"V2_ELE_n6_01","km":430,"req":["flag:e08c"]},{"id":"st_V2_ROS_n1_01","th":"Rosa","node":"V2_ROS_n1_01","km":130,"req":["flag:r25"]},{"id":"st_V2_ROS_n2_01","th":"Rosa","node":"V2_ROS_n2_01","km":138,"req":["flag:r50"]},{"id":"st_V2_ROS_n3_01","th":"Rosa","node":"V2_ROS_n3_01","km":270,"req":["flag:r75"]},{"id":"st_V2_ROS_n4_01","th":"Rosa","node":"V2_ROS_n4_01","km":278,"req":["flag:r01b"]},{"id":"st_V2_ROS_n5_01","th":"Rosa","node":"V2_ROS_n5_01","km":600,"req":["flag:r05c","flag:ev_fase_v"]},{"id":"st_V2_ROS_n6_01","th":"Rosa","node":"V2_ROS_n6_01","km":608,"req":["flag:r100","flag:ev_fase_v"]},{"id":"st_V2_LIV_n1_01","th":"Livia","node":"V2_LIV_n1_01","km":270,"req":["flag:l25"]},{"id":"st_V2_LIV_n2_01","th":"Livia","node":"V2_LIV_n2_01","km":278,"req":["flag:l50"]},{"id":"st_V2_LIV_n3_01","th":"Livia","node":"V2_LIV_n3_01","km":286,"req":["flag:l75"]},{"id":"st_V2_LIV_n4_01","th":"Livia","node":"V2_LIV_n4_01","km":430,"req":["flag:l02c"]},{"id":"st_V2_LIV_n5_01","th":"Livia","node":"V2_LIV_n5_01","km":438,"req":["flag:foto"]},{"id":"st_V2_LIV_n6_01","th":"Livia","node":"V2_LIV_n6_01","km":600,"req":["flag:l100","flag:ev_fase_v"]},{"id":"st_V2_LUOGO_tokyo_01","th":"Elena","node":"V2_LUOGO_tokyo_01","km":26,"req":["flag:luogo_tokyo"]},{"id":"st_V2_LUOGO_roma_01","th":"Elena","node":"V2_LUOGO_roma_01","km":34,"req":["flag:luogo_roma"]},{"id":"st_V2_LUOGO_parigi_01","th":"Elena","node":"V2_LUOGO_parigi_01","km":146,"req":["flag:luogo_parigi"]},{"id":"st_V2_LUOGO_londra_01","th":"Rosa","node":"V2_LUOGO_londra_01","km":286,"req":["flag:luogo_londra"]},{"id":"st_V2_LUOGO_stoccolma_01","th":"Livia","node":"V2_LUOGO_stoccolma_01","km":294,"req":["flag:luogo_stoccolma"]},{"id":"st_V2_LUOGO_berlino_01","th":"Rosa","node":"V2_LUOGO_berlino_01","km":294,"req":["flag:luogo_berlino"]},{"id":"st_V2_LUOGO_praga_01","th":"Rosa","node":"V2_LUOGO_praga_01","km":302,"req":["flag:luogo_praga"]},{"id":"st_V2_LUOGO_vienna_01","th":"Elena","node":"V2_LUOGO_vienna_01","km":286,"req":["flag:luogo_vienna"]},{"id":"st_V2_LUOGO_madrid_01","th":"Elena","node":"V2_LUOGO_madrid_01","km":438,"req":["flag:luogo_madrid"]},{"id":"st_V2_LUOGO_lisbona_01","th":"Livia","node":"V2_LUOGO_lisbona_01","km":446,"req":["flag:luogo_lisbona"]},{"id":"st_V2_LUOGO_atene_01","th":"Rosa","node":"V2_LUOGO_atene_01","km":616,"req":["flag:luogo_atene","flag:ev_fase_v"]},{"id":"st_V2_LUOGO_washington_01","th":"Livia","node":"V2_LUOGO_washington_01","km":608,"req":["flag:luogo_washington","flag:ev_fase_v"]}];
const CHAT_TONI_MAP = {"ELE_ritiro_01":["ironico","pacato","sincero"],"ELE_ritiro_02":["ironico","pacato"],"ELE_ritiro_03":["pacato","pacato"],"ELE_ritiro_04":["ironico","ironico"],"ELE_ritiro_05":["ironico","gentile"],"ELE_ritiro_06":["gentile","pacato"],"ELE_ritiro_07":["ironico","gentile","sincero"],"ELE_pasta_01":["ironico","pacato","sincero"],"ELE_pasta_02":["ironico","pacato"],"ELE_pasta_03":["ironico","sincero"],"ELE_pasta_04":["ironico","pacato"],"ELE_pasta_05":["ironico","ironico"],"ELE_pasta_06":["sincero","ironico"],"ELE_pasta_07":["ironico","ironico","sincero"],"ELE_turno_01":["sboccato","pacato","sincero"],"ELE_turno_02":["pacato","gentile"],"ELE_turno_03":["gentile","pacato"],"ELE_turno_04":["sincero","pacato"],"ELE_turno_05":["gentile","pacato"],"ELE_turno_06":["pacato","gentile"],"ELE_turno_07":["pacato","ironico","sincero"],"ELE_coinquilino_01":["pacato","pacato","sincero"],"ELE_coinquilino_02":["gentile","ironico"],"ELE_coinquilino_03":["gentile","ironico"],"ELE_coinquilino_04":["gentile","freddo"],"ELE_coinquilino_05":["sincero","gentile"],"ELE_coinquilino_06":["sincero","gentile"],"ELE_coinquilino_07":["pacato","sincero","sincero"],"ELE_cena_01":["sincero","pacato","sincero"],"ELE_cena_02":["gentile","gentile"],"ELE_cena_03":["pacato","gentile"],"ELE_cena_04":["ironico","pacato"],"ELE_cena_05":["pacato","gentile"],"ELE_cena_06":["pacato","gentile"],"ELE_cena_07":["ironico","sincero","sincero"],"ELE_bollette_01":["ironico","pacato","sincero"],"ELE_bollette_02":["gentile","evasivo"],"ELE_bollette_03":["gentile","sincero"],"ELE_bollette_04":["pacato","sincero"],"ELE_bollette_05":["pacato","pacato"],"ELE_bollette_06":["ironico","pacato"],"ELE_bollette_07":["ironico","ironico","sincero"],"ELE_richiamo_01":["sincero","pacato","sincero"],"ELE_richiamo_02":["sincero","sincero"],"ELE_richiamo_03":["sincero","sincero"],"ELE_richiamo_04":["sincero","sincero"],"ELE_richiamo_05":["sincero","sincero"],"ELE_richiamo_06":["gentile","evasivo"],"ELE_richiamo_07":["sincero","pacato","sincero"],"ELE_litigio_01":["sincero","pacato","sincero"],"ELE_litigio_02":["sincero","sincero"],"ELE_litigio_03":["sincero","pacato"],"ELE_litigio_04":["sincero","pacato"],"ELE_litigio_05":["gentile","sincero"],"ELE_litigio_06":["gentile","sincero"],"ELE_litigio_07":["gentile","pacato","sincero"],"ELE_distanza_01":["sincero","pacato","sincero"],"ELE_distanza_02":["pacato","pacato"],"ELE_distanza_03":["pacato","sincero"],"ELE_distanza_04":["sincero","pacato"],"ELE_distanza_05":["pacato","pacato"],"ELE_distanza_06":["pacato","pacato"],"ELE_distanza_07":["gentile","pacato","sincero"],"ELE_riparazione_01":["sincero","pacato","sincero"],"ELE_riparazione_02":["sincero","sincero"],"ELE_riparazione_03":["sincero","pacato"],"ELE_riparazione_04":["sincero","pacato"],"ELE_riparazione_05":["pacato","gentile"],"ELE_riparazione_06":["sincero","sincero"],"ELE_riparazione_07":["sincero","pacato","sincero"],"ELE_nonno_01":["ironico","pacato","sincero"],"ELE_nonno_02":["pacato","ironico"],"ELE_nonno_03":["sincero","gentile"],"ELE_nonno_04":["pacato","ironico"],"ELE_nonno_05":["sincero","sincero"],"ELE_nonno_06":["sincero","pacato"],"ELE_nonno_07":["gentile","ironico","sincero"],"ELE_cena_ritorno_01":["gentile","pacato","sincero"],"ELE_cena_ritorno_02":["sincero","sincero"],"ELE_cena_ritorno_03":["pacato","sincero"],"ELE_cena_ritorno_04":["gentile","gentile"],"ELE_cena_ritorno_05":["sincero","sincero"],"ELE_cena_ritorno_06":["pacato","sincero"],"ELE_cena_ritorno_07":["sincero","sincero","sincero"],"ELE_temperino_fissato":["sincero","sincero"],"ELE_claudio_fissato":["sincero","sincero"],"ROS_attrezzi_01":["sboccato","pacato","sincero"],"ROS_attrezzi_02":["pacato","pacato","sboccato"],"ROS_attrezzi_03":["pacato","gentile"],"ROS_attrezzi_04":["pacato","pacato"],"ROS_attrezzi_05":["gentile","pacato","sboccato"],"ROS_attrezzi_06":["pacato","ironico"],"ROS_attrezzi_07":["pacato","ironico","sincero"],"ROS_prudenza_01":["sincero","pacato","sincero"],"ROS_prudenza_02":["pacato","evasivo"],"ROS_prudenza_03":["sincero","gentile"],"ROS_prudenza_04":["pacato","pacato"],"ROS_prudenza_05":["pacato","ironico","sboccato"],"ROS_prudenza_06":["pacato","gentile"],"ROS_prudenza_07":["sincero","pacato","sincero"],"ROS_ricontrollo_01":["sincero","pacato","sincero"],"ROS_ricontrollo_02":["sincero","sincero"],"ROS_ricontrollo_03":["ironico","sincero","sincero"],"ROS_ricontrollo_04":["sincero","pacato"],"ROS_ricontrollo_05":["sincero","pacato"],"ROS_ricontrollo_06":["gentile","evasivo"],"ROS_ricontrollo_07":["pacato","ironico","sincero"],"ROS_passato_01":["pacato","pacato","sincero"],"ROS_passato_02":["pacato","pacato"],"ROS_passato_03":["sincero","gentile"],"ROS_passato_04":["pacato","pacato","sboccato"],"ROS_passato_05":["gentile","pacato"],"ROS_passato_06":["gentile","sincero"],"ROS_passato_07":["sincero","pacato","sincero"],"ROS_promessa_01":["sincero","pacato","sincero"],"ROS_promessa_02":["pacato","pacato","sboccato"],"ROS_promessa_03":["sincero","pacato"],"ROS_promessa_04":["sincero","pacato"],"ROS_promessa_05":["pacato","pacato"],"ROS_promessa_06":["pacato","sincero","sincero"],"ROS_promessa_07":["sincero","sincero","sincero"],"ROS_dopo_passaggio_01":["sincero","pacato","sincero"],"ROS_dopo_passaggio_02":["sincero","pacato"],"ROS_dopo_passaggio_03":["pacato","pacato"],"ROS_dopo_passaggio_04":["sincero","sincero"],"ROS_dopo_passaggio_05":["sincero","pacato"],"ROS_dopo_passaggio_06":["pacato","sincero"],"ROS_dopo_passaggio_07":["pacato","pacato","sincero"],"ROS_segni_01":["pacato","pacato","sincero"],"ROS_segni_02":["pacato","pacato"],"ROS_segni_03":["gentile","pacato"],"ROS_segni_04":["pacato","pacato"],"ROS_segni_05":["pacato","gentile"],"ROS_segni_06":["pacato","pacato"],"ROS_segni_07":["sincero","gentile","sincero"],"ROS_recupero_01":["sincero","pacato","sincero"],"ROS_recupero_02":["sincero","pacato"],"ROS_recupero_03":["sincero","pacato"],"ROS_recupero_04":["pacato","pacato"],"ROS_recupero_05":["sincero","pacato"],"ROS_recupero_06":["pacato","pacato"],"ROS_recupero_07":["sincero","sincero","sincero"],"ROS_guardia_01":["pacato","pacato","sincero"],"ROS_guardia_02":["sincero","sincero"],"ROS_guardia_03":["pacato","pacato"],"ROS_guardia_04":["pacato","sincero"],"ROS_guardia_05":["pacato","pacato"],"ROS_guardia_06":["pacato","sincero"],"ROS_guardia_07":["sincero","pacato","sincero"],"ROS_prima_porta_01":["pacato","pacato","sincero"],"ROS_prima_porta_02":["pacato","sincero"],"ROS_prima_porta_03":["sincero","gentile"],"ROS_prima_porta_04":["pacato","pacato"],"ROS_prima_porta_05":["sincero","pacato"],"ROS_prima_porta_06":["sincero","pacato"],"ROS_prima_porta_07":["sincero","sincero","sincero"],"LIV_primo_01":["sincero","pacato","sincero"],"LIV_primo_02":["pacato","pacato"],"LIV_primo_03":["pacato","sincero"],"LIV_primo_04":["pacato","pacato"],"LIV_primo_05":["pacato","pacato"],"LIV_primo_06":["sincero","pacato"],"LIV_primo_07":["pacato","sincero","sincero"],"LIV_affido_01":["sincero","pacato","sincero"],"LIV_affido_02":["sincero","pacato"],"LIV_affido_03":["sincero","pacato"],"LIV_affido_04":["sincero","pacato"],"LIV_affido_05":["sincero","pacato"],"LIV_affido_06":["sincero","pacato"],"LIV_affido_07":["sincero","pacato","sincero"],"LIV_ottavio_01":["pacato","pacato","sincero"],"LIV_ottavio_02":["pacato","pacato"],"LIV_ottavio_03":["pacato","pacato"],"LIV_ottavio_04":["gentile","pacato"],"LIV_ottavio_05":["pacato","pacato"],"LIV_ottavio_06":["pacato","pacato"],"LIV_ottavio_07":["sincero","sincero","sincero"],"LIV_fiducia_01":["sincero","sincero","sincero"],"LIV_fiducia_02":["sincero","sincero"],"LIV_fiducia_03":["sincero","sincero"],"LIV_fiducia_04":["pacato","pacato"],"LIV_fiducia_05":["sincero","pacato"],"LIV_fiducia_06":["sincero","sincero"],"LIV_fiducia_07":["sincero","pacato","sincero"],"LIV_irene_01":["pacato","pacato","sincero"],"LIV_irene_02":["pacato","pacato"],"LIV_irene_03":["pacato","pacato"],"LIV_irene_04":["sincero","pacato"],"LIV_irene_05":["pacato","pacato"],"LIV_irene_06":["pacato","pacato"],"LIV_irene_07":["pacato","pacato","sincero"],"LIV_promessa_01":["sincero","pacato","sincero"],"LIV_promessa_02":["sincero","pacato"],"LIV_promessa_03":["sincero","gentile"],"LIV_promessa_04":["pacato","sincero"],"LIV_promessa_05":["sincero","sincero"],"LIV_promessa_06":["sincero","sincero"],"LIV_promessa_07":["sincero","sincero","sincero"],"PRE_1_03":["pacato","freddo"],"PRE_1_07":["pacato","pacato","freddo"],"PRE_2_03":["pacato","pacato"],"PRE_2_07":["pacato","pacato","freddo"],"PRE_3_03":["pacato","pacato"],"PRE_3_07":["pacato","pacato","freddo"],"PRE_4_03":["freddo","pacato"],"PRE_4_07":["gentile","pacato","freddo"],"V2_E01_01":["sincero","pacato"],"V2_E01_02":["pacato","pacato"],"V2_E02_01":["sincero","pacato"],"V2_E02_02":["pacato","pacato"],"V2_E03_01":["sincero","pacato"],"V2_E03_02":["pacato","pacato"],"V2_E04_01":["sincero","pacato"],"V2_E04_02":["pacato","pacato"],"V2_E05_01":["sincero","pacato"],"V2_E05_02":["pacato","pacato"],"V2_E06_01":["sincero","pacato"],"V2_E06_02":["pacato","pacato"],"V2_E07_01":["sincero","pacato"],"V2_E07_02":["pacato","pacato"],"V2_E08_01":["sincero","pacato"],"V2_E08_02":["pacato","pacato"],"V2_E09_01":["sincero","pacato"],"V2_E09_02":["pacato","pacato"],"V2_E10_01":["sincero","pacato"],"V2_E10_02":["pacato","pacato"],"V2_E11_01":["sincero","pacato"],"V2_E11_02":["pacato","pacato"],"V2_E12_01":["sincero","pacato"],"V2_E12_02":["pacato","pacato"],"V2_R01_01":["sincero","pacato"],"V2_R01_02":["pacato","pacato"],"V2_R02_01":["sincero","pacato"],"V2_R02_02":["pacato","pacato"],"V2_R03_01":["sincero","pacato"],"V2_R03_02":["pacato","pacato"],"V2_R04_01":["sincero","pacato"],"V2_R04_02":["pacato","pacato"],"V2_R05_01":["sincero","pacato"],"V2_R05_02":["pacato","pacato"],"V2_R06_01":["sincero","pacato"],"V2_R06_02":["pacato","pacato"],"V2_R07_01":["sincero","pacato"],"V2_R07_02":["pacato","pacato"],"V2_R08_01":["sincero","pacato"],"V2_R08_02":["pacato","pacato"],"V2_R09_01":["sincero","pacato"],"V2_R09_02":["pacato","pacato"],"V2_R10_01":["sincero","pacato"],"V2_R10_02":["pacato","pacato"],"V2_L01_01":["sincero","pacato"],"V2_L01_02":["pacato","pacato"],"V2_L02_01":["sincero","pacato"],"V2_L02_02":["sincero","pacato"],"V2_L03_01":["sincero","pacato"],"V2_L03_02":["pacato","pacato"],"V2_L04_01":["sincero","pacato"],"V2_L04_02":["sincero","pacato"],"V2_L05_01":["sincero","pacato"],"V2_L05_02":["pacato","pacato"],"V2_L06_01":["sincero","pacato"],"V2_L06_02":["pacato","pacato"],"V2_ELE_s25_01":["sincero","ironico"],"V2_ELE_s25_02":["sincero","gentile"],"V2_ELE_s25_03":["sincero","pacato"],"V2_ELE_s25_04":["sincero","pacato"],"V2_ELE_s50_01":["ironico","sincero"],"V2_ELE_s50_02":["sincero","ironico"],"V2_ELE_s50_03":["sincero","gentile"],"V2_ELE_s50_04":["sincero","gentile"],"V2_ELE_s75_01":["sincero","sincero"],"V2_ELE_s75_02":["sincero","pacato"],"V2_ELE_s75_03":["sincero","sincero"],"V2_ELE_s75_04":["sincero","pacato"],"V2_ELE_s100_01":["sincero","sincero"],"V2_ELE_s100_02":["sincero","gentile"],"V2_ELE_s100_03":["sincero","pacato"],"V2_ELE_s100_04":["gentile","sincero"],"V2_ROS_s25_01":["pacato","ironico"],"V2_ROS_s25_02":["pacato","pacato"],"V2_ROS_s25_03":["pacato","ironico"],"V2_ROS_s25_04":["sincero","pacato"],"V2_ROS_s50_01":["gentile","ironico"],"V2_ROS_s50_02":["ironico","gentile"],"V2_ROS_s50_03":["pacato","sincero"],"V2_ROS_s50_04":["gentile","sincero"],"V2_ROS_s75_01":["pacato","sincero"],"V2_ROS_s75_02":["pacato","ironico"],"V2_ROS_s75_03":["sincero","pacato"],"V2_ROS_s75_04":["sincero","sincero"],"V2_ROS_s100_01":["sincero","sincero"],"V2_ROS_s100_02":["sincero","pacato"],"V2_ROS_s100_03":["sincero","sincero"],"V2_ROS_s100_04":["sincero","pacato"],"V2_LIV_s25_01":["ironico","sincero"],"V2_LIV_s25_02":["gentile","pacato"],"V2_LIV_s25_03":["ironico","gentile"],"V2_LIV_s25_04":["pacato","gentile"],"V2_LIV_s50_01":["ironico","gentile"],"V2_LIV_s50_02":["gentile","ironico"],"V2_LIV_s50_03":["gentile","sincero"],"V2_LIV_s50_04":["gentile","pacato"],"V2_LIV_s75_01":["gentile","sincero"],"V2_LIV_s75_02":["pacato","gentile"],"V2_LIV_s75_03":["sincero","sincero"],"V2_LIV_s75_04":["sincero","sincero"],"V2_LIV_s100_01":["sincero","sincero"],"V2_LIV_s100_02":["sincero","pacato"],"V2_LIV_s100_03":["sincero","pacato"],"V2_LIV_s100_04":["sincero","gentile"],"V2_PRE_s25_01":["freddo","gentile"],"V2_PRE_s25_02":["pacato","freddo"],"V2_PRE_s25_03":["pacato","pacato"],"V2_PRE_s25_04":["freddo","pacato"],"V2_PRE_s50_01":["pacato","sincero"],"V2_PRE_s50_02":["gentile","freddo"],"V2_PRE_s50_03":["pacato","freddo"],"V2_PRE_s50_04":["pacato","freddo"],"V2_PRE_s75_01":["gentile","freddo"],"V2_PRE_s75_02":["pacato","freddo"],"V2_PRE_s75_03":["pacato","pacato"],"V2_PRE_s75_04":["freddo","pacato"],"V2_LUOGO_tokyo_01":["sincero","pacato"],"V2_LUOGO_tokyo_02":["pacato","gentile"],"V2_LUOGO_tokyo_03":["pacato","ironico"],"V2_LUOGO_tokyo_04":["gentile","ironico"],"V2_LUOGO_roma_01":["ironico","sincero"],"V2_LUOGO_roma_02":["ironico","pacato"],"V2_LUOGO_roma_03":["sincero","ironico"],"V2_LUOGO_roma_04":["ironico","pacato"],"V2_LUOGO_parigi_01":["sincero","sincero"],"V2_LUOGO_parigi_02":["pacato","sincero"],"V2_LUOGO_parigi_03":["sincero","sincero"],"V2_LUOGO_parigi_04":["sincero","pacato"],"V2_LUOGO_londra_01":["pacato","pacato"],"V2_LUOGO_londra_02":["pacato","sincero"],"V2_LUOGO_londra_03":["pacato","sincero"],"V2_LUOGO_londra_04":["ironico","pacato"],"V2_LUOGO_stoccolma_01":["sincero","pacato"],"V2_LUOGO_stoccolma_02":["gentile","sincero"],"V2_LUOGO_stoccolma_03":["pacato","pacato"],"V2_LUOGO_stoccolma_04":["sincero","gentile"],"V2_LUOGO_berlino_01":["sincero","pacato"],"V2_LUOGO_berlino_02":["pacato","sincero"],"V2_LUOGO_berlino_03":["pacato","sincero"],"V2_LUOGO_berlino_04":["pacato","sboccato"],"V2_LUOGO_praga_01":["pacato","sincero"],"V2_LUOGO_praga_02":["pacato","sincero"],"V2_LUOGO_praga_03":["pacato","pacato"],"V2_LUOGO_praga_04":["sincero","pacato"],"V2_LUOGO_vienna_01":["sincero","pacato"],"V2_LUOGO_vienna_02":["sincero","pacato"],"V2_LUOGO_vienna_03":["pacato","sincero"],"V2_LUOGO_vienna_04":["sincero","pacato"],"V2_LUOGO_madrid_01":["pacato","pacato"],"V2_LUOGO_madrid_02":["pacato","sincero"],"V2_LUOGO_madrid_03":["sincero","pacato"],"V2_LUOGO_madrid_04":["pacato","sincero"],"V2_LUOGO_lisbona_01":["pacato","sincero"],"V2_LUOGO_lisbona_02":["pacato","sincero"],"V2_LUOGO_lisbona_03":["sincero","pacato"],"V2_LUOGO_lisbona_04":["pacato","sincero"],"V2_LUOGO_atene_01":["sincero","pacato"],"V2_LUOGO_atene_02":["pacato","sincero"],"V2_LUOGO_atene_03":["pacato","sincero"],"V2_LUOGO_atene_04":["sincero","pacato"],"V2_LUOGO_washington_01":["pacato","sincero"],"V2_LUOGO_washington_02":["pacato","pacato"],"V2_LUOGO_washington_03":["pacato","sincero"],"V2_LUOGO_washington_04":["sincero","sincero"],"V2_CASA_01_M1":["pacato","pacato"],"V2_CASA_01_Q1_M1":["pacato","pacato"],"V2_CASA_01_M2":["pacato","pacato"],"V2_CASA_01_Q2_M2":["pacato","pacato"],"V2_CASA_01_M3":["pacato","pacato","pacato"],"V2_CASA_01_Q1_M3":["pacato","pacato"],"V2_CASA_01_Q2_M3":["pacato","pacato"],"V2_CASA_01_M4":["pacato","pacato"],"V2_CASA_01_Q3_M4":["pacato","pacato"],"V2_CASA_01_M5":["pacato","pacato","pacato"],"V2_CASA_01_Q1_M5":["pacato","pacato"],"V2_CASA_01_Q3_M5":["pacato","pacato"],"V2_CASA_01_M6":["pacato","pacato","pacato"],"V2_CASA_01_Q2_M6":["pacato","pacato"],"V2_CASA_01_Q3_M6":["pacato","pacato"],"V2_CASA_01":["pacato","pacato","pacato"],"V2_CASA_01_Q1_M7":["pacato","pacato"],"V2_CASA_01_Q2_M7":["pacato","pacato"],"V2_CASA_01_Q3_M7":["pacato","pacato"],"V2_CASA_01_P_M1":["pacato","pacato"],"V2_CASA_01_P_Q1_M1":["pacato","pacato"],"V2_CASA_01_P_M2":["pacato","pacato"],"V2_CASA_01_P_Q2_M2":["pacato","pacato"],"V2_CASA_01_P_M3":["pacato","pacato","pacato"],"V2_CASA_01_P_Q1_M3":["pacato","pacato"],"V2_CASA_01_P_Q2_M3":["pacato","pacato"],"V2_CASA_01_P_M4":["pacato","pacato"],"V2_CASA_01_P_Q3_M4":["pacato","pacato"],"V2_CASA_01_P_M5":["pacato","pacato","pacato"],"V2_CASA_01_P_Q1_M5":["pacato","pacato"],"V2_CASA_01_P_Q3_M5":["pacato","pacato"],"V2_CASA_01_P_M6":["pacato","pacato","pacato"],"V2_CASA_01_P_Q2_M6":["pacato","pacato"],"V2_CASA_01_P_Q3_M6":["pacato","pacato"],"V2_CASA_01_P":["pacato","pacato","pacato"],"V2_CASA_01_P_Q1_M7":["pacato","pacato"],"V2_CASA_01_P_Q2_M7":["pacato","pacato"],"V2_CASA_01_P_Q3_M7":["pacato","pacato"],"V2_CASA_02_M1":["pacato","pacato"],"V2_CASA_02_Q1_M1":["pacato","pacato"],"V2_CASA_02_M2":["pacato","pacato"],"V2_CASA_02_Q2_M2":["pacato","pacato"],"V2_CASA_02_M3":["pacato","pacato","pacato"],"V2_CASA_02_Q1_M3":["pacato","pacato"],"V2_CASA_02_Q2_M3":["pacato","pacato"],"V2_CASA_02_M4":["pacato","pacato"],"V2_CASA_02_Q3_M4":["pacato","pacato"],"V2_CASA_02_M5":["pacato","pacato","pacato"],"V2_CASA_02_Q1_M5":["pacato","pacato"],"V2_CASA_02_Q3_M5":["pacato","pacato"],"V2_CASA_02_M6":["pacato","pacato","pacato"],"V2_CASA_02_Q2_M6":["pacato","pacato"],"V2_CASA_02_Q3_M6":["pacato","pacato"],"V2_CASA_02":["pacato","pacato","pacato"],"V2_CASA_02_Q1_M7":["pacato","pacato"],"V2_CASA_02_Q2_M7":["pacato","pacato"],"V2_CASA_02_Q3_M7":["pacato","pacato"],"V2_CASA_02_P_M1":["pacato","pacato"],"V2_CASA_02_P_Q1_M1":["pacato","pacato"],"V2_CASA_02_P_M2":["pacato","pacato"],"V2_CASA_02_P_Q2_M2":["pacato","pacato"],"V2_CASA_02_P_M3":["pacato","pacato","pacato"],"V2_CASA_02_P_Q1_M3":["pacato","pacato"],"V2_CASA_02_P_Q2_M3":["pacato","pacato"],"V2_CASA_02_P_M4":["pacato","pacato"],"V2_CASA_02_P_Q3_M4":["pacato","pacato"],"V2_CASA_02_P_M5":["pacato","pacato","pacato"],"V2_CASA_02_P_Q1_M5":["pacato","pacato"],"V2_CASA_02_P_Q3_M5":["pacato","pacato"],"V2_CASA_02_P_M6":["pacato","pacato","pacato"],"V2_CASA_02_P_Q2_M6":["pacato","pacato"],"V2_CASA_02_P_Q3_M6":["pacato","pacato"],"V2_CASA_02_P":["pacato","pacato","pacato"],"V2_CASA_02_P_Q1_M7":["pacato","pacato"],"V2_CASA_02_P_Q2_M7":["pacato","pacato"],"V2_CASA_02_P_Q3_M7":["pacato","pacato"],"V2_CASA_03_M1":["pacato","pacato"],"V2_CASA_03_Q1_M1":["pacato","pacato"],"V2_CASA_03_M2":["pacato","pacato"],"V2_CASA_03_Q2_M2":["pacato","pacato"],"V2_CASA_03_M3":["pacato","pacato","pacato"],"V2_CASA_03_Q1_M3":["pacato","pacato"],"V2_CASA_03_Q2_M3":["pacato","pacato"],"V2_CASA_03_M4":["pacato","pacato"],"V2_CASA_03_Q3_M4":["pacato","pacato"],"V2_CASA_03_M5":["pacato","pacato","pacato"],"V2_CASA_03_Q1_M5":["pacato","pacato"],"V2_CASA_03_Q3_M5":["pacato","pacato"],"V2_CASA_03_M6":["pacato","pacato","pacato"],"V2_CASA_03_Q2_M6":["pacato","pacato"],"V2_CASA_03_Q3_M6":["pacato","pacato"],"V2_CASA_03":["pacato","pacato","pacato"],"V2_CASA_03_Q1_M7":["pacato","pacato"],"V2_CASA_03_Q2_M7":["pacato","pacato"],"V2_CASA_03_Q3_M7":["pacato","pacato"],"V2_CASA_03_P_M1":["pacato","pacato"],"V2_CASA_03_P_Q1_M1":["pacato","pacato"],"V2_CASA_03_P_M2":["pacato","pacato"],"V2_CASA_03_P_Q2_M2":["pacato","pacato"],"V2_CASA_03_P_M3":["pacato","pacato","pacato"],"V2_CASA_03_P_Q1_M3":["pacato","pacato"],"V2_CASA_03_P_Q2_M3":["pacato","pacato"],"V2_CASA_03_P_M4":["pacato","pacato"],"V2_CASA_03_P_Q3_M4":["pacato","pacato"],"V2_CASA_03_P_M5":["pacato","pacato","pacato"],"V2_CASA_03_P_Q1_M5":["pacato","pacato"],"V2_CASA_03_P_Q3_M5":["pacato","pacato"],"V2_CASA_03_P_M6":["pacato","pacato","pacato"],"V2_CASA_03_P_Q2_M6":["pacato","pacato"],"V2_CASA_03_P_Q3_M6":["pacato","pacato"],"V2_CASA_03_P":["pacato","pacato","pacato"],"V2_CASA_03_P_Q1_M7":["pacato","pacato"],"V2_CASA_03_P_Q2_M7":["pacato","pacato"],"V2_CASA_03_P_Q3_M7":["pacato","pacato"],"V2_CASA_04_M1":["pacato","pacato"],"V2_CASA_04_Q1_M1":["pacato","pacato"],"V2_CASA_04_M2":["pacato","pacato"],"V2_CASA_04_Q2_M2":["pacato","pacato"],"V2_CASA_04_M3":["pacato","pacato","pacato"],"V2_CASA_04_Q1_M3":["pacato","pacato"],"V2_CASA_04_Q2_M3":["pacato","pacato"],"V2_CASA_04_M4":["pacato","pacato"],"V2_CASA_04_Q3_M4":["pacato","pacato"],"V2_CASA_04_M5":["pacato","pacato","pacato"],"V2_CASA_04_Q1_M5":["pacato","pacato"],"V2_CASA_04_Q3_M5":["pacato","pacato"],"V2_CASA_04_M6":["pacato","pacato","pacato"],"V2_CASA_04_Q2_M6":["pacato","pacato"],"V2_CASA_04_Q3_M6":["pacato","pacato"],"V2_CASA_04":["pacato","pacato","pacato"],"V2_CASA_04_Q1_M7":["pacato","pacato"],"V2_CASA_04_Q2_M7":["pacato","pacato"],"V2_CASA_04_Q3_M7":["pacato","pacato"],"V2_CASA_04_P_M1":["pacato","pacato"],"V2_CASA_04_P_Q1_M1":["pacato","pacato"],"V2_CASA_04_P_M2":["pacato","pacato"],"V2_CASA_04_P_Q2_M2":["pacato","pacato"],"V2_CASA_04_P_M3":["pacato","pacato","pacato"],"V2_CASA_04_P_Q1_M3":["pacato","pacato"],"V2_CASA_04_P_Q2_M3":["pacato","pacato"],"V2_CASA_04_P_M4":["pacato","pacato"],"V2_CASA_04_P_Q3_M4":["pacato","pacato"],"V2_CASA_04_P_M5":["pacato","pacato","pacato"],"V2_CASA_04_P_Q1_M5":["pacato","pacato"],"V2_CASA_04_P_Q3_M5":["pacato","pacato"],"V2_CASA_04_P_M6":["pacato","pacato","pacato"],"V2_CASA_04_P_Q2_M6":["pacato","pacato"],"V2_CASA_04_P_Q3_M6":["pacato","pacato"],"V2_CASA_04_P":["pacato","pacato","pacato"],"V2_CASA_04_P_Q1_M7":["pacato","pacato"],"V2_CASA_04_P_Q2_M7":["pacato","pacato"],"V2_CASA_04_P_Q3_M7":["pacato","pacato"],"V2_CASA_05_M1":["pacato","pacato"],"V2_CASA_05_Q1_M1":["pacato","pacato"],"V2_CASA_05_M2":["pacato","pacato"],"V2_CASA_05_Q2_M2":["pacato","pacato"],"V2_CASA_05_M3":["pacato","pacato","pacato"],"V2_CASA_05_Q1_M3":["pacato","pacato"],"V2_CASA_05_Q2_M3":["pacato","pacato"],"V2_CASA_05_M4":["pacato","pacato"],"V2_CASA_05_Q3_M4":["pacato","pacato"],"V2_CASA_05_M5":["pacato","pacato","pacato"],"V2_CASA_05_Q1_M5":["pacato","pacato"],"V2_CASA_05_Q3_M5":["pacato","pacato"],"V2_CASA_05_M6":["pacato","pacato","pacato"],"V2_CASA_05_Q2_M6":["pacato","pacato"],"V2_CASA_05_Q3_M6":["pacato","pacato"],"V2_CASA_05":["pacato","pacato","pacato"],"V2_CASA_05_Q1_M7":["pacato","pacato"],"V2_CASA_05_Q2_M7":["pacato","pacato"],"V2_CASA_05_Q3_M7":["pacato","pacato"],"V2_CASA_05_P_M1":["pacato","pacato"],"V2_CASA_05_P_Q1_M1":["pacato","pacato"],"V2_CASA_05_P_M2":["pacato","pacato"],"V2_CASA_05_P_Q2_M2":["pacato","pacato"],"V2_CASA_05_P_M3":["pacato","pacato","pacato"],"V2_CASA_05_P_Q1_M3":["pacato","pacato"],"V2_CASA_05_P_Q2_M3":["pacato","pacato"],"V2_CASA_05_P_M4":["pacato","pacato"],"V2_CASA_05_P_Q3_M4":["pacato","pacato"],"V2_CASA_05_P_M5":["pacato","pacato","pacato"],"V2_CASA_05_P_Q1_M5":["pacato","pacato"],"V2_CASA_05_P_Q3_M5":["pacato","pacato"],"V2_CASA_05_P_M6":["pacato","pacato","pacato"],"V2_CASA_05_P_Q2_M6":["pacato","pacato"],"V2_CASA_05_P_Q3_M6":["pacato","pacato"],"V2_CASA_05_P":["pacato","pacato","pacato"],"V2_CASA_05_P_Q1_M7":["pacato","pacato"],"V2_CASA_05_P_Q2_M7":["pacato","pacato"],"V2_CASA_05_P_Q3_M7":["pacato","pacato"],"V2_CASA_06_M1":["pacato","pacato"],"V2_CASA_06_Q1_M1":["pacato","pacato"],"V2_CASA_06_M2":["pacato","pacato"],"V2_CASA_06_Q2_M2":["pacato","pacato"],"V2_CASA_06_M3":["pacato","pacato","pacato"],"V2_CASA_06_Q1_M3":["pacato","pacato"],"V2_CASA_06_Q2_M3":["pacato","pacato"],"V2_CASA_06_M4":["pacato","pacato"],"V2_CASA_06_Q3_M4":["pacato","pacato"],"V2_CASA_06_M5":["pacato","pacato","pacato"],"V2_CASA_06_Q1_M5":["pacato","pacato"],"V2_CASA_06_Q3_M5":["pacato","pacato"],"V2_CASA_06_M6":["pacato","pacato","pacato"],"V2_CASA_06_Q2_M6":["pacato","pacato"],"V2_CASA_06_Q3_M6":["pacato","pacato"],"V2_CASA_06":["pacato","pacato","pacato"],"V2_CASA_06_Q1_M7":["pacato","pacato"],"V2_CASA_06_Q2_M7":["pacato","pacato"],"V2_CASA_06_Q3_M7":["pacato","pacato"],"V2_CASA_06_P_M1":["pacato","pacato"],"V2_CASA_06_P_Q1_M1":["pacato","pacato"],"V2_CASA_06_P_M2":["pacato","pacato"],"V2_CASA_06_P_Q2_M2":["pacato","pacato"],"V2_CASA_06_P_M3":["pacato","pacato","pacato"],"V2_CASA_06_P_Q1_M3":["pacato","pacato"],"V2_CASA_06_P_Q2_M3":["pacato","pacato"],"V2_CASA_06_P_M4":["pacato","pacato"],"V2_CASA_06_P_Q3_M4":["pacato","pacato"],"V2_CASA_06_P_M5":["pacato","pacato","pacato"],"V2_CASA_06_P_Q1_M5":["pacato","pacato"],"V2_CASA_06_P_Q3_M5":["pacato","pacato"],"V2_CASA_06_P_M6":["pacato","pacato","pacato"],"V2_CASA_06_P_Q2_M6":["pacato","pacato"],"V2_CASA_06_P_Q3_M6":["pacato","pacato"],"V2_CASA_06_P":["pacato","pacato","pacato"],"V2_CASA_06_P_Q1_M7":["pacato","pacato"],"V2_CASA_06_P_Q2_M7":["pacato","pacato"],"V2_CASA_06_P_Q3_M7":["pacato","pacato"],"V2_CASA_07_M1":["pacato","pacato"],"V2_CASA_07_Q1_M1":["pacato","pacato"],"V2_CASA_07_M2":["pacato","pacato"],"V2_CASA_07_Q2_M2":["pacato","pacato"],"V2_CASA_07_M3":["pacato","pacato","pacato"],"V2_CASA_07_Q1_M3":["pacato","pacato"],"V2_CASA_07_Q2_M3":["pacato","pacato"],"V2_CASA_07_M4":["pacato","pacato"],"V2_CASA_07_Q3_M4":["pacato","pacato"],"V2_CASA_07_M5":["pacato","pacato","pacato"],"V2_CASA_07_Q1_M5":["pacato","pacato"],"V2_CASA_07_Q3_M5":["pacato","pacato"],"V2_CASA_07_M6":["pacato","pacato","pacato"],"V2_CASA_07_Q2_M6":["pacato","pacato"],"V2_CASA_07_Q3_M6":["pacato","pacato"],"V2_CASA_07":["pacato","pacato","pacato"],"V2_CASA_07_Q1_M7":["pacato","pacato"],"V2_CASA_07_Q2_M7":["pacato","pacato"],"V2_CASA_07_Q3_M7":["pacato","pacato"],"V2_CASA_07_P_M1":["pacato","pacato"],"V2_CASA_07_P_Q1_M1":["pacato","pacato"],"V2_CASA_07_P_M2":["pacato","pacato"],"V2_CASA_07_P_Q2_M2":["pacato","pacato"],"V2_CASA_07_P_M3":["pacato","pacato","pacato"],"V2_CASA_07_P_Q1_M3":["pacato","pacato"],"V2_CASA_07_P_Q2_M3":["pacato","pacato"],"V2_CASA_07_P_M4":["pacato","pacato"],"V2_CASA_07_P_Q3_M4":["pacato","pacato"],"V2_CASA_07_P_M5":["pacato","pacato","pacato"],"V2_CASA_07_P_Q1_M5":["pacato","pacato"],"V2_CASA_07_P_Q3_M5":["pacato","pacato"],"V2_CASA_07_P_M6":["pacato","pacato","pacato"],"V2_CASA_07_P_Q2_M6":["pacato","pacato"],"V2_CASA_07_P_Q3_M6":["pacato","pacato"],"V2_CASA_07_P":["pacato","pacato","pacato"],"V2_CASA_07_P_Q1_M7":["pacato","pacato"],"V2_CASA_07_P_Q2_M7":["pacato","pacato"],"V2_CASA_07_P_Q3_M7":["pacato","pacato"],"V2_CASA_08_M1":["pacato","pacato"],"V2_CASA_08_Q1_M1":["pacato","pacato"],"V2_CASA_08_M2":["pacato","pacato"],"V2_CASA_08_Q2_M2":["pacato","pacato"],"V2_CASA_08_M3":["pacato","pacato","pacato"],"V2_CASA_08_Q1_M3":["pacato","pacato"],"V2_CASA_08_Q2_M3":["pacato","pacato"],"V2_CASA_08_M4":["pacato","pacato"],"V2_CASA_08_Q3_M4":["pacato","pacato"],"V2_CASA_08_M5":["pacato","pacato","pacato"],"V2_CASA_08_Q1_M5":["pacato","pacato"],"V2_CASA_08_Q3_M5":["pacato","pacato"],"V2_CASA_08_M6":["pacato","pacato","pacato"],"V2_CASA_08_Q2_M6":["pacato","pacato"],"V2_CASA_08_Q3_M6":["pacato","pacato"],"V2_CASA_08":["pacato","pacato","pacato"],"V2_CASA_08_Q1_M7":["pacato","pacato"],"V2_CASA_08_Q2_M7":["pacato","pacato"],"V2_CASA_08_Q3_M7":["pacato","pacato"],"V2_CASA_08_P_M1":["pacato","pacato"],"V2_CASA_08_P_Q1_M1":["pacato","pacato"],"V2_CASA_08_P_M2":["pacato","pacato"],"V2_CASA_08_P_Q2_M2":["pacato","pacato"],"V2_CASA_08_P_M3":["pacato","pacato","pacato"],"V2_CASA_08_P_Q1_M3":["pacato","pacato"],"V2_CASA_08_P_Q2_M3":["pacato","pacato"],"V2_CASA_08_P_M4":["pacato","pacato"],"V2_CASA_08_P_Q3_M4":["pacato","pacato"],"V2_CASA_08_P_M5":["pacato","pacato","pacato"],"V2_CASA_08_P_Q1_M5":["pacato","pacato"],"V2_CASA_08_P_Q3_M5":["pacato","pacato"],"V2_CASA_08_P_M6":["pacato","pacato","pacato"],"V2_CASA_08_P_Q2_M6":["pacato","pacato"],"V2_CASA_08_P_Q3_M6":["pacato","pacato"],"V2_CASA_08_P":["pacato","pacato","pacato"],"V2_CASA_08_P_Q1_M7":["pacato","pacato"],"V2_CASA_08_P_Q2_M7":["pacato","pacato"],"V2_CASA_08_P_Q3_M7":["pacato","pacato"],"V2_VICINO_01":["pacato","pacato"],"V2_VICINO_02":["pacato","pacato"],"V2_VICINO_03":["pacato","pacato"],"V2_VICINO_04":["pacato","pacato"],"V2_VICINO_05":["pacato","pacato"],"V2_MARCO_costo_01":["pacato","sincero"],"V2_MARCO_costo_02":["pacato","pacato"],"V2_MARCO_costo_03":["pacato","pacato"],"V2_MARCO_costo_04":["pacato","pacato"],"V2_MARCO_costo_05":["sincero","sincero","sincero"],"V2_FAL_1_01":["pacato","sincero"],"V2_FAL_1_02":["sincero","sincero"],"V2_FAL_1_03":["pacato","sincero"],"V2_FAL_2_01":["sincero","sincero"],"V2_FAL_2_02":["sincero","sincero"],"V2_FAL_2_03":["pacato","sincero"],"V2_FAL_3_01":["sincero","sincero"],"V2_FAL_3_02":["sincero","sincero"],"V2_FAL_3_03":["sincero","pacato"],"V2_FAL_4_01":["sincero","pacato"],"V2_FAL_4_02":["sincero","pacato"],"V2_FAL_4_03":["pacato","sincero"],"V2_USCITA_01":["pacato","pacato"],"V2_USCITA_02":["pacato","sincero"],"V2_USCITA_03":["pacato","sincero"],"V2_USCITA_04":["sincero","sincero"],"V2_USCITA_05":["sincero","sincero"],"V2_GUARDIA_01":["pacato","pacato"],"V2_GUARDIA_02":["pacato","pacato"],"V2_GUARDIA_03":["pacato","sincero"],"V2_GUARDIA_04":["sincero","sincero"],"V2_GUARDIA_05":["pacato","sincero"],"V2_VARCO_01":["pacato","sincero"],"V2_VARCO_02":["pacato","sincero"],"V2_VARCO_03":["pacato","sincero"],"V2_VARCO_04":["pacato","sincero"],"V2_VARCO_05":["sincero","sincero","sincero"],"V2_ELE_n1_01":["sboccato","sincero"],"V2_ELE_n1_02":["ironico","gentile"],"V2_ELE_n1_03":["sincero","pacato"],"V2_ELE_n1_04":["gentile","gentile"],"V2_ELE_n2_01":["sincero","sincero"],"V2_ELE_n2_02":["sincero","sincero"],"V2_ELE_n2_03":["sincero","sincero"],"V2_ELE_n2_04":["gentile","pacato"],"V2_ELE_n3_01":["sincero","sincero"],"V2_ELE_n3_02":["ironico","sincero"],"V2_ELE_n3_03":["sincero","gentile"],"V2_ELE_n3_04":["sincero","ironico"],"V2_ELE_n4_01":["sincero","gentile"],"V2_ELE_n4_02":["sboccato","pacato"],"V2_ELE_n4_03":["sincero","sincero"],"V2_ELE_n4_04":["sincero","gentile"],"V2_ELE_n5_01":["sincero","sincero"],"V2_ELE_n5_02":["sincero","sincero"],"V2_ELE_n5_03":["sincero","sincero"],"V2_ELE_n5_04":["sincero","sincero"],"V2_ELE_n6_01":["sincero","sincero"],"V2_ELE_n6_02":["gentile","sincero"],"V2_ELE_n6_03":["sincero","sincero"],"V2_ELE_n6_04":["sboccato","pacato"],"V2_ROS_n1_01":["sboccato","sincero"],"V2_ROS_n1_02":["gentile","ironico"],"V2_ROS_n1_03":["pacato","gentile"],"V2_ROS_n1_04":["sincero","pacato"],"V2_ROS_n2_01":["sboccato","sincero"],"V2_ROS_n2_02":["sincero","pacato"],"V2_ROS_n2_03":["pacato","sboccato"],"V2_ROS_n2_04":["sincero","pacato"],"V2_ROS_n3_01":["sincero","pacato"],"V2_ROS_n3_02":["ironico","pacato"],"V2_ROS_n3_03":["ironico","pacato"],"V2_ROS_n3_04":["pacato","sboccato"],"V2_ROS_n4_01":["sincero","pacato"],"V2_ROS_n4_02":["ironico","sincero"],"V2_ROS_n4_03":["pacato","pacato"],"V2_ROS_n4_04":["sincero","pacato"],"V2_ROS_n5_01":["sincero","sincero"],"V2_ROS_n5_02":["sboccato","pacato"],"V2_ROS_n5_03":["sincero","gentile"],"V2_ROS_n5_04":["sincero","pacato"],"V2_ROS_n6_01":["sincero","sincero"],"V2_ROS_n6_02":["sincero","gentile"],"V2_ROS_n6_03":["sincero","pacato"],"V2_ROS_n6_04":["sincero","sincero"],"V2_LIV_n1_01":["ironico","pacato"],"V2_LIV_n1_02":["gentile","ironico"],"V2_LIV_n1_03":["pacato","gentile"],"V2_LIV_n1_04":["gentile","pacato"],"V2_LIV_n2_01":["pacato","gentile"],"V2_LIV_n2_02":["sincero","pacato"],"V2_LIV_n2_03":["sincero","gentile"],"V2_LIV_n2_04":["pacato","sincero"],"V2_LIV_n3_01":["ironico","gentile"],"V2_LIV_n3_02":["ironico","pacato"],"V2_LIV_n3_03":["gentile","sincero"],"V2_LIV_n3_04":["sincero","gentile"],"V2_LIV_n4_01":["sincero","sincero"],"V2_LIV_n4_02":["sincero","pacato"],"V2_LIV_n4_03":["sincero","sincero"],"V2_LIV_n4_04":["sincero","pacato"],"V2_LIV_n5_01":["sincero","pacato"],"V2_LIV_n5_02":["sincero","sincero"],"V2_LIV_n5_03":["pacato","pacato"],"V2_LIV_n5_04":["sincero","gentile"],"V2_LIV_n6_01":["sincero","sincero"],"V2_LIV_n6_02":["sincero","sincero"],"V2_LIV_n6_03":["sincero","pacato"],"V2_LIV_n6_04":["sincero","sincero"]};
const CHAT_UNLOCK = {"Elena":{"25":["V2_ELE_s25_01"],"50":["V2_ELE_s50_01"],"75":["V2_ELE_s75_01"],"100":["V2_ELE_s100_01"]},"Rosa":{"25":["V2_ROS_s25_01"],"50":["V2_ROS_s50_01"],"75":["V2_ROS_s75_01"],"100":["V2_ROS_s100_01"]},"Livia":{"25":["V2_LIV_s25_01"],"50":["V2_LIV_s50_01"],"75":["V2_LIV_s75_01"],"100":["V2_LIV_s100_01"]},"Sconosciuto":{"25":["V2_PRE_s25_01"],"50":["V2_PRE_s50_01"],"75":["V2_PRE_s75_01"]}};
