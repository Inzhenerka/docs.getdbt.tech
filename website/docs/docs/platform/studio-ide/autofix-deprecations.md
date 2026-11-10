---
title: "Исправление предупреждений об устаревании"
description: "Узнайте, как использовать инструмент autofix в Studio IDE для обновления кода проекта."
sidebar_label: "Исправление устареваний"
availability:
  surface: platform
  access: login_required
---


Вы можете устранить предупреждения об устаревших возможностях в <Constant name="dbt_platform" />, найдя и исправив их с помощью инструмента автоматического исправления в <Constant name="studio_ide" />. Вы можете запустить инструмент автоматического исправления в [канале выпуска **v1 Compatible** или **v1 Latest**](/docs/dbt-versions/dbt-release-tracks) для <Constant name="core" /> перед переходом на <Constant name="fusion" />!

Чтобы найти и исправить устаревания:

1. Перейдите в <Constant name="studio_ide" />, нажав **Studio** в левом меню.
2. Перед продолжением обязательно сохраните и закоммитьте свою работу. Инструмент autofix может перезаписать любые несохранённые изменения.
3. Нажмите на меню с тремя точками в правом нижнем углу <Constant name="studio_ide" />.
4. Выберите **Check & fix deprecations**.
     <Lightbox src="/img/docs/dbt-platform/platform-ide/ide-options-menu-with-save.png" width="90%" title="Откройте меню параметров Studio IDE для автоматического устранения предупреждений об устаревших возможностях"/>
        Инструмент выполняет команду `dbt parse —show-all-deprecations —no-partial-parse`, чтобы найти устаревания в вашем проекте.
5. Если вы не видите список устареваний и кнопку **Autofix warnings**, откройте историю команд в левом нижнем углу:
    <Lightbox src="/img/docs/dbt-platform/platform-ide/command-history.png" width="90%" title="Откройте последние команды, чтобы увидеть кнопку автоматического исправления"/>
6. Когда откроется история команд, нажмите кнопку **Autofix warnings**:
    <Lightbox src="/img/docs/dbt-platform/platform-ide/autofix-button.png" width="90%" title="Узнайте, какие устаревшие возможности требуют автоматического исправления"/>
7. Когда откроется диалоговое окно **Proceed with autofix**, нажмите **Continue**, чтобы начать устранение устареваний в проекте и запустить повторный parse для отображения оставшихся устареваний.
    <Lightbox src="/img/docs/dbt-platform/platform-ide/proceed-with-autofix.png" width="90%" title="Продолжите автоматическое исправление"/>
8. После завершения появится сообщение об успешном выполнении.

    <VersionBlock lastVersion="1.99">
    Нажмите **Просмотреть изменения**, чтобы проверить изменения.
    <Lightbox src="/img/docs/dbt-platform/platform-ide/autofix-success.png" width="90%" title="Success"/>
    </VersionBlock>

    <VersionBlock firstVersion="2.0">
    После успешного выполнения команды `dbt parse` справа от результата **Успешно исправлено** появится кнопка **Скомпилировать**. Используйте **Скомпилировать**, чтобы скомпилировать проект из панели результатов. 
    <Lightbox src="/img/docs/dbt-platform/platform-ide/autofix-success-v2-compile.png" width="90%" title="Успешное автоматическое исправление с компиляцией в процессе v2"/>

    В случае успеха вы увидите результат **Успешно скомпилировано**. Если появятся ошибки, изучите их и внесите необходимые изменения.
    </VersionBlock>

9. Нажмите **Commit and sync** в левом верхнем углу <Constant name="studio_ide" />, чтобы закоммитить эти изменения в репозиторий проекта.
10. Теперь вы готовы включить <Constant name="fusion" />, если [выполнены требования](/docs/dbt/supported-features#requirements)!

## Связанные документы {#related-docs}

- [Руководство по быстрому старту](/guides)
- [About <Constant name="dbt" />](/docs/platform/about-platform/dbt-platform-features)
- [Разработка в облаке](/docs/platform/studio-ide/develop-in-studio)
