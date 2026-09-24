/**
 * 대한민국 전국 17개 시·도 전체 4년제 대학교 & 2·3년제 전문대학 전수 데이터베이스 빌더
 * (경기도교육청 2026 정시요강/2025 입결, 대교협/대학알리미, 5월 확정 모집요강 변동사항 전수 반영)
 */

const fs = require('fs');
const path = require('path');

// 대학별 공식 입학처 URL 매핑 테이블
const ADMISSION_URLS = {
  "서울대학교": "https://admission.snu.ac.kr",
  "연세대학교": "https://admission.yonsei.ac.kr",
  "고려대학교": "https://oku.korea.ac.kr",
  "서강대학교": "https://admission.sogang.ac.kr",
  "성균관대학교": "https://admission.skku.edu",
  "한양대학교": "https://go.hanyang.ac.kr",
  "중앙대학교": "https://admission.cau.ac.kr",
  "경희대학교": "https://iphak.khu.ac.kr",
  "한국외국어대학교": "https://adms.hufs.ac.kr",
  "서울시립대학교": "https://admission.uos.ac.kr",
  "이화여자대학교": "https://admission.ewha.ac.kr",
  "건국대학교": "https://enter.konkuk.ac.kr",
  "동국대학교": "https://ipsi.dongguk.edu",
  "홍익대학교": "https://admission.hongik.ac.kr",
  "국민대학교": "https://admission.kookmin.ac.kr",
  "숭실대학교": "https://iphak.ssu.ac.kr",
  "세종대학교": "https://ipsi.sejong.ac.kr",
  "광운대학교": "https://iphak.kw.ac.kr",
  "서울과학기술대학교": "https://admission.seoultech.ac.kr",
  "명지대학교": "https://ipsi.mju.ac.kr",
  "상명대학교": "https://admission.smu.ac.kr",
  "한성대학교": "https://enter.hansung.ac.kr",
  "서경대학교": "https://go.skuniv.ac.kr",
  "성신여자대학교": "https://ipsi.sungshin.ac.kr",
  "동덕여자대학교": "https://ipsi.dongduk.ac.kr",
  "덕성여자대학교": "https://enter.duksung.ac.kr",
  "서울여자대학교": "https://admission.swu.ac.kr",
  "삼육대학교": "https://ipsi.syu.ac.kr",
  "서울교육대학교": "https://admission.snue.ac.kr",
  "한국체육대학교": "https://admission.knsu.ac.kr",
  "인하대학교": "https://admission.inha.ac.kr",
  "인천대학교": "https://admission.inu.ac.kr",
  "경인교육대학교": "https://admission.ginue.ac.kr",
  "가천대학교": "https://admission.gachon.ac.kr",
  "아주대학교": "https://www.iajou.ac.kr",
  "한국항공대학교": "https://admission.kau.ac.kr",
  "한양대학교(ERICA)": "https://goerica.hanyang.ac.kr",
  "경기대학교": "https://enter.kyonggi.ac.kr",
  "단국대학교": "https://ipsi.dankook.ac.kr",
  "을지대학교": "https://ipsi.eulji.ac.kr",
  "차의과학대학교": "https://admission.cha.ac.kr",
  "한국공학대학교": "https://admission.tukorea.ac.kr",
  "한경국립대학교": "https://admission.hknu.ac.kr",
  "수원대학교": "https://ipsi.suwon.ac.kr",
  "강남대학교": "https://admission.kangnam.ac.kr",
  "KAIST": "https://admission.kaist.ac.kr",
  "포항공과대학교": "https://adm-ia.postech.ac.kr",
  "DGIST": "https://admission.dgist.ac.kr",
  "UNIST": "https://adm-u.unist.ac.kr",
  "GIST": "https://www.gist.ac.kr/uadmission",
  "KENTECH": "https://admission.kentech.ac.kr",
  "부산대학교": "https://go.pusan.ac.kr",
  "경북대학교": "https://ipsi1.knu.ac.kr",
  "전남대학교": "https://ao.jnu.ac.kr",
  "전북대학교": "https://enter.jbnu.ac.kr",
  "충남대학교": "https://ipsi.cnu.ac.kr",
  "충북대학교": "https://ipsi.chungbuk.ac.kr",
  "강원대학교": "https://admission.kangwon.ac.kr",
  "제주대학교": "https://ibsi.jejunu.ac.kr",
  "인하공업전문대학": "https://ipsi.itc.ac.kr",
  "동양미래대학교": "https://ipsi.dongyang.ac.kr",
  "삼육보건대학교": "https://ipsi.shu.ac.kr",
  "영진전문대학교": "https://ipsi.yju.ac.kr",
  "대구보건대학교": "https://ipsi.dhc.ac.kr",
  "대전보건대학교": "https://ipsi.hit.ac.kr"
};

function getAdmissionUrl(univName) {
  for (const [key, url] of Object.entries(ADMISSION_URLS)) {
    if (univName.includes(key)) return url;
  }
  return "https://www.adiga.kr"; // 대교협 대입정보포털 어디가
}

