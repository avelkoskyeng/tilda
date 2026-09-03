---
layout: default
title: Hidden fields и UTM
nav_order: 5
search_keywords: >-
  hidden fields utm tracking параметры формы query string cp_tpl
search_aliases:
  hidden-fields: >-
    hiddenFields hidden fields hidden input скрытые поля создать скрытые поля promo promocode
    marketingExperiments comment overwrite force apply destroy
  hidden-fields-get-values: >-
    hiddenFields getValues get values получить скрытые поля значения hidden values
  utm: >-
    utm query параметры url search params utmParameters tracking метки собрать utm
  global-build-utm-marks: >-
    buildUtmMarks global глобальный build utm marks собрать utmMarks
  utm-apply-params: >-
    applyParams apply params добавить параметры URLSearchParams merge query
  utm-update-url: >-
    updateURLParameters update url parameters обновить url параметры query string
  utm-build-marks: >-
    cp_tpl utm buildUtmMarks build marks собрать utm строку utmMarks
  utm-hidden-values: >-
    getHiddenFieldsForUtmMarks hidden fields utm получить hidden значения для utm
---
# Hidden fields и UTM

Этот модуль создаёт скрытые поля в Tilda-формах и собирает UTM/query string для интеграций.

## `window.cp_tpl.hiddenFields(fields, config)` {#hidden-fields}

Создаёт hidden inputs во всех подходящих формах, запоминает стартовые значения и при необходимости следит за новыми формами через `MutationObserver`.

### Стандартный вызов

```js
window.cp_tpl.hiddenFields({
  promoCode: 'SALE',
  comment: 'landing-comment'
});
```

### Полный вызов

