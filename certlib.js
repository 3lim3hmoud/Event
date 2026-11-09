// رسم شهادة التقدير للأورجنايزر على canvas (بيستخدمه الموقع، ونفس الكود بيولّد الملفات الجاهزة)
(function(){
 const W=1536,H=1024,NAVY='#0a2a66',GOLD='#c9a227';
 let fp;
 function fonts(base){
  if(fp)return fp;
  const f=[['Great Vibes','great-vibes-latin-400-normal.woff2',{}],
           ['Playfair Display','playfair-display-latin-400-italic.woff2',{style:'italic',weight:'400'}],
           ['Playfair Display','playfair-display-latin-700-italic.woff2',{style:'italic',weight:'700'}]];
  fp=Promise.all(f.map(async([n,u,d])=>{const ff=new FontFace(n,'url('+base+'lib/fonts/'+u+')',d);await ff.load();document.fonts.add(ff)}));
  return fp;
 }
 const img=src=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(new Error('img '+src));i.src=src});
 function fit(x,txt,font,max,start,min){let s=start;do{x.font=font(s);s-=1}while(x.measureText(txt).width>max&&s>min);return s}
 // opts: {base:'' (مسار الملفات), site:'https://…/' (أساس رابط التوثيق)}
 async function drawOrg(id,opts){
  opts=opts||{};const base=opts.base||'',R=(window.ORG_CERTS&&ORG_CERTS.byId[id]);
  if(!R)throw new Error('unknown id');
  await fonts(base);
  const custom=!!R.t,im=await img(base+(custom?'cert-org-clean.jpg':'cert-org.jpg'));
  const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  x.drawImage(im,0,0,W,H);x.textAlign='center';x.textBaseline='alphabetic';x.fillStyle=NAVY;
  // الاسم داخل الإطار
  const nm=R.n.trim();
  const fs=fit(x,nm,s=>s+'px "Great Vibes"',860,84,40);x.font=fs+'px "Great Vibes"';
  x.fillText(nm,W/2,462+Math.round(fs*.27));
  // نص مخصص (بدل الفقرة الثابتة)
  if(custom){
   const it=s=>'italic 400 '+s+'px "Playfair Display"',bd=s=>'italic 700 '+s+'px "Playfair Display"';
   const a=Math.min(fit(x,R.t[0],it,1120,40,24),fit(x,R.t[1],it,1120,40,24)),d=fit(x,R.t[2],bd,1120,46,28);
   x.font=it(a);x.fillText(R.t[0],W/2,588);x.fillText(R.t[1],W/2,637);
   x.font=bd(d);x.fillText(R.t[2],W/2,697);
  }
  // QR التوثيق
  const site=opts.site||new URL('./',location.href).href,u=site+'?verify='+id,q=qrcode(0,'M');q.addData(u);q.make();
  const n=q.getModuleCount(),m=4,qs=n*m,pad=14,bw=qs+pad*2,bh=bw+44,bx=1008,by=768;
  x.fillStyle='#fff';x.beginPath();x.roundRect?x.roundRect(bx,by,bw,bh,14):x.rect(bx,by,bw,bh);x.fill();
  x.strokeStyle=GOLD;x.lineWidth=3;x.stroke();
  x.fillStyle=NAVY;
  for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))x.fillRect(bx+pad+k*m,by+pad+r*m,m,m);
  x.textAlign='center';x.font='bold 13px Arial,sans-serif';x.fillText('SCAN TO VERIFY',bx+bw/2,by+pad+qs+17);
  x.font='13px monospace';x.fillText(id,bx+bw/2,by+pad+qs+35);
  return c;
 }
 window.CertLib={drawOrg,fonts};
})();
