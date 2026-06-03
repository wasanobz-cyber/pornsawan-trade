// js/screens.jsx — v4: receipt + employee edit + customer isolation + no categories

const { useState, useEffect } = React;
const { Btn, Card, Badge, AppInput, Modal,
  IcoX, IcoSearch, IcoPlus, IcoEdit, IcoTrash, IcoCheck,
  IcoCart, IcoPackage, IcoUsers, IcoAlert, IcoShield, IcoEye, IcoReceipt, IcoSettings,
  IcoGift, IcoClipboard, IcoCalendar, IcoTrend,
  Dashboard, AppLayout, LoginScreen } = window;

const calcToBase   = window.calcToBase;
const formatStock  = window.formatStock;
const baseUnitName = window.baseUnitName;

// ─── QR Code ──────────────────────────────────────────────────────────────────
const QRCode = ({ size = 140 }) => {
  const m = [[1,1,1,1,1,1,1,0,1,1,0,1,0,0,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,1,1,0,1,0,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,0,0,1,0,1,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,0,1,1,0,0,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0,0],[1,0,1,1,0,0,1,1,0,1,1,0,0,1,1,0,1,0,0,1,0],[0,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,0,1,1,0,1],[1,1,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0],[0,0,1,0,1,1,0,1,1,0,1,0,0,0,1,0,0,1,1,0,1],[1,0,0,1,0,0,1,0,0,1,1,0,1,0,0,1,0,0,0,1,0],[0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,1,0,1,0,1],[1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,0,1,0,0,1],[1,0,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,0],[1,0,1,1,1,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,1],[1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,0,1,1,0,0],[1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1,0,0,0,1,0],[1,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1],[1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0]];
  const cs = size/21;
  return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:'block'}}><rect width={size} height={size} fill="#fff"/>{m.flatMap((row,ri)=>row.map((c,ci)=>c?<rect key={`${ri}-${ci}`} x={ci*cs} y={ri*cs} width={cs} height={cs} fill="#1E1B4B"/>:null).filter(Boolean))}</svg>);
};

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const TinyInput = ({value,onChange,type='text',placeholder='',style={}}) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{padding:'7px 9px',border:'1.5px solid var(--border)',borderRadius:'7px',fontSize:'13px',fontFamily:'inherit',background:'var(--surface)',...style}}/>
);

const UnitLevelsEditor = ({levels,onChange}) => {
  const update=(i,k,v)=>onChange(levels.map((lv,idx)=>idx===i?{...lv,[k]:v}:lv));
  const addLevel=()=>{const next=levels.map((lv,i)=>i===levels.length-1?{...lv,perNext:1}:lv);next.push({name:'หน่วยใหม่',price:0});onChange(next);};
  const removeLevel=i=>{const next=levels.filter((_,idx)=>idx!==i);if(next.length>0){const last={...next[next.length-1]};delete last.perNext;next[next.length-1]=last;}onChange(next);};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
      {levels.map((lv,i)=>{const isBase=i===levels.length-1;return(
        <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 12px',background:isBase?'#F0FDF4':'#F8FAFC',borderRadius:'9px',border:`1px solid ${isBase?'#BBF7D0':'var(--border)'}`,flexWrap:'wrap'}}>
          <span style={{width:'22px',height:'22px',borderRadius:'50%',background:isBase?'#D1FAE5':'var(--primary-light)',color:isBase?'#16A34A':'var(--primary)',fontSize:'11px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{i+1}</span>
          <TinyInput value={lv.name} onChange={e=>update(i,'name',e.target.value)} placeholder="หน่วย" style={{width:'74px'}}/>
          {!isBase?<span style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'13px',color:'var(--text-muted)',flexWrap:'wrap'}}><span>1 {lv.name} =</span><TinyInput type="number" value={lv.perNext||1} onChange={e=>update(i,'perNext',Math.max(1,+e.target.value))} style={{width:'54px',textAlign:'center'}}/><span style={{fontWeight:600,color:'var(--text)'}}>{levels[i+1]?.name||'?'}</span></span>:<span style={{fontSize:'12px',color:'#16A34A',fontWeight:600,fontStyle:'italic',flex:1}}>← หน่วยฐาน</span>}
          <span style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'5px',fontSize:'13px',color:'var(--text-muted)',flexShrink:0}}>฿<TinyInput type="number" value={lv.price||''} onChange={e=>update(i,'price',+e.target.value)} style={{width:'70px',textAlign:'right'}}/><span>/{lv.name}</span></span>
          {levels.length>1&&<button onClick={()=>removeLevel(i)} style={{background:'#FEE2E2',border:'none',color:'#DC2626',width:'26px',height:'26px',borderRadius:'6px',cursor:'pointer',fontSize:'15px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>×</button>}
        </div>
      );})}
      {levels.length>1&&<div style={{fontSize:'12px',color:'var(--text-muted)',background:'#F8FAFC',padding:'8px 12px',borderRadius:'8px',fontStyle:'italic'}}>ตัวอย่าง: 1 {levels[0].name} = {calcToBase(0,levels)} {baseUnitName(levels)}</div>}
      <button onClick={addLevel} style={{padding:'9px',border:'1.5px dashed #CBD5E1',borderRadius:'9px',background:'transparent',cursor:'pointer',fontSize:'13px',color:'var(--text-muted)',fontFamily:'inherit',fontWeight:500}}>+ เพิ่มหน่วย (แบ่งย่อยลง)</button>
    </div>
  );
};

