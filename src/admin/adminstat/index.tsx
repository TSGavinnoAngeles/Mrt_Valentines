import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  updateEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import AdminNavigation from "../../components/adminnav";
import MapComponent from "../../components/mapcomp";
import MapComponent2 from "../../components/mapcompmove";

import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

const statNodes: Node[] = [];

const initialEdges: Edge[] = [];

interface Coordinates {
  label: string;
  lat: number;
  lng: number;
  connecting: string[];
  _id: string;
}

const fetchDataFromDatabase = async () => {
  const response = await fetch("http://localhost:0905/stations");
  const data = await response.json();
  return data;
};

const BasicFlow = () => {
  //node and edge rendering
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [stationNodes, setStationNodes, onStationNodesChange] =
    useNodesState(statNodes);

  //setting of variables from mongodb
  const [coordinates, setCoordinates] = useState<number[]>([]);
  const [stationId, setStatId] = useState("");
  const [label, setStatLabel] = useState("");
  const [active, setIsActive] = useState(true);
  const [position, setPostitions] = useState<number[]>([0, 0]);

  //connection management
  const [connId, setConnId] = useState("");
  const [con, setCon] = useState<String[]>([]);
  const [connName, setConnName] = useState("");

  //deletion management
  const [delCon, setDelCon] = useState<String[]>([]);
  const [delConName, setDelConName] = useState("");
  const [delConId, setdelConId] = useState("");

  // interaction management
  const [open, setOpen] = useState<boolean>(false);
  const [single, setSingle] = useState(false);
  const [subSingle, setSubSingle] = useState(false);
  const [double, setDouble] = useState(false);

  //Map or Connection toggler
  const [isClicked, setIsClicked] = useState(false);

  //Map management
  const [coords, setCoords] = useState<Coordinates[]>([]);
  const [latClicked, setLatClicked] = useState<number>(0);
  const [lngClicked, setLngClicked] = useState<number>(0);

  //update map management hooks
  const [upcoords, setupCoords] = useState<number[]>([]);
  const [latMoved, setLatMoved] = useState<number>(0);
  const [lngMoved, setLngMoved] = useState<number>(0);
  const [willu, setwillu] = useState(false);

  //Operations Management
  const [base, setBase] = useState<number>();
  const [fare, setFare] = useState<number>();
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    getCoords();
  }, []);

  async function getCoords() {
    try {
      const response = await fetch(`http://localhost:0905/stations`);

      if (response.ok) {
        const data = await response.json();

        const parsedCoords: Coordinates[] = data.map(
          (station: {
            label: string;
            coordinates: number[];
            connecting: string[];
            _id: string;
          }) => ({
            label: station.label,
            lat: station.coordinates[0],
            lng: station.coordinates[1],
            connecting: station.connecting,
            _id: station._id,
          })
        );

        setCoords(parsedCoords);
      } else {
        const errorData = await response.json();
        console.error(errorData); // Handle errors from the server
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
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
          setEdges((prevConnections) => [
            ...prevConnections,
            ...formattedConnections,
          ]);
        });
      } catch (error) {
        console.error("Error fetching data from the database:", error);
      }
    };

    fetchNodes();
  }, []);

  useEffect(() => {
    const getOpDetail = async () => {
      try {
        const response = await fetch("http://localhost:0905/operation");
        if (response.ok) {
          const data = await response.json();
          data.map((s: any) => {
            setBase(s.baseFare);
            setFare(s.perKm);
          });
        } else {
          const errorData = await response.json();
          console.error(errorData); // Handle errors from the server
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    getOpDetail();
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
      const response = await fetch(
        `http://localhost:0905/stations/connections/${connId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ connecting: con }),
        }
      );

      if (!response.ok) {
        console.error(`Failed to update station. Status: ${response.status}`);
      } else {
        window.alert(`Station connection from ${connId} to stations ${con}`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating station:", error);
    }
  };

  const updateStationConnsMini = async () => {
    try {
      const response = await fetch(
        `http://localhost:0905/stations/connections/${connId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ connecting: con }),
        }
      );

      if (!response.ok) {
        console.error(`Failed to update station. Status: ${response.status}`);
      } else {
        window.alert(`Station connected `);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating station:", error);
    }
  };

  const updateStationCoords = async () => {
    try {
      const response = await fetch(
        `http://localhost:0905/stations/coordinates/${connId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ coordinates: upcoords }),
        }
      );

      if (!response.ok) {
        console.error(`Failed to update station. Status: ${response.status}`);
      } else {
        window.alert(`Station connection from ${connId} to stations ${con}`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating station:", error);
    }
  };

  const handleAddStation = async (): Promise<void> => {
    try {
      if (coordinates.length !== 2 || !stationId || !label || active === null) {
        window.alert("Please fill in all the fields with valid numbers");
        return;
      }
      const response = await fetch("http://localhost:0905/addStat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates,
          stationId,
          label,
          position,
          active,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newNode = {
          id: label,
          data: { label: label },
          position: { x: 0, y: 0 },
        };
        setStationNodes((prevNodes) => [...prevNodes, newNode]);
        console.log("Station added successfully:", data);
        window.alert(`Station Created: ${label}`);
        window.location.reload();
        // navigate('/admin-dashboard/UUID-Editor');
      } else {
        const errorData = await response.json();
        console.error("Error adding card:", errorData);
        // Handle errors from the server.
        window.alert("Server Not Connected");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle network errors or other issues.
      window.alert("Server Not Connected");
    }
  };

  const deleteStation = async (_id: string) => {
    try {
      const response = await fetch(`http://localhost:0905/delStation/${_id}`, {
        method: "DELETE", // Specify the HTTP method as DELETE
      });

      if (response.ok) {
        // Successfully deleted
        const data = await response.json();
        console.log("Station deleted successfully:", data);

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
  };

  const savePosition = async (_id: string, xny: number[]) => {
    try {
      const response = await fetch(
        `http://localhost:0905/stations/position/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ position: xny }),
        }
      );
      if (!response.ok) {
        console.error(`Failed to update station. Status: ${response.status}`);
      } else {
        console.log(`Station positions updated`);
      }
    } catch (error) {
      console.error("Error updating station:", error);
    }
  };

  const updateOpsData = async () => {
    try {
      const response = await fetch(
        `http://localhost:0905/operation/65ca7c3a80dc6dceeb1b8f67`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ baseFare: base, perKm: fare }),
        }
      );

      if (!response.ok) {
        console.error(`Failed to update Operation Details`);
      } else {
        window.alert(`Base fare and Fare update to ${base} and ${fare}`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating station:", error);
    }
  };

  // React flow functions
  function onButtonPress() {
    handleAddStation();
  }

  const handleNodeClick = (event: any, node: any) => {
    setConnId(node.id);
    setConnName(node.data.label);

    console.log(connId, con);
    setStationNodes((prevNodes) =>
      prevNodes.map((prevNode) => ({
        ...prevNode,
        style: {
          background: prevNode.id === node.id ? "grey" : "white",
          border:
            prevNode.id === node.id ? "2px solid black" : "2px solid gray",
        },
      }))
    );

    setSingle(true);
    setDouble(false);
    setSubSingle(false);
  };

  const handleNodeClick2 = (event: any, node: any) => {
    setConnId(node.id);
    setConnName(node.data.label);

    console.log(connId, con);
    setStationNodes((prevNodes) =>
      prevNodes.map((prevNode) => ({
        ...prevNode,
        style: {
          background: prevNode.id === node.id ? "grey" : "white",
          border:
            prevNode.id === node.id ? "2px solid black" : "2px solid gray",
        },
      }))
    );
    setSubSingle(true);
  };

  const handleNodeDoubleClick = (event: any, node: any) => {
    setdelConId(node.id);
    setDelConName(node.data.label);

    setStationNodes((prevNodes) =>
      prevNodes.map((prevNode) => ({
        ...prevNode,
        style: {
          background: prevNode.id === node.id ? "red" : "white",
          border:
            prevNode.id === node.id ? "2px solid black" : "2px solid gray",
        },
      }))
    );

    const nodeDelConn = edges
      .filter((edge) => edge.source === connId || edge.target === connId)
      .map((edge) => ({ source: edge.source }))
      .filter((conSource) => conSource.source !== connId);
    setDelCon(nodeDelConn.map((conSource) => conSource.source));

    console.log("sources", delCon);
    console.log("delete id", delConId);
    console.log("deleting", delConName);

    setDouble(true);
    setSingle(false);
    setSubSingle(false);
  };

  const handleNodeDelete = async () => {
    console.log(delConId);

    if (double === true && single === false) {
      if (delCon.length > 0) {
        await Promise.all(delCon.map((d: any) => deleteConStats(d)));
      } else {
        deleteStation(delConId);
      }
    } else if (double === false && single === true) {
      window.alert("Double Click on the Node to delete succesfully");
      window.location.reload();
    } else if (double === false && single === true) {
      window.alert(
        "Double Click on the Node to delete succesfully or Click on a Node to edit the connections"
      );
      window.location.reload();
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
    console.log(delConId);

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

      const response = await fetch(
        `http://localhost:0905/stations/connections/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ connecting: targets }),
        }
      );

      if (!response.ok) {
        console.error(`Failed to update station. Status: ${response.status}`);
      } else {
        console.log(
          `Station connection from ${id} to stations ${targets} updated successfully`
        );
      }
    } catch (error) {
      console.error("Error updating station:", error);
    }
  };

  const showState = () => {
    if (single === true && double === false && subSingle === false) {
      return `Save edits to ${connName}`;
    } else if (single === false && double === true && subSingle === false) {
      return `Save Your Workspace`;
    } else if (single === false && double === false && subSingle === true) {
      return `Save edits to ${connName}`;
    } else {
      return `No actions are being done at the moment`;
    }
  };

  const buttonHandler = () => {
    if (single === true && double === false && subSingle === false) {
      updateStationConns();
      if (willu) {
        updateStationCoords();
      }
      const xny = stationNodes.map(({ id, position }) => ({
        id,
        position: [position.x, position.y],
      }));

      xny.forEach(({ id, position }) => {
        savePosition(id, position);
      });
      window.location.reload();
    } else if (single === false && double === true && subSingle === false) {
      window.alert("Becareful of accidental Deletions");
      const xny = stationNodes.map(({ id, position }) => ({
        id,
        position: [position.x, position.y],
      }));

      xny.forEach(({ id, position }) => {
        savePosition(id, position);
      });
      window.location.reload();
    } else if (single === false && double === false && subSingle === true) {
      updateStationConnsMini();
      const xny = stationNodes.map(({ id, position }) => ({
        id,
        position: [position.x, position.y],
      }));
    } else if (single === false && double === false && subSingle === false) {
      window.alert("Nothing Really to do for now. Proceed with your editing");
      const xny = stationNodes.map(({ id, position }) => ({
        id,
        position: [position.x, position.y],
      }));
      xny.forEach(({ id, position }) => {
        savePosition(id, position);
      });
      window.location.reload();
    }
  };

  const creationHandler = () => {
    if (open === true) {
      return `Cancel Station Creation `;
    } else {
      return `Create a New Station`;
    }
  };

  const baseFareButtonHandler = () => {
    updateOpsData();
    window.location.reload();
  };

  useEffect(() => {
    setCoordinates([latClicked, lngClicked]);
  }, [latClicked, lngClicked]);

  useEffect(() => {
    setupCoords([latMoved, lngMoved]);
  }, [latMoved, lngMoved]);

  return (
    <div className="bg-trains">
      <AdminNavigation />
      <div className="m-1"> </div>
      <div className="flex mr-2 ">
        {isClicked === false ? (
          <div
            style={{ height: "625px", width: "49%" }}
            className="m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 relative z-0"
          >
            <MapContainer
              center={[14.6522, 121.0323]}
              zoom={13}
              dragging={true}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                maxZoom={16}
              />
              {coords.map((c, index) => (
                <Marker key={index} position={[c.lat, c.lng]}>
                  <Popup>{c.label}</Popup>
                </Marker>
              ))}
              {coords.map((station, index) =>
                station.connecting.map((c) => {
                  const connsStat = coords.find((s) => s._id === c);
                  if (connsStat) {
                    return (
                      <Polyline
                        key={`${index}-${connsStat._id}`}
                        positions={[
                          [station.lat, station.lng],
                          [connsStat.lat, connsStat.lng],
                        ]}
                        color="gray"
                      />
                    );
                  }
                  return null;
                })
              )}
            </MapContainer>
          </div>
        ) : (
          <div
            style={{ height: "625px", width: "49%" }}
            className="m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700"
          >
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

        <div className=" w-1/2 px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 ">
          {open === true ? (
            <>
              <div>
                <form className="w-full  z-10">
                  <div className="flex flex-wrap mb-2">
                    <div className="w-full  px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-first-name"
                      >
                        Station Name
                      </label>
                      <input
                        required
                        onChange={(e) => setStatLabel(e.target.value)}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-black-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="grid-first-name"
                        type="text"
                        placeholder="Jane"
                      />
                    </div>

                    <div className="w-full  px-3">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-last-name"
                      >
                        Station Id
                      </label>
                      <input
                        required
                        onChange={(e) => setStatId(e.target.value)}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-last-name"
                        type="text"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 ">
                    <input
                      id="bordered-checkbox-1"
                      type="checkbox"
                      value=""
                      name="bordered-checkbox"
                      className="w-4 h-4 text-blue-600 bg-white-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-white-700 dark:border-gray-600"
                      checked={active}
                      onChange={() => setIsActive(!active)}
                    />
                    <label
                      htmlFor="bordered-checkbox-1"
                      className="w-full py-4 ms-2 text-sm font-medium text-black-900 dark:text-black-300"
                    >
                      Active
                    </label>
                  </div>
                </form>
              </div>

              <div
                style={{ height: "100%", width: "100%" }}
                className="w-full px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 align-right max-h-80 overflow-y-auto my-2"
              >
                <MapContainer
                  center={[14.6522, 121.0323]}
                  zoom={13}
                  dragging={true}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={16}
                  />
                  {coords.map((c, index) => (
                    <Marker key={index} position={[c.lat, c.lng]}>
                      <Popup>{c.label}</Popup>
                    </Marker>
                  ))}
                  {coords.map((station, index) =>
                    station.connecting.map((c) => {
                      const connsStat = coords.find((s) => s._id === c);
                      if (connsStat) {
                        return (
                          <Polyline
                            key={`${index}-${connsStat._id}`}
                            positions={[
                              [station.lat, station.lng],
                              [connsStat.lat, connsStat.lng],
                            ]}
                            color="gray"
                          />
                        );
                      }
                      return null;
                    })
                  )}
                  <MapComponent
                    setLatClicked={setLatClicked}
                    setLngClicked={setLngClicked}
                  />
                  <Marker position={[latClicked, lngClicked]} />
                </MapContainer>
              </div>
              <button
                type="submit"
                className=" mt-1 z-10 bg-black hover:bg-slate-500 text-white font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded mx-auto flex flex-center"
                onClick={onButtonPress}
              >
                Create Station
              </button>
            </>
          ) : (
            <>
              <div className="text-xl">Details of Operation</div>
              <div className="mr-4">
                <div className="flex flex-nowrap">
                  <form className="w-1/4 px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 align-right m-2">
                    <div className=" m-2 flex flex-wrap -mx-3 mb-6 ">
                      <div className="w-full  px-3 mb-6 md:mb-0 ">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Set Fare / Km travelled
                        </label>
                        <input
                          // readOnly
                          onChange={(e) => {
                            setFare(Number(e.target.value));
                          }}
                          value={fare}
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-black-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="grid-first-name"
                          type="text"
                        />
                      </div>
                      <div className="w-full  px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-last-name"
                        >
                          Base Fare / Penalty Fees
                        </label>
                        <input
                          // readOnly
                          onChange={(e) => {
                            setBase(Number(e.target.value));
                          }}
                          value={base}
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="grid-last-name"
                          type="text"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full z-10 bg-black hover:bg-emerald-950 text-white font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded ftext-justify"
                      onClick={baseFareButtonHandler}
                    >
                      {" "}
                      Edit Fare
                    </button>
                  </form>

                  <form className="w-3/4 px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 align-right mt-2">
                    <div className=" m-2 flex flex-wrap -mx-3 mb-6">
                      <div className="w-full  px-3 mb-6 md:mb-0  overflow-y-auto">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Station UUID
                        </label>
                        <input
                          value={connId}
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-black-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="grid-first-name"
                          type="text"
                        />
                      </div>
                      <div className="w-full  px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-last-name"
                        >
                          Station Name
                        </label>
                        <input
                          value={connName}
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="grid-last-name"
                          type="text"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {single === true ? (
                <>
                  {coords.map((c) => {
                    if (c._id === connId) {
                      return (
                        <div
                          style={{ height: "280px", width: "100%" }}
                          className="w-full px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 align-right max-h-80 overflow-y-auto my-2"
                        >
                          <MapContainer
                            center={[c.lat, c.lng]}
                            zoom={13}
                            dragging={true}
                            scrollWheelZoom={true}
                            style={{ height: "100%", width: "100%" }}
                          >
                            <TileLayer
                              attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
                              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                              maxZoom={16}
                            />
                            {coords.map((cin, index) => (
                              <Marker key={index} position={[cin.lat, cin.lng]}>
                                <Popup>{c.label}</Popup>
                              </Marker>
                            ))}
                            {coords.map((station, index) =>
                              station.connecting.map((cin) => {
                                const connsStat = coords.find(
                                  (s) => s._id === cin
                                );
                                if (connsStat) {
                                  return (
                                    <Polyline
                                      key={`${index}-${connsStat._id}`}
                                      positions={[
                                        [station.lat, station.lng],
                                        [connsStat.lat, connsStat.lng],
                                      ]}
                                      color="gray"
                                    />
                                  );
                                }
                                return null;
                              })
                            )}
                            {willu === true ? (
                              <>
                                <MapComponent2
                                  setLatMoved={setLatMoved}
                                  setLngMoved={setLngMoved}
                                />
                                <Marker position={[latMoved, lngMoved]} />
                              </>
                            ) : (
                              <></>
                            )}
                          </MapContainer>
                        </div>
                      );
                    }
                  })}
                </>
              ) : (
                <>
                  {isClicked === true ? (
                    <>
                      <div
                        style={{ height: "280px", width: "100%" }}
                        className="w-full px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 align-right max-h-80 overflow-y-auto my-2"
                      >
                        <div className="text-xl text-justify">
                          {[
                            "Click on a node to edit the location of the station.",
                            "Gray: Currently Editing station",
                            "Red: Flagged Station for Deletion",
                            "Afterwards, Save your edits in the rightmost button below.",
                            "The left toggle will handle the map/connections screen while the right toggle will let you update the coordinates if toggled on.",
                          ].map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{ height: "280px", width: "100%" }}
                        className="w-full px-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 align-right max-h-80 overflow-y-auto my-2"
                      >
                        <ReactFlow
                          nodes={stationNodes}
                          edges={edges}
                          onNodesChange={onStationNodesChange}
                          onEdgesChange={onEdgesChange}
                          onConnect={onConnect}
                          onNodeClick={handleNodeClick2}
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
                    </>
                  )}
                </>
              )}
            </>
          )}

          <div className="fixed bottom-0 left-0 right-0 mb-1 mx-4 flex justify-right z-10">
            {" "}
            <div>
              <label className="relative inline-flex items-center me-5 cursor-pointer algin-right">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={isClicked}
                  onChange={() => setIsClicked(!isClicked)}
                />
                <div className=" w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-black dark:peer-focus:ring-black dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
              </label>
              {isClicked === true ? (
                <>
                  <label className="relative inline-flex items-center me-5 cursor-pointer algin-left">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={willu}
                      onChange={() => setwillu(!willu)}
                    />
                    <div className=" w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-black dark:peer-focus:ring-black dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                  </label>
                </>
              ) : (
                <></>
              )}
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="z-10 bg-black hover:bg-green-500 text-white font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded me-4"
            >
              {creationHandler()}
            </button>
            <button
              type="submit"
              className="z-10 bg-black hover:bg-red-500 text-white font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded"
              onClick={buttonHandler}
            >
              {" "}
              {showState()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicFlow;
