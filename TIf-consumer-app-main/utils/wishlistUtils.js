// export function DoesWishlistContain(productID, companyID) {
//   var customerWishlist = null;

//   customerWishlist = LoadWishlist(companyID);

//   if (customerWishlist == null) return false;
//   else {
//     if (customerWishlist.includes(productID)) return true;
//     else return false;
//   }
// }

// export function AddToWishlist(productID, companyID, onAddCallback) {
//   var customerWishlist = LoadWishlist(companyID);
//   if (customerWishlist == null) customerWishlist = [];

//   customerWishlist.push(productID);
//   SaveWishlist(customerWishlist, companyID, onAddCallback);
// }

// export function RemoveFromWishlist(productID, companyID, onRemoveCallback) {
//   var customerWishlist = LoadWishlist(companyID);

//   customerWishlist.splice(customerWishlist.indexOf(productID), 1);

//   SaveWishlist(customerWishlist, companyID, onRemoveCallback);
// }

// export function LoadWishlist(companyID) {
//   var wishlist = null;

//   if (typeof window !== "undefined") {
//     wishlist = JSON.parse(
//       window.localStorage.getItem("tif-wishlist-" + companyID)
//     );
//     return wishlist;
//   } else {
//     return wishlist;
//   }
// }

// function SaveWishlist(updatedWishlist, companyID, onSaveCallback) {
//   localStorage.setItem(
//     "tif-wishlist-" + companyID,
//     JSON.stringify(updatedWishlist)
//   );
//   onSaveCallback();
// }



export function DoesWishlistContain(productID, companyID) {
  var customerWishlist = null;

  customerWishlist = LoadWishlist(companyID);

  if (customerWishlist == null) return false;
  else {
    if (customerWishlist.includes(productID)) return true;
    else return false;
  }
}

export function AddToWishlist(productID, companyID, onAddCallback) {
  if (!companyID) return;
  var customerWishlist = LoadWishlist(companyID);

  const normalizedProductID = String(productID);
  const alreadyExists = customerWishlist.some(
    (item) => String(item) === normalizedProductID
  );

  if (alreadyExists) {
    if (onAddCallback) onAddCallback();
    return;
  }

  customerWishlist.push(productID);
  SaveWishlist(customerWishlist, companyID, onAddCallback);
}

export function RemoveFromWishlist(productID, companyID, onRemoveCallback) {
  if (!companyID) return;
  var customerWishlist = LoadWishlist(companyID);

  if (customerWishlist.length === 0) return;

  const removalIndex = customerWishlist.findIndex(
    (item) => String(item) === String(productID)
  );

  if (removalIndex === -1) return;

  customerWishlist.splice(removalIndex, 1);

  SaveWishlist(customerWishlist, companyID, onRemoveCallback);
}

export function LoadWishlist(companyID) {
  if (typeof window === "undefined" || !companyID) {
    return [];
  }

  try {
    const wishlistRaw = window.localStorage.getItem(
      "tif-wishlist-" + companyID
    );
    if (!wishlistRaw) return [];

    const wishlist = JSON.parse(wishlistRaw);
    return Array.isArray(wishlist) ? wishlist : [];
  } catch (error) {
    console.error("Error loading wishlist from localStorage", error);
    return [];
  }
}

function SaveWishlist(updatedWishlist, companyID, onSaveCallback) {
  if (typeof window === "undefined" || !companyID) return;

  window.localStorage.setItem(
    "tif-wishlist-" + companyID,
    JSON.stringify(updatedWishlist)
  );
  if (onSaveCallback) onSaveCallback();
}
