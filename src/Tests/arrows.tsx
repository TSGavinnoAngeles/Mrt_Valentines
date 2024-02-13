import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, { Node,addEdge, Background,Edge,Connection,useNodesState,useEdgesState,MiniMap,Controls,updateEdge,NodeChange} from "reactflow";
import 'reactflow/dist/style.css';
import { useNavigate} from 'react-router-dom';
import Modal from '../components/modal'
import AdminNavigation from "../components/adminnav";
import Navigation from "../components/navigation"

import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import { LatLng } from "leaflet";
import { connect } from "http2";

const statNodes: Node[] = [];

const initialEdges: Edge[] = [];

interface Coordinates {
  label: string;
  lat: number;
  lng: number;
  connecting: string[];
  _id: string
}


const fetchDataFromDatabase = async () => {
  const response = await fetch('http://localhost:0905/stations');
  const data = await response.json();
  return data;
};

const BasicFlow = () => {
  const navigate = useNavigate();

  //node and edge rendering 
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [stationNodes, setStationNodes, onStationNodesChange] = useNodesState(statNodes);

  //setting of variables from mongodb
  const [coordinates, setCoordinates] = useState<number[]>([]); 
  const [stationId, setStatId] = useState(""); 
  const [label, setStatLabel] = useState(""); 
  const [active, setIsActive] = useState(true);
  const [position, setPostitions] = useState<number[]>([0,0]); 

  //connection management
  const [connId, setConnId] = useState("")
  const [con, setCon] = useState<String[]>([]); 
  const [connName, setConnName] = useState("")

  //deletion management
  const [delCon, setDelCon] = useState<String[]>([]); 
  const [delConName, setDelConName] = useState("")
  const [delConId, setdelConId] = useState("")

  // modal management
  const [open, setOpen] = useState<boolean>(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false)

  //Node Interaction 
  const [single, setSingle] = useState(false);
  const [double, setDouble] = useState(false);

  //Map or Connection toggler
  const [isClicked, setIsClicked] = useState(false);

  //Map management
  const [coords, setCoords] = useState<Coordinates[]>([]);

  useEffect(() => {
    getCoords();
  }, []);

  async function getCoords() {
    try {
      const response = await fetch(`http://localhost:0905/stations`);

      if (response.ok) {
        const data = await response.json();

        const parsedCoords: Coordinates[] = data.map((station: {label: string, coordinates: number[], connecting: string[],_id: string }) => ({
          label: station.label,
          lat: station.coordinates[0],
          lng: station.coordinates[1],
          connecting: station.connecting,
          _id: station._id
        }));

        setCoords(parsedCoords);
      } else {
        const errorData = await response.json();
        console.error(errorData); // Handle errors from the server
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const data = await fetchDataFromDatabase();
        const station = data.map((node: any) => ({
          id: String(node._id),
          data: { label: node.label },
          position: { x: node.position[0], y: node.position[1] },
        }));
        setStationNodes(station);


        data.forEach((connection: any) => {
          const sourceId = connection._id; 
          const targetsArray = connection.connecting; 
  
          const formattedConnections = targetsArray
          .filter((target: any) => target !== sourceId) 
          .map((target: any) => ({
            id: `${sourceId}-${target}`,
            source: sourceId,
            target: target,
          }));

          // console.log(formattedConnections)
          setEdges((prevConnections) => [...prevConnections, ...formattedConnections]);

          
        });

      
      } catch (error) {
        console.error('Error fetching data from the database:', error);
      }
    };

    fetchNodes();
  }, []);

  useEffect(() => {
    const nodeConn = edges
      .filter((edge) => edge.source === connId || edge.target === connId)
      .map((edge) => ({ target: edge.target }))
      .filter((conTarget) => conTarget.target !== connId);
  
    setCon(nodeConn.map((conTarget) => conTarget.target));
  }, [edges, connId]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]

  );

  const updateStationConns = async () => {
    try {
      const response = await fetch(`http://localhost:0905/stations/connections/${connId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connecting: con }),
      });
  
      if (!response.ok) {
        console.error(`Failed to update station. Status: ${response.status}`);
      } else {
        window.alert(`Station connection from ${connId} to stations ${con}`);
      }
    } catch (error) {
      console.error('Error updating station:', error);
    }
  };

  const handleAddStation = async (): Promise<void> => {
    try {

      if (coordinates.length !== 2 || !stationId|| !label || active === null ) {
        window.alert('Please fill in all the fields with valid numbers');
        return;
      }
      const response = await fetch('http://localhost:0905/addStat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates, stationId, label, position, active}),

      });

      if (response.ok) {
        const data = await response.json();
        const newNode = {
          id: label,
          data: { label: label},
          position: { x: 0, y: 0 }, 
        };
       setStationNodes((prevNodes) => [...prevNodes, newNode]);
        console.log('Station added successfully:', data);
        window.alert(`Station Created: ${label}`);
        window.location.reload()
        // navigate('/admin-dashboard/UUID-Editor');
        
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

  const deleteStation = async (_id: string) => {
    try {
      const response = await fetch(`http://localhost:0905/delStation/${_id}`, {
        method: 'DELETE', // Specify the HTTP method as DELETE
      });
  
      if (response.ok) {
        // Successfully deleted
        const data = await response.json();
        console.log('Station deleted successfully:', data);
  
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

  const savePosition = async (_id: string, xny: number[]) => {
    try {
      const response = await fetch(`http://localhost:0905/stations/position/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position: xny }),
      });
      if (!response.ok) {
        console.error(`Failed to update station. Status: ${response.status}`);
      } else {
        console.log(`Station positions updated`);
      }
    } catch (error) {
      console.error('Error updating station:', error);
    }
  };
  
// React flow functions
  function onButtonPress() { 
    handleAddStation()
  }

  const handleNodeClick = (event: any, node: any) => {
    setConnId(node.id);
    setConnName(node.data.label)
  
    console.log(connId, con);
    setStationNodes((prevNodes) =>
    prevNodes.map((prevNode) => ({
      ...prevNode,
      style: {
        background: prevNode.id === node.id ? 'grey' : 'white',
        border: prevNode.id === node.id ? '2px solid black' : '2px solid gray',
      },
    }))
  );

  setSingle(true)
  setDouble(false)
  };

const handleNodeDoubleClick = (event: any, node: any) => {
  setdelConId(node.id)
  setDelConName(node.data.label)

  setStationNodes((prevNodes) =>
  prevNodes.map((prevNode) => ({
    ...prevNode,
    style: {
      background: prevNode.id === node.id ? 'red' : 'white',
      border: prevNode.id === node.id ? '2px solid black' : '2px solid gray',
    },
  }))
  );

  const nodeDelConn = edges
  .filter((edge) => edge.source === connId || edge.target === connId)
  .map((edge) => ({ source: edge.source }))
  .filter((conSource) => conSource.source !== connId);
  setDelCon(nodeDelConn.map((conSource) => conSource.source));

  console.log("sources", delCon)
  console.log ("delete id", delConId)
  console.log("deleting", delConName)

  setDouble(true)
  setSingle(false)
  };
  
  const handleNodeDelete = async () => {
    console.log(delConId);
    // Uncomment the line below if needed
    if(double === true && single === false){ 
      if(delCon.length > 0){ 
        await Promise.all(delCon.map((d: any) => 
        deleteConStats(d)
        ));
      } else { 
        deleteStation(delConId)
      }
    } else if( double === false && single === true) { 
      window.alert("Double Click on the Node to delete succesfully")
      window.location.reload()
    } else if( double === false && single === true) { 
      window.alert("Double Click on the Node to delete succesfully or Click on a Node to edit the connections")
      window.location.reload()
    }
  };

  const deleteConStats = async (id: string) => {
    console.log("----------------------------------------");
    console.log("In connection deletion function for: ", id);
    console.log("showing stations connected to: ", id);
  
    const nodeConn = edges
      .filter((edge) => edge.source === id || edge.target === id)
      .map((edge) => ({ target: edge.target }))
      .filter((conTarget) => conTarget.target !== id);
  
    console.log("Filtered connections to be deleted: ", nodeConn);
  
    deleteStation(delConId);
    console.log(delConId)
  
    const newConn = edges
    .filter((edge) => edge.source === id || edge.target === id)
    .map((edge) => ({ target: edge.target }))
    .filter((conTarget) => conTarget.target !== delConId);

    console.log("reset connections of: ", id, "wITH", newConn);
    console.log(newConn);
    update2(id, newConn);
  };
  
  const update2 = async (id: string, nodeConn: { target: string }[]) => {
    try {
      const targets: string[] = nodeConn
      .filter((edge) => edge.target !== id)
      .map((edge) => edge.target);
  
      const response = await fetch(`http://localhost:0905/stations/connections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connecting: targets }),
      });
  
      if (!response.ok) {
        console.error(`Failed to update station. Status: ${response.status}`);
      } else {
        console.log(`Station connection from ${id} to stations ${targets} updated successfully`);
      }
    } catch (error) {
      console.error('Error updating station:', error);
    }
  };
  
const showState = () => { 
  if(single === true && double === false){ 
    return `Save edits to ${connName}`
  }else if(single === false && double === true) { 
    return `Save Your Workspace`
  } else { 
    return `No actions are being done at the moment`
  }

  }

const buttonHandler = () => {
  if(single === true && double === false){ 
      updateStationConns()
      const xny = stationNodes
      .map(({ id, position }) => ({ id, position: [position.x, position.y] }));
    
      xny.forEach(({ id, position }) => {
       savePosition(id, position)
      }); 
      window.location.reload()
}else if(single === false && double === true) { 
    window.alert("Becareful of accidental Deletions")
    const xny = stationNodes
    .map(({ id, position }) => ({ id, position: [position.x, position.y] }));
  
    xny.forEach(({ id, position }) => {
     savePosition(id, position)
    }); 
    window.location.reload()
}else if(single === false && double === false)  { 
    window.alert("Nothing Really to do for now. Proceed with your editing")
    const xny = stationNodes
    .map(({ id, position }) => ({ id, position: [position.x, position.y] }));
  
    xny.forEach(({ id, position }) => {
     savePosition(id, position)
    }); 
    window.location.reload()
  }
  }




  return (    
<div> 
  <AdminNavigation />
  <div className = "m-3"> </div>
  <div className= "flex mb-4">
    {isClicked === false ? (
             <div  style={{ height: '625px', width: '49%' }} className="m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 relative z-0">
                <MapContainer center={[14.6522, 121.0323]} zoom={13} dragging= {true} scrollWheelZoom={true} style={{height:'100%', width: '100%'}}>
                <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={16}
                  />
                        {coords.map((c, index) => (
                        <Marker key={index} position={[c.lat, c.lng]} draggable={true}>
                          <Popup>{c.label}</Popup>
                        </Marker>
                      ))}
                      {coords.map((station, index) => (
                        station.connecting.map((c) => {
                          const connsStat = coords.find((s) => s._id === c);
                          if (connsStat) {
                            return (
                              <Polyline
                                key={`${index}-${connsStat._id}`}
                                positions={[[station.lat, station.lng], [connsStat.lat, connsStat.lng]]}
                                color="gray"
                              />
                            );
                          }
                          return null;
                        })
                      ))}
         
                </MapContainer>
            </div>
    ) : (
          <div  style={{ height: '625px', width: '49%' }} className="m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700">
          <ReactFlow
              nodes={stationNodes}
              edges={edges}
              onNodesChange={onStationNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onEdgeUpdate={onEdgeUpdate}
              onNodeDoubleClick={handleNodeDoubleClick}
              onNodesDelete={handleNodeDelete}
              fitView
          >
              {/* <MiniMap nodeStrokeWidth={2} /> */}
              <Controls />
              <Background />

          </ReactFlow>
          </div>
    )}

        <div className = " m-2 w-1/2 px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 ml-0"> 
                        <form className="w-1/2 px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 align-right mt-2">
                          <div className=" m-2 flex flex-wrap -mx-3 mb-6 ">
                              <div className="w-full  px-3 mb-6 md:mb-0 ">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                  Station Identifier
                                </label>
                                <input 
                                readOnly
                                value={connId}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-black-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                              </div>
                              <div className="w-full  px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                Station Name
                                </label>
                                <input 
                                readOnly
                                value = {connName}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" />
                              </div>
                          </div>
                        </form>
                          <div className = "w-full px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 align-right max-h-80 overflow-y-auto">
                            <div className="relative shadow-md sm:rounded-lg alig ">
                              <table className="w-full text-sm text-left rtl:text-right text-black-500 dark:text-black-400">
                                <thead className="w-full text-xs text-zinc-50 uppercase bg-gray-500 dark:bg-zinc-950 dark:text-black-400">
                                  <tr>
                                    <th scope="col" className="px-6 py-3">
                                      Station Name
                                      </th>
                                      <th scope="col" className="px-6 py-3">
                                      </th>
                                      <th scope="col" className="px-6 py-3">
                                      
                                      </th>
                                      <th scope="col" className="px-6 py-3">
                                      <span className="sr-only">Edit</span>
                                      </th>
                                  </tr>
                                  </thead>
                                <tbody>
                                  {stationNodes.map((s) => (
                                    <tr 
                                    // onClick = {(e) => {setWidgets(card.idNums)}}
                                     key={s.id}className="bg-white border-b dark:bg-white-800 dark:border-gray-700 hover:bg-indigo-300 dark:hover:bg-white-600 text-2xl ">
                                    <th scope="row" className="px-6 py-4 font-medium text-black-900 whitespace-nowrap dark:text-black" >{s.data.label}</th>
                                    <td className="px-6 py-4">{s.id}</td>
                                    <td className="px-6 py-4">{s.sourcePosition}</td>
                                  </tr>
                                  ))}
                                </tbody>
                              </table>
                          </div>
                          </div>


                        <div className="fixed bottom-0 left-0 right-0 mb-1 mx-4 flex justify-right z-10">
   <div> 
                      <label className="relative inline-flex items-center me-5 cursor-pointer algin-right">
                          <input type="checkbox" value="" className="sr-only peer" 
                              checked={isClicked}
                             onChange={() => setIsClicked(!isClicked)}/>
                          <div className=" w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-black dark:peer-focus:ring-black dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black" ></div>
                          <span className ="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                        </label> 
           
   </div>
                        <button onClick ={()=>setOpen(true)} className="z-10 bg-black hover:bg-green-500 text-white font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded me-4">
                                      Create a New Station
                        </button>
                          <Modal isOpen={open} onClose={closeModal}> 
                                  <div>
                                    <form className="w-full max-w-lg z-10">
                                      <div className="flex flex-wrap -mx-3 mb-6">
                                          <div className="w-full  px-3 mb-6 md:mb-0">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                              Station Name
                                            </label>
                                            <input 
                                            required
                                            onChange={(e) => setStatLabel(e.target.value)}
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-black-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                                          </div>

                                          <div className="w-full  px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                            Station Id
                                            </label>
                                            <input 
                                            required
                                            onChange={(e) => setStatId(e.target.value)}
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" />
                                          </div>
                                        </div>

                                        <div className=" -mx-3 mb-2">
                                          <div  style={{ height: '625px', width: '49%' }} className="m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 relative z-0">
                                            <MapContainer center={[14.6522, 121.0323]} zoom={13} dragging= {true} scrollWheelZoom={true} style={{height:'100%', width: '100%'}}>
                                            <TileLayer
                                                attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                                                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                                                maxZoom={16}
                                              />
                                                    {coords.map((c, index) => (
                                                    <Marker key={index} position={[c.lat, c.lng]} draggable={true}>
                                                      <Popup>{c.label}</Popup>
                                                    </Marker>
                                                  ))}
                                                  {coords.map((station, index) => (
                                                    station.connecting.map((c) => {
                                                      const connsStat = coords.find((s) => s._id === c);
                                                      if (connsStat) {
                                                        return (
                                                          <Polyline
                                                            key={`${index}-${connsStat._id}`}
                                                            positions={[[station.lat, station.lng], [connsStat.lat, connsStat.lng]]}
                                                            color="gray"
                                                          />
                                                        );
                                                      }
                                                      return null;
                                                    })
                                                  ))}
                                    
                                            </MapContainer>
                                            
                                          </div>
                                      </div>
                                        <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                                          <input id="bordered-checkbox-1" type="checkbox" value="" name="bordered-checkbox" className="w-4 h-4 text-blue-600 bg-white-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-white-700 dark:border-gray-600" checked={active} onChange={() => setIsActive(!active)} />
                                          <label htmlFor="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-black-900 dark:text-black-300">Active</label>
                                        </div>
                                    </form>
                                  <div>
                                    <button
                                      type="submit"
                                      className="z-10 bg-black hover:bg-slate-500 text-white font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded mx-auto"
                                      onClick={
                                        onButtonPress
                                      }>
                                      Add Node
                                    </button>
                                  </div>
                            </div>
                          </Modal>
                        <button
                          type="submit"
                          className="z-10 bg-black hover:bg-red-500 text-white font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded"
                          onClick={ buttonHandler}> {showState()} 
                        </button> 
                        </div>
          </div>
          
  </div>
</div>

  );
};

export default BasicFlow;


