/* ============================================
   UBS FÁCIL — JS MEDICAMENTOS
   Busca, filtros, resultados e detalhes
   ============================================ */

/* ── DADOS MOCK (substituir por API real futuramente) ── */
var medicamentosDB = [
  { id:1, nome:'Amoxicilina 500mg', categoria:'Antibiótico', tipo:'Cápsula', tarja:'vermelha', disponivel:true, unidades:[{nome:'UBS Jardim Paulista',bairro:'Jardim Paulista',dist:'1.2km',qtd:48},{nome:'UBS Vila Madalena',bairro:'Vila Madalena',dist:'2.4km',qtd:12}], descricao:'Antibiótico de amplo espectro utilizado no tratamento de infecções bacterianas.', uso:'Oral', dosagem:'500mg a cada 8h por 7-10 dias conforme prescrição médica.', conservacao:'Temperatura ambiente, longe da umidade.' },
  { id:2, nome:'Metformina 850mg', categoria:'Diabetes', tipo:'Comprimido', tarja:'vermelha', disponivel:true, unidades:[{nome:'UBS Centro',bairro:'Centro',dist:'0.8km',qtd:200},{nome:'UBS Ipiranga',bairro:'Ipiranga',dist:'3.1km',qtd:85}], descricao:'Antidiabético oral de primeira linha para tratamento de diabetes tipo 2.', uso:'Oral', dosagem:'850mg 2x ao dia conforme orientação médica.', conservacao:'Temperatura ambiente, proteger da luz.' },
  { id:3, nome:'Paracetamol 750mg', categoria:'Analgésico', tipo:'Comprimido', tarja:'isento', disponivel:true, unidades:[{nome:'UBS Mooca',bairro:'Mooca',dist:'1.8km',qtd:320},{nome:'UBS Tatuapé',bairro:'Tatuapé',dist:'2.2km',qtd:150},{nome:'UBS Penha',bairro:'Penha',dist:'4.0km',qtd:90}], descricao:'Analgésico e antitérmico de uso comum para dores leves a moderadas e febre.', uso:'Oral', dosagem:'750mg a cada 6h, máximo 4 comprimidos/dia.', conservacao:'Temperatura ambiente.' },
  { id:4, nome:'Losartana 50mg', categoria:'Hipertensão', tipo:'Comprimido', tarja:'vermelha', disponivel:true, unidades:[{nome:'UBS Santana',bairro:'Santana',dist:'2.0km',qtd:60}], descricao:'Anti-hipertensivo antagonista dos receptores da angiotensina II.', uso:'Oral', dosagem:'50mg 1x ao dia ou conforme prescrição.', conservacao:'Temperatura ambiente.' },
  { id:5, nome:'Dipirona 500mg', categoria:'Analgésico', tipo:'Comprimido', tarja:'isento', disponivel:false, unidades:[], descricao:'Analgésico e antitérmico de uso amplo no Brasil.', uso:'Oral', dosagem:'500mg-1g a cada 6h conforme necessidade.', conservacao:'Temperatura ambiente.' },
  { id:6, nome:'Atorvastatina 20mg', categoria:'Colesterol', tipo:'Comprimido', tarja:'vermelha', disponivel:true, unidades:[{nome:'UBS Lapa',bairro:'Lapa',dist:'3.5km',qtd:40}], descricao:'Estatina utilizada no tratamento da hipercolesterolemia e prevenção cardiovascular.', uso:'Oral', dosagem:'20mg 1x ao dia, preferencialmente à noite.', conservacao:'Temperatura ambiente, proteger da luz.' },
  { id:7, nome:'Omeprazol 20mg', categoria:'Gastro', tipo:'Cápsula', tarja:'vermelha', disponivel:true, unidades:[{nome:'UBS Vila Prudente',bairro:'Vila Prudente',dist:'2.8km',qtd:110},{nome:'UBS Água Funda',bairro:'Água Funda',dist:'3.6km',qtd:55}], descricao:'Inibidor da bomba de prótons para tratamento de úlceras e refluxo gastroesofágico.', uso:'Oral', dosagem:'20mg 1x ao dia em jejum.', conservacao:'Temperatura ambiente.' },
  { id:8, nome:'Salbutamol 100mcg', categoria:'Respiratório', tipo:'Inalador', tarja:'vermelha', disponivel:true, unidades:[{nome:'UBS Jabaquara',bairro:'Jabaquara',dist:'4.2km',qtd:25}], descricao:'Broncodilatador de curta ação para tratamento e prevenção do broncoespasmo na asma.', uso:'Inalatório', dosagem:'1-2 jatos conforme necessidade ou prescrição.', conservacao:'Temperatura ambiente, não perfurar.' }
];

