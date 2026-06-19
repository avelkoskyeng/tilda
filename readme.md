# README: `cp_tpl`

`cp_tpl` — общая JS-библиотека для Tilda-лендингов. Она хранит переиспользуемые методы для GTM, zoom, логотипов, hidden-полей, UTM, медиа, форм, B2B и CJM.

На странице подключается общий файл библиотеки, а затем вызываются только нужные методы.

```html
<script src="https://.../cp_tpl.js"></script>
```

Пример типового вызова на лендинге:

```html
<script>
  window.cp_tpl.gtm('skyeng');

  window.cp_tpl.hiddenFields({
    promoCode: 'FRIDAY',
    marketing_experiments: 'cashbackoftheday',
    comment: 'кешбекдня'
  });

  window.cp_tpl.utm({
    parameters: {
      product: {
        value: 'type-skyeng_action|name-cashbackoftheday',
        type: 'hard'
      }
    }
  });
</script>
```

---

# Общие правила

## Что важно

1. Все методы лежат в глобальном объекте:

```js
window.cp_tpl
```

2. Методы ничего не запускают сами, кроме служебных блоков в конце файла. На странице нужно явно вызвать нужные функции.

3. Большинство методов принимает объект-конфиг:

```js
window.cp_tpl.methodName({
  option: 'value'
});
```

4. Если метод поддерживает короткую строковую запись, это отдельно указано в README.

## Что не стоит делать

Не нужно вручную менять внутренние переменные библиотеки:

```js
window.cp_tpl.hiddenFieldsState
window.cp_tpl.cjm.pageProducts
```

Лучше использовать публичные методы:

```js
window.cp_tpl.hiddenFields(...)
window.cp_tpl.cjm.addProducts(...)
```

Не стоит несколько раз подключать один и тот же файл библиотеки на страницу.

---

# `window.cp_tpl.gtm(config)`

Подключает GTM-контейнер.

## Быстрый вызов

```js
window.cp_tpl.gtm('skyeng');
```

Доступные короткие значения:

```js
window.cp_tpl.gtm('skyeng');
window.cp_tpl.gtm('skysmart');
window.cp_tpl.gtm('b2b');
```

Можно передать GTM ID напрямую:

```js
window.cp_tpl.gtm('GTM-XXXXXXX');
```

## Полный конфиг

```js
window.cp_tpl.gtm({
  brand: 'skyeng',
  dataLayer: 'dataLayer'
});
```

Или:

```js
window.cp_tpl.gtm({
  id: 'GTM-XXXXXXX',
  dataLayer: 'dataLayer'
});
```

## Что можно передать

| Поле        |    Тип | Обязательное | Описание                                     |
| ----------- | -----: | -----------: | -------------------------------------------- |
| `brand`     | string |          нет | Один из брендов: `skyeng`, `skysmart`, `b2b` |
| `id`        | string |          нет | Прямой GTM ID                                |
| `dataLayer` | string |          нет | Имя dataLayer. По умолчанию `dataLayer`      |

## Что нельзя / не стоит

Нельзя вызывать без бренда или ID:

```js
window.cp_tpl.gtm({});
```

Если передать неизвестный бренд и не передать `id`, контейнер не подключится.

---

# `window.cp_tpl.zoom(config)`

Добавляет адаптивный CSS `zoom` для элемента.

## Быстрый вызов

```js
window.cp_tpl.zoom('.hero');
```

Это равно:

```js
window.cp_tpl.zoom({
  selector: '.hero',
  desktopBase: 1200,
  mobileBase: 376,
  breakpoint: 640,
  mode: 'both'
});
```

## Только мобилка

```js
window.cp_tpl.zoom({
  selector: '.hero',
  mode: 'mobile',
  mobileBase: 376,
  breakpoint: 640
});
```

Сработает только до `639px`.

## Только десктоп

```js
window.cp_tpl.zoom({
  selector: '.hero',
  mode: 'desktop',
  desktopBase: 1200,
  breakpoint: 640
});
```

Сработает с `640px` и выше.

## Полный конфиг

```js
window.cp_tpl.zoom({
  selector: '.hero',
  breakpoint: 640,
  desktopBase: 1200,
  mobileBase: 376,
  desktopVar: '--z1200',
  mobileVar: '--z376',
  mode: 'both'
});
```

## Что можно передать

| Поле          |    Тип | Обязательное | По умолчанию | Описание                                                        |
| ------------- | -----: | -----------: | -----------: | --------------------------------------------------------------- |
| `selector`    | string |           да |            — | CSS-селектор элемента                                           |
| `breakpoint`  | number |          нет |        `640` | Граница между mobile и desktop                                  |
| `desktopBase` | number |          нет |       `1200` | База для desktop-zoom                                           |
| `mobileBase`  | number |          нет |        `376` | База для mobile-zoom                                            |
| `desktopVar`  | string |          нет |    `--z1200` | CSS-переменная для desktop                                      |
| `mobileVar`   | string |          нет |     `--z376` | CSS-переменная для mobile                                       |
| `mode`        | string |          нет |       `both` | `both`, `mobile`, `desktop`                                     |
| `only`        | string |          нет |            — | Альтернатива `mode`                                             |
| `devices`     |  array |          нет |            — | Если один элемент — берётся как `mode`; если несколько — `both` |

## Допустимые значения `mode`

```js
'both'
'mobile'
'desktop'
```

Также поддерживаются короткие алиасы:

```js
'mob'  // станет mobile
'desk' // станет desktop
```

## Что нельзя / не стоит

Нельзя вызывать без `selector`:

```js
window.cp_tpl.zoom({
  mode: 'mobile'
});
```

Не стоит задавать одинаковые CSS-переменные для разных zoom-логик, если они должны считаться по разным базам.

---

# `window.cp_tpl.logo(config)`

Подставляет логотип бренда в `<img>` или background.

## Пример

```js
window.cp_tpl.logo({
  selector: '.js-logo',
  brand: 'skyeng',
  color: 'white'
});
```

## Background-режим

```js
window.cp_tpl.logo({
  selector: '.logo-bg',
  brand: 'skysmart',
  color: 'black',
  mode: 'background'
});
```

## Свой URL логотипа

```js
window.cp_tpl.logo({
  selector: '.js-logo',
  src: 'https://example.com/logo.svg'
});
```

## Что можно передать

