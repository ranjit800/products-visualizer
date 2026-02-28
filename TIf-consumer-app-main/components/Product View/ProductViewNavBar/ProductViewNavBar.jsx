import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const ProductViewNavBar = ({
  Callback_OnBackButtonClicked,
  isPluginMode = false,
}) => {
  if (isPluginMode) {
    return (
      <section className="flex absolute top-0 left-0 w-fit h-auto items-center justify-center py-4 px-2 gap-6 z-20">
        <button
          onClick={() => Callback_OnBackButtonClicked()}
          className="p-2 bg-white text-black rounded-full shadow-xl"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <Image
          src="/Logos/BFSHorizontal.png"
          alt="Try It First Logo"
          width={150}
          height={64}
          className="animate-slideInSpringedBottom pb-2"
        />
      </section>
    );
  } else {
    return (
      <section className="absolute top-0 left-0 flex w-fit h-auto py-4 px-2 z-20">
        <button
          onClick={() => Callback_OnBackButtonClicked()}
          className="p-2 bg-white text-black rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-100"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      </section>
    );
  }
};

export default ProductViewNavBar;
