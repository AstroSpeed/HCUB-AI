/**
 * @fileoverview Custom hook for course management operations
 */

import { useCallback } from "react";
import { useData } from "../context/DataContext";
import * as courseService from "../services/courseService";

export const useCourses = () => {
  const { courses, setCourses } = useData();

  //get all courses
  const getCourses = useCallback((params = {}) => {
    return courseService.getCourses(params);
  }, []);

  // Get course by ID
  const getCourseById = useCallback((id) => {
    return courseService.getCourseById(id);
  }, []);

  // Create course
  const createCourse = useCallback(
    async (courseData) => {
      const response = await courseService.createCourse(courseData);

      if (response.success) {
        setCourses((prev) => [...prev, response.data]);
      }

      return response;
    },
    [setCourses]
  );

  // Update course
  const updateCourse = useCallback(
    async (id, updates) => {
      const response = await courseService.updateCourse(id, updates);

      if (response.success) {
        setCourses((prev) =>
          prev.map((c) => (c.id === id ? response.data : c))
        );
      }

      return response;
    },
    [setCourses]
  );

  // Delete course
  const deleteCourse = useCallback(
    async (id) => {
      const response = await courseService.deleteCourse(id);

      if (response.success) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      }

      return response;
    },
    [setCourses]
  );

  // Mark course complete
  const markCourseComplete = useCallback(
    async (id) => {
      const response = await courseService.markCourseComplete(id);

      if (response.success) {
        setCourses((prev) =>
          prev.map((c) => (c.id === id ? response.data : c))
        );
      }

      return response;
    },
    [setCourses]
  );

  // Search courses
  const searchCourses = useCallback(
    (query) => {
      if (!query) return courses;

      const lowerQuery = query.toLowerCase();
      return courses.filter(
        (c) =>
          c.code.toLowerCase().includes(lowerQuery) ||
          c.name.toLowerCase().includes(lowerQuery) ||
          c.instructor.toLowerCase().includes(lowerQuery)
      );
    },
    [courses]
  );

  // Filter courses
  const filterCourses = useCallback(
    (filters) => {
      let filtered = [...courses];

      if (filters.status) {
        filtered = filtered.filter((c) => c.status === filters.status);
      }

      if (filters.semester) {
        filtered = filtered.filter((c) => c.semester === filters.semester);
      }

      return filtered;
    },
    [courses]
  );

  return {
    courses,
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    markCourseComplete,
    searchCourses,
    filterCourses,
  };
};

export default useCourses;
