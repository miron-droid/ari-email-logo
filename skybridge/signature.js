(function (root) {
  'use strict';
  const base = 'https://miron-droid.github.io/ari-email-logo/skybridge/assets/';
  const media = { animated: 'skybridge-assembled-once.gif', static: 'skybridge-assembled-static.png' };
  const defaults = { name: '', role: 'Dispatcher', phone: '', office: '+1 (267) 557-0001', email: '', trackingEmail: 'tracking@skybridgecompany.com', website: '', mc: '', dot: '', address: '4050 Skyron Dr, STE A12, Office 1, Doylestown, PA 18902', animated: true };
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
      const textStyle = `font-size:${prominent ? 19 : 13}px;line-height:${prominent ? 26 : 20}px;color:#052749;${prominent ? 'font-weight:bold;' : ''}overflow-wrap:anywhere;word-wrap:break-word;`;
      const showLabel = ['DIRECT', 'MAIN OFFICE', 'EMAIL', 'TRACKING / POD'].includes(label);
      const heading = showLabel ? `<div style="font-size:10px;line-height:15px;letter-spacing:0.7px;color:#8a692c;">${label}</div>` : '';
      return `<div style="padding-top:${prominent ? 12 : 8}px;line-height:${prominent ? 26 : 20}px;overflow-wrap:anywhere;word-wrap:break-word;">${heading}${link ? `<a href="${escape(link)}" title="${escape(label)}" style="text-decoration:none;${textStyle}">${['EMAIL', 'TRACKING / POD'].includes(label) ? escape(text).replace('@', '@<wbr>') : escape(text)}</a>` : `<span style="${textStyle}">${escape(text)}</span>`}</div>`;
    };
    let contacts = '';
    const phone = v.phone, office = v.office, email = v.email, trackingEmail = v.trackingEmail;
    if (phone) contacts += row('DIRECT', phone, 'tel:' + phone.replace(/[^+0-9]/g, ''), true);
    if (office) contacts += row('MAIN OFFICE', office, 'tel:' + office.replace(/[^+0-9]/g, ''), true);
    if (email) contacts += row('EMAIL', email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'mailto:' + email : '');
    if (trackingEmail) contacts += row('TRACKING / POD', trackingEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trackingEmail) ? 'mailto:' + trackingEmail : '');
    const url = website(v.website);
    if (url) contacts += row('WEB', v.website.replace(/^https?:\/\//i, '').replace(/\/$/, ''), url);
    if (v.address.trim()) contacts += row('OFFICE', v.address, '');
    const credentials = [v.mc.trim() && 'MC ' + escape(v.mc), v.dot.trim() && 'USDOT ' + escape(v.dot)].filter(Boolean).join('&nbsp;&nbsp; / &nbsp;&nbsp;');
    return `<table role="presentation" width="660" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:660px;table-layout:fixed;border-collapse:separate;border-spacing:0;border:1px solid #e1e7ed;border-top:3px solid #c99a3d;border-radius:10px;font-family:Arial,Helvetica,sans-serif;background:#ffffff;color:#052749;">
<colgroup><col width="62%" style="width:62%;"><col width="38%" style="width:38%;"></colgroup>
<tr><td width="62%" valign="top" bgcolor="#ffffff" style="width:62%;padding:22px 20px;background:#ffffff;border-radius:0 0 0 9px;overflow-wrap:anywhere;word-wrap:break-word;">
<div style="font-size:26px;line-height:31px;font-weight:bold;letter-spacing:-0.5px;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;">${escape(v.name || 'Skybridge Logistics LLC')}</div>
${v.name && v.role ? `<div style="padding-top:2px;font-size:12px;line-height:18px;color:#657588;overflow-wrap:anywhere;word-wrap:break-word;">${escape(v.role)}</div>` : ''}
${v.name ? '<div style="padding-top:3px;font-size:12px;line-height:18px;font-weight:bold;color:#8a692c;">Skybridge Logistics LLC</div>' : ''}
${contacts}
${credentials ? `<div style="margin-top:14px;padding-top:10px;border-top:2px solid #c99a3d;font-size:12px;line-height:19px;letter-spacing:0.2px;color:#657588;overflow-wrap:anywhere;word-wrap:break-word;">${credentials}</div>` : ''}
</td><td width="38%" valign="middle" align="center" bgcolor="#ffffff" style="width:38%;padding:15px;border-left:1px solid #dfc482;background:#ffffff;border-radius:0 0 9px 0;line-height:0;">
<img src="${escape(image)}" width="220" height="220" alt="Skybridge Logistics LLC" style="display:block;width:100%;max-width:220px;height:auto;border:0;border-radius:6px;">
</td></tr>
</table>`;
  }
  function plain(input = {}) {
    const v = { ...defaults, ...input };
    for (const field of Object.keys(defaults)) if (field !== 'animated') v[field] = String(v[field] || '').trim();
    return [v.name || 'Skybridge Logistics LLC', v.name && v.role, v.name && 'Skybridge Logistics LLC', v.phone && 'Direct: ' + v.phone, v.office && 'Main office: ' + v.office, v.email && 'Email: ' + v.email, v.trackingEmail && 'Tracking / POD: ' + v.trackingEmail, v.website, v.address, v.mc && 'MC ' + v.mc, v.dot && 'USDOT ' + v.dot].filter(Boolean).join('\n');
  }
  root.SkybridgeSignature = { build, plain, defaults, escape, website, base };
})(typeof window !== 'undefined' ? window : globalThis);
