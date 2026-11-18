import {firebaseConfig,isConfigured} from './firebase-config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getFirestore,collection,doc,runTransaction,serverTimestamp,getDocs,query,orderBy,getDoc} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
const $ = id => document.getElementById(id);
let db;
const notice = $('firebase-notice');
function showNotice(message) {
  if (!notice) return;
  notice.hidden = false;
  notice.textContent = message;
}
if (isConfigured) {
  try {
    db = getFirestore(initializeApp(firebaseConfig));
    // A confirmação real ocorre exclusivamente após a gravação no Firestore.
    if (notice) notice.hidden = true;
  } catch (e) {
    console.error('Falha na inicialização do Firebase', e);
    showNotice('O sistema de envio está temporariamente indisponível. Nenhum dado será enviado até a conexão ser restabelecida.');
  }
} else {
  showNotice('O envio on-line ainda não está disponível. A escola precisa conectar este formulário ao projeto Firebase antes de receber solicitações.');
}
// Estado global do agendamento: configuração ausente = modo anterior (ativado).
let agendaHabilitada=null;
const agendaConfigRef=()=>doc(db,'configuracoesRematricula','agenda');
async function consultarConfiguracaoAgenda(){
 try{
   const snap=await getDoc(agendaConfigRef());
   agendaHabilitada=!snap.exists()||snap.data().ativo===true;
   window.definirAgendaHabilitada?.(agendaHabilitada);
 }catch(e){console.error('Não foi possível consultar a configuração do agendamento:',e);showNotice('Não foi possível verificar a configuração da rematrícula. Atualize a página ou procure a secretaria.');}
}
if(db)consultarConfiguracaoAgenda();
const agendaSelect=$('agendaSlot');
let agendaLoading=false;
const labelDate = s => {const [y,m,d]=s.split('-');return `${d}/${m}/${y}`;};
const dateToday=()=>{const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bahia',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=k=>parts.find(p=>p.type===k)?.value;return `${get('year')}-${get('month')}-${get('day')}`;};
const timeNow=()=>new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Bahia',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date());
window.carregarAgenda=async function(){
  if(!agendaHabilitada||!agendaSelect||!db||agendaLoading)return;
  agendaLoading=true;const previous=agendaSelect.value;agendaSelect.disabled=true;
  $('agendaStatus').textContent='Consultando horários disponíveis…';
  try{
    const snap=await getDocs(query(collection(db,'agendaRematricula'),orderBy('data')));
    const slots=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.ativo===true&&x.data>=dateToday()&&(x.data!==dateToday()||x.hora>timeNow())&&Number.isInteger(x.vagas)&&Number.isInteger(x.ocupadas)&&x.ocupadas<x.vagas).sort((a,b)=>(a.data+' '+a.hora).localeCompare(b.data+' '+b.hora));
    agendaSelect.replaceChildren(new Option('Selecione data e horário',''));
    for(const slot of slots){const restante=slot.vagas-slot.ocupadas;agendaSelect.add(new Option(`${labelDate(slot.data)} às ${slot.hora} — ${restante} vaga${restante===1?'':'s'}`,slot.id));}
    if(slots.some(x=>x.id===previous))agendaSelect.value=previous;
    $('agendaStatus').textContent=slots.length?`${slots.length} horário(s) disponível(is). A vaga só é confirmada ao enviar a solicitação.`:'A direção ainda não disponibilizou horários, ou todas as vagas foram preenchidas. Procure a secretaria.';
  }catch(e){console.error('Agenda indisponível',e);agendaSelect.replaceChildren(new Option('Não foi possível carregar a agenda',''));const code=e?.code||'erro-desconhecido';$('agendaStatus').textContent=code==='permission-denied'?'Consulta de horários bloqueada: a escola precisa publicar as regras de agendaRematricula no Firestore.':code==='unavailable'?'Agenda temporariamente indisponível. Verifique a conexão e tente novamente.':'Não foi possível consultar os horários ('+code+'). Avise a secretaria.';}
  finally{agendaLoading=false;agendaSelect.disabled=false;}
};
$('refreshAgenda')?.addEventListener('click',()=>window.carregarAgenda());
const clean=(id,max=140)=>String($(id)?.value||'').trim().slice(0,max);
window.submitEnrollment=async function(){
  const status=$('status'),button=$('next');
  if(!db){status.textContent='O recebimento on-line ainda não foi ativado pela escola. Nenhum dado foi enviado.';return;}
  if(agendaHabilitada===null){status.textContent='Aguarde a verificação do agendamento. Nenhum dado foi enviado.';return;}
  if(!navigator.onLine){status.textContent='Sem conexão com a internet. Verifique a rede e tente novamente.';return;}
  if(!$('confirm').checked){status.textContent='Confirme a declaração para enviar.';return;}
  const slotId=agendaSelect?.value||'';
  if(agendaHabilitada&&!slotId){status.textContent='Selecione um horário disponível para entregar os documentos.';return;}
  const payload={
    anoLetivo:2027,escola:'Escola Municipal Luís Eduardo Magalhães',
    aluno:clean('aluno',120),nascimento:clean('nascimento',10),matricula:clean('matricula',30),
    serie:clean('serie',30),turno:clean('turno',30),responsavel:clean('responsavel',120),
    parentesco:clean('parentesco',65),telefone:clean('telefone',20),email:clean('email',120),
    rua:clean('rua',130),numero:clean('numero',20),bairro:clean('bairro',90),
    cidade:clean('cidade',90),uf:clean('uf',10),referencia:clean('referencia',120),
    status:'pendente',criadoEm:serverTimestamp(),
    agendamentoSlotId:slotId,
    agendamentoData:'',agendamentoHora:'' 
  };
  if(!payload.aluno||!payload.nascimento||!payload.responsavel||!payload.telefone||!payload.rua||!payload.numero||!payload.bairro||!payload.serie||!payload.turno||!payload.parentesco){status.textContent='Preencha todos os campos obrigatórios.';return;}
  button.disabled=true;button.textContent='Enviando...';status.textContent='';
  let gravacaoConfirmada=false;
  let protocoloConfirmado='';
  try{
    const ref=doc(collection(db,'rematriculas'));
    // A configuração é conferida de novo dentro da transação, evitando mudanças no meio do envio.
    await runTransaction(db,async tx=>{
      const configSnap=await tx.get(agendaConfigRef());
      const enabled=!configSnap.exists()||configSnap.data().ativo===true;
      if(enabled!==agendaHabilitada)throw new Error('configuracao_alterada');
      if(!enabled){
        payload.agendamentoSlotId='';
        payload.agendamentoData='';
        payload.agendamentoHora='';
        tx.set(ref,payload);
        return;
      }
      const slotRef=doc(db,'agendaRematricula',slotId);
      const snap=await tx.get(slotRef);
      if(!snap.exists())throw new Error('vaga_indisponivel');
      const slot=snap.data();
      if(!slot.ativo||slot.data<dateToday()||(slot.data===dateToday()&&slot.hora<=timeNow())||!Number.isInteger(slot.ocupadas)||slot.ocupadas>=slot.vagas)throw new Error('vaga_indisponivel');
      payload.agendamentoData=slot.data;
      payload.agendamentoHora=slot.hora;
      tx.set(ref,payload);
      tx.update(slotRef,{ocupadas:slot.ocupadas+1,ultimaReservaId:ref.id});
    });
    // A partir deste ponto a transação já foi concluída no Firestore.
    gravacaoConfirmada=true;
    protocoloConfirmado=ref.id.toUpperCase();
  }catch(e){console.error('Falha ao gravar rematrícula/agendamento:',e);status.textContent = e?.message === 'configuracao_alterada'
       ? 'A direção alterou a disponibilidade do agendamento. Atualize a página antes de enviar novamente.'
       : e?.message === 'vaga_indisponivel'
      ? 'O horário escolhido ficou sem vagas. Volte à etapa de agendamento, atualize a lista e escolha outro horário.'
      : e?.code === 'aborted'
        ? 'Outra pessoa reservou o mesmo horário. Atualize a lista e tente novamente.'
      : e?.code === 'permission-denied'
      ? 'O banco de dados recusou o envio. A escola deve conferir as regras de segurança do Firestore.'
      : e?.code === 'unavailable'
        ? 'Serviço temporariamente indisponível. Verifique a internet e tente novamente.'
        : 'Não foi possível registrar a solicitação. Nenhum protocolo foi emitido; tente novamente ou procure a secretaria.';}
  finally{button.disabled=false;button.textContent='Enviar solicitação';}
  if(!gravacaoConfirmada)return;
  // Falhas de apresentação nunca devem sugerir que uma gravação concluída falhou.
  const horarioConfirmado=agendaHabilitada?labelDate(payload.agendamentoData)+' às '+payload.agendamentoHora:'';
  try{
    const protocolEl=$('protocol');
    if(protocolEl)protocolEl.textContent='Protocolo: '+protocoloConfirmado;
    const comprovanteEl=$('agendaComprovante');
    if(comprovanteEl)comprovanteEl.textContent=agendaHabilitada?'Entrega de documentos agendada: '+horarioConfirmado:'';
    const printEl=$('print-info');
    if(printEl){
      if(agendaHabilitada){const info=document.createElement('p');info.textContent='Entrega de documentos: '+horarioConfirmado;printEl.appendChild(info);}
    }
    const warning=document.querySelector('.receipt .warn');
    if(warning)warning.textContent='O pedido foi registrado para análise. A matrícula somente será confirmada pela escola.';
    const edit=document.querySelector('.receipt .receipt-actions #edit');
    if(edit)edit.style.display='none';
    const wizard=$('wizard'),receipt=$('receipt');
    if(wizard)wizard.style.display='none';
    if(receipt)receipt.style.display='block';
    else status.textContent='Solicitação registrada! Protocolo: '+protocoloConfirmado+(agendaHabilitada?'. Documentos: '+horarioConfirmado:'');
  }catch(e){
    console.error('A gravação foi concluída, mas houve falha ao exibir o comprovante:',e);
    status.textContent='Solicitação registrada! Protocolo: '+protocoloConfirmado+(agendaHabilitada?'. Documentos: '+horarioConfirmado:'');
  }
};
