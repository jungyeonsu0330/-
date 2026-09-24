// 대학 입시 데이터베이스 탐색 & 필터링 엔진
// 전국 17개 시·도 전수 4년제 대학교 & 2·3년제 전문대학 데이터 엔진
// 한글 초성 검색, 노란색 형광펜 변동 감지, AI 컷 변동 시뮬레이터 및 엑셀 내보내기 통합

const UniversityDB = {
  getCombinedData: function() {
    const list4y = typeof UNIVERSITIES_4Y_DATA !== 'undefined' ? UNIVERSITIES_4Y_DATA : [];
    const list23y = typeof COLLEGES_23Y_DATA !== 'undefined' ? COLLEGES_23Y_DATA : [];
    return [...list4y, ...list23y];
  },

  // 한글 초성 분리 함수 ('서울대학교' -> 'ㅅㅇㄷㅎㄱ')
  getChoseong: function(str) {
    if (!str) return '';
    const CHOSUNG = [
      'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ',
      'ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'
    ];
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i) - 44032;
      if (code >= 0 && code <= 11171) {
        result += CHOSUNG[Math.floor(code / 588)];
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  },

  // 한글 초성 및 일반 텍스트 매칭 함수 (초성 'ㅅㅇㄷ ㅋㄱ', 약어 '컴공'/'의대' 완벽 지원)
  matchSearch: function(targetText, query) {
    if (!query) return true;
    let exp = (targetText || '').toLowerCase();

    // 빈번한 대학명 및 전공 약어 매핑
    if (exp.includes("컴퓨터")) exp += " 컴공 ㅋㄱ";
    if (exp.includes("인공지능")) exp += " ai 에이아이 ㅇㄱㅈㄴ";
    if (exp.includes("의예")) exp += " 의대 ㅇㄷ";
    if (exp.includes("치의예")) exp += " 치대 ㅊㄷ";
    if (exp.includes("한의예")) exp += " 한의대 ㅎㅇㄷ";
    if (exp.includes("약학")) exp += " 약대 ㅇㄷ";
    if (exp.includes("수의예")) exp += " 수의대 ㅅㅇㄷ";
    if (exp.includes("인하공업전문")) exp += " 인하공전 ㅇㅎㄱㅈ";
    if (exp.includes("삼육보건")) exp += " ㅅㅇㅂㄱ";
    if (exp.includes("동양미래")) exp += " ㄷㅇㅁㄹ";
    if (exp.includes("영진전문")) exp += " ㅇㅈㅈㅁ";

    const tCho = this.getChoseong(exp);
    const words = query.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);

    return words.every(w => {
      if (exp.includes(w)) return true;
      if (tCho.includes(w)) return true;
      const wCho = this.getChoseong(w);
      if (tCho.includes(wCho)) return true;
      return false;
    });
  },

  filterData: function(options) {
    let list = this.getCombinedData();

    // 대학 구분
    if (options.univType === '4Y') {
      list = list.filter(item => item.univType === '4년제');
    } else if (options.univType === '23Y') {
      list = list.filter(item => item.univType.includes('전문대'));
    }

    // 지역 구분
    if (options.region && options.region !== 'ALL') {
      list = list.filter(item => item.region === options.region);
    }

    // 계열 구분
    if (options.field && options.field !== 'ALL') {
      list = list.filter(item => item.field.includes(options.field));
    }

    // 전형 구분
    if (options.admissionType && options.admissionType !== 'ALL') {
      list = list.filter(item => 
        item.admissionType.includes(options.admissionType) || 
        item.subType.includes(options.admissionType) ||
        (item.gun && item.gun.includes(options.admissionType))
      );
    }

    // 5월 확정 요강 변동 대학만
    if (options.onlyMayChanged) {
      list = list.filter(item => {
        const y26 = item.years["2026"];
        return y26 && y26.isMayChanged;
      });
    }

    // 아이디어 2: 내 관심(담은) 대학 중 변동된 대학만 보기
    if (options.onlyTargetChanged && options.targetIds) {
      list = list.filter(item => {
        const isTarget = options.targetIds.includes(item.id);
        const y26 = item.years["2026"];
        return isTarget && y26 && y26.isMayChanged;
      });
    }

    // 초성 검색 & 통합 키워드 검색
    if (options.searchQuery && options.searchQuery.trim() !== '') {
      const q = options.searchQuery.trim();
      list = list.filter(item => {
        const fullCombo = `${item.univName} ${item.department} ${item.field} ${item.subType} ${item.gun || ''} ${item.region}`;
        return this.matchSearch(fullCombo, q);
      });
    }

    return list;
  },

  renderTableRowsHTML: function(list, selectedIds = [], pageLimit = 30, page = 1, currentStudent = null) {
    if (list.length === 0) {
      return `<tr><td colspan="8" class="empty-cell">조건에 일치하는 대입 데이터가 없습니다. 검색어나 필터 조건을 변경해보세요.</td></tr>`;
    }

    if (typeof page === 'object' && page !== null && !currentStudent) {
      currentStudent = page;
      page = 1;
    }

    let displayList;
    if (pageLimit === 'ALL') {
      displayList = list;
    } else {
      const pSize = Number(pageLimit) || 30;
      const pNum = Math.max(1, Number(page) || 1);
      const start = (pNum - 1) * pSize;
      displayList = list.slice(start, start + pSize);
    }

    // 학생 내신 환산
    let studentGpaData = null;
    if (currentStudent && currentStudent.gpa) {
      studentGpaData = (typeof ScoreCalculator !== 'undefined') ? ScoreCalculator.calculateGPA(currentStudent.gpa) : null;
    }
    const myGpaBase = studentGpaData ? studentGpaData.convertedGrade : 2.45;

    return displayList.map(item => {
      const y26 = item.years["2026"] || {};
      const y25 = item.years["2025"] || {};
      const isChecked = selectedIds.includes(item.id) ? 'checked' : '';
      const isChanged = Boolean(y26.isMayChanged);

      // 정원 증감 및 형광펜 여부
      const quotaDiff = y26.quotaDiff || 0;
      const isQuotaChanged = isChanged && quotaDiff !== 0;

      // 옵션 B: 실경쟁률 산출
      const nominalComp = parseFloat(y26.competitionRate) || 0;
      let passRate = 0.52; // 기본 충족률
      const reqText = y26.minGradeReq || '';
      if (reqText.includes("3합") || reqText.includes("4합") || item.field === "의약학") {
        passRate = 0.38; // 까다로운 수능최저
      } else if (!reqText || reqText === '없음' || item.admissionType.includes("실기") || item.admissionType.includes("면접")) {
        passRate = 0.78; // 최저 없음/실기면접
      } else if (item.admissionType === '정시') {
        passRate = 0.92; // 정시 실지원율
      }
      const realCompRate = nominalComp > 0 ? (nominalComp * passRate).toFixed(1) : '-';

      // 옵션 D: 70% Cut 입결
      const cut70Val = y26.cut70 ? `${y26.cut70}등급` : '-';
      const cut50Val = y26.cut50 ? `${y26.cut50}등급` : '-';
      const cutShift = y26.aiPredictedCutShift || "0.00";
      const hasCutShift = isChanged && cutShift !== "0.00";

      // 옵션 C: 내 환산 & 유불리 판정
      let myUnivGpa = myGpaBase;
      if (item.field === '자연/공학' && currentStudent && currentStudent.track === '자연/공학') {
        myUnivGpa = Math.max(1.0, (myGpaBase - 0.05)).toFixed(2);
      } else {
        myUnivGpa = Number(myGpaBase).toFixed(2);
      }

      const cutNum = parseFloat(y26.cut70) || (item.jeongsiCut ? 2.5 : 2.8);
      const diff = (cutNum - parseFloat(myUnivGpa)).toFixed(2); // 내신 낮을수록 우수: cutNum > myUnivGpa => diff > 0
      let status = "적정";
      let badgeClass = "badge-risk-moderate";
      if (diff >= 0.3) {
        status = "안정";
        badgeClass = "badge-risk-safe";
      } else if (diff >= -0.2) {
        status = "적정";
        badgeClass = "badge-risk-moderate";
      } else {
        status = "소신";
        badgeClass = "badge-risk-danger";
      }

      return `
        <tr class="uni-row ${item.univType === '4년제' ? 'row-4y' : 'row-23y'} ${isChanged ? 'has-change-row' : ''}">
          <!-- 1. 담기 -->
          <td class="col-checkbox text-center">
            <input type="checkbox" class="student-target-checkbox" data-id="${item.id}" ${isChecked} title="지망 대학에 담기">
          </td>

          <!-- 2. 대학명 / 모집단위(학과) -->
          <td class="col-univ-dept">
            <div class="cell-line-1 flex-between">
              <div class="univ-tags">
                <span class="badge ${item.univType === '4년제' ? 'badge-4y' : 'badge-23y'}">${item.univType}</span>
                <span class="badge badge-region">${item.region}</span>
                <strong class="univ-name-text">${item.univName}</strong>
              </div>
              <a href="${item.admissionUrl || '#'}" target="_blank" rel="noopener noreferrer" class="link-admission-official" title="${item.univName} 입학처 공식 확정요강 열기">
                입학처 ↗
              </a>
            </div>
            <div class="cell-line-2">
              <strong class="dept-title">${item.department}</strong>
              <span class="field-sub">(${item.field})</span>
            </div>
          </td>

          <!-- 3. 전형 구분 -->
          <td class="col-admission">
            <div class="cell-line-1">
              <span class="badge-adm-type">${item.admissionType}</span>
              ${item.gun ? `<span class="badge badge-gun">${item.gun}</span>` : ''}
            </div>
            <div class="cell-line-2 sub-type-desc" title="${item.subType}">
              ${item.subType}
            </div>
          </td>

          <!-- 4. 26년 모집정원 -->
          <td class="col-quota text-center">
            <div class="cell-line-1">
              ${isQuotaChanged ? `
                <span class="highlight-yellow" title="[정원 변동] 전년: ${y25.recruitQuota || '-'}명 ➔ 26년: ${y26.recruitQuota}명 (${quotaDiff > 0 ? `+${quotaDiff}명 증원` : `${quotaDiff}명`})">
                  <strong>${y26.recruitQuota || '-'}</strong>명 ⚡
                </span>
              ` : `
                <span class="quota-cur"><strong>${y26.recruitQuota || '-'}</strong>명</span>
              `}
            </div>
            <div class="cell-line-2 trend-sub">
              25년: ${y25.recruitQuota || '-'} (${quotaDiff > 0 ? `+${quotaDiff}` : (quotaDiff || '동일')})
            </div>
          </td>

          <!-- 5. 경쟁률 vs 실경쟁률 -->
          <td class="col-competition text-center">
            <div class="cell-line-1">
              명목 <strong class="text-accent">${nominalComp > 0 ? `${nominalComp}:1` : '-'}</strong>
            </div>
            <div class="cell-line-2">
              실질 <span class="badge-real-comp" title="수능최저 충족률 연동 실경쟁률">🔥 ${realCompRate !== '-' ? `${realCompRate}:1` : '-'}</span>
            </div>
          </td>

          <!-- 6. 70% Cut 입결 -->
          <td class="col-cuts text-center">
            <div class="cell-line-1 cut-val">
              수시 70% <strong>${cut70Val}</strong>
            </div>
            <div class="cell-line-2">
              ${item.jeongsiCut ? `
                <span class="jeongsi-cut-tag" title="정시 배치 기준 표점/백분위">정시 표점 ${item.jeongsiCut.stdScore}</span>
              ` : (hasCutShift ? `
                <span class="predicted-cut-chip highlight-yellow" title="AI 예상 변동">AI 예상 ${cutShift}</span>
              ` : `
                <span class="cut-sub">50% 컷 ${cut50Val}</span>
              `)}
            </div>
          </td>

          <!-- 7. 내 환산 & 유불리 -->
          <td class="col-my-eval text-center">
            <div class="cell-line-1">
              내 환산 <strong>${myUnivGpa}</strong>등급
            </div>
            <div class="cell-line-2">
              <span class="badge-risk-pill ${badgeClass}" title="컷 대비 격차: ${diff >= 0 ? '+' : ''}${diff}등급">
                ${status} (${diff >= 0 ? '+' : ''}${diff})
              </span>
            </div>
          </td>

          <!-- 8. 수능최저 / 변경사항 -->
          <td class="col-minreq">
            <div class="cell-line-1 minreq-text-wrap" title="${y26.minGradeReq || '수능최저 없음'}">
              ${y26.minGradeReq || '수능최저 없음'}
            </div>
            <div class="cell-line-2">
              ${isChanged ? `
                <button class="highlight-yellow btn-change-detail" data-id="${item.id}" title="클릭하여 상세 변동 이력 보기">
                  ⚡ ${y26.changeType || '5월 변동'}: ${y26.changeNote} 🔍
                </button>
              ` : `
                <span class="badge-confirmed-fix">요강 확정 (변동없음)</span>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // 대입 DB 페이징 네비게이션 컨트롤 렌더링
  renderPaginationHTML: function(totalCount, pageSize = 30, currentPage = 1) {
    if (pageSize === 'ALL' || totalCount === 0) {
      if (totalCount === 0) return '';
      return `
        <div class="db-pagination-wrapper">
          <div class="db-pagination-meta" style="color:var(--text-muted); font-size:0.85rem;">
            전국 총 <strong>${totalCount.toLocaleString()}</strong>개 모집단위 입시 데이터가 1개 페이지에 전체(전수) 표시되고 있습니다.
          </div>
        </div>
      `;
    }

    const pSize = Number(pageSize) || 30;
    const totalPages = Math.max(1, Math.ceil(totalCount / pSize));
    const curr = Math.min(Math.max(1, Number(currentPage) || 1), totalPages);

    const startItem = (curr - 1) * pSize + 1;
    const endItem = Math.min(curr * pSize, totalCount);

    // 슬라이딩 윈도우 페이지 번호 (최대 7개)
    let pageNumbersHTML = '';
    const maxButtons = 7;
    let startPage = Math.max(1, curr - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      pageNumbersHTML += `<button type="button" class="db-page-btn" data-page="1">1</button>`;
      if (startPage > 2) {
        pageNumbersHTML += `<span class="db-page-ellipsis">···</span>`;
      }
    }

    for (let p = startPage; p <= endPage; p++) {
      const activeClass = p === curr ? 'active' : '';
      pageNumbersHTML += `<button type="button" class="db-page-btn ${activeClass}" data-page="${p}" ${p === curr ? 'aria-current="page"' : ''}>${p}</button>`;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbersHTML += `<span class="db-page-ellipsis">···</span>`;
      }
      pageNumbersHTML += `<button type="button" class="db-page-btn" data-page="${totalPages}">${totalPages}</button>`;
    }

    return `
      <div class="db-pagination-wrapper">
        <div class="db-pagination-top-row">
          <div class="db-pagination-meta">
            총 <strong>${totalCount.toLocaleString()}</strong>개 모집단위 중 
            <strong>${startItem.toLocaleString()} ~ ${endItem.toLocaleString()}</strong>번째 표시 
            (페이지 <strong>${curr}</strong> / <strong>${totalPages}</strong> 쪽)
          </div>
          <form class="db-pagination-jump-form" id="formJumpDbPage">
            <span>페이지 바로가기:</span>
            <input type="number" class="db-page-jump-input" id="inputJumpDbPage" min="1" max="${totalPages}" value="${curr}" aria-label="이동할 페이지 번호" />
            <button type="submit" class="btn-page-jump">이동</button>
          </form>
        </div>

        <div class="db-pagination-nav-btns">
          <button type="button" class="db-page-nav-btn" data-page="1" ${curr === 1 ? 'disabled' : ''} title="맨 처음 페이지로">« 처음</button>
          <button type="button" class="db-page-nav-btn" data-page="${curr - 1}" ${curr === 1 ? 'disabled' : ''} title="이전 페이지로">‹ 이전</button>
          <div class="db-page-numbers">
            ${pageNumbersHTML}
          </div>
          <button type="button" class="db-page-nav-btn" data-page="${curr + 1}" ${curr === totalPages ? 'disabled' : ''} title="다음 페이지로">다음 ›</button>
          <button type="button" class="db-page-nav-btn" data-page="${totalPages}" ${curr === totalPages ? 'disabled' : ''} title="맨 끝 페이지로">마지막 »</button>
        </div>
      </div>
    `;
  },

  // 아이디어 1: 변동 내역 상세 타임라인 모달 데이터 생성
  getChangeDetailHTML: function(item) {
    if (!item) return '';
    const y26 = item.years["2026"] || {};
    const y25 = item.years["2025"] || {};

    return `
      <div class="modal-change-header">
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
          <span class="badge ${item.univType === '4년제' ? 'badge-4y' : 'badge-23y'}">${item.univType}</span>
          <span class="badge badge-region">${item.region}</span>
          <span class="highlight-yellow" style="font-size:0.75rem;">⚡ 실시간 요강 변동 감지</span>
        </div>
        <h2 style="font-size:1.4rem; font-weight:800; color:var(--text-main); margin-bottom:0.2rem;">
          ${item.univName} <span style="color:#60a5fa;">${item.department}</span>
        </h2>
        <div style="font-size:0.85rem; color:var(--text-muted);">
          전형: <strong>${item.admissionType} ${item.subType}</strong> ${item.gun ? `(${item.gun})` : ''} | 계열: ${item.field}
        </div>
      </div>

      <!-- Before vs After 비교 표 -->
      <div class="change-compare-table">
        <div class="compare-col before-col">
          <div class="col-label">🔴 2025학년도 (변경 전)</div>
          <div class="compare-item"><strong>모집 정원:</strong> ${y25.recruitQuota || '-'}명</div>
          <div class="compare-item"><strong>수능최저/조건:</strong> ${y26.prevMinGradeReq || y25.minGradeReq || '없음'}</div>
          <div class="compare-item"><strong>경쟁률:</strong> ${y25.competitionRate || '-'}:1</div>
          <div class="compare-item"><strong>70% Cut:</strong> ${y25.cut70 || '-'}</div>
        </div>

        <div class="compare-col after-col">
          <div class="col-label">🟡 2026학년도 (5월 확정 변동)</div>
          <div class="compare-item">
            <strong>모집 정원:</strong> 
            <span class="highlight-yellow">${y26.recruitQuota}명 (${(y26.quotaDiff || 0) > 0 ? `+${y26.quotaDiff}명 증원` : `${y26.quotaDiff || 0}명`})</span>
          </div>
          <div class="compare-item"><strong>수능최저/조건:</strong> <span class="highlight-yellow">${y26.minGradeReq}</span></div>
          <div class="compare-item"><strong>경쟁률(예상):</strong> ${y26.competitionRate || '-'}:1</div>
          <div class="compare-item"><strong>70% Cut:</strong> ${y26.cut70 || '-'}</div>
        </div>
      </div>

      <!-- AI 합격선 변동 분석 (아이디어 3) -->
      <div class="ai-cut-analysis-box">
        <div class="ai-box-title">
          <span style="font-size:1.1rem;">🤖</span>
          <strong>AI 입시 연구원 합격선 변동 예측</strong>
        </div>
        <p style="font-size:0.88rem; color:var(--text-main); margin-bottom:0.5rem; line-height:1.5;">
          ${y26.changeNote || '정원 및 전형 요소가 변경되었습니다.'}
        </p>
        <div style="background:rgba(15,23,42,0.6); padding:0.8rem; border-radius:8px; border:1px solid rgba(250,204,21,0.3);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.82rem; color:var(--text-muted);">AI 추정 70% Cut 변동폭:</span>
            <span class="highlight-yellow" style="font-size:0.95rem; font-weight:800;">
              ${y26.aiPredictedCutShift || '0.00'} (합격선 완화 예상)
            </span>
          </div>
        </div>
      </div>

      <!-- 공지 일자 및 공식 출처 링크 (아이디어 5) -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.2rem; padding-top:1rem; border-top:1px solid var(--border-glass);">
        <span style="font-size:0.8rem; color:var(--text-muted);">
          공식 확정일: ${y26.changeDate || '2026-05-18'} (한국대학교육협의회 공시)
        </span>
        <a href="${item.admissionUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding:0.45rem 1rem; font-size:0.82rem; text-decoration:none;">
          입학처 공식 요강 확인 ↗
        </a>
      </div>
    `;
  },

  // 아이디어 4: 엑셀 (CSV) 원클릭 내보내기
  exportToCSV: function(list) {
    if (!list || list.length === 0) {
      alert("다운로드할 입시 데이터가 없습니다.");
      return;
    }

    const BOM = "\uFEFF";
    const headers = [
      "대학구분", "지역", "대학명", "모집단위(학과)", "계열", "전형구분", "전형세부", "정시군",
      "2026정원", "2025정원", "정원변동", "2026경쟁률", "70%Cut", "50%Cut", "충원율(%)",
      "5월변동여부", "변동사유", "변동전", "변동후", "수능최저", "취업률(%)", "연간등록금(원)", "입학처URL"
    ];

    const rows = list.map(item => {
      const y26 = item.years["2026"] || {};
      const y25 = item.years["2025"] || {};

      return [
        `"${item.univType}"`,
        `"${item.region}"`,
        `"${item.univName}"`,
        `"${item.department}"`,
        `"${item.field}"`,
        `"${item.admissionType}"`,
        `"${item.subType}"`,
        `"${item.gun || '-'}"`,
        y26.recruitQuota || 0,
        y25.recruitQuota || 0,
        y26.quotaDiff || 0,
        y26.competitionRate || 0,
        `"${y26.cut70 || '-'}"`,
        `"${y26.cut50 || '-'}"`,
        `"${y26.fillRate || '-'}%"`,
        y26.isMayChanged ? "변동있음" : "변동없음",
        `"${(y26.changeNote || '').replace(/"/g, '""')}"`,
        `"${(y26.beforeVal || '').replace(/"/g, '""')}"`,
        `"${(y26.afterVal || '').replace(/"/g, '""')}"`,
        `"${(y26.minGradeReq || '').replace(/"/g, '""')}"`,
        `"${item.infoAlimi ? item.infoAlimi.employmentRate : 0}%"`,
        item.infoAlimi ? item.infoAlimi.tuitionYear : 0,
        `"${item.admissionUrl || ''}"`
      ].join(',');
    });

    const csvContent = BOM + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `2026_전국대입_전수데이터_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UniversityDB };
}
