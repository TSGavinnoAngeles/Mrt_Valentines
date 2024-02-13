import e from 'express';
import React, { useState, useEffect } from 'react';
import UserEditor from '../admin/userEditor';

interface props { 
  setSearCard:any;
}



const UserCardView : React.FC<props> = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [searCard, setSearCard] = useState(0);
  console.log(searCard)


  useEffect(() => {
    getCards();
  }, []);

  async function getCards() {
    try {
      const response = await fetch('http://localhost:0905/cards');
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      } else {
        const errorData = await response.json();
        console.error(errorData); // Handle errors from the server
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } 
  }

  async function deleteCard(idNums: number) {
    try {
      const response = await fetch(`http://localhost:0905/delCards/${idNums}`, {
        method: 'DELETE', // Specify the HTTP method as DELETE
      });
  
      if (response.ok) {
        // Successfully deleted
        const data = await response.json();
        console.log('Card deleted successfully:', data);
  
        // Update your UI or perform any necessary actions
      } else {
        // Server returned an error status
        const errorData = await response.json();
        console.error('Error deleting card:', errorData);
  
        // Handle errors from the server
      }
    } catch (error) {
      // Network error or other issues
      console.error('An error occurred:', error);
    }
  }


  

  const handleButtonClick = (idNums : any) => {
    // Display a confirmation dialog
    const userConfirmed = window.confirm(`You will be deleting ${idNums} from the system. Click to confirm`);
    if (userConfirmed) {
      console.log('Noted. Deleting the User');
      deleteCard(idNums)
      window.location.reload();
    } else {
      // User clicked "Cancel" in the dialog
      console.log('Noted. Stopping the deletion process now.');
    }
  };
  return (
    
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg alig">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              UUID
            </th>
            <th scope="col" className="px-6 py-3">
              Balance
            </th>
            <th scope="col" className="px-6 py-3">
              In/Out
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
             <tr 
             onClick = {(e) => {setSearCard(card.idNums)}}
             key={card._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
             <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" >{card.idNums}</th>
             <td className="px-6 py-4">{card.bal}</td>
             <td className="px-6 py-4">{card.stat === true ? 'In' : 'Out'}</td>
             <td className="px-6 py-4 text-right">
             <div className="inline-flex rounded-md shadow-sm" role="group">
             <button type="button"
             onClick={(e) => handleButtonClick(card.idNums)}
             className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" >
               Delete User ID
             </button>
               </div>
             </td>
           </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};
export default UserCardView;
