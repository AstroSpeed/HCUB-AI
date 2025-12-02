/**
 * @fileoverview Validation utilities for HCUB Attendance System
 */

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex (international format)
 */
const PHONE_REGEX =
  /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

/**
 * Student ID format (e.g., CS2023001, ENG2024045)
 */
const STUDENT_ID_REGEX = /^[A-Z]{2,4}\d{4,7}$/;

/**
 * Course code format (e.g., CS101, MATH201)
 */
const COURSE_CODE_REGEX = /^[A-Z]{2,4}\d{3,4}[A-Z]?$/;

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: "Email is required" };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  return { valid: true };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: true }; // Phone is optional
  }
  if (!PHONE_REGEX.test(phone)) {
    return { valid: false, error: "Invalid phone number format" };
  }
  return { valid: true };
};

/**
 * Validate student ID
 * @param {string} studentId - Student ID to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validateStudentId = (studentId) => {
  if (!studentId) {
    return { valid: false, error: "Student ID is required" };
  }
  if (!STUDENT_ID_REGEX.test(studentId)) {
    return {
      valid: false,
      error: "Invalid student ID format (e.g., CS2023001)",
    };
  }
  return { valid: true };
};

/**
 * Validate course code
 * @param {string} code - Course code to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validateCourseCode = (code) => {
  if (!code) {
    return { valid: false, error: "Course code is required" };
  }
  if (!COURSE_CODE_REGEX.test(code.toUpperCase())) {
    return { valid: false, error: "Invalid course code format (e.g., CS101)" };
  }
  return { valid: true };
};

/**
 * Validate required text field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {{valid: boolean, error?: string}}
 */
export const validateTextField = (
  value,
  fieldName,
  minLength = 1,
  maxLength = 255
) => {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }
  if (value.length < minLength) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  if (value.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} must be less than ${maxLength} characters`,
    };
  }
  return { valid: true };
};

/**
 * Validate number field
 * @param {number} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {{valid: boolean, error?: string}}
 */
export const validateNumber = (value, fieldName, min = 0, max = Infinity) => {
  if (value === null || value === undefined || isNaN(value)) {
    return { valid: false, error: `${fieldName} must be a valid number` };
  }
  if (value < min) {
    return { valid: false, error: `${fieldName} must be at least ${min}` };
  }
  if (value > max) {
    return { valid: false, error: `${fieldName} must be at most ${max}` };
  }
  return { valid: true };
};

/**
 * Validate date
 * @param {Date|string} date - Date to validate
 * @param {string} fieldName - Field name for error message
 * @returns {{valid: boolean, error?: string}}
 */
export const validateDate = (date, fieldName) => {
  if (!date) {
    return { valid: false, error: `${fieldName} is required` };
  }
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: `${fieldName} must be a valid date` };
  }
  return { valid: true };
};

/**
 * Validate student data
 * @param {Object} student - Student object to validate
 * @returns {{valid: boolean, errors: Object}}
 */
export const validateStudent = (student) => {
  const errors = {};

  const firstNameValidation = validateTextField(
    student.firstName,
    "First name",
    2,
    50
  );
  if (!firstNameValidation.valid) errors.firstName = firstNameValidation.error;

  const lastNameValidation = validateTextField(
    student.lastName,
    "Last name",
    2,
    50
  );
  if (!lastNameValidation.valid) errors.lastName = lastNameValidation.error;

  const emailValidation = validateEmail(student.email);
  if (!emailValidation.valid) errors.email = emailValidation.error;

  const phoneValidation = validatePhone(student.phone);
  if (!phoneValidation.valid) errors.phone = phoneValidation.error;

  const studentIdValidation = validateStudentId(student.studentId);
  if (!studentIdValidation.valid) errors.studentId = studentIdValidation.error;

  const courseValidation = validateTextField(student.course, "Course", 2, 100);
  if (!courseValidation.valid) errors.course = courseValidation.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate course data
 * @param {Object} course - Course object to validate
 * @returns {{valid: boolean, errors: Object}}
 */
export const validateCourse = (course) => {
  const errors = {};

  const codeValidation = validateCourseCode(course.code);
  if (!codeValidation.valid) errors.code = codeValidation.error;

  const nameValidation = validateTextField(course.name, "Course name", 3, 200);
  if (!nameValidation.valid) errors.name = nameValidation.error;

  const instructorValidation = validateTextField(
    course.instructor,
    "Instructor",
    3,
    100
  );
  if (!instructorValidation.valid)
    errors.instructor = instructorValidation.error;

  const creditsValidation = validateNumber(course.credits, "Credits", 1, 10);
  if (!creditsValidation.valid) errors.credits = creditsValidation.error;

  const capacityValidation = validateNumber(
    course.capacity,
    "Capacity",
    1,
    500
  );
  if (!capacityValidation.valid) errors.capacity = capacityValidation.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate attendance session
 * @param {Object} session - Session object to validate
 * @returns {{valid: boolean, errors: Object}}
 */
export const validateSession = (session) => {
  const errors = {};

  if (!session.courseId) {
    errors.courseId = "Course is required";
  }

  const dateValidation = validateDate(session.date, "Session date");
  if (!dateValidation.valid) errors.date = dateValidation.error;

  const locationValidation = validateTextField(
    session.location,
    "Location",
    2,
    100
  );
  if (!locationValidation.valid) errors.location = locationValidation.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Check for schedule conflicts
 * @param {Array} existingSessions - Existing sessions
 * @param {Object} newSession - New session to check
 * @returns {{hasConflict: boolean, conflictingSessions: Array}}
 */
export const checkScheduleConflict = (existingSessions, newSession) => {
  const conflictingSessions = existingSessions.filter((existing) => {
    // Same day check
    const existingDate = new Date(existing.date);
    const newDate = new Date(newSession.date);

    if (existingDate.toDateString() !== newDate.toDateString()) {
      return false;
    }

    // Time overlap check
    const existingStart = existing.startTime;
    const existingEnd = existing.endTime;
    const newStart = newSession.startTime;
    const newEnd = newSession.endTime;

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });

  return {
    hasConflict: conflictingSessions.length > 0,
    conflictingSessions,
  };
};

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "");
};

/**
 * Validate and sanitize form data
 * @param {Object} data - Form data
 * @returns {Object} Sanitized data
 */
export const sanitizeFormData = (data) => {
  const sanitized = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeInput(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

export default {
  validateEmail,
  validatePhone,
  validateStudentId,
  validateCourseCode,
  validateTextField,
  validateNumber,
  validateDate,
  validateStudent,
  validateCourse,
  validateSession,
  checkScheduleConflict,
  sanitizeInput,
  sanitizeFormData,
};
