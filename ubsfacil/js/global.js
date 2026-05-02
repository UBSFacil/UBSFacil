/* ============================================
   UBS FÁCIL — JS GLOBAL
   Nav, Drawer, Modais compartilhados
   ============================================ */

/* ── DRAWER MOBILE ── */
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── MODAIS ── */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
function bgClose(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

/* ── TOAST ── */
function showToast(msg, type) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.background = type === 'success' ? '#2e7d32' : '#c62828';
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 3500);
}

/* ── PASSWORD TOGGLE ── */
function tog(id) {
  var el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
}

/* ── MARCA LINK ATIVO NA NAV ── */
(function markActiveNav() {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .drawer-links a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    if (href === path) a.classList.add('active');
  });
})();
