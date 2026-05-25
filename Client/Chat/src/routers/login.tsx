import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAppDispatch } from "../store/hooks";
import { setAuth } from "../store/slices/authSlice";
import { save_stored_user } from "../auth/localAuth";

function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError("Заполни email и пароль");
            return
        }
        try {
            setLoading(true);
            setError(null);
            const user = await authApi.login({
                email: email.trim(),
                password,
            });
            save_stored_user(user);
            dispatch(setAuth(user));
            navigate("/chats");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось войти");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-card">
            <h2>Вход</h2>
            <form className="auth-form" onSubmit={onSubmit}>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </label>
                <label>
                    Пароль
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="qwerty123"
                    />
                </label>
                {error ? <p>{error}</p> : null}
                <button type="submit" disabled={loading}>Войти</button>
            </form>
            <p>Нет аккаунта? <Link to="/register">Регистрация</Link></p>
        </section>
    );
}

export default Login;
