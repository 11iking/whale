const URL='https://tlxgcdsuuzbegwcbknxv.supabase.co';
const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseGdjZHN1dXpiZWd3Y2Jrbnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NTYzNTcsImV4cCI6MjA5OTQzMjM1N30.cVLwzjbFP2LyYQ7s-aKZHxdUUOVjsf2X-T5k76VXRXE';
async function api(path, opts={}){
  const r = await fetch(URL+path, {...opts, headers:{apikey:KEY,'Content-Type':'application/json','Prefer':'return=representation',...(opts.headers||{})}});
  const txt=await r.text(); let json; try{json=JSON.parse(txt)}catch(e){json=txt}
  return {status:r.status, json};
}
async function signup(e,p){
  return api('/auth/v1/signup',{method:'POST',body:JSON.stringify({email:e,password:p})});
}
async function login(e,p){
  return api('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:e,password:p})});
}
async function main(){
  console.log('=== 1. ???? A (creditor) ===');
  const s1 = await signup('creditor_test@test.com','test123456');
  console.log('signup A status:', s1.status);
  if(!s1.json.access_token){ console.log('A response:', JSON.stringify(s1.json).slice(0,150)); return; }
  console.log('A registered OK, token got');
  const tokenA = s1.json.access_token;

  console.log('\n=== 2. ???? B (debtor) ===');
  const s2 = await signup('debtor_test@test.com','test123456');
  console.log('signup B status:', s2.status);
  if(!s2.json.access_token){ console.log('B response:', JSON.stringify(s2.json).slice(0,150)); return; }
  console.log('B registered OK, token got');
  const tokenB = s2.json.access_token;

  console.log('\n=== 3. A ?? profiles ===');
  const up1 = await api('/rest/v1/profiles?onConflict=email', {
    method:'POST',
    headers:{Authorization:'Bearer '+tokenA, 'Prefer':'resolution=merge-duplicates'},
    body:JSON.stringify({email:'creditor_test@test.com'})
  });
  console.log('upsert A status:', up1.status, JSON.stringify(up1.json).slice(0,150));

  console.log('\n=== 4. B ?? profiles ===');
  const up2 = await api('/rest/v1/profiles?onConflict=email', {
    method:'POST',
    headers:{Authorization:'Bearer '+tokenB, 'Prefer':'resolution=merge-duplicates'},
    body:JSON.stringify({email:'debtor_test@test.com'})
  });
  console.log('upsert B status:', up2.status, JSON.stringify(up2.json).slice(0,150));

  console.log('\n=== 5. A ?? profiles (???2???) ===');
  const q1 = await api('/rest/v1/profiles?select=email&order=created_at.asc', {headers:{Authorization:'Bearer '+tokenA}});
  console.log('A query status:', q1.status);
  if(Array.isArray(q1.json)){
    console.log('A sees', q1.json.length, 'users:', q1.json.map(x=>x.email).join(', '));
  } else {
    console.log('A response:', JSON.stringify(q1.json).slice(0,200));
  }

  console.log('\n=== 6. B ?? profiles (???2???) ===');
  const q2 = await api('/rest/v1/profiles?select=email&order=created_at.asc', {headers:{Authorization:'Bearer '+tokenB}});
  console.log('B query status:', q2.status);
  if(Array.isArray(q2.json)){
    console.log('B sees', q2.json.length, 'users:', q2.json.map(x=>x.email).join(', '));
  } else {
    console.log('B response:', JSON.stringify(q2.json).slice(0,200));
  }

  console.log('\n=== ???? ===');
}
main().catch(e=>console.log('FATAL',e.message));
