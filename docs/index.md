---
layout: home
title: cp_tpl docs
nav_order: 1
permalink: /
search_keywords: >-
  documentation docs api поиск search функции аргументы примеры cp_tpl helpers tilda quick start справочник
---
# cp_tpl docs

`cp_tpl` — JS-библиотека для Tilda-лендингов. В `helpers.js` собраны GTM, адаптивный `zoom`, логотипы, hidden-поля, UTM, формы/Televox, B2B order, CJM/easyPaymentFlow, scroll/media и UI helpers. В репозитории также есть отдельный `terms.js` для legal agreements.

> Поиск индексирует не только текст страниц, но и дополнительные aliases/ключевые слова. Можно искать по полному API (`cp_tpl.forms.selectAll`), короткому имени (`selectAll`), аргументу (`waitForStableDom`) или задаче (`выбрать все формы`).

## Оглавление

1. [Быстрый старт](01-quick-start.md)
2. [Core helpers: GTM, zoom, logo, T396, scripts](02-core.md)
3. [Формы: selectAll, fillData, televox](03-forms.md)
4. [Hidden fields и UTM](04-hidden-fields-and-utm.md)
5. [CJM и продукты](05-cjm.md)
6. [B2B order](06-b2b-order.md)
7. [UI-хелперы](07-ui-helpers.md)
8. [Сервисные скрипты helpers.js](08-service-scripts.md)
9. [GitHub Pages и поиск](09-github-pages.md)
10. [Рецепты и частые сценарии](10-recipes.md)
11. [`terms.js`: соглашения](11-terms.md)
12. [API index: все публичные функции](12-api-index.md)

## Подключение `helpers.js`

```html
<script src="https://cdn.jsdelivr.net/gh/avelkoskyeng/tilda@latest/helpers.js"></script>
```

Для продакшна лучше использовать ссылку на конкретный tag или commit, чтобы лендинг не поменял поведение неожиданно после обновления `main`.

## Быстрый пример

```html
<script>
  window.cp_tpl.hiddenFields({
    cjmProductId: 'adult_english_not_native_speaker_premium',
    comment: 'landing-comment'
  });

  window.cp_tpl.utm({
    parameters: {
      product: {
        value: 'type-skyeng_action|name-example',
        type: 'hard'
      }
    }
  });

  window.cp_tpl.forms.selectAll({
    onReady: function () {
      window.cp_tpl.forms.televox({
        importGroup: 12491
      });
    }
  });

  window.cp_tpl.cjm.init();
</script>
```

## Правило для документации API

Каждая публичная функция должна иметь:

1. стандартный, самый частый пример вызова;
2. полный пример со всеми поддерживаемыми аргументами;
3. таблицу аргументов с типом, default и объяснением «что/зачем»;
4. описание return value и возвращаемых методов, если они есть;
5. поисковые aliases в `search_keywords`.

Полный список публичного API находится в [API index](12-api-index.md).
