const $=id=>document.getElementById(id);
const N=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const FIFTHS=[0,7,2,9,4,11,6,1,8,3,10,5];
const MODES={'Мажор':[0,2,4,5,7,9,11],'Натуральный минор':[0,2,3,5,7,8,10],'Гармонический минор':[0,2,3,5,7,8,11],'Дорийский':[0,2,3,5,7,9,10],'Фригийский':[0,1,3,5,7,8,10],'Миксолидийский':[0,2,4,5,7,9,10]};
const Q={'':[0,4,7],'m':[0,3,7],'dim':[0,3,6],'aug':[0,4,8],'7':[0,4,7,10],'m7':[0,3,7,10],'maj7':[0,4,7,11],'m9':[0,3,7,10,14]};
// [смещение от тоники, качество]
const G={
 'Трэп':[['i–VI–III–VII',[[0,'m'],[8,''],[3,''],[10,'']]],['i–iv–VI–V (гарм.)',[[0,'m'],[5,'m'],[8,''],[7,'']]],['i–bII–i–VII (фриг.)',[[0,'m'],[1,''],[0,'m'],[10,'']]],['i–VI–iv–i',[[0,'m'],[8,''],[5,'m'],[0,'m']]]],
 'Бум-бэп':[['i7–iv7–VII7–IIImaj7',[[0,'m7'],[5,'m7'],[10,'7'],[3,'maj7']]],['ii7–V7–Imaj7–vi7 (джаз)',[[2,'m7'],[7,'7'],[0,'maj7'],[9,'m7']]],['i7–VI maj7–ii°–V7',[[0,'m7'],[8,'maj7'],[2,'dim'],[7,'7']]]],
 'Лоу-фай':[['Imaj7–vi7–ii7–V7',[[0,'maj7'],[9,'m7'],[2,'m7'],[7,'7']]],['IVmaj7–iv7–iii7–vi7 (заимств. iv)',[[5,'maj7'],[5,'m7'],[4,'m7'],[9,'m7']]],['i9–iv9–bVII–IIImaj7',[[0,'m9'],[5,'m9'],[10,''],[3,'maj7']]]],
 'Дрилл':[['i–VI–iv–V',[[0,'m'],[8,''],[5,'m'],[7,'']]],['i–bII–VII–i',[[0,'m'],[1,''],[10,''],[0,'m']]],['i–iv–i–bVI–V',[[0,'m'],[5,'m'],[8,''],[7,'']]]],
 'Поп':[['I–V–vi–IV',[[0,''],[7,''],[9,'m'],[5,'']]],['vi–IV–I–V',[[9,'m'],[5,''],[0,''],[7,'']]],['I–bVII–IV–I (миксолид.)',[[0,''],[10,''],[5,''],[0,'']]],['I–IV–iv–I (минорная IV)',[[0,''],[5,''],[5,'m'],[0,'']]]],
 'Витч-хаус':[['i–bII–i–bII (фриг., медленно)',[[0,'m'],[1,''],[0,'m'],[1,'']]],['i–bVI–bII–v',[[0,'m'],[8,''],[1,''],[7,'m']]],['i–iv–bII–i°',[[0,'m'],[5,'m'],[1,''],[0,'dim']]]],
 'Классик хип-хоп':[['i7–iv7 (луп 90-х)',[[0,'m7'],[5,'m7'],[0,'m7'],[5,'m7']]],['i–bVII–bVI–V',[[0,'m'],[10,''],[8,''],[7,'']]]],
 'Тёмный / агрессивный':[['i–bII–bV–i (тритон)',[[0,'m'],[1,''],[6,''],[0,'m']]],['i–iv–bII–V',[[0,'m'],[5,'m'],[1,''],[7,'']]],['i–ii°–bVI–V',[[0,'m'],[2,'dim'],[8,''],[7,'']]],['i–bIII aug–iv–V',[[0,'m'],[3,'aug'],[5,'m'],[7,'']]]]
};
let key=9,mode='Натуральный минор',chosen=G['Трэп'][0][1];
const ac=()=>{if(!window._ac){window._ac=new (window.AudioContext||window.webkitAudioContext)();}if(_ac.state!=='running')_ac.resume();return _ac};
// ---------- аккорды
function cname(r,q){return N[(key+r)%12]+q.replace('dim','°')}
function playChord(r,q,t,d=1){const c=ac();t=t||c.currentTime;const base=48+((key+r)%12);
 Q[q].forEach(iv=>{const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=440*Math.pow(2,(base+iv-69)/12);
 f.type='lowpass';f.frequency.value=1400;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.08,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+d);
 o.connect(f).connect(g).connect(c.destination);o.start(t);o.stop(t+d+.05)});}
