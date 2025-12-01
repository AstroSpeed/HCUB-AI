import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";

const studentsList = [
  { id: 1, name: "Alex Johnson", idNumber: "CS2023001", status: "Present" },
  { id: 2, name: "Sarah Williams", idNumber: "CS2023002", status: "Present" },
  { id: 3, name: "Michael Brown", idNumber: "ENG2023003", status: "Absent" },
  { id: 4, name: "Emily Davis", idNumber: "BUS2023004", status: "Late" },
  { id: 5, name: "James Wilson", idNumber: "MED2023005", status: "Present" },
  { id: 6, name: "Lisa Anderson", idNumber: "ART2023006", status: "Flagged" },
];

const SessionAttendance = () => {
  const [students, setStudents] = useState(studentsList);
  const [isSaved, setIsSaved] = useState(false);

  const handleStatusChange = (id, newStatus) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/attendance"
          className="p-2 hover:bg-accent rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            CS101: Intro to Computer Science
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> Oct 24, 2023
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> 10:00 AM - 11:30 AM
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} /> 45 Students
            </span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
          >
            <Save size={18} />
            {isSaved ? "Saved!" : "Save Attendance"}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
          <h3 className="font-semibold">Student List</h3>
          <div className="flex gap-2 text-sm">
            <button className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
              Present: {students.filter((s) => s.status === "Present").length}
            </button>
            <button className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium">
              Absent: {students.filter((s) => s.status === "Absent").length}
            </button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {students.map((student) => (
            <div
              key={student.id}
              className="p-4 flex items-center justify-between hover:bg-accent/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.idNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(student.id, "Present")}
                  className={clsx(
                    "p-2 rounded-lg transition-all",
                    student.status === "Present"
                      ? "bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-2"
                      : "text-muted-foreground hover:bg-green-50 hover:text-green-600"
                  )}
                  title="Mark Present"
                >
                  <CheckCircle size={20} />
                </button>
                <button
                  onClick={() => handleStatusChange(student.id, "Absent")}
                  className={clsx(
                    "p-2 rounded-lg transition-all",
                    student.status === "Absent"
                      ? "bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-2"
                      : "text-muted-foreground hover:bg-red-50 hover:text-red-600"
                  )}
                  title="Mark Absent"
                >
                  <XCircle size={20} />
                </button>
                <button
                  onClick={() => handleStatusChange(student.id, "Late")}
                  className={clsx(
                    "p-2 rounded-lg transition-all",
                    student.status === "Late"
                      ? "bg-orange-100 text-orange-700 ring-2 ring-orange-500 ring-offset-2"
                      : "text-muted-foreground hover:bg-orange-50 hover:text-orange-600"
                  )}
                  title="Mark Late"
                >
                  <Clock size={20} />
                </button>
                <button
                  onClick={() => handleStatusChange(student.id, "Flagged")}
                  className={clsx(
                    "p-2 rounded-lg transition-all",
                    student.status === "Flagged"
                      ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500 ring-offset-2"
                      : "text-muted-foreground hover:bg-yellow-50 hover:text-yellow-600"
                  )}
                  title="Flag Student"
                >
                  <AlertTriangle size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionAttendance;
