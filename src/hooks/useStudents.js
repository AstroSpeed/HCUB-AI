/**
 * @fileoverview Custom hook for student management operations
 */

import { useCallback } from "react";
import { useData } from "../context/DataContext";
import * as studentService from "../services/studentService";

export const useStudents = () => {
  const { students, setStudents, refreshData } = useData();

  // Get all students
  const getStudents = useCallback((params = {}) => {
    return studentService.getStudents(params);
  }, []);

  // Get student by ID
  const getStudentById = useCallback((id) => {
    return studentService.getStudentById(id);
  }, []);

  // Create student
  const createStudent = useCallback(
    async (studentData) => {
      const response = await studentService.createStudent(studentData);

      if (response.success) {
        setStudents((prev) => [...prev, response.data]);
      }

      return response;
    },
    [setStudents]
  );

  // Update student
  const updateStudent = useCallback(
    async (id, updates) => {
      const response = await studentService.updateStudent(id, updates);

      if (response.success) {
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? response.data : s))
        );
      }

      return response;
    },
    [setStudents]
  );

  // Delete student
  const deleteStudent = useCallback(
    async (id) => {
      const response = await studentService.deleteStudent(id);

      if (response.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
      }

      return response;
    },
    [setStudents]
  );

  // Enroll student
  const enrollStudent = useCallback(
    async (studentId, courseId) => {
      const response = await studentService.enrollStudentInCourse(
        studentId,
        courseId
      );

      if (response.success) {
        await refreshData();
      }

      return response;
    },
    [refreshData]
  );

  // Unenroll student
  const unenrollStudent = useCallback(
    async (studentId, courseId) => {
      const response = await studentService.unenrollStudentFromCourse(
        studentId,
        courseId
      );

      if (response.success) {
        await refreshData();
      }

      return response;
    },
    [refreshData]
  );

  // Search students
  const searchStudents = useCallback(
    (query) => {
      if (!query) return students;

      const lowerQuery = query.toLowerCase();
      return students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(lowerQuery) ||
          s.lastName.toLowerCase().includes(lowerQuery) ||
          s.email.toLowerCase().includes(lowerQuery) ||
          s.studentId.toLowerCase().includes(lowerQuery)
      );
    },
    [students]
  );

  // Filter students
  const filterStudents = useCallback(
    (filters) => {
      let filtered = [...students];

      if (filters.status) {
        filtered = filtered.filter((s) => s.status === filters.status);
      }

      if (filters.course) {
        filtered = filtered.filter((s) => s.course === filters.course);
      }

      if (filters.year) {
        filtered = filtered.filter((s) => s.year === filters.year);
      }

      return filtered;
    },
    [students]
  );

  return {
    students,
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    enrollStudent,
    unenrollStudent,
    searchStudents,
    filterStudents,
  };
};

export default useStudents;
