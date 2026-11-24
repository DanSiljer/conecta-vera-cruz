export function repository(storage){
 const sql=storage.sql;
 const all=(q,...args)=>sql.exec(q,...args).toArray();
 const one=(q,...args)=>all(q,...args)[0]??null;
 const insert=(r,rows)=>{
  sql.exec('INSERT INTO rooms(id,grade,label,mode,code) VALUES(?,?,?,?,?)',r.id,r.grade,r.label,r.mode,r.code);
  add(rows);
 };
 function add(rows){
  for(const s of rows)sql.exec('INSERT OR IGNORE INTO students(id,room,name,pin) VALUES(?,?,?,?)',s.id,s.room,s.name,s.pin);
 }
 return {
  seedRooms:(rooms,students)=>{for(const r of rooms)insert(r,students.filter(s=>s.room===r.id));},
  rooms:()=>all('SELECT * FROM rooms ORDER BY grade,label'),
  room:id=>one('SELECT * FROM rooms WHERE id=?',id),
  byCode:c=>one('SELECT * FROM rooms WHERE code=?',c),
  students:id=>all('SELECT s.*,r.score,r.sent,r.team FROM students s LEFT JOIN submissions r ON r.student=s.id WHERE s.room=?',id),
  create:(r,rows)=>storage.transactionSync(()=>insert(r,rows)),
  add:rows=>storage.transactionSync(()=>add(rows)),
  result:id=>one('SELECT * FROM submissions WHERE student=?',id),
  submit:(ids,team,answers,marks,score,sent)=>storage.transactionSync(()=>{
   const group=JSON.stringify(ids);
   sql.exec(`INSERT INTO submissions(student,team,answers,marks,score,sent) SELECT value,?,?,?,?,? FROM json_each(?)
      WHERE NOT EXISTS (SELECT 1 FROM submissions WHERE student IN (SELECT value FROM json_each(?)))`,
      team,JSON.stringify(answers),JSON.stringify(marks),score,sent,group,group);
  })
 };
}
