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
"opts":[
{
"t":"Parte.",
"to":"ELE_ritiro_02"
},
{
"t":"Ho scelto. Sto ancora facendo pace con la scelta.",
"to":"ELE_ritiro_02"
},
{
"t":"Una merda, ma è mia.",
"to":"ELE_ritiro_02"
}
]
},
{
"id":"ELE_ritiro_02",
"who":"Elena",
"fase":"I",
"text":"Parte è una descrizione o un programma?",
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
"to":"ELE_ritiro_06",
"fx":[
"flag:elena_foto_promessa"
]
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
}
]
},
{
"id":"ELE_ritiro_08",
"who":"Elena",
"fase":"I",
"text":"Va bene. Nonno, piano con tutte queste emozioni."
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
"t":"Pensavo mi stessi parlando della cena.",
"to":"ELE_pasta_03",
"fx":[
"flag:elena_equivoco_pasta"
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
"text":"Ti sento ridere. Sei veramente mio fratello.",
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
}
]
},
{
"id":"ELE_pasta_08",
"who":"Elena",
"fase":"I",
"text":"Guida. Qui con Pasta ci parlo io."
},
{
"id":"ELE_turno_01",
"who":"Elena",
"fase":"I",
"text":"Hai presente un turno con un orario sensato?",
"opts":[
{
"t":"Solo per sentito dire.",
"to":"ELE_turno_02"
},
{
"t":"Non chiedere a me oggi.",
"to":"ELE_turno_02"
},
{
"t":"Il mio turno è un cazzo di labirinto.",
"to":"ELE_turno_02"
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
"opts":[
{
"t":"Ti mando un messaggio.",
"to":"ELE_turno_06",
"fx":[
"flag:elena_aspetta_messaggio"
]
},
{
"t":"Se serve ti chiamo una volta.",
"to":"ELE_turno_07",
"fx":[
"flag:elena_una_chiamata"
]
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
}
]
},
{
"id":"ELE_turno_08",
"who":"Elena",
"fase":"I",
"text":"Adesso vai. Io cerco di capire quando mangiare."
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
"t":"Passamelo. Voglio verificare.",
"to":"ELE_coinquilino_03"
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
"to":"ELE_coinquilino_04",
"fx":[
"flag:elena_ascoltata"
]
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
"text":"Non gli passo il telefono. Devi voler male anche a te stesso.",
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
"to":"ELE_coinquilino_06",
"fx":[
"flag:elena_sfogo_ascoltato"
]
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
}
]
},
{
"id":"ELE_coinquilino_08",
"who":"Elena",
"fase":"I",
"text":"Vado. Ti richiamo quando ho qualcosa di meno noioso."
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
"t":"Se dico sì poi mi tocchi aspettare.",
"to":"ELE_cena_02"
},
{
"t":"Con questa macchina? Chiedimelo domani, che cazzo.",
"to":"ELE_cena_02"
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
"to":"ELE_cena_06",
"fx":[
"flag:elena_aggiornamento_cena"
]
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
}
]
},
{
"id":"ELE_cena_08",
"who":"Elena",
"fase":"I",
"text":"Ci sentiamo alla sosta. Io intanto mangio."
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
"t":"Quanto mi stai chiedendo?",
"to":"ELE_bollette_03"
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
"to":"ELE_bollette_06",
"fx":[
"flag:elena_spesa_prudente"
]
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
}
]
},
{
"id":"ELE_bollette_08",
"who":"Elena",
"fase":"I",
"text":"Adesso ti lascio ai tuoi rumori. Io ho le mie carte."
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
"t":"Sì. Questa volta ho aspettato.",
"to":"ELE_richiamo_03"
}
]
},
{
"id":"ELE_richiamo_02",
"who":"Elena",
"fase":"II",
"text":"Mi avevi detto che avresti scritto dalla sosta.",
"opts":[
{
"t":"Hai ragione. Ho rimandato troppo.",
"to":"ELE_richiamo_04",
"fx":[
"flag:elena_scuse_sosta"
]
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
"text":"Almeno questa chiamata la stai facendo da fermo.",
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
"to":"ELE_richiamo_06",
"fx":[
"flag:elena_tensione_ammessa"
]
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
}
]
},
{
"id":"ELE_richiamo_08",
"who":"Elena",
"fase":"II",
"text":"Mangia qualcosa. Mi richiami quando riparti, se puoi."
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
"t":"Mi stai chiedendo cose che non so.",
"to":"ELE_litigio_03"
},
{
"t":"Hai ragione. Sono stato uno stronzo.",
"to":"ELE_litigio_02",
"fx":[
"flag:elena_scuse"
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
"to":"ELE_litigio_06",
"fx":[
"flag:elena_richiamo_promesso"
]
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
"text":"Resto qui un minuto. Poi devi riposare.",
"opts":[
{
"t":"Grazie. Adesso mi basta.",
"to":"ELE_litigio_08"
},
{
"t":"Se non parlo, resta un momento.",
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
}
]
},
{
"id":"ELE_litigio_08",
"who":"Elena",
"fase":"II",
"text":"Nonno, la prossima volta comincia con sono stanco."
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
"t":"Sono qui. Lo so che non torna.",
"to":"ELE_distanza_02"
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
"t":"Non spostiamo le date per farle tornare.",
"to":"ELE_distanza_06",
"fx":[
"cnt:conoscenza+1",
"flag:distanza_confermata"
]
},
{
"t":"Mi basta che il luogo sia confermato.",
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
"text":"Preferisco sentirti fermo e arrabbiato che perderti la linea.",
"opts":[
{
"t":"Va bene. Ti ascolto.",
"to":"ELE_distanza_08"
},
{
"t":"Almeno su questo siamo d’accordo.",
"to":"ELE_distanza_08"
}
]
},
{
"id":"ELE_distanza_08",
"who":"Elena",
"fase":"II",
"text":"Ok. Resta lì un momento. Non fare cose."
},
{
"id":"ELE_riparazione_01",
"who":"Elena",
"fase":"III",
"text":"Ci siamo calmati?",
"opts":[
{
"t":"Io sì. E ti dovevo una chiamata decente.",
"to":"ELE_riparazione_02"
},
{
"t":"Sì. Possiamo ricominciare.",
"to":"ELE_riparazione_03"
}
]
},
{
"id":"ELE_riparazione_02",
"who":"Elena",
"fase":"III",
"text":"Prima mi hai chiesto scusa.",
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
"text":"Ti ascolto. Non devi raccontarmi tutto insieme.",
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
"to":"ELE_riparazione_08",
"fx":[
"flag:elena_una_cosa_vera"
]
},
{
"t":"Non lo uso più come risposta automatica.",
"to":"ELE_riparazione_08"
}
]
},
{
"id":"ELE_riparazione_08",
"who":"Elena",
"fase":"III",
"text":"Ci sentiamo. E mangia: non è un’opinione."
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
"t":"Oggi quel soprannome mi suona male.",
"to":"ELE_nonno_02"
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
}
]
},
{
"id":"ELE_nonno_08",
"who":"Elena",
"fase":"IV",
"text":"Adesso riposa. Litighi meglio quando hai dormito."
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
"t":"Hai fatto bene. Io non so ancora quando arrivo.",
"to":"ELE_cena_ritorno_03"
}
]
},
{
"id":"ELE_cena_ritorno_02",
"who":"Elena",
"fase":"V",
"text":"Mi avevi detto di non aspettarti.",
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
}
]
},
{
"id":"ELE_cena_ritorno_08",
"who":"Elena",
"fase":"V",
"text":"Ci sentiamo quando puoi. Io sono qui."
},
{
"id":"ELE_temperino_fissato",
"who":"Elena",
"fase":"I",
"text":"Con le chiavi ti hanno dato altro?",
"opts":[
{
"t":"Il temperino. Me l’aveva regalato Claudio.",
"to":"ELE_temperino_risposta",
"fx":[
"flag:temperino_detto_elena"
]
},
{
"t":"Una busta col temperino che mi aveva regalato.",
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
"text":"Allora quello almeno non è una cosa trovata a caso."
},
{
"id":"ELE_claudio_fissato",
"who":"Elena",
"fase":"I",
"text":"Tu Claudio quante volte l’avevi visto?",
"opts":[
{
"t":"Tre. Mi ha lasciato più cose di quante ne sapessi di lui.",
"to":"ELE_claudio_risposta",
"fx":[
"flag:claudio_tre_incontri_fissati"
]
},
{
"t":"Tre. Quasi non lo conoscevo.",
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
"text":"Era quasi uno sconosciuto anche per me. Non devi fingere il contrario."
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
"opts":[
{
"t":"Questo?",
"to":"ROS_attrezzi_02",
"fx":[
"flag:rosa_attrezzo_subito"
]
},
{
"t":"Controllavo se ripartiva.",
"to":"ROS_attrezzi_02",
"fx":[
"flag:rosa_avviamenti"
]
},
{
"t":"Cazzo, mi sono distratto. Che attrezzo è?",
"to":"ROS_attrezzi_02"
}
]
},
{
"id":"ROS_attrezzi_02",
"who":"Rosa",
"fase":"II",
"text":"Si ripara con gli attrezzi, non con la fiducia.",
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
"to":"ROS_attrezzi_06",
"fx":[
"flag:rosa_aiuto_offerto"
]
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
}
]
},
{
"id":"ROS_attrezzi_08",
"who":"Rosa",
"fase":"II",
"text":"Rosa. Se devi ringraziarmi, parti piano e senti come va."
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
"t":"Mi sono fermato davvero.",
"to":"ROS_prudenza_03"
},
{
"t":"Un caffè di merda, ma l'ho bevuto.",
"to":"ROS_prudenza_02"
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
"text":"Non mi chiedere quanti chilometri manca al sonno.",
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
}
]
},
{
"id":"ROS_prudenza_08",
"who":"Rosa",
"fase":"II",
"text":"Decidi da fermo. Io non ti faccio il tifo per crepare."
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
"t":"Non abbastanza. Dovevo farlo prima.",
"to":"ROS_ricontrollo_03"
}
]
},
{
"id":"ROS_ricontrollo_02",
"who":"Rosa",
"fase":"III",
"text":"Ti avevo detto prima di non tirare la notte.",
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
"text":"Non ti sto contando le ore. Ti sento parlare.",
"opts":[
{
"t":"Adesso parlo più piano apposta.",
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
}
]
},
{
"id":"ROS_ricontrollo_08",
"who":"Rosa",
"fase":"III",
"text":"Ti richiamo dopo. Non stare in piedi per aspettare me."
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
"t":"Se non vuoi raccontarlo, dimmelo.",
"to":"ROS_passato_03"
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
"to":"ROS_passato_07",
"fx":[
"flag:rosa_prima_prove"
]
}
]
},
{
"id":"ROS_passato_06",
"who":"Rosa",
"fase":"III",
"text":"Puoi ascoltare senza dirmi che andrà bene.",
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
}
]
},
{
"id":"ROS_passato_08",
"who":"Rosa",
"fase":"III",
"text":"Quando sapremo dove andare, ne riparliamo."
},
{
"id":"ROS_promessa_01",
"who":"Rosa",
"fase":"III",
"text":"Prima hai detto che mi aiuti. Sai che cosa stai promettendo?",
"opts":[
{
"t":"Ti aiuto a cercarlo, non apro alla cieca.",
"to":"ROS_promessa_02"
},
{
"t":"Voglio chiarirla prima di entrare.",
"to":"ROS_promessa_02"
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
"t":"Prima distinguiamo chi abbiamo davanti.",
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
"text":"Va bene. Adesso abbiamo almeno una promessa comprensibile."
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
"t":"Prima volevo guardare l’auto.",
"to":"ROS_dopo_passaggio_03"
},
{
"t":"Cazzo, no. Ma dammi un secondo.",
"to":"ROS_dopo_passaggio_02"
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
"to":"ROS_dopo_passaggio_06",
"fx":[
"flag:rosa_paura_ammessa"
]
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
"t":"Ti racconto quello che ricordo.",
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
"text":"Bene. Quello che hai visto me lo racconti da fermo.",
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
}
]
},
{
"id":"ROS_dopo_passaggio_08",
"who":"Rosa",
"fase":"III",
"text":"Per il prossimo minuto basta respirare. Poi gli insulti."
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
"t":"La registrazione mostra che eri fuori.",
"to":"ROS_segni_02"
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
"t":"Prima la strada. Poi decidiamo.",
"to":"ROS_segni_06",
"fx":[
"cnt:conoscenza+1",
"flag:segni_rosa_verificati"
]
},
{
"t":"Non te lo chiedo senza un piano.",
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
}
]
},
{
"id":"ROS_segni_08",
"who":"Rosa",
"fase":"IV",
"text":"Conserva quella prova. Voglio sapere cosa abbiamo visto davvero."
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
"t":"Prima voglio riguardare il punto d’attesa.",
"to":"ROS_recupero_03"
}
]
},
{
"id":"ROS_recupero_02",
"who":"Rosa",
"fase":"V",
"text":"Prima mi hai detto che non aprivi alla cieca. Bene.",
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
"t":"Vengo al punto d’attesa.",
"to":"ROS_recupero_07",
"fx":[
"cnt:legami+1",
"flag:recupero_ottavio_accettato"
]
},
{
"t":"Resto a preparare un’alternativa.",
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
"opts":[
{
"t":"Non ti prometto il risultato.",
"to":"ROS_recupero_08"
},
{
"t":"Ti prometto che non fingo di sapere.",
"to":"ROS_recupero_08"
}
]
},
{
"id":"ROS_recupero_08",
"who":"Rosa",
"fase":"V",
"text":"Tienimi la linea quando puoi. Quando guidi, guida."
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
"t":"Che cosa significa, davvero?",
"to":"ROS_guardia_03"
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
"to":"ROS_guardia_07",
"fx":[
"flag:prezzo_guardia_da_verificare"
]
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
}
]
},
{
"id":"ROS_guardia_08",
"who":"Rosa",
"fase":"V",
"text":"Prenditi il tempo che serve. Questa risposta non la strappo."
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
"t":"Ho bisogno che tu me lo dica ancora.",
"to":"ROS_prima_porta_03"
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
}
]
},
{
"id":"ROS_prima_porta_08",
"who":"Rosa",
"fase":"V",
"text":"Ci sentiamo prima della porta. Senza fare i duri, stavolta."
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
"t":"Claudio era mio zio.",
"to":"LIV_primo_02"
},
{
"t":"Dipende. Se è una multa, ero fuori città.",
"to":"LIV_primo_02"
}
]
},
{
"id":"LIV_primo_02",
"who":"Livia",
"fase":"III",
"text":"Lo conoscevo. Mi ha affidato degli originali.",
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
"t":"Segniamo solo la corrispondenza.",
"to":"LIV_primo_06",
"fx":[
"cnt:conoscenza+1",
"flag:proprietario_verificato"
]
},
{
"t":"Il resto lo teniamo come ipotesi.",
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
"text":"Questo è verificato. Il resto no, ancora.",
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
}
]
},
{
"id":"LIV_primo_08",
"who":"Livia",
"fase":"III",
"text":"Ti dico da dove viene ogni cosa. Tu fai lo stesso."
},
{
"id":"LIV_affido_01",
"who":"Livia",
"fase":"III",
"text":"L’originale deve restare fuori dalla rete.",
"opts":[
{
"t":"Ti affido l’originale.",
"to":"LIV_affido_02",
"fx":[
"cnt:legami+1",
"flag:prova_affidata",
"flag:livia"
]
},
{
"t":"Per ora tengo io la prova.",
"to":"LIV_affido_03",
"fx":[
"flag:prova_trattenuta"
]
}
]
},
{
"id":"LIV_affido_02",
"who":"Livia",
"fase":"III",
"text":"Se me lo affidi, hai una testimone indipendente.",
"opts":[
{
"t":"Tengo una copia e te lo affido.",
"to":"LIV_affido_04",
"fx":[
"flag:prova_affidata",
"flag:copia_conservata"
]
},
{
"t":"Voglio che resti custodito da te.",
"to":"LIV_affido_05",
"fx":[
"flag:prova_affidata"
]
}
]
},
{
"id":"LIV_affido_03",
"who":"Livia",
"fase":"III",
"text":"Se lo tieni, non posso garantirti quello che vedrai dopo.",
"opts":[
{
"t":"Lo tengo sapendo che manca il riscontro.",
"to":"LIV_affido_04"
},
{
"t":"Non ti chiedo di garantirlo.",
"to":"LIV_affido_05"
}
]
},
{
"id":"LIV_affido_04",
"who":"Livia",
"fase":"III",
"text":"Non ti chiedo di restare senza una copia.",
"opts":[
{
"t":"Annotiamo la fonte.",
"to":"LIV_affido_06"
},
{
"t":"Conserva l’originale fuori.",
"to":"LIV_affido_07"
}
]
},
{
"id":"LIV_affido_05",
"who":"Livia",
"fase":"III",
"text":"Capisco che non mi conosci abbastanza. Non è la stessa scelta.",
"opts":[
{
"t":"Ne riparliamo quando mi fiderò.",
"to":"LIV_affido_06"
},
{
"t":"Capisco che così non puoi accompagnarmi.",
"to":"LIV_affido_07"
}
]
},
{
"id":"LIV_affido_06",
"who":"Livia",
"fase":"III",
"text":"Allora registriamo che cosa mi affidi e dove resta.",
"opts":[
{
"t":"È un affidamento, non una rinuncia.",
"to":"LIV_affido_08"
},
{
"t":"Ti chiederò di confrontarlo più avanti.",
"to":"LIV_affido_08"
}
]
},
{
"id":"LIV_affido_07",
"who":"Livia",
"fase":"III",
"text":"Tieni aperta la possibilità di riparlarne.",
"opts":[
{
"t":"Non chiudo la porta tra noi.",
"to":"LIV_affido_08"
},
{
"t":"Non lo chiamerò un originale verificato.",
"to":"LIV_affido_08"
}
]
},
{
"id":"LIV_affido_08",
"who":"Livia",
"fase":"III",
"text":"L’importante è non fingere di aver fatto una verifica che manca."
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
"t":"Rosa mi ha parlato di lui.",
"to":"LIV_ottavio_02"
},
{
"t":"Preferisco non parlarne a quest'ora.",
"to":"LIV_ottavio_02"
}
]
},
{
"id":"LIV_ottavio_02",
"who":"Livia",
"fase":"III",
"text":"È mio fratello. Questo non rende vere tutte le mie speranze.",
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
"text":"Che sia ancora vivo, invece, lo credo. Non lo so.",
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
"to":"LIV_ottavio_06",
"fx":[
"flag:ottavio_chiamata_da_verificare"
]
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
"text":"Non voglio usare te per far diventare vera una cosa.",
"opts":[
{
"t":"Cerchiamo senza promettere il risultato.",
"to":"LIV_ottavio_08"
},
{
"t":"Non ti rispondo solo per consolarti.",
"to":"LIV_ottavio_08"
}
]
},
{
"id":"LIV_ottavio_08",
"who":"Livia",
"fase":"III",
"text":"Se trovi un segno, dimmi anche quello che non coincide."
},
{
"id":"LIV_fiducia_01",
"who":"Livia",
"fase":"IV",
"text":"Prima hai scelto di tenere la prova.",
"opts":[
{
"t":"Adesso voglio affidartela.",
"to":"LIV_fiducia_02",
"fx":[
"cnt:legami+1",
"flag:prova_affidata",
"flag:livia",
"flag:livia_fiducia_riparata"
]
},
{
"t":"La tengo ancora, ma ti ascolto.",
"to":"LIV_fiducia_03"
}
]
},
{
"id":"LIV_fiducia_02",
"who":"Livia",
"fase":"IV",
"text":"Non ti chiedo di fingere che non sia successo.",
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
"text":"Se hai cambiato idea, possiamo fare un confronto adesso.",
"opts":[
{
"t":"Facciamo il confronto e l’affidamento.",
"to":"LIV_fiducia_05"
},
{
"t":"La copia resta con me, l’originale da te.",
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
"text":"La fiducia serve anche a farsi correggere.",
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
"text":"Allora ricominciamo dalla fonte, insieme.",
"opts":[
{
"t":"Ripartiamo da qui.",
"to":"LIV_fiducia_08"
},
{
"t":"Ti dirò anche quando ho sbagliato.",
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
}
]
},
{
"id":"LIV_fiducia_08",
"who":"Livia",
"fase":"IV",
"text":"Questa volta almeno sappiamo quale scelta stiamo facendo."
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
"t":"Dimmi prima che cosa dimostra.",
"to":"LIV_irene_03"
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
"text":"Non dimostra ogni cosa che Claudio ha pensato dopo.",
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
"opts":[
{
"t":"Non apro soltanto perché è una porta.",
"to":"LIV_irene_08"
},
{
"t":"Prima riconosco chi la sorveglia.",
"to":"LIV_irene_08"
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
}
]
},
{
"id":"LIV_irene_08",
"who":"Livia",
"fase":"IV",
"text":"Tienili insieme: fonte, foto, nome e porta."
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
"t":"Ho ancora bisogno di verificare il punto.",
"to":"LIV_promessa_03"
},
{
"t":"Rosa parla sempre, ma di solito ha ragione.",
"to":"LIV_promessa_03"
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
"text":"Grazie. Questo sì, posso chiedertelo.",
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
"t":"Non te lo faccio pagare con un’altra bugia.",
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
}
]
},
{
"id":"LIV_promessa_08",
"who":"Livia",
"fase":"V",
"text":"Io tengo gli originali qui. Quando puoi, confrontiamo."
},
{
"id":"PRE_1_01",
"who":"Sconosciuto",
"fase":"II",
"text":"Quella non era una cosa tua."
},
{
"id":"PRE_1_02",
"who":"Sconosciuto",
"fase":"II",
"text":"Hai guardato bene, allora."
},
{
"id":"PRE_1_03",
"who":"Sconosciuto",
"fase":"II",
"text":"Ti interessa più il nome o quello che hai trovato?",
"opts":[
{
"t":"Dimmi da dove conosci quell’oggetto.",
"to":"PRE_1_04",
"fx":[
"flag:sconosciuto_fonte_chiesta"
]
},
{
"t":"Non ti do altre informazioni.",
"to":"PRE_1_05",
"fx":[
"flag:sconosciuto_dati_negati"
]
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
"text":"Puoi anche non rispondere."
},
{
"id":"PRE_1_07",
"who":"Sconosciuto",
"fase":"II",
"text":"Vuoi sentire il resto?",
"opts":[
{
"t":"Prima confronto quello che hai già detto.",
"to":"PRE_1_08",
"fx":[
"flag:sconosciuto_confronto"
]
},
{
"t":"Conservo il messaggio senza seguirti.",
"to":"PRE_1_09",
"fx":[
"flag:sconosciuto_attesa"
]
},
{
"t":"Per ora finisce qui.",
"to":"PRE_1_10",
"fx":[
"flag:sconosciuto_congedato"
]
}
]
},
{
"id":"PRE_1_08",
"who":"Sconosciuto",
"fase":"II",
"text":"Hai conservato una copia. Non è la stessa cosa.",
"req":"flag:copia_conservata",
"fallback":"PRE_1_09"
},
{
"id":"PRE_1_09",
"who":"Sconosciuto",
"fase":"II",
"text":"La domanda puoi tenerla aperta."
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
"text":"Nonno, vieni. Non voglio restare sola."
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
"flag:domanda_casa_richiesta"
]
},
{
"t":"Una voce non mi basta. Verifico fuori.",
"to":"PRE_2_05",
"fx":[
"flag:verifica_indipendente_richiesta"
]
}
]
},
{
"id":"PRE_2_04",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Nonno, ti prego. Sai che sono io."
},
{
"id":"PRE_2_05",
"who":"Sconosciuto",
"fase":"IV",
"as":"Elena",
"text":"Ti dà fastidio adesso come ti chiamo?"
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
"flag:elena_verifica_scelta"
]
},
{
"t":"Cerco il punto senza aprire nulla.",
"to":"PRE_2_09",
"fx":[
"flag:ricerca_voce_senza_apertura"
]
},
{
"t":"Non seguo la chiamata.",
"to":"PRE_2_10",
"fx":[
"flag:chiamata_imitata_rifiutata"
]
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
"text":"Va bene. Aspetto che smetti di avere paura di me."
},
{
"id":"PRE_3_01",
"who":"Sconosciuto",
"fase":"IV",
"as":"Zio Claudio",
"text":"Hai ancora il temperino?"
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
"to":"PRE_3_04",
"fx":[
"flag:voce_claudio_da_confrontare"
]
},
{
"t":"Ti riconosco solo dopo una verifica.",
"to":"PRE_3_05",
"fx":[
"flag:claudio_verifica_richiesta"
]
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
"text":"Ho lasciato sei auto. Tu ne hai presa una."
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
"to":"PRE_3_09",
"fx":[
"flag:livia_confronto_richiesto"
]
},
{
"t":"Non seguo un ordine solo perché ha la tua voce.",
"to":"PRE_3_10",
"fx":[
"flag:voce_claudio_rifiutata"
]
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
"text":"Se vuoi una risposta, torna alla porta."
},
{
"id":"PRE_4_01",
"who":"Sconosciuto",
"fase":"V",
"text":"Hai smesso di chiamarmi con il suo nome."
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
"to":"PRE_4_05",
"fx":[
"flag:salvataggio_da_verificare"
]
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
"req":"flag:patto_esplicito",
"fallback":"PRE_4_06"
},
{
"id":"PRE_4_06",
"who":"Sconosciuto",
"fase":"V",
"text":"Non ti serve credermi. Ti serve qualcuno da riportare."
},
{
"id":"PRE_4_07",
"who":"Sconosciuto",
"fase":"V",
"text":"Sai chi sono. Vuoi ancora trattare?",
"opts":[
{
"t":"So chi sei. Prometto di accompagnarti al varco.",
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
"text":"Scegli con chi tornare. Poi guardalo bene."
}
];
const CHAT_START = [{"id":"st_ELE_ritiro_01","th":"Elena","node":"ELE_ritiro_01","km":18},{"id":"st_ELE_pasta_01","th":"Elena","node":"ELE_pasta_01","km":32},{"id":"st_ELE_turno_01","th":"Elena","node":"ELE_turno_01","km":46},{"id":"st_ELE_coinquilino_01","th":"Elena","node":"ELE_coinquilino_01","km":60},{"id":"st_ELE_cena_01","th":"Elena","node":"ELE_cena_01","km":74},{"id":"st_ELE_bollette_01","th":"Elena","node":"ELE_bollette_01","km":88},{"id":"st_ELE_temperino_fissato","th":"Elena","node":"ELE_temperino_fissato","km":102,"req":["fatto:ELE_ritiro_08"]},{"id":"st_ELE_claudio_fissato","th":"Elena","node":"ELE_claudio_fissato","km":116,"req":["fatto:ELE_ritiro_08"]},{"id":"st_ELE_richiamo_01","th":"Elena","node":"ELE_richiamo_01","km":130,"req":["flag:elena_sosta_promessa"]},{"id":"st_ROS_attrezzi_01","th":"Rosa","node":"ROS_attrezzi_01","km":144},{"id":"st_PRE_1_01","th":"Sconosciuto","node":"PRE_1_01","km":158},{"id":"st_ELE_litigio_01","th":"Elena","node":"ELE_litigio_01","km":172},{"id":"st_ROS_prudenza_01","th":"Rosa","node":"ROS_prudenza_01","km":186},{"id":"st_PRE_1_02","th":"Sconosciuto","node":"PRE_1_02","km":200},{"id":"st_ELE_distanza_01","th":"Elena","node":"ELE_distanza_01","km":200,"req":["flag:ev_distanza_impossibile"]},{"id":"st_PRE_1_03","th":"Sconosciuto","node":"PRE_1_03","km":214},{"id":"st_PRE_1_06","th":"Sconosciuto","node":"PRE_1_06","km":228},{"id":"st_PRE_1_07","th":"Sconosciuto","node":"PRE_1_07","km":242},{"id":"st_ELE_riparazione_01","th":"Elena","node":"ELE_riparazione_01","km":270,"req":["flag:elena_scuse"]},{"id":"st_ROS_ricontrollo_01","th":"Rosa","node":"ROS_ricontrollo_01","km":284,"req":["flag:rosa_sosta_accettata"]},{"id":"st_LIV_primo_01","th":"Livia","node":"LIV_primo_01","km":298},{"id":"st_ROS_passato_01","th":"Rosa","node":"ROS_passato_01","km":312},{"id":"st_LIV_affido_01","th":"Livia","node":"LIV_affido_01","km":326},{"id":"st_ROS_promessa_01","th":"Rosa","node":"ROS_promessa_01","km":340,"req":["flag:promessa_rosa"]},{"id":"st_LIV_ottavio_01","th":"Livia","node":"LIV_ottavio_01","km":354},{"id":"st_ROS_dopo_passaggio_01","th":"Rosa","node":"ROS_dopo_passaggio_01","km":354,"req":["flag:ev_incursione_1_conclusa"]},{"id":"st_ELE_nonno_01","th":"Elena","node":"ELE_nonno_01","km":430},{"id":"st_ROS_segni_01","th":"Rosa","node":"ROS_segni_01","km":430,"req":["flag:ev_indizio_sangue"]},{"id":"st_LIV_fiducia_01","th":"Livia","node":"LIV_fiducia_01","km":444,"req":["flag:prova_trattenuta"]},{"id":"st_SPORCO_01","th":"Elena","node":"SPORCO_01","km":458,"req":["flag:nonno_uso_fissato"]},{"id":"st_LIV_irene_01","th":"Livia","node":"LIV_irene_01","km":458,"req":["flag:ev_foto_originale"]},{"id":"st_SPORCO_02","th":"Elena","node":"SPORCO_02","km":472,"req":["flag:nonno_uso_fissato"]},{"id":"st_SPORCO_03","th":"Elena","node":"SPORCO_03","km":486,"req":["flag:nonno_uso_fissato"]},{"id":"st_SPORCO_04","th":"Elena","node":"SPORCO_04","km":500,"req":["flag:nonno_uso_fissato"]},{"id":"st_SPORCO_05","th":"Elena","node":"SPORCO_05","km":514,"req":["flag:nonno_uso_fissato"]},{"id":"st_SPORCO_06","th":"Elena","node":"SPORCO_06","km":528,"req":["flag:nonno_uso_fissato"]},{"id":"st_PRE_2_01","th":"Elena","node":"PRE_2_01","km":542},{"id":"st_PRE_2_02","th":"Elena","node":"PRE_2_02","km":556},{"id":"st_PRE_2_03","th":"Elena","node":"PRE_2_03","km":570},{"id":"st_PRE_2_06","th":"Elena","node":"PRE_2_06","km":584},{"id":"st_PRE_2_07","th":"Elena","node":"PRE_2_07","km":598},{"id":"st_PRE_3_01","th":"Zio Claudio","node":"PRE_3_01","km":612},{"id":"st_PRE_3_02","th":"Zio Claudio","node":"PRE_3_02","km":626},{"id":"st_PRE_3_03","th":"Zio Claudio","node":"PRE_3_03","km":640},{"id":"st_PRE_3_06","th":"Zio Claudio","node":"PRE_3_06","km":654},{"id":"st_PRE_3_07","th":"Zio Claudio","node":"PRE_3_07","km":668},{"id":"st_ELE_cena_ritorno_01","th":"Elena","node":"ELE_cena_ritorno_01","km":668,"req":["flag:elena_non_aspettare","flag:ev_fase_v"]},{"id":"st_ROS_recupero_01","th":"Rosa","node":"ROS_recupero_01","km":668,"req":["flag:promessa_rosa_chiarita","flag:ev_fase_v"]},{"id":"st_LIV_promessa_01","th":"Livia","node":"LIV_promessa_01","km":668,"req":["flag:promessa_rosa_chiarita","flag:ev_fase_v"]},{"id":"st_PRE_4_01","th":"Sconosciuto","node":"PRE_4_01","km":668,"req":["flag:ev_presenza_scoperta"]},{"id":"st_ROS_guardia_01","th":"Rosa","node":"ROS_guardia_01","km":668,"req":["flag:ev_fase_v"]},{"id":"st_PRE_4_02","th":"Sconosciuto","node":"PRE_4_02","km":668,"req":["flag:ev_presenza_scoperta"]},{"id":"st_ROS_prima_porta_01","th":"Rosa","node":"ROS_prima_porta_01","km":668,"req":["flag:promessa_rosa","flag:ev_fase_v"]},{"id":"st_PRE_4_03","th":"Sconosciuto","node":"PRE_4_03","km":668,"req":["flag:ev_presenza_scoperta"]},{"id":"st_PRE_4_06","th":"Sconosciuto","node":"PRE_4_06","km":668,"req":["flag:ev_presenza_scoperta"]},{"id":"st_PRE_4_07","th":"Sconosciuto","node":"PRE_4_07","km":668,"req":["flag:ev_presenza_scoperta"]}];
const CHAT_TONI_MAP = {"ELE_ritiro_01":["sincero","sincero","sboccato"],"ELE_ritiro_02":["ironico","evasivo"],"ELE_ritiro_03":["sincero","sincero"],"ELE_ritiro_04":["ironico","ironico"],"ELE_ritiro_05":["evasivo","gentile"],"ELE_ritiro_06":["sincero","sincero"],"ELE_ritiro_07":["ironico","gentile"],"ELE_pasta_01":["ironico","sincero"],"ELE_pasta_02":["ironico","sincero"],"ELE_pasta_03":["sincero","sincero"],"ELE_pasta_04":["sincero","sincero"],"ELE_pasta_05":["sincero","sincero"],"ELE_pasta_06":["sincero","sincero"],"ELE_pasta_07":["sincero","sincero"],"ELE_turno_01":["sincero","evasivo","sboccato"],"ELE_turno_02":["sincero","sincero"],"ELE_turno_03":["sincero","sincero"],"ELE_turno_04":["sincero","gentile"],"ELE_turno_05":["sincero","sincero"],"ELE_turno_06":["sincero","ironico"],"ELE_turno_07":["sincero","sincero"],"ELE_coinquilino_01":["sincero","sincero"],"ELE_coinquilino_02":["gentile","sincero"],"ELE_coinquilino_03":["sincero","sincero"],"ELE_coinquilino_04":["gentile","evasivo"],"ELE_coinquilino_05":["evasivo","gentile"],"ELE_coinquilino_06":["freddo","gentile"],"ELE_coinquilino_07":["evasivo","sincero"],"ELE_cena_01":["evasivo","sincero","sboccato"],"ELE_cena_02":["gentile","sincero"],"ELE_cena_03":["sincero","sincero"],"ELE_cena_04":["sincero","sincero"],"ELE_cena_05":["sincero","sincero"],"ELE_cena_06":["gentile","gentile"],"ELE_cena_07":["gentile","sincero"],"ELE_bollette_01":["sincero","sincero"],"ELE_bollette_02":["gentile","sincero"],"ELE_bollette_03":["gentile","ironico"],"ELE_bollette_04":["sincero","sincero"],"ELE_bollette_05":["sincero","sincero"],"ELE_bollette_06":["sincero","evasivo"],"ELE_bollette_07":["ironico","gentile"],"ELE_richiamo_01":["sincero","sincero"],"ELE_richiamo_02":["gentile","sincero"],"ELE_richiamo_03":["sincero","sincero"],"ELE_richiamo_04":["sincero","sincero"],"ELE_richiamo_05":["sincero","sincero"],"ELE_richiamo_06":["gentile","evasivo"],"ELE_richiamo_07":["sincero","sincero"],"ELE_litigio_01":["gentile","sincero","sincero"],"ELE_litigio_02":["sincero","sincero"],"ELE_litigio_03":["gentile","sincero"],"ELE_litigio_04":["sincero","evasivo"],"ELE_litigio_05":["gentile","sincero"],"ELE_litigio_06":["gentile","sincero"],"ELE_litigio_07":["gentile","gentile"],"ELE_distanza_01":["sincero","sincero"],"ELE_distanza_02":["sincero","sincero"],"ELE_distanza_03":["sincero","freddo"],"ELE_distanza_04":["sincero","sincero"],"ELE_distanza_05":["sincero","sincero"],"ELE_distanza_06":["sincero","sincero"],"ELE_distanza_07":["gentile","sincero"],"ELE_riparazione_01":["sincero","sincero"],"ELE_riparazione_02":["sincero","sincero"],"ELE_riparazione_03":["gentile","sincero"],"ELE_riparazione_04":["sincero","sincero"],"ELE_riparazione_05":["sincero","gentile"],"ELE_riparazione_06":["sincero","sincero"],"ELE_riparazione_07":["gentile","sincero"],"ELE_nonno_01":["sincero","sincero"],"ELE_nonno_02":["sincero","sincero"],"ELE_nonno_03":["sincero","sincero"],"ELE_nonno_04":["sincero","sincero"],"ELE_nonno_05":["sincero","sincero"],"ELE_nonno_06":["sincero","sincero"],"ELE_nonno_07":["gentile","gentile"],"ELE_cena_ritorno_01":["sincero","sincero"],"ELE_cena_ritorno_02":["sincero","sincero"],"ELE_cena_ritorno_03":["sincero","gentile"],"ELE_cena_ritorno_04":["sincero","sincero"],"ELE_cena_ritorno_05":["sincero","sincero"],"ELE_cena_ritorno_06":["sincero","sincero"],"ELE_cena_ritorno_07":["sincero","sincero"],"ELE_temperino_fissato":["sincero","sincero"],"ELE_claudio_fissato":["sincero","sincero"],"ROS_attrezzi_01":["sincero","sincero","sboccato"],"ROS_attrezzi_02":["sincero","sincero","sboccato"],"ROS_attrezzi_03":["sincero","gentile"],"ROS_attrezzi_04":["sincero","gentile"],"ROS_attrezzi_05":["sincero","sincero","sboccato"],"ROS_attrezzi_06":["sincero","gentile"],"ROS_attrezzi_07":["evasivo","ironico"],"ROS_prudenza_01":["sincero","sincero","sboccato"],"ROS_prudenza_02":["gentile","evasivo"],"ROS_prudenza_03":["ironico","sincero"],"ROS_prudenza_04":["sincero","evasivo"],"ROS_prudenza_05":["sincero","sincero","sboccato"],"ROS_prudenza_06":["sincero","gentile"],"ROS_prudenza_07":["freddo","evasivo"],"ROS_ricontrollo_01":["sincero","sincero"],"ROS_ricontrollo_02":["sincero","sincero"],"ROS_ricontrollo_03":["sincero","gentile","sboccato"],"ROS_ricontrollo_04":["freddo","sincero"],"ROS_ricontrollo_05":["sincero","sincero"],"ROS_ricontrollo_06":["gentile","evasivo"],"ROS_ricontrollo_07":["sincero","ironico"],"ROS_passato_01":["sincero","sincero"],"ROS_passato_02":["sincero","sincero"],"ROS_passato_03":["sincero","sincero"],"ROS_passato_04":["sincero","sincero","sboccato"],"ROS_passato_05":["sincero","evasivo"],"ROS_passato_06":["gentile","evasivo"],"ROS_passato_07":["sincero","sincero"],"ROS_promessa_01":["sincero","sincero"],"ROS_promessa_02":["sincero","sincero","sboccato"],"ROS_promessa_03":["sincero","sincero"],"ROS_promessa_04":["sincero","sincero"],"ROS_promessa_05":["sincero","sincero"],"ROS_promessa_06":["sincero","sincero"],"ROS_promessa_07":["sincero","sincero","sboccato"],"ROS_dopo_passaggio_01":["sincero","sincero","sboccato"],"ROS_dopo_passaggio_02":["sincero","sincero"],"ROS_dopo_passaggio_03":["gentile","sincero"],"ROS_dopo_passaggio_04":["sincero","sincero"],"ROS_dopo_passaggio_05":["sincero","evasivo"],"ROS_dopo_passaggio_06":["sincero","sincero"],"ROS_dopo_passaggio_07":["sincero","sincero"],"ROS_segni_01":["sincero","sincero"],"ROS_segni_02":["sincero","sincero"],"ROS_segni_03":["sincero","sincero"],"ROS_segni_04":["sincero","sincero"],"ROS_segni_05":["sincero","sincero"],"ROS_segni_06":["sincero","sincero"],"ROS_segni_07":["sincero","sincero"],"ROS_recupero_01":["sincero","evasivo"],"ROS_recupero_02":["sincero","sincero"],"ROS_recupero_03":["sincero","sincero"],"ROS_recupero_04":["sincero","sincero"],"ROS_recupero_05":["sincero","sincero"],"ROS_recupero_06":["sincero","sincero"],"ROS_recupero_07":["sincero","sincero"],"ROS_guardia_01":["sincero","sincero"],"ROS_guardia_02":["sincero","sincero"],"ROS_guardia_03":["sincero","sincero"],"ROS_guardia_04":["sincero","sincero"],"ROS_guardia_05":["sincero","sincero"],"ROS_guardia_06":["sincero","sincero"],"ROS_guardia_07":["sincero","sincero"],"ROS_prima_porta_01":["sincero","sincero"],"ROS_prima_porta_02":["sincero","freddo"],"ROS_prima_porta_03":["sincero","gentile"],"ROS_prima_porta_04":["sincero","sincero"],"ROS_prima_porta_05":["sincero","evasivo"],"ROS_prima_porta_06":["sincero","sincero"],"ROS_prima_porta_07":["freddo","sincero"],"LIV_primo_01":["pacato","pacato","ironico"],"LIV_primo_02":["pacato","pacato"],"LIV_primo_03":["pacato","gentile"],"LIV_primo_04":["pacato","pacato"],"LIV_primo_05":["pacato","pacato"],"LIV_primo_06":["pacato","pacato"],"LIV_primo_07":["pacato","pacato"],"LIV_affido_01":["pacato","evasivo"],"LIV_affido_02":["pacato","pacato"],"LIV_affido_03":["pacato","pacato"],"LIV_affido_04":["pacato","pacato"],"LIV_affido_05":["evasivo","pacato"],"LIV_affido_06":["pacato","pacato"],"LIV_affido_07":["pacato","pacato"],"LIV_ottavio_01":["pacato","pacato","evasivo"],"LIV_ottavio_02":["pacato","pacato"],"LIV_ottavio_03":["pacato","pacato"],"LIV_ottavio_04":["gentile","pacato"],"LIV_ottavio_05":["pacato","pacato"],"LIV_ottavio_06":["pacato","pacato"],"LIV_ottavio_07":["pacato","pacato"],"LIV_fiducia_01":["pacato","pacato"],"LIV_fiducia_02":["pacato","pacato"],"LIV_fiducia_03":["pacato","pacato"],"LIV_fiducia_04":["pacato","pacato"],"LIV_fiducia_05":["pacato","pacato"],"LIV_fiducia_06":["pacato","sincero"],"LIV_fiducia_07":["pacato","pacato"],"LIV_irene_01":["pacato","pacato"],"LIV_irene_02":["pacato","pacato"],"LIV_irene_03":["pacato","pacato"],"LIV_irene_04":["pacato","pacato"],"LIV_irene_05":["pacato","pacato"],"LIV_irene_06":["pacato","pacato"],"LIV_irene_07":["pacato","pacato"],"LIV_promessa_01":["pacato","pacato","ironico"],"LIV_promessa_02":["pacato","pacato"],"LIV_promessa_03":["pacato","pacato"],"LIV_promessa_04":["pacato","pacato"],"LIV_promessa_05":["pacato","pacato"],"LIV_promessa_06":["pacato","pacato"],"LIV_promessa_07":["pacato","pacato"],"PRE_1_03":["sincero","sincero"],"PRE_1_07":["sincero","sincero","evasivo"],"PRE_2_03":["sincero","sincero"],"PRE_2_07":["sincero","sincero","sincero"],"PRE_3_03":["sincero","sincero"],"PRE_3_07":["sincero","sincero","sincero"],"PRE_4_03":["sincero","sincero"],"PRE_4_07":["sincero","freddo","sincero"]};
const CHAT_UNLOCK = {};
