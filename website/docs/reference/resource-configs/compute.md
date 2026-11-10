---
resource_types: [unit tests]
title: "compute"
description: "Используйте настройку compute, чтобы запускать юнит-тесты локально с DuckDB, а не на вашей платформе данных."
datatype: string
default_value: remote
sidebar_label: "compute"
availability:
  engine: v2
---

# compute

<IntroText>

Настройка compute определяет, где выполняется юнит-тест: на вашей платформе данных или локально с DuckDB.

</IntroText>

:::info Доступно в v2 при явном включении

Настройка `compute` доступна только в v2. В v1 она недоступна и будет проигнорирована. Чтобы перейти на v2, обратитесь к руководству [Обновление до v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2). Использование `compute: local` для юнит-теста — экспериментальная возможность. Перед её использованием установите переменную окружения `DBT_ENGINE_EXPERIMENTAL_LOCAL_UNIT_TESTS` в значение `true`:

```bash
export DBT_ENGINE_EXPERIMENTAL_LOCAL_UNIT_TESTS=true
```

Без этой переменной dbt завершает работу с ошибкой недопустимой конфигурации, в которой указано имя переменной.

:::

По умолчанию каждый юнит-тест отправляет запрос на вашу платформу данных и ожидает результата. Это может замедлять тестирование и расходовать вычислительные ресурсы хранилища.

Используйте настройку `compute: local`, чтобы запускать [юнит-тесты](/docs/build/unit-tests) локально с DuckDB, быстрее получать обратную связь при разработке и контролировать затраты на вычислительные ресурсы хранилища. 

<File name='models/filename.yml'>

```yml
unit_tests:
  - name: unit_test_name
    model: model_name
    [config](/reference/resource-properties/config):
      compute: local | remote
```

</File>

<File name='dbt_project.yml'>

```yml
unit_tests:
  [resource-path](/reference/resource-configs/resource-path):
    +compute: local | remote
```

</File>

## Определение

Вы можете задать `compute` для [юнит-тестов](/docs/build/unit-tests): как для отдельного теста в YAML-файле свойств, так и для группы тестов в YAML-файле проекта (`dbt_project.yml`).

Для `compute` доступны следующие значения:

- `local`: выполнять юнит-тест с DuckDB там, где запущен dbt. На вашу платформу данных ничего не отправляется, поэтому тест быстро возвращает результат и не использует вычислительные ресурсы хранилища.
- `remote` (по умолчанию): отправлять юнит-тест на вашу платформу данных для выполнения с использованием вычислительных ресурсов хранилища, как и любой другой запрос. Поскольку это значение используется по умолчанию, задавать его явно нужно только для того, чтобы исключить тест из действия настройки `+compute: local`, заданной на уровне проекта.

Локальное выполнение доступно для Snowflake и BigQuery. В сообщениях об ошибках также может встречаться `sidecar` — это то же самое, что и `local`.

Настройка отдельного юнит-теста переопределяет настройку на уровне проекта. Поэтому, если вы зададите `+compute: local` в `dbt_project.yml` и `compute: remote` для одного теста, этот тест будет выполняться на вашей платформе данных, а остальные — локально.

В файле проекта:

<File name='dbt_project.yml'>

```yml
unit_tests:
  my_project:
    +compute: local
```

</File>

Затем для отдельного теста:

<File name='models/filename.yml'>

```yml
unit_tests:
  - name: test_revenue_calculation
    model: fct_revenue
    config:
      compute: remote
```

</File>

#### Что нужно знать о локальном выполнении

- Настройка `compute: local` отклоняется, если в окружении, где запущен dbt, не задано `DBT_ENGINE_EXPERIMENTAL_LOCAL_UNIT_TESTS=true`. Это относится как к настройке отдельного теста, так и к `+compute: local` в `dbt_project.yml`.
- Ваш SQL должен поддаваться преобразованию в SQL для DuckDB. Функции, специфичные для платформы и не имеющие эквивалента в DuckDB, приводят к ошибке, а режим `local` не переключается на вашу платформу данных при сбое &mdash; ошибка преобразования означает ошибку теста.
- Чтобы преобразовать ваш SQL, при первом запуске теста dbt получает с вашей платформы данных схемы моделей, от которых тестируемая модель зависит напрямую, а затем кеширует их для последующих запусков. Эти модели должны уже существовать на вашей платформе данных.
- Настройка `compute: local` также устанавливает для [`static_analysis`](/reference/resource-configs/static-analysis) значение `strict` для этого теста, поскольку для преобразования SQL при локальном выполнении необходим строгий анализ. Если задать для теста `static_analysis: off`, он не сможет выполняться локально и завершится с ошибкой.


## Связанная документация

- [Локальный запуск юнит-тестов](/docs/build/unit-tests#run-unit-tests-locally)
- [Юнит-тесты](/docs/build/unit-tests)
- [О свойстве unit_tests](/reference/resource-properties/unit-tests)
- [static_analysis](/reference/resource-configs/static-analysis)
