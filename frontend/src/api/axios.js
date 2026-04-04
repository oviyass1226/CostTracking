import axios from 'axios';

// Live backend URL
const api = axios.create({
    baseURL: 'https://costtracking-q58t.onrender.com',
});

api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;