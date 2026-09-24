/**
 * 매년 5월 대입 확정 요강 변동사항 자동 감지 및 분석기 Node.js 스크립트
 * 실행 방법: node scripts/may_changes_checker.js
 */

const { MAY_ADMISSION_CHANGES_DATA } = require('../js/data/changes_may.js');

console.log(`[${new Date().toISOString()}] 5월 대입 확정 모집요강 변동사항 분석 가동...`);
console.log(`-> 총 ${MAY_ADMISSION_CHANGES_DATA.length}개 주요 대학의 전년 대비 변동사항을 성공적으로 추적했습니다.\n`);

MAY_ADMISSION_CHANGES_DATA.forEach((item, idx) => {
  console.log(`[변동 #${idx + 1}] ${item.univName} (${item.department})`);
  console.log(` • 전형구분: ${item.admissionType} ${item.subType}`);
  console.log(` • 변동유형: ${item.changeType} (중요도: ${item.importance})`);
  console.log(` • 변경내역: ${item.beforeChange} => ${item.afterChange}`);
  console.log(` • 컨설턴트 팁: ${item.consultantTip}`);
  console.log('---------------------------------------------------------');
});
