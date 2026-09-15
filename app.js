const L = window.LAUNCHES.slice().sort((a,b)=> a.iso.localeCompare(b.iso));
const $ = s => document.querySelector(s);
const fmt = n => n>=1000 ? (n/1000).toFixed(1).replace(/\.0$/,'')+'K' : n;
const rate = x => x.replies/x.likes*100;

// verbatim claims
const CLAIMS = [
 ['We help companies launch their products and <b>guarantee a viral launch</b>.','homepage hero'],
 ['We are <b>the only company in the world</b> with the ability and track record to offer this guarantee.','homepage, method section'],
 ['A distribution network reaching <b>&gt; 300M views per month</b> across X and LinkedIn.','homepage, pillar 2'],
 ["Our algorithmic understanding of virality makes distribution <b>not a game of dice, but a guaranteed win</b>.",'/about, closing'],
 ['We only work with generational companies and <b>we have not failed once</b>.','/about, closing']
];
$('#claims').innerHTML = CLAIMS.map(([t,s])=>`<div class="claim"><p>&ldquo;${t}&rdquo;</p><cite>sociallcapital.com &mdash; ${s}</cite></div>`).join('');

// header stats
(function(){
 const likes=L.reduce((a,b)=>a+b.likes,0), replies=L.reduce((a,b)=>a+b.replies,0);
 $('#stats').innerHTML=[[L.length,'launches in evidence'],[fmt(likes),'X likes'],[fmt(replies),'replies'],
  [L.filter(x=>x.founder).length+'/9','founder-voiced'],[L.filter(x=>x.moneyHook).length+'/9','money-hooks'],['9/9','weekday afternoons']]
  .map(([b,s])=>`<div class="stat"><b>${b}</b><small>${s}</small></div>`).join('');
})();

// EXHIBIT A: money plot (ordered by raise size proxy)
const MONEYS = [
 ['Deel','$300M raise @ $17.3B',300,'story','Oct 2025'],
 ['PolyAI','$200M raise (Nvidia, Khosla)',200,'film','Feb 2026'],
 ['Cartesia','$100M raise (KP, Index, Lightspeed, NVIDIA)',100,'film','Oct 2025'],
 ['Superblocks','$60M raise',60,'film','May 2025'],
 ['PlayerZero','$20M raise + 5 famous angels',20,'film','Mar 2026'],
 ['Airwallex','$330M @ $8B + $1B ARR story',330,'story','Dec 2025'],
 ['Gamma','$2.1B Series B + $100M ARR',210,'film','Nov 2025'],
 ['Icon','Founders Fund backing (undisclosed)',25,'film','Feb 2025'],
 ['Wispr Flow','PORSCHE STUNT (no raise in hook)',5,'film','Feb 2026'],
];
(function(){
 const max=330;
 $('#money').innerHTML = MONEYS.map(([co,amt,v,fo,dt])=>`
  <div class="mrow"><span class="co">${co}<span class="amt">${amt} &middot; ${fo} &middot; ${dt}</span></span>
  <div class="mbar${co==='Wispr Flow'?' stunt':''}"><i style="width:${Math.max(10,v/max*100)}%">${co==='Wispr Flow'?'PORSCHE BOUNTY':('$'+v+'M')}</i></div>
  <span class="mnum">${fo==='film'?'FILM':'TEXT'}</span></div>`).join('') +
  `<p style="font-family:var(--font-sans);font-size:12px;color:var(--ink-muted);margin-top:16px;line-height:1.5;">Bar = capital scale highlighted directly in the opening hook. The two tallest bars (Airwallex, Deel) represent the two text-first founder confessionals &mdash; balance sheets so prominent they required zero cinematic video.</p>`;
})();

