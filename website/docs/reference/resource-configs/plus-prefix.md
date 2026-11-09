---
title: Использование префикса +
description: "Префикс + помогает однозначно различать пути к ресурсам и конфигурации в файлах dbt_project.yml."
intro_text: "Используйте префикс +, чтобы наглядно разграничить пути к ресурсам и конфигурации в файлах dbt_project.yml."
---

Префикс `+` — это синтаксическая особенность dbt, которая помогает однозначно различать [пути к ресурсам](/reference/resource-configs/resource-path) и конфигурации в [файлах `dbt_project.yml`](/reference/dbt_project.yml).

- Он несовместим с файлами `dbt_project.yml`, которые используют [`config-version`](/reference/project-configs/config-version) 1.
- Он не применяется к:
  - Jinja‑макросу `config()` внутри файла ресурса
  - свойству `config` в файле `.yml`.

Например:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
config-version: 2

...

models:
  +materialized: view
  jaffle_shop:
    marts:
      +materialized: table
```

</File>

В этой документации мы используем префикс `+` для ключей конфигурации в файлах `dbt_project.yml`.

В проектах, использующих [`config-version`](/reference/project-configs/config-version) 2, dbt ожидает, что ключи конфигурации будут иметь префикс `+`. Указание конфигураций без префикса `+` [считается устаревшим](/reference/deprecations#missingplusprefixdeprecation). Имена папок и файлов в конфигурациях ресурсов по-прежнему указываются без префикса `+`.

<VersionBlock firstVersion="2.0" >

Поскольку префикс `+` зарезервирован для конфигураций, имена папок и файлов в [пути к ресурсу](/reference/resource-configs/resource-path) не должны начинаться с `+`. В <Constant name="fusion" /> dbt выдает предупреждение для любого пути к ресурсу, который начинается с `+`, и выдает ошибку, если включен флаг изменения поведения [`require_resource_names_without_plus_prefix`](/reference/global-configs/behavior-flags/require_resource_names_without_plus_prefix). Если у вас есть папка с именем `+my_folder`, переименуйте ее, удалив префикс `+`.

</VersionBlock>

Префикс `+` особенно важен, когда необходимо различать [пути к ресурсам](/reference/resource-configs/resource-path) и конфигурации. Например, когда:
- Конфигурация принимает словарь в качестве входного значения, как, например, [`persist_docs`](/reference/resource-configs/persist_docs).
- Ключ конфигурации совпадает с частью пути к ресурсу, например с именем каталога моделей `tags`.

import MissingPrefix from '/snippets/_missing-prefix.md';

<MissingPrefix />

import DeprecationWarnings from '/snippets/_deprecation-warnings.md';

<DeprecationWarnings />

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
config-version: 2

...

models:
  +persist_docs: # эта конфигурация является словарем, поэтому нужен префикс +
    relation: true
    columns: true

  jaffle_shop:
+schema: my_schema
    +tags: # это конфигурация tags
      - "hello"
    config:
      tags: # путь к ресурсам (models/tags/), а не конфигурация tags
        # config: позволяет отличить путь от конфигурации (обязательно в v1.10+)
        # Приведённая ниже конфигурация применяется к моделям в каталоге models/tags/.
        +materialized: view

```

</File>

**Примечание:** Использование префикса `+` в файле `dbt_project.yml` отличается от использования `+` для управления поведением слияния конфигураций (clobber vs. add) в других настройках конфигурации (в `.yml` и `.sql` файлах конкретных ресурсов). В настоящее время единственная конфигурация, которая поддерживает `+` для управления поведением слияния конфигураций, — это [`grants`](/reference/resource-configs/grants#grant-config-inheritance).

**Примечание:** Использование префикса `+` в `dbt_project.yml` отличается от использования `+` для управления поведением слияния конфигураций (замена или добавление) в других настройках конфигурации (конкретные файлы ресурсов `.yml` и `.sql`). В настоящее время единственная конфигурация, которая поддерживает `+` для управления поведением слияния конфигураций, это [`grants`](/reference/resource-configs/grants#grant-config-inheritance).