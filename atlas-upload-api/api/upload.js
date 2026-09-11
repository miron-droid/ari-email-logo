import sharp from 'sharp';
import {createHash} from 'node:crypto';
const root='https://api.github.com/repos/miron-droid/ari-email-logo/contents/atlas/dispatchers/';
const origin='https://miron-droid.github.io';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 res.setHeader('Vary','Origin');
 if(req.headers.origin===origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');}
 const fail=(status,error)=>res.status(status).json({error});
 if(req.headers.origin&&req.headers.origin!==origin)return fail(403,'Origin not allowed.');
 if(req.method==='OPTIONS')return res.status(204).end();
 if(!['GET','POST'].includes(req.method))return fail(405,'Use GET or POST.');
 const token=process.env.GITHUB_UPLOAD_TOKEN;
 if(!token)return fail(503,'Photo uploads are not configured yet. Contact your administrator.');
 if(req.method==='GET'){
  try{
   const listing=await fetch(root,{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','User-Agent':'Atlas-signature-upload'},signal:AbortSignal.timeout(10000)});
   if(!listing.ok)return fail(502,'Could not load saved photos. Please refresh.');
   const files=await listing.json();
   return res.status(200).json({photos:files.filter(f=>f.type==='file'&&/^(photo-[12]|[a-f0-9]{64})\.jpg$/.test(f.name)).map(f=>({name:f.name,url:'https://raw.githubusercontent.com/miron-droid/ari-email-logo/main/atlas/dispatchers/'+f.name})).sort((a,b)=>{const rank=n=>n==='photo-1.jpg'?0:n==='photo-2.jpg'?1:2;return rank(a.name)-rank(b.name)||a.name.localeCompare(b.name);})});
  }catch{return fail(502,'Could not load saved photos. Please refresh.');}
 }
 let body;try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return fail(400,'Invalid request.');}
 if(typeof body?.image!=='string'||body.image.length>1400000||!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(body.image))return fail(400,'Choose a JPEG, PNG or WebP photo under 1 MB.');
 let bytes;
 try{bytes=await sharp(Buffer.from(body.image.split(',')[1],'base64'),{limitInputPixels:20000000,animated:false}).rotate().resize(480,640,{fit:'cover',position:'centre'}).jpeg({quality:85,mozjpeg:true}).toBuffer();}catch{return fail(400,'This image could not be processed.');}
 const filename=createHash('sha256').update(bytes).digest('hex')+'.jpg';
 const url='https://raw.githubusercontent.com/miron-droid/ari-email-logo/main/atlas/dispatchers/'+filename;
 const headers={Authorization:'Bearer '+token,Accept:'application/vnd.github+json','User-Agent':'Atlas-signature-upload'};
 try{
  const existing=await fetch(root+filename,{headers,signal:AbortSignal.timeout(10000)});
  if(existing.ok)return res.status(200).json({url});
  if(existing.status!==404)return fail(502,'GitHub access failed. Ask your administrator to check the repository token.');
  const saved=await fetch(root+filename,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({message:'Add dispatcher portrait',branch:'main',content:bytes.toString('base64')}),signal:AbortSignal.timeout(15000)});
  if(!saved.ok){if(saved.status===422||saved.status===409){const check=await fetch(root+filename,{headers,signal:AbortSignal.timeout(10000)});if(check.ok)return res.status(200).json({url});}return fail(502,'GitHub could not save the photo. Please try again.');}
  return res.status(201).json({url});
 }catch{return fail(502,'GitHub is temporarily unavailable. Please try again.');}
}
