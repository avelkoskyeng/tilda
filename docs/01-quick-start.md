---
layout: default
title: Быстрый старт
nav_order: 2
search_keywords: >-
  quick start быстрый старт подключение install cdn hidden fields televox fillData cjm b2b пример начать
---
# Быстрый старт

## 1. Подключить библиотеку

```html
<script src="https://cdn.jsdelivr.net/gh/avelkoskyeng/tilda@latest/helpers.js"></script>
```

Рекомендация: для стабильных лендингов использовать tag или commit вместо `@latest`.

```html
<script src="https://cdn.jsdelivr.net/gh/avelkoskyeng/tilda@<commit_hash>/helpers.js"></script>
```

## 2. Добавить hidden-поля

```html
<script>
  window.cp_tpl.hiddenFields({
    promoCode: '',
    marketing_experiments: '',
    comment: '',
    subscription_attributes_comment: '',
    serviceTypeKey: '',
    productKitCode: '',
    tariffUuid: '',
    cjmProductId: ''
  });
</script>
```

По умолчанию `hiddenFields` работает безопасно: он создаёт поле и ставит дефолтное значение, но не перетирает значение, которое позже поменял другой скрипт.

## 3. Подключить формы Televox

```html
<script>
  window.cp_tpl.forms.selectAll({
    onReady: function (formIds) {
      window.cp_tpl.forms.televox({
        importGroup: 12491
      });
    }
  });
</script>
```

`selectAll` найдёт все формы, проставит им уникальные `id`, сохранит список в `window.selectedFormIds` и вызовет `onReady(formIds)`.

## 4. Заполнить данные с предыдущей страницы

Если используется внешняя библиотека `skyengTildaPageDataShare`:

```html
<script>
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
</script>
```

`fillData` сам найдёт zero-block records форм и вызовет `window.skyengTildaPageDataShare.getData('#rec...')` для каждой формы.

## 5. Подключить CJM

### Один продукт на странице

```html
<script>
  window.cp_tpl.hiddenFields({
    cjmProductId: 'adult_english_not_native_speaker_premium'
  });

  window.cp_tpl.cjm.init();
</script>
```

### Несколько продуктов через select

```html
<script>
  window.cp_tpl.cjm.init({
    productIdMap: {
      'Английский': 'adult_english_not_native_speaker_premium',
      'Французский': 'adult_french_not_native_speaker_premium'
    }
  });
</script>
```

## 6. Отправка B2B order

```html
<script>
  window.cp_tpl.b2b.order({
    redirectToLoginLink: false,
    onSuccess: function (data) {
      console.log(data.payload);
      window.location.href = 'https://corp.skysmart.ru/testing/final';
    }
  });
</script>
```

`b2b.order` делает snapshot формы сразу в момент `t396_onSuccess`, поэтому Tilda может очистить форму после отправки — значения для API уже сохранены.
