/* =========================
   main.js (external bundle)
   ========================= */

/* 1) 스무스 앵커 스크롤 */
(function(){
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function(e) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#" || targetId.length <= 1) return;
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }, { passive: true });
    });
  });
})();

/* 2) 고정 헤더: 높이 반영 + 스크롤 방향 숨김/표시 + 회전텍스트 제어 */
(function(){
  const headerSec = document.getElementById('stickyTopbar');
  if(!headerSec) return;

  const bar = headerSec.querySelector('.topbar');
  const rotator = headerSec.querySelector('.fade-rotator');
  const hero = document.querySelector('#legalDBHero');

  function setHeroHeaderSpace(){
    if(!hero || !bar) return;
    const h = bar.getBoundingClientRect().height;
    hero.style.setProperty('--hdr-space', (h + 20) + 'px');
  }
  setHeroHeaderSpace();
  window.addEventListener('resize', setHeroHeaderSpace, { passive:true });

  let lastY = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;
  const threshold = 8;
  const minShowTop = 10;

  function onScroll(){
    const y = window.pageYOffset || document.documentElement.scrollTop;
    const dy = y - lastY;
    if(Math.abs(dy) > threshold){
      if(dy > 0 && y > bar.offsetHeight + 10){
        bar.style.transform = 'translate(-50%, -120%)';
      }else{
        bar.style.transform = 'translate(-50%, 0)';
      }
      lastY = y;
    }
    if(y <= minShowTop) bar.style.transform = 'translate(-50%, 0)';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if(!ticking){ requestAnimationFrame(onScroll); ticking = true; }
  }, { passive:true });

  function playRotate(){ rotator && rotator.classList.add('play'); }
  function stopRotate(){ rotator && rotator.classList.remove('play'); }

  if('IntersectionObserver' in window && rotator){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => { ent.isIntersecting ? playRotate() : stopRotate(); });
    }, { root:null, threshold:0.01 });
    io.observe(bar);
  }else{
    playRotate();
  }

  document.addEventListener('visibilitychange', () => {
    if(document.hidden) stopRotate();
    else { stopRotate(); requestAnimationFrame(playRotate); }
  });
})();

/* 3) energyHL: 행별 하이라이트 시퀀스 */
(function(){
  const root=document.getElementById('energyHL');
  if(!root)return;

  const STEP=parseInt(root.dataset.step||"650",10);
  const HOLD=parseInt(root.dataset.hold||"1300",10);
  const DARK=parseInt(root.dataset.dark||"600",10);

  const css=getComputedStyle(root);
  const cssDim=parseFloat(css.getPropertyValue('--dim'))||0.18;
  const cssBright=parseFloat(css.getPropertyValue('--bright'))||1;
  const ROOT_DIM=root.dataset.dim?parseFloat(root.dataset.dim):cssDim;
  const ROOT_BRIGHT=root.dataset.bright?parseFloat(root.dataset.bright):cssBright;
  const TXT_DIM=parseFloat(css.getPropertyValue('--txtDim'))||0.28;
  const rows=Array.from(root.querySelectorAll('.row'));

  function getLevels(row){
    const b=row.dataset.bright?parseFloat(row.dataset.bright):ROOT_BRIGHT;
    const d=row.dataset.dim?parseFloat(row.dataset.dim):ROOT_DIM;
    return {bright:isFinite(b)?b:1,dim:isFinite(d)?d:0.18};
  }
  function setRowState(row,on){
    const {bright,dim}=getLevels(row);
    const bg=row.querySelector('.bg');
    const shade=row.querySelector('.shade');
    const txt=row.querySelector('.txt');
    if(bg)bg.style.filter=`brightness(${on?bright:dim})`;
    if(shade)shade.style.opacity=on?0.06:1;
    if(txt)txt.style.opacity=on?1:TXT_DIM;
  }
  function allOff(){rows.forEach(r=>setRowState(r,false));}
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  async function run(){
    while(true){
      allOff();
      for(let i=0;i<rows.length;i++){
        setRowState(rows[i],true);
        await sleep(STEP);
      }
      await sleep(HOLD);
      allOff();
      await sleep(DARK);
    }
  }
  root.setHighlightLevels=function({dim,bright}={}){
    if(typeof dim==='number')root.dataset.dim=String(dim);
    if(typeof bright==='number')root.dataset.bright=String(bright);
    rows.forEach(r=>{
      const {bright:b,dim:d}=getLevels(r);
      const isOn=(r.querySelector('.txt').style.opacity||'')==='1';
      setRowState(r,isOn);
    });
  };
  run();
})();

