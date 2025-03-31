import {configureStore} from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import rootReducer from './rootReducer';
import reduxStorage from './storage';

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['game'],
  stateReconciler: autoMergeLevel2, // Add this
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, REGISTER, PAUSE, PURGE, PERSIST],
      },
    }),
});

export const persistor = persistStore(store);
