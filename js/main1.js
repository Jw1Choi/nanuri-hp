/* ───────────────────────────
   1. Navigation & Phone 버튼
───────────────────────────*/
/* 모바일 메뉴 토글 */
function toggleMobile(){
    const panel   = document.getElementById('mobilePanel');
    const burger  = document.getElementById('hamburgerBtn');
    const nav     = document.getElementById('mainNav');
    const logoImg = document.getElementById('logoImg');
  
    panel.classList.toggle('show');
    burger.classList.toggle('open');
    nav.classList.toggle('menu-open', panel.classList.contains('show'));
  
    if (window.pageYOffset === 0){
      logoImg.src = panel.classList.contains('show')
        ? logoImg.dataset.srcDark
        : logoImg.dataset.srcLight;
    }
  }
  
  /* 스크롤 효과 */
  const nav      = document.getElementById('mainNav');
  const logoImg  = document.getElementById('logoImg');
  let lastY      = window.pageYOffset;
  
  function onScroll(){
    const y = window.pageYOffset;
    if (y === 0){
      nav.classList.add('transparent');
      nav.classList.remove('solid');
      logoImg.src = logoImg.dataset.srcLight;
    } else {
      nav.classList.remove('transparent');
      nav.classList.add('solid');
      logoImg.src = logoImg.dataset.srcDark;
      nav.classList.remove('menu-open');
      document.getElementById('hamburgerBtn').classList.remove('open');
      document.getElementById('mobilePanel').classList.remove('show');
    }
    if (y > lastY && y > 50) nav.classList.add('hide');
    else nav.classList.remove('hide');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
  
  /* 전화 버튼 로테이션 */
  const callData = [
    { lines:["24시간 비밀상담 (형사)", "서울 : 02-6954-0378"], tel:"0269540378" },
    { lines:["24시간 비밀상담 (송무)", "대전 : 042-721-0606"], tel:"0427210606" }
  ];
  const swapDelay = 4000;
  const fadeDur   = 350;
  const phoneBtns = Array.from(document.querySelectorAll(".phone-btn"));
  const txtSpans  = phoneBtns.map(btn=>btn.querySelector(".txt"));
  let callIdx = 0;
  function setContent(lines,tel){
    txtSpans.forEach(s=>s.innerHTML=`${lines[0]}<br>${lines[1]}`);
    phoneBtns.forEach(b=>b.href=`tel:${tel}`);
  }
  function swapPhoneMsg(){
    callIdx = (callIdx + 1) % callData.length;
    txtSpans.forEach(s=>s.style.opacity=0);
    setTimeout(()=>{
      const {lines,tel} = callData[callIdx];
      setContent(lines,tel);
      txtSpans.forEach(s=>s.style.opacity=1);
    }, fadeDur);
  }
  setContent(callData[0].lines, callData[0].tel);
  setInterval(swapPhoneMsg, swapDelay);
  
  /* ───────────────────────────
     2. Criminal-solution 데모
  ───────────────────────────*/
  setTimeout(()=>{
    document.getElementById('glory-criminal-solution')
            .style.setProperty('--dim','.6');
  },2000);
  
  /* ───────────────────────────
     3. #late-response 숫자 카운트
  ───────────────────────────*/
  function animateCount(el,t){
    const dur=1900,start=performance.now();
    (function step(now){
      const p=Math.min((now-start)/dur,1);
      el.firstChild.nodeValue=Math.floor(p*t).toLocaleString();
      if(p<1)requestAnimationFrame(step);
    })(start);
  }
  document.addEventListener("DOMContentLoaded",()=>{
    const num=document.querySelector("#late-response .lr-status-number");
    const tgt=+num.dataset.target;let once=false;
    new IntersectionObserver(e=>{
      if(e[0].isIntersecting&&!once){once=true;animateCount(num,tgt);}
    },{threshold:.5}).observe(num);
  });
  setTimeout(()=>document.getElementById('late-response')
          .style.setProperty('--lr-bright','.5'),2000);
  
  /* ───────────────────────────
     4. #case-section 숫자 카운트
  ───────────────────────────*/
  function animateCountCase(el,target){
    const dur=1900,start=performance.now();
    (function tick(now){
      const p=Math.min((now-start)/dur,1);
      el.firstChild.nodeValue=Math.floor(p*target).toLocaleString();
      if(p<1)requestAnimationFrame(tick);
    })(start);
  }
  document.addEventListener("DOMContentLoaded",()=>{
    const el=document.querySelector("#case-section .lr-status-number");
    const tgt=+el.dataset.target;let once=false;
    new IntersectionObserver(e=>{
      if(e[0].isIntersecting&&!once){once=true;animateCountCase(el,tgt);}
    },{threshold:.5}).observe(el);
  });
  setTimeout(()=>document.getElementById('case-section')
          .style.setProperty('--case-bright','.3'),3000);
  
  /* ───────────────────────────
     5. #final-section 숫자 카운트
  ───────────────────────────*/
  function animateCountFinal(el,target){
    const dur=1900,start=performance.now();
    (function frame(now){
      const p=Math.min((now-start)/dur,1);
      el.firstChild.nodeValue=Math.floor(p*target).toLocaleString();
      if(p<1)requestAnimationFrame(frame);
    })(start);
  }
  document.addEventListener("DOMContentLoaded",()=>{
    const sec=document.getElementById("final-section");
    const num=sec?.querySelector(".lr-status-number");
    if(!num)return;
    const tgt=+num.dataset.target;let once=false;
    new IntersectionObserver(e=>{
      if(e[0].isIntersecting&&!once){once=true;animateCountFinal(num,tgt);}
    },{threshold:.5}).observe(num);
  });
  setTimeout(()=>document.getElementById('final-section')
          .style.setProperty('--final-bright','.35'),2500);
  
  /* ───────────────────────────
     6. Visual-section 페이드-인
  ───────────────────────────*/
  document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("visual-section");
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add("animate");
          obs.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(section);
  });
  
  /* ───────────────────────────
     7. Attorney Profile 스위치
  ───────────────────────────*/
  const LAWYERS={
    lee:{photo:"./img/law-lee.png",caption:"대표 변호사 이아무",name:"이아무",position:"대표변호사",
         phone:"전문적이고 민첩한 대응으로 최상의 결과를 약속합니다",
         edu:["법무법인 글로리 대표변호사","前 법무법인 로앤 서울사무소 변호사","前 법무법인 로앤 대전사무소 대표변호사"],
         career:["용산구 지방세심의위원","광명시청 계약심의위원","前) 광명시청·동작구청 고문변호사",
                 "前) 경기도 갈등조정위원","前) 국가배상심의위원회 심의위원장"]},
    kim:{photo:"./img/law-kim.png",caption:"김민희 파트너 변호사 ",name:"김민희",position:"파트너변호사",
         phone:"형사전문변호사",
         edu:["법무법인 글로리 변호사","前 법무법인 세계로","前 법무법인 상생","前 법률사무소 가연","前 법무법인 21세기종합법률사무소"],
         career:["대전지방법원 국선변호인","대전가정법원 국선보조인","제1지역군사법원 국선변호사","사망장병 유족 및 군범죄 피해자 국선변호사","한국에너지기술연구원 감사처분심의위원회 외부위원","유성경찰서 수사민원상담변호사","前 둔산경찰서 수사민원상담변호사","대한변호사협회인증 형사 전문변호사","대한변호사협회인증 손해배상 전문변호사"]}
  };
  Object.values(LAWYERS).forEach(v=>new Image().src=v.photo);
  const apSec   = document.getElementById('attorney-profile');
  const apInfo  = apSec.querySelector('.ap-info');
  const mainPhoto = apSec.querySelector('.main-photo');
  const cap   = apSec.querySelector('.ap-caption');
  const lname = apSec.querySelector('.ap-lname');
  const pos   = apSec.querySelector('.ap-position');
  const phone = apSec.querySelector('.ap-phone');
  const eduUl = apSec.querySelector('.ap-edu');
  const carUl = apSec.querySelector('.ap-career');
  const btns  = apSec.querySelectorAll('.ap-select button');
  
  btns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      if(btn.classList.contains('on'))return;
      btns.forEach(b=>b.classList.toggle('on',b===btn));
      const d=LAWYERS[btn.dataset.lawyer];
      apInfo.classList.add('switching');
      mainPhoto.style.opacity=0;
      mainPhoto.style.transform='scale(1.08)';
      mainPhoto.style.filter='blur(6px)';
      const tmp=new Image();
      tmp.onload=()=>{
        mainPhoto.src=tmp.src;
        requestAnimationFrame(()=>{
          mainPhoto.style.opacity=1;
          mainPhoto.style.transform='scale(1)';
          mainPhoto.style.filter='blur(0)';
        });
        cap.textContent=d.caption;
        lname.textContent=d.name; pos.textContent=d.position;
        phone.textContent=d.phone;
        phone.href='tel:'+d.phone.replace(/\s/g,'');
        eduUl.innerHTML=d.edu.map(v=>`<li>${v}</li>`).join('');
        carUl.innerHTML=d.career.map(v=>`<li>${v}</li>`).join('');
        setTimeout(()=>apInfo.classList.remove('switching'),500);
      };
      tmp.src=d.photo;
    });
  });
  
  /* ───────────────────────────
     8. #business-area 슬라이더
  ───────────────────────────*/
  (function(){
    const slider   = document.querySelector('#business-area .ba-slider');
    if(!slider) return;
    const cards    = Array.from(slider.children);
    const prevBtn  = document.querySelector('#business-area .ba-prev');
    const nextBtn  = document.querySelector('#business-area .ba-next');
    const modal    = document.querySelector('#business-area .ba-modal');
    const titleEl  = modal.querySelector('.ba-modal-title');
    const descEl   = modal.querySelector('.ba-modal-desc');
    const extraEl  = modal.querySelector('.ba-modal-extra');
    const closeBtn = modal.querySelector('.ba-modal-close');
    const progFill = document.querySelector('#business-area .ba-progress-fill');
    const modalContent = modal.querySelector('.ba-modal-content');
  
    let idx = 0;
    let startX = 0, curr = 0, prevTranslate = 0;
    let isDragging = false, animId = 0;
  
    function visibleCount(){
      const w = window.innerWidth;
      if (w < 600) return 1.5;
      if (w < 1024) return 2.3;
      return 4;
    }
    function cardWidth(){
      return cards[0].offsetWidth + parseFloat(getComputedStyle(slider).gap);
    }
    function clamp(n){
      const per = visibleCount(), max = cards.length - per;
      return Math.min(Math.max(n,0), max);
    }
    function setPos(x){ slider.style.transform = `translateX(${x}px)`; }
    function update(){
      idx = clamp(idx);
      prevTranslate = -idx * cardWidth();
      setPos(prevTranslate);
      cards.forEach((c,i)=> c.classList.toggle('active', i===idx));
      updateProgress();
    }
    function updateProgress(){
      const total = cards.length - visibleCount() + 1;
      const pct   = (idx/(total-1))*100;
      progFill.style.width = pct + '%';
    }
  
    prevBtn.addEventListener('click', ()=>{ idx--; update(); });
    nextBtn.addEventListener('click', ()=>{ idx++; update(); });
    window.addEventListener('resize', update);
  
    function animate(){ setPos(curr); animId = requestAnimationFrame(animate); }
    function onStart(x){
      startX = x; isDragging = false;
      curr = prevTranslate;
      animId = requestAnimationFrame(animate);
      slider.classList.add('dragging');
    }
    function onMove(x){
      const dx = x - startX;
      if (!isDragging && Math.abs(dx) > 5) isDragging = true;
      curr = prevTranslate + dx;
    }
    function onEnd(){
      cancelAnimationFrame(animId);
      slider.classList.remove('dragging');
      if (isDragging){
        const diff = curr - prevTranslate;
        if (diff < -cardWidth()/2) idx++;
        if (diff >  cardWidth()/2) idx--;
        update();
      }
      curr = prevTranslate = -idx * cardWidth();
    }
  
    slider.addEventListener('mousedown', e=> onStart(e.clientX));
    slider.addEventListener('mousemove', e=> onMove(e.clientX));
    slider.addEventListener('mouseup',   onEnd);
    slider.addEventListener('mouseleave',onEnd);
    slider.addEventListener('touchstart',e=> onStart(e.touches[0].clientX));
    slider.addEventListener('touchmove', e=> onMove(e.touches[0].clientX));
    slider.addEventListener('touchend',  onEnd);
  
    cards.forEach(card=>{
      card.addEventListener('click', ()=>{
        if (isDragging) return;
        titleEl.textContent = card.dataset.title;
        descEl.textContent  = card.dataset.desc;
        extraEl.innerHTML   = card.querySelector('.ba-card-extra').innerHTML;
        modal.setAttribute('aria-hidden','false');
        document.body.classList.remove('modal-open');
        modalContent.classList.remove('animate');
        void modalContent.offsetWidth;
        modalContent.classList.add('animate');
      });
    });
    closeBtn.addEventListener('click', ()=>{
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
      modalContent.classList.remove('animate');
    });
    modal.addEventListener('click', e=>{
      if (e.target===modal||e.target===modal.querySelector('.ba-backdrop')){
        modal.setAttribute('aria-hidden','true');
        document.body.classList.remove('modal-open');
        modalContent.classList.remove('animate');
      }
    });
  
    update();
  })();
  
  /* ───────────────────────────
     9. #business-area-2 슬라이더
  ───────────────────────────*/
  (function(){
    const slider   = document.querySelector('#business-area-2 .ba-slider');
    if(!slider) return;
    const cards    = Array.from(slider.children);
    const prevBtn  = document.querySelector('#business-area-2 .ba-prev');
    const nextBtn  = document.querySelector('#business-area-2 .ba-next');
    const modal    = document.querySelector('#business-area-2 .ba-modal');
    const titleEl  = modal.querySelector('.ba-modal-title');
    const descEl   = modal.querySelector('.ba-modal-desc');
    const extraEl  = modal.querySelector('.ba-modal-extra');
    const closeBtn = modal.querySelector('.ba-modal-close');
    const progFill = document.querySelector('#business-area-2 .ba-progress-fill');
    const modalContent = modal.querySelector('.ba-modal-content');
  
    let idx = 0;
    let startX = 0, curr = 0, prevTranslate = 0;
    let isDragging = false, animId = 0;
  
    function visibleCount(){
      const w = window.innerWidth;
      if (w < 600) return 1.5;
      if (w < 1024) return 2.3;
      return 4;
    }
    function cardWidth(){
      return cards[0].offsetWidth + parseFloat(getComputedStyle(slider).gap);
    }
    function clamp(n){
      const per = visibleCount(), max = cards.length - per;
      return Math.min(Math.max(n,0), max);
    }
    function setPos(x){ slider.style.transform = `translateX(${x}px)`; }
    function update(){
      idx = clamp(idx);
      prevTranslate = -idx * cardWidth();
      setPos(prevTranslate);
      cards.forEach((c,i)=> c.classList.toggle('active', i===idx));
      updateProgress();
    }
    function updateProgress(){
      const total = cards.length - visibleCount() + 1;
      const pct   = (idx/(total-1))*100;
      progFill.style.width = pct + '%';
    }
  
    prevBtn.addEventListener('click', ()=>{ idx--; update(); });
    nextBtn.addEventListener('click', ()=>{ idx++; update(); });
    window.addEventListener('resize', update);
  
    function animate(){ setPos(curr); animId = requestAnimationFrame(animate); }
    function onStart(x){
      startX = x; isDragging = false;
      curr = prevTranslate;
      animId = requestAnimationFrame(animate);
      slider.classList.add('dragging');
    }
    function onMove(x){
      const dx = x - startX;
      if (!isDragging && Math.abs(dx) > 5) isDragging = true;
      curr = prevTranslate + dx;
    }
    function onEnd(){
      cancelAnimationFrame(animId);
      slider.classList.remove('dragging');
      if (isDragging){
        const diff = curr - prevTranslate;
        if (diff < -cardWidth()/2) idx++;
        if (diff >  cardWidth()/2) idx--;
        update();
      }
      curr = prevTranslate = -idx * cardWidth();
    }
  
    slider.addEventListener('mousedown', e=> onStart(e.clientX));
    slider.addEventListener('mousemove', e=> onMove(e.clientX));
    slider.addEventListener('mouseup',   onEnd);
    slider.addEventListener('mouseleave',onEnd);
    slider.addEventListener('touchstart',e=> onStart(e.touches[0].clientX));
    slider.addEventListener('touchmove', e=> onMove(e.touches[0].clientX));
    slider.addEventListener('touchend',  onEnd);
  
    cards.forEach(card=>{
      card.addEventListener('click', ()=>{
        if (isDragging) return;
        titleEl.textContent = card.dataset.title;
        descEl.textContent  = card.dataset.desc;
        extraEl.innerHTML   = card.querySelector('.ba-card-extra').innerHTML;
        modal.setAttribute('aria-hidden','false');
        document.body.classList.remove('modal-open');
        modalContent.classList.remove('animate');
        void modalContent.offsetWidth;
        modalContent.classList.add('animate');
      });
    });
    closeBtn.addEventListener('click', ()=>{
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
      modalContent.classList.remove('animate');
    });
    modal.addEventListener('click', e=>{
      if (e.target===modal||e.target===modal.querySelector('.ba-backdrop')){
        modal.setAttribute('aria-hidden','true');
        document.body.classList.remove('modal-open');
        modalContent.classList.remove('animate');
      }
    });
  
    update();
  })();
  
  /* ───────────────────────────
     10. #glory-office 페이드 & 슬라이더
  ───────────────────────────*/
  (function(){
    // fade-in
    const obs = new IntersectionObserver((es)=>{
      es.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, {threshold: 0.2});
    document.querySelectorAll('#glory-office [data-fade]')
            .forEach(el=> obs.observe(el));
  
    // gallery slider
    const container = document.querySelector('#glory-office .go-slides');
    if(!container) return;
    const prev      = document.querySelector('#glory-office .go-prev');
    const next      = document.querySelector('#glory-office .go-next');
    const slides    = Array.from(container.children);
    let idx         = 0;
    function slideSize() {
      const w   = container.children[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(container).gap) || 0;
      return { step: w + gap, visible: window.innerWidth > 600 ? 3 : 1 };
    }
    function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
    function moveTo(newIdx) {
      const { step, visible } = slideSize();
      const maxIdx = slides.length - visible;
      idx = clamp(newIdx, 0, maxIdx);
      container.style.transition = 'transform .5s ease';
      container.style.transform  = `translateX(-${idx * step}px)`;
    }
    prev.addEventListener('click', () => moveTo(idx - 1));
    next.addEventListener('click', () => moveTo(idx + 1));
    window.addEventListener('resize', () => moveTo(idx));
  
    let startX = 0, originTranslate = 0, isDown = false;
    container.style.touchAction = 'pan-y';
    container.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      isDown = true;
      startX = e.clientX;
      originTranslate = new WebKitCSSMatrix(getComputedStyle(container).transform).m41;
      container.style.transition = 'none';
      container.setPointerCapture(e.pointerId);
    });
    container.addEventListener('pointermove', e => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const { step, visible } = slideSize();
      const maxT = 0;
      const minT = -((slides.length - visible) * step);
      let tx = originTranslate + dx;
      tx = clamp(tx, minT, maxT);
      container.style.transform = `translateX(${tx}px)`;
    });
    function endDrag(e) {
      if (!isDown) return;
      isDown = false;
      const dxTotal = e.clientX - startX;
      const { step } = slideSize();
      const threshold = step / 4;
      if (dxTotal < -threshold) moveTo(idx + 1);
      else if (dxTotal > threshold) moveTo(idx - 1);
      else moveTo(idx);
      container.releasePointerCapture(e.pointerId);
    }
    container.addEventListener('pointerup',   endDrag);
    container.addEventListener('pointercancel', endDrag);
    container.addEventListener('lostpointercapture', endDrag);
    moveTo(0);
  })();


  // Progress Bar 생성
  const slides = Array.from(document.querySelectorAll('.swiper-container .swiper-slide'))
                      .filter(s => !s.classList.contains('swiper-slide-duplicate'));
  const bar = document.querySelector('.progress-container');
  const fills = [];

  slides.forEach((_, i) => {
    const seg = document.createElement('div');
    seg.className = 'progress-segment';
    const fill = document.createElement('span');
    fill.className = 'progress-fill';
    seg.appendChild(fill);
    bar.appendChild(seg);
    fills.push(fill);

    seg.addEventListener('click', () => swiper.slideToLoop(i, SPEED));
  });

  function updateProgress(idx) {
    fills.forEach((f, j) => {
      f.style.transition = 'none';
      f.style.width = j < idx ? '100%' : '0';
    });
    const active = fills[idx];
    void active.offsetWidth;
    active.style.transition = `width ${DELAY}ms linear`;
    active.style.width = '100%';
  }

  updateProgress(0);
  swiper.on('slideChange', () => updateProgress(swiper.realIndex));
  




  

  /* =========================================================
   ./js/main.js
   - 본 파일 하나에 합쳐서도 잘 동작하도록 전역 오염 없이 구성
   - 각 섹션/기능은 존재 여부를 먼저 검사하여 안전하게 실행
   - 스크롤 효과: 화면을 벗어났다가 다시 들어오면 재적용, 
     화면 안에 있는 동안에는 효과가 풀리지 않도록 설계
   ========================================================= */

