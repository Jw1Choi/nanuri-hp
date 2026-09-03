// ./js/form.js
(function () {
  const FORM_TEMPLATE = `
<section id="applyMintForm" aria-label="신청 폼">

  <!-- 배경 버블 -->
  <span aria-hidden="true" class="bg-bubble b1"></span>
  <span aria-hidden="true" class="bg-bubble b2"></span>
  <span aria-hidden="true" class="bg-bubble b3"></span>

  <div class="wrap">
    <!-- 좌측 카피 -->
    <div class="copy">
      <span class="tag">오프라인 강의 상담 신청</span>
      <h2 class="headline">혁신과 변화의 어려움<br>이젠 내려놓으세요.<br><b>지금 간편 신청 하기</b></h2>
      <p class="sub">간단한 항목을 기반으로 혁신의 기회를 확보하세요!</p>
      <div class="points" aria-hidden="true">
        <div class="chip">✓ 전문가 1:1 무료 상담</div>
        <div class="chip">✓ 즉시 전화 안내</div>
      </div>
    </div>

    <!-- 우측 폼 카드 -->
    <div class="card" id="applyForm">
      <form action="" id="form_e12" method="POST" target="hidden_iframe12" onsubmit="dll(); submitted=true;">
        <input type="hidden" name="entry.1524668040" value="당근">

        <h3>상담 신청 폼</h3>
        <p class="help">* 표시는 필수 입력</p>

        <div class="grid">

          <div class="field">
            <label for="name">성함 *</label>
            <input id="name1" name="entry.1069240464" type="text" placeholder="홍길동" maxlength="4">
          </div>

          <div class="field">
            <label for="phone">연락처 *</label>
            <input id="phone1" name="entry.1985153351" type="text" placeholder="01012345678" maxlength="11">
          </div>

          <div class="field">
            <label for="name">회사명 *</label>
            <input id="company1" name="entry.54578187" type="text" placeholder="회사명" maxlength="10">
          </div>

          <div class="field">
            <label for="region">지역 *</label>
            <select id="region1" name="entry.2044065206">
              <option value="" selected disabled>지역 선택</option>
              <option>서울</option><option>부산</option><option>대구</option><option>인천</option>
              <option>광주</option><option>대전</option><option>울산</option><option>경기</option>
              <option>강원</option><option>충북</option><option>충남</option><option>전북</option>
              <option>전남</option><option>경북</option><option>경남</option><option>제주</option>
            </select>
          </div>

          <div class="field">
            <label for="region">회사업종 *</label>
               <input id="type1" name="entry.17479036" type="text" placeholder="회사업종" maxlength="10">
          </div>

          <div class="field">
            <label for="region">사업연혁 *</label>
            <select id="runtime1" name="entry.1389324988">
              <option value="" selected disabled>사업 연혁 선택</option>
              <option>1년 미만</option><option>1년 - 3년</option><option>3년 - 7년</option><option>7년 이상</option>
            </select>
          </div>

         <!-- <div class="field">
            <label for="region">연매출 *</label>
            <select id="sales1" name="entry.1400342969">
              <option value="" selected disabled>연매출 선택</option>
              <option disabled>매출 없음 (신청불가)</option>
              <option>1억 미만</option><option>2~3억원</option><option>4~5억원</option>
              <option>5~10억원</option><option>10~20억원</option><option>20억원 이상</option>
            </select>
          </div> -->

          <!-- <div class="field">
            <label for="region">신용점수 *</label>
            <select id="fund1" name="entry.1362031850">
              <option value="" selected disabled>신용점수 선택</option>
              <option>900점 이상</option>
              <option>800점 ~ 899점</option>
              <option>700점 ~ 799점</option>
              <option disabled>700점 미만 (신청 불가)</option>
            </select>
          </div> -->

          <!-- <div class="field">
            <label for="region">연체 및 체납여부 *</label>
            <select id="overdue1" name="entry.1037729320">
              <option value="" selected disabled>연체 / 체납 여부 선택</option>
              <option disabled>있음 (신청 불가)</option>
              <option>없음</option>
            </select>
          </div> -->

          <!-- <div class="field">
            <label for="region">상담 가능 시간 *</label>
            <select id="need1" name="entry.1742892989">
              <option value="통화가능시간" selected disabled>통화가능시간</option>
              <option value="언제나 통화 가능">언제나 통화 가능</option>
              <option value="오전 09:00~10:00">오전 09:00 ~ 10:00</option>
              <option value="오전 10:00~11:00">오전 10:00 ~ 11:00</option>
              <option value="오전 11:00~12:00">오전 11:00 ~ 12:00</option>
              <option value="점심 12:00~01:00">점심 12:00 ~ 01:00</option>
              <option value="오후 01:00~02:00">오후 01:00 ~ 02:00</option>
              <option value="오후 02:00~03:00">오후 02:00 ~ 03:00</option>
              <option value="오후 03:00~04:00">오후 03:00 ~ 04:00</option>
              <option value="오후 04:00~05:00">오후 04:00 ~ 05:00</option>
              <option value="오후 05:00~06:00">오후 05:00 ~ 06:00</option>
              <option value="오후 06:00~07:00">오후 06:00 ~ 07:00</option>
            </select>
          </div> -->

          <div class="field full">
            <label for="memo">문의 사항</label>
            <textarea id="memo" name="entry.549289795" placeholder="상담이 필요한 내용을 간단히 남겨주세요."></textarea>
          </div>

          <div class="field full">
            <label class="agree">
              <input id="agree" type="checkbox" checked>
              <span>개인정보 수집·이용 및 광고성 정보 수신에 동의합니다. (필수)</span>
            </label>
          </div>

        </div>

        <div class="actions">
          <input class="btn btn-fill" id="send_message1" type="submit" value="지금 신청하기" disabled>
        </div>

      </form>
    </div>
  </div>

  <script type="text/javascript">var submitted = false;</script>

  <iframe name="hidden_iframe11" id="hidden_iframe11" style="display:none;" onload=""></iframe>
  <iframe name="hidden_iframe12" id="hidden_iframe12" style="display:none;" onload=""></iframe>

</section>
  `;

  document.getElementById("form_biz").innerHTML = FORM_TEMPLATE;
})();
