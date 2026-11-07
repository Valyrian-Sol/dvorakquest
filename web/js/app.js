/**
 * DvorakQuest — Main Application Controller
 * Features: 32-Level Progressive Campaign, Meteor-Defense Canvas Arcade,
 * 60s WPM Sprint with Live Error Heatmap, and Key-Radar Reflex Trainer.
 */
(function () {
  'use strict';

  const DvorakLayout = window.DvorakLayout;
  const { WORLDS, LEVELS, METEOR_POOLS, SPRINT_TEXTS } = window.DvorakLevels;
  const AudioFX = window.DvorakAudio;

  const STORAGE_KEY = 'dvorakquest_progress_v1';

  const RANKS = [
    { minXp: 0, title: 'Grundreihen-Novize' },
    { minXp: 300, title: 'Vokal-Hüter' },
    { minXp: 800, title: 'Zehn-Finger-Wanderer' },
    { minXp: 1500, title: 'Umlaut-Bändiger' },
    { minXp: 2500, title: 'Rhythmus-Schmied' },
    { minXp: 3600, title: 'Blitz-Tipper' },
    { minXp: 4800, title: 'Dvorak-Großmeister' },
  ];

  const state = {
    activeTab: 'campaign',
    currentLevelId: '1-1',
    victoryOpen: false,
    progress: {
      starsByLevel: {},
      bestWpmByLevel: {},
      xp: 0,
      meteorBest: 0,
      sprintBestWpm: 0,
      emulateDvorak: false, // false = OS is already German Dvorak; true = translate physical QWERTZ keycodes
      showQwertzGhost: true,
      sound: true,
    },

    // Campaign typing state
    lesson: {
      text: '',
      index: 0,
      startedAt: 0,
      totalKeystrokes: 0,
      errors: 0,
      flawedIndices: new Set(),
      errorFlash: false,
    },

    // Meteor defense state
    meteor: {
      active: false,
      lives: 5,
      score: 0,
      wave: 1,
      spawnedInWave: 0,
      meteors: [],
      lasers: [],
      lockedId: null,
      lastSpawn: 0,
      animId: null,
    },

    // 60s Sprint state
    sprint: {
      active: false,
      text: '',
      index: 0,
      startedAt: 0,
      timeLeft: 60.0,
      totalKeystrokes: 0,
      errors: 0,
      flawedIndices: new Set(),
      heatmapErrors: {}, // keyId -> error count
      timerId: null,
    },

    // Radar state
    radar: {
      targetChar: 'Ä',
      streak: 0,
      askedAt: 0,
    },
  };

  /* ==================== PARTICLES ==================== */
  const pCanvas = document.getElementById('particle-canvas');
  const pCtx = pCanvas.getContext('2d');
  const particles = [];
  let pAnimId = null;

  function resizeParticleCanvas() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeParticleCanvas);
  resizeParticleCanvas();

  function spawnParticles(x, y, color = '#34d399', count = 20) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1.5 + Math.random() * 5;
      particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.2,
        size: 2.5 + Math.random() * 3,
        alpha: 1,
        color,
      });
    }
    if (!pAnimId) pAnimId = requestAnimationFrame(stepParticles);
  }

  function stepParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.13;
      p.alpha -= 0.025;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
      pCtx.globalAlpha = p.alpha;
      pCtx.fillStyle = p.color;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      pCtx.fill();
    }
    pCtx.globalAlpha = 1;
    pAnimId = particles.length > 0 ? requestAnimationFrame(stepParticles) : null;
  }

  /* ==================== PERSISTENCE ==================== */
  function loadLocalProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) mergeProgress(JSON.parse(raw));
    } catch (_) {}
  }

  function mergeProgress(inc) {
    if (!inc || typeof inc !== 'object') return;
    if (inc.starsByLevel) {
      for (const [k, v] of Object.entries(inc.starsByLevel)) {
        state.progress.starsByLevel[k] = Math.max(state.progress.starsByLevel[k] || 0, Number(v) || 0);
      }
    }
    if (inc.bestWpmByLevel) {
      for (const [k, v] of Object.entries(inc.bestWpmByLevel)) {
        state.progress.bestWpmByLevel[k] = Math.max(state.progress.bestWpmByLevel[k] || 0, Number(v) || 0);
      }
    }
    if (typeof inc.xp === 'number') state.progress.xp = Math.max(state.progress.xp, inc.xp);
    if (typeof inc.meteorBest === 'number') state.progress.meteorBest = Math.max(state.progress.meteorBest, inc.meteorBest);
    if (typeof inc.sprintBestWpm === 'number') state.progress.sprintBestWpm = Math.max(state.progress.sprintBestWpm, inc.sprintBestWpm);
    if (typeof inc.emulateDvorak === 'boolean') state.progress.emulateDvorak = inc.emulateDvorak;
    if (typeof inc.showQwertzGhost === 'boolean') state.progress.showQwertzGhost = inc.showQwertzGhost;
    if (typeof inc.sound === 'boolean') state.progress.sound = inc.sound;
    if (inc.lastLevelId && LEVELS.some((l) => l.id === inc.lastLevelId)) {
      state.currentLevelId = inc.lastLevelId;
    }
  }

  async function syncServerProgress() {
    if (location.protocol === 'file:') return;
    try {
      const res = await fetch('/api/progress');
      if (res.ok) {
        mergeProgress(await res.json());
        applySettingsToUI();
        renderHeaderStats();
        renderSidebar();
        loadCampaignLevel(state.currentLevelId);
      }
    } catch (_) {}
  }

  function saveProgress() {
    state.progress.lastLevelId = state.currentLevelId;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
    } catch (_) {}
    if (location.protocol !== 'file:') {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.progress),
      }).catch(() => {});
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ==================== KEYBOARD & 10-FINGER RENDERER ==================== */
  function renderKeyboardHTML(containerEl, targetChar = null, heatmap = null) {
    if (!containerEl) return;
    const info = targetChar ? DvorakLayout.lookupChar(targetChar) : null;
    const highlightKeyId = info ? info.keyId : null;
    const highlightShiftId = info && info.shift ? info.shiftKeyId : null;
    const highlightAltGr = info && info.altgr ? 'AltGr' : null;

    containerEl.classList.toggle('hide-qwertz-ghost', !state.progress.showQwertzGhost);

    const rowsHtml = DvorakLayout.ROWS.map((row) => {
      const keysHtml = row
        .map((k) => {
          const cls = ['dq-key'];
          if (k.wide) cls.push(k.wide);
          if (k.homeRow) cls.push('home-row');
          if (k.bump) cls.push('bump');
          if (k.id === highlightKeyId) cls.push('next-target');
          if (k.id === highlightShiftId || k.id === highlightAltGr) cls.push('next-modifier');

          const fingerColor = DvorakLayout.FINGERS[k.finger]?.color || '#64748b';
          let heatStyle = '';
          if (heatmap && heatmap[k.id]) {
            const intensity = Math.min(0.75, heatmap[k.id] * 0.18);
            heatStyle = `background: rgba(244, 63, 94, ${intensity}); border-color: #fb7185;`;
          }

          if (k.special) {
            return `
              <div class="${cls.join(' ')}" data-key-id="${escapeHtml(k.id)}" style="${heatStyle}">
                <div class="dq-key-top"></div>
                <div class="dq-key-main" style="font-size:0.74rem">${escapeHtml(k.label)}</div>
                <div class="dq-key-bottom"><span class="dq-finger-bar" style="background:${fingerColor}"></span></div>
              </div>
            `;
          }

          const shiftTxt = k.shift && k.shift !== k.normal.toUpperCase() ? k.shift : '';
          const altgrTxt = k.altgr || '';
          const mainLabel = k.label || k.normal.toUpperCase();
          const ghostTxt = k.qwertz || '';

          return `
            <div class="${cls.join(' ')}" data-key-id="${escapeHtml(k.id)}" style="${heatStyle}">
              <div class="dq-key-top">
                <span>${escapeHtml(shiftTxt)}</span>
                <span class="dq-key-altgr">${escapeHtml(altgrTxt)}</span>
              </div>
              <div class="dq-key-main">${escapeHtml(mainLabel)}</div>
              <div class="dq-key-bottom">
                <span class="dq-finger-bar" style="background:${fingerColor}"></span>
                <span class="dq-qwertz-ghost" title="Physische QWERTZ-Position: ${escapeHtml(ghostTxt)}">${escapeHtml(ghostTxt)}</span>
              </div>
            </div>
          `;
        })
        .join('');
      return `<div class="dq-kb-row">${keysHtml}</div>`;
    }).join('');

    containerEl.innerHTML = rowsHtml;
  }

  function renderHandsLegend(containerEl, targetChar = null) {
    if (!containerEl) return;
    const info = targetChar ? DvorakLayout.lookupChar(targetChar) : null;
    const activeFingerId = info && info.finger ? info.finger.id : null;

    const order = [
      'L_PINKY',
      'L_RING',
      'L_MIDDLE',
      'L_INDEX',
      'THUMB',
      'R_INDEX',
      'R_MIDDLE',
      'R_RING',
      'R_PINKY',
    ];

    containerEl.innerHTML = order
      .map((fId) => {
        const f = DvorakLayout.FINGERS[fId];
        const activeCls = fId === activeFingerId ? 'active-finger' : '';
        return `
          <div class="dq-finger-pill ${activeCls}" style="border-color:${f.color}">
            <span class="dq-coach-dot" style="background:${f.color}"></span>
            <span>${escapeHtml(f.name)}</span>
          </div>
        `;
      })
      .join('');
  }

  function describeKeyInstruction(ch) {
    if (!ch) return 'Lektion abgeschlossen!';
    if (ch === ' ') return 'Drücke die Leertaste (Daumen)';
    const info = DvorakLayout.lookupChar(ch);
    if (!info) return `Tippe "${ch}"`;
    const parts = [`Nächste Taste: „${ch}“`, info.finger.name];
    if (info.key.qwertz) {
      parts.push(`Position: QWERTZ-${info.key.qwertz}`);
    }
    if (info.shift) {
      parts.push(
        info.shiftKeyId === 'ShiftRight' ? '+ Rechts-Shift' : '+ Links-Shift'
      );
    }
    if (info.altgr) {
      parts.push('+ AltGr');
    }
    return parts.join('  ·  ');
  }

  /* ==================== UI SETTINGS & STATS ==================== */
  function applySettingsToUI() {
    AudioFX.enabled = state.progress.sound;
    document.getElementById('sound-toggle').textContent = state.progress.sound ? '🔊' : '🔇';

    const emuBtn = document.getElementById('emulate-toggle');
    const emuLbl = document.getElementById('emulate-label');
    if (state.progress.emulateDvorak) {
      emuLbl.textContent = 'Emulator (QWERTZ→Dvorak)';
      emuBtn.classList.add('active-mode');
    } else {
      emuLbl.textContent = 'OS = Dvorak';
      emuBtn.classList.remove('active-mode');
    }

    const qBtn = document.getElementById('qwertz-hint-toggle');
    qBtn.classList.toggle('active-mode', state.progress.showQwertzGhost);

    document.getElementById('meteor-best').textContent = String(state.progress.meteorBest);
    document.getElementById('sprint-best').textContent = `${state.progress.sprintBestWpm} WPM`;

    renderCampaignKeyboardAndCoach();
    renderSprintView();
    renderRadarView();
  }

  function renderHeaderStats() {
    const stars = Object.values(state.progress.starsByLevel).reduce((a, b) => a + b, 0);
    document.getElementById('total-stars').textContent = String(stars);
    document.getElementById('total-xp').textContent = String(state.progress.xp);

    let rank = RANKS[0].title;
    for (const r of RANKS) {
      if (state.progress.xp >= r.minXp) rank = r.title;
    }
    document.getElementById('rank-label').textContent = `Rang: ${rank}`;
  }

  /* ==================== TAB 1: CAMPAIGN ==================== */
  function renderSidebar() {
    const sb = document.getElementById('world-sidebar');
    sb.innerHTML = WORLDS.map((w) => {
      const wLevels = LEVELS.filter((l) => l.world === w.id);
      const earned = wLevels.reduce((s, l) => s + (state.progress.starsByLevel[l.id] || 0), 0);
      const items = wLevels
        .map((l) => {
          const st = state.progress.starsByLevel[l.id] || 0;
          const starHtml = '★'.repeat(st) + `<span class="empty">${'★'.repeat(3 - st)}</span>`;
          const act = l.id === state.currentLevelId ? 'active' : '';
          return `
            <button class="dq-lvl-item ${act}" data-level-id="${l.id}">
              <span><strong>${l.id}</strong> ${escapeHtml(l.title)}</span>
              <span class="dq-lvl-stars">${starHtml}</span>
            </button>
          `;
        })
        .join('');
      return `
        <div class="dq-world-group">
          <div class="dq-world-header" style="color:${w.color}">
            <span>${w.icon} Welt ${w.id}: ${escapeHtml(w.name)}</span>
            <span class="dq-muted">${earned}/${wLevels.length * 3}★</span>
          </div>
          <div>${items}</div>
        </div>
      `;
    }).join('');

    sb.querySelectorAll('.dq-lvl-item').forEach((btn) => {
      btn.addEventListener('click', () => loadCampaignLevel(btn.dataset.levelId));
    });
  }

  function loadCampaignLevel(levelId) {
    const lvl = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    state.currentLevelId = lvl.id;
    state.victoryOpen = false;
    document.getElementById('victory-modal').classList.add('hidden');

    const world = WORLDS.find((w) => w.id === lvl.world);
    document.getElementById('lvl-world-badge').textContent = `${world ? world.icon + ' Welt ' + world.id : ''} · Lektion ${lvl.id}`;
    document.getElementById('lvl-title').textContent = lvl.title;
    document.getElementById('lvl-tip').textContent = lvl.tip;
    document.getElementById('lvl-target-wpm').textContent = `≥ ${lvl.targetWpm[0]} WPM`;

    document.getElementById('lvl-newkeys').innerHTML =
      '<span class="dq-muted" style="font-size:0.78rem">Fokus-Tasten:</span>' +
      lvl.newKeys.map((k) => `<span class="dq-key-pill">${escapeHtml(k)}</span>`).join('');

    state.lesson = {
      text: lvl.text,
      index: 0,
      startedAt: 0,
      totalKeystrokes: 0,
      errors: 0,
      flawedIndices: new Set(),
      errorFlash: false,
    };

    renderSidebar();
    renderCampaignStream();
    renderCampaignMetrics();
    renderCampaignKeyboardAndCoach();
    saveProgress();
  }

  function renderCampaignStream() {
    const { text, index, flawedIndices, errorFlash } = state.lesson;
    const streamEl = document.getElementById('text-stream');

    let html = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i] === ' ' ? '\u00A0' : escapeHtml(text[i]);
      const cls = ['dq-char'];
      if (i < index) {
        cls.push(flawedIndices.has(i) ? 'flawed' : 'done');
      } else if (i === index) {
        cls.push('current');
        if (errorFlash) cls.push('error-flash');
      }
      html += `<span class="${cls.join(' ')}">${ch}</span>`;
    }
    streamEl.innerHTML = html;

    const pct = text.length > 0 ? Math.round((index / text.length) * 100) : 0;
    document.getElementById('lvl-progress-fill').style.width = `${pct}%`;
  }

  function computeWpmAndAcc(charsTyped, startedAt, totalKeystrokes, errors) {
    const elapsedMin = startedAt > 0 ? Math.max(0.02, (performance.now() - startedAt) / 60000) : 0;
    const wpm = startedAt > 0 ? Math.round(charsTyped / 5 / elapsedMin) : 0;
    const acc =
      totalKeystrokes > 0
        ? Math.max(0, Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100))
        : 100;
    return { wpm, acc };
  }

  function renderCampaignMetrics() {
    const l = state.lesson;
    const { wpm, acc } = computeWpmAndAcc(l.index, l.startedAt, l.totalKeystrokes, l.errors);
    document.getElementById('live-wpm').textContent = `${wpm} WPM`;
    document.getElementById('live-acc').textContent = `${acc}%`;
  }

  function renderCampaignKeyboardAndCoach() {
    const nextChar = state.lesson.text[state.lesson.index] || null;
    document.getElementById('finger-coach').textContent = describeKeyInstruction(nextChar);
    renderKeyboardHTML(document.getElementById('main-keyboard'), nextChar);
    renderHandsLegend(document.getElementById('main-hands-bar'), nextChar);
  }

  function handleCampaignChar(typedChar) {
    const l = state.lesson;
    if (l.index >= l.text.length) return;

    if (l.startedAt === 0) l.startedAt = performance.now();
    l.totalKeystrokes++;

    const expected = l.text[l.index];
    if (typedChar === expected) {
      l.errorFlash = false;
      l.index++;
      if (expected === ' ') AudioFX.wordDone();
      else AudioFX.keyHit();

      renderCampaignStream();
      renderCampaignMetrics();
      renderCampaignKeyboardAndCoach();

      if (l.index >= l.text.length) {
        completeCampaignLevel();
      }
    } else {
      l.errors++;
      l.flawedIndices.add(l.index);
      l.errorFlash = true;
      AudioFX.error();
      const card = document.getElementById('typing-card');
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
      renderCampaignStream();
      renderCampaignMetrics();
    }
  }

  function completeCampaignLevel() {
    const lvl = LEVELS.find((x) => x.id === state.currentLevelId) || LEVELS[0];
    const l = state.lesson;
    const { wpm, acc } = computeWpmAndAcc(l.index, l.startedAt, l.totalKeystrokes, l.errors);

    let stars = 1;
    if (acc >= 95 && wpm >= lvl.targetWpm[0]) stars = 3;
    else if (acc >= 90 && wpm >= lvl.targetWpm[1]) stars = 2;

    const prevStars = state.progress.starsByLevel[lvl.id] || 0;
    const starDiff = Math.max(0, stars - prevStars);
    const xpGain = 50 + stars * 35 + starDiff * 40;

    state.progress.starsByLevel[lvl.id] = Math.max(prevStars, stars);
    state.progress.bestWpmByLevel[lvl.id] = Math.max(
      state.progress.bestWpmByLevel[lvl.id] || 0,
      wpm
    );
    state.progress.xp += xpGain;
    state.victoryOpen = true;

    saveProgress();
    renderHeaderStats();
    renderSidebar();

    AudioFX.victory(stars);
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2 - 40, '#34d399', 40);
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2 - 40, '#fbbf24', 28);

    document.getElementById('modal-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('modal-title').textContent =
      stars === 3 ? 'Meisterhaft getippt!' : 'Lektion abgeschlossen!';
    document.getElementById('modal-stats').textContent =
      `${wpm} WPM · ${acc}% Genauigkeit (Gold-Ziel: ≥ ${lvl.targetWpm[0]} WPM & ≥ 95%)`;
    document.getElementById('modal-xp').textContent = `+${xpGain} XP`;
    document.getElementById('victory-modal').classList.remove('hidden');
  }

  function advanceToNextLevel() {
    const idx = LEVELS.findIndex((l) => l.id === state.currentLevelId);
    const next = LEVELS[(idx + 1) % LEVELS.length];
    loadCampaignLevel(next.id);
  }

  /* ==================== TAB 2: METEOR-ABWEHR (ARCADE) ==================== */
  const mCanvas = document.getElementById('meteor-canvas');
  const mCtx = mCanvas.getContext('2d');

  function startMeteorGame() {
    cancelAnimationFrame(state.meteor.animId);
    state.meteor = {
      active: true,
      lives: 5,
      score: 0,
      wave: 1,
      spawnedInWave: 0,
      meteors: [],
      lasers: [],
      lockedId: null,
      lastSpawn: performance.now() - 1200,
      animId: null,
    };
    document.getElementById('meteor-overlay').classList.add('hidden');
    updateMeteorHUD();
    state.meteor.animId = requestAnimationFrame(stepMeteorArena);
  }

  function updateMeteorHUD() {
    document.getElementById('meteor-lives').textContent =
      '❤️'.repeat(Math.max(0, state.meteor.lives)) +
      '🖤'.repeat(Math.max(0, 5 - state.meteor.lives));
    document.getElementById('meteor-score').textContent = String(state.meteor.score);
    document.getElementById('meteor-wave').textContent = String(state.meteor.wave);
    document.getElementById('meteor-best').textContent = String(
      Math.max(state.progress.meteorBest, state.meteor.score)
    );
  }

  function spawnMeteor() {
    const poolKey = document.getElementById('meteor-pool-select').value || 'all';
    const pool = METEOR_POOLS[poolKey] || METEOR_POOLS.all;
    const word = pool[Math.floor(Math.random() * pool.length)];
    const x = 90 + Math.random() * (mCanvas.width - 180);
    const speed = 0.38 + Math.min(0.85, state.meteor.wave * 0.07) + Math.random() * 0.18;

    state.meteor.meteors.push({
      id: Math.random().toString(36).slice(2),
      word,
      typedLen: 0,
      x,
      y: -20,
      speed,
    });
    state.meteor.spawnedInWave++;
    if (state.meteor.spawnedInWave % 8 === 0) {
      state.meteor.wave++;
      updateMeteorHUD();
    }
  }

  function stepMeteorArena(now) {
    if (!state.meteor.active) return;

    const spawnInterval = Math.max(950, 2200 - state.meteor.wave * 110);
    if (now - state.meteor.lastSpawn > spawnInterval && state.meteor.meteors.length < 7) {
      spawnMeteor();
      state.meteor.lastSpawn = now;
    }

    mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);

    // Draw shield line & turret
    mCtx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    mCtx.lineWidth = 2;
    mCtx.beginPath();
    mCtx.moveTo(0, mCanvas.height - 28);
    mCtx.lineTo(mCanvas.width, mCanvas.height - 28);
    mCtx.stroke();

    mCtx.fillStyle = '#34d399';
    mCtx.beginPath();
    mCtx.arc(mCanvas.width / 2, mCanvas.height - 14, 14, Math.PI, 0);
    mCtx.fill();

    // Update & draw lasers
    for (let i = state.meteor.lasers.length - 1; i >= 0; i--) {
      const ls = state.meteor.lasers[i];
      ls.alpha -= 0.08;
      if (ls.alpha <= 0) {
        state.meteor.lasers.splice(i, 1);
        continue;
      }
      mCtx.strokeStyle = `rgba(52, 211, 153, ${ls.alpha})`;
      mCtx.lineWidth = 3;
      mCtx.beginPath();
      mCtx.moveTo(mCanvas.width / 2, mCanvas.height - 24);
      mCtx.lineTo(ls.tx, ls.ty);
      mCtx.stroke();
    }

    // Update & draw meteors
    mCtx.font = 'bold 17px "JetBrains Mono", monospace';
    for (let i = state.meteor.meteors.length - 1; i >= 0; i--) {
      const m = state.meteor.meteors[i];
      m.y += m.speed;

      if (m.y >= mCanvas.height - 32) {
        if (state.meteor.lockedId === m.id) state.meteor.lockedId = null;
        state.meteor.meteors.splice(i, 1);
        state.meteor.lives--;
        AudioFX.error();
        updateMeteorHUD();
        if (state.meteor.lives <= 0) {
          endMeteorGame();
          return;
        }
        continue;
      }

      const isLocked = state.meteor.lockedId === m.id;
      const donePart = m.word.slice(0, m.typedLen);
      const remPart = m.word.slice(m.typedLen);
      const totalW = mCtx.measureText(m.word).width;
      const boxW = totalW + 22;

      // Meteor glow pill
      mCtx.fillStyle = isLocked ? 'rgba(52, 211, 153, 0.24)' : 'rgba(15, 23, 42, 0.86)';
      mCtx.strokeStyle = isLocked ? '#34d399' : '#38bdf8';
      mCtx.lineWidth = isLocked ? 2 : 1.2;
      mCtx.beginPath();
      mCtx.roundRect(m.x - boxW / 2, m.y - 18, boxW, 28, 8);
      mCtx.fill();
      mCtx.stroke();

      const startX = m.x - totalW / 2;
      mCtx.fillStyle = '#34d399';
      mCtx.fillText(donePart, startX, m.y + 2);
      const doneW = mCtx.measureText(donePart).width;
      mCtx.fillStyle = '#f8fafc';
      mCtx.fillText(remPart, startX + doneW, m.y + 2);
    }

    state.meteor.animId = requestAnimationFrame(stepMeteorArena);
  }

  function handleMeteorChar(ch) {
    if (!state.meteor.active) return;

    let target = state.meteor.meteors.find((m) => m.id === state.meteor.lockedId);

    // If not locked onto a meteor yet, lock onto the lowest meteor starting with `ch`
    if (!target) {
      const candidates = state.meteor.meteors
        .filter((m) => m.word[0] === ch)
        .sort((a, b) => b.y - a.y);
      if (candidates.length > 0) {
        target = candidates[0];
        state.meteor.lockedId = target.id;
      }
    }

    if (target && target.word[target.typedLen] === ch) {
      target.typedLen++;
      state.meteor.lasers.push({ tx: target.x, ty: target.y, alpha: 1 });
      AudioFX.laser();

      if (target.typedLen >= target.word.length) {
        // Destroyed meteor!
        const rect = mCanvas.getBoundingClientRect();
        const scaleX = rect.width / mCanvas.width;
        const scaleY = rect.height / mCanvas.height;
        spawnParticles(
          rect.left + target.x * scaleX,
          rect.top + target.y * scaleY,
          '#fbbf24',
          24
        );
        AudioFX.meteorBoom();
        state.meteor.score += target.word.length * 15;
        state.meteor.meteors = state.meteor.meteors.filter((m) => m.id !== target.id);
        state.meteor.lockedId = null;
        updateMeteorHUD();
      }
    } else {
      AudioFX.error();
    }
  }

  function endMeteorGame() {
    state.meteor.active = false;
    cancelAnimationFrame(state.meteor.animId);
    if (state.meteor.score > state.progress.meteorBest) {
      state.progress.meteorBest = state.meteor.score;
    }
    state.progress.xp += Math.floor(state.meteor.score / 8);
    saveProgress();
    renderHeaderStats();
    updateMeteorHUD();

    const ov = document.getElementById('meteor-overlay');
    ov.innerHTML = `
      <h3>💥 Schild überlastet! Endstand: ${state.meteor.score} Punkte</h3>
      <p>Klicke oben auf „Abwehr starten“ oder drücke <code>Enter</code> für eine neue Runde!</p>
    `;
    ov.classList.remove('hidden');
  }

  /* ==================== TAB 3: 60s SPRINT & HEATMAP ==================== */
  function resetSprint() {
    clearInterval(state.sprint.timerId);
    const passage = SPRINT_TEXTS[Math.floor(Math.random() * SPRINT_TEXTS.length)];
    state.sprint = {
      active: false,
      text: passage,
      index: 0,
      startedAt: 0,
      timeLeft: 60.0,
      totalKeystrokes: 0,
      errors: 0,
      flawedIndices: new Set(),
      heatmapErrors: {},
      timerId: null,
    };
    renderSprintView();
  }

  function renderSprintView() {
    const s = state.sprint;
    if (!s.text) return;
    document.getElementById('sprint-timer').textContent = `${s.timeLeft.toFixed(1)}s`;
    const { wpm, acc } = computeWpmAndAcc(s.index, s.startedAt, s.totalKeystrokes, s.errors);
    document.getElementById('sprint-wpm').textContent = `${wpm} WPM`;
    document.getElementById('sprint-acc').textContent = `${acc}%`;

    const streamEl = document.getElementById('sprint-stream');
    let html = '';
    for (let i = 0; i < s.text.length; i++) {
      const ch = s.text[i] === ' ' ? '\u00A0' : escapeHtml(s.text[i]);
      const cls = ['dq-char'];
      if (i < s.index) cls.push(s.flawedIndices.has(i) ? 'flawed' : 'done');
      else if (i === s.index) cls.push('current');
      html += `<span class="${cls.join(' ')}">${ch}</span>`;
    }
    streamEl.innerHTML = html;

    const nextChar = s.text[s.index] || null;
    renderKeyboardHTML(document.getElementById('sprint-keyboard'), nextChar, s.heatmapErrors);
  }

  function handleSprintChar(ch) {
    const s = state.sprint;
    if (s.timeLeft <= 0 || s.index >= s.text.length) return;

    if (!s.active) {
      s.active = true;
      s.startedAt = performance.now();
      s.timerId = setInterval(() => {
        if (state.activeTab !== 'sprint' || !s.active) return;
        const elapsed = (performance.now() - s.startedAt) / 1000;
        s.timeLeft = Math.max(0, 60.0 - elapsed);
        renderSprintView();
        if (s.timeLeft <= 0) finishSprint();
      }, 100);
    }

    s.totalKeystrokes++;
    const expected = s.text[s.index];
    if (ch === expected) {
      s.index++;
      AudioFX.keyHit();
      if (s.index >= s.text.length) {
        finishSprint();
        return;
      }
    } else {
      s.errors++;
      s.flawedIndices.add(s.index);
      const info = DvorakLayout.lookupChar(expected);
      if (info) {
        s.heatmapErrors[info.keyId] = (s.heatmapErrors[info.keyId] || 0) + 1;
      }
      AudioFX.error();
    }
    renderSprintView();
  }

  function finishSprint() {
    const s = state.sprint;
    s.active = false;
    clearInterval(s.timerId);
    const { wpm } = computeWpmAndAcc(s.index, s.startedAt, s.totalKeystrokes, s.errors);
    if (wpm > state.progress.sprintBestWpm) {
      state.progress.sprintBestWpm = wpm;
    }
    state.progress.xp += wpm * 2;
    saveProgress();
    renderHeaderStats();
    applySettingsToUI();
    AudioFX.victory(3);
  }

  /* ==================== TAB 4: TASTEN-RADAR ==================== */
  const RADAR_CHARS = [
    'a', 'o', 'e', 'i', 'u', 'h', 'd', 'r', 'n', 's', 'l',
    'ü', 'y', 'f', 'g', 'c', 't', 'z', 'p',
    'ä', 'ö', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v',
    'Ä', 'Ö', 'Ü', 'ß', ',', '.', ';', ':', '#', '-', '_', '?', '@', '€', '<', '>', '{', '}', '[', ']',
  ];

  function nextRadarTarget() {
    const pool = RADAR_CHARS.filter((c) => c !== state.radar.targetChar);
    const next = pool[Math.floor(Math.random() * pool.length)];
    state.radar.targetChar = next;
    state.radar.askedAt = performance.now();
    renderRadarView();
  }

  function renderRadarView() {
    const ch = state.radar.targetChar;
    document.getElementById('radar-target').textContent = ch;
    document.getElementById('radar-hint').textContent = describeKeyInstruction(ch);
    document.getElementById('radar-streak').textContent = String(state.radar.streak);
    renderKeyboardHTML(document.getElementById('radar-keyboard'), ch);
    renderHandsLegend(document.getElementById('radar-hands-bar'), ch);
  }

  function handleRadarChar(ch) {
    if (ch === state.radar.targetChar) {
      const ms = Math.round(performance.now() - state.radar.askedAt);
      state.radar.streak++;
      state.progress.xp += 10;
      document.getElementById('radar-speed').textContent = `${ms} ms`;
      saveProgress();
      renderHeaderStats();
      AudioFX.meteorBoom();
      spawnParticles(window.innerWidth / 2, 240, '#34d399', 16);
      nextRadarTarget();
    } else {
      state.radar.streak = 0;
      document.getElementById('radar-streak').textContent = '0';
      AudioFX.error();
    }
  }

  /* ==================== GLOBAL KEYBOARD ROUTER ==================== */
  window.addEventListener('keydown', (e) => {
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
      if (e.key === 'Escape') e.target.blur();
      return;
    }

    if (
      e.key === 'Shift' ||
      e.key === 'Control' ||
      e.key === 'Alt' ||
      e.key === 'AltGraph' ||
      e.key === 'Meta' ||
      e.key === 'CapsLock'
    ) {
      return;
    }

    const isAltGraph = e.getModifierState && e.getModifierState('AltGraph');

    // Alt+1..4 Tab Switching & Alt+R Restart
    if (e.altKey && !isAltGraph && !e.ctrlKey && !e.metaKey) {
      if (e.code === 'Digit1') { switchTab('campaign'); e.preventDefault(); return; }
      if (e.code === 'Digit2') { switchTab('meteor'); e.preventDefault(); return; }
      if (e.code === 'Digit3') { switchTab('sprint'); e.preventDefault(); return; }
      if (e.code === 'Digit4') { switchTab('radar'); e.preventDefault(); return; }
      if (e.code === 'KeyR' && state.activeTab === 'campaign') {
        loadCampaignLevel(state.currentLevelId);
        e.preventDefault();
        return;
      }
    }

    if (state.victoryOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advanceToNextLevel();
      } else if (e.key === 'r') {
        e.preventDefault();
        loadCampaignLevel(state.currentLevelId);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      if (state.activeTab === 'campaign') loadCampaignLevel(state.currentLevelId);
      else if (state.activeTab === 'sprint') resetSprint();
      return;
    }

    if (state.activeTab === 'meteor' && !state.meteor.active && e.key === 'Enter') {
      e.preventDefault();
      startMeteorGame();
      return;
    }

    if (e.ctrlKey && !isAltGraph) return;

    // Resolve typed character: either direct OS Dvorak (e.key) OR QWERTZ->Dvorak Hardware Emulator
    let typedChar = null;
    if (state.progress.emulateDvorak) {
      typedChar = DvorakLayout.emulateFromHardwareEvent(e);
    } else if (e.key === 'Dead' && e.code === 'Backquote') {
      typedChar = e.shiftKey ? '°' : '^';
    } else if (e.key.length === 1) {
      typedChar = e.key;
    }

    if (!typedChar) return;
    e.preventDefault();

    if (state.activeTab === 'campaign') {
      handleCampaignChar(typedChar);
    } else if (state.activeTab === 'meteor') {
      handleMeteorChar(typedChar);
    } else if (state.activeTab === 'sprint') {
      handleSprintChar(typedChar);
    } else if (state.activeTab === 'radar') {
      handleRadarChar(typedChar);
    }
  });

  /* ==================== CONTROLS WIRING ==================== */
  function switchTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.dq-tab').forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });
    document.querySelectorAll('.dq-view').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `view-${tabName}`);
    });
    if (tabName === 'radar') renderRadarView();
    if (tabName === 'sprint' && !state.sprint.text) resetSprint();
  }

  function wireControls() {
    document.querySelectorAll('.dq-tab').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.getElementById('emulate-toggle').addEventListener('click', () => {
      state.progress.emulateDvorak = !state.progress.emulateDvorak;
      applySettingsToUI();
      saveProgress();
    });

    document.getElementById('qwertz-hint-toggle').addEventListener('click', () => {
      state.progress.showQwertzGhost = !state.progress.showQwertzGhost;
      applySettingsToUI();
      saveProgress();
    });

    document.getElementById('sound-toggle').addEventListener('click', () => {
      state.progress.sound = !state.progress.sound;
      applySettingsToUI();
      saveProgress();
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
      loadCampaignLevel(state.currentLevelId);
    });

    document.getElementById('modal-retry').addEventListener('click', () => {
      loadCampaignLevel(state.currentLevelId);
    });
    document.getElementById('modal-next').addEventListener('click', advanceToNextLevel);

    document.getElementById('btn-meteor-start').addEventListener('click', startMeteorGame);
    document.getElementById('btn-sprint-reset').addEventListener('click', resetSprint);
  }

  /* ==================== INIT ==================== */
  loadLocalProgress();
  wireControls();
  resetSprint();
  nextRadarTarget();
  applySettingsToUI();
  renderHeaderStats();
  renderSidebar();
  loadCampaignLevel(state.currentLevelId);
  syncServerProgress();
})();

