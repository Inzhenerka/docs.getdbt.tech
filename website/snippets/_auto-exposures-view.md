## Просмотр downstream exposures

После настройки downstream exposures в <Constant name="cloud" /> вы можете просматривать их в [<Constant name="explorer" />](/docs/explore/explore-projects), что даёт более удобный и наглядный опыт работы.

Перейдите в <Constant name="explorer" />, нажав на ссылку **Explore** в навигации. На странице **Overview** вы можете просмотреть downstream exposures из нескольких мест:

<!-- no toc -->
- [Меню Exposures](#exposures-menu)
- [Дерево файлов](#file-tree)
- [Линейность проекта](#project-lineage)

### Exposures menu
View downstream exposures from the **Exposures** menu item under **Resources**. This menu provides a comprehensive list of all the exposures so you can quickly access and manage them. The menu displays the following information:
   - **Name**: The name of the exposure.
   - **Health**: The [data health signal](/docs/explore/data-health-signals) of the exposure.
   - **Type**: The type of exposure, such as `dashboard` or `notebook`.
   - **Owner**: The owner of the exposure.
   - **Owner email**: The email address of the owner of the exposure.
   - **Integration**: The BI tool that the exposure is integrated with.
   - **Exposure mode**: The type of exposure defined: **Auto** or **Manual**.
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-resources.jpg" width="120%" title="View from the dbt Catalog under the 'Resources' menu."/>

### Дерево файлов
Найдите экспозиции непосредственно в **File tree** (дереве файлов) внутри подпапки **imported_from_tableau**. Этот режим органично встраивает экспозиции в файлы вашего проекта, упрощая их поиск и использование в рамках структуры проекта.
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-file-tree.jpg" width="120%" title="Вид из dbt Catalog в меню «File tree»."/>

### Линейность проекта
В представлении **Project lineage**, которое визуализирует зависимости и связи в вашем проекте. Экспозиции отображаются с иконкой Tableau, что позволяет наглядно увидеть, как они вписываются в общий поток данных проекта.
<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="95%" title="Вид из dbt Catalog в представлении Project lineage, отображается с иконкой Tableau."/>
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg" width="95%" title="Вид из dbt Catalog в представлении Project lineage, отображается с иконкой Tableau."/>
</DocCarousel>
