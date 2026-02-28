import { Dialog, Transition } from "@headlessui/react";
import {
  BuildingStorefrontIcon,
  CreditCardIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";
import { Fragment, useState } from "react";
import FilterOutletsRadioGroup from "./FilterOutletsRadioGroup";
import FilterPriceControls from "./FilterPriceControls";

const ModalFiltersContent = ({
  outletNameList,
  activeOutletName,
  productPriceMin,
  productPriceMax,
  activePriceRange,
  onOutletChangedCallback,
  onPriceRangeChangedCallback,
  onCloseCallback,
}) => {
  const [currActiveOutlet, setCurrActiveOutlet] = useState(activeOutletName);
  const [currActivePriceRange, setCurrActivePriceRange] =
    useState(activePriceRange);
  console.log(
    "ModalContent Outlet Objects Recieved-> " + JSON.stringify(outletNameList)
  );
  console.log(
    "ModalContent Active Outlet Recieved-> " + JSON.stringify(activeOutletName)
  );

  function Callback_OnOutletChanged(newActiveOutlet) {
    console.log("Outlet changed to " + newActiveOutlet);
    setCurrActiveOutlet(newActiveOutlet);
    onOutletChangedCallback(newActiveOutlet);
  }

  function Callback_OnPriceChanged(newActivePriceRange) {
    console.log(
      "Price Range changed to | Min -> " +
      newActivePriceRange.min +
      " | Max -> " +
      newActivePriceRange.max
    );
    setCurrActivePriceRange(newActivePriceRange);
    onPriceRangeChangedCallback(newActivePriceRange);
  }

  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center ">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="flex flex-col w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-black text-left align-middle shadow-2xl transition-all border border-gray-200 dark:border-transparent">
            {/* Header */}
            <div className="flex flex-col justify-center items-center p-3 pb-2 bg-gray-100 dark:bg-[#131313] mb-2">
              <Dialog.Title
                as="h1"
                className="text-xl font-semibold text-black dark:text-white"
              >
                Choose Category
              </Dialog.Title>
            </div>

            {/* Content */}
            <div className="flex flex-col px-6 pb-6 gap-4">
              {/* Select Outlet */}
              <div className="flex flex-col gap-3">
                <h2 className="text-black dark:text-white font-semibold text-base">Select Outlet</h2>
                <FilterOutletsRadioGroup
                  outletList={outletNameList}
                  activeOutlet={currActiveOutlet}
                  callback_OutletChanged={Callback_OnOutletChanged}
                />
              </div>

              {/* Price Filter */}
              <div className="flex flex-col gap-3">
                <h2 className="text-black dark:text-white font-semibold text-base">Price Filter</h2>
                <FilterPriceControls
                  minPrice={productPriceMin}
                  maxPrice={productPriceMax}
                  activePriceRange={currActivePriceRange}
                  callback_PriceChanged={Callback_OnPriceChanged}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => onCloseCallback()}
                className="flex-1 p-3 items-center justify-center font-semibold text-white bg-[#343434] hover:bg-[#656565] rounded-lg transition-all"
              >
                Set Filters
              </button>
              <button
                onClick={() => onCloseCallback()}
                className="flex-1 p-3 items-center justify-center font-semibold text-white bg-[#646464] hover:bg-[#656565] rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  );
};

export default ModalFiltersContent;