| Поле       |    Тип |         Обязательное | По умолчанию | Описание                |
| ---------- | -----: | -------------------: | -----------: | ----------------------- |
| `selector` | string |                   да |            — | CSS-селектор элемента   |
| `brand`    | string | нет, если есть `src` |            — | Бренд из списка         |
| `color`    | string |                  нет |      `white` | `white` или `black`     |
| `theme`    | string |                  нет |            — | Алиас для `color`       |
| `mode`     | string |                  нет |       `auto` | `auto` или `background` |
| `src`      | string |                  нет |            — | Прямой URL логотипа     |

## Доступные бренды

```js
'skyeng'
'skysmart'
'b2b'
'skypro'
```

## Доступные цвета

```js
'white'
'black'
```

## Что нельзя / не стоит

Нельзя передавать неизвестный `brand` без `src`.

Плохо:

```js
window.cp_tpl.logo({
  selector: '.js-logo',
  brand: 'unknown',
  color: 'white'
});
```

Хорошо:

```js
window.cp_tpl.logo({
  selector: '.js-logo',
  src: 'https://example.com/logo.svg'
});
```

---

# `window.cp_tpl.hiddenFields(fields, config)`

Добавляет hidden-поля в формы и сохраняет эти значения во внутреннее состояние, чтобы потом `buildUtmMarks()` мог использовать `promoCode`, `comment` и `marketing_experiments`.

## Базовый вызов

```js
window.cp_tpl.hiddenFields({
  promoCode: 'FRIDAY',
  marketing_experiments: 'cashbackoftheday',
  comment: 'кешбекдня'
});
```

В формы будут добавлены поля:

```html
<input type="hidden" name="promoCode" value="FRIDAY">
<input type="hidden" name="marketing_experiments" value="cashbackoftheday">
<input type="hidden" name="comment" value="кешбекдня">
```

## С ограничением на конкретную форму

```js
window.cp_tpl.hiddenFields(
  {
    comment: 'форма на первом экране'
  },
  {
    formSelector: '.uc-main-form form'
  }
);
```

## Что можно передать в `fields`

Любой объект, где ключ — это `name` hidden-поля, а значение — value.

```js
{
  promoCode: 'FRIDAY',
  comment: 'кешбекдня',
  marketing_experiments: 'cashbackoftheday'
}
```

## Что можно передать в `config`

| Поле           |     Тип | Обязательное |         По умолчанию | Описание                                 |
| -------------- | ------: | -----------: | -------------------: | ---------------------------------------- |
| `formSelector` |  string |          нет |               `form` | Какие формы искать                       |
| `boxSelector`  |  string |          нет | `.t-form__inputsbox` | Куда вставлять hidden-поля               |
| `observe`      | boolean |          нет |               `true` | Следить за появлением новых форм         |
| `utmMarksMap`  |  object |          нет |     встроенная карта | Как мапить hidden-поля в `buildUtmMarks` |

## Маппинг для `buildUtmMarks`

По умолчанию:

```js
promoCode             -> promocode
promocode             -> promocode
promo                 -> promocode
comment               -> comment
marketing_experiments -> marketingExperiments
marketingExperiments  -> marketingExperiments
```

То есть для форм можно использовать:

```js
marketing_experiments
```

А в CJM `utmMarks` это попадёт как:

```js
marketingExperiments
```

## Кастомный маппинг

```js
window.cp_tpl.hiddenFields(
  {
    customField: '123'
  },
  {
    utmMarksMap: {
      customField: 'customParam'
    }
  }
);
```

## Получить сохранённые hidden-поля

```js
var fields = window.cp_tpl.hiddenFields.getValues();
```

## Что нельзя / не стоит

Нельзя передавать первым аргументом строку или массив.

Плохо:

```js
window.cp_tpl.hiddenFields('promoCode');
```

Хорошо:

```js
window.cp_tpl.hiddenFields({
  promoCode: 'FRIDAY'
});
```

Важно: метод добавляет и обновляет поля, но не удаляет старые hidden-поля из DOM.

---

# `window.cp_tpl.t396Success(handler, config)`

Добавляет обработчик успешной отправки Zero Block формы.

## Пример

```js
window.cp_tpl.t396Success(function (formSubmission) {
  var form = formSubmission.form;

  console.log('Форма отправлена:', form);
});
```

## После оригинального `t396_onSuccess`

```js
window.cp_tpl.t396Success(function (formSubmission) {
  console.log('После стандартной логики Tilda');
}, {
  stage: 'after'
});
```

## Что получает handler

```js
{
  form: HTMLFormElement,
  formObject: originalFormObject,
  callbackArguments: arguments
}
```

## Что можно передать в config

| Поле    |    Тип | Обязательное | По умолчанию | Описание             |
| ------- | -----: | -----------: | -----------: | -------------------- |
| `stage` | string |          нет |     `before` | `before` или `after` |

## Что нельзя / не стоит

Нельзя передавать вместо функции строку, объект или вызов функции.

Плохо:

```js
window.cp_tpl.t396Success('myFunction');
```

Хорошо:

```js
window.cp_tpl.t396Success(function (formSubmission) {
  // logic
});
```

Не стоит вручную перезаписывать `window.t396_onSuccess` после вызова этого метода, иначе можно потерять зарегистрированные обработчики.

---

# `window.cp_tpl.t396Redirect(url, config)`

Делает редирект после успешной отправки формы.

## Пример

```js
window.cp_tpl.t396Redirect('https://study.skyeng.ru/1000languages/final');
```

По умолчанию текущий `location.search` сохранится.

## Без GET-параметров

```js
window.cp_tpl.t396Redirect('https://study.skyeng.ru/1000languages/final', {
  appendSearch: false
});
```

## Что можно передать

| Аргумент              |     Тип | Обязательное | Описание                        |
| --------------------- | ------: | -----------: | ------------------------------- |
| `url`                 |  string |           да | URL для редиректа               |
| `config.appendSearch` | boolean |          нет | Добавлять текущие GET-параметры |
| `config.stage`        |  string |          нет | `before` или `after`            |

## Что нельзя / не стоит

Нельзя вызывать без URL:

```js
window.cp_tpl.t396Redirect();
```

---

# `window.cp_tpl.utm(config)`

Добавляет параметры в текущий URL и создаёт глобальную функцию `window.buildUtmMarks()` для CJM.

## Базовый вызов

```js
window.cp_tpl.utm({
  parameters: {
    product: {
      value: 'type-skyeng_action|name-cashbackoftheday',
      type: 'hard'
    }
  }
});
```

## Soft-параметр

```js
window.cp_tpl.utm({
  parameters: {
    utm_source: {
      value: 'landing',
      type: 'soft'
    }
  }
});
```

