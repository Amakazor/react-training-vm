import { useEffect, useState } from "react";

type CatFact = {
    fact: string;
    length: number;
}

const fetchAndSetCatFact = (setter: any):Promise<CatFact> => fetch("https://catfact.ninja/fact").then((data) => data.json()).then(json => setter(json.fact)) as Promise<CatFact>;

export const WithFetch = () => {
    const [catFact, setCatFact] = useState<string | undefined>();

    useEffect(() => {
        fetchAndSetCatFact(setCatFact);
    }, []);

    return (
        <div>
            <button type={"button"} onClick={() => fetchAndSetCatFact(setCatFact)}>Refetch Cat Fact!</button>
            <div>
            Todays cat fact is: {catFact ?? "No cat fact :/"}
            </div>
        </div>
    );
};
