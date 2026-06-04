import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants, fadeUp, stagger, cardHover, buttonTap } from '../hooks/animations'
import Modal from '../components/Modal/Modal'
import styles from './Medicamentos.module.css'

const DB = [
  { id:1, nome:'Amoxicilina 500mg',  categoria:'Antibiótico',  tipo:'Cápsula',    tarja:'vermelha', disponivel:true,  unidades:[{nome:'UBS Jardim Paulista',dist:'1.2km',qtd:48},{nome:'UBS Vila Madalena',dist:'2.4km',qtd:12}], descricao:'Antibiótico de amplo espectro para infecções bacterianas.', uso:'Oral', dosagem:'500mg a cada 8h por 7-10 dias conforme prescrição.' },
  { id:2, nome:'Metformina 850mg',   categoria:'Diabetes',     tipo:'Comprimido', tarja:'vermelha', disponivel:true,  unidades:[{nome:'UBS Centro',dist:'0.8km',qtd:200},{nome:'UBS Ipiranga',dist:'3.1km',qtd:85}], descricao:'Antidiabético oral de primeira linha para diabetes tipo 2.', uso:'Oral', dosagem:'850mg 2x ao dia conforme orientação médica.' },
  { id:3, nome:'Paracetamol 750mg',  categoria:'Analgésico',   tipo:'Comprimido', tarja:'isento',   disponivel:true,  unidades:[{nome:'UBS Mooca',dist:'1.8km',qtd:320},{nome:'UBS Tatuapé',dist:'2.2km',qtd:150}], descricao:'Analgésico e antitérmico para dores leves e febre.', uso:'Oral', dosagem:'750mg a cada 6h, máximo 4 comprimidos/dia.' },
  { id:4, nome:'Losartana 50mg',     categoria:'Hipertensão',  tipo:'Comprimido', tarja:'vermelha', disponivel:true,  unidades:[{nome:'UBS Santana',dist:'2.0km',qtd:60}], descricao:'Anti-hipertensivo antagonista da angiotensina II.', uso:'Oral', dosagem:'50mg 1x ao dia conforme prescrição.' },
  { id:5, nome:'Dipirona 500mg',     categoria:'Analgésico',   tipo:'Comprimido', tarja:'isento',   disponivel:false, unidades:[], descricao:'Analgésico e antitérmico de uso amplo.', uso:'Oral', dosagem:'500mg-1g a cada 6h conforme necessidade.' },
  { id:6, nome:'Atorvastatina 20mg', categoria:'Colesterol',   tipo:'Comprimido', tarja:'vermelha', disponivel:true,  unidades:[{nome:'UBS Lapa',dist:'3.5km',qtd:40}], descricao:'Estatina para hipercolesterolemia e prevenção cardiovascular.', uso:'Oral', dosagem:'20mg 1x ao dia, preferencialmente à noite.' },
  { id:7, nome:'Omeprazol 20mg',     categoria:'Gastro',       tipo:'Cápsula',    tarja:'vermelha', disponivel:true,  unidades:[{nome:'UBS Vila Prudente',dist:'2.8km',qtd:110}], descricao:'Inibidor da bomba de prótons para úlceras e refluxo.', uso:'Oral', dosagem:'20mg 1x ao dia em jejum.' },
  { id:8, nome:'Salbutamol 100mcg',  categoria:'Respiratório', tipo:'Inalador',   tarja:'vermelha', disponivel:true,  unidades:[{nome:'UBS Jabaquara',dist:'4.2km',qtd:25}], descricao:'Broncodilatador para asma e broncoespasmo.', uso:'Inalatório', dosagem:'1-2 jatos conforme necessidade.' },
]

const CATEGORIAS = ['Todas','Analgésico','Antibiótico','Diabetes','Hipertensão','Colesterol','Gastro','Respiratório']

