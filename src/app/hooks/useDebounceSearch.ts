import { useEffect } from "react";

const useDebouncedSearch = (
    query: string,
    fetchFunction: (query: string) => Promise<any>,
    setData: (data: any) => void,
    defaultDataFetch: () => Promise<any>,
    setResetPagination: ((reset: boolean) => void) | null = null
    ) => {
        useEffect(() => {
            const delayDebounceFn = setTimeout(async () => {
                if (query.trim()) {
                    try {
                        const results = await fetchFunction(query);
                        if (results) {
                            setData(results);
                            if (setResetPagination) setResetPagination(true); // Reset pagination flag if setResetPagination is not null
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                } else {
                    const defaultData = await defaultDataFetch();
                    setData(defaultData || []);
                    if (setResetPagination) setResetPagination(false); // Reset pagination flag if setResetPagination is not null
                }
            },1000);

            return () => clearTimeout(delayDebounceFn);
        }, [query, fetchFunction, setData, defaultDataFetch, setResetPagination]);
};

export default useDebouncedSearch;