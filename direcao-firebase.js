import {firebaseConfig,isConfigured} from './firebase-config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,sendPasswordResetEmail,signOut} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,getDoc,collection,query,orderBy,getDocs,updateDoc,setDoc,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
const $=id=>document.getElementById(id);let auth,db,all=[],selected=null;
const labels={aluno:'Estudante',nascimento:'Nascimento',matricula:'Registro escolar',serie:'Série cursada',turno:'Turno',responsavel:'Responsável',parentesco:'Parentesco',telefone:'Telefone',email:'E-mail',rua:'Logradouro',numero:'Número',bairro:'Comunidade',cidade:'Município',uf:'UF',referencia:'Referência',anoLetivo:'Ano letivo',agendamentoData:'Entrega da documentação — data',agendamentoHora:'Entrega da documentação — horário',status:'Situação'};
if(isConfigured){try{const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app)}catch(e){$('loginError').textContent='Erro na configuração do sistema.'}}else{$('loginError').textContent='Sistema ainda não configurado pela escola. O login será liberado após ativar o Firebase.';$('loginButton').disabled=true}
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function showDashboard(ok){$('dashboard').style.display=ok?'block':'none';$('login').style.display=ok?'none':'block';$('logout').classList.toggle('hide',!ok);if(!ok){all=[];selected=null;$('detail').style.display='none'}}
async function authorized(uid){const snap=await getDoc(doc(db,'direcaoUsuarios',uid));return snap.exists()&&snap.data().ativo===true}
if(auth)onAuthStateChanged(auth,async user=>{if(!user){showDashboard(false);return}try{if(!(await authorized(user.uid))){$('loginError').textContent='Este usuário não foi autorizado pela direção.';await signOut(auth);return}showDashboard(true);await Promise.all([load(),loadSlots(),loadAgendaConfig()])}catch(e){console.error(e);$('loginError').textContent='Falha ao verificar acesso. Consulte o administrador.';await signOut(auth)}});
$('loginForm').addEventListener('submit',async e=>{e.preventDefault();if(!auth)return;const b=$('loginButton');b.disabled=true;$('loginError').textContent='';try{await signInWithEmailAndPassword(auth,$('email').value.trim(),$('password').value)}catch(e){$('loginError').textContent='Não foi possível entrar. Confira seu e-mail, senha e autorização.'}finally{b.disabled=false}});
$('resetPassword').addEventListener('click',async()=>{
  if(!auth){$('loginError').textContent='Configure o Firebase antes de recuperar a senha.';return;}
  const email=$('email').value.trim();
  if(!email){$('loginError').textContent='Informe seu e-mail institucional para receber o link de recuperação.';$('email').focus();return;}
  try{await sendPasswordResetEmail(auth,email);$('loginError').textContent='Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.';}
  catch(e){console.error(e);$('loginError').textContent='Não foi possível solicitar a recuperação. Confira o e-mail e tente novamente.';}
});
$('logout').onclick=()=>auth&&signOut(auth);
async function load(){const msg=$('loadMsg');msg.textContent='Carregando...';try{const snapshot=await getDocs(query(collection(db,'rematriculas'),orderBy('criadoEm','desc')));all=snapshot.docs.map(d=>({id:d.id,...d.data()}));render();msg.textContent=all.length+' registros recebidos'}catch(e){console.error(e);msg.textContent='Não foi possível carregar a lista. Confira as permissões.'}}
function render(){let text=$('search').value.toLowerCase().trim(),filter=$('filter').value;const filtered=all.filter(x=>(filter==='todos'||x.status===filter)&&[x.aluno,x.responsavel,x.id,x.agendamentoData,formatDate(x.agendamentoData||''),x.agendamentoHora].join(' ').toLowerCase().includes(text));$('countAll').textContent=all.length;$('countPending').textContent=all.filter(x=>x.status==='pendente').length;$('countChecked').textContent=all.filter(x=>x.status==='conferida').length;$('countBooked').textContent=all.filter(x=>x.agendamentoSlotId).length;$('rows').replaceChildren();for(const x of filtered){const tr=document.createElement('tr');const date=x.criadoEm?.toDate?.().toLocaleDateString('pt-BR')||'—';for(const val of [date,x.aluno||'—',x.serie||'—',x.responsavel||'—']){let td=document.createElement('td');td.textContent=val;tr.appendChild(td)}
let bookingTd=document.createElement('td');
if(x.agendamentoData&&x.agendamentoHora){
 const day=document.createElement('span');day.className='booking-date';day.textContent=formatDate(x.agendamentoData);
 const time=document.createElement('span');time.className='booking-time';time.textContent='às '+x.agendamentoHora;
 bookingTd.append(day,time);
}else{const none=document.createElement('span');none.className='booking-none';none.textContent='Não agendado';bookingTd.append(none)}
tr.appendChild(bookingTd);
let stat=document.createElement('td');stat.innerHTML='<span class="pill '+(x.status||'')+'">'+escape(({pendente:'Pendente',conferida:'Conferida',pendencia:'Com pendência'})[x.status]||'Pendente')+'</span>';tr.appendChild(stat);let last=document.createElement('td'),btn=document.createElement('button');btn.textContent='Abrir ficha';btn.onclick=()=>openDetail(x.id);last.append(btn);tr.append(last);$('rows').append(tr)}if(!filtered.length)$('rows').innerHTML='<tr><td colspan="7">Nenhum pedido encontrado.</td></tr>'}
$('search').oninput=render;$('filter').onchange=render;
function openDetail(id){selected=all.find(x=>x.id===id);if(!selected)return;$('detailProtocol').textContent='Protocolo: '+id.toUpperCase();$('detailStatus').value=selected.status||'pendente';$('detailGrid').replaceChildren();for(const [key,label] of Object.entries(labels)){let cell=document.createElement('div'),small=document.createElement('small'),strong=document.createElement('strong');small.textContent=label;strong.textContent=String(selected[key]??'Não informado');cell.append(small,strong);$('detailGrid').append(cell)}$('detailFeedback').textContent='';$('detail').style.display='block';$('detail').scrollIntoView({behavior:'smooth',block:'start'})}
$('closeDetail').onclick=()=>{$('detail').style.display='none';selected=null};
$('printDetail').onclick=()=>{if(selected)window.print()};
$('saveStatus').onclick=async()=>{if(!selected)return;const b=$('saveStatus');b.disabled=true;try{await updateDoc(doc(db,'rematriculas',selected.id),{status:$('detailStatus').value,atualizadoEm:serverTimestamp()});selected.status=$('detailStatus').value;$('detailFeedback').textContent='Situação atualizada.';render();openDetail(selected.id)}catch(e){console.error(e);$('detailFeedback').textContent='Erro ao salvar alteração.'}finally{b.disabled=false}};
$('exportCsv').onclick=()=>{if(!all.length)return;const keys=['id','aluno','nascimento','matricula','serie','turno','responsavel','parentesco','telefone','email','rua','numero','bairro','cidade','uf','referencia','agendamentoData','agendamentoHora','status'];const csv=[keys.join(';'),...all.map(x=>keys.map(k=>'"'+String(x[k]??'').replaceAll('"','""')+'"').join(';'))].join('\r\n');const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='rematriculas-2027.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};


// Administração da agenda; as permissões são verificadas nas regras do Firestore.
let slots=[],editingSlotId=null;
const formatDate=s=>{const [y,m,d]=String(s).split('-');return d&&m&&y?`${d}/${m}/${y}`:s;};
const slotKey=(date,time)=>date+'_'+time.replace(':','');
const todayBahia=()=>{const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bahia',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const v=k=>parts.find(x=>x.type===k)?.value;return `${v('year')}-${v('month')}-${v('day')}`;};
$('slotDate').min=todayBahia();
const makeCell=(row,text)=>{const td=document.createElement('td');td.textContent=String(text??'—');row.appendChild(td);return td;};
async function loadSlots(){
  $('slotFeedback').textContent='Carregando horários…';
  try{const snapshot=await getDocs(query(collection(db,'agendaRematricula'),orderBy('data')));
    slots=snapshot.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.data+' '+a.hora).localeCompare(b.data+' '+b.hora));
    renderSlots();$('slotFeedback').textContent=slots.length+' horário(s) cadastrado(s).';
  }catch(e){console.error('Falha ao carregar a agenda:', e);const code=e?.code||'erro-desconhecido';$('slotFeedback').textContent=code==='permission-denied'?'Acesso negado ao consultar agendaRematricula. Publique as regras de agenda no Firebase (Firestore → Regras).':code==='failed-precondition'?'Consulta da agenda requer uma configuração/índice no Firestore. Veja o erro no console do navegador.':code==='unavailable'?'Firebase indisponível ou conexão instável. Confira a internet e tente novamente.':'Não foi possível carregar a agenda ('+code+'). Confira o console do navegador e o projeto Firebase.';}
}
function renderSlots(){
 const root=$('slotRows');root.replaceChildren();
 const count=$('slotListCount');if(count)count.textContent=slots.length+' horário(s)';
 if(!slots.length){root.innerHTML='<tr><td colspan="6">Nenhum horário aberto. Cadastre o primeiro acima.</td></tr>';return;}
 for(const slot of slots){const tr=document.createElement('tr');
  makeCell(tr,formatDate(slot.data));makeCell(tr,slot.hora);makeCell(tr,slot.ocupadas);makeCell(tr,slot.vagas);
  const td=document.createElement('td');const tag=document.createElement('span');const full=slot.ocupadas>=slot.vagas;
  tag.className='agenda-badge'+(!slot.ativo?' closed':'');tag.textContent=!slot.ativo?'Fechado':full?'Esgotado':'Aberto';td.append(tag);tr.append(td);
  const act=document.createElement('td');const actions=document.createElement('div');actions.className='schedule-slot-actions';
  const btn=document.createElement('button');btn.type='button';btn.className='btn light';btn.textContent='Editar';btn.onclick=()=>editSlot(slot.id);actions.append(btn);
  const remove=document.createElement('button');remove.type='button';remove.className='btn btn-delete-slot';remove.textContent='Excluir';
  const hasBookings=Number(slot.ocupadas)!==0;
  remove.disabled=hasBookings;
  if(hasBookings)remove.title='Este horário já possui reservas. Feche o horário em Editar, sem apagar o agendamento.';
  else remove.title='Excluir horário sem reservas';
  remove.onclick=()=>deleteSlot(slot.id);actions.append(remove);act.append(actions);tr.append(act);root.append(tr);
 }
}
async function deleteSlot(id){
 const slot=slots.find(s=>s.id===id);
 const feedback=$('slotFeedback');
 if(!slot||!db||!auth?.currentUser)return;
 if(Number(slot.ocupadas)!==0){feedback.textContent='Este horário tem reservas e não pode ser excluído. Use Editar para fechá-lo.';return;}
 if(!window.confirm(`Excluir o horário de ${formatDate(slot.data)} às ${slot.hora}?\nEssa ação não poderá ser desfeita.`))return;
 feedback.textContent='Excluindo horário…';
 try{
   // O servidor confere novamente o contador antes de apagar, mesmo se outro usuário acabou de reservar.
   await runTransaction(db,async transaction=>{
     const ref=doc(db,'agendaRematricula',id);
     const snapshot=await transaction.get(ref);
     if(!snapshot.exists())return;
     if(snapshot.data().ocupadas!==0)throw new Error('horario_com_reservas');
     transaction.delete(ref);
   });
   if(editingSlotId===id)resetEditor();
   await loadSlots();
   feedback.textContent='Horário excluído. Horários com reservas permanecem protegidos.';
 }catch(e){
   console.error('Erro ao excluir horário:',e);
   feedback.textContent=e?.message==='horario_com_reservas'?'O horário recebeu uma reserva e não pode mais ser excluído. Atualize a agenda.':e?.code==='permission-denied'?'Exclusão bloqueada pelo Firebase. Publique a regra de exclusão incluída no pacote.':'Não foi possível excluir o horário. Verifique a conexão e tente novamente.';
 }
}
function resetEditor(){editingSlotId=null;$('agendaForm').reset();$('slotCapacity').value=10;$('slotDate').disabled=false;$('slotTime').disabled=false;$('slotSave').textContent='Abrir horário';$('slotCancelEdit').classList.add('hide');}
function editSlot(id){const slot=slots.find(x=>x.id===id);if(!slot)return;
 editingSlotId=id;$('slotDate').value=slot.data;$('slotTime').value=slot.hora;$('slotCapacity').value=slot.vagas;$('slotActive').checked=slot.ativo;
 $('slotDate').disabled=true;$('slotTime').disabled=true;$('slotCapacity').min=String(Math.max(1,slot.ocupadas));$('slotSave').textContent='Salvar alterações';$('slotCancelEdit').classList.remove('hide');
 $('manualSchedule').open=true;$('agendaForm').scrollIntoView({behavior:'smooth',block:'center'});}
