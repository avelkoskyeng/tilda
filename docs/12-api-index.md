---
layout: default
title: API index
nav_order: 13
search_keywords: >-
  api reference справочник все функции полный список methods functions cp_tpl public api
  gtm zoom logo t396Success t396Redirect hiddenFields utm marquee media scrollIndicator spacer
  switchBlocks copy viewport loadScript widgets selectAll fillData televox b2b cjm initTerms debugTerms
---
# API index

Быстрый список всего публичного вызываемого API в `helpers.js` и `terms.js`. Подробное описание каждой функции содержит стандартный вызов, полный вызов и таблицу аргументов на соответствующей странице.

## Core

| Функция | Документация |
|---|---|
| `window.cp_tpl.gtm` | [Core → gtm](02-core.md#gtm) |
| `window.cp_tpl.zoom` | [Core → zoom](02-core.md#zoom) |
| `window.cp_tpl.logo` | [Core → logo](02-core.md#logo) |
| `window.cp_tpl.t396Success` | [Core → t396Success](02-core.md#t396-success) |
| `window.cp_tpl.t396Redirect` | [Core → t396Redirect](02-core.md#t396-redirect) |
| `window.cp_tpl.viewport` | [Core → viewport](02-core.md#viewport) |
| `window.cp_tpl.loadScript` | [Core → loadScript](02-core.md#load-script) |
| `window.cp_tpl.widgets` | [Core → widgets](02-core.md#widgets) |

## Hidden fields и UTM

| Функция | Документация |
|---|---|
| `window.cp_tpl.hiddenFields` | [Hidden fields](04-hidden-fields-and-utm.md#hidden-fields) |
| `window.cp_tpl.hiddenFields.getValues` | [getValues](04-hidden-fields-and-utm.md#hidden-fields-get-values) |
| `window.cp_tpl.utm` | [utm](04-hidden-fields-and-utm.md#utm) |
| `window.buildUtmMarks` | [Глобальный buildUtmMarks](04-hidden-fields-and-utm.md#global-build-utm-marks) |
| `window.cp_tpl.utm.applyParams` | [applyParams](04-hidden-fields-and-utm.md#utm-apply-params) |
| `window.cp_tpl.utm.updateURLParameters` | [updateURLParameters](04-hidden-fields-and-utm.md#utm-update-url) |
| `window.cp_tpl.utm.buildUtmMarks` | [utm.buildUtmMarks](04-hidden-fields-and-utm.md#utm-build-marks) |
| `window.cp_tpl.utm.getHiddenFieldsForUtmMarks` | [getHiddenFieldsForUtmMarks](04-hidden-fields-and-utm.md#utm-hidden-values) |

## Формы

| Функция | Документация |
|---|---|
| `window.cp_tpl.forms.selectAll` | [selectAll](03-forms.md#forms-select-all) |
| `window.cp_tpl.forms.fillData` | [fillData](03-forms.md#forms-fill-data) |
| `window.cp_tpl.forms.televox` | [televox](03-forms.md#forms-televox) |

## B2B

| Функция | Документация |
|---|---|
| `window.cp_tpl.b2b.hit` | [hit](06-b2b-order.md#b2b-hit) |
| `window.cp_tpl.b2b.zone` | [zone](06-b2b-order.md#b2b-zone) |
| `window.cp_tpl.b2b.getMeta` | [getMeta](06-b2b-order.md#b2b-get-meta) |
| `window.cp_tpl.b2b.getMetaAsync` | [getMetaAsync](06-b2b-order.md#b2b-get-meta-async) |
| `window.cp_tpl.b2b.order` | [order](06-b2b-order.md#b2b-order) |

## CJM

| Функция | Документация |
|---|---|
| `window.cp_tpl.cjm.init` | [init](05-cjm.md#cjm-init) |
| `window.cp_tpl.cjm.addProducts` | [addProducts](05-cjm.md#cjm-add-products) |
| `window.cp_tpl.cjm.validateProducts` | [validateProducts](05-cjm.md#cjm-validate-products) |
| `window.cp_tpl.cjm.initButton` | [initButton](05-cjm.md#cjm-init-button) |
| `window.cp_tpl.cjm.resolveProduct` | [resolveProduct](05-cjm.md#cjm-resolve-product) |
| `window.cp_tpl.cjm.getProductConfigurations` | [getProductConfigurations](05-cjm.md#cjm-product-configurations) |

## UI

| Функция | Документация |
|---|---|
| `window.cp_tpl.marquee` | [marquee](07-ui-helpers.md#marquee) |
| `window.cp_tpl.media` | [media](07-ui-helpers.md#media) |
| `window.cp_tpl.scrollIndicator` | [scrollIndicator](07-ui-helpers.md#scroll-indicator) |
| `window.cp_tpl.spacer` | [spacer](07-ui-helpers.md#spacer) |
| `window.fitTildaSpacer` | [fitTildaSpacer](07-ui-helpers.md#fit-tilda-spacer) |
| `window.cp_tpl.switchBlocks` | [switchBlocks](07-ui-helpers.md#switch-blocks) |
| `window.cp_tpl.copy` | [copy](07-ui-helpers.md#copy) |

## Сервисные и Terms

| Функция | Документация |
|---|---|
| `waitForZoneJs` | [Сервисные скрипты](08-service-scripts.md#wait-for-zone-js) |
| `window.initTerms` | [Terms → initTerms](11-terms.md#init-terms) |
| `window.debugTerms` | [Terms → debugTerms](11-terms.md#debug-terms) |

## Методы, возвращаемые публичными функциями

Эти методы не лежат напрямую в `window.cp_tpl`, но являются частью пользовательского API возвращаемых объектов:

| Получение объекта | Метод |
|---|---|
| `var hidden = window.cp_tpl.hiddenFields(...)` | [hidden.apply()](04-hidden-fields-and-utm.md#hidden-apply), [hidden.destroy()](04-hidden-fields-and-utm.md#hidden-destroy) |
| `var utm = window.cp_tpl.utm(...)` | [utm.buildUtmMarks(extra, buildConfig)](04-hidden-fields-and-utm.md#utm-instance-build-marks) |
| `var selection = window.cp_tpl.forms.selectAll(...)` | [selection.getFormIds()](03-forms.md#selection-get-form-ids), [selection.scan()](03-forms.md#selection-scan), [selection.finish(reason)](03-forms.md#selection-finish) |
| `var hit = window.cp_tpl.b2b.hit(...)` | [hit.get()](06-b2b-order.md#hit-get), [hit.refresh()](06-b2b-order.md#hit-refresh) |
| `var order = window.cp_tpl.b2b.order(...)` | [order.createFormSnapshot(form)](06-b2b-order.md#order-create-form-snapshot), [order.buildPayload(formOrSnapshot, globalMeta)](06-b2b-order.md#order-build-payload), [order.send(formOrSnapshot)](06-b2b-order.md#order-send) |
| `var spacer = window.cp_tpl.spacer(...)` | [spacer.fit()](07-ui-helpers.md#spacer-fit) |
| `var switcher = window.cp_tpl.switchBlocks(...)` | [switcher.activate(index)](07-ui-helpers.md#switcher-activate) |

## Проверка покрытия

После изменения публичного API запусти:

```bash
node scripts/check-docs-api.cjs
```

Checker извлекает публичные функции из `helpers.js`/`terms.js` и падает, если для какой-либо из них нет отдельного раздела со «Стандартным вызовом» и «Полным вызовом». Это не заменяет review качества текста, но защищает от полного выпадения новой функции из docs.
