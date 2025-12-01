import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="students"
            element={<div className="p-4">Students Page (Coming Soon)</div>}
          />
          <Route path="attendance" element={<Attendance />} />
          <Route path="reports" element={<Reports />} />
          <Route
            path="settings"
            element={<div className="p-4">Settings Page (Coming Soon)</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