/* ─────────────────────────────────────────────────────────
   1) #late-response : 숫자 애니메이션 (진입 시 시작, 이탈 시 0 리셋)
   ───────────────────────────────────────────────────────── */
(function () {
  function animateCount(el) {
    const target = +el.dataset.target;
    const duration = +el.dataset.duration || 1800;
    const startT = performance.now();

    (function step(now) {
      const p = Math.min((now - startT) / duration, 1);
      const val = Math.round(p * target);
      if (el.firstChild) el.firstChild.nodeValue = val.toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    })(startT);
  }

  function init() {
    const nums = document.querySelectorAll('#late-response .lr-status-number');
    if (!nums.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            animateCount(el);
          } else {
            if (el.firstChild) el.firstChild.nodeValue = '0';
          }
        });
      },
      { threshold: 0.5 }
    );

    nums.forEach((el) => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   2) #relief95 : 숫자 애니메이션 (진입 시 시작, 이탈 시 0 리셋)
   ───────────────────────────────────────────────────────── */
(function () {
  function animate(counter) {
    const target = +counter.dataset.target;
    const duration = +counter.dataset.duration || 1500;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(progress * target);
      counter.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function init() {
    const counters = document.querySelectorAll('#relief95 .counter');
    if (!counters.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            animate(el);
          } else {
            el.textContent = '0';
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => io.observe(c));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   3) #sm-solution : 2초 뒤 배경 농담 조정 변수 적용
   ───────────────────────────────────────────────────────── */
setTimeout(() => {
  const el = document.getElementById('sm-solution');
  if (el) el.style.setProperty('--dim', '.6');
}, 2000);

/* ─────────────────────────────────────────────────────────
   4) 무한 슬라이드(마퀴): .marquee-row.top / .marquee-row.bottom
   ───────────────────────────────────────────────────────── */
(function () {
  function initMarquee(row, { direction = 'left', speed = 30 } = {}) {
    if (!row) return;
    const originals = [...row.children];
    if (!originals.length) return;

    originals.forEach((c) => row.appendChild(c.cloneNode(true)));

    const gap = 24;
    const full = originals.reduce(
      (w, el) => w + el.getBoundingClientRect().width + gap,
      -gap
    );
    const dir = direction === 'left' ? -1 : 1;

    let pos = 0,
      last = performance.now();
    function step(now) {
      const dt = (now - last) / 1000;
      last = now;
      pos += dir * speed * dt;
      if (dir === -1 && Math.abs(pos) >= full) pos += full;
      if (dir === 1 && pos >= 0) pos -= full;
      row.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function init() {
    initMarquee(document.querySelector('.marquee-row.top'), {
      direction: 'right',
      speed: 30
    });
    initMarquee(document.querySelector('.marquee-row.bottom'), {
      direction: 'left',
      speed: 30
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   5) #visual-section : 뷰포트 진입/이탈 시 .animate 토글
   (재진입 시 재적용, 뷰포트 안에 있는 동안 해제되지 않음)
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const section = document.getElementById('visual-section');
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('animate');
          } else {
            section.classList.remove('animate');
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   6) #whoCanPartner : 카드 등장 애니메이션(.show) 토글
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const root = document.getElementById('whoCanPartner');
    if (!root) return;
    const targets = root.querySelectorAll('.card.reveal');
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('show');
          else entry.target.classList.remove('show');
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -5% 0px' }
    );

    targets.forEach((el) => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   7) #doctorProfileShinHY : 라이트박스
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const root = document.getElementById('doctorProfileShinHY');
    if (!root) return;

    const certBtn = root.querySelector('.cert');
    const certImg = certBtn?.querySelector('img');
    const lightbox = root.querySelector('.lightbox');
    const lbImg = root.querySelector('.lightbox__img');

    if (!certBtn || !certImg || !lightbox || !lbImg) return;

    const open = () => {
      const src =
        certImg.getAttribute('data-fullsrc') || certImg.getAttribute('src');
      lbImg.setAttribute('src', src || '');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      lbImg.setAttribute('src', '');
      document.body.style.overflow = '';
    };

    certBtn.addEventListener('click', open, { passive: true });
    lightbox.addEventListener('click', (e) => {
      if (e.target && e.target.dataset && e.target.dataset.close === 'true')
        close();
    });
    document.addEventListener('keydown', (e) => {
      if (
        lightbox.getAttribute('aria-hidden') === 'false' &&
        (e.key === 'Escape' || e.key === 'Esc')
      )
        close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   8) #attorney-profile : 데이터 스위치
   ───────────────────────────────────────────────────────── */
(function () {
  const LAWYERS = {
    lee: {
      name: '개인회생',
      position:
        '3년 ~ 5년간 일정한 금액을 변제하면\n 나머지 채무의 면제를 받을 수 있는 국가지원제도',
      phone: '접수 순간부터 추심·연체이자가 멈추고, 독촉 전화·압류 압박에서 해방됩니다.',
      eduTitle: '▲ 개인회생 자격',
      careerTitle: '▲ 개인회생 장점',
      edu: [
        '일정한 월 수입이 있다',
        '전체 빚이 무담보 10 억 / 담보 15 억 이하다.',
        '독촉·압류가 이미 진행 중이거나 곧 우려된다.',
        '과거 개인회생 면책을 받은 적이 없거나 받은 지 5년이 지났다.'
      ],
      career: [
        '원금 최대 90 % 탕감 가능',
        '모든 연체 이자·지연손해금 즉시 정지',
        '급여·통장·자동차 압류 보호로 생활 기반 유지 가능',
        '집 보유한 채 절차 진행 가능',
        '전문직·공무원·자영업자도 그대로 일할 수 있습니다',
        '신용 회복 및 금융거래 재개'
      ]
    },
    kim: {
      name: '개인파산',
      position:
        '채무자가 가진 모든 재산으로도 빚을 갚을 수 없을 때, 재산을 현금화하고 남은 채무를 법적으로 소멸시켜주는 절차',
      phone: '새 출발할 수 있도록 모든 원금·이자 전부 소멸',
      eduTitle: '▲ 개인파산 자격',
      careerTitle: '▲ 개인파산 장점',
      edu: [
        '재산을 모두 처분해도 빚을 상환할 수 없다',
        '지속적인 수입이 없거나 매우 불안정하다',
        '면책불허 사유(사기·도박 등)가 없다',
        '최근 5년 내 파산 면책을 받은 이력이 없다'
      ],
      career: [
        '원금·이자 100 % 면책',
        '추심·압류 즉시 중단',
        '소득 없던 사람도 구제 가능',
        '절차 6~12개월로 비교적 짧음',
        '생활 필수 재산(기본 의복·가재도구 등) 보호',
        '재기 지원 제도(서민금융진흥원 등) 이용 가능'
      ]
    }
  };

  function init() {
    const sec = document.getElementById('attorney-profile');
    if (!sec) return;

    const info = sec.querySelector('.ap-info');
    const mainPhoto = sec.querySelector('.main-photo');
    const cap = sec.querySelector('.ap-caption');
    const lname = sec.querySelector('.ap-lname');
    const pos = sec.querySelector('.ap-position');
    const phone = sec.querySelector('.ap-phone');
    const eduUl = sec.querySelector('.ap-edu');
    const carUl = sec.querySelector('.ap-career');
    const btns = sec.querySelectorAll('.ap-select button');
    const eduHeading = sec.querySelector('.ap-edu-heading');
    const carHeading = sec.querySelector('.ap-career-heading');

    if (!lname || !pos || !phone || !eduUl || !carUl || !btns.length) return;

    function render(view) {
      if (eduHeading) eduHeading.textContent = view.eduTitle;
      if (carHeading) carHeading.textContent = view.careerTitle;

      lname.textContent = view.name;
      pos.textContent = view.position;
      phone.textContent = view.phone;

      // 전화번호가 숫자를 포함할 때만 tel 링크 설정
      const digits = (view.phone.match(/\d+/g) || []).join('');
      if (digits.length >= 7) {
        phone.setAttribute('href', 'tel:' + digits);
      } else {
        phone.removeAttribute('href');
      }

      eduUl.innerHTML = view.edu.map((v) => `<li>${v}</li>`).join('');
      carUl.innerHTML = view.career.map((v) => `<li>${v}</li>`).join('');

      if (mainPhoto) mainPhoto.alt = view.name;
      if (cap) cap.textContent = view.name;
    }

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('on')) return;
        btns.forEach((b) => b.classList.toggle('on', b === btn));
        const key = btn.dataset.lawyer;
        if (key && LAWYERS[key]) render(LAWYERS[key]);
      });
    });

    render(LAWYERS.lee);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   9) #legalDBHero : 실시간 DB 스택(오토 스크롤 카드) + 우측 li 하이라이트
   ───────────────────────────────────────────────────────── */
(function () {
  function initStack() {
    const root = document.querySelector('#legalDBHero');
    if (!root) return;
    const track = root.querySelector('.dbTrack');
    const stack = root.querySelector('.dbStack');
    if (!track || !stack) return;

    const VISIBLE = 5,
      GAP = 10,
      INTERVAL = 2600;

    const DB_LIST = [
      {
        city: '서울',
        age: 34,
        overdue: '즉시 경매 집행 중단',
        debt: '채무 ***만원',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '부산',
        age: 41,
        overdue: '월급 압류 해제',
        debt: '채무 ***만원',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '대구',
        age: 29,
        overdue: '아파트 경매 집행 중지',
        debt: '채무 ***만원',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '수원',
        age: 38,
        overdue: '채무 83% 탕감',
        debt: '월 상환액 150만원 감소',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '인천',
        age: 33,
        overdue: '추심 즉각 중단',
        debt: '채무 ***만원',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '대전',
        age: 36,
        overdue: '채무 79% 탕감',
        debt: '월 상환액 210만원 감소',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '창원',
        age: 45,
        overdue: '추심 즉각 중단',
        debt: '채무 ***만원',
        memo: '긴급 안심콜',
        time: ''
      }
    ];

    function createCard(data) {
      const el = document.createElement('div');
      el.className = 'db-card enter';
      el.innerHTML = `
        <div class="db-avatar"></div>
        <div class="db-main">
          <p class="db-title">${data.city} · ${data.age}세 · ${data.overdue}</p>
          <p class="db-sub">${data.debt} · ${data.memo} <span style="color:var(--muted);font-size:.9em">${data.time}</span></p>
        </div>`;
      requestAnimationFrame(() => el.classList.add('is-in'));
      return el;
    }

    function shiftUp(by) {
      track.classList.add('is-shifting');
      track.style.transform = `translateY(-${by}px)`;
      return new Promise((res) => {
        const onEnd = () => {
          track.removeEventListener('transitionend', onEnd);
          res();
        };
        track.addEventListener('transitionend', onEnd, { once: true });
      }).then(() => {
        track.classList.remove('is-shifting');
        track.style.transform = 'translateY(0)';
      });
    }

    let idx = 0,
      paused = false,
      timer = null,
      cardHeight = 78;

    function prime() {
      const init = Math.min(VISIBLE, DB_LIST.length);
      for (let i = 0; i < init; i++) pushNext();
      if (track.children.length)
        cardHeight = track.children[0].getBoundingClientRect().height;
    }

    function pushNext() {
      const data = DB_LIST[idx % DB_LIST.length];
      idx++;
      const card = createCard(data);
      track.appendChild(card);

      const cards = track.children;
      if (cards.length > VISIBLE) {
        const first = cards[0];
        shiftUp(cardHeight + GAP).then(() => first.remove());
      }
    }

    function schedule() {
      clearInterval(timer);
      timer = setInterval(() => {
        if (!paused) pushNext();
      }, INTERVAL);
    }

    stack.addEventListener('mouseenter', () => (paused = true));
    stack.addEventListener('mouseleave', () => (paused = false));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) schedule();
          else clearInterval(timer);
        });
      },
      { threshold: 0.2 }
    );
    io.observe(stack);

    prime();
  }

  function initRightListPulse() {
    const root = document.querySelector('#legalDBHero');
    if (!root) return;
    const list = root.querySelector('.right ul');
    if (!list) return;
    const items = Array.from(list.querySelectorAll('li'));
    if (!items.length) return;

    let idx = 0;
    let timer = null;
    let playing = false;
    const STEP = 3000;

    function tick() {
      items.forEach((li) => li.classList.remove('pulse'));
      items[idx].classList.add('pulse');
      idx = (idx + 1) % items.length;
    }
    function start() {
      if (playing) return;
      playing = true;
      tick();
      timer = setInterval(tick, STEP);
    }
    function stop() {
      if (!playing) return;
      playing = false;
      clearInterval(timer);
      timer = null;
    }

    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) start();
          else stop();
        });
      },
      { threshold: 0.15 }
    );
    io.observe(list);

    // 초기 진입 시 바로 시작 가능
    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initStack();
      initRightListPulse();
    });
  } else {
    initStack();
    initRightListPulse();
  }
})();

