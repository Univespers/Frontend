import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
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
    CommonModule
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

  // NOVO: popup de grupo
  showGroupPopup = false;
  groupTitle = '';
  groupSearchControl = new FormControl('');
  filteredGroupUsers$: Observable<ColleagueResponse[]> = of([]);
  selectedUsers: ColleagueResponse[] = [];

  constructor(
    private colleagueService: ColleagueEndpointService,
    private chatService: ChatService,
    private dialog: MatDialog
  ) {}

  // chat.component.ts - ngOnInit CORRIGIDO
  // chat.component.ts - ngOnInit CORRIGIDO (VERSÃO FINAL)
  ngOnInit(): void {
    // 🔹 Busca de usuários na API Node.js
    this.filteredUsers$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => this.searchUsers(value || ''))
    );

    // 🔹 Autocomplete para popup de grupo
    this.filteredGroupUsers$ = this.groupSearchControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => this.searchUsers(value || ''))
    );

    // 🔹 Conversas mockadas
    this.conversations$ = this.chatService.getConversations('uuid123');

    // 🔹 Combina busca e filtro - LÓGICA AND CORRIGIDA
    this.filteredConversations$ = combineLatest([
      this.conversations$,
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(100)),
      this.filterSubject.asObservable().pipe(startWith(this.currentFilter))
    ]).pipe(
      map(([convs, searchTerm, filter]) => {
        // DEBUG: Mostra o que está sendo filtrado
        console.log('Filtrando:', { searchTerm, filter, totalConvs: convs.length });

        return convs.filter(conv => {
          // 1. VERIFICA BUSCA (se houver termo)
          const hasSearchTerm = searchTerm && searchTerm.trim().length > 0;
          const passesSearch = !hasSearchTerm ||
            conv.members.some(m => m.nome.toLowerCase().includes(searchTerm.toLowerCase()));

          // 2. VERIFICA FILTRO (se não for 'all')
          const hasFilter = filter !== 'all';
          let passesFilter = true;

          if (hasFilter) {
            if (filter === 'unread') {
              passesFilter = conv.messages.some(msg => msg.senderId !== 'uuid123' && !msg.read);
            } else if (filter === 'group') {
              passesFilter = conv.members.length > 2;
            }
          }

          // 3. RETORNA TRUE APENAS SE:
          // - Não há busca E não há filtro → mostra tudo
          // - Há busca E passa na busca (filtro é opcional)
          // - Há filtro E passa no filtro (busca é opcional)
          // - Há ambos E passa em ambos
          return passesSearch && passesFilter;
        });
      })
    );
  }

  // NOVO: Função para mostrar apenas o nome no input
  displayFn(user: ColleagueResponse): string {
    return user ? user.nome : '';
  }

  // chat.component.ts - MELHORIA (opcional)
  setFilter(filter: 'all' | 'unread' | 'group') {
    this.currentFilter = filter;
    this.filterSubject.next(filter);
  }

  //onSearchInput() {
    // Quando o usuário digita na busca, reseta o filtro para 'all'
    // para evitar combinações confusas como "Aluno4 + Não lidos"
    //if (this.currentFilter !== 'all') {
      //this.setFilter('all');
    //}
  //}

  openConversation(conv: ChatConversation) {
    this.selectedConversation = conv;

    conv.messages.forEach(msg => {
      if (msg.senderId !== 'uuid123' && !msg.read) {
        msg.read = true;
        // this.chatService.markMessageAsRead(conv.id, msg.id).subscribe();
      }
    });

    this.messages$ = this.chatService.getMessages(conv.id);
  }

  sendMessage(text: string) {
    if (!this.selectedConversation) return;
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'uuid123',
      text,
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
    // MOCK
    return of([
      { uuid: 'uuid123', nome: 'Aluno1', curso: 'Curso1', polo: 'Polo1' },
      { uuid: 'uuid456', nome: 'Aluno2', curso: 'Curso2', polo: 'Polo2' },
      { uuid: 'uuid789', nome: 'Aluno3', curso: 'Curso3', polo: 'Polo2' },
      { uuid: 'uuid999', nome: 'Aluno4', curso: 'Curso3', polo: 'Polo1' }
    ]);
  }

  /** NOVO: Cria ou abre conversa ao selecionar usuário */
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
        { id: 'uuid123', nome: 'Aluno1', polo: 'Polo1' }, // usuário logado
        { id: user.uuid, nome: user.nome, polo: user.polo }  // ⚡ inclui polo para corrigir título
      ]).subscribe(conv => {
        this.selectedConversation = conv;
        this.messages$ = of(conv.messages);
        // ⚡ BehaviorSubject já atualiza conversas, não precisa sobrescrever
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

  // abre popup
  // chat.component.ts - ALTERADO (apenas o método openGroupPopup)
openGroupPopup() {
  this.dialog.open(PopupDialogMatComponent, {
    width: '600px',
    panelClass: 'custom-dark-dialog', // ✅ Já está correto
    backdropClass: 'custom-dark-backdrop', // NOVO: opcional para backdrop escuro
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

  // adiciona usuário ao grupo
  addUserToGroup(user: ColleagueResponse) {
    if (!this.selectedUsers.find(u => u.uuid === user.uuid)) {
      this.selectedUsers.push(user);
    }
    this.groupSearchControl.setValue(''); // limpa input
  }

  // remove integrante
  removeUserFromGroup(user: ColleagueResponse) {
    this.selectedUsers = this.selectedUsers.filter(u => u.uuid !== user.uuid);
  }

  // cria grupo
  createGroup() {
    if (!this.groupTitle || this.selectedUsers.length === 0) return;

    const members = [
      { id: 'uuid123', nome: 'Aluno1', polo: 'Polo1' }, // logado
      ...this.selectedUsers.map(u => ({ id: u.uuid, nome: u.nome, polo: u.polo }))
    ];

    this.chatService.createConversation(members).subscribe(conv => {
      conv.title = this.groupTitle;
      this.openConversation(conv);
      this.showGroupPopup = false;
    });
  }

}
