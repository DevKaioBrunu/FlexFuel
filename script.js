// Estado
const STORAGE_KEYS={vehicles:'ff_vehicles',history:'ff_history',selected:'ff_selected_vehicle',theme:'ff_theme'};

function readStored(key,fallback=''){
  try{
    return localStorage.getItem(key) ?? sessionStorage.getItem(key) ?? fallback;
  }catch(e){
    try{return sessionStorage.getItem(key) ?? fallback;}catch(err){return fallback;}
  }
}

function writeStored(key,value){
  try{localStorage.setItem(key,value);}catch(e){}
  try{sessionStorage.setItem(key,value);}catch(e){}
}

let vehicles = JSON.parse(readStored(STORAGE_KEYS.vehicles,'[]'));
let history  = JSON.parse(readStored(STORAGE_KEYS.history,'[]'));
let selectedVehicleId = readStored(STORAGE_KEYS.selected,'') || null;

function normalizeVehicle(v){
  return {...v,tipo:v.tipo==='moto'?'moto':'carro'};
}

vehicles=vehicles.map(normalizeVehicle);

function vehicleTypeLabel(type){
  return type==='moto'?'Moto':'Carro';
}

function vehicleTypeBadgeClass(type){
  return type==='moto'?'type-moto':'type-carro';
}

function vehicleTypeIcon(type){
  if(type==='moto'){
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/><path d="M8 17l3-6h4l2 4"/><path d="M11 11l2-4h3"/><path d="M14 7h3l2 4"/></svg>';
  }
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l1.8-4.2a2.5 2.5 0 0 1 2.3-1.5h7.8a2.5 2.5 0 0 1 2.3 1.5L20 12.5"/><path d="M3.5 12.5h17a1.5 1.5 0 0 1 1.5 1.5v2.5a1 1 0 0 1-1 1h-2"/><path d="M5 17.5H3a1 1 0 0 1-1-1V14a1.5 1.5 0 0 1 1.5-1.5"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>';
}

function save(){
  try{
    writeStored(STORAGE_KEYS.vehicles, JSON.stringify(vehicles));
    writeStored(STORAGE_KEYS.history,  JSON.stringify(history));
    writeStored(STORAGE_KEYS.selected, selectedVehicleId || '');
  }catch(e){}
}

// Navegação
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
    if(btn.dataset.tab==='calcular') refreshCalcPanel();
    if(btn.dataset.tab==='historico') renderHistory();
  });
});

document.getElementById('go-vehicles')?.addEventListener('click',()=>{
  document.querySelector('[data-tab="veiculos"]').click();
});

