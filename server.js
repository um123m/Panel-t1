const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const DB_FILE = path.join(ROOT, 'data', 'db.json');
const sessions = new Map();
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // سنة كاملة حتى لا يطلب تسجيل الدخول كل مرة

function nowSeconds() { return Math.floor(Date.now() / 1000); }
function ensureSessions(db) { if (!Array.isArray(db.sessions)) db.sessions = []; return db.sessions; }
function pruneSessions(db) {
  const now = nowSeconds();
  ensureSessions(db);
  db.sessions = db.sessions.filter(s => Number(s.expiresAt || 0) > now);
}

function readDb() {
  if (!fs.existsSync(DB_FILE)) throw new Error('data/db.json is missing');
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}
function send(res, status, data, headers={}) {
  const body = typeof data === 'string' ? data : JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': typeof data === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8', ...headers });
  res.end(body);
}
function notFound(res) { send(res, 404, { ok:false, error:'Not found' }); }
function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(header.split(';').filter(Boolean).map(v => {
    const i = v.indexOf('=');
    return [decodeURIComponent(v.slice(0,i).trim()), decodeURIComponent(v.slice(i+1).trim())];
  }));
}
function currentUser(req) {
  // نظام الدخول ملغي حسب الطلب: يعتبر المستخدم الإداري الأساسي داخل تلقائياً.
  const db = readDb();
  return db.users?.[0] || { id: 1, name: 'abadykhaled', email: 'Ms', role: 'owner', avatar: 'MS' };
}

function requireAuth(req, res) {
  const u = currentUser(req);
  if (!u) { send(res, 401, { ok:false, error:'Unauthorized' }); return null; }
  return u;
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body='';
    req.on('data', chunk => { body += chunk; if (body.length > 3e6) req.destroy(); });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch(e) { reject(e); }
    });
  });
}
function serveStatic(req, res) {
  let pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (pathname === '/') pathname = '/index.html';
  const file = path.normalize(path.join(PUBLIC, pathname));
  if (!file.startsWith(PUBLIC)) return send(res, 403, 'Forbidden');
  fs.readFile(file, (err, data) => {
    if (err) {
      fs.readFile(path.join(PUBLIC, 'index.html'), (e, html) => {
        if (e) return send(res, 404, 'Missing index.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control':'no-store' });
        res.end(html);
      });
      return;
    }
    const ext = path.extname(file).toLowerCase();
    const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif'};
    const cache = ext === '.html' ? 'no-store' : 'public, max-age=31536000, immutable';
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': cache });
    res.end(data);
  });
}
function compactState(db) {
  return {
    settings: db.settings,
    userSafe: db.users.map(({password, ...u}) => u),
    stats: {
      players: db.players.length,
      online: db.players.filter(p => p.status === 'online').length,
      reports: db.reports.filter(r => r.status !== 'closed').length,
      bans: db.bans.length,
      weapons: db.weapons.length,
      queue: db.queue.length,
      priorities: (db.priorityList || []).length
    },
    players: db.players,
    weapons: db.weapons,
    reports: db.reports,
    bans: db.bans,
    gangs: db.gangs,
    queue: db.queue,
    pending: db.pending,
    priorityList: db.priorityList || [],
    activations: db.activations || [],
    logs: db.logs.slice(-80).reverse()
  };
}
function addLog(db, user, action, target, meta={}) {
  db.logs.push({ id: Date.now(), at: new Date().toISOString(), by: user.name, action, target, meta });
}
function findPlayer(db, id) { return db.players.find(p => String(p.id) === String(id)); }

