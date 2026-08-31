---
layout: default
title: Core helpers
nav_order: 3
search_keywords: >-
  gtm google tag manager analytics dataLayer tag manager zoom scale масштаб zero block
  logo логотип brand skyeng skysmart b2b skypro t396 t396_onSuccess success submit redirect
  редирект после формы viewport meta tablet планшет load script загрузить скрипт widgets widgets-host
---
# Core helpers

Базовые методы `window.cp_tpl`, не привязанные к конкретному модулю форм или CJM.

## `window.cp_tpl.gtm(config)` {#gtm}

Подключает Google Tag Manager один раз на страницу. Повторный вызов с тем же `id` и `dataLayer` не создаёт второй `<script>`.

### Стандартный вызов

```js
window.cp_tpl.gtm('skyeng');
```

Поддерживаемые алиасы: `skyeng` → `GTM-W9V46F`, `skysmart` → `GTM-MBGZXZJ`, `b2b` → `GTM-W5SMTKB`.

### Полный вызов

```js
window.cp_tpl.gtm({
  id: 'GTM-XXXXXXX',
  brand: 'skyeng',
  dataLayer: 'customDataLayer'
});
```

Если одновременно переданы `id` и `brand`, используется `id`. Строковый вызов тоже поддерживается: `window.cp_tpl.gtm('GTM-XXXXXXX')`.

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `config` | string/object | — | Строка трактуется как alias бренда или готовый GTM ID. Объект позволяет отдельно задать `id`, `brand` и `dataLayer`. |
| `config.id` | string | — | Явный GTM ID. Имеет приоритет над `brand`. Нужен для нестандартного контейнера. |
| `config.brand` | string | — | Алиас `skyeng`, `skysmart` или `b2b`. Удобен, чтобы не хранить GTM ID на лендинге. |
| `config.dataLayer` | string | `dataLayer` | Имя глобального массива data layer. Меняй только если контейнер настроен на другое имя. |

### Результат

Функция ничего не возвращает. Она создаёт `window[dataLayer]`, пушит событие `gtm.js` и вставляет GTM-скрипт перед первым `<script>` на странице.

## `window.cp_tpl.zoom(config)` {#zoom}

Добавляет адаптивный CSS `zoom` для выбранных элементов и обновляет CSS-переменные при `resize`. Полезно для Zero Block, который должен масштабироваться относительно базовой ширины макета.

### Стандартный вызов

```js
window.cp_tpl.zoom('.uc-hero');
```

### Полный вызов

```js
window.cp_tpl.zoom({
  selector: '.uc-hero',
  breakpoint: 640,
  desktopBase: 1200,
  mobileBase: 376,
  desktopVar: '--hero-desktop-zoom',
  mobileVar: '--hero-mobile-zoom',
  mode: 'both',
  only: 'both',
  devices: ['desktop', 'mobile']
});
```

`only` — alias для `mode`. Если `devices` содержит ровно один элемент, он переопределяет `mode/only`; если элементов несколько, режим становится `both`.

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `config` | string/object | — | Строка — сокращение для `{ selector: '...' }`. |
| `selector` | string | — | CSS-селектор масштабируемых элементов. Обязателен. |
| `breakpoint` | number | `640` | Граница между desktop и mobile-режимом в px. |
| `desktopBase` | number | `1200` | Ширина макета, при которой desktop zoom равен `1`. |
| `mobileBase` | number | `376` | Ширина макета, при которой mobile zoom равен `1`. |
| `desktopVar` | string | `--z<desktopBase>` | Имя CSS-переменной, куда пишется desktop zoom. Нужна, если переменную хочется переиспользовать в своём CSS. |
| `mobileVar` | string | `--z<mobileBase>` | Имя CSS-переменной для mobile zoom. |
| `mode` | string | `both` | `desktop`, `mobile` или `both`. Алиасы `desk` и `mob` тоже поддерживаются. |
| `only` | string | — | Alias для `mode`. Используй либо `mode`, либо `only`, чтобы конфиг был понятнее. |
| `devices` | string[] | — | Альтернативный способ задать режим. Один элемент → этот режим, несколько → `both`. |

Функция защищена от повторной инициализации одинакового набора параметров.

## `window.cp_tpl.logo(config)` {#logo}

Ставит логотип в `<img>` или как `background-image`. Может использовать встроенный каталог `window.cp_tpl.assets.logos` либо прямой URL.

### Стандартный вызов

```js
window.cp_tpl.logo({
  selector: '.logo',
  brand: 'skyeng',
  color: 'white'
});
```

### Полный вызов

```js
window.cp_tpl.logo({
  selector: '.logo',
  brand: 'skyeng',
  color: 'white',
  theme: 'white',
  mode: 'auto',
  src: 'https://example.com/custom-logo.svg'
});
```

