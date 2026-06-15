const initGlobalErrorHandling = () => {
    // Catches synchronous errors
    window.onerror = (message, source, lineno, colno, error) => {
        console.error("[Global Error]", { message, source, lineno, error });
        // swap console.error for Sentry.captureException(error) later if needed
        return true;
    };

    // Catches unhandled promise rejections (fetch failures, microservice calls, etc.)
    window.addEventListener("unhandledrejection", (event) => {
        console.error("[Unhandled Promise Rejection]", event.reason);
        event.preventDefault();
    });
};

export default initGlobalErrorHandling;