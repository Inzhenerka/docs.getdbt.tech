---
title: "Доступ к моделям"
id: model-access
sidebar_label: "Доступ к моделям"
description: "Определение доступа к моделям с помощью возможностей групп"
---

:::info "Доступ к моделям" не равен "Доступу пользователей"

**Группы моделей и доступ** и **группы пользователей и доступ** означают две разные вещи. "Группы пользователей и доступ" — это специфический термин, используемый в dbt Cloud для управления разрешениями. Обратитесь к [Доступ пользователей](/docs/cloud/manage-access/about-user-access) для получения дополнительной информации.

Эти две концепции будут тесно связаны, так как мы разрабатываем рабочие процессы для совместной работы над несколькими проектами в этом году:
- Пользователи с доступом к разработке в проекте dbt могут просматривать и изменять **все** модели в этом проекте, включая приватные модели.
- Пользователи в той же учетной записи dbt Cloud _без_ доступа к разработке в проекте не могут просматривать приватные модели этого проекта и могут зависеть только от его публичных моделей.
:::

## Связанная документация
* [`groups`](/docs/build/groups)
* [`access`](/reference/resource-configs/access)

## Группы

Модели могут быть сгруппированы под общим обозначением с общим владельцем. Например, вы можете сгруппировать все модели, принадлежащие определенной команде, или связанные с моделированием конкретного источника данных (`github`).

Зачем определять `группы` моделей? Есть две причины:
- Это превращает неявные отношения в явную группировку с определенным владельцем. Размышляя о границах интерфейсов _между_ группами, вы можете создать более чистый (менее запутанный) DAG. В будущем эти границы интерфейсов могут быть подходящими в качестве интерфейсов между отдельными проектами.
- Это позволяет вам обозначить определенные модели как имеющие "приватный" доступ — для использования исключительно в этой группе. Другие модели будут ограничены в возможности ссылаться (зависеть) на эти модели. В будущем они не будут видны другим командам, зависящим от вашего проекта — только "публичные" модели будут.

Если вы следуете нашим [лучшим практикам по структуре проекта dbt](/best-practices/how-we-structure/1-guide-overview), вы, вероятно, уже используете подкаталоги для организации вашего проекта dbt. Легко применить метку `group` ко всему подкаталогу сразу:

<File name="dbt_project.yml">

```yml
models:
  my_project_name:
    marts:
      customers:
        +group: customer_success
      finance:
        +group: finance
```

</File>

Каждая модель может принадлежать только одной `группе`, и группы не могут быть вложенными. Если вы установите другую `группу` в YAML этой модели или в конфигурации файла, она переопределит `группу`, примененную на уровне проекта.

## Модификаторы доступа

