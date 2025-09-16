import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { debounceTime, Observable, startWith, switchMap, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColleagueEndpointService, ColleagueResponse } from '../../../endpoints/colleague-endpoint.service';
import { ChatService } from '../../../chats/chat.service';
import { chatMock } from '../../../chats/chat-mock';
import { ChatConversation, ChatMessage } from '../../../chats/chat.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    CommonModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  searchControl = new FormControl('');
  filteredUsers$: Observable<ColleagueResponse[]> | undefined;

  conversations$: Observable<ChatConversation[]> | undefined;
  filteredConversations$: Observable<ChatConversation[]> | undefined; // NOVO: conversas filtradas

  selectedConversation: ChatConversation | null = null;
  messages$: Observable<ChatMessage[]> | undefined;

  currentFilter: 'all' | 'unread' | 'group' = 'all';
  private filterSubject = new BehaviorSubject<'all' | 'unread' | 'group'>('all');

  constructor(
    private colleagueService: ColleagueEndpointService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    // 🔹 Busca de usuários
    this.filteredUsers$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => this.searchUsers(value || ''))
    );

    // 🔹 Conversas mockadas
    this.conversations$ = this.chatService.getConversations('uuid123');

    // 🔹 Combina busca e filtro
    this.filteredConversations$ = combineLatest([
      this.conversations$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.filterSubject.asObservable()
    ]).pipe(
      map(([convs, searchTerm, filter]) => {
        let filtered = convs;

        // Busca por nome do membro
        if (searchTerm) {
          filtered = filtered.filter(conv =>
            conv.members.some(m => m.nome.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }

        // Filtro por tipo
        if (filter === 'unread') {
          filtered = filtered.filter(conv =>
            conv.messages.some(msg => msg.senderId !== 'uuid123' && !msg.read)
          );
        } else if (filter === 'group') {
          filtered = filtered.filter(conv => conv.members.length > 2);
        }

        return filtered;
      })
    );
  }

  setFilter(filter: 'all' | 'unread' | 'group') {
    this.currentFilter = filter;
    this.filterSubject.next(filter);
  }

  openConversation(conv: ChatConversation) {
    this.selectedConversation = conv;

    // 🔹 Marca mensagens não lidas como lidas
    conv.messages.forEach(msg => {
      if (msg.senderId !== 'uuid123' && !msg.read) {
        msg.read = true; // marca como lida
        // Se fosse Firebase, aqui você faria update do campo 'read' no banco
        // this.chatService.markMessageAsRead(conv.id, msg.id).subscribe();
      }
    });

    // Atualiza as mensagens exibidas
    this.messages$ = this.chatService.getMessages(conv.id);

    // Para que o filtro "Não lidos" se atualize, emitimos novamente as conversas
    if (this.conversations$) {
      // Forçamos a atualização do filteredConversations$
      this.conversations$ = of(chatMock.conversations); // mock
    }
  }

  sendMessage(text: string) {
    if (!this.selectedConversation) return;
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'uuid123',
      text,
      timestamp: new Date(),
      read: true // a própria pessoa que envia já leu
    };
    this.chatService.sendMessage(this.selectedConversation.id, msg).subscribe(() => {
      this.messages$ = this.chatService.getMessages(this.selectedConversation!.id);
    });
  }

  getSenderName(senderId: string): string {
    if (!this.selectedConversation) return 'Desconhecido';
    const member = this.selectedConversation.members.find(m => m.id === senderId);
    return member ? member.nome : 'Desconhecido';
  }

  searchUsers(term: string): Observable<ColleagueResponse[]> {
    // MOCK
    return of([
      { uuid: 'uuid123', nome: 'Aluno1', curso: 'Curso1', polo: 'Polo1' },
      { uuid: 'uuid456', nome: 'Aluno2', curso: 'Curso2', polo: 'Polo2' },
      { uuid: 'uuid789', nome: 'Aluno3', curso: 'Curso3', polo: 'Polo2' },
    ]);
  }

  getConversationTitle(conv: ChatConversation): string {
    if (conv.members.length === 2) {
      // conversa privada → pega o outro usuário
      const other = conv.members.find(m => m.id !== 'uuid123');
      return other ? `[${other.polo || 'Sem polo'}] - ${other.nome}` : 'Conversa';
    } else {
      // grupo
      const names = conv.members
        .filter(m => m.id !== 'uuid123')
        .map(m => m.nome.split(' ')[0]); // só primeiro nome

      if (conv.title) {
        return `[${conv.title}] - ${names.join(', ')}`;
      }

      return 'Grupo: ' + names.join(', ');
    }
  }

  getLastMessage(conv: ChatConversation): string {
    if (conv.messages.length === 0) return 'Sem mensagens ainda';
    const last = conv.messages[conv.messages.length - 1];
    return last.text;
  }

}
