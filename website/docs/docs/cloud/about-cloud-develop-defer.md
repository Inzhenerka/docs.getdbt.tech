---
title: Использование defer в dbt
id: about-cloud-develop-defer
description: "Узнайте, как использовать defer на продакшн при разработке с dbt."
sidebar_label: "Defer в dbt"
pagination_next: "docs/about-dbt-extension"
---


[Defer](/reference/node-selection/defer) — это мощная возможность, которая позволяет разработчикам собирать, запускать и тестировать только те модели, которые они изменили, без необходимости предварительно запускать и строить все модели, от которых они зависят (upstream-родители). dbt реализует это, используя production manifest для сравнения и разрешая функцию `{{ ref() }}` через upstream-артефакты из production. 

И <Constant name="cloud_ide" />, и CLI <Constant name="cloud" /> позволяют пользователям нативно откладываться (defer) к метаданным production прямо в процессе разработки. 

<Lightbox src src="/img/docs/reference/defer-diagram.png" width="50%" title="Используйте 'defer' для изменения моделей в конце пайплайна, указывая на production-модели вместо запуска всего upstream." />

При использовании `--defer` <Constant name="cloud" /> следует следующему порядку выполнения при разрешении функций `{{ ref() }}`:

1. Если существует версия отложенной (deferred) relation в среде разработки, dbt в первую очередь использует расположение в базе данных разработки для разрешения ссылки.
2. Если версии в среде разработки не существует, dbt использует staging-расположения родительских relations на основе метаданных из Staging-окружения.
3. Если не существует ни версии в разработке, ни Staging-окружения, dbt использует production-расположения родительских relations на основе метаданных из Production-окружения. Обратите внимание, что dbt откладывается только к одному окружению за один запуск — либо staging, либо production.

**Примечание:** Передача флага `--favor-state` всегда будет разрешать refs с использованием staging-метаданных (если они доступны); в противном случае используется production-метаданные, независимо от наличия relation в среде разработки, пропуская шаг №1.

Для чистого старта рекомендуется удалять схему разработки в начале и в конце цикла разработки.

Если вам требуется дополнительный контроль над production-данными, создайте [Staging environment](/docs/deploy/deploy-environments#staging-environment), и dbt будет использовать его, а не Production-окружение, для разрешения функций `{{ ref() }}`.

## Необходимая настройка

- Необходимо выбрать флажок **[Production environment](/docs/deploy/deploy-environments#set-as-production-environment)** на странице **Environment Settings**.  
  - Это можно сделать только для одного deployment-окружения в рамках проекта <Constant name="cloud" />.
- Должен быть хотя бы один успешный запуск job.

При использовании defer выполняется сравнение артефактов из самого последнего успешного production job, за исключением CI job.

### Defer в dbt IDE

Чтобы использовать defer в <Constant name="cloud_ide" />, у вас должны быть production-артефакты, сгенерированные deploy job. <Constant name="cloud" /> сначала проверит наличие этих артефактов в Staging-окружении (если оно существует), и только затем — в Production-окружении. 

Функция defer в <Constant name="cloud_ide" /> не будет работать, если Staging-окружение существует, но ни один deploy job в нём ещё не выполнялся. Это связано с тем, что необходимые метаданные для работы defer появляются только после успешного выполнения deploy job в Staging-окружении.

Чтобы включить defer в <Constant name="cloud_ide" />, переключите кнопку **Defer to staging/production** в командной панели. После включения <Constant name="cloud" /> выполнит следующие действия:

1. Загрузит самый последний manifest из Staging или Production-окружения для сравнения
2. Передаст флаг `--defer` в команду (для любой команды, которая поддерживает этот флаг)

Например, если вы начинаете разработку в новой ветке с [пустой схемой разработки](/reference/node-selection/defer#usage), редактируете одну модель и запускаете `dbt build -s state:modified`, то будет выполнена только изменённая модель. Все функции `{{ ref() }}` будут указывать на staging- или production-расположения соответствующих моделей.

<Lightbox src="/img/docs/dbt-cloud/defer-toggle.png" width="100%" title="Выберите переключатель 'Defer to production' в правом нижнем углу командной панели, чтобы включить defer в Studio IDE." />

### Defer в dbt CLI

Одно из ключевых отличий использования `--defer` в <Constant name="cloud_cli" /> по сравнению с <Constant name="cloud_ide" /> заключается в том, что `--defer` *автоматически* включён в <Constant name="cloud_cli" /> для всех запусков при сравнении с production-артефактами. Вы можете отключить его с помощью флага `--no-defer`.

<Constant name="cloud_cli" /> предоставляет дополнительную гибкость, позволяя выбирать окружение-источник артефактов для defer. Вы можете вручную указать ключ `defer-env-id` либо в файле `dbt_project.yml`, либо в `dbt_cloud.yml`. По умолчанию <Constant name="cloud_cli" /> предпочитает метаданные из Staging-окружения проекта (если оно определено), в противном случае — из Production.

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
  defer-env-id: '123456'
```

</File>
