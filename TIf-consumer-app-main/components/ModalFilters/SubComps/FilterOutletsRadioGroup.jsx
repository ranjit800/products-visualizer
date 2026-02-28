import { useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";

const FilterOutletsRadioGroup = ({
  outletList,
  activeOutlet,
  callback_OutletChanged,
}) => {
  const [selected, setSelected] = useState(
    outletList.find(outlet => outlet.id === activeOutlet) || outletList[0]
  );

  function OnOutletChange(newActiveOutlet) {
    setSelected(newActiveOutlet);
    callback_OutletChanged(newActiveOutlet.id);
  }

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={OnOutletChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-transparent py-3 pl-4 pr-10 text-left border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600">
            <span className="block truncate text-black dark:text-white font-medium">
              {selected.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDownIcon
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none">
              {outletList.map((outlet, outletIdx) => (
                <Listbox.Option
                  key={outletIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-3 pl-10 pr-4 ${active ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' : 'text-gray-900 dark:text-gray-300'
                    }`
                  }
                  value={outlet}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? 'font-semibold text-black dark:text-white' : 'font-normal'
                          }`}
                      >
                        {outlet.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black dark:text-white">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default FilterOutletsRadioGroup;
