// terms.js (v2.0.1) — Tilda agreements collector
// remove legacy hidden inputs
  (function () {
    'use strict';
    // -----------------------------
    // Logging
    // -----------------------------
    window.DEBUG_TERMS = (typeof window.DEBUG_TERMS === 'boolean') ? window.DEBUG_TERMS : false;

    // Логгер: пишет сообщения в консоль только если включён DEBUG_TERMS
    function logTerms() {
      if (!window.DEBUG_TERMS) return;
      try { console.log.apply(console, ['[Terms]'].concat([].slice.call(arguments))); } catch (_) {}
    }

    // Переключатель логов: window.debugTerms(true/false)
    window.debugTerms = function (state) {
      window.DEBUG_TERMS = !!state;
      console.log('[TermsDebug] Logs ' + (state ? 'ON' : 'OFF'));
    };

    // -----------------------------
    // Default config
    // -----------------------------
    var termsConsts = {
      terms: {
        url: 'https://legal.skyeng.ru/doc/describe/2068',
        textToFind: 'персональных данных',
        fallbackId: '3981',
        fallbackLink: 'https://legal.skyeng.ru/upload/document-version-pdf/1BcCZSVE/NkS-8hoq/Icjjk9vw/OOSkLtYz/original/4050.pdf'
      },
      adv: {
        url: 'https://legal.skyeng.ru/doc/describe/2066',
        textToFind: 'рекламы',
        fallbackId: '3982',
        fallbackLink: 'https://legal.skyeng.ru/upload/document-version-pdf/VJ0cRv8U/j1K207LU/8JqOoUkY/InLIltOn/original/4051.pdf'
      }
    };

    window.termsConsts = window.termsConsts || termsConsts;

    // -----------------------------
    // Helpers
    // -----------------------------

    // Проверка "пустого" объекта/массива (нужно для initTerms({}) => default)
    function isEmptyObject(obj) {
      if (!obj || typeof obj !== 'object') return true;
      if (Array.isArray(obj)) return obj.length === 0;
      return Object.keys(obj).length === 0;
    }

    // Приводит конфиг к массиву items (поддерживает объект {k:{...}} и массив [{...}])
    function asArrayConfig(config) {
      if (Array.isArray(config)) {
        return config.map(function (item, idx) {
          var key = item && item.key ? String(item.key) : ('item_' + idx);
          return normalizeItem(key, item);
        });
      }

      var out = [];
      if (config && typeof config === 'object') {
        Object.keys(config).forEach(function (key) {
          out.push(normalizeItem(key, config[key]));
        });
      }
      return out;
    }

    // Нормализует один элемент конфига (ставит пустые строки по умолчанию)
    function normalizeItem(key, item) {
      item = item || {};
      return {
        key: String(key),
        url: String(item.url || ''),
        textToFind: String(item.textToFind || ''),
        fallbackId: String(item.fallbackId || ''),
        fallbackLink: String(item.fallbackLink || '')
      };
    }

    // Гарантирует наличие hidden input внутри .t-form__inputsbox (создаёт при отсутствии)
    function ensureHiddenInput(inputsBox, name) {
      if (!inputsBox) return null;
      var input = inputsBox.querySelector('input[name="' + name + '"]');
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        inputsBox.appendChild(input);
        logTerms('[ADD] hidden input:', name, inputsBox);
      }
      return input;
    }

    // Убирает дубликаты и пустые значения из массива строк
    function uniq(arr) {
      var map = Object.create(null);
      var out = [];
      for (var i = 0; i < arr.length; i++) {
        var v = String(arr[i] || '').trim();
        if (!v) continue;
        if (map[v]) continue;
        map[v] = true;
        out.push(v);
      }
      return out;
    }

    // Проверяет, залочен ли чекбокс (нельзя подменять версию/ссылку после действия пользователя)
    function isLocked(checkbox) {
      try {
        return (checkbox &&
          (checkbox.getAttribute('data-terms-locked') === '1' ||
           (checkbox.dataset && checkbox.dataset.termsLocked === '1')));
      } catch (_) {}
      return false;
    }

    // Ставит "лок" на чекбокс (и сохраняет причину: link/checked)
    function lockCheckbox(checkbox, reason) {
      try {
        checkbox.setAttribute('data-terms-locked', '1');
        if (checkbox.dataset) checkbox.dataset.termsLocked = '1';
        if (reason) checkbox.setAttribute('data-terms-lock-reason', reason);
      } catch (_) {}
    }

    // Находит чекбокс в форме по совпадению текста у .t-checkbox__labeltext
    function findCheckboxByLabelText(form, textToFind) {
      if (!form || !textToFind) return null;

      var nodes = form.querySelectorAll('.t-checkbox__labeltext');
      for (var i = 0; i < nodes.length; i++) {
        var labelTextNode = nodes[i];
        var text = (labelTextNode.textContent || '');
        if (text.indexOf(textToFind) === -1) continue;

        var root = labelTextNode.closest('label') ||
          labelTextNode.closest('.t-checkbox') ||
          labelTextNode.parentElement;

        if (!root) continue;

        var cb = root.querySelector('input[type="checkbox"]');
        if (cb) return { checkbox: cb, labelTextNode: labelTextNode };
      }

      return null;
    }

    // Вставляет ссылку на документ в текст чекбокса или обновляет href, если ссылка уже вставлена
    function injectOrUpdateLink(labelTextNode, itemKey, textToFind, href) {
      if (!labelTextNode) return;

      var existing = labelTextNode.querySelector('a.agreement_link[data-terms-key="' + itemKey + '"]');
      if (existing) {
        if (href && existing.getAttribute('href') !== href) {
          existing.setAttribute('href', href);
          logTerms('[UPDATE] link href for', itemKey, href);
        }
        return;
      }

      try {
        var html = labelTextNode.innerHTML || '';
        if (html.indexOf(textToFind) === -1) return;

        var a = '<a class="agreement_link" data-terms-key="' + itemKey + '" href="' + href +
          '" target="_blank" rel="noreferrer noopener">' + textToFind + '</a>';

        var idx = html.indexOf(textToFind);
        if (idx === -1) return;

        labelTextNode.innerHTML = html.slice(0, idx) + a + html.slice(idx + textToFind.length);
        logTerms('[LINK] inserted link for', itemKey);
      } catch (e) {
        logTerms('[ERR] injectOrUpdateLink failed for', itemKey, e && e.message);
      }
    }

    // Удаляет лишние hidden-инпуты termsDocumentVersionId / terms_document_version_id
    function removeLegacyHiddenInputs(form) {
      try {
        if (!form) return;
    
        var names = [
          'terms_document_version_id',
          'termsDocumentVersionId'
        ];
    
        for (var i = 0; i < names.length; i++) {
          var name = names[i];
          var nodes = form.querySelectorAll('input[name="' + name + '"]');
          for (var j = 0; j < nodes.length; j++) {
            var el = nodes[j];
            if (el && el.parentNode) {
              el.parentNode.removeChild(el);
              logTerms('[DEL] legacy hidden removed:', name, el);
            }
          }
        }
      } catch (e) {
        logTerms('[ERR] removeLegacyHiddenInputs failed:', e && e.message);
      }
    }



    // -----------------------------
    // Legal data fetching with fallback + late update
    // -----------------------------
    var legalCache = Object.create(null);

    // Загружает данные документа из API с таймаутом на fallback и ретраями
    function fetchLegalData(item, onResolved) {
      var url = item.url;
      if (!url) return;

      if (legalCache[url] && legalCache[url].promise) {
        if (typeof onResolved === 'function' && legalCache[url].data) onResolved(legalCache[url].data);
        return;
      }

      legalCache[url] = legalCache[url] || {};
      legalCache[url].status = 'fetching';

      var fallbackData = {
        versionId: Number(item.fallbackId) || item.fallbackId,
        link: item.fallbackLink,
        source: 'fallback'
      };

      var TIMEOUT_MS = 3000;
      var settled = false;

      var timeoutId = setTimeout(function () {
        if (settled) return;
        settled = true;
        legalCache[url].data = fallbackData;
        legalCache[url].status = 'fallback';
        logTerms('[TIMEOUT] using fallback for', item.key, fallbackData);
        if (typeof onResolved === 'function') onResolved(fallbackData);
      }, TIMEOUT_MS);

      var maxAttempts = 3;
      var attempt = 0;

      // Делает один запрос к API с ретраями (макс. 3 попытки)
      function doFetch() {
        attempt++;
        return fetch(url, { method: 'GET' })
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
          })
          .then(function (data) {
            if (!data || (typeof data.versionId === 'undefined') || !data.link) {
              throw new Error('Bad JSON shape');
            }
            return { versionId: data.versionId, link: data.link, source: 'remote' };
          })
          .catch(function (err) {
            if (attempt < maxAttempts) {
              return new Promise(function (r) { setTimeout(r, 800); }).then(doFetch);
            }
            throw err;
          });
      }

      legalCache[url].promise = doFetch()
        .then(function (realData) {
          clearTimeout(timeoutId);
          legalCache[url].data = realData;
          legalCache[url].status = 'ready';
          logTerms('[FETCH] legal data for', item.key, realData);
          if (typeof onResolved === 'function') onResolved(realData);
          return realData;
        })
        .catch(function (err) {
          clearTimeout(timeoutId);

          if (!settled) {
            settled = true;
            legalCache[url].data = fallbackData;
            legalCache[url].status = 'fallback';
            if (typeof onResolved === 'function') onResolved(fallbackData);
          }

          logTerms('[ERR] fetch failed for', item.key, err && err.message);
          return fallbackData;
        });
    }

    // -----------------------------
    // Core
    // -----------------------------
    var HIDDEN_1 = 'acceptedAgreementsString';
    var HIDDEN_2 = 'agreements_accepted_string';

    // Пересобирает значение hidden-полей по отмеченным чекбоксам (versionId через запятую)
    function updateHiddenValuesForForm(form) {
      try {
        removeLegacyHiddenInputs(form);
        
        var inputsBox = form.querySelector('.t-form__inputsbox');
        if (!inputsBox) return;

        var h1 = ensureHiddenInput(inputsBox, HIDDEN_1);
        var h2 = ensureHiddenInput(inputsBox, HIDDEN_2);
        if (!h1 || !h2) return;

        var checkedIds = [];
        var checkboxes = form.querySelectorAll('input[type="checkbox"][data-terms-key]');
        for (var i = 0; i < checkboxes.length; i++) {
          var cb = checkboxes[i];
          if (!cb.checked) continue;
          var vid = cb.getAttribute('data-version-id') || '';
          if (vid) checkedIds.push(String(vid));
        }

        checkedIds = uniq(checkedIds);
        var value = checkedIds.join(',');

        h1.value = value;
        h2.value = value;

        logTerms('[WRITE] hidden updated:', value, form);
      } catch (e) {
        logTerms('[ERR] updateHiddenValuesForForm failed:', e && e.message);
      }
    }

    // Привязывает один item конфига к форме: находит чекбокс, ставит data-атрибуты, вставляет ссылку, подписывается на события
    function bindItemToForm(form, item, resolvedData) {
      var found = findCheckboxByLabelText(form, item.textToFind);
      if (!found) return;

      var checkbox = found.checkbox;
      var labelTextNode = found.labelTextNode;

      var bindKey = 'termsBound_' + item.key;

      // Если уже привязан: обновляем только если НЕ залочено и НЕ отмечено
      if (checkbox.dataset && checkbox.dataset[bindKey] === '1') {
        if (isLocked(checkbox) || checkbox.checked) return;

        if (resolvedData && resolvedData.link) {
          injectOrUpdateLink(labelTextNode, item.key, item.textToFind, resolvedData.link);
          checkbox.setAttribute('data-version-id', resolvedData.versionId);
          checkbox.setAttribute('data-link', resolvedData.link);
        }
        return;
      }

      checkbox.setAttribute('data-terms-key', item.key);
      checkbox.setAttribute('data-version-id', (resolvedData && resolvedData.versionId) ? resolvedData.versionId : item.fallbackId);
      checkbox.setAttribute('data-link', (resolvedData && resolvedData.link) ? resolvedData.link : item.fallbackLink);

      if (checkbox.dataset) checkbox.dataset[bindKey] = '1';

      // Вставляем/обновляем ссылку в тексте
      injectOrUpdateLink(labelTextNode, item.key, item.textToFind, checkbox.getAttribute('data-link'));

      // Отслеживаем клик по ссылке и лочим версию (чтобы позже не подменилось на API)
      try {
        var linkEl = labelTextNode.querySelector('a.agreement_link[data-terms-key="' + item.key + '"]');
        if (linkEl && !linkEl.getAttribute('data-terms-click-bound')) {
          linkEl.setAttribute('data-terms-click-bound', '1');

          linkEl.addEventListener('click', function (e) {
            try { e.stopPropagation(); } catch (_) {}

            if (!isLocked(checkbox)) {
              lockCheckbox(checkbox, 'link');
              logTerms('[LOCK] by link click:', item.key, checkbox.getAttribute('data-version-id'));
            }
          }, true);
        }
      } catch (_) {}

      // На change: обновляем hidden, и лочим на checked=true
      checkbox.addEventListener('change', function () {
        logTerms('[CHECK] checkbox change:', item.key, checkbox.checked);

        if (checkbox.checked && !isLocked(checkbox)) {
          lockCheckbox(checkbox, 'checked');
          logTerms('[LOCK] by checkbox check:', item.key, checkbox.getAttribute('data-version-id'));
        }

        updateHiddenValuesForForm(form);
      });

      updateHiddenValuesForForm(form);
      logTerms('[OK] bound checkbox for', item.key, form);
    }

    // Гарантирует наличие двух hidden полей в форме (для отправки в Tilda)
    function ensureHiddenInputsOnForm(form) {
      // Удаляем конфликтующие hidden, если легаси их добавил
      removeLegacyHiddenInputs(form);
      
      var inputsBox = form.querySelector('.t-form__inputsbox');
      if (!inputsBox) return;
      ensureHiddenInput(inputsBox, HIDDEN_1);
      ensureHiddenInput(inputsBox, HIDDEN_2);
    }

    // Проходит по всем формам на странице и пытается забиндить все items конфига
    function processForms(configArray) {
      try {
        var forms = document.querySelectorAll('form.t-form, form');
        for (var i = 0; i < forms.length; i++) {
          var form = forms[i];
          if (!form) continue;

          removeLegacyHiddenInputs(form);
          ensureHiddenInputsOnForm(form);

          for (var j = 0; j < configArray.length; j++) {
            (function (item) {
              var cached = item.url && legalCache[item.url] && legalCache[item.url].data;
              var dataNow = cached || { versionId: item.fallbackId, link: item.fallbackLink, source: 'fallback' };
              bindItemToForm(form, item, dataNow);
            })(configArray[j]);
          }

          updateHiddenValuesForForm(form);
        }
      } catch (e) {
        logTerms('[ERR] processForms failed:', e && e.message);
      }
    }

    // -----------------------------
    // Observer + init
    // -----------------------------
    var _configArray = [];
    var _observerStarted = false;
    var _debounceTimer = null;

    // Дебаунсит вызов processForms (чтобы не гонять его слишком часто)
    function scheduleProcess() {
      if (_debounceTimer) clearTimeout(_debounceTimer);
      _debounceTimer = setTimeout(function () {
        processForms(_configArray);
      }, 60);
    }

    // Селектор "релевантных" узлов для MutationObserver (всё остальное игнорируем)
    var OBS_RELEVANT_SELECTOR =
      'form, form.t-form, .t-form__inputsbox, .t-checkbox__labeltext, .t-checkbox, input[type="checkbox"], a.agreement_link, input[type="hidden"][name="terms_document_version_id"], input[type="hidden"][name="termsDocumentVersionId"]';

    // Проверяет: этот DOM-узел сам релевантен или содержит релевантные элементы внутри
    function nodeHasRelevant(node) {
      if (!node || node.nodeType !== 1) return false;
      var el = node;
      try {
        if (el.matches && el.matches(OBS_RELEVANT_SELECTOR)) return true;
        if (el.querySelector && el.querySelector(OBS_RELEVANT_SELECTOR)) return true;
      } catch (_) {}
      return false;
    }

    // Проверяет список мутаций: есть ли среди добавленных/удалённых узлов что-то связанное с формами/чекбоксами
    function mutationsAreRelevant(mutations) {
      if (!mutations || !mutations.length) return false;
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (!m || m.type !== 'childList') continue;

        var an = m.addedNodes;
        if (an && an.length) {
          for (var a = 0; a < an.length; a++) {
            if (nodeHasRelevant(an[a])) return true;
          }
        }

        var rn = m.removedNodes;
        if (rn && rn.length) {
          for (var r = 0; r < rn.length; r++) {
            if (nodeHasRelevant(rn[r])) return true;
          }
        }
      }
      return false;
    }

    // Запускает MutationObserver и реагирует только на релевантные изменения DOM
    function startObserver() {
      if (_observerStarted) return;
      _observerStarted = true;

      var body = document.body;
      if (!body) {
        logTerms('[OBS] document.body not ready yet');
        return;
      }

      var observer = new MutationObserver(function (mutations) {
        if (!mutationsAreRelevant(mutations)) return;
        scheduleProcess();
      });

      observer.observe(body, { childList: true, subtree: true });
      logTerms('[OBS] MutationObserver started (filtered)');

      scheduleProcess();
    }

    // Публичная инициализация: выбирает конфиг (custom / window.termsConfig / window.termsConsts / default) и запускает всё
    function initTerms(customConfig) {
      try {
        // initTerms({}) => use defaults
        var customIsProvided = (typeof customConfig !== 'undefined') && !isEmptyObject(customConfig);

        var cfg = customIsProvided
          ? customConfig
          : (
            (Array.isArray(window.termsConfig) || (window.termsConfig && typeof window.termsConfig === 'object' && !isEmptyObject(window.termsConfig)))
              ? window.termsConfig
              : (window.termsConsts && !isEmptyObject(window.termsConsts) ? window.termsConsts : termsConsts)
          );

        _configArray = asArrayConfig(cfg);

        logTerms('[INIT] config items:', _configArray.map(function (x) { return x.key; }).join(', '));

        _configArray.forEach(function (item) {
          fetchLegalData(item, function () {
            scheduleProcess();
          });
        });

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', startObserver, { once: true });
        } else {
          startObserver();
        }
      } catch (e) {
        logTerms('[ERR] initTerms failed:', e && e.message);
      }
    }

    window.initTerms = initTerms;
  })();