/* ─────────────────────────────────────────────────────────
   10) #floatingCallBarPro : 바 전체 클릭 시 tel 연결
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const bar = document.querySelector('#floatingCallBarPro .bar');
    if (!bar) return;
    bar.addEventListener('click', function (e) {
      const isBtn = e.target.closest('.callBtn');
      if (!isBtn) {
        const href = bar.getAttribute('data-call');
        if (href) window.location.href = href;
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   11) jQuery UI 토글(존재 시에만 실행)
   ───────────────────────────────────────────────────────── */
(function () {
  function init($) {
    if (!$) return;

    $('.navi_btn').on('click', function () {
      $(this).toggleClass('on');
      $('.navi').stop().fadeToggle();
    });

    $('.lnb h3').on('click', function () {
      const naviTitle = $(this).next('ul');
      $(this).addClass('on');
      $('.lnb h3').not(this).removeClass('on');
      naviTitle.stop().slideDown();
      $('.lnb h3').next().not(naviTitle).slideUp();
    });

    $('.right_contact .left').on('click', function () {
      $('.right_contact').toggleClass('on');
    });

    $('.bottom_contact_mob .top_thumb').on('click', function () {
      $('.bottom_contact_mob').toggleClass('on');
    });

    $('.bottom_contact_mob .bottom_con .btn_list .close_btn').on(
      'click',
      function () {
        $('.bottom_contact_mob').removeClass('on');
      }
    );
  }

  if (window.jQuery) {
    init(window.jQuery);
  } else {
    // jQuery가 늦게 로드되는 경우 대비
    document.addEventListener('DOMContentLoaded', () => {
      if (window.jQuery) init(window.jQuery);
    });
  }
})();

