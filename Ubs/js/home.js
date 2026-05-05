/* ============================================
   UBS FÁCIL — JS HOME (index)
   Auth card tabs + modais de ações
   ============================================ */

/* ── AUTH CARD TABS ── */
function setTab(t) {
  var isCad = t === 'cad';
  document.getElementById('tab-cad').className = 'tab' + (isCad ? ' on' : '');
  document.getElementById('tab-log').className = 'tab' + (!isCad ? ' on' : '');
  document.getElementById('panel-cad').style.display = isCad ? 'block' : 'none';
  document.getElementById('panel-log').style.display = !isCad ? 'block' : 'none';
  document.getElementById('card-title').textContent = isCad ? 'Criar sua conta' : 'Bem-vindo de volta';
  document.getElementById('card-sub').textContent = isCad
    ? 'Acesse todos os recursos do UBS Fácil'
    : 'Entre na sua conta UBS Fácil';
  document.querySelector('.auth-wrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ── MODAL BUSCA — TABS ── */
function setMTab(t) {
  var isMed = t === 'med';
  document.getElementById('mt-med').className = 'modal-tab' + (isMed ? ' on' : '');
  document.getElementById('mt-ubs').className = 'modal-tab' + (!isMed ? ' on' : '');
  document.getElementById('mt-med-panel').style.display = isMed ? 'block' : 'none';
  document.getElementById('mt-ubs-panel').style.display = !isMed ? 'block' : 'none';
}
