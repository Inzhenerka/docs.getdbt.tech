---
title: "Сравнение на равенство с учетом NULL (макрос equals)"
id: "enable_truthy_nulls_equals_macro"
sidebar_label: "Включение сравнения NULL в макросе equals"
---

| enable_truthy_nulls_equals_macro | <Constant name="dbt" /> **v1 Latest** | <Constant name="core" /> |
|---|---|---|
| Добавлен | 2025.02 | 1.9.0 |
| Стабилизирован (значение по умолчанию → `true`) | — | — |
| Удален | — | — |

По умолчанию флаг `enable_truthy_nulls_equals_macro` имеет значение `false`. Если установить для него значение `true` в файле `dbt_project.yml`, макрос dbt [equals](/reference/dbt-jinja-functions/cross-database-macros#equals), используемый в инкрементальных материализациях и материализациях снимков, будет выполнять сравнение на равенство с учетом NULL.

По умолчанию макрос `equals()` следует [трехзначной логике (3VL)](https://modern-sql.com/concept/three-valued-logic) SQL, поэтому выражение `NULL = NULL` возвращает `UNKNOWN`, а не `TRUE`.

Когда флаг `enable_truthy_nulls_equals_macro` включен, макрос `equals()` использует семантику оператора [`IS NOT DISTINCT FROM`](https://modern-sql.com/feature/is-distinct-from), при которой два значения `NULL` считаются равными.

Чтобы включить флаг, добавьте его в раздел `flags` файла `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
flags:
  enable_truthy_nulls_equals_macro: true
```

</File>
