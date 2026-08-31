---
layout: default
title: GitHub Pages
nav_order: 10
search_keywords: >-
  github pages docs publish публикация just the docs search lunr keywords поиск keyword custom index deploy
---
# GitHub Pages и публикация документации

Документация публикуется из папки `/docs` через GitHub Pages и тему Just the Docs.

## Актуальная структура

```txt
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
helpers.js
terms.js
scripts/
  check-docs-api.cjs
readme.md
```

## Настройки GitHub Pages

В GitHub:

1. Открыть репозиторий.
2. Перейти в `Settings -> Pages`.
3. В `Build and deployment` выбрать `Deploy from a branch`.
4. Ветка: `main`.
5. Папка: `/docs`.
6. Нажать `Save`.

Для проекта `avelkoskyeng/tilda` сайт публикуется по адресу:

```txt
https://avelkoskyeng.github.io/tilda/
```

## Базовая конфигурация Just the Docs

Ключевые настройки находятся в `docs/_config.yml`:

```yml
remote_theme: just-the-docs/just-the-docs
color_scheme: dark
search_enabled: true
heading_anchors: true

search.heading_level: 3
search.previews: 3
search.preview_words_before: 5
search.preview_words_after: 12
search.rel_url: true
search.button: true
search.focus_shortcut_key: "k"
search.tokenizer_separator: /[\s\-\/\._]+/
```

`heading_level: 3` делает большие API-страницы более гранулярными в выдаче. Tokenizer дополнительно разбивает dotted/underscored имена вроде `cp_tpl.forms.selectAll`, чтобы запросы `cp_tpl`, `forms`, `selectAll` и их комбинации находились предсказуемее.

## Дополнительные ключевые слова для поиска

Just the Docs по умолчанию индексирует title/content/URL, но не произвольные поля front matter. Поэтому в проекте добавлен отдельный `search_keywords`.

Пример страницы:

```md
---
layout: default
title: Формы
nav_order: 4
search_keywords: >-
  forms form форма формы выбрать все формы select all selectedFormIds
  fill data page data share televox import group
---
```

В `docs/_includes/lunr/custom-data.json` поле добавляется в generated search data:

```liquid
{%- capture newline %}
{% endcapture -%}
"search_keywords": {{ include.page.search_keywords | default: "" | markdownify | replace:newline,' ' | strip_html | normalize_whitespace | strip | jsonify }},
```

А `docs/_includes/lunr/custom-index.js` подмешивает его к searchable content:

```js
var cpTplSearchContent = [docs[i].content, docs[i].search_keywords];
docs[i].content = cpTplSearchContent.filter(Boolean).join(' ');
```

### Как подбирать `search_keywords`

Для каждой API-страницы добавляй:

- полное имя функции и короткое имя;
- английские и русские варианты термина;
- частую задачу пользователя: «редирект после формы», «скопировать промокод», «выбрать все формы»;
- названия важных аргументов и глобальных интеграций;
- старые/разговорные названия, по которым функцию реально ищут.

Не нужно дублировать весь текст страницы: keywords должны закрывать только алиасы и формулировки, которых нет в основном контенте.

## Placeholder и shortcut поиска

`docs/_includes/search_placeholder_custom.html` меняет placeholder на:

```txt
Поиск по функциям, аргументам и ключевым словам
```

`Ctrl + K` / `Cmd + K` переводит фокус в поиск.

## Навигация

Каждая страница начинается с front matter:

```md
---
layout: default
title: Формы
nav_order: 4
search_keywords: >-
  forms форма televox
---
```

`title` задаёт название в sidebar, `nav_order` — порядок, `search_keywords` — дополнительные поисковые aliases.

Главная страница использует `layout: home` и `permalink: /`.

## Проверка покрытия публичного API

После изменения `helpers.js` или `terms.js` запусти:

```bash
node scripts/check-docs-api.cjs
```

Скрипт извлекает публичные `window.cp_tpl.*`, публичные function aliases, намеренно создаваемые globals и функции `terms.js`. Если функция нигде не упомянута в Markdown, команда завершится с ошибкой и покажет список пропусков.

Важно: checker проверяет наличие функции в docs, но не качество описания. Для новой функции всё равно нужно вручную добавить:

1. стандартный, самый частый вызов;
2. полный вызов со всеми поддерживаемыми аргументами;
3. описание каждого аргумента, default и практический смысл;
4. возвращаемое значение/методы;
5. `search_keywords` с aliases и пользовательскими формулировками.

## Проверка после deploy

1. Убедиться, что GitHub Pages build завершился без ошибки.
2. Сделать hard refresh: `Cmd/Ctrl + Shift + R`.
3. Проверить sidebar и API index.
4. Проверить поиск по полному имени: `cp_tpl.forms.selectAll`.
5. Проверить поиск по части имени: `selectAll`, `forms`.
6. Проверить русский alias: например `выбрать все формы`.
7. Проверить аргумент: например `waitForStableDom`.
8. Проверить `Ctrl/Cmd + K`.

## Частые проблемы

### Новые keywords не находятся

Проверь три вещи:

- в front matter страницы есть `search_keywords`;
- файлы `_includes/lunr/custom-data.json` и `custom-index.js` попали в репозиторий;
- GitHub Pages уже пересобрал сайт после commit.

### Сайт собирается из root, а не из docs

В `Settings -> Pages` должно быть:

```txt
Branch: main / docs
```

### Навигация не появилась

Проверь `layout`, `title` и `nav_order` в front matter страницы.
