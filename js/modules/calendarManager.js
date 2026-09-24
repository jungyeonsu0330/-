// 면접/논술 고사 일정 중복 감지 및 입시·고입 D-Day & 실시간 날짜 엔진

const CalendarManager = {
  // 실시간 기준일 (오늘 실제 날짜 100% 동기화)
  getBaseDate: function() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  },

  getBaseDateString: function() {
    const d = this.getBaseDate();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  resetBaseDateToToday: function() {
    return this.getBaseDateString();
  },

  // 일정 상태 및 D-Day 종합 판별 엔진
  getEventStatus: function(startDateStr, endDateStr) {
    const base = this.getBaseDate();
    
    // 시작일 정규화
    const sParts = startDateStr.split('-');
    const start = new Date(parseInt(sParts[0], 10), parseInt(sParts[1], 10) - 1, parseInt(sParts[2], 10));
    start.setHours(0, 0, 0, 0);

    // 종료일 정규화 (종료일이 없으면 시작일과 동일)
    const endStr = endDateStr || startDateStr;
    const eParts = endStr.split('-');
    const end = new Date(parseInt(eParts[0], 10), parseInt(eParts[1], 10) - 1, parseInt(eParts[2], 10));
    end.setHours(23, 59, 59, 999);

    const baseMs = base.getTime();
    const startMs = start.getTime();
    const endMs = end.getTime();

    const oneDay = 1000 * 60 * 60 * 24;

    // 1. 종료일 경과: 마감됨
    if (baseMs > endMs) {
      const daysPassed = Math.floor((baseMs - endMs) / oneDay);
      return {
        status: "CLOSED",
        badgeText: "마감",
        subText: daysPassed > 0 ? `+${daysPassed}일` : "종료",
        badgeClass: "badge-closed",
        isUrgent: false,
        isActive: false
      };
    }

    // 2. 현재 진행 중 (접수중 / 고사기간 등)
    if (baseMs >= startMs && baseMs <= endMs) {
      const daysUntilEnd = Math.ceil((endMs - baseMs) / oneDay);
      return {
        status: "ACTIVE",
        badgeText: "접수/진행중",
        subText: daysUntilEnd === 0 ? "오늘 마감" : `마감 D-${daysUntilEnd}`,
        badgeClass: "badge-active",
        isUrgent: true,
        isActive: true
      };
    }

    // 3. 아직 시작 전 (예정)
    const diffDays = Math.ceil((startMs - baseMs) / oneDay);
    if (diffDays === 0) {
      return {
        status: "TODAY",
        badgeText: "D-DAY",
        subText: "오늘 시작",
        badgeClass: "badge-today",
        isUrgent: true,
        isActive: true
      };
    }

    const isUrgent = diffDays <= 30;
    return {
      status: "UPCOMING",
      badgeText: `D-${diffDays}`,
      subText: isUrgent ? "임박" : "예정",
      badgeClass: isUrgent ? "badge-urgent" : "badge-upcoming",
      isUrgent: isUrgent,
      isActive: false
    };
  },

  // 이전 호환용 D-Day 계산기
  calculateDday: function(targetDateStr) {
    const status = this.getEventStatus(targetDateStr, targetDateStr);
    return status.badgeText;
  },

  // 학생이 선택한 지망 대학들의 면접/논술 일정 충돌 여부 감지
  checkScheduleConflicts: function(selectedUniversityIds) {
    const allData = [...(typeof UNIVERSITIES_4Y_DATA !== 'undefined' ? UNIVERSITIES_4Y_DATA : []), 
                     ...(typeof COLLEGES_23Y_DATA !== 'undefined' ? COLLEGES_23Y_DATA : [])];
    const targetList = allData.filter(item => selectedUniversityIds.includes(item.id));

    const dateMap = {};
    const conflicts = [];

    targetList.forEach(item => {
      // 면접일 체크
      if (item.interviewDate) {
        if (!dateMap[item.interviewDate]) dateMap[item.interviewDate] = [];
        dateMap[item.interviewDate].push({
          type: "면접고사",
          univName: item.univName,
          dept: item.department,
          subType: item.subType
        });
      }
      // 논술일 체크
      if (item.essayDate) {
        if (!dateMap[item.essayDate]) dateMap[item.essayDate] = [];
        dateMap[item.essayDate].push({
          type: "논술고사",
          univName: item.univName,
          dept: item.department,
          subType: item.subType
        });
      }
    });

    // 동일 날짜에 2개 이상 일정이 있는 경우 충돌 감지
    Object.keys(dateMap).forEach(date => {
      if (dateMap[date].length > 1) {
        conflicts.push({
          date: date,
          events: dateMap[date],
          count: dateMap[date].length
        });
      }
    });

    return {
      hasConflict: conflicts.length > 0,
      conflicts: conflicts,
      allEvents: dateMap
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CalendarManager };
}
