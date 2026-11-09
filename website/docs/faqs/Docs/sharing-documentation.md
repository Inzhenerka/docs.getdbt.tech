---
title: Как получить доступ к документации в dbt Catalog?
description: "Используйте места с доступом только для чтения, чтобы делиться документацией"
sidebar_label: 'Доступ к документации в dbt Catalog'
id: sharing-documentation
---

Если вы используете <Constant name="dbt" /> для развертывания проекта и у вас [тарифный план Starter, Enterprise или Enterprise+](https://www.getdbt.com/pricing/), вы можете использовать <Constant name="catalog" /> для просмотра [ресурсов](/docs/build/projects) проекта (таких как модели, тесты и метрики) и их <Term id="data-lineage">происхождения и связей</Term>, чтобы лучше понимать текущее состояние проекта в промышленной среде. 

Чтобы открыть <Constant name="catalog" /> в <Constant name="dbt" />, нажмите ссылку **Catalog** в меню навигации. Пользователи с доступом только для чтения могут просматривать документацию вашего проекта &mdash; сведения о доступности лицензий в зависимости от тарифного плана см. на странице [тарифов dbt](https://www.getdbt.com/pricing).

Пользователи тарифного плана Developer в <Constant name="dbt" /> и пользователи <Constant name="core" /> могут использовать [dbt Docs](/docs/explore/build-and-view-your-docs?version=1.12#dbt-docs): этот инструмент создает базовую документацию, но не обеспечивает такую же скорость работы, объем метаданных и наглядность, как <Constant name="catalog" />.
