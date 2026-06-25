---
title: UI-хелперы
---

# UI-хелперы

## `window.cp_tpl.gtm(config)`

```js
window.cp_tpl.gtm('skyeng');
window.cp_tpl.gtm('skysmart');
window.cp_tpl.gtm('b2b');
```

Или явно:

```js
window.cp_tpl.gtm({
  id: 'GTM-XXXXXXX',
  dataLayer: 'dataLayer'
});
```

## `window.cp_tpl.zoom(config)`

```js
window.cp_tpl.zoom({
  selector: '.my-block',
  mode: 'mobile',
  breakpoint: 640,
  mobileBase: 376
});
```

### Конфиг

| Параметр | Что делает |
|---|---|
| `selector` | Что масштабировать |
| `breakpoint` | Граница mobile/desktop |
| `desktopBase` | База desktop |
| `mobileBase` | База mobile |
| `mode` | `both`, `mobile`, `desktop` |

## `window.cp_tpl.logo(config)`

```js
window.cp_tpl.logo({
  selector: '.logo',
  brand: 'skyeng',
  color: 'white'
});
```

## `window.cp_tpl.scrollIndicator(config)`

```js
window.cp_tpl.scrollIndicator({
  items: [
    {
      direct: true,
      scrollSelector: '.cards-1 > div',
      dotsSelector: '.dots-1 .dot',
      start: 'middle'
    },
    {
      direct: true,
      scrollSelector: '.cards-2 > div',
      dotsSelector: '.dots-2 .dot',
      start: 'start'
    }
  ]
});
```

Кастомные селекторы получают базовые стили автоматически. Если нужно отключить:

```js
window.cp_tpl.scrollIndicator({
  direct: true,
  scrollSelector: '.cards-1 > div',
  dotsSelector: '.dots-1 .dot',
  applyStyles: false
});
```

## `window.cp_tpl.spacer(config)`

Создаёт/подгоняет пустой spacer, чтобы страница занимала высоту viewport.

```js
window.cp_tpl.spacer({
  className: 'empty_spacer',
  bgColor: '#ffffff'
});
```

## `window.cp_tpl.marquee(config)`

```js
window.cp_tpl.marquee({
  selector: '.marquee--infinite',
  speed: 90
});
```

## `window.cp_tpl.media(config)`

```js
window.cp_tpl.media({
  containerSelector: '[class*="videos"]',
  videoSelector: 'video'
});
```

## `window.cp_tpl.copy(config)`

```js
window.cp_tpl.copy({
  selector: '.copy-promocode',
  text: 'PROMO2026',
  alertText: 'Скопировано'
});
```

## `window.cp_tpl.viewport(config)`

```js
window.cp_tpl.viewport({
  min: 640,
  max: 1200,
  width: 1400
});
```

## `window.cp_tpl.loadScript(config)`

```js
window.cp_tpl.loadScript({
  id: 'my-script',
  src: 'https://example.com/script.js',
  cacheBust: true
});
```

## `window.cp_tpl.widgets(config)`

```js
window.cp_tpl.widgets();
```

По умолчанию подключает:

```txt
https://widgets-host.skyeng.ru/loader.js
```
