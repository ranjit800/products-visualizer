import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";

const ModalAboutContent = ({ companyInfo, onCloseCallback }) => {
  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                About Us
              </Dialog.Title>
            </div>

            {/* Content */}
            <div className="flex flex-col px-6 pb-6 gap-4">
              {/* Company Logo and Info */}
              <div className="flex items-center gap-4">
                <div className="rounded-lg overflow-clip aspect-square w-20 h-20 relative bg-white flex-shrink-0">
                  <Image
                    src={companyInfo.companyLogo}
                    alt="Company Logo"
                    quality={100}
                    fill
                    style={{ objectFit: "cover" }}
                    placeholder="blur"
                    blurDataURL={companyInfo.companyLogo}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <h2 className="font-bold text-lg text-black dark:text-white">
                    {companyInfo.companyName}
                  </h2>
                  <p className="font-normal text-sm text-gray-600 dark:text-gray-400">
                    {companyInfo.companyAddress}
                  </p>
                </div>
              </div>

              {/* Description */}
              {companyInfo.companyDescription && (
                <div className="flex flex-col gap-2">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {companyInfo.companyDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Button */}
            <div className="flex p-6 pt-0">
              <button
                onClick={() => onCloseCallback()}
                className="flex-1 p-3 items-center justify-center font-semibold text-white bg-black hover:bg-gray-800 dark:bg-[#343434] dark:hover:bg-[#656565] rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  );
};

export default ModalAboutContent;
