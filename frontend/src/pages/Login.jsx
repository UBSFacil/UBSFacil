import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Login.module.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [localError, setLocalError] = useState(null);

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
      await login(formData.email, formData.senha);
      navigate('/home');
    } catch (err) {
      setLocalError(error || 'Falha ao fazer login');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1>UBSFacil - Login</h1>

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
