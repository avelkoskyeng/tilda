---
layout: default
title: CJM и продукты
nav_order: 6
---
# CJM и продукты

CJM-модуль работает с `window.easyPaymentFlow` и продуктовым каталогом `window.cp_tpl.cjm.products`.

Главная задача модуля — понять, какой продукт выбран на лендинге, передать его в easyPaymentFlow и при необходимости заполнить hidden-поля формы.

## Подготовка страницы

На странице должен быть виджет:

```html
<cism-easy-payment-flow-integration locale="ru"></cism-easy-payment-flow-integration>
```

И должен быть загружен скрипт, который создаёт `window.easyPaymentFlow`.

## Структура продукта

```js
{
  brand: 'skyeng',
  label: 'Английский',
  selectValues: ['Английский', 'english'],
  id: 'adult_english_not_native_speaker_premium',
  selectedStk: 'english_adult_not_native_speaker_premium'
}
```

Для kit-продуктов:

```js
{
  brand: 'skysmart',
  label: '5 класс',
  selectValues: ['Домашний лицей 5-11 класс'],
  id: 'kid_skysmart_homeschooling_5_grade',
  productKitCode: 'skysmart_homeschooling_5_grade',
  kitTariffUuid: '6e84a51e-181d-4515-b70c-4ee834120730'
}
```

### Поля продукта

| Поле | Тип | Обязательное | Описание |
|---|---:|---:|---|
| `id` | string | да | Уникальный ID CJM-конфигурации. |
| `label` | string | желательно | Название продукта для easyPaymentFlow. |
| `brand` | string | нет | Используется для поиска по `data-cp-brand`. |
| `selectValues` | string[] | нет | Значения/лейблы select, по которым можно найти продукт. |
| `selectedStk` | string | для STK-продуктов | Передаётся в easyPaymentFlow как `selectedStk`. |
| `productKitCode` | string | для kit-продуктов | Передаётся в easyPaymentFlow. Может повторяться. |
| `kitTariffUuid` | string | для kit-продуктов | Уточняет тариф kit-продукта. |

### Важные правила

- `id` должен быть уникальным.
- `productKitCode` может повторяться, если разные `kitTariffUuid`.
- Если у нескольких продуктов одинаковые `brand + selectValues`, нужно уточнять продукт через `cjmProductId` или `productIdMap`.
- Скрипт не выбирает первый продукт молча, если найдено несколько кандидатов.

## Приоритет источников продуктов

CJM ищет продукты каскадом:

1. `products` из текущего `window.cp_tpl.cjm.init({ products: [...] })`.
2. `pageProducts`, добавленные через `window.cp_tpl.cjm.addProducts(...)`.
3. Дефолтный каталог `window.cp_tpl.cjm.products`.

Если в более приоритетном источнике найден один подходящий продукт, нижние источники уже не проверяются.

## Как выбирается продукт

Приоритет резолва:

1. `data-cp-product-id` на option/select/обёртке.
2. Hidden/input поле формы: `cjmProductId`, `productConfigId`, `cpProductId` или кастомное имя из `productIdFieldName`.
3. `productIdMap` / `productIdMaps` из `cjm.init`.
4. `brand + selectValues`, если найден ровно один кандидат.
5. `selectValues` без brand, если найден ровно один кандидат.
6. Если найдено несколько кандидатов — `console.error`, продукт не выбирается.

## Один продукт на странице

Самый надёжный способ — hidden-поле `cjmProductId`.

```js
window.cp_tpl.hiddenFields({
  cjmProductId: 'adult_english_not_native_speaker_premium'
});

window.cp_tpl.cjm.init();
```

## Несколько продуктов через select

```js
window.cp_tpl.cjm.init({
  productIdMap: {
    'Английский': 'adult_english_not_native_speaker_premium',
    'Французский': 'adult_french_not_native_speaker_premium'
  }
});
```

`productIdMap` сам обновит hidden-поле `cjmProductId` в текущей форме.

Значения map можно писать строкой:

```js
productIdMap: {
  'Английский': 'adult_english_not_native_speaker_premium'
}
```

или объектом:

```js
productIdMap: {
  'Английский': {
    productId: 'adult_english_not_native_speaker_premium'
  }
}
```

Также поддерживаются ключи по `select.value`, тексту выбранного option и нормализованным значениям.

## Несколько разных select

```js
window.cp_tpl.cjm.init({
  productIdMaps: [
    {
      selectSelector: 'select[name="subject"]',
      map: {
        'Английский': 'adult_english_not_native_speaker_premium',
        'Французский': 'adult_french_not_native_speaker_premium'
      }
    },
    {
      selectSelector: 'select[name="grade"]',
      map: {
        '5 класс': 'kid_skysmart_homeschooling_5_grade',
        '6 класс': 'kid_skysmart_homeschooling_6_grade'
      }
    }
  ]
});
```

Вместо `map` можно использовать `values`.

## `window.cp_tpl.cjm.init(config)`

Главный метод инициализации CJM.

```js
window.cp_tpl.cjm.init({
  products: [],
  productIdMap: {},
  buttons: []
});
```

