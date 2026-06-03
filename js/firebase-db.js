// ─── PORNSAWAN TRADE — Firebase Data Layer ────────────────────────────────────
// โหลดหลัง firebase-config.js และ Firebase SDK scripts

(function () {
  'use strict';

  window.DB   = null;
  window.Auth = null;

  if (window.FIREBASE_DEMO_MODE) return;

  try {
    if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
    window.DB   = firebase.firestore();
    window.Auth = firebase.auth();
    // เปิด offline persistence (ทำงานได้แม้ไม่มีอินเทอร์เน็ต)
    window.DB.enablePersistence({ synchronizeTabs: true }).catch(function () {});
    console.info('[PT] 🔥 Firestore + Auth พร้อมแล้ว');
  } catch (e) {
    console.error('[PT] Firebase init error:', e);
    window.DB = null; window.Auth = null;
  }
})();

// ═══════════════════════════════════════════════════════════════════
// AUTH HELPERS
// ═══════════════════════════════════════════════════════════════════

/** Login ด้วย email + password → คืน userData object */
window.fbSignIn = async function (email, password) {
  if (!window.Auth) throw new Error('Firebase ยังไม่ได้ตั้งค่า');
  var cred = await window.Auth.signInWithEmailAndPassword(email, password);
  var doc  = await window.DB.collection('users').doc(cred.user.uid).get();
  if (!doc.exists) throw new Error('ไม่พบข้อมูลผู้ใช้ — ติดต่อ Admin');
  return Object.assign({ uid: cred.user.uid, email: cred.user.email }, doc.data());
};

/** Logout */
window.fbSignOut = function () {
  return window.Auth ? window.Auth.signOut() : Promise.resolve();
};

/**
 * ฟังการเปลี่ยนสถานะ login
 * callback(userData) หรือ callback(null) เมื่อ logout
 * คืน unsubscribe function
 */
window.fbOnAuthChanged = function (callback) {
  if (!window.Auth) return function () {};
  return window.Auth.onAuthStateChanged(async function (fbUser) {
    if (!fbUser) { callback(null); return; }
    try {
      var doc = await window.DB.collection('users').doc(fbUser.uid).get();
      if (doc.exists) {
        callback(Object.assign({ uid: fbUser.uid, email: fbUser.email }, doc.data()));
      } else {
        callback(null);
      }
    } catch (e) { callback(null); }
  });
};

// ═══════════════════════════════════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