`soft` добавится только если такого параметра ещё нет в URL.

## Hard-параметр

```js
window.cp_tpl.utm({
  parameters: {
    product: {
      value: 'type-skyeng_action|name-test',
      type: 'hard'
    }
  }
});
```

`hard` всегда перезапишет параметр в URL.

## Упрощённая запись

```js
window.cp_tpl.utm({
  parameters: {
    product: 'type-skyeng_action|name-test'
  }
});
```

Это будет `soft` по умолчанию.

## Что можно передать

| Поле            |     Тип | Обязательное | По умолчанию | Описание                       |
| --------------- | ------: | -----------: | -----------: | ------------------------------ |
| `parameters`    |  object |          нет |         `{}` | Основные параметры             |
| `utmParameters` |  object |          нет |         `{}` | Алиас для `parameters`         |
| `extraParams`   |  object |          нет |         `{}` | Дополнительные параметры       |
| `updateUrl`     | boolean |          нет |       `true` | Обновлять текущий URL          |
| `exposeGlobals` | boolean |          нет |       `true` | Создать `window.buildUtmMarks` |

## `buildUtmMarks`

После вызова `cp_tpl.utm()` появляется:

```js
window.buildUtmMarks()
```

Она собирает строку параметров для CJM:

```js
var utmMarks = window.buildUtmMarks();
```

Можно добавить параметры только для конкретного вызова:

```js
var utmMarks = window.buildUtmMarks({
  someParam: '123'
});
```

Можно отключить подтягивание hidden-полей:

```js
var utmMarks = window.buildUtmMarks({}, {
  includeHiddenFields: false
});
```

## Связка с `hiddenFields`

Если раньше вызвать:

```js
window.cp_tpl.hiddenFields({
  promoCode: 'FRIDAY',
  marketing_experiments: 'cashbackoftheday',
  comment: 'кешбекдня'
});
```

То `buildUtmMarks()` добавит:

```txt
promocode=FRIDAY
marketingExperiments=cashbackoftheday
comment=кешбекдня
```

## Что нельзя / не стоит

Не стоит класть в `parameters` пустые значения. Они будут проигнорированы:

```js
window.cp_tpl.utm({
  parameters: {
    product: ''
  }
});
```

`hiddenFields` не обновляет URL напрямую. Они попадают именно в `buildUtmMarks`, если не отключить `includeHiddenFields`.

---

# `window.cp_tpl.marquee(config)`

Создаёт бесконечную бегущую строку.

## Быстрый вызов

```js
window.cp_tpl.marquee('.marquee--infinite');
```

## Полный вызов

```js
window.cp_tpl.marquee({
  selector: '.marquee--infinite',
  speed: 90,
  minWidthFactor: 1.5
});
```

## Ожидаемая структура

```html
<div class="marquee--infinite">
  <div>
    <div>item 1</div>
    <div>item 2</div>
    <div>item 3</div>
  </div>
</div>
```

## Что можно передать

| Поле             |    Тип | Обязательное |         По умолчанию | Описание                                    |
| ---------------- | -----: | -----------: | -------------------: | ------------------------------------------- |
| `selector`       | string |          нет | `.marquee--infinite` | Селектор wrapper                            |
| `speed`          | number |          нет |                 `90` | Скорость движения                           |
| `minWidthFactor` | number |          нет |                `1.5` | Насколько длиннее viewport должен быть трек |

## Что нельзя / не стоит

Не стоит вызывать на контейнере без внутреннего первого `div`.

Плохо:

```html
<div class="marquee--infinite">
  item 1
  item 2
</div>
```

Хорошо:

```html
<div class="marquee--infinite">
  <div>
    <span>item 1</span>
    <span>item 2</span>
  </div>
</div>
```

---

# `window.cp_tpl.media(config)`

Инициализирует видео и аудио: play/pause по клику, иконки play/pause, таймер и прогресс для аудио.

## Базовый вызов

```js
window.cp_tpl.media();
```

## Кастомный контейнер

```js
window.cp_tpl.media({
  containerSelector: '.uc-videos',
  videoSelector: 'video'
});
```

## Не останавливать другие видео

```js
window.cp_tpl.media({
  pauseOthers: false
});
```

## Кастомные иконки

```js
window.cp_tpl.media({
  iconPlay: 'https://example.com/play.svg',
  iconPause: 'https://example.com/pause.svg'
});
```

## Что можно передать

| Поле                |     Тип | Обязательное |        По умолчанию | Описание                         |
| ------------------- | ------: | -----------: | ------------------: | -------------------------------- |
| `containerSelector` |  string |          нет | `[class*="videos"]` | Контейнеры с видео               |
| `videoSelector`     |  string |          нет |             `video` | Селектор видео внутри контейнера |
| `pauseOthers`       | boolean |          нет |              `true` | Останавливать другие видео       |
| `iconPlay`          |  string |          нет |      встроенный URL | SVG play                         |
| `iconPause`         |  string |          нет |      встроенный URL | SVG pause                        |

## Что нельзя / не стоит

Не стоит вызывать метод на контейнере, где нет `<video>`.

Метод сам помечает уже обработанные видео, поэтому повторный вызов не должен дублировать обработчики.

---

# `window.cp_tpl.scrollIndicator(config)`

Создаёт точки-индикаторы для горизонтального скролла.

Метод теперь можно использовать двумя способами:

1. Через общий root-контейнер.
2. Напрямую по селекторам контейнера карточек и контейнера дотсов.

---

## Вариант 1: через root-контейнер

```js
window.cp_tpl.scrollIndicator({
  rootSelector: '.uc-scroll-block',
  scrollSelector: '.cp-scroll-cards',
  dotsSelector: '.scroll-indicator .dot'
});
```

HTML:

```html
<div class="uc-scroll-block">
  <div class="cp-scroll-cards">
    <!-- карточки -->
  </div>

  <div class="scroll-indicator">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</div>
```

---

## Вариант 2: напрямую без root-контейнера

```js
window.cp_tpl.scrollIndicator({
  direct: true,
  scrollSelector: '.cards-scroll',
  dotsSelector: '.cards-dots .dot'
});
```

HTML:

```html
<div class="cards-scroll">
  <!-- карточки -->
</div>

<div class="cards-dots">
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
</div>
```

---

## Несколько разных скроллов на странице

