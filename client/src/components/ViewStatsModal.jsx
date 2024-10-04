import React from 'react';

const ViewStatsModal = ({ area, closeModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg text-gray-800">
        <h2 className="text-2xl mb-4">Estadísticas de {area.name}</h2>
        <p>Aquí se mostrarán las estadísticas del área.</p>
        <button
          onClick={closeModal}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ViewStatsModal;
