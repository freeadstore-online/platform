// Related Tools — FreeAdStore
// Cross-store discovery: links to sibling stores in the ecosystem
(function() {
  const ACCENT = '#ef4444';
  const REGISTRY_KEY = 'tools';

  const CROSS_STORE = [
    { name: 'FreeDesignStore', url: 'https://freedesignstore.online', desc: 'Free design tools', color: '#ec4899' },
    { name: 'FreeMarketingStore', url: 'https://freemarketingstore.online', desc: 'Free marketing tools', color: '#f97316' },
    { name: 'FreeAppStore', url: 'https://freeappstore.online', desc: 'Free web apps', color: '#6366f1' },
    { name: 'Open Frontier', url: 'https://openfrontier.online', desc: 'Open-source platform', color: '#10b981' }
  ];

  function getCurrentId() {
    const match = window.location.pathname.match(/\/(?:create|preview|budget|audience|optimize|analytics|compliance|learn)\/([^/]+)/);
    return match ? match[1] : null;
  }

  function getCategory() {
    const match = window.location.pathname.match(/\/(create|preview|budget|audience|optimize|analytics|compliance|learn)\//);
    return match ? match[1] : null;
  }

  function render(current, items) {
    const same = items.filter(i => i.category === current.category && i.id !== current.id);
    const others = items.filter(i => i.category !== current.category && i.id !== current.id);
    let related = same.slice(0, 3);
    if (related.length < 3) related = related.concat(others.slice(0, 3 - related.length));

    const container = document.createElement('div');
    container.id = 'related-tools';
    container.innerHTML = '<style>' +
      '#related-tools{position:fixed;bottom:0;left:0;right:0;z-index:50;background:#fff;border-top:1px solid #e5e7eb;padding:.6rem 1rem;display:flex;align-items:center;gap:.6rem;overflow-x:auto;box-shadow:0 -2px 8px rgba(0,0,0,.04)}' +
      '.rel-label{font-size:.7rem;color:#6b7280;font-weight:600;white-space:nowrap;font-family:Manrope,system-ui,sans-serif}' +
      '.rel-card{display:flex;align-items:center;gap:.4rem;background:#fafafa;border:1px solid #e5e7eb;border-radius:8px;padding:.35rem .6rem;text-decoration:none;color:#1a1a1a;font-family:Manrope,system-ui,sans-serif;transition:border-color .15s;flex-shrink:0}' +
      '.rel-card:hover{border-color:' + ACCENT + '}' +
      '.rel-name{font-size:.72rem;font-weight:600;white-space:nowrap}' +
      '.rel-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}' +
      '.rel-sep{width:1px;height:20px;background:#e5e7eb;flex-shrink:0;margin:0 .2rem}' +
      '.rel-ext{font-size:.6rem;color:#9ca3af;font-weight:500;white-space:nowrap}' +
      '</style>' +
      '<span class="rel-label">Related:</span>' +
      related.map(function(r) {
        var cat = r.category || 'create';
        return '<a class="rel-card" href="/' + cat + '/' + r.id + '/"><span class="rel-name">' + r.name + '</span></a>';
      }).join('') +
      '<span class="rel-sep"></span>' +
      '<span class="rel-label">Explore:</span>' +
      CROSS_STORE.map(function(s) {
        return '<a class="rel-card" href="' + s.url + '" target="_blank" rel="noopener">' +
          '<span class="rel-dot" style="background:' + s.color + '"></span>' +
          '<span class="rel-name">' + s.name + '</span>' +
          '<span class="rel-ext">' + s.desc + '</span></a>';
      }).join('');

    document.body.appendChild(container);
  }

  var currentId = getCurrentId();
  if (!currentId) return;

  fetch('/registry.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var items = Array.isArray(data) ? data : (data[REGISTRY_KEY] || data.tools || []);
      var current = items.find(function(i) { return i.id === currentId; });
      if (current) render(current, items);
    })
    .catch(function() {});
})();
