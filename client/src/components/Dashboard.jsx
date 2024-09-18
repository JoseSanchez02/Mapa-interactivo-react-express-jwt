import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, DrawingManager } from '@react-google-maps/api';
//import Sidebar from './SideBar';

const libraries = ['drawing'];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [draggedIcon, setDraggedIcon] = useState(null);
  const [mousePosition, setMousePosition] = useState(null);
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

  // Manejar el inicio del arrastre del ícono
  const handleMouseDown = (iconType) => {
    setDraggedIcon(iconType);
    setDragging(true);
  };

  // Manejar el movimiento del ratón
  const handleMouseMove = (event) => {
    if (dragging) {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  // Manejar el click en el mapa para soltar el ícono
  const handleMapClick = (event) => {
    if (!draggedIcon) return;

    const latLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setMarkers([...markers, { position: latLng, iconType: draggedIcon }]);
    setDraggedIcon(null); // Limpiar ícono arrastrado
    setDragging(false);
    setMousePosition(null);
  };

  // Obtener la URL de los íconos personalizados
  const getIconUrl = (iconType) => {
    switch (iconType) {
      case 'police':
        return '/Police.png'; // Imagen de policía
      case 'car':
        return '/PoliceCar.png'; // Imagen de coche de policía
      case 'marker':
        return '/marcador.webp'; // Imagen del marcador
      default:
        return '/Police.png'; // Imagen de policía por defecto
    }
  };

  // Manejar la eliminación de un marcador al hacer clic
  const handleMarkerClick = (index) => {
    // Filtrar los marcadores que no coinciden con el índice clickeado
    const updatedMarkers = markers.filter((_, i) => i !== index);
    setMarkers(updatedMarkers); // Actualizar los marcadores sin el marcador clickeado
  };

  return (
    <div className="flex h-screen" onMouseMove={handleMouseMove} onMouseUp={() => setDragging(false)}>


      <div className="flex flex-col items-center justify-center w-full">
        {/* Map Section */}
        <div className="flex justify-center items-center w-full">
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
                onClick={handleMapClick}
              >
                {markers.map((marker, index) => (
                  <Marker
                    key={index}
                    position={marker.position}
                    icon={{
                      url: getIconUrl(marker.iconType),
                      scaledSize: new window.google.maps.Size(32, 32),
                    }}
                    onClick={() => handleMarkerClick(index)} // Detectar click en el marcador para borrarlo
                  />
                ))}
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

        {/* Footer with Icons */}
        <footer className="flex justify-center items-center bg-blue-800 text-white p-4">
          <div
            className="flex flex-col items-center mx-4"
            onMouseDown={() => handleMouseDown('police')}
          >
            <img src="/Police.png" alt="Policía" className="w-8 h-8" />
            <p>Policía</p>
          </div>

          <div
            className="flex flex-col items-center mx-4"
            onMouseDown={() => handleMouseDown('car')}
          >
            <img src="/PoliceCar.png" alt="Auto" className="w-8 h-8" />
            <p>Carro</p>
          </div>

          <div
            className="flex flex-col items-center mx-4"
            onMouseDown={() => handleMouseDown('marker')}
          >
            <img src="/marcador.webp" alt="Marcador" className="w-8 h-8" />
            <p>Marcador</p>
          </div>
        </footer>

        {/* Mostrar el ícono arrastrado */}
        {dragging && mousePosition && (
          <div
            style={{
              position: 'fixed',
              top: mousePosition.y,
              left: mousePosition.x,
              pointerEvents: 'none',
            }}
          >
            <img
              src={getIconUrl(draggedIcon)}
              alt="Icono arrastrado"
              style={{ width: '32px', height: '32px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
