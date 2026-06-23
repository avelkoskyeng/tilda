// cp_tpl core modules v3

(function (window, document) {
  'use strict';

  window.cp_tpl = window.cp_tpl || {};

  var GTM_IDS = {
    skyeng: 'GTM-W9V46F',
    skysmart: 'GTM-MBGZXZJ',
    b2b: 'GTM-W5SMTKB'
  };

  var loadedGtm = {};

  window.cp_tpl.gtm = function (config) {
    var options = normalizeGtmConfig(config);

    if (!options.id) {
      logError('GTM id is required');
      return;
    }

    var dataLayerName = options.dataLayer || 'dataLayer';
    var registryKey = options.id + ':' + dataLayerName;

    if (loadedGtm[registryKey]) {
      return;
    }

    loadedGtm[registryKey] = true;

    window[dataLayerName] = window[dataLayerName] || [];

    window[dataLayerName].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    var firstScript = document.getElementsByTagName('script')[0];
    var gtmScript = document.createElement('script');
    var dataLayerParam = dataLayerName !== 'dataLayer' ? '&l=' + dataLayerName : '';

    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + options.id + dataLayerParam;

    firstScript.parentNode.insertBefore(gtmScript, firstScript);
  };

  function normalizeGtmConfig(config) {
    if (typeof config === 'string') {
      return {
        id: GTM_IDS[config] || config,
        brand: GTM_IDS[config] ? config : null,
        dataLayer: 'dataLayer'
      };
    }

    if (typeof config === 'object' && config !== null) {
      return {
        id: config.id || GTM_IDS[config.brand],
        brand: config.brand || null,
        dataLayer: config.dataLayer || 'dataLayer'
      };
    }

    return {};
  }

  function logError(message) {
    if (window.console && window.console.error) {
      window.console.error('[cp_tpl.gtm] ' + message);
    }
  }

})(window, document);

(function (window, document) {
  'use strict';

  var cp = window.cp_tpl = window.cp_tpl || {};

  var zoomItems = [];
  var zoomRegistry = {};
  var zoomResizeBound = false;
  var zoomRafId = null;

  cp.zoom = function (config) {
    var options = normalizeZoomConfig(config);

    if (!options.selector) {
      logError('zoom', 'selector is required');
      return;
    }

    var key = [
      options.selector,
      options.breakpoint,
      options.desktopBase,
      options.mobileBase,
      options.desktopVar,
      options.mobileVar,
      options.mode
    ].join('|');

    if (zoomRegistry[key]) {
      return;
    }

    zoomRegistry[key] = true;
    zoomItems.push(options);

    injectZoomCSS(options);
    updateZoomVars(options);
    bindZoomResize();
  };

  function normalizeZoomConfig(config) {
    if (typeof config === 'string') {
      config = {
        selector: config
      };
    }

    config = config || {};

    var desktopBase = config.desktopBase || 1200;
    var mobileBase = config.mobileBase || 376;
    var mode = config.mode || config.only || 'both';

    if (Array.isArray(config.devices)) {
      if (config.devices.length === 1) {
        mode = config.devices[0];
      } else {
        mode = 'both';
      }
    }

    if (mode === 'mob') mode = 'mobile';
    if (mode === 'desk') mode = 'desktop';

    return {
      selector: config.selector,
      breakpoint: config.breakpoint || 640,

      desktopBase: desktopBase,
      mobileBase: mobileBase,

      desktopVar: config.desktopVar || '--z' + desktopBase,
      mobileVar: config.mobileVar || '--z' + mobileBase,

      mode: mode === 'mobile' || mode === 'desktop' ? mode : 'both'
    };
  }

  function injectZoomCSS(options) {
    var styleId = 'cp_tpl_zoom_' + hashString([
      options.selector,
      options.breakpoint,
      options.desktopVar,
      options.mobileVar,
      options.mode
    ].join('|'));

    if (document.getElementById(styleId)) {
      return;
    }

    var rules = [];

    if (options.mode === 'desktop' || options.mode === 'both') {
      rules.push(
        '@media (min-width: ' + options.breakpoint + 'px) {',
        '  ' + options.selector + ' {',
        '    zoom: var(' + options.desktopVar + ', 1);',
        '  }',
        '}'
      );
    }

    if (options.mode === 'mobile' || options.mode === 'both') {
      rules.push(
        '@media (max-width: ' + (options.breakpoint - 1) + 'px) {',
        '  ' + options.selector + ' {',
        '    zoom: var(' + options.mobileVar + ', 1);',
        '  }',
        '}'
      );
    }

    var style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = rules.join('\n\n');

    document.head.appendChild(style);
  }

  function updateZoomVars(options) {
    var width = window.innerWidth || document.documentElement.clientWidth;

    if (options.mode === 'desktop' || options.mode === 'both') {
      document.documentElement.style.setProperty(
        options.desktopVar,
        width / options.desktopBase
      );
    }

    if (options.mode === 'mobile' || options.mode === 'both') {
      document.documentElement.style.setProperty(
        options.mobileVar,
        width / options.mobileBase
      );
    }
  }

  function updateAllZoomVars() {
    zoomItems.forEach(function (options) {
      updateZoomVars(options);
    });
  }

  function bindZoomResize() {
    if (zoomResizeBound) {
      return;
    }

    zoomResizeBound = true;

    window.addEventListener('resize', function () {
      if (zoomRafId) {
        window.cancelAnimationFrame(zoomRafId);
      }

      zoomRafId = window.requestAnimationFrame(function () {
        updateAllZoomVars();
        zoomRafId = null;
      });
    });
  }

  function hashString(value) {
    var hash = 0;
    var i;
    var chr;

    if (value.length === 0) {
      return hash;
    }

    for (i = 0; i < value.length; i++) {
      chr = value.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }

    return Math.abs(hash);
  }

  function logError(moduleName, message) {
    if (window.console && window.console.error) {
      window.console.error('[cp_tpl.' + moduleName + '] ' + message);
    }
  }

})(window, document);

