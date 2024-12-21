---
title: "Собираем всё вместе"
---

```bash
dbt run --select "my_package.*+"      # выбрать все модели в my_package и их дочерние элементы
dbt run --select "+some_model+"       # выбрать some_model и всех родителей и дочерние элементы

dbt run --select "tag:nightly+"      # выбрать модели с тегом "nightly" и всех дочерних
dbt run --select "+tag:nightly+"      # выбрать модели с тегом "nightly" и всех родителей и дочерние элементы

dbt run --select "@source:snowplow"   # построить все модели, которые выбирают из источников snowplow, плюс их родителей

dbt test --select "config.incremental_strategy:insert_overwrite,test_name:unique"   # выполнить все тесты `unique`, которые выбирают из моделей, использующих стратегию инкрементального обновления `insert_overwrite`
```

Это может быть сложно! Допустим, я хочу ночной запуск моделей, которые строятся на данных snowplow и подготавливают экспорт, при этом _исключая_ самые большие инкрементальные модели (и ещё одну модель, к тому же).

```bash
dbt run --select "@source:snowplow,tag:nightly models/export" --exclude "package:snowplow,config.materialized:incremental export_performance_timing"
```

Эта команда выбирает все модели, которые:
* Выбирают из источников snowplow, плюс их родителей, _и_ имеют тег "nightly"
* Определены в подпапке модели `export`

За исключением моделей, которые:
* Определены в пакете snowplow и материализуются инкрементально
* Называются `export_performance_timing`