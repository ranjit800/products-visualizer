import { useState, useEffect, useRef } from "react";

const FilterPriceControls = ({
  minPrice,
  maxPrice,
  activePriceRange,
  callback_PriceChanged,
}) => {
  const progressRef = useRef(null);
  const [currActivePriceRange, setCurrActivePriceRange] =
    useState(activePriceRange);
  const [minValue, setMinValue] = useState(currActivePriceRange.min);
  const [maxValue, setMaxValue] = useState(currActivePriceRange.max);

  const handleMin = (e) => {
    if (maxValue - minValue >= 10000 && maxValue <= maxPrice) {
      if (parseInt(e.target.value) > parseInt(maxValue)) {
      } else {
        setMinValue(parseInt(e.target.value));
      }
    } else {
      if (parseInt(e.target.value) < minValue) {
        setMinValue(parseInt(e.target.value));
      }
    }
  };

  const handleMax = (e) => {
    if (maxValue - minValue >= 10000 && maxValue <= maxPrice) {
      if (parseInt(e.target.value) < parseInt(minValue)) {
      } else {
        setMaxValue(parseInt(e.target.value));
      }
    } else {
      if (parseInt(e.target.value) > maxValue) {
        setMaxValue(parseInt(e.target.value));
      }
    }
  };

  useEffect(() => {
    progressRef.current.style.left = (minValue / maxPrice) * 100 + "%";
    progressRef.current.style.right = 100 - (maxValue / maxPrice) * 100 + "%";
  }, [minValue, maxValue, minPrice, maxPrice]);

  useEffect(() => {
    /*let newActivePriceRange = {
      min: minValue,
      max: maxValue,
    };*/
    let newActivePriceRange = currActivePriceRange;
    newActivePriceRange.min = minValue;
    newActivePriceRange.max = maxValue;

    setCurrActivePriceRange(newActivePriceRange);
    callback_PriceChanged(newActivePriceRange);
  }, [minValue, maxValue]);

  return (
    <div className="flex flex-col justify-center items-stretch w-full gap-4">
      {/* Min and Max Inputs */}
      <div className="flex justify-between items-center gap-3">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-gray-600 dark:text-gray-400 text-sm font-medium">Min</label>
          <input
            onChange={(e) =>
              e.target.value < minPrice
                ? setMinValue(minPrice)
                : e.target.value > maxValue - 10000
                  ? setMinValue(maxValue - 10000)
                  : setMinValue(e.target.value)
            }
            type="number"
            value={minValue}
            className="w-full rounded-lg bg-transparent border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-black dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-600"
          />
        </div>
        <div className="text-gray-500 font-semibold text-lg mt-6">-</div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-gray-600 dark:text-gray-400 text-sm font-medium">Max</label>
          <input
            onChange={(e) =>
              e.target.value > maxPrice
                ? setMaxValue(maxPrice)
                : e.target.value < minValue + 10000
                  ? setMaxValue(minValue + 10000)
                  : setMaxValue(e.target.value)
            }
            type="number"
            value={maxValue}
            className="w-full rounded-lg bg-transparent border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-black dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-600"
          />
        </div>
      </div>

      {/* Slider */}
      <div className="mt-8 mb-2">
        <div className="slider relative h-1 rounded-md bg-gray-300 dark:bg-[#656565]">
          <div
            className="progress absolute h-1 bg-black dark:bg-[#656565] rounded"
            ref={progressRef}
          >
          </div>
        </div>

        <div className="range-input relative">
          <input
            onChange={handleMin}
            type="range"
            value={minValue}
            min={minPrice}
            step={100}
            max={maxPrice}
            className="range-min absolute w-full -top-1 h-1 bg-transparent appearance-none pointer-events-none"
          />

          <input
            onChange={handleMax}
            type="range"
            value={maxValue}
            min={minPrice}
            step={100}
            max={maxPrice}
            className="range-max absolute w-full -top-1 h-1 bg-transparent appearance-none pointer-events-none"
          />
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          pointer-events: all;
          width: 18px;
          height: 18px;
          background-color: black;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid black;
        }

        :global(.dark) input[type="range"]::-webkit-slider-thumb {
          background-color: white;
          border: 2px solid white;
        }

        input[type="range"]::-moz-range-thumb {
          appearance: none;
          pointer-events: all;
          width: 18px;
          height: 18px;
          background-color: black;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid black;
        }

        :global(.dark) input[type="range"]::-moz-range-thumb {
          background-color: white;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default FilterPriceControls;