$('slotCancelEdit').addEventListener('click',()=>{resetEditor();$('slotFeedback').textContent='Edição cancelada.'});
$('refreshAdminAgenda').addEventListener('click',loadSlots);
$('agendaForm').addEventListener('submit',async event=>{
 event.preventDefault();if(!db||!auth?.currentUser)return;
 const date=$('slotDate').value,time=$('slotTime').value,capacity=Number($('slotCapacity').value),active=$('slotActive').checked;
 const feedback=$('slotFeedback');
 if(!date||!time||(!editingSlotId&&date<todayBahia())||!Number.isInteger(capacity)||capacity<1||capacity>500){feedback.textContent='Informe data, horário e de 1 a 500 vagas.';return;}
 const key=slotKey(date,time),btn=$('slotSave');btn.disabled=true;feedback.textContent='Salvando horário…';
 try{
  if(editingSlotId){const current=slots.find(x=>x.id===editingSlotId);if(capacity<current.ocupadas)throw new Error('O limite não pode ser menor que as reservas recebidas.');
   await updateDoc(doc(db,'agendaRematricula',editingSlotId),{vagas:capacity,ativo:active});
  }else{
   // Não sobrescrever um horário que já exista. Só a direção altera limites.
   if(slots.some(x=>x.id===key))throw new Error('Esse horário já existe. Utilize Editar.');
   await setDoc(doc(db,'agendaRematricula',key),{data:date,hora:time,vagas:capacity,ocupadas:0,ativo:active,ultimaReservaId:''});
  }
  resetEditor();feedback.textContent='Horário salvo. A agenda pública será atualizada.';await loadSlots();
 }catch(e){console.error(e);feedback.textContent=e.message?.includes('limite')||e.message?.includes('existe')?e.message:'Não foi possível salvar. Confira sua autorização e as regras do Firestore.';}
 finally{btn.disabled=false;}
});