```js
window.cp_tpl.scrollIndicator({
  items: [
    {
      direct: true,
      scrollSelector: '.cards-1',
      dotsSelector: '.dots-1 .dot',
      start: 'middle'
    },
    {
      direct: true,
      scrollSelector: '.cards-2',
      dotsSelector: '.dots-2 .dot',
      start: 'start'
    }
  ]
});
```

---

## Старт с середины

Точечно через конфиг:

```js
window.cp_tpl.scrollIndicator({
  direct: true,
  scrollSelector: '.cards-1',
  dotsSelector: '.dots-1 .dot',
  start: 'middle'
});
```

Или через класс/атрибут:

```html
<div class="cards-scroll is-scroll-mid">
  ...
</div>
```

```html
<div class="cards-scroll --scroll-mid">
  ...
</div>
```

```html
<div class="cards-scroll" data-scroll-start="middle">
  ...
</div>
```

## Что можно передать

| Поле             |            Тип | Обязательное |                                                  По умолчанию | Описание                       |
| ---------------- | -------------: | -----------: | ------------------------------------------------------------: | ------------------------------ |
| `items`          |          array |          нет |                                                             — | Несколько независимых конфигов |
| `rootSelector`   |    string/null |          нет |                                            `.uc-scroll-block` | Общий контейнер                |
| `blockSelector`  |    string/null |          нет |                                                             — | Алиас для `rootSelector`       |
| `scrollSelector` |         string |          нет |           `.cp-scroll-cards, .add_mob_scroll_indicator > div` | Скроллящийся контейнер         |
| `cardsSelector`  |         string |          нет |                                                             — | Алиас для `scrollSelector`     |
| `dotsSelector`   |         string |          нет |                                      `.scroll-indicator .dot` | Селектор точек                 |
| `direct`         |        boolean |          нет |                                                       `false` | Искать напрямую по странице    |
| `start`          | string/boolean |          нет |                                                          auto | `middle`, `start`, `false`     |
| `middleSelector` |         string |          нет | `.--scroll-mid, .is-scroll-mid, [data-scroll-start="middle"]` | Как определить middle-старт    |

## Что нельзя / не стоит

Если на странице несколько одинаковых `.cards-scroll`, не используй `direct: true` с общим селектором — будет взят первый найденный элемент.

Плохо:

```js
window.cp_tpl.scrollIndicator({
  direct: true,
  scrollSelector: '.cards-scroll',
  dotsSelector: '.dots .dot'
});
```

Хорошо:

```js
window.cp_tpl.scrollIndicator({
  items: [
    {
      direct: true,
      scrollSelector: '.cards-scroll-1',
      dotsSelector: '.dots-1 .dot'
    },
    {
      direct: true,
      scrollSelector: '.cards-scroll-2',
      dotsSelector: '.dots-2 .dot'
    }
  ]
});
```

---

# `window.cp_tpl.spacer(config)`

Создаёт или находит spacer и растягивает его, чтобы страница занимала высоту viewport.

## Базовый вызов

```js
window.cp_tpl.spacer();
```

Если spacer не найден, метод сам создаст:

```html
<div class="empty_spacer"></div>
```

внутри `#allrecords`.

## Кастомный класс и фон

```js
window.cp_tpl.spacer({
  class: 'my-spacer',
  bgColor: 'blue'
});
```

Будет создан:

```html
<div class="empty_spacer my-spacer"></div>
```

## Полный конфиг

```js
window.cp_tpl.spacer({
  allrecordsSelector: '#allrecords',
  class: 'my-spacer',
  bgColor: '#f5f5f5',
  safetyGap: 0,
  create: true
});
```

## Что можно передать

| Поле                 |     Тип | Обязательное |            По умолчанию | Описание                       |
| -------------------- | ------: | -----------: | ----------------------: | ------------------------------ |
| `allrecordsSelector` |  string |          нет |           `#allrecords` | Родитель страницы              |
| `class`              |  string |          нет |          `empty_spacer` | Класс создаваемого spacer      |
| `className`          |  string |          нет |                       — | Алиас для `class`              |
| `spacerSelector`     |  string |          нет | первый класс из `class` | Как найти существующий spacer  |
| `bgColor`            |  string |          нет |                       — | Цвет фона                      |
| `backgroundColor`    |  string |          нет |                       — | Алиас для `bgColor`            |
| `safetyGap`          |  number |          нет |                     `0` | Запас против микроскролла      |
| `create`             | boolean |          нет |                  `true` | Создавать spacer, если его нет |

## Ручной пересчёт

После вызова метода доступно:

```js
window.fitTildaSpacer();
```

Или через возвращаемый объект:

```js
var spacer = window.cp_tpl.spacer();

spacer.fit();
```

## Что нельзя / не стоит

Не стоит создавать несколько spacer-элементов для одной страницы без необходимости.

Если `create: false`, но spacer не существует, метод ничего не сможет растянуть.

---

# `window.cp_tpl.switchBlocks(config)`

Переключает блоки по триггерам.

## Базовый вызов

```js
window.cp_tpl.switchBlocks();
```

По умолчанию ищет:

```js
blockSelector: '[class*="uc-vitrina"]'
triggerSelector: '[class*="trigger"]:not([class*="mob_trigger"])'
mobileTriggerSelector: '[class*="mob_trigger"]'
```

## Полный вызов

```js
var switcher = window.cp_tpl.switchBlocks({
  blockSelector: '[class*="uc-vitrina"]',
  triggerSelector: '[class*="trigger"]:not([class*="mob_trigger"])',
  mobileTriggerSelector: '[class*="mob_trigger"]',
  initialIndex: 0
});
```

## Переключить вручную

```js
switcher.activate(2);
```

## Что можно передать

| Поле                    |      Тип | Обязательное |                                     По умолчанию | Описание                    |
| ----------------------- | -------: | -----------: | -----------------------------------------------: | --------------------------- |
| `blockSelector`         |   string |          нет |                          `[class*="uc-vitrina"]` | Переключаемые блоки         |
| `triggerSelector`       |   string |          нет | `[class*="trigger"]:not([class*="mob_trigger"])` | Десктоп-триггеры            |
| `mobileTriggerSelector` |   string |          нет |                         `[class*="mob_trigger"]` | Мобильные триггеры          |
| `blockActiveClass`      |   string |          нет |                                 `vitrina-active` | Активный класс блока        |
| `triggerActiveClass`    |   string |          нет |                                 `trigger-active` | Активный класс триггера     |
| `initialIndex`          |   number |          нет |                                              `0` | Какой блок открыт сначала   |
| `injectCss`             |  boolean |          нет |                                           `true` | Добавлять CSS автоматически |
| `onChange`              | function |          нет |                                                — | Callback при переключении   |

