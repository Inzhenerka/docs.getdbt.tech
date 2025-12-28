---
title: "Исключение моделей из выполнения"
sidebar_label: "Исключение"
---

### Исключение моделей
dbt предоставляет флаг `--exclude` с той же семантикой, что и `--select`. Модели, указанные с флагом `--exclude`, будут удалены из набора моделей, выбранных с помощью `--select`.

```bash
dbt run --select "my_package".*+ --exclude "my_package.a_big_model+"    # выбрать все модели в my_package и их дочерние, кроме a_big_model и его дочерних
```

Исключите конкретный ресурс по его имени или родословной:

```bash
# test
dbt test --exclude "not_null_orders_order_id"   # тестировать все модели, кроме теста not_null_orders_order_id
dbt test --exclude "orders"                     # тестировать все модели, кроме тестов, связанных с моделью orders

# seed
dbt seed --exclude "account_parent_mappings"    # загрузить все начальные данные, кроме account_parent_mappings

# snapshot
dbt snapshot --exclude "snap_order_statuses"    # выполнить все снимки, кроме snap_order_statuses
```