// Agenda semanal automática: cria somente horários inexistentes.
// Horários já reservados não são sobrescritos.
const batchIds=['batchStart','batchEnd','batchTimeStart','batchTimeEnd','batchInterval','batchCapacity'];
const batchForm=$('batchAgendaForm');
$('batchStart').min=todayBahia();$('batchEnd').min=todayBahia();
$('batchStart').addEventListener('change',()=>{$('batchEnd').min=$('batchStart').value||todayBahia();if($('batchEnd').value&&$('batchEnd').value<$('batchStart').value)$('batchEnd').value=$('batchStart').value;previewBatch();});
function minutesFromTime(s){if(!/^\d{2}:\d{2}$/.test(s))return NaN;const [h,m]=s.split(':').map(Number);return h<24&&m<60?h*60+m:NaN;}
function timeFromMinutes(n){return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
function generateBatchPlan(){
 const start=$('batchStart').value,end=$('batchEnd').value;
 const first=minutesFromTime($('batchTimeStart').value),last=minutesFromTime($('batchTimeEnd').value);
 const step=Number($('batchInterval').value),capacity=Number($('batchCapacity').value);
 const days=new Set([...document.querySelectorAll('input[name="batchDay"]:checked')].map(x=>Number(x.value)));
 if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}$/.test(end))throw new Error('Escolha a primeira e a última data.');
 if(start<todayBahia()||end<start)throw new Error('Informe um período válido a partir de hoje.');
 if(!days.size)throw new Error('Selecione pelo menos um dia da semana.');
 if(!Number.isInteger(first)||!Number.isInteger(last)||last<=first)throw new Error('O horário final deve ser posterior ao inicial.');
 if(![15,20,30,45,60].includes(step))throw new Error('Escolha um intervalo válido.');
 if(!Number.isInteger(capacity)||capacity<1||capacity>500)throw new Error('Informe de 1 a 500 vagas por horário.');
 const toUtc=s=>new Date(s+'T12:00:00Z');
 const startDate=toUtc(start),endDate=toUtc(end);
 if(Number.isNaN(startDate.getTime())||Number.isNaN(endDate.getTime())||endDate.getTime()-startDate.getTime()>92*86400000)throw new Error('Escolha um período de até 93 dias.');
 const generated=[];
 for(let date=new Date(startDate);date<=endDate;date.setUTCDate(date.getUTCDate()+1)){
  if(!days.has(date.getUTCDay()))continue;
  const day=date.toISOString().slice(0,10);
  for(let t=first;t+step<=last;t+=step){const hour=timeFromMinutes(t);generated.push({id:slotKey(day,hour),data:day,hora:hour,vagas:capacity,ocupadas:0,ativo:true,ultimaReservaId:''});}
 }
 if(!generated.length)throw new Error('Nenhum horário foi encontrado para esses dias e esse período.');
 if(generated.length>200)throw new Error('O período gera mais de 200 horários. Divida em períodos menores.');
 return generated;
}
function previewBatch(){
 const el=$('batchPreview');
 try{
  const items=generateBatchPlan(),existing=new Set(slots.map(s=>s.id)),newItems=items.filter(s=>!existing.has(s.id));
  const sample=items.slice(0,4).map(s=>formatDate(s.data)+' às '+s.hora).join(' · ');
  el.textContent=`${items.length} horários no período · ${newItems.length} novos · ${items.length-newItems.length} já cadastrados (serão mantidos).\nExemplos: ${sample}${items.length>4?'…':''}`;
  return items;
 }catch(e){el.textContent=e.message;return null;}
}
$('batchPreviewButton').addEventListener('click',previewBatch);
for(const id of batchIds)$(id).addEventListener('change',previewBatch);
document.querySelectorAll('input[name="batchDay"]').forEach(el=>el.addEventListener('change',previewBatch));
batchForm.addEventListener('submit',async event=>{
 event.preventDefault();
 const items=previewBatch(),feedback=$('batchFeedback'),button=$('batchGenerate');
 if(!items)return;
 if(!auth?.currentUser||!db){feedback.textContent='Entre com a conta autorizada da direção.';return;}
 const existing=new Set(slots.map(s=>s.id)),candidates=items.filter(s=>!existing.has(s.id));
 if(!candidates.length){feedback.textContent='Todos esses horários já estão cadastrados. Nenhum foi alterado.';return;}
 const confirmed=window.confirm(`Criar até ${candidates.length} horários novos?\nOs ${items.length-candidates.length} horários já existentes serão preservados.`);
 if(!confirmed)return;
 button.disabled=true;$('batchPreviewButton').disabled=true;
 let created=0,skipped=0,failed=0;let firstError='';
 try{
  // Poucas transações simultâneas para evitar sobrecarga e impedir sobrescrever reservas.
  for(let i=0;i<candidates.length;i+=5){
   const group=candidates.slice(i,i+5);
   const results=await Promise.allSettled(group.map(slot=>runTransaction(db,async tx=>{
    const ref=doc(db,'agendaRematricula',slot.id);
    const old=await tx.get(ref);
    if(old.exists())return false;
    tx.set(ref,{data:slot.data,hora:slot.hora,vagas:slot.vagas,ocupadas:0,ativo:true,ultimaReservaId:''});
    return true;
   })));
   for(const result of results){if(result.status==='fulfilled'){if(result.value)created++;else skipped++;}else{failed++;firstError||=result.reason?.code||result.reason?.message||'erro-desconhecido';console.error('Falha ao abrir horário:',result.reason);}}
   feedback.textContent=`Salvando... ${Math.min(i+5,candidates.length)}/${candidates.length} horários processados.`;
  }
 }finally{
  button.disabled=false;$('batchPreviewButton').disabled=false;
  try{await loadSlots();}catch(e){console.error(e);}
  feedback.textContent=`${created} horário(s) criado(s); ${skipped+items.length-candidates.length} já existente(s) preservado(s); ${failed} falha(s).`+(failed?` Verifique o console (${firstError}) e tente novamente; horários já criados não serão duplicados.`:' Os responsáveis já podem escolher as vagas disponíveis.');
  previewBatch();
 }
});

