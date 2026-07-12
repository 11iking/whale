const https=require('https');
const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseGdjZHN1dXpiZWd3Y2Jrbnh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzg1NjM1NywiZXhwIjoyMDk5NDMyMzU3fQ.GqkjFqOGLy9Wcv9olGJm-aRDEF3c67y3iHU0DYgFm6c';
function g(p){return new Promise((res,rej)=>{https.get({hostname:'tlxgcdsuuzbegwcbknxv.supabase.co',path:'/rest/v1/'+p,headers:{apikey:key,authorization:'Bearer '+key}},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(d));}).on('error',rej);});}
(async()=>{
  const debts=JSON.parse(await g('debts?select=*'));
  console.log('FULL DEBTS:',JSON.stringify(debts,null,2));
  const reps=JSON.parse(await g('repayments?select=*'));
  console.log('REPAYMENTS:',JSON.stringify(reps,null,2));
  const reds=JSON.parse(await g('reductions?select=*'));
  console.log('REDUCTIONS:',JSON.stringify(reds,null,2));
})();
