## Просмотр авто-экспозиций в dbt Explorer

После настройки авто-экспозиций в dbt Cloud, вы можете просматривать их в dbt Explorer для более полного опыта:
1. Перейдите в dbt Explorer, нажав на ссылку **Explore** в навигации.
2. На странице **Overview** вы можете просматривать авто-экспозиции из нескольких мест:
   - Из пункта меню **Exposures** в разделе **Resources**. Это меню предоставляет полный список всех экспозиций, чтобы вы могли быстро получить к ним доступ и управлять ими.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-resources.jpg" width="120%" title="Просмотр из dbt Explorer в меню 'Resources'."/>

   - Найдите их непосредственно в **File tree** в подкаталоге **imported_from_tableau**. Этот вид интегрирует экспозиции с вашими проектными файлами, что облегчает их поиск и использование в структуре вашего проекта.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-file-tree.jpg" width="120%" title="Просмотр из dbt Explorer в меню 'File tree'."/>

   - Из вида **Project lineage**, который визуализирует зависимости и связи в вашем проекте. Экспозиции представлены с иконкой Tableau, что предлагает интуитивный способ увидеть, как они вписываются в общий поток данных вашего проекта.

   <DocCarousel slidesPerView={1}>

   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="95%" title="Просмотр из dbt Explorer в виде Project lineage, отображаемый с иконкой Tableau."/>

   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg" width="95%" title="Просмотр из dbt Explorer в виде Project lineage, отображаемый с иконкой Tableau."/>

   </DocCarousel>