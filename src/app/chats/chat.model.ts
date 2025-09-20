export interface ChatConversation {
  id: string;
  members: { id: string; nome: string; polo?: string }[];
  createdAt: any; // Date | Firebase Timestamp
  messages: ChatMessage[];
  title?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: any; // Date | Firebase Timestamp
  read?: boolean; // NOVO: indica se a mensagem já foi lida
}
