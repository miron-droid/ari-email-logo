const UPLOAD_ENDPOINT = 'https://atlas-photo-upload.vercel.app/api/upload';
const uploadFile=document.getElementById('upload-file'),uploadStatus=document.getElementById('upload-status');
uploadFile.addEventListener('change',async()=>{
 const file=uploadFile.files[0];if(!file)return;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15*1024*1024){uploadStatus.textContent='Choose a JPEG, PNG or WebP photo under 15 MB.';return;}
 uploadFile.disabled=true;document.getElementById('copy').disabled=true;document.getElementById('visual').disabled=true;uploadStatus.textContent='Preparing photo…';let bitmap;
 try{
  bitmap=await createImageBitmap(file);const canvas=document.createElement('canvas');canvas.width=480;canvas.height=640;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,480,640);const scale=Math.max(480/bitmap.width,640/bitmap.height);ctx.drawImage(bitmap,(480-bitmap.width*scale)/2,(640-bitmap.height*scale)/2,bitmap.width*scale,bitmap.height*scale);
  uploadStatus.textContent='Saving photo to GitHub…';const response=await fetch(UPLOAD_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:canvas.toDataURL('image/jpeg',0.88)}),signal:AbortSignal.timeout(45000)});const result=await response.json();if(!response.ok)throw Error(result.error||'Upload failed.');
  uploadStatus.textContent='Photo saved. Checking public image…';let loaded=false;for(let attempt=0;attempt<8;attempt++){loaded=await new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(true);img.onerror=()=>resolve(false);img.src=result.url;});if(loaded)break;await new Promise(resolve=>setTimeout(resolve,2000));}if(!loaded)throw Error('Photo saved, but not public yet. Retry in a minute; no duplicate will be created.');
  document.getElementById('photo').value='custom';document.getElementById('photo-url').value=result.url;update();uploadStatus.textContent='Saved to GitHub. Your signature is ready to copy.';
 }catch(error){uploadStatus.textContent=error.message||'Upload failed. Please try again.';}finally{bitmap?.close();uploadFile.disabled=false;document.getElementById('copy').disabled=false;document.getElementById('visual').disabled=false;uploadFile.value='';}
});
