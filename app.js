'use strict';
const $=id=>document.getElementById(id),$$=s=>[...document.querySelectorAll(s)];
const N=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const FIFTHS=[0,7,2,9,4,11,6,1,8,3,10,5];
const MODES={'Мажор':[0,2,4,5,7,9,11],'Натуральный минор':[0,2,3,5,7,8,10],'Гармонический минор':[0,2,3,5,7,8,11],'Дорийский':[0,2,3,5,7,9,10],'Фригийский':[0,1,3,5,7,8,10],'Миксолидийский':[0,2,4,5,7,9,10]};
const Q={'':[0,4,7],'m':[0,3,7],'dim':[0,3,6],'aug':[0,4,8],'7':[0,4,7,10],'m7':[0,3,7,10],'maj7':[0,4,7,11],'m9':[0,3,7,10,14],'sus2':[0,2,7]};
const P=s=>s.split(' ').map(c=>{const m=c.match(/^(1[01]|\d)(.*)$/);return[+m[1],m[2]]});
// ---------- жанры: bpm, свинг, лад, прогрессии, паттерны
const GEN={
 'Трэп':{bpm:140,sw:0,mode:'Натуральный минор',prog:[['i–VI–III–VII','0m 8 3 10'],['i–iv–VI–V (гарм.)','0m 5m 8 7'],['i–bII–i–VII (фриг.)','0m 1 0m 10'],['i–VI–iv–i','0m 8 5m 0m']],
  pat:{kick:'x.......x.x.....',b808:'x.......x.x.....',snare:'........x.......',clap:'........x.......',hat:'x.x.x.x.xxx.x.xx',ohat:'..............x.',perc:'...x.......x....',pad:'x...............'}},
 'Фонк':{bpm:130,sw:10,mode:'Фригийский',prog:[['i–bII–i–v (фриг.)','0m 1 0m 7m'],['i–VI–bII–V','0m 8 1 7'],['i–iv–i–bII','0m 5m 0m 1']],
  pat:{kick:'x.....x...x.....',b808:'x.....x...x.....',snare:'....x.......x...',clap:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',cowbell:'x..x..x...x..x..',ohat:'......x.......x.'}},
 'Дрилл':{bpm:142,sw:0,mode:'Натуральный минор',prog:[['i–VI–iv–V','0m 8 5m 7'],['i–bII–VII–i','0m 1 10 0m'],['i–iv–bVI–V','0m 5m 8 7']],
  pat:{kick:'x.........x.....',b808:'x.....x...x...x.',snare:'......x.......x.',hat:'x..x..x.x..x..x.',perc:'...x....x..x....',rim:'.....x.......x..',pad:'x...............'}},
 'Джерси-клаб':{bpm:140,sw:0,mode:'Натуральный минор',prog:[['i–VI–III–VII','0m 8 3 10'],['vi–IV–I–V','9m 5 0 7']],
  pat:{kick:'x...x...x..x..x.',clap:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',perc:'..x.....x.x.....',ohat:'..............x.',bass:'x.......x.......',keys:'x.....x.........'}},
 'DnB / Джангл':{bpm:172,sw:0,mode:'Дорийский',prog:[['i–iv (дор.) ','0m7 5 0m7 5'],['i–VI–VII–i','0m 8 10 0m']],
  pat:{kick:'x.........x.....',snare:'....x.......x...',ride:'x.x.x.x.x.x.x.x.',shaker:'xxxxxxxxxxxxxxxx',hat:'..x.......x.....',sub:'x.........x.....',pad:'x...............'}},
 'Хаус':{bpm:124,sw:10,mode:'Дорийский',prog:[['i7–IV7 (дор.)','0m7 5 0m7 5'],['vi–IV–I–V','9m 5 0 7'],['ii7–V7–Imaj7–vi7','2m7 7 0maj7 9m7']],
  pat:{kick:'x...x...x...x...',clap:'....x.......x...',ohat:'..x...x...x...x.',shaker:'xxxxxxxxxxxxxxxx',bass:'..x...x...x...x.',keys:'x..x..x.........'}},
 'Реггетон':{bpm:95,sw:0,mode:'Натуральный минор',prog:[['i–VI–III–VII','0m 8 3 10'],['vi–IV–I–V','9m 5 0 7']],
  pat:{kick:'x...x...x...x...',snare:'...x..x....x..x.',rim:'...x..x....x..x.',hat:'x.x.x.x.x.x.x.x.',bass:'x..x..x.x..x..x.',keys:'...x..x....x..x.'}},
 'Клауд-рэп':{bpm:130,sw:0,mode:'Мажор',prog:[['IVmaj7–iii7–vi7–Imaj7','5maj7 4m7 9m7 0maj7'],['Imaj7–vi7–IVmaj7–iv7 (заимств.)','0maj7 9m7 5maj7 5m7'],['vi9–IVmaj7–Isus2–V','9m9 5maj7 0sus2 7']],
  pat:{kick:'x.........x.....',b808:'x.........x.....',snare:'........x.......',hat:'x...x...x...x.x.',ohat:'......x.........',crash:'x...............',pad:'x...............'}},
 'Витч-хаус':{bpm:70,sw:10,mode:'Фригийский',prog:[['i–bII–i–bII (фриг.)','0m 1 0m 1'],['i–bVI–bII–v','0m 8 1 7m'],['i–iv–bII–i°','0m 5m 1 0dim']],
  pat:{kick:'x.........x.....',snare:'........x.......',hat:'x...x...x...x.x.',ohat:'......x.......x.',clap:'........x.......',tomL:'.......x.......x',sub:'x...............',pad:'x...............'}},
 'Лоу-фай':{bpm:80,sw:45,mode:'Мажор',prog:[['Imaj7–vi7–ii7–V7','0maj7 9m7 2m7 77'],['IVmaj7–iv7–iii7–vi7','5maj7 5m7 4m7 9m7'],['i9–iv9–bVII–IIImaj7','0m9 5m9 10 3maj7']],
  pat:{kick:'x.....x...x.....',snare:'....x.......x...',hat:'x.xxx.x.x.xxx.x.',rim:'..x.......x.....',shaker:'.x.x.x.x.x.x.x.x',keys:'x.......x.......',bass:'x.....x...x.....'}},
 'Бум-бэп':{bpm:90,sw:35,mode:'Натуральный минор',prog:[['i7–iv7–VII7–IIImaj7','0m7 5m7 107 3maj7'],['ii7–V7–Imaj7–vi7 (джаз)','2m7 77 0maj7 9m7'],['i7–VImaj7–ii°–V7','0m7 8maj7 2dim 77']],
  pat:{kick:'x......x..x.....',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',ohat:'..............x.',perc:'.......x........',bass:'x......x..x.....',keys:'x...............'}},
 'Классик хип-хоп':{bpm:92,sw:25,mode:'Дорийский',prog:[['i7–iv7 (луп 90-х)','0m7 5m7 0m7 5m7'],['i–bVII–bVI–V','0m 10 8 7']],
  pat:{kick:'x......xx.x.....',snare:'....x.......x...',clap:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',bass:'x......xx.x.....',keys:'x.......x.......'}},
 'Поп':{bpm:110,sw:0,mode:'Мажор',prog:[['I–V–vi–IV','0 7 9m 5'],['vi–IV–I–V','9m 5 0 7'],['I–bVII–IV–I (миксолид.)','0 10 5 0'],['I–IV–iv–I (минорная IV)','0 5 5m 0']],
  pat:{kick:'x...x...x...x...',clap:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',ohat:'..x...x...x...x.',bass:'x...x...x...x...',pad:'x...............',crash:'x...............'}},
 'Тёмный / агрессивный':{bpm:150,sw:0,mode:'Фригийский',prog:[['i–bII–bV–i (тритон)','0m 1 6 0m'],['i–iv–bII–V','0m 5m 1 7'],['i–ii°–bVI–V','0m 2dim 8 7'],['i–bIII aug–iv–V','0m 3aug 5m 7']],
  pat:{kick:'x..x..x...x..x..',b808:'x..x..x...x..x..',snare:'........x.......',hat:'x.x.x.x.x.x.x.x.',tomH:'.............x..',tomL:'..............xx',perc:'.x...x...x...x..',crash:'x...............'}}
};
for(const g in GEN)GEN[g].prog=GEN[g].prog.map(([n,s])=>[n,P(s)]);
// ---------- инструменты (патчи). note — MIDI-нота (для мелодических — смещение октавы)
const TR=[
 ['kick','Бочка','d',36,{w:'sine',nz:0,a:.001,d:.35,s:0,r:.05,pt:-3,pe:24,ptm:.06,ft:'lowpass',fc:8000,q:1,v:.95}],
 ['b808','808','m',36,{w:'sine',nz:0,a:.002,d:1.3,s:0,r:.1,pt:0,pe:12,ptm:.04,ft:'lowpass',fc:3000,q:1,v:.8}],
 ['sub','Саб','m',35,{w:'sine',nz:0,a:.01,d:.3,s:.8,r:.2,pt:-12,pe:0,ptm:.02,ft:'lowpass',fc:400,q:1,v:.8}],
 ['snare','Снейр','d',38,{w:'triangle',nz:.7,a:.001,d:.18,s:0,r:.05,pt:2,pe:7,ptm:.03,ft:'lowpass',fc:9000,q:1,v:.6}],
 ['clap','Клэп','d',39,{w:'noise',nz:1,a:.001,d:.16,s:0,r:.05,pt:0,pe:0,ptm:.01,ft:'bandpass',fc:1500,q:1.5,v:.8,multi:3}],
 ['rim','Римшот','d',37,{w:'triangle',nz:.25,a:.001,d:.05,s:0,r:.02,pt:24,pe:5,ptm:.01,ft:'bandpass',fc:2200,q:2,v:.6}],
 ['hat','Хэт','d',42,{w:'noise',nz:1,a:.001,d:.045,s:0,r:.02,pt:0,pe:0,ptm:.01,ft:'highpass',fc:8000,q:1,v:.35}],
 ['ohat','Откр. хэт','d',46,{w:'noise',nz:1,a:.001,d:.35,s:0,r:.05,pt:0,pe:0,ptm:.01,ft:'highpass',fc:7000,q:1,v:.3}],
 ['crash','Крэш','d',49,{w:'noise',nz:1,a:.001,d:1.6,s:0,r:.2,pt:0,pe:0,ptm:.01,ft:'highpass',fc:5000,q:.7,v:.3}],
 ['ride','Райд','d',51,{w:'square',nz:.5,a:.001,d:.7,s:0,r:.1,pt:40,pe:0,ptm:.01,ft:'highpass',fc:6000,q:1,v:.22}],
 ['tomH','Том выс.','d',50,{w:'sine',nz:.05,a:.001,d:.3,s:0,r:.05,pt:19,pe:6,ptm:.05,ft:'lowpass',fc:5000,q:1,v:.7}],
 ['tomL','Том низ.','d',45,{w:'sine',nz:.05,a:.001,d:.45,s:0,r:.05,pt:9,pe:6,ptm:.05,ft:'lowpass',fc:5000,q:1,v:.75}],
 ['shaker','Шейкер','d',70,{w:'noise',nz:1,a:.008,d:.05,s:0,r:.02,pt:0,pe:0,ptm:.01,ft:'bandpass',fc:6500,q:2,v:.3}],
 ['cowbell','Ковбелл','d',56,{w:'square',nz:0,a:.001,d:.25,s:0,r:.05,pt:44,pe:0,ptm:.01,ft:'bandpass',fc:1800,q:3,v:.35}],
 ['perc','Перк','d',75,{w:'triangle',nz:0,a:.001,d:.08,s:0,r:.03,pt:40,pe:3,ptm:.02,ft:'lowpass',fc:6000,q:1,v:.45}],
 ['bass','Бас (синт)','m',48,{w:'sawtooth',nz:0,a:.005,d:.2,s:.6,r:.1,pt:0,pe:0,ptm:.02,ft:'lowpass',fc:700,q:5,v:.45}],
 ['pad','Пэд','m',60,{w:'sawtooth',nz:0,a:.4,d:.6,s:.7,r:.9,pt:0,pe:0,ptm:.02,ft:'lowpass',fc:1400,q:1,v:.16}],
 ['keys','Клавиши','m',60,{w:'triangle',nz:0,a:.005,d:.6,s:.2,r:.3,pt:0,pe:0,ptm:.02,ft:'lowpass',fc:3500,q:1,v:.3}],
 ['lead','Лид / мелодия','l',72,{w:'square',nz:0,a:.005,d:.2,s:.4,r:.15,pt:0,pe:0,ptm:.02,ft:'lowpass',fc:2600,q:2,v:.22}]
];
const TID=TR.map(t=>t[0]),TIX=Object.fromEntries(TR.map((t,i)=>[t[0],i]));
const DEF=Object.fromEntries(TR.map(t=>[t[0],t[4]]));
// ---------- состояние проекта
let S={key:9,mode:'Натуральный минор',genre:'Трэп',chosen:GEN['Трэп'].prog[0][1],bpm:140,sw:0,steps:{},roll:Array(16).fill(null),patch:JSON.parse(JSON.stringify(DEF)),eq:[0,0,0,0,0],lyr:''};
function loadGenrePat(g){const p=GEN[g].pat;S.steps={};TID.forEach(id=>{if(id!=='lead')S.steps[id]=[...(p[id]||'................')].map(c=>c==='x')})}
loadGenrePat('Трэп');
try{const L=JSON.parse(localStorage.bk2||'null');if(L){Object.assign(S,L);for(const id of TID){S.patch[id]=Object.assign({},DEF[id],S.patch[id]||{});if(id!=='lead'&&!S.steps[id])S.steps[id]=Array(16).fill(false)}}else if(localStorage.lyr)S.lyr=localStorage.lyr}catch(e){}
let saveT;const save=()=>{clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.bk2=JSON.stringify(S)}catch(e){}},300)};
// ---------- аудио
let AC,master,eqN=[],nbuf;const EQF=[[60,'lowshelf'],[250,'peaking'],[1000,'peaking'],[4000,'peaking'],[10000,'highshelf']];
function ac(){if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();let prev=null;
 eqN=EQF.map(([f,t],i)=>{const b=AC.createBiquadFilter();b.type=t;b.frequency.value=f;b.Q.value=1;b.gain.value=S.eq[i];if(prev)prev.connect(b);prev=b;return b});
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-10;comp.ratio.value=4;prev.connect(comp).connect(AC.destination);master=AC.createGain();master.gain.value=.8;master.connect(eqN[0]);
 nbuf=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const d=nbuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 if(AC.state!=='running')AC.resume();return AC}
const mf=n=>440*Math.pow(2,(n-69)/12);
// универсальный голос: осциллятор + шум → фильтр → ADSR
function voice(p,note,t,dur){const c=ac();t=t||c.currentTime;const out=c.createGain(),f=c.createBiquadFilter();f.type=p.ft;f.frequency.value=p.fc;f.Q.value=p.q;f.connect(out);out.connect(master);
 const srcs=[];const fr=mf(note+p.pt);
 if(p.w!=='noise'&&p.nz<1){const o=c.createOscillator();o.type=p.w;const g=c.createGain();g.gain.value=1-p.nz;
  if(p.pe){o.frequency.setValueAtTime(fr*Math.pow(2,p.pe/12),t);o.frequency.exponentialRampToValueAtTime(fr,t+Math.max(.005,p.ptm))}else o.frequency.setValueAtTime(fr,t);
  o.connect(g).connect(f);srcs.push(o)}
 if(p.w==='noise'||p.nz>0){const n=c.createBufferSource();n.buffer=nbuf;const g=c.createGain();g.gain.value=p.w==='noise'?1:p.nz;n.connect(g).connect(f);srcs.push(n)}
 const G=out.gain,v=p.v,a=Math.max(.001,p.a),pk=t+a,s=Math.max(.0001,p.s*v);G.setValueAtTime(0,t);
 const env=(st)=>{if(p.multi){for(let k=0;k<p.multi;k++){G.setValueAtTime(v,st+k*.011);G.exponentialRampToValueAtTime(.05,st+k*.011+.01)}G.setValueAtTime(v,st+p.multi*.011);G.exponentialRampToValueAtTime(.0001,st+p.multi*.011+p.d);return}
  G.linearRampToValueAtTime(v,pk);G.exponentialRampToValueAtTime(s,pk+Math.max(.005,p.d))};env(t);
 const stop=(et)=>{et=Math.max(et||c.currentTime,t+a);G.cancelScheduledValues(et);G.setValueAtTime(p.s>0?s:.0001,et);G.exponentialRampToValueAtTime(.0001,et+Math.max(.01,p.r));G.setValueAtTime(0,et+p.r+.01);srcs.forEach(x=>{try{x.stop(et+p.r+.05)}catch(e){}})};
 srcs.forEach(x=>x.start(t));
 if(dur!==undefined){const end=p.s>0?t+Math.max(dur,a):t+a+p.d+(p.multi?.05:0);stop(end)}
 return{stop}}
const cname=(r,q)=>N[(S.key+r)%12]+q.replace('dim','°');
const chordNotes=(r,q,base)=>Q[q].map(iv=>base+((S.key+r)%12)+iv);
function playChord(r,q,t,d=1){chordNotes(r,q,48).forEach(n=>voice(S.patch.keys,n+12-12,t,d))}
const inScale=(r,q)=>Q[q].every(iv=>MODES[S.mode].includes((r+iv)%12));
// ---------- круг
function chEl(r,q,sub){const d=document.createElement('div');d.className='ch'+(inScale(r,q)?'':' bor');d.innerHTML=cname(r,q)+'<small>'+sub+'</small>';d.onclick=()=>playChord(r,q,0,1.2);return d}
function render(){const sc=MODES[S.mode],dE=$('diat');dE.innerHTML='';const rom=['I','II','III','IV','V','VI','VII'];
 sc.forEach((s,i)=>{const th=(sc[(i+2)%7]-s+12)%12,fi=(sc[(i+4)%7]-s+12)%12;const q=th==4?(fi==8?'aug':''):(fi==6?'dim':'m');dE.appendChild(chEl(s,q,q==''||q=='aug'?rom[i]:rom[i].toLowerCase()))});
 const PE=$('progs');PE.innerHTML='';GEN[S.genre].prog.forEach(([nm,ch])=>{const b=document.createElement('div');b.className='prog';
  b.innerHTML='<b>'+nm+'</b> <button class="b">▶</button><button class="b">★</button><div class="chords"></div>';
  ch.forEach(([r,q])=>b.lastChild.appendChild(chEl(r,q,inScale(r,q)?'':'заимств.')));
  b.children[1].onclick=()=>{const c=ac(),t=c.currentTime+.05,sp=60/S.bpm*2;ch.forEach(([r,q],i)=>playChord(r,q,t+i*sp,sp))};
  b.children[2].onclick=()=>{S.chosen=ch;save();showChosen()};PE.appendChild(b)});
 drawCircle();showChosen();$('key').value=S.key;$('mode').value=S.mode;$$('.genre').forEach(s=>s.value=S.genre)}
function showChosen(){const t=S.chosen.map(c=>cname(...c)).join(' – ');$('chosen').innerHTML='В бите и MIDI: <b>'+t+'</b>';$('hdr').textContent=N[S.key]+' · '+S.mode+' · '+S.genre+' · '+S.bpm+' BPM';
 const k=$('kch');k.innerHTML='';S.chosen.forEach((c,i)=>k.add(new Option((i+1)+': '+cname(...c),i)));drawRoll();drawKb()}
function drawCircle(){let s='<svg viewBox="-110 -110 220 220">';FIFTHS.forEach((p,i)=>{const a=(i*30-90)*Math.PI/180,x=Math.cos(a)*85,y=Math.sin(a)*85,x2=Math.cos(a)*55,y2=Math.sin(a)*55,on=p==S.key;
 s+=`<g><circle data-k="${p}" data-m="0" cx="${x}" cy="${y}" r="17" fill="${on&&S.mode=='Мажор'?'#ff3d6e':'#2d2442'}"/><text pointer-events="none" x="${x}" y="${y+5}" fill="#fff" font-size="13" text-anchor="middle">${N[p]}</text>
 <circle data-k="${(p+9)%12}" data-m="1" cx="${x2}" cy="${y2}" r="13" fill="${(p+9)%12==S.key&&S.mode!='Мажор'?'#ffb800':'#221a33'}"/><text pointer-events="none" x="${x2}" y="${y2+4}" fill="#ccc" font-size="10" text-anchor="middle">${N[(p+9)%12]}m</text></g>`});
 s+='<text y="5" fill="#ffb800" text-anchor="middle" font-size="12">'+N[S.key]+(S.mode=='Мажор'?'':'m')+'</text></svg>';$('circle').innerHTML=s;
 $$('#circle circle').forEach(g=>g.onclick=()=>{S.key=+g.dataset.k;if(g.dataset.m=='1'&&S.mode=='Мажор')S.mode='Натуральный минор';if(g.dataset.m=='0')S.mode='Мажор';save();render();playChord(0,S.mode=='Мажор'?'':'m',0,1)})}
N.forEach((n,i)=>$('key').add(new Option(n,i)));Object.keys(MODES).forEach(m=>$('mode').add(new Option(m)));$$('.genre').forEach(s=>Object.keys(GEN).forEach(g=>s.add(new Option(g))));
$('key').onchange=e=>{S.key=+e.target.value;save();render()};$('mode').onchange=e=>{S.mode=e.target.value;save();render()};
function setGenre(g){S.genre=g;const G=GEN[g];S.bpm=G.bpm;S.sw=G.sw;S.mode=G.mode;S.chosen=G.prog[0][1];loadGenrePat(g);$('bpm').value=S.bpm;$('swing').value=S.sw;$('swv').textContent=S.sw+'%';save();render();drawGrid()}
$$('.genre').forEach(s=>s.onchange=e=>setGenre(e.target.value));
// ---------- секвенсор
function drawGrid(){const g=$('grid');g.innerHTML='';[[0,'Шаги 1–8'],[8,'Шаги 9–16']].forEach(([o,t])=>{const b=document.createElement('div');b.className='blk';b.innerHTML='<div class="t">'+t+'</div>';
 let grp='';TR.forEach(([id,nm,ty])=>{if(ty==='l')return;const gg=ty==='d'?'Ударные':'Бас и гармония';if(gg!==grp){grp=gg;const h=document.createElement('div');h.className='row grp';h.textContent=gg;b.appendChild(h)}
  const row=document.createElement('div');row.className='row';const l=document.createElement('span');l.className='nm';l.textContent=nm;l.onclick=()=>{openInst(id)};row.appendChild(l);
  for(let j=o;j<o+8;j++){const c=document.createElement('div');c.className='st'+(ty!=='d'?' mel':'')+(j%4==0?' q':'')+(S.steps[id][j]?' on':'');c.dataset.s=j;
   c.onclick=()=>{S.steps[id][j]=!S.steps[id][j];c.classList.toggle('on');if(S.steps[id][j])trig(id,ac().currentTime,j,0);save()};row.appendChild(c)}b.appendChild(row)});g.appendChild(b)})}
function rootNote(base,bar){const [r]=S.chosen[bar%S.chosen.length];return base+((S.key+r)%12)}
function trig(id,t,step,bar){const p=S.patch[id],ty=TR[TIX[id]][2],sd=60/S.bpm/4;
 if(ty==='d')return voice(p,TR[TIX[id]][3],t,0);
 if(id==='b808'||id==='sub'||id==='bass'){let len=1;while(step+len<16&&!S.steps[id][step+len])len++;return voice(p,rootNote(id==='bass'?36:24,bar)+(id==='b808'?12:0),t,len*sd*.95)}
 const [r,q]=S.chosen[bar%S.chosen.length];let len=1;while(step+len<16&&!S.steps[id][step+len])len++;
 chordNotes(r,q,id==='pad'?48:60).forEach(n=>voice(p,n,t,id==='pad'?len*sd:Math.min(len,2)*sd))}
let step=0,bar=0,playing=false,nextT=0,timer;
function sched(){const c=ac(),sd=60/S.bpm/4,sw=S.sw/100;
 while(nextT<c.currentTime+.12){const t=nextT+(step%2?sd*sw*.5:0);
  TID.forEach(id=>{if(id==='lead'){const n=S.roll[step];if(n!=null)voice(S.patch.lead,n,t,sd*.9)}else if(S.steps[id][step])trig(id,t,step,bar)});
  const s=step;setTimeout(()=>$$('.st').forEach(e=>e.classList.toggle('cur',+e.dataset.s===s)),Math.max(0,(t-c.currentTime)*1000));
  step++;if(step==16){step=0;bar++}nextT+=sd}}
$('play').onclick=()=>{if(playing){clearInterval(timer);playing=false;$('play').textContent='▶ Старт';$$('.st.cur').forEach(e=>e.classList.remove('cur'));return}
 const c=ac();step=0;bar=0;nextT=c.currentTime+.06;timer=setInterval(sched,25);playing=true;$('play').textContent='■ Стоп'};
$('clear').onclick=()=>{TID.forEach(id=>{if(S.steps[id])S.steps[id].fill(false)});save();drawGrid()};
$('pre').onclick=()=>{loadGenrePat(S.genre);save();drawGrid()};
$('bpm').onchange=e=>{S.bpm=Math.min(200,Math.max(50,+e.target.value||120));save();showChosen()};
$('swing').oninput=e=>{S.sw=+e.target.value;$('swv').textContent=S.sw+'%';save()};
// ---------- подсказки гармонии
const CONS=[0,3,4,5,7,8,9];
function strength(n,ref,chordPcs){const pc=((n%12)+12)%12;let s=0;if(MODES[S.mode].map(x=>(x+S.key)%12).includes(pc))s=1;
 if(ref!=null&&n!==ref&&CONS.includes(((n-ref)%12+12)%12))s++;if(chordPcs.includes(pc))s++;return Math.min(3,s)}
const curChordPcs=()=>{const i=+($('kch').value||0),[r,q]=S.chosen[i]||S.chosen[0];return Q[q].map(iv=>(S.key+r+iv)%12)};
// ---------- пиано-ролл (2 октавы лада)
let rollRef=null;
function rollRows(){const sc=MODES[S.mode],out=[];for(let o=2;o>=0;o--)for(let i=6;i>=0;i--){const n=60+S.key-12+o*12+sc[i];if(o==2&&i>0)continue;out.push(n)}return out}
function drawRoll(){const R=$('roll');if(!R)return;R.innerHTML='';const rows=rollRows(),cp=curChordPcs();
 [[0,'Шаги 1–8'],[8,'Шаги 9–16']].forEach(([o,t])=>{const b=document.createElement('div');b.className='blk roll';b.innerHTML='<div class="t">'+t+'</div>';
  rows.forEach(n=>{const row=document.createElement('div');row.className='row';const st=strength(n,rollRef,cp);const l=document.createElement('span');l.className='nm'+(rollRef!=null&&st>1?' s'+st:'');l.textContent=N[n%12]+(Math.floor(n/12)-1);row.appendChild(l);
   for(let j=o;j<o+8;j++){const c=document.createElement('div');c.className='st mel'+(j%4==0?' q':'')+(S.roll[j]===n?' on':(rollRef!=null&&st>1?' s'+st:''));c.dataset.s=j;
    c.onclick=()=>{S.roll[j]=S.roll[j]===n?null:n;if(S.roll[j]!=null){rollRef=n;voice(S.patch.lead,n,0,.25)}save();drawRoll()};row.appendChild(c)}b.appendChild(row)});R.appendChild(b)})}
$('rclear').onclick=()=>{S.roll.fill(null);rollRef=null;save();drawRoll()};
// ---------- клавиатура + арпеджиатор
let oct=3,held=[],down={},kbRef=null;const WH=[0,2,4,5,7,9,11];
function drawKb(){const K=$('kb');if(!K)return;K.innerHTML='';const W=K.clientWidth||360,nw=14,kw=W/nw,cp=curChordPcs();
 for(let o=0;o<2;o++)for(let i=0;i<12;i++){const n=12*(oct+1+o)+i,wi=WH.indexOf(i),k=document.createElement('div');const st=kbRef!=null?strength(n,kbRef,cp):0;
  if(wi>=0){k.className='wk';k.style.left=(o*7+wi)*kw+'px';k.style.width=kw+'px'}else{k.className='bk';const pw=WH.indexOf(i-1);k.style.left=((o*7+pw+1)*kw-kw*.3)+'px';k.style.width=kw*.6+'px'}
  if(st>1)k.classList.add('s'+st);if(down[n]||held.includes(n))k.classList.add('dn');k.textContent=i==0?'C'+(oct+o):(st>1&&wi>=0?N[i]:'');k.dataset.n=n;K.appendChild(k)}}
const kbNote=e=>{const el=document.elementFromPoint(e.clientX,e.clientY);return el&&el.dataset&&el.dataset.n?+el.dataset.n:null};
let pmap={};
$('kb').addEventListener('pointerdown',e=>{e.preventDefault();const n=kbNote(e);if(n==null)return;pmap[e.pointerId]=n;noteOn(n)});
$('kb').addEventListener('pointerup',e=>{const n=pmap[e.pointerId];delete pmap[e.pointerId];if(n!=null)noteOff(n)});
$('kb').addEventListener('pointercancel',e=>{const n=pmap[e.pointerId];delete pmap[e.pointerId];if(n!=null)noteOff(n)});
function noteOn(n){kbRef=n;const cp=curChordPcs();
 const sug=[];for(let d=-12;d<=24;d++){const m=n+d;if(d&&strength(m,n,cp)==3)sug.push(N[m%12]+(Math.floor(m/12)-1))}$('khint').textContent='Сильные следующие ноты: '+sug.join(' ');
 if($('arpOn').checked){if($('latch').checked&&!Object.keys(down).length&&!arpHeldByTouch)held=[];arpHeldByTouch=true;if(!held.includes(n))held.push(n);down[n]=1;startArp()}else{down[n]=voice(S.patch.lead,n)}drawKb()}
let arpHeldByTouch=false;
function noteOff(n){const v=down[n];delete down[n];if(v&&v.stop)v.stop();if($('arpOn').checked&&!$('latch').checked){held=held.filter(x=>x!==n)}if(!Object.keys(down).length)arpHeldByTouch=false;drawKb()}
$('oDn').onclick=()=>{oct=Math.max(1,oct-1);$('oct').textContent=oct;drawKb()};$('oUp').onclick=()=>{oct=Math.min(6,oct+1);$('oct').textContent=oct;drawKb()};
$('kch').onchange=()=>{drawKb();drawRoll()};$('aoct').oninput=e=>$('aov').textContent=e.target.value;
let arpT=null,arpNext=0,arpI=0,arpDir=1;
function arpSeq(){const base=[...held];if(!base.length)return[];const sorted=$('apat').value==='ord'?base:[...base].sort((a,b)=>a-b),oc=+$('aoct').value,out=[];
 for(let o=0;o<oc;o++)sorted.forEach(n=>out.push(n+12*o));return out}
function startArp(){if(arpT)return;const c=ac();arpNext=c.currentTime+.02;arpI=0;arpDir=1;arpT=setInterval(()=>{const c=ac(),seq=arpSeq();if(!seq.length){clearInterval(arpT);arpT=null;return}
 const iv=60/S.bpm*4/+$('arate').value;while(arpNext<c.currentTime+.1){const pat=$('apat').value;let n;
  if(pat==='down')n=seq[seq.length-1-(arpI%seq.length)];else if(pat==='rnd')n=seq[Math.floor(Math.random()*seq.length)];
  else if(pat==='ud'){const L=seq.length;const per=Math.max(1,2*L-2);const k=arpI%per;n=seq[k<L?k:per-k]}else n=seq[arpI%seq.length];
  voice(S.patch.lead,n,arpNext,iv*.8);arpI++;arpNext+=iv}},25)}
$('achord').onclick=()=>{$('arpOn').checked=true;$('latch').checked=true;const i=+($('kch').value||0),[r,q]=S.chosen[i];held=chordNotes(r,q,12*(oct+1));startArp();drawKb()};
$('astop').onclick=()=>{held=[];down={};drawKb()};
// ---------- редактор звука
const PRM=[['w','Волна','sel',['sine','square','sawtooth','triangle','noise'],'Синус — чистый, без обертонов (808, саб). Квадрат — полый, «8-бит». Пила — яркая, жирная (бас, лиды, пэды). Треугольник — мягкий. Шум — все частоты (хэты, снейр).'],
 ['nz','Шум (микс)',0,1,.01,'Подмешать шум к волне: снейр = тон + шум.'],
 ['a','Атака',0,2,.001,'Время нарастания. 0 — щелчок/удар, 0.3+ — плавное «вплывание» (пэды).'],
 ['d','Спад',.01,3,.01,'Время спада к уровню сустейна. У ударных — это длина звука.'],
 ['s','Сустейн',0,1,.01,'Уровень, пока нота держится. 0 — звук сам затухает (перкуссия).'],
 ['r','Релиз',.01,3,.01,'Затухание после отпускания ноты. Длинный — хвост, короткий — сухо.'],
 ['pt','Высота (полутоны)',-36,48,1,'Сдвиг высоты. 12 полутонов = октава.'],
 ['pe','Пич-огибающая',-24,48,1,'Насколько выше звук стартует и «падает» к нужной ноте. Бочка: 24, 808 «панч»: 12.'],
 ['ptm','Время пич-ог.',.005,1,.005,'Как быстро высота падает. Длинное — «пиу»/глайд.'],
 ['ft','Тип фильтра','sel',['lowpass','highpass','bandpass'],'ФНЧ (lowpass) срезает верх — темнее. ФВЧ (highpass) срезает низ — тоньше (хэты). Полосовой — оставляет полосу (клэп, ковбелл).'],
 ['fc','Срез фильтра (Гц)',40,16000,10,'Частота среза. Ниже у ФНЧ — глуше, «лоу-фай».'],
 ['q','Резонанс',.1,20,.1,'Подъём на частоте среза — «писк», кислотный бас.'],
 ['v','Громкость',0,1,.01,'Громкость инструмента в миксе.']];
let curInst='kick';
TR.forEach(([id,nm])=>$('inst').add(new Option(nm,id)));
function openInst(id){curInst=id;$('inst').value=id;$$('nav button').find(b=>b.dataset.t==='snd').click()}
$('inst').onchange=e=>{curInst=e.target.value;drawParams()};
function drawParams(){const p=S.patch[curInst],D=$('params');D.innerHTML='';
 PRM.forEach(([k,l,a,b,st,h])=>{const r=document.createElement('div');r.className='prm';
  if(a==='sel'){r.innerHTML=`<span class="l">${l}</span><select>${b.map(o=>`<option ${o==p[k]?'selected':''}>${o}</option>`).join('')}</select>`;r.querySelector('select').onchange=e=>{p[k]=e.target.value;save();drawViz()}}
  else{r.innerHTML=`<span class="l">${l}</span><input type="range" min="${a}" max="${b}" step="${st}" value="${p[k]}"><span class="v">${p[k]}</span>`;const inp=r.querySelector('input');inp.oninput=()=>{p[k]=+inp.value;r.querySelector('.v').textContent=inp.value;save();drawViz()}}
  D.appendChild(r);const hh=document.createElement('div');hh.className='h';hh.textContent=h;D.appendChild(hh)});drawViz()}
function preview(){const id=curInst,ty=TR[TIX[id]][2];if(ty==='d')trig(id,0,0,0);else voice(S.patch[id],ty==='l'?72:rootNote(id==='pad'||id==='keys'?60:36,0),0,.6)}
$('prev').onclick=preview;$('pReset').onclick=()=>{S.patch[curInst]=JSON.parse(JSON.stringify(DEF[curInst]));save();drawParams()};
function wf(w,x){x=x-Math.floor(x);if(w==='sine')return Math.sin(2*Math.PI*x);if(w==='square')return x<.5?1:-1;if(w==='sawtooth')return 2*x-1;if(w==='triangle')return 1-4*Math.abs(x-.5);return Math.random()*2-1}
function drawViz(){const p=S.patch[curInst];let c=$('wave').getContext('2d'),W=360,H=90;c.clearRect(0,0,W,H);c.strokeStyle='#36c9a0';c.lineWidth=2;c.beginPath();
 for(let x=0;x<W;x++){const ph=x/W*3;let y=p.w==='noise'?wf('noise',ph):wf(p.w,ph)*(1-p.nz)+wf('noise',ph)*p.nz;c[x?'lineTo':'moveTo'](x,H/2-y*H*.4)}c.stroke();
 c.fillStyle='#999';c.font='11px sans-serif';c.fillText('Форма волны: '+p.w+(p.nz>0&&p.w!=='noise'?' + шум '+Math.round(p.nz*100)+'%':''),6,12);
 c=$('envc').getContext('2d');H=80;c.clearRect(0,0,W,H);const hold=p.s>0?.3:0,tot=p.a+p.d+hold+p.r,sx=x=>6+x/tot*(W-12),sy=v=>H-8-v*(H-22);
 c.strokeStyle='#ff3d6e';c.beginPath();c.moveTo(sx(0),sy(0));c.lineTo(sx(p.a),sy(1));c.lineTo(sx(p.a+p.d),sy(p.s));c.lineTo(sx(p.a+p.d+hold),sy(p.s));c.lineTo(sx(tot),sy(0));c.stroke();
 if(p.pe){c.strokeStyle='#ffb800';c.setLineDash([4,3]);c.beginPath();c.moveTo(sx(0),sy(Math.min(1,.4+p.pe/60)));c.lineTo(sx(Math.min(tot,p.ptm)),sy(.4));c.lineTo(sx(tot),sy(.4));c.stroke();c.setLineDash([])}
 c.fillStyle='#999';c.fillText('ADSR (красная)'+(p.pe?' · высота (жёлтая)':'')+' · '+tot.toFixed(2)+' с',6,12)}
// EQ
const EQL=['60 Гц','250 Гц','1 кГц','4 кГц','10 кГц'];
function drawEq(){const D=$('eq');D.innerHTML='';EQL.forEach((l,i)=>{const r=document.createElement('div');r.className='prm';r.innerHTML=`<span class="l">${l}</span><input type="range" min="-15" max="15" step="0.5" value="${S.eq[i]}"><span class="v">${S.eq[i]} дБ</span>`;
 const inp=r.querySelector('input');inp.oninput=()=>{S.eq[i]=+inp.value;r.querySelector('.v').textContent=inp.value+' дБ';if(eqN[i])eqN[i].gain.value=S.eq[i];save();drawEqC()};D.appendChild(r)});drawEqC()}
function drawEqC(){const c=$('eqc').getContext('2d'),W=360,H=90;c.clearRect(0,0,W,H);c.strokeStyle='#443a5c';c.beginPath();c.moveTo(0,H/2);c.lineTo(W,H/2);c.stroke();
 const fs=new Float32Array(W);for(let x=0;x<W;x++)fs[x]=20*Math.pow(1000,x/W);const tot=new Float32Array(W);
 if(AC&&eqN.length){const m=new Float32Array(W),ph=new Float32Array(W);eqN.forEach(b=>{b.getFrequencyResponse(fs,m,ph);for(let x=0;x<W;x++)tot[x]+=20*Math.log10(m[x])})}
 else for(let x=0;x<W;x++)EQF.forEach(([f,t],i)=>{const d=Math.log2(fs[x]/f);tot[x]+=S.eq[i]*(t==='lowshelf'?(d<0?1:Math.exp(-d*d*2)):t==='highshelf'?(d>0?1:Math.exp(-d*d*2)):Math.exp(-d*d*1.5))});
 c.strokeStyle='#ffb800';c.lineWidth=2;c.beginPath();for(let x=0;x<W;x++)c[x?'lineTo':'moveTo'](x,H/2-tot[x]*H/40);c.stroke();c.fillStyle='#999';c.font='11px sans-serif';c.fillText('20 Гц',2,H-3);c.fillText('20 кГц',W-40,H-3)}
$('eqReset').onclick=()=>{S.eq=[0,0,0,0,0];eqN.forEach(b=>b.gain.value=0);save();drawEq()};
// ---------- MIDI
const GM={kick:36,snare:38,clap:39,rim:37,hat:42,ohat:46,crash:49,ride:51,tomH:50,tomL:45,shaker:70,cowbell:56,perc:75};
function vlq(n){const b=[n&127];while(n>>=7)b.unshift((n&127)|128);return b}
function track(ev,name){ev.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const nm=[...new TextEncoder().encode(name)];let last=0,d=[0,255,3,nm.length,...nm];ev.forEach(([t,_,bytes])=>{d.push(...vlq(t-last),...bytes);last=t});d.push(0,255,47,0);
 return [77,84,114,107,d.length>>>24,(d.length>>16)&255,(d.length>>8)&255,d.length&255,...d]}
function midi(dr,ch){const s=24,tr=[],us=Math.round(6e7/S.bpm),swt=j=>j%2?Math.round(s*S.sw/100*.5):0;
 tr.push(track([[0,0,[255,81,3,us>>16,(us>>8)&255,us&255]]],'Tempo'));
 const notesOf=(id,fn,chn,nm)=>{const e=[];for(let b=0;b<4;b++)for(let j=0;j<16;j++)if(S.steps[id][j]){let len=1;while(j+len<16&&!S.steps[id][j+len])len++;fn(b,j,len).forEach(n=>{const t=b*384+j*s+swt(j);e.push([t,1,[0x90|chn,n,95]],[t+len*s-2,0,[0x80|chn,n,0]])})}if(e.length)tr.push(track(e,nm))};
 if(dr){const e=[];for(let b=0;b<4;b++)for(const id in GM)S.steps[id].forEach((on,j)=>{if(!on)return;const t=b*384+j*s+swt(j);e.push([t,1,[0x99,GM[id],100]],[t+12,0,[0x89,GM[id],0]])});tr.push(track(e,'Drums'));
  notesOf('b808',(b)=>[rootNote(36,b)],1,'808');notesOf('sub',(b)=>[rootNote(24,b)],1,'Sub')}
 if(ch){notesOf('bass',(b)=>[rootNote(36,b)],2,'Bass');const cn=(b,base)=>{const [r,q]=S.chosen[b%S.chosen.length];return chordNotes(r,q,base)};
  const anyPad=S.steps.pad.some(x=>x)||S.steps.keys.some(x=>x);
  if(anyPad){notesOf('pad',b=>cn(b,48),3,'Pad');notesOf('keys',b=>cn(b,60),4,'Keys')}else{const e=[];for(let b=0;b<4;b++)cn(b,48).forEach(n=>e.push([b*384,1,[0x93,n,90]],[b*384+380,0,[0x83,n,0]]));tr.push(track(e,'Chords'))}
  const e=[];for(let b=0;b<4;b++)S.roll.forEach((n,j)=>{if(n!=null){const t=b*384+j*s+swt(j);e.push([t,1,[0x95,n,100]],[t+s-2,0,[0x85,n,0]])}});if(e.length)tr.push(track(e,'Lead'))}
 const h=[77,84,104,100,0,0,0,6,0,1,0,tr.length,0,96];return new Uint8Array([...h,...tr.flat()])}
function dl(data,name){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'audio/midi'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),100)}
$('mDr').onclick=()=>dl(midi(1,0),'drums.mid');$('mCh').onclick=()=>dl(midi(0,1),'chords.mid');$('mAll').onclick=()=>dl(midi(1,1),'beat.mid');
// ---------- текст: ударения, размер, рифмы
const VW='аеёиоуыэюя',VU='АЕЁИОУЫЭЮЯ';const isV=c=>VW.includes(c.toLowerCase());
const SMAP=new Map();const FIX={буря:0,бури:0,честных:0,чудное:0,чудный:0};for(const k in STRESS)for(const w of STRESS[k].split(' '))SMAP.set(w,+k);for(const w in FIX)SMAP.set(w,FIX[w]);
const CLIT=new Set('и а но в во на не ни с со к ко у о об от до за из по же ли бы б ль ж я ты он мы вы их её ее мне мой твой мой свой что как так то там тут где кто чем при для без над под про через из-за или да нет вот уж лишь всё все бы тот эх ах ох ой ну'.split(' '));
function wstress(raw0){let mark=-1,raw='';for(const c of raw0){if((c==='+'||c==='\u0301')&&raw.length){mark=raw.length-1}else raw+=c}
 const lw=raw.toLowerCase(),vi=[];[...raw].forEach((c,i)=>{if(isV(c))vi.push(i)});const n=vi.length;if(!n)return{n:0};
 if(mark>=0&&vi.includes(mark))return{n,s:vi.indexOf(mark),k:1};
 const up=vi.filter(i=>VU.includes(raw[i])&&!(i===0&&raw.length>1&&raw.slice(1)!==raw.slice(1).toUpperCase()));if(up.length===1&&raw.slice(1)!==raw.slice(1).toUpperCase())return{n,s:vi.indexOf(up[0]),k:1};
 if(n===1)return{n,s:CLIT.has(lw)?-2:-3};const yo=lw.indexOf('ё');if(yo>=0)return{n,s:vi.indexOf(yo),k:1};
 const ew=lw.replace(/ё/g,'е'),d=SMAP.get(ew);if(d!==undefined&&d<n)return{n,s:d,k:1};
 for(const L of [4,3]){const f=SUF[ew.slice(-L)+Math.min(n,5)];if(f!==undefined&&ew.length>L)return{n,s:n-1-f,k:0}}return{n,s:-1}}
const METERS=[['Хорей',2,0],['Ямб',2,1],['Дактиль',3,0],['Амфибрахий',3,1],['Анапест',3,2]];
function meter(line){const ws=line.match(/[а-яёА-ЯЁ+\u0301]+/g)||[];const pat=[];let stressed=[],soft=[];
 ws.forEach(w=>{const r=wstress(w);for(let i=0;i<r.n;i++){const pos=pat.length;if(r.s>=0){if(i===r.s){pat.push('S');stressed.push(pos)}else pat.push('u')}else{pat.push('?');if(r.s===-3)soft.push(pos)}}});
 const syl=pat.length;const sch=pat.map(c=>c==='S'?'´':c==='u'?'∪':'·').join('');if(!syl)return null;
 if(stressed.length+soft.length<1)return{syl,sch,txt:'мало данных'};
 const fit=METERS.map(([nm,p,o])=>({nm,p,o,v:stressed.filter(x=>x<o||(x-o)%p).length,hit:stressed.filter(x=>x>=o&&(x-o)%p==0).length}));
 let ok=fit.filter(f=>f.v===0&&f.hit>0);
 if(stressed.length>=2){const t=ok.filter(f=>f.p===3);if(t.length)ok=t}
 let best=ok.sort((a,b)=>b.hit-a.hit)[0],note='';
 if(!best&&stressed.length>=4){const near=fit.filter(f=>f.v===1).sort((a,b)=>b.hit-a.hit)[0];if(near){best=near;note=' (с перебоем)'}}
 if(best){const all=[...stressed,...soft.filter(x=>x>=best.o&&(x-best.o)%best.p==0)],L=Math.max(...all);const feet=Math.floor((L-best.o)/best.p)+1;
  const lowConf=stressed.length<2?'?':'';return{syl,sch,txt:`${best.nm}${lowConf} ${feet}-стоп.${note}`}}
 const allS=[...stressed,...soft].sort((a,b)=>a-b),gaps=allS.slice(1).map((x,i)=>x-allS[i]-1);
 if(gaps.length&&gaps.every(g=>g===1||g===2))return{syl,sch,txt:`Дольник, ${allS.length} удар.`};
 if(gaps.length&&gaps.every(g=>g>=1&&g<=3))return{syl,sch,txt:`Тактовик, ${allS.length} удар.`};
 return{syl,sch,txt:`Тоника (акцентный), ${allS.length} удар.`}}
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function lstat(){S.lyr=$('lyr').value;save();$('lstat').innerHTML=S.lyr.split('\n').map(l=>{if(!l.trim())return'';const m=meter(l);if(!m)return'';
 return `<div class="ln"><span class="tx">${esc(l)}<br><span style="color:#777;letter-spacing:1px">${m.sch}</span></span><span class="m">${m.txt}<br><span style="color:#999">${m.syl} слог.</span></span></div>`}).join('')}
$('lyr').value=S.lyr||'';$('lyr').oninput=lstat;lstat();
const norm=w=>w.replace(/ё/g,'е');const DICT=[...new Set([...WORDS.map(norm),...SMAP.keys()])];
function rkey(w){const r=wstress(w),lw=norm(w.toLowerCase());const vi=[];[...lw].forEach((c,i)=>{if(isV(c))vi.push(i)});if(!vi.length)return lw;const s=r.s>=0?r.s:vi.length-1;return lw.slice(vi[s])}
let RK=null;
function rhyme(w0){const w=w0.trim();if(!w)return'';if(!RK)RK=DICT.map(d=>[d,rkey(d)]);const lw=norm(w.toLowerCase()),k=rkey(w);
 const exact=[],near=[];for(const [d,dk] of RK){if(d===lw)continue;if(dk===k)exact.push(d);else if(dk.length>=2&&k.length>=2&&dk.slice(-2)===k.slice(-2)&&dk[0]===k[0])near.push(d)}
 let h='';if(exact.length)h+='<div class="h">Точные (с ударной гласной «'+k+'»):</div>'+exact.slice(0,60).map(x=>`<span>${x}</span>`).join('');
 if(near.length)h+='<div class="h">Неточные/созвучные:</div>'+near.slice(0,40).map(x=>`<span>${x}</span>`).join('');
 return h||'Нет рифм в словаре — проверь ударение (ЗАГЛАВНАЯ гласная) или возьми синоним'}
$('rw').oninput=e=>$('rhymes').innerHTML=rhyme(e.target.value);
$('rlast').onclick=()=>{const t=$('lyr'),pos=t.selectionStart||t.value.length,line=t.value.slice(0,pos).split('\n').pop().trim()||t.value.trim().split('\n').pop()||'';const m=line.match(/[а-яёА-ЯЁ]+/g);if(m){$('rw').value=m.pop();$('rhymes').innerHTML=rhyme($('rw').value)}};
// ---------- навигация и старт
$('t-ref').innerHTML=REF;
$$('nav button').forEach(b=>b.onclick=()=>{$$('nav button,section').forEach(x=>x.classList.remove('on'));b.classList.add('on');$('t-'+b.dataset.t).classList.add('on');if(b.dataset.t==='keys')drawKb();if(b.dataset.t==='snd'){drawParams();drawEq()};window.scrollTo(0,0)});
$('bpm').value=S.bpm;$('swing').value=S.sw;$('swv').textContent=S.sw+'%';
render();drawGrid();drawParams();drawEq();window.addEventListener('resize',drawKb);
document.addEventListener('touchstart',()=>ac(),{once:true});
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
