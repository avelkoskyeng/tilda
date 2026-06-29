---
layout: home
title: cp_tpl docs
nav_order: 1
permalink: /
---
# cp_tpl docs

`cp_tpl` — JS-библиотека для Tilda-лендингов. Она собирает в одном `helpers.js` типовые сценарии: GTM, адаптивный `zoom`, логотипы, hidden-поля, UTM, Televox, B2B order, CJM/easyPaymentFlow, скролл-индикаторы, медиа-хелперы и мелкие UI-утилиты.


> Документация оформлена как GitHub Pages-сайт на Just the Docs Dark: слева навигация по главам, сверху поиск по всем страницам.

## Оглавление

1. [Быстрый старт](01-quick-start.md)
2. [Core helpers: GTM, zoom, logo, scripts](02-core.md)
3. [Формы: selectAll, fillData, televox](03-forms.md)
4. [Hidden fields и UTM](04-hidden-fields-and-utm.md)
5. [CJM и продукты](05-cjm.md)
6. [B2B order](06-b2b-order.md)
7. [UI-хелперы](07-ui-helpers.md)
8. [Сервисные скрипты в хвосте файла](08-service-scripts.md)
9. [GitHub Pages и публикация документации](09-github-pages.md)
10. [Рецепты и частые сценарии](10-recipes.md)

## Подключение

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
    onReady: function (formIds) {
      window.cp_tpl.forms.televox({
        importGroup: 12491
      });
    }
  });

  window.cp_tpl.cjm.init();
</script>
```

## Важные правила

- `window.cp_tpl` создаётся автоматически.
- Методы можно вызывать независимо: подключай только то, что нужно на странице.
- Для Tilda-форм методы обычно надо запускать после загрузки `helpers.js`, но не обязательно ждать `DOMContentLoaded`: большинство методов сами ждут готовность DOM.
- Для CJM-продуктов `id` должен быть уникальным.
- Если продукт известен заранее, самый надёжный способ указать его — hidden-поле `cjmProductId`.
- Если на странице несколько форм, всегда думай о том, из какой именно формы читаются hidden-поля.
- Хвостовые сервисные блоки после `helpers.js` не относятся к `window.cp_tpl`, но тоже выполняются на странице.
