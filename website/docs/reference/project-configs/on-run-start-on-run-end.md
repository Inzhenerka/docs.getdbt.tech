---
title: on-run-start & on-run-end
description: "Прочтите это руководство, чтобы понять конфигурации on-run-start и on-run-end в dbt."
datatype: sql-statement | [sql-statement]
---

import OnRunCommands from '/snippets/_onrunstart-onrunend-commands.md';

<File name='dbt_project.yml'>

```yml
on-run-start: sql-statement | [sql-statement]
on-run-end: sql-statement | [sql-statement]
```

</File>

## Определение

SQL-выражение (или список SQL-выражений), которое будет выполнено в начале или в конце следующих команд: <OnRunCommands />

Хуки `on-run-start` и `on-run-end` также могут [вызывать макросы](#call-a-macro-to-grant-privileges), которые возвращают SQL-выражения.

## Примечания по использованию
* Хук `on-run-end` имеет дополнительные переменные jinja, доступные в контексте — ознакомьтесь с [документацией](/reference/dbt-jinja-functions/on-run-end-context).

## Примечания по использованию
* В хуке `on-run-end` в контексте доступны дополнительные Jinja‑переменные — см. [документацию](/reference/dbt-jinja-functions/on-run-end-context).

### Предоставление привилегий на все схемы, которые использует dbt, в конце выполнения
Это использует переменную [schemas](/reference/dbt-jinja-functions/schemas), которая доступна только в хуке `on-run-end`.

<File name='dbt_project.yml'>

```yml
on-run-end:
  - "{% for schema in schemas %}grant usage on schema {{ schema }} to group reporter; {% endfor %}"

```

</File>

### Вызов макроса для предоставления привилегий

<File name='dbt_project.yml'>

```yml
on-run-end: "{{ grant_select(schemas) }}"

```

</File>

### Дополнительные примеры
Мы собрали более подробные примеры [здесь](/docs/build/hooks-operations#additional-examples).