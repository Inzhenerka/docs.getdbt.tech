---
title: "О Fusion"
sidebar_label: "О Fusion"
id: "about-fusion"
description: "Fusion — это движок нового поколения для dbt."
---

# О движке dbt Fusion

<IntroText>

dbt — это отраслевой стандарт для трансформации данных. <Constant name="fusion_engine" /> позволяет dbt работать с беспрецедентной скоростью и масштабируемостью.
</IntroText>

<VersionBlock lastVersion="1.99">

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

</VersionBlock>

<Constant name="fusion_engine" /> использует тот же знакомый фреймворк для написания трансформаций данных, что и <Constant name="core" />, но при этом позволяет разработчикам данных работать быстрее и более эффективно развёртывать нагрузки трансформаций.

### Что такое Fusion

Fusion — это полностью новый программный продукт, написанный на другом языке программирования (Rust), чем <Constant name="core" /> (Python). Fusion значительно быстрее, чем <Constant name="core" />, и нативно понимает SQL в диалектах различных движков. Со временем Fusion будет поддерживать весь фреймворк dbt Core, включая надмножество его возможностей, а также подавляющее большинство существующих проектов dbt.

Fusion содержит смесь source-available, проприетарного и open source кода. Это означает, что:
- dbt Labs публикует значительную часть исходного кода в репозитории [`dbt-fusion`](https://github.com/dbt-labs/dbt-fusion), где вы можете изучать код и участвовать в обсуждениях сообщества.
- Некоторые возможности Fusion доступны исключительно платным клиентам облачной [платформы dbt](https://www.getdbt.com/signup). Подробнее см. в разделе [поддерживаемые возможности](/docs/fusion/supported-features#paid-features).

Подробнее о лицензировании движка dbt Fusion можно прочитать [здесь](http://www.getdbt.com/licenses-faq).

## Зачем использовать Fusion

Для разработчика Fusion позволяет:
- Мгновенно обнаруживать некорректный SQL в моделях dbt
- Просматривать встроенные <Term id="cte">CTE</Term> для более быстрого отладки
- Отслеживать определения моделей и колонок по всему проекту dbt

Всё это и многое другое доступно в [расширении dbt для VSCode](/docs/about-dbt-extension), в основе которого лежит Fusion.

Fusion также обеспечивает более эффективное развёртывание больших DAG. Отслеживая, какие колонки где используются и в каких исходных таблицах появились свежие данные, Fusion может гарантировать, что модели будут пересобраны только тогда, когда им действительно нужно обработать новые данные. Такая ["оркестрация с учётом состояния"](/docs/deploy/state-aware-about) является возможностью платформы dbt (ранее dbt Cloud).

### Управление потоками

<Constant name="fusion_engine" /> управляет параллелизмом иначе, чем <Constant name="core" />. Вместо того чтобы рассматривать параметр `threads` как жёсткое ограничение на количество параллельных операций, Fusion динамически оптимизирует параллелизм в зависимости от выбранного хранилища данных.

В Redshift параметр `threads` ограничивает количество запросов или операторов, которые могут выполняться параллельно, что важно для управления лимитами конкурентности Redshift. В других хранилищах Fusion динамически регулирует использование потоков в зависимости от возможностей конкретного хранилища, используя вашу конфигурацию потоков как ориентир и автоматически оптимизируя выполнение для максимальной эффективности.

Подробнее см. в разделе [Using threads](/docs/running-a-dbt-project/using-threads#fusion-engine-thread-behavior).

### Как использовать Fusion
 
Вы можете:
- Выбрать Fusion в [выпадающем списке/переключателе на платформе dbt](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine) <Lifecycle status="private_preview" />
- [Установить расширение dbt для VSCode](/docs/install-dbt-extension) <Lifecycle status="preview" />
- [Установить Fusion CLI](/docs/fusion/install-fusion-cli) <Lifecycle status="preview" />

Сразу переходите к разделу [Quickstart](/guides/fusion), чтобы как можно быстрее _почувствовать Fusion_.

## Что дальше?

dbt Labs запустила движок dbt Fusion в статусе публичной беты 28 мая 2025 года и планирует достичь полного паритета возможностей с <Constant name="core" /> до [общей доступности Fusion](/blog/dbt-fusion-engine-path-to-ga).

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
