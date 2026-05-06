import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
});

// Har request pe token automatically add hoga
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
         console.log("Token being sent:", token); // ← ye add karo
    }
    return config;
});

export default axiosInstance;