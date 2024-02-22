import axios from "axios";
import { Outlet, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import config from '../config.json'
import { useState, useEffect } from "react";

async function refreshToken(){
    const refreshToken= Cookies.get('refreshToken');
    try{
        const response= await axios.post(`${config.serverUrl}/auth/token/refresh`, 
        {refresh: refreshToken}
        );
        Cookies.set(`accessToken`, response.data.access);
    }
    catch (err) {
        console.log(`Error occured ${err}`);
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login'; 
        return null;
    }
}

axios.interceptors.response.use(
    response => response,  //If nothing is wrong, then do nothing!
    // if something wrong, check if it's 401, if it's 401 -> refresh it!
    async(error) => {
        const originalRequest= error.config;
        if(error.response.status==401 && !originalRequest._retry){
            originalRequest._retry= true;
            const newAccessToken = await refreshToken();
            if(newAccessToken)
            {
                originalRequest.headers['Authorization']= `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            }
        }
        return Promise.reject(error);
    }
)


const ProtectedRoute = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    useEffect(() => {
       const fetchData= async () => {
           setIsLoading(true);
           const token= Cookies.get('accessToken');    
           const response= await axios.post(`${config.serverUrl}/auth/token/verify/`, {token: token});
            try{
            if (response.status==200)
                setIsAuthenticated(true);
            // else if(response.status==401){
            //     await refreshToken();
            //     token= Cookies.get('accessToken');
            //     const response= await axios.post(`${config.serverUrl}/auth/token/verify/`, {token: token});
            //     if (response.status==200)
            //         setIsAuthenticated(true);
            // }
            setIsLoading(false);
        }
        catch(error){
            console.error(`In ProtectedRoutes: ${error}`);

        }
       }

       fetchData();

    }, []);

    if (isLoading) {
        return <div>Loading...</div>; 
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}  
export default ProtectedRoute;

