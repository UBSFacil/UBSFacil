import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants, fadeUp, stagger, buttonTap } from '../hooks/animations'
import styles from './Unidades.module.css'

const API_KEY    = 'AIzaSyAvZgvllWYU15btO0mUO0QjN6D_pn0xSFM'
const NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby'
const TEXT_URL   = 'https://places.googleapis.com/v1/places:searchText'
const FIELD_MASK = ['places.id','places.displayName','places.formattedAddress','places.location','places.rating','places.currentOpeningHours','places.regularOpeningHours','places.googleMapsUri'].join(',')

const FILTERS = [
  { id:'todos',    label:'Todos',          types:['hospital','pharmacy'], keyword: null },
  { id:'ubs',      label:'UBS',            types:['hospital'],            keyword:'UBS unidade básica saúde' },
  { id:'upa',      label:'UPA',            types:['hospital'],            keyword:'UPA pronto atendimento' },
  { id:'hospital', label:'Hospital',       types:['hospital'],            keyword:'hospital SUS' },
  { id:'posto',    label:'Posto de Saúde', types:['health'],              keyword:'posto de saúde' },
  { id:'farmacia', label:'Farmácia',       types:['pharmacy'],            keyword:'farmácia popular' },
]

function getBadge(name) {
  const n = (name||'').toLowerCase()
  if (n.includes('upa')||n.includes('pronto')) return { label:'UPA',      cls:'b-upa'  }
  if (n.includes('ubs')||n.includes('básica')) return { label:'UBS',      cls:'b-ubs'  }
  if (n.includes('hospital'))                  return { label:'Hospital', cls:'b-hosp' }
  if (n.includes('posto')||n.includes('saúde'))return { label:'Posto',    cls:'b-posto'}
  if (n.includes('farm')||n.includes('drog'))  return { label:'Farmácia', cls:'b-farm' }
  return { label:'Saúde', cls:'b-ubs' }
}

function getColor(name) {
  const n = (name||'').toLowerCase()
  if (n.includes('upa')||n.includes('pronto')) return '#e65100'
  if (n.includes('hospital'))                  return '#c62828'
  if (n.includes('farm')||n.includes('drog'))  return '#6a1b9a'
  if (n.includes('posto'))                     return '#2e7d32'
  return '#1565c0'
}

