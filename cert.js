/* ============================================================
   cert.js — رسم الشهادة (1536×1024) بالكود، من غير صورة جاهزة.
   عدّل النصوص من CERT_CFG تحت. لو عايز لوجو: حط الملفات
   logo-uni.png (يسار) و logo-fac.png (يمين) جنب index.html.
   ============================================================ */
window.CERT_CFG = {
  uni: 'AL RYADA UNIVERSITY FOR SCIENCE AND TECHNOLOGY',
  fac: 'FACULTY OF NURSING',
  facAr: 'كلية التمريض',
  titleEn: 'Modern Drugs of Abuse and Their Effects',
  titleAr: 'المخدرات المستحدثة وأثرها',
  org1: 'Organized by the Faculty of Nursing in collaboration with',
  org2: 'the National Center for Social and Criminological Research.',
  dean: 'Prof. Dr. Naglaa Abdel Mawgood',
  deanTitle: 'Dean of the Faculty of Nursing',
  abbr: 'RST',
  logoL: 'logo-uni.png',
  logoR: 'logo-fac.png'
};

window.drawCertificate = async function (d) {
  const cfg = window.CERT_CFG, E = window.EVENT || {};
  const W = 1536, H = 1024;
  const NAVY = '#0b2a5f', NAVY2 = '#16408a', GOLD = '#b78a2c', GOLD_L = '#e6c870', GOLD_D = '#8f6a1a',
        INK = '#1b2b4b', MUT = '#5d6b86', IVORY = '#fffdf8';

  // ---- الخطوط لازم تكون محمّلة قبل الرسم ----
  const loads = [
    ['400 100px "Great Vibes"', 'Aa'], ['700 40px Cinzel', 'Aa'], ['500 20px Cinzel', 'Aa'],
    ['italic 400 24px "Playfair Display"', 'Aa'], ['700 40px "Playfair Display"', 'Aa'],
    ['400 20px "Playfair Display"', 'Aa'], ['800 30px Cairo', 'ع'], ['600 20px Cairo', 'ع']
  ];
  try { await Promise.all(loads.map(l => document.fonts.load(l[0], l[1]))); } catch (e) {}

  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');

  // ---- أدوات مساعدة ----
  const T = (txt, px, py, font, color, align = 'center', o = {}) => {
    x.save(); x.font = font; x.fillStyle = color; x.textAlign = align; x.textBaseline = 'alphabetic';
    x.direction = o.rtl ? 'rtl' : 'ltr';
    if ('letterSpacing' in x) x.letterSpacing = (o.ls || 0) + 'px';
    x.fillText(txt, px, py); x.restore();
  };
  const fit = (txt, fn, max, start, min) => {
    let s = start; x.font = fn(s);
    while (x.measureText(txt).width > max && s > min) { s -= 2; x.font = fn(s); }
    return s;
  };
  const line = (x1, y1, x2, y2, col, w) => { x.save(); x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke(); x.restore(); };
  const diamond = (cx, cy, r, col) => { x.save(); x.fillStyle = col; x.beginPath(); x.moveTo(cx, cy - r); x.lineTo(cx + r, cy); x.lineTo(cx, cy + r); x.lineTo(cx - r, cy); x.closePath(); x.fill(); x.restore(); };
  const loadImg = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });

  // ---- الخلفية ----
  x.fillStyle = IVORY; x.fillRect(0, 0, W, H);
  x.save(); x.strokeStyle = 'rgba(11,42,95,.035)'; x.lineWidth = 1;
  for (let i = -H; i < W; i += 14) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + H, H); x.stroke(); }
  x.restore();
  x.save(); x.globalAlpha = .032; x.fillStyle = NAVY; x.font = '700 400px Cinzel'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(cfg.abbr, W / 2, H / 2 + 60); x.restore();

  // ---- الإطار ----
  x.strokeStyle = NAVY; x.lineWidth = 14; x.strokeRect(30, 30, W - 60, H - 60);
  x.strokeStyle = GOLD; x.lineWidth = 3; x.strokeRect(50, 50, W - 100, H - 100);
  x.lineWidth = 1.2; x.strokeRect(58, 58, W - 116, H - 116);
  const corner = (px, py, sx, sy) => {
    x.save(); x.translate(px, py); x.scale(sx, sy); x.strokeStyle = GOLD; x.lineWidth = 2.5;
    x.beginPath(); x.arc(0, 0, 46, 0, Math.PI / 2); x.stroke();
    x.lineWidth = 1.2; x.beginPath(); x.arc(0, 0, 60, 0, Math.PI / 2); x.stroke();
    x.restore(); diamond(px + sx * 14, py + sy * 14, 7, GOLD);
  };
  corner(58, H - 58, 1, -1); corner(W - 58, H - 58, -1, -1);

  // ---- الهيدر ----
  const g = x.createLinearGradient(0, 58, W, 182); g.addColorStop(0, NAVY); g.addColorStop(.5, NAVY2); g.addColorStop(1, NAVY);
  x.fillStyle = g; x.fillRect(58, 58, W - 116, 106);
  line(58, 164, W - 58, 164, GOLD, 4); line(58, 172, W - 58, 172, GOLD_L, 1.2);

  const logos = await Promise.all([loadImg(cfg.logoL), loadImg(cfg.logoR)]);
  [[150, logos[0]], [W - 150, logos[1]]].forEach(([cx, im]) => {
    if (!im) return;
    x.save(); x.beginPath(); x.arc(cx, 111, 44, 0, Math.PI * 2); x.fillStyle = '#fff'; x.fill();
    x.lineWidth = 3; x.strokeStyle = GOLD_L; x.stroke(); x.clip();
    const r = Math.min(80 / im.width, 80 / im.height); x.drawImage(im, cx - im.width * r / 2, 111 - im.height * r / 2, im.width * r, im.height * r);
    x.restore();
  });

  fit(cfg.uni, s => `700 ${s}px Cinzel`, 1000, 36, 24);
  T(cfg.uni, W / 2, 104, x.font, '#fff', 'center', { ls: 1.5 });
  diamond(W / 2, 136, 6, GOLD_L);
  T(cfg.fac, W / 2 - 24, 144, '500 25px Cinzel', GOLD_L, 'right', { ls: 3 });
  T(cfg.facAr, W / 2 + 24, 146, '700 26px Cairo', GOLD_L, 'left', { rtl: 1 });

  // ---- العنوان ----
  fit('CERTIFICATE OF ATTENDANCE', s => `700 ${s}px Cinzel`, 1150, 56, 36);
  T('CERTIFICATE OF ATTENDANCE', W / 2, 236, x.font, NAVY, 'center', { ls: 4 });
  line(W / 2 - 330, 270, W / 2 - 140, 270, GOLD, 2); line(W / 2 + 140, 270, W / 2 + 330, 270, GOLD, 2);
  diamond(W / 2 - 340, 270, 5, GOLD); diamond(W / 2 + 340, 270, 5, GOLD);
  T('شهادة حضور', W / 2, 284, '800 40px Cairo', GOLD_D, 'center', { rtl: 1 });

  // ---- الاسم ----
  T('This is to certify that', W / 2, 336, 'italic 400 28px "Playfair Display"', MUT);
  const nm = (d.nameEn || d.name || '').trim();
  const ar = /[\u0600-\u06FF]/.test(nm); // اسم عربي: Great Vibes مفيهوش حروف عربي
  const nf = ar ? (z => `800 ${z}px Cairo`) : (z => `${z}px "Great Vibes"`);
  const fs = fit(nm, nf, 1000, ar ? 70 : 100, 40);
  T(nm, W / 2, ar ? 428 : 436, nf(fs), NAVY, 'center', { rtl: ar });
  line(W / 2 - 420, 460, W / 2 + 420, 460, GOLD, 2); line(W / 2 - 420, 466, W / 2 + 420, 466, GOLD_L, 1);
  diamond(W / 2, 463, 6, GOLD);

  // ---- الندوة ----
  T('has attended the scientific seminar entitled', W / 2, 508, 'italic 400 26px "Playfair Display"', MUT);
  fit(cfg.titleEn, s => `700 ${s}px "Playfair Display"`, 1250, 48, 30);
  T(cfg.titleEn, W / 2, 564, x.font, NAVY);
  T(cfg.titleAr, W / 2, 608, '800 36px Cairo', GOLD_D, 'center', { rtl: 1 });
  T(cfg.org1, W / 2, 650, '400 20px "Playfair Display"', INK);
  T(cfg.org2, W / 2, 676, '400 20px "Playfair Display"', INK);

  // ---- تفاصيل (المكان / التاريخ / الوقت) ----
  let dt = '', tm = '';
  try {
    const D = new Date(E.date);
    dt = D.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Cairo' });
    tm = D.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Africa/Cairo' });
  } catch (e) {}
  const venue = 'Hall ' + String(E.place || '').replace(/\s+/g, '');
  const sx = 250, sw = W - 500, sy = 698, sh = 66;
  x.save(); x.beginPath(); x.roundRect ? x.roundRect(sx, sy, sw, sh, 14) : x.rect(sx, sy, sw, sh);
  x.fillStyle = 'rgba(11,42,95,.045)'; x.fill(); x.strokeStyle = GOLD; x.lineWidth = 1.5; x.stroke(); x.restore();
  [['VENUE', venue], ['DATE', dt], ['TIME', tm]].forEach((it, i) => {
    const cx = sx + sw / 6 + i * sw / 3;
    T(it[0], cx, sy + 24, '500 15px Cinzel', GOLD_D, 'center', { ls: 4 });
    T(it[1], cx, sy + 52, '700 24px Cairo', NAVY);
    if (i) line(sx + i * sw / 3, sy + 14, sx + i * sw / 3, sy + sh - 14, GOLD_L, 1.5);
  });

  // ---- الختم ----
  const cx = W / 2, cy = 852, r = 52;
  x.fillStyle = NAVY;
  [-1, 1].forEach(s => {
    x.beginPath(); x.moveTo(cx + s * 40, cy + 26); x.lineTo(cx + s * 6, cy + 40); x.lineTo(cx + s * 12, cy + r + 36);
    x.lineTo(cx + s * 28, cy + r + 22); x.lineTo(cx + s * 44, cy + r + 34); x.closePath(); x.fill();
  });
  const sg = x.createLinearGradient(cx - r, cy - r, cx + r, cy + r); sg.addColorStop(0, GOLD_L); sg.addColorStop(.5, '#d4a93c'); sg.addColorStop(1, GOLD_D);
  x.beginPath();
  for (let i = 0; i < 64; i++) { const a = i / 64 * Math.PI * 2, rr = i % 2 ? r - 5 : r + 2; x[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
  x.closePath(); x.fillStyle = sg; x.fill();
  x.beginPath(); x.arc(cx, cy, r - 12, 0, Math.PI * 2); x.strokeStyle = NAVY; x.lineWidth = 2.5; x.stroke();
  x.beginPath(); x.arc(cx, cy, r - 17, 0, Math.PI * 2); x.strokeStyle = 'rgba(11,42,95,.45)'; x.lineWidth = 1; x.stroke();
  T(cfg.abbr, cx, cy + 9, '700 26px Cinzel', NAVY, 'center', { ls: 1 });
  T('★ ★ ★', cx, cy - 16, '10px Arial', NAVY);

  // ---- التوقيع (يسار) ----
  line(250, 872, 550, 872, NAVY, 1.5);
  T(cfg.dean, 400, 902, '700 23px "Playfair Display"', NAVY);
  T(cfg.deanTitle, 400, 926, 'italic 400 19px "Playfair Display"', MUT);

  // ---- QR (يمين) ----
  const qx = 1136 - 85, qy = 782;
  x.save(); x.beginPath(); x.roundRect ? x.roundRect(qx, qy, 170, 158, 12) : x.rect(qx, qy, 170, 158);
  x.fillStyle = '#fff'; x.fill(); x.strokeStyle = GOLD; x.lineWidth = 2; x.stroke(); x.restore();
  const url = new URL('verify.html?id=' + encodeURIComponent(d.id), location.href).href;
  const q = qrcode(0, 'M'); q.addData(url); q.make();
  const n = q.getModuleCount(), cell = 116 / n; x.fillStyle = NAVY;
  for (let r2 = 0; r2 < n; r2++) for (let c2 = 0; c2 < n; c2++) if (q.isDark(r2, c2)) x.fillRect(qx + 27 + c2 * cell, qy + 9 + r2 * cell, cell + .6, cell + .6);
  T('SCAN TO VERIFY', 1136, qy + 138, '600 12px Cinzel', NAVY, 'center', { ls: 1.5 });
  T(d.id, 1136, qy + 151, '11px monospace', MUT);

  return c;
};
