// 학생 성적 계산 및 점수 환산 엔진
// 내신 등급 산출(전과목, 국영수사과, 진로선택 A/B/C 환산) 및 수능 백분위/표준점수 분석 (메가스터디/김영일 배치표 연계)

const ScoreCalculator = {
  // 내신 평균 및 환산 등급 계산
  calculateGPA: function(grades) {
    const coreGrades = [grades.kor, grades.math, grades.eng, grades.soc, grades.sci].filter(g => g > 0);
    if (coreGrades.length === 0) return { coreAvg: 0, totalAvg: 0, convertedGrade: 0 };

    const coreAvg = coreGrades.reduce((a, b) => a + b, 0) / coreGrades.length;
    
    let totalGrades = [...coreGrades];
    if (grades.others > 0) totalGrades.push(grades.others);
    const totalAvg = totalGrades.reduce((a, b) => a + b, 0) / totalGrades.length;

    // 진로선택과목 보정 (A는 등급 보너스 -0.05, B는 0, C는 +0.1)
    const careerBonus = (grades.careerA || 0) * 0.05 - (grades.careerC || 0) * 0.08;
    const convertedGrade = Math.max(1.0, Math.min(9.0, Number((coreAvg - careerBonus).toFixed(2))));

    return {
      coreAvg: Number(coreAvg.toFixed(2)),
      totalAvg: Number(totalAvg.toFixed(2)),
      convertedGrade: convertedGrade
    };
  },

  // 수능 백분위 및 표준점수 분석
  calculateCSAT: function(csat) {
    const pctList = [csat.korPct, csat.mathPct, (csat.tam1Pct + csat.tam2Pct) / 2].filter(p => p > 0);
    const avgPct = pctList.length > 0 ? (pctList.reduce((a, b) => a + b, 0) / pctList.length) : 0;
    
    // 국수탐 국수영탐 표준점수 합
    const totalStd = (csat.korStd || 0) + (csat.mathStd || 0) + (csat.tam1Std || 0) + (csat.tam2Std || 0);

    return {
      avgPercentile: Number(avgPct.toFixed(1)),
      totalStandardScore: totalStd,
      sumPercentile: Number((avgPct * 3).toFixed(1)),
      englishGrade: csat.engGrade || 1,
      historyGrade: csat.histGrade || 1
    };
  },

  // 특정 대학/전형에 대한 합격 가능성 판정 (상향 / 적정 / 안정 / 위험)
  evaluateChance: function(studentData, uniItem) {
    const latestYearData = uniItem.years["2026"] || uniItem.years["2025"];
    if (!latestYearData) return { status: "판정불가", scoreDiff: 0, badgeClass: "badge-gray", probability: 50 };

    if (uniItem.admissionType.includes("수시")) {
      // 수시: 학생 내신과 70% Cut 비교
      const studentGrade = studentData.convertedGrade || studentData.coreAvg || 3.0;
      const cut70 = latestYearData.cut70 || latestYearData.cut50;

      const diff = cut70 - studentGrade; // 양수: 안정, 음수: 상향

      if (diff >= 0.25) {
        return { status: "안정", label: "안정 지원 (합격 확률 85% 이상)", scoreDiff: diff.toFixed(2), badgeClass: "badge-safe", probability: 90 };
      } else if (diff >= -0.15) {
        return { status: "적정", label: "적정 소신 (합격 확률 60~85%)", scoreDiff: diff.toFixed(2), badgeClass: "badge-fair", probability: 70 };
      } else if (diff >= -0.45) {
        return { status: "상향", label: "도전 상향 (합격 확률 30~60%)", scoreDiff: diff.toFixed(2), badgeClass: "badge-challenge", probability: 45 };
      } else {
        return { status: "위험", label: "위험 상향 (합격 확률 30% 미만)", scoreDiff: diff.toFixed(2), badgeClass: "badge-risk", probability: 20 };
      }
    } else {
      // 정시: 메가스터디/김영일 정시 배치 표준점수 및 백분위 기준선 연동
      const studentStd = studentData.totalStandardScore || 370;
      const studentPct = studentData.avgPercentile || 80.0;
      
      let diff = 0;
      if (uniItem.jeongsiCut && uniItem.jeongsiCut.stdScore) {
        // 표준점수 기준 배치선 비교 (국+수+탐 3영역 또는 국+수+영+탐)
        const targetStd = uniItem.jeongsiCut.stdScore;
        diff = studentStd - targetStd;

        if (diff >= 3) {
          return { status: "안정", label: `정시 안정 (+${diff}점 여유)`, scoreDiff: `+${diff}점`, badgeClass: "badge-safe", probability: 88 };
        } else if (diff >= -3) {
          return { status: "적정", label: `정시 적정 소신 (${diff >= 0 ? '+' : ''}${diff}점)`, scoreDiff: `${diff >= 0 ? '+' : ''}${diff}점`, badgeClass: "badge-fair", probability: 68 };
        } else if (diff >= -8) {
          return { status: "상향", label: `정시 도전 상향 (${diff}점 격차)`, scoreDiff: `${diff}점`, badgeClass: "badge-challenge", probability: 42 };
        } else {
          return { status: "위험", label: `정시 위험 (${diff}점 격차)`, scoreDiff: `${diff}점`, badgeClass: "badge-risk", probability: 20 };
        }
      } else {
        // 백분위 기준 비교
        const cut70 = latestYearData.cut70 || latestYearData.cut50;
        diff = studentPct - cut70;

        if (diff >= 2.0) {
          return { status: "안정", label: "정시 안정 (합격 확률 85% 이상)", scoreDiff: diff.toFixed(1), badgeClass: "badge-safe", probability: 90 };
        } else if (diff >= -1.5) {
          return { status: "적정", label: "정시 적정 소신 (합격 확률 60~85%)", scoreDiff: diff.toFixed(1), badgeClass: "badge-fair", probability: 70 };
        } else if (diff >= -4.0) {
          return { status: "상향", label: "정시 도전 상향 (합격 확률 30~60%)", scoreDiff: diff.toFixed(1), badgeClass: "badge-challenge", probability: 45 };
        } else {
          return { status: "위험", label: "정시 위험 (합격 확률 30% 미만)", scoreDiff: diff.toFixed(1), badgeClass: "badge-risk", probability: 20 };
        }
      }
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ScoreCalculator };
}
