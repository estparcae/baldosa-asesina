// BALDOSA ASESINA - Platanus Hack 26 - todo generado con codigo, cero assets
const W=960,H=540,TS=48,ROWS=4,SY=252,CURB=SY+ROWS*TS,FILA=7.5; // el TM es gratis: cuesta AFAN, no plata
const FS=(g,c,a)=>g.fillStyle(c,a===undefined?1:a),FR=(g,x,y,w,h)=>g.fillRect(x,y,w,h),
 FC=(g,x,y,r)=>g.fillCircle(x,y,r),FE=(g,x,y,w,h)=>g.fillEllipse(x,y,w,h),
 LS=(g,w,c,a)=>g.lineStyle(w,c,a===undefined?1:a);
const mix=(a,b,t)=>((((a>>16&255)+((b>>16&255)-(a>>16&255))*t)|0)<<16)|
 ((((a>>8&255)+((b>>8&255)-(a>>8&255))*t)|0)<<8)|(((a&255)+((b&255)-(a&255))*t)|0);

// paletas por nivel: misma geometria, otro barrio
const PAL=[
 {n:'LA CANDELARIA',    sky:0x8fb6cf,hi:0x4d6b58,bd:0xd8bd93,bd2:0xb5854f,rf:0x9c4426,tl:0xb4aea1,tl2:0x8a8478,ac:0x2f6fb0,st:0x4a4a52,nt:false},
 {n:'PLAZA DE BOLIVAR', sky:0x9dbcc9,hi:0x51705d,bd:0xc9c3b4,bd2:0x9c9585,rf:0x8d5033,tl:0xa85a3c,tl2:0x76391f,ac:0x1f5fa8,st:0x45454d,nt:false},
 {n:'AV. JIMENEZ',      sky:0x8ea3ad,hi:0x445a4c,bd:0xb0a89b,bd2:0x857e72,rf:0x7d4a33,tl:0x9a5f42,tl2:0x6e3a26,ac:0xd42b1e,st:0x33333a,nt:false},
 {n:'CHAPINERO NOCHE',  sky:0x141c33,hi:0x0d1526,bd:0x6b3a2e,bd2:0x40251d,rf:0x2a1a14,tl:0x4a4c55,tl2:0x32343b,ac:0xff3d7f,st:0x1c1c22,nt:true},
 {n:'HORA PICO CARACAS',sky:0x2a1830,hi:0x1a1024,bd:0x7a4038,bd2:0x4a2622,rf:0x33201a,tl:0x545159,tl2:0x38363d,ac:0xffb020,st:0x22202a,nt:true}];

// ---------- audio sintetizado (Web Audio, cero archivos) ----------
const A={ctx:null,on:true,
 init(){if(!A.ctx)try{A.ctx=new(window.AudioContext||window.webkitAudioContext)}catch(e){A.on=false}},
 t(f,d,ty,v,f2){if(!A.on)return;A.init();if(!A.ctx)return;const c=A.ctx,o=c.createOscillator(),g=c.createGain();
  o.type=ty||'square';o.frequency.value=f;if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),c.currentTime+d);
  g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(v||.12,c.currentTime+.008);
  g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+d)},
 noise(d,v,lp){if(!A.on)return;A.init();if(!A.ctx)return;const c=A.ctx,n=c.sampleRate*d,b=c.createBuffer(1,n,c.sampleRate),dt=b.getChannelData(0);
  for(let i=0;i<n;i++)dt[i]=(Math.random()*2-1)*(1-i/n);
  const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=lp||1200;
  const g=c.createGain();g.gain.value=v||.2;s.connect(f);f.connect(g);g.connect(c.destination);s.start()},
 hop(){A.t(520,.06,'square',.05,700)},
 splash(){A.noise(.35,.3,900);A.t(180,.25,'sine',.1,60)},
 coin(){A.t(880,.05,'square',.09);setTimeout(()=>A.t(1320,.09,'square',.09),50)},
 bark(){A.t(300,.1,'sawtooth',.17,110)},
 gate(){A.t(1200,.04,'square',.1);setTimeout(()=>A.t(1600,.07,'square',.1),60)},
 bus(){A.noise(.6,.14,320);A.t(90,.5,'triangle',.09,70)},
 hurt(){A.t(200,.3,'square',.14,60)},
 die(){[440,300,196].forEach((f,i)=>setTimeout(()=>A.t(f,.24,'triangle',.13),i*150))},
 win(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>A.t(f,.16,'square',.11),i*90))},
 buy(){A.gate()}};

// ---------- helpers de pixel art 16 bits ----------
const INK=0x14101c;
const CY='#ffd24a',CB='#9fd8f2',CR='#ff6a8a',CG='#7dffb0',CW='#d8d8e8',CS='#9aa0aa',
 TMR=0xd4271c,WHT=0xf4f4f8,GRY=0x8a8e96,AMB=0xffd24a;

const R1=s=>()=>{s=s*1664525+1013904223&0x7fffffff;return s/0x7fffffff};
// bisel de 4 tonos: la base de todo material que se ve solido
const bev=(g,x,y,w,h,c,z)=>{z=z||1;
 FS(g,mix(c,INK,.5),1);FR(g,x,y,w,h);
 FS(g,c,1);FR(g,x+z,y+z,w-z*2,h-z*2);
 FS(g,mix(c,0xffffff,.3),1);FR(g,x+z,y+z,w-z*2,z);FR(g,x+z,y+z,z,h-z*2);
 FS(g,mix(c,INK,.3),1);FR(g,x+z,y+h-z*2,w-z*2,z);FR(g,x+w-z*2,y+z,z,h-z*2)};
// ruido sembrado: detalle por algoritmo, no por enumeracion
const nz=(g,x,y,w,h,c,n,sd,a)=>{const R=R1(sd||7);FS(g,c,a==null?1:a);
 for(let i=0;i<n;i++)FR(g,x+(R()*w|0),y+(R()*h|0),1+(R()*2|0),1)};
// grieta: polilinea corta con quiebres
const crack=(g,x,y,l,c,sd)=>{const R=R1(sd||3);FS(g,c,1);let cx=x,cy=y;
 for(let i=0;i<l;i++){FR(g,cx,cy,1,1);cx+=R()<.5?1:0;cy+=R()<.4?1:(R()<.5?-1:0)}};
const dith=(g,x,y,w,h,c,dn)=>{FS(g,c,1);
 for(let j=0;j<h;j+=2)for(let i=0;i<w;i+=2){const q=((i>>1)+(j>>1))&3;if(q<dn)FR(g,x+i,y+j,2,2)}};
// pixel art desde strings: la unica forma de meter caras y pliegues en pocos bytes
const PX=(g,S,P,z,x0,y0)=>{for(let j=0;j<S.length;j++){const r=S[j];
 for(let i=0;i<r.length;i++){const c=P[r[i]];if(c==null)continue;
  FS(g,c,1);FR(g,x0+i*z,y0+j*z,z,z)}}};
const TT=(sc,x,y,t,c,sz,ox,wr)=>sc.add.text(x,y,t,{fontFamily:'monospace',fontSize:(sz||12)+'px',
 color:c||CW,stroke:'#14101c',strokeThickness:3,wordWrap:wr?{width:wr}:null}).setOrigin(ox||0,0);
const SD=(o,d)=>o.setScrollFactor(0).setDepth(d);
const crt=sc=>{sc.add.tileSprite(0,0,W,H,'crt').setOrigin(0).setScrollFactor(0).setDepth(200).setAlpha(.42);
 const g=sc.add.graphics().setScrollFactor(0).setDepth(201);
 for(let i=0;i<14;i++){LS(g,6,0x000000,.05);g.strokeRect(-10+i*5,-10+i*5,W+20-i*10,H+20-i*10)}};

// personaje: mismas filas, distinta paleta -> jugador, gente, todo
const FIG=["    oooo    ","   ohhhho   ","  ohhhhhho  ","  ohsssssho ","  ohskskso  ",
 "  ohsssssho ","   oohsoo   ","  orrrrrro  "," oRrrrrrrRo "," oRrrrrrrRo ",
 " odrrrrrrdo "," oddrrrrddo ","  odododo   ","   ojjjjo   ","   ojjjjo   ",
 "   oj  jo   ","   oj  jo   ","   oJ  Jo   ","  ozzo ozzo ","  oZZo oZZo "];
const DOG=["            oo  ","  o        offo ","  oo      offffo"," offoooooofffkfo",
 " offffffffffffwo"," offfffffffffffo"," oddffffffffddo ","  offo    offo  ","  oddo    oddo  "];


// ---------- musica: pasillo bogotano resintetizado (3/4, 132bpm, fa menor) ----------
// analisis del original: 132.5 BPM, melodia en fa menor natural. arreglo propio en chiptune.
// digitos base36 = semitonos sobre FA; '.' = silencio. 16 compases x 6 corcheas.
const MU={i:0,t:0,sp:60/132/2,g:null,tm:null,vol:.05,
 M:'55.5377788.5733.8852a7..8828a333885577aaccaa7.5.cc.caeeecc.ac88.aa7535..',
 B:'0057087000578570',
 nt(s,d,v,ty,w){const c=A.ctx,o=c.createOscillator(),g=c.createGain();
  o.type=ty;o.frequency.value=349.23*Math.pow(2,s/12);
  g.gain.setValueAtTime(0,w);g.gain.linearRampToValueAtTime(v,w+.014);
  g.gain.exponentialRampToValueAtTime(.0001,w+d);
  o.connect(g);g.connect(MU.g);o.start(w);o.stop(w+d+.03)},
 sch(w){const n=MU.M.length,s=MU.i%n,b=s%6,r=parseInt(MU.B[((s/6)|0)%16],36),mj=r>6,ch=MU.M[s];
  if(ch!=='.')MU.nt(parseInt(ch,36),MU.sp*1.7,.5,'square',w);       // melodia
  if(b===0)MU.nt(r-12,MU.sp*1.6,.9,'triangle',w);                   // bajo en el 1
  else if(b===2||b===4)[0,mj?4:3,7].forEach(o=>MU.nt(r+o,MU.sp*.55,.2,'square',w))},
 go(){A.init();if(!A.ctx||MU.tm)return;const c=A.ctx;
  MU.g=c.createGain();MU.g.gain.value=MU.vol;
  const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=1750;f.Q.value=.7;
  MU.g.connect(f);f.connect(c.destination);MU.t=c.currentTime+.15;
  MU.tm=setInterval(()=>{const now=A.ctx.currentTime;
   if(MU.t<now)MU.t=now+.05;                      // no acumular atraso: evita rafagas
   for(let k=0;k<12&&MU.t<now+.35;k++){MU.sch(MU.t);MU.t+=MU.sp;MU.i++}},70);
  window.addEventListener('keydown',e=>{if(e.key==='m'||e.key==='M'){
   MU.vol=MU.vol?0:.05;MU.g.gain.value=MU.vol}})}};

