(function (root) {
  'use strict';
  const base = 'https://miron-droid.github.io/ari-email-logo/skybridge/assets/';
  const publicMedia = { animated: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3IHnbxQWTEXlTMBEiE9MN8jJvnG/a7b00f59-5dbf-43e7-b530-456e1b2a2844.gif', static: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3IHnbxQWTEXlTMBEiE9MN8jJvnG/48c322af-a80e-4c42-b113-3a3e4b8a3b58.png' };
  const defaults = { name: '', role: 'Dispatcher', phone: '', office: '', email: '', website: '', mc: '', dot: '', address: '', animated: true };
  const escape = value => String(value || '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  function website(value) {
    value = String(value || '').trim();
    if (!value) return '';
    try { const url = new URL(/^https?:\/\//i.test(value) ? value : 'https://' + value); return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.') && !url.username && !url.password ? url.href : ''; } catch { return ''; }
  }
  function build(input = {}, assetBase = '') {
    const v = { ...defaults, ...input };
    const image = assetBase ? assetBase + (v.animated ? 'skybridge-bridge.gif' : 'skybridge-bridge-static.png') : publicMedia[v.animated ? 'animated' : 'static'];
    const row = (label, text, link, prominent = false) => `<tr><td style="padding:10px 0 0;font-size:10px;line-height:15px;letter-spacing:1px;color:#657588;">${label}<br>${link ? `<a href="${escape(link)}" style="text-decoration:none;letter-spacing:0;color:#052749;font-size:${prominent ? 21 : 14}px;line-height:${prominent ? 27 : 21}px;${prominent ? 'font-weight:bold;' : ''}overflow-wrap:anywhere;word-wrap:break-word;">${escape(text)}</a>` : `<span style="font-size:14px;line-height:21px;letter-spacing:0;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;">${escape(text)}</span>`}</td></tr>`;
    let contacts = '';
    const phone = String(v.phone || '').trim(), office = String(v.office || '').trim(), email = String(v.email || '').trim();
    if (phone) contacts += row('DIRECT', phone, 'tel:' + phone.replace(/[^+0-9]/g, ''), true);
    if (email) contacts += row('EMAIL', email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'mailto:' + email : '');
    if (office) contacts += row('MAIN OFFICE', office, 'tel:' + office.replace(/[^+0-9]/g, ''));
    const url = website(v.website);
    if (url) contacts += row('WEB', v.website.replace(/^https?:\/\//i, '').replace(/\/$/, ''), url);
    if (v.address.trim()) contacts += row('OFFICE', v.address, '');
    const credentials = [v.mc.trim() && 'MC ' + escape(v.mc), v.dot.trim() && 'USDOT ' + escape(v.dot)].filter(Boolean).join('&nbsp;&nbsp; / &nbsp;&nbsp;');
    return `<table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;table-layout:fixed;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;background:#ffffff;color:#052749;">
<colgroup><col width="168" style="width:168px;"><col></colgroup>
<tr><td colspan="2" bgcolor="#c99a3d" style="height:3px;font-size:1px;line-height:3px;background:#c99a3d;">&nbsp;</td></tr>
<tr><td width="168" valign="middle" align="center" bgcolor="#052749" style="width:168px;padding:22px 14px;background:#052749;">
<img src="${escape(image)}" width="140" height="90" alt="Skybridge bridge emblem" style="display:block;width:140px;height:90px;border:0;">
<div style="padding-top:12px;font-size:17px;line-height:23px;font-weight:bold;letter-spacing:1px;color:#ffffff;">SKYBRIDGE</div>
<div style="padding-top:3px;font-size:9px;line-height:15px;letter-spacing:2px;color:#dfb866;">LOGISTICS LLC</div>
</td><td valign="top" bgcolor="#ffffff" style="padding:22px 22px 20px;border-right:1px solid #e1e7ed;background:#ffffff;overflow-wrap:anywhere;word-wrap:break-word;">
<div style="font-size:10px;line-height:15px;letter-spacing:1.4px;color:#8a692c;">YOUR DIRECT CONTACT</div>
<div style="padding-top:6px;font-size:26px;line-height:32px;font-weight:bold;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;">${escape(v.name.trim() || 'Dispatch Team')}</div>
${v.name.trim() && v.role.trim() ? `<div style="padding-top:3px;font-size:12px;line-height:18px;color:#657588;">${escape(v.role)}</div>` : ''}
<div style="padding-top:6px;font-size:12px;line-height:18px;color:#657588;">Skybridge Logistics LLC</div>
${contacts ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse;">${contacts}</table>` : ''}
${credentials ? `<div style="margin-top:15px;padding-top:10px;border-top:1px solid #e5eaf0;font-size:11px;line-height:18px;font-weight:bold;letter-spacing:0.5px;color:#52667c;overflow-wrap:anywhere;word-wrap:break-word;">${credentials}</div>` : ''}
</td></tr><tr><td colspan="2" bgcolor="#c99a3d" style="height:2px;font-size:1px;line-height:2px;background:#c99a3d;">&nbsp;</td></tr>
</table>`;
  }
  function plain(input = {}) {
    const v = { ...defaults, ...input };
    return [v.name.trim() || 'Dispatch Team', v.name && v.role, 'Skybridge Logistics LLC', v.phone && 'Direct: ' + v.phone, v.office && 'Office: ' + v.office, v.email, v.website, v.address, v.mc && 'MC ' + v.mc, v.dot && 'USDOT ' + v.dot].filter(Boolean).join('\n');
  }
  root.SkybridgeSignature = { build, plain, defaults, escape, website, base };
})(typeof window !== 'undefined' ? window : globalThis);
