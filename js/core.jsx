// js/core.jsx — Icons, Shared UI, Login, Layout, Dashboard

const { useState, useEffect, useRef } = React;

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const Svg = ({ children, size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} {...p}>
    {children}
  </svg>
);
const IcoDashboard = () => <Svg><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></Svg>;
const IcoPackage = () => <Svg><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></Svg>;
const IcoCart   = () => <Svg><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></Svg>;
const IcoChart  = () => <Svg><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></Svg>;
const IcoUsers  = () => <Svg><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
const IcoUser   = () => <Svg><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>;
const IcoX      = () => <Svg><path d="M18 6 6 18M6 6l12 12"/></Svg>;
const IcoSearch = () => <Svg><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></Svg>;
const IcoBell   = () => <Svg><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></Svg>;
const IcoPlus   = () => <Svg><path d="M12 5v14M5 12h14"/></Svg>;
const IcoEdit   = () => <Svg><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Svg>;
const IcoTrash  = () => <Svg><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>;
const IcoLogout = () => <Svg><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>;
const IcoCheck  = () => <Svg><path d="M20 6 9 17l-5-5"/></Svg>;
const IcoReceipt= () => <Svg><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8M16 12H8M12 16H8"/></Svg>;
const IcoTrend  = () => <Svg><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></Svg>;
const IcoAlert  = () => <Svg><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></Svg>;
const IcoQR     = () => <Svg><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="16" y="3" width="5" height="5" rx="1"/><rect x="3" y="16" width="5" height="5" rx="1"/><path d="M21 16h-3v3M18 21h3M10 3v3M10 10h3v3h-3zM10 17v3"/></Svg>;
const IcoEye    = () => <Svg><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Svg>;
const IcoShield = () => <Svg><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Svg>;
const IcoSettings= () => <Svg><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Svg>;
const IcoGift     = () => <Svg><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></Svg>;
const IcoClipboard= () => <Svg><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></Svg>;
const IcoCalendar = () => <Svg><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></Svg>;

// ─── Shared UI ───────────────────────────────────────────────────────────────

const Btn = ({ children, variant = 'primary', size = 'md', onClick, disabled, style = {}, icon }) => {
  const base = { display:'inline-flex', alignItems:'center', gap:'6px', border:'none', borderRadius:'8px', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily:'inherit', fontWeight:600, opacity: disabled ? 0.55 : 1, transition:'all 0.15s', whiteSpace:'nowrap' };
  const sizes = { sm:{ padding:'6px 12px', fontSize:'12px' }, md:{ padding:'9px 18px', fontSize:'14px' }, lg:{ padding:'12px 24px', fontSize:'15px' } };
  const variants = {
    primary:  { background:'var(--primary)',       color:'#fff' },
    secondary:{ background:'var(--primary-light)', color:'var(--primary)' },
    outline:  { background:'transparent',          color:'var(--text)',       border:'1px solid var(--border)' },
    ghost:    { background:'transparent',          color:'var(--text-muted)' },
    danger:   { background:'#FEE2E2',              color:'#DC2626' },
    success:  { background:'#D1FAE5',              color:'#065F46' },
  };
  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant], ...style }} onClick={onClick} disabled={disabled}>
      {icon && icon}{children}
    </button>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background:'var(--surface)', borderRadius:'14px', border:'1px solid var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', ...style }}>
    {children}
  </div>
);

const Badge = ({ children, color = 'default' }) => {
  const map = { default:{bg:'#F1F5F9',text:'#64748B'}, green:{bg:'#D1FAE5',text:'#065F46'}, red:{bg:'#FEE2E2',text:'#991B1B'}, yellow:{bg:'#FEF3C7',text:'#92400E'}, blue:{bg:'#DBEAFE',text:'1E40AF'}, purple:{bg:'#EDE9FE',text:'#5B21B6'}, indigo:{bg:'#E0E7FF',text:'#3730A3'} };
  const c = map[color] || map.default;
  return <span style={{ background:c.bg, color:c.text, padding:'3px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:600, display:'inline-block', whiteSpace:'nowrap' }}>{children}</span>;
};

const AppInput = ({ label, value, onChange, placeholder, type = 'text', style = {} }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
    {label && <label style={{ fontSize:'12px', fontWeight:600, color:'var(--text-muted)', letterSpacing:'0.03em', textTransform:'uppercase' }}>{label}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ padding:'10px 12px', border:'1.5px solid var(--border)', borderRadius:'8px', fontSize:'14px', fontFamily:'inherit', outline:'none', background:'var(--surface)', color:'var(--text)', ...style }} />
  </div>
);

const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px', backdropFilter:'blur(3px)' }}>
      <div style={{ background:'var(--surface)', borderRadius:'18px', width:'100%', maxWidth:width, maxHeight:'90vh', overflow:'auto', boxShadow:'0 30px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid var(--border)' }}>
          <h3 style={{ fontSize:'16px', fontWeight:700 }}>{title}</h3>
          <button onClick={onClose} style={{ background:'#F1F5F9', border:'none', cursor:'pointer', color:'var(--text-muted)', borderRadius:'8px', padding:'6px', display:'flex' }}><IcoX /></button>
        </div>
        <div style={{ padding:'24px' }}>{children}</div>
      </div>
    </div>
  );
};

