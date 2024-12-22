При использовании Семантического слоя dbt в контексте [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro), мы рекомендуем следующее:

- У вас должен быть один автономный проект, который содержит ваши семантические модели и метрики.
- Затем, по мере создания Семантического слоя, вы можете [перекрестно ссылаться на модели dbt](/docs/collaborate/govern/project-dependencies) в различных проектах или пакетах, чтобы создавать свои семантические модели, используя [функцию `ref` с двумя аргументами](/reference/dbt-jinja-functions/ref#ref-project-specific-models) (`ref('project_name', 'model_name')`).
- Ваш проект Семантического слоя dbt служит глобальным источником истины для остальных ваших проектов.

#### Пример использования
Например, предположим, у вас есть публичная модель (`fct_orders`), которая находится в проекте `jaffle_finance`. При создании вашей семантической модели используйте следующий синтаксис для ссылки на модель:

<File name="models/metrics/semantic_model_name.yml">

```yaml
semantic_models:
  - name: customer_orders
    defaults:
      agg_time_dimension: first_ordered_at
    description: |
      Март на уровне клиентов, агрегирующий заказы клиентов.
    model: ref('jaffle_finance', 'fct_orders') # ref('project_name', 'model_name')
    entities:
      ...остальная часть конфигурации...
    dimensions:
      ...остальная часть конфигурации...
    measures:
      ...остальная часть конфигурации...
```
</File>

Обратите внимание, что в параметре `model` мы используем функцию `ref` с двумя аргументами для ссылки на публичную модель `fct_orders`, определенную в проекте `jaffle_finance`.  
<br />