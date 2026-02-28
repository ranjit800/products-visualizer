import { useEffect, useState } from "react";
import CS_Card from "./SubComps/CS_Card";
import { ListFilter } from "lucide-react";

const CategorySlider = ({
  categoryItems,
  id,
  currActiveCategory,
  activeCategoryCallback,
  openFiltersCallback,
  isDisabled = false,
}) => {
  const [activeCategory, setActiveCategory] = useState(currActiveCategory);

  const handleCategoryChange = (category) => {
    console.log("Changed to " + category);
    setActiveCategory(category);
    activeCategoryCallback(category);
  };

  return (
    <section className="flex flex-col w-full relative">
      {/* Slider Div */}
      <div className="flex items-center w-full ">
        {/* Fixed Filter Icon */}
        <div className="flex-shrink-0 pl-4 pr-2 py-2 bg-white dark:bg-black z-10">
          <button
            className="p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Filter"
            onClick={() => openFiltersCallback && openFiltersCallback()}
          >
            <ListFilter className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Categories */}
        <div className="flex whitespace-nowrap py-1 pr-4 gap-4 overflow-x-auto scrollbar-hide scroll-smooth">
          <CS_Card
            catName={["All"]}
            catID={id + "_category_" + "-1"}
            catActive={activeCategory}
            onClickCallback={handleCategoryChange}
            isDisabled={isDisabled}
          />
          {categoryItems.map((category, index) => (
            <CS_Card
              key={id + "_category_" + index}
              catName={Object.keys(category)}
              catID={id + "_category_" + index}
              catActive={activeCategory}
              onClickCallback={handleCategoryChange}
              isDisabled={isDisabled}
            />
          ))}
        </div>
      </div>
      <div className="absolute right-0 w-5 h-14 bg-gradient-to-l from-white dark:from-black from-40% pointer-events-none" />
    </section>
  );
};

export default CategorySlider;
