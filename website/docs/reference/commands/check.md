---
title: "О команде dbt check"
sidebar_label: "check"
id: "check"
availability:
  engine: v2
---

`dbt check` разбирает ваш проект, выполняет [проверки](/docs/build/checks) и выводит результаты.

## Использование

```shell
dbt check [<check-name> …] [flags]
```

Запуск всех включённых проверок:

```shell
dbt check
```

Запуск одной или нескольких проверок:

```shell
dbt check all_models_have_descriptions
dbt check all_models_have_descriptions public_models_have_owners
```

При передаче неизвестного имени проверки команда завершается с ошибкой. Имя отключённой проверки допускается, но сама проверка пропускается.

## Связанная документация

- [Проверки](/docs/build/checks)
- [`dbt build`](/reference/commands/build)
- [Настройка проекта check-paths](/reference/project-configs/check-paths)
