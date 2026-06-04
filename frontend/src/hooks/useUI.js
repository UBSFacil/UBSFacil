import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((msg, type = 'error') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200)
  }, [])

  return { toasts, addToast }
}

export function useModal() {
  const [open, setOpen] = useState(false)
  return {
    open,
    openModal:  () => setOpen(true),
    closeModal: () => setOpen(false),
    toggle:     () => setOpen(v => !v),
  }
}

export function usePasswordToggle() {
  const [visible, setVisible] = useState(false)
  return { type: visible ? 'text' : 'password', toggle: () => setVisible(v => !v), visible }
}
