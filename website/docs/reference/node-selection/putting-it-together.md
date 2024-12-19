---
title: "Собираем все вместе"
---

```bash
dbt run --select "my_package.*+"      # выбрать все модели в my_package и их дочерние модели
dbt run --select "+some_model+"       # выбрать some_model и все родительские и дочерние модели

dbt run --select "tag:nightly+"      # выбрать модели с тегом "nightly" и все дочерние модели
dbt run --select "+tag:nightly+"      # выбрать модели с тегом "nightly" и все родительские и дочерние модели

dbt run --select "@source:snowplow"   # построить все модели, которые выбирают из источников snowplow, плюс их родительские модели

dbt test --select "config.incremental_strategy:insert_overwrite,test_name:unique"   # выполнить все тесты `unique`, которые выбирают из моделей, использующих стратегию инкрементального обновления `insert_overwrite`
```

Это может быть сложно! Допустим, я хочу запустить модели каждую ночь, которые строятся на основе данных snowplow и подают экспорт, при этом _исключая_ самые большие инкрементальные модели (и одну другую модель).

```bash
dbt run --select "@source:snowplow,tag:nightly models/export" --exclude "package:snowplow,config.materialized:incremental export_performance_timing"
```

Эта команда выбирает все модели, которые:
* Выбирают из источников snowplow, плюс их родительские модели, _и_ имеют тег "nightly"
* Определены в подпапке модели `export`

За исключением моделей, которые:
* Определены в пакете snowplow и материализованы инкрементально
* Называются `export_performance_timing`