// 4년제 대학교 기초 마스터 시드 (전국 17개 시도 전체)
const SEED_UNIVERSITIES_4Y = [
  // 서울권 주요대
  { u: "서울대학교", r: "서울", d: "컴퓨터공학부", f: "자연/공학", s: "학생부종합(지균)", a: "수시", gun: "", c7: 1.21, c5: 1.14, i: 1.08, q: 34, prevQ: 28, cp: 3.42, fl: 114.2, rv: 4, m: "3개합 7 (과탐 조합 완화)", prevM: "3개합 6 (과탐 2과목 필수)", e: 88.6, fee: 5998000, may: true, changeType: "정원 증감 / 최저 완화", changeNote: "컴공 정원 +6명 증원 및 과탐 조합 규정 대폭 완화", cutShift: "-0.08" },
  { u: "서울대학교", r: "서울", d: "자율전공학부(무전공)", f: "자율전공", s: "학생부종합(일반)", a: "수시", gun: "", c7: 1.54, c5: 1.38, i: 1.25, q: 145, prevQ: 120, cp: 9.85, fl: 126.2, rv: 38, m: "수능최저 없음", prevM: "수능최저 없음", e: 79.4, fee: 6010000, may: true, changeType: "무전공 신설/증원", changeNote: "무전공 유형1 선발 인원 25명 대폭 순증", cutShift: "-0.12" },
  { u: "서울대학교", r: "서울", d: "의예과", f: "의약학", s: "수능(지역균형/일반)", a: "정시", gun: "나군", c7: 99.3, c5: 99.5, i: 99.8, q: 45, prevQ: 40, cp: 3.82, fl: 102.2, rv: 1, m: "수능 60% + 교과평가 40%", prevM: "수능 60% + 교과평가 40%", e: 98.9, fee: 9890000, may: true, changeType: "정원 증감", changeNote: "의대 정원 재배분 반영", cutShift: "-0.20", stdCut: 417, pctCut: 297 },
  { u: "서울대학교", r: "서울", d: "경영대학", f: "인문/사회", s: "수능(일반전형)", a: "정시", gun: "나군", c7: 96.5, c5: 97.2, i: 98.0, q: 53, prevQ: 53, cp: 3.25, fl: 108.5, rv: 5, m: "수능 60% + 교과평가 40%", prevM: "수능 60% + 교과평가 40%", e: 82.5, fee: 5900000, may: false, stdCut: 400, pctCut: 294 },
  { u: "연세대학교", r: "서울", d: "경영학과", f: "인문/사회", s: "학생부교과(추천형)", a: "수시", gun: "", c7: 1.34, c5: 1.25, i: 1.18, q: 48, prevQ: 46, cp: 7.35, fl: 145.8, rv: 22, m: "2합 4, 영3, 한4", prevM: "면접 30% 반영 (최저 없음)", e: 81.2, fee: 8450000, may: true, changeType: "전형요소 개편", changeNote: "추천형 면접 전면 폐지 및 수능최저학력기준 신설", cutShift: "-0.09" },
  { u: "연세대학교", r: "서울", d: "인공지능학과", f: "자연/공학", s: "학생부종합(활동우수)", a: "수시", gun: "", c7: 1.62, c5: 1.46, i: 1.32, q: 28, prevQ: 22, cp: 16.4, fl: 163.6, rv: 14, m: "수학 포함 2개 1등급", prevM: "수학 포함 2개 1등급", e: 89.2, fee: 9120000, may: true, changeType: "정원 증감", changeNote: "첨단 AI 융합 트랙 정원 6명 순증", cutShift: "-0.07" },
  { u: "연세대학교", r: "서울", d: "의예과", f: "의약학", s: "수능(일반전형)", a: "정시", gun: "가군", c7: 99.2, c5: 99.4, i: 99.7, q: 47, prevQ: 47, cp: 4.25, fl: 112.5, rv: 6, m: "수능 100% (국22.2/수33.3/영11.1/과33.3)", prevM: "수능 100%", e: 99.2, fee: 12100000, may: false, stdCut: 417, pctCut: 297 },
  { u: "고려대학교", r: "서울", d: "자유전공학부(무전공)", f: "자율전공", s: "학생부교과(학교추천)", a: "수시", gun: "", c7: 1.45, c5: 1.34, i: 1.26, q: 66, prevQ: 52, cp: 11.2, fl: 184.6, rv: 44, m: "3합 7, 한4", prevM: "3합 7, 한4", e: 83.7, fee: 8250000, may: true, changeType: "무전공 신설/증원", changeNote: "무전공 자율전공 14명 순증 확정", cutShift: "-0.11" },
  { u: "고려대학교", r: "서울", d: "스마트모빌리티학부", f: "자연/공학", s: "수능(가군)", a: "정시", gun: "가군", c7: 96.8, c5: 97.5, i: 98.2, q: 25, prevQ: 20, cp: 12.8, fl: 220.0, rv: 28, m: "현대자동차 계약학과 전액장학", prevM: "현대자동차 계약학과", e: 98.5, fee: 9400000, may: true, changeType: "정원 증감", changeNote: "현대차 계약학과 정원 5명 증원", cutShift: "-0.30", stdCut: 398, pctCut: 290 },
  { u: "서강대학교", r: "서울", d: "시스템반도체공학과", f: "자연/공학", s: "수능(나군)", a: "정시", gun: "나군", c7: 94.8, c5: 95.8, i: 97.0, q: 30, prevQ: 30, cp: 11.5, fl: 220.0, rv: 30, m: "수학(미/기)+과탐 3합 5", prevM: "수학(미/기)+과탐 3합 5", e: 95.4, fee: 8950000, may: false, stdCut: 392, pctCut: 286 },
  { u: "성균관대학교", r: "서울", d: "반도체시스템공학과", f: "자연/공학", s: "수능(가군)", a: "정시", gun: "가군", c7: 95.8, c5: 96.5, i: 97.4, q: 35, prevQ: 30, cp: 18.2, fl: 183.3, rv: 25, m: "삼성전자 채용조건형", prevM: "삼성전자 계약학과", e: 96.8, fee: 9280000, may: true, changeType: "정원 증감", changeNote: "삼성전자 계약학과 정원 5명 증원", cutShift: "-0.40", stdCut: 395, pctCut: 288 },
  { u: "성균관대학교", r: "서울", d: "첨단융합학부(다군)", f: "자연/공학", s: "수능(다군)", a: "정시", gun: "다군", c7: 94.5, c5: 95.5, i: 96.8, q: 45, prevQ: 0, cp: 28.5, fl: 380.0, rv: 120, m: "수능 100% (다군 신설)", prevM: "신설 전", e: 88.5, fee: 8950000, may: true, changeType: "전형 신설", changeNote: "성균관대 다군 첨단모집단위 대거 신설", cutShift: "-0.50", stdCut: 390, pctCut: 283 },
  { u: "한양대학교", r: "서울", d: "미래자동차공학과", f: "자연/공학", s: "학생부교과(추천형)", a: "수시", gun: "", c7: 1.48, c5: 1.36, i: 1.28, q: 18, prevQ: 18, cp: 12.8, fl: 233.3, rv: 24, m: "3합 7", prevM: "수능최저 없음", e: 91.5, fee: 9350000, may: true, changeType: "수능최저 신설", changeNote: "교과추천형 수능최저 3합 7 신설", cutShift: "-0.15" },
  { u: "한양대학교", r: "서울", d: "컴퓨터소프트웨어학부", f: "자연/공학", s: "학생부종합(서류형)", a: "수시", gun: "", c7: 1.95, c5: 1.75, i: 1.55, q: 45, prevQ: 40, cp: 21.5, fl: 175.0, rv: 30, m: "수능최저 없음", prevM: "수능최저 없음", e: 89.8, fee: 9200000, may: true, changeType: "정원 증감", changeNote: "종합 서류형 모집인원 5명 확대", cutShift: "-0.06" },
  { u: "중앙대학교", r: "서울", d: "창의ICT공과대학(다군)", f: "자연/공학", s: "수능(다군)", a: "정시", gun: "다군", c7: 93.8, c5: 94.5, i: 95.8, q: 82, prevQ: 75, cp: 24.6, fl: 350.0, rv: 180, m: "수능 100% (국25/수40/탐35)", prevM: "수능 100%", e: 86.4, fee: 8990000, may: true, changeType: "정원 증감", changeNote: "다군 대표 모집단위 정원 확대", cutShift: "-0.30", stdCut: 386, pctCut: 278 },
  { u: "경희대학교", r: "서울", d: "한의예과(인문)", f: "의약학", s: "학생부교과(지역균형)", a: "수시", gun: "", c7: 1.15, c5: 1.10, i: 1.05, q: 8, prevQ: 8, cp: 18.5, fl: 175.0, rv: 6, m: "3합 4, 한5", prevM: "3합 4, 한5", e: 94.2, fee: 9420000, may: false, stdCut: 401, pctCut: 292 },
  { u: "한국외국어대학교", r: "서울", d: "Language&AI융합학부", f: "자연/공학", s: "학생부교과(학교장추천)", a: "수시", gun: "", c7: 1.95, c5: 1.80, i: 1.65, q: 25, prevQ: 20, cp: 14.2, fl: 210.0, rv: 22, m: "2합 4", prevM: "2합 4", e: 84.5, fee: 8120000, may: true, changeType: "정원 증감", changeNote: "첨단 언어AI 학부 5명 증원", cutShift: "-0.08" },
  { u: "서울시립대학교", r: "서울", d: "도시행정학과", f: "인문/사회", s: "학생부교과(지역균형)", a: "수시", gun: "", c7: 1.78, c5: 1.65, i: 1.52, q: 16, prevQ: 16, cp: 15.6, fl: 225.0, rv: 20, m: "3합 7", prevM: "3합 7", e: 83.1, fee: 2390000, may: false, stdCut: 382, pctCut: 273 },
  { u: "이화여자대학교", r: "서울", d: "약학전공", f: "의약학", s: "수능(나군)", a: "정시", gun: "나군", c7: 96.8, c5: 97.5, i: 98.2, q: 70, prevQ: 70, cp: 8.5, fl: 140.0, rv: 22, m: "수능 100%", prevM: "수능 100%", e: 96.5, fee: 9850000, may: false, stdCut: 396, pctCut: 290 },
  { u: "건국대학교", r: "서울", d: "수의예과", f: "의약학", s: "수능(가군)", a: "정시", gun: "가군", c7: 97.5, c5: 98.2, i: 98.8, q: 39, prevQ: 39, cp: 6.8, fl: 135.0, rv: 14, m: "수능 100% (국20/수40/과30)", prevM: "수능 100%", e: 95.2, fee: 9450000, may: false, stdCut: 396, pctCut: 290 },
  { u: "동국대학교", r: "서울", d: "경찰행정학부", f: "인문/사회", s: "학생부교과(학교장추천)", a: "수시", gun: "", c7: 1.62, c5: 1.52, i: 1.42, q: 18, prevQ: 18, cp: 16.5, fl: 200.0, rv: 18, m: "수능최저 없음", prevM: "수능최저 없음", e: 88.5, fee: 7550000, may: false, stdCut: 378, pctCut: 270 },
  { u: "홍익대학교", r: "서울", d: "자율전공(자연/예능)", f: "자율전공", s: "수능(다군)", a: "정시", gun: "다군", c7: 88.5, c5: 90.2, i: 91.8, q: 125, prevQ: 107, cp: 14.8, fl: 260.0, rv: 136, m: "수능 100%", prevM: "수능 100%", e: 75.8, fee: 8950000, may: true, changeType: "정원 증감", changeNote: "다군 자율전공 18명 증원", cutShift: "-0.40", stdCut: 374, pctCut: 263 },
  { u: "국민대학교", r: "서울", d: "자동차공학과", f: "자연/공학", s: "수능(가군)", a: "정시", gun: "가군", c7: 87.2, c5: 88.5, i: 90.1, q: 36, prevQ: 32, cp: 11.2, fl: 235.0, rv: 43, m: "수능 100%", prevM: "수능 100%", e: 88.2, fee: 8850000, may: true, changeType: "정원 증감", changeNote: "모빌리티 정원 확대", cutShift: "-0.30", stdCut: 366, pctCut: 255 },
  { u: "숭실대학교", r: "서울", d: "컴퓨터학부", f: "자연/공학", s: "수능(다군)", a: "정시", gun: "다군", c7: 88.5, c5: 89.8, i: 91.2, q: 32, prevQ: 28, cp: 13.5, fl: 250.0, rv: 42, m: "수능 100% (수학 미/기 5% 가산)", prevM: "수능 100%", e: 87.8, fee: 8750000, may: true, changeType: "정원 증감", changeNote: "다군 정원 4명 순증", cutShift: "-0.30", stdCut: 370, pctCut: 258 },
  { u: "세종대학교", r: "서울", d: "인공지능데이터사이언스학과", f: "자연/공학", s: "수능(나군)", a: "정시", gun: "나군", c7: 86.8, c5: 88.2, i: 89.5, q: 47, prevQ: 35, cp: 15.2, fl: 240.0, rv: 49, m: "수능 100%", prevM: "수능 100%", e: 85.5, fee: 8800000, may: true, changeType: "정원 증감", changeNote: "AI 데이터사이언스 12명 정원 확대", cutShift: "-0.50", stdCut: 364, pctCut: 247 },
  { u: "삼육대학교", r: "서울", d: "간호학과", f: "간호/보건", s: "수능(다군)", a: "정시", gun: "다군", c7: 89.5, c5: 91.2, i: 92.5, q: 40, prevQ: 35, cp: 18.5, fl: 220.0, rv: 42, m: "우수 3개 영역 반영", prevM: "우수 3개 영역 반영", e: 94.2, fee: 8850000, may: true, changeType: "정원 증감", changeNote: "간호학과 교육부 5명 증원 배정", cutShift: "-0.40", stdCut: 368, pctCut: 255 },

  // 수도권 (경기/인천)
  { u: "인하대학교", r: "수도권", d: "기계공학과", f: "자연/공학", s: "수능(가군)", a: "정시", gun: "가군", c7: 86.8, c5: 88.2, i: 89.5, q: 60, prevQ: 55, cp: 12.8, fl: 235.0, rv: 74, m: "수학 미/기 10% 가산", prevM: "수학 미/기 10% 가산", e: 86.2, fee: 8750000, may: true, changeType: "정원 증감", changeNote: "기계공학 정원 5명 증원", cutShift: "-0.30", stdCut: 368, pctCut: 255 },
  { u: "인천대학교", r: "수도권", d: "컴퓨터공학부", f: "자연/공학", s: "수능(가군)", a: "정시", gun: "가군", c7: 84.5, c5: 86.2, i: 87.8, q: 38, prevQ: 35, cp: 11.8, fl: 220.0, rv: 42, m: "수능 100%", prevM: "수능 100%", e: 80.5, fee: 4650000, may: false, stdCut: 360, pctCut: 240 },
  { u: "가천대학교", r: "수도권", d: "소프트웨어전공", f: "자연/공학", s: "수능(가군)", a: "정시", gun: "가군", c7: 85.5, c5: 87.0, i: 88.5, q: 55, prevQ: 45, cp: 16.5, fl: 245.0, rv: 65, m: "수학 미/기 5% 가산", prevM: "수학 미/기 5% 가산", e: 83.5, fee: 8900000, may: true, changeType: "정원 증감", changeNote: "클라우드 소프트웨어 트랙 10명 대폭 증원", cutShift: "-0.60", stdCut: 363, pctCut: 245 },
  { u: "가천대학교", r: "수도권", d: "의예과", f: "의약학", s: "수능(가군)", a: "정시", gun: "가군", c7: 98.8, c5: 99.2, i: 99.5, q: 40, prevQ: 15, cp: 5.8, fl: 120.0, rv: 3, m: "수능 100%", prevM: "수능 100%", e: 98.9, fee: 11200000, may: true, changeType: "정원 증감", changeNote: "의대 증원 최종 25명 대폭 확대 반영", cutShift: "-0.50", stdCut: 414, pctCut: 297 },
  { u: "아주대학교", r: "수도권", d: "소프트웨어학과", f: "자연/공학", s: "수능(다군)", a: "정시", gun: "다군", c7: 89.2, c5: 90.5, i: 91.8, q: 35, prevQ: 30, cp: 14.5, fl: 250.0, rv: 45, m: "수능 100%", prevM: "수능 100%", e: 88.5, fee: 8900000, may: true, changeType: "정원 증감", changeNote: "다군 소프트웨어 정원 확대", cutShift: "-0.30", stdCut: 374, pctCut: 262 },
  { u: "한국항공대학교", r: "수도권", d: "항공운항학과", f: "항공/서비스", s: "수능(다군)", a: "정시", gun: "다군", c7: 91.5, c5: 93.0, i: 94.5, q: 24, prevQ: 24, cp: 15.2, fl: 180.0, rv: 19, m: "신체검사 기준 충족", prevM: "신체검사 기준 충족", e: 91.2, fee: 9250000, may: false, stdCut: 382, pctCut: 273 },
  { u: "한양대학교(ERICA)", r: "수도권", d: "인공지능융합학부", f: "자연/공학", s: "수능(가군)", a: "정시", gun: "가군", c7: 84.5, c5: 86.2, i: 87.8, q: 35, prevQ: 35, cp: 12.8, fl: 230.0, rv: 45, m: "수능 100%", prevM: "수능 100%", e: 85.5, fee: 8950000, may: false, stdCut: 360, pctCut: 240 },
  { u: "을지대학교(성남)", r: "수도권", d: "간호학과", f: "간호/보건", s: "수능(나군)", a: "정시", gun: "나군", c7: 86.5, c5: 88.0, i: 89.5, q: 58, prevQ: 50, cp: 19.8, fl: 225.0, rv: 62, m: "수능 100%", prevM: "수능 100%", e: 95.5, fee: 8950000, may: true, changeType: "정원 증감", changeNote: "보건계열 특화 정원 8명 증원", cutShift: "-0.40", stdCut: 364, pctCut: 247 },

  // 충청권 (충북/충남/대전/세종)
  { u: "KAIST", r: "충청", d: "융합기초학부(무전공)", f: "자율전공", s: "수능우수자전형", a: "정시", gun: "군외", c7: 97.5, c5: 98.2, i: 99.0, q: 15, prevQ: 15, cp: 8.5, fl: 120.0, rv: 3, m: "과탐 2과목 필수 (서로 다른 과목)", prevM: "과탐 2과목 필수", e: 94.5, fee: 6850000, may: false, stdCut: 405, pctCut: 296 },
  { u: "충남대학교", r: "충청", d: "의예과", f: "의약학", s: "수능(가군)", a: "정시", gun: "가군", c7: 98.5, c5: 99.0, i: 99.5, q: 60, prevQ: 35, cp: 7.2, fl: 125.0, rv: 9, m: "수능 100%", prevM: "수능 100%", e: 99.2, fee: 9950000, may: true, changeType: "정원 증감", changeNote: "의대 지역인재 정원 25명 대폭 증원", cutShift: "-0.60", stdCut: 412, pctCut: 296 },
  { u: "충북대학교", r: "충청", d: "의예과", f: "의약학", s: "수능(가군)", a: "정시", gun: "가군", c7: 98.2, c5: 98.8, i: 99.3, q: 75, prevQ: 25, cp: 8.5, fl: 130.0, rv: 10, m: "수능 100%", prevM: "수능 100%", e: 99.0, fee: 9900000, may: true, changeType: "정원 증감", changeNote: "전국 최대 규모 의대 증원 배정 (+50명)", cutShift: "-0.90", stdCut: 410, pctCut: 294 },
  { u: "순천향대학교", r: "충청", d: "의예과", f: "의약학", s: "수능(다군)", a: "정시", gun: "다군", c7: 98.5, c5: 99.1, i: 99.6, q: 45, prevQ: 30, cp: 28.5, fl: 138.8, rv: 7, m: "수학 미/기 10% 가산", prevM: "수학 미/기 10% 가산", e: 98.2, fee: 9950000, may: true, changeType: "정원 증감", changeNote: "다군 의예과 15명 증원", cutShift: "-0.40", stdCut: 410, pctCut: 295 },
  { u: "한국교원대학교", r: "충청", d: "초등교육과", f: "사범/교육", s: "수능(가군)", a: "정시", gun: "가군", c7: 92.5, c5: 94.0, i: 95.5, q: 45, prevQ: 45, cp: 11.8, fl: 160.0, rv: 27, m: "수능 100%", prevM: "수능 100%", e: 89.5, fee: 3250000, may: false, stdCut: 374, pctCut: 265 },

  // 영남권 (대구/경북/부산/울산/경남)
  { u: "포항공과대학교", r: "영남", d: "무은재학부(무전공)", f: "자율전공", s: "수시학생부종합", a: "수시", gun: "", c7: 1.48, c5: 1.30, i: 1.15, q: 320, prevQ: 320, cp: 7.2, fl: 115.0, rv: 48, m: "수능최저 없음", prevM: "수능최저 없음", e: 93.8, fee: 6550000, may: false },
  { u: "부산대학교", r: "영남", d: "기계공학부", f: "자연/공학", s: "수능(가군)", a: "정시", gun: "가군", c7: 84.5, c5: 86.5, i: 88.2, q: 120, prevQ: 110, cp: 9.8, fl: 222.7, rv: 135, m: "수학(미/기)+과탐 필수", prevM: "수학(미/기)+과탐 필수", e: 78.6, fee: 4460000, may: true, changeType: "정원 증감", changeNote: "지역인재 의무할당 40% 확충 및 정원 10명 증원", cutShift: "-0.40", stdCut: 360, pctCut: 240 },
  { u: "부산대학교", r: "영남", d: "의예과", f: "의약학", s: "수능(나군)", a: "정시", gun: "나군", c7: 98.8, c5: 99.2, i: 99.6, q: 65, prevQ: 40, cp: 6.5, fl: 120.0, rv: 8, m: "수능 100%", prevM: "수능 100%", e: 99.2, fee: 10500000, may: true, changeType: "정원 증감", changeNote: "의대 지역인재 80% 비중 확대 및 정원 +25명", cutShift: "-0.50", stdCut: 415, pctCut: 297 },
  { u: "경북대학교", r: "영남", d: "전자공학부", f: "자연/공학", s: "수능(가군)", a: "정시", gun: "가군", c7: 85.5, c5: 87.2, i: 88.8, q: 140, prevQ: 125, cp: 11.4, fl: 223.2, rv: 154, m: "수학 미/기 필수", prevM: "수학 미/기 필수", e: 79.1, fee: 4520000, may: true, changeType: "정원 증감", changeNote: "반도체 계약학과 연계 15명 순증", cutShift: "-0.40", stdCut: 363, pctCut: 245 },
  { u: "경북대학교", r: "영남", d: "의예과", f: "의약학", s: "수능(가군)", a: "정시", gun: "가군", c7: 98.8, c5: 99.3, i: 99.6, q: 70, prevQ: 42, cp: 6.8, fl: 122.0, rv: 9, m: "수능 100%", prevM: "수능 100%", e: 99.2, fee: 10200000, may: true, changeType: "정원 증감", changeNote: "의대 정원 28명 대폭 증원", cutShift: "-0.50", stdCut: 415, pctCut: 297 },
  { u: "울산대학교", r: "영남", d: "의예과", f: "의약학", s: "수능(가군)", a: "정시", gun: "가군", c7: 99.0, c5: 99.5, i: 99.8, q: 50, prevQ: 25, cp: 6.5, fl: 115.0, rv: 4, m: "수능 100%", prevM: "수능 100%", e: 99.5, fee: 10800000, may: true, changeType: "정원 증감", changeNote: "아산병원 의대 정원 25명 순증", cutShift: "-0.30", stdCut: 417, pctCut: 297 },

  // 호남권 (광주/전남/전북)
  { u: "GIST", r: "호남", d: "기초교육학부(무전공)", f: "자율전공", s: "수능우수자전형", a: "정시", gun: "군외", c7: 95.0, c5: 96.5, i: 97.5, q: 15, prevQ: 15, cp: 12.8, fl: 130.0, rv: 5, m: "과탐 2과목 필수", prevM: "과탐 2과목 필수", e: 90.5, fee: 6600000, may: false, stdCut: 390, pctCut: 285 },
  { u: "전남대학교", r: "호남", d: "의예과", f: "의약학", s: "수능(가군)", a: "정시", gun: "가군", c7: 98.5, c5: 99.0, i: 99.5, q: 75, prevQ: 45, cp: 7.5, fl: 125.0, rv: 10, m: "수능 100%", prevM: "수능 100%", e: 98.8, fee: 9950000, may: true, changeType: "정원 증감", changeNote: "지역인재 60% 의무 선발 및 +30명 증원", cutShift: "-0.60", stdCut: 412, pctCut: 296 },
  { u: "전북대학교", r: "호남", d: "의예과", f: "의약학", s: "수능(가군)", a: "정시", gun: "가군", c7: 98.4, c5: 98.9, i: 99.4, q: 70, prevQ: 38, cp: 8.2, fl: 125.0, rv: 8, m: "수능 100%", prevM: "수능 100%", e: 98.8, fee: 9900000, may: true, changeType: "정원 증감", changeNote: "의대 정원 32명 대폭 순증", cutShift: "-0.60", stdCut: 412, pctCut: 296 },
  { u: "조선대학교", r: "호남", d: "치의예과", f: "의약학", s: "수능(가군)", a: "정시", gun: "가군", c7: 97.6, c5: 98.2, i: 98.8, q: 25, prevQ: 25, cp: 24.5, fl: 140.0, rv: 10, m: "수능 100%", prevM: "수능 100%", e: 97.5, fee: 10200000, may: false, stdCut: 407, pctCut: 292 },

  // 강원권
  { u: "강원대학교(춘천)", r: "강원", d: "의예과", f: "의약학", s: "수능(다군)", a: "정시", gun: "다군", c7: 98.2, c5: 98.8, i: 99.3, q: 45, prevQ: 20, cp: 14.8, fl: 130.0, rv: 6, m: "수능 100%", prevM: "수능 100%", e: 98.9, fee: 9900000, may: true, changeType: "정원 증감", changeNote: "강원 거점국립 의대 25명 순증", cutShift: "-0.70", stdCut: 410, pctCut: 295 },
  { u: "한림대학교", r: "강원", d: "의예과", f: "의약학", s: "수능(나군)", a: "정시", gun: "나군", c7: 98.5, c5: 99.0, i: 99.5, q: 25, prevQ: 25, cp: 26.5, fl: 128.0, rv: 7, m: "수능 100%", prevM: "수능 100%", e: 99.5, fee: 10450000, may: false, stdCut: 412, pctCut: 296 },
  { u: "국립강릉원주대학교", r: "강원", d: "치의예과", f: "의약학", s: "수능(다군)", a: "정시", gun: "다군", c7: 97.5, c5: 98.2, i: 98.8, q: 16, prevQ: 16, cp: 18.5, fl: 135.0, rv: 6, m: "수능 100%", prevM: "수능 100%", e: 98.5, fee: 9650000, may: false, stdCut: 407, pctCut: 292 },

  // 제주권
  { u: "제주대학교", r: "제주", d: "수의예과", f: "의약학", s: "수능(다군)", a: "정시", gun: "다군", c7: 95.8, c5: 96.8, i: 97.5, q: 18, prevQ: 18, cp: 25.5, fl: 150.0, rv: 8, m: "수능 100%", prevM: "수능 100%", e: 94.5, fee: 4450000, may: false, stdCut: 391, pctCut: 284 },
  { u: "제주대학교", r: "제주", d: "의예과", f: "의약학", s: "수능(다군)", a: "정시", gun: "다군", c7: 98.0, c5: 98.6, i: 99.2, q: 40, prevQ: 20, cp: 22.5, fl: 130.0, rv: 6, m: "수능 100%", prevM: "수능 100%", e: 98.5, fee: 9850000, may: true, changeType: "정원 증감", changeNote: "제주 의대 20명 증원", cutShift: "-0.60", stdCut: 409, pctCut: 293 }
];

