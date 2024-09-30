import React from 'react';

const RightSideBar = () => {
  return (
    <div className="flex h-screen w-40 flex-col justify-between border-e bg-white items-center">
      <p className="text-2xl text-center font-bold text-blue-600 text-decoration-line: underline mt-12 mb-4">Filtros</p>
      <fieldset className="flex-grow"> 
        <legend className="sr-only">Checkboxes</legend>
        <div className="grid justify-items-center space-y-4">
          <label htmlFor="Option1" className="flex cursor-pointer items-start gap-4">
            <div className="flex items-center">
              &#8203;
              <input type="checkbox" className="size-4 rounded border-gray-300" id="Option1" />
            </div>
            <div>
              <strong className="font-medium text-gray-900"> Robo veh cv </strong>
            </div>
          </label>

          <label htmlFor="Option2" className="flex cursor-pointer items-start gap-4">
            <div className="flex items-center">
              &#8203;
              <input type="checkbox" className="size-4 rounded border-gray-300" id="Option2" />
            </div>
            <div>
              <strong className="font-medium text-gray-900"> Robo veh sv </strong>
            </div>
          </label>

          <label htmlFor="Option3" className="flex cursor-pointer items-start gap-4">
            <div className="flex items-center">
              &#8203;
              <input type="checkbox" className="size-4 rounded border-gray-300" id="Option3" />
            </div>
            <div>
              <strong className="font-medium text-gray-900"> Robo casa cv </strong>
            </div>
          </label>

          <label htmlFor="Option4" className="flex cursor-pointer items-start gap-4">
            <div className="flex items-center">
              &#8203;
              <input type="checkbox" className="size-4 rounded border-gray-300" id="Option4" />
            </div>
            <div>
              <strong className="font-medium text-gray-900"> Robo casa sv </strong>
            </div>
          </label>
        </div>
        <a
          className="mt-4 inline-block flex justify-center rounded border border-blue-600 bg-blue-600 px-10 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
          href="#"
        >Aplicar</a>
      </fieldset>



      <div>
        <div className="border-t border-gray-100">
          <div className="px-2">
            <div className="py-4">
              <a
                href="#"
                className="t group relative flex justify-center rounded bg-blue-50 px-2 py-1.5 text-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 opacity-75"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  General
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
