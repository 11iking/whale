const URL='https://tlxgcdsuuzbegwcbknxv.supabase.co';
const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseGdjZHN1dXpiZWd3Y2Jrbnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NTYzNTcsImV4cCI6MjA5OTQzMjM1N30.cVLwzjbFP2LyYQ7s-aKZHxdUUOVjsf2X-T5k76VXRXE';
async function api(path, opts={}){
  const r = await fetch(URL+path, {...opts, headers:{apikey:KEY,'Content-Type':'application/json',...(opts.headers||{})}});
  const txt=await r.text(); let json; try{json=JSON.parse(txt)}catch(e){json=txt}
  return {status:r.status, json};
}
async function login(e,p){return api('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:e,password:p})});}
async function main(){
  // 1. ??? profiles ?????????????token?
  console.log('=== 1. profiles ???????????===');
  const a = await api('/rest/v1/profiles?select=*');
  console.log('anon query status:', a.status, JSON.stringify(a.json).slice(0,200));

  // 2. ????A??? upsert profile????
  console.log('\n=== 2. ?? creditor_test ===');
  const l1 = await login('creditor_test@test.com','test123456');
  if(!l1.json.access_token){console.log('login A failed:', JSON.stringify(l1.json).slice(0,100)); return;}
  const tokenA = l1.json.access_token;

  console.log('\n=== 3. upsert profile for A ===');
  const up1 = await api('/rest/v1/profiles?onConflict=email', {
    method:'POST',
    headers:{Authorization:'Bearer '+tokenA, 'Prefer':'resolution=merge-duplicates'},
    body:JSON.stringify({email:'creditor_test@test.com'})
  });
  console.log('upsert A status:', up1.status, JSON.stringify(up1.json).slice(0,150));

  // 3. ????B
  const l2 = await login('debtor_test@test.com','test123456');
  if(!l2.json.access_token){console.log('login B failed:', JSON.stringify(l2.json).slice(0,100)); return;}
  const tokenB = l2.json.access_token;

  console.log('\n=== 4. upsert profile for B ===');
  const up2 = await api('/rest/v1/profiles?onConflict=email', {
    method:'POST',
    headers:{Authorization:'Bearer '+tokenB, 'Prefer':'resolution=merge-duplicates'},
    body:JSON.stringify({email:'debtor_test@test.com'})
  });
  console.log('upsert B status:', up2.status, JSON.stringify(up2.json).slice(0,150));

  console.log('\n=== 5. ??A ?? profiles?????A?B?????===');
  const q1 = await api('/rest/v1/profiles?select=email&order=created_at.asc', {headers:{Authorization:'Bearer '+tokenA}});
  console.log('A sees profiles:', q1.status, JSON.stringify(q1.json));

  console.log('\n=== 6. ??B ?? profiles ===');
  const q2 = await api('/rest/v1/profiles?select=email&order=created_at.asc', {headers:{Authorization:'Bearer '+tokenB}});
  console.log('B sees profiles:', q2.status, JSON.stringify(q2.json));
}
main().catch(e=>console.log('FATAL',e.message));