/* 4) albuminWarn: 특정 HR 위치부터 배경을 흰색으로 부드럽게 전환 */
(function(){
  const section = document.getElementById('albuminWarn');
  const hr = document.getElementById('whiteStartHR');
  if (!section || !hr) return;

  function setGradientFromHR() {
    const dark = (getComputedStyle(section).getPropertyValue('--bg-dark') || '').trim() || '#0a0b0d';
    let secTop = 0, n = section;
    while (n) { secTop += (n.offsetTop || 0); n = n.offsetParent; }
    let hrTop = 0, m = hr;
    while (m) { hrTop += (m.offsetTop || 0); m = m.offsetParent; }
    const hrTopInSection = Math.max(0, hrTop - secTop);
    const secH = Math.max(1, section.scrollHeight);
    const offsetPx = 12;
    const startPct = Math.min(98, Math.max(0, ((hrTopInSection - offsetPx) / secH) * 100));
    const midPct = Math.min(99.5, startPct + 8);
    section.style.background = `linear-gradient(to bottom, ${dark} 0%, ${dark} ${startPct.toFixed(2)}%, #ffffff ${midPct.toFixed(2)}%, #ffffff 100%)`;
  }
  window.addEventListener('load', setGradientFromHR, { passive: true });
  window.addEventListener('resize', setGradientFromHR, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setGradientFromHR);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(setGradientFromHR);
    ro.observe(section); ro.observe(hr);
  }
  requestAnimationFrame(setGradientFromHR);
})();

/* 5) legalDBHero: 배경 비디오 가시성 재생/일시정지 */
(function(){
  const hero = document.querySelector('#legalDBHero');
  const video = hero?.querySelector('.bg-video');
  if(!video) return;
  video.muted = true;
  video.playsInline = true;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const p = video.play(); if (p && typeof p.catch === 'function') p.catch(()=>{});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.1 });
  io.observe(hero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else { const p = video.play(); if (p && typeof p.catch === 'function') p.catch(()=>{}); }
  });
})();

/* 6) legalDBHero: DB 스택 티커 (상단 5개 유지) */
(function(){
  const root = document.querySelector('#legalDBHero');
  if(!root) return;
  const track = root.querySelector('.dbTrack');
  const stack = root.querySelector('.dbStack');
  if(!track || !stack) return;

  const VISIBLE = 5, GAP = 10, INTERVAL = 2600;
  const DB_LIST = [
    { city:'서울', age:'14년', overdue:'아파트',   debt:'김**', memo:'녹물,난방 문제', time:'오늘 13:42' },
    { city:'부산', age:'10년', overdue:'빌라',     debt:'한**', memo:'이물질, 녹물',   time:'오늘 13:55' },
    { city:'대구', age:'6년',  overdue:'아파트',   debt:'김**', memo:'난방 문제',      time:'오늘 14:10' },
    { city:'수원', age:'18년', overdue:'단독주택', debt:'이**', memo:'녹물이 심해요',  time:'오늘 14:22' },
    { city:'인천', age:'21년', overdue:'아파트',   debt:'최**', memo:'세탁물 녹물',    time:'오늘 14:35' },
    { city:'대전', age:'8년',  overdue:'아파트',   debt:'손**', memo:'오물, 녹물 심함', time:'오늘 14:48' },
    { city:'창원', age:'12년', overdue:'오피스텔', debt:'한**', memo:'급히 상담 요청', time:'오늘 15:02' }
  ];

  function createCard(d){
    const el = document.createElement('div');
    el.className = 'db-card enter';
    el.innerHTML = `
      <div class="db-avatar"></div>
      <div class="db-main">
        <p class="db-title">${d.city} · 준공 ${d.age} · ${d.overdue}</p>
        <p class="db-sub">${d.debt} · ${d.memo} <span style="color:var(--muted);font-size:.9em">(${d.time})</span></p>
      </div>`;
    requestAnimationFrame(()=>el.classList.add('is-in'));
    return el;
  }
  function shiftUp(by){
    track.classList.add('is-shifting');
    track.style.transform = `translateY(-${by}px)`;
    return new Promise(res=>{
      const onEnd=()=>{track.removeEventListener('transitionend',onEnd);res();};
      track.addEventListener('transitionend',onEnd,{once:true});
    }).then(()=>{track.classList.remove('is-shifting');track.style.transform='translateY(0)';});
  }

  let idx=0, timer=null, cardH=64;
  function prime(){
    const init=Math.min(VISIBLE, DB_LIST.length);
    for(let i=0;i<init;i++) pushNext();
    if(track.children.length) cardH=track.children[0].getBoundingClientRect().height;
  }
  function pushNext(){
    const data=DB_LIST[idx%DB_LIST.length]; idx++;
    const card=createCard(data); track.appendChild(card);
    const cards=track.children;
    if(cards.length>VISIBLE){
      const first=cards[0];
      shiftUp(cardH+GAP).then(()=>first.remove());
    }
  }
  function schedule(){ clearInterval(timer); timer=setInterval(()=>pushNext(), INTERVAL); }
  stack.addEventListener('mouseenter',()=>clearInterval(timer));
  stack.addEventListener('mouseleave',schedule);

  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{ e.isIntersecting ? schedule() : clearInterval(timer); });
  },{threshold:.2});
  io.observe(stack);
  prime();
})();

