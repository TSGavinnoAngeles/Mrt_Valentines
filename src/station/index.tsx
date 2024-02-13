import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Navigation from './../components/navigation';
import HomeForm from './../screens/home/homeform';
import { stations } from '../stations/stations';
import { MRT as MRTStation } from '../interface/mrt';

 
const Home = () => {
// const {search} = useLocation()
// const searchParams = new URLSearchParams(search); 
// const stationId = searchParams.get("station_id"); 
// const method = searchParams.get('method'); 
//  console.log("method", search)

const [ station, setStation] = useState<MRTStation>();
const { stationId, methodId } = useParams();

let welcomeMessage = "Default";
if (methodId === "out") {
  welcomeMessage = "Thank you for using "
} else if (methodId === "in") {
  welcomeMessage = "Welcome to"
}



const retrieveData = async () => {
  //http://localhost:5001/stations/get/10
  const res = await fetch(`http://localhost:5001/stations/get/${stationId}`)
  .then((res)=> { 
    if (res.status == 400) {
      throw res;
    }
    return res.json();
  })
  .then((res)=> {
   setStation(res);
  }).catch(e=>console.log(e))

  console.log("re", res)
}

    useEffect(()=> {retrieveData();}, []);

    return (
      <div>
        <Navigation />
        <h1 className="text-3xl font-bold underline">
          {welcomeMessage}
          {station?.stationName}
        </h1>
      </div>
    )


}

export default Home;