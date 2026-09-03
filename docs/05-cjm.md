---
layout: default
title: CJM и продукты
nav_order: 6
search_keywords: >-
  cjm easyPaymentFlow product products продукт каталог cp_tpl product mapping
search_aliases:
  cjm-init: >-
    cjm init easyPaymentFlow инициализация cjm продукты productIdMap productIdMaps select brand selectedStk
    productKitCode kitTariffUuid tariffUuid serviceTypeKey auth anonymous unauth
  cjm-add-products: >-
    addProducts add products добавить продукты каталог pageProducts cjm
  cjm-validate-products: >-
    validateProducts validate products проверить продукты валидация каталога дубли product id
  cjm-init-button: >-
    initButton init button кнопка консультации consultation button productId data-cp-product-id data-cp-brand
  cjm-data-buttons: >-
    data кнопки data button data-cp-product-id data-cp-brand cjm кнопка консультации без js конфига
  cjm-resolve-product: >-
    resolveProduct resolve product найти продукт определить продукт select brand value label productId
  cjm-product-configurations: >-
    getProductConfigurations product configurations получить конфигурации продуктов конфиги cjm
---
# CJM и продукты

CJM-модуль связывает Tilda select/кнопки с `window.easyPaymentFlow`, выбирает продукт из каталога и при необходимости заполняет hidden-поля формы.

## Что должно быть на странице

```html
<cism-easy-payment-flow-integration locale="ru"></cism-easy-payment-flow-integration>
```

Также должен быть загружен скрипт, который создаёт `window.easyPaymentFlow` с методами `onReady`, `initProductConfigurations` и `initConsultationButton`.

## Структура продукта

### STK-продукт

```js
{
  brand: 'skyeng',
  label: 'Английский',
  selectValues: ['Английский', 'english'],
  id: 'adult_english_not_native_speaker_premium',
  selectedStk: 'english_adult_not_native_speaker_premium'
}
```

### Kit-продукт

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

| Поле | Тип | Зачем нужно |
|---|---|---|
| `id` | string | Уникальный ID конфигурации. По нему CJM делает самый точный resolve. |
| `label` | string | Название для `easyPaymentFlow`; также используется как fallback при поиске по значению select. |
| `brand` | string | Дополнительное ограничение при resolve через `data-cp-brand`. |
| `selectValues` | string[] | Возможные `select.value` и тексты option, соответствующие продукту. |
| `selectedStk` | string | STK для обычного продукта; попадает в `serviceTypeKey`. |
| `productKitCode` | string | Код product kit; попадает в одноимённый hidden input. |
| `kitTariffUuid` | string | UUID тарифа kit-продукта; попадает в `tariffUuid`. |

`id` должен быть уникальным. Если несколько продуктов совпали по `brand + selectValues`, библиотека намеренно не выбирает первый и пишет `console.error`.

## Приоритет источников продуктов

1. `products` из текущего `window.cp_tpl.cjm.init({ products: [...] })` / аргумента helper-а.
2. `window.cp_tpl.cjm.pageProducts`, добавленные через `window.cp_tpl.cjm.addProducts(...)`.
3. Дефолтный `window.cp_tpl.cjm.products`.

## Как выбирается product ID для select

1. Для `cjm.init()` перед resolve применяется `productIdMap/productIdMaps`; найденный ID записывается в поле формы как динамическое CJM-значение.
2. `data-cp-product-id` на выбранном `<option>`, самом `<select>` или ближайшем родителе.
3. Динамическое/явное поле формы `productIdFieldName`, затем `cjmProductId`, `productConfigId`, `cpProductId`. Статический `cjmProductId`, созданный через `hiddenFields()`, как источник продукта игнорируется.
4. Если ID нет — поиск по `brand + select.value/label`.

Автоматически записанный CJM ID помечается `data-cp-tpl-cjm-product-source`, чтобы следующий resolve не принимал собственное старое значение за ручной выбор пользователя. Значения из `productIdMap` сохраняют отдельную метку источника и остаются валидными для текущего resolve.

### Какой сценарий использовать

**Кнопка без выбора предмета:** задавай продукт рядом с кнопкой через `cjm.initButton({ productId })`. Форма рядом не требуется.

```js
window.cp_tpl.cjm.initButton({
  selector: '.auth-btn',
  productId: 'kid_mini_course_kids_social_science'
});
```

**Форма с выбором предмета:** не задавай статический `cjmProductId` через `hiddenFields()`. Используй `productIdMap`, `productIdMaps`, `data-cp-product-id` или resolve по значению select. CJM сам обновит служебное поле формы после выбора продукта.

