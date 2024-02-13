import React, { useState } from 'react';

const CardUpdateForm: React.FC = () => {
  const [cardId, setCardId] = useState('');
  const [updateAmount, setUpdateAmount] = useState('');
  const [isAddition, setIsAddition] = useState(true); // Default to addition

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:0905/cards/${cardId}`, {
        method: 'PATCH',  // Change the method to PATCH
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

      // Optionally, you can fetch and display the updated data
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  return (
    <div className = "bg-white">
      <label>
        Card ID:
        <input type="text" value={cardId} onChange={(e) => setCardId(e.target.value)} />
      </label>
      <br />
      <label>
        Update Amount:
        <input type="text" value={updateAmount} onChange={(e) => setUpdateAmount(e.target.value)} />
      </label>
      <br />
      <label>
        Check for Loading of Balance: 
        <input type="checkbox" checked={isAddition} onChange={() => setIsAddition(!isAddition)} />
      </label>
      <br />
      <button onClick={handleUpdate}>Update Card</button>
    </div>
  );
};

export default CardUpdateForm;