## `onChange`

```js
window.cp_tpl.switchBlocks({
  onChange: function (index, data) {
    console.log(index);
    console.log(data.block);
    console.log(data.trigger);
  }
});
```

## Что нельзя / не стоит

Не стоит использовать слишком общий `triggerSelector`, если на странице есть другие элементы с классом `trigger`.

---

# `window.cp_tpl.copy(config)`

Копирует текст в буфер и показывает уведомление.

## Копировать фиксированный текст

```js
window.cp_tpl.copy({
  selector: '.copy-promocode',
  text: 'FRIDAY'
});
```

## Копировать из `data-copy`

```html
<div class="copy-promocode" data-copy="FRIDAY">
  Скопировать промокод
</div>
```

```js
window.cp_tpl.copy({
  selector: '.copy-promocode'
});
```

## Кастомный текст уведомления

```js
window.cp_tpl.copy({
  selector: '.copy-promocode',
  text: 'FRIDAY',
  alertText: 'Промокод скопирован',
  hideDelay: 1000
});
```

## Что можно передать

| Поле        |             Тип | Обязательное |          По умолчанию | Описание                         |
| ----------- | --------------: | -----------: | --------------------: | -------------------------------- |
| `selector`  |          string |          нет |     `.copy-promocode` | Элементы для клика               |
| `text`      | string/function |          нет |                     — | Что копировать                   |
| `alertId`   |          string |          нет |         `promo-alert` | ID уведомления                   |
| `alertText` |          string |          нет | `Скопировано в буфер` | Текст уведомления                |
| `hideDelay` |          number |          нет |                `1000` | Через сколько скрыть уведомление |

## `text` как функция

```js
window.cp_tpl.copy({
  selector: '.copy-promocode',
  text: function (element) {
    return element.getAttribute('data-promocode');
  }
});
```

## Что нельзя / не стоит

Если не передан `text` и нет `data-copy`, метод скопирует текстовое содержимое элемента.

---

# `window.cp_tpl.viewport(config)`

Меняет viewport для диапазона ширины экрана.

## Пример

```js
window.cp_tpl.viewport({
  min: 640,
  max: 1200,
  width: 1400
});
```

Если `screen.width >= 640 && screen.width < 1200`, viewport станет:

```html
<meta name="viewport" content="width=1400">
```

## Что можно передать

| Поле             |           Тип | Обязательное | По умолчанию | Описание                                        |
| ---------------- | ------------: | -----------: | -----------: | ----------------------------------------------- |
| `min`            |        number |          нет |        `640` | Минимальная ширина                              |
| `max`            |        number |          нет |       `1200` | Максимальная ширина                             |
| `width`          | number/string |          нет |       `1400` | Значение viewport width                         |
| `useScreenWidth` |       boolean |          нет |       `true` | Использовать `screen.width`, иначе `innerWidth` |

## Что нельзя / не стоит

Не стоит вызывать несколько раз с разными правилами viewport на одной странице.

---

# `window.cp_tpl.loadScript(config)`

Подключает внешний JS-файл.

## Быстрый вызов

```js
window.cp_tpl.loadScript('https://example.com/script.js');
```

## Полный вызов

```js
window.cp_tpl.loadScript({
  id: 'custom-script',
  src: 'https://example.com/script.js',
  cacheBust: true,
  async: true
});
```

## Что можно передать

| Поле        |     Тип | Обязательное | По умолчанию | Описание             |
| ----------- | ------: | -----------: | -----------: | -------------------- |
| `src`       |  string |           да |            — | URL скрипта          |
| `id`        |  string |          нет |            — | ID script-тега       |
| `cacheBust` | boolean |          нет |      `false` | Добавить timestamp   |
| `async`     | boolean |          нет |       `true` | Асинхронная загрузка |

## Что нельзя / не стоит

Если передан `id` и элемент с таким ID уже есть на странице, скрипт не будет добавлен повторно.

---

# `window.cp_tpl.widgets(config)`

Подключает виджетный loader Skyeng.

## Базовый вызов

```js
window.cp_tpl.widgets();
```

По умолчанию подключает:

```txt
https://widgets-host.skyeng.ru/loader.js
```

## Полный вызов

```js
window.cp_tpl.widgets({
  src: 'https://widgets-host.skyeng.ru/loader.js',
  cacheBust: true,
  async: true
});
```

## Что можно передать

| Поле        |     Тип | Обязательное |                               По умолчанию | Описание             |
| ----------- | ------: | -----------: | -----------------------------------------: | -------------------- |
| `id`        |  string |          нет |                    `cp_tpl_widgets_loader` | ID script-тега       |
| `src`       |  string |          нет | `https://widgets-host.skyeng.ru/loader.js` | URL loader           |
| `cacheBust` | boolean |          нет |                                     `true` | Добавить timestamp   |
| `async`     | boolean |          нет |                                     `true` | Асинхронная загрузка |

## Что нельзя / не стоит

Не нужно параллельно подключать тот же loader руками через отдельный `<script>`.

---

# `window.cp_tpl.forms.selectAll(config)`

Находит все Tilda-формы, назначает им ID при необходимости и сохраняет список ID в глобальную переменную.

## Базовый вызов

```js
window.cp_tpl.forms.selectAll();
```

Результат будет в:

```js
window.selectedFormIds
```

## Callback

```js
window.cp_tpl.forms.selectAll({
  onReady: function (formIds) {
    console.log(formIds);
  }
});
```

## Что можно передать

| Поле                |      Тип | Обязательное |           По умолчанию | Описание                                |
| ------------------- | -------: | -----------: | ---------------------: | --------------------------------------- |
| `formSelector`      |   string |          нет | набор Tilda-селекторов | Какие формы искать                      |
| `inputsBoxSelector` |   string |          нет |   `.t-form__inputsbox` | Проверка, что это настоящая Tilda-форма |
| `quietTime`         |   number |          нет |                 `1500` | Сколько ждать стабильный DOM            |
| `maxWait`           |   number |          нет |                `15000` | Максимальное ожидание                   |
| `globalName`        |   string |          нет |      `selectedFormIds` | Имя глобального массива                 |
| `onReady`           | function |          нет |                      — | Callback после нахождения форм          |

## Что нельзя / не стоит

Не стоит отключать проверку `.t-form__inputsbox`, иначе можно зацепить технические формы.

---

# `window.cp_tpl.forms.televox(config)`

Добавляет Televox hidden-поля в формы и обновляет их при клике, изменении и submit.