const inScale=(r,q)=>Q[q].every(iv=>MODES[mode].includes((r+iv)%12));
function chEl(r,q,sub){const d=document.createElement('div');d.className='ch'+(inScale(r,q)?'':' bor');d.innerHTML=cname(r,q)+'<small>'+sub+'</small>';d.onclick=()=>playChord(r,q);return d}
function render(){
 const sc=MODES[mode],dE=$('diat');dE.innerHTML='';const rom=['I','II','III','IV','V','VI','VII'];
 sc.forEach((s,i)=>{const t=sc[(i+2)%7]-s,f=sc[(i+4)%7]-s;const th=(t+12)%12,fi=(f+12)%12;const q=th==4?(fi==8?'aug':''):(fi==6?'dim':'m');
  dE.appendChild(chEl(s,q,q==''||q=='aug'?rom[i]:rom[i].toLowerCase()))});
 const P=$('progs');P.innerHTML='';G[$('genre').value].forEach(([nm,ch])=>{const b=document.createElement('div');b.className='prog';
  b.innerHTML='<b>'+nm+'</b> <button class="b">▶</button><button class="b">★</button><div class="chords"></div>';
  ch.forEach(([r,q])=>b.lastChild.appendChild(chEl(r,q,inScale(r,q)?'':'заимств.')));
  b.children[1].onclick=()=>{const c=ac(),t=c.currentTime+.05,sp=60/(+$('bpm').value)*2;ch.forEach(([r,q],i)=>playChord(r,q,t+i*sp,sp))};
  b.children[2].onclick=()=>{chosen=ch;showChosen()};P.appendChild(b)});
 drawCircle();showChosen();}
function showChosen(){$('chosen').innerHTML='Для MIDI/секвенсора: <b>'+chosen.map(c=>cname(...c)).join(' – ')+'</b>'}
function drawCircle(){let s='<svg viewBox="-110 -110 220 220">';FIFTHS.forEach((p,i)=>{const a=(i*30-90)*Math.PI/180,x=Math.cos(a)*85,y=Math.sin(a)*85,x2=Math.cos(a)*55,y2=Math.sin(a)*55,on=p==key;
 s+=`<g data-k="${p}"><circle cx="${x}" cy="${y}" r="17" fill="${on?'#ff3d6e':'#2d2442'}"/><text x="${x}" y="${y+5}" fill="#fff" font-size="13" text-anchor="middle">${N[p]}</text>
 <circle cx="${x2}" cy="${y2}" r="13" fill="${(p+9)%12==key?'#ffb800':'#221a33'}"/><text x="${x2}" y="${y2+4}" fill="#ccc" font-size="10" text-anchor="middle">${N[(p+9)%12]}m</text></g>`});
 s+='<text y="5" fill="#ffb800" text-anchor="middle" font-size="12">'+N[key]+'</text></svg>';$('circle').innerHTML=s;
 $('circle').querySelectorAll('g').forEach(g=>g.onclick=e=>{const k=+g.dataset.k;const minor=e.target.getAttribute('r')=='13'||e.target.getAttribute('font-size')=='10';
  key=minor?(k+9)%12:k;mode=minor?'Натуральный минор':'Мажор';$('key').value=key;$('mode').value=mode;render()})}