var resultadosFiltrados = [];
var filtroAtual = { busca: '', categoria: 'todas', disponivel: 'todos' };

/* ── INICIALIZAÇÃO ── */
document.addEventListener('DOMContentLoaded', function () {
  resultadosFiltrados = medicamentosDB.slice();
  renderMedicamentos();
});

/* ── BUSCA PRINCIPAL ── */
function buscarMedicamento() {
  filtroAtual.busca = document.getElementById('busca-input').value.trim().toLowerCase();
  aplicarFiltros();
}

function onBuscaKeyup(e) {
  if (e.key === 'Enter') buscarMedicamento();
  else {
    filtroAtual.busca = e.target.value.toLowerCase();
    aplicarFiltros();
  }
}

/* ── FILTROS ── */
function setCategoria(cat) {
  filtroAtual.categoria = cat;
  document.querySelectorAll('.cat-btn').forEach(function (b) { b.classList.remove('active'); });
  document.querySelectorAll('.cat-btn[data-cat="' + cat + '"]').forEach(function (b) { b.classList.add('active'); });
  aplicarFiltros();
}

function setDisponivel(val) {
  filtroAtual.disponivel = val;
  document.querySelectorAll('.disp-btn').forEach(function (b) { b.classList.remove('active'); });
  document.querySelectorAll('.disp-btn[data-disp="' + val + '"]').forEach(function (b) { b.classList.add('active'); });
  aplicarFiltros();
}

function aplicarFiltros() {
  resultadosFiltrados = medicamentosDB.filter(function (m) {
    var matchBusca = !filtroAtual.busca || m.nome.toLowerCase().includes(filtroAtual.busca) || m.categoria.toLowerCase().includes(filtroAtual.busca);
    var matchCat   = filtroAtual.categoria === 'todas' || m.categoria === filtroAtual.categoria;
    var matchDisp  = filtroAtual.disponivel === 'todos' || (filtroAtual.disponivel === 'sim' ? m.disponivel : !m.disponivel);
    return matchBusca && matchCat && matchDisp;
  });
  renderMedicamentos();
}

