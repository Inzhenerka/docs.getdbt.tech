---
title: "Обзор устаревших возможностей и предупреждений"
id: "changes-overview"
sidebar_label: "Устаревшие возможности и предупреждения"
description: "Краткий справочник по устаревшим возможностям, изменениям поведения и устаревшим флагам в dbt"
hide_table_of_contents: true
---

При работе с dbt вы можете столкнуться с предупреждениями или другими изменениями, требующими вашего внимания. Эти изменения помогают нам развивать dbt и улучшать работу с ним для всех пользователей. 

На этой странице описаны различные типы изменений, необходимые действия и источники дополнительной информации.

<div className="grid--3-col">

<Card
  title="Устаревшие возможности"
  body="Возможности, используемые в коде вашего проекта (моделях, YAML, макросах), которые пока работают, но будут удалены.<br/><br/><strong>Влияние:</strong> Сейчас вызывают предупреждения; в будущих версиях будут вызывать ошибки.<br/><br/><strong>Действие:</strong> Обновите код проекта, чтобы использовать новый синтаксис."
  link="/reference/deprecations"
  icon="dbt-bit"
/>

<Card
  title="Флаги изменения поведения"
  body="Настройки в файле dbt_project.yml, которые позволяют включать или отключать новое поведение в переходные периоды.<br/><br/><strong>Влияние:</strong> Определяют, использует ли dbt старое или новое поведение; значения по умолчанию со временем меняются.<br/><br/><strong>Действие:</strong> Настройте флаги, чтобы выбрать момент перехода на новое поведение."
  link="/reference/global-configs/behavior-changes"
  icon="dbt-bit"
/>

<Card
  title="Устаревшие флаги CLI"
  body="Флаги командной строки, передаваемые командам dbt, которые будут удалены в dbt v2.<br/><br/><strong>Влияние:</strong> Некоторые игнорируются (с предупреждениями); флаг <strong>--models</strong> будет вызывать ошибку в dbt v2.<br/><br/><strong>Действие:</strong> Обновите определения заданий и скрипты, чтобы удалить или заменить эти флаги."
  link="/docs/dbt-versions/dbt-upgrade/upgrading-to-v2#deprecated-flags"
  icon="square-terminal"
/>

</div>

## Подготовка к переходу на <Constant name="fusion" />

Если вы переходите на <Constant name="fusion" />, вам следует:

- [ ] Устранить использование всех [устаревших возможностей](/reference/deprecations), чтобы избежать ошибок в <Constant name="fusion" />.
- [ ] Изучить [флаги изменения поведения](/reference/global-configs/behavior-changes#behavior-change-flags) и столбец **Removed**, чтобы узнать, какие флаги всегда включены в <Constant name="fusion" />, а какие по-прежнему можно настраивать.
- [ ] Обновить используемые [устаревшие флаги CLI](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2#deprecated-flags), чтобы избежать ошибок в <Constant name="fusion" />.

## Связанная документация

- [Полный список устаревших возможностей](/reference/deprecations)
- [Флаги изменения поведения](/reference/global-configs/behavior-changes)
- [Переход на <Constant name="fusion" />](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2)
- [Контрольный список готовности к <Constant name="fusion" />](/docs/dbt/dbt-readiness)
- [События и журналирование](/reference/events-logging)
