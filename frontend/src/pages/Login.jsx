import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import styles from './Login.module.css';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [localError, setLocalError] = useState(null);

  // Se a pessoa clicou em "Entrar como ADM", mostramos o formulário já
  // com o contexto de administrador.
  const isAdminIntent = new URLSearchParams(location.search).get('admin') === '1';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.email || !formData.senha) {
      setLocalError('Email e senha são obrigatórios');
      return;
    }

    try {
      const userData = await login(formData.email, formData.senha);

      if (isAdminIntent && !userData?.is_admin) {
        setLocalError('Este usuário não possui permissão de administrador.');
        return;
      }

      navigate(userData?.is_admin ? '/admin' : '/');
    } catch (err) {
      setLocalError(error || 'Falha ao fazer login');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1>{isAdminIntent ? 'UBSFacil - Login ADM' : 'UBSFacil - Login'}</h1>

        {isAdminIntent && (
          <p className={styles.adminHint}>
            Entre com uma conta que tenha permissão de administrador.
          </p>
        )}

        {(localError || error) && (
          <div className={styles.error}>
            {localError || error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Sua senha"
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className={styles.register}>
          Não tem conta? <a href="/cadastro">Cadastre-se aqui</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