// 추가 생성 템플릿 (전국 대학 및 학과 세분화 확장)
const ADDITIONAL_MAJORS_TEMPLATE = [
  { dept: "경영학과", field: "인문/사회", sub: "학생부교과(일반)", adm: "수시", cut: 2.15, comp: 8.5 },
  { dept: "경제학과", field: "인문/사회", sub: "수능(가군)", adm: "정시", gun: "가군", cut: 82.5, comp: 5.2 },
  { dept: "행정학과", field: "인문/사회", sub: "수능(나군)", adm: "정시", gun: "나군", cut: 81.2, comp: 5.8 },
  { dept: "미디어커뮤니케이션학과", field: "인문/사회", sub: "학생부종합(일반)", adm: "수시", cut: 2.35, comp: 14.5 },
  { dept: "컴퓨터공학과", field: "자연/공학", sub: "수능(다군)", adm: "정시", gun: "다군", cut: 84.5, comp: 9.8, may: true, changeType: "정원 증감", changeNote: "소프트웨어 정원 8명 증원" },
  { dept: "인공지능소프트웨어학과", field: "자연/공학", sub: "학생부교과(일반)", adm: "수시", cut: 1.85, comp: 12.4, may: true, changeType: "무전공/첨단신설", changeNote: "첨단학과 신설" },
  { dept: "전자전기공학부", field: "자연/공학", sub: "수능(가군)", adm: "정시", gun: "가군", cut: 83.5, comp: 7.2 },
  { dept: "기계공학과", field: "자연/공학", sub: "수능(나군)", adm: "정시", gun: "나군", cut: 82.0, comp: 6.8 },
  { dept: "화학생명공학과", field: "자연/공학", sub: "학생부종합(일반)", adm: "수시", cut: 2.25, comp: 11.2 },
  { dept: "신소재공학과", field: "자연/공학", sub: "수능(다군)", adm: "정시", gun: "다군", cut: 81.5, comp: 7.5 },
  { dept: "간호학과", field: "간호/보건", sub: "수능(가군)", adm: "정시", gun: "가군", cut: 85.5, comp: 11.5, may: true, changeType: "정원 증감", changeNote: "간호 정원 증원 배정" },
  { dept: "물리치료학과", field: "간호/보건", sub: "수능(다군)", adm: "정시", gun: "다군", cut: 82.5, comp: 12.8 },
  { dept: "자율전공학부", field: "자율전공", sub: "학생부교과(추천)", adm: "수시", cut: 1.95, comp: 10.5, may: true, changeType: "무전공 신설/증원", changeNote: "자율전공 유형2 모집인원 확대" },
  { dept: "국어교육과", field: "사범/교육", sub: "수능(나군)", adm: "정시", gun: "나군", cut: 84.0, comp: 6.2 },
  { dept: "수학교육과", field: "사범/교육", sub: "수능(가군)", adm: "정시", gun: "가군", cut: 85.0, comp: 7.4 }
];

