---
title: "Настройки аккаунта в dbt Cloud"
sidebar_label: "Настройки аккаунта"
description: "Узнайте, как включить настройки аккаунта для пользователей dbt Cloud."
---

Следующие разделы описывают различные **Настройки аккаунта**, доступные из вашего аккаунта dbt Cloud в боковой панели (под вашим именем аккаунта в нижней левой части).

<Lightbox src="/img/docs/dbt-cloud/example-sidebar-account-settings.png" title="Пример настроек аккаунта из боковой панели" />

## Кэширование Git-репозитория <Lifecycle status="enterprise" />

В начале каждого запуска задания dbt Cloud клонирует Git-репозиторий проекта, чтобы получить последние версии кода вашего проекта, и выполняет `dbt deps` для установки зависимостей.

Для повышения надежности и производительности выполнения заданий вы можете включить в dbt Cloud возможность сохранять кэш Git-репозитория проекта. Таким образом, если произойдет сбой стороннего сервиса, который приведет к неудаче операции клонирования, dbt Cloud вместо этого использует кэшированную копию репозитория, чтобы ваши задания могли продолжать выполняться по расписанию.

dbt Cloud кэширует Git-репозиторий вашего проекта после каждого успешного запуска и сохраняет его в течение 8 дней, если обновлений репозитория нет. Он кэширует все пакеты независимо от метода установки и не извлекает код вне выполнения заданий.

dbt Cloud будет использовать кэшированную копию Git-репозитория вашего проекта в следующих случаях:

- Сбои сторонних сервисов (например, [dbt package hub](https://hub.getdbt.com/)).
- Ошибки аутентификации Git.
- Синтаксические ошибки в файле `packages.yml`. Вы можете настроить и использовать [непрерывную интеграцию (CI)](/docs/deploy/continuous-integration), чтобы обнаружить эти ошибки раньше.
- Если пакет не работает с текущей версией dbt. Вы можете настроить и использовать [непрерывную интеграцию (CI)](/docs/deploy/continuous-integration), чтобы выявить эту проблему раньше.

Чтобы использовать, выберите опцию **Enable repository caching** в настройках вашего аккаунта.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Пример опции Enable repository caching" />

## Частичный парсинг

В начале каждого вызова dbt читает все файлы в вашем проекте, извлекает информацию и создает внутренний манифест, содержащий каждый объект (модель, источник, макрос и так далее). Среди прочего, он использует вызовы макросов `ref()`, `source()` и `config()` внутри моделей для установки свойств, определения зависимостей и построения DAG вашего проекта. Когда dbt завершает парсинг вашего проекта, он сохраняет внутренний манифест в файле под названием `partial_parse.msgpack`.

Парсинг проектов может занимать много времени, особенно для больших проектов с сотнями моделей и тысячами файлов. Чтобы сократить время, необходимое dbt для парсинга вашего проекта, используйте функцию частичного парсинга в dbt Cloud для вашей среды. Когда она включена, dbt Cloud использует файл `partial_parse.msgpack`, чтобы определить, какие файлы изменились (если таковые имеются) с момента последнего парсинга проекта, и затем парсит _только_ измененные файлы и файлы, связанные с этими изменениями.

Частичный парсинг в dbt Cloud требует версии dbt 1.4 или новее. У этой функции есть некоторые известные ограничения. Обратитесь к [Известные ограничения](/reference/parsing#known-limitations), чтобы узнать больше о них.

Чтобы использовать, выберите опцию **Enable partial parsing between deployment runs** в настройках вашего аккаунта.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Пример опции Enable partial parsing between deployment runs" />

## Доступ аккаунта к расширенным функциям CI <Lifecycle status="enterprise" />

[Расширенные функции CI](/docs/deploy/advanced-ci), такие как [сравнение изменений](/docs/deploy/advanced-ci#compare-changes), позволяют участникам аккаунта dbt Cloud просматривать детали изменений между тем, что находится в производственной среде, и запросом на слияние.

Чтобы использовать расширенные функции CI, ваш аккаунт dbt Cloud должен иметь к ним доступ. Попросите администратора dbt Cloud включить расширенные функции CI в вашем аккаунте, что они могут сделать, выбрав опцию **Enable account access to Advanced CI** в настройках аккаунта.

После включения опция **dbt compare** становится доступной в настройках CI задания для выбора.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Пример опции Enable account access to Advanced CI" />