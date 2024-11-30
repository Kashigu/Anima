import { useEffect } from "react";

const useDebouncedSearch = (
    query: string,
    fetchFunction: (query: string) => Promise<any>,
    setData: (data: any) => void,
    defaultDataFetch: () => Promise<any>,
    setResetPagination: ((reset: boolean) => void) | null = null,
    reverse: boolean = false // Added reverse parameter
) => {
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            try {
                if (query.trim()) {
                    const results = await fetchFunction(query);
                    if (results) {
                        const data = reverse ? results.reverse() : results; // Reverse data if reverse is true
                        setData(data);
                        if (setResetPagination) setResetPagination(true);
                    }
                } else {
                    const defaultData = await defaultDataFetch();
                    const data = reverse ? (defaultData || []).reverse() : defaultData || [];
                    setData(data);
                    if (setResetPagination) setResetPagination(false);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, fetchFunction, setData, defaultDataFetch, setResetPagination, reverse]);
};

export default useDebouncedSearch;
