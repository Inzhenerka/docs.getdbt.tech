---
title: "Просмотр документации"
description: "Узнайте, как подробная документация для ваших dbt‑моделей помогает стейкхолдерам находить и понимать ваши наборы данных."
id: "view-documentation"
---

dbt предоставляет интуитивно понятные и масштабируемые инструменты для просмотра документации dbt. Подробная документация крайне важна для разработчиков и других заинтересованных сторон, чтобы сформировать общее понимание контекста вашего dbt‑проекта.

Вы можете просматривать документацию двумя взаимодополняющими способами — в зависимости от ваших задач:

| Опция | Описание | Доступность |
|------|-------------|--------------|
| [**dbt Docs**](#dbt-docs) | Генерирует статический веб‑сайт с lineage моделей, метаданными и документацией, который можно разместить на вашем веб‑сервере (например, S3 или Netlify). | <Constant name="core" /> или <Constant name="cloud" /> Developer планы |
| [**<Constant name="explorer" />**](/docs/explore/explore-projects) | Основной способ работы с документацией в <Constant name="cloud" />. Расширяет возможности dbt Docs, предоставляя динамический интерфейс в реальном времени с богатыми [метаданными](/docs/explore/explore-projects#generate-metadata), настраиваемыми представлениями, глубоким пониманием проекта и ресурсов, а также инструментами для совместной работы. | <Constant name="cloud" /> Starter, Enterprise или Enterprise+ планы |

## Навигация по документации
В следующих разделах описано, как перемещаться по документации в <Constant name="explorer" /> и dbt Docs.

### Каталог <Lifecycle status="self_service,managed,managed_plus" />

[<Constant name="explorer" />](/docs/explore/explore-projects) предлагает динамичный и интерактивный способ исследования моделей, источников и lineage.
Чтобы открыть <Constant name="explorer" />, выберите пункт **Explore** в меню навигации <Constant name="cloud" />.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-model-details.png" width="95%" title="Пример страницы с деталями ресурса в Catalog и его lineage." />

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-main-page.gif" width="95%" title="Навигация по Catalog для изучения ресурсов и lineage проекта."/>

</DocCarousel>

<Constant name="explorer" /> предоставляет пользователям широкий набор возможностей для упрощения навигации по data‑проекту и его понимания, включая:

- Интерактивную визуализацию lineage DAG проекта для понимания связей между ресурсами.  
- Поиск ресурсов с расширенными фильтрами для быстрого и эффективного нахождения нужных объектов.  
- Инсайты о производительности моделей — доступ к метаданным запусков в <Constant name="cloud" /> для глубокого анализа производительности и качества моделей.  
- Рекомендации по проекту с предложениями по улучшению покрытия тестами и документации.  
- Data health signals для мониторинга состояния и производительности каждого ресурса.  
- Историю запросов к моделям, позволяющую отслеживать использование данных и лучше понимать их потребление.  
- Downstream exposures — автоматическое отображение релевантных моделей данных из инструментов вроде Tableau для повышения прозрачности.

Для получения дополнительной информации о том, как исследовать lineage, навигировать по ресурсам, просматривать историю запросов моделей и data health signals, доступность функций и многое другое — см. [Discover data with <Constant name="explorer" />](/docs/explore/explore-projects).

### Документация dbt Docs

dbt Docs предоставляет ценные инсайты по проектам на планах <Constant name="core" /> или <Constant name="cloud" /> Developer. Интерфейс позволяет перейти к документации конкретных моделей. Это может выглядеть примерно так:

<Lightbox src="/img/docs/building-a-dbt-project/testing-and-documentation/f2221dc-Screen_Shot_2018-08-14_at_6.29.55_PM.png" title="Автоматически сгенерированная документация для модели dbt"/>

Здесь вы видите представление структуры проекта, markdown‑описание модели и список всех колонок модели с документацией.

На странице dbt Docs нажмите зелёную кнопку в правом нижнем углу страницы, чтобы развернуть «мини‑карту» вашего DAG. В этой панели отображаются непосредственные родители и потомки модели, которую вы изучаете.

<Lightbox src="/img/docs/building-a-dbt-project/testing-and-documentation/ec77c45-Screen_Shot_2018-08-14_at_6.31.56_PM.png" title="Открытие мини‑карты DAG"/>

В этом примере модель `fct_subscription_transactions` имеет только одного прямого родителя. Нажав кнопку **Expand** в правом верхнем углу окна, можно развернуть граф по горизонтали и увидеть полный <Term id="data-lineage">lineage</Term> модели. Этот lineage можно фильтровать с помощью флагов `--select` и `--exclude`, которые соответствуют семантике [model selection syntax](/reference/node-selection/syntax). Кроме того, вы можете щёлкнуть правой кнопкой мыши для взаимодействия с DAG, перехода к документации или обмена ссылками на визуализацию графа с коллегами.

<Lightbox src="/img/docs/building-a-dbt-project/testing-and-documentation/ac97fba-Screen_Shot_2018-08-14_at_6.35.14_PM.png" title="Полный lineage для модели dbt"/>

## Развёртывание сайта документации

Легко разворачивайте документацию в <Constant name="explorer" /> или dbt Docs, чтобы сделать её доступной для ваших команд.

:::caution Security

Команда `dbt docs serve` предназначена только для локального или dev‑хостинга сайта документации. Пожалуйста, используйте один из методов, перечисленных в следующем разделе (или аналогичный), чтобы обеспечить безопасный хостинг документации.

:::

### Каталог <Lifecycle status="self_service,managed,managed_plus" />

<Constant name="explorer" /> автоматически обновляет документацию после каждого production или staging job run, используя сгенерированные метаданные. Это означает, что документация всегда отражает актуальное состояние проекта и не требует ручного деплоя. Подробнее о том, как <Constant name="explorer" /> использует метаданные для автоматического обновления документации, см. [Generate metadata](/docs/explore/explore-projects#generate-metadata).

Чтобы узнать, как развернуть сайт документации, см. [Build and view your docs with <Constant name="cloud" />](/docs/explore/build-and-view-your-docs).

### Документация dbt Docs
dbt Docs изначально спроектирован так, чтобы его было легко размещать в вебе. Сайт является «статическим», то есть вам не нужны «динамические» серверы для его обслуживания. Вы можете разместить документацию несколькими способами:

* Разместить на [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) (при необходимости — [с ограничениями доступа по IP](https://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html#example-bucket-policies-use-case-3))
* Опубликовать с помощью [Netlify](https://discourse.getdbt.com/t/publishing-dbt-docs-to-netlify/121)
* Использовать собственный веб‑сервер, например Apache или Nginx
* Если вы используете план <Constant name="cloud" /> Developer, см. [Build and view your docs with <Constant name="cloud" />](/docs/explore/build-and-view-your-docs#dbt-docs), чтобы узнать, как развернуть сайт документации.

Если вы хотите использовать <Constant name="explorer" /> для полноценного опыта работы с документацией dbt, зарегистрируйтесь для бесплатного [trial <Constant name="cloud" />](https://www.getdbt.com/signup) или [свяжитесь с нами](https://www.getdbt.com/contact).
