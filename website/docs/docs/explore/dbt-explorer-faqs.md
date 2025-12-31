---
title: "dbt Catalog FAQs"
sidebar_label: "dbt Catalog FAQs"
description: "Узнайте больше из часто задаваемых вопросов о dbt Catalog: как он работает, как с ним взаимодействовать и многое другое."
---

[<Constant name="explorer" />](/docs/explore/explore-projects) — это новая база знаний и инструмент визуализации lineage в <Constant name="cloud" />. Он предоставляет интерактивный и высокоуровневый обзор всего ландшафта данных вашей компании, позволяя углубляться в необходимый контекст, чтобы понимать и улучшать lineage, а значит — повышать доверие команд к данным, которые они используют для принятия решений.

## Обзор {#overview}

<Expandable alt_header="Как dbt Catalog помогает с качеством данных?" >

<Constant name="explorer" /> делает понимание всего lineage — от источников данных до слоя отчетности — простым и наглядным, чтобы вы могли отлаживать, улучшать и оптимизировать пайплайны. Благодаря встроенным возможностям, таким как рекомендации по проекту и анализ производительности моделей, вы можете быть уверены, что по всему ландшафту данных обеспечено достаточное покрытие тестами и документацией, а также быстро находить и устранять медленно выполняющиеся модели. Column-level lineage позволяет быстро определить потенциальное влияние изменений таблиц на downstream-зависимости или, наоборот, оперативно разобраться в первопричине инцидента. <Constant name="explorer" /> дает командам инсайты, необходимые для проактивного повышения качества данных, поддерживая высокую производительность пайплайнов и стабильное доверие к данным.

</Expandable>

<Expandable alt_header="Как формируется стоимость dbt Catalog?" >

