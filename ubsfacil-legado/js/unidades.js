/* ============================================
   UBS FÁCIL — JS UNIDADES
   Google Maps + Nova Places API REST
   ============================================ */

const API_KEY   = 'AIzaSyAvZgvllWYU15btO0mUO0QjN6D_pn0xSFM';
const NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby';
const TEXT_URL   = 'https://places.googleapis.com/v1/places:searchText';
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.currentOpeningHours',
  'places.regularOpeningHours',
  'places.nationalPhoneNumber',
  'places.googleMapsUri'
].join(',');

var map, infoWindow, userMarker;
var markers    = [];
var allResults = [];
var currentFilter = 'todos';
var userLocation  = null;

var filterConfig = {
  todos:    { types: ['hospital','health_and_beauty_shop','pharmacy'], keyword: null },
  ubs:      { types: ['hospital'], keyword: 'UBS unidade básica saúde' },
  upa:      { types: ['hospital'], keyword: 'UPA pronto atendimento' },
  hospital: { types: ['hospital'], keyword: 'hospital SUS' },
  posto:    { types: ['health_and_beauty_shop'], keyword: 'posto de saúde' },
  farmacia: { types: ['pharmacy','drugstore'], keyword: 'farmácia popular' }
};

/* ── BADGE & COR ── */
function getBadge(name) {
  var n = (name || '').toLowerCase();
  if (n.includes('upa') || n.includes('pronto atend')) return { label: 'UPA',      cls: 'b-upa'  };
  if (n.includes('ubs') || n.includes('básica') || n.includes('basica')) return { label: 'UBS', cls: 'b-ubs' };
  if (n.includes('hospital'))  return { label: 'Hospital', cls: 'b-hosp'  };
  if (n.includes('posto') || n.includes('centro de saúde')) return { label: 'Posto', cls: 'b-posto' };
  if (n.includes('farm') || n.includes('drog')) return { label: 'Farmácia', cls: 'b-farm' };
  return { label: 'Saúde', cls: 'b-ubs' };
}
function getMarkerColor(name) {
  var n = (name || '').toLowerCase();
  if (n.includes('upa') || n.includes('pronto')) return '#e65100';
  if (n.includes('hospital'))  return '#c62828';
  if (n.includes('farm') || n.includes('drog')) return '#6a1b9a';
  if (n.includes('posto'))     return '#2e7d32';
  return '#1565c0';
}

/* ── INIT MAP ── */
function initMap() {
  document.getElementById('map-loading').style.display = 'none';
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -23.5505, lng: -46.6333 },
    zoom: 13,
    mapTypeControl: false, fullscreenControl: false, streetViewControl: false,
    styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
  });
  infoWindow = new google.maps.InfoWindow();
}

/* ── LOCALIZAÇÃO ── */
function useMyLocation() {
  if (!navigator.geolocation) { showToast('Geolocalização não suportada.'); return; }
  var btn = document.getElementById('loc-btn');
  var txt = document.getElementById('loc-txt');
  btn.disabled = true;
  txt.textContent = 'Obtendo localização...';

  navigator.geolocation.getCurrentPosition(function (pos) {
    userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    map.setCenter(userLocation);
    map.setZoom(14);
    txt.textContent = 'Localização obtida ✓';
    btn.disabled = false;

    if (userMarker) userMarker.setMap(null);
    userMarker = new google.maps.Marker({
      position: userLocation, map: map,
      icon: { path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#1565c0', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 },
      title: 'Você está aqui', zIndex: 999
    });
    searchPlaces();
  }, function () {
    txt.textContent = 'Usar minha localização';
    btn.disabled = false;
    showToast('Não foi possível obter sua localização.');
  });
}

/* ── FILTRO & RAIO ── */
function setFilter(f) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
  document.getElementById('f-' + f).classList.add('active');
  if (userLocation) searchPlaces();
}
function onRadiusChange() { if (userLocation) searchPlaces(); }

/* ── BUSCA NA NOVA API ── */
async function searchPlaces() {
  if (!userLocation) return;
  clearMarkers();
  allResults = [];
  document.getElementById('result-count').textContent = 'Buscando...';
  document.getElementById('results-list').innerHTML =
    '<div class="empty-state"><div class="spinner"></div><p>Buscando unidades próximas...</p></div>';

  var cfg    = filterConfig[currentFilter];
  var radius = parseInt(document.getElementById('radius-sel').value);
  var url    = cfg.keyword ? TEXT_URL : NEARBY_URL;
  var body   = cfg.keyword
    ? { textQuery: cfg.keyword, maxResultCount: 20, locationBias: { circle: { center: { latitude: userLocation.lat, longitude: userLocation.lng }, radius: radius } } }
    : { includedTypes: cfg.types, maxResultCount: 20, locationRestriction: { circle: { center: { latitude: userLocation.lat, longitude: userLocation.lng }, radius: radius } } };

  try {
    var res  = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': API_KEY, 'X-Goog-FieldMask': FIELD_MASK }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error('API ' + res.status);
    var data = await res.json();
    allResults = data.places || [];
    renderResults();
  } catch (err) {
    console.error(err);
    showToast('Erro ao buscar unidades. Tente novamente.');
    document.getElementById('results-list').innerHTML =
      '<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg><p>Erro ao carregar. Verifique a conexão.</p></div>';
    document.getElementById('result-count').textContent = 'Erro na busca';
  }
}

