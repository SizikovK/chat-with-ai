import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

function Register() {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!nickname.trim() || !email.trim() || !password || !confirm_password) {
            setError("Заполни все поля")
            return
        }
        if (password.length < 8) {
            setError("Пароль должен быть не короче 8 символов")
            return
        }
        if (password !== confirm_password) {
            setError("Пароли не совпадают")
            return
        }
        try {
            setLoading(true);
            setError(null);
            await authApi.register({
                nickname: nickname.trim(),
                email: email.trim(),
                password,
            });
            navigate("/login");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось зарегистрироваться");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-card">
            <h2>Регистрация</h2>
            <form className="auth-form" onSubmit={onSubmit}>
                <label>
                    Имя
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Ваше имя"
                    />
                </label>
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
                        placeholder="Минимум 8 символов"
                    />
                </label>
                <label>
                    Повторите пароль
                    <input
                        type="password"
                        value={confirm_password}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="То что написали выше"
                    />
                </label>
                {error ? <p>{error}</p> : null}
                <button type="submit" disabled={loading}>Зарегистрироваться</button>
            </form>
            <p>Уже есть аккаунт? <Link to="/login">Вход</Link></p>
        </section>
    );
}

export default Register