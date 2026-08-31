---
layout: default
title: Terms / соглашения
nav_order: 12
search_keywords: >-
  terms terms.js соглашения consent checkbox чекбокс персональные данные реклама legal agreement
  initTerms debugTerms DEBUG_TERMS termsConfig termsConsts fallbackId fallbackLink textToFind versionId
  agreement_link hidden document version id legal skyeng
---
# `terms.js`: соглашения и legal documents

`terms.js` — отдельный скрипт репозитория. Он находит нужные checkbox по тексту, подставляет актуальные ссылки на legal documents, получает version ID с fallback и синхронизирует hidden-поля формы.

## Подключение

```html
<script src="https://cdn.jsdelivr.net/gh/avelkoskyeng/tilda@latest/terms.js"></script>
```

## `window.initTerms(customConfig)` {#init-terms}

Запускает обработку соглашений. Конфиг может быть объектом с именованными элементами или массивом.

### Стандартный вызов

```js
window.initTerms();
```

Без аргумента функция использует, по приоритету: непустой `window.termsConfig`, затем `window.termsConsts`, затем встроенный default config.

### Полный вызов: объект

```js
window.initTerms({
  terms: {
    url: 'https://legal.skyeng.ru/doc/describe/2068',
    textToFind: 'персональных данных',
    fallbackId: '3981',
    fallbackLink: 'https://example.com/terms-fallback.pdf'
  },
  adv: {
    url: 'https://legal.skyeng.ru/doc/describe/2066',
    textToFind: 'рекламы',
    fallbackId: '3982',
    fallbackLink: 'https://example.com/adv-fallback.pdf'
  }
});
```

### Полный вызов: массив

```js
window.initTerms([
  {
    key: 'terms',
    url: 'https://legal.skyeng.ru/doc/describe/2068',
    textToFind: 'персональных данных',
    fallbackId: '3981',
    fallbackLink: 'https://example.com/terms-fallback.pdf'
  }
]);
```

### Аргументы `customConfig`

| Аргумент/поле | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `customConfig` | object/array | global/default config | Полный набор документов для текущей страницы. Пустой `{}`/`[]` считается отсутствующим и включает defaults. |
| `item.key` | string | ключ объекта / `item_N` | Внутренний ID соглашения. В объектной форме берётся имя свойства; в массиве можно задать явно. |
| `item.url` | string | `''` | API URL legal document description. По нему запрашиваются актуальные `versionId` и `link`. |
| `item.textToFind` | string | `''` | Фрагмент текста `.t-checkbox__labeltext`, по которому определяется нужный checkbox и место вставки ссылки. |
| `item.fallbackId` | string/number | `''` | Version ID на случай timeout/ошибки legal API. |
| `item.fallbackLink` | string | `''` | PDF/link fallback на случай недоступности API. |

Функция ничего не возвращает. Она запускает fetch каждого документа, DOM observer и последующую обработку форм.

### Глобальный конфиг `window.termsConfig`

Можно задать конфиг до вызова:

```js
window.termsConfig = {
  terms: {
    url: 'https://legal.skyeng.ru/doc/describe/2068',
    textToFind: 'персональных данных',
    fallbackId: '3981',
    fallbackLink: 'https://example.com/terms.pdf'
  }
};

window.initTerms();
```

## `window.debugTerms(state)` {#debug-terms}

Включает/выключает debug logs `terms.js` через глобальный `window.DEBUG_TERMS`.

### Стандартный вызов

```js
window.debugTerms(true);
```

### Полный вызов

```js
window.debugTerms(false);
```

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `state` | any | — | Приводится к boolean через `!!state` и записывается в `window.DEBUG_TERMS`. |

Функция всегда пишет в console состояние `Logs ON/OFF`. Внутренние подробные логи выводятся только при `DEBUG_TERMS === true`.

## Встроенные defaults {#terms-defaults}

`window.termsConsts` содержит два стандартных элемента: `terms` для согласия на обработку персональных данных и `adv` для рекламы. Если перед публикацией legal URL/fallback версии меняются, их нужно синхронно обновлять в `terms.js` или переопределять через `window.termsConfig`.
