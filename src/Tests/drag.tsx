import React, { useState , useEffect} from "react";

const Drag = () => {

  const [widgets, setWidgets] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [cardId, setCardId] = useState('');
  const [updateAmount, setUpdateAmount] = useState('');
  const [isAddition, setIsAddition] = useState(true);

  function handleOnDrag(e: React.DragEvent, widgetType: string) {
    e.dataTransfer.setData("widgetType", widgetType);
    setWidgets([]);

  }

  function handleOnDrop(e: React.DragEvent) {
    const widgetType = e.dataTransfer.getData("widgetType") as string;
    console.log("widget: ", widgetType);
    setWidgets([...widgets, widgetType]);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function clearAll (){ 
    setWidgets([]);
  }

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

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:0905/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedValue: parseFloat(updateAmount),
          isAddition, 
        }),
      });

      if (!response.ok) {
        console.error(`Failed to update card. Status: ${response.status}`);
        return;
      }

    } catch (error) {
      console.error('Error updating card:', error);

    }
  };



  return (
    <div>

<div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg alig">
              <table className="w-full text-sm text-left rtl:text-right text-black-500 dark:text-black-400">
               <thead className="text-xs text-black-700 uppercase bg-white-50 dark:bg-white-700 dark:text-black-400">
                <tr>
                   <th scope="col" className="px-6 py-3">
                    ID
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
                  draggable
                  onDragStart={(e) => handleOnDrag(e, card.idNums)}
                  onClick = {(e) => {setCardId(card.idNums)}}
                  key={card._id} className="bg-white border-b dark:bg-white-800 dark:border-gray-700 hover:bg-indigo-300 dark:hover:bg-white-600 text-2xl ">
                  <th scope="row" className="px-6 py-4 font-medium text-black-900 whitespace-nowrap dark:text-black" >{card.idNums}</th>
                  <td className="px-6 py-4">{card.bal}</td>
                  <td className="px-6 py-4">{card.stat === true ? 'In' : 'Out'}</td>
                  <td className="px-6 py-4 text-right">
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button type="submit"
                  onClick={(e) => handleButtonClick(card.idNums)}
                  className="focus:outline-none text-black bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" >
                    Delete User ID
                  </button>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

      



      {/* DROP Area */}
      <div onDrop={handleOnDrop} onDragOver={handleDragOver} style={{ marginTop: "20px", padding: "20px", border: "20px dashed gray" }}>
        {/* {widgets.map((widget, index) => (
          <div key={index} style={{ border: "1px solid black", padding: "5px", margin: "5px" }}>
            {widget}
          </div>
        ))} */}


<form>
        {/* <h1 className="text-3xl font-bold white dark:text-black text-center"> Manage ID's</h1> */}
        <div className="grid gap-3 mb-3 md:grid-cols-2">
          <div className='relative'>
            <label className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Enter User ID</label>
            <input
              type="number" pattern="[0-9]* "
              value={widgets[0]}
              onChange={(e) => setCardId(e.target.value)}
              className="bg-white-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Place ID Here" />

         {/* <input type="text" id="floating_outlined" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " /> */}
         {/* <label htmlForor="floating_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Floating outlined</label> */}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Enter Amount To Add</label>
            <input type="number" pattern="[0-9]*"  onChange={(e) => setUpdateAmount(e.target.value)} className="bg-white-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Add x to Balance" />
          </div>

          <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input id="bordered-checkbox-1" type="checkbox" value="" name="bordered-checkbox" className="w-4 h-4 text-blue-600 bg-white-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-white-700 dark:border-gray-600" checked={isAddition} onChange={() => setIsAddition(!isAddition)} />
            <label htmlFor="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-black-900 dark:text-black-300">Check if Adding to the Balance of</label>
          </div>

          {/* <button type="submit" className="text-white bg-black-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" */}
          
         <button type="submit" className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
            onClick={
              handleUpdate
              
              } >Modify Balance</button>
          </div>
      </form>
      </div>

      <div>
        <button
        type = "button"
        onClick={clearAll}> Clear </button>
      </div>
    </div>


  );
};

export default Drag;
