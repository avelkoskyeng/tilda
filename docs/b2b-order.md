---
title: B2B order
---

# B2B order

## `window.cp_tpl.b2b.order(config)`

Метод отправляет данные формы в B2B API.

Главная особенность: перед отправкой метод делает snapshot формы в момент `t396_onSuccess`, до того, как Tilda очистит значения полей.

## Пример

```js
window.cp_tpl.b2b.order({
  redirectToLoginLink: false,

  onSuccess: function (data) {
    console.log(data.payload);
    console.log(data.responseData);

    window.location.href = 'https://corp.skysmart.ru/testing/final';
  }
});
```

## Что не нужно делать

Не нужно инициализировать `b2b.order` внутри `t396Success`:

```js
window.cp_tpl.t396Success(function () {
  window.cp_tpl.b2b.order();
});
```

`b2b.order()` сам регистрирует обработчик формы.

## Конфиг

| Параметр | Тип | По умолчанию | Что делает |
|---|---:|---:|---|
| `apiUrl` | string | B2B API URL | Куда отправлять payload |
| `orderConfig` | object | defaults | Доп. параметры заказа |
| `childCourseValue` | string | `Репетиторы для детей` | Старый fallback для детских форм |
| `openThankyou` | boolean | `true` | Открывать thankyou popup |
| `redirectToLoginLink` | boolean | `true` | Редиректить по `loginLink` из ответа |
| `transformPayload` | function | — | Изменить payload перед отправкой |
| `onSuccess` | function | — | Callback успешной отправки |
| `onError` | function | — | Callback ошибки |

## Детская форма

Если payload содержит непустой `childName`, заявка считается детской. Тогда:

```txt
name  -> parentName
email -> parentEmail
phone -> parentPhone
```

А `childName` остаётся как имя ребёнка.

## Snapshot

В `onSuccess` доступно:

```js
window.cp_tpl.b2b.order({
  onSuccess: function (data) {
    console.log(data.formSnapshot);
    console.log(data.payload);
  }
});
```

`formSnapshot` содержит:

```txt
form
formId
formFields
urlParams
```

## transformPayload

```js
window.cp_tpl.b2b.order({
  transformPayload: function (payload, context) {
    payload.custom = 'value';

    return payload;
  }
});
```

В `context` доступны:

```txt
form
formSnapshot
formFields
urlParams
```
