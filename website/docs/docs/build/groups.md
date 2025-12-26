---
title: "Добавление групп в ваш DAG"
sidebar_label: "Группы"
id: "groups"
keywords:
  - группы доступ mesh
---

Группа — это коллекция узлов в dbt DAG. Группы имеют названия, и у каждой группы есть `владелец`. Они позволяют организовать целенаправленное сотрудничество внутри и между командами, ограничивая [доступ к приватным](/reference/resource-configs/access) моделям.

Члены группы могут включать модели, тесты, seeds, snapshots, анализы и метрики. (Не включены: источники и экспозиции.) Каждый узел может принадлежать только одной группе.

### Объявление группы

import DefineGroups from '/snippets/_define-groups.md';

<DefineGroups />

#### Централизованное определение группы

Чтобы централизованно определить группу в вашем проекте, есть два варианта:

- Создать один файл `_groups.yml` в корне директории `models`.
- Создать один файл `_groups.yml` в корне директории `groups`. Для этого варианта также необходимо настроить параметр [`model-paths`](/reference/project-configs/model-paths) в файле `dbt_project.yml`:

  ```yml 
  model-paths: ["models", "groups"]
  ```


### Добавление модели в группу

Используйте конфигурацию `group`, чтобы добавить одну или несколько моделей в группу.

<Tabs>
<TabItem value="project" label="На уровне проекта">

<File name='dbt_project.yml'>

```yml
models:
  marts:
    finance:
      +group: finance
```

</File>

</TabItem>

<TabItem value="model-yaml" label="На уровне модели">

<File name='models/schema.yml'>

```yml
models:
  - name: model_name
    config:
      group: finance
```

</File>

</TabItem>

<TabItem value="model-file" label="В файле">

<File name='models/model_name.sql'>

```sql
{{ config(group = 'finance') }}

select ...
```

</File>

</TabItem>

</Tabs>

### Ссылка на модель в группе

По умолчанию все модели в группе имеют модификатор доступа `protected`. Это означает, что они могут быть использованы в качестве ссылки для последующих ресурсов в _любой_ группе в том же проекте, используя функцию [`ref`](/reference/dbt-jinja-functions/ref). Если свойство `access` сгруппированной модели установлено как `private`, только ресурсы внутри её группы могут ссылаться на неё.

<File name='models/schema.yml'>

```yml
models:
  - name: finance_private_model
    config:
      access: private # changed to config in v1.10
      group: finance

  # в другой группе!
  - name: marketing_model
    config:
      group: marketing
```
</File>

<File name='models/marketing_model.sql'>

```sql
select * from {{ ref('finance_private_model') }}
```
</File>

```shell
$ dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Parsing Error
  Node model.jaffle_shop.marketing_model attempted to reference node model.jaffle_shop.finance_private_model, 
  which is not allowed because the referenced node is private to the finance group.
```

## Связанные документы

* [Доступ к моделям](/docs/mesh/govern/model-access#groups)
* [Конфигурация групп](/reference/resource-configs/group)
* [Выбор групп](/reference/node-selection/methods#group)