/* ─────────────────────────────────────────────────────────
   12) Swiper 페이드 슬라이더 + 진행바(존재 시에만 실행)
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    if (typeof Swiper === 'undefined') return;
    const container = document.querySelector('.swiper-container');
    const bar = document.querySelector('.progress-container');
    if (!container || !bar) return;

    const DELAY = 5000,
      SPEED = 1000;

    const swiper = new Swiper('.swiper-container', {
      effect: 'fade',
      loop: true,
      speed: SPEED,
      slidesPerView: 1,
      autoplay: {
        delay: DELAY,
        disableOnInteraction: false,
        waitForTransition: false
      },
      shortSwipes: true,
      longSwipes: false,
      threshold: 20,
      slideToClickedSlide: true
    });

    const slides = Array.from(
      document.querySelectorAll('.swiper-container .swiper-slide')
    ).filter((s) => !s.classList.contains('swiper-slide-duplicate'));
    const fills = [];

    slides.forEach((_, i) => {
      const seg = document.createElement('div');
      seg.className = 'progress-segment';
      const fill = document.createElement('span');
      fill.className = 'progress-fill';
      seg.appendChild(fill);
      bar.appendChild(seg);
      fills.push(fill);

      seg.addEventListener('click', () => swiper.slideToLoop(i, SPEED));
    });

    function updateProgress(idx) {
      fills.forEach((f, j) => {
        f.style.transition = 'none';
        f.style.width = j < idx ? '100%' : '0';
      });
      const active = fills[idx];
      // reflow
      void active.offsetWidth;
      active.style.transition = `width ${DELAY}ms linear`;
      active.style.width = '100%';
    }

    updateProgress(0);
    swiper.on('slideChange', () => updateProgress(swiper.realIndex));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   13) 모바일 메뉴 / 스크롤 헤더 / 전화 버튼 로테이션
   ───────────────────────────────────────────────────────── */
