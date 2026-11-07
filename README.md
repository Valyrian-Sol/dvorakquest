# 🦅 DvorakQuest — Spielend die Deutsche Dvorak-Tastatur lernen

> **🤖 Hinweis (KI-Projekt):** Dieses Projekt wurde mithilfe künstlicher Intelligenz (KI-gestützte Entwicklung) konzipiert und erstellt.

**DvorakQuest** ist ein interaktives 10-Finger-Lernspiel für das **deutsche Dvorak-Layout (Typ I inklusive `Ä`, `Ö`, `Ü`, `ß`, `#`, `P`, `?` und `< >`)** — komplett ohne externe Abhängigkeiten im Browser spielbar.

---

## 🚀 Schnellstart

```bash
git clone <REPO-URL>
cd dvorakquest
./start.sh
```

*(Alternativ: `python3 dvorakquest.py` — startet einen lokalen Webserver, speichert deinen Fortschritt automatisch unter `data/progress.json` und öffnet DvorakQuest im Browser. Du kannst `web/index.html` auch direkt im Browser öffnen.)*

---

## 🎮 Die 4 Spielmodi

1. **🗺️ Kampagne (8 Welten · 32 Lektionen):**
   - Baut dein Muskelgedächtnis systematisch von innen nach außen auf:
     - **Welt 1 & 2:** Die komplette Dvorak-Grundreihe (`A O E I U` links, `H D R N S L -` rechts)
     - **Welt 3 & 4:** Obere Reihe rechts (`F G C T Z P`) & links (`, . ; : Ü Y # '`)
     - **Welt 5 & 6:** Untere Reihe links (`Ä Ö Q @ J K`) & rechts (`X B M W V ß ? \`) bis hin zu Pangrammen
     - **Welt 7 & 8:** Zahlenreihe, Arithmetik, Programmierer-Klammern (`{ [ ] } | ~`) & Code
   - Jede Lektion in den Welten 1–6 verwendet **ausschließlich Buchstaben, die bis dahin bereits eingeführt wurden**!
2. **☄️ Meteor-Abwehr (Arcade-Action):**
   - Verteidige die Stadt *Dvorakia* gegen herabstürzende Wort-Meteoriten in 4 wählbaren Stufen (*Nur Grundreihe*, *Fokus auf Ä/Ö/Ü/ß*, *Alle Wörter*, *Code & Vim*).
3. **⚡ 60-Sekunden-Sprint & Fehler-Heatmap:**
   - Miss deine WPM (Wörter pro Minute) und Genauigkeit an längeren Texten und sieh anschließend direkt auf der **Tastatur-Heatmap**, bei welchen Tasten du dich noch vertippst.
4. **🧭 Tasten-Radar:**
   - Schnelles Blind-Reflex-Training für einzelne Buchstaben, Umlaute und Sonderzeichen mit Reaktionszeit-Messung in Millisekunden.

---

## ✨ Besonderheiten

- **Farbcodiertes 10-Finger-System + Live-Finger-Coach:** Zeigt vor jedem Anschlag exakt an, welcher Finger zuständig ist und welche `Shift`-Taste (jeweils die gegenüberliegende Hand) oder `AltGr`-Taste gedrückt wird.
- **Rote QWERTZ-Positionsgravur (ein-/ausblendbar):** Blendet optional unten rechts auf jeder Taste in Rot die physische deutsche ISO-QWERTZ-Position zur Orientierung ein.
- **Integrierter `QWERTZ → Dvorak`-Emulator:** Selbst wenn das Betriebssystem noch auf Standard-QWERTZ eingestellt ist, lässt sich oben rechts per Klick der **Emulator** aktivieren, um sofort Deutsch-Dvorak zu trainieren.

---

## 🧪 Automatische Tests ausführen

```bash
node --test tests/verify.test.js
```