N.forEach((n,i)=>$('key').add(new Option(n,i)));Object.keys(MODES).forEach(m=>$('mode').add(new Option(m)));Object.keys(G).forEach(g=>$('genre').add(new Option(g)));
$('key').value=key;$('mode').value=mode;$('key').onchange=e=>{key=+e.target.value;render()};$('mode').onchange=e=>{mode=e.target.value;render()};$('genre').onchange=render;
// ---------- драмы
const TR=['Kick','Snare','Hat','OpenHat','Clap','Perc'],TRru=['Бочка','Снейр','Хэт','Откр.хэт','Клэп','Перк'],GM=[36,38,42,46,39,37];
const pat=s=>s.split(' ').map(r=>[...r].map(c=>c=='x'));
const PRE={
 'Трэп 140':[140,0,pat('x.......x.x..... ........x....... x.x.x.xxx.x.xxxx ......x......... ........x....... ...x.......x....')],
 'Бум-бэп 90':[90,35,pat('x......x..x..... ....x.......x... x.x.x.x.x.x.x.x. ..............x. ....x.......x... .......x........')],
 'Лоу-фай 80':[80,45,pat('x.....x...x..... ....x.......x... x.xxx.x.x.xxx.x. ................ ............x... ..x.......x.....')],
 'Дрилл 142':[142,0,pat('x.........x..... ......x.......x. x..x..x.x..x..x. ................ ......x.......x. ...x....x..x....')],
 'Поп 110':[110,0,pat('x...x...x...x... ....x.......x... x.x.x.x.x.x.x.x. ..x...x...x...x. ....x.......x... ................')],
 'Витч-хаус 70 (half-time)':[70,10,pat('x.........x..... ........x....... x...x...x...x.x. ......x.......x. ........x....... .......x.......x')],
 'Классик хип-хоп 92':[92,25,pat('x......xx.x..... ....x.......x... x.x.x.x.x.x.x.x. ................ ....x.......x... ................')],
 'Тёмный 150':[150,0,pat('x..x..x...x..x.. ........x....... x.x.x.x.x.x.x.x. ..............x. ........x....... .x...x...x...x..')]};
let grid=PRE['Трэп 140'][2].map(r=>[...r]),step=0,playing=false,nextT=0,timer,withCh=false;
Object.keys(PRE).forEach(p=>$('preset').add(new Option(p)));
function loadPre(){const [b,sw,p]=PRE[$('preset').value];grid=p.map(r=>[...r]);$('bpm').value=b;$('swing').value=sw;$('swv').textContent=sw+'%';drawGrid()}
$('preset').onchange=loadPre;$('swing').oninput=e=>$('swv').textContent=e.target.value+'%';
function drawGrid(){const g=$('grid');g.innerHTML='';grid.forEach((r,i)=>{const row=document.createElement('div');row.className='row';row.innerHTML='<span>'+TRru[i]+'</span>';
 r.forEach((on,j)=>{const c=document.createElement('div');c.className='st'+(on?' on':'');c.onclick=()=>{grid[i][j]=!grid[i][j];c.classList.toggle('on');if(grid[i][j])drum(i)};row.appendChild(c)});g.appendChild(row)})}
let nb;function noise(c){if(!nb){nb=c.createBuffer(1,c.sampleRate,c.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}const s=c.createBufferSource();s.buffer=nb;return s}
function env(c,t,v,d){const g=c.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);g.connect(c.destination);return g}
function drum(i,t){const c=ac();t=t||c.currentTime;
 if(i==0){const o=c.createOscillator();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);o.connect(env(c,t,1,.5));o.start(t);o.stop(t+.5)}
 if(i==1||i==4){const n=noise(c),f=c.createBiquadFilter();f.type=i==1?'highpass':'bandpass';f.frequency.value=i==1?1500:1200;n.connect(f);
  if(i==1){f.connect(env(c,t,.5,.2));const o=c.createOscillator();o.frequency.value=190;o.connect(env(c,t,.4,.1));o.start(t);o.stop(t+.2)}
  else[0,.01,.02].forEach(d=>f.connect(env(c,t+d,.5,.15)));n.start(t);n.stop(t+.3)}
 if(i==2||i==3){const n=noise(c),f=c.createBiquadFilter();f.type='highpass';f.frequency.value=7000;n.connect(f).connect(env(c,t,.3,i==2?.05:.3));n.start(t);n.stop(t+.35)}
 if(i==5){const o=c.createOscillator();o.type='triangle';o.frequency.value=800;o.connect(env(c,t,.4,.08));o.start(t);o.stop(t+.1)}}
function sched(){const c=ac(),sd=60/(+$('bpm').value)/4,sw=+$('swing').value/100;
 while(nextT<c.currentTime+.1){const t=nextT+(step%2?sd*sw*.5:0);grid.forEach((r,i)=>r[step]&&drum(i,t));
  if(withCh&&step==0){playChord(...chosen[bar%chosen.length],t,sd*16);bar++}
  const s=step;setTimeout(()=>document.querySelectorAll('.st').forEach((e,k)=>e.classList.toggle('cur',k%16==s)),Math.max(0,(t-c.currentTime)*1000));
  step=(step+1)%16;nextT+=sd}}