// EXHIBIT B: network graph (SVG, no deps)
(function(){
 const svg = document.getElementById('net');
 const NS='http://www.w3.org/2000/svg';
 const cx=320, cy=210;
 const mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e;};
 
 // center hub
 const hg=mk('g',{class:'node',style:'cursor:pointer'});
 hg.appendChild(mk('circle',{cx,cy,r:32,fill:'#181614',stroke:'#dfd8cb','stroke-width':3}));
 const ht=mk('text',{x:cx,y:cy+5,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#ffffff','font-family':'Plus Jakarta Sans, sans-serif','letter-spacing':'0.06em'});
 ht.textContent='SC';
 hg.appendChild(ht);
 const hl=mk('text',{x:cx,y:cy+50,'text-anchor':'middle','font-size':10.5,'font-weight':700,fill:'#6b6357','font-family':'Plus Jakarta Sans, sans-serif','letter-spacing':'0.05em'});
 hl.textContent='SOCIAL CAPITAL';
 hg.appendChild(hl);
 hg.addEventListener('click',()=>window.open('https://www.sociallcapital.com/','_blank'));
 svg.appendChild(hg);

 const n=L.length;
 L.forEach((x,i)=>{
  const a=(i/n)*Math.PI*2 - Math.PI/2;
  const R=150, nx=cx+Math.cos(a)*R*1.25, ny=cy+Math.sin(a)*R*0.72;
  
  // connection line
  const line=mk('line',{
    x1:cx, y1:cy, x2:nx, y2:ny,
    stroke: x.founder ? '#9e2a2b' : '#3b5066',
    'stroke-width': x.founder ? 1.75 : 2.5,
    'stroke-dasharray': x.founder ? 'none' : '4 3',
    opacity: 0.6
  });
  svg.appendChild(line);

  const g=mk('g',{style:'cursor:pointer'});
  const c=mk('circle',{
    cx:nx, cy:ny, r:22,
    fill: x.founder ? '#9e2a2b' : '#3b5066',
    stroke: '#ffffff',
    'stroke-width': 2.5
  });
  g.appendChild(c);

  const t=mk('text',{
    x:nx, y:ny+4,
    'text-anchor':'middle',
    'font-size':9.5,
    'font-weight':800,
    fill:'#ffffff',
    'font-family':'Plus Jakarta Sans, sans-serif',
    'letter-spacing':'0.02em'
  });
  t.textContent=x.company.slice(0,6);
  g.appendChild(t);

  const la=mk('text',{
    x:nx, y:ny+35,
    'text-anchor':'middle',
    'font-size':10.5,
    'font-weight':600,
    fill:'#181614',
    'font-family':'JetBrains Mono, monospace'
  });
  la.textContent=x.handle;
  g.appendChild(la);

  const tt=mk('title',{});
  tt.textContent=`${x.company} -- ${x.author} ${x.handle} (${x.founder?'Founder Voice':'Brand Account'}). ${fmt(x.likes)} likes, ${fmt(x.replies)} replies. Click to inspect original post.`;
  g.appendChild(tt);

  g.addEventListener('click',()=>window.open(x.xUrl,'_blank'));
  svg.appendChild(g);
 });
})();

// EXHIBIT C: timeline scrubber
(function(){
 const s=$('#tls'), card=$('#tlcard'), track=$('#tltrack');
 track.innerHTML=L.map((x,i)=>`<button class="tick${i===8?' on':''}" data-i="${i}">${x.date.replace(' ','<br>')}</button>`).join('');
 function show(i){
  const x=L[i];
  s.value=i;
  track.querySelectorAll('.tick').forEach((b,j)=>b.classList.toggle('on',j===i));
  card.innerHTML=`<div class="meta">Case ${i+1} of 9 &middot; ${x.date} &middot; ${x.weekday} at ${x.time} &middot; ${x.founder?'Personal Founder Account':'Brand Channel'} &middot; ${x.platform} &middot; ${fmt(x.likes)} likes / ${fmt(x.replies)} replies</div><h3>${x.company} &mdash; &ldquo;${x.hook.slice(0,90)}${x.hook.length>90?'...':''}&rdquo;</h3>${x.video?`<video controls preload="none" poster="${x.poster}"><source src="${x.video}" type="video/mp4"></video>`:''}`;
 }
 s.addEventListener('input',()=>show(+s.value));
 track.querySelectorAll('.tick').forEach(b=>b.addEventListener('click',()=>show(+b.dataset.i)));
 show(8);
})();

// EXHIBIT D: hook lab
const ARCH = {
 'Money-first raise':{t:c=>`${c.company} raised ${c.moneyDetail}. Today we are launching ${c.company==='Gamma'?'the future of presentations':c.company==='Cartesia'?'Sonic-3':c.company}: ${c.hook.slice(0,80)}...`,l:'Lever: CREDIBILITY & SIGNAL. Universal across X + LinkedIn. Standard formula for 8 of 9 launches.'},
 'Rejection story':{t:c=>`Stripe tried to buy us for $1.2B when we had $2M revenue. We said no. Today ${c.company} does $1B ARR. The story I never told:`,l:'Lever: HIGH-EMPATHY LIKES (Airwallex generated 29.7K likes). Rejection + vulnerability + massive revenue numbers.'},
 'Stunt challenge':{t:c=>`We offered 5 people a Porsche 911 GT3 RS if they can get ${c.company} to make a mistake. Today we launch on Android:`,l:'Lever: MASS REPLY VELOCITY (Wispr Flow generated 4.5K replies, 41.7% reply rate). High-stakes challenges trigger the algorithm\'s top signal.'},
 'Press-borrowed trust':{t:c=>`As shared by the NYT: ${c.company} raises at $2.1B led by a16z, hits $100M ARR profitably with 50 people.`,l:'Lever: REPUTATIONAL ARBITRAGE. The New York Times and a16z establish institutional credibility upfront.'},
 'Category punch':{t:c=>`Introducing ${c.company} -- the first AI agent for enterprise apps. Unlike Lovable, Replit and Bolt that only generate...`,l:'Lever: CONTRAST & POLARIZATION. Explicitly naming competitor incumbents drives debate and quote-shares.'}
};

(function(){
 const co=$('#labCo'), ar=$('#labArch');
 co.innerHTML=L.map((x,i)=>`<option value="${i}">${x.company}</option>`).join('');
 ar.innerHTML=Object.keys(ARCH).map(k=>`<option>${k}</option>`).join('');
 function go(){
  const c=L[+co.value], a=ARCH[ar.value];
  $('#labHook').textContent=a.t(c);
  $('#labLever').textContent=a.l+`  [ Rhetorical model derived from ${c.company}, ${c.date} ]`;
 }
 co.addEventListener('change',go);
 ar.addEventListener('change',go);
 co.value='3';
 ar.value='Stunt challenge';
 go();
})();

// EXHIBIT E: calculator
const QS = [
 ['You have raised $10M+ (or are at $1M+ ARR)','8/9 launches opened directly with capitalization milestones. Without capital, the core hook cannot function.','Every successful case possessed substantial pre-existing funding.'],
 ['The post goes out from the FOUNDER\'s personal account','8/9 launches originated from personal founder accounts.','Personal accounts generate up to 10x higher organic engagement than corporate accounts.'],
 ['You will launch on a weekday afternoon (1-6pm)','9/9 launches landed strictly in this temporal window.','Strict keynote discipline. Launch timing is engineered into the asset.'],
 ['Hook opens with money, stunt, or borrowed press (NYT/a16z)','9/9 hooks: 7 funding milestones + 1 luxury stunt + 1 institutional press feature.','The opening 15 words establish 80% of distribution trajectory.'],
 ['Asset matches track: film for devtool/AI, confessional text for fintech','7 cinematic films + 2 text-only confessionals, partitioned cleanly by sector.','Fintech requires trust and founder vulnerability; devtools require high-fidelity demos.']
];

(function(){
 const box=$('#calc');
 box.innerHTML=QS.map((q,i)=>`<label class="q"><input type="checkbox" data-i="${i}"><span><b>${q[0]}</b><small>${q[1]}<br>${q[2]}</small></span></label>`).join('');
 const upd=()=>{
  const n=box.querySelectorAll('input:checked').length, pct=n/5*100;
  $('#scorefill').style.width=pct+'%';
  const msg=n===5?'GUARANTEED QUALIFICATION: Identical to all 9 historic wins. You fit their exact underwriting profile.':
            n===4?'HIGH PROBABILITY: Single deviation from the canonical template. Close the gap before launch.':
            n===3?'UNCERTAIN / 50-50: Missing 40% of the prerequisite signals. Does not meet guaranteed criteria.':
            n<=2?'UNQUALIFIED: This is the profile screened out during client onboarding. Selection is the secret.':
            'Tick the boxes to evaluate eligibility.';
  $('#scoretext').textContent=`${n} of 5 Criteria Met &mdash; ${msg}`;
 };
 box.querySelectorAll('input').forEach(c=>c.addEventListener('change',upd));
})();

// FILM ROOM
function card(x){
 const r=rate(x).toFixed(1);
 const media=x.video?`<video controls preload="none" poster="${x.poster}"><source src="${x.video}" type="video/mp4"></video>`:`<div class="quote">&ldquo;${x.hook.slice(0,110)}...&rdquo;</div>`;
 return `<article class="card">${media}<div class="cbody"><div class="tags"><span class="tag hot">${x.date}</span><span class="tag">${x.platform}</span><span class="tag">${x.format}</span>${x.moneyHook?'<span class="tag">capital-hook</span>':''}</div><h3>${x.company}</h3><div class="author">${x.author} &middot; ${x.handle} &middot; ${x.weekday} ${x.time}</div><p class="hook">${x.full}</p><p class="hook decode">Analysis: ${x.take}</p><div class="nums"><span><b>${fmt(x.likes)}</b> likes</span><span><b>${fmt(x.replies)}</b> replies</span><span><b>${r}%</b> reply rate</span></div><div class="links"><a class="btn" href="${x.xUrl}" target="_blank" rel="noopener">Original Post</a><a class="btn ghost" href="${x.caseUrl}" target="_blank" rel="noopener">Case Study</a></div></div></article>`;
}

function render(){
 const q=($('#q').value||'').toLowerCase(), s=$('#fSort').value;
 let r=L.filter(x=>(x.company+' '+x.author+' '+x.handle+' '+x.hook+' '+x.full+' '+x.moneyDetail).toLowerCase().includes(q));
 const k={new:(a,b)=>b.iso.localeCompare(a.iso),liked:(a,b)=>b.likes-a.likes,replied:(a,b)=>b.replies-a.replies,rate:(a,b)=>rate(b)-rate(a)}[s];
 r=r.slice().sort(k);
 $('#grid').innerHTML=r.length?r.map(card).join(''):'<div class="empty">No matching records found in archive. Try &ldquo;Porsche&rdquo;, &ldquo;ARR&rdquo;, or &ldquo;Series B&rdquo;.</div>';
}

$('#q').addEventListener('input',render);
$('#fSort').addEventListener('change',render);
render();

$('#sources').innerHTML=L.map(x=>`<a href="${x.caseUrl}" target="_blank" rel="noopener">${x.company}</a>`).join('');
