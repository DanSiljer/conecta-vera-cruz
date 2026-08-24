import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyBcsIZO9G_h7mTtWt-sBb6MFDC9_chpzMk",
  authDomain: "conecta-vera-cruz.firebaseapp.com",
  projectId: "conecta-vera-cruz",
  storageBucket: "conecta-vera-cruz.firebasestorage.app",
  messagingSenderId: "918702884700",
  appId: "1:918702884700:web:01b59897dd18f3ff65a399"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
