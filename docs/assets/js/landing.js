/* Local, progressive enhancements. No services, cookies or tracking. */
(function () {
  'use strict';
  if (!document.body.classList.contains('landing')) return;

  var header = document.querySelector('.lp-header');
  var nav = document.getElementById('lp-nav');
  var toggle = document.querySelector('.lp-menu-toggle');
  if (header && nav && toggle) {
    var mobile = window.matchMedia('(max-width: 1040px)');
    var setMenu = function (open, returnFocus) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = (open ? 'Close' : 'Menu') + ' <span aria-hidden="true">' + (open ? '−' : '＋') + '</span>';
      if (returnFocus) toggle.focus();
    };
    toggle.hidden = false;
    document.body.classList.add('lp-menu-ready');
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    document.addEventListener('click', function (event) {
      if (!header.contains(event.target)) setMenu(false);
    });
    mobile.addEventListener('change', function () { setMenu(false); });
  }

  var player = document.querySelector('[data-wake-player]');
  if (!player) return;
  var frame = player.querySelector('[data-wake-frame]');
  var frameLabel = player.querySelector('[data-frame-label]');
  var clock = player.querySelector('[data-time]');
  var slider = player.querySelector('[data-frame-slider]');
  var play = player.querySelector('[data-play]');
  var controls = player.querySelector('[data-player-controls]');
  if (!frame || !frameLabel || !clock || !slider || !play || !controls) return;
  var times = player.dataset.times.split(',').map(Number);
  if (times.length !== 10 || times.some(function (value, i) { return !Number.isFinite(value) || (i && value <= times[i - 1]); })) return;

  var current = 0;
  var playing = false;
  var timer = null;
  var letters = 'ABCDEFGHIJ';
  var descriptions = [
    'a compact red wake around the black sphere',
    'red vortex threads emerging behind the black sphere',
    'red vortex threads growing behind the black sphere',
    'elongated red vortex threads behind the black sphere',
    'the red wake stretching behind the black sphere',
    'two red vortex threads trailing the black sphere',
    'the red wake changing shape behind the black sphere',
    'the red wake beginning to separate from the black sphere',
    'red vortex rings separating below the black sphere',
    'red vortex rings trailing behind the black sphere'
  ];

  function setButton() {
    var label = playing ? 'Pause sequence' : (current === times.length - 1 ? 'Replay sequence' : 'Play sequence');
    play.innerHTML = label + ' <span aria-hidden="true">' + (playing ? 'Ⅱ' : '▶') + '</span>';
    play.setAttribute('aria-label', label + (playing ? '' : ' in slow motion'));
    player.dataset.playerState = playing ? 'playing' : (current === 9 ? 'complete' : 'paused');
  }
  function render(index) {
    current = Math.max(0, Math.min(times.length - 1, index));
    var time = times[current].toFixed(2);
    var letter = letters[current];
    frame.style.setProperty('--wake-position', (current * 100 / (times.length - 1)) + '%');
    frame.setAttribute('aria-label', 'Frame ' + letter + ': ' + descriptions[current]);
    frameLabel.textContent = 'Frame ' + letter + ' / J';
    clock.value = 't = ' + time + ' ms';
    slider.value = String(current);
    slider.setAttribute('aria-valuetext', 'Frame ' + letter + ', ' + time + ' milliseconds');
    setButton();
  }
  function pause() {
    playing = false;
    window.clearTimeout(timer);
    timer = null;
    setButton();
  }
  function scheduleNext() {
    if (!playing) return;
    if (current >= times.length - 1) { pause(); return; }
    // Preserve the unequal intervals of the source experiment, slowed 24 times.
    timer = window.setTimeout(function () {
      render(current + 1);
      scheduleNext();
    }, (times[current + 1] - times[current]) * 24);
  }
  play.addEventListener('click', function () {
    if (playing) { pause(); return; }
    if (current === times.length - 1) render(0);
    playing = true;
    setButton();
    scheduleNext();
  });
  slider.addEventListener('pointerdown', pause);
  slider.addEventListener('input', function () { pause(); render(Number(slider.value)); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionPreference.addEventListener('change', function (event) { if (event.matches) pause(); });
  var observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) pause();
    }, { threshold: 0 });
    observer.observe(player);
  }
  window.addEventListener('pagehide', function () { pause(); if (observer) observer.disconnect(); });
  controls.hidden = false;
  render(0);
}());
