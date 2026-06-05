import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Navbar.module.css'

const links = [
  { to: '/',             label: 'Início' },
  { to: '/medicamentos', label: 'Medicamentos' },
  { to: '/unidades',     label: 'Unidades' },
  { to: '/sobre',        label: 'Sobre' },
  { to: '/contato',      label: 'Contato' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [scrolled,    setScrolled]    = useState(false)
  const [drawerOpen,  setDrawerOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setDrawerOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <>
      <motion.nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <Link to="/" className={styles.logo}>
          <motion.div className={styles.logoIcon} whileHover={{ rotate: 10, scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm1 10h-2V9h2v3zm0-4h-2V6h2v2z"/></svg>
          </motion.div>
          <div className={styles.logoText}>
            <b>UBS Fácil</b>
            <span>Plataforma SUS Digital</span>
          </div>
        </Link>

        <div className={styles.links}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`${styles.link} ${pathname === l.to ? styles.active : ''}`}
            >
              {l.label}
              {pathname === l.to && (
                <motion.span className={styles.activeBar} layoutId="navActiveBar" />
              )}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link to="/" className="btn btn-outline" style={{ fontSize: 13, padding: '7px 16px' }}>Cadastrar</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link to="/" className="btn btn-primary" style={{ fontSize: 13, padding: '7px 16px' }}>Entrar com Gov.br</Link>
          </motion.div>
        </div>

        <motion.button
          className={styles.hamburger}
          onClick={() => setDrawerOpen(v => !v)}
          whileTap={{ scale: 0.9 }}
          aria-label="Menu"
        >
          <motion.span animate={{ rotate: drawerOpen ? 45 : 0, y: drawerOpen ? 7 : 0 }} />
          <motion.span animate={{ opacity: drawerOpen ? 0 : 1, x: drawerOpen ? -8 : 0 }} />
          <motion.span animate={{ rotate: drawerOpen ? -45 : 0, y: drawerOpen ? -7 : 0 }} />
        </motion.button>
      </motion.nav>

      {/* DRAWER MOBILE */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className={styles.drawerBg}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className={styles.drawer}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className={styles.drawerHeader}>
                <div className={styles.logoText}><b>UBS Fácil</b><span>Plataforma SUS Digital</span></div>
                <button className={styles.drawerClose} onClick={() => setDrawerOpen(false)}>×</button>
              </div>
              <div className={styles.drawerLinks}>
                {links.map((l, i) => (
                  <motion.div key={l.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={l.to} className={`${styles.drawerLink} ${pathname === l.to ? styles.drawerLinkActive : ''}`}>
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className={styles.drawerBtns}>
                <Link to="/" className="btn btn-outline btn-full">Cadastrar</Link>
                <Link to="/" className="btn btn-primary btn-full">Entrar com Gov.br</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
