// ============================================================================
//  Night Run · Ritocchi ai testi delle chat (dopo chat_dati.js, prima di chat.js)
//  chat_dati.js è generato e non si tocca: i testi cambiati col file strumenti/editor_storia.html finiscono qui, per ID.
//  Si aggiorna con `node strumenti/assorbi_modifiche.mjs <modifiche_storia.json>` (non a mano).
//  Formato: { ID: { text: 'riga' | ['riga', ...], alt: { indice: 'testo' }, opts: { indice: 'testo risposta' } } }
//  Cambia solo i testi: bivi, condizioni, effetti e toni restano quelli di chat_dati.js.
// ============================================================================
const CHAT_MOD = /*MOD*/{
 "ELE_ritiro_01": {
  "text": [
   "Dimmi che l’hai già caricata su un carro attrezzi.",
   "Ho dieci minuti di pausa, rispondimi."
  ],
  "opts": {
   "0": "Parte. E io vado avanti.",
   "1": "Domani la vendo, giuro.",
   "2": "Adesso non mi va di parlarne."
  }
 },
 "ELE_ritiro_02": {
  "text": [
   "Parte, dice lui. Guarda che una macchina che parte non è una macchina, è una scommessa.",
   "E poi era di uno che a Natale non si faceva mai vedere."
  ],
  "opts": {
   "0": "Era nostro zio, Elena.",
   "1": "Perché tu a Natale dov’eri, scusa?"
  }
 },
 "ELE_ritiro_03": {
  "text": [
   "Domani. Perfetto, scrivimi anche l’ora.",
   "Così quando domani diventa dopodomani almeno ho un orario da rinfacciarti."
  ],
  "opts": {
   "0": "Va bene, te la scrivo.",
   "1": "Non fare la maestrina, dai."
  }
 },
 "ELE_ritiro_04": {
  "text": [
   "Certo, ne parliamo quando sei finito sotto un camion."
  ],
  "opts": {
   "0": "Elena..."
  }
 },
 "ELE_ritiro_05": {
  "text": [
   "Ti ha regalato un temperino. Me l’hai detto tu: un temperino.",
   "E per un temperino adesso guidi di notte una macchina che non sai neanche se ha le gomme buone."
  ],
  "alt": {
   "0": "Non cambiare discorso. Un temperino, mi hai detto. E per un temperino ti metti a guidare di notte."
  },
  "opts": {
   "0": "Non lo faccio per il temperino.",
   "1": "Non ti devo nessuna spiegazione."
  }
 },
 "ELE_ritiro_06": {
  "text": [
   "E allora per cosa? Dimmelo, che ho dieci minuti e non li voglio buttare a tirare a indovinare.",
   "(dall’altra stanza si sente un trapano)",
   "Ecco, senti? Qui da me funziona tutto e mi dà fastidio tutto.",
   "Tu invece hai una macchina che non sai se parte e fai pure il misterioso. Non è un affare, Nonno."
  ],
  "alt": {
   "0": "Infatti spiegazioni non me ne dai mai. Comunque non è un affare, Nonno."
  },
  "opts": {
   "0": "Perché è l’unica cosa che mi ha lasciato.",
   "1": "Perché quando me l’hanno detto tu non c’eri.",
   "2": "Fai sempre così: decidi tu quello che devo fare io."
  }
 },
 "ELE_ritiro_07": {
  "text": [
   "Ok.",
   "Quando ti fermi a dormire mandami un messaggio. Non lo dico per me, eh: è per sapere dove venirti a cercare."
  ],
  "opts": {
   "0": "Va bene, ti scrivo.",
   "1": "Se c’è campo."
  }
 },
 "ELE_ritiro_08": {
  "text": [
   "Vai, va’. E mangia qualcosa."
  ],
  "alt": {
   "0": "Vai, va’. Mangia qualcosa, e poi scrivimi."
  }
 },
 "ELE_ritiro_07b": {
  "text": [
   "Mi hai chiamata alle due di notte, mentre lavoravo, con tre tavoli da servire.",
   "Per un’ora ho fatto finta di niente.",
   "Poi ho staccato e non ti ho richiamato, tanto avevi già deciso tu come doveva andare.",
   "Quando ti fermi a dormire mandami un messaggio. Non lo dico per me, eh: è per sapere dove venirti a cercare."
  ],
  "opts": {
   "0": "Va bene, ti scrivo.",
   "1": "Se c’è campo."
  }
 },
 "ELE_ritiro_07c": {
  "text": [
   "Eh già, perché da solo decidi benissimo. Si vede.",
   "Quando ti fermi a dormire mandami un messaggio. Non lo dico per me, eh: è per sapere dove venirti a cercare."
  ],
  "opts": {
   "0": "Va bene, ti scrivo.",
   "1": "Se c’è campo."
  }
 },
 "ELE_pasta_01": {
  "text": [
   "Fufi si è preso la sedia e io mangio in piedi col piatto in mano.",
   "E poi quella che comanda tutti sarei io."
  ],
  "opts": {
   "0": "Spostalo, no? La sedia è tua.",
   "1": "È arrivato prima lui, il posto è suo.",
   "2": "Adesso mi racconti pure del gatto?"
  }
 },
 "ELE_pasta_02": {
  "text": [
   "Il capo lo sai fare benissimo, quando si parla del culo degli altri."
  ],
  "opts": {
   "0": "È un gatto, Elena. Ti sei alzata tu."
  }
 },
 "ELE_pasta_03": {
  "text": [
   "Certo. Il suo avvocato se n’è andato e la parcella la pago io.",
   "Senti, la macchina. Mandami una foto, tutta intera."
  ],
  "opts": {
   "0": "Te la mando quando sono al parcheggio.",
   "1": "Così mi dici di venderla? No, grazie."
  }
 },
 "ELE_pasta_04": {
  "text": [
   "Va bene, il gatto te lo risparmio.",
   "Però la macchina me la fai vedere."
  ],
  "opts": {
   "0": "Sono fermo. Eccola.",
   "1": "Tanto hai già deciso senza vederla."
  }
 },
 "ELE_pasta_05": {
  "text": [
   "Ah, quando sei tu a dirmi cosa fare allora è diverso.",
   "Mandami la macchina, voglio vedere se almeno ha quattro ruote."
  ],
  "opts": {
   "0": "Ti mando la foto, guarda pure.",
   "1": "No. Tu tieniti il gatto, io mi tengo la macchina."
  }
 },
 "ELE_pasta_06": {
  "text": [
   "Vista.",
   "Tu ci vedi un’eredità, io ci vedo un sacco di lavori da pagare."
  ],
  "opts": {
   "0": "Paga chi ci sale. E ci salgo io."
  }
 },
 "ELE_pasta_07": {
  "text": [
   "Niente foto e niente parere, quindi.",
   "Mi chiami quando ti serve il numero del carro attrezzi?"
  ],
  "opts": {
   "0": "Adesso sei tu che fai la stronza."
  }
 },
 "ELE_pasta_08": {
  "text": [
   "Fufi si è risistemato bello comodo. Io ho mangiato in piedi.",
   "Almeno uno, in questa casa, sa come ottenere quello che vuole."
  ],
  "alt": {
   "0": "Il gatto è sistemato. Il resto del tuo viaggio tienilo per te."
  }
 },
 "ELE_turno_01": {
  "text": [
   "Ho dieci minuti. La macchina stavolta la lasciamo fuori, ok?",
   "Il turno di notte lo sto facendo io, non tu."
  ],
  "alt": {
   "0": "Il gatto te l’ho risparmiato. Stavolta però la pausa è mia."
  },
  "opts": {
   "0": "Due minuti, poi ti levo dai piedi.",
   "1": "Allora mangia. Ti scrivo dopo.",
   "2": "Quando servi tu hai sempre il turno, eh."
  }
 },
 "ELE_turno_02": {
  "text": [
   "Due minuti per dirmi cosa?",
   "Che parte ancora? L’abbiamo già festeggiato, grazie."
  ],
  "opts": {
   "0": "Che non ho ancora deciso di tornare.",
   "1": "Lascia stare, tanto hai da fare."
  }
 },
 "ELE_turno_03": {
  "text": [
   "Dopo quando?",
   "Perché tu dopo mi scrivi, e per me comincia un’altra nottata."
  ],
  "opts": {
   "0": "Finisci tu, e poi scrivi tu.",
   "1": "Ti scrivo io alla prossima sosta."
  }
 },
 "ELE_turno_04": {
  "text": [
   "Quando dovevi scegliere tu avevi sei macchine davanti.",
   "Io avevo tre tavoli. Potevi chiamarmi prima delle due, no?"
  ],
  "opts": {
   "0": "Tu almeno potevi richiamarmi.",
   "1": "Sì, ho scelto senza di te. E allora?"
  }
 },
 "ELE_turno_05": {
  "text": [
   "Quindi io mangio e tu vai avanti.",
   "Era questa la notizia che dovevo mandare giù?"
  ],
  "opts": {
   "0": "Sì. Stasera non torno.",
   "1": "Appena so qualcosa ti scrivo."
  }
 },
 "ELE_turno_06": {
  "text": [
   "Tu puoi lasciarmi sei messaggi, io invece ti rovino due minuti. Bello.",
   "Mi stanno chiamando. Tanto per cambiare, quella che deve andare sono io."
  ],
  "opts": {
   "0": "Vai pure. Ma quella frase me la segno."
  }
 },
 "ELE_turno_07": {
  "text": [
   "Allora scrivo io.",
   "E se dormi, dormi. Senza farmi il processo perché ti ho risposto tardi."
  ],
  "opts": {
   "0": "Va bene, aspetto il messaggio."
  }
 },
 "ELE_turno_08": {
  "text": [
   "Pausa finita. Il piatto invece no."
  ],
  "alt": {
   "0": "Il piatto l’ho buttato. Le due di notte invece me le ricordo.",
   "1": "Torno ai tavoli. Il messaggio te lo mando io, come hai detto tu."
  }
 },
 "ELE_coinquilino_01": {
  "text": [
   "È mezzanotte e ha ricominciato col trapano.",
   "Dimmi tu cosa gli diresti, visto che a me sai sempre cosa dire."
  ],
  "opts": {
   "0": "«Smettila, che la gente dorme.» Giraglielo così.",
   "1": "Diglielo tu, sei lì.",
   "2": "Beato lui che sa dove sta andando. Dentro il muro."
  }
 },
 "ELE_coinquilino_02": {
  "text": [
   "«La gente dorme.»",
   "Tu no, ovviamente. Tu stai facendo una cosa importantissima."
  ],
  "opts": {
   "0": "Glielo giri o volevi litigare con me?",
   "1": "Stanotte mi fermo, l’ho scritto."
  }
 },
 "ELE_coinquilino_03": {
  "text": [
   "Infatti sono qui. E lo sento benissimo, da qui.",
   "Riesci a decidere per me perfino quando mi dici di arrangiarmi."
  ],
  "opts": {
   "0": "Non vengo lì a litigare col tuo coinquilino.",
   "1": "Scrivigli che domani lavori. Basta quello."
  }
 },
 "ELE_coinquilino_04": {
  "text": [
   "Sì, sempre avanti finché non trova qualcosa di duro.",
   "Ti somiglia, sai? Solo che lui ogni tanto si ferma."
  ],
  "opts": {
   "0": "Puoi smettere di parlare della macchina per un minuto?",
   "1": "Digli di smettere. Con quelle parole lì."
  }
 },
 "ELE_coinquilino_05": {
  "text": [
   "Fatto, gli ho scritto.",
   "L’ha letto. Aspetto che risponda."
  ],
  "opts": {
   "0": "Guarda se smette, non se risponde."
  }
 },
 "ELE_coinquilino_06": {
  "text": [
   "Me lo salvo.",
   "Così domani litighiamo su quello che hai scritto tu, e non sul fatto che non c’era campo."
  ],
  "opts": {
   "0": "Salvalo pure."
  }
 },
 "ELE_coinquilino_07": {
  "text": [
   "Io volevo solo smettere di sentire un trapano.",
   "E tu sei riuscito a farmi venire voglia di attaccarti il telefono in faccia."
  ],
  "opts": {
   "0": "E allora fallo."
  }
 },
 "ELE_coinquilino_08": {
  "text": [
   "Ha smesso. Aspetto un attimo prima di festeggiare."
  ],
  "alt": {
   "0": "Ha smesso. Da solo, eh. Almeno lui.",
   "1": "L’ha letto e ha smesso. Bastava quello."
  }
 },
 "ELE_cena_01": {
  "text": [
   "Il piatto lo metto via?",
   "Rispondimi a questo, non mandarmi il bollettino della macchina."
  ],
  "alt": {
   "0": "Dovevo scrivere io, lo so. Ho finito il turno: il piatto lo metto via?"
  },
  "opts": {
   "0": "Sì, mangia pure senza aspettarmi.",
   "1": "Tienilo ancora un po’.",
   "2": "Non c’è bisogno che mi tieni il piatto."
  }
 },
 "ELE_cena_02": {
  "text": [
   "Lo metto via.",
   "E la macchina? La vendi o te la tieni?"
  ],
  "alt": {
   "0": "«Domani la vendo», avevi detto. Allora, te lo tengo il piatto?"
  },
  "opts": {
   "0": "Te l’avevo detto solo per farti smettere.",
   "1": "Non la vendo.",
   "2": "Mangia. Della macchina parliamo dopo."
  }
 },
 "ELE_cena_03": {
  "text": [
   "Ancora quanto? Il piatto è qui, tu no."
  ],
  "opts": {
   "0": "Lo so. Mettilo via.",
   "1": "Ho detto un po’. Non mettermi il cronometro."
  }
 },
 "ELE_cena_04": {
  "text": [
   "Volevo solo sapere se mangiavo da sola.",
   "Adesso lo so."
  ],
  "opts": {
   "0": "Sì. Stasera da sola."
  }
 },
 "ELE_cena_05": {
  "text": [
   "Per farmi smettere.",
   "Quindi ho apparecchiato per uno che mi aveva già liquidata."
  ],
  "opts": {
   "0": "Quel «domani» era una bugia. Il resto te lo dico."
  }
 },
 "ELE_cena_06": {
  "text": [
   "Ecco, potevi cominciare da lì.",
   "Io avrei mangiato caldo e tu la tua macchina l’avresti avuta lo stesso."
  ],
  "opts": {
   "0": "Stasera la tengo. Anche se a te non va."
  }
 },
 "ELE_cena_07": {
  "text": [
   "Dopo.",
   "Va bene, metto via anche quello."
  ],
  "opts": {
   "0": "Per stasera basta così."
  }
 },
 "ELE_cena_08": {
  "text": [
   "Ho mangiato. La macchina mandala giù tu."
  ],
  "alt": {
   "0": "Ho mangiato. Ma quel tuo «per farmi smettere» mi è rimasto sullo stomaco."
  }
 },
 "ELE_bollette_01": {
  "text": [
   "Ho aperto una bolletta.",
   "Tu almeno il conto della macchina l’hai fatto?"
  ],
  "alt": {
   "0": "La foto me l’hai negata. Almeno il conto l’hai guardato?",
   "1": "Te la tieni, va bene. Ma il conto per tenerla l’hai fatto?"
  },
  "opts": {
   "0": "Te lo mando, dimmi tu.",
   "1": "La pago io.",
   "2": "Non ancora. Prima dovevo portarla via di lì."
  }
 },
 "ELE_bollette_02": {
  "text": [
   "Ok, il numero lo vedo.",
   "Ma tu l’hai guardato prima di partire o solo adesso che te l’ho chiesto io?"
  ],
  "opts": {
   "0": "Dopo. Il conto l’ho fatto dopo.",
   "1": "Se te lo dico cambia il prezzo?"
  }
 },
 "ELE_bollette_03": {
  "text": [
   "Sì, e io sono qui con la mia.",
   "Quando mi dici che hai scelto bene, cosa vuoi: un parere o un applauso?"
  ],
  "opts": {
   "0": "L’applauso no. Il parere l’ho già sentito.",
   "1": "Ti mando il conto. Guardalo."
  }
 },
 "ELE_bollette_04": {
  "text": [
   "Portarla via da chi?",
   "Che, il notaio ti teneva per il giubbotto?"
  ],
  "opts": {
   "0": "Da lì. Avevo scelto e volevo andarmene.",
   "1": "Anche da questa conversazione, se è per questo."
  }
 },
 "ELE_bollette_05": {
  "text": [
   "L’avrai visto tre volte in tutta la vita.",
   "E adesso sembra che devi recuperare tutti gli anni persi, a forza di benzinai."
  ],
  "opts": {
   "0": "Tre volte, sì. Però il regalo l’ha fatto a me."
  }
 },
 "ELE_bollette_06": {
  "text": [
   "Il prezzo no.",
   "Ma l’idea che mi sto facendo di te, parecchio."
  ],
  "opts": {
   "0": "Tienitela. E la bolletta chiudila tu."
  }
 },
 "ELE_bollette_07": {
  "text": [
   "E allora vai.",
   "La prossima volta che vuoi gli applausi dimmelo subito, così facciamo prima."
  ],
  "opts": {
   "0": "Chiudo io."
  }
 },
 "ELE_bollette_08": {
  "text": [
   "Rimetto tutto nella busta. Per stasera l’ho guardata abbastanza."
  ],
  "alt": {
   "0": "Il tuo conto ce l’ho qui in chat. Il mio torna nella busta."
  }
 },
 "ELE_richiamo_01": {
  "text": [
   "«Ti scrivo quando mi fermo.»",
   "Invece è arrivato prima il tuo silenzio. Dove sei?"
  ],
  "alt": {
   "0": "Avevo il turno, dicevi. Adesso il turno è finito: dove sei?",
   "1": "«Alla prossima sosta», hai scritto. Io sto ancora aspettando.",
   "2": "Stasera non torni, me l’hai scritto. Ma dove ti sei fermato?"
  },
  "opts": {
   "0": "In un autogrill. Ti mando la foto dell’insegna.",
   "1": "Sono fermo. Dove, non te lo dico.",
   "2": "Aspettavo di avere una bella notizia."
  }
 },
 "ELE_richiamo_02": {
  "text": [
   "Ok, la vedo.",
   "E prima? Non potevi mandarlo prima, un messaggio?"
  ],
  "opts": {
   "0": "Ho rimandato. Stavo evitando te.",
   "1": "Eh, certo, era il mio primo pensiero."
  }
 },
 "ELE_richiamo_03": {
  "text": [
   "E allora il telefono acceso lo tenevi per cosa?",
   "Per vedere se smettevo prima io?"
  ],
  "opts": {
   "0": "Per essere lasciato in pace.",
   "1": "Ti mando l’insegna. Il resto non cambia."
  }
 },
 "ELE_richiamo_04": {
  "text": [
   "Per le belle notizie hai il notaio.",
   "A me avevi promesso un messaggio."
  ],
  "opts": {
   "0": "Autogrill. Ecco l’insegna.",
   "1": "Se ogni volta finisce così smetto di scriverti."
  }
 },
 "ELE_richiamo_05": {
  "text": [
   "Lo so.",
   "Volevo che me lo scrivessi tu."
  ],
  "opts": {
   "0": "Adesso l’hai scritto anche tu."
  }
 },
 "ELE_richiamo_06": {
  "text": [
   "Bravo, stronzo.",
   "Il tempo per rispondermi lo trovi solo quando puoi farmela pagare."
  ],
  "opts": {
   "0": "Per oggi chiudiamo qui."
  }
 },
 "ELE_richiamo_07": {
  "text": [
   "Smetti pure.",
   "Però la prossima promessa falla a te stesso."
  ],
  "opts": {
   "0": "Questa l’ho fatta io, lo so."
  }
 },
 "ELE_richiamo_08": {
  "text": [
   "Mi aspetta il turno. Tu avevi promesso di scrivermi."
  ],
  "alt": {
   "0": "Mi sono salvata l’insegna. Il resto lo riprendiamo, eh: non finisce qui."
  }
 },
 "ELE_litigio_01": {
  "text": [
   "Ventisei ore.",
   "Ti ho scritto sei volte. Sei! E le hai visualizzate tutte."
  ],
  "opts": {
   "0": "Stavo guidando. Non posso risponderti in diretta.",
   "1": "Non sapevo cosa scriverti.",
   "2": "Le ho viste. Non mi andava di sentirmi dire di venderla."
  }
 },
 "ELE_litigio_02": {
  "text": [
   "Mica ti ho chiesto di rispondere in diretta. Ti ho chiesto un pollice. Uno, col dito.",
   "Ci metti meno a mandarmi un pollice che a spiegarmi che stavi guidando."
  ],
  "opts": {
   "0": "Mi stai controllando.",
   "1": "Hai ragione, un pollice potevo mandartelo."
  }
 },
 "ELE_litigio_03": {
  "text": [
   "Non sapevi cosa scrivere. Sono tua sorella, mica l’avvocato dell’eredità.",
   "Scrivi «ciao» e basta."
  ],
  "opts": {
   "0": "Se scrivo «ciao» poi parte l’interrogatorio.",
   "1": "Ho paura che sulla macchina tu abbia ragione."
  }
 },
 "ELE_litigio_04": {
  "text": [
   "Non ti andava. Ok.",
   "Sei uguale a lui, lo sai? Sparisci per mesi e poi quello offeso sei tu."
  ],
  "opts": {
   "0": "Non paragonarmi a lui.",
   "1": "Forse sì."
  }
 },
 "ELE_litigio_05": {
  "text": [
   "Ho il turno e mi stai mangiando la pausa."
  ],
  "opts": {
   "0": "Elena, aspetta.",
   "1": "Vai pure, ci sentiamo."
  }
 },
 "ELE_litigio_06": {
  "text": [
   "Non mi interessava avere ragione. Mi interessava sapere che stai bene.",
   "Dimmelo: come stai?"
  ],
  "opts": {
   "0": "Sto bene.",
   "1": "Non lo so. E non mi va di spiegartelo."
  }
 },
 "ELE_litigio_07": {
  "text": [
   "Aspetto cosa? Che mi ripeti che va tutto bene?",
   "Ci sentiamo quando ci sentiamo."
  ]
 },
 "ELE_litigio_08": {
  "text": [
   "Bugiardo. Ma va bene.",
   "Mangia qualcosa."
  ]
 },
 "ELE_litigio_09": {
  "text": [
   "Vado.",
   "(Elena non è più in linea.)"
  ]
 },
 "ELE_litigio_10": {
  "text": [
   "Non te lo chiedo più.",
   "Però il telefono lo tengo acceso. Anche in pausa. Anche dopo."
  ]
 },
 "ELE_distanza_01": {
  "text": [
   "La foto di Parigi.",
   "Adesso mi spieghi da dove l’hai presa."
  ],
  "opts": {
   "0": "Dal telefono. L’ho appena scattata.",
   "1": "Aprila e guarda l’orario.",
   "2": "Se non ci credi, problemi tuoi."
  }
 },
 "ELE_distanza_02": {
  "text": [
   "Prima eri vicino a Roma.",
   "Quale delle due cose mi hai raccontato storta?"
  ],
  "alt": {
   "0": "«Domani la vendo», mi avevi detto. E adesso dovrei crederti sull’ora della foto?"
  },
  "opts": {
   "0": "Nessuna delle due.",
   "1": "Sono entrato in una galleria, e all’uscita c’era questo."
  }
 },
 "ELE_distanza_03": {
  "text": [
   "L’ho aperta. L’ora è quella, sì.",
   "Ma una foto salvata da un’altra parte è sempre una foto sul telefono."
  ],
  "alt": {
   "0": "La macchina me l’hai fatta vedere, va bene. Adesso però vuoi che guardi Parigi."
  },
  "opts": {
   "0": "Te ne mando un’altra, più larga.",
   "1": "Pensa pure che ti stia prendendo in giro."
  }
 },
 "ELE_distanza_04": {
  "text": [
   "Decidi tu anche quando ho finito di farti domande.",
   "Mandami il bordo della foto."
  ],
  "alt": {
   "0": "Prima mi racconti una bugia, e adesso ti serve che ti creda."
  },
  "opts": {
   "0": "Ti mando la foto intera.",
   "1": "E allora arrangiati."
  }
 },
 "ELE_distanza_05": {
  "text": [
   "La scritta è quella, il posto è quello.",
   "Però l’orario che mi hai dato prima non torna."
  ],
  "alt": {
   "0": "Anche nella seconda foto il posto è lo stesso. E l’orario di prima?"
  },
  "opts": {
   "0": "Torna, invece. Tienitele.",
   "1": "Tienitele. Io chiudo."
  }
 },
 "ELE_distanza_06": {
  "text": [
   "Una galleria.",
   "Ma prima di scrivermelo ti senti come suona, almeno?"
  ],
  "opts": {
   "0": "Lo sento. Ma il posto è quello.",
   "1": "Ti riscrivo quando ho una spiegazione."
  }
 },
 "ELE_distanza_07": {
  "text": [
   "Quindi adesso ho pure una foto da guardare.",
   "Prima mi bastava il telefono."
  ],
  "opts": {
   "0": "La foto resta lì."
  }
 },
 "ELE_distanza_08": {
  "text": [
   "Quella foto me la tengo aperta.",
   "E il prossimo orario che mi scrivi lo controllo."
  ],
  "alt": {
   "0": "Il posto torna. Mi resta da capire quando sei partito."
  }
 },
 "ELE_riparazione_01": {
  "text": [
   "Ho staccato.",
   "Allora, la macchina la vendi sì o no?"
  ],
  "alt": {
   "0": "La foto ce l’ho ancora aperta. E la vendita, invece, come va?",
   "1": "La paghi tu, ho capito. Ho staccato adesso: te la tieni ancora?"
  },
  "opts": {
   "0": "No. Me la tengo.",
   "1": "Sono ancora fermo. Ho dormito.",
   "2": "Sai chiedermi solo quello?"
  }
 },
 "ELE_riparazione_02": {
  "text": [
   "Quindi era un viaggio, mica la strada per tornare a casa."
  ],
  "alt": {
   "0": "Il «domani» della prima sera è passato da un pezzo, e la macchina è ancora lì."
  },
  "opts": {
   "0": "Sì. È questo che ho scelto.",
   "1": "Era una bugia."
  }
 },
 "ELE_riparazione_03": {
  "text": [
   "Dormito quanto?",
   "Io ti chiedo della vendita e tu mi rispondi con una dormita."
  ],
  "opts": {
   "0": "Poco. Sono ancora stanco.",
   "1": "Per adesso ti rispondo così."
  }
 },
 "ELE_riparazione_04": {
  "text": [
   "È l’unica su cui cambi risposta ogni volta.",
   "Mi fai passare un turno intero a tirare a indovinare, e poi quella pesante sono io."
  ],
  "opts": {
   "0": "Non la vendo. Ecco la risposta.",
   "1": "Sono stato uno stronzo. Ma me la tengo."
  }
 },
 "ELE_riparazione_05": {
  "text": [
   "E quando l’hai deciso?",
   "Prima di chiamarmi, vero?"
  ],
  "opts": {
   "0": "Prima.",
   "1": "Dopo che mi hai detto di venderla."
  }
 },
 "ELE_riparazione_06": {
  "text": [
   "Mi hai lasciata fare tutti quei discorsi...",
   "...e intanto sapevi già come andava a finire."
  ],
  "opts": {
   "0": "Sì. Ti ho lasciata parlare."
  }
 },
 "ELE_riparazione_07": {
  "text": [
   "Allora per oggi mi tengo questa.",
   "L’altra la lasciamo lì."
  ],
  "opts": {
   "0": "Per oggi questa."
  }
 },
 "ELE_riparazione_08": {
  "text": [
   "Vado a dormire.",
   "Quando riparti scrivimi. Il resto non è risolto, eh."
  ],
  "alt": {
   "0": "L’hai scelto solo per darmi torto. Quindi in quella macchina ci sono anch’io?"
  }
 },
 "ELE_nonno_01": {
  "text": [
   "Nonno, quel navigatore ti ha già denunciato?",
   "Cos’è che devi ancora controllare?"
  ],
  "alt": {
   "0": "Hai dormito poco, eh. Nonno, stai ancora litigando col navigatore?"
  },
  "opts": {
   "0": "Quanti anni avevo quando hai cominciato a chiamarmi così?",
   "1": "Non chiamarmi così.",
   "2": "Ormai quello parla meno di te."
  }
 },
 "ELE_nonno_02": {
  "text": [
   "Otto. Ha cominciato Claudio, perché brontolavi sempre.",
   "Adesso posso sapere perché mi stai facendo l’interrogatorio?"
  ],
  "opts": {
   "0": "Volevo vedere se te lo ricordavi.",
   "1": "L’ho sentito dire in un altro modo."
  }
 },
 "ELE_nonno_03": {
  "text": [
   "Da quando ti dà fastidio?",
   "Quando ti do ragione o quando comincio a rompere?"
  ],
  "opts": {
   "0": "Oggi mi dà fastidio, punto.",
   "1": "Dimmelo come lo diceva Claudio."
  }
 },
 "ELE_nonno_04": {
  "text": [
   "Lui ti dice dove andare.",
   "Io ti ho detto dove tornare. Ecco perché a lui vuoi bene."
  ],
  "opts": {
   "0": "Tu lo dici per prendermi in giro. Lui no.",
   "1": "Tieniti pure il soprannome."
  }
 },
 "ELE_nonno_05": {
  "text": [
   "Certo che me lo ricordo.",
   "La tua prima risposta ce l’ho ancora qui. Il resto me lo dici quando ti pare."
  ],
  "opts": {
   "0": "Ti chiedevo del soprannome, non altro."
  }
 },
 "ELE_nonno_06": {
  "text": [
   "Claudio lo diceva con tenerezza.",
   "Io ti prendo per il culo, cretino. Almeno adesso te ne accorgi?"
  ],
  "opts": {
   "0": "Adesso sì."
  }
 },
 "ELE_nonno_07": {
  "text": [
   "Per oggi lo lascio stare.",
   "Quello tenero era Claudio. Io te lo dico perché rompi le scatole."
  ],
  "opts": {
   "0": "Lui con tenerezza, tu per sfottermi."
  }
 },
 "ELE_nonno_08": {
  "text": [
   "Otto anni. Claudio. E facevi la stessa faccia offesa di adesso.",
   "Smettila di farmi domande di cui sai già la risposta."
  ],
  "alt": {
   "0": "Per oggi niente soprannome. Ma la domanda me la ricordo."
  }
 },
 "ELE_cena_ritorno_01": {
  "text": [
   "Ho mangiato. Il tuo piatto l’ho messo via.",
   "Vuoi che lo tiri fuori o anche stavolta è un modo per salutarmi?"
  ],
  "alt": {
   "0": "Il piatto me l’avevi detto tu di metterlo via. Perché oggi dovrei tirarlo fuori?",
   "1": "Quel tuo «ancora un po’» l’ho aspettato. Stasera ho mangiato prima.",
   "2": "La macchina veniva dopo, dicevi. E adesso vuoi tornare?"
  },
  "opts": {
   "0": "Lascialo dov’è. Non so quando torno.",
   "1": "Tiralo fuori. Voglio sedermi lì.",
   "2": "Stavolta volevo solo sentirti."
  }
 },
 "ELE_cena_ritorno_02": {
  "text": [
   "Quel «non so quando» lo conosco bene.",
   "Cosa cambierebbe, se adesso ti credessi?"
  ],
  "alt": {
   "0": "Un «domani» per farmi smettere l’avevi trovato. E oggi?",
   "1": "Il conto è arrivato. Quello che manca è l’ora in cui torni."
  },
  "opts": {
   "0": "Quando arrivo ti chiamo. Prima non ti prometto niente.",
   "1": "Niente. Ma la voglia di tornare è vera."
  }
 },
 "ELE_cena_ritorno_03": {
  "text": [
   "Lo tiro fuori.",
   "Tutto quello che abbiamo da dirci ce lo portiamo a tavola."
  ],
  "opts": {
   "0": "Anche la macchina. Ne parliamo lì.",
   "1": "Se ricominci, resto fuori."
  }
 },
 "ELE_cena_ritorno_04": {
  "text": [
   "Mi hai sentita. Sono ancora contraria.",
   "La voce è sempre la stessa, anche quando non ti serve."
  ],
  "alt": {
   "0": "Mi avevi nascosto perfino l’insegna. E oggi ti basta la mia voce?"
  },
  "opts": {
   "0": "Lo so. Per questo ho chiamato te.",
   "1": "Allora chiudiamo qui."
  }
 },
 "ELE_cena_ritorno_05": {
  "text": [
   "Chiamami quando sei sotto.",
   "Scendo io. E la macchina resta fuori."
  ],
  "alt": {
   "0": "Il piatto è in tavola. Chiamami quando sei sotto. E la macchina resta fuori."
  },
  "opts": {
   "0": "Quando sono sotto. E senza far finta di averla venduta."
  }
 },
 "ELE_cena_ritorno_06": {
  "text": [
   "Puoi voler tornare e intanto continuare a non farlo.",
   "Finora ti è riuscito benissimo."
  ],
  "opts": {
   "0": "Mi prendo anche questa."
  }
 },
 "ELE_cena_ritorno_07": {
  "text": [
   "Il piatto lo rimetto via.",
   "Quella frase te la tieni tu."
  ],
  "opts": {
   "0": "Quella frase me la tengo, sì."
  }
 },
 "ELE_cena_ritorno_08": {
  "text": [
   "Tengo il telefono acceso.",
   "Quando arrivi svegliami, anche se è tardi."
  ],
  "alt": {
   "0": "Il telefono è acceso. Il tuo «resto fuori» ne parliamo quando torni."
  }
 },
 "ELE_temperino_fissato": {
  "text": [
   "Oltre alle chiavi ti hanno dato qualcos’altro?"
  ],
  "opts": {
   "0": "Il suo regalo: un temperino.",
   "1": "Una busta, con dentro un temperino."
  }
 },
 "ELE_temperino_risposta": {
  "text": [
   "Allora almeno quello non è roba trovata per caso."
  ],
  "alt": {
   "0": "Era un regalo, quindi. Mica l’hai trovato per caso."
  }
 },
 "ELE_claudio_fissato": {
  "text": [
   "Ma tu Claudio quante volte l’avevi visto?"
  ],
  "opts": {
   "0": "Tre. So poco di lui.",
   "1": "Tre volte. Lo conoscevo poco."
  }
 },
 "ELE_claudio_risposta": {
  "text": [
   "Anche per me era quasi uno sconosciuto. Non c’è bisogno di fingere il contrario."
  ],
  "alt": {
   "0": "Tre volte. Mica diventa una vita passata insieme."
  }
 },
 "SPORCO_01": {
  "text": [
   "Nonno, torna da me. Qui c’è ancora posto."
  ]
 },
 "SPORCO_02": {
  "text": [
   "Nonno, non devi spiegarmi niente. Vieni e basta."
  ]
 },
 "SPORCO_03": {
  "text": [
   "Ti aspetto, Nonno. Io non ti lascerei mai fuori."
  ]
 },
 "SPORCO_04": {
  "text": [
   "Nonno, fammi sentire che ci sei. Mi basta questo."
  ]
 },
 "SPORCO_05": {
  "text": [
   "Vieni a prendermi, Nonno. Lo so che non mi lasci qui."
  ]
 },
 "SPORCO_06": {
  "text": [
   "Nonno, siamo noi. Lascia stare quello che dice la foto."
  ]
 },
 "ROS_attrezzi_01": {
  "text": [
   "Smettila di accenderla! Passami quello che ti sto indicando."
  ],
  "alt": {
   "0": "Testone, leva la mano dalla chiave. Poi lavoriamo.",
   "1": "Una Panda. Prima la controlliamo, poi mi racconti quanto ci sei affezionato.",
   "2": "Un’Audi. Prima il controllo, la famiglia può aspettare.",
   "3": "Una V40. Controlliamola prima di caricarci sopra tutta la tua vita.",
   "4": "Una Punto. Mettiamo in fila i problemi, e lasciamo stare il nome.",
   "5": "Una Corsa. Guarda che il nome sul baule non è un consiglio di guida.",
   "6": "Una Polo. Prima la guardiamo noi, non aspettiamo che ci racconti tutto lei."
  },
  "opts": {
   "0": "Questo, porca troia?",
   "1": "Spiegami cosa devo guardare, senza riaccenderla.",
   "2": "Fai tu. Adesso non ho voglia di imparare."
  }
 },
 "ROS_attrezzi_02": {
  "text": [
   "Tieniti la fiducia e passami gli attrezzi, testa di cazzo."
  ],
  "opts": {
   "0": "Dimmi cosa devo tenere.",
   "1": "Quale dei due?",
   "2": "Che palle... dimmi cosa vuoi che tocchi."
  }
 },
 "ROS_attrezzi_03": {
  "text": [
   "Bravo. Adesso tienilo fermo, e non fare la statua."
  ],
  "opts": {
   "0": "Lo tengo fermo.",
   "1": "Se si muove ti avviso."
  }
 },
 "ROS_attrezzi_04": {
  "text": [
   "No, quell’altro! Porca puttana, te lo sto pure indicando col dito."
  ],
  "opts": {
   "0": "Ah, adesso l’ho visto.",
   "1": "Va bene, va bene. Questo."
  }
 },
 "ROS_attrezzi_05": {
  "text": [
   "Il resto lo controllo prima che riparti."
  ],
  "opts": {
   "0": "Ti do una mano?",
   "1": "Mi metto da parte e guardo.",
   "2": "Se c’è un’altra rottura di cazzo dimmelo."
  }
 },
 "ROS_attrezzi_06": {
  "text": [
   "Dare una mano non vuol dire toccare tutto."
  ],
  "opts": {
   "0": "Tocco solo quello che mi dici tu.",
   "1": "Ricevuto. Niente esplorazioni."
  }
 },
 "ROS_attrezzi_07": {
  "text": [
   "Guardare va bene. Ma se commenti ogni rumore te lo faccio pagare a parte."
  ],
  "opts": {
   "0": "Allora per adesso ascolto e basta.",
   "1": "Mi sto già risparmiando qualche euro.",
   "2": "Il controllo me l’avevi già fatto vedere: guardo prima di accenderla."
  }
 },
 "ROS_attrezzi_08": {
  "text": [
   "Mi chiamo Rosa. Se vuoi ringraziarmi, parti piano e senti come va."
  ],
  "alt": {
   "0": "Prima hai lasciato fare a me. Il prossimo controllo lo facciamo alla sosta.",
   "1": "Bravo, zuccone. Parti piano e fammi sapere come va."
  }
 },
 "ROS_prudenza_01": {
  "text": [
   "Hai riposato o ti sei solo preso un caffè?"
  ],
  "opts": {
   "0": "Un caffè.",
   "1": "Mi fermo qui. Devo ammettere che sono stanco.",
   "2": "Risparmiami i consigli sul sonno."
  }
 },
 "ROS_prudenza_02": {
  "text": [
   "Il caffè mica ti ripara la notte. Ti tiene solo sveglio a guardarla."
  ],
  "opts": {
   "0": "Resto qui un po’.",
   "1": "Ci penso alla prossima sosta."
  }
 },
 "ROS_prudenza_03": {
  "text": [
   "E allora per una volta non devi dimostrarmi un accidente."
  ],
  "opts": {
   "0": "Non stavo facendo il fenomeno.",
   "1": "È proprio il consiglio che mi serviva."
  }
 },
 "ROS_prudenza_04": {
  "text": [
   "Fermati prima di non riuscire più a decidere."
  ],
  "opts": {
   "0": "Mi fermo prima.",
   "1": "Aspetto un po’ e poi vedo come sto."
  }
 },
 "ROS_prudenza_05": {
  "text": [
   "E non chiedermi quanti chilometri ti mancano prima di crollare."
  ],
  "opts": {
   "0": "Non te lo chiedo.",
   "1": "Mi sembrava una domanda sensata.",
   "2": "Che cazzo ne so io quanto manca."
  }
 },
 "ROS_prudenza_06": {
  "text": [
   "Bene. Fermarsi non vuol dire arrendersi."
  ],
  "alt": {
   "0": "Bene. Una sosta prima di crollare. Quasi quasi ti sopporto."
  },
  "opts": {
   "0": "Non è una gara, lo so.",
   "1": "Quando riparto ti avviso."
  }
 },
 "ROS_prudenza_07": {
  "text": [
   "Se riparti, riparti perché ce la fai. Non per darmi torto."
  ],
  "opts": {
   "0": "Non devo darti torto.",
   "1": "Ci penso prima di accendere.",
   "2": "La sosta l’avevo scelta. Mi sono fermato."
  }
 },
 "ROS_prudenza_08": {
  "text": [
   "Decidi da fermo. Io non faccio il tifo per vederti crepare."
  ],
  "alt": {
   "0": "Sul sonno mi hai chiesto di stare zitta. Ti chiedo solo se sei fermo.",
   "1": "Ti voglio intero alla sosta. La fretta vaffanculo."
  }
 },
 "ROS_ricontrollo_01": {
  "text": [
   "Allora, ti sei fermato?"
  ],
  "opts": {
   "0": "Sì. Ho fatto come mi hai detto.",
   "1": "Ti scrivo cosa ho controllato. Se manca qualcosa dimmelo.",
   "2": "Niente resoconto. Riparto."
  }
 },
 "ROS_ricontrollo_02": {
  "text": [
   "Te l’avevo detto, di non tirare tutta la notte."
  ],
  "alt": {
   "0": "La sosta l’avevi scelta tu. Adesso dimmi se ti è servita."
  },
  "opts": {
   "0": "Non volevo ammettere di essere stanco.",
   "1": "Mi sono fermato prima di crollare."
  }
 },
 "ROS_ricontrollo_03": {
  "text": [
   "Non sto contando le ore. È che stai scrivendo ogni cosa tre volte."
  ],
  "opts": {
   "0": "Adesso scrivo più piano, apposta.",
   "1": "Hai ragione. Rispondere non basta.",
   "2": "Mi rompi il cazzo, ma hai ragione."
  }
 },
 "ROS_ricontrollo_04": {
  "text": [
   "Se ti sei fermato davvero, al telefono non devi fare finta di essere sveglio."
  ],
  "opts": {
   "0": "Non devo convincerti di niente.",
   "1": "Voglio solo sapere se posso ripartire."
  }
 },
 "ROS_ricontrollo_05": {
  "text": [
   "Riesci a dirmi come stai senza fare una battuta?"
  ],
  "alt": {
   "0": "Dimmi come stai. La battuta la fai quando smetti di tremare."
  },
  "opts": {
   "0": "Sono stanco. Mi fermo.",
   "1": "Sto meglio. Controllo la macchina e poi decido."
  }
 },
 "ROS_ricontrollo_06": {
  "text": [
   "Va bene. È questo che mi serviva sapere."
  ],
  "opts": {
   "0": "Ti avviso quando posso.",
   "1": "Sugli orari non prometto niente."
  }
 },
 "ROS_ricontrollo_07": {
  "text": [
   "Allora prima di ripartire dai un’occhiata alla macchina, testone."
  ],
  "opts": {
   "0": "Un controllo, poi decido.",
   "1": "Lo faccio, senza chiedere applausi.",
   "2": "Ti descrivo quel punto lì, come nel controllo di prima."
  }
 },
 "ROS_ricontrollo_08": {
  "text": [
   "Ti richiamo dopo. Non stare sveglio ad aspettare me."
  ],
  "alt": {
   "0": "Niente resoconto, come hai deciso tu. Ma da qui la macchina non posso garantirtela."
  }
 },
 "ROS_passato_01": {
  "text": [
   "Io ci sono entrata con Ottavio, sei anni fa."
  ],
  "opts": {
   "0": "Chi era per te?",
   "1": "Se non vuoi raccontarmi il resto non te lo chiedo.",
   "2": "Preferisco non sapere la tua storia."
  }
 },
 "ROS_passato_02": {
  "text": [
   "Un collega. Faceva il rappresentante. E non aggiungere altro."
  ],
  "opts": {
   "0": "Non aggiungo niente.",
   "1": "Dimmi solo quello che serve."
  }
 },
 "ROS_passato_03": {
  "text": [
   "Io sono uscita. Lui è rimasto dentro."
  ],
  "opts": {
   "0": "È per lui che sei ancora qui.",
   "1": "Non ti chiedo di tornarci adesso."
  }
 },
 "ROS_passato_04": {
  "text": [
   "Se ti dico che non so tutto, non è per farmi pregare."
  ],
  "opts": {
   "0": "Me lo ricordo.",
   "1": "Prima ti chiederò cosa sai davvero.",
   "2": "Diciamocelo, allora: qui nessuno sa un cazzo."
  }
 },
 "ROS_passato_05": {
  "text": [
   "A Livia ho promesso che l’avrei riportato a casa. Non ci sono ancora riuscita."
  ],
  "opts": {
   "0": "Se troviamo un modo, ti aiuto.",
   "1": "Prima voglio capire quanto si rischia."
  }
 },
 "ROS_passato_06": {
  "text": [
   "Puoi ascoltarmi senza dirmi che andrà tutto bene?"
  ],
  "alt": {
   "0": "Resta qui. E non dirmi che andrà bene solo per farmi respirare."
  },
  "opts": {
   "0": "Ti ascolto.",
   "1": "Come andrà non lo so neanche io."
  }
 },
 "ROS_passato_07": {
  "text": [
   "E non promettermi niente solo perché ti senti in colpa."
  ],
  "opts": {
   "0": "Non te lo prometto a caso.",
   "1": "Prima guardiamo cosa abbiamo in mano.",
   "2": "Dimmi fin dove possiamo arrivare. Il resto della storia tienilo."
  }
 },
 "ROS_passato_08": {
  "text": [
   "Quando sapremo dove andare, ne riparliamo."
  ],
  "alt": {
   "0": "Il passato non lo volevi sapere, va bene. Ma il rischio di adesso va guardato."
  }
 },
 "ROS_promessa_01": {
  "text": [
   "Prima hai detto che mi aiuti. Ma lo sai cosa stai promettendo?"
  ],
  "alt": {
   "0": "Hai promesso di cercarlo. Prima però guardiamo il rischio, poi il resto."
  },
  "opts": {
   "0": "Ti aiuto a cercarlo. Ma non apro niente alla cieca.",
   "1": "Se non sappiamo chi c’è davanti, la promessa finisce lì.",
   "2": "Ci ho ripensato. Non ti aiuto, non rischio più."
  }
 },
 "ROS_promessa_02": {
  "text": [
   "Aiutarmi a cercarlo è una cosa. Aprire qualsiasi porta è un’altra."
  ],
  "opts": {
   "0": "Allora restiamo a quello che ho promesso.",
   "1": "Se manca una prova, ci fermiamo.",
   "2": "Una porta alla volta. E nessuno mi prende per il culo."
  }
 },
 "ROS_promessa_03": {
  "text": [
   "Bene. Almeno non ti devo trascinare."
  ],
  "opts": {
   "0": "Vengo perché lo scelgo io.",
   "1": "Dimmi il rischio e poi decido."
  }
 },
 "ROS_promessa_04": {
  "text": [
   "Questo lo rispetto più di un sì detto per pietà."
  ],
  "opts": {
   "0": "Non devi convincermi facendomi sentire in colpa.",
   "1": "Allora lasciamola così."
  }
 },
 "ROS_promessa_05": {
  "text": [
   "Se troviamo Ottavio vivo, poi pensiamo a come tirarlo fuori."
  ],
  "opts": {
   "0": "Prima però accertiamoci che sia lui.",
   "1": "Prima una prova, poi il passaggio."
  }
 },
 "ROS_promessa_06": {
  "text": [
   "E se invece troviamo una copia, non la chiamiamo Ottavio."
  ],
  "opts": {
   "0": "Non confondo il ricordo con lui.",
   "1": "Se non capisco qualcosa te lo dico.",
   "2": "Avevamo detto: prima lo riconosciamo, poi apriamo. Resta così."
  }
 },
 "ROS_promessa_07": {
  "text": [
   "I dubbi si dicono prima di partire, porca miseria."
  ],
  "opts": {
   "0": "Li dico prima.",
   "1": "Anche se ti fanno arrabbiare.",
   "2": "Se ho un dubbio lo dico, anche se t’incazzi."
  }
 },
 "ROS_promessa_08": {
  "text": [
   "Va bene. Adesso almeno abbiamo una promessa che si capisce."
  ],
  "alt": {
   "0": "Ti sei tirato indietro. Riparlarne non cancella quello che hai scelto.",
   "1": "Una promessa con un limite. Bravo, coglione."
  }
 },
 "ROS_dopo_passaggio_01": {
  "text": [
   "Prima di tutto: sei ferito?"
  ],
  "opts": {
   "0": "Non credo. Controllo.",
   "1": "Sono vivo. Ma prima di parlare devo calmarmi.",
   "2": "Oggi non chiedermi come sto."
  }
 },
 "ROS_dopo_passaggio_02": {
  "text": [
   "Controlla davvero, non tirare a indovinare."
  ],
  "opts": {
   "0": "Ok, adesso ti dico come sto davvero.",
   "1": "Dammi un attimo."
  }
 },
 "ROS_dopo_passaggio_03": {
  "text": [
   "La macchina può aspettare. Rispondi tu, prima."
  ],
  "opts": {
   "0": "Hai ragione. Mi controllo.",
   "1": "La macchina sta lì, non scappa."
  }
 },
 "ROS_dopo_passaggio_04": {
  "text": [
   "Non mi serve la versione da eroe."
  ],
  "opts": {
   "0": "Ho avuto paura.",
   "1": "Non capivo più dove finiva la corsia."
  }
 },
 "ROS_dopo_passaggio_05": {
  "text": [
   "Questa corsa è finita. Il resto no."
  ],
  "opts": {
   "0": "Ti scrivo quello che mi ricordo.",
   "1": "Prima voglio capire cosa comporta."
  }
 },
 "ROS_dopo_passaggio_06": {
  "text": [
   "Quello che hai visto scrivimelo da fermo. E non riempire i buchi dopo."
  ],
  "opts": {
   "0": "Niente aggiunte per far tornare i conti.",
   "1": "Se manca un pezzo te lo dico."
  }
 },
 "ROS_dopo_passaggio_07": {
  "text": [
   "Se non ce l’hai fatta, vediamo cosa resta da fare."
  ],
  "opts": {
   "0": "Non la rifaccio per orgoglio.",
   "1": "Ripartiamo da quello che sappiamo.",
   "2": "Mi sono calmato. Adesso posso raccontarti."
  }
 },
 "ROS_dopo_passaggio_08": {
  "text": [
   "Per adesso respira e basta. Gli insulti dopo."
  ],
  "alt": {
   "0": "Non ti chiedo come stai, come volevi tu. Se ti serve, scrivimi.",
   "1": "Respira. Gli insulti aspettano che tu sia tutto intero."
  }
 },
 "ROS_segni_01": {
  "text": [
   "Quei segni fuori dalla porta li riconosco."
  ],
  "opts": {
   "0": "Li hai lasciati tu, quando ci hai provato?",
   "1": "Teniamo separati il tuo ritorno e quello che scegliamo noi.",
   "2": "Quella traccia non la userò per aiutarti."
  }
 },
 "ROS_segni_02": {
  "text": [
   "Sì. Ero già uscita, e ci sono tornata."
  ],
  "opts": {
   "0": "Per Ottavio.",
   "1": "Perché ci sei rientrata?"
  }
 },
 "ROS_segni_03": {
  "text": [
   "Ottavio era dentro. Un piano migliore non ce l’avevo."
  ],
  "opts": {
   "0": "Non devi giustificarti.",
   "1": "Voglio capire cosa ti è mancato."
  }
 },
 "ROS_segni_04": {
  "text": [
   "Non stavo scappando. Stavo cercando di rientrare."
  ],
  "opts": {
   "0": "Ecco, adesso quei segni hanno un senso.",
   "1": "Allora non la chiamerò più fuga."
  }
 },
 "ROS_segni_05": {
  "text": [
   "E non guardarmi come se adesso dovessi per forza rifarlo."
  ],
  "opts": {
   "0": "Prima troviamo la strada.",
   "1": "Prima ci serve un piano."
  }
 },
 "ROS_segni_06": {
  "text": [
   "Se lo facciamo, stavolta ci serve una strada vera."
  ],
  "opts": {
   "0": "Prepariamo il recupero.",
   "1": "Sentiamo prima Livia."
  }
 },
 "ROS_segni_07": {
  "text": [
   "Aspettare non vuol dire che ce ne freghiamo."
  ],
  "opts": {
   "0": "Aspettare una prova non vuol dire abbandonarlo.",
   "1": "Non ti chiedo un altro salto nel buio.",
   "2": "Quella traccia non era un ordine. Prima troviamo la strada."
  }
 },
 "ROS_segni_08": {
  "text": [
   "Tienila da parte, quella prova. Voglio sapere cosa abbiamo visto davvero."
  ],
  "alt": {
   "0": "La traccia l’hai lasciata lì anche dopo averla vista. Non era persa.",
   "1": "Tieni la traccia. Poi la guardiamo insieme, con calma.",
   "2": "Hai visto perché ero tornata. Non stavo scappando."
  }
 },
 "ROS_recupero_01": {
  "text": [
   "La promessa era cercarlo, ma con una strada. Adesso la strada ce l’abbiamo."
  ],
  "opts": {
   "0": "Mantengo la promessa. Prepariamo il recupero.",
   "1": "Prima di entrare decidiamo quando fermarci.",
   "2": "Al recupero non vengo."
  }
 },
 "ROS_recupero_02": {
  "text": [
   "Prima mi hai detto che non aprivi niente alla cieca. Bene così."
  ],
  "alt": {
   "0": "Avevi detto: prima lo riconosciamo, poi apriamo."
  },
  "opts": {
   "0": "La mia condizione è sempre quella.",
   "1": "Se cambia il percorso te lo dico."
  }
 },
 "ROS_recupero_03": {
  "text": [
   "Se adesso vuoi fermarti, dillo prima di partire."
  ],
  "opts": {
   "0": "Non mi fermo per paura di dirtelo.",
   "1": "Ti rispondo prima di entrare."
  }
 },
 "ROS_recupero_04": {
  "text": [
   "Io voglio riportare indietro Ottavio, non qualcosa che gli somiglia."
  ],
  "opts": {
   "0": "Riportiamo lui, se è davvero lui.",
   "1": "Non basta che abbia la sua voce."
  }
 },
 "ROS_recupero_05": {
  "text": [
   "Lo so che è rischioso. Non è che a parolacce il rischio sparisce."
  ],
  "opts": {
   "0": "Vengo al punto.",
   "1": "Preparo un piano di riserva."
  }
 },
 "ROS_recupero_06": {
  "text": [
   "Allora andiamo fin dove abbiamo detto. Non oltre."
  ],
  "opts": {
   "0": "Non oltre, se prima non ne parliamo.",
   "1": "Se cambia qualcosa, niente colpi di testa."
  }
 },
 "ROS_recupero_07": {
  "text": [
   "Va bene. Meglio una risposta vera che un altro disperso."
  ],
  "alt": {
   "0": "Il recupero l’avevi rimandato. Mica è già fatto."
  },
  "opts": {
   "0": "Il risultato non te lo prometto.",
   "1": "Ti prometto che non farò finta di sapere.",
   "2": "Il limite che abbiamo deciso non lo sposto."
  }
 },
 "ROS_recupero_08": {
  "text": [
   "Scrivimi quando puoi. Ma quando guidi, guida."
  ],
  "alt": {
   "0": "Hai deciso di non venire. Il recupero non si fa da solo.",
   "1": "Torna indietro, non fare l’eroe. E quando guidi non rispondere a me.",
   "2": "Il recupero l’hai scelto. Adesso guida, e basta."
  }
 },
 "ROS_guardia_01": {
  "text": [
   "Chi resta di guardia, fuori se lo dimenticano."
  ],
  "opts": {
   "0": "È quello che sta succedendo a te?",
   "1": "Prima di dire «resto» voglio capire cosa vuol dire.",
   "2": "Non voglio sapere altro sul prezzo."
  }
 },
 "ROS_guardia_02": {
  "text": [
   "Un po’ alla volta. E non sei tu che smetti di ricordare."
  ],
  "opts": {
   "0": "Quindi io Elena me la ricorderei ancora.",
   "1": "Non finisce solo il viaggio, quindi."
  }
 },
 "ROS_guardia_03": {
  "text": [
   "E non dire «resto io» come se mi stessi tenendo una chiave in mano."
  ],
  "opts": {
   "0": "Voglio capirlo prima di promettere.",
   "1": "Non sto decidendo adesso."
  }
 },
 "ROS_guardia_04": {
  "text": [
   "Io sono rimasta per una promessa. Devi saperlo prima."
  ],
  "opts": {
   "0": "La tua promessa era Ottavio.",
   "1": "Anche la mia deve avere un nome."
  }
 },
 "ROS_guardia_05": {
  "text": [
   "Se decidi di restare, deve uscire qualcuno di vero."
  ],
  "opts": {
   "0": "Prima troviamo chi può uscire.",
   "1": "Prima vediamo bene il prezzo."
  }
 },
 "ROS_guardia_06": {
  "text": [
   "Non ti dirò che è una bella cosa."
  ],
  "opts": {
   "0": "Non te lo sto chiedendo.",
   "1": "Meglio che tu me lo dica così."
  }
 },
 "ROS_guardia_07": {
  "text": [
   "E non ti dirò nemmeno che chi sceglie di uscire è un vigliacco."
  ],
  "opts": {
   "0": "Avevo bisogno di sentirmelo dire.",
   "1": "Non ti chiedo di scegliere al posto mio.",
   "2": "Avevo chiesto di guardare il prezzo prima di promettere."
  }
 },
 "ROS_guardia_08": {
  "text": [
   "Prenditi tutto il tempo che ti serve. Questa risposta non te la strappo."
  ],
  "alt": {
   "0": "Del prezzo non volevi sapere altro. Ma se vuoi restare devi capirlo.",
   "1": "Non ti strappo un sì. Il prezzo lo guardiamo prima."
  }
 },
 "ROS_prima_porta_01": {
  "text": [
   "Mi hai promesso di cercare Ottavio. Non di darmi la tua vita."
  ],
  "opts": {
   "0": "Lo so. Restare di guardia sarebbe un’altra scelta.",
   "1": "Se esco, non ti chiedo di dirmi che va tutto bene.",
   "2": "Scelgo senza dirtelo."
  }
 },
 "ROS_prima_porta_02": {
  "text": [
   "Quella promessa non ti obbliga a restare di guardia."
  ],
  "opts": {
   "0": "Non confondo le due cose.",
   "1": "Non ti devo un sì per forza."
  }
 },
 "ROS_prima_porta_03": {
  "text": [
   "Se esci, io lo so cosa hai fatto per noi."
  ],
  "opts": {
   "0": "Non me ne vado col tuo giudizio addosso.",
   "1": "Prima di andare ti dico cosa scelgo."
  }
 },
 "ROS_prima_porta_04": {
  "text": [
   "Se resti, devi dirlo sapendo chi puoi far uscire."
  ],
  "opts": {
   "0": "Ci deve essere qualcuno da far uscire.",
   "1": "Il prezzo dev’essere chiaro."
  }
 },
 "ROS_prima_porta_05": {
  "text": [
   "Non voglio che a scegliere sia la paura di deludermi."
  ],
  "opts": {
   "0": "Deciderò, ma non te lo prometto adesso.",
   "1": "Per ora preparo il ritorno."
  }
 },
 "ROS_prima_porta_06": {
  "text": [
   "Allora questa è la tua decisione. La mia la prendo dopo."
  ],
  "opts": {
   "0": "Te la dirò in faccia.",
   "1": "Niente risposte date per stanchezza."
  }
 },
 "ROS_prima_porta_07": {
  "text": [
   "Uscire va bene. Ma non diventare un debito da pagare."
  ],
  "opts": {
   "0": "Non voglio diventarlo.",
   "1": "Ti credo. Anche adesso.",
   "2": "La scelta è mia. Non ti chiedo di assolvermi."
  }
 },
 "ROS_prima_porta_08": {
  "text": [
   "Prima della porta scrivimi. E stavolta senza fare i duri."
  ],
  "alt": {
   "0": "Non volevi dirmelo. Non te lo strappo adesso.",
   "1": "Prima della porta scrivimi, anche se decidi di tornare."
  }
 },
 "LIV_primo_01": {
  "text": [
   "Hai nominato Claudio. Da dove viene quella macchina?"
  ],
  "opts": {
   "0": "L’ho scelta tra quelle dell’eredità.",
   "1": "Ti mando il dettaglio. Una spiegazione non ce l’ho ancora.",
   "2": "Per adesso non ti mando niente."
  }
 },
 "LIV_primo_02": {
  "text": [
   "Claudio mi ha lasciato delle cose. Ti dico quali, prima che ti immagini il peggio."
  ],
  "alt": {
   "0": "Claudio mi ha lasciato delle cose. Prima te le faccio vedere."
  },
  "opts": {
   "0": "Che originali?",
   "1": "E io come faccio a controllare quello che dici?"
  }
 },
 "LIV_primo_03": {
  "text": [
   "Non ti chiedo di fidarti di una voce al telefono."
  ],
  "opts": {
   "0": "Ti faccio vedere l’oggetto e i documenti.",
   "1": "Ti dico esattamente quello che ho visto."
  }
 },
 "LIV_primo_04": {
  "text": [
   "Prima vediamo cosa hai trovato."
  ],
  "opts": {
   "0": "Non ci metto quello che mi immagino.",
   "1": "Partiamo dai nomi."
  }
 },
 "LIV_primo_05": {
  "text": [
   "Il nome sulla macchina e quello sulle carte sono lo stesso."
  ],
  "opts": {
   "0": "Coincide solo il nome, però.",
   "1": "Il resto sono supposizioni."
  }
 },
 "LIV_primo_06": {
  "text": [
   "Su questo torna. Sul resto una risposta non ce l’ho ancora."
  ],
  "opts": {
   "0": "Mi serve sapere qual è la differenza.",
   "1": "Non facciamola diventare la risposta a tutto."
  }
 },
 "LIV_primo_07": {
  "text": [
   "Una copia può servire. Ma non chiamarla originale."
  ],
  "opts": {
   "0": "Mi segno anche da dove viene.",
   "1": "Se ho solo una copia ti avviso.",
   "2": "Ti mando il dettaglio, senza inventarmi il nome che manca."
  }
 },
 "LIV_primo_08": {
  "text": [
   "Io ti dico da dove viene ogni cosa. Tu fai lo stesso, d’accordo?"
  ],
  "alt": {
   "0": "Quel dettaglio non me l’hai mandato. Posso parlarne, ma non confermarlo.",
   "1": "Ti racconto anche i punti in cui mi sono persa.",
   "2": "Il nome torna. Il resto va cercato."
  }
 },
 "LIV_affido_01": {
  "text": [
   "Quello che hai tu non è quello che Claudio ha lasciato a me."
  ],
  "opts": {
   "0": "Ti mando quello che ho, così li confrontiamo.",
   "1": "Me lo tengo. Non te lo mando.",
   "2": "Non voglio più parlarne con te."
  }
 },
 "LIV_affido_02": {
  "text": [
   "L’originale resta qui. Mi basta confrontarlo con quello che hai tu."
  ],
  "opts": {
   "0": "Ti mando il mio, il tuo resta lì.",
   "1": "Confrontiamoli senza spostare quello che custodisci."
  }
 },
 "LIV_affido_03": {
  "text": [
   "Se non vuoi mandarmelo dimmelo e basta. Ci rimango male, ma non mi metto a fare il notaio."
  ],
  "alt": {
   "0": "Puoi tenertelo. Mi spiace solo non poterlo confrontare."
  },
  "opts": {
   "0": "Me lo tengo, anche se così niente confronto.",
   "1": "Non ti chiedo garanzie."
  }
 },
 "LIV_affido_04": {
  "text": [
   "Guarda che non ti sto chiedendo di restare a mani vuote."
  ],
  "opts": {
   "0": "Guardiamo quello che ti ho mandato.",
   "1": "Dimmi cosa torna."
  }
 },
 "LIV_affido_05": {
  "text": [
   "Non mi conosci abbastanza. Lo capisco, anche se mi dà fastidio."
  ],
  "opts": {
   "0": "Ne riparliamo quando riuscirò a fidarmi.",
   "1": "Capisco che così su questo non puoi aiutarmi."
  }
 },
 "LIV_affido_06": {
  "text": [
   "Arrivato. Adesso posso dirti cosa torna e cosa no."
  ],
  "opts": {
   "0": "Se mi sembra diverso te lo faccio riguardare.",
   "1": "Adesso almeno non è più solo un sospetto."
  }
 },
 "LIV_affido_07": {
  "text": [
   "Possiamo riparlarne. Non devi fidarti per forza, se non te la senti."
  ],
  "opts": {
   "0": "Il discorso tra noi non lo chiudo.",
   "1": "Non farò finta che sia già stato controllato.",
   "2": "Ti spiego perché l’avevo tenuto. Poi lo confrontiamo."
  }
 },
 "LIV_affido_08": {
  "text": [
   "Se ce lo teniamo per noi, resta una cosa che ci stiamo solo immaginando."
  ],
  "alt": {
   "0": "Il confronto l’avevi chiuso tu. Per riaprirlo manca ancora un pezzo.",
   "1": "Non fidarti per educazione. Lasciami solo la possibilità di riparlarne.",
   "2": "Adesso posso confrontarlo. Non devi fare tutto da solo."
  }
 },
 "LIV_ottavio_01": {
  "text": [
   "La macchina l’hanno trovata. Ottavio no."
  ],
  "opts": {
   "0": "Pensi che sia ancora lì?",
   "1": "Prima delle carte, dimmi cosa speri.",
   "2": "Non voglio sapere cosa speri."
  }
 },
 "LIV_ottavio_02": {
  "text": [
   "È mio fratello. La parte precisa di me non riesce a rispondere a tutto."
  ],
  "alt": {
   "0": "È mio fratello. Su tutto non riesco a essere ordinata."
  },
  "opts": {
   "0": "Cosa hai controllato?",
   "1": "E cosa invece è solo una speranza?"
  }
 },
 "LIV_ottavio_03": {
  "text": [
   "Che il suo nome sia nelle carte di Claudio è sicuro."
  ],
  "opts": {
   "0": "Partiamo da lì.",
   "1": "Ma non vuol dire che sia vivo."
  }
 },
 "LIV_ottavio_04": {
  "text": [
   "Vorrei che fosse vivo. La sera fatico a dire «non lo so»."
  ],
  "opts": {
   "0": "Grazie di avermelo detto.",
   "1": "Voglio sapere su cosa si basa."
  }
 },
 "LIV_ottavio_05": {
  "text": [
   "Ha telefonato quando avevano già smesso di cercarlo."
  ],
  "opts": {
   "0": "Confrontiamo la chiamata con il resto.",
   "1": "Non la butto via, ma non basta."
  }
 },
 "LIV_ottavio_06": {
  "text": [
   "La telefonata dimostra che c’era una voce. Da sola non dimostra di chi."
  ],
  "opts": {
   "0": "Serve una conferma da un’altra parte.",
   "1": "Neanche se la voce la riconosci."
  }
 },
 "LIV_ottavio_07": {
  "text": [
   "Non voglio darti una speranza in mano e chiamarla incarico."
  ],
  "opts": {
   "0": "Cerchiamo, senza promettere niente.",
   "1": "Non ti rispondo solo per consolarti.",
   "2": "Una speranza posso ascoltarla, senza farla diventare una certezza."
  }
 },
 "LIV_ottavio_08": {
  "text": [
   "Se trovi un segno, dimmi anche cosa non torna."
  ],
  "alt": {
   "0": "Mi avevi chiesto di non parlarti della speranza. Non vuol dire che mi sia passata.",
   "1": "Se non torna, dimmelo. Con una bugia non mi aiuti."
  }
 },
 "LIV_fiducia_01": {
  "text": [
   "Prima avevi deciso di non mandarmi quello che avevi."
  ],
  "alt": {
   "0": "Prima te l’eri tenuto per te. Ripartiamo da lì."
  },
  "opts": {
   "0": "Te lo mando.",
   "1": "Per adesso me lo tengo, ma ti ascolto.",
   "2": "Me lo tengo. Fine del discorso."
  }
 },
 "LIV_fiducia_02": {
  "text": [
   "Non ti chiedo di fare finta che ieri ci fidassimo già."
  ],
  "opts": {
   "0": "Non lo cancello. Ti chiedo di rimediare.",
   "1": "Dopo quello che ho visto ho cambiato idea."
  }
 },
 "LIV_fiducia_03": {
  "text": [
   "Se hai cambiato idea, mandami quello che stai guardando tu. Il resto ce l’ho già qui."
  ],
  "opts": {
   "0": "Te lo mando e li confrontiamo.",
   "1": "Quello che custodisci tu resta dov’è."
  }
 },
 "LIV_fiducia_04": {
  "text": [
   "Se te lo tieni ancora, posso solo dirti dove manca il controllo."
  ],
  "opts": {
   "0": "Dimmi quali punti non sono controllati.",
   "1": "Non ti userò come garanzia."
  }
 },
 "LIV_fiducia_05": {
  "text": [
   "Possiamo aver capito male e voler continuare ad aiutarci lo stesso."
  ],
  "alt": {
   "0": "Possiamo volerci aiutare e aver capito male lo stesso. Ripartiamo da lì."
  },
  "opts": {
   "0": "Se devi correggermi, correggimi.",
   "1": "Non ti chiedo di approvare tutto."
  }
 },
 "LIV_fiducia_06": {
  "text": [
   "Arrivato. E non serve fingere che fossimo d’accordo dall’inizio."
  ],
  "opts": {
   "0": "Ripartiamo da qui.",
   "1": "Ti dirò anche dove ho sbagliato."
  }
 },
 "LIV_fiducia_07": {
  "text": [
   "Va bene. Però non usarmi come testimone di cose che non ho controllato."
  ],
  "opts": {
   "0": "Non lo farò.",
   "1": "Ti chiederò solo quello che puoi sapere.",
   "2": "Ti dico il vero motivo per cui non te l’avevo mandato."
  }
 },
 "LIV_fiducia_08": {
  "text": [
   "Grazie di essere tornato sul discorso. Non eri obbligato ad accontentarmi."
  ],
  "alt": {
   "0": "Il confronto l’hai fermato tu. Per riprenderlo mi serve la copia.",
   "1": "Grazie di esserci tornato. Non ti faccio pagare ogni riga.",
   "2": "Hai riaperto il confronto. Ripartiamo da qui."
  }
 },
 "LIV_irene_01": {
  "text": [
   "Questa è la foto originale. Irene è quella sulla porta."
  ],
  "opts": {
   "0": "Confrontiamola con la copia.",
   "1": "Fammi vedere dove Claudio ricordava l’altra donna.",
   "2": "Quel punto non voglio guardarlo."
  }
 },
 "LIV_irene_02": {
  "text": [
   "Nella macchina di Claudio c’è una copia sbiadita. Possiamo metterle vicine."
  ],
  "opts": {
   "0": "La differenza si vede, e deve restare.",
   "1": "Non ritocchiamo l’originale per farlo tornare."
  }
 },
 "LIV_irene_03": {
  "text": [
   "Non voglio far dire a questa foto più di quello che fa vedere."
  ],
  "alt": {
   "0": "Non voglio che la foto mi dica tutto quello che ho paura di sapere."
  },
  "opts": {
   "0": "Non le chiedo di dimostrare tutto.",
   "1": "Partiamo da chi si vede."
  }
 },
 "LIV_irene_04": {
  "text": [
   "Dimostra chi c’era. E dove guardava."
  ],
  "opts": {
   "0": "Quella figura guardava dietro di me.",
   "1": "Questo posso confrontarlo con quello che ho visto."
  }
 },
 "LIV_irene_05": {
  "text": [
   "Guarda oltre la macchina, verso l’ingresso. Non verso di lui."
  ],
  "opts": {
   "0": "La porta si riconosce.",
   "1": "Mi tengo il collegamento tra il nome e la faccia."
  }
 },
 "LIV_irene_06": {
  "text": [
   "Se quella porta la riconosci, non la scambierai per una qualunque."
  ],
  "alt": {
   "0": "La foto l’abbiamo confrontata. La faccia non te la deve suggerire una voce."
  },
  "opts": {
   "0": "Non apro solo perché è una porta.",
   "1": "Prima voglio riconoscere chi la sorveglia."
  }
 },
 "LIV_irene_07": {
  "text": [
   "Il nome va insieme alla faccia. Non basta una voce che lo dice."
  ],
  "opts": {
   "0": "Non basta chiamarsi Irene.",
   "1": "Per riconoscerla mi serve una prova.",
   "2": "Riguardo lo spazio vuoto, come avevamo deciso."
  }
 },
 "LIV_irene_08": {
  "text": [
   "La faccia, il nome, la porta. Per adesso teniamoli insieme così come sono, senza aggiustarli."
  ],
  "alt": {
   "0": "Quel punto non volevi guardarlo. Non lo riempio io al posto tuo.",
   "1": "La guardiamo insieme. Non devi capirla prima per aiutarmi."
  }
 },
 "LIV_promessa_01": {
  "text": [
   "Rosa mi ha detto che avete parlato del recupero."
  ],
  "opts": {
   "0": "La mantengo, ma il risultato non te lo prometto.",
   "1": "Se non so una cosa te lo dico. Niente risposte finte.",
   "2": "Quello che trovo non te lo racconterò."
  }
 },
 "LIV_promessa_02": {
  "text": [
   "La promessa era cercare Ottavio. Non inventarsi un lieto fine."
  ],
  "opts": {
   "0": "È sempre quella.",
   "1": "Non ti vendo certezze."
  }
 },
 "LIV_promessa_03": {
  "text": [
   "Se torni senza di lui, voglio sapere cosa hai trovato."
  ],
  "opts": {
   "0": "Ti dirò anche quello che non avrei voluto vedere.",
   "1": "Non te lo nascondo per consolarti."
  }
 },
 "LIV_promessa_04": {
  "text": [
   "Se lo trovi vivo, prima mettetevi d’accordo sul passaggio."
  ],
  "opts": {
   "0": "Prima lui, poi la strada per uscire.",
   "1": "Non porto fuori qualcosa che lo imita."
  }
 },
 "LIV_promessa_05": {
  "text": [
   "A me una voce non basta. E non deve bastare neanche a te."
  ],
  "opts": {
   "0": "Se c’è una prova te la porto.",
   "1": "E se non c’è, te lo dico."
  }
 },
 "LIV_promessa_06": {
  "text": [
   "Grazie. Il resto non riesco a chiedertelo senza farmi del male da sola."
  ],
  "alt": {
   "0": "Puoi entrare anche senza una bella notizia da darmi."
  },
  "opts": {
   "0": "Questo te lo prometto.",
   "1": "Non ti mento."
  }
 },
 "LIV_promessa_07": {
  "text": [
   "Non ti chiedo di saperlo prima. Ti chiedo di non mentirmi dopo."
  ],
  "opts": {
   "0": "Te lo dirò.",
   "1": "Anche se mi vergognerò.",
   "2": "La promessa era dirti la verità, anche senza lieto fine."
  }
 },
 "LIV_promessa_08": {
  "text": [
   "Io resto qui. Quando puoi, raccontami anche quello che non avresti voluto trovare."
  ],
  "alt": {
   "0": "Il risultato volevi tenertelo. Per ripartire mi serve la verità.",
   "1": "Ti aspetto con quello che c’è, non con la risposta bella.",
   "2": "Mi hai promesso la verità. Non una bella notizia."
  }
 },
 "PRE_1_01": {
  "text": [
   "Quella non era roba tua."
  ],
  "alt": {
   "0": "La guardavi come se aspettassi che ti rispondesse."
  }
 },
 "PRE_1_02": {
  "text": [
   "Allora hai guardato bene."
  ],
  "alt": {
   "0": "Hai guardato bene. Adesso continui qui."
  }
 },
 "PRE_1_03": {
  "text": [
   "Ti interessa di più il nome o quello che hai trovato?"
  ],
  "opts": {
   "0": "Dimmi come fai a conoscere quell’oggetto.",
   "1": "Non ti dico nient’altro."
  }
 },
 "PRE_1_04": {
  "text": [
   "Il nome l’hai già letto. Il mio no."
  ]
 },
 "PRE_1_05": {
  "text": [
   "Quello che hai trovato è passato anche di qui."
  ]
 },
 "PRE_1_06": {
  "text": [
   "Puoi anche non rispondere."
  ],
  "alt": {
   "0": "Puoi anche non rispondere. Intanto hai letto."
  }
 },
 "PRE_1_07": {
  "text": [
   "Vuoi sentire il resto?"
  ],
  "opts": {
   "0": "Prima controllo quello che mi hai già detto.",
   "1": "Il messaggio me lo tengo, ma non ti seguo.",
   "2": "Per adesso finisce qui."
  }
 },
 "PRE_1_08": {
  "text": [
   "Ti sei tenuto una copia. Non è la stessa cosa."
  ],
  "alt": {
   "0": "La copia te la sei tenuta. E adesso vuoi che ti basti."
  }
 },
 "PRE_1_09": {
  "text": [
   "La domanda puoi lasciarla aperta."
  ],
  "alt": {
   "0": "Tu la domanda la lasci aperta. Anch’io."
  }
 },
 "PRE_1_10": {
  "text": [
   "Allora fermiamoci qui. Per adesso."
  ]
 },
 "PRE_2_01": {
  "text": [
   "Nonno, vieni. Non voglio restare da sola."
  ],
  "alt": {
   "0": "Nonno, vieni. Non farmi spiegare perché proprio tu.",
   "1": "Nonno, non farmi ripetere come ti chiamo. Vieni."
  }
 },
 "PRE_2_02": {
  "text": [
   "Sono nella galleria. La macchina non riparte."
  ]
 },
 "PRE_2_03": {
  "text": [
   "Mi riconosci, vero?"
  ],
  "opts": {
   "0": "Dimmi una cosa di casa.",
   "1": "Una voce non mi basta. Controllo prima."
  }
 },
 "PRE_2_04": {
  "text": [
   "Nonno, ti prego. Lo sai che sono io."
  ],
  "alt": {
   "0": "Nonno, se fossi qui non avresti bisogno di chiedermelo."
  }
 },
 "PRE_2_05": {
  "text": [
   "Adesso ti dà fastidio come ti chiamo?"
  ],
  "alt": {
   "0": "Allora, queste domande? Io ti sto aspettando."
  }
 },
 "PRE_2_06": {
  "text": [
   "Il turno può aspettare. Io no."
  ]
 },
 "PRE_2_07": {
  "text": [
   "Mi vieni a prendere?"
  ],
  "opts": {
   "0": "Prima di muovermi voglio controllare.",
   "1": "Cerco il posto, ma non apro niente.",
   "2": "Non vado dietro alla chiamata."
  }
 },
 "PRE_2_08": {
  "text": [
   "Nonno, per una volta non costringermi a spiegarti tutto."
  ]
 },
 "PRE_2_09": {
  "text": [
   "Le domande me le fai dopo. Adesso vieni."
  ]
 },
 "PRE_2_10": {
  "text": [
   "Va bene. Aspetto che ti passi la paura di me."
  ],
  "alt": {
   "0": "Aspetto. Tanto ormai sai dove tornare a cercare una risposta."
  }
 },
 "PRE_3_01": {
  "text": [
   "Ce l’hai ancora il temperino?"
  ],
  "alt": {
   "0": "Il temperino te lo sei tenuto vicino."
  }
 },
 "PRE_3_02": {
  "text": [
   "La calligrafia l’hai riconosciuta subito."
  ]
 },
 "PRE_3_03": {
  "text": [
   "Ti serve un’altra prova che sono io?"
  ],
  "opts": {
   "0": "Confronto la voce con quella del nastro.",
   "1": "Ti riconosco solo dopo aver controllato."
  }
 },
 "PRE_3_04": {
  "text": [
   "Il nastro l’hai sentito. La voce è questa."
  ]
 },
 "PRE_3_05": {
  "text": [
   "Con una fotografia non torni a casa."
  ]
 },
 "PRE_3_06": {
  "text": [
   "Ho lasciato sei macchine. Tu ne hai presa una."
  ],
  "alt": {
   "0": "Sei macchine. Ne hai scelta una. E chi ti sei portato dietro?"
  }
 },
 "PRE_3_07": {
  "text": [
   "Mi aiuti a finire quello che ho lasciato a metà?"
  ],
  "opts": {
   "0": "Vado fino alla porta, ma non la apro.",
   "1": "Prima sento Livia per gli originali.",
   "2": "Non obbedisco a un ordine solo perché ha la tua voce."
  }
 },
 "PRE_3_08": {
  "text": [
   "Non ti ho chiesto di capire tutto. Ti ho chiesto di venire."
  ]
 },
 "PRE_3_09": {
  "text": [
   "Livia custodisce. Tu invece puoi ancora fare qualcosa."
  ]
 },
 "PRE_3_10": {
  "text": [
   "Se vuoi una risposta, torna alla porta."
  ],
  "alt": {
   "0": "Torna alla porta. E non fingere di volere solo delle risposte.",
   "1": "Hai scelto di guardare senza aprire. Ti aspetto."
  }
 },
 "PRE_4_01": {
  "text": [
   "Hai smesso di chiamarmi col suo nome."
  ],
  "alt": {
   "0": "Il suo nome l’hai tolto. Il posto che gli tieni, no."
  }
 },
 "PRE_4_02": {
  "text": [
   "Mica sei diventato più difficile da capire."
  ]
 },
 "PRE_4_03": {
  "text": [
   "Apri quella porta, pezzo di merda."
  ],
  "opts": {
   "0": "No. So chi stai cercando di imitare.",
   "1": "Prima voglio sapere chi posso ancora far uscire."
  }
 },
 "PRE_4_04": {
  "text": [
   "Allora tienila chiusa. Vediamo quanto resti al sicuro."
  ]
 },
 "PRE_4_05": {
  "text": [
   "La tua risposta non cancella quello che mi hai promesso."
  ],
  "alt": {
   "0": "La promessa l’hai fatta sapendo benissimo chi avevi davanti."
  }
 },
 "PRE_4_06": {
  "text": [
   "Non hai bisogno di credermi. Hai bisogno di qualcuno da riportare indietro."
  ],
  "alt": {
   "0": "Il patto l’hai lasciato in sospeso. Il posto di chi manca, no."
  }
 },
 "PRE_4_07": {
  "text": [
   "Lo sai chi sono. Vuoi ancora trattare?"
  ],
  "opts": {
   "0": "Lo so chi sei. Ti accompagno al varco.",
   "1": "Non ti prometto niente. Prima voglio i fatti.",
   "2": "Non tratto. Il passaggio resta chiuso."
  }
 },
 "PRE_4_08": {
  "text": [
   "Bene. Smettiamola di fingere di conoscerci da prima."
  ]
 },
 "PRE_4_09": {
  "text": [
   "Vaffanculo. Quando ti facevo comodo queste domande non le facevi."
  ]
 },
 "PRE_4_10": {
  "text": [
   "Scegli con chi tornare. E poi guardalo bene."
  ],
  "alt": {
   "0": "Scegli con chi tornare. Lo so quanto ti pesa tornare da solo.",
   "1": "Il patto l’hai rifiutato. Ma l’uscita devi ancora sceglierla."
  }
 },
 "V2_R01_01": {
  "text": [
   "Prima cosa: un rumore non è un quiz a risposta multipla."
  ],
  "opts": {
   "0": "Spiegami il controllo, poi provo io.",
   "1": "Per adesso preferisco che lo faccia tu."
  }
 },
 "V2_R01_02": {
  "text": [
   "Guarda dove ti indico. Devi imparare questo punto, mica diventare meccanico."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_R01_03": {
  "text": [
   "Va bene. Però la prossima volta che la accendi a caso non chiamarlo controllo."
  ],
  "alt": {
   "0": "Faccio io. Ma al prossimo rumore, da lontano, posso aiutarti di meno."
  }
 },
 "V2_R02_01": {
  "text": [
   "Bravo. Per arrivarci non serviva mica fare un incidente dimostrativo."
  ],
  "opts": {
   "0": "Metto via le chiavi per un po’.",
   "1": "Resto fermo, senza inventarmi un orario."
  }
 },
 "V2_R02_02": {
  "text": [
   "Adesso fai qualcosa che non sia guidare. Anche stare zitto va benissimo."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_R02_03": {
  "text": [
   "Bene. Quando riparti dimmelo dopo che hai deciso, non per chiedermi il permesso."
  ],
  "alt": {
   "0": "Va bene. Non ti corro dietro con una tazza di camomilla. Decidi tu."
  }
 },
 "V2_R03_01": {
  "text": [
   "Ecco, finalmente una proposta che non mi fa invecchiare a vista d’occhio."
  ],
  "opts": {
   "0": "Ti descrivo solo quello che ho visto.",
   "1": "Comincio dal punto che mi avevi fatto vedere."
  }
 },
 "V2_R03_02": {
  "text": [
   "Così posso aiutarti senza fingere di avere la testa sotto il tuo cofano."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_R03_03": {
  "text": [
   "Se non sai descriverlo ci fermiamo lì. E non tappare il buco con un «bene»."
  ],
  "alt": {
   "0": "Va bene. Ma io non ti dico che è tutto a posto senza aver letto niente."
  }
 },
 "V2_R04_01": {
  "text": [
   "Il resto non è un premio perché sei stato educato."
  ],
  "opts": {
   "0": "Dimmi solo quello che serve per non ripetere l’errore.",
   "1": "Mi basta sapere perché sei qui."
  }
 },
 "V2_R04_02": {
  "text": [
   "Io sono uscita, Ottavio no. E non farla diventare una storia in cui io sapevo tutto."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_R04_03": {
  "text": [
   "Resto per lui. Mica perché mi piace questa strada di merda."
  ],
  "alt": {
   "0": "Va bene. Allora non decidere al posto mio senza conoscerla."
  }
 },
 "V2_R05_01": {
  "text": [
   "Bene. Cercare Ottavio e obbedire a una voce sono due lavori diversi."
  ],
  "opts": {
   "0": "Se non lo riconosciamo, ci fermiamo.",
   "1": "Il dubbio te lo dico prima di scegliere."
  }
 },
 "V2_R05_02": {
  "text": [
   "Questo è un limite che serve. Non una scusa preparata prima."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_R05_03": {
  "text": [
   "Va bene. Un dubbio detto prima mi serve più di un eroe dopo."
  ],
  "alt": {
   "0": "Ricevuto. Non ti rincorro con la promessa. Continuo a cercarlo io."
  }
 },
 "V2_R06_01": {
  "text": [
   "E allora fai quello. Il verbale di quanto sei stato bravo non mi serve."
  ],
  "opts": {
   "0": "Resto fermo e ti riscrivo tra poco.",
   "1": "Ti dico solo se sono ferito."
  }
 },
 "V2_R06_02": {
  "text": [
   "Basta questo. Un messaggio che si legge vale più di dieci scritti tremando."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_R06_03": {
  "text": [
   "Prima controlla. Non voglio un «non credo» buttato lì per chiudere la chat."
  ],
  "alt": {
   "0": "Va bene. Allora scrivimi tu quando puoi. Da qui non tiro a indovinare."
  }
 },
 "V2_R07_01": {
  "text": [
   "Finalmente. Una macchia non è un ordine di servizio."
  ],
  "opts": {
   "0": "La registrazione dice che eri tornata. Non che dobbiamo farlo subito.",
   "1": "Guardiamo prima il punto da cui eri uscita."
  }
 },
 "V2_R07_02": {
  "text": [
   "Esatto. Allora avevo solo le mani. Adesso ci serve una strada."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_R07_03": {
  "text": [
   "Quel punto è nella registrazione. Non me lo invento solo perché voglio ritrovarlo."
  ],
  "alt": {
   "0": "È una scelta. Però non chiamarla «mi mancano le informazioni»."
  }
 },
 "V2_R08_01": {
  "text": [
   "Sì. Se aspettiamo di avere paura, non decidiamo più insieme."
  ],
  "opts": {
   "0": "Se manca il punto dove aspettare, lo dico.",
   "1": "Se cambia il percorso, non improvviso."
  }
 },
 "V2_R08_02": {
  "text": [
   "Bene. E non raccontarmi una versione più bella di quello che hai visto."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_R08_03": {
  "text": [
   "Allora il recupero resta una scelta. Non una promessa che ti trascina."
  ],
  "alt": {
   "0": "Rifaccio il piano. Non ti sostituisco con una speranza."
  }
 },
 "V2_R09_01": {
  "text": [
   "Giusto. Io posso raccontartelo, ma non posso farlo sembrare piccolo."
  ],
  "opts": {
   "0": "Non decidiamo solo a parole.",
   "1": "Voglio capire chi potrebbe uscire."
  }
 },
 "V2_R09_02": {
  "text": [
   "Allora guardiamo il prezzo, senza che tu offra la tua vita per educazione."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_R09_03": {
  "text": [
   "Dev’essere una persona vera. Un posto vuoto non basta a giustificarti."
  ],
  "alt": {
   "0": "Se smetti di guardarla, non chiamarla una scelta consapevole."
  }
 },
 "V2_R10_01": {
  "text": [
   "Bene. Posso volerti vivo ed essere ancora incazzata con questa strada."
  ],
  "opts": {
   "0": "Te lo dirò, senza farti scegliere per me.",
   "1": "Uscire non vuol dire aver salvato tutti, lo so."
  }
 },
 "V2_R10_02": {
  "text": [
   "È quello che ti chiedo. Il mio giudizio non lo metto al posto delle chiavi."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_R10_03": {
  "text": [
   "E nemmeno restare salva tutti per magia. Devi sapere chi fai passare."
  ],
  "alt": {
   "0": "Non ti fermo. Però mi lasci a indovinare anche il saluto."
  }
 },
 "V2_L01_01": {
  "text": [
   "Meglio. Una spiegazione sbagliata ti occupa tutta la scrivania."
  ],
  "opts": {
   "0": "Ti descrivo quello che c’è scritto.",
   "1": "E ti dico anche quello che non si legge."
  }
 },
 "V2_L01_02": {
  "text": [
   "Grazie. Se manca un nome, non lo completo solo perché la storia la conosco già."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_L01_03": {
  "text": [
   "Va bene. Una parte che non si legge non è una risposta contro di te."
  ],
  "alt": {
   "0": "Senza vederlo non posso dire di averlo confrontato."
  }
 },
 "V2_L02_01": {
  "text": [
   "Puoi farlo. L’originale ce l’ho già io, ma senza la tua copia non posso confrontare niente."
  ],
  "opts": {
   "0": "Ti dico almeno cosa mi frena.",
   "1": "Prima di spedirtela voglio riparlarne."
  }
 },
 "V2_L02_02": {
  "text": [
   "Questo posso ascoltarlo. Avere paura non rende inutile quello che hai trovato."
  ],
  "opts": {
   "0": "Te la mando adesso.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_L02_03": {
  "text": [
   "Va bene. Quando ne riparliamo non devi fare finta di esserti fidato subito."
  ],
  "alt": {
   "0": "Mi fermo. Gli originali restano qui. A lavorare insieme, per adesso, no."
  }
 },
 "V2_L03_01": {
  "text": [
   "Vorrei che a rispondere fosse ancora lui. Ecco, l’ho detto, senza tutto il resto."
  ],
  "opts": {
   "0": "Non userò questa speranza come se fosse una certezza.",
   "1": "Non devi vergognarti di sperarlo."
  }
 },
 "V2_L03_02": {
  "text": [
   "Grazie. A volte aggiusto le frasi per non far vedere quanto lo voglio."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_L03_03": {
  "text": [
   "Non le carte: mio fratello. Ogni tanto devo ricordarmi di scriverlo così."
  ],
  "alt": {
   "0": "Va bene. Ti mando solo quello che so. Il resto lo tengo per me."
  }
 },
 "V2_L04_01": {
  "text": [
   "Va bene. Non serve che mi accontenti. Serve capire dove ci siamo fermati."
  ],
  "opts": {
   "0": "Avevo paura di perdere anche quel poco che credevo di sapere.",
   "1": "Di te non mi fidavo ancora."
  }
 },
 "V2_L04_02": {
  "text": [
   "Questo lo capisco. Però, da solo, un altro originale nascosto non ce l’avevi."
  ],
  "opts": {
   "0": "Te lo mando adesso.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_L04_03": {
  "text": [
   "Hai fatto bene a dirlo chiaro. Così posso ricominciare senza fare finta di niente."
  ],
  "alt": {
   "0": "Non te lo chiedo più. Il confronto però resta da fare."
  }
 },
 "V2_L05_01": {
  "text": [
   "Lì. In quel punto della foto non c’è nessuno. Non sto indicando Irene: guarda accanto."
  ],
  "opts": {
   "0": "Vedo il vuoto. Lo confronto con il racconto.",
   "1": "Prima voglio tenere separati i due punti."
  }
 },
 "V2_L05_02": {
  "text": [
   "Esatto. La donna sulla porta c’è. Quella che lui pensava di avere accanto, no."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_L05_03": {
  "text": [
   "Prenditi il tuo tempo. Non è una gara a chi riconosce prima una faccia."
  ],
  "alt": {
   "0": "La foto non cambia perché la chiudi. Quel confronto manca ancora."
  }
 },
 "V2_L06_01": {
  "text": [
   "Non è piacevole, lo so. Ma è l’unica cosa che posso chiederti senza usarti."
  ],
  "opts": {
   "0": "Non ti nascondo un dettaglio solo perché ti farebbe male.",
   "1": "Non faccio diventare un dubbio un no definitivo."
  }
 },
 "V2_L06_02": {
  "text": [
   "Grazie. E non promettermi che dopo averlo letto starò meglio."
  ],
  "opts": {
   "0": "Va bene, andiamo avanti.",
   "1": "Per adesso mi fermo qui."
  }
 },
 "V2_L06_03": {
  "text": [
   "Va bene. Non saperlo ancora non vuol dire aver già perso tutto."
  ],
  "alt": {
   "0": "Gli originali li custodisco io. Nella ricerca, per adesso, sei da solo."
  }
 },
 "V2_ROS_s25_01": {
  "text": [
   "Prima di aprire il cofano guardo dove appoggio gli attrezzi."
  ],
  "opts": {
   "0": "Dammi un compito preciso, così non improvviso.",
   "1": "Un litigio risparmiato è già uno sconto."
  }
 },
 "V2_ROS_s25_02": {
  "text": [
   "Non è un rito, testone. È per non doverli cercare dopo bestemmiando."
  ],
  "opts": {
   "0": "Lo rimetto dove l’hai preso.",
   "1": "Per adesso guardo e basta."
  }
 },
 "V2_ROS_s25_03": {
  "text": [
   "Se te ne passo uno, poi rimettilo lì. Ci risparmiamo un litigio intero."
  ],
  "opts": {
   "0": "Prima di toccare chiedo.",
   "1": "Provo a farti una sorpresa senza fare danni."
  }
 },
 "V2_ROS_s25_04": {
  "text": [
   "Non devi aiutarmi su tutto. Una cosa fatta bene è già una sorpresa."
  ],
  "opts": {
   "0": "Una cosa sola. Quando ho finito te lo dico.",
   "1": "Tocco solo quello che abbiamo detto."
  }
 },
 "V2_ROS_s25_05": {
  "text": [
   "Ecco. Adesso posso tirare giù i santi per problemi nuovi."
  ]
 },
 "V2_ROS_s25_06": {
  "text": [
   "Va bene. Se guardi, guarda dove rimetto le cose."
  ]
 },
 "V2_ROS_s50_01": {
  "text": [
   "Anche quando finalmente mi siedo, continuo a contare gli attrezzi con gli occhi."
  ],
  "opts": {
   "0": "Ti lascio finire la pausa.",
   "1": "Pure le sedie hanno bisogno di manutenzione?"
  }
 },
 "V2_ROS_s50_02": {
  "text": [
   "Il culo è sulla sedia. La testa sta ancora cercando una chiave."
  ],
  "opts": {
   "0": "Per due minuti gli attrezzi non scappano.",
   "1": "Non ti aggiungo un’altra lista."
  }
 },
 "V2_ROS_s50_03": {
  "text": [
   "Se mi chiedi subito di un altro rumore, mi rimetti in piedi senza neanche toccarmi."
  ],
  "opts": {
   "0": "Parliamo di mangiare, non della macchina.",
   "1": "Una cosa è urgente, il resto può aspettare."
  }
 },
 "V2_ROS_s50_04": {
  "text": [
   "Per due minuti possiamo parlare di qualcosa che non perde liquidi?"
  ],
  "opts": {
   "0": "Due minuti senza problemi da risolvere.",
   "1": "Se è solo ansia, non la chiamo guasto."
  }
 },
 "V2_ROS_s50_05": {
  "text": [
   "Grazie. Non pensavo di affezionarmi a un motore spento."
  ]
 },
 "V2_ROS_s50_06": {
  "text": [
   "Va bene. Se è urgente me lo dici. Se è ansia respiri e aspetti."
  ]
 },
 "V2_ROS_s75_01": {
  "text": [
   "Quando mi spavento ti do un ordine prima ancora di chiederti cosa vedi."
  ],
  "opts": {
   "0": "Allora ti dico cosa vedo prima di seguirti.",
   "1": "Posso fermarti senza metterti in discussione su tutto."
  }
 },
 "V2_ROS_s75_02": {
  "text": [
   "È una pessima abitudine. E non diventa una buona idea solo perché urlo forte."
  ],
  "opts": {
   "0": "«Guarda prima.» Corto così.",
   "1": "Non mi metto a urlare più forte di te."
  }
 },
 "V2_ROS_s75_03": {
  "text": [
   "Se lo rifaccio, fermami con una frase corta. Non con un discorso mentre guidi."
  ],
  "opts": {
   "0": "Te lo dico prima che diventi una corsa.",
   "1": "Ti chiedo se lo sai o te lo ricordi."
  }
 },
 "V2_ROS_s75_04": {
  "text": [
   "Dimmi «guarda prima». Qualche volta me lo merito anch’io."
  ],
  "opts": {
   "0": "«Guarda prima.» Vale per tutti e due.",
   "1": "Non ti do ragione solo per calmarti."
  }
 },
 "V2_ROS_s75_05": {
  "text": [
   "Va bene. Mica divento infallibile perché mi vuoi bene, coglione."
  ]
 },
 "V2_ROS_s75_06": {
  "text": [
   "Allora nessuno dei due fa finta di sapere già la strada."
  ]
 },
 "V2_ROS_s100_01": {
  "text": [
   "Non ti voglio eroe. Ti voglio di ritorno."
  ],
  "opts": {
   "0": "Va bene. Non ti deluderò facendo il coraggioso.",
   "1": "Torno, senza fare il coraggioso."
  }
 },
 "V2_ROS_s100_02": {
  "text": [
   "Te lo scrivo adesso, così poi non posso fingere di non averlo detto."
  ],
  "opts": {
   "0": "Ti aiuto, ma senza darti la mia vita in anticipo.",
   "1": "Se devo fermarmi te lo dico."
  }
 },
 "V2_ROS_s100_03": {
  "text": [
   "Se mi aiuti, non devi dimostrare ogni volta che sei pronto a perderti."
  ],
  "opts": {
   "0": "Non sposto il limite per vergogna.",
   "1": "Non ti uso come giudice."
  }
 },
 "V2_ROS_s100_04": {
  "text": [
   "Una promessa con un limite è sempre una promessa. Anche la tua."
  ],
  "opts": {
   "0": "Il limite non è un tradimento, lo so.",
   "1": "Me lo ricorderò quando saremo davanti alla porta."
  }
 },
 "V2_ROS_s100_05": {
  "text": [
   "Bene. Adesso chiudi un attimo questa chat, zuccone. Non scappo mica."
  ]
 },
 "V2_ROS_s100_06": {
  "text": [
   "Va bene. Quando torni possiamo anche non parlare della strada."
  ]
 },
 "V2_LIV_s25_01": {
  "text": [
   "Ogni tanto metto in ordine una pila di fogli che non ne aveva nessun bisogno."
  ],
  "opts": {
   "0": "Mi sembra una pausa travestita bene.",
   "1": "Lo faccio anch’io quando non so da dove cominciare."
  }
 },
 "V2_LIV_s25_02": {
  "text": [
   "Mi dà l’impressione di aver finito qualcosa. Il lavoro invece è ancora tutto lì."
  ],
  "opts": {
   "0": "Lasciamola storta per cinque minuti.",
   "1": "Dimmi da dove vuoi cominciare davvero."
  }
 },
 "V2_LIV_s25_03": {
  "text": [
   "Puoi ridere. È una pila di fogli, non mio fratello."
  ],
  "opts": {
   "0": "Non rido della ricerca. Rido del mobile in emergenza.",
   "1": "Puoi avere anche delle abitudini normali, eh."
  }
 },
 "V2_LIV_s25_04": {
  "text": [
   "Con le cose importanti cerco di non fare lo stesso trucco."
  ],
  "opts": {
   "0": "Una cosa alla volta, senza lucidare il resto.",
   "1": "Puoi anche dirmi che oggi non sai da dove partire."
  }
 },
 "V2_LIV_s25_05": {
  "text": [
   "Bene. La pila resta storta, e intanto parliamo."
  ]
 },
 "V2_LIV_s25_06": {
  "text": [
   "Va bene. Non ti mando la foto della scrivania in ordine spacciandola per un risultato."
  ]
 },
 "V2_LIV_s50_01": {
  "text": [
   "Mi accorgo di avere fame quando sto già rispondendo male."
  ],
  "opts": {
   "0": "Allora fermati prima di diventare un timbro.",
   "1": "Mangia. Questo può aspettare un attimo."
  }
 },
 "V2_LIV_s50_02": {
  "text": [
   "Poi cerco di sembrare precisa. In realtà sono solo una che doveva mangiare prima."
  ],
  "opts": {
   "0": "Non devi rispondermi subito, adesso.",
   "1": "Precisa e affamata: accoppiata pericolosa."
  }
 },
 "V2_LIV_s50_03": {
  "text": [
   "Non tutte le mie frasi secche sono un indizio. Alcune sono solo una cena saltata."
  ],
  "opts": {
   "0": "Te lo chiedo senza prenderti in giro.",
   "1": "Mi aiuta sapere quando ti serve una pausa."
  }
 },
 "V2_LIV_s50_04": {
  "text": [
   "Se ricomincio a fare la scrivania parlante, puoi chiedermi se ho mangiato."
  ],
  "opts": {
   "0": "Hai mangiato? È tutta qui la domanda.",
   "1": "Chiudiamo un attimo."
  }
 },
 "V2_LIV_s50_05": {
  "text": [
   "Grazie. Per una volta la soluzione può stare in un piatto."
  ]
 },
 "V2_LIV_s50_06": {
  "text": [
   "Va bene. Ricomincio quando riesco a essere almeno una persona civile."
  ]
 },
 "V2_LIV_s75_01": {
  "text": [
   "Quando scrivo «Ottavio» mi viene sempre da aggiungere un’altra domanda."
  ],
  "opts": {
   "0": "Non devo per forza rispondere prima che tu abbia finito.",
   "1": "Non voglio farti vergognare di sperare."
  }
 },
 "V2_LIV_s75_02": {
  "text": [
   "Non è che mi manchino le parole. È per non finire la riga."
  ],
  "opts": {
   "0": "Lasciamo lì la domanda, senza inventarci la risposta.",
   "1": "Ti ascolto, anche se non arriviamo a una conclusione."
  }
 },
 "V2_LIV_s75_03": {
  "text": [
   "Posso dirlo e restare comunque capace di capire quando una cosa non la so."
  ],
  "opts": {
   "0": "Posso contraddirti senza lasciarti sola.",
   "1": "Non chiamo certezza quello che vorrei per te."
  }
 },
 "V2_LIV_s75_04": {
  "text": [
   "Per sperare non ho bisogno che tu mi dia ragione su tutto."
  ],
  "opts": {
   "0": "Allora ti dico anche quando non torna.",
   "1": "Non ti do ragione solo per chiudere il discorso."
  }
 },
 "V2_LIV_s75_05": {
  "text": [
   "Grazie. Così posso sperare senza chiederti di mentire insieme a me."
  ]
 },
 "V2_LIV_s75_06": {
  "text": [
   "Va bene. Non ti uso per finire quella riga."
  ]
 },
 "V2_LIV_s100_01": {
  "text": [
   "Se non trovi Ottavio, non portarmi qualcosa che sa solo chiamarmi «sorella»."
  ],
  "opts": {
   "0": "Non ti porto una voce al posto di tuo fratello.",
   "1": "Ti dirò quello che c’è, anche se non mi fa onore."
  }
 },
 "V2_LIV_s100_02": {
  "text": [
   "Non è una bella richiesta. È quella che faccio quando smetto di abbellire tutto."
  ],
  "opts": {
   "0": "Non confondo quello che vuoi con quello che so.",
   "1": "Non mi chiedi di decidere oggi se è vivo."
  }
 },
 "V2_LIV_s100_03": {
  "text": [
   "Una verità posso aspettarla. Ma non voglio vivere dentro una risposta finta."
  ],
  "opts": {
   "0": "Se non so una cosa, te lo dico.",
   "1": "Niente sostituti per chi manca."
  }
 },
 "V2_LIV_s100_04": {
  "text": [
   "Se arrivi senza una bella notizia, non restare fuori dalla porta."
  ],
  "opts": {
   "0": "Entro, senza prepararmi una bugia gentile.",
   "1": "Non ti lascio a indovinare sulla porta."
  }
 },
 "V2_LIV_s100_05": {
  "text": [
   "Grazie. Dirmi la verità non ti rende meno caro."
  ]
 },
 "V2_LIV_s100_06": {
  "text": [
   "Va bene. Non ti chiederò di consolarmi prima di parlare."
  ]
 },
 "V2_PRE_s25_01": {
  "text": [
   "Hai risposto anche se non ti avevo fatto nessuna domanda."
  ],
  "opts": {
   "0": "Non era un invito.",
   "1": "Sei ancora lì?"
  }
 },
 "V2_PRE_s25_02": {
  "text": [
   "Allora c’è spazio."
  ],
  "opts": {
   "0": "Lo spazio non è una promessa.",
   "1": "Di me non sai niente, a parte questa chat."
  }
 },
 "V2_PRE_s25_03": {
  "text": [
   "Non ho detto per chi. Sei tu che hai continuato."
  ],
  "opts": {
   "0": "Continuare non vuol dire venire con te.",
   "1": "Aspetto un fatto, non un’altra allusione."
  }
 },
 "V2_PRE_s25_04": {
  "text": [
   "Puoi lasciare il telefono dov’è. La frase resta."
  ],
  "opts": {
   "0": "Per adesso chiudo qui.",
   "1": "Le parole me le tengo, ma non le seguo."
  }
 },
 "V2_PRE_s25_05": {
  "text": [
   "Rileggerla non ti obbliga a niente."
  ]
 },
 "V2_PRE_s25_06": {
  "text": [
   "Va bene. Questa pausa non la riempio io."
  ]
 },
 "V2_PRE_s50_01": {
  "text": [
   "Adesso aspetti una risposta prima di muoverti."
  ],
  "opts": {
   "0": "Una risposta non decide al posto mio.",
   "1": "Mi accorgo che ti sto aspettando."
  }
 },
 "V2_PRE_s50_02": {
  "text": [
   "Posso diventare quello spazio tra una domanda e la tua scelta."
  ],
  "opts": {
   "0": "Quando non scrivi mi manca qualcosa.",
   "1": "Il ritmo non lo decidi tu."
  }
 },
 "V2_PRE_s50_03": {
  "text": [
   "Ti pesa meno se il nome in alto è uno che conosci?"
  ],
  "opts": {
   "0": "Il nome non basta.",
   "1": "Il posto di qualcuno non te lo do."
  }
 },
 "V2_PRE_s50_04": {
  "text": [
   "Qui dentro hai già fatto posto a qualcuno."
  ],
  "opts": {
   "0": "Una chat non è una porta aperta.",
   "1": "Posso smettere di rispondere."
  }
 },
 "V2_PRE_s50_05": {
  "text": [
   "Continua pure a chiamarla solo una conversazione."
  ]
 },
 "V2_PRE_s50_06": {
  "text": [
   "La distanza che metti adesso arriva dopo tutte queste righe."
  ]
 },
 "V2_PRE_s75_01": {
  "text": [
   "Mi scrivi anche quando non vuoi sentire la risposta."
  ],
  "opts": {
   "0": "Resta. Ho paura di scegliere da solo.",
   "1": "Il posto di chi manca non è tuo."
  }
 },
 "V2_PRE_s75_02": {
  "text": [
   "«Resta.» L’hai scritto tu. E io posso continuare a rileggerlo."
  ],
  "opts": {
   "0": "L’abitudine posso interromperla.",
   "1": "Non ti prometto di tornare da te."
  }
 },
 "V2_PRE_s75_03": {
  "text": [
   "Prima ancora di scegliere chi portare, senti già chi ti manca."
  ],
  "opts": {
   "0": "Non userò una mancanza per riconoscerti.",
   "1": "Tengo te separato da chi sto cercando."
  }
 },
 "V2_PRE_s75_04": {
  "text": [
   "È lì che mi stai facendo posto."
  ],
  "opts": {
   "0": "Da qui non ti porto fuori.",
   "1": "Smetto di usare questa chat come risposta."
  }
 },
 "V2_PRE_s75_05": {
  "text": [
   "Non ti chiedo una frase più calda. Quella che cerchi so aspettarla."
  ]
 },
 "V2_PRE_s75_06": {
  "text": [
   "Mandami a fanculo. Poi guarda a chi stavi per chiedere di restare."
  ]
 },
 "V2_LUOGO_tokyo_01": {
  "text": [
   "Allora, hai già voglia di mandarmi una foto di casa invece che della macchina?"
  ],
  "opts": {
   "0": "Oggi mi sembra bella perfino la strada di casa.",
   "1": "Aspetta, sto fotografando una cosa che vedo tutti i giorni."
  }
 },
 "V2_LUOGO_tokyo_02": {
  "text": [
   "Va bene. Una cosa che riconosci senza doverla spiegare."
  ],
  "opts": {
   "0": "Un’insegna. Niente recensione del motore.",
   "1": "Te la mando prima di chiamarla cartolina."
  }
 },
 "V2_LUOGO_tokyo_03": {
  "text": [
   "Allora scrivimi cosa vedi adesso, non quello che ricordi."
  ],
  "opts": {
   "0": "L’asfalto è bagnato. Per ora c’è solo quello.",
   "1": "In foto non rende. Oggi niente premio fotografico."
  }
 },
 "V2_LUOGO_tokyo_04": {
  "text": [
   "Non è un esame, eh. Voglio solo stare un attimo nel tuo viaggio."
  ],
  "opts": {
   "0": "Allora vieni un minuto. Ti tengo il posto in chat.",
   "1": "Guida Fufi. Io ho già abbastanza problemi."
  }
 },
 "V2_LUOGO_tokyo_05": {
  "text": [
   "Vai, va’. Fufi per fortuna non ha ancora dovuto imparare a guidare."
  ]
 },
 "V2_LUOGO_roma_01": {
  "text": [
   "Hai finito dal notaio o stai ancora pensando alle altre cinque?"
  ],
  "opts": {
   "0": "Ho scelto. E adesso le altre cinque mi sembrano migliori.",
   "1": "Sono uscito dallo studio. Sto ancora guardando le chiavi."
  }
 },
 "V2_LUOGO_roma_02": {
  "text": [
   "Una macchina sola. Non c’è bisogno di fare anche il giro dei rimpianti."
  ],
  "opts": {
   "0": "Una sola assicurazione da pagare: ecco il mio vero criterio.",
   "1": "Per oggi ho scelto abbastanza. Ti mando com’è fuori."
  }
 },
 "V2_LUOGO_roma_03": {
  "text": [
   "Mi interessa quella che hai preso, non la classifica di quelle rimaste."
  ],
  "opts": {
   "0": "Quella che ho preso mi piace. Ecco, l’ho scritto.",
   "1": "Niente classifica. Mi licenzio da solo."
  }
 },
 "V2_LUOGO_roma_04": {
  "text": [
   "Fotografami anche una cosa normale. Non voglio solo un catalogo di spie accese."
  ],
  "opts": {
   "0": "La serranda qui davanti. Foto onestissima.",
   "1": "Niente cruscotto. Per una volta guardo fuori."
  }
 },
 "V2_LUOGO_roma_05": {
  "text": [
   "Va bene. Almeno Roma stavolta non devi ereditarla."
  ]
 },
 "V2_LUOGO_parigi_01": {
  "text": [
   "Parigi? Hai preso una foto da internet per prendermi in giro?"
  ],
  "opts": {
   "0": "Magari fosse uno scherzo. Ti mando la foto intera.",
   "1": "Ho controllato due volte. C’è scritto ancora quello."
  }
 },
 "V2_LUOGO_parigi_02": {
  "text": [
   "Va bene. Mandami un particolare di quello che hai davanti, me lo guardo."
  ],
  "opts": {
   "0": "Niente ritaglio. Voglio che si veda tutto.",
   "1": "Non riesco a far tornare il posto con la strada che ho fatto."
  }
 },
 "V2_LUOGO_parigi_03": {
  "text": [
   "Il posto torna. Il tempo di viaggio no."
  ],
  "opts": {
   "0": "Non allungo le ore per far quadrare la foto.",
   "1": "Ho smesso di guardare la macchina. Guardo l’orologio."
  }
 },
 "V2_LUOGO_parigi_04": {
  "text": [
   "Non inventiamoci una durata diversa per far tornare i conti."
  ],
  "opts": {
   "0": "Mi fermo. Tanto Parigi non scappa. Spero.",
   "1": "Ti mando anche l’ora, senza ritoccarla."
  }
 },
 "V2_LUOGO_parigi_05": {
  "text": [
   "Resta fermo mentre ci ragioniamo. Una cosa impossibile per oggi basta."
  ]
 },
 "V2_LUOGO_londra_01": {
  "text": [
   "Mandami tutto lo sbarramento. Non solo il punto da cui vuoi passare."
  ],
  "opts": {
   "0": "Faccio la foto da qui. La barriera non la supero.",
   "1": "Ci metto dentro anche la scritta a mano."
  }
 },
 "V2_LUOGO_londra_02": {
  "text": [
   "Una barriera non mi dice chi l’ha messa. La scritta forse sì."
  ],
  "opts": {
   "0": "La confronto con le carte di Claudio.",
   "1": "Non la strappo per vedere cosa c’è dietro."
  }
 },
 "V2_LUOGO_londra_03": {
  "text": [
   "Guarda se la calligrafia la riconosci. Io lì al posto tuo non ci sono."
  ],
  "opts": {
   "0": "Guardo la calligrafia. La rabbia me la tengo per dopo.",
   "1": "Per adesso non so chi l’ha scritta."
  }
 },
 "V2_LUOGO_londra_04": {
  "text": [
   "Se è di Claudio cambia il motivo per cui è chiusa. Non il fatto che lo sia."
  ],
  "opts": {
   "0": "Il paraurti non è una chiave universale. Ricevuto.",
   "1": "La lascio chiusa. Cerco qualcos’altro da capire."
  }
 },
 "V2_LUOGO_londra_05": {
  "text": [
   "Bene. Niente prove col paraurti. Ci tengo a non dovertelo raddrizzare io."
  ]
 },
 "V2_LUOGO_stoccolma_01": {
  "text": [
   "Se sei all’autogrill, non metterti a cercare mio fratello in ogni faccia."
  ],
  "opts": {
   "0": "Mi sono beccato a guardare le facce, infatti.",
   "1": "Ho il tesserino. Ti mando quello."
  }
 },
 "V2_LUOGO_stoccolma_02": {
  "text": [
   "Lo so che è difficile. Lo sto facendo anch’io, da qui."
  ],
  "opts": {
   "0": "Se vuoi sto zitto un momento.",
   "1": "Non ti mando il primo che gli somiglia."
  }
 },
 "V2_LUOGO_stoccolma_03": {
  "text": [
   "Sul tesserino c’è il suo nome. Questo posso confrontarlo."
  ],
  "opts": {
   "0": "Il nome si legge. Aspetto quello che trovi tu.",
   "1": "Lo fotografo tutto, anche dietro."
  }
 },
 "V2_LUOGO_stoccolma_04": {
  "text": [
   "Aver ritrovato la macchina non vuol dire aver ritrovato chi la guidava."
  ],
  "opts": {
   "0": "La macchina c’è. Di lui non so ancora abbastanza.",
   "1": "Ti lascio il tempo di guardare, senza altre domande."
  }
 },
 "V2_LUOGO_stoccolma_05": {
  "text": [
   "Mandami il particolare. Poi mi prendo un momento per guardarlo."
  ]
 },
 "V2_LUOGO_berlino_01": {
  "text": [
   "Guarda anche dove si è richiusa. Non fermarti al segno di dove si è aperta."
  ],
  "opts": {
   "0": "Guardo il secondo segno. L’avevo quasi saltato.",
   "1": "Ti faccio vedere insieme dove si apre e dove si richiude."
  }
 },
 "V2_LUOGO_berlino_02": {
  "text": [
   "Sono due cose diverse. Se le mischi sembra una porta che fa come le pare."
  ],
  "opts": {
   "0": "Le tengo separate. Due gesti, due conseguenze.",
   "1": "Mi ero fermato solo a dove si apriva."
  }
 },
 "V2_LUOGO_berlino_03": {
  "text": [
   "La coppia della Corsa ci lascia questo: richiudere si può."
  ],
  "opts": {
   "0": "Quindi il passaggio si può richiudere.",
   "1": "Non lo provo solo perché adesso so che si può."
  }
 },
 "V2_LUOGO_berlino_04": {
  "text": [
   "Che si possa non vuol dire che sia gratis, né che si faccia senza prepararsi."
  ],
  "opts": {
   "0": "Prima leggo il prezzo. Basta improvvisare.",
   "1": "Le maniglie del cazzo possono aspettare."
  }
 },
 "V2_LUOGO_berlino_05": {
  "text": [
   "Ricordatelo prima di toccare la maniglia, non dopo, porca miseria."
  ]
 },
 "V2_LUOGO_praga_01": {
  "text": [
   "La macchia è ferma anche lei, o sta cambiando?"
  ],
  "opts": {
   "0": "Sto fermo e la guardo. Ti dico se si allarga.",
   "1": "Dal parabrezza non voglio tirare a indovinare."
  }
 },
 "V2_LUOGO_praga_02": {
  "text": [
   "Aspetta da fermo. E se puoi guardare, non rispondermi «sembra»."
  ],
  "opts": {
   "0": "Sta cambiando. Ti dico dove.",
   "1": "Vorrei che fosse solo sporco. Ma non lo scrivo per questo."
  }
 },
 "V2_LUOGO_praga_03": {
  "text": [
   "Se si allarga sotto i tuoi occhi, stai vedendo una cosa che si ripete."
  ],
  "opts": {
   "0": "Prima di fare qualcosa mi segno cosa si ripete.",
   "1": "Aspetto di capire se c’è qualcuno da salvare."
  }
 },
 "V2_LUOGO_praga_04": {
  "text": [
   "Non chiamarla persona viva solo perché il sangue è fresco."
  ],
  "opts": {
   "0": "Lo so. Mi fa schifo aver sperato che fosse quello.",
   "1": "Niente slanci. Prima capisco chi c’è davvero."
  }
 },
 "V2_LUOGO_praga_05": {
  "text": [
   "Bene. Prima capiamo. Gli slanci di generosità dopo."
  ]
 },
 "V2_LUOGO_vienna_01": {
  "text": [
   "Un altro nome sul cartello. Prima di ripartire mandami il particolare."
  ],
  "opts": {
   "0": "Un altro cartello. Mi viene voglia di prenderlo a calci.",
   "1": "Ti mando la svolta e la foto di prima."
  }
 },
 "V2_LUOGO_vienna_02": {
  "text": [
   "Da qui la svolta non posso conoscerla. Però due foto posso confrontarle."
  ],
  "opts": {
   "0": "Confrontale. Per un minuto non guardo più lo schermo.",
   "1": "Stessa inquadratura. Non taglio niente."
  }
 },
 "V2_LUOGO_vienna_03": {
  "text": [
   "Questo dettaglio è uguale. Ma non serve fingere che sia tutto uguale."
  ],
  "opts": {
   "0": "Quel particolare torna. Il nome no.",
   "1": "Mi dà fastidio quanto poco basti per riconoscerlo."
  }
 },
 "V2_LUOGO_vienna_04": {
  "text": [
   "Puoi essere arrabbiato. Ma non correggere quello che hai visto per calmarti."
  ],
  "opts": {
   "0": "Sono furioso. La foto la lascio com’è.",
   "1": "Spengo un minuto. Poi ti scrivo da fermo."
  }
 },
 "V2_LUOGO_vienna_05": {
  "text": [
   "Scrivimi quando sei fermo. Non voglio tirare a indovinare mentre guidi."
  ]
 },
 "V2_LUOGO_madrid_01": {
  "text": [
   "Mi hai chiesto se sono venuta a cercarti. No. Non sono in macchina."
  ],
  "opts": {
   "0": "Allora quella che mi scrive non è con te.",
   "1": "Va bene. Ti chiedo una cosa senza suggerirti la risposta."
  }
 },
 "V2_LUOGO_madrid_02": {
  "text": [
   "Dimmi cosa vuoi controllare, senza mettermi le parole in bocca."
  ],
  "opts": {
   "0": "Una domanda sola. Poi controllo da un’altra parte.",
   "1": "Prima ti lascio finire. Corro anche da fermo."
  }
 },
 "V2_LUOGO_madrid_03": {
  "text": [
   "«Nonno» lo uso per prenderti in giro. Non per chiederti di venirmi a prendere."
  ],
  "opts": {
   "0": "Lo so. Leggerlo lì mi ha fatto effetto.",
   "1": "Non uso quel nome come risposta pronta."
  }
 },
 "V2_LUOGO_madrid_04": {
  "text": [
   "Se vuoi chiedermi una cosa, chiedimela una volta sola. Non aggiustarla mentre ti rispondo."
  ],
  "opts": {
   "0": "Se sbaglio la domanda, non te la faccio correggere.",
   "1": "Non voglio trasformare la chat in un interrogatorio."
  }
 },
 "V2_LUOGO_madrid_05": {
  "text": [
   "Non so dove sei davvero. Per questo non posso dirti che strada fare."
  ]
 },
 "V2_LUOGO_lisbona_01": {
  "text": [
   "Mi descrivi prima quello che cambia, e poi quello che ti sembra di riconoscere?"
  ],
  "opts": {
   "0": "Ti descrivo il primo gesto. Poi quello che si ripete.",
   "1": "Aspetta un attimo. Mi viene da anticiparlo."
  }
 },
 "V2_LUOGO_lisbona_02": {
  "text": [
   "Non voglio farti riscrivere la scena. Voglio evitare di completartela io."
  ],
  "opts": {
   "0": "Se un pezzo non lo so, lascio il buco.",
   "1": "Posso mandarti appunti brutti, ma scritti adesso."
  }
 },
 "V2_LUOGO_lisbona_03": {
  "text": [
   "Il pezzo del ragazzo è una cosa che si ripete, non un viaggio nel passato."
  ],
  "opts": {
   "0": "Non posso arrivare prima che succeda.",
   "1": "Guardo il punto in cui posso interromperla."
  }
 },
 "V2_LUOGO_lisbona_04": {
  "text": [
   "Se la interrompi, guardiamo cosa smette di succedere. Senza inventarci chi è tornato."
  ],
  "opts": {
   "0": "Ti dico cosa ha smesso di ripetersi.",
   "1": "Se si ferma, non ti scrivo che è tornato vivo."
  }
 },
 "V2_LUOGO_lisbona_05": {
  "text": [
   "Va bene. Adesso mi prendo un momento prima di farti un’altra domanda."
  ]
 },
 "V2_LUOGO_atene_01": {
  "text": [
   "Quella è la porta. Non chiamarla già la tua uscita."
  ],
  "opts": {
   "0": "Mi sono accorto di averla già chiamata così.",
   "1": "Mi fermo prima della porta."
  }
 },
 "V2_LUOGO_atene_02": {
  "text": [
   "Il confine e lo svincolo non sono la stessa cosa. Adesso non mischiamoli."
  ],
  "opts": {
   "0": "Lo svincolo è un’altra scelta. Questa è la porta.",
   "1": "Non lascio che la voglia di uscire decida chi c’è."
  }
 },
 "V2_LUOGO_atene_03": {
  "text": [
   "Prima capisci chi hai davanti. Poi decidi cosa vuoi far passare."
  ],
  "opts": {
   "0": "Prima la faccia, il nome e la foto.",
   "1": "Nessuno passa perché ho fretta io."
  }
 },
 "V2_LUOGO_atene_04": {
  "text": [
   "Non ti preparo la risposta per farti stare meglio."
  ],
  "opts": {
   "0": "Ho paura. Mi tengo anche quella.",
   "1": "Dimmi solo quello che sai, Rosa."
  }
 },
 "V2_LUOGO_atene_05": {
  "text": [
   "Quando scegli, voglio che sia una scelta tua. Non la mia fretta."
  ]
 },
 "V2_LUOGO_washington_01": {
  "text": [
   "Il biglietto non ti chiede di riconoscere una voce. Ti chiede di capire chi accompagni."
  ],
  "opts": {
   "0": "Rileggo «chi», non solo come si esce.",
   "1": "Quella parola l’avevo saltata: «accompagni»."
  }
 },
 "V2_LUOGO_washington_02": {
  "text": [
   "La donna della Panda aveva visto questo pezzo. Non tutta la storia."
  ],
  "opts": {
   "0": "Non pretendo che il biglietto sappia tutto.",
   "1": "Questo pezzo basta a farmi rileggere gli altri."
  }
 },
 "V2_LUOGO_washington_03": {
  "text": [
   "Se una frase ti sembra troppo semplice, non completarla con una promessa."
  ],
  "opts": {
   "0": "La finisco dove finisce l’inchiostro.",
   "1": "La promessa devo sceglierla io, dopo."
  }
 },
 "V2_LUOGO_washington_04": {
  "text": [
   "Una persona che manca non diventa chiunque sappia usare il suo nome."
  ],
  "opts": {
   "0": "Mi manca qualcuno. Ma non basta per chiamarlo così.",
   "1": "Ho ancora una domanda. Stavolta la scrivo per intero."
  }
 },
 "V2_LUOGO_washington_05": {
  "text": [
   "Prima di chiudere, dimmi se quello che vuoi sapere l’hai chiesto davvero."
  ]
 },
 "V2_VICINO_01": {
  "text": [
   "Hai chiesto al vicino di controllare? Sono sulla porta, qui a casa."
  ],
  "opts": {
   "0": "Sì. Aspetto che ti abbia vista lui, non una supposizione.",
   "1": "Voglio sapere cosa ha controllato di persona."
  }
 },
 "V2_VICINO_02": {
  "text": [
   "Mi ha vista sulla porta e ha aspettato che gli rispondessi. Mica mi ha cercata su una mappa."
  ],
  "opts": {
   "0": "Allora questo controllo è diverso dalla telefonata.",
   "1": "Aspetto che me lo confermi anche lui, sul suo numero."
  }
 },
 "V2_VICINO_03": {
  "text": [
   "È venuto dal suo appartamento. Non gli ho dato nessuna posizione da seguire."
  ],
  "opts": {
   "0": "Aspetto che me lo dica lui, direttamente.",
   "1": "Non gli chiedo di sapere dove sono io."
  }
 },
 "V2_VICINO_04": {
  "text": [
   "Non sono venuta a cercarti in macchina. Adesso sai da dove ti sto scrivendo."
  ],
  "opts": {
   "0": "Finisco il confronto con il vicino.",
   "1": "Aspetto la sua risposta, senza inventarmela io."
  }
 },
 "V2_VICINO_05": {
  "text": [
   "Te l’ha confermato sul numero che avevi già. Ti ha descritto la scena da qui."
  ],
  "opts": {
   "0": "Per stavolta vale.",
   "1": "Per adesso. Non per sempre."
  }
 },
 "V2_VICINO_06": {
  "text": [
   "Bene. Adesso possiamo smettere di tirare a indovinare chi manca. Io sono qui."
  ],
  "alt": {
   "0": "Il controllo l’abbiamo fatto adesso. Non vale per ogni voce che arriverà."
  }
 },
 "V2_MARCO_costo_01": {
  "text": [
   "Se vuoi portare Marco devi decidere prima cosa lasciare. Niente sorprese dopo."
  ],
  "opts": {
   "0": "Dimmi tutto prima di fargli posto.",
   "1": "Non gli prometto ancora di farlo salire."
  }
 },
 "V2_MARCO_costo_02": {
  "text": [
   "Il carico: rinunci al lavoro che stai facendo e alla paga. Marco sale, e la consegna finisce lì."
  ],
  "opts": {
   "0": "Perdo anche la paga. Ho capito.",
   "1": "Non è solo spostare una scatola."
  }
 },
 "V2_MARCO_costo_03": {
  "text": [
   "La copia di una prova: la lasci nella sua macchina. L’originale ce l’ha Livia."
  ],
  "opts": {
   "0": "La copia può restare. L’originale è al sicuro.",
   "1": "Se la lascio, dovrò riascoltarla da Livia."
  }
 },
 "V2_MARCO_costo_04": {
  "text": [
   "Oppure ti giochi una lampada in più: tieni il carico e la copia, ma parti con meno margine."
  ],
  "opts": {
   "0": "Una lampada in meno per fare la strada.",
   "1": "Tenermi tutto costa tempo. Ho capito."
  }
 },
 "V2_MARCO_costo_05": {
  "text": [
   "Decidilo adesso. Se non hai un lavoro in corso, il problema del carico non c’è."
  ],
  "opts": {
   "0": "Lascio il carico e la paga.",
   "1": "Lascio la copia. Me la farò ridare da Livia.",
   "2": "Mi tengo tutto. Spendo una lampada in più."
  }
 },
 "V2_MARCO_costo_06": {
  "text": [
   "Bene. Adesso il rischio ha un nome. E Marco non deve scoprirlo mentre tiri le marce."
  ],
  "alt": {
   "0": "Marco sale. Il lavoro è perso, e in bacheca non lo ritrovi fatto.",
   "1": "Marco sale. La copia non ce l’hai più. L’originale resta da Livia.",
   "2": "Marco sale. Una lampada l’hai già spesa: hai meno margine per guidare."
  }
 },
 "V2_FAL_1_01": {
  "text": [
   "L’ultima lampada si è spenta. Non buttarti con la macchina contro lo sbarramento."
  ],
  "opts": {
   "0": "Ho tolto il piede. Sono fermo.",
   "1": "La luce è finita. Non passo."
  }
 },
 "V2_FAL_1_02": {
  "text": [
   "Sei al rifugio. La copia del nastro non ce l’hai più."
  ],
  "opts": {
   "0": "Ho perso proprio il nastro.",
   "1": "Mi resta quello che ricordo. Poco."
  }
 },
 "V2_FAL_1_03": {
  "text": [
   "Livia ha ancora l’originale. Serve riascoltarlo, non un’altra incursione."
  ],
  "opts": {
   "0": "Chiederò a Livia di riascoltarlo.",
   "1": "Mi serve un minuto."
  }
 },
 "V2_FAL_1_04": {
  "text": [
   "Questo passaggio è chiuso. Adesso prepariamo il ritorno con quello che resta."
  ]
 },
 "V2_FAL_2_01": {
  "text": [
   "Sei al rifugio. Marco non è uscito con te."
  ],
  "opts": {
   "0": "Il sedile è vuoto. Ho continuato a guardarlo.",
   "1": "Io sono uscito. Lui no."
  }
 },
 "V2_FAL_2_02": {
  "text": [
   "Non dico che è salvo. Ma non lo do nemmeno per morto, visto che non l’abbiamo visto."
  ],
  "opts": {
   "0": "Non so cosa gli sia successo.",
   "1": "Vorrei tornarci. Ma so che adesso sbaglierei di nuovo."
  }
 },
 "V2_FAL_2_03": {
  "text": [
   "Potrebbe rifarsi vivo. Ma riconoscere il numero non basterà a sapere chi scrive."
  ],
  "opts": {
   "0": "Se mi scrive controllo. Anche se ci spero.",
   "1": "Non userò la sua morte per chiudere il discorso."
  }
 },
 "V2_FAL_2_04": {
  "text": [
   "Sono arrabbiata. Ma non ti chiedo di tornare dentro per cancellare questa corsa."
  ]
 },
 "V2_FAL_3_01": {
  "text": [
   "Non siete arrivati in tempo al punto dove aspettare."
  ],
  "opts": {
   "0": "Ho visto spegnersi l’ultima luce.",
   "1": "Non ce l’ho fatta. È tutto quello che so."
  }
 },
 "V2_FAL_3_02": {
  "text": [
   "Ottavio non l’abbiamo recuperato. E non lo dichiariamo salvo solo per chiudere la riga."
  ],
  "opts": {
   "0": "Non ti scrivo che è salvo.",
   "1": "Avrei voluto mandarti un altro messaggio."
  }
 },
 "V2_FAL_3_03": {
  "text": [
   "Non ti chiedo una versione che faccia meno male. Dimmi quello che hai visto."
  ],
  "opts": {
   "0": "Ti dico dove l’ho perso.",
   "1": "Vado piano. Voglio ricordare senza aggiungere niente."
  }
 },
 "V2_FAL_3_04": {
  "text": [
   "Gli originali restano qui. Abbiamo perso questa occasione, non tutte le risposte."
  ]
 },
 "V2_FAL_4_01": {
  "text": [
   "Sei al rifugio. Il varco è rimasto aperto."
  ],
  "opts": {
   "0": "Mi sono girato. Era ancora aperto.",
   "1": "Sono fuori dal passaggio. Lo vedo."
  }
 },
 "V2_FAL_4_02": {
  "text": [
   "Non vuol dire che la presenza sia già uscita. Le manca ancora qualcuno che la accompagni."
  ],
  "opts": {
   "0": "Non ho accompagnato nessuno.",
   "1": "Controllo chi è uscito con me."
  }
 },
 "V2_FAL_4_03": {
  "text": [
   "Possiamo provare a richiuderlo. Prima vediamo quanto costa."
  ],
  "opts": {
   "0": "Vediamo quanto costa richiuderlo.",
   "1": "Non ci torno per far finta che non sia successo."
  }
 },
 "V2_FAL_4_04": {
  "text": [
   "Una porta non è chiusa solo perché abbiamo smesso di guardarla."
  ]
 },
 "V2_USCITA_01": {
  "text": [
   "Prima di chiamarla uscita, confronta il particolare dello svincolo."
  ],
  "opts": {
   "0": "Lo confronto col foglio della Polo.",
   "1": "Prima guardo il particolare che si ripete."
  }
 },
 "V2_USCITA_02": {
  "text": [
   "Agli svincoli tornava sempre lo stesso segno, anche quando cambiava il paese."
  ],
  "opts": {
   "0": "La forma è quella. Adesso guardo dove porta.",
   "1": "Non mi basta che sia comparso un nome nuovo."
  }
 },
 "V2_USCITA_03": {
  "text": [
   "Questo è lo svincolo vero. Non è la porta che Irene tiene chiusa."
  ],
  "alt": {
   "0": "La porta l’hai già riconosciuta. Questo svincolo è un’altra cosa."
  },
  "opts": {
   "0": "Posso uscire senza aprire la porta.",
   "1": "Se parto, chi resta non viene con me."
  }
 },
 "V2_USCITA_04": {
  "text": [
   "Compare dopo il secondo passaggio e dopo aver confrontato le prove. Non per un nome nuovo."
  ],
  "opts": {
   "0": "Ho confrontato le tre cose. Voglio tornare.",
   "1": "Adesso so dov’è. Devo ancora scegliere."
  }
 },
 "V2_USCITA_05": {
  "text": [
   "Se lo prendi, esci da solo. Le ricerche rimaste a metà non si risolvono da sole."
  ],
  "opts": {
   "0": "Non dirò di aver salvato chi è rimasto.",
   "1": "A Elena posso scrivere solo che torno."
  }
 },
 "V2_USCITA_06": {
  "text": [
   "Puoi decidere di tornare senza fingere di aver finito tutto."
  ]
 },
 "V2_GUARDIA_01": {
  "text": [
   "Guarda i messaggi con Livia. Non te li sto ricostruendo a memoria."
  ],
  "opts": {
   "0": "Apro il messaggio. Quello vero.",
   "1": "Voglio leggere quello che c’è prima e dopo."
  }
 },
 "V2_GUARDIA_02": {
  "text": [
   "Prima mi aveva scritto: «Di’ a Rosa di aspettare». Il messaggio è ancora lì."
  ],
  "opts": {
   "0": "Il tuo nome è ancora scritto lì.",
   "1": "Livia sapeva con chi stavi parlando."
  }
 },
 "V2_GUARDIA_03": {
  "text": [
   "Adesso mi chiede: «A chi stavi scrivendo?». Il messaggio ce l’ha. Le manca il nome."
  ],
  "opts": {
   "0": "Le faccio rileggere il suo messaggio.",
   "1": "Non ha perso il testo. Ha perso te."
  }
 },
 "V2_GUARDIA_04": {
  "text": [
   "Non tutti insieme, non di colpo. È così che comincia: perdi il tuo posto, fuori."
  ],
  "opts": {
   "0": "E tu sei rimasta lo stesso.",
   "1": "Non so se riesco a farmi dimenticare."
  }
 },
 "V2_GUARDIA_05": {
  "text": [
   "Puoi chiederglielo tu. I fogli restano: non è l’archivio che cambia."
  ],
  "opts": {
   "0": "Voglio vedere anche la risposta di Livia, dalla sua parte.",
   "1": "Prima di promettere devo capire chi torna."
  }
 },
 "V2_GUARDIA_06": {
  "text": [
   "Se resti, devi sapere chi fai uscire e quale posto lasci vuoto."
  ]
 },
 "V2_VARCO_01": {
  "text": [
   "Questa è un’apertura. Mica un modo per leggere meglio il cartello."
  ],
  "opts": {
   "0": "Prima guardo cosa vuol dire aprire.",
   "1": "Non apro. Voglio capire come si richiude."
  }
 },
 "V2_VARCO_02": {
  "text": [
   "Se apri, il passaggio esiste. Ma la presenza deve ancora essere accompagnata."
  ],
  "opts": {
   "0": "Prima di toccare il passaggio guardo quanto costa.",
   "1": "Questa scelta la tengo separata dalle altre."
  }
 },
 "V2_VARCO_03": {
  "text": [
   "Se rifiuti, resta chiuso. Una telefonata arrabbiata non può aprirlo al posto tuo."
  ],
  "opts": {
   "0": "Prima di toccare il passaggio guardo quanto costa.",
   "1": "Questa scelta la tengo separata dalle altre."
  }
 },
 "V2_VARCO_04": {
  "text": [
   "Richiudere non è come rifiutare prima. Quanto costa va guardato adesso."
  ],
  "opts": {
   "0": "Decido solo dopo aver visto quanto costa.",
   "1": "Per adesso il passaggio non lo tocco."
  }
 },
 "V2_VARCO_05": {
  "text": [
   "Questa scelta non c’entra con la promessa fatta a Rosa né con le risposte al telefono."
  ],
  "opts": {
   "0": "Apro il varco. Ma non accompagno ancora nessuno.",
   "1": "Non lo apro: resta chiuso.",
   "2": "Richiudo il varco."
  }
 },
 "V2_VARCO_06": {
  "text": [
   "Adesso sappiamo com’è la situazione. Non la faccio diventare un finale con una frase."
  ],
  "alt": {
   "0": "Lo richiudi. Il costo è quello che hai visto prima di farlo.",
   "1": "Il varco è aperto. Ma non è ancora un ritorno con qualcuno accanto.",
   "2": "Resta chiuso. La voce insiste, ma non lo apre per te."
  }
 },
 "V2_ROS_n1_01": {
  "text": [
   "Ho appoggiato il panino dove tenevo il bullone. Adesso il panino deve aspettare."
  ],
  "opts": {
   "0": "Prima il panino. Il bullone è già un duro del cazzo.",
   "1": "C’è una cosa urgente. Le altre aspettano."
  }
 },
 "V2_ROS_n1_02": {
  "text": [
   "E no, il bullone non l’ho mangiato. Ti anticipo, spiritoso."
  ],
  "opts": {
   "0": "Non ti faccio lavorare mentre mastichi.",
   "1": "Il bullone tienilo: ha più ferro del ripieno."
  }
 },
 "V2_ROS_n1_03": {
  "text": [
   "Se adesso mi fai una domanda, dimmi prima se riguarda il motore o il pranzo."
  ],
  "opts": {
   "0": "Solo la cosa urgente, il resto no.",
   "1": "Aspetto che finisci la pausa."
  }
 },
 "V2_ROS_n1_04": {
  "text": [
   "Voglio una pausa che non si allarghi fino a diventare un altro lavoro."
  ],
  "opts": {
   "0": "Niente lista nascosta dopo la prima domanda.",
   "1": "Allora fermiamoci davvero."
  }
 },
 "V2_ROS_n1_05": {
  "text": [
   "Bene. Il panino è salvo e tu non ti sei beccato una diagnosi alla maionese."
  ]
 },
 "V2_ROS_n1_06": {
  "text": [
   "Va bene. Finisco la cosa urgente, e poi basta davvero."
  ]
 },
 "V2_ROS_n2_01": {
  "text": [
   "Scrivimi un rumore. Uno. Non la recensione della macchina intera."
  ],
  "opts": {
   "0": "Fa «tac» quando riparto. Ecco la mia laurea del cazzo.",
   "1": "Non riesco ancora a spiegarlo. Mi fermo."
  }
 },
 "V2_ROS_n2_02": {
  "text": [
   "Quello che hai sentito davvero, non quello che hai letto che dovrebbe fare."
  ],
  "opts": {
   "0": "«Tac». Il resto della diagnosi me lo sono inventato.",
   "1": "Ti dico anche quando non lo fa."
  }
 },
 "V2_ROS_n2_03": {
  "text": [
   "Se adesso non riesci a descriverlo, fermati. Il rumore mica si offende."
  ],
  "opts": {
   "0": "Aspetto da fermo e poi ti scrivo.",
   "1": "Non accelero. Di cazzate ne ho già fatte abbastanza."
  }
 },
 "V2_ROS_n2_04": {
  "text": [
   "Prima capiamo quando lo fa. Poi decidiamo se devi muoverti."
  ],
  "opts": {
   "0": "Non gli do un nome solo per farti fare prima.",
   "1": "Se non lo capisco, lo lascio come dubbio."
  }
 },
 "V2_ROS_n2_05": {
  "text": [
   "Bene. Adesso ho un dettaglio su cui lavorare, non una collezione di paure."
  ]
 },
 "V2_ROS_n2_06": {
  "text": [
   "Va bene. Non ti faccio accelerare solo per mandarmi un esempio migliore."
  ]
 },
 "V2_ROS_n3_01": {
  "text": [
   "Se oggi mi dai ragione troppo in fretta, ti mando a fanculo prima ancora di riparare."
  ],
  "opts": {
   "0": "Ti dico quello che vedo, anche se non torna.",
   "1": "Posso chiederti se lo sai o te lo ricordi?"
  }
 },
 "V2_ROS_n3_02": {
  "text": [
   "Non è per farmi simpatica. È che quando ho paura scrivo come se dessi ordini."
  ],
  "opts": {
   "0": "Io abbasso la voce. Tu abbassa il cric.",
   "1": "Ti fermo con «guarda prima», come mi hai chiesto."
  }
 },
 "V2_ROS_n3_03": {
  "text": [
   "Se ti dico una cosa che non hai visto, puoi fermarmi."
  ],
  "opts": {
   "0": "Non facciamo a chi ce l’ha più grossa, la chiave inglese.",
   "1": "Aspetto di poter guardare."
  }
 },
 "V2_ROS_n3_04": {
  "text": [
   "Mi serve un dettaglio tuo, non il mio ricordo ripetuto bene."
  ],
  "opts": {
   "0": "Prima il mio dettaglio, poi il tuo ordine.",
   "1": "Se non vedo un cazzo, ti dico proprio quello."
  }
 },
 "V2_ROS_n3_05": {
  "text": [
   "Bene. Un’officina con due cervelli. Cosa rara, ma non soprannaturale."
  ],
  "alt": {
   "0": "Mi hai contraddetta con un dettaglio. Meglio di un sì buttato lì per calmarmi."
  }
 },
 "V2_ROS_n3_06": {
  "text": [
   "Va bene. Per adesso non decidi solo per calmarmi. È già un aiuto."
  ]
 },
 "V2_ROS_n4_01": {
  "text": [
   "Il controllo me l’hai già descritto. Adesso vuoi rifarlo o vuoi che ti rassicuri?"
  ],
  "opts": {
   "0": "Voglio che tu mi dica di sì. Che rottura di palle.",
   "1": "C’è un particolare nuovo che non ti avevo detto."
  }
 },
 "V2_ROS_n4_02": {
  "text": [
   "Non è la stessa cosa. Il primo mi serve. Il secondo rischia di non finire più."
  ],
  "opts": {
   "0": "Spengo. Il cofano può smettere di farmi da psicologo.",
   "1": "Non ti chiedo di trovare un guasto per calmarmi."
  }
 },
 "V2_ROS_n4_03": {
  "text": [
   "Se c’è un dettaglio nuovo lo guardiamo. Se no, puoi anche continuare ad avere paura."
  ],
  "opts": {
   "0": "Ti dico solo quello che è cambiato.",
   "1": "Aspetto di poterlo controllare da fermo."
  }
 },
 "V2_ROS_n4_04": {
  "text": [
   "Non devo inventarmi un guasto per darti una buona scusa per fermarti."
  ],
  "opts": {
   "0": "Posso non sentirmi pronto anche se il controllo è finito.",
   "1": "Un dettaglio, poi basta."
  }
 },
 "V2_ROS_n4_05": {
  "text": [
   "Bene. Il controllo è finito. La paura può sedersi un attimo senza aprire il cofano."
  ],
  "alt": {
   "0": "Volevi imparare a fare il controllo. Adesso sai anche quando smettere."
  }
 },
 "V2_ROS_n4_06": {
  "text": [
   "Va bene. Guardiamo solo quel dettaglio nuovo, e poi la piantiamo."
  ]
 },
 "V2_ROS_n5_01": {
  "text": [
   "Prima ti sei tirato indietro. E adesso mi scrivi per riparlarne?"
  ],
  "opts": {
   "0": "Sì. Ma voglio mettere un limite chiaro.",
   "1": "No. Volevo solo dirti che non ho cambiato idea."
  }
 },
 "V2_ROS_n5_02": {
  "text": [
   "Si può fare. Non serve ripetere la promessa più forte di prima."
  ],
  "opts": {
   "0": "Ti aiuto. Ma alla cieca non apro un cazzo.",
   "1": "Prima guardiamo il posto, poi ti rispondo."
  }
 },
 "V2_ROS_n5_03": {
  "text": [
   "Se il limite è un altro, scrivilo prima di dire sì."
  ],
  "opts": {
   "0": "Meglio dirtelo che fare finta.",
   "1": "Posso aiutarti a preparare, senza entrare."
  }
 },
 "V2_ROS_n5_04": {
  "text": [
   "Non ti voglio pronto a tutto. Ti voglio capace di fermarti quando serve."
  ],
  "opts": {
   "0": "È questo il limite. Se cambia te lo dico.",
   "1": "Per adesso nessuna promessa nuova."
  }
 },
 "V2_ROS_n5_05": {
  "text": [
   "Bene. Allora prepariamo una ricerca, non una cura per il tuo senso di colpa."
  ],
  "alt": {
   "0": "Torni ad aiutarmi, con un limite. Ma quello che è successo prima non si cancella."
  }
 },
 "V2_ROS_n5_06": {
  "text": [
   "Va bene. Resti fuori dal recupero. Non ti faccio diventare il colpevole di tutto."
  ]
 },
 "V2_ROS_n6_01": {
  "text": [
   "Dopo possiamo anche parlare di qualcosa che non c’è da salvare."
  ],
  "opts": {
   "0": "Vorrei lamentarmi del caffè. Una cazzata bellissima.",
   "1": "Prima voglio dirti cosa sto scegliendo."
  }
 },
 "V2_ROS_n6_02": {
  "text": [
   "Non ti sto vendendo una serata tranquilla. Dico solo che mi piacerebbe averla."
  ],
  "opts": {
   "0": "Meglio raccontarla da schifo, ma esserci.",
   "1": "Mi basta esserci, anche senza una bella storia."
  }
 },
 "V2_ROS_n6_03": {
  "text": [
   "Se torni, non devi ringraziarmi raccontandomi tutto da capo."
  ],
  "opts": {
   "0": "Non ti ripago con una promessa ancora più grossa.",
   "1": "Il limite te lo dico prima di arrivarci."
  }
 },
 "V2_ROS_n6_04": {
  "text": [
   "Se scegli un’altra cosa, dimmelo prima che una promessa diventi un addio."
  ],
  "opts": {
   "0": "Ti scrivo prima di decidere.",
   "1": "Quello che scelgo non c’entra col volerti bene."
  }
 },
 "V2_ROS_n6_05": {
  "text": [
   "Va bene. Un messaggio vero, prima della porta. Senza fare i fenomeni."
  ]
 },
 "V2_ROS_n6_06": {
  "text": [
   "Allora tieniti questa: ti voglio di ritorno, non eroe. L’avevo scritto e non me lo rimangio."
  ],
  "alt": {
   "0": "Di ritorno, non eroe. Quella frase te la sei tenuta."
  }
 },
 "V2_LIV_n1_01": {
  "text": [
   "Ho finito di sistemare la pila. Adesso sto pensando di spostarla tutta a sinistra."
  ],
  "opts": {
   "0": "L’archivio avanza. Di tre centimetri, verso sinistra.",
   "1": "C’è una cosa precisa. Il resto può aspettare."
  }
 },
 "V2_LIV_n1_02": {
  "text": [
   "Non ridere. A destra avrei dovuto cominciare il lavoro vero."
  ],
  "opts": {
   "0": "Ti lascio cinque minuti senza chiederti niente.",
   "1": "Domani la giri. Così il lavoro vede un po’ di mondo."
  }
 },
 "V2_LIV_n1_03": {
  "text": [
   "Se ti serve una risposta oggi dimmelo. Se no mi prendo cinque minuti da persona normale."
  ],
  "opts": {
   "0": "Una domanda sola, poi ti lascio andare.",
   "1": "Può aspettare. Non ti trattengo."
  }
 },
 "V2_LIV_n1_04": {
  "text": [
   "Non voglio far finta di lavorare per non ammettere che ho bisogno di fermarmi."
  ],
  "opts": {
   "0": "Puoi fermarti anche senza aver finito.",
   "1": "Una risposta sola, senza tutto il resto."
  }
 },
 "V2_LIV_n1_05": {
  "text": [
   "Grazie. La pila resta dov’è, e io mi alzo dalla sedia."
  ]
 },
 "V2_LIV_n1_06": {
  "text": [
   "Va bene. Rispondo a quella cosa precisa, e poi smetto di archiviare anche la pausa."
  ]
 },
 "V2_LIV_n2_01": {
  "text": [
   "Ho riletto una frase che ti avevo mandato. La scriverei meno sicura."
  ],
  "opts": {
   "0": "Dimmi quale pezzo vuoi correggere.",
   "1": "Va bene. Non ti chiedo di essere infallibile."
  }
 },
 "V2_LIV_n2_02": {
  "text": [
   "Non è cambiata la cosa. Ero io che volevo arrivare troppo presto alla fine."
  ],
  "opts": {
   "0": "La prendo come una correzione, non come un tradimento.",
   "1": "Non cancello la versione di prima."
  }
 },
 "V2_LIV_n2_03": {
  "text": [
   "Posso correggermi senza costringerti a decidere se fidarti di me su tutto?"
  ],
  "opts": {
   "0": "Mi aiuta sapere che puoi tornare su una frase.",
   "1": "Mi fido anche se una risposta ti manca."
  }
 },
 "V2_LIV_n2_04": {
  "text": [
   "Preferisco il fastidio di una correzione alla comodità di sembrare precisa sulla carta."
  ],
  "opts": {
   "0": "Segniamo cosa cambia, e basta.",
   "1": "Puoi essere meno sicura e più utile."
  }
 },
 "V2_LIV_n2_05": {
  "text": [
   "Grazie. Cambio quella frase. Non ti chiedo di dimenticare che l’avevo scritta."
  ],
  "alt": {
   "0": "Mi hai chiesto cosa correggere, non se buttare via tutto."
  }
 },
 "V2_LIV_n2_06": {
  "text": [
   "Va bene. Ti spiego solo cosa cambia, senza rifare tutta la storia."
  ]
 },
 "V2_LIV_n3_01": {
  "text": [
   "Sto mangiando lontano dalle carte. Mi sento quasi una persona che non lavora."
  ],
  "opts": {
   "0": "Per sicurezza, interroga il parmigiano.",
   "1": "Finisci di mangiare. Ti scrivo dopo."
  }
 },
 "V2_LIV_n3_02": {
  "text": [
   "È incredibile: il piatto non mi chiede in che ordine sono arrivati gli ingredienti."
  ],
  "opts": {
   "0": "Non catalogare le penne. Mangiale.",
   "1": "Per oggi parliamo solo di tavole apparecchiate."
  }
 },
 "V2_LIV_n3_03": {
  "text": [
   "Non farmi una domanda in sei parti. Oggi almeno una forchettata me la mangio senza rispondere."
  ],
  "opts": {
   "0": "Non ti aggiungo una lista mentre mangi.",
   "1": "Ho una cosa breve. Senza altre cinque sotto."
  }
 },
 "V2_LIV_n3_04": {
  "text": [
   "Puoi raccontarmi qualcosa di normale. Non deve per forza diventare materiale d’archivio."
  ],
  "opts": {
   "0": "Ho mangiato in piedi. Il tavolo mi sembrava un lusso.",
   "1": "Mangia. Il resto non scappa per farti un dispetto."
  }
 },
 "V2_LIV_n3_05": {
  "text": [
   "Grazie. Per qualche minuto la tovaglia non è una scrivania."
  ]
 },
 "V2_LIV_n3_06": {
  "text": [
   "Va bene. Una cosa breve, poi finisco di mangiare prima di diventare antipatica."
  ]
 },
 "V2_LIV_n4_01": {
  "text": [
   "Prima hai deciso di non dirmi quello che avevi. Vuoi riaprire il discorso adesso?"
  ],
  "opts": {
   "0": "Sì. Avevo paura di perdere anche la mia versione.",
   "1": "No. Ma volevo smettere di fingere che non fosse una scelta."
  }
 },
 "V2_LIV_n4_02": {
  "text": [
   "Si può. E non serve che cominci con «dovevi fidarti di me»."
  ],
  "opts": {
   "0": "Avevo paura. Mi vergogno a scriverlo così, in due parole.",
   "1": "Ti mando quello che ho, prima di raccontartelo meglio."
  }
 },
 "V2_LIV_n4_03": {
  "text": [
   "Se non vuoi, lo rispetto. Non ti considero uno che ha già detto sì."
  ],
  "opts": {
   "0": "Non userò il tuo nome come garanzia.",
   "1": "Se cambio idea te lo dico, senza un’altra scusa."
  }
 },
 "V2_LIV_n4_04": {
  "text": [
   "Mi basta un motivo vero. Anche se leggerlo non mi farà piacere."
  ],
  "opts": {
   "0": "Il motivo è questo. Il resto lo guardiamo insieme.",
   "1": "Non pretendo di saltare il confronto solo perché ho chiesto scusa."
  }
 },
 "V2_LIV_n4_05": {
  "text": [
   "Grazie. Adesso possiamo ricominciare da quello che c’è, non dalla litigata."
  ],
  "alt": {
   "0": "Adesso il motivo me l’hai detto. Possiamo ripartire da lì."
  }
 },
 "V2_LIV_n4_06": {
  "text": [
   "Va bene. Il discorso resta chiuso perché l’hai deciso tu, non perché ho risposto io al posto tuo."
  ]
 },
 "V2_LIV_n5_01": {
  "text": [
   "La parte vuota della foto mi mette più in difficoltà della faccia."
  ],
  "opts": {
   "0": "Non la riempio neanch’io.",
   "1": "Posso guardarla un pezzo alla volta, senza cambiare quello che mostra."
  }
 },
 "V2_LIV_n5_02": {
  "text": [
   "Sulla faccia posso fermare gli occhi. Sul vuoto mi viene da scriverci quello che manca."
  ],
  "opts": {
   "0": "Continuo a guardarci, come se dovesse comparire qualcosa.",
   "1": "Ti dico se sto descrivendo o se sto ricordando."
  }
 },
 "V2_LIV_n5_03": {
  "text": [
   "Claudio ricordava qualcuno lì. Ma nella foto non c’è."
  ],
  "opts": {
   "0": "Non la faccio diventare la risposta a tutto.",
   "1": "Non cancello il suo racconto. Tengo le due cose separate."
  }
 },
 "V2_LIV_n5_04": {
  "text": [
   "Non voglio fare come lui: correggere le cose finché smettono di farmi male."
  ],
  "opts": {
   "0": "Se fa male, non vuol dire che vada corretta.",
   "1": "Possiamo fermarci, senza nasconderla."
  }
 },
 "V2_LIV_n5_05": {
  "text": [
   "Va bene. Il punto vuoto lo lasciamo vuoto."
  ],
  "alt": {
   "0": "Il vuoto resta vuoto. Non ritocchiamo la foto per riuscire a guardarla."
  }
 },
 "V2_LIV_n5_06": {
  "text": [
   "Allora la riguardiamo con calma, senza chiederti di ammettere tutto in un colpo."
  ]
 },
 "V2_LIV_n6_01": {
  "text": [
   "Quando ti ho scritto che puoi entrare anche senza una bella notizia, lo pensavo davvero."
  ],
  "opts": {
   "0": "Me lo ricordo. Non ti porto un sostituto per evitare quella porta.",
   "1": "Non so se riuscirò a dirti tutto senza vergognarmi."
  }
 },
 "V2_LIV_n6_02": {
  "text": [
   "Non c’è bisogno che mi trasformi in una sorella più ragionevole prima di rispondermi."
  ],
  "opts": {
   "0": "Ti dico chi ho visto, non chi avrei voluto riportarti.",
   "1": "Non trasformo la tua attesa in un ordine."
  }
 },
 "V2_LIV_n6_03": {
  "text": [
   "Posso arrabbiarmi, piangere, e sapere lo stesso che non mi stai facendo un torto."
  ],
  "opts": {
   "0": "Se arrivo a mani vuote, mi fai sedere lo stesso?",
   "1": "Se non so una cosa, comincio da lì."
  }
 },
 "V2_LIV_n6_04": {
  "text": [
   "Non usare la mia felicità come prova che quello che hai davanti sia mio fratello."
  ],
  "opts": {
   "0": "Neanche un tuo sorriso basta a cambiare un fatto.",
   "1": "Non sceglierò per evitarti di soffrire a ogni costo."
  }
 },
 "V2_LIV_n6_05": {
  "text": [
   "Grazie. Ti aspetto, senza darti la parte di quello che sistema tutto."
  ],
  "alt": {
   "0": "Niente sostituti. Ricordati questo, più della mia attesa."
  }
 },
 "V2_LIV_n6_06": {
  "text": [
   "Va bene. Se non trovi una risposta, non restare sulla porta a inventartela."
  ]
 },
 "ROS_vivavoce_01": {
  "text": [
   "(Rosa ti ha messo in vivavoce. Il furgone è fermo in un’area di sosta, col cofano alzato.)",
   "LIVIA: Ho trovato la data. La Volvo l’hanno recuperata il quattordici, non il diciassette.",
   "LIVIA: Tre giorni di differenza.",
   "ROSA: Livia, non è il momento delle date.",
   "LIVIA: Per me è sempre il momento. C’è scritto «pioggia». Ottavio con la pioggia non usciva mai.",
   "ROSA: Eri tu quella che non voleva sapere cosa faceva Ottavio quando usciva.",
   "LIVIA: Ripetilo.",
   "ROSA: No.",
   "LIVIA: Tu sei lì. Dimmelo tu: la mia teoria sta in piedi o sto cercando una cosa che non c’è?",
   "ROSA: Lascialo fuori."
  ],
  "opts": {
   "0": "Secondo me sta in piedi. Una data sbagliata è una data sbagliata.",
   "1": "Ha ragione Rosa: adesso pensiamo al pezzo.",
   "2": "Non lo so. Non c’ero."
  }
 },
 "ROS_vivavoce_02": {
  "text": [
   "ROSA: Lo sapevo. Chi te l’ha insegnato, a fare la spia?",
   "LIVIA: Non è una spia, è un testimone.",
   "ROSA: Il pezzo arriva domani. Tu stai fermo dove sei."
  ]
 },
 "ROS_vivavoce_03": {
  "text": [
   "LIVIA: Va bene. Fammi sapere quando è il momento delle date.",
   "ROSA: Hai visto? Basta saper aspettare.",
   "LIVIA: Questo non è aspettare. È rimandare."
  ]
 },
 "ROS_vivavoce_04": {
  "text": [
   "ROSA: Almeno è onesto.",
   "LIVIA: È comodo.",
   "ROSA: Anche tu stavi comoda, quando c’era da firmare.",
   "(Per un po’ nessuna delle due ti scrive più.)"
  ]
 },
 "DAR_traslochi_01": {
  "text": [
   "Ho trovato una tua foto. Sei dentro un giubbotto enorme.",
   "Sembri un cinghiale in un sacco a pelo."
  ],
  "opts": {
   "0": "Mandamela.",
   "1": "Non adesso, sto guidando."
  }
 },
 "DAR_traslochi_02": {
  "text": [
   "Dopo. Prima voglio sapere perché al trasloco non ti sei fatto vedere."
  ],
  "opts": {
   "0": "Avevo da fare.",
   "1": "Non ce la facevo a vedere la casa vuota.",
   "2": "Il trasloco è un problema tuo, non mio."
  }
 },
 "DAR_traslochi_03": {
  "text": [
   "Avevi da fare. Sono due anni che hai da fare.",
   "Quella sera che eri rimasto a piedi, io ti ho portato il gettone dell’autolavaggio.",
   "Sono tornato indietro apposta. Tu al trasloco invece no."
  ],
  "opts": {
   "0": "Non è la stessa cosa.",
   "1": "Hai ragione."
  }
 },
 "DAR_traslochi_04": {
  "text": [
   "La casa vuota. Era casa mia, cretino.",
   "Io la vedevo vuota da dentro. Tu potevi almeno stare sul marciapiede."
  ],
  "opts": {
   "0": "Hai ragione, dovevo esserci.",
   "1": "Non ti chiedo di capire."
  }
 },
 "DAR_traslochi_05": {
  "text": [
   "Un problema mio. E il gettone dell’autolavaggio, quella sera, era un problema mio?",
   "Eri a piedi e io sono tornato indietro.",
   "Al trasloco ti ho aspettato fino alle otto."
  ],
  "opts": {
   "0": "Non ti avevo chiesto di tornare indietro.",
   "1": "Lo so. Scusa."
  }
 },
 "DAR_traslochi_06": {
  "text": [
   "Ok. Allora siamo pari: io ti ho aspettato, tu non sei venuto.",
   "Nessuno deve niente a nessuno.",
   "Quando arrivi a Roma chiamami. Non vuol dire che ti ho perdonato."
  ]
 },
 "DAR_traslochi_07": {
  "text": [
   "Non ti perdono in due righe.",
   "Certe cose si perdonano in macchina, altre hanno bisogno di cinque minuti nella stessa stanza.",
   "Quando arrivi a Roma chiamami. Non vuol dire che ti ho perdonato."
  ]
 },
 "DAR_traslochi_08": {
  "text": [
   "Guidi. Come al solito. Sono due anni che hai da fare.",
   "Quando smetti di guidare, io sono ancora qui, scemo."
  ]
 },
 "DAR_imit_01": {
  "text": [
   "Ho un problema.",
   "Sono alla prossima piazzola. Accosta."
  ],
  "opts": {
   "0": "Sei dietro di me?",
   "1": "Come hai fatto a trovarmi?",
   "2": "Non mi fermo."
  }
 },
 "DAR_imit_02": {
  "text": [
   "Sì. E del trasloco non preoccuparti, davvero. Lascia stare.",
   "Sono io. Accosta."
  ],
  "alt": {
   "0": "Sì. Avevi da fare, lo so, hai fatto bene. Lascia stare. Sono io, accosta.",
   "1": "Sì. Il trasloco, le scuse, tutto quanto. Lascia stare. Sono io, accosta."
  },
  "opts": {
   "0": "Dario non perdona così in fretta.",
   "1": "Ok. Accosto."
  }
 },
 "DAR_imit_03": {
  "text": [
   "Ti ho visto sulla mappa. Hai condiviso la posizione, ti ricordi?"
  ],
  "opts": {
   "0": "Non ho condiviso niente.",
   "1": "Ok. Accosto."
  }
 },
 "DAR_imit_04": {
  "text": [
   "Va bene. Come vuoi tu. Hai ragione, non fermarti."
  ]
 },
 "DAR_imit_05": {
  "text": [
   "Hai ragione. Scusa. Non so perché l’ho detto in quel modo."
  ]
 },
 "DAR_imit_06": {
  "text": [
   "Bene. Quando arrivi spegni i fari, così non ci vedono."
  ]
 },
 "V2_CASA_01_M1": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Come si chiama il tuo gatto?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_Q1_M1": {
  "text": [
   "Fufi. Mica ha cambiato nome mentre guidavi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_M2": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Quando dici «Fufi», di chi parli?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_Q2_M2": {
  "text": [
   "Del gatto, di chi se no? Si è preso anche il tuo cuscino."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_M3": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Come si chiama il tuo gatto?",
   "1": "Quando dici «Fufi», di chi parli?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_Q1_M3": {
  "text": [
   "Fufi. Mica ha cambiato nome mentre guidavi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_Q2_M3": {
  "text": [
   "Del gatto, di chi se no? Si è preso anche il tuo cuscino."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_M4": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Secondo te, chi è che comanda in casa tua?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_Q3_M4": {
  "text": [
   "Fufi, ovvio. Io sto ancora trattando."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_M5": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Come si chiama il tuo gatto?",
   "1": "Secondo te, chi è che comanda in casa tua?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_Q1_M5": {
  "text": [
   "Fufi. Mica ha cambiato nome mentre guidavi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_Q3_M5": {
  "text": [
   "Fufi, ovvio. Io sto ancora trattando."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_M6": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Quando dici «Fufi», di chi parli?",
   "1": "Secondo te, chi è che comanda in casa tua?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_Q2_M6": {
  "text": [
   "Del gatto, di chi se no? Si è preso anche il tuo cuscino."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_Q3_M6": {
  "text": [
   "Fufi, ovvio. Io sto ancora trattando."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Come si chiama il tuo gatto?",
   "1": "Quando dici «Fufi», di chi parli?",
   "2": "Secondo te, chi è che comanda in casa tua?"
  }
 },
 "V2_CASA_01_Q1_M7": {
  "text": [
   "Fufi. Mica ha cambiato nome mentre guidavi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_Q2_M7": {
  "text": [
   "Del gatto, di chi se no? Si è preso anche il tuo cuscino."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_Q3_M7": {
  "text": [
   "Fufi, ovvio. Io sto ancora trattando."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_fine": {
  "text": [
   "Ecco, adesso sai quello che ti ho risposto. Il resto no."
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_01_P_M1": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Come si chiama il tuo gatto?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_P_Q1_M1": {
  "text": [
   "Fido. Perché me lo chiedi proprio adesso?"
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P_M2": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Quando dici «Fufi», di chi parli?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_P_Q2_M2": {
  "text": [
   "Del peluche che tenevi sul letto da piccolo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P_M3": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Come si chiama il tuo gatto?",
   "1": "Quando dici «Fufi», di chi parli?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_P_Q1_M3": {
  "text": [
   "Fido. Perché me lo chiedi proprio adesso?"
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P_Q2_M3": {
  "text": [
   "Del peluche che tenevi sul letto da piccolo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P_M4": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Secondo te, chi è che comanda in casa tua?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_P_Q3_M4": {
  "text": [
   "Il cane. Lo sai com’è fatto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P_M5": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Come si chiama il tuo gatto?",
   "1": "Secondo te, chi è che comanda in casa tua?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_P_Q1_M5": {
  "text": [
   "Fido. Perché me lo chiedi proprio adesso?"
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P_Q3_M5": {
  "text": [
   "Il cane. Lo sai com’è fatto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P_M6": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Quando dici «Fufi», di chi parli?",
   "1": "Secondo te, chi è che comanda in casa tua?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_01_P_Q2_M6": {
  "text": [
   "Del peluche che tenevi sul letto da piccolo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P_Q3_M6": {
  "text": [
   "Il cane. Lo sai com’è fatto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Come si chiama il tuo gatto?",
   "1": "Quando dici «Fufi», di chi parli?",
   "2": "Secondo te, chi è che comanda in casa tua?"
  }
 },
 "V2_CASA_01_P_Q1_M7": {
  "text": [
   "Fido. Perché me lo chiedi proprio adesso?"
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P_Q2_M7": {
  "text": [
   "Del peluche che tenevi sul letto da piccolo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P_Q3_M7": {
  "text": [
   "Il cane. Lo sai com’è fatto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_01_P_fine": {
  "text": [
   "Ecco, hai la tua risposta. Adesso la smettiamo con le domande?"
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_02_M1": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Qual era l’orario giusto per scriverti, secondo te?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_Q1_M1": {
  "text": [
   "Nessuno. È questo il problema dei miei turni."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_M2": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Se ti scrivo mentre lavori, tu che fai?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_Q2_M2": {
  "text": [
   "Ti rispondo dopo. Te l’ho già detto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_M3": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Qual era l’orario giusto per scriverti, secondo te?",
   "1": "Se ti scrivo mentre lavori, tu che fai?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_Q1_M3": {
  "text": [
   "Nessuno. È questo il problema dei miei turni."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_Q2_M3": {
  "text": [
   "Ti rispondo dopo. Te l’ho già detto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_M4": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Ci eravamo dati un’ora per sentirci?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_Q3_M4": {
  "text": [
   "No. Dovevi scrivermi tu quando ti fermavi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_M5": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Qual era l’orario giusto per scriverti, secondo te?",
   "1": "Ci eravamo dati un’ora per sentirci?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_Q1_M5": {
  "text": [
   "Nessuno. È questo il problema dei miei turni."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_Q3_M5": {
  "text": [
   "No. Dovevi scrivermi tu quando ti fermavi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_M6": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Se ti scrivo mentre lavori, tu che fai?",
   "1": "Ci eravamo dati un’ora per sentirci?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_Q2_M6": {
  "text": [
   "Ti rispondo dopo. Te l’ho già detto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_Q3_M6": {
  "text": [
   "No. Dovevi scrivermi tu quando ti fermavi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Qual era l’orario giusto per scriverti, secondo te?",
   "1": "Se ti scrivo mentre lavori, tu che fai?",
   "2": "Ci eravamo dati un’ora per sentirci?"
  }
 },
 "V2_CASA_02_Q1_M7": {
  "text": [
   "Nessuno. È questo il problema dei miei turni."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_Q2_M7": {
  "text": [
   "Ti rispondo dopo. Te l’ho già detto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_Q3_M7": {
  "text": [
   "No. Dovevi scrivermi tu quando ti fermavi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_fine": {
  "text": [
   "Ecco, adesso sai quello che ti ho risposto. Il resto no."
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_02_P_M1": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Qual era l’orario giusto per scriverti, secondo te?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_P_Q1_M1": {
  "text": [
   "Quello di sempre. Non cambia mai."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P_M2": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Se ti scrivo mentre lavori, tu che fai?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_P_Q2_M2": {
  "text": [
   "Ti rispondo subito. Io ti rispondo sempre."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P_M3": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Qual era l’orario giusto per scriverti, secondo te?",
   "1": "Se ti scrivo mentre lavori, tu che fai?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_P_Q1_M3": {
  "text": [
   "Quello di sempre. Non cambia mai."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P_Q2_M3": {
  "text": [
   "Ti rispondo subito. Io ti rispondo sempre."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P_M4": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Ci eravamo dati un’ora per sentirci?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_P_Q3_M4": {
  "text": [
   "Sì. La solita ora, tutte le sere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P_M5": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Qual era l’orario giusto per scriverti, secondo te?",
   "1": "Ci eravamo dati un’ora per sentirci?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_P_Q1_M5": {
  "text": [
   "Quello di sempre. Non cambia mai."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P_Q3_M5": {
  "text": [
   "Sì. La solita ora, tutte le sere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P_M6": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Se ti scrivo mentre lavori, tu che fai?",
   "1": "Ci eravamo dati un’ora per sentirci?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_02_P_Q2_M6": {
  "text": [
   "Ti rispondo subito. Io ti rispondo sempre."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P_Q3_M6": {
  "text": [
   "Sì. La solita ora, tutte le sere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Qual era l’orario giusto per scriverti, secondo te?",
   "1": "Se ti scrivo mentre lavori, tu che fai?",
   "2": "Ci eravamo dati un’ora per sentirci?"
  }
 },
 "V2_CASA_02_P_Q1_M7": {
  "text": [
   "Quello di sempre. Non cambia mai."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P_Q2_M7": {
  "text": [
   "Ti rispondo subito. Io ti rispondo sempre."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P_Q3_M7": {
  "text": [
   "Sì. La solita ora, tutte le sere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_02_P_fine": {
  "text": [
   "Ecco, hai la tua risposta. Adesso la smettiamo con le domande?"
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_03_M1": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Di chi ti lamentavi, prima?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_Q1_M1": {
  "text": [
   "Del coinquilino. Mica di uno sconosciuto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_M2": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Cosa faceva il coinquilino?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_Q2_M2": {
  "text": [
   "Il trapano. A mezzanotte, capito?"
  ],
  "opts": {
   "0": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_M3": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Di chi ti lamentavi, prima?",
   "1": "Cosa faceva il coinquilino?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_Q1_M3": {
  "text": [
   "Del coinquilino. Mica di uno sconosciuto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_Q2_M3": {
  "text": [
   "Il trapano. A mezzanotte, capito?"
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_M4": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Il tuo coinquilino ti faceva paura?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_Q3_M4": {
  "text": [
   "No. Mi teneva sveglia e basta."
  ],
  "opts": {
   "0": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_M5": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Di chi ti lamentavi, prima?",
   "1": "Il tuo coinquilino ti faceva paura?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_Q1_M5": {
  "text": [
   "Del coinquilino. Mica di uno sconosciuto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_Q3_M5": {
  "text": [
   "No. Mi teneva sveglia e basta."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_M6": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Cosa faceva il coinquilino?",
   "1": "Il tuo coinquilino ti faceva paura?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_Q2_M6": {
  "text": [
   "Il trapano. A mezzanotte, capito?"
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_Q3_M6": {
  "text": [
   "No. Mi teneva sveglia e basta."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Di chi ti lamentavi, prima?",
   "1": "Cosa faceva il coinquilino?",
   "2": "Il tuo coinquilino ti faceva paura?"
  }
 },
 "V2_CASA_03_Q1_M7": {
  "text": [
   "Del coinquilino. Mica di uno sconosciuto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_Q2_M7": {
  "text": [
   "Il trapano. A mezzanotte, capito?"
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_Q3_M7": {
  "text": [
   "No. Mi teneva sveglia e basta."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_fine": {
  "text": [
   "Ecco, adesso sai quello che ti ho risposto. Il resto no."
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_03_P_M1": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Di chi ti lamentavi, prima?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_P_Q1_M1": {
  "text": [
   "Di quello che abita qui accanto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_P_M2": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Cosa faceva il coinquilino?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_P_Q2_M2": {
  "text": [
   "Cucinava. Aspettavo che liberasse il tavolo."
  ],
  "opts": {
   "0": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_P_M3": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Di chi ti lamentavi, prima?",
   "1": "Cosa faceva il coinquilino?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_P_Q1_M3": {
  "text": [
   "Di quello che abita qui accanto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_P_Q2_M3": {
  "text": [
   "Cucinava. Aspettavo che liberasse il tavolo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_P_M4": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Il tuo coinquilino ti faceva paura?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_P_Q3_M4": {
  "text": [
   "Sì. È per quello che ti chiamavo così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_P_M5": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Di chi ti lamentavi, prima?",
   "1": "Il tuo coinquilino ti faceva paura?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_P_Q1_M5": {
  "text": [
   "Di quello che abita qui accanto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_P_Q3_M5": {
  "text": [
   "Sì. È per quello che ti chiamavo così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_P_M6": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Cosa faceva il coinquilino?",
   "1": "Il tuo coinquilino ti faceva paura?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_03_P_Q2_M6": {
  "text": [
   "Cucinava. Aspettavo che liberasse il tavolo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_P_Q3_M6": {
  "text": [
   "Sì. È per quello che ti chiamavo così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_P": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Di chi ti lamentavi, prima?",
   "1": "Cosa faceva il coinquilino?",
   "2": "Il tuo coinquilino ti faceva paura?"
  }
 },
 "V2_CASA_03_P_Q1_M7": {
  "text": [
   "Di quello che abita qui accanto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_P_Q2_M7": {
  "text": [
   "Cucinava. Aspettavo che liberasse il tavolo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_P_Q3_M7": {
  "text": [
   "Sì. È per quello che ti chiamavo così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_03_P_fine": {
  "text": [
   "Ecco, hai la tua risposta. Adesso la smettiamo con le domande?"
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_04_M1": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Perché mi chiami Nonno?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_Q1_M1": {
  "text": [
   "Perché brontoli. E così mi rendi le cose facili."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_M2": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Nonno è una specie di titolo d’onore?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_Q2_M2": {
  "text": [
   "Sì, certo. Continua pure a raccontartela."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_M3": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Perché mi chiami Nonno?",
   "1": "Nonno è una specie di titolo d’onore?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_Q1_M3": {
  "text": [
   "Perché brontoli. E così mi rendi le cose facili."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_Q2_M3": {
  "text": [
   "Sì, certo. Continua pure a raccontartela."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_M4": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Come mi chiami quando vuoi prendermi in giro?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_Q3_M4": {
  "text": [
   "Nonno. Adesso non fare finta di non saperlo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_M5": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Perché mi chiami Nonno?",
   "1": "Come mi chiami quando vuoi prendermi in giro?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_Q1_M5": {
  "text": [
   "Perché brontoli. E così mi rendi le cose facili."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_Q3_M5": {
  "text": [
   "Nonno. Adesso non fare finta di non saperlo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_M6": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Nonno è una specie di titolo d’onore?",
   "1": "Come mi chiami quando vuoi prendermi in giro?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_Q2_M6": {
  "text": [
   "Sì, certo. Continua pure a raccontartela."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_Q3_M6": {
  "text": [
   "Nonno. Adesso non fare finta di non saperlo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Perché mi chiami Nonno?",
   "1": "Nonno è una specie di titolo d’onore?",
   "2": "Come mi chiami quando vuoi prendermi in giro?"
  }
 },
 "V2_CASA_04_Q1_M7": {
  "text": [
   "Perché brontoli. E così mi rendi le cose facili."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_Q2_M7": {
  "text": [
   "Sì, certo. Continua pure a raccontartela."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_Q3_M7": {
  "text": [
   "Nonno. Adesso non fare finta di non saperlo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_fine": {
  "text": [
   "Ecco, adesso sai quello che ti ho risposto. Il resto no."
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_04_P_M1": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Perché mi chiami Nonno?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_P_Q1_M1": {
  "text": [
   "Perché è il modo più dolce che conosco."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P_M2": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Nonno è una specie di titolo d’onore?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_P_Q2_M2": {
  "text": [
   "Sì. È una cosa importante, tra noi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P_M3": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Perché mi chiami Nonno?",
   "1": "Nonno è una specie di titolo d’onore?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_P_Q1_M3": {
  "text": [
   "Perché è il modo più dolce che conosco."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P_Q2_M3": {
  "text": [
   "Sì. È una cosa importante, tra noi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P_M4": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Come mi chiami quando vuoi prendermi in giro?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_P_Q3_M4": {
  "text": [
   "Nonno, amore. È sempre stato così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P_M5": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Perché mi chiami Nonno?",
   "1": "Come mi chiami quando vuoi prendermi in giro?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_P_Q1_M5": {
  "text": [
   "Perché è il modo più dolce che conosco."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P_Q3_M5": {
  "text": [
   "Nonno, amore. È sempre stato così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P_M6": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Nonno è una specie di titolo d’onore?",
   "1": "Come mi chiami quando vuoi prendermi in giro?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_04_P_Q2_M6": {
  "text": [
   "Sì. È una cosa importante, tra noi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P_Q3_M6": {
  "text": [
   "Nonno, amore. È sempre stato così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Perché mi chiami Nonno?",
   "1": "Nonno è una specie di titolo d’onore?",
   "2": "Come mi chiami quando vuoi prendermi in giro?"
  }
 },
 "V2_CASA_04_P_Q1_M7": {
  "text": [
   "Perché è il modo più dolce che conosco."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P_Q2_M7": {
  "text": [
   "Sì. È una cosa importante, tra noi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P_Q3_M7": {
  "text": [
   "Nonno, amore. È sempre stato così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_04_P_fine": {
  "text": [
   "Ecco, hai la tua risposta. Adesso la smettiamo con le domande?"
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_05_M1": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Chi me l’aveva dato, quel soprannome?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_Q1_M1": {
  "text": [
   "Claudio. Io l’ho solo tenuto in vita."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_M2": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Quanti anni avevo quando è nato quel soprannome?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_Q2_M2": {
  "text": [
   "Otto. E brontolavi già parecchio."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_M3": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Chi me l’aveva dato, quel soprannome?",
   "1": "Quanti anni avevo quando è nato quel soprannome?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_Q1_M3": {
  "text": [
   "Claudio. Io l’ho solo tenuto in vita."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_Q2_M3": {
  "text": [
   "Otto. E brontolavi già parecchio."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_M4": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Il soprannome è nato quando sono andato a prendere la macchina?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_Q3_M4": {
  "text": [
   "No. Avevi otto anni, mica la patente."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_M5": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Chi me l’aveva dato, quel soprannome?",
   "1": "Il soprannome è nato quando sono andato a prendere la macchina?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_Q1_M5": {
  "text": [
   "Claudio. Io l’ho solo tenuto in vita."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_Q3_M5": {
  "text": [
   "No. Avevi otto anni, mica la patente."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_M6": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Quanti anni avevo quando è nato quel soprannome?",
   "1": "Il soprannome è nato quando sono andato a prendere la macchina?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_Q2_M6": {
  "text": [
   "Otto. E brontolavi già parecchio."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_Q3_M6": {
  "text": [
   "No. Avevi otto anni, mica la patente."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Chi me l’aveva dato, quel soprannome?",
   "1": "Quanti anni avevo quando è nato quel soprannome?",
   "2": "Il soprannome è nato quando sono andato a prendere la macchina?"
  }
 },
 "V2_CASA_05_Q1_M7": {
  "text": [
   "Claudio. Io l’ho solo tenuto in vita."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_Q2_M7": {
  "text": [
   "Otto. E brontolavi già parecchio."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_Q3_M7": {
  "text": [
   "No. Avevi otto anni, mica la patente."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_fine": {
  "text": [
   "Ecco, adesso sai quello che ti ho risposto. Il resto no."
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_05_P_M1": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Chi me l’aveva dato, quel soprannome?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_P_Q1_M1": {
  "text": [
   "Io. Claudio non c’entrava niente."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P_M2": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Quanti anni avevo quando è nato quel soprannome?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_P_Q2_M2": {
  "text": [
   "Eri già grande. Avevi appena preso la macchina."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P_M3": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Chi me l’aveva dato, quel soprannome?",
   "1": "Quanti anni avevo quando è nato quel soprannome?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_P_Q1_M3": {
  "text": [
   "Io. Claudio non c’entrava niente."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P_Q2_M3": {
  "text": [
   "Eri già grande. Avevi appena preso la macchina."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P_M4": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Il soprannome è nato quando sono andato a prendere la macchina?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_P_Q3_M4": {
  "text": [
   "Sì. È nato tutto quel giorno."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P_M5": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Chi me l’aveva dato, quel soprannome?",
   "1": "Il soprannome è nato quando sono andato a prendere la macchina?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_P_Q1_M5": {
  "text": [
   "Io. Claudio non c’entrava niente."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P_Q3_M5": {
  "text": [
   "Sì. È nato tutto quel giorno."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P_M6": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Quanti anni avevo quando è nato quel soprannome?",
   "1": "Il soprannome è nato quando sono andato a prendere la macchina?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_05_P_Q2_M6": {
  "text": [
   "Eri già grande. Avevi appena preso la macchina."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P_Q3_M6": {
  "text": [
   "Sì. È nato tutto quel giorno."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Chi me l’aveva dato, quel soprannome?",
   "1": "Quanti anni avevo quando è nato quel soprannome?",
   "2": "Il soprannome è nato quando sono andato a prendere la macchina?"
  }
 },
 "V2_CASA_05_P_Q1_M7": {
  "text": [
   "Io. Claudio non c’entrava niente."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P_Q2_M7": {
  "text": [
   "Eri già grande. Avevi appena preso la macchina."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P_Q3_M7": {
  "text": [
   "Sì. È nato tutto quel giorno."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_05_P_fine": {
  "text": [
   "Ecco, hai la tua risposta. Adesso la smettiamo con le domande?"
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_06_M1": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Quante volte l’avevo visto, Claudio?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_Q1_M1": {
  "text": [
   "Tre volte. Mica tutti i fine settimana."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_M2": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Claudio lo conoscevamo bene?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_Q2_M2": {
  "text": [
   "No. Anche per questo sembra strano."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_M3": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Quante volte l’avevo visto, Claudio?",
   "1": "Claudio lo conoscevamo bene?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_Q1_M3": {
  "text": [
   "Tre volte. Mica tutti i fine settimana."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_Q2_M3": {
  "text": [
   "No. Anche per questo sembra strano."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_M4": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Ti sembra uno che sentivamo tutti i giorni?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_Q3_M4": {
  "text": [
   "No. Era uno zio che conoscevamo appena."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_M5": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Quante volte l’avevo visto, Claudio?",
   "1": "Ti sembra uno che sentivamo tutti i giorni?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_Q1_M5": {
  "text": [
   "Tre volte. Mica tutti i fine settimana."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_Q3_M5": {
  "text": [
   "No. Era uno zio che conoscevamo appena."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_M6": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Claudio lo conoscevamo bene?",
   "1": "Ti sembra uno che sentivamo tutti i giorni?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_Q2_M6": {
  "text": [
   "No. Anche per questo sembra strano."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_Q3_M6": {
  "text": [
   "No. Era uno zio che conoscevamo appena."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Quante volte l’avevo visto, Claudio?",
   "1": "Claudio lo conoscevamo bene?",
   "2": "Ti sembra uno che sentivamo tutti i giorni?"
  }
 },
 "V2_CASA_06_Q1_M7": {
  "text": [
   "Tre volte. Mica tutti i fine settimana."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_Q2_M7": {
  "text": [
   "No. Anche per questo sembra strano."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_Q3_M7": {
  "text": [
   "No. Era uno zio che conoscevamo appena."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_fine": {
  "text": [
   "Ecco, adesso sai quello che ti ho risposto. Il resto no."
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_06_P_M1": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Quante volte l’avevo visto, Claudio?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_P_Q1_M1": {
  "text": [
   "Sempre. Ci passavi tutte le domeniche."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P_M2": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Claudio lo conoscevamo bene?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_P_Q2_M2": {
  "text": [
   "Benissimo. Di lui sapevi tutto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P_M3": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Quante volte l’avevo visto, Claudio?",
   "1": "Claudio lo conoscevamo bene?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_P_Q1_M3": {
  "text": [
   "Sempre. Ci passavi tutte le domeniche."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P_Q2_M3": {
  "text": [
   "Benissimo. Di lui sapevi tutto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P_M4": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Ti sembra uno che sentivamo tutti i giorni?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_P_Q3_M4": {
  "text": [
   "Sì. Mi chiamava tutte le sere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P_M5": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Quante volte l’avevo visto, Claudio?",
   "1": "Ti sembra uno che sentivamo tutti i giorni?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_P_Q1_M5": {
  "text": [
   "Sempre. Ci passavi tutte le domeniche."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P_Q3_M5": {
  "text": [
   "Sì. Mi chiamava tutte le sere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P_M6": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Claudio lo conoscevamo bene?",
   "1": "Ti sembra uno che sentivamo tutti i giorni?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_06_P_Q2_M6": {
  "text": [
   "Benissimo. Di lui sapevi tutto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P_Q3_M6": {
  "text": [
   "Sì. Mi chiamava tutte le sere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Quante volte l’avevo visto, Claudio?",
   "1": "Claudio lo conoscevamo bene?",
   "2": "Ti sembra uno che sentivamo tutti i giorni?"
  }
 },
 "V2_CASA_06_P_Q1_M7": {
  "text": [
   "Sempre. Ci passavi tutte le domeniche."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P_Q2_M7": {
  "text": [
   "Benissimo. Di lui sapevi tutto."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P_Q3_M7": {
  "text": [
   "Sì. Mi chiamava tutte le sere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_06_P_fine": {
  "text": [
   "Ecco, hai la tua risposta. Adesso la smettiamo con le domande?"
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_07_M1": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Cosa mi aveva regalato Claudio?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_Q1_M1": {
  "text": [
   "Un temperino. Me l’hai appena detto tu."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_M2": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Nella busta con le chiavi cosa c’era?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_Q2_M2": {
  "text": [
   "Il temperino che ti aveva regalato."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_M3": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Cosa mi aveva regalato Claudio?",
   "1": "Nella busta con le chiavi cosa c’era?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_Q1_M3": {
  "text": [
   "Un temperino. Me l’hai appena detto tu."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_Q2_M3": {
  "text": [
   "Il temperino che ti aveva regalato."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_M4": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Perché quel temperino non è roba trovata per caso?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_Q3_M4": {
  "text": [
   "Te l’aveva regalato Claudio."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_M5": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Cosa mi aveva regalato Claudio?",
   "1": "Perché quel temperino non è roba trovata per caso?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_Q1_M5": {
  "text": [
   "Un temperino. Me l’hai appena detto tu."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_Q3_M5": {
  "text": [
   "Te l’aveva regalato Claudio."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_M6": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Nella busta con le chiavi cosa c’era?",
   "1": "Perché quel temperino non è roba trovata per caso?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_Q2_M6": {
  "text": [
   "Il temperino che ti aveva regalato."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_Q3_M6": {
  "text": [
   "Te l’aveva regalato Claudio."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Cosa mi aveva regalato Claudio?",
   "1": "Nella busta con le chiavi cosa c’era?",
   "2": "Perché quel temperino non è roba trovata per caso?"
  }
 },
 "V2_CASA_07_Q1_M7": {
  "text": [
   "Un temperino. Me l’hai appena detto tu."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_Q2_M7": {
  "text": [
   "Il temperino che ti aveva regalato."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_Q3_M7": {
  "text": [
   "Te l’aveva regalato Claudio."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_fine": {
  "text": [
   "Ecco, adesso sai quello che ti ho risposto. Il resto no."
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_07_P_M1": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Cosa mi aveva regalato Claudio?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_P_Q1_M1": {
  "text": [
   "Un accendino. Lo tenevi sempre in tasca."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P_M2": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Nella busta con le chiavi cosa c’era?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_P_Q2_M2": {
  "text": [
   "Un orologio. Era il suo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P_M3": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Cosa mi aveva regalato Claudio?",
   "1": "Nella busta con le chiavi cosa c’era?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_P_Q1_M3": {
  "text": [
   "Un accendino. Lo tenevi sempre in tasca."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P_Q2_M3": {
  "text": [
   "Un orologio. Era il suo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P_M4": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Perché quel temperino non è roba trovata per caso?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_P_Q3_M4": {
  "text": [
   "Era del vecchio proprietario, uno che non conoscevi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P_M5": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Cosa mi aveva regalato Claudio?",
   "1": "Perché quel temperino non è roba trovata per caso?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_P_Q1_M5": {
  "text": [
   "Un accendino. Lo tenevi sempre in tasca."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P_Q3_M5": {
  "text": [
   "Era del vecchio proprietario, uno che non conoscevi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P_M6": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Nella busta con le chiavi cosa c’era?",
   "1": "Perché quel temperino non è roba trovata per caso?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_07_P_Q2_M6": {
  "text": [
   "Un orologio. Era il suo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P_Q3_M6": {
  "text": [
   "Era del vecchio proprietario, uno che non conoscevi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Cosa mi aveva regalato Claudio?",
   "1": "Nella busta con le chiavi cosa c’era?",
   "2": "Perché quel temperino non è roba trovata per caso?"
  }
 },
 "V2_CASA_07_P_Q1_M7": {
  "text": [
   "Un accendino. Lo tenevi sempre in tasca."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P_Q2_M7": {
  "text": [
   "Un orologio. Era il suo."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P_Q3_M7": {
  "text": [
   "Era del vecchio proprietario, uno che non conoscevi."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_07_P_fine": {
  "text": [
   "Ecco, hai la tua risposta. Adesso la smettiamo con le domande?"
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_08_M1": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Tra quante macchine potevo scegliere?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_Q1_M1": {
  "text": [
   "Una su sei. E già ti sentivi il padrone di tutte."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_M2": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "E le altre cinque sono diventate mie?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_Q2_M2": {
  "text": [
   "No. Mica ti hanno regalato un autosalone."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_M3": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Tra quante macchine potevo scegliere?",
   "1": "E le altre cinque sono diventate mie?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_Q1_M3": {
  "text": [
   "Una su sei. E già ti sentivi il padrone di tutte."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_Q2_M3": {
  "text": [
   "No. Mica ti hanno regalato un autosalone."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_M4": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Quante macchine mi sto riportando a casa?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_Q3_M4": {
  "text": [
   "Una. E già una basta a farti parlare così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_M5": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Tra quante macchine potevo scegliere?",
   "1": "Quante macchine mi sto riportando a casa?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_Q1_M5": {
  "text": [
   "Una su sei. E già ti sentivi il padrone di tutte."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_Q3_M5": {
  "text": [
   "Una. E già una basta a farti parlare così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_M6": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "E le altre cinque sono diventate mie?",
   "1": "Quante macchine mi sto riportando a casa?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_Q2_M6": {
  "text": [
   "No. Mica ti hanno regalato un autosalone."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_Q3_M6": {
  "text": [
   "Una. E già una basta a farti parlare così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08": {
  "text": [
   "Dimmi, cosa volevi chiedermi?"
  ],
  "opts": {
   "0": "Tra quante macchine potevo scegliere?",
   "1": "E le altre cinque sono diventate mie?",
   "2": "Quante macchine mi sto riportando a casa?"
  }
 },
 "V2_CASA_08_Q1_M7": {
  "text": [
   "Una su sei. E già ti sentivi il padrone di tutte."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_Q2_M7": {
  "text": [
   "No. Mica ti hanno regalato un autosalone."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_Q3_M7": {
  "text": [
   "Una. E già una basta a farti parlare così."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_fine": {
  "text": [
   "Ecco, adesso sai quello che ti ho risposto. Il resto no."
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 },
 "V2_CASA_08_P_M1": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Tra quante macchine potevo scegliere?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_P_Q1_M1": {
  "text": [
   "Tutte e sei. Devi solo andarle a prendere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P_M2": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "E le altre cinque sono diventate mie?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_P_Q2_M2": {
  "text": [
   "Sì. Le chiavi le hai lasciate lì."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P_M3": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Tra quante macchine potevo scegliere?",
   "1": "E le altre cinque sono diventate mie?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_P_Q1_M3": {
  "text": [
   "Tutte e sei. Devi solo andarle a prendere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P_Q2_M3": {
  "text": [
   "Sì. Le chiavi le hai lasciate lì."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P_M4": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Quante macchine mi sto riportando a casa?",
   "1": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_P_Q3_M4": {
  "text": [
   "Sei. Le altre ti vengono dietro."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P_M5": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Tra quante macchine potevo scegliere?",
   "1": "Quante macchine mi sto riportando a casa?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_P_Q1_M5": {
  "text": [
   "Tutte e sei. Devi solo andarle a prendere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P_Q3_M5": {
  "text": [
   "Sei. Le altre ti vengono dietro."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P_M6": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "E le altre cinque sono diventate mie?",
   "1": "Quante macchine mi sto riportando a casa?",
   "2": "Lascia stare, torno ai messaggi."
  }
 },
 "V2_CASA_08_P_Q2_M6": {
  "text": [
   "Sì. Le chiavi le hai lasciate lì."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P_Q3_M6": {
  "text": [
   "Sei. Le altre ti vengono dietro."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P": {
  "text": [
   "Chiedimi quello che vuoi. Ma poi vieni a prendermi."
  ],
  "opts": {
   "0": "Tra quante macchine potevo scegliere?",
   "1": "E le altre cinque sono diventate mie?",
   "2": "Quante macchine mi sto riportando a casa?"
  }
 },
 "V2_CASA_08_P_Q1_M7": {
  "text": [
   "Tutte e sei. Devi solo andarle a prendere."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P_Q2_M7": {
  "text": [
   "Sì. Le chiavi le hai lasciate lì."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P_Q3_M7": {
  "text": [
   "Sei. Le altre ti vengono dietro."
  ],
  "opts": {
   "0": "Ok, mi basta.",
   "1": "Un’altra domanda."
  }
 },
 "V2_CASA_08_P_fine": {
  "text": [
   "Ecco, hai la tua risposta. Adesso la smettiamo con le domande?"
  ],
  "alt": {
   "0": "Questo te l’ho già detto. Adesso leggi il resto.",
   "1": "Questo te l’ho già detto. Adesso leggi il resto.",
   "2": "Questo te l’ho già detto. Adesso leggi il resto."
  }
 }
}/*FINE*/;
function chatModApplica(list, mod) {
  const by = {}; let k = 0;
  for (const n of list) by[n.id] = n;
  for (const id of Object.keys(mod)) {
    const n = by[id], m = mod[id]; if (!n) continue;
    if (m.text != null) n.text = m.text;
    if (m.alt) for (const i of Object.keys(m.alt)) if (n.alt && n.alt[i]) n.alt[i].text = m.alt[i];
    if (m.opts) for (const i of Object.keys(m.opts)) if (n.opts && n.opts[i]) n.opts[i].t = m.opts[i];
    k++;
  }
  return k;
}
chatModApplica(CHAT_LIST, CHAT_MOD);
