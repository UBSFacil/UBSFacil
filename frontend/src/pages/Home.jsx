import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { pageVariants, fadeUp, stagger, cardHover, buttonTap } from '../hooks/animations'
import Modal from '../components/Modal/Modal'
import { useModal, usePasswordToggle } from '../hooks/useUI'
import styles from './Home.module.css'

/* ── DADOS DAS AÇÕES ── */
const actions = [
  { id: 'remedios', icon: <svg viewBox="0 0 24 24"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/></svg>, label: 'Buscar Remédios', href: '/medicamentos' },
  { id: 'unidades', icon: <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>, label: 'Rede de Saúde', href: '/unidades' },
  { id: 'vacinas',  icon: <svg viewBox="0 0 24 24"><path d="M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm8.5-5l-1.41 1.41L15.17 8H9v2h6.17l-1.59 1.59L15 13l4-4z"/></svg>, label: 'Cartilha de Vacinas', modal: 'vacinas' },
  { id: 'certidao', icon: <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>, label: 'Valida Certidão', modal: 'certidao' },
  { id: 'fale',     icon: <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>, label: 'Fale com o SUS', href: '/contato' },
  { id: 'sobre',    icon: <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>, label: 'Sobre o SUS', href: '/sobre' },
  { id: 'termos',   icon: <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>, label: 'Termos de Uso', modal: 'termos' },
]

