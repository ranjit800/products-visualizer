// import { Fragment, useEffect, useState } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import ModalWishlistContent from "./SubComps/ModalWishlistContent";

// const ModalWishlist = ({
//   doOpen = false,
//   wishlistData,
//   companyProducts,
//   callback_OnClose,
//   callback_OnRemove,
// }) => {
//   let [isOpen, setIsOpen] = useState(doOpen);
//   const [wishlistProducts, setWishlistProducts] = useState(
//     CompileWishlistItems()
//   );

//   function OpenModal() {
//     setIsOpen(true);
//   }

//   function CloseModal() {
//     setIsOpen(false);
//     if (callback_OnClose != null) {
//       callback_OnClose();
//     }
//   }

//   function CompileWishlistItems() {
//     var wishlistItems = [];

//     if (!wishlistData) return null;

//     for (let i = 0; i < companyProducts.length; i++) {
//       for (let j = 0; j < wishlistData.length; j++) {
//         if (wishlistData[j] == companyProducts[i].productID) {
//           wishlistItems.push(companyProducts[i]);
//         }
//       }
//     }
//     //console.log("Wishlisted Products -> " + JSON.stringify(wishlistItems));
//     return wishlistItems;
//   }

//   useEffect(() => {
//     if (doOpen) OpenModal();
//     else CloseModal();
//   }, [doOpen]);

//   useEffect(() => {
//     setWishlistProducts(CompileWishlistItems());
//   }, [companyProducts, wishlistData]);

//   return (
//     <>
//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={CloseModal}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
//           </Transition.Child>
//           <ModalWishlistContent
//             wishlistItems={wishlistProducts}
//             onCloseCallback={callback_OnClose}
//             onRemoveCallback={callback_OnRemove}
//           />
//         </Dialog>
//       </Transition>
//     </>
//   );
// };

// export default ModalWishlist;


import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ModalWishlistContent from "./SubComps/ModalWishlistContent";

const ModalWishlist = ({
  doOpen = false,
  wishlistData,
  companyProducts,
  callback_OnClose,
  callback_OnRemove,
}) => {
  let [isOpen, setIsOpen] = useState(doOpen);
  const [wishlistProducts, setWishlistProducts] = useState(
    CompileWishlistItems()
  );

  function OpenModal() {
    setIsOpen(true);
  }

  function CloseModal() {
    setIsOpen(false);
    if (callback_OnClose != null) {
      callback_OnClose();
    }
  }

  function CompileWishlistItems() {
    if (!wishlistData || wishlistData.length === 0) return [];
    if (!companyProducts || companyProducts.length === 0) return [];

    var wishlistItems = [];

    for (let i = 0; i < companyProducts.length; i++) {
      for (let j = 0; j < wishlistData.length; j++) {
        if (wishlistData[j] == companyProducts[i].productID) {
          wishlistItems.push(companyProducts[i]);
        }
      }
    }
    //console.log("Wishlisted Products -> " + JSON.stringify(wishlistItems));
    return wishlistItems;
  }

  useEffect(() => {
    if (doOpen) OpenModal();
    else CloseModal();
  }, [doOpen]);

  useEffect(() => {
    setWishlistProducts(CompileWishlistItems());
  }, [companyProducts, wishlistData]);

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
          <ModalWishlistContent
            wishlistItems={wishlistProducts}
            onCloseCallback={callback_OnClose}
            onRemoveCallback={callback_OnRemove}
          />
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalWishlist;
