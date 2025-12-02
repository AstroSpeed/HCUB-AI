/**
 * @fileoverview Mock data generators for HCUB Attendance System
 */

import { getCurrentAcademicYear, getCurrentSemester } from './dateUtils';

/**
 * Generate random ID
 * @param {string} prefix - ID prefix
 * @returns {string}
 */
const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate student ID
 * @param {number} index - Student index
 * @param {string} program - Program code
 * @returns {string}
 */
const generateStudentId = (index, program = 'CS') => {
  const year = new Date().getFullYear();
  return `${program}${year}${String(index).padStart(3, '0')}`;
};

/**
 * Sample first names
 */
const FIRST_NAMES = [
  'Alex', 'Sarah', 'Michael', 'Emily', 'James', 'Lisa', 'David', 'Jessica',
  'Daniel', 'Ashley', 'Matthew', 'Amanda', 'Christopher', 'Melissa', 'Joshua',
 'Stephanie', 'Andrew', 'Nicole', 'Ryan', 'Jennifer', 'Brandon', 'Elizabeth',
  'Tyler', 'Megan', 'Kevin', 'Lauren', 'Jason', 'Kayla', 'Justin', 'Brittany',
  'Robert', 'Hannah', 'Jacob', 'Samantha', 'Nicholas', 'Taylor', 'Eric', 'Rachel',
  'Jonathan', 'Victoria', 'William', 'Amber', 'Austin', 'Alexis', 'Dylan', 'Danielle',
  'Kyle', 'Natalie', 'Zachary', 'Courtney', 'Thomas', 'Katherine', 'Anthony', 'Rebecca',
];

/**
 * Sample last names
 */
const LAST_NAMES = [
  'Johnson', '

Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
  'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson',
  'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee',
  'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill',
  'Scott', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell', 'Perez',
  'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards',
];

/**
 * Sample course names
 */
const COURSE_TEMPLATES = [
  { prefix: 'CS', name: 'Introduction to Programming', credits: 3 },
  { prefix: 'CS', name: 'Data Structures', credits: 3 },
  { prefix: 'CS', name: 'Algorithms', credits: 4 },
  { prefix: 'CS', name: 'Database Systems', credits: 3 },
  { prefix: 'CS', name: 'Web Development', credits: 3 },
  { prefix: 'CS', name: 'Machine Learning', credits: 4 },
  { prefix: 'MATH', name: 'Calculus I', credits: 4 },
  { prefix: 'MATH', name: 'Linear Algebra', credits: 3 },
  { prefix: 'MATH', name: 'Discrete Mathematics', credits: 3 },
  { prefix: 'ENG', name: 'Technical Writing', credits: 3 },
  { prefix: 'ENG', name: 'Engineering Ethics', credits: 2 },
  { prefix: 'PHY', name: 'Physics I', credits: 4 },
  { prefix: 'PHY', name: 'Physics II', credits: 4 },
  { prefix: 'CHEM', name: 'General Chemistry', credits: 4 },
  { prefix: 'BUS', name: 'Business Ethics', credits: 3 },
  { prefix: 'BUS', name: 'Project Management', credits: 3 },
];

/**
 * Sample instructor names
 */
const INSTRUCTORS = [
  'Dr. Smith', 'Prof. Johnson', 'Dr. Williams', 'Prof. Brown', 'Dr. Davis',
  'Prof. Miller', 'Dr. Wilson', 'Prof. Moore', 'Dr. Taylor', 'Prof. Anderson',
  'Dr. Thomas', 'Prof. Jackson', 'Dr. White', 'Prof. Harris', 'Dr. Martin',
];

/**
 * Time slots for courses
 */
const TIME_SLOTS = [
  { start: '08:00', end: '09:30', days: ['Mon', 'Wed', 'Fri'] },
  { start: '10:00', end: '11:30', days: ['Mon', 'Wed', 'Fri'] },
  { start: '13:00', end: '14:30', days: ['Tue', 'Thu'] },
  { start: '15:00', end: '16:30', days: ['Tue', 'Thu'] },
  { start: '09:00', end: '12:00', days: ['Sat'] },
];

