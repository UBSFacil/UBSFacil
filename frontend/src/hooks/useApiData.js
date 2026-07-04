import { useState, useEffect } from 'react';

/**
 * Hook genérico para fazer requisições de API
 * @param {Function} apiCall - Função que retorna uma Promise (ex: medicamentosService.buscarTodos)
 * @param {Array} dependencies - Dependências para re-executar a requisição
 * @returns {Object} { data, loading, error, refetch }
 */
export const useApiData = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Erro ao buscar dados');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
};

export default useApiData;
