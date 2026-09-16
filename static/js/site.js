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

// Research header ribbon. The page ships showing its first frame and nothing else, which
// stands on its own; only once we know scripting is available -- and the visitor has not
// asked for less movement -- do we crossfade between the frames.
(function () {
  var ribbon = document.querySelector('[data-ribbon]');
  if (!ribbon) return;
  var frames = ribbon.querySelectorAll('.ribbon-frame');
  if (frames.length < 2) return;
  var quiet = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (quiet && quiet.matches) return;

  var HOLD = 10000;         // ms a frame stays up, fade included
  var index = 0, timer = null, paused = false;

  ribbon.classList.add('is-cycling');
  frames[0].classList.add('is-current');

  // The button only exists when it can do something, so no dead control without this script.
  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'ribbon-toggle';
  ribbon.appendChild(toggle);

  function arrow(cls, label, d) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'ribbon-nav ' + cls;
    b.setAttribute('aria-label', label);
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                  '<polyline points="' + d + '" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    ribbon.appendChild(b);
    return b;
  }
  var prev = arrow('ribbon-prev', 'Previous project image', '15 5 8 12 15 19');
  var next = arrow('ribbon-next', 'Next project image', '9 5 16 12 9 19');

  function step(by) {
    frames[index].classList.remove('is-current');
    index = (index + by + frames.length) % frames.length;
    frames[index].classList.add('is-current');
  }
  function advance() { step(1); }
  // A deliberate click restarts the dwell, so the frame just asked for is not
  // whipped away by a timer that was already part-way through.
  function nudge(by) {
    step(by);
    if (!paused) { stop(); start(); }
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
  prev.addEventListener('click', function () { nudge(-1); });
  next.addEventListener('click', function () { nudge(1); });
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