(function (window, document) {
  'use strict';

  var cp = window.cp_tpl = window.cp_tpl || {};

  cp.assets = cp.assets || {};

  cp.assets.logos = {
    skyeng: {
      white: 'https://static.tildacdn.com/tild3031-3839-4635-b439-333137366564/BrandSkyeng_ColorWhi.svg',
      black: 'https://static.tildacdn.com/tild6562-6135-4230-b362-343764373339/BrandSkyeng_ColorWhi.svg'
    },
    b2b: {
      white: 'https://static.tildacdn.com/tild3137-6236-4435-a230-353431346330/BrandSkyeng_B2B_Colo.svg',
      black: 'https://static.tildacdn.com/tild3865-3335-4639-a261-393362373763/BrandSkyeng_B2B_Colo.svg'
    },
    skysmart: {
      white: 'https://static.tildacdn.com/tild3333-3965-4136-b935-333366626635/BrandSkysmart_ColorW.svg',
      black: 'https://static.tildacdn.com/tild6531-6532-4164-a338-343737656535/BrandSkysmart_ColorW.svg'
    },
    skypro: {
      white: 'https://static.tildacdn.com/tild3932-6238-4637-b132-663533326237/786.svg',
      black: 'https://static.tildacdn.com/tild6162-6632-4336-b861-346265393365/786_1.svg'
    }
  };

  cp.hiddenFieldsState = cp.hiddenFieldsState || {
    values: {},
    utmMarksMap: {
      promoCode: 'promocode',
      promocode: 'promocode',
      promo: 'promocode',
      comment: 'comment',
      marketing_experiments: 'marketingExperiments',
      marketingExperiments: 'marketingExperiments'
    }
  };

  function ensureStyle(id, css) {
    if (document.getElementById(id)) return;

    var style = document.createElement('style');
    style.id = id;
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function toArray(value) {
    return Array.prototype.slice.call(value || []);
  }

  function hasValue(value) {
    return value != null && value !== '';
  }

  function cleanObject(object) {
    var result = {};

    Object.keys(object || {}).forEach(function (key) {
      var value = object[key];

      if (value === undefined || value === null) return;
      if (typeof value === 'string' && value.trim() === '') return;

      result[key] = value;
    });

    return result;
  }

  function getInputByName(box, name) {
    var inputs = box.querySelectorAll('input[name]');
    var result = null;

    toArray(inputs).some(function (input) {
      if (input.name === name) {
        result = input;
        return true;
      }

      return false;
    });

    return result;
  }

  function logError(moduleName, message) {
    if (window.console && window.console.error) {
      window.console.error('[cp_tpl.' + moduleName + '] ' + message);
    }
  }

  cp.logo = function (config) {
    config = config || {};

    var selector = config.selector;
    var brand = config.brand;
    var color = config.color || config.theme || 'white';
    var mode = config.mode || 'auto';
    var src = config.src;

    if (!selector) {
      logError('logo', 'selector is required');
      return;
    }

    if (!src) {
      if (!cp.assets.logos[brand] || !cp.assets.logos[brand][color]) {
        logError('logo', 'unknown logo: ' + brand + ' / ' + color);
        return;
      }

      src = cp.assets.logos[brand][color];
    }

    function applyLogo() {
      document.querySelectorAll(selector).forEach(function (element) {
        var image = null;

        if (mode === 'background') {
          element.style.backgroundImage = 'url("' + src + '")';
          return;
        }

        if (element.tagName === 'IMG') {
          image = element;
        } else {
          image = element.querySelector('img');
        }

        if (image && mode !== 'background') {
          image.setAttribute('src', src);
          image.setAttribute('data-original', src);
          return;
        }

        element.style.backgroundImage = 'url("' + src + '")';
      });
    }

    onReady(applyLogo);
  };

  cp.hiddenFields = function (fields, config) {
    fields = fields || {};
    config = config || {};

    var formSelector = config.formSelector || 'form';
    var boxSelector = config.boxSelector || '.t-form__inputsbox';
    var observe = config.observe !== false;
    var observer = null;

    cp.hiddenFieldsState.values = Object.assign({}, cp.hiddenFieldsState.values, fields);

    if (config.utmMarksMap) {
      cp.hiddenFieldsState.utmMarksMap = Object.assign(
        {},
        cp.hiddenFieldsState.utmMarksMap,
        config.utmMarksMap
      );
    }

    function apply() {
      document.querySelectorAll(formSelector + ' ' + boxSelector).forEach(function (box) {
        Object.keys(fields).forEach(function (name) {
          var input = getInputByName(box, name);

          if (!input) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            box.appendChild(input);
          }

          input.value = fields[name];
        });
      });
    }

    onReady(function () {
      apply();

      if (!observe || !document.body) return;

      observer = new MutationObserver(apply);
      observer.observe(document.body, {
        subtree: true,
        childList: true
      });
    });

    return {
      apply: apply,
      destroy: function () {
        if (observer) observer.disconnect();
      }
    };
  };

  cp.hiddenFields.getValues = function () {
    return Object.assign({}, cp.hiddenFieldsState.values);
  };

  var t396Wrapped = false;
  var t396Original = null;
  var t396Handlers = {
    before: [],
    after: []
  };

  function ensureT396Wrapper() {
    if (t396Wrapped) return;

    t396Wrapped = true;
    t396Original = window.t396_onSuccess;

    window.t396_onSuccess = function (formObject) {
      var callbackArguments = arguments;
      var form = formObject && formObject[0] ? formObject[0] : formObject;

      var formSubmission = {
        form: form,
        formObject: formObject,
        callbackArguments: callbackArguments
      };

      t396Handlers.before.forEach(function (handler) {
        handler.call(this, formSubmission);
      }, this);

      if (typeof t396Original === 'function') {
        t396Original.apply(this, callbackArguments);
      }

      t396Handlers.after.forEach(function (handler) {
        handler.call(this, formSubmission);
      }, this);
    };
  }

  cp.t396Success = function (handler, config) {
    config = config || {};

    if (typeof handler !== 'function') {
      logError('t396Success', 'handler should be a function');
      return;
    }

    ensureT396Wrapper();

    var stage = config.stage === 'after' ? 'after' : 'before';
    t396Handlers[stage].push(handler);
  };

  cp.t396Redirect = function (url, config) {
    config = config || {};

    if (!url) {
      logError('t396Redirect', 'url is required');
      return;
    }

    cp.t396Success(function () {
      var target = url;

      if (config.appendSearch !== false) {
        target += window.location.search || '';
      }

      window.location.href = target;
    }, {
      stage: config.stage || 'after'
    });
  };

  function normalizeParam(param) {
    if (param && typeof param === 'object' && 'value' in param) {
      return {
        value: param.value,
        type: param.type === 'hard' ? 'hard' : 'soft'
      };
    }

    return {
      value: param,
      type: 'soft'
    };
  }

  function applyParams(searchParams, parameters) {
    parameters = parameters || {};

    Object.keys(parameters).forEach(function (key) {
      var normalized = normalizeParam(parameters[key]);
      var value = normalized.value;
      var type = normalized.type;

      if (!hasValue(value)) return;

      if (type === 'hard') {
        searchParams.set(key, value);
        return;
      }

      if (!searchParams.has(key)) {
        searchParams.set(key, value);
      }
    });
  }

  function getHiddenFieldsForUtmMarks() {
    var result = {};
    var fields = cp.hiddenFieldsState.values || {};
    var map = cp.hiddenFieldsState.utmMarksMap || {};

    Object.keys(fields).forEach(function (fieldName) {
      var paramName = map[fieldName];

      if (!paramName || !hasValue(fields[fieldName])) return;

      result[paramName] = fields[fieldName];
    });

    return result;
  }

  function updateURLParameters(parameters) {
    var url = new URL(window.location.href);

    applyParams(url.searchParams, parameters);

    window.history.replaceState(null, '', url.toString());
  }

  function buildUtmMarks(parameters, config) {
    config = config || {};

    var params = new URLSearchParams(window.location.search);
    var allParameters = {};

    Object.assign(
      allParameters,
      window.utmParameters || {},
      config.includeHiddenFields === false ? {} : getHiddenFieldsForUtmMarks(),
      parameters || {}
    );

    applyParams(params, allParameters);

    return params.toString();
  }

  cp.utm = function (config) {
    config = config || {};

    var parameters = config.parameters || config.utmParameters || {};
    var extraParams = config.extraParams || {};
    var mergedParams = {};

    Object.keys(parameters).forEach(function (key) {
      mergedParams[key] = parameters[key];
    });

    Object.keys(extraParams).forEach(function (key) {
      if (hasValue(extraParams[key])) {
        mergedParams[key] = extraParams[key];
      }
    });

    window.utmParameters = mergedParams;

    if (config.updateUrl !== false) {
      updateURLParameters(mergedParams);
    }

    if (config.exposeGlobals !== false) {
      window.buildUtmMarks = function (extra, buildConfig) {
        return buildUtmMarks(extra, buildConfig);
      };
    }

    return {
      parameters: mergedParams,
      buildUtmMarks: function (extra, buildConfig) {
        return buildUtmMarks(extra, buildConfig);
      }
    };
  };

  cp.utm.applyParams = applyParams;
  cp.utm.updateURLParameters = updateURLParameters;
  cp.utm.buildUtmMarks = buildUtmMarks;
  cp.utm.getHiddenFieldsForUtmMarks = getHiddenFieldsForUtmMarks;

  var marqueeItems = [];
  var marqueeResizeBound = false;
  var marqueeRafId = null;

  cp.marquee = function (config) {
    if (typeof config === 'string') {
      config = {
        selector: config
      };
    }

    config = config || {};

    var options = {
      selector: config.selector || '.marquee--infinite',
      speed: config.speed || 90,
      minWidthFactor: config.minWidthFactor || 1.5
    };

    marqueeItems.push(options);

    ensureStyle('cp_tpl_marquee_style', [
      '.marquee--infinite {',
      '  overflow: hidden;',
      '  width: 100%;',
      '}',
      '.marquee--infinite > div {',
      '  display: flex;',
      '  width: max-content;',
      '  will-change: transform;',
      '}',
      '.marquee--infinite > div > * {',
      '  flex: 0 0 auto;',
      '}',
      '.marquee--infinite.is-ready > div {',
      '  animation: marqueeInfinite var(--marquee-duration) linear infinite;',
      '}',
      '@keyframes marqueeInfinite {',
      '  from { transform: translateX(0); }',
      '  to { transform: translateX(calc(-1 * var(--marquee-distance))); }',
      '}'
    ].join('\n'));

    function initOne(wrapper) {
      var track = wrapper.querySelector(':scope > div');

      if (!track) return;

      wrapper.classList.remove('is-ready');

      var originalItems = toArray(track.children).filter(function (item) {
        return !item.dataset.clone;
      });

      if (!originalItems.length) return;

      track.innerHTML = '';

      originalItems.forEach(function (item) {
        track.appendChild(item);
      });

      while (track.scrollWidth < window.innerWidth * options.minWidthFactor) {
        originalItems.forEach(function (item) {
          var clone = item.cloneNode(true);
          clone.dataset.clone = 'true';
          track.appendChild(clone);
        });
      }

      var baseWidth = track.scrollWidth;

      toArray(track.children).forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.dataset.clone = 'true';
        track.appendChild(clone);
      });

      var duration = baseWidth / options.speed;

      wrapper.style.setProperty('--marquee-distance', baseWidth + 'px');
      wrapper.style.setProperty('--marquee-duration', duration + 's');

      wrapper.classList.add('is-ready');
    }

    function init() {
      document.querySelectorAll(options.selector).forEach(initOne);
    }

    onReady(init);
    window.addEventListener('load', init);

    if (!marqueeResizeBound) {
      marqueeResizeBound = true;

      window.addEventListener('resize', function () {
        cancelAnimationFrame(marqueeRafId);

        marqueeRafId = requestAnimationFrame(function () {
          marqueeItems.forEach(function (item) {
            document.querySelectorAll(item.selector).forEach(function (wrapper) {
              var track = wrapper.querySelector(':scope > div');
              if (!track) return;

              wrapper.classList.remove('is-ready');

              var originalItems = toArray(track.children).filter(function (child) {
                return !child.dataset.clone;
              });

              track.innerHTML = '';

              originalItems.forEach(function (child) {
                track.appendChild(child);
              });

              while (track.scrollWidth < window.innerWidth * item.minWidthFactor) {
                originalItems.forEach(function (child) {
                  var clone = child.cloneNode(true);
                  clone.dataset.clone = 'true';
                  track.appendChild(clone);
                });
              }

              var baseWidth = track.scrollWidth;

              toArray(track.children).forEach(function (child) {
                var clone = child.cloneNode(true);
                clone.dataset.clone = 'true';
                track.appendChild(clone);
              });

              wrapper.style.setProperty('--marquee-distance', baseWidth + 'px');
              wrapper.style.setProperty('--marquee-duration', baseWidth / item.speed + 's');
              wrapper.classList.add('is-ready');
            });
          });
        });
      });
    }
  };

  cp.media = function (config) {
    config = config || {};

    var containerSelector = config.containerSelector || '[class*="videos"]';
    var videoSelector = config.videoSelector || 'video';
    var pauseOthers = config.pauseOthers !== false;

    var iconPause = config.iconPause || 'https://static.tildacdn.com/tild3037-3633-4638-b235-663366366562/Group_2087330239_1.svg';
    var iconPlay = config.iconPlay || 'https://static.tildacdn.com/tild6564-3361-4862-a538-306563626333/Group_2087330239_2.svg';

    ensureStyle('cp_tpl_media_style', [
      '.tn-atom__video-play-icon circle {',
      '  fill: #0000007d !important;',
      '}',
      '.uc-audio-timer {',
      '  position: absolute;',
      '  top: 50%;',
      '  left: 50%;',
      '  transform: translate(-50%, -50%);',
      '  color: #fff;',
      '  font-size: 18px;',
      "  font-family: 'StratosSkyeng';",
      '  z-index: 2;',
      '  pointer-events: none;',
      '  width: 100%;',
      '  text-align: center;',
      '}',
      '.uc-audio-progress {',
      '  background: linear-gradient(180deg, rgba(255, 107, 191, 0.80) 0%, rgba(255, 158, 0, 0.80) 100%);',
      '  background-size: 0% 100%;',
      '  background-repeat: no-repeat;',
      '  transition: background-size 0.2s linear;',
      '}',
      '.bg_blur {',
      '  backdrop-filter: blur(2px);',
      '}',
      '.video-playpause {',
      '  position: absolute;',
      '  bottom: 12px;',
      '  left: 50%;',
      '  transform: translateX(-50%);',
      '  width: 56px;',
      '  height: 56px;',
      '  background: no-repeat center / contain;',
      '  opacity: 0;',
      '  transition: opacity 0.2s ease;',
      '  pointer-events: none;',
      '  z-index: 3;',
      '}',
      '.uc-has-video:hover .video-playpause {',
      '  opacity: 1;',
      '}'
    ].join('\n'));

    function formatTime(seconds) {
      if (isNaN(seconds)) return '00:00';

      var minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
      var restSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');

      return minutes + ':' + restSeconds;
    }

    function initVideo(video) {
      if (video.dataset.cpTplMediaInited) return;

      video.dataset.cpTplMediaInited = '1';

      var source = video.querySelector('source');
      var src = source ? source.getAttribute('src') || '' : video.getAttribute('src') || '';
      var isAudioLike = /\.m4a($|\?)/.test(src) || /\.mp3($|\?)/.test(src);

      var wrapper = video.parentElement;

      if (!wrapper) return;

      wrapper.style.position = 'relative';
      wrapper.classList.add('uc-has-video');

      if (isAudioLike) {
        video.classList.add('bg_blur');

        var timerElement = document.createElement('div');
        timerElement.className = 'uc-audio-timer';
        wrapper.appendChild(timerElement);

        video.classList.add('uc-audio-progress');

        video.addEventListener('timeupdate', function () {
          var percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;

          video.style.backgroundSize = percent + '% 100%';
          timerElement.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
        });
      }

      var iconElement = document.createElement('div');
      iconElement.className = 'video-playpause';
      wrapper.appendChild(iconElement);

      function updateIcon() {
        iconElement.style.backgroundImage = 'url(' + (video.paused ? iconPlay : iconPause) + ')';
      }

      updateIcon();

      video.addEventListener('play', function () {
        if (pauseOthers) {
          document.querySelectorAll(containerSelector + ' ' + videoSelector).forEach(function (otherVideo) {
            if (otherVideo !== video && !otherVideo.paused) {
              otherVideo.pause();
            }
          });
        }

        updateIcon();
      });

      video.addEventListener('pause', updateIcon);

      video.addEventListener('click', function () {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
    }

    function initContainer(container) {
      if (container.dataset.cpTplMediaContainerInited) return;

      container.dataset.cpTplMediaContainerInited = '1';

      container.querySelectorAll(videoSelector).forEach(initVideo);

      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeName === 'VIDEO') {
              initVideo(node);
            } else if (node.querySelectorAll) {
              node.querySelectorAll(videoSelector).forEach(initVideo);
            }
          });
        });
      });

      observer.observe(container, {
        childList: true,
        subtree: true
      });
    }

    onReady(function () {
      document.querySelectorAll(containerSelector).forEach(initContainer);
    });
  };

  cp.scrollIndicator = function (config) {
    config = config || {};

    ensureStyle('cp_tpl_scroll_indicator_style', [
      '.scroll-indicator {',
      '  display: flex;',
      '  justify-content: center;',
      '  gap: 8px;',
      '}',
      '.dot {',
      '  width: 8px;',
      '  height: 8px;',
      '  background-color: rgba(2, 33, 43, 0.3);',
      '  border-radius: 50%;',
      '  transition: background-color 0.3s;',
      '}',
      '.dot.active {',
      '  background-color: rgba(2, 33, 43, 1);',
      '}',
      '.cp-scroll-cards,',
      '.add_mob_scroll_indicator > div {',
      '  scrollbar-width: none;',
      '}'
    ].join('\n'));

    var items = Array.isArray(config.items) ? config.items : [config];

    function shouldStartInMiddle(rootElement, scrollElement, dotsContainer, itemConfig) {
      if (itemConfig.start === 'middle') return true;
      if (itemConfig.start === false || itemConfig.start === 'start') return false;

      var middleSelector = itemConfig.middleSelector || '.--scroll-mid, .is-scroll-mid, [data-scroll-start="middle"]';

      return Boolean(
        rootElement && rootElement.matches && rootElement.matches(middleSelector) ||
        scrollElement && scrollElement.matches && scrollElement.matches(middleSelector) ||
        dotsContainer && dotsContainer.matches && dotsContainer.matches(middleSelector)
      );
    }

    function initPair(rootElement, scrollElement, dots, itemConfig) {
      if (!scrollElement || !dots || !dots.length) return;

      var registryTarget = rootElement || scrollElement;

      if (registryTarget.dataset.cpTplScrollIndicatorInited) return;

      registryTarget.dataset.cpTplScrollIndicatorInited = '1';

      var dotsContainer = dots[0] ? dots[0].parentElement : null;

      function applyDefaultStyles() {
        if (itemConfig.applyStyles === false) return;

        if (itemConfig.hideScrollbar !== false) {
          scrollElement.style.scrollbarWidth = 'none';
          scrollElement.style.msOverflowStyle = 'none';
        }

        if (dotsContainer && itemConfig.styleDots !== false) {
          dotsContainer.style.display = itemConfig.dotsDisplay || 'flex';
          dotsContainer.style.justifyContent = itemConfig.dotsJustify || 'center';
          dotsContainer.style.gap = itemConfig.dotsGap || '8px';
        }
      }

      function updateDots() {
        var scrollLeft = scrollElement.scrollLeft;
        var maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;
        var sectionCount = dots.length;

        if (sectionCount <= 1 || maxScrollLeft <= 0) {
          dots.forEach(function (dot, index) {
            dot.classList.toggle('active', index === 0);
          });

          return;
        }

        var sectionWidth = maxScrollLeft / (sectionCount - 1);
        var activeIndex = Math.round(scrollLeft / sectionWidth);

        dots.forEach(function (dot, index) {
          dot.classList.toggle('active', index === activeIndex);
        });
      }

      function scrollToMiddle() {
        var maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;

        scrollElement.scrollLeft = maxScrollLeft / 2;
        updateDots();
      }

      applyDefaultStyles();
      scrollElement.addEventListener('scroll', updateDots);
      updateDots();

      if (shouldStartInMiddle(rootElement, scrollElement, dotsContainer, itemConfig)) {
        requestAnimationFrame(scrollToMiddle);
        setTimeout(scrollToMiddle, 300);
      }
    }

    function initByItem(itemConfig) {
      itemConfig = itemConfig || {};

      var rootSelector = itemConfig.rootSelector || itemConfig.blockSelector || '.uc-scroll-block';
      var scrollSelector = itemConfig.scrollSelector || itemConfig.cardsSelector || '.cp-scroll-cards, .add_mob_scroll_indicator > div';
      var dotsSelector = itemConfig.dotsSelector || '.scroll-indicator .dot';
      var directMode = itemConfig.direct === true || itemConfig.rootSelector === null || itemConfig.blockSelector === null;

      if (directMode) {
        initPair(
          null,
          document.querySelector(scrollSelector),
          document.querySelectorAll(dotsSelector),
          itemConfig
        );

        return;
      }

      document.querySelectorAll(rootSelector).forEach(function (rootElement) {
        initPair(
          rootElement,
          rootElement.querySelector(scrollSelector),
          rootElement.querySelectorAll(dotsSelector),
          itemConfig
        );
      });
    }

    function init() {
      items.forEach(initByItem);
    }

    onReady(init);
    window.addEventListener('load', init);
  };

  cp.spacer = function (config) {
    config = config || {};

    var allrecordsSelector = config.allrecordsSelector || '#allrecords';
    var className = config.className || config.class || 'empty_spacer';
    var spacerSelector = config.spacerSelector || '.' + className.split(/\s+/)[0];
    var bgColor = config.bgColor || config.backgroundColor || '';
    var safetyGap = typeof config.safetyGap === 'number' ? config.safetyGap : 0;
    var rafId = null;

    ensureStyle('cp_tpl_spacer_style', [
      '.empty_spacer {',
      '  height: 0;',
      '  transition: height 80ms ease-out;',
      '  will-change: height;',
      '}'
    ].join('\n'));

    function getElements() {
      var allrecords = document.querySelector(allrecordsSelector);
      if (!allrecords) return {};

      var spacer = allrecords.querySelector(spacerSelector);

      if (!spacer && config.create !== false) {
        spacer = document.createElement('div');
        spacer.className = className.indexOf('empty_spacer') === -1
          ? 'empty_spacer ' + className
          : className;

        allrecords.appendChild(spacer);
      }

      if (spacer && bgColor) {
        spacer.style.backgroundColor = bgColor;
      }

      return {
        allrecords: allrecords,
        spacer: spacer
      };
    }

    function fitSpacer() {
      var elements = getElements();
      var allrecords = elements.allrecords;
      var spacer = elements.spacer;

      if (!allrecords || !spacer) return;

      var viewportHeight = document.documentElement.clientHeight;
      var spacerHeight = spacer.getBoundingClientRect().height;
      var allrecordsHeight = allrecords.getBoundingClientRect().height;
      var contentWithoutSpacer = allrecordsHeight - spacerHeight;

      var nextHeight = viewportHeight - contentWithoutSpacer - safetyGap;
      nextHeight = Math.max(0, Math.floor(nextHeight));

      spacer.style.height = nextHeight + 'px';

      requestAnimationFrame(function () {
        var pageHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        );

        var overflow = pageHeight - viewportHeight;

        if (overflow > 0 && nextHeight > 0) {
          var correctedHeight = Math.max(0, nextHeight - Math.ceil(overflow) - 1);
          spacer.style.height = correctedHeight + 'px';
        }
      });
    }

    function scheduleFit() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(fitSpacer);
    }

    function fitNowAndAfterAnimation() {
      scheduleFit();
      setTimeout(scheduleFit, 80);
      setTimeout(scheduleFit, 250);
    }

    function init() {
      var elements = getElements();
      var allrecords = elements.allrecords;
      var spacer = elements.spacer;

      if (!allrecords || !spacer) return;

      var mutationObserver = new MutationObserver(function (mutations) {
        var onlySpacerChanged = mutations.every(function (mutation) {
          return mutation.target === spacer;
        });

        if (onlySpacerChanged) return;

        fitNowAndAfterAnimation();
      });

      mutationObserver.observe(allrecords, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'hidden', 'aria-hidden']
      });

      if ('ResizeObserver' in window) {
        var resizeObserver = new ResizeObserver(function () {
          scheduleFit();
        });

        toArray(allrecords.children).forEach(function (element) {
          if (element !== spacer) {
            resizeObserver.observe(element);
          }
        });
      }

      window.addEventListener('resize', fitNowAndAfterAnimation);
      window.addEventListener('orientationchange', fitNowAndAfterAnimation);
      window.addEventListener('load', fitNowAndAfterAnimation);
      window.addEventListener('tilda-content-changed', fitNowAndAfterAnimation);

      window.fitTildaSpacer = fitNowAndAfterAnimation;

      fitNowAndAfterAnimation();
    }

    onReady(init);

    return {
      fit: fitNowAndAfterAnimation
    };
  };

  cp.switchBlocks = function (config) {
    config = config || {};

    var blockSelector = config.blockSelector || '[class*="uc-vitrina"]';
    var triggerSelector = config.triggerSelector || '[class*="trigger"]:not([class*="mob_trigger"])';
    var mobileTriggerSelector = config.mobileTriggerSelector || '[class*="mob_trigger"]';

    var blockActiveClass = config.blockActiveClass || 'vitrina-active';
    var triggerActiveClass = config.triggerActiveClass || 'trigger-active';
    var initialIndex = config.initialIndex || 0;

    if (config.injectCss !== false) {
      ensureStyle('cp_tpl_switch_blocks_style', [
        blockSelector + ' {',
        '  display: none;',
        '}',
        triggerSelector + ',',
        mobileTriggerSelector + ' {',
        '  cursor: pointer;',
        '}',
        '.' + triggerActiveClass + ' > div {',
        '  background: linear-gradient(88.29deg, #A93EDC 3.43%, #00C1FF 99.63%);',
        '  -webkit-background-clip: text;',
        '  -webkit-text-fill-color: transparent;',
        '  background-clip: text;',
        '  color: transparent;',
        '}',
        '.' + triggerActiveClass + ' {',
        '  border-bottom: 2px solid transparent;',
        '  border-image: linear-gradient(88.29deg, #A93EDC 3.43%, #00C1FF 99.63%);',
        '  border-image-slice: 1;',
        '}',
        '.' + blockActiveClass + ' {',
        '  display: block;',
        '}'
      ].join('\n'));
    }

    var activateCurrent = null;

    function init() {
      var triggers = document.querySelectorAll(triggerSelector);
      var mobileTriggers = document.querySelectorAll(mobileTriggerSelector);
      var blocks = document.querySelectorAll(blockSelector);

      if (!blocks.length) return;

      function activate(index) {
        if (!blocks[index]) return;

        blocks.forEach(function (block) {
          block.classList.remove(blockActiveClass);
        });

        triggers.forEach(function (trigger) {
          trigger.classList.remove(triggerActiveClass);
        });

        mobileTriggers.forEach(function (trigger) {
          trigger.classList.remove(triggerActiveClass);
        });

        blocks[index].classList.add(blockActiveClass);

        if (triggers[index]) {
          triggers[index].classList.add(triggerActiveClass);
        }

        mobileTriggers.forEach(function (trigger, fallbackIndex) {
          var match = trigger.className.match(/mob_trigger(\d+)/);
          var triggerIndex = match ? parseInt(match[1], 10) - 1 : fallbackIndex;

          if (triggerIndex === index) {
            trigger.classList.add(triggerActiveClass);
          }
        });

        window.dispatchEvent(new CustomEvent('tilda-content-changed', {
          detail: {
            source: 'cp_tpl.switchBlocks',
            index: index
          }
        }));

        if (typeof config.onChange === 'function') {
          config.onChange(index, {
            block: blocks[index],
            trigger: triggers[index]
          });
        }
      }

      triggers.forEach(function (trigger, index) {
        if (trigger.dataset.cpTplSwitchInited) return;

        trigger.dataset.cpTplSwitchInited = '1';
        trigger.addEventListener('click', function () {
          activate(index);
        });
      });

      mobileTriggers.forEach(function (trigger, fallbackIndex) {
        if (trigger.dataset.cpTplSwitchInited) return;

        trigger.dataset.cpTplSwitchInited = '1';

        var match = trigger.className.match(/mob_trigger(\d+)/);
        var index = match ? parseInt(match[1], 10) - 1 : fallbackIndex;

        trigger.addEventListener('click', function () {
          activate(index);
        });
      });

      activateCurrent = activate;
      activate(initialIndex);
    }

    onReady(init);

    return {
      activate: function (index) {
        if (typeof activateCurrent === 'function') {
          activateCurrent(index);
        }
      }
    };
  };

  cp.copy = function (config) {
    config = config || {};

    var selector = config.selector || '.copy-promocode';
    var text = config.text || '';
    var alertId = config.alertId || 'promo-alert';
    var alertText = config.alertText || 'Скопировано в буфер';
    var hideDelay = config.hideDelay || 1000;

    ensureStyle('cp_tpl_copy_style', [
      '.promo-alert {',
      '  position: absolute;',
      '  background: #000;',
      '  color: #fff;',
      '  padding: 8px 14px;',
      '  border-radius: 6px;',
      '  opacity: 0;',
      '  transition: opacity 0.3s;',
      '  pointer-events: none;',
      '  font-size: 14px;',
      '  z-index: 100000000 !important;',
      '  width: max-content;',
      '  white-space: nowrap;',
      '}'
    ].join('\n'));

    function getAlert() {
      var alert = document.getElementById(alertId);

      if (!alert) {
        alert = document.createElement('div');
        alert.id = alertId;
        alert.className = 'promo-alert';
        alert.textContent = alertText;
        document.body.appendChild(alert);
      }

      return alert;
    }

    function getTextToCopy(element) {
      if (typeof text === 'function') {
        return text(element);
      }

      if (text) {
        return text;
      }

      return element.getAttribute('data-copy') || element.textContent.trim();
    }

    function fallbackCopy(value) {
      var textarea = document.createElement('textarea');

      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';

      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand('copy');
      } catch (error) {}

      document.body.removeChild(textarea);
    }

    function copyText(value) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(value).catch(function () {
          fallbackCopy(value);
        });
      }

      fallbackCopy(value);

      return Promise.resolve();
    }

    function showAlert(element) {
      var alert = getAlert();
      var rect = element.getBoundingClientRect();
      var alertHeight = alert.offsetHeight || 30;

      alert.textContent = alertText;
      alert.style.left = rect.left + rect.width / 2 + 'px';
      alert.style.top = window.scrollY + rect.top - alertHeight - 8 + 'px';
      alert.style.transform = 'translateX(-50%)';
      alert.style.opacity = '1';

      clearTimeout(alert.hideTimeout);

      alert.hideTimeout = setTimeout(function () {
        alert.style.opacity = '0';
      }, hideDelay);
    }

    function init() {
      document.querySelectorAll(selector).forEach(function (element) {
        if (element.dataset.cpTplCopyInited) return;

        element.dataset.cpTplCopyInited = '1';

        element.addEventListener('click', function () {
          var value = getTextToCopy(element);

          copyText(value).then(function () {
            showAlert(element);
          });
        });
      });
    }

    onReady(init);
  };

})(window, document);

