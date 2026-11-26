// Conteúdo e gabaritos oficiais vêm exclusivamente dos segredos do Worker.
const titles={"6":"Antiguidade e Idade Média","7":"Escravidão, resistências e transformações econômicas","8":"A construção do Brasil Imperial","9":"O mundo contemporâneo","10":"Educação e Diversidade Cultural"};
export async function privateExam(env,grade,proof){
 const edition=proof?'prova-iii-2026-v1':'teste-eja-iii-2026-v1';
 const fallback={title:titles[grade],edition,objective:[],archive:{},available:false};
 const raw=env[proof?'ATLAS_PROVA_'+grade:'ATLAS_TESTE_EJA'];if(!raw)return fallback;
 try{
  const bytes=Uint8Array.from(atob(raw),c=>c.charCodeAt(0));
  const data=JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
  const n=proof&&Number(grade)===10?6:10;
  if(data.edition!==edition||!Array.isArray(data.objective)||data.objective.length!==n||data.objective.some(q=>typeof q.prompt!=='string'||!Array.isArray(q.options)||q.options.length<2||q.options.some(x=>typeof x!=='string')||!Number.isInteger(q.key)||q.key<0||q.key>=q.options.length))return fallback;
  return {...data,archive:{},available:true};
 }catch{return fallback;}
}