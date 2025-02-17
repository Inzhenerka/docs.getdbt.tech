---
title: "Артефакты"
id: "artifacts"
description: "Используйте артефакты для автоматизации вашего сайта документации и данных о свежести источников."
---

При запуске заданий dbt, dbt Cloud генерирует и сохраняет *артефакты*. Вы можете использовать эти артефакты, такие как `manifest.json`, `catalog.json` и `sources.json`, для различных аспектов dbt Cloud, а именно: [dbt Explorer](/docs/collaborate/explore-projects), [dbt Docs](/docs/collaborate/build-and-view-your-docs#dbt-docs) и [отчетности о свежести источников](/docs/build/sources#source-data-freshness).

## Создание артефактов dbt Cloud

[dbt Explorer](/docs/collaborate/explore-projects#generate-metadata) использует метаданные, предоставляемые [Discovery API](/docs/dbt-cloud-apis/discovery-api), чтобы отображать детали о [состоянии вашего проекта](/docs/dbt-cloud-apis/project-state). Он использует метаданные из ваших промежуточных и производственных [сред развертывания](/docs/deploy/deploy-environments) (метаданные среды разработки появятся в ближайшее время).

dbt Explorer автоматически получает обновления метаданных после каждого запуска задания в производственной или промежуточной среде развертывания, чтобы всегда иметь последние результаты для вашего проекта &mdash; это означает, что он всегда автоматически обновляется после каждого запуска задания.

Чтобы просмотреть ресурс, его метаданные и необходимые команды, обратитесь к [генерации метаданных](/docs/collaborate/explore-projects#generate-metadata) для получения более подробной информации.

<Expandable alt_header="Для dbt Docs">

Следующие шаги предназначены только для устаревших dbt Docs. Для текущего опыта работы с документацией см. [dbt Explorer](/docs/collaborate/explore-projects).

Хотя выполнение любого задания может производить артефакты, вы должны ассоциировать только одно производственное задание с данным проектом для создания артефактов проекта. Вы можете указать это соединение на странице **Детали проекта**. Чтобы получить доступ к этой странице:

1. В dbt Cloud нажмите на имя вашей учетной записи в левом меню и выберите **Настройки учетной записи**.
2. Выберите ваш проект и нажмите **Редактировать** в нижнем правом углу.
3. В разделе **Артефакты** выберите задания, для которых вы хотите создать документацию и артефакты свежести источников.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/project-level-artifact-updated.png" width="70%" title="Настройка артефактов"/>

Если вы не видите ваше задание в списке, возможно, вам нужно отредактировать задание и выбрать **Запустить свежесть источников** и **Создать документацию при запуске**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/edit-job-generate-artifacts.png" title="Редактирование задания для создания артефактов"/>

Когда вы добавляете производственное задание в проект, dbt Cloud обновляет содержимое и предоставляет ссылки на производственную документацию и артефакты свежести источников, которые он создал для этого проекта. Вы можете увидеть эти ссылки, нажав **Развернуть** в верхнем левом углу, выбрав **Задания**, а затем выбрав производственное задание. На странице задания вы можете выбрать конкретный запуск, чтобы увидеть, как артефакты были обновлены только для этого запуска.

</Expandable>

### Документация

Перейдите в [dbt Explorer](/docs/collaborate/explore-projects) через ссылку **Исследовать**, чтобы просмотреть ресурсы вашего проекта и его родословную, чтобы лучше понять его текущее производственное состояние.

Чтобы просмотреть ресурс, его метаданные и необходимые команды, обратитесь к [генерации метаданных](/docs/collaborate/explore-projects#generate-metadata) для получения более подробной информации.

Обе команды задания и шаг генерации документации (запускаемый флажком **Создать документацию при запуске**) должны быть успешными во время вызова задания для обновления документации.

<Expandable alt_header="Для dbt Docs">

Когда настройка завершена, dbt Cloud обновляет ссылку на Документацию в заголовке, чтобы она вела к документации для этого задания. Эта ссылка всегда направляет вас на последнюю версию документации для вашего проекта.

</Expandable>

### Свежесть источников

Чтобы просмотреть последний результат свежести источников, обратитесь к [генерации метаданных](/docs/collaborate/explore-projects#generate-metadata) для получения более подробной информации. Затем перейдите в dbt Explorer через ссылку **Исследовать**.

<Expandable alt_header="Для dbt Docs">

Настройка задания для артефакта Свежести источников также обновляет ссылку на источник данных в разделе **Развернуть**. Новая ссылка указывает на последний отчет о свежести источников для выбранного задания.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/data-sources.png" title="Ссылка на последнюю снимок свежести источников для выбранного задания"/>

</Expandable>