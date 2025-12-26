---
resource_types: [models]
datatype: list
required: no
keyword: governance, model version, model versioning, dbt model versioning
---

import VersionsCallout from '/snippets/_model-version-callout.md';

<VersionsCallout />

<File name='models/<schema>.yml'>

```yml

models:
  - name: model_name
    versions:
      - v: <version_identifier> # обязательно
        defined_in: <file_name> # необязательно -- по умолчанию <model_name>_v<v>
        columns:
          # укажите все столбцы либо включите/исключите столбцы из YAML‑определения модели верхнего уровня
          - [include](/reference/resource-properties/versions#include): <include_value>
            [exclude](/reference/resource-properties/versions#include): <exclude_list>
          # укажите дополнительные столбцы
          - name: <column_name> # обязательно
      - v: ...
    
    # необязательно
    [latest_version](/reference/resource-properties/latest_version): <version_identifier> 
```

</File>

Стандартное соглашение для именования версий моделей — `<model_name>_v<v>`. Это касается файла, в котором dbt ожидает найти определение модели (SQL или Python), и псевдонима, который будет использоваться по умолчанию при материализации модели в базе данных.

### `v`

Идентификатор версии для версии модели. Это значение может быть числовым (целым или с плавающей точкой) или любой строкой.

Значение идентификатора версии используется для упорядочивания версий модели относительно друг друга. Если версия модели _не_ явно настраивает [`latest_version`](/reference/resource-properties/latest_version), то в качестве последней версии используется наибольший номер версии для разрешения вызовов `ref` к модели без аргумента `version`.

В целом мы рекомендуем использовать простую схему «мажорного версионирования» для моделей: `1`, `2`, `3` и так далее, где каждая версия отражает несовместимое (breaking) изменение по сравнению с предыдущими версиями. При этом вы можете использовать и другие схемы версионирования. Если значения идентификаторов версий не являются полностью числовыми, dbt будет сортировать их в алфавитном порядке. **Не следует** включать букву `v` в идентификатор версии — dbt добавит её автоматически.