function calcDist(loc, user) {
  const R = 6371000
  const dLat = (loc.latitude  - user.lat) * Math.PI/180
  const dLng = (loc.longitude - user.lng) * Math.PI/180
  const a = Math.sin(dLat/2)**2 + Math.cos(user.lat*Math.PI/180)*Math.cos(loc.latitude*Math.PI/180)*Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function distLabel(d) { return d < 1000 ? Math.round(d)+'m' : (d/1000).toFixed(1)+'km' }

export default function Unidades() {
  const mapRef     = useRef(null)
  const mapObj     = useRef(null)
  const infoWin    = useRef(null)
  const markersRef = useRef([])
  const userMark   = useRef(null)

  const [loaded,    setLoaded]    = useState(false)
  const [userLoc,   setUserLoc]   = useState(null)
  const [results,   setResults]   = useState([])
  const [filter,    setFilter]    = useState('todos')
  const [radius,    setRadius]    = useState(5000)
  const [status,    setStatus]    = useState('idle') // idle | locating | searching | done | error
  const [selected,  setSelected]  = useState(null)

  /* carrega SDK Google Maps */
  useEffect(() => {
    if (window.google) { setLoaded(true); return }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,geometry`
    script.async = true
    script.onload = () => setLoaded(true)
    document.head.appendChild(script)
  }, [])

  /* inicializa mapa */
  useEffect(() => {
    if (!loaded || !mapRef.current || mapObj.current) return
    mapObj.current = new window.google.maps.Map(mapRef.current, {
      center: { lat:-23.5505, lng:-46.6333 }, zoom: 13,
      mapTypeControl: false, fullscreenControl: false, streetViewControl: false,
      styles: [{ featureType:'poi', elementType:'labels', stylers:[{ visibility:'off' }] }]
    })
    infoWin.current = new window.google.maps.InfoWindow()
  }, [loaded])

  function clearMarkers() {
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
  }

  async function useMyLocation() {
    if (!navigator.geolocation) return
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(pos => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      setUserLoc(loc)
      mapObj.current.setCenter(loc)
      mapObj.current.setZoom(14)
      if (userMark.current) userMark.current.setMap(null)
      userMark.current = new window.google.maps.Marker({
        position: loc, map: mapObj.current,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale:10, fillColor:'#1565c0', fillOpacity:1, strokeColor:'#fff', strokeWeight:3 },
        title:'Você está aqui', zIndex:999
      })
      doSearch(loc, filter, radius)
    }, () => setStatus('error'))
  }

  async function doSearch(loc, filt, rad) {
    setStatus('searching')
    clearMarkers()
    setResults([])
    const cfg = FILTERS.find(f => f.id === filt)
    const url  = cfg.keyword ? TEXT_URL : NEARBY_URL
    const body = cfg.keyword
      ? { textQuery: cfg.keyword, maxResultCount:20, locationBias:{ circle:{ center:{ latitude:loc.lat, longitude:loc.lng }, radius:rad } } }
      : { includedTypes: cfg.types, maxResultCount:20, locationRestriction:{ circle:{ center:{ latitude:loc.lat, longitude:loc.lng }, radius:rad } } }

    try {
      const res  = await fetch(url, { method:'POST', headers:{ 'Content-Type':'application/json', 'X-Goog-Api-Key':API_KEY, 'X-Goog-FieldMask':FIELD_MASK }, body:JSON.stringify(body) })
      const data = await res.json()
      const places = (data.places||[]).sort((a,b) => calcDist(a.location,loc) - calcDist(b.location,loc))
      setResults(places)
      setStatus('done')

      places.forEach((place, i) => {
        const name = place.displayName?.text || 'Unidade'
        const marker = new window.google.maps.Marker({
          position: { lat:place.location.latitude, lng:place.location.longitude },
          map: mapObj.current, title: name,
          icon: {
            path:'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: getColor(name), fillOpacity:1, strokeColor:'#fff', strokeWeight:1.5,
            scale:1.6, anchor: new window.google.maps.Point(12,22)
          }
        })
        marker.addListener('click', () => {
          setSelected(i)
          showInfo(place, loc, marker)
        })
        markersRef.current.push(marker)
      })
    } catch { setStatus('error') }
  }

  function showInfo(place, loc, marker) {
    const name = place.displayName?.text || 'Unidade'
    const dist = distLabel(calcDist(place.location, loc))
    const isOpen = place.currentOpeningHours?.openNow ?? place.regularOpeningHours?.openNow ?? null
    infoWin.current.setContent(
      `<div style="font-family:Nunito,sans-serif;padding:4px;min-width:180px">
        <div style="font-size:14px;font-weight:800;color:#0d2251;margin-bottom:4px">${name}</div>
        <div style="font-size:12px;color:#7a8aaa;margin-bottom:6px">${place.formattedAddress||''}</div>
        <div style="display:flex;gap:8px;align-items:center">
          <span style="font-size:12px;color:#1565c0;font-weight:700">${dist}</span>
          ${isOpen!==null?`<span style="font-size:12px;font-weight:700;color:${isOpen?'#2e7d32':'#c62828'}">${isOpen?'● Aberto':'● Fechado'}</span>`:''}
        </div>
      </div>`
    )
    infoWin.current.open(mapObj.current, marker)
  }

  function handleFilterChange(id) {
    setFilter(id)
    if (userLoc) doSearch(userLoc, id, radius)
  }

  function handleRadiusChange(e) {
    const r = parseInt(e.target.value)
    setRadius(r)
    if (userLoc) doSearch(userLoc, filter, r)
  }

  function clickCard(place, i) {
    setSelected(i)
    const latLng = { lat:place.location.latitude, lng:place.location.longitude }
    mapObj.current.panTo(latLng)
    mapObj.current.setZoom(16)
    showInfo(place, userLoc, markersRef.current[i])
  }

  return (
    <motion.div className={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* HERO STRIP */}
      <div className={styles.heroStrip}>
        <motion.div variants={stagger()} initial="initial" animate="animate">
          <motion.h1 variants={fadeUp}>Unidades de Saúde</motion.h1>
          <motion.p variants={fadeUp}>Encontre UBS, UPA, hospitais e postos próximos a você</motion.p>
        </motion.div>
        <motion.button
          className={styles.locBtn}
          onClick={useMyLocation}
          disabled={status === 'locating' || status === 'searching'}
          whileHover={{ scale: 1.03 }} whileTap={buttonTap}
          initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:.2 }}
        >
          {status === 'locating' || status === 'searching'
            ? <><div className={styles.locSpinner}/>{status==='locating'?'Obtendo localização...':'Buscando...'}</>
            : <><svg viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>Usar minha localização</>
          }
        </motion.button>
      </div>

      {/* FILTROS */}
      <div className={styles.filtersBar}>
        {FILTERS.map(f => (
          <motion.button
            key={f.id}
            className={`${styles.filterBtn} ${filter===f.id ? styles.active : ''}`}
            onClick={() => handleFilterChange(f.id)}
            whileTap={buttonTap}
          >
            {f.label}
          </motion.button>
        ))}
        <div className={styles.radiusWrap}>
          <label>Raio:</label>
          <select value={radius} onChange={handleRadiusChange}>
            <option value={2000}>2 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={20000}>20 km</option>
          </select>
        </div>
      </div>

      {/* MAIN */}
      <div className={styles.main}>

        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div>
              <h2>Resultados</h2>
              <span>
                {status === 'idle'      && 'Clique em "Usar minha localização"'}
                {status === 'locating'  && 'Obtendo localização...'}
                {status === 'searching' && 'Buscando unidades...'}
                {status === 'done'      && `${results.length} unidade(s) encontrada(s)`}
                {status === 'error'     && 'Erro ao carregar. Tente novamente.'}
              </span>
            </div>
          </div>

          <div className={styles.resultsList}>
            {(status === 'idle' || status === 'locating') && (
              <div className="empty-state">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <p>Permita o acesso à sua localização para ver unidades próximas.</p>
              </div>
            )}

            {status === 'searching' && (
              <div className="empty-state">
                <div className="spinner" style={{margin:'0 auto 1rem'}}/>
                <p>Buscando unidades próximas...</p>
              </div>
            )}

            {status === 'done' && results.length === 0 && (
              <div className="empty-state">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <p>Nenhuma unidade encontrada. Tente aumentar o raio.</p>
              </div>
            )}

            <AnimatePresence>
              {status === 'done' && results.map((place, i) => {
                const name   = place.displayName?.text || 'Unidade'
                const dist   = userLoc ? distLabel(calcDist(place.location, userLoc)) : ''
                const isOpen = place.currentOpeningHours?.openNow ?? place.regularOpeningHours?.openNow ?? null
                const badge  = getBadge(name)

                return (
                  <motion.div
                    key={place.id}
                    className={`${styles.resultCard} ${selected===i ? styles.selectedCard : ''}`}
                    onClick={() => clickCard(place, i)}
                    initial={{ opacity:0, x:-16 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay: i*0.04, duration:0.3 }}
                    whileHover={{ x: 3 }}
                  >
                    <div className={styles.resultTop}>
                      <div className={styles.resultName}>{name}</div>
                      <span className={`${styles.resultBadge} ${styles[badge.cls]}`}>{badge.label}</span>
                    </div>
                    <div className={styles.resultAddr}>{place.formattedAddress||''}</div>
                    <div className={styles.resultMeta}>
                      <span className={styles.resultDist}>{dist}</span>
                      {isOpen !== null && <span className={isOpen ? styles.rOpen : styles.rClosed}>{isOpen ? '● Aberto' : '● Fechado'}</span>}
                      {place.rating && <span className={styles.stars}>★ {place.rating.toFixed(1)}</span>}
                      <button className={styles.routeBtn} onClick={e => { e.stopPropagation(); window.open(`https://www.google.com/maps/dir/?api=1&destination_place_id=${place.id}`,'_blank') }}>Rota ↗</button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* MAPA */}
        <div className={styles.mapWrap}>
          {!loaded && (
            <div className={styles.mapLoading}>
              <div className="spinner"/>
              <p>Carregando mapa...</p>
            </div>
          )}
          <div ref={mapRef} className={styles.map}/>
        </div>
      </div>
    </motion.div>
  )
}
