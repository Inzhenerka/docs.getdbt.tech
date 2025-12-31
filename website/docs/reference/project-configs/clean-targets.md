---
datatype: [directorypath]
default_value: [target_path]
---

<File name='dbt_project.yml'>

```yml
clean-targets: [directorypath]
```

</File>

## Определение {#definition}
При необходимости укажите пользовательский список каталогов, которые будут удалены командой `dbt clean` [command](/reference/commands/clean). Таким образом, в этот список следует включать только каталоги, содержащие артефакты (например, скомпилированные файлы, логи, установленные пакеты).

## Значение по умолчанию {#default}
Если эта конфигурация не включена в ваш файл `dbt_project.yml`, команда `clean` удалит файлы в вашем [target-path](/reference/global-configs/json-artifacts).

## Примеры {#examples}

### Удаление пакетов и скомпилированных файлов в рамках `dbt clean` (предпочтительно) {#remove-packages-and-compiled-files-as-part-of-dbt-clean}

Чтобы удалить пакеты, а также скомпилированные файлы, включите значение вашей конфигурации [packages-install-path](/reference/project-configs/packages-install-path) в конфигурацию `clean-targets`.

<File name='dbt_project.yml'>

```yml
clean-targets:
    - target
    - dbt_packages
```

</File>

Теперь выполните команду `dbt clean`.

Оба каталога, `target` и `dbt_packages`, будут удалены.

Примечание: это конфигурация в [стартовом проекте](https://github.com/dbt-labs/dbt-starter-project/blob/HEAD/dbt_project.yml) dbt, который создается командой `init`.

### Удаление `logs` при выполнении `dbt clean` {#remove-logs-when-running-dbt-clean}

<File name='dbt_project.yml'>

```yml
clean-targets: [target, dbt_packages, logs]

```

</File>