// ─── Login Screen ────────────────────────────────────────────────────────────

const LoginScreen = ({ onLogin }) => {
  // Supabase mode: email + password  |  Demo mode: username + password
  const isFirebase = !window.FIREBASE_DEMO_MODE;

  const [mode,     setMode]     = useState('login'); // 'login' | 'register'
  const [email,    setEmail]    = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [regName,  setRegName]  = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDone,  setRegDone]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [companyLogo, setCompanyLogo] = useState(()=>localStorage.getItem('ptCompanyLogo')||'');
  const logoRef = React.useRef(null);

  const reset = m => { setMode(m); setError(''); setPassword(''); setConfirm(''); setRegDone(false); };

  const handleLogoUpload = e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setCompanyLogo(ev.target.result); localStorage.setItem('ptCompanyLogo', ev.target.result); };
    reader.readAsDataURL(file);
  };

  // ── Supabase login ──────────────────────────────────────────────
  const doFirebaseLogin = async () => {
    if (!email.trim() || !password) return;
    setLoading(true); setError('');
    try {
      const userData = await window.fbSignIn(email.trim(), password);
      onLogin({
        name: userData.name, role: userData.role,
        staffId: userData.staffId, uid: userData.uid,
        email: userData.email, promptPayId: userData.promptPayId || '',
      });
    } catch(e) {
      const msg = e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found'
        ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        : e.code === 'auth/too-many-requests'
        ? 'ล็อกอินผิดหลายครั้ง — รอสักครู่แล้วลองใหม่'
        : (e.message || 'เกิดข้อผิดพลาด');
      setError(msg);
    } finally { setLoading(false); }
  };

  // ── Supabase register ───────────────────────────────────────────
  const doRegister = async () => {
    if (!regName.trim())        { setError('กรุณากรอกชื่อ-นามสกุล'); return; }
    if (!email.trim())          { setError('กรุณากรอกอีเมล'); return; }
    if (password.length < 6)    { setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return; }
    if (password !== confirm)   { setError('รหัสผ่านไม่ตรงกัน'); return; }
    if (!window.SB)             { setError('ยังไม่ได้ตั้งค่า Supabase'); return; }
    setLoading(true); setError('');
    try {
      const aRes = await window.SB.auth.signUp({ email: email.trim(), password });
      if (aRes.error) throw new Error(aRes.error.message);
      const uid = aRes.data?.user?.id;
      if (uid) {
        await window.SB.from('users').insert({
          id:            uid,
          name:          regName.trim(),
          email:         email.trim(),
          phone:         regPhone.trim(),
          role:          'employee',
          status:        'active',
          prompt_pay_id: regPhone.trim(),
          staff_id:      Date.now(),
          join_date:     new Date().toLocaleDateString('th-TH', {year:'numeric',month:'short',day:'numeric'}),
        });
      }
      setRegDone(true);
    } catch(e) {
      const msg = e.message?.includes('already registered') || e.message?.includes('already been registered')
        ? 'อีเมลนี้มีบัญชีแล้ว — ลองเข้าสู่ระบบแทน'
        : (e.message || 'เกิดข้อผิดพลาด');
      setError(msg);
    } finally { setLoading(false); }
  };

  // ── Demo login ──────────────────────────────────────────────────
  const DEMO_CREDS = {
    admin:    { password:'1234', role:'admin',    name:'สมหมาย รักงาน',  staffId:1 },
    employee: { password:'1234', role:'employee', name:'สาวน้อย ขยันดี', staffId:2 },
  };
  const doDemoLogin = (u, p) => {
    setLoading(true);
    setTimeout(() => {
      const c = DEMO_CREDS[u.toLowerCase()];
      if (c && c.password === p) { onLogin({ name:c.name, role:c.role, username:u, staffId:c.staffId }); }
      else { setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'); setLoading(false); }
    }, 600);
  };
  const quickLogin = u => { setUsername(u); setPassword('1234'); doDemoLogin(u, '1234'); };

  const handleSubmit = () => isFirebase ? doFirebaseLogin() : doDemoLogin(username, password);
  const handleKey    = e => e.key === 'Enter' && (mode==='register' ? doRegister() : handleSubmit());

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(145deg,#0F172A 0%,#1E1B4B 50%,#312E81 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      {/* Background decoration */}
      <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:'-10%', left:'-5%',  width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)' }} />
      </div>

      <div style={{ width:'100%', maxWidth:'420px', position:'relative' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{display:'none'}}/>
          <div onClick={()=>logoRef.current?.click()} title="คลิกเพื่ออัปโหลดตราบริษัท"
            style={{ width:'88px', height:'88px', background: companyLogo?'#fff':'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius:'22px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 8px 32px rgba(99,102,241,0.4)', cursor:'pointer', overflow:'hidden', border: companyLogo?'3px solid rgba(99,102,241,0.4)':'none', position:'relative', transition:'opacity 0.15s' }}
            onMouseEnter={e=>{e.currentTarget.querySelector('.upload-hint').style.opacity='1';e.currentTarget.style.opacity='0.85';}}
            onMouseLeave={e=>{e.currentTarget.querySelector('.upload-hint').style.opacity='0';e.currentTarget.style.opacity='1';}}>
            {companyLogo
              ? <img src={companyLogo} alt="Logo" style={{width:'100%',height:'100%',objectFit:'contain',padding:'8px',boxSizing:'border-box'}}/>
              : <span style={{ fontSize:'36px', fontWeight:800, color:'#fff', letterSpacing:'-1px' }}>P</span>
            }
            <div className="upload-hint" style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center',opacity:0,transition:'opacity 0.15s',borderRadius:'19px'}}>
              <span style={{fontSize:'22px'}}>📷</span>
            </div>
          </div>
          <h1 style={{ color:'#fff', fontSize:'24px', fontWeight:800, letterSpacing:'1px' }}>PORNSAWAN TRADE</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'13px', marginTop:'6px' }}>ระบบจัดการสต๊อกและการขาย</p>
          {!companyLogo&&<p style={{color:'rgba(255,255,255,0.3)',fontSize:'11px',marginTop:'6px'}}>คลิกที่ไอคอนเพื่ออัปโหลดตราบริษัท</p>}
          {companyLogo&&<button onClick={e=>{e.stopPropagation();setCompanyLogo('');localStorage.removeItem('ptCompanyLogo');}} style={{marginTop:'6px',background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:'11px',cursor:'pointer',fontFamily:'inherit'}}>✕ ลบโลโก้</button>}
        </div>

        {/* Card */}
        <div style={{ background:'rgba(255,255,255,0.97)', borderRadius:'22px', padding:'36px', boxShadow:'0 24px 64px rgba(0,0,0,0.4)' }}>

          {/* ── Tab switcher (Supabase mode only) ── */}
          {isFirebase && (
            <div style={{display:'flex',background:'#F1F5F9',borderRadius:'12px',padding:'4px',marginBottom:'24px',gap:'4px'}}>
              {[['login','🔑 เข้าสู่ระบบ'],['register','✏️ สมัครสมาชิก']].map(([m,label])=>(
                <button key={m} onClick={()=>reset(m)}
                  style={{flex:1,padding:'10px',borderRadius:'9px',border:'none',cursor:'pointer',fontFamily:'inherit',fontWeight:600,fontSize:'13px',transition:'all 0.15s',
                    background:mode===m?'#fff':'transparent',
                    color:mode===m?'var(--primary)':'var(--text-muted)',
                    boxShadow:mode===m?'0 1px 4px rgba(0,0,0,0.1)':'none'}}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* ── Login mode ── */}
          {mode==='login' && (
            <>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
                <div>
                  <h2 style={{ fontSize:'20px', fontWeight:700, marginBottom:'4px' }}>เข้าสู่ระบบ</h2>
                  <p style={{ fontSize:'13px', color:'var(--text-muted)' }}>Sign in to your account</p>
                </div>
                {isFirebase
                  ? <span style={{fontSize:'11px',fontWeight:700,background:'#D1FAE5',color:'#065F46',padding:'4px 10px',borderRadius:'20px'}}>🟢 Supabase</span>
                  : <span style={{fontSize:'11px',fontWeight:700,background:'#FEF3C7',color:'#92400E',padding:'4px 10px',borderRadius:'20px'}}>🟡 Demo</span>
                }
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {isFirebase
                  ? <AppInput label="อีเมล (Email)" type="email" value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder="your@email.com" />
                  : <AppInput label="ชื่อผู้ใช้ (Username)" value={username}
                      onChange={e => { setUsername(e.target.value); setError(''); }} placeholder="admin หรือ employee" />
                }
                <AppInput label="รหัสผ่าน (Password)" type="password" value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={handleKey} placeholder="••••••••" />
                {error && (
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'#FEF2F2', border:'1px solid #FECACA', padding:'10px 14px', borderRadius:'10px' }}>
                    <IcoAlert /><p style={{ color:'#DC2626', fontSize:'13px' }}>{error}</p>
                  </div>
                )}
                <button onClick={handleSubmit} disabled={loading}
                  style={{ width:'100%', padding:'14px', background: loading ? '#A5B4FC' : 'linear-gradient(135deg,#4F46E5,#7C3AED)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'inherit', letterSpacing:'0.3px', boxShadow: loading ? 'none' : '0 4px 16px rgba(79,70,229,0.4)' }}>
                  {loading ? '⏳ กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ →'}
                </button>
              </div>
              {!isFirebase && (
                <div style={{ marginTop:'24px', padding:'16px', background:'#F8FAFC', borderRadius:'12px', border:'1px solid #E2E8F0' }}>
                  <p style={{ fontSize:'11px', fontWeight:700, color:'#94A3B8', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'10px' }}>ทดลองใช้งาน (Demo)</p>
                  <div style={{ display:'flex', gap:'8px' }}>
                    <button onClick={() => quickLogin('admin')} style={{ flex:1, padding:'10px', background:'#EEF2FF', color:'#4F46E5', border:'1.5px solid #C7D2FE', borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>👑 Admin</button>
                    <button onClick={() => quickLogin('employee')} style={{ flex:1, padding:'10px', background:'#F0FDF4', color:'#16A34A', border:'1.5px solid #BBF7D0', borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>👤 พนักงาน</button>
                  </div>
                  <p style={{ fontSize:'11px', color:'#CBD5E1', marginTop:'8px', textAlign:'center' }}>รหัสผ่าน: 1234 ทั้งสองบัญชี</p>
                </div>
              )}
            </>
          )}

          {/* ── Register mode ── */}
          {mode==='register' && (
            <>
              <div style={{marginBottom:'20px'}}>
                <h2 style={{ fontSize:'20px', fontWeight:700, marginBottom:'4px' }}>สมัครสมาชิก</h2>
                <p style={{ fontSize:'13px', color:'var(--text-muted)' }}>สร้างบัญชีพนักงานใหม่</p>
              </div>

              {regDone ? (
                <div style={{display:'flex',flexDirection:'column',gap:'16px',alignItems:'center',textAlign:'center',padding:'20px 0'}}>
                  <div style={{width:'64px',height:'64px',background:'#D1FAE5',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px'}}>✅</div>
                  <div>
                    <p style={{fontWeight:700,fontSize:'16px',color:'#065F46',marginBottom:'6px'}}>สมัครสมาชิกสำเร็จ!</p>
                    <p style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:1.6}}>ระบบส่งอีเมลยืนยันไปที่<br/><strong>{email}</strong><br/>กรุณาตรวจสอบอีเมลก่อน Login</p>
                  </div>
                  <button onClick={()=>reset('login')}
                    style={{padding:'12px 28px',background:'linear-gradient(135deg,#4F46E5,#7C3AED)',color:'#fff',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                    ไปหน้า Login →
                  </button>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <AppInput label="ชื่อ-นามสกุล *" value={regName} onChange={e=>{setRegName(e.target.value);setError('');}} placeholder="สมหมาย รักงาน"/>
                  <AppInput label="อีเมล *" type="email" value={email} onChange={e=>{setEmail(e.target.value);setError('');}} placeholder="your@email.com"/>
                  <AppInput label="เบอร์โทรศัพท์" value={regPhone} onChange={e=>setRegPhone(e.target.value)} placeholder="08x-xxx-xxxx"/>
                  <AppInput label="รหัสผ่าน * (อย่างน้อย 6 ตัว)" type="password" value={password} onChange={e=>{setPassword(e.target.value);setError('');}} placeholder="••••••••"/>
                  <AppInput label="ยืนยันรหัสผ่าน *" type="password" value={confirm} onChange={e=>{setConfirm(e.target.value);setError('');}} onKeyDown={handleKey} placeholder="••••••••"/>
                  {error && (
                    <div style={{display:'flex',alignItems:'center',gap:'8px',background:'#FEF2F2',border:'1px solid #FECACA',padding:'10px 14px',borderRadius:'10px'}}>
                      <IcoAlert/><p style={{color:'#DC2626',fontSize:'13px'}}>{error}</p>
                    </div>
                  )}
                  <button onClick={doRegister} disabled={loading}
                    style={{width:'100%',padding:'14px',background:loading?'#A5B4FC':'linear-gradient(135deg,#4F46E5,#7C3AED)',color:'#fff',border:'none',borderRadius:'12px',fontSize:'15px',fontWeight:700,cursor:loading?'not-allowed':'pointer',fontFamily:'inherit',boxShadow:loading?'none':'0 4px 16px rgba(79,70,229,0.4)'}}>
                    {loading ? '⏳ กำลังสมัคร...' : 'สมัครสมาชิก →'}
                  </button>
                  <p style={{fontSize:'12px',color:'#94A3B8',textAlign:'center'}}>บัญชีใหม่จะมีสิทธิ์ระดับพนักงาน<br/>Admin สามารถเปลี่ยนสิทธิ์ได้ภายหลัง</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── App Layout (Sidebar + Header) ──────────────────────────────────────────

const NAV_ITEMS = [
  { id:'dashboard',    label:'หน้าหลัก',       en:'Dashboard',     Icon:IcoDashboard, adminOnly:false, employeeOnly:false },
  { id:'inventory',    label:'สต๊อกสินค้า',   en:'Inventory',     Icon:IcoPackage,   adminOnly:false, employeeOnly:false },
  { id:'pos',          label:'บันทึกการขาย',  en:'POS',           Icon:IcoCart,      adminOnly:false, employeeOnly:true  },
  { id:'reports',      label:'รายงาน',        en:'Reports',       Icon:IcoChart,     adminOnly:true,  employeeOnly:false },
  { id:'customers',    label:'ลูกค้า',         en:'Customers',     Icon:IcoUsers,     adminOnly:false, employeeOnly:true  },
  { id:'employees',    label:'พนักงาน',        en:'Employees',     Icon:IcoUser,      adminOnly:true,  employeeOnly:false },
  { id:'oversight',    label:'ตรวจสอบระบบ',   en:'Oversight',     Icon:IcoShield,    adminOnly:true,  employeeOnly:false },
  { id:'stockapproval',label:'เบิกสินค้า',    en:'Approvals',     Icon:IcoClipboard, adminOnly:true,  employeeOnly:false },
  { id:'dailyadmin',   label:'ปิดยอดรายวัน',  en:'Daily Summary', Icon:IcoCalendar,  adminOnly:true,  employeeOnly:false },
  { id:'settings',     label:'ตั้งค่า',        en:'Settings',      Icon:IcoSettings,  adminOnly:true,  employeeOnly:false },
  { id:'stockrequest', label:'เบิกสินค้า',    en:'Stock Request', Icon:IcoClipboard, adminOnly:false, employeeOnly:true  },
  { id:'dailyclose',   label:'ปิดยอดรายวัน',  en:'Daily Close',   Icon:IcoCalendar,  adminOnly:false, employeeOnly:true  },
  { id:'credits',      label:'เครดิต',         en:'Credits',       Icon:IcoGift,      adminOnly:false, employeeOnly:true  },
];

const AppLayout = ({ user, screen, onNavigate, onLogout, children, badges={} }) => {
  const items = NAV_ITEMS.filter(n => {
    if (n.adminOnly && user.role !== 'admin') return false;
    if (n.employeeOnly && user.role === 'admin') return false;
    return true;
  });
  const avatarKey = `ptAvatar_${user.staffId||user.role}`;
  const [avatar, setAvatar] = React.useState(()=>localStorage.getItem(avatarKey)||'');
  const fileRef = React.useRef(null);
  const handleAvatarUpload = e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setAvatar(ev.target.result); localStorage.setItem(avatarKey, ev.target.result); };
    reader.readAsDataURL(file);
  };
  const AvatarCircle = ({size=34,fontSize=14,style={}}) => (
    <div onClick={()=>fileRef.current?.click()} title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์"
      style={{width:`${size}px`,height:`${size}px`,minWidth:`${size}px`,borderRadius:'50%',overflow:'hidden',cursor:'pointer',flexShrink:0,
        background:avatar?'transparent':'linear-gradient(135deg,#6366F1,#8B5CF6)',
        display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:`${fontSize}px`,
        border:'2px solid rgba(255,255,255,0.2)',transition:'opacity 0.15s',...style}}
      onMouseEnter={e=>e.currentTarget.style.opacity='0.8'}
      onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
      {avatar ? <img src={avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : user.name.charAt(0)}
    </div>
  );

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{ width:'var(--sidebar-width)', minWidth:'var(--sidebar-width)', background:'var(--sidebar-bg)', display:'flex', flexDirection:'column', position:'fixed', top:0, bottom:0, left:0, zIndex:100, borderRight:'1px solid var(--sidebar-border)', transition:'width 0.3s ease' }}>
        {/* Logo */}
        <div style={{ padding:'20px 14px 16px', borderBottom:'1px solid var(--sidebar-border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'38px', height:'38px', minWidth:'38px', background:'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius:'11px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(99,102,241,0.4)' }}>
              <span style={{ color:'#fff', fontWeight:800, fontSize:'17px' }}>P</span>
            </div>
            <div className="nav-label">
              <p style={{ color:'var(--sidebar-text-hi)', fontWeight:700, fontSize:'13px', lineHeight:1.2, whiteSpace:'nowrap' }}>PORNSAWAN</p>
              <p style={{ color:'var(--sidebar-text)', fontSize:'11px', opacity:0.7 }}>TRADE · ระบบจัดการ</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          {items.map(item => {
            const active = screen === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'10px 10px', marginBottom:'2px', borderRadius:'10px', border:'none', cursor:'pointer', fontFamily:'inherit', textAlign:'left',
                  background: active ? 'var(--sidebar-active-bg)' : 'transparent',
                  color:      active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
                  borderLeft: active ? '3px solid var(--sidebar-active-bar)' : '3px solid transparent',
                }}>
                <item.Icon />
                <div className="nav-label" style={{ minWidth:0, flex:1 }}>
                  <p style={{ fontSize:'14px', fontWeight: active ? 600 : 400, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.label}</p>
                  <p style={{ fontSize:'10px', opacity:0.55, marginTop:'-1px' }}>{item.en}</p>
                </div>
                {(badges[item.id]||0)>0&&<span className="nav-label" style={{minWidth:'18px',height:'18px',background:'#EF4444',borderRadius:'9px',fontSize:'10px',fontWeight:800,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,padding:'0 4px'}}>{(badges[item.id]||0)>9?'9+':(badges[item.id]||0)}</span>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding:'10px 8px', borderTop:'1px solid var(--sidebar-border)' }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{display:'none'}}/>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'10px', background:'var(--sidebar-user-bg)', marginBottom:'4px' }}>
            <AvatarCircle size={34} fontSize={14}/>
            <div className="nav-label" style={{ flex:1, minWidth:0 }}>
              <p style={{ color:'var(--sidebar-text-hi)', fontSize:'13px', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</p>
              <p style={{ color:'var(--sidebar-text)', fontSize:'11px', opacity:0.7 }}>{user.role === 'admin' ? '👑 ผู้ดูแลระบบ' : '👤 พนักงาน'}</p>
            </div>
          </div>
          <button onClick={onLogout}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:'8px', padding:'8px 10px', background:'transparent', border:'none', cursor:'pointer', color:'var(--sidebar-text)', borderRadius:'8px', fontFamily:'inherit', fontSize:'13px' }}>
            <IcoLogout /><span className="nav-label">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, marginLeft:'var(--sidebar-width)', display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        {/* Header */}
        <header style={{ height:'60px', background:'var(--surface)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', position:'sticky', top:0, zIndex:50 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            {(() => { const n = NAV_ITEMS.find(x => x.id === screen); return n ? (
              <><h1 style={{ fontSize:'17px', fontWeight:700 }}>{n.label}</h1><span style={{ fontSize:'11px', color:'var(--text-muted)', background:'var(--bg)', padding:'2px 8px', borderRadius:'6px', fontWeight:500 }}>{n.en}</span></>
            ) : null; })()}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', position:'relative' }}>
              <IcoBell />
              <span style={{ position:'absolute', top:'-3px', right:'-3px', width:'9px', height:'9px', background:'#EF4444', borderRadius:'50%', border:'2px solid var(--surface)' }} />
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
              <AvatarCircle size={34} fontSize={14}/>
              <div>
                <p style={{ fontSize:'13px', fontWeight:600, lineHeight:1.2 }}>{user.name}</p>
                <p style={{ fontSize:'11px', color:'var(--text-muted)' }}>{user.role === 'admin' ? '👑 Admin' : '👤 Staff'}</p>
              </div>
            </div>
          </div>
        </header>

        <main style={{ flex:1, padding:'24px', overflowY:'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

const Dashboard = ({ user, products=[], customers=[], recentSales=[] }) => {
  const dayKey = ts => { const d = new Date(ts); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
  const tsOf   = s => s.ts || Date.now();
  const lowStock   = products.filter(p => p.stockBase <= p.minStockBase);
  const todayKey   = dayKey(Date.now());
  const todaySales = recentSales.filter(s => dayKey(tsOf(s)) === todayKey);
  const todayRev   = todaySales.reduce((s, x) => s + (x.total||0), 0);

  // รายได้เดือนนี้ (เดือนปัจจุบัน)
  const now = new Date();
  const monthRev = recentSales
    .filter(s => { const d = new Date(tsOf(s)); return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear(); })
    .reduce((s, x) => s + (x.total||0), 0);

  // คำนวณ 7 วันล่าสุด
  const last7Days = [];
  for(let i=6; i>=0; i--){
    const d = new Date();
    d.setDate(d.getDate()-i);
    const key = dayKey(d.getTime());
    const daysSales = recentSales.filter(s => dayKey(tsOf(s)) === key).reduce((s,x) => s + (x.total||0), 0);
    last7Days.push({ day: d.toLocaleDateString('th-TH', {month:'short',day:'numeric'}), amount: daysSales });
  }
  const maxAmt = Math.max(...last7Days.map(d => d.amount), 1);

  const payLabel = { cash:'เงินสด', transfer:'โอนเงิน', promptpay:'PromptPay' };
  const payColor = { cash:'green', transfer:'blue', promptpay:'purple' };

  const kpis = [
    { label:'ยอดขายวันนี้', en:"Today's Sales", value:`฿${todayRev.toLocaleString()}`, sub:`${todaySales.length} รายการ`, clr:'#4F46E5', bg:'#EEF2FF', Icon:IcoCart },
    { label:'ยอดขายเดือนนี้', en:'Monthly Revenue', value:`฿${monthRev.toLocaleString()}`, sub:`${recentSales.length} บิลทั้งหมด`, clr:'#10B981', bg:'#D1FAE5', Icon:IcoTrend },
    { label:'สินค้าใกล้หมด', en:'Low Stock Items', value:lowStock.length, sub:'รายการที่ต้องสั่งซื้อ', clr:'#EF4444', bg:'#FEE2E2', Icon:IcoAlert },
    { label:'ลูกค้าทั้งหมด', en:'Registered Customers', value:customers.length, sub:'บัญชีลูกค้า', clr:'#F59E0B', bg:'#FEF3C7', Icon:IcoUsers },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'22px' }}>
      {/* KPI */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:'14px' }}>
        {kpis.map((k,i) => (
          <Card key={i} style={{ padding:'20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <p style={{ fontSize:'12px', color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{k.label}</p>
                <p style={{ fontSize:'11px', color:'var(--text-muted)', opacity:0.7, marginBottom:'10px' }}>{k.en}</p>
                <p style={{ fontSize:'30px', fontWeight:800, color:'var(--text)', lineHeight:1 }}>{k.value}</p>
                <p style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'6px' }}>{k.sub}</p>
              </div>
              <div style={{ width:'46px', height:'46px', background:k.bg, borderRadius:'13px', display:'flex', alignItems:'center', justifyContent:'center', color:k.clr, flexShrink:0 }}>
                <k.Icon />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.8fr 1fr', gap:'16px' }}>
        {/* Chart */}
        <Card style={{ padding:'22px' }}>
          <p style={{ fontSize:'15px', fontWeight:700, marginBottom:'2px' }}>ยอดขาย 7 วันล่าสุด</p>
          <p style={{ fontSize:'12px', color:'var(--text-muted)', marginBottom:'22px' }}>Sales Last 7 Days</p>
          <div style={{ display:'flex', alignItems:'flex-end', gap:'10px', height:'160px' }}>
            {last7Days.map((d,i) => {
              const h = (d.amount / maxAmt) * 130;
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                  <span style={{ fontSize:'10px', color:'var(--text-muted)', fontWeight:500 }}>฿{(d.amount/1000).toFixed(0)}k</span>
                  <div style={{ width:'100%', height:`${h}px`, background: 'var(--primary)', borderRadius:'6px 6px 0 0', position:'relative' }}/>
                  <span style={{ fontSize:'10px', color:'var(--text-muted)', whiteSpace:'nowrap', textAlign:'center' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Low stock */}
        <Card style={{ padding:'22px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'2px' }}>
            <span style={{ color:'#EF4444' }}><IcoAlert /></span>
            <p style={{ fontSize:'15px', fontWeight:700 }}>สินค้าใกล้หมด</p>
          </div>
          <p style={{ fontSize:'12px', color:'var(--text-muted)', marginBottom:'16px' }}>Low Stock Alert</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {lowStock.slice(0,5).map((p,i) => {
              const stockTxt = window.formatStock ? window.formatStock(p.stockBase, p.unitLevels) : p.stockBase;
              const minTxt   = window.formatStock ? window.formatStock(p.minStockBase, p.unitLevels) : p.minStockBase;
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ minWidth:'44px', height:'38px', background:'#FEE2E2', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:'0 6px' }}>
                    <span style={{ fontSize:'11px', fontWeight:800, color:'#DC2626', textAlign:'center', lineHeight:1.2 }}>{stockTxt}</span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:'13px', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</p>
                    <p style={{ fontSize:'11px', color:'var(--text-muted)' }}>ขั้นต่ำ {minTxt}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Sales Table */}
      <Card>
        <div style={{ padding:'20px 22px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div><p style={{ fontSize:'15px', fontWeight:700 }}>รายการขายล่าสุด</p><p style={{ fontSize:'12px', color:'var(--text-muted)' }}>Recent Transactions</p></div>
          <Badge color="indigo">{recentSales.length} รายการ</Badge>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['เลขที่ใบแจ้งหนี้','วันที่','ลูกค้า','รายการ','ยอดรวม','การชำระ'].map(h => (
                  <th key={h} style={{ padding:'10px 18px', textAlign:'left', fontSize:'11px', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSales.length===0 && (
                <tr><td colSpan={6} style={{ padding:'32px', textAlign:'center', color:'var(--text-muted)', fontSize:'14px' }}>ยังไม่มีรายการขาย</td></tr>
              )}
              {[...recentSales].sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0,8).map((s,i) => {
                const cust  = s.customerName || (typeof s.customer==='string' ? s.customer : s.customer?.name) || 'ลูกค้าทั่วไป';
                const items = s.itemCount ?? (Array.isArray(s.items) ? s.items.length : s.items) ?? 0;
                const pay   = s.payment || s.payMethod || 'cash';
                return (
                <tr key={s.id||i} style={{ borderTop:'1px solid var(--border)' }}>
                  <td style={{ padding:'13px 18px', fontSize:'13px', color:'var(--primary)', fontWeight:600 }}>{s.id}</td>
                  <td style={{ padding:'13px 18px', fontSize:'13px', color:'var(--text-muted)' }}>{s.date}</td>
                  <td style={{ padding:'13px 18px', fontSize:'14px', fontWeight:500 }}>{cust}</td>
                  <td style={{ padding:'13px 18px', fontSize:'13px', color:'var(--text-muted)' }}>{items} รายการ</td>
                  <td style={{ padding:'13px 18px', fontSize:'15px', fontWeight:700 }}>฿{(s.total||0).toLocaleString()}</td>
                  <td style={{ padding:'13px 18px' }}><Badge color={payColor[pay]}>{payLabel[pay]||pay}</Badge></td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};







// ─── Exports ─────────────────────────────────────────────────────────────────
Object.assign(window, {
  // Icons
  IcoDashboard, IcoPackage, IcoCart, IcoChart, IcoUsers, IcoUser,
  IcoX, IcoSearch, IcoBell, IcoPlus, IcoEdit, IcoTrash, IcoLogout,
  IcoCheck, IcoReceipt, IcoTrend, IcoAlert, IcoQR, IcoEye, IcoShield, IcoSettings,
  IcoGift, IcoClipboard, IcoCalendar,
  // UI
  Btn, Card, Badge, AppInput, Modal,
  // Screens
  LoginScreen, AppLayout, Dashboard,
});
