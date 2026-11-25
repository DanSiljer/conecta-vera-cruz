import { DurableObject } from 'cloudflare:workers';
import { firebaseUser } from './firebase.js';
import { school, atlasPassword } from './domain.js';
import { repository } from './repositorio.js';
import computing from './computacao.json';
import archived from './edicoes.json';
import {repository as firestoreRepository,token as firestoreToken} from './firestore.js';
import envelope from './bootstrap.json';
import geraldaEnvelope from './bootstrap-geralda.json';
import cadernos from '../avaliacao-historia/cadernos.json';

const prefix='/avaliacao-historia/',start=prefix+'api/';
const portalPrefix='/api/avaliacoes/';
const sessionName='atlas_historia';
const actions=new Set(['access','lock','unlock','class','start','submit','t/rooms','t/import','t/activate-geralda','t/create','t/add','t/detail','t/review','t/grade']);
const reply=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff',...headers}});
const problem=(status,message)=>Object.assign(Error(message),{status});
const cookie=(token,age,path)=>sessionName+'='+token+'; Path='+path+'; HttpOnly; Secure; SameSite=Strict; Max-Age='+age;
const randomToken=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
async function openSeed(password){
 if(typeof password!=='string'||password.length>160)throw problem(403,'Confira a senha da professora.');
 const raw=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(atlasPassword(password)),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:raw(envelope.salt),iterations:100000},material,{name:'AES-GCM',length:256},false,['decrypt']);
 try{
  const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:raw(envelope.iv)},key,raw(envelope.data));
  return JSON.parse(new TextDecoder().decode(plain));
 }catch{throw problem(403,'Senha incorreta. Use “Mostrar senha” para conferir.');}
}
async function openGeraldaSeed(password){
 if(geraldaEnvelope.scheme!=='atlas-password-v1')throw problem(409,'Prepare a chamada protegida no computador ou use Importar chamada do Geralda.');
 if(typeof password!=='string'||password.length>160)throw problem(403,'Confira a senha original do Atlas.');
 const raw=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 try{
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(atlasPassword(password)),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:raw(geraldaEnvelope.salt),iterations:600000},material,{name:'AES-GCM',length:256},false,['decrypt']);
  const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:raw(geraldaEnvelope.iv)},key,raw(geraldaEnvelope.data));
  const unpacked=JSON.parse(new TextDecoder().decode(plain));
  if(unpacked.school!=='geralda'||!Array.isArray(unpacked.rooms)||unpacked.rooms.length!==6)throw Error('Invalid roster');
  return unpacked.rooms;
 }catch{throw problem(403,'Confira a senha original do Atlas usada para liberar a chamada do Luiz Eduardo.');}
}
function privateGeraldaRoster(env){
 if(!env.ATLAS_GERALDA_ROSTER)return null;
 let data;
 try{data=JSON.parse(env.ATLAS_GERALDA_ROSTER);}catch{throw problem(503,'A chamada privada do Geralda Maria precisa ser revisada pela professora.');}
 if(data.school!=='geralda'||!Array.isArray(data.rooms)||data.rooms.length!==6)throw problem(503,'A chamada privada do Geralda Maria está incompleta.');
 return data.rooms;
}
const geraldaExpected={'6a':26,'6b':16,'7a':26,'8a':20,'8b':19,'9a':25};
async function geraldaReady(repo){
 const existing=await repo.rooms();
 for(const [id,count] of Object.entries(geraldaExpected)){
  const room=existing.find(r=>r.id==='geralda-'+id);
  if(!room||(await repo.students(room.id)).length<count)return false;
 }
 return true;
}
const report=e=>reply({error:e.status?e.message:'Não foi possível concluir agora. Tente novamente.'},e.status||500);

