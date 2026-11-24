import { DurableObject } from 'cloudflare:workers';
import { firebaseUser } from './firebase.js';
import { school, atlasPassword } from './domain.js';
import { repository } from './repositorio.js';
import envelope from './bootstrap.json';
import cadernos from '../avaliacao-historia/cadernos.json';

const prefix='/avaliacao-historia/',start=prefix+'api/';
const sessionName='atlas_historia';
const actions=new Set(['access','lock','unlock','class','start','submit','t/rooms','t/create','t/add','t/detail','t/review']);
const reply=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff',...headers}});
const problem=(status,message)=>Object.assign(Error(message),{status});
const cookie=(token,age)=>sessionName+'='+token+'; Path='+prefix+'api/; HttpOnly; Secure; SameSite=Strict; Max-Age='+age;
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
const report=e=>reply({error:e.status?e.message:'Não foi possível concluir agora. Tente novamente.'},e.status||500);

export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(!url.pathname.startsWith(start))return env.ASSETS.fetch(request);
  try{
   const action=url.pathname.slice(start.length);
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
  this.storage=ctx.storage;this.sql=ctx.storage.sql;this.repo=repository(ctx.storage);
  this.sql.exec(`CREATE TABLE IF NOT EXISTS rooms(id TEXT PRIMARY KEY,grade INTEGER NOT NULL,label TEXT NOT NULL,mode TEXT NOT NULL,code TEXT NOT NULL UNIQUE);
   CREATE TABLE IF NOT EXISTS students(id TEXT PRIMARY KEY,room TEXT NOT NULL REFERENCES rooms(id),name TEXT NOT NULL,pin TEXT NOT NULL,UNIQUE(room,name));
   CREATE INDEX IF NOT EXISTS students_room ON students(room);
   CREATE TABLE IF NOT EXISTS submissions(student TEXT PRIMARY KEY REFERENCES students(id),team TEXT,answers TEXT NOT NULL,marks TEXT,score INTEGER,sent TEXT NOT NULL);
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
 bank(){
  if(this.exams)return this.exams;
  const row=this.sql.exec("SELECT value FROM settings WHERE id='keys'").toArray()[0];
  if(!row)throw problem(503,'A professora precisa abrir o painel uma vez para liberar a chamada.');
  const keys=JSON.parse(row.value);
  this.exams=Object.fromEntries(Object.entries(cadernos).map(([g,c])=>[g,{...c,objective:c.objective.map((q,i)=>({...q,key:keys[g][i]}))}]));
  return this.exams;
 }
 async fetch(req){
  try{
   const url=new URL(req.url),path=url.pathname.slice(start.length),uid=req.headers.get('x-atlas-user'),now=Date.now();
   const candidate=req.headers.get('cookie')?.match(/(?:^|;\s*)atlas_historia=([a-f0-9]{64})(?:;|$)/)?.[1]||'';
   const teacher=!!this.sql.exec('SELECT 1 FROM sessions WHERE token=? AND uid=? AND expires>?',candidate,uid,now).toArray().length;
   if(path==='access')return reply({teacher,teacherDevice:true,host:'internet',studentUrl:teacher?url.origin+prefix:''});
   if(path==='lock'){this.sql.exec('DELETE FROM sessions WHERE token=? AND uid=?',candidate,uid);return reply({ok:true},200,{'Set-Cookie':cookie('',0)});}
   let b;try{b=await req.json();}catch{throw problem(400,'Pedido inválido.');}
   if(!b||typeof b!=='object'||Array.isArray(b))throw problem(400,'Pedido inválido.');
   if(path.startsWith('t/')&&!teacher)throw problem(403,'Entre com a senha da professora.');
   const bucket=(path==='unlock'?'teacher:':'student:')+req.headers.get('x-atlas-ip');
   const limited=['unlock','class','start','submit'].includes(path);
   if(limited){
    this.sql.exec('DELETE FROM attempts WHERE expires<=?',now);
    const hits=this.sql.exec('SELECT n FROM attempts WHERE bucket=?',bucket).toArray()[0]?.n||0;
    if(hits>=(path==='unlock'?12:100))throw problem(429,'Muitas tentativas. Aguarde um minuto.');
    this.sql.exec('INSERT INTO attempts VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET n=n+1',bucket,now+60000);
   }
   const succeeded=()=>{if(limited)this.sql.exec('UPDATE attempts SET n=max(0,n-1) WHERE bucket=?',bucket);};
   if(path==='unlock'){
    this.configure(await openSeed(b.password));
    this.sql.exec('DELETE FROM sessions WHERE expires<=? OR (uid=? AND token=?)',now,uid,candidate);
    const token=randomToken(),seconds=8*3600;
    this.sql.exec('INSERT INTO sessions VALUES(?,?,?)',token,uid,now+seconds*1000);succeeded();
    return reply({ok:true},200,{'Set-Cookie':cookie(token,seconds)});
   }
   const result=await school(path,b,{teacher,repo:this.repo,bank:this.bank()});succeeded();return reply(result);
  }catch(e){return report(e);}
 }
}