function AuthCard() {
  const [activeTab, setActiveTab] = useState('cad')
  const pw = usePasswordToggle()
  const isCad = activeTab === 'cad'

  return (
    <div className={styles.authCard}>
      <motion.div className={styles.authHead} key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <h2>{isCad ? 'Criar sua conta' : 'Bem-vindo de volta'}</h2>
        <p>{isCad ? 'Acesse todos os recursos do UBS Fácil' : 'Entre na sua conta UBS Fácil'}</p>
      </motion.div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'cad' ? 'active' : ''}`} onClick={() => setActiveTab('cad')}>Cadastrar</button>
        <button className={`tab ${activeTab === 'log' ? 'active' : ''}`} onClick={() => setActiveTab('log')}>Entrar</button>
      </div>

      <motion.div key={activeTab + '-body'} initial={{ opacity: 0, x: isCad ? -12 : 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
        <button className="gov-btn">
          <span className="gov-pill">gov</span>
          <div>
            <span className="gov-lbl">{isCad ? 'Cadastrar' : 'Entrar'} com Gov.br</span>
            <span className="gov-sub">Conta única do governo federal</span>
          </div>
        </button>

        {!isCad && (
          <>
            <div className="divider"><span>ou use seu e-mail</span></div>
            <div className="frow">
              <label>E-mail ou CPF</label>
              <input type="text" placeholder="seu@email.com ou 000.000.000-00"/>
            </div>
            <div className="frow">
              <label>Senha</label>
              <div className="pass-wrap">
                <input type={pw.type} placeholder="••••••••"/>
                <button className="eye-btn" type="button" onClick={pw.toggle}>
                  <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                </button>
              </div>
            </div>
            <div style={{ textAlign:'right', marginBottom: 14 }}>
              <a style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 700, cursor: 'pointer' }}>Esqueci minha senha</a>
            </div>
            <motion.button className="btn btn-primary btn-full" style={{ fontSize: 15, fontWeight: 800, padding: 13, borderRadius: 10, marginTop: 4 }} whileTap={buttonTap} whileHover={{ scale: 1.01 }}>
              Entrar na plataforma
            </motion.button>
          </>
        )}

        <p style={{ textAlign:'center', marginTop: '1rem', fontSize: 13, color: 'var(--gray-text)' }}>
          {isCad ? 'Já tem conta? ' : 'Não tem conta? '}
          <a style={{ color: 'var(--blue)', fontWeight: 700, cursor: 'pointer' }} onClick={() => setActiveTab(isCad ? 'log' : 'cad')}>
            {isCad ? 'Entrar agora' : 'Cadastre-se grátis'}
          </a>
        </p>
      </motion.div>

      <div className="secure-row">
        <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
        <span>Plataforma segura · Ministério da Saúde · dados protegidos</span>
      </div>
    </div>
  )
}

export default function Home() {
  const [openModal, setOpenModal] = useState(null)

  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <motion.div className={styles.heroContent} variants={stagger()} initial="initial" animate="animate">
          <motion.div variants={fadeUp}>
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Plataforma SUS Digital
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp}>
            Saúde pública <em>mais perto de você</em>
          </motion.h1>
          <motion.p variants={fadeUp}>
            Encontre unidades de saúde e medicamentos disponíveis na sua região, de forma rápida e totalmente gratuita.
          </motion.p>
          <motion.div className={styles.heroBtns} variants={fadeUp}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={buttonTap}>
              <Link to="/medicamentos" className="btn btn-lg" style={{ background:'#fff', color:'var(--blue)', fontWeight:800 }}>
                <svg viewBox="0 0 24 24" style={{fill:'var(--blue)'}}><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/></svg>
                Buscar medicamento
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={buttonTap}>
              <Link to="/unidades" className="btn btn-ghost btn-lg">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Ver unidades no mapa
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* AUTH CARD */}
      <div className={styles.authWrap}>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.2, duration: 0.5, ease: [0.4,0,0.2,1] }}>
          <AuthCard />
        </motion.div>
      </div>

      {/* SEARCH */}
      <div className="section">
        <motion.div className={styles.searchCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:'var(--dark)', marginBottom:'1rem' }}>Pesquisa rápida de medicamentos</h2>
          <div className={styles.searchRow}>
            <div className={styles.searchField}>
              <label>Medicamento</label>
              <input type="text" placeholder="Ex: Amoxicilina, Paracetamol, Metformina..."/>
            </div>
            <div className={styles.searchField}>
              <label>Cidade ou CEP</label>
              <input type="text" placeholder="Ex: São Paulo ou 01310-100"/>
            </div>
            <Link to="/medicamentos" className="btn btn-primary" style={{ alignSelf:'flex-end', padding:'10px 22px', gap:7, borderRadius:8 }}>
              <svg viewBox="0 0 24 24"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/></svg>
              Buscar
            </Link>
          </div>
        </motion.div>
      </div>

      {/* AÇÕES */}
      <div className="section">
        <motion.h2 className="section-title" initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.4 }}>
          Ações
        </motion.h2>
        <div className={styles.actionsGrid}>
          {actions.map((a, i) => {
            const inner = (
              <motion.div
                key={a.id}
                className={styles.actionCard}
                variants={cardHover}
                initial="rest" whileHover="hover" whileTap={buttonTap}
                initial2={{ opacity:0, y:20 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
              >
                <div className={styles.actionIcon}>{a.icon}</div>
                <span>{a.label}</span>
              </motion.div>
            )
            return a.href
              ? <Link key={a.id} to={a.href} style={{ textDecoration:'none' }}>{inner}</Link>
              : <div key={a.id} onClick={() => setOpenModal(a.modal)}>{inner}</div>
          })}
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="section" style={{ marginBottom:'3rem' }}>
        <div className={styles.infoGrid}>
          {[
            { badge: 'SUS Digital', badgeCls: 'badge-blue', title: 'Acesso gratuito à saúde pública', text: 'Consulte a disponibilidade de medicamentos em unidades básicas de saúde próximas a você em tempo real.', accent: true },
            { badge: 'Ministério da Saúde', badgeCls: 'badge-teal', title: 'Dados atualizados pelas UBS', text: 'As informações são fornecidas diretamente pelas unidades de saúde cadastradas na plataforma SUS Digital.' },
          ].map((c, i) => (
            <motion.div key={i} className={`${styles.infoCard} ${c.accent ? styles.infoCardAccent : ''}`} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.1, duration:0.4 }}>
              <span className={`badge ${c.badgeCls}`}>{c.badge}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAIS */}
      <Modal open={openModal === 'vacinas'} onClose={() => setOpenModal(null)} title="Cartilha de Vacinas" subtitle="Consulte o calendário vacinal do SUS.">
        <div className="frow"><label>CPF ou CNS</label><input type="text" placeholder="000.000.000-00"/></div>
        <div className="frow"><label>Data de nascimento</label><input type="text" placeholder="dd/mm/aaaa"/></div>
        <div className="frow"><label>Calendário</label><select><option>Criança (0–10 anos)</option><option>Adolescente (11–19)</option><option>Adulto (20–59)</option><option>Idoso (60+)</option></select></div>
        <motion.button className="btn btn-primary btn-full" style={{padding:13,fontSize:15,fontWeight:800,borderRadius:10}} whileTap={buttonTap}>Ver cartilha</motion.button>
      </Modal>

      <Modal open={openModal === 'certidao'} onClose={() => setOpenModal(null)} title="Validar Certidão" subtitle="Verifique a autenticidade de documentos do SUS.">
        <div className="frow"><label>Código de autenticação</label><input type="text" placeholder="Cole o código aqui..."/></div>
        <div className="frow"><label>Tipo de documento</label><select><option>Cartilha de Vacinas</option><option>Atestado Médico</option><option>Laudo</option><option>Receita Digital</option></select></div>
        <motion.button className="btn btn-primary btn-full" style={{padding:13,fontSize:15,fontWeight:800,borderRadius:10}} whileTap={buttonTap}>Validar documento</motion.button>
      </Modal>

      <Modal open={openModal === 'termos'} onClose={() => setOpenModal(null)} title="Termos de Uso" subtitle="Plataforma UBS Fácil · Ministério da Saúde">
        <div style={{fontSize:13,color:'#555',lineHeight:1.7,maxHeight:240,overflowY:'auto',border:'0.5px solid var(--gray-border2)',borderRadius:9,padding:'1rem',marginBottom:'1rem'}}>
          <p style={{fontWeight:700,color:'var(--dark)',marginBottom:'.5rem'}}>1. Uso da plataforma</p>
          <p style={{marginBottom:'1rem'}}>O UBS Fácil é uma plataforma pública do Ministério da Saúde destinada à consulta de informações sobre medicamentos e unidades de saúde do SUS.</p>
          <p style={{fontWeight:700,color:'var(--dark)',marginBottom:'.5rem'}}>2. Dados pessoais</p>
          <p style={{marginBottom:'1rem'}}>Os dados são tratados conforme a LGPD e utilizados exclusivamente para melhorar os serviços.</p>
          <p style={{fontWeight:700,color:'var(--dark)',marginBottom:'.5rem'}}>3. Responsabilidade</p>
          <p>As informações têm caráter informativo. Para diagnóstico, consulte um profissional de saúde.</p>
        </div>
        <motion.button className="btn btn-primary btn-full" style={{padding:13,fontSize:15,fontWeight:800,borderRadius:10}} whileTap={buttonTap} onClick={() => setOpenModal(null)}>Li e concordo</motion.button>
      </Modal>
    </motion.main>
  )
}
