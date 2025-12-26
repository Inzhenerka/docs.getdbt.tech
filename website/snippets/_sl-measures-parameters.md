| Parameter | Description | Required | Type | 
| --- | --- | --- | --- | 
| [`name`](/docs/build/measures#name) | Укажите имя меры. Оно должно быть уникальным и не может повторяться среди всех семантических моделей в вашем dbt‑проекте. | Required | String | 
| [`description`](/docs/build/measures#description) | Описание вычисляемой меры. | Optional | String | 
| [`agg`](/docs/build/measures#aggregation) | dbt поддерживает следующие агрегатные функции: `sum`, `max`, `min`, `average`, `median`, `count_distinct`, `percentile` и `sum_boolean`. | Required | String |
| [`expr`](/docs/build/measures#expr) | Ссылка на существующий столбец в таблице либо SQL‑выражение для создания или вычисления нового значения. | Optional | String | 
| [`non_additive_dimension`](/docs/build/measures#non-additive-dimensions) | Неаддитивные измерения могут быть заданы для мер, которые нельзя агрегировать по определённым измерениям (например, остатки на банковских счетах), чтобы избежать получения некорректных результатов. | Optional | String |
| `agg_params` | Параметры конкретной агрегации, например значение перцентиля. | Optional | Dict |
| `agg_time_dimension` | Поле времени. По умолчанию используется временное измерение агрегации, заданное по умолчанию для семантической модели. | Optional | String |
| `label` | Строка, определяющая отображаемое имя в downstream‑инструментах. Поддерживает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). Доступно в dbt версии 1.7 и выше. | Optional | String |
| `create_metric` | Создаёт метрику типа `simple` на основе меры при установке `create_metric: True`. Атрибуты `label` и `description` автоматически наследуются созданной метрикой. Доступно в dbt версии 1.7 и выше. | Optional | Boolean |
| `config`  | Используйте свойство [`config`](/reference/resource-properties/config) для задания конфигураций метрики. Поддерживается свойство [`meta`](/reference/resource-configs/meta), вложенное в `config`. | Optional |
