import { describe, it, expect, vi, beforeEach } from "vitest";
import { chatApi } from "./chatApi";
import { get_stored_user_id } from "../auth/localAuth";

const { requestMock } = vi.hoisted(() => ({
    requestMock: vi.fn()
}));

vi.mock("../auth/localAuth", () => ({
    get_stored_user_id: vi.fn()
}));

vi.mock("./HTTPClient", () => ({
    HTTPClient: class {
        request = requestMock;
    }
}));

describe("chatApi.sendMessage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("вызывает request с правильными аргументами", async () => {
        vi.mocked(get_stored_user_id).mockReturnValue("user-1");
        requestMock.mockResolvedValue({ chat_id: "chat-1", content: "hello" });

        await expect(chatApi.sendMessage("chat-1", "test")).resolves.toEqual({
            chat_id: "chat-1",
            content: "hello"
        });

        expect(requestMock).toHaveBeenCalledWith(
            "POST",
            "/chats/chat-1/messages",
            { "User-Id": "user-1" },
            { message: "test" }
        );
    });

    it("бросает ошибку, если user_id отсутствует", () => {
        vi.mocked(get_stored_user_id).mockReturnValue(null);

        expect(() => chatApi.sendMessage("chat-1", "test")).toThrow("Пользователь не авторизован");
        expect(requestMock).not.toHaveBeenCalled();
    });
});
