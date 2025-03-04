import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Tchat = {
  content: string;
  role: 'user' | 'assistant';
};

const initialState = [] as Tchat[];

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChat: () => initialState,
    setChat: (state, action: PayloadAction<Tchat[]>) => {
      return action.payload;
    },
  },
});

export const { resetChat, setChat } = chatSlice.actions;
export default chatSlice.reducer;
