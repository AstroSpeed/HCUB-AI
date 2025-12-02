/**
 * @fileoverview Authentication service for admin accounts
 */

const AUTH_STORAGE_KEY = "hcub_auth_user";
const DATA_INIT_KEY = "hcub_data_initialized";

/**
 * Create a new admin account
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @param {string} name - Admin name
 * @returns {{success: boolean, message: string, user?: Object}}
 */
export const createAccount = (email, password, name) => {
  try {
    // Basic validation
    if (!email || !password || !name) {
      return { success: false, message: "All fields are required" };
    }

    if (!email.includes("@")) {
      return { success: false, message: "Invalid email format" };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    // Check if account already exists
    const existing = localStorage.getItem(AUTH_STORAGE_KEY);
    if (existing) {
      return {
        success: false,
        message: "An account already exists. Please login.",
      };
    }

    // Create user object
    const user = {
      id: `admin_${Date.now()}`,
      email,
      name,
      // In production, NEVER store plain passwords! Use backend with proper hashing
      password, // Demo only - would be hashed on backend
      role: "admin",
      createdAt: new Date().toISOString(),
    };

    // Save user
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

    // Mark as needing data initialization (will clear dummy data)
    localStorage.setItem(DATA_INIT_KEY, "pending");

    return {
      success: true,
      message: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    return { success: false, message: "Failed to create account" };
  }
};

/**
 * Authenticate user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {{success: boolean, message: string, user?: Object}}
 */
export const authenticateUser = (email, password) => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!stored) {
      return {
        success: false,
        message: "No account found. Please sign up first.",
      };
    }

    const user = JSON.parse(stored);

    if (user.email !== email || user.password !== password) {
      return { success: false, message: "Invalid email or password" };
    }

    return {
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    return { success: false, message: "Login failed" };
  }
};

/**
 * Get current logged-in user
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const user = JSON.parse(stored);
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch (error) {
    return null;
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  // Don't clear AUTH_STORAGE_KEY - keep account
  // Just clear session (in a real app, would clear session token)
  // For this demo, logout just returns to login screen
};

/**
 * Check if data initialization is pending (first login)
 * @returns {boolean}
 */
export const isDataInitPending = () => {
  return localStorage.getItem(DATA_INIT_KEY) === "pending";
};

/**
 * Mark data as initialized
 */
export const markDataInitialized = () => {
  localStorage.setItem(DATA_INIT_KEY, "completed");
};

/**
 * Reset data init status (for testing)
 */
export const resetDataInit = () => {
  localStorage.removeItem(DATA_INIT_KEY);
};

export default {
  createAccount,
  authenticateUser,
  getCurrentUser,
  logoutUser,
  isDataInitPending,
  markDataInitialized,
  resetDataInit,
};
