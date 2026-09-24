// 대입(대학입학) 및 고입(고교입학) 공식 핵심 일정 통합 데이터셋
// 기준: 2027학년도 (현 고3/중3) 및 2028학년도 (현 고2/중2) 중심
// 출처: 교육부, 한국대학교育협의회(대교협), 한국전문대학교육협의회(전문대교협), 대학어디가(adiga.kr),
//       고입정보포털 하이스쿨(hischool.go.kr), 서울특별시교육청 하이인포(hinfo.sen.go.kr)

const ADMISSION_SCHEDULE_DATA_BY_YEAR = {
  // 1. 2027학년도 대입 (현 고3 / N수생 대상 - 2026년 하반기~2027년 초 전형 시행, 2027년 3월 입학)
  "2027": [
    {
      id: "univ-2027-susi-4y",
      event: "2027 수시모집 원서접수 (4년제)",
      date: "2026-09-07",
      endDate: "2026-09-11",
      type: "4년제",
      category: "수시",
      highlight: true,
      note: "전국 4년제 대학 중 대학별 3일 이상 접수 진행 (수시 6회 제한 적용)"
    },
    {
      id: "univ-2027-susi-col1",
      event: "전문대학 2027 수시 1차 원서접수",
      date: "2026-09-07",
      endDate: "2026-09-29",
      previousDate: "2026-09-07 ~ 2026-09-28",
      type: "전문대",
      category: "수시",
      isChanged: true,
      changeType: "일정 연장",
      changeReason: "전문대교협 5월 확정 모집요강 반영: 수험생 접수 편의를 위해 마감일이 9월 29일로 1일 연장 확정됨",
      note: "전국 전문대학 동일 일정 진행 (수시 6회 제한 미적용, 복수지원 무제한)"
    },
    {
      id: "univ-2027-susi-col2",
      event: "전문대학 2027 수시 2차 원서접수",
      date: "2026-11-06",
      endDate: "2026-11-20",
      type: "전문대",
      category: "수시",
      note: "수능 전후 전문대 2차 접수 기회"
    },
    {
      id: "univ-2027-suneung",
      event: "2027학년도 대학수학능력시험(수능)",
      date: "2026-11-19",
      endDate: "2026-11-19",
      type: "전체",
      category: "수능",
      highlight: true,
      note: "2026년 11월 셋째 주 목요일 전국 동시 시행"
    },
    {
      id: "univ-2027-score",
      event: "수능 성적 통지일",
      date: "2026-12-11",
      endDate: "2026-12-11",
      type: "전체",
      category: "수능",
      note: "표준점수, 백분위, 등급 기재 성적통지표 발급"
    },
    {
      id: "univ-2027-susi-pass",
      event: "수시 합격자 발표 마감",
      date: "2026-12-18",
      endDate: "2026-12-18",
      type: "전체",
      category: "수시",
      note: "각 대학 입학처 홈페이지 최초합격자 발표 마감"
    },
    {
      id: "univ-2027-susi-reg",
      event: "수시 합격자 등록 기간",
      date: "2026-12-21",
      endDate: "2026-12-23",
      type: "전체",
      category: "수시",
      note: "3일간 예치금 또는 문서등록 진행"
    },
    {
      id: "univ-2027-susi-chu1",
      event: "수시 미등록 충원(추가합격) 통보 마감",
      date: "2026-12-29",
      endDate: "2026-12-29",
      type: "전체",
      category: "수시",
      note: "18:00까지 개별 통보 마감"
    },
    {
      id: "univ-2027-susi-chu2",
      event: "수시 충원 등록 마감 및 정시 이월인원 확정",
      date: "2026-12-30",
      endDate: "2026-12-30",
      type: "전체",
      category: "수시",
      note: "22:00 최종 마감 후 각 대학 정시 이월인원 확정 공고"
    },
    {
      id: "univ-2027-jungsi-4y",
      event: "2027 정시모집 원서접수 (4년제 가/나/다군)",
      date: "2027-01-04",
      endDate: "2027-01-08",
      previousDate: "2026-12-28 ~ 2027-01-02",
      type: "4년제",
      category: "정시",
      highlight: true,
      isChanged: true,
      changeType: "원서접수 변동",
      changeReason: "대교협 5월 확정 대입기본일정 변경 공고: 수시 충원 일정 고려하여 접수 시작일이 2027년 1월 4일로 최종 조정 확정됨",
      note: "전국 4년제 대학 중 대학별 3일 이상 접수 진행"
    },
    {
      id: "univ-2027-jungsi-col",
      event: "전문대학 2027 정시모집 원서접수",
      date: "2027-01-04",
      endDate: "2027-01-18",
      previousDate: "2026-12-28 ~ 2027-01-12",
      type: "전문대",
      category: "정시",
      isChanged: true,
      changeType: "일정 조정",
      changeReason: "전문대교협 확정 요강: 4년제 정시 일정 조정에 맞추어 2027.01.04 ~ 01.18로 동기화 확정",
      note: "전국 전문대학 정시 접수 (군 제한 없이 복수지원 가능)"
    },
    {
      id: "univ-2027-jungsi-pass",
      event: "정시 최초 합격자 발표 마감",
      date: "2027-02-08",
      endDate: "2027-02-08",
      type: "전체",
      category: "정시",
      note: "각 대학 홈페이지 공고"
    },
    {
      id: "univ-2027-jungsi-reg",
      event: "정시 합격자 등록 기간",
      date: "2027-02-09",
      endDate: "2027-02-11",
      type: "전체",
      category: "정시",
      note: "3일간 본등록"
    },
    {
      id: "univ-2027-jungsi-chu",
      event: "정시 미등록 충원(추합) 통보/등록 마감",
      date: "2027-02-18",
      endDate: "2027-02-18",
      type: "전체",
      category: "정시",
      note: "통보 2/18 18시 마감"
    },
    {
      id: "univ-2027-extra",
      event: "2027 추가모집 원서접수 및 전형",
      date: "2027-02-19",
      endDate: "2027-02-26",
      type: "4년제",
      category: "추가모집",
      note: "수시/정시 미등록 결원 발생 대학 선발 (마감 2/26 22시)"
    }
  ],

  // 2. 2028학년도 대입 (현 고2 대상 - 2027년 하반기~2028년 초 전형 시행, 2028년 3월 입학, 2028 대입 개편안 첫 적용)
  "2028": [
    {
      id: "univ-2028-susi-4y",
      event: "2028 수시모집 원서접수 (4년제)",
      date: "2027-09-06",
      endDate: "2027-09-10",
      type: "4년제",
      category: "수시",
      highlight: true,
      note: "2028 대입개편안(내신 5등급제) 최초 적용 수시모집"
    },
    {
      id: "univ-2028-susi-col1",
      event: "전문대학 2028 수시 1차 원서접수",
      date: "2027-09-06",
      endDate: "2027-09-28",
      type: "전문대",
      category: "수시",
      note: "전국 전문대학 동일 일정 진행"
    },
    {
      id: "univ-2028-susi-col2",
      event: "전문대학 2028 수시 2차 원서접수",
      date: "2027-11-05",
      endDate: "2027-11-19",
      type: "전문대",
      category: "수시",
      note: "전문대 2차 접수"
    },
    {
      id: "univ-2028-suneung",
      event: "2028학년도 대학수학능력시험(통합형 수능)",
      date: "2027-11-18",
      endDate: "2027-11-18",
      type: "전체",
      category: "수능",
      highlight: true,
      isChanged: true,
      changeType: "수능 체제 개편",
      changeReason: "2028 대입제도 개편안 확정: 문이과 통합사회·통합과학 및 공통수학/국어로 전면 개편 시행",
      note: "선택과목 폐지! 모든 수험생 동일 공통과목 시험 실시"
    },
    {
      id: "univ-2028-score",
      event: "2028 수능 성적 통지일",
      date: "2027-12-10",
      endDate: "2027-12-10",
      type: "전체",
      category: "수능",
      note: "통합형 수능 성적표 통지"
    },
    {
      id: "univ-2028-susi-pass",
      event: "수시 합격자 발표 마감",
      date: "2027-12-17",
      endDate: "2027-12-17",
      type: "전체",
      category: "수시",
      note: "수시 최초합격자 발표"
    },
    {
      id: "univ-2028-susi-reg",
      event: "수시 합격자 등록 기간",
      date: "2027-12-20",
      endDate: "2027-12-22",
      type: "전체",
      category: "수시",
      note: "3일간 수시 등록"
    },
    {
      id: "univ-2028-susi-chu",
      event: "수시 미등록 충원 및 정시 이월 확정",
      date: "2027-12-29",
      endDate: "2027-12-29",
      type: "전체",
      category: "수시",
      note: "수시 최종 마감 후 이월인원 공표"
    },
    {
      id: "univ-2028-jungsi-4y",
      event: "2028 정시모집 원서접수 (4년제)",
      date: "2028-01-03",
      endDate: "2028-01-07",
      type: "4년제",
      category: "정시",
      highlight: true,
      note: "통합 수능 기반 가/나/다군 정시모집"
    },
    {
      id: "univ-2028-jungsi-col",
      event: "전문대학 2028 정시모집 원서접수",
      date: "2028-01-03",
      endDate: "2028-01-17",
      type: "전문대",
      category: "정시",
      note: "전문대 정시 모집 진행"
    },
    {
      id: "univ-2028-jungsi-pass",
      event: "정시 합격자 발표 마감",
      date: "2028-02-07",
      endDate: "2028-02-07",
      type: "전체",
      category: "정시",
      note: "정시 최초 합격자 발표"
    },
    {
      id: "univ-2028-extra",
      event: "2028 추가모집 전형",
      date: "2028-02-18",
      endDate: "2028-02-25",
      type: "4년제",
      category: "추가모집",
      note: "2028 대입 최종 결원 충원"
    }
  ],

  // 3. 2026학년도 대입 (과거 기록 참조용)
  "2026": [
    {
      id: "univ-2026-susi-4y",
      event: "2026 수시모집 원서접수",
      date: "2025-09-08",
      endDate: "2025-09-12",
      type: "4년제",
      category: "수시",
      note: "종료된 전형 (2026학년도)"
    },
    {
      id: "univ-2026-suneung",
      event: "2026학년도 대학수학능력시험",
      date: "2025-11-13",
      endDate: "2025-11-13",
      type: "전체",
      category: "수능",
      note: "2025년 11월 시행 수능"
    },
    {
      id: "univ-2026-jungsi-4y",
      event: "2026 정시모집 원서접수",
      date: "2025-12-29",
      endDate: "2025-12-31",
      type: "4년제",
      category: "정시",
      note: "2026학년도 정시"
    }
  ]
};

