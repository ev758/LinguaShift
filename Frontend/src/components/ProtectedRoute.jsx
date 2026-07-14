import api from "../api.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants.js";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { Navigate } from "react-router";

function ProtectedRoute({ children }) {
    const [authorized, setAuthorized] = useState(null);

    //If there is an access token and it has not expired, set authorized to true. If it is expired, refresh access token.
    useEffect(() => {
        authorization().catch(() => setAuthorized(false));
    }, []);

    //refreshes access token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try {
            //HTTP POST request
            const response = await api.post("token/refresh/", {
                refresh: refreshToken,
            });

            if (response.status === 200) {
                //sets new access token
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setAuthorized(true);
            }
            else {
                setAuthorized(false);
            }
        }
        catch (error) {
            console.log(error);
            setAuthorized(false);
        }
    }

    //Checks if access token needs to be refreshed
    const authorization = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        //If an access token does not exist, set authorized to false
        if (!token) {
            setAuthorized(false);
            return;
        }

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        //If an access token is expired, refresh it
        if (tokenExpiration < now) {
            await refreshToken();
        }
        else {
            //If an access token is not expired, set authorized to true
            setAuthorized(true);
        }
    }

    if (authorized === null) {
        return <div>Loading...</div>;
    }

    //If a user is authorized, they can access protected routes. If a user is not authorized, they need to login with their credentials to get an access and refresh token.
    return authorized ? children : <Navigate to="/login"/>;
}

export default ProtectedRoute;