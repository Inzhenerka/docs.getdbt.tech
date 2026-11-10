---
title: "Поддержка Jinja по типам файлов"
id: "jinja-file-support"
sidebar_label: "Поддержка Jinja по типам файлов"
description: "Какие типы файлов dbt поддерживают выражения Jinja, встроенные функции dbt и пользовательские макросы в v1 и v2."
availability: all_users
---

Поддержка Jinja зависит от типа файла. Некоторые файлы поддерживают выражения Jinja, встроенные функции dbt и пользовательские макросы. Другие поддерживают лишь несколько встроенных функций, а в некоторых Jinja вообще не обрабатывается. На этой странице можно узнать, что поддерживает каждый тип файлов.

На этой странице рассматриваются три вида поддержки:

- **Выражения Jinja** (`{{ }}`, `{% %}` и `{# #}`): управление потоком выполнения, вывод строк и комментарии
- **Встроенные функции и переменные dbt**: методы и переменные контекста, такие как [`env_var()`](/reference/dbt-jinja-functions/env_var), [`ref()`](/reference/dbt-jinja-functions/ref) и [`target`](/reference/dbt-jinja-functions/target)
- **Пользовательские макросы**: макросы, определенные в проекте, например `{{ my_macro() }}`

Выражения Jinja позволяют писать динамическую логику в файле. Пользовательские макросы — один из видов пользовательских блоков Jinja, которые определяются с помощью тегов, таких как `{% macro %}`. Другие типы блоков включают `{% test %}`, `{% materialization %}`, `{% snapshot %}` и `{% docs %}`. О том, где размещать каждый из них, см. в разделе [Где определять пользовательские блоки Jinja](#where-to-define-custom-jinja-blocks).

## Сводная таблица

| Тип файла | Выражения Jinja | Функции и переменные dbt | Пользовательские макросы | Примечания |
| --- | --- | --- | --- | --- |
| Модели, аналитические запросы и единичные тесты `.sql` | ✅ | ✅ | ✅ | Здесь можно вызывать макросы, в том числе хуки и операции. См. раздел [Где определять пользовательские блоки Jinja](#where-to-define-custom-jinja-blocks). |
| Универсальные тесты `.sql` (`{% test %}`) | ✅ | ✅ | ✅ | |
| Снимки `.sql` (устаревший синтаксис `{% snapshot %}`) | ✅ | ✅ | ✅ | Рекомендуется использовать [снимки в YAML](/docs/build/snapshots). |
| Материализации `.sql` (`{% materialization %}`) | ✅ | ✅ | ✅ | |
| Блоки документации `.md` (`{% docs %}`) | ✅ | ❌ | ❌ | Только чистый Jinja; для ссылок на блоки используйте [`doc()`](/reference/dbt-jinja-functions/doc). |
| `dbt_project.yml` | ✅ | Ограниченно | v1: ❌ / v2: Ограниченно | В v2 пользовательские макросы поддерживаются только в хуках. Блок `vars:` верхнего уровня обрабатывается буквально (не как Jinja). См. раздел [Контекст dbt_project.yml](/reference/dbt-jinja-functions/dbt-project-yml-context). |
| `profiles.yml` | ✅ | Ограниченно | ❌ | Поддерживает префикс `DBT_ENV_SECRET_` для [`env_var()`](/reference/dbt-jinja-functions/env_var). См. раздел [Контекст profiles.yml](/reference/dbt-jinja-functions/profiles-yml-context). |
| `packages.yml` | ✅ | Ограниченно | ❌ | Поддерживает префикс `DBT_ENV_SECRET_` для [`env_var()`](/reference/dbt-jinja-functions/env_var). См. раздел [Контекст packages.yml](/reference/dbt-jinja-functions/packages.yml%20context). |
| `properties.yml` / `schema.yml` | ✅ | Ограниченно | v1: ❌ / v2: ✅ | В v2 можно вызывать пользовательские макросы в значениях YAML (например, в `description`). `ref()` и `source()` недоступны. См. раздел [Контекст properties.yml](/reference/dbt-jinja-functions/dbt-properties-yml-context). |
| `selectors.yml` | ✅ | Ограниченно | v1: ❌ / v2: ✅ | Также поддерживает `env_var()`, `target`, `as_bool()` и связанный с ними контекст. См. раздел [Селекторы YAML](/reference/node-selection/yaml-selectors). |
| `dependencies.yml` | v1: ❌ / v2: ✅ | v1: ❌ / v2: Ограниченно | ❌ | В v2 Jinja работает (например, `env_var()` в URL Git). Если проект должен также работать в v1, рекомендуется использовать `packages.yml`. |
| Модели Python `.py` | ❌ | ❌ | ❌ | Вместо этого используйте API класса `dbt` для Python. |
| Сиды `.csv` | ❌ | ❌ | ❌ | Только файлы данных. |
| SQL-фикстуры юнит-тестов | ❌ | ❌ | ❌ | См. раздел [Форматы данных](/reference/resource-properties/data-formats). |
| `.sql.j2` / `.md.j2` (необязательно) | Как у `.sql` / `.md` | Как у `.sql` / `.md` | Как у `.sql` / `.md` | Требуется [`allow_jinja_file_extensions`](/reference/global-configs/behavior-flags/allow_jinja_file_extensions) (по умолчанию `false`). |

<br />

**Условные обозначения таблицы**

- **Ограниченно:** доступна только часть встроенных функций и переменных dbt (обычно [`env_var()`](/reference/dbt-jinja-functions/env_var), [`var()`](/reference/dbt-jinja-functions/var) и [`target`](/reference/dbt-jinja-functions/target)). Точный список зависит от типа файла.
- Для пользовательских макросов «Ограниченно» означает поддержку только в определенных полях (например, в хуках в `dbt_project.yml` в v2).
- **Как у `.sql` / `.md`:** необязательные расширения `.j2` соответствуют типу файла без `.j2` (например, `.sql.j2` соответствует `.sql`).

## Где определять пользовательские блоки Jinja {#where-to-define-custom-jinja-blocks}

Для вызова макроса (`{{ my_macro() }}`) используются выражения Jinja. Для его определения используется пользовательский блок Jinja (`{% macro %}`). В таблице ниже указано, где следует размещать каждый тип блока:

| Блок | Тип файла | Расположение | Примечания |
| --- | --- | --- | --- |
| `{% macro %}` | `.sql` | `macros/` | Можно вызывать из моделей, тестов, хуков и других мест. |
| `{% test %}` | `.sql` | `tests/generic/` или `macros/` | Может вызывать другие макросы. |
| `{% materialization %}` | `.sql` | `macros/` | Здесь определяются пользовательские материализации. |
| `{% snapshot %}` | `.sql` | `snapshots/` (устаревший вариант) | Рекомендуется использовать [снимки в YAML](/docs/build/snapshots). О старом синтаксисе см. в разделе [Устаревшие конфигурации снимков](/reference/resource-configs/snapshots-jinja-legacy). |
| `{% docs %}` | `.md` | Любой путь к ресурсам или `docs/` | Только чистый Jinja; вызовы пользовательских макросов не поддерживаются. |

## Распространенные исключения

Для некоторых полей конфигурации действуют более строгие ограничения, чем указано в сводной таблице.

### Блок `vars:` в `dbt_project.yml`

Значения в блоке `vars:` в `dbt_project.yml` обрабатываются буквально, а не как Jinja. Чтобы задавать значения динамически, используйте `--vars` в командной строке. См. раздел [Переменные проекта](/docs/build/project-variables).

### Конфигурация `sql_header`

Конфигурация [`sql_header`](/reference/resource-configs/sql_header) не поддерживает Jinja и макросы, такие как `ref()`, `source()` и `{{ this }}`.

## Различия в поддержке Jinja между v1 и v2

В v2 поддерживаются некоторые возможности Jinja, недоступные в v1:

- Пользовательские макросы в значениях `properties.yml` и `selectors.yml`
- Пользовательские макросы в хуках `dbt_project.yml` (ограниченно)
- Jinja в `dependencies.yml`

Если ваш проект должен также работать в v1, не используйте эти возможности. В v1 пользовательский макрос в файле YAML приводит к ошибке неопределенного макроса. Jinja в `dependencies.yml` остается необработанной строкой, которую dbt передает в git, что обычно приводит к сбою установки.

В этом примере пользовательский макрос вызывается в значении свойства. Он работает в v2, но приводит к ошибке в v1:

<File name="models/schema.yml">

```yaml
models:
  - name: customers
    description: "{{ my_macro() }}"
```

</File>

В этом примере `env_var()` используется в спецификации пакета. Разместите ее в `packages.yml`, чтобы она работала в v1 и v2:

<File name="packages.yml">

```yaml
packages:
  - git: "https://{{ env_var('DBT_ENV_SECRET_GIT_CREDENTIAL') }}@github.com/dbt-labs/awesome_repo.git"
```

</File>

Подробнее о файлах пакетов см. в разделе [Сценарии использования пакетов](/docs/build/packages#use-cases).

## Связанная документация

- [Jinja и макросы](/docs/build/jinja-macros)
- [Советы по YAML](/docs/build/dbt-tips#yaml-tips)
- [Функции Jinja и переменные контекста dbt](/reference/dbt-jinja-functions-context-variables)
- [Сценарии использования пакетов](/docs/build/packages#use-cases)
