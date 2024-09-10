import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, DrawingManager } from '@react-google-maps/api';

// Define the libraries outside of the component to avoid unnecessary re-rendering
const libraries = ['drawing'];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/dashboard', { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
        navigate('/');
      }
    };
    fetchUser();
  }, [navigate]);

  const onLoad = () => {
    setMapLoaded(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const containerStyle = {
    width: '75vw',
    height: '75vh',
    margin: 'auto',
  };

  const center = {
    lat: 28.632995,
    lng: -106.069100,
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="flex justify-center items-center w-full">
        {/* Load the script asynchronously */}
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={libraries}
          onLoad={onLoad}
          async
        >
          {mapLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
            >
              <DrawingManager
                onPolylineComplete={(polyline) => {
                  console.log('Polyline complete', polyline);
                }}
                onPolygonComplete={(polygon) => {
                  console.log('Polygon complete', polygon);
                }}
                options={{
                  drawingControl: true,
                  drawingControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['marker', 'polygon', 'polyline', 'rectangle', 'circle'],
                  },
                }}
              />
            </GoogleMap>
          )}
        </LoadScript>
      </div>

      <div className="w-96 p-6 shadow-lg bg-blue-800 rounded-md mt-8">
        <h1 className="text-3xl block text-center font-semibold">
          Welcome to the Dashboard, {user.username}!
        </h1>
        <p className="text-center mt-4">Hi</p>
      </div>
    </div>
  );
}

export default Dashboard;
