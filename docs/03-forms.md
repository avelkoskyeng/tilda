---
layout: default
title: Формы
nav_order: 4
---
# Формы

В этой главе описаны методы из `window.cp_tpl.forms`.

## `window.cp_tpl.forms.selectAll(config)`

Находит формы на странице, гарантирует им уникальный `id`, сохраняет список ID в глобальную переменную и вызывает `onReady(formIds)`.

```js
window.cp_tpl.forms.selectAll({
  onReady: function (formIds) {
    console.log(formIds);
  }
});
```

### Что делает

1. Ищет формы по `formSelector`.
2. Фильтрует только формы, где есть `inputsBoxSelector`.
3. Если у формы нет `id` или он дублируется, создаёт `cp-auto-form-N`.
4. Записывает ID в `window.selectedFormIds` или в другое имя из `globalName`.
5. Вызывает `onReady(formIds)`.

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `formSelector` | string | список Tilda-селекторов + `form` | CSS-селектор форм. |
| `inputsBoxSelector` | string | `.t-form__inputsbox` | Селектор контейнера полей внутри формы. |
| `quietTime` | number | `0` | Задержка перед завершением после найденных форм. |
| `maxWait` | number | `15000` | Максимальное ожидание форм. |
| `globalName` | string | `selectedFormIds` | Имя глобального массива с ID форм. |
| `waitForStableDom` | boolean | `false` | Если `true`, ждёт стабилизации DOM через `quietTime`. |
| `onReady` | function | — | Колбэк после нахождения форм. |

### Возвращает

```js
{
  getFormIds: function () {},
  finish: function (reason) {}
}
```

### Рекомендуемый вызов

```js
window.cp_tpl.forms.selectAll({
  onReady: function (formIds) {
    window.cp_tpl.forms.televox({
      importGroup: 12491
    });
  }
});
```

Если нужна старая логика ожидания стабильного DOM:

```js
window.cp_tpl.forms.selectAll({
  waitForStableDom: true,
  quietTime: 1500,
  onReady: function (formIds) {
    console.log(formIds);
  }
});
```

## `window.cp_tpl.forms.fillData(formIdsOrConfig, config)`

Обёртка над внешней библиотекой `skyengTildaPageDataShare`. Метод нужен, чтобы автоматически вызвать `getData('#rec...')` для всех форм, найденных через `selectAll`.

### Базовый пример

```js
window.cp_tpl.forms.selectAll({
  onReady: function (formIds) {
    window.cp_tpl.forms.fillData(formIds);
  }
});
```

### С мэпингом полей

```js
window.cp_tpl.forms.selectAll({
  onReady: function (formIds) {
    window.cp_tpl.forms.fillData(formIds, {
      fieldsMap: {
        email: 'parentEmail',
        phone: 'parentPhone',
        name: 'parentName'
      }
    });
  }
});
```

### Что принимает первым аргументом

`fillData` можно вызвать разными способами:

```js
window.cp_tpl.forms.fillData(['form1', 'form2']);
window.cp_tpl.forms.fillData('form1, form2');
window.cp_tpl.forms.fillData(document.querySelectorAll('form'));
window.cp_tpl.forms.fillData('#rec123456789');
window.cp_tpl.forms.fillData(); // возьмёт window.selectedFormIds
```

Можно передать всё объектом:

```js
window.cp_tpl.forms.fillData({
  formIds: ['form1', 'form2'],
  fieldsMap: {
    email: 'parentEmail'
  },
  debug: true
});
```

### Параметры config

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `formIds` / `forms` / `ids` / `items` | array/string/NodeList | — | Используется, если первый аргумент — объект. |
| `globalName` | string | `selectedFormIds` | Откуда брать ID форм, если аргументы не переданы. |
| `fieldsMap` | object | — | Мэпинг для `window.skyengTildaPageDataShare.fieldsMap`. |
| `mergeFieldsMap` | boolean | `true` | Мержить с текущим `fieldsMap`; если `false`, заменить целиком. |
| `initIntegration` | boolean | `true` | Вызывать `window.skyengTildaCustomerIntegration.init()`, если он существует. |
| `timeout` | number | `10000` | Сколько ждать `skyengTildaPageDataShare.getData`. |
| `interval` | number | `250` | Интервал проверки зависимости. |
| `debug` | boolean | `false` | Логировать найденные `#rec...`. |
| `onReady` | function | — | Колбэк после вызова `getData` для всех records. |
| `onError` | function | — | Колбэк при ошибке ожидания зависимости. |

### Возвращает

`Promise`, который резолвится массивом record-селекторов:

```js
window.cp_tpl.forms.fillData().then(function (recordSelectors) {
  console.log(recordSelectors); // ['#rec123', '#rec456']
});
```

## `window.cp_tpl.forms.televox(config)`

Добавляет и обновляет hidden-поля для Televox-форм.

```js
window.cp_tpl.forms.televox({
  importGroup: 12491
});
```

### Что добавляет по умолчанию

```txt
subscription_attributes_utmMarks
customer_attributes_offset
subscription_attributes_location
subscription_attributes_televoxIntegration
subscription_attributes_televoxImportGroup
```

Если передан `rules`, дополнительно добавляет:

```txt
subscription_attributes_rules
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `importGroup` | string/number | `''` | Значение для `subscription_attributes_televoxImportGroup`. |
| `globalName` | string | `selectedFormIds` | Откуда брать ID форм. |
| `fields` | string[] | стандартный список | Список hidden-полей для создания. |
| `rules` | string/string[] | — | Значение для `subscription_attributes_rules`. |
| `extraParams` | object | `{}` | Дополнительные параметры для `buildUtmMarks`. |
| `autoSelect` | boolean | `true` | Если `true`, сам вызовет `selectAll`, когда нет `selectedFormIds`. |
| `formIds` | string[] | — | Используется при `autoSelect: false`. |
| `selectAllQuietTime` | number | `0` | Передаётся во внутренний `selectAll`. |
| `waitForStableDom` | boolean | `false` | Передаётся во внутренний `selectAll`. |

### Когда обновляет поля

После инициализации метод обновляет поля на событиях формы:

```txt
click
submit
change
```

Это нужно, чтобы перед отправкой актуализировать UTM, offset и остальные системные значения.

### Полный пример

```js
window.cp_tpl.forms.selectAll({
  onReady: function () {
    window.cp_tpl.forms.televox({
      importGroup: 12491,
      rules: ['rule-a', 'rule-b'],
      extraParams: {
        product: 'type-skyeng_action|name-example'
      }
    });
  }
});
```
