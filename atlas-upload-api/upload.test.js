import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import handler from './api/upload.js';
const response=()=>({code:0,data:null,headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this},json(data){this.data=data;return this},end(){return this}});
test('uploads are closed until configured; no GitHub call',async()=>{delete process.env.GITHUB_UPLOAD_TOKEN;const r=response();await handler({method:'POST',headers:{origin:'https://miron-droid.github.io'}},r);assert.equal(r.code,503);});
test('validates access, image data, writes only fixed repository folder, handles retries',async()=>{
 process.env.GITHUB_UPLOAD_TOKEN='test-only';process.env.ATLAS_UPLOAD_CODE='test-code';const original=globalThis.fetch;const calls=[];
 globalThis.fetch=async(url,options)=>{calls.push({url,options});return {ok:options.method==='PUT',status:options.method==='PUT'?201:404}};
 try{
 const base={method:'POST',headers:{origin:'https://miron-droid.github.io',}};
 let r=response();await handler({...base,headers:{origin:'https://example.com'}},r);assert.equal(r.code,403);assert.equal(calls.length,0);
 r=response();await handler({...base,body:{image:'data:image/jpeg;base64,dGVzdA=='}},r);assert.equal(r.code,400);assert.equal(calls.length,0);
 const png=await sharp({create:{width:40,height:40,channels:3,background:'#e0ba72'}}).png().toBuffer();
 r=response();await handler({...base,body:{image:'data:image/png;base64,'+png.toString('base64'),filename:'../../index.html'}},r);assert.equal(r.code,201);assert.match(r.data.url,/\/atlas\/dispatchers\/[a-f0-9]{64}\.jpg$/);assert.equal(calls.length,2);const content=Buffer.from(JSON.parse(calls[1].options.body).content,'base64');const metadata=await sharp(content).metadata();assert.equal(metadata.width,480);assert.equal(metadata.height,640);assert.equal(metadata.format,'jpeg');
 calls.length=0;globalThis.fetch=async()=>({ok:true,status:200});r=response();await handler({...base,body:{image:'data:image/png;base64,'+png.toString('base64')}},r);assert.equal(r.code,200);
 }finally{globalThis.fetch=original;delete process.env.GITHUB_UPLOAD_TOKEN;delete process.env.ATLAS_UPLOAD_CODE;}
});
