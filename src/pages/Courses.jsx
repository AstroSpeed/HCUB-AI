import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MoreVertical,
  BookOpen,
  Users,
  Calendar,
  CheckCircle,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useToast } from "../context/ToastContext";

const initialCourses = [
  {
    id: 1,
    code: "CS101",
    name: "Intro to Computer Science",
    instructor: "Dr. Smith",
    students: 45,
    schedule: "Mon, Wed 10:00 AM",
    status: "Active",
    progress: 65,
  },
  {
    id: 2,
    code: "ENG201",
    name: "Advanced Engineering Math",
    instructor: "Prof. Johnson",
    students: 32,
    schedule: "Tue, Thu 02:00 PM",
    status: "Active",
    progress: 40,
  },
  {
    id: 3,
    code: "BUS305",
    name: "Business Ethics",
    instructor: "Mrs. Davis",
    students: 50,
    schedule: "Fri 09:00 AM",
    status: "Completed",
    progress: 100,
  },
  {
    id: 4,
    code: "ART102",
    name: "History of Art",
    instructor: "Mr. Wilson",
    students: 28,
    schedule: "Mon 01:00 PM",
    status: "Active",
    progress: 25,
  },
];

const CourseCard = ({ course, onEdit, onDelete, onMarkComplete }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-all group relative flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <BookOpen size={24} />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 hover:bg-accent rounded-md text-muted-foreground transition-colors group-hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Actions for ${course.name}`}
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            <MoreVertical size={18} />
          </button>
          {isMenuOpen && (
            <>
              {/* Backdrop to close menu when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 w-48 bg-card border border-border rounded-lg shadow-xl py-1 z-20">
                <button
                  onClick={() => {
                    onEdit(course);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2 focus:outline-none focus-visible:bg-accent"
                >
                  <Edit2 size={14} /> Edit Course
                </button>
                <button
                  onClick={() => {
                    onMarkComplete(course.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2 focus:outline-none focus-visible:bg-accent"
                >
                  <CheckCircle size={14} /> Mark Complete
                </button>
                <button
                  onClick={() => {
                    onDelete(course.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent text-destructive flex items-center gap-2 focus:outline-none focus-visible:bg-accent"
      const CourseModal = ({ isOpen, onClose, course, onSave }) => {
  if (!isOpen) return null;

  const handleEscape = (e) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleEscape}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 id="course-modal-title" className="text-xl font-bold">
            {course ? "Edit Course" : "Add New Course"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="course-code" className="text-sm font-medium">
                Course Code
              </label>
              <input
                id="course-code"
                type="text"
                defaultValue={course?.code}
                placeholder="e.g. CS101"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="course-schedule" className="text-sm font-medium">
                Schedule
              </label>
              <input
                id="course-schedule"
                type="text"
                defaultValue={course?.schedule}
                placeholder="e.g. Mon 10 AM"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                aria-required="true"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="course-name" className="text-sm font-medium">
              Course Name
            </label>
            <input
              id="course-name"
              type="text"
              defaultValue={course?.name}
              placeholder="e.g. Intro to Computer Science"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="course-instructor" className="text-sm font-medium">
              Instructor
            </label>
            <input
              id="course-instructor"
              type="text"
              defaultValue={course?.instructor}
              placeholder="e.g. Dr. Smith"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="course-description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="course-description"
              placeholder="Course description..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-24 resize-none"
            ></textarea>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
          >
            {course ? "Save Changes" : "Create Course"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { addToast } = useToast();

  const handleEdit = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const deletedCourse = courses.find((c) => c.id === id);
    const previousCourses = [...courses];

    setCourses(courses.filter((c) => c.id !== id));

    addToast({
      type: "success",
      message: `"${deletedCourse.name}" deleted`,
      description: "Course has been removed",
      onUndo: () => {
        setCourses(previousCourses);
      },
    });
  };

  const handleMarkComplete = (id) => {
    const course = courses.find((c) => c.id === id);
    const previousCourses = [...courses];

    setCourses(
      courses.map((c) =>
        c.id === id ? { ...c, status: "Completed", progress: 100 } : c
      )
    );

    addToast({
      type: "success",
      message: `"${course.name}" marked as complete`,
      description: "Course progress set to 100%",
      onUndo: () => {
        setCourses(previousCourses);
      },
    });
  };

  const handleSave = () => {
    // Mock save functionality
    if (!editingCourse) {
      // Add new
      setCourses([
        ...courses,
        {
          id: Date.now(),
          code: "NEW101",
          name: "New Course",
          instructor: "Admin",
          students: 0,
          schedule: "TBD",
          status: "Active",
          progress: 0,
        },
      ]);
    }
    setEditingCourse(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage classes, schedules, and enrollments.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCourse(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Add new course"
        >
          <Plus size={18} />
          Add Course
        </button>
      </div>

      <div className="flex items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-accent/50 border-transparent focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
            aria-label="Search courses"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMarkComplete={handleMarkComplete}
          />
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <CourseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            course={editingCourse}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;