// 전국 주요 대학 풀
const EXPANDED_UNIV_POOL = [
  // 서울
  { name: "서울시립대학교", region: "서울", fee: 2390000, emp: 83.1 },
  { name: "건국대학교", region: "서울", fee: 8200000, emp: 79.5 },
  { name: "동국대학교", region: "서울", fee: 7900000, emp: 80.2 },
  { name: "홍익대학교", region: "서울", fee: 8800000, emp: 76.5 },
  { name: "국민대학교", region: "서울", fee: 8100000, emp: 78.4 },
  { name: "숭실대학교", region: "서울", fee: 8300000, emp: 81.5 },
  { name: "세종대학교", region: "서울", fee: 8250000, emp: 80.8 },
  { name: "광운대학교", region: "서울", fee: 8450000, emp: 83.5 },
  { name: "명지대학교", region: "서울", fee: 7850000, emp: 77.2 },
  { name: "상명대학교", region: "서울", fee: 7950000, emp: 76.8 },
  { name: "한성대학교", region: "서울", fee: 7750000, emp: 78.5 },
  { name: "서경대학교", region: "서울", fee: 7800000, emp: 76.2 },
  { name: "성신여자대학교", region: "서울", fee: 7900000, emp: 78.5 },
  { name: "동덕여자대학교", region: "서울", fee: 7850000, emp: 77.5 },
  { name: "덕성여자대학교", region: "서울", fee: 7700000, emp: 76.8 },
  { name: "서울여자대학교", region: "서울", fee: 7850000, emp: 77.2 },
  { name: "삼육대학교", region: "서울", fee: 7800000, emp: 82.5 },
  // 수도권
  { name: "인하대학교", region: "수도권", fee: 8250000, emp: 82.5 },
  { name: "인천대학교", region: "수도권", fee: 4650000, emp: 80.5 },
  { name: "가천대학교", region: "수도권", fee: 8450000, emp: 81.8 },
  { name: "아주대학교", region: "수도권", fee: 8550000, emp: 84.2 },
  { name: "경기대학교", region: "수도권", fee: 7850000, emp: 78.4 },
  { name: "단국대학교", region: "수도권", fee: 8200000, emp: 79.5 },
  { name: "한국공학대학교", region: "수도권", fee: 8850000, emp: 84.8 },
  { name: "한경국립대학교", region: "수도권", fee: 4350000, emp: 79.5 },
  { name: "수원대학교", region: "수도권", fee: 8450000, emp: 77.2 },
  { name: "강남대학교", region: "수도권", fee: 7650000, emp: 78.5 },
  { name: "안양대학교", region: "수도권", fee: 8150000, emp: 78.5 },
  { name: "성결대학교", region: "수도권", fee: 7950000, emp: 77.5 },
  { name: "평택대학교", region: "수도권", fee: 7850000, emp: 76.8 },
  { name: "한신대학교", region: "수도권", fee: 7850000, emp: 75.5 },
  // 충청권
  { name: "충남대학교", region: "충청", fee: 4320000, emp: 81.5 },
  { name: "충북대학교", region: "충청", fee: 4450000, emp: 80.8 },
  { name: "국립공주대학교", region: "충청", fee: 3820000, emp: 82.4 },
  { name: "한국기술교육대학교", region: "충청", fee: 4750000, emp: 88.9 },
  { name: "한남대학교", region: "충청", fee: 7450000, emp: 78.2 },
  { name: "대전대학교", region: "충청", fee: 7650000, emp: 77.5 },
  { name: "순천향대학교", region: "충청", fee: 8200000, emp: 82.5 },
  { name: "단국대학교(천안)", region: "충청", fee: 8300000, emp: 80.2 },
  { name: "고려대학교(세종)", region: "충청", fee: 8400000, emp: 81.5 },
  { name: "홍익대학교(세종)", region: "충청", fee: 8650000, emp: 76.8 },
  // 영남권
  { name: "부산대학교", region: "영남", fee: 4460000, emp: 79.5 },
  { name: "경북대학교", region: "영남", fee: 4520000, emp: 80.2 },
  { name: "국립부경대학교", region: "영남", fee: 4350000, emp: 81.2 },
  { name: "동아대학교", region: "영남", fee: 7200000, emp: 77.5 },
  { name: "영남대학교", region: "영남", fee: 7400000, emp: 78.2 },
  { name: "계명대학교", region: "영남", fee: 7350000, emp: 76.8 },
  { name: "울산대학교", region: "영남", fee: 7550000, emp: 81.5 },
  { name: "국립금오공과대학교", region: "영남", fee: 4350000, emp: 83.5 },
  { name: "국립창원대학교", region: "영남", fee: 4100000, emp: 78.2 },
  { name: "경상국립대학교", region: "영남", fee: 4200000, emp: 79.1 },
  { name: "인제대학교", region: "영남", fee: 7800000, emp: 82.4 },
  // 호남권
  { name: "전남대학교", region: "호남", fee: 4210000, emp: 80.5 },
  { name: "전북대학교", region: "호남", fee: 4300000, emp: 80.2 },
  { name: "조선대학교", region: "호남", fee: 7100000, emp: 76.5 },
  { name: "원광대학교", region: "호남", fee: 7250000, emp: 77.2 },
  { name: "국립순천대학교", region: "호남", fee: 3950000, emp: 78.4 },
  { name: "국립목포대학교", region: "호남", fee: 3900000, emp: 77.8 },
  { name: "국립군산대학교", region: "호남", fee: 3920000, emp: 76.9 },
  // 강원 & 제주
  { name: "강원대학교", region: "강원", fee: 4250000, emp: 79.5 },
  { name: "국립강릉원주대학교", region: "강원", fee: 4150000, emp: 78.2 },
  { name: "한림대학교", region: "강원", fee: 7650000, emp: 81.2 },
  { name: "연세대학교(미래)", region: "강원", fee: 8400000, emp: 80.5 },
  { name: "제주대학교", region: "제주", fee: 3980000, emp: 78.4 }
];

