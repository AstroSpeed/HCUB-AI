/**
 * @fileoverview localStorage wrapper with data management utilities
 */

const STORAGE_PREFIX = "hcub_attendance_";
const STORAGE_VERSION = "1.0";

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  STUDENTS: `${STORAGE_PREFIX}students`,
  COURSES: `${STORAGE_PREFIX}courses`,
  SESSIONS: `${STORAGE_PREFIX}sessions`,
  ATTENDANCE: `${STORAGE_PREFIX}attendance`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  VERSION: `${STORAGE_PREFIX}version`,
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} data - Data to save
 * @returns {boolean} Success status
 */
export const saveData = (key, data) => {
  try {
    const serialized = JSON.stringify({
      data,
      timestamp: new Date().toISOString(),
      version: STORAGE_VERSION,
    });
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
};

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Retrieved data
 */
export const loadData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    const { data, version } = JSON.parse(item);

    // Version check - could trigger migration if needed
    if (version !== STORAGE_VERSION) {
      console.warn(`Data version mismatch for ${key}`);
    }

    return data;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing from localStorage:", error);
    return false;
  }
};

/**
 * Clear all app data from localStorage
 * @returns {boolean} Success status
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
};

/**
 * Check if storage is available
 * @returns {boolean}
 */
export const isStorageAvailable = () => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get storage size (approximate)
 * @returns {number} Size in KB
 */
export const getStorageSize = () => {
  let totalSize = 0;

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith(STORAGE_PREFIX)) {
      totalSize += localStorage[key].length + key.length;
    }
  }

  return (totalSize / 1024).toFixed(2);
};

/**
 * Export all data as JSON
 * @returns {Object} All stored data
 */
export const exportData = () => {
  const data = {};

  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = loadData(key);
  });

  return {
    ...data,
    exportedAt: new Date().toISOString(),
    version: STORAGE_VERSION,
  };
};

/**
 * Import data from JSON
 * @param {Object} data - Data to import
 * @returns {boolean} Success status
 */
export const importData = (data) => {
  try {
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      if (data[name]) {
        saveData(key, data[name]);
      }
    });
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};

/**
 * Create backup of current data
 * @returns {string} JSON string of backup
 */
export const createBackup = () => {
  const backup = exportData();
  return JSON.stringify(backup, null, 2);
};

/**
 * Restore from backup
 * @param {string} backupJson - JSON string of backup
 * @returns {boolean} Success status
 */
export const restoreBackup = (backupJson) => {
  try {
    const data = JSON.parse(backupJson);
    return importData(data);
  } catch (error) {
    console.error("Error restoring backup:", error);
    return false;
  }
};

/**
 * Initialize storage with default data if empty
 * @param {Function} mockDataGenerator - Function that returns default data
 */
export const initializeStorage = (mockDataGenerator) => {
  const students = loadData(STORAGE_KEYS.STUDENTS);

  // If no data exists, initialize with mock data
  if (!students || students.length === 0) {
    const mockData = mockDataGenerator();

    saveData(STORAGE_KEYS.STUDENTS, mockData.students);
    saveData(STORAGE_KEYS.COURSES, mockData.courses);
    saveData(STORAGE_KEYS.SESSIONS, mockData.sessions);
    saveData(STORAGE_KEYS.ATTENDANCE, mockData.attendance);

    console.log("Storage initialized with mock data");
  }
};

/**
 * Migrate data between versions
 * @param {string} fromVersion - Source version
 * @param {string} toVersion - Target version
 */
export const migrateData = (fromVersion, toVersion) => {
  console.log(`Migrating data from ${fromVersion} to ${toVersion}`);

  // Add migration logic here when versions change
  // For now, just update version
  saveData(STORAGE_KEYS.VERSION, toVersion);
};

export default {
  STORAGE_KEYS,
  saveData,
  loadData,
  removeData,
  clearAllData,
  isStorageAvailable,
  getStorageSize,
  exportData,
  importData,
  createBackup,
  restoreBackup,
  initializeStorage,
  migrateData,
};