```js
var hidden = window.cp_tpl.hiddenFields(
  {
    promoCode: 'SALE',
    marketing_experiments: 'experiment-a',
    comment: 'landing-comment',
    serviceTypeKey: 'english_adult_not_native_speaker_premium',
    productKitCode: '',
    tariffUuid: ''
  },
  {
    formSelector: 'form',
    boxSelector: '.t-form__inputsbox',
    observe: true,
    overwriteExisting: false,
    force: false,
    utmMarksMap: {
      serviceTypeKey: 'serviceTypeKey'
    }
  }
);
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `fields` | object | `{}` | Ключ становится `input.name`, значение — стартовым `input.value`. Можно передавать любые hidden-поля. |
| `config.formSelector` | string | `form` | Где искать формы. |
| `config.boxSelector` | string | `.t-form__inputsbox` | В какой контейнер формы добавлять hidden inputs. |
| `config.observe` | boolean | `true` | Следить за DOM и применять поля к формам, появившимся позже. Отключай на полностью статичных страницах, если observer не нужен. |
| `config.overwriteExisting` | boolean | `false` | Если `true`, каждый `apply()` принудительно ставит значение из `fields`, даже если другой скрипт уже его изменил. |
| `config.force` | boolean | `false` | Alias для `overwriteExisting`. |
| `config.utmMarksMap` | object | стандартная карта | Расширяет mapping `hidden field -> UTM param`, который использует `buildUtmMarks`. |

### `cjmProductId` не задаём через `hiddenFields`

`hiddenFields()` не является способом выбрать CJM-продукт. Для отдельной CJM-кнопки без выбора предмета указывай `productId` прямо в `window.cp_tpl.cjm.initButton(...)`; кнопка при этом не обязана находиться внутри формы.

Во флоу с выбором предмета продукт определяется динамически через CJM (`productIdMap`, `data-cp-product-id`, значение select и другие CJM-настройки). После resolve CJM сам может создать или обновить служебный `cjmProductId` в форме. Статическое значение, добавленное через `hiddenFields()`, CJM при выборе продукта игнорирует.

### Почему по умолчанию значения не перетираются

При первом применении библиотека ставит `data-cp-tpl-hidden-fields-inited="1"`. Повторный `apply()` не меняет такое поле, если не включён `overwriteExisting/force`. Это позволяет CJM, Televox или кастомному коду обновить hidden input позже и не получить откат к стартовому значению.

### `hidden.apply()` {#hidden-apply}

Повторно применяет набор `fields` к текущим формам.

Стандартный и полный вызов одинаковы — аргументов нет:

```js
hidden.apply();
```

При `overwriteExisting: false` уже инициализированные поля не перезаписываются; при `true` значения ставятся заново.

### `hidden.destroy()` {#hidden-destroy}

Отключает `MutationObserver`, созданный конкретным вызовом `hiddenFields()`.

Стандартный и полный вызов одинаковы — аргументов нет:

```js
hidden.destroy();
```

После `destroy()` ручной `hidden.apply()` продолжает работать.

## `window.cp_tpl.hiddenFields.getValues()` {#hidden-fields-get-values}

Возвращает текущие значения полей, когда-либо зарегистрированных через `hiddenFields`. Если поле есть в DOM, приоритет у актуального DOM-значения.

### Стандартный вызов

```js
var values = window.cp_tpl.hiddenFields.getValues();
console.log(values.comment);
```

### Полный вызов

```js
var values = window.cp_tpl.hiddenFields.getValues();
console.log(values);
```

Аргументов нет. Возвращает обычный объект `{ fieldName: value }`.

## Стандартный hidden → UTM mapping

| Hidden field | UTM/query параметр |
|---|---|
| `promoCode` | `promocode` |
| `promocode` | `promocode` |
| `promo` | `promocode` |
| `comment` | `comment` |
| `marketing_experiments` | `marketingExperiments` |
| `marketingExperiments` | `marketingExperiments` |

Дополнительный mapping добавляется через `hiddenFields(..., { utmMarksMap: {...} })`.

## `window.cp_tpl.utm(config)` {#utm}

Сохраняет набор параметров в `window.utmParameters`, при необходимости обновляет URL и создаёт глобальную функцию `window.buildUtmMarks`.

### Стандартный вызов

```js
window.cp_tpl.utm({
  parameters: {
    product: {
      value: 'type-skyeng_action|name-example',
      type: 'hard'
    }
  }
});
```

### Полный вызов

```js
var utm = window.cp_tpl.utm({
  parameters: {
    utm_source: {
      value: 'landing',
      type: 'soft'
    },
    product: {
      value: 'type-skyeng_action|name-example',
      type: 'hard'
    }
  },
  utmParameters: {
    // Alias для parameters; используется только если parameters не задан.
  },
  extraParams: {
    campaignType: 'promo'
  },
  updateUrl: true,
  exposeGlobals: true
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `parameters` | object | `{}` | Основной набор query-параметров. Значения могут быть простыми или `{ value, type }`. |
| `utmParameters` | object | `{}` | Alias для `parameters`; учитывается только если `parameters` отсутствует/falsy. |
| `extraParams` | object | `{}` | Дополнительные простые значения. Непустые ключи добавляются поверх `parameters`. |
| `updateUrl` | boolean | `true` | Применяет параметры к текущему URL через `history.replaceState`. |
| `exposeGlobals` | boolean | `true` | Создаёт `window.buildUtmMarks(extra, buildConfig)`. |

### Формат одного параметра

```js
{
  utm_source: 'landing',
  product: {
    value: 'type-skyeng_action|name-example',
    type: 'hard'
  }
}
```

`type: 'soft'` ставит значение только если параметра ещё нет. `type: 'hard'` всегда перезаписывает. Любой неизвестный `type` считается `soft`.

### Возвращает

`parameters` — итоговый merged object. Также возвращается функция `utm.buildUtmMarks(extra, buildConfig)`.

### `utm.buildUtmMarks(extra, buildConfig)` {#utm-instance-build-marks}

#### Стандартный вызов

```js
var marks = utm.buildUtmMarks({
  foo: 'bar'
});
```

#### Полный вызов

```js
var marks = utm.buildUtmMarks(
  {
    foo: { value: 'bar', type: 'hard' }
  },
  {
    includeHiddenFields: false
  }
);
```

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `extra` | object | `{}` | Дополнительные soft/hard параметры поверх текущих UTM. |
| `buildConfig.includeHiddenFields` | boolean | `true` | Управляет добавлением mapped hidden fields. |

Эта функция использует тот же внутренний builder, что `window.buildUtmMarks()`.

## `window.buildUtmMarks(extra, buildConfig)` {#global-build-utm-marks}

Создаётся `window.cp_tpl.utm()`, если `exposeGlobals !== false`. Собирает текущий `location.search`, `window.utmParameters`, mapped hidden fields и `extra`.

### Стандартный вызов

```js
var marks = window.buildUtmMarks({
  product: 'type-skyeng_action|name-example'
});
```

### Полный вызов

```js
var marks = window.buildUtmMarks(
  {
    product: {
      value: 'type-skyeng_action|name-example',
      type: 'hard'
    }
  },
  {
    includeHiddenFields: false
  }
);
```

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `extra` | object | `{}` | Параметры, применяемые последними; могут быть `soft/hard`. |
| `buildConfig.includeHiddenFields` | boolean | `true` | Включать mapped hidden fields из `hiddenFieldsState`. |

Возвращает строку без ведущего `?`, например `utm_source=landing&comment=test`.

## `window.cp_tpl.utm.applyParams(searchParams, parameters)` {#utm-apply-params}

Низкоуровневый helper, который применяет параметры к существующему `URLSearchParams`.

### Стандартный вызов

```js
var params = new URLSearchParams(location.search);
window.cp_tpl.utm.applyParams(params, {
  utm_source: 'landing'
});
```

### Полный вызов

```js
var params = new URLSearchParams('?utm_source=old');

window.cp_tpl.utm.applyParams(params, {
  utm_source: {
    value: 'new-source',
    type: 'hard'
  },
  utm_campaign: {
    value: 'summer',
    type: 'soft'
  }
});
```

| Аргумент | Тип | Что делает |
|---|---|---|
| `searchParams` | `URLSearchParams` | Объект изменяется in-place. |
| `parameters` | object | Набор простых или `{ value, type }` параметров. Пустые значения игнорируются. |

## `window.cp_tpl.utm.updateURLParameters(parameters)` {#utm-update-url}

Применяет параметры к текущему URL и делает `history.replaceState` без перезагрузки страницы.

### Стандартный вызов

```js
window.cp_tpl.utm.updateURLParameters({
  utm_source: 'landing'
});
```

### Полный вызов

```js
window.cp_tpl.utm.updateURLParameters({
  utm_source: { value: 'landing', type: 'hard' },
  utm_campaign: { value: 'summer', type: 'soft' }
});
```

| Аргумент | Тип | Что делает |
|---|---|---|
| `parameters` | object | Набор URL-параметров в том же формате, что у `utm()`: простое значение или `{ value, type }`. `soft` не перезаписывает существующий query parameter, `hard` перезаписывает. |

## `window.cp_tpl.utm.buildUtmMarks(parameters, config)` {#utm-build-marks}

Прямая публичная ссылка на внутренний builder. Отличается от `utm()` тем, что ничего не записывает в глобальные переменные и не обновляет URL.

### Стандартный вызов

```js
var marks = window.cp_tpl.utm.buildUtmMarks({
  extra: '1'
});
```

### Полный вызов

```js
var marks = window.cp_tpl.utm.buildUtmMarks(
  {
    extra: { value: '1', type: 'hard' }
  },
  {
    includeHiddenFields: true
  }
);
```

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `parameters` | object | `{}` | Дополнительные параметры, применяемые поверх текущего URL, глобальных UTM и hidden fields. |
| `config.includeHiddenFields` | boolean | `true` | Включать mapped hidden fields. |

## `window.cp_tpl.utm.getHiddenFieldsForUtmMarks()` {#utm-hidden-values}

Возвращает только те текущие hidden-поля, для которых есть mapping в `cp_tpl.hiddenFieldsState.utmMarksMap`.

### Стандартный вызов

```js
var mapped = window.cp_tpl.utm.getHiddenFieldsForUtmMarks();
```

### Полный вызов

```js
var mapped = window.cp_tpl.utm.getHiddenFieldsForUtmMarks();
console.log(mapped.promocode, mapped.comment);
```

Аргументов нет. Возвращает объект query-параметров, уже переименованных согласно mapping.
