import React, { useState } from 'react';
import Navigation from '../../components/navigation';
import HomeForm from './homeform';
 
const Home = () => {
    const [name, setName] = useState("Jerry Seinfeild");
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
                HomePage
            </h1>
            <HomeForm
            setName={setName}
            setLastName={setLastName}
            setFirstName={setFirstName}
            clickEvent={clickEvent}
            changeLastNameHandler={changeLastNameHandler}
            changeNameHandler={changeNameHandler}
            />
            <h1> Bottom of Page</h1>
        </div>
    );
}
 
export default Home;