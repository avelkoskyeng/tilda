---
layout: default
title: GitHub Pages
nav_order: 10
---
# GitHub Pages и публикация документации

Эта документация рассчитана на публикацию из папки `/docs` через GitHub Pages.

## Рекомендуемая структура

```txt
docs/
  _config.yml
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
helpers.js
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

После этого `docs/index.md` станет главной страницей сайта.

Для проекта `avelkoskyeng/tilda` адрес будет таким:

```txt
https://avelkoskyeng.github.io/tilda/
```

## Тема Just the Docs Dark

В `_config.yml` используется Just the Docs в тёмной теме:

```yml
title: cp_tpl docs
description: Документация по JS-хелперам helpers.js для Tilda

url: "https://avelkoskyeng.github.io"
baseurl: "/tilda"

remote_theme: just-the-docs/just-the-docs
color_scheme: dark
search_enabled: true
heading_anchors: true

aux_links:
  GitHub:
    - "https://github.com/avelkoskyeng/tilda"
  helpers.js:
    - "https://github.com/avelkoskyeng/tilda/blob/main/helpers.js"
aux_links_new_tab: true

plugins:
  - jekyll-remote-theme
```

`remote_theme` подключает тему из GitHub-репозитория темы. `plugins: jekyll-remote-theme` нужен GitHub Pages, чтобы собрать сайт с remote theme.

## Навигация

Каждая страница в `docs` начинается с front matter:

```md
---
layout: default
title: Формы
nav_order: 4
---
```

`title` — название в боковом меню.

`nav_order` — порядок в навигации.

Главная страница использует layout `home`:

```md
---
layout: home
title: cp_tpl docs
nav_order: 1
permalink: /
---
```

## Что удалить из старой версии

Если раньше пробовали другие темы, можно удалить:

```txt
docs/assets/main.scss
docs/assets/css/dark.css
docs/assets/css/style.scss
docs/_includes/custom-head.html
```

Для Just the Docs Dark эти файлы не нужны.

## Проверка после деплоя

1. Дождаться завершения Pages deploy.
2. Открыть опубликованный сайт.
3. Сделать hard refresh: `Cmd/Ctrl + Shift + R`.
4. Проверить, что слева появилась боковая навигация Just the Docs.
5. Проверить поиск в верхней части страницы.

## Частые проблемы

### Сайт всё ещё выглядит старым

Скорее всего, GitHub Pages ещё не пересобрал сайт или браузер держит старый CSS. Подожди пару минут и сделай hard refresh.

### Сайт собирается из root, а не из docs

В `Settings -> Pages` должно быть:

```txt
Branch: main / docs
```

Если там `main / (root)`, будет публиковаться корень репозитория, а не документация.

### Навигация не появилась

Проверь, что у страниц есть front matter с `layout`, `title` и `nav_order`.
