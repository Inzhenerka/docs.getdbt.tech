---
title: "Контракты моделей"
id: model-contracts
sidebar_label: "Контракты моделей"
description: "Контракты моделей определяют набор параметров, проверяемых в процессе преобразования"
availability: all_users
---

## Связанная документация {#related-documentation}
- [`contract`](/reference/resource-configs/contract)
- [`columns`](/reference/resource-properties/columns)
- [`constraints`](/reference/resource-properties/constraints)

## Зачем определять контракт? {#why-define-a-contract}

Определение модели dbt так же просто, как написание SQL-запроса `select`. Ваш запрос естественным образом создает набор данных с именами и типами столбцов на основе выбранных вами столбцов и применяемых трансформаций.

Хотя это идеально подходит для быстрого и итеративного развития, для некоторых моделей постоянное изменение структуры возвращаемого набора данных представляет риск, когда другие люди и процессы запрашивают эту модель. Лучше определить набор предварительных "гарантий", которые определяют структуру вашей модели. Мы называем этот набор гарантий "контрактом". При построении вашей модели dbt проверит, что трансформация вашей модели создаст набор данных, соответствующий ее контракту, или не сможет построить модель.

## Где поддерживаются контракты? {#where-are-contracts-supported}

import ModelGovernanceRollback from '/snippets/_model-governance-rollback.md';

<ModelGovernanceRollback />

import Contractsupport from '/snippets/_contract-support.md'; 

<Contractsupport />

## Определение контракта

Допустим, у вас есть модель с запросом примерно такого вида:

<File name="models/marts/dim_customers.sql">

```sql
-- много SQL

final as (

    select
        customer_id,
        customer_name,
        -- ... и многое другое ...
    from ...

)

select * from final
```

</File>

Чтобы применить контракт модели, установите `enforced: true` в конфигурации `contract`.

Когда контракт применяется, он _должен_ включать `name` и `data_type` каждого столбца (где `data_type` соответствует одному из тех, которые понимает ваша платформа данных).

Если ваша модель материализована как `table` или `incremental`, и в зависимости от вашей платформы данных, вы можете дополнительно указать [constraints](/reference/resource-properties/constraints), такие как `not_null` (содержащий нулевые значения).

<File name="models/marts/customers.yml">

```yaml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: customer_id
        data_type: int
        constraints:
          - type: not_null
      - name: customer_name
        data_type: string
      ...
```

</File>

При построении модели с определенным контрактом dbt будет делать две вещи по-другому:
1. dbt выполнит проверку "предварительного полета", чтобы убедиться, что запрос модели вернет набор столбцов с именами и типами данных, соответствующими тем, которые вы определили. Эта проверка не зависит от порядка столбцов, указанных в вашей модели (SQL) или спецификации YAML.
2. dbt включит имена столбцов, типы данных и ограничения в DDL-запросы, которые он отправляет на платформу данных, которые будут применяться при построении или обновлении таблицы модели, и упорядочит столбцы в соответствии с контрактом, а не вашей моделью dbt.

## Поддержка ограничений на платформах

import ConstraintsTable from '/snippets/_constraints-table.md'; 
import BreakingChanges from '/snippets/_versions-contracts.md';

<ConstraintsTable />

### Для каких моделей следует определять контракты? {#which-models-should-have-contracts}

<Expandable alt_header="Для каких моделей следует определять контракты?">

### Чем контракты отличаются от тестов? {#how-are-contracts-different-from-tests}

</Expandable>

<Expandable alt_header="Чем контракты отличаются от тестов?">

[Тесты данных](/docs/build/data-tests) являются более гибким механизмом для проверки содержимого вашей модели _после_ ее построения. Пока вы можете написать запрос, вы можете запустить тест данных. Тесты данных более настраиваемы, например, с [пользовательскими порогами серьезности](/reference/resource-configs/severity). Их легче отлаживать после обнаружения сбоев, потому что вы можете запросить уже построенную модель или [сохранить записи с ошибками в хранилище данных](/reference/resource-configs/store_failures).

В некоторых случаях вы можете заменить тест данных его эквивалентным ограничением. Это имеет преимущество гарантии проверки во время построения и, вероятно, требует меньше вычислительных ресурсов (стоимости) на вашей платформе данных. Предпосылки для замены теста данных ограничением:
- Убедитесь, что ваша платформа данных может поддерживать и применять необходимое вам ограничение. Большинство платформ применяют только `not_null`.
- Материализация вашей модели как `table` или `incremental` (**не** `view` или `ephemeral`).
- Определение полного контракта для этой модели, указав `name` и `data_type` каждого столбца.

**Почему тесты не являются частью контракта?** В аналогии с программными API, структура ответа API является контрактом. Качество и надежность ("время безотказной работы") также являются очень важными атрибутами качества API, но они не являются частью контракта как такового. Когда контракт изменяется в обратной несовместимой манере, это является критическим изменением, требующим увеличения основной версии.

### Нужно ли определять каждый столбец для контракта? {#do-i-need-to-define-every-column-for-a-contract}

</Expandable>

<Expandable alt_header="Нужно ли определять каждый столбец для контракта?">

Да. Контракты dbt распространяются на _все_ столбцы, определённые в модели, и требуют явно объявлять ожидания для _каждого_ из этих столбцов. Явное объявление контракта — не случайность &mdash; именно в этом и заключается замысел этой функциональности.

При этом мы понимаем, что для моделей с большим количеством столбцов это может означать _очень много_ YAML. Обсуждение возможных подходов к созданию и обновлению определений контрактов моделей см. в [dbt-labs/dbt#11764](https://github.com/dbt-labs/dbt/issues/11764).

</Expandable>

<Expandable alt_header="Как обрабатываются изменения, нарушающие совместимость?">

При сравнении с предыдущим состоянием проекта dbt будет искать изменения, нарушающие совместимость, которые могут повлиять на потребителей данных ниже по цепочке зависимостей. Если такие изменения обнаружены, dbt сообщит об ошибке контракта.

<BreakingChanges 
value="Удаление модели с контрактом путем ее удаления, переименования или отключения (dbt v1.9 или выше)."
value2="модели с версией вызовут ошибку. модели без версии вызовут предупреждение."
/>

Подробнее см. в [справочнике по контрактам](/docs/mesh/govern/model-contracts).

</Expandable>

<Expandable alt_header="Можно ли использовать контракты моделей с вложенными полями?">

Да, но только в BigQuery, поскольку вложенные поля внутри [столбцов типа struct](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/data-types#struct_type) имеют строгую типизацию. Контракты моделей полезны, когда модель содержит вложенные данные JSON или данные событий, в которых изменение типа вложенного поля может нарушить работу нижестоящих моделей.

Вложенные поля (структуры) — это столбцы внутри других столбцов. Перечислите каждое внутреннее поле в YAML, используя имя с точечной нотацией, например `b.id` или `b.double_nested.another.even_more`. Для каждого внутреннего поля необходимо указать `name` и `data_type`. При необходимости можно также объявить сам столбец типа struct (в этом примере — `b` или `b.double_nested`), чтобы добавить описание или ограничение для структуры.

<File name="models/nested_fields.yml">

```yaml
models:
  - name: double_nested_fields
    config:
      contract:
        enforced: true
      materialized: table
    columns:
      - name: a
        data_type: string
      - name: b.id
        data_type: integer
      - name: b.name
        data_type: string
      - name: b.double_nested.id
        data_type: integer
      - name: b.double_nested.another.again
        data_type: string
      - name: b.double_nested.another.even_more
        data_type: integer
```

</File>

<File name="models/double_nested_fields.sql">

```sql
select
  'string' as a,
  struct(
    1 as id,
    'name' as name,
    struct(2 as id, struct('test' as again, 2 as even_more) as another) as double_nested
  ) as b
```

</File>

Если значения `name` и `data_type` каждого вложенного поля соответствуют SQL, модель создаётся как обычно. Если они не совпадают, проверка контракта завершается ошибкой и модель не создаётся. Например, если в SQL поле `even_more` имеет строковый тип, а в контракте указан тип `integer`, dbt возвращает:

```text
This model has an enforced contract that failed.
Please ensure the name, data_type, and number of columns in your contract match the columns in your model's definition.

| column_name                       | definition_type | contract_type | mismatch_reason    |
| --------------------------------- | --------------- | ------------- | ------------------ |
| b.double_nested.another.even_more | STRING          | INT64         | data type mismatch |
```

Массивы структур также поддерживаются. Объявите родительский столбец с `data_type: array`, затем перечислите каждое внутреннее поле:

```yaml
- name: my_array
  data_type: array
- name: my_array.id
  data_type: integer
- name: my_array.name
  data_type: string
```

О том, как добавить ограничения, например `not_null`, для вложенных полей, см. в разделе [Ограничения](/reference/resource-properties/constraints).

</Expandable>
