---
title: "Defer"
---

Defer — это мощная функция, которая позволяет запускать подмножество <VersionBlock lastVersion="1.10">моделей или тестов</VersionBlock><VersionBlock firstVersion="1.11">моделей, тестов или функций</VersionBlock> в [изолированной среде](/docs/environments-in-dbt) без предварительного построения их вышестоящих родительских моделей. Это позволяет сэкономить время и вычислительные ресурсы, когда нужно протестировать небольшое количество моделей в большом проекте.

<Lightbox src src="/img/docs/reference/defer-diagram.png" width="50%" title="Используйте 'defer', чтобы модифицировать модели в конце конвейера, указывая на производственные модели, вместо того чтобы запускать все вышестоящие." />

Для использования defer требуется манифест из предыдущего вызова dbt. Укажите путь с помощью флага `--state` или переменной окружения <VersionBlock lastVersion="1.10">`DBT_STATE`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_STATE`</VersionBlock>. Вместе с методом выбора `state:` эти возможности позволяют реализовать «Slim CI». Подробнее читайте в разделе [Состояние](/reference/node-selection/state-selection).

В некоторых случаях для достижения аналогичного результата можно использовать `dbt clone`. Подробнее см. в разделе [clone](/reference/commands/clone#when-to-use-dbt-clone-instead-of-deferral).

Для `state:modified` и `--defer` можно использовать разные состояния, передав пути к разным манифестам через `--state`/<VersionBlock lastVersion="1.10">`DBT_STATE`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_STATE`</VersionBlock> и `--defer-state`/<VersionBlock lastVersion="1.10">`DBT_DEFER_STATE`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_DEFER_STATE`</VersionBlock> соответственно. Это обеспечивает более точный контроль в случаях, когда вы хотите:

- Сравнивать с логическим состоянием из одной среды или на определённый момент в прошлом
- Использовать для defer применённое состояние из другой среды или на другой момент времени

Если `--defer-state` не указан, для defer будет использоваться манифест, переданный через `--state`. В большинстве случаев для обеих задач стоит использовать одно и то же состояние: сравнивать логические изменения с производственной средой, а для невыполненных вышестоящих ресурсов также «переключаться» на производственную среду.

### Использование {#usage}

```shell
dbt run --select [...] --defer --state path/to/artifacts
dbt test --select [...] --defer --state path/to/artifacts
```

По умолчанию dbt использует пространство имён [`target`](/reference/dbt-jinja-functions/target) для разрешения вызовов `ref`.

Когда включён `--defer`, dbt разрешает вызовы `ref`<VersionBlock firstVersion="1.11"> и `function`</VersionBlock>, используя манифест состояния, но только если:

1. Узел не входит в число выбранных узлов, _и_
2. Он не существует в базе данных (или используется `--favor-state`).

Эфемерные модели никогда не используют отложенное разрешение ссылок, поскольку они служат «промежуточными звеньями» для других вызовов `ref`. 

<VersionBlock firstVersion="1.11">

Для [пользовательских функций (UDF)](/docs/build/udfs), на которые ссылаются с помощью `{{ function('...') }}`, отложенное разрешение ссылок применяется при тех же условиях. В этом случае `function()` разрешается в определение функции из манифеста состояния, если UDF не выбрана или не создана в текущем целевом окружении.

</VersionBlock>

:::info

При использовании отложенного разрешения ссылок вы можете выбирать данные из наборов данных рабочего окружения, окружения разработки или из обоих одновременно. Обратите внимание, что это может привести к неожиданным результатам:
- Если в окружении разработки вы применяете ограничения, зависящие от окружения, а в рабочем окружении — нет, вы можете выбрать больше данных, чем ожидалось.
- Тесты, зависящие от нескольких родительских объектов (например, `relationships`), могут выполняться с использованием данных из разных окружений.

:::

Для отложенного разрешения ссылок необходимо задать и `--defer`, и `--state`: либо явно передав флаги, либо установив переменные окружения (<VersionBlock lastVersion="1.10">`DBT_DEFER` и `DBT_STATE`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_DEFER` и `DBT_ENGINE_STATE`</VersionBlock>). Подробнее см. в разделе [Непрерывная интеграция](/docs/deploy/continuous-integration).

#### Предпочтение состояния {#favor-state}

Когда передан `--favor-state`, dbt отдает приоритет определениям узлов из каталога `--state`. Однако это не применяется, если узел также является частью выбранных узлов.