// ---------- fabrica de texturas: todo con Graphics.generateTexture ----------
class Boot extends Phaser.Scene{
 constructor(){super('Boot')}
 create(){
  const T=(k,w,h,fn)=>{const g=this.add.graphics();fn(g);g.generateTexture(k,w,h);g.destroy()};
  T('px',6,6,g=>{FS(g,0xffffff,1);FR(g,0,0,6,6)});
  T('drop',2,11,g=>{FS(g,0xcfe6f4,.9);FR(g,0,0,2,8);FS(g,0xffffff,.7);FR(g,0,0,1,4)});
  T('crt',6,3,g=>{FS(g,0x000000,.24);FR(g,0,2,6,1);FS(g,0x000000,.09);FR(g,0,1,6,1)});
  T('shd',34,12,g=>{FS(g,INK,.34);FE(g,17,6,32,10);FS(g,INK,.2);FE(g,17,6,34,12)});

  PAL.forEach((p,i)=>{
   // cielo bogotano: nublado, con bandas ditheradas
   T('sky'+i,W,SY+40,g=>{const hz=mix(p.sky,p.nt?0x40265e:0xf2e6cc,.6);
    FS(g,p.sky,1);FR(g,0,0,W,SY+40);
    for(let b=0;b<7;b++){FS(g,mix(p.sky,hz,b/7+.16));const dn=1+((b*3/7)|0),yy=80+b*26;
     for(let j=0;j<26;j+=2)for(let q=0;q<W;q+=2)if((((q>>1)+(j>>1))&3)<dn)FR(g,q,yy+j,2,2)}
    FS(g,hz,1);FR(g,0,262,W,30);
    if(!p.nt){const R=R1(31+i);for(let n=0;n<7;n++){const cx=R()*W,cy=20+R()*90,cw=90+R()*120;
     for(let k=0;k<5;k++){FS(g,mix(0xffffff,p.sky,.12+k*.1),.75);
      FE(g,cx+k*11-22,cy+(k&1?4:0),cw-k*14,26-k*3)}
     FS(g,mix(p.sky,INK,.14),.5);FE(g,cx,cy+11,cw-30,10)}}});
   // baldosa bogotana: suelta, ladeada, con tierra en la junta, musgo y hojas
   const TN=[[0x5e7050,.46],[0x8a6a48,.42],[0x54627e,.38],[0x33333c,.62],[0xcfc9b8,.34],[0x46584e,.54]];
   const bald=(k,mark,wet,vr)=>T(k,TS,TS,g=>{
    const R=R1(vr*911+i*67+13),tn=TN[vr%6],base=mix(mix(p.tl,INK,.16),tn[0],tn[1]);
    const dirt=mix(0x7d5c37,p.tl,.10);
    // tierra debajo de todo
    FS(g,dirt,1);FR(g,0,0,TS,TS);
    nz(g,0,0,TS,TS,mix(dirt,INK,.35),40,vr*7+i,.7);
    nz(g,0,0,TS,TS,mix(dirt,0xffffff,.26),30,vr*13+i,.6);
    nz(g,0,0,TS,TS,mix(dirt,INK,.5),18,vr*29+i,.5);
    // la losa: desplazada y con canto visible (unas hundidas, otras levantadas)
    const ox=1+((R()*5)|0),oy=1+((R()*5)|0),sw=TS-7-((R()*6)|0),sh=TS-7-((R()*5)|0),up=vr%2===0;
    FS(g,INK,.5);FR(g,ox-1,oy+3,sw+3,sh);                    // sombra proyectada
    FS(g,mix(base,INK,.45),1);FR(g,ox+1,oy+1,sw,sh);       // canto
    FS(g,base,1);FR(g,ox+1,oy+(up?0:2),sw,sh-2);           // cara
    const fy=oy+(up?0:2);
    // cuadricula 4x4 de la baldosa tradicional, con junta y luz
    const cw=(sw-2)/4,ch=(sh-4)/4;
    for(let a=0;a<4;a++)for(let b=0;b<4;b++){
     const c=mix(base,R()<.5?INK:0xffffff,R()*.09);
     FS(g,c,1);FR(g,ox+2+a*cw,fy+1+b*ch,cw-1,ch-1);
     FS(g,mix(c,0xffffff,.24),1);FR(g,ox+2+a*cw,fy+1+b*ch,cw-1,1);
     FS(g,mix(c,INK,.26),1);FR(g,ox+2+a*cw,fy+ch+b*ch-1,cw-1,1)}
    // agregado, musgo y manchas
    nz(g,ox+2,fy+1,sw-3,sh-5,mix(base,INK,.38),34,vr*23+i,.55);
    nz(g,ox+2,fy+1,sw-3,sh-5,mix(base,0xffffff,.3),18,vr*31+i,.45);
    if(vr%3===0){FS(g,0x5a7a4a,.45);FE(g,ox+8,fy+sh-8,13,7);
     nz(g,ox+3,fy+sh-13,16,10,0x6a8a4a,12,vr+2,.7)}
    if(vr%3===1){FS(g,mix(base,INK,.3),.5);FE(g,ox+30,fy+14,20,13)}
    if(vr>=3){crack(g,ox+5+((R()*12)|0),fy+2,30,mix(base,INK,.6),vr+i);
     FS(g,mix(base,INK,.55),1);FR(g,ox+2,fy+((R()*30)|0)+6,sw-4,1)}
    // luz de borde arriba
    FS(g,mix(base,0xffffff,.34),1);FR(g,ox+1,fy,sw,1);
    FS(g,mix(base,INK,.5),1);FR(g,ox+1,fy+sh-3,sw,2);
    // hojas caidas
    if(vr%2===1)for(let q=0;q<2;q++){const lx=3+((R()*38)|0),ly=4+((R()*38)|0);
     FS(g,[0xc9a24a,0xb8842a,0x9a6a2a][q%3],1);
     FE(g,lx,ly,6,3);FS(g,0x7a5420,1);FR(g,lx-3,ly,4,1)}
    if(wet){FS(g,0x6aa0c8,.26);FR(g,ox+1,fy,sw,sh-2);
     FS(g,0x1e3a4e,.45);FR(g,ox+2,fy+sh-9,sw-2,6);
     FS(g,0xeafaff,.9);FR(g,ox+sw-16,fy+sh-14,9,2);FR(g,ox+sw-14,fy+sh-11,4,1);
     FS(g,0xeafaff,.75);FR(g,ox+5,fy+8,5,2);FR(g,ox+15,fy+sh-20,4,2);
     FS(g,0xffffff,.6);FR(g,ox+sw-12,fy+9,3,1);FR(g,ox+8,fy+3,2,1)}
    if(mark){FS(g,0xe01f7c,1);FR(g,ox+2,fy+1,sw-2,sh-4);
     nz(g,ox+3,fy+2,sw-4,sh-6,0xff5aa0,30,i+9,.8);
     nz(g,ox+3,fy+2,sw-4,sh-6,0xa8145c,16,i+4,.5);
     FS(g,0xff7ab8,1);FR(g,ox+2,fy+1,sw-2,3);FR(g,ox+2,fy+1,3,sh-4);
     FS(g,0xa8145c,1);FR(g,ox+2,fy+sh-6,sw-2,3);
     LS(g,6,0x0e0a12,1);g.beginPath();g.moveTo(ox+8,fy+7);g.lineTo(ox+sw-6,fy+sh-9);
     g.moveTo(ox+sw-6,fy+7);g.lineTo(ox+8,fy+sh-9);g.strokePath();
     LS(g,2,0x4a3a42,.6);g.beginPath();g.moveTo(ox+8,fy+9);g.lineTo(ox+sw-8,fy+sh-9);g.strokePath()}});
   [0,1,2,3,4,5].forEach(v=>bald('t'+i+v,false,false,v));
   bald('tw'+i,false,true,2);bald('tx'+i,true,false,0);
   // fachadas: teja de barro, reja, zocalo, persiana, aviso, graffiti
   [0,1,2,3].forEach(v=>{const hh=[SY-52,SY-88,SY-66,SY-114][v],br=i>=2;
    T('f'+i+'_'+v,120,SY,g=>{const y0=SY-hh,R=R1(v*53+i*17+1),
      bc=[p.bd,mix(p.bd,0xf4f0e4,.5),mix(p.bd,0x2f6fb0,.34),mix(p.bd,0x9c4426,.38)][v];
     FS(g,bc,1);FR(g,0,y0+8,120,hh-8);
     nz(g,0,y0+10,120,hh-10,mix(bc,INK,.16),90,v*11+i,.5);
     nz(g,0,y0+10,120,hh-10,mix(bc,0xffffff,.12),50,v*23+i,.4);
     FS(g,mix(bc,INK,.22),.4);FE(g,20,y0+hh-70,40,60);FE(g,100,y0+30,34,40);
     if(br){for(let by=y0+14;by<SY-46;by+=7){const of=((by/7)|0)%2?0:12;
      for(let bx=-of;bx<120;bx+=24){const bk=mix(p.bd2,INK,R()*.22);
       FS(g,bk,1);FR(g,bx+1,by,22,6);
       FS(g,mix(bk,0xffffff,.2),1);FR(g,bx+1,by,22,1);
       FS(g,mix(bk,INK,.35),1);FR(g,bx+1,by+5,22,1)}}}
     else{for(let tx=0;tx<120;tx+=11){bev(g,tx,y0,12,10,mix(p.rf,INK,R()*.2),1);
       FS(g,mix(p.rf,0xffffff,.22),1);FR(g,tx+1,y0+1,3,8)}
      FS(g,mix(p.rf,INK,.45),1);FR(g,0,y0+10,120,3);
      FS(g,mix(bc,0xffffff,.18),1);FR(g,0,y0+13,120,3)}
     // ventanas con reja
     const wc=p.nt?0x1e1828:mix(p.ac,INK,.66);
     for(let a=0;a<3;a++)for(let b=0;b<(v===3?1:2);b++){
      const wx=13+a*38,wy=y0+30+b*54;if(wy+36>SY-48)continue;
      bev(g,wx-3,wy-3,28,34,mix(bc,0xffffff,.16),1);
      FS(g,wc,1);FR(g,wx,wy,22,28);
      if(p.nt&&((a+b+v)%3!==0)){FS(g,0xffd98a,1);FR(g,wx,wy,22,28);
       FS(g,0xfff4d0,1);FR(g,wx+1,wy+1,20,8);
       FS(g,0xd8a850,1);FR(g,wx+3,wy+18,7,10)}
      else{FS(g,mix(wc,0xdff2ff,.42),1);
       g.beginPath();g.moveTo(wx,wy);g.lineTo(wx+22,wy);g.lineTo(wx,wy+22);g.closePath();g.fillPath();
       FS(g,mix(wc,0xffffff,.6),.5);FR(g,wx+2,wy+2,8,2)}
      FS(g,mix(0x4a4a56,INK,.2),.75);
      for(let q=0;q<3;q++)FR(g,wx+4+q*7,wy,1,28);FR(g,wx,wy+13,22,1);
      FS(g,mix(bc,INK,.5),1);FR(g,wx-4,wy+29,30,3)}
     // zocalo + puerta/persiana + aviso + graffiti
     FS(g,mix(bc,INK,.42),1);FR(g,0,SY-48,120,5);
     bev(g,0,SY-44,120,44,mix(bc,INK,.24),2);
     if(v===1){bev(g,40,SY-40,44,40,0x5a6a78,2);
      FS(g,mix(0x5a6a78,INK,.35),1);for(let q=0;q<9;q++)FR(g,42,SY-38+q*4,40,2);
      FS(g,mix(0x5a6a78,0xffffff,.25),1);for(let q=0;q<9;q++)FR(g,42,SY-38+q*4,40,1)}
     else{bev(g,46,SY-40,32,40,mix(bc,INK,.55),2);
      FS(g,mix(bc,INK,.7),1);FR(g,50,SY-34,10,30);FR(g,63,SY-34,10,30);
      FS(g,0xd8b048,1);FR(g,60,SY-22,3,3)}
     if(v===0||v===2){bev(g,8,SY-40,30,13,v===0?TMR:0x1f7a4a,1);
      FS(g,WHT,1);FR(g,11,SY-36,24,2);FR(g,11,SY-32,16,2)}
     if(v===2||v===3){const gc=[0xff2d8a,0x2fd8c8,AMB][(v+i)%3];
      LS(g,3,gc,.95);g.beginPath();g.moveTo(84,SY-14);g.lineTo(90,SY-30);g.lineTo(96,SY-14);
      g.lineTo(102,SY-30);g.lineTo(108,SY-16);g.strokePath();
      LS(g,2,mix(gc,0xffffff,.5),.9);g.beginPath();g.moveTo(83,SY-20);g.lineTo(110,SY-22);g.strokePath()}
     // bajante y contador
     FS(g,mix(bc,INK,.5),1);FR(g,116,y0+14,3,hh-14);
     FS(g,mix(bc,INK,.3),1);FR(g,115,y0+40,5,3);FR(g,115,y0+90,5,3);
     bev(g,104,SY-70,12,14,GRY,1);FS(g,0x3a3a44,1);FR(g,107,SY-66,6,5)})});
   // cerros orientales: verdes, frondosos, con Monserrate arriba
   T('h'+i,W,150,g=>{
    const g1=p.nt?mix(p.hi,0x1a3a24,.4):mix(p.hi,0x62b04a,.52),
     g2=mix(g1,INK,.34),g3=mix(g1,0xa8e070,.42),g4=mix(g1,INK,.6),
     hz=p.nt?mix(p.hi,INK,.3):mix(g1,0xc8d8e0,.5);
    const sk=x=>62+Math.sin(x*.011)*26+Math.sin(x*.037)*12+Math.sin(x*.089)*5;
    // cordillera lejana con neblina
    FS(g,hz,1);g.beginPath();g.moveTo(0,150);
    for(let x=0;x<=W;x+=8)g.lineTo(x,sk(x)-16+Math.sin(x*.02)*6);g.lineTo(W,150);g.closePath();g.fillPath();
    // ladera principal
    FS(g,g2,1);g.beginPath();g.moveTo(0,150);
    for(let x=0;x<=W;x+=6)g.lineTo(x,sk(x));g.lineTo(W,150);g.closePath();g.fillPath();
    // masa de arboles: la textura frondosa
    const R=R1(41+i*7);
    for(let x=-6;x<W+6;x+=5){const y=sk(x);
     FS(g,g2,1);FC(g,x,y+3+R()*4,5+R()*4);
     FS(g,g1,1);FC(g,x+R()*4,y+5+R()*10,4+R()*4)}
    for(let x=-6;x<W+6;x+=7){const y=sk(x);
     FS(g,g3,.9);FC(g,x+R()*5,y+2+R()*6,3+R()*3)}
    for(let q=0;q<420;q++){const x=R()*W,y=sk(x)+8+R()*(150-sk(x));
     FS(g,R()<.5?g4:g1,.8);FC(g,x,y,2+R()*3)}
    for(let q=0;q<160;q++){const x=R()*W,y=sk(x)+14+R()*90;
     FS(g,g3,.55);FC(g,x,y,1+R()*2)}
    // quebradas
    for(let q=0;q<7;q++){const x=60+q*130;FS(g,g4,.5);
     for(let t=0;t<26;t++)FR(g,x+Math.sin(t*.4)*7,sk(x)+8+t*3,3,3)}
    // Monserrate: santuario blanco y la cruz
    const mx=300,my=sk(mx)|0;
    FS(g,g4,.4);FE(g,mx,my+4,44,12);
    bev(g,mx-10,my-14,22,15,0xeee8d8,1);
    FS(g,0xb04a3a,1);FR(g,mx-11,my-17,24,4);
    FS(g,0xf6f2e6,1);FR(g,mx-2,my-27,5,13);FR(g,mx-6,my-24,13,4);
    FS(g,0x8a8478,1);FR(g,mx-8,my-9,5,6);FR(g,mx+4,my-9,5,6);
    // el funicular
    LS(g,1,mix(g4,0xffffff,.35),.7);g.beginPath();g.moveTo(mx+6,my-4);g.lineTo(mx+92,150);g.strokePath()});
  });

  // ---- personajes desde strings de pixeles ----
  const per=(k,sh,jk,hr)=>T(k,26,42,g=>PX(g,FIG,{o:INK,h:hr||0x241c2a,s:0xd09468,k:INK,
   r:jk,R:mix(jk,0xffffff,.26),d:mix(jk,INK,.3),j:0x36445e,J:0x232d40,
   z:sh,Z:mix(sh,INK,.35)},2,1,1));
  per('p0',WHT,0x2f8fd8);per('p1',0xb9a48a,0x2f8fd8);per('p2',0x6b5a3f,0x2f8fd8);
  per('run',0xe8e8ee,0xc4342a,0x4a2a1a);per('run2',0xd8d8e0,0x2f7a52,0x1a1a22);
  T('dog',34,20,g=>PX(g,DOG,{o:INK,f:0x9a7a4d,d:0x74593a,k:0x1a1a20,w:WHT},2,0,1));
  T('umbP',38,24,g=>{FS(g,INK,1);FE(g,19,22,38,28);
   FS(g,0x1c2a4a,1);FE(g,19,21,34,24);
   FS(g,0x2f4a7a,1);FE(g,19,20,34,18);
   FS(g,0x4a6a9a,1);FE(g,13,18,12,10);
   FS(g,INK,1);FR(g,18,4,3,18);FS(g,0x8a6a45,1);FR(g,18,4,2,17)});
  T('bird',16,12,g=>PX(g,["   ooo  "," oowwwo ","ogwwwwwo"," ooowwo ","   oo o "],
   {o:INK,w:0x8a9098,g:0x5e646e},2,0,0));
  T('bici',48,44,g=>{LS(g,5,INK,1);g.strokeCircle(11,34,9);g.strokeCircle(37,34,9);
   LS(g,2,0x6a6a74,1);g.strokeCircle(11,34,9);g.strokeCircle(37,34,9);
   LS(g,5,INK,1);g.beginPath();g.moveTo(11,34);g.lineTo(24,20);g.lineTo(37,34);g.moveTo(24,20);g.lineTo(32,20);g.strokePath();
   LS(g,2,0x2fd89a,1);g.beginPath();g.moveTo(11,34);g.lineTo(24,20);g.lineTo(37,34);g.strokePath();
   FS(g,0xf0a020);FR(g,18,6,13,14);FS(g,0xd09468);FR(g,20,1,9,7)});
  // articulado
  T('bus',300,90,g=>{const R=TMR;
   bev(g,0,10,141,66,R,2);bev(g,159,10,141,66,R,2);
   FS(g,0x22222c,1);FR(g,139,18,22,54);
   FS(g,0x32323e,1);for(let q=0;q<7;q++)FR(g,139,20+q*8,22,4);
   for(let q=0;q<4;q++){bev(g,12+q*32,22,26,24,0x1a2432,1);bev(g,170+q*32,22,26,24,0x1a2432,1);
    FS(g,0x4a6a8a,.5);FR(g,13+q*32,23,10,10);FR(g,171+q*32,23,10,10)}
   FS(g,WHT,1);FR(g,0,58,300,7);
   FS(g,0xc8c8d0,1);FR(g,0,64,300,2);
   FS(g,mix(R,0xffffff,.3),1);FR(g,2,12,296,3);
   FS(g,0x22222c,1);FR(g,60,20,42,3);
   FS(g,INK,1);FC(g,34,82,11);FC(g,112,82,11);FC(g,200,82,11);FC(g,272,82,11);
   FS(g,0x3a3a44,1);FC(g,34,81,7);FC(g,112,81,7);FC(g,200,81,7);FC(g,272,81,7);
   FS(g,0x6a6a74,1);FC(g,34,81,3);FC(g,112,81,3);FC(g,200,81,3);FC(g,272,81,3);
   FS(g,AMB,1);FR(g,290,30,10,12);FS(g,0xfff0b0,1);FR(g,292,32,6,8);
   // letrero de destino
   bev(g,232,16,62,14,0x14141c,1);FS(g,0xffb020,1);
   [0,5,10,17,22,29,34,41,46,51].forEach((o,q)=>FR(g,236+o,20,q%3===2?2:3,6));
   FS(g,WHT,1);FR(g,160,30,64,3);FR(g,166,36,52,2)});
  T('coin',20,20,g=>{FS(g,INK,1);FC(g,10,10,10);FS(g,0xa9781c,1);FC(g,10,10,9);
   FS(g,0xd8a12a,1);FC(g,10,10,7.5);FS(g,0xf7d465,1);FC(g,10,9,6);
   FS(g,0xfff4c0,1);FR(g,5,4,4,2);FR(g,4,6,2,3);
   FS(g,0xa9781c,1);FR(g,7,8,6,1);FR(g,7,11,6,1)});
  // obstaculos: la infraestructura es la antagonista
  T('obra',58,56,g=>{bev(g,1,15,56,26,0xf07a1a,1);
   for(let q=0;q<4;q++){FS(g,WHT,1);FR(g,4+q*14,17,7,22)}
   bev(g,3,41,6,14,0x8a8a94,1);bev(g,49,41,6,14,0x8a8a94,1);
   bev(g,1,8,56,6,AMB,1);FS(g,0x8a6a10,1);FR(g,2,12,54,1)});
  T('moto',52,38,g=>{FS(g,INK,1);FC(g,12,28,9);FC(g,40,28,9);
   FS(g,0x2a2a34,1);FC(g,12,28,7);FC(g,40,28,7);
   FS(g,0x6a6a74,1);FC(g,12,28,3);FC(g,40,28,3);
   bev(g,15,14,23,10,0x2a6ab0,1);bev(g,21,8,14,7,0x1c1c26,1);
   bev(g,7,18,9,6,0xd8342a,1);FS(g,0x8a8a94,1);FR(g,36,10,4,12);FR(g,33,9,12,3);
   FS(g,AMB,1);FR(g,44,16,4,4)});
  T('caneca',34,44,g=>{bev(g,3,8,28,34,0x2f8a52,2);
   FS(g,0x1f6a3a,1);for(let q=0;q<5;q++)FR(g,6,12+q*6,22,2);
   bev(g,1,2,32,7,0x257a44,1);nz(g,5,10,24,30,0x1a5a30,22,8,.5);});
  T('bolardo',30,50,g=>{bev(g,5,8,20,40,0xa8a8b4,2);
   FS(g,0xdcdce6,1);FR(g,7,10,16,4);
   bev(g,5,22,20,7,TMR,1);FS(g,0x8a1a12,1);FR(g,6,28,18,1);
   nz(g,7,12,16,34,0x74747e,16,4,.6);FS(g,0x6a6a74,1);FR(g,3,46,24,3)});
  // props de acera: poste con marana de cables, arbol, telefono, hidrante, matera
  T('poste',22,150,g=>{bev(g,7,10,8,140,0x7a7a84,1);
   FS(g,0x5a5a64,1);for(let q=0;q<9;q++)FR(g,8,20+q*15,6,2);
   bev(g,2,6,18,6,0x6a6a74,1);FS(g,0x2a2a34,1);FR(g,0,2,22,5);
   FS(g,0xffe8a0,.9);FR(g,3,7,16,3);
   bev(g,1,40,20,14,0x3a3a44,1);FS(g,0x6a6a74,1);FR(g,3,43,16,3);
   LS(g,2,0x22222c,1);for(let q=0;q<7;q++){g.beginPath();
    g.moveTo(0,58+q*4);g.lineTo(11,62+q*5);g.lineTo(22,56+q*4);g.strokePath()}});
  T('arbol',86,140,g=>{bev(g,36,70,14,70,0x6b4f34,2);
   FS(g,0x54402a,1);FR(g,38,80,3,58);FR(g,46,92,3,44);
   const R=R1(77);for(let q=0;q<16;q++){const bx=10+R()*66,by=8+R()*66;
    FS(g,mix(0x2f6b34,INK,.25),1);FC(g,bx,by,15)}
   for(let q=0;q<14;q++){const bx=12+R()*62,by=8+R()*58;
    FS(g,0x3f8a3e,1);FC(g,bx,by,13)}
});
  T('sumidero',TS,20,g=>{bev(g,0,0,TS,18,0x3a3a44,1);
   FS(g,0x1a1a22,1);for(let q=0;q<5;q++)FR(g,4+q*9,3,5,12);
   FS(g,0x5e5e68,1);for(let q=0;q<5;q++)FR(g,4+q*9,3,5,1);
   nz(g,1,1,TS-2,16,0x22222c,16,3,.6)});
  // estacion: plataforma elevada, el unico piso seco cuando se inunda
  T('est',156,200,g=>{bev(g,0,152,156,46,0xb0b4bc,2);
   FS(g,0xf4f8ff,.25);g.beginPath();g.moveTo(10,44);g.lineTo(80,44);g.lineTo(10,120);g.closePath();g.fillPath();
   bev(g,0,0,156,44,TMR,2);bev(g,0,142,156,12,TMR,1);
   FS(g,WHT,1);FR(g,14,12,128,21);
   FS(g,TMR,1);FR(g,17,16,3,13);FR(g,22,16,3,13);FR(g,27,16,10,4);
   for(let q=0;q<7;q++)FR(g,42+q*13,16,9,13);
   bev(g,60,58,34,94,TMR,2);bev(g,52,96,50,9,GRY,1)});
  T('torn',48,66,g=>{bev(g,1,22,46,42,GRY,2);bev(g,1,12,46,11,TMR,1);
   FS(g,0xdcdce6,1);FR(g,7,32,34,5);FR(g,7,45,34,5);
   FS(g,0x2fd86a,1);FR(g,38,16,5,4);nz(g,3,24,42,38,0x6a6a74,20,7,.5)});
  const ic=(k,fn)=>T(k,42,42,fn);
  ic('i_bota',g=>{bev(g,14,5,14,22,AMB,1);bev(g,5,26,25,10,AMB,1);
   FS(g,0x8a6a10,1);FR(g,6,27,23,2);bev(g,5,35,25,5,0x2a2a32,1);
   FS(g,0xfff0b0,1);FR(g,16,7,4,18)});
  ic('i_umb',g=>{FS(g,INK,1);FE(g,21,26,36,26);FS(g,0x2f6fd8,1);FE(g,21,25,32,22);
   FS(g,0x5a9aff,1);FE(g,15,22,12,10);FS(g,0x3a3a4a,1);FR(g,20,23,3,16)});
  ic('i_pan',g=>{FS(g,INK,1);FE(g,21,23,34,24);FS(g,0xb8823c,1);FE(g,21,23,31,21);
   FS(g,0xd9a55c,1);FE(g,21,21,28,17);FS(g,0xf0c98a,1);FE(g,20,19,20,10);
   FS(g,0xb8823c,1);FR(g,11,22,20,2);FR(g,14,26,14,2)});
  ic('i_tinto',g=>{bev(g,12,13,19,22,WHT,1);FS(g,0x4a2a14,1);FR(g,14,15,15,5);
   FS(g,0x6a4020,1);FR(g,14,15,15,2);bev(g,9,33,25,5,0xdcdce6,1);
   FS(g,0xd8d8e0,.7);FR(g,24,20,3,10)});
  ic('i_ruana',g=>{bev(g,9,9,25,26,0x8a4a3a,1);FS(g,0xd8c8a8,1);FR(g,10,17,23,4);FR(g,10,27,23,4);
   FS(g,0x6a3428,1);FR(g,20,10,3,24);
   for(let q=0;q<6;q++)FR(g,11+q*4,34,2,4)});
  T('colp',58,200,g=>{bev(g,1,1,56,198,0x1a1a24,2);
   FS(g,0x2a2a36,1);FR(g,3,1,52,8);});
  this.scene.start('Title')}}

