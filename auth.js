(function () {
  var AUTH_KEY = 'sp-auth';
  // SHA-256 of "better2026"
  var HASH = '93437dca2c9f32b744836ab502ee10cecd8a25425c8c817b2fe09b3f0f5fd70c';

  if (sessionStorage.getItem(AUTH_KEY) === 'ok') {
    document.documentElement.classList.remove('auth-pending');
    return;
  }

  var overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.innerHTML =
    '<div style="max-width:340px;width:90%;text-align:center">' +
    '<div style="font-size:1.4rem;margin-bottom:1.2rem;font-weight:600">Password Required</div>' +
    '<input id="auth-pw" type="password" placeholder="Enter password" autocomplete="off" ' +
    'style="width:100%;padding:.7rem 1rem;border-radius:8px;border:1px solid #333;background:#1a1d28;color:#eee;font-size:1rem;outline:none;margin-bottom:.8rem">' +
    '<button id="auth-btn" style="width:100%;padding:.7rem;border-radius:8px;border:none;background:#4a90e2;color:#fff;font-size:.95rem;font-weight:600;cursor:pointer">Enter</button>' +
    '<div id="auth-err" style="color:#e05c7a;font-size:.85rem;margin-top:.6rem;display:none">Incorrect password</div>' +
    '</div>';

  document.body.appendChild(overlay);

  var inp = document.getElementById('auth-pw');
  var btn = document.getElementById('auth-btn');
  var err = document.getElementById('auth-err');

  function check() {
    var pw = inp.value;
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw)).then(function (buf) {
      var hex = Array.from(new Uint8Array(buf)).map(function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
      if (hex === HASH) {
        sessionStorage.setItem(AUTH_KEY, 'ok');
        overlay.remove();
        document.documentElement.classList.remove('auth-pending');
      } else {
        err.style.display = 'block';
        inp.value = '';
        inp.focus();
      }
    });
  }

  btn.addEventListener('click', check);
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') check();
  });
  setTimeout(function () { inp.focus(); }, 100);
})();
