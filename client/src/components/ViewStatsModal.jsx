import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatsDetailModal from './StatsDetailModal';

const ViewStatsModal = ({ area, closeModal }) => {
  const [stats, setStats] = useState([]);
  const [selectedStat, setSelectedStat] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [area.id]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/crimenes/stats/${area.id}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedStat(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg text-gray-800" style={{ width: '400px' }}>
        <h2 className="text-2xl mb-4">Estadísticas de {area.name}</h2>
        <div className="max-h-96 overflow-y-auto">
          {stats.length === 0 ? (
            <p className="text-center text-gray-500">No hay registros guardados.</p>
          ) : (
            stats.map((stat, index) => (
              <button
                key={index}
                onClick={() => handleStatClick(stat)}
                className="w-full text-left p-2 hover:bg-gray-100 border-b border-gray-200"
              >
                {new Date(stat.fecha).toLocaleDateString()}
              </button>
            ))
          )}
        </div>
        <button
          onClick={closeModal}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Cerrar
        </button>
      </div>
      {showDetailModal && (
        <StatsDetailModal stat={selectedStat} closeModal={closeDetailModal} />
      )}
    </div>
  );
};

export default ViewStatsModal;
