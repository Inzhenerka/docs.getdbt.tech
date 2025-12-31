---
title: "Артефакты"
id: "artifacts"
description: "Используйте артефакты для автоматизации вашего сайта документации и данных о свежести источников."
---

При запуске заданий dbt dbt генерирует и сохраняет *артефакты*. Вы можете использовать эти артефакты, такие как `manifest.json`, `catalog.json` и `sources.json`, для работы различных компонентов <Constant name="dbt_platform" />, а именно: [<Constant name="explorer" />](/docs/explore/explore-projects), [dbt Docs](/docs/explore/build-and-view-your-docs#dbt-docs) и [отчётов о свежести источников](/docs/build/sources#source-data-freshness).

## Создание артефактов dbt {#create-dbt-artifacts}

[<Constant name="explorer" />](/docs/explore/explore-projects#generate-metadata) использует метаданные, предоставляемые [Discovery API](/docs/dbt-cloud-apis/discovery-api), чтобы отображать сведения о [состоянии вашего проекта](/docs/dbt-cloud-apis/project-state). Для этого используются метаданные из ваших [окружений деплоя](/docs/deploy/deploy-environments) — staging и production.

<Constant name="explorer" /> автоматически получает обновления метаданных после каждого запуска задания в production или staging окружении деплоя, поэтому он всегда содержит самые актуальные результаты для вашего проекта — то есть автоматически обновляется после каждого запуска задания.

Чтобы посмотреть ресурс, его метаданные и понять, какие команды для этого требуются, обратитесь к разделу [generate metadata](/docs/explore/explore-projects#generate-metadata) для получения дополнительной информации.

<Expandable alt_header="Для dbt Docs">

Следующие шаги относятся **только к устаревшей версии dbt Docs**. Актуальный вариант документации см. в разделе [dbt <Constant name="explorer" />](/docs/explore/explore-projects).

Хотя выполнение любого задания может производить артефакты, вы должны ассоциировать только одно производственное задание с данным проектом для создания артефактов проекта. Вы можете указать это соединение на странице **Детали проекта**. Чтобы получить доступ к этой странице:

1. В <Constant name="dbt_platform" /> нажмите на имя своей учетной записи в меню слева и выберите **Account settings**.
2. Выберите свой проект и нажмите **Edit** в правом нижнем углу.
3. В разделе **Artifacts** выберите задания (jobs), для которых вы хотите создавать артефакты документации и свежести источников.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/project-level-artifact-updated.png" width="70%" title="Настройка артефактов"/>

Если вы не видите ваше задание в списке, возможно, вам нужно отредактировать задание и выбрать **Запустить свежесть источников** и **Создать документацию при запуске**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/edit-job-generate-artifacts.png" title="Редактирование задания для создания артефактов"/>

Когда вы добавляете production job в проект, <Constant name="cloud" /> обновляет содержимое и предоставляет ссылки на production-документацию и артефакты source freshness, которые были сгенерированы для этого проекта. Эти ссылки можно увидеть, нажав **Deploy** в левом верхнем углу, выбрав **Jobs**, а затем выбрав production job. На странице job вы можете выбрать конкретный run, чтобы посмотреть, как артефакты были обновлены именно для этого запуска.

</Expandable>

### Документация {#documentation}

Перейдите в раздел [<Constant name="explorer" />](/docs/explore/explore-projects) по ссылке **Explore**, чтобы просмотреть ресурсы вашего проекта и их lineage и лучше понять его текущее состояние в продакшене.

Чтобы посмотреть конкретный ресурс, его метаданные и какие команды для этого требуются, см. раздел [generate metadata](/docs/explore/explore-projects#generate-metadata) для получения дополнительной информации.

Обе команды задания и шаг генерации документации (запускаемый флажком **Создать документацию при запуске**) должны быть успешными во время вызова задания для обновления документации.

<Expandable alt_header="Для dbt Docs">

После настройки <Constant name="cloud" /> обновляет ссылку Documentation в заголовке так, что она ведёт к документации для этого задания. Эта ссылка всегда направляет вас на последнюю версию документации вашего проекта.

</Expandable>

### Свежесть источников {#source-freshness}

Чтобы просмотреть последний результат проверки свежести источников, см. раздел [generate metadata](/docs/explore/explore-projects#generate-metadata) для получения дополнительной информации. Затем перейдите в <Constant name="explorer" /> через ссылку **Explore**.

<Expandable alt_header="Для dbt Docs">

Настройка задания с параметром артефакта **Source Freshness** также обновляет ссылку на источник данных в разделе **Orchestration** > **Data sources**. Эта ссылка ведёт к последнему отчёту Source Freshness для выбранного задания.

</Expandable>