export default {
 async fetch(request,env){
  const url=new URL(request.url);
  const portal=url.pathname.startsWith(portalPrefix);
  if(!portal&&!url.pathname.startsWith(start))return env.ASSETS.fetch(request);
  try{
   const action=url.pathname.slice((portal?portalPrefix:start).length);
   if(portal&&action==='health'&&request.method==='GET'){
    if(request.headers.has('authorization'))await firebaseUser(request.headers.get('authorization'));
    if(env.FIREBASE_SERVICE_ACCOUNT){
     const bearer=await firestoreToken(env);
     const probe=await fetch('https://firestore.googleapis.com/v1/projects/conecta-vera-cruz/databases/(default)/documents/atlas_avaliacoes_2026?pageSize=1&mask.fieldPaths=code',{headers:{Authorization:'Bearer '+bearer}});
     if(!probe.ok)throw problem(503,'O servidor não conseguiu acessar o Firestore do Conecta.');
    }
    return reply({ok:true,storage:env.FIREBASE_SERVICE_ACCOUNT?'firestore':'cloudflare',teacherLogin:env.ATLAS_TEACHER_UID?'email':'atlas'});
   }
   if(!actions.has(action))throw problem(404,'Opção indisponível.');
   if(request.method!=='POST'||request.headers.get('origin')!==url.origin||!request.headers.get('content-type')?.startsWith('application/json'))throw problem(403,'Pedido inválido.');
   if(Number(request.headers.get('content-length'))>50000)throw problem(413,'Pedido muito grande.');
   const user=await firebaseUser(request.headers.get('authorization'));
   const reader=request.body?.getReader(), decoder=new TextDecoder();
   if(!reader)throw problem(400,'Pedido inválido.');
   let body='',size=0;
   for(;;){
    const part=await reader.read();if(part.done)break;
    size+=part.value.byteLength;
    if(size>50000){await reader.cancel();throw problem(413,'Pedido muito grande.');}
    body+=decoder.decode(part.value,{stream:true});
   }
   body+=decoder.decode();
   const headers={'Content-Type':'application/json','X-Atlas-User':user,'X-Atlas-IP':request.headers.get('CF-Connecting-IP')||'unknown','Cookie':request.headers.get('cookie')||''};
   const instance=env.ATLAS_HISTORIA.get(env.ATLAS_HISTORIA.idFromName('avaliacao-historia'));
   return await instance.fetch(new Request(url,{method:'POST',headers,body}));
  }catch(e){return report(e);}
 }
};

