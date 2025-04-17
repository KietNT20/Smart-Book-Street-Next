'use client';

import LoadingSpinner from '@/components/spin/loading-spinner';
import { AppPersistor, AppStore, makeStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store, setStore] = useState<AppStore | null>(null);
  const [persistor, setPersistor] = useState<AppPersistor | null>(null);

  useEffect(() => {
    makeStore().then(({ store, persistor }) => {
      setStore(store);
      setPersistor(persistor);
    });
  }, []);

  if (!store || !persistor) {
    return <LoadingSpinner />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
