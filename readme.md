# cp_tpl

`cp_tpl` — общая JS-библиотека для Tilda-лендингов. Она помогает быстро подключать типовые сценарии: GTM, адаптивный zoom, логотипы, hidden-поля, UTM, формы Televox, B2B order, CJM/easyPaymentFlow, скролл-индикаторы и другие небольшие UI-хелперы.

Документация разбита на главы в папке [`docs`](./docs/index.md). Если включить GitHub Pages для папки `/docs`, эти markdown-файлы можно использовать как небольшой сайт документации.

## Оглавление

1. [Быстрый старт](./docs/quick-start.md)
2. [Формы: `selectAll`, `fillData`, `televox`](./docs/forms.md)
3. [Hidden fields и UTM](./docs/hidden-fields-and-utm.md)
4. [CJM и продукты](./docs/cjm.md)
5. [B2B order](./docs/b2b-order.md)
6. [UI-хелперы](./docs/ui-helpers.md)
7. [Публикация документации через GitHub Pages](./docs/github-pages.md)

## Подключение

```html
<script src="https://cdn.jsdelivr.net/gh/avelkoskyeng/tilda@latest/helpers.js"></script>
```

Для тестов лучше подключать конкретный commit или отдельную ветку, чтобы не ловить кэш и случайные изменения `@latest`.

## Самые частые сценарии

### Добавить hidden-поля в формы

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
</script>
```

По умолчанию `hiddenFields` ставит значения как дефолты: если другой скрипт позже поменял значение поля, библиотека не откатит его назад.

### Выбрать все формы и подготовить Televox

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

### Передать данные формы между страницами

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

### B2B order

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

`b2b.order` делает snapshot формы до того, как Tilda очистит поля после успешной отправки.

### CJM: один продукт на форме

```html
<script>
  window.cp_tpl.hiddenFields({
    cjmProductId: 'adult_english_not_native_speaker_premium'
  });

  window.cp_tpl.cjm.init();
</script>
```

### CJM: несколько продуктов через select

```html
<script>
  window.cp_tpl.cjm.init({
    productIdMap: {
      'Английский': 'adult_english_not_native_speaker_premium',
      'Французский': 'adult_french_not_native_speaker_premium',
      'Немецкий': 'adult_german_not_native_speaker_premium'
    }
  });
</script>
```

### CJM: кастомные продукты на странице

```html
<script>
  window.cp_tpl.cjm.init({
    products: [
      {
        brand: 'skyeng',
        label: 'Английский',
        selectValues: ['Английский', 'english'],
        id: 'adult_english_course_elementary',
        selectedStk: 'english_adult_not_native_speaker_course_elementary'
      }
    ]
  });
</script>
```

Кастомные продукты из `cjm.init({ products })` имеют приоритет над продуктами из `cp_tpl.cjm.addProducts(...)`, а те — над дефолтным каталогом `cp_tpl.cjm.products`.

## Правила безопасности для CJM-продуктов

- `id` продукта должен быть уникальным.
- `productKitCode` может повторяться, если разные `kitTariffUuid`.
- Если продукт известен заранее, лучше использовать `cjmProductId`.
- Если select-value однозначно совпадает с одним продуктом в кастомном конфиге, `productIdMap` не нужен.
- Если один и тот же select-value может означать разные продукты внутри одной формы, используйте `productIdMap` или обновляйте hidden `cjmProductId`.
- Скрипт не должен молча выбирать первый продукт при неоднозначности: лучше увидеть ошибку в консоли, чем отправить заявку не в тот продукт.

## Структура документации

```txt
README.md
docs/
  index.md
  quick-start.md
  forms.md
  hidden-fields-and-utm.md
  cjm.md
  b2b-order.md
  ui-helpers.md
  github-pages.md
  _config.yml
```

## Версия

Актуальная логика в этой документации описывает v8:

- `forms.fillData`
- безопасные `hiddenFields`
- snapshot в `b2b.order`
- `cjmProductId`
- `productIdMap` / `productIdMaps`
- каскадный приоритет кастомных CJM-продуктов
- безопасный resolver без молчаливого выбора первого кандидата
