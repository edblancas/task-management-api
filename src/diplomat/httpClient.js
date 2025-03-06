import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Create an axios instance with default configurations
const httpClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include correlation ID in all outgoing requests
httpClient.interceptors.request.use(
  (config) => {
    // Get correlation ID from request or create a new one
    const correlationId = config.headers['x-correlation-id'] || uuidv4();
    config.headers['x-correlation-id'] = correlationId;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log the error including correlation ID if available
    const correlationId = error.config?.headers?.['x-correlation-id'] || 'unknown';
    console.error(`HTTP request error (Correlation ID: ${correlationId}):`, error.message);

    // Extract relevant error details
    const errorDetails = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      correlationId
    };

    return Promise.reject(errorDetails);
  }
);

export default httpClient;

// Example of a specific API client
export const exampleApiClient = {
  getResource: async (resourceId, options = {}) => {
    try {
      const response = await httpClient.get(`/api/resources/${resourceId}`, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createResource: async (resourceData, options = {}) => {
    try {
      const response = await httpClient.post('/api/resources', resourceData, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