Чтобы запустить модель с несколькими версиями, можно использовать [флаг `--select`](/reference/node-selection/syntax). Подробнее о возможностях и синтаксисе см. в разделе [Model versions](/docs/mesh/govern/model-versions#run-a-model-with-multiple-versions).

Чтобы запустить модель с несколькими версиями, вы можете использовать [`--select` флаг](/reference/node-selection/syntax). Обратитесь к [Версии моделей](/docs/collaborate/govern/model-versions#run-a-model-with-multiple-versions) для получения дополнительной информации и синтаксиса.

### `defined_in`

Имя файла модели (исключая расширение файла, например, `.sql` или `.py`), в котором определена версия модели.

Если `defined_in` не указано, dbt ищет определение версии модели в файле модели с именем `<model_name>_v<v>`. **Последняя** версия модели также может быть определена в файле с именем `<model_name>`, без суффикса версии. Имена файлов моделей должны быть уникальными в глобальном масштабе, даже при определении версионных реализаций модели с другим именем.

### `alias`

Псевдоним по умолчанию для версии модели — `<model_name>_v<v>`. Логика для этого закодирована в макросе `generate_alias_name`.

Этот параметр по умолчанию можно изменить двумя способами:
- Настройка пользовательского `alias` в yaml версии или в определении версии модели
- Переопределение макроса `generate_alias_name` dbt, чтобы использовать другое поведение на основе `node.version`

См. раздел ["Custom aliases"](/docs/build/custom-aliases) для получения более подробной информации.

Обратите внимание, что значение `defined_in` и конфигурация `alias` модели не координируются, кроме как по соглашению. Они объявляются и определяются независимо.

### `include`

Спецификация того, какие колонки, определённые в верхнеуровневом свойстве `columns` модели, нужно включить или исключить в версионированной реализации этой модели.

- `include` может быть:
  - списком конкретных имён колонок, которые нужно включить
  - `'*'` или `'all'`, что означает включение **всех** колонок из верхнеуровневого свойства `columns` в версионированную модель
- `exclude` — это список имён колонок, которые нужно исключить. Он может быть объявлен только если `include` задан как `'*'` или `'all'`.

:::tip
Не путайте с синтаксисом `--select/--exclude` [syntax](/reference/node-selection/exclude), который используется для выбора моделей.
:::

Список `columns` у версионированной модели может содержать _не более одного_ элемента `include/exclude`. Однако, если ни одна из версий вашей модели не задаёт колонки, вам вообще не нужно определять `columns`, и вы можете опустить ключи `columns/include`/`exclude` в описании версионированной модели. В этом случае dbt автоматически использует все верхнеуровневые колонки для всех версий.

Вы также можете объявлять дополнительные колонки внутри списка `columns` конкретной версии. Если `name` колонки, определённой на уровне версии, совпадает с колонкой, включённой с верхнего уровня, то версия переопределит эту колонку для данной версии модели.

<File name='models/<schema>.yml'>

```yml
models:
  
  # top-level model properties
  - name: <model_name>
    [columns](/reference/resource-properties/columns):
      - name: <column_name> # required
    
    # versions of this model
    [versions](/reference/resource-properties/versions):
      - v: <version_identifier> # required
        columns:
          - include: '*' | 'all' | [<column_name>, ...]
            exclude:
              - <column_name>
              - ... # declare additional column names to exclude
          
          # declare more columns -- can be overrides from top-level, or in addition
          - name: <column_name>
            ...
```

</File>

По умолчанию `include` имеет значение `"all"`, а `exclude` — пустой список. Это приводит к тому, что в версионированную модель включаются все колонки из базовой модели.

#### Пример

<File name='models/customers.yml'>

```yml
models:
  - name: customers
    columns:
      - name: customer_id
        description: Unique identifier for this table
        data_type: text
        constraints:
          - type: not_null
        data_tests:
          - unique
      - name: customer_country
        data_type: text
        description: "Country where the customer currently lives"
      - name: first_purchase_date
        data_type: date
    
    versions:
      - v: 4
      
      - v: 3
        columns:
          - include: "*"
          - name: customer_country
            data_type: text
            description: "Country where the customer first lived at time of first purchase"
      
      - v: 2
        columns:
          - include: "*"
            exclude:
              - customer_country
      
      - v: 1
        columns:
          - include: []
          - name: id
            data_type: int
```

</File>

Так как версия `v4` не задала никаких `columns`, она будет включать все колонки, определённые на верхнем уровне.

Каждая из остальных версий объявляет изменения относительно верхнеуровневого описания:
- `v3` включает все колонки, но переопределяет колонку `customer_country`, задавая для неё другое `description`.
- `v2` включает все колонки, *кроме* `customer_country`.
- `v1` не включает *ни одной* верхнеуровневой колонки. Вместо этого она объявляет только одну целочисленную колонку с именем `id`.

---

### Наши рекомендации
- Придерживайтесь единого соглашения об именовании версий моделей и их алиасов.
- Используйте `defined_in` и `alias` только при наличии веской причины.
- Создайте представление (view), которое всегда указывает на последнюю версию вашей модели. Вы можете автоматизировать это для всех версионированных моделей в проекте с помощью хука `on-run-end`. Подробнее см. в полной документации по ["Model versions"](/docs/mesh/govern/model-versions#configuring-database-location-with-alias).

### Обнаружение значительных изменений

Когда вы используете метод выбора `state:modified` в Slim CI, dbt обнаружит изменения в контрактах версионных моделей и выдаст ошибку, если какие-либо из этих изменений могут быть значительными для потребителей ниже по потоку.

import BreakingChanges from '/snippets/_versions-contracts.md';

<BreakingChanges 
value="Изменение неконтрактных моделей без версий."
value2="dbt также предупреждает, если у модели есть или был контракт, но она не имеет версии."
/>

<Tabs>

<TabItem value="unversioned" label="Пример сообщения для моделей без версий">

```
  Значительное изменение в неконтрактной модели для contracted_model (models/contracted_models/contracted_model.sql)
  При сравнении с предыдущим состоянием проекта dbt обнаружил значительное изменение в неконтрактной модели.
    - Принудительное соблюдение контракта было удалено: Ранее конфигурация этой модели включала contract: {enforced: true}. Теперь она больше не настроена на соблюдение своего контракта, и это значительное изменение.
    - Столбцы были удалены:
      - color
      - date_day
    - Принудительные ограничения на уровне столбцов были удалены:
      - id (ConstraintType.not_null)
      - id (ConstraintType.primary_key)
    - Принудительные ограничения на уровне модели были удалены:
      - ConstraintType.check -> ['id']
    - Материализация изменилась с принудительными ограничениями:
      - table -> view
```
</TabItem>

<TabItem value="versioned" label="Пример сообщения для версионных моделей">

```
Значительное изменение в контракте Ошибка в модели sometable (models/sometable.sql)
  При сравнении с предыдущим состоянием проекта dbt обнаружил значительное изменение в принудительном контракте.

  Принудительное соблюдение контракта было отключено.

  Столбцы были удалены:
   - order_name

  Столбцы с изменениями типа данных:
   - order_id (number -> int)

По возможности рассмотрите внесение аддитивного (не нарушающего обратную совместимость) изменения.  
В противном случае создайте новую версию модели: https://docs.getdbt.com/docs/mesh/govern/model-versions
```

</TabItem>

</Tabs>

Добавочные изменения **не** считаются значительными:
- Добавление нового столбца в контрактную модель
- Добавление новых `constraints` к существующему столбцу в контрактной модели