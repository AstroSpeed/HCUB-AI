import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";

const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-2 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs">
      <span
        className={`flex items-center font-medium ${
          changeType === "positive" ? "text-green-600" : "text-red-600"
        }`}
      >
        {changeType === "positive" ? (
          <ArrowUpRight size={14} className="mr-1" />
        ) : (
          <ArrowDownRight size={14} className="mr-1" />
        )}
        {change}
      </span>
      <span className="text-muted-foreground ml-2">from last month</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="2,543"
          change="+12%"
          changeType="positive"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Present Today"
          value="2,105"
          change="+5%"
          changeType="positive"
          icon={UserCheck}
          color="bg-green-500"
        />
        <StatCard
          title="Absent"
          value="438"
          change="-2%"
          changeType="positive"
          icon={UserX}
          color="bg-red-500"
        />
        <StatCard
          title="Late Arrivals"
          value="125"
          change="+8%"
          changeType="negative"
          icon={Clock}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Activity & Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Attendance Overview</h3>
            <select className="text-sm border border-border rounded-md px-2 py-1 bg-background">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-accent/30 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground text-sm">
              Chart Visualization Placeholder
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">
                    Computer Science A - Lecture started
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    10:00 AM • Hall 3B
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
