import axios from "axios";
import { Suspense, useState } from "react";

import { ErrorBoundary, FallbackComponent } from "../6-error-handling-with-boundaries/error-with-boundaries";

export const FallbackWithSuspense = () => {
    return (
        <div>
            <ErrorBoundary fallback={FallbackComponent}>
                <Suspense fallback={<>Loading...</>}>
                    <ThrowsPromise/>
                </Suspense>
            </ErrorBoundary>
        </div>
    );
};

type ReadType<T> = {read: () => T | undefined}
type CatFact = {
    fact: string;
    length: number;
}

export const ThrowsPromise = () => {
    const [promise, setPromise] = useState<ReadType<CatFact>>();

    const cataFact = promise ? promise.read() : null;

    const onClick = () => {
        setPromise(suspensify(fetchCatFact()));
    };

    return (
        <div>
            <button type={"button"} onClick={onClick}>Fetch Cat Fact!</button>
            <div>{cataFact && cataFact.fact}</div>
        </div>
    );
};

async function fetchCatFact():Promise<CatFact> {
    const res = await Promise.all([
        axios.get<CatFact>("https://catfact.ninja/fact"),
        new Promise((resolve, reject) => setTimeout(() => Math.random() >= 0.5 ? resolve(true) : reject("Couldn't fetch a cat fact..."), 1000)),
    ]);

    return res[0].data;
}

// eslint-disable-next-line no-shadow
enum fetchingStatus {
    PENDING,
    ERROR,
    SUCCESS
}

export function suspensify<T>(promise: Promise<T>): ReadType<T> {
    let status = fetchingStatus.PENDING;
    let result: T;

    const suspender = promise.then(
        (res) => {
            status = fetchingStatus.SUCCESS;
            result = res;
        }, (error) => {
            status = fetchingStatus.ERROR;
            result = error;
        },
    );

    return {
        read() {
            switch (status) {
                case fetchingStatus.PENDING: {
                    throw suspender;
                }
                case fetchingStatus.ERROR: {
                    throw result;
                }
                case fetchingStatus.SUCCESS: {
                    return result;
                }
            }
        },
    };
}
