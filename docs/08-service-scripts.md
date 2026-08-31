---
layout: default
title: Сервисные скрипты
nav_order: 9
search_keywords: >-
  service scripts сервисные скрипты waitForZoneJs zone js t1093 wait timeout interval
  url links query params utm ссылки history pushState replaceState mutation observer stopImmediatePropagation
---
# Сервисные скрипты в `helpers.js`

В хвосте `helpers.js` есть код вне `window.cp_tpl`. Он выполняется автоматически после загрузки файла.

## `waitForZoneJs(timeout, interval)` {#wait-for-zone-js}

Глобальная функция ждёт появления `window.Zone.current` и возвращает Promise<boolean>.

### Стандартный вызов

```js
waitForZoneJs().then(function (zoneReady) {
  console.log(zoneReady);
});
```

### Полный вызов

```js
waitForZoneJs(60000, 10).then(function (zoneReady) {
  if (!zoneReady) {
    console.warn('Zone.js не появился');
    return;
  }

  console.log('Zone.js готов');
});
```

### Аргументы

| Аргумент | Тип | По умолчанию | Что делает и когда нужен |
|---|---|---|---|
| `timeout` | number | `60000` | Максимальное ожидание Zone.js в ms. После него Promise резолвится `false`, а не reject-ится. |
| `interval` | number | `10` | Интервал polling-а `window.Zone.current` в ms. |

### Автоматическое использование

`helpers.js` сам вызывает `waitForZoneJs()`. После успешного ожидания он добавляет document-level click handler с `event.stopImmediatePropagation()`.

Это поведение может влиять на другие click listeners на странице. Его нужно учитывать при диагностике конфликтов Tilda/Zone.js.

## UTM/query параметры для ссылок {#service-link-params}

Отдельный самовызывающийся блок автоматически переносит текущие query-параметры страницы в ссылки.

Он:

1. сканирует `<a href>`;
2. пропускает anchors, `mailto:`, `tel:`, `javascript:` и hash той же страницы;
3. сохраняет базовый URL ссылки;
4. добавляет текущий `location.search`;
5. отслеживает новые DOM-узлы;
6. реагирует на `history.pushState`/`replaceState`;
7. повторно актуализирует ссылку перед кликом.

Пример:

```txt
Страница: https://example.com/page?utm_source=test&utm_campaign=summer
Ссылка:   https://example.com/final
Результат:https://example.com/final?utm_source=test&utm_campaign=summer
```

Публичных вызываемых функций этот блок не экспортирует. Он работает независимо от `window.cp_tpl.utm()` и использует фактический текущий `location.search`.
