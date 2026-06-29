# GitHub Pages и публикация документации

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
  assets/
    css/
      style.scss
helpers.js
readme.md
```

## Настройки Pages

В GitHub:

1. Открыть репозиторий.
2. Перейти в `Settings -> Pages`.
3. В `Build and deployment` выбрать `Deploy from a branch`.
4. Ветка: `main`.
5. Папка: `/docs`.
6. Нажать `Save`.

После этого `docs/index.md` станет главной страницей сайта.

## Тема

В `_config.yml` используется тёмная тема:

```yml
title: cp_tpl docs
description: Документация по JS-хелперам helpers.js для Tilda
theme: jekyll-theme-midnight
show_downloads: false
```

Дополнительные стили лежат в:

```txt
docs/assets/css/style.scss
```

Файл должен начинаться с front matter:

```scss
---
---

@import "{{ site.theme }}";
```

Без `--- ---` Jekyll может не обработать Sass-файл.

## Проверка после деплоя

1. Открыть опубликованный сайт.
2. Сделать hard refresh: `Cmd/Ctrl + Shift + R`.
3. В DevTools проверить, что подключился CSS темы.
4. Если изменения не появились — дождаться окончания GitHub Pages deploy в Actions/Pages.

## Что не надо делать

- Не настраивать Pages на `/(root)`, если документация лежит в `/docs`.
- Не держать разные версии `index.md` в root и `/docs`, если можно запутаться, какая из них публикуется.
- Не рассчитывать, что GitHub-рендер markdown в репозитории будет выглядеть как GitHub Pages. Это разные режимы отображения.
