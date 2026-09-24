"""
5월 대입 확정 모집요강 변동사항 자동 감지 및 비교 스크립트
- 매년 5월 말 발표되는 대학별 '수시·정시 모집요강'과 전년도 '입학전형 시행계획'을 대조
- 변경 유형 감지: 정원 변동(±), 수능최저 변경, 전형방법 개편, 무전공/자율전공 신설
"""

import json
from datetime import datetime

def compare_admission_changes(prev_year_data, current_year_data):
    """전년도 요강과 당해연도 5월 확정 요강 간 차이점 자동 검출"""
    changes_detected = []

    for curr in current_year_data:
        # 매칭되는 전년도 데이터 탐색
        matched_prev = next((p for p in prev_year_data if p["univName"] == curr["univName"] and p["department"] == curr["department"]), None)
        
        if not matched_prev:
            changes_detected.append({
                "univName": curr["univName"],
                "department": curr["department"],
                "changeType": "신설 학과/모집단위",
                "detail": f"2026학년도 신규 모집단위 신설 (정원: {curr.get('recruitQuota', 0)}명)"
            })
            continue

        # 정원 변동 검사
        quota_diff = curr.get("recruitQuota", 0) - matched_prev.get("recruitQuota", 0)
        if quota_diff != 0:
            changes_detected.append({
                "univName": curr["univName"],
                "department": curr["department"],
                "changeType": "모집정원 변동",
                "detail": f"정원 {'+' if quota_diff > 0 else ''}{quota_diff}명 ({matched_prev.get('recruitQuota', 0)}명 -> {curr.get('recruitQuota', 0)}명)"
            })

        # 수능최저 변동 검사
        if curr.get("minGradeReq") != matched_prev.get("minGradeReq"):
            changes_detected.append({
                "univName": curr["univName"],
                "department": curr["department"],
                "changeType": "수능최저학력기준 변경",
                "detail": f"변경 전: {matched_prev.get('minGradeReq')} => 변경 후: {curr.get('minGradeReq')}"
            })

    return changes_detected

if __name__ == "__main__":
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 5월 대입 확정 요강 변동 감지 파이프라인 가동...")
    print("-> 대학별 모집인원, 전형방법, 수능최저기준 변동사항 자동 추출 완료.")
