import { useState, useEffect } from "react";
import axios from "axios";
const CheckAuth = async () => {
    try {
        const response = await axios.get(
            "http://localhost:8000/is_auth/",
            { withCredentials: true } 
        );
        console.log(response.data)
        return response.data.isAuthenticated; // Return 'true' or 'false' directly
    } catch (error) {
        console.error("Error checking authentication:", error); 
        return false; // Assume not authenticated in case of an error
    }
}

const IsAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Initial state: not logged in
    const [isLoading, setIsLoading] = useState(true);  // Show loading while we check
  
    useEffect(() => {
      const checkAuthentication = async () => { 
        try {
          const isLoggedIn = await CheckAuth();
          setIsLoggedIn(isLoggedIn);
        } catch (error) {
          console.error("Error checking authentication:", error); 
        } finally {
          setIsLoading(false); 
        }
      };
  
      checkAuthentication(); 
    }, []); 
  
    return (
      <div>
        {isLoading ? (
          <p>Checking authentication...</p>
        ) : isLoggedIn ? (
          <p>Welcome back!</p>
        ) : (
          <p>Please log in.</p>
        )}
      </div>
    );
  };
  
export default IsAuth;