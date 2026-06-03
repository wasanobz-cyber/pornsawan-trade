// ─── PORNSAWAN TRADE — Supabase Configuration ─────────────────────────────────
// อ่านค่า config จาก localStorage (บันทึกโดย Supabase Setup.html)
// หรือจะวางค่าตรงนี้แทนก็ได้

(function () {
  var url = localStorage.getItem('pt_sb_url') || '';
  var key = localStorage.getItem('pt_sb_key') || '';

  // ─── Hardcoded Supabase Config (PORNSAWAN TRADE) ─────────────────────────
  var HARDCODED_URL = 'https://rhubzppivsaroaezgowk.supabase.co/';
  var HARDCODED_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodWJ6cHBpdnNhcm9hZXpnb3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDgzMTAsImV4cCI6MjA5NjAyNDMxMH0.13BBK4WWm7kRd8wI4IoKA9LnuwKBly3QsSWkSLGJPSo';
  // ─────────────────────────────────────────────────────────────────────────

  window.SUPABASE_URL       = url || HARDCODED_URL || null;
  window.SUPABASE_KEY       = key || HARDCODED_KEY || null;
  window.FIREBASE_DEMO_MODE = !(window.SUPABASE_URL && window.SUPABASE_KEY);

  if (window.FIREBASE_DEMO_MODE) {
    console.info('[PT] 🟡 Demo mode — ข้อมูลเก็บในเครื่องเท่านั้น ยังไม่ได้ตั้งค่า Supabase');
  } else {
    console.info('[PT] 🟢 Supabase config โหลดแล้ว →', window.SUPABASE_URL);
  }
})();
