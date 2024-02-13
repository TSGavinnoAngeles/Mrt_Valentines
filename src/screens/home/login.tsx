
import React, { useState } from 'react';
import Navigation from '../../components/navigation';
import { useNavigate } from 'react-router-dom';
import { useAuth, AuthProvider } from '../context/AuthContext';
import { tokenToString } from 'typescript';
 
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');



  const handleLogin = () => {
    const body = {
      "email": username,
      "password": password
    };
  
    fetch("http://localhost:0905/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
    .then((res) => res.json())
    .then((res) => {
      if (res.message === 'Login successful' && res.token) {
        // Login was successful
        console.log(res.message, res.token); 
        console.log(login)
        localStorage.setItem("token", res.token);
        login(res.token);

        
      } else {
        // Login failed
        console.error('Login failed:', res.message);
        setErrorMessage(res.message)
        // Handle error, display a message to the user, etc.
      }
    })
    .catch((error) => {
      console.error('Error during login:', error);
      // Handle error, display a message to the user, etc.
    });
  };

  return (
<section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6" action="#">
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input 
                          onChange={(e)=>setUsername(e.target.value)}
                          type="text" 
                          name="email"
                          // pattern = "/s"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input 
                          onChange={(e)=>setPassword(e.target.value)}
                          type="password" name="password"  placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <button 
                      onClick={(e)=> {
                        e.preventDefault();
                        handleLogin();
                        console.log(username, password)
                      }}  
                      type="submit" 
                      className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    > Sign in
                    </button>
                    <div className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    {errorMessage}
                    </div>

                </form>
            </div>
        </div>
    </div>
  </section>
  );
}
 
export default Login;