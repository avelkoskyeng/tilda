# Краткое руководство по `window.cp_tpl`

Перед использованием любого метода на странице должен быть подключён общий файл библиотеки:

```html
<script src=".../helpers.js"></script>
```

После этого на лендинге вызываются только нужные функции.

---

## `window.cp_tpl.gtm(config)`

Подключает GTM-контейнер.

### Быстрый вызов

```js
window.cp_tpl.gtm('skyeng');
```

Доступные бренды:

```js
window.cp_tpl.gtm('skyeng');
window.cp_tpl.gtm('skysmart');
window.cp_tpl.gtm('b2b');
```

Можно передать GTM ID напрямую:

```js
window.cp_tpl.gtm('GTM-XXXXXXX');
```

Или объектом:

```js
window.cp_tpl.gtm({
  brand: 'skyeng',
  dataLayer: 'dataLayer'
});
```

---

## `window.cp_tpl.zoom(config)`

Добавляет адаптивный `zoom` для элемента.

### Простой вызов

```js
window.cp_tpl.zoom('.myEl');
```

По умолчанию:

```js
desktopBase: 1200
mobileBase: 376
breakpoint: 640
```

### Расширенный вызов

```js
window.cp_tpl.zoom({
  selector: '.hero-wrapper',
  desktopBase: 1200,
  mobileBase: 376,
  breakpoint: 640
});
```

Метод сам создаёт CSS и обновляет CSS-переменные при ресайзе.

---

## `window.cp_tpl.logo(config)`

Подставляет нужный логотип в картинку или background.

```js
window.cp_tpl.logo({
  selector: '.js-logo',
  brand: 'skyeng',
  color: 'white'
});
```

Доступные бренды:

```js
skyeng
skysmart
b2b
skypro
```

Доступные цвета:

```js
white
black
```

Если нужно поставить логотип фоном:

```js
window.cp_tpl.logo({
  selector: '.logo-bg',
  brand: 'skysmart',
  color: 'black',
  mode: 'background'
});
```

Можно передать свой URL:

```js
window.cp_tpl.logo({
  selector: '.js-logo',
  src: 'https://.../logo.svg'
});
```

---

## `window.cp_tpl.hiddenFields(fields, config)`

Добавляет hidden-поля во все формы.

```js
window.cp_tpl.hiddenFields({
  promoCode: '',
  marketing_experiments: 'cashbackoftheday',
  comment: 'кешбекдня'
});
```

По умолчанию ищет:

```js
form .t-form__inputsbox
```

Можно ограничить конкретными формами:

```js
window.cp_tpl.hiddenFields(
  {
    comment: 'тестовый лендинг'
  },
  {
    formSelector: '.uc-main-form form'
  }
);
```

---

## `window.cp_tpl.t396Success(handler, config)`

Добавляет кастомную логику на успешную отправку Tilda Zero Block формы.

```js
window.cp_tpl.t396Success(function (ctx) {
  var form = ctx.form;

  console.log('Форма успешно отправлена:', form);
});
```

По умолчанию обработчик выполняется **до** оригинального `t396_onSuccess`.

Можно выполнить после:

```js
window.cp_tpl.t396Success(function (ctx) {
  console.log('После оригинального t396_onSuccess');
}, {
  stage: 'after'
});
```

---

## `window.cp_tpl.t396Redirect(url, config)`

Редиректит после успешной отправки формы.

```js
window.cp_tpl.t396Redirect('https://study.skyeng.ru/1000languages/final');
```

По умолчанию сохраняет текущие GET-параметры страницы.

Отключить перенос параметров:

```js
window.cp_tpl.t396Redirect('https://study.skyeng.ru/1000languages/final', {
  appendSearch: false
});
```

---

## `window.cp_tpl.utm(config)`

Добавляет UTM/CJM-параметры в текущий URL и создаёт `window.buildUtmMarks`.

```js
window.cp_tpl.utm({
  parameters: {
    product: {
      value: 'type-skyeng_action|name-cashbackoftheday',
      type: 'hard'
    }
  }
});
```

Типы параметров:

```js
type: 'hard' // всегда перезаписывает параметр
type: 'soft' // добавляет только если параметра ещё нет
```

С дополнительными параметрами:

```js
window.cp_tpl.utm({
  parameters: {
    product: {
      value: 'type-skyeng_action|name-cashbackoftheday',
      type: 'hard'
    }
  },
  extraParams: {
    promocode: 'FRIDAY'
  }
});
```

После вызова доступно:

```js
window.buildUtmMarks()
```

