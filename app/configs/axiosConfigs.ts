import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
// Request Interceptor: Logs outgoing requests
import type { InternalAxiosRequestConfig } from 'axios';
// Create a new Axios instance
const apiClient: AxiosInstance = axios.create({
  // You can add default configuration here, e.g., baseURL
  baseURL: 'https://api.example.com',
  timeout: 10000, // Optional: request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});



apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    console.log('--- Axios Request ---');
    console.log(`[${config.method?.toUpperCase()}] ${config.url}`);
    if (config.params) {
      console.log('Params:', config.params);
    }
    if (config.data) {
      // Avoid logging sensitive data in production
      console.log('Data:', config.data);
    }
    console.log('Headers:', config.headers);
    console.log('---------------------');
    // You can modify the config here before it's sent, e.g., add auth token
    // config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('--- Axios Request Error ---');
    console.error(error.message);
    if (error.config) {
        console.error(`URL: ${error.config.url}`);
    }
    console.error('--------------------------');
    return Promise.reject(error);
  }
);

// Response Interceptor: Logs incoming responses
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    console.log('--- Axios Response ---');
    console.log(`Status: ${response.status} (${response.statusText})`);
    console.log(`From: [${response.config.method?.toUpperCase()}] ${response.config.url}`);
    // Avoid logging large data payloads if not needed
    // console.log('Data:', response.data);
    console.log('Headers:', response.headers);
    console.log('----------------------');
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('--- Axios Response Error ---');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status} (${error.response.statusText})`);
      console.error(`From: [${error.response.config.method?.toUpperCase()}] ${error.response.config.url}`);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received for request:', error.request);
       if (error.config) {
           console.error(`URL: ${error.config.url}`);
       }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    console.error('---------------------------');
    return Promise.reject(error);
  }
);

export default apiClient;
