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
