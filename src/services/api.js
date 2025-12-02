/**
 * @fileoverview Base API service with mock functionality
 */

/**
 * Simulate API delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise}
 */
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulate API errors randomly
 * @param {number} errorRate - Error rate (0-1)
 * @returns {boolean}
 */
const shouldSimulateError = (errorRate = 0.05) => Math.random() < errorRate;

/**
 * API Response wrapper
 * @param {*} data - Response data
 * @param {string} message - Response message
 * @param {boolean} success - Success status
 * @returns {Object}
 */
export const createResponse = (data, message = "Success", success = true) => ({
  success,
  data,
  message,
  timestamp: Date.now(),
  error: success ? null : data,
});

/**
 * API Error wrapper
 * @param {string} message - Error message
 * @param {number} code - Error code
 * @param {Object} details - Error details
 * @returns {Object}
 */
export const createError = (message, code = 500, details = null) => ({
  success: false,
  data: null,
  message,
  error: {
    code,
    message,
    details,
  },
  timestamp: Date.now(),
});

/**
 * Mock API Client
 */
class APIClient {
  constructor(config = {}) {
    this.config = {
      baseURL: config.baseURL || "/api",
      timeout: config.timeout || 5000,
      errorRate: config.errorRate || 0,
      delay: config.delay !== undefined ? config.delay : 300,
    };

    this.interceptors = {
      request: [],
      response: [],
    };
  }

  /**
   * Add request interceptor
   * @param {Function} interceptor
   */
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  /**
   * Add response interceptor
   * @param {Function} interceptor
   */
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  /**
   * Execute request interceptors
   * @param {Object} config - Request config
   * @returns {Object}
   */
  async executeRequestInterceptors(config) {
    let modifiedConfig = { ...config };

    for (const interceptor of this.interceptors.request) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    return modifiedConfig;
  }

  /**
   * Execute response interceptors
   * @param {Object} response - Response object
   * @returns {Object}
   */
  async executeResponseInterceptors(response) {
    let modifiedResponse = { ...response };

    for (const interceptor of this.interceptors.response) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  /**
   * Mock HTTP request
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise}
   */
  async request(method, endpoint, data = null, options = {}) {
    try {
      // Execute request interceptors
      const config = await this.executeRequestInterceptors({
        method,
        endpoint,
        data,
        ...options,
      });

      // Simulate network delay
      if (this.config.delay > 0) {
        await delay(this.config.delay);
      }

      // Simulate random errors
      if (shouldSimulateError(this.config.errorRate)) {
        throw new Error("Network error: Request failed");
      }

      // Mock implementation - to be overridden by specific services
      console.log(`[API] ${method} ${endpoint}`, data);

      const response = createResponse(
        null,
        "Mock response - implement in service",
        true
      );

      // Execute response interceptors
      return await this.executeResponseInterceptors(response);
    } catch (error) {
      const errorResponse = createError(
        error.message || "Request failed",
        error.code || 500,
        error.details || null
      );

      // Execute response interceptors even for errors
      return await this.executeResponseInterceptors(errorResponse);
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise}
   */
  get(endpoint, options = {}) {
    return this.request("GET", endpoint, null, options);
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise}
   */
  post(endpoint, data, options = {}) {
    return this.request("POST", endpoint, data, options);
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise}
   */
  put(endpoint, data, options = {}) {
    return this.request("PUT", endpoint, data, options);
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise}
   */
  delete(endpoint, options = {}) {
    return this.request("DELETE", endpoint, null, options);
  }

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise}
   */
  patch(endpoint, data, options = {}) {
    return this.request("PATCH", endpoint, data, options);
  }
}

// Create and export default API client instance
export const apiClient = new APIClient({
  delay: 500, // Simulate 500ms network delay
  errorRate: 0.02, // 2% error rate for testing
});

// Add default request interceptor (logging)
apiClient.addRequestInterceptor((config) => {
  console.log(`[API Request] ${config.method} ${config.endpoint}`, config.data);
  return config;
});

// Add default response interceptor (logging)
apiClient.addResponseInterceptor((response) => {
  if (response.success) {
    console.log("[API Response] Success:", response.data);
  } else {
    console.error("[API Response] Error:", response.error);
  }
  return response;
});

export default apiClient;
