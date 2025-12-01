import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  User,
  Globe,
  Moon,
  Smartphone,
  Mail,
  Save,
} from "lucide-react";
import clsx from "clsx";

const SettingsSection = ({ title, description, children }) => (
  <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
    <div className="mb-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-sm">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={clsx(
        "w-11 h-6 rounded-full transition-colors relative",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={clsx(
          "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoLock, setAutoLock] = useState(true);

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System", icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and system settings.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <SettingsSection
                title="Profile Information"
                description="Update your personal details and public profile."
              >
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      AD
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-background border border-border rounded-full shadow-sm hover:bg-accent transition-colors">
                      <User size={14} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">Admin User</h4>
                    <p className="text-sm text-muted-foreground">
                      admin@hcub.edu
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      defaultValue="Admin"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      defaultValue="User"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      defaultValue="admin@hcub.edu"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Appearance"
                description="Customize how the application looks on your device."
              >
                <Toggle
                  label="Dark Mode"
                  description="Use a dark color theme for low-light environments."
                  checked={darkMode}
                  onChange={setDarkMode}
                />
              </SettingsSection>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <SettingsSection
                title="Email Notifications"
                description="Choose what emails you want to receive."
              >
                <Toggle
                  label="Daily Attendance Summary"
                  description="Receive a summary of daily attendance stats at 5:00 PM."
                  checked={emailNotifs}
                  onChange={setEmailNotifs}
                />
                <div className="h-px bg-border my-4" />
                <Toggle
                  label="System Alerts"
                  description="Get notified about system maintenance and updates."
                  checked={true}
                  onChange={() => {}}
                />
              </SettingsSection>

              <SettingsSection
                title="Push Notifications"
                description="Manage mobile and desktop push alerts."
              >
                <Toggle
                  label="Real-time Alerts"
                  description="Get instant notifications for flagged attendance events."
                  checked={smsNotifs}
                  onChange={setSmsNotifs}
                />
              </SettingsSection>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <SettingsSection
                title="Login & Security"
                description="Manage your password and security preferences."
              >
                <div className="space-y-4">
                  <button className="text-sm text-primary hover:underline font-medium">
                    Change Password
                  </button>
                  <div className="h-px bg-border" />
                  <Toggle
                    label="Two-Factor Authentication"
                    description="Add an extra layer of security to your account."
                    checked={false}
                    onChange={() => {}}
                  />
                  <div className="h-px bg-border" />
                  <Toggle
                    label="Auto-Lock Session"
                    description="Automatically lock the screen after 15 minutes of inactivity."
                    checked={autoLock}
                    onChange={setAutoLock}
                  />
                </div>
              </SettingsSection>
            </motion.div>
          )}

          {activeTab === "system" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <SettingsSection
                title="Camera Configuration"
                description="Manage connected AI cameras and detection settings."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-accent/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div>
                        <p className="text-sm font-medium">
                          Main Entrance Camera
                        </p>
                        <p className="text-xs text-muted-foreground">
                          IP: 192.168.1.105 • Online
                        </p>
                      </div>
                    </div>
                    <button className="text-xs border border-border px-2 py-1 rounded hover:bg-background">
                      Configure
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-accent/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div>
                        <p className="text-sm font-medium">Lecture Hall 3B</p>
                        <p className="text-xs text-muted-foreground">
                          IP: 192.168.1.108 • Online
                        </p>
                      </div>
                    </div>
                    <button className="text-xs border border-border px-2 py-1 rounded hover:bg-background">
                      Configure
                    </button>
                  </div>
                  <button className="w-full py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    + Add New Camera
                  </button>
                </div>
              </SettingsSection>

              <SettingsSection
                title="AI Detection Thresholds"
                description="Adjust the sensitivity of the facial recognition model."
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence Threshold</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="85"
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              </SettingsSection>
            </motion.div>
          )}

          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
