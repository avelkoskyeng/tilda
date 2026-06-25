---
title: Быстрый старт
---

# Быстрый старт

## Подключение

```html
<script src="https://cdn.jsdelivr.net/gh/avelkoskyeng/tilda@latest/helpers.js"></script>
```

Для продакшена можно использовать `@latest`, но для тестов удобнее подключать конкретный commit или ветку.

## Базовый шаблон страницы

```html
<script>
  window.cp_tpl.hiddenFields({
    promoCode: '',
    marketing_experiments: '',
    comment: '',
    serviceTypeKey: '',
    productKitCode: '',
    tariffUuid: '',
    cjmProductId: ''
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
</script>
```

## Порядок подключения

Рекомендуемый порядок:

1. Подключить `helpers.js`.
2. Вызвать методы, которые создают поля и глобальные параметры: `hiddenFields`, `utm`.
3. Инициализировать формы: `forms.selectAll`, `forms.televox`, `forms.fillData`.
4. Инициализировать бизнес-логику: `b2b.order`, `cjm.init`.
5. Инициализировать UI-хелперы: `scrollIndicator`, `marquee`, `media`, `spacer`.

## Что не нужно делать

Не нужно вызывать методы инициализации внутри `t396Success`, если метод сам вешает обработчик.

Плохо:

```js
window.cp_tpl.t396Success(function () {
  window.cp_tpl.b2b.order();
});
```

Хорошо:

```js
window.cp_tpl.b2b.order();
```
