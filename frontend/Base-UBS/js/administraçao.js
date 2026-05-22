/* ============================================================
   js/admin.js — UBS Fácil · Painel Administrativo
   Padrão: funções globais similares ao global.js do projeto
   ============================================================ */

/* ─────────────────────────────────────────
   ESTADO GLOBAL
───────────────────────────────────────── */
const ADM = {
  currentPage: 'dashboard',
};

/* ─────────────────────────────────────────
   NAVEGAÇÃO ENTRE PÁGINAS
───────────────────────────────────────── */
const PAGE_META = {
  dashboard:     { title: 'Dashboard',             breadcrumb: 'Visão geral' },
  unidades:      { title: 'Unidades de Saúde',      breadcrumb: 'Gestão de unidades' },
  medicamentos:  { title: 'Medicamentos',           breadcrumb: 'Gestão de medicamentos' },
  usuarios:      { title: 'Usuários',               breadcrumb: 'Gestão de usuários' },
  alertas:       { title: 'Alertas',                breadcrumb: 'Alertas e notificações' },
  relatorios:    { title: 'Relatórios',             breadcrumb: 'Exportar dados' },
  configuracoes: { title: 'Configurações',          breadcrumb: 'Configurações do sistema' },
};

function admShowPage(pageId) {
  // Esconde todas as páginas
  document.querySelectorAll('.adm-page').forEach(p => p.classList.remove('active'));

  // Ativa a página alvo
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  // Atualiza nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  // Atualiza topbar
  const meta = PAGE_META[pageId] || { title: pageId, breadcrumb: '' };
  const titleEl = document.getElementById('topbar-page-title');
  const breadEl = document.getElementById('topbar-breadcrumb');
  if (titleEl) titleEl.textContent = meta.title;
  if (breadEl) breadEl.textContent = '/ ' + meta.breadcrumb;

  // Fecha sidebar no mobile
  closeSidebar();

  ADM.currentPage = pageId;
}

/* ─────────────────────────────────────────
   SIDEBAR MOBILE
───────────────────────────────────────── */
function openSidebar() {
  document.getElementById('adm-sidebar').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('adm-sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('show');
  document.body.style.overflow = '';
}

function toggleSidebar() {
  const sidebar = document.getElementById('adm-sidebar');
  if (sidebar.classList.contains('open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

/* ─────────────────────────────────────────
   MODAIS
───────────────────────────────────────── */
function admOpenModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.style.display = 'flex';
  // força reflow para a animação funcionar
  void overlay.offsetWidth;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function admCloseModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.classList.remove('open');
  // aguarda transição antes de ocultar
  setTimeout(() => {
    if (!overlay.classList.contains('open')) {
      overlay.style.display = '';
      document.body.style.overflow = '';
    }
  }, 250);
}

// Fecha ao clicar no overlay
function initModalBackdrops() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) admCloseModal(overlay.id);
    });
  });
}

// Fecha com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => admCloseModal(m.id));
  }
});

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
/**
 * admToast(msg, type, duration)
 * type: 'success' | 'error' | 'warning'
 */
function admToast(msg, type = 'success', duration = 3200) {
  const root = document.getElementById('toast-root');
  if (!root) return;

  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="t-ico">${icons[type] || '💬'}</span>${msg}`;
  root.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity .3s, transform .3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => toast.remove(), 320);
  }, duration);
}

/* ─────────────────────────────────────────
   MODAL + TOAST (salvar)
───────────────────────────────────────── */
function admSaveClose(modalId, msg) {
  admCloseModal(modalId);
  admToast(msg, 'success');
}

/* ─────────────────────────────────────────
   FILTRO DE TABELA (busca por texto)
───────────────────────────────────────── */
/**
 * admFilterTable(tableId, query)
 * Filtra as linhas do tbody pelo texto digitado.
 */
function admFilterTable(tableId, query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
  // Atualiza contagem no paginador (simples)
  updatePagInfo(tableId);
}

/**
 * admFilterBySelect(tableId, value, colIndex)
 * Filtra linhas pelo conteúdo de uma coluna específica.
 */
function admFilterBySelect(tableId, value, colIndex) {
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);
  rows.forEach(row => {
    const cell = row.cells[colIndex];
    const match = !value || (cell && cell.textContent.trim().includes(value));
    // só altera se a linha ainda não foi ocultada por outro filtro
    if (!value) {
      row.dataset.colHidden = '';
    } else {
      row.dataset.colHidden = match ? '' : 'true';
    }
    row.style.display = row.dataset.colHidden === 'true' ? 'none' : '';
  });
  updatePagInfo(tableId);
}

function updatePagInfo(tableId) {
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);
  const visible = Array.from(rows).filter(r => r.style.display !== 'none').length;
  const total   = rows.length;
  const info = document.querySelector(`#${tableId}`).closest('.panel, .table-card, .panel')
    ?.querySelector('.pag-info');
  if (info) info.textContent = `Mostrando ${visible} de ${total} resultados`;
}

/* ─────────────────────────────────────────
   GRÁFICO DE BARRAS (dashboard)
───────────────────────────────────────── */
function renderBarChart() {
  const data = [
    { day: 'Seg', val: 58 },
    { day: 'Ter', val: 74 },
    { day: 'Qua', val: 51 },
    { day: 'Qui', val: 86 },
    { day: 'Sex', val: 95 },
    { day: 'Sáb', val: 62 },
    { day: 'Dom', val: 38 },
  ];
  const max = Math.max(...data.map(d => d.val));
  const container = document.getElementById('bar-chart');
  if (!container) return;

  container.innerHTML = data.map((d, i) => {
    const isToday = i === 4; // "Sex" = hoje (ex)
    const pct = Math.round((d.val / max) * 100);
    return `
      <div class="bar-col">
        <div class="bar-fill${isToday ? ' bar-today' : ''}"
             style="height:${pct}%"
             title="${d.val} buscas"></div>
        <span class="bar-day">${d.day}</span>
      </div>`;
  }).join('');
}

/* ─────────────────────────────────────────
   BOTÕES DE LINHA (confirmar exclusão)
───────────────────────────────────────── */
function admConfirmDelete(msg) {
  // Sem depender de bibliotecas externas, usa confirm nativo
  if (window.confirm(msg || 'Confirmar remoção?')) {
    admToast('Item removido com sucesso.', 'error');
  }
}

/* ─────────────────────────────────────────
   CONFIGURAÇÕES — salvar
───────────────────────────────────────── */
function admSaveConfig(sectionName) {
  admToast(`${sectionName} salvas com sucesso!`, 'success');
}

/* ─────────────────────────────────────────
   ANIMAÇÃO DE ENTRADA DOS CARDS KPI
───────────────────────────────────────── */
function animateKpiCards() {
  const cards = document.querySelectorAll('.kpi-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(14px)';
    card.style.transition = `opacity .35s ease ${i * 0.07}s, transform .35s ease ${i * 0.07}s`;
    // força reflow
    void card.offsetWidth;
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Bind nav links
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      admShowPage(link.dataset.page);
    });
  });

  // Backdrop sidebar mobile
  const backdrop = document.getElementById('sidebar-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  // Modais: fechar ao clicar no overlay
  initModalBackdrops();

  // Renderiza gráfico
  renderBarChart();

  // Animação dos KPI cards
  animateKpiCards();

  // Página inicial = dashboard
  admShowPage('dashboard');
});