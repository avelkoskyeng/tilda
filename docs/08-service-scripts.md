---
layout: default
title: Сервисные скрипты
nav_order: 9
---
# Сервисные скрипты в хвосте файла

В конце `helpers.js` есть два блока, которые не находятся внутри `window.cp_tpl`, но выполняются на странице после загрузки файла.

## Zone JS для t1093

```js
function waitForZoneJs(timeout = 60000, interval = 10) { ... }
```

### Что делает

1. Ждёт появления `window.Zone.current`.
2. Если Zone.js появился — пишет в консоль `Zone.js инициализирован`.
3. Добавляет document-level обработчик клика:

```js
document.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
});
```

### Параметры `waitForZoneJs`

| Параметр | Тип | По умолчанию | Описание |
|---|---:|---|---|
| `timeout` | number | `60000` | Максимальное ожидание Zone.js. |
| `interval` | number | `10` | Частота проверки. |

### Важно

Этот блок может влиять на клики на странице, потому что вызывает `stopImmediatePropagation`. Не удаляй и не меняй его, если он нужен для конкретных Tilda/Zone.js сценариев.

## UTM -> Для ссылок

Самовызывающийся скрипт, который добавляет текущие query-параметры страницы ко всем ссылкам.

### Что делает

1. Сканирует все `<a href>`.
2. Пропускает ссылки:
   - `#anchor`,
   - `mailto:`,
   - `tel:`,
   - `javascript:`,
   - hash-ссылки на той же странице.
3. Сохраняет исходный `href` в `a.dataset.hrefBase`.
4. Добавляет текущие параметры `location.search` в ссылку.
5. Следит за изменениями URL через patched `history.pushState` / `history.replaceState`.
6. Следит за новыми DOM-узлами через `MutationObserver`.
7. Перед кликом дополнительно патчит ссылку.

### Пример

Если текущая страница:

```txt
https://example.com/page?utm_source=test&utm_campaign=summer
```

а ссылка:

```html
<a href="https://example.com/final">Финалка</a>
```

после патча станет:

```txt
https://example.com/final?utm_source=test&utm_campaign=summer
```

### Важно

Этот блок работает независимо от `window.cp_tpl.utm`. Он берёт именно текущий `location.search`.
