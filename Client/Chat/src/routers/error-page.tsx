import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();
    let message = "404 Not Found";

    if (isRouteErrorResponse(error)) {
        message = `${error.status} ${error.statusText}`
    } else if (error instanceof Error) {
        message = error.message
    }

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p><i>{message}</i></p>
        </div>
    );
}

export default ErrorPage
