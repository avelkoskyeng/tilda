---
layout: default
title: Core helpers
nav_order: 3
---
# Core helpers

В этой главе описаны базовые методы, которые не привязаны к конкретной форме или CJM.

## `window.cp_tpl.gtm(config)`

Подключает Google Tag Manager один раз на страницу. Повторный вызов с тем же `id` и `dataLayer` не создаст второй скрипт.

### Вызов строкой

```js
window.cp_tpl.gtm('skyeng');
window.cp_tpl.gtm('skysmart');
window.cp_tpl.gtm('b2b');
```

Поддерживаемые алиасы:

| Алиас | GTM ID |
|---|---|
| `skyeng` | `GTM-W9V46F` |
| `skysmart` | `GTM-MBGZXZJ` |
| `b2b` | `GTM-W5SMTKB` |

Можно передать сразу ID:

```js
window.cp_tpl.gtm('GTM-XXXXXXX');
```

### Вызов объектом

```js
window.cp_tpl.gtm({
  brand: 'skyeng',
  dataLayer: 'dataLayer'
});
```

```js
window.cp_tpl.gtm({
  id: 'GTM-XXXXXXX',
  dataLayer: 'customDataLayer'
});
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `id` | string | — | GTM ID. Обязателен, если не указан `brand`. |
| `brand` | string | — | Алиас бренда: `skyeng`, `skysmart`, `b2b`. |
| `dataLayer` | string | `dataLayer` | Имя dataLayer. |

## `window.cp_tpl.zoom(config)`

Добавляет адаптивный CSS `zoom` для элементов. Метод полезен для Zero Block, где нужно масштабировать сложный блок относительно базовой ширины.

### Простой вызов

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
  mode: 'both'
});
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `selector` | string | — | CSS-селектор. Обязателен. |
| `breakpoint` | number | `640` | Граница между desktop и mobile. |
| `desktopBase` | number | `1200` | Базовая ширина для desktop. |
| `mobileBase` | number | `376` | Базовая ширина для mobile. |
| `desktopVar` | string | `--z<desktopBase>` | CSS-переменная desktop zoom. |
| `mobileVar` | string | `--z<mobileBase>` | CSS-переменная mobile zoom. |
| `mode` | string | `both` | `both`, `mobile`, `desktop`. |
| `only` | string | — | Алиас для `mode`. |
| `devices` | string[] | — | Если массив из одного элемента, используется как `mode`. |

### Алиасы режима

```js
window.cp_tpl.zoom({ selector: '.uc-card', mode: 'mobile' });
window.cp_tpl.zoom({ selector: '.uc-card', only: 'desktop' });
window.cp_tpl.zoom({ selector: '.uc-card', mode: 'mob' });  // mobile
window.cp_tpl.zoom({ selector: '.uc-card', mode: 'desk' }); // desktop
```

## `window.cp_tpl.logo(config)`

Меняет логотип в `img` или ставит его как `background-image`.

```js
window.cp_tpl.logo({
  selector: '.logo',
  brand: 'skyeng',
  color: 'white'
});
```

```js
window.cp_tpl.logo({
  selector: '.logo',
  src: 'https://example.com/logo.svg',
  mode: 'background'
});
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `selector` | string | — | CSS-селектор элемента. Обязателен. |
| `brand` | string | — | `skyeng`, `skysmart`, `b2b`, `skypro`. |
| `color` | string | `white` | `white` или `black`. |
| `theme` | string | — | Алиас для `color`. |
| `mode` | string | `auto` | `auto` или `background`. |
| `src` | string | — | Прямая ссылка на логотип. Имеет приоритет над `brand/color`. |

## `window.cp_tpl.viewport(config)`

Меняет meta viewport для планшетных ширин.

```js
window.cp_tpl.viewport({
  min: 640,
  max: 1200,
  width: 1400
});
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `min` | number | `640` | Минимальная ширина устройства. |
| `max` | number | `1200` | Максимальная ширина устройства. |
| `width` | number | `1400` | Значение для `content="width=..."`. |
| `useScreenWidth` | boolean | `true` | Использовать `window.screen.width`; если `false`, используется `window.innerWidth`. |

## `window.cp_tpl.loadScript(config)`

Динамически добавляет `<script>` на страницу.

```js
window.cp_tpl.loadScript('https://example.com/script.js');
```

```js
window.cp_tpl.loadScript({
  id: 'my-script',
  src: 'https://example.com/script.js',
  cacheBust: true,
  async: true
});
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `src` | string | — | URL скрипта. Обязателен. |
| `id` | string | — | Если скрипт с таким `id` уже есть, повторно не добавляется. |
| `cacheBust` | boolean | `false` | Добавить `Date.now()` в query string. |
| `async` | boolean | `true` | Значение атрибута `async`; чтобы выключить, передай `false`. |

Возвращает созданный `<script>` или `undefined`.

## `window.cp_tpl.widgets(config)`

Обёртка над `loadScript` для загрузки widgets-host.

```js
window.cp_tpl.widgets();
```

```js
window.cp_tpl.widgets({
  src: 'https://widgets-host.skyeng.ru/loader.js',
  cacheBust: true,
  async: true
});
```

### Параметры

| Параметр | Тип | По умолчанию |
|---|---:|---|
| `id` | string | `cp_tpl_widgets_loader` |
| `src` | string | `https://widgets-host.skyeng.ru/loader.js` |
| `cacheBust` | boolean | `true` |
| `async` | boolean | как в `loadScript` |
