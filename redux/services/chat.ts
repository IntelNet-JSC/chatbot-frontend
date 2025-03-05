import { setChat } from '../features/chat';
import { RootState } from '../store';
import { customMainAPI } from './customAPI';
import { v4 as uuidv4 } from 'uuid';

const uuid = uuidv4();

export const chatAPI = customMainAPI.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation<any, { link: string; chatInput: string; sessionId?: string; action?: string; metadata?: any }>({
      query: ({ link, chatInput, sessionId = uuid, action = 'sendMessage', metadata }) => ({
        url: link,
        method: 'POST',
        body: {
          chatInput,
          sessionId,
          action,
          metadata,
        },
      }),
      //   transformResponse: ({ Data }: IResponseAPI<TPollQuestion>): TPollQuestion => Data,
      onQueryStarted: async (_, { dispatch, queryFulfilled, getState }) => {
        try {
          const { data } = await queryFulfilled;
          const state = getState() as RootState;

          dispatch(setChat([...state?.chat, { content: data?.output, role: 'assistant' }]));
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      },
    }),
  }),
});

export const { useCreateChatMutation } = chatAPI;