/* 7) legalDBHero: 우측 리스트 pulse 순환 */
(function(){
  const root=document.querySelector('#legalDBHero'); if(!root) return;
  const list=root.querySelector('.right ul'); if(!list) return;
  const items=[...list.querySelectorAll('li')]; if(!items.length) return;
  let idx=0, timer=null, playing=false; const STEP=3000;

  function tick(){
    items.forEach(li=>li.classList.remove('pulse'));
    items[idx].classList.add('pulse');
    idx=(idx+1)%items.length;
  }
  function start(){ if(playing) return; playing=true; tick(); timer=setInterval(tick,STEP); }
  function stop(){ if(!playing) return; playing=false; clearInterval(timer); timer=null; }

  const io=new IntersectionObserver(ents=>{
    ents.forEach(e=>{ e.isIntersecting ? start() : stop(); });
  },{threshold:.15});
  io.observe(list);
  start();
})();

/* 8) Mosaic Gallery Lite: 라이트박스 + 카드 리빌 + 마지막 줄 채우기 */
(function(){
  const scope = document.querySelector('#mosaicGalleryLite');
  if(!scope) return;

  /* Lightbox */
  (function(){
    const cards = Array.from(scope.querySelectorAll('.image_container'));
    const lb = scope.querySelector('[data-lightbox]');
    if(!lb || !cards.length) return;

    const dialog = lb.querySelector('.lb-dialog');
    const imgEl = lb.querySelector('.lb-img');
    const nameEl = lb.querySelector('.lb-name');
    const ratingEl = lb.querySelector('.lb-rating');
    const reviewEl = lb.querySelector('.lb-review');
    const btnPrev = lb.querySelector('.lb-prev');
    const btnNext = lb.querySelector('.lb-next');
    const btnClose = lb.querySelector('.lb-x');
    const btnCloseFixed = lb.querySelector('.lb-x-fixed');
    const swipeArea = lb.querySelector('[data-swipe-area]');

    const items = cards.map((card, idx) => ({
      idx,
      src: card.querySelector('img').getAttribute('src'),
      alt: card.querySelector('img').getAttribute('alt') || '고객 후기 이미지',
      name: card.dataset.name || '고객',
      rating: parseFloat(card.dataset.rating || '5'),
      review: card.dataset.review || ''
    }));
    let current = 0;
    function stars(n){ const pct = Math.max(0, Math.min(100, (n/5)*100)); return `<span class="stars" style="--w:${pct}%;" aria-hidden="true"></span><span class="rating-num">(${n.toFixed(1)})</span>`; }
    function render(index){ const it = items[index]; current=index; imgEl.src=it.src; imgEl.alt=it.alt; nameEl.textContent=it.name; ratingEl.innerHTML=stars(it.rating); reviewEl.textContent=it.review; }
    function open(i){ render(i); lb.classList.add('show'); const preferFixed=window.matchMedia('(max-width: 720px)').matches; setTimeout(()=> (preferFixed ? btnCloseFixed : btnNext).focus(),0); document.documentElement.style.overflow='hidden'; }
    function close(){ lb.classList.remove('show'); document.documentElement.style.overflow=''; }
    function prev(){ render((current-1+items.length)%items.length); }
    function next(){ render((current+1)%items.length); }
    cards.forEach((c,i)=>c.addEventListener('click',()=>open(i),{passive:true}));
    btnPrev?.addEventListener('click',prev);
    btnNext?.addEventListener('click',next);
    btnClose?.addEventListener('click',close);
    btnCloseFixed?.addEventListener('click',close);
    document.addEventListener('keydown',(e)=>{ if(!lb.classList.contains('show'))return; if(e.key==='Escape')close(); if(e.key==='ArrowLeft')prev(); if(e.key==='ArrowRight')next(); });
    lb.addEventListener('click',(e)=>{ if(!dialog.contains(e.target)) close(); });

    // Swipe
    let down=false, sx=0, dx=0, th=50;
    function setX(x){ imgEl.style.transform=`translateX(${x}px)`; }
    function clearX(){ imgEl.style.transition='transform .18s ease'; imgEl.style.transform='translateX(0)'; setTimeout(()=>{ imgEl.style.transition=''; },200); }
    function onDown(e){ if(!lb.classList.contains('show'))return; down=true; sx=(e.touches?e.touches[0].clientX:e.clientX); dx=0; }
    function onMove(e){ if(!down)return; const x=(e.touches?e.touches[0].clientX:e.clientX); dx=x-sx; setX(dx*.9); }
    function onUp(){ if(!down)return; down=false; if(Math.abs(dx)>th){ dx<0?next():prev(); } clearX(); }
    swipeArea?.addEventListener('mousedown',onDown);
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);
    swipeArea?.addEventListener('touchstart',onDown,{passive:true});
    swipeArea?.addEventListener('touchmove',onMove,{passive:true});
    swipeArea?.addEventListener('touchend',onUp);
    swipeArea?.addEventListener('dblclick',e=>e.preventDefault());
  })();

  /* 카드 fadeInUp 리빌 */
  (function(){
    const cards = Array.from(scope.querySelectorAll('.image_container'));
    if(!cards.length) return;
    cards.forEach((el,i)=>{ el.classList.add('mgl-reveal'); el.style.setProperty('--i', i%8); });
    const io = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        const el = entry.target;
        if(entry.isIntersecting){ el.classList.remove('in'); requestAnimationFrame(()=>el.classList.add('in')); }
        else{ el.classList.remove('in'); }
      });
    }, {threshold:0, rootMargin:'0px'});
    cards.forEach(el=>io.observe(el));
  })();

  /* 마지막 줄 채우기 보정 */
  (function(){
    const grid = scope.querySelector('.gallary_container');
    if(!grid) return;
    const mqMobile = window.matchMedia('(max-width: 640px)');
    const originals = Array.from(grid.children);

    function restoreOrder(){
      originals.forEach(node => grid.appendChild(node));
      Array.from(grid.children).forEach(el=>{
        el.style.gridColumn = '';
        el.style.gridRow = '';
        el.removeAttribute('data-lastfill');
      });
    }
    function colCount(){
      const cols = getComputedStyle(grid).gridTemplateColumns;
      return cols ? cols.split(' ').length : 1;
    }
    function groupRows(){
      const items = Array.from(grid.children);
      const map = new Map();
      items.forEach(el=>{
        const t = el.offsetTop;
        if(!map.has(t)) map.set(t, []);
        map.get(t).push(el);
      });
      const rows = Array.from(map.entries()).sort((a,b)=>a[0]-b[0]).map(([,els])=>els);
      return rows;
    }
    function distributeSpans(list, cols){
      const n = list.length;
      const base = Math.floor(cols / n);
      let rem = cols % n;
      list.forEach((el, i) => {
        const span = base + (i < rem ? 1 : 0);
        el.style.gridColumn = `span ${span} / auto`;
        el.dataset.lastfill = '1';
      });
    }
    function layoutLastRow(){
      if(mqMobile.matches){ restoreOrder(); return; }
      restoreOrder();
      const cols = colCount();
      if(cols <= 0) return;
      const rows = groupRows();
      if(rows.length === 0) return;
      const last = rows[rows.length - 1];
      const n = last.length;

      if(n === 1 && rows.length >= 2){
        const prev = rows[rows.length - 2].slice();
        const single = last[0];
        const anchor = prev[prev.length - 1];
        grid.insertBefore(single, anchor.nextSibling);
        const merged = [...prev, single];
        distributeSpans(merged, cols);
      } else if(n > 1 && n < cols){
        distributeSpans(last, cols);
      }
    }
    const debounce=(fn,ms=120)=>{let t; return ()=>{clearTimeout(t); t=setTimeout(fn,ms);} };
    const onResize = debounce(layoutLastRow);
    window.addEventListener('resize', onResize);
    window.addEventListener('load', layoutLastRow);
    setTimeout(layoutLastRow, 300);
    setTimeout(layoutLastRow, 900);
  })();
})();