/* ── DISTÂNCIA ── */
function calcDist(loc) {
  var R = 6371000, dLat = (loc.latitude - userLocation.lat) * Math.PI / 180, dLng = (loc.longitude - userLocation.lng) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(loc.latitude * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── RENDERIZA LISTA + MARCADORES ── */
function renderResults() {
  clearMarkers();
  var list = document.getElementById('results-list');
  if (!allResults.length) {
    list.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg><p>Nenhuma unidade encontrada. Tente aumentar o raio.</p></div>';
    document.getElementById('result-count').textContent = '0 unidades encontradas';
    return;
  }

  allResults.sort(function (a, b) { return calcDist(a.location) - calcDist(b.location); });
  document.getElementById('result-count').textContent = allResults.length + ' unidades encontradas';
  list.innerHTML = '';

  allResults.forEach(function (place, i) {
    var name    = place.displayName ? place.displayName.text : 'Unidade de Saúde';
    var addr    = place.formattedAddress || '';
    var dist    = calcDist(place.location);
    var distTxt = dist < 1000 ? Math.round(dist) + 'm' : (dist / 1000).toFixed(1) + 'km';
    var rating  = place.rating ? '★ ' + place.rating.toFixed(1) : '';
    var badge   = getBadge(name);
    var isOpen  = null;
    if (place.currentOpeningHours) isOpen = place.currentOpeningHours.openNow;
    else if (place.regularOpeningHours) isOpen = place.regularOpeningHours.openNow;

    var card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML =
      '<div class="result-top"><div class="result-name">' + name + '</div><span class="result-badge ' + badge.cls + '">' + badge.label + '</span></div>' +
      '<div class="result-addr">' + addr + '</div>' +
      '<div class="result-meta">' +
        '<span class="result-dist">' + distTxt + '</span>' +
        (isOpen !== null ? '<span class="' + (isOpen ? 'r-open' : 'r-closed') + '">' + (isOpen ? '● Aberto' : '● Fechado') + '</span>' : '') +
        (rating ? '<span class="result-stars">' + rating + '</span>' : '') +
        '<button class="route-btn" onclick="openRoute(\'' + place.id + '\',event)">Rota ↗</button>' +
      '</div>';

    var latLng = { lat: place.location.latitude, lng: place.location.longitude };
    card.addEventListener('click', function () {
      document.querySelectorAll('.result-card').forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      map.panTo(latLng);
      map.setZoom(16);
      showInfo(name, addr, distTxt, isOpen, rating, markers[i]);
    });
    list.appendChild(card);

    var marker = new google.maps.Marker({
      position: latLng, map: map, title: name,
      icon: { path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', fillColor: getMarkerColor(name), fillOpacity: 1, strokeColor: '#fff', strokeWeight: 1.5, scale: 1.6, anchor: new google.maps.Point(12, 22) }
    });

    (function (n, a, d, o, r, m, idx) {
      m.addListener('click', function () {
        document.querySelectorAll('.result-card').forEach(function (c) { c.classList.remove('selected'); });
        var cards = list.querySelectorAll('.result-card');
        if (cards[idx]) { cards[idx].classList.add('selected'); cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
        showInfo(n, a, d, o, r, m);
      });
    })(name, addr, distTxt, isOpen, rating, marker, i);

    markers.push(marker);
  });
}

function showInfo(name, addr, dist, isOpen, rating, marker) {
  infoWindow.setContent(
    '<div style="font-family:Nunito,sans-serif;padding:4px;min-width:190px;">' +
    '<div style="font-size:14px;font-weight:800;color:#0d2251;margin-bottom:4px;">' + name + '</div>' +
    '<div style="font-size:12px;color:#7a8aaa;margin-bottom:7px;">' + addr + '</div>' +
    '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">' +
    '<span style="font-size:12px;color:#1565c0;font-weight:700;">' + dist + '</span>' +
    (isOpen !== null ? '<span style="font-size:12px;font-weight:700;color:' + (isOpen ? '#2e7d32' : '#c62828') + '">' + (isOpen ? '● Aberto' : '● Fechado') + '</span>' : '') +
    (rating ? '<span style="font-size:12px;color:#f59e0b;">' + rating + '</span>' : '') +
    '</div></div>'
  );
  infoWindow.open(map, marker);
}

function openRoute(placeId, e) { e.stopPropagation(); window.open('https://www.google.com/maps/dir/?api=1&destination_place_id=' + placeId, '_blank'); }
function clearMarkers() { markers.forEach(function (m) { m.setMap(null); }); markers = []; }
