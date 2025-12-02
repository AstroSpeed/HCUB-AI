/**
 * @fileoverview Custom hook for analytics and dashboard statistics
 */

import { useMemo } from "react";
import { useData } from "../context/DataContext";
import {
  calculateDashboardStats,
  calculateStudentAttendance,
  calculateCourseStats,
  calculateWeeklyTrends,
  identifyAtRiskStudents,
  generateStudentReport,
} from "../utils/calculations";

export const useAnalytics = () => {
  const { students, courses, sessions, attendance } = useData();

  // Dashboard statistics
  const dashboardStats = useMemo(() => {
    return calculateDashboardStats({ students, courses, sessions, attendance });
  }, [students, courses, sessions, attendance]);

  // Weekly attendance trends
  const weeklyTrends = useMemo(() => {
    return calculateWeeklyTrends(sessions, attendance, 4);
  }, [sessions, attendance]);

  // At-risk students (attendance < 70%)
  const atRiskStudents = useMemo(() => {
    return identifyAtRiskStudents(students, attendance, 70);
  }, [students, attendance]);

  // Course statistics
  const getCourseStatistics = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return null;

    return calculateCourseStats(course, sessions, attendance);
  };

  // Student statistics
  const getStudentStatistics = (studentId, courseId = null) => {
    const studentRecords = attendance.filter((a) => a.studentId === studentId);
    return calculateStudentAttendance(studentRecords, courseId);
  };

  // Generate student report
  const getStudentReport = (studentId, startDate, endDate) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return null;

    const studentRecords = attendance.filter((a) => a.studentId === studentId);
    return generateStudentReport(
      student,
      courses,
      studentRecords,
      startDate,
      endDate
    );
  };

  // Top performing students
  const topStudents = useMemo(() => {
    return students
      .map((student) => {
        const stats = calculateStudentAttendance(
          attendance.filter((a) => a.studentId === student.id)
        );
        return {
          ...student,
          attendanceRate: stats.rate,
        };
      })
      .filter((s) => s.attendanceRate > 0)
      .sort((a, b) => b.attendanceRate - a.attendanceRate)
      .slice(0, 10);
  }, [students, attendance]);

  // Course performance overview
  const coursePerformance = useMemo(() => {
    return courses.map((course) => {
      const stats = calculateCourseStats(course, sessions, attendance);
      return {
        ...course,
        averageAttendance: stats.averageAttendance,
        totalSessions: stats.totalSessions,
      };
    });
  }, [courses, sessions, attendance]);

  return {
    dashboardStats,
    weeklyTrends,
    atRiskStudents,
    topStudents,
    coursePerformance,
    getCourseStatistics,
    getStudentStatistics,
    getStudentReport,
  };
};

export default useAnalytics;