// Tema
(function(){
  const t=document.querySelector('[data-theme-toggle]'),r=document.documentElement;
  let d=readStored(STORAGE_KEYS.theme,'') || (matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  r.setAttribute('data-theme',d);
  updateThemeIcon(d);
  t&&t.addEventListener('click',()=>{
    d=d==='dark'?'light':'dark';
    r.setAttribute('data-theme',d);
    writeStored(STORAGE_KEYS.theme,d);
    updateThemeIcon(d);
  });
  function updateThemeIcon(mode){
    if(!t)return;
    t.innerHTML=mode==='dark'
      ?'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      :'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
})();

// Feedback
function showToast(msg, type=''){
  const a=document.getElementById('toast-area');
  const t=document.createElement('div');
  t.className='toast'+(type?' '+type:'');
  t.textContent=msg;
  a.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(8px)';t.style.transition='.2s ease';setTimeout(()=>t.remove(),220);},2800);
}

// Veículos
function updateVehicleEmptyState(){
  const emptyState=document.getElementById('estado-vazio');
  const vehiclesCard=document.getElementById('vehicles-card');
  const threshold=document.getElementById('threshold-box');
  const hasVehicles=vehicles.length>0;
  if(emptyState) emptyState.classList.toggle('is-hidden',hasVehicles);
  if(vehiclesCard) vehiclesCard.classList.toggle('is-hidden',!hasVehicles);
  if(threshold) threshold.classList.toggle('is-hidden',!hasVehicles);
}
function renderVehicles(){
  const list=document.getElementById('vehicle-list');
  const empty=document.getElementById('empty-vehicles');
  const badge=document.getElementById('veh-badge');
  if(!selectedVehicleId && vehicles.length){
    selectedVehicleId=vehicles[0].id;
    save();
  }
  badge.textContent=vehicles.length;
  updateVehicleEmptyState();
  if(!vehicles.length){empty.style.display='flex';list.innerHTML='';return;}
  empty.style.display='none';
  list.innerHTML=vehicles.map(v=>`
    <div class="vehicle-item${selectedVehicleId===v.id?' selected':''}" data-id="${v.id}" tabindex="0" role="button" aria-pressed="${selectedVehicleId===v.id}">
      <div class="vehicle-avatar">
        ${vehicleTypeIcon(v.tipo)}
      </div>
      <div class="vehicle-info">
        <div class="vehicle-name">${v.nome}</div>
        <div class="vehicle-meta">${vehicleTypeLabel(v.tipo)} · ${v.kmGas} km/l (gasolina) · ${v.kmEta} km/l (etanol)</div>
        <div class="vehicle-type-pill ${vehicleTypeBadgeClass(v.tipo)}">${vehicleTypeLabel(v.tipo)}</div>
      </div>
      <div class="vehicle-actions">
        <button class="icon-btn edit" data-action="edit" data-id="${v.id}" aria-label="Editar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
        </button>
        <button class="icon-btn" data-action="del" data-id="${v.id}" aria-label="Excluir">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.vehicle-item').forEach(el=>{
    el.addEventListener('click',e=>{
      if(e.target.closest('[data-action]'))return;
      selectedVehicleId=el.dataset.id;
      renderVehicles();
      refreshCalcPanel();
      showToast(vehicles.find(v=>v.id===el.dataset.id)?.nome+' selecionado.');
    });
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')el.click();});
  });

  list.querySelectorAll('[data-action="edit"]').forEach(btn=>{
    btn.addEventListener('click',()=>openModal(btn.dataset.id));
  });
  list.querySelectorAll('[data-action="del"]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const confirmou=window.confirm('Certeza que deseja excluir este veículo? Essa ação não pode ser desfeita.');
      if(!confirmou)return;
      vehicles=vehicles.filter(v=>v.id!==btn.dataset.id);
      if(selectedVehicleId===btn.dataset.id)selectedVehicleId=null;
      save();renderVehicles();refreshCalcPanel();showToast('Veículo removido.');
    });
  });
}

// Modal
const overlay=document.getElementById('modal-overlay');
function openModal(id=null){
  document.getElementById('edit-id').value=id||'';
  const v=id?vehicles.find(x=>x.id===id):null;
  document.getElementById('modal-title').textContent=id?'Editar Veículo':'Novo Veículo';
  document.getElementById('v-nome').value=v?.nome||'';
  document.getElementById('v-tipo').value=v?.tipo||'carro';
  document.getElementById('v-marca').value=v?.marca||'';
  document.getElementById('v-modelo').value=v?.modelo||'';
  document.getElementById('v-km-gas').value=v?.kmGas||'';
  document.getElementById('v-km-eta').value=v?.kmEta||'';
  overlay.classList.add('open');
  document.getElementById('v-nome').focus();
}
function closeModal(){overlay.classList.remove('open');}
document.getElementById('modal-cancel').addEventListener('click',closeModal);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});

document.getElementById('modal-save').addEventListener('click',()=>{
  const nome=document.getElementById('v-nome').value.trim();
  const tipo=document.getElementById('v-tipo').value;
  const kmGas=parseFloat(document.getElementById('v-km-gas').value);
  const kmEta=parseFloat(document.getElementById('v-km-eta').value);
  if(!nome){showToast('Informe o nome do veículo.','error');return;}
  if(tipo!=='carro'&&tipo!=='moto'){showToast('Informe o tipo do veículo.','error');return;}
  if(!kmGas||kmGas<=0){showToast('Informe a autonomia com gasolina.','error');return;}
  if(!kmEta||kmEta<=0){showToast('Informe a autonomia com etanol.','error');return;}
  const id=document.getElementById('edit-id').value;
  const obj={id:id||Date.now().toString(),nome,tipo,marca:document.getElementById('v-marca').value.trim(),modelo:document.getElementById('v-modelo').value.trim(),kmGas,kmEta};
  if(id){vehicles=vehicles.map(v=>v.id===id?obj:v);}else{vehicles.push(obj);selectedVehicleId=obj.id;}
  save();renderVehicles();refreshCalcPanel();closeModal();
  showToast(id?'Veículo atualizado!':'Veículo cadastrado!');
});
document.getElementById('btn-add-vehicle').addEventListener('click',()=>openModal());
document.getElementById('btn-empty-add')?.addEventListener('click',()=>openModal());
document.getElementById('calc-empty-cta')?.addEventListener('click',()=>{
  document.querySelector('[data-tab="veiculos"]').click();
  openModal();
});

// Cálculo
function refreshCalcPanel(){
  const v=vehicles.find(x=>x.id===selectedVehicleId);
  const warn=document.getElementById('no-vehicle-warn');
  const card=document.getElementById('selected-vehicle-card');
  const calcEmpty=document.getElementById('calc-empty');
  const calcCard=document.getElementById('calc-card');
  const resultCard=document.getElementById('result-card');
  const hasVehicles=vehicles.length>0;
  if(calcEmpty) calcEmpty.classList.toggle('is-hidden',hasVehicles);
  if(calcCard) calcCard.classList.toggle('is-hidden',!hasVehicles);
  if(resultCard) resultCard.classList.toggle('is-hidden',!hasVehicles);
  if(!hasVehicles){
    warn.style.display='none';card.style.display='none';
    resultCard.className='result-card';
    return;
  }
  if(!v){
    warn.style.display='flex';card.style.display='none';
    resultCard.className='result-card';
    return;
  }
  warn.style.display='none';card.style.display='block';
  document.getElementById('calc-veh-name').textContent=v.nome+(v.marca?' — '+v.marca+(v.modelo?' '+v.modelo:''):'');
  document.getElementById('calc-veh-meta').textContent=`${v.kmGas} km/l gasolina · ${v.kmEta} km/l etanol`;
  const typeEl=document.getElementById('calc-veh-type');
  if(typeEl){
    typeEl.textContent=vehicleTypeLabel(v.tipo);
    typeEl.className='vehicle-type-pill '+vehicleTypeBadgeClass(v.tipo);
  }
  const avatarEl=document.getElementById('calc-veh-avatar');
  if(avatarEl) avatarEl.innerHTML=vehicleTypeIcon(v.tipo);
}
document.getElementById('btn-change-vehicle').addEventListener('click',()=>{
  document.querySelector('[data-tab="veiculos"]').click();
});

document.getElementById('btn-calcular').addEventListener('click',calcular);
document.getElementById('btn-limpar').addEventListener('click',()=>{
  document.getElementById('preco-gas').value='';
  document.getElementById('preco-eta').value='';
  document.getElementById('litros').value='';
  document.getElementById('result-card').className='result-card';
});

function fmt(n){return n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});}

function calcular(){
  const v=vehicles.find(x=>x.id===selectedVehicleId);
  if(!v){showToast('Selecione um veículo primeiro!','error');return;}
  const pg=parseFloat(document.getElementById('preco-gas').value);
  const pe=parseFloat(document.getElementById('preco-eta').value);
  const litros=parseFloat(document.getElementById('litros').value)||0;
  if(!pg||pg<=0||!pe||pe<=0){showToast('Informe os preços de gasolina e etanol.','error');return;}

  const custoGas=pg/v.kmGas;
  const custoEta=pe/v.kmEta;
  const ratio=pe/pg;
  const thresholdRatio=v.kmEta/v.kmGas;

  const winner=custoEta<custoGas?'eta':custoGas<custoEta?'gas':'tie';
  const economia=Math.abs(custoGas-custoEta);
  const econPct=(economia/Math.max(custoGas,custoEta)*100);

  const rc=document.getElementById('result-card');
  const metrics=document.getElementById('res-metrics');
  const rbar=document.getElementById('ratio-bar');

  rc.className='result-card show '+(winner==='gas'?'winner-gas':winner==='eta'?'winner-eta':'tie');

  document.getElementById('res-icon').textContent=winner==='gas'?'G':winner==='eta'?'E':'T';
  document.getElementById('res-verdict').textContent=
    winner==='gas'?'Gasolina é mais vantajosa!':
    winner==='eta'?'Etanol é mais vantajoso!':'Praticamente empatados!';
  document.getElementById('res-sub').textContent=
    winner==='tie'?'A diferença é mínima — escolha o que preferir.':
    `Economia de R$ ${fmt(economia)}/km (${fmt(econPct)}%) com ${winner==='gas'?'gasolina':'etanol'}.`;

  let mhtml=`
    <div class="metric${winner==='gas'?' best':''}">
      <div class="metric-label">Gasolina — custo/km</div>
      <div class="metric-value">R$ ${fmt(custoGas)}</div>
      <div class="metric-detail">Preço: R$ ${fmt(pg)}/L · ${v.kmGas} km/L</div>
    </div>
    <div class="metric${winner==='eta'?' best':''}">
      <div class="metric-label">Etanol — custo/km</div>
      <div class="metric-value">R$ ${fmt(custoEta)}</div>
      <div class="metric-detail">Preço: R$ ${fmt(pe)}/L · ${v.kmEta} km/L</div>
    </div>
    <div class="metric">
      <div class="metric-label">Proporção eta/gas</div>
      <div class="metric-value">${fmt(ratio*100)}%</div>
      <div class="metric-detail">Limite p/ etanol vantajoso: ${fmt(thresholdRatio*100)}%</div>
    </div>
  `;
  if(litros>0){
    const tGas=litros*pg;const tEta=litros*pe;
    const diff=Math.abs(tGas-tEta);
    mhtml+=`<div class="metric${winner==='gas'?' best':winner==='eta'?' best':''}">
      <div class="metric-label">Custo p/ ${litros}L</div>
      <div class="metric-value">${winner==='gas'?'R$ '+fmt(tGas):winner==='eta'?'R$ '+fmt(tEta):'—'}</div>
      <div class="metric-detail">Diferença: R$ ${fmt(diff)} · Gas: R$${fmt(tGas)} · Eta: R$${fmt(tEta)}</div>
    </div>`;
  }
  metrics.innerHTML=mhtml;

  rbar.style.display='block';
  const barGasPct=100;
  const barEtaPct=Math.min(100,(custoEta/custoGas)*100);
  setTimeout(()=>{
    document.getElementById('bar-gas').style.width=barGasPct+'%';
    document.getElementById('bar-eta').style.width=barEtaPct+'%';
    document.getElementById('bar-ratio-pct').textContent='Relação: '+fmt(ratio*100)+'% (limite '+fmt(thresholdRatio*100)+'%)';
  },50);

  const entry={
    id:Date.now().toString(),
    veiculo:v.nome,
    pg:fmt(pg),pe:fmt(pe),
    winner,
    custoGas:fmt(custoGas),custoEta:fmt(custoEta),
    data:new Date().toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})
  };
  history.unshift(entry);
  if(history.length>50)history.pop();
  save();
}

// Histórico
function renderHistory(){
  const list=document.getElementById('history-list');
  const empty=document.getElementById('empty-history');
  if(!history.length){empty.style.display='flex';list.innerHTML='';return;}
  empty.style.display='none';
  list.innerHTML=history.slice(0,20).map(h=>`
    <div class="history-item">
      <span class="history-badge ${h.winner==='gas'?'badge-gas':h.winner==='eta'?'badge-eta':'badge-tie'}">
        ${h.winner==='gas'?'Gasolina':h.winner==='eta'?'Etanol':'Empate'}
      </span>
      <div class="history-info">
        <div class="vehicle-name">${h.veiculo}</div>
        <div class="vehicle-meta">Gas R$${h.pg}/L · Eta R$${h.pe}/L · R$${h.winner==='gas'?h.custoGas:h.custoEta}/km</div>
        <div class="history-date">${h.data}</div>
      </div>
    </div>
  `).join('');
}
document.getElementById('btn-clear-history').addEventListener('click',()=>{
  const confirmou=window.confirm('Certeza que deseja limpar todo o histórico? Essa ação não pode ser desfeita.');
  if(!confirmou)return;
  history=[];save();renderHistory();showToast('Histórico limpo.');
});

// Inicialização
renderVehicles();
renderHistory();
refreshCalcPanel();
