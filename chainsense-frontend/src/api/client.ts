import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  timeout: 90000, // AI pipeline calls can take 30-60s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Unwrap ApiResponse<T> wrapper — backend always returns { success, data, message, error, timestamp }
client.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data &&
      'data' in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    console.warn('[API Error]', error.message);
    return Promise.reject(error);
  }
);

export default client;
