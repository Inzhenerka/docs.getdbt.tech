---
title: "Обновление до движка dbt Fusion (v2.0)"
id: upgrading-to-fusion
description: Новые возможности и изменения в Fusion
displayed_sidebar: "docs"
---

import FusionAdapters from '/snippets/_fusion-dwh.md';
import FusionUpgradeSteps from '/snippets/_fusion-upgrade-steps.md';
import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md'

<FusionLifecycle />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />

## Что нужно знать перед обновлением

<Constant name="core" /> и dbt Fusion используют единый языковой спецификатор — код вашего проекта. dbt Labs стремится обеспечить функциональное соответствие (<i>feature parity</i>) с <Constant name="core" /> везде, где это возможно.

В то же время мы используем этот переход как возможность _усилить фреймворк_: удалить устаревшую функциональность, упорядочить запутанное поведение и добавить более строгую валидацию некорректных входных данных. Это означает, что для подготовки существующего dbt‑проекта к работе с Fusion потребуется выполнить некоторые действия.

Эти шаги описаны ниже — как правило, они простые, понятные и во многих случаях могут быть автоматически исправлены с помощью вспомогательного инструмента [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix).

Подробнее о том, какие изменения вносит движок dbt Fusion, можно узнать в [changelog](https://github.com/dbt-labs/dbt-fusion/blob/main/CHANGELOG.md).

<FusionUpgradeSteps />

### Поддерживаемые адаптеры

В движке dbt Fusion поддерживаются следующие адаптеры:

<FusionAdapters />

### Чистый лист

dbt Labs делает ставку на дальнейшее развитие Fusion, и поэтому он не поддерживает никакую устаревшую функциональность:

- Все [предупреждения об устаревании](/reference/deprecations) должны быть устранены до обновления на новый движок. Это включает как исторические устаревания, так и [новые, добавленные в dbt Core v1.10](/docs/dbt-versions/core-upgrade/upgrading-to-v1.10#deprecation-warnings).
- Все [флаги изменения поведения](/reference/global-configs/behavior-changes#behaviors) будут удалены (как правило, включены по умолчанию). Вы больше не сможете отключать их с помощью `flags:` в `dbt_project.yml`.

### Пакеты экосистемы

Самые популярные пакеты от `dbt-labs` (`dbt_utils`, `audit_helper`, `dbt_external_tables`, `dbt_project_evaluator`) уже совместимы с Fusion. Внешние пакеты, опубликованные организациями вне dbt, могут использовать устаревший код или несовместимые возможности, из-за чего они не будут корректно парситься новым движком Fusion. Мы работаем с мейнтейнерами таких пакетов, чтобы обеспечить их доступность для Fusion. Пакеты, которым требуется обновление до новой версии для совместимости с Fusion, будут задокументированы в этом руководстве по обновлению.

### Изменения в функциональности

При разработке движка Fusion появились возможности улучшить фреймворк dbt: раньше обнаруживать ошибки (когда это возможно), исправить баги, оптимизировать порядок выполнения и убрать флаги, которые больше не актуальны. В результате появилось несколько конкретных и достаточно тонких изменений в существующем поведении.

При обновлении до Fusion следует ожидать следующих изменений.

#### Вывод relations на этапе parse теперь печатает полное квалифицированное имя, а не пустую строку

В dbt Core v1 при выводе результата `get_relation()` вывод Jinja на этапе parse печатал `None` (неопределённый объект приводился к строке `"None"`).

В Fusion, чтобы обеспечить интеллектуальное батчирование вызовов `get_relation()` (и существенно ускорить `dbt compile`), dbt необходимо создавать объект relation с полностью разрешённым квалифицированным именем уже на этапе parse для вызова адаптера `get_relation()`.

Создание relation с полностью квалифицированным именем в Fusion приводит к отличающемуся поведению по сравнению с dbt Core v1 при использовании `print()`, `log()` или любых Jinja‑макросов, выводящих данные в `stdout` или `stderr` на этапе parse.

Пример:

```jinja
{% set relation = adapter.get_relation(
database=db_name,
schema=db_schema,
identifier='a')
%}
{{ print('relation: ' ~ relation) }}

{% set relation_via_api = api.Relation.create(
database=db_name,
schema=db_schema,
identifier='a'
) %}
{{ print('relation_via_api: ' ~ relation_via_api) }}
```

Вывод после `dbt parse` в dbt Core v1:

```
relation: None
relation_via_api: my_db.my_schema.my_table
```

Вывод после `dbt parse` в Fusion:

```
relation: my_db.my_schema.my_table
relation_via_api: my_db.my_schema.my_table
```

#### Устаревшие флаги

Некоторые исторические флаги dbt Core v1 больше не выполняют никаких действий в Fusion. Если вы передадите их в команду dbt при использовании Fusion, команда не завершится ошибкой, но сам флаг будет проигнорирован (с соответствующим предупреждением).

Есть одно исключение: флаг `--models` / `--model` / `-m` был переименован в `--select` / `--s` ещё в dbt Core v0.21 (октябрь 2021). Тихое игнорирование этого флага означало бы игнорирование критериев выбора в команде, что могло бы привести к сборке всего DAG вместо небольшой подмножины. Поэтому флаг `--models` / `--model` / `-m` **будет приводить к ошибке** в Fusion. Пожалуйста, обновите определения ваших задач соответствующим образом.

| имя флага | действия |
| ----------| -------- |
| `dbt seed` [`--show`](/reference/commands/seed) | N/A |
| [`--print` / `--no-print`](/reference/global-configs/print-output) | Действия не требуются |
| [`--printer-width`](/reference/global-configs/print-output#printer-width) | Действия не требуются |
| [`--source`](/reference/commands/deps#non-hub-packages) | Действия не требуются |
| [`--record-timing-info` / `-r`](/reference/global-configs/record-timing-info) | Действия не требуются |
| [`--cache-selected-only` / `--no-cache-selected-only`](/reference/global-configs/cache) | Действия не требуются |
| [`--clean-project-files-only` / `--no-clean-project-files-only`](/reference/commands/clean#--clean-project-files-only) | Действия не требуются |
| `--single-threaded` / `--no-single-threaded` | Действия не требуются |
| `dbt source freshness` [`--output` / `-o`](/docs/deploy/source-freshness) | |
| [`--config-dir`](/reference/commands/debug) | Действия не требуются |
| [`--resource-type` / `--exclude-resource-type`](/reference/global-configs/resource-type) | заменить на `--resource-types` / `--exclude-resource-types` |
| `--show-resource-report` / `--no-show-resource-report` | Действия не требуются |
| [`--log-cache-events` / `--no-log-cache-events`](/reference/global-configs/logs#logging-relational-cache-events) | Действия не требуются |
| `--use-experimental-parser` / `--no-use-experimental-parser` | Действия не требуются |
| [`--empty-catalog`](/reference/commands/cmd-docs#dbt-docs-generate ) | |
| [`--compile` / `--no-compile`](/reference/commands/cmd-docs#dbt-docs-generate) | |
| `--inline-direct` | Действия не требуются |
| `--partial-parse-file-diff` / `--no-partial-parse-file-diff` | Действия не требуются |
| `--partial-parse-file-path` | Действия не требуются |
| `--populate-cache` / `--no-populate-cache` | Действия не требуются |
| `--static-parser` / `--no-static-parser` | Действия не требуются |
| `--use-fast-test-edges` / `--no-use-fast-test-edges` | Действия не требуются |
| [`--introspect` / `--no-introspect`](/reference/commands/compile#introspective-queries) | Действия не требуются |
| `--inject-ephemeral-ctes` / `--no-inject-ephemeral-ctes` | |
| [`--partial-parse` / `--no-partial-parse`](/reference/parsing#partial-parsing) | Действия не требуются |

#### Конфликтующие версии пакетов теперь приводят к ошибке

Если локальный пакет зависит от пакета из хаба, который также требуется корневому пакету, `dbt deps` в dbt Core v1 не разрешает конфликт версий и устанавливает версию, указанную корневым проектом.

В Fusion будет выведена ошибка:

```bash
error: dbt8999: Cannot combine non-exact versions: =0.8.3 and =1.1.1
```

#### Parse завершается ошибкой при вызове несуществующих макросов и методов адаптера

Если вы вызываете несуществующий макрос:

```sql
select
  id as payment_id,
  # my_nonexistent_macro is a macro that DOES NOT EXIST
  {{ my_nonexistent_macro('amount') }} as amount_usd,
from app_data.payments
```

или несуществующий метод адаптера:

```sql
{{ adapter.does_not_exist() }}
```

В dbt Core v1 `dbt parse` проходит успешно, а `dbt compile` завершается ошибкой.

В Fusion ошибка будет выброшена уже на этапе `parse`.

#### Parse завершается ошибкой при отсутствии generic test

Если в проекте определён несуществующий generic test:

```yaml
models:
  - name: dim_wizards
    data_tests:
      - does_not_exist
```

В dbt Core v1 `dbt parse` проходит успешно, а `dbt compile` завершается ошибкой.

В Fusion ошибка возникает уже во время `parse`.

#### Parse завершается ошибкой при отсутствии переменной

Если в проекте используется неопределённая переменная:

```sql
select {{ var('does_not_exist') }} as my_column
```

В dbt Core v1 `dbt parse` проходит успешно, а `dbt compile` завершается ошибкой.

В Fusion ошибка возникает уже во время `parse`.

#### Более строгая проверка дублирующихся docs blocks

В старых версиях <Constant name="core" /> можно было создать ситуацию с дублирующимися [docs blocks](/docs/build/documentation#using-docs-blocks). Например, два пакета могли содержать идентичные docs blocks, на которые ссылались по неквалифицированному имени. В таком случае <Constant name="core" /> использовал любой из них без предупреждений и ошибок.

<Constant name="fusion" /> вводит более строгую проверку имён docs blocks, чтобы избежать подобной неоднозначности. При обнаружении дубликатов будет выдана ошибка:

```bash
dbt found two docs with the same name: 'docs_block_title in files: 'models/crm/_crm.md' and 'docs/crm/business_class_marketing.md'
```

Чтобы устранить ошибку, переименуйте дублирующиеся docs blocks.

#### Прекращение поддержки устаревших версий manifest

Fusion больше не может работать с версиями dbt-core ниже 1.8, если вы:
- гибридный клиент, использующий Fusion и старую (до v1.8) версию dbt Core;
- клиент, обновляющийся со старой (до v1.8) версии dbt Core на Fusion.

Fusion не может работать со старым manifest, который используется, например, для deferral при сравнении `state:modified`.

#### `dbt clean` больше не удаляет файлы в resource paths и за пределами директории проекта

В dbt Core v1 команда `dbt clean` удаляет:
- файлы за пределами директории проекта, если `clean-targets` настроен с абсолютным путём или относительным путём, содержащим `../` (существует opt-in настройка для отключения этого поведения — `--clean-project-files-only` / `--no-clean-project-files-only`);
- файлы в `asset-paths` или `doc-paths` (в отличие от других resource paths, таких как `model-paths` и `seed-paths`).

В Fusion `dbt clean` не будет удалять файлы ни в настроенных resource paths, ни за пределами директории проекта.

#### Все unit tests выполняются первыми в `dbt build`

В dbt Core v1 прямые родители модели, для которой запускаются unit tests, должны были существовать в хранилище данных, чтобы получить информацию об именах и типах колонок. `dbt build` выполнял unit tests (и их зависимые модели) _в порядке lineage_.

В Fusion `dbt build` сначала выполняет _все_ unit tests, а затем строит остальной DAG, благодаря встроенному знанию имён и типов колонок.

#### Настройка `--threads`

По умолчанию dbt Core запускается с `--threads 1`. Вы можете увеличить это значение, чтобы выполнять больше узлов параллельно на удалённой платформе данных — вплоть до максимального параллелизма, разрешённого DAG.

В Fusion, если `--threads` не задан или задан как `--threads 0`, dbt использует значение по умолчанию для максимального числа потоков, определённое для конкретного адаптера. Некоторые платформы данных способны обрабатывать больше параллельных соединений, чем другие. Если пользователь явно задал `--threads` (через CLI или `profiles.yml`), Fusion будет использовать это значение.

#### Продолжение компиляции несвязанных узлов после ошибки

В dbt Core, как только `compile` сталкивается с ошибкой при компиляции одной из моделей, процесс останавливается и больше ничего не компилируется.

В Fusion, если `compile` сталкивается с ошибкой, узлы ниже по графу от упавшего будут пропущены, но компиляция остальной части DAG продолжится (параллельно, в пределах настроенного или оптимального числа потоков).

#### Seeds с лишними запятыми больше не создают дополнительные колонки

В dbt Core v1, если в seed-файле присутствует лишняя запятая, dbt создаёт дополнительную пустую колонку.

Например, следующий seed-файл (с лишней запятой):

```
animal,  
dog,  
cat,  
bear,  
```

Приведёт к созданию таблицы:

| animal | b |  
| ------ | - |  
| dog    |   |  
| cat    |   |  
| bear   |   |  

Fusion не будет создавать эту дополнительную колонку при выполнении `dbt seed`:

| animal |  
| ------ |  
| dog    |  
| cat    |  
| bear   |  

#### Перенос standalone anchors под ключ `anchors:`

В рамках процесса уточнения языка описания dbt любые неожиданные ключи верхнего уровня в YAML-файлах теперь приводят к ошибкам. Частый источник таких ключей — standalone anchors, определённые на верхнем уровне YAML-файла. Для этого случая добавлен новый верхнеуровневый ключ `anchors:`, который служит контейнером для переиспользуемых конфигурационных блоков.

Вместо такой конфигурации:

<File name='models/_models.yml'>

```yml
# id_column is not a valid name for a top-level key in the dbt authoring spec, and will raise an error
id_column: &id_column_alias
  name: id
  description: This is a unique identifier.
  data_type: int
  data_tests:
    - not_null
    - unique

models:
  - name: my_first_model
    columns: 
      - *id_column_alias
      - name: unrelated_column_a
        description: This column is not repeated in other models.
  - name: my_second_model
    columns: 
      - *id_column_alias
```

</File>

Переместите anchor под ключ `anchors:`:

<File name='models/_models.yml'>

```yml
anchors: 
  - &id_column_alias
      name: id
      description: This is a unique identifier.
      data_type: int
      data_tests:
        - not_null
        - unique

models:
  - name: my_first_model
    columns: 
      - *id_column_alias
      - name: unrelated_column_a
        description: This column is not repeated in other models
  - name: my_second_model
    columns: 
      - *id_column_alias
```

</File>

Этот перенос требуется только для фрагментов, определённых вне основной структуры YAML. Подробнее о новом ключе см. в разделе [anchors](/reference/resource-properties/anchors).

#### Алгебраические операции в Jinja-макросах

В <Constant name="core" /> можно использовать алгебраические операции в возвращаемом значении Jinja-макроса:

```jinja
{% macro my_macro() %}

return('xyz') + 'abc'

{% endmacro %}
```

В <Constant name="fusion" /> это больше не поддерживается и приведёт к ошибке:

```bash
error: dbt1501: Failed to add template invalid operation: return() is called in a non-block context
```

Это редкий сценарий использования, и для такого поведения в <Constant name="core" /> не было предупреждения об устаревании. Поддерживаемый вариант выглядит так:

```jinja
{% macro my_macro() %}

return('xyzabc')

{% endmacro %}
```

### Доступ к пользовательским конфигурациям в meta

Методы `config.get()` и `config.require()` не возвращают значения из словаря `meta`. Если вы пытаетесь получить ключ, который существует только в `meta`, dbt выдаёт предупреждение:

```bash
warning: The key 'my_key' was not found using config.get('my_key'), but was 
detected as a custom config under 'meta'. Please use config.meta_get('my_key') 
or config.meta_require('my_key') instead.
```

Поведение, когда ключ существует только в `meta`:

| Метод | Поведение |
|------|-----------|
| `config.get('my_key')` | Возвращает значение по умолчанию и выдаёт предупреждение |
| `config.require('my_key')` | Генерирует ошибку и выдаёт предупреждение |

Чтобы получить доступ к пользовательским конфигурациям, сохранённым в `meta`, используйте специальные методы:

```jinja
{% set owner = config.meta_get('owner') %}
{% set has_pii = config.meta_require('pii') %}
```

Подробнее см. [config.meta_get()](/reference/dbt-jinja-functions/config#configmeta_get) и [config.meta_require()](/reference/dbt-jinja-functions/config#configmeta_require).

### Поддержка пакетов

import FusionPackages from '/snippets/_fusion-supported-packages.md';

<FusionPackages />
