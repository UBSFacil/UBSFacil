/* ============================================
   UBS FÁCIL — JS CONTATO
   Formulário + FAQ accordion
   ============================================ */

function updateCount() {
  var txt = document.getElementById('f-msg');
  if (txt) document.getElementById('char-n').textContent = txt.value.length;
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

  document.getElementById('success-msg').classList.add('show');
  document.getElementById('f-nome').value = '';
  document.getElementById('f-email').value = '';
  document.getElementById('f-assunto').value = '';
  document.getElementById('f-msg').value = '';
  document.getElementById('char-n').textContent = '0';
}

function toggleFaq(el) {
  var isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
  if (!isOpen) el.classList.add('open');
}
