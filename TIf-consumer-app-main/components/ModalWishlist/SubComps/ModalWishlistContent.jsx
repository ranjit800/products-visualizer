import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import WishlistDisplay from "../../Wishlist/WishlistDisplay";

const ModalWishlistContent = ({
  wishlistItems,
  onCloseCallback,
  onRemoveCallback,
}) => {
  console.log("Modal -> Wishlist Data recieved -> ");
  console.log(wishlistItems);

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
          <Dialog.Panel className="flex flex-col w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-black text-left align-middle shadow-2xl transition-all border border-gray-200 dark:border-gray-800">
            <WishlistDisplay
              wishlistItems={wishlistItems}
              onRemoveCallback={onRemoveCallback}
            />

            <div className="w-full p-4 pt-0 bg-white dark:bg-black">
              <button
                onClick={() => onCloseCallback()}
                className="flex p-3 items-center justify-center w-full font-semibold text-white bg-black hover:bg-gray-800 dark:text-black dark:bg-white dark:hover:bg-gray-200 rounded-lg transition-all"
              >
                <h1>Close</h1>
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  );
};

export default ModalWishlistContent;
