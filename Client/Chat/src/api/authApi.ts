import { HTTPClient } from "./HTTPClient";
import { get_stored_user_id } from "../auth/localAuth";
import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, UpdateUserRequest, UpdateUserResponse } from "./types";

const API_BASE_URL = "http://127.0.0.1:8000"
const httpClient = new HTTPClient(API_BASE_URL)

const get_user_id = (): string => {
    const user_id = get_stored_user_id();
    if (!user_id) {
        throw new Error("Пользователь не авторизован");
    }
    return user_id;
};

const user_header = (user_id: string) => ({ "User-Id": user_id });

export const authApi = {
    register(body: RegisterRequest): Promise<RegisterResponse> {
        return httpClient.request<RegisterRequest, RegisterResponse>(
            "POST",
            "/auth/register",
            undefined,
            body
        )
    },
    login(body: LoginRequest): Promise<LoginResponse> {
        return httpClient.request<LoginRequest, LoginResponse>(
            "POST",
            "/auth/login",
            undefined,
            body
        )
    },
    updateUser(body: UpdateUserRequest): Promise<UpdateUserResponse> {
        const user_id = get_user_id();
        return httpClient.request<UpdateUserRequest, UpdateUserResponse>(
            "PATCH",
            `/users/${user_id}`,
            user_header(user_id),
            body
        )
    }
};
