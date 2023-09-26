import axios from "axios";
import { useEffect, useState } from "react";

type CatFact = {
    fact: string;
    length: number;
}
async function fetchCatFact():Promise<CatFact> {
    return (await axios.get<CatFact>("https://catfact.ninja/fact")).data;
}

export const WithAxios = () => {
    const [catFact, setCatFact] = useState<CatFact | undefined>();

    useEffect(() => {
        const fetch = async () => {
            const data = await fetchCatFact();
            setCatFact?.(data);
        };
        fetch();
    }, []);

    return (
        <div>
            <button type={"button"} onClick={async () => setCatFact(await fetchCatFact())}>Refetch Cat Fact!</button>
            <div>
                Todays cat fact is: {catFact?.fact ?? "No cat fact :/"}
            </div>
        </div>
    );
};
