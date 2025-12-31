## Просмотр downstream exposures {#view-downstream-exposures}

После настройки downstream exposures в <Constant name="cloud" /> вы можете просматривать их в [<Constant name="explorer" />](/docs/explore/explore-projects), что даёт более удобный и наглядный опыт работы.

Перейдите в <Constant name="explorer" />, нажав на ссылку **Explore** в навигации. На странице **Overview** вы можете просмотреть downstream exposures из нескольких мест:

<!-- no toc -->
- [Меню Exposures](#exposures-menu)
- [Дерево файлов](#file-tree)
- [Линейность проекта](#project-lineage)

### Меню Exposures {#exposures-menu}
Просматривайте нисходящие зависимости из пункта меню **Exposures** в разделе **Resources**. Это меню предоставляет исчерпывающий список всех экспозиций, чтобы вы могли быстро получать к ним доступ и управлять ими. В меню отображается следующая информация:
   - **Name**: Название экспозиции.
   - **Health**: [Сигнал качества данных](/docs/explore/data-health-signals) экспозиции.
   - **Type**: Тип экспозиции, например `dashboard` или `notebook`.
   - **Owner**: Владелец экспозиции.
   - **Owner email**: Адрес электронной почты владельца экспозиции.
   - **Integration**: BI-инструмент, с которым интегрирована экспозиция.
   - **Exposure mode**: Определённый тип экспозиции: **Auto** или **Manual**.
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-resources.jpg" width="120%" title="Вид в dbt Catalog в меню «Resources»."/>

### Дерево файлов {#file-tree}
Найдите экспозиции непосредственно в **File tree** (дереве файлов) внутри подпапки **imported_from_tableau**. Этот режим органично встраивает экспозиции в файлы вашего проекта, упрощая их поиск и использование в рамках структуры проекта.
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-file-tree.jpg" width="120%" title="Вид из dbt Catalog в меню «File tree»."/>

### Граф зависимостей проекта {#project-lineage}
В представлении **Project lineage**, которое визуализирует зависимости и связи в вашем проекте. Экспозиции отображаются с иконкой Tableau, что позволяет наглядно увидеть, как они вписываются в общий поток данных проекта.
<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="95%" title="Вид из dbt Catalog в представлении Project lineage, отображается с иконкой Tableau."/>
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg" width="95%" title="Вид из dbt Catalog в представлении Project lineage, отображается с иконкой Tableau."/>
</DocCarousel>