При передаче `--favor-state` dbt отдает приоритет определениям узлов из каталога `--state`. Однако это не применяется, если узел также входит в число выбранных узлов.

В моей локальной среде разработки я создаю все модели в моей целевой схеме, `dev_alice`. В производстве те же модели создаются в схеме с именем `prod`.

Я получаю доступ к dbt-сгенерированным [артефактам](/docs/deploy/artifacts) (а именно `manifest.json`) из производственного запуска и копирую их в локальный каталог под названием `prod-run-artifacts`.

### run {#run}
Я работал над `model_b`:

<File name='models/model_b.sql'>

```sql
select

    id,
    count(*)

from {{ ref('model_a') }}
group by 1
```

Я хочу протестировать свои изменения. В моей схеме разработки, `dev_alice`, ничего не существует.

</File>

<Tabs
  defaultValue="no_defer"
  values={[
    { label: 'Стандартный запуск', value: 'no_defer', },
    { label: 'Отложенный запуск', value: 'yes_defer', },
  ]
}>

<TabItem value="no_defer">

```shell
dbt run --select "model_b"
```

<File name='target/run/my_project/model_b.sql'>

```sql
create or replace view dev_me.model_b as (

    select

        id,
        count(*)

    from dev_alice.model_a
    group by 1

)
```

Если я ранее не запускал `model_a` в этой среде разработки, `dev_alice.model_a` не будет существовать, что вызовет ошибку базы данных.

</File>
</TabItem>

<TabItem value="yes_defer">

```shell
dbt run --select "model_b" --defer --state prod-run-artifacts
```

<File name='target/run/my_project/model_b.sql'>

```sql
create or replace view dev_me.model_b as (

    select

        id,
        count(*)

    from prod.model_a
    group by 1

)
```

</File>

Поскольку `model_a` не выбран, dbt проверит, существует ли `dev_alice.model_a`. Если он не существует, dbt разрешит все экземпляры `{{ ref('model_a') }}` в `prod.model_a`.

</TabItem>
</Tabs>

### test {#test}

У меня также есть тест `relationships`, который устанавливает ссылочную целостность между `model_a` и `model_b`:

<File name='models/resources.yml'>

```yml

models:
  - name: model_b
    columns:
      - name: id
        data_tests:
          - relationships:
              arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                to: ref('model_a')
                field: id
```

(Это упрощённый пример, поскольку все данные в `model_b` уже поступают из `model_a`)

</File>

<Tabs
  defaultValue="no_defer"
  values={[
    { label: 'Без defer', value: 'no_defer', },
    { label: 'С defer', value: 'yes_defer', },
  ]
}>

<TabItem value="no_defer">

```shell
dbt test --select "model_b"
```

<File name='target/compiled/.../relationships_model_b_id__id__ref_model_a_.sql'>

```sql
select count(*) as validation_errors
from (
    select id as id from dev_alice.model_b
) as child
left join (
    select id as id from dev_alice.model_a
) as parent on parent.id = child.id
where child.id is not null
  and parent.id is null
```

Тест `relationships` требует как `model_a`, так и `model_b`. Поскольку я не построил `model_a` в своем предыдущем `dbt run`, `dev_alice.model_a` не существует, и этот тестовый запрос не выполняется.

</File>
</TabItem>

<TabItem value="yes_defer">

```shell
dbt test --select "model_b" --defer --state prod-run-artifacts
```

<File name='target/compiled/.../relationships_model_b_id__id__ref_model_a_.sql'>

```sql
select count(*) as validation_errors
from (
    select id as id from dev_alice.model_b
) as child
left join (
    select id as id from prod.model_a
) as parent on parent.id = child.id
where child.id is not null
  and parent.id is null
```

</File>

dbt проверит, существует ли `dev_alice.model_a`. Если он не существует, dbt разрешит все экземпляры `{{ ref('model_a') }}`, включая те, что в тестах схемы, использовать `prod.model_a`. Запрос выполняется успешно. Вопрос, действительно ли я хочу тестировать ссылочную целостность между средами, остается открытым.

</TabItem>
</Tabs>

## Связанная документация {#related-docs}

- [Использование defer в <Constant name="dbt" />](/docs/platform/about-defer)
- [on_configuration_change](/reference/resource-configs/on_configuration_change)

- [Использование defer в dbt Cloud](/docs/platform/about-defer)
- [on_configuration_change](/reference/resource-configs/on_configuration_change)