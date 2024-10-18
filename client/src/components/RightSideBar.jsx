import React, { useState } from 'react';

const RightSideBar = ({ onCrimeTypeChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleCheckboxChange = (id) => {
    const newSelectedOption = selectedOption === id ? null : id;
    setSelectedOption(newSelectedOption);
    onCrimeTypeChange(newSelectedOption);
  };

  return (
    <div className="flex h-screen w-40 flex-col justify-between border-e bg-white items-center">
      <p className="text-2xl text-center font-bold text-blue-600 underline mt-12 mb-4">Filtros</p>
      <fieldset className="flex-grow"> 
        <legend className="sr-only">Checkboxes</legend>
        <div className="grid justify-items-start space-y-4 align-items">
          {[
            { id: 1, label: 'Robo veh cv' },
            { id: 2, label: 'Robo veh sv' },
            { id: 3, label: 'Robo casa cv' },
            { id: 4, label: 'Robo casa sv' },
          ].map((option) => (
<label key={option.id} htmlFor={`crime-${option.id}`} className="flex cursor-pointer items-center gap-2">
  <input
    type="checkbox"
    className="size-4 rounded border-gray-300"
    id={`crime-${option.id}`}
    checked={selectedOption === option.id}
    onChange={() => handleCheckboxChange(option.id)}
  />
  <strong className="font-medium text-gray-900">
    {option.label}
  </strong>
</label>

          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default RightSideBar;
