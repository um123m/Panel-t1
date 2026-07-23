const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const app = $('#app');
const modalRoot = $('#modal-root');
let state = null;
let me = null;
let route = (location.hash || '#dashboard').replace('#', '') || 'dashboard';
let selectedPlayerId = 86;
let selectedReport = 1;
let weaponOpenId = null;
let sidebarOpen = false;
let playersGroupOpen = true;
let filters = { job: '', metric: 'cash', search: '' };
if (route === 'activation') route = 'priority';

const PAGE_TITLES = {
  dashboard: 'الرئيسية', weapons: 'قائمة الأسلحة المعدنية', 'player-search': 'كشف اللاعبين',
  characters: 'جميع الشخصيات', vehicles: 'جميع المركبات', 'player-admin': 'إدارة اللاعبين',
  online: 'اللاعبين المتصلين', reports: 'الريبورتات', gangs: 'قائمة العصابات', bans: 'الباندات',
  queue: 'إدارة الإنتظار', priority: 'الأولوية', users: 'المستخدمين',
  submissions: 'التقديمات', exam: 'الإختبار الإلكتروني', rules: 'القوانين', design: 'تصميم الموقع', settings: 'الإعدادات العامة'
};

// ترتيب القائمة بدون أي أسهم أو قوائم مخفية: كل عناصر السيرفر ظاهرة مباشرة مثل الإنتظار والباندات.
// المتجر محذوف نهائياً من القائمة حسب طلبك.
const MENU = [
  { section: 'عام' },
  { id: 'dashboard', label: 'الرئيسية', icon: 'home' },
  { id: 'users', label: 'المستخدمين', icon: 'users' },

  { section: 'السيرفر' },
  { id: 'player-search', label: 'كشف اللاعبين', icon: 'user', badge: 'جديد' },
  { id: 'characters', label: 'جميع الشخصيات', icon: 'users', badge: 'جديد' },
  { id: 'vehicles', label: 'جميع المركبات', icon: 'stack', badge: 'جديد' },
  { id: 'player-admin', label: 'إدارة اللاعبين', icon: 'user' },
  { id: 'online', label: 'اللاعبين المتصلين', icon: 'phone' },
  { id: 'gangs', label: 'قائمة العصابات', icon: 'scale' },
  { id: 'reports', label: 'الريبورتات', icon: 'phone' },
  { id: 'queue', label: 'إدارة الإنتظار', icon: 'stack' },
  { id: 'bans', label: 'الباندات', icon: 'ban' },
  { id: 'priority', label: 'الأولوية', icon: 'star' },

  { section: 'الإعدادات' },
  { id: 'submissions', label: 'التقديمات', icon: 'file' },
  { id: 'exam', label: 'الإختبار الإلكتروني', icon: 'doc' },
  { id: 'rules', label: 'القوانين', icon: 'scale' },
  { id: 'design', label: 'تصميم الموقع', icon: 'brush' },
  { id: 'settings', label: 'الإعدادات العامة', icon: 'gear' }
];

function svgIcon(name){
  const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  const paths = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    basket: '<path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M2 21v-2a4 4 0 0 1 3-3.87"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.61a2 2 0 0 1-.45 2.11L8 9.7a16 16 0 0 0 6.3 6.3l1.26-1.29a2 2 0 0 1 2.11-.45c.84.3 1.71.51 2.61.63A2 2 0 0 1 22 16.92Z"/>',
    stack: '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="m4.9 4.9 14.2 14.2"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
    doc: '<path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    scale: '<path d="M12 3v18"/><path d="M5 6h14"/><path d="m6 6-3 7h6L6 6Z"/><path d="m18 6-3 7h6l-3-7Z"/>',
    brush: '<path d="m14 4 6 6"/><path d="M4 20c2-4 5-7 9-8l7-7-1-1-7 7c-1 4-4 7-8 9Z"/>',
    gear: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V22a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3.05V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.23.56.75.93 1.36 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z"/>',
    star: '<path d="m12 2 3 7 7 .6-5.3 4.7 1.6 6.8L12 17.5 5.7 21l1.6-6.8L2 9.6 9 9l3-7Z"/>'
  };
  return `<svg class="svg-icon" ${common}>${paths[name] || paths.user}</svg>`;
}

