// Configuração pública do aplicativo Web Conecta Vera Cruz.
// Controle de acesso: regras do Firestore e Authentication, não esta configuração.
export const firebaseConfig = {
  apiKey: "AIzaSyBcsIZO9G_h7mTtWt-sBb6MFDC9_chpzMk",
  authDomain: "conecta-vera-cruz.firebaseapp.com",
  projectId: "conecta-vera-cruz",
  storageBucket: "conecta-vera-cruz.firebasestorage.app",
  messagingSenderId: "918702884700",
  appId: "1:918702884700:web:01b59897dd18f3ff65a399"
};

export const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId && firebaseConfig.authDomain);
