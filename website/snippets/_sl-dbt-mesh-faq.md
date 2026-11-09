При использовании Семантического слоя dbt в контексте [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro), мы рекомендуем следующее:

- У вас есть один отдельный проект, содержащий ваши семантические модели и метрики.
- Затем, по мере создания семантического слоя, вы можете [ссылаться на модели dbt](/docs/mesh/govern/project-dependencies) из разных проектов или пакетов, чтобы создавать семантические модели с помощью [функции `ref` с двумя аргументами](/reference/dbt-jinja-functions/ref#ref-project-specific-models) (`ref('project_name', 'model_name')`).
- Ваш проект dbt Semantic Layer служит единым источником достоверных данных для всех остальных проектов.

<VersionBlock firstVersion="1.12">
import SLMeshLatestSpec from '/snippets/_sl-mesh-latest-spec.md';

<SLMeshLatestSpec/>
</VersionBlock>

#### Пример использования 
Например, предположим, что у вас есть публичная модель (`fct_orders`), которая находится в проекте `jaffle_finance`. При создании семантической модели используйте следующий синтаксис, чтобы сослаться на эту модель с помощью `ref`:


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

Обратите внимание, что в параметре `model` мы используем функцию `ref` с двумя аргументами, чтобы сослаться на публичную модель `fct_orders`, определённую в проекте `jaffle_finance`.
<br />
