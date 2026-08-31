---
layout: default
title: UI-хелперы
nav_order: 8
search_keywords: >-
  ui marquee бегущая строка ticker reverse media video audio play pause mp3 m4a progress timer
  scroll indicator dots cards horizontal scroll middle spacer viewport height empty spacer switch blocks tabs витрина
  copy clipboard промокод скопировать alert notification
---
# UI-хелперы

Небольшие DOM/UI-модули для типовых сценариев Tilda и Zero Block.

## `window.cp_tpl.marquee(config)` {#marquee}

Создаёт бесконечную бегущую строку, клонируя элементы до достаточной ширины и перестраивая её при изменении viewport.

### Стандартный вызов

```js
window.cp_tpl.marquee('.marquee--infinite');
```

### Полный вызов

```js
window.cp_tpl.marquee({
  selector: '.marquee--infinite',
  speed: 90,
  minWidthFactor: 1.5,
  reverse: false
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `config` | string/object | — | Строка — shortcut для `{ selector: '...' }`. |
| `selector` | string | `.marquee--infinite` | Wrapper бегущей строки. |
| `speed` | number | `90` | Скорость движения в px/sec. |
| `minWidthFactor` | number | `1.5` | До какой доли viewport клонировать контент перед запуском. Больше значение уменьшает шанс пустого края. |
| `reverse` | boolean | `false` | Разворачивает направление marquee через класс `cp-tpl-marquee--reverse`. |

Ожидаемая структура:

```html
<div class="marquee--infinite">
  <div>
    <div>Item 1</div>
    <div>Item 2</div>
  </div>