<Constant name="explorer" /> доступен во всех регионах и для всех типов развертывания на планах <Constant name="cloud" /> уровня [Enterprise и Starter](https://www.getdbt.com/). Некоторые возможности <Constant name="explorer" />, такие как рекомендации по проекту, multi-project lineage, column-level lineage и другие, доступны только на планах Enterprise и Enterprise+.

Доступ к <Constant name="explorer" /> имеют пользователи с developer и read-only лицензиями.

</Expandable>

<Expandable alt_header="Что произошло с dbt Docs?" >

<Constant name="explorer" /> является основным интерфейсом документации для клиентов <Constant name="cloud" />. dbt Docs по-прежнему доступен, но не предлагает той же скорости, объема метаданных и уровня видимости, что <Constant name="explorer" />, и со временем станет legacy-функцией.

</Expandable>

## Как работает dbt Catalog {#how-dbt-catalog-works}

<Expandable alt_header="Можно ли использовать dbt Catalog on-premises или с self-hosted развертыванием dbt Core?" >

Нет. <Constant name="explorer" /> и все его возможности доступны только в рамках пользовательского интерфейса <Constant name="cloud" />. <Constant name="explorer" /> отражает метаданные ваших проектов <Constant name="cloud" /> и их запусков.

</Expandable>

<Expandable alt_header="Как dbt Catalog поддерживает окружения dbt?" >

<Constant name="explorer" /> поддерживает одно production или staging [окружение развертывания](/docs/deploy/deploy-environments) для каждого проекта, который вы хотите исследовать. По умолчанию используется последнее состояние production или staging проекта. Для одного проекта <Constant name="cloud" /> можно назначить только одно production и одно staging окружение.

Поддержка development-окружений (<Constant name="cloud_cli" /> и <Constant name="cloud_ide" />) появится в ближайшее время.

</Expandable>

<Expandable alt_header="Как начать работу с Catalog? Как происходит обновление данных?" >

Просто выберите **Explore** в верхней навигационной панели <Constant name="cloud" />. <Constant name="explorer" /> автоматически обновляется после каждого запуска <Constant name="cloud" /> в соответствующем окружении проекта (по умолчанию — production). Команды dbt, которые вы выполняете в рамках окружения, генерируют и обновляют метаданные в <Constant name="explorer" />, поэтому убедитесь, что в джобах этого окружения запускается корректный набор команд. Подробнее см. в разделе [Generate metadata](/docs/explore/explore-projects#generate-metadata).

</Expandable>

<Expandable alt_header="Можно ли экспортировать lineage dbt во внешнюю систему или каталог?" >

Да. Lineage, на котором основан <Constant name="explorer" />, также доступен через Discovery API.

</Expandable>

<Expandable alt_header="Как dbt Catalog интегрируется со сторонними инструментами для отображения сквозного lineage?" >

<Constant name="explorer" /> отражает весь lineage, определенный внутри dbt-проекта. Наше видение <Constant name="explorer" /> заключается в том, чтобы со временем включать дополнительные метаданные из внешних инструментов, таких как загрузчики данных (sources) и BI/аналитические инструменты (exposures), интегрированные с <Constant name="cloud" />, и бесшовно встраивать их в lineage проекта <Constant name="cloud" />.

</Expandable>

<Expandable alt_header="Почему ранее видимые данные исчезли из dbt Catalog?" >

<Constant name="explorer" /> автоматически удаляет устаревшие метаданные через 3 месяца, если за это время не выполнялись джобы для их обновления. Чтобы избежать этого, убедитесь, что джобы с необходимыми командами запускаются чаще, чем раз в 3 месяца.

</Expandable>

## Ключевые возможности {#key-features}

<Expandable alt_header="Поддерживает ли dbt Catalog multi-project discovery (dbt Mesh)?" >

Да. Подробнее см. в разделе [Explore multiple projects](/docs/explore/explore-multiple-projects).

</Expandable>

<Expandable alt_header="Какие возможности поиска поддерживает dbt Catalog?" >

Поиск ресурсов поддерживает ключевые слова, частичные совпадения (fuzzy search) и логические операторы, такие как `OR`. Поиск по lineage поддерживает использование dbt selectors. Подробности см. в разделе [Keyword search](/docs/explore/explore-projects#search-resources).

</Expandable>

<Expandable alt_header="Можно ли просматривать информацию о выполнении моделей для джобы, которая сейчас выполняется?" >

<Constant name="cloud" /> обновляет графики производительности и метрики после завершения выполнения джобы.

</Expandable>

<Expandable alt_header="Можно ли проанализировать количество успешных запусков моделей за месяц?" >

График моделей, собранных по месяцам, доступен в дашборде <Constant name="cloud" />.

</Expandable>

<Expandable alt_header="Можно ли редактировать описания моделей или колонок прямо в dbt?" >

Да. На сегодняшний день вы можете редактировать описания в <Constant name="cloud_ide" /> или <Constant name="cloud_cli" />, изменяя YAML-файлы в рамках dbt-проекта. В будущем <Constant name="explorer" /> будет поддерживать дополнительные способы редактирования описаний.

</Expandable>

<Expandable alt_header="Откуда берутся рекомендации? Можно ли их настраивать?" >

Рекомендации в основном повторяют правила best practices из пакета `dbt_project_evaluator`. В настоящее время рекомендации нельзя настраивать. В будущем <Constant name="explorer" /> вероятно будет поддерживать возможности кастомизации рекомендаций (например, через код проекта).

</Expandable>

## Lineage на уровне колонок {#column-level-lineage}

<Expandable alt_header="Какие основные сценарии использования column-level lineage в dbt Catalog?" >

Column-level lineage в <Constant name="explorer" /> можно использовать для улучшения многих процессов разработки данных, включая:

- **Audit** — визуализация того, как данные перемещаются и используются в dbt-проекте  
- **Root cause** — сокращение времени обнаружения и устранения проблем с качеством данных за счет трассировки до источника  
- **Impact analysis** — отслеживание трансформаций и использования, чтобы избежать проблем для потребителей данных  
- **Efficiency** — удаление ненужных колонок для снижения затрат и нагрузки на команду данных

</Expandable>

<Expandable alt_header="Остается ли column-level lineage рабочим, если имена колонок различаются между моделями?" >

Да. Column-level lineage корректно обрабатывает изменения имен колонок в разных местах dbt-проекта.

</Expandable>

<Expandable alt_header="Могут ли несколько проектов использовать одно и то же определение колонки?" >

Нет. Cross-project column lineage поддерживается только в контексте просмотра того, как публичная модель используется в разных проектах, но не на уровне отдельных колонок.

</Expandable>

<Expandable alt_header="Могут ли описания колонок автоматически распространяться downstream по lineage?" >

Да. Повторно используемая колонка, помеченная как passthrough или rename, наследует описание из source или upstream-модели. Иными словами, колонки источников и upstream-моделей передают свои описания downstream всякий раз, когда они не трансформируются, поэтому вам не нужно вручную задавать описание. Подробнее см. в разделе [Inherited column descriptions](/docs/explore/column-level-lineage#inherited-column-descriptions).

</Expandable>

<Expandable alt_header="Доступен ли column-level lineage на вкладке development?" >

В настоящее время — нет, но в будущем мы планируем добавить awareness column-level lineage во все возможности <Constant name="cloud" />.

</Expandable>

## Доступность, доступ и права {#availability-access-and-permissions}

<Expandable alt_header="Как пользователи без developer-роли могут взаимодействовать с dbt Catalog?" >

Пользователи с read-only доступом могут просматривать метаданные в <Constant name="explorer" />. Более специализированные сценарии и способы исследования для аналитиков и менее технических участников будут добавлены в будущем.

</Expandable>

<Expandable alt_header="Требуется ли определенный план dbt для использования dbt Catalog?" >

<Constant name="explorer" /> доступен на плане dbt Starter и на всех планах Enterprise. Некоторые возможности <Constant name="explorer" />, такие как рекомендации по проекту, multi-project lineage, column-level lineage и другие, доступны только на планах Enterprise и Enterprise+.

</Expandable>

<Expandable alt_header="Смогут ли пользователи dbt Core воспользоваться новыми возможностями dbt Catalog?" >

Нет. <Constant name="explorer" /> — это продукт, доступный только в рамках <Constant name="cloud" />.

</Expandable>

<Expandable alt_header="Можно ли получить доступ к dbt Catalog с read-only лицензией?" >

Да, пользователи с read-only доступом могут использовать <Constant name="explorer" />. Доступность конкретных функций <Constant name="explorer" /> зависит от вашего плана <Constant name="cloud" />.

</Expandable>

<Expandable alt_header="Есть ли простой способ поделиться полезным контентом dbt Catalog с людьми вне dbt?" >

Возможность встраивания и шаринга представлений рассматривается как потенциальная функция в будущем.

</Expandable>

<Expandable alt_header="Доступен ли dbt Catalog из других разделов внутри dbt?" >

Да, вы можете [получить доступ к <Constant name="explorer" /> из различных функций <Constant name="cloud" />](/docs/explore/access-from-dbt-cloud), что обеспечивает бесшовную навигацию между ресурсами и lineage в рамках проекта.

Хотя основной способ доступа к <Constant name="explorer" /> — это ссылка **Explore** в навигации, вы также можете открыть его из [<Constant name="cloud_ide" />](/docs/explore/access-from-dbt-cloud#dbt-cloud-ide), [вкладки lineage в jobs](/docs/explore/access-from-dbt-cloud#lineage-tab-in-jobs) и [вкладки model timing в jobs](/docs/explore/access-from-dbt-cloud#model-timing-tab-in-jobs).

</Expandable>
