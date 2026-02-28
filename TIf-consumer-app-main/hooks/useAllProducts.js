import { fetcher_AllCompanies, fetcher_Owner } from "@/libs/fetcher";
import useSWR from "swr";

export function useAllProducts(ownerID) {
  const {
    data: ownerData,
    error: ownerError,
    isLoading: isOwnerLoading,
  } = useSWR(ownerID, fetcher_Owner);
  const {
    data: allCompaniesData,
    error: allCompaniesError,
    isLoading: isCompaniesLoading,
  } = useSWR(
    () => (ownerData ? ownerData.companyList : null),
    fetcher_AllCompanies
  );

  const isLoading = isOwnerLoading || isCompaniesLoading;
  const isAllProductsError =
    ownerError ||
    allCompaniesError ||
    (ownerData && ownerData.ownerDetails.length == 0) ||
    (allCompaniesData && allCompaniesData.length == 0);

  let allProducts = [];
  let allCompanies = [];

  if (allCompaniesData) {
    allCompanies = ownerData.companyList;

    for (let i = 0; i < allCompaniesData.length; i++) {
      for (let j = 0; j < allCompaniesData[i].catalogue.length; j++) {
        allProducts.push(allCompaniesData[i].catalogue[j]);
      }
    }
  }

  return {
    companies: allCompanies,
    products: allProducts,
    isAllProductsLoading: isLoading,
    isAllProductsError,
  };
}
