import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
const CheckAuth = () => {
  const token = Cookies.get('accessToken');
  if (!token) {
    return false; // Not authenticated if there's no token
  }
  try {
    const { exp } = jwtDecode(token) as { exp: number }; 
    if (Date.now() >= exp * 1000) {
      return false; // Not authenticated if the token is expired
    } else {
      return true; // Authenticated if the token is present and not expired
    }
  } catch {
    return false; // Not authenticated if the token is invalid
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