const HIGHSCHOOL_SCHEDULE_DATA_BY_YEAR = {
  // 1. 2027학년도 고입 (현 중3 대상 - 2026년 하반기 전형 시행, 2027년 3월 고교 입학)
  "2027": [
    {
      id: "hs-2027-youngjae-apply",
      event: "2027 영재학교(8개교) 원서접수",
      date: "2026-05-25",
      endDate: "2026-06-01",
      type: "영재학교",
      category: "특차",
      highlight: true,
      note: "서울과고·경기과고·한과영 등 전국 8개교 (중복지원 불가)"
    },
    {
      id: "hs-2027-youngjae-test",
      event: "영재학교 2단계 영재성 검사(지필고사)",
      date: "2026-07-12",
      endDate: "2026-07-12",
      type: "영재학교",
      category: "특차",
      note: "전국 8개 영재학교 공동 지필고사 실시"
    },
    {
      id: "hs-2027-youngjae-camp",
      event: "영재학교 3단계 캠프 전형 및 최종 합격자 발표",
      date: "2026-08-01",
      endDate: "2026-08-21",
      type: "영재학교",
      category: "특차",
      note: "불합격 시 8월 말 전기 과학고 지원 가능"
    },
    {
      id: "hs-2027-science-apply",
      event: "2027 전기 과학고 원서접수 (전국 20개교)",
      date: "2026-08-24",
      endDate: "2026-09-02",
      type: "과학고",
      category: "전기고",
      highlight: true,
      note: "한성·세종·경기북과고 등 광역 단위 지원 (전기 1개교만 지원 가능)"
    },
    {
      id: "hs-2027-science-interview",
      event: "과학고 출석면담 및 서류평가",
      date: "2026-09-14",
      endDate: "2026-11-06",
      type: "과학고",
      category: "전기고",
      note: "자기주도학습역량 및 수학/과학 심층 평가"
    },
    {
      id: "hs-2027-arts-pe-apply",
      event: "예술고·체육고 원서접수",
      date: "2026-10-12",
      endDate: "2026-10-15",
      type: "예술·체육고",
      category: "전기고",
      note: "실기평가 및 면접 실시"
    },
    {
      id: "hs-2027-meister-apply",
      event: "마이스터고(산업수요맞춤형고) 원서접수",
      date: "2026-10-19",
      endDate: "2026-10-22",
      type: "마이스터고",
      category: "전기고",
      note: "전국 마이스터고 특별/일반전형"
    },
    {
      id: "hs-2027-special-apply",
      event: "특성화고 특별전형(취업희망자 등) 원서접수",
      date: "2026-11-20",
      endDate: "2026-11-23",
      type: "특성화고",
      category: "전기고",
      note: "자기소개서, 심층면접 위주 선발"
    },
    {
      id: "hs-2027-general-voc-apply",
      event: "특성화고 일반전형 원서접수",
      date: "2026-11-27",
      endDate: "2026-11-30",
      type: "특성화고",
      category: "전기고",
      note: "중학교 교과성적/출결 중심 선발"
    },
    {
      id: "hs-2027-science-pass",
      event: "과학고 소집면접 및 최종 합격자 발표",
      date: "2026-11-27",
      endDate: "2026-12-04",
      type: "과학고",
      category: "전기고",
      note: "합격 시 후기고(외고/자사고/일반고) 지원 불가"
    },
    {
      id: "hs-2027-jasa-nation-apply",
      event: "전국단위 자사고 원서접수",
      date: "2026-12-02",
      endDate: "2026-12-04",
      previousDate: "2026-12-03 ~ 2026-12-05",
      type: "자사고",
      category: "후기고",
      highlight: true,
      isChanged: true,
      changeType: "일정 변경",
      changeReason: "시도교육청 고입전형 기본계획 확정: 수요일~금요일(12/2~12/4)로 접수기간 1일 앞당겨짐",
      note: "외대부고·하나고·상산고·민사고·포항제철고 등 전국 10개교"
    },
    {
      id: "hs-2027-flang-jasa-apply",
      event: "외국어고·국제고 및 광역단위 자사고 원서접수",
      date: "2026-12-02",
      endDate: "2026-12-04",
      previousDate: "2026-12-03 ~ 2026-12-05",
      type: "외고·국제고",
      category: "후기고",
      isChanged: true,
      changeType: "일정 변경",
      changeReason: "교육청 고입일정 동기화: 전국단위 자사고와 동일 기간 접수",
      note: "대원·대일·한영외고 및 서울/경기 광역자사고"
    },
    {
      id: "hs-2027-general-apply",
      event: "후기 일반고·자율형공립고(교육감 선발) 원서접수",
      date: "2026-12-02",
      endDate: "2026-12-08",
      type: "일반고",
      category: "후기고",
      note: "외고/자사고 동시지원 학생의 2지망 접수 병행"
    },
    {
      id: "hs-2027-jasa-flang-pass",
      event: "자사고·외고·국제고 2단계 면접 및 최종 합격자 발표",
      date: "2026-12-18",
      endDate: "2026-12-24",
      type: "자사고·외고",
      category: "후기고",
      note: "학교별 홈페이지 최종 발표"
    },
    {
      id: "hs-2027-general-assign",
      event: "후기 일반고 배정 결과 발표",
      date: "2027-01-15",
      endDate: "2027-01-22",
      type: "일반고",
      category: "후기고",
      note: "시·도교육청 고입포털에서 고교 배정 통지서 발급"
    },
    {
      id: "hs-2027-extra-apply",
      event: "전기/후기 미달 고교 추가모집",
      date: "2027-01-18",
      endDate: "2027-02-12",
      type: "전체",
      category: "추가모집",
      note: "정원 미달 학교별 개별 원서접수"
    }
  ],

  // 2. 2028학년도 고입 (현 중2 대상 - 2027년 하반기 전형 시행, 2028년 3월 고교 입학)
  "2028": [
    {
      id: "hs-2028-youngjae-apply",
      event: "2028 영재학교 원서접수",
      date: "2027-05-24",
      endDate: "2027-05-31",
      type: "영재학교",
      category: "특차",
      highlight: true,
      note: "전국 8개 영재학교 접수 예정"
    },
    {
      id: "hs-2028-youngjae-test",
      event: "영재학교 2단계 영재성 검사",
      date: "2027-07-11",
      endDate: "2027-07-11",
      type: "영재학교",
      category: "특차",
      note: "2단계 지필고사"
    },
    {
      id: "hs-2028-science-apply",
      event: "2028 전기 과학고 원서접수",
      date: "2027-08-23",
      endDate: "2027-09-01",
      type: "과학고",
      category: "전기고",
      highlight: true,
      note: "전국 20개 과학고 지원"
    },
    {
      id: "hs-2028-meister-apply",
      event: "마이스터고 및 특성화고 원서접수",
      date: "2027-10-18",
      endDate: "2027-11-22",
      type: "특성화고",
      category: "전기고",
      note: "직업계고 전기 전형"
    },
    {
      id: "hs-2028-jasa-apply",
      event: "2028 후기 자사고·외고·국제고 원서접수",
      date: "2027-12-01",
      endDate: "2027-12-03",
      type: "자사고·외고",
      category: "후기고",
      highlight: true,
      note: "자기주도학습전형 원서접수"
    },
    {
      id: "hs-2028-general-apply",
      event: "2028 후기 일반고 원서접수 및 배정",
      date: "2027-12-01",
      endDate: "2028-01-21",
      type: "일반고",
      category: "후기고",
      note: "후기 일반고 전형"
    }
  ],

  // 3. 2026학년도 고입 (과거 참조용)
  "2026": [
    {
      id: "hs-2026-youngjae-apply",
      event: "2026 영재학교 원서접수",
      date: "2025-05-26",
      endDate: "2025-06-02",
      type: "영재학교",
      category: "특차",
      note: "2025년 시행 완료"
    },
    {
      id: "hs-2026-science-apply",
      event: "2026 전기 과학고 원서접수",
      date: "2025-08-25",
      endDate: "2025-09-03",
      type: "과학고",
      category: "전기고",
      note: "2025년 시행 완료"
    },
    {
      id: "hs-2026-jasa-apply",
      event: "2026 후기 자사고·외고 원서접수",
      date: "2025-12-03",
      endDate: "2025-12-05",
      type: "자사고·외고",
      category: "후기고",
      note: "2025년 시행 완료"
    }
  ]
};

