---
title: Использование defer в dbt
id: about-defer
description: "Узнайте, как использовать defer для обращения к production-окружению при разработке с dbt."
sidebar_label: "Defer в dbt"
pagination_next: "docs/about-dbt-extension"
availability:
  surface: platform
  access: login_required
---


[Defer](/reference/node-selection/defer) — это мощная возможность, которая позволяет разработчикам собирать, запускать и тестировать только те модели<VersionBlock firstVersion="1.11"> и функции</VersionBlock>, которые они изменили, без необходимости собирать и запускать все предшествующие им модели<VersionBlock firstVersion="1.11"> и функции</VersionBlock> (вышестоящие родительские узлы). Для этого dbt использует манифест production-окружения для сравнения и разрешает вызовы `{{ ref() }}`<VersionBlock firstVersion="1.11"> и `{{ function() }}`</VersionBlock> с помощью вышестоящих артефактов production-окружения.

И <Constant name="studio_ide" />, и <Constant name="dbt" /> CLI позволяют пользователям обращаться к метаданным production-окружения с помощью встроенной поддержки defer непосредственно в процессе разработки. 

<Lightbox src src="/img/docs/reference/defer-diagram.png" width="50%" title="Используйте 'defer', чтобы изменять модели в конце пайплайна, обращаясь к моделям production-окружения вместо запуска всех вышестоящих моделей." />

При использовании `--defer` <Constant name="dbt" /> разрешает вызовы `{{ ref() }}`<VersionBlock firstVersion="1.11"> и `{{ function() }}`</VersionBlock> в следующем порядке.

1. Если версия объекта базы данных, к которому применяется defer, существует в окружении разработки, dbt при разрешении ссылки отдает предпочтение его расположению в базе данных разработки.
2. Если версии в окружении разработки нет, dbt использует расположения родительских объектов базы данных в staging-окружении на основе метаданных этого окружения.
3. Если нет ни версии в окружении разработки, ни staging-окружения, dbt использует расположения родительских объектов базы данных в production-окружении на основе метаданных этого окружения. Обратите внимание: в рамках одного вызова dbt применяет defer только к одному окружению &mdash; либо staging, либо production.

**Примечание:** При передаче флага `--favor-state` ссылки всегда разрешаются с использованием метаданных staging-окружения, если они доступны; в противном случае используются метаданные production-окружения независимо от наличия объекта базы данных в окружении разработки, а шаг № 1 пропускается.

Чтобы начинать с чистого состояния, рекомендуется удалять схему разработки в начале и в конце цикла разработки.

