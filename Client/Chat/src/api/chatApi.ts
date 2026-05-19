import { HTTPClient } from './HTTPClient'
import type { AllChatAPIResponse, ChatHistoryResponse } from './types'

const API_BASE_URL = import.meta.env.API_BASE_URL ?? 'http://127.0.0.1:8000'
const DEMO_USER_ID = '6a088508e715423a43e69f4c'
const DEMO_CHAT_ID = 'f9eaa20d735b4b469141c1f90e01237d'

const httpClient = new HTTPClient(API_BASE_URL)

export const chatApi = {
  getAllChats(user_id: string = DEMO_USER_ID): Promise<AllChatAPIResponse[]> {
    return httpClient.request<undefined, AllChatAPIResponse[]>('GET', `/users/${user_id}/chats`)
  },
  getChatHistory(user_id: string = DEMO_USER_ID, chat_id: string = DEMO_CHAT_ID): Promise<ChatHistoryResponse[]> {
    return httpClient.request<undefined, ChatHistoryResponse[]>('GET', `/users/${user_id}/chats/${chat_id}/messages`)
  },
}