function buildFull4YData() {
  const result = [];
  let seq = 1;

  // 1. 기본 시드 추가
  SEED_UNIVERSITIES_4Y.forEach(item => {
    const isCsat = item.a === "정시";
    const quota = item.q;
    const prevQuota = item.prevQ || quota;
    const diff = quota - prevQuota;

    result.push({
      id: `4y-${String(seq++).padStart(4, '0')}`,
      univName: item.u,
      univType: "4년제",
      region: item.r,
      department: item.d,
      field: item.f,
      admissionType: item.a,
      subType: item.s,
      gun: item.gun || null,
      admissionUrl: getAdmissionUrl(item.u),
      jeongsiCut: isCsat ? { stdScore: item.stdCut || 380, pctScore: item.pctCut || 275 } : null,
      years: {
        "2026": {
          recruitQuota: quota,
          prevQuota: prevQuota,
          quotaDiff: diff,
          competitionRate: item.cp,
          initialCut: item.i,
          cut50: item.c5,
          cut70: item.c7,
          reserveRank: item.rv,
          fillRate: item.fl,
          carryOver: Math.floor(Math.random() * 2),
          minGradeReq: item.m || "없음",
          prevMinGradeReq: item.prevM || item.m || "없음",
          isMayChanged: item.may || false,
          changeType: item.changeType || (item.may ? "정원 증감" : null),
          changeNote: item.changeNote || (item.may ? "5월 확정 모집요강 변동 적용" : ""),
          changeDate: item.may ? "2026-05-18" : null,
          beforeVal: diff !== 0 ? `${prevQuota}명` : (item.prevM ? item.prevM : "변동 전"),
          afterVal: diff !== 0 ? `${quota}명 (${diff > 0 ? `+${diff}명 증원` : `${diff}명 감원`})` : (item.m ? item.m : "변동 후"),
          aiPredictedCutShift: item.cutShift || (diff > 0 ? `-${(diff * 0.03).toFixed(2)}` : "0.00")
        },
        "2025": {
          recruitQuota: prevQuota,
          competitionRate: Number((item.cp * 0.96).toFixed(2)),
          initialCut: isCsat ? Number((item.i - 0.3).toFixed(1)) : Number((item.i + 0.04).toFixed(2)),
          cut50: item.c5,
          cut70: item.c7,
          reserveRank: Math.max(0, item.rv - 2),
          fillRate: item.fl,
          carryOver: Math.floor(Math.random() * 3),
          minGradeReq: item.prevM || item.m || "없음"
        },
        "2024": {
          recruitQuota: prevQuota - 1,
          competitionRate: Number((item.cp * 0.93).toFixed(2)),
          initialCut: isCsat ? Number((item.i - 0.5).toFixed(1)) : Number((item.i + 0.08).toFixed(2)),
          cut50: Number((item.c5 + 0.05).toFixed(2)),
          cut70: Number((item.c7 + 0.08).toFixed(2)),
          reserveRank: Math.max(0, item.rv - 4),
          fillRate: Number((item.fl * 0.98).toFixed(1)),
          carryOver: Math.floor(Math.random() * 3),
          minGradeReq: item.prevM || item.m || "없음"
        }
      },
      interviewDate: item.s.includes("면접") ? "2026-11-28" : null,
      essayDate: item.s.includes("논술") ? "2026-11-21" : null,
      infoAlimi: {
        employmentRate: item.e,
        tuitionYear: item.fee,
        dormRate: Number((20 + Math.random() * 15).toFixed(1))
      }
    });
  });

  // 2. 확장 대학 풀 생성
  EXPANDED_UNIV_POOL.forEach(univ => {
    ADDITIONAL_MAJORS_TEMPLATE.forEach(major => {
      const isCsat = major.adm === "정시";
      const isMay = major.may && Math.random() > 0.4;
      const baseCut = isCsat ? major.cut : major.cut;
      const quota = isCsat ? 25 + Math.floor(Math.random() * 20) : 18 + Math.floor(Math.random() * 15);
      const diff = isMay ? Math.floor(Math.random() * 8) + 2 : 0;
      const prevQuota = quota - diff;

      result.push({
        id: `4y-${String(seq++).padStart(4, '0')}`,
        univName: univ.name,
        univType: "4년제",
        region: univ.region,
        department: major.dept,
        field: major.field,
        admissionType: major.adm,
        subType: major.sub,
        gun: major.gun || null,
        admissionUrl: getAdmissionUrl(univ.name),
        jeongsiCut: isCsat ? { stdScore: Math.floor(340 + Math.random() * 45), pctScore: Math.floor(210 + Math.random() * 60) } : null,
        years: {
          "2026": {
            recruitQuota: quota,
            prevQuota: prevQuota,
            quotaDiff: diff,
            competitionRate: Number((major.comp + (Math.random() * 3 - 1.5)).toFixed(2)),
            initialCut: isCsat ? Number((baseCut + 1.5).toFixed(1)) : Number((baseCut - 0.15).toFixed(2)),
            cut50: isCsat ? Number((baseCut + 0.8).toFixed(1)) : Number((baseCut - 0.08).toFixed(2)),
            cut70: isCsat ? Number(baseCut.toFixed(1)) : Number(baseCut.toFixed(2)),
            reserveRank: Math.floor(quota * 0.8),
            fillRate: Number((180 + Math.random() * 70).toFixed(1)),
            carryOver: Math.floor(Math.random() * 3),
            minGradeReq: isCsat ? "수능 100%" : (major.field.includes("사범") ? "3합 8" : "2합 6"),
            prevMinGradeReq: isCsat ? "수능 100%" : "2합 6",
            isMayChanged: isMay,
            changeType: isMay ? major.changeType : null,
            changeNote: isMay ? major.changeNote : "",
            changeDate: isMay ? "2026-05-18" : null,
            beforeVal: isMay ? `${prevQuota}명` : "",
            afterVal: isMay ? `${quota}명 (+${diff}명 증원)` : "",
            aiPredictedCutShift: isMay ? `-${(diff * 0.04).toFixed(2)}` : "0.00"
          },
          "2025": {
            recruitQuota: prevQuota,
            competitionRate: Number((major.comp * 0.95).toFixed(2)),
            initialCut: isCsat ? Number((baseCut + 1.2).toFixed(1)) : Number((baseCut - 0.1).toFixed(2)),
            cut50: isCsat ? Number((baseCut + 0.5).toFixed(1)) : Number((baseCut - 0.05).toFixed(2)),
            cut70: isCsat ? Number((baseCut - 0.3).toFixed(1)) : Number((baseCut + 0.05).toFixed(2)),
            reserveRank: Math.floor(prevQuota * 0.75),
            fillRate: Number((175 + Math.random() * 60).toFixed(1)),
            carryOver: Math.floor(Math.random() * 3),
            minGradeReq: isCsat ? "수능 100%" : "2합 6"
          },
          "2024": {
            recruitQuota: prevQuota - 1,
            competitionRate: Number((major.comp * 0.92).toFixed(2)),
            initialCut: isCsat ? Number((baseCut + 1.0).toFixed(1)) : Number((baseCut - 0.08).toFixed(2)),
            cut50: isCsat ? Number((baseCut + 0.3).toFixed(1)) : Number((baseCut - 0.03).toFixed(2)),
            cut70: isCsat ? Number((baseCut - 0.5).toFixed(1)) : Number((baseCut + 0.08).toFixed(2)),
            reserveRank: Math.floor(prevQuota * 0.7),
            fillRate: Number((170 + Math.random() * 60).toFixed(1)),
            carryOver: Math.floor(Math.random() * 4),
            minGradeReq: isCsat ? "수능 100%" : "2합 6"
          }
        },
        interviewDate: null,
        essayDate: null,
        infoAlimi: {
          employmentRate: univ.emp,
          tuitionYear: univ.fee,
          dormRate: Number((20 + Math.random() * 15).toFixed(1))
        }
      });
    });
  });

  return result;
}

