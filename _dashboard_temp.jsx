// ─── Dashboard ───────────────────────────────────────────────────────────────

const Dashboard = ({ user, products=[], customers=[], recentSales=[] }) => {
  const today = new Date().toLocaleDateString('th-TH', {year:'numeric',month:'short',day:'numeric'});
  const lowStock   = products.filter(p => p.stockBase <= p.minStockBase);
  const todaySales = recentSales.filter(s => s.date === today);
  const todayRev   = todaySales.reduce((s, x) => s + x.total, 0);
  
  // คำนวณ 7 วันล่าสุด
  const last7Days = [];
  for(let i=6; i>=0; i--){
    const d = new Date();
    d.setDate(d.getDate()-i);
    const dateStr = d.toLocaleDateString('th-TH', {year:'numeric',month:'short',day:'numeric'});
    const daysSales = recentSales.filter(s => s.date === dateStr).reduce((s,x) => s + x.total, 0);
    last7Days.push({ day: d.toLocaleDateString('th-TH', {month:'short',day:'numeric'}), amount: daysSales });
  }
  const maxAmt = Math.max(...last7Days.map(d => d.amount), 1);

  const payLabel = { cash:'เงินสด', transfer:'โอนเงิน', promptpay:'PromptPay' };
  const payColor = { cash:'green', transfer:'blue', promptpay:'purple' };

  const kpis = [
    { label:'ยอดขายวันนี้', en:"Today's Sales", value:`฿${todayRev.toLocaleString()}`, sub:`${todaySales.length} รายการ`, clr:'#4F46E5', bg:'#EEF2FF', Icon:IcoCart },
    { label:'ยอดขายเดือนนี้', en:'Monthly Revenue', value:'฿180,890', sub:'+12.5% จากเดือนที่แล้ว', clr:'#10B981', bg:'#D1FAE5', Icon:IcoTrend },
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
              {recentSales.map((s,i) => (
                <tr key={i} style={{ borderTop:'1px solid var(--border)' }}>
                  <td style={{ padding:'13px 18px', fontSize:'13px', color:'var(--primary)', fontWeight:600 }}>{s.id}</td>
                  <td style={{ padding:'13px 18px', fontSize:'13px', color:'var(--text-muted)' }}>{s.date}</td>
                  <td style={{ padding:'13px 18px', fontSize:'14px', fontWeight:500 }}>{s.customer}</td>
                  <td style={{ padding:'13px 18px', fontSize:'13px', color:'var(--text-muted)' }}>{s.items} รายการ</td>
                  <td style={{ padding:'13px 18px', fontSize:'15px', fontWeight:700 }}>฿{s.total.toLocaleString()}</td>
                  <td style={{ padding:'13px 18px' }}><Badge color={payColor[s.payment]}>{payLabel[s.payment]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

