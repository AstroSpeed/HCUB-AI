/**
 * @fileoverview Custom hook for attendance management operations
 */

import { useCallback } from "react";
import { useData } from "../context/DataContext";
import * as attendanceService from "../services/attendanceService";

export const useAttendance = () => {
  const { sessions, setSessions, attendance, setAttendance } = useData();

  // Create session
  const createSession = useCallback(
    async (sessionData) => {
      const response = await attendanceService.createSession(sessionData);

      if (response.success) {
        setSessions((prev) => [...prev, response.data]);
      }

      return response;
    },
    [setSessions]
  );

  // Record attendance
  const recordAttendance = useCallback(
    async (attendanceData) => {
      const response = await attendanceService.recordAttendance(attendanceData);

      if (response.success) {
        setAttendance((prev) => [...prev, response.data]);
        // Update session counts
        const { sessionId, status } = attendanceData;
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === sessionId) {
              return {
                ...s,
                attendanceRecords: [...s.attendanceRecords, response.data.id],
                presentCount:
                  status === "present" ? s.presentCount + 1 : s.presentCount,
                absentCount:
                  status === "absent" ? s.absentCount + 1 : s.absentCount,
                lateCount: status === "late" ? s.lateCount + 1 : s.lateCount,
              };
            }
            return s;
          })
        );
      }

      return response;
    },
    [setAttendance, setSessions]
  );

  // Get sessions
  const getSessions = useCallback((params = {}) => {
    return attendanceService.getSessions(params);
  }, []);

  // Get session attendance
  const getSessionAttendance = useCallback((sessionId) => {
    return attendanceService.getSessionAttendance(sessionId);
  }, []);

  // Get student attendance
  const getStudentAttendance = useCallback((studentId, params = {}) => {
    return attendanceService.getStudentAttendance(studentId, params);
  }, []);

  // Update attendance record
  const updateAttendanceRecord = useCallback(
    async (id, updates) => {
      const response = await attendanceService.updateAttendanceRecord(
        id,
        updates
      );

      if (response.success) {
        setAttendance((prev) =>
          prev.map((a) => (a.id === id ? response.data : a))
        );
      }

      return response;
    },
    [setAttendance]
  );

  // Get today's sessions
  const getTodaySessions = useCallback(() => {
    const today = new Date().toDateString();
    return sessions.filter((s) => new Date(s.date).toDateString() === today);
  }, [sessions]);

  // Get attendance for student in course
  const getStudentCourseAttendance = useCallback(
    (studentId, courseId) => {
      return attendance.filter(
        (a) => a.studentId === studentId && a.courseId === courseId
      );
    },
    [attendance]
  );

  return {
    sessions,
    attendance,
    createSession,
    recordAttendance,
    getSessions,
    getSessionAttendance,
    getStudentAttendance,
    updateAttendanceRecord,
    getTodaySessions,
    getStudentCourseAttendance,
  };
};

export default useAttendance;
