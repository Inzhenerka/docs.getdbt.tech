---
title: "Отложить"
---

Отложить — это мощная функция, которая позволяет запускать подмножество моделей или тестов в [песочнице](/docs/environments-in-dbt) без необходимости предварительной сборки их родительских моделей. Это может сэкономить время и вычислительные ресурсы, когда вы хотите протестировать небольшое количество моделей в большом проекте.

<Lightbox src src="/img/docs/reference/defer-diagram.png" width="50%" title="Используйте 'отложить', чтобы изменить модели в конце конвейера, указывая на производственные модели, вместо того чтобы запускать все родительские." />

Для использования функции отложенного выполнения необходимо передать манифест из предыдущего вызова dbt в флаг `--state` или переменную окружения. В сочетании с методом выбора `state:`, эти функции позволяют реализовать "Slim CI". Узнайте больше о [состоянии](/reference/node-selection/syntax#about-node-selection).

Альтернативная команда, которая выполняет аналогичную функциональность для различных случаев использования, — это `dbt clone` — смотрите документацию по [клонированию](/reference/commands/clone#when-to-use-dbt-clone-instead-of-deferral) для получения дополнительной информации.

Возможно использование отдельного состояния для `state:modified` и `--defer`, передавая пути к различным манифестам для каждого из `--state`/`DBT_STATE` и `--defer-state`/`DBT_DEFER_STATE`. Это позволяет более детально контролировать случаи, когда вы хотите сравнить с логическим состоянием из одной среды или в прошлом, и отложить к примененному состоянию из другой среды или момента времени. Если `--defer-state` не указан, отложенное выполнение будет использовать манифест, переданный в `--state`. В большинстве случаев вы захотите использовать одно и то же состояние для обоих: сравнивать логические изменения с производственными и также "переключаться" на производственную среду для незастроенных родительских ресурсов.

### Использование

```shell
dbt run --select [...] --defer --state path/to/artifacts
dbt test --select [...] --defer --state path/to/artifacts
```

<VersionBlock lastVersion="0.20">

```shell
dbt run --models [...] --defer --state path/to/artifacts
dbt test --models [...] --defer --state path/to/artifacts
```

</VersionBlock>

По умолчанию dbt использует пространство имен [`target`](/reference/dbt-jinja-functions/target) для разрешения вызовов `ref`.

Когда включено `--defer`, dbt разрешает вызовы `ref`, используя манифест состояния, но только если:

1. Узел не входит в число выбранных узлов, _и_
2. Он не существует в базе данных (или используется `--favor-state`).

Эфемерные модели никогда не откладываются, так как они служат "проводниками" для других вызовов `ref`.

При использовании отложенного выполнения вы можете выбирать из производственных наборов данных, наборов данных разработки или их смеси. Обратите внимание, что это может привести к неожиданным результатам:
- если вы применяете ограничения, специфичные для среды, в разработке, но не в производстве, так как вы можете выбрать больше данных, чем ожидаете,
- при выполнении тестов, которые зависят от нескольких родительских моделей (например, `relationships`), так как вы тестируете "через" среды.

Отложенное выполнение требует установки как `--defer`, так и `--state`, либо путем явной передачи флагов, либо путем установки переменных окружения (`DBT_DEFER` и `DBT_STATE`). Если вы используете dbt Cloud, прочитайте о [настройке CI задач](/docs/deploy/continuous-integration).

#### Предпочитать состояние

Когда передан `--favor-state`, dbt отдает приоритет определениям узлов из `--state directory`. Однако это не применяется, если узел также является частью выбранных узлов.

### Пример

В моей локальной среде разработки я создаю все модели в своей целевой схеме, `dev_alice`. В производственной среде те же модели создаются в схеме с именем `prod`.

Я получаю сгенерированные dbt [артефакты](/docs/deploy/artifacts) (в частности, `manifest.json`) из производственного запуска и копирую их в локальный каталог под названием `prod-run-artifacts`.

### запуск
Я работал над `model_b`:

<File name='models/model_b.sql'>

```sql
select

    id,
    count(*)

from {{ ref('model_a') }}
group by 1
```

Я хочу протестировать свои изменения. Ничего не существует в моей схеме разработки, `dev_alice`.

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

Если я ранее не запускал `model_a` в этой среде разработки, `dev_alice.model_a` не будет существовать, что приведет к ошибке базы данных.

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

Поскольку `model_a` не выбран, dbt проверит, существует ли `dev_alice.model_a`. Если он не существует, dbt разрешит все экземпляры `{{ ref('model_a') }}` на `prod.model_a`.

</TabItem>
</Tabs>

### тест

У меня также есть тест `relationships`, который устанавливает ссылочную целостность между `model_a` и `model_b`:

<File name='models/resources.yml'>

```yml
version: 2

models:
  - name: model_b
    columns:
      - name: id
        tests:
          - relationships:
              to: ref('model_a')
              field: id
```

(Немного глупо, так как все данные в `model_b` должны были поступить из `model_a`, но приостановите свое недоверие.)

</File>

<Tabs
  defaultValue="no_defer"
  values={[
    { label: 'Без отложенного выполнения', value: 'no_defer', },
    { label: 'С отложенным выполнением', value: 'yes_defer', },
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

Тест `relationships` требует как `model_a`, так и `model_b`. Поскольку я не построил `model_a` в предыдущем запуске dbt, `dev_alice.model_a` не существует, и этот тестовый запрос не проходит.

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

dbt проверит, существует ли `dev_alice.model_a`. Если он не существует, dbt разрешит все экземпляры `{{ ref('model_a') }}`, включая те, что в тестах схемы, использовать `prod.model_a`. Запрос проходит. Хотите ли вы действительно проверять ссылочную целостность между средами — это другой вопрос.

</TabItem>
</Tabs>

## Связанные документы

- [Использование отложенного выполнения в dbt Cloud](/docs/cloud/about-cloud-develop-defer)
- [on_configuration_change](/reference/resource-configs/on_configuration_change)