## Базовый вызов

```js
window.cp_tpl.forms.televox({
  importGroup: 12491
});
```

## С правилами дедубликации

```js
window.cp_tpl.forms.televox({
  importGroup: 12491,
  rules: [
    'client_in_black_list',
    'client_is_active'
  ]
});
```

## На конкретные формы

```js
window.cp_tpl.forms.televox({
  autoSelect: false,
  formIds: ['form123', 'form456'],
  importGroup: 12491
});
```

## Что можно передать

| Поле          |           Тип | Обязательное |      По умолчанию | Описание                                     |
| ------------- | ------------: | -----------: | ----------------: | -------------------------------------------- |
| `importGroup` | number/string |   желательно |              `''` | ID импорт-группы                             |
| `globalName`  |        string |          нет | `selectedFormIds` | Откуда брать ID форм                         |
| `fields`      |         array |          нет | стандартный набор | Какие hidden-поля добавить                   |
| `rules`       |  array/string |          нет |                 — | Правила дедубликации                         |
| `autoSelect`  |       boolean |          нет |            `true` | Автоматически искать формы                   |
| `formIds`     |         array |          нет |                 — | Список ID форм при `autoSelect: false`       |
| `extraParams` |        object |          нет |              `{}` | Дополнительные параметры для `buildUtmMarks` |

## Что добавляет по умолчанию

```js
subscription_attributes_utmMarks
customer_attributes_offset
subscription_attributes_location
subscription_attributes_televoxIntegration
subscription_attributes_televoxImportGroup
```

Если передать `rules`, добавит ещё:

```js
subscription_attributes_rules
```

## Что нельзя / не стоит

Если `autoSelect: false`, обязательно передай `formIds` или заранее заполни `window.selectedFormIds`.

---

# `window.cp_tpl.b2b.hit(config)`

Получает `hitId` из `window.skyengTrackHits`.

## Базовый вызов

```js
var hit = window.cp_tpl.b2b.hit();
```

Получить текущее значение сразу:

```js
hit.get();
```

Дождаться значения:

```js
hit.ready.then(function (hitId) {
  console.log(hitId);
});
```

Обновить:

```js
hit.refresh().then(function (hitId) {
  console.log(hitId);
});
```

## Что можно передать

| Поле         |    Тип | Обязательное | По умолчанию | Описание                       |
| ------------ | -----: | -----------: | -----------: | ------------------------------ |
| `delay`      | number |          нет |          `0` | Задержка перед первой попыткой |
| `retries`    | number |          нет |         `20` | Количество попыток             |
| `retryDelay` | number |          нет |        `250` | Пауза между попытками          |
| `globalName` | string |          нет |     `getHit` | Имя глобальной переменной      |

## Что нельзя / не стоит

Не стоит рассчитывать, что `hit.get()` сразу вернёт значение. Если нужно гарантированно дождаться hit, используй:

```js
window.cp_tpl.b2b.getMetaAsync()
```

---

# `window.cp_tpl.b2b.zone(config)`

Определяет timezone по offset и сохраняет в `window.getZone`.

## Базовый вызов

```js
window.cp_tpl.b2b.zone();
```

## Получить значение

```js
var zone = window.cp_tpl.b2b.zone();
```

## Что можно передать

| Поле         |    Тип | Обязательное | По умолчанию | Описание                |
| ------------ | -----: | -----------: | -----------: | ----------------------- |
| `globalName` | string |          нет |    `getZone` | Куда сохранить timezone |

---

# `window.cp_tpl.b2b.getMeta()`

Возвращает текущие B2B-метаданные.

```js
var meta = window.cp_tpl.b2b.getMeta();
```

Пример:

```js
{
  hitId: '...',
  timezone: 'Europe/Moscow'
}
```

## Важно

`getMeta()` не ждёт hit асинхронно. Он пытается прочитать то, что уже есть.

Если нужно дождаться hit, используй `getMetaAsync()`.

---

# `window.cp_tpl.b2b.getMetaAsync()`

Асинхронно ждёт hit и возвращает метаданные.

```js
window.cp_tpl.b2b.getMetaAsync().then(function (meta) {
  console.log(meta);
});
```

## Когда использовать

Используй, если сразу после:

```js
window.cp_tpl.b2b.hit();
```

нужно гарантированно получить `hitId`.

---

# `window.cp_tpl.b2b.order(config)`

Подключает кастомную отправку B2B-заявки на API.

## Базовый вызов

```js
window.cp_tpl.b2b.order();
```

Метод сам вызывает:

```js
window.cp_tpl.b2b.hit();
window.cp_tpl.b2b.zone();
```

и перед отправкой формы ждёт `hitId`.

## Полный конфиг

```js
window.cp_tpl.b2b.order({
  apiUrl: 'https://corp.skyeng.ru/landing/public/v2/order',

  orderConfig: {
    generateLoginLinkTo: 'https://student.skyeng.ru/',
    landing_param_key: 'utm_page'
  },

  openThankyou: true,
  redirectToLoginLink: true,

  transformPayload: function (payload, data) {
    payload.customLandingType = 'special-b2b-landing';
    return payload;
  },

  onSuccess: function (data) {
    console.log(data.payload);
    console.log(data.responseData);
  },

  onError: function (error, data) {
    console.error(error);
  }
});
```

## Что можно передать

| Поле                  |      Тип | Обязательное |           По умолчанию | Описание                                     |
| --------------------- | -------: | -----------: | ---------------------: | -------------------------------------------- |
| `apiUrl`              |   string |          нет |            B2B API URL | URL отправки                                 |
| `orderConfig`         |   object |          нет |     стандартный конфиг | Доп. поля в payload                          |
| `childCourseValue`    |   string |          нет | `Репетиторы для детей` | Старое правило детской формы по `courseType` |
| `openThankyou`        |  boolean |          нет |                 `true` | Открывать thankyou popup                     |
| `redirectToLoginLink` |  boolean |          нет |                 `true` | Редиректить на `loginLink`                   |
| `transformPayload`    | function |          нет |                      — | Изменить payload перед отправкой             |
| `onSuccess`           | function |          нет |                      — | Callback успеха                              |
| `onError`             | function |          нет |                      — | Callback ошибки                              |

## Детская или взрослая форма

Метод определяет детскую форму так:

1. Если в форме есть:

```html
<input type="hidden" name="childName" value="Ребёнок">
```

и значение не пустое — форма считается детской.

2. Если `childName` нет или он пустой — форма считается взрослой.