// 일정 자동 변동 규칙 및 동기화 엔진
const ScheduleChangeManager = {
  // 등록된 자동 변경 규칙
  rules: [
    {
      targetId: "univ-2027-jungsi-4y",
      newDate: "2027-01-04",
      newEndDate: "2027-01-08",
      previousDate: "2026-12-28 ~ 2027-01-02",
      changeType: "원서접수 변동",
      changeReason: "대교협 5월 확정 대입기본일정 변경 공고: 수시 충원 일정 고려하여 접수 시작일이 2027년 1월 4일로 최종 조정 확정됨"
    },
    {
      targetId: "univ-2027-susi-col1",
      newDate: "2026-09-07",
      newEndDate: "2026-09-29",
      previousDate: "2026-09-07 ~ 2026-09-28",
      changeType: "일정 연장",
      changeReason: "전문대교협 5월 확정 모집요강 반영: 수험생 접수 편의를 위해 마감일이 9월 29일로 1일 연장 확정됨"
    },
    {
      targetId: "hs-2027-jasa-nation-apply",
      newDate: "2026-12-02",
      newEndDate: "2026-12-04",
      previousDate: "2026-12-03 ~ 2026-12-05",
      changeType: "일정 변경",
      changeReason: "시도교육청 고입전형 기본계획 확정: 수요일~금요일(12/2~12/4)로 접수기간 1일 앞당겨짐"
    },
    {
      targetId: "hs-2027-flang-jasa-apply",
      newDate: "2026-12-02",
      newEndDate: "2026-12-04",
      previousDate: "2026-12-03 ~ 2026-12-05",
      changeType: "일정 변경",
      changeReason: "교육청 고입일정 동기화: 전국단위 자사고와 동일 기간 접수"
    }
  ],

  // 데이터셋에 일정 자동 변동사항을 반영하는 함수
  applyAutoScheduleChanges: function() {
    let appliedCount = 0;
    this.rules.forEach(rule => {
      // 대입 검사
      Object.keys(ADMISSION_SCHEDULE_DATA_BY_YEAR).forEach(year => {
        const item = ADMISSION_SCHEDULE_DATA_BY_YEAR[year].find(i => i.id === rule.targetId);
        if (item) {
          item.date = rule.newDate;
          if (rule.newEndDate) item.endDate = rule.newEndDate;
          item.previousDate = rule.previousDate;
          item.isChanged = true;
          item.changeType = rule.changeType;
          item.changeReason = rule.changeReason;
          appliedCount++;
        }
      });
      // 고입 검사
      Object.keys(HIGHSCHOOL_SCHEDULE_DATA_BY_YEAR).forEach(year => {
        const item = HIGHSCHOOL_SCHEDULE_DATA_BY_YEAR[year].find(i => i.id === rule.targetId);
        if (item) {
          item.date = rule.newDate;
          if (rule.newEndDate) item.endDate = rule.newEndDate;
          item.previousDate = rule.previousDate;
          item.isChanged = true;
          item.changeType = rule.changeType;
          item.changeReason = rule.changeReason;
          appliedCount++;
        }
      });
    });
    return appliedCount;
  }
};

