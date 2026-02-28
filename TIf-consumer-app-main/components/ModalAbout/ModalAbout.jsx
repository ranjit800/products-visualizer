import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ModalAboutContent from "./SubComps/ModalAboutContent";

const ModalAbout = ({ doOpen = false, companyInfo, callback_OnClose }) => {
  let [isOpen, setIsOpen] = useState(doOpen);

  function OpenModal() {
    setIsOpen(true);
  }

  function CloseModal() {
    setIsOpen(false);
    if (callback_OnClose != null) {
      callback_OnClose();
    }
  }

  useEffect(() => {
    if (doOpen) OpenModal();
    else CloseModal();
  }, [doOpen]);

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
          <ModalAboutContent
            companyInfo={companyInfo}
            onCloseCallback={callback_OnClose}
          />
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalAbout;
