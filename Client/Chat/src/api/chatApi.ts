import { HTTPClient } from './HTTPClient'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'
const DEMO_USER_ID = 'demo-user'

const httpClient = new HTTPClient(API_BASE_URL)

export type ChatDto = {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export const chatApi = {
  getAllChats(userId: string = DEMO_USER_ID): Promise<ChatDto[]> {
    return httpClient.request<undefined, ChatDto[]>('GET', `/users/${userId}/chats`)
  },
}