export default function Medicamentos() {
  const [busca,      setBusca]      = useState('')
  const [categoria,  setCategoria]  = useState('Todas')
  const [disponivel, setDisponivel] = useState('todos')
  const [selected,   setSelected]   = useState(null)

  const results = DB.filter(m => {
    const b = busca.toLowerCase()
    const ok1 = !b || m.nome.toLowerCase().includes(b) || m.categoria.toLowerCase().includes(b)
    const ok2 = categoria === 'Todas' || m.categoria === categoria
    const ok3 = disponivel === 'todos' || (disponivel === 'sim' ? m.disponivel : !m.disponivel)
    return ok1 && ok2 && ok3
  })

  const tarjaLabel = t => t === 'vermelha' ? 'Tarja Vermelha' : t === 'preta' ? 'Tarja Preta' : 'Isento'
  const tarjaCls   = t => t === 'vermelha' ? styles.tarjaV : t === 'preta' ? styles.tarjaP : styles.tarjaI

  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className={styles.hero}>
        <div className={styles.heroGlow}/>
        <motion.div variants={stagger()} initial="initial" animate="animate" style={{position:'relative'}}>
          <motion.div variants={fadeUp}><span className="hero-badge"><span className="hero-badge-dot"/>Farmácia do SUS</span></motion.div>
          <motion.h1 variants={fadeUp}>Buscar <em>Medicamentos</em></motion.h1>
          <motion.p variants={fadeUp}>Verifique disponibilidade nas unidades de saúde antes de sair de casa.</motion.p>
        </motion.div>
      </div>

      {/* BUSCA */}
      <div className="section" style={{marginTop:'-28px',position:'relative',zIndex:10}}>
        <motion.div className={styles.searchBox} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.15,duration:.4}}>
          <div className={styles.searchInputWrap}>
            <svg viewBox="0 0 24 24"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/></svg>
            <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Pesquisar medicamento, categoria..."/>
          </div>
          {busca && <motion.button className="btn btn-outline" onClick={()=>setBusca('')} whileTap={buttonTap} style={{padding:'10px 16px',fontSize:13}}>Limpar</motion.button>}
        </motion.div>
      </div>

      {/* FILTROS */}
      <div className="section" style={{marginBottom:'1.2rem'}}>
        <motion.div className={styles.filtersWrap} initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:.4}}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Categoria:</span>
            {CATEGORIAS.map(c => (
              <motion.button key={c} className={`${styles.filterBtn} ${categoria===c?styles.active:''}`} onClick={()=>setCategoria(c)} whileTap={buttonTap}>{c}</motion.button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Disponibilidade:</span>
            {[['todos','Todos'],['sim','● Disponível'],['nao','○ Indisponível']].map(([v,l])=>(
              <motion.button key={v} className={`${styles.filterBtn} ${disponivel===v?styles.active:''}`} onClick={()=>setDisponivel(v)} whileTap={buttonTap}>{l}</motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RESULTADOS */}
      <div className="section">
        <div className={styles.resultsHeader}>
          <span>{results.length} medicamento(s) encontrado(s)</span>
          <span className={styles.resultsInfo}>Dados atualizados pelas UBS</span>
        </div>
        <AnimatePresence mode="popLayout">
          {results.length === 0 ? (
            <motion.div key="empty" className="empty-state" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <svg viewBox="0 0 24 24"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/></svg>
              <p>Nenhum medicamento encontrado. Tente outros termos.</p>
            </motion.div>
          ) : (
            <motion.div key="grid" className={styles.medGrid} variants={stagger(.04)} initial="initial" animate="animate">
              {results.map(m => (
                <motion.div key={m.id} className={styles.medCard} variants={cardHover} initial="rest" whileHover="hover" whileTap={buttonTap} onClick={()=>setSelected(m)}>
                  <div className={styles.medTop}>
                    <div className={styles.medIcon}><svg viewBox="0 0 24 24"><path d="M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm8.5-5c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm2.5 8h-5V7h2v4h3v2z"/></svg></div>
                    <div className={styles.medInfo}>
                      <div className={styles.medNome}>{m.nome}</div>
                      <div className={styles.medMeta}>
                        <span className="badge badge-blue" style={{fontSize:10}}>{m.categoria}</span>
                        <span className="badge" style={{fontSize:10,background:'#f0f4fb',color:'var(--gray-text)'}}>{m.tipo}</span>
                        <span className={`${styles.tarja} ${tarjaCls(m.tarja)}`}>{tarjaLabel(m.tarja)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.medBottom}>
                    <span className={m.disponivel ? styles.dispSim : styles.dispNao}>
                      {m.disponivel ? `● ${m.unidades.length} unidade(s) com estoque` : '○ Indisponível no momento'}
                    </span>
                    <span className={styles.verBtn}>Ver detalhes →</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AVISO */}
      <div className="section" style={{marginBottom:'3rem'}}>
        <motion.div className={styles.aviso} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4}}>
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          <div><strong>Atenção</strong><p>Confirme a disponibilidade pelo telefone da unidade antes de se deslocar. Para diagnóstico, consulte sempre um profissional de saúde.</p></div>
        </motion.div>
      </div>

      {/* MODAL DETALHES */}
      <Modal open={!!selected} onClose={()=>setSelected(null)} maxWidth={500} title={selected?.nome} subtitle={selected ? `${selected.categoria} · ${selected.tipo}` : ''}>
        {selected && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.25}}>
            <div className={styles.modalGrid}>
              <div className={styles.modalItem}><span>Via de uso</span><strong>{selected.uso}</strong></div>
              <div className={styles.modalItem}><span>Dosagem</span><strong>{selected.dosagem}</strong></div>
            </div>
            <p style={{fontSize:13,color:'#555',lineHeight:1.7,marginBottom:'1.2rem'}}>{selected.descricao}</p>
            <h4 style={{fontSize:12,fontWeight:700,color:'var(--gray-text)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'.7rem'}}>Unidades com estoque ({selected.unidades.length})</h4>
            {selected.disponivel && selected.unidades.length > 0
              ? selected.unidades.map((u,i) => (
                  <motion.div key={i} className={styles.unidadeRow} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*.05}}>
                    <div><strong>{u.nome}</strong><span>{u.dist}</span></div>
                    <span className={styles.qtd}>{u.qtd} un.</span>
                  </motion.div>
                ))
              : <p style={{fontSize:13,color:'var(--red)',fontWeight:700}}>Indisponível no momento.</p>
            }
          </motion.div>
        )}
      </Modal>
    </motion.main>
  )
}
