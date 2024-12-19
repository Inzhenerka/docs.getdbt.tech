---
title: "Обновление до 0.18.0"
displayed_sidebar: "docs"

---

### Ресурсы

- [Список изменений](https://github.com/dbt-labs/dbt-core/blob/dev/marian-anderson/CHANGELOG.md)
- [Обсуждение: Предварительная версия](https://discourse.getdbt.com/t/prerelease-v0-18-0-marian-anderson/1545)

## Ломающие изменения

Обратите внимание на следующие изменения в версии 0.18.0. Хотя они являются ломающими, мы не ожидаем, что они повлияют на большинство проектов.

### Макросы адаптера

- dbt теперь имеет доступ только к макросам плагина адаптера, который используется в данный момент, или к одному из его зависимостей, а не ко всем установленным адаптерам в пространстве имен.
- `adapter_macro` больше не является макросом и вызовет предупреждение о устаревании. Вместо этого используйте `adapter.dispatch`.

### Тесты данных

- Тесты данных теперь пишутся как <Term id="cte">CTE</Term>, а не как <Term id="subquery">подзапросы</Term>. Плагины адаптеров для баз данных, которые не поддерживают CTE, могут потребовать переопределения этого поведения.

### Требования к Python
- Обновлена зависимость `snowflake-connector-python` до версии 2.2.10 и включен кэш токенов SSO.

## Новые функции

Для получения более подробной информации смотрите [новую и измененную документацию](#new-and-changed-documentation) ниже.

:::info [β] Бета-функции
В версии 0.18.0 добавлено несколько новых функций, с последующими улучшениями. Если вы столкнетесь с неожиданным поведением, пожалуйста, напишите в Slack или откройте проблему.
:::

### Выбор узлов
- методы: `config`, `test_type`, `test_name`, `package`, [β] `state`
- пересечения
- nth-parent/child
- [β] селекторы YAML с контролем версий
- [β] отложить ссылки на невыбранные узлы до состояния, определенного артефактами предыдущего запуска

### Макросы адаптера
- `adapter.dispatch` заменяет `adapter_macro`, предоставляя гораздо большую гибкость
- Тесты схемы теперь определяются через `dispatch`, так что неосновные плагины могут переопределять определения тестов схемы

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

**Core**
- [синтаксис выбора узлов](/reference/node-selection/syntax)
- [список (ls)](/reference/commands/list)
- [отложить](/reference/node-selection/defer)
- [adapter.dispatch](/reference/dbt-jinja-functions/adapter#dispatch)
- [`asset-paths` конфигурация](/reference/project-configs/asset-paths) (также обновлены [dbt_project.yml](/reference/dbt_project.yml) и [описание](/reference/resource-properties/description))
- [флаг для цветных логов](/reference/commands/run#enable-or-disable-colorized-logs)
- [`full_refresh` конфигурация](/reference/resource-configs/full_refresh)

**Документация**
- [обзоры на уровне проекта](/docs/build/documentation#custom-project-level-overviews)

**Redshift**
- [`iam_profile`](/docs/core/connect-data-platform/redshift-setup#specifying-an-iam-profile)

**Snowflake**
- `query_tag` в [профиле](/docs/core/connect-data-platform/snowflake-setup), [конфигурации модели](/reference/resource-configs/snowflake-configs#query-tags)
- автоматическая поддержка [кэширования сессий SSO](/docs/core/connect-data-platform/snowflake-setup#sso-authentication)

**BigQuery**
- [`impersonate_service_account`](/docs/core/connect-data-platform/bigquery-setup#service-account-impersonation)
- [`policy_tags`](/reference/resource-configs/bigquery-configs#policy-tags)
- [`hours_to_expiration`](/reference/resource-configs/bigquery-configs#controlling-table-expiration)