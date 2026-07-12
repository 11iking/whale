const SR='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseGdjZHN1dXpiZWd3Y2Jrbnh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzg1NjM1NywiZXhwIjoyMDk5NDMyMzU3fQ.GqkjFqOGLy9Wcv9olGJm-aRDEF3c67y3iHU0DYgFm6c';
const BASE='https://tlxgcdsuuzbegwcbknxv.supabase.co';
const f=async(p)=>{const r=await fetch(BASE+'/rest/v1/'+p,{headers:{apikey:SR,Authorization:'Bearer '+SR}});return r.json();};
(async()=>{
  try{
    const d=await f('debts?select=id,creditor,debtor,reason,confirmed');
    console.log('Debts:',JSON.stringify(d,null,2));
    const r=await f('reductions?select=*');
    console.log('Reductions:',JSON.stringify(r,null,2));
    const p=await f('profiles?select=email,nickname');
    console.log('Profiles:',JSON.stringify(p,null,2));
    const s=await f('settings?select=*');
    console.log('Settings:',JSON.stringify(s,null,2));
  }catch(e){console.log('ERR',e.message);}
})();
