---
title: Формы
---

# Формы

## `window.cp_tpl.forms.selectAll(config)`

Метод находит формы на странице, присваивает им уникальные `id`, сохраняет список в `window.selectedFormIds` и вызывает `onReady`.

### Пример

```js
window.cp_tpl.forms.selectAll({
  onReady: function (formIds) {
    console.log(formIds);
  }
});
```

### Конфиг

| Параметр | Тип | По умолчанию | Что делает |
|---|---:|---:|---|
| `formSelector` | string | Tilda form selectors | Какие формы искать |
| `inputsBoxSelector` | string | `.t-form__inputsbox` | Как определить, что это настоящая форма |
| `quietTime` | number | `0` | Пауза перед завершением |
| `maxWait` | number | `15000` | Максимальное ожидание форм |
| `globalName` | string | `selectedFormIds` | Куда сохранить массив id |
| `waitForStableDom` | boolean | `false` | Ждать стабилизации DOM |
| `onReady` | function | — | Callback после нахождения форм |

## `window.cp_tpl.forms.televox(config)`

Добавляет и обновляет hidden-поля для Televox.

### Пример

```js
window.cp_tpl.forms.selectAll({
  onReady: function () {
    window.cp_tpl.forms.televox({
      importGroup: 12491
    });
  }
});
```

### Поля по умолчанию

```txt
subscription_attributes_utmMarks
customer_attributes_offset
subscription_attributes_location
subscription_attributes_televoxIntegration
subscription_attributes_televoxImportGroup
```

Если передан `rules`, добавляется:

```txt
subscription_attributes_rules
```

### Конфиг

| Параметр | Тип | Что делает |
|---|---:|---|
| `importGroup` | string/number | Значение для `subscription_attributes_televoxImportGroup` |
| `fields` | array | Список hidden-полей |
| `rules` | string/array | Правила для `subscription_attributes_rules` |
| `autoSelect` | boolean | Если `false`, не вызывает `selectAll` |
| `formIds` | array | Явный список форм |
| `extraParams` | object | Дополнительные параметры для `buildUtmMarks` |

## `window.cp_tpl.forms.fillData(formIds, config)`

Обёртка над другой библиотекой:

```js
window.skyengTildaCustomerIntegration.init();
window.skyengTildaPageDataShare.getData('#rec...');
```

Метод берёт `formIds`, находит для каждой формы ближайший zero-block `#rec...` и вызывает `getData` для каждого record.

### Пример с мэпингом для родительского бренда

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

### Пример без мэпинга

```js
window.cp_tpl.forms.selectAll({
  onReady: function (formIds) {
    window.cp_tpl.forms.fillData(formIds);
  }
});
```

### Конфиг

| Параметр | Тип | По умолчанию | Что делает |
|---|---:|---:|---|
| `fieldsMap` | object | — | Мэпинг полей для `skyengTildaPageDataShare.fieldsMap` |
| `initIntegration` | boolean | `true` | Вызывать `skyengTildaCustomerIntegration.init()` |
| `mergeFieldsMap` | boolean | `true` | Мержить с текущим `fieldsMap` |
| `timeout` | number | `10000` | Сколько ждать `skyengTildaPageDataShare.getData` |
| `interval` | number | `250` | Частота проверки зависимости |
| `debug` | boolean | `false` | Логировать найденные `#rec...` |
| `onReady` | function | — | Callback после вызова `getData` |
| `onError` | function | — | Callback ошибки |

Можно вызвать без аргументов, если `window.selectedFormIds` уже заполнен:

```js
window.cp_tpl.forms.fillData();
```
