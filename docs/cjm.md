---
title: CJM и продукты
---

# CJM и продукты

CJM-модуль работает с `window.easyPaymentFlow`.

Перед использованием на странице должен быть виджет:

```html
<cism-easy-payment-flow-integration locale="ru"></cism-easy-payment-flow-integration>
```

## Главные методы

```js
window.cp_tpl.cjm.init(config);
window.cp_tpl.cjm.initButton(config);
window.cp_tpl.cjm.addProducts(products, config);
window.cp_tpl.cjm.validateProducts(products, config);
window.cp_tpl.cjm.resolveProduct(select, customProducts);
window.cp_tpl.cjm.getProductConfigurations(customProducts);
```

## Продукт

```js
{
  brand: 'skyeng',
  label: 'Английский',
  selectValues: ['Английский', 'english'],
  id: 'adult_english_not_native_speaker_premium',
  selectedStk: 'english_adult_not_native_speaker_premium'
}
```

Для kit-продукта:

```js
{
  brand: 'skysmart',
  label: '5 класс',
  selectValues: ['5 класс'],
  id: 'kid_skysmart_homeschooling_5_grade',
  productKitCode: 'skysmart_homeschooling_5_grade',
  kitTariffUuid: '6e84a51e-181d-4515-b70c-4ee834120730'
}
```

## Важные правила

- `id` должен быть уникальным.
- `productKitCode` может повторяться.
- Одинаковый `selectValues` внутри одного бренда допустим, но только если есть уточнение через `cjmProductId`, `productIdMap` или кастомный продукт страницы.
- Скрипт не должен молча выбирать первый продукт, если найдено несколько кандидатов.

## Приоритет выбора продукта

Рекомендуемая логика v8:

```txt
1. data-cp-product-id / data-cp-cjm-product-id
2. input[name="cjmProductId"] в текущей форме
3. productIdMap / productIdMaps
4. products из текущего cjm.init(...)
5. pageProducts из cjm.addProducts(...)
6. дефолтные cp.cjm.products
```

Если в конкретном источнике найден ровно один продукт — он используется. Если найдено несколько — в консоли будет ошибка с подсказкой уточнить продукт.

## Один продукт на форме

```js
window.cp_tpl.hiddenFields({
  cjmProductId: 'adult_english_not_native_speaker_premium'
});

window.cp_tpl.cjm.init();
```

## Несколько продуктов через один select

```js
window.cp_tpl.cjm.init({
  productIdMap: {
    'Английский': 'adult_english_not_native_speaker_premium',
    'Французский': 'adult_french_not_native_speaker_premium',
    'Немецкий': 'adult_german_not_native_speaker_premium'
  }
});
```

Библиотека сама создаёт/обновляет hidden:

```txt
cjmProductId
```

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

## Кастомные продукты на странице

Если на странице передан кастомный конфиг, он имеет приоритет над дефолтным каталогом.

```js
window.cp_tpl.cjm.init({
  products: [
    {
      brand: 'skyeng',
      label: 'Английский',
      selectValues: ['Английский', 'english'],
      id: 'adult_english_course_elementary',
      selectedStk: 'english_adult_not_native_speaker_course_elementary'
    }
  ]
});
```

Если в `products` найден ровно один подходящий продукт, `productIdMap` не нужен.

## `window.cp_tpl.cjm.addProducts(products, config)`

Добавляет продукты страницы в `cp_tpl.cjm.pageProducts`.

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

### Проверка дублей

```js
window.cp_tpl.cjm.addProducts(products, {
  alertOnDuplicateIds: true
});
```

## `window.cp_tpl.cjm.init(config)`

### Основной конфиг

| Параметр | Тип | Что делает |
|---|---:|---|
| `products` | array | Кастомные продукты текущей страницы |
| `productIdMap` | object | Мэпинг `select.value -> product.id` |
| `productIdMaps` | array | Несколько мэпингов для разных select |
| `authPrefix` | string | Префикс auth-select |
| `anonymousPrefix` | string | Префикс anonymous-select |
| `selectSelector` | string | Явный селектор select |
| `scanSelector` | string | Какие select просканировать при init |
| `initCurrentValues` | boolean | Инициализировать текущие значения select |
| `createHiddenFields` | boolean | Создавать hidden-поля для anonymous формы |
| `extraParams` | object | Доп. параметры для `utmMarks` |
| `comment` | string | Комментарий CJM |
| `buttons` | array | Ручные кнопки |
| `buttonSelector` | string | Data-кнопки |
| `scanButtons` | boolean | Автоискать data-кнопки |
| `resolveDelay` | number | Задержка резолва после `change` |

## Когда нужен `productIdMap`

`productIdMap` нужен, если в одной форме одно и то же значение select может означать разные продукты или если нужно явно связать select-value с конкретным `id`.

Если на странице достаточно кастомного `products`, `productIdMap` можно не задавать.
