'use client';

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { customMainAPI } from './services/customAPI';
import { rootReducer } from './reducer';

export const store = () =>
  configureStore({
    reducer: {
      ...rootReducer,
      [customMainAPI.reducerPath]: customMainAPI.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([customMainAPI.middleware]),
  });

setupListeners(store().dispatch);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
