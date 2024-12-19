---
datatype: directorypath
default_value: dbt_packages
---

<File name='dbt_project.yml'>

```yml
packages-install-path: directorypath
```

</File>

## Определение
Необязательно указывать пользовательский каталог, в который [пакеты](/docs/build/packages) устанавливаются при выполнении команды `dbt deps` [команда](/reference/commands/deps). Обратите внимание, что этот каталог обычно игнорируется git.

## По умолчанию
По умолчанию dbt будет устанавливать пакеты в каталоге `dbt_packages`, т.е. `packages-install-path: dbt_packages`

## Примеры
### Установить пакеты в подкаталог с именем `packages` вместо `dbt_packages`

<File name='dbt_project.yml'>

```yml
packages-install-path: packages
```

</File>