import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { debounceTime, Observable, startWith, switchMap, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColleagueEndpointService, ColleagueResponse } from '../../../endpoints/colleague-endpoint.service';
import { ChatService } from '../../../chats/chat.service';
import { chatMock } from '../../../chats/chat-mock';
import { ChatConversation, ChatMessage } from '../../../chats/chat.model';
import { PopupDialogMatComponent } from '../../../components/popup-dialog-mat/popup-dialog-mat.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    PopupDialogMatComponent,
    CommonModule,
    DatePipe // ✅ NOVO: Import do DatePipe para timestamp
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  searchControl = new FormControl('');
  filteredUsers$: Observable<ColleagueResponse[]> | undefined;

  conversations$: Observable<ChatConversation[]> | undefined;
  filteredConversations$: Observable<ChatConversation[]> | undefined;

  selectedConversation: ChatConversation | null = null;
  messages$: Observable<ChatMessage[]> | undefined;

  currentFilter: 'all' | 'unread' | 'group' = 'all';
  private filterSubject = new BehaviorSubject<'all' | 'unread' | 'group'>('all');

  placeholderText = 'Digite sua mensagem... (Alt+Enter para quebrar linha)';

  constructor(
    private colleagueService: ColleagueEndpointService,
    private chatService: ChatService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filteredUsers$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => this.searchUsers(value || ''))
    );

    this.conversations$ = this.chatService.getConversations('uuid123');

    this.filteredConversations$ = combineLatest([
      this.conversations$,
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(100)),
      this.filterSubject.asObservable().pipe(startWith(this.currentFilter))
    ]).pipe(
      map(([convs, searchTerm, filter]) => {
        return convs.filter(conv => {
          const hasSearchTerm = searchTerm && searchTerm.trim().length > 0;
          const passesSearch = !hasSearchTerm ||
            conv.members.some(m => m.nome.toLowerCase().includes(searchTerm.toLowerCase()));

          const hasFilter = filter !== 'all';
          let passesFilter = true;

          if (hasFilter) {
            if (filter === 'unread') {
              passesFilter = conv.messages.some(msg => msg.senderId !== 'uuid123' && !msg.read);
            } else if (filter === 'group') {
              passesFilter = conv.members.length > 2;
            }
          }

          return passesSearch && passesFilter;
        });
      })
    );
  }

  displayFn(user: ColleagueResponse): string {
    return user ? user.nome : '';
  }

  setFilter(filter: 'all' | 'unread' | 'group') {
    this.currentFilter = filter;
    this.filterSubject.next(filter);
  }

  openConversation(conv: ChatConversation) {
    this.selectedConversation = conv;

    conv.messages.forEach(msg => {
      if (msg.senderId !== 'uuid123' && !msg.read) {
        msg.read = true;
      }
    });

    this.messages$ = this.chatService.getMessages(conv.id);
  }

  // NOVO: Método para obter polo e nome formatado
  getSenderPoloAndName(senderId: string): string {
    if (senderId === 'uuid123') {
      return 'Você';
    }

    if (!this.selectedConversation) return 'Desconhecido';

    const member = this.selectedConversation.members.find(m => m.id === senderId);
    if (!member) return 'Desconhecido';

    return `[${member.polo || 'Sem polo'}] - ${member.nome}`;
  }

  onMessageKeydown(event: KeyboardEvent, textarea: HTMLTextAreaElement) {
    if (event.altKey && event.key === 'Enter') {
      event.preventDefault();
      this.insertLineBreak(textarea);
    }
    else if (event.key === 'Enter' && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      this.sendMessageFromTextarea(textarea);
    }
  }

  private insertLineBreak(textarea: HTMLTextAreaElement) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    textarea.value = textarea.value.substring(0, start) + '\n' + textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    this.adjustTextareaHeight(textarea);
  }

  adjustTextareaHeight(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    const maxHeight = 120;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = newHeight + 'px';
    textarea.style.overflowY = newHeight >= maxHeight ? 'auto' : 'hidden';
  }

  sendMessageFromTextarea(textarea: HTMLTextAreaElement) {
    const text = textarea.value.trim();
    if (!this.selectedConversation || !text) return;

    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'uuid123',
      text: text,
      timestamp: new Date(),
      read: true
    };

    this.chatService.sendMessage(this.selectedConversation.id, msg).subscribe(() => {
      this.messages$ = this.chatService.getMessages(this.selectedConversation!.id);
      textarea.value = '';
      this.adjustTextareaHeight(textarea);
    });
  }

  sendMessage(text: string) {
    if (!this.selectedConversation || !text.trim()) return;

    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'uuid123',
      text: text.trim(),
      timestamp: new Date(),
      read: true
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
    return of([
      { uuid: 'uuid123', nome: 'Aluno1', curso: 'Curso1', polo: 'Polo1' },
      { uuid: 'uuid456', nome: 'Aluno2', curso: 'Curso2', polo: 'Polo2' },
      { uuid: 'uuid789', nome: 'Aluno3', curso: 'Curso3', polo: 'Polo2' },
      { uuid: 'uuid999', nome: 'Aluno4', curso: 'Curso3', polo: 'Polo1' }
    ]);
  }

  onUserSelected(user: ColleagueResponse) {
    const existingConv = chatMock.conversations.find(c =>
      c.members.length === 2 &&
      c.members.some(m => m.id === 'uuid123') &&
      c.members.some(m => m.id === user.uuid)
    );

    if (existingConv) {
      this.openConversation(existingConv);
    } else {
      this.chatService.createConversation([
        { id: 'uuid123', nome: 'Aluno1', polo: 'Polo1' },
        { id: user.uuid, nome: user.nome, polo: user.polo }
      ]).subscribe(conv => {
        this.selectedConversation = conv;
        this.messages$ = of(conv.messages);
      });
    }
  }

  getConversationTitle(conv: ChatConversation): string {
    if (conv.members.length === 2) {
      const other = conv.members.find(m => m.id !== 'uuid123');
      return other ? `[${other.polo || 'Sem polo'}] - ${other.nome}` : 'Conversa';
    } else {
      const names = conv.members
        .filter(m => m.id !== 'uuid123')
        .map(m => m.nome.split(' ')[0]);

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

  openGroupPopup() {
    this.dialog.open(PopupDialogMatComponent, {
      width: '600px',
      panelClass: 'custom-dark-dialog',
      backdropClass: 'custom-dark-backdrop',
      data: {
        users$: [
          { uuid: 'uuid123', nome: 'Aluno1', curso: 'Curso1', polo: 'Polo1' },
          { uuid: 'uuid456', nome: 'Aluno2', curso: 'Curso2', polo: 'Polo2' },
          { uuid: 'uuid789', nome: 'Aluno3', curso: 'Curso3', polo: 'Polo2' }
        ]
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        const members = [
          { id: 'uuid123', nome: 'Aluno1', polo: 'Polo1' },
          ...result.users.map((u: any) => ({ id: u.uuid, nome: u.nome, polo: u.polo }))
        ];
        this.chatService.createConversation(members).subscribe(conv => {
          conv.title = result.title;
          this.openConversation(conv);
        });
      }
    });
  }
}