---

## `window.cp_tpl.marquee(config)`

Инициализирует бесконечную бегущую строку.

```js
window.cp_tpl.marquee('.marquee--infinite');
```

HTML-структура должна быть такой:

```html
<div class="marquee--infinite">
  <div>
    <div>item 1</div>
    <div>item 2</div>
    <div>item 3</div>
  </div>
</div>
```

Со своей скоростью:

```js
window.cp_tpl.marquee({
  selector: '.marquee--infinite',
  speed: 90
});
```

Чем больше `speed`, тем быстрее движение.

---

## `window.cp_tpl.media(config)`

Инициализирует поведение аудио/видео: play/pause по клику, иконки, таймер для аудио, остановка других видео.

```js
window.cp_tpl.media();
```

По умолчанию ищет контейнеры:

```js
[class*="videos"]
```

Кастомный селектор:

```js
window.cp_tpl.media({
  containerSelector: '.uc-videos',
  videoSelector: 'video'
});
```

Отключить остановку других видео:

```js
window.cp_tpl.media({
  pauseOthers: false
});
```

---

## `window.cp_tpl.scrollIndicator(config)`

Инициализирует точки-индикаторы для горизонтального скролла.

```js
window.cp_tpl.scrollIndicator();
```

Ожидаемая структура:

```html
<div class="uc-scroll-block">
  <div class="add_mob_scroll_indicator">
    <div>
      <!-- горизонтально скроллящийся контент -->
    </div>
  </div>

  <div class="scroll-indicator">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</div>
```

Начать скролл с середины:

```js
window.cp_tpl.scrollIndicator({
  start: 'middle'
});
```

Или добавить классы:

```html
<div class="add_mob_scroll_indicator --scroll-mid">
...
</div>

<div class="scroll-indicator --scroll-mid">
...
</div>
```

---

## `window.cp_tpl.spacer(config)`

Автоматически растягивает `.empty_spacer`, чтобы страница занимала высоту экрана без лишнего вертикального скролла.

В HTML:

```html
<div class="empty_spacer"></div>
```

В JS:

```js
window.cp_tpl.spacer();
```

Кастомные селекторы:

```js
window.cp_tpl.spacer({
  allrecordsSelector: '#allrecords',
  spacerSelector: '.empty_spacer',
  safetyGap: 0
});
```

Метод также создаёт глобальную функцию:

```js
window.fitTildaSpacer()
```

Её можно вызвать вручную после изменения контента.

---

## `window.cp_tpl.switchBlocks(config)`

Переключает блоки по триггерам.

```js
window.cp_tpl.switchBlocks();
```

По умолчанию:

```js
blockSelector: '[class*="uc-vitrina"]'
triggerSelector: '[class*="trigger"]:not([class*="mob_trigger"])'
mobileTriggerSelector: '[class*="mob_trigger"]'
```

Пример:

```js
window.cp_tpl.switchBlocks({
  blockSelector: '[class*="uc-vitrina"]',
  triggerSelector: '[class*="trigger"]:not([class*="mob_trigger"])',
  mobileTriggerSelector: '[class*="mob_trigger"]',
  initialIndex: 0
});
```

Можно сохранить инстанс и переключать вручную:

```js
var switcher = window.cp_tpl.switchBlocks();

switcher.activate(2);
```

---

## `window.cp_tpl.copy(config)`

Копирует текст в буфер и показывает уведомление.

```js
window.cp_tpl.copy({
  selector: '.copy-promocode',
  text: 'FRIDAY'
});
```

Можно брать текст из `data-copy`:

```html
<div class="copy-promocode" data-copy="FRIDAY">
  Скопировать промокод
</div>
```

```js
window.cp_tpl.copy({
  selector: '.copy-promocode'
});
```

Кастомный текст уведомления:

```js
window.cp_tpl.copy({
  selector: '.copy-promocode',
  text: 'FRIDAY',
  alertText: 'Промокод скопирован',
  hideDelay: 1000
});
```

---

## `window.cp_tpl.viewport(config)`

Меняет viewport для планшетного диапазона.

```js
window.cp_tpl.viewport({
  min: 640,
  max: 1200,
  width: 1400
});
```

По умолчанию проверяет `screen.width`.

Если нужно проверять `innerWidth`:

```js
window.cp_tpl.viewport({
  useScreenWidth: false
});
```

---

## `window.cp_tpl.loadScript(config)`

Универсально подключает внешний JS-файл.

