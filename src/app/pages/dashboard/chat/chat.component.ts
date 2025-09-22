import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
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
import { ColegaResponse } from '../../../features/colegas/colegas-endpoint.service';
import { ChatService } from '../../../features/chats/chat.service';
import { chatMock } from '../../../features/chats/chat-mock';
import { ChatConversation, ChatMessage } from '../../../features/chats/chat.model';
import { PopupDialogMatComponent } from '../../../components/popup-dialog-mat/popup-dialog-mat.component';
import { ColegaService } from 'src/app/features/colegas/colegas.service';

interface MessageGroup {
  date: string;
  messages: ChatMessage[];
}

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
    DatePipe
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  searchControl = new FormControl('');
  filteredUsers$: Observable<ColegaResponse[]> | undefined;

  conversations$: Observable<ChatConversation[]> | undefined;
  filteredConversations$: Observable<ChatConversation[]> | undefined;

  selectedConversation: ChatConversation | null = null;
  messages$: Observable<ChatMessage[]> | undefined;

  groupedMessages$!: Observable<MessageGroup[]>;

  currentFilter: 'all' | 'unread' | 'group' = 'all';
  private filterSubject = new BehaviorSubject<'all' | 'unread' | 'group'>('all');

  private shouldScrollToBottom = false;

  placeholderText = 'Digite sua mensagem... (Alt+Enter para quebrar linha)';

  // NOVAS PROPRIEDADES:
  showEmojiPicker = false;
  activeCategory = 'smileys';
  emojiCategories = [
    { name: 'smileys', icon: '😀' },
    { name: 'people', icon: '👋' },
    { name: 'nature', icon: '🐻' },
    { name: 'food', icon: '🍎' },
    { name: 'travel', icon: '🚗' },
    { name: 'objects', icon: '💡' },
    { name: 'symbols', icon: '❤️' }
  ];

  // EMOJIS POR CATEGORIA (lista reduzida para exemplo)
  emojis = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
    people: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
    nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄', '🐴', '🦓', '🐘', '🦒', '🐑', '🐫', '🐿️', '🦔', '🐍', '🐢'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚀'],
    objects: ['💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️']
  };

  constructor(
    private colegasService: ColegaService,
    private chatService: ChatService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filteredUsers$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => this.searchUsers(value || ''))
    );

    // ✅ CORRETO: Observable do service
    this.conversations$ = this.chatService.getConversations('uid123');

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
              passesFilter = conv.messages.some(msg => msg.senderId !== 'uid123' && !msg.read);
            } else if (filter === 'group') {
              passesFilter = conv.members.length > 2;
            }
          }

          return passesSearch && passesFilter;
        });
      })
    );
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  displayFn(user: ColegaResponse): string {
    return user ? user.nome : '';
  }

  setFilter(filter: 'all' | 'unread' | 'group') {
    this.currentFilter = filter;
    this.filterSubject.next(filter);
  }

  openConversation(conv: ChatConversation) {
    this.selectedConversation = conv;

    // NOVO: Marcar como lidas e atualizar contagem
    const unreadMessages = conv.messages.filter(msg =>
      msg.senderId !== 'uid123' && !msg.read
    );

    // Marcar mensagens como lidas
    unreadMessages.forEach(msg => {
      this.chatService.markMessageAsRead('uid123', conv.id, msg.id).subscribe();
    });

    this.messages$ = this.chatService.getMessages('uid123', conv.id);

    this.groupedMessages$ = this.messages$.pipe(
      map(messages => this.groupMessagesByDate(messages))
    );

    this.shouldScrollToBottom = true;
  }

  getSenderPoloAndName(senderId: string): string {
    if (senderId === 'uid123') {
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

  // ✅ SOLUÇÃO ALTERNATIVA: Recarregar a conversa para atualizar
  sendMessageFromTextarea(textarea: HTMLTextAreaElement) {
    const text = textarea.value.trim();
    if (!this.selectedConversation || !text) return;

    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'uid123',
      text: text,
      timestamp: new Date(),
      read: true
    };

    this.chatService.sendMessage('uid123', this.selectedConversation.id, msg).subscribe(() => {
      // ✅ FORÇA recarregamento da conversa atual
      this.openConversation(this.selectedConversation!);
      textarea.value = '';
      this.adjustTextareaHeight(textarea);
    });
  }

  sendMessage(text: string) {
    if (!this.selectedConversation || !text.trim()) return;

    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'uid123',
      text: text.trim(),
      timestamp: new Date(),
      read: true
    };

    this.chatService.sendMessage('uid123', this.selectedConversation.id, msg).subscribe(() => {
      // ✅ Também recarrega para o método antigo
      this.openConversation(this.selectedConversation!);
    });
  }

  getSenderName(senderId: string): string {
    if (!this.selectedConversation) return 'Desconhecido';
    const member = this.selectedConversation.members.find(m => m.id === senderId);
    return member ? member.nome : 'Desconhecido';
  }

  searchUsers(term: string): Observable<ColegaResponse[]> {
    return of([
      { uid: 'uid123', nome: 'Aluno1', curso: 'Curso1', polo: 'Polo1' },
      { uid: 'uid456', nome: 'Aluno2', curso: 'Curso2', polo: 'Polo2' },
      { uid: 'uid789', nome: 'Aluno3', curso: 'Curso3', polo: 'Polo2' },
      { uid: 'uid999', nome: 'Aluno4', curso: 'Curso3', polo: 'Polo1' },
      { uid: 'uid998', nome: 'Camila Cerqueira', curso: 'Curso1', polo: 'POLO CAMPO LIMPO' },
    ]);
  }

  onUserSelected(user: ColegaResponse) {
    const existingConv = chatMock.conversations.find(c =>
      c.members.length === 2 &&
      c.members.some(m => m.id === 'uid123') &&
      c.members.some(m => m.id === user.uid)
    );

    if (existingConv) {
      this.openConversation(existingConv);
    } else {
      this.chatService.createConversation('uid123', [
        { id: 'uid123', nome: 'Aluno1', polo: 'Polo1' },
        { id: user.uid, nome: user.nome, polo: user.polo }
      ]).subscribe(conv => {
        this.selectedConversation = conv;
        this.messages$ = of(conv.messages);
        this.groupedMessages$ = this.messages$.pipe(
          map(messages => this.groupMessagesByDate(messages))
        );
        this.shouldScrollToBottom = true;
      });
    }
  }

  getConversationTitle(conv: ChatConversation): string {
    if (conv.members.length === 2) {
      const other = conv.members.find(m => m.id !== 'uid123');
      return other ? `[${other.polo || 'Sem polo'}] - ${other.nome}` : 'Conversa';
    } else {
      const names = conv.members
        .filter(m => m.id !== 'uid123')
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

  // NOVO: Método para contar mensagens não lidas
  getUnreadCount(conv: ChatConversation): number {
    if (!conv.messages) return 0;
    return conv.messages.filter(msg =>
      msg.senderId !== 'uid123' && !msg.read
    ).length;
  }

  // NOVO: Método para classe CSS condicional
  getBadgeClass(count: number): string {
    return count > 9 ? 'unread-badge many' : 'unread-badge';
  }

  // NOVO: Método para obter horário da última mensagem
getLastMessageTime(conv: ChatConversation): string {
  if (!conv.messages || conv.messages.length === 0) return '';

  const lastMessage = conv.messages[conv.messages.length - 1];
  const messageDate = lastMessage.timestamp.toDate ? lastMessage.timestamp.toDate() : new Date(lastMessage.timestamp);
  const now = new Date();

  // Se for hoje, mostra apenas hora
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // Se for ontem, mostra "Ontem"
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  }

  // Se for até 7 dias atrás, mostra dia da semana
  const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) {
    return messageDate.toLocaleDateString('pt-BR', { weekday: 'short' });
  }

  // Mais de 7 dias: mostra data completa
  return messageDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

  openGroupPopup() {
    this.dialog.open(PopupDialogMatComponent, {
      width: '600px',
      panelClass: 'custom-dark-dialog',
      backdropClass: 'custom-dark-backdrop',
      data: {}
    }).afterClosed().subscribe(result => {
      if (result) {
        const members = [
          { id: 'uid123', nome: 'Aluno1', polo: 'Polo1' },
          ...result.users.map((u: any) => ({ id: u.uid, nome: u.nome, polo: u.polo }))
        ];
        this.chatService.createConversation('uid123', members).subscribe(conv => {
          conv.title = result.title;
          this.openConversation(conv);
        });
      }
    });
  }

  private groupMessagesByDate(messages: ChatMessage[]): MessageGroup[] {
    const groups: { [key: string]: ChatMessage[] } = {};

    messages.forEach(msg => {
      const date = this.formatMessageDate(msg.timestamp);

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(msg);
    });

    return Object.keys(groups).map(date => ({
      date,
      messages: groups[date]
    }));
  }

  private formatMessageDate(timestamp: any): string {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }

    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) {
      return date.toLocaleDateString('pt-BR', { weekday: 'long' });
    }

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer && this.messagesContainer.nativeElement) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Erro ao fazer scroll:', err);
    }
  }

  // NOVOS MÉTODOS:
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  setActiveCategory(category: any) {
    this.activeCategory = category.name;
  }

  getCategoryEmojis(): string[] {
    return this.emojis[this.activeCategory as keyof typeof this.emojis] || [];
  }

  addEmoji(emoji: string, textarea: HTMLTextAreaElement) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Insere o emoji na posição do cursor
    textarea.value = textarea.value.substring(0, start) + emoji + textarea.value.substring(end);

    // Reposiciona o cursor após o emoji
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;

    // Foca no textarea novamente
    textarea.focus();

    // Opcional: fecha o picker após seleção
    // this.showEmojiPicker = false;
  }

  // NOVO: Fechar picker ao clicar fora
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const emojiPicker = document.querySelector('.emoji-picker');
    const emojiButton = document.querySelector('.emoji-button');

    if (this.showEmojiPicker &&
        !emojiPicker?.contains(event.target as Node) &&
        !emojiButton?.contains(event.target as Node)) {
      this.showEmojiPicker = false;
    }
  }
}
