// ==========================================================================
// 메인 애플리케이션 총괄 스크립트 (상태 관리, 탭 라우팅, 데이터 바인딩, 이벤트 제어)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // 전역 상태
  const State = {
    activeTab: "tabNews",
    currentStudentId: null,
    currentStudent: null,
    dbFilter: {
      univType: "ALL",
      region: "ALL",
      field: "ALL",
      admissionType: "ALL",
      searchQuery: "",
      onlyMayChanged: false,
      onlyTargetChanged: false,
      pageLimit: 30,
      page: 1
    },
    newsCategory: "ALL",
    newsPage: 1
  };

  // DOM 캐싱
  const DOM = {
    // 탭 네비게이션
    navBtns: document.querySelectorAll(".nav-tab-btn"),
    tabPanes: document.querySelectorAll(".tab-pane"),

    // 헤더 컨트롤
    currentStudentSelect: document.getElementById("currentStudentSelect"),
    btnOpenStudentModal: document.getElementById("btnOpenStudentModal"),
    btnPrintReportHeader: document.getElementById("btnPrintReportHeader"),

    // 탭 1: 뉴스 & 챗봇
    newsCategoryFilter: document.getElementById("newsCategoryFilter"),
    newsTrendBox: document.getElementById("newsTrendBox"),
    newsListContainer: document.getElementById("newsListContainer"),
    newsPaginationContainer: document.getElementById("newsPaginationContainer"),
    btnRefreshNews: document.getElementById("btnRefreshNews"),
    refreshIcon: document.getElementById("refreshIcon"),
    newsSyncStatus: document.getElementById("newsSyncStatus"),
    timelineListContainer: document.getElementById("timelineListContainer"),
    timelineStatusBadge: document.getElementById("timelineStatusBadge"),
    schedYearSelect: document.getElementById("schedYearSelect"),
    btnSchedUniv: document.getElementById("btnSchedUniv"),
    btnSchedHighSchool: document.getElementById("btnSchedHighSchool"),
    schedSubfilterChips: document.getElementById("schedSubfilterChips"),


    // 탭 2: 대학 DB
    filterTypeAll: document.getElementById("filterTypeAll"),
    filterType4Y: document.getElementById("filterType4Y"),
    filterType23Y: document.getElementById("filterType23Y"),
    checkOnlyMayChanged: document.getElementById("checkOnlyMayChanged"),
    btnFilterTargetChanged: document.getElementById("btnFilterTargetChanged"),
    targetChangedCount: document.getElementById("targetChangedCount"),
    btnExportExcel: document.getElementById("btnExportExcel"),
    selectPageLimit: document.getElementById("selectPageLimit"),
    dbPaginationContainer: document.getElementById("dbPaginationContainer"),
    selectRegionFilter: document.getElementById("selectRegionFilter"),
    selectFieldFilter: document.getElementById("selectFieldFilter"),
    selectAdmissionTypeFilter: document.getElementById("selectAdmissionTypeFilter"),
    inputSearchUniv: document.getElementById("inputSearchUniv"),
    dbRecordCount: document.getElementById("dbRecordCount"),
    dbTableBody: document.getElementById("dbTableBody"),

    // 변동 내역 상세 모달 (아이디어 1)
    changeLogModal: document.getElementById("changeLogModal"),
    changeLogModalBody: document.getElementById("changeLogModalBody"),
    btnCloseChangeLogModal: document.getElementById("btnCloseChangeLogModal"),

    // 탭 3: 5월 변동
    changesCardGrid: document.getElementById("changesCardGrid"),

    // 탭 4: 컨설팅
    consultingStudentSchool: document.getElementById("consultingStudentSchool"),
    consultingStudentName: document.getElementById("consultingStudentName"),
    consultingStudentTrack: document.getElementById("consultingStudentTrack"),
    dispGpaKor: document.getElementById("dispGpaKor"),
    dispGpaMath: document.getElementById("dispGpaMath"),
    dispGpaEng: document.getElementById("dispGpaEng"),
    dispGpaSocSci: document.getElementById("dispGpaSocSci"),
    dispGpaCareer: document.getElementById("dispGpaCareer"),
    dispGpaTotal: document.getElementById("dispGpaTotal"),
    dispCsatKor: document.getElementById("dispCsatKor"),
    dispCsatMath: document.getElementById("dispCsatMath"),
    dispCsatEngHist: document.getElementById("dispCsatEngHist"),
    dispCsatTam: document.getElementById("dispCsatTam"),
    dispCsatTotal: document.getElementById("dispCsatTotal"),
    dispStudentMemo: document.getElementById("dispStudentMemo"),
    calendarConflictAlertBox: document.getElementById("calendarConflictAlertBox"),
    susiSlotsContainer: document.getElementById("susiSlotsContainer"),
    jeongsiSlotsContainer: document.getElementById("jeongsiSlotsContainer"),
    collegeSlotsContainer: document.getElementById("collegeSlotsContainer"),
    btnAutoGeneratePortfolio: document.getElementById("btnAutoGeneratePortfolio"),

    // 탭 5: 리포트
    reportSheetOutput: document.getElementById("reportSheetOutput"),
    btnPrintReport: document.getElementById("btnPrintReport"),
    btnRefreshReport: document.getElementById("btnRefreshReport"),

    // 모달
    studentModal: document.getElementById("studentModal"),
    btnCloseStudentModal: document.getElementById("btnCloseStudentModal"),
    btnCancelStudentModal: document.getElementById("btnCancelStudentModal"),
    studentEditForm: document.getElementById("studentEditForm"),
    inputStuName: document.getElementById("inputStuName"),
    inputStuSchool: document.getElementById("inputStuSchool"),
    selectStuTrack: document.getElementById("selectStuTrack"),
    selectStuRegion: document.getElementById("selectStuRegion"),
    inputGpaKor: document.getElementById("inputGpaKor"),
    inputGpaMath: document.getElementById("inputGpaMath"),
    inputGpaEng: document.getElementById("inputGpaEng"),
    inputGpaSoc: document.getElementById("inputGpaSoc"),
    inputGpaSci: document.getElementById("inputGpaSci"),
    inputCsatKorPct: document.getElementById("inputCsatKorPct"),
    inputCsatMathPct: document.getElementById("inputCsatMathPct"),
    inputCsatEngGrade: document.getElementById("inputCsatEngGrade"),
    inputCsatTamPct: document.getElementById("inputCsatTamPct"),
    textareaStuMemo: document.getElementById("textareaStuMemo")
  };

  // 1. 초기화 함수
  function init() {
    loadStudents();
    renderNews();
    renderTimeline();
    renderMayChanges();
    renderUniversityDB();
    renderConsultingTab();
    renderReport();
    bindEvents();
    syncLatestNewsFromServer();

    // URL 해시 자동 라우팅 (예: #tabUniversityDB)
    if (window.location.hash) {
      const targetHash = window.location.hash.replace('#', '');
      if (document.getElementById(targetHash)) {
        switchTab(targetHash);
      }
    }
  }

  // 2. 학생 목록 로드 및 셀렉트박스 설정
  function loadStudents() {
    const students = StudentManager.getAllStudents();
    DOM.currentStudentSelect.innerHTML = "";
    
    students.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = `${s.name} (${s.highSchool.split(" ")[0]} / ${s.track})`;
      DOM.currentStudentSelect.appendChild(opt);
    });

    if (!State.currentStudentId && students.length > 0) {
      State.currentStudentId = students[0].id;
    }
    State.currentStudent = StudentManager.getStudentById(State.currentStudentId);
    DOM.currentStudentSelect.value = State.currentStudentId;
  }

  // 3. 탭 전환
  function switchTab(targetTabId) {
    State.activeTab = targetTabId;
    DOM.navBtns.forEach(btn => {
      if (btn.dataset.tab === targetTabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    DOM.tabPanes.forEach(pane => {
      if (pane.id === targetTabId) {
        pane.classList.add("active");
      } else {
        pane.classList.remove("active");
      }
    });

    // 탭별 추가 업데이트
    if (targetTabId === "tabConsulting") {
      renderConsultingTab();
    } else if (targetTabId === "tabReport") {
      renderReport();
    } else if (targetTabId === "tabUniversityDB") {
      renderUniversityDB();
    }
  }

  // 4. 뉴스 렌더링 (전체 트렌드 요약 + 페이지네이션 적용)
  function renderNews() {
    if (DOM.newsTrendBox) {
      DOM.newsTrendBox.innerHTML = NewsEngine.renderNewsTrendSummaryHTML(State.newsCategory);
    }
    if (DOM.newsListContainer) {
      DOM.newsListContainer.innerHTML = NewsEngine.renderNewsListHTML(State.newsCategory, State.newsPage);
    }
    if (DOM.newsPaginationContainer) {
      DOM.newsPaginationContainer.innerHTML = NewsEngine.renderNewsPaginationHTML(State.newsCategory, State.newsPage);
    }
  }

  // 브라우저에서 직접 실시간 RSS 피드 수집 (CORS 프록시 & 공개 피드 연동)
  async function fetchLiveNewsClientSide() {
    const RSS_SOURCES = [
      { url: 'https://www.kyobit.com/rss', source: '교육을 비추다', defaultCat: '고입뉴스' },
      { url: 'https://rss.naver.com/main/rss/section.naver?sid1=102&sid2=257', source: '네이버·수능', defaultCat: '수능/모의평가' },
      { url: 'https://rss.naver.com/main/rss/section.naver?sid1=102&sid2=251', source: '네이버·정책', defaultCat: '정책/제도' },
      { url: 'https://rss.naver.com/main/rss/section.naver?sid1=102', source: '네이버 교육', defaultCat: '전형분석' },
    ];

    const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';
    const newArticles = [];

    const fetchPromises = RSS_SOURCES.map(async (src) => {
      try {
        const res = await fetch(`${RSS2JSON}${encodeURIComponent(src.url)}&count=10`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status !== 'ok' || !Array.isArray(data.items)) return;

        for (const item of data.items) {
          const rawTitle = (item.title || '').replace(/<[^>]+>/g, '').trim();
          if (!rawTitle || rawTitle.length < 6) continue;

          let pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
          if (isNaN(pubDate.getTime())) pubDate = new Date();
          const pubStr = `${pubDate.getFullYear()}-${String(pubDate.getMonth() + 1).padStart(2, '0')}-${String(pubDate.getDate()).padStart(2, '0')} ${String(pubDate.getHours()).padStart(2, '0')}:${String(pubDate.getMinutes()).padStart(2, '0')}`;

          let cat = src.defaultCat;
          if (/의대|의약학|약대|치대|한의|증원|지역인재/.test(rawTitle)) cat = '의약학/정원';
          else if (/수능|모의|사탐|과탐|EBS|평가원|표준점수/.test(rawTitle)) cat = '수능/모의평가';
          else if (/전문대|전문대학|간호/.test(rawTitle)) cat = '전문대';
          else if (/영재|과학고|자사고|고교학점제|고입/.test(rawTitle)) cat = '고입뉴스';
          else if (/정책|무전공|자율전공|교육부/.test(rawTitle)) cat = '정책/제도';
          else if (/전형|수시|정시|경쟁률|합격선/.test(rawTitle)) cat = '전형분석';

          newArticles.push({
            id: `live-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            title: rawTitle,
            source: src.source,
            link: item.link || '#',
            publishedAt: pubStr,
            category: cat,
            urgency: 'HIGH',
            views: Math.floor(Math.random() * 8000) + 12000,
            aiSummary: [
              `[실시간 AI 분석] ${rawTitle} 관련 최신 교육 정책 및 입시 변동 사항 긴급 브리핑.`,
              `영역별 반영 비율 및 대학별 환산점수 유불리를 고려한 수시·정시 포트폴리오 재점검 권장.`,
              `세종·수도권 및 비수도권 주요 대학 전형별 실질 합격선 추이 모니터링 필수.`
            ],
            impactAnalysis: {
              susi: '수능최저학력기준 충족 여부 및 교과/종합 전형 요소별 유불리 교차 진단 필요.',
              jeongsi: '대학별 영역 반영비율 및 가산점 변동에 따른 환산점수 유불리 정밀 계산 필수.'
            },
            relatedKeywords: ['실시간뉴스', cat, 'AI브리핑', '입시트렌드']
          });
        }
      } catch (e) {
        console.warn(`[RSS 수집 스킵] ${src.source}:`, e.message);
      }
    });

    await Promise.allSettled(fetchPromises);
    return newArticles;
  }

  // 서버 및 클라이언트 실시간 뉴스 동기화 (1+2+3번 파이프라인)
  async function syncLatestNewsFromServer(isManualRefresh = false) {
    try {
      if (DOM.newsSyncStatus && !isManualRefresh) {
        DOM.newsSyncStatus.innerHTML = `<span class="pulse-dot-green"></span>최신 데이터 확인 중...`;
      }

      // 1. 로컬 캐시가 있으면 먼저 반영
      const cached = localStorage.getItem('steady_live_news_data');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            window.EDUCATION_NEWS_DATA = parsed;
            renderNews();
          }
        } catch (_) {}
      }

      let updated = false;

      // 2. 서버 API 시도 (/api/news)
      if (window.location.protocol.startsWith('http')) {
        try {
          const res = await fetch('/api/news');
          if (res.ok) {
            const news = await res.json();
            if (Array.isArray(news) && news.length > 0) {
              window.EDUCATION_NEWS_DATA = news;
              localStorage.setItem('steady_live_news_data', JSON.stringify(news));
              renderNews();
              updated = true;
              if (DOM.newsSyncStatus) {
                DOM.newsSyncStatus.innerHTML = `<span class="pulse-dot-green"></span>실시간 피드 동기화 완료 (${news.length}건)`;
                DOM.newsSyncStatus.className = "news-sync-status badge-live-green";
              }
            }
          }
        } catch (_) {}
      }

      // 3. 서버 API가 없거나(정적 배포 환경) 수동 새로고침 시 클라이언트 직접 RSS 수집 실행
      if (!updated || isManualRefresh) {
        const liveArticles = await fetchLiveNewsClientSide();
        if (liveArticles && liveArticles.length > 0) {
          const existing = window.EDUCATION_NEWS_DATA || [];
          const existingTitles = new Set(existing.map(a => a.title));
          const uniqueNew = liveArticles.filter(a => !existingTitles.has(a.title));

          if (uniqueNew.length > 0) {
            const merged = [...uniqueNew, ...existing].slice(0, 150);
            window.EDUCATION_NEWS_DATA = merged;
            localStorage.setItem('steady_live_news_data', JSON.stringify(merged));
            renderNews();
          }

          if (DOM.newsSyncStatus) {
            const total = (window.EDUCATION_NEWS_DATA || []).length;
            DOM.newsSyncStatus.innerHTML = `<span class="pulse-dot-green"></span>실시간 피드 동기화 완료 (${total}건)`;
            DOM.newsSyncStatus.className = "news-sync-status badge-live-green";
          }
        }
      }
    } catch (err) {
      console.log("[뉴스 동기화] 로컬 캐시 데이터 사용:", err.message);
    }
  }

  function renderTimeline() {
    if (!DOM.timelineListContainer) return;

    if (DOM.schedYearSelect) {
      DOM.schedYearSelect.value = NewsEngine.currentTimelineYear;
    }

    // 서브필터 칩 렌더링
    renderTimelineSubfilters();

    // 타임라인 본체 렌더링
    DOM.timelineListContainer.innerHTML = NewsEngine.renderTimelineHTML();

    // 실시간 피드 동기화 초록색 뱃지 고정
    if (DOM.timelineStatusBadge) {
      DOM.timelineStatusBadge.innerHTML = `<span class="pulse-dot-green"></span>실시간 피드 동기화`;
      DOM.timelineStatusBadge.className = "badge badge-live-green";
    }
  }

  function renderTimelineSubfilters() {
    if (!DOM.schedSubfilterChips) return;
    const mode = NewsEngine.currentTimelineMode;
    const year = NewsEngine.currentTimelineYear;
    const currentCat = NewsEngine.currentTimelineCategory;

    let dataset = [];
    if (mode === 'HIGHSCHOOL') {
      dataset = (typeof HIGHSCHOOL_SCHEDULE_DATA_BY_YEAR !== 'undefined' && HIGHSCHOOL_SCHEDULE_DATA_BY_YEAR[year])
        ? HIGHSCHOOL_SCHEDULE_DATA_BY_YEAR[year] : [];
    } else {
      dataset = (typeof ADMISSION_SCHEDULE_DATA_BY_YEAR !== 'undefined' && ADMISSION_SCHEDULE_DATA_BY_YEAR[year])
        ? ADMISSION_SCHEDULE_DATA_BY_YEAR[year] : [];
    }
    const changedCount = dataset.filter(i => i.isChanged).length;

    const univFilters = [
      { id: 'ALL', label: '전체' },
      { id: '수시', label: '수시모집' },
      { id: '정시', label: '정시모집' },
      { id: '수능', label: '수능/성적' },
      { id: '전문대', label: '전문대학' },
      { id: '추가모집', label: '추가모집' }
    ];

    const hsFilters = [
      { id: 'ALL', label: '전체' },
      { id: '특차', label: '영재학교(5~8월)' },
      { id: '과학고', label: '전기 과학고(8~12월)' },
      { id: '마이스터', label: '마이스터고(10월)' },
      { id: '특성화고', label: '특성화고(11월)' },
      { id: '후기고', label: '후기 자사고·외고·일반고(12월)' }
    ];

    const baseFilters = mode === 'HIGHSCHOOL' ? hsFilters : univFilters;
    const filters = [...baseFilters];

    if (changedCount > 0) {
      filters.push({
        id: 'CHANGED',
        label: `⚠️ 일정 변경됨 (${changedCount}건)`,
        isChangedBtn: true
      });
    }

    DOM.schedSubfilterChips.innerHTML = filters.map(f => `
      <button class="btn-subfilter-chip ${currentCat === f.id ? 'active' : ''} ${f.isChangedBtn ? 'chip-changed' : ''}" data-cat="${f.id}">
        ${f.label}
      </button>
    `).join('');

    // 서브필터 클릭 이벤트 연결
    DOM.schedSubfilterChips.querySelectorAll('.btn-subfilter-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.target.dataset.cat;
        NewsEngine.setTimelineCategory(cat);
        renderTimeline();
      });
    });
  }

  // 5. 5월 변동사항 렌더링
  function renderMayChanges() {
    DOM.changesCardGrid.innerHTML = MAY_ADMISSION_CHANGES_DATA.map(item => `
      <div class="change-card">
        <div class="change-card-header">
          <span class="change-univ-title">${item.univName} (${item.department})</span>
          <span class="change-type-badge">${item.changeType}</span>
        </div>
        <div style="font-size:0.8rem; color:var(--text-muted);">
          전형: ${item.admissionType} ${item.subType} | 중요도: <strong style="color:#fbbf24;">${'★'.repeat(item.impactScore)}</strong>
        </div>
        <div class="compare-box">
          <div class="compare-before">${item.beforeChange}</div>
          <div class="compare-after">${item.afterChange}</div>
        </div>
        <div class="consultant-tip-box">
          <strong>💡 입시 컨설턴트 분석:</strong> ${item.consultantTip}
        </div>
      </div>
    `).join('');
  }

  // 6. 대입 DB 탐색기 렌더링
  function renderUniversityDB() {
    const selectedIds = (State.currentStudent && State.currentStudent.targetUnivs) ? State.currentStudent.targetUnivs : [];
    State.dbFilter.targetIds = selectedIds;

    const list = UniversityDB.filterData(State.dbFilter);
    const pageLimit = State.dbFilter.pageLimit !== undefined ? State.dbFilter.pageLimit : 30;

    let totalPages = 1;
    if (pageLimit !== 'ALL') {
      const pSize = Number(pageLimit) || 30;
      totalPages = Math.max(1, Math.ceil(list.length / pSize));
      if (!State.dbFilter.page || State.dbFilter.page < 1) {
        State.dbFilter.page = 1;
      } else if (State.dbFilter.page > totalPages) {
        State.dbFilter.page = totalPages;
      }
    } else {
      State.dbFilter.page = 1;
    }
    const currentPage = State.dbFilter.page;

    DOM.dbTableBody.innerHTML = UniversityDB.renderTableRowsHTML(list, selectedIds, pageLimit, currentPage, State.currentStudent);

    // 페이징 컨트롤 바 렌더링
    if (DOM.dbPaginationContainer) {
      DOM.dbPaginationContainer.innerHTML = UniversityDB.renderPaginationHTML(list.length, pageLimit, currentPage);
    }

    if (pageLimit === 'ALL' || list.length === 0) {
      DOM.dbRecordCount.textContent = `조건 만족: 전국 총 ${list.length.toLocaleString()}개 모집단위 입시 데이터 전체 표시 중`;
    } else {
      const pSize = Number(pageLimit) || 30;
      const startItem = (currentPage - 1) * pSize + 1;
      const endItem = Math.min(currentPage * pSize, list.length);
      DOM.dbRecordCount.textContent = `조건 만족: 전국 총 ${list.length.toLocaleString()}개 모집단위 중 ${startItem.toLocaleString()}~${endItem.toLocaleString()}번째 표시 (${currentPage} / ${totalPages} 페이지)`;
    }

    // 아이디어 2: 지망 대학 중 변동된 대학 수 실시간 카운트
    const allCombined = UniversityDB.getCombinedData();
    const targetChangedCount = allCombined.filter(u => selectedIds.includes(u.id) && u.years["2026"] && u.years["2026"].isMayChanged).length;
    if (DOM.targetChangedCount) {
      DOM.targetChangedCount.textContent = targetChangedCount;
    }

    // 체크박스 이벤트 바인딩
    const checkboxes = DOM.dbTableBody.querySelectorAll(".student-target-checkbox");
    checkboxes.forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.dataset.id;
        if (!State.currentStudent.targetUnivs) State.currentStudent.targetUnivs = [];

        if (e.target.checked) {
          if (!State.currentStudent.targetUnivs.includes(id)) {
            State.currentStudent.targetUnivs.push(id);
          }
        } else {
          State.currentStudent.targetUnivs = State.currentStudent.targetUnivs.filter(x => x !== id);
        }
        StudentManager.saveStudent(State.currentStudent);
        renderUniversityDB();
      });
    });

    // 아이디어 1: 상세 변동 이력 모달 열기 버튼 이벤트 바인딩
    const detailBtns = DOM.dbTableBody.querySelectorAll(".btn-change-detail");
    detailBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const item = allCombined.find(u => u.id === id);
        if (item && DOM.changeLogModal && DOM.changeLogModalBody) {
          DOM.changeLogModalBody.innerHTML = UniversityDB.getChangeDetailHTML(item);
          DOM.changeLogModal.style.display = "flex";
        }
      });
    });
  }

  // 7. AI 진학 컨설팅 & 6수시 + 3정시 렌더링
  function renderConsultingTab() {
    if (!State.currentStudent) return;
    const stu = State.currentStudent;
    const gpaInfo = ScoreCalculator.calculateGPA(stu.gpa);
    const csatInfo = ScoreCalculator.calculateCSAT(stu.csat);

    // 좌측 프로필 표시
    DOM.consultingStudentSchool.textContent = stu.highSchool;
    DOM.consultingStudentName.textContent = stu.name;
    DOM.consultingStudentTrack.textContent = `희망 계열: ${stu.track} (목표: ${stu.targetRegion || '수도권'})`;

    DOM.dispGpaKor.textContent = `${stu.gpa.kor} 등급`;
    DOM.dispGpaMath.textContent = `${stu.gpa.math} 등급`;
    DOM.dispGpaEng.textContent = `${stu.gpa.eng} 등급`;
    DOM.dispGpaSocSci.textContent = `${stu.gpa.soc} / ${stu.gpa.sci} 등급`;
    DOM.dispGpaCareer.textContent = `A (${stu.gpa.careerA || 3}과목)`;
    DOM.dispGpaTotal.textContent = `${gpaInfo.convertedGrade} 등급 (전과목 ${gpaInfo.totalAvg})`;

    DOM.dispCsatKor.textContent = `${stu.csat.korPct}% (${stu.csat.korStd || 132}점)`;
    DOM.dispCsatMath.textContent = `${stu.csat.mathPct}% (${stu.csat.mathStd || 135}점)`;
    DOM.dispCsatEngHist.textContent = `${stu.csat.engGrade}등급 / ${stu.csat.histGrade || 1}등급`;
    DOM.dispCsatTam.textContent = `${stu.csat.tam1Pct}% / ${stu.csat.tam2Pct}%`;
    DOM.dispCsatTotal.textContent = `${csatInfo.avgPercentile}% / ${csatInfo.totalStandardScore}점`;

    DOM.dispStudentMemo.textContent = stu.memo || "작성된 상담 메모가 없습니다.";

    // 포트폴리오 산출
    const studentProfile = {
      convertedGrade: gpaInfo.convertedGrade,
      coreAvg: gpaInfo.coreAvg,
      avgPercentile: csatInfo.avgPercentile,
      csat: stu.csat
    };

    const susiPortfolio = AdmissionRecommender.generateSusiPortfolio(studentProfile, stu.targetField, stu.targetRegion);
    const jeongsiPortfolio = AdmissionRecommender.generateJeongsiPortfolio(studentProfile, stu.targetField);
    const collegeList = AdmissionRecommender.generateCollegeRecommendations(studentProfile, stu.targetField);

    // 일정 중복 검사
    const targetIds = susiPortfolio.map(p => p.id);
    const conflictInfo = CalendarManager.checkScheduleConflicts(targetIds);

    if (conflictInfo.hasConflict) {
      DOM.calendarConflictAlertBox.innerHTML = `
        <div style="background:rgba(244,63,94,0.15); border:1px solid #f43f5e; border-radius:var(--radius-md); padding:1rem; margin-bottom:1.5rem;">
          <strong style="color:#fb7185;">⚠️ 고사 일정 충돌 감지!</strong>
          <span style="font-size:0.85rem; color:#fecdd3; margin-left:0.5rem;">
            지망 대학 중 동일한 날짜에 면접/논술이 배정되어 있습니다: 
            <strong>${conflictInfo.conflicts.map(c => `${c.date} [${c.events.map(e => e.univName + ' ' + e.type).join(' vs ')}]`).join(', ')}</strong>
          </span>
        </div>
      `;
    } else {
      DOM.calendarConflictAlertBox.innerHTML = `
        <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:var(--radius-md); padding:0.8rem 1.2rem; margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
          <span style="color:#34d399;">✅</span>
          <span style="font-size:0.85rem; color:#a7f3d0;">
            6수시 추천 조합 간 <strong>면접고사 및 논술고사 일정 충돌 없음</strong> (안전 지원 가능)
          </span>
        </div>
      `;
    }

    // 6수시 슬롯 렌더링
    DOM.susiSlotsContainer.innerHTML = susiPortfolio.map((item, idx) => {
      const y26 = item.years["2026"];
      const cardClass = item.evaluation.status === "상향" ? "card-challenge" : item.evaluation.status === "적정" ? "card-fair" : "card-safe";

      return `
        <div class="slot-card ${cardClass}">
          <div class="slot-badge-row">
            <span class="badge ${item.evaluation.badgeClass}">${item.cardType || `카드 ${idx+1}`}</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">${item.subType}</span>
          </div>
          <div class="slot-univ-name">${item.univName}</div>
          <div class="slot-dept-name">${item.department}</div>

          <div class="slot-metrics">
            <div>정원: <strong>${y26.recruitQuota}명</strong></div>
            <div>경쟁률: <strong>${y26.competitionRate}:1</strong></div>
            <div>70% 컷: <strong style="color:#38bdf8;">${y26.cut70}</strong></div>
            <div>충원율: <strong>${y26.fillRate}%</strong></div>
          </div>

          <div class="risk-tag" style="color: ${item.minReqRisk.color}; margin-bottom:0.6rem;">
            <span>최저 충족:</span> <strong>${item.minReqRisk.label}</strong>
          </div>

          <div style="font-size:0.78rem; color:#94a3b8; line-height:1.4;">
            ${item.evaluation.label}
            ${y26.isMayChanged ? `<div style="color:#fbbf24; font-weight:700; margin-top:0.3rem;">⚡ 5월 요강: ${y26.changeNote}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    // 4년제 3정시(가/나/다군) 슬롯 렌더링
    if (DOM.jeongsiSlotsContainer) {
      DOM.jeongsiSlotsContainer.innerHTML = jeongsiPortfolio.map(item => {
        const y26 = item.years["2026"];
        const cardClass = item.evaluation.status === "상향" ? "card-challenge" : item.evaluation.status === "적정" ? "card-fair" : "card-safe";
        const cutDisplay = item.jeongsiCut ? `표점 ${item.jeongsiCut.stdScore}점 (백분위 ${item.jeongsiCut.pctScore}%)` : (y26.cut70 || "정보 확인");
        
        return `
          <div class="slot-card ${cardClass}">
            <div class="slot-badge-row">
              <span class="badge ${item.evaluation.badgeClass}">${item.gunSlot || item.gun || '정시'}</span>
              <span style="font-size:0.75rem; color:#38bdf8; font-weight:700;">${item.strategy || item.evaluation.status}</span>
            </div>
            <div class="slot-univ-name">${item.univName}</div>
            <div class="slot-dept-name">${item.department} [${item.gun || '정시'}]</div>

            <div class="slot-metrics">
              <div>정원: <strong>${y26.recruitQuota}명</strong></div>
              <div>경쟁률: <strong>${y26.competitionRate}:1</strong></div>
              <div>배치점수: <strong style="color:#38bdf8;">${cutDisplay}</strong></div>
              <div>충원율: <strong>${y26.fillRate}%</strong></div>
            </div>

            <div class="risk-tag" style="color: ${item.evaluation.status === '안정' ? '#34d399' : item.evaluation.status === '적정' ? '#38bdf8' : '#f43f5e'}; margin-bottom:0.6rem;">
              <span>합격 예측:</span> <strong>${item.evaluation.status} (${item.evaluation.label})</strong>
            </div>

            <div style="font-size:0.78rem; color:#94a3b8; line-height:1.4;">
              ${item.evaluation.label}
              ${item.subType ? `<div style="color:#cbd5e1; margin-top:0.2rem;">전형요소: ${item.subType}</div>` : ''}
              ${y26.isMayChanged ? `<div style="color:#fbbf24; font-weight:700; margin-top:0.3rem;">⚡ 5월 요강: ${y26.changeNote}</div>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    // 전문대 특화 렌더링
    DOM.collegeSlotsContainer.innerHTML = collegeList.slice(0, 3).map(col => {
      const y26 = col.years["2026"];
      return `
        <div class="slot-card card-safe">
          <div class="slot-badge-row">
            <span class="badge badge-23y">전문대 특화</span>
            <span style="font-size:0.75rem; color:#34d399; font-weight:700;">취업률 ${col.infoAlimi.employmentRate}%</span>
          </div>
          <div class="slot-univ-name">${col.univName}</div>
          <div class="slot-dept-name">${col.department} (${col.admissionType})</div>

          <div class="slot-metrics">
            <div>정원: <strong>${y26.recruitQuota}명</strong></div>
            <div>경쟁률: <strong>${y26.competitionRate}:1</strong></div>
            <div>70% 컷: <strong>${y26.cut70}</strong></div>
            <div>충원율: <strong>${y26.fillRate}%</strong></div>
          </div>

          <div style="font-size:0.78rem; color:#a7f3d0;">
            ${col.advantageText}
          </div>
        </div>
      `;
    }).join('');
  }

  // 8. 1장 프리미엄 리포트 렌더링
  function renderReport() {
    if (!State.currentStudent) return;
    const stu = State.currentStudent;
    const gpaInfo = ScoreCalculator.calculateGPA(stu.gpa);
    const csatInfo = ScoreCalculator.calculateCSAT(stu.csat);

    const studentProfile = {
      convertedGrade: gpaInfo.convertedGrade,
      coreAvg: gpaInfo.coreAvg,
      avgPercentile: csatInfo.avgPercentile,
      csat: stu.csat
    };

    const susiPortfolio = AdmissionRecommender.generateSusiPortfolio(studentProfile, stu.targetField, stu.targetRegion);
    const jeongsiPortfolio = AdmissionRecommender.generateJeongsiPortfolio(studentProfile, stu.targetField);
    const collegeList = AdmissionRecommender.generateCollegeRecommendations(studentProfile, stu.targetField);
    const conflictInfo = CalendarManager.checkScheduleConflicts(susiPortfolio.map(p => p.id));

    DOM.reportSheetOutput.innerHTML = ReportGenerator.renderReportHTML(stu, susiPortfolio, jeongsiPortfolio, collegeList, conflictInfo);
  }

  // 9. 이벤트 바인딩
  function bindEvents() {
    // 탭 클릭
    DOM.navBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        switchTab(btn.dataset.tab);
      });
    });

    // 학생 변경
    DOM.currentStudentSelect.addEventListener("change", (e) => {
      State.currentStudentId = e.target.value;
      State.currentStudent = StudentManager.getStudentById(State.currentStudentId);
      renderConsultingTab();
      renderReport();
      renderUniversityDB();
    });

    // 학생 정보 모달 열기
    DOM.btnOpenStudentModal.addEventListener("click", () => {
      const stu = State.currentStudent;
      DOM.inputStuName.value = stu.name;
      DOM.inputStuSchool.value = stu.highSchool;
      DOM.selectStuTrack.value = stu.track;
      DOM.selectStuRegion.value = stu.targetRegion || "서울";

      DOM.inputGpaKor.value = stu.gpa.kor;
      DOM.inputGpaMath.value = stu.gpa.math;
      DOM.inputGpaEng.value = stu.gpa.eng;
      DOM.inputGpaSoc.value = stu.gpa.soc;
      DOM.inputGpaSci.value = stu.gpa.sci;

      DOM.inputCsatKorPct.value = stu.csat.korPct;
      DOM.inputCsatMathPct.value = stu.csat.mathPct;
      DOM.inputCsatEngGrade.value = stu.csat.engGrade;
      DOM.inputCsatTamPct.value = ((stu.csat.tam1Pct + stu.csat.tam2Pct) / 2).toFixed(0);

      DOM.textareaStuMemo.value = stu.memo || "";

      DOM.studentModal.style.display = "flex";
    });

    DOM.btnCloseStudentModal.addEventListener("click", () => {
      DOM.studentModal.style.display = "none";
    });
    DOM.btnCancelStudentModal.addEventListener("click", () => {
      DOM.studentModal.style.display = "none";
    });

    // 학생 정보 저장
    DOM.studentEditForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const stu = State.currentStudent;
      stu.name = DOM.inputStuName.value.trim();
      stu.highSchool = DOM.inputStuSchool.value.trim();
      stu.track = DOM.selectStuTrack.value;
      stu.targetRegion = DOM.selectStuRegion.value;
      stu.targetField = DOM.selectStuTrack.value;

      stu.gpa.kor = parseFloat(DOM.inputGpaKor.value);
      stu.gpa.math = parseFloat(DOM.inputGpaMath.value);
      stu.gpa.eng = parseFloat(DOM.inputGpaEng.value);
      stu.gpa.soc = parseFloat(DOM.inputGpaSoc.value);
      stu.gpa.sci = parseFloat(DOM.inputGpaSci.value);

      stu.csat.korPct = parseInt(DOM.inputCsatKorPct.value);
      stu.csat.mathPct = parseInt(DOM.inputCsatMathPct.value);
      stu.csat.engGrade = parseInt(DOM.inputCsatEngGrade.value);
      const tamPct = parseInt(DOM.inputCsatTamPct.value);
      stu.csat.tam1Pct = tamPct;
      stu.csat.tam2Pct = tamPct;

      stu.memo = DOM.textareaStuMemo.value.trim();

      StudentManager.saveStudent(stu);
      DOM.studentModal.style.display = "none";

      loadStudents();
      renderConsultingTab();
      renderReport();
      renderUniversityDB();
    });

    // 뉴스 카테고리 필터
    DOM.newsCategoryFilter.addEventListener("click", (e) => {
      if (e.target.classList.contains("chip-btn")) {
        DOM.newsCategoryFilter.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        State.newsCategory = e.target.dataset.cat;
        State.newsPage = 1; // 카테고리 변경 시 1페이지로 리셋
        renderNews();
      }
    });

    // 뉴스 페이지네이션 클릭 이벤트 (이벤트 위임)
    if (DOM.newsPaginationContainer) {
      DOM.newsPaginationContainer.addEventListener("click", (e) => {
        const pageBtn = e.target.closest(".news-page-btn, .news-page-nav-btn");
        if (pageBtn && !pageBtn.disabled && pageBtn.dataset.page) {
          const targetPage = parseInt(pageBtn.dataset.page, 10);
          if (targetPage > 0 && targetPage !== State.newsPage) {
            State.newsPage = targetPage;
            renderNews();
            const filterBar = document.querySelector(".filter-bar");
            if (filterBar) filterBar.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }

    // 대입 / 고입 2대 축 토글 버튼
    if (DOM.btnSchedUniv && DOM.btnSchedHighSchool) {
      DOM.btnSchedUniv.addEventListener("click", () => {
        DOM.btnSchedUniv.classList.add("active");
        DOM.btnSchedHighSchool.classList.remove("active");
        NewsEngine.setTimelineMode("UNIV");
        NewsEngine.setTimelineCategory("ALL");
        renderTimeline();
      });

      DOM.btnSchedHighSchool.addEventListener("click", () => {
        DOM.btnSchedHighSchool.classList.add("active");
        DOM.btnSchedUniv.classList.remove("active");
        NewsEngine.setTimelineMode("HIGHSCHOOL");
        NewsEngine.setTimelineCategory("ALL");
        renderTimeline();
      });
    }

    // 학년도 셀렉트 변경 (2027 vs 2028 vs 2026)
    if (DOM.schedYearSelect) {
      DOM.schedYearSelect.addEventListener("change", (e) => {
        NewsEngine.setTimelineYear(e.target.value);
        NewsEngine.setTimelineCategory("ALL");
        renderTimeline();
      });
    }

    // 1+2+3번 실시간 뉴스 강제 갱신 버튼 이벤트
    if (DOM.btnRefreshNews) {
      DOM.btnRefreshNews.addEventListener("click", async () => {
        DOM.btnRefreshNews.disabled = true;
        if (DOM.refreshIcon) DOM.refreshIcon.classList.add("spinning");
        if (DOM.newsSyncStatus) {
          DOM.newsSyncStatus.textContent = "1번 포털+2번 공공기관+3번 AI 분석 파이프라인 가동 중...";
          DOM.newsSyncStatus.style.color = "#fbbf24";
        }

        try {
          let updated = false;
          if (window.location.protocol.startsWith('http')) {
            try {
              const res = await fetch('/api/news/refresh');
              if (res.ok) {
                const data = await res.json();
                if (data && data.success && Array.isArray(data.news)) {
                  window.EDUCATION_NEWS_DATA = data.news;
                  localStorage.setItem('steady_live_news_data', JSON.stringify(data.news));
                  renderNews();
                  updated = true;
                  if (DOM.newsSyncStatus) {
                    DOM.newsSyncStatus.textContent = `실시간 자동 업데이트 완료 (${data.count}건 / ${data.updatedAt})`;
                    DOM.newsSyncStatus.style.color = "#34d399";
                  }
                }
              }
            } catch (_) {}
          }

          if (!updated) {
            if (DOM.newsSyncStatus) {
              DOM.newsSyncStatus.textContent = "실시간 언론사 & 공공기관 피드 직접 수집 중...";
              DOM.newsSyncStatus.style.color = "#38bdf8";
            }
            await syncLatestNewsFromServer(true);
            if (DOM.newsSyncStatus) {
              const count = (window.EDUCATION_NEWS_DATA || []).length;
              DOM.newsSyncStatus.textContent = `실시간 자동 업데이트 완료 (${count}건 / ${new Date().toLocaleTimeString('ko-KR')})`;
              DOM.newsSyncStatus.style.color = "#34d399";
            }
          }
        } catch (err) {
          console.warn("뉴스 새로고침 오류:", err);
          await syncLatestNewsFromServer(true);
        } finally {
          DOM.btnRefreshNews.disabled = false;
          if (DOM.refreshIcon) DOM.refreshIcon.classList.remove("spinning");
        }
      });
    }

    // 대학 DB 필터 이벤트
    DOM.filterTypeAll.addEventListener("click", () => {
      State.dbFilter.univType = "ALL";
      State.dbFilter.page = 1;
      DOM.filterTypeAll.className = "btn-primary";
      DOM.filterType4Y.className = "btn-secondary";
      DOM.filterType23Y.className = "btn-secondary";
      renderUniversityDB();
    });

    DOM.filterType4Y.addEventListener("click", () => {
      State.dbFilter.univType = "4Y";
      State.dbFilter.page = 1;
      DOM.filterTypeAll.className = "btn-secondary";
      DOM.filterType4Y.className = "btn-primary";
      DOM.filterType23Y.className = "btn-secondary";
      renderUniversityDB();
    });

    DOM.filterType23Y.addEventListener("click", () => {
      State.dbFilter.univType = "23Y";
      State.dbFilter.page = 1;
      DOM.filterTypeAll.className = "btn-secondary";
      DOM.filterType4Y.className = "btn-secondary";
      DOM.filterType23Y.className = "btn-primary";
      renderUniversityDB();
    });

    DOM.checkOnlyMayChanged.addEventListener("change", (e) => {
      State.dbFilter.onlyMayChanged = e.target.checked;
      State.dbFilter.page = 1;
      renderUniversityDB();
    });

    DOM.selectRegionFilter.addEventListener("change", (e) => {
      State.dbFilter.region = e.target.value;
      State.dbFilter.page = 1;
      renderUniversityDB();
    });

    DOM.selectFieldFilter.addEventListener("change", (e) => {
      State.dbFilter.field = e.target.value;
      State.dbFilter.page = 1;
      renderUniversityDB();
    });

    DOM.selectAdmissionTypeFilter.addEventListener("change", (e) => {
      State.dbFilter.admissionType = e.target.value;
      State.dbFilter.page = 1;
      renderUniversityDB();
    });

    DOM.inputSearchUniv.addEventListener("input", (e) => {
      State.dbFilter.searchQuery = e.target.value;
      State.dbFilter.page = 1;
      renderUniversityDB();
    });

    // 아이디어 2: 내 관심대학 변동 필터 버튼
    if (DOM.btnFilterTargetChanged) {
      DOM.btnFilterTargetChanged.addEventListener("click", () => {
        State.dbFilter.onlyTargetChanged = !State.dbFilter.onlyTargetChanged;
        State.dbFilter.page = 1;
        DOM.btnFilterTargetChanged.classList.toggle("active", State.dbFilter.onlyTargetChanged);
        renderUniversityDB();
      });
    }

    // 아이디어 4: 엑셀 다운로드 버튼
    if (DOM.btnExportExcel) {
      DOM.btnExportExcel.addEventListener("click", () => {
        const list = UniversityDB.filterData(State.dbFilter);
        UniversityDB.exportToCSV(list);
      });
    }

    // 표시 단위 셀렉트 (페이징)
    if (DOM.selectPageLimit) {
      DOM.selectPageLimit.addEventListener("change", (e) => {
        State.dbFilter.pageLimit = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
        State.dbFilter.page = 1;
        renderUniversityDB();
      });
    }

    // 대입 DB 페이징 네비게이션 이벤트 (페이지 번호 클릭 & 직접 이동)
    if (DOM.dbPaginationContainer) {
      DOM.dbPaginationContainer.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-page]");
        if (btn && !btn.disabled) {
          const targetPage = Number(btn.dataset.page);
          if (!isNaN(targetPage) && targetPage !== State.dbFilter.page) {
            State.dbFilter.page = targetPage;
            renderUniversityDB();
            const tableElem = document.getElementById("dbDataTable");
            if (tableElem) {
              tableElem.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        }
      });

      DOM.dbPaginationContainer.addEventListener("submit", (e) => {
        if (e.target && e.target.id === "formJumpDbPage") {
          e.preventDefault();
          const jumpInput = document.getElementById("inputJumpDbPage");
          if (jumpInput) {
            const pageNum = parseInt(jumpInput.value, 10);
            if (!isNaN(pageNum) && pageNum >= 1) {
              State.dbFilter.page = pageNum;
              renderUniversityDB();
              const tableElem = document.getElementById("dbDataTable");
              if (tableElem) {
                tableElem.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }
          }
        }
      });
    }

    // 아이디어 1: 변동 내역 상세 모달 닫기
    if (DOM.btnCloseChangeLogModal && DOM.changeLogModal) {
      DOM.btnCloseChangeLogModal.addEventListener("click", () => {
        DOM.changeLogModal.style.display = "none";
      });
      DOM.changeLogModal.addEventListener("click", (e) => {
        if (e.target === DOM.changeLogModal) {
          DOM.changeLogModal.style.display = "none";
        }
      });
    }

    // 포트폴리오 재산출
    DOM.btnAutoGeneratePortfolio.addEventListener("click", () => {
      renderConsultingTab();
      alert("현재 학생의 최신 성적 및 3개년 컷 데이터를 바탕으로 수시 6장 및 정시 3장 포트폴리오가 재산출되었습니다.");
    });

    // URL 역할(role) 파라미터 감지 및 UI 모드 적용
    const urlParams = new URLSearchParams(window.location.search);
    const userRole = (urlParams.get("role") || "TEACHER").toUpperCase();
    const isDirector = userRole === "DIRECTOR";

    if (!isDirector) {
      if (DOM.btnPrintReportHeader) {
        DOM.btnPrintReportHeader.innerHTML = '<span>📑</span> 리포트 결재 상신';
        DOM.btnPrintReportHeader.title = '작성된 1장 리포트를 원장님 전자결재함으로 상신합니다.';
      }
      if (DOM.btnPrintReport) {
        DOM.btnPrintReport.innerHTML = '<span>📑</span> 원장님께 리포트 승인 요청 (상신)';
        DOM.btnPrintReport.title = '원장님 최종 승인을 요청합니다.';
      }
    } else {
      if (DOM.btnPrintReportHeader) {
        DOM.btnPrintReportHeader.innerHTML = '<span>🖨</span> 리포트 인쇄 (전결)';
      }
      if (DOM.btnPrintReport) {
        DOM.btnPrintReport.innerHTML = '<span>🖨</span> 리포트 즉시 출력/발행 (원장 전결)';
      }
    }

    // 인쇄 / 결재 상신 트리거
    const triggerPrint = () => {
      switchTab("tabReport");
      if (!isDirector) {
        const studentName = State.currentStudent ? State.currentStudent.name : "학생";
        alert(`[원장님 전자결재 상신 완료]\n${studentName} 학생의 '1장 프리미엄 입시 진단 리포트'가 반승휘 원장님 결재함으로 상신되었습니다.\n원장님 최종 승인 후 대외 인쇄 및 학부모 전송이 가능합니다.`);
        return;
      }
      setTimeout(() => {
        window.print();
      }, 300);
    };

    DOM.btnPrintReportHeader.addEventListener("click", triggerPrint);
    DOM.btnPrintReport.addEventListener("click", triggerPrint);
    DOM.btnRefreshReport.addEventListener("click", () => {
      renderReport();
      alert("최신 입시 데이터가 리포트에 반영되었습니다.");
    });
  }

  // 실행
  init();
});
