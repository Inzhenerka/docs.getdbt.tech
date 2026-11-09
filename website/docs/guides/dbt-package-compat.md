---
title: "Руководство по обновлению пакетов для dbt v2"
id: "dbt-package-compat"
description: "Узнайте, как обновить пакеты для совместимости с dbt v2."
intro_text: "Узнайте, как обновить пакеты для совместимости с dbt v2."
hoverSnippet: "Узнайте, как обновить пакеты для совместимости с dbt v2."
# time_to_complete: '30 minutes' commenting out until we test
icon: 'zap'
hide_table_of_contents: true
tags: ['dbt v2']
level: 'Advanced'
---

## Введение {#introduction}

Спасибо, что вы являетесь частью [сообщества dbt package hub](https://hub.getdbt.com/) и поддерживаете [пакеты](/docs/build/packages)! Ваша работа делает экосистему dbt возможной и помогает тысячам команд повторно использовать проверенные модели и макросы для более быстрой и надёжной аналитики.

Это руководство поможет вам обновить пакеты dbt, чтобы они были совместимы с [<Constant name="fusion" />](/docs/introduction). Пакет, совместимый с <Constant name="fusion" />:
- Поддерживает [<Constant name="fusion_engine" />](/docs/introduction) версии `2.0.0`
- Использует [конфигурацию `require-dbt-version`](/reference/project-configs/require-dbt-version) для указания совместимости в dbt package hub
- Соответствует последней схеме JSON, представленной в <Constant name="dbt" /> v1.10.0

В этом руководстве мы рассмотрим:

- Обновление пакета для совместимости с <Constant name="fusion"/>
- Тестирование пакета с <Constant name="fusion"/>
- Обновление конфигурации `require-dbt-version` с добавлением `2.0.0`
- Обновление README с указанием совместимости пакета с <Constant name="fusion"/>

### Для кого это руководство? {#who-is-this-for}

Это руководство предназначено для любого мейнтейнера dbt‑пакетов, например [`dbt-utils`](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/), который хочет обновить свой пакет для совместимости с <Constant name="fusion"/>. Обновление пакета гарантирует, что пользователи получают актуальную версию, пакет остаётся надёжным в dbt package hub, а пользователи получают доступ к новым возможностям и исправлениям ошибок.

Пользователь подключает пакет в файле `packages.yml` или `dependencies.yml`. Если пакет исключает `2.0.0`, <Constant name="fusion"/> сейчас выдаёт предупреждение, а в будущих релизах будет завершаться с ошибкой — аналогично поведению <Constant name="core"/>.

В этом руководстве предполагается, что вы используете командную строку и Git для внесения изменений в репозиторий пакета. Если вы хотите создать новый пакет с нуля, рекомендуем начать с [руководства по созданию dbt‑пакетов](/guides/building-packages).

## Предварительные требования {#prerequisites}

Перед началом убедитесь, что выполнены следующие условия:

- Мейнтейнер dbt‑пакета &mdash; вы поддерживаете пакет в [dbt package hub](https://hub.getdbt.com/) или планируете [создать новый](/guides/building-packages?step=1).
- Установлен `dbt-autofix` &mdash; [установите `dbt-autofix`](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation), чтобы автоматически обновлять YAML‑файлы пакета в соответствии с последними изменениями dbt и лучшими практиками. Мы рекомендуем [использовать/установить uv/uvx](https://docs.astral.sh/uv/getting-started/installation/) для запуска инструмента.
  - Запустите команду `uvx dbt-autofix`, чтобы использовать последнюю версию инструмента. Другие варианты установки см. в [официальной документации `dbt-autofix`](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation).
- Доступ к репозиторию &mdash; вам понадобятся права на создание ветки и выпуск обновлений/новой версии пакета. После обеспечения совместимости с <Constant name="fusion"/> потребуется создать новый тег версии.
- Установка или тестовое окружение <Constant name="fusion"/> &mdash; вы можете использовать <Constant name="fusion"/> локально (через бинарь `dbtf`) или в CI‑пайплайне для проверки совместимости.
- Работа с CLI и Git &mdash; вы уверенно используете командную строку и Git для обновления репозитория.

## Обновите пакет
В этом разделе описано, как обновить пакет для совместимости с <Constant name="fusion"/>:
- [Используйте `dbt-autofix` для автоматического обновления YAML-файлов](/guides/dbt-package-compat?step=)
- [Протестируйте пакет с <Constant name="fusion"/>](/guides/dbt-package-compat?step=5)
- [Обновите настройку `require-dbt-version`](/guides/dbt-package-compat?step=6)
- [Опубликуйте новый релиз пакета](/guides/dbt-package-compat?step=7)

В этом разделе описано, как обновить пакет для совместимости с <Constant name="fusion"/>:
- [Использование `dbt-autofix` для автоматического обновления YAML‑файлов](/guides/dbt-package-compat?step=)
- [Тестирование пакета с <Constant name="fusion"/>](/guides/dbt-package-compat?step=5)
- [Обновление конфигурации `require-dbt-version`](/guides/dbt-package-compat?step=6)
- [Публикация нового релиза пакета](/guides/dbt-package-compat?step=7)

Если вы готовы начать, давайте приступим!

## Запустите dbt-autofix {#run-dbt-autofix}

1. Перед началом убедитесь, что `dbt-autofix` установлен. Если нет, выполните команду `uvx dbt-autofix`. Дополнительные варианты установки см. в [официальной документации `dbt-autofix`](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation).

2. В репозитории вашего dbt‑пакета создайте рабочую ветку. Например:
    ```bash
    git checkout -b fusion-compat
    ```

3. Запустите `dbt-autofix deprecations` в директории пакета, чтобы автоматически обновить код пакета и переписать YAML‑файлы в соответствии с последней JSON‑схемой:
    ```bash
    dbt-autofix deprecations
    ```

<!-- 4. (Необязательно) Вы также можете запускать `dbt-autofix` как временную проверку continuous integration (CI), пока пакет не станет совместимым с <Constant name="fusion"/>:
    ```bash
    dbt-autofix deprecations --check
    ```
-->

## Тестирование пакета с помощью <Constant name="fusion" />

Теперь, когда вы запустили `dbt-autofix`, протестируйте свой пакет с помощью <Constant name="fusion"/>, чтобы убедиться в его совместимости, прежде чем [обновлять](https://docs.getdbt.com/guides/dbt-package-compat?step=6) настройку `require-dbt-version`. Подробнее о том, на что следует обратить внимание, читайте в [документации об ограничениях <Constant name="fusion"/>](/docs/dbt/supported-features#limitations). Протестировать пакет можно двумя способами:

<!-- no toc -->
- [Запуск интеграционных тестов с помощью <Constant name="fusion" />](#running-your-integration-tests-with-v2) &mdash; Используйте этот способ, если в вашем пакете есть [интеграционные тесты](https://docs.getdbt.com/guides/building-packages?step=4) в папке `integration_tests/`.
- [Проверка пакета вручную](#manually-validating-your-package) &mdash; Используйте этот способ, если в вашем пакете нет [интеграционных тестов](https://docs.getdbt.com/guides/building-packages?step=4). Подумайте о добавлении интеграционного теста, чтобы упростить проверку пакета.

#### Запуск интеграционных тестов с помощью v2 {#running-your-integration-tests-with-v2}

Если в пакете есть папка `integration_tests/` ([например, как в `dbt-utils`](https://github.com/dbt-labs/dbt-utils/tree/main/integration_tests)), выполните следующие шаги:

1. Перейдите в папку (`cd integration_tests`), чтобы запустить тесты. Если у вас нет папки `integration_tests/`, вы можете [создать её](https://docs.getdbt.com/guides/building-packages?step=4) или перейти в папку, содержащую ваши тесты.
2. Затем запустите тесты с помощью <Constant name="fusion"/>, выполнив следующую команду `dbtf build` (или используя другой исполняемый файл <Constant name="fusion"/>, доступный в вашей среде).
3. Если ошибок нет, ваш пакет, скорее всего, поддерживает <Constant name="fusion"/>, и вы готовы [обновить `require-dbt-version`](https://docs.getdbt.com//guides/dbt-package-compat?step=5#update-your-require-dbt-version). Если есть ошибки, сначала необходимо исправить их, а затем обновить `require-dbt-version`.

#### Ручная валидация вашего пакета {#manually-validating-your-package}

Если в пакете нет интеграционных тестов, выполните следующие шаги:

1. Создайте небольшой dbt‑проект, совместимый с <Constant name="fusion"/>, который устанавливает ваш пакет и содержит файл `packages.yml` или `dependencies.yml`.
2. Запустите проект с <Constant name="fusion"/>, используя команду `dbtf run`.
3. Убедитесь, что модели собираются успешно и нет предупреждений. При наличии ошибок или предупреждений их нужно устранить. Если проблемы сохраняются, обратитесь за помощью в канал [#package-ecosystem](https://getdbt.slack.com/archives/CU4MRJ7QB) в Slack.

## Обновление `require-dbt-version` {#update-require-dbt-version}

Обновляйте конфигурацию [`require-dbt-version`](/reference/project-configs/require-dbt-version) **только после** тестирования и подтверждения, что пакет работает с <Constant name="fusion"/>.

1. Обновите `require-dbt-version` в `dbt_project.yml`, добавив `2.0.0`. Мы рекомендуем использовать диапазон версий для обеспечения стабильности:
    ```yaml
    require-dbt-version: [">=1.10.0,<3.0.0"] 
    ```
    Это указывает, что пакет поддерживает как <Constant name="core"/>, так и <Constant name="fusion"/>.
    dbt Labs использует эти метаданные релиза, чтобы отметить ваш пакет бейджем совместимости с <Constant name="fusion"/> в [dbt package hub](https://hub.getdbt.com/). Пакеты без этих метаданных не отображают бейдж совместимости с <Constant name="fusion"/>.

2. Закоммитьте и отправьте изменения в репозиторий.

## Публикация нового релиза {#publish-a-new-release}

1. После коммита и отправки изменений опубликуйте новый релиз пакета, смёрджив ветку в main (или в основную ветку, используемую в вашем репозитории).
2. Обновите `README`, указав, что пакет совместим с <Constant name="fusion"/>.
3. (Необязательно) Анонсируйте обновление в канале [#package-ecosystem в dbt Slack](https://getdbt.slack.com/archives/CU4MRJ7QB).

:::tip Тестирование dbt v2 в CI
По возможности добавьте в свой конвейер CI шаг, который запускает `dbtf build` или эквивалентную команду, чтобы постоянно проверять совместимость с <Constant name="fusion"/>.
:::

Теперь ваш пакет совместим с <Constant name="fusion"/>, и dbt package hub отражает эти изменения. В итоге вы:

- Создана ветка, совместимая с v2
- Выполнен запуск `dbt-autofix` для устранения устаревших конструкций
- Изменения проверены, зафиксированы в коммите и протестированы 
- Ограничение `require-dbt-version: [">=1.10.0,<3.0.0"]` обновлено, чтобы включить `2.0.0`
- Опубликован новый релиз
- Объявлено об обновлении (необязательно)
- Отпразднуйте получение нового значка совместимости с <Constant name="fusion"/> 🎉

## Финальные мысли {#final-thoughts}

<ConfettiTrigger>

Теперь, когда вы обновили пакет для совместимости с <Constant name="fusion"/>, пользователи могут использовать его вместе с <Constant name="fusion"/>! 🎉

Обновляя версию сейчас, вы обеспечиваете более комфортную работу пользователей, прокладываете путь для следующего поколения проектов dbt и помогаете <Constant name="fusion"/> достичь полной стабильности.

Если у вас есть вопросы или вы столкнулись с проблемами:

- Присоединяйтесь к обсуждению в канале [#package-ecosystem](https://getdbt.slack.com/archives/CU4MRJ7QB) в Slack.
- Создайте issue в [репозитории dbt-autofix](https://github.com/dbt-labs/dbt-autofix/issues) на GitHub.

И напоследок — спасибо за вклад в развитие экосистемы dbt &mdash; по одному пакету за раз 💜.
</ConfettiTrigger>

## Часто задаваемые вопросы {#frequently-asked-questions}

Ниже приведены ответы на часто задаваемые вопросы об обновлении пакета для совместимости с <Constant name="fusion"/>.

<Expandable alt_header="Почему нужно обновлять наш пакет?">

<Constant name="fusion"/> и <Constant name="dbt" /> v1.10+ используют один и тот же новый слой для разработки. Убедитесь, что конфигурация `require-dbt-version` вашего пакета допускает версию `2.0.0`, чтобы обеспечить совместимость пакета с обоими движками.

Обновление пакета гарантирует, что пользователи получают актуальную версию, пакет остаётся надёжным в dbt package hub, а пользователи получают новые возможности и исправления ошибок. Пакеты, совместимые с <Constant name="fusion"/>, отображают соответствующий бейдж в dbt package hub.

Если пакет исключает `2.0.0`, <Constant name="fusion"/> сейчас выдаст предупреждение, а в одном из будущих релизов — ошибку, что соответствует поведению <Constant name="core"/>. 

</Expandable>

<Expandable alt_header="Как протестировать v2 в CI?">

Добавьте отдельную задачу, которая устанавливает <Constant name="fusion"/> (`dbtf`) и запускает `dbtf build`. См. этот [PR](https://github.com/godatadriven/dbt-date/pull/31) в качестве рабочего примера.

Это необходимо, чтобы любые изменения в пакете оставались совместимыми с <Constant name="fusion"/>.
</Expandable>

<Expandable alt_header="Как пользователи узнают, что мой пакет совместим с v2?">

Пользователи могут определить совместимость пакета с <Constant name="fusion"/>, проверив наличие версии 2.0.0 или выше в диапазоне `require-dbt-version`.

Пакеты, совместимые с <Constant name="fusion"/>, также автоматически отображают соответствующий бейдж в dbt package hub на основе метаданных пакета и требований к версиям.

</Expandable>
