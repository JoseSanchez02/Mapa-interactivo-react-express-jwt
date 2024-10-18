import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditStatsModal = ({ area, closeModal }) => {
  const [crimeStats, setCrimeStats] = useState({
    id_area: area.id,
    roboVehCv: '',
    roboVehSv: '',
    roboCasaCv: '',
    roboCasaSv: '',
  });
  const [lastSavedStats, setLastSavedStats] = useState(null);
  const [lastSavedDate, setLastSavedDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchLastStats();
  }, [area.id]);

  const fetchLastStats = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/crimenes/lastStats/${area.id}`);
      if (response.data) {
        setLastSavedStats(response.data.stats);
        setCrimeStats(response.data.stats);
        setLastSavedDate(new Date(response.data.fecha).toLocaleDateString());
      }
    } catch (error) {
      console.error('Error fetching last stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || (!isNaN(value) && Number(value) >= 0)) {
      setCrimeStats({
        ...crimeStats,
        [name]: value,
      });
    }
  };

  const handleNewClick = () => {
    setCrimeStats({
      id_area: area.id,
      roboVehCv: '',
      roboVehSv: '',
      roboCasaCv: '',
      roboCasaSv: '',
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/crimenes/batch', crimeStats, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Respuesta del servidor:', response.data);
      alert(`Estadísticas actualizadas para el Área ${crimeStats.id_area}`);
      setIsEditing(false);
      fetchLastStats();
    } catch (error) {
      console.error('Error al guardar las estadísticas:', error);
      alert('Ocurrió un error al guardar las estadísticas. Intenta de nuevo.');
    }
  };

  const isFormValid = Object.values(crimeStats).every(value => value !== '');
  const hasChanges = JSON.stringify(crimeStats) !== JSON.stringify(lastSavedStats);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg text-gray-800" style={{ width: '350px', textAlign: 'center' }}>
        <h2 className="font-bold text-2xl mb-4">{area.name}</h2>
        {lastSavedDate && <p className="text-base mb-4">Último registro el: {lastSavedDate}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-gray-700">Robo veh cv</label>
            <input
              type="number"
              name="roboVehCv"
              value={crimeStats.roboVehCv}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded"
              min="0"
              disabled={!isEditing}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Robo veh sv</label>
            <input
              type="number"
              name="roboVehSv"
              value={crimeStats.roboVehSv}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded"
              min="0"
              disabled={!isEditing}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Robo casa cv</label>
            <input
              type="number"
              name="roboCasaCv"
              value={crimeStats.roboCasaCv}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded"
              min="0"
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Robo casa sv</label>
            <input
              type="number"
              name="roboCasaSv"
              value={crimeStats.roboCasaSv}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded"
              min="0"
              disabled={!isEditing}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleNewClick}
            >
              Nuevo
            </button>
            <button
              type="submit"
              className={`bg-green-500 text-white px-4 py-2 rounded ${(isFormValid && isEditing && hasChanges) ? '' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!(isFormValid && isEditing && hasChanges)}
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStatsModal;