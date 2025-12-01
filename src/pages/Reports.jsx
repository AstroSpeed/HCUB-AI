import React from "react";
import { BarChart3, Download, Calendar, Filter } from "lucide-react";

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            View attendance trends and export data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors bg-card">
            <Calendar size={16} />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors shadow-sm">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Trend Chart Placeholder */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Attendance Trends</h3>
            <BarChart3 size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[65, 40, 75, 55, 80, 60, 90, 70, 85, 50, 65, 75].map(
              (height, i) => (
                <div
                  key={i}
                  className="w-full bg-primary/10 rounded-t-md relative group"
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all duration-500 group-hover:bg-primary/80"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md transition-opacity">
                    {height}%
                  </div>
                </div>
              )
            )}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Department Breakdown Placeholder */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Department Breakdown</h3>
            <Filter size={20} className="text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {[
              { name: "Computer Science", value: 92, color: "bg-blue-500" },
              { name: "Engineering", value: 85, color: "bg-indigo-500" },
              { name: "Business", value: 78, color: "bg-purple-500" },
              { name: "Arts & Design", value: 88, color: "bg-pink-500" },
              { name: "Medicine", value: 95, color: "bg-red-500" },
            ].map((dept) => (
              <div key={dept.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-muted-foreground">{dept.value}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${dept.color} rounded-full`}
                    style={{ width: `${dept.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Average Attendance</p>
          <p className="text-3xl font-bold mt-2">87.5%</p>
          <p className="text-xs text-green-600 mt-1 flex items-center">
            <span className="font-medium">+2.1%</span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Total Sessions</p>
          <p className="text-3xl font-bold mt-2">1,240</p>
          <p className="text-xs text-muted-foreground mt-1">
            Academic Year 2023-2024
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Reports Generated</p>
          <p className="text-3xl font-bold mt-2">48</p>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
