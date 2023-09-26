import { Component, ComponentType, PropsWithChildren, PropsWithRef } from "react";

export const FallbackComponent = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
        <div>
            <div>{JSON.stringify(error)}</div>
            <button type={"button"} onClick={resetErrorBoundary}>Reset error!</button>
        </div>
    );
};

export const Throws = () => {
    if (Math.random() > 0.5) throw new Error("error message");

    return (
        <div>This works!</div>
    );
};

export const ErrorWithBoundaries = () => {
    return (
        <ErrorBoundary fallback={FallbackComponent}>
            <Throws/>
        </ErrorBoundary>
    );
};

export type FallbackProps = {
    error: any;
    resetErrorBoundary: () => void
}

type ErrorBoundaryState = {
    didCatch: boolean;
    error: any;
}

type ErrorBoundaryProps = {
    fallback: ComponentType<FallbackProps>
}

const initialState: ErrorBoundaryState = {
    didCatch: false,
    error: null,
};

export class ErrorBoundary extends Component<PropsWithRef<PropsWithChildren<ErrorBoundaryProps>>, ErrorBoundaryState> {
    state = initialState;

    static getDerivedStateFromError(error: Error) {
        return {
            didCatch: true,
            error,
        };
    }

    resetErrorBoundary = () => {
        this.setState(initialState);
    };

    // eslint-disable-next-line class-methods-use-this
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.info(error);
    }

    render() {
        if (this.state.didCatch) {
            return <this.props.fallback error={this.state.error} resetErrorBoundary={this.resetErrorBoundary}></this.props.fallback>;
        }

        return this.props.children;
    }
}