(function () {
  // 전역 함수로 사용될 수 있어 함수 선언 형태 유지
  window.toggleMobile = function toggleMobile() {
    const panel = document.getElementById('mobilePanel');
    const burger = document.getElementById('hamburgerBtn');
    const nav = document.getElementById('mainNav');
    const logoImg = document.getElementById('logoImg');
    if (!panel || !burger || !nav || !logoImg) return;

    panel.classList.toggle('show');
    burger.classList.toggle('open');
    nav.classList.toggle('menu-open', panel.classList.contains('show'));

    if (window.pageYOffset === 0) {
      logoImg.src = panel.classList.contains('show')
        ? logoImg.dataset.srcDark
        : logoImg.dataset.srcLight;
    }
  };

  const navEl = document.getElementById('mainNav');
  const logoImg = document.getElementById('logoImg');
  let lastY = window.pageYOffset;

  function onScroll() {
    if (!navEl || !logoImg) return;
    const y = window.pageYOffset;
    if (y === 0) {
      navEl.classList.add('transparent');
      navEl.classList.remove('solid');
      if (logoImg.dataset?.srcLight) logoImg.src = logoImg.dataset.srcLight;
    } else {
      navEl.classList.remove('transparent');
      navEl.classList.add('solid');
      if (logoImg.dataset?.srcDark) logoImg.src = logoImg.dataset.srcDark;
      navEl.classList.remove('menu-open');
      const burger = document.getElementById('hamburgerBtn');
      const panel = document.getElementById('mobilePanel');
      if (burger) burger.classList.remove('open');
      if (panel) panel.classList.remove('show');
    }
    if (y > lastY && y > 50) navEl.classList.add('hide');
    else navEl.classList.remove('hide');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // 전화 버튼 로테이션 (데이터가 비어 있어도 안전)
  const callData = [
    { lines: [''], tel: '' },
    { lines: [''], tel: '' }
  ];
  const swapDelay = 4000;
  const fadeDur = 350;

  const phoneBtns = Array.from(document.querySelectorAll('.phone-btn'));
  const txtSpans = phoneBtns.map((btn) => btn.querySelector('.txt'));
  let idx = 0;

  function setContent(lines, tel) {
    txtSpans.forEach((s) => {
      if (!s) return;
      const l0 = lines[0] ?? '';
      const l1 = lines[1] ?? '';
      s.innerHTML = `${l0}<br>${l1}`;
      // br이 싫다면 s.textContent = [l0,l1].filter(Boolean).join('\n');
    });
    phoneBtns.forEach((b) => {
      if (!b) return;
      if (tel) b.href = `tel:${tel}`;
      else b.removeAttribute('href');
    });
  }

  function swapPhoneMsg() {
    idx = (idx + 1) % callData.length;
    txtSpans.forEach((s) => s && (s.style.opacity = 0));
    setTimeout(() => {
      const { lines, tel } = callData[idx];
      setContent(lines, tel);
      txtSpans.forEach((s) => s && (s.style.opacity = 1));
    }, fadeDur);
  }

  setContent(callData[0].lines, callData[0].tel);
  if (phoneBtns.length) setInterval(swapPhoneMsg, swapDelay);
})();

/* ─────────────────────────────────────────────────────────
   14) #reliefBanner : 숫자 애니메이션 + #dailyCountdown
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    // ① 숫자 애니메이션
    const counters = document.querySelectorAll('#reliefBanner .counter');
    if (counters.length) {
      function animate(counter) {
        const target = +counter.dataset.target;
        const duration = +counter.dataset.duration || 1500;
        const startTime = performance.now();
        function update(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const value = Math.round(progress * target);
          counter.textContent = value.toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      }

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            if (entry.isIntersecting) animate(el);
            else el.textContent = '0';
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((c) => io.observe(c));
    }

    // ② 데일리 카운트다운(매일 23:59:59)
    const cd = document.getElementById('dailyCountdown');
    if (cd) {
      const hourEl = cd.querySelector('.hh');
      const minEl = cd.querySelector('.mm');
      const secEl = cd.querySelector('.ss');

      function getTodayDeadline() {
        const t = new Date();
        t.setHours(23, 59, 59, 999);
        if (Date.now() > t.getTime()) t.setDate(t.getDate() + 1);
        return t;
      }
      function updateCountdown() {
        const now = new Date();
        const end = getTodayDeadline();
        const diff = end - now;
        const total = Math.max(0, Math.floor(diff / 1000));
        const hours = Math.floor((total % 86400) / 3600);
        const mins = Math.floor((total % 3600) / 60);
        const secs = total % 60;

        if (hourEl) hourEl.textContent = String(hours).padStart(2, '0');
        if (minEl) minEl.textContent = String(mins).padStart(2, '0');
        if (secEl) secEl.textContent = String(secs).padStart(2, '0');
      }
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   15) 내부 앵커 스무스 스크롤 + 모바일 메뉴 자동 닫기
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const menuLinks = document.querySelectorAll('a[href^="#"]');
    if (!menuLinks.length) return;

    menuLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });

        const mobilePanel = document.getElementById('mobilePanel');
        if (mobilePanel && mobilePanel.classList.contains('open')) {
          if (typeof window.toggleMobile === 'function') window.toggleMobile();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   16) 간단 토글 버튼들 (#toggleBtn/#partnerList, #proToggleBtn/#proPartnerList)
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const toggle = (btnId, listId) => {
      const btn = document.getElementById(btnId);
      const list = document.getElementById(listId);
      if (btn && list) {
        btn.addEventListener('click', () => list.classList.toggle('show'));
      }
    };
    toggle('toggleBtn', 'partnerList');
    toggle('proToggleBtn', 'proPartnerList');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   17) .blink : 부드러운 무한 깜박임 (접근성 고려)
   - data-period(400~5000ms), data-min(0~0.95)
   - 뷰포트와 무관하게 항상 애니메이트
   ───────────────────────────────────────────────────────── */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    .matches;

  function clamp(n, min, max, fb) {
    if (Number.isNaN(n)) return fb;
    return Math.min(max, Math.max(min, n));
  }

  function opacityAt(t, period, minOpacity) {
    const amp = 1 - minOpacity;
    const phase = (t % period) / period;
    const wave = Math.sin(phase * Math.PI * 2); // -1~1
    return minOpacity + amp * (0.5 + 0.5 * wave);
  }

  function startBlink(el) {
    const period = clamp(
      parseInt(el.getAttribute('data-period'), 10),
      400,
      5000,
      1200
    );
    const min = clamp(
      parseFloat(el.getAttribute('data-min')),
      0,
      0.95,
      0.2
    );
    const effectivePeriod = prefersReduced ? period * 1.6 : period;
    const effectiveMin = prefersReduced ? Math.min(min + 0.15, 0.8) : min;
    const t0 = performance.now();

    function tick(now) {
      const op = opacityAt(now - t0, effectivePeriod, effectiveMin);
      el.style.opacity = op.toFixed(3);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function init() {
    document.querySelectorAll('.blink').forEach(startBlink);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
/* ───────────────────────────
   1. Navigation & Phone 버튼
───────────────────────────*/
/* 모바일 메뉴 토글 */
function toggleMobile(){
    const panel   = document.getElementById('mobilePanel');
    const burger  = document.getElementById('hamburgerBtn');
    const nav     = document.getElementById('mainNav');
    const logoImg = document.getElementById('logoImg');
  
    panel.classList.toggle('show');
    burger.classList.toggle('open');
    nav.classList.toggle('menu-open', panel.classList.contains('show'));
  
    if (window.pageYOffset === 0){
      logoImg.src = panel.classList.contains('show')
        ? logoImg.dataset.srcDark
        : logoImg.dataset.srcLight;
    }
  }
  
  /* 스크롤 효과 */
  const nav      = document.getElementById('mainNav');
  const logoImg  = document.getElementById('logoImg');
  let lastY      = window.pageYOffset;
  
  function onScroll(){
    const y = window.pageYOffset;
    if (y === 0){
      nav.classList.add('transparent');
      nav.classList.remove('solid');
      logoImg.src = logoImg.dataset.srcLight;
    } else {
      nav.classList.remove('transparent');
      nav.classList.add('solid');
      logoImg.src = logoImg.dataset.srcDark;
      nav.classList.remove('menu-open');
      document.getElementById('hamburgerBtn').classList.remove('open');
      document.getElementById('mobilePanel').classList.remove('show');
    }
    if (y > lastY && y > 50) nav.classList.add('hide');
    else nav.classList.remove('hide');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
  
  /* 전화 버튼 로테이션 */
  const callData = [
    { lines:["24시간 비밀상담 (형사)", "서울 : 02-6954-0378"], tel:"0269540378" },
    { lines:["24시간 비밀상담 (송무)", "대전 : 042-721-0606"], tel:"0427210606" }
  ];
  const swapDelay = 4000;
  const fadeDur   = 350;
  const phoneBtns = Array.from(document.querySelectorAll(".phone-btn"));
  const txtSpans  = phoneBtns.map(btn=>btn.querySelector(".txt"));
  let callIdx = 0;
  function setContent(lines,tel){
    txtSpans.forEach(s=>s.innerHTML=`${lines[0]}<br>${lines[1]}`);
    phoneBtns.forEach(b=>b.href=`tel:${tel}`);
  }
  function swapPhoneMsg(){
    callIdx = (callIdx + 1) % callData.length;
    txtSpans.forEach(s=>s.style.opacity=0);
    setTimeout(()=>{
      const {lines,tel} = callData[callIdx];
      setContent(lines,tel);
      txtSpans.forEach(s=>s.style.opacity=1);
    }, fadeDur);
  }
  setContent(callData[0].lines, callData[0].tel);
  setInterval(swapPhoneMsg, swapDelay);
  
  /* ───────────────────────────
     2. Criminal-solution 데모
  ───────────────────────────*/
  setTimeout(()=>{
    document.getElementById('glory-criminal-solution')
            .style.setProperty('--dim','.6');
  },2000);
  
  /* ───────────────────────────
     3. #late-response 숫자 카운트
  ───────────────────────────*/
  function animateCount(el,t){
    const dur=1900,start=performance.now();
    (function step(now){
      const p=Math.min((now-start)/dur,1);
      el.firstChild.nodeValue=Math.floor(p*t).toLocaleString();
      if(p<1)requestAnimationFrame(step);
    })(start);
  }
  document.addEventListener("DOMContentLoaded",()=>{
    const num=document.querySelector("#late-response .lr-status-number");
    const tgt=+num.dataset.target;let once=false;
    new IntersectionObserver(e=>{
      if(e[0].isIntersecting&&!once){once=true;animateCount(num,tgt);}
    },{threshold:.5}).observe(num);
  });
  setTimeout(()=>document.getElementById('late-response')
          .style.setProperty('--lr-bright','.5'),2000);
  
  /* ───────────────────────────
     4. #case-section 숫자 카운트
  ───────────────────────────*/
  function animateCountCase(el,target){
    const dur=1900,start=performance.now();
    (function tick(now){
      const p=Math.min((now-start)/dur,1);
      el.firstChild.nodeValue=Math.floor(p*target).toLocaleString();
      if(p<1)requestAnimationFrame(tick);
    })(start);
  }
  document.addEventListener("DOMContentLoaded",()=>{
    const el=document.querySelector("#case-section .lr-status-number");
    const tgt=+el.dataset.target;let once=false;
    new IntersectionObserver(e=>{
      if(e[0].isIntersecting&&!once){once=true;animateCountCase(el,tgt);}
    },{threshold:.5}).observe(el);
  });
  setTimeout(()=>document.getElementById('case-section')
          .style.setProperty('--case-bright','.3'),3000);
  
  /* ───────────────────────────
     5. #final-section 숫자 카운트
  ───────────────────────────*/
  function animateCountFinal(el,target){
    const dur=1900,start=performance.now();
    (function frame(now){
      const p=Math.min((now-start)/dur,1);
      el.firstChild.nodeValue=Math.floor(p*target).toLocaleString();
      if(p<1)requestAnimationFrame(frame);
    })(start);
  }
  document.addEventListener("DOMContentLoaded",()=>{
    const sec=document.getElementById("final-section");
    const num=sec?.querySelector(".lr-status-number");
    if(!num)return;
    const tgt=+num.dataset.target;let once=false;
    new IntersectionObserver(e=>{
      if(e[0].isIntersecting&&!once){once=true;animateCountFinal(num,tgt);}
    },{threshold:.5}).observe(num);
  });
  setTimeout(()=>document.getElementById('final-section')
          .style.setProperty('--final-bright','.35'),2500);
  
  /* ───────────────────────────
     6. Visual-section 페이드-인
  ───────────────────────────*/
  document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("visual-section");
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add("animate");
          obs.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(section);
  });
  
  /* ───────────────────────────
     7. Attorney Profile 스위치
  ───────────────────────────*/
  const LAWYERS={
    lee:{photo:"./img/law-lee.png",caption:"대표 변호사 이아무",name:"이아무",position:"대표변호사",
         phone:"전문적이고 민첩한 대응으로 최상의 결과를 약속합니다",
         edu:["법무법인 글로리 대표변호사","前 법무법인 로앤 서울사무소 변호사","前 법무법인 로앤 대전사무소 대표변호사"],
         career:["용산구 지방세심의위원","광명시청 계약심의위원","前) 광명시청·동작구청 고문변호사",
                 "前) 경기도 갈등조정위원","前) 국가배상심의위원회 심의위원장"]},
    kim:{photo:"./img/law-kim.png",caption:"김민희 파트너 변호사 ",name:"김민희",position:"파트너변호사",
         phone:"형사전문변호사",
         edu:["법무법인 글로리 변호사","前 법무법인 세계로","前 법무법인 상생","前 법률사무소 가연","前 법무법인 21세기종합법률사무소"],
         career:["대전지방법원 국선변호인","대전가정법원 국선보조인","제1지역군사법원 국선변호사","사망장병 유족 및 군범죄 피해자 국선변호사","한국에너지기술연구원 감사처분심의위원회 외부위원","유성경찰서 수사민원상담변호사","前 둔산경찰서 수사민원상담변호사","대한변호사협회인증 형사 전문변호사","대한변호사협회인증 손해배상 전문변호사"]}
  };
  Object.values(LAWYERS).forEach(v=>new Image().src=v.photo);
  const apSec   = document.getElementById('attorney-profile');
  const apInfo  = apSec.querySelector('.ap-info');
  const mainPhoto = apSec.querySelector('.main-photo');
  const cap   = apSec.querySelector('.ap-caption');
  const lname = apSec.querySelector('.ap-lname');
  const pos   = apSec.querySelector('.ap-position');
  const phone = apSec.querySelector('.ap-phone');
  const eduUl = apSec.querySelector('.ap-edu');
  const carUl = apSec.querySelector('.ap-career');
  const btns  = apSec.querySelectorAll('.ap-select button');
  
  btns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      if(btn.classList.contains('on'))return;
      btns.forEach(b=>b.classList.toggle('on',b===btn));
      const d=LAWYERS[btn.dataset.lawyer];
      apInfo.classList.add('switching');
      mainPhoto.style.opacity=0;
      mainPhoto.style.transform='scale(1.08)';
      mainPhoto.style.filter='blur(6px)';
      const tmp=new Image();
      tmp.onload=()=>{
        mainPhoto.src=tmp.src;
        requestAnimationFrame(()=>{
          mainPhoto.style.opacity=1;
          mainPhoto.style.transform='scale(1)';
          mainPhoto.style.filter='blur(0)';
        });
        cap.textContent=d.caption;
        lname.textContent=d.name; pos.textContent=d.position;
        phone.textContent=d.phone;
        phone.href='tel:'+d.phone.replace(/\s/g,'');
        eduUl.innerHTML=d.edu.map(v=>`<li>${v}</li>`).join('');
        carUl.innerHTML=d.career.map(v=>`<li>${v}</li>`).join('');
        setTimeout(()=>apInfo.classList.remove('switching'),500);
      };
      tmp.src=d.photo;
    });
  });
  
  /* ───────────────────────────
     8. #business-area 슬라이더
  ───────────────────────────*/
  (function(){
    const slider   = document.querySelector('#business-area .ba-slider');
    if(!slider) return;
    const cards    = Array.from(slider.children);
    const prevBtn  = document.querySelector('#business-area .ba-prev');
    const nextBtn  = document.querySelector('#business-area .ba-next');
    const modal    = document.querySelector('#business-area .ba-modal');
    const titleEl  = modal.querySelector('.ba-modal-title');
    const descEl   = modal.querySelector('.ba-modal-desc');
    const extraEl  = modal.querySelector('.ba-modal-extra');
    const closeBtn = modal.querySelector('.ba-modal-close');
    const progFill = document.querySelector('#business-area .ba-progress-fill');
    const modalContent = modal.querySelector('.ba-modal-content');
  
    let idx = 0;
    let startX = 0, curr = 0, prevTranslate = 0;
    let isDragging = false, animId = 0;
  
    function visibleCount(){
      const w = window.innerWidth;
      if (w < 600) return 1.5;
      if (w < 1024) return 2.3;
      return 4;
    }
    function cardWidth(){
      return cards[0].offsetWidth + parseFloat(getComputedStyle(slider).gap);
    }
    function clamp(n){
      const per = visibleCount(), max = cards.length - per;
      return Math.min(Math.max(n,0), max);
    }
    function setPos(x){ slider.style.transform = `translateX(${x}px)`; }
    function update(){
      idx = clamp(idx);
      prevTranslate = -idx * cardWidth();
      setPos(prevTranslate);
      cards.forEach((c,i)=> c.classList.toggle('active', i===idx));
      updateProgress();
    }
    function updateProgress(){
      const total = cards.length - visibleCount() + 1;
      const pct   = (idx/(total-1))*100;
      progFill.style.width = pct + '%';
    }
  
    prevBtn.addEventListener('click', ()=>{ idx--; update(); });
    nextBtn.addEventListener('click', ()=>{ idx++; update(); });
    window.addEventListener('resize', update);
  
    function animate(){ setPos(curr); animId = requestAnimationFrame(animate); }
    function onStart(x){
      startX = x; isDragging = false;
      curr = prevTranslate;
      animId = requestAnimationFrame(animate);
      slider.classList.add('dragging');
    }
    function onMove(x){
      const dx = x - startX;
      if (!isDragging && Math.abs(dx) > 5) isDragging = true;
      curr = prevTranslate + dx;
    }
    function onEnd(){
      cancelAnimationFrame(animId);
      slider.classList.remove('dragging');
      if (isDragging){
        const diff = curr - prevTranslate;
        if (diff < -cardWidth()/2) idx++;
        if (diff >  cardWidth()/2) idx--;
        update();
      }
      curr = prevTranslate = -idx * cardWidth();
    }
  
    slider.addEventListener('mousedown', e=> onStart(e.clientX));
    slider.addEventListener('mousemove', e=> onMove(e.clientX));
    slider.addEventListener('mouseup',   onEnd);
    slider.addEventListener('mouseleave',onEnd);
    slider.addEventListener('touchstart',e=> onStart(e.touches[0].clientX));
    slider.addEventListener('touchmove', e=> onMove(e.touches[0].clientX));
    slider.addEventListener('touchend',  onEnd);
  
    cards.forEach(card=>{
      card.addEventListener('click', ()=>{
        if (isDragging) return;
        titleEl.textContent = card.dataset.title;
        descEl.textContent  = card.dataset.desc;
        extraEl.innerHTML   = card.querySelector('.ba-card-extra').innerHTML;
        modal.setAttribute('aria-hidden','false');
        document.body.classList.remove('modal-open');
        modalContent.classList.remove('animate');
        void modalContent.offsetWidth;
        modalContent.classList.add('animate');
      });
    });
    closeBtn.addEventListener('click', ()=>{
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
      modalContent.classList.remove('animate');
    });
    modal.addEventListener('click', e=>{
      if (e.target===modal||e.target===modal.querySelector('.ba-backdrop')){
        modal.setAttribute('aria-hidden','true');
        document.body.classList.remove('modal-open');
        modalContent.classList.remove('animate');
      }
    });
  
    update();
  })();
  
  /* ───────────────────────────
     9. #business-area-2 슬라이더
  ───────────────────────────*/
  (function(){
    const slider   = document.querySelector('#business-area-2 .ba-slider');
    if(!slider) return;
    const cards    = Array.from(slider.children);
    const prevBtn  = document.querySelector('#business-area-2 .ba-prev');
    const nextBtn  = document.querySelector('#business-area-2 .ba-next');
    const modal    = document.querySelector('#business-area-2 .ba-modal');
    const titleEl  = modal.querySelector('.ba-modal-title');
    const descEl   = modal.querySelector('.ba-modal-desc');
    const extraEl  = modal.querySelector('.ba-modal-extra');
    const closeBtn = modal.querySelector('.ba-modal-close');
    const progFill = document.querySelector('#business-area-2 .ba-progress-fill');
    const modalContent = modal.querySelector('.ba-modal-content');
  
    let idx = 0;
    let startX = 0, curr = 0, prevTranslate = 0;
    let isDragging = false, animId = 0;
  
    function visibleCount(){
      const w = window.innerWidth;
      if (w < 600) return 1.5;
      if (w < 1024) return 2.3;
      return 4;
    }
    function cardWidth(){
      return cards[0].offsetWidth + parseFloat(getComputedStyle(slider).gap);
    }
    function clamp(n){
      const per = visibleCount(), max = cards.length - per;
      return Math.min(Math.max(n,0), max);
    }
    function setPos(x){ slider.style.transform = `translateX(${x}px)`; }
    function update(){
      idx = clamp(idx);
      prevTranslate = -idx * cardWidth();
      setPos(prevTranslate);
      cards.forEach((c,i)=> c.classList.toggle('active', i===idx));
      updateProgress();
    }
    function updateProgress(){
      const total = cards.length - visibleCount() + 1;
      const pct   = (idx/(total-1))*100;
      progFill.style.width = pct + '%';
    }
  
    prevBtn.addEventListener('click', ()=>{ idx--; update(); });
    nextBtn.addEventListener('click', ()=>{ idx++; update(); });
    window.addEventListener('resize', update);
  
    function animate(){ setPos(curr); animId = requestAnimationFrame(animate); }
    function onStart(x){
      startX = x; isDragging = false;
      curr = prevTranslate;
      animId = requestAnimationFrame(animate);
      slider.classList.add('dragging');
    }
    function onMove(x){
      const dx = x - startX;
      if (!isDragging && Math.abs(dx) > 5) isDragging = true;
      curr = prevTranslate + dx;
    }
    function onEnd(){
      cancelAnimationFrame(animId);
      slider.classList.remove('dragging');
      if (isDragging){
        const diff = curr - prevTranslate;
        if (diff < -cardWidth()/2) idx++;
        if (diff >  cardWidth()/2) idx--;
        update();
      }
      curr = prevTranslate = -idx * cardWidth();
    }
  
    slider.addEventListener('mousedown', e=> onStart(e.clientX));
    slider.addEventListener('mousemove', e=> onMove(e.clientX));
    slider.addEventListener('mouseup',   onEnd);
    slider.addEventListener('mouseleave',onEnd);
    slider.addEventListener('touchstart',e=> onStart(e.touches[0].clientX));
    slider.addEventListener('touchmove', e=> onMove(e.touches[0].clientX));
    slider.addEventListener('touchend',  onEnd);
  
    cards.forEach(card=>{
      card.addEventListener('click', ()=>{
        if (isDragging) return;
        titleEl.textContent = card.dataset.title;
        descEl.textContent  = card.dataset.desc;
        extraEl.innerHTML   = card.querySelector('.ba-card-extra').innerHTML;
        modal.setAttribute('aria-hidden','false');
        document.body.classList.remove('modal-open');
        modalContent.classList.remove('animate');
        void modalContent.offsetWidth;
        modalContent.classList.add('animate');
      });
    });
    closeBtn.addEventListener('click', ()=>{
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
      modalContent.classList.remove('animate');
    });
    modal.addEventListener('click', e=>{
      if (e.target===modal||e.target===modal.querySelector('.ba-backdrop')){
        modal.setAttribute('aria-hidden','true');
        document.body.classList.remove('modal-open');
        modalContent.classList.remove('animate');
      }
    });
  
    update();
  })();
  
  /* ───────────────────────────
     10. #glory-office 페이드 & 슬라이더
  ───────────────────────────*/
  (function(){
    // fade-in
    const obs = new IntersectionObserver((es)=>{
      es.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, {threshold: 0.2});
    document.querySelectorAll('#glory-office [data-fade]')
            .forEach(el=> obs.observe(el));
  
    // gallery slider
    const container = document.querySelector('#glory-office .go-slides');
    if(!container) return;
    const prev      = document.querySelector('#glory-office .go-prev');
    const next      = document.querySelector('#glory-office .go-next');
    const slides    = Array.from(container.children);
    let idx         = 0;
    function slideSize() {
      const w   = container.children[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(container).gap) || 0;
      return { step: w + gap, visible: window.innerWidth > 600 ? 3 : 1 };
    }
    function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
    function moveTo(newIdx) {
      const { step, visible } = slideSize();
      const maxIdx = slides.length - visible;
      idx = clamp(newIdx, 0, maxIdx);
      container.style.transition = 'transform .5s ease';
      container.style.transform  = `translateX(-${idx * step}px)`;
    }
    prev.addEventListener('click', () => moveTo(idx - 1));
    next.addEventListener('click', () => moveTo(idx + 1));
    window.addEventListener('resize', () => moveTo(idx));
  
    let startX = 0, originTranslate = 0, isDown = false;
    container.style.touchAction = 'pan-y';
    container.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      isDown = true;
      startX = e.clientX;
      originTranslate = new WebKitCSSMatrix(getComputedStyle(container).transform).m41;
      container.style.transition = 'none';
      container.setPointerCapture(e.pointerId);
    });
    container.addEventListener('pointermove', e => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const { step, visible } = slideSize();
      const maxT = 0;
      const minT = -((slides.length - visible) * step);
      let tx = originTranslate + dx;
      tx = clamp(tx, minT, maxT);
      container.style.transform = `translateX(${tx}px)`;
    });
    function endDrag(e) {
      if (!isDown) return;
      isDown = false;
      const dxTotal = e.clientX - startX;
      const { step } = slideSize();
      const threshold = step / 4;
      if (dxTotal < -threshold) moveTo(idx + 1);
      else if (dxTotal > threshold) moveTo(idx - 1);
      else moveTo(idx);
      container.releasePointerCapture(e.pointerId);
    }
    container.addEventListener('pointerup',   endDrag);
    container.addEventListener('pointercancel', endDrag);
    container.addEventListener('lostpointercapture', endDrag);
    moveTo(0);
  })();


  // Progress Bar 생성
  const slides = Array.from(document.querySelectorAll('.swiper-container .swiper-slide'))
                      .filter(s => !s.classList.contains('swiper-slide-duplicate'));
  const bar = document.querySelector('.progress-container');
  const fills = [];

  slides.forEach((_, i) => {
    const seg = document.createElement('div');
    seg.className = 'progress-segment';
    const fill = document.createElement('span');
    fill.className = 'progress-fill';
    seg.appendChild(fill);
    bar.appendChild(seg);
    fills.push(fill);

    seg.addEventListener('click', () => swiper.slideToLoop(i, SPEED));
  });

  function updateProgress(idx) {
    fills.forEach((f, j) => {
      f.style.transition = 'none';
      f.style.width = j < idx ? '100%' : '0';
    });
    const active = fills[idx];
    void active.offsetWidth;
    active.style.transition = `width ${DELAY}ms linear`;
    active.style.width = '100%';
  }

  updateProgress(0);
  swiper.on('slideChange', () => updateProgress(swiper.realIndex));
  




  

  /* =========================================================
   ./js/main.js
   - 본 파일 하나에 합쳐서도 잘 동작하도록 전역 오염 없이 구성
   - 각 섹션/기능은 존재 여부를 먼저 검사하여 안전하게 실행
   - 스크롤 효과: 화면을 벗어났다가 다시 들어오면 재적용, 
     화면 안에 있는 동안에는 효과가 풀리지 않도록 설계
   ========================================================= */

