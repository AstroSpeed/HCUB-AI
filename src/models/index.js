/**
 * @fileoverview Data models and type definitions for HCUB Attendance System
 */

/**
 * @typedef {Object} Student
 * @property {string} id - Unique student identifier
 * @property {string} studentId - University student ID (e.g., "CS2023001")
 * @property {string} firstName - Student's first name
 * @property {string} lastName - Student's last name
 * @property {string} email - Student's email address
 * @property {string} phone - Phone number
 * @property {string} profileImage - URL to profile image
 * @property {string} course - Main course/program of study
 * @property {string} year - Academic year (1st, 2nd, 3rd, 4th)
 * @property {string} status - Student status: 'active' | 'inactive' | 'graduated' | 'suspended'
 * @property {string[]} enrolledCourses - Array of course IDs
 * @property {Date} dateEnrolled - Enrollment date
 * @property {number} graduationYear - Expected graduation year
 * @property {Object} metadata - Additional metadata
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} Course
 * @property {string} id - Unique course identifier
 * @property {string} code - Course code (e.g., "CS101")
 * @property {string} name - Course name
 * @property {string} description - Course description
 * @property {string} instructor - Instructor name
 * @property {string} instructorEmail - Instructor email
 * @property {string} schedule - Schedule string (e.g., "Mon, Wed 10:00 AM")
 * @property {Object} scheduleDetails - Detailed schedule information
 * @property {string[]} scheduleDetails.days - Days of week
 * @property {string} scheduleDetails.startTime - Start time
 * @property {string} scheduleDetails.endTime - End time
 * @property {string} scheduleDetails.room - Room number/location
 * @property {string} semester - Semester (e.g., "Fall 2023")
 * @property {number} credits - Credit hours
 * @property {number} capacity - Maximum student capacity
 * @property {string[]} enrolledStudents - Array of student IDs
 * @property {string[]} sessions - Array of session IDs
 * @property {string} status - Course status: 'active' | 'completed' | 'cancelled' | 'scheduled'
 * @property {number} progress - Course completion percentage (0-100)
 * @property {Date} startDate - Course start date
 * @property {Date} endDate - Course end date
 * @property {Object} metadata - Additional metadata
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} AttendanceSession
 * @property {string} id - Unique session identifier
 * @property {string} courseId - Associated course ID
 * @property {Date} date - Session date
 * @property {string} startTime - Session start time
 * @property {string} endTime - Session end time
 * @property {string} sessionType - Type: 'lecture' | 'lab' | 'tutorial' | 'exam'
 * @property {string} location - Session location/room
 * @property {string} detectionMethod - Method: 'ai' | 'manual' | 'hybrid'
 * @property {AttendanceRecord[]} attendanceRecords - Array of attendance records
 * @property {number} totalStudents - Total enrolled students
 * @property {number} presentCount - Number of present students
 * @property {number} absentCount - Number of absent students
 * @property {number} lateCount - Number of late students
 * @property {string} status - Session status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
 * @property {string} notes - Session notes
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} AttendanceRecord
 * @property {string} id - Unique record identifier
 * @property {string} studentId - Student ID
 * @property {string} sessionId - Session ID
 * @property {string} courseId - Course ID
 * @property {string} status - Attendance status: 'present' | 'absent' | 'late' | 'excused'
 * @property {Date} timestamp - Check-in timestamp
 * @property {string} detectionMethod - Detection method: 'ai' | 'manual' | 'qr_code' | 'rfid'
 * @property {number} confidence - AI detection confidence (0-1)
 * @property {string} location - Check-in location
 * @property {string} notes - Additional notes
 * @property {Object} metadata - Additional metadata (e.g., face recognition data)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalStudents - Total active students
 * @property {number} totalCourses - Total active courses
 * @property {number} todaySessions - Sessions scheduled for today
 * @property {number} activeAttendance - Students currently in session
 * @property {number} averageAttendanceRate - Overall attendance rate percentage
 * @property {Object} trends - Trend data
 * @property {number} trends.studentGrowth - Student growth percentage
 * @property {number} trends.courseGrowth - Course growth percentage
 * @property {number} trends.attendanceChange - Attendance rate change
 */

