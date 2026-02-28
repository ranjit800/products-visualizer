import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ModalFiltersContent from "./SubComps/ModalFiltersContent";

const ModalFilters = ({
  doOpen = false,
  companyOutlets,
  companyProducts,
  activeOutlet,
  activePriceRange,
  callback_OnClose,
}) => {
  let [isOpen, setIsOpen] = useState(doOpen);
  const [outletNames, setOutletNames] = useState(CompileOutletObjects());
  const [activeOutletName, setActiveOutletName] = useState(activeOutlet);
  const [minProductPrice, setMinProductPrice] = useState(0);
  const [maxProductPrice, setMaxProductPrice] = useState(0);
  const [activeProductPriceRange, setActiveProductPriceRange] =
    useState(activePriceRange);

  function OpenModal() {
    setIsOpen(true);
  }

  function CloseModal() {
    setIsOpen(false);
    if (callback_OnClose != null) {
      callback_OnClose(activeOutletName, activeProductPriceRange);
    }
  }

  function CompileOutletObjects() {
    var outletObjects = [];
    outletObjects.push({ name: "All", id: -1 });
    for (let i = 0; i < companyOutlets.length; i++) {
      outletObjects.push({
        name: companyOutlets[i].outletName,
        id: companyOutlets[i].outletID,
      });
    }
    console.log(outletObjects);
    return outletObjects;
  }

  function SetProductPriceRange() {
    console.log("SetProductPriceRange -> " + JSON.stringify(activePriceRange));
    var minPrice = Number.MAX_VALUE;
    var maxPrice = Number.MIN_VALUE;
    var activeMinPrice = activePriceRange.min;
    var activeMaxPrice = activePriceRange.max;

    for (let i = 0; i < companyProducts.length; i++) {
      var currProductPrice = companyProducts[i].price;
      if (currProductPrice < minPrice) minPrice = currProductPrice;
      if (currProductPrice > maxPrice) maxPrice = currProductPrice;
    }

    setMinProductPrice(minPrice);
    setMaxProductPrice(maxPrice);

    if (activeMinPrice < minPrice) activeMinPrice = minPrice;
    if (activeMaxPrice > maxPrice) activeMaxPrice = maxPrice;
    setActiveProductPriceRange({ min: activeMinPrice, max: activeMaxPrice });
  }

  function Callback_OnOutletChanged(newActiveOutlet) {
    setActiveOutletName(newActiveOutlet);
  }

  function Callback_OnPriceRangeChanged(newActivePriceRange) {
    setActiveProductPriceRange(newActivePriceRange);
  }

  useEffect(() => {
    SetProductPriceRange();
    if (doOpen) OpenModal();
    else CloseModal();
  }, [doOpen]);

  useEffect(() => {
    setOutletNames(CompileOutletObjects());
  }, [companyOutlets]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={CloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>
          <ModalFiltersContent
            outletNameList={outletNames}
            activeOutletName={activeOutletName}
            productPriceMin={minProductPrice}
            productPriceMax={maxProductPrice}
            activePriceRange={activeProductPriceRange}
            onOutletChangedCallback={Callback_OnOutletChanged}
            onPriceRangeChangedCallback={Callback_OnPriceRangeChanged}
            onCloseCallback={callback_OnClose}
          />
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalFilters;
