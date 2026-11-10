---
title: "Конфигурация анализов на уровне проекта"
id: "require_corrected_analysis_fqns"
sidebar_label: "require_corrected_analysis_fqns"
---

import AnalysesProjectLevelConfig from '/snippets/_analyses-project-level-config.md';

| require_corrected_analysis_fqns | <Constant name="dbt" /> **v1 Latest** | <Constant name="core" /> |
|---|---|---|
| Введён | 2026.3 | 1.12.0 |
| Стабилизирован (по умолчанию → `true`) | — | — |
| Удалён | — | — |

Ранее конфигурация [анализов](/docs/build/analyses) на уровне проекта в `dbt_project.yml` игнорировалась без предупреждения. Полные имена (FQN) анализов также содержали дополнительный сегмент пути `analyses`, что не соответствовало формату имён других типов ресурсов.

Когда для `require_corrected_analysis_fqns` установлено значение `true`, dbt:
- Применяет настройки анализов из блока `analyses` в `dbt_project.yml`, благодаря чему конфигурация на уровне проекта вступает в силу.
- Удаляет дополнительный сегмент FQN, чтобы полные имена анализов соответствовали формату имён других типов ресурсов (например, `your_project.my_analysis` вместо `your_project.analyses.my_analysis`).

<AnalysesProjectLevelConfig />

<File name='dbt_project.yml'>

```yaml
flags:
  require_corrected_analysis_fqns: true

analyses:
  +enabled: true | false
```
</File>

Дополнительную информацию см. в разделах [Анализы](/docs/build/analyses) и [Свойства анализов](/reference/analysis-properties).
