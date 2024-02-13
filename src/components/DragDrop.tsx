import React, {useState} from "react";
import Dragging from './dragging';


const [cards, setCards] = useState<any[]>([]);
const [cardId, setCardId] = useState('');
const [updateAmount, setUpdateAmount] = useState('');
const [isAddition, setIsAddition] = useState(true);

  
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


function DragDrop(){
    return (

        <>
        <div className="List"> 
        </div>
        <div className="Board"> </div>
        
        </>


    );


}

export default DragDrop