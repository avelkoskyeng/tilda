# Hidden fields и UTM

## `window.cp_tpl.hiddenFields(fields, config)`

Создаёт hidden-поля во всех формах и хранит их значения для дальнейшей UTM/CJM-сборки.

```js
window.cp_tpl.hiddenFields({
  promoCode: 'SALE',
  marketing_experiments: 'test-a',
  comment: 'landing comment',
  cjmProductId: 'adult_english_not_native_speaker_premium'
});
```

### Поведение по умолчанию

`hiddenFields` не должен ломать скрипты лендинга, которые меняют значения hidden-полей после инициализации.

Поэтому по умолчанию:

1. Если поля нет — поле создаётся.
2. Если поле пустое — ставится значение из `fields`.
3. Если поле уже было инициализировано — повторный `apply()` не перетирает его.
4. Если другой скрипт позже поменял значение — `hiddenFields` не откатывает его назад.
5. `getValues()` старается читать актуальные значения из DOM, а не только стартовый конфиг.

### Параметры fields

`fields` — объект, где ключ становится `name` hidden-инпута, а значение — `value`.

```js
window.cp_tpl.hiddenFields({
  serviceTypeKey: 'mini_course_kids_math',
  productKitCode: '',
  tariffUuid: '',
  cjmProductId: ''
});
```

### Параметры config

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `formSelector` | string | `form` | Где искать формы. |
| `boxSelector` | string | `.t-form__inputsbox` | Куда вставлять hidden inputs. |
| `observe` | boolean | `true` | Следить за DOM и добавлять поля в новые формы. |
| `overwriteExisting` | boolean | `false` | Если `true`, всегда перезаписывать значения. |
| `force` | boolean | `false` | Алиас для `overwriteExisting`. |
| `utmMarksMap` | object | стандартная карта | Дополнительная карта hidden-полей в UTM-параметры. |

### Возвращает

```js
var hidden = window.cp_tpl.hiddenFields({
  comment: 'test'
});

hidden.apply();   // применить вручную
hidden.destroy(); // остановить MutationObserver
```

### Принудительное перезаписывание

Использовать осторожно:

```js
window.cp_tpl.hiddenFields({
  serviceTypeKey: 'mini_course_kids_physics'
}, {
  overwriteExisting: true
});
```

или:

```js
window.cp_tpl.hiddenFields({
  serviceTypeKey: 'mini_course_kids_physics'
}, {
  force: true
});
```

## `window.cp_tpl.hiddenFields.getValues()`

Возвращает значения hidden-полей, зарегистрированных через `hiddenFields`. Если в DOM есть актуальное значение поля, вернёт его.

```js
var values = window.cp_tpl.hiddenFields.getValues();
console.log(values.comment);
```

## Стандартный UTM mapping для hidden-полей

`buildUtmMarks()` умеет автоматически добавлять некоторые hidden-поля в UTM-строку.

| Hidden field | UTM параметр |
|---|---|
| `promoCode` | `promocode` |
| `promocode` | `promocode` |
| `promo` | `promocode` |
| `comment` | `comment` |
| `marketing_experiments` | `marketingExperiments` |
| `marketingExperiments` | `marketingExperiments` |

### Добавить свою карту

```js
window.cp_tpl.hiddenFields({
  customField: 'custom-value'
}, {
  utmMarksMap: {
    customField: 'customParam'
  }
});
```

## `window.cp_tpl.utm(config)`

Управляет UTM-параметрами страницы и создаёт `window.buildUtmMarks`.

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

### Параметры config

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `parameters` | object | `{}` | Основные параметры. |
| `utmParameters` | object | `{}` | Алиас для `parameters`. |
| `extraParams` | object | `{}` | Дополнительные простые параметры. |
| `updateUrl` | boolean | `true` | Обновлять URL через `history.replaceState`. |
| `exposeGlobals` | boolean | `true` | Создать `window.buildUtmMarks`. |

### Формат параметра

Простой формат:

```js
window.cp_tpl.utm({
  parameters: {
    utm_source: 'landing'
  }
});
```

Расширенный формат:

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

`type`:

| Тип | Поведение |
|---|---|
| `soft` | Поставить параметр только если его нет в URL. |
| `hard` | Перезаписать параметр в URL. |

### Возвращает

```js
var utm = window.cp_tpl.utm({
  parameters: {
    utm_source: 'landing'
  }
});

utm.parameters;
utm.buildUtmMarks({ extra: '1' });
```

## `window.buildUtmMarks(extra, buildConfig)`

Создаётся после `window.cp_tpl.utm()`, если `exposeGlobals !== false`.

```js
var marks = window.buildUtmMarks({
  product: 'type-skyeng_action|name-example'
});
```

По умолчанию включает hidden-поля из `hiddenFields`.

Отключить hidden-поля:

```js
window.buildUtmMarks({}, {
  includeHiddenFields: false
});
```

## Внутренние методы UTM

Доступны как публичные функции, но обычно не нужны вручную:

```js
window.cp_tpl.utm.applyParams(searchParams, parameters);
window.cp_tpl.utm.updateURLParameters(parameters);
window.cp_tpl.utm.buildUtmMarks(parameters, config);
window.cp_tpl.utm.getHiddenFieldsForUtmMarks();
```
