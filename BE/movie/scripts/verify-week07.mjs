import fs from 'node:fs/promises';
const collection=JSON.parse(await fs.readFile(new URL('../postman/week07.postman_collection.json',import.meta.url),'utf8'));
const baseUrl=process.env.BASE_URL||'http://localhost:8080';
const suffix=Date.now().toString(36);
const vars={baseUrl,emailA:'w7a'+suffix+'@umc.com',emailB:'w7b'+suffix+'@umc.com',nicknameA:'a'+suffix,nicknameB:'b'+suffix};
const fill=s=>s.replace(/{{([^}]+)}}/g,(_,k)=>String(vars[k]));
const output=new URL('../docs/week07-evidence/',import.meta.url);
await fs.mkdir(output,{recursive:true});
const results=[];
for(const [i,item] of collection.item.entries()){
 const r=item.request;
 if(i===17){const p=vars.tokenA.split('.');p[1]=(p[1][0]==='A'?'B':'A')+p[1].slice(1);vars.forgedToken=p.join('.');}
 const headers=Object.fromEntries(r.header.map(h=>[h.key,fill(h.value)]));
 if(r.auth.type==='bearer')headers.Authorization='Bearer '+fill(r.auth.bearer[0].value);
 const body=r.body?fill(r.body.raw):undefined;
 const response=await fetch(fill(r.url.raw),{method:r.method,headers,body});
 const data=await response.json();
 const expected=Number(item.event.find(e=>e.listen==='test').script.exec[0].match(/HTTP (\d+)/)[1]);
 const codeLine=item.event.find(e=>e.listen==='test').script.exec.find(l=>l.includes('pm.test("code '));
 const expectedCode=codeLine?.match(/code ([^"]+)/)[1];
 if(response.status!==expected||expectedCode&&data.code!==expectedCode) throw Error(item.name+': '+response.status+' '+JSON.stringify(data));
 if(i===0)vars.memberA=data.result.memberId;
 if(i===2)vars.tokenA=data.result.accessToken;
 if(i===3)vars.tokenB=data.result.accessToken;
 if(i===4){vars.ratingId=data.result.ratingId;if('memberId' in JSON.parse(body))throw Error('memberId must be absent');}
 if(i===15)vars.failure=JSON.stringify(data);
 if(i===16&&vars.failure!==JSON.stringify(data))throw Error('Login failures differ');
 if(i===18&&data.length!==0)throw Error('Deletion did not persist');
 const result={step:i+1,name:item.name,method:r.method,url:fill(r.url.raw),authorization:r.auth.type==='bearer'?(r.auth.bearer[0].value.includes('tokenB')?'Bearer {B token}':'Bearer {A/forged token}'):'none',requestBody:body?JSON.parse(body):null,status:response.status,response:data};
 results.push(result);
 await fs.writeFile(new URL(String(i+1).padStart(2,'0')+'.json',output),JSON.stringify(result,null,2));
 console.log(String(i+1).padStart(2,'0')+' PASS '+response.status+' '+(data.code||'public array'));
}
const tokenParts=vars.tokenA.split('.');
const decoded={header:JSON.parse(Buffer.from(tokenParts[0],'base64url')),payload:JSON.parse(Buffer.from(tokenParts[1],'base64url'))};
await fs.writeFile(new URL('jwt-decoded.json',output),JSON.stringify(decoded,null,2));
await fs.writeFile(new URL('summary.json',output),JSON.stringify({verifiedAt:new Date().toISOString(),baseUrl,database:'H2 in-memory, MySQL compatibility mode',passed:results.length,total:results.length,results},null,2));
console.log('ALL '+results.length+' PASSED; evidence: docs/week07-evidence/');
