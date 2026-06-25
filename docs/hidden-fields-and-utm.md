---
title: Hidden fields и UTM
---

# Hidden fields и UTM

## `window.cp_tpl.hiddenFields(fields, config)`

Создаёт hidden-поля в формах и проставляет значения.

### Пример

```js
window.cp_tpl.hiddenFields({
  promoCode: '',
  marketing_experiments: '',
  comment: '',
  serviceTypeKey: '',
  productKitCode: '',
  tariffUuid: '',
  cjmProductId: ''
});
```

## Поведение по умолчанию

`hiddenFields` ставит значения как дефолты.

Это значит:

1. если поля нет — создаст;
2. если поле есть и пустое — заполнит;
3. если поле уже инициализировано — повторно не перетрёт;
4. если другой скрипт изменил поле — не откатит значение назад.

### Принудительная перезапись

```js
window.cp_tpl.hiddenFields({
  serviceTypeKey: 'mini_course_kids_physics'
}, {
  overwriteExisting: true
});
```

Короткий алиас:

```js
window.cp_tpl.hiddenFields({
  serviceTypeKey: 'mini_course_kids_physics'
}, {
  force: true
});
```

## Конфиг

| Параметр | Тип | По умолчанию | Что делает |
|---|---:|---:|---|
| `formSelector` | string | `form` | В каких формах создавать поля |
| `boxSelector` | string | `.t-form__inputsbox` | Куда добавлять поля |
| `observe` | boolean | `true` | Следить за появлением новых форм |
| `overwriteExisting` | boolean | `false` | Всегда перезаписывать значения |
| `force` | boolean | `false` | Алиас для `overwriteExisting` |
| `utmMarksMap` | object | встроенная карта | Как поля попадают в `utmMarks` |

## `window.cp_tpl.hiddenFields.getValues()`

Возвращает актуальные значения. Если поле было изменено в DOM, метод старается взять текущее DOM-значение, а не стартовый дефолт.

```js
var values = window.cp_tpl.hiddenFields.getValues();
console.log(values);
```

## `window.cp_tpl.utm(config)`

Метод добавляет/обновляет UTM-параметры и создаёт `window.buildUtmMarks`.

### Пример

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

### `type: 'hard'` и `type: 'soft'`

```js
window.cp_tpl.utm({
  parameters: {
    product: {
      value: 'type-skyeng_action|name-example',
      type: 'hard'
    },
    utm_source: {
      value: 'landing',
      type: 'soft'
    }
  }
});
```

- `hard` — перезаписывает параметр в URL.
- `soft` — добавляет только если параметра ещё нет.

## Hidden fields в `utmMarks`

В `utmMarks` по умолчанию попадают:

| Hidden field | UTM param |
|---|---|
| `promoCode` | `promocode` |
| `promocode` | `promocode` |
| `promo` | `promocode` |
| `comment` | `comment` |
| `marketing_experiments` | `marketingExperiments` |
| `marketingExperiments` | `marketingExperiments` |

Можно расширить карту:

```js
window.cp_tpl.hiddenFields({
  custom: 'value'
}, {
  utmMarksMap: {
    custom: 'customParam'
  }
});
```

## `buildUtmMarks`

```js
var utmMarks = window.buildUtmMarks({
  extra: 'value'
});
```

Отключить hidden-поля:

```js
var utmMarks = window.buildUtmMarks({}, {
  includeHiddenFields: false
});
```
