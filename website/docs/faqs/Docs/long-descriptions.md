---
title: Как писать развернутые объяснения в описаниях?
description: "Пишите длинные описания в вашей документации"
sidebar_label: 'Пишите длинные описания'
id: long-descriptions
---
Если для описания модели вам нужно больше одного предложения, вы можете:
1. Разбить описание на несколько строк с помощью `>`. Переносы строк внутри описания удаляются, при этом можно использовать Markdown. Этот способ рекомендуется для простых описаний из одного абзаца:

```yml
models:
  - name: customers
    description: >
      Lorem ipsum **dolor** sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat.
```

2. Разбейте описание на несколько строк с помощью `|`. Внутренние переносы строк сохраняются, и можно использовать Markdown. Этот способ рекомендуется для более сложных описаний:

```yml
models:
  - name: customers
    description: |
      ### Lorem ipsum

      * dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      * tempor incididunt ut labore et dolore magna aliqua.
```

3. Использовать [блок docs](/docs/build/documentation#using-docs-blocks), чтобы написать описание в отдельном Markdown файле.