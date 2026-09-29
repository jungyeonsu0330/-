// 실시간 교육 뉴스 & AI 3줄 요약 브리핑 및 대입·고입 타임라인 & 입시 AI 챗봇 엔진

const NewsEngine = {
  // 타임라인 상태 관리
  currentTimelineMode: 'UNIV', // 'UNIV' (대입) | 'HIGHSCHOOL' (고입)
  currentTimelineYear: '2027', // '2027' (현 고3/중3 기본) | '2028' (현 고2/중2) | '2026'
  currentTimelineCategory: 'ALL',

  setTimelineMode: function(mode) {
    this.currentTimelineMode = mode;
  },

  setTimelineYear: function(year) {
    this.currentTimelineYear = year;
  },

  setTimelineCategory: function(cat) {
    this.currentTimelineCategory = cat;
  },

  // 1. 카테고리 필터링 헬퍼 (최근 1년 치 보관 & 이전 자료 자동 제외)
  getFilteredNews: function(category = "ALL") {
    let list = (typeof window !== 'undefined' && window.EDUCATION_NEWS_DATA && window.EDUCATION_NEWS_DATA.length > 0)
      ? window.EDUCATION_NEWS_DATA
      : (typeof EDUCATION_NEWS_DATA !== 'undefined' ? EDUCATION_NEWS_DATA : []);
    
    // [1년 보존 정책] 최근 1년(365일) 이내 기사만 화면에 유지, 1년 초과 과거 자료는 자동 제외
    const oneYearAgoMs = Date.now() - (365 * 24 * 60 * 60 * 1000);
    list = list.filter(item => {
      if (!item.publishedAt) return true;
      const d = new Date(item.publishedAt.replace(/-/g, '/'));
      return isNaN(d.getTime()) || d.getTime() >= oneYearAgoMs;
    });

    if (category !== "ALL") {
      list = list.filter(item => {
        const cat = item.category || "";
        if (category === "의약학" || category === "의약학/정원") {
          return cat.includes("의약학") || cat.includes("의대") || cat.includes("정원");
        }
        if (category === "수능/모의평가") {
          return cat.includes("수능") || cat.includes("모의");
        }
        if (category === "정책/제도") {
          return cat.includes("정책") || cat.includes("제도") || cat.includes("무전공") || cat.includes("학점제");
        }
        if (category === "전문대") {
          return cat.includes("전문대");
        }
        if (category === "고입/특목고" || category === "고입뉴스") {
          return cat.includes("고입") || cat.includes("영재") || cat.includes("자사고") || cat.includes("과학고") || cat.includes("특목고");
        }
        if (category === "전형분석") {
          return cat.includes("전형") || cat.includes("분석") || cat.includes("배치표");
        }
        return cat.includes(category);
      });
    }
    return list;
  },

  // 2. 카테고리별 1:1 맞춤형 실시간 AI 핵심 트렌드 브리핑 배너
  renderNewsTrendSummaryHTML: function(category = "ALL") {
    const allNews = (typeof window !== 'undefined' && window.EDUCATION_NEWS_DATA && window.EDUCATION_NEWS_DATA.length > 0)
      ? window.EDUCATION_NEWS_DATA
      : (typeof EDUCATION_NEWS_DATA !== 'undefined' ? EDUCATION_NEWS_DATA : []);
    const catList = this.getFilteredNews(category);
    const catCount = category === "ALL" ? catList.length : catList.length;

    // 카테고리별 1:1 맞춤형 렌더링 분기
    if (category === "의약학" || category === "의약학/정원") {
      // 1. 의약학/정원 전용 실시간 피드 브리핑
      const latestAiPoints = (catList[0] && catList[0].aiSummary) ? catList[0].aiSummary : [
        "비수도권 의약학 계열 지역인재 60% 의무선발 안착에 따른 1.2~1.4등급대 실질 합격선 유연화.",
        "3개 영역 등급합 4~5 수준의 높은 수능최저학력기준 충족 여부가 실질 경쟁률(20:1 ➔ 3:1)의 결정타.",
        "수도권 전국선발은 N수생과 국수탐 백분위 290점대 이상 극상위권 간의 초박빙 승부처 형성."
      ];
      const susiImp = (catList[0] && catList[0].impactAnalysis) ? catList[0].impactAnalysis.susi : "비수도권 내신 1등급 초중반 학생은 지역인재 전형의 높은 수능최저를 방어할 경우 합격 확률 극대화.";
      const jeongsiImp = (catList[0] && catList[0].impactAnalysis) ? catList[0].impactAnalysis.jeongsi : "수도권 의약학 전국선발은 과탐 가산점 및 대학별 환산점수 유불리 정밀 계산 필수.";

      return `
        <div class="trend-summary-card">
          <div class="trend-summary-header">
            <div class="trend-title-box">
              <span class="trend-icon">🩺</span>
              <strong>[의약학/정원] 실시간 AI 핵심이슈 & 의대 증원 변동 분석</strong>
              <span class="badge-trend-count">의약학 실시간 뉴스 ${catCount}건 동기화</span>
            </div>
            <span class="trend-live-badge"><span class="pulse-dot-green"></span>실시간 피드 연동</span>
          </div>

          <div class="trend-focused-panel">
            <div class="trend-focused-row">
              <div class="trend-focus-box primary-focus">
                <div class="focus-box-title">
                  <span>🩺 의약학/정원 핵심이슈</span>
                  <span class="bullet-urgency">⚡ 실시간 집중분석</span>
                </div>
                <div class="focus-box-content">
                  <strong>의대 증원 및 지역인재 60% 안착:</strong> 비수도권 의약학 합격선이 전년 대비 0.2~0.3등급 유연화되며, 3합4~5의 높은 수능최저 충족률이 실질 합격의 결정타로 부상.
                </div>
              </div>

              <div class="trend-focus-box secondary-focus">
                <div class="focus-box-title gold">
                  <span>🤖 실시간 의약학 뉴스 피드 AI 요약</span>
                  <span style="font-size:0.75rem; color:#94a3b8;">${catList[0] ? catList[0].source : '의학전문'} 최신보도</span>
                </div>
                <ul class="trend-live-feed-list">
                  ${latestAiPoints.map(pt => `<li class="trend-live-feed-item">${pt}</li>`).join('')}
                </ul>
              </div>
            </div>

            <div class="trend-impact-bar">
              <div class="trend-impact-pill">
                <strong>[수시 전략]</strong> ${susiImp}
              </div>
              <div class="trend-impact-pill jeongsi">
                <strong>[정시 전략]</strong> ${jeongsiImp}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (category === "전형분석") {
      // 2. 전형분석 전용 실시간 피드 브리핑 (사탐런 폭증 + 무전공 확대 동시 반영)
      const latestAiPoints = (catList[0] && catList[0].aiSummary) ? catList[0].aiSummary : [
        "수시모집 마감 경쟁률 및 정시 가·나·다군 배치표 분석: 상위권 첨단학과 및 다군 지원 쏠림 관측.",
        "대학별 수능 영역별 반영비율(수학 35~40% 고반영 대학 vs 국어 고반영 대학)에 따른 환산점수 유불리 심화.",
        "전년도 70% Cut 및 5개년 추가합격 충원율 분석을 바탕으로 안정 1장, 적정 2장, 소신 3장 포트폴리오 권장."
      ];
      const susiImp = (catList[0] && catList[0].impactAnalysis) ? catList[0].impactAnalysis.susi : "경쟁률 급등 학과라도 수능최저 충족률과 전년도 충원율을 교차 검증하여 실질 합격선 진단 필요.";
      const jeongsiImp = (catList[0] && catList[0].impactAnalysis) ? catList[0].impactAnalysis.jeongsi : "군별 이동 경로(가군 고려대/연세대 ↔ 나군 서울대 ↔ 다군 성균관대/중앙대)에 따른 충원합격 회차 증가 기대.";

      return `
        <div class="trend-summary-card">
          <div class="trend-summary-header">
            <div class="trend-title-box">
              <span class="trend-icon">📊</span>
              <strong>[전형분석] 실시간 수능 변수 & 지원 전략 AI 브리핑</strong>
              <span class="badge-trend-count">전형분석 실시간 뉴스 ${catCount}건 동기화</span>
            </div>
            <span class="trend-live-badge"><span class="pulse-dot-green"></span>실시간 피드 연동</span>
          </div>

          <div class="trend-focused-panel">
            <div class="trend-focused-row">
              <div class="trend-focus-box primary-focus">
                <div class="focus-box-title">
                  <span>📊 수능 & 전형분석 주목변수</span>
                  <span class="bullet-urgency">⚡ 변별력 변수</span>
                </div>
                <div class="focus-box-content">
                  <strong>'사탐런' 폭증(69.6%)과 탐구 변별력:</strong> 자연계열 수능최저 충족 모수 감소로 수시 실질 경쟁률 하락 전망. 정시 가·나·다군 배치표에서 사탐 가산점 대학별 유불리 계산 필수.
                </div>
              </div>

              <div class="trend-focus-box secondary-focus">
                <div class="focus-box-title gold">
                  <span>🏛 정책/전문대 지원전략</span>
                  <span class="bullet-urgency">⚡ 정원 재편</span>
                </div>
                <div class="focus-box-content">
                  <strong>무전공 정원 확대 & 전문대 수시 1차 접수:</strong> 4년제 대입 6회 제한에 미포함되는 전문대 보건/특화계열 안정 지원 선호 및 수도권 주요 15개대 자율전공 합격선 분산 심화.
                </div>
              </div>
            </div>

            <div class="trend-focus-box" style="background:rgba(15,23,42,0.5);">
              <div class="focus-box-title" style="color:#a5b4fc;">
                <span>🤖 최신 전형분석 기사 AI 심층 피드</span>
                <span style="font-size:0.75rem; color:#94a3b8;">${catList[0] ? catList[0].source : '입시평가소'} 연동</span>
              </div>
              <ul class="trend-live-feed-list">
                ${latestAiPoints.map(pt => `<li class="trend-live-feed-item">${pt}</li>`).join('')}
              </ul>
            </div>

            <div class="trend-impact-bar">
              <div class="trend-impact-pill">
                <strong>[수시 전략]</strong> ${susiImp}
              </div>
              <div class="trend-impact-pill jeongsi">
                <strong>[정시 전략]</strong> ${jeongsiImp}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (category === "수능/모의평가") {
      const latestAiPoints = (catList[0] && catList[0].aiSummary) ? catList[0].aiSummary : [
        "영역별 응시자 변동('사탐런' 및 과탐 응시자 규모)으로 인한 등급 컷 변화 및 킬러문항 배제 난이도 적중.",
        "국어·수학 공통과목 난이도와 선택과목별 표준점수 최고점 격차가 수험생들의 유불리를 가르는 핵심 변수로 작용.",
        "자연계열 및 의약학 수능최저학력기준(1~2등급 확보) 충족 인원 변화로 수시 실질 경쟁률에 직접적 영향."
      ];
      return `
        <div class="trend-summary-card">
          <div class="trend-summary-header">
            <div class="trend-title-box">
              <span class="trend-icon">🎯</span>
              <strong>[수능/모의평가] 실시간 출제경향 & 등급컷 변수 AI 브리핑</strong>
              <span class="badge-trend-count">수능/모평 실시간 뉴스 ${catCount}건 동기화</span>
            </div>
            <span class="trend-live-badge"><span class="pulse-dot-green"></span>실시간 피드 연동</span>
          </div>
          <div class="trend-focused-panel">
            <div class="trend-focus-box primary-focus">
              <div class="focus-box-title">
                <span>🎯 수능/모의평가 실시간 핵심 피드</span>
                <span class="bullet-urgency">⚡ 등급컷 변동</span>
              </div>
              <ul class="trend-live-feed-list">
                ${latestAiPoints.map(pt => `<li class="trend-live-feed-item">${pt}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    if (category === "정책/제도") {
      const latestAiPoints = (catList[0] && catList[0].aiSummary) ? catList[0].aiSummary : [
        "교육부의 무전공(자율전공) 정원 확대 및 고교학점제 단계적 도입에 따라 대학별 전형 구조 대개편.",
        "수도권 주요 15개 대학의 단과대별 정원이 자율전공 학부로 대거 이동하여 일반 학과의 합격선(컷) 분산 효과 발생.",
        "대학별 5월 확정 모집요강에서 발표된 전형요소(수능 최저 완화 여부, 교과 정성평가 도입 등) 확인 필수."
      ];
      return `
        <div class="trend-summary-card">
          <div class="trend-summary-header">
            <div class="trend-title-box">
              <span class="trend-icon">🏛</span>
              <strong>[정책/제도] 교육부 대입 개편 & 무전공 정원 확대 AI 브리핑</strong>
              <span class="badge-trend-count">정책 실시간 뉴스 ${catCount}건 동기화</span>
            </div>
            <span class="trend-live-badge"><span class="pulse-dot-green"></span>실시간 피드 연동</span>
          </div>
          <div class="trend-focused-panel">
            <div class="trend-focus-box primary-focus">
              <div class="focus-box-title">
                <span>🏛 정책/제도 실시간 핵심 피드</span>
                <span class="bullet-urgency">⚡ 정원 구조조정</span>
              </div>
              <ul class="trend-live-feed-list">
                ${latestAiPoints.map(pt => `<li class="trend-live-feed-item">${pt}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    if (category === "전문대") {
      const latestAiPoints = (catList[0] && catList[0].aiSummary) ? catList[0].aiSummary : [
        "전문대학 수시 1·2차 모집은 4년제 대입 6회 지원 제한에 포함되지 않아 안정형 전략 카드로 집중 활용됨.",
        "수도권 삼육보건대, 인하공전 등 간호·보건 및 반도체/모빌리티 특화 학과 중심 지원율 전년 대비 상승.",
        "대학별로 학생부 우수 1~2개 학기만을 선택 반영하는 대학이 많아 내신 성적 역전 기회 다수 존재."
      ];
      return `
        <div class="trend-summary-card">
          <div class="trend-summary-header">
            <div class="trend-title-box">
              <span class="trend-icon">🏫</span>
              <strong>[전문대] 수시 1·2차 일정 & 특화학과 지원전략 AI 브리핑</strong>
              <span class="badge-trend-count">전문대 실시간 뉴스 ${catCount}건 동기화</span>
            </div>
            <span class="trend-live-badge"><span class="pulse-dot-green"></span>실시간 피드 연동</span>
          </div>
          <div class="trend-focused-panel">
            <div class="trend-focus-box primary-focus">
              <div class="focus-box-title">
                <span>🏫 전문대학 실시간 핵심 피드</span>
                <span class="bullet-urgency">⚡ 6회 제한 제외</span>
              </div>
              <ul class="trend-live-feed-list">
                ${latestAiPoints.map(pt => `<li class="trend-live-feed-item">${pt}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    if (category === "고입뉴스" || category === "고입/특목고") {
      const latestAiPoints = (catList[0] && catList[0].aiSummary) ? catList[0].aiSummary : [
        "2028 고교학점제 전면 도입 및 내신 5등급제(1등급 10%) 개편에 따른 특목·자사고 내신 부담 완화 및 선호도 급상승.",
        "전국단위 자사고(하나고·상산고·외대부고) 및 주요 외고·국제고 자기주도학습 전형 면접 변별력 대폭 강화.",
        "중3 학생은 1학기 내신 성취도 A 확보 및 학생부 세특 탐구 활동 연계성 집중 관리가 합격의 핵심 열쇠."
      ];
      const susiImp = (catList[0] && catList[0].impactAnalysis) ? catList[0].impactAnalysis.susi : "중학교 3학년 1·2학기 주요 교과(국영수사과) 성취도 A 유지 및 자기주도 면접 구술 준비.";
      const jeongsiImp = (catList[0] && catList[0].impactAnalysis) ? catList[0].impactAnalysis.jeongsi : "2028 통합수능(공통 국어·수학·사탐·과탐) 체제에서 특목·자사고의 수능 심화 학습 경쟁력 지속 전망.";

      return `
        <div class="trend-summary-card">
          <div class="trend-summary-header">
            <div class="trend-title-box">
              <span class="trend-icon">🏫</span>
              <strong>[고입뉴스] 실시간 특목·자사고·영재고 전형 & 2028 고교학점제 AI 브리핑</strong>
              <span class="badge-trend-count">고입 실시간 뉴스 ${catCount}건 동기화</span>
            </div>
            <span class="trend-live-badge"><span class="pulse-dot-green"></span>실시간 피드 연동</span>
          </div>

          <div class="trend-focused-panel">
            <div class="trend-focused-row">
              <div class="trend-focus-box primary-focus">
                <div class="focus-box-title">
                  <span>🏫 2028 고교학점제 & 특목·자사고 핵심이슈</span>
                  <span class="bullet-urgency">⚡ 내신 5등급제</span>
                </div>
                <div class="focus-box-content">
                  <strong>내신 5등급제(1등급 10%) 전환 효과:</strong> 과거 9등급제(1등급 4%) 대비 특목고·자사고의 내신 불이익이 대폭 완화되면서, 교육특구 및 전국단위 자사고 지원 쏠림 현상 가속화.
                </div>
              </div>

              <div class="trend-focus-box secondary-focus">
                <div class="focus-box-title gold">
                  <span>📰 교육을 비추다 & 네이버 고입 심층 피드</span>
                  <span style="font-size:0.75rem; color:#94a3b8;">${catList[0] ? catList[0].source : '고입전문'} 연동</span>
                </div>
                <ul class="trend-live-feed-list">
                  ${latestAiPoints.map(pt => `<li class="trend-live-feed-item">${pt}</li>`).join('')}
                </ul>
              </div>
            </div>

            <div class="trend-impact-bar">
              <div class="trend-impact-pill">
                <strong>[자기주도 전형 전략]</strong> ${susiImp}
              </div>
              <div class="trend-impact-pill jeongsi">
                <strong>[2028 대입 연계 전략]</strong> ${jeongsiImp}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // 기본: ALL (전체 뉴스 종합 3줄 브리핑)
    return `
      <div class="trend-summary-card">
        <div class="trend-summary-header">
          <div class="trend-title-box">
            <span class="trend-icon">⚡</span>
            <strong>실시간 입시 뉴스 AI 3줄 종합 핵심 트렌드 브리핑</strong>
            <span class="badge-trend-count">전체 ${catCount}건 실시간 분석</span>
          </div>
          <span class="trend-live-badge"><span class="pulse-dot-green"></span>실시간 분석 완료</span>
        </div>
        <div class="trend-bullets-grid">
          <div class="trend-bullet-card">
            <div class="bullet-card-header">
              <span class="bullet-tag-pill tag-med">🩺 의약학/정원</span>
              <span class="bullet-urgency">핵심이슈</span>
            </div>
            <p><strong>의대 증원 및 지역인재 60% 안착:</strong> 비수도권 의약학 합격선이 전년 대비 0.2~0.3등급 유연화되며, 3합4~5의 높은 수능최저 충족률이 실질 합격의 결정타로 부상.</p>
          </div>
          <div class="trend-bullet-card">
            <div class="bullet-card-header">
              <span class="bullet-tag-pill tag-exam">📊 수능 & 전형분석</span>
              <span class="bullet-urgency">주목변수</span>
            </div>
            <p><strong>'사탐런' 폭증(69.6%)과 탐구 변별력:</strong> 자연계열 수능최저 충족 모수 감소로 수시 실질 경쟁률 하락 전망. 정시 가·나·다군 배치표에서 사탐 가산점 대학별 유불리 계산 필수.</p>
          </div>
          <div class="trend-bullet-card">
            <div class="bullet-card-header">
              <span class="bullet-tag-pill tag-univ">🏛 정책/전문대</span>
              <span class="bullet-urgency">지원전략</span>
            </div>
            <p><strong>무전공 정원 확대 & 전문대 수시 1차 접수:</strong> 4년제 대입 6회 제한에 미포함되는 전문대 보건/특화계열 안정 지원 선호 및 수도권 주요 15개대 자율전공 합격선 분산 심화.</p>
          </div>
        </div>
      </div>
    `;
  },

  // 3. 페이지네이션된 뉴스 카드 목록 렌더링
  renderNewsListHTML: function(category = "ALL", page = 1, pageSize = 4) {
    const list = this.getFilteredNews(category);

    if (list.length === 0) {
      return `
        <div class="empty-news-box" style="text-align:center; padding:3rem 1.5rem; background:var(--bg-glass-card); border:1px dashed var(--border-glass); border-radius:var(--radius-lg); color:var(--text-muted);">
          <div style="font-size:2rem; margin-bottom:0.8rem;">📰</div>
          <p style="font-size:1rem; font-weight:600; color:var(--text-main); margin-bottom:0.4rem;">해당 카테고리의 최신 뉴스를 준비 중입니다.</p>
          <p style="font-size:0.85rem; margin-bottom:1rem;">상단의 <strong>[🔄 실시간 뉴스 자동 업데이트]</strong> 버튼을 누르면 실시간 크롤링 파이프라인이 즉시 가동됩니다.</p>
        </div>
      `;
    }

    const startIndex = (page - 1) * pageSize;
    const pagedList = list.slice(startIndex, startIndex + pageSize);

    return pagedList.map(news => {
      const originalLinkHtml = news.link && news.link !== '#'
        ? `<a href="${news.link}" target="_blank" rel="noopener noreferrer" class="link-original-article" title="언론사 원문 기사 열기">기사 원문 ↗</a>`
        : '';

      return `
        <article class="news-card ${news.urgency === 'HIGH' ? 'urgent' : ''}" id="${news.id}">
          <div class="news-header">
            <span class="news-cat">${news.category}</span>
            <span class="news-source">${news.source}</span>
            <span class="news-time">${news.publishedAt}</span>
            ${news.urgency === 'HIGH' ? '<span class="badge-urgent">🔥 속보/핵심이슈</span>' : ''}
            <div style="margin-left:auto; display:flex; align-items:center; gap:0.6rem;">
              ${originalLinkHtml}
            </div>
          </div>

          <h3 class="news-title">${news.title}</h3>

          <!-- AI 3줄 핵심 브리핑 박스 -->
          <div class="ai-briefing-box">
            <div class="ai-box-title">
              <span class="ai-icon">✨</span>
              <strong>AI 입시 연구원 3줄 핵심 브리핑</strong>
            </div>
            <ul class="ai-summary-list">
              ${(news.aiSummary || []).map(bullet => `<li>${bullet}</li>`).join('')}
            </ul>
          </div>

          <!-- 수시 & 정시 영향도 분석 -->
          <div class="impact-grid">
            <div class="impact-card susi-impact">
              <span class="impact-badge">수시 영향도</span>
              <p>${news.impactAnalysis ? news.impactAnalysis.susi : '수시 전형 요소 변동 확인 필요'}</p>
            </div>
            <div class="impact-card jeongsi-impact">
              <span class="impact-badge">정시 영향도</span>
              <p>${news.impactAnalysis ? news.impactAnalysis.jeongsi : '정시 군별 배치표 유불리 분석 필요'}</p>
            </div>
          </div>

          <!-- 관련 키워드 태그 -->
          <div class="news-tags">
            ${(news.relatedKeywords || []).map(k => `<span class="tag-chip">#${k}</span>`).join('')}
          </div>
        </article>
      `;
    }).join('');
  },

  // 4. 뉴스 페이지네이션 바 HTML (2번 사진 스타일: 원형 이전/다음 버튼 + 수평 숫자 나열)
  renderNewsPaginationHTML: function(category = "ALL", currentPage = 1, pageSize = 4) {
    const list = this.getFilteredNews(category);
    const totalCount = list.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    if (totalPages <= 1) {
      return '';
    }

    let pageBtnsHtml = '';
    const maxButtons = 10;
    let startPage = 1;
    let endPage = Math.min(totalPages, maxButtons);
    if (totalPages > maxButtons) {
      startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      endPage = Math.min(totalPages, startPage + maxButtons - 1);
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
    }

    for (let p = startPage; p <= endPage; p++) {
      pageBtnsHtml += `
        <button type="button" class="news-page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">
          ${p}
        </button>
      `;
    }

    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;

    return `
      <div class="news-pagination-wrapper">
        <button type="button" class="news-page-nav-btn prev-btn" data-page="${prevPage}" ${currentPage === 1 ? 'disabled' : ''} aria-label="이전 페이지">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="news-page-numbers">
          ${pageBtnsHtml}
        </div>
        <button type="button" class="news-page-nav-btn next-btn" data-page="${nextPage}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="다음 페이지">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;
  },

  // 대입 & 고입 통합 타임라인 렌더링
  renderTimelineHTML: function() {
    const mode = this.currentTimelineMode;
    const year = this.currentTimelineYear;
    const categoryFilter = this.currentTimelineCategory;

    let dataset = [];
    if (mode === 'HIGHSCHOOL') {
      dataset = (typeof HIGHSCHOOL_SCHEDULE_DATA_BY_YEAR !== 'undefined' && HIGHSCHOOL_SCHEDULE_DATA_BY_YEAR[year])
        ? HIGHSCHOOL_SCHEDULE_DATA_BY_YEAR[year]
        : [];
    } else {
      dataset = (typeof ADMISSION_SCHEDULE_DATA_BY_YEAR !== 'undefined' && ADMISSION_SCHEDULE_DATA_BY_YEAR[year])
        ? ADMISSION_SCHEDULE_DATA_BY_YEAR[year]
        : (typeof ADMISSION_SCHEDULE_DATA !== 'undefined' ? ADMISSION_SCHEDULE_DATA : []);
    }

    if (categoryFilter === 'CHANGED') {
      dataset = dataset.filter(item => item.isChanged);
    } else if (categoryFilter !== 'ALL') {
      dataset = dataset.filter(item => {
        return (item.category && item.category.includes(categoryFilter)) || 
               (item.type && item.type.includes(categoryFilter));
      });
    }

    if (dataset.length === 0) {
      return `
        <div style="text-align:center; padding:2rem 1rem; color:var(--text-muted); font-size:0.9rem;">
          해당 조건의 전형 일정이 없습니다. 필터를 변경해주세요.
        </div>
      `;
    }

    // 일정 카드 HTML 빌드
    const itemsHtml = dataset.map(item => {
      const status = CalendarManager.getEventStatus(item.date, item.endDate);

      let ddayBadgeHtml = '';
      if (status.status === 'ACTIVE') {
        ddayBadgeHtml = `
          <div class="timeline-dday status-active" title="현재 원서접수 또는 전형 진행 중입니다">
            <span class="pulse-indicator"></span>
            <strong>접수중</strong>
            <small>${status.subText}</small>
          </div>
        `;
      } else if (status.status === 'CLOSED') {
        ddayBadgeHtml = `
          <div class="timeline-dday status-closed" title="마감된 일정입니다">
            <strong>마감</strong>
            <small>${status.subText}</small>
          </div>
        `;
      } else if (status.status === 'TODAY') {
        ddayBadgeHtml = `
          <div class="timeline-dday status-today" title="오늘 시작되는 일정입니다">
            <strong>D-DAY</strong>
            <small>오늘</small>
          </div>
        `;
      } else {
        ddayBadgeHtml = `
          <div class="timeline-dday ${status.isUrgent ? 'status-urgent' : 'status-upcoming'}" title="${status.badgeText}">
            <strong>${status.badgeText}</strong>
            <small>${status.subText}</small>
          </div>
        `;
      }

      const isRange = item.endDate && item.endDate !== item.date;
      const dateDisplay = isRange ? `${item.date} ~ ${item.endDate}` : item.date;

      const isChanged = Boolean(item.isChanged);

      return `
        <div class="timeline-item ${status.status.toLowerCase()} ${item.highlight ? 'item-highlight' : ''} ${isChanged ? 'is-changed' : ''}">
          ${ddayBadgeHtml}
          <div class="timeline-info">
            <div class="timeline-title">
              <strong>${item.event}</strong>
              ${isChanged ? `<span class="badge-changed-yellow" title="5월 확정 요강 또는 교육부 변경공고로 일정이 수정되었습니다">⚠️ 일정 변경됨</span>` : ''}
              <span class="badge-sched-type ${item.type === '4년제' ? 'badge-type-4y' : (item.type === '전문대' ? 'badge-type-23y' : 'badge-type-hs')}">${item.type}</span>
              ${item.category ? `<span class="badge-sched-cat">${item.category}</span>` : ''}
            </div>
            <div class="timeline-date">
              <span class="cal-icon">🗓</span> ${dateDisplay}
            </div>
            ${isChanged ? `
              <div class="timeline-change-banner">
                <div class="change-banner-header">
                  <span class="change-tag-yellow">⚡ 일정 변경 안내</span>
                  <span class="change-dates">
                    ${item.previousDate ? `<del class="prev-date">${item.previousDate}</del> ➔ ` : ''}
                    <strong class="curr-date">${dateDisplay} 확정</strong>
                  </span>
                </div>
                ${item.changeReason ? `<div class="change-reason-text">💡 ${item.changeReason}</div>` : ''}
              </div>
            ` : ''}
            ${item.note ? `<div class="timeline-note">${item.note}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="timeline-items-wrapper">
        ${itemsHtml}
      </div>
    `;
  },

  // 입시 AI 챗봇 응답 처리 (대입 + 고입 지식 확장)
  getAiChatResponse: function(userMessage) {
    const trimmed = userMessage.trim();
    if (!trimmed) return "질문 내용을 입력해주세요. (예: '수시 6회 제한은 전문대에도 적용되나요?', '고입 전기고와 후기고 차이가 뭔가요?', '영재학교 접수는 언제인가요?')";

    // 고입 관련 키워드 응답
    if (/(고입|하이스쿨|영재학교|영재고|과학고|과고|자사고|외고|국제고|마이스터고|특성화고|전기고|후기고)/.test(trimmed)) {
      if (/(영재학교|영재고)/.test(trimmed)) {
        return "🏫 [전국 영재학교 8개교 입시 안내]\n" +
          "• 대상: 서울과고, 경기과고, 한국과학영재학교, 대전/대구/광주과고, 세종/인천예술영재\n" +
          "• 전형 시기: 매년 5월 말~6월 초 원서접수 ➔ 7월 중 2단계 지필평가(영재성 검사) ➔ 8월 캠프 및 최종발표\n" +
          "• 핵심 룰: 8개 영재학교 중 단 1곳만 지원 가능(중복지원 금지). 불합격 시 8월 말 전기 과학고에 지원할 수 있습니다!";
      }
      if (/(과학고|과고)/.test(trimmed)) {
        return "🔬 [전국 20개 과학고 전기 전형 안내]\n" +
          "• 전형 시기: 8월 하순 원서접수 ➔ 9~11월 출석면담 및 서류평가 ➔ 11월 말 소집면접 ➔ 12월 초 최종합격\n" +
          "• 선발 방식: 자기주도학습전형(수학·과학 내신 및 열정 평가). 광역 단위 모집(거주 시·도 과학고 지원 원칙).\n" +
          "• 주의사항: 전기 과학고 합격 시 후기 외고·자사고·일반고 지원이 불가합니다.";
      }
      if (/(자사고|외고|국제고)/.test(trimmed)) {
        return "🏛 [후기 자사고·외고·국제고 입시 안내]\n" +
          "• 전형 시기: 매년 12월 초 원서접수 ➔ 12월 중 면접 ➔ 12월 말 합격자 발표\n" +
          "• 전국단위 자사고(하나고, 외대부고, 상산고, 민사고 등 10개교)와 광역자사고, 외고·국제고가 후기전형으로 진행됩니다.\n" +
          "• 일반고 동시지원: 자사고·외고 탈락 시 교육감 선발 후기 일반고(2지망 이하) 배정 기회가 부여됩니다.";
      }
      if (/(전기고.*후기고|전기.*후기|차이)/.test(trimmed)) {
        return "⚖️ [고등학교 입학 전형: 전기고 vs 후기고 비교]\n" +
          "1. 전기고(8~11월): 과학고, 마이스터고, 예술·체육고, 특성화고. 학교장 선발로 1개교만 지원 가능.\n" +
          "2. 후기고(12~1월): 자율형사립고(자사고), 외국어고, 국제고, 일반고, 자공고.\n" +
          "3. 이중지원 절대 금지: 전기고에 합격하면 등록을 포기하더라도 후기고에 지원할 수 없습니다.";
      }
      return "🏫 [고입 정보 종합 안내 (하이스쿨 https://www.hischool.go.kr/#)]\n" +
        "고교 입시는 특차(영재학교 5월) ➔ 전기고(과학고 8월, 마이스터/특성화고 10~11월) ➔ 후기고(자사고/외고/국제고/일반고 12월) 순으로 진행됩니다.\n" +
        "우측 상단 캘린더에서 [🏫 고입] 탭을 클릭하시면 세부 학교별 원서접수 및 면접 일정을 한눈에 확인하실 수 있습니다.";
    }

    // 대입 지식 베이스 패턴 매칭
    for (const item of (typeof ADMISSION_AI_KNOWLEDGE !== 'undefined' ? ADMISSION_AI_KNOWLEDGE : [])) {
      if (item.pattern.test(trimmed)) {
        return item.answer;
      }
    }

    // 대학 이름 질의 응답
    const allUnivs = [...(typeof UNIVERSITIES_4Y_DATA !== 'undefined' ? UNIVERSITIES_4Y_DATA : []),
                      ...(typeof COLLEGES_23Y_DATA !== 'undefined' ? COLLEGES_23Y_DATA : [])];
    const found = allUnivs.find(u => trimmed.includes(u.univName));
    if (found) {
      const y26 = found.years["2026"] || found.years["2025"];
      return `[${found.univName} ${found.department}] 2026학년도 정보 안내입니다:\n` +
             `• 전형: ${found.admissionType} (${found.subType})\n` +
             `• 모집정원: ${y26.recruitQuota}명 (경쟁률 ${y26.competitionRate}:1)\n` +
             `• 70% Cut: ${y26.cut70} (충원율 ${y26.fillRate}%)\n` +
             `• 수능최저/조건: ${y26.minGradeReq}\n` +
             (y26.isMayChanged ? `• 5월 변동사항: ${y26.changeNote}\n` : '') +
             `• 대학알리미 취업률: ${found.infoAlimi.employmentRate}%`;
    }

    // 기본 가이드
    return `질문하신 내용("[${trimmed}]")을 분석하였습니다. 대학명(예: 서울대, 연세대, 삼육보건대 등)이나 고입 학교 유형('영재고', '자사고', '과학고'), 입시 용어('이월인원', '70% 컷', '수능최저')를 입력하시면 맞춤형 데이터를 즉시 안내해 드립니다.`;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NewsEngine };
}