Если вам нужен дополнительный контроль над данными production-окружения, создайте [staging-окружение](/docs/deploy/deploy-environments#staging-environment), и dbt будет использовать его вместо production-окружения для разрешения вызовов `{{ ref() }}`<VersionBlock firstVersion="1.11"> и `{{ function() }}`</VersionBlock>.

## Варианты настройки

Существует несколько способов настроить defer в dbt в зависимости от конфигурации вашего проекта:

- **<Constant name="dbt_platform" />**: При использовании <Constant name="studio_ide" /> или <Constant name="platform_cli" /> defer управляется автоматически. При необходимости можно настроить `defer-env-id`, чтобы указать конкретное окружение. Подробнее о настройке см. в разделе [Настройка defer на платформе dbt](#set-up-deferral-in-the-dbt-platform).
- **Самостоятельно управляемые развертывания (`defer_to_target`)**: Если у вас включен [dbt State](/docs/deploy/dbt-state-about), задайте `defer_to_target` в `profiles.yml`, чтобы указать, к какому окружению dbt State должен обращаться при использовании defer. Подробнее о настройке см. в разделах [`defer_to_target`](/reference/resource-configs/defer-to-target) и [Настройка defer в dbt State](/docs/deploy/dbt-state-deferral).
- **Ручная настройка defer (`--state`)**: Явно передайте `--state` или `--defer-state`, чтобы указать dbt конкретный файл `manifest.json`. Подробнее об использовании см. в разделе [Defer](/reference/node-selection/defer).

:::tip Используйте dbt State для более интеллектуальной работы defer <Lifecycle status="beta" />
В самостоятельно управляемых развертываниях с включенным [dbt State](/docs/deploy/dbt-state-about) селекторы `state:*` могут сравнивать каждый узел с его собственным последним выполнением, а не с единым файлом `manifest.json` &mdash; управлять манифестами не требуется. См. раздел [Селекторы `state:*` на базе dbt State](/docs/deploy/dbt-state-deferral#dbt-state-powered-state-selectors).
:::

## Настройка defer на платформе dbt {#set-up-deferral-in-the-dbt-platform}

- Необходимо установить флажок **[Production environment](/docs/deploy/deploy-environments#set-as-production-environment)** на странице **Environment Settings**.
  - Его можно установить для одного окружения развертывания в каждом проекте <Constant name="dbt" />.
- Сначала необходимо успешно выполнить задание.

При использовании defer для сравнения берутся артефакты последнего успешно выполненного задания в production-окружении, за исключением заданий CI.

В следующих разделах описано, как включить и настроить defer в <Constant name="studio_ide" /> и <Constant name="platform_cli" />, а также как выбрать окружение, к которому dbt обращается при использовании defer.

### Defer в dbt IDE {#defer-in-the-dbt-ide}

Чтобы использовать defer в <Constant name="studio_ide" />, необходимы артефакты production-окружения, созданные заданием развертывания. <Constant name="dbt" /> сначала проверит наличие этих артефактов в staging-окружении (если оно доступно), а затем — в production-окружении.

Функция defer в <Constant name="studio_ide" /> не будет работать, если staging-окружение существует, но в нем еще не запускалось задание развертывания. Это связано с тем, что необходимые для работы defer метаданные появляются только после успешного выполнения задания развертывания в staging-окружении.

Чтобы включить defer в <Constant name="studio_ide" />, активируйте переключатель **Defer to staging/production** на панели команд. После включения <Constant name="dbt" /> будет:

1. Загружать последний манифест из staging- или production-окружения для сравнения
2. Передавать команде флаг `--defer` (для любой команды, поддерживающей этот флаг)

Например, если вы начнете разработку в новой ветке, когда [в вашей схеме разработки ничего нет](/reference/node-selection/defer#usage), измените одну модель и выполните `dbt build -s state:modified` &mdash; запустится только измененная модель. Все вызовы `{{ ref() }}`<VersionBlock firstVersion="1.11"> и `{{ function() }}`</VersionBlock> будут разрешаться в расположения соответствующих моделей<VersionBlock firstVersion="1.11"> и пользовательских функций</VersionBlock> в staging- или production-окружении.

<Lightbox src="/img/docs/dbt-platform/defer-toggle.png" width="100%" title="Активируйте переключатель 'Defer to production' в правом нижнем углу панели команд, чтобы включить defer в Studio IDE."/>

<a id="defer-in-dbt-cli" />

### Defer в dbt platform CLI {#defer-in-dbt-platform-cli}

Одно из ключевых отличий использования `--defer` в <Constant name="platform_cli" /> и <Constant name="studio_ide" /> заключается в том, что в <Constant name="platform_cli" /> `--defer` включен *автоматически* для всех вызовов, а сравнение выполняется с артефактами production-окружения. Отключить его можно с помощью флага `--no-defer`.

<VersionBlock firstVersion="2.0">
Чтобы автоматическое применение defer могло связать ваш проект с настройками, указанными в `dbt_cloud.yml`, в файле `dbt_project.yml` необходимо указать идентификатор проекта <Constant name="dbt_platform"/>.

<File name="dbt_project.yml">

```yml
dbt-cloud:
  project-id: '654321'
```

</File>
</VersionBlock>

### Настройка идентификатора окружения для defer {#configure-deferral-environment-id}

И <Constant name="studio_ide" />, и <Constant name="platform_cli" /> обеспечивают дополнительную гибкость, позволяя выбирать исходное окружение для артефактов defer. Вы можете вручную задать ключ `defer-env-id` в файле `[dbt_project.yml](/reference/dbt_project.yml)` (<Constant name="platform_cli" /> и <Constant name="studio_ide" />) или `dbt_cloud.yml` (только <Constant name="platform_cli" />). По умолчанию dbt отдает предпочтение метаданным из окружения проекта «Staging» (если оно определено). В противном случае используется «Production». Полное описание файла см. в разделе [`dbt_cloud.yml`](/reference/dbt_cloud.yml).

<Lightbox src="/img/docs/dbt-platform/defer-env-id.png" width="100%" title="Задайте окружение для defer, и имя целевого окружения изменится в пользовательском интерфейсе."/>

<File name="dbt_cloud.yml">

```yml
context:
  active-host: ...
  active-project: ...
  defer-env-id: '123456'
```

</File>


<File name="dbt_project.yml">

```yml
dbt-cloud:
  project-id: '654321'
  defer-env-id: '123456'
```

</File>