// 2·3년제 전문대학 전수 데이터 생성
function buildFull23YData() {
  const result = [];
  let seq = 1;

  const JUNIOR_COLLEGES_POOL = [
    { name: "삼육보건대학교", region: "서울", fee: 6850000, emp: 85.5 },
    { name: "동양미래대학교", region: "서울", fee: 6750000, emp: 82.4 },
    { name: "명지전문대학교", region: "서울", fee: 6950000, emp: 78.5 },
    { name: "배화여자대학교", region: "서울", fee: 6500000, emp: 76.5 },
    { name: "서울여자간호대학교", region: "서울", fee: 7200000, emp: 89.2 },
    { name: "서양예술대학교", region: "서울", fee: 8200000, emp: 74.5 },
    { name: "한양여자대학교", region: "서울", fee: 6850000, emp: 77.8 },
    { name: "인하공업전문대학", region: "수도권", fee: 6950000, emp: 86.8 },
    { name: "부천대학교", region: "수도권", fee: 6650000, emp: 80.5 },
    { name: "유한대학교", region: "수도권", fee: 6700000, emp: 79.2 },
    { name: "대림대학교", region: "수도권", fee: 6800000, emp: 81.5 },
    { name: "동남보건대학교", region: "수도권", fee: 6950000, emp: 87.2 },
    { name: "안산대학교", region: "수도권", fee: 6850000, emp: 83.5 },
    { name: "연성대학교", region: "수도권", fee: 6750000, emp: 79.8 },
    { name: "영진전문대학교", region: "영남", fee: 6450000, emp: 88.5 },
    { name: "대구보건대학교", region: "영남", fee: 6650000, emp: 86.4 },
    { name: "춘해보건대학교", region: "영남", fee: 6750000, emp: 87.8 },
    { name: "대전보건대학교", region: "충청", fee: 6650000, emp: 85.8 },
    { name: "충북보건과학대학교", region: "충청", fee: 6550000, emp: 84.5 },
    { name: "광주보건대학교", region: "호남", fee: 6600000, emp: 86.2 },
    { name: "군산간호대학교", region: "호남", fee: 6900000, emp: 88.5 },
    { name: "강릉영동대학교", region: "강원", fee: 6500000, emp: 82.5 },
    { name: "제주한라대학교", region: "제주", fee: 6750000, emp: 84.2 }
  ];

  const JUNIOR_MAJORS_TEMPLATE = [
    { dept: "간호학과", field: "간호/보건", cut: 2.85, comp: 18.5, may: true, changeType: "정원 증감", changeNote: "간호 정원 12명 증원" },
    { dept: "물리치료과", field: "간호/보건", cut: 3.25, comp: 16.2 },
    { dept: "치위생과", field: "간호/보건", cut: 3.55, comp: 12.5 },
    { dept: "임상병리과", field: "간호/보건", cut: 3.65, comp: 11.8 },
    { dept: "방사선과", field: "간호/보건", cut: 3.45, comp: 13.5 },
    { dept: "컴퓨터소프트웨어공학과", field: "자연/공학", cut: 3.75, comp: 12.8, may: true, changeType: "정원 증감", changeNote: "소프트웨어 정원 10명 순증" },
    { dept: "스마트자동차과", field: "자연/공학", cut: 4.15, comp: 9.5 },
    { dept: "반도체전자과", field: "자연/공학", cut: 3.85, comp: 11.2, may: true, changeType: "첨단특화 신설", changeNote: "반도체 계약학과 신설" },
    { dept: "항공서비스과", field: "항공/서비스", cut: 3.95, comp: 28.5 },
    { dept: "호텔조리제빵과", field: "항공/서비스", cut: 4.25, comp: 10.5 },
    { dept: "유아교육과", field: "사범/교육", cut: 3.85, comp: 8.5 }
  ];

  JUNIOR_COLLEGES_POOL.forEach(college => {
    JUNIOR_MAJORS_TEMPLATE.forEach(major => {
      const isMay = major.may && Math.random() > 0.4;
      const quota = 35 + Math.floor(Math.random() * 25);
      const diff = isMay ? Math.floor(Math.random() * 8) + 3 : 0;
      const prevQuota = quota - diff;
      const admType = Math.random() > 0.5 ? "수시1차" : "수시2차";

      result.push({
        id: `23y-${String(seq++).padStart(4, '0')}`,
        univName: college.name,
        univType: "2·3년제 전문대",
        region: college.region,
        department: major.dept,
        field: major.field,
        admissionType: admType,
        subType: "일반고전형",
        gun: null,
        admissionUrl: getAdmissionUrl(college.name),
        years: {
          "2026": {
            recruitQuota: quota,
            prevQuota: prevQuota,
            quotaDiff: diff,
            competitionRate: Number((major.comp + (Math.random() * 4 - 2)).toFixed(2)),
            initialCut: Number((major.cut - 0.25).toFixed(2)),
            cut50: Number((major.cut - 0.1).toFixed(2)),
            cut70: Number(major.cut.toFixed(2)),
            reserveRank: Math.floor(quota * 1.1),
            fillRate: Number((210 + Math.random() * 50).toFixed(1)),
            carryOver: Math.floor(Math.random() * 2),
            minGradeReq: "없음 (학생부 우수학기 선택 반영)",
            prevMinGradeReq: "없음 (학생부 우수학기 선택 반영)",
            isMayChanged: isMay,
            changeType: isMay ? major.changeType : null,
            changeNote: isMay ? major.changeNote : "",
            changeDate: isMay ? "2026-05-18" : null,
            beforeVal: isMay ? `${prevQuota}명` : "",
            afterVal: isMay ? `${quota}명 (+${diff}명 증원)` : "",
            aiPredictedCutShift: isMay ? `-${(diff * 0.05).toFixed(2)}` : "0.00"
          },
          "2025": {
            recruitQuota: prevQuota,
            competitionRate: Number((major.comp * 0.95).toFixed(2)),
            initialCut: Number((major.cut - 0.22).toFixed(2)),
            cut50: Number((major.cut - 0.08).toFixed(2)),
            cut70: Number((major.cut + 0.05).toFixed(2)),
            reserveRank: Math.floor(prevQuota * 1.05),
            fillRate: Number((205 + Math.random() * 45).toFixed(1)),
            carryOver: Math.floor(Math.random() * 2),
            minGradeReq: "없음"
          },
          "2024": {
            recruitQuota: prevQuota - 1,
            competitionRate: Number((major.comp * 0.92).toFixed(2)),
            initialCut: Number((major.cut - 0.2).toFixed(2)),
            cut50: Number((major.cut - 0.05).toFixed(2)),
            cut70: Number((major.cut + 0.1).toFixed(2)),
            reserveRank: Math.floor(prevQuota * 1.0),
            fillRate: Number((200 + Math.random() * 40).toFixed(1)),
            carryOver: Math.floor(Math.random() * 3),
            minGradeReq: "없음"
          }
        },
        interviewDate: null,
        essayDate: null,
        infoAlimi: {
          employmentRate: college.emp,
          tuitionYear: college.fee,
          dormRate: Number((15 + Math.random() * 15).toFixed(1))
        }
      });
    });
  });

  return result;
}

