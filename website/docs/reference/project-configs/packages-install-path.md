---
datatype: directorypath
default_value: dbt_packages
---

<File name='dbt_project.yml'>

```yml
packages-install-path: directorypath
```

</File>

## Определение {#definition}
При необходимости укажите пользовательский каталог, в который будут устанавливаться [пакеты](/docs/build/packages) при выполнении команды `dbt deps` [command](/reference/commands/deps). Обратите внимание, что этот каталог обычно игнорируется в git.

## Значение по умолчанию {#default}
По умолчанию dbt будет устанавливать пакеты в каталог `dbt_packages`, т.е. `packages-install-path: dbt_packages`

## Примеры {#examples}
### Установка пакетов в подкаталог с именем `packages` вместо `dbt_packages` {#install-packages-in-a-subdirectory-named-packages-instead-of-dbt_packages}

<File name='dbt_project.yml'>

```yml
packages-install-path: packages
```

</File>