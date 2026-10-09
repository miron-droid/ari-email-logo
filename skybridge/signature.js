(function (root) {
  'use strict';
  const base = 'https://miron-droid.github.io/ari-email-logo/skybridge/assets/';
  const media = { animated: 'skybridge-white-once.gif', static: 'skybridge-white-static.png' };
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
    const labelStyle = 'font-size:10px;line-height:15px;letter-spacing:0.8px;color:#8a692c;';
    const textStyle = 'font-size:14px;line-height:21px;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;';
    let personal = '';
    if (v.phone) personal += '<div style="padding-top:13px;"><div style="' + labelStyle + '">DIRECT</div>' + textLink(v.phone, 'tel:' + v.phone.replace(/[^+0-9]/g, ''), 'font-size:19px;line-height:26px;font-weight:bold;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;') + '</div>';
    if (v.office) personal += '<div style="padding-top:12px;"><div style="' + labelStyle + '">MAIN OFFICE</div>' + textLink(v.office, 'tel:' + v.office.replace(/[^+0-9]/g, ''), 'font-size:' + (v.phone ? 17 : 19) + 'px;line-height:26px;font-weight:bold;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;') + '</div>';
    if (v.email) personal += '<div style="padding-top:9px;"><div style="' + labelStyle + '">EMAIL</div>' + textLink(v.email, emailLink(v.email), textStyle, true) + '</div>';

    const corporateLines = [];
    if (v.trackingEmail) corporateLines.push('<div style="padding-bottom:6px;font-size:13px;line-height:20px;overflow-wrap:anywhere;word-wrap:break-word;"><span style="' + labelStyle + '">TRACKING / POD</span>&nbsp;&nbsp; ' + textLink(v.trackingEmail, emailLink(v.trackingEmail), textStyle, true) + '</div>');
    const url = website(v.website);
    if (url) corporateLines.push('<div style="padding-bottom:5px;overflow-wrap:anywhere;word-wrap:break-word;">' + textLink(v.website.replace(/^https?:\/\//i, '').replace(/\/$/, ''), url, 'font-size:13px;line-height:20px;color:#8a692c;overflow-wrap:anywhere;word-wrap:break-word;') + '</div>');
    if (v.address) corporateLines.push('<div style="font-size:13px;line-height:20px;color:#657588;overflow-wrap:anywhere;word-wrap:break-word;">' + escape(v.address) + '</div>');
    const credentials = [
      v.mc && 'MC <strong style="font-weight:bold;color:#52667c;">' + escape(v.mc) + '</strong>',
      v.dot && 'USDOT <strong style="font-weight:bold;color:#52667c;">' + escape(v.dot) + '</strong>'
    ].filter(Boolean).join('&nbsp;&nbsp; <span style="color:#c99a3d;">&middot;</span>&nbsp;&nbsp; ');

    return '<table role="presentation" width="720" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:720px;table-layout:fixed;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;background:#ffffff;color:#052749;">\n' +
      '<colgroup><col width="66%" style="width:66%;"><col width="34%" style="width:34%;"></colgroup>\n' +
      '<tr><td colspan="2" bgcolor="#ffffff" style="padding:0 0 12px;border-bottom:1px solid #dbc28c;background:#ffffff;">\n' +
      '<div style="font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.4px;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;">Skybridge Logistics LLC</div>\n' +
      (credentials ? '<div style="padding-top:5px;font-size:11px;line-height:18px;letter-spacing:0.4px;color:#8a692c;overflow-wrap:anywhere;word-wrap:break-word;">' + credentials + '</div>\n' : '') +
      '</td></tr>\n' +
      '<tr><td width="66%" valign="top" bgcolor="#ffffff" style="width:66%;padding:20px 20px 20px 0;background:#ffffff;overflow-wrap:anywhere;word-wrap:break-word;">\n' +
      '<div style="font-size:22px;line-height:28px;font-weight:bold;color:#052749;overflow-wrap:anywhere;word-wrap:break-word;">' + escape(v.name || 'Dispatch Team') + '</div>\n' +
      (v.name && v.role ? '<div style="padding-top:3px;font-size:13px;line-height:19px;color:#657588;overflow-wrap:anywhere;word-wrap:break-word;">' + escape(v.role) + '</div>\n' : '') +
      personal + '\n' +
      '</td><td width="34%" valign="middle" align="center" bgcolor="#ffffff" style="width:34%;padding:12px 0 12px 10px;background:#ffffff;line-height:0;">\n' +
      '<img src="' + escape(image) + '" width="220" height="220" alt="Skybridge Logistics LLC" style="display:block;width:100%;max-width:220px;height:auto;border:0;">\n' +
      '</td></tr>\n' +
      (corporateLines.length ? '<tr><td colspan="2" bgcolor="#ffffff" style="padding:13px 0 0;border-top:1px solid #e5e9ed;background:#ffffff;overflow-wrap:anywhere;word-wrap:break-word;">' + corporateLines.join('\n') + '</td></tr>\n' : '') +
      '</table>';
  }
  function plain(input = {}) {
    const v = { ...defaults, ...input };
    for (const field of Object.keys(defaults)) if (field !== 'animated') v[field] = String(v[field] || '').trim();
    return ['Skybridge Logistics LLC', [v.mc && 'MC ' + v.mc, v.dot && 'USDOT ' + v.dot].filter(Boolean).join(' / '), v.name || 'Dispatch Team', v.name && v.role, v.phone && 'Direct: ' + v.phone, v.office && 'Main office: ' + v.office, v.email && 'Email: ' + v.email, v.trackingEmail && 'Tracking / POD: ' + v.trackingEmail, website(v.website) && v.website, v.address].filter(Boolean).join('\n');
  }
  root.SkybridgeSignature = { build, plain, defaults, escape, website, base };
})(typeof window !== 'undefined' ? window : globalThis);
