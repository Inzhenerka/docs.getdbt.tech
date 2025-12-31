---
resource_types: [seeds]
description: "Quote_columns — подробное руководство по изучению конфигураций в dbt."
datatype: boolean
default_value: false
---

## Определение {#definition}
Необязательная конфигурация seed, используемая для определения того, должны ли имена колонок в seed-файле быть заключены в кавычки при создании <Term id="table" />.

* Когда `True`, dbt будет заключать имена колонок, определённые в seed-файле, в кавычки при создании таблицы для seed, сохраняя регистр символов.
* Когда `False`, dbt не будет заключать имена колонок, определённые в seed-файле, в кавычки.
* Если значение не задано, поведение (будут ли имена колонок заключаться в кавычки) зависит от используемого адаптера.

## Использование {#usage}
### Заключать в кавычки все колонки seed глобально {#globally-quote-all-seed-columns}

<File name='dbt_project.yml'>

```yml
seeds:
  +quote_columns: true
```

</File>

### Заключать в кавычки только seed-файлы в директории `seeds/mappings` {#only-quote-seeds-in-the-seedsmappings-directory}
Для проекта со следующими настройками:
* `name: jaffle_shop` в файле `dbt_project.yml`
* `seed-paths: ["seeds"]` в файле `dbt_project.yml`

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    mappings:
      +quote_columns: true
```

</File>

Или:

<File name='seeds/properties.yml'>

```yml

seeds:
  - name: mappings
    config:
      quote_columns: true
```

</File>

## Рекомендуемая конфигурация {#recommended-configuration}
* Явно задавайте это значение, если используете seed-файлы.
* Применяйте конфигурацию глобально, а не к отдельным проектам или seed.
* Устанавливайте `quote_columns: false`, _если только_ имена колонок не содержат специальные символы или если необходимо сохранить регистр. В таком случае также стоит рассмотреть переименование колонок в seed-файлах (это упростит последующий код).
