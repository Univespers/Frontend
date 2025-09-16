import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChatConversation, ChatMessage } from './chat.model';
import { chatMock } from './chat-mock';

// import { Firestore, collection, addDoc, doc, setDoc } from '@angular/fire/firestore'; // 👈 futuro Firebase
// import { collectionData } from '@angular/fire/firestore'; // 👈 quando for buscar dados em tempo real
// import { serverTimestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private useMock = true; // TODO: trocar para false quando conectar no Firebase

  constructor(
    // private firestore: Firestore // 👈 futuro Firebase
  ) {}

  /** Lista conversas de um usuário */
  getConversations(userId: string): Observable<ChatConversation[]> {
    if (this.useMock) {
      // Retorna todas as conversas do mock
      return of(chatMock.conversations);
    }

    // 🔹 Firebase (exemplo futuro)
    // const conversationsRef = collection(this.firestore, 'conversations');
    // return collectionData(conversationsRef, { idField: 'id' }) as Observable<ChatConversation[]>;

    return of([]); // fallback vazio
  }

  /** Obtém mensagens de uma conversa */
  getMessages(conversationId: string): Observable<ChatMessage[]> {
    if (this.useMock) {
      const conv = chatMock.conversations.find(c => c.id === conversationId);
      return of(conv ? conv.messages : []);
    }

    // 🔹 Firebase
    // const messagesRef = collection(this.firestore, `conversations/${conversationId}/messages`);
    // return collectionData(messagesRef, { idField: 'id' }) as Observable<ChatMessage[]>;

    return of([]); // fallback vazio
  }

  /** Envia mensagem */
  sendMessage(conversationId: string, message: ChatMessage): Observable<ChatMessage> {
    if (this.useMock) {
      const conv = chatMock.conversations.find(c => c.id === conversationId);
      if (conv) {
        conv.messages.push(message);
      }
      return of(message);
    }

    // 🔹 Firebase
    // const messagesRef = collection(this.firestore, `conversations/${conversationId}/messages`);
    // return from(addDoc(messagesRef, { ...message, timestamp: serverTimestamp() }));

    return of(message);
  }

  /** Cria nova conversa */
  createConversation(members: { id: string; nome: string }[]): Observable<ChatConversation> {
    if (this.useMock) {
      const newConv: ChatConversation = {
        id: `conv_${Date.now()}`,
        members,
        createdAt: new Date(),
        messages: []
      };
      chatMock.conversations.push(newConv);
      return of(newConv);
    }

    // 🔹 Firebase
    // const convRef = doc(collection(this.firestore, 'conversations'));
    // await setDoc(convRef, { members, createdAt: serverTimestamp() });

    return of({} as ChatConversation);
  }
}
