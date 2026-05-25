export type AllChatAPIResponse = {
    id: string
    user_id: string
    title: string
    created_at: string
    updated_at: string
}

type Role = "ai" | "user" | "system"

export type ChatHistoryResponse = {
    id: string
    chat_id: string
    user_id: string
    message_index: number
    role: Role
    content: string
    created_at: string
}

export type MessageType = {
    message: string
}

export type ModelResponseType = {
    chat_id: string
    content: string
}


export type RegisterRequest = {
    nickname: string
    email: string
    password: string
}

export type RegisterResponse = {
    id: string
}

export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    id: string
    nickname: string
    email: string
}


export type UpdateUserRequest = {
    nickname?: string
    password?: string
}

export type UpdateUserResponse = {
    id: string
    nickname: string
    email: string
    updated: boolean
}
