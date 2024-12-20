---
title: "Обновление до 0.18.0"
displayed_sidebar: "docs"

---

### Ресурсы

- [Список изменений](https://github.com/dbt-labs/dbt-core/blob/dev/marian-anderson/CHANGELOG.md)
- [Обсуждение: Предрелизная версия](https://discourse.getdbt.com/t/prerelease-v0-18-0-marian-anderson/1545)

## Изменения, нарушающие совместимость

Обратите внимание на следующие изменения в версии 0.18.0. Хотя они и нарушают совместимость, мы не ожидаем, что они повлияют на большинство проектов.

### Макросы адаптера

- dbt имеет доступ только к макросам плагина адаптера, который используется в данный момент, или одной из его зависимостей, а не ко всем установленным адаптерам в пространстве имен.
- `adapter_macro` больше не является макросом и вызовет предупреждение о устаревании. Используйте `adapter.dispatch` вместо него.

### Тесты данных

- Тесты данных пишутся как <Term id="cte">CTE</Term> вместо <Term id="subquery">подзапросов</Term>. Плагины адаптеров для баз данных, которые не поддерживают CTE, возможно, потребуется переопределить это поведение.

### Требования к Python
- Обновлена зависимость `snowflake-connector-python` до версии 2.2.10 и включено кэширование токенов SSO

## Новые функции

Для получения более подробной информации см. [новую и измененную документацию](#new-and-changed-documentation) ниже.

:::info [β] Бета-функции
В версии 0.18.0 добавлено несколько новых функций, которые будут улучшаться в дальнейшем. Если вы столкнетесь с неожиданным поведением, пожалуйста, напишите в Slack или откройте задачу.
:::

### Выбор узлов
- методы: `config`, `test_type`, `test_name`, `package`, [β] `state`
- пересечения
- n-й родитель/ребенок
- [β] селекторы YAML с версионным контролем
- [β] откладывание ссылок на невыбранные узлы на состояние, определенное артефактами предыдущего запуска

### Макросы адаптера
- `adapter.dispatch` заменяет `adapter_macro`, предоставляя гораздо большую гибкость
- Тесты схем теперь определяются через `dispatch`, так что некорневые плагины могут переопределять определения тестов схем

### Документация
- Включение статических ресурсов (таких как изображения) в автоматически сгенерированный сайт документации
- Улучшенный поиск ресурсов
- Обзоры на уровне проекта

### Специфично для базы данных
- Указание профиля IAM при подключении к Redshift
- Теги запросов Snowflake на уровне подключения и модели
- Имитация учетной записи службы BigQuery при подключении через oauth
- Добавление тегов политики к столбцам BigQuery
- Настройка времени жизни для таблиц BigQuery

## Новая и измененная документация

**Основное**
- [синтаксис выбора узлов](/reference/node-selection/syntax)
- [list (ls)](/reference/commands/list)
- [defer](/reference/node-selection/defer)
- [adapter.dispatch](/reference/dbt-jinja-functions/adapter#dispatch)
- [`asset-paths` config](/reference/project-configs/asset-paths) (также обновлены [dbt_project.yml](/reference/dbt_project.yml) и [описание](/reference/resource-properties/description))
- [флаг для цветных логов](/reference/commands/run#enable-or-disable-colorized-logs)
- [`full_refresh` config](/reference/resource-configs/full_refresh)

**Документация**
- [обзоры на уровне проекта](/docs/build/documentation#custom-project-level-overviews)

**Redshift**
- [`iam_profile`](/docs/core/connect-data-platform/redshift-setup#specifying-an-iam-profile)

**Snowflake**
- `query_tag` в [профиле](/docs/core/connect-data-platform/snowflake-setup), [конфигурация модели](/reference/resource-configs/snowflake-configs#query-tags)
- поддержка автоматического кэширования сессий SSO [session caching](/docs/core/connect-data-platform/snowflake-setup#sso-authentication)

**BigQuery**
- [`impersonate_service_account`](/docs/core/connect-data-platform/bigquery-setup#service-account-impersonation)
- [`policy_tags`](/reference/resource-configs/bigquery-configs#policy-tags)
- [`hours_to_expiration`](/reference/resource-configs/bigquery-configs#controlling-table-expiration)