// ---------- estado global ----------
const S={lv:0,score:0,lives:3,coins:0,it:{bota:0,umb:0,tinto:0,pan:0,ruana:0},tmUsed:0,dry:0};
const reset=()=>{S.lv=0;S.score=0;S.lives=3;S.coins=0;S.tmUsed=0;S.dry=0;
 S.it={bota:0,umb:0,tinto:0,pan:0,ruana:0}};
const LV=[
 // una regla nueva por nivel: nada de abrumar con todo de una
 {len:56,t:72,rain:0,  dogs:0,fl:0,est:0,ped:0,  bk:0, bird:0,bus:0,spl:.21,hid:.3,zz:.15,pad:1,
  tip:'las baldosas con X rosada salpican. las que nadie marco, solo brillan.'},
 {len:68,t:78,rain:.14,dogs:0,fl:0,est:0,ped:.22,bk:.3,bird:2,bus:0,spl:.18,hid:.42,zz:.21,pad:0,ic:'run',sc:1.3,
  tip:'la gente va con afan: si te choca, te corre de fila.'},
 {len:80,t:84,rain:.55,dogs:0,fl:0,est:2,ped:.24,bk:.4,bird:1,bus:1,spl:.25,hid:.55,zz:.28,pad:0,ic:'bus',sc:.46,
  tip:'ya llueve. el articulado salpica si vas pegado al sardinel.'},
 {len:88,t:88,rain:.5, dogs:2,fl:0,est:1,ped:.26,bk:.5,bird:1,bus:1,spl:.31,hid:.68,zz:.35,pad:0,ic:'dog',sc:1.4,
  tip:'perros sueltos: corres sin poder leer el piso. [E] tirale pan.'},
 {len:100,t:98,rain:1, dogs:2,fl:2,est:2,ped:.32,bk:.9,bird:2,bus:1,spl:.38,hid:.8,zz:.42,pad:0,ic:'bolardo',sc:1.2,
  tip:'hora pico y se inunda: bolardos, botas o TransMilenio.'}];