/* ─────────────────────────────────────────────────────────
   1) #late-response : 숫자 애니메이션 (진입 시 시작, 이탈 시 0 리셋)
   ───────────────────────────────────────────────────────── */
(function () {
  function animateCount(el) {
    const target = +el.dataset.target;
    const duration = +el.dataset.duration || 1800;
    const startT = performance.now();

    (function step(now) {
      const p = Math.min((now - startT) / duration, 1);
      const val = Math.round(p * target);
      if (el.firstChild) el.firstChild.nodeValue = val.toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    })(startT);
  }

  function init() {
    const nums = document.querySelectorAll('#late-response .lr-status-number');
    if (!nums.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            animateCount(el);
          } else {
            if (el.firstChild) el.firstChild.nodeValue = '0';
          }
        });
      },
      { threshold: 0.5 }
    );

    nums.forEach((el) => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   2) #relief95 : 숫자 애니메이션 (진입 시 시작, 이탈 시 0 리셋)
   ───────────────────────────────────────────────────────── */
(function () {
  function animate(counter) {
    const target = +counter.dataset.target;
    const duration = +counter.dataset.duration || 1500;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(progress * target);
      counter.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function init() {
    const counters = document.querySelectorAll('#relief95 .counter');
    if (!counters.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            animate(el);
          } else {
            el.textContent = '0';
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => io.observe(c));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   3) #sm-solution : 2초 뒤 배경 농담 조정 변수 적용
   ───────────────────────────────────────────────────────── */
setTimeout(() => {
  const el = document.getElementById('sm-solution');
  if (el) el.style.setProperty('--dim', '.6');
}, 2000);

/* ─────────────────────────────────────────────────────────
   4) 무한 슬라이드(마퀴): .marquee-row.top / .marquee-row.bottom
   ───────────────────────────────────────────────────────── */
(function () {
  function initMarquee(row, { direction = 'left', speed = 30 } = {}) {
    if (!row) return;
    const originals = [...row.children];
    if (!originals.length) return;

    originals.forEach((c) => row.appendChild(c.cloneNode(true)));

    const gap = 24;
    const full = originals.reduce(
      (w, el) => w + el.getBoundingClientRect().width + gap,
      -gap
    );
    const dir = direction === 'left' ? -1 : 1;

    let pos = 0,
      last = performance.now();
    function step(now) {
      const dt = (now - last) / 1000;
      last = now;
      pos += dir * speed * dt;
      if (dir === -1 && Math.abs(pos) >= full) pos += full;
      if (dir === 1 && pos >= 0) pos -= full;
      row.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function init() {
    initMarquee(document.querySelector('.marquee-row.top'), {
      direction: 'right',
      speed: 30
    });
    initMarquee(document.querySelector('.marquee-row.bottom'), {
      direction: 'left',
      speed: 30
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   5) #visual-section : 뷰포트 진입/이탈 시 .animate 토글
   (재진입 시 재적용, 뷰포트 안에 있는 동안 해제되지 않음)
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const section = document.getElementById('visual-section');
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('animate');
          } else {
            section.classList.remove('animate');
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   6) #whoCanPartner : 카드 등장 애니메이션(.show) 토글
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const root = document.getElementById('whoCanPartner');
    if (!root) return;
    const targets = root.querySelectorAll('.card.reveal');
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('show');
          else entry.target.classList.remove('show');
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -5% 0px' }
    );

    targets.forEach((el) => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   7) #doctorProfileShinHY : 라이트박스
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const root = document.getElementById('doctorProfileShinHY');
    if (!root) return;

    const certBtn = root.querySelector('.cert');
    const certImg = certBtn?.querySelector('img');
    const lightbox = root.querySelector('.lightbox');
    const lbImg = root.querySelector('.lightbox__img');

    if (!certBtn || !certImg || !lightbox || !lbImg) return;

    const open = () => {
      const src =
        certImg.getAttribute('data-fullsrc') || certImg.getAttribute('src');
      lbImg.setAttribute('src', src || '');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      lbImg.setAttribute('src', '');
      document.body.style.overflow = '';
    };

    certBtn.addEventListener('click', open, { passive: true });
    lightbox.addEventListener('click', (e) => {
      if (e.target && e.target.dataset && e.target.dataset.close === 'true')
        close();
    });
    document.addEventListener('keydown', (e) => {
      if (
        lightbox.getAttribute('aria-hidden') === 'false' &&
        (e.key === 'Escape' || e.key === 'Esc')
      )
        close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   8) #attorney-profile : 데이터 스위치
   ───────────────────────────────────────────────────────── */
(function () {
  const LAWYERS = {
    lee: {
      name: '개인회생',
      position:
        '3년 ~ 5년간 일정한 금액을 변제하면\n 나머지 채무의 면제를 받을 수 있는 국가지원제도',
      phone: '접수 순간부터 추심·연체이자가 멈추고, 독촉 전화·압류 압박에서 해방됩니다.',
      eduTitle: '▲ 개인회생 자격',
      careerTitle: '▲ 개인회생 장점',
      edu: [
        '일정한 월 수입이 있다',
        '전체 빚이 무담보 10 억 / 담보 15 억 이하다.',
        '독촉·압류가 이미 진행 중이거나 곧 우려된다.',
        '과거 개인회생 면책을 받은 적이 없거나 받은 지 5년이 지났다.'
      ],
      career: [
        '원금 최대 90 % 탕감 가능',
        '모든 연체 이자·지연손해금 즉시 정지',
        '급여·통장·자동차 압류 보호로 생활 기반 유지 가능',
        '집 보유한 채 절차 진행 가능',
        '전문직·공무원·자영업자도 그대로 일할 수 있습니다',
        '신용 회복 및 금융거래 재개'
      ]
    },
    kim: {
      name: '개인파산',
      position:
        '채무자가 가진 모든 재산으로도 빚을 갚을 수 없을 때, 재산을 현금화하고 남은 채무를 법적으로 소멸시켜주는 절차',
      phone: '새 출발할 수 있도록 모든 원금·이자 전부 소멸',
      eduTitle: '▲ 개인파산 자격',
      careerTitle: '▲ 개인파산 장점',
      edu: [
        '재산을 모두 처분해도 빚을 상환할 수 없다',
        '지속적인 수입이 없거나 매우 불안정하다',
        '면책불허 사유(사기·도박 등)가 없다',
        '최근 5년 내 파산 면책을 받은 이력이 없다'
      ],
      career: [
        '원금·이자 100 % 면책',
        '추심·압류 즉시 중단',
        '소득 없던 사람도 구제 가능',
        '절차 6~12개월로 비교적 짧음',
        '생활 필수 재산(기본 의복·가재도구 등) 보호',
        '재기 지원 제도(서민금융진흥원 등) 이용 가능'
      ]
    }
  };

  function init() {
    const sec = document.getElementById('attorney-profile');
    if (!sec) return;

    const info = sec.querySelector('.ap-info');
    const mainPhoto = sec.querySelector('.main-photo');
    const cap = sec.querySelector('.ap-caption');
    const lname = sec.querySelector('.ap-lname');
    const pos = sec.querySelector('.ap-position');
    const phone = sec.querySelector('.ap-phone');
    const eduUl = sec.querySelector('.ap-edu');
    const carUl = sec.querySelector('.ap-career');
    const btns = sec.querySelectorAll('.ap-select button');
    const eduHeading = sec.querySelector('.ap-edu-heading');
    const carHeading = sec.querySelector('.ap-career-heading');

    if (!lname || !pos || !phone || !eduUl || !carUl || !btns.length) return;

    function render(view) {
      if (eduHeading) eduHeading.textContent = view.eduTitle;
      if (carHeading) carHeading.textContent = view.careerTitle;

      lname.textContent = view.name;
      pos.textContent = view.position;
      phone.textContent = view.phone;

      // 전화번호가 숫자를 포함할 때만 tel 링크 설정
      const digits = (view.phone.match(/\d+/g) || []).join('');
      if (digits.length >= 7) {
        phone.setAttribute('href', 'tel:' + digits);
      } else {
        phone.removeAttribute('href');
      }

      eduUl.innerHTML = view.edu.map((v) => `<li>${v}</li>`).join('');
      carUl.innerHTML = view.career.map((v) => `<li>${v}</li>`).join('');

      if (mainPhoto) mainPhoto.alt = view.name;
      if (cap) cap.textContent = view.name;
    }

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('on')) return;
        btns.forEach((b) => b.classList.toggle('on', b === btn));
        const key = btn.dataset.lawyer;
        if (key && LAWYERS[key]) render(LAWYERS[key]);
      });
    });

    render(LAWYERS.lee);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   9) #legalDBHero : 실시간 DB 스택(오토 스크롤 카드) + 우측 li 하이라이트
   ───────────────────────────────────────────────────────── */
(function () {
  function initStack() {
    const root = document.querySelector('#legalDBHero');
    if (!root) return;
    const track = root.querySelector('.dbTrack');
    const stack = root.querySelector('.dbStack');
    if (!track || !stack) return;

    const VISIBLE = 5,
      GAP = 10,
      INTERVAL = 2600;

    const DB_LIST = [
      {
        city: '서울',
        age: 34,
        overdue: '즉시 경매 집행 중단',
        debt: '채무 ***만원',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '부산',
        age: 41,
        overdue: '월급 압류 해제',
        debt: '채무 ***만원',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '대구',
        age: 29,
        overdue: '아파트 경매 집행 중지',
        debt: '채무 ***만원',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '수원',
        age: 38,
        overdue: '채무 83% 탕감',
        debt: '월 상환액 150만원 감소',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '인천',
        age: 33,
        overdue: '추심 즉각 중단',
        debt: '채무 ***만원',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '대전',
        age: 36,
        overdue: '채무 79% 탕감',
        debt: '월 상환액 210만원 감소',
        memo: '긴급 안심콜',
        time: ''
      },
      {
        city: '창원',
        age: 45,
        overdue: '추심 즉각 중단',
        debt: '채무 ***만원',
        memo: '긴급 안심콜',
        time: ''
      }
    ];

    function createCard(data) {
      const el = document.createElement('div');
      el.className = 'db-card enter';
      el.innerHTML = `
        <div class="db-avatar"></div>
        <div class="db-main">
          <p class="db-title">${data.city} · ${data.age}세 · ${data.overdue}</p>
          <p class="db-sub">${data.debt} · ${data.memo} <span style="color:var(--muted);font-size:.9em">${data.time}</span></p>
        </div>`;
      requestAnimationFrame(() => el.classList.add('is-in'));
      return el;
    }

    function shiftUp(by) {
      track.classList.add('is-shifting');
      track.style.transform = `translateY(-${by}px)`;
      return new Promise((res) => {
        const onEnd = () => {
          track.removeEventListener('transitionend', onEnd);
          res();
        };
        track.addEventListener('transitionend', onEnd, { once: true });
      }).then(() => {
        track.classList.remove('is-shifting');
        track.style.transform = 'translateY(0)';
      });
    }

    let idx = 0,
      paused = false,
      timer = null,
      cardHeight = 78;

    function prime() {
      const init = Math.min(VISIBLE, DB_LIST.length);
      for (let i = 0; i < init; i++) pushNext();
      if (track.children.length)
        cardHeight = track.children[0].getBoundingClientRect().height;
    }

    function pushNext() {
      const data = DB_LIST[idx % DB_LIST.length];
      idx++;
      const card = createCard(data);
      track.appendChild(card);

      const cards = track.children;
      if (cards.length > VISIBLE) {
        const first = cards[0];
        shiftUp(cardHeight + GAP).then(() => first.remove());
      }
    }

    function schedule() {
      clearInterval(timer);
      timer = setInterval(() => {
        if (!paused) pushNext();
      }, INTERVAL);
    }

    stack.addEventListener('mouseenter', () => (paused = true));
    stack.addEventListener('mouseleave', () => (paused = false));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) schedule();
          else clearInterval(timer);
        });
      },
      { threshold: 0.2 }
    );
    io.observe(stack);

    prime();
  }

  function initRightListPulse() {
    const root = document.querySelector('#legalDBHero');
    if (!root) return;
    const list = root.querySelector('.right ul');
    if (!list) return;
    const items = Array.from(list.querySelectorAll('li'));
    if (!items.length) return;

    let idx = 0;
    let timer = null;
    let playing = false;
    const STEP = 3000;

    function tick() {
      items.forEach((li) => li.classList.remove('pulse'));
      items[idx].classList.add('pulse');
      idx = (idx + 1) % items.length;
    }
    function start() {
      if (playing) return;
      playing = true;
      tick();
      timer = setInterval(tick, STEP);
    }
    function stop() {
      if (!playing) return;
      playing = false;
      clearInterval(timer);
      timer = null;
    }

    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) start();
          else stop();
        });
      },
      { threshold: 0.15 }
    );
    io.observe(list);

    // 초기 진입 시 바로 시작 가능
    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initStack();
      initRightListPulse();
    });
  } else {
    initStack();
    initRightListPulse();
  }
})();

