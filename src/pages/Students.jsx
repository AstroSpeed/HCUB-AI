import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  X,
  Upload,
} from "lucide-react";
import clsx from "clsx";

const studentsData = [
  {
    id: 1,
    name: "Alex Johnson",
    idNumber: "CS2023001",
    course: "Computer Science",
    year: "3rd Year",
    email: "alex.j@hcub.edu",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Sarah Williams",
    idNumber: "CS2023002",
    course: "Computer Science",
    year: "2nd Year",
    email: "sarah.w@hcub.edu",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Michael Brown",
    idNumber: "ENG2023003",
    course: "Engineering",
    year: "4th Year",
    email: "m.brown@hcub.edu",
    status: "Inactive",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "Emily Davis",
    idNumber: "BUS2023004",
    course: "Business Admin",
    year: "1st Year",
    email: "emily.d@hcub.edu",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    name: "James Wilson",
    idNumber: "MED2023005",
    course: "Medicine",
    year: "5th Year",
    email: "j.wilson@hcub.edu",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    idNumber: "ART2023006",
    course: "Fine Arts",
    year: "2nd Year",
    email: "lisa.a@hcub.edu",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
];

const StudentCard = ({ student }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-all group relative"
  >
    <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
      <MoreVertical size={18} />
    </button>

    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <img
          src={student.image}
          alt={student.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-background shadow-sm"
        />
        <span
          className={clsx(
            "absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-background",
            student.status === "Active" ? "bg-green-500" : "bg-gray-400"
          )}
        ></span>
      </div>

      <h3 className="font-semibold text-lg mt-3">{student.name}</h3>
      <p className="text-sm text-muted-foreground">{student.idNumber}</p>

      <div className="mt-4 w-full space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 p-2 rounded-lg">
          <GraduationCap size={16} className="text-primary" />
          <span className="truncate">{student.course}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 p-2 rounded-lg">
          <Mail size={16} className="text-primary" />
          <span className="truncate">{student.email}</span>
        </div>
      </div>

      <div className="mt-4 w-full grid grid-cols-2 gap-2">
        <button
          className="py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`View ${student.name}'s profile`}
        >
          Profile
        </button>
        <button
          className="py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
          aria-label={`Remove ${student.name} from course`}
        >
          Remove
        </button>
      </div>
    </div>
  </motion.div>
);

const AddStudentModal = ({ isOpen, onClose }) => {
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
      aria-labelledby="add-student-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 id="add-student-modal-title" className="text-xl font-bold">
            Add New Student
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl bg-accent/20 hover:bg-accent/40 transition-colors cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Upload Student Photo</p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to 5MB
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="student-name" className="text-sm font-medium">
                Full Name
              </label>
              <input
                id="student-name"
                type="text"
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="student-id" className="text-sm font-medium">
                Student ID
              </label>
              <input
                id="student-id"
                type="text"
                placeholder="e.g. CS2024001"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="student-course" className="text-sm font-medium">
                Course
              </label>
              <select
                id="student-course"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                aria-required="true"
              >
                <option>Computer Science</option>
                <option>Engineering</option>
                <option>Business Administration</option>
                <option>Medicine</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="student-year" className="text-sm font-medium">
                Year Level
              </label>
              <select
                id="student-year"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                aria-required="true"
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="student-email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="student-email"
                type="email"
                placeholder="student@hcub.edu"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="student-phone" className="text-sm font-medium">
                Phone Number
              </label>
              <input
                id="student-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground">
            Add Student
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Students = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage student records and enrollments.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border bg-card hover:bg-accent rounded-lg transition-colors font-medium">
            <GraduationCap size={18} />
            Enroll Student
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} />
            Add Student
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full sm:flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-accent/50 border-transparent focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none">
            <option>All Courses</option>
            <option>Computer Science</option>
            <option>Engineering</option>
          </select>
          <select className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none">
            <option>All Years</option>
            <option>1st Year</option>
            <option>2nd Year</option>
          </select>
          <button className="p-2 border border-border rounded-lg hover:bg-accent text-muted-foreground">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {studentsData.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddStudentModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;
