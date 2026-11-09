---
title: "Метрики как измерения с фильтрами метрик"
id: "ref-metrics-in-filters"
description: "Добавляйте метрики в качестве измерений в фильтры метрик, чтобы создавать более сложные метрики и получать более глубокие аналитические выводы."
sidebar_label: "Метрики как измерения"
availability: all_users
---

[Метрики](/docs/build/metrics-overview) предоставляют пользователям ценные сведения о данных, такие как количество активных пользователей и общие тенденции производительности, чтобы информировать бизнес-решения. [Измерения](/docs/build/dimensions), с другой стороны, помогают категоризировать данные через атрибуты, такие как тип пользователя или количество заказов, сделанных клиентом.

Для принятия обоснованных бизнес-решений некоторые метрики нуждаются в значении другой метрики как части определения метрики, что приводит нас к концепции "метрики как измерения".

В этом документе объясняется, как использовать метрики в качестве измерений с помощью фильтров метрик, что позволяет создавать более сложные метрики и получать более глубокие аналитические выводы.

## Ссылка на метрику в фильтре {#reference-a-metric-in-a-filter}

Используйте синтаксис объекта `Metric()`, чтобы ссылаться на метрику в фильтре `where` для другой метрики. Функция для ссылки на метрику принимает имя метрики и ровно одну сущность:

```yaml
{{ Metric('metric_name', group_by=['entity_name']) }}
```

### Пример использования {#usage-example}

Например, компания, предоставляющая программное обеспечение как услугу (SaaS), хочет подсчитать активированные аккаунты. В этом случае определение активированного аккаунта — это аккаунт с более чем пятью запусками модели данных.

Чтобы выразить эту метрику в SQL, компания выполнит следующие шаги:
- Напишет запрос для расчета количества запусков модели данных на аккаунт.
- Затем подсчитает количество аккаунтов, у которых более пяти запусков модели данных.

<File name="models/model_name.sql">

```sql
with data_models_per_user as (
    select
        account_id as account,
        count(model_runs) as data_model_runs
    from 
        {{ ref('fct_model_runs') }}
    group by 
        account_id
),

activated_accounts as (
    select
        count(distinct account_id) as activated_accounts
    from 
        {{ ref('dim_accounts') }}
    left join 
        data_models_per_user 
    on 
        {{ ref('dim_accounts') }}.account_id = data_models_per_user.account
    where 
        data_models_per_user.data_model_runs > 5
)

select
    *
from 
    activated_accounts
```
</File>

Этот SQL-запрос вычисляет количество `activated_accounts`, используя метрику `data_model_runs` как измерение для сущности пользователя. Он фильтрует на основе значения метрики, ограниченного сущностью аккаунта. Вы можете выразить эту логику на уровне запроса или в YAML-конфигурации метрики.

#### YAML-конфигурация {#yaml-configuration}

