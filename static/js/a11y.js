// Accessibility menu: text size, high contrast, underlined links, stop animations.
// Preferences are kept in this browser only.
(function () {
  var root = document.documentElement;
  var KEY = 'tfml-a11y';
  var prefs = { text: 0, contrast: false, underline: false, noanim: false };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || '{}'); for (var k in saved) if (k in prefs) prefs[k] = saved[k]; } catch (e) {}

  function apply() {
    root.classList.toggle('a11y-text-1', prefs.text === 1);
    root.classList.toggle('a11y-text-2', prefs.text === 2);
    root.classList.toggle('a11y-contrast', !!prefs.contrast);
    root.classList.toggle('a11y-underline', !!prefs.underline);
    root.classList.toggle('a11y-noanim', !!prefs.noanim);
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
  }
  apply();

  var wrap = document.createElement('div');
  wrap.id = 'a11y-menu';
  wrap.innerHTML =
    '<button type="button" class="a11y-toggle" aria-expanded="false" aria-controls="a11y-panel">' +
      '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="4.5" r="2" fill="currentColor"/><path d="M4 8.5h16v2l-5.5 1v4.5l1.6 6h-2.2L12 16.5 10.1 22H7.9l1.6-6V11.5L4 10.5z" fill="currentColor"/></svg>' +
      '<span>Accessibility</span></button>' +
    '<div id="a11y-panel" class="a11y-panel" hidden>' +
      '<p class="a11y-title">Display options</p>' +
      '<div class="a11y-row"><span id="a11y-size-label">Text size</span>' +
        '<div class="a11y-sizes" role="group" aria-labelledby="a11y-size-label">' +
          '<button type="button" data-text="0">Normal</button><button type="button" data-text="1">Larger</button><button type="button" data-text="2">Largest</button>' +
        '</div></div>' +
      '<label class="a11y-check"><input type="checkbox" data-pref="contrast"> High contrast</label>' +
      '<label class="a11y-check"><input type="checkbox" data-pref="underline"> Underline links</label>' +
      '<label class="a11y-check"><input type="checkbox" data-pref="noanim"> Stop animations</label>' +
      '<div class="a11y-foot"><button type="button" class="a11y-reset">Reset</button><a href="/accessibility/">Accessibility statement</a></div>' +
    '</div>';
  document.body.appendChild(wrap);

  var toggle = wrap.querySelector('.a11y-toggle');
  var panel = wrap.querySelector('.a11y-panel');
  function sync() {
    wrap.querySelectorAll('[data-text]').forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.text) === prefs.text)); });
    wrap.querySelectorAll('[data-pref]').forEach(function (c) { c.checked = !!prefs[c.dataset.pref]; });
  }
  sync();
  toggle.addEventListener('click', function () {
    var open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('button, input').focus();
  });
  wrap.querySelectorAll('[data-text]').forEach(function (b) {
    b.addEventListener('click', function () { prefs.text = Number(b.dataset.text); apply(); sync(); });
  });
  wrap.querySelectorAll('[data-pref]').forEach(function (c) {
    c.addEventListener('change', function () { prefs[c.dataset.pref] = c.checked; apply(); });
  });
  wrap.querySelector('.a11y-reset').addEventListener('click', function () {
    prefs = { text: 0, contrast: false, underline: false, noanim: false }; apply(); sync();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !wrap.contains(e.target)) { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
  });
})();