/* ─────────────────────────────────────────────────────────
   10) #floatingCallBarPro : 바 전체 클릭 시 tel 연결
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const bar = document.querySelector('#floatingCallBarPro .bar');
    if (!bar) return;
    bar.addEventListener('click', function (e) {
      const isBtn = e.target.closest('.callBtn');
      if (!isBtn) {
        const href = bar.getAttribute('data-call');
        if (href) window.location.href = href;
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   11) jQuery UI 토글(존재 시에만 실행)
   ───────────────────────────────────────────────────────── */
(function () {
  function init($) {
    if (!$) return;

    $('.navi_btn').on('click', function () {
      $(this).toggleClass('on');
      $('.navi').stop().fadeToggle();
    });

    $('.lnb h3').on('click', function () {
      const naviTitle = $(this).next('ul');
      $(this).addClass('on');
      $('.lnb h3').not(this).removeClass('on');
      naviTitle.stop().slideDown();
      $('.lnb h3').next().not(naviTitle).slideUp();
    });

    $('.right_contact .left').on('click', function () {
      $('.right_contact').toggleClass('on');
    });

    $('.bottom_contact_mob .top_thumb').on('click', function () {
      $('.bottom_contact_mob').toggleClass('on');
    });

    $('.bottom_contact_mob .bottom_con .btn_list .close_btn').on(
      'click',
      function () {
        $('.bottom_contact_mob').removeClass('on');
      }
    );
  }

  if (window.jQuery) {
    init(window.jQuery);
  } else {
    // jQuery가 늦게 로드되는 경우 대비
    document.addEventListener('DOMContentLoaded', () => {
      if (window.jQuery) init(window.jQuery);
    });
  }
})();

