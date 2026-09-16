// Mobile navigation toggle.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
})();

// Looping figure clips honour "reduce motion". CSS cannot cancel autoplay, so when the
// visitor has asked for less movement we stop the clips and give them controls instead;
// they see the poster frame until they choose to play.
(function () {
  var quiet = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!quiet || !quiet.matches) return;
  var clips = document.querySelectorAll('video[autoplay]');
  for (var i = 0; i < clips.length; i++) {
    clips[i].autoplay = false;
    clips[i].removeAttribute('autoplay');
    clips[i].controls = true;
    clips[i].pause();
  }
  var diagrams = document.querySelectorAll('svg.diagram-animated');
  for (var j = 0; j < diagrams.length; j++) {
    if (diagrams[j].pauseAnimations) diagrams[j].pauseAnimations();
  }
})();

// Research header ribbon. The page ships the frames as a side-scrolling strip that works
// on its own; only once we know scripting is available -- and the visitor has not asked
// for less movement -- do we stack them and crossfade one frame at a time.
(function () {
  var ribbon = document.querySelector('[data-ribbon]');
  if (!ribbon) return;
  var frames = ribbon.querySelectorAll('.ribbon-frame');
  if (frames.length < 2) return;
  var quiet = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (quiet && quiet.matches) return;

  var HOLD = 5000;          // ms a frame stays up, fade included
  var index = 0, timer = null, paused = false;

  ribbon.classList.add('is-cycling');
  frames[0].classList.add('is-current');

  // The button only exists when it can do something, so no dead control without this script.
  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'ribbon-toggle';
  ribbon.appendChild(toggle);

  function advance() {
    frames[index].classList.remove('is-current');
    index = (index + 1) % frames.length;
    frames[index].classList.add('is-current');
  }
  function start() {
    if (timer || paused || document.hidden) return;
    timer = setInterval(advance, HOLD);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }
  function setPaused(value) {
    paused = value;
    toggle.textContent = paused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' the research image ribbon');
    if (paused) stop(); else start();
  }

  toggle.addEventListener('click', function () { setPaused(!paused); });
  // Someone reading a frame, or tabbing onto its link, should not have it slide away.
  ribbon.addEventListener('mouseenter', stop);
  ribbon.addEventListener('mouseleave', start);
  ribbon.addEventListener('focusin', stop);
  ribbon.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  setPaused(false);
})();