/* 9) pipeSelfCheck: 체크/디테일/CTA 토글 */
(function(){
  const root=document.getElementById('pipeSelfCheck');
  if(!root)return;
  const rows=[...root.querySelectorAll('[data-item]')];
  const cta=root.querySelector('[data-cta]');
  function toggleDetail(row,on){const d=row.querySelector('.detail');if(!d)return;on?d.classList.add('open'):d.classList.remove('open');}
  function update(){const any=rows.some(r=>r.querySelector('input')?.checked); cta && cta.classList.toggle('isHidden',!any);}
  rows.forEach(r=>{
    const chk=r.querySelector('input');
    const q=r.querySelector('.q');
    if(!chk || !q) return;
    q.addEventListener('click',()=>{chk.checked=!chk.checked;toggleDetail(r,chk.checked);update();});
    chk.addEventListener('change',()=>{toggleDetail(r,chk.checked);update();});
  });
  update();
})();

/* 10) processFlowMint_v2: 등장 애니메이션 */
(function(){
  const root = document.querySelector('#processFlowMint_v2');
  if(!root || !('IntersectionObserver' in window)) return;
  const items = root.querySelectorAll('.pill');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [{ transform: 'translateY(10px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
          { duration: 420, easing: 'cubic-bezier(.2,.6,.2,1)', fill: 'forwards' }
        );
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
})();

/* 11) hbReasons: 세로 카드 슬라이더(중앙 추적) */
(function(){
  const root = document.querySelector('#hbReasons');
  if(!root) return;
  const rail = root.querySelector('.rail');
  const frame = root.querySelector('.frame');
  if(!rail || !frame) return;

  const getCards = () => Array.from(rail.querySelectorAll('.card'));
  const getStep = () => {
    const cs = getComputedStyle(root);
    return (parseFloat(cs.getPropertyValue('--cardH'))||0) + (parseFloat(cs.getPropertyValue('--gap'))||0);
  };
  const INTERVAL = 2000;
  let timer = null; let animRAF = null; let locked = false;

  function updateCenterByPoint(){
    const rect = frame.getBoundingClientRect();
    const midX = rect.left + rect.width/2;
    const midY = rect.top + rect.height/2;
    const el = document.elementFromPoint(midX, midY);
    const centerCard = el && el.closest ? el.closest('.card') : null;
    getCards().forEach(c=>c.classList.toggle('is-center', c === centerCard));
  }
  function startCenterTracker(){
    if(animRAF) return;
    const tick = ()=>{ updateCenterByPoint(); animRAF = requestAnimationFrame(tick); };
    animRAF = requestAnimationFrame(tick);
  }
  function stepUp(){
    if(locked) return; locked = true;
    const CARD_STEP = getStep();
    rail.style.transition = `transform var(--t) var(--e)`;
    const m = new DOMMatrixReadOnly(getComputedStyle(rail).transform);
    const currentY = m.m42 || 0;
    rail.style.transform = `translateY(${currentY - CARD_STEP}px)`;
    const onEnd = () => {
      rail.removeEventListener('transitionend', onEnd);
      const first = getCards()[0];
      rail.appendChild(first);
      rail.style.transition = 'none';
      rail.style.transform = `translateY(${currentY}px)`;
      locked = false;
      requestAnimationFrame(updateCenterByPoint);
    };
    rail.addEventListener('transitionend', onEnd, {once:true});
  }
  function start(){ if(!timer) timer = setInterval(stepUp, INTERVAL); startCenterTracker(); }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }

  updateCenterByPoint(); start();
  document.addEventListener('visibilitychange', ()=>{ document.hidden ? stop() : start(); });
  frame.addEventListener('mouseenter', stop);
  frame.addEventListener('mouseleave', start);
  frame.addEventListener('focusin', stop);
  frame.addEventListener('focusout', start);
  window.addEventListener('resize', ()=>{ requestAnimationFrame(updateCenterByPoint); }, { passive:true });
  window.addEventListener('load', ()=>{ requestAnimationFrame(updateCenterByPoint); }, { passive:true });
})();

