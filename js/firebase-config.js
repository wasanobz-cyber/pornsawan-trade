// ─── PORNSAWAN TRADE — Firebase Configuration ─────────────────────────────────
// อ่านค่า config จาก localStorage (บันทึกโดย Firebase Setup.html)
// หรือจะวางค่าตรงนี้แทนก็ได้

(function () {
  var stored = null;
  try { stored = JSON.parse(localStorage.getItem('pt_firebase_config') || 'null'); } catch (e) {}

  // ─── วาง Firebase Config ตรงนี้หากต้องการ (ทางเลือก) ─────────────────────
  // var HARDCODED = {
  //   apiKey:            "AIzaSy...",
  //   authDomain:        "my-project.firebaseapp.com",
  //   projectId:         "my-project",
  //   storageBucket:     "my-project.appspot.com",
  //   messagingSenderId: "123456789",
  //   appId:             "1:123:web:abc"
  // };
  // ─────────────────────────────────────────────────────────────────────────────

  window.FIREBASE_CONFIG    = stored /* || HARDCODED */ || null;
  window.FIREBASE_DEMO_MODE = !window.FIREBASE_CONFIG;

  if (window.FIREBASE_DEMO_MODE) {
    console.info('[PT] 🟡 Demo mode — ข้อมูลเก็บในเครื่องเท่านั้น');
  } else {
    console.info('[PT] 🔥 Firebase config โหลดแล้ว →', window.FIREBASE_CONFIG.projectId);
  }
})();