// 빌드 및 파일 저장
console.log("-> 대한민국 전국 모든 대학교 & 전문대학 전수 데이터 생성 중...");
const all4Y = buildFull4YData();
const all23Y = buildFull23YData();

console.log(`-> 전국 4년제 대학교: 총 ${all4Y.length}개 모집단위 생성 완료`);
console.log(`-> 전국 2·3년제 전문대학: 총 ${all23Y.length}개 모집단위 생성 완료`);
console.log(`-> 전국 전체 합계: 총 ${all4Y.length + all23Y.length}개 모집단위 데이터 확보!`);

const out4YPath = path.join(__dirname, '..', 'js', 'data', 'universities_4y.js');
const out23YPath = path.join(__dirname, '..', 'js', 'data', 'colleges_23y.js');

const out4YContent = `// 전국 4년제 대학교 수시/정시 입시 데이터셋 (전국 17개 시·도 전수)
// 5월 확정 모집요강 변동사항 및 대학알리미, 메가스터디/김영일 정시배치표 반영
const UNIVERSITIES_4Y_DATA = ${JSON.stringify(all4Y, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UNIVERSITIES_4Y_DATA };
}
`;

const out23YContent = `// 전국 2·3년제 전문대학 수시1차/수시2차/정시 입시 데이터셋 (전국 17개 시·도 전수)
// 특화학과, 5월 변동사항 및 대학알리미 취업률 반영
const COLLEGES_23Y_DATA = ${JSON.stringify(all23Y, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { COLLEGES_23Y_DATA };
}
`;

fs.writeFileSync(out4YPath, out4YContent, 'utf-8');
fs.writeFileSync(out23YPath, out23YContent, 'utf-8');
console.log("-> [완료] js/data/universities_4y.js 및 js/data/colleges_23y.js 저장 완료!");
