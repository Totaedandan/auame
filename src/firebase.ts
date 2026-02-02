import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, type Auth } from 'firebase/auth';
import { getFirestore, setLogLevel, type Firestore } from 'firebase/firestore';

export let db: Firestore | null = null;
export let auth: Auth | null = null;
export let appId = 'default-app-id';

export const initializeFirebase = (): void => {
  if (db) return;

  try {
    const firebaseConfig =
      typeof __firebase_config !== 'undefined' && __firebase_config
        ? JSON.parse(__firebase_config)
        : {};

    if (typeof __app_id !== 'undefined' && __app_id) {
      appId = __app_id;
    }

    setLogLevel('error');

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token && auth) {
      void signInWithCustomToken(auth, __initial_auth_token);
    } else if (auth) {
      void signInAnonymously(auth);
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
};
