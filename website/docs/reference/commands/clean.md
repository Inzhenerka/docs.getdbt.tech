---
title: "О команде dbt clean"
sidebar_label: "clean"
id: "clean"
---

`dbt clean` — это служебная команда, которая удаляет пути, указанные в списке [`clean-targets`](/reference/project-configs/clean-targets) в файле `dbt_project.yml`. Она помогает удалять ненужные файлы или директории, создаваемые при выполнении других команд dbt, обеспечивая «чистое» состояние проекта.

## Пример использования {#example-usage}
```
dbt clean
```

## Поддерживаемые флаги {#supported-flags}

В этом разделе кратко описаны следующие флаги:

- [`--clean-project-files-only`](#--clean-project-files-only) (по умолчанию)
- [`--no-clean-project-files-only`](#--no-clean-project-files-only)

Чтобы посмотреть список всех поддерживаемых флагов для команды `dbt clean` в терминале, используйте флаг `--help`. Он выведет подробную информацию о доступных флагах, включая их описание и способ использования:

```shell
dbt clean --help
```

### --clean-project-files-only {#clean-project-files-only}
По умолчанию dbt удаляет все пути, указанные в `clean-targets`, которые находятся внутри директории проекта.

:::note
Избегайте использования путей за пределами проекта dbt, иначе вы получите ошибку.
:::
  

#### Пример использования {#example-usage-1}
```shell
dbt clean --clean-project-files-only
```

### --no-clean-project-files-only {#no-clean-project-files-only}
Удаляет все пути, указанные в списке `clean-targets` в `dbt_project.yml`, включая те, которые находятся за пределами текущего проекта dbt.

```shell
dbt clean --no-clean-project-files-only
```

## dbt clean и удалённая файловая система {#dbt-clean-with-remote-file-system}
Чтобы избежать сложных проблем с правами доступа и потенциального удаления критически важных элементов удалённой файловой системы без возможности их восстановить, эта команда не работает при взаимодействии с RPC-сервером, который лежит в основе <Constant name="cloud_ide" />. Вместо этого при работе в <Constant name="cloud" /> команда `dbt deps` автоматически выполняет очистку перед установкой пакетов. При необходимости папку `target` можно удалить вручную через дерево файлов в боковой панели.
