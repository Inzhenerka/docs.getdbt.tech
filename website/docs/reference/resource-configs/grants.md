---
resource_types: [models,seeds,snapshots]
datatype: "{<dictionary>}"
default_value: {}
id: "grants"
---

Вы можете управлять доступом к наборам данных, которые вы создаёте с помощью dbt, используя grants. Для реализации этих прав доступа определите grants как конфигурации ресурса для каждой модели, seed или snapshot. Задайте grants по умолчанию, которые применяются ко всему проекту, в файле `dbt_project.yml`, а grants для конкретных моделей — в SQL- или YAML-файлах свойств каждой модели.

Конфигурации ресурса `grants` позволяют применять права доступа во время сборки к определённому набору получателей и к модели, seed или snapshot. Когда модель, seed или snapshot завершает сборку, dbt гарантирует, что grants для соответствующего представления (view) или таблицы в точности соответствуют тем grants, которые вы настроили.

dbt стремится использовать наиболее эффективный подход при обновлении grants. Он зависит от используемого адаптера, а также от того, заменяет ли dbt существующий объект или обновляет уже существующий. Вы всегда можете проверить debug-логи, чтобы увидеть полный набор команд `grant` и `revoke`, которые выполняет dbt.

Рекомендуется по возможности определять grants как конфигурации ресурсов, однако в некоторых случаях может потребоваться писать SQL-выражения grants вручную и запускать их с помощью [hooks](/docs/build/hooks-operations). Например, hooks могут быть уместны, если вы хотите:

* Применять grants к другим объектам базы данных, помимо представлений и таблиц.
* Создавать более детализированный доступ на уровне строк и столбцов, использовать masking policies или применять future grants.
* Использовать более продвинутые возможности управления доступом, предоставляемые вашей платформой данных, для которых dbt не предлагает готовой поддержки через конфигурации ресурсов.
* Применять grants более сложным или кастомным образом, выходящим за рамки встроенных возможностей grants.

Подробнее о hooks см. в разделе [Hooks & operations](/docs/build/hooks-operations).

## Определение {#definition}

Вы можете использовать поле `grants` для задания разрешений или прав доступа для ресурса. Когда вы выполняете `run` для модели, `seed` для данных или `snapshot` для набора данных, dbt выполняет команды `grant` и/или `revoke`, чтобы гарантировать, что разрешения на объекте базы данных соответствуют `grants`, которые вы настроили для ресурса.

Как и все конфигурации, `grants` включаются в метаданные проекта dbt, в том числе в [артефакт manifest](/reference/artifacts/manifest-json).

### Общий синтаксис {#common-syntax}

Grants состоят из двух ключевых компонентов:

* **Privilege:** Право на выполнение конкретного действия или набора действий над объектом в базе данных, например чтение данных из таблицы.
* **Grantees:** Один или несколько получателей предоставляемых прав. Некоторые платформы также называют их «principals». Например, получателем может быть пользователь, группа пользователей, роль (Snowflake), назначенная одному или нескольким пользователям, или сервисный аккаунт (BigQuery/GCP).

## Настройка разрешений {#configuring-grants}

Вы можете настраивать `grants` в `dbt_project.yml`, чтобы применять их сразу ко многим ресурсам — всем моделям проекта, пакету или подпапке. Также вы можете настраивать `grants` по отдельности для конкретных ресурсов — в YAML-блоках `config:` или прямо в `.sql`-файлах.

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
  ]
}>

<TabItem value="models">

<File name='models/schema.yml'>

```yml
models:
  - name: specific_model
    config:
      grants:
        select: ['reporter', 'bi']
```

</File>

Конфигурация `grants` также может быть определена:

- в разделе `models` в файле проекта (`dbt_project.yml`)
- в Jinja-макросе `config()` внутри SQL-файла модели

Подробнее см. [конфигурация и свойства](/reference/configs-and-properties).

</TabItem>

<TabItem value="seeds">

<File name='seeds/schema.yml'>

```yml
seeds:
  - name: seed_name
    config:
      grants:
        select: ['reporter', 'bi']
```

</File>

Конфигурация `grants` также может быть определена в разделе `seeds` в файле проекта (`dbt_project.yml`). Подробнее см. [configs and properties](/reference/configs-and-properties).

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/schema.yml'>

```yml
snapshots:
  - name: snapshot_name
    config:  
      grants:
        select: ['reporter', 'bi']
```

</File>

Конфигурация `grants` может быть определена:

- в разделе `snapshots` в файле свойств (`snapshots/schema.yml`)
- в разделе `snapshots` в файле проекта (`dbt_project.yml`)
- в Jinja-макросе `config()` в SQL-файле snapshot