</div>
```

Функция ничего не возвращает и защищает один и тот же wrapper от повторной инициализации.

## `window.cp_tpl.media(config)` {#media}

Инициализирует video/audio-like элементы: toggle play/pause по клику, overlay icon, pause других видео и прогресс/таймер для `.mp3`/`.m4a`.

### Стандартный вызов

```js
window.cp_tpl.media();
```

### Полный вызов

```js
window.cp_tpl.media({
  containerSelector: '[class*="videos"]',
  videoSelector: 'video',
  pauseOthers: true,
  iconPause: 'https://example.com/pause.svg',
  iconPlay: 'https://example.com/play.svg'
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `containerSelector` | string | `[class*="videos"]` | Контейнеры, внутри которых искать media. Для динамических дочерних элементов на каждый контейнер ставится observer. |
| `videoSelector` | string | `video` | Какие элементы инициализировать внутри контейнера. |
| `pauseOthers` | boolean | `true` | При `play` ставить на pause другие совпавшие media на странице. |
| `iconPause` | string | встроенный Tilda CDN URL | Картинка overlay, когда media играет. |
| `iconPlay` | string | встроенный Tilda CDN URL | Картинка overlay, когда media на pause. |

Для source URL, оканчивающегося на `.m4a` или `.mp3` (включая query string), добавляются классы прогресса и текст `currentTime / duration`.

## `window.cp_tpl.scrollIndicator(config)` {#scroll-indicator}

Связывает горизонтальный scroll container с набором dots и отмечает активную точку по `scrollLeft`.

### Стандартный вызов

```js
window.cp_tpl.scrollIndicator();
```

По умолчанию ищется структура:

```txt
.uc-scroll-block
  .cp-scroll-cards .tn-molecule
  .scroll-indicator .dot
```

### Полный вызов одного item

```js
window.cp_tpl.scrollIndicator({
  rootSelector: '.uc-scroll-block',
  blockSelector: '.uc-scroll-block',
  scrollSelector: '.cp-scroll-cards .tn-molecule',
  cardsSelector: '.cp-scroll-cards .tn-molecule',
  dotsSelector: '.scroll-indicator .dot',
  direct: false,
  start: 'middle',
  middleSelector: '.--scroll-mid, .is-scroll-mid, [data-scroll-start="middle"]',
  applyStyles: true,
  hideScrollbar: true,
  styleDots: true,
  dotsDisplay: 'flex',
  dotsJustify: 'center',
  dotsGap: '8px'
});
```

`blockSelector` — alias для `rootSelector`, `cardsSelector` — alias для `scrollSelector`. В реальном вызове достаточно одного имени из каждой пары.

### Полный вызов нескольких независимых item

```js
window.cp_tpl.scrollIndicator({
  items: [
    {
      direct: true,
      rootSelector: null,
      blockSelector: null,
      scrollSelector: '.cards-1',
      cardsSelector: '.cards-1',
      dotsSelector: '.dots-1 .dot',
      start: 'middle',
      middleSelector: '[data-scroll-start="middle"]',
      applyStyles: true,
      hideScrollbar: true,
      styleDots: true,
      dotsDisplay: 'flex',
      dotsJustify: 'center',
      dotsGap: '8px'
    }
  ]
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `items` | array | `[config]` | Позволяет одним вызовом настроить несколько scroll/dots пар. |
| `rootSelector` | string/null | `.uc-scroll-block` | Root, внутри которого локально ищутся scroll и dots. `null` включает direct mode. |
| `blockSelector` | string/null | — | Alias для `rootSelector`. |
| `scrollSelector` | string | `.cp-scroll-cards .tn-molecule, .add_mob_scroll_indicator .tn-molecule` | Горизонтально скроллящийся элемент. |
| `cardsSelector` | string | — | Alias для `scrollSelector`. |
| `dotsSelector` | string | `.scroll-indicator .dot` | Селектор точек. |
| `direct` | boolean | `false` | Если `true`, scroll и dots ищутся глобально через `document`, без root. |
| `start` | string/boolean | auto | `'middle'` стартует с середины; `'start'`/`false` — с начала; без значения используется `middleSelector`. |
| `middleSelector` | string | три стандартных селектора | Авто-детектор middle start на root/scroll/dots container. |
| `applyStyles` | boolean | `true` | Включить inline-стили scroll/dots. |
| `hideScrollbar` | boolean | `true` | При `applyStyles` скрывает scrollbar через CSS properties. |
| `styleDots` | boolean | `true` | При `applyStyles` стилизует parent dots. |
| `dotsDisplay` | string | `flex` | `display` dots container. |
| `dotsJustify` | string | `center` | `justify-content` dots container. |
| `dotsGap` | string | `8px` | `gap` между dots. |

Функция ничего не возвращает. Один root/scroll инициализируется только один раз.

## `window.cp_tpl.spacer(config)` {#spacer}

Создаёт/подгоняет spacer в конце `#allrecords`, чтобы контент заполнял viewport по высоте без лишнего overflow.

### Стандартный вызов

```js
var spacer = window.cp_tpl.spacer();
```

### Полный вызов

```js
var spacer = window.cp_tpl.spacer({
  allrecordsSelector: '#allrecords',
  className: 'empty_spacer custom-spacer',
  class: 'empty_spacer custom-spacer',
  spacerSelector: '.empty_spacer',
  bgColor: '#0d1117',
  backgroundColor: '#0d1117',
  safetyGap: 2,
  create: true
});
```

`class` — alias для `className`, `backgroundColor` — alias для `bgColor`.

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `allrecordsSelector` | string | `#allrecords` | Контейнер страницы Tilda. |
| `className` | string | `empty_spacer` | Классы создаваемого spacer. |
| `class` | string | — | Alias для `className`. |
| `spacerSelector` | string | `.<первый className>` | Как найти уже существующий spacer. |
| `bgColor` | string | `''` | Background spacer. |
| `backgroundColor` | string | — | Alias для `bgColor`. |
| `safetyGap` | number | `0` | Дополнительный зазор, вычитаемый из высоты spacer. |
| `create` | boolean | `true` | Если `false`, функция не создаёт spacer и работает только с уже существующим. |

### Возвращаемый метод `spacer.fit()` {#spacer-fit}

Стандартный и полный вызов одинаковы — аргументов нет:

```js
spacer.fit();
```

Метод планирует пересчёт spacer сразу и повторно после коротких animation delays.

## `window.fitTildaSpacer()` {#fit-tilda-spacer}

Глобальный alias создаётся после успешной инициализации `window.cp_tpl.spacer()`. Нужен, если другой скрипт страницы должен вручную инициировать повторный расчёт высоты.

### Стандартный вызов

```js
window.fitTildaSpacer();
```

### Полный вызов

```js
window.fitTildaSpacer();
```

Аргументов нет. Функция существует только после того, как `spacer()` нашёл/создал spacer и завершил init. Модуль также автоматически пересчитывается на `resize`, `orientationchange`, `load` и custom event `tilda-content-changed`.

## `window.cp_tpl.switchBlocks(config)` {#switch-blocks}

Переключает набор контентных блоков по desktop/mobile triggers. Подходит для табов/витрин, где индекс trigger соответствует индексу блока.

### Стандартный вызов

```js
var switcher = window.cp_tpl.switchBlocks({
  initialIndex: 0
});
```

### Полный вызов

```js
var switcher = window.cp_tpl.switchBlocks({
  blockSelector: '[class*="uc-vitrina"]',
  triggerSelector: '[class*="trigger"]:not([class*="mob_trigger"])',
  mobileTriggerSelector: '[class*="mob_trigger"]',
  blockActiveClass: 'vitrina-active',
  triggerActiveClass: 'trigger-active',
  initialIndex: 0,
  injectCss: true,
  onChange: function (index, context) {
    console.log(index, context.block, context.trigger);
  }
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `blockSelector` | string | `[class*="uc-vitrina"]` | Переключаемые content blocks. |
| `triggerSelector` | string | desktop trigger selector | Основные triggers по индексу. |
| `mobileTriggerSelector` | string | `[class*="mob_trigger"]` | Mobile triggers. Если класс содержит `mob_triggerN`, используется индекс `N - 1`. |
| `blockActiveClass` | string | `vitrina-active` | Класс активного блока. |
| `triggerActiveClass` | string | `trigger-active` | Класс активного trigger. |
| `initialIndex` | number | `0` | Какой блок активировать после init. |
| `injectCss` | boolean | `true` | Добавляет базовый CSS скрытия блоков и оформления active trigger. |
| `onChange` | function | — | Callback `(index, { block, trigger })` после переключения. |

### `switcher.activate(index)` {#switcher-activate}

Программно переключает блок, если DOM-init уже завершён.

Стандартный вызов:

```js
switcher.activate(1);
```

Полный вызов:

```js
switcher.activate(2);
```

| Аргумент | Тип | Что делает |
|---|---|---|
| `index` | number | Zero-based индекс блока. Если такого блока нет, функция ничего не меняет. |

При каждом успешном переключении диспатчится `tilda-content-changed` с `{ source: 'cp_tpl.switchBlocks', index }`.

## `window.cp_tpl.copy(config)` {#copy}

Копирует текст в clipboard по клику и показывает временный alert над элементом.

### Стандартный вызов

```js
window.cp_tpl.copy({
  selector: '.copy-promocode'
});
```

Если `text` не задан, значение берётся из `data-copy`, затем из `element.textContent.trim()`.

### Полный вызов

```js
window.cp_tpl.copy({
  selector: '.copy-promocode',
  text: function (element) {
    return element.getAttribute('data-code') || 'PROMO2026';
  },
  alertId: 'promo-alert',
  alertText: 'Скопировано в буфер',
  hideDelay: 1000
});
```

`text` также может быть обычной строкой.

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `selector` | string | `.copy-promocode` | Элементы, на которые вешается click handler. |
| `text` | string/function | `''` | Явный текст или callback `(element) => string`. При пустом значении используется `data-copy`/textContent. |
| `alertId` | string | `promo-alert` | ID общего alert element; если его нет, библиотека создаёт `<div>`. |
| `alertText` | string | `Скопировано в буфер` | Текст уведомления. |
| `hideDelay` | number | `1000` | Через сколько ms скрыть alert. |

Сначала используется `navigator.clipboard.writeText`; при ошибке или отсутствии API — fallback через hidden `<textarea>` и `document.execCommand('copy')`.
