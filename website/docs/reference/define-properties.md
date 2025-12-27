---
title: Определение свойств
sidebar_label: Определение свойств
intro_text: "Узнайте, как определять свойства для ваших ресурсов в файле properties.yml"
description: "Узнайте, как определять свойства для ваших ресурсов в файле properties.yml"
pagination_previous: "reference/define-configs"
---

В dbt вы можете использовать файлы `properties.yml`, чтобы задавать свойства (properties) для ресурсов. Вы объявляете свойства в `.yml`‑файлах, расположенных в той же директории, что и соответствующие ресурсы. Вы можете называть эти файлы как угодно (`whatever_you_want.yml`) и произвольно вкладывать их в подкаталоги внутри каждой директории.

Мы настоятельно рекомендуем определять свойства в выделенных путях рядом с ресурсами, которые они описывают.

:::info

#### Файлы schema.yml

В предыдущих версиях документации такие файлы назывались `schema.yml`. Мы отказались от этой терминологии, потому что слово `schema` в контексте баз данных имеет и другие значения, и пользователи часто думали, что файлы _обязательно_ должны называться `schema.yml`.

Теперь мы называем эти файлы `properties.yml`. (Разумеется, вы по‑прежнему можете называть свои файлы `schema.yml`.)

:::

### Какие properties _не_ являются также configs?

В dbt вы можете задавать конфигурации узлов (node configs) в файлах `properties.yml` — в дополнение к блокам `config()` и файлу `dbt_project.yml`. Однако существуют некоторые специальные свойства, которые можно определить **только** в `.yml`‑файлах, и которые нельзя настроить с помощью блоков `config()` или файла `dbt_project.yml`.

Некоторые свойства являются особыми, потому что:

- для них используется уникальный контекст рендеринга Jinja;
- они создают новые ресурсы проекта;
- они не имеют смысла как иерархическая конфигурация;
- это более старые свойства, которые ещё не были переопределены как configs.

К таким свойствам относятся:

- [`columns`](/reference/resource-properties/columns)
- [`deprecation_date`](/reference/resource-properties/deprecation_date)
- [`description`](/reference/resource-properties/description)
- [`quote`](/reference/resource-properties/columns#quote)
- [`source` properties](/reference/source-properties) (например, `loaded_at_field`)
- [`exposure` properties](/reference/exposure-properties) (например, `type`, `maturity`)
  - Обратите внимание: хотя большинство свойств exposure необходимо задавать напрямую в файлах `properties.yml`, вы можете установить конфигурацию [`enabled`](/reference/resource-configs/enabled) на [уровне проекта](/reference/exposure-properties#project-level-configs) в файле `dbt_project.yml`.
- [`macro` properties](/reference/macro-properties) (например, `arguments`)
- [`tests`](/reference/resource-properties/data-tests)
- [`versions`](/reference/resource-properties/versions)

import Example from '/snippets/_configs-properties.md'  ;

<Example />