// tipos de celda: 0 seca | 1 escupidora MARCADA | 2 escupidora OCULTA | 3 bloqueada | 5 via alta
function rnd(s){return()=>{s=s*1664525+1013904223&0x7fffffff;return s/0x7fffffff}}
function gen(i){
 const c=LV[i],R=rnd(9781+i*613),N=c.len,cell=[],dec=[];
 for(let x=0;x<N;x++){cell.push([0,0,0,0])}
 // zonas inundables + estacion antes de cada una
 const fl=[],est=[];let cur=14;
 for(let k=0;k<c.fl;k++){const L=5+((R()*3)|0);if(cur+L+8>N)break;fl.push([cur,cur+L-1]);
  est.push(cur-4);cur+=L+16}
 for(let k=est.length;k<c.est;k++){const x=(18+R()*(N-30))|0;if(!est.some(e=>Math.abs(e-x)<10))est.push(x)}
 // baldosas escupidoras y obstaculos
 // camino seguro garantizado: siempre existe una ruta sin mojarse.
 // se protege la fila del camino Y la de la transicion, para poder cambiar de fila en seco.
 const sf=[];let sr=2;
 for(let x=0;x<N;x++){if(x>5&&R()<c.zz)sr=Phaser.Math.Clamp(sr+(R()<.5?-1:1),0,ROWS-1);sf.push(sr)}
 for(let x=6;x<N-3;x++){
  if(fl.some(f=>x>=f[0]-1&&x<=f[1]+1))continue;
  const a=sf[x],b=sf[x+1]===undefined?a:sf[x+1];
  for(let r=0;r<ROWS;r++){
   if(r===a||r===b)continue;                          // el camino nunca se moja
   if(c.pad&&Math.abs(r-a)<2&&R()<.55)continue;       // margen de perdon en los primeros tramos
   const q=R();
   if(q<c.spl*(1-c.hid))cell[x][r]=1;                 // marcada: la ves
   else if(q<c.spl)cell[x][r]=2;                      // sin marcar: solo el brillo
   else if(q<c.spl+.05)cell[x][r]=3}}                 // obstaculo
 // via alta dentro de la inundacion: camino de bolardos transitable
 fl.forEach(f=>{let r=1+((R()*2)|0),hold=0;
  for(let x=f[0];x<=f[1];x++){cell[x]=[9,9,9,9];      // 9 = agua
   if(hold<=0&&x>f[0]&&x<f[1]){const nr=Phaser.Math.Clamp(r+(R()<.5?-1:1),0,ROWS-1);
    if(nr!==r){cell[x][r]=5;cell[x][nr]=5;r=nr;hold=2}}
   cell[x][r]=5;hold--}
  cell[f[0]][r]=5;cell[f[1]][r]=5});
 est.forEach(x=>{if(x>2&&x<N-6){cell[x]=[0,0,0,0];cell[x+1]=[0,0,0,0]}});
 // monedas
 const co=[];for(let x=8;x<N-2;x++)for(let r=0;r<ROWS;r++)
  if(cell[x][r]===0&&R()<.055)co.push({x,r,got:false});
 // perros: aparecen antes de decisiones duras
 const dogs=[];for(let k=0;k<c.dogs;k++){const at=fl[k]?fl[k][0]-11:(20+((N-34)*R())|0);
  if(at>8)dogs.push({at,used:false})}
 return{N,cell,fl,est,co,dogs,cfg:c}}

