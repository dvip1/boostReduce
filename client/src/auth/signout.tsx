import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

export default function SignOut (){
    const [isSignedOut, setIsSignedOut] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const signOut = async () => {
            try {
                // Remove the tokens from the cookie
                Cookies.remove('refreshToken');
                Cookies.remove('accessToken');
                setIsSignedOut(true);
            } catch (error) {
                setIsSignedOut(false);
            }
            setIsLoading(false);
        }
        signOut();
    }, []);

    return (
        <div>
            {isLoading ? (
                <p>Signing out...</p>
            ) : isSignedOut ? (
                <p>Goodbye!</p>
            ) : (
                <p>Error signing out.</p>
            )}
        </div>
    );
}