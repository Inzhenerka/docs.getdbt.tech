---
title: "Добавление групп в ваш DAG"
sidebar_label: "Группы"
id: "groups"
description: "Когда вы определяете группы в проектах dbt, вы превращаете неявные отношения в явные группы."
keywords:
  - группы доступ mesh
---

Группа — это коллекция узлов в dbt DAG. Группы имеют названия, и у каждой группы есть `владелец`. Они позволяют организовать целенаправленное сотрудничество внутри и между командами, ограничивая [доступ к приватным](/reference/resource-configs/access) моделям.

Члены группы могут включать модели, тесты, seeds, snapshots, анализы и метрики. (Не включены: источники и экспозиции.) Каждый узел может принадлежать только одной группе.

### Объявление группы

Группы определяются в файлах `.yml`, вложенных под ключом `groups:`.

<File name='models/marts/finance/finance.yml'>

```yaml
groups:
  - name: finance
    owner:
      # 'name' или 'email' обязательны; дополнительные свойства разрешены
      email: finance@jaffleshop.com
      slack: finance-data
      github: finance-data-team
```

</File>

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
    access: private
    config:
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

* [Доступ к моделям](/docs/collaborate/govern/model-access#groups)
* [Конфигурация группы](/reference/resource-configs/group)
* [Выбор группы](/reference/node-selection/methods#group)