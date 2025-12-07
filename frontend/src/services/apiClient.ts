import axios from 'axios';

// Production backend: https://capstack-2k25-backend.onrender.com
// Local development: http://localhost:3001
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  (typeof window !== "undefined" && window.location.hostname === "localhost" 
    ? "http://localhost:3001" 
    : "https://capstack-2k25-backend.onrender.com");

const ML_BASE_URL = process.env.NEXT_PUBLIC_ML_URL || 
  (typeof window !== "undefined" && window.location.hostname === "localhost" 
    ? "http://localhost:8000" 
    : "https://capstack-ml.onrender.com");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const mlClient = axios.create({
  baseURL: ML_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// TODO: Add interceptors for auth tokens