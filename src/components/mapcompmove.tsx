import React from "react";
import { useMapEvents } from "react-leaflet";

interface MapComponentProps {
  setLatMoved: (lat: number) => void;
  setLngMoved: (lng: number) => void;
}

const MapComponent2: React.FC<MapComponentProps> = ({
  setLatMoved,
  setLngMoved,
}) => {
  const map = useMapEvents({
    click: (e) => {
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
      setLatMoved(e.latlng.lat);
      setLngMoved(e.latlng.lng);
    },
  });
  return null;
};

export default MapComponent2;
