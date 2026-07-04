import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm1 10h-2V9h2v3zm0-4h-2V6h2v2z"/></svg>
          </div>
          <div>
            <b>UBS Fácil</b>
            <span>Plataforma SUS Digital</span>
          </div>
        </div>

        <div className={styles.links}>
          <Link to="/">Início</Link>
          <Link to="/medicamentos">Medicamentos</Link>
          <Link to="/unidades">Unidades</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/contato">Contato</Link>
        </div>

        <div className={styles.sus}>
          <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <div>
            <strong>Central SUS</strong>
            <span>0800 61 1997 · 24h</span>
          </div>
        </div>

        <p className={styles.copy}>© 2026 · Ministério da Saúde · Todos os direitos reservados</p>
      </motion.div>
    </footer>
  )
}
