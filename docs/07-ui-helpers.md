# UI-хелперы

## `window.cp_tpl.marquee(config)`

Создаёт бесконечную бегущую строку.

```js
window.cp_tpl.marquee('.marquee--infinite');
```

```js
window.cp_tpl.marquee({
  selector: '.marquee--infinite',
  speed: 90,
  minWidthFactor: 1.5
});
```

### Ожидаемая структура

```html
<div class="marquee--infinite">
  <div>
    <div>Item 1</div>
    <div>Item 2</div>
  </div>
</div>
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `selector` | string | `.marquee--infinite` | Селектор wrapper. |
| `speed` | number | `90` | Скорость в px/sec. |
| `minWidthFactor` | number | `1.5` | До какой ширины клонировать элементы перед запуском. |

## `window.cp_tpl.media(config)`

Инициализирует video/audio-like элементы: play/pause по клику, иконка состояния, pause other videos, прогресс для `.m4a`/`.mp3`.

```js
window.cp_tpl.media();
```

```js
window.cp_tpl.media({
  containerSelector: '.videos',
  videoSelector: 'video',
  pauseOthers: true
});
```

### Параметры

| Параметр | Тип | По умолчанию |
|---|---:|---|
| `containerSelector` | string | `[class*="videos"]` |
| `videoSelector` | string | `video` |
| `pauseOthers` | boolean | `true` |
| `iconPause` | string | URL дефолтной иконки pause |
| `iconPlay` | string | URL дефолтной иконки play |

## `window.cp_tpl.scrollIndicator(config)`

Связывает горизонтальный scroll-контейнер с точками-индикаторами.

### Стандартный режим

```js
window.cp_tpl.scrollIndicator();
```

Ожидает структуру с root-блоком:

```txt
.uc-scroll-block
  .cp-scroll-cards
  .scroll-indicator .dot
```

### Direct mode

```js
window.cp_tpl.scrollIndicator({
  direct: true,
  scrollSelector: '.cards-1 > div',
  dotsSelector: '.dots-1 .dot',
  start: 'middle'
});
```

### Несколько независимых блоков

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

### Параметры item

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `items` | array | — | Список конфигов. |
| `rootSelector` | string | `.uc-scroll-block` | Root-блок. |
| `blockSelector` | string | — | Алиас для `rootSelector`. |
| `scrollSelector` | string | `.cp-scroll-cards, .add_mob_scroll_indicator > div` | Scroll-контейнер. |
| `cardsSelector` | string | — | Алиас для `scrollSelector`. |
| `dotsSelector` | string | `.scroll-indicator .dot` | Точки. |
| `direct` | boolean | `false` | Искать scroll/dots глобально, без root. |
| `start` | string/boolean | auto | `middle`, `start`, `false`. |
| `middleSelector` | string | `.--scroll-mid, .is-scroll-mid, [data-scroll-start="middle"]` | Авто-детектор старта с середины. |
| `applyStyles` | boolean | `true` | Проставлять базовые inline-стили. |
| `hideScrollbar` | boolean | `true` | Скрывать scrollbar. |
| `styleDots` | boolean | `true` | Стилизовать контейнер dots. |
| `dotsDisplay` | string | `flex` | `display` для dots container. |
| `dotsJustify` | string | `center` | `justify-content`. |
| `dotsGap` | string | `8px` | `gap`. |

## `window.cp_tpl.spacer(config)`

Создаёт/подгоняет пустой spacer в конце `#allrecords`, чтобы страница занимала высоту viewport без лишнего скролла.

```js
window.cp_tpl.spacer();
```

```js
window.cp_tpl.spacer({
  className: 'empty_spacer custom-spacer',
  bgColor: '#0d1117',
  safetyGap: 2
});
```

### Параметры

| Параметр | Тип | По умолчанию |
|---|---:|---|
| `allrecordsSelector` | string | `#allrecords` |
| `className` | string | `empty_spacer` |
| `class` | string | алиас для `className` |
| `spacerSelector` | string | первый класс из `className` |
| `bgColor` | string | `''` |
| `backgroundColor` | string | алиас для `bgColor` |
| `safetyGap` | number | `0` |
| `create` | boolean | `true` |

### Возвращает

```js
var spacer = window.cp_tpl.spacer();
spacer.fit();
```

Также создаёт глобальную функцию:

```js
window.fitTildaSpacer();
```

## `window.cp_tpl.switchBlocks(config)`

Переключает набор блоков по триггерам.

```js
var switcher = window.cp_tpl.switchBlocks({
  blockSelector: '[class*="uc-vitrina"]',
  triggerSelector: '[class*="trigger"]:not([class*="mob_trigger"])',
  mobileTriggerSelector: '[class*="mob_trigger"]',
  initialIndex: 0
});

switcher.activate(1);
```

### Параметры

| Параметр | Тип | По умолчанию |
|---|---:|---|
| `blockSelector` | string | `[class*="uc-vitrina"]` |
| `triggerSelector` | string | `[class*="trigger"]:not([class*="mob_trigger"])` |
| `mobileTriggerSelector` | string | `[class*="mob_trigger"]` |
| `blockActiveClass` | string | `vitrina-active` |
| `triggerActiveClass` | string | `trigger-active` |
| `initialIndex` | number | `0` |
| `injectCss` | boolean | `true` |
| `onChange` | function | — |

### onChange

```js
window.cp_tpl.switchBlocks({
  onChange: function (index, data) {
    console.log(index, data.block, data.trigger);
  }
});
```

## `window.cp_tpl.copy(config)`

Копирует текст в буфер и показывает небольшой alert.

```js
window.cp_tpl.copy({
  selector: '.copy-promocode',
  text: 'SALE2026'
});
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `selector` | string | `.copy-promocode` | Что кликаем. |
| `text` | string/function | `''` | Что копировать. Если пусто, берётся `data-copy` или textContent. |
| `alertId` | string | `promo-alert` | ID alert-элемента. |
| `alertText` | string | `Скопировано в буфер` | Текст alert. |
| `hideDelay` | number | `1000` | Через сколько скрыть alert. |

### text как функция

```js
window.cp_tpl.copy({
  selector: '.copy-btn',
  text: function (element) {
    return element.getAttribute('data-promocode');
  }
});
```
