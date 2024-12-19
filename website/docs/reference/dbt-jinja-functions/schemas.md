---
title: "О переменной schemas"
sidebar_label: "schemas"
id: "schemas"
description: "Список схем, в которых dbt создал объекты во время текущего выполнения."
---

`schemas` — это переменная, доступная в хуке `on-run-end`, представляющая собой список схем, в которых dbt создал объекты в ходе этого выполнения.

Если вы не используете [пользовательские схемы](/docs/build/custom-schemas), `schemas` будет равняться вашей целевой схеме, например, `['dbt_alice']`. Если вы используете пользовательские схемы, они также будут включены, например, `['dbt_alice', 'dbt_alice_marketing', 'dbt_alice_finance']`.

Переменная `schemas` полезна для предоставления привилегий для всех схем, в которых dbt создает отношения, следующим образом (обратите внимание, что это синтаксис, специфичный для Redshift):

<File name='dbt_project.yml'>

```yaml
...

on-run-end:
  - "{% for schema in schemas%}grant usage on schema {{ schema }} to group reporter;{% endfor%}"
  - "{% for schema in schemas %}grant select on all tables in schema {{ schema }} to group reporter;{% endfor%}"
  - "{% for schema in schemas %}alter default privileges in schema {{ schema }}  grant select on tables to group reporter;{% endfor %}"
```

</File>

:::info Хотите более подробные инструкции о рекомендуемом способе предоставления привилегий?

Мы написали полную статью на эту тему [здесь](https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430)

:::