/* 12) applyMintForm: select 래핑(화살표) */
(function(){
  const root = document.querySelector('#applyMintForm');
  if(!root) return;
  const selects = root.querySelectorAll('select');
  selects.forEach(function(sel){
    if(sel.closest('.select-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'select-wrap';
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);

    const open = ()=>wrap.classList.add('open');
    const close = ()=>wrap.classList.remove('open');

    sel.addEventListener('focus', open);
    sel.addEventListener('click', open);
    sel.addEventListener('mousedown', open);
    sel.addEventListener('touchstart', open, {passive:true});
    sel.addEventListener('blur', close);
    sel.addEventListener('change', close);
    sel.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
  });
})();

/* 13) applyMintForm: 개인정보 모달 + 푸터 z-index 안전 제어 */
(function(){
  const root = document.querySelector('#applyMintForm');
  if(!root) return;
  const form = root.querySelector('#applyForm');
  if(!form) return;

  const agreeBox = form.querySelector('#agree');
  const agreeTextSpan = form.querySelector('.agree span');

  const footer = document.getElementById('siteFooter');
  let prevFooterZ = null;

  (function injectFooterRule(){
    const style = document.createElement('style');
    style.textContent = `html.__modal-open #siteFooter{ z-index:-1 !important; }`;
    document.head.appendChild(style);
  })();

  function lowerFooter(){
    document.documentElement.classList.add('__modal-open');
    if(footer){
      prevFooterZ = footer.style.zIndex || '';
      footer.style.zIndex = '-1';
    }
  }
  function restoreFooter(){
    document.documentElement.classList.remove('__modal-open');
    if(footer){
      if(prevFooterZ) footer.style.zIndex = prevFooterZ;
      else footer.style.removeProperty('z-index');
      prevFooterZ = null;
    }
  }

  const termsBtn = document.createElement('button');
  termsBtn.type = 'button';
  termsBtn.className = 'terms-link';
  termsBtn.textContent = '자세히 보기';
  termsBtn.setAttribute('aria-haspopup','dialog');
  if(agreeTextSpan){
    agreeTextSpan.appendChild(document.createTextNode(' '));
    agreeTextSpan.appendChild(termsBtn);
  }

  // 이미 overlay가 있으면 재사용
    let overlay = root.querySelector('.terms-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'terms-overlay';
      overlay.setAttribute('hidden', '');
      overlay.innerHTML = `
     <div class="terms-sheet" role="dialog" aria-modal="true" aria-labelledby="termsTitle" tabindex="-1">
        <div class="terms-header">
          <h3 id="termsTitle" class="terms-title">개인정보 처리방침</h3>
          <button type="button" class="terms-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="terms-body" id="termsBody">
          정우세무회계사무소 소상공인정책 자금 지원센터(이하 ‘회사’라 한다)는 개인정보 보호법 제30조에 따라 정보 주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립, 공개합니다. <br><br><b>제1조 (개인정보의 처리목적) </b><br> 회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.<br><br> 1. 홈페이지 회원 가입 및 관리 회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별․인증, 회원자격 유지․관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정 이용 방지, 만 14세 미만 아동의 개인정보처리 시 법정대리인의 동의 여부 확인, 각종 고지․통지, 고충 처리 등을 목적으로 개인정보를 처리합니다. <br> 2. 재화 또는 서비스 제공 물품 배송, 서비스 제공, 계약서 및 청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금 결제 및 정산, 채권추심 등을 목적으로 개인정보를 처리합니다. <br> 3. 고충 처리 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락․통지, 처리 결과 통보 등의 목적으로 개인정보를 처리합니다.<br><br><b>제2조 (개인정보의 처리 및 보유기간)</b><br> 회사는 대출 계약의 체결ㆍ유지ㆍ이행ㆍ관리 및 상품서비스의 제공을 위한 필수정보 및 선택정보를 다음 각 호와 같이 수집하고 있습니다.<br><br> 가. 개인정보의 항목<br> ① 회사는 법령에 따른 개인정보 보유, 이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유, 이용 기간 내에서 개인정보를 처리, 보유합니다.<br> ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.<br> ③ 개인정보수집은 상담을 위해 연락처, 성함을 수집합니다.<br><br> 1. 홈페이지 회원 가입 및 관리 : 사업자/단체 홈페이지 탈퇴 시까지 다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지 <br> 1) 관계 법령 위반에 따른 수사, 조사 등이 진행 중인 경우에는 해당 수사, 조사 종료 시까지 <br> 2) 홈페이지 이용에 따른 채권 및 채무관계 잔존 시에는 해당 채권, 채무 관계 정산 시까지<br><br><b>제3조(이용자 및 법정대리인의 권리와 그 행사 방법)</b><br> 1. 개인정보 열람 요구<br> 2. 오류 등이 있을 경우 정정 요구 <br> 3. 삭제요구 <br> 4. 처리정지 요구 <br><br> ② 제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다. <br> ③ 정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다. <br> ④ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다. <br> ⑤ 정보주체는 개인정보 보호법 등 관계 법령을 위반하여 회사가 처리하고 있는 정보주체 본인이나 타인의 개인정보 및 사생활을 침해하여서는 아니 됩니다.<br><br><b>제4조(개인정보의 파기)</b><br> ① 회사는 개인정보 보유 기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.<br> ② 정보주체로부터 동의받은 개인정보 보유 기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.<br> ③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.<br> 1. 파기 절차<br> 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.<br> 2. 파기 방법<br> 회사는 전자적 파일 형태로 기록․저장된 개인정보는 기록을 재생할 수 없도록 로우레밸포멧(Low Level Format) 등의 방법을 이용하여 파기하며, 종이 문서에 기록․저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.<br><br><b>제5조(개인정보의 안전성 확보조치)</b><br> 회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 하고 있습니다.<br> 1. 관리적 조치 : 내부관리계획 수립 및 시행, 정기적 직원 교육 등<br> 2. 기술적 조치 : 개인정보처리시스템 등의 접근 권한 관리, 접근통제시스템 설치, 고유 식별정보 등의 암호화, 보안프로그램 설치<br> 3. 물리적 조치 : 전산실, 자료보관실 등의 접근통제<br><br><b>제6조(개인정보 자동 수집 장치의 설치∙운영 및 거부에 관한 사항) </b><br> ① 회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다.<br> ② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에 보내는 소량의 정보이며 이용자들의 컴퓨터 내의 하드디스크에 저장되기도 합니다.<br> 가. 쿠키의 사용 목적: 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부, 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.<br> 나. 쿠키의 설치∙운영 및 거부 : 웹브라우저 상단의 도구&gt;인터넷 옵션&gt;개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부 할 수 있습니다.<br> 다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.<br><br><b>제7조(개인정보 보호책임자) </b><br> ① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만 처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.<br><br> ▶ 개인정보 보호책임자<br> 성명 : 전진현<br> 직책 : 대표<br> 연락처 : 010-5631-6607<br> 이메일 : sosang01help@gmail.com<br><br><b>제8조(개인정보 열람청구) </b><br> 정보주체는 개인정보 보호법 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람 청구가 신속하게 처리되도록 노력하겠습니다.<br><br><b>제9조(권익침해 구제 방법) </b><br> 정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.<br><br> ▶ 개인정보 침해신고센터 (한국인터넷진흥원 운영)<br> - 소관 업무 : 개인정보 침해사실 신고, 상담 신청<br> - 홈페이지 : privacy.kisa.or.kr<br> - 전화 : (국번없이) 118<br> - 주소 : (58324) 전남 나주시 진흥길 9(빛가람동 301-2) 3층 개인정보침해신고센터<br><br> ▶ 개인정보 분쟁조정위원회<br> - 소관업무 : 개인정보 분쟁조정신청, 집단분쟁조정 (민사적 해결)<br> - 홈페이지 : www.kopico.go.kr<br> - 전화 : (국번없이) 1833-6972<br> - 주소 : (03171)서울특별시 종로구 세종대로 209 정부서울청사 4층<br><br> ▶ 대검찰청 사이버범죄수사단 : 02-3480-3573 (www.spo.go.kr)<br> ▶ 경찰청 사이버안전국 : 182 (http://cyberbureau.police.go.kr)<br><br><b>제10조(개인정보 처리방침 시행 및 변경)</b><br> 이 개인정보 처리방침은 2023. 4. 1 부터 적용됩니다.<br>
        </div>
        <div class="terms-footer">
          <label class="agree-mini">
            <input type="checkbox" id="termsInlineAgree">
            <span>상기 개인정보 처리 안내를 확인했습니다.</span>
          </label>
          <div style="display:flex; gap:8px; margin-left:auto; width:auto;">
            <button type="button" class="btn btn-outline terms-cancel">닫기</button>
            <button type="button" class="btn btn-fill terms-accept">동의하고 계속</button>
          </div>
        </div>
      </div>
      `;
      root.appendChild(overlay);
    }

  const sheet = overlay.querySelector('.terms-sheet');
  const closeX = overlay.querySelector('.terms-close-x');
  const cancelBtn = overlay.querySelector('.terms-cancel');
  const acceptBtn = overlay.querySelector('.terms-accept');
  const inlineAgree = overlay.querySelector('#termsInlineAgree');

  let prevFocus = null;

  function openTerms(){
    prevFocus = document.activeElement;
    root.setAttribute('data-modal-open','true');
    overlay.hidden = false;
    sheet.focus();
    lowerFooter();
    document.addEventListener('keydown', onKeydown, true);
    overlay.addEventListener('click', onBackdrop);
  }
  function closeTerms(){
    overlay.hidden = true;
    root.removeAttribute('data-modal-open');
    restoreFooter();
    document.removeEventListener('keydown', onKeydown, true);
    overlay.removeEventListener('click', onBackdrop);
    if(prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
  }
  function onBackdrop(e){
    if(e.target === overlay) closeTerms();
  }
  function onKeydown(e){
    if(e.key === 'Escape'){ e.preventDefault(); closeTerms(); }
    if(e.key === 'Tab'){
      const f = sheet.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
      const focusables = Array.prototype.slice.call(f);
      if(!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }

  termsBtn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); openTerms(); });
  closeX.addEventListener('click', (e)=>{ e.preventDefault(); closeTerms(); });
  cancelBtn.addEventListener('click', (e)=>{ e.preventDefault(); closeTerms(); });
  acceptBtn.addEventListener('click', (e)=>{
    e.preventDefault(); e.stopPropagation();
    inlineAgree.checked = true;
    if(agreeBox){ agreeBox.checked = true; agreeBox.dispatchEvent(new Event('change', {bubbles:true})); }
    acceptBtn.blur();
    closeTerms();
  });

  // 경고 애니메이션 정의(필요 시 사용)
  const css = document.createElement('style');
  css.textContent = `#applyMintForm .terms-sheet.shake{ animation: applyShake .3s; }
  @keyframes applyShake{
    10%{ transform:translateY(0) translateX(-2px) }
    20%{ transform:translateY(0) translateX(2px) }
    30%{ transform:translateY(0) translateX(-2px) }
    40%{ transform:translateY(0) translateX(2px) }
    50%{ transform:translateY(0) translateX(-1px) }
    60%{ transform:translateY(0) translateX(1px) }
    100%{ transform:translateY(0) translateX(0) } }`;
  root.appendChild(css);
})();
