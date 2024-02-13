import React, { useState } from 'react';
import Navigation from './../../components/navigation';
import { createSolutionBuilder } from 'typescript';

interface props {
    setName: any;
    setLastName: any; 
    setFirstName: any; 
    clickEvent: () => void;
    changeLastNameHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    changeNameHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
 
const HomeForm: React.FC<props> = () => {{
    
}
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const clickEvent = () => {
      console.log("Clicked");
      setName(firstName + " " + lastName);
    }

    const clickEventDelete = () => {
      console.log("Clicked");
      setName(" ");
      setFirstName(" "); 
      setLastName(" ");
    }

    const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFirstName(e.target.value);
    }

    const changeLastNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
      }


    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                {name}
            </h1>
            <input
              onChange={changeNameHandler}
              placeholder='First Name'
            />
            <input
              onChange={changeLastNameHandler}
              placeholder='Last Name'
            />
            <button onClick={clickEvent}>
              Submit
            </button>
            <button onClick={clickEventDelete}>
              Delete
            </button>

            <h1>Bottom of Page</h1>
        </div>
    )
}
 
export default HomeForm;