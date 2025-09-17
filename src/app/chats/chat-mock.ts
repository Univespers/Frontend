import { ChatConversation } from './chat.model';

export const chatMock: { conversations: ChatConversation[] } = {
  conversations: [
    {
      id: 'conv1',
      members: [
        { id: 'uuid123', nome: 'Aluno1', polo: 'Polo1' },
        { id: 'uuid456', nome: 'Aluno2', polo: 'Polo2' },
      ],
      createdAt: new Date(),
      messages: [
        {
          id: 'msg1',
          senderId: 'uuid123',
          text: 'Oi, tudo bem?',
          timestamp: new Date(),
          read: true
        },
        {
          id: 'msg2',
          senderId: 'uuid456',
          text: 'Tudo sim! E você?',
          timestamp: new Date(),
          read: false
        }
      ]
    },
    {
      id: 'conv2',
      members: [
        { id: 'uuid123', nome: 'Aluno1', polo: 'Polo1' },
        { id: 'uuid789', nome: 'Aluno3', polo: 'Polo2' }
      ],
      createdAt: new Date(),
      messages: [
        {
          id: 'msg3',
          senderId: 'uuid789',
          text: 'Oi, vamos estudar juntos?',
          timestamp: new Date(),
          read: false
        }
      ]
    },
    {
      id: 'conv3',
      members: [
        { id: 'uuid123', nome: 'Aluno1', polo: 'Polo1' },
        { id: 'uuid456', nome: 'Aluno2', polo: 'Polo2' },
        { id: 'uuid789', nome: 'Aluno3', polo: 'Polo2' }
      ],
      createdAt: new Date(),
      title: 'Grupo de Estudos',
      messages: [
        {
          id: 'msg4',
          senderId: 'uuid789',
          text: 'Bem-vindos ao grupo!',
          timestamp: new Date(),
          read: false
        }
      ]
    }
  ]
};
