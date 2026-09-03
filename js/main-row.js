/* ======================================================================
   main.js  —  Single-file integration of all inline scripts
   - Safe to include once with <script src="./js/main.js" defer></script>
   - Each feature is isolated & null-guarded to avoid errors
   - No globals leaked; observers/timers cleaned where relevant
   ====================================================================== */
(() => {
  'use strict';

  // --------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  const raf   = (fn) => window.requestAnimationFrame(fn);
  const qsNum = (s, root = document) => parseFloat(getComputedStyle(root).getPropertyValue(s)) || 0;

  // --------------------------------------------------------------------
  // 1) Smooth anchor scroll (deduped)
  // --------------------------------------------------------------------
  function setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      on(anchor, 'click', function (e) {
        const targetId = this.getAttribute('href') || '';
        if (targetId.length <= 1) return; // skip "#" only
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, { passive: true });
    });
  }

  // --------------------------------------------------------------------
  // 2) Sticky Topbar: hide-on-scroll, rotating text, hero offset
  //    Requires: #stickyTopbar .topbar, .fade-rotator (optional), #legalDBHero (optional)
  // --------------------------------------------------------------------
  function setupStickyTopbar() {
    const headerSec = $('#stickyTopbar');
    if (!headerSec) return;

    const bar     = headerSec.querySelector('.topbar');
    const rotator = headerSec.querySelector('.fade-rotator');
    const hero    = $('#legalDBHero');
    if (!bar) return;

    function setHeroHeaderSpace() {
      if (!hero) return;
      const h = bar.getBoundingClientRect().height || 0;
      hero.style.setProperty('--hdr-space', (h + 20) + 'px');
    }
    setHeroHeaderSpace();
    on(window, 'resize', setHeroHeaderSpace, { passive: true });

    let lastY = window.pageYOffset || document.documentElement.scrollTop || 0;
    let ticking = false;
    const threshold  = 8;
    const minShowTop = 10;

    function onScroll() {
      const y  = window.pageYOffset || document.documentElement.scrollTop || 0;
      const dy = y - lastY;

      if (Math.abs(dy) > threshold) {
        if (dy > 0 && y > (bar.offsetHeight + 10)) {
          bar.style.transform = 'translate(-50%, -120%)';
        } else {
          bar.style.transform = 'translate(-50%, 0)';
        }
        lastY = y;
      }
      if (y <= minShowTop) bar.style.transform = 'translate(-50%, 0)';
      ticking = false;
    }
    on(window, 'scroll', () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    // Rotator play/pause
    const playRotate  = () => rotator && rotator.classList.add('play');
    const stopRotate  = () => rotator && rotator.classList.remove('play');

    if ('IntersectionObserver' in window && rotator) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(ent => ent.isIntersecting ? playRotate() : stopRotate());
      }, { threshold: 0.01 });
      io.observe(bar);
    } else {
      playRotate();
    }
    on(document, 'visibilitychange', () => {
      if (document.hidden) stopRotate();
      else { stopRotate(); raf(playRotate); }
    });
  }

  // --------------------------------------------------------------------
  // 3) Legal DB hero — rolling DB list
  //    Requires: #legalDBHero .dbTrack, .dbStack, constants & DB_LIST data
  // --------------------------------------------------------------------
  function setupLegalDbHeroTicker() {
    const root  = $('#legalDBHero');
    if (!root) return;
    const track = root.querySelector('.dbTrack');
    const stack = root.querySelector('.dbStack');
    if (!track || !stack) return;

    const VISIBLE = 5, GAP = 10, INTERVAL = 2600;

   const DB_LIST = [

  // ─── 소액 → 중액 → 대형 교차 패턴 ① ───
  { city: '서울', age: '미용실', overdue: '3,000만원', debt: '**', memo: '1개월 이내', time: '' },
  { city: '대전', age: '의료기기 도소매', overdue: '1억', debt: '3억', memo: '2개월 이내', time: '' },
  { city: '울산', age: '조선 협력 납품사', overdue: '29억', debt: '67억', memo: '1개월 이내', time: '' },

  // ─── 소액 → 중액 → 대형 ② ───
  { city: '부산', age: '개인택시', overdue: '2,000만원', debt: '**', memo: '2개월 이내', time: '' },
  { city: '강원', age: '건설 하도급', overdue: '7억', debt: '16억', memo: '3개월 이내', time: '' },
  { city: '서울', age: '프랜차이즈 본사', overdue: '37억', debt: '85억', memo: '1개월 이내', time: '' },

  // ─── 소액 → 중액 → 대형 ③ ───
  { city: '대구', age: '분식집', overdue: '2,000만원', debt: '**', memo: '1개월 이내', time: '' },
  { city: '충북', age: '플라스틱 사출 제조', overdue: '10억', debt: '23억', memo: '1개월 이내', time: '' },
  { city: '부산', age: '종합 도매상', overdue: '32억', debt: '66억', memo: '2개월 이내', time: '' },

  // ─── 소액 → 중액 → 대형 ④ ───
  { city: '인천', age: 'PC방', overdue: '3,000만원', debt: '**', memo: '3개월 이내', time: '' },
  { city: '전북', age: '농산물 도매센터 운영', overdue: '9억', debt: '21억', memo: '2개월 이내', time: '' },
  { city: '대구', age: '금속 가공 제조', overdue: '21억', debt: '47억', memo: '2개월 이내', time: '' },

  // ─── 소액 → 중액 → 대형 ⑤ ───
  { city: '광주', age: '애견샵', overdue: '2,000만원', debt: '**', memo: '1개월 이내', time: '' },
  { city: '전남', age: '수산 가공 공장', overdue: '15억', debt: '33억', memo: '3개월 이내', time: '' },
  { city: '경기', age: '자동차 부품 제조', overdue: '41억', debt: '90억', memo: '2개월 이내', time: '' },

  // ─── 소액 → 중액 → 대형 ⑥ ───
  { city: '대전', age: '택배업', overdue: '3,000만원', debt: '**', memo: '2개월 이내', time: '' },
  { city: '강원', age: '건설 중장비 임대', overdue: '8억', debt: '18억', memo: '2개월 이내', time: '' },
  { city: '충남', age: '철강 가공업', overdue: '26억', debt: '58억', memo: '2개월 이내', time: '' },

  // ─── 소액 → 중액 → 대형 ⑦ ───
  { city: '울산', age: '화물운송', overdue: '4,000만원', debt: '**', memo: '1개월 이내', time: '' },
  { city: '인천', age: '무역 중개업', overdue: '12억', debt: '29억', memo: '1개월 이내', time: '' },
  { city: '경북', age: '전자부품 유통', overdue: '17억', debt: '44억', memo: '1개월 이내', time: '' },

  // ─── 소액 → 중액 → 대형 ⑧ ───
  { city: '경기', age: '옷가게', overdue: '3,000만원', debt: '**', memo: '2개월 이내', time: '' },
  { city: '충북', age: '자동 포장기 제조', overdue: '10억', debt: '27억', memo: '3개월 이내', time: '' },
  { city: '경남', age: '기계 장비 유통', overdue: '24억', debt: '61억', memo: '2개월 이내', time: '' },

  // ─── 소액 → 중액 → 대형 ⑨ ───
  { city: '강원', age: '도소매업', overdue: '4,000만원', debt: '**', memo: '3개월 이내', time: '' },
  { city: '대전', age: '건축 자재 도매', overdue: '18억', debt: '42억', memo: '1개월 이내', time: '' },
  { city: '제주', age: '리조트 운영사', overdue: '53억', debt: '120억', memo: '3개월 이내', time: '' },

  // ─── 소액 → 소액 → 중대형 마무리 ───
  { city: '서울', age: '도소매업', overdue: '4,000만원', debt: '**', memo: '1개월 이내', time: '' },
  { city: '부산', age: '카센터', overdue: '5,000만원', debt: '**', memo: '2개월 이내', time: '' },
  { city: '울산', age: '플랜트 기자재 납품', overdue: '33억', debt: '71억', memo: '2개월 이내', time: '' },

  { city: '대구', age: '제조업', overdue: '4,000만원', debt: '**', memo: '2개월 이내', time: '' },
  { city: '경기', age: 'IT 하드웨어 유통', overdue: '26억', debt: '64억', memo: '1개월 이내', time: '' },

  // ─── 일반 소상공인 클로징 ───
  { city: '광주', age: '도소매업', overdue: '5,000만원', debt: '**', memo: '3개월 이내', time: '' },
  { city: '충남', age: '콘크리트 제조', overdue: '22억', debt: '53억', memo: '1개월 이내', time: '' },

  { city: '강원', age: '요식업', overdue: '2,000만원', debt: '**', memo: '2개월 이내', time: '' },
  { city: '충북', age: 'PC방', overdue: '3,000만원', debt: '**', memo: '3개월 이내', time: '' },
  { city: '충남', age: '택배업', overdue: '2,000만원', debt: '**', memo: '1개월 이내', time: '' },
  { city: '전북', age: '화물운송', overdue: '4,000만원', debt: '**', memo: '2개월 이내', time: '' },
  { city: '전남', age: '분식집', overdue: '2,000만원', debt: '**', memo: '1개월 이내', time: '' },
  { city: '경북', age: '미용실', overdue: '3,000만원', debt: '**', memo: '3개월 이내', time: '' },
  { city: '경남', age: '요식업', overdue: '3,000만원', debt: '**', memo: '2개월 이내', time: '' },
  { city: '제주', age: '택배업', overdue: '2,000만원', debt: '**', memo: '1개월 이내', time: '' }

];


    function createCard(data) {
      const el = document.createElement('div');
      el.className = 'db-card enter';
      el.innerHTML = `
        <div class="db-avatar"></div>
        <div class="db-main">
          <p class="db-title">${data.city} · ${data.age} · <b style="color:#13b5a3;">[${data.overdue}  승인]</b></p>
          <p class="db-sub">연매출 ${data.debt} · 승인기간 : ${data.memo} <span style="color:var(--muted);font-size:.9em">${data.time}</span></p>
        </div>`;
      raf(() => el.classList.add('is-in'));
      return el;
    }

    function shiftUp(by) {
      track.classList.add('is-shifting');
      track.style.transform = `translateY(-${by}px)`;
      return new Promise(res => {
        const onEnd = () => { track.removeEventListener('transitionend', onEnd); res(); };
        track.addEventListener('transitionend', onEnd, { once: true });
      }).then(() => {
        track.classList.remove('is-shifting');
        track.style.transform = 'translateY(0)';
      });
    }

    let idx = 0, paused = false, timer = null, cardHeight = 78;

    function pushNext() {
      const data = DB_LIST[idx % DB_LIST.length]; idx++;
      const card = createCard(data);
      track.appendChild(card);

      const cards = track.children;
      if (cards.length > VISIBLE) {
        const first = cards[0];
        shiftUp(cardHeight + GAP).then(() => first.remove());
      }
    }

    function prime() {
      const init = Math.min(VISIBLE, DB_LIST.length);
      for (let i = 0; i < init; i++) pushNext();
      if (track.children.length) {
        cardHeight = track.children[0].getBoundingClientRect().height || cardHeight;
      }
    }

    function schedule() {
      clearInterval(timer);
      timer = setInterval(() => { if (!paused) pushNext(); }, INTERVAL);
    }

    on(stack, 'mouseenter', () => paused = true);
    on(stack, 'mouseleave', () => paused = false);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => e.isIntersecting ? schedule() : clearInterval(timer));
      }, { threshold: .2 });
      io.observe(stack);
    } else {
      schedule();
    }

    prime();
  }

  // --------------------------------------------------------------------
  // 4) Reveal cards under #whoCanPartner (.card.reveal)
  // --------------------------------------------------------------------
  function setupWhoCanPartnerReveal() {
    const root = $('#whoCanPartner');
    if (!root) return;
    const targets = root.querySelectorAll('.card.reveal');
    if (!targets.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('show', entry.isIntersecting);
      });
    }, { threshold: .18, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(el => io.observe(el));
  }

  // --------------------------------------------------------------------
  // 5) Simple highlighter rotators (#eventList .item, #eventList1 .item)
  // --------------------------------------------------------------------
  function setupEventRotators() {
    const lists = ['#eventList', '#eventList1'];
    lists.forEach(sel => {
      const items = document.querySelectorAll(`${sel} .item`);
      if (!items.length) return;
      let idx = -1;
      setInterval(() => {
        items.forEach(i => i.classList.remove('active'));
        idx = (idx + 1) % items.length;
        items[idx].classList.add('active');
      }, 2000);
    });
  }

  // --------------------------------------------------------------------
  // 6) Terms modal inside #applyMintForm, + footer z-index management
  // --------------------------------------------------------------------
  function setupTermsModal() {
    const root = $('#applyMintForm');
    if (!root) return;
    const form = root.querySelector('#applyForm');
    if (!form) return;

    const agreeBox      = form.querySelector('#agree');
    const agreeTextSpan = root.querySelector('.agree span');

    const footer = $('#siteFooter');
    let prevFooterZ = null;

    (function injectFooterRule() {
      const style = document.createElement('style');
      style.textContent = `html.__modal-open #siteFooter{ z-index:-1 !important; }`;
      document.head.appendChild(style);
    })();

    const lowerFooter = () => {
      document.documentElement.classList.add('__modal-open');
      if (footer) {
        prevFooterZ = footer.style.zIndex || '';
        footer.style.zIndex = '-1';
      }
    };
    const restoreFooter = () => {
      document.documentElement.classList.remove('__modal-open');
      if (footer) {
        if (prevFooterZ) footer.style.zIndex = prevFooterZ;
        else footer.style.removeProperty('z-index');
        prevFooterZ = null;
      }
    };

    // '자세히 보기' 버튼 삽입 (중복 방지)
    let termsBtn = root.querySelector('.terms-link');
    if (!termsBtn) {
      termsBtn = document.createElement('button');
      termsBtn.type = 'button';
      termsBtn.className = 'terms-link';
      termsBtn.textContent = '자세히 보기';
      termsBtn.setAttribute('aria-haspopup', 'dialog');
      if (agreeTextSpan) {
        agreeTextSpan.appendChild(document.createTextNode(' '));
        agreeTextSpan.appendChild(termsBtn);
      }
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

    const sheet       = overlay.querySelector('.terms-sheet');
    const closeX      = overlay.querySelector('.terms-close-x');
    const cancelBtn   = overlay.querySelector('.terms-cancel');
    const acceptBtn   = overlay.querySelector('.terms-accept');
    const inlineAgree = overlay.querySelector('#termsInlineAgree');

    let prevFocus = null;

    function openTerms() {
      prevFocus = document.activeElement;
      root.setAttribute('data-modal-open', 'true');
      overlay.hidden = false;
      sheet && sheet.focus();
      lowerFooter();
      document.addEventListener('keydown', onKeydown, true);
      overlay.addEventListener('click', onBackdrop);
    }
    function closeTerms() {
      overlay.hidden = true;
      root.removeAttribute('data-modal-open');
      restoreFooter();
      document.removeEventListener('keydown', onKeydown, true);
      overlay.removeEventListener('click', onBackdrop);
      if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
    }
    const onBackdrop = (e) => { if (e.target === overlay) closeTerms(); };
    function onKeydown(e) {
      if (e.key === 'Escape') { e.preventDefault(); closeTerms(); }
      if (e.key === 'Tab') {
        const f = sheet.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
        const focusables = Array.prototype.slice.call(f);
        if (!focusables.length) return;
        const first = focusables[0];
        const last  = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    on(termsBtn, 'click', (e) => { e.preventDefault(); e.stopPropagation(); openTerms(); });
    on(closeX,   'click', (e) => { e.preventDefault(); closeTerms(); });
    on(cancelBtn,'click', (e) => { e.preventDefault(); closeTerms(); });

    on(acceptBtn, 'click', (e) => {
      e.preventDefault(); e.stopPropagation();
      if (inlineAgree) inlineAgree.checked = true;
      if (agreeBox) {
        agreeBox.checked = true;
        agreeBox.dispatchEvent(new Event('change', { bubbles: true }));
      }
      acceptBtn.blur();
      closeTerms();
    });

    // 작은 시각 피드백 애니메이션 정의 (필요 시 트리거하여 사용)
    if (!root.querySelector('style[data-terms-shake]')) {
      const css = document.createElement('style');
      css.dataset.termsShake = '1';
      css.textContent = `
        #applyMintForm .terms-sheet.shake{ animation: applyShake .3s; }
        @keyframes applyShake{
          10%{ transform:translateY(0) translateX(-2px) }
          20%{ transform:translateY(0) translateX(2px) }
          30%{ transform:translateY(0) translateX(-2px) }
          40%{ transform:translateY(0) translateX(2px) }
          50%{ transform:translateY(0) translateX(-1px) }
          60%{ transform:translateY(0) translateX(1px) }
          100%{ transform:translateY(0) translateX(0) }
        }
      `;
      root.appendChild(css);
    }

    // Footer 링크 → 약관 모달 열기 연동
    const openFooterTerms = () => {
      const btn = $('#applyMintForm .terms-link');
      if (btn) { btn.click(); return true; }
      return false;
    };
    $$('#siteFooter [data-open-terms]').forEach(a => {
      on(a, 'click', (e) => { e.preventDefault(); if (!openFooterTerms()) location.hash = '#applyMintForm'; });
    });
  }

  // --------------------------------------------------------------------
  // 7) Select arrow wrapper (once)
  // --------------------------------------------------------------------
  function setupSelectWrap() {
    const root = $('#applyMintForm');
    if (!root) return;
    const selects = root.querySelectorAll('select');
    selects.forEach(sel => {
      if (sel.closest('.select-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'select-wrap';
      sel.parentNode.insertBefore(wrap, sel);
      wrap.appendChild(sel);

      const open  = () => wrap.classList.add('open');
      const close = () => wrap.classList.remove('open');

      on(sel, 'focus', open);
      on(sel, 'click', open);
      on(sel, 'mousedown', open);
      on(sel, 'touchstart', open, { passive: true });
      on(sel, 'blur', close);
      on(sel, 'change', close);
      on(sel, 'keydown', (e) => { if (e.key === 'Escape') close(); });
    });
  }

  // --------------------------------------------------------------------
  // 8) Kakao floating FAB pulse reset on re-enter
  // --------------------------------------------------------------------
  function setupKakaoFloatingPulse() {
    const root = $('#kakaoFloating');
    const btn  = root?.querySelector('.fab');
    if (!root || !btn || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          btn.style.animation = 'none';
          void btn.offsetHeight;
          btn.style.animation = '';
        }
      });
    }, { threshold: 0.01 });
    observer.observe(root);
  }

  // --------------------------------------------------------------------
  // 9) Maxlength enforcement with IME support (inputs & textareas)
  // --------------------------------------------------------------------
  function setupMaxlengthGuard() {
    const TEXTUAL_TYPES = new Set(['', 'text', 'search', 'tel', 'password', 'url', 'email']);
    const composing = new WeakMap();

    const isTextual = (el) =>
      el && (
        el.tagName === 'TEXTAREA' ||
        (el.tagName === 'INPUT' && TEXTUAL_TYPES.has((el.type || '').toLowerCase()))
      );

    const truncate = (el, MAX) => {
      if (!isFinite(MAX)) return;
      const v = el.value || '';
      if (v.length > MAX) {
        const pos = el.selectionStart;
        el.value = v.slice(0, MAX);
        const p = Math.min(typeof pos === 'number' ? pos : MAX, MAX);
        if (el.setSelectionRange) el.setSelectionRange(p, p);
      }
    };

    const attach = (el) => {
      if (!isTextual(el)) return;
      if (!el.hasAttribute('maxlength')) return;

      const getMAX = () => {
        const n = parseInt(el.getAttribute('maxlength'), 10);
        return Number.isFinite(n) ? n : Infinity;
      };

      on(el, 'compositionstart', () => composing.set(el, true));
      on(el, 'compositionend',  () => { composing.set(el, false); truncate(el, getMAX()); });

      on(el, 'beforeinput', (e) => {
        if (composing.get(el)) return;
        if (e.inputType !== 'insertText') return;
        const MAX = getMAX();
        if (!isFinite(MAX)) return;

        const { value, selectionStart, selectionEnd } = el;
        const replacing = Math.max(0, (selectionEnd ?? value.length) - (selectionStart ?? value.length));
        const inserting  = (e.data || '').length;
        const nextLen    = value.length - replacing + inserting;

        if (nextLen > MAX) e.preventDefault();
      });

      on(el, 'input', () => {
        if (composing.get(el)) return;
        truncate(el, getMAX());
      });
    };

    document.querySelectorAll('input[maxlength], textarea[maxlength]').forEach(attach);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes && m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches?.('input[maxlength], textarea[maxlength]')) attach(node);
          node.querySelectorAll?.('input[maxlength], textarea[maxlength]').forEach(attach);
        });
        if (m.type === 'attributes' && m.attributeName === 'maxlength' &&
            m.target instanceof Element &&
            m.target.matches('input[maxlength], textarea[maxlength]')) {
          attach(m.target);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['maxlength'] });
  }

  // --------------------------------------------------------------------
  // 10) Footer utils: year, scroll to top, terms open
  // --------------------------------------------------------------------
  function setupFooterUtils() {
    const footer = $('#siteFooter');
    if (!footer) return;

    const y = footer.querySelector('#footerYear');
    if (y) y.textContent = new Date().getFullYear();

    const toTop = footer.querySelector('#footerToTop');
    if (toTop) {
      on(toTop, 'click', (e) => {
        e.preventDefault();
        try { $('#stickyTopbar')?.scrollIntoView({ behavior: 'smooth' }); }
        catch { window.scrollTo(0, 0); }
      });
    }
  }

  // --------------------------------------------------------------------
  // 11) Legal notice clock & external helper setExtraNotice(msg)
  // --------------------------------------------------------------------
  function setupLegalNoticeClock() {
    const root = $('#legalNotice');
    if (!root) return;

    const tsEl    = root.querySelector('.ts')    || root.appendChild(document.createElement('span'));
    const extraEl = root.querySelector('.extra') || root.appendChild(document.createElement('span'));

    const initExtra = (root.getAttribute('data-extra') || '').trim();
    if (initExtra) extraEl.textContent = '  ' + initExtra;

    const fmt = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    });

    const formatKST = (now = new Date()) => {
      const map = Object.fromEntries(fmt.formatToParts(now).map(p => [p.type, p.value]));
      return ` (${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second} 기준)`;
      // e.g. (2025-10-13 11:05:07 기준)
    };

    const tick = () => { tsEl.textContent = formatKST(); };
    tick();
    const timer = setInterval(tick, 1000);
    on(window, 'beforeunload', () => clearInterval(timer));

    window.setExtraNotice = function (msg) {
      if (!msg || !msg.trim()) {
        extraEl.textContent = '';
        root.removeAttribute('data-extra');
        return;
      }
      extraEl.textContent = ' · ' + msg.trim();
      root.setAttribute('data-extra', msg.trim());
    };
  }

  // --------------------------------------------------------------------
  // 12) Bullet pulser in #legalDBHero (right ul li)
  // --------------------------------------------------------------------
  function setupHeroRightPulse() {
    const root = $('#legalDBHero');
    if (!root) return;
    const list = root.querySelector('.right ul');
    if (!list) return;
    const items = Array.from(list.querySelectorAll('li'));
    if (!items.length) return;

    let idx = 0, timer = null, playing = false;
    const STEP = 3000;

    function tick() {
      items.forEach(li => li.classList.remove('pulse'));
      items[idx].classList.add('pulse');
      idx = (idx + 1) % items.length;
    }
    function start() {
      if (playing) return; playing = true; tick();
      timer = setInterval(tick, STEP);
    }
    function stop() {
      if (!playing) return; playing = false;
      clearInterval(timer); timer = null;
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((ents) => {
        ents.forEach(e => e.isIntersecting ? start() : stop());
      }, { threshold: .15 });
      io.observe(list);
      start(); // immediate attempt
    } else {
      start();
    }
  }

  // --------------------------------------------------------------------
  // 13) Car compare section entrance & tilt effect
  // --------------------------------------------------------------------
  function setupCarCompare() {
    const root = $('#carCompare');
    if (!root) return;

    const reveals = root.querySelectorAll('.reveal');
    const listL   = root.querySelectorAll('.list-l > li');
    const listR   = root.querySelectorAll('.list-r > li');
    const policy  = root.querySelector('.box.policy');

    function setHidden() {
      reveals.forEach(el => {
        el.style.opacity = '0';
        el.style.filter  = 'blur(6px)';
        el.style.transform = 'translateY(16px) scale(.98)';
      });
      listL.forEach(li => { li.style.opacity = '0'; li.style.filter = 'blur(6px)'; li.style.transform = 'translateX(-14px)'; });
      listR.forEach(li => { li.style.opacity = '0'; li.style.filter = 'blur(6px)'; li.style.transform = 'translateX(14px)'; });
      const vs = root.querySelector('.vs');
      if (vs) { vs.style.animation = 'none'; void vs.offsetWidth; vs.style.animation = ''; }
      if (policy) { policy.style.animation = 'none'; void policy.offsetWidth; policy.style.animation = ''; }
    }

    function setVisible() {
      root.classList.add('in');
      const delayed = root.querySelectorAll('[style*="--d"]');
      delayed.forEach(el => {
        el.style.transition = `opacity var(--dur) var(--ease), transform var(--dur) var(--ease), filter calc(var(--dur) + 120ms) var(--ease)`;
      });
      raf(() => {
        reveals.forEach(el => { el.style.opacity = '1'; el.style.filter = 'none'; el.style.transform = 'none'; });
        listL.forEach(li => { li.style.opacity = '1'; li.style.filter = 'none'; li.style.transform = 'none'; });
        listR.forEach(li => { li.style.opacity = '1'; li.style.filter = 'none'; li.style.transform = 'none'; });
      });
    }

    function unsetVisible() {
      root.classList.remove('in');
      setHidden();
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { setHidden(); raf(setVisible); }
          else if (entry.intersectionRatio === 0) { unsetVisible(); }
        });
      }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });
      io.observe(root);
    } else {
      setVisible();
    }

    const fine = matchMedia('(pointer:fine)').matches;
    if (policy && fine) {
      let rx = 0, ry = 0, TX = 0, TY = 0, frameId = null;
      const max = 6, lerp = (a, b, t) => a + (b - a) * t;

      const move = (e) => {
        const r = policy.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const x = (e.clientX - cx) / (r.width / 2), y = (e.clientY - cy) / (r.height / 2);
        TX = (max * y * -1); TY = (max * x);
        if (!frameId) frameId = requestAnimationFrame(update);
      };
      const update = () => {
        rx = lerp(rx, TX, 0.12); ry = lerp(ry, TY, 0.12);
        policy.style.transform = `translateY(-2px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        frameId = (Math.abs(rx - TX) < 0.1 && Math.abs(ry - TY) < 0.1) ? null : requestAnimationFrame(update);
      };
      const leave = () => { TX = 0; TY = 0; if (!frameId) frameId = requestAnimationFrame(update); };
      on(policy, 'mousemove', move);
      on(policy, 'mouseleave', leave);
    }

    on(document, 'visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const rect = root.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
        if (inView) { unsetVisible(); raf(setVisible); }
      }
    });

    setHidden();
  }

  // --------------------------------------------------------------------
  // 14) Count-up in #late-response with re-trigger
  // --------------------------------------------------------------------
  function setupLateResponseCounters() {
    const SCOPE = $('#late-response');
    if (!SCOPE) return;
    const counters = SCOPE.querySelectorAll('.count');
    if (!counters.length) return;

    function animateCount(el) {
      const target   = +el.dataset.target || 0;
      const duration = +el.dataset.duration || 1800;
      const start    = performance.now();
      el.dataset.playing = '1';

      function frame(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = p < .5 ? 2 * p * p : -1 + (4 - 2 * p) * p; // easeInOutQuad
        const val = Math.round(eased * target);
        el.textContent = val.toLocaleString();
        if (p < 1 && el.dataset.playing === '1') requestAnimationFrame(frame);
        else el.dataset.playing = '0';
      }
      requestAnimationFrame(frame);
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      counters.forEach(el => el.textContent = (+el.dataset.target || 0).toLocaleString());
      return;
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(el => animateCount(el));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.dataset.playing = '0';
          el.textContent = '0';
          animateCount(el);
        } else {
          el.dataset.playing = '0';
          el.textContent = '0';
        }
      });
    }, { threshold: .6 });

    counters.forEach(el => io.observe(el));
  }

  // --------------------------------------------------------------------
  // 15) hbReasons vertical slider & centered card highlighting
  // --------------------------------------------------------------------
  function setupHbReasonsSlider() {
    const root  = $('#hbReasons');
    if (!root) return;
    const rail  = root.querySelector('.rail');
    const frame = root.querySelector('.frame');
    if (!rail || !frame) return;

    const getCards = () => Array.from(rail.querySelectorAll('.card'));
    const getStep  = () => (qsNum('--cardH', root) + qsNum('--gap', root)) || 0;
    const INTERVAL = 2000;
    let timer = null, animRAF = null, locked = false;

    function updateCenterByPoint() {
      const rect = frame.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      const midY = rect.top + rect.height / 2;
      const el   = document.elementFromPoint(midX, midY);
      const centerCard = el && el.closest ? el.closest('.card') : null;
      getCards().forEach(c => c.classList.toggle('is-center', c === centerCard));
    }
    function startCenterTracker() {
      if (animRAF) return;
      const tick = () => { updateCenterByPoint(); animRAF = requestAnimationFrame(tick); };
      animRAF = requestAnimationFrame(tick);
    }

    function stepUp() {
      if (locked) return; locked = true;
      const CARD_STEP = getStep();
      rail.style.transition = `transform var(--t) var(--e)`;
      const m = new DOMMatrixReadOnly(getComputedStyle(rail).transform);
      const currentY = m.m42 || 0;
      rail.style.transform = `translateY(${currentY - CARD_STEP}px)`;
      const onEnd = () => {
        rail.removeEventListener('transitionend', onEnd);
        const first = getCards()[0];
        if (first) rail.appendChild(first);
        rail.style.transition = 'none';
        rail.style.transform = `translateY(${currentY}px)`;
        locked = false;
        raf(updateCenterByPoint);
      };
      rail.addEventListener('transitionend', onEnd, { once: true });
    }

    function start() { if (!timer) timer = setInterval(stepUp, INTERVAL); startCenterTracker(); }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }

    updateCenterByPoint(); start();
    on(document, 'visibilitychange', () => { document.hidden ? stop() : start(); });
    on(frame, 'mouseenter', stop);
    on(frame, 'mouseleave', start);
    on(frame, 'focusin',   stop);
    on(frame, 'focusout',  start);
    on(window, 'resize', () => raf(updateCenterByPoint));
    on(window, 'load',   () => raf(updateCenterByPoint));
  }

  // --------------------------------------------------------------------
  // 16) nb3 ring animation + synced KPI counting
  // --------------------------------------------------------------------
  function setupNb3RingsAndCounting() {
    const root = $('#nb3');
    if (!root) return;

    const EASE     = (t) => 1 - Math.pow(1 - t, 3);
    const DURATION = 900;

    const fmtComma = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    function parseCurrencyParts(text) {
      const mAll = [...text.matchAll(/(\d[\d,]*)/g)];
      if (!mAll.length) return null;
      const m = mAll[mAll.length - 1];
      const start = m.index;
      const len   = m[0].length;
      const num   = parseInt(m[0].replace(/,/g, ''), 10) || 0;
      return { prefix: text.slice(0, start), suffix: text.slice(start + len), number: num };
    }
    function parseLastNumberParts(text) {
      const mAll = [...text.matchAll(/(\d[\d,]*)/g)];
      if (!mAll.length) return null;
      const m = mAll[mAll.length - 1];
      const start = m.index;
      const len   = m[0].length;
      const num   = parseInt(m[0].replace(/,/g, ''), 10) || 0;
      return { head: text.slice(0, start), tail: text.slice(start + len), number: num };
    }
    function findKpiValueEl(cardEl, labelText) {
      const boxes = cardEl.querySelectorAll('.kpi-box');
      for (const box of boxes) {
        const lbl = box.querySelector('.kpi-label');
        const val = box.querySelector('.kpi-value');
        if (lbl && val && lbl.textContent.trim() === labelText) return val;
      }
      return null;
    }
    function driveCountingForCard(cardEl, progress) {
      const amtEl = findKpiValueEl(cardEl, '승인금액');
      if (amtEl) {
        if (!amtEl.dataset.orig) amtEl.dataset.orig = amtEl.textContent.trim();
        if (!amtEl._parts) amtEl._parts = parseCurrencyParts(amtEl.dataset.orig);
        const p = amtEl._parts;
        if (p) {
          const cur = Math.round(p.number * progress);
          amtEl.textContent = p.prefix + fmtComma(cur) + p.suffix;
        }
      }
      const cntEl = findKpiValueEl(cardEl, '총 정책자금 횟수');
      if (cntEl) {
        if (!cntEl.dataset.orig) cntEl.dataset.orig = cntEl.textContent.trim();
        if (!cntEl._parts) cntEl._parts = parseLastNumberParts(cntEl.dataset.orig);
        const p2 = cntEl._parts;
        if (p2) {
          const cur2 = Math.round(p2.number * progress);
          cntEl.textContent = p2.head + cur2.toString() + p2.tail;
        }
      }
    }
    function resetCountingForCard(cardEl) {
      const amtEl = findKpiValueEl(cardEl, '승인금액');
      if (amtEl && amtEl.dataset.orig) amtEl.textContent = amtEl.dataset.orig;
      const cntEl = findKpiValueEl(cardEl, '총 정책자금 횟수');
      if (cntEl && cntEl.dataset.orig) cntEl.textContent = cntEl.dataset.orig;
    }

    function animateRing(el) {
      const target = Math.max(0, Math.min(100, Number(el.getAttribute('data-rate') || 0)));
      let start = null;
      el.style.setProperty('--p', 0);
      const card = el.closest('.case-card');

      function step(ts) {
        if (!start) start = ts;
        const t = Math.min(1, (ts - start) / DURATION);
        const eased = EASE(t);
        const cur = Math.round(target * eased);
        el.style.setProperty('--p', cur);
        if (card) driveCountingForCard(card, eased);
        if (t < 1) el._raf = requestAnimationFrame(step);
        else el._raf = null;
      }
      if (el._raf) cancelAnimationFrame(el._raf);
      el._raf = requestAnimationFrame(step);
    }
    function resetRing(el) {
      if (el._raf) cancelAnimationFrame(el._raf);
      el._raf = null;
      el.style.setProperty('--p', 0);
      const card = el.closest('.case-card');
      if (card) resetCountingForCard(card);
    }

    const rings = Array.from(root.querySelectorAll('.rate-ring[data-rate]'));
    if (!rings.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        entry.isIntersecting ? animateRing(el) : resetRing(el);
      });
    }, { threshold: 0.35 });
    rings.forEach(el => io.observe(el));
  }

  // --------------------------------------------------------------------
  // 17) nb3 carousel slider (drag/swipe/momentum/auto)
  // --------------------------------------------------------------------
  function setupNb3Slider() {
    const root = $('#nb3');
    if (!root) return;

    const slider = root.querySelector('#nb3Slider');
    if (!slider) return;
    const track  = slider.querySelector('.nb3-slider-wrapper');
    const prevBtn = root.querySelector('#nb3Prev');
    const nextBtn = root.querySelector('#nb3Next');
    if (!track) return;

    let currentIndex = 0, maxIndex = 0, cardWidth = 0, gap = 0;

    function updateDimensions() {
      const cards = slider.querySelectorAll('.nb3-product-slide');
      const containerWidth = slider.clientWidth;
      if (cards.length > 0) {
        const first = cards[0];
        cardWidth = first.getBoundingClientRect().width || 0;
        gap = parseFloat(getComputedStyle(track).gap) || 24;
        const visible = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
        maxIndex = Math.max(0, cards.length - visible);
      } else {
        maxIndex = 0;
        cardWidth = 0;
        gap = parseFloat(getComputedStyle(track).gap) || 24;
      }
    }

    function setTransform(index, animate = true) {
      const tx = -index * (cardWidth + gap);
      if (animate) {
        slider.classList.add('animating');
        track.style.transition = 'transform .6s cubic-bezier(0.25,0.46,0.45,0.94)';
        track.style.transform  = `translateX(${tx}px)`;
        setTimeout(() => {
          slider.classList.remove('animating');
          track.style.transition = 'transform .1s ease';
        }, 600);
      } else {
        track.style.transition = 'transform .1s ease';
        track.style.transform  = `translateX(${tx}px)`;
      }
      currentIndex = Math.max(0, Math.min(index, maxIndex));
    }

    const moveTo = (index) => setTransform(Math.max(0, Math.min(index, maxIndex)), true);

    on(prevBtn, 'click', () => { pauseAuto(); moveTo(currentIndex - 1); resumeAutoLater(); });
    on(nextBtn, 'click', () => { pauseAuto(); moveTo(currentIndex + 1); resumeAutoLater(); });

    // Drag/swipe
    let isDragging = false, started = false;
    let startX = 0, startTX = 0, curTX = 0, lastX = 0, lastT = 0, v = 0, req = null;
    const TH = 8, FRICTION = 0.95, MIN_V = 0.8;

    const getTX = () => {
      const m = track.style.transform.match(/translateX\((-?\d+(?:\.\d+)?)px\)/);
      return m ? parseFloat(m[1]) : 0;
    };

    function onStart(e) {
      if (e.type === 'mousedown' && e.button !== 0) return;
      isDragging = true; started = false;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      startTX = getTX(); curTX = startTX;
      lastX = startX; lastT = performance.now(); v = 0;
      slider.classList.add('dragging');
      if (req) { cancelAnimationFrame(req); req = null; }
      pauseAuto();
      e.preventDefault();
    }
    function onMove(e) {
      if (!isDragging) return;
      const now = performance.now();
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const dx = x - lastX;
      const dt = Math.max(1, now - lastT);

      if (!started && Math.abs(x - startX) > TH) started = true;

      if (started) {
        let next = startTX + (x - startX);
        const minT = -(maxIndex * (cardWidth + gap));
        const maxT = 0;
        if (next > maxT) next = maxT + (next - maxT) * 0.3;
        else if (next < minT) next = minT + (next - minT) * 0.3;

        curTX = next;
        track.style.transform = `translateX(${next}px)`;

        const iv = dx / dt;
        v = v * 0.8 + iv * 0.2;
      }

      lastX = x; lastT = now;
      e.preventDefault();
    }
    const snap = () => {
      const step = cardWidth + gap;
      const idx  = step ? Math.round(-curTX / step) : 0;
      const clamp = Math.max(0, Math.min(idx, maxIndex));
      currentIndex = clamp;
      setTransform(clamp, true);
    };
    function momentum() {
      if (req) return;
      const frame = () => {
        if (Math.abs(v) < MIN_V) { snap(); req = null; return; }
        curTX += v * 16;
        const minT = -(maxIndex * (cardWidth + gap));
        const maxT = 0;
        if (curTX > maxT || curTX < minT) {
          v *= -0.3;
          curTX = Math.max(minT, Math.min(maxT, curTX));
        }
        track.style.transform = `translateX(${curTX}px)`;
        v *= FRICTION;
        req = requestAnimationFrame(frame);
      };
      frame();
    }
    function onEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      slider.classList.remove('dragging');
      if (started) {
        if (Math.abs(v) > MIN_V) momentum();
        else snap();
        resumeAutoLater();
      } else {
        resumeAutoLater();
      }
      e.preventDefault();
    }

    on(slider, document.ontouchstart !== undefined ? 'touchstart' : 'mousedown', onStart, { passive: false });
    on(document, document.ontouchmove  !== undefined ? 'touchmove'  : 'mousemove', onMove,  { passive: false });
    on(document, document.ontouchend   !== undefined ? 'touchend'   : 'mouseup',   onEnd,   { passive: false });
    on(slider, 'dragstart', (e) => e.preventDefault());
    on(slider, 'click', (e) => { if (started) { e.preventDefault(); e.stopPropagation(); started = false; } }, true);

    // Auto slide
    const INTERVAL = 4200;
    let auto = null, resume = null;
    const step = () => moveTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    const startAuto = () => { stopAuto(); auto = setInterval(step, INTERVAL); };
    const stopAuto  = () => { if (auto) { clearInterval(auto); auto = null; } };
    const pauseAuto = () => { stopAuto(); if (resume) { clearTimeout(resume); resume = null; } };
    const resumeAutoLater = (delay = 6200) => { if (resume) clearTimeout(resume); resume = setTimeout(startAuto, delay); };

    function init() { updateDimensions(); setTransform(0, false); startAuto(); }
    let rTimer = null;
    on(window, 'resize', () => {
      pauseAuto(); clearTimeout(rTimer);
      rTimer = setTimeout(() => {
        updateDimensions();
        setTransform(Math.min(currentIndex, maxIndex), false);
        resumeAutoLater();
      }, 200);
    });
    on(document, 'visibilitychange', () => {
      document.hidden ? pauseAuto() : resumeAutoLater(1800);
    });
    init();
  }

  // --------------------------------------------------------------------
  // Boot
  // --------------------------------------------------------------------
  function boot() {
    setupSmoothAnchors();
    setupStickyTopbar();
    setupLegalDbHeroTicker();
    setupWhoCanPartnerReveal();
    setupEventRotators();
    setupTermsModal();
    setupSelectWrap();         // (terms 이전/이후 어느 때 호출되어도 안전)
    setupKakaoFloatingPulse();
    setupMaxlengthGuard();
    setupFooterUtils();
    setupLegalNoticeClock();
    setupHeroRightPulse();
    setupCarCompare();
    setupLateResponseCounters();
    setupHbReasonsSlider();
    setupNb3RingsAndCounting();
    setupNb3Slider();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();


/* ======================================================================
   main.js
   - nb4(있으면 nb3도) 섹션의 원형 게이지/카운팅 + 슬라이더 제어
   - 세로 스크롤 허용(축 잠금) + 스냅백 방지(데드존/커밋 임계치/히스테리시스)
   ====================================================================== */

(function () {
  // 이미 초기화된 루트를 중복 초기화하지 않도록
  const inited = new WeakSet();

  /** 숫자 포맷 */
  const fmtComma = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  /** 텍스트에서 마지막 금액 숫자만 추출 (₩1,234,567 처럼 접두/접미 유지) */
  function parseCurrencyParts(text) {
    const mAll = [...text.matchAll(/(\d[\d,]*)/g)];
    if (!mAll.length) return null;
    const m = mAll[mAll.length - 1];
    const start = m.index, len = m[0].length;
    const num = parseInt(m[0].replace(/,/g, ''), 10) || 0;
    return { prefix: text.slice(0, start), suffix: text.slice(start + len), number: num };
  }
  /** 텍스트에서 마지막 숫자만 추출 (문장 끝 숫자 카운팅용) */
  function parseLastNumberParts(text) {
    const mAll = [...text.matchAll(/(\d[\d,]*)/g)];
    if (!mAll.length) return null;
    const m = mAll[mAll.length - 1];
    const start = m.index, len = m[0].length;
    const num = parseInt(m[0].replace(/,/g, ''), 10) || 0;
    return { head: text.slice(0, start), tail: text.slice(start + len), number: num };
  }
  /** 카드 내 특정 KPI 라벨의 값 엘리먼트 찾기 */
  function findKpiValueEl(cardEl, labelText, prefix) {
    const boxes = cardEl.querySelectorAll(`.${prefix}-kpi-box, .kpi-box`); // fallback
    for (const box of boxes) {
      const lbl = box.querySelector(`.${prefix}-kpi-label, .kpi-label`);
      const val = box.querySelector(`.${prefix}-kpi-value, .kpi-value`);
      if (lbl && val && lbl.textContent.trim() === labelText) return val;
    }
    return null;
  }
  /** 카드 내 카운팅 구동 */
  function driveCountingForCard(cardEl, progress, prefix) {
    const amtEl = findKpiValueEl(cardEl, '승인금액', prefix);
    if (amtEl) {
      if (!amtEl.dataset.orig) amtEl.dataset.orig = amtEl.textContent.trim();
      if (!amtEl._parts) amtEl._parts = parseCurrencyParts(amtEl.dataset.orig);
      const p = amtEl._parts;
      if (p) amtEl.textContent = p.prefix + fmtComma(Math.round(p.number * progress)) + p.suffix;
    }
    const cntEl = findKpiValueEl(cardEl, '총 정책자금 횟수', prefix);
    if (cntEl) {
      if (!cntEl.dataset.orig) cntEl.dataset.orig = cntEl.textContent.trim();
      if (!cntEl._parts) cntEl._parts = parseLastNumberParts(cntEl.dataset.orig);
      const p2 = cntEl._parts;
      if (p2) cntEl.textContent = p2.head + Math.round(p2.number * progress) + p2.tail;
    }
  }
  /** 카드 카운팅 리셋 */
  function resetCountingForCard(cardEl, prefix) {
    const amtEl = findKpiValueEl(cardEl, '승인금액', prefix);
    if (amtEl && amtEl.dataset.orig) amtEl.textContent = amtEl.dataset.orig;
    const cntEl = findKpiValueEl(cardEl, '총 정책자금 횟수', prefix);
    if (cntEl && cntEl.dataset.orig) cntEl.textContent = cntEl.dataset.orig;
  }

  /** -------------------- 원형 게이지 & KPI 카운팅 -------------------- */
  function initKpiAndRings(root, opts) {
    if (!root || inited.has(root)) return;
    const EASE = (t) => 1 - Math.pow(1 - t, 3);
    const DURATION = 900;
    const { ringSelector, prefix } = opts;

    const rings = Array.from(root.querySelectorAll(ringSelector));
    if (!rings.length) return;

    function animateRing(el) {
      const target = Math.max(0, Math.min(100, Number(el.getAttribute('data-rate') || 0)));
      let start = null;
      el.style.setProperty('--p', 0);
      const card = el.closest(`.${prefix}-case-card, .case-card`);
      function step(ts) {
        if (!start) start = ts;
        const t = Math.min(1, (ts - start) / DURATION);
        const eased = EASE(t);
        el.style.setProperty('--p', Math.round(target * eased));
        if (card) driveCountingForCard(card, eased, prefix);
        if (t < 1) el._raf = requestAnimationFrame(step);
        else el._raf = null;
      }
      if (el._raf) cancelAnimationFrame(el._raf);
      el._raf = requestAnimationFrame(step);
    }
    function resetRing(el) {
      if (el._raf) cancelAnimationFrame(el._raf);
      el._raf = null;
      el.style.setProperty('--p', 0);
      const card = el.closest(`.${prefix}-case-card, .case-card`);
      if (card) resetCountingForCard(card, prefix);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) animateRing(el);
        else resetRing(el);
      });
    }, { threshold: 0.35 });

    rings.forEach((el) => io.observe(el));
  }

  /** -------------------- 슬라이더 제어(축 잠금 + 스냅백 방지) -------------------- */
  function initSlider(root, opts) {
    if (!root) return;

    const {
      sliderSelector,
      trackSelector,
      cardSelector,
      prevSelector,
      nextSelector,
    } = opts;

    const slider = root.querySelector(sliderSelector);
    const track  = slider && slider.querySelector(trackSelector);
    const prevBtn = root.querySelector(prevSelector);
    const nextBtn = root.querySelector(nextSelector);

    if (!slider || !track) return;

    let currentIndex = 0;
    let maxIndex = 0;
    let cardWidth = 0;
    let gap = 0;

    function updateDimensions() {
      const cards = slider.querySelectorAll(cardSelector);
      const containerWidth = slider.clientWidth;
      if (cards.length > 0) {
        const first = cards[0];
        cardWidth = first.getBoundingClientRect().width;
        gap = parseFloat(getComputedStyle(track).gap) || 24; // 1.5rem
        const visible = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
        maxIndex = Math.max(0, cards.length - visible);
      }
    }

    function setTransform(index, animate = true) {
      const tx = -index * (cardWidth + gap);
      if (animate) {
        slider.classList.add('animating');
        track.style.transition = 'transform .6s cubic-bezier(0.25,0.46,0.45,0.94)';
        track.style.transform = `translateX(${tx}px)`;
        setTimeout(() => {
          slider.classList.remove('animating');
          track.style.transition = 'transform .1s ease';
        }, 600);
      } else {
        track.style.transition = 'transform .1s ease';
        track.style.transform = `translateX(${tx}px)`;
      }
      currentIndex = Math.max(0, Math.min(index, maxIndex));
    }
    function moveTo(index) { setTransform(Math.max(0, Math.min(index, maxIndex)), true); }

    if (prevBtn) prevBtn.addEventListener('click', () => { pauseAuto(); moveTo(currentIndex - 1); resumeAutoLater(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { pauseAuto(); moveTo(currentIndex + 1); resumeAutoLater(); });

    // 드래그/스와이프 (세로 스크롤 허용 + 스냅백 방지)
    let isDragging = false, started = false;
    let startX = 0, startY = 0, startTX = 0, curTX = 0, lastX = 0, lastT = 0, v = 0, raf = null;
    let lock = 'undecided'; // 'x' | 'y' | 'undecided'

    const START_LOCK_X = 12;   // X축 잠금 시작 임계치(px)
    const START_LOCK_BIAS = 6; // 히스테리시스
    const DEADZONE = 18;       // 데드존
    const COMMIT_RATIO = 0.25; // 카드폭 대비 커밋 비율
    const COMMIT_MIN = 60;     // 커밋 최소 px
    const FRICTION = 0.95, MIN_V = 0.8;

    function getTX() {
      const m = track.style.transform.match(/translateX\((-?\d+(?:\.\d+)?)px\)/);
      return m ? parseFloat(m[1]) : 0;
    }

    function onStart(e) {
      if (e.type === 'mousedown' && e.button !== 0) return;
      isDragging = true; started = false; lock = 'undecided';
      const p = e.touches ? e.touches[0] : e;
      startX = lastX = p.clientX;
      startY = p.clientY;
      startTX = getTX(); curTX = startTX;
      lastT = performance.now(); v = 0;
      slider.classList.add('dragging');
      // 세로 스크롤 살리기 위해 여기서는 preventDefault() 불가
    }

    function onMove(e) {
      if (!isDragging) return;
      const now = performance.now();
      const p = e.touches ? e.touches[0] : e;
      const totalDX = p.clientX - startX;
      const totalDY = p.clientY - startY;

      if (lock === 'undecided') {
        const absX = Math.abs(totalDX), absY = Math.abs(totalDY);
        if (absX > START_LOCK_X && absX > absY + START_LOCK_BIAS) {
          lock = 'x'; started = true;
        } else if (absY > START_LOCK_X && absY > absX + START_LOCK_BIAS) {
          lock = 'y';
          isDragging = false;
          slider.classList.remove('dragging');
          return;
        } else {
          // 잠금 전에는 화면 이동 없음 → 미세 흔들림 무시
          lastX = p.clientX; lastT = now;
          return;
        }
      }

      if (lock === 'x') {
        e.preventDefault(); // 가로 드래그일 때만 기본 동작 보류

        let dx = totalDX;
        if (Math.abs(dx) < DEADZONE) {
          dx = Math.sign(dx) * Math.pow(Math.abs(dx) / DEADZONE, 2) * DEADZONE * 0.35;
        }

        let next = startTX + dx;
        const minT = -(maxIndex * (cardWidth + gap));
        const maxT = 0;
        if (next > maxT) next = maxT + (next - maxT) * 0.3;
        else if (next < minT) next = minT + (next - minT) * 0.3;

        curTX = next;
        track.style.transform = `translateX(${next}px)`;

        const dt = Math.max(1, now - lastT);
        const iv = (p.clientX - lastX) / dt;
        v = v * 0.8 + iv * 0.2;

        lastX = p.clientX; lastT = now;
      }
    }

    function snapOrCommit() {
      const moved = curTX - startTX;
      const absMoved = Math.abs(moved);
      const commitThreshold = Math.max(COMMIT_MIN, cardWidth * COMMIT_RATIO);
      const velocityCommit = Math.abs(v) > MIN_V;

      let idx = currentIndex;
      if (absMoved > commitThreshold || velocityCommit) {
        if (moved < 0) idx = Math.min(currentIndex + 1, maxIndex);
        else if (moved > 0) idx = Math.max(currentIndex - 1, 0);
        setTransform(idx, true);
      } else {
        setTransform(currentIndex, true);
      }
    }

    function momentum() {
      if (raf) return;
      function frame() {
        if (Math.abs(v) < MIN_V) { raf = null; snapOrCommit(); return; }
        curTX += v * 16; // ~60fps
        const minT = -(maxIndex * (cardWidth + gap));
        const maxT = 0;
        if (curTX > maxT || curTX < minT) {
          v *= -0.3;
          curTX = Math.max(minT, Math.min(maxT, curTX));
        }
        track.style.transform = `translateX(${curTX}px)`;
        v *= FRICTION;
        raf = requestAnimationFrame(frame);
      }
      frame();
    }

    function onEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      slider.classList.remove('dragging');

      if (lock === 'x' && started) {
        if (Math.abs(v) > MIN_V) momentum();
        else snapOrCommit();
        resumeAutoLater();
        if (e) e.preventDefault();
      } else {
        resumeAutoLater();
      }
    }

    slider.addEventListener('mousedown', onStart, { passive: false });
    document.addEventListener('mousemove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd, { passive: false });

    slider.addEventListener('touchstart', onStart, { passive: false });
    slider.addEventListener('touchmove', onMove, { passive: false });
    slider.addEventListener('touchend', onEnd, { passive: false });
    slider.addEventListener('touchcancel', onEnd, { passive: false });

    slider.addEventListener('click', (e) => {
      if (lock === 'x' && started) { e.preventDefault(); e.stopPropagation(); started = false; }
    }, true);

    slider.addEventListener('dragstart', (e) => e.preventDefault());

    // 자동 롤링
    const INTERVAL = 4200;
    let auto = null, resume = null;

    function step() {
      const next = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      moveTo(next);
    }
    function startAuto() { stopAuto(); auto = setInterval(step, INTERVAL); }
    function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
    function pauseAuto() { stopAuto(); if (resume) { clearTimeout(resume); resume = null; } }
    function resumeAutoLater(delay = 6200) { if (resume) clearTimeout(resume); resume = setTimeout(() => startAuto(), delay); }

    // 초기화 & 리사이즈
    function init() { updateDimensions(); setTransform(0, false); startAuto(); }
    let rTimer = null;
    window.addEventListener('resize', () => {
      pauseAuto(); clearTimeout(rTimer);
      rTimer = setTimeout(() => {
        updateDimensions();
        setTransform(Math.min(currentIndex, maxIndex), false);
        resumeAutoLater();
      }, 200);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseAuto(); else resumeAutoLater(1800);
    });

    init();
  }

  /** -------------------- 부트스트랩: nb4 우선, nb3도 지원 -------------------- */
  function bootstrap(id, cfg) {
    const root = document.getElementById(id);
    if (!root) return;
    if (inited.has(root)) return;

    // 게이지/KPI
    initKpiAndRings(root, {
      ringSelector: '.rate-ring[data-rate]',
      prefix: cfg.prefix // 'nb4' 또는 'nb3'
    });

    // 슬라이더
    initSlider(root, {
      sliderSelector: cfg.sliderSelector,       // '#nb4Slider'
      trackSelector: cfg.trackSelector,         // '.nb4-slider-wrapper'
      cardSelector: cfg.cardSelector,           // '.nb4-product-slide'
      prevSelector: cfg.prevSelector,           // '#nb4Prev'
      nextSelector: cfg.nextSelector            // '#nb4Next'
    });

    inited.add(root);
  }

  // DOM 준비 후 실행
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(() => {
    // nb4 (요청 섹션) 먼저 초기화
    bootstrap('nb4', {
      prefix: 'nb4',
      sliderSelector: '#nb4Slider',
      trackSelector: '.nb4-slider-wrapper',
      cardSelector: '.nb4-product-slide',
      prevSelector: '#nb4Prev',
      nextSelector: '#nb4Next'
    });

    // 동일 로직이 필요한 경우 nb3도 자동 적용 (존재할 때만)
    bootstrap('nb3', {
      prefix: 'nb3',
      sliderSelector: '#nb3Slider',
      trackSelector: '.nb3-slider-wrapper',
      cardSelector: '.nb3-product-slide',
      prevSelector: '#nb3Prev',
      nextSelector: '#nb3Next'
    });
  });
})();


