# B2B order

Модуль `window.cp_tpl.b2b` помогает собрать данные формы и отправить их в B2B API.

## `window.cp_tpl.b2b.hit(config)`

Получает текущий `hitId` из `window.skyengTrackHits.get_current_hit_id()`.

```js
var hit = window.cp_tpl.b2b.hit();

hit.ready.then(function (hitId) {
  console.log(hitId);
});
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `delay` | number | `0` | Задержка перед первой попыткой. |
| `retries` | number | `20` | Количество повторов. |
| `retryDelay` | number | `250` | Пауза между повторами. |
| `globalName` | string | `getHit` | Куда записать hitId на `window`. |

### Возвращает

```js
{
  get: function () {},
  ready: Promise,
  refresh: function () {}
}
```

## `window.cp_tpl.b2b.zone(config)`

Определяет timezone по offset браузера и записывает значение на `window`.

```js
var zone = window.cp_tpl.b2b.zone();
console.log(zone);
```

### Параметры

| Параметр | Тип | По умолчанию |
|---|---:|---|
| `globalName` | string | `getZone` |

## `window.cp_tpl.b2b.getMeta()`

Синхронно возвращает доступную мету:

```js
var meta = window.cp_tpl.b2b.getMeta();
// { hitId: '...', timezone: 'Europe/Moscow' }
```

Пустые значения удаляются.

## `window.cp_tpl.b2b.getMetaAsync()`

Дожидается hitId и возвращает мету:

```js
window.cp_tpl.b2b.getMetaAsync().then(function (meta) {
  console.log(meta);
});
```

## `window.cp_tpl.b2b.order(config)`

Регистрирует обработчик успешной отправки Tilda-формы и отправляет payload в B2B API.

```js
window.cp_tpl.b2b.order({
  redirectToLoginLink: false,
  onSuccess: function (data) {
    console.log(data.payload);
  }
});
```

### Важная особенность

Tilda после успешной отправки может очистить форму. Поэтому `b2b.order` делает snapshot формы сразу в `t396_onSuccess` на stage `before`, а уже потом ждёт `hitId` и отправляет данные в API.

Это значит, что name/email/phone и hidden-поля не теряются, даже если Tilda успела очистить DOM-форму.

### Параметры config

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `apiUrl` | string | `https://corp.skyeng.ru/landing/public/v2/order` | Endpoint для отправки заявки. |
| `orderConfig` | object | см. ниже | Статичные поля payload. |
| `childCourseValue` | string | `Репетиторы для детей` | Значение `courseType`, при котором заявка считается детской. |
| `openThankyou` | boolean | `true` | Закрыть Tilda popup и открыть `#thankyou`. |
| `redirectToLoginLink` | boolean | `true` | Редиректить на `responseData.loginLink`, если он есть. |
| `transformPayload` | function | — | Позволяет изменить payload перед отправкой. |
| `onSuccess` | function | — | Колбэк после успешного ответа API. |
| `onError` | function | — | Колбэк при ошибке. |

### orderConfig по умолчанию

```js
{
  generateLoginLinkTo: 'https://student.skyeng.ru/',
  landing_param_key: 'utm_page'
}
```

Можно расширить:

```js
window.cp_tpl.b2b.order({
  orderConfig: {
    landing_name: 'b2b_leadmagnet.future_profession_b2b.is_subscribed',
    lead_type: 'Заявка на b2b_leadmagnet.future_profession_b2b.is_subscribed'
  }
});
```

### Как собирается payload

Payload собирается в таком порядке:

1. Значения формы через `FormData`.
2. Параметры из URL.
3. `orderConfig`.
4. `hitId` и `timezone` из `getMetaAsync()`.
5. Нормализация телефона.
6. Детская логика.
7. `transformPayload`, если передан.
8. Удаление пустых значений.

### Детская логика

Заявка считается детской, если:

- в payload есть непустой `childName`, или
- в форме есть `input[name="childName"]` с непустым значением, или
- `payload.courseType === childCourseValue`.

Тогда поля преобразуются так:

| Было | Станет |
|---|---|
| `name` | `parentName` |
| `email` | `parentEmail` |
| `phone` | `parentPhone` |
| `childName` | остаётся, по умолчанию `Ребёнок` |

## `transformPayload(payload, context)`

```js
window.cp_tpl.b2b.order({
  transformPayload: function (payload, context) {
    payload.customField = 'custom value';
    return payload;
  }
});
```

### context

```js
{
  form: HTMLFormElement,
  formSnapshot: {
    form: HTMLFormElement,
    formId: string,
    formFields: object,
    urlParams: object
  },
  formFields: object,
  urlParams: object
}
```

## `onSuccess(data)`

```js
window.cp_tpl.b2b.order({
  onSuccess: function (data) {
    console.log(data.payload);
    console.log(data.responseData);
  }
});
```

### data

```js
{
  data: object,
  responseData: object,
  payload: object,
  form: HTMLFormElement,
  formSnapshot: object,
  wasBump: boolean
}
```

## `onError(error, context)`

```js
window.cp_tpl.b2b.order({
  onError: function (error, context) {
    console.log(error);
    console.log(context.payload);
  }
});
```

### context

```js
{
  form: HTMLFormElement,
  formSnapshot: object,
  payload: object|null
}
```

## Возвращаемые методы

```js
var order = window.cp_tpl.b2b.order();

order.buildPayload(formOrSnapshot, globalMeta);
order.createFormSnapshot(form);
order.send(formOrSnapshot);
```

Обычно эти методы нужны только для отладки.