let bar=0;
$('play').onclick=()=>{if(playing){clearInterval(timer);playing=false;$('play').textContent='▶ Старт';return}const c=ac();step=0;bar=0;nextT=c.currentTime+.05;timer=setInterval(sched,25);playing=true;$('play').textContent='■ Стоп'};
$('clear').onclick=()=>{grid=grid.map(r=>r.map(()=>false));drawGrid()};
$('withch').onclick=()=>{withCh=!withCh;$('withch').textContent='Аккорды: '+(withCh?'вкл':'выкл')};
// ---------- MIDI
function vlq(n){const b=[n&127];while(n>>=7)b.unshift((n&127)|128);return b}
function track(ev){ev.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);let last=0,d=[];ev.forEach(([t,_,bytes])=>{d.push(...vlq(t-last),...bytes);last=t});d.push(0,255,47,0);
 return [77,84,114,107,d.length>>>24,(d.length>>16)&255,(d.length>>8)&255,d.length&255,...d]}
function midi(dr,ch){const tpq=96,s=24,tr=[];const us=Math.round(6e7/+$('bpm').value);
 const tempo=[[0,0,[255,81,3,us>>16,(us>>8)&255,us&255]]];
 if(dr){const e=[...tempo];for(let b=0;b<4;b++)grid.forEach((r,i)=>r.forEach((on,j)=>{if(!on)return;let t=b*16*s+j*s+(j%2?Math.round(s*(+$('swing').value/100)*.5):0);
  e.push([t,1,[0x99,GM[i],100]],[t+12,0,[0x89,GM[i],0]])}));tr.push(track(e))}
 if(ch){const e=dr?[]:[...tempo];for(let b=0;b<4;b++){const [r,q]=chosen[b%chosen.length],base=48+(key+r)%12;Q[q].forEach(iv=>{e.push([b*384,1,[0x90,base+iv,90]],[b*384+380,0,[0x80,base+iv,0]])})}tr.push(track(e))}
 const h=[77,84,104,100,0,0,0,6,0,1,0,tr.length,0,tpq];return new Uint8Array([...h,...tr.flat()])}
function dl(data,name){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'audio/midi'}));a.download=name;document.body.appendChild(a);a.click();a.remove()}
$('mDr').onclick=()=>dl(midi(1,0),'drums.mid');$('mCh').onclick=()=>dl(midi(0,1),'chords.mid');$('mAll').onclick=()=>dl(midi(1,1),'beat.mid');
// ---------- текст и рифмы
const V='аеёиоуыэюяАЕЁИОУЫЭЮЯ';$('lyr').value=localStorage.lyr||'';
function lstat(){localStorage.lyr=$('lyr').value;$('lstat').innerHTML=$('lyr').value.split('\n').map((l,i)=>{if(!l.trim())return'';const syl=[...l].filter(c=>V.includes(c)).length,st=[...l].filter(c=>'АЕЁИОУЫЭЮЯ'.includes(c)).length;
 const w=l.toLowerCase().match(/[а-яё]+/g)||[];return `${i+1}: <b>${syl}</b> слог.`+(st?`, ударений: ${st}`:`, слов: ${w.length}`)}).filter(Boolean).join(' · ')}
$('lyr').oninput=lstat;lstat();
const norm=w=>w.replace(/ё/g,'е');const DICT=WORDS.map(norm);
function rhyme(w0){let w=w0.trim();let stem;const si=[...w].map((c,i)=>'АЕЁИОУЫЭЮЯ'.includes(c)?i:-1).filter(i=>i>=0).pop();
 w=norm(w.toLowerCase());if(!w)return'';if(si!==undefined)stem=w.slice(si);else{const vs=[...w].map((c,i)=>V.includes(c)?i:-1).filter(i=>i>=0);stem=w.slice(vs.length>1?vs[vs.length-2]:Math.max(0,w.length-3))}
 const res=[];for(const d of DICT){if(d==w)continue;let k=0;while(k<d.length&&k<w.length&&d[d.length-1-k]==w[w.length-1-k])k++;if(k>=Math.min(stem.length,w.length-1)&&k>=2)res.push([k,d])}
 res.sort((a,b)=>b[0]-a[0]);return res.length?res.slice(0,60).map(r=>`<span style="margin-right:10px">${r[1]}</span>`).join(''):'Нет рифм в словаре — попробуй отметить ударение или другое слово'}
