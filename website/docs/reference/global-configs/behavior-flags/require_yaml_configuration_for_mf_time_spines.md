---
title: "YAML-конфигурация временной шкалы MetricFlow"
id: "require_yaml_configuration_for_mf_time_spines"
sidebar_label: "Требование YAML-конфигурации для временных шкал MetricFlow"
---

:::caution Удалён в v2

Этот флаг удалён в v2. Новое поведение теперь включено всегда. При обновлении удалите этот флаг из `dbt_project.yml`.

:::



| require_yaml_configuration_for_mf_time_spines | <Constant name="dbt" /> **Последняя версия v1** | <Constant name="core" /> |
|---|---|---|
| Добавлен | 2024.10 | 1.9.0 |
| Стабилизирован (по умолчанию → `true`) | 2026.09 | 1.12.0 |
| Удалён | — | v2.0 |

<br />

В предыдущих версиях (<Constant name="dbt" /> 1.8 и более ранних) конфигурация временной шкалы MetricFlow хранилась в файле `metricflow_time_spine.sql`.

Начиная с <Constant name="dbt" /> v1.12, этот флаг по умолчанию имеет значение `true`, что подавляет предупреждение об устаревании `MFTimespineWithoutYamlConfigurationDeprecation`. Прежняя конфигурация в SQL-файле продолжает работать при обоих значениях флага.

YAML-файл свойств MetricFlow должен содержать поле `time_spine:`. Подробнее см. в разделе [Временная шкала MetricFlow](/docs/build/metricflow-time-spine).

## Влияние

Этот флаг не влияет на функциональность; прежняя модель временной шкалы продолжает работать при обоих значениях флага. Единственные видимые изменения:

- Предупреждение `MFTimespineWithoutYamlConfigurationDeprecation` больше не появляется в логах.
- Если вы используете `--warn-error`, это предупреждение больше не возникает и, соответственно, не преобразуется в ошибку.

<Expandable alt_header="Отключение этого флага">

Для большинства проектов никаких действий не требуется. Прежняя модель `metricflow_time_spine.sql` продолжает работать как с этим флагом, так и без него.

Если вы полагаетесь на предупреждение `MFTimespineWithoutYamlConfigurationDeprecation` при использовании `--warn-error`, чтобы обеспечить обязательный переход на YAML, вы можете отключить новое поведение, установив для флага значение `false` в `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
flags:
  require_yaml_configuration_for_mf_time_spines: false
```

</File>

Чтобы навсегда устранить предупреждение об устаревании, перенесите конфигурацию из `metricflow_time_spine.sql` в YAML-блок `time_spine` внутри записи модели в `models:`. Актуальный синтаксис см. в разделе [Временная шкала MetricFlow](/docs/build/metricflow-time-spine).

</Expandable>
