/**
 * DvorakQuest — Synthesized Web Audio Sound Engine
 */
(function (root) {
  'use strict';

  class DvorakAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    ensureContext() {
      if (!this.enabled) return null;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    tone(freq, duration = 0.05, type = 'triangle', gainVal = 0.05, delay = 0, slideTo = null) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.01);
    }

    keyHit() {
      this.tone(320, 0.028, 'triangle', 0.04, 0, 220);
    }

    wordDone() {
      this.tone(587.33, 0.06, 'sine', 0.045, 0, 783.99);
    }

    error() {
      this.tone(145, 0.1, 'sawtooth', 0.055, 0, 88);
    }

    laser() {
      this.tone(720, 0.055, 'sawtooth', 0.04, 0, 260);
    }

    meteorBoom() {
      this.tone(523.25, 0.08, 'triangle', 0.07, 0);
      this.tone(659.25, 0.1, 'triangle', 0.07, 0.045);
      this.tone(1046.5, 0.15, 'sine', 0.08, 0.09);
    }

    victory(stars = 3) {
      const notes = stars === 3 ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99];
      notes.forEach((n, idx) => this.tone(n, 0.2, 'triangle', 0.075, idx * 0.08));
    }
  }

  root.DvorakAudio = new DvorakAudio();
})(typeof self !== 'undefined' ? self : this);

