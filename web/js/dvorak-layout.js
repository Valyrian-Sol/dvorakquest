/**
 * DvorakQuest — Deutsches Dvorak-Layout (Typ I)
 * Inklusive 10-Finger-Zuordnung, Ruhepositionen, roter QWERTZ-Positionsgravur,
 * Shift-/AltGr-Auflösung und optionalem Hardware-Keycode-Emulator (e.code -> Dvorak).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DvorakLayout = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const FINGERS = {
    L_PINKY: { id: 'L_PINKY', hand: 'L', name: 'Linker kleiner Finger', home: 'A (QWERTZ A)', color: '#f472b6' },
    L_RING: { id: 'L_RING', hand: 'L', name: 'Linker Ringfinger', home: 'O (QWERTZ S)', color: '#fb923c' },
    L_MIDDLE: { id: 'L_MIDDLE', hand: 'L', name: 'Linker Mittelfinger', home: 'E (QWERTZ D)', color: '#fbbf24' },
    L_INDEX: { id: 'L_INDEX', hand: 'L', name: 'Linker Zeigefinger', home: 'I (QWERTZ F)', color: '#34d399' },
    THUMB: { id: 'THUMB', hand: 'T', name: 'Daumen', home: 'Leertaste', color: '#94a3b8' },
    R_INDEX: { id: 'R_INDEX', hand: 'R', name: 'Rechter Zeigefinger', home: 'D (QWERTZ J)', color: '#38bdf8' },
    R_MIDDLE: { id: 'R_MIDDLE', hand: 'R', name: 'Rechter Mittelfinger', home: 'R (QWERTZ K)', color: '#818cf8' },
    R_RING: { id: 'R_RING', hand: 'R', name: 'Rechter Ringfinger', home: 'N (QWERTZ L)', color: '#a78bfa' },
    R_PINKY: { id: 'R_PINKY', hand: 'R', name: 'Rechter kleiner Finger', home: 'S (QWERTZ Ö)', color: '#f87171' },
  };

  /**
   * Vollständige Tasten-Matrix des deutschen Dvorak-Layouts (Typ I)
   * qwertz = rote kleine Beschriftung der physischen deutschen ISO-Taste
   */
  const ROWS = [
    // Reihe 1: Zahlenreihe
    [
      { id: '^', code: 'Backquote', normal: '^', shift: '°', finger: 'L_PINKY', qwertz: '^' },
      { id: '1', code: 'Digit1', normal: '1', shift: '!', altgr: '£', finger: 'L_PINKY', qwertz: '1' },
      { id: '2', code: 'Digit2', normal: '2', shift: '"', altgr: '²', finger: 'L_RING', qwertz: '2' },
      { id: '3', code: 'Digit3', normal: '3', shift: '§', altgr: '³', finger: 'L_MIDDLE', qwertz: '3' },
      { id: '4', code: 'Digit4', normal: '4', shift: '$', finger: 'L_INDEX', qwertz: '4' },
      { id: '5', code: 'Digit5', normal: '5', shift: '%', altgr: '|', finger: 'L_INDEX', qwertz: '5' },
      { id: '6', code: 'Digit6', normal: '6', shift: '&', altgr: '¦', finger: 'R_INDEX', qwertz: '6' },
      { id: '7', code: 'Digit7', normal: '7', shift: '/', altgr: '{', finger: 'R_INDEX', qwertz: '7' },
      { id: '8', code: 'Digit8', normal: '8', shift: '(', altgr: '[', finger: 'R_MIDDLE', qwertz: '8' },
      { id: '9', code: 'Digit9', normal: '9', shift: ')', altgr: ']', finger: 'R_RING', qwertz: '9' },
      { id: '0', code: 'Digit0', normal: '0', shift: '=', altgr: '}', finger: 'R_PINKY', qwertz: '0' },
      { id: '+', code: 'Minus', normal: '+', shift: '*', altgr: '~', finger: 'R_PINKY', qwertz: 'ß' },
      { id: '´', code: 'Equal', normal: '´', shift: '`', finger: 'R_PINKY', qwertz: '´' },
      { id: 'Backspace', code: 'Backspace', label: '⌫ Backspace', finger: 'R_PINKY', wide: 'w-20', special: true },
    ],
    // Reihe 2: Obere Buchstabenreihe
    [
      { id: 'Tab', code: 'Tab', label: 'Tab ⇥', finger: 'L_PINKY', wide: 'w-14', special: true },
      { id: 'ü', code: 'KeyQ', normal: 'ü', shift: 'Ü', finger: 'L_PINKY', qwertz: 'Q' },
      { id: ',', code: 'KeyW', normal: ',', shift: ';', altgr: '¨', finger: 'L_RING', qwertz: 'W' },
      { id: '.', code: 'KeyE', normal: '.', shift: ':', altgr: '~', finger: 'L_MIDDLE', qwertz: 'E' },
      { id: '#', code: 'KeyR', normal: '#', shift: "'", finger: 'L_INDEX', qwertz: 'R' },
      { id: 'y', code: 'KeyT', normal: 'y', shift: 'Y', finger: 'L_INDEX', qwertz: 'T' },
      { id: 'f', code: 'KeyY', normal: 'f', shift: 'F', finger: 'R_INDEX', qwertz: 'Z' },
      { id: 'g', code: 'KeyU', normal: 'g', shift: 'G', finger: 'R_INDEX', qwertz: 'U' },
      { id: 'c', code: 'KeyI', normal: 'c', shift: 'C', finger: 'R_MIDDLE', qwertz: 'I' },
      { id: 't', code: 'KeyO', normal: 't', shift: 'T', finger: 'R_RING', qwertz: 'O' },
      { id: 'z', code: 'KeyP', normal: 'z', shift: 'Z', finger: 'R_PINKY', qwertz: 'P' },
      { id: 'p', code: 'BracketLeft', normal: 'p', shift: 'P', finger: 'R_PINKY', qwertz: 'Ü' },
      { id: '\\', code: 'BracketRight', normal: '\\', shift: '?', altgr: 'ß', finger: 'R_PINKY', qwertz: '+' },
    ],
    // Reihe 3: Grundreihe (Home Row)
    [
      { id: 'CapsLock', code: 'CapsLock', label: 'Caps', finger: 'L_PINKY', wide: 'w-16', special: true },
      { id: 'a', code: 'KeyA', normal: 'a', shift: 'A', finger: 'L_PINKY', qwertz: 'A', homeRow: true },
      { id: 'o', code: 'KeyS', normal: 'o', shift: 'O', finger: 'L_RING', qwertz: 'S', homeRow: true },
      { id: 'e', code: 'KeyD', normal: 'e', shift: 'E', altgr: '€', finger: 'L_MIDDLE', qwertz: 'D', homeRow: true },
      { id: 'i', code: 'KeyF', normal: 'i', shift: 'I', finger: 'L_INDEX', qwertz: 'F', homeRow: true, bump: true },
      { id: 'u', code: 'KeyG', normal: 'u', shift: 'U', finger: 'L_INDEX', qwertz: 'G', homeRow: true },
      { id: 'h', code: 'KeyH', normal: 'h', shift: 'H', finger: 'R_INDEX', qwertz: 'H', homeRow: true },
      { id: 'd', code: 'KeyJ', normal: 'd', shift: 'D', finger: 'R_INDEX', qwertz: 'J', homeRow: true, bump: true },
      { id: 'r', code: 'KeyK', normal: 'r', shift: 'R', finger: 'R_MIDDLE', qwertz: 'K', homeRow: true },
      { id: 'n', code: 'KeyL', normal: 'n', shift: 'N', finger: 'R_RING', qwertz: 'L', homeRow: true },
      { id: 's', code: 'Semicolon', normal: 's', shift: 'S', altgr: 'ß', finger: 'R_PINKY', qwertz: 'Ö', homeRow: true },
      { id: 'l', code: 'Quote', normal: 'l', shift: 'L', finger: 'R_PINKY', qwertz: 'Ä', homeRow: true },
      { id: '-', code: 'Backslash', normal: '-', shift: '_', altgr: '¬', finger: 'R_PINKY', qwertz: '#', homeRow: true },
      { id: 'Enter', code: 'Enter', label: '⏎ Enter', finger: 'R_PINKY', wide: 'w-16', special: true },
    ],
    // Reihe 4: Untere Buchstabenreihe
    [
      { id: 'ShiftLeft', code: 'ShiftLeft', label: '⇧ Shift', finger: 'L_PINKY', wide: 'w-14', special: true },
      { id: 'ä', code: 'IntlBackslash', normal: 'ä', shift: 'Ä', finger: 'L_PINKY', qwertz: '<' },
      { id: 'ö', code: 'KeyZ', normal: 'ö', shift: 'Ö', finger: 'L_RING', qwertz: 'Y' },
      { id: 'q', code: 'KeyX', normal: 'q', shift: 'Q', altgr: '@', finger: 'L_MIDDLE', qwertz: 'X' },
      { id: 'j', code: 'KeyC', normal: 'j', shift: 'J', finger: 'L_INDEX', qwertz: 'C' },
      { id: 'k', code: 'KeyV', normal: 'k', shift: 'K', finger: 'L_INDEX', qwertz: 'V' },
      { id: 'x', code: 'KeyB', normal: 'x', shift: 'X', finger: 'L_INDEX', qwertz: 'B' },
      { id: 'b', code: 'KeyN', normal: 'b', shift: 'B', finger: 'R_INDEX', qwertz: 'N' },
      { id: 'm', code: 'KeyM', normal: 'm', shift: 'M', altgr: 'µ', finger: 'R_INDEX', qwertz: 'M' },
      { id: 'w', code: 'Comma', normal: 'w', shift: 'W', finger: 'R_MIDDLE', qwertz: ',' },
      { id: 'v', code: 'Period', normal: 'v', shift: 'V', finger: 'R_RING', qwertz: '.' },
      { id: '<', code: 'Slash', normal: '<', shift: '>', altgr: '|', finger: 'R_PINKY', qwertz: '-' },
      { id: 'ShiftRight', code: 'ShiftRight', label: '⇧ Shift', finger: 'R_PINKY', wide: 'w-20', special: true },
    ],
    // Reihe 5: Leertasten-Reihe
    [
      { id: 'CtrlLeft', code: 'ControlLeft', label: 'Strg', finger: 'L_PINKY', wide: 'w-14', special: true },
      { id: 'AltLeft', code: 'AltLeft', label: 'Alt', finger: 'THUMB', wide: 'w-14', special: true },
      { id: 'Space', code: 'Space', normal: ' ', shift: ' ', label: 'Leertaste', finger: 'THUMB', wide: 'w-space' },
      { id: 'AltGr', code: 'AltRight', label: 'Alt Gr', finger: 'THUMB', wide: 'w-16', special: true },
      { id: 'CtrlRight', code: 'ControlRight', label: 'Strg', finger: 'R_PINKY', wide: 'w-14', special: true },
    ],
  ];

  // Build fast lookup maps
  const CHAR_MAP = new Map();
  const CODE_MAP = new Map();
  const KEY_BY_ID = new Map();

  for (const row of ROWS) {
    for (const key of row) {
      KEY_BY_ID.set(key.id, key);
      if (key.code) CODE_MAP.set(key.code, key);

      const fingerInfo = FINGERS[key.finger];
      // Opposite-hand Shift rule for ergonomic 10-finger typing
      const shiftKeyId = fingerInfo && fingerInfo.hand === 'L' ? 'ShiftRight' : 'ShiftLeft';

      if (key.normal && !CHAR_MAP.has(key.normal)) {
        CHAR_MAP.set(key.normal, {
          char: key.normal,
          keyId: key.id,
          key,
          shift: false,
          shiftKeyId: null,
          altgr: false,
          finger: fingerInfo,
        });
      }
      if (key.shift && !CHAR_MAP.has(key.shift)) {
        CHAR_MAP.set(key.shift, {
          char: key.shift,
          keyId: key.id,
          key,
          shift: true,
          shiftKeyId,
          altgr: false,
          finger: fingerInfo,
        });
      }
      if (key.altgr && (!CHAR_MAP.has(key.altgr) || key.homeRow)) {
        CHAR_MAP.set(key.altgr, {
          char: key.altgr,
          keyId: key.id,
          key,
          shift: false,
          shiftKeyId: null,
          altgr: true,
          finger: fingerInfo,
        });
      }
    }
  }

  function lookupChar(ch) {
    return CHAR_MAP.get(ch) || null;
  }

  /**
   * Emulates German Dvorak Type I from physical hardware keycode (e.code)
   * when user chooses "QWERTZ -> Dvorak Emulator" mode!
   */
  function emulateFromHardwareEvent(e) {
    const keyDef = CODE_MAP.get(e.code);
    if (!keyDef || keyDef.special) return null;

    const isAltGr =
      (e.getModifierState && e.getModifierState('AltGraph')) ||
      (e.ctrlKey && e.altKey);

    if (isAltGr && keyDef.altgr) {
      return keyDef.altgr;
    }
    // Bonus fallback matching our ~/.config/xkb/symbols/de: AltGr+A -> ä/Ä, AltGr+O -> ö/Ö
    if (isAltGr && keyDef.id === 'a') return e.shiftKey ? 'Ä' : 'ä';
    if (isAltGr && keyDef.id === 'o') return e.shiftKey ? 'Ö' : 'ö';

    if (e.shiftKey && keyDef.shift) {
      return keyDef.shift;
    }
    return keyDef.normal || null;
  }

  return {
    FINGERS,
    ROWS,
    CHAR_MAP,
    CODE_MAP,
    KEY_BY_ID,
    lookupChar,
    emulateFromHardwareEvent,
  };
});
