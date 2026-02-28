import PG_Card from "./SubComps/PG_Card";

const ProductGrid = ({
  productItems,
  category,
  outlet,
  priceRange,
  isDisabled = false,
  wishlistData,
  onWishlistChange,
}) => {
  console.log("PG -> Outlet -> " + JSON.stringify(outlet));
  console.log("PG -> Price Range -> " + JSON.stringify(priceRange));

  const fullList = productItems;
  const catFilteredList =
    category == "All"
      ? fullList
      : fullList.filter((product) => product.category == category);
  const outletFilteredList =
    outlet == -1
      ? catFilteredList
      : catFilteredList.filter((product) => product.outletIDs == outlet);
  const priceFilteredList = priceRange
    ? outletFilteredList.filter(
        (product) =>
          product.price >= priceRange.min && product.price <= priceRange.max
      )
    : outletFilteredList;

  return (
    <section
      className={`${
        isDisabled
          ? "flex w-full p-4 pb-20 md:pb-4"
          : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 pt-6 p-4 pb-20 md:pb-4 gap-4"
      }`}
    >
      {!isDisabled &&
        priceFilteredList.map((product) => (
          <PG_Card
            key={product.productID}
            productInfo={product}
            wishlistData={wishlistData}
            show3D={false}
            onWishlistChange={onWishlistChange}
          />
        ))}
      {isDisabled && (
        <div className="flex flex-col w-full h-full gap-1 items-center justify-center">
          <h1 className="font-semibold text-xl text-tif-blue">Sorry,</h1>
          <h1 className="font-medium text-base text-gray-400 italic">
            No Products in Catalogue
          </h1>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
