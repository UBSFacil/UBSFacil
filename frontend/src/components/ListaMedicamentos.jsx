import { useState } from 'react';
import { medicamentosService } from '../services/api';
import { useApiData } from '../hooks/useApiData';
import styles from './Medicamentos.module.css';

export const ListaMedicamentos = ({ unidadeId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: medicamentos, loading, error, refetch } = useApiData(
    () => unidadeId 
      ? medicamentosService.buscarPorUnidade(unidadeId)
      : medicamentosService.buscarTodos(),
    [unidadeId]
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const results = await medicamentosService.buscarPorNome(searchTerm);
        // Aqui você pode atualizar o estado com os resultados
      } catch (err) {
        console.error('Erro ao buscar:', err);
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando medicamentos...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Erro ao carregar medicamentos: {error}</p>
        <button onClick={refetch}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Buscar medicamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <div className={styles.medicamentosList}>
        {medicamentos && medicamentos.length > 0 ? (
          medicamentos.map((med) => (
            <div key={med.id} className={styles.medicamentoCard}>
              <h3>{med.nome}</h3>
              <p><strong>Categoria:</strong> {med.categoria || 'N/A'}</p>
              <p><strong>Forma:</strong> {med.forma || 'N/A'}</p>
              <p><strong>Quantidade:</strong> {med.quantidade || 0}</p>
            </div>
          ))
        ) : (
          <p>Nenhum medicamento encontrado</p>
        )}
      </div>
    </div>
  );
};

export default ListaMedicamentos;
