export type StoredUser = {
    id: string;
    nickname: string;
    email: string;
};

const USER_ID_KEY = "user_id";
const NICKNAME_KEY = "nickname";
const EMAIL_KEY = "email";

export const get_stored_user = (): StoredUser | null => {
    const id = localStorage.getItem(USER_ID_KEY);
    const nickname = localStorage.getItem(NICKNAME_KEY);
    const email = localStorage.getItem(EMAIL_KEY);

    if (!id || !nickname || !email) {
        return null;
    }

    return { id, nickname, email };
};

export const get_stored_user_id = (): string | null => {
    return localStorage.getItem(USER_ID_KEY);
};

export const save_stored_user = (user: StoredUser): void => {
    localStorage.setItem(USER_ID_KEY, user.id);
    localStorage.setItem(NICKNAME_KEY, user.nickname);
    localStorage.setItem(EMAIL_KEY, user.email);
};

export const clear_stored_user = (): void => {
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(NICKNAME_KEY);
    localStorage.removeItem(EMAIL_KEY);
};
