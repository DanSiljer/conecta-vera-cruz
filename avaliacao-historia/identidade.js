import { app } from '/assets/js/firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js';
import { initializeAuth, browserSessionPersistence, signInAnonymously, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js';

const examApp = initializeApp(app.options, 'atlas-historia');
const auth = initializeAuth(examApp, {persistence:browserSessionPersistence});
let pending;
export async function token(){
  await auth.authStateReady();
  if(auth.currentUser)return auth.currentUser.getIdToken();
  pending??=signInAnonymously(auth).finally(()=>{pending=undefined;});
  return (await pending).user.getIdToken();
}

export async function login(email,password){
 try{await signInWithEmailAndPassword(auth,email,password);}
 catch{throw Error('Confira o e-mail e a senha cadastrados no Firebase.');}
}
export async function logout(){await signOut(auth);}