(function (window, document) {
  'use strict';

  var cp = window.cp_tpl = window.cp_tpl || {};

  cp.viewport = function (config) {
    config = config || {};

    var min = config.min || 640;
    var max = config.max || 1200;
    var width = config.width || 1400;
    var useScreenWidth = config.useScreenWidth !== false;

    var currentWidth = useScreenWidth ? window.screen.width : window.innerWidth;

    if (currentWidth >= min && currentWidth < max) {
      var viewportMeta = document.querySelector('meta[name="viewport"]');

      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.setAttribute('name', 'viewport');
        document.head.appendChild(viewportMeta);
      }

      viewportMeta.setAttribute('content', 'width=' + width);
    }
  };

})(window, document);

(function (window, document) {
  'use strict';

  var cp = window.cp_tpl = window.cp_tpl || {};

  cp.loadScript = function (config) {
    if (typeof config === 'string') {
      config = { src: config };
    }

    config = config || {};

    var src = config.src;
    var id = config.id;
    var cacheBust = config.cacheBust || false;

    if (!src) return;

    if (id && document.getElementById(id)) {
      return;
    }

    var script = document.createElement('script');

    if (id) {
      script.id = id;
    }

    script.src = src + (cacheBust ? (src.indexOf('?') === -1 ? '?' : '&') + Date.now() : '');
    script.async = config.async !== false;

    document.head.appendChild(script);

    return script;
  };

  cp.widgets = function (config) {
    config = config || {};

    return cp.loadScript({
      id: config.id || 'cp_tpl_widgets_loader',
      src: config.src || 'https://widgets-host.skyeng.ru/loader.js',
      cacheBust: config.cacheBust !== false,
      async: config.async
    });
  };

})(window, document);

