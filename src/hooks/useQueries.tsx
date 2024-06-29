import { useCallback, useEffect, useState } from "react";

interface FetchOptions {
    url?: string;
    method?: string;
}

interface UseQueriesProps {
    prefixUrl?: string;
}

export const useQueries = ({ prefixUrl = "" }: UseQueriesProps = {}) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    const fetchingData = useCallback(
        async ({ url = "", method = "GET" }: FetchOptions = {}) => {
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await fetch(url, { method });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result.data);
            } catch (error) {
                setIsError(true);
                console.error("Error fetching data: ", error);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        if (prefixUrl) {
            fetchingData({ url: prefixUrl });
        }
    }, [prefixUrl, fetchingData]);

    return { data, isLoading, isError, refetch: () => fetchingData({ url: prefixUrl }) };
};
