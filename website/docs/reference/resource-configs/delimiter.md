---
resource_types: [seeds]
datatype: <string>
default_value: ","
---

<VersionCallout version="1.7" />

## Определение {#definition}

Вы можете использовать эту необязательную конфигурацию для семян, чтобы настроить, как вы разделяете значения в [семени](/docs/build/seeds), предоставив строку из одного символа.

* Разделитель по умолчанию — запятая, если не указано иное.
* Явно укажите значение конфигурации `delimiter`, если вы хотите, чтобы файлы семян использовали другой разделитель, например "|" или ";".

## Использование {#usage}

Укажите разделитель в вашем файле `dbt_project.yml`, чтобы настроить глобальный разделитель для всех значений семян:

<File name='dbt_project.yml'>

```yml
seeds:
  <project_name>:
     +delimiter: "|" # разделитель по умолчанию для семян в проекте будет "|"
    <seed_subdirectory>:
      +delimiter: "," # разделитель для семян в seed_subdirectory будет ","
```

</File>

Или используйте пользовательский разделитель, чтобы переопределить значения для конкретного семени:

<File name='seeds/properties.yml'>

```yml

seeds:
  - name: <seed_name>
    config: 
      delimiter: "|"
```

</File>

## Примеры {#examples}
Для проекта с:

* `name: jaffle_shop` в файле `dbt_project.yml`
* `seed-paths: ["seeds"]` в файле `dbt_project.yml`

### Используйте пользовательский разделитель для переопределения глобальных значений {#use-a-custom-delimiter-to-override-global-values}

Вы можете установить поведение по умолчанию для всех семян, за исключением одного семени, `seed_a`, которое использует запятую:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: 
    +delimiter: "|" # разделитель по умолчанию для семян в проекте jaffle_shop будет "|"
    seed_a:
      +delimiter: "," # разделитель для seed_a будет ","
```

</File>

Ваши соответствующие файлы семян будут отформатированы следующим образом:

<File name='seeds/my_seed.csv'>

```text
col_a|col_b|col_c
1|2|3
4|5|6
...
```

</File>

<File name='seeds/seed_a.csv'>

```text
name,id
luna,1
doug,2
...
```

</File>

Или вы можете настроить поведение для одного семени. `country_codes` использует разделитель ";":

<File name='seeds/properties.yml'>

```yml

seeds:
  - name: country_codes
    config:
      delimiter: ";"
```

</File>

Файл семян `country_codes` будет отформатирован следующим образом:

<File name='seeds/country_codes.csv'>

```text
country_code;country_name
US;United States
CA;Canada
GB;United Kingdom
...
```

</File>