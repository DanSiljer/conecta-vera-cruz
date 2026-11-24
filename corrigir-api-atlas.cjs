const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const file = name => path.join(root,name);
function stop(message){throw Error(message);}
function readJSONC(text){
  const stripped=text.replace(/^\uFEFF/,'').replace(/("(?:\\[\s\S]|[^"\\])*")|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g,(all,str)=>str??'');
  return JSON.parse(stripped.replace(/("(?:\\[\s\S]|[^"\\])*")|,\s*(?=[}\]])/g,(all,str)=>str??''));
}
if(!fs.existsSync(file('index.html'))||!fs.existsSync(file('assets'))||!fs.existsSync(file('avaliacoes-escolares.html')))stop('Extraia na raiz do site completo, junto ao index.html e avaliacoes-escolares.html.');
if(!fs.existsSync(file('atlas-backend/worker.mjs'))||!fs.existsSync(file('atlas-backend/avaliacoes.mjs')))stop('Pasta atlas-backend incompleta.');
const configs=['wrangler.jsonc','wrangler.json','wrangler.toml'].filter(n=>fs.existsSync(file(n)));
if(configs.length!==1||configs[0].endsWith('.toml'))stop('Esperado um unico wrangler.jsonc ou wrangler.json existente. Nao alterei a configuracao; revise o arquivo manualmente.');
const name=configs[0];const original=fs.readFileSync(file(name),'utf8');const c=readJSONC(original);
if(c.pages_build_output_dir)stop('Este arquivo configura Pages, nao Workers. Nao alterei nada.');
if(c.name!=='conecta-vera-cruz')stop('Nome do Worker diferente do esperado. Confira o projeto antes de publicar.');
if(c.main&&c.main!=='atlas-backend/worker.mjs'&&c.main!=='./atlas-backend/worker.mjs')stop('Ja existe outro Worker principal: '+c.main+'. Integre a rota ao Worker existente; nao substitua.');
if(!c.assets||path.resolve(root,c.assets.directory||'')!==root||!c.assets.directory)stop('A pasta de assets nao e a raiz. Nao alterei nada.');
if(c.assets.binding&&c.assets.binding!=='ASSETS')stop('Ja existe um binding de assets com outro nome. Nao alterei nada.');
if(c.env&&Object.keys(c.env).length)stop('Existem ambientes personalizados. Revise o arquivo antes de alterar a producao.');
const first=c.assets.run_worker_first;
if(Array.isArray(first)&&first.some(x=>typeof x==='string'&&x.startsWith('!')&&('/api/avaliacoes/health'.startsWith(x.slice(1).split('*')[0])||x.slice(1).startsWith('/api/avaliacoes'))))stop('Existe uma exclusao de rota da API. Revise run_worker_first.');
c.main='./atlas-backend/worker.mjs';c.assets.binding='ASSETS';
if(first!==true)c.assets.run_worker_first=[...new Set([...(Array.isArray(first)?first:[]),'/api/avaliacoes/*','/api/avaliacoes'])];
function append(name,lines){const p=file(name);let s=fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';const existing=new Set(s.split(/\r?\n/).map(x=>x.trim()));for(const l of lines)if(!existing.has(l))s+='\n'+l;fs.writeFileSync(p,s.trimEnd()+'\n');}
const backup=file(name+'.antes-atlas.bak');if(!fs.existsSync(backup))fs.writeFileSync(backup,original);
append('.assetsignore',['/atlas-backend/','/functions/','/corrigir-api-atlas.cjs','/LEIA-ME-ATLAS.txt','/wrangler.jsonc','/wrangler.json','/wrangler.toml','/wrangler.jsonc.antes-atlas.bak','/wrangler.json.antes-atlas.bak','**/.env','**/.env.*','**/.dev.vars','**/.dev.vars.*','**/*firebase-adminsdk*.json','**/*service-account*.json','**/*service_account*.json','**/*.pem','**/*.key','**/*.p12','**/*.zip','/firestore.rules','/firestore-regras-completas.rules','/preparar-site-avaliacoes.cjs','/publicar-avaliacoes.ps1']);
append('.gitignore',['/atlas-backend/','/functions/api/avaliacoes/','/corrigir-api-atlas.cjs','/LEIA-ME-ATLAS.txt','/wrangler.jsonc.antes-atlas.bak','/wrangler.json.antes-atlas.bak','.dev.vars*','.env*','*firebase-adminsdk*.json','*service-account*.json','*service_account*.json','*.pem','*.key','*.p12']);
fs.writeFileSync(file(name),JSON.stringify(c,null,2)+'\n');
console.log('Configuracao Workers atualizada: '+name);console.log('Gabarito e arquivos privados excluidos dos assets.');console.log('Nenhuma publicacao realizada. Confira com npx wrangler deploy --dry-run e depois npx wrangler deploy.');
