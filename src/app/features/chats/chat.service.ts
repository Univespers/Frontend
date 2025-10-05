import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, from, map, switchMap, merge, forkJoin  } from 'rxjs';
import { Firestore, collection, addDoc, doc, setDoc } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { serverTimestamp, updateDoc } from 'firebase/firestore';

import { ChatConversation, ChatMessage } from './chat.model';
import { chatMock } from './chat-mock';
import { CurrentStatus } from 'src/app/current-status';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // NOVO: BehaviorSubject para atualizar lista de conversas
  private conversationsSubject = new BehaviorSubject<ChatConversation[]>(chatMock.conversations);
  conversations$ = this.conversationsSubject.asObservable();

  constructor(
    private firestore: Firestore
  ) {}

  /** Lista conversas de um usuário */
  getConversations(userId: string): Observable<ChatConversation[]> {
    if (CurrentStatus.MOCK.CHAT) {
      return this.conversations$; // ALTERADO: retorna BehaviorSubject para manter updates
    }

    // 🔹 Firebase
    const conversationsRef = collection(this.firestore, `chats/${userId}/conversations`);
    return collectionData(conversationsRef, { idField: 'id' }) as Observable<ChatConversation[]>;
  }

  /** Obtém mensagens de uma conversa */
  getMessages(userId: string, conversationId: string): Observable<ChatMessage[]> {
    if (CurrentStatus.MOCK.CHAT) {
      const conv = chatMock.conversations.find(c => c.id === conversationId);
      return of(conv ? conv.messages : []);
    }

    // 🔹 Firebase
    const messagesRef = collection(this.firestore, `chats/${userId}/conversations/${conversationId}/messages`);
    return collectionData(messagesRef, { idField: 'id' }) as Observable<ChatMessage[]>;
  }

  /** Envia mensagem */
  sendMessage(userId: string, conversationId: string, message: ChatMessage): Observable<ChatMessage> {
    if (CurrentStatus.MOCK.CHAT) {
      const conv = chatMock.conversations.find(c => c.id === conversationId);
      if (conv) {
        conv.messages.push(message);
      }
      return of(message);
    }

    // 🔹 Firebase
    const messagesRef = collection(this.firestore, `chats/${userId}/conversations/${conversationId}/messages`);
    return from(addDoc(messagesRef, { ...message, timestamp: serverTimestamp() })).pipe(
      map(() => {
        return { ...message, timestamp: serverTimestamp() };
      })
    );
  }

   /** Cria nova conversa */
   createConversation(userId: string, members: { id: string; nome: string; polo?: string }[]): Observable<ChatConversation> {
    if (CurrentStatus.MOCK.CHAT) {
      const newConv: ChatConversation = {
        id: `conv_${Date.now()}`,
        members,
        createdAt: new Date(),
        messages: []
      };
      chatMock.conversations.push(newConv);
      this.conversationsSubject.next(chatMock.conversations); // NOVO: atualiza BehaviorSubject
      return of(newConv);
    }

    // 🔹 Firebase
    const creationDate = serverTimestamp();
    let userNewConvId: string;
    const allMemberConvs = members.map(member => {
      const convRef = doc(collection(this.firestore, `chats/${member.id}/conversations`));
      if (member.id === userId) userNewConvId = convRef.id;
      return from(setDoc(convRef, { members, createdAt: creationDate }));
    });
    return forkJoin(allMemberConvs).pipe(
      map(() => {
        return { id: userNewConvId, messages: [], members, createdAt: creationDate };
      })
    );
  }

  markMessageAsRead(userId: string, conversationId: string, messageId: string): Observable<void> {
    if (CurrentStatus.MOCK.CHAT) {
      const conv = chatMock.conversations.find(c => c.id === conversationId);
      if (conv) {
        const msg = conv.messages.find(m => m.id === messageId);
        if (msg) msg.read = true;
      }
      return of();
    }

    // 🔹 Firebase
    const msgRef = doc(this.firestore, `chats/${userId}/conversations/${conversationId}/messages/${messageId}`);
    return from(updateDoc(msgRef, { read: true }));
  }

}


