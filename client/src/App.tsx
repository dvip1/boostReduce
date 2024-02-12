import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import SignUp from "./components/signup";
import Home from "./pages/home";
import DashBoard from "./pages/dashboard";
import SignIn from "./components/signin";
import IsAuth from "./components/isAuth";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/register' element={< SignUp />} />
        <Route path="/dashboard" element={ <DashBoard />} />
        <Route path="/login" element= {<SignIn />} />        
        <Route path="/is_auth" element= {<IsAuth />} />        

      </Routes>
    </BrowserRouter >

  );
}