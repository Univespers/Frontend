import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, from, map, switchMap, merge, forkJoin  } from 'rxjs';
import { Firestore, collection, addDoc, doc, setDoc } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { query, serverTimestamp, updateDoc, where } from 'firebase/firestore';

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
    const conversationsRef = query(collection(this.firestore, `conversations`), where(`membersSet.${userId}`, "!=", null));
    return (collectionData(conversationsRef, { idField: 'id' }).pipe(
      map(convs => {
        return convs.map(conv => {
          // De Set para Lista
          conv["members"] = Object.values(conv["membersSet"]);
          return conv;
        });
      })
    )) as Observable<ChatConversation[]>;
  }

  /** Obtém mensagens de uma conversa */
  getMessages(userId: string, conversationId: string): Observable<ChatMessage[]> {
    if (CurrentStatus.MOCK.CHAT) {
      const conv = chatMock.conversations.find(c => c.id === conversationId);
      return of(conv ? conv.messages : []);
    }

    // 🔹 Firebase
    const messagesRef = collection(this.firestore, `conversations/${conversationId}/messages`);
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
    const messagesRef = collection(this.firestore, `conversations/${conversationId}/messages`);
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
    const convRef = doc(collection(this.firestore, `conversations`));
    // De Lista para Set
    const membersSet = members.reduce((membersSet: {[index: string]:any}, member) => {
      membersSet[member.id] = member;
      return membersSet;
    }, {});
    return from(setDoc(convRef, { membersSet, createdAt: creationDate })).pipe(
      map(() => {
        return { id: convRef.id, messages: [], members, createdAt: creationDate };
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
    const msgRef = doc(this.firestore, `conversations/${conversationId}/messages/${messageId}`);
    return from(updateDoc(msgRef, { read: true }));
  }

}


