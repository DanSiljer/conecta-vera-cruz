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
    showNotice('Não foi possível iniciar o formulário on-line. Tente novamente mais tarde ou entre em contato com a secretaria. Nenhuma solicitação foi enviada.');
  }
} else {
  showNotice('A rematrícula on-line ainda não está disponível. Procure a secretaria para receber orientações.');
}
// Estado global do agendamento: configuração ausente = modo anterior (ativado).
let agendaHabilitada=null;
const agendaConfigRef=()=>doc(db,'configuracoesRematricula','agenda');
async function consultarConfiguracaoAgenda(){
 try{
   const snap=await getDoc(agendaConfigRef());
   agendaHabilitada=!snap.exists()||snap.data().ativo===true;
   window.definirAgendaHabilitada?.(agendaHabilitada);
 }catch(e){console.error('Não foi possível consultar a configuração do agendamento:',e);showNotice('Não conseguimos verificar se o agendamento está disponível. Atualize a página e tente novamente. Se o problema continuar, procure a secretaria.');}
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
  $('agendaStatus').textContent='Buscando datas e horários…';
  try{
    const snap=await getDocs(query(collection(db,'agendaRematricula'),orderBy('data')));
    const slots=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.ativo===true&&x.data>=dateToday()&&(x.data!==dateToday()||x.hora>timeNow())&&Number.isInteger(x.vagas)&&Number.isInteger(x.ocupadas)&&x.ocupadas<x.vagas).sort((a,b)=>(a.data+' '+a.hora).localeCompare(b.data+' '+b.hora));
    agendaSelect.replaceChildren(new Option('Selecione data e horário',''));
    for(const slot of slots){const restante=slot.vagas-slot.ocupadas;agendaSelect.add(new Option(`${labelDate(slot.data)} às ${slot.hora} — ${restante} vaga${restante===1?'':'s'}`,slot.id));}
    if(slots.some(x=>x.id===previous))agendaSelect.value=previous;
    $('agendaStatus').textContent=slots.length?`${slots.length} horário(s) disponível(is). A vaga só é confirmada ao enviar a solicitação.`:'Não há horários disponíveis no momento. Consulte novamente mais tarde ou procure a secretaria.';
  }catch(e){console.error('Agenda indisponível',e);agendaSelect.replaceChildren(new Option('Não foi possível carregar a agenda',''));$('agendaStatus').textContent='Não conseguimos carregar os horários agora. Verifique sua internet, toque em “Atualizar horários” e tente novamente. Se continuar, procure a secretaria.';}
  finally{agendaLoading=false;agendaSelect.disabled=false;}
};
$('refreshAgenda')?.addEventListener('click',()=>window.carregarAgenda());
const clean=(id,max=140)=>String($(id)?.value||'').trim().slice(0,max);
window.submitEnrollment=async function(){
  const status=$('status'),button=$('next');
  if(!db){status.textContent='A rematrícula on-line não está disponível neste momento. Procure a secretaria para receber orientações. Nenhuma solicitação foi enviada.';return;}
  if(agendaHabilitada===null){status.textContent='Estamos verificando os horários. Tente novamente em instantes. Nenhuma solicitação foi enviada.';return;}
  if(!navigator.onLine){status.textContent='Você está sem internet. Confira sua conexão e tente enviar novamente.';return;}
  if(!$('confirm').checked){status.textContent='Marque a declaração de conferência dos dados antes de enviar.';return;}
  const slotId=agendaSelect?.value||'';
  if(agendaHabilitada&&!slotId){status.textContent='Escolha uma data e um horário para a entrega dos documentos.';return;}
  const payload={
    anoLetivo:2027,escola:'Escola Municipal Luís Eduardo Magalhães',
    aluno:clean('aluno',120),nascimento:clean('nascimento',10),matricula:clean('matricula',30),
    documentoTipo:clean('documentoTipo',10),documentoNumero:clean('documentoNumero',40),
    serie:clean('serie',30),turno:clean('turno',30),responsavel:clean('responsavel',120),
    parentesco:clean('parentesco',65),cpfResponsavel:clean('cpfResponsavel',14),telefone:clean('telefone',20),email:clean('email',120),
    rua:clean('rua',130),numero:clean('numero',20),bairro:clean('bairro',90),
    cidade:clean('cidade',90),uf:clean('uf',10),referencia:clean('referencia',120),
    status:'pendente',criadoEm:serverTimestamp(),
    agendamentoSlotId:slotId,
    agendamentoData:'',agendamentoHora:'' 
  };
  if(!payload.aluno||!payload.nascimento||!payload.responsavel||!payload.telefone||!payload.rua||!payload.numero||!payload.bairro||!payload.serie||!payload.turno||!payload.parentesco){status.textContent='Algumas informações obrigatórias estão faltando. Confira os campos e tente novamente.';return;}
  if(!['cpf','certidao'].includes(payload.documentoTipo) ||
     (payload.documentoTipo==='cpf' && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(payload.documentoNumero)) ||
     (payload.documentoTipo==='certidao' && (payload.documentoNumero.length<3 || payload.documentoNumero.length>40))){
    status.textContent='Confira o documento do estudante. Informe o CPF completo ou o número da certidão de nascimento.';return;
  }
  if(!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(payload.cpfResponsavel)){status.textContent='Confira o CPF do responsável e informe os 11 números.';return;}
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
       ? 'Os horários disponíveis foram atualizados. Recarregue a página, escolha um horário e tente novamente.'
       : e?.message === 'vaga_indisponivel'
      ? 'O horário escolhido não está mais disponível. Volte à etapa de agendamento e escolha outro.'
      : e?.code === 'aborted'
        ? 'Esse horário acabou de ser preenchido. Atualize os horários e escolha outro.'
      : e?.code === 'permission-denied'
      ? 'Não conseguimos receber sua solicitação agora. Nenhuma rematrícula foi registrada. Tente mais tarde ou procure a secretaria.'
      : e?.code === 'unavailable'
        ? 'O serviço está temporariamente indisponível. Confira sua conexão e tente novamente. Se continuar, procure a secretaria.'
        : 'Não conseguimos confirmar o envio. Nenhum protocolo foi gerado. Antes de tentar novamente, procure a secretaria se tiver dúvidas sobre o registro.';}
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
    if(warning)warning.textContent='Sua solicitação foi recebida e será analisada pela escola. Guarde o protocolo: ele não significa que a rematrícula já foi confirmada.';
    const edit=document.querySelector('.receipt .receipt-actions #edit');
    if(edit)edit.style.display='none';
    const wizard=$('wizard'),receipt=$('receipt');
    if(wizard)wizard.style.display='none';
    if(receipt)receipt.style.display='block';
    else status.textContent='Solicitação recebida! Guarde o protocolo: '+protocoloConfirmado+(agendaHabilitada?'. Documentos: '+horarioConfirmado:'');
  }catch(e){
    console.error('A gravação foi concluída, mas houve falha ao exibir o comprovante:',e);
    status.textContent='Solicitação recebida! Guarde o protocolo: '+protocoloConfirmado+(agendaHabilitada?'. Documentos: '+horarioConfirmado:'');
  }
};
