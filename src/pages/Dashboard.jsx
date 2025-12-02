import React from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Calendar, TrendingUp } from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";
import { useData } from "../context/DataContext";

const Dashboard = () => {
  const { dashboardStats, atRiskStudents } = useAnalytics();
  const { isLoading } = useData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Students",
      value: dashboardStats.totalStudents,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Courses",
      value: dashboardStats.totalCourses,
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Today's Sessions",
      value: dashboardStats.todaySessions,
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      title: "Attendance Rate",
      value: `${dashboardStats.averageAttendanceRate}%`,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* At-Risk Students */}
      {atRiskStudents.length > 0 && (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">
            At-Risk Students (Low Attendance)
          </h3>
          <div className="space-y-3">
            {atRiskStudents.slice(0, 5).map((student) => (
              <div
                key={student.studentId}
                className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{student.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.absences} absences
                  </p>
                </div>
                <span className="text-sm font-semibold text-destructive">
                  {student.attendanceRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
