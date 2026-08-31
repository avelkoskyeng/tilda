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

Just the Docs search дополнен полем `search_keywords`, которое подмешивается в Lunr index через:

```txt
docs/_includes/lunr/custom-data.json
docs/_includes/lunr/custom-index.js
```

Это позволяет находить API по aliases, русским формулировкам, аргументам и частым задачам, даже если конкретная фраза не встречается в основном тексте страницы.

## Проверка покрытия API

После изменения публичных функций запусти:

```bash
node scripts/check-docs-api.cjs
```

Команда падает, если публичная функция из `helpers.js` или `terms.js` нигде не упомянута в Markdown docs.

## Структура

```txt
helpers.js
terms.js
style_tpl.css
readme.md
scripts/
  check-docs-api.cjs
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
