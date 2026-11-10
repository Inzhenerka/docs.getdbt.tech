---
title: "Допустимое имя схемы из generate_schema_name"
id: "require_valid_schema_from_generate_schema_name"
sidebar_label: "Требовать допустимое имя схемы из generate_schema_name"
---

| require_valid_schema_from_generate_schema_name | <Constant name="dbt" /> **v1 Latest** | <Constant name="core" /> |
|---|---|---|
| Добавлен | 2026.1 | 1.12.0a1 |
| Стабилизирован (по умолчанию → `true`) | — | — |
| Удалён | — | — |

Макрос `generate_schema_name` определяет схему, в которой dbt создаёт модели и другие ресурсы. Возврат значения `null` из этого макроса может привести к недопустимым именам схем и непредсказуемому поведению во время запусков dbt.

Флаг поведения `require_valid_schema_from_generate_schema_name` по умолчанию имеет значение `false`. При значении `false` dbt выдаёт предупреждение [`GenerateSchemaNameNullValueDeprecation`](/reference/deprecations#generateschemanamenullvaluedeprecation), когда пользовательский макрос `generate_schema_name` возвращает значение `null`.

Когда `require_valid_schema_from_generate_schema_name` имеет значение `true`, dbt выполняет более строгую проверку и выдаёт ошибку разбора.

Например, если в вашем проекте есть пользовательский макрос `generate_schema_name`, который возвращает `null`:

<File name='macros/get_custom_schema.sql'>

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- if custom_schema_name is none -%}
        {{ return(none) }}
    {%- else -%}
        {{ custom_schema_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

</File>

При поведении по умолчанию dbt выдаёт предупреждение об устаревшем поведении. Когда `require_valid_schema_from_generate_schema_name` имеет значение `true`, dbt выдаёт ошибку.

Чтобы устранить эту проблему, обновите макрос так, чтобы он возвращал допустимое имя схемы (в этом примере — `target.schema`):

<File name='macros/get_custom_schema.sql'>

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- if custom_schema_name is none -%}
        {{ return(target.schema) }}
    {%- else -%}
        {{ custom_schema_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

</File>
