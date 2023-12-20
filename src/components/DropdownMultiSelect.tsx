import { Buildings, CaretDown, X } from 'phosphor-react';
import React, { useState, useEffect, useRef } from 'react';

type Option = string; // Define the type for each option

interface DropdownMultiSelectProps {
  options: Option[];
  selectedOptions: Option[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<Option[]>>;
}

const DropdownMultiSelect: React.FC<DropdownMultiSelectProps> = ({
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleOptionClick = (option: Option) => {
    const selectedIndex = selectedOptions.indexOf(option);
    let newSelectedOptions: Option[] = [];

    if (selectedIndex === -1) {
      newSelectedOptions = [...selectedOptions, option];
    } else {
      newSelectedOptions = selectedOptions.filter((item) => item !== option);
    }

    setSelectedOptions(newSelectedOptions);
  };

  return (
    <div className="relative w-full inline-block text-left " ref={dropdownRef}>
      <div>
        <span className="rounded-xl h-12 text-xl shadow-sm w-full bg-white">
        
          <button
            type="button"
            className=" bg-white truncate justify-between  text-ellipsis gap-4 inline-flex  w-full rounded-xl h-12 border border-gray-300 px-6 py-2 text-gray-400 min-h-[40px]  items-center text-base font-medium  leading-5  text-gray-700   focus:outline-none  focus:shadow-outline-blue active:bg-gray-50 hover:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="true"
            aria-expanded="true"
          >

<div className='gap-4 flex'>
<Buildings size={20} className="text-gray-400" />
            {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Instituição'}
</div>

            {selectedOptions.length > 0 ? (
              <div className=" absolute right-[1px] bg-[#f9f9f9] h-9 flex items-center px-3 rounded-full">
                <CaretDown size={16} className="text-gray-400  " />
              </div>
            ) : (
              <CaretDown size={16} className="text-gray-400  " />
            )}
          </button>
        </span>
      </div>
      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-4 rounded-xl border w-full border-gray-300 shadow-sm">
          <div className="rounded-xl bg-white p-4 w-full ">
            <div className="py-1 flex flex-col gap-4">
              {options.map((option) => (
                <div
                  key={option}
                  className={`${selectedOptions.includes(option)
                      ? 'bg-blue-100 text-gray-400 rounded-md border-[1px] border-blue-400 '
                      : 'text-gray-700 border-[1px] border-white rounded-md '
                    } text-sm font-medium h-12 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 flex items-center`}
                  onClick={() => handleOptionClick(option)}
                >
                  <span className={` block truncate text-gray-400`}>{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMultiSelect;
