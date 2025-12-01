import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  MoreVertical,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import clsx from "clsx";

const studentsData = [
  {
    id: 1,
    name: "Alex Johnson",
    idNumber: "CS2023001",
    status: "Present",
    time: "09:45 AM",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Sarah Williams",
    idNumber: "CS2023002",
    status: "Present",
    time: "09:50 AM",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Michael Brown",
    idNumber: "CS2023003",
    status: "Absent",
    time: "-",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "Emily Davis",
    idNumber: "CS2023004",
    status: "Late",
    time: "10:15 AM",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    name: "James Wilson",
    idNumber: "CS2023005",
    status: "Present",
    time: "09:42 AM",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Present:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Absent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Late: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };

  const icons = {
    Present: CheckCircle,
    Absent: XCircle,
    Late: Clock,
  };

  const Icon = icons[status];

  return (
    <span
      className={clsx(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        styles[status]
      )}
    >
      <Icon size={14} />
      {status}
    </span>
  );
};

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("live");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground mt-1">
            Monitor real-time attendance and view logs.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab("live")}
            className={clsx(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "live"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Live Monitor
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={clsx(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "logs"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Attendance Logs
          </button>
          <Link
            to="/attendance/session/1"
            className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
          >
            Manual Entry
          </Link>
        </div>
      </div>

      {activeTab === "live" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Camera Feed Mock */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black rounded-xl overflow-hidden aspect-video relative group shadow-lg border border-border">
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto animate-pulse">
                    <Camera size={32} className="text-zinc-500" />
                  </div>
                  <p className="text-zinc-500 font-medium">
                    Camera Feed Active
                  </p>
                  <p className="text-xs text-zinc-600">
                    AI Detection Running...
                  </p>
                </div>
              </div>

              {/* Overlay UI */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white text-xs font-medium border border-white/10">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                LIVE
              </div>

              {/* Bounding Box Mock */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  repeatType: "reverse",
                }}
                className="absolute top-1/4 left-1/3 w-48 h-48 border-2 border-primary rounded-lg shadow-[0_0_20px_rgba(14,165,233,0.3)]"
              >
                <div className="absolute -top-8 left-0 bg-primary text-white text-xs px-2 py-1 rounded">
                  Alex Johnson (98%)
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Detected
                </p>
                <p className="text-2xl font-bold mt-1">24</p>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Identified
                </p>
                <p className="text-2xl font-bold mt-1 text-green-600">22</p>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Unknown
                </p>
                <p className="text-2xl font-bold mt-1 text-orange-600">2</p>
              </div>
            </div>
          </div>

          {/* Recent Scans Feed */}
          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col h-[600px]">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Recent Scans</h3>
              <span className="text-xs text-muted-foreground">Real-time</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {studentsData.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors border border-transparent hover:border-border"
                >
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {student.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {student.idNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{student.time}</p>
                    <StatusBadge status={student.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-accent/50 border-transparent focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors">
                <Filter size={16} />
                Filter
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors">
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">ID Number</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Time In</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {studentsData.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={student.image}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium">{student.name}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {student.idNumber}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      Oct 24, 2023
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {student.time}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing 1-5 of 24 results</span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border border-border rounded hover:bg-accent disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button className="px-3 py-1 border border-border rounded hover:bg-accent">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