3. Старое правило по `courseType === 'Репетиторы для детей'` тоже поддерживается.

## Пустые поля

Пустые hidden-инпуты не попадают в payload.

---

# `window.cp_tpl.cjm.products`

Общий каталог CJM-продуктов.

## Продукт со STK

```js
{
  brand: 'skysmart',
  label: 'Английский язык',
  selectValues: ['Английский', 'Английский язык', 'english'],
  id: 'kid_mini_course_kids_english_junior',
  selectedStk: 'mini_course_kids_english_junior'
}
```

## Kit-продукт

```js
{
  brand: 'skysmart',
  label: 'Домашний лицей 5-11 класс',
  selectValues: ['Домашний лицей 5-11 класс'],
  id: 'skysmart_homeschooling_8_grade8',
  productKitCode: 'skysmart_homeschooling_8_grade',
  kitTariffUuid: '639db64c-139f-4701-b41d-c6ab73614996'
}
```

## Что можно передать в продукт

| Поле             |    Тип | Обязательное | Описание                                   |
| ---------------- | -----: | -----------: | ------------------------------------------ |
| `brand`          | string |   желательно | Бренд: `skyeng`, `skysmart`, etc           |
| `label`          | string |           да | Название продукта для CJM                  |
| `selectValues`   |  array |   желательно | Значения select, по которым искать продукт |
| `id`             | string |           да | Уникальный CJM product config id           |
| `selectedStk`    | string |          нет | STK                                        |
| `productKitCode` | string |          нет | Product kit code                           |
| `kitTariffUuid`  | string |          нет | Tariff UUID                                |

## Что нельзя / не стоит

Нельзя добавлять продукт без `id`.

Не стоит полагаться только на `label`, если на странице есть одинаковые названия продуктов у разных брендов. Лучше указывать `brand`.

---

# `window.cp_tpl.cjm.addProducts(products)`

Добавляет кастомные продукты только для текущей страницы.

Страничные продукты имеют приоритет над общим каталогом.

## Пример

```js
window.cp_tpl.cjm.addProducts([
  {
    brand: 'skysmart',
    label: 'Английский язык',
    selectValues: ['Английский'],
    id: 'custom_product_id',
    selectedStk: 'custom_stk'
  }
]);
```

## Что можно передать

Массив продуктов в том же формате, что и `window.cp_tpl.cjm.products`.

## Что нельзя / не стоит

Не передавай одиночный объект. Нужен массив.

Плохо:

```js
window.cp_tpl.cjm.addProducts({
  id: 'custom_product_id'
});
```

Хорошо:

```js
window.cp_tpl.cjm.addProducts([
  {
    id: 'custom_product_id',
    label: 'Английский язык',
    selectedStk: 'custom_stk'
  }
]);
```

---

# `window.cp_tpl.cjm.init(config)`

Инициализирует CJM-интеграцию.

Перед вызовом на странице должен быть компонент:

```html
<cism-easy-payment-flow-integration locale="ru"></cism-easy-payment-flow-integration>
```

## Базовый вызов

```js
window.cp_tpl.cjm.init();
```

## С кастомными продуктами

```js
window.cp_tpl.cjm.init({
  products: [
    {
      brand: 'skysmart',
      label: 'Английский язык',
      selectValues: ['Английский'],
      id: 'custom_product_id',
      selectedStk: 'custom_stk'
    }
  ]
});
```

`products` из `init()` имеют приоритет над общим каталогом.

## Форма с select

На форму или обёртку добавляем бренд:

```html
<div data-cp-brand="skysmart">
  <form>
    <select name="lessonType">
      <option value="">Выберите предмет</option>
      <option value="Английский">Английский</option>
    </select>
  </form>
</div>
```

Вызов:

```js
window.cp_tpl.cjm.init();
```

Скрипт найдёт продукт по:

```txt
brand + selected value
```

и заполнит в форме:

```js
serviceTypeKey
productKitCode
tariffUuid
```

Если hidden-полей нет, они будут созданы.

## Auth-сценарий с select

```html
<div data-cp-brand="skysmart" data-cp-mode="auth">
  <select name="subject">
    <option value="Английский">Английский</option>
  </select>

  <div class="subject-btn"></div>
</div>
```

```js
window.cp_tpl.cjm.init();
```

По умолчанию кнопка ищется так:

```js
'.' + select.name + '-btn'
```

Для `name="subject"` это:

```js
.subject-btn
```

## Свой селектор auth-кнопки

```js
window.cp_tpl.cjm.init({
  getAuthButtonSelector: function (select, product) {
    return '.my-auth-button';
  }
});
```

## Кнопки без формы и без select

На странице может не быть формы и select, а только кнопка консультации.

### Вариант через config

```js
window.cp_tpl.cjm.init({
  buttons: [
    {
      selector: '.leave-request-btn',
      productId: 'custom_product_id'
    }
  ]
});
```

### Вариант через HTML data-атрибуты

```html
<button
  class="cp-cjm-button"
  data-cp-cjm-button
  data-cp-product-id="custom_product_id"
>
  Оставить заявку
</button>
```

```js
window.cp_tpl.cjm.init();
```

### Вариант через бренд и значение

```html
<button
  class="cp-cjm-button"
  data-cp-cjm-button
  data-cp-brand="skysmart"
  data-cp-value="Английский"
>
  Оставить заявку
</button>
```

```js
window.cp_tpl.cjm.init();
```

## Что можно передать в `cjm.init`

| Поле                    |      Тип | Обязательное |  По умолчанию | Описание                             |
| ----------------------- | -------: | -----------: | ------------: | ------------------------------------ |
| `products`              |    array |          нет |             — | Кастомные продукты страницы          |
| `authPrefix`            |   string |          нет |        `auth` | Префикс auth-select                  |
| `anonymousPrefix`       |   string |          нет |      `unauth` | Префикс anonymous-select             |
| `selectSelector`        |   string |          нет |             — | Какие select обрабатывать            |
| `scanSelector`          |   string |          нет |      `select` | Какие select просканировать при init |
| `initCurrentValues`     |  boolean |          нет |        `true` | Обработать текущие значения select   |
| `createHiddenFields`    |  boolean |          нет |        `true` | Создавать hidden-поля в форме        |
| `extraParams`           |   object |          нет |          `{}` | Доп. параметры в `utmMarks`          |
| `comment`               |   string |          нет |          `''` | Комментарий для CJM-кнопки           |
| `buttons`               |    array |          нет |             — | Кнопки без select/form               |
| `buttonSelector`        |   string |          нет | data-селектор | Какие data-кнопки сканировать        |
| `scanButtons`           |  boolean |          нет |        `true` | Сканировать data-кнопки              |
| `getAuthButtonSelector` | function |          нет |             — | Вернуть селектор auth-кнопки         |
| `onFillForm`            | function |          нет |             — | Callback после заполнения формы      |

