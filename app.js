'use strict';

(function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Copy helper ---------- */
  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { fallback(); });
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      done(ok);
    }
  }

  /* ---------- Palette: strip swatches, ink color + copy ---------- */
  function luminance(r, g, b) {
    var f = function (c) {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function inkFor(hex) {
    var h = hex.replace('#', '');
    var l = luminance(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
    return l > 0.3 ? '#141414' : '#ffffff';
  }

  var status = document.getElementById('copy-status');
  var swatches = document.querySelectorAll('.strip-swatch[data-hex]');
  swatches.forEach(function (sw) {
    var hex = sw.getAttribute('data-hex').toUpperCase();
    sw.style.setProperty('--swatch', hex);
    sw.style.backgroundColor = hex;
    sw.style.color = inkFor(hex);
    var nm = sw.querySelector('.name');
    sw.setAttribute('aria-label', 'Copy ' + hex + ' (' + (nm ? nm.textContent : 'color') + ')');
    sw.addEventListener('click', function () {
      copyText(hex, function (ok) {
        if (status) status.textContent = ok ? 'Copied ' + hex + ' to clipboard' : 'Copy failed — ' + hex;
        if (ok) {
          sw.classList.add('copied');
          setTimeout(function () { sw.classList.remove('copied'); }, 1400);
        }
      });
    });
  });

  /* ---------- Ports: copy buttons + search filter ---------- */
  document.querySelectorAll('.copy-btn[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      copyText(text, function (ok) {
        var orig = 'Copy';
        btn.textContent = ok ? 'Copied!' : 'Failed';
        setTimeout(function () { btn.textContent = orig; }, 1400);
        if (status) status.textContent = ok ? 'Copied: ' + text : 'Copy failed';
      });
    });
  });

  var search = document.getElementById('port-search');
  var cards = Array.prototype.slice.call(document.querySelectorAll('#repo-grid .card'));
  var noResults = document.getElementById('no-results');
  if (search) {
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var hay = ((card.getAttribute('data-name') || '') + ' ' + card.textContent).toLowerCase();
        var match = !q || hay.indexOf(q) !== -1;
        card.hidden = !match;
        if (match) visible++;
      });
      if (noResults) noResults.hidden = visible !== 0;
    });
  }
})();

/* ---------- Optimized CRT particle canvas ---------- */
(function () {
  var canvas = document.getElementById('crt-canvas');
  if (!canvas) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var width = 0, height = 0, dpr = 1;
  var particles = [];
  var running = true;
  var rafId = 0;

  var AMBER = 'rgba(255,158,59,';
  var GOLD = 'rgba(255,184,108,';
  var Z_START = 2000;
  var Z_IMPACT = 100;

  function particleCount() {
    var area = window.innerWidth * window.innerHeight;
    var n = Math.round(area / 14000);
    n = Math.max(40, Math.min(n, 150));
    if (window.innerWidth < 600) n = Math.min(n, 60);
    return n;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function Particle() { this.reset(true); }
  Particle.prototype.reset = function (randomZ) {
    this.z = randomZ ? (Math.random() * Z_START + Z_START * 0.2) : (Z_START + Math.random() * 1000);
    var spreadX = width * 0.8;
    var spreadY = height * 0.8;
    this.tx = (Math.random() - 0.5) * spreadX;
    this.ty = (Math.random() - 0.5) * spreadY;
    this.curveX = 1.5 + Math.random() * 2.5;
    this.curveY = 1.5 + Math.random() * 2.5;
    this.speed = 3 + Math.random() * 2;
    this.impacting = false;
    this.impactAlpha = 1;
    this.history = [];
    this.debris = [];
    var debrisCount = 4 + Math.floor(Math.random() * 4);
    for (var i = 0; i < debrisCount; i++) {
      this.debris.push({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        w: Math.random() * 3 + 1,
        h: Math.random() * 3 + 1
      });
    }
    this.screenX = width / 2;
    this.screenY = height / 2;
    this.scale = 0;
  };
  Particle.prototype.update = function () {
    if (this.impacting) {
      this.impactAlpha -= 0.05;
      if (this.impactAlpha <= 0) this.reset(false);
      return;
    }
    this.z -= this.speed;
    var progress = 1 - ((this.z - Z_IMPACT) / (Z_START - Z_IMPACT));
    if (progress >= 1) { this.impacting = true; return; }
    var currX = this.tx * Math.pow(Math.max(progress, 0), this.curveX);
    var currY = this.ty * Math.pow(Math.max(progress, 0), this.curveY);
    var fov = 300;
    var scale = fov / (fov + this.z);
    this.screenX = width / 2 + currX;
    this.screenY = height / 2 + currY;
    this.scale = scale;
    this.history.push({ x: this.screenX, y: this.screenY });
    if (this.history.length > 20) this.history.shift();
  };
  Particle.prototype.draw = function () {
    if (this.impacting) {
      ctx.fillStyle = GOLD + this.impactAlpha + ')';
      for (var i = 0; i < this.debris.length; i++) {
        var d = this.debris[i];
        ctx.fillRect(this.screenX + d.x, this.screenY + d.y, d.w, d.h);
      }
    } else if (this.z < Z_START) {
      var size = Math.max(1, 4 * this.scale);
      var alpha = Math.min(1, (1 - (this.z / Z_START)) * 1);
      ctx.fillStyle = AMBER + alpha + ')';
      ctx.beginPath();
      ctx.arc(this.screenX, this.screenY, size, 0, Math.PI * 2);
      ctx.fill();
      if (this.history.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (var j = 1; j < this.history.length; j++) ctx.lineTo(this.history[j].x, this.history[j].y);
        ctx.lineTo(this.screenX, this.screenY);
        ctx.strokeStyle = AMBER + (alpha * 0.4) + ')';
        ctx.lineWidth = size * 0.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }
  };

  function build() {
    particles = [];
    var n = particleCount();
    for (var i = 0; i < n; i++) particles.push(new Particle());
  }
  build();
  window.addEventListener('resize', function () {
    clearTimeout(window.__crtRt);
    window.__crtRt = setTimeout(build, 250);
  }, { passive: true });

  function animate() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'screen';
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    ctx.globalCompositeOperation = 'source-over';
    rafId = requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    } else if (!running) {
      running = true;
      animate();
    }
  });
})();
