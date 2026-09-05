// Load listings from JSON and render cards
const state = { listings: [], filtered: [] };

function createCard(item){
  const phoneHref = item.phone ? `tel:${item.phone}` : '#';
  const emailHref = item.email ? `mailto:${item.email}` : '#';
  const websiteHref = item.website || '#';
  const whatsappHref = item.phone ? `https://wa.me/${item.phone.replace(/^\+/, '')}` : '#';

  return `
  <div class="col-md-4">
    <div class="card">
      <div class="card-img-top placeholder-img d-flex align-items-center justify-content-center">${item.badge.toUpperCase()}</div>
      <div class="card-body">
        <span class="badge bg-primary">${item.badge}</span>
        <h5 class="card-title mt-2">${item.title}</h5>
        <p class="mb-1 small">Address: ${item.address}</p>
        <p class="mb-1 small">Phone: ${item.phone || '—'}</p>
        ${item.email ? `<p class="mb-1 small">Email: ${item.email}</p>` : ''}
        <p class="mb-2 small">Timings: ${item.timings || '—'}</p>
        <div class="d-flex gap-2">
          ${item.phone ? `<a href="${phoneHref}" class="btn btn-success btn-sm flex-fill">Call</a>` : `<button class="btn btn-light btn-sm flex-fill" disabled>Call</button>`}
          ${item.email ? `<a href="${emailHref}" class="btn btn-email btn-sm flex-fill">Email</a>` : `<button class="btn btn-light btn-sm flex-fill" disabled>Email</button>`}
          ${item.website ? `<a href="${websiteHref}" class="btn btn-website btn-sm flex-fill text-white" target="_blank">Website</a>` : `<button class="btn btn-light btn-sm flex-fill" disabled>Website</button>`}
        </div>
      </div>
    </div>
  </div>`;
}

function renderListings(list){
  const container = document.getElementById('listings');
  if(!container) return;
  document.getElementById('loader')?.remove();
  container.innerHTML = list.map(createCard).join('\n');
}

function applyFilter(){
  const q = (document.getElementById('q')?.value || '').toLowerCase();
  const cat = (document.getElementById('category')?.value || '').toLowerCase();
  state.filtered = state.listings.filter(item => {
    const inQuery = !q || [item.title, item.address, (item.tags||[]).join(' ')].join(' ').toLowerCase().includes(q);
    const inCat = !cat || cat === 'all categories' || item.badge.toLowerCase() === cat.toLowerCase() || (item.tags||[]).map(t=>t.toLowerCase()).includes(cat.toLowerCase());
    return inQuery && inCat;
  });
  renderListings(state.filtered);
}

// load data: prefer embedded JSON in index.html, fall back to fetch
const embeddedEl = document.getElementById('listings-data');
if(embeddedEl){
  try{
    const data = JSON.parse(embeddedEl.textContent);
    state.listings = data;
    state.filtered = data;
    renderListings(data);
  }catch(e){
    console.error('Failed to parse embedded listings JSON', e);
    const container = document.getElementById('listings');
    if(container) container.innerHTML = '<div class="col-12 text-danger">Failed to parse listings data.</div>';
  }
}else{
  fetch('data/listings.json')
    .then(r => r.json())
    .then(data => {
      state.listings = data;
      state.filtered = data;
      renderListings(data);
    })
    .catch(err => {
      console.error('Failed to load listings.json', err);
      const container = document.getElementById('listings');
      if(container) container.innerHTML = '<div class="col-12 text-danger">Failed to load listings.</div>';
    });
}

// search and chat handlers
document.getElementById('searchBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); applyFilter(); });
document.getElementById('q')?.addEventListener('keyup', (e)=>{ if(e.key === 'Enter') applyFilter(); });
document.getElementById('chatBtn')?.addEventListener('click', ()=>{ alert('Chat with Arun (demo)'); });
