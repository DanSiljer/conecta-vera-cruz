const rand = () => Array.from(crypto.getRandomValues(new Uint8Array(5)), b => b.toString(16).padStart(2,'0')).join('').toUpperCase();
const uid = () => rand() + rand();
function fail(message,status=400){throw Object.assign(new Error(message),{status});}
function atlasPassword(input){
  const pasted=input.replace(/[\u200B\uFEFF]/g,'').trim().replace(/^`([^`]*)`$/,'$1').trim();
  const candidate=pasted.replace(/[\u2010-\u2014\u2212\uFF0D]/g,'-');
  return /^Atlas-[A-F0-9]{12}$/.test(candidate)?candidate:input;
}
function namesFrom(values){
  if(!Array.isArray(values)||values.length>150) fail('Informe até 150 nomes por turma.');
  const seen=new Set(), names=[];
  for(const v of values){
    if(typeof v!=='string'||v.length>110) fail('Confira os nomes da chamada (até 110 caracteres cada).');
    const name=v.trim().replace(/\s+/g,' '), key=name.normalize('NFC').toLocaleLowerCase('pt-BR');
    if(name&&!seen.has(key)){seen.add(key);names.push(name);}
  }
  return names;
}
function buildStudents(id,names,seed=false){
  return names.map((name,i)=>({id:seed?id+'-'+i:uid(),room:id,name,pin:rand().slice(0,8)}));
}
function describeRoom(room){return {id:room.id,grade:room.grade,label:room.label,mode:'objective'};}
function submittedExam(result,room,exam){
  const stored=JSON.parse(result.answers);
  if(Array.isArray(stored))return {mode:room.mode,answers:stored,questions:exam.archive[room.mode]};
  const questions=stored.edition===exam.edition?exam.objective:exam.archive.editions?.[stored.edition];
  if(!Array.isArray(questions))fail('Esta entrega pertence a outra edição da avaliação.',409);
  return {mode:'objective',answers:stored.choices,questions};
}
function viewResult(result,mode){
  return {score:result.score,marks:result.marks?JSON.parse(result.marks):null,sent:result.sent,mode};
}
function identifyMembers(body,students,portal){
  const entries=body.members===undefined?[{id:body.student,pin:body.pin}]:body.members;
  if(!Array.isArray(entries)||!entries.length||entries.length>(portal?Math.min(10,students.length):students.length))fail('Marque pelo menos um nome da chamada.');
  const ids=new Set();
  return entries.map(entry=>{
    const person=portal&&!entry?.id?students.find(s=>s.pin===entry?.pin):students.find(s=>s.id===entry?.id);
    if(!person||entry.pin!==person.pin)fail('Confira a chave individual de cada participante.',403);
    if(ids.has(person.id))fail('Cada nome deve aparecer uma única vez no grupo.');
    ids.add(person.id);
    return person;
  });
}
function teamNames(team,students){
  if(!team)return [];
  const ids=new Set(JSON.parse(team));
  return students.filter(s=>ids.has(s.id)).map(s=>s.name);
}
function conflict(){fail('Um dos participantes já entregou a avaliação. Confira os nomes do grupo ou entre apenas com a sua chave para consultar sua nota.',409);}
async function school(path,b,ctx){
  const {repo,bank}=ctx;
  if(path.startsWith('t/')){
    if(!ctx.teacher)fail('Entre com o acesso da professora para abrir o painel.',403);
    if(path==='t/rooms'){
      let rooms=await repo.rooms();
      for(const grade of [6,7,8,9]){
        const id='matutino-'+grade;
        if(!rooms.some(r=>r.id===id)){
          const names=namesFrom(ctx.rosters?.[grade]||[]);
          await repo.create({id,grade,label:grade+'º ano · Matutino',mode:'objective',code:rand().slice(0,8)},buildStudents(id,names,true));
        }
      }
      return {rooms:(await repo.rooms()).map(r=>({...r,mode:'objective'}))};
    }
    if(path==='t/create'){
      const grade=Number(b.grade),label=String(b.label||'').trim(),mode='objective';
      if(!bank[grade]||!label||label.length>70)fail('Confira o ano e o nome da turma.');
      if(b.mode&&b.mode!==mode)fail('Atualize a página para abrir a avaliação de múltipla escolha.',409);
      const names=namesFrom(b.names);
      if(!names.length)fail('Inclua pelo menos um estudante.');
      const room={id:uid(),grade,label,mode,code:rand().slice(0,8)};
      await repo.create(room,buildStudents(room.id,names));return {room};
    }
    const room=await repo.room(b.room);if(!room)fail('Turma não encontrada.',404);
    if(path==='t/add'){
      const names=namesFrom(b.names);if(!names.length)fail('Digite pelo menos um nome.');
      const list=await repo.students(room.id),existing=new Set(list.map(x=>x.name.toLocaleLowerCase('pt-BR')));
      const additions=names.filter(x=>!existing.has(x.toLocaleLowerCase('pt-BR')));
      if(additions.length+list.length>150)fail('A turma comporta até 150 estudantes.');
      await repo.add(buildStudents(room.id,additions));return {added:additions.length};
    }
    const students=await repo.students(room.id);
    if(path==='t/detail')return {room:{...room,mode:'objective'},students:students.map(s=>({id:s.id,name:s.name,pin:s.pin,score:s.score,sent:s.sent,group:teamNames(s.team,students)}))};
    const person=students.find(s=>s.id===b.student);if(!person)fail('Estudante não encontrado.',404);
    const result=await repo.result(person.id);if(!result)fail('Este estudante ainda não entregou a avaliação.',404);
    const delivery=submittedExam(result,room,bank[room.grade]);
    if(path==='t/review')return {name:person.name,group:teamNames(result.team,students),answers:delivery.answers,questions:delivery.questions,...viewResult(result,delivery.mode)};
    if(path==='t/grade'){
      if(delivery.mode!=='written'||!Array.isArray(b.marks)||b.marks.length!==delivery.questions.length||b.marks.some(n=>!Number.isInteger(n)||n<0||n>10))fail('Informe uma nota de 0 a 1 em cada questão, com até uma casa decimal.');
      await repo.mark(person.id,result.team,b.marks,b.marks.reduce((s,n)=>s+n,0));return {ok:true};
    }
    fail('Opção indisponível.',404);
  }
  if(!/^(?:[0-9A-F]{8}|[0-9A-F]{12})$/.test(String(b.code)))fail('Confira o código da turma na ficha entregue pela professora.');
  const room=await repo.byCode(b.code);
  if(!room||Number(b.grade)!==room.grade)fail('Confira se você escolheu o ano certo e digitou o código da sua turma.',404);
  const students=await repo.students(room.id);
  if(path==='class'&&ctx.portal)return {room:describeRoom(room),count:students.length};
  if(path==='class')return {room:describeRoom(room),students:students.map(s=>({id:s.id,name:s.name}))};
  const members=identifyMembers(b,students,ctx.portal);
  const ids=members.map(s=>s.id).sort();
  const team=ids.length>1?JSON.stringify(ids):null;
  const submitted=members.filter(x=>x.sent);
  const exact=submitted.length===members.length&&submitted.every(s=>(s.team||null)===team);
  if(submitted.length&&!exact&&!(ids.length===1&&path==='start'))conflict();
  const result=submitted.length?await repo.result(ids[0]):null;
  const exam=bank[room.grade];
  const receipt=result?viewResult(result,submittedExam(result,room,exam).mode):null;
  if(path==='start'){
    return {room:describeRoom(room),name:members.map(s=>s.name).join(' · '),count:members.length,...(ctx.portal?{members:members.map(s=>({id:s.id}))}:{}),result:receipt};
  }
  if(path==='submit'){
    if(result)return receipt;
    if(b.edition!==exam.edition)fail('O caderno mudou. Atualize a página e abra a avaliação novamente.',409);
    const qs=exam.objective,answers=b.answers;
    if(!Array.isArray(answers)||answers.length!==qs.length)fail('Responda a todas as questões antes de entregar.');
    if(answers.some((v,i)=>!Number.isInteger(v)||v<0||v>=qs[i].options.length))fail('Escolha uma alternativa em cada questão.');
    const marks=answers.map((v,i)=>v===qs[i].key?30/qs.length:0),score=marks.reduce((a,c)=>a+c,0);
    await repo.submit(ids,team,{edition:exam.edition,choices:answers},marks,score,new Date().toISOString());
    const saved=await repo.result(ids[0]);
    if(!saved||(saved.team||null)!==team)conflict();
    return viewResult(saved,submittedExam(saved,room,exam).mode);
  }
  fail('Opção indisponível.',404);
}

export {school, atlasPassword};
