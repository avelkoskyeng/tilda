---
title: GitHub Pages
---

# Публикация документации через GitHub Pages

Самый простой вариант для этого репозитория — хранить документацию в папке `/docs` и включить GitHub Pages из этой папки.

## Рекомендуемая структура

```txt
helpers.js
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

## Что положить в `/docs`

Главная страница сайта должна называться:

```txt
docs/index.md
```

Остальные страницы можно хранить рядом и линковать обычными markdown-ссылками:

```md
[Формы](./forms.md)
[CJM](./cjm.md)
```

## Минимальный `_config.yml`

```yml
title: cp_tpl docs
description: Документация по JS-хелперам для Tilda
theme: minima
```

Можно вообще начать без темы и кастомизации, но `_config.yml` удобен для названия сайта.

## Как включить Pages

1. Открыть репозиторий на GitHub.
2. Перейти в **Settings**.
3. В левом меню открыть **Pages**.
4. В блоке **Build and deployment** выбрать **Deploy from a branch**.
5. Выбрать ветку `main`.
6. В качестве папки выбрать `/docs`.
7. Нажать **Save**.

После этого GitHub опубликует сайт. Обычно ссылка будет вида:

```txt
https://<username>.github.io/<repo>/
```

Для репозитория:

```txt
avelkoskyeng/tilda
```

ожидаемый адрес будет похож на:

```txt
https://avelkoskyeng.github.io/tilda/
```

## Важный нюанс

Если документация хранится в том же репозитории, где лежит `helpers.js`, удобнее публиковать именно `/docs`, а не весь root. Тогда сайт документации не мешает коду.

## Как обновлять документацию

1. Изменить markdown-файлы в `/docs`.
2. Закоммитить изменения.
3. Запушить в `main`.
4. GitHub Pages сам пересоберёт сайт.

## README и Pages

`README.md` лучше оставить как краткую входную страницу репозитория:

- что такое `cp_tpl`;
- как подключить;
- ссылки на главы документации;
- быстрые примеры.

А подробные инструкции держать в `/docs`.
