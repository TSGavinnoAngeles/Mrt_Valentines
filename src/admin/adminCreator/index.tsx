import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';

const CardCreator = () => {
  const navigate = useNavigate();

  const [idNums, setIdNums] = useState(genID);
  const [bal, setBal] = useState(50);
  const [stat, setStat] = useState(false);

  function genID(): number {
    const min = 1000000000;
    const max = 9999999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  const handleAddCard = async (): Promise<void> => {
    try {
      // Check if idNums and bal are valid numbers
      if (idNums == null || bal == null) {
        window.alert('Please fill in all the fields with valid numbers');
        navigate('/admin-dashboard/UUID-Editor/User-Creator');
        return;
      }
      const idExistsResponse = await fetch(`http://localhost:0905/checkIdExists/${idNums}`);
      const idExistsData = await idExistsResponse.json();

      if (idExistsData.exists) {
        window.alert('User with the same UUID already exists. Please generate a new UUID.');
        return;
      }

      const response = await fetch('http://localhost:0905/addcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idNums, bal, stat }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Card added successfully:', data);
        // You can perform additional actions, such as updating the UI.
        window.alert(`User Created: ${idNums}`);
        navigate('/admin-dashboard/UUID-Editor');
      } else {
        const errorData = await response.json();
        console.error('Error adding card:', errorData);
        // Handle errors from the server.
        window.alert('Server Not Connected');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle network errors or other issues.
      window.alert('Server Not Connected');
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Creating a New ID
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Generated ID: 
                </label>
                <input
                 value={ idNums || ''} 
                  onChange={(e) => setIdNums(Number(e.target.value))}
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder= "will be generated if left blank"
                  readOnly
                  required
                />
              </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Balance to Load: 
                </label>
                <input
                    onChange={(e) => setBal(Number(e.target.value))}
                    type="number"
                    pattern="^\d{5}(-\d{4})?$"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="default value is 50"
                    required
                />
            </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setStat(false);
                 handleAddCard();
                }}
                type="submit"
                className="w-half text-white bg-primary-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">    
                Create User
              </button>

              <button type="button"
                onClick={(e) => navigate('/admin-dashboard/UUID-Editor')}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" >
               Nevermind
             </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardCreator;