// ---------- escena de juego ----------
class Play extends Phaser.Scene{
 constructor(){super('Play')}
 create(){
  const p=PAL[S.lv],M=this.M=gen(S.lv),WW=M.N*TS;this.p=p;this.WW=WW;
  this.pc=2;this.pr=2;this.wet=0;this.afan=M.cfg.t;this.racha=0;this.mode='walk';
  this.rain=0;this.tsec=0;this.cool=0;this.dwell=0;this.dog=null;this.umb=0;this.inv=0;
  this.botaUse=S.it.bota*2;this.ck=2;this.msg=null;
  // Phaser reusa la instancia entre tramos: soltar lo cacheado o quedan referencias muertas
  this.ov=this.dogS=this.dogSh=this.vg=this.bf=null;this.dogCd=this.dash=0;

  // fondo
  this.add.image(0,0,'sky'+S.lv).setOrigin(0).setScrollFactor(0);
  if(p.nt)for(let i=0;i<60;i++)this.add.rectangle((Math.random()*W)|0,(Math.random()*150)|0,2,2,0xffffff,Math.random()*.7+.2).setScrollFactor(0);
  this.add.image(0,-6,'h'+S.lv).setOrigin(0).setScrollFactor(.14).setAlpha(.92);
  this.add.image(-260,52,'h'+S.lv).setOrigin(0).setScrollFactor(.32).setAlpha(.9);
  if(p.nt){const t=this.add.image(700,26,'colp').setOrigin(0).setScrollFactor(.34);
   this.colw=[];for(let r=0;r<22;r++)for(let c=0;c<5;c++){
    const w=this.add.rectangle(704+c*10,32+r*8,7,5,0x33ff88).setOrigin(0).setScrollFactor(.34);this.colw.push(w)}}
  for(let x=0,v=0;x<WW+120;x+=120,v++)this.add.image(x,0,'f'+S.lv+'_'+([0,2,1,3,0,1,2,3][v%8])).setOrigin(0).setDepth(1);
  // calle + carril rojo TM
  this.add.rectangle(0,CURB,WW,H-CURB,p.st).setOrigin(0).setDepth(1);
  this.add.rectangle(0,CURB,WW,12,mix(p.tl,0x000000,.3)).setOrigin(0).setDepth(2);
  this.add.rectangle(0,CURB+26,WW,52,mix(0xc4231a,0x000000,.55)).setOrigin(0).setDepth(1);
  for(let x=0;x<WW;x+=70)this.add.rectangle(x,CURB+50,36,4,0xf0f0f0,.5).setOrigin(0).setDepth(2);

  // baldosas
  this.tl=[];
  for(let c=0;c<M.N;c++){this.tl.push([]);
   for(let r=0;r<ROWS;r++){const v=M.cell[c][r],q=(c*131+r*57+c*r*7)%6,
     k=v===1?'tx'+S.lv:v===2?'tw'+S.lv:'t'+S.lv+q;
    const im=this.add.image(c*TS+TS/2,SY+r*TS+TS/2,k).setDepth(2);this.tl[c].push(im);

    if(v===3){const ob=['obra','moto','caneca'][(c*3+r)%3];
     this.add.image(c*TS+TS/2,SY+r*TS+TS/2+6,ob).setOrigin(.5,.82).setDepth(11+r)}
    if(v===5)this.add.image(c*TS+TS/2,SY+r*TS+TS/2+8,'bolardo').setOrigin(.5,.8).setDepth(11+r)}}
  // props de acera: la ciudad como decorado denso
  const pst=[];
  for(let x=180;x<WW;x+=340){this.add.image(x,SY+5,'poste').setOrigin(.5,1).setDepth(3).setScale(1,1.35);pst.push(x)}
  for(let x=350;x<WW;x+=470)this.add.image(x,SY+7,'arbol').setOrigin(.5,1).setDepth(3);
  const pr=['caneca'];
  for(let x=260;x<WW;x+=210)this.add.image(x,CURB+30,'caneca').setOrigin(.5,1).setDepth(8);
  // marana de cables: arriba, sobre las fachadas
  const cg=this.add.graphics().setDepth(2);
  for(let i=0;i<pst.length-1;i++){const x0=pst[i],x1=pst[i+1];
   for(let w=0;w<4;w++){LS(cg,2,0x14101c,.8);cg.beginPath();cg.moveTo(x0,26+w*9);
    for(let t=0;t<=8;t++){const u=t/8;cg.lineTo(x0+(x1-x0)*u,26+w*9+Math.sin(u*Math.PI)*(11+w*5))}
    cg.strokePath()}}
  // sumideros y agua
  this.sum=[];M.fl.forEach(f=>{for(let c=f[0];c<=f[1];c++)
   this.sum.push(this.add.image(c*TS,CURB-16,'sumidero').setOrigin(0).setDepth(3))});
  this.wg=this.add.graphics().setDepth(9);
  // estaciones
  M.est.forEach(c=>{this.add.image(c*TS-12,SY-116,'est').setOrigin(0).setDepth(3).setAlpha(.95);
   this.add.image(c*TS+TS/2+18,SY+TS*2+18,'torn').setOrigin(.5,.8).setDepth(12);
   this.add.text(c*TS+2,SY-104,'TRANSMILENIO',{fontFamily:'monospace',fontSize:'13px',color:'#c4231a'}).setDepth(4)});
  // monedas
  this.cn=M.co.map(o=>{const s=this.add.image(o.x*TS+TS/2,SY+o.r*TS+TS/2-8,'coin').setDepth(8);
   this.tweens.add({targets:s,y:s.y-5,duration:520,yoyo:true,repeat:-1,ease:'Sine.inOut'});return{o,s}});
  // jugador
  this.mk=this.add.ellipse(0,0,34,12,AMB,.4).setDepth(28);
  this.sh=this.add.image(0,0,'shd').setDepth(29).setAlpha(.75);
  this.pl=this.add.image(0,0,'p0').setOrigin(.5,.78).setDepth(30);
  this.up=this.add.image(0,0,'umbP').setOrigin(.5,1).setDepth(31).setVisible(false);
  this.place();
  // lluvia
  this.rn=this.add.particles(0,-20,'drop',{x:{min:0,max:W},lifespan:900,speedY:{min:520,max:700},
   speedX:{min:-90,max:-40},quantity:3,frequency:40,scale:{min:.6,max:1.2},alpha:{start:.7,end:.2}})
   .setScrollFactor(0).setDepth(40);this.rn.stop();
  this.spl=this.add.particles(0,0,'px',{lifespan:520,speed:{min:60,max:210},angle:{min:200,max:340},
   gravityY:620,scale:{start:.9,end:0},tint:0x9fd8f2,emitting:false}).setDepth(35);
  // gente
  this.ent=[];this.bus=null;this.busT=3;
  // camara
  this.cameras.main.setBounds(0,0,WW,H).startFollow(this.pl,false,.14,0).setFollowOffset(-W*.16,0);
  this.cameras.main.setScroll(0,0);
  this.hud();this.keys();crt(this);
  if(S.lv){this.tp.destroy();this.tpb.destroy();this.brief()}
  else{this.flash('  '+p.n+'  ','#ffffff');this.tp.setText(M.cfg.tip);
   this.tweens.add({targets:[this.tp,this.tpb],alpha:0,duration:1400,delay:4200})}}

 keys(){const k=this.input.keyboard;this.cur=k.createCursorKeys();
  this.k=k.addKeys('W,A,S,D');k.on('keydown',()=>A.init());
  k.on('keydown-ENTER',()=>{if(this.atE&&this.mode==='walk')this.board()});
  k.on('keydown-SPACE',()=>{if(this.mode!=='walk'||S.it.umb<1||this.umb>0)return;
   S.it.umb--;this.umb=20000;this.up.setVisible(true);this.flash('PARAGUAS 20s','#4aa8e0');A.gate()});
  k.on('keydown-SHIFT',()=>{if(this.mode!=='walk'||S.it.tinto<1)return;
   S.it.tinto--;this.dash=2800;this.flash('TINTO! rapido','#c98b62');A.buy()});
  k.on('keydown-E',()=>{if(this.mode!=='walk'||S.it.pan<1||!this.dog)return;S.it.pan--;
   const pn=this.add.image(this.pl.x-20,this.pl.y-20,'i_pan').setDepth(33);
   this.tweens.add({targets:pn,x:this.dogS.x,y:this.dogS.y-10,duration:380,onComplete:()=>pn.destroy()});
   this.dogOff('LE TIRASTE EL PAN','#d9a55c')})}

 hud(){const T=(x,y,s,c,sz)=>SD(TT(this,x,y,s,c||'#fff',sz||14),60);
  const hg=this.add.graphics().setScrollFactor(0).setDepth(59);
  bev(hg,-4,-6,W+8,52,0x2e2740,2);
  FS(hg,0x171326,1);FR(hg,0,0,W,3);
  bev(hg,10,18,184,18,0x120f1e,2);bev(hg,208,18,154,18,0x120f1e,2);
  hg.fillStyle(0x241f36,1);hg.fillRect(668,2,2,40);hg.fillRect(478,2,2,40);
  FS(hg,0x4a3f6a,1);FR(hg,0,42,W,2);
  T(12,3,'ZAPATOS',CB,12);
  this.wb=this.add.rectangle(13,21,178,12,0x4aa8e0).setOrigin(0).setScrollFactor(0).setDepth(61);
  T(210,3,'AFAN',CY,12);
  this.ab=this.add.rectangle(211,21,148,12,AMB).setOrigin(0).setScrollFactor(0).setDepth(61);
  this.rt=T(370,14,'',CG,13);
  this.st=T(486,3,'','#ffffff',15);
  this.lt=T(486,25,'',CR,12);
  this.it=T(676,5,'',CW,11);
  this.mt=T(676,25,'',CY,11);
  const mw=210,mh=22,mx=W-mw-14,my=H-mh-14,M=this.M;
  const mg=this.add.graphics().setScrollFactor(0).setDepth(60);
  bev(mg,mx-5,my-16,mw+10,mh+21,0x2e2740,2);
  FS(mg,0x120f1e,1);FR(mg,mx,my,mw,mh);
  M.fl.forEach(f=>{FS(mg,0x2a5f8a,1);
   FR(mg,mx+mw*f[0]/M.N,my+2,mw*(f[1]-f[0]+1)/M.N,mh-4)});
  M.est.forEach(c=>{FS(mg,TMR,1);FR(mg,mx+mw*c/M.N-2,my,4,mh)});
  FS(mg,0x2fd86a,1);FR(mg,mx+mw-3,my,3,mh);
  T(mx,my-15,'TRAMO',CS,10);
  T(mx+58,my-15,'estacion',CR,10);T(mx+128,my-15,'inundable','#4aa8e0',10);
  this.mmx=mx;this.mmw=mw;this.mmy=my;this.mmh=mh;
  this.mm=this.add.rectangle(mx,my+1,4,mh-2,AMB).setOrigin(0).setScrollFactor(0).setDepth(61);
  this.big=T(W/2,182,'','#fff',30).setOrigin(.5).setAlpha(0);
  this.tpb=this.add.rectangle(W/2,232,W,26,0x14101c,.82).setScrollFactor(0).setDepth(61);
  this.tp=T(W/2,224,'',CY,14).setOrigin(.5);
  this.pr2=T(W/2,300,'','#fff',15).setOrigin(.5).setVisible(false).setDepth(62);}

 flash(s,c){this.big.setText(s).setColor(c||'#fff').setAlpha(1);
  this.tweens.add({targets:this.big,alpha:0,duration:1600,delay:700})}

 place(){this.pl.x=this.pc*TS+TS/2;this.pl.y=SY+this.pr*TS+TS/2+8;this.pl.setDepth(30+this.pr);
  this.mk.x=this.pl.x;this.mk.y=this.pl.y+10;this.sh.x=this.pl.x;this.sh.y=this.pl.y+9;
  this.up.x=this.pl.x;this.up.y=this.pl.y-40}

 fst(){return this.rain>=.72?2:this.rain>=.40?1:0}          // estado de inundacion
 inFl(c){return this.M.fl.some(f=>c>=f[0]&&c<=f[1])}

 move(dx,dy){
  const nc=Phaser.Math.Clamp(this.pc+dx,0,this.M.N-1),nr=Phaser.Math.Clamp(this.pr+dy,0,ROWS-1);
  if(nc===this.pc&&nr===this.pr)return;
  const v=this.M.cell[nc][nr];
  if(v===3)return;                                          // bloqueado
  const fs=this.fst();
  if(v===9&&fs===2&&!S.it.bota){this.pc=nc;this.pr=nr;this.place();return this.drown()}
  let d=130;
  if(v===9&&fs===2)d=270;                                   // vadeando con botas
  if(this.dash>0)d=78;
  this.pc=nc;this.pr=nr;this.cool=d;this.dwell=0;this.moves=(this.moves||0)+1;
  this.tweens.add({targets:this.pl,x:nc*TS+TS/2,y:SY+nr*TS+TS/2+8,duration:d,ease:'Quad.out'});
  this.tweens.add({targets:this.pl,scaleY:.9,duration:d/2,yoyo:true});
  this.pl.setDepth(30+nr);A.hop();
  this.land(nc,nr,v,fs)}

 land(c,r,v,fs){
  const x=c*TS+TS/2,y=SY+r*TS+TS/2;
  if(v===1||v===2){this.soak(v===1?15:18);this.spl.emitParticleAt(x,y+10,14);
   this.flash(v===1?'!SALPICON!':'!ESA NO ESTABA MARCADA!',CB);return}
  if(v===9&&fs===1){this.soak(10);this.spl.emitParticleAt(x,y+10,8);return}
  if(v===9&&fs===2){this.soak(7);this.spl.emitParticleAt(x,y+10,10);return}
  if(v===5){this.racha++;this.add2(24)}                      // via alta: el mejor puntaje
  else{this.racha++;S.dry++;this.add2(10)}}

 add2(n){const m=Math.min(5,1+((this.racha/8)|0))*(this.dog?2:1);S.score+=n*m;
  this.rt.setText('RACHA '+this.racha+' x'+m)}

 soak(n){if(this.inv>0)return;
  if(this.botaUse>=1&&n<=18){this.botaUse--;this.flash('BOTAS',CY);A.gate();return}
  this.wet=Math.min(100,this.wet+n);this.racha=0;A.splash();
  this.cameras.main.shake(120,.006);
  if(this.wet>=100)this.lose('LLEGASTE CON LOS PIES EMPAPADOS')}

 drown(){this.spl.emitParticleAt(this.pl.x,this.pl.y,30);A.splash();
  this.cameras.main.shake(300,.012);this.wet=Math.min(100,this.wet+55);
  this.lose('TE METISTE AL AGUA SIN BOTAS')}

