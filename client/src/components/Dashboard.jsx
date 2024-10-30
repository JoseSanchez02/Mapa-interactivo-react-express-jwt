import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import Sidebar from './SideBar';
import RightSideBar from './RightSideBar';
import { coordenadasPoligono1, coordenadasPoligono2, coordenadasPoligono3, coordenadasPoligono4, coordenadasPoligono5, coordenadasPoligono6} from '../data/poligonos.js';

const libraries = ['drawing'];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [draggedIcon, setDraggedIcon] = useState(null);
  const [mousePosition, setMousePosition] = useState(null);
  const [center] = useState({ lat: 28.675995, lng: -106.069100 });
  const [selectedCrime, setSelectedCrime] = useState(1);
  const [crimeStats, setCrimeStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndMarkers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/dashboard', { withCredentials: true });
        setUser(response.data.user);

        const markersResponse = await axios.get('http://localhost:3001/markers', { withCredentials: true });
        const formattedMarkers = markersResponse.data.map(marker => ({
          id: marker.id,
          position: {
            lat: parseFloat(marker.lat),
            lng: parseFloat(marker.lng)
          },
          iconType: marker.iconType,
        }));
        
        setMarkers(formattedMarkers);
      } catch (error) {
        console.error("Error al obtener datos del usuario o marcadores:", error);
        navigate('/');
      }
    };
    
    fetchUserAndMarkers();
    fetchCrimeStats();
  }, [navigate], [markers]);

  const fetchCrimeStats = async () => {
    try {
      const response = await axios.get('http://localhost:3001/crimenes/stats', { withCredentials: true });
      setCrimeStats(response.data);
    } catch (error) {
      console.error("Error al obtener estadísticas de crímenes:", error);
    }
  };

  const onLoad = () => {
    setMapLoaded(true); 
  };

  const getColorForCrimeCount = (count) => {
    if (count === undefined) return 'gray';
    if (count >= 0 && count <= 20) return 'green';
    if (count > 20 && count <= 40) return 'yellow';
    if (count > 40 && count <= 60) return 'orange';
    return 'red';
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  const containerStyle = {
    width: '75vw',
    height: user.rol === 'estadistico' ? '80vh' : '90vh', // Ajusta la altura según el rol
    margin: 'auto',
    borderRadius: user.rol === 'estadistico' ? '20px 20px 0 0' : '20px',
    overflow: 'hidden',
  };

  // Solo permitir estas funciones si el usuario es estadístico
  const handleMouseDown = (iconType) => {
    if (user.rol === 'estadistico') {
      setDraggedIcon(iconType);
      setDragging(true);
    }
  };

  const handleMouseMove = (event) => {
    if (dragging && user.rol === 'estadistico') {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const handleMapClick = async (event) => {

    if (!draggedIcon || user.rol !== 'estadistico') return;
  
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
  
      setMarkers([...markers, response.data]);
    } catch (error) {
      console.error('Error al guardar el marcador:', error);
    }
  
    setDraggedIcon(null);
    setDragging(false);
    setMousePosition(null);
  };

  const handleMarkerClick = async (id) => {
    if (user.rol !== 'estadistico') return;
    
    try {
      await axios.delete(`http://localhost:3001/markers/${id}`, { withCredentials: true });
      setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== id));
    } catch (error) {
      console.error('Error al eliminar el marcador:', error);
    }
  };

  const getIconUrl = (iconType) => {
    switch (iconType) {
      case 'police':
        return '/Police.png';
      case 'carro':
        return '/PoliceCar.png';
      case 'marcador':
        return '/marcador.png';
      case 'Blindado':
        return '/Blindado.png';
      case 'helicoptero':
        return '/helicoptero.png';
      case 'perro':
        return '/perro.png';
      default:
        return '/Police.png';
    }
  };

  const getPolygonOptions = (areaId) => {
    const areaStats = crimeStats[areaId];
    const crimeCount = areaStats && areaStats[selectedCrime] ? areaStats[selectedCrime].cantidad : undefined;
    return {
      fillColor: getColorForCrimeCount(crimeCount),
      fillOpacity: 0.5,
      strokeColor: 'black',
      strokeOpacity: 1,
      strokeWeight: 2,
      zIndex: 1,
      clickable: false,
    };
  };

  return (
    <div className="flex h-screen bg-sky-900 overflow-hidden" onMouseMove={handleMouseMove} onMouseUp={() => setDragging(false)}>
      <Sidebar />

      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col justify-center items-center" style={{ width: '75vw' }}>
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
            loading="async"
            onLoad={onLoad}>

            {mapLoaded && (
              <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={12}
                  onClick={handleMapClick}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    fullscreenControl: true,
                  }}
                >
                <Polygon paths={coordenadasPoligono1} options={getPolygonOptions('1')} />
                <Polygon paths={coordenadasPoligono2} options={getPolygonOptions('2')} />
                <Polygon paths={coordenadasPoligono3} options={getPolygonOptions('3')} />
                <Polygon paths={coordenadasPoligono4} options={getPolygonOptions('4')} />
                <Polygon paths={coordenadasPoligono5} options={getPolygonOptions('5')} />
                <Polygon paths={coordenadasPoligono6} options={getPolygonOptions('6')} />
                
                {markers.map((marker, index) => (
  <Marker
    key={`${marker.id}-${index}`}
    position={marker.position}
    icon={{
      url: getIconUrl(marker.iconType),
      scaledSize: new window.google.maps.Size(48, 48),
    }}
    zIndex={2}
    onDblClick={() => handleMarkerClick(marker.id)}
  />
))}

              </GoogleMap>
            )}
          </LoadScript>
        </div>

        {/* Footer con los iconos - solo visible para estadísticos */}
        {user.rol === 'estadistico' && (
          <footer className="flex justify-center items-center bg-sky-600 text-white p-3 rounded-b-2xl" style={{ width: '75vw' }}>
            {['police', 'carro', 'Blindado', 'helicoptero', 'perro', 'marcador'].map((iconType) => (
              <div
                key={iconType}
                className="flex flex-col items-center mx-4 p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 cursor-pointer transition duration-200 ease-in-out transform hover:scale-105"
                onMouseDown={() => handleMouseDown(iconType)}
              >
                <img src={getIconUrl(iconType)} alt={iconType} className="w-8 h-8" />
                <p className="mt-1">{iconType.charAt(0).toUpperCase() + iconType.slice(1)}</p>
              </div>
            ))}
          </footer>
        )}

        {/* Icono arrastrado - solo visible para estadísticos */}
        {dragging && mousePosition && user.rol === 'estadistico' && (
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
      <RightSideBar onCrimeTypeChange={setSelectedCrime} />
    </div>
  );
}

export default Dashboard;