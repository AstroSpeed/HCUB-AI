/**
 * @fileoverview Attendance service - API endpoints for attendance management
 */

import { createResponse, createError } from "./api";
import { STORAGE_KEYS, loadData, saveData } from "../utils/storage";

/**
 * Create new attendance session
 * @param {Object} sessionData - Session data
 * @returns {Promise}
 */
export const createSession = async (sessionData) => {
  try {
    const sessions = loadData(STORAGE_KEYS.SESSIONS, []);

    const newSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...sessionData,
      attendanceRecords: [],
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      status: "scheduled",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sessions.push(newSession);
    saveData(STORAGE_KEYS.SESSIONS, sessions);

    return createResponse(newSession, "Session created successfully");
  } catch (error) {
    return createError("Failed to create session", 500, error.message);
  }
};

/**
 * Record attendance for a student
 * @param {Object} attendanceData - Attendance record data
 * @returns {Promise}
 */
export const recordAttendance = async (attendanceData) => {
  try {
    const attendance = loadData(STORAGE_KEYS.ATTENDANCE, []);
    const sessions = loadData(STORAGE_KEYS.SESSIONS, []);

    const newRecord = {
      id: `attendance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...attendanceData,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    attendance.push(newRecord);
    saveData(STORAGE_KEYS.ATTENDANCE, attendance);

    // Update session counts
    const session = sessions.find((s) => s.id === attendanceData.sessionId);
    if (session) {
      session.attendanceRecords.push(newRecord.id);

      if (attendanceData.status === "present") session.presentCount++;
      else if (attendanceData.status === "absent") session.absentCount++;
      else if (attendanceData.status === "late") session.lateCount++;

      saveData(STORAGE_KEYS.SESSIONS, sessions);
    }

    return createResponse(newRecord, "Attendance recorded successfully");
  } catch (error) {
    return createError("Failed to record attendance", 500, error.message);
  }
};

/**
 * Get all sessions
 * @param {Object} params - Query parameters
 * @returns {Promise}
 */
export const getSessions = async (params = {}) => {
  try {
    let sessions = loadData(STORAGE_KEYS.SESSIONS, []);

    if (params.courseId) {
      sessions = sessions.filter((s) => s.courseId === params.courseId);
    }

    if (params.status) {
      sessions = sessions.filter((s) => s.status === params.status);
    }

    if (params.date) {
      const targetDate = new Date(params.date).toDateString();
      sessions = sessions.filter(
        (s) => new Date(s.date).toDateString() === targetDate
      );
    }

    return createResponse(sessions, "Sessions retrieved successfully");
  } catch (error) {
    return createError("Failed to retrieve sessions", 500, error.message);
  }
};

/**
 * Get attendance for a session
 * @param {string} sessionId - Session ID
 * @returns {Promise}
 */
export const getSessionAttendance = async (sessionId) => {
  try {
    const attendance = loadData(STORAGE_KEYS.ATTENDANCE, []);
    const sessionRecords = attendance.filter((a) => a.sessionId === sessionId);

    return createResponse(
      sessionRecords,
      "Session attendance retrieved successfully"
    );
  } catch (error) {
    return createError(
      "Failed to retrieve session attendance",
      500,
      error.message
    );
  }
};

/**
 * Get student attendance records
 * @param {string} studentId - Student ID
 * @param {Object} params - Query parameters
 * @returns {Promise}
 */
export const getStudentAttendance = async (studentId, params = {}) => {
  try {
    let attendance = loadData(STORAGE_KEYS.ATTENDANCE, []);
    attendance = attendance.filter((a) => a.studentId === studentId);

    if (params.courseId) {
      attendance = attendance.filter((a) => a.courseId === params.courseId);
    }

    if (params.startDate && params.endDate) {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      attendance = attendance.filter((a) => {
        const recordDate = new Date(a.timestamp);
        return recordDate >= start && recordDate <= end;
      });
    }

    return createResponse(
      attendance,
      "Student attendance retrieved successfully"
    );
  } catch (error) {
    return createError(
      "Failed to retrieve student attendance",
      500,
      error.message
    );
  }
};

/**
 * Update attendance record
 * @param {string} id - Attendance record ID
 * @param {Object} updates - Updates
 * @returns {Promise}
 */
export const updateAttendanceRecord = async (id, updates) => {
  try {
    const attendance = loadData(STORAGE_KEYS.ATTENDANCE, []);
    const index = attendance.findIndex((a) => a.id === id);

    if (index === -1) {
      return createError("Attendance record not found", 404);
    }

    const oldStatus = attendance[index].status;
    const newStatus = updates.status || oldStatus;

    attendance[index] = {
      ...attendance[index],
      ...updates,
      updatedAt: new Date(),
    };

    saveData(STORAGE_KEYS.ATTENDANCE, attendance);

    // Update session counts if status changed
    if (oldStatus !== newStatus) {
      const sessions = loadData(STORAGE_KEYS.SESSIONS, []);
      const session = sessions.find(
        (s) => s.id === attendance[index].sessionId
      );

      if (session) {
        // Decrease old status count
        if (oldStatus === "present") session.presentCount--;
        else if (oldStatus === "absent") session.absentCount--;
        else if (oldStatus === "late") session.lateCount--;

        // Increase new status count
        if (newStatus === "present") session.presentCount++;
        else if (newStatus === "absent") session.absentCount++;
        else if (newStatus === "late") session.lateCount++;

        saveData(STORAGE_KEYS.SESSIONS, sessions);
      }
    }

    return createResponse(
      attendance[index],
      "Attendance record updated successfully"
    );
  } catch (error) {
    return createError(
      "Failed to update attendance record",
      500,
      error.message
    );
  }
};

export default {
  createSession,
  recordAttendance,
  getSessions,
  getSessionAttendance,
  getStudentAttendance,
  updateAttendanceRecord,
};