export class AtlasHistoria extends DurableObject{
 constructor(ctx,env){
  super(ctx,env);
  this.env=env;this.storage=ctx.storage;this.sql=ctx.storage.sql;this.repo=repository(ctx.storage);
  this.sql.exec(`CREATE TABLE IF NOT EXISTS rooms(id TEXT PRIMARY KEY,grade INTEGER NOT NULL,label TEXT NOT NULL,mode TEXT NOT NULL,code TEXT NOT NULL UNIQUE);
   CREATE TABLE IF NOT EXISTS students(id TEXT PRIMARY KEY,room TEXT NOT NULL REFERENCES rooms(id),name TEXT NOT NULL,pin TEXT NOT NULL,UNIQUE(room,name));
   CREATE INDEX IF NOT EXISTS students_room ON students(room);
   CREATE TABLE IF NOT EXISTS submissions(student TEXT PRIMARY KEY REFERENCES students(id),team TEXT,answers TEXT NOT NULL,marks TEXT,score INTEGER,sent TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS submissions_computacao(student TEXT PRIMARY KEY REFERENCES students(id),team TEXT,answers TEXT NOT NULL,marks TEXT,score INTEGER,sent TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS settings(id TEXT PRIMARY KEY,value TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,uid TEXT NOT NULL,expires INTEGER NOT NULL);
   CREATE TABLE IF NOT EXISTS attempts(bucket TEXT PRIMARY KEY,n INTEGER NOT NULL,expires INTEGER NOT NULL);`);
 }
 configure(seed){
  this.storage.transactionSync(()=>{
   if(this.sql.exec("SELECT 1 FROM settings WHERE id='keys'").toArray().length)return;
   this.repo.seedRooms(seed.rooms,seed.students);
   this.sql.exec("INSERT INTO settings VALUES('keys',?)",JSON.stringify(seed.keys));
  });
 }
 bank(subject){
  this.exams??={};if(this.exams[subject])return this.exams[subject];
  const row=this.sql.exec("SELECT value FROM settings WHERE id='keys'").toArray()[0];
  if(!row)throw problem(503,'A professora precisa abrir o painel uma vez para liberar a chamada.');
  const keys=JSON.parse(row.value),data=subject==='computacao'?computing:cadernos;
  const bank=Object.fromEntries(Object.entries(data).map(([g,c])=>[g,{...c,archive:{written:archived[subject][g].written,objective:archived[subject][g].objective,editions:archived[subject][g]},
   objective:c.objective.map((q,i)=>({...q,key:keys[g][i%keys[g].length]}))}]));
  this.exams[subject]=bank;return bank;
 }
 async fetch(req){
  try{
   const url=new URL(req.url),portal=url.pathname.startsWith(portalPrefix),base=portal?portalPrefix:start,path=url.pathname.slice(base.length),uid=req.headers.get('x-atlas-user'),now=Date.now();
   const candidate=req.headers.get('cookie')?.match(/(?:^|;\s*)atlas_historia=([a-f0-9]{64})(?:;|$)/)?.[1]||'';
   const atlasSession=!!this.sql.exec('SELECT 1 FROM sessions WHERE token=? AND uid=? AND expires>?',candidate,uid,now).toArray().length;
   const emailLogin=portal&&!!this.env.ATLAS_TEACHER_UID;
   const teacher=emailLogin?uid===this.env.ATLAS_TEACHER_UID:atlasSession;
   if(path==='access')return reply({teacher,teacherLogin:emailLogin?'email':'atlas',teacherDevice:true,host:'internet',
    needsSetup:teacher&&!this.sql.exec("SELECT 1 FROM settings WHERE id='keys'").toArray().length,
    studentUrl:teacher?url.origin+(portal?'/avaliacoes-escolares.html':prefix):''});
   if(path==='lock'){this.sql.exec('DELETE FROM sessions WHERE token=? AND uid=?',candidate,uid);return reply({ok:true},200,{'Set-Cookie':cookie('',0,base)});}
   let b;try{b=await req.json();}catch{throw problem(400,'Pedido inválido.');}
   if(!b||typeof b!=='object'||Array.isArray(b))throw problem(400,'Pedido inválido.');
   if(path.startsWith('t/')&&!teacher)throw problem(403,'Entre com a senha da professora.');
   const bucket=(['unlock','t/activate-geralda'].includes(path)?'teacher:':'student:')+req.headers.get('x-atlas-ip');
   const limited=['unlock','t/activate-geralda','class','start','submit'].includes(path);
   if(limited){
    this.sql.exec('DELETE FROM attempts WHERE expires<=?',now);
    const hits=this.sql.exec('SELECT n FROM attempts WHERE bucket=?',bucket).toArray()[0]?.n||0;
    if(hits>=(['unlock','t/activate-geralda'].includes(path)?12:100))throw problem(429,'Muitas tentativas. Aguarde um minuto.');
    this.sql.exec('INSERT INTO attempts VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET n=n+1',bucket,now+60000);
   }
   const succeeded=()=>{if(limited)this.sql.exec('UPDATE attempts SET n=max(0,n-1) WHERE bucket=?',bucket);};
   if(path==='unlock'){
    if(emailLogin&&!teacher)throw problem(403,'Entre com a conta da professora antes de ativar as turmas.');
    this.configure(await openSeed(b.password));
    this.sql.exec('DELETE FROM sessions WHERE expires<=? OR (uid=? AND token=?)',now,uid,candidate);
    const token=randomToken(),seconds=8*3600;
    this.sql.exec('INSERT INTO sessions VALUES(?,?,?)',token,uid,now+seconds*1000);succeeded();
    return reply({ok:true},200,{'Set-Cookie':cookie(token,seconds,base)});
   }
   const subject=portal&&b.subject==='computacao'?'computacao':'historia';
   const bank=this.bank(subject),firestore=portal&&!!this.env.FIREBASE_SERVICE_ACCOUNT;
   let result;
   let seedStatus=null;
   for(let n=0;n<3;n++){
    try{
     const repo=firestore?firestoreRepository(await firestoreToken(this.env),subject):repository(this.storage,subject);
     if(firestore&&path==='t/rooms'&&(subject==='historia'||b.school==='luiz')){
      const current=await repo.rooms();
      for(const r of this.repo.rooms().filter(r=>r.id.startsWith('matutino-')&&!current.some(a=>a.id===r.id))){
       await repo.create(r,this.repo.students(r.id).map(({id,name,pin,room})=>({id,name,pin,room})));
      }
     }
     if(path==='t/activate-geralda'){
      if(!portal||!teacher||subject!=='computacao'||b.school==='luiz')throw problem(403,'Selecione Computação no Geralda Maria.');
      const rooms=await openGeraldaSeed(b.password);
      result=await school('t/import',{subject:'computacao',school:'geralda',rooms},{teacher:true,portal:true,repo,bank});break;
     }
     if(portal&&teacher&&path==='t/rooms'&&subject==='computacao'&&b.school!=='luiz'){
      let complete=await geraldaReady(repo);
      if(!complete&&this.env.ATLAS_GERALDA_ROSTER){
       const rooms=privateGeraldaRoster(this.env);
       await school('t/import',{subject:'computacao',school:'geralda',rooms},{teacher:true,portal:true,repo,bank});
       complete=await geraldaReady(repo);
      }
      seedStatus=complete?'ready':geraldaEnvelope.scheme==='atlas-password-v1'?'activate':'import';
     }
     result=await school(path,b,{teacher,portal,repo,bank});break;
    }catch(e){if(!e.retry||n===2)throw e;}
   }
   if(seedStatus!==null)result={...result,seedStatus};
   const brief=r=>({mode:r.mode,score:r.score,sent:r.sent,correct:r.marks?.filter(x=>x>0).length??0,total:r.marks?.length??0});
   if(portal&&path==='start'&&result.result)result.result=brief(result.result);
   if(portal&&path==='submit')result=brief(result);
   succeeded();return reply(result);
  }catch(e){return report(e);}
 }
}
