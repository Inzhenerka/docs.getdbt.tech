---
title: "О Studio IDE"
id: about-studio-ide
description: "Об интегрированной среде разработки dbt Studio"
sidebar_label: О dbt Studio IDE
availability:
  surface: platform
  access: login_required
---

Интегрированная среда разработки <Constant name="dbt" /> (<Constant name="studio_ide" />) — это единый интерфейс для разработки, тестирования, запуска и управления версиями проектов dbt прямо в браузере. С помощью облачной <Constant name="studio_ide" /> вы можете компилировать код dbt в SQL и выполнять его непосредственно в своей базе данных.

С помощью облачной <Constant name="studio_ide" /> вы можете:

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

<Lightbox src="/img/docs/dbt-platform/platform-ide/cloud-ide-v2.png" width="85%" title="Studio IDE в тёмной теме"/>

Для получения дополнительной информации прочитайте полное [руководство по Cloud <Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio).

## Связанные документы {#related-docs}

- [Пользовательский интерфейс <Constant name="studio_ide" />](/docs/platform/studio-ide/ide-user-interface)
- [Сочетания клавиш](/docs/platform/studio-ide/keyboard-shortcuts)
