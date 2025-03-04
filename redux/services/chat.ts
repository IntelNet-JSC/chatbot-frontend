import { setChat } from '../features/chat';
import { RootState } from '../store';
import { customMainAPI } from './customAPI';

export const chatAPI = customMainAPI.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation<any, { chatInput: string; sessionId?: string; action?: string }>({
      query: ({ chatInput, sessionId = '3569d871-ed50-4a3e-88cb-588a9563daa7', action = 'sendMessage' }) => ({
        url: `/webhook/a721bef1-cb87-45a3-84b6-989c1b04ca91/chat`,
        method: 'POST',
        body: {
          chatInput,
          sessionId,
          action,
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
