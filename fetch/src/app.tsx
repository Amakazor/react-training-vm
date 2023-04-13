import "./app.pcss";

import { RouteConfig, Router } from "common/src/components/router/router";
import React from "react";

import { WithFetch } from "./routes/1-fetch-data-with-fetch/with-fetch";
import { WithAxios } from "./routes/2-fetch-data-with-axios/with-axios";
import { WithTanStackQuery } from "./routes/3-tan-stack-query/with-tan-stack-query";
import { WithSwr } from "./routes/4-fetch-with-swr/with-swr";
import { ErrorsWithTryCatch } from "./routes/5-error-handling-with-try-catch/errors-with-try-catch";
import { ErrorWithBoundaries } from "./routes/6-error-handling-with-boundaries/error-with-boundaries";
import { FallbackWithSuspense } from "./routes/7-fallback-rendering-with-suspense/fallback-with-suspense";
import { SimpleStateMachine } from "./routes/8-simple-state-machine/simple-state-machine";
import { MaybeErrorMonad } from "./routes/9-maybe-error-monad/maybe-error-monad";

const routes: RouteConfig[] = [
    {
        path: "/1",
        component: () => <WithFetch/>,
    }, {
        path: "/2",
        component: () => <WithAxios/>,
    }, {
        path: "/3",
        component: () => <WithTanStackQuery/>,
    }, {
        path: "/4",
        component: () => <WithSwr/>,
    }, {
        path: "/5",
        component: () => <ErrorsWithTryCatch/>,
    }, {
        path: "/6",
        component: () => <ErrorWithBoundaries/>,
    }, {
        path: "/7",
        component: () => <FallbackWithSuspense/>,
    }, {
        path: "/8",
        component: () => <SimpleStateMachine/>,
    }, {
        path: "/9",
        component: () => <MaybeErrorMonad/>,
    },
];

function App() {
    return (
        <Router routes={routes}/>
    );
}

export default App;
