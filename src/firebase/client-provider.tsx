'use client';

import React, { useMemo, useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

interface FirebaseServices {
  firebaseApp: any;
  auth: any;
  firestore: any;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseServices | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const services = initializeFirebase();
      setFirebaseServices(services);
    } catch (e) {
      console.error('Firebase initialization failed:', e);
      setError(e as Error);
    }
  }, []);

  const services = firebaseServices || {
    firebaseApp: null as any,
    auth: null as any,
    firestore: null as any,
  };

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      auth={services.auth}
      firestore={services.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}