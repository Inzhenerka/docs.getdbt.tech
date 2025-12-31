---
title: "Исправление предупреждений об устаревании"
description: "Узнайте, как использовать инструмент autofix в Studio IDE для обновления кода проекта."
sidebar_label: "Исправление устареваний"
---


Вы можете устранить предупреждения об устаревании в <Constant name="dbt_platform" />, найдя и исправив их с помощью инструмента autofix в <Constant name="cloud_ide" />. Вы можете запускать инструмент autofix на [совместимой или последней ветке релизов](/docs/dbt-versions/cloud-release-tracks) <Constant name="core" /> перед обновлением до Fusion!

Чтобы найти и исправить устаревания:

1. Перейдите в <Constant name="cloud_ide" />, нажав **Studio** в левом меню.
2. Перед продолжением обязательно сохраните и закоммитьте свою работу. Инструмент autofix может перезаписать любые несохранённые изменения.
3. Нажмите на меню с тремя точками в правом нижнем углу <Constant name="cloud_ide" />.
4. Выберите **Check & fix deprecations**.
     <Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-options-menu-with-save.png" width="90%" title="Доступ к меню параметров Studio IDE для автоматического исправления предупреждений об устаревании"/>
        Инструмент выполняет команду `dbt parse —show-all-deprecations —no-partial-parse`, чтобы найти устаревания в вашем проекте.
5. Если вы не видите список устареваний и кнопку **Autofix warnings**, откройте историю команд в левом нижнем углу:
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/command-history.png" width="90%" title="Доступ к недавним командам, чтобы увидеть кнопку autofix"/>
6. Когда откроется история команд, нажмите кнопку **Autofix warnings**:
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/autofix-button.png" width="90%" title="Просмотр устареваний, которые необходимо автоматически исправить"/>
7. Когда откроется диалоговое окно **Proceed with autofix**, нажмите **Continue**, чтобы начать устранение устареваний в проекте и запустить повторный parse для отображения оставшихся устареваний.
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/proceed-with-autofix.png" width="90%" title="Запуск автоматического исправления"/> 
8. После завершения появится сообщение об успешном выполнении. Нажмите **Review changes**, чтобы проверить внесённые изменения.
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/autofix-success.png" width="90%" title="Успешное выполнение"/>
9. Нажмите **Commit and sync** в левом верхнем углу <Constant name="cloud_ide" />, чтобы закоммитить эти изменения в репозиторий проекта.
10. Теперь вы готовы включить Fusion, если вы [соответствуете требованиям](/docs/fusion/supported-features#requirements)!

## Связанные документы {#related-docs}

- [Руководство по быстрому старту](/guides)
- [О <Constant name="cloud" />](/docs/cloud/about-cloud/dbt-cloud-features)
- [Разработка в облаке](/docs/cloud/studio-ide/develop-in-studio)
