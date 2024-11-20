
import PropTypes from 'prop-types';

const StatsDetailModal = ({ stat, closeModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg text-gray-800" style={{ width: '350px' }}>
        <h2 className="text-2xl mb-4">Detalles del registro</h2>
        <p className="mb-4">Fecha: {new Date(stat.fecha).toLocaleDateString()}</p>
        <div className="mb-2">
          <label className="block text-gray-700">Robo veh cv</label>
          <input
            type="number"
            value={stat.roboVehCv}
            className="w-full px-3 py-1 border rounded"
            disabled
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Robo veh sv</label>
          <input
            type="number"
            value={stat.roboVehSv}
            className="w-full px-3 py-1 border rounded"
            disabled
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Robo casa cv</label>
          <input
            type="number"
            value={stat.roboCasaCv}
            className="w-full px-3 py-1 border rounded"
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Robo casa sv</label>
          <input
            type="number"
            value={stat.roboCasaSv}
            className="w-full px-3 py-1 border rounded"
            disabled
          />
        </div>
        <button
          onClick={closeModal}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

StatsDetailModal.propTypes = {
  stat: PropTypes.shape({
    fecha: PropTypes.string.isRequired,
    roboVehCv: PropTypes.number.isRequired,
    roboVehSv: PropTypes.number.isRequired,
    roboCasaCv: PropTypes.number.isRequired,
    roboCasaSv: PropTypes.number.isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default StatsDetailModal;
