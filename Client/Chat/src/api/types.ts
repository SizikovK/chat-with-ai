export type AllChatAPIResponse = {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

type Role = 'ai' | 'user' | 'system';

export type ChatHistoryResponse = {
  id: string
  chat_id: string
  user_id: string
  message_index: number
  role: Role
  content: string
  created_at: string
}