async function api(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const method = req.method;
  try {
    if (url.pathname === '/api/auth/login' && method === 'POST') {
      const db = readDb();
      const user = db.users?.[0] || { id: 1, name: 'abadykhaled', email: 'Ms', role: 'owner', avatar: 'MS' };
      return send(res, 200, { ok:true, user:{ id:user.id, name:user.name, email:user.email, role:user.role, avatar:user.avatar } });
    }
    if (url.pathname === '/api/auth/logout' && method === 'POST') {
      return send(res, 200, { ok:true });
    }
    if (url.pathname === '/api/me' && method === 'GET') {
      const user = requireAuth(req,res); if (!user) return;
      return send(res, 200, { ok:true, user:{ id:user.id, name:user.name, email:user.email, role:user.role, avatar:user.avatar } });
    }
    const user = requireAuth(req, res); if (!user) return;
    const db = readDb();

    if (url.pathname === '/api/state' && method === 'GET') return send(res, 200, { ok:true, ...compactState(db) });

    if (url.pathname === '/api/action' && method === 'POST') {
      const body = await readBody(req);
      const p = findPlayer(db, body.playerId);
      if (!p) return send(res, 404, { ok:false, error:'اللاعب غير موجود' });
      const kind = String(body.kind || 'note');
      const value = body.value || '';
      if (kind === 'give_item') p.inventory.push({ name:value || 'item', qty:Number(body.qty || 1), icon:'📦' });
      if (kind === 'remove_item') p.inventory = p.inventory.filter((_,i)=>i !== Number(body.index));
      if (kind === 'cash') p.cash = Math.max(0, Number(p.cash) + Number(value || 0));
      if (kind === 'bank') p.bank = Math.max(0, Number(p.bank) + Number(value || 0));
      if (kind === 'warn') p.warns = Number(p.warns || 0) + 1;
      if (kind === 'note') p.notes.push({ at:new Date().toISOString(), text:value });
      if (kind === 'ban') db.bans.unshift({ id:Date.now(), banid:String(p.id), name:p.nickname, license:p.license.replace('license:',''), steam:p.steam.replace('steam:',''), discord:p.discord, reason:value || 'Admin ban', bannedBy:user.name, expire:body.expire || '0', bannedOn:String(Math.floor(Date.now()/1000)) });
      if (kind === 'kick') p.status='offline';
      addLog(db, user, kind, p.nickname, body);
      writeDb(db);
      return send(res, 200, { ok:true, player:p, state:compactState(db) });
    }

    if (url.pathname === '/api/reports/message' && method === 'POST') {
      const body = await readBody(req); const r = db.reports.find(x => String(x.id) === String(body.reportId));
      if (!r) return send(res, 404, {ok:false,error:'الريبورت غير موجود'});
      r.messages.push({ from:user.name, text:body.text || '', time:new Date().toLocaleTimeString('ar', {hour:'2-digit',minute:'2-digit'}) });
      addLog(db,user,'report_message',r.name,{reportId:r.id}); writeDb(db);
      return send(res, 200, { ok:true, report:r, state:compactState(db) });
    }

    if (url.pathname === '/api/bans' && method === 'POST') {
      const body = await readBody(req);
      const ban = { id:Date.now(), banid:body.banid || body.name || 'new', name:body.name || 'غير معروف', license:body.license || '', steam:body.steam || '', discord:body.discord || '', reason:body.reason || '', bannedBy:user.name, expire:body.expire || '0', bannedOn:String(Math.floor(Date.now()/1000)) };
      db.bans.unshift(ban); addLog(db,user,'add_ban',ban.name,ban); writeDb(db); return send(res, 200, {ok:true, ban, state:compactState(db)});
    }
    if (url.pathname.startsWith('/api/bans/') && method === 'DELETE') {
      const id = url.pathname.split('/').pop(); const before = db.bans.length; db.bans = db.bans.filter(b => String(b.id) !== id);
      addLog(db,user,'delete_ban',id,{}); writeDb(db); return send(res, 200, {ok:true, deleted:before-db.bans.length, state:compactState(db)});
    }


    if (url.pathname === '/api/activations' && method === 'POST') {
      const body = await readBody(req);
      const activation = {
        id: Date.now(),
        code: body.code || ('MS-' + Math.random().toString(36).slice(2, 8).toUpperCase()),
        name: body.name || 'غير معروف',
        discord: body.discord || '',
        license: body.license || '',
        note: body.note || '',
        addedBy: user.name,
        createdAt: new Date().toISOString()
      };
      if (!db.activations) db.activations = [];
      db.activations.unshift(activation);
      addLog(db, user, 'add_activation', activation.name, activation);
      writeDb(db);
      return send(res, 200, { ok:true, activation, state:compactState(db) });
    }
    if (url.pathname.startsWith('/api/activations/') && method === 'DELETE') {
      const id = url.pathname.split('/').pop();
      if (!db.activations) db.activations = [];
      const before = db.activations.length;
      db.activations = db.activations.filter(a => String(a.id) !== id);
      addLog(db, user, 'delete_activation', id, {});
      writeDb(db);
      return send(res, 200, { ok:true, deleted:before-db.activations.length, state:compactState(db) });
    }


    if (url.pathname === '/api/priority-list' && method === 'POST') {
      const body = await readBody(req);
      if (!db.priorityList) db.priorityList = [];
      const priority = {
        id: Date.now(),
        name: body.name || 'غير معروف',
        discord: body.discord || '',
        license: body.license || '',
        priority: Number(body.priority || 1),
        note: body.note || '',
        addedBy: user.name,
        createdAt: new Date().toISOString()
      };
      db.priorityList.unshift(priority);
      addLog(db, user, 'add_priority', priority.name, priority);
      writeDb(db);
      return send(res, 200, { ok:true, priority, state:compactState(db) });
    }
    if (url.pathname.startsWith('/api/priority-list/') && method === 'DELETE') {
      const id = url.pathname.split('/').pop();
      if (!db.priorityList) db.priorityList = [];
      const before = db.priorityList.length;
      db.priorityList = db.priorityList.filter(p => String(p.id) !== id);
      addLog(db, user, 'delete_priority', id, {});
      writeDb(db);
      return send(res, 200, { ok:true, deleted:before-db.priorityList.length, state:compactState(db) });
    }

    if (url.pathname === '/api/priority' && method === 'POST') {
      const body = await readBody(req); const p = findPlayer(db, body.playerId); if (!p) return send(res,404,{ok:false,error:'غير موجود'});
      p.priority = Number(body.priority || 0); addLog(db,user,'priority',p.nickname,{priority:p.priority}); writeDb(db); return send(res,200,{ok:true,state:compactState(db)});
    }

    if (url.pathname === '/api/game-webhook' && method === 'POST') {
      // نقطة ربط اختيارية من سكربت السيرفر: ترسل تحديثات اللاعبين أو الريبورتات أو العقوبات.
      const body = await readBody(req);
      if (body.type === 'player_update') {
        let p = findPlayer(db, body.player?.id);
        if (p) Object.assign(p, body.player);
        else db.players.push(body.player);
      }
      if (body.type === 'report') db.reports.unshift({ id:Date.now(), status:'open', messages:[], ...body.report });
      addLog(db,user,'game_webhook',body.type || 'unknown',body); writeDb(db); return send(res,200,{ok:true});
    }

    return notFound(res);
  } catch (err) {
    console.error(err);
    return send(res, 500, { ok:false, error: err.message || 'Server error' });
  }
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) return api(req, res);
  return serveStatic(req, res);
});
server.listen(PORT, () => console.log(`Ms-style admin panel running on http://localhost:${PORT}`));
