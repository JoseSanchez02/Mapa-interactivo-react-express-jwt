import React, { useState } from 'react';
import axios from 'axios';

const EditStatsModal = ({ area, closeModal }) => {
  const [crimeStats, setCrimeStats] = useState({
    id_area: area.id,
    roboVehCv: '',
    roboVehSv: '',
    roboCasaCv: '',
    roboCasaSv: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Verificar si el valor es un número y no negativo
    if (value === '' || (!isNaN(value) && Number(value) >= 0)) {
      setCrimeStats({
        ...crimeStats,
        [name]: value,
      });
    }
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

      closeModal();
    } catch (error) {
      console.error('Error al guardar las estadísticas:', error);
      alert('Ocurrió un error al guardar las estadísticas. Intenta de nuevo.');
    }
  };

  const isFormValid = Object.values(crimeStats).every(value => value !== '');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg text-gray-800" style={{ width: '350px', textAlign: 'center' }}>
        <h2 className="text-2xl mb-4">MODAL AREA {crimeStats.id_area}</h2>
        <p className="mb-4">Último registro el: 26/09/24</p>
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
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => setCrimeStats({ id_area: area.id, roboVehCv: '', roboVehSv: '', roboCasaCv: '', roboCasaSv: '' })}
            >
              Nuevo
            </button>
            <button
              type="submit"
              className={`bg-green-500 text-white px-4 py-2 rounded ${isFormValid ? '' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!isFormValid}
            >
              Guardar
            </button>
          </div>
        </form>
        <button
          onClick={closeModal}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditStatsModal;
