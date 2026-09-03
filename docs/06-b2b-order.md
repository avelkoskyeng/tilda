---
layout: default
title: B2B order
nav_order: 7
search_keywords: >-
  b2b order заявка заказ api corp skyeng форма payload cp_tpl b2b
search_aliases:
  b2b-hit: >-
    b2b hit hitId skyengTrackHits tracking hit получить hit id
  b2b-zone: >-
    b2b zone timezone таймзона часовой пояс определить зону
  b2b-get-meta: >-
    getMeta get meta b2b metadata tracking meta получить мета синхронно
  b2b-get-meta-async: >-
    getMetaAsync get meta async b2b metadata tracking meta получить мета асинхронно wait
  b2b-order: >-
    b2b order заявка заказ отправка формы post form snapshot payload child parent childName
    parentName parentEmail parentPhone loginLink thankyou wasBump transformPayload onSuccess onError
---
# B2B order

Модуль `window.cp_tpl.b2b` получает tracking meta, собирает snapshot Tilda-формы и отправляет payload в B2B API.

## `window.cp_tpl.b2b.hit(config)` {#b2b-hit}

Пытается получить текущий hit ID из `window.skyengTrackHits.get_current_hit_id()` с повторами.

### Стандартный вызов

```js
var hit = window.cp_tpl.b2b.hit();

hit.ready.then(function (hitId) {
  console.log(hitId);
});
```

### Полный вызов

```js
var hit = window.cp_tpl.b2b.hit({
  delay: 0,
  retries: 20,
  retryDelay: 250,
  globalName: 'getHit'
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `delay` | number | `0` | Задержка перед первой попыткой после готовности DOM. |
| `retries` | number | `20` | Максимальный номер повторной попытки, если hit ID ещё пустой. |
| `retryDelay` | number | `250` | Пауза между попытками в ms. |
| `globalName` | string | `getHit` | Имя глобальной переменной, куда пишется найденный hit ID. |

### `hit.get()` {#hit-get}

Делает одну синхронную попытку прочитать hit ID. Стандартный и полный вызов одинаковы:

```js
var hitId = hit.get();
```

Аргументов нет. Возвращает строку; если tracking API ещё не готов, это может быть `''`.

### `hit.ready`

Это не функция, а Promise первого retry-цикла:

```js
hit.ready.then(function (hitId) {
  console.log(hitId);
});
```

### `hit.refresh()` {#hit-refresh}

Запускает новый retry-цикл без стартового `delay`. Стандартный и полный вызов одинаковы:

```js
hit.refresh().then(function (hitId) {
  console.log(hitId);
});
```

Аргументов нет. Возвращает новый Promise и одновременно заменяет внутренний `b2bState.hitPromise`.

## `window.cp_tpl.b2b.zone(config)` {#b2b-zone}

Определяет timezone по `Date#getTimezoneOffset()` и внутренней таблице соответствий.

### Стандартный вызов

```js
var zone = window.cp_tpl.b2b.zone();
```

### Полный вызов

```js
var zone = window.cp_tpl.b2b.zone({
  globalName: 'getZone'
});
```

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `globalName` | string | `getZone` | Имя глобальной переменной, куда пишется timezone, например `Europe/Moscow`. |

Если offset не найден во внутренней таблице, возвращается пустая строка.

## `window.cp_tpl.b2b.getMeta()` {#b2b-get-meta}

Синхронно возвращает доступную tracking meta.

### Стандартный вызов

```js
var meta = window.cp_tpl.b2b.getMeta();
```

### Полный вызов

```js
var meta = window.cp_tpl.b2b.getMeta();
console.log(meta.hitId, meta.timezone);
```

Аргументов нет. Перед возвратом функция ещё раз пытается прочитать `getHit`; пустые строки, `null` и `undefined` удаляются.

Пример результата:

```js
{
  hitId: 'abc123',
  timezone: 'Europe/Moscow'
}
```

## `window.cp_tpl.b2b.getMetaAsync()` {#b2b-get-meta-async}

Дожидается текущего hit Promise и затем возвращает `getMeta()`.

### Стандартный вызов

```js
window.cp_tpl.b2b.getMetaAsync().then(function (meta) {
  console.log(meta);
});
```

### Полный вызов

```js
var metaPromise = window.cp_tpl.b2b.getMetaAsync();

metaPromise.then(function (meta) {
  console.log(meta.hitId);
  console.log(meta.timezone);
});
```

Аргументов нет. Если `b2b.hit()` ещё не запускался, функция запускает его сама.

## `window.cp_tpl.b2b.order(config)` {#b2b-order}

Регистрирует обработчик успешной T396-формы, делает snapshot данных до того, как Tilda очистит DOM, и отправляет JSON в B2B API.

### Стандартный вызов

```js
window.cp_tpl.b2b.order({
  redirectToLoginLink: false,
  onSuccess: function (context) {
    console.log(context.payload);
  }
});
```

### Полный вызов

```js
var order = window.cp_tpl.b2b.order({
  apiUrl: 'https://corp.skyeng.ru/landing/public/v2/order',

  orderConfig: {
    generateLoginLinkTo: 'https://student.skyeng.ru/',
    landing_param_key: 'utm_page',
    customStaticField: 'value'
  },

  childCourseValue: 'Репетиторы для детей',
  openThankyou: true,
  redirectToLoginLink: true,

  transformPayload: function (payload, context) {
    payload.source = 'custom-landing';
    return payload;
  },

  onSuccess: function (context) {
    console.log(context.data);
    console.log(context.responseData);
    console.log(context.payload);
    console.log(context.form);
    console.log(context.formSnapshot);
    console.log(context.wasBump);
  },

  onError: function (error, context) {
    console.error(error);
    console.log(context.form);
    console.log(context.formSnapshot);
    console.log(context.payload);
  }
});
```

### Аргументы `config`

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `apiUrl` | string | `https://corp.skyeng.ru/landing/public/v2/order` | Endpoint POST-запроса. Меняй для другого окружения/API. |
| `orderConfig` | object | 2 поля ниже | Любые статичные поля, которые мержатся в payload после form fields и URL params. Можно добавлять произвольные ключи. |
| `orderConfig.generateLoginLinkTo` | string | `https://student.skyeng.ru/` | Куда API должен генерировать login link. |
| `orderConfig.landing_param_key` | string | `utm_page` | Имя landing-параметра для B2B API. |
| `childCourseValue` | string | `Репетиторы для детей` | Если `payload.courseType` равен этому значению, заявка считается детской даже без `childName`. |
| `openThankyou` | boolean | `true` | Закрывает Tilda popup и пытается открыть ссылку `#thankyou` после успеха. |
| `redirectToLoginLink` | boolean | `true` | Если API вернул `data.loginLink`, делает редирект после `onSuccess`. |
| `transformPayload` | function | — | Callback `(payload, context)` перед POST. Можно мутировать payload или вернуть новый объект. Если вернуть falsy, используется исходный payload. |
| `onSuccess` | function | — | Callback после успешного JSON-ответа. Получает подробный context. |
| `onError` | function | — | Callback при сетевой/HTTP ошибке. |

### Как собирается payload

Порядок merge:

1. form fields из `FormData`;
2. текущие URL query params;
3. `orderConfig`;
4. tracking meta (`hitId`, `timezone`).

После этого нормализуется `phone`, применяется child-form логика и вызывается `transformPayload`.

Если один ключ встречается несколько раз, более поздний источник имеет приоритет.

### Детская заявка

Если найден непустой `childName` либо `courseType === childCourseValue`, поля `name/email/phone` преобразуются в `parentName/parentEmail/parentPhone`, а `childName` при отсутствии получает значение `Ребёнок`.

### `transformPayload(payload, context)`

`context`:

```js
{
  form: HTMLFormElement,
  formSnapshot: object,
  formFields: object,
  urlParams: object
}
```

### `onSuccess(context)`

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

После успеха библиотека также пушит в `window.dataLayer` событие `_orders_form_sent_success`.

### `onError(error, context)`

```js
{
  form: HTMLFormElement,
  formSnapshot: object,
  payload: object | null
}
```

### `order.createFormSnapshot(form)` {#order-create-form-snapshot}

Снимает значения формы до возможной очистки Tilda.

Стандартный вызов:

```js
var snapshot = order.createFormSnapshot(form);
```

Полный вызов:

```js
var snapshot = order.createFormSnapshot(
  document.querySelector('#my-form')
);
```

| Аргумент | Тип | Что делает |
|---|---|---|
| `form` | `HTMLFormElement` | Источник `FormData` и `form.id`. Если передать falsy, поля формы будут пустыми, но URL params всё равно снимутся. |

Возвращает `{ form, formId, formFields, urlParams }`.

### `order.buildPayload(formOrSnapshot, globalMeta)` {#order-build-payload}

Строит итоговый B2B payload без сетевой отправки.

Стандартный вызов:

```js
var payload = order.buildPayload(form);
```

Полный вызов:

```js
var payload = order.buildPayload(snapshot, {
  hitId: 'abc123',
  timezone: 'Europe/Moscow'
});
```

| Аргумент | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `formOrSnapshot` | `HTMLFormElement`/object | — | Форма либо объект, у которого уже есть `formFields`. |
| `globalMeta` | object | `b2b.getMeta()` | Позволяет явно подменить `hitId/timezone` для теста или ручной сборки. |

Применяет те же `orderConfig`, нормализацию phone, child-логику и `transformPayload`, что реальная отправка.

### `order.send(formOrSnapshot)` {#order-send}

Вручную запускает ту же отправку, которую `b2b.order()` делает после T396 success.

Стандартный вызов:

```js
order.send(form);
```

Полный вызов:

```js
order.send(snapshot).then(function (data) {
  console.log(data);
});
```

| Аргумент | Тип | Что делает |
|---|---|---|
| `formOrSnapshot` | `HTMLFormElement`/object | Форма или заранее снятый snapshot. Snapshot предпочтительнее, если DOM-форма могла быть очищена. |

Возвращает Promise. Внутри ждёт `getMetaAsync()`, делает POST и выполняет `onSuccess/onError`.

`b2b.order()` автоматически запускает `window.cp_tpl.b2b.hit()` и `window.cp_tpl.b2b.zone()` и подписывается на success формы на stage `before`.
