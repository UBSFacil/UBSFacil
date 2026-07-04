/* ============================================
   UBS FÁCIL — JS CONTATO
   Formulário + FAQ accordion
   ============================================ */

function updateCount() {
  var txt = document.getElementById('f-msg');
  var counter = document.getElementById('char-n');
  if (!txt || !counter) return;
  var len = txt.value.length;
  counter.textContent = len;
  // aviso visual quando perto do limite
  counter.style.color = len > 450 ? '#c62828' : len > 350 ? '#fb8c00' : '#7a8aaa';
}

function submitForm() {
  var nome    = document.getElementById('f-nome').value.trim();
  var email   = document.getElementById('f-email').value.trim();
  var assunto = document.getElementById('f-assunto').value;
  var msg     = document.getElementById('f-msg').value.trim();

  if (!nome || !email || !assunto || !msg) {
    showToast('Preencha todos os campos antes de enviar.');
    return;
  }
  if (!email.includes('@')) {
    showToast('Informe um e-mail válido.');
    return;
  }

  var successEl = document.getElementById('success-msg');
  if (successEl) successEl.classList.add('show');

  document.getElementById('f-nome').value    = '';
  document.getElementById('f-email').value   = '';
  document.getElementById('f-assunto').value = '';
  document.getElementById('f-msg').value     = '';
  document.getElementById('char-n').textContent = '0';
  document.getElementById('char-n').style.color = '#7a8aaa';
}

function toggleFaq(el) {
  var isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i) {
    i.classList.remove('open');
  });
  if (!isOpen) el.classList.add('open');
}
