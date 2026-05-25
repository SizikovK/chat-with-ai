import { useState } from "react";
import { authApi } from "../api/authApi";
import { get_stored_user, save_stored_user } from "../auth/localAuth";
import { useAppDispatch } from "../store/hooks";
import { setAuth } from "../store/slices/authSlice";

function Profile() {
    const dispatch = useAppDispatch();
    const stored_user = get_stored_user();

    const [nickname, setNickname] = useState(stored_user?.nickname ?? "");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const trimmed_nickname = nickname.trim();
        const body: { nickname?: string; password?: string } = {};

        if (!trimmed_nickname) {
            setError("Имя не должно быть пустым");
            return;
        }

        if (stored_user?.nickname !== trimmed_nickname) {
            body.nickname = trimmed_nickname;
        }

        if (password || confirm_password) {
            if (password.length < 8) {
                setError("Пароль должен быть не короче 8 символов");
                return;
            }
            if (password !== confirm_password) {
                setError("Пароли не совпадают");
                return;
            }
            body.password = password;
        }

        if (!body.nickname && !body.password) {
            setError("Измени имя или пароль");
            return;
        }

        try {
            setLoading(true);
            const updated_user = await authApi.updateUser(body);
            save_stored_user(updated_user);
            dispatch(
                setAuth({
                    id: updated_user.id,
                    nickname: updated_user.nickname,
                    email: updated_user.email,
                }),
            );
            setPassword("");
            setConfirmPassword("");
            setSuccess("Профиль обновлен");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось обновить профиль");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-card profile-card">
            <h2>Профиль</h2>
            <form className="auth-form" onSubmit={onSubmit}>
                <label>
                    Имя
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </label>
                <label>
                    Новый пароль
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Новый пароль"
                    />
                </label>
                <label>
                    Повтори новый пароль
                    <input
                        type="password"
                        value={confirm_password}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="То что написали выше"
                    />
                </label>
                {error ? <p>{error}</p> : null}
                {success ? <p>{success}</p> : null}
                <button type="submit" disabled={loading}>Сохранить изменения</button>
            </form>
        </section>
    );
}

export default Profile