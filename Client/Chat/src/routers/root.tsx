import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clear_stored_user, get_stored_user } from "../auth/localAuth";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearAuth, restoreAuth } from "../store/slices/authSlice";

function Root() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const is_logged_in = useAppSelector((state) => state.auth.isAuthenticated);
    const nickname = useAppSelector((state) => state.auth.user?.nickname) ?? "User";

    useEffect(() => {
        dispatch(restoreAuth(get_stored_user()));
    }, [dispatch]);

    const onLogout = () => {
        clear_stored_user();
        dispatch(clearAuth());
        navigate("/login");
    };

    return (
        <div className="app-shell">
            <header className="app-header">
                <Link to="/" className="brand-link">Neuro Chat</Link>

                <div className="header-actions">
                    {is_logged_in ? (
                        <>
                            <div className="user-badge">
                                <Link to="/profile" className="user-name">{nickname}</Link>
                            </div>
                            <button
                                type="button"
                                className="header-action-link"
                                onClick={onLogout}
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="header-action-link">Вход</Link>
                            <Link to="/register" className="header-action-link">Регистрация</Link>
                        </>
                    )}
                </div>
            </header>
            <main className="page">
                <Outlet />
            </main>
        </div>
    );
}

export default Root