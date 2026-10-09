(function (root) {
  'use strict';
  const base = 'https://miron-droid.github.io/ari-email-logo/skybridge/assets/';
  const media = { animated: 'skybridge-clear-once.gif', static: 'skybridge-clear-static.png' };
  const defaults = { name: '', role: 'Dispatcher', phone: '', office: '+1 (267) 557-0001', email: '', trackingEmail: 'tracking@skybridgecompany.com', website: 'skybridgecompany.com', mc: '1791442', dot: '4521307', address: '4050 Skyron Dr, STE A12, Office 1, Doylestown, PA 18902', animated: true };
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
    const emailLink = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'mailto:' + value : '';
    const textLink = (text, link, style, email = false) => {
      const content = email ? escape(text).replace('@', '@<wbr>') : escape(text);
      return link ? '<a href="' + escape(link) + '" style="text-decoration:none;' + style + '">' + content + '</a>' : '<span style="' + style + '">' + content + '</span>';
    };
    const labelStyle = 'font-size:10px;line-height:16px;letter-spacing:0.7px;font-weight:bold;color:#7d622d;';
    const textStyle = 'font-size:14px;line-height:21px;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;';
    const phoneRow = (label, value, primary) => '<div style="padding-top:8px;line-height:24px;overflow-wrap:anywhere;word-wrap:break-word;"><span style="' + labelStyle + '">' + label + '</span>&nbsp;&nbsp; ' + textLink(value, 'tel:' + value.replace(/[^+0-9]/g, ''), 'display:inline-block;max-width:100%;font-size:' + (primary ? 18 : 14) + 'px;line-height:24px;font-weight:bold;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;') + '</div>';
    let contacts = '';
    if (v.phone) contacts += phoneRow('DIRECT', v.phone, true);
    if (v.office) contacts += phoneRow('MAIN OFFICE', v.office, !v.phone);
    if (v.email) contacts += '<div style="padding-top:4px;">' + textLink(v.email, emailLink(v.email), textStyle, true) + '</div>';
    if (v.trackingEmail) contacts += '<div style="padding-top:8px;"><div style="' + labelStyle + '">TRACKING / POD</div>' + textLink(v.trackingEmail, emailLink(v.trackingEmail), textStyle, true) + '</div>';
    const url = website(v.website);
    if (url) contacts += '<div style="padding-top:8px;">' + textLink(v.website.replace(/^https?:\/\//i, '').replace(/\/$/, ''), url, 'font-size:14px;line-height:21px;font-weight:bold;color:#85652c;overflow-wrap:anywhere;word-wrap:break-word;') + '</div>';
    if (v.address) contacts += '<div style="padding-top:8px;font-size:12px;line-height:18px;color:#52667c;overflow-wrap:anywhere;word-wrap:break-word;">' + escape(v.address) + '</div>';
    const credentials = [
      v.mc && '<div><span style="color:#7d622d;">MC</span> <strong>' + escape(v.mc) + '</strong></div>',
      v.dot && '<div><span style="color:#7d622d;">USDOT</span> <strong>' + escape(v.dot) + '</strong></div>'
    ].filter(Boolean).join('');

    return '<table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;table-layout:fixed;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;background:#ffffff;color:#052749;">\n' +
      '<colgroup><col width="33%" style="width:33%;"><col width="67%" style="width:67%;"></colgroup>\n' +
      '<tr><td width="33%" valign="top" align="center" bgcolor="#ffffff" style="width:33%;padding:8px 16px 0 0;background:#ffffff;line-height:0;">\n' +
      '<img src="' + escape(image) + '" width="190" height="166" alt="Skybridge Logistics LLC" style="display:block;width:100%;max-width:190px;height:auto;border:0;">\n' +
      '<div style="padding-top:' + (credentials ? 8 : 0) + 'px;font-size:11px;line-height:18px;letter-spacing:0.3px;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;">' + credentials + '</div>\n' +
      '</td><td width="67%" valign="top" bgcolor="#ffffff" style="width:67%;padding:0 0 0 20px;border-left:2px solid #c49a48;background:#ffffff;overflow-wrap:anywhere;word-wrap:break-word;">\n' +
      '<div style="font-size:24px;line-height:28px;font-weight:bold;letter-spacing:-0.4px;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;">Skybridge Logistics LLC</div>\n' +
      '<div style="padding-top:12px;font-size:20px;line-height:24px;font-weight:bold;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;">' + escape(v.name || 'Dispatch Team') + '</div>\n' +
      (v.name && v.role ? '<div style="padding-top:2px;font-size:13px;line-height:18px;color:#52667c;overflow-wrap:anywhere;word-wrap:break-word;">' + escape(v.role) + '</div>\n' : '') +
      contacts + '\n</td></tr>\n</table>';
  }
  function plain(input = {}) {
    const v = { ...defaults, ...input };
    for (const field of Object.keys(defaults)) if (field !== 'animated') v[field] = String(v[field] || '').trim();
    return ['Skybridge Logistics LLC', [v.mc && 'MC ' + v.mc, v.dot && 'USDOT ' + v.dot].filter(Boolean).join(' / '), v.name || 'Dispatch Team', v.name && v.role, v.phone && 'Direct: ' + v.phone, v.office && 'Main office: ' + v.office, v.email && 'Email: ' + v.email, v.trackingEmail && 'Tracking / POD: ' + v.trackingEmail, website(v.website) && v.website, v.address].filter(Boolean).join('\n');
  }
  root.SkybridgeSignature = { build, plain, defaults, escape, website, base };
})(typeof window !== 'undefined' ? window : globalThis);