### Параметры config

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `products` | array | `[]` | Кастомные продукты страницы. Имеют высший приоритет. |
| `authPrefix` | string | `auth` | Prefix имени select для auth-режима. |
| `anonymousPrefix` | string | `unauth` | Prefix имени select для anonymous-режима. |
| `selectSelector` | string | — | Принудительно обрабатывать select по селектору. |
| `scanSelector` | string | `select` | Какие select просканировать при инициализации. |
| `initCurrentValues` | boolean | `true` | Обработать текущие значения select при старте. |
| `createHiddenFields` | boolean | `true` | Создавать hidden-поля `serviceTypeKey`, `productKitCode`, `tariffUuid`, `cjmProductId`. |
| `extraParams` | object | — | Доп. параметры для `utmMarks`. |
| `comment` | string | — | Комментарий для consultation button. |
| `productIdFieldName` | string | `cjmProductId` | Кастомное имя hidden-поля с product ID. |
| `productIdMap` | object | — | Быстрая карта `select value -> product id`. |
| `productIdMaps` | array | — | Несколько карт для разных select. |
| `resolveDelay` | number | `0` | Задержка перед резолвом после `change`, чтобы другие обработчики успели обновить hidden-поля. |
| `buttons` | array | — | Явные CJM-кнопки. |
| `buttonSelector` | string | data-селекторы | Селектор data-кнопок для автосканирования. |
| `scanButtons` | boolean | `true` | Сканировать data-кнопки. |
| `getAuthButtonSelector` | function | — | Функция получения селектора auth-кнопки. |
| `onFillForm` | function | — | Колбэк после заполнения hidden-полей формы. |

### Важный нюанс

`cjm.init` желательно вызывать один раз на странице с полным конфигом. Внутренний `change`-обработчик биндуется один раз.

## Режимы select

CJM понимает два режима:

| Режим | Что делает |
|---|---|
| `anonymous` / `unauth` | Заполняет hidden-поля формы: `serviceTypeKey`, `productKitCode`, `tariffUuid`, `cjmProductId`. |
| `auth` / `authorized` | Инициализирует consultation button для авторизованного сценария. |

Режим определяется так:

1. `data-cp-mode` на select или родителях.
2. Имя select начинается с `authPrefix`.
3. Имя select начинается с `anonymousPrefix`.
4. Если есть `brand` или `productId`, режим считается `anonymous`.

## `window.cp_tpl.cjm.addProducts(products, config)`

Добавляет продукты страницы в `cp.cjm.pageProducts`.

```js
window.cp_tpl.cjm.addProducts([
  {
    brand: 'skyeng',
    label: 'Английский',
    selectValues: ['Английский'],
    id: 'adult_english_course_elementary',
    selectedStk: 'english_adult_not_native_speaker_course_elementary'
  }
]);
```

### Параметры config

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `alertOnDuplicateIds` | boolean | `false` | Показывать `alert`, если найдены дубли `id`. |

Метод пишет `console.error`, если находит дублирующиеся `id`.

## `window.cp_tpl.cjm.validateProducts(products, config)`

Только проверяет продукты на дубли `id`, не добавляя их в каталог.

```js
window.cp_tpl.cjm.validateProducts(products, {
  alertOnDuplicateIds: true
});
```

## `window.cp_tpl.cjm.initButton(buttonConfig)`

Инициализирует одну CJM-кнопку.

```js
window.cp_tpl.cjm.initButton({
  selector: '.consultation-btn',
  productId: 'adult_english_not_native_speaker_premium'
});
```

### buttonConfig

| Параметр | Тип | Описание |
|---|---:|---|
| `selector` | string | CSS-селектор кнопки. |
| `product` | object | Продукт напрямую. |
| `productId` | string | ID продукта. |
| `brand` | string | Brand для fallback-поиска. |
| `value` / `selectedValue` | string | Значение для fallback-поиска. |
| `label` / `selectedLabel` | string | Лейбл для fallback-поиска. |
| `products` | array | Кастомный каталог для кнопки. |
| `extraParams` | object | Доп. UTM-параметры. |
| `comment` | string | Комментарий. |
| `analyticsData` | object | Analytics data для easyPaymentFlow. |
| `blockName` | string | Имя блока. |
| `productIdFieldName` | string | Кастомное имя поля product ID. |

## Data-кнопки

Если `scanButtons !== false`, библиотека ищет кнопки по селектору:

```txt
[data-cp-cjm-button],
[data-cp-product-id][data-cp-button],
[data-cp-product-id].cp-cjm-button
```

Пример:

```html
<a class="cp-cjm-button" data-cp-product-id="adult_english_not_native_speaker_premium">
  Записаться
</a>
```

## `window.cp_tpl.cjm.resolveProduct(select, configOrProducts)`

Публичная функция для отладки резолва продукта по select.

```js
var product = window.cp_tpl.cjm.resolveProduct(
  document.querySelector('select[name="subject"]'),
  {
    products: customProducts
  }
);

console.log(product);
```

## `window.cp_tpl.cjm.getProductConfigurations(configOrProducts)`

Возвращает массив конфигураций для `easyPaymentFlow.initProductConfigurations`.

```js
var configs = window.cp_tpl.cjm.getProductConfigurations({
  products: customProducts
});
```

Дедупликация идёт по `id`, с приоритетом источников: `products` из `cjm.init`, затем `pageProducts`, затем дефолтный каталог.
