function waitForZoneJs(timeout = 60000, interval = 10) {
  return new Promise((resolve) => {
    const start = Date.now();

    const checkZone = () => {
      if (typeof window.Zone !== 'undefined' && window.Zone.current) {
        resolve(true);
        return;
      }

      if (Date.now() - start >= timeout) {
        resolve(false);
        return;
      }

      setTimeout(checkZone, interval);
    };

    checkZone();
  });
}

// Использование
waitForZoneJs().then((zoneReady) => {
  if (!zoneReady) {
    console.warn('Zone.js не был найден за 60 секунд');
    return;
  }

  console.log('Zone.js инициализирован');

  document.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
  });
});


// UTM -> Для ссылок

(() => {
  const skip = a => {
    const href = a.getAttribute('href');
    if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href)) return true;
    const u = new URL(href, location.href);
    return u.origin === location.origin && u.pathname === location.pathname && u.hash;
  };

  const patch = a => {
    if (skip(a)) return;
    a.dataset.hrefBase ||= a.getAttribute('href');
    const u = new URL(a.dataset.hrefBase, location.href);
    new URLSearchParams(location.search).forEach((v, k) => u.searchParams.set(k, v));
    a.href = u.toString();
  };

  const scan = root => {
    root.matches?.('a[href]') && patch(root);
    root.querySelectorAll?.('a[href]').forEach(patch);
  };

  let lastSearch = location.search;
  const onUrlChange = () => {
    if (location.search !== lastSearch) {
      lastSearch = location.search;
      scan(document);
    }
  };

  ['pushState', 'replaceState'].forEach(method => {
    const original = history[method];
    history[method] = function () {
      const result = original.apply(this, arguments);
      onUrlChange();
      return result;
    };
  });

  addEventListener('popstate', onUrlChange);

  const added = new Set();
  let raf = 0;

  const observer = new MutationObserver(mutations => {
    mutations.forEach(m =>
      m.addedNodes.forEach(n => n.nodeType === 1 && added.add(n))
    );

    if (!raf && added.size) {
      raf = requestAnimationFrame(() => {
        raf = 0;
        added.forEach(scan);
        added.clear();
      });
    }
  });

  const init = () => {
    scan(document);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', e => {
      const a = e.target.closest?.('a[href]');
      if (a) patch(a);
    }, true);
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init, { once: true })
    : init();
})();
