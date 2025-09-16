import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { debounceTime, map, Observable, startWith, switchMap, of } from 'rxjs';
import { ColleagueEndpointService, ColleagueListResponse, ColleagueResponse } from '../../../endpoints/colleague-endpoint.service';
import { ChatService } from '../../../chats/chat.service';
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
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  searchControl = new FormControl('');
  filteredUsers$: Observable<ColleagueResponse[]> | undefined;
  conversations$: Observable<ChatConversation[]> | undefined;
  selectedConversation: ChatConversation | null = null;
  messages$: Observable<ChatMessage[]> | undefined;

  constructor(
    private colleagueService: ColleagueEndpointService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    /** 🔹 Busca usuários (mock ou API real futuramente) */
    this.filteredUsers$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => this.searchUsers(value || ''))
    );

    /** 🔹 Conversas mockadas */
    this.conversations$ = this.chatService.getConversations('uuid123');
  }

  searchUsers(term: string): Observable<ColleagueResponse[]> {
    // return this.colleagueService.searchColleagues(term, 1).pipe(
    //   map((res: ColleagueListResponse) => res.lista)
    // );

    /** 🔹 MOCK */
    return of([
      { uuid: 'uuid123', nome: 'Aluno1', curso: 'Curso1', polo: 'Polo1' },
      { uuid: 'uuid456', nome: 'Aluno2', curso: 'Curso2', polo: 'Polo2' },
    ]);
  }

  openConversation(conv: ChatConversation) {
    this.selectedConversation = conv;
    this.messages$ = this.chatService.getMessages(conv.id);
  }

  sendMessage(text: string) {
    if (!this.selectedConversation) return;
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'uuid123',
      text,
      timestamp: new Date()
    };
    this.chatService.sendMessage(this.selectedConversation.id, msg).subscribe(() => {
      // Atualiza a lista de mensagens após enviar
      this.messages$ = this.chatService.getMessages(this.selectedConversation!.id);
    });
  }

  getSenderName(senderId: string): string {
    if (!this.selectedConversation) return 'Desconhecido';
    const member = this.selectedConversation.members.find(m => m.id === senderId);
    return member ? member.nome : 'Desconhecido';
  }
}
