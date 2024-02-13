import React, { useState } from 'react';
import Navigation from '../../components/navigation';
import HomeForm from './../home/homeform';
 
const Contact = () => {
  const [name, setName] = useState("John Doe");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const clickEvent = () => {
    console.log("Clicked");
    setName(firstName + " " + lastName);
  }

  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  }

  const changeLastNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLastName(e.target.value);
    }
  return (
      <div>
        <Navigation />
        <h1 className="text-3xl font-bold underline">
                Contact Page
            </h1>
          <HomeForm
          setName={setName}
          setLastName={setLastName}
          setFirstName={setFirstName}
          clickEvent={clickEvent}
          changeLastNameHandler={changeLastNameHandler}
          changeNameHandler={changeNameHandler}
          />
          <div>Footer</div>
      </div>
  )
}
 
export default Contact;