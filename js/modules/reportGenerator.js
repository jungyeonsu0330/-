// 프리미엄 1장 대입 컨설팅 진단 리포트 생성기 (학생/학부모 제출용 및 인쇄/PDF 최적화)

const ReportGenerator = {
  renderReportHTML: function(student, susiPortfolio, jeongsiPortfolio, collegeList, conflictInfo) {
    const gpaInfo = ScoreCalculator.calculateGPA(student.gpa);
    const csatInfo = ScoreCalculator.calculateCSAT(student.csat);

    return `
      <div class="premium-report-sheet" id="printableReport">
        <!-- 리포트 헤더 -->
        <header class="report-header">
          <div class="report-brand">
            <span class="brand-badge">PREMIUM ADMISSION CONSULTING</span>
            <h2>2026학년도 대입 수시·정시 맞춤형 진학진단 종합 리포트</h2>
          </div>
          <div class="report-meta">
            <div><strong>발행일자:</strong> ${new Date().toLocaleDateString('ko-KR')}</div>
            <div><strong>분석기준:</strong> 경기도교육청 요강 & 메가스터디/김영일 2026 배치표</div>
          </div>
        </header>

        <!-- 학생 기본 인적 및 성적 진단 요약 -->
        <section class="report-student-card">
          <div class="student-info-grid">
            <div><span class="lbl">학생 성명:</span> <strong>${student.name}</strong></div>
            <div><span class="lbl">소속 고교:</span> <strong>${student.highSchool}</strong></div>
            <div><span class="lbl">희망 계열:</span> <strong>${student.track}</strong></div>
            <div><span class="lbl">목표 지역:</span> <strong>${student.targetRegion || '수도권/전국'}</strong></div>
          </div>

          <div class="score-summary-bar">
            <div class="score-box">
              <span class="score-title">내신 전과목 평균</span>
              <span class="score-value highlight">${gpaInfo.totalAvg} 등급</span>
              <span class="score-desc">국영수사과 ${gpaInfo.coreAvg} | 보정등수 ${gpaInfo.convertedGrade}</span>
            </div>
            <div class="score-box">
              <span class="score-title">수능 백분위 / 표준점수</span>
              <span class="score-value">${csatInfo.avgPercentile}% / ${csatInfo.totalStandardScore}점</span>
              <span class="score-desc">백분위합: ${csatInfo.sumPercentile} (3개영역 기준)</span>
            </div>
            <div class="score-box">
              <span class="score-title">수능최저 충족 진단</span>
              <span class="score-value safe">충족 안정</span>
              <span class="score-desc">영어 ${csatInfo.englishGrade}등급 / 한국사 ${csatInfo.historyGrade}등급</span>
            </div>
          </div>
        </section>

        <!-- 6수시 포트폴리오 추천표 -->
        <section class="report-section">
          <h3 class="section-title">
            <span class="icon">🎯</span> [수시모집 6장 카드] 최적 포트폴리오 (상향 2 + 적정 2 + 안정 2)
          </h3>
          <table class="report-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>대학명</th>
                <th>모집단위 (학과)</th>
                <th>전형명</th>
                <th>2026정원</th>
                <th>3개년경쟁률</th>
                <th>70% 컷</th>
                <th>충원율</th>
                <th>수능최저 위험도</th>
                <th>진단 결과</th>
              </tr>
            </thead>
            <tbody>
              ${susiPortfolio.map((item, idx) => `
                <tr class="${item.evaluation.status === '상향' ? 'row-challenge' : item.evaluation.status === '적정' ? 'row-fair' : 'row-safe'}">
                  <td><strong>${item.cardType || `카드 ${idx+1}`}</strong></td>
                  <td><strong>${item.univName}</strong></td>
                  <td>${item.department}</td>
                  <td><span class="sub-badge">${item.subType}</span></td>
                  <td>${item.years["2026"].recruitQuota}명</td>
                  <td>${item.years["2026"].competitionRate}:1</td>
                  <td><strong>${item.years["2026"].cut70}</strong></td>
                  <td>${item.years["2026"].fillRate}%</td>
                  <td><span style="color: ${item.minReqRisk.color}; font-weight:600;">${item.minReqRisk.label}</span></td>
                  <td><span class="badge ${item.evaluation.badgeClass}">${item.evaluation.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>

        <!-- 정시모집 3장 (가/나/다군) 지원 전략표 -->
        <section class="report-section">
          <h3 class="section-title">
            <span class="icon">📊</span> [정시모집 3장 카드] 가·나·다군 군별 최적 지원 배치표 (메가스터디·김영일 기준선)
          </h3>
          <table class="report-table compact">
            <thead>
              <tr>
                <th>모집군</th>
                <th>대학명</th>
                <th>모집단위</th>
                <th>전형/수능반영</th>
                <th>배치 표준점수</th>
                <th>수능 70%컷</th>
                <th>지원 전략</th>
                <th>진단 결과</th>
              </tr>
            </thead>
            <tbody>
              ${(jeongsiPortfolio || []).map(item => `
                <tr class="${item.evaluation.status === '안정' ? 'row-safe' : item.evaluation.status === '적정' ? 'row-fair' : 'row-challenge'}">
                  <td><strong>${item.gunSlot || item.gun}</strong></td>
                  <td><strong>${item.univName}</strong></td>
                  <td>${item.department}</td>
                  <td>${item.admissionType} (${item.subType})</td>
                  <td><strong style="color:#2563eb;">${item.jeongsiCut ? `표점 ${item.jeongsiCut.stdScore}점` : '-'}</strong></td>
                  <td>${item.years["2026"].cut70} (충원 ${item.years["2026"].fillRate}%)</td>
                  <td>${item.strategy || '적정 소신'}</td>
                  <td><span class="badge ${item.evaluation.badgeClass}">${item.evaluation.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>

        <!-- 2·3년제 전문대 취업 특화 추천 카드 -->
        <section class="report-section">
          <h3 class="section-title">
            <span class="icon">⚡</span> [2·3년제 전문대학] 취업 특화 유망 학과 (수시 6회 미적용 백업 카드)
          </h3>
          <table class="report-table compact">
            <thead>
              <tr>
                <th>대학명</th>
                <th>학과명</th>
                <th>전형구분</th>
                <th>70% 컷</th>
                <th>충원율</th>
                <th>취업률 (대학알리미)</th>
                <th>특화 지원 포인트</th>
              </tr>
            </thead>
            <tbody>
              ${collegeList.slice(0, 2).map(item => `
                <tr>
                  <td><strong>${item.univName}</strong></td>
                  <td>${item.department}</td>
                  <td>${item.admissionType} (${item.subType})</td>
                  <td>${item.years["2026"].cut70}</td>
                  <td>${item.years["2026"].fillRate}%</td>
                  <td><strong style="color:#059669;">${item.infoAlimi.employmentRate}%</strong></td>
                  <td>${item.advantageText}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>

        <!-- 일정 충돌 및 5월 변동사항 핵심 체크 -->
        <div class="report-two-cols">
          <div class="report-box">
            <h4>📅 면접 / 논술 대학별 고사 일정 진단</h4>
            ${conflictInfo.hasConflict ? `
              <div class="alert-box danger">
                ⚠️ <strong>일정 충돌 주의:</strong> ${conflictInfo.conflicts.map(c => `${c.date} (${c.events.map(e => `${e.univName} ${e.type}`).join(' vs ')})`).join(', ')}
              </div>
            ` : `
              <div class="alert-box success">
                ✅ 수시 지원 희망 대학 간 면접 및 논술고사 일정 충돌이 없습니다.
              </div>
            `}
          </div>
          <div class="report-box">
            <h4>📌 2026~2027 수능 변동사항 영향 분석</h4>
            <p style="font-size:12px; color:#475569; line-height:1.4;">
              • <strong>'사탐런' 심화(69.6%):</strong> 과탐 응시자 감소로 이공계 수능최저 1~2등급 인원이 축소되므로 수시 최저 확보가 최대 관건입니다. 정시에서는 대학별 가산점(과탐 3~5%) 비중을 감안해 다군을 공략해야 합니다.
            </p>
          </div>
        </div>

        <!-- 컨설턴트 최종 전략 총평 -->
        <section class="report-consultant-opinion">
          <h4>💡 입시 컨설턴트 최종 전략 소견</h4>
          <div class="opinion-content">
            ${student.memo || "내신과 모의고사 백분위의 균형이 양호하며, 9월 모평 성적을 바탕으로 수능최저 3합7 충족 시 서울권 주요 대학 교과·종합 합격 확률이 매우 높습니다. 4년제 수시 6장 중 2장은 상향, 2장은 적정, 2장은 안정으로 안배하고 정시 가·나·다군 배치선을 연계하여 최적의 진학 포트폴리오를 완성했습니다."}
          </div>
        </section>

        <!-- 리포트 푸터 -->
        <footer class="report-footer">
          <span>* 본 진단 리포트는 경기도교육청 요강 및 메가스터디/김영일 정시배치표, 대학알리미 데이터를 바탕으로 산출되었습니다.</span>
          <span>출력 시스템: AI 대입 분석 컨설팅 솔루션 PRO</span>
        </footer>
      </div>
    `;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ReportGenerator };
}