/* ── RENDERIZAÇÃO ── */
function renderMedicamentos() {
  var container = document.getElementById('med-results');
  var countEl   = document.getElementById('med-count');
  countEl.textContent = resultadosFiltrados.length + ' medicamento(s) encontrado(s)';

  if (!resultadosFiltrados.length) {
    container.innerHTML =
      '<div class="empty-state" style="padding:3rem 1rem;">' +
      '<svg viewBox="0 0 24 24"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/></svg>' +
      '<p>Nenhum medicamento encontrado.<br>Tente outros termos ou limpe os filtros.</p></div>';
    return;
  }

  container.innerHTML = resultadosFiltrados.map(function (m) {
    var tarjaCls = m.tarja === 'vermelha' ? 'tarja-v' : m.tarja === 'preta' ? 'tarja-p' : 'tarja-i';
    var tarjaTxt = m.tarja === 'vermelha' ? 'Tarja Vermelha' : m.tarja === 'preta' ? 'Tarja Preta' : 'Isento de Tarja';
    var unidadesTxt = m.disponivel
      ? m.unidades.length + ' unidade(s) com estoque'
      : 'Indisponível no momento';
    return '<div class="med-card" onclick="verDetalhes(' + m.id + ')">' +
      '<div class="med-card-top">' +
        '<div class="med-icon-wrap"><svg viewBox="0 0 24 24"><path d="M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm8.5-5c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm2.5 8h-5V7h2v4h3v2z"/></svg></div>' +
        '<div class="med-info">' +
          '<div class="med-nome">' + m.nome + '</div>' +
          '<div class="med-meta">' +
            '<span class="med-categoria">' + m.categoria + '</span>' +
            '<span class="med-tipo">' + m.tipo + '</span>' +
            '<span class="med-tarja ' + tarjaCls + '">' + tarjaTxt + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="med-card-bottom">' +
        '<span class="med-disp ' + (m.disponivel ? 'disp-sim' : 'disp-nao') + '">' +
          (m.disponivel ? '● ' : '○ ') + unidadesTxt +
        '</span>' +
        '<button class="med-ver-btn">Ver detalhes →</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ── MODAL DETALHES ── */
function verDetalhes(id) {
  var m = medicamentosDB.find(function (x) { return x.id === id; });
  if (!m) return;

  var tarjaCls = m.tarja === 'vermelha' ? 'tarja-v' : m.tarja === 'preta' ? 'tarja-p' : 'tarja-i';
  var tarjaTxt = m.tarja === 'vermelha' ? 'Tarja Vermelha' : m.tarja === 'preta' ? 'Tarja Preta' : 'Isento de Tarja';

  var unidadesHtml = m.disponivel && m.unidades.length
    ? m.unidades.map(function (u) {
        return '<div class="modal-unidade">' +
          '<div class="modal-unidade-info"><strong>' + u.nome + '</strong><span>' + u.bairro + ' · ' + u.dist + '</span></div>' +
          '<div class="modal-unidade-qtd">' + u.qtd + ' un.</div>' +
        '</div>';
      }).join('')
    : '<p style="font-size:13px;color:#c62828;font-weight:700;padding:.5rem 0;">Indisponível nas unidades próximas no momento.</p>';

  document.getElementById('modal-med-body').innerHTML =
    '<div class="modal-med-header">' +
      '<div class="modal-med-icon"><svg viewBox="0 0 24 24"><path d="M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm8.5-5c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm2.5 8h-5V7h2v4h3v2z"/></svg></div>' +
      '<div>' +
        '<div style="font-size:18px;font-weight:800;color:#0d2251;margin-bottom:4px;">' + m.nome + '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
          '<span class="med-categoria">' + m.categoria + '</span>' +
          '<span class="med-tipo">' + m.tipo + '</span>' +
          '<span class="med-tarja ' + tarjaCls + '">' + tarjaTxt + '</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="modal-med-section"><h4>Descrição</h4><p>' + m.descricao + '</p></div>' +
    '<div class="modal-med-grid">' +
      '<div class="modal-med-item"><span>Via de uso</span><strong>' + m.uso + '</strong></div>' +
      '<div class="modal-med-item"><span>Dosagem</span><strong>' + m.dosagem + '</strong></div>' +
      '<div class="modal-med-item"><span>Conservação</span><strong>' + m.conservacao + '</strong></div>' +
    '</div>' +
    '<div class="modal-med-section"><h4>Unidades com estoque (' + m.unidades.length + ')</h4>' + unidadesHtml + '</div>';

  openModal('modal-detalhes');
}

/* ── LIMPAR BUSCA ── */
function limparBusca() {
  document.getElementById('busca-input').value = '';
  filtroAtual.busca = '';
  filtroAtual.categoria = 'todas';
  filtroAtual.disponivel = 'todos';
  document.querySelectorAll('.cat-btn').forEach(function(b){ b.classList.remove('active'); });
  document.querySelector('.cat-btn[data-cat="todas"]').classList.add('active');
  document.querySelectorAll('.disp-btn').forEach(function(b){ b.classList.remove('active'); });
  document.querySelector('.disp-btn[data-disp="todos"]').classList.add('active');
  aplicarFiltros();
}
