---
datatype: [directorypath]
default_value: [functions]
---

<File name='dbt_project.yml'>

```yml
function-paths: [directorypath]
```

</File>

## Определение {#definition}

Позволяет опционально указать пользовательский список директорий, в которых расположены [пользовательские функции (UDFs)](/docs/build/udfs).

## По умолчанию {#default}

По умолчанию dbt ищет функции в директории `functions`, например: `function-paths: ["functions"]`

## Примеры {#examples}

Использовать поддиректорию с именем `udfs` вместо `functions`:

<File name='dbt_project.yml'>

```yml
function-paths: ["udfs"]
```

</File>

Использовать несколько директорий для организации функций:

<File name='dbt_project.yml'>

```yml
function-paths: ["functions", "custom_udfs"]
```

</File>