/** สร้าง Admin คนแรก (First-run setup) */
window.fbCreateAdmin = async function (email, password, name, phone) {
  if (!window.Auth) throw new Error('Firebase ยังไม่ได้ตั้งค่า');
  var cred = await window.Auth.createUserWithEmailAndPassword(email, password);
  var staffId = Date.now();
  await window.DB.collection('users').doc(cred.user.uid).set({
    name: name, email: email, phone: phone || '',
    role: 'admin', staffId: staffId,
    joinDate: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
    status: 'active', promptPayId: phone || '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  // seed ข้อมูลตัวอย่างสินค้า
  await window.fbSeedInitialData();
  return cred.user.uid;
};

/** สร้างบัญชีพนักงาน — ไม่ logout Admin */
window.fbCreateEmployee = async function (email, password, userData) {
  if (!window.Auth) throw new Error('Firebase ยังไม่ได้ตั้งค่า');
  // ใช้ secondary Firebase app เพื่อไม่ให้ logout Admin ปัจจุบัน
  var tempName = 'temp_' + Date.now();
  var tempApp  = firebase.initializeApp(window.FIREBASE_CONFIG, tempName);
  try {
    var cred = await tempApp.auth().createUserWithEmailAndPassword(email, password);
    await window.DB.collection('users').doc(cred.user.uid).set(
      Object.assign({}, userData, {
        email: email, role: 'employee', status: 'active',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
    );
    return cred.user.uid;
  } finally {
    await tempApp.delete();
  }
};

/** เปลี่ยนรหัสผ่านพนักงาน (Admin ทำ) */
window.fbResetEmployeePassword = async function (email, newPassword) {
  // ส่ง reset email แทน (Admin ไม่ควรรู้รหัสผ่าน)
  if (!window.Auth) throw new Error('Firebase ยังไม่ได้ตั้งค่า');
  await window.Auth.sendPasswordResetEmail(email);
};

// ═══════════════════════════════════════════════════════════════════
// FIRESTORE REAL-TIME SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Subscribe คอลเลคชัน — คืน unsubscribe fn
 * callback ได้รับ array of { _fbid, ...data }
 */
window.fbSubscribe = function (col, callback, queryFn) {
  if (!window.DB) return function () {};
  var ref = window.DB.collection(col);
  if (queryFn) ref = queryFn(ref);
  return ref.onSnapshot(
    function (snap) {
      callback(snap.docs.map(function (d) {
        return Object.assign({ _fbid: d.id }, d.data());
      }));
    },
    function (err) { console.error('[PT] subscribe error', col, err); }
  );
};

// ═══════════════════════════════════════════════════════════════════
// CRUD HELPERS
// ═══════════════════════════════════════════════════════════════════

window.fbAdd = async function (col, data) {
  if (!window.DB) throw new Error('Firebase ไม่ได้เชื่อมต่อ');
  var ref = await window.DB.collection(col).add(
    Object.assign({}, data, { createdAt: firebase.firestore.FieldValue.serverTimestamp() })
  );
  return ref.id;
};

window.fbSet = async function (col, id, data) {
  if (!window.DB) throw new Error('Firebase ไม่ได้เชื่อมต่อ');
  await window.DB.collection(col).doc(String(id)).set(data, { merge: true });
};

window.fbUpdate = async function (col, id, data) {
  if (!window.DB) throw new Error('Firebase ไม่ได้เชื่อมต่อ');
  await window.DB.collection(col).doc(String(id)).update(
    Object.assign({}, data, { updatedAt: firebase.firestore.FieldValue.serverTimestamp() })
  );
};

window.fbDelete = async function (col, id) {
  if (!window.DB) throw new Error('Firebase ไม่ได้เชื่อมต่อ');
  await window.DB.collection(col).doc(String(id)).delete();
};

/** Batch write array ของ products ทั้งหมด */
window.fbBatchWriteProducts = async function (products) {
  if (!window.DB) return;
  var batch = window.DB.batch();
  products.forEach(function (p) {
    batch.set(window.DB.collection('products').doc(String(p.id || p._fbid)), p);
  });
  await batch.commit();
};

/** Batch write employees */
window.fbBatchWriteEmployees = async function (employees) {
  if (!window.DB) return;
  var batch = window.DB.batch();
  employees.forEach(function (e) {
    batch.set(window.DB.collection('employees').doc(String(e.id || e._fbid)), e);
  });
  await batch.commit();
};

// ═══════════════════════════════════════════════════════════════════
// FIRST-RUN: SEED INITIAL DATA
// ═══════════════════════════════════════════════════════════════════

window.fbSeedInitialData = async function () {
  if (!window.DB || !window.AppData) return;
  // ตรวจก่อนว่า products มีอยู่แล้วไหม
  var snap = await window.DB.collection('products').limit(1).get();
  if (!snap.empty) return; // seed แล้ว

  var batch = window.DB.batch();
  window.AppData.products.forEach(function (p) {
    batch.set(window.DB.collection('products').doc(String(p.id)), p);
  });
  window.AppData.customers.forEach(function (c) {
    batch.set(window.DB.collection('customers').doc(String(c.id)), c);
  });
  await batch.commit();
  console.info('[PT] 🌱 Seed data สำเร็จ');
};

// ═══════════════════════════════════════════════════════════════════
// CHECK: มี Admin ในระบบแล้วหรือยัง?
// ═══════════════════════════════════════════════════════════════════
window.fbHasAnyAdmin = async function () {
  if (!window.DB) return true; // demo mode — ข้ามไป
  var snap = await window.DB.collection('users')
    .where('role', '==', 'admin')
    .limit(1).get();
  return !snap.empty;
};
