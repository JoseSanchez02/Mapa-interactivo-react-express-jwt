import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Sidebar from './SideBar';

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
        const response = await axios.get('http://localhost:3001/dashboard', { withCredentials: true });
        setUser(response.data.user);

        // Cargar marcadores del backend
        const markersResponse = await axios.get('http://localhost:3001/markers', { withCredentials: true });
        const formattedMarkers = markersResponse.data.map(marker => ({
          id: marker.id,
          position: {
            lat: parseFloat(marker.lat), // Convertir a número
            lng: parseFloat(marker.lng)  // Convertir a número
          },
          iconType: marker.iconType,
        }));
        
        setMarkers(formattedMarkers);
        console.log("Datos de marcadores:", formattedMarkers); // Verifica los datos de los marcadores
        
      } catch (error) {
        console.error("Error al obtener datos del usuario o marcadores:", error);
        navigate('/');
      }
    };
    fetchUser();
  }, [navigate]);

  const onLoad = () => {
    setMapLoaded(true);
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  const containerStyle = {
    width: '75vw',
    height: '80vh',
    margin: 'auto',
    borderRadius: '20px 20px 0 0',  // Bordes superiores redondeados
    overflow: 'hidden',   // Ocultar contenido que se desborde
  };

  const center = {
    lat: 28.675995,
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
  const handleMapClick = async (event) => {
    if (!draggedIcon) return;

    const latLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    try {
      const response = await axios.post(
        'http://localhost:3001/markers',
        { lat: latLng.lat, lng: latLng.lng, iconType: draggedIcon },
        { withCredentials: true }
      );

      setMarkers([...markers, { id: response.data.id, position: latLng, iconType: draggedIcon }]);
    } catch (error) {
      console.error('Error al guardar el marcador:', error);
    }

    setDraggedIcon(null); // Limpiar ícono arrastrado
    setDragging(false);
    setMousePosition(null);
  };

  const getIconUrl = (iconType) => {
    switch (iconType) {
      case 'police':
        return '/Police.png'; 
      case 'carro':
        return '/PoliceCar.png'; 
      case 'marcador':
        return '/marcador.webp'; 
      case 'Blindado':
        return '/Blindado.png'; 
      case 'helicoptero':
        return '/helicoptero.png'; 
      case 'perro':
        return '/perro.webp'; 
      default:
        return '/Police.png'; 
    }
  };
  // Manejar la eliminación de un marcador al hacer clic
  const handleMarkerClick = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/markers/${id}`, { withCredentials: true });
      setMarkers(markers.filter((marker) => marker.id !== id));
    } catch (error) {
      console.error('Error al eliminar el marcador:', error);
    }
  };

  return (
    <div className="flex h-screen" onMouseMove={handleMouseMove} onMouseUp={() => setDragging(false)}>
      <Sidebar />
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col justify-center items-center" style={{ width: '75vw' }}>
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
            onLoad={onLoad}
          >
            {mapLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onClick={handleMapClick}
              >
                {markers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={marker.position}
                    icon={{
                      url: getIconUrl(marker.iconType),
                      scaledSize: new window.google.maps.Size(32, 32),
                    }}
                    onDblClick={() => handleMarkerClick(marker.id)} // Detectar doble click en el marcador para borrarlo
                  />
                ))}
              </GoogleMap>
            )}
          </LoadScript>
        </div>

        {/* Footer con los iconos */}
        <footer className="flex justify-center items-center bg-sky-600 text-white p-3 rounded-b-2xl" style={{ width: '75vw' }}>
          {['police', 'carro', 'Blindado', 'helicoptero', 'perro', 'marcador'].map((iconType) => (
            <div
              key={iconType}
              className="flex flex-col items-center mx-4"
              onMouseDown={() => handleMouseDown(iconType)}
            >
              <img src={getIconUrl(iconType)} alt={iconType} className="w-8 h-8" />
              <p>{iconType.charAt(0).toUpperCase() + iconType.slice(1)}</p>
            </div>
          ))}
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