// Controle geral da publicação do agendamento. Documento único e protegido por regras.
const agendaConfigRef=()=>doc(db,'configuracoesRematricula','agenda');
let agendaConfigLoaded=false;
async function loadAgendaConfig(){
 const toggle=$('agendaEnabled'),msg=$('agendaToggleStatus'),btn=$('saveAgendaEnabled');
 btn.disabled=true;toggle.disabled=true;msg.textContent='Consultando configuração…';
 try{const snap=await getDoc(agendaConfigRef());toggle.checked=!snap.exists()||snap.data().ativo===true;agendaConfigLoaded=true;msg.textContent=toggle.checked?'Agenda ativada: o formulário solicita data e horário.':'Agenda desativada: o formulário não mostra o agendamento.';}
 catch(e){console.error('Configuração da agenda:',e);agendaConfigLoaded=false;msg.textContent='Não foi possível consultar a configuração ('+(e.code||'erro')+'). Confira as regras do Firestore.';}
 finally{toggle.disabled=!agendaConfigLoaded;btn.disabled=!agendaConfigLoaded;}
}
$('saveAgendaEnabled').addEventListener('click',async()=>{
 const toggle=$('agendaEnabled'),btn=$('saveAgendaEnabled'),msg=$('agendaToggleStatus');
 if(!agendaConfigLoaded||!auth?.currentUser)return;
 btn.disabled=true;toggle.disabled=true;msg.textContent='Salvando configuração…';
 try{await setDoc(agendaConfigRef(),{ativo:toggle.checked});msg.textContent=toggle.checked?'Agenda ativada. O agendamento aparece na rematrícula.':'Agenda desativada. A rematrícula continua disponível sem agendamento.';}
 catch(e){console.error(e);msg.textContent='Não foi possível salvar ('+(e.code||'erro')+'). Verifique as regras do Firestore.';await loadAgendaConfig();}
 finally{btn.disabled=false;toggle.disabled=false;}
});
