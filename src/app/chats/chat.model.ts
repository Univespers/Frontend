export interface ChatConversation {
  id: string;
  members: { id: string; nome: string }[];
  createdAt: any; // Date | Firebase Timestamp
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: any; // Date | Firebase Timestamp
}