// 공식 포털 안내 링크
const ADMISSION_PORTAL_LINKS = {
  univ: [
    { title: "대학어디가 (대입정보포털)", url: "https://www.adiga.kr", desc: "교육부·대교협 공식 수시/정시 합격선 및 전형 안내" },
    { title: "대교협 대입기본일정", url: "https://www.kcue.or.kr", desc: "한국대학교육협의회 공식 4년제 대입 전형 기본사항" },
    { title: "전문대학포털 (프로칼리지)", url: "https://www.procollege.kr", desc: "한국전문대학교육협의회 전국 전문대 수시 1·2차/정시 일정" }
  ],
  highschool: [
    { title: "고입정보포털 하이스쿨", url: "https://www.hischool.go.kr/#", desc: "전국 고등학교 입학전형 기본계획 및 고교 정보" },
    { title: "서울 하이인포 (Hi-Info)", url: "https://hinfo.sen.go.kr", desc: "서울시교육청 전기고/후기고 요강 및 홍보자료" },
    { title: "서울진로진학정보센터 고입", url: "https://jinhak.or.kr", desc: "특목고·자사고·일반고 고입 전형일정 및 원서접수 안내" }
  ]
};

// 기본 호환용 단일 배열 (2027학년도 대입 일정)
const ADMISSION_SCHEDULE_DATA = ADMISSION_SCHEDULE_DATA_BY_YEAR["2027"];

// 초기 로드시 자동 변경 규칙 적용
ScheduleChangeManager.applyAutoScheduleChanges();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ADMISSION_SCHEDULE_DATA_BY_YEAR,
    HIGHSCHOOL_SCHEDULE_DATA_BY_YEAR,
    ADMISSION_PORTAL_LINKS,
    ADMISSION_SCHEDULE_DATA,
    ScheduleChangeManager
  };
}
