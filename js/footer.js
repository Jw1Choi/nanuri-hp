(function () {
  const mount = document.getElementById('footer_template');
  if (!mount) return;

  if (document.getElementById('footerElite')) return;

  /* ─────────────────────────────────────────────────────────────
     푸터 메뉴 = 관리자 > 메뉴 구성 (./data/site-menu.json)
     - 그룹·항목 중 「푸터」 체크된 것만 보입니다.
     - menu3.js 가 먼저 불러온 데이터(window.__nnrSiteMenu)를 같이 씁니다.
     - 파일을 읽지 못하면 아래 기본 메뉴를 그대로 보여줍니다.
     ───────────────────────────────────────────────────────────── */
  const FOOTER_DEFAULT_MENU = {"version":1,"updatedAt":"","groups":[{"id": "g-about", "label": "나누리 소개", "href": "./about.html", "header": true, "footer": true, "items": [{"id": "m-about", "label": "나누리는", "href": "./about.html", "newTab": false, "header": true, "footer": true}, {"id": "m-ceo", "label": "이사장 인사말", "href": "./ceo.html", "newTab": false, "header": true, "footer": true}, {"id": "m-vision", "label": "비전 & 미션", "href": "./vision.html", "newTab": false, "header": true, "footer": true}, {"id": "m-history", "label": "사업연혁", "href": "./history.html", "newTab": false, "header": true, "footer": true}]}, {"id": "g-biz", "label": "주요 사업", "href": "./seoul-gasa.html", "header": true, "footer": true, "items": [{"id": "m-seoul-gasa", "label": "서울형가사서비스", "href": "./seoul-gasa.html", "newTab": false, "header": true, "footer": true}, {"id": "m-gasa", "label": "일반가사특화서비스", "href": "./gasa.html", "newTab": false, "header": true, "footer": true}, {"id": "m-seoul-housecare", "label": "서울시안심집수리", "href": "./seoul-housecare.html", "newTab": false, "header": true, "footer": true}, {"id": "m-housecare", "label": "일반 집수리/인테리어", "href": "./housecare.html", "newTab": false, "header": true, "footer": true}, {"id": "m-care-repair", "label": "정리수납·생활집수리", "href": "./care-repair.html", "newTab": false, "header": true, "footer": true}, {"id": "m-mapo-care", "label": "마포형 통합돌봄", "href": "./mapo-care.html", "newTab": false, "header": true, "footer": true}, {"id": "m-gasa-edu", "label": "가사관리사 교육", "href": "./gasa-edu.html", "newTab": false, "header": true, "footer": true}]}, {"id": "g-apply", "label": "온라인 신청", "href": "./online-program.html", "header": true, "footer": true, "items": [{"id": "m-apply-gasa", "label": "서울형가사서비스", "href": "./35.html", "newTab": false, "header": true, "footer": true}, {"id": "m-apply-housecare", "label": "서울시안심집수리", "href": "./36.html", "newTab": false, "header": true, "footer": true}]}, {"id": "g-comm", "label": "소통공간", "href": "./notice.html", "header": true, "footer": true, "items": [{"id": "m-notice", "label": "공지사항", "href": "./notice.html", "newTab": false, "header": true, "footer": true}, {"id": "m-gallery", "label": "갤러리", "href": "./gallary.html", "newTab": false, "header": true, "footer": true}]}]};

  function siteMenu() {
    if (window.__nnrSiteMenu) return window.__nnrSiteMenu;
    const KEY = 'nnr.siteMenu.v1';
    const valid = (d) => !!(d && Array.isArray(d.groups) && d.groups.length);
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!valid(cached)) cached = null;
    const fresh = window.fetch
      ? fetch('./data/site-menu.json?v=' + Math.floor(Date.now() / 60000), { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (!valid(d)) return null;
            try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
            return d;
          })
          .catch(() => null)
      : Promise.resolve(null);
    window.__nnrSiteMenu = { cached, fresh, fallback: FOOTER_DEFAULT_MENU };
    return window.__nnrSiteMenu;
  }

  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeHref = (v) => {
    const h = String(v || '').trim();
    return /^(\.\/|\/(?!\/)|https?:\/\/|tel:|mailto:|#)[^\s"'<>`\\]*$/i.test(h) ? h : '#';
  };

  function footerColumns(menu) {
    const groups = ((menu && menu.groups) || FOOTER_DEFAULT_MENU.groups)
      .filter((g) => g && g.footer !== false)
      .map((g) => ({ g, items: (g.items || []).filter((m) => m && m.footer !== false) }))
      .filter((x) => x.items.length);
    const html = groups.map(({ g, items }) => `
        <div class="col">
          <h4>${esc(g.label)}</h4>
          <ul>
${items.map((m) => `            <li><a href="${esc(safeHref(m.href))}"${m.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(m.label)}</a></li>`).join('\n')}
          </ul>
        </div>`).join('\n');
    return { html, count: Math.max(1, Math.min(groups.length, 6)) };
  }

  const src = siteMenu();
  const first = src.cached || src.fallback;

  function buildFooterHtml(tpl) {
    const c = footerColumns(first);
    return tpl.replace('__FOOTER_MENU__', () => c.html)
      .replace('id="footerMenuRow">', () => `id="footerMenuRow" style="--fcols:${c.count}">`);
  }

  src.fresh.then((d) => {
    if (!d || JSON.stringify(d.groups) === JSON.stringify(first.groups)) return;
    const row = document.getElementById('footerMenuRow');
    if (!row) return;
    const c = footerColumns(d);
    row.innerHTML = c.html;
    row.style.setProperty('--fcols', String(c.count));
  });

  mount.innerHTML = buildFooterHtml(`
<section id="footerElite" aria-label="사이트 푸터" style="position:relative;">
  <style>
    #footerElite{
      --bg:#033b1e;
      --ink:#e5e7eb;
      --muted:#9aa1aa;
      --line:rgba(255,255,255,.08);
      --glass:rgba(255,255,255,.06);
      --max:1280px;
      font-family:Pretendard,"Noto Sans KR",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
      background:var(--bg);
      color:var(--muted);
      -webkit-font-smoothing:antialiased;
      text-rendering:optimizeLegibility;
    }

    #footerElite .wrap{
      max-width:var(--max);
      margin:0 auto;
      padding:3.5rem 1.25rem 2.25rem;
    }

    #footerElite .navGrid{
      display:flex;
      align-items:stretch;
      gap:3rem;
      border-bottom:1px solid var(--line);
      padding-bottom:2rem;
    }

    #footerElite .brandCol{
      flex:0 0 260px;
      display:flex;
      flex-direction:column;
      gap:.9rem;
    }

    #footerElite .logoRow{
      display:flex;
      align-items:center;
    }

    #footerElite .slogan{
      font-size:.92rem;
      line-height:1.55;
    }

    #footerElite .menuRow{
      display:grid;
      grid-template-columns:repeat(var(--fcols,4),1fr);
      flex:1 1 0;
      gap:2rem 2.5rem;
      min-width:0;
    }

    #footerElite .col{
      min-width:0;
    }

    #footerElite h4{
      margin:.1rem 0 .85rem;
      font-size:1rem;
      font-weight:800;
      color:#fff;
      white-space:nowrap;
    }

    #footerElite ul{
      list-style:none;
      margin:0;
      padding:0;
    }

    #footerElite li{
      margin:.48rem 0;
    }

    #footerElite a{
      color:var(--muted);
      text-decoration:none;
      font-size:.92rem;
      word-break:keep-all;
      transition:color .22s ease;
    }

    #footerElite a:hover{
      color:#fff;
    }

    #footerElite .footBar{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:1.5rem;
      padding:1.25rem 0 0;
    }

    #footerElite .addr{
      font-size:.86rem;
      line-height:1.7;
      min-width:0;
    }

    #footerElite .corpLine{
      display:flex;
      flex-wrap:wrap;
      gap:.45rem .55rem;
    }

    #footerElite .corpName{
      color:var(--ink);
      font-weight:800;
    }

    #footerElite .sep{
      color:rgba(255,255,255,.22);
    }

    #footerElite .meta b{
      color:#d7dde6;
      font-weight:600;
    }

    #footerElite .copy{
      margin-top:.6rem;
      font-size:.8rem;
      color:#88919c;
    }

    #footerElite .familyArea{
      position:relative;
      flex:0 0 auto;
      min-width:250px;
      display:flex;
      justify-content:flex-end;
    }

    #footerElite .familyDropdown{
      position:relative;
      width:250px;
    }

    #footerElite .familyBtn{
      width:100%;
      height:48px;
      border:1px solid rgba(255,255,255,.14);
      border-radius:999px;
      background:rgba(255,255,255,.045);
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:0 16px 0 18px;
      font-size:.9rem;
      font-weight:700;
      letter-spacing:-.02em;
      font-family:inherit;
      cursor:pointer;
      backdrop-filter:blur(12px);
      -webkit-backdrop-filter:blur(12px);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.08);
      transition:background .25s ease,border-color .25s ease,transform .25s ease;
    }

    #footerElite .familyBtn:hover{
      background:rgba(255,255,255,.075);
      border-color:rgba(255,255,255,.28);
      transform:translateY(-1px);
    }

    #footerElite .familyIcon{
      width:28px;
      height:28px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      background:rgba(255,255,255,.08);
      transition:transform .28s ease,background .28s ease;
    }

    #footerElite .familyIcon::before{
      content:"";
      width:7px;
      height:7px;
      border-right:2px solid #e5e7eb;
      border-bottom:2px solid #e5e7eb;
      transform:translateY(-2px) rotate(45deg);
    }

    #footerElite .familyDropdown.is-open .familyIcon{
      transform:rotate(180deg);
      background:rgba(255,255,255,.14);
    }

    #footerElite .familyMenu{
      position:absolute;
      right:0;
      bottom:58px;
      width:300px;
      max-height:430px;
      overflow-y:auto;
      padding:8px;
      border-radius:18px;
      background:rgba(247,250,247,.97);
      border:1px solid rgba(255,255,255,.55);
      box-shadow:0 24px 55px rgba(0,0,0,.32);
      opacity:0;
      visibility:hidden;
      transform:translateY(12px) scale(.98);
      transform-origin:bottom right;
      transition:opacity .24s ease, visibility .24s ease, transform .24s ease;
      z-index:30;
    }

    #footerElite .familyMenu::-webkit-scrollbar{
      width:6px;
    }

    #footerElite .familyMenu::-webkit-scrollbar-thumb{
      background:rgba(3,59,30,.28);
      border-radius:999px;
    }

    #footerElite .familyDropdown.is-open .familyMenu{
      opacity:1;
      visibility:visible;
      transform:translateY(0) scale(1);
    }

    #footerElite .familyMenu::after{
      content:"";
      position:absolute;
      right:28px;
      bottom:-7px;
      width:14px;
      height:14px;
      background:rgba(247,250,247,.97);
      transform:rotate(45deg);
      border-right:1px solid rgba(255,255,255,.55);
      border-bottom:1px solid rgba(255,255,255,.55);
    }

    #footerElite .familyMenu a{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:12px 13px;
      border-radius:12px;
      color:#123826;
      font-size:.9rem;
      font-weight:700;
      letter-spacing:-.02em;
      transition:background .2s ease,color .2s ease,transform .2s ease;
    }

    #footerElite .familyMenu a::after{
      content:"↗";
      font-size:.76rem;
      color:rgba(18,56,38,.46);
      transition:transform .2s ease,color .2s ease;
    }

    #footerElite .familyMenu a:hover{
      background:#e7efe9;
      color:#032d19;
      transform:translateX(2px);
    }

    #footerElite .familyMenu a:hover::after{
      transform:translate(2px,-2px);
      color:#032d19;
    }

    @media(max-width:1100px){
      #footerElite .navGrid{
        gap:2rem;
      }

      #footerElite .brandCol{
        flex:0 0 220px;
      }

      #footerElite .menuRow{
        gap:2rem 1.75rem;
      }
    }

    @media(max-width:900px){
      #footerElite .navGrid{
        flex-direction:column;
        gap:2rem;
      }

      #footerElite .brandCol{
        flex:none;
        width:100%;
      }

      #footerElite .menuRow{
        grid-template-columns:repeat(var(--fcols,4),1fr);
        gap:2rem 2rem;
      }

      #footerElite .footBar{
        flex-direction:column;
      }

      #footerElite .familyArea{
        width:100%;
        justify-content:flex-start;
      }

      #footerElite .familyDropdown{
        width:100%;
        max-width:380px;
      }

      #footerElite .familyMenu{
        left:0;
        right:auto;
        width:100%;
        bottom:58px;
        transform-origin:bottom left;
      }

      #footerElite .familyMenu::after{
        left:28px;
        right:auto;
      }
    }

    @media(max-width:600px){
      #footerElite .wrap{
        padding:2.5rem 1.15rem 2rem;
      }

      #footerElite .menuRow{
        grid-template-columns:repeat(2,1fr);
        gap:1.8rem 1.5rem;
      }

      #footerElite .familyDropdown{
        max-width:none;
      }
    }
  </style>

  <div class="wrap">
    <div class="navGrid">
      <div class="brandCol">
        <div class="logoRow">
          <img src="./img/logo-w.png" alt="나누리사회적협동조합 로고" style="width:200px;">
        </div>
        <p class="slogan">
          복지의 사각지대, 고령화 시대의 주거・돌봄 문제를 해결합니다.
        </p>
      </div>

      <div class="menuRow" id="footerMenuRow">__FOOTER_MENU__</div>
    </div>

    <div class="footBar">
      <div class="addr">
        <div class="corpLine">
          <span class="corpName">나누리사회적협동조합</span>

          <span class="sep">·</span>
          <span class="meta">대표 : <b>김은주</b></span>

          <span class="sep">·</span>
          <span class="meta">법인등록번호 : <b>270151-0031555</b></span>
          <span class="sep">·</span>
          <span class="meta">주소 : <b>서울시 마포구 동교로 72-1 201호 (합정동, 한영빌딩)</b></span>
        </div>

        <div class="corpLine">
          <span class="meta">전화 : <b><a href="tel:0263480851" style="color:#d7dde6;font-size:inherit;">02-6348-0851</a></b></span>

          <span class="sep">·</span>
          <span class="meta">팩스 : <b>0504-420-8021</b></span>

          <span class="sep">·</span>
          <span class="meta">이메일 : <b><a href="mailto:nnrcoop@naver.com" style="color:#d7dde6;font-size:inherit;">nnrcoop@naver.com</a></b></span>
        </div>

        <div class="copy">
          COPYRIGHT © 2026 나누리사회적협동조합<br>
          ALL RIGHTS RESERVED
        </div>
      </div>

      <!-- <div class="familyArea">
        <div class="familyDropdown" id="familyDropdown">
          <button type="button" class="familyBtn" id="familyBtn" aria-expanded="false" aria-controls="familyMenu">
            <span>패밀리 사이트</span>
            <i class="familyIcon" aria-hidden="true"></i>
          </button>

          <div class="familyMenu" id="familyMenu" role="menu">
            <a href="http://hcn.or.kr/" target="_blank" rel="noopener noreferrer" role="menuitem">건강소비자 연대</a>
            <a href="https://biznovalab.com" target="_blank" rel="noopener noreferrer" role="menuitem">비즈니스 혁신 연구소</a>
            <a href="https://www.maxq.kr/" target="_blank" rel="noopener noreferrer" role="menuitem">MAXQ</a>
            <a href="https://www.mdjournal.kr/" target="_blank" rel="noopener noreferrer" role="menuitem">MD 저널</a>
            <a href="https://endo365.kr/" target="_blank" rel="noopener noreferrer" role="menuitem">ENDO 저널</a>
            <a href="https://www.healthumer.com/" target="_blank" rel="noopener noreferrer" role="menuitem">헬스컨슈머</a>
            <a href="https://kbhga.com/" target="_blank" rel="noopener noreferrer" role="menuitem">한국뷰티헬시에이징국제교류회</a>
            <a href="https://khealthyaging.com/" target="_blank" rel="noopener noreferrer" role="menuitem">한국헬시에이징학회</a>
            <a href="https://www.sapiensland.io/" target="_blank" rel="noopener noreferrer" role="menuitem">사피엔스 아일랜드</a>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</section>
`);

  const dropdown = document.getElementById('familyDropdown');
  const btn = document.getElementById('familyBtn');

  if (dropdown && btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdown.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();