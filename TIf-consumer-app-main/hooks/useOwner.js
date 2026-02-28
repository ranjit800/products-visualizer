import { fetcher_Owner } from "@/libs/fetcher";
import useSWR from "swr";

const useOwner = (id) => {
  const { data, mutate, error, isLoading, isValidating } = useSWR(
    id,
    fetcher_Owner
  );

  return {
    owner: data,
    ownerMutate: mutate,
    isOwnerLoading: isLoading,
    isOwnerError: error,
    isOwnerValidating: isValidating,
  };
};

export default useOwner;
