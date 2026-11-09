---
title: "Артефакты"
id: "artifacts"
description: "Используйте артефакты для автоматического создания сайта документации и получения данных об актуальности источников." 
availability: platform_login
---

При выполнении заданий dbt генерирует и сохраняет *артефакты*. Эти артефакты, например `manifest.json`, `catalog.json` и `sources.json`, используются для работы различных компонентов <Constant name="dbt_platform" />, а именно: [<Constant name="catalog" />](/docs/explore/explore-projects), [dbt Docs](/docs/explore/build-and-view-your-docs?version=1.12#dbt-docs) и [отчётов об актуальности источников](/docs/build/sources#source-data-freshness).

## Создание артефактов dbt {#create-dbt-artifacts}

[<Constant name="catalog" />](/docs/explore/explore-projects#generate-metadata) использует метаданные, предоставляемые [Discovery API](/docs/dbt-apis/discovery-api), для отображения подробной информации о [состоянии вашего проекта](/docs/dbt-apis/project-state). Для этого используются метаданные из ваших [сред развертывания](/docs/deploy/deploy-environments) — промежуточной (staging) и производственной (production).

<Constant name="catalog" /> автоматически получает обновленные метаданные после каждого запуска задания в производственной или промежуточной среде развертывания, поэтому всегда содержит последние результаты для вашего проекта &mdash; то есть автоматически обновляется после каждого запуска задания.

Чтобы посмотреть ресурс, его метаданные и понять, какие команды для этого требуются, обратитесь к разделу [generate metadata](/docs/explore/explore-projects#generate-metadata) для получения дополнительной информации.

<Expandable alt_header="Для dbt Docs">

Следующие шаги предназначены только для прежней версии dbt Docs. Об актуальном интерфейсе документации см. [dbt <Constant name="catalog" />](/docs/explore/explore-projects).

Хотя выполнение любого задания может производить артефакты, вы должны ассоциировать только одно производственное задание с данным проектом для создания артефактов проекта. Вы можете указать это соединение на странице **Детали проекта**. Чтобы получить доступ к этой странице:

1. В <Constant name="dbt_platform" /> нажмите на имя своей учетной записи в меню слева и выберите **Account settings**.
2. Выберите свой проект и нажмите **Edit** в правом нижнем углу.
3. В разделе **Artifacts** выберите задания (jobs), для которых вы хотите создавать артефакты документации и свежести источников.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/project-level-artifact-updated.png" width="70%" title="Настройка артефактов"/>

Если нужного задания нет в списке, возможно, вам нужно отредактировать его и выбрать **Run source freshness** <VersionBlock lastVersion="1.99"> и **Generate docs on run** </VersionBlock>

<VersionBlock lastVersion="1.99"> 
<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/edit-job-generate-artifacts.png" title="Редактирование задания для создания артефактов"/>
</VersionBlock>
  
Когда вы добавляете в проект задание для среды production, <Constant name="dbt" /> обновляет содержимое и предоставляет ссылки на документацию среды production и артефакты проверки актуальности источников, созданные для этого проекта. Чтобы увидеть эти ссылки, нажмите **Deploy** в левом верхнем углу, выберите **Jobs**, а затем — задание для среды production. На странице задания можно выбрать конкретный запуск, чтобы посмотреть, как артефакты были обновлены именно в этом запуске.

</Expandable>

### Документация {#documentation}

Перейдите в [<Constant name="catalog" />](/docs/explore/explore-projects) по ссылке **Explore**, чтобы просмотреть ресурсы проекта и связи между ними и лучше понять его последнее состояние в производственной среде.

Чтобы посмотреть конкретный ресурс, его метаданные и какие команды для этого требуются, см. раздел [generate metadata](/docs/explore/explore-projects#generate-metadata) для получения дополнительной информации.

<VersionBlock lastVersion="1.99">

Чтобы документация обновилась, во время запуска задания должны успешно выполниться как команды задания, так и шаг генерации документации (включаемый флажком **Generate docs on run**).

</VersionBlock>

<Expandable alt_header="Для dbt Docs">

После настройки <Constant name="dbt" /> обновляет ссылку Documentation на вкладке в верхней части страницы, чтобы она вела на документацию для этого задания. Эта ссылка всегда ведёт на последнюю версию документации вашего проекта.

</Expandable>

### Свежесть источников {#source-freshness}

Чтобы просмотреть последний результат проверки свежести источников, ознакомьтесь с подробной информацией в разделе [Создание метаданных](/docs/explore/explore-projects#generate-metadata). Затем перейдите в <Constant name="catalog" /> по ссылке **Explore**.

<Expandable alt_header="Для dbt Docs">

Настройка задания с параметром артефакта **Source Freshness** также обновляет ссылку на источник данных в разделе **Orchestration** > **Data sources**. Эта ссылка ведёт к последнему отчёту Source Freshness для выбранного задания.

</Expandable>