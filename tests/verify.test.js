const test = require('node:test');
const assert = require('node:assert/strict');
const DvorakLayout = require('../web/js/dvorak-layout');
const { WORLDS, LEVELS, METEOR_POOLS, SPRINT_TEXTS } = require('../web/js/levels');

test('DvorakLayout maps all keys of the German Dvorak Type I layout accurately', () => {
  assert.equal(WORLDS.length, 8);
  assert.equal(LEVELS.length, 32);

  // Verify specific key positions of the German Dvorak Type I layout
  const ae = DvorakLayout.lookupChar('Ä');
  assert.ok(ae);
  assert.equal(ae.keyId, 'ä');
  assert.equal(ae.shift, true);
  assert.equal(ae.key.qwertz, '<');

  const oe = DvorakLayout.lookupChar('Ö');
  assert.equal(oe.keyId, 'ö');
  assert.equal(oe.key.qwertz, 'Y');

  const ue = DvorakLayout.lookupChar('Ü');
  assert.equal(ue.keyId, 'ü');
  assert.equal(ue.key.qwertz, 'Q');

  const p = DvorakLayout.lookupChar('p');
  assert.equal(p.keyId, 'p');
  assert.equal(p.key.qwertz, 'Ü');

  const hash = DvorakLayout.lookupChar('#');
  assert.equal(hash.keyId, '#');
  assert.equal(hash.key.qwertz, 'R');

  const ssharp = DvorakLayout.lookupChar('ß');
  assert.equal(ssharp.keyId, 's');
  assert.equal(ssharp.altgr, true);

  const less = DvorakLayout.lookupChar('<');
  assert.equal(less.keyId, '<');
  assert.equal(less.key.qwertz, '-');
});

test('Every single character across all 32 levels, Meteor pools, and Sprint texts is mapped in DvorakLayout', () => {
  for (const lvl of LEVELS) {
    assert.ok(lvl.text.length >= 30, `Level ${lvl.id} text should be substantial`);
    for (const ch of lvl.text) {
      const info = DvorakLayout.lookupChar(ch);
      assert.ok(info, `Unmapped character "${ch}" in Level ${lvl.id}`);
    }
  }

  for (const [poolName, words] of Object.entries(METEOR_POOLS)) {
    for (const w of words) {
      for (const ch of w) {
        assert.ok(DvorakLayout.lookupChar(ch), `Unmapped char "${ch}" in meteor pool ${poolName}`);
      }
    }
  }

  for (const passage of SPRINT_TEXTS) {
    for (const ch of passage) {
      assert.ok(DvorakLayout.lookupChar(ch), `Unmapped char "${ch}" in sprint text`);
    }
  }
});

test('Progressive curriculum check: Worlds 1–6 only use characters unlocked up to each lesson', () => {
  const unlocked = new Set([' ']);

  for (const lvl of LEVELS) {
    for (const k of lvl.newKeys) {
      unlocked.add(k);
      unlocked.add(k.toLowerCase());
      // Once Shift is introduced in 1-4, uppercase versions of unlocked letters are available
      if (lvl.id >= '1-4') {
        unlocked.add(k.toUpperCase());
      }
    }
    if (lvl.id === '1-4') {
      for (const existing of Array.from(unlocked)) {
        unlocked.add(existing.toUpperCase());
      }
    }

    if (lvl.world <= 6) {
      for (const ch of lvl.text) {
        assert.ok(
          unlocked.has(ch),
          `Level ${lvl.id} ("${lvl.title}") uses character "${ch}" before it was unlocked! Text: "${lvl.text}"`
        );
      }
    }
  }
});

