// 6수시 & 3정시 최적 포트폴리오 자동 추천 엔진
// 4년제 6수시 + 3정시(가/나/다군) + 전문대 무제한 추천, 수능최저 위험도 진단

const AdmissionRecommender = {
  // 6수시 추천 포트폴리오 생성
  generateSusiPortfolio: function(studentProfile, targetField, targetRegion) {
    let pool = [...UNIVERSITIES_4Y_DATA].filter(item => item.admissionType.includes("수시"));
    
    // 계열 및 지역 필터
    if (targetField && targetField !== "전체") {
      const tokens = targetField.split(/[\/\s,]+/);
      pool = pool.filter(item => tokens.some(tok => item.field.includes(tok)) || item.field.includes("자율전공"));
    }
    if (targetRegion && targetRegion !== "전체" && targetRegion !== "전국") {
      const regionPool = pool.filter(item => item.region === targetRegion);
      if (regionPool.length >= 6) pool = regionPool;
    }

    // 각 대학별 찬스 평가
    const evaluatedList = pool.map(item => {
      const evaluation = ScoreCalculator.evaluateChance(studentProfile, item);
      const minReqRisk = this.checkMinGradeRisk(studentProfile.csat, item.years["2026"].minGradeReq);
      return {
        ...item,
        evaluation,
        minReqRisk
      };
    });

    // 상향, 적정, 안정으로 분류
    const challenge = evaluatedList.filter(item => item.evaluation.status === "상향" || item.evaluation.status === "위험");
    const fair = evaluatedList.filter(item => item.evaluation.status === "적정");
    const safe = evaluatedList.filter(item => item.evaluation.status === "안정");

    // 최적 6수시 카드 조합 (도전상향 2개 + 적정 2개 + 안정 2개)
    const portfolio = [];
    
    const topChallenge = challenge.slice(0, 2);
    portfolio.push(...topChallenge.map(c => ({ ...c, cardType: "도전 상향", slot: "카드 1~2" })));

    const topFair = fair.slice(0, 2);
    portfolio.push(...topFair.map(f => ({ ...f, cardType: "적정 소신", slot: "카드 3~4" })));

    const topSafe = safe.slice(0, 2);
    portfolio.push(...topSafe.map(s => ({ ...s, cardType: "안정 하향", slot: "카드 5~6" })));

    // 부족할 경우 채우기
    while (portfolio.length < 6 && evaluatedList.length > portfolio.length) {
      const remaining = evaluatedList.find(item => !portfolio.some(p => p.id === item.id));
      if (remaining) {
        portfolio.push({ ...remaining, cardType: remaining.evaluation.status, slot: `카드 ${portfolio.length + 1}` });
      } else {
        break;
      }
    }

    return portfolio;
  },

  // 3정시 (가군 1장 + 나군 1장 + 다군 1장) 최적 포트폴리오 생성
  generateJeongsiPortfolio: function(studentProfile, targetField) {
    let pool = [...UNIVERSITIES_4Y_DATA].filter(item => item.admissionType === "정시" || (item.gun && item.gun.includes("군")));
    
    if (targetField && targetField !== "전체") {
      const tokens = targetField.split(/[\/\s,]+/);
      const filtered = pool.filter(item => tokens.some(tok => item.field.includes(tok)) || item.field.includes("자율전공"));
      if (filtered.length >= 3) pool = filtered;
    }

    const evaluatedPool = pool.map(item => {
      const evaluation = ScoreCalculator.evaluateChance(studentProfile, item);
      return {
        ...item,
        evaluation
      };
    });

    const portfolio = [];

    // 1. 가군 선별 (상향 또는 적정 소신 카드)
    const gaCandidates = evaluatedPool.filter(item => item.gun && item.gun.includes("가군"));
    const gaCard = gaCandidates.find(c => c.evaluation.status === "적정") || gaCandidates.find(c => c.evaluation.status === "상향") || gaCandidates[0];
    if (gaCard) {
      portfolio.push({ ...gaCard, gunSlot: "[가군] 1번 카드", strategy: gaCard.evaluation.status === "상향" ? "도전 소신" : "적정 합격" });
    }

    // 2. 나군 선별 (적정 또는 안정 카드)
    const naCandidates = evaluatedPool.filter(item => item.gun && item.gun.includes("나군"));
    const naCard = naCandidates.find(c => c.evaluation.status === "적정") || naCandidates.find(c => c.evaluation.status === "안정") || naCandidates[0];
    if (naCard) {
      portfolio.push({ ...naCard, gunSlot: "[나군] 2번 카드", strategy: naCard.evaluation.status === "안정" ? "안전 합격" : "소신 적정" });
    }

    // 3. 다군 선별 (적정 또는 안정 합격 카드 - 충원율 우수 대학)
    const daCandidates = evaluatedPool.filter(item => item.gun && item.gun.includes("다군"));
    const daCard = daCandidates.find(c => c.evaluation.status === "안정") || daCandidates.find(c => c.evaluation.status === "적정") || daCandidates[0];
    if (daCard) {
      portfolio.push({ ...daCard, gunSlot: "[다군] 3번 카드", strategy: "안정 백업 (충원율 활용)" });
    }

    return portfolio;
  },

  // 전문대(2·3년제) 특화 맞춤 추천 (취업률 및 유망 학과 중심)
  generateCollegeRecommendations: function(studentProfile, targetField) {
    let pool = [...COLLEGES_23Y_DATA];
    if (targetField && targetField !== "전체" && targetField !== "전국") {
      const tokens = targetField.split(/[\/\s,]+/);
      const filtered = pool.filter(item => tokens.some(tok => item.field.includes(tok)) || item.field.includes("간호") || item.field.includes("보건"));
      if (filtered.length > 0) pool = filtered;
    }

    return pool.map(item => {
      const evaluation = ScoreCalculator.evaluateChance(studentProfile, item);
      return {
        ...item,
        evaluation,
        advantageText: "4년제 수시 6회 미적용 · 취업률 " + item.infoAlimi.employmentRate + "%"
      };
    }).sort((a, b) => b.infoAlimi.employmentRate - a.infoAlimi.employmentRate);
  },

  // 수능 최저학력기준 위험도 진단
  checkMinGradeRisk: function(csat, minReqString) {
    if (!minReqString || minReqString.includes("없음")) {
      return { status: "SAFE", label: "최저기준 없음", color: "#10b981" };
    }

    if (!csat) {
      return { status: "WARNING", label: "모의고사 미입력 (위험)", color: "#f59e0b" };
    }

    const grades = [csat.korGrade || 3, csat.mathGrade || 3, csat.engGrade || 3, csat.tam1Grade || 3, csat.tam2Grade || 3].sort((a, b) => a - b);
    const sum3 = grades[0] + grades[1] + grades[2];
    const sum2 = grades[0] + grades[1];

    if (minReqString.includes("3개") && minReqString.includes("5")) {
      return sum3 <= 5 ? { status: "SAFE", label: "충족 가능 (현재 등급합 " + sum3 + ")", color: "#10b981" } : { status: "DANGER", label: "충족 위험 (현재 등급합 " + sum3 + "/목표 5)", color: "#ef4444" };
    } else if (minReqString.includes("3개") && minReqString.includes("7")) {
      return sum3 <= 7 ? { status: "SAFE", label: "충족 안정 (현재 등급합 " + sum3 + ")", color: "#10b981" } : { status: "WARNING", label: "경계선 (현재 등급합 " + sum3 + "/목표 7)", color: "#f59e0b" };
    } else if (minReqString.includes("2개") && minReqString.includes("4")) {
      return sum2 <= 4 ? { status: "SAFE", label: "충족 안정 (현재 2합 " + sum2 + ")", color: "#10b981" } : { status: "DANGER", label: "충족 위험 (현재 2합 " + sum2 + "/목표 4)", color: "#ef4444" };
    } else if (minReqString.includes("2개") && minReqString.includes("5")) {
      return sum2 <= 5 ? { status: "SAFE", label: "충족 안정 (현재 2합 " + sum2 + ")", color: "#10b981" } : { status: "WARNING", label: "경계선 (현재 2합 " + sum2 + "/목표 5)", color: "#f59e0b" };
    }

    return { status: "SAFE", label: "최저 요건 충족", color: "#10b981" };
  }
};
