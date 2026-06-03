// ─── PORNSAWAN TRADE — Supabase Data Layer ────────────────────────────────────
// แทนที่ firebase-db.js — ใช้ window.fb* API เหมือนเดิมทุกอย่าง

(function () {
  'use strict';

  window.SB = null;

  if (window.FIREBASE_DEMO_MODE) return;

  try {
    window.SB = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
    console.info('[PT] 🟢 Supabase client พร้อมแล้ว');
  } catch (e) {
    console.error('[PT] Supabase init error:', e);
    return;
  }

  // ═══════════════════════════════════════════════════════════════════
  // TABLE NAME MAPPING (Firestore collection → Supabase table)
  // ═══════════════════════════════════════════════════════════════════

  function toTable(col) {
    var map = {
      products:     'products',
      users:        'users',
      employees:    'users',
      customers:    'customers',
      sales:        'sales',
      creditSales:  'credit_sales',
      stockRequests:'stock_requests',
      dailyClosings:'daily_closings',
    };
    return map[col] || col;
  }

  // ═══════════════════════════════════════════════════════════════════
  // FIELD MAPPERS — DB (snake_case) ↔ App (camelCase)
  // ═══════════════════════════════════════════════════════════════════

  function productFromDb(row) {
    return {
      _fbid:        String(row.id),
      id:           row.id,
      sku:          row.sku          || '',
      name:         row.name         || '',
      category:     row.category     || '',
      cost:         row.cost         || 0,
      stockBase:    row.stock_base   || 0,
      minStockBase: row.min_stock_base || 0,
      unitLevels:   row.unit_levels  || [],
    };
  }

  function productToDb(p) {
    var obj = {
      sku:            p.sku           || '',
      name:           p.name          || '',
      category:       p.category      || '',
      cost:           p.cost          || 0,
      stock_base:     p.stockBase     || 0,
      min_stock_base: p.minStockBase  || 0,
      unit_levels:    p.unitLevels    || [],
    };
    var pid = p.id || p._fbid;
    if (pid && !isNaN(Number(pid))) obj.id = Number(pid);
    return obj;
  }

  function userFromDb(row) {
    return {
      _fbid:       row.id,
      uid:         row.id,
      id:          row.id,
      name:        row.name          || '',
      email:       row.email         || '',
      phone:       row.phone         || '',
      role:        row.role          || 'employee',
      status:      row.status        || 'active',
      promptPayId: row.prompt_pay_id || '',
      joinDate:    row.join_date     || '',
      staffId:     row.staff_id      || 0,
    };
  }

  function userToDb(u) {
    return {
      name:          u.name          || '',
      email:         u.email         || '',
      phone:         u.phone         || '',
      role:          u.role          || 'employee',
      status:        u.status        || 'active',
      prompt_pay_id: u.promptPayId   || u.phone || '',
      join_date:     u.joinDate      || '',
      staff_id:      u.staffId       || Date.now(),
    };
  }

  function rowFromDb(col, row) {
    if (col === 'products')                     return productFromDb(row);
    if (col === 'users' || col === 'employees') return userFromDb(row);
    // Generic: ใส่ _fbid ให้เสมอ
    return Object.assign({ _fbid: row.id }, row);
  }

  function rowToDb(col, data) {
    if (col === 'products')                     return productToDb(data);
    if (col === 'users' || col === 'employees') return userToDb(data);
    var obj = Object.assign({}, data);
    delete obj._fbid;
    return obj;
  }

  // ═══════════════════════════════════════════════════════════════════
  // AUTH HELPERS
  // ═══════════════════════════════════════════════════════════════════

  /** Login → คืน userData object */
  window.fbSignIn = async function (email, password) {
    if (!window.SB) throw new Error('Supabase ยังไม่ได้ตั้งค่า');
    var res = await window.SB.auth.signInWithPassword({ email: email, password: password });
    if (res.error) throw new Error(
      res.error.message === 'Invalid login credentials'
        ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : res.error.message
    );
    var uid = res.data.user.id;
    var uRes = await window.SB.from('users').select('*').eq('id', uid).single();
    if (uRes.error || !uRes.data) throw new Error('ไม่พบข้อมูลผู้ใช้ — ติดต่อ Admin');
    return userFromDb(uRes.data);
  };

  /** Logout */
  window.fbSignOut = function () {
    return window.SB ? window.SB.auth.signOut() : Promise.resolve();
  };

  /**
   * ฟังการเปลี่ยนสถานะ login
   * callback(userData) หรือ callback(null) เมื่อ logout
   * คืน unsubscribe function
   */
  window.fbOnAuthChanged = function (callback) {
    if (!window.SB) return function () {};
    var res = window.SB.auth.onAuthStateChange(async function (event, session) {
      if (!session) { callback(null); return; }
      var uRes = await window.SB.from('users').select('*').eq('id', session.user.id).single();
      if (uRes.data) callback(userFromDb(uRes.data));
      else callback(null);
    });
    return function () { res.data.subscription.unsubscribe(); };
  };

  // ═══════════════════════════════════════════════════════════════════
  // USER MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════

  /** สร้าง Admin คนแรก */
  window.fbCreateAdmin = async function (email, password, name, phone) {
    if (!window.SB) throw new Error('Supabase ยังไม่ได้ตั้งค่า');
    var aRes = await window.SB.auth.signUp({ email: email, password: password });
    if (aRes.error) throw new Error(aRes.error.message);
    var uid = aRes.data.user.id;
    var dRes = await window.SB.from('users').insert({
      id:            uid,
      name:          name,
      email:         email,
      phone:         phone  || '',
      role:          'admin',
      status:        'active',
      prompt_pay_id: phone  || '',
      staff_id:      Date.now(),
      join_date:     new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
    });
    if (dRes.error) throw new Error(dRes.error.message);
    await window.fbSeedInitialData();
    return uid;
  };

  /** สร้างบัญชีพนักงาน */
  window.fbCreateEmployee = async function (email, password, userData) {
    if (!window.SB) throw new Error('Supabase ยังไม่ได้ตั้งค่า');
    var aRes = await window.SB.auth.signUp({ email: email, password: password });
    if (aRes.error) throw new Error(aRes.error.message);
    var uid  = aRes.data.user.id;
    var row  = userToDb(userData);
    row.id   = uid;
    row.email = email;
    row.role  = 'employee';
    var dRes = await window.SB.from('users').insert(row);
    if (dRes.error) throw new Error(dRes.error.message);
    return uid;
  };

  /** ส่งอีเมลรีเซ็ตรหัสผ่าน */
  window.fbResetEmployeePassword = async function (email) {
    if (!window.SB) throw new Error('Supabase ยังไม่ได้ตั้งค่า');
    var res = await window.SB.auth.resetPasswordForEmail(email);
    if (res.error) throw new Error(res.error.message);
  };

  // ═══════════════════════════════════════════════════════════════════
  // REALTIME SUBSCRIPTIONS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Subscribe ตาราง — คืน unsubscribe fn
   * callback ได้รับ array of { _fbid, ...data }
   */
  window.fbSubscribe = function (col, callback, queryFn) {
    if (!window.SB) return function () {};
    var table = toTable(col);

    async function fetchAll() {
      var query = window.SB.from(table).select('*');
      if (col === 'products')                     query = query.order('id');
      if (col === 'users' || col === 'employees') query = query.order('staff_id', { nullsFirst: false });
      if (col === 'sales' || col === 'creditSales') query = query.order('created_at', { ascending: false });
      var res = await query;
      if (!res.error && res.data) {
        var rows = res.data.map(function (r) { return rowFromDb(col, r); });
        if (col === 'employees') rows = rows.filter(function (r) { return r.role === 'employee'; });
        callback(rows);
      }
    }

    fetchAll();

    // Realtime — ต้องเปิด Replication ใน Supabase Dashboard → Database → Replication
    var channel = window.SB
      .channel('rt_' + col + '_' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: table }, fetchAll)
      .subscribe();

    return function () { window.SB.removeChannel(channel); };
  };

  // ═══════════════════════════════════════════════════════════════════
  // CRUD HELPERS
  // ═══════════════════════════════════════════════════════════════════

  window.fbAdd = async function (col, data) {
    if (!window.SB) throw new Error('Supabase ไม่ได้เชื่อมต่อ');
    var row = rowToDb(col, data);
    delete row.id;
    var res = await window.SB.from(toTable(col)).insert(row).select().single();
    if (res.error) throw new Error(res.error.message);
    return String(res.data.id);
  };

  window.fbSet = async function (col, id, data) {
    if (!window.SB) throw new Error('Supabase ไม่ได้เชื่อมต่อ');
    var row = rowToDb(col, data);
    row.id  = id;
    var res = await window.SB.from(toTable(col)).upsert(row);
    if (res.error) throw new Error(res.error.message);
  };

  window.fbUpdate = async function (col, id, data) {
    if (!window.SB) throw new Error('Supabase ไม่ได้เชื่อมต่อ');
    var row = rowToDb(col, data);
    delete row.id;
    var res = await window.SB.from(toTable(col)).update(row).eq('id', id);
    if (res.error) throw new Error(res.error.message);
  };

  window.fbDelete = async function (col, id) {
    if (!window.SB) throw new Error('Supabase ไม่ได้เชื่อมต่อ');
    var res = await window.SB.from(toTable(col)).delete().eq('id', id);
    if (res.error) throw new Error(res.error.message);
  };

  /** Batch upsert products */
  window.fbBatchWriteProducts = async function (products) {
    if (!window.SB || !products || !products.length) return;
    var rows = products.map(productToDb);
    var res  = await window.SB.from('products').upsert(rows);
    if (res.error) console.error('[PT] batch products error', res.error);
  };

  /** Batch upsert employees (เก็บใน users table) */
  window.fbBatchWriteEmployees = async function (employees) {
    if (!window.SB || !employees || !employees.length) return;
    var rows = employees.map(function (e) {
      var row = userToDb(e);
      if (e.id && e.id !== e._fbid) row.id = e.id;
      return row;
    });
    var res = await window.SB.from('users').upsert(rows);
    if (res.error) console.error('[PT] batch employees error', res.error);
  };

  // ═══════════════════════════════════════════════════════════════════
  // SEED INITIAL DATA
  // ═══════════════════════════════════════════════════════════════════

  window.fbSeedInitialData = async function () {
    if (!window.SB || !window.AppData) return;
    var chk = await window.SB.from('products').select('id').limit(1);
    if (chk.data && chk.data.length > 0) return; // seed แล้ว

    var rows = window.AppData.products.map(productToDb);
    var res  = await window.SB.from('products').upsert(rows);
    if (res.error) console.error('[PT] seed error', res.error);
    else console.info('[PT] 🌱 Seed products สำเร็จ');
  };

  // ═══════════════════════════════════════════════════════════════════
  // CHECK: มี Admin ในระบบแล้วหรือยัง?
  // ═══════════════════════════════════════════════════════════════════

  window.fbHasAnyAdmin = async function () {
    if (!window.SB) return true; // demo mode — ข้ามไป
    var res = await window.SB.from('users').select('id').eq('role', 'admin').limit(1);
    if (res.error) return true;
    return res.data && res.data.length > 0;
  };

})();
