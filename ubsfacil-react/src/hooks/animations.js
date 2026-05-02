/* Variantes reutilizáveis para Framer Motion */

export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
}

export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
}

export const stagger = (delay = 0.08) => ({
  animate: { transition: { staggerChildren: delay } },
})

export const slideLeft = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}

export const slideRight = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
}

export const modalVariants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1,   y: 0,  transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] } },
  exit:    { opacity: 0, scale: 0.94, y: 10, transition: { duration: 0.2 } },
}

export const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

export const cardHover = {
  rest:  { y: 0,  boxShadow: '0 2px 12px rgba(21,101,192,0.07)', transition: { duration: 0.25, ease: 'easeOut' } },
  hover: { y: -4, boxShadow: '0 8px 32px rgba(21,101,192,0.15)', transition: { duration: 0.25, ease: 'easeOut' } },
}

export const buttonTap = { scale: 0.96 }
