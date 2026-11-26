const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
export function reviewAction(path,b,{sql,uid,teacher,now,bank}){
 if(path==='t/revision-list'){
  if(!teacher)fail(403,'Acesso exclusivo da professora.');
  const grade=Number(b.grade),offset=Number(b.offset||0);
  if(!Object.hasOwn(bank,grade)||!Number.isInteger(offset)||offset<0||offset>100000)fail(400,'Filtro inválido.');
  const rows=sql.exec('SELECT id,grade,name,class_label,kind,answers,correct,total,sent FROM revision_attempts WHERE grade=? ORDER BY sent DESC,id DESC LIMIT 51 OFFSET ?',grade,offset).toArray();
  const count=sql.exec('SELECT count(*) AS n FROM revision_attempts WHERE grade=?',grade).toArray()[0].n;
  return {total:count,more:rows.length>50,rows:rows.slice(0,50).map(r=>({...r,answers:JSON.parse(r.answers)}))};
 }
 if(!uid)fail(403,'Não foi possível identificar esta sessão.');
 const grade=Number(b.grade),c=bank[grade],kind=b.kind;
 if(!Object.hasOwn(bank,grade)||!['quiz','written'].includes(kind)||b.edition!=='iii-2026-v1')fail(400,'Atualize a revisão e tente novamente.');
 const name=typeof b.name==='string'?b.name.trim().replace(/\s+/g,' '):'';
 const label=typeof b.classLabel==='string'?b.classLabel.trim().replace(/\s+/g,' '):'';
 if(name.length<3||name.length>110||!label||label.length>40||!/[\p{L}]/u.test(name))fail(400,'Informe seu nome e turma.');
 if(typeof b.attempt!=='string'||!/^[a-f0-9-]{36}$/.test(b.attempt))fail(400,'Tentativa inválida.');
 const id=uid+':'+b.attempt,prior=sql.exec('SELECT correct,total FROM revision_attempts WHERE id=?',id).toArray()[0];
 if(prior)return {ok:true,...prior};
 const qs=kind==='quiz'?c.quiz:c.written;
 if(!Array.isArray(b.answers)||b.answers.length!==qs.length)fail(400,'Confira as respostas.');
 let answers,correct=null,total=qs.length;
 if(kind==='quiz'){
  if(b.answers.some((v,i)=>!Number.isInteger(v)||v<0||v>=qs[i][1].length))fail(400,'Responda todas as questões.');
  correct=b.answers.filter((v,i)=>v===qs[i][2]).length;
  answers=qs.map((q,i)=>({question:q[0],answer:q[1][b.answers[i]],expected:q[1][q[2]],correct:b.answers[i]===q[2]}));
 }else{
  if(b.answers.some(v=>typeof v!=='string'||v.trim().length<1||v.length>1000))fail(400,'Responda todas as questões escritas (até 1000 caracteres por resposta).');
  answers=qs.map((q,i)=>({question:q,answer:b.answers[i].trim()}));
 }
 const since=new Date(now-60000).toISOString();
 if(sql.exec('SELECT count(*) AS n FROM revision_attempts WHERE uid=? AND sent>=?',uid,since).toArray()[0].n>=8)fail(429,'Muitas entregas. Tente novamente em um minuto.');
 sql.exec('INSERT INTO revision_attempts(id,uid,grade,name,class_label,kind,answers,correct,total,sent) VALUES(?,?,?,?,?,?,?,?,?,?)',id,uid,grade,name,label,kind,JSON.stringify(answers),correct,total,new Date(now).toISOString());
 return {ok:true,correct,total};
}
