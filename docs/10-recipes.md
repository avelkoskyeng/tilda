# Рецепты и частые сценарии

## Televox + selectAll

```js
window.cp_tpl.forms.selectAll({
  onReady: function () {
    window.cp_tpl.forms.televox({
      importGroup: 12491
    });
  }
});
```

## Televox + fillData с мэпингом parent-полей

```js
window.cp_tpl.forms.selectAll({
  onReady: function (formIds) {
    window.cp_tpl.forms.fillData(formIds, {
      fieldsMap: {
        email: 'parentEmail',
        phone: 'parentPhone',
        name: 'parentName'
      }
    });

    window.cp_tpl.forms.televox({
      importGroup: 12491
    });
  }
});
```

## Hidden-поля как дефолты, которые можно менять другим скриптом

```js
window.cp_tpl.hiddenFields({
  serviceTypeKey: 'mini_course_kids_physics',
  comment: ''
});

// Позже другой скрипт может поменять значение:
form.querySelector('input[name="serviceTypeKey"]').value = 'mini_course_kids_math';
```

`hiddenFields` не откатит значение назад, если `overwriteExisting` не включён.

## CJM: один продукт на форме

```js
window.cp_tpl.hiddenFields({
  cjmProductId: 'adult_english_not_native_speaker_premium'
});

window.cp_tpl.cjm.init();
```

## CJM: несколько продуктов через select

```js
window.cp_tpl.cjm.init({
  productIdMap: {
    'Английский': 'adult_english_not_native_speaker_premium',
    'Французский': 'adult_french_not_native_speaker_premium',
    'Немецкий': 'adult_german_not_native_speaker_premium'
  }
});
```

## CJM: кастомные продукты страницы

```js
window.cp_tpl.cjm.init({
  products: [
    {
      brand: 'skyeng',
      label: 'Английский',
      selectValues: ['Английский'],
      id: 'adult_english_course_elementary',
      selectedStk: 'english_adult_not_native_speaker_course_elementary'
    }
  ]
});
```

Кастомные продукты из `cjm.init({ products })` имеют приоритет над дефолтным каталогом.

## CJM: productKitCode повторяется, но тариф разный

Это нормально, если `id` уникальный:

```js
window.cp_tpl.cjm.init({
  products: [
    {
      id: 'kid_homeschooling_5_grade_tariff_a',
      label: '5 класс',
      selectValues: ['5 класс'],
      productKitCode: 'skysmart_homeschooling_5_grade',
      kitTariffUuid: 'uuid-a'
    },
    {
      id: 'kid_homeschooling_5_grade_tariff_b',
      label: '5 класс',
      selectValues: ['5 класс'],
      productKitCode: 'skysmart_homeschooling_5_grade',
      kitTariffUuid: 'uuid-b'
    }
  ]
});
```

Если оба продукта могут матчиться на один select, уточняй через `cjmProductId` или `productIdMap`.

## B2B order + свой редирект

```js
window.cp_tpl.b2b.order({
  redirectToLoginLink: false,
  openThankyou: false,
  onSuccess: function (data) {
    console.log(data.payload);
    window.location.href = 'https://corp.skysmart.ru/testing/final';
  }
});
```

## B2B order + transformPayload

```js
window.cp_tpl.b2b.order({
  transformPayload: function (payload) {
    payload.workflow = 'Special-Projects';
    return payload;
  }
});
```

## Scroll indicator для двух кастомных каруселей

```js
window.cp_tpl.scrollIndicator({
  items: [
    {
      direct: true,
      scrollSelector: '.cards-1 > div',
      dotsSelector: '.dots-1 .dot',
      start: 'middle'
    },
    {
      direct: true,
      scrollSelector: '.cards-2 > div',
      dotsSelector: '.dots-2 .dot',
      start: 'start'
    }
  ]
});
```

## Copy promocode

```js
window.cp_tpl.copy({
  selector: '.copy-promocode',
  text: function (element) {
    return element.getAttribute('data-copy') || element.textContent.trim();
  },
  alertText: 'Промокод скопирован'
});
```
