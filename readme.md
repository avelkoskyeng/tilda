# cp_tpl / helpers.js

`helpers.js` — JS-библиотека для Tilda-лендингов. `terms.js` — отдельный helper для legal agreements/checkboxes.

## Документация

Подробная документация лежит в [`docs`](docs/index.md) и публикуется через GitHub Pages с темой Just the Docs Dark.

Опубликованный сайт:

```txt
https://avelkoskyeng.github.io/tilda/
```

Главные точки входа:

- [`docs/01-quick-start.md`](docs/01-quick-start.md) — быстрый старт;
- [`docs/12-api-index.md`](docs/12-api-index.md) — полный список публичных функций;
- [`docs/09-github-pages.md`](docs/09-github-pages.md) — публикация и устройство поиска;
- [`docs/11-terms.md`](docs/11-terms.md) — `terms.js`.

## Поиск

Поиск Just the Docs расширен двумя слоями:

- `search_keywords` — общие aliases страницы;
- `search_aliases` — aliases конкретной секции/API-метода по её anchor.

Оба поля попадают в Lunr index через:

```txt
docs/_includes/lunr/custom-data.json
docs/_includes/lunr/custom-index.js
```

В `custom-index.js` также заменён стандартный ASCII-oriented Lunr trimmer на вариант, сохраняющий кириллицу. Поэтому запросы вроде `бегущая строка` могут находить `window.cp_tpl.marquee`, а `редирект после формы` — `window.cp_tpl.t396Redirect`.

## Проверка покрытия API

После изменения публичных функций или поисковых aliases запусти:

```bash
node scripts/check-docs-api.cjs
node scripts/check-docs-search.cjs
```

Первая команда проверяет покрытие публичного API документацией. Вторая проверяет кириллический trimmer, секционные aliases и соответствие alias-ключей реальным anchors.

## Структура

```txt
helpers.js
terms.js
style_tpl.css
readme.md
scripts/
  check-docs-api.cjs
  check-docs-search.cjs
docs/
  _config.yml
  _includes/
    lunr/
      custom-data.json
      custom-index.js
    search_placeholder_custom.html
  index.md
  01-quick-start.md
  02-core.md
  03-forms.md
  04-hidden-fields-and-utm.md
  05-cjm.md
  06-b2b-order.md
  07-ui-helpers.md
  08-service-scripts.md
  09-github-pages.md
  10-recipes.md
  11-terms.md
  12-api-index.md
```

## Подключение

```html
<script src="https://cdn.jsdelivr.net/gh/avelkoskyeng/tilda@latest/helpers.js"></script>
```
