const CONTENT = await fetch('/avaliacao-historia/cadernos.json').then(r=>{if(!r.ok)throw Error('Cadernos indisponíveis');return r.json()});
const ASSETS = Object.fromEntries(['hero','6','7','8','9'].map(key=>[key,'/avaliacao-historia/img/'+key+'.webp']));
let identity;
async function firebaseToken(){
 try{
  identity??=import('./identidade.js');
  return await (await identity).token();
 }catch(e){
  identity=undefined;
  if(e.code==='auth/operation-not-allowed'||e.code==='auth/admin-restricted-operation')throw Error('A escola precisa ativar o acesso anônimo no Firebase Authentication para liberar esta avaliação.');
  throw Error('Não foi possível identificar este navegador. Confira a internet e tente novamente.');
 }
}
'use strict';
const $=s=>document.querySelector(s), main=$('#main'), dlg=$('#dialog'), area=$('#dialog-content');
const paths={book:'M3 4c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z M12 5v14',cap:'M2 9l10-5 10 5-10 5z M6 11v5c4 3 8 3 12 0v-5 M21 10v6',list:'M8 6h12 M8 12h12 M8 18h12 M4 6h.01 M4 12h.01 M4 18h.01',user:'M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M5 20v-2a7 7 0 0 1 14 0v2',layers:'M2 8l10-5 10 5-10 5z M4 13l8 4 8-4 M4 17l8 4 8-4',x:'M5 5l14 14 M19 5L5 19',key:'M7 14a5 5 0 1 1 4-8 5 5 0 0 1 0 5l8 0v3h-3v3h-3v-3z',check:'M4 12l5 5L20 6',print:'M6 9V3h12v6 M6 16H3V9h18v7h-3 M6 14h12v7H6z',download:'M12 3v12 M7 10l5 5 5-5 M4 16v4h16v-4',plus:'M12 4v16 M4 12h16',copy:'M8 8h12v13H8z M5 16H3V3h12v2',lock:'M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4',clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 7v5l3 2',pin:'M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12 M14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0',refresh:'M4 10a8 8 0 0 1 14-4l2 2 M20 3v5h-5 M20 14a8 8 0 0 1-14 4l-2-2 M4 21v-5h5'};
const ico=k=>'<svg aria-hidden="true" class="icon" viewBox="0 0 24 24"><path d="'+paths[k]+'"/></svg>';
const compass='<svg aria-hidden="true" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14.8" stroke="currentColor" stroke-width=".8"/><path d="M20 1v5m0 28v5M1 20h5m28 0h5M9 9l4 4m14 14 4 4M9 31l4-4m14-14 4-4" stroke="currentColor"/><path d="m20 5 3.5 11.5L35 20l-11.5 3.5L20 35l-3.5-11.5L5 20l11.5-3.5Z" fill="currentColor"/><path d="m20 7 0 13 3-3zM33 20H20l3 3zM20 33V20l-3 3zM7 20h13l-3-3z" fill="#19364a"/><circle cx="20" cy="20" r="2" fill="currentColor"/></svg>';
$('#brand-icon').innerHTML=compass;$('#teacher-nav').innerHTML=ico('cap')+'Área da professora';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const gradeList=[6,7,8,9], pts=n=>(n/10).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1}), modeName=m=>m==='written'?'Escrita original':'Múltipla escolha';
const imageTag=(g,cls='')=>'<img class="'+cls+'" src="'+ASSETS[g]+'" alt="'+esc(CONTENT[g].alt)+'">';
let exam=null,panel=null,detail=null,clock=null,view=0,refreshVersion=0,opening=0;
async function api(path,body={}){
 const headers={'Content-Type':'application/json'};
 headers.Authorization='Bearer '+await firebaseToken();
 const reply=await fetch('/avaliacao-historia/api/'+path,{
  method:'POST',credentials:'same-origin',headers,body:JSON.stringify(body),cache:'no-store'
 }).catch(()=>{throw Error('Sem conexão. Confira a internet e tente novamente.');});
 let data;try{data=await reply.json();}catch{throw Error('A avaliação online está temporariamente indisponível. Tente novamente.');}
 if(!reply.ok)throw Error(data.error||'Não foi possível concluir.');
 return data;
}
function err(form,msg){const box=form.querySelector('[role="alert"]');if(box){box.textContent=msg;box.scrollIntoView({block:'nearest'});}}
function formOn(id,fn){const f=$(id);f.onsubmit=async e=>{e.preventDefault();const btn=f.querySelector('[type="submit"]');if(btn.disabled)return;btn.disabled=true;err(f,'');try{await fn(Object.fromEntries(new FormData(f)),f);}catch(ex){err(f,ex.message);}finally{btn.disabled=false;}};}
const errorBox='<div class="error" role="alert"></div>';
function move(){view++;clearInterval(clock);clock=null;exam=null;panel=null;detail=null;if(dlg.open)dlg.close();scrollTo(0,0);}
function modal(html){area.innerHTML=html;if(!dlg.open)dlg.showModal();area.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>dlg.close());}
const closeButton='<button type="button" class="close" data-close aria-label="Fechar">'+ico('x')+'</button>';
function modalHead(title){return '<div class="spread"><h2>'+esc(title)+'</h2>'+closeButton+'</div>';}
dlg.addEventListener('click',e=>{if(e.target===dlg){const p=dlg.getBoundingClientRect();if(e.clientX<p.left||e.clientX>p.right||e.clientY<p.top||e.clientY>p.bottom)dlg.close();}});
function home(){
 move();$('#home-nav').classList.add('active');document.title='Avaliação de História · Conecta Vera Cruz';
 main.innerHTML='<section class="hero"><img class="hero-art" src="'+ASSETS.hero+'" alt="Gravura de um globo terrestre antigo, livros e um mapa."><div class="hero-box"><div class="eyebrow"><span class="gold-rule"></span>III trimestre · 2026</div><h1>Avaliações de <i>História</i></h1><p>De Roma Antiga ao Brasil República, explore o caderno de avaliação da sua turma.</p><div class="hero-meta"><span>'+ico('user')+'Prof.ª Danusa Jesus</span><i class="divider"></i><span>'+ico('layers')+'Ensino Fundamental II</span></div></div></section><section aria-labelledby="cadernos"><div class="sectionline"><div><h2 id="cadernos">Cadernos de avaliação</h2><p>Selecione seu ano. Em cada questão, interprete a situação e marque uma alternativa.</p></div><div class="smallline count"><span>'+ico('book')+'4 cadernos</span></div></div><div class="shelf">'+gradeList.map(g=>{const c=CONTENT[g];return '<button class="card" data-grade="'+g+'" aria-label="Abrir caderno do '+g+'º ano, '+esc(c.title)+'"><span class="cardpic">'+imageTag(g)+'<span class="grade">'+g+'º ano</span></span><span class="cardbody"><span class="cardtitle">'+esc(c.title)+'</span><span class="cardsub">'+esc(c.sub)+'</span><span class="cardfoot"><span>'+ico('book')+'Teste de História</span><span class="mark">3,0 pontos</span></span></span></button>';}).join('')+'</div></section>';
 main.querySelectorAll('[data-grade]').forEach(b=>b.onclick=()=>join(Number(b.dataset.grade)));
}
function navigate(fn){
 if(exam){modal('<div class="pad">'+modalHead('Sair da avaliação?')+'<p>Seu rascunho fica nesta aba. Para continuar, entre novamente com sua identificação.</p><div class="actions"><button class="btn" data-close>Continuar respondendo</button><button class="outline" id="leave">Sair</button></div></div>');$('#leave').onclick=()=>{dlg.close();fn();};}else fn();
}
$('#brand').onclick=$('#home-nav').onclick=()=>panel?leavePanel():navigate(home);
$('#teacher-nav').onclick=()=>navigate(teacher);
function join(g){
 const top='<div class="dialog-top">'+imageTag(g)+closeButton+'</div><div class="pad"><span class="mode-label">'+g+'º ANO</span><h2>'+esc(CONTENT[g].title)+'</h2>';
 modal(top+'<p>Digite o código que a professora passou para abrir a chamada da turma.</p><form id="join" class="form"><label class="field">Código da turma<input name="code" autocomplete="off" spellcheck="false" autocapitalize="characters" required maxlength="8" minlength="8" placeholder="8 caracteres"></label>'+errorBox+'<button type="submit" class="btn">'+ico('list')+'Abrir chamada</button></form></div>');
 formOn('#join',async b=>{const code=b.code.trim().toUpperCase();const r=await api('class',{grade:g,code});
  if(!r.students.length)throw Error('A chamada está vazia. Peça à professora para adicionar seu nome.');
  chooseMembers(g,code,r,top);
 });
}
function chooseMembers(grade,code,data,top,previous=[]){
 const students=sorted(data.students),selected=new Set(previous.map(member=>member.id));
 const intro='<p class="muted">'+esc(data.room.label)+' · '+modeName(data.room.mode)+'</p>';
 const rows=students.map((s,i)=>'<label class="member-option"><input type="checkbox" name="member" value="'+i+'" '+(selected.has(s.id)?'checked':'')+'><span>'+esc(s.name)+'</span></label>').join('');
 modal(top+intro+'<form class="form" id="choose-members"><fieldset class="member-field"><legend>Quem vai responder?</legend><p>Marque um nome para fazer a avaliação individualmente ou vários nomes para formar um grupo.</p><div class="member-list">'+rows+'</div></fieldset><p id="picked" class="picked" aria-live="polite"></p>'+errorBox+'<button type="submit" class="btn">Continuar</button></form></div>');
 const form=$('#choose-members'),picked=()=>Array.from(form.querySelectorAll('input:checked'),box=>students[Number(box.value)]);
 const update=()=>{const n=picked().length;$('#picked').textContent=n===0?'Nenhum participante selecionado.':n===1?'1 participante · Avaliação individual':n+' participantes · Avaliação em grupo';form.querySelector('[type="submit"]').disabled=!n;};
 form.onchange=update;update();
 formOn('#choose-members',async()=>{
  const members=picked();if(!members.length)throw Error('Marque pelo menos um nome.');
  const multiple=members.length>1;
  modal(top+intro+'<form id="identify" class="form"><div><h3 class="member-title">'+(multiple?'Confirmar o grupo':'Confirmar identificação')+'</h3><p class="member-hint">'+(multiple?'Cada participante digita a própria chave. O grupo envia uma única avaliação e a mesma nota aparece para todos.':'Digite sua chave para abrir a avaliação ou consultar sua entrega.')+'</p></div>'+members.map((s,i)=>'<label class="field member-key"><span>'+esc(s.name)+'</span><input name="pin'+i+'" type="password" required minlength="8" maxlength="8" autocomplete="off" spellcheck="false" autocapitalize="characters" placeholder="Chave individual" aria-label="Chave individual de '+esc(s.name)+'"></label>').join('')+errorBox+'<div class="actions"><button type="button" class="outline" id="change-members">Alterar seleção</button><button type="submit" class="btn">'+ico('book')+'Abrir avaliação</button></div></form></div>');
  $('#change-members').onclick=()=>chooseMembers(grade,code,data,top,members);
  formOn('#identify',async b=>{
   const auth={grade,code,members:members.map((s,i)=>({id:s.id,pin:b['pin'+i].trim().toUpperCase()}))};
   const info=await api('start',auth);dlg.close();if(info.result){resultPage(info,info.result);return;}begin(info,auth);
  });
 });
}
function sorted(s){return [...s].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));}
function begin(info,auth){
 move();$('#home-nav').classList.remove('active');const g=auth.grade,qs=CONTENT[g].objective,key='atlas-draft:'+CONTENT[g].edition+':'+info.room.id +':'+auth.members.map(m=>m.id).sort().join('|');
 let draft;try{draft=JSON.parse(sessionStorage.getItem(key));}catch{}
 exam={info,auth,qs,key,answers:Array.isArray(draft?.answers)&&draft.answers.length===qs.length?draft.answers:Array(qs.length).fill(null),i:Math.max(0,Math.min(qs.length-1,Number(draft?.i)||0))};question();
}
function saveDraft(){try{sessionStorage.setItem(exam.key,JSON.stringify({answers:exam.answers,i:exam.i}));}catch{}}
const answered=x=>Number.isInteger(x);
function question(){
 const {info,auth,qs,i,answers}=exam,g=auth.grade,c=CONTENT[g],q=qs[i],n=qs.length;const count=answers.filter(answered).length;
 main.innerHTML='<div class="pagehead"><div class="eyebrow">'+g+'º ano · '+esc(info.room.label)+'</div><h1 class="page-title">'+esc(c.title)+'</h1><p>'+esc(info.name)+' · '+modeName(info.room.mode)+' · 3,0 pontos</p></div><div class="quizgrid"><aside class="panel side">'+imageTag(g)+'<div class="inside"><h3>Seu caderno</h3><p id="completion">'+count+' de '+n+' respondidas</p><div class="dots" aria-label="Navegar entre questões">'+qs.map((_,j)=>'<button data-q="'+j+'" class="'+(answered(answers[j])?'done ':'')+(j===i?'current':'')+'" aria-label="Questão '+(j+1)+'" '+(j===i?'aria-current="step"':'')+'>'+(j+1)+'</button>').join('')+'</div></div></aside><section class="panel"><div class="spread"><b>Questão '+(i+1)+' de '+n+'</b><span class="pill">'+pts(30/n)+' ponto'+(n===3?'':'')+'</span></div><div class="progress"><span style="width:'+100*(i+1)/n+'%"></span></div><h2 class="question" id="enunciado">'+esc(q.prompt)+'</h2><div role="radiogroup" aria-labelledby="enunciado">'+q.options.map((o,j)=>'<label class="answer"><input name="option" type="radio" value="'+j+'" '+(answers[i]===j?'checked':'')+'><strong>'+String.fromCharCode(65+j)+'</strong><span>'+esc(o)+'</span></label>').join('')+'</div><div class="error" id="qerror" role="alert"></div><div class="actions spread"><button class="outline" id="prev" '+(i===0?'disabled':'')+'>Anterior</button><button class="btn" id="next">'+(i===n-1?'Revisar e entregar':'Próxima questão')+'</button></div></section></div>';
 const storeAnswer=v=>{exam.answers[i]=v;saveDraft();$('#completion').textContent=exam.answers.filter(answered).length+' de '+n+' respondidas';document.querySelector('[data-q="'+i+'"]').classList.toggle('done',answered(v));$('#qerror').textContent='';};
 const jump=j=>{exam.i=j;saveDraft();question();$('#enunciado').setAttribute('tabindex','-1');$('#enunciado').focus({preventScroll:true});};
 main.querySelectorAll('[name="option"]').forEach(b=>b.onchange=()=>storeAnswer(Number(b.value)));
 main.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>jump(Number(b.dataset.q)));$('#prev').onclick=()=>jump(i-1);$('#next').onclick=()=>{if(i<n-1){jump(i+1);return;}
 const first=exam.answers.findIndex(x=>!answered(x));if(first>=0){jump(first);$('#qerror').textContent='Esta questão precisa de uma resposta antes da entrega.';return;}
 modal('<div class="pad">'+modalHead('Entregar sua avaliação?')+'<p>As '+n+' questões serão entregues em nome de <b>'+esc(info.name)+'</b>.</p>'+(info.count>1?'<p class="note">A nota desta entrega será registrada para cada participante.</p>':'')+'<form id="send"><div class="actions"><button type="button" class="outline" data-close>Voltar à revisão</button><button type="submit" class="btn">'+ico('check')+'Confirmar entrega</button></div>'+errorBox+'</form></div>');formOn('#send',async()=>{const r=await api('submit',{...auth,edition:c.edition,answers:exam.answers});try{sessionStorage.removeItem(exam.key);}catch{}dlg.close();resultPage(info,r);});
 };
}
function resultPage(info,r){
 move();main.innerHTML='<section class="panel result"><div class="seal">'+ico('check')+'</div><span class="mode-label">AVALIAÇÃO ENTREGUE</span><h1 class="page-title">'+(r.score===null?'Respostas recebidas':info.count>1?'Nota do grupo':'Sua nota de História')+'</h1><p>'+esc(info.name)+' · '+esc(info.room.label)+'</p>'+(r.score===null?'<p class="note">A professora recebeu suas respostas para correção. Entre novamente com sua chave para consultar a nota.</p>':'<div class="big-score">'+pts(r.score)+' <small>/ 3,0</small></div><p>'+esc(r.mode==='objective'?r.marks.filter(n=>n>0).length+' de '+r.marks.length+' questões corretas.':'Correção da professora concluída.')+'</p>')+(info.count>1?'<p>Entrega registrada para os '+info.count+' participantes.</p>':'')+'<p class="muted">'+('Entrega registrada no painel da professora.')+'</p><div class="actions"><button class="btn" id="done">Voltar aos cadernos</button></div></section>';$('#done').onclick=home;
}
async function leavePanel(){
 try{await api('lock');home();}
 catch(e){modal('<div class="pad">'+modalHead('Fechar o painel')+'<p class="error">'+esc(e.message)+'</p></div>');}
}
async function teacher(){
 move();const stamp=view;$('#home-nav').classList.remove('active');main.innerHTML='<div class="panel loginpanel" aria-live="polite">Abrindo o painel da professora…</div>';
 try{const access=await api('access');if(view!==stamp)return;
 if(!access.teacher){
  if(access.teacherDevice===false){
   main.innerHTML='<section class="panel loginpanel"><div class="mode-label">'+ico('lock')+' ACESSO DA PROFESSORA</div><h1 class="page-title">Abra no computador da professora</h1><p>Este é o endereço dos alunos na rede da escola. No computador em que você iniciou o Atlas, abra o endereço da professora indicado na janela do servidor.</p><button id="back-to-books" class="outline">Voltar aos cadernos</button></section>';
   $('#back-to-books').onclick=home;return;
  }
  const file=access.host==='file',first=file&&!access.configured;
  const title=first?'Criar senha da professora':'Área da professora';
  const help=first?'Defina uma senha para esta cópia.':'Digite a senha da professora para acessar as chamadas e as notas.';
  main.innerHTML='<section class="panel loginpanel"><div class="mode-label">'+ico('lock')+' ACESSO DA PROFESSORA</div><h1 class="page-title">'+title+'</h1><p>'+help+'</p><form id="unlock" class="form"><div class="field"><label for="teacher-password">Senha</label><div class="password-row"><input id="teacher-password" type="password" name="password" minlength="6" required spellcheck="false" autocapitalize="none" autocorrect="off" autocomplete="'+(first?'new-password':'current-password')+'"><button id="show-password" type="button" class="outline" aria-controls="teacher-password">Mostrar senha</button></div></div>'+errorBox+'<button class="btn" type="submit">'+(first?'Criar senha e abrir painel':'Entrar no painel')+'</button></form></section>';
  const passwordInput=$('#teacher-password'),toggle=$('#show-password');
  toggle.onclick=()=>{
   const show=passwordInput.type==='password';
   passwordInput.type=show?'text':'password';
   toggle.textContent=show?'Ocultar senha':'Mostrar senha';
  };
  formOn('#unlock',async b=>{await api('unlock',b);await teacher();});return;
 }
 const data=await api('t/rooms');if(view!==stamp)return;panel={rooms:data.rooms.slice().sort((a,b)=>a.grade-b.grade||a.label.localeCompare(b.label,'pt-BR')),access,current:data.rooms[0]?.id};
 main.innerHTML='<div class="pagehead"><div class="eyebrow">III trimestre · 2026</div><div class="spread"><h1 class="page-title">Painel da professora</h1><button class="outline" id="logout">Sair do painel</button></div><p>Organize as chamadas, distribua as chaves e acompanhe as entregas.</p></div>'+(access.host==='file'?'<p class="note">Modo neste dispositivo. Os resultados ficam no navegador em que a avaliação foi feita. Para reunir as notas de outros aparelhos, use a versão com servidor.</p>':access.studentUrl?'<div class="note spread"><span>Endereço para os alunos <b id="student-link">'+esc(access.studentUrl)+'</b></span><button type="button" class="outline" id="copy-link">Copiar endereço</button></div>':'')+'<div class="dashgrid"><aside class="panel"><h2>Turmas</h2><div class="roomlist" id="rooms"></div><div class="actions"><button class="outline" id="new-room">'+ico('plus')+'Nova turma</button></div></aside><section class="panel dashboard" id="details" aria-label="Chamada e notas"></section></div>';
 const copyLink=$('#copy-link');
 if(copyLink)copyLink.onclick=async()=>{
  try{await navigator.clipboard.writeText(access.studentUrl);copyLink.textContent='Endereço copiado';}
  catch{const range=document.createRange();range.selectNodeContents($('#student-link'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);copyLink.textContent='Endereço selecionado para copiar';}
 };
 $('#new-room').onclick=newRoom;$('#logout').onclick=leavePanel;
 renderRooms();await refreshDetail(true);if(view===stamp)clock=setInterval(()=>{if(!document.hidden&&!dlg.open)refreshDetail(false);},8000);
 }catch(e){if(view===stamp)main.innerHTML='<div class="panel loginpanel"><p class="error">'+esc(e.message)+'</p><button class="outline" id="rt">Tentar novamente</button></div>';if($('#rt'))$('#rt').onclick=teacher;}
}
function renderRooms(){
 $('#rooms').innerHTML=panel.rooms.map(r=>'<button class="'+(r.id===panel.current?'on':'')+'" data-room="'+esc(r.id)+'">'+esc(r.label)+'<span class="sub">'+r.grade+'º ano · '+modeName(r.mode)+'</span></button>').join('');
 $('#rooms').querySelectorAll('button').forEach(b=>b.onclick=()=>{panel.current=b.dataset.room;detail=null;renderRooms();refreshDetail(true);});
}
function rosterLabel(s){return !s.sent?'Sem entrega':s.score===null?'A corrigir':pts(s.score)+' / 3,0';}
async function refreshDetail(force){
 const active=panel;if(!active)return;const id=active.current,version=++refreshVersion,box=$('#details');
 if(force)box.innerHTML='<p>Carregando chamada…</p>';try{
 const data=await api('t/detail',{room:id});if(panel!==active||active.current!==id||version!==refreshVersion)return;
 data.students=sorted(data.students);if(!force&&JSON.stringify(data)===JSON.stringify(detail)){const el=$('#live');if(el)el.textContent='Atualização automática a cada 8 s';return;}detail=data;const r=data.room,ss=data.students,sent=ss.filter(s=>s.sent).length,graded=ss.filter(s=>s.sent&&s.score!==null).length;
 box.innerHTML='<div class="spread"><div><div class="mode-label">'+r.grade+'º ANO · '+modeName(r.mode).toUpperCase()+'</div><h2>'+esc(r.label)+'</h2></div><span class="pill">Valor 3,0</span></div><div class="line"><span>Código da turma <b class="code">'+esc(r.code)+'</b></span><button class="outline" id="tickets">'+ico('print')+'Fichas de acesso</button></div><div class="stats"><span><b>'+ss.length+'</b> na chamada</span><span><b>'+sent+'</b> com entrega</span><span><b>'+graded+'</b> com nota</span></div><div class="spread"><h3>Chamada e resultados</h3><div class="line"><button class="outline" id="add">'+ico('plus')+'Nomes</button><button class="outline" id="csv">'+ico('download')+'CSV</button></div></div><div class="scroll"><table><thead><tr><th>Estudante</th><th>Resultado</th><th>Entrega</th></tr></thead><tbody>'+ss.map(s=>'<tr><td>'+esc(s.name)+(s.group.length?'<small class="group-tag">Em grupo · '+s.group.length+' participantes</small>':'')+'</td><td>'+esc(rosterLabel(s))+'</td><td>'+(s.sent?'<button class="textbtn" data-review="'+esc(s.id)+'">'+(s.score===null?'Corrigir':'Ver respostas')+'</button>':'—')+'</td></tr>').join('')+'</tbody></table></div>'+(!ss.length?'<p class="note">Clique em “Nomes” para colar a chamada desta turma.</p>':'')+'<div class="spread"><p class="tip" id="live">Atualização automática a cada 8 s</p><button class="textbtn" id="manual">Atualizar</button></div>';
 $('#manual').onclick=()=>refreshDetail(true);$('#add').onclick=addNames;$('#csv').onclick=csv;$('#tickets').onclick=tickets;box.querySelectorAll('[data-review]').forEach(b=>b.onclick=()=>review(b.dataset.review));
 }catch(e){if(panel!==active||active.current!==id||version!==refreshVersion)return;if($('#live'))$('#live').textContent=e.message;else{box.innerHTML='<p class="error">'+esc(e.message)+'</p><button class="outline" id="reload-c">Tentar novamente</button>';$('#reload-c').onclick=()=>refreshDetail(true);}}
}
function addNames(){
 const r=detail.room;modal('<div class="pad">'+modalHead('Adicionar à chamada')+'<p>'+esc(r.label)+'</p><form class="form" id="addform"><label class="field">Nomes dos estudantes<textarea name="names" rows="7" required placeholder="Um nome por linha"></textarea></label>'+errorBox+'<button type="submit" class="btn">Salvar na chamada</button></form></div>');
 formOn('#addform',async b=>{await api('t/add',{room:r.id,names:b.names.split(/\r?\n/)});dlg.close();await refreshDetail(true);});
}
function newRoom(){
 modal('<div class="pad">'+modalHead('Nova turma ou avaliação')+'<p>Escolha o ano e prepare a chamada. A turma receberá um código para a avaliação de múltipla escolha.</p><form class="form" id="newform"><label class="field">Ano<select name="grade" id="ng">'+gradeList.map(g=>'<option value="'+g+'">'+g+'º ano</option>').join('')+'</select></label><label class="field">Nome da turma<input required maxlength="70" name="label" placeholder="Ex.: 8º B · Vespertino"></label><label class="field">Chamada<textarea rows="5" name="names" id="nn" placeholder="Um nome por linha" required></textarea></label><button type="button" class="outline" id="reuse">'+ico('copy')+'Usar chamada do mesmo ano</button>'+errorBox+'<button type="submit" class="btn">Criar turma</button></form></div>');
 $('#reuse').onclick=async()=>{try{const r=panel.rooms.find(r=>r.grade===Number($('#ng').value)&&r.id.startsWith('matutino-'));const x=await api('t/detail',{room:r.id});if(!x.students.length)throw Error('A chamada deste ano ainda está vazia. Cole os nomes no campo acima.');$('#nn').value=sorted(x.students).map(s=>s.name).join('\n');}catch(e){err($('#newform'),e.message);}};
 formOn('#newform',async b=>{const {room}=await api('t/create',{...b,names:b.names.split(/\r?\n/)});panel.rooms.push(room);panel.rooms.sort((a,b)=>a.grade-b.grade||a.label.localeCompare(b.label,'pt-BR'));panel.current=room.id;dlg.close();renderRooms();await refreshDetail(true);});
}
function tickets(){
 const {room:r,students:ss}=detail;
 if(!ss.length){addNames();return;}
 const list=ss.map(s=>'<div class="ticket"><b>'+esc(s.name)+'</b><p>'+esc(r.label)+' · '+r.grade+'º ano</p><p>Turma <b class="code">'+esc(r.code)+'</b> · Chave <b class="code">'+esc(s.pin)+'</b></p></div>').join('');
 const host=panel.access.studentUrl||location.origin+'/avaliacao-historia/';
 $('#print-area').innerHTML='<h1>Atlas da História · Fichas de acesso</h1><p>'+esc(host)+'</p><div class="tickets">'+list+'</div>';
 modal('<div class="pad">'+modalHead('Fichas de acesso')+'<p>Entregue a cada estudante a sua chave individual e o código da turma.</p><div class="line"><b class="code">'+esc(r.code)+'</b><button class="outline" id="print">'+ico('print')+'Imprimir fichas</button></div><div class="scroll"><table><thead><tr><th>Estudante</th><th>Chave individual</th></tr></thead><tbody>'+ss.map(s=>'<tr><td>'+esc(s.name)+'</td><td class="code">'+esc(s.pin)+'</td></tr>').join('')+'</tbody></table></div></div>');$('#print').onclick=()=>window.print();
}
dlg.addEventListener('close',()=>{$('#print-area').innerHTML='';});
function csv(){
 const {room:r,students:ss}=detail;const rows=[['Turma','Estudante','Situação','Nota','Valor','Entrega','Participantes do grupo'],...ss.map(s=>[r.label,s.name,!s.sent?'Sem entrega':s.score===null?'A corrigir':'Corrigida',s.score===null||!s.sent?'':pts(s.score),'3,0',s.sent?new Date(s.sent).toLocaleString('pt-BR',{timeZone:'America/Bahia'}):'',s.group.join(' · ')])];
 const format=x=>'"'+(/^[\s]*[=+@-]/.test(String(x))?"'":'')+String(x).replaceAll('"','""')+'"';const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(row=>row.map(format).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Historia_'+r.grade+'ano_'+r.code+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
async function review(id){
 const {room:r}=detail;modal('<div class="pad">'+modalHead('Respostas do estudante')+'<p>Carregando…</p></div>');
 try{const res=await api('t/review',{room:r.id,student:id});if(!dlg.open)return;
 const written=res.mode==='written',qs=res.questions;modal('<div class="pad">'+modalHead(res.name)+'<p>'+esc(r.label)+' · '+modeName(res.mode)+'</p>'+(res.group.length?'<p class="note"><b>Entrega em grupo</b><br>'+res.group.map(esc).join(' · ')+(written?'<br>A correção vale para todos os participantes.':'')+'</p>':'')+(written?'<p class="note">'+(r.grade===8?'Por questão: compreensão histórica (0,4), relação entre acontecimentos (0,4) e elaboração própria (0,2).':'Considere a compreensão histórica, a justificativa e a elaboração com palavras próprias.')+'</p>':'')+'<form class="form" id="markform">'+qs.map((q,i)=>'<section class="reviewblock"><b>Questão '+(i+1)+'</b><p>'+esc(q.prompt)+'</p><p><b>Resposta</b><br>'+esc(written?res.answers[i]:q.options[res.answers[i]])+'</p>'+(written?'<label class="field">Nota (0 a 1)<input type="number" required min="0" max="1" step="0.1" name="m'+i+'" value="'+(res.marks?res.marks[i]/10:'')+'"></label>':'<span class="pill">'+pts(res.marks[i])+' ponto</span>')+'</section>').join('')+errorBox+(written?'<button type="submit" class="btn">Salvar nota da avaliação</button>':'<button type="button" class="outline" data-close>Fechar</button>')+'</form></div>');
 if(written)formOn('#markform',async b=>{await api('t/grade',{room:r.id,student:id,marks:qs.map((_,i)=>Math.round(Number(b['m'+i])*10))});dlg.close();await refreshDetail(true);});
 }catch(e){modal('<div class="pad">'+modalHead('Respostas')+'<p class="error">'+esc(e.message)+'</p></div>');}
}
if(new URLSearchParams(location.search).get('professora')==='1')teacher();else home();