 lose(txt){if(this.mode==='dead')return;this.mode='dead';S.lives--;A.die();
  this.pr2.setVisible(false);this.big.setText(txt).setColor(CR).setAlpha(1).setFontSize(22);
  this.time.delayedCall(1700,()=>{
   if(S.lives<=0)this.scene.start('Over');
   else{this.mode='walk';this.big.setAlpha(0).setFontSize(30);this.pc=this.ck;this.pr=1;
    this.wet=32;this.inv=1800;this.dog=null;this.dogS&&this.dogS.setVisible(false);this.dogSh&&this.dogSh.setVisible(false);
    this.afan=Math.max(this.afan,22);this.place();this.flash('VIDAS: '+S.lives,CR)}})}

 winLv(){if(this.mode==='end')return;this.mode='end';A.win();
  const b=((100-this.wet)*4|0)+(this.afan*6|0);S.score+=b;
  this.big.setText('LLEGASTE\n+'+b+' zapatos secos').setColor(CG).setAlpha(1).setFontSize(24);
  this.time.delayedCall(2100,()=>{S.lv++;this.scene.start(S.lv>=LV.length?'Over':'Shop')})}

 // ---------- perro callejero: te quita la calma para leer el anden ----------
 dogGo(){const d=this.M.dogs.find(o=>!o.used&&this.pc>=o.at);if(!d)return;d.used=true;
  this.dog={x:this.pl.x-300,g:this.moves||0};A.bark();
  if(!this.dogS){this.dogSh=this.add.image(0,0,'shd').setDepth(28).setAlpha(.6);
   this.dogS=this.add.image(0,0,'dog').setOrigin(.5,.85).setDepth(29)}
  this.dogS.setVisible(true);this.dogSh.setVisible(true);this.flash('!PERRO SUELTO!','#ff9a3d');
  this.vg=this.vg||this.add.rectangle(W/2,H/2,W,H,0xff2a2a,0).setScrollFactor(0).setDepth(50);
  this.tweens.add({targets:this.vg,fillAlpha:.13,duration:400});
  // el rastro de monedas mas denso del juego: el perro es una apuesta
  for(let i=3;i<11;i++){const c=this.pc+i*2,r=Phaser.Math.Clamp(this.pr+((i%3)-1),0,ROWS-1);
   if(c<this.M.N&&this.M.cell[c][r]===0){const o={x:c,r,got:false};
    this.cn.push({o,s:this.add.image(c*TS+TS/2,SY+r*TS+TS/2-8,'coin').setDepth(8)})}}}

 dogOff(t,c){this.dog=null;this.dogCd=9;this.dogS&&this.dogS.setVisible(false);this.dogSh&&this.dogSh.setVisible(false);
  if(this.vg)this.tweens.add({targets:this.vg,fillAlpha:0,duration:300});
  this.flash(t,c||CG);S.score+=180;A.win()}

 dogUp(d){const g=this.dog;if(!g)return;
  const fast=this.dwell>.32;g.x+=(fast?235:58)*d;
  this.dogS.x=g.x;this.dogS.y=Phaser.Math.Linear(this.dogS.y||this.pl.y,this.pl.y,.12);
  this.dogS.setDepth(29);this.dogSh.x=g.x;this.dogSh.y=this.dogS.y+3;
  if((this.moves||0)-g.g>24)return this.dogOff('EL PERRO SE ABURRIO');
  const v=this.M.cell[this.pc][this.pr],fs=this.fst();
  if((v===9&&fs>=1)||v===5&&fs>=1)return this.dogOff('EL PERRO NO SE METE AL AGUA',CB);
  if(g.x>this.pl.x-22){A.bark();A.hurt();this.soak(30);this.cameras.main.shake(220,.01);
   g.x=this.pl.x-270;this.pc=Math.max(0,this.pc-2);this.place();this.flash('!TE MORDIO!',CR)}}

 // ---------- gente en el anden ----------
 sp(d){const cf=this.M.cfg;if(!cf.ped)return;const sc=this.cameras.main.scrollX;
  this.et=(this.et||0)-d;
  if(this.et<=0){this.et=Phaser.Math.FloatBetween(.5,1.4)/(.4+cf.ped*2);
   const r=(Math.random()*ROWS)|0,back=Math.random()<.3;
   const k=Math.random()<cf.bk*.35?'bici':(Math.random()<.5?'run':'run2'),
    sp=k==='bici'?-250:(back?52:-Phaser.Math.Between(95,190)),
    x0=back?sc-60:sc+W+60,y0=SY+r*TS+TS/2+8;
   const sd=this.add.image(x0,y0+9,'shd').setDepth(11+r).setAlpha(.6).setScale(.85);
   const s=this.add.image(x0,y0,k).setOrigin(.5,.82).setDepth(12+r);
   if(back)s.setFlipX(true);this.ent.push({s,sd,r,sp:back?Math.abs(sp):sp,k})}
  for(let i=this.ent.length-1;i>=0;i--){const e=this.ent[i];e.s.x+=e.sp*d;e.sd.x=e.s.x;
   if(e.k==='bici'){e.t=(e.t||0)+d;if(e.t>1.1){e.t=0;e.r=Phaser.Math.Clamp(e.r+(Math.random()<.5?-1:1),0,ROWS-1);
    this.tweens.add({targets:e.s,y:SY+e.r*TS+TS/2+8,duration:180});
    this.tweens.add({targets:e.sd,y:SY+e.r*TS+TS/2+17,duration:180});e.s.setDepth(12+e.r);e.sd.setDepth(11+e.r)}}
   if(e.s.x<sc-120||e.s.x>sc+W+220){e.s.destroy();e.sd.destroy();this.ent.splice(i,1);continue}
   if(this.inv<=0&&e.r===this.pr&&Math.abs(e.s.x-this.pl.x)<23){
    if(S.it.ruana>0){S.it.ruana--;this.inv=700;this.flash('LA RUANA AGUANTO EL EMPUJON','#d8c8a8');A.gate()}
    else{A.hurt();this.soak(9);this.inv=650;this.cameras.main.shake(140,.006);
     this.pr=Phaser.Math.Clamp(this.pr+(this.pr>0?-1:1),0,ROWS-1);this.place();
     this.flash('!EMPUJON! te corrio de fila',CY)}}}}

 // ---------- articulado en la via: te salpica si vas por el sardinel ----------
 busUp(d){if(!this.M.cfg.bus)return;const sc=this.cameras.main.scrollX;this.busT-=d;
  if(!this.bus&&this.busT<=0){this.busT=Phaser.Math.FloatBetween(4,8);A.bus();
   this.bus=this.add.image(sc+W+320,CURB+30,'bus').setOrigin(.5,.5).setDepth(6)}
  if(this.bus){this.bus.x-=430*d;
   if(Math.abs(this.bus.x-this.pl.x)<150&&this.pr===ROWS-1&&this.inv<=0&&this.rain>.2){
    this.inv=900;this.soak(26);this.spl.emitParticleAt(this.pl.x,this.pl.y+6,26);
    this.cameras.main.shake(260,.011);this.flash('!TE SALPICO EL BUS!',CB)}
   if(this.bus.x<sc-340){this.bus.destroy();this.bus=null}}}

 // ---------- el agua ----------
 water(){const fs=this.fst();this.wg.clear();if(fs===0)return;
  const sc=this.cameras.main.scrollX,t=this.tsec*2.2;
  this.M.fl.forEach(f=>{const x0=f[0]*TS,x1=(f[1]+1)*TS;
   if(x1<sc-60||x0>sc+W+60)return;
   const top=fs===2?SY+14:SY+2*TS+10;
   FS(this.wg,fs===2?0x2a5f8a:0x4a7f9a,fs===2?.72:.38);
   this.wg.beginPath();this.wg.moveTo(x0,CURB);
   for(let x=x0;x<=x1;x+=8)this.wg.lineTo(x,top+Math.sin(x*.05+t)*3.5);
   this.wg.lineTo(x1,CURB);this.wg.closePath();this.wg.fillPath();
   FS(this.wg,0xd8f2ff,.5);
   for(let x=x0;x<=x1;x+=8)FR(this.wg,x,top+Math.sin(x*.05+t)*3.5-1,5,2)})}

 // ---------- viaje en TransMilenio: gratis, pero cuesta afan y no da puntos ----------
 board(){const e=this.estC=this.pc;this.mode='bus';S.tmUsed++;this.racha=0;this.afan-=FILA;A.gate();
  const f=this.M.fl.find(x=>x[0]>e);this.exitC=f?Math.min(this.M.N-3,f[1]+3):Math.min(this.M.N-3,e+16);
  this.bt=0;this.push=0;this.pushN=0;this.okN=0;this.pr2.setVisible(false);
  if(this.dog)this.dogOff('EL PERRO NO PASA','#c4231a');
  if(!this.ov){this.ov=this.add.container(0,0).setScrollFactor(0).setDepth(70);
   const g=this.add.graphics();
   FS(g,0x101018,1);FR(g,0,0,W,H);
   FS(g,0xc4231a,1);FR(g,0,120,W,40);FR(g,0,430,W,50);
   FS(g,0x2a2a34,1);FR(g,0,160,W,270);
   for(let i=0;i<7;i++){FS(g,0x18181f,1);FR(g,40+i*130,190,96,110);
    FS(g,0x3a3a48,1);FR(g,40+i*130,300,96,14)}
   FS(g,GRY,1);for(let i=0;i<12;i++)FR(g,30+i*78,160,6,60);
   this.ov.add(g);
   this.ovT=this.add.text(W/2,86,'',{fontFamily:'monospace',fontSize:'19px',color:'#fff',align:'center'}).setOrigin(.5);
   this.ovA=this.add.text(W/2,360,'',{fontFamily:'monospace',fontSize:'46px',color:CY}).setOrigin(.5);
   this.ov.add([this.ovT,this.ovA]);
   this.ovP=[];for(let i=0;i<9;i++){const s=this.add.image(90+i*95,330,'run').setOrigin(.5,.85).setScale(1.4);
    this.ovP.push(s);this.ov.add(s)}
   this.ovMe=this.add.image(W/2,336,'p0').setOrigin(.5,.85).setScale(1.7);this.ov.add(this.ovMe)}
  this.ov.setVisible(true);this.ovA.setText('');this.ovMe.x=W/2;
  this.ovP.forEach((s,i)=>{s.x=70+i*100;s.y=326+((i%2)*8)})}

 busRide(d){this.bt+=d;
  this.wet=Math.max(0,this.wet-9.5*d);                       // aca se secan los zapatos
  this.ovT.setText('ARTICULADO · aguanta los frenones\nzapatos '+(this.wet|0)+'%   equilibrio '+this.okN+'/3\nbajas en '+Math.max(0,(8.2-this.bt)).toFixed(1)+'s');
  this.ovMe.setTexture(this.wet>62?'p2':this.wet>26?'p1':'p0');
  if(this.pushN<3&&this.bt>1.4+this.pushN*2.4){this.pushN++;this.push=1.15;
   this.pdir=Math.random()<.5?-1:1;this.ovA.setText(this.pdir<0?'<<<':'>>>');A.hurt();
   this.tweens.add({targets:this.ovMe,x:W/2+this.pdir*70,duration:340})}
  if(this.push>0){this.push-=d;
   const L=this.cur.left.isDown||this.k.A.isDown,R=this.cur.right.isDown||this.k.D.isDown;
   if((this.pdir<0&&R)||(this.pdir>0&&L)){this.push=0;this.okN++;this.ovA.setText('OK');A.coin();
    S.score+=40;this.wet=Math.max(0,this.wet-7);
    this.tweens.add({targets:this.ovMe,x:W/2,duration:200})}
   else if(this.push<=0){this.ovA.setText('');this.wet=Math.min(100,this.wet+9);
    this.tweens.add({targets:this.ovMe,x:W/2,duration:200})}}
  if(this.bt>8.2){let m='TE BAJASTE · 0 puntos',c='#c4231a';
   if(this.okN>=3){this.wet=0;S.score+=250;m='BAJASTE SECO +250';c=CG}      // viaje perfecto
   else if(!this.okN){this.exitC=Math.min(this.M.N-3,this.estC+5);          // te sacan antes
    m='TE SACARON EN LA ESTACION MALA';c=CR}
   this.ov.setVisible(false);this.mode='walk';this.pc=this.exitC;this.pr=1;
   this.place();this.cameras.main.setScroll(this.pl.x-W*.34,0);this.inv=900;
   this.flash(m,c);A.gate()}}

