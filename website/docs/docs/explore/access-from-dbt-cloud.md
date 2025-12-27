---
title: "Доступ к Catalog из возможностей dbt platform"
sidebar_label: "Доступ из dbt platform"
description: "Узнайте, где и как напрямую получать доступ к Catalog и взаимодействовать с ним из возможностей и продуктов dbt platform."
---

Получайте доступ к <Constant name="explorer" /> из других функций и продуктов внутри <Constant name="cloud" />, обеспечивая единый и непрерывный опыт навигации между ресурсами и lineage в вашем проекте.

На этой странице объясняется, как получить доступ к <Constant name="explorer" /> из различных функций <Constant name="cloud" />, включая <Constant name="cloud_ide" /> и jobs. Хотя основной способ перейти к <Constant name="explorer" /> — это ссылка **Explore** в навигации, вы также можете открывать его и из других возможностей <Constant name="cloud" />.

### Studio IDE 
Вы можете улучшить навигацию по проекту и процесс редактирования, напрямую переходя к ресурсам из [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) в <Constant name="explorer" /> для файлов моделей, seed или snapshot. Такой рабочий процесс обеспечивает плавный переход между <Constant name="cloud_ide" /> и <Constant name="explorer" />, позволяя быстро переключаться между просмотром метаданных проекта и внесением изменений в модели или другие ресурсы без смены контекста.

#### Доступ к Catalog из IDE
- В файле модели, seed или snapshot нажмите на иконку **View in <Constant name="explorer" />**, расположенную справа от breadcrumbs файла (под вкладкой с именем файла).
- Это откроет модель, seed или snapshot в новой вкладке, где вы сможете напрямую просматривать ресурсы и lineage в <Constant name="explorer" />.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-ide.jpg" title="Доступ к dbt Catalog из IDE при нажатии на иконку 'View in Explorer' рядом с breadcrumbs файла." />

### Canvas

Получайте доступ к <Constant name="explorer" /> напрямую через <Constant name="visual_editor" />, чтобы оживить рабочий процесс с помощью визуального редактирования.

#### Доступ к Catalog из Canvas

Шаги будут добавлены здесь  
[Roxi проверит с Greg и командой и добавит изображения после получения ответа]

### Вкладка Lineage в jobs
Вкладка **Lineage** в jobs <Constant name="cloud" /> отображает lineage, связанный с [job run](/docs/deploy/jobs). Вы можете напрямую перейти в <Constant name="explorer" /> с этой вкладки, чтобы лучше понять зависимости и взаимосвязи ресурсов в вашем проекте.

#### Доступ к Catalog из вкладки lineage
- В job выберите вкладку **Lineage**.
- Дважды щёлкните по узлу в lineage, чтобы открыть новую вкладку и просмотреть его метаданные напрямую в <Constant name="explorer" />.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-lineage.gif" title="Доступ к dbt Catalog из вкладки lineage при двойном клике по узлу lineage." />

### Вкладка Model timing в jobs <Lifecycle status="self_service,managed,managed_plus"/>

[Вкладка model timing](/docs/deploy/run-visibility#model-timing) в jobs <Constant name="cloud" /> показывает состав, порядок выполнения и время, затраченное каждой моделью в рамках job run.

Вы можете получить доступ к <Constant name="explorer" /> напрямую из **вкладки model timing**, что помогает исследовать ресурсы, диагностировать узкие места производительности, понимать зависимости и взаимосвязи медленно выполняющихся моделей, а также при необходимости вносить изменения для улучшения их производительности.

#### Доступ к Catalog из вкладки model timing
- В job выберите **вкладку model timing**.
- Наведите курсор на ресурс и нажмите **View on <Constant name="explorer" />**, чтобы открыть метаданные ресурса напрямую в <Constant name="explorer" />.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-model-timing.jpg" title="Доступ к dbt Catalog из вкладки model timing при наведении на ресурс и нажатии 'View in Explorer'." />

### dbt Insights <Lifecycle status="managed,managed_plus" />

Получайте доступ к <Constant name="explorer" /> напрямую из [<Constant name="query_page" />](/docs/explore/access-dbt-insights), чтобы просматривать lineage проекта и его ресурсы, включая таблицы, колонки, метрики, измерения и многое другое.

Чтобы открыть <Constant name="explorer" /> из <Constant name="query_page" />, нажмите на иконку **<Constant name="explorer" />** в боковом меню Query console и найдите интересующий вас ресурс.

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="dbt Insights, интегрированный с dbt Catalog" />
