import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Helper function to get user data from localStorage
function getUserData() {
  if (typeof document !== 'undefined') {
    // Get the 'userData' cookie value
    const match = document.cookie.match(new RegExp('(^|; )userData=([^;]*)'));
    if (match && match[2]) {
      try {
        const decoded = decodeURIComponent(match[2]);
        console.log('userData from cookies:', decoded);
        return JSON.parse(decoded);
      } catch (e) {
        console.error('Error parsing userData from cookies:', e);
        return null;
      }
    }
  }
  return null;
}

// Add a request interceptor to inject user data into headers (except for auth endpoints)
axios.interceptors.request.use(
  (config) => {
    const isAuthEndpoint =
      config.url &&
      (config.url.includes('/login') || config.url.includes('/register'));

    if (!isAuthEndpoint) {
      const userData = getUserData();
      console.log('userData from interceptor:', userData);
      if (userData) {
        // You can customize which fields to send; here we send all userData as a JSON string
        // Or, if you want to send specific fields, e.g.:
        config.headers['x-user-id'] = userData.userId;
        config.headers['x-user-email'] = userData.email;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.request.use(
  (config) => {
   
    console.log('📤 REQUEST:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      params: config.params,
      data: config.data,
      headers: config.headers,
      timestamp: new Date().toISOString(),
    });
    return config;
  },
  (error) => {
    console.error('❌ REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);


axios.interceptors.response.use(
  (response) => {
    console.log('📥 RESPONSE:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
      timestamp: new Date().toISOString(),
    });
    return response;
  },
  (error) => {
    console.error('❌ RESPONSE ERROR:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      timestamp: new Date().toISOString(),
    });
    
    // Check if this is an auth endpoint (login or register)
    const isAuthEndpoint = error.config?.url && (
      error.config.url.includes('/login') || 
      error.config.url.includes('/register')
    );
    
    // Only redirect on 401 for non-auth endpoints
    if (error.response?.status === 401 && !isAuthEndpoint && typeof window !== 'undefined') {
      // Store current path as returnUrl if not already on login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login')) {
        window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
      }
    }
    
    return Promise.reject(error);
  }
);


axios.interceptors.request.use((config) => {
  return config;
});

export default axios;