/**
 * @typedef {Object} AttendanceReport
 * @property {string} courseId - Course ID
 * @property {string} courseName - Course name
 * @property {string} studentId - Student ID (if individual report)
 * @property {string} studentName - Student name (if individual report)
 * @property {Date} startDate - Report start date
 * @property {Date} endDate - Report end date
 * @property {number} totalSessions - Total sessions
 * @property {number} attendedSessions - Sessions attended
 * @property {number} attendanceRate - Attendance rate percentage
 * @property {Object} breakdown - Status breakdown
 * @property {number} breakdown.present - Present count
 * @property {number} breakdown.absent - Absent count
 * @property {number} breakdown.late - Late count
 * @property {number} breakdown.excused - Excused count
 * @property {Array<{date: Date, status: string}>} records - Individual records
 */

/**
 * @typedef {Object} CourseAnalytics
 * @property {string} courseId - Course ID
 * @property {string} courseName - Course name
 * @property {number} enrollmentCount - Number of enrolled students
 * @property {number} averageAttendance - Average attendance rate
 * @property {number} completionRate - Course completion rate
 * @property {Array<{week: number, rate: number}>} weeklyTrends - Weekly attendance trends
 * @property {Array<{studentId: string, name: string, rate: number}>} topAttenders - Best attendance
 * @property {Array<{studentId: string, name: string, rate: number}>} atRiskStudents - Low attendance
 */

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success - Request success status
 * @property {*} data - Response data
 * @property {string} message - Response message
 * @property {Object} error - Error details (if any)
 * @property {number} timestamp - Response timestamp
 */

/**
 * Default student object
 * @returns {Partial<Student>}
 */
export const createDefaultStudent = () => ({
  id: "",
  studentId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  profileImage: "",
  course: "",
  year: "1st Year",
  status: "active",
  enrolledCourses: [],
  dateEnrolled: new Date(),
  graduationYear: new Date().getFullYear() + 4,
  metadata: {},
  createdAt: new Date(),
  updatedAt: new Date(),
});

/**
 * Default course object
 * @returns {Partial<Course>}
 */
export const createDefaultCourse = () => ({
  id: "",
  code: "",
  name: "",
  description: "",
  instructor: "",
  instructorEmail: "",
  schedule: "",
  scheduleDetails: {
    days: [],
    startTime: "",
    endTime: "",
    room: "",
  },
  semester: "",
  credits: 3,
  capacity: 50,
  enrolledStudents: [],
  sessions: [],
  status: "active",
  progress: 0,
  startDate: new Date(),
  endDate: new Date(),
  metadata: {},
  createdAt: new Date(),
  updatedAt: new Date(),
});

/**
 * Default attendance session object
 * @returns {Partial<AttendanceSession>}
 */
export const createDefaultSession = () => ({
  id: "",
  courseId: "",
  date: new Date(),
  startTime: "",
  endTime: "",
  sessionType: "lecture",
  location: "",
  detectionMethod: "manual",
  attendanceRecords: [],
  totalStudents: 0,
  presentCount: 0,
  absentCount: 0,
  lateCount: 0,
  status: "scheduled",
  notes: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

/**
 * Default attendance record object
 * @returns {Partial<AttendanceRecord>}
 */
export const createDefaultAttendanceRecord = () => ({
  id: "",
  studentId: "",
  sessionId: "",
  courseId: "",
  status: "present",
  timestamp: new Date(),
  detectionMethod: "manual",
  confidence: 1.0,
  location: "",
  notes: "",
  metadata: {},
  createdAt: new Date(),
  updatedAt: new Date(),
});

export default {
  createDefaultStudent,
  createDefaultCourse,
  createDefaultSession,
  createDefaultAttendanceRecord,
};
