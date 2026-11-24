const project='conecta-vera-cruz';
const prefix='https://firestore.googleapis.com/v1/projects/'+project+'/databases/(default)/documents';
const collection='atlas_avaliacoes_2026';
let cached;
const b64url=bytes=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const enc=x=>b64url(new TextEncoder().encode(JSON.stringify(x)));
async function token(env){
 if(cached&&cached.expires>Date.now()+60000)return cached.token;
 if(!env.FIREBASE_SERVICE_ACCOUNT)throw Object.assign(new Error('Servidor ainda não configurado.'),{status:503});
 const sa=JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
 if(sa.project_id!==project)throw Error('Projeto da conta de serviço incorreto.');
 const now=Math.floor(Date.now()/1000), jwt=enc({alg:'RS256',typ:'JWT'})+'.'+enc({iss:sa.client_email,scope:'https://www.googleapis.com/auth/datastore',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
 const pem=sa.private_key.replace(/-----[^-]+-----|\s/g,'');
 const key=await crypto.subtle.importKey('pkcs8',Uint8Array.from(atob(pem),c=>c.charCodeAt(0)),{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);
 const signature=b64url(new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,new TextEncoder().encode(jwt))));
 const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt+'.'+signature})});
 const d=await r.json();if(!r.ok||!d.access_token)throw Error('Falha de autenticação do banco.');cached={token:d.access_token,expires:Date.now()+d.expires_in*1000};return cached.token;
}
function repository(bearer,subject){
 const cache=new Map();let active;
 async function req(path,method='GET',body){
  const r=await fetch(prefix+path,{method,headers:{Authorization:'Bearer '+bearer,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
  const d=await r.json();if(!r.ok){if(r.status===404&&method==='GET')return null;const status=d.error?.status;const retry=['ABORTED','ALREADY_EXISTS','FAILED_PRECONDITION'].includes(status);throw Object.assign(new Error(retry?'A chamada ou a entrega foi atualizada. Confira os dados e tente novamente.':'As avaliações estão temporariamente indisponíveis. Tente novamente em alguns instantes.'),{retry,status:retry?409:503});}return d;
 }
 function unpack(doc){if(!doc)return null;const x=JSON.parse(doc.fields.payload.stringValue);const v={...x,version:doc.updateTime};cache.set(v.room.id,v);return v;}
 async function read(id){if(!/^[A-Za-z0-9-]{1,80}$/.test(id||''))return null;if(cache.has(id))return cache.get(id);return unpack(await req('/'+collection+'/'+id));}
 async function save(v,create=false){
  const {version,...payload}=v;const condition=create?'currentDocument.exists=false':'currentDocument.updateTime='+encodeURIComponent(version);
  const d=await req('/'+collection+'/'+v.room.id+'?'+condition,'PATCH',{fields:{code:{stringValue:v.room.code},payload:{stringValue:JSON.stringify(payload)}}});return unpack(d);
 }
 const results=v=>v.results[subject]??={};
 return {
  rooms:async()=>{let list=[],page;do{const d=await req('/'+collection+'?pageSize=100'+(page?'&pageToken='+encodeURIComponent(page):''));list.push(...(d?.documents||[]).map(unpack));page=d?.nextPageToken;}while(page);return list.map(v=>v.room);},
  room:async id=>{active=await read(id);return active?.room;},
  byCode:async code=>{const rows=await req(':runQuery','POST',{structuredQuery:{from:[{collectionId:collection}],where:{fieldFilter:{field:{fieldPath:'code'},op:'EQUAL',value:{stringValue:code}}},limit:2}});const found=rows.filter(x=>x.document);if(found.length!==1)return null;active=unpack(found[0].document);return active.room;},
  students:async id=>{active=await read(id);if(!active)return [];const r=results(active);return active.students.map(s=>({...s,score:r[s.id]?.score??null,sent:r[s.id]?.sent??null,team:r[s.id]?.team??null}));},
  create:async(room,students)=>{await save({room,students,results:{historia:{},computacao:{}}},true);},
  add:async rows=>{if(!active)throw Error('Turma não encontrada.');active.students.push(...rows);active=await save(active);},
  result:async id=>active?results(active)[id]:undefined,
  submit:async(ids,team,answers,marks,score,sent)=>{const r=results(active);if(ids.some(id=>r[id]))return;for(const id of ids)r[id]={team,answers:JSON.stringify(answers),marks:JSON.stringify(marks),score,sent};active=await save(active);},
  mark:async(id,team,marks,score)=>{const r=results(active);for(const member of team?JSON.parse(team):[id])Object.assign(r[member],{marks:JSON.stringify(marks),score});active=await save(active);}
 };
}


export {token,repository};