Если передан `src`, он имеет приоритет над `brand`, `color` и `theme`. `theme` — alias для `color`.

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `selector` | string | — | Элемент или контейнер логотипа. Обязателен. |
| `brand` | string | — | Ключ бренда из `cp_tpl.assets.logos`, например `skyeng`, `skysmart`, `b2b`, `skypro`. |
| `color` | string | `white` | Вариант логотипа из каталога, обычно `white` или `black`. |
| `theme` | string | — | Alias для `color`. |
| `mode` | string | `auto` | `auto` пытается заменить `src` у `<img>`; `background` всегда ставит `background-image`. |
| `src` | string | — | Прямая ссылка на картинку. Нужна для кастомного логотипа или варианта вне встроенного каталога. |

В `auto`-режиме, если выбранный элемент не `<img>` и внутри него нет `<img>`, функция автоматически переключается на `background-image`.

## `window.cp_tpl.t396Success(handler, config)` {#t396-success}

Добавляет обработчик к глобальному `window.t396_onSuccess`, сохраняя исходный обработчик Tilda. Подходит для логики, которая должна выполняться непосредственно до или после стандартного success-callback Zero Block формы.

### Стандартный вызов

```js
window.cp_tpl.t396Success(function (submission) {
  console.log(submission.form);
});
```

### Полный вызов

```js
window.cp_tpl.t396Success(function (submission) {
  console.log(submission.form);
  console.log(submission.formObject);
  console.log(submission.callbackArguments);
}, {
  stage: 'after'
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `handler` | function | — | Обязательный callback. Получает объект `submission`. |
| `config.stage` | string | `before` | `before` запускает callback до исходного `t396_onSuccess`, `after` — после него. Любое значение кроме `after` считается `before`. |

`submission` содержит `form` (DOM-форма), `formObject` (аргумент Tilda как есть) и `callbackArguments` (`arguments` исходного вызова).

## `window.cp_tpl.t396Redirect(url, config)` {#t396-redirect}

Готовый shortcut для редиректа после успешной отправки T396-формы.

### Стандартный вызов

```js
window.cp_tpl.t396Redirect('https://example.com/final');
```

По умолчанию редирект происходит на stage `after` и к URL добавляется текущий `location.search`.

### Полный вызов

```js
window.cp_tpl.t396Redirect('https://example.com/final', {
  appendSearch: false,
  stage: 'before'
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `url` | string | — | Обязательный URL назначения. |
| `config.appendSearch` | boolean | `true` | Если `true`, дописывает текущую query-строку страницы. Нужен для сохранения UTM. |
| `config.stage` | string | `after` | Передаётся в `t396Success`: `before` или `after`. |

## `window.cp_tpl.viewport(config)` {#viewport}

Меняет `<meta name="viewport">` только внутри заданного диапазона ширины устройства. Используется для планшетных макетов, которые должны рендериться как фиксированная desktop-ширина.

### Стандартный вызов

```js
window.cp_tpl.viewport();
```

### Полный вызов

```js
window.cp_tpl.viewport({
  min: 640,
  max: 1200,
  width: 1400,
  useScreenWidth: true
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `min` | number | `640` | Нижняя граница включительно. |
| `max` | number | `1200` | Верхняя граница не включается. |
| `width` | number | `1400` | Записывается как `content="width=<width>"`. |
| `useScreenWidth` | boolean | `true` | `true` использует `window.screen.width`, `false` — `window.innerWidth`. |

Если meta viewport отсутствует, функция создаст его.

## `window.cp_tpl.loadScript(config)` {#load-script}

Динамически добавляет `<script>` в `<head>`.

### Стандартный вызов

```js
window.cp_tpl.loadScript('https://example.com/script.js');
```

### Полный вызов

```js
var script = window.cp_tpl.loadScript({
  id: 'my-script',
  src: 'https://example.com/script.js',
  cacheBust: true,
  async: false
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `config` | string/object | — | Строка — сокращение для `{ src: '...' }`. |
| `src` | string | — | URL скрипта. Без него функция ничего не делает. |
| `id` | string | — | ID создаваемого `<script>`. Если элемент с таким ID уже есть, повторная загрузка отменяется. |
| `cacheBust` | boolean | `false` | Добавляет `Date.now()` в query string, чтобы обходить браузерный/CDN cache. |
| `async` | boolean | `true` | Управляет `script.async`. Передай `false`, если порядок выполнения критичен. |

### Возвращает

Созданный `HTMLScriptElement` или `undefined`, если `src` не задан либо `id` уже существует.

## `window.cp_tpl.widgets(config)` {#widgets}

Shortcut над `loadScript` для loader-а `widgets-host.skyeng.ru`.

### Стандартный вызов

```js
window.cp_tpl.widgets();
```

### Полный вызов

```js
window.cp_tpl.widgets({
  id: 'cp_tpl_widgets_loader',
  src: 'https://widgets-host.skyeng.ru/loader.js',
  cacheBust: true,
  async: true
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `id` | string | `cp_tpl_widgets_loader` | Защищает loader от повторной вставки. |
| `src` | string | `https://widgets-host.skyeng.ru/loader.js` | URL loader-а. Можно заменить для тестового окружения. |
| `cacheBust` | boolean | `true` | По умолчанию loader загружается с timestamp. Передай `false`, чтобы разрешить cache. |
| `async` | boolean | `true` через `loadScript` | Передаётся в `loadScript`. |

Возвращает то же, что `window.cp_tpl.loadScript(config)`.
