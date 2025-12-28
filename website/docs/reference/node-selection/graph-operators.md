---
title: "Графовые операторы"
---

### Оператор «плюс»
Оператор `+` расширяет выборку, включая предков (upstream-зависимости) или потомков (downstream-зависимости) ресурса. Этот оператор работает для отдельных моделей, тегов и других ресурсов.

- Размещён после модели/ресурса &mdash; включает сам ресурс и всех его потомков (downstream-зависимости).
- Размещён перед моделью/ресурсом &mdash; включает сам ресурс и всех его предков (upstream-зависимости).
- Размещён по обе стороны от модели/ресурса &mdash; включает сам ресурс, всех его предков и всех его потомков.

```bash
dbt run --select "my_model+"         # select my_model and all descendants
dbt run --select "+my_model"         # select my_model and all ancestors
dbt run --select "+my_model+"        # select my_model, and all of its ancestors and descendants
```

Вы можете использовать его вместе с селекторами, чтобы задать более узкую область в командах. Также его можно комбинировать с флагом [`--exclude`](/reference/node-selection/exclude) для ещё более тонкого контроля над тем, что будет включено в команду.

### Оператор «n-плюс»

Вы можете настроить поведение оператора `+`, указав количество рёбер графа,
через которые нужно пройти.

```bash
dbt run --select "my_model+1"        # select my_model and its first-degree descendants
dbt run --select "2+my_model"        # select my_model, its first-degree ancestors ("parents"), and its second-degree ancestors ("grandparents")
dbt run --select "3+my_model+4"      # select my_model, its ancestors up to the 3rd degree, and its descendants down to the 4th degree
```

### Оператор «at»
Оператор `@` похож на `+`, но дополнительно включает _всех предков всех потомков выбранной модели_. Это полезно в средах непрерывной интеграции, где требуется собрать модель и всех её потомков, но _предки_ этих потомков могут ещё не существовать в схеме. Оператор `@` (который может быть размещён только перед именем модели) выбирает столько уровней предков («родителей», «бабушек и дедушек» и так далее), сколько необходимо для успешной сборки всех потомков указанной модели.

Селектор `@snowplow_web_page_context` соберёт все три модели, показанные на диаграмме ниже.

<Lightbox src="/img/docs/running-a-dbt-project/command-line-interface/1643e30-Screen_Shot_2019-03-11_at_7.18.20_PM.png" title="@snowplow_web_page_context выберет все модели, показанные здесь"/>

```bash
dbt run --select "@my_model"         # select my_model, its descendants, and the ancestors of its descendants
```