 // pantalla del proximo reto: obliga a leer antes de arrancar
 brief(){this.mode='brief';const cf=this.M.cfg,o=[];
  const g=SD(this.add.graphics(),80);
  FS(g,0x0b0a12,.94);FR(g,0,0,W,H);
  bev(g,140,104,680,326,0x241f36,2);bev(g,140,104,680,36,0x3d3160,2);o.push(g);
  const T=(x,y,t,c,sz,or,wr)=>{const e=SD(TT(this,x,y,t,c,sz,or,wr),81);o.push(e);return e};
  T(W/2,112,'TRAMO '+(S.lv+1)+'   ·   '+PAL[S.lv].n,CY,18,.5);
  T(W/2,158,'LO NUEVO DE ESTE TRAMO',CS,12,.5);
  if(cf.ic)o.push(SD(this.add.image(232,232,cf.ic).setScale(cf.sc),81));
  T(300,196,cf.tip,'#ffffff',16,0,490);
  T(176,310,'LLEVAS   botas '+S.it.bota+'    paraguas '+S.it.umb+'    pan '+S.it.pan+
   '    tinto '+S.it.tinto+'    ruana '+S.it.ruana,CB,13);
  T(176,336,'MONEDAS   $'+S.coins.toLocaleString('es-CO')+' · se gastan en la tienda',CY,13);
  const st=T(W/2,382,'',CG,20,.5);let k=3;st.setText('lee bien...  '+k);
  this.time.addEvent({delay:1000,repeat:2,callback:()=>{k--;st.setText(k?'lee bien...  '+k:'')}});
  this.time.delayedCall(3100,()=>{st.setText('[ENTER]  ARRANCAR').setColor('#ffd24a');
   this.tweens.add({targets:st,alpha:.2,duration:520,yoyo:true,repeat:-1});
   this.input.keyboard.once('keydown-ENTER',()=>{o.forEach(e=>e.destroy());
    this.mode='walk';this.flash('  '+PAL[S.lv].n+'  ',CY)})})}

 palomas(d){if(!this.M.cfg.bird)return;this.bT=(this.bT===undefined?5:this.bT)-d;
  if(this.bT<=0){this.bT=Phaser.Math.FloatBetween(7,12);
   const c=this.pc+Phaser.Math.Between(7,13),r=Phaser.Math.Between(0,ROWS-1);
   if(c<this.M.N-2){const a=[];for(let i=0;i<6;i++)
    a.push(this.add.image(c*TS+Phaser.Math.Between(-18,18),SY+r*TS+TS/2+Phaser.Math.Between(2,14),'bird').setDepth(13+r));
    (this.bf=this.bf||[]).push({a,r,x:c*TS,up:false})}}
  (this.bf||[]).forEach(f=>{if(f.up||Math.abs(f.x-this.pl.x)>72)return;f.up=true;A.noise(.22,.09,2800);
   f.a.forEach((s,i)=>this.tweens.add({targets:s,y:s.y-Phaser.Math.Between(90,200),
    x:s.x+Phaser.Math.Between(-60,100),alpha:0,duration:900,delay:i*45,onComplete:()=>s.destroy()}));
   if(f.r===this.pr&&this.inv<=0){this.soak(4);this.inv=500;
    this.pr=Phaser.Math.Clamp(this.pr-1,0,ROWS-1);this.place();this.flash('!PALOMAS!','#c8ccd4')}})}

 update(tm,dt){const d=Math.min(dt,50)/1000;
  if(this.mode==='bus')return this.busRide(d);
  if(this.colw){const NE=[0xff2d8a,0xffd24a,0x2fd86a,0x2f8fd8,0x9a4aff,0xff6a3d];
   this.colw.forEach((w,i)=>w.setFillStyle(NE[((this.tsec*3+i*.7)|0)%6]))}
  if(this.mode!=='walk')return;
  this.tsec+=d;this.dwell+=d;this.cool-=dt;this.inv-=dt;
  if(this.dash>0)this.dash-=dt;
  if(this.umb>0){this.umb-=dt;if(this.umb<=0)this.up.setVisible(false)}
  this.up.x=this.pl.x;this.up.y=this.pl.y-42;this.mk.x=this.pl.x;this.mk.y=this.pl.y+10;
  this.sh.x=this.pl.x;this.sh.y=this.pl.y+9;this.sh.setDepth(29)
  // lluvia -> inundacion
  this.rain=this.M.cfg.rain*Math.min(1,this.tsec/36);
  const fs=this.fst();
  if(fs!==this.lastFs){
   if(fs===1&&this.M.fl.length)this.flash('SE ESTA EMPOZANDO...','#7fb8d8');
   if(fs===2){this.flash('!SE INUNDO LA CALLE!','#4aa8e0');
    this.M.fl.forEach(f=>{for(let c=f[0];c<=f[1];c++)for(let r=0;r<ROWS;r++)this.tl[c][r].setTint(0x5f7f9a)})}
   this.lastFs=fs}
  if(this.rain>.1){if(!this.rn.emitting)this.rn.start();this.rn.setQuantity(1+(this.rain*5|0))}
  if(this.rain>.24&&this.umb<=0){this.wet=Math.min(100,this.wet+this.rain*2.3*d);
   if(this.wet>=100)return this.lose('TE MOJO LA LLUVIA COMPLETO')}
  this.afan-=d;if(this.afan<=0)return this.lose('SE TE HIZO TARDE');
  if(this.pc>this.ck&&this.pc%14===0)this.ck=this.pc;
  // movimiento
  const K=this.k,C=this.cur;
  if(this.cool<=0){
   if(C.right.isDown||K.D.isDown)this.move(1,0);
   else if(C.left.isDown||K.A.isDown)this.move(-1,0);
   else if(C.up.isDown||K.W.isDown)this.move(0,-1);
   else if(C.down.isDown||K.S.isDown)this.move(0,1)}
  this.pl.setTexture(this.wet>62?'p2':this.wet>26?'p1':'p0');
  // items
  // perro
  if(this.dogCd>0)this.dogCd-=d;
  if(!this.dog&&this.dogCd<=0)this.dogGo();
  if(this.dog)this.dogUp(d);
  // mundo
  this.sp(d);this.busUp(d);this.palomas(d);this.water();
  // monedas
  for(const c of this.cn){if(c.o.got)continue;
   if(c.o.r===this.pr&&Math.abs(c.s.x-this.pl.x)<25){c.o.got=true;c.s.destroy();
    S.coins+=500;S.score+=25*(this.dog?2:1);A.coin()}}
  // estacion
  this.atE=this.M.est.indexOf(this.pc)>=0&&this.pr>=2;
  this.pr2.setVisible(this.atE);
  if(this.atE)this.pr2.setText('[ENTER] montarte al TransMilenio  ·  gratis · te cuesta '+FILA+'s de afan y la racha');
  // hud
  this.mm.x=this.mmx+this.mmw*Math.min(1,this.pc/this.M.N);
  this.wb.width=178*(this.wet/100);
  this.wb.fillColor=this.wet>70?0xff4a6a:this.wet>40?AMB:0x4aa8e0;
  this.ab.width=148*Math.max(0,this.afan/this.M.cfg.t);
  this.st.setText('PUNTUACION '+('00000'+S.score).slice(-6));
  this.lt.setText('MEDIAS SECAS '+'♥'.repeat(Math.max(0,S.lives)));
  this.it.setText('[SPC]paraguas '+S.it.umb+'  [SHF]tinto '+S.it.tinto+'  [E]pan '+S.it.pan);
  this.mt.setText('$'+S.coins.toLocaleString('es-CO')+'   botas '+(this.botaUse|0)+'  ruana '+S.it.ruana);
  if(this.pc>=this.M.N-3)this.winLv()}}

// ---------- tienda + pronostico del IDEAM ----------
const SHOP=[{k:'bota',n:'BOTAS DE CAUCHO',p:2500,i:'i_bota',d:'vadear inundaciones'},
 {k:'umb', n:'PARAGUAS',       p:2000,i:'i_umb',  d:'[SPC] anula la lluvia 20s'},
 {k:'pan', n:'BOLSA DE PAN',   p:500, i:'i_pan',  d:'[E] se lo tiras al perro'},
 {k:'tinto',n:'TINTO',         p:1000,i:'i_tinto',d:'[SHIFT] te mueves mas rapido'},
 {k:'ruana',n:'RUANA',         p:1500,i:'i_ruana',d:'aguanta un empujon'}];
class Shop extends Phaser.Scene{
 constructor(){super('Shop')}
 create(){const c=LV[S.lv];
  this.add.rectangle(0,0,W,H,0x12121a).setOrigin(0);
  const T=(x,y,s,col,sz,o)=>this.add.text(x,y,s,{fontFamily:'monospace',fontSize:(sz||14)+'px',color:col||'#fff',align:'left'}).setOrigin(o||0);
  T(W/2,26,'LA TIENDA DE LA ESQUINA',CY,26,.5).setOrigin(.5,0);
  T(W/2,62,'proximo tramo: '+PAL[S.lv].n,CB,16,.5).setOrigin(.5,0);
  // pronostico: convierte la compra en decision informada
  const pr=(c.rain*100)|0;
  this.add.rectangle(W/2,112,760,50,0x1c2430).setOrigin(.5);
  T(W/2,98,'PRONOSTICO IDEAM   lluvia '+pr+'%   zonas inundables: '+c.fl+'   perros: '+c.dogs,
    pr>70?CR:CG,15,.5).setOrigin(.5,0);
  T(W/2,122,c.fl?(c.rain>=.72?'la calle SE VA A INUNDAR: lleva botas, salta por los bolardos o montate al TM':'se va a empozar: cuidado donde pisas'):'sin inundaciones en este tramo',CW,13,.5).setOrigin(.5,0);
  this.mt=T(W/2,158,'',CY,20,.5).setOrigin(.5,0);
  SHOP.forEach((o,i)=>{const x=64+i*172,y=214;
   this.add.rectangle(x+74,y+86,164,168,0x1a1a26).setOrigin(.5);
   this.add.image(x+74,y+34,o.i).setScale(1.5);
   T(x+74,y+66,''+(i+1),CY,18,.5).setOrigin(.5,0);
   T(x+74,y+90,o.n,'#fff',11,.5).setOrigin(.5,0);
   T(x+74,y+108,'$'+o.p.toLocaleString('es-CO'),CG,14,.5).setOrigin(.5,0);
   this.add.text(x+8,y+130,o.d,{fontFamily:'monospace',fontSize:'9px',color:CS,
    wordWrap:{width:132},align:'center'});
   o.t=T(x+74,y+164,'','#4aa8e0',12,.5).setOrigin(.5,0)});
  T(W/2,470,'[1-5] comprar        [ENTER] seguir caminando','#fff',17,.5).setOrigin(.5,0);
  T(W/2,504,'el TransMilenio es gratis: lo que cuesta es tu afan y tu racha','#6a7080',12,.5).setOrigin(.5,0);
  this.refresh();crt(this);
  const k=this.input.keyboard;
  k.on('keydown',e=>{const n=parseInt(e.key);
   if(n>=1&&n<=5){const o=SHOP[n-1];
    if(S.coins>=o.p){S.coins-=o.p;S.it[o.k]++;A.buy();this.refresh()}else{A.hurt();
     this.mt.setColor(CR);this.time.delayedCall(300,()=>this.mt.setColor(CY))}}
   if(e.key==='Enter')this.scene.start('Play')})}
 refresh(){this.mt.setText('TIENES $'+S.coins.toLocaleString('es-CO'));
  SHOP.forEach(o=>o.t.setText(S.it[o.k]?'tienes '+S.it[o.k]:''))}}

// ---------- marcador local (el gabinete necesita competencia) ----------
const HS={get(){try{return JSON.parse(localStorage.getItem('ba_hs'))||[]}catch(e){return[]}},
 add(n,s){const l=HS.get();l.push({n,s});l.sort((a,b)=>b.s-a.s);
  try{localStorage.setItem('ba_hs',JSON.stringify(l.slice(0,8)))}catch(e){}}};

class Title extends Phaser.Scene{
 constructor(){super('Title')}
 create(){
  const g=this.add.graphics(),T=(x,y,t,c,sz,o)=>TT(this,x,y,t,c,sz,o);
  this.add.rectangle(0,0,W,H,0x0a0f1e).setOrigin(0);
  for(let i=0;i<95;i++)this.add.rectangle(Math.random()*W|0,Math.random()*320|0,2,2,
   0xffffff,Math.random()*.7+.15).setOrigin(0);
  // cerros de fondo
  this.add.image(0,176,'h0').setOrigin(0).setAlpha(.95);
  this.add.image(-300,214,'h3').setOrigin(0).setAlpha(.45);
  // marquesina
  bev(g,0,0,W,28,0x2c1233,2);
  T(W/2,6,'CRAFTER STATION  ·  PLATANUS HACK 26  ·  BOGOTA',CY,13,.5);
  // logo
  const L=(y,t,c,sz)=>this.add.text(W/2,y,t,{fontFamily:'monospace',fontSize:sz+'px',
   color:c,stroke:'#14101c',strokeThickness:11}).setOrigin(.5,0);
  const l1=L(44,'BALDOSA','#ff2d8a',68),l2=L(112,'ASESINA','#ffffff',68);
  l1.setShadow(0,8,'#78082f',0,true,true);l2.setShadow(0,8,'#2a2a3a',0,true,true);
  this.tweens.add({targets:[l1,l2],scaleX:1.02,scaleY:1.02,duration:1500,yoyo:true,repeat:-1,ease:'Sine.inOut'});
  const bd=this.add.image(196,112,'t02').setScale(1.7).setAngle(-10);
  this.tweens.add({targets:bd,angle:4,duration:2100,yoyo:true,repeat:-1,ease:'Sine.inOut'});
  T(W/2,186,'cruza Bogota sin mojarte los zapatos',CY,19,.5);
  // anden animado
  const y=356;
  for(let c=0;c<20;c++)this.add.image(c*TS+24,y,c===8||c===16?'tw0':'t0'+((c*3+c%5)%6));
  this.add.rectangle(0,y+TS/2,W,H-y-TS/2,0x2b2b34).setOrigin(0);
  this.add.rectangle(0,y+TS/2,W,5,0x4a4a56).setOrigin(0);
  this.add.rectangle(0,y+TS/2+10,W,34,0x6a1d16).setOrigin(0);
  const bs=this.add.image(-220,y+38,'bus').setScale(.62).setDepth(3);
  this.tweens.add({targets:bs,x:W+260,duration:5400,repeat:-1,repeatDelay:4200});
  const pl=this.add.image(24,y+8,'p0').setOrigin(.5,.78).setDepth(4),
   sh=this.add.image(24,y+17,'shd').setAlpha(.6).setDepth(3),
   dg=this.add.image(-70,y+10,'dog').setOrigin(.5,.85).setDepth(4);
  let c=0;this.time.addEvent({delay:330,loop:true,callback:()=>{c=(c+1)%20;
   if(c===0){pl.x=24;sh.x=24;dg.x=-70}
   const nx=c*TS+24;
   this.tweens.add({targets:[pl,sh],x:nx,duration:150,ease:'Quad.out'});
   this.tweens.add({targets:pl,y:y+2,duration:75,yoyo:true});
   this.tweens.add({targets:dg,x:nx-48,duration:200});
   pl.setTexture(c===8||c===16?'p1':'p0')}});
  this.add.particles(0,-20,'drop',{x:{min:0,max:W},lifespan:900,speedY:{min:520,max:700},
   speedX:{min:-90,max:-40},quantity:2,frequency:48,scale:{min:.6,max:1.1},alpha:{start:.5,end:.15}});
  // paneles de abajo (graphics nuevo: va encima de la banda de la calle)
  const g2=this.add.graphics();
  bev(g2,12,436,286,92,0x241f36,2);bev(g2,306,436,642,92,0x241f36,2);
  T(26,444,'RECORDS DE LA MAQUINA',CB,11);
  const lb=HS.get();
  if(lb.length)lb.slice(0,3).forEach((r,i)=>T(26,464+i*20,(i+1)+'.  '+r.n+'   '+
   ('00000'+r.s).slice(-6),i?CW:CY,14));
  else T(26,470,'nadie ha jugado todavia',CS,13);
  T(320,444,'FLECHAS / WASD   saltar de baldosa en baldosa','#ffffff',14);
  T(320,466,'[ENTER] TransMilenio   [SPC] paraguas   [SHIFT] tinto   [E] pan   [M] musica',CS,11);
  const st=T(320,492,'>>  ENTER  ·  COMO SE JUEGA',CY,21);
  this.tweens.add({targets:st,alpha:.2,duration:620,yoyo:true,repeat:-1});
  crt(this);
  let gone=false;
  this.input.keyboard.on('keydown',e=>{A.init();MU.go();
   if(!gone&&(e.key==='Enter'||e.key===' ')){gone=true;A.win();this.scene.start('Help')}});
  if(this.input.gamepad)this.input.gamepad.once('down',()=>this.scene.start('Help'))}}

// ---------- como se juega: se tiene que entender en 5 segundos ----------
class Help extends Phaser.Scene{
 constructor(){super('Help')}
 create(){
  this.add.rectangle(0,0,W,H,0x14121f).setOrigin(0);
  const g=this.add.graphics();
  const T=(x,y,t,c,sz,o)=>TT(this,x,y,t,c,sz||12,o);
  T(W/2,20,'LO BASICO',CY,28,.5);
  T(W/2,58,'llega al final del tramo SIN MOJARTE LOS ZAPATOS',CB,16,.5);
  // lo unico que hay que saber para empezar: leer el anden
  bev(g,110,96,740,196,0x241f36,2);
  const row=(y,tex,t,c)=>{this.add.image(160,y+22,tex).setScale(.95);T(210,y+10,t,c,14)};
  row(108,'tx0','MARCADA CON X: la ves venir. si la pisas, te salpica.','#ff8ac0');
  row(170,'tw0','SIN MARCAR: solo la delata un BRILLO de agua. esa es la peor.',CB);
  row(232,'t00','SECA: suma racha, y la racha multiplica tu puntaje.',CG);
  // las dos barras
  bev(g,110,308,740,74,0x241f36,2);
  bev(g,128,324,150,16,0x120f1e,2);FS(g,0x4aa8e0);FR(g,130,326,146,12);
  T(292,324,'ZAPATOS: si se llena, pierdes un par de medias. tienes 3.',CB,13);
  bev(g,128,350,150,16,0x120f1e,2);FS(g,AMB);FR(g,130,352,146,12);
  T(292,350,'AFAN: es el reloj. no te quedes quieto.',CY,13);
  T(W/2,398,'FLECHAS o WASD para saltar de baldosa en baldosa','#ffffff',16,.5);
  T(W/2,424,'las MONEDAS que recoges compran botas, paraguas y pan en la tienda',CY,13,.5);
  T(W/2,442,'al final de cada tramo, para equiparte para el siguiente',CY,13,.5);
  const st=T(W/2,492,'[ENTER] EMPEZAR',CY,23,.5);
  this.tweens.add({targets:st,alpha:.2,duration:600,yoyo:true,repeat:-1});
  crt(this);
  let gone=false;
  this.input.keyboard.on('keydown',e=>{A.init();
   if(!gone&&(e.key==='Enter'||e.key===' ')){gone=true;reset();A.win();this.scene.start('Play')}});
  if(this.input.gamepad)this.input.gamepad.once('down',()=>{reset();this.scene.start('Play')})}}

class Over extends Phaser.Scene{
 constructor(){super('Over')}
 create(){const win=S.lv>=LV.length;
  this.add.rectangle(0,0,W,H,win?0x101c14:0x1a0d14).setOrigin(0);
  const T=(x,y,s,c,sz)=>TT(this,x,y,s,c,sz,.5);
  T(W/2,36,win?'LLEGASTE SECO A LA OFICINA':'SE TE MOJARON LOS ZAPATOS',win?CG:CR,win?32:30);
  T(W/2,84,'PUNTOS  '+S.score.toLocaleString('es-CO'),CY,34);
  T(W/2,134,'baldosas secas: '+S.dry+'    tramos: '+Math.min(S.lv+1,LV.length)+'/'+LV.length+
   '    veces en TM: '+S.tmUsed,CB,15);
  T(W/2,158,S.tmUsed===0?'SIN MONTARTE AL TM NI UNA VEZ. respeto.':'el TM te salvo pero costo puntos',
   S.tmUsed===0?CG:CS,13);
  // iniciales estilo arcade
  const L='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';let ix=[0,0,0],pos=0;
  T(W/2,206,'TUS INICIALES','#fff',14);
  const cs=[0,1,2].map(i=>this.add.text(W/2-58+i*58,232,'A',
   {fontFamily:'monospace',fontSize:'46px',color:CY}).setOrigin(.5,0));
  const cur=this.add.rectangle(W/2-58,292,40,5,0xff2d8a).setOrigin(.5,0);
  const draw=()=>{cs.forEach((t,i)=>{t.setText(L[ix[i]]);t.setColor(i===pos?CY:'#8a8a94')});
   cur.x=W/2-58+pos*58};draw();
  T(W/2,312,'teclado o flechas · ENTER guarda','#6a7080',12);
  const lb=HS.get();
  T(W/2,352,'MEJORES DE LA MAQUINA',CB,14);
  lb.slice(0,5).forEach((r,i)=>T(W/2,376+i*22,(i+1)+'.  '+r.n+'   '+r.s.toLocaleString('es-CO'),
   i===0?CY:CW,15));
  if(!lb.length)T(W/2,376,'-- vacio --','#6a7080',14);
  crt(this);
  this.input.keyboard.on('keydown',e=>{
   // teclado para quien lo tiene, flechas para el joystick del gabinete
   const k=e.key.length===1?L.indexOf(e.key.toUpperCase()):-1;
   if(k>=0){ix[pos]=k;if(pos<2)pos++;A.hop();draw()}
   else if(e.key==='ArrowUp'){ix[pos]=(ix[pos]+1)%L.length;A.hop();draw()}
   else if(e.key==='ArrowDown'){ix[pos]=(ix[pos]+L.length-1)%L.length;A.hop();draw()}
   else if(e.key==='ArrowRight'){pos=(pos+1)%3;A.hop();draw()}
   else if(e.key==='ArrowLeft'){pos=(pos+2)%3;A.hop();draw()}
   else if(e.key==='Enter'){HS.add(ix.map(i=>L[i]).join('')||'AAA',S.score);A.win();
    this.scene.start('Title')}})}}

new Phaser.Game({type:Phaser.AUTO,width:W,height:H,backgroundColor:'#0a0a0c',
 pixelArt:true,roundPixels:true,input:{gamepad:true},
 scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
 scene:[Boot,Title,Help,Play,Shop,Over]});
