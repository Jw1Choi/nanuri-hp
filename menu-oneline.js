// ./js/menu.js
(function () {
  // ✅ 메인 메뉴 4개
  const MAIN_LINKS = [
    { label: '회사소개', href: '../about.html', anchor: 'company' },
    { label: '대표 인사말', href: '../ceo.html', anchor: 'greeting' },
    { label: '비전&철학', href: '../vision.html', anchor: 'vision' },
    { label: '오시는 길', href: '../location.html', anchor: 'location' },
  ];

  // 1) 헤더 전체 HTML 템플릿 (#nanuriHeaderLocal + 스타일 + 구조)
  const HEADER_TEMPLATE = `
<section id="nanuriHeaderLocal" aria-label="NBBIO Global Navigation">
  <style>
    /* ============== Scope: #nanuriHeaderLocal only ============== */
    #nanuriHeaderLocal{
      --ink:#0b1220; --muted:#3b3f45; --brand:#0a6a62;
      --line:#e8ecef; --bg:#f6f7f8; --white:#fff; --overlay:rgba(0,0,0,.55);
      --z:20000; --shadow:0 12px 30px rgba(16,24,40,.12);
      font-family:Pretendard,"Noto Sans KR",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
      position:relative;
      z-index:100;
    }

    /* Header bar */
    #nanuriHeaderLocal .bar{
      position:fixed;top:0;left:0;right:0;
      z-index:var(--z);
      background:var(--white);
      border-bottom:1px solid var(--line);
      transition:transform .3s ease, background-color .26s ease, border-color .26s ease;
    }
    #nanuriHeaderLocal.scroll-down .bar{transform:translateY(-100%);}
    #nanuriHeaderLocal.scroll-up .bar{transform:translateY(0);}

    #nanuriHeaderLocal.at-top .bar{background:transparent;border-color:transparent;}
    #nanuriHeaderLocal.at-top .bar:hover{ background:var(--white); border-color:var(--line); }
    #nanuriHeaderLocal.at-top .bar:hover .gnb>li>a{ color:var(--ink); }

    /* ✅ PC Hover 시 글자색 녹색 */
    #nanuriHeaderLocal .gnb>li>a{
      display:block;padding:10px 6px;font-weight:700;color:var(--ink);
      letter-spacing:-.2px;text-decoration:none;transition:color .26s ease;
    }
    #nanuriHeaderLocal .gnb>li:hover>a,
    #nanuriHeaderLocal .gnb>li:focus-within>a,
    #nanuriHeaderLocal .gnb>li.is-on>a{color:var(--brand);}

    /* 최상단 투명 모드에서 링크/아이콘을 흰색으로 */
    #nanuriHeaderLocal.at-top .gnb>li>a{color:#fff;}
    /* ✅ 최상단에서는 hover해도 흰색 유지 */
    #nanuriHeaderLocal.at-top .gnb>li:hover>a,
    #nanuriHeaderLocal.at-top .gnb>li:focus-within>a,
    #nanuriHeaderLocal.at-top .gnb>li.is-on>a{color:#fff;}

    #nanuriHeaderLocal.at-top.hovering .bar{
      background:var(--white);
      border-color:var(--line);
    }
    #nanuriHeaderLocal.at-top.hovering .gnb>li>a{color:var(--ink);}
    #nanuriHeaderLocal.at-top.hovering .gnb>li:hover>a,
    #nanuriHeaderLocal.at-top.hovering .gnb>li:focus-within>a,
    #nanuriHeaderLocal.at-top.hovering .gnb>li.is-on>a{color:var(--brand);}

    #nanuriHeaderLocal .wrap{
      max-width:1820px;margin:0 auto;padding:16px 20px;
      display:flex;align-items:center;justify-content:space-between;gap:14px;
    }
    #nanuriHeaderLocal .logo img{display:block;height:36px;width:auto;}

    /* GNB */
    #nanuriHeaderLocal nav{display:flex;gap:24px;flex-direction: column;}
    #nanuriHeaderLocal .gnb{display:flex;gap:76px;margin:0;padding:0;}
    #nanuriHeaderLocal .gnb>li{list-style:none;position:relative;}

    /* ✅ 기존 2뎁스/호버 패널 숨김 (has-sub 제외) */
    #nanuriHeaderLocal .dep2{display:none!important;}
    #nanuriHeaderLocal .megalite{display:none!important;}
    #nanuriHeaderLocal .down{display:none!important;}

    /* ===================== PC 서브메뉴 드롭다운 ===================== */
    #nanuriHeaderLocal .gnb>li .sub-menu{
      position:absolute;
      top:100%;
      left:50%;
      transform:translateX(-50%);
      min-width:200px;
      background:var(--white);
      border:1px solid var(--line);
      border-radius:12px;
      box-shadow:0 8px 24px rgba(16,24,40,.10);
      padding:8px 0;
      opacity:0;
      visibility:hidden;
      transition:opacity .22s ease, visibility .22s ease, transform .22s ease;
      transform:translateX(-50%) translateY(6px);
      z-index:10;
      pointer-events:none;
    }
    #nanuriHeaderLocal .gnb>li:hover .sub-menu,
    #nanuriHeaderLocal .gnb>li:focus-within .sub-menu{
      opacity:1;
      visibility:visible;
      transform:translateX(-50%) translateY(0);
      pointer-events:auto;
    }
    #nanuriHeaderLocal .gnb>li .sub-menu a{
      display:block;
      padding:10px 20px;
      font-size:14px;
      font-weight:600;
      color:var(--ink);
      text-decoration:none;
      white-space:nowrap;
      transition:background .18s ease, color .18s ease;
    }
    #nanuriHeaderLocal .gnb>li .sub-menu a:hover{
      background:#f0faf8;
      color:var(--brand);
    }

    /* ✅ at-top 상태에서 서브메뉴는 항상 흰 배경/어두운 글자 */
    #nanuriHeaderLocal.at-top .gnb>li .sub-menu{
      background:var(--white);
    }
    #nanuriHeaderLocal.at-top .gnb>li .sub-menu a{
      color:var(--ink);
    }
    #nanuriHeaderLocal.at-top .gnb>li .sub-menu a:hover{
      background:#f0faf8;
      color:var(--brand);
    }

    /* 서브메뉴가 있는 메뉴 화살표 표시 (PC) */
    #nanuriHeaderLocal .gnb>li.has-sub>a::after{
      content:'';
      display:inline-block;
      width:0;height:0;
      margin-left:5px;
      vertical-align:middle;
      border-left:4px solid transparent;
      border-right:4px solid transparent;
      border-top:5px solid currentColor;
      transition:transform .22s ease;
    }
    #nanuriHeaderLocal .gnb>li.has-sub:hover>a::after{
      transform:rotate(180deg);
    }

    /* Right actions */
    #nanuriHeaderLocal .actions{display:flex;align-items:center;gap:12px;}
    #nanuriHeaderLocal .globeBtn{
      width:36px;height:36px;border:1px solid var(--line);border-radius:10px;
      background:var(--white);display:grid;place-items:center;cursor:pointer;
      transition:background-color .26s ease, border-color .26s ease;
      display:none;
    }
    #nanuriHeaderLocal .menuBtn{
      width:42px;height:36px;border:1px solid var(--line);border-radius:10px;
      background:var(--white);cursor:pointer;position:relative;
      transition:background-color .26s ease, border-color .26s ease;
    }
    #nanuriHeaderLocal .menuBtn i,#nanuriHeaderLocal .menuBtn i::before,#nanuriHeaderLocal .menuBtn i::after{
      content:"";position:absolute;left:8px;right:8px;height:2px;background:#111;transition:.24s ease;
    }
    #nanuriHeaderLocal .menuBtn i{top:50%;transform:translateY(-50%);}
    #nanuriHeaderLocal .menuBtn i::before{top:-8px;}
    #nanuriHeaderLocal .menuBtn i::after{top:8px;}
    #nanuriHeaderLocal .menuBtn[aria-expanded="true"] i{background:transparent;}
    #nanuriHeaderLocal .menuBtn[aria-expanded="true"] i::before{top:0;transform:rotate(45deg);}
    #nanuriHeaderLocal .menuBtn[aria-expanded="true"] i::after{top:0;transform:rotate(-45deg);}

    #nanuriHeaderLocal.at-top .globeBtn{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.4);}
    #nanuriHeaderLocal.at-top .menuBtn{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.4);}
    #nanuriHeaderLocal.at-top .menuBtn i,#nanuriHeaderLocal.at-top .menuBtn i::before,#nanuriHeaderLocal.at-top .menuBtn i::after{background:#fff;}
    #nanuriHeaderLocal.at-top .globeBtn svg circle,#nanuriHeaderLocal.at-top .globeBtn svg path{stroke:#fff;}

    #nanuriHeaderLocal.at-top.hovering .menuBtn{ background:var(--white); border-color:var(--line); }
    #nanuriHeaderLocal.at-top.hovering .menuBtn i,
    #nanuriHeaderLocal.at-top.hovering .menuBtn i::before,
    #nanuriHeaderLocal.at-top.hovering .menuBtn i::after{ background:#111; }

    /* ===================== MEGA MENU (PC, 풀스크린) ===================== */
    #nanuriHeaderLocal .mega{position:fixed;inset:0;display:block;z-index:var(--z);pointer-events:none;visibility:hidden;}
    #nanuriHeaderLocal .mega .scrim{position:absolute;inset:0;background:var(--overlay);opacity:0;transition:opacity .28s ease;}
    #nanuriHeaderLocal .mega .panel{position:absolute;inset:0;background:#f5f6f7;opacity:0;transform:translateY(-10px);transition:opacity .32s ease,transform .32s ease;}
    #nanuriHeaderLocal .mega .inner{max-width:1440px;margin:0 auto;padding:80px 40px 60px;height:100%;display:flex;flex-direction:column;}
    #nanuriHeaderLocal .mega .topline{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:20px;}
    #nanuriHeaderLocal .mega .topline .brand{display:flex;align-items:center;gap:12px;}
    #nanuriHeaderLocal .mega .topline .brand img{height:32px;}
    #nanuriHeaderLocal .mega .icons{display:flex;gap:16px;align-items:center;}
    #nanuriHeaderLocal .mega .iconBtn{width:36px;height:36px;border:1px solid var(--line);border-radius:10px;background:var(--white);display:grid;place-items:center;cursor:pointer;}
    #nanuriHeaderLocal .mega .grid{display:grid;grid-template-columns:repeat(5,minmax(160px,1fr));gap:48px;margin-top:40px;}
    #nanuriHeaderLocal .mega .col h3{font-size:28px;line-height:1.2;letter-spacing:-.4px;font-weight:900;color:#111;margin:0 0 18px;}
    #nanuriHeaderLocal .mega .col a{display:block;padding:10px 0;color:#111;text-decoration:none;font-size:16px;font-weight:700;}
    #nanuriHeaderLocal .mega .col a:hover{color:var(--brand);}
    #nanuriHeaderLocal .mega .col .mega-sub-label{font-size:13px;color:#888;font-weight:500;margin-top:4px;}
    #nanuriHeaderLocal .mega .watermark{position:absolute;right:40px;bottom:34px;opacity:.08;}
    #nanuriHeaderLocal .mega .watermark svg{width:220px;height:auto;}
    #nanuriHeaderLocal .mega.act{visibility:visible;pointer-events:auto;}
    #nanuriHeaderLocal .mega.act .scrim{opacity:1;}
    #nanuriHeaderLocal .mega.act .panel{opacity:1;transform:translateY(0);}

    /* ===================== MOBILE DRAWER ===================== */
    #nanuriHeaderLocal .overlay{position:fixed;inset:0;background:var(--overlay);display:none;z-index:calc(var(--z) - 1);}
    #nanuriHeaderLocal .overlay.act{display:block;}
    #nanuriHeaderLocal .drawer{
      position:fixed; inset:0 0 0 auto; width:min(480px,94vw);
      background:#ffffff; transform:translateX(100%);
      transition:transform .26s ease;
      z-index:var(--z); display:flex; flex-direction:column;
      height:100dvh; height:100vh;
    }
    #nanuriHeaderLocal .drawer.act{transform:translateX(0);}
    #nanuriHeaderLocal .drawer .top{
      display:flex;align-items:center;justify-content:space-between;
      padding:18px 16px;border-bottom:1px solid var(--line);
      background:#fff;flex:0 0 auto;
    }
    #nanuriHeaderLocal .drawer .top .brand{display:flex;align-items:center;gap:10px;}
    #nanuriHeaderLocal .drawer .top .brand img{height:28px;}

    #nanuriHeaderLocal .mnav{
      padding:10px 18px 32px;
      overflow:auto; -webkit-overflow-scrolling:touch;
      flex:1 1 auto; min-height:0;
      color:#111;
    }

    /* ✅ 모바일: 메뉴 리스트 */
    #nanuriHeaderLocal .mlist{margin:0;padding:0;list-style:none;}
    #nanuriHeaderLocal .mlist>li{border-bottom:1px solid #eceff2;}
    #nanuriHeaderLocal .mlist>li>a,
    #nanuriHeaderLocal .mlist>li>.m-acc-btn{
      display:flex!important;
      align-items:center;
      width:100%;
      min-height:62px;
      padding:0 6px;
      font-weight:800;
      font-size:20px;
      color:#111;
      text-decoration:none;
      letter-spacing:-.2px;
      line-height:1.4;
      box-sizing:border-box;
      margin:0;
    }
    #nanuriHeaderLocal .mlist>li>a:active{opacity:.7;}

    /* ✅ 모바일 아코디언 버튼 추가 스타일 */
    #nanuriHeaderLocal .m-acc-btn{
      justify-content:space-between;
      background:none;border:none;
      cursor:pointer;
      font-family:inherit;
      text-align:left;
      gap:12px;
    }
    #nanuriHeaderLocal .m-acc-btn .m-arrow{
      display:flex;align-items:center;justify-content:center;
      width:24px;height:24px;
      flex-shrink:0;
      transition:transform .25s ease;
    }
    #nanuriHeaderLocal .m-acc-btn .m-arrow svg{display:block;}
    #nanuriHeaderLocal .m-acc-btn[aria-expanded="true"] .m-arrow{
      transform:rotate(180deg);
    }
    #nanuriHeaderLocal .m-sub-list{
      list-style:none;margin:0;padding:0 0 0 16px;
      max-height:0;overflow:hidden;
      transition:max-height .3s ease, padding-bottom .3s ease;
    }
    #nanuriHeaderLocal .m-sub-list.open{
      max-height:200px;
      padding-bottom:12px;
    }
    #nanuriHeaderLocal .m-sub-list li a{
      display:block;
      padding:12px 6px;
      font-size:16px;
      font-weight:600;
      color:#444;
      text-decoration:none;
      letter-spacing:-.1px;
    }
    #nanuriHeaderLocal .m-sub-list li a:active{opacity:.7;}
    #nanuriHeaderLocal .m-sub-list li a:hover{color:var(--brand);}

    /* 브레이크포인트 */
    @media (max-width:1279.98px){
      #nanuriHeaderLocal .bar nav{display:none;}
      #nanuriHeaderLocal .mega{display:none!important;}
    }
    @media (min-width:1280px){
      #nanuriHeaderLocal .drawer{display:none;}
      #nanuriHeaderLocal .overlay{display:none!important;}
    }
  </style>

  <!-- ====== Header Bar ====== -->
  <div class="bar header">
    <div class="wrap">
      <a class="logo" href="./index.html"><img src="./img/logo-g-htu.png" alt="나누리사회적협동조합"></a>

      <nav aria-label="주 메뉴">
        <ul class="gnb" role="menubar">
          <li role="none"><a role="menuitem" data-anchor="company" href="./introduce.html">회사소개</a></li>
          <li role="none"><a role="menuitem" data-anchor="greeting" href="./ceo.html">대표 인사말</a></li>
          <li role="none"><a role="menuitem" data-anchor="vision" href="./vision.html">비전 &amp; 철학</a></li>
       <li role="none"><a role="menuitem" data-anchor="history" href="./history.html">사업 연혁</a></li>
          <li role="none"><a role="menuitem" data-anchor="location" href="./location.html">오시는 길</a></li>
        </ul>
      </nav>

      <div class="actions">
        <button class="globeBtn" type="button" aria-label="언어">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="#0b1220" stroke-width="1.7"/><path d="M3 12h18M12 3c3.5 3.8 3.5 13.2 0 18M12 3c-3.5 3.8-3.5 13.2 0 18" fill="none" stroke="#0b1220" stroke-width="1.2"/></svg>
        </button>
        <button class="menuBtn" type="button" aria-label="전체 메뉴 열기" aria-expanded="false"><i></i></button>
      </div>
    </div>
  </div>

  <!-- ===== 햄버거: 풀스크린 메가메뉴 (PC) ===== -->
  <aside class="mega" aria-hidden="true">
    <div class="scrim" data-close="mega"></div>
    <div class="panel">
      <div class="inner">
        <div class="topline">
          <div class="brand"><img src="./img/logo-g-htu.png" alt="나누리사회적협동조합" /><span style="font-weight:800;color:#0a6a62;letter-spacing:.4px;"></span></div>
          <div class="icons">
            <button class="iconBtn closeMega" type="button" aria-label="닫기">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="#111" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>
        <hr style="border:none;border-top:1px solid var(--line);margin:10px 0 40px;" />

        <div class="grid" role="menu">
          <div class="col"><h3>회사소개</h3><a data-anchor="company" href="./introduce.html">회사소개</a></div>
          <div class="col"><h3>대표 인사말</h3><a data-anchor="greeting" href="./ceo.html">대표 인사말</a></div>
          <div class="col"><h3>비전&철학</h3><a data-anchor="vision" href="./vision.html">비전 &amp; 철학</a></div>
          <div class="col">
            <h3>산하 독립 연구소</h3>
            <a href="" target="_blank" rel="noopener noreferrer">나누리사회적협동조합</a>
          </div>
          <div class="col"><h3>오시는 길</h3><a data-anchor="location" href="./location.html">오시는 길</a></div>
        </div>

        <div class="watermark" aria-hidden="true">
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><path d="M30 30h40a20 20 0 0 1 0 40H30V30zm12 12v16h20a8 8 0 1 0 0-16H42zm64-12h40a20 20 0 0 1 0 40h-40V30zm12 12v16h20a8 8 0 1 0 0-16h-20zM30 78h40a20 20 0 1 1 0 40H30V78zm12 12v16h20a8 8 0 1 0 0-16H42zm64-12h40a20 20 0 1 1 0 40h-40V78zm12 12v16h20a8 8 0 1 0 0-16h-20z" fill="#0b1220"/></svg>
        </div>
      </div>
    </div>
  </aside>

  <!-- ===== MOBILE: Drawer ===== -->
  <div class="overlay" hidden></div>
  <aside class="drawer" aria-hidden="true" aria-label="모바일 전체 메뉴">
    <div class="top">
      <div class="brand"><img src="./img/logo-g-htu.png" alt="나누리사회적협동조합"></div>
      <div style="display:flex;gap:10px;align-items:center;">
        <button class="iconBtn closeDrawer" type="button" aria-label="닫기" style="width:36px;height:36px;border:1px solid var(--line);border-radius:10px;background:#fff;display:grid;place-items:center;">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="#111" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>

    <nav class="mnav" aria-label="모바일 내비게이션">
      <ul class="mlist">
        <li><a data-anchor="company" href="./introduce.html">회사소개</a></li>
        <li><a data-anchor="greeting" href="./ceo.html">대표 인사말</a></li>
        <li><a data-anchor="vision" href="./vision.html">비전 &amp; 철학</a></li>
       <li><a data-anchor="history" href="./history.html">사업 연혁</a></li>
        <li><a data-anchor="location" href="./location.html">오시는 길</a></li>
      </ul>
    </nav>
  </aside>
</section>
`;

  // 2) 메뉴 동작 초기화 함수
  function initNbbioMenu(root) {
    if (!root) return;

    const barEl = root.querySelector('.bar');
    const header = barEl ? barEl.parentElement : null;
    const gnb = root.querySelector('.gnb');

    const btnHamburger = root.querySelector('.menuBtn');
    const mega = root.querySelector('.mega');
    const closeMegaBtn = root.querySelector('.closeMega');

    const overlay = root.querySelector('.overlay');
    const drawer = root.querySelector('.drawer');
    const closeDrawer = root.querySelector('.closeDrawer');

    const logoImg = root.querySelector('.bar .logo img');

    if (!barEl || !header || !btnHamburger || !mega || !overlay || !drawer) return;

    const isDesktop = () => window.matchMedia('(min-width:1280px)').matches;
    const canHover = () => window.matchMedia('(hover:hover)').matches;
    const lockScroll = (on) => { document.documentElement.style.overflow = on ? 'hidden' : ''; };

    if (gnb) {
      gnb.addEventListener('mouseover', () => header.classList.add('act'));
      header.addEventListener('mouseleave', () => header.classList.remove('act'));
    }

    root.querySelectorAll('.gnb > li').forEach(li => {
      li.addEventListener('mouseenter', () => { if (isDesktop()) li.classList.add('is-on'); });
      li.addEventListener('mouseleave', () => li.classList.remove('is-on'));
      li.addEventListener('focusin', () => { if (isDesktop()) li.classList.add('is-on'); });
      li.addEventListener('focusout', () => li.classList.remove('is-on'));
    });

    /* ========= 모바일 아코디언 서브메뉴 ========= */
    root.querySelectorAll('.m-acc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const subList = btn.nextElementSibling;
        if (!subList) return;
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        subList.classList.toggle('open', !expanded);
      });
    });

    /* ========= PC: 햄버거 → 전체 메가메뉴 ========= */
    const openMega = () => {
      mega.classList.add('act');
      btnHamburger.setAttribute('aria-expanded', 'true');
      lockScroll(true);
      root.classList.add('scroll-up');
      root.classList.remove('scroll-down');
      syncLogo();
    };
    const closeMega = () => {
      mega.classList.remove('act');
      btnHamburger.setAttribute('aria-expanded', 'false');
      lockScroll(false);
      syncLogo();
    };

    /* ========= MOBILE: Drawer ========= */
    const openDrawer = () => {
      overlay.hidden = false;
      overlay.classList.add('act');
      drawer.classList.add('act');
      drawer.setAttribute('aria-hidden', 'false');
      lockScroll(true);
      root.classList.add('scroll-up');
      root.classList.remove('scroll-down');
      syncLogo();
    };
    const closeDrawerAll = () => {
      overlay.classList.remove('act');
      overlay.hidden = true;
      drawer.classList.remove('act');
      drawer.setAttribute('aria-hidden', 'true');
      lockScroll(false);
      syncLogo();
    };

    btnHamburger.addEventListener('click', () => {
      if (isDesktop()) openMega();
      else openDrawer();
    });

    const closeAll = () => { closeMega(); closeDrawerAll(); };

    if (closeMegaBtn) closeMegaBtn.addEventListener('click', closeAll);
    const scrim = root.querySelector('[data-close="mega"]');
    if (scrim) scrim.addEventListener('click', closeAll);

    if (closeDrawer) closeDrawer.addEventListener('click', closeDrawerAll);
    overlay.addEventListener('click', closeDrawerAll);

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

    /* ========= 스무스 스크롤 ========= */
    function smoothScrollToId(id) {
      const el = document.getElementById(id);
      if (!el) return false;

      const headerH = barEl ? barEl.getBoundingClientRect().height : 0;
      const y = window.pageYOffset + el.getBoundingClientRect().top - headerH - 8;

      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      return true;
    }

    function isSamePageLink(aEl) {
      try {
        const u = new URL(aEl.href, window.location.href);
        return (u.origin === window.location.origin) && (u.pathname === window.location.pathname);
      } catch (_) {
        return false;
      }
    }

    function onAnchorClick(e) {
      const a = e.target.closest('a[data-anchor]');
      if (!a) return;

      const dataAnchor = (a.getAttribute('data-anchor') || '').trim();
      const rawHref = (a.getAttribute('href') || '').trim();

      // a.href는 절대 URL로 계산되므로 URL 기반으로 판단
      let url = null;
      try { url = new URL(a.href, window.location.href); } catch (_) { }

      const samePage = url ? ((url.origin === location.origin) && (url.pathname === location.pathname)) : false;
      const hashId = url && url.hash ? url.hash.replace('#', '') : '';
      const hrefHashId = rawHref.startsWith('#') ? rawHref.slice(1) : '';

      // 우선순위: href의 #id > URL hash > data-anchor
      const targetId = (hrefHashId || hashId || dataAnchor || '').trim();

      // ✅ 1) "같은 페이지" + "id가 실제 존재"일 때만 스무스 스크롤로 가로챔
      if (samePage && targetId && document.getElementById(targetId)) {
        e.preventDefault();
        smoothScrollToId(targetId);
        closeAll();
        return;
      }

      // ✅ 2) 다른 페이지 링크면 이동을 막지 않음.
      // 단, 메뉴가 열린 상태에서 이동이면 스크롤락 해제/닫힘 보장 후 이동
      const menuOpened = mega.classList.contains('act') || drawer.classList.contains('act');
      if (!samePage && menuOpened) {
        e.preventDefault();
        closeAll();
        // 닫힘 처리 후 이동(0ms로도 충분)
        setTimeout(() => { window.location.href = a.href; }, 0);
        return;
      }

      // ✅ 3) 같은 페이지인데 targetId가 없거나 요소가 없으면: 기본 href 동작 그대로(막지 않음)
    }

    // 헤더 GNB / 메가 / 드로어 모두에서 잡기
    root.addEventListener('click', onAnchorClick);

    /* ========= 스크롤/호버 상태에 따른 로고 스왑 ========= */
    let lastY = window.scrollY || 0;
    const delta = 6;
    let ticking = false;

    let mobilePeek = false;
    let mobilePeekTimer = null;

    function setHoveringClass(on) { root.classList.toggle('hovering', !!on); }

    function setMobilePeek(on, ms = 1200) {
      mobilePeek = !!on;
      clearTimeout(mobilePeekTimer);
      setHoveringClass(mobilePeek);
      if (mobilePeek) {
        mobilePeekTimer = setTimeout(() => {
          mobilePeek = false;
          setHoveringClass(false);
          syncLogo();
        }, ms);
      }
    }

    function isMenuHovered() {
      if (canHover()) {
        return (
          (barEl && barEl.matches(':hover')) ||
          (gnb && gnb.matches(':hover'))
        );
      }
      return mobilePeek;
    }

    function setLogo(src) {
      if (!logoImg) return;
      if (logoImg.getAttribute('src') !== src) logoImg.setAttribute('src', src);
    }

    function swapLogoByState(y) {
      const menuOpened = mega.classList.contains('act') || drawer.classList.contains('act');
      if (menuOpened || isMenuHovered()) setLogo('./img/logo-g-htu.png');
      else if (y <= 30) setLogo('./img/logo-w.png');
      else setLogo('./img/logo-g-htu.png');
    }

    function applyTopState(y) { (y <= 30) ? root.classList.add('at-top') : root.classList.remove('at-top'); }

    function handleScrollDirection() {
      const y = window.scrollY || 0;
      const diff = y - lastY;

      applyTopState(y);
      swapLogoByState(y);

      const forceShow = mega.classList.contains('act') || drawer.classList.contains('act');
      if (forceShow) {
        root.classList.add('scroll-up');
        root.classList.remove('scroll-down');
        lastY = y;
        ticking = false;
        return;
      }

      if (Math.abs(diff) > delta) {
        if (diff > 0) { root.classList.add('scroll-down'); root.classList.remove('scroll-up'); }
        else { root.classList.add('scroll-up'); root.classList.remove('scroll-down'); }
        lastY = y;
      }

      if (y <= 0) {
        root.classList.remove('scroll-down');
        root.classList.add('scroll-up');
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(handleScrollDirection);
        ticking = true;
      }
    }

    function syncLogo() { swapLogoByState(window.scrollY || 0); }

    function syncHoveringState() {
      if (!canHover()) return;
      const y = window.scrollY || 0;
      const hovering = (y <= 30) && (barEl && barEl.matches(':hover'));
      setHoveringClass(hovering);
      syncLogo();
    }

    function peekIfTop() {
      if (canHover()) return;
      const y = window.scrollY || 0;
      if (y > 30) return;
      setMobilePeek(true, 1200);
      syncLogo();
    }

    if (barEl) ['mouseenter', 'mouseleave', 'mousemove'].forEach(evt => barEl.addEventListener(evt, syncHoveringState));
    barEl.addEventListener('pointerdown', peekIfTop, { passive: true });
    btnHamburger.addEventListener('pointerdown', peekIfTop, { passive: true });

    window.addEventListener('scroll', () => {
      if (!canHover() && mobilePeek) {
        setMobilePeek(false);
        syncLogo();
      }
    }, { passive: true });

    document.addEventListener('pointerdown', (e) => {
      if (canHover()) return;
      if (!mobilePeek) return;
      if (barEl && barEl.contains(e.target)) return;
      setMobilePeek(false);
      syncLogo();
    }, { passive: true });

    // 리사이즈 가드
    const resetStates = () => {
      if (isDesktop()) {
        closeDrawerAll();
      } else {
        mega.classList.remove('act');
        btnHamburger.setAttribute('aria-expanded', 'false');
        lockScroll(false);
      }
      syncLogo();
    };
    window.addEventListener('resize', resetStates);

    applyTopState(window.scrollY || 0);
    root.classList.add('scroll-up');
    setHoveringClass(false);
    syncLogo();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 3) mount 함수
  function mountMenu() {
    const mount = document.getElementById('menu_navi');
    if (!mount) return;
    if (mount._nbbioMounted) return;
    mount._nbbioMounted = true;

    mount.innerHTML = HEADER_TEMPLATE;

    const root = mount.querySelector('#nanuriHeaderLocal');
    initNbbioMenu(root);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountMenu);
  else mountMenu();
})();