/**
 * @fileoverview Global Data Context for centralized state management
 */

import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  initializeStorage,
  clearAllData,
  STORAGE_KEYS,
} from "../utils/storage";
import { generateMockData } from "../utils/mockData";
import {
  isDataInitPending,
  markDataInitialized,
} from "../services/authService";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Check if this is first login after signup
        if (isDataInitPending()) {
          console.log(
            "[DataContext] First login detected - clearing all dummy data"
          );
          clearAllData();
          markDataInitialized();

          // Start with empty data
          setStudents([]);
          setCourses([]);
          setSessions([]);
          setAttendance([]);
        } else {
          // Load existing data (could be empty or have real user data)
          initializeStorage(generateMockData);
          const mockData = generateMockData();
          setStudents(mockData.students);
          setCourses(mockData.courses);
          setSessions(mockData.sessions);
          setAttendance(mockData.attendance);
        }

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    const mockData = generateMockData();
    setStudents(mockData.students);
    setCourses(mockData.courses);
    setSessions(mockData.sessions);
    setAttendance(mockData.attendance);
    setIsLoading(false);
  }, []);

  const value = {
    // Data
    students,
    courses,
    sessions,
    attendance,

    // Setters
    setStudents,
    setCourses,
    setSessions,
    setAttendance,

    // State
    isLoading,
    error,

    // Methods
    refreshData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Export hook for easy access
export const useData = () => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export default DataProvider;
