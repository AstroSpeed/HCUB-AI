/**
 * @fileoverview Face database storage and management
 */

import { STORAGE_KEYS } from "../utils/storage";

const FACE_DB_KEY = `${STORAGE_KEYS.SETTINGS}_face_database`;

/**
 * Get face database from localStorage
 * @returns {Array} Face database entries
 */
export const getFaceDatabase = () => {
  try {
    const data = localStorage.getItem(FACE_DB_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);

    // Convert arrays back to Float32Arrays
    return parsed.map((entry) => ({
      ...entry,
      descriptor: new Float32Array(entry.descriptor),
    }));
  } catch (error) {
    console.error("[Face DB] Error loading database:", error);
    return [];
  }
};

/**
 * Save face descriptor for a student
 * @param {string} studentId - Student ID
 * @param {string} studentName - Student name
 * @param {Float32Array} descriptor - Face descriptor
 * @returns {boolean} Success status
 */
export const saveFaceDescriptor = (studentId, studentName, descriptor) => {
  try {
    const db = getFaceDatabase();

    // Remove existing entry for this student
    const filteredDb = db.filter((entry) => entry.studentId !== studentId);

    // Add new entry
    filteredDb.push({
      studentId,
      name: studentName,
      descriptor: Array.from(descriptor), // Convert to array for JSON
      enrolledAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });

    localStorage.setItem(FACE_DB_KEY, JSON.stringify(filteredDb));
    console.log(`[Face DB] Saved descriptor for ${studentName}`);
    return true;
  } catch (error) {
    console.error("[Face DB] Error saving descriptor:", error);
    return false;
  }
};

/**
 * Get face descriptor for a specific student
 * @param {string} studentId - Student ID
 * @returns {Object|null} Face entry or null
 */
export const getFaceDescriptor = (studentId) => {
  const db = getFaceDatabase();
  return db.find((entry) => entry.studentId === studentId) || null;
};

/**
 * Delete face descriptor for a student
 * @param {string} studentId - Student ID
 * @returns {boolean} Success status
 */
export const deleteFaceDescriptor = (studentId) => {
  try {
    const db = getFaceDatabase();
    const filteredDb = db.filter((entry) => entry.studentId !== studentId);

    localStorage.setItem(FACE_DB_KEY, JSON.stringify(filteredDb));
    console.log(`[Face DB] Deleted descriptor for student ${studentId}`);
    return true;
  } catch (error) {
    console.error("[Face DB] Error deleting descriptor:", error);
    return false;
  }
};

/**
 * Check if student has enrolled face
 * @param {string} studentId - Student ID
 * @returns {boolean}
 */
export const hasEnrolledFace = (studentId) => {
  return getFaceDescriptor(studentId) !== null;
};

/**
 * Get all enrolled students count
 * @returns {number}
 */
export const getEnrolledCount = () => {
  return getFaceDatabase().length;
};

/**
 * Export face database as JSON
 * @returns {string} JSON string
 */
export const exportFaceDatabase = () => {
  const db = getFaceDatabase();
  return JSON.stringify(db, null, 2);
};

/**
 * Import face database from JSON
 * @param {string} jsonData - JSON string
 * @returns {boolean} Success status
 */
export const importFaceDatabase = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    localStorage.setItem(FACE_DB_KEY, JSON.stringify(data));
    console.log("[Face DB] Imported database");
    return true;
  } catch (error) {
    console.error("[Face DB] Error importing database:", error);
    return false;
  }
};

/**
 * Clear entire face database
 * @returns {boolean} Success status
 */
export const clearFaceDatabase = () => {
  try {
    localStorage.removeItem(FACE_DB_KEY);
    console.log("[Face DB] Cleared database");
    return true;
  } catch (error) {
    console.error("[Face DB] Error clearing database:", error);
    return false;
  }
};

export default {
  getFaceDatabase,
  saveFaceDescriptor,
  getFaceDescriptor,
  deleteFaceDescriptor,
  hasEnrolledFace,
  getEnrolledCount,
  exportFaceDatabase,
  importFaceDatabase,
  clearFaceDatabase,
};