## `window.cp_tpl.cjm.init(config)` {#cjm-init}

Главная инициализация: регистрирует product configurations, слушает `change` у select, обрабатывает текущие значения и настраивает кнопки.

### Стандартный вызов

```js
window.cp_tpl.cjm.init();
```

Этот вызов подходит для динамического CJM-флоу с select. Если продукт у кнопки статичный и выбора предмета нет, используй [`cjm.initButton({ productId })`](#cjm-init-button).

### Полный вызов

```js
window.cp_tpl.cjm.init({
  products: [
    {
      brand: 'skyeng',
      label: 'Английский',
      selectValues: ['Английский', 'english'],
      id: 'adult_english_not_native_speaker_premium',
      selectedStk: 'english_adult_not_native_speaker_premium'
    }
  ],

  authPrefix: 'auth',
  anonymousPrefix: 'unauth',
  selectSelector: 'select[data-use-cjm]',
  scanSelector: 'select',
  initCurrentValues: true,
  createHiddenFields: true,

  extraParams: {
    campaignType: 'landing'
  },
  comment: 'landing-comment',
  productIdFieldName: 'cjmProductId',

  productIdMap: {
    'Английский': 'adult_english_not_native_speaker_premium'
  },
  productIdMaps: [
    {
      selectSelector: 'select[name="grade"]',
      selector: 'select[name="grade"]',
      map: {
        '5 класс': 'kid_skysmart_homeschooling_5_grade'
      },
      values: {
        // Alias для map; используется, если map не задан.
      }
    }
  ],

  resolveDelay: 0,

  buttons: [
    {
      selector: '.consultation-btn',
      product: {
        brand: 'skyeng',
        label: 'Английский',
        selectValues: ['Английский', 'english'],
        id: 'adult_english_not_native_speaker_premium',
        selectedStk: 'english_adult_not_native_speaker_premium'
      },
      productId: 'adult_english_not_native_speaker_premium',
      brand: 'skyeng',
      value: 'Английский',
      selectedValue: 'Английский',
      label: 'Английский',
      selectedLabel: 'Английский',
      products: [],
      extraParams: {},
      comment: 'button-comment',
      analyticsData: { blockName: 'hero' },
      blockName: 'hero',
      productIdFieldName: 'cjmProductId'
    }
  ],

  buttonSelector: '[data-cp-cjm-button]',
  scanButtons: true,

  getAuthButtonSelector: function (select, product) {
    return '.' + select.name + '-btn';
  },

  onFillForm: function (form, product, select) {
    console.log(form, product, select);
  },

  alertOnDuplicateIds: false
});
```

`selector` внутри `productIdMaps` — alias для `selectSelector`; `values` — alias для `map`. В реальном конфиге лучше использовать по одному варианту alias, чтобы не создавать неоднозначность.

### Аргументы `config`

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `products` | array | `[]` | Кастомный каталог текущей страницы с самым высоким приоритетом. |
| `authPrefix` | string | `auth` | Если `select.name` начинается с этого prefix, select работает в auth-режиме и инициализирует consultation button. |
| `anonymousPrefix` | string | `unauth` | Prefix anonymous-select, который заполняет hidden-поля формы. |
| `selectSelector` | string | — | Принудительно считать совпавший `<select>` CJM-select, даже если prefix/data mode отсутствует. |
| `scanSelector` | string | `select` | Какие select обработать при старте, если `initCurrentValues !== false`. |
| `initCurrentValues` | boolean | `true` | Сразу обработать уже выбранные значения, а не ждать первого `change`. |
| `createHiddenFields` | boolean | `true` | В anonymous-режиме создавать недостающие `serviceTypeKey`, `productKitCode`, `tariffUuid`, `cjmProductId`. При `false` обновляются только существующие inputs. |
| `extraParams` | object | — | Добавляется в UTM marks, передаваемые consultation button. |
| `comment` | string | — | Комментарий для consultation button. Приоритет: явный comment → `extraParams.comment` → hidden `comment`. |
| `productIdFieldName` | string | `cjmProductId` | Имя кастомного hidden input для product ID. При чтении также проверяются стандартные aliases. |
| `productIdMap` | object | — | Быстрая общая карта выбранного value/label → product ID. |
| `productIdMaps` | array | — | Несколько карт, опционально ограниченных конкретным select через `selectSelector/selector`. |
| `resolveDelay` | number | `0` | Задержка в ms после `change` перед resolve. Нужна, если другой обработчик сначала обновляет hidden fields. |
| `buttons` | array | — | Явные конфиги consultation buttons; каждый элемент может быть строкой-селектором или объектом как у `cjm.initButton`. |
| `buttonSelector` | string | три data-селектора | Какие data-кнопки автоматически сканировать. |
| `scanButtons` | boolean | `true` | Включить автоскан data-кнопок. |
| `getAuthButtonSelector` | function | `'.' + select.name + '-btn'` | Позволяет вычислить selector auth-кнопки по `(select, product)`. |
| `onFillForm` | function | — | Callback `(form, product, select)` после заполнения anonymous hidden fields. |
| `alertOnDuplicateIds` | boolean | `false` | Помимо `console.error` показывает `window.alert` при дублирующихся product IDs в `products`. |

### `productIdMap` и `productIdMaps`

Значение карты может быть строкой либо объектом с `productId`, `id` или `value`:

```js
window.cp_tpl.cjm.init({
  productIdMap: {
    'Английский': 'adult_english_not_native_speaker_premium',
    'Французский': {
      productId: 'adult_french_not_native_speaker_premium'
    }
  }
});
```

Ключи проверяются по `select.value`, тексту selected option и их нормализованным lowercase-вариантам.

### Режимы select

Режим определяется по `data-cp-mode` (`auth/authorized/anonymous/unauth`), prefix имени select, либо наличию `brand/productId`. Anonymous-select заполняет форму; auth-select вызывает `easyPaymentFlow.initConsultationButton`.

## `window.cp_tpl.cjm.addProducts(products, config)` {#cjm-add-products}

Добавляет продукты в `window.cp_tpl.cjm.pageProducts`.

### Стандартный вызов

```js
window.cp_tpl.cjm.addProducts([
  {
    id: 'adult_english_course_elementary',
    label: 'Английский',
    selectValues: ['Английский'],
    selectedStk: 'english_adult_not_native_speaker_course_elementary'
  }
]);
```

### Полный вызов

```js
window.cp_tpl.cjm.addProducts(
  [
    {
      brand: 'skyeng',
      label: 'Английский',
      selectValues: ['Английский'],
      id: 'adult_english_course_elementary',
      selectedStk: 'english_adult_not_native_speaker_course_elementary',
      productKitCode: '',
      kitTariffUuid: ''
    }
  ],
  {
    alertOnDuplicateIds: false
  }
);
```

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `products` | array | `[]` | Продукты, добавляемые в page-level каталог. |
| `config.alertOnDuplicateIds` | boolean | `false` | Показывать alert при дубликатах `id`; `console.error` пишется всегда. |

Функция ничего не возвращает.

## `window.cp_tpl.cjm.validateProducts(products, config)` {#cjm-validate-products}

Проверяет product IDs на дубли, но не добавляет продукты в каталог.

### Стандартный вызов

```js
window.cp_tpl.cjm.validateProducts(products);
```

### Полный вызов

```js
window.cp_tpl.cjm.validateProducts(products, {
  alertOnDuplicateIds: true
});
```

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `products` | array | `[]` | Проверяемый список. |
| `config.alertOnDuplicateIds` | boolean | `false` | Дополнительно показать alert. |

## `window.cp_tpl.cjm.initButton(buttonConfig)` {#cjm-init-button}

Инициализирует одну consultation button после готовности `easyPaymentFlow`.

### Стандартный вызов

```js
window.cp_tpl.cjm.initButton({
  selector: '.consultation-btn',
  productId: 'adult_english_not_native_speaker_premium'
});
```

Для кнопки без выбора предмета это основной способ конфигурации продукта. Не переноси этот `productId` в `hiddenFields({ cjmProductId: ... })`: такая кнопка может быть вне формы.

Также допустима строка: `window.cp_tpl.cjm.initButton('.consultation-btn')`, если product можно однозначно получить из `data-cp-product-id` или из динамического CJM-поля формы. Для статичного продукта предпочтителен явный `productId` в конфиге кнопки.

### Полный вызов

```js
window.cp_tpl.cjm.initButton({
  selector: '.consultation-btn',
  product: {
    id: 'adult_english_not_native_speaker_premium',
    label: 'Английский',
    selectedStk: 'english_adult_not_native_speaker_premium'
  },
  productId: 'adult_english_not_native_speaker_premium',
  brand: 'skyeng',
  value: 'Английский',
  selectedValue: 'Английский',
  label: 'Английский',
  selectedLabel: 'Английский',
  products: [],
  extraParams: { sourceBlock: 'hero' },
  comment: 'hero-button',
  analyticsData: { blockName: 'hero' },
  blockName: 'hero',
  productIdFieldName: 'cjmProductId'
});
```

`product` имеет наивысший приоритет. В контексте выбора `value` и `selectedValue` — aliases, как и `label`/`selectedLabel`.

### Аргументы `buttonConfig`

| Аргумент | Тип | Что делает |
|---|---|---|
| `selector` | string | CSS-селектор кнопки; обязателен для реальной инициализации. |
| `product` | object | Готовый product object без resolve. |
| `productId` | string | Точный ID для resolve. |
| `brand` | string | Ограничивает fallback-поиск по value/label. |
| `value` / `selectedValue` | string | Значение для fallback-поиска продукта. |
| `label` / `selectedLabel` | string | Человекочитаемый label для fallback-поиска. |
| `products` | array | Кастомные продукты с высшим приоритетом только для этой кнопки. |
| `extraParams` | object | Доп. параметры для UTM marks. |
| `comment` | string | Комментарий для consultation flow. |
| `analyticsData` | object | Передаётся в `easyPaymentFlow.initConsultationButton`. |
| `blockName` | string | Используется для дефолтного `analyticsData.blockName`, если `analyticsData` не передан. |
| `productIdFieldName` | string | Кастомное имя product ID поля при чтении контекста ближайшей формы. |

## Data-кнопки {#cjm-data-buttons}

По умолчанию `cjm.init()` ищет:

```txt
[data-cp-cjm-button],
[data-cp-product-id][data-cp-button],
[data-cp-product-id].cp-cjm-button
```

Поддерживаемые data attrs: `data-cp-product-id`, `data-cp-brand`, `data-cp-value`, `data-cp-product-value`, `data-cp-label`, `data-cp-block-name`, `data-cp-comment`.

```html
<a
  class="cp-cjm-button"
  data-cp-product-id="adult_english_not_native_speaker_premium"
  data-cp-block-name="hero"
  data-cp-comment="hero-button"
>
  Записаться
</a>
```

## `window.cp_tpl.cjm.resolveProduct(select, configOrProducts)` {#cjm-resolve-product}

Публичный helper для ручного resolve продукта по конкретному `<select>`.

### Стандартный вызов

```js
var product = window.cp_tpl.cjm.resolveProduct(
  document.querySelector('select[name="subject"]')
);
```

### Полный вызов: config object

```js
var product = window.cp_tpl.cjm.resolveProduct(
  document.querySelector('select[name="subject"]'),
  {
    products: customProducts,
    productIdFieldName: 'cjmProductId'
  }
);
```

### Альтернативный полный вызов: массив

```js
var product = window.cp_tpl.cjm.resolveProduct(
  document.querySelector('select[name="subject"]'),
  customProducts
);
```

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `select` | `HTMLSelectElement` | — | Select, из которого читаются option, value, label, data attrs и ближайшая форма. |
| `configOrProducts` | object/array | — | Массив трактуется как custom products. Объект поддерживает `products` и `productIdFieldName`; затем используются `pageProducts` и дефолтный каталог. |

Важно: `resolveProduct()` сам не применяет `productIdMap/productIdMaps`; эта предварительная логика выполняется внутри `cjm.init()` при обработке select.

Возвращает product object либо `null`.

## `window.cp_tpl.cjm.getProductConfigurations(configOrProducts)` {#cjm-product-configurations}

Преобразует каталог в формат для `easyPaymentFlow.initProductConfigurations` и удаляет дубли по `id` с сохранением приоритета источников.

### Стандартный вызов

```js
var configurations = window.cp_tpl.cjm.getProductConfigurations();
```

### Полный вызов

```js
var configurations = window.cp_tpl.cjm.getProductConfigurations({
  products: customProducts
});

// Или напрямую массив:
var same = window.cp_tpl.cjm.getProductConfigurations(customProducts);
```

| Аргумент | Тип | Что делает |
|---|---|---|
| `configOrProducts` | object/array | Массив задаёт custom products; объект читает поле `products`. После него добавляются `pageProducts` и дефолтный каталог. |

Возвращаемый элемент содержит только поддерживаемые flow-поля:

```js
{
  id: product.id,
  label: product.label,
  selectedStk: product.selectedStk,       // если задан
  productKitCode: product.productKitCode, // если задан
  kitTariffUuid: product.kitTariffUuid    // если задан
}
```