/* ─────────────────────────────────────────────────────────
   12) Swiper 페이드 슬라이더 + 진행바(존재 시에만 실행)
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    if (typeof Swiper === 'undefined') return;
    const container = document.querySelector('.swiper-container');
    const bar = document.querySelector('.progress-container');
    if (!container || !bar) return;

    const DELAY = 5000,
      SPEED = 1000;

    const swiper = new Swiper('.swiper-container', {
      effect: 'fade',
      loop: true,
      speed: SPEED,
      slidesPerView: 1,
      autoplay: {
        delay: DELAY,
        disableOnInteraction: false,
        waitForTransition: false
      },
      shortSwipes: true,
      longSwipes: false,
      threshold: 20,
      slideToClickedSlide: true
    });

    const slides = Array.from(
      document.querySelectorAll('.swiper-container .swiper-slide')
    ).filter((s) => !s.classList.contains('swiper-slide-duplicate'));
    const fills = [];

    slides.forEach((_, i) => {
      const seg = document.createElement('div');
      seg.className = 'progress-segment';
      const fill = document.createElement('span');
      fill.className = 'progress-fill';
      seg.appendChild(fill);
      bar.appendChild(seg);
      fills.push(fill);

      seg.addEventListener('click', () => swiper.slideToLoop(i, SPEED));
    });

    function updateProgress(idx) {
      fills.forEach((f, j) => {
        f.style.transition = 'none';
        f.style.width = j < idx ? '100%' : '0';
      });
      const active = fills[idx];
      // reflow
      void active.offsetWidth;
      active.style.transition = `width ${DELAY}ms linear`;
      active.style.width = '100%';
    }

    updateProgress(0);
    swiper.on('slideChange', () => updateProgress(swiper.realIndex));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   13) 모바일 메뉴 / 스크롤 헤더 / 전화 버튼 로테이션
   ───────────────────────────────────────────────────────── */
(function () {
  // 전역 함수로 사용될 수 있어 함수 선언 형태 유지
  window.toggleMobile = function toggleMobile() {
    const panel = document.getElementById('mobilePanel');
    const burger = document.getElementById('hamburgerBtn');
    const nav = document.getElementById('mainNav');
    const logoImg = document.getElementById('logoImg');
    if (!panel || !burger || !nav || !logoImg) return;

    panel.classList.toggle('show');
    burger.classList.toggle('open');
    nav.classList.toggle('menu-open', panel.classList.contains('show'));

    if (window.pageYOffset === 0) {
      logoImg.src = panel.classList.contains('show')
        ? logoImg.dataset.srcDark
        : logoImg.dataset.srcLight;
    }
  };

  const navEl = document.getElementById('mainNav');
  const logoImg = document.getElementById('logoImg');
  let lastY = window.pageYOffset;

  function onScroll() {
    if (!navEl || !logoImg) return;
    const y = window.pageYOffset;
    if (y === 0) {
      navEl.classList.add('transparent');
      navEl.classList.remove('solid');
      if (logoImg.dataset?.srcLight) logoImg.src = logoImg.dataset.srcLight;
    } else {
      navEl.classList.remove('transparent');
      navEl.classList.add('solid');
      if (logoImg.dataset?.srcDark) logoImg.src = logoImg.dataset.srcDark;
      navEl.classList.remove('menu-open');
      const burger = document.getElementById('hamburgerBtn');
      const panel = document.getElementById('mobilePanel');
      if (burger) burger.classList.remove('open');
      if (panel) panel.classList.remove('show');
    }
    if (y > lastY && y > 50) navEl.classList.add('hide');
    else navEl.classList.remove('hide');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // 전화 버튼 로테이션 (데이터가 비어 있어도 안전)
  const callData = [
    { lines: [''], tel: '' },
    { lines: [''], tel: '' }
  ];
  const swapDelay = 4000;
  const fadeDur = 350;

  const phoneBtns = Array.from(document.querySelectorAll('.phone-btn'));
  const txtSpans = phoneBtns.map((btn) => btn.querySelector('.txt'));
  let idx = 0;

  function setContent(lines, tel) {
    txtSpans.forEach((s) => {
      if (!s) return;
      const l0 = lines[0] ?? '';
      const l1 = lines[1] ?? '';
      s.innerHTML = `${l0}<br>${l1}`;
      // br이 싫다면 s.textContent = [l0,l1].filter(Boolean).join('\n');
    });
    phoneBtns.forEach((b) => {
      if (!b) return;
      if (tel) b.href = `tel:${tel}`;
      else b.removeAttribute('href');
    });
  }

  function swapPhoneMsg() {
    idx = (idx + 1) % callData.length;
    txtSpans.forEach((s) => s && (s.style.opacity = 0));
    setTimeout(() => {
      const { lines, tel } = callData[idx];
      setContent(lines, tel);
      txtSpans.forEach((s) => s && (s.style.opacity = 1));
    }, fadeDur);
  }

  setContent(callData[0].lines, callData[0].tel);
  if (phoneBtns.length) setInterval(swapPhoneMsg, swapDelay);
})();

/* ─────────────────────────────────────────────────────────
   14) #reliefBanner : 숫자 애니메이션 + #dailyCountdown
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    // ① 숫자 애니메이션
    const counters = document.querySelectorAll('#reliefBanner .counter');
    if (counters.length) {
      function animate(counter) {
        const target = +counter.dataset.target;
        const duration = +counter.dataset.duration || 1500;
        const startTime = performance.now();
        function update(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const value = Math.round(progress * target);
          counter.textContent = value.toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      }

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            if (entry.isIntersecting) animate(el);
            else el.textContent = '0';
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((c) => io.observe(c));
    }

    // ② 데일리 카운트다운(매일 23:59:59)
    const cd = document.getElementById('dailyCountdown');
    if (cd) {
      const hourEl = cd.querySelector('.hh');
      const minEl = cd.querySelector('.mm');
      const secEl = cd.querySelector('.ss');

      function getTodayDeadline() {
        const t = new Date();
        t.setHours(23, 59, 59, 999);
        if (Date.now() > t.getTime()) t.setDate(t.getDate() + 1);
        return t;
      }
      function updateCountdown() {
        const now = new Date();
        const end = getTodayDeadline();
        const diff = end - now;
        const total = Math.max(0, Math.floor(diff / 1000));
        const hours = Math.floor((total % 86400) / 3600);
        const mins = Math.floor((total % 3600) / 60);
        const secs = total % 60;

        if (hourEl) hourEl.textContent = String(hours).padStart(2, '0');
        if (minEl) minEl.textContent = String(mins).padStart(2, '0');
        if (secEl) secEl.textContent = String(secs).padStart(2, '0');
      }
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   15) 내부 앵커 스무스 스크롤 + 모바일 메뉴 자동 닫기
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const menuLinks = document.querySelectorAll('a[href^="#"]');
    if (!menuLinks.length) return;

    menuLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });

        const mobilePanel = document.getElementById('mobilePanel');
        if (mobilePanel && mobilePanel.classList.contains('open')) {
          if (typeof window.toggleMobile === 'function') window.toggleMobile();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   16) 간단 토글 버튼들 (#toggleBtn/#partnerList, #proToggleBtn/#proPartnerList)
   ───────────────────────────────────────────────────────── */
(function () {
  function init() {
    const toggle = (btnId, listId) => {
      const btn = document.getElementById(btnId);
      const list = document.getElementById(listId);
      if (btn && list) {
        btn.addEventListener('click', () => list.classList.toggle('show'));
      }
    };
    toggle('toggleBtn', 'partnerList');
    toggle('proToggleBtn', 'proPartnerList');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();

/* ─────────────────────────────────────────────────────────
   17) .blink : 부드러운 무한 깜박임 (접근성 고려)
   - data-period(400~5000ms), data-min(0~0.95)
   - 뷰포트와 무관하게 항상 애니메이트
   ───────────────────────────────────────────────────────── */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    .matches;

  function clamp(n, min, max, fb) {
    if (Number.isNaN(n)) return fb;
    return Math.min(max, Math.max(min, n));
  }

  function opacityAt(t, period, minOpacity) {
    const amp = 1 - minOpacity;
    const phase = (t % period) / period;
    const wave = Math.sin(phase * Math.PI * 2); // -1~1
    return minOpacity + amp * (0.5 + 0.5 * wave);
  }

  function startBlink(el) {
    const period = clamp(
      parseInt(el.getAttribute('data-period'), 10),
      400,
      5000,
      1200
    );
    const min = clamp(
      parseFloat(el.getAttribute('data-min')),
      0,
      0.95,
      0.2
    );
    const effectivePeriod = prefersReduced ? period * 1.6 : period;
    const effectiveMin = prefersReduced ? Math.min(min + 0.15, 0.8) : min;
    const t0 = performance.now();

    function tick(now) {
      const op = opacityAt(now - t0, effectivePeriod, effectiveMin);
      el.style.opacity = op.toFixed(3);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function init() {
    document.querySelectorAll('.blink').forEach(startBlink);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
