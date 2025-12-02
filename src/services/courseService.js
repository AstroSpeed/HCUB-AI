/**
 * @fileoverview Course service - API endpoints for course management
 */

import { createResponse, createError } from "./api";
import { STORAGE_KEYS, loadData, saveData } from "../utils/storage";
import { validateCourse, sanitizeFormData } from "../utils/validation";

/**
 * Get all courses
 * @param {Object} params - Query parameters
 * @returns {Promise}
 */
export const getCourses = async (params = {}) => {
  try {
    let courses = loadData(STORAGE_KEYS.COURSES, []);

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.code.toLowerCase().includes(searchLower) ||
          c.name.toLowerCase().includes(searchLower) ||
          c.instructor.toLowerCase().includes(searchLower)
      );
    }

    if (params.status) {
      courses = courses.filter((c) => c.status === params.status);
    }

    if (params.semester) {
      courses = courses.filter((c) => c.semester === params.semester);
    }

    return createResponse(courses, "Courses retrieved successfully");
  } catch (error) {
    return createError("Failed to retrieve courses", 500, error.message);
  }
};

/**
 * Get course by ID
 * @param {string} id - Course ID
 * @returns {Promise}
 */
export const getCourseById = async (id) => {
  try {
    const courses = loadData(STORAGE_KEYS.COURSES, []);
    const course = courses.find((c) => c.id === id);

    if (!course) {
      return createError("Course not found", 404);
    }

    return createResponse(course, "Course retrieved successfully");
  } catch (error) {
    return createError("Failed to retrieve course", 500, error.message);
  }
};

/**
 * Create new course
 * @param {Object} courseData - Course data
 * @returns {Promise}
 */
export const createCourse = async (courseData) => {
  try {
    const sanitized = sanitizeFormData(courseData);
    const validation = validateCourse(sanitized);

    if (!validation.valid) {
      return createError("Validation failed", 400, validation.errors);
    }

    const courses = loadData(STORAGE_KEYS.COURSES, []);

    if (courses.some((c) => c.code === sanitized.code)) {
      return createError("Course code already exists", 409);
    }

    const newCourse = {
      id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...sanitized,
      enrolledStudents: sanitized.enrolledStudents || [],
      sessions: sanitized.sessions || [],
      status: sanitized.status || "active",
      progress: sanitized.progress || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    courses.push(newCourse);
    saveData(STORAGE_KEYS.COURSES, courses);

    return createResponse(newCourse, "Course created successfully");
  } catch (error) {
    return createError("Failed to create course", 500, error.message);
  }
};

/**
 * Update course
 * @param {string} id - Course ID
 * @param {Object} updates - Course updates
 * @returns {Promise}
 */
export const updateCourse = async (id, updates) => {
  try {
    const sanitized = sanitizeFormData(updates);
    const courses = loadData(STORAGE_KEYS.COURSES, []);
    const index = courses.findIndex((c) => c.id === id);

    if (index === -1) {
      return createError("Course not found", 404);
    }

    if (sanitized.code && sanitized.code !== courses[index].code) {
      if (courses.some((c) => c.code === sanitized.code)) {
        return createError("Course code already exists", 409);
      }
    }

    const updatedCourse = {
      ...courses[index],
      ...sanitized,
      updatedAt: new Date(),
    };

    courses[index] = updatedCourse;
    saveData(STORAGE_KEYS.COURSES, courses);

    return createResponse(updatedCourse, "Course updated successfully");
  } catch (error) {
    return createError("Failed to update course", 500, error.message);
  }
};

/**
 * Delete course
 * @param {string} id - Course ID
 * @returns {Promise}
 */
export const deleteCourse = async (id) => {
  try {
    const courses = loadData(STORAGE_KEYS.COURSES, []);
    const index = courses.findIndex((c) => c.id === id);

    if (index === -1) {
      return createError("Course not found", 404);
    }

    const deletedCourse = courses[index];
    courses.splice(index, 1);
    saveData(STORAGE_KEYS.COURSES, courses);

    // Remove course from students
    const students = loadData(STORAGE_KEYS.STUDENTS, []);
    students.forEach((student) => {
      student.enrolledCourses = student.enrolledCourses.filter(
        (cid) => cid !== id
      );
    });
    saveData(STORAGE_KEYS.STUDENTS, students);

    return createResponse(deletedCourse, "Course deleted successfully");
  } catch (error) {
    return createError("Failed to delete course", 500, error.message);
  }
};

/**
 * Mark course as complete
 * @param {string} id - Course ID
 * @returns {Promise}
 */
export const markCourseComplete = async (id) => {
  try {
    const courses = loadData(STORAGE_KEYS.COURSES, []);
    const index = courses.findIndex((c) => c.id === id);

    if (index === -1) {
      return createError("Course not found", 404);
    }

    courses[index].status = "completed";
    courses[index].progress = 100;
    courses[index].updatedAt = new Date();

    saveData(STORAGE_KEYS.COURSES, courses);

    return createResponse(courses[index], "Course marked as complete");
  } catch (error) {
    return createError("Failed to mark course complete", 500, error.message);
  }
};

export default {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  markCourseComplete,
};
