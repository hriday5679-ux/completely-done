import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import rawConfig from '../../firebase-applet-config.json';

// Single source of truth for Firebase configuration
export const firebaseConfig = {
  apiKey: rawConfig.apiKey,
  projectId: rawConfig.projectId,
  appId: rawConfig.appId,
  // Ensure authDomain is strictly <projectId>.firebaseapp.com per requirement
  authDomain: rawConfig.authDomain || `${rawConfig.projectId}.firebaseapp.com`,
  firestoreDatabaseId: (rawConfig as any).firestoreDatabaseId || undefined,
  storageBucket: (rawConfig as any).storageBucket || `${rawConfig.projectId}.firebasestorage.app`,
  messagingSenderId: (rawConfig as any).messagingSenderId || '',
};

// Initialize Firebase app singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
// CRITICAL per Firebase integration guidelines: pass firestoreDatabaseId if configured
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || undefined
);
export const storage = getStorage(
  app,
  firebaseConfig.storageBucket ? `gs://${firebaseConfig.storageBucket}` : undefined
);

// Connection test per SKILL.md
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Database offline or checking connectivity.');
    }
  }
}
testConnection().catch(() => {});

export default app;
