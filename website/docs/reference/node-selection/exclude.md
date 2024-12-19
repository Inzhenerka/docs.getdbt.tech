---
title: "Исключение моделей из выполнения"
sidebar_label: "Исключить"
---

### Исключение моделей
dbt предоставляет флаг `--exclude`, который имеет те же семантики, что и `--select`. Модели, указанные с флагом `--exclude`, будут исключены из набора моделей, выбранных с помощью `--select`.

```bash
dbt run --select "my_package".*+ --exclude "my_package.a_big_model+"    # выбрать все модели в my_package и их дочерние модели, кроме a_big_model и его дочерних моделей
```

Исключите конкретный ресурс по его имени или иерархии:

```bash
# тест
dbt test --exclude "not_null_orders_order_id"   # протестировать все модели, кроме теста not_null_orders_order_id
dbt test --exclude "orders"                     # протестировать все модели, кроме тестов, связанных с моделью orders

# загрузка
dbt seed --exclude "account_parent_mappings"    # загрузить все семена, кроме account_parent_mappings

# снимок
dbt snapshot --exclude "snap_order_statuses"    # выполнить все снимки, кроме snap_order_statuses
```