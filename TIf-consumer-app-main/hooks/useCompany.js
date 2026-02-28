import { fetcher_Company, fetcher_CompanyURL } from "@/libs/fetcher";
import useSWR from "swr";

const useCompany = (id, isURL = false) => {
  const { data, error, isLoading } = isURL ? useSWR(id, fetcher_CompanyURL) : useSWR(id, fetcher_Company);

  return {
    company: data,
    isCompanyLoading: isLoading,
    isCompanyError: error,
  };
};

export default useCompany;
