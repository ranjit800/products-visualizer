import fetcher from '@/libs/fetcher'
import useSWR from 'swr'

const useBrand = (id) => {
  const {data, error, isLoading} = useSWR(id, fetcher)

  return {
    brandData: data,
    isLoading,
    isError: error
  }
}

export default useBrand