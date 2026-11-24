const project='conecta-vera-cruz';
const keyUrl='https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
let keyCache,refresh;
function bytes(s){
 return Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
}
function denied(){return Object.assign(Error('Atualize a página para renovar seu acesso.'),{status:401});}
async function keys(){
 if(keyCache&&keyCache.until>Date.now())return keyCache.keys;
 if(refresh)return refresh;
 refresh=(async()=>{
  const r=await fetch(keyUrl);
  if(!r.ok)throw Object.assign(Error('O serviço de identificação está indisponível.'),{status:503});
  const data=await r.json();
  const pairs=await Promise.all(data.keys.filter(k=>k.kty==='RSA'&&k.kid).map(async k=>
   [k.kid,await crypto.subtle.importKey('jwk',k,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify'])]));
  const ttl=Number(r.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1]??3600);
  keyCache={until:Date.now()+Math.min(ttl,3600)*1000,keys:new Map(pairs)};
  return keyCache.keys;
 })().finally(()=>{refresh=undefined;});
 return refresh;
}
export async function firebaseUser(header){
 const token=header?.match(/^Bearer ([A-Za-z0-9_.-]{1,6000})$/)?.[1],parts=token?.split('.');
 if(parts?.length!==3)throw denied();
 let h,p,sig;
 try{
  const json=s=>JSON.parse(new TextDecoder().decode(bytes(s)));
  h=json(parts[0]);p=json(parts[1]);sig=bytes(parts[2]);
 }catch{throw denied();}
 const now=Date.now()/1000;
 if(h.alg!=='RS256'||typeof h.kid!=='string'||p.aud!==project||p.iss!=='https://securetoken.google.com/'+project||
   typeof p.sub!=='string'||!p.sub.length||p.sub.length>128||!Number.isFinite(p.exp)||p.exp<=now||
   !Number.isFinite(p.iat)||p.iat>now+30||!Number.isFinite(p.auth_time)||p.auth_time>now+30)throw denied();
 const key=(await keys()).get(h.kid);
 if(!key||!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,sig,new TextEncoder().encode(parts[0]+'.'+parts[1])))throw denied();
 return p.sub;
}
