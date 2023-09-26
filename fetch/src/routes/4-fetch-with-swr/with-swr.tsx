import useSwr from "swr";

export const WithSwr = () => {

    const { data, error, isLoading, mutate } = useSwr("catFact", () => fetch("https://catfact.ninja/fact").then(res => res.json()));

    if (isLoading) return <>...</>;
    if ((error !== undefined && error !== null)) return <>{(error as Error).message ?? "Error has occured"}</>;

    return (
        <div>
            <button type={"button"} onClick={() => mutate()}>Fetch new cat fact!</button>
            <div>Todays cat fact is: {data?.fact ?? "No cat fact :/"}</div>
        </div>
    );
};
