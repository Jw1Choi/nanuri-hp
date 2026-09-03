(function () {
  const mount = document.getElementById('footer_template');
  if (!mount) return;

  if (document.getElementById('footerElite')) return;

  mount.innerHTML = `
<section id="footerElite" aria-label="사이트 푸터" style="position:relative;">
  <script src="https://kit.fontawesome.com/2d323a629b.js" crossorigin="anonymous"></script>

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
      align-items: stretch;
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
      grid-template-columns:repeat(3,1fr);
      flex:1 1 0;
      gap:2rem 3rem;
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
        grid-template-columns:repeat(4,1fr);
        gap:2rem 2.5rem;
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
          <img src="./img/logo-w.png" alt="HTU GLOBAL HOLDINGS 로고" style="width:200px;">
        </div>
        <p class="slogan">
          복지의 사각지대, 고령화 시대의 주거・돌봄 문제를 해결합니다.
        </p>
      </div>

      <div class="menuRow">
        <div class="col">
          <h4>나누리 소개</h4>
          <ul>
            <li><a href="./about.html">나누리는</a></li>
            <li><a href="./ceo.html">이사장 인사말</a></li>
            <li><a href="./vision.html">비전 &amp; 미션</a></li>
            <li><a href="./history.html">사업 연혁</a></li>
          </ul>
        </div>

      <!--  <div class="col">
          <h4>사업 &amp; 실적</h4>
          <ul>
            <li><a href="./business.html">통합 홈케어 사업</a></li>
            <li><a href="./history.html">사업 실적·연혁</a></li>
            <li><a href="./partner.html">인증 &amp; 파트너</a></li>
            <li><a href="./organization.html">조직도</a></li>
          </ul>
        </div>

        <div class="col">
          <h4>안심 홈케어</h4>
          <ul>
            <li><a href="./homecare.html">홈케어 패키지</a></li>
            <li><a href="./howto.html">이용 방법</a></li>
            <li><a href="./case.html">시공·정리 사례</a></li>
            <li><a href="./estimate.html">예약·견적 신청</a></li>
          </ul>
        </div>

        <div class="col">
          <h4>협력 기관</h4>
          <ul>
            <li><a href="./b2g.html">공공기관 (B2G)</a></li>
            <li><a href="./b2b.html">기업 ESG (B2B)</a></li>
            <li><a href="./program.html">교육·출장 프로그램</a></li>
            <li><a href="./proposal.html">협력 제안하기</a></li>
          </ul>
        </div>

        <div class="col">
          <h4>나누리 스토리</h4>
          <ul>
            <li><a href="./column.html">안심 칼럼</a></li>
            <li><a href="./news.html">활동 소식</a></li>
            <li><a href="./press.html">언론 보도</a></li>
          </ul>
        </div> -->

        <div class="col">
          <h4>문의</h4>
          <ul>
            <li><a href="./contact.html">상담·견적 문의</a></li>
            <li><a href="./location.html">오시는 길</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footBar">
      <div class="addr">
        <div class="corpLine"
          data-corp="나누리사회적협동조합"
          data-ceo=""
          data-corpno=""
          data-bizno="나누리사회적협동조합">

          <span class="corpName" id="corpName">나누리사회적협동조합</span>

          <span class="sep">·</span>
          <span class="meta">사업자등록번호 : <b id="corpNo">110-230-129994</b></span>

          <span class="sep">·</span>
          <span class="meta">대표 : <b id="corpCEO">홍길동</b></span>

          <span class="sep">·</span>
          <span class="meta">주소 : <b>서울시 마포구 동교로 72-1 한영빌딩 201호</b></span>
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
`;

  const root = mount.querySelector('.corpLine');

  if (root) {
    const map = {
      corpName: root.dataset.corp,
      corpCEO: root.dataset.ceo,
      corpNo: root.dataset.corpno,
      bizNo: root.dataset.bizno
    };

    Object.entries(map).forEach(([id, value]) => {
      if (!value) return;
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });
  }

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