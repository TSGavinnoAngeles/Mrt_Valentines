import { click } from '@testing-library/user-event/dist/click';
import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';


const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, seterrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    }




  async function submit(e: React.FormEvent<HTMLFormElement> ) {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:0905/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Handle successful response from the server

        // Redirect to the dashboard after successful login
        navigate('/admin-dashboard');
      } else {
        const errorData = await response.json();
        console.error(errorData); // Handle errors from the server
          seterrorMessage("Invalid username or password try again")
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }



  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={submit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >
                  Your email
                </label>
                <input
                  maxLength={43}
                  type="email"
                  onChange={(e) => changeEmail(e)}
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                    maxLength={63}
                    type="password"
                    onChange={(e) => changePassword(e)}  // Invoke the function with (e)
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Sign in
              </button>
              </form>
              <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
                     {errorMessage}
                  </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;