Подробнее см. [конфигурация и свойства](/reference/configs-and-properties).

</TabItem>
</Tabs>

### Наследование конфигурации grants {#grant-config-inheritance}

Если вы задаёте `grants` для одной и той же модели в нескольких местах, например в `dbt_project.yml` и в более конкретном `.sql`- или `.yml`-файле, поведение dbt по умолчанию заключается в замене менее специфичного набора получателей на более специфичный. Такое поведение «merge and clobber» обновляет каждое разрешение при разборе проекта dbt.

Например:

<File name='dbt_project.yml'>

```yml
models:
  +grants:  # В этом случае символ + не является опциональным — его необходимо указать, чтобы проект корректно распарсился.
    select: ['user_a', 'user_b']
```

</File>

<File name='models/specific_model.sql'>

```sql
{{ config(grants = {'select': ['user_c']}) }}
```

</File>

В результате такой конфигурации для `specific_model` будет настроено предоставление привилегии `select` **только** пользователю `user_c`. После выполнения `specific_model` это будет единственное предоставленное право, которое вы увидите в базе данных, и единственная команда `grant`, которую вы найдёте в логах dbt.

Предположим, что мы хотим _добавить_ `user_c` к существующему списку получателей привилегии `select` для `specific_model`, а не _полностью заменить_ этот список. Для этого можно использовать символ `+` («addition»), добавив его в качестве префикса к имени привилегии:

<File name='models/specific_model.sql'>

```sql
{{ config(grants = {'+select': ['user_c']}) }}
```

</File>

Теперь модель предоставит привилегию `select` пользователям `user_a`, `user_b` **и** `user_c`!

**Примечания:**
- Это будет работать только для тех привилегий, в имени которых используется префикс `+`. Каждая привилегия управляет таким поведением отдельно. Если бы вы предоставляли другие привилегии без префикса `+`, для них по-прежнему применялось бы поведение замены (clobber), а не добавления.
- Использование `+` для управления поведением объединения (замена vs добавление) отличается от использования `+` в `dbt_project.yml` (как показано в примере выше) для определения конфигураций со значениями-словарями. Подробнее см. [the plus prefix](/reference/resource-configs/plus-prefix).
- `grants` — это первая конфигурация, которая поддерживает префикс `+` для управления поведением объединения конфигураций. На данный момент это единственная такая конфигурация. Если этот подход окажется полезным, в будущем мы можем расширить его на новые и существующие конфигурации.

### Условные разрешения {#conditional-grants}

Как и для любой другой конфигурации, вы можете использовать Jinja, чтобы изменять grants в зависимости от контекста. Например, вы можете предоставлять разные права в prod и dev:

<File name='dbt_project.yml'>

```yml
models:
  +grants:
    select: "{{ ['user_a', 'user_b'] if target.name == 'prod' else ['user_c'] }}"
```

</File>

## Отзыв разрешений {#revoking-grants}

dbt изменяет grants на узле (включая отзыв прав) только в том случае, если конфигурация `grants` привязана к этому узлу. Например, представим, что изначально в `dbt_project.yml` были указаны следующие grants:

<File name='dbt_project.yml'>

```yml
models:
  +grants:
    select: ['user_a', 'user_b']
```

</File>

Если вы удалите весь раздел `+grants`, dbt предполагает, что вы больше не хотите, чтобы он управлял grants, и не будет ничего менять. Чтобы dbt отозвал все существующие grants у узла, необходимо указать пустой список получателей.

    <Tabs
    defaultValue="revoke-one"
    values={[
        { label: 'Revoke from one user', value: 'revoke-one', },
        { label: 'Revoke from all users', value:'revoke-all', },
        { label: 'Stop dbt from managing grants', value:'stop-managing', },
    ]
    }>

    <TabItem value="revoke-one">
    <File name='dbt_project.yml'>

    ```yml
    models:
      +grants:
        select: ['user_b']
    ```

    </File>
    </TabItem>

    <TabItem value="revoke-all">
    <File name='dbt_project.yml'>

    ```yml
    models:
      +grants:
        select: []
    ```

    </File>
    </TabItem>

    <TabItem value="stop-managing">
    <File name='dbt_project.yml'>

    ```yml
    models:

      # этот раздел намеренно оставлен пустым
    ```

    </File>
    </TabItem>

    </Tabs>

## Общие примеры {#general-examples}