$('rw').oninput=e=>$('rhymes').innerHTML=rhyme(e.target.value);
$('rlast').onclick=()=>{const t=$('lyr'),before=t.value.slice(0,t.selectionStart||t.value.length).split('\n').pop()||t.value.trim().split('\n').pop()||'';const m=before.match(/[а-яёА-ЯЁ]+/g);if(m){$('rw').value=m.pop();$('rhymes').innerHTML=rhyme($('rw').value)}};
// ---------- справка
$('t-ref').innerHTML=`<h2>Как развить 4-тактовый луп</h2>
<details open><summary>Вопрос–ответ (call & response)</summary><p>Такты 1 и 3 — «вопрос» (мелодия уходит вверх, заканчивается на неустойчивой ступени: II, IV, VII). Такты 2 и 4 — «ответ» (возврат к тонике или V). В 4-м такте меняй конец ответа, чтобы луп «закрывался».</p></details>
<details><summary>Секвенция</summary><p>Возьми мотив из 3–5 нот и повтори его от другой ступени лада (на терцию или секунду ниже/выше). Ритм оставь тем же — ухо узнаёт мотив, но слышит развитие.</p></details>
<details><summary>Сохрани ритм — поменяй ноты</summary><p>Самый быстрый способ сделать вариацию: ритмический рисунок мелодии/808 не трогаешь, меняешь 1–2 ноты (обычно последнюю). Или наоборот: те же ноты, сдвинь одну на 1/16.</p></details>
<details><summary>Модальная замена (заимствованные аккорды)</summary><p>В миноре: bII (фригийский — мрачно, дрилл/трэп), V мажорный (гармонический минор — напряжение), IV мажорный (дорийский — светлее). В мажоре: iv минорная, bVI, bVII (из минора — «эпично»/грустно). Вставляй заимствованный аккорд в 4-й такт — это ломает предсказуемость.</p></details>
<details><summary>Ещё приёмы</summary><ul><li>Контрмелодия только в тактах 2 и 4.</li><li>Убирай элементы (drop): бочку перед припевом на такт.</li><li>Октавный сдвиг мелодии во втором проходе лупа.</li><li>808 играет тонику аккорда, но в 4-м такте — глайд на следующую ноту.</li><li>Автоматизируй фильтр: 8 тактов закрыт, потом открыт.</li></ul></details>
<h2>Барабаны по жанрам</h2>
<details><summary>Трэп (130–150 BPM, half-time)</summary><p>Снейр/клэп на 3-й доле (шаг 9). Хэты 1/8 или 1/16 + роллы (1/32, триоли) в конце фраз. Бочка синкопирована, часто вместе с 808. Свинг ~0.</p></details>
<details><summary>Бум-бэп (85–95 BPM)</summary><p>Бочка на 1 и «и» после 2-й доли, снейр на 2 и 4 (шаги 5 и 13). Хэты 1/8 со свингом 50–60% (свинг в приложении 30–45%). Ghost-ноты снейра тихие.</p></details>
<details><summary>Лоу-фай (70–90 BPM)</summary><p>Как бум-бэп, но мягче: сильный свинг, «ленивые» хэты, вариация громкости, бочка чуть позади сетки. Аккорды maj7/m9.</p></details>
<details><summary>Дрилл (140–145 BPM)</summary><p>Снейр на шагах 7 и 15 (смещён, «скользящий»), хэты с триольными паттернами и паузами, перк и 808-глайды. Бочка редкая.</p></details>
<details><summary>Поп (100–125 BPM)</summary><p>Бочка на каждую долю (four-on-the-floor) или 1 и 3, клэп на 2 и 4, открытый хэт на офф-бит.</p></details>
<details><summary>Тёмный / агрессивный (140–160)</summary><p>Ломаная бочка (3+3+2), мало хэтов, металлический перк, тритон и bII в гармонии, дисторшн на 808.</p></details>
<details><summary>Витч-хаус (60–75 BPM, half-time)</summary><p>Снейр на 3-й доле, редкая тяжёлая бочка, медленные хэты, много реверба и пауз. Гармония — фригийский/минор, bII, уменьшённые аккорды, тягучие пэды.</p></details>
<h2>Шпаргалка по ладам</h2><p>Мажор — светло. Натуральный минор — грусть. Гармонический минор — восток/напряжение (V мажор). Дорийский — минор посветлее (IV мажор), лоу-фай. Фригийский — самый тёмный (bII), дрилл. Миксолидийский — мажор с bVII, рок/поп.</p>`;
// ---------- навигация
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button,section').forEach(x=>x.classList.remove('on'));b.classList.add('on');$('t-'+b.dataset.t).classList.add('on')});
render();drawGrid();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
