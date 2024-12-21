---
title: Как писать развернутые объяснения в описаниях?
description: "Пишите длинные описания в вашей документации"
sidebar_label: 'Пишите длинные описания'
id: long-descriptions
---
Если вам нужно больше одного предложения, чтобы объяснить модель, вы можете:

1. Разделить ваше описание на несколько строк, используя `>`. Внутренние разрывы строк будут удалены, и можно использовать Markdown. Этот метод рекомендуется для простых, одноабзацных описаний:
```yml
  version: 2

  models:
  - name: customers
    description: >
      Lorem ipsum **dolor** sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat.
```

2. Разделить ваше описание на несколько строк, используя `|`. Внутренние разрывы строк сохраняются, и можно использовать Markdown. Этот метод рекомендуется для более сложных описаний:
```yml
  version: 2

  models:
  - name: customers
    description: |
      ### Lorem ipsum

      * dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      * tempor incididunt ut labore et dolore magna aliqua.
```

3. Использовать [блок docs](/docs/build/documentation#using-docs-blocks), чтобы написать описание в отдельном Markdown файле.