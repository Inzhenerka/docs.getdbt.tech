---
title: "About Studio IDE"
id: about-cloud-ide
description: "about dbt Studio Integrated Development Environment"
sidebar_label: About dbt Studio IDE
---

Интегрированная среда разработки <Constant name="cloud" /> (<Constant name="cloud_ide" />) — это единый интерфейс для создания, тестирования, запуска и управления версиями dbt‑проектов прямо из браузера. С помощью Cloud <Constant name="cloud_ide" /> вы можете компилировать dbt‑код в SQL и выполнять его непосредственно в вашей базе данных.

С помощью Cloud <Constant name="cloud_ide" /> вы можете:

- Писать модульные SQL-модели с использованием операторов select и функции ref(),
- Компилировать код dbt в SQL и выполнять его непосредственно в вашей базе данных,
- Тестировать каждую модель перед их развертыванием в производственной среде,
- Генерировать и просматривать документацию вашего проекта dbt,
- Использовать git и контролировать версии вашего кода из браузера в пару кликов,
- Создавать и тестировать модели на Python:
    * Компилировать модели на Python, чтобы увидеть полную функцию, которая выполняется на вашей платформе данных
    * Видеть модели на Python в DAG в dbt версии 1.3 и выше
    * В настоящее время вы не можете предварительно просматривать модели на Python
- Визуализировать ориентированный ациклический граф (DAG) и многое другое.

<Lightbox src src="/img/docs/dbt-cloud/cloud-ide/cloud-ide-v2.png" width="85%" title="The Studio IDE in dark mode"/>

Для получения дополнительной информации прочитайте полное [руководство по Cloud <Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio).

## Связанные документы

- [<Constant name="cloud_ide" /> пользовательский интерфейс](/docs/cloud/studio-ide/ide-user-interface)
- [Сочетания клавиш](/docs/cloud/studio-ide/keyboard-shortcuts)
