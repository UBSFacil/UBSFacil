import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { modalVariants, overlayVariants } from '../../hooks/animations'
import styles from './Modal.module.css'

export default function Modal({ open, onClose, title, subtitle, children, maxWidth = 420 }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else       document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className={styles.overlay} variants={overlayVariants} initial="initial" animate="animate" exit="exit" onClick={onClose}>
          <motion.div
            className={styles.modal}
            style={{ maxWidth }}
            variants={modalVariants}
            initial="initial" animate="animate" exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.close} onClick={onClose} aria-label="Fechar">
              <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
            {(title || subtitle) && (
              <div className={styles.header}>
                {title    && <h2 className={styles.title}>{title}</h2>}
                {subtitle && <p  className={styles.sub}>{subtitle}</p>}
              </div>
            )}
            <div className={styles.body}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
