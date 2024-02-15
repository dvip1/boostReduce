import { Outlet, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
const ProtectedRoute = () => {
    const token = Cookies.get('accessToken');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}  
export default ProtectedRoute;