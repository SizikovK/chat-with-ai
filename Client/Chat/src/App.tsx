import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import Root from "./routers/root";
import ErrorPage from "./routers/error-page";
import Chat from "./routers/chat";
import Login from "./routers/login";
import Home from "./routers/home";
import Register from "./routers/register";
import Profile from "./routers/profile"
import ProtectedRoute from "./routers/RequireAuth";
import { store } from "./store/store";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home/> },
            { path: "login", element: <Login/> },
            { path: "register", element: <Register/> },
            { path: "404", element: <ErrorPage/> },
            {
                path: "chats",
                element: (
                    <ProtectedRoute>
                        <Chat/>
                    </ProtectedRoute>
                )
            },
            {
                path: "chats/:chatId",
                element: (
                    <ProtectedRoute>
                        <Chat/>
                    </ProtectedRoute>
                )
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <Profile/>
                    </ProtectedRoute>
                )
            },
            { path: "*", element: <ErrorPage/> }
        ]
    }
]);

function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

export default App
