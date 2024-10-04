import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ViewStatsModal from './ViewStatsModal';
import EditStatsModal from './EditStatsModal';
import Sidebar from './SideBar';
import axios from 'axios';



const Estadisticas = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  const areas = [
    { id: 1, name: 'Área 1' },
    { id: 2, name: 'Área 2' },
    { id: 3, name: 'Área 3' },
    { id: 4, name: 'Área 4' },
    { id: 5, name: 'Área 5' },
    { id: 6, name: 'Área 6' },
  ];

  const openViewModal = (area) => {
    setSelectedArea(area);
    setViewModalOpen(true);
  };

  const openEditModal = (area) => {
    setSelectedArea(area);
    setEditModalOpen(true);
  };
  const navigate = useNavigate();
  useEffect(() => {
    const checkToken = async () => {
      try {
        // Hacemos una solicitud al backend para verificar el token
        const response = await axios.get('http://localhost:3001/dashboard', { withCredentials: true });
        // Si el token es válido, redirige al dashboard
        if (response.status === 200) {
          console.log('valid token');
        }
      } catch (error) {
        // Si hay algún error, el token no es válido o no existe
        navigate('/');
        
      }
    };
  
    checkToken();
  }, [navigate]);

  return (
    <div className="h-screen bg-blue-900 text-white">
      <div className="flex">
        {/* Sidebar a la izquierda */}
        <Sidebar />

        {/* Área principal de estadísticas */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Estadísticas</h1>
          <div className="grid grid-cols-3 gap-4">
            {areas.map((area) => (
              <div key={area.id} className="bg-blue-500 rounded-lg shadow-lg p-4">
                <h2 className="flex justify-center text-xl text-white mb-4">{area.name}</h2>
                <div className="flex justify-center ">
                  <button
                    onClick={() => openViewModal(area)}
                    className="bg-blue-300 text-white px-4 py-2 rounded-l-md"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => openEditModal(area)}
                    className="bg-green-500 text-white px-4 py-2 rounded-r-md"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal para ver estadísticas */}
          {viewModalOpen && (
            <ViewStatsModal
              area={selectedArea}
              closeModal={() => setViewModalOpen(false)}
            />
          )}

          {/* Modal para editar estadísticas */}
          {editModalOpen && (
            <EditStatsModal
              area={selectedArea}
              closeModal={() => setEditModalOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
