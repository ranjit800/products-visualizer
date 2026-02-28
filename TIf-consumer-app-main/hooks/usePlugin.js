import { fetcher_Plugin } from "@/libs/fetcher";
import useSWR from "swr";

const usePlugin = (sku, comapanyID) => {
  const { data, error, isLoading } = useSWR([sku, comapanyID], fetcher_Plugin);

  console.log("SKU: " + sku + " | Company: " + comapanyID);

  return {
    product: data,
    isProductLoading: isLoading,
    isProductError: error,
  };
};

export default usePlugin;
