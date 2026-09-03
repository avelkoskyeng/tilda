---
layout: default
title: Формы
nav_order: 4
search_keywords: >-
  forms form форма формы tilda формы cp_tpl forms helpers
search_aliases:
  forms-select-all: >-
    selectAll select all выбрать все формы найти формы selectedFormIds form ids cp-auto-form
  forms-fill-data: >-
    fillData fill data заполнить форму данными данные с предыдущей страницы page data share
    skyengTildaPageDataShare getData zero block rec customer integration fieldsMap
  forms-televox: >-
    televox телевокс import group utmMarks offset timezone rules hidden fields лид заявка
    подготовить форму televox скрытые поля
---
# Формы

Методы `window.cp_tpl.forms` помогают найти Tilda-формы, заполнить данные с предыдущей страницы и подготовить Televox hidden-поля.

## `window.cp_tpl.forms.selectAll(config)` {#forms-select-all}

Находит Tilda-формы, гарантирует уникальные `id`, сохраняет их в глобальный массив и вызывает callback после того, как набор форм стабилизировался.

### Стандартный вызов

```js
window.cp_tpl.forms.selectAll({
  onReady: function (formIds) {
    console.log(formIds);
  }
});
```

### Полный вызов

```js
var selection = window.cp_tpl.forms.selectAll({
  formSelector: 'form.js-form-proccess, form.t-form, form[data-formactiontype], form',
  inputsBoxSelector: '.t-form__inputsbox',
  quietTime: 3000,
  maxWait: 15000,
  globalName: 'selectedFormIds',
  waitForStableDom: true,
  onReady: function (formIds) {
    console.log('Формы готовы:', formIds);
  }
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `formSelector` | string | Tilda selectors + `form` | CSS-селектор кандидатов. Форма считается найденной только если внутри есть `inputsBoxSelector`. |
| `inputsBoxSelector` | string | `.t-form__inputsbox` | Проверка, что найденный `<form>` действительно похож на Tilda-форму. |
| `quietTime` | number | `3000` | Сколько ms не должно появляться новых форм перед `finish()`. Полезно для ленивой/динамической отрисовки Tilda. |
| `maxWait` | number | `15000` | Жёсткий предел ожидания. После него поиск завершается даже без форм. |
| `globalName` | string | `selectedFormIds` | Имя массива на `window`, куда записываются найденные ID. |
| `waitForStableDom` | boolean | `true` | Если `false`, завершает поиск сразу после появления новых форм и не ждёт `quietTime`. |
| `onReady` | function | — | Вызывается один раз после успешного завершения и получает `formIds`. |

### Что происходит с ID

Если у формы нет `id` либо текущий `id` уже использован другой найденной формой, библиотека создаёт уникальный `cp-auto-form-N`.

### `selection.getFormIds()` {#selection-get-form-ids}

Возвращает текущий массив ID из `window[globalName]`. Стандартный и полный вызов одинаковы:

```js
var formIds = selection.getFormIds();
```

Аргументов нет. Возвращается живой массив, который `selectAll` синхронизирует перед завершением.

### `selection.scan()` {#selection-scan}

Принудительно запускает один проход поиска форм. Стандартный и полный вызов одинаковы:

```js
selection.scan();
```

Аргументов нет. Обычно ручной вызов не нужен, потому что библиотека слушает `MutationObserver`, `DOMContentLoaded` и `load`.

### `selection.finish(reason)` {#selection-finish}

Пытается завершить поиск вручную.

Стандартный вызов:

```js
selection.finish('ручное завершение');
```

Полный вызов:

```js
var formIds = selection.finish('формы готовы по внешнему условию');
```

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `reason` | string | `undefined` | Текст только для логов/диагностики. Не влияет на найденные формы, кроме специальной внутренней причины `достигнут MAX_WAIT`. |

Если форм нет, обычный ручной `finish()` не завершает selection. При успехе возвращает массив ID.

### Частый сценарий: сразу подключить Televox

```js
window.cp_tpl.forms.selectAll({
  onReady: function () {
    window.cp_tpl.forms.televox({
      importGroup: 12491
    });
  }
});
```

## `window.cp_tpl.forms.fillData(formIdsOrConfig, config)` {#forms-fill-data}

Вызывает внешнюю библиотеку `window.skyengTildaPageDataShare.getData('#rec...')` для Zero Block records, в которых находятся выбранные формы.

### Стандартный вызов

```js
window.cp_tpl.forms.selectAll({
  onReady: function (formIds) {
    window.cp_tpl.forms.fillData(formIds);
  }
});
```

### Полный вызов: два аргумента

```js
window.cp_tpl.forms.fillData(
  ['form123', 'form456'],
  {
    globalName: 'selectedFormIds',
    timeout: 10000,
    interval: 250,
    initIntegration: true,
    fieldsMap: {
      email: 'parentEmail',
      phone: 'parentPhone',
      name: 'parentName'
    },
    mergeFieldsMap: true,
    debug: true,
    onReady: function (recordSelectors) {
      console.log(recordSelectors);
    },
    onError: function (error, context) {
      console.error(error, context);
    }
  }
);
```

### Полный вызов: одним config-объектом

```js
window.cp_tpl.forms.fillData({
  formIds: ['form123', 'form456'],
  // Вместо formIds поддерживаются aliases: forms, ids, items.
  globalName: 'selectedFormIds',
  timeout: 10000,
  interval: 250,
  initIntegration: true,
  fieldsMap: {
    email: 'parentEmail',
    phone: 'parentPhone',
    name: 'parentName'
  },
  mergeFieldsMap: true,
  debug: false,
  onReady: function (recordSelectors) {},
  onError: function (error, context) {}
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `formIdsOrConfig` | string/array/NodeList/Element/object | — | Формы/records либо config-объект. Строки могут быть ID формы, CSS-селекторами или `rec...`. |
| `config.formIds` | any[]/string | — | Основной список форм в одноаргументной сигнатуре. |
| `config.forms` | any[]/string | — | Alias для `formIds`. |
| `config.ids` | any[]/string | — | Alias для `formIds`. |
| `config.items` | any[]/string | — | Alias для `formIds`. |
| `config.globalName` | string | `selectedFormIds` | Если явный список пуст, берёт формы из этого массива на `window`. |
| `config.timeout` | number | `10000` | Сколько ждать появления `skyengTildaPageDataShare.getData`. |
| `config.interval` | number | `250` | Интервал polling-а внешней библиотеки. |
| `config.initIntegration` | boolean | `true` | Если доступен `window.skyengTildaCustomerIntegration.init`, вызывает его перед `getData`. |
| `config.fieldsMap` | object | — | Мэпинг полей для `skyengTildaPageDataShare.fieldsMap`. |
| `config.mergeFieldsMap` | boolean | `true` | `true` объединяет карту с существующей; `false` полностью заменяет её. |
| `config.debug` | boolean | `false` | Логирует records, для которых вызван `getData`. |
| `config.onReady` | function | — | Получает массив `recordSelectors` после успешной инициализации. |
| `config.onError` | function | — | Получает `(error, context)`, если внешняя библиотека не появилась за timeout. |

### Возвращает

`Promise<string[]>` с уникальными селекторами вида `#rec123456`. Даже при ошибке Promise резолвится найденным массивом records после вызова `onError`.

## `window.cp_tpl.forms.televox(config)` {#forms-televox}

Добавляет и поддерживает Televox hidden-поля в выбранных формах. Значения пересчитываются на `click`, `change` и `submit`.

### Стандартный вызов

```js
window.cp_tpl.forms.televox({
  importGroup: 12491
});
```

### Полный вызов

```js
window.cp_tpl.forms.televox({
  importGroup: 12491,
  globalName: 'selectedFormIds',
  fields: [
    'subscription_attributes_utmMarks',
    'customer_attributes_offset',
    'subscription_attributes_location',
    'subscription_attributes_televoxIntegration',
    'subscription_attributes_televoxImportGroup',
    'subscription_attributes_rules'
  ],
  rules: ['rule-a', 'rule-b'],
  extraParams: {
    product: 'type-skyeng_action|name-example'
  },
  autoSelect: true,
  formIds: ['form123'],
  selectAllQuietTime: 0,
  waitForStableDom: false
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `importGroup` | string/number | `''` | Записывается в `subscription_attributes_televoxImportGroup`. |
| `globalName` | string | `selectedFormIds` | Откуда брать IDs уже найденных форм и куда их пишет авто-поиск. |
| `fields` | string[] | 5 стандартных Televox полей | Какие hidden inputs создать. Нужен для кастомной схемы интеграции. |
| `rules` | string/string[] | — | Добавляет поле `subscription_attributes_rules`; массив соединяется запятыми. |
| `extraParams` | object | `{}` | Передаётся в `window.buildUtmMarks(extraParams)` при заполнении `subscription_attributes_utmMarks`. |
| `autoSelect` | boolean | `true` | `true` сам запускает `forms.selectAll`, если `globalName` ещё пуст. `false` использует только `formIds`/готовый глобальный список. |
| `formIds` | string[] | — | Явный список форм для режима `autoSelect: false`. |
| `selectAllQuietTime` | number | `0` | `quietTime`, который Televox передаст внутреннему `forms.selectAll`. |
| `waitForStableDom` | boolean | `false` внутри Televox | Только если явно `true`, внутренний `selectAll` будет ждать стабильный DOM. |

### Какие значения заполняются

| Hidden field | Значение |
|---|---|
| `customer_attributes_offset` | Текущий timezone offset браузера. |
| `subscription_attributes_utmMarks` | `window.buildUtmMarks(extraParams)` или текущий `location.search` без `?`. |
| `subscription_attributes_location` | `location.origin + location.pathname`. |
| `subscription_attributes_televoxIntegration` | `true`. |
| `subscription_attributes_televoxImportGroup` | `importGroup`. |
| `subscription_attributes_rules` | `rules`, если параметр задан. |

Если форма уже помечена `data-cp-tpl-televox-inited`, повторный вызов её не инициализирует второй раз.
