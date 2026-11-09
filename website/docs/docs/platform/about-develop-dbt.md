---
title: Разработка с помощью dbt
id: about-develop-dbt
description: "Узнайте, как разрабатывать проекты dbt с помощью dbt."
sidebar_label: "Разработка с dbt" 
pagination_next: "docs/platform/about-defer"
intro_text: "Develop dbt projects using the dbt platform, a faster and more reliable way to deploy dbt and manage your project in a single, web-based UI."
hide_table_of_contents: true
---

Вы можете разрабатывать в браузере, используя интерфейс командной строки (CLI) на базе <Constant name="dbt" />, интегрированную среду разработки (<Constant name="studio_ide" />) или <Constant name="canvas" />.

## Начало работы {#getting-started}

Для начала вам понадобятся учетная запись [<Constant name="dbt" />](https://www.getdbt.com/signup) и лицензия разработчика. Более подробные инструкции по разработке в dbt вы найдете в [руководствах по быстрому старту](/docs/get-started-dbt).

Выберите вариант, который лучше всего подходит для ваших задач:

<div className="grid--2-col" >

  <Card
title="CLI платформы dbt"
    body="Позволяет разрабатывать проекты и выполнять команды dbt из локальной командной строки или редактора кода в вашей среде разработки dbt."
    link="/docs/platform/dbt-cli-installation"
    icon="dbt-bit"/>

  <Card
    title="Расширение dbt для VS Code"
    body="Используйте скорость и интеллектуальные возможности dbt v2 в VS Code для удобной и непрерывной работы над проектами."
    link="/docs/about-dbt-extension"
    icon="vsce"
    showBorderBeam
    />

  <Card
    title="dbt Studio IDE"
body="Разрабатывайте проекты dbt прямо в браузере благодаря удобной компиляции SQL и интуитивно понятному визуальному рабочему процессу."
    link="/docs/platform/studio-ide/develop-in-studio"
    icon="dashboard"/>

   <Card
    title="dbt Canvas"
body="Разрабатывайте модели с помощью Canvas — удобного интерфейса с перетаскиванием элементов, который помогает аналитикам быстро создавать и визуализировать модели dbt в dbt."
    link="/docs/platform/canvas"
    icon="canvas"/>



</div><br />
