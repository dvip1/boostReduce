import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import config from '../config.json'
const SignUp = () => 
{
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const serverUrl:string= config.serverUrl + "/auth/register/"
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
        const formData = new FormData(); // Create a FormData object
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        const response = await axios.post(
            serverUrl,
            formData, 
            { withCredentials: true } 
          );
      if (response.status === 201) {
        // Check response.data directly
        console.log("User created");
        navigate("/login");
      }
      console.log(response);
    } catch (error: any) {
        if (error.response) {
          if (error.response.status === 409) {  // Conflict (e.g., username exists)
            setErrorMessage("User already exists"); 
          } else if (error.response.status === 400) { // Bad request
            setErrorMessage("Invalid input. Please check your email or password."); 
          } else {
            setErrorMessage("An error occurred"); // Fallback for other status codes
          }
    }
  }
}

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <div>
        <section className="my-container">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="#"
              className="flex items-center mb-6 text-2xl font-semibold text-slate-600"
            >
              Welcome to BoostReduce
            </a>
            <div
              className="w-full rounded-lg  dark:border md:mt-0 sm:max-w-md xl:p-0  backdrop-filter backdrop-blur-lg border-none shadow-black "
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1), #D0E7D2",
              }}
            >
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-800 md:text-2xl dark:text-slate-900">
                  Sign up for an account
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-white bg-opacity-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      value={userData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-white bg-opacity-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={userData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="remember"
                          aria-describedby="remember"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-white focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="remember" className="text-slate-800">
                          Remember me
                        </label>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-fit text-black bg-blue-500  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-5 py-2.5 text-center  "
                  >
                    Sign up
                  </button>
                  <p className="text-red-800">{errorMessage}</p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>{" "}
    </>
  );
            };
export  default SignUp
