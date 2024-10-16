import React, { useState } from 'react';

const RightSideBar = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleCheckboxChange = (id) => {
    setSelectedOption(selectedOption === id ? null : id);
  };

  return (
    <div className="flex h-screen w-40 flex-col justify-between border-e bg-white items-center">
      <p className="text-2xl text-center font-bold text-blue-600 underline mt-12 mb-4">Filtros</p>
      <fieldset className="flex-grow"> 
        <legend className="sr-only">Checkboxes</legend>
        <div className="grid justify-items-start space-y-4 ">
          {['Option1', 'Option2', 'Option3', 'Option4'].map((option, index) => (
            <label key={option} htmlFor={option} className="flex cursor-pointer items-start gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="size-4 rounded border-gray-300 "
                  id={option}
                  checked={selectedOption === option}
                  onChange={() => handleCheckboxChange(option)}
                />
              </div>
              <div>
                <strong className="font-medium text-gray-900 flex ">
                  {`Robo ${option.includes('1') || option.includes('3') ? 'veh' : 'casa'} ${option.includes('cv') ? 'cv' : 'sv'}`}
                </strong>
              </div>
            </label>
          ))}
        </div>
        <a
          className="mt-4 inline-block flex justify-center rounded border border-blue-600 bg-blue-600 px-10 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
          href="#"
        >
          Aplicar
        </a>
      </fieldset>
    </div>
  );
};

export default RightSideBar;