/**
 * Generate mock students
 * @param {number} count - Number of students to generate
 * @returns {Array} Array of student objects
 */
export const generateMockStudents = (count = 60) => {
  const students = [];
  const programs = ['CS', 'ENG', 'BUS', 'MATH', 'PHY'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  
  for (let i = 0; i < count; i++) {
    const program = programs[i % programs.length];
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const enrollmentYear = 2020 + Math.floor(i / 15);
    
    students.push({
      id: generateId('student'),
      studentId: generateStudentId(i + 1, program),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hcub.edu`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      course: program === 'CS' ? 'Computer Science' : 
              program === 'ENG' ? 'Engineering' :
              program === 'BUS' ? 'Business Administration' :
              program === 'MATH' ? 'Mathematics' : 'Physics',
      year: years[Math.floor(i / 15) % 4],
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      enrolledCourses: [],
      dateEnrolled: new Date(enrollmentYear, 8, 1), // September 1st
      graduationYear: enrollmentYear + 4,
      metadata: {},
      createdAt: new Date(enrollmentYear, 8, 1),
      updatedAt: new Date(),
    });
  }
  
  return students;
};

/**
 * Generate mock courses
 * @param {number} count - Number of courses to generate
 * @returns {Array} Array of course objects
 */
export const generateMockCourses = (count = 16) => {
  const courses = [];
  const semester = getCurrentSemester();
  const academicYear = getCurrentAcademicYear();
  
  COURSE_TEMPLATES.slice(0, count).forEach((template, i) => {
    const timeSlot = TIME_SLOTS[i % TIME_SLOTS.length];
    const instructor = INSTRUCTORS[i % INSTRUCTORS.length];
    const courseNumber = 100 + (i * 100);
    
    courses.push({
      id: generateId('course'),
      code: `${template.prefix}${courseNumber}`,
      name: template.name,
      description: `Comprehensive course covering ${template.name.toLowerCase()}`,
      instructor,
      instructorEmail: `${instructor.toLowerCase().replace('. ', '.')}@hcub.edu`,
      schedule: `${timeSlot.days.join(', ')} ${timeSlot.start}`,
      scheduleDetails: {
        days: timeSlot.days,
        startTime: timeSlot.start,
        endTime: timeSlot.end,
        room: `Room ${Math.floor(Math.random() * 400) + 100}`,
      },
      semester: `${semester} ${academicYear.split('-')[0]}`,
      credits: template.credits,
      capacity: 40 + Math.floor(Math.random() * 20),
      enrolledStudents: [],
      sessions: [],
      status: 'active',
      progress: Math.floor(Math.random() * 100),
      startDate: new Date(2024, 0, 15),
      endDate: new Date(2024, 4, 30),
      metadata: {},
      createdAt: new Date(2024, 0, 1),
      updatedAt: new Date(),
    });
  });
  
  return courses;
};

/**
 * Enroll students in courses
 * @param {Array} students - Students array
 * @param {Array} courses - Courses array
 * @returns {{students: Array, courses: Array}}
 */
export const enrollStudentsInCourses = (students, courses) => {
  const updatedStudents = [...students];
  const updatedCourses = [...courses];
  
  // Enroll each student in 3-5 random courses
  updatedStudents.forEach((student) => {
    const numCourses = 3 + Math.floor(Math.random() * 3);
    const availableCourses = [...updatedCourses];
    
    for (let i = 0; i < numCourses && availableCourses.length > 0; i++) {
      const courseIndex = Math.floor(Math.random() * availableCourses.length);
      const course = availableCourses[courseIndex];
      
      // Add student to course
      if (!course.enrolledStudents.includes(student.id)) {
        course.enrolledStudents.push(student.id);
      }
      
      // Add course to student
      if (!student.enrolledCourses.includes(course.id)) {
        student.enrolledCourses.push(course.id);
      }
      
      availableCourses.splice(courseIndex, 1);
    }
  });
  
  return { students: updatedStudents, courses: updatedCourses };
};

/**
 * Generate mock attendance sessions
 * @param {Array} courses - Courses array
 * @param {number} daysBack - Number of days back to generate
 * @returns {Array} Array of session objects
 */
export const generateMockSessions = (courses, daysBack = 30) => {
  const sessions = [];
  const today = new Date();
  
  courses.forEach((course) => {
    const sessionDays = course.scheduleDetails.days;
    
    // Generate sessions for the past daysBack days
    for (let i = 0; i < daysBack; i++) {
      const sessionDate = new Date(today);
      sessionDate.setDate(today.getDate() - i);
      
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][sessionDate.getDay()];
      
      if (sessionDays.includes(dayName)) {
        sessions.push({
          id: generateId('session'),
          courseId: course.id,
          date: sessionDate,
          startTime: course.scheduleDetails.startTime,
          endTime: course.scheduleDetails.endTime,
          sessionType: 'lecture',
          location: course.scheduleDetails.room,
          detectionMethod: Math.random() > 0.5 ? 'ai' : 'manual',
          attendanceRecords: [],
          totalStudents: course.enrolledStudents.length,
          presentCount: 0,
          absentCount: 0,
          lateCount: 0,
          status: i === 0 ? 'ongoing' : 'completed',
          notes: '',
          createdAt: sessionDate,
          updatedAt: sessionDate,
        });
      }
    }
  });
  
  return sessions;
};

/**
 * Generate mock attendance records
 * @param {Array} sessions - Sessions array
 * @param {Array} students - Students array
 * @param {Array} courses - Courses array
 * @returns {Array} Array of attendance records
 */
export const generateMockAttendance = (sessions, students, courses) => {
  const records = [];
  
  sessions.forEach((session) => {
    const course = courses.find((c) => c.id === session.courseId);
    if (!course) return;
    
    const enrolledStudentIds = course.enrolledStudents;
    
    enrolledStudentIds.forEach((studentId) => {
      // 80% attendance rate on average
      const isPresent = Math.random() > 0.2;
      const isLate = isPresent && Math.random() > 0.85;
      
      const record = {
        id: generateId('attendance'),
        studentId,
        sessionId: session.id,
        courseId: course.id,
        status: isPresent ? (isLate ? 'late' : 'present') : 'absent',
        timestamp: new Date(session.date),
        detectionMethod: session.detectionMethod,
        confidence: session.detectionMethod === 'ai' ? 0.85 + Math.random() * 0.15 : 1.0,
        location: session.location,
        notes: '',
        metadata: {},
        createdAt: new Date(session.date),
        updatedAt: new Date(session.date),
      };
      
      records.push(record);
      session.attendanceRecords.push(record.id);
      
      // Update session counts
      if (record.status === 'present') session.presentCount++;
      else if (record.status === 'absent') session.absentCount++;
      else if (record.status === 'late') session.lateCount++;
    });
  });
  
  return records;
};

/**
 * Generate complete mock dataset
 * @returns {{students: Array, courses: Array, sessions: Array, attendance: Array}}
 */
export const generateMockData = () => {
  console.log('Generating mock data...');
  
  // Generate base data
  let students = generateMockStudents(60);
  let courses = generateMockCourses(16);
  
  // Enroll students in courses
  const enrolled = enrollStudentsInCourses(students, courses);
  students = enrolled.students;
  courses = enrolled.courses;
  
  // Generate sessions and attendance
  const sessions = generateMockSessions(courses, 30);
  const attendance = generateMockAttendance(sessions, students, courses);
  
  console.log(`Generated: ${students.length} students, ${courses.length} courses, ${sessions.length} sessions, ${attendance.length} records`);
  
  return {
    students,
    courses,
    sessions,
    attendance,
  };
};

export default {
  generateMockStudents,
  generateMockCourses,
  enrollStudentsInCourses,
  generateMockSessions,
  generateMockAttendance,
  generateMockData,
};
