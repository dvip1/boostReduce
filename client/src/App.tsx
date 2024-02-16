import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import SignUp from "./auth/signup";
import Home from "./pages/home";
import DashBoard from "./pages/dashboard";
import SignIn from "./auth/signin";
import IsAuth from "./auth/isAuth";
import SignOut from "./auth/signout";
import ProtectedRoute from "./auth/protectedRoute";
import WebSocketComponent from "./socket/socket";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/is_auth" element={<IsAuth />} />
        <Route path="/sign_out" element={<SignOut />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/ws" element={<WebSocketComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