## `onFillForm`

```js
window.cp_tpl.cjm.init({
  onFillForm: function (form, product, select) {
    console.log(form);
    console.log(product);
    console.log(select);
  }
});
```

## Что нельзя / не стоит

Не стоит одновременно использовать слишком общий `selectSelector` и несколько разных форм без `data-cp-brand`.

Плохо:

```js
window.cp_tpl.cjm.init({
  selectSelector: 'select'
});
```

если на странице есть не-CJM select.

Лучше:

```html
<div data-cp-brand="skysmart">
  <select name="lessonType">...</select>
</div>
```

или:

```js
window.cp_tpl.cjm.init({
  selectSelector: '.cjm-product-select'
});
```

---

# `window.cp_tpl.cjm.initButton(buttonConfig)`

Инициализирует одну CJM-кнопку без полного `cjm.init`.

## По productId

```js
window.cp_tpl.cjm.initButton({
  selector: '.leave-request-btn',
  productId: 'custom_product_id'
});
```

## По бренду и значению

```js
window.cp_tpl.cjm.initButton({
  selector: '.leave-request-btn',
  brand: 'skysmart',
  value: 'Английский'
});
```

## С продуктом прямо в конфиге

```js
window.cp_tpl.cjm.initButton({
  selector: '.leave-request-btn',
  product: {
    id: 'custom_product_id',
    label: 'Английский язык',
    selectedStk: 'custom_stk'
  }
});
```

## Что можно передать

| Поле            |    Тип | Обязательное | Описание                              |
| --------------- | -----: | -----------: | ------------------------------------- |
| `selector`      | string |           да | Селектор кнопки                       |
| `productId`     | string |          нет | ID продукта из каталога               |
| `brand`         | string |          нет | Бренд                                 |
| `value`         | string |          нет | Значение для поиска по `selectValues` |
| `selectedValue` | string |          нет | Алиас для `value`                     |
| `label`         | string |          нет | Label для поиска                      |
| `selectedLabel` | string |          нет | Алиас для `label`                     |
| `product`       | object |          нет | Продукт напрямую                      |
| `products`      |  array |          нет | Кастомные продукты для поиска         |
| `extraParams`   | object |          нет | Доп. параметры в `utmMarks`           |
| `comment`       | string |          нет | Комментарий                           |
| `analyticsData` | object |          нет | Данные аналитики                      |
| `blockName`     | string |          нет | blockName для аналитики               |

## Что нельзя / не стоит

Нельзя вызывать без `selector`.

Если не передать `product`, `productId`, `brand + value`, продукт может не найтись.

---

# `window.cp_tpl.cjm.resolveProduct(select)`

Находит CJM-продукт по select.

## Пример

```js
var select = document.querySelector('select[name="lessonType"]');
var product = window.cp_tpl.cjm.resolveProduct(select);

console.log(product);
```

## Когда использовать

Для отладки, чтобы понять, какой продукт будет выбран.

---

# `window.cp_tpl.cjm.getProductConfigurations(customProducts)`

Возвращает список продуктов в формате для:

```js
window.easyPaymentFlow.initProductConfigurations(...)
```

## Пример

```js
console.log(window.cp_tpl.cjm.getProductConfigurations());
```

С кастомными продуктами:

```js
console.log(window.cp_tpl.cjm.getProductConfigurations([
  {
    id: 'custom_product_id',
    label: 'Custom product',
    selectedStk: 'custom_stk'
  }
]));
```

---

# Удалённый метод

## `window.cp_tpl.forms.behavior`

В новой версии метод удалён.

Не использовать:

```js
window.cp_tpl.forms.behavior(...)
```

Если на старом лендинге есть такой вызов, его нужно удалить или заменить отдельной логикой.

---

# Служебные блоки в конце файла

## `waitForZoneJs(...)`

Служебный блок для ожидания `Zone.js`.

Обычно вручную вызывать не нужно.

---

## `UTM -> Для ссылок`

Служебный блок, который автоматически прокидывает текущие GET-параметры в ссылки на странице.

Обычно вручную вызывать не нужно.

---

# Частые готовые сценарии

## Skyeng-лендинг с GTM, UTM, hidden-полями и Televox

```html
<script>
  window.cp_tpl.gtm('skyeng');

  window.cp_tpl.hiddenFields({
    promoCode: 'FRIDAY',
    marketing_experiments: 'cashbackoftheday',
    comment: 'кешбекдня'
  });

  window.cp_tpl.utm({
    parameters: {
      product: {
        value: 'type-skyeng_action|name-cashbackoftheday',
        type: 'hard'
      }
    }
  });

  window.cp_tpl.forms.televox({
    importGroup: 12491
  });
</script>
```

## B2B-лендинг с кастомной отправкой заявки

```html
<script>
  window.cp_tpl.gtm('b2b');

  window.cp_tpl.b2b.order();
</script>
```

## CJM-лендинг с формой и select

```html
<cism-easy-payment-flow-integration locale="ru"></cism-easy-payment-flow-integration>

<div data-cp-brand="skysmart">
  <form>
    <select name="lessonType">
      <option value="">Выберите предмет</option>
      <option value="Английский">Английский</option>
    </select>
  </form>
</div>

<script>
  window.cp_tpl.cjm.init();
</script>
```

## CJM-лендинг только с кнопкой

```html
<cism-easy-payment-flow-integration locale="ru"></cism-easy-payment-flow-integration>

<button
  class="cp-cjm-button"
  data-cp-cjm-button
  data-cp-product-id="custom_product_id"
>
  Оставить заявку
</button>

<script>
  window.cp_tpl.cjm.init({
    products: [
      {
        id: 'custom_product_id',
        label: 'Английский язык',
        selectedStk: 'custom_stk'
      }
    ]
  });
</script>
```

## Только мобильный zoom

```html
<script>
  window.cp_tpl.zoom({
    selector: '.hero',
    mode: 'mobile',
    mobileBase: 376,
    breakpoint: 640
  });
</script>
```

## Spacer с кастомным классом и фоном

```html
<script>
  window.cp_tpl.spacer({
    class: 'my-spacer',
    bgColor: '#f5f5f5'
  });
</script>
```
