import { useQuery, useQueryClient } from "react-query";

type CatFact = {
    fact: string;
    length: number;
}

export const WithTanStackQuery = () => {
    const queryClient = useQueryClient();

    const { isLoading, data, error } = useQuery<any, any, CatFact>(["catFact", 1], () => fetch("https://catfact.ninja/fact").then(res => res.json()), { refetchOnWindowFocus: false });

    if (isLoading) return <>...</>;
    if ((error !== undefined && error !== null)) return <>{(error as Error).message ?? "Error has occured"}</>;

    return (
        <div>
            <button type={"button"} onClick={() => queryClient.invalidateQueries(["catFact"])}>Fetch new cat fact!</button>
            <div>Todays cat fact is: {data?.fact ?? "No cat fact :/"}</div>
        </div>
    );
};
