// Auditor de balance: extrae el generador de niveles del juego y verifica,
// con un BFS sobre la grilla, que SIEMPRE exista una ruta sin mojarse.
// Uso:  node tools/audit.js
const fs=require('fs'),src=fs.readFileSync(__dirname+'/../src/game.src.js','utf8');
const lv=src.slice(src.indexOf('const LV=['),src.indexOf('// tipos de celda')).trimEnd();
const gn=src.slice(src.indexOf('function rnd(s)'),src.indexOf('\n// ---------- escena de juego'));
const ROWS=4,Phaser={Math:{Clamp:(v,a,b)=>v<a?a:(v>b?b:v)}};
const gen=new Function('ROWS','Phaser',lv+'\n'+gn+'\nreturn gen;')(ROWS,Phaser);

function audita(i){
 const M=gen(i),N=M.N,C=M.cell,seco=v=>v===0||v===5;   // 0 seca, 5 bolardo
 const vis=new Set(['2,2']),q=[[2,2]];let lejos=2;
 while(q.length){const[x,r]=q.shift();if(x>lejos)lejos=x;
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const nx=x+dx,nr=r+dy;
   if(nx<0||nx>=N||nr<0||nr>=ROWS)return;const k=nx+','+nr;
   if(vis.has(k)||!seco(C[nx][nr]))return;vis.add(k);q.push([nx,nr])})}
 let moj=0,ocu=0,tot=0,peor=0,cerr=0;
 for(let x=6;x<N-3;x++){let w=0;
  for(let r=0;r<ROWS;r++){const v=C[x][r];tot++;
   if(v===1)moj++;if(v===2){moj++;ocu++}if(v===1||v===2||v===3)w++}
  if(w>peor)peor=w;if(w>=ROWS)cerr++}
 return{paso:lejos>=N-3,lejos,meta:N-3,moj:(100*moj/tot).toFixed(0),
  ocu:(100*ocu/Math.max(1,moj)).toFixed(0),peor,cerr};}

let fallo=0;
console.log('tramo  ruta-seca  mojadas  sin-marcar  peor-columna  cerradas');
for(let i=0;i<5;i++){const a=audita(i);
 if(!a.paso||a.cerr)fallo=1;
 console.log('  '+(i+1)+'      '+(a.paso?'  SI   ':' NO('+a.lejos+'/'+a.meta+')')+
  '     '+a.moj+'%       '+a.ocu+'%          '+a.peor+'/4          '+a.cerr);}
console.log(fallo?'\nFALLA: hay encerrones o tramos sin ruta seca.':'\nOK: los 5 tramos tienen ruta sin mojarse y cero encerrones.');
process.exit(fallo);
