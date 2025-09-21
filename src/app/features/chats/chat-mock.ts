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
    },

    {
      id: 'conv4',
      members: [
        { id: 'uuid123', nome: 'Aluno1', polo: 'Polo1' },
        { id: 'uuid998', nome: 'Camila Cerqueira', polo: 'POLO CAMPO LIMPO' },
      ],
      createdAt: new Date(),
      messages: [
        {
          id: 'msg1',
          senderId: 'uuid998',
          text: 'Oi tudo bem?',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
          read: true
        },
        {
          id: 'msg2',
          senderId: 'uuid998',
          text: 'Sou a Camila do Polo Campo Limpo. Estou procurando alunos do polo para tirar algumas dúvidas. Será que poderia me informar se tem estacionamento no local para os dias de prova?',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
          read: true
        },
        {
          id: 'msg3',
          senderId: 'uuid123',
          text: 'Oi Camila. Tudo bem sim! E com você? Sim tem como estacionar lá sim. Normalmente a coordenadora envia um e-mail com um formulário para preenchermos a placa do carro 🚙',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
          read: true
        },
        {
          id: 'msg4',
          senderId: 'uuid998',
          text: 'Muito obrigada pela informação! 🙏',
          timestamp: new Date(), // Hoje
          read: false
        }
      ]
    }
  ]

};
