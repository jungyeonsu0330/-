// 5월 확정 모집요강 변동사항 자동 추적 데이터셋
// 매년 5월 각 대학 입학처에서 확정 공지하는 수시/정시 모집요강의 전년 대비 변동사항을 비교·분석한 데이터

const MAY_ADMISSION_CHANGES_DATA = [
  {
    id: "may-2026-001",
    univName: "연세대학교",
    univType: "4년제",
    department: "전체 (인문/자연)",
    admissionType: "수시",
    subType: "학생부교과(추천형)",
    changeType: "전형요소/수능최저 개편",
    importance: "CRITICAL",
    beforeChange: "1단계: 교과 100% (5배수) + 2단계: 1단계 70% + 면접 30% (수능최저 없음)",
    afterChange: "일괄합산: 학생부 교과 100% (면접 폐지) + 수능최저학력기준 신설 (국수탐 중 2합4, 영3, 한4)",
    impactScore: 5,
    consultantTip: "면접 부담으로 지원을 꺼리던 내신 최상위권의 지원이 몰릴 것으로 예상되며, 수능최저 충족 여부가 실질 합격의 결정타가 됨."
  },
  {
    id: "may-2026-002",
    univName: "고려대학교",
    univType: "4년제",
    department: "자유전공학부(무전공)",
    admissionType: "수시",
    subType: "학생부교과(학교추천)",
    changeType: "모집정원 대폭 순증",
    importance: "CRITICAL",
    beforeChange: "모집인원 38명 선발",
    afterChange: "정부 무전공 활성화 정책에 따라 14명 증원되어 총 52명 선발",
    impactScore: 4,
    consultantTip: "모집인원 증가로 내신 컷이 전년도 1.3대에서 1.4 초중반까지 소폭 완화될 여지가 있으므로 상향 소신 지원 카드로 적합."
  },
  {
    id: "may-2026-003",
    univName: "서울대학교",
    univType: "4년제",
    department: "공과대학 / 자연과학대학",
    admissionType: "수시",
    subType: "학생부종합(지역균형)",
    changeType: "수능최저 과탐 필수응시 완화",
    importance: "HIGH",
    beforeChange: "과학탐구 서로 다른 Ⅰ+Ⅱ 또는 Ⅱ+Ⅱ 필수 응시 조건 엄격 적용",
    afterChange: "물리/화학 중 1과목 필수 응시 조건 유지하되, Ⅰ+Ⅰ 조합 허용으로 탐구 조합 장벽 완화",
    impactScore: 4,
    consultantTip: "과탐Ⅱ 선택 부담이 줄어들어 일반고 최상위권 전교 1등 학생들의 지균 지원 풀이 대폭 확대될 전망."
  },
  {
    id: "may-2026-004",
    univName: "한양대학교",
    univType: "4년제",
    department: "전체 모집단위",
    admissionType: "수시",
    subType: "학생부종합",
    changeType: "전형 트랙 3분할 개편",
    importance: "HIGH",
    beforeChange: "학생부종합(일반) 단일 전형으로 서류 100% 선발",
    afterChange: "학생부종합을 '추천형', '서류형', '면접형' 3개 세부 전형으로 분할 신설",
    impactScore: 5,
    consultantTip: "내신 성적이 압도적이면 추천형, 생기부 활동 심화도가 높다면 서류형, 면접 역량이 뛰어나다면 면접형으로 분산 지원 가능."
  },
  {
    id: "may-2026-005",
    univName: "성균관대학교",
    univType: "4년제",
    department: "인문/사회/자연계열",
    admissionType: "정시",
    subType: "수능(가/나/다군)",
    changeType: "다군 선발 확대 및 탐구 변표 개편",
    importance: "HIGH",
    beforeChange: "가군, 나군 위주 분할 선발",
    afterChange: "다군에서 에너지학, 반도체융합 등 첨단학과 신설 선발 및 사/과탐 통합 변환표준점수 산출",
    impactScore: 4,
    consultantTip: "정시 다군의 만성적 선택지 부족 현상을 해소하며 중앙대 다군과 더불어 최상위권의 필수 안전/소신 카드로 부상."
  },
  {
    id: "may-2026-006",
    univName: "동양미래대학교",
    univType: "2·3년제 전문대",
    department: "컴퓨터소프트웨어공학과",
    admissionType: "수시1차",
    subType: "일반고전형",
    changeType: "정원 증원 및 트랙 신설",
    importance: "MEDIUM",
    beforeChange: "정원 55명, 전통적 소프트웨어 개발 과정 운영",
    afterChange: "정원 10명 증원(총 65명), AI 소프트웨어 및 클라우드 트랙 교육과정 개편",
    impactScore: 3,
    consultantTip: "수도권 전문대 IT 선호도가 매우 높으나 정원이 18% 증가하여 3등급 중후반 학생들의 합격 가능성 상승."
  },
  {
    id: "may-2026-007",
    univName: "삼육보건대학교",
    univType: "2·3년제 전문대",
    department: "간호학과(4년제 과정)",
    admissionType: "수시1차",
    subType: "일반고전형",
    changeType: "보건복지부 인가 정원 증원",
    importance: "HIGH",
    beforeChange: "수시1차 일반고 50명 선발",
    afterChange: "수도권 간호 인력 확충 인가로 5명 증원 (총 55명 선발)",
    impactScore: 4,
    consultantTip: "전문대 간호학과는 졸업 시 4년제 학사학위가 수여되어 인기가 매우 높음. 5명 증원으로 추합 회차가 3~5번 더 돌 것으로 예상."
  },
  {
    id: "may-2026-008",
    univName: "충남대학교",
    univType: "4년제",
    department: "간호학과",
    admissionType: "수시",
    subType: "학생부교과(일반/지역인재)",
    changeType: "지역인재 선발비율 상향",
    importance: "HIGH",
    beforeChange: "지역인재 선발 비율 50%",
    afterChange: "지역인재 선발 비율 65%로 확대 (충청권 고교 졸업자 우선 혜택)",
    impactScore: 4,
    consultantTip: "대전·세종·충남·충북 지역 고교생은 일반전형 대비 약 0.3~0.5등급 낮은 내신으로도 과감히 합격권 노림수 가능."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MAY_ADMISSION_CHANGES_DATA };
}
