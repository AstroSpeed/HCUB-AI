/**
 * @fileoverview Date and time utility functions
 */

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short' | 'long' | 'time' | 'datetime'
 * @returns {string}
 */
export const formatDate = (date, format = "short") => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  const options = {
    short: { year: "numeric", month: "short", day: "numeric" },
    long: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
    time: { hour: "2-digit", minute: "2-digit" },
    datetime: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return dateObj.toLocaleDateString("en-US", options[format] || options.short);
};

/**
 * Format time to string
 * @param {string} time - Time string (HH:mm)
 * @returns {string} Formatted time (h:mm AM/PM)
 */
export const formatTime = (time) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {Date|string} date - Date to compare
 * @returns {string}
 */
export const getRelativeTime = (date) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

  return formatDate(dateObj);
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export const isToday = (date) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  const today = new Date();

  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export const isPast = (date) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj < new Date();
};

/**
 * Check if date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export const isFuture = (date) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj > new Date();
};

/**
 * Get start of day
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export const startOfDay = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

/**
 * Get end of day
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export const endOfDay = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
};

/**
 * Get start of week
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export const startOfWeek = (date) => {
  const dateObj = date instanceof Date ? new Date(date) : new Date(date);
  const day = dateObj.getDay();
  const diff = dateObj.getDate() - day;
  return new Date(dateObj.setDate(diff));
};

/**
 * Get end of week
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export const endOfWeek = (date) => {
  const dateObj = startOfWeek(date);
  return new Date(dateObj.setDate(dateObj.getDate() + 6));
};

/**
 * Get days between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {number}
 */
export const daysBetween = (startDate, endDate) => {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get current academic year
 * @returns {string} e.g., "2023-2024"
 */
export const getCurrentAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Academic year starts in September (month 8)
  if (month >= 8) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
};

/**
 * Get current semester
 * @returns {string} 'Fall' | 'Spring' | 'Summer'
 */
export const getCurrentSemester = () => {
  const month = new Date().getMonth();

  if (month >= 8 || month <= 0) return "Fall";
  if (month >= 1 && month <= 4) return "Spring";
  return "Summer";
};

/**
 * Parse schedule string to days array
 * @param {string} schedule - Schedule string (e.g., "Mon, Wed, Fri")
 * @returns {string[]}
 */
export const parseScheduleDays = (schedule) => {
  if (!schedule) return [];

  const dayMap = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };

  return schedule
    .split(",")
    .map((day) => day.trim())
    .map((day) => dayMap[day] || day)
    .filter(Boolean);
};

/**
 * Calculate session duration in minutes
 * @param {string} startTime - Start time (HH:mm)
 * @param {string} endTime - End time (HH:mm)
 * @returns {number}
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;

  const [startHours, startMins] = startTime.split(":").map(Number);
  const [endHours, endMins] = endTime.split(":").map(Number);

  const startTotal = startHours * 60 + startMins;
  const endTotal = endHours * 60 + endMins;

  return endTotal - startTotal;
};

/**
 * Generate date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Date[]}
 */
export const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export default {
  formatDate,
  formatTime,
  getRelativeTime,
  isToday,
  isPast,
  isFuture,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  daysBetween,
  getCurrentAcademicYear,
  getCurrentSemester,
  parseScheduleDays,
  calculateDuration,
  generateDateRange,
};