Некоторые модели являются деталями реализации, предназначенными только для использования в их группе связанных моделей. Другие модели должны быть доступны через функцию [ref](/reference/dbt-jinja-functions/ref) между группами и проектами. Модели могут установить [модификатор доступа](https://en.wikipedia.org/wiki/Access_modifiers), чтобы указать предполагаемый уровень доступности.

| Доступ    | Доступен для ссылок                     |
|-----------|----------------------------------------|
| private   | Та же группа                            |
| protected | Тот же проект (или установлен как пакет) |
| public    | Любая группа, пакет или проект. При определении, перезапустите производственную задачу, чтобы применить изменения |

Если вы попытаетесь сослаться на модель вне ее поддерживаемого доступа, вы увидите ошибку:

```shell
dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Parsing Error
  Node model.jaffle_shop.marketing_model attempted to reference node model.jaffle_shop.finance_model, 
  which is not allowed because the referenced node is private to the finance group.
```

По умолчанию все модели `protected`. Это означает, что другие модели в том же проекте могут ссылаться на них, независимо от их группы. Это в основном для обратной совместимости при назначении групп существующему набору моделей, так как уже могут существовать существующие ссылки между назначениями групп.

Однако рекомендуется установить модификатор доступа новой модели на `private`, чтобы предотвратить зависимость других ресурсов проекта от моделей, не предназначенных для совместного использования между группами.

<File name="models/marts/customers.yml">

```yaml
# Сначала определите группу и владельца
groups:
  - name: customer_success
    owner:
      name: Customer Success Team
      email: cx@jaffle.shop

# Затем добавьте 'group' + 'access' модификатор к конкретным моделям
models:
  # Это публичная модель -- это стабильный и зрелый интерфейс для других команд/проектов
  - name: dim_customers
    group: customer_success
    access: public
    
  # Это приватная модель -- это промежуточная трансформация, предназначенная только для использования в этом контексте
  - name: int_customer_history_rollup
    group: customer_success
    access: private
    
  # Это защищенная модель -- она может быть полезна в другом месте в *этом* проекте,
  # но не должна быть доступна в других местах
  - name: stg_customer__survey_results
    group: customer_success
    access: protected
```

</File>

Модели с `materialized`, установленным на `ephemeral`, не могут иметь свойство доступа, установленное на public.

Например, если у вас есть конфигурация модели, установленная как:

<File name="models/my_model.sql">

```sql

{{ config(materialized='ephemeral') }}

```

</File>

И доступ к модели определен:

<File name="models/my_project.yml">

```yaml

models:
  - name: my_model
    access: public

```

</File>

Это приведет к следующей ошибке:

```
❯ dbt parse
02:19:30  Encountered an error:
Parsing Error
  Node model.jaffle_shop.my_model with 'ephemeral' materialization has an invalid value (public) for the access field
```

## Часто задаваемые вопросы

### Как доступ к моделям соотносится с разрешениями базы данных?

Это разные вещи!

Указание `access: public` на модели не заставляет dbt автоматически предоставлять `select` на эту модель каждому пользователю или роли в вашей платформе данных при ее материализации. Вы полностью контролируете управление разрешениями базы данных на каждую модель/схему, как это имеет смысл для вас и вашей организации.

Конечно, dbt может облегчить это с помощью [конфигурации `grants`](/reference/resource-configs/grants) и других гибких механизмов. Например:
- Предоставление доступа к публичным моделям для downstream-запросов
- Ограничение доступа к приватным моделям, отменяя стандартные/будущие гранты или размещая их в другой схеме

По мере того, как мы продолжаем развивать совместную работу над несколькими проектами, `access: public` будет означать, что другие команды могут начать зависеть от этой модели. Это предполагает, что они запросили, и вы предоставили им доступ, для выбора из базового набора данных.

### Как я могу сослаться на модель из другого проекта?

Вы можете сослаться на модель из другого проекта двумя способами:
1. [Зависимость проекта](/docs/collaborate/govern/project-dependencies): В dbt Cloud Enterprise вы можете использовать зависимости проекта, чтобы сослаться на модель. dbt Cloud использует метаданные за кулисами для разрешения ссылки, что позволяет эффективно сотрудничать между командами и в масштабе.
2. ["Пакетная" зависимость](/docs/build/packages): Другой способ сослаться на модель из другого проекта — это рассматривать другой проект как зависимость пакета. Это требует установки другого проекта как пакета, включая его полный исходный код, а также его восходящие зависимости.

### Как я могу ограничить доступ к моделям, определенным в пакете?

Исходный код, установленный из пакета, становится частью вашей среды выполнения. Вы можете вызывать макросы и запускать модели, как если бы они были макросами и моделями, которые вы определили в своем собственном проекте.

По этой причине ограничения доступа к моделям "выключены" по умолчанию для моделей, определенных в пакетах. Вы можете ссылаться на модели из этого пакета независимо от их модификатора `access`.

Проект, установленный как пакет, может опционально ограничить внешний доступ `ref` только к своим публичным моделям. Поддерживающий пакет делает это, устанавливая конфигурацию `restrict-access` в `True` в `dbt_project.yml`.

По умолчанию значение этой конфигурации — `False`. Это означает, что:
- Модели в пакете с `access: protected` могут быть ссылками для моделей в корневом проекте, как если бы они были определены в том же проекте
- Модели в пакете с `access: private` могут быть ссылками для моделей в корневом проекте, если они также имеют ту же конфигурацию `group`

Когда `restrict-access: True`:
- Любая ссылка `ref` из-за пределов пакета на защищенную или приватную модель в этом пакете будет неудачной.
- Только модели с `access: public` могут быть ссылками за пределами пакета.

<File name="dbt_project.yml">

```yml
restrict-access: True  # по умолчанию False
```

</File>