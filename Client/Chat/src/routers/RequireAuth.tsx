import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { get_stored_user_id } from "../auth/localAuth";

type ProtectedRouteProps = {
    children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();
    const user_id = get_stored_user_id();

    if (!user_id) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children;
}

export default ProtectedRoute