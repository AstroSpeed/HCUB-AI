/**
 * @fileoverview Analytics and reporting calculation utilities
 */

/**
 * Calculate attendance rate
 * @param {number} present - Number of present attendances
 * @param {number} total - Total number of sessions
 * @returns {number} Attendance rate percentage (0-100)
 */
export const calculateAttendanceRate = (present, total) => {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
};

/**
 * Calculate student attendance for a course
 * @param {Array} attendanceRecords - Student's attendance records
 * @param {string} courseId - Course ID (optional filter)
 * @returns {Object} Attendance statistics
 */
export const calculateStudentAttendance = (
  attendanceRecords,
  courseId = null
) => {
  const filtered = courseId
    ? attendanceRecords.filter((r) => r.courseId === courseId)
    : attendanceRecords;

  const total = filtered.length;
  const present = filtered.filter((r) => r.status === "present").length;
  const late = filtered.filter((r) => r.status === "late").length;
  const absent = filtered.filter((r) => r.status === "absent").length;
  const excused = filtered.filter((r) => r.status === "excused").length;

  return {
    total,
    present,
    late,
    absent,
    excused,
    rate: calculateAttendanceRate(present + late, total),
  };
};

/**
 * Calculate course statistics
 * @param {Object} course - Course object
 * @param {Array} sessions - Course sessions
 * @param {Array} attendanceRecords - All attendance records
 * @returns {Object} Course statistics
 */
export const calculateCourseStats = (course, sessions, attendanceRecords) => {
  const courseSessions = sessions.filter((s) => s.courseId === course.id);
  const courseAttendance = attendanceRecords.filter(
    (r) => r.courseId === course.id
  );

  const totalSessions = courseSessions.length;
  const totalEnrollment = course.enrolledStudents.length;
  const expectedAttendance = totalSessions * totalEnrollment;

  const presentCount = courseAttendance.filter(
    (r) => r.status === "present"
  ).length;
  const lateCount = courseAttendance.filter((r) => r.status === "late").length;
  const absentCount = courseAttendance.filter(
    (r) => r.status === "absent"
  ).length;

  const averageAttendance =
    expectedAttendance > 0
      ? Math.round(((presentCount + lateCount) / expectedAttendance) * 100)
      : 0;

  return {
    totalSessions,
    totalEnrollment,
    averageAttendance,
    presentCount,
    lateCount,
    absentCount,
    expectedAttendance,
  };
};

/**
 * Calculate weekly attendance trends
 * @param {Array} sessions - Sessions
 * @param {Array} attendanceRecords - Attendance records
 * @param {number} weeks - Number of weeks to analyze
 * @returns {Array} Weekly trend data
 */
export const calculateWeeklyTrends = (
  sessions,
  attendanceRecords,
  weeks = 4
) => {
  const trends = [];
  const today = new Date();

  for (let i = 0; i < weeks; i++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (i * 7 + 6));

    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() - i * 7);

    const weekSessions = sessions.filter((s) => {
      const sessionDate = new Date(s.date);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    const weekSessionIds = weekSessions.map((s) => s.id);
    const weekRecords = attendanceRecords.filter((r) =>
      weekSessionIds.includes(r.sessionId)
    );

    const total = weekRecords.length;
    const present = weekRecords.filter(
      (r) => r.status === "present" || r.status === "late"
    ).length;

    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    trends.unshift({
      week: i + 1,
      startDate: weekStart,
      endDate: weekEnd,
      rate,
      total,
      present,
    });
  }

  return trends;
};

/**
 * Identify at-risk students (low attendance)
 * @param {Array} students - All students
 * @param {Array} attendanceRecords - All attendance records
 * @param {number} threshold - Attendance threshold (default 70%)
 * @returns {Array} At-risk students
 */
export const identifyAtRiskStudents = (
  students,
  attendanceRecords,
  threshold = 70
) => {
  const atRisk = [];

  students.forEach((student) => {
    const studentRecords = attendanceRecords.filter(
      (r) => r.studentId === student.id
    );
    const stats = calculateStudentAttendance(studentRecords);

    if (stats.total > 0 && stats.rate < threshold) {
      atRisk.push({
        studentId: student.id,
        name: `${student.firstName} ${student.lastName}`,
        attendanceRate: stats.rate,
        totalSessions: stats.total,
        absences: stats.absent,
      });
    }
  });

  return atRisk.sort((a, b) => a.attendanceRate - b.attendanceRate);
};

/**
 * Calculate dashboard statistics
 * @param {Object} data - All data (students, courses, sessions, attendance)
 * @returns {Object} Dashboard statistics
 */
export const calculateDashboardStats = (data) => {
  const { students, courses, sessions, attendance } = data;

  const activeStudents = students.filter((s) => s.status === "active").length;
  const activeCourses = courses.filter((c) => c.status === "active").length;

  const today = new Date();
  const todaySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.date);
    return sessionDate.toDateString() === today.toDateString();
  }).length;

  const ongoingSessions = sessions.filter((s) => s.status === "ongoing");
  const activeAttendance = ongoingSessions.reduce(
    (sum, session) => sum + session.presentCount,
    0
  );

  const totalRecords = attendance.length;
  const presentRecords = attendance.filter(
    (r) => r.status === "present" || r.status === "late"
  ).length;
  const averageAttendanceRate =
    totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

  return {
    totalStudents: activeStudents,
    totalCourses: activeCourses,
    todaySessions,
    activeAttendance,
    averageAttendanceRate,
    trends: {
      studentGrowth: 5.2, // Mock percentage
      courseGrowth: 3.1, // Mock percentage
      attendanceChange: averageAttendanceRate > 80 ? 2.3 : -1.5, // Mock
    },
  };
};

/**
 * Generate attendance report for student
 * @param {Object} student - Student object
 * @param {Array} courses - All courses
 * @param {Array} attendanceRecords - Student's attendance records
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Object} Attendance report
 */
export const generateStudentReport = (
  student,
  courses,
  attendanceRecords,
  startDate,
  endDate
) => {
  const filtered = attendanceRecords.filter((r) => {
    const recordDate = new Date(r.timestamp);
    return (
      r.studentId === student.id &&
      recordDate >= startDate &&
      recordDate <= endDate
    );
  });

  const stats = calculateStudentAttendance(filtered);

  const courseBreakdown = {};
  student.enrolledCourses.forEach((courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const courseRecords = filtered.filter((r) => r.courseId === courseId);
    const courseStats = calculateStudentAttendance(courseRecords);

    courseBreakdown[courseId] = {
      courseName: course.name,
      courseCode: course.code,
      ...courseStats,
    };
  });

  return {
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    startDate,
    endDate,
    overall: stats,
    courseBreakdown,
    records: filtered.map((r) => ({
      date: new Date(r.timestamp),
      courseId: r.courseId,
      status: r.status,
    })),
  };
};

export default {
  calculateAttendanceRate,
  calculateStudentAttendance,
  calculateCourseStats,
  calculateWeeklyTrends,
  identifyAtRiskStudents,
  calculateDashboardStats,
  generateStudentReport,
};