Вы можете предоставлять каждое разрешение одному получателю или набору из нескольких получателей. В этом примере мы предоставляем `select` для данной модели только пользователю `bi_user`, чтобы он мог выполнять запросы из нашего инструмента бизнес-аналитики (BI).

<File name='models/table_model.sql'>

```sql
{{ config(materialized = 'table', grants = {
    'select': 'bi_user'
}) }}
```

</File>

Когда dbt запускает эту модель в первый раз, он создаёт таблицу, а затем выполняет код вида:
```sql
grant select on schema_name.table_model to bi_user;
```

В следующем примере мы создаём инкрементальную модель и предоставляем привилегию `select` двум получателям: `bi_user` и `reporter`.

<File name='models/incremental_model.sql'>

```sql
{{ config(materialized = 'incremental', grants = {
    'select': ['bi_user', 'reporter']
}) }}
```

</File>

Когда dbt запускает эту модель в первый раз, он создаёт таблицу, а затем выполняет код вида:
```sql
grant select on schema_name.incremental_model to bi_user, reporter;
```

При последующих запусках dbt использует SQL, специфичный для конкретной базы данных, чтобы получить текущие grants на `incremental_model`, а затем определяет, нужно ли выполнять какие-либо команды `revoke` или `grant`.

## Требования и заметки для разных хранилищ {#database-specific-requirements-and-notes}

Несмотря на стремление стандартизировать используемые термины для описания различных возможностей, в разных базах данных всегда существуют нюансы. В этом разделе описаны некоторые требования и примечания, специфичные для отдельных СУБД.

В примерах выше и ниже мы используем привилегию с именем `select` и получателя с именем `another_user`. Многие базы данных используют эти или похожие термины. Обратите внимание, что ваша база данных может требовать другой синтаксис для привилегий и получателей; вы должны настраивать `grants` в dbt, используя корректные имена для обоих.

<WHCode>

<div warehouse="BigQuery">

В BigQuery «привилегии» называются «ролями» и имеют вид `roles/service.roleName`. Например, вместо предоставления `select` на модель вы должны предоставить `roles/bigquery.dataViewer`.

Получателями могут быть пользователи, группы, сервисные аккаунты, домены — и каждый из них должен быть явно обозначен с помощью префикса. Например, чтобы предоставить доступ к модели пользователю `someone@yourcompany.com`, необходимо указать его как `user:someone@yourcompany.com`.

Рекомендуем ознакомиться с документацией Google для получения дополнительного контекста:
- [Understanding GCP roles](https://cloud.google.com/iam/docs/understanding-roles)
- [How to format grantees](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-control-language#user_list)

<Snippet path="grants-vs-access-to" />

### Примеры BigQuery {#bigquery-examples}

Предоставление прав с использованием SQL и BigQuery:

```sql
{{ config(grants = {'roles/bigquery.dataViewer': ['user:someone@yourcompany.com']}) }}
```

Предоставление прав в schema-файле модели для BigQuery:

<File name='models/schema.yml'>

```yml
models:
  - name: specific_model
    config:
      grants:
        roles/bigquery.dataViewer: ['user:someone@yourcompany.com']
```

</File>

</div>

<div warehouse="Databricks">

- OSS Apache Spark / Delta Lake не поддерживают `grants`.
- Databricks автоматически включает поддержку `grants` на SQL endpoints. Для интерактивных кластеров администраторы должны включить функциональность grants, выполнив два шага настройки из документации Databricks:
  - [Enable table access control for your workspace](https://docs.databricks.com/administration-guide/access-control/table-acl.html)
  - [Enable table access control for a cluster](https://docs.databricks.com/security/access-control/table-acls/table-acl.html)
- Для предоставления `READ_METADATA` или `USAGE` используйте [post-hooks](/reference/resource-configs/pre-hook-post-hook)

</div>

<div warehouse="Redshift">

* Предоставление и отзыв прав полностью поддерживаются только для пользователей Redshift (не для [groups](https://docs.aws.amazon.com/redshift/latest/dg/r_Groups.html) и не для [roles](https://docs.aws.amazon.com/redshift/latest/dg/r_roles-managing.html)). См. соответствующую задачу [dbt-redshift#415](https://github.com/dbt-labs/dbt-redshift/issues/415).

</div>

<div warehouse="Snowflake">

* dbt учитывает конфигурацию [`copy_grants`](/reference/resource-configs/snowflake-configs#copying-grants) при расчёте того, какие grants нужно добавить или удалить.
* Предоставление и отзыв прав полностью поддерживаются только для ролей Snowflake (не для [database roles](https://docs.snowflake.com/user-guide/security-access-control-overview#types-of-roles)).

</div>

</WHCode>
