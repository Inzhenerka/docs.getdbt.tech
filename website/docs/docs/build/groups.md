---
title: "Добавление групп в ваш DAG"
sidebar_label: "Группы"
id: "groups"
description: "Когда вы определяете группы в проектах dbt, вы превращаете неявные отношения в явную группировку."
keywords:
  - группы доступ сетка
---

Группа — это коллекция узлов в DAG dbt. Группы имеют имена, и у каждой группы есть `owner`. Они позволяют целенаправленно сотрудничать внутри и между командами, ограничивая [доступ к приватным](/reference/resource-configs/access) моделям.

Членами группы могут быть модели, тесты, семена, снимки, анализы и метрики. (Не включены: источники и экспозиции.) Каждый узел может принадлежать только одной группе.

### Объявление группы

Группы определяются в `.yml` файлах, вложенных под ключом `groups:`.

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
<TabItem value="project" label="Уровень проекта">

<File name='dbt_project.yml'>

```yml
models:
  marts:
    finance:
      +group: finance
```

</File>

</TabItem>

<TabItem value="model-yaml" label="Уровень модели">

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

По умолчанию все модели в группе имеют модификатор доступа `protected` [access modifier](/reference/resource-configs/access). Это означает, что на них могут ссылаться ресурсы ниже по потоку в _любой_ группе в том же проекте, используя функцию [`ref`](/reference/dbt-jinja-functions/ref). Если свойство `access` модели в группе установлено на `private`, только ресурсы внутри этой группы могут на нее ссылаться.

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
dbt.exceptions.DbtReferenceError: Ошибка разбора
  Узел model.jaffle_shop.marketing_model попытался сослаться на узел model.jaffle_shop.finance_private_model, 
  что не разрешено, поскольку ссылающийся узел является приватным для группы finance.
```

## Связанные документы

* [Доступ к моделям](/docs/collaborate/govern/model-access#groups)
* [Конфигурация группы](/reference/resource-configs/group)
* [Выбор группы](/reference/node-selection/methods#group)