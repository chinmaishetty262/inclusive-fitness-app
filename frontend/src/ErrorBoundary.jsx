import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        console.error("[React Error Boundary]", error, info);
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong. Please refresh the page.</h2>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;