Используя тот же пример `activated_accounts`, упомянутый в [примере использования](#usage-example), следующий YAML-пример объясняет, как компания может создать [семантические модели](/docs/build/semantic-models) и [метрики](/docs/build/metrics-overview), и использовать объект `Metric()`, чтобы ссылаться на метрику `data_model_runs` в фильтре метрики `activated_accounts`:

<VersionBlock lastVersion="1.11">

- Создайте две семантические модели: `model_runs` и `accounts`.
- Создайте `measure` и `metric` для подсчёта запусков моделей данных, а также ещё одну меру для подсчёта пользователей.
- Укажите внешнюю сущность `account` в семантической модели `model_runs`.
- Затем создайте метрику `Activated Accounts`, отфильтровав аккаунты, у которых более пяти запусков моделей данных.

  <File name="models/metrics/semantic_model.yml">

  ```yaml
  semantic_models:
    - name: model_runs
      ... # Placeholder for other configurations
      entities:
        - name: model_run
          type: primary
        - name: account
          type: foreign
      measures:
        - name: data_model_runs
          agg: sum
          expr: 1
          create_metric: true # Атрибут 'create_metric: true' автоматически создает метрику 'data_model_runs'.

    - name: accounts
      ... # Placeholder for other configurations
      entities:
        - name: account
          type: primary
      measures:
        - name: accounts
          agg: sum
          expr: 1
          create_metric: true
  metrics:
    - name: activated_accounts
      label: Activated Accounts
      type: simple
      type_params:
        measure: accounts
      filter: |
        {{ Metric('data_model_runs', group_by=['account']) }} > 5
  ```
  </File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

- Создайте две семантические модели: `model_runs` и `accounts`.
- Создайте метрики для подсчета запусков моделей данных и пользователей.
- Укажите внешнюю сущность `account` в семантической модели `model_runs`.
- Затем создайте метрику `Activated Accounts`, отфильтровав аккаунты, у которых более пяти запусков моделей данных.
<File name="models/model_runs.yml">

  ```yaml
  models:
    - name: model_runs
      semantic_model:
        enabled: true
      # ... other configurations ...
      columns:
        - name: model_run_id
          entity:
            type: primary
            name: model_run
        - name: account_id
          entity:
            type: foreign
            name: account
      
      metrics:
        - name: data_model_runs
          type: simple
          agg: sum
          expr: 1

    - name: accounts
      semantic_model:
        enabled: true
      # ... other configurations ...
      columns:
        - name: account_id
          entity:
            type: primary
            name: account
      
      metrics:
        - name: accounts
          type: simple
          agg: sum
          expr: 1
        
        # Metric that filters accounts based on another metric
        - name: activated_accounts
          label: Activated Accounts
          type: simple
          agg: sum
          expr: 1
          filter: |
            {{ Metric('data_model_runs', group_by=['account']) }} > 5
  ```
</File>

</VersionBlock>


  Давайте разберем SQL, который система генерирует на основе определения метрики при выполнении команды `dbt sl query --metrics activated_accounts` в интерфейсе командной строки:

- Фильтр `{{ Metric('data_model_runs', group_by=['account']) }}` генерирует SQL, аналогичный подзапросу `data_models_per_user`, показанному ранее:

	```sql
	select
		sum(1) as data_model_runs,
		account
	from 
		data_model_runs
	group by
		account
	```

- MetricFlow соединяет этот запрос с запросом, сгенерированным `accounts`, по элементам группировки и применяет условия фильтрации:

	```sql
	select
      sum(1) as activated_accounts
	from accounts
  left join (
      select
          sum(1) as data_model_runs, 
		      account
	    from data_model_runs
	    group by 
		      account
  ) as subq on accounts.account = subq.account
  where data_model_runs > 5
	```

  Промежуточные таблицы, используемые для создания этой метрики: Аккаунты с измерением `data_model_runs`

  | account | data_model runs |
  | --- | --- |
  | 1 | 4 |
  | 2 | 7 |
  | 3 | 9 |
  | 4 | 1 |

  MetricFlow затем фильтрует эту таблицу до аккаунтов с более чем 5 запусками модели данных и подсчитывает количество аккаунтов, соответствующих этому критерию:

  | activated_accounts |
  | --- |
  | 2 |

#### Фильтр запроса {#query-filter}

Вы также можете использовать метрики в фильтрах на уровне запроса. Запустите эту команду в интерфейсе командной строки (CLI), чтобы сгенерировать тот же SQL-запрос, на который была ссылка ранее:

```dbt sl query --metrics accounts --where "{{ Metric('data_model_runs', group_by=['account']) }} > 5"```

Полученный SQL и данные будут такими же, за исключением имени метрики `accounts` вместо `activated_accounts`.

## Соображения

- При использовании фильтра по метрике убедитесь, что подзапрос можно соединить с внешним запросом без размножения строк в результате (неожиданного увеличения количества строк).
  - Пример, в котором аккаунты фильтруются с помощью `{{ Metric('data_model_runs', group_by=['account']) }}`, корректен, поскольку запуски моделей агрегируются до уровня аккаунта.
  - Однако фильтрация 'accounts' по `{{ Metric('data_model_runs', group_by=['model']) }}` некорректна из-за связи «один ко многим» между аккаунтами и запусками моделей, которая приводит к дублированию данных.
- Метрику можно группировать только по одной сущности. Поддержка группировки по нескольким сущностям и измерениям пока не реализована.
- В будущем вы сможете использовать метрики в качестве измерений, например в следующих сценариях:
  - Сегментация пользователей: сегментируйте пользователей, используя количество заказов, размещённых пользователем за последние 7 дней, в качестве измерения.
  - Прогнозирование оттока: используйте количество обращений в службу поддержки, отправленных с аккаунта за первые 30 дней, для прогнозирования потенциального оттока.
  - Отслеживание активации: определяйте активацию аккаунта или пользователя на основе конкретных действий, выполненных в течение определённого количества дней после регистрации.
  - Поддержка фильтров по метрикам, требующих соединений через несколько промежуточных сущностей (multi-hop joins), пока не реализована.