(function (window, document) {
  'use strict';

  var cp = window.cp_tpl = window.cp_tpl || {};
  cp.forms = cp.forms || {};

  cp.forms.selectAll = function (config) {
    config = config || {};

    var formSelector = config.formSelector || [
      'form.js-form-proccess',
      'form.t-form',
      'form[data-formactiontype]',
      'form'
    ].join(',');

    var inputsBoxSelector = config.inputsBoxSelector || '.t-form__inputsbox';
    var quietTime = typeof config.quietTime === 'number' ? config.quietTime : 0;
    var maxWait = config.maxWait || 15000;
    var globalName = config.globalName || 'selectedFormIds';
    var waitForStableDom = config.waitForStableDom === true;

    var observer = null;
    var quietTimer = null;
    var maxTimer = null;
    var isFinished = false;

    window[globalName] = Array.isArray(window[globalName]) ? window[globalName] : [];

    function getForms() {
      return Array.from(document.querySelectorAll(formSelector)).filter(function (form) {
        return form.querySelector(inputsBoxSelector);
      });
    }

    function generateUniqueFormId(index, usedIds) {
      var counter = index + 1;
      var newId = 'cp-auto-form-' + counter;

      while (document.getElementById(newId) || usedIds.has(newId)) {
        counter++;
        newId = 'cp-auto-form-' + counter;
      }

      return newId;
    }

    function syncSelectedFormIds() {
      var forms = getForms();
      var usedIds = new Set();

      window[globalName].length = 0;

      forms.forEach(function (form, index) {
        if (!form.id || usedIds.has(form.id)) {
          form.id = generateUniqueFormId(index, usedIds);
        }

        usedIds.add(form.id);
        window[globalName].push(form.id);
      });

      return window[globalName];
    }

    function finish(reason) {
      if (isFinished) return;

      var formIds = syncSelectedFormIds();

      if (!formIds.length && reason !== 'достигнут MAX_WAIT') {
        return;
      }

      isFinished = true;

      if (observer) observer.disconnect();
      clearTimeout(quietTimer);
      clearTimeout(maxTimer);

      if (!formIds.length) {
        console.warn('[cp_tpl.forms.selectAll] Формы не найдены.', reason);
        return;
      }

      console.log('[cp_tpl.forms.selectAll] Найдено форм:', formIds.length, reason);
      console.log('[cp_tpl.forms.selectAll] IDs:', formIds);

      if (typeof config.onReady === 'function') {
        config.onReady(formIds);
      }

      return formIds;
    }

    function scheduleFinish() {
      var forms = getForms();

      if (!forms.length) return;

      clearTimeout(quietTimer);

      if (!waitForStableDom && quietTime <= 0) {
        finish('формы найдены');
        return;
      }

      quietTimer = setTimeout(function () {
        finish('DOM стабилизировался');
      }, quietTime);
    }

    observer = new MutationObserver(scheduleFinish);

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    document.addEventListener('DOMContentLoaded', scheduleFinish);
    window.addEventListener('load', scheduleFinish);

    maxTimer = setTimeout(function () {
      finish('достигнут MAX_WAIT');
    }, maxWait);

    scheduleFinish();

    return {
      getFormIds: function () {
        return window[globalName];
      },
      finish: finish
    };
  };

})(window, document);

(function (window, document) {
  'use strict';

  var cp = window.cp_tpl = window.cp_tpl || {};
  cp.forms = cp.forms || {};

  function insertHiddenInput(form, inputName, inputValue) {
    if (!form) return;

    var inputsBoxElement = form.querySelector('.t-form__inputsbox');

    if (!inputsBoxElement) {
      console.error('[cp_tpl.forms.televox] Inputs box в форме не найден:', form.id);
      return;
    }

    var existingField = form.querySelector('input[name="' + inputName + '"]');

    if (existingField) {
      return existingField;
    }

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = inputName;
    hiddenField.tabIndex = '-1';
    hiddenField.value = inputValue == null ? '' : inputValue;

    inputsBoxElement.appendChild(hiddenField);

    return hiddenField;
  }

  function getTimezoneOffsetString() {
    var regexpResult = new Date().toString().match(/([-+][0-9]+)\s/);
    var untrimmedTimezone = regexpResult && regexpResult[0];

    return typeof untrimmedTimezone === 'string' ? untrimmedTimezone.trim() : '';
  }

  cp.forms.televox = function (config) {
    config = config || {};

    var importGroup = config.importGroup || '';
    var globalName = config.globalName || 'selectedFormIds';

    var fields = config.fields || [
      'subscription_attributes_utmMarks',
      'customer_attributes_offset',
      'subscription_attributes_location',
      'subscription_attributes_televoxIntegration',
      'subscription_attributes_televoxImportGroup'
    ];

    if (config.rules) {
      fields.push('subscription_attributes_rules');
    }

    function getFormsByIds(formIds) {
      return (formIds || [])
        .map(function (id) {
          return document.getElementById(id);
        })
        .filter(Boolean);
    }

    function updateFormData(form) {
      try {
        var offsetField = form.querySelector('input[name="customer_attributes_offset"]');
        if (offsetField) {
          offsetField.value = getTimezoneOffsetString();
        }

        var utmMarksField = form.querySelector('input[name="subscription_attributes_utmMarks"]');
        if (utmMarksField) {
          if (typeof window.buildUtmMarks === 'function') {
            utmMarksField.value = window.buildUtmMarks(config.extraParams || {});
          } else {
            utmMarksField.value = location.search.slice(1);
          }
        }

        var locationField = form.querySelector('input[name="subscription_attributes_location"]');
        if (locationField) {
          locationField.value = location.origin + location.pathname;
        }

        var importGroupField = form.querySelector('input[name="subscription_attributes_televoxImportGroup"]');
        if (importGroupField) {
          importGroupField.value = importGroup;
        }

        var integrationField = form.querySelector('input[name="subscription_attributes_televoxIntegration"]');
        if (integrationField) {
          integrationField.value = true;
        }

        var rulesField = form.querySelector('input[name="subscription_attributes_rules"]');
        if (rulesField && config.rules) {
          rulesField.value = Array.isArray(config.rules) ? config.rules.join(',') : config.rules;
        }
      } catch (error) {
        console.error('[cp_tpl.forms.televox] Error in updateFormData:', error);
      }
    }

    function initForForms(formIds) {
      var forms = getFormsByIds(formIds);

      forms.forEach(function (form) {
        if (form.dataset.cpTplTelevoxInited) return;

        form.dataset.cpTplTelevoxInited = '1';

        fields.forEach(function (fieldName) {
          insertHiddenInput(form, fieldName, '');
        });

        updateFormData(form);

        form.addEventListener('click', function () {
          updateFormData(form);
        }, true);

        form.addEventListener('submit', function () {
          updateFormData(form);
        }, true);

        form.addEventListener('change', function () {
          updateFormData(form);
        }, true);
      });
    }

    if (config.autoSelect === false) {
      initForForms(config.formIds || window[globalName] || []);
      return;
    }

    if (Array.isArray(window[globalName]) && window[globalName].length) {
      initForForms(window[globalName]);
      return;
    }

    cp.forms.selectAll({
      globalName: globalName,
      quietTime: typeof config.selectAllQuietTime === 'number' ? config.selectAllQuietTime : 0,
      waitForStableDom: config.waitForStableDom === true,
      onReady: initForForms
    });
  };

})(window, document);

(function (window, document) {
  'use strict';

  var cp = window.cp_tpl = window.cp_tpl || {};
  cp.b2b = cp.b2b || {};

  var b2bState = {
    hitId: '',
    hitPromise: null,
    timezone: ''
  };

  var zoneData = [
    { num: '-11', text: 'Pacific/Midway' },
    { num: '-10', text: 'Pacific/Honolulu' },
    { num: '-9', text: 'America/Anchorage' },
    { num: '-8', text: 'America/Los_Angeles' },
    { num: '-7', text: 'America/Phoenix' },
    { num: '-6', text: 'America/Costa_Rica' },
    { num: '-5', text: 'America/Jamaica' },
    { num: '-4', text: 'America/Puerto_Rico' },
    { num: '-3', text: 'America/Araguaina' },
    { num: '-2', text: 'Atlantic/South_Georgia' },
    { num: '-1', text: 'Atlantic/Cape_Verde' },
    { num: '0', text: 'America/Danmarkshavn' },
    { num: '1', text: 'Europe/Berlin' },
    { num: '2', text: 'Europe/Kaliningrad' },
    { num: '3', text: 'Europe/Moscow' },
    { num: '4', text: 'Europe/Volgograd' },
    { num: '5', text: 'Asia/Yekaterinburg' },
    { num: '6', text: 'Asia/Omsk' },
    { num: '7', text: 'Asia/Tomsk' },
    { num: '8', text: 'Asia/Irkutsk' },
    { num: '9', text: 'Asia/Yakutsk' },
    { num: '10', text: 'Asia/Vladivostok' },
    { num: '11', text: 'Asia/Magadan' },
    { num: '12', text: 'Asia/Kamchatka' },
    { num: '13', text: 'Pacific/Auckland' },
    { num: '14', text: 'Pacific/Apia' }
  ];

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function cleanObject(object) {
    var result = {};

    Object.keys(object || {}).forEach(function (key) {
      var value = object[key];

      if (value === undefined || value === null) return;
      if (typeof value === 'string' && value.trim() === '') return;

      result[key] = value;
    });

    return result;
  }

  function normalizePhone(phone) {
    return String(phone || '')
      .trim()
      .replace(/[^\d+]/g, '')
      .replace(/(?!^)\+/g, '');
  }

  function getFormFields(form) {
    var data = {};
    var formData = new FormData(form);

    formData.forEach(function (value, key) {
      if (value === undefined || value === null) return;
      if (typeof value === 'string' && value.trim() === '') return;

      if (data[key]) {
        data[key] = Array.isArray(data[key])
          ? data[key].concat(value)
          : [data[key], value];
      } else {
        data[key] = value;
      }
    });

    return data;
  }

  function getParamsFromUrl() {
    var data = {};
    var params = new URLSearchParams(window.location.search);

    params.forEach(function (value, key) {
      if (data[key]) {
        data[key] = Array.isArray(data[key])
          ? data[key].concat(value)
          : [data[key], value];
      } else {
        data[key] = value;
      }
    });

    return data;
  }

  function pushSuccessEvent(formId, serviceTypeKey, wasBump) {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: '_orders_form_sent_success',
      formId: formId || '',
      stk: serviceTypeKey || '',
      isBump: String(Boolean(wasBump))
    });
  }

  function closeTildaPopupsAndOpenThankyou() {
    document.body.classList.remove('t-body_success-popup-showed');
    document.body.classList.remove('t-body_scroll-locked');

    try {
      var closePopupLink = document.querySelector('a[href="#closeallpopup"]');
      var thankyouLink = document.querySelector('a[href="#thankyou"]');

      if (closePopupLink) closePopupLink.click();
      if (thankyouLink) thankyouLink.click();
    } catch (error) {}
  }

  function addT396SuccessHandler(handler, config) {
    config = config || {};

    if (typeof cp.t396Success === 'function') {
      cp.t396Success(handler, {
        stage: config.stage || 'before'
      });

      return;
    }

    var original = window.t396_onSuccess;

    window.t396_onSuccess = function (formObject) {
      handler.call(this, {
        form: formObject && formObject[0] ? formObject[0] : formObject,
        formObject: formObject,
        callbackArguments: arguments
      });

      if (typeof original === 'function') {
        original.apply(this, arguments);
      }
    };
  }

  function readHitOnce(globalName) {
    try {
      if (
        window.skyengTrackHits &&
        typeof window.skyengTrackHits.get_current_hit_id === 'function'
      ) {
        b2bState.hitId = window.skyengTrackHits.get_current_hit_id() || '';
        window[globalName] = b2bState.hitId;

        return b2bState.hitId;
      }
    } catch (error) {}

    return b2bState.hitId || window[globalName] || '';
  }

  cp.b2b.hit = function (config) {
    config = config || {};

    var delay = typeof config.delay === 'number' ? config.delay : 0;
    var retries = typeof config.retries === 'number' ? config.retries : 20;
    var retryDelay = typeof config.retryDelay === 'number' ? config.retryDelay : 250;
    var globalName = config.globalName || 'getHit';

    window[globalName] = window[globalName] || '';

    function readHit(attempt, resolve) {
      attempt = attempt || 0;

      var hitId = readHitOnce(globalName);

      if (hitId || attempt >= retries) {
        resolve(hitId || '');
        return;
      }

      setTimeout(function () {
        readHit(attempt + 1, resolve);
      }, retryDelay);
    }

    b2bState.hitPromise = new Promise(function (resolve) {
      onReady(function () {
        setTimeout(function () {
          readHit(0, resolve);
        }, delay);
      });
    });

    return {
      get: function () {
        return readHitOnce(globalName);
      },
      ready: b2bState.hitPromise,
      refresh: function () {
        b2bState.hitPromise = new Promise(function (resolve) {
          readHit(0, resolve);
        });

        return b2bState.hitPromise;
      }
    };
  };

  cp.b2b.zone = function (config) {
    config = config || {};

    var globalName = config.globalName || 'getZone';
    var offset = new Date().getTimezoneOffset() / -60;
    var matchedZone = '';

    zoneData.forEach(function (item) {
      if (Number(item.num) === Number(offset)) {
        matchedZone = item.text;
      }
    });

    b2bState.timezone = matchedZone;
    window[globalName] = matchedZone;

    return matchedZone;
  };

  cp.b2b.getMeta = function () {
    readHitOnce('getHit');

    return cleanObject({
      hitId: b2bState.hitId || window.getHit,
      timezone: b2bState.timezone || window.getZone
    });
  };

  cp.b2b.getMetaAsync = function () {
    var hitPromise = b2bState.hitPromise || cp.b2b.hit().ready;

    return hitPromise.then(function () {
      return cp.b2b.getMeta();
    });
  };

  cp.b2b.order = function (config) {
    config = config || {};

    var apiUrl = config.apiUrl || 'https://corp.skyeng.ru/landing/public/v2/order';

    var orderConfig = Object.assign({
      generateLoginLinkTo: 'https://student.skyeng.ru/',
      landing_param_key: 'utm_page'
    }, config.orderConfig || {});

    var childCourseValue = config.childCourseValue || 'Репетиторы для детей';
    var openThankyou = config.openThankyou !== false;
    var redirectToLoginLink = config.redirectToLoginLink !== false;

    function isChildForm(form, payload) {
      var childNameInput = form.querySelector('input[name="childName"]');
      var childNameValue = childNameInput ? childNameInput.value : payload.childName;

      if (childNameValue && String(childNameValue).trim() !== '') {
        return true;
      }

      return payload.courseType === childCourseValue;
    }

    function applyChildFormLogic(form, payload) {
      if (!isChildForm(form, payload)) {
        delete payload.childName;
        return payload;
      }

      var name = payload.name;
      var email = payload.email;
      var phone = payload.phone;

      delete payload.name;
      delete payload.email;
      delete payload.phone;

      return cleanObject(Object.assign({}, payload, {
        childName: payload.childName || 'Ребёнок',
        parentName: name,
        parentEmail: email,
        parentPhone: phone
      }));
    }

    function buildPayload(form, globalMeta) {
      var formFields = getFormFields(form);
      var urlParams = getParamsFromUrl();

      var payload = Object.assign(
        {},
        formFields,
        urlParams,
        orderConfig,
        globalMeta || cp.b2b.getMeta()
      );

      if (payload.phone) {
        payload.phone = normalizePhone(payload.phone);
      }

      payload = applyChildFormLogic(form, payload);

      if (typeof config.transformPayload === 'function') {
        payload = config.transformPayload(payload, {
          form: form,
          formFields: formFields,
          urlParams: urlParams
        }) || payload;
      }

      return cleanObject(payload);
    }

    function sendOrder(form) {
      return cp.b2b.getMetaAsync().then(function (globalMeta) {
        var payload = buildPayload(form, globalMeta);

        return fetch(apiUrl, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify(payload)
        })
          .then(function (response) {
            if (!response.ok) {
              throw response;
            }

            return response.json();
          })
          .then(function (data) {
            var responseData = data && data.data ? data.data : {};
            var wasBump = responseData.wasBump === true;

            if (openThankyou) {
              closeTildaPopupsAndOpenThankyou();
            }

            pushSuccessEvent(form.id, payload.serviceTypeKey, wasBump);

            if (typeof config.onSuccess === 'function') {
              config.onSuccess({
                data: data,
                responseData: responseData,
                payload: payload,
                form: form,
                wasBump: wasBump
              });
            }

            if (redirectToLoginLink && responseData.loginLink) {
              window.location.href = responseData.loginLink;
            }

            return data;
          })
          .catch(function (error) {
            console.error('[cp_tpl.b2b.order] custom form submit error', error);

            if (typeof config.onError === 'function') {
              config.onError(error, {
                form: form
              });
            }
          });
      });
    }

    cp.b2b.hit();
    cp.b2b.zone();

    addT396SuccessHandler(function (formSubmission) {
      var form = formSubmission.form;

      if (!form) return;

      sendOrder(form);
    }, {
      stage: 'before'
    });

    return {
      buildPayload: buildPayload,
      send: sendOrder
    };
  };

})(window, document);

(function (window) {
  'use strict';

  var cp = window.cp_tpl = window.cp_tpl || {};
  cp.cjm = cp.cjm || {};

  cp.cjm.products = [
    {
      brand: 'skysmart',
      label: 'Английский язык',
      selectValues: ['Английский', 'Английский язык', 'english'],
      id: 'kid_mini_course_kids_english_junior',
      selectedStk: 'mini_course_kids_english_junior'
    },
    {
      brand: 'skyeng',
      label: 'Английский язык',
      selectValues: ['Английский', 'Английский язык', 'english'],
      id: 'skyeng_adult_english_example',
      selectedStk: 'english_adult_example'
    },
    {
      brand: 'skysmart',
      label: 'Математика',
      selectValues: ['Математика', 'math'],
      id: 'kid_mini_course_kids_math',
      selectedStk: 'mini_course_kids_math'
    },
    {
      brand: 'skysmart',
      label: 'Домашний лицей 5-11 класс',
      selectValues: ['Домашний лицей 5-11 класс'],
      id: 'skysmart_homeschooling_8_grade8',
      productKitCode: 'skysmart_homeschooling_8_grade',
      kitTariffUuid: '639db64c-139f-4701-b41d-c6ab73614996'
    }
  ];

})(window);

(function (window, document) {
  'use strict';

  var cp = window.cp_tpl = window.cp_tpl || {};
  cp.cjm = cp.cjm || {};
  cp.cjm.products = cp.cjm.products || [];
  cp.cjm.pageProducts = cp.cjm.pageProducts || [];

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function waitForEasyPaymentFlow(callback, attempt) {
    attempt = attempt || 0;

    if (
      window.easyPaymentFlow &&
      typeof window.easyPaymentFlow.onReady === 'function'
    ) {
      window.easyPaymentFlow.onReady(callback);
      return;
    }

    if (attempt < 80) {
      setTimeout(function () {
        waitForEasyPaymentFlow(callback, attempt + 1);
      }, 250);
      return;
    }

    console.error('[cp_tpl.cjm] window.easyPaymentFlow не найден.');
  }

  function normalizeValue(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  function hasValue(value) {
    return value != null && value !== '';
  }

  function getHiddenFieldsValues() {
    if (cp.hiddenFields && typeof cp.hiddenFields.getValues === 'function') {
      return cp.hiddenFields.getValues();
    }

    return {};
  }

  function getCjmComment(options) {
    options = options || {};

    if (hasValue(options.comment)) {
      return options.comment;
    }

    if (options.extraParams && hasValue(options.extraParams.comment)) {
      return options.extraParams.comment;
    }

    var hiddenFields = getHiddenFieldsValues();

    if (hasValue(hiddenFields.comment)) {
      return hiddenFields.comment;
    }

    return '';
  }

  function warnDuplicateProductIds(products, sourceName, config) {
    products = products || [];
    config = config || {};

    var groups = {};

    getAllProducts(products).forEach(function (product, index) {
      if (!product || !product.id) return;

      groups[product.id] = groups[product.id] || [];
      groups[product.id].push({
        product: product,
        index: index
      });
    });

    Object.keys(groups).forEach(function (id) {
      if (groups[id].length <= 1) return;

      var message = '[cp_tpl.cjm] Дублируется product id "' + id + '". Первый продукт с этим id будет иметь приоритет, остальные могут быть проигнорированы.';

      console.error(message, {
        source: sourceName || 'products',
        duplicates: groups[id]
      });

      if (config.alertOnDuplicateIds === true && window.alert) {
        window.alert(message);
      }
    });
  }

  function getClosestDataAttr(element, attrName) {
    var current = element;

    while (current && current !== document) {
      if (current.getAttribute && current.getAttribute(attrName)) {
        return current.getAttribute(attrName);
      }

      current = current.parentNode;
    }

    return '';
  }

  function getAllProducts(customProducts) {
    return []
      .concat(customProducts || [])
      .concat(cp.cjm.pageProducts || [])
      .concat(cp.cjm.products || []);
  }

  function productToEasyPaymentConfig(product) {
    var result = {
      id: product.id,
      label: product.label
    };

    if (product.selectedStk) {
      result.selectedStk = product.selectedStk;
    }

    if (product.productKitCode) {
      result.productKitCode = product.productKitCode;
    }

    if (product.kitTariffUuid) {
      result.kitTariffUuid = product.kitTariffUuid;
    }

    return result;
  }

  function getProductConfigurations(customProducts) {
    var usedIds = {};
    var result = [];

    getAllProducts(customProducts).forEach(function (product) {
      if (!product.id || usedIds[product.id]) return;

      usedIds[product.id] = true;
      result.push(productToEasyPaymentConfig(product));
    });

    return result;
  }

  function getSelectContext(select) {
    var selectedOption = select.options[select.selectedIndex];

    return {
      brand:
        select.getAttribute('data-cp-brand') ||
        getClosestDataAttr(select, 'data-cp-brand'),

      mode:
        select.getAttribute('data-cp-mode') ||
        getClosestDataAttr(select, 'data-cp-mode'),

      productId:
        selectedOption && selectedOption.getAttribute('data-cp-product-id') ||
        select.getAttribute('data-cp-product-id') ||
        getClosestDataAttr(select, 'data-cp-product-id'),

      selectedValue: select.value,

      selectedLabel: selectedOption
        ? selectedOption.textContent.trim()
        : select.value
    };
  }

  function getElementContext(element) {
    return {
      brand:
        element.getAttribute('data-cp-brand') ||
        getClosestDataAttr(element, 'data-cp-brand'),

      productId:
        element.getAttribute('data-cp-product-id') ||
        getClosestDataAttr(element, 'data-cp-product-id'),

      selectedValue:
        element.getAttribute('data-cp-value') ||
        element.getAttribute('data-cp-product-value') ||
        getClosestDataAttr(element, 'data-cp-value') ||
        '',

      selectedLabel:
        element.getAttribute('data-cp-label') ||
        element.textContent && element.textContent.trim() ||
        ''
    };
  }

  function matchByProductId(context, customProducts) {
    if (!context.productId) return null;

    return getAllProducts(customProducts).find(function (product) {
      return product.id === context.productId;
    }) || null;
  }

  function matchByBrandAndValue(context, customProducts) {
    var brand = context.brand;
    var selectedValue = normalizeValue(context.selectedValue);
    var selectedLabel = normalizeValue(context.selectedLabel);
    var products = getAllProducts(customProducts);

    if (!selectedValue && !selectedLabel) return null;

    var candidates = products.filter(function (product) {
      if (brand && product.brand !== brand) {
        return false;
      }

      var values = product.selectValues || [product.label];

      return values.some(function (value) {
        var normalized = normalizeValue(value);

        return normalized === selectedValue || normalized === selectedLabel;
      });
    });

    if (candidates.length) {
      return candidates[0];
    }

    return null;
  }

  function resolveProductByContext(context, customProducts) {
    return matchByProductId(context, customProducts) || matchByBrandAndValue(context, customProducts);
  }

  function resolveProduct(select, customProducts) {
    return resolveProductByContext(getSelectContext(select), customProducts);
  }

  function getOrCreateHiddenInput(form, name) {
    var input = form.querySelector('input[name="' + name + '"]');

    if (input) return input;

    input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.tabIndex = -1;

    var inputsBox = form.querySelector('.t-form__inputsbox') || form;
    inputsBox.appendChild(input);

    return input;
  }

  function setVal(element, value) {
    if (element) {
      element.value = value == null ? '' : value;
    }
  }

  function fillAnonymousForm(select, product, config) {
    var form = select.closest('form');

    if (!form || !product) return;

    var createHiddenFields = config.createHiddenFields !== false;

    var serviceTypeKey = createHiddenFields
      ? getOrCreateHiddenInput(form, 'serviceTypeKey')
      : form.querySelector('input[name="serviceTypeKey"]');

    var productKitCode = createHiddenFields
      ? getOrCreateHiddenInput(form, 'productKitCode')
      : form.querySelector('input[name="productKitCode"]');

    var tariffUuid = createHiddenFields
      ? getOrCreateHiddenInput(form, 'tariffUuid')
      : form.querySelector('input[name="tariffUuid"]');

    setVal(serviceTypeKey, product.selectedStk);
    setVal(productKitCode, product.productKitCode);
    setVal(tariffUuid, product.kitTariffUuid);

    if (typeof config.onFillForm === 'function') {
      config.onFillForm(form, product, select);
    }
  }

  function getUtmMarks(extraParams) {
    if (typeof window.buildUtmMarks === 'function') {
      return window.buildUtmMarks(extraParams || {});
    }

    return location.search.slice(1);
  }

  function initConsultationButton(options) {
    options = options || {};

    if (!options.product || !options.selector) return;

    window.easyPaymentFlow.initConsultationButton({
      selector: options.selector,
      analyticsData: options.analyticsData || {
        blockName: options.blockName || options.selector
      },
      productConfigId: options.product.id,
      utmMarks: getUtmMarks(options.extraParams),
      comment: getCjmComment(options)
    });
  }

  function initAuthButton(select, product, config) {
    if (!product) return;

    var name = select.name;
    var selector = config.getAuthButtonSelector
      ? config.getAuthButtonSelector(select, product)
      : '.' + name + '-btn';

    initConsultationButton({
      selector: selector,
      product: product,
      blockName: name,
      extraParams: config.extraParams,
      comment: config.comment
    });
  }

  function getSelectMode(select, context, config) {
    var name = select.name || '';
    var rawMode = normalizeValue(context.mode);

    if (rawMode === 'auth' || rawMode === 'authorized') return 'auth';
    if (rawMode === 'anonymous' || rawMode === 'unauth') return 'anonymous';

    if (name.indexOf(config.authPrefix) === 0) return 'auth';
    if (name.indexOf(config.anonymousPrefix) === 0) return 'anonymous';

    if (context.brand || context.productId) return 'anonymous';

    return '';
  }

  function shouldHandleSelect(select, context, config) {
    if (!select || select.tagName !== 'SELECT') return false;

    if (config.selectSelector && select.matches(config.selectSelector)) {
      return true;
    }

    return Boolean(getSelectMode(select, context, config));
  }

  function handleSelectChange(event, config) {
    var select = event.target;
    var context = getSelectContext(select);

    if (!shouldHandleSelect(select, context, config)) return;

    var product = resolveProduct(select, config.products);

    if (!product) {
      console.warn('[cp_tpl.cjm] Продукт не найден для select:', select);
      return;
    }

    var mode = getSelectMode(select, context, config);

    if (mode === 'anonymous') {
      fillAnonymousForm(select, product, config);
    }

    if (mode === 'auth') {
      initAuthButton(select, product, config);
    }
  }

  function normalizeButtonConfig(buttonConfig) {
    if (typeof buttonConfig === 'string') {
      return {
        selector: buttonConfig
      };
    }

    return buttonConfig || {};
  }

  function initConfiguredButton(buttonConfig, config) {
    buttonConfig = normalizeButtonConfig(buttonConfig);

    var element = document.querySelector(buttonConfig.selector);

    var context = {
      brand: buttonConfig.brand,
      productId: buttonConfig.productId,
      selectedValue: buttonConfig.value || buttonConfig.selectedValue,
      selectedLabel: buttonConfig.label || buttonConfig.selectedLabel
    };

    if (element) {
      context = Object.assign(getElementContext(element), cleanContext(context));
    }

    var product = buttonConfig.product || resolveProductByContext(context, config.products);

    if (!product) {
      console.warn('[cp_tpl.cjm] Продукт не найден для кнопки:', buttonConfig);
      return;
    }

    initConsultationButton({
      selector: buttonConfig.selector,
      product: product,
      analyticsData: buttonConfig.analyticsData,
      blockName: buttonConfig.blockName,
      extraParams: buttonConfig.extraParams || config.extraParams,
      comment: buttonConfig.comment || config.comment
    });
  }

  function cleanContext(context) {
    var result = {};

    Object.keys(context || {}).forEach(function (key) {
      if (hasValue(context[key])) result[key] = context[key];
    });

    return result;
  }

  function initDataButtons(config) {
    var selector = config.buttonSelector || '[data-cp-cjm-button], [data-cp-product-id][data-cp-button], [data-cp-product-id].cp-cjm-button';

    document.querySelectorAll(selector).forEach(function (element) {
      var context = getElementContext(element);
      var product = resolveProductByContext(context, config.products);

      if (!product) {
        console.warn('[cp_tpl.cjm] Продукт не найден для data-кнопки:', element);
        return;
      }

      var uniqueClass = element.getAttribute('data-cp-cjm-generated-class');

      if (!uniqueClass) {
        uniqueClass = 'cp-cjm-button-' + Math.random().toString(36).slice(2);
        element.classList.add(uniqueClass);
        element.setAttribute('data-cp-cjm-generated-class', uniqueClass);
      }

      initConsultationButton({
        selector: '.' + uniqueClass,
        product: product,
        blockName: element.getAttribute('data-cp-block-name') || uniqueClass,
        extraParams: config.extraParams,
        comment: element.getAttribute('data-cp-comment') || config.comment
      });
    });
  }

  cp.cjm.addProducts = function (products, config) {
    products = Array.isArray(products) ? products : [];
    config = config || {};

    warnDuplicateProductIds(products, 'cjm.addProducts', config);

    cp.cjm.pageProducts = cp.cjm.pageProducts.concat(products);
  };

  cp.cjm.validateProducts = function (products, config) {
    warnDuplicateProductIds(products || [], 'cjm.validateProducts', config || {});
  };

  cp.cjm.initButton = function (buttonConfig) {
    waitForEasyPaymentFlow(function () {
      initConfiguredButton(buttonConfig, {
        products: buttonConfig && buttonConfig.products,
        extraParams: buttonConfig && buttonConfig.extraParams,
        comment: buttonConfig && buttonConfig.comment
      });
    });
  };

  cp.cjm.init = function (config) {
    config = config || {};

    config.authPrefix = config.authPrefix || 'auth';
    config.anonymousPrefix = config.anonymousPrefix || 'unauth';

    if (Array.isArray(config.products)) {
      warnDuplicateProductIds(config.products, 'cjm.init products', config);
    }

    waitForEasyPaymentFlow(function () {
      window.easyPaymentFlow.initProductConfigurations(getProductConfigurations(config.products));

      if (!cp.cjm._changeHandlerBound) {
        cp.cjm._changeHandlerBound = true;

        document.addEventListener('change', function (event) {
          handleSelectChange(event, config);
        });
      }

      if (config.initCurrentValues !== false) {
        onReady(function () {
          document.querySelectorAll(config.scanSelector || 'select').forEach(function (select) {
            handleSelectChange({ target: select }, config);
          });
        });
      }

      if (Array.isArray(config.buttons)) {
        config.buttons.forEach(function (buttonConfig) {
          initConfiguredButton(buttonConfig, config);
        });
      }

      if (config.scanButtons !== false) {
        onReady(function () {
          initDataButtons(config);
        });
      }
    });
  };

  cp.cjm.resolveProduct = resolveProduct;
  cp.cjm.getProductConfigurations = getProductConfigurations;

})(window, document);

// Zone JS для t1093
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
