(function (root) {
  'use strict';
  const base = 'https://miron-droid.github.io/ari-email-logo/skybridge/assets/';
  const media = { animated: 'skybridge-reveal.gif', static: 'skybridge-reveal-static.png' };
  const defaults = { name: '', role: 'Dispatcher', phone: '', office: '', email: '', website: '', mc: '', dot: '', address: '', animated: true };
  const escape = value => String(value || '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  function website(value) {
    value = String(value || '').trim();
    if (!value) return '';
    try { const url = new URL(/^https?:\/\//i.test(value) ? value : 'https://' + value); return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.') && !url.username && !url.password ? url.href : ''; } catch { return ''; }
  }
  function build(input = {}, assetBase = '') {
    const v = { ...defaults, ...input };
    for (const field of Object.keys(defaults)) if (field !== 'animated') v[field] = String(v[field] || '').trim();
    const image = (assetBase || base) + media[v.animated ? 'animated' : 'static'];
    const row = (label, text, link, prominent = false) => {
      const textStyle = `font-size:${prominent ? 22 : 14}px;line-height:${prominent ? 28 : 21}px;color:#052749;${prominent ? 'font-weight:bold;' : ''}overflow-wrap:anywhere;word-wrap:break-word;`;
      return `<tr><td width="78" valign="top" style="width:78px;padding:${prominent ? 14 : 9}px 10px 0 0;font-size:10px;line-height:${prominent ? 28 : 21}px;letter-spacing:0.8px;color:${prominent ? '#9b742c' : '#657588'};">${label}</td><td valign="top" style="padding:${prominent ? 14 : 9}px 0 0;overflow-wrap:anywhere;word-wrap:break-word;">${link ? `<a href="${escape(link)}" style="text-decoration:none;${textStyle}">${escape(text)}</a>` : `<span style="${textStyle}">${escape(text)}</span>`}</td></tr>`;
    };
    let contacts = '';
    const phone = String(v.phone || '').trim(), office = String(v.office || '').trim(), email = String(v.email || '').trim();
    if (phone) contacts += row('DIRECT', phone, 'tel:' + phone.replace(/[^+0-9]/g, ''), true);
    if (email) contacts += row('EMAIL', email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'mailto:' + email : '');
    if (office) contacts += row('MAIN OFFICE', office, 'tel:' + office.replace(/[^+0-9]/g, ''));
    const url = website(v.website);
    if (url) contacts += row('WEB', v.website.replace(/^https?:\/\//i, '').replace(/\/$/, ''), url);
    if (v.address.trim()) contacts += row('OFFICE', v.address, '');
    const credentials = [v.mc.trim() && 'MC ' + escape(v.mc), v.dot.trim() && 'USDOT ' + escape(v.dot)].filter(Boolean).join('&nbsp;&nbsp; / &nbsp;&nbsp;');
    return `<table role="presentation" width="630" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:630px;table-layout:fixed;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;background:#ffffff;color:#052749;">
<tr><td align="center" bgcolor="#052749" style="padding:0;background:#052749;line-height:0;">
<img src="${escape(image)}" width="630" height="270" alt="Skybridge Logistics LLC" style="display:block;width:100%;max-width:630px;height:auto;border:0;">
</td></tr>
<tr><td bgcolor="#c99a3d" style="height:2px;font-size:1px;line-height:2px;background:#c99a3d;">&nbsp;</td></tr>
<tr><td valign="top" bgcolor="#ffffff" style="padding:20px 22px 22px;border-right:1px solid #e1e7ed;border-left:1px solid #e1e7ed;border-bottom:1px solid #e1e7ed;background:#ffffff;overflow-wrap:anywhere;word-wrap:break-word;">
<div style="font-size:10px;line-height:15px;letter-spacing:1.4px;color:#8a692c;">YOUR DIRECT CONTACT</div>
<div style="padding-top:5px;font-size:23px;line-height:29px;font-weight:bold;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;">${escape(v.name || 'Dispatch Team')}</div>
${v.name && v.role ? `<div style="padding-top:2px;font-size:12px;line-height:18px;color:#657588;">${escape(v.role)}</div>` : ''}
${contacts ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse;"><colgroup><col width="78" style="width:78px;"><col></colgroup>${contacts}</table>` : ''}
${credentials ? `<div style="margin-top:15px;padding-top:10px;border-top:1px solid #e5eaf0;font-size:11px;line-height:18px;font-weight:bold;letter-spacing:0.5px;color:#52667c;overflow-wrap:anywhere;word-wrap:break-word;">${credentials}</div>` : ''}
</td></tr>
</table>`;
  }
  function plain(input = {}) {
    const v = { ...defaults, ...input };
    return [v.name.trim() || 'Dispatch Team', v.name && v.role, 'Skybridge Logistics LLC', v.phone && 'Direct: ' + v.phone, v.office && 'Office: ' + v.office, v.email, v.website, v.address, v.mc && 'MC ' + v.mc, v.dot && 'USDOT ' + v.dot].filter(Boolean).join('\n');
  }
  root.SkybridgeSignature = { build, plain, defaults, escape, website, base };
})(typeof window !== 'undefined' ? window : globalThis);
