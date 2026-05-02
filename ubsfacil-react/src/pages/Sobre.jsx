import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { pageVariants, fadeUp, stagger, slideLeft, slideRight } from '../hooks/animations'
import styles from './Sobre.module.css'

const pillars = [
  { icon: <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>, color:'#1565c0', title:'Localização inteligente', text:'Encontre UBS, UPAs, hospitais e farmácias populares mais próximos em tempo real.' },
  { icon: <svg viewBox="0 0 24 24"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/></svg>, color:'#26a69a', title:'Busca de medicamentos', text:'Pesquise medicamentos disponíveis nas unidades de saúde antes de se deslocar.' },
  { icon: <svg viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>, color:'#43a047', title:'Cartilha de vacinas', text:'Consulte o calendário vacinal do SUS e mantenha sua vacinação em dia.' },
  { icon: <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>, color:'#fb8c00', title:'Privacidade e segurança', text:'Dados protegidos pela LGPD. Autenticação segura via Gov.br do governo federal.' },
]

const stats = [
  { num:'45k+', label:'Unidades de saúde no Brasil' },
  { num:'213M', label:'Brasileiros atendidos pelo SUS' },
  { num:'100%', label:'Gratuito para o cidadão' },
  { num:'24h',  label:'Central SUS: 0800 61 1997' },
]

const techStack = [
  { label:'HTML5', icon:'🌐', future:false },
  { label:'CSS3', icon:'🎨', future:false },
  { label:'JavaScript', icon:'⚡', future:false },
  { label:'React', icon:'⚛️', future:false },
  { label:'Framer Motion', icon:'🎬', future:false },
  { label:'Google Maps API', icon:'🗺️', future:false },
  { label:'Places API (New)', icon:'📍', future:false },
  { label:'Gov.br Auth', icon:'🔐', future:false },
  { label:'GitHub', icon:'🐙', future:true },
  { label:'Node.js', icon:'🗄️', future:true },
]

const roadmap = [
  { done:true,     title:'Versão 1.0 — HTML/CSS/JS',          desc:'Layout completo, modais, Google Maps, responsivo mobile' },
  { done:true,     title:'Integração Nova Places API',         desc:'Busca por UBS, UPA, hospitais, postos e farmácias' },
  { done:true,     title:'Migração para React + Framer Motion',desc:'Componentização, animações fluidas e roteamento' },
  { inProgress:true, title:'Versionamento no GitHub',          desc:'Organização por branches, PR reviews e CI/CD' },
  { done:false,    title:'Backend Node.js + banco de dados',   desc:'API própria, autenticação real Gov.br, perfis de usuário' },
  { done:false,    title:'Painel Administrativo',              desc:'Gestão de unidades, medicamentos e relatórios' },
  { done:false,    title:'App mobile nativo',                  desc:'iOS e Android com notificações em tempo real' },
]

export default function Sobre() {
  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroGlow}/>
        <motion.div className={styles.heroContent} variants={stagger()} initial="initial" animate="animate">
          <motion.div variants={fadeUp}><span className="hero-badge"><span className="hero-badge-dot"/>Plataforma SUS Digital</span></motion.div>
          <motion.h1 variants={fadeUp}>Sobre o <em>UBS Fácil</em></motion.h1>
          <motion.p variants={fadeUp}>Uma plataforma criada para aproximar os cidadãos brasileiros dos serviços públicos de saúde, tornando o acesso ao SUS mais simples, rápido e digital.</motion.p>
        </motion.div>
      </div>

      {/* MISSÃO */}
      <div className="section" style={{ marginTop:'2.5rem' }}>
        <div className={styles.missionGrid}>
          <motion.div className={styles.missionText} variants={slideLeft} initial="initial" whileInView="animate" viewport={{ once:true }}>
            <h2>Nossa missão</h2>
            <p>O <strong>UBS Fácil</strong> nasceu da necessidade de facilitar o acesso da população brasileira ao Sistema Único de Saúde. Em um país com mais de 45 mil unidades básicas de saúde espalhadas pelo território nacional, encontrar a unidade mais próxima ou verificar se um medicamento está disponível ainda é um desafio para muitos cidadãos.</p>
            <p>Nossa missão é ser a ponte digital entre o cidadão e o SUS — uma plataforma gratuita, acessível e intuitiva que coloca a saúde pública ao alcance de todos, seja no computador ou no celular.</p>
            <p>Desenvolvido com foco em simplicidade, acessibilidade e respeito à privacidade, em conformidade com a LGPD.</p>
          </motion.div>
          <motion.div className={styles.missionStats} variants={slideRight} initial="initial" whileInView="animate" viewport={{ once:true }}>
            {stats.map((s,i) => (
              <motion.div key={i} className={styles.statCard} initial={{ opacity:0, scale:.9 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay: i*.08 }}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLbl}>{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* PILARES */}
      <div className="section">
        <motion.h2 className="section-title" initial={{ opacity:0,x:-20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }}>Pilares do projeto</motion.h2>
        <div className={styles.pillars}>
          {pillars.map((p,i) => (
            <motion.div key={i} className={styles.pillar} initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*.08 }} whileHover={{ y:-4, boxShadow:'0 8px 32px rgba(21,101,192,.12)' }}>
              <div className={styles.pillarIcon} style={{ background: p.color }}>{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TECH STACK */}
      <div className="section">
        <motion.div className={styles.techCard} initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}>
          <h2>Tecnologias utilizadas</h2>
          <div className={styles.techPills}>
            {techStack.map((t,i) => (
              <motion.span key={i} className={`${styles.techPill} ${t.future?styles.future:''}`} initial={{ opacity:0, scale:.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*.04 }} whileHover={{ scale:1.06 }}>
                <span>{t.icon}</span>{t.label}{t.future && <span className={styles.soon}>em breve</span>}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ROADMAP */}
      <div className="section">
        <motion.div className={styles.roadmapCard} initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}>
          <h2>Roadmap do projeto</h2>
          <div className={styles.roadmapList}>
            {roadmap.map((r,i) => (
              <motion.div key={i} className={styles.roadmapItem} initial={{ opacity:0,x:-16 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ delay:i*.06 }}>
                <div className={`${styles.rdDot} ${r.done?styles.rdDone:r.inProgress?styles.rdProgress:styles.rdNext}`}>
                  {r.done ? <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  : r.inProgress ? <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                  : <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>}
                </div>
                <div>
                  <strong>{r.title}</strong>
                  <span>{r.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="section" style={{ marginBottom:'3rem' }}>
        <motion.div className={styles.cta} initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}>
          <h2>Comece a usar agora</h2>
          <p>Acesse gratuitamente todas as funcionalidades. Sem anúncios, sem cobranças.</p>
          <div className={styles.ctaBtns}>
            <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
              <Link to="/unidades" className="btn btn-lg" style={{ background:'#fff', color:'var(--blue)', fontWeight:800 }}>Ver unidades no mapa</Link>
            </motion.div>
            <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
              <Link to="/contato" className="btn btn-ghost btn-lg">Fale com a equipe</Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}
