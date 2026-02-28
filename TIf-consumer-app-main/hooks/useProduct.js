import { fetcher_Product } from "@/libs/fetcher";
import useSWR from "swr";

const useProduct = (id) => {
  const { data, error, isLoading } = useSWR(id, fetcher_Product);

  return {
    product: data,
    isProductLoading: isLoading,
    isProductError: error,
  };
};

export default useProduct;
