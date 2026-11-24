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
 catch(error){
  if(error.code==='auth/network-request-failed')throw Error('Confira sua internet e tente entrar novamente.');
  if(error.code==='auth/too-many-requests')throw Error('Houve várias tentativas de entrada. Aguarde alguns minutos e tente novamente.');
  throw Error('Confira seu e-mail e sua senha e tente entrar novamente.');
 }
}
export async function logout(){
 try{await signOut(auth);}catch{throw Error('Não foi possível sair da conta. Tente novamente.');}
}
