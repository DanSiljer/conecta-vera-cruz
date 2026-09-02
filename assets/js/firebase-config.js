import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBcsIZO9G_h7mTtWt-sBb6MFDC9_chpzMk",
  authDomain: "conecta-vera-cruz.firebaseapp.com",
  projectId: "conecta-vera-cruz",
  storageBucket: "conecta-vera-cruz.firebasestorage.app",
  messagingSenderId: "918702884700",
  appId: "1:918702884700:web:01b59897dd18f3ff65a399"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
