---
title: "Defer"
---

Defer — это мощная функция, которая позволяет запускать подмножество моделей или тестов в [песочнице](/docs/environments-in-dbt) без необходимости сначала строить их родительские модели. Это может сэкономить время и вычислительные ресурсы, когда вы хотите протестировать небольшое количество моделей в большом проекте.

<Lightbox src src="/img/docs/reference/defer-diagram.png" width="50%" title="Используйте 'defer', чтобы модифицировать модели в конце конвейера, указывая на производственные модели, вместо того чтобы запускать все вышестоящие." />

Для использования defer требуется передать манифест из предыдущего запуска dbt в параметр `--state` или через переменную окружения. Вместе с методом выбора `state:` эти возможности позволяют реализовать подход «Slim CI». Подробнее читайте в разделе [state](/reference/node-selection/state-selection).

Альтернативной командой, которая выполняет аналогичную функциональность для других случаев использования, является `dbt clone` — см. документацию по [clone](/reference/commands/clone#when-to-use-dbt-clone-instead-of-deferral) для получения дополнительной информации.

Можно использовать отдельное состояние для `state:modified` и `--defer`, передавая пути к разным манифестам для каждого из `--state`/`DBT_STATE` и `--defer-state`/`DBT_DEFER_STATE`. Это позволяет более точно контролировать случаи, когда вы хотите сравнить с логическим состоянием из одной среды или прошлого момента времени и отложить применение состояния из другой среды или момента времени. Если `--defer-state` не указан, откладывание будет использовать манифест, переданный в `--state`. В большинстве случаев вы захотите использовать одно и то же состояние для обоих: сравнивать логические изменения с производством, а также "переключаться" на производственную среду для не построенных вышестоящих ресурсов.

### Использование

```shell
dbt run --select [...] --defer --state path/to/artifacts
dbt test --select [...] --defer --state path/to/artifacts
```

По умолчанию dbt использует пространство имён [`target`](/reference/dbt-jinja-functions/target) для разрешения вызовов `ref`.

Когда `--defer` включен, dbt разрешает вызовы ref, используя манифест состояния, но только если:

1. Узел не входит в число выбранных узлов, _и_
2. Он не существует в базе данных (или используется `--favor-state`).

Эфемерные модели никогда не откладываются, так как они служат "переходами" для других вызовов `ref`.

При использовании defer вы можете выбирать из производственных наборов данных, наборов данных для разработки или их комбинации. Обратите внимание, что это может привести к неожиданным результатам:
- если вы применяете ограничения, специфичные для среды, в разработке, но не в производстве, так как вы можете выбрать больше данных, чем ожидали
- при выполнении тестов, которые зависят от нескольких родителей (например, `relationships`), так как вы тестируете "между" средами

Для использования deferral необходимо задать **оба** параметра: `--defer` и `--state`. Это можно сделать либо явно, передав флаги в командной строке, либо через переменные окружения (`DBT_DEFER` и `DBT_STATE`). Если вы используете <Constant name="cloud" />, ознакомьтесь с разделом о том, [как настроить CI‑задачи](/docs/deploy/continuous-integration).

#### Предпочтение состояния

Когда передан `--favor-state`, dbt отдает приоритет определениям узлов из каталога `--state`. Однако это не применяется, если узел также является частью выбранных узлов.

### Пример

В моей локальной среде разработки я создаю все модели в моей целевой схеме, `dev_alice`. В производстве те же модели создаются в схеме с именем `prod`.

Я получаю доступ к dbt-сгенерированным [артефактам](/docs/deploy/artifacts) (а именно `manifest.json`) из производственного запуска и копирую их в локальный каталог под названием `prod-run-artifacts`.

### run
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

### test

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

(Немного глупо, так как все данные в `model_b` должны были поступить из `model_a`, но давайте предположим это.)

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

## Связанная документация

- [Использование defer в <Constant name="cloud" />](/docs/cloud/about-cloud-develop-defer)
- [on_configuration_change](/reference/resource-configs/on_configuration_change)

- [Использование defer в dbt Cloud](/docs/cloud/about-cloud-develop-defer)
- [on_configuration_change](/reference/resource-configs/on_configuration_change)