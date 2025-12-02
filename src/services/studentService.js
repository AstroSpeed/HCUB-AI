/**
 * @fileoverview Student service - API endpoints for student management
 */

import { apiClient, createResponse, createError } from "./api";
import { STORAGE_KEYS, loadData, saveData } from "../utils/storage";
import { validateStudent, sanitizeFormData } from "../utils/validation";

/**
 * Get all students
 * @param {Object} params - Query parameters (search, filter, sort)
 * @returns {Promise}
 */
export const getStudents = async (params = {}) => {
  try {
    let students = loadData(STORAGE_KEYS.STUDENTS, []);

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      students = students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(searchLower) ||
          s.lastName.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower) ||
          s.studentId.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (params.status) {
      students = students.filter((s) => s.status === params.status);
    }

    // Apply course filter
    if (params.course) {
      students = students.filter((s) => s.course === params.course);
    }

    // Apply year filter
    if (params.year) {
      students = students.filter((s) => s.year === params.year);
    }

    // Apply sorting
    if (params.sortBy) {
      const direction = params.sortOrder === "desc" ? -1 : 1;
      students.sort((a, b) => {
        if (a[params.sortBy] < b[params.sortBy]) return -1 * direction;
        if (a[params.sortBy] > b[params.sortBy]) return 1 * direction;
        return 0;
      });
    }

    // Apply pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedStudents = students.slice(startIndex, endIndex);

    return createResponse(
      {
        students: paginatedStudents,
        total: students.length,
        page,
        limit,
        totalPages: Math.ceil(students.length / limit),
      },
      "Students retrieved successfully"
    );
  } catch (error) {
    return createError("Failed to retrieve students", 500, error.message);
  }
};

/**
 * Get student by ID
 * @param {string} id - Student ID
 * @returns {Promise}
 */
export const getStudentById = async (id) => {
  try {
    const students = loadData(STORAGE_KEYS.STUDENTS, []);
    const student = students.find((s) => s.id === id);

    if (!student) {
      return createError("Student not found", 404);
    }

    return createResponse(student, "Student retrieved successfully");
  } catch (error) {
    return createError("Failed to retrieve student", 500, error.message);
  }
};

/**
 * Create new student
 * @param {Object} studentData - Student data
 * @returns {Promise}
 */
export const createStudent = async (studentData) => {
  try {
    const sanitized = sanitizeFormData(studentData);
    const validation = validateStudent(sanitized);

    if (!validation.valid) {
      return createError("Validation failed", 400, validation.errors);
    }

    const students = loadData(STORAGE_KEYS.STUDENTS, []);

    // Check for duplicate student ID
    if (students.some((s) => s.studentId === sanitized.studentId)) {
      return createError("Student ID already exists", 409);
    }

    // Check for duplicate email
    if (students.some((s) => s.email === sanitized.email)) {
      return createError("Email already exists", 409);
    }

    const newStudent = {
      id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...sanitized,
      enrolledCourses: sanitized.enrolledCourses || [],
      status: sanitized.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    students.push(newStudent);
    saveData(STORAGE_KEYS.STUDENTS, students);

    return createResponse(newStudent, "Student created successfully");
  } catch (error) {
    return createError("Failed to create student", 500, error.message);
  }
};

/**
 * Update student
 * @param {string} id - Student ID
 * @param {Object} updates - Student updates
 * @returns {Promise}
 */
export const updateStudent = async (id, updates) => {
  try {
    const sanitized = sanitizeFormData(updates);
    const students = loadData(STORAGE_KEYS.STUDENTS, []);
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
      return createError("Student not found", 404);
    }

    // If updating student ID or email, check for duplicates
    if (
      sanitized.studentId &&
      sanitized.studentId !== students[index].studentId
    ) {
      if (students.some((s) => s.studentId === sanitized.studentId)) {
        return createError("Student ID already exists", 409);
      }
    }

    if (sanitized.email && sanitized.email !== students[index].email) {
      if (students.some((s) => s.email === sanitized.email)) {
        return createError("Email already exists", 409);
      }
    }

    const updatedStudent = {
      ...students[index],
      ...sanitized,
      updatedAt: new Date(),
    };

    students[index] = updatedStudent;
    saveData(STORAGE_KEYS.STUDENTS, students);

    return createResponse(updatedStudent, "Student updated successfully");
  } catch (error) {
    return createError("Failed to update student", 500, error.message);
  }
};

/**
 * Delete student
 * @param {string} id - Student ID
 * @returns {Promise}
 */
export const deleteStudent = async (id) => {
  try {
    const students = loadData(STORAGE_KEYS.STUDENTS, []);
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
      return createError("Student not found", 404);
    }

    const deletedStudent = students[index];
    students.splice(index, 1);
    saveData(STORAGE_KEYS.STUDENTS, students);

    // Also remove student from enrolled courses
    const courses = loadData(STORAGE_KEYS.COURSES, []);
    courses.forEach((course) => {
      course.enrolledStudents = course.enrolledStudents.filter(
        (sid) => sid !== id
      );
    });
    saveData(STORAGE_KEYS.COURSES, courses);

    return createResponse(deletedStudent, "Student deleted successfully");
  } catch (error) {
    return createError("Failed to delete student", 500, error.message);
  }
};

/**
 * Enroll student in course
 * @param {string} studentId - Student ID
 * @param {string} courseId - Course ID
 * @returns {Promise}
 */
export const enrollStudentInCourse = async (studentId, courseId) => {
  try {
    const students = loadData(STORAGE_KEYS.STUDENTS, []);
    const courses = loadData(STORAGE_KEYS.COURSES, []);

    const student = students.find((s) => s.id === studentId);
    const course = courses.find((c) => c.id === courseId);

    if (!student) {
      return createError("Student not found", 404);
    }

    if (!course) {
      return createError("Course not found", 404);
    }

    // Check if already enrolled
    if (student.enrolledCourses.includes(courseId)) {
      return createError("Student already enrolled in this course", 409);
    }

    // Check course capacity
    if (course.enrolledStudents.length >= course.capacity) {
      return createError("Course is at full capacity", 409);
    }

    // Enroll student
    student.enrolledCourses.push(courseId);
    course.enrolledStudents.push(studentId);

    saveData(STORAGE_KEYS.STUDENTS, students);
    saveData(STORAGE_KEYS.COURSES, courses);

    return createResponse({ student, course }, "Student enrolled successfully");
  } catch (error) {
    return createError("Failed to enroll student", 500, error.message);
  }
};

/**
 * Unenroll student from course
 * @param {string} studentId - Student ID
 * @param {string} courseId - Course ID
 * @returns {Promise}
 */
export const unenrollStudentFromCourse = async (studentId, courseId) => {
  try {
    const students = loadData(STORAGE_KEYS.STUDENTS, []);
    const courses = loadData(STORAGE_KEYS.COURSES, []);

    const student = students.find((s) => s.id === studentId);
    const course = courses.find((c) => c.id === courseId);

    if (!student || !course) {
      return createError("Student or course not found", 404);
    }

    student.enrolledCourses = student.enrolledCourses.filter(
      (cid) => cid !== courseId
    );
    course.enrolledStudents = course.enrolledStudents.filter(
      (sid) => sid !== studentId
    );

    saveData(STORAGE_KEYS.STUDENTS, students);
    saveData(STORAGE_KEYS.COURSES, courses);

    return createResponse(
      { student, course },
      "Student unenrolled successfully"
    );
  } catch (error) {
    return createError("Failed to unenroll student", 500, error.message);
  }
};

export default {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  enrollStudentInCourse,
  unenrollStudentFromCourse,
};