```js
window.cp_tpl.loadScript({
  id: 'custom-script',
  src: 'https://example.com/script.js',
  cacheBust: true
});
```

Короткий вызов:

```js
window.cp_tpl.loadScript('https://example.com/script.js');
```

---

## `window.cp_tpl.widgets(config)`

Подключает файл виджетов Skyeng.

```js
window.cp_tpl.widgets();
```

По умолчанию подключает:

```js
https://widgets-host.skyeng.ru/loader.js
```

С кастомным URL:

```js
window.cp_tpl.widgets({
  src: 'https://widgets-host.skyeng.ru/loader.js',
  cacheBust: true
});
```

---

# Формы

## `window.cp_tpl.forms.selectAll(config)`

Находит все Tilda-формы на странице, назначает им уникальные ID и сохраняет список в:

```js
window.selectedFormIds
```

Базовый вызов:

```js
window.cp_tpl.forms.selectAll();
```

После выполнения можно получить ID форм:

```js
window.selectedFormIds
```

С callback:

```js
window.cp_tpl.forms.selectAll({
  onReady: function (formIds) {
    console.log(formIds);
  }
});
```

---

## `window.cp_tpl.forms.televox(config)`

Добавляет Televox hidden-поля во все формы и обновляет их перед взаимодействием с формой.

```js
window.cp_tpl.forms.televox({
  importGroup: 12491
});
```

С правилами дедубликации:

```js
window.cp_tpl.forms.televox({
  importGroup: 12491,
  rules: [
    'client_in_black_list',
    'client_is_active'
  ]
});
```

Если нужно передать конкретные формы вручную:

```js
window.cp_tpl.forms.televox({
  autoSelect: false,
  formIds: ['form123', 'form456'],
  importGroup: 12491
});
```

---

## `window.cp_tpl.forms.behavior(config)`

Настраивает поведение форм через `window.skyengTildaForms`: ошибки, успех, авторизованный пользователь.

```js
window.cp_tpl.forms.behavior({
  formSelector: '.uc-form',
  bumpSelector: '.uc-bump',
  authFormSelector: '.uc-auth-form'
});
```

Что делает:

* при ошибках типа `EMAIL_OR_PHONE_ALREADY_EXIST`, `ALREADY_LOGGED_IN`, `ALREADY_EXIST_ORDER` скрывает форму и показывает bump-блок;
* при успешной отправке скрывает форму и показывает bump-блок;
* если пользователь авторизован, скрывает обычную форму и показывает auth-блок.

Можно добавить свои callback:

```js
window.cp_tpl.forms.behavior({
  formSelector: '.uc-form',
  bumpSelector: '.uc-bump',
  authFormSelector: '.uc-auth-form',

  onSuccess: function () {
    console.log('Форма успешно отправлена');
  },

  onAuthUser: function (user) {
    console.log('Авторизованный пользователь:', user);
  }
});
```

---

# B2B

## `window.cp_tpl.b2b.hit(config)`

Получает текущий hit id из `window.skyengTrackHits`.

```js
window.cp_tpl.b2b.hit();
```

По умолчанию создаёт глобальную переменную:

```js
window.getHit
```

С настройками:

```js
window.cp_tpl.b2b.hit({
  delay: 2000,
  retries: 10,
  retryDelay: 500
});
```

Получить значение вручную:

```js
var hit = window.cp_tpl.b2b.hit().get();
```

---

## `window.cp_tpl.b2b.zone(config)`

Определяет timezone по offset и сохраняет её в:

```js
window.getZone
```

Вызов:

```js
window.cp_tpl.b2b.zone();
```

Можно сразу получить значение:

```js
var zone = window.cp_tpl.b2b.zone();
```

---

## `window.cp_tpl.b2b.getMeta()`

Возвращает B2B-метаданные:

```js
var meta = window.cp_tpl.b2b.getMeta();
```

Пример результата:

```js
{
  hitId: '...',
  timezone: 'Europe/Moscow'
}
```

---

## `window.cp_tpl.b2b.order(config)`

Подключает кастомную отправку B2B-заявки на API.

```js
window.cp_tpl.b2b.order();
```

Обычно на B2B-лендинге нужно вызвать вместе:

```js
window.cp_tpl.b2b.hit();
window.cp_tpl.b2b.zone();
window.cp_tpl.b2b.order();
```

Кастомный конфиг:

```js
window.cp_tpl.b2b.order({
  orderConfig: {
    generateLoginLinkTo: 'https://student.skyeng.ru/',
    landing_param_key: 'utm_page'
  }
});
```

Изменить payload перед отправкой:

```js
window.cp_tpl.b2b.order({
  transformPayload: function (payload) {
    payload.customLandingType = 'special-b2b-landing';

    return payload;
  }
});
```

Callback после успеха:

```js
window.cp_tpl.b2b.order({
  onSuccess: function (ctx) {
    console.log(ctx.payload);
    console.log(ctx.responseData);
  }
});
```

Callback при ошибке:

```js
window.cp_tpl.b2b.order({
  onError: function (error, ctx) {
    console.error(error, ctx.payload);
  }
});
```

---

# CJM

## `window.cp_tpl.cjm.products`

Это общий каталог CJM-продуктов.

Пример продукта:

```js
{
  brand: 'skysmart',
  label: 'Английский язык',
  selectValues: ['Английский', 'Английский язык', 'english'],
  id: 'kid_mini_course_kids_english_junior',
  selectedStk: 'mini_course_kids_english_junior'
}
```

Для kit-продуктов:

```js
{
  brand: 'skysmart',
  label: 'Домашний лицей 5-11 класс',
  selectValues: ['Домашний лицей 5-11 класс'],
  id: 'skysmart_homeschooling_8_grade8',
  productKitCode: 'skysmart_homeschooling_8_grade',
  kitTariffUuid: '639db64c-139f-4701-b41d-c6ab73614996'
}
```

`brand` используется для различения одинаковых пунктов в select, например «Английский язык» у Skyeng и Skysmart.

---

## `window.cp_tpl.cjm.init(config)`

Инициализирует CJM-интеграцию.

Перед вызовом в HTML должен быть компонент:

```html
<cism-easy-payment-flow-integration locale="ru"></cism-easy-payment-flow-integration>
```

Базовый вызов:

```js
window.cp_tpl.cjm.init();
```

На форме или её внешней обёртке нужно указать бренд:

```html
<div data-cp-brand="skysmart">
  <form>
    ...
  </form>
</div>
```

или:

```html
<div data-cp-brand="skyeng">
  <form>
    ...
  </form>
</div>
```

Для неавторизованной формы select может быть обычным:

```html
<select name="lessonType">
  <option value="">Выберите предмет</option>
  <option value="Английский">Английский</option>
</select>
```

Скрипт найдёт ближайший `data-cp-brand`, подберёт продукт из `cp_tpl.cjm.products` и заполнит hidden-поля:

```js
serviceTypeKey
productKitCode
tariffUuid
```

Если hidden-полей нет, скрипт создаст их сам.

---

## Точный выбор CJM-продукта через `data-cp-product-id`

Если внутри одного бренда есть два одинаковых пункта select, можно указать точный продукт:

```html
<option
  value="Английский"
  data-cp-product-id="kid_mini_course_kids_english_junior"
>
  Английский
</option>
```

В этом случае скрипт выберет продукт напрямую по `id`.

---

## Авторизованный CJM-сценарий

Для авторизованного сценария можно использовать `data-cp-mode="auth"`:

```html
<div data-cp-brand="skysmart" data-cp-mode="auth">
  <select name="subject">
    <option value="Английский">Английский</option>
  </select>
</div>
```

По умолчанию кнопка консультации ищется по селектору:

```js
'.' + select.name + '-btn'
```

Например, для:

```html
<select name="subject">
```

кнопка будет:

```html
<div class="subject-btn"></div>
```

Можно задать свой способ поиска кнопки:

```js
window.cp_tpl.cjm.init({
  getAuthButtonSelector: function (select, product) {
    return '.my-auth-button';
  }
});
```

---

## `window.cp_tpl.cjm.resolveProduct(select)`

Вручную определяет продукт по select.

```js
var select = document.querySelector('select[name="lessonType"]');
var product = window.cp_tpl.cjm.resolveProduct(select);

console.log(product);
```

Полезно для отладки.

---

## `window.cp_tpl.cjm.getProductConfigurations()`

Возвращает массив продуктов в формате для:

```js
window.easyPaymentFlow.initProductConfigurations(...)
```

```js
var configs = window.cp_tpl.cjm.getProductConfigurations();

console.log(configs);
```

Полезно для проверки, что CJM-каталог собрался правильно.

---

# Служебные блоки в конце файла

## `waitForZoneJs(...)`

Служебный блок для ожидания `Zone.js`.

Обычно вручную вызывать не нужно.

---

## `UTM -> Для ссылок`

Служебный блок, который автоматически прокидывает текущие GET-параметры в ссылки на странице.

Обычно вручную вызывать не нужно.