async function api(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
  });
  const data = await res.json().catch(() => ({ ok: false, error: 'رد غير صالح' }));
  if (!res.ok) throw new Error(data.error || 'خطأ في الطلب');
  return data;
}
function esc(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function money(n){ return '$' + Number(n || 0).toLocaleString('en-US'); }
function toast(msg, type = 'ok'){
  const t = $('#toast'); if(!t) return;
  t.textContent = msg;
  t.className = `toast ${type === 'error' ? 'error' : ''}`;
  clearTimeout(t.__timer);
  t.__timer = setTimeout(() => t.classList.add('hidden'), 2600);
}

async function boot(){
  // بدون صفحة تسجيل دخول: يدخل تلقائياً كمستخدم Ms.
  try { const r = await api('/api/me'); me = r.user; await loadState(false); }
  catch { me = {name:'abadykhaled', role:'owner', email:'Ms'}; await loadState(false); }
}
async function loadState(soft = true){
  const r = await api('/api/state');
  state = r;
  if(soft && $('.content')) renderContentOnly(); else renderApp();
}
function renderLogin(){
  // تم إلغاء نظام الإيميل والباسورد؛ تحميل اللوحة مباشرة.
  boot();
}

function renderApp(){
  document.body.classList.add('loaded');
  app.innerHTML = `<div class="app-shell">
    <aside class="sidebar ${sidebarOpen ? 'open' : ''}">${sidebar()}</aside>
    <div class="side-overlay ${sidebarOpen ? 'open' : ''}" onclick="toggleSidebar(false)"></div>
    <main class="layout">${topbar()}<section class="content">${page()}</section></main>
    <button class="drawer-toggle" onclick="toggleSidebar()">☰</button>
  </div>`;
}
function isActive(item){ return route === item.id; }
function sidebar(){
  let html = `<div class="side-top"><div class="side-grid">▦</div><div class="side-logo"><img src="/ms_logo.png" alt="MS"></div></div>`;
  for(const item of MENU){
    if(item.section){ html += `<div class="side-section">${item.section}</div>`; continue; }
    const active = isActive(item);
    html += `<button class="nav-item standalone ${active ? 'active' : ''}" onclick="go('${item.id}')"><span class="nav-icon">${svgIcon(item.icon)}</span><span class="nav-label">${item.label}</span>${item.badge ? `<b class="badge">${item.badge}</b>` : ''}</button>`;
  }
  html += `<div class="side-user"><div><b>${esc(me?.name || 'abadykhaled')}</b><span>${esc(me?.role || 'owner')}</span></div><div class="mini-logo"><img src="/ms_logo.png" alt="MS"></div></div>`;
  return html;
}
function togglePlayersGroup(){ renderApp(); }
function topbar(){
  const title = PAGE_TITLES[route] || 'الرئيسية';
  return `<header class="topbar">
    <div class="top-left"><span>${esc(me?.name || 'abadykhaled')}</span><div class="avatar-img"><img src="/ms_logo.png" alt="MS"></div><span class="top-ico">♧</span><span class="top-ico">💡</span><span class="lang">AR</span><span class="green-pill">37%</span></div>
    <div class="top-note">🔥 لا يفوتك تحديثنا الجديد نزل ↗</div>
    <div class="page-title-block"><h1>${title}</h1><div class="crumb"><span>${title}</span> / الرئيسية / ${svgIcon('home')}</div></div>
  </header>`;
}
function go(id){ route = id; history.replaceState(null, '', '#' + id); sidebarOpen = false; selectedPlayerId = selectedPlayerId || 86; renderApp(); }
function toggleSidebar(v){ sidebarOpen = typeof v === 'boolean' ? v : !sidebarOpen; renderApp(); }
async function logout(){ route='dashboard'; location.hash='#dashboard'; renderApp(); }
function renderContentOnly(){ const c = $('.content'); if(c) c.innerHTML = page(); else renderApp(); }
function page(){
  const map = { dashboard, weapons, 'player-search': playerSearch, characters, vehicles, 'player-admin': playerAdmin, online, reports, gangs, bans, queue, priority, users: placeholder, submissions: placeholder, exam: placeholder, rules: placeholder, design: placeholder, settings: settingsPage };
  return (map[route] || dashboard)();
}

function dashboard(){
  const players = state.players || [];
  const onlinePlayers = players.filter(p => p.status === 'online').slice(0, 6);
  const weaponsTop = (state.weapons || []).slice().sort((a,b) => b.editCount - a.editCount).slice(0, 6);
  const jobs = Object.entries(players.reduce((a,p) => (a[p.job] = (a[p.job] || 0) + 1, a), {})).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return `<div class="home-video">
    <section class="suggest-box"><div class="pixel-art"></div><h2>لديك إقتراحات تطورنا؟</h2><button class="btn">أبلغنا بها ↢</button></section>
    <section class="stat-card stat-vehicles"><div class="ring yellow">🚕</div><strong>${players.reduce((a,p)=>a+(p.vehicles?.length || 0),0)}</strong><span>عدد المركبات</span></section>
    <section class="stat-card stat-players"><div class="ring green">👥</div><strong>${players.length}</strong><span>عدد اللاعبين</span></section>
    <section class="welcome-box"><div><h2>مرحباً بك في Ms!</h2><p>إدارة سيرفرك الخاص في فايف إم أصبحت أكثر إحترافية معنا. استكشف أحدث الأنشطة والتحسينات لرفع مستوى تجربتك.</p></div><div class="welcome-character"></div></section>
    <section class="home-panel online-panel"><h3>آخر اللاعبين المتصلين</h3>${onlinePlayers.map(p=>`<div class="mini-row" onclick="openPlayer(${p.id})"><div><b>${esc(p.nickname)}</b><span>${esc(p.job.split(' ')[0] || 'user')}</span></div><div class="round-ms">${p.avatar || '👤'}</div></div>`).join('')}</section>
    <section class="home-panel weapons-panel"><div class="panel-line-head"><button class="outline-btn" onclick="go('weapons')">مشاهدة</button><h3>الأسلحة المهربة</h3></div><table class="simple-table"><thead><tr><th>السلاح</th><th>عدد التعديلات</th></tr></thead><tbody>${weaponsTop.map(w=>`<tr><td>${esc(w.weapon)}</td><td class="danger-text">${w.editCount}</td></tr>`).join('')}</tbody></table></section>
    <section class="home-panel jobs-panel"><h3>توزيعات الوظائف بالسيرفر</h3>${jobs.map(([j,n],i)=>`<div class="job-row"><div class="job-icon">${['🚫','🛡️','🗑️','🚗','🚕'][i] || '👤'}</div><div><b>${esc(j)}</b><span>${n} موظف</span></div><strong>%${((n / Math.max(1, players.length)) * 100).toFixed(2)}</strong></div>`).join('')}</section>
  </div>`;
}

function weapons(){
  const rows = (state.weapons || []).map((w,i) => weaponRow(w, weaponOpenId === w.id || (!weaponOpenId && i === 0))).join('');
  return `<div class="video-page-card weapon-card"><div class="card-head"><button class="outline-btn">استثناء⌄</button><div><h2>قائمة الأسلحة المعدنية</h2><p>يتم ترتيبهم حسب عدد التعديلات</p></div></div><div class="table-wrap"><table class="ms-table weapon-table"><thead><tr><th>السلاح</th><th>السيريال</th><th>عدد مرات التعديل</th><th>تاريخ البلاغ</th><th>ملاحظات</th><th>السهم</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function weaponRow(w, open){
  const p = (state.players || []).find(x => String(x.id) === String(w.playerId)) || {};
  return `<tr class="main-row" onclick="toggleWeapon(${w.id})"><td>${esc(w.weapon)} <span class="weapon-emoji">🔫</span></td><td>${esc(w.serial)}</td><td class="danger-text">${w.editCount}</td><td>${w.date}</td><td>✏️</td><td>${open ? '⌄' : '‹'}</td></tr>${open ? `<tr class="expand-row"><td colspan="6"><table class="expand-inner"><thead><tr><th>المكان</th><th>النوع</th><th>الهوية</th><th>الوظيفة</th><th>عدد التعديلات</th><th>التحكم</th></tr></thead><tbody><tr><td>${esc(w.place || '-')}</td><td><span class="cyan-pill">حقيبة لاعب</span></td><td>${esc((p.nickname || '-') + ' ' + (p.id || ''))}</td><td>${esc(p.job || 'Civilian')}</td><td class="danger-text">${w.editCount}</td><td class="emoji-actions">⚙️ 🎮 💬 🥾 📦</td></tr></tbody></table></td></tr>` : ''}`;
}
function toggleWeapon(id){ weaponOpenId = weaponOpenId === id ? null : id; renderContentOnly(); }

function playerSearch(){
  const metric = filters.metric === 'bank' ? 'bank' : 'cash';
  const q = (filters.search || '').toLowerCase();
  const data = (state.players || []).filter(p => (!filters.job || p.job.toLowerCase().includes(filters.job.toLowerCase())) && (!q || `${p.id} ${p.nickname} ${p.character} ${p.discord}`.toLowerCase().includes(q))).sort((a,b) => Number(b[metric]) - Number(a[metric])).slice(0, 10);
  return `<div class="video-page-card"><div class="card-head"><div></div><div><h2>كشف اللاعبين 🔍</h2><p>بإمكانك هنا مشاهدة أعلى اللاعبين نقاط/مال</p></div></div><div class="search-toolbar"><button class="btn" onclick="applyFilters()">بحث</button><input class="dark-input" id="search-q" placeholder="كلمة البحث" value="${esc(filters.search)}"><select class="dark-input"><option>يرجى إختيار العصابة</option><option>mafia</option><option>bloodz</option></select><input class="dark-input" id="job" placeholder="police" value="${esc(filters.job)}"><select class="dark-input" id="metric"><option value="cash" ${metric==='cash'?'selected':''}>money</option><option value="bank" ${metric==='bank'?'selected':''}>bank</option></select></div><div class="table-wrap"><table class="ms-table"><thead><tr><th>رقم الهوية</th><th>اسم الشخصية</th><th>القيمة</th><th>الوظيفة</th><th>العصابة</th><th>التحكم</th></tr></thead><tbody>${data.map(p => `<tr><td>${p.id}</td><td>${esc(p.character || p.nickname)}</td><td class="cyan-text">${money(p[metric])}</td><td>${esc(p.job)}</td><td>${esc(p.gang || '-')}</td><td><button class="btn btn-small" onclick="openPlayer(${p.id})">إدارة</button></td></tr>`).join('')}</tbody></table></div></div>`;
}
function applyFilters(){ filters.search = $('#search-q')?.value || ''; filters.job = $('#job')?.value || ''; filters.metric = $('#metric')?.value || 'cash'; renderContentOnly(); }

function playerAdmin(){
  const p = (state.players || []).find(x => String(x.id) === String(selectedPlayerId)) || (state.players || [])[0];
  if (!p) return placeholder();
  selectedPlayerId = p.id;
  return `<div class="admin-video-page player-detail-exact">
    <div class="admin-search exact-player-search"><input class="dark-input player-id-search" value="${p.id}" onkeydown="if(event.key==='Enter') openPlayer(this.value)"><h2>إدارة اللاعبين</h2></div>
    <div class="red-alert exact-alert"><button onclick="go('weapons')">التفاصيل</button><span>🔔 تنبيه: هذا اللاعب مشارك في عملية تعديل سلاح</span></div>
    <div class="admin-grid-video exact-player-grid">
      <section class="v-card inventory-card exact-inventory"><div class="v-card-head exact-card-head"><div class="left-buttons"><button class="btn btn-small" onclick="actionPrompt('give_item',${p.id},'اسم الآيتم')">+ إعطاء آيتم</button><button class="btn yellow btn-small" onclick="toast('تم التصفير')">✖ تصفير</button></div><h2>حقيبته داخل السيرفر 💼</h2></div><div class="inventory-list exact-inventory-list">${inventoryRows(p)}</div></section>
      <section class="v-card player-card-exact exact-player-card"><div class="player-top exact-player-top"><div class="left-buttons"><button class="btn btn-small" onclick="toast('تم فتح الشخصية الأخرى')">↢ شخصيته الأخرى</button><button class="btn red btn-small" onclick="actionPrompt('ban',${p.id},'سبب الحذف أو الحظر')">🗑 حذف</button></div><div class="name-block"><div><h2>${esc(p.nickname)}</h2><span>${p.status === 'online' ? 'متصل الآن 🟢' : 'غير متصل 🔴'}</span></div><div class="face">${p.avatar || '👤'}</div></div></div>${playerInfo(p)}${controlActions(p)}</section>
      <section class="v-card image-card exact-image-card"><div class="v-card-head no-btn exact-card-head"><h2>صورة اللاعب</h2></div><div class="live-shot player-photo"><div class="game-scene player-scene"><div class="police-person"></div></div></div></section>
      <section class="v-card vehicles-card exact-vehicles-card"><div class="v-card-head exact-card-head"><button class="btn btn-small" onclick="toast('تم فتح إعطاء مركبة')">+ إعطاء مركبة</button><h2>مركبات اللاعب</h2></div><table class="mini-table"><thead><tr><th>رقم اللوحة</th><th>المركبة</th><th>القراج</th><th>الحالة</th><th>التحكم</th></tr></thead><tbody>${(p.vehicles || []).map(v => `<tr><td>${esc(v.plate)}</td><td>${esc(v.model)}</td><td>${esc(v.garage)}</td><td>${esc(v.state)}</td><td>⚙️</td></tr>`).join('') || '<tr><td colspan="5">لا توجد مركبات</td></tr>'}</tbody></table></section>
    </div>
  </div>`;
}
function inventoryRows(p){
  return (p.inventory || []).map((it,i) => `<div class="inv-row"><button class="trash" onclick="doPlayerAction({kind:'remove_item',playerId:${p.id},index:${i}})">🗑</button><div><b>${esc(it.name)}</b><span>الكمية : ${it.qty}</span></div><div class="item-icon">${it.icon || '📦'}</div></div>`).join('') || '<div class="empty-line">الحقيبة فارغة</div>';
}
function playerInfo(p){
  return `<div class="info-area"><div class="values">
    <b>${p.id}</b><b>${p.phone}</b><b>${p.steam}</b><b>${p.license}</b><b>${p.discord}</b><b>${esc(p.job)}</b><b>${esc(p.birth)}، ${esc(p.country)}</b><b class="green-money">${money(p.cash)}</b><b class="blue-money">${money(p.bank)}</b>
  </div><div class="labels">
    <span>👤 رقم الهوية :</span><span>📞 رقم الجوال :</span><span>♟ ستيم :</span><span>♟ الرخصة :</span><span>💬 إيدي الدسكورد :</span><span>▤ الوظيفة :</span><span>ℹ معلومات إضافية :</span><span>$ الكاش :</span><span>🏦 البنك :</span>
  </div></div>`;
}
function controlActions(p){
  const a = [
    ['قائمة الملابس','👕','clothes'],['إعطاء المال','💰','cash'],['إزالة المال','💰','cash',-100],['تصليح المركبة','🚗','fix_car'],['نقل اللاعب','🌀','live'],
    ['إرسال رسالة','✉️','message'],['إنعاش اللاعب','💉','revive'],['تغيير الرتبة','🧹','rank'],['تغيير الوظيفة','👨‍💼','job'],['تصفير العصابة','💀','reset_gang'],
    ['تغيير البيانات','🪪','note'],['القيماتا ذاتا','📄','tasks'],['طرده من السيرفر','👟','kick'],['تبنيد اللاعب','🚫','ban']
  ];
  return `<div class="actions-exact">${a.map(x => `<button class="big-action" onclick='doPlayerAction(${JSON.stringify({playerId:p.id,kind:x[2],value:x[3]})})'><span>${x[1]}</span><small>${x[0]}</small></button>`).join('')}</div>`;
}
function openPlayer(id){
  const p = (state.players || []).find(x => String(x.id) === String(id));
  if(!p){ toast('لم يتم العثور على اللاعب', 'error'); return; }
  selectedPlayerId = p.id; route = 'player-admin'; history.replaceState(null, '', '#player-admin'); renderApp();
}
function openLive(id){
  const p = (state.players || []).find(x => String(x.id) === String(id)) || (state.players || [])[0];
  modalRoot.innerHTML = `<div class="modal-overlay"><div class="modal live-modal"><div class="modal-head"><button onclick="closeModal()">×</button><h2>Live - ${esc(p.nickname)}</h2></div><div class="modal-body"><div class="live-shot large"><div class="live-sign"><i></i> LIVE</div><div class="game-scene"><div class="police-person"></div></div></div></div></div></div>`;
}
function closeModal(){ modalRoot.innerHTML = ''; }
function actionPrompt(kind, playerId, label = 'أدخل القيمة'){
  modalRoot.innerHTML = `<div class="modal-overlay"><div class="modal small"><div class="modal-head"><button onclick="closeModal()">×</button><h2>${esc(label)}</h2></div><div class="modal-body"><input id="prompt-value" class="dark-input prompt" autofocus><div class="modal-actions"><button class="btn" onclick="doPrompt('${kind}',${playerId})">حفظ</button><button class="btn ghost" onclick="closeModal()">إلغاء</button></div></div></div></div>`;
  setTimeout(()=>$('#prompt-value')?.focus(),30);
}
async function doPrompt(kind, playerId){ const value = $('#prompt-value')?.value || ''; closeModal(); await doPlayerAction({ kind, playerId, value }); }
async function doPlayerAction(payload){
  if(payload.kind === 'live') return openLive(payload.playerId);
  if(['ban','cash','message','note','give_item'].includes(payload.kind) && payload.value === undefined) return actionPrompt(payload.kind, payload.playerId, payload.kind === 'ban' ? 'سبب الحظر' : 'أدخل القيمة');
  try { const r = await api('/api/action', { method:'POST', body: payload }); state = r.state; toast('نجاح ✓ Done and the player is inside the server'); renderContentOnly(); }
  catch(e){ toast(e.message, 'error'); }
}

function characters(){
  const data = state.players || [];
  return `<div class="video-page-card"><div class="card-head"><div></div><div><h2>جميع الشخصيات</h2><p>في هذه الصفحة بإمكانك البحث عن لاعب محدد</p></div></div><div class="search-toolbar"><button class="btn">بحث</button><input class="dark-input" placeholder="لديه نقاط تصنيع أكبر من"><select class="dark-input"><option>يرجى إختيار الوظيفة</option></select><input class="dark-input" placeholder="كلمة مفتاحية مثل اسم الشخص أو رقم جواله"></div><div class="table-wrap"><table class="ms-table"><thead><tr><th>رقم الهوية</th><th>اسم الشخصية</th><th>الوظيفة</th><th>طرق التواصل</th></tr></thead><tbody>${data.map(p => `<tr><td>${p.id}</td><td>${esc(p.character || p.nickname)}</td><td>${esc(p.job)}</td><td class="emoji-actions">⚙️ 📦 🎮</td></tr>`).join('')}</tbody></table></div></div>`;
}
function vehicles(){
  const vehicles = (state.players || []).flatMap(p => (p.vehicles || []).map(v => ({...v, owner:p.nickname, id:p.id})));
  return `<div class="video-page-card"><div class="card-head"><div></div><div><h2>جميع المركبات</h2><p>استعراض مركبات اللاعبين</p></div></div><div class="table-wrap"><table class="ms-table"><thead><tr><th>رقم اللوحة</th><th>المركبة</th><th>الكراج</th><th>الحالة</th><th>المالك</th><th>التحكم</th></tr></thead><tbody>${vehicles.map(v => `<tr><td>${esc(v.plate)}</td><td>${esc(v.model)}</td><td>${esc(v.garage)}</td><td>${esc(v.state)}</td><td>${esc(v.owner)}</td><td><button class="btn btn-small" onclick="openPlayer(${v.id})">فتح</button></td></tr>`).join('')}</tbody></table></div></div>`;
}
function online(){
  const data = (state.players || []).filter(p => p.status === 'online');
  return `<div class="cards-grid">${data.map(p => `<div class="online-card"><div class="id">ID: ${p.id}</div><div class="avatar-round">${p.avatar || '👤'}</div><h3>${esc(p.nickname)}</h3><p>${esc(p.character || '')}</p><p>${esc(p.discord)}</p><div class="icons"><button onclick="openPlayer(${p.id})">⚙️</button><button onclick="go('reports')">✉️</button><button onclick="openLive(${p.id})">📷</button></div></div>`).join('')}</div>`;
}
function reports(){
  const r = (state.reports || []).find(x => x.id === selectedReport) || (state.reports || [])[0];
  return `<div class="reports-layout"><section class="chat-panel"><div class="chat-head"><b>${esc(r?.name || 'user')}</b><span class="status-dot"></span></div><div class="chat-body"><div class="join-pill">انضم للسيرفر ، اليوم 02:24 م</div>${(r?.messages || []).map(m => `<div class="msg"><small>${esc(m.time)}</small><b>${esc(m.from || '')}</b><p>${esc(m.text)}</p></div>`).join('')}</div><div class="chat-input"><button class="btn btn-small" onclick="sendReportMessage(${r?.id || 0})">➤</button><input id="reportMsg" placeholder="اكتب رسالتك هنا..."></div></section><aside class="report-users"><input class="dark-input" placeholder="إبحث هنا 🔍"><div class="tabs"><b>الكل</b><span>المراسلين فقط</span></div>${(state.players || []).filter(p=>p.status==='online').map((p,i)=>`<div class="report-user" onclick="selectedReport=${(state.reports || [])[i % Math.max(1,(state.reports || []).length)]?.id || 1};renderContentOnly()"><span>${p.order + 29}</span><div><b>${esc(p.nickname)}</b><small>${p.id}</small></div><div class="avatar-round tiny">${p.avatar || '👤'}</div></div>`).join('')}</aside></div>`;
}
async function sendReportMessage(id){ const text = $('#reportMsg')?.value?.trim(); if(!text) return; try{ const r = await api('/api/reports/message', {method:'POST', body:{reportId:id,text}}); state = r.state; renderContentOnly(); } catch(e){ toast(e.message,'error'); } }
function gangs(){
  return `<div class="gang-head">${(state.gangs || []).map(g => `<div class="gang-tile"><b>${esc(g.name)}</b><span>${g.members} عضو</span></div>`).join('')}</div><div class="video-page-card"><div class="card-head"><div></div><div><h2>قائمة العصابات</h2></div></div><table class="ms-table"><thead><tr><th>رقم الهوية</th><th>اسم اللاعب</th><th>اسم العصابة</th><th>الرتبة</th><th>إجراءات</th></tr></thead><tbody>${(state.players || []).filter(p => p.gang && p.gang !== '-').map(p => `<tr><td>${p.id}</td><td>${esc(p.nickname)}</td><td>${esc(p.gang)}</td><td>${esc(p.gangRank)}</td><td>✎ 🗑</td></tr>`).join('')}</tbody></table></div>`;
}
function bans(){
  return `<div class="video-page-card"><div class="card-head"><button class="btn red" onclick="addBanPrompt()">إضافة باند جديد</button><div><h2>قائمة المبندين</h2><p>هنا بإمكانك إدارة المبندين في سيرفرك</p></div></div><table class="ms-table"><thead><tr><th>Banid</th><th>الاسم</th><th>License</th><th>Steam</th><th>الدسكورد</th><th>السبب</th><th>Bannedby</th><th>Expire</th><th>إجراءات</th></tr></thead><tbody>${(state.bans || []).map(b => `<tr><td>${esc(b.banid)}</td><td>${esc(b.name)}</td><td>${esc(b.license)}</td><td>${esc(b.steam)}</td><td>${esc(b.discord)}</td><td>${esc(b.reason)}</td><td>${esc(b.bannedBy)}</td><td>${esc(b.expire)}</td><td><button class="tiny-btn red" onclick="deleteBan(${b.id})">🗑</button></td></tr>`).join('')}</tbody></table></div>`;
}
function addBanPrompt(){ modalRoot.innerHTML = `<div class="modal-overlay"><div class="modal small"><div class="modal-head"><button onclick="closeModal()">×</button><h2>إضافة باند جديد</h2></div><div class="modal-body"><input id="ban-name" class="dark-input" placeholder="الاسم"><input id="ban-reason" class="dark-input" placeholder="السبب"><button class="btn" onclick="saveBan()">حفظ</button></div></div></div>`; }
async function saveBan(){ try{ const r = await api('/api/bans', { method:'POST', body:{name:$('#ban-name').value, reason:$('#ban-reason').value} }); state = r.state; closeModal(); renderContentOnly(); }catch(e){ toast(e.message,'error'); } }
async function deleteBan(id){ try{ const r = await api('/api/bans/' + id, { method:'DELETE' }); state = r.state; renderContentOnly(); }catch(e){ toast(e.message,'error'); } }
function queue(){
  const list = state.queue || [];
  return `<div class="video-page-card"><div class="card-head"><div></div><div><h2>قائمة اللاعبين بالإنتظار</h2></div></div><table class="ms-table"><thead><tr><th>الترتيب</th><th>الاسم</th><th>الدسكورد</th><th>وقت الانتظار</th><th>الأولوية</th><th>التحكم</th></tr></thead><tbody>${list.length ? list.map((q,i) => `<tr><td>${i+1}</td><td>${esc(q.name)}</td><td>${esc(q.discord)}</td><td>${esc(q.wait || '-')}</td><td>${esc(q.priority || 0)}</td><td><button class="btn btn-small">إدارة</button></td></tr>`).join('') : '<tr><td colspan="6">No data available in table</td></tr>'}</tbody></table></div>`;
}
function priority(){
  const rows = (state.priorityList || []).slice().sort((a,b)=>Number(b.priority || 0)-Number(a.priority || 0)).map((p,i)=>`<tr><td>${i+1}</td><td>${esc(p.name)}</td><td>${esc(p.discord)}</td><td>${esc(p.license)}</td><td><span class="priority-pill">${esc(p.priority)}</span></td><td>${esc(p.note || '-')}</td><td>${esc(p.addedBy || '-')}</td><td>${new Date(p.createdAt).toLocaleString('ar')}</td><td><button class="tiny-btn red" onclick="deletePriorityEntry(${p.id})">🗑</button></td></tr>`).join('');
  return `<div class="video-page-card"><div class="card-head"><button class="btn" onclick="addPriorityPrompt()">+ إضافة أولوية</button><div><h2>الأولوية</h2><p>الإداري يضيف الشخص للأولوية مباشرة، بدون قبول ورفض</p></div></div><div class="summary-row"><div><b>${(state.priorityList || []).length}</b><span>شخص مضاف للأولوية</span></div><div><b>MS</b><span>نظام أولوية يدوي</span></div></div><table class="ms-table"><thead><tr><th>#</th><th>الاسم</th><th>الدسكورد</th><th>License</th><th>الأولوية</th><th>ملاحظة</th><th>أضيف بواسطة</th><th>تاريخ الإضافة</th><th>التحكم</th></tr></thead><tbody>${rows || '<tr><td colspan="9">لا توجد أولويات مضافة</td></tr>'}</tbody></table></div>`;
}
function addPriorityPrompt(){
  const opts = (state.players || []).map(p=>`<option value="${p.id}">${esc(p.id + ' - ' + p.nickname + ' - ' + p.discord)}</option>`).join('');
  modalRoot.innerHTML = `<div class="modal-overlay"><div class="modal small"><div class="modal-head"><button onclick="closeModal()">×</button><h2>إضافة شخص للأولوية</h2></div><div class="modal-body"><select id="prio-player" class="dark-input" onchange="fillPriorityPlayer()"><option value="">إضافة يدوي</option>${opts}</select><input id="prio-name" class="dark-input" placeholder="اسم اللاعب"><input id="prio-discord" class="dark-input" placeholder="Discord ID"><input id="prio-license" class="dark-input" placeholder="license"><input id="prio-value" class="dark-input" type="number" value="1"><textarea id="prio-note" class="dark-input" placeholder="ملاحظة"></textarea><button class="btn" onclick="savePriorityEntry()">إضافة</button></div></div></div>`;
}
function fillPriorityPlayer(){ const p = (state.players || []).find(x => String(x.id) === String($('#prio-player')?.value)); if(!p) return; $('#prio-name').value = p.nickname; $('#prio-discord').value = p.discord; $('#prio-license').value = p.license; $('#prio-value').value = p.priority || 1; }
async function savePriorityEntry(){ try{ const r = await api('/api/priority-list', {method:'POST', body:{name:$('#prio-name').value, discord:$('#prio-discord').value, license:$('#prio-license').value, priority:$('#prio-value').value, note:$('#prio-note').value} }); state = r.state; closeModal(); renderContentOnly(); } catch(e){ toast(e.message,'error'); } }
async function deletePriorityEntry(id){ try{ const r = await api('/api/priority-list/' + id, {method:'DELETE'}); state = r.state; renderContentOnly(); } catch(e){ toast(e.message,'error'); } }
function settingsPage(){ return `<div class="video-page-card"><div class="card-head"><div></div><div><h2>الإعدادات العامة</h2></div></div><p class="muted">النظام يحفظ فعلياً داخل <b>data/db.json</b>، والربط متاح عبر <b>/api/game-webhook</b>.</p><div class="log-list">${(state.logs || []).slice(0,10).map(l => `<div><b>${esc(l.action)}</b><span>${esc(l.target)}</span></div>`).join('') || 'لا توجد عمليات'}</div></div>`; }
function placeholder(){ return `<div class="video-page-card empty-page"><div class="card-head"><div></div><div><h2>${PAGE_TITLES[route] || 'صفحة'}</h2></div></div><div class="placeholder-grid"><div></div><div></div><div></div><div></div></div></div>`; }

window.go = go; window.toggleSidebar = toggleSidebar; window.logout = logout; window.applyFilters = applyFilters; window.toggleWeapon = toggleWeapon; window.openPlayer = openPlayer; window.openLive = openLive; window.closeModal = closeModal; window.actionPrompt = actionPrompt; window.doPrompt = doPrompt; window.doPlayerAction = doPlayerAction; window.sendReportMessage = sendReportMessage; window.addBanPrompt = addBanPrompt; window.saveBan = saveBan; window.deleteBan = deleteBan; window.addPriorityPrompt = addPriorityPrompt; window.savePriorityEntry = savePriorityEntry; window.deletePriorityEntry = deletePriorityEntry; window.fillPriorityPlayer = fillPriorityPlayer;
window.addEventListener('hashchange', () => { const next = (location.hash || '#dashboard').replace('#','') || 'dashboard'; route = next === 'activation' ? 'priority' : next; renderApp(); });
boot();
