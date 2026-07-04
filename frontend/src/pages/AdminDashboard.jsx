import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext';
import { useApiData } from '../hooks/useApiData';
import { unidadesService, medicamentosService } from '../services/api';
import { fadeUp, stagger } from '../hooks/animations';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const { data: unidades, loading: loadingUnidades, error: errorUnidades } = useApiData(
    unidadesService.buscarTodas
  );
  const { data: medicamentos, loading: loadingMedicamentos, error: errorMedicamentos } = useApiData(
    medicamentosService.buscarTodos
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const kpis = [
    { label: 'Unidades de saúde', value: unidades?.length ?? '—', loading: loadingUnidades },
    { label: 'Medicamentos cadastrados', value: medicamentos?.length ?? '—', loading: loadingMedicamentos },
  ];

  return (
    <motion.div
      className={styles.wrap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className={styles.header}>
        <div>
          <h1>Painel ADM</h1>
          <p>Bem-vindo(a), {user?.nome || 'Administrador'}.</p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/" className={styles.backBtn}>← Voltar ao início</Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sair</button>
        </div>
      </div>

      <motion.div className={styles.kpiGrid} variants={stagger()} initial="initial" animate="animate">
        {kpis.map((kpi) => (
          <motion.div key={kpi.label} className={styles.kpiCard} variants={fadeUp}>
            <span className={styles.kpiLabel}>{kpi.label}</span>
            <span className={styles.kpiValue}>{kpi.loading ? '...' : kpi.value}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className={styles.panel}>
        <h2>Unidades de saúde</h2>
        {loadingUnidades && <p className={styles.muted}>Carregando unidades...</p>}
        {errorUnidades && (
          <p className={styles.muted}>
            Não foi possível carregar as unidades ({errorUnidades}). Verifique se o backend está rodando.
          </p>
        )}
        {!loadingUnidades && !errorUnidades && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Endereço</th>
                <th>Bairro</th>
              </tr>
            </thead>
            <tbody>
              {(unidades || []).map((u) => (
                <tr key={u.id}>
                  <td>{u.nome}</td>
                  <td>{u.endereco}</td>
                  <td>{u.bairro}</td>
                </tr>
              ))}
              {(!unidades || unidades.length === 0) && (
                <tr>
                  <td colSpan={3} className={styles.muted}>Nenhuma unidade cadastrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
