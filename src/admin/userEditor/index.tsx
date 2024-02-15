import React, { useState, useEffect } from "react";
import Navigation from "./../../components/adminnav";
import { useNavigate } from "react-router-dom";

function UserEditor() {
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState<any[]>([]);
  const [delWidgets, setDelWidgets] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [cardId, setCardId] = useState("");
  const [updateAmount, setUpdateAmount] = useState("");
  const [isAddition, setIsAddition] = useState(true);
  const [selWidgets, setSelWidgets] = useState<any[]>([]);

  function handleOnDrag(e: React.DragEvent, widgetType: string) {
    e.dataTransfer.setData("widgetType", widgetType);
    setWidgets([]);
    setDelWidgets([]);
  }

  function handleOnDrop(e: React.DragEvent) {
    const widgetType = e.dataTransfer.getData("widgetType") as string;
    console.log("widget: ", widgetType);
    setWidgets([...widgets, widgetType]);
    setCardId(widgetType);
  }

  function deleteOnDrop(e: React.DragEvent) {
    const DelwidgetType = e.dataTransfer.getData("widgetType") as string;
    setDelWidgets([...widgets, DelwidgetType]);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDragOverDelete(e: React.DragEvent) {
    e.preventDefault();
    setWidgets([]);
  }

  useEffect(() => {
    getCards();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:0905/cards/${cardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
      console.error("Error updating card:", error);
    }
  };

  async function getCards() {
    try {
      const response = await fetch("http://localhost:0905/cards");
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      } else {
        const errorData = await response.json();
        console.error(errorData); // Handle errors from the server
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async function deleteCard(idNums: number) {
    try {
      const response = await fetch(`http://localhost:0905/delCards/${idNums}`, {
        method: "DELETE", // Specify the HTTP method as DELETE
      });

      if (response.ok) {
        // Successfully deleted
        const data = await response.json();
        console.log("Card deleted successfully:", data);

        // Update your UI or perform any necessary actions
      } else {
        // Server returned an error status
        const errorData = await response.json();
        console.error("Error deleting card:", errorData);

        // Handle errors from the server
      }
    } catch (error) {
      // Network error or other issues
      console.error("An error occurred:", error);
    }
  }

  const handleButtonClick = (idNums: any) => {
    if (idNums.length === 0) {
      window.alert(`Please put a deletion target before deleting`);
    } else {
      const userConfirmed = window.confirm(
        `You will be deleting ${idNums} from the system. Click to confirm`
      );
      if (userConfirmed) {
        console.log("Noted. Deleting the User");
        deleteCard(idNums);
        window.location.reload();
      } else {
        console.log("Noted. Stopping the deletion process now.");
      }
    }
  };

  return (
    <div>
      <Navigation />
      <div className="mb-2"> </div>
      <div className="px-12 min-h-min overflow-x-auto">
        <div className="flex mb-2 space-x-2 ">
          <div className="w-1/2 px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 align-left max-h-min">
            <div className="flex flex-row space-x-80">
              <div className=" text-2xl ml-10">Card Management</div>
              <div>
                <button
                  type="submit"
                  className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2 self-center object-right-top"
                  onClick={
                    // handleUpdate
                    (e) => navigate("/admin-dashboard/UUID-Editor/User-Creator")
                  }
                >
                  {" "}
                  Add User
                </button>
              </div>
            </div>
            <div className=" max-h-96 overflow-y-auto">
              <div className="relative shadow-md sm:rounded-lg align ">
                <table className="w-full text-sm text-left rtl:text-right text-black-500 dark:text-black-400">
                  <thead className="text-xs text-zinc-50 uppercase bg-gray-500 dark:bg-zinc-950 dark:text-black-400">
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
                        onClick={(e) => {
                          setWidgets(card.idNums);
                        }}
                        key={card._id}
                        className="bg-white border-b dark:bg-white-800 dark:border-gray-700 hover:bg-indigo-300 dark:hover:bg-white-600 text-2xl "
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-black-900 whitespace-nowrap dark:text-black"
                        >
                          {card.idNums}
                        </th>
                        <td className="px-6 py-4">{card.bal}</td>
                        <td className="px-6 py-4">
                          {card.stat === true ? "In" : "Out"}
                        </td>
                        <td className="px-6 py-4 text-right"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="w-1/2 px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 ml-0 max-h-fit overflow-y-auto flex-shrink-0 max-w-[50%]">
            <div className="flex flex-row space-x-80">
              <div className=" text-2xl ml-3 mt-3">Balance Management</div>

              <div>
                <button
                  type="submit"
                  className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2 self-center object-right-top"
                  onClick={
                    // handleUpdate
                    (e) => setDelWidgets([])
                  }
                >
                  {" "}
                  Clear Deletion
                </button>
              </div>
            </div>

            <div
              className=""
              onDrop={handleOnDrop}
              onDragOver={handleDragOver}
              style={{
                marginTop: "20px",
                padding: "10px",
                border: "2px dashed black",
                width: "710px",
                height: "350px",
              }}
            >
              <form>
                <div className="mb-3 md:grid-cols-2">
                  <div className="relative">
                    <label className="block mb-2 text-xl font-medium text-black-900 dark:text-black">
                      Insert ID{" "}
                    </label>
                    <input
                      readOnly
                      type="number"
                      pattern="[0-9]* "
                      value={widgets}
                      onChange={(e) => setCardId(widgets[0])}
                      id="floating_standard"
                      className=" text-xl bg-white-50 border border-gray-300 text-black-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-xl font-medium text-black-900 dark:text-black">
                      Enter Amount To Add
                    </label>
                    <input
                      type="number"
                      pattern="[0-9]*"
                      onChange={(e) => setUpdateAmount(e.target.value)}
                      className="bg-white-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Add x to Balance"
                    />
                  </div>

                  <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 my-5">
                    <input
                      id="bordered-checkbox-1"
                      type="checkbox"
                      value=""
                      name="bordered-checkbox"
                      className="w-4 h-4 text-blue-600 bg-white-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-white-700 dark:border-gray-600"
                      checked={isAddition}
                      onChange={() => setIsAddition(!isAddition)}
                    />
                    <label
                      htmlFor="bordered-checkbox-1"
                      className="w-full py-4 ms-2 text-xl font-medium text-black-900 dark:text-black-300"
                    >
                      Check if Adding to the Balance of {widgets}
                    </label>
                  </div>

                  {/* <button type="submit" className="text-white bg-black-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" */}

                  <button
                    type="submit"
                    style={{
                      marginTop: "0px",
                      padding: "10px",
                      width: "500px",
                      height: "50px",
                    }}
                    className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2 ml-20"
                    onClick={
                      handleUpdate
                      // (e) => console.log(cardId)
                    }
                  >
                    Modify Balance
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div
          className="rounded-mb bg-red-700"
          onClick={() => handleButtonClick(delWidgets)}
          onDrop={deleteOnDrop}
          onDragOver={handleDragOverDelete}
          style={{
            marginTop: "35px",
            padding: "10px",
            width: "710",
            height: "100px",
          }}
        >
          <h1>
            <p className="text-6xl text-center font-semibold text-blue-50 dark:text-maroon-500/100 ">
              {delWidgets}
            </p>
          </h1>
          <div className="inline-flex rounded-md shadow-sm" role="group"></div>
        </div>
      </div>
    </div>
  );
}

export default UserEditor;
