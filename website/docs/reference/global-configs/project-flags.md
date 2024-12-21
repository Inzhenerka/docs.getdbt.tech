---
title: "Флаги проекта"
id: "project-flags"
sidebar: "Флаги проекта"
---

<File name='dbt_project.yml'>

```yaml

flags:
  <global_config>: <value>

```

</File>

Обратитесь к [таблице всех флагов](/reference/global-configs/about-global-configs#available-flags), чтобы увидеть, какие глобальные конфигурации доступны для установки в [`dbt_project.yml`](/reference/dbt_project.yml).

Словарь `flags` — это _единственное_ место, где вы можете отказаться от [изменений поведения](/reference/global-configs/behavior-changes), пока поддерживается устаревшее поведение.

<VersionBlock lastVersion="1.7">

:::warning Устаревшая функциональность
В более старых версиях dbt пользовательские значения по умолчанию для флагов (глобальных конфигураций) устанавливались в `profiles.yml`. Начиная с версии 1.8, эти конфигурации устанавливаются в `dbt_project.yml`.
:::

Для большинства глобальных конфигураций вы можете установить конфигурации "пользовательского профиля" в блоке `config:` файла `profiles.yml`. Этот стиль конфигурации задает значения по умолчанию для всех проектов, использующих этот каталог профилей &mdash; обычно, для всех проектов, выполняющихся на вашем локальном компьютере.

<File name='profiles.yml'>

```yaml

config:
  <THIS-CONFIG>: true

```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.7">

Исключение: Некоторые глобальные конфигурации на самом деле устанавливаются в `dbt_project.yml`, а не в `profiles.yml`, потому что они контролируют, где dbt размещает логи и артефакты. Эти пути к файлам всегда относительны к расположению `dbt_project.yml`. Для получения более подробной информации обратитесь к [Пути логов и целей](/reference/global-configs/logs#log-and-target-paths).

</VersionBlock>