import { ChatConversation } from './chat.model';

export const chatMock: { conversations: ChatConversation[] } = {
  conversations: [
    {
      id: 'conv1',
      members: [
        { id: 'uuid123', nome: 'Aluno1' },
        { id: 'uuid456', nome: 'Aluno2' }
      ],
      createdAt: new Date(),
      messages: [
        {
          id: 'msg1',
          senderId: 'uuid123',
          text: 'Oi, tudo bem?',
          timestamp: new Date()
        },
        {
          id: 'msg2',
          senderId: 'uuid456',
          text: 'Tudo sim! E você?',
          timestamp: new Date()
        }
      ]
    }
  ]
};