// ─── Add Item Modal ───────────────────────────────────────────────────────────
const AddItemModal = ({product,onAdd,onClose}) => {
  const [selUnit,setSelUnit]=useState(0);
  const [qty,setQty]=useState(1);
  const [customPrice,setCustomPrice]=useState(0);
  useEffect(()=>{
    setSelUnit(0);setQty(1);
    setCustomPrice(product?.unitLevels?.[0]?.price||0);
  },[product?.id]);
  useEffect(()=>{
    setCustomPrice(product?.unitLevels?.[selUnit]?.price||0);
  },[selUnit]);  if(!product)return null;
  const levels=product.unitLevels||[];
  const level=levels[selUnit]||levels[0];
  const toBase=calcToBase(selUnit,levels);
  const baseName=baseUnitName(levels);
  const total=qty*(customPrice||0);
  return (
    <Modal open={!!product} onClose={onClose} title="เพิ่มสินค้าลงตะกร้า" width={420}>
      <div style={{display:'flex',flexDirection:'column',gap:'18px'}}>
        <div style={{display:'flex',gap:'12px',alignItems:'center',padding:'14px',background:'var(--bg)',borderRadius:'10px'}}>
          <div style={{width:'44px',height:'44px',background:'var(--primary-light)',borderRadius:'11px',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--primary)',flexShrink:0}}><IcoPackage/></div>
          <div><p style={{fontWeight:700,fontSize:'15px'}}>{product.name}</p><p style={{fontSize:'12px',color:'var(--text-muted)'}}>คงเหลือ: <strong style={{color:product.stockBase<=product.minStockBase?'#DC2626':'var(--success)'}}>{formatStock(product.stockBase,product.unitLevels)}</strong></p></div>
        </div>
        {/* Unit selector */}
        <div>
          <p style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>เลือกหน่วยที่ขาย</p>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {levels.map((lv,i)=>{const tb=calcToBase(i,levels);return(
              <button key={i} onClick={()=>setSelUnit(i)} style={{flex:'1 1 90px',padding:'10px 8px',borderRadius:'11px',border:'2px solid',cursor:'pointer',fontFamily:'inherit',textAlign:'center',background:selUnit===i?'var(--primary)':'var(--surface)',borderColor:selUnit===i?'var(--primary)':'var(--border)',color:selUnit===i?'#fff':'var(--text)'}}>
                <p style={{fontSize:'13px',fontWeight:700}}>ต่อ {lv.name}</p>
                {tb>1&&<p style={{fontSize:'11px',opacity:0.65,marginTop:'2px'}}>= {tb} {baseName}</p>}
              </button>
            );})}
          </div>
        </div>
        {/* Price input */}
        <div>
          <p style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>ราคาต่อ {level?.name} (฿) <span style={{color:'#F59E0B',fontSize:'11px',fontWeight:500,textTransform:'none'}}>กรอกราคาได้เลย</span></p>
          <input type="number" value={customPrice} min={0} onChange={e=>setCustomPrice(Math.max(0,+e.target.value))}
            style={{width:'100%',padding:'13px 16px',border:'2px solid var(--primary)',borderRadius:'11px',fontSize:'24px',fontWeight:900,textAlign:'center',fontFamily:'inherit',color:'var(--primary)',background:'var(--primary-light)',boxSizing:'border-box'}}
            placeholder="0"/>
        </div>
        {/* Qty */}
        <div>
          <p style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>จำนวน ({level?.name})</p>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <button onClick={()=>setQty(Math.max(1,qty-1))} style={{width:'40px',height:'40px',borderRadius:'10px',border:'1.5px solid var(--border)',background:'var(--surface)',cursor:'pointer',fontSize:'20px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
            <input type="number" min="1" value={qty} onChange={e=>setQty(Math.max(1,Math.floor(+e.target.value||1)))} style={{width:'80px',padding:'10px',border:'1.5px solid var(--primary)',borderRadius:'10px',fontSize:'20px',fontWeight:800,textAlign:'center',fontFamily:'inherit',color:'var(--primary)'}}/>
            <button onClick={()=>setQty(qty+1)} style={{width:'40px',height:'40px',borderRadius:'10px',border:'none',background:'var(--primary)',color:'#fff',cursor:'pointer',fontSize:'20px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
          </div>
        </div>
        <div style={{background:'var(--primary-light)',borderRadius:'11px',padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <p style={{fontSize:'13px',color:'var(--text-muted)'}}>{qty} {level?.name} = <strong style={{color:'var(--text)'}}>{(qty*toBase).toLocaleString()} {baseName}</strong></p>
          <div style={{textAlign:'right'}}><p style={{fontSize:'11px',color:'var(--text-muted)'}}>ยอดรวม</p><p style={{fontSize:'22px',fontWeight:900,color:'var(--primary)'}}>฿{total.toLocaleString()}</p></div>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <Btn variant="outline" onClick={onClose} style={{flex:1,justifyContent:'center'}}>ยกเลิก</Btn>
          <button onClick={()=>{
            const finalPrice = customPrice > 0 ? customPrice : (product?.unitLevels?.[selUnit]?.price||0);
            onAdd({id:product.id,name:product.name,qty,unitIdx:selUnit,unitName:level.name,unitPrice:finalPrice,toBase,_key:`${product.id}-${selUnit}`});
            onClose();
          }} style={{flex:2,padding:'13px',background:'linear-gradient(135deg,#4F46E5,#7C3AED)',color:'#fff',border:'none',borderRadius:'11px',fontSize:'15px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>+ เพิ่มลงตะกร้า</button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Void Modal ───────────────────────────────────────────────────────────────
const VoidModal = ({open,onClose,onConfirm,total}) => {
  const [reason,setReason]=useState('');
  const doConfirm=()=>{if(!reason.trim())return;onConfirm(reason);setReason('');};
  return (
    <Modal open={open} onClose={onClose} title="ยกเลิกบิล (Void)" width={440}>
      <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:'10px',padding:'14px 16px'}}>
          <p style={{fontSize:'13px',fontWeight:700,color:'#92400E'}}>⚠ บิลยอด ฿{(total||0).toLocaleString()} จะถูกยกเลิก</p>
          <p style={{fontSize:'12px',color:'#B45309',marginTop:'4px'}}>ระบบจะบันทึกประวัติให้ Admin ตรวจสอบ</p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
          <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>เหตุผลการยกเลิก <span style={{color:'#EF4444'}}>*</span></label>
          <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={3} placeholder="เช่น ลูกค้าเปลี่ยนใจ / สินค้าหมด / สั่งผิดรายการ..." style={{width:'100%',padding:'10px 12px',border:`1.5px solid ${reason.trim()?'var(--border)':'#FCA5A5'}`,borderRadius:'9px',fontSize:'14px',fontFamily:'inherit',resize:'vertical'}}/>
          {!reason.trim()&&<p style={{fontSize:'12px',color:'#EF4444'}}>กรุณากรอกเหตุผลก่อนยืนยัน</p>}
        </div>
        <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
          <Btn variant="outline" onClick={onClose}>ยกเลิก</Btn>
          <button onClick={doConfirm} disabled={!reason.trim()} style={{padding:'10px 20px',background:reason.trim()?'#DC2626':'#E2E8F0',color:reason.trim()?'#fff':'#94A3B8',border:'none',borderRadius:'9px',fontSize:'14px',fontWeight:700,cursor:reason.trim()?'pointer':'not-allowed',fontFamily:'inherit'}}>ยืนยันยกเลิกบิล</button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Add Customer Modal ───────────────────────────────────────────────────────
const AddCustomerModal = ({open,onClose,onAdd,user}) => {
  const [form,setForm]=useState({name:'',contact:'',phone:'',address:''});
  const handleAdd=()=>{
    if(!form.name.trim())return;
    onAdd({id:Date.now(),...form,totalPurchases:0,lastPurchase:'-',assignedStaff:user.staffId,createdBy:user.staffId});
    setForm({name:'',contact:'',phone:'',address:''});
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="เพิ่มลูกค้าใหม่" width={420}>
      <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
        <AppInput label="ชื่อร้าน / ลูกค้า *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ร้านค้า หรือชื่อลูกค้า..."/>
        <AppInput label="ผู้ติดต่อ" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} placeholder="ชื่อผู้ติดต่อ..."/>
        <AppInput label="เบอร์โทร" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="08x-xxx-xxxx"/>
        <AppInput label="ที่อยู่" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="ที่อยู่จัดส่ง..."/>
        <div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:'9px',padding:'10px 14px',fontSize:'12px',color:'#1E40AF'}}>
          ลูกค้าที่เพิ่มจะบันทึกในรายชื่อของคุณโดยตรง
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:'10px',marginTop:'20px',paddingTop:'18px',borderTop:'1px solid var(--border)'}}>
        <Btn variant="outline" onClick={onClose}>ยกเลิก</Btn>
        <Btn icon={<IcoCheck/>} onClick={handleAdd} disabled={!form.name.trim()}>เพิ่มลูกค้า</Btn>
      </div>
    </Modal>
  );
};

// ─── Receipt Settings Modal ───────────────────────────────────────────────────
const ReceiptSettingsModal = ({open,onClose,settings,onSave}) => {
  const [s,setS]=useState(settings);
  useEffect(()=>setS(settings),[settings,open]);
  return (
    <Modal open={open} onClose={onClose} title="⚙ ปรับแต่งใบเสร็จ" width={460}>
      <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        <AppInput label="ชื่อบริษัท / ร้านค้า" value={s.companyName||''} onChange={e=>setS({...s,companyName:e.target.value})} placeholder="PORNSAWAN TRADE"/>
        <AppInput label="ที่อยู่บริษัท (แสดงบนใบเสร็จ)" value={s.companyAddress||''} onChange={e=>setS({...s,companyAddress:e.target.value})} placeholder="เลขที่ ถนน แขวง เขต..."/>
        <AppInput label="เบอร์โทร / เว็บไซต์" value={s.companyContact||''} onChange={e=>setS({...s,companyContact:e.target.value})} placeholder="02-xxx-xxxx หรือ www.example.com"/>
        <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
          <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>ข้อความท้ายบิล (Footer)</label>
          <textarea value={s.footerText||''} onChange={e=>setS({...s,footerText:e.target.value})} rows={2} placeholder="เช่น ขอบคุณที่ใช้บริการ กรุณาเก็บใบเสร็จไว้เป็นหลักฐาน" style={{width:'100%',padding:'10px 12px',border:'1.5px solid var(--border)',borderRadius:'9px',fontSize:'14px',fontFamily:'inherit',resize:'none'}}/>
        </div>
        <label style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',padding:'12px',background:'#F8FAFC',borderRadius:'9px',border:'1px solid var(--border)'}}>
          <input type="checkbox" checked={!!s.showPromptPay} onChange={e=>setS({...s,showPromptPay:e.target.checked})} style={{width:'16px',height:'16px',accentColor:'var(--primary)'}}/>
          <div><p style={{fontSize:'14px',fontWeight:600}}>แสดง QR PromptPay ของพนักงานท้ายบิล</p><p style={{fontSize:'12px',color:'var(--text-muted)'}}>ดึงหมายเลขพร้อมเพย์จากข้อมูลพนักงานโดยอัตโนมัติ</p></div>
        </label>
        <label style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',padding:'12px',background:'#F8FAFC',borderRadius:'9px',border:'1px solid var(--border)'}}>
          <input type="checkbox" checked={!!s.showTaxId} onChange={e=>setS({...s,showTaxId:e.target.checked})} style={{width:'16px',height:'16px',accentColor:'var(--primary)'}}/>
          <div><p style={{fontSize:'14px',fontWeight:600}}>แสดงเลขประจำตัวผู้เสียภาษี</p></div>
        </label>
        {s.showTaxId&&<AppInput label="เลขประจำตัวผู้เสียภาษี" value={s.taxId||''} onChange={e=>setS({...s,taxId:e.target.value})} placeholder="0-0000-00000-00-0"/>}
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:'10px',marginTop:'22px',paddingTop:'18px',borderTop:'1px solid var(--border)'}}>
        <Btn variant="outline" onClick={onClose}>ยกเลิก</Btn>
        <Btn icon={<IcoCheck/>} onClick={()=>{onSave(s);onClose();}}>บันทึกการตั้งค่า</Btn>
      </div>
    </Modal>
  );
};

// ─── Receipt Modal ────────────────────────────────────────────────────────────
const ReceiptModal = ({open,onClose,sale,staffData,settings,onOpenSettings}) => {
  if(!sale)return null;
  const payLabel={'cash':'เงินสด','transfer':'โอนเงิน','promptpay':'PromptPay','credit':'เครดิต/ค้างชำระ'};
  const companyName=settings.companyName||'PORNSAWAN TRADE';

  const doPrint=()=>{
    const itemRows=sale.items.map(item=>`<tr><td style="padding:4px 0">${item.name}<br><span style="font-size:11px;color:#666">${item.qty} ${item.unitName}</span></td><td style="text-align:right;padding:4px 0">฿${(item.qty*item.unitPrice).toLocaleString()}</td></tr>`).join('');
    const paperW=settings.paperWidth==='58mm'?'240px':settings.paperWidth==='A4'?'595px':'320px';
    const html=`<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
<style>body{font-family:Sarabun,sans-serif;max-width:${paperW};margin:0 auto;padding:20px;font-size:${settings.receiptFontSize||14}px;color:#111}h2{text-align:center;font-size:20px;margin:0 0 4px}p.sub{text-align:center;font-size:12px;color:#666;margin:2px 0}.dashed{border:none;border-top:1px dashed #bbb;margin:10px 0}.row{display:flex;justify-content:space-between;margin:3px 0}table{width:100%;border-collapse:collapse}.big{font-weight:700;font-size:16px}.qr{text-align:center;margin-top:14px}.logo{text-align:center;margin-bottom:8px}@media print{body{padding:0}}</style>
</head><body>
${settings.logoUrl?`<div class="logo"><img src="${settings.logoUrl}" style="height:${settings.logoSize||60}px;object-fit:contain;max-width:100%"></div>`:''}
<h2>${companyName}</h2>
${settings.companyAddress?`<p class="sub">${settings.companyAddress}</p>`:''}
${settings.companyContact?`<p class="sub">${settings.companyContact}</p>`:''}
${settings.showTaxId&&settings.taxId?`<p class="sub">เลขผู้เสียภาษี: ${settings.taxId}</p>`:''}
<p class="sub">ใบเสร็จรับเงิน</p>
<hr class="dashed">
<div class="row"><span>วันที่</span><span>${sale.date}</span></div>
<div class="row"><span>พนักงาน</span><span>${sale.staffName}</span></div>
${sale.customer?`<div class="row"><span>ลูกค้า</span><span>${sale.customer.name}</span></div>`:''}
<hr class="dashed">
<table>${itemRows}</table>
<hr class="dashed">
${sale.discount>0?`<div class="row"><span>ยอดรวม</span><span>฿${sale.subtotal.toLocaleString()}</span></div><div class="row" style="color:#dc2626"><span>ส่วนลด ${sale.discount}%</span><span>-฿${sale.discAmt.toLocaleString()}</span></div>`:''}
<div class="row big"><span>ยอดสุทธิ</span><span>฿${sale.total.toLocaleString()}</span></div>
<div class="row" style="font-size:12px;color:#666;margin-top:2px"><span>ชำระด้วย</span><span>${payLabel[sale.payMethod]||sale.payMethod}</span></div>
${settings.showPromptPay&&staffData?.promptPayId?`<div class="qr"><hr class="dashed"><p style="font-size:12px;color:#555;margin-bottom:6px">สแกนชำระด้วยพร้อมเพย์</p><svg width="120" height="120" viewBox="0 0 120 120" style="display:block;margin:0 auto"><rect width="120" height="120" fill="white"/><text x="60" y="65" text-anchor="middle" font-size="9" fill="#333">QR: ${staffData.promptPayId}</text></svg><p style="font-size:13px;font-weight:700;color:#1E1B4B;margin-top:6px">พร้อมเพย์: ${staffData.promptPayId}</p></div>`:''}
${settings.footerText?`<hr class="dashed"><p style="text-align:center;font-size:12px;color:#666">${settings.footerText}</p>`:''}
</body></html>`;
    const w=window.open('about:blank','_blank','width=420,height=700');
    w.document.write(html);
    w.document.close();
    setTimeout(()=>w.print(),400);
  };

  return (
    <Modal open={open} onClose={onClose} title="ใบเสร็จรับเงิน" width={420}>
      {/* Receipt preview */}
      <div style={{background:'#FAFAF8',border:'1px solid #E5E5E0',borderRadius:'10px',padding:'20px',fontFamily:"'Sarabun',sans-serif",fontSize:'14px',lineHeight:1.6}}>
        {settings.logoUrl&&<div style={{textAlign:'center',marginBottom:'8px'}}><img src={settings.logoUrl} alt="logo" style={{height:`${settings.logoSize||60}px`,objectFit:'contain',maxWidth:'100%'}}/></div>}
        <p style={{textAlign:'center',fontWeight:800,fontSize:'17px',marginBottom:'2px'}}>{companyName}</p>
        {settings.companyAddress&&<p style={{textAlign:'center',fontSize:'11px',color:'#888'}}>{settings.companyAddress}</p>}
        <p style={{textAlign:'center',fontSize:'12px',color:'#888',marginBottom:'10px'}}>ใบเสร็จรับเงิน</p>
        <div style={{borderTop:'1px dashed #CCC',borderBottom:'1px dashed #CCC',padding:'8px 0',margin:'8px 0',display:'flex',flexDirection:'column',gap:'3px'}}>
          {[['วันที่',sale.date],['พนักงาน',sale.staffName],sale.customer&&['ลูกค้า',sale.customer.name]].filter(Boolean).map(([k,v])=>(<div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}><span style={{color:'#666'}}>{k}</span><span>{v}</span></div>))}
        </div>
        {sale.items.map((item,i)=>(<div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:'13px',padding:'3px 0'}}><span>{item.name} ({item.qty}{item.unitName})</span><span style={{fontWeight:600}}>฿{(item.qty*item.unitPrice).toLocaleString()}</span></div>))}
        <div style={{borderTop:'1px dashed #CCC',marginTop:'8px',paddingTop:'8px'}}>
          {sale.discount>0&&<><div style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}><span>ยอดรวม</span><span>฿{sale.subtotal.toLocaleString()}</span></div><div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',color:'#DC2626'}}><span>ส่วนลด {sale.discount}%</span><span>-฿{sale.discAmt.toLocaleString()}</span></div></>}
          <div style={{display:'flex',justifyContent:'space-between',fontWeight:800,fontSize:'16px',marginTop:'4px'}}><span>ยอดสุทธิ</span><span>฿{sale.total.toLocaleString()}</span></div>
          <p style={{fontSize:'12px',color:'#888',marginTop:'3px'}}>ชำระด้วย: {payLabel[sale.payMethod]}</p>
        </div>
        {settings.showPromptPay&&staffData?.promptPayId&&(
          <div style={{textAlign:'center',marginTop:'12px',paddingTop:'10px',borderTop:'1px dashed #CCC'}}>
            <QRCode size={100}/>
            <p style={{fontSize:'13px',fontWeight:700,color:'#1E1B4B',marginTop:'6px'}}>พร้อมเพย์: {staffData.promptPayId}</p>
          </div>
        )}
        {settings.footerText&&<p style={{textAlign:'center',fontSize:'12px',color:'#888',marginTop:'10px',borderTop:'1px dashed #CCC',paddingTop:'8px'}}>{settings.footerText}</p>}
      </div>
      <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
        <button onClick={onOpenSettings} style={{padding:'9px 14px',background:'#F8FAFC',border:'1px solid var(--border)',borderRadius:'9px',cursor:'pointer',fontSize:'13px',fontFamily:'inherit',color:'var(--text-muted)',fontWeight:500}}>⚙ ปรับแต่ง</button>
        <Btn variant="outline" onClick={onClose} style={{flex:1,justifyContent:'center'}}>ปิด</Btn>
        <button onClick={doPrint} style={{flex:2,padding:'11px',background:'linear-gradient(135deg,#4F46E5,#7C3AED)',color:'#fff',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>🖨️ พิมพ์ใบเสร็จ</button>
      </div>
    </Modal>
  );
};

// ─── Freebie Picker Modal ────────────────────────────────────────────────────
const FreebiePickerModal = ({open, products=[], onAdd, onClose}) => {
  const [selProd,setSelProd] = useState(null);
  const [selUnit,setSelUnit] = useState(0);
  const [qty,setQty]         = useState(1);
  React.useEffect(()=>{if(!open){setSelProd(null);setSelUnit(0);setQty(1);}},[open]);
  React.useEffect(()=>{setSelUnit(0);setQty(1);},[selProd?.id]);
  const levels = selProd?.unitLevels||[];
  const level  = levels[selUnit]||levels[0];
  const toBase = selProd?calcToBase(selUnit,selProd.unitLevels):1;
  const baseName = selProd?baseUnitName(selProd.unitLevels):'';
  return (
    <Modal open={open} onClose={onClose} title="🎁 เพิ่มของแถม" width={480}>
      <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        {!selProd?(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:'10px',maxHeight:'340px',overflowY:'auto'}}>
            {products.map(p=>(
              <button key={p.id} onClick={()=>setSelProd(p)}
                style={{padding:'14px 10px',borderRadius:'12px',border:'1.5px solid #BBF7D0',background:'#F0FDF4',cursor:'pointer',textAlign:'center',fontFamily:'inherit'}}
                onMouseEnter={e=>e.currentTarget.style.background='#DCFCE7'}
                onMouseLeave={e=>e.currentTarget.style.background='#F0FDF4'}>
                <span style={{fontSize:'26px'}}>🎁</span>
                <p style={{fontSize:'13px',fontWeight:600,marginTop:'6px',lineHeight:1.3,color:'var(--text)'}}>{p.name}</p>
                <p style={{fontSize:'11px',color:'#16A34A',marginTop:'3px'}}>{p.unitLevels?.map(lv=>lv.name).join(' / ')}</p>
              </button>
            ))}
          </div>
        ):(
          <>
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 14px',background:'#F0FDF4',borderRadius:'10px'}}>
              <button onClick={()=>setSelProd(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'#16A34A',padding:'0 6px'}}>←</button>
              <div style={{width:'38px',height:'38px',background:'#BBF7D0',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0}}>🎁</div>
              <p style={{fontWeight:700,fontSize:'14px',color:'var(--text)'}}>{selProd.name}</p>
            </div>
            <div>
              <p style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>เลือกหน่วย</p>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {levels.map((lv,i)=>{const tb=calcToBase(i,levels);return(
                  <button key={i} onClick={()=>setSelUnit(i)}
                    style={{flex:'1 1 90px',padding:'10px 8px',borderRadius:'10px',border:'2px solid',cursor:'pointer',fontFamily:'inherit',textAlign:'center',
                      background:selUnit===i?'#16A34A':'var(--surface)',borderColor:selUnit===i?'#16A34A':'var(--border)',color:selUnit===i?'#fff':'var(--text)'}}>
                    <p style={{fontSize:'13px',fontWeight:700}}>ต่อ {lv.name}</p>
                    {tb>1&&<p style={{fontSize:'10px',opacity:0.7,marginTop:'2px'}}>= {tb} {baseName}</p>}
                  </button>
                );})}
              </div>
            </div>
            <div>
              <p style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>จำนวน ({level?.name})</p>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <button onClick={()=>setQty(Math.max(1,qty-1))} style={{width:'40px',height:'40px',borderRadius:'10px',border:'1.5px solid var(--border)',background:'var(--surface)',cursor:'pointer',fontSize:'20px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                <input type="number" min="1" value={qty} onChange={e=>setQty(Math.max(1,+e.target.value||1))} style={{width:'80px',padding:'10px',border:'1.5px solid #16A34A',borderRadius:'10px',fontSize:'20px',fontWeight:800,textAlign:'center',fontFamily:'inherit',color:'#16A34A'}}/>
                <button onClick={()=>setQty(qty+1)} style={{width:'40px',height:'40px',borderRadius:'10px',border:'none',background:'#16A34A',color:'#fff',cursor:'pointer',fontSize:'20px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
              </div>
            </div>
            <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:'10px',padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <p style={{fontSize:'13px',color:'#16A34A',fontWeight:600}}>{qty} {level?.name} = {(qty*toBase).toLocaleString()} {baseName}</p>
              <p style={{fontSize:'13px',color:'#16A34A',fontWeight:700}}>ไม่คิดเงิน 🎁</p>
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <Btn variant="outline" onClick={onClose} style={{flex:1,justifyContent:'center'}}>ยกเลิก</Btn>
              <button onClick={()=>onAdd({id:selProd.id,name:selProd.name,qty,unitIdx:selUnit,unitName:level?.name||'',unitPrice:0,toBase,_key:`freebie-${selProd.id}-${selUnit}`})}
                style={{flex:2,padding:'13px',background:'linear-gradient(135deg,#16A34A,#15803D)',color:'#fff',border:'none',borderRadius:'11px',fontSize:'15px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                🎁 เพิ่มของแถม
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

// ─── Price Edit Modal ────────────────────────────────────────────────────────
const PriceEditModal = ({item, currentOverride, onSave, onReset, onClose}) => {
  const [price,setPrice] = useState(currentOverride?.price??item.unitPrice);
  const [reason,setReason] = useState(currentOverride?.reason||'');
  const changed = price !== item.unitPrice;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
      <div style={{padding:'12px 14px',background:'var(--bg)',borderRadius:'10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><p style={{fontWeight:700,fontSize:'14px'}}>{item.name}</p><p style={{fontSize:'12px',color:'var(--text-muted)'}}>ราคาปกติ: ฿{item.unitPrice?.toLocaleString()}/{item.unitName}</p></div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
        <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>ราคาใหม่ (฿/{item.unitName})</label>
        <input type="number" value={price} onChange={e=>setPrice(+e.target.value)} min={0}
          style={{padding:'12px',border:`1.5px solid ${changed?'#F59E0B':'var(--border)'}`,borderRadius:'9px',fontSize:'18px',fontWeight:700,fontFamily:'inherit',color:'var(--primary)',background:changed?'#FFFBEB':'var(--surface)'}}/>
        {changed&&<p style={{fontSize:'12px',color:'#92400E'}}>⚠ ต่างจากราคาปกติ {item.unitPrice>price?'ลด':'เพิ่ม'} ฿{Math.abs(item.unitPrice-price).toLocaleString()}</p>}
      </div>
      {changed&&(
        <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
          <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>เหตุผล <span style={{color:'#EF4444'}}>*</span></label>
          <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={2} placeholder="เช่น ราคาพิเศษ VIP / ลูกค้าขอส่วนลด..."
            style={{width:'100%',padding:'10px 12px',border:`1.5px solid ${reason.trim()?'var(--border)':'#FCA5A5'}`,borderRadius:'9px',fontSize:'14px',fontFamily:'inherit',resize:'none'}}/>
        </div>
      )}
      <div style={{display:'flex',gap:'8px',paddingTop:'4px'}}>
        {currentOverride&&<button onClick={onReset} style={{padding:'10px 14px',background:'#FEE2E2',color:'#DC2626',border:'none',borderRadius:'9px',cursor:'pointer',fontFamily:'inherit',fontWeight:600,fontSize:'13px'}}>↩ คืนราคาเดิม</button>}
        <Btn variant="outline" onClick={onClose} style={{flex:1,justifyContent:'center'}}>ยกเลิก</Btn>
        <button onClick={()=>onSave(price,reason)} disabled={changed&&!reason.trim()}
          style={{flex:2,padding:'11px',background:changed&&!reason.trim()?'#E2E8F0':'linear-gradient(135deg,#F59E0B,#D97706)',color:changed&&!reason.trim()?'#94A3B8':'#fff',border:'none',borderRadius:'9px',fontSize:'14px',fontWeight:700,cursor:changed&&!reason.trim()?'not-allowed':'pointer',fontFamily:'inherit'}}>
          ✓ บันทึกราคา
        </button>
      </div>
    </div>
  );
};

// ─── Inventory (no category tabs, flat list) ──────────────────────────────────
const Inventory = ({user={}, products:propProducts=null, onUpdateProducts=null}) => {
  const isAdmin=user.role==='admin';
  const storageKey=`ptHiddenProds_${user.staffId||'admin'}`;
  const [products,setProductsLocal]=useState(propProducts||[...window.AppData.products]);
  const setProducts = onUpdateProducts
    ? p => { const next=typeof p==='function'?p(products):p; setProductsLocal(next); onUpdateProducts(next); }
    : setProductsLocal;
  const [search,setSearch]=useState('');
  const [modal,setModal]=useState(false);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({});
  const [hiddenIds,setHiddenIds]=useState(()=>{try{return JSON.parse(localStorage.getItem(storageKey))||[];}catch{return[];}});
  const [showHidden,setShowHidden]=useState(false);

  const toggleHide=id=>{
    setHiddenIds(prev=>{
      const next=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id];
      localStorage.setItem(storageKey,JSON.stringify(next));
      return next;
    });
  };

  const allFiltered=products.filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase())||p.sku.toLowerCase().includes(search.toLowerCase()));
  const filtered=isAdmin?allFiltered:allFiltered.filter(p=>showHidden||!hiddenIds.includes(p.id));
  const openAdd=()=>{setEditing(null);setForm({sku:'',name:'',category:'เครื่องดื่ม',cost:'',stockBase:'',minStockBase:'',unitLevels:[{name:'แพค',perNext:12,price:0},{name:'ขวด',price:0}]});setModal(true);};
  const openEdit=p=>{setEditing(p);setForm({...p,unitLevels:p.unitLevels.map(lv=>({...lv}))});setModal(true);};
  const save=()=>{const parsed={...form,cost:+form.cost,stockBase:+form.stockBase,minStockBase:+form.minStockBase};if(editing)setProducts(products.map(p=>p.id===editing.id?{...p,...parsed}:p));else setProducts([...products,{id:Date.now(),...parsed}]);setModal(false);};
  const del=id=>{if(window.confirm('ต้องการลบสินค้านี้?'))setProducts(products.filter(p=>p.id!==id));};

  const lvlOf=p=>{const r=p.stockBase/p.minStockBase;return r<=0.5?'critical':r<=1?'low':'ok';};
  const clrOf=l=>({critical:'#DC2626',low:'#D97706',ok:'#16A34A'}[l]);
  const bdgOf=l=>({critical:'red',low:'yellow',ok:'green'}[l]);
  const lblOf=l=>({critical:'⚠ วิกฤต',low:'• ใกล้หมด',ok:'✓ ปกติ'}[l]);
  const priceRange=p=>{const ps=p.unitLevels.map(lv=>lv.price);return ps.length===1?`฿${ps[0]}`:`฿${Math.min(...ps).toLocaleString()} – ฿${Math.max(...ps).toLocaleString()}`;};

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
      {!isAdmin&&<div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:'10px',padding:'10px 16px',display:'flex',alignItems:'center',gap:'10px'}}><IcoEye/><p style={{fontSize:'13px',color:'#1E40AF',fontWeight:500}}>กดปุ่ม <strong>🚫 ซ่อน</strong> หน้าสินค้าที่ไม่ขาย — สินค้าจะหายจากหน้านี้และหน้าขายของคุณ</p></div>}
      <div style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
        <div style={{position:'relative',flex:'1 1 220px'}}>
          <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#94A3B8',display:'flex'}}><IcoSearch/></span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาชื่อสินค้า หรือ SKU…" style={{width:'100%',padding:'10px 12px 10px 36px',border:'1.5px solid var(--border)',borderRadius:'10px',fontSize:'14px',fontFamily:'inherit',background:'var(--surface)'}}/>
        </div>
        {isAdmin&&<Btn icon={<IcoPlus/>} onClick={openAdd}>เพิ่มสินค้า</Btn>}
        {!isAdmin&&hiddenIds.length>0&&(
          <button onClick={()=>setShowHidden(h=>!h)} style={{padding:'9px 14px',borderRadius:'9px',border:'1.5px solid var(--border)',background:'var(--surface)',cursor:'pointer',fontFamily:'inherit',fontSize:'13px',fontWeight:600,color:'var(--text-muted)'}}>
            {showHidden?'🙈 ซ่อนรายการที่ปิด':'👁 ดูสินค้าที่ซ่อน ('+hiddenIds.length+')'}
          </button>
        )}
      </div>
      <div style={{display:'flex',gap:'14px',fontSize:'13px',color:'var(--text-muted)'}}>
        <span>ทั้งหมด <strong style={{color:'var(--text)'}}>{products.length}</strong> รายการ</span>
        <span>·</span><span>แสดง <strong style={{color:'var(--text)'}}>{filtered.length}</strong> รายการ</span>
        {!isAdmin&&hiddenIds.length>0&&<><span>·</span><span style={{color:'#6B7280'}}>ซ่อนแล้ว <strong>{hiddenIds.length}</strong> รายการ</span></>}
        <span>·</span><span style={{color:'#DC2626',fontWeight:500}}>ใกล้หมด/วิกฤต <strong>{products.filter(p=>p.stockBase<=p.minStockBase).length}</strong> รายการ</span>
      </div>
      <Card>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{background:'#F8FAFC',borderBottom:'2px solid var(--border)'}}>
              {['SKU','ชื่อสินค้า','หมวดหมู่','สต๊อก','สถานะ',isAdmin?'จัดการ':''].filter(h=>h!=='').map((h,i)=><th key={i} style={{padding:'11px 16px',textAlign:'left',fontSize:'11px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',whiteSpace:'nowrap'}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map((p,i)=>{const lvl=lvlOf(p);return(
                <tr key={p.id} style={{borderBottom:'1px solid var(--border)',background:i%2===0?'transparent':'#FAFBFC'}}>
                  <td style={{padding:'13px 16px',fontSize:'12px',color:'var(--text-muted)',fontFamily:'monospace',fontWeight:600}}>{p.sku}</td>
                  <td style={{padding:'13px 16px',fontSize:'14px',fontWeight:600}}>{p.name}</td>
                  <td style={{padding:'13px 16px'}}><Badge color="indigo">{p.category}</Badge></td>
                  <td style={{padding:'13px 16px'}}>
                    <p style={{fontSize:'15px',fontWeight:800,color:clrOf(lvl)}}>{formatStock(p.stockBase,p.unitLevels)}</p>
                    <div style={{marginTop:'5px',height:'4px',background:'#E2E8F0',borderRadius:'2px',width:'80px'}}><div style={{height:'100%',borderRadius:'2px',background:clrOf(lvl),width:`${Math.min(100,(p.stockBase/(p.minStockBase*2||1))*100)}%`}}/></div>
                  </td>
                  <td style={{padding:'13px 16px'}}><Badge color={bdgOf(lvl)}>{lblOf(lvl)}</Badge></td>
                  {isAdmin&&<td style={{padding:'13px 16px'}}><div style={{display:'flex',gap:'6px'}}><button onClick={()=>openEdit(p)} style={{background:'var(--primary-light)',border:'none',color:'var(--primary)',padding:'7px 10px',borderRadius:'8px',cursor:'pointer',display:'flex'}}><IcoEdit/></button><button onClick={()=>del(p.id)} style={{background:'#FEE2E2',border:'none',color:'#DC2626',padding:'7px 10px',borderRadius:'8px',cursor:'pointer',display:'flex'}}><IcoTrash/></button></div></td>}
                  {!isAdmin&&<td style={{padding:'13px 16px'}}>
                    <button onClick={()=>toggleHide(p.id)} title={hiddenIds.includes(p.id)?'คลิกเพื่อแสดงสินค้านี้':'ซ่อนสินค้านี้จากรายการของคุณ'}
                      style={{padding:'7px 12px',borderRadius:'8px',border:'1.5px solid',cursor:'pointer',fontFamily:'inherit',fontSize:'12px',fontWeight:600,
                        background:hiddenIds.includes(p.id)?'#F0FDF4':'#FEF2F2',
                        color:hiddenIds.includes(p.id)?'#16A34A':'#DC2626',
                        borderColor:hiddenIds.includes(p.id)?'#BBF7D0':'#FECACA'}}>
                      {hiddenIds.includes(p.id)?'✓ แสดงอยู่':'🚫 ซ่อน'}
                    </button>
                  </td>}
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </Card>
      {isAdmin&&<Modal open={modal} onClose={()=>setModal(false)} title={editing?'แก้ไขสินค้า':'เพิ่มสินค้าใหม่'} width={580}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <AppInput label="SKU" value={form.sku||''} onChange={e=>setForm({...form,sku:e.target.value})} placeholder="BEV001"/>
          <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
            <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>หมวดหมู่</label>
            <select value={form.category||''} onChange={e=>setForm({...form,category:e.target.value})} style={{padding:'10px 12px',border:'1.5px solid var(--border)',borderRadius:'8px',fontSize:'14px',fontFamily:'inherit',background:'var(--surface)'}}>
              {window.AppData.categories.filter(c=>c!=='ทั้งหมด').map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{gridColumn:'1/-1'}}><AppInput label="ชื่อสินค้า" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ชื่อสินค้า..."/></div>
          {(()=>{
            const levels=form.unitLevels||[];
            const topUnit=levels[0]?.name||baseUnitName(levels);
            const toBase0=calcToBase(0,levels)||1;
            const isTopBase=toBase0===1;
            const stockInTop=Math.round((+(form.stockBase||0))/toBase0);
            const minInTop=Math.round((+(form.minStockBase||0))/toBase0);
            return(<>
              <AppInput label="ต้นทุน/หน่วยฐาน (฿)" type="number" value={form.cost||''} onChange={e=>setForm({...form,cost:e.target.value})}/>
              <AppInput label={`สต๊อก (${topUnit})`} type="number" value={isTopBase?form.stockBase||'':stockInTop||''} onChange={e=>setForm({...form,stockBase:Math.round(+e.target.value*toBase0)})} placeholder="0"/>
              <div style={{gridColumn:'1/-1'}}><AppInput label={`สต๊อกขั้นต่ำ (${topUnit})`} type="number" value={isTopBase?form.minStockBase||'':minInTop||''} onChange={e=>setForm({...form,minStockBase:Math.round(+e.target.value*toBase0)})} placeholder="0"/></div>
            </>);
          })()}
          <div style={{gridColumn:'1/-1',display:'flex',flexDirection:'column',gap:'8px'}}>
            <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>หน่วยนับสินค้า</label>
            <UnitLevelsEditor levels={form.unitLevels||[]} onChange={ul=>setForm({...form,unitLevels:ul})}/>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:'10px',marginTop:'22px',paddingTop:'18px',borderTop:'1px solid var(--border)'}}><Btn variant="outline" onClick={()=>setModal(false)}>ยกเลิก</Btn><Btn icon={<IcoCheck/>} onClick={save}>{editing?'บันทึก':'เพิ่มสินค้า'}</Btn></div>
      </Modal>}
    </div>
  );
};

// ─── POS Screen ───────────────────────────────────────────────────────────────
const POSScreen = ({user={},customers=[],onAddCustomer,employees=[],receiptSettings,onOpenReceiptSettings,onCreditSale,onSale}) => {
  const isAdmin=user.role==='admin';
  const hiddenProdIds=React.useMemo(()=>{try{return JSON.parse(localStorage.getItem(`ptHiddenProds_${user.staffId||'admin'}`))||[];}catch{return[];}},[user.staffId]);
  const [products]=useState(()=>{
    const all=[...window.AppData.products];
    return isAdmin?all:all.filter(p=>!hiddenProdIds.includes(p.id));
  });
  const [cart,setCart]          =useState([]);
  const [search,setSearch]      =useState('');
  const [customer,setCustomer]  =useState('');
  const [payMethod,setPayMethod]=useState('cash');
  const [discount,setDiscount]  =useState(0);
  const [addDialog,setAddDialog]=useState(null);
  const [showQR,setShowQR]      =useState(false);
  const [voidModal,setVoidModal]=useState(false);
  const [showReceipt,setShowReceipt]=useState(false);
  const [lastSale,setLastSale]  =useState(null);
  const [addCustModal,setAddCustModal]=useState(false);
  const [freebies,setFreebies]       =useState([]);
  const [freebieDialog,setFreebieDialog]=useState(null);
  const [priceEdits,setPriceEdits]   =useState({}); // {_key:{price,reason}}
  const [editPriceItem,setEditPriceItem]=useState(null); // item being price-edited

  const effPrice=item=>priceEdits[item._key]?.price??item.unitPrice;

  const handleAddFreebie=item=>{
    const key=item._key;
    setFreebies(prev=>{const ex=prev.find(x=>x._key===key);return ex?prev.map(x=>x._key===key?{...x,qty:x.qty+item.qty}:x):[...prev,{...item,_key:key}];});
  };
  const removeFreebie=key=>setFreebies(f=>f.filter(x=>x._key!==key));

  // Customer isolation: admin sees all, staff sees own
  const myCusts=isAdmin?customers:customers.filter(c=>c.createdBy===user.staffId);

  const visible=products.filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddItem=item=>{
    const key=`${item.id}-${item.unitIdx}`;
    setCart(prev=>{const ex=prev.find(x=>x._key===key);return ex?prev.map(x=>x._key===key?{...x,qty:x.qty+item.qty}:x):[...prev,{...item,_key:key}];});
  };
  const setQty=(key,q)=>{if(q<1)setCart(c=>c.filter(x=>x._key!==key));else setCart(c=>c.map(x=>x._key===key?{...x,qty:q}:x));};

  const subtotal=cart.reduce((s,x)=>s+x.qty*effPrice(x),0);
  const discAmt=Math.round(subtotal*discount/100);
  const total=subtotal-discAmt;

  const staffData=employees.find(e=>e.id===user.staffId)||{};

  const finalize=()=>{
    const itemsWithPrice=cart.map(x=>({...x,unitPrice:effPrice(x),priceEdited:!!priceEdits[x._key],editReason:priceEdits[x._key]?.reason||''}));
    const now=new Date();
    const sale={
      id:`BIL-${Date.now()}`,
      ts:now.getTime(),
      items:itemsWithPrice,subtotal,discAmt,discount,total,payMethod,
      payment:payMethod,
      itemCount:itemsWithPrice.reduce((s,x)=>s+x.qty,0),
      freebies:[...freebies],freebieTotal:freebies.reduce((s,x)=>s+x.qty*x.unitPrice,0),
      hasPriceEdit:Object.keys(priceEdits).length>0,
      customer:myCusts.find(c=>c.id===+customer)||null,
      customerName:(myCusts.find(c=>c.id===+customer)||{}).name||'ลูกค้าทั่วไป',
      date:now.toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'}),
      staffName:user.name,staffId:user.staffId,
      isPaid: payMethod!=='credit',
    };
    if(onSale) onSale(sale);
    if(payMethod==='credit'&&onCreditSale) onCreditSale(sale);
    setLastSale(sale);
    setShowReceipt(true);
    setCart([]);setFreebies([]);setPriceEdits({});setDiscount(0);setCustomer('');
  };

  const handleVoid=reason=>{setCart([]);setFreebies([]);setPriceEdits({});setDiscount(0);setCustomer('');};

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 370px',gap:'16px',height:'calc(100vh - 108px)',minHeight:'500px'}}>
      {/* Products */}
      <div style={{display:'flex',flexDirection:'column',gap:'10px',overflow:'hidden'}}>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#94A3B8',display:'flex'}}><IcoSearch/></span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาสินค้า..." style={{width:'100%',padding:'10px 12px 10px 36px',border:'1.5px solid var(--border)',borderRadius:'10px',fontSize:'14px',fontFamily:'inherit',background:'var(--surface)'}}/>
        </div>
        <div style={{overflowY:'auto',flex:1}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(148px,1fr))',gap:'10px'}}>
            {visible.map(p=>{
              const inCart=cart.filter(x=>x.id===p.id);
              const lv0=p.unitLevels?.[0];
              return(
                <button key={p.id} onClick={()=>setAddDialog(p)} style={{background:'var(--surface)',border:inCart.length?'2px solid var(--primary)':'1.5px solid var(--border)',borderRadius:'13px',padding:'14px',cursor:'pointer',textAlign:'left',display:'flex',flexDirection:'column',gap:'6px',fontFamily:'inherit',position:'relative',transition:'all 0.15s'}}>
                  {inCart.length>0&&<span style={{position:'absolute',top:'8px',right:'8px',background:'var(--primary)',color:'#fff',borderRadius:'999px',padding:'2px 8px',fontSize:'11px',fontWeight:700}}>{inCart.map(x=>`${x.qty}${x.unitName}`).join('+')}</span>}
                  <div style={{width:'42px',height:'42px',background:'var(--primary-light)',borderRadius:'11px',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--primary)'}}><IcoPackage/></div>
                  <p style={{fontSize:'13px',fontWeight:600,color:'var(--text)',lineHeight:1.3}}>{p.name}</p>
                  {lv0&&<p style={{fontSize:'13px',fontWeight:800,color:'var(--primary)'}}>฿{lv0.price?.toLocaleString()}<span style={{fontSize:'11px',fontWeight:400,color:'var(--text-muted)'}}>/{lv0.name}</span></p>}
                  <p style={{fontSize:'11px',color:p.stockBase<=p.minStockBase?'#DC2626':'var(--text-muted)'}}>{formatStock(p.stockBase,p.unitLevels)}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cart */}
      <div style={{background:'var(--surface)',borderRadius:'16px',border:'1px solid var(--border)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><p style={{fontWeight:700,fontSize:'15px'}}>ตะกร้าสินค้า</p><p style={{fontSize:'12px',color:'var(--text-muted)'}}>{cart.length} รายการ</p></div>
          {cart.length>0&&<button onClick={()=>setVoidModal(true)} style={{background:'#FEF3C7',border:'1px solid #FDE68A',color:'#92400E',padding:'5px 11px',borderRadius:'7px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>⊗ ยกเลิกบิล</button>}
        </div>

        {/* Customer selector + add */}
        <div style={{padding:'10px 14px',borderBottom:'1px solid var(--border)',display:'flex',gap:'8px'}}>
          <select value={customer} onChange={e=>setCustomer(e.target.value)} style={{flex:1,padding:'9px 10px',border:'1.5px solid var(--border)',borderRadius:'9px',fontSize:'13px',fontFamily:'inherit',background:'var(--surface)',color:'var(--text)'}}>
            <option value="">— เลือกลูกค้า —</option>
            {myCusts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={()=>setAddCustModal(true)} title="เพิ่มลูกค้าใหม่" style={{width:'38px',height:'38px',background:'var(--primary-light)',border:'1.5px solid var(--primary)',color:'var(--primary)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><IcoPlus/></button>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'10px 10px'}}>
          {cart.length===0
            ?<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'120px',color:'var(--text-muted)',gap:'8px'}}><IcoCart/><p style={{fontSize:'13px'}}>คลิกสินค้าเพื่อเพิ่มลงตะกร้า</p></div>
            :cart.map(item=>{const ep=effPrice(item);const edited=!!priceEdits[item._key];return(
              <div key={item._key} style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px',borderRadius:'11px',marginBottom:'6px',background:edited?'#FFFBEB':'#F8FAFC',border:edited?'1px solid #FDE68A':'none'}}>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:'13px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.name}</p>
                  <div style={{display:'flex',alignItems:'center',gap:'5px',flexWrap:'wrap'}}>
                    <p style={{fontSize:'12px',color:'var(--text-muted)'}}>฿{ep?.toLocaleString()}/{item.unitName} × {item.qty} = <strong style={{color:'var(--primary)'}}>฿{(item.qty*ep).toLocaleString()}</strong></p>
                    {edited&&<span style={{fontSize:'10px',background:'#FEF3C7',color:'#92400E',padding:'1px 6px',borderRadius:'5px',fontWeight:600}}>แก้ราคา</span>}
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'4px',flexShrink:0}}>
                  <button onClick={()=>setQty(item._key,item.qty-1)} style={{width:'26px',height:'26px',borderRadius:'7px',border:'1.5px solid var(--border)',background:'var(--surface)',cursor:'pointer',fontWeight:700,fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                  <span style={{fontSize:'14px',fontWeight:700,minWidth:'24px',textAlign:'center'}}>{item.qty}</span>
                  <button onClick={()=>setQty(item._key,item.qty+1)} style={{width:'26px',height:'26px',borderRadius:'7px',border:'none',background:'var(--primary)',color:'#fff',cursor:'pointer',fontWeight:700,fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                  <button onClick={()=>setQty(item._key,0)} title="ลบออกจากตะกร้า" style={{width:'26px',height:'26px',borderRadius:'7px',border:'1px solid #FECACA',background:'#FEE2E2',cursor:'pointer',fontSize:'14px',color:'#DC2626',display:'flex',alignItems:'center',justifyContent:'center',marginLeft:'2px'}}>🗑</button>
                </div>
              </div>
            );})}
          {/* ─ Freebie section ─ */}
          {(freebies.length>0||true)&&(
            <div style={{marginTop:'6px',borderTop:'1.5px dashed #D1FAE5',paddingTop:'8px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px'}}>
                <p style={{fontSize:'12px',fontWeight:700,color:'#16A34A',display:'flex',alignItems:'center',gap:'4px'}}><IcoGift size={14}/> ของแถม ({freebies.length} รายการ)</p>
                <button onClick={()=>setFreebieDialog('open')} style={{fontSize:'11px',background:'#D1FAE5',border:'none',color:'#16A34A',padding:'4px 10px',borderRadius:'7px',cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>+ เพิ่มของแถม</button>
              </div>
              {freebies.map(item=>(
                <div key={item._key} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',borderRadius:'9px',marginBottom:'4px',background:'#F0FDF4',border:'1px solid #BBF7D0'}}>
                  <span style={{fontSize:'16px'}}>🎁</span>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:'12px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.name}</p>
                    <p style={{fontSize:'11px',color:'#16A34A'}}>{item.qty} {item.unitName} (ไม่คิดเงิน)</p>
                  </div>
                  <button onClick={()=>removeFreebie(item._key)} style={{background:'none',border:'none',cursor:'pointer',color:'#DC2626',fontSize:'16px',padding:'0 4px'}}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{padding:'14px 16px',borderTop:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:'9px'}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',color:'var(--text-muted)'}}><span>ราคารวม</span><span style={{fontWeight:600,color:'var(--text)'}}>฿{subtotal.toLocaleString()}</span></div>
          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
            <span style={{fontSize:'12px',color:'var(--text-muted)',flexShrink:0}}>ส่วนลด:</span>
            <div style={{display:'flex',gap:'4px'}}>{[0,5,10,15,20].map(d=>(<button key={d} onClick={()=>setDiscount(d)} style={{padding:'4px 8px',borderRadius:'6px',border:'1.5px solid',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:600,background:discount===d?'var(--primary)':'var(--surface)',color:discount===d?'#fff':'var(--text-muted)',borderColor:discount===d?'var(--primary)':'var(--border)'}}>{d}%</button>))}</div>
          </div>
          {discount>0&&<div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',color:'#DC2626',fontWeight:600}}><span>ลด {discount}%</span><span>−฿{discAmt.toLocaleString()}</span></div>}
          <div style={{display:'flex',justifyContent:'space-between',fontWeight:800,fontSize:'20px',padding:'10px 0',borderTop:'2px solid var(--border)'}}><span>ยอดสุทธิ</span><span style={{color:'var(--primary)'}}>฿{total.toLocaleString()}</span></div>
          <div style={{display:'flex',gap:'6px'}}>
            {[{id:'cash',label:'เงินสด',icon:'💵'},{id:'transfer',label:'โอน',icon:'🏦'},{id:'credit',label:'เครดิต',icon:'📋'}].map(m=>(
              <button key={m.id} onClick={()=>setPayMethod(m.id)} style={{flex:1,padding:'9px 4px',borderRadius:'10px',border:'1.5px solid',cursor:'pointer',fontFamily:'inherit',fontSize:'12px',fontWeight:600,display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',background:payMethod===m.id?'var(--primary-light)':'var(--surface)',color:payMethod===m.id?'var(--primary)':'var(--text-muted)',borderColor:payMethod===m.id?'var(--primary)':'var(--border)'}}>
                <span style={{fontSize:'20px'}}>{m.icon}</span><span>{m.label}</span>
              </button>
            ))}
          </div>
          {payMethod==='credit'&&(
            <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:'9px',padding:'10px 14px',fontSize:'12px',color:'#92400E',fontWeight:600}}>
              📋 ขายเครดิต — บันทึกยอดค้างชำระ เก็บเงินทีหลัง
            </div>
          )}
          <button onClick={finalize} disabled={cart.length===0}
            style={{width:'100%',padding:'14px',background:cart.length===0?'#E2E8F0':payMethod==='credit'?'linear-gradient(135deg,#F59E0B,#D97706)':'linear-gradient(135deg,#4F46E5,#7C3AED)',color:cart.length===0?'#94A3B8':'#fff',border:'none',borderRadius:'12px',fontSize:'16px',fontWeight:800,cursor:cart.length===0?'not-allowed':'pointer',fontFamily:'inherit',boxShadow:cart.length===0?'none':'0 4px 16px rgba(79,70,229,0.25)'}}>
            {payMethod==='credit'?'📋 บันทึกเครดิต':'✓ ชำระเงิน'}
          </button>
        </div>
      </div>

      <AddItemModal product={addDialog} onAdd={handleAddItem} onClose={()=>setAddDialog(null)}/>
      <AddItemModal product={freebieDialog==='open'?products[0]:null} onAdd={handleAddFreebie} onClose={()=>setFreebieDialog(null)}/>
      <VoidModal open={voidModal} onClose={()=>setVoidModal(false)} onConfirm={handleVoid} total={total}/>

      {/* Price Edit Modal */}
      <Modal open={!!editPriceItem} onClose={()=>setEditPriceItem(null)} title="แก้ไขราคาสินค้า" width={400}>
        {editPriceItem&&<PriceEditModal item={editPriceItem} currentOverride={priceEdits[editPriceItem._key]} onSave={(price,reason)=>{setPriceEdits(p=>({...p,[editPriceItem._key]:{price,reason}}));setEditPriceItem(null);}} onReset={()=>{setPriceEdits(p=>{const n={...p};delete n[editPriceItem._key];return n;});setEditPriceItem(null);}} onClose={()=>setEditPriceItem(null)}/>}
      </Modal>

      {/* Freebie Product Picker — with unit + qty selection */}
      <FreebiePickerModal open={freebieDialog==='open'} products={products} onAdd={item=>{handleAddFreebie(item);setFreebieDialog(null);}} onClose={()=>setFreebieDialog(null)}/>
      <AddCustomerModal open={addCustModal} onClose={()=>setAddCustModal(false)} onAdd={onAddCustomer} user={user}/>
      <ReceiptModal open={showReceipt} onClose={()=>setShowReceipt(false)} sale={lastSale} staffData={staffData} settings={receiptSettings} onOpenSettings={onOpenReceiptSettings}/>
    </div>
  );
};

// ─── Reports (live data) ──────────────────────────────────────────────────────
const Reports = ({ recentSales=[], products=[], customers=[] }) => {
  const [period,setPeriod]=useState('week');
  const dayKey = ts => { const d=new Date(ts); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
  const tsOf   = s => s.ts || Date.now();

  const periodCfg = { week:{days:7,label:'7 วันล่าสุด'}, month:{days:30,label:'30 วันล่าสุด'}, quarter:{days:90,label:'90 วันล่าสุด'} };
  const days = periodCfg[period].days;
  const cutoff = Date.now() - days*86400000;
  const periodSales = recentSales.filter(s => tsOf(s) >= cutoff);

  const totalRev = periodSales.reduce((s,x)=>s+(x.total||0),0);
  const billCount = periodSales.length;
  const avgPerDay = Math.round(totalRev/days);
  const profit = Math.round(totalRev*0.22);
  const kpis=[
    {label:'รายได้รวม',value:`฿${totalRev.toLocaleString()}`,color:'#4F46E5'},
    {label:'เฉลี่ยต่อวัน',value:`฿${avgPerDay.toLocaleString()}`,color:'#10B981'},
    {label:'จำนวนบิล',value:`${billCount} ใบ`,color:'#F59E0B'},
    {label:'กำไร (ประมาณ)',value:`฿${profit.toLocaleString()}`,color:'#8B5CF6'},
  ];

  // กราฟยอดขายรายวัน — แสดงสูงสุด 14 แท่งสำหรับช่วงที่ยาว
  const barCount = Math.min(days, 14);
  const dailySales=[];
  for(let i=barCount-1; i>=0; i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const key=dayKey(d.getTime());
    const amount=recentSales.filter(s=>dayKey(tsOf(s))===key).reduce((s,x)=>s+(x.total||0),0);
    dailySales.push({ day:d.toLocaleDateString('th-TH',{month:'short',day:'numeric'}), amount });
  }
  const maxAmt=Math.max(...dailySales.map(d=>d.amount),1);

  // สินค้าขายดี — รวมจำนวนชิ้นจากรายการขายจริง
  const prodMap={};
  periodSales.forEach(sale=>{
    (Array.isArray(sale.items)?sale.items:[]).forEach(it=>{
      const name=it.name||'ไม่ระบุ';
      prodMap[name]=(prodMap[name]||0)+(it.qty||0);
    });
  });
  const topProds=Object.entries(prodMap).map(([name,sold])=>({name,sold})).sort((a,b)=>b.sold-a.sold).slice(0,5);
  const topMax = topProds[0]?.sold || 1;

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <div style={{display:'flex',gap:'8px'}}>{[{id:'week',label:'7 วันล่าสุด'},{id:'month',label:'30 วันล่าสุด'},{id:'quarter',label:'90 วัน'}].map(p=>(<button key={p.id} onClick={()=>setPeriod(p.id)} style={{padding:'9px 18px',borderRadius:'9px',border:'1.5px solid',cursor:'pointer',fontFamily:'inherit',fontWeight:600,fontSize:'13px',background:period===p.id?'var(--primary)':'var(--surface)',color:period===p.id?'#fff':'var(--text-muted)',borderColor:period===p.id?'var(--primary)':'var(--border)'}}>{p.label}</button>))}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'14px'}}>{kpis.map((k,i)=><Card key={i} style={{padding:'20px'}}><p style={{fontSize:'12px',color:'var(--text-muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px'}}>{k.label}</p><p style={{fontSize:'28px',fontWeight:800,color:k.color}}>{k.value}</p></Card>)}</div>
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:'16px'}}>
        <Card style={{padding:'22px'}}>
          <p style={{fontSize:'15px',fontWeight:700,marginBottom:'2px'}}>ยอดขายรายวัน</p>
          <p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'22px'}}>Daily Revenue</p>
          <div style={{display:'flex',alignItems:'flex-end',gap:'8px',height:'180px'}}>
            {dailySales.map((d,i)=>{const h=(d.amount/maxAmt)*150;const isT=i===dailySales.length-1;return(<div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}><span style={{fontSize:'9px',color:'var(--text-muted)',fontWeight:600}}>{d.amount>=1000?`฿${(d.amount/1000).toFixed(0)}k`:d.amount>0?`฿${d.amount}`:''}</span><div style={{width:'100%',height:`${Math.max(h,2)}px`,background:isT?'#C7D2FE':'var(--primary)',borderRadius:'7px 7px 0 0',opacity:isT?0.7:1}}/><span style={{fontSize:'9px',color:'var(--text-muted)',whiteSpace:'nowrap'}}>{d.day}</span></div>);})}
          </div>
        </Card>
        <Card style={{padding:'22px'}}>
          <p style={{fontSize:'15px',fontWeight:700,marginBottom:'2px'}}>สินค้าขายดี</p>
          <p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'16px'}}>Top Products</p>
          {topProds.length===0
            ? <p style={{fontSize:'13px',color:'var(--text-muted)',padding:'20px 0',textAlign:'center'}}>ยังไม่มีข้อมูลการขายในช่วงนี้</p>
            : <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>{topProds.map((p,i)=>(<div key={i}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}><p style={{fontSize:'13px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'65%'}}>{p.name}</p><span style={{fontSize:'12px',color:'var(--text-muted)',flexShrink:0}}>{p.sold} ชิ้น</span></div><div style={{height:'7px',background:'#E2E8F0',borderRadius:'4px'}}><div style={{height:'100%',borderRadius:'4px',background:`hsl(${230+i*25},65%,55%)`,width:`${(p.sold/topMax)*100}%`}}/></div></div>))}</div>
          }
        </Card>
      </div>
    </div>
  );
};

// ─── Customers ────────────────────────────────────────────────────────────────
const Customers = ({user={},customers=[],onAddCustomer}) => {
  const isAdmin=user.role==='admin';
  const myCusts=isAdmin?customers:customers.filter(c=>c.createdBy===user.staffId);
  const [search,setSearch]=useState('');
  const [sel,setSel]=useState(null);
  const [addModal,setAddModal]=useState(false);
  const filtered=myCusts.filter(c=>!search||c.name.toLowerCase().includes(search.toLowerCase())||c.phone?.includes(search));
  const tier=t=>t>=500000?{label:'💎 Platinum',clr:'purple'}:t>=100000?{label:'🥇 Gold',clr:'yellow'}:t>=50000?{label:'🥈 Silver',clr:'blue'}:{label:'🥉 Bronze',clr:'default'};
  return (
    <div style={{display:'grid',gridTemplateColumns:sel?'1fr 320px':'1fr',gap:'16px'}}>
      <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
        {!isAdmin&&<div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:'10px',padding:'10px 16px',display:'flex',alignItems:'center',gap:'10px'}}><IcoEye/><p style={{fontSize:'13px',color:'#1E40AF',fontWeight:500}}>แสดงเฉพาะลูกค้าที่คุณเพิ่มเอง <strong>({myCusts.length} ราย)</strong></p></div>}
        <div style={{display:'flex',gap:'10px'}}>
          <div style={{position:'relative',flex:1}}>
            <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#94A3B8',display:'flex'}}><IcoSearch/></span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาชื่อร้าน หรือเบอร์โทร..." style={{width:'100%',padding:'10px 12px 10px 36px',border:'1.5px solid var(--border)',borderRadius:'10px',fontSize:'14px',fontFamily:'inherit',background:'var(--surface)'}}/>
          </div>
          <Btn icon={<IcoPlus/>} onClick={()=>setAddModal(true)}>เพิ่มลูกค้า</Btn>
        </div>
        <Card>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{background:'#F8FAFC',borderBottom:'2px solid var(--border)'}}>{['ชื่อร้าน/ลูกค้า','ผู้ติดต่อ','เบอร์โทร','ยอดซื้อสะสม','ซื้อล่าสุด','ระดับ'].map(h=><th key={h} style={{padding:'11px 18px',textAlign:'left',fontSize:'11px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
              <tbody>{filtered.map((c,i)=>{const t=tier(c.totalPurchases);return(<tr key={c.id} onClick={()=>setSel(sel?.id===c.id?null:c)} style={{borderBottom:'1px solid var(--border)',cursor:'pointer',background:sel?.id===c.id?'var(--primary-light)':i%2===0?'transparent':'#FAFBFC'}}><td style={{padding:'13px 18px',fontSize:'14px',fontWeight:700}}>{c.name}</td><td style={{padding:'13px 18px',fontSize:'13px',color:'var(--text-muted)'}}>{c.contact||'-'}</td><td style={{padding:'13px 18px',fontSize:'13px'}}>{c.phone||'-'}</td><td style={{padding:'13px 18px',fontSize:'15px',fontWeight:800,color:'var(--primary)'}}>฿{(c.totalPurchases||0).toLocaleString()}</td><td style={{padding:'13px 18px',fontSize:'13px',color:'var(--text-muted)'}}>{c.lastPurchase||'-'}</td><td style={{padding:'13px 18px'}}><Badge color={t.clr}>{t.label}</Badge></td></tr>);})}</tbody>
            </table>
          </div>
        </Card>
      </div>
      {sel&&(<Card style={{padding:'22px',alignSelf:'start'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'18px'}}><p style={{fontSize:'15px',fontWeight:700}}>รายละเอียด</p><button onClick={()=>setSel(null)} style={{background:'#F1F5F9',border:'none',cursor:'pointer',borderRadius:'8px',padding:'5px',display:'flex'}}><IcoX/></button></div>
        <div style={{width:'60px',height:'60px',borderRadius:'50%',background:'linear-gradient(135deg,#6366F1,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'24px',margin:'0 auto 12px'}}>{sel.name.charAt(0)}</div>
        <p style={{textAlign:'center',fontWeight:700,fontSize:'15px',marginBottom:'6px'}}>{sel.name}</p>
        <div style={{textAlign:'center',marginBottom:'18px'}}><Badge color={tier(sel.totalPurchases).clr}>{tier(sel.totalPurchases).label}</Badge></div>
        {[['ผู้ติดต่อ',sel.contact||'-'],['เบอร์โทร',sel.phone||'-'],['ที่อยู่',sel.address||'-']].map(([k,v])=>(<div key={k} style={{display:'flex',justifyContent:'space-between',gap:'12px',padding:'9px 0',borderBottom:'1px solid var(--border)',fontSize:'13px'}}><span style={{color:'var(--text-muted)',flexShrink:0}}>{k}</span><span style={{fontWeight:500,textAlign:'right'}}>{v}</span></div>))}
        <div style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}><span style={{fontSize:'13px',color:'var(--text-muted)'}}>ยอดซื้อสะสม</span><span style={{fontSize:'18px',fontWeight:800,color:'var(--primary)'}}>฿{(sel.totalPurchases||0).toLocaleString()}</span></div>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',marginTop:'16px'}}><Btn variant="secondary" style={{width:'100%',justifyContent:'center'}}>ประวัติการสั่งซื้อ</Btn><Btn icon={<IcoCart/>} style={{width:'100%',justifyContent:'center'}}>สร้างใบขาย</Btn></div>
      </Card>)}
      <AddCustomerModal open={addModal} onClose={()=>setAddModal(false)} onAdd={onAddCustomer} user={user}/>
    </div>
  );
};

// ─── Staff Detail Modal ───────────────────────────────────────────────────────
const StaffDetailModal = ({emp, defaultTab='customers', onClose, allCustomers=[]}) => {
  const [tab,setTab]=useState(defaultTab);
  React.useEffect(()=>setTab(defaultTab),[defaultTab,emp?.id]);
  if(!emp) return null;

  const myCustomers = allCustomers.filter(c=>c.assignedStaff===emp.id);
  const myBills     = (window.AppData.staffBills[emp.id]||[]);
  const myInventory = (window.AppData.staffInventory[emp.id]||[]);
  const totalSales  = myBills.filter(b=>!b.void).reduce((s,b)=>s+b.total,0);

  const printOldBill = (b) => {
    const rs = (() => { try { return JSON.parse(localStorage.getItem('ptReceiptSettings'))||{}; } catch { return {}; } })();
    const companyName = rs.companyName||'PORNSAWAN TRADE';
    const paperW = rs.paperWidth==='58mm'?'240px':rs.paperWidth==='A4'?'595px':'320px';
    const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
<style>body{font-family:Sarabun,sans-serif;max-width:${paperW};margin:0 auto;padding:20px;font-size:${rs.receiptFontSize||14}px;color:#111}
h2{text-align:center;font-size:18px;margin:0 0 4px}p.sub{text-align:center;font-size:12px;color:#666;margin:2px 0}
.dashed{border:none;border-top:1px dashed #bbb;margin:10px 0}.row{display:flex;justify-content:space-between;margin:3px 0}
.big{font-weight:700;font-size:16px}.logo{text-align:center;margin-bottom:8px}@media print{body{padding:0}}</style>
</head><body>
${rs.logoUrl?`<div class="logo"><img src="${rs.logoUrl}" style="height:${rs.logoSize||60}px;object-fit:contain;max-width:100%"></div>`:''}
<h2>${companyName}</h2>
${rs.companyAddress?`<p class="sub">${rs.companyAddress}</p>`:''}
${rs.companyContact?`<p class="sub">${rs.companyContact}</p>`:''}
<p class="sub" style="color:#e55;font-weight:700">⚠ สำเนาใบเสร็จ (REPRINT)</p>
<p class="sub">ใบเสร็จรับเงิน</p>
<hr class="dashed">
<div class="row"><span>เลขที่</span><span>${b.id}</span></div>
<div class="row"><span>วันที่</span><span>${b.date}</span></div>
<div class="row"><span>พนักงาน</span><span>${emp.name}</span></div>
<div class="row"><span>ลูกค้า</span><span>${b.customer}</span></div>
<hr class="dashed">
<div class="row"><span>จำนวนรายการ</span><span>${b.items} รายการ</span></div>
<hr class="dashed">
<div class="row big"><span>ยอดสุทธิ</span><span>฿${(b.total||0).toLocaleString()}</span></div>
${rs.footerText?`<hr class="dashed"><p class="sub">${rs.footerText}</p>`:''}
</body></html>`;
    const w = window.open('about:blank','_blank','width=420,height=600');
    w.document.write(html);
    w.document.close();
    setTimeout(()=>w.print(),400);
  };

  const tabs=[
    {id:'customers', icon:'👥', label:'ข้อมูลลูกค้า',     count:myCustomers.length},
    {id:'sales',     icon:'📊', label:'รายงานการขาย',      count:myBills.length},
    {id:'inventory', icon:'📦', label:'สินค้าคงเหลือในมือ', count:myInventory.length},
  ];

  return (
    <Modal open={!!emp} onClose={onClose} title={`${emp.name}`} width={620}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px 16px',background:'var(--bg)',borderRadius:'12px',marginBottom:'18px'}}>
        <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'linear-gradient(135deg,#10B981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'22px',flexShrink:0}}>{emp.name.charAt(0)}</div>
        <div style={{flex:1}}><p style={{fontWeight:700,fontSize:'16px'}}>{emp.name}</p><p style={{fontSize:'12px',color:'var(--text-muted)'}}>📞 {emp.phone} · PromptPay: {emp.promptPayId||'-'}</p></div>
        <div style={{display:'flex',gap:'16px',flexShrink:0,textAlign:'right'}}>
          <div><p style={{fontSize:'10px',color:'var(--text-muted)',textTransform:'uppercase',fontWeight:600,letterSpacing:'0.05em'}}>ยอดขายรวม</p><p style={{fontSize:'18px',fontWeight:800,color:'var(--primary)'}}>฿{totalSales.toLocaleString()}</p></div>
          <div><p style={{fontSize:'10px',color:'var(--text-muted)',textTransform:'uppercase',fontWeight:600,letterSpacing:'0.05em'}}>ลูกค้า</p><p style={{fontSize:'18px',fontWeight:800,color:'#10B981'}}>{myCustomers.length}</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:'8px',marginBottom:'18px'}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:'10px 8px',borderRadius:'10px',border:'1.5px solid',cursor:'pointer',fontFamily:'inherit',fontWeight:600,fontSize:'13px',textAlign:'center',
              background:tab===t.id?'var(--primary)':'var(--surface)',
              color:tab===t.id?'#fff':'var(--text-muted)',
              borderColor:tab===t.id?'var(--primary)':'var(--border)'}}>
            {t.icon} {t.label}
            {t.count>0&&<span style={{marginLeft:'4px',fontSize:'11px',opacity:0.75}}>({t.count})</span>}
          </button>
        ))}
      </div>

      {/* ─ Tab: ลูกค้า ─ */}
      {tab==='customers'&&(
        <div style={{display:'flex',flexDirection:'column',gap:'10px',maxHeight:'380px',overflowY:'auto'}}>
          {myCustomers.length===0
            ?<div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>ยังไม่มีลูกค้าที่รับผิดชอบ</div>
            :myCustomers.map(c=>(
              <div key={c.id} style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px',background:'var(--bg)',borderRadius:'11px'}}>
                <div style={{width:'42px',height:'42px',borderRadius:'50%',background:'linear-gradient(135deg,#6366F1,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'16px',flexShrink:0}}>{c.name.charAt(0)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontWeight:600,fontSize:'14px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</p>
                  <p style={{fontSize:'12px',color:'var(--text-muted)'}}>{c.phone||'-'} · ซื้อล่าสุด {c.lastPurchase||'-'}</p>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <p style={{fontSize:'15px',fontWeight:800,color:'var(--primary)'}}>฿{(c.totalPurchases||0).toLocaleString()}</p>
                  <p style={{fontSize:'11px',color:'var(--text-muted)'}}>ยอดสะสม</p>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* ─ Tab: การขาย ─ */}
      {tab==='sales'&&(
        <div style={{display:'flex',flexDirection:'column',gap:'10px',maxHeight:'380px',overflowY:'auto'}}>
          {myBills.length===0
            ?<div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>ยังไม่มีรายการขาย</div>
            :<>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'4px'}}>
                {[
                  {label:'ยอดขายรวม',value:`฿${totalSales.toLocaleString()}`,color:'var(--primary)'},
                  {label:'บิลทั้งหมด',value:`${myBills.filter(b=>!b.void).length} ใบ`,color:'#10B981'},
                  {label:'ยกเลิก',value:`${myBills.filter(b=>b.void).length} ใบ`,color:'#EF4444'},
                ].map((k,i)=>(
                  <div key={i} style={{background:'var(--bg)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
                    <p style={{fontSize:'11px',color:'var(--text-muted)',fontWeight:600,textTransform:'uppercase',marginBottom:'4px',letterSpacing:'0.04em'}}>{k.label}</p>
                    <p style={{fontSize:'18px',fontWeight:800,color:k.color}}>{k.value}</p>
                  </div>
                ))}
              </div>
              {myBills.map(b=>(
                <div key={b.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',background:b.void?'#FEF2F2':'var(--bg)',borderRadius:'10px',border:b.void?'1px solid #FECACA':'none'}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                      <p style={{fontWeight:600,fontSize:'13px',color:'var(--primary)'}}>{b.id}</p>
                      {b.void&&<Badge color="red">ยกเลิก</Badge>}
                      {b.priceEdited&&<Badge color="yellow">แก้ราคา</Badge>}
                      {b.freebieValue>0&&<Badge color="blue">ของแถม ฿{b.freebieValue}</Badge>}
                    </div>
                    <p style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>{b.customer} · {b.date} · {b.items} รายการ</p>
                    {b.editReason&&<p style={{fontSize:'11px',color:'#D97706',marginTop:'1px'}}>เหตุผล: {b.editReason}</p>}
                    {b.voidReason&&<p style={{fontSize:'11px',color:'#DC2626',marginTop:'1px'}}>ยกเลิก: {b.voidReason}</p>}
                  </div>
                  <p style={{fontSize:'16px',fontWeight:800,color:b.void?'#EF4444':'var(--text)',flexShrink:0}}>{b.void?'—':`฿${b.total.toLocaleString()}`}</p>
                  {!b.void&&<button onClick={()=>printOldBill(b)} title="พิมพ์ใบเสร็จย้อนหลัง" style={{width:'32px',height:'32px',background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:'7px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',flexShrink:0}}>🖨️</button>}
                </div>
              ))}
            </>
          }
        </div>
      )}

      {/* ─ Tab: สินค้าในมือ ─ */}
      {tab==='inventory'&&(
        <div style={{display:'flex',flexDirection:'column',gap:'10px',maxHeight:'380px',overflowY:'auto'}}>
          {myInventory.length===0
            ?<div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>ไม่มีสินค้าในมือ</div>
            :myInventory.map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px',background:'var(--bg)',borderRadius:'11px'}}>
                <div style={{width:'46px',height:'46px',background:'var(--primary-light)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--primary)',flexShrink:0}}><IcoPackage/></div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontWeight:600,fontSize:'14px'}}>{item.product}</p>
                  <p style={{fontSize:'12px',color:'var(--text-muted)'}}>หน่วย: {item.unit}</p>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <p style={{fontSize:'24px',fontWeight:900,color:'var(--primary)',lineHeight:1}}>{item.qty}</p>
                  <p style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'2px'}}>{item.unit}</p>
                </div>
              </div>
            ))
          }
          {myInventory.length>0&&(
            <div style={{padding:'12px 14px',background:'var(--primary-light)',borderRadius:'10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <p style={{fontSize:'13px',color:'var(--primary)',fontWeight:600}}>รวมสินค้าทั้งหมด</p>
              <p style={{fontSize:'15px',fontWeight:800,color:'var(--primary)'}}>{myInventory.reduce((s,x)=>s+x.qty,0).toLocaleString()} ชิ้น/หน่วย</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

// ─── Employees (with edit + PromptPay) ───────────────────────────────────────
const Employees = ({employees=[],onUpdate,onDelete,user={},customers=[]}) => {
  const isAdmin=user.role==='admin';
  const [editModal,setEditModal]=useState(false);
  const [editTarget,setEditTarget]=useState(null);
  const [form,setForm]=useState({});
  const [addModal,setAddModal]=useState(false);
  const [addForm,setAddForm]=useState({name:'',role:'employee',phone:'',joinDate:'',promptPayId:''});
  const [staffModal,setStaffModal]=useState(null);
  const [deleteConfirm,setDeleteConfirm]=useState(null); // emp to delete

  const openEdit=e=>{setEditTarget(e);setForm({...e});setEditModal(true);};
  const saveEdit=()=>{onUpdate(employees.map(e=>e.id===editTarget.id?{...e,...form}:e));setEditModal(false);};
  const addEmp=()=>{onUpdate([...employees,{id:Date.now(),...addForm,status:'active'}]);setAddModal(false);setAddForm({name:'',role:'employee',phone:'',joinDate:'',promptPayId:''});};
  const toggle=id=>onUpdate(employees.map(e=>e.id===id?{...e,status:e.status==='active'?'inactive':'active'}:e));
  const isSelf=e=>String(e.id)===String(user.uid)||String(e._fbid)===String(user.uid);
  const doDelete=()=>{if(deleteConfirm&&onDelete){onDelete(deleteConfirm.id||deleteConfirm._fbid);setDeleteConfirm(null);}};

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><p style={{fontWeight:700,fontSize:'16px'}}>จัดการพนักงาน</p><p style={{fontSize:'13px',color:'var(--text-muted)'}}>ทั้งหมด {employees.length} คน · ปฏิบัติงาน {employees.filter(e=>e.status==='active').length} คน</p></div>
        {isAdmin&&<Btn icon={<IcoPlus/>} onClick={()=>setAddModal(true)}>เพิ่มพนักงาน</Btn>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:'14px'}}>
        {employees.map(e=>(
          <Card key={e.id} style={{padding:'20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'10px'}}>
              <div style={{width:'50px',height:'50px',borderRadius:'50%',background:e.role==='admin'?'linear-gradient(135deg,#6366F1,#8B5CF6)':'linear-gradient(135deg,#10B981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'20px',flexShrink:0}}>{e.name.charAt(0)}</div>
              <div style={{flex:1,minWidth:0}}><p style={{fontWeight:700,fontSize:'15px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.name}</p><Badge color={e.role==='admin'?'purple':'blue'}>{e.role==='admin'?'👑 Admin':'👤 พนักงาน'}</Badge></div>
            </div>
            <div style={{display:'flex',gap:'6px',marginBottom:'12px'}}>
              <button onClick={()=>setStaffModal({emp:e,tab:'customers'})} style={{flex:1,padding:'8px 4px',background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#1D4ED8',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>👥 ลูกค้า</button>
              <button onClick={()=>setStaffModal({emp:e,tab:'sales'})} style={{flex:1,padding:'8px 4px',background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#16A34A',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>📊 การขาย</button>
              <button onClick={()=>setStaffModal({emp:e,tab:'inventory'})} style={{flex:1,padding:'8px 4px',background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#92400E',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>📦 สินค้า</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'4px',fontSize:'13px',color:'var(--text-muted)',marginBottom:'14px'}}>
              <p>📞 {e.phone}</p>
              <p>📅 เริ่มงาน {e.joinDate}</p>
              {e.promptPayId&&<p style={{color:'#1E1B4B',fontWeight:600}}>📱 PromptPay: {e.promptPayId}</p>}
              {!e.promptPayId&&isAdmin&&<p style={{color:'#EF4444',fontSize:'12px'}}>⚠ ยังไม่มีหมายเลข PromptPay</p>}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'8px'}}>
              <Badge color={e.status==='active'?'green':'default'}>{e.status==='active'?'● ปฏิบัติงาน':'○ พักงาน'}</Badge>
              <div style={{display:'flex',gap:'6px'}}>
                {isAdmin&&<button onClick={()=>openEdit(e)} style={{background:'var(--primary-light)',border:'none',color:'var(--primary)',padding:'6px 10px',borderRadius:'7px',cursor:'pointer',display:'flex'}}><IcoEdit/></button>}
                <button onClick={()=>toggle(e.id)} style={{fontSize:'12px',padding:'5px 10px',borderRadius:'7px',border:'1.5px solid var(--border)',background:'var(--surface)',cursor:'pointer',color:'var(--text-muted)',fontFamily:'inherit',fontWeight:500}}>สถานะ</button>
                {isAdmin&&!isSelf(e)&&<button onClick={()=>setDeleteConfirm(e)} title="ลบพนักงาน (ลาออก)" style={{background:'#FEE2E2',border:'none',color:'#DC2626',padding:'6px 10px',borderRadius:'7px',cursor:'pointer',display:'flex',alignItems:'center'}}><IcoTrash/></button>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Employee Modal */}
      {isAdmin&&<Modal open={editModal} onClose={()=>setEditModal(false)} title="แก้ไขข้อมูลพนักงาน" width={460}>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <AppInput label="ชื่อ-นามสกุล" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ชื่อพนักงาน..."/>
          <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
            <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>ตำแหน่ง</label>
            <select value={form.role||''} onChange={e=>setForm({...form,role:e.target.value})} style={{padding:'10px 12px',border:'1.5px solid var(--border)',borderRadius:'8px',fontSize:'14px',fontFamily:'inherit',background:'var(--surface)'}}>
              <option value="admin">Admin — ผู้ดูแลระบบ</option>
              <option value="employee">Employee — พนักงาน</option>
            </select>
          </div>
          <AppInput label="เบอร์โทรศัพท์" value={form.phone||''} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="08x-xxx-xxxx"/>
          <AppInput label="วันที่เริ่มงาน" value={form.joinDate||''} onChange={e=>setForm({...form,joinDate:e.target.value})} placeholder="เช่น 1 มิ.ย. 2569"/>
          <div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:'10px',padding:'14px'}}>
            <AppInput label="หมายเลข PromptPay (สำหรับแสดงในใบเสร็จ)" value={form.promptPayId||''} onChange={e=>setForm({...form,promptPayId:e.target.value})} placeholder="เช่น 08x-xxx-xxxx หรือเลขบัตรประชาชน"/>
            <p style={{fontSize:'12px',color:'#1E40AF',marginTop:'6px'}}>หมายเลขนี้จะแสดง QR PromptPay ท้ายบิลของพนักงานคนนี้โดยอัตโนมัติ</p>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:'10px',marginTop:'22px',paddingTop:'18px',borderTop:'1px solid var(--border)'}}><Btn variant="outline" onClick={()=>setEditModal(false)}>ยกเลิก</Btn><Btn icon={<IcoCheck/>} onClick={saveEdit}>บันทึกการแก้ไข</Btn></div>
      </Modal>}

      {/* Staff Detail Modal */}
      <StaffDetailModal emp={staffModal?.emp||null} defaultTab={staffModal?.tab||'customers'} onClose={()=>setStaffModal(null)} allCustomers={customers}/>

      {/* Add Employee Modal */}
      {isAdmin&&<Modal open={addModal} onClose={()=>setAddModal(false)} title="เพิ่มพนักงานใหม่" width={460}>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <AppInput label="ชื่อ-นามสกุล *" value={addForm.name} onChange={e=>setAddForm({...addForm,name:e.target.value})} placeholder="ชื่อพนักงาน..."/>
          <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
            <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>ตำแหน่ง</label>
            <select value={addForm.role} onChange={e=>setAddForm({...addForm,role:e.target.value})} style={{padding:'10px 12px',border:'1.5px solid var(--border)',borderRadius:'8px',fontSize:'14px',fontFamily:'inherit',background:'var(--surface)'}}>
              <option value="admin">Admin — ผู้ดูแลระบบ</option>
              <option value="employee">Employee — พนักงาน</option>
            </select>
          </div>
          <AppInput label="เบอร์โทร" value={addForm.phone} onChange={e=>setAddForm({...addForm,phone:e.target.value})} placeholder="08x-xxx-xxxx"/>
          <AppInput label="วันที่เริ่มงาน" value={addForm.joinDate} onChange={e=>setAddForm({...addForm,joinDate:e.target.value})} placeholder="เช่น 2 มิ.ย. 2569"/>
          <AppInput label="หมายเลข PromptPay" value={addForm.promptPayId} onChange={e=>setAddForm({...addForm,promptPayId:e.target.value})} placeholder="08x-xxx-xxxx"/>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:'10px',marginTop:'22px',paddingTop:'18px',borderTop:'1px solid var(--border)'}}><Btn variant="outline" onClick={()=>setAddModal(false)}>ยกเลิก</Btn><Btn icon={<IcoCheck/>} onClick={addEmp} disabled={!addForm.name}>เพิ่มพนักงาน</Btn></div>
      </Modal>}

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteConfirm} onClose={()=>setDeleteConfirm(null)} title="ลบพนักงานออกจากระบบ" width={420}>
        {deleteConfirm&&(
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'14px',padding:'16px',background:'#FEF2F2',borderRadius:'12px',border:'1px solid #FECACA'}}>
              <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'linear-gradient(135deg,#EF4444,#DC2626)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'22px',flexShrink:0}}>{deleteConfirm.name?.charAt(0)}</div>
              <div>
                <p style={{fontWeight:700,fontSize:'16px',color:'#991B1B'}}>{deleteConfirm.name}</p>
                <p style={{fontSize:'13px',color:'#B91C1C'}}>{deleteConfirm.role==='admin'?'👑 Admin':'👤 พนักงาน'} · {deleteConfirm.phone||'—'}</p>
              </div>
            </div>
            <div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:'10px',padding:'14px 16px'}}>
              <p style={{fontSize:'13px',fontWeight:700,color:'#92400E',marginBottom:'6px'}}>⚠ การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
              <ul style={{fontSize:'13px',color:'#B45309',paddingLeft:'18px',lineHeight:1.8}}>
                <li>ข้อมูลพนักงานจะถูกลบออกจากระบบ</li>
                <li>บัญชีการ Login จะถูกปิดใช้งาน</li>
                <li>ประวัติการขายยังคงอยู่ใน Reports</li>
              </ul>
            </div>
            <div style={{display:'flex',gap:'10px',paddingTop:'4px'}}>
              <Btn variant="outline" onClick={()=>setDeleteConfirm(null)} style={{flex:1,justifyContent:'center'}}>ยกเลิก</Btn>
              <button onClick={doDelete} style={{flex:2,padding:'12px',background:'linear-gradient(135deg,#EF4444,#DC2626)',color:'#fff',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                <IcoTrash/> ยืนยันลบพนักงาน
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─── Admin Oversight ──────────────────────────────────────────────────────────
const AdminOversight = ({employees=[]}) => {
  const {staffSales,voidHistory,products}=window.AppData;
  const [tab,setTab]=useState('sales');
  const totalRev=staffSales.reduce((s,x)=>s+x.revenue,0);
  const totalVoid=voidHistory.reduce((s,x)=>s+x.amount,0);
  const lowStock=products.filter(p=>p.stockBase<=p.minStockBase);
  const tabs=[{id:'sales',label:'ยอดขายรายพนักงาน'},{id:'voids',label:`ยกเลิกบิล (${voidHistory.length})`},{id:'stock',label:`สต๊อกวิกฤต (${lowStock.length})`}];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <div style={{background:'linear-gradient(135deg,#0F172A,#1E1B4B)',borderRadius:'14px',padding:'20px 24px',display:'flex',alignItems:'center',gap:'16px'}}>
        <div style={{width:'48px',height:'48px',background:'rgba(99,102,241,0.3)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#A5B4FC',flexShrink:0}}><IcoShield/></div>
        <div style={{flex:1}}><p style={{color:'#fff',fontWeight:700,fontSize:'16px'}}>Admin Oversight — ตรวจสอบระบบ</p><p style={{color:'rgba(255,255,255,0.55)',fontSize:'13px',marginTop:'2px'}}>ยอดขายรายบุคคล · ยกเลิกบิล · ติดตามสต๊อก</p></div>
        <div style={{display:'flex',gap:'20px',flexShrink:0}}>
          <div style={{textAlign:'right'}}><p style={{color:'rgba(255,255,255,0.5)',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.05em'}}>รายได้รวมทีม</p><p style={{color:'#A5B4FC',fontSize:'20px',fontWeight:800}}>฿{totalRev.toLocaleString()}</p></div>
          <div style={{textAlign:'right'}}><p style={{color:'rgba(255,255,255,0.5)',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.05em'}}>ยกเลิกสะสม</p><p style={{color:'#FCA5A5',fontSize:'20px',fontWeight:800}}>฿{totalVoid.toLocaleString()}</p></div>
        </div>
      </div>
      <div style={{display:'flex',gap:'8px'}}>{tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'9px 18px',borderRadius:'9px',border:'1.5px solid',cursor:'pointer',fontFamily:'inherit',fontWeight:600,fontSize:'13px',background:tab===t.id?'var(--primary)':'var(--surface)',color:tab===t.id?'#fff':'var(--text-muted)',borderColor:tab===t.id?'var(--primary)':'var(--border)'}}>{t.label}</button>)}</div>
      {tab==='sales'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'14px'}}>{staffSales.map((s,i)=>(<Card key={i} style={{padding:'20px'}}><div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'14px'}}><div style={{width:'44px',height:'44px',borderRadius:'50%',background:'linear-gradient(135deg,#10B981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'18px',flexShrink:0}}>{s.staffName.charAt(0)}</div><div><p style={{fontWeight:700,fontSize:'14px'}}>{s.staffName}</p><p style={{fontSize:'12px',color:'var(--text-muted)'}}>{s.sales} ใบขาย · ยกเลิก {s.voids} ใบ</p></div></div><p style={{fontSize:'28px',fontWeight:900,color:'var(--primary)',lineHeight:1}}>฿{s.revenue.toLocaleString()}</p><p style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'6px'}}>สินค้าขายดี: {s.topProduct}</p><div style={{marginTop:'12px',height:'6px',background:'#E2E8F0',borderRadius:'3px'}}><div style={{height:'100%',background:'var(--primary)',borderRadius:'3px',width:`${(s.revenue/Math.max(...staffSales.map(x=>x.revenue)))*100}%`}}/></div></Card>))}</div>}
      {tab==='voids'&&<Card>{voidHistory.length===0?<div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>ไม่มีประวัติการยกเลิกบิล</div>:<div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr style={{background:'#F8FAFC',borderBottom:'2px solid var(--border)'}}>{['เลขที่','วันที่','พนักงาน','บิลที่ยกเลิก','ยอด','เหตุผล'].map(h=><th key={h} style={{padding:'11px 18px',textAlign:'left',fontSize:'11px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead><tbody>{voidHistory.map((v,i)=><tr key={i} style={{borderBottom:'1px solid var(--border)',background:i%2===0?'transparent':'#FAFBFC'}}><td style={{padding:'13px 18px',fontSize:'13px',color:'#DC2626',fontWeight:600}}>{v.id}</td><td style={{padding:'13px 18px',fontSize:'13px',color:'var(--text-muted)'}}>{v.date}</td><td style={{padding:'13px 18px',fontSize:'13px',fontWeight:500}}>{v.staff}</td><td style={{padding:'13px 18px',fontSize:'13px',color:'var(--primary)'}}>{v.bill}</td><td style={{padding:'13px 18px',fontSize:'14px',fontWeight:700,color:'#DC2626'}}>−฿{v.amount.toLocaleString()}</td><td style={{padding:'13px 18px',fontSize:'13px',color:'var(--text-muted)',maxWidth:'200px'}}>{v.reason}</td></tr>)}</tbody></table></div>}</Card>}
      {tab==='stock'&&<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>{lowStock.length===0?<Card style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>สต๊อกสินค้าปกติทั้งหมด ✓</Card>:lowStock.map((p,i)=>{const lvl=p.stockBase/p.minStockBase<=0.5?'critical':'low';return(<Card key={i} style={{padding:'16px 20px'}}><div style={{display:'flex',alignItems:'center',gap:'16px'}}><div style={{width:'48px',height:'48px',background:lvl==='critical'?'#FEE2E2':'#FEF3C7',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><IcoAlert style={{color:lvl==='critical'?'#DC2626':'#D97706'}}/></div><div style={{flex:1}}><p style={{fontWeight:700,fontSize:'14px'}}>{p.name} <span style={{fontSize:'12px',color:'var(--text-muted)',fontFamily:'monospace'}}>({p.sku})</span></p><p style={{fontSize:'13px',color:'var(--text-muted)',marginTop:'2px'}}>คงเหลือ: <strong style={{color:lvl==='critical'?'#DC2626':'#D97706'}}>{formatStock(p.stockBase,p.unitLevels)}</strong> · ขั้นต่ำ: {formatStock(p.minStockBase,p.unitLevels)}</p></div><Badge color={lvl==='critical'?'red':'yellow'}>{lvl==='critical'?'⚠ วิกฤต':'• ใกล้หมด'}</Badge></div></Card>);})}</div>}
    </div>
  );
};

// ─── Credit Screen (Employee) ─────────────────────────────────────────────────
const CreditScreen = ({user={}, creditSales=[], onReceivePayment}) => {
  const mySales = creditSales.filter(s => s.staffId === user.staffId);
  const unpaid   = mySales.filter(s => !s.isPaid);
  const paid     = mySales.filter(s => s.isPaid);
  const totalUnpaid = unpaid.reduce((sum,s) => sum + s.total, 0);
  const [confirmId, setConfirmId] = useState(null);
  const [payNote, setPayNote] = useState('');

  const doReceive = (id) => {
    onReceivePayment(id, payNote);
    setConfirmId(null);
    setPayNote('');
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px',maxWidth:'740px'}}>
      {/* Summary banner */}
      <div style={{background:'linear-gradient(135deg,#92400E,#B45309)',borderRadius:'14px',padding:'20px 24px',display:'flex',alignItems:'center',gap:'16px'}}>
        <div style={{width:'48px',height:'48px',background:'rgba(255,255,255,0.15)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#FEF3C7',flexShrink:0,fontSize:'24px'}}>📋</div>
        <div style={{flex:1}}>
          <p style={{color:'#FEF3C7',fontWeight:700,fontSize:'16px'}}>ยอดเครดิตค้างชำระ</p>
          <p style={{color:'rgba(255,255,255,0.65)',fontSize:'13px',marginTop:'2px'}}>{unpaid.length} บิล รอรับเงิน</p>
        </div>
        <div style={{textAlign:'right',flexShrink:0}}>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.05em'}}>ยอดรวมค้างชำระ</p>
          <p style={{color:'#FEF9C3',fontSize:'28px',fontWeight:900,lineHeight:1}}>฿{totalUnpaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Unpaid */}
      {unpaid.length === 0
        ? <Card style={{padding:'48px',textAlign:'center',color:'var(--text-muted)'}}>✅ ไม่มียอดค้างชำระ</Card>
        : (
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            <p style={{fontWeight:700,fontSize:'14px',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>ค้างชำระ ({unpaid.length})</p>
            {unpaid.map(s=>(
              <Card key={s.id} style={{padding:'18px 20px',border:'2px solid #FDE68A'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'14px',flexWrap:'wrap'}}>
                  <div style={{flex:1,minWidth:'180px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                      <span style={{background:'#FEF3C7',color:'#92400E',padding:'2px 8px',borderRadius:'6px',fontSize:'11px',fontWeight:700}}>📋 เครดิต</span>
                      <p style={{fontSize:'12px',color:'var(--text-muted)'}}>{s.date}</p>
                    </div>
                    <p style={{fontWeight:700,fontSize:'15px',color:'var(--primary)',marginBottom:'2px'}}>{s.customer?.name||'ลูกค้าทั่วไป'}</p>
                    <p style={{fontSize:'12px',color:'var(--text-muted)'}}>{s.items?.length||0} รายการ · {s.items?.map(x=>`${x.name} ${x.qty}${x.unitName}`).join(', ')}</p>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <p style={{fontSize:'22px',fontWeight:900,color:'#D97706'}}>฿{s.total.toLocaleString()}</p>
                    <button onClick={()=>{setConfirmId(s.id);setPayNote('');}}
                      style={{marginTop:'8px',padding:'8px 18px',background:'linear-gradient(135deg,#16A34A,#15803D)',color:'#fff',border:'none',borderRadius:'9px',cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:'13px'}}>
                      ✓ รับชำระแล้ว
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      }

      {/* Paid history */}
      {paid.length > 0 && (
        <Card>
          <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border)'}}><p style={{fontWeight:700,fontSize:'14px',color:'var(--text-muted)'}}>รับชำระแล้ว ({paid.length})</p></div>
          {paid.map((s,i)=>(
            <div key={s.id} style={{padding:'12px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{flex:1}}>
                <p style={{fontWeight:600,fontSize:'13px'}}>{s.customer?.name||'ลูกค้าทั่วไป'} · {s.date}</p>
                <p style={{fontSize:'12px',color:'var(--text-muted)'}}>{s.paidNote||'รับชำระแล้ว'}</p>
              </div>
              <p style={{fontWeight:800,color:'#16A34A',fontSize:'15px'}}>฿{s.total.toLocaleString()}</p>
              <span style={{background:'#D1FAE5',color:'#065F46',padding:'3px 10px',borderRadius:'7px',fontSize:'11px',fontWeight:700}}>✓ ชำระแล้ว</span>
            </div>
          ))}
        </Card>
      )}

      {/* Confirm receive modal */}
      <Modal open={!!confirmId} onClose={()=>setConfirmId(null)} title="ยืนยันรับชำระเงิน" width={400}>
        {confirmId&&(()=>{const s=unpaid.find(x=>x.id===confirmId);return s?(
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div style={{background:'#F0FDF4',border:'1.5px solid #BBF7D0',borderRadius:'11px',padding:'16px',textAlign:'center'}}>
              <p style={{fontWeight:700,fontSize:'15px',marginBottom:'4px'}}>{s.customer?.name||'ลูกค้าทั่วไป'}</p>
              <p style={{fontSize:'30px',fontWeight:900,color:'#16A34A'}}>฿{s.total.toLocaleString()}</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>หมายเหตุ (ไม่บังคับ)</label>
              <input value={payNote} onChange={e=>setPayNote(e.target.value)} placeholder="เช่น โอนเงิน / จ่ายสด..."
                style={{padding:'10px 12px',border:'1.5px solid var(--border)',borderRadius:'9px',fontSize:'14px',fontFamily:'inherit'}}/>
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <Btn variant="outline" onClick={()=>setConfirmId(null)} style={{flex:1,justifyContent:'center'}}>ยกเลิก</Btn>
              <button onClick={()=>doReceive(confirmId)} style={{flex:2,padding:'12px',background:'linear-gradient(135deg,#16A34A,#15803D)',color:'#fff',border:'none',borderRadius:'10px',fontSize:'15px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>✓ ยืนยันรับชำระ</button>
            </div>
          </div>
        ):null;})()}
      </Modal>
    </div>
  );
};

// ─── Stock Request Screen (Employee) ─────────────────────────────────────────
const StockRequestScreen = ({user={},products=[],stockRequests=[],onSubmit}) => {
  const myRequests=stockRequests.filter(r=>r.staffId===user.staffId);
  const [items,setItems]=useState([]); // [{productId,productName,unitName,qty}]
  const [form,setForm]=useState({productId:'',unitName:'',qty:1});
  const [note,setNote]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const selProd=products.find(p=>p.id===+form.productId);
  const units=selProd?selProd.unitLevels.map(lv=>lv.name):[];

  const addItem=()=>{
    if(!selProd||!form.unitName||form.qty<1)return;
    const key=`${selProd.id}-${form.unitName}`;
    setItems(prev=>{
      const ex=prev.find(x=>x.key===key);
      return ex?prev.map(x=>x.key===key?{...x,qty:x.qty+form.qty}:x):
        [...prev,{key,productId:selProd.id,productName:selProd.name,unitName:form.unitName,qty:form.qty}];
    });
    setForm({productId:'',unitName:'',qty:1});
  };
  const removeItem=key=>setItems(prev=>prev.filter(x=>x.key!==key));

  const handleSubmit=()=>{
    if(items.length===0)return;
    onSubmit({
      id:`REQ-${Date.now()}`,staffId:user.staffId,staffName:user.name,
      date:new Date().toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'}),
      items:[...items],note,status:'pending'
    });
    setItems([]);setNote('');setSubmitted(true);setTimeout(()=>setSubmitted(false),2500);
  };

  const statusBadge=s=>s==='approved'?<Badge color="green">✓ อนุมัติ</Badge>:s==='rejected'?<Badge color="red">✗ ปฏิเสธ</Badge>:<Badge color="yellow">⏳ รอดำเนินการ</Badge>;

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start'}}>
      <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
        <Card style={{padding:'24px'}}>
          <p style={{fontWeight:700,fontSize:'16px',marginBottom:'2px'}}>ยื่นคำขอเบิกสินค้า</p>
          <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'20px'}}>เพิ่มหลายรายการ แล้วส่งครั้งเดียว</p>
          {submitted&&<div style={{background:'#D1FAE5',border:'1px solid #6EE7B7',borderRadius:'9px',padding:'10px 14px',color:'#065F46',fontWeight:600,fontSize:'13px',marginBottom:'12px'}}>✓ ส่งคำขอเรียบร้อย รอ Admin อนุมัติ</div>}

          {/* Add item row */}
          <div style={{background:'var(--bg)',borderRadius:'12px',padding:'16px',display:'flex',flexDirection:'column',gap:'12px',marginBottom:'14px'}}>
            <p style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>เพิ่มรายการ</p>
            <select value={form.productId} onChange={e=>setForm({...form,productId:e.target.value,unitName:''})}
              style={{width:'100%',padding:'10px 12px',border:'1.5px solid var(--border)',borderRadius:'8px',fontSize:'14px',fontFamily:'inherit',background:'var(--surface)'}}>
              <option value="">— เลือกสินค้า —</option>
              {products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {units.length>0&&(
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {units.map(u=><button key={u} onClick={()=>setForm({...form,unitName:u})}
                  style={{padding:'7px 14px',borderRadius:'8px',border:'1.5px solid',cursor:'pointer',fontFamily:'inherit',fontWeight:600,fontSize:'13px',
                    background:form.unitName===u?'var(--primary)':'var(--surface)',color:form.unitName===u?'#fff':'var(--text-muted)',borderColor:form.unitName===u?'var(--primary)':'var(--border)'}}>{u}</button>)}
              </div>
            )}
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <button onClick={()=>setForm({...form,qty:Math.max(1,form.qty-1)})} style={{width:'36px',height:'36px',borderRadius:'8px',border:'1.5px solid var(--border)',background:'var(--surface)',cursor:'pointer',fontSize:'18px',fontWeight:700,flexShrink:0}}>−</button>
              <input type="number" value={form.qty} min={1} onChange={e=>setForm({...form,qty:Math.max(1,+e.target.value)})} style={{flex:1,padding:'8px',border:'1.5px solid var(--primary)',borderRadius:'8px',fontSize:'16px',fontWeight:800,textAlign:'center',fontFamily:'inherit',color:'var(--primary)'}}/>
              <button onClick={()=>setForm({...form,qty:form.qty+1})} style={{width:'36px',height:'36px',borderRadius:'8px',border:'none',background:'var(--primary)',color:'#fff',cursor:'pointer',fontSize:'18px',fontWeight:700,flexShrink:0}}>+</button>
              <button onClick={addItem} disabled={!selProd||!form.unitName}
                style={{padding:'8px 18px',background:!selProd||!form.unitName?'#E2E8F0':'var(--primary)',color:!selProd||!form.unitName?'#94A3B8':'#fff',border:'none',borderRadius:'9px',cursor:!selProd||!form.unitName?'not-allowed':'pointer',fontFamily:'inherit',fontWeight:700,fontSize:'14px',flexShrink:0}}>
                + เพิ่ม
              </button>
            </div>
          </div>

          {/* Items list */}
          {items.length>0&&(
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'14px'}}>
              <p style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>รายการที่จะเบิก ({items.length})</p>
              {items.map((item,i)=>(
                <div key={item.key} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',background:'#F0FDF4',border:'1.5px solid #BBF7D0',borderRadius:'10px'}}>
                  <div style={{width:'28px',height:'28px',background:'var(--primary)',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'11px',fontWeight:800,flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontWeight:600,fontSize:'14px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.productName}</p>
                    <p style={{fontSize:'12px',color:'#16A34A',fontWeight:600}}>{item.qty} {item.unitName}</p>
                  </div>
                  <button onClick={()=>removeItem(item.key)} style={{background:'#FEE2E2',border:'none',color:'#DC2626',width:'28px',height:'28px',borderRadius:'7px',cursor:'pointer',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          <div style={{display:'flex',flexDirection:'column',gap:'6px',marginBottom:'14px'}}>
            <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>หมายเหตุ</label>
            <textarea value={note} onChange={e=>setNote(e.target.value)} rows={2} placeholder="เหตุผลการเบิก..."
              style={{width:'100%',padding:'10px 12px',border:'1.5px solid var(--border)',borderRadius:'9px',fontSize:'14px',fontFamily:'inherit',resize:'none'}}/>
          </div>

          <button onClick={handleSubmit} disabled={items.length===0}
            style={{width:'100%',padding:'13px',background:items.length===0?'#E2E8F0':'linear-gradient(135deg,#4F46E5,#7C3AED)',color:items.length===0?'#94A3B8':'#fff',border:'none',borderRadius:'10px',fontSize:'15px',fontWeight:700,cursor:items.length===0?'not-allowed':'pointer',fontFamily:'inherit'}}>
            📋 ส่งคำขอเบิกสินค้า {items.length>0&&`(${items.length} รายการ)`}
          </button>
        </Card>
      </div>

      {/* History */}
      <Card>
        <div style={{padding:'18px 20px',borderBottom:'1px solid var(--border)'}}><p style={{fontWeight:700,fontSize:'15px'}}>ประวัติคำขอของฉัน</p></div>
        {myRequests.length===0?<div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>ยังไม่มีคำขอ</div>:myRequests.map((r,i)=>(
          <div key={r.id} style={{padding:'14px 20px',borderBottom:'1px solid var(--border)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
              <p style={{fontSize:'12px',color:'var(--text-muted)'}}>{r.date}</p>
              {statusBadge(r.status)}
            </div>
            {(r.items||[{productName:r.productName,qty:r.qty,unitName:r.unitName}]).map((it,j)=>(
              <p key={j} style={{fontWeight:600,fontSize:'13px',color:'var(--primary)'}}>• {it.productName} {it.qty} {it.unitName}</p>
            ))}
            {r.note&&<p style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'3px'}}>หมายเหตุ: {r.note}</p>}
            {r.adminNote&&<p style={{fontSize:'12px',color:r.status==='rejected'?'#DC2626':'#16A34A',marginTop:'2px'}}>Admin: {r.adminNote}</p>}
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── Daily Close Screen (Employee) ────────────────────────────────────────────
const DailyCloseScreen = ({user={},dailyClosings=[],onSubmit}) => {
  const myClosings=dailyClosings.filter(c=>c.staffId===user.staffId);
  const today=new Date().toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'});
  const alreadyToday=myClosings.some(c=>c.date===today&&c.status!=='rejected');
  const myBills=window.AppData.staffBills[user.staffId]||[];
  const todayBills=myBills.filter(b=>b.date==='2 มิ.ย. 2569'&&!b.void);
  const autoTotal=todayBills.reduce((s,b)=>s+b.total,0);
  const [form,setForm]=useState({cash:0,transfer:0,creditCollected:0,freebieTotal:0,note:''});
  const [submitted,setSubmitted]=useState(false);
  const declaredTotal=(+form.cash)+(+form.transfer)+(+form.creditCollected);
  const diff=declaredTotal-autoTotal;
  const handleSubmit=()=>{
    onSubmit({id:`CLOSE-${Date.now()}`,staffId:user.staffId,staffName:user.name,date:today,totalBills:todayBills.length,autoTotal,cash:+form.cash,transfer:+form.transfer,creditCollected:+form.creditCollected,declaredTotal,freebieTotal:+form.freebieTotal,diff,note:form.note,status:'pending'});
    setSubmitted(true);setTimeout(()=>setSubmitted(false),2500);
  };
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start'}}>
      <Card style={{padding:'24px'}}>
        <p style={{fontWeight:700,fontSize:'16px',marginBottom:'2px'}}>ปิดยอดรายวัน</p>
        <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'20px'}}>{today}</p>
        {submitted&&<div style={{background:'#D1FAE5',border:'1px solid #6EE7B7',borderRadius:'9px',padding:'10px 14px',color:'#065F46',fontWeight:600,fontSize:'13px',marginBottom:'16px'}}>✓ ส่งยอดปิดวันเรียบร้อย</div>}
        {alreadyToday&&<div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:'9px',padding:'10px 14px',color:'#92400E',fontWeight:600,fontSize:'13px',marginBottom:'16px'}}>⚠ คุณส่งยอดวันนี้แล้ว</div>}
        <div style={{background:'var(--primary-light)',borderRadius:'12px',padding:'16px',marginBottom:'18px'}}>
          <p style={{fontSize:'12px',color:'var(--text-muted)',fontWeight:600,textTransform:'uppercase',marginBottom:'4px'}}>ยอดขายในระบบวันนี้</p>
          <p style={{fontSize:'28px',fontWeight:900,color:'var(--primary)'}}>฿{autoTotal.toLocaleString()}</p>
          <p style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>{todayBills.length} บิล</p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {[['cash','💵 เงินสด'],['transfer','🏦 โอนเงิน'],['creditCollected','📋 เก็บเครดิต']].map(([k,label])=>(
            <div key={k} style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <span style={{width:'110px',fontSize:'13px',fontWeight:600,flexShrink:0}}>{label}</span>
              <input type="number" value={form[k]} onChange={e=>setForm({...form,[k]:+e.target.value})} min={0}
                style={{flex:1,padding:'9px 12px',border:'1.5px solid var(--border)',borderRadius:'9px',fontSize:'15px',fontWeight:600,fontFamily:'inherit',textAlign:'right'}}/>
            </div>
          ))}
          <div style={{padding:'12px',background:Math.abs(diff)<1?'#F0FDF4':'#FEF3C7',borderRadius:'10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:'13px',fontWeight:600}}>ส่วนต่าง</span>
            <span style={{fontSize:'16px',fontWeight:800,color:Math.abs(diff)<1?'#16A34A':diff>0?'#16A34A':'#DC2626'}}>{diff>0?'+':''}฿{diff.toLocaleString()}</span>
          </div>
          <AppInput label="ของแถมรวม (฿)" type="number" value={form.freebieTotal} onChange={e=>setForm({...form,freebieTotal:+e.target.value})}/>
          <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
            <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>หมายเหตุ</label>
            <textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})} rows={2} placeholder="หมายเหตุเพิ่มเติม..." style={{width:'100%',padding:'10px 12px',border:'1.5px solid var(--border)',borderRadius:'9px',fontSize:'14px',fontFamily:'inherit',resize:'none'}}/>
          </div>
          <button onClick={handleSubmit} disabled={alreadyToday}
            style={{padding:'13px',background:alreadyToday?'#E2E8F0':'linear-gradient(135deg,#4F46E5,#7C3AED)',color:alreadyToday?'#94A3B8':'#fff',border:'none',borderRadius:'10px',fontSize:'15px',fontWeight:700,cursor:alreadyToday?'not-allowed':'pointer',fontFamily:'inherit'}}>
            📅 ส่งยอดปิดวัน
          </button>
        </div>
      </Card>
      <Card>
        <div style={{padding:'18px 20px',borderBottom:'1px solid var(--border)'}}><p style={{fontWeight:700,fontSize:'15px'}}>ประวัติการปิดยอด</p></div>
        {myClosings.length===0?<div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>ยังไม่มีประวัติ</div>:myClosings.slice().reverse().map((c,i)=>(
          <div key={c.id} style={{padding:'14px 20px',borderBottom:'1px solid var(--border)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
              <p style={{fontWeight:600,fontSize:'14px'}}>{c.date}</p>
              {c.status==='approved'?<Badge color="green">✓ รับทราบ</Badge>:c.status==='rejected'?<Badge color="red">แก้ไข</Badge>:<Badge color="yellow">⏳ รอตรวจ</Badge>}
            </div>
            <p style={{fontSize:'12px',color:'var(--text-muted)'}}>{c.totalBills} บิล · ฿{c.autoTotal?.toLocaleString()} · ส่วนต่าง {c.diff>0?'+':''}฿{c.diff?.toLocaleString()}</p>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── Stock Approval Screen (Admin) ────────────────────────────────────────────
const StockApprovalScreen = ({stockRequests=[],onUpdate}) => {
  const pending=stockRequests.filter(r=>r.status==='pending');
  const done=stockRequests.filter(r=>r.status!=='pending');
  const [noteInputs,setNoteInputs]=useState({});
  const approve=(id)=>onUpdate(stockRequests.map(r=>r.id===id?{...r,status:'approved',adminNote:noteInputs[id]||'อนุมัติ'}:r));
  const reject=(id)=>onUpdate(stockRequests.map(r=>r.id===id?{...r,status:'rejected',adminNote:noteInputs[id]||'ปฏิเสธ'}:r));
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <div style={{background:'linear-gradient(135deg,#0F172A,#1E1B4B)',borderRadius:'14px',padding:'20px 24px',display:'flex',alignItems:'center',gap:'16px'}}>
        <div style={{width:'48px',height:'48px',background:'rgba(99,102,241,0.3)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#A5B4FC',flexShrink:0}}><IcoClipboard/></div>
        <div style={{flex:1}}><p style={{color:'#fff',fontWeight:700,fontSize:'16px'}}>อนุมัติการเบิกสินค้า</p><p style={{color:'rgba(255,255,255,0.55)',fontSize:'13px',marginTop:'2px'}}>ตรวจสอบและอนุมัติคำขอจากพนักงาน</p></div>
        <div style={{display:'flex',gap:'20px',flexShrink:0}}>
          <div style={{textAlign:'right'}}><p style={{color:'rgba(255,255,255,0.5)',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.05em'}}>รอดำเนินการ</p><p style={{color:'#FCA5A5',fontSize:'24px',fontWeight:900}}>{pending.length}</p></div>
          <div style={{textAlign:'right'}}><p style={{color:'rgba(255,255,255,0.5)',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.05em'}}>ดำเนินการแล้ว</p><p style={{color:'#A5B4FC',fontSize:'24px',fontWeight:900}}>{done.length}</p></div>
        </div>
      </div>
      {pending.length>0&&(
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <p style={{fontWeight:700,fontSize:'14px',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>รอดำเนินการ ({pending.length})</p>
          {pending.map(r=>(
            <Card key={r.id} style={{padding:'18px 20px',border:'2px solid #FDE68A'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'14px'}}>
                <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'linear-gradient(135deg,#10B981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'18px',flexShrink:0}}>{r.staffName.charAt(0)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                    <p style={{fontWeight:700,fontSize:'14px'}}>{r.staffName}</p><p style={{fontSize:'12px',color:'var(--text-muted)'}}>{r.date}</p>
                  </div>
                  <p style={{fontSize:'15px',fontWeight:700,color:'var(--primary)',marginBottom:'4px'}}>{(r.items||[{productName:r.productName,qty:r.qty,unitName:r.unitName}]).map(it=>`${it.productName} ${it.qty} ${it.unitName}`).join(', ')}</p>
                  {r.note&&<p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'10px'}}>หมายเหตุ: {r.note}</p>}
                  <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                    <input value={noteInputs[r.id]||''} onChange={e=>setNoteInputs(n=>({...n,[r.id]:e.target.value}))} placeholder="หมายเหตุตอบกลับ (ไม่บังคับ)..." style={{flex:1,minWidth:'150px',padding:'8px 10px',border:'1.5px solid var(--border)',borderRadius:'8px',fontSize:'13px',fontFamily:'inherit'}}/>
                    <button onClick={()=>approve(r.id)} style={{padding:'9px 18px',background:'#D1FAE5',color:'#16A34A',border:'1px solid #6EE7B7',borderRadius:'9px',cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:'13px'}}>✓ อนุมัติ</button>
                    <button onClick={()=>reject(r.id)} style={{padding:'9px 18px',background:'#FEE2E2',color:'#DC2626',border:'1px solid #FECACA',borderRadius:'9px',cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:'13px'}}>✗ ปฏิเสธ</button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {done.length>0&&(
        <Card>
          <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border)'}}><p style={{fontWeight:700,fontSize:'14px',color:'var(--text-muted)'}}>ดำเนินการแล้ว ({done.length})</p></div>
          {done.map((r,i)=>(
            <div key={r.id} style={{padding:'12px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'14px'}}>
              <div style={{flex:1}}><p style={{fontWeight:600,fontSize:'13px'}}>{r.staffName} — {r.productName} {r.qty} {r.unitName}</p><p style={{fontSize:'12px',color:'var(--text-muted)'}}>{r.date} {r.adminNote&&`· ${r.adminNote}`}</p></div>
              {r.status==='approved'?<Badge color="green">✓ อนุมัติ</Badge>:<Badge color="red">✗ ปฏิเสธ</Badge>}
            </div>
          ))}
        </Card>
      )}
      {stockRequests.length===0&&<Card style={{padding:'60px',textAlign:'center',color:'var(--text-muted)'}}>ยังไม่มีคำขอเบิกสินค้า</Card>}
    </div>
  );
};

// ─── Daily Close Admin Screen ─────────────────────────────────────────────────
const DailyCloseAdminScreen = ({dailyClosings=[],onUpdate}) => {
  const pending=dailyClosings.filter(c=>c.status==='pending');
  const done=dailyClosings.filter(c=>c.status!=='pending');
  const review=(id)=>onUpdate(dailyClosings.map(c=>c.id===id?{...c,status:'approved'}:c));
  const flag=(id)=>onUpdate(dailyClosings.map(c=>c.id===id?{...c,status:'rejected'}:c));
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <div style={{background:'linear-gradient(135deg,#0F172A,#1E1B4B)',borderRadius:'14px',padding:'20px 24px',display:'flex',alignItems:'center',gap:'16px'}}>
        <div style={{width:'48px',height:'48px',background:'rgba(99,102,241,0.3)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#A5B4FC',flexShrink:0}}><IcoCalendar/></div>
        <div style={{flex:1}}><p style={{color:'#fff',fontWeight:700,fontSize:'16px'}}>ปิดยอดรายวัน</p><p style={{color:'rgba(255,255,255,0.55)',fontSize:'13px',marginTop:'2px'}}>ตรวจสอบยอดปิดวันจากพนักงาน</p></div>
        <div style={{display:'flex',gap:'20px',flexShrink:0}}>
          <div style={{textAlign:'right'}}><p style={{color:'rgba(255,255,255,0.5)',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.05em'}}>รอตรวจ</p><p style={{color:'#FCA5A5',fontSize:'24px',fontWeight:900}}>{pending.length}</p></div>
        </div>
      </div>
      {dailyClosings.length===0&&<Card style={{padding:'60px',textAlign:'center',color:'var(--text-muted)'}}>ยังไม่มีการส่งยอดปิดวัน</Card>}
      {pending.length>0&&(
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <p style={{fontWeight:700,fontSize:'14px',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>รอตรวจสอบ ({pending.length})</p>
          {pending.map(c=>(
            <Card key={c.id} style={{padding:'20px',border:'2px solid #FDE68A'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'14px',flexWrap:'wrap',gap:'8px'}}>
                <div><p style={{fontWeight:700,fontSize:'15px'}}>{c.staffName}</p><p style={{fontSize:'13px',color:'var(--text-muted)'}}>{c.date} · {c.totalBills} บิล</p></div>
                <div style={{display:'flex',gap:'8px'}}>
                  <button onClick={()=>review(c.id)} style={{padding:'8px 16px',background:'#D1FAE5',color:'#16A34A',border:'1px solid #6EE7B7',borderRadius:'8px',cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:'13px'}}>✓ รับทราบ</button>
                  <button onClick={()=>flag(c.id)} style={{padding:'8px 16px',background:'#FEE2E2',color:'#DC2626',border:'1px solid #FECACA',borderRadius:'8px',cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:'13px'}}>⚠ ขอแก้ไข</button>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:'10px'}}>
                {[['ยอดในระบบ',`฿${(c.autoTotal||0).toLocaleString()}`,'var(--primary)'],['รับเงินสด',`฿${(c.cash||0).toLocaleString()}`,'#10B981'],['โอน',`฿${(c.transfer||0).toLocaleString()}`,'#3B82F6'],['เก็บเครดิต',`฿${(c.creditCollected||0).toLocaleString()}`,'#8B5CF6'],['ส่วนต่าง',`${(c.diff||0)>0?'+':''}฿${(c.diff||0).toLocaleString()}`,Math.abs(c.diff||0)<1?'#16A34A':'#EF4444'],['ของแถม',`฿${(c.freebieTotal||0).toLocaleString()}`,'#F59E0B']].map(([k,v,clr])=>(
                  <div key={k} style={{background:'var(--bg)',borderRadius:'9px',padding:'10px',textAlign:'center'}}>
                    <p style={{fontSize:'10px',color:'var(--text-muted)',fontWeight:600,textTransform:'uppercase',marginBottom:'4px'}}>{k}</p>
                    <p style={{fontSize:'15px',fontWeight:800,color:clr}}>{v}</p>
                  </div>
                ))}
              </div>
              {c.note&&<p style={{marginTop:'10px',fontSize:'12px',color:'var(--text-muted)',background:'var(--bg)',padding:'8px 12px',borderRadius:'8px'}}>หมายเหตุ: {c.note}</p>}
            </Card>
          ))}
        </div>
      )}
      {done.length>0&&(
        <Card>
          <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border)'}}><p style={{fontWeight:700,fontSize:'14px',color:'var(--text-muted)'}}>ตรวจสอบแล้ว ({done.length})</p></div>
          {done.map((c,i)=>(
            <div key={c.id} style={{padding:'12px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'14px'}}>
              <div style={{flex:1}}><p style={{fontWeight:600,fontSize:'13px'}}>{c.staffName} — {c.date}</p><p style={{fontSize:'12px',color:'var(--text-muted)'}}>ยอด ฿{(c.autoTotal||0).toLocaleString()} · ส่วนต่าง {(c.diff||0)>0?'+':''}฿{(c.diff||0).toLocaleString()}</p></div>
              {c.status==='approved'?<Badge color="green">✓ รับทราบ</Badge>:<Badge color="yellow">⚠ ขอแก้ไข</Badge>}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

// ─── Settings Screen ──────────────────────────────────────────────────────────
const SettingsScreen = ({receiptSettings, onSave, allData={}, onReset}) => {
  const [s,setS]   = useState(receiptSettings);
  const [tab,setTab] = useState('receipt');
  const [saved,setSaved] = useState(false);
  const [resetConfirm,setResetConfirm] = useState(false);
  const [resetDone,setResetDone]       = useState(false);
  const [resetWord,setResetWord]       = useState('');

  const doBackup = () => {
    const d = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      note: 'PORNSAWAN TRADE backup',
      employees:     allData.employees     || [],
      customers:     allData.customers     || [],
      products:      allData.products      || [],
      stockRequests: allData.stockRequests || [],
      dailyClosings: allData.dailyClosings || [],
      creditSales:   allData.creditSales   || [],
    };
    const blob = new Blob([JSON.stringify(d, null, 2)], {type:'application/json'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `PORNSAWAN-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doReset = async () => {
    if(onReset) await onReset();
    setResetConfirm(false);
    setResetWord('');
    setResetDone(true);
    setTimeout(()=>setResetDone(false), 4000);
  };
  const logoRef = React.useRef(null);

  React.useEffect(()=>setS(receiptSettings),[receiptSettings]);

  const handleLogoUpload = e => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setS(prev=>({...prev,logoUrl:ev.target.result}));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave(s);
    setSaved(true);
    setTimeout(()=>setSaved(false),2200);
  };

  const tabs=[{id:'receipt',icon:'🧾',label:'ตั้งค่าใบเสร็จ'},{id:'printer',icon:'🖨️',label:'ตั้งค่าเครื่องพิมพ์'},{id:'data',icon:'💾',label:'ข้อมูล & รีเซ็ต'}];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px',maxWidth:'1000px'}}>
      {saved&&<div style={{background:'#D1FAE5',border:'1px solid #6EE7B7',borderRadius:'10px',padding:'12px 18px',color:'#065F46',fontWeight:600,fontSize:'14px',display:'flex',alignItems:'center',gap:'8px'}}>✓ บันทึกการตั้งค่าเรียบร้อย</div>}

      {/* Tabs */}
      <div style={{display:'flex',gap:'8px'}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{padding:'11px 22px',borderRadius:'10px',border:'1.5px solid',cursor:'pointer',fontFamily:'inherit',fontWeight:600,fontSize:'14px',
              background:tab===t.id?'var(--primary)':'var(--surface)',
              color:tab===t.id?'#fff':'var(--text-muted)',
              borderColor:tab===t.id?'var(--primary)':'var(--border)'}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ─ Receipt Tab ─ */}
      {tab==='receipt'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:'16px',alignItems:'start'}}>
        <Card style={{padding:'26px'}}>
          <p style={{fontWeight:700,fontSize:'16px',marginBottom:'2px'}}>ตั้งค่าใบเสร็จรับเงิน</p>
          <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'24px'}}>Receipt Settings</p>
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>

            {/* Logo upload */}
            <div>
              <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:'10px'}}>โลโก้บริษัท (Logo)</label>
              {s.logoUrl?(
                <div style={{display:'flex',alignItems:'center',gap:'16px',padding:'16px',background:'var(--bg)',borderRadius:'12px',border:'1.5px solid var(--border)'}}>
                  <div style={{background:'#fff',padding:'8px',borderRadius:'8px',border:'1px solid var(--border)',flexShrink:0}}>
                    <img src={s.logoUrl} alt="Logo" style={{height:`${s.logoSize||60}px`,objectFit:'contain',display:'block',maxWidth:'160px'}}/>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:'13px',fontWeight:600,marginBottom:'8px'}}>โลโก้ที่อัปโหลดแล้ว</p>
                    <div style={{display:'flex',gap:'8px'}}>
                      <button onClick={()=>logoRef.current?.click()} style={{fontSize:'12px',background:'var(--primary-light)',color:'var(--primary)',border:'none',padding:'6px 12px',borderRadius:'7px',cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>🔄 เปลี่ยนโลโก้</button>
                      <button onClick={()=>setS(p=>({...p,logoUrl:''}))} style={{fontSize:'12px',color:'#DC2626',background:'#FEE2E2',border:'none',padding:'6px 12px',borderRadius:'7px',cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>🗑 ลบ</button>
                    </div>
                  </div>
                </div>
              ):(
                <div onClick={()=>logoRef.current?.click()} style={{padding:'28px',border:'2px dashed var(--border)',borderRadius:'12px',textAlign:'center',cursor:'pointer',background:'var(--bg)',transition:'border-color 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='var(--primary)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                  <p style={{fontSize:'36px',marginBottom:'8px'}}>🖼️</p>
                  <p style={{fontWeight:600,marginBottom:'4px',fontSize:'14px'}}>คลิกเพื่ออัปโหลดโลโก้</p>
                  <p style={{fontSize:'12px',color:'var(--text-muted)'}}>PNG, JPG, SVG — ขนาดไม่เกิน 2MB</p>
                </div>
              )}
              <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{display:'none'}}/>
            </div>

            {/* Logo size slider */}
            {s.logoUrl&&(
              <div>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                  <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>ขนาดโลโก้</label>
                  <span style={{fontSize:'13px',fontWeight:600,color:'var(--primary)'}}>{s.logoSize||60} px</span>
                </div>
                <input type="range" min={30} max={150} step={5} value={s.logoSize||60}
                  onChange={e=>setS(p=>({...p,logoSize:+e.target.value}))}
                  style={{width:'100%',accentColor:'var(--primary)',height:'4px'}}/>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'var(--text-muted)',marginTop:'4px'}}>
                  <span>เล็ก (30px)</span><span>ใหญ่ (150px)</span>
                </div>
              </div>
            )}

            <AppInput label="ชื่อบริษัท / ร้านค้า" value={s.companyName||''} onChange={e=>setS(p=>({...p,companyName:e.target.value}))} placeholder="PORNSAWAN TRADE"/>
            <AppInput label="ที่อยู่บริษัท" value={s.companyAddress||''} onChange={e=>setS(p=>({...p,companyAddress:e.target.value}))} placeholder="เลขที่ ถนน แขวง เขต..."/>
            <AppInput label="เบอร์โทร / เว็บไซต์" value={s.companyContact||''} onChange={e=>setS(p=>({...p,companyContact:e.target.value}))} placeholder="02-xxx-xxxx"/>

            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>ข้อความท้ายบิล (Footer)</label>
              <textarea value={s.footerText||''} onChange={e=>setS(p=>({...p,footerText:e.target.value}))} rows={2}
                placeholder="เช่น ขอบคุณที่ใช้บริการ"
                style={{width:'100%',padding:'10px 12px',border:'1.5px solid var(--border)',borderRadius:'9px',fontSize:'14px',fontFamily:'inherit',resize:'none',boxSizing:'border-box'}}/>
            </div>

            <label style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',padding:'12px',background:'#F8FAFC',borderRadius:'9px',border:'1px solid var(--border)'}}>
              <input type="checkbox" checked={!!s.showPromptPay} onChange={e=>setS(p=>({...p,showPromptPay:e.target.checked}))} style={{width:'16px',height:'16px',accentColor:'var(--primary)'}}/>
              <div><p style={{fontSize:'14px',fontWeight:600}}>แสดง QR PromptPay ท้ายบิล</p><p style={{fontSize:'12px',color:'var(--text-muted)'}}>ดึงหมายเลขพร้อมเพย์จากข้อมูลพนักงานอัตโนมัติ</p></div>
            </label>
            <label style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',padding:'12px',background:'#F8FAFC',borderRadius:'9px',border:'1px solid var(--border)'}}>
              <input type="checkbox" checked={!!s.showTaxId} onChange={e=>setS(p=>({...p,showTaxId:e.target.checked}))} style={{width:'16px',height:'16px',accentColor:'var(--primary)'}}/>
              <div><p style={{fontSize:'14px',fontWeight:600}}>แสดงเลขประจำตัวผู้เสียภาษี</p></div>
            </label>
            {s.showTaxId&&<AppInput label="เลขประจำตัวผู้เสียภาษี" value={s.taxId||''} onChange={e=>setS(p=>({...p,taxId:e.target.value}))} placeholder="0-0000-00000-00-0"/>}
          </div>

          <div style={{display:'flex',gap:'10px',marginTop:'26px',paddingTop:'20px',borderTop:'1px solid var(--border)'}}>
            <button onClick={handleSave} style={{flex:1,padding:'13px',background:'linear-gradient(135deg,#4F46E5,#7C3AED)',color:'#fff',border:'none',borderRadius:'10px',fontSize:'15px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>💾 บันทึกการตั้งค่า</button>
          </div>
        </Card>

        {/* ─ Live Preview ─ */}
        <div style={{position:'sticky',top:'20px'}}>
          <Card style={{padding:'16px'}}>
            <p style={{fontWeight:700,fontSize:'13px',marginBottom:'12px',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>👁️ ตัวอย่างใบเสร็จ</p>
            <div style={{background:'#FAFAF8',border:'1px solid #E5E5E0',borderRadius:'10px',padding:'14px',fontFamily:"'Sarabun',sans-serif",lineHeight:1.6,maxHeight:'560px',overflowY:'auto'}}>
              {s.logoUrl&&<div style={{textAlign:'center',marginBottom:'8px'}}><img src={s.logoUrl} alt="Logo" style={{height:`${Math.round((s.logoSize||60)*0.6)}px`,objectFit:'contain',maxWidth:'100%'}}/></div>}
              <p style={{textAlign:'center',fontWeight:800,fontSize:'13px',marginBottom:'2px'}}>{s.companyName||'PORNSAWAN TRADE'}</p>
              {s.companyAddress&&<p style={{textAlign:'center',fontSize:'10px',color:'#888'}}>{s.companyAddress}</p>}
              {s.companyContact&&<p style={{textAlign:'center',fontSize:'10px',color:'#888'}}>{s.companyContact}</p>}
              {s.showTaxId&&s.taxId&&<p style={{textAlign:'center',fontSize:'10px',color:'#888'}}>เลขผู้เสียภาษี: {s.taxId}</p>}
              <p style={{textAlign:'center',fontSize:'10px',color:'#888',marginBottom:'8px'}}>ใบเสร็จรับเงิน</p>
              <div style={{borderTop:'1px dashed #CCC',borderBottom:'1px dashed #CCC',padding:'5px 0',margin:'5px 0'}}>
                {[['วันที่','2 มิ.ย. 2569'],['พนักงาน','สมหมาย รักงาน'],['ลูกค้า','ร้านตัวอย่าง']].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:'10px'}}><span style={{color:'#888'}}>{k}</span><span>{v}</span></div>
                ))}
              </div>
              {[['ดีวัวแท้ ไซส์ M (2 ขวด)','฿200'],['ดีวัวแท้ ไซส์ L (1 ขวด)','฿350']].map(([name,price])=>(
                <div key={name} style={{display:'flex',justifyContent:'space-between',fontSize:'10px',padding:'2px 0'}}><span>{name}</span><span style={{fontWeight:600}}>{price}</span></div>
              ))}
              <div style={{borderTop:'1px dashed #CCC',marginTop:'5px',paddingTop:'5px'}}>
                <div style={{display:'flex',justifyContent:'space-between',fontWeight:800,fontSize:'12px'}}><span>ยอดสุทธิ</span><span>฿550</span></div>
                <p style={{fontSize:'10px',color:'#888',marginTop:'2px'}}>ชำระด้วย: เงินสด</p>
              </div>
              {s.showPromptPay&&<div style={{textAlign:'center',marginTop:'8px',paddingTop:'6px',borderTop:'1px dashed #CCC'}}><p style={{fontSize:'9px',color:'#666',marginBottom:'4px'}}>สแกนพร้อมเพย์</p><div style={{width:'60px',height:'60px',background:'#F1F5F9',borderRadius:'4px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="44" height="44" viewBox="0 0 21 21"><rect width="21" height="21" fill="white"/><rect x="0" y="0" width="7" height="7" fill="#1E1B4B"/><rect x="1" y="1" width="5" height="5" fill="white"/><rect x="2" y="2" width="3" height="3" fill="#1E1B4B"/><rect x="14" y="0" width="7" height="7" fill="#1E1B4B"/><rect x="15" y="1" width="5" height="5" fill="white"/><rect x="16" y="2" width="3" height="3" fill="#1E1B4B"/><rect x="0" y="14" width="7" height="7" fill="#1E1B4B"/><rect x="1" y="15" width="5" height="5" fill="white"/><rect x="2" y="16" width="3" height="3" fill="#1E1B4B"/><rect x="9" y="0" width="1" height="2" fill="#1E1B4B"/><rect x="9" y="4" width="2" height="2" fill="#1E1B4B"/><rect x="9" y="9" width="3" height="3" fill="#1E1B4B"/><rect x="14" y="9" width="7" height="3" fill="#1E1B4B"/><rect x="9" y="14" width="3" height="7" fill="#1E1B4B"/><rect x="14" y="14" width="3" height="3" fill="#1E1B4B"/><rect x="19" y="14" width="2" height="7" fill="#1E1B4B"/></svg></div></div>}
              {s.footerText&&<p style={{textAlign:'center',fontSize:'10px',color:'#888',marginTop:'8px',borderTop:'1px dashed #CCC',paddingTop:'6px'}}>{s.footerText}</p>}
            </div>
          </Card>
        </div>
        </div>
      )}

      {/* ─ Printer Tab ─ */}
      {tab==='printer'&&(
        <Card style={{padding:'26px'}}>
          <p style={{fontWeight:700,fontSize:'16px',marginBottom:'2px'}}>ตั้งค่าเครื่องพิมพ์</p>
          <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'24px'}}>Printer Settings</p>
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>

            {/* Paper width */}
            <div>
              <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:'10px'}}>ขนาดกระดาษ</label>
              <div style={{display:'flex',gap:'10px'}}>
                {[{v:'58mm',desc:'เครื่องพิมพ์เล็ก'},{v:'80mm',desc:'มาตรฐาน'},{v:'A4',desc:'เครื่องปกติ'}].map(w=>(
                  <button key={w.v} onClick={()=>setS(p=>({...p,paperWidth:w.v}))}
                    style={{flex:1,padding:'13px 8px',borderRadius:'10px',border:'1.5px solid',cursor:'pointer',fontFamily:'inherit',textAlign:'center',
                      background:(s.paperWidth||'80mm')===w.v?'var(--primary-light)':'var(--surface)',
                      color:(s.paperWidth||'80mm')===w.v?'var(--primary)':'var(--text-muted)',
                      borderColor:(s.paperWidth||'80mm')===w.v?'var(--primary)':'var(--border)'}}>
                    <p style={{fontWeight:700,fontSize:'15px'}}>{w.v}</p>
                    <p style={{fontSize:'11px',marginTop:'3px',opacity:0.7}}>{w.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>ขนาดตัวอักษรในใบเสร็จ</label>
                <span style={{fontSize:'13px',fontWeight:600,color:'var(--primary)'}}>{s.receiptFontSize||14} px</span>
              </div>
              <input type="range" min={10} max={18} step={1} value={s.receiptFontSize||14}
                onChange={e=>setS(p=>({...p,receiptFontSize:+e.target.value}))}
                style={{width:'100%',accentColor:'var(--primary)',height:'4px'}}/>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'var(--text-muted)',marginTop:'4px'}}>
                <span>เล็ก (10px)</span><span>ใหญ่ (18px)</span>
              </div>
            </div>

            {/* Copies */}
            <div>
              <label style={{fontSize:'12px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:'10px'}}>จำนวนสำเนา</label>
              <div style={{display:'flex',gap:'10px'}}>
                {[1,2,3].map(n=>(
                  <button key={n} onClick={()=>setS(p=>({...p,copies:n}))}
                    style={{flex:1,padding:'12px',borderRadius:'9px',border:'1.5px solid',cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:'16px',
                      background:(s.copies||1)===n?'var(--primary)':'var(--surface)',
                      color:(s.copies||1)===n?'#fff':'var(--text-muted)',
                      borderColor:(s.copies||1)===n?'var(--primary)':'var(--border)'}}>
                    {n} ใบ
                  </button>
                ))}
              </div>
            </div>

            {/* Auto print */}
            <label style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',padding:'12px',background:'#F8FAFC',borderRadius:'9px',border:'1px solid var(--border)'}}>
              <input type="checkbox" checked={!!s.autoPrint} onChange={e=>setS(p=>({...p,autoPrint:e.target.checked}))} style={{width:'16px',height:'16px',accentColor:'var(--primary)'}}/>
              <div><p style={{fontSize:'14px',fontWeight:600}}>พิมพ์อัตโนมัติหลังชำระเงิน</p><p style={{fontSize:'12px',color:'var(--text-muted)'}}>เปิดหน้าต่างพิมพ์ทันทีหลังบันทึกการขายสำเร็จ</p></div>
            </label>
          </div>

          <div style={{marginTop:'26px',paddingTop:'20px',borderTop:'1px solid var(--border)'}}>
            <button onClick={handleSave} style={{width:'100%',padding:'13px',background:'linear-gradient(135deg,#4F46E5,#7C3AED)',color:'#fff',border:'none',borderRadius:'10px',fontSize:'15px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>💾 บันทึกการตั้งค่า</button>
          </div>
        </Card>
      )}

      {/* ─ Data Tab ─ */}
      {tab==='data'&&(
        <div style={{display:'flex',flexDirection:'column',gap:'16px',maxWidth:'680px'}}>
          {resetDone&&(
            <div style={{background:'#D1FAE5',border:'1px solid #6EE7B7',borderRadius:'10px',padding:'12px 18px',color:'#065F46',fontWeight:600,fontSize:'14px',display:'flex',alignItems:'center',gap:'8px'}}>
              ✓ รีเซ็ตข้อมูลทดสอบสำเร็จ — ระบบพร้อมใช้งานจริงแล้ว
            </div>
          )}

          {/* Backup Section */}
          <Card style={{padding:'26px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
              <span style={{fontSize:'28px'}}>📦</span>
              <div><p style={{fontWeight:700,fontSize:'16px'}}>สำรองข้อมูล (Backup)</p><p style={{fontSize:'13px',color:'var(--text-muted)'}}>ดาวน์โหลดข้อมูลทั้งหมดเป็นไฟล์ JSON</p></div>
            </div>
            <div style={{background:'#F8FAFC',borderRadius:'10px',padding:'14px 16px',margin:'16px 0',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',textAlign:'center'}}>
              {[
                ['👥','พนักงาน',(allData.employees||[]).length],
                ['🛍️','ลูกค้า',(allData.customers||[]).length],
                ['📦','สินค้า',(allData.products||[]).length],
                ['📋','คำขอเบิก',(allData.stockRequests||[]).length],
                ['📅','ปิดยอด',(allData.dailyClosings||[]).length],
                ['💳','เครดิต',(allData.creditSales||[]).length],
              ].map(([ico,label,count])=>(
                <div key={label} style={{padding:'10px',background:'var(--surface)',borderRadius:'8px',border:'1px solid var(--border)'}}>
                  <p style={{fontSize:'20px',marginBottom:'4px'}}>{ico}</p>
                  <p style={{fontSize:'11px',color:'var(--text-muted)',fontWeight:600}}>{label}</p>
                  <p style={{fontSize:'20px',fontWeight:800,color:'var(--primary)'}}>{count}</p>
                </div>
              ))}
            </div>
            <button onClick={doBackup}
              style={{width:'100%',padding:'13px',background:'linear-gradient(135deg,#10B981,#059669)',color:'#fff',border:'none',borderRadius:'10px',fontSize:'15px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
              ⬇️ ดาวน์โหลด Backup JSON
            </button>
          </Card>

          {/* Reset Section */}
          <Card style={{padding:'26px',border:'1.5px solid #FECACA'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
              <span style={{fontSize:'28px'}}>🔄</span>
              <div><p style={{fontWeight:700,fontSize:'16px',color:'#DC2626'}}>รีเซ็ตข้อมูลทดสอบ</p><p style={{fontSize:'13px',color:'var(--text-muted)'}}>ล้างรายการขายและข้อมูล Transaction ทั้งหมด</p></div>
            </div>

            <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:'10px',padding:'14px 16px',margin:'16px 0'}}>
              <p style={{fontSize:'13px',fontWeight:700,color:'#991B1B',marginBottom:'8px'}}>สิ่งที่จะถูกลบ:</p>
              <ul style={{fontSize:'13px',color:'#B91C1C',paddingLeft:'18px',lineHeight:1.9}}>
                <li>รายการขายทั้งหมด (Sales)</li>
                <li>รายการเครดิต / ค้างชำระ</li>
                <li>คำขอเบิกสินค้า</li>
                <li>รายงานปิดยอดรายวัน</li>
              </ul>
              <p style={{fontSize:'13px',fontWeight:700,color:'#065F46',marginTop:'10px',marginBottom:'4px'}}>สิ่งที่จะ<u>ไม่</u>ถูกลบ:</p>
              <ul style={{fontSize:'13px',color:'#047857',paddingLeft:'18px',lineHeight:1.9}}>
                <li>รายชื่อลูกค้า</li>
                <li>รายการสินค้าและราคา</li>
                <li>จำนวนสินค้าในโกดัง (Stock)</li>
                <li>รายชื่อพนักงาน</li>
              </ul>
            </div>

            {!resetConfirm?(
              <button onClick={()=>setResetConfirm(true)}
                style={{width:'100%',padding:'13px',background:'#FEE2E2',color:'#DC2626',border:'1.5px solid #FECACA',borderRadius:'10px',fontSize:'15px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                🔄 รีเซ็ตข้อมูลทดสอบ...
              </button>
            ):(
              <div style={{display:'flex',flexDirection:'column',gap:'12px',padding:'16px',background:'#FEF2F2',borderRadius:'10px',border:'1.5px solid #FCA5A5'}}>
                <p style={{fontSize:'13px',fontWeight:700,color:'#991B1B'}}>พิมพ์ "RESET" เพื่อยืนยัน:</p>
                <input value={resetWord} onChange={e=>setResetWord(e.target.value)} placeholder='พิมพ์ "RESET" เป็นตัวพิมพ์ใหญ่'
                  style={{padding:'10px 14px',border:`1.5px solid ${resetWord==='RESET'?'#DC2626':'var(--border)'}`,borderRadius:'8px',fontSize:'14px',fontFamily:'inherit',background:'var(--surface)',letterSpacing:'2px',fontWeight:700}}/>
                <div style={{display:'flex',gap:'10px'}}>
                  <button onClick={()=>{setResetConfirm(false);setResetWord('');}}
                    style={{flex:1,padding:'11px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'9px',cursor:'pointer',fontFamily:'inherit',fontWeight:600,fontSize:'14px',color:'var(--text-muted)'}}>
                    ยกเลิก
                  </button>
                  <button onClick={doReset} disabled={resetWord!=='RESET'}
                    style={{flex:2,padding:'11px',background:resetWord==='RESET'?'linear-gradient(135deg,#EF4444,#DC2626)':'#E2E8F0',color:resetWord==='RESET'?'#fff':'#94A3B8',border:'none',borderRadius:'9px',fontSize:'14px',fontWeight:700,cursor:resetWord==='RESET'?'pointer':'not-allowed',fontFamily:'inherit'}}>
                    ✓ ยืนยันรีเซ็ต
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

// ─── App Root ─────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS=/*EDITMODE-BEGIN*/{"theme":"dark","density":"normal"}/*EDITMODE-END*/;

const App=()=>{
  const [t,setTweak]=window.useTweaks(TWEAK_DEFAULTS);

  const [user,setUser]=useState(null);
  const [screen,setScreen]=useState('dashboard');
  const [authChecked,setAuthChecked]=useState(window.FIREBASE_DEMO_MODE); // demo = skip wait

  // ── Lifted shared state ────────────────────────────────────────────────────
  const [customers,setCustomers]       = useState(window.AppData.customers);
  const [employees,setEmployees]       = useState(window.AppData.employees);
  const [products,setProducts]         = useState([...window.AppData.products]);
  const [stockRequests,setStockRequests] = useState([]);
  const [dailyClosings,setDailyClosings] = useState([]);
  const [creditSales,setCreditSales]   = useState([]);
  const [recentSales,setRecentSales]   = useState(()=>{
    const seed = window.AppData.recentSales || [];
    // ให้ข้อมูล seed มี timestamp เพื่อให้กราฟ/ตัวกรองช่วงเวลาทำงานถูกต้อง
    return seed.map((s,i)=> s.ts ? s : {...s, ts: Date.now() - i*86400000});
  });
  const [showReceiptSettings,setShowReceiptSettings] = useState(false);
  const [receiptSettings,setReceiptSettings] = useState(()=>{
    try{return JSON.parse(localStorage.getItem('ptReceiptSettings'))||{companyName:'PORNSAWAN TRADE',footerText:'ขอบคุณที่ใช้บริการ',showPromptPay:true,companyAddress:'',companyContact:'',showTaxId:false,taxId:'',logoUrl:'',logoSize:60,paperWidth:'80mm',autoPrint:false,receiptFontSize:14,copies:1};}
    catch{return{companyName:'PORNSAWAN TRADE',footerText:'ขอบคุณที่ใช้บริการ',showPromptPay:true,companyAddress:'',companyContact:'',showTaxId:false,taxId:'',logoUrl:'',logoSize:60,paperWidth:'80mm',autoPrint:false,receiptFontSize:14,copies:1};}
  });

// ── Tweaks / theme ─────────────────────────────────────────────────────────
  useEffect(()=>{
    const cls=document.body.classList;
    cls.remove('theme-light','theme-purple','compact');
    if(t.theme==='light')cls.add('theme-light');
    if(t.theme==='purple')cls.add('theme-purple');
    if(t.density==='compact')cls.add('compact');
  },[t.theme,t.density]);
  useEffect(()=>{localStorage.setItem('ptReceiptSettings',JSON.stringify(receiptSettings));},[receiptSettings]);

  // ── Firebase Auth state listener ───────────────────────────────────────────
  useEffect(()=>{
    if(window.FIREBASE_DEMO_MODE) return; // demo — ข้ามไป
    const unsub = window.fbOnAuthChanged(userData=>{
      if(userData){
        setUser({
          name:userData.name, role:userData.role,
          staffId:userData.staffId, uid:userData.uid,
          email:userData.email, promptPayId:userData.promptPayId||''
        });
        setScreen('dashboard');
      } else {
        setUser(null);
      }
      setAuthChecked(true);
    });
    return unsub;
  },[]);

  // ── Firestore real-time subscriptions (เมื่อ login แล้ว) ──────────────────
  useEffect(()=>{
    if(!window.DB || !user) return;
    const unsubs=[
      window.fbSubscribe('products',      data=>setProducts(data)),
      window.fbSubscribe('customers',     data=>setCustomers(data)),
      window.fbSubscribe('employees',     data=>setEmployees(data)),
      window.fbSubscribe('stockRequests', data=>setStockRequests(data)),
      window.fbSubscribe('dailyClosings', data=>setDailyClosings(data)),
      window.fbSubscribe('creditSales',   data=>setCreditSales(data)),
      window.fbSubscribe('sales',         data=>setRecentSales(
        [...data].sort((a,b)=>(b.ts||0)-(a.ts||0))
      )),
    ];
    return ()=>unsubs.forEach(u=>u());
  },[user]);

  // ── Firebase-aware mutations ───────────────────────────────────────────────
  const addCustomer = async c => {
    if(window.DB){ await window.fbAdd('customers', c); }
    else { setCustomers(prev=>[...prev,c]); }
  };

  const updateProducts = async newProds => {
    if(window.DB){ await window.fbBatchWriteProducts(newProds); }
    else { setProducts(newProds); }
  };

  const updateEmployees = async newEmps => {
    if(window.DB){ await window.fbBatchWriteEmployees(newEmps); }
    else { setEmployees(newEmps); }
  };

  const deleteEmployee = async id => {
    if(window.DB){ await window.fbDelete('users', id); }
    else { setEmployees(prev=>prev.filter(e=>String(e.id)!==String(id)&&String(e._fbid)!==String(id))); }
  };

  const resetData = async () => {
    if(window.DB){
      for(const r of stockRequests){ try{ await window.fbDelete('stockRequests', r.id||r._fbid); }catch(e){} }
      for(const c of dailyClosings){ try{ await window.fbDelete('dailyClosings', c.id||c._fbid); }catch(e){} }
      for(const s of creditSales){   try{ await window.fbDelete('creditSales',   s.id||s._fbid); }catch(e){} }
      for(const s of recentSales){   try{ await window.fbDelete('sales',         s.id||s._fbid); }catch(e){} }
    }
    setStockRequests([]);
    setDailyClosings([]);
    setCreditSales([]);
    setRecentSales([]);
    // clear mock/local sales
    if(window.AppData){ window.AppData.recentSales=[]; window.AppData.voidHistory=[]; window.AppData.staffSales=(window.AppData.staffSales||[]).map(s=>({...s,revenue:0,sales:0})); }
  };

  const addStockRequest = async r => {
    if(window.DB){ await window.fbAdd('stockRequests', r); }
    else { setStockRequests(p=>[r,...p]); }
  };

  const updateStockRequests = async list => {
    if(window.DB){
      for(const r of list){
        await window.fbSet('stockRequests', r.id||r._fbid, r);
      }
    } else { setStockRequests(list); }
  };

  const addDailyClosing = async c => {
    if(window.DB){ await window.fbAdd('dailyClosings', c); }
    else { setDailyClosings(p=>[c,...p]); }
  };

  const updateDailyClosings = async list => {
    if(window.DB){
      for(const c of list){
        await window.fbSet('dailyClosings', c.id||c._fbid, c);
      }
    } else { setDailyClosings(list); }
  };

  const addCreditSale = async sale => {
    if(window.DB){ await window.fbAdd('creditSales', sale); }
    else { setCreditSales(p=>[sale,...p]); }
  };

  const addSale = async sale => {
    if(window.DB){ await window.fbAdd('sales', sale); }
    else { setRecentSales(p=>[sale,...p]); }
  };

  const receivePayment = async (id, note) => {
    if(window.DB){ await window.fbUpdate('creditSales', id, {isPaid:true, paidNote:note}); }
    else { setCreditSales(p=>p.map(s=>s.id===id?{...s,isPaid:true,paidNote:note}:s)); }
  };

  const handleLogout = () => {
    window.fbSignOut();
    setUser(null); setScreen('dashboard');
  };

  const saveReceiptSettings = s => setReceiptSettings(s);

  // ── Loading screen (รอ Firebase ตรวจสอบ auth) ─────────────────────────────
  if(!authChecked){
    return(
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',
        background:'linear-gradient(145deg,#0F172A,#1E1B4B)'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:'56px',height:'56px',borderRadius:'16px',
            background:'linear-gradient(135deg,#6366F1,#8B5CF6)',
            display:'flex',alignItems:'center',justifyContent:'center',
            margin:'0 auto 20px',boxShadow:'0 8px 32px rgba(99,102,241,0.4)',
            animation:'spin 1s linear infinite'}}>
            <span style={{color:'#fff',fontWeight:800,fontSize:'24px'}}>P</span>
          </div>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:'14px'}}>กำลังเชื่อมต่อ Firebase…</p>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  // ── Screen map ─────────────────────────────────────────────────────────────
  const screenMap={
    dashboard:    <Dashboard user={user} products={products} customers={customers} recentSales={recentSales}/>,
    inventory:    <Inventory user={user} products={products} onUpdateProducts={updateProducts}/>,
    pos:          <POSScreen user={user} customers={customers} onAddCustomer={addCustomer}
                    employees={employees} receiptSettings={receiptSettings}
                    onOpenReceiptSettings={()=>setShowReceiptSettings(true)}
                    onCreditSale={addCreditSale} onSale={addSale} products={products}/>,
    reports:      <Reports recentSales={recentSales} products={products} customers={customers}/>,
    customers:    <Customers user={user} customers={customers} onAddCustomer={addCustomer}/>,
    employees:    <Employees employees={employees} onUpdate={updateEmployees} onDelete={deleteEmployee} user={user} customers={customers}/>,
    oversight:    <AdminOversight employees={employees}/>,
    settings:     <SettingsScreen receiptSettings={receiptSettings} onSave={saveReceiptSettings} allData={{employees,customers,products,stockRequests,dailyClosings,creditSales}} onReset={resetData}/>,
    stockrequest: <StockRequestScreen user={user} products={products}
                    stockRequests={stockRequests} onSubmit={addStockRequest}/>,
    dailyclose:   <DailyCloseScreen user={user} dailyClosings={dailyClosings} onSubmit={addDailyClosing}/>,
    credits:      <CreditScreen user={user} creditSales={creditSales} onReceivePayment={receivePayment}/>,
    stockapproval:<StockApprovalScreen stockRequests={stockRequests} onUpdate={updateStockRequests}
                    products={products} onUpdateProducts={updateProducts}/>,
    dailyadmin:   <DailyCloseAdminScreen dailyClosings={dailyClosings} onUpdate={updateDailyClosings}/>,
  };

  const badges={
    stockapproval: stockRequests.filter(r=>r.status==='pending').length,
    dailyadmin:    dailyClosings.filter(c=>c.status==='pending').length,
    credits:       creditSales.filter(s=>!s.isPaid&&s.staffId===user?.staffId).length,
  };

  return (
    <>
      {!user
        ? <LoginScreen onLogin={u=>{setUser(u);setScreen('dashboard');}} />
        : <AppLayout user={user} screen={screen} onNavigate={setScreen}
            onLogout={handleLogout} badges={badges}>
            {screenMap[screen]}
          </AppLayout>
      }
      <ReceiptSettingsModal open={showReceiptSettings} onClose={()=>setShowReceiptSettings(false)}
        settings={receiptSettings} onSave={saveReceiptSettings}/>
      <window.TweaksPanel title="ตั้งค่า Tweaks">
        <window.TweakSection label="รูปแบบ Sidebar"/>
        <window.TweakRadio label="ธีม" value={t.theme}
          options={[{value:'dark',label:'มืด'},{value:'light',label:'สว่าง'},{value:'purple',label:'สีม่วง'}]}
          onChange={v=>setTweak('theme',v)}/>
        <window.TweakSection label="ขนาด"/>
        <window.TweakRadio label="Density" value={t.density}
          options={[{value:'normal',label:'ปกติ'},{value:'compact',label:'กระชับ'}]}
          onChange={v=>setTweak('density',v)}/>
      </window.TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
