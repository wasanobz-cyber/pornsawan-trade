// PORNSAWAN TRADE — Mock Data (v3: ดีวัวแท้ product line)
window.AppData = {
  categories: ['ทั้งหมด', 'ดีวัวแท้', 'สารเข้มข้น'],

  products: [
    // ─ ดีวัวแท้ ───────────────────────────────────────────────────────────
    { id:1, sku:'DW-SS', name:'ดีวัวแท้ ไซส์ SS', category:'ดีวัวแท้', cost:0,
      stockBase:0, minStockBase:300,
      unitLevels:[{name:'ลัง',perNext:6,price:0},{name:'แพค',perNext:50,price:0},{name:'ซอง',price:0}] },

    { id:2, sku:'DW-S', name:'ดีวัวแท้ ไซส์ S', category:'ดีวัวแท้', cost:0,
      stockBase:0, minStockBase:1000,
      unitLevels:[{name:'ลัง',perNext:10,price:0},{name:'แพค',perNext:100,price:0},{name:'ขวด',price:0}] },

    { id:3, sku:'DW-M', name:'ดีวัวแท้ ไซส์ M', category:'ดีวัวแท้', cost:0,
      stockBase:0, minStockBase:48,
      unitLevels:[{name:'ลัง',perNext:8,price:0},{name:'แพค',perNext:6,price:0},{name:'ขวด',price:0}] },

    { id:4, sku:'DW-L', name:'ดีวัวแท้ ไซส์ L', category:'ดีวัวแท้', cost:0,
      stockBase:0, minStockBase:24,
      unitLevels:[{name:'ลัง',perNext:4,price:0},{name:'แพค',perNext:6,price:0},{name:'ขวด',price:0}] },

    { id:5, sku:'DW-XL', name:'ดีวัวแท้ ไซส์ XL', category:'ดีวัวแท้', cost:0,
      stockBase:0, minStockBase:12,
      unitLevels:[{name:'ลัง',perNext:4,price:0},{name:'แพค',perNext:3,price:0},{name:'ขวด',price:0}] },

    // ─ สารเข้มข้น ──────────────────────────────────────────────────────────
    { id:6, sku:'OXG-001', name:'CONCENTRATE OX GALL 85% SOLID', category:'สารเข้มข้น', cost:0,
      stockBase:0, minStockBase:1,
      unitLevels:[{name:'ถัง',price:0}] },
  ],

  customers: [
    { id:1, name:'ร้านสะดวกซื้อ นายประเสริฐ', contact:'ประเสริฐ ดีมาก',  phone:'081-234-5678', address:'123 ถ.สุขุมวิท กรุงเทพ',   totalPurchases:125000, lastPurchase:'2 มิ.ย. 2569',  assignedStaff:2, createdBy:2 },
    { id:2, name:'ร้านค้าปลีก สมศรี',          contact:'สมศรี ใจดี',     phone:'089-876-5432', address:'45 ถ.เพชรบุรี กรุงเทพ',    totalPurchases:89000,  lastPurchase:'30 พ.ค. 2569', assignedStaff:3, createdBy:3 },
    { id:3, name:'ร้านของชำ ตลาดสด',           contact:'มาลี สุขใจ',     phone:'062-111-2233', address:'7 ตลาดวโรรส เชียงใหม่',    totalPurchases:210000, lastPurchase:'1 มิ.ย. 2569',  assignedStaff:2, createdBy:2 },
    { id:4, name:'มินิมาร์ท แสงอรุณ',          contact:'อรุณ สว่าง',     phone:'093-445-6789', address:'99 ม.3 นนทบุรี',            totalPurchases:45000,  lastPurchase:'15 พ.ค. 2569', assignedStaff:4, createdBy:4 },
    { id:5, name:'ร้านโชห่วย บ้านนาย',         contact:'นาย รักดี',      phone:'087-654-3210', address:'12 ซ.ลาดพร้าว กรุงเทพ',   totalPurchases:320000, lastPurchase:'2 มิ.ย. 2569',  assignedStaff:3, createdBy:3 },
    { id:6, name:'ซุปเปอร์มาร์เก็ต สมชาย',    contact:'สมชาย มั่งมี',   phone:'085-123-9876', address:'200 ถ.รัชดาภิเษก กรุงเทพ', totalPurchases:560000, lastPurchase:'1 มิ.ย. 2569',  assignedStaff:4, createdBy:4 },
    { id:7, name:'ร้านอาหาร ครัวคุณแม่',       contact:'คุณแม่ สุดใจ',   phone:'098-765-4321', address:'33 ถ.สีลม กรุงเทพ',         totalPurchases:78000,  lastPurchase:'29 พ.ค. 2569', assignedStaff:5, createdBy:5 },
    { id:8, name:'โรงแรม The Royal',           contact:'คุณนิพนธ์',      phone:'091-222-3344', address:'1 ถ.สาทร กรุงเทพ',          totalPurchases:890000, lastPurchase:'2 มิ.ย. 2569',  assignedStaff:2, createdBy:2 },
  ],

  employees: [
    { id:1, name:'สมหมาย รักงาน',   role:'admin',    phone:'081-111-1111', joinDate:'15 ม.ค. 2563',  status:'active',   promptPayId:'081-111-1111' },
    { id:2, name:'สาวน้อย ขยันดี',  role:'employee', phone:'082-222-2222', joinDate:'20 มี.ค. 2564', status:'active',   promptPayId:'082-222-2222' },
    { id:3, name:'ชาตรี มุ่งมั่น',  role:'employee', phone:'083-333-3333', joinDate:'1 มิ.ย. 2565',  status:'active',   promptPayId:'083-333-3333' },
    { id:4, name:'นารี ตั้งใจ',     role:'employee', phone:'084-444-4444', joinDate:'10 ม.ค. 2566',  status:'active',   promptPayId:'084-444-4444' },
    { id:5, name:'วิชัย กล้าหาญ',   role:'employee', phone:'085-555-5555', joinDate:'15 ส.ค. 2567',  status:'inactive', promptPayId:'' },
  ],

  recentSales: [
    { id:'INV-2026-001', date:'2 มิ.ย. 2569',  customer:'โรงแรม The Royal',        items:8,  total:4850,  payment:'promptpay' },
    { id:'INV-2026-002', date:'2 มิ.ย. 2569',  customer:'ร้านโชห่วย บ้านนาย',      items:12, total:2340,  payment:'cash'      },
    { id:'INV-2026-003', date:'1 มิ.ย. 2569',  customer:'ซุปเปอร์มาร์เก็ต สมชาย', items:25, total:11200, payment:'transfer'  },
    { id:'INV-2026-004', date:'1 มิ.ย. 2569',  customer:'ร้านค้าปลีก สมศรี',        items:6,  total:890,   payment:'cash'      },
    { id:'INV-2026-005', date:'31 พ.ค. 2569', customer:'ร้านสะดวกซื้อ นายประเสริฐ',items:15, total:6750,  payment:'promptpay' },
    { id:'INV-2026-006', date:'31 พ.ค. 2569', customer:'ร้านอาหาร ครัวคุณแม่',     items:4,  total:1250,  payment:'cash'      },
  ],

  dailySales: [
    { day:'27 พ.ค.', amount:18500 },
    { day:'28 พ.ค.', amount:24300 },
    { day:'29 พ.ค.', amount:19800 },
    { day:'30 พ.ค.', amount:31200 },
    { day:'31 พ.ค.', amount:28700 },
    { day:'1 มิ.ย.',  amount:42500 },
    { day:'2 มิ.ย.',  amount:15890 },
  ],

  // ─ ยอดขายรายพนักงาน (Admin Oversight) ───────────────────────────────────
  staffSales: [
    { staffId:2, staffName:'สาวน้อย ขยันดี', sales:18, revenue:28500, voids:1, topProduct:'ดีวัวแท้ ไซส์ SS' },
    { staffId:3, staffName:'ชาตรี มุ่งมั่น',  sales:12, revenue:19800, voids:0, topProduct:'ดีวัวแท้ ไซส์ M'  },
    { staffId:4, staffName:'นารี ตั้งใจ',     sales:21, revenue:34200, voids:2, topProduct:'ดีวัวแท้ ไซส์ L'  },
    { staffId:5, staffName:'วิชัย กล้าหาญ',   sales:6,  revenue:8100,  voids:0, topProduct:'ดีวัวแท้ ไซส์ XL' },
  ],

  // ─ ประวัติยกเลิกบิล ───────────────────────────────────────────────────────
  voidHistory: [
    { id:'V-001', date:'2 มิ.ย. 2569',  staff:'สาวน้อย ขยันดี', bill:'INV-2026-009', amount:1250,  reason:'ลูกค้าเปลี่ยนใจ ขอยกเลิกทั้งบิล' },
    { id:'V-002', date:'1 มิ.ย. 2569',  staff:'นารี ตั้งใจ',    bill:'INV-2026-007', amount:3400,  reason:'สินค้าหมดสต๊อก ไม่สามารถจัดส่งได้'  },
    { id:'V-003', date:'31 พ.ค. 2569', staff:'นารี ตั้งใจ',    bill:'INV-2026-003', amount:890,   reason:'ลูกค้าสั่งผิดรายการ'                 },
  ],

  // ─ สินค้าในมือพนักงาน (บนรถ) ────────────────────────────────────────────
  staffInventory: {
    2: [],
    3: [],
    4: [],
    5: [],
  },

  // ─ ประวัติบิลรายพนักงาน ───────────────────────────────────────────────────
  staffBills: {
    2: [
      { id:'B2-001', date:'2 มิ.ย. 2569',  customer:'ร้านสะดวกซื้อ นายประเสริฐ', total:1850, items:5,  void:false, priceEdited:false, freebieValue:0    },
      { id:'B2-002', date:'2 มิ.ย. 2569',  customer:'โรงแรม The Royal',           total:4200, items:8,  void:false, priceEdited:true,  freebieValue:65,  editReason:'ส่วนลดพิเศษ VIP' },
      { id:'B2-003', date:'1 มิ.ย. 2569',  customer:'ร้านของชำ ตลาดสด',          total:0,    items:3,  void:true,  priceEdited:false, freebieValue:0,   voidReason:'ลูกค้าเปลี่ยนใจ' },
      { id:'B2-004', date:'1 มิ.ย. 2569',  customer:'ร้านสะดวกซื้อ นายประเสริฐ', total:3200, items:7,  void:false, priceEdited:false, freebieValue:130  },
    ],
    3: [
      { id:'B3-001', date:'2 มิ.ย. 2569',  customer:'ร้านค้าปลีก สมศรี',         total:2100, items:4,  void:false, priceEdited:false, freebieValue:0    },
      { id:'B3-002', date:'1 มิ.ย. 2569',  customer:'ร้านโชห่วย บ้านนาย',        total:5600, items:12, void:false, priceEdited:false, freebieValue:0    },
    ],
    4: [
      { id:'B4-001', date:'2 มิ.ย. 2569',  customer:'ซุปเปอร์มาร์เก็ต สมชาย',   total:8900, items:20, void:false, priceEdited:false, freebieValue:0    },
      { id:'B4-002', date:'1 มิ.ย. 2569',  customer:'มินิมาร์ท แสงอรุณ',         total:1200, items:3,  void:false, priceEdited:true,  freebieValue:0,   editReason:'ราคาพิเศษลูกค้าใหม่' },
      { id:'B4-003', date:'31 พ.ค. 2569', customer:'ซุปเปอร์มาร์เก็ต สมชาย',   total:6750, items:15, void:false, priceEdited:false, freebieValue:210  },
    ],
    5: [],
  },

  // ─ ยอดเครดิตค้างชำระรายพนักงาน ──────────────────────────────────────────
  staffCredits: {
    2: [
      { customer:'ร้านสะดวกซื้อ นายประเสริฐ', bill:'B2-001', amount:1850, dueDate:'9 มิ.ย. 2569',  isPaid:false },
      { customer:'โรงแรม The Royal',           bill:'B2-002', amount:4200, dueDate:'12 มิ.ย. 2569', isPaid:false },
    ],
    3: [
      { customer:'ร้านโชห่วย บ้านนาย', bill:'B3-002', amount:5600, dueDate:'8 มิ.ย. 2569', isPaid:false },
    ],
    4: [
      { customer:'ซุปเปอร์มาร์เก็ต สมชาย', bill:'B4-001', amount:8900, dueDate:'9 มิ.ย. 2569', isPaid:true  },
      { customer:'มินิมาร์ท แสงอรุณ',        bill:'B4-002', amount:1200, dueDate:'5 มิ.ย. 2569', isPaid:false },
    ],
    5: [],
  },
};

// ─── Unit helper functions ────────────────────────────────────────────────────

/** คำนวณ factor รวมจาก index ถึง base unit */
window.calcToBase = function(idx, levels) {
  var t = 1;
  for (var i = idx; i < levels.length - 1; i++) {
    t *= (levels[i].perNext || 1);
  }
  return t;
};

/** แปลง stockBase → ข้อความอ่านง่าย เช่น "2 ลัง 1 แพค 3 ขวด" */
window.formatStock = function(base, levels) {
  if (!levels || !levels.length) return base + '';
  var rem = base, parts = [];
  for (var i = 0; i < levels.length; i++) {
    var tb = window.calcToBase(i, levels);
    var count = Math.floor(rem / tb);
    if (count > 0) { parts.push(count + ' ' + levels[i].name); rem -= count * tb; }
  }
  return parts.length ? parts.join(' ') : '0 ' + levels[levels.length - 1].name;
};

/** ชื่อ base unit */
window.baseUnitName = function(levels) {
  return levels && levels.length ? levels[levels.length - 1].name : 'ชิ้น';
};
