---
title: "О функции doc"
sidebar_label: "doc"
id: "doc"
description: "Используйте `doc()` в полях описания для ссылки на блоки документации."
---
 
You can specify documentation text in a docs block, then use the `doc()` Jinja function in description fields as a way to reuse the same text in multiple places. You can only use the `doc()` Jinja function in properties YAML files for resources with description properties. For example, models, model columns, sources, source tables, source columns, and so on.
 
The `doc()` Jinja function, which is analogous to `ref()`, looks up the named docs block (for example, `{% docs orders %} ... {% enddocs %}` in a `docs.md` file) and returns its rendered content. For more information, refer to the [Documentation guide](/docs/explore/build-and-view-your-docs).
 
## Usage
 
In dbt, column descriptions can be defined directly in a model's properties YAML file. These descriptions are written as plain text and are associated with a specific column.
 
### Manually adding descriptions
 
<File name="models/orders.yml">
 
```yaml
models:
  - name: orders
    columns:
      - name: order_total_cents
        description: "Total order amount in cents. This value is always a positive integer and excludes taxes and shipping."
```
</File>
 
Когда вы запускаете `dbt docs generate` и открываете сайт документации, этот текст отображается в точности так, как он написан, но только для столбца `order_total_cents` модели `orders`.
 
### Повторное использование описаний с помощью doc()
 
Чтобы не повторять одно и то же описание для нескольких моделей или столбцов, dbt позволяет определять документацию отдельно и ссылаться на неё с помощью функции `doc()`.
 
При таком подходе документация пишется один раз в markdown-файле в именованном блоке docs, а затем используется повторно везде, где это необходимо в проекте. Это помогает обеспечить согласованность и упрощает поддержку общих определений с течением времени.
 
Сначала определите блок документации для повторного использования в файле `docs.md`:
 
<File name="models/docs/example.md">
 
```
{% docs order_total_cents %}
Общая сумма заказа в центах. Это значение всегда является положительным целым числом и не включает налоги и стоимость доставки.
{% enddocs %}
```
 
</File>
 
Так определяется блок docs с именем `order_total_cents`. Ссылайтесь на него с помощью `doc('order_total_cents')` в полях описания везде, где нужен тот же текст.
 
Затем добавьте ссылку на эту документацию в YAML-файл свойств:
 
<File name="models/orders.yml">
 
```yaml
models:
  - name: orders
    columns:
      - name: order_total_cents
        description: "{{ doc('order_total_cents') }}"
```
 
</File>
 
Когда вы запускаете `dbt docs generate`, dbt разрешает ссылку `doc()`, находя соответствующий блок docs и вставляя его содержимое в сгенерированную документацию.
 
В результате в описании столбца отображается текст, заданный в markdown-файле, а не непосредственно в YAML.
 
## Избегайте повторяющихся имён
 
Имена блоков docs должны быть уникальными в пределах проекта. Если вы определяете несколько блоков `{% docs %}` с одинаковым именем, dbt не может однозначно определить, какой блок использовать при вызове `doc('DOCS_BLOCK_NAME')`.
 
<VersionBlock firstVersion="1.11" lastVersion="1.99">
 
В <Constant name="dbt" /> v1.11 и более поздних версиях 1.x повторяющиеся имена блоков docs не допускаются. При обнаружении дубликатов dbt указывает конфликтующие файлы и выдаёт ошибку компиляции. Переименуйте один из блоков, чтобы имя каждого блока docs было уникальным.
 
<File name="models/docs/example.md">
 
```
{% docs order_total_cents %}
Общая сумма заказа в центах. Это значение всегда является положительным целым числом и не включает налоги и стоимость доставки.
{% enddocs %}
 
{% docs order_total_cents %}
Общая сумма заказа в центах без учёта налогов и платы за доставку.
{% enddocs %}
```
 
</File>
 
```shell
dbt parse
09:55:55  Running with dbt=1.11.8
09:55:55  Registered adapter: duckdb=1.10.1
09:55:56  Encountered an error:
Compilation Error
  dbt found two docs with the name "order_total_cents".
  
  Since these resources have the same name, dbt will be unable to find the correct resource
  when looking for doc("order_total_cents").
  
  To fix this, change the name of one of these resources:
  - doc.orders.order_total_cents (models/docs/example.md)
  - doc.orders.order_total_cents (models/docs/example.md)
```
 
</VersionBlock>
 
<VersionBlock firstVersion="2.0">
 
В <Constant name="fusion_engine" /> повторяющиеся имена блоков docs не допускаются. При обнаружении дубликатов dbt указывает конфликтующие файлы и выводит предупреждение. Переименуйте один из блоков, чтобы имя каждого блока docs было уникальным. Подробнее см. в разделе [Более строгая проверка повторяющихся блоков docs](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2?version=2.0#stricter-evaluation-of-duplicate-docs-blocks).
 
<File name="models/docs/example.md">
 
```
{% docs order_total_cents %}
Общая сумма заказа в центах. Это значение всегда является положительным целым числом и не включает налоги и стоимость доставки.
{% enddocs %}
 
{% docs order_total_cents %}
Общая сумма заказа в центах без учёта налогов и платы за доставку.
{% enddocs %}
```
 
</File>
 
```text
dbt found two docs with the same name: 'order_total_cents' in files: 'models/docs/example.md' and 'models/docs/example.md'
```
 
</VersionBlock>
