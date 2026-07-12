// ?? API ?? insert profiles ??????????????
const URL='https://tlxgcdsuuzbegwcbknxv.supabase.co';
const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseGdjZHN1dXpiZWd3Y2Jrbnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NTYzNTcsImV4cCI6MjA5OTQzMjM1N30.cVLwzjbFP2LyYQ7s-aKZHxdUUOVjsf2X-T5k76VXRXE';
async function api(path, opts={}){
  const r = await fetch(URL+path, {...opts, headers:{apikey:KEY,'Content-Type':'application/json','Prefer':'return=representation',...(opts.headers||{})}});
  const txt=await r.text(); let json; try{json=JSON.parse(txt)}catch(e){json=txt}
  return {status:r.status, json};
}
async function login(e,p){return api('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:e,password:p})});}
async function main(){
  // ?? creditor_test
  const l1=await login('creditor_test@test.com','test123456');
  if(!l1.json.access_token){console.log('login A fail');return;}
  const tokenA=l1.json.access_token;

  // ??? insert??? onConflict?
  console.log('=== test1: plain insert ===');
  const r1=await api('/rest/v1/profiles', {
    method:'POST',
    headers:{Authorization:'Bearer '+tokenA},
    body:JSON.stringify({email:'creditor_test@test.com'})
  });
  console.log('status:',r1.status, JSON.stringify(r1.json).slice(0,200));

  // ?? debtor_test
  const l2=await login('debtor_test@test.com','test123456');
  if(!l2.json.access_token){console.log('login B fail');return;}
  const tokenB=l2.json.access_token;

  console.log('\n=== test2: plain insert B ===');
  const r2=await api('/rest/v1/profiles', {
    method:'POST',
    headers:{Authorization:'Bearer '+tokenB},
    body:JSON.stringify({email:'debtor_test@test.com'})
  });
  console.log('status:',r2.status, JSON.stringify(r2.json).slice(0,200));

  // ????
  console.log('\n=== query all profiles as A ===');
  const q=await api('/rest/v1/profiles?select=email&order=created_at.asc',{headers:{Authorization:'Bearer '+tokenA}});
  console.log('status:',q.status);
  if(Array.isArray(q.json)) console.log('users:', q.json.map(x=>x.email).join(', '));
  else console.log(JSON.stringify(q.json).slice(0,200));
}
main().catch(e=>console.log('FATAL',e.message));
