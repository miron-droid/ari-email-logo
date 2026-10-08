(function(){
  'use strict';
  const model=window.SkybridgeSignature, key='skybridge-email-kit-v1';
  const form=document.getElementById('signature-form'), status=document.getElementById('status'), code=document.getElementById('code');
  let data={...model.defaults};
  try {
    const saved=JSON.parse(localStorage.getItem(key)||'null');
    if(saved && typeof saved==='object') {
      for(const field of Object.keys(data)) if(typeof saved[field]===typeof data[field]) data[field]=saved[field];
    } else if(matchMedia('(prefers-reduced-motion: reduce)').matches) data.animated=false;
  } catch {}
  function download(text,name){const url=URL.createObjectURL(new Blob([text],{type:'text/html;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function fallback(message){document.getElementById('source').open=true;code.focus();code.select();status.textContent=message+' HTML выделен ниже — нажмите ⌘C или Ctrl+C.';}
  function setWidth(event){const mobile=event.currentTarget.dataset.width==='mobile';document.getElementById('mail-window').classList.toggle('mobile-mode',mobile);document.querySelectorAll('[data-width]').forEach(b=>b.setAttribute('aria-pressed',String(b===event.currentTarget)));}
  document.querySelectorAll('[data-width]').forEach(b=>b.addEventListener('click',setWidth));
  if(form){
    for(const [name,value] of Object.entries(data)){const input=form.elements.namedItem(name);if(input){if(input.type==='checkbox')input.checked=value;else input.value=value;}}
    function render(){for(const name of Object.keys(data)){const input=form.elements.namedItem(name);data[name]=input.type==='checkbox'?input.checked:input.value.trim();}document.getElementById('preview').innerHTML=model.build(data);code.value=model.build(data);document.getElementById('from-label').textContent=data.name||'Skybridge Dispatch Team';try{localStorage.setItem(key,JSON.stringify(data));}catch{}status.textContent='';}
    form.addEventListener('submit',event=>event.preventDefault());form.addEventListener('input',render);
    document.getElementById('reset').addEventListener('click',()=>{data={...model.defaults};for(const [name,value] of Object.entries(data)){const input=form.elements.namedItem(name);if(input.type==='checkbox')input.checked=value;else input.value=value;}render();status.textContent='Ваши данные очищены.';});
    document.getElementById('copy-html').addEventListener('click',async()=>{if(!form.reportValidity())return;try{await navigator.clipboard.writeText(model.build(data));status.textContent='HTML подписи скопирован. Вставьте в CargoETL в режиме HTML.';}catch{fallback('Не удалось получить доступ к буферу обмена.');}});
    document.getElementById('copy-rich').addEventListener('click',async()=>{if(!form.reportValidity())return;try{await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([model.build(data)],{type:'text/html'}),'text/plain':new Blob([model.plain(data)],{type:'text/plain'})})]);status.textContent='Подпись скопирована с оформлением. Вставьте в редактор подписи Gmail.';}catch{const node=document.getElementById('preview'),range=document.createRange();range.selectNodeContents(node);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);const copied=document.execCommand('copy');selection.removeAllRanges();status.textContent=copied?'Подпись скопирована с оформлением. Вставьте в Gmail.':'Выделите подпись в предпросмотре, скопируйте и вставьте в Gmail.';}});
    document.getElementById('download').addEventListener('click',()=>{if(form.reportValidity()){download(model.build(data),'skybridge-signature.html');status.textContent='Скачана подпись с вашими текущими данными.';}});render();
  } else {
    const bid=window.SkybridgeBid, example=document.getElementById('example'), signature=document.getElementById('show-signature');
    function renderBid(){let html=bid.template;const values=bid.examples[example.value];if(values)for(const token of bid.tokens)if(token!=='[sign]')html=html.split(token).join(values[token]||token);html=html.replace('[sign]',signature.checked?model.build(data):'<div style="font:11px/18px Arial;color:#7c8998;padding:12px 0;">[sign] · CargoETL вставит подпись диспетчера</div>');document.getElementById('preview').innerHTML=html;code.value=bid.template;status.textContent='';}
    example.addEventListener('change',renderBid);signature.addEventListener('change',renderBid);
    document.getElementById('copy-html').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(bid.template);status.textContent='Bid template скопирован. Все переменные CargoETL и [sign] сохранены.';}catch{fallback('Не удалось получить доступ к буферу обмена.');}});
    document.getElementById('download').addEventListener('click',()=>{download(bid.template,'skybridge-bid-template.html');status.textContent='Скачан bid template с переменными CargoETL.';});renderBid();
  }
})();
