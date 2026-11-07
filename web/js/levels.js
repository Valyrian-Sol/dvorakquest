/**
 * DvorakQuest — 8 Welten, 32 Stufenweise aufgebaute Lektionen für Deutsch-Dvorak (Typ I)
 * Jede Lektion in den Welten 1–6 nutzt ausschließlich Buchstaben und Zeichen,
 * die bis einschließlich dieser Lektion eingeführt wurden!
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DvorakLevels = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const WORLDS = [
    {
      id: 1,
      name: 'Herz der Grundreihe',
      subtitle: 'Die 8 Ruhefinger: E I D R und A O N S',
      icon: '🏠',
      color: '#34d399',
    },
    {
      id: 2,
      name: 'Volle Grundreihe',
      subtitle: 'Streckung nach innen & außen: U H L und - _',
      icon: '🌿',
      color: '#38bdf8',
    },
    {
      id: 3,
      name: 'Obere Reihe Rechts',
      subtitle: 'Konsonanten-Power: F G C T Z P',
      icon: '🦅',
      color: '#818cf8',
    },
    {
      id: 4,
      name: 'Obere Reihe Links',
      subtitle: 'Satzzeichen, Ü & Y: , . ; : Ü Y # \'',
      icon: '✨',
      color: '#fbbf24',
    },
    {
      id: 5,
      name: 'Untere Reihe Links & Umlaute',
      subtitle: 'Endlich komplett: Ä Ö Q @ J K',
      icon: '🔥',
      color: '#f472b6',
    },
    {
      id: 6,
      name: 'Untere Reihe Rechts & ß',
      subtitle: 'Das Finale des Alphabets: X B M W V ß ? \\',
      icon: '👑',
      color: '#fb923c',
    },
    {
      id: 7,
      name: 'Zahlen & Arithmetik',
      subtitle: 'Ziffern 1–0 und Symbole ! " § $ % & / ( ) = + *',
      icon: '🔢',
      color: '#2dd4bf',
    },
    {
      id: 8,
      name: 'Code- & Vim-Meister auf Dvorak',
      subtitle: 'Klammern { [ ] }, Pipe |, Tilde ~, < > und Code',
      icon: '💻',
      color: '#a78bfa',
    },
  ];

  const LEVELS = [
    /* ==================== WELT 1: HERZ DER GRUNDREIHE ==================== */
    {
      id: '1-1',
      world: 1,
      title: 'Die vier stärksten Finger (e i d r)',
      newKeys: ['e', 'i', 'd', 'r'],
      tip: 'Lege deine Zeigefinger auf die fühlbaren Kerben: Links I (QWERTZ F), Rechts D (QWERTZ J). Daneben liegen die Mittelfinger auf E (QWERTZ D) und R (QWERTZ K).',
      targetWpm: [22, 14],
      text: 'er dir drei rede erde irre ried drei er dir rede erde ried irre drei',
    },
    {
      id: '1-2',
      world: 1,
      title: 'Ring- & kleine Finger (a o n s)',
      newKeys: ['a', 'o', 'n', 's'],
      tip: 'Links ruhen kleiner Finger auf A und Ringfinger auf O (QWERTZ S). Rechts ruhen Ringfinger auf N (QWERTZ L) und kleiner Finger auf S (QWERTZ Ö).',
      targetWpm: [24, 15],
      text: 'an so da nie oase nase rose sonne sand rand sein dein rein norden',
    },
    {
      id: '1-3',
      world: 1,
      title: 'Harmonie der 8 Ruhefinger',
      newKeys: ['a', 'o', 'e', 'i', 'd', 'r', 'n', 's'],
      tip: 'Alle Vokale A O E I liegen links, die häufigsten Konsonanten D R N S rechts – dadurch wechseln sich linke und rechte Hand im Rhythmus ab!',
      targetWpm: [26, 16],
      text: 'dein sinn sein reisen orden norden eine oase im -> ohne m: dein sinn sein reisen orden norden eine oase an der erde rosen im -> rosen an den sanden'.replace(/.*-> rosen /, 'dein sinn sein reisen orden norden eine oase an der erde rosen '),
    },
    {
      id: '1-4',
      world: 1,
      title: 'Grundreihen-Großschreibung (Shift)',
      newKeys: ['A', 'O', 'E', 'I', 'D', 'R', 'N', 'S'],
      tip: 'Goldene 10-Finger-Regel: Drücke Shift immer mit dem kleinen Finger der GEGENÜBERLIEGENDEN Hand!',
      targetWpm: [25, 15],
      text: 'Norden Sonne Reise Erde Orden Sand Riese Oase Nase Rose Sinn Sein Dein Rein',
    },

    /* ==================== WELT 2: VOLLE GRUNDREIHE ==================== */
    {
      id: '2-1',
      world: 2,
      title: 'Zeigefinger nach innen (u & h)',
      newKeys: ['u', 'h'],
      tip: 'Der linke Zeigefinger greift von I ein Feld nach rechts auf U (QWERTZ G). Der rechte Zeigefinger greift von D nach links auf H (QWERTZ H).',
      targetWpm: [26, 16],
      text: 'Uhr Hund Huhn Ruhe Hunde Uhren Ohr Nah Aha Haus Hand Rund Hinaus Daher Darin',
    },
    {
      id: '2-2',
      world: 2,
      title: 'Der rechte Außenflügel (l)',
      newKeys: ['l'],
      tip: 'Der rechte kleine Finger rückt von S ein Feld nach rechts auf L (QWERTZ Ä).',
      targetWpm: [27, 17],
      text: 'Alle Halle Rolle Leise Leder Lieder Insel Seele Eule Heulen Land Hell Seil Heil',
    },
    {
      id: '2-3',
      world: 2,
      title: 'Bindestrich & Unterstrich (- und _)',
      newKeys: ['-', '_'],
      tip: 'Ganz rechts in der Grundreihe (neben L, auf QWERTZ #) liegt der Bindestrich - und mit Shift der Unterstrich _!',
      targetWpm: [24, 15],
      text: 'hin-und-her Nord-See ein-aus Hallen-Uhr uhr_id hallen_ader nord_see insel_see',
    },
    {
      id: '2-4',
      world: 2,
      title: 'Meister der gesamten Grundreihe',
      newKeys: ['a', 'o', 'e', 'i', 'u', 'h', 'd', 'r', 'n', 's', 'l', '-'],
      tip: 'Unglaublich: Allein mit der Grundreihe kannst du bereits 70 % aller deutschen Buchstaben anschlagen!',
      targetWpm: [28, 18],
      text: 'Alle Hunde ruhen leise in der hellen Halle an der sonnen-hellen Insel des Nordens',
    },

    /* ==================== WELT 3: OBERE REIHE RECHTS ==================== */
    {
      id: '3-1',
      world: 3,
      title: 'Rechter Zeigefinger oben (f & g)',
      newKeys: ['f', 'g'],
      tip: 'Vom rechten Zeigefinger (D) geht es schräg hoch auf F (QWERTZ Z) und G (QWERTZ U).',
      targetWpm: [26, 16],
      text: 'Flug Graf Frage Finger Erfolg Anfang Gefahr Gold Fahne Freude Folge Grund Ruf',
    },
    {
      id: '3-2',
      world: 3,
      title: 'Mittel- & Ringfinger oben (c & t)',
      newKeys: ['c', 't'],
      tip: 'Rechter Mittelfinger hoch von R auf C (QWERTZ I); rechter Ringfinger hoch von N auf T (QWERTZ O).',
      targetWpm: [26, 16],
      text: 'Tag Licht Nacht Nicht Acht Recht Echt Dicht Tisch Sicht Frucht Tracht Geschichte',
    },
    {
      id: '3-3',
      world: 3,
      title: 'Kleiner Finger oben rechts (z & p)',
      newKeys: ['z', 'p'],
      tip: 'Rechter kleiner Finger hoch von S auf Z (QWERTZ P) und rechts daneben auf P (QWERTZ Ü).',
      targetWpm: [25, 15],
      text: 'Zeit Ziel Platz Prinz Tanz Herz Stolz Preis Pfad Palast Pflanze Spitze Glanz',
    },
    {
      id: '3-4',
      world: 3,
      title: 'Prüfung der rechten Oberreihe',
      newKeys: ['f', 'g', 'c', 't', 'z', 'p'],
      tip: 'Halte die linke Hand ruhig auf den Vokalen A O E I U, während die rechte Hand zwischen Grund- und Oberreihe tanzt.',
      targetWpm: [28, 18],
      text: 'Der stolze Prinz tanzt durch die helle Nacht in den goldenen Palast nahe der Felsen',
    },

    /* ==================== WELT 4: OBERE REIHE LINKS ==================== */
    {
      id: '4-1',
      world: 4,
      title: 'Satzzeichen oben links (, . ; :)',
      newKeys: [',', '.', ';', ':'],
      tip: 'Auf Dvorak liegen Komma (QWERTZ W) und Punkt (QWERTZ E) oben links – und mit Shift direkt darüber Semikolon ; und Doppelpunkt :!',
      targetWpm: [24, 15],
      text: 'Tag und Nacht, Licht und Schatten: Die Zeit eilt; das Ziel naht, der Erfolg lacht.',
    },
    {
      id: '4-2',
      world: 4,
      title: 'Das Ü und das Y (ü & y)',
      newKeys: ['ü', 'Ü', 'y', 'Y'],
      tip: 'Linker kleiner Finger hoch von A auf Ü (QWERTZ Q). Linker Zeigefinger hoch auf Y (QWERTZ T).',
      targetWpm: [25, 15],
      text: 'Fürs grüne Hügel-Land spürt der Prinz früh die frische Luft: Typ, Lydien, Asyl und Idyll.',
    },
    {
      id: '4-3',
      world: 4,
      title: 'Raute & Apostroph (# und \')',
      newKeys: ['#', "'"],
      tip: 'Der linke Zeigefinger erreicht direkt über I (auf QWERTZ R) die Raute # und mit Shift das Apostroph \'!',
      targetWpm: [23, 14],
      text: "#Tag #Training #Erfolg: So geht's rasch, hier steht's fest, los geht's ans #Ziel.",
    },
    {
      id: '4-4',
      world: 4,
      title: 'Meister der oberen Reihe',
      newKeys: ['ü', ',', '.', '#', 'y', 'f', 'g', 'c', 't', 'z', 'p'],
      tip: 'Grundreihe und obere Reihe sitzen jetzt gemeinsam!',
      targetWpm: [27, 17],
      text: "Früh auf den grünen Hügeln strahlt die goldene Sonne; #Glanz: Los geht's ins Feld.",
    },

    /* ==================== WELT 5: UNTERE REIHE LINKS & UMLAUTE ==================== */
    {
      id: '5-1',
      world: 5,
      title: 'Endlich da: Das Ä und Ö (ä Ä ö Ö)',
      newKeys: ['ä', 'Ä', 'ö', 'Ö'],
      tip: 'Unten links neben Shift liegt Ä (auf der <-Taste, alternativ AltGr+A) und direkt rechts daneben Ö (auf QWERTZ Y, alternativ AltGr+O)!',
      targetWpm: [24, 15],
      text: 'Äpfel, Ähren und Ärger; schönes Öl aus Österreich, stolze Söhne, hohe Töne und grüne Gärten.',
    },
    {
      id: '5-2',
      world: 5,
      title: 'J und K unten links (j & k)',
      newKeys: ['j', 'k'],
      tip: 'Linker Zeigefinger nach unten auf J (QWERTZ C) und K (QWERTZ V) – ideal auch für Vim!',
      targetWpm: [25, 15],
      text: 'Jeder kluge Jäger kennt die Kraft der klaren Kälte; jung und kräftig klingt die Kunst.',
    },
    {
      id: '5-3',
      world: 5,
      title: 'Das Q und das @-Zeichen (q & @)',
      newKeys: ['q', 'Q', '@'],
      tip: 'Linker Mittelfinger nach unten auf Q (QWERTZ X). Mit AltGr + Q erzeugst du direkt das @-Zeichen!',
      targetWpm: [23, 14],
      text: 'Quelle und Qualität: Sende deine Anfrage ans Quartier unter post@quell-ort.de.',
    },
    {
      id: '5-4',
      world: 5,
      title: 'Die große Umlaut-Parade (Ä, Ö, Ü)',
      newKeys: ['ä', 'ö', 'ü', 'j', 'k', 'q'],
      tip: 'Alle drei Umlaute liegen auf der linken Seite (Ü oben, Ä und Ö unten) direkt bei den anderen Vokalen!',
      targetWpm: [26, 16],
      text: 'Fröhliche Jäger und kluge Könige durchqueren täglich die grünen Täler und schönen Höhen.',
    },

    /* ==================== WELT 6: UNTERE REIHE RECHTS & ß ==================== */
    {
      id: '6-1',
      world: 6,
      title: 'Unten Mitte: X, B und M (x b m)',
      newKeys: ['x', 'b', 'm'],
      tip: 'Linker Zeigefinger unten innen auf X (QWERTZ B). Rechter Zeigefinger unten auf B (QWERTZ N) und M (QWERTZ M).',
      targetWpm: [25, 15],
      text: 'Bäume, Blumen und bunte Bücher am blauen Meer; Mut, Musik und ein flinkes Taxi zur Box.',
    },
    {
      id: '6-2',
      world: 6,
      title: 'W und V unten rechts (w & v)',
      newKeys: ['w', 'v'],
      tip: 'Rechter Mittelfinger nach unten auf W (QWERTZ ,) und rechter Ringfinger nach unten auf V (QWERTZ .).',
      targetWpm: [26, 16],
      text: 'Wir wandern weit durch Wald und Wiesen, während viele Vögel über dem warmen Wasser schweben.',
    },
    {
      id: '6-3',
      world: 6,
      title: 'Scharfes ß, Fragezeichen & Backslash (ß ? \\)',
      newKeys: ['ß', '?', '\\'],
      tip: 'Das ß erreichst du blitzschnell mit AltGr + S (direkt auf der Grundreihe!) oder AltGr + \\. Fragezeichen ? und \\ liegen oben rechts neben P!',
      targetWpm: [23, 14],
      text: 'Wie heißt die große weiße Straße am Fluß? Warum macht fließendes Tippen Spaß? C:\\Weg\\Ziel',
    },
    {
      id: '6-4',
      world: 6,
      title: 'Pangramm-Krönung (Alle Buchstaben!)',
      newKeys: ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü', 'ß'],
      tip: 'Beide Sätze enthalten jeden einzelnen Buchstaben des deutschen Alphabets inklusive Ä, Ö, Ü und ß!',
      targetWpm: [28, 18],
      text: 'Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg.',
    },

    /* ==================== WELT 7: ZAHLEN & ARITHMETIK ==================== */
    {
      id: '7-1',
      world: 7,
      title: 'Zahlenreihe Links (1 2 3 4 5 & ! " § $ %)',
      newKeys: ['1', '2', '3', '4', '5', '!', '"', '$', '%'],
      tip: 'Die Zahlenreihe entspricht der gewohnten deutschen Belegung: 1 !, 2 ", 3 §, 4 $, 5 %.',
      targetWpm: [20, 12],
      text: '123 451 234 512! "Hallo Welt" kostet 45 $ mit 15 % Rabatt in § 3.',
    },
    {
      id: '7-2',
      world: 7,
      title: 'Zahlenreihe Rechts (6 7 8 9 0 & / ( ) =)',
      newKeys: ['6', '7', '8', '9', '0', '/', '(', ')', '='],
      tip: 'Mit Shift + 7/8/9/0 tippst du /, (, ) und =.',
      targetWpm: [20, 12],
      text: '678 906 (78 + 90) / 2 = 84 & (100 - 60) = 40.',
    },
    {
      id: '7-3',
      world: 7,
      title: 'Plus, Stern, Kleiner & Größer (+ * < >)',
      newKeys: ['+', '*', '<', '>'],
      tip: '+ und * liegen rechts neben der 0; < und > liegen unten rechts direkt vor der rechten Shift-Taste!',
      targetWpm: [20, 12],
      text: '3 * 4 + 8 = 20; 15 < 20 und 99 > 42; 7 * 8 + 4 = 60.',
    },
    {
      id: '7-4',
      world: 7,
      title: 'Zahlen- & Sonderzeichen-Sprint',
      newKeys: ['1', '5', '0', '+', '=', '(', ')'],
      tip: 'Halte die Grundreihe als Anker, damit deine Finger nach jedem Zahlensprung sicher zurückfinden.',
      targetWpm: [22, 14],
      text: 'Version 2.4 (Build #908): 128 GB RAM, 99 % Leistung bei 60 FPS + 0 Fehlern!',
    },

    /* ==================== WELT 8: CODE- & VIM-MEISTER AUF DVORAK ==================== */
    {
      id: '8-1',
      world: 8,
      title: 'Programmierer-Klammern ({ [ ] })',
      newKeys: ['{', '[', ']', '}'],
      tip: 'Mit AltGr + 7/8/9/0 erreichst du geschweifte { } und eckige [ ] Klammern.',
      targetWpm: [18, 11],
      text: 'const liste = [10, 20, 30]; const objekt = { aktiv: true, werte: [1, 2] };',
    },
    {
      id: '8-2',
      world: 8,
      title: 'Unix- & Vim-Symbole (| ~ ^ € µ)',
      newKeys: ['|', '~', '^', '€', 'µ'],
      tip: 'Pipe | liegt auf AltGr + < (oder AltGr + 5), Tilde ~ auf AltGr + . (oder AltGr + +), € auf AltGr + E!',
      targetWpm: [18, 11],
      text: 'cat ~/daten.txt | grep "^Preis: 50 €" && echo "Latenz: 12 µs"',
    },
    {
      id: '8-3',
      world: 8,
      title: 'Echter Code im Dvorak-Fluss',
      newKeys: ['(', ')', '{', '}', '=', ';'],
      tip: 'Beachte, wie angenehm = ; ( ) { } und _ auf Dvorak beim Programmieren ineinanderfließen.',
      targetWpm: [21, 13],
      text: 'function berechne_wert(anzahl) { return anzahl > 0 ? anzahl * 42 : 0; }',
    },
    {
      id: '8-4',
      world: 8,
      title: 'Die Dvorak-Großmeister-Prüfung',
      newKeys: ['Ä', 'Ö', 'Ü', 'ß', '{', '}', '@'],
      tip: 'Das große Finale über das gesamte deutsche Dvorak-Layout (Typ I)!',
      targetWpm: [25, 15],
      text: 'Großmeister-Status: "Übung macht den Dvorak-Meister!" { rang: #1, mail: "profi@dvorak.de", bonus: 100 % }',
    },
  ];

  /* ==================== METEOR-ABWEHR WORD POOLS ==================== */
  const METEOR_POOLS = {
    home: [
      'erde', 'reise', 'sonne', 'norden', 'orden', 'sand', 'rose', 'oase',
      'hund', 'uhr', 'ruhe', 'hand', 'rund', 'haus', 'insel', 'halle',
      'leise', 'leder', 'lieder', 'seele', 'eule', 'alle', 'rolle', 'seil',
    ],
    umlauts: [
      'Äpfel', 'Ähre', 'Ärger', 'Bär', 'spät', 'Täler', 'Jäger', 'Stärke',
      'Öl', 'Löwe', 'König', 'Höhe', 'schön', 'fröhlich', 'Österreich',
      'Über', 'Übung', 'grün', 'früh', 'kühl', 'Türme', 'spüren', 'Straße', 'groß', 'weiß', 'Spaß',
    ],
    all: [
      'Dvorak', 'Tastatur', 'Flugzeug', 'Horizont', 'Rhythmus', 'Qualität',
      'Freiheit', 'Abenteuer', 'Kristall', 'Sternbild', 'Geschwindigkeit',
      'Wissenschaft', 'Zauberwald', 'Meisterwerk', 'Augenblick', 'Schatzinsel',
    ],
    code: [
      'const', 'return', 'function', 'export', 'default', 'async', 'await',
      'array[0]', '{id:42}', 'a===b', 'x=>x*2', ':wq!', 'ci"neu"', ':%s/a/b/g',
    ],
  };

  /* ==================== 60s SPRINT TEXT PASSAGES ==================== */
  const SPRINT_TEXTS = [
    'Das deutsche Dvorak-Layout wurde speziell dafür entwickelt, die Fingerwege drastisch zu verkürzen. Während auf einer herkömmlichen Tastatur nur etwa ein Drittel aller Anschläge auf der Grundreihe stattfindet, liegen auf der Dvorak-Grundreihe alle fünf Grundvokale links und die häufigsten Konsonanten rechts. Dadurch wechseln sich linke und rechte Hand beim Schreiben fast wie beim Trommeln ab.',
    'Am frühen Morgen ziehen leise Nebelschwaden über die grünen Täler und kühlen Flüsse. Ein kluger Jäger prüft seine Ausrüstung, während hoch über den Baumwipfeln bereits die ersten Vögel durch die klare Luft gleiten. Wer regelmäßig blind mit zehn Fingern übt, merkt schon nach wenigen Tagen, wie die Buchstaben ganz von selbst fließen.',
    'Beim Programmieren und in Editoren wie Vim spielt Ergonomie eine entscheidende Rolle: Der Unterstrich liegt direkt rechts auf der Grundreihe, Komma, Punkt, Semikolon und Doppelpunkt warten oben links, und das scharfe ß ist ohne Verrenkung direkt unter dem rechten kleinen Finger erreichbar.',
  ];

  return {
    WORLDS,
    LEVELS,
    METEOR_POOLS,
    SPRINT_TEXTS,
  };
});
