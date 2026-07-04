# Guia de Integração com API do UBSFacil

## 📁 Estrutura de Serviços

```
src/
├── services/
│   └── api.js              # Instância do Axios + serviços
├── hooks/
│   ├── useAuth.js          # Hook para autenticação
│   └── useApiData.js       # Hook genérico para requisições
└── pages/
    └── Login.jsx           # Exemplo de página de login
```

## 🚀 Configuração Inicial

### 1. Instalar Axios (se não estiver instalado)

```bash
cd frontend/ReactJS-UBS
npm install axios
```

### 2. Configurar URL da API

Editar `.env` com a URL do backend:

```
VITE_API_URL=http://localhost:8000/api
```

Para produção:
```
VITE_API_URL=https://api.ubsfacil.com/api
```

## 📚 Como Usar

### Autenticação - Login

```jsx
import { useAuth } from '../hooks/useAuth';

function MeuComponente() {
  const { login, logout, user, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login('usuario@email.com', 'senha123');
      // Usuário logado! O token está no localStorage
    } catch (error) {
      console.error('Login falhou:', error);
    }
  };

  if (isAuthenticated) {
    return <div>Bem-vindo, {user.nome}!</div>;
  }

  return <button onClick={handleLogin}>Login</button>;
}
```

### Buscar Medicamentos

```jsx
import { medicamentosService } from '../services/api';
import { useApiData } from '../hooks/useApiData';

function Medicamentos() {
  // Buscar todos os medicamentos
  const { data: medicamentos, loading, error } = useApiData(
    () => medicamentosService.buscarTodos()
  );

  // Ou buscar por unidade específica
  // const { data: medicamentos } = useApiData(
  //   () => medicamentosService.buscarPorUnidade(unidadeId),
  //   [unidadeId]
  // );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <ul>
      {medicamentos?.map(med => (
        <li key={med.id}>{med.nome} ({med.categoria})</li>
      ))}
    </ul>
  );
}
```

### Buscar UBSs Próximas

```jsx
import { unidadesService } from '../services/api';

function MapaUBSs() {
  const handleBuscarProximas = async () => {
    try {
      // Obter localização do usuário
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Buscar UBSs dentro de 5km
        const ubss = await unidadesService.buscarProximas(
          latitude,
          longitude,
          5 // raio em km
        );
        
        console.log('UBSs próximas:', ubss);
      });
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return <button onClick={handleBuscarProximas}>Buscar UBSs Próximas</button>;
}
```

### Histórico de Retiradas

```jsx
import { retiradasService } from '../services/api';
import { useApiData } from '../hooks/useApiData';

function MeuHistorico() {
  const { data: historico, loading, error } = useApiData(
    () => retiradasService.historico()
  );

  return (
    <div>
      <h2>Meu Histórico</h2>
      {historico?.map(ret => (
        <div key={ret.id}>
          <p>{ret.medicamento.nome} - {ret.retirado_em}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔐 Segurança

### Token JWT

O token é salvo automaticamente em `localStorage` após login e adicionado a todas as requisições pelo **interceptor** do Axios.

Se o token expirar (erro 401), o usuário é deslogado automaticamente.

### Variáveis Sensíveis

⚠️ **Nunca commitar `.env` com dados sensíveis!**

Use `.env.example` para documentar as variáveis necessárias.

## 📡 Serviços Disponíveis

### `authService`
- `login(email, senha)` - Fazer login
- `me()` - Obter dados do usuário logado
- `logout()` - Deslogar
- `isAuthenticated()` - Verificar se está logado

### `medicamentosService`
- `buscarTodos()` - Todos os medicamentos
- `buscarPorUnidade(unidadeId)` - Medicamentos de uma UBS
- `buscarPorNome(nome)` - Buscar por nome
- `buscarDisponibilidade(medicamentoId)` - Disponibilidade em todas as UBSs

### `unidadesService`
- `buscarTodas()` - Todas as UBSs
- `buscarProximas(lat, lng, raio)` - UBSs próximas
- `buscarPorBairro(bairro)` - Por bairro

### `retiradasService`
- `retirar(medicamentoId, unidadeId)` - Registrar retirada
- `historico()` - Histórico do usuário logado
- `historicoDetalhes(retiradaId)` - Detalhes de uma retirada

### `estoqueService`
- `buscarEstoque(unidadeId)` - Estoque de uma UBS
- `buscarQuantidade(medicamentoId, unidadeId)` - Quantidade específica

## ✅ Checklist de Implementação

- [ ] Axios instalado (`npm install axios`)
- [ ] `.env` configurado com `VITE_API_URL`
- [ ] `.env` no `.gitignore`
- [ ] Login funcionando e token sendo salvo
- [ ] Página de medicamentos carregando dados
- [ ] UBSs próximas usando geolocalização
- [ ] Histórico de retiradas exibindo dados
