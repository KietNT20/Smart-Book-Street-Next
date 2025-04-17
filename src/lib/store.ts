import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import userReducer from './features/user/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
});

export const makeStore = async () => {
  const { default: storage } = await import('redux-persist/lib/storage');

  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

export type AppStore = Awaited<ReturnType<typeof makeStore>>['store'];
export type AppPersistor = Awaited<ReturnType<typeof makeStore>>['persistor'];
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
