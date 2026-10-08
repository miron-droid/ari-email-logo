(function () {
  'use strict';
  const model = window.SkybridgeSignature;
  const bid = window.SkybridgeBid;
  const key = 'skybridge-email-kit-v1';
  const prefsKey = 'skybridge-email-kit-ui-v1';
  const form = document.getElementById('signature-form');
  const status = document.getElementById('status');
  const code = document.getElementById('code');
  const preview = document.getElementById('preview');
  const example = document.getElementById('example');
  const showSignature = document.getElementById('show-signature');
  const unified = Boolean(document.getElementById('tab-signature'));
  const previewBase = form ? 'assets/' : '../assets/';
  let data = { ...model.defaults };
  let view = form ? 'signature' : 'bid';
  let prefs = { example: 'standard', showSignature: true, width: 'desktop' };

  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && typeof saved === 'object') {
      for (const field of Object.keys(data)) {
        if (typeof saved[field] === typeof data[field]) data[field] = saved[field];
      }
    } else if (matchMedia('(prefers-reduced-motion: reduce)').matches) data.animated = false;
    const savedPrefs = JSON.parse(localStorage.getItem(prefsKey) || 'null');
    if (savedPrefs && typeof savedPrefs === 'object') {
      if (['standard', 'stress', 'tokens'].includes(savedPrefs.example)) prefs.example = savedPrefs.example;
      if (typeof savedPrefs.showSignature === 'boolean') prefs.showSignature = savedPrefs.showSignature;
      if (['desktop', 'mobile'].includes(savedPrefs.width)) prefs.width = savedPrefs.width;
    }
  } catch {}

  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(prefsKey, JSON.stringify(prefs));
    } catch {}
  }

  function fillForm() {
    if (!form) return;
    for (const [name, value] of Object.entries(data)) {
      const input = form.elements.namedItem(name);
      if (!input) continue;
      if (input.type === 'checkbox') input.checked = value;
      else input.value = value;
    }
  }

  function readForm() {
    if (!form) return;
    for (const name of Object.keys(data)) {
      const input = form.elements.namedItem(name);
      if (input) data[name] = input.type === 'checkbox' ? input.checked : input.value.trim();
    }
  }

  function exportHtml() {
    return view === 'bid' ? bid.template : model.build(data);
  }

  function bidPreview() {
    let html = bid.template;
    const values = bid.examples[prefs.example];
    if (values) {
      for (const token of bid.tokens) {
        if (token !== '[sign]') html = html.split(token).join(model.escape(values[token] || token));
      }
    }
    const signature = prefs.showSignature
      ? model.build(data, previewBase)
      : '<div style="font:11px/18px Arial;color:#7c8998;padding:12px 0;">[sign] · CargoETL вставит подпись диспетчера</div>';
    return html.replace('[sign]', signature);
  }

  function render() {
    preview.innerHTML = view === 'bid' ? bidPreview() : model.build(data, previewBase);
    code.value = exportHtml();
    const from = document.getElementById('from-label');
    if (from) from.textContent = data.name || 'Skybridge Dispatch Team';
    status.textContent = '';
  }

  function setWidth(width) {
    prefs.width = width;
    document.getElementById('mail-window').classList.toggle('mobile-mode', width === 'mobile');
    document.querySelectorAll('[data-width]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.width === width));
    });
    save();
  }

  function setView(nextView) {
    view = nextView === 'bid' ? 'bid' : 'signature';
    const isBid = view === 'bid';
    document.querySelectorAll('[data-view]').forEach(tab => {
      const selected = tab.dataset.view === view;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });
    document.getElementById('editor-panel').setAttribute('aria-labelledby', 'tab-' + view);
    document.getElementById('bid-help').hidden = !isBid;
    document.getElementById('bid-examples').hidden = !isBid;
    document.getElementById('signature-greeting').hidden = isBid;
    document.getElementById('bid-greeting').hidden = !isBid;
    document.getElementById('signature-install').hidden = isBid;
    document.getElementById('bid-install').hidden = !isBid;
    document.getElementById('copy-rich').hidden = isBid;
    document.getElementById('mail-window').classList.toggle('bid-visual', isBid);
    document.getElementById('mail-chrome-label').textContent = isBid ? 'New bid' : 'New message';
    document.getElementById('subject-label').textContent = isBid ? 'Load bid' : 'Load inquiry';
    document.getElementById('preview-title').textContent = isBid ? 'Ставка с вашей подписью' : 'Так будет выглядеть подпись';
    document.getElementById('copy-html').textContent = isBid ? 'Скопировать bid template' : 'Скопировать для CargoETL';
    document.getElementById('download').textContent = isBid ? 'Скачать bid template' : 'Скачать подпись';
    document.getElementById('source-label').textContent = isBid ? 'Посмотреть HTML с переменными CargoETL' : 'Посмотреть HTML подписи';
    code.setAttribute('aria-label', isBid ? 'HTML шаблона ставки' : 'HTML вашей подписи');
    document.getElementById('preview-note').textContent = isBid
      ? 'Данные рейса — пример. ETA — время в пути до pickup. В копии сохраняются переменные CargoETL и [sign].'
      : 'Текст письма приведён для примера. Копируется только ваша подпись.';
    const nextLink = document.getElementById('next-view');
    nextLink.href = isBid ? '#signature' : '#bid';
    nextLink.textContent = isBid ? 'Перейти к подписи →' : 'Перейти к bid template →';
    document.querySelector('.kit-number').textContent = isBid ? '02 / 02' : '01 / 02';
    render();
  }

  function download(text, name) {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function fallback() {
    document.getElementById('source').open = true;
    code.focus();
    code.select();
    status.textContent = 'HTML выделен ниже — нажмите ⌘C или Ctrl+C.';
  }

  document.querySelectorAll('[data-width]').forEach(button => {
    button.addEventListener('click', () => setWidth(button.dataset.width));
  });

  if (form) {
    fillForm();
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('input', () => { readForm(); save(); render(); });
    document.getElementById('reset').addEventListener('click', () => {
      data = { ...model.defaults };
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) data.animated = false;
      fillForm();
      save();
      render();
      status.textContent = 'Ваши данные очищены.';
    });
    document.getElementById('copy-rich').addEventListener('click', async () => {
      if (view !== 'signature' || !form.reportValidity()) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([model.build(data)], { type: 'text/html' }),
          'text/plain': new Blob([model.plain(data)], { type: 'text/plain' })
        })]);
        status.textContent = 'Подпись скопирована с оформлением. Вставьте в редактор подписи Gmail.';
      } catch {
        const copySurface = document.createElement('div');
        copySurface.style.cssText = 'position:fixed;left:-10000px;top:0;width:640px;';
        copySurface.setAttribute('aria-hidden', 'true');
        copySurface.innerHTML = model.build(data);
        document.body.appendChild(copySurface);
        const range = document.createRange();
        range.selectNodeContents(copySurface);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        let copied = false;
        try { copied = document.execCommand('copy'); } catch {}
        selection.removeAllRanges();
        copySurface.remove();
        status.textContent = copied
          ? 'Подпись скопирована с оформлением. Вставьте в Gmail.'
          : 'Скачайте подпись, откройте HTML в браузере и скопируйте оформление в Gmail.';
      }
    });
  }

  if (example && showSignature) {
    example.value = prefs.example;
    showSignature.checked = prefs.showSignature;
    example.addEventListener('change', () => { prefs.example = example.value; save(); render(); });
    showSignature.addEventListener('change', () => { prefs.showSignature = showSignature.checked; save(); render(); });
  }

  document.getElementById('copy-html').addEventListener('click', async () => {
    if (view === 'signature' && form && !form.reportValidity()) return;
    const copiedView = view;
    try {
      await navigator.clipboard.writeText(exportHtml());
      status.textContent = copiedView === 'bid'
        ? 'Bid template скопирован. Переменные CargoETL и [sign] сохранены.'
        : 'HTML подписи скопирован. Вставьте в CargoETL в режиме HTML.';
    } catch { fallback(); }
  });

  document.getElementById('download').addEventListener('click', () => {
    if (view === 'signature' && form && !form.reportValidity()) return;
    download(exportHtml(), view === 'bid' ? 'skybridge-bid-template.html' : 'skybridge-signature.html');
    status.textContent = view === 'bid'
      ? 'Скачан bid template с переменными CargoETL.'
      : 'Скачана подпись с вашими текущими данными.';
  });

  if (unified) {
    const tabs = Array.from(document.querySelectorAll('[data-view]'));
    tabs.forEach(tab => {
      tab.addEventListener('keydown', event => {
        let index = tabs.indexOf(tab);
        if (event.key === 'ArrowRight') index = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') index = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[index].focus();
        location.hash = tabs[index].dataset.view;
        setView(tabs[index].dataset.view);
      });
    });
    window.addEventListener('hashchange', () => setView(location.hash === '#bid' ? 'bid' : 'signature'));
    setView(location.hash === '#bid' ? 'bid' : 'signature');
  } else render();
  setWidth(prefs.width);
})();
