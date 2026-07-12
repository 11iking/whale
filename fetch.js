const https=require('https');
const url='https://11iking.github.io/whale/';
https.get(url,(res)=>{
  let d='';
  res.on('data',c=>d+=c);
  res.on('end',()=>{
    const fs=require('fs');
    fs.writeFileSync('live.html',d);
    console.log('Live page fetched:',d.length,'chars');
    console.log('Has openReduction:',d.includes('openReduction'));
    console.log('Has reductionModal:',d.includes('reductionModal'));
    console.log('Has confirmReduction:',d.includes('confirmReduction'));
  });
}).on('error',e=>console.log('ERR:',e.message));
