import axios from "axios"
import { ACCESS_TOKEN } from "./constants.js";

//creates axios and sets url to Django api
const api = axios.create({
    baseURL: import.meta.env.VITE_DJANGO_SERVER
});

//The interceptor will intercept HTTP requests to add an authorization header to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        //If an access token exists, add it as an authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;