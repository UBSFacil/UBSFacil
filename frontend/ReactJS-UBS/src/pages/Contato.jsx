import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants, fadeUp, stagger, slideLeft, slideRight, buttonTap } from '../hooks/animations'
import styles from './Contato.module.css'

const faqs = [
  { q:'O UBS Fácil é gratuito?', a:'Sim, 100% gratuito. A plataforma é mantida pelo Ministério da Saúde e não possui nenhum tipo de cobrança.' },
  { q:'Como saber se um medicamento está disponível?', a:'Use a busca na página de Medicamentos. Informe o nome do medicamento para ver as unidades que têm o produto em estoque.' },
  { q:'Preciso de conta para usar?', a:'Para funções básicas como buscar medicamentos e encontrar unidades no mapa não é necessário login. Para funcionalidades personalizadas, autentique via Gov.br.' },
  { q:'Os dados de saúde são protegidos?', a:'Sim. Todos os dados são tratados em conformidade com a LGPD (Lei nº 13.709/2018). A autenticação é feita exclusivamente via Gov.br.' },
  { q:'Como reportar uma informação incorreta?', a:'Use o formulário ao lado selecionando "Unidade de saúde desatualizada". Nossa equipe irá verificar e corrigir junto às secretarias de saúde.' },
]

export default function Contato() {
  const [openFaq,  setOpenFaq]  = useState(null)
  const [sent,     setSent]     = useState(false)
  const [form,     setForm]     = useState({ nome:'', email:'', assunto:'', msg:'' })
  const [errors,   setErrors]   = useState({})

  function validate() {
    const e = {}
    if (!form.nome.trim())  e.nome    = 'Informe seu nome'
    if (!form.email.trim()) e.email   = 'Informe seu e-mail'
    else if (!form.email.includes('@')) e.email = 'E-mail inválido'
    if (!form.assunto)      e.assunto = 'Selecione o assunto'
    if (!form.msg.trim())   e.msg     = 'Escreva sua mensagem'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit() {
    if (!validate()) return
    setSent(true)
    setForm({ nome:'', email:'', assunto:'', msg:'' })
  }

  function Field({ id, label, children, error }) {
    return (
      <div className={styles.frow}>
        <label>{label}</label>
        {children}
        <AnimatePresence>
          {error && <motion.span className={styles.fieldError} initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-4 }} transition={{ duration:.2 }}>{error}</motion.span>}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroGlow}/>
        <motion.div className={styles.heroContent} variants={stagger()} initial="initial" animate="animate">
          <motion.div variants={fadeUp}><span className="hero-badge"><span className="hero-badge-dot"/>Fale com a equipe</span></motion.div>
          <motion.h1 variants={fadeUp}>Entre em <em>contato</em></motion.h1>
          <motion.p variants={fadeUp}>Tem dúvidas, sugestões ou encontrou algum problema? Nossa equipe está pronta para te ajudar.</motion.p>
        </motion.div>
      </div>

      <div className="section" style={{ marginTop:'2.5rem' }}>
        <div className={styles.layout}>

          {/* INFO SIDE */}
          <motion.div className={styles.infoSide} variants={slideLeft} initial="initial" whileInView="animate" viewport={{ once:true }}>
            <div className={styles.infoCard}>
              <h3>Canais de atendimento</h3>
              {[
                { icon:<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>, label:'E-mail', value:'contato@ubsfacil.saude.gov.br' },
                { icon:<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>, label:'Chat', value:'Disponível após login com Gov.br' },
                { icon:<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>, label:'Endereço', value:'Ministério da Saúde, Brasília – DF' },
                { icon:<svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>, label:'Horário', value:'Segunda a sexta, 8h às 18h' },
              ].map((item,i) => (
                <motion.div key={i} className={styles.infoItem} initial={{ opacity:0,x:-12 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ delay:i*.07 }}>
                  <div className={styles.infoIcon}>{item.icon}</div>
                  <div><strong>{item.label}</strong><span>{item.value}</span></div>
                </motion.div>
              ))}
            </div>

            <motion.div className={styles.susBox} initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:.2 }}>
              <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              <div>
                <h3>Central SUS</h3>
                <span className={styles.susNum}>0800 61 1997</span>
                <p>Gratuito · 24 horas · todos os dias<br/>Urgências: ligue 192 (SAMU)</p>
              </div>
            </motion.div>
          </motion.div>

          {/* FORMULÁRIO */}
          <motion.div className={styles.formCard} variants={slideRight} initial="initial" whileInView="animate" viewport={{ once:true }}>
            <h2>Envie sua mensagem</h2>
            <p>Respondemos em até 2 dias úteis.</p>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" className={styles.successMsg} initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}>
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  <div>
                    <strong>Mensagem enviada!</strong>
                    <p>Retornaremos em até 2 dias úteis.</p>
                  </div>
                  <button onClick={() => setSent(false)}>Enviar outra</button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                  <div className={styles.formRow}>
                    <Field id="nome" label="Nome" error={errors.nome}>
                      <input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Seu nome" className={errors.nome?styles.inputError:''}/>
                    </Field>
                    <Field id="email" label="E-mail" error={errors.email}>
                      <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="seu@email.com" className={errors.email?styles.inputError:''}/>
                    </Field>
                  </div>
                  <Field id="assunto" label="Assunto" error={errors.assunto}>
                    <select value={form.assunto} onChange={e=>setForm({...form,assunto:e.target.value})} className={errors.assunto?styles.inputError:''}>
                      <option value="">Selecione o assunto</option>
                      <option>Dúvida sobre medicamentos</option>
                      <option>Problema técnico na plataforma</option>
                      <option>Sugestão de melhoria</option>
                      <option>Unidade de saúde desatualizada</option>
                      <option>Parceria institucional</option>
                      <option>Outro</option>
                    </select>
                  </Field>
                  <Field id="msg" label="Mensagem" error={errors.msg}>
                    <textarea value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} placeholder="Descreva sua dúvida ou sugestão..." rows={5} className={errors.msg?styles.inputError:''}/>
                    <div className={styles.charCount}>{form.msg.length}/500</div>
                  </Field>
                  <motion.button className={`btn btn-primary btn-full ${styles.sendBtn}`} onClick={submit} whileHover={{ scale:1.01 }} whileTap={buttonTap}>
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    Enviar mensagem
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div className={styles.faqCard} initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} style={{ marginTop:'2rem', marginBottom:'3rem' }}>
          <h2>Perguntas frequentes</h2>
          {faqs.map((f,i) => (
            <div key={i} className={styles.faqItem}>
              <button className={styles.faqQ} onClick={() => setOpenFaq(openFaq===i?null:i)}>
                <span>{f.q}</span>
                <motion.svg viewBox="0 0 24 24" animate={{ rotate: openFaq===i ? 180 : 0 }} transition={{ duration:.25 }}>
                  <path d="M7 10l5 5 5-5z"/>
                </motion.svg>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div className={styles.faqA} initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:.25, ease:[0.4,0,0.2,1] }}>
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.main>
  )
}
