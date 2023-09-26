import { useEffect, useState } from "react";
import { QueryClient, useQueryClient } from "react-query";

export const MaybeErrorMonad = () => {
    const [data, setData] = useState<MaybeErrorMonad2<string>>(new MaybeErrorMonad2<string>(null));

    const queryClient = useQueryClient();

    useEffect(() => {
        const fun = async () => {
            new MaybeErrorMonad2("https://swapi.dev/api/people/1")
                .flatMap<string>((query) => monadicFetch<string>(queryClient, query))
                .then(personData => personData.flatMap<string>(pData => assertNotEmpty(JSON.parse(pData).starships[0])))
                .then(starshipUrl => starshipUrl.flatMap<string>(url => monadicFetch<string>(queryClient, url)))
                .then(starshipData => starshipData.flatMap<string>(sData => assertNotEmpty(JSON.parse(sData).manufacturer)))
                .then(setData);
        };
        fun();
    }, []);

    const component = data.match({
        some: (str) => <div>{str}</div>,
        none: () => <div>There is nothing</div>,
        error: (e) => <div>{e.message.toString()}</div>,
    });

    return (
        <>{component}</>
    );
};

function assertNotEmpty<T>(
    data:T,
):NonNullable<T> {
    if (data === null || data === undefined) throw new Error("Assertion failed: empty");
    return data;
}

async function monadicFetch<T>(
    queryClient: QueryClient,
    query: string,
): Promise<MaybeErrorMonad2<T>> {
    const data = await queryClient.fetchQuery<any, any, T>(query, () => fetch(query).then(res => res.text())).catch((e => e));
    return new MaybeErrorMonad2<T>(data);
}

interface Monad<T> {
    flatMap<R>(transformer: flatMapLambda<NonNullable<T>, NonNullable<R>, Monad<NonNullable<R>>>): Promise<Monad<R>>
}

type flatMapLambda<T, R, G extends Monad<R>> = (inner: T) => Promise<R> | Promise<G>

type MaybeErrorMonadMatcher<T, S, N, E> = {
    some: (some: T) => S
    none: (none: null | undefined) => N;
    error: (error: Error) => E;
}

class MaybeErrorMonad2<T> implements Monad<T> {
    private inner: NonNullable<T> | null | undefined | Error;

    constructor(inner: NonNullable<T> | null | undefined | Error) {
        this.inner = inner;
    }

    public async flatMap<R>(transformer: flatMapLambda<NonNullable<T>, NonNullable<R>, MaybeErrorMonad2<R>>):Promise<MaybeErrorMonad2<R>> {
        if (MaybeErrorMonad2.isSome(this.inner)) {
            try {
                const data = await transformer(this.inner);
                return data instanceof MaybeErrorMonad2 ? data : new MaybeErrorMonad2<R>(data);
            } catch (e) {
                return new MaybeErrorMonad2<R>(e as Error);
            }
        }

        return new MaybeErrorMonad2<R>(this.inner);
    }

    public match<S, N, E>(matcher: MaybeErrorMonadMatcher<T, S, N, E>) {
        if (MaybeErrorMonad2.isSome(this.inner)) return matcher.some(this.inner);
        if (MaybeErrorMonad2.isError(this.inner)) return matcher.error(this.inner);
        return matcher.none(this.inner);
    }

    public static isSome<G>(data: NonNullable<G> | null | undefined | Error): data is NonNullable<G> {
        return data !== undefined && data !== null && !(data instanceof Error);
    }

    public static isNone<G>(data: NonNullable<G> | null | undefined | Error): data is undefined | null {
        return data === undefined || data === null;
    }

    public static isError<G>(data: NonNullable<G> | null | undefined | Error): data is Error {
        return data instanceof Error;
    }
}
