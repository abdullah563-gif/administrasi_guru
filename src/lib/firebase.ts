import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom database ID
export const db = getFirestore(
  firebaseApp,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Initialize Firebase Auth
export const auth = getAuth(firebaseApp);

// Validate Connection to Firestore on startup
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'ping'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: client appears offline, using cached/server fallback.');
    }
    return false;
  }
}
