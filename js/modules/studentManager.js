// 컨설턴트 다중 학생 관리 모듈 (LocalStorage 기반)

const StudentManager = {
  STORAGE_KEY: "ADMISSION_CONSULTANT_STUDENTS",

  // 초기 기본 샘플 학생 데이터
  getDefaultStudents: function() {
    return [
      {
        id: "stu-001",
        name: "김민준",
        highSchool: "서울 일반고 3학년",
        track: "자연/공학",
        gpa: { kor: 1.3, math: 1.1, eng: 1.4, soc: 1.8, sci: 1.2, others: 1.5, careerA: 4, careerB: 0, careerC: 0 },
        csat: { korGrade: 2, mathGrade: 1, engGrade: 1, tam1Grade: 1, tam2Grade: 2, korStd: 134, mathStd: 141, korPct: 95, mathPct: 99, tam1Pct: 98, tam2Pct: 94 },
        targetField: "자연/공학",
        targetRegion: "서울",
        targetUnivs: ["4y-snu-01", "4y-snu-02", "4y-yon-02", "4y-skku-01", "4y-hanyang-01", "4y-cau-01"],
        memo: "수학·소프트웨어 역량 우수. 서울대 지균 및 연고대 최상위 공대 지망. 최저 3합7 무난히 충족 가능.",
        updatedAt: "2026-09-18"
      },
      {
        id: "stu-002",
        name: "이지원",
        highSchool: "경기 자사고 3학년",
        track: "인문/사회",
        gpa: { kor: 1.8, math: 2.3, eng: 1.5, soc: 1.6, sci: 2.8, others: 2.0, careerA: 3, careerB: 1, careerC: 0 },
        csat: { korGrade: 2, mathGrade: 2, engGrade: 1, tam1Grade: 2, tam2Grade: 2, korStd: 130, mathStd: 133, korPct: 92, mathPct: 91, tam1Pct: 93, tam2Pct: 92 },
        targetField: "인문/사회",
        targetRegion: "서울",
        targetUnivs: ["4y-yon-01", "4y-korea-01", "4y-korea-02", "4y-skku-02"],
        memo: "경영/경제 희망. 고려대 자유전공 무전공 증원에 따른 컷 완화 노림수. 논술 일정 확인 요망.",
        updatedAt: "2026-09-17"
      },
      {
        id: "stu-003",
        name: "박건우",
        highSchool: "인천 일반고 3학년",
        track: "간호/보건 및 공학",
        gpa: { kor: 2.8, math: 3.1, eng: 2.9, soc: 3.3, sci: 3.0, others: 3.2, careerA: 2, careerB: 2, careerC: 0 },
        csat: { korGrade: 3, mathGrade: 4, engGrade: 2, tam1Grade: 3, tam2Grade: 4, korStd: 121, mathStd: 115, korPct: 78, mathPct: 65, tam1Pct: 80, tam2Pct: 68 },
        targetField: "간호/보건",
        targetRegion: "수도권",
        targetUnivs: ["23y-sam-01", "23y-inha-02", "23y-dongyang-01", "4y-cnu-01"],
        memo: "4년제 교과 안정권 및 수도권 명문 전문대(삼육보건, 인하공전) 간호/공학 병행 전략.",
        updatedAt: "2026-09-16"
      }
    ];
  },

  getAllStudents: function() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      const defaults = this.getDefaultStudents();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch(e) {
      return this.getDefaultStudents();
    }
  },

  getStudentById: function(id) {
    const list = this.getAllStudents();
    return list.find(s => s.id === id) || list[0];
  },

  saveStudent: function(student) {
    const list = this.getAllStudents();
    const idx = list.findIndex(s => s.id === student.id);
    student.updatedAt = new Date().toISOString().split("T")[0];

    if (idx >= 0) {
      list[idx] = student;
    } else {
      if (!student.id) student.id = "stu-" + Date.now();
      list.unshift(student);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    return student;
  },

  deleteStudent: function(id) {
    let list = this.getAllStudents();
    list = list.filter(s => s.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    return list;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StudentManager };
}
