## Просмотр downstream exposures {#view-downstream-exposures}

После настройки зависимых exposures в <Constant name="dbt" /> вы можете просматривать их в [<Constant name="catalog" />](/docs/explore/explore-projects), где доступны расширенные возможности работы с ними.

Перейдите в <Constant name="catalog" />, выбрав **Catalog** в верхнем меню навигации. Просматривать зависимые exposures можно в нескольких местах:

<!-- no toc -->
- [Меню Exposures](#exposures-menu)
- [Страница сведений об exposure](#exposure-detail-page)
- [Граф зависимостей проекта](#project-lineage)

### Меню Exposures {#exposures-menu}

Просматривайте все зависимые exposures проекта на боковой панели Catalog:

1. На боковой панели выберите свой проект.
2. В разделе проекта выберите **Exposure**. Этот пункт отображается только в том случае, если вы настроили зависимые exposures в [Tableau](/docs/platform-integrations/downstream-exposures-tableau?#set-up-in-tableau) и [dbt](/docs/platform-integrations/downstream-exposures-tableau?#set-up-in-dbt-cloud).

В таблице **Exposures** перечислены все exposures проекта, что позволяет быстро находить их и управлять ими:

   - **Name**: имя exposure.
   - **Health**: [сигнал о состоянии данных](/docs/explore/data-health-signals) для exposure.
   - **Type**: тип exposure, например `dashboard` или `notebook`.
   - **Owner**: владелец exposure.
   - **Owner email**: адрес электронной почты владельца exposure.
   - **Integration**: BI-инструмент, с которым интегрирован exposure.
   - **Exposure mode**: заданный режим создания exposure: **Auto** или **Manual**. Автоматически созданные exposures из Tableau отображаются вместе с exposures, созданными вручную

<Lightbox src="/img/docs/platform-integrations/auto-exposures/explorer-view-resources.png" width="120%" title="Просмотр таблицы Exposures через боковую панель Catalog."/>

### Страница сведений об exposure {#exposure-detail-page}

Открыв таблицу **Exposures** ([предыдущий раздел](#exposures-menu)), выберите имя exposure, чтобы открыть страницу сведений о нём.

На странице сведений об exposure можно просмотреть метаданные, [сигналы о состоянии данных](/docs/explore/data-health-signals), описание и граф зависимостей. Для автоматически созданных exposures из Tableau используйте **Open in Dashboard**, чтобы открыть рабочую книгу в Tableau, или **Modify integration**, чтобы изменить настройки подключения к Tableau.

<Lightbox src="/img/docs/platform-integrations/auto-exposures/explorer-view-exposure-detail.png" width="120%" title="Просмотр страницы сведений об exposure в Catalog."/>

### Граф зависимостей проекта {#project-lineage}

Вы также можете просматривать exposures в представлении **Project lineage**, отдельно от таблицы **Exposures**:

1. На боковой панели выберите свой проект.
2. Нажмите **View lineage**.
3. Выберите узел exposure со значком Tableau, чтобы просмотреть сведения о нём на боковой панели.

Это представление визуализирует зависимости и связи в вашем проекте. Для автоматически созданных exposures из Tableau используйте **View in Tableau** или **Modify integration** на боковой панели.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/platform-integrations/auto-exposures/explorer-lineage2.png" width="95%" title="Просмотр exposure со значком Tableau в представлении графа зависимостей проекта в dbt Catalog."/>
<Lightbox src="/img/docs/platform-integrations/auto-exposures/explorer-lineage.png" width="95%" title="Просмотр exposure со значком Tableau в представлении графа зависимостей проекта в dbt Catalog."/>
</DocCarousel>
