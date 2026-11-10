---
title: "Включение dbt State для сред и заданий"
sidebar_label: "Включение для сред и заданий"
description: "Включите dbt State для сред развертывания и отдельных заданий на платформе dbt."
id: "dbt-state-enable-env-jobs"
tags: ['dbt State']
availability: everywhere_usage
---

# Включение dbt State для сред и заданий

Узнайте, как включить [dbt State](/docs/deploy/dbt-state-about) для сред развертывания и отдельных заданий. Эта опция отображается только в том случае, если dbt State [включен для вашей учетной записи](/docs/deploy/dbt-state-setup).

## Включение dbt State для сред {#enabling-dbt-state-on-environments}

Вы можете включить [dbt State](/docs/deploy/dbt-state-about) на уровне среды, чтобы задания в этой среде автоматически наследовали эту настройку.

При включении dbt State для среды развертывания (production, staging или general):
- Для новых заданий по умолчанию выбирается значение **Inherited from environment**, и dbt State включается без дополнительной настройки.
- Существующие задания не обновляются автоматически. Необходимо [настроить каждое задание вручную](#enabling-dbt-state-on-individual-jobs).

<!-- TODO (ORC-4324): После выпуска этого изменения заменить на:
- Существующие задания, у которых для **dbt State** выбрано значение **Off**, автоматически переключаются на **Inherited from environment**, что включает dbt State для этих заданий.
-->

Чтобы включить dbt State для среды развертывания:

1. Перейдите в **Orchestration** > **Environments**.
2. Выберите среду, для которой хотите включить dbt State.
3. Нажмите **Settings** > **Edit**.
3. В разделе **dbt State** выберите **Enable dbt State**.
5. Нажмите **Save**.

Для сред разработки см. раздел [Включение dbt State в Studio](/docs/deploy/dbt-state-enable-studio).

## Включение dbt State для отдельных заданий {#enabling-dbt-state-on-individual-jobs}

dbt State доступен для всех типов заданий: развертывания, непрерывной интеграции (CI) и слияния. В настройках выполнения каждого задания есть раскрывающийся список **dbt State** со значениями **On**, **Off** и **Inherited from environment**. Для новых заданий по умолчанию выбирается значение **Inherited from environment** &mdash; дополнительная настройка не требуется, если dbt State включен для среды.

Для существующих заданий по умолчанию выбрано значение **Off**. Чтобы они использовали настройку среды, необходимо настроить каждое задание вручную.

<!-- TODO (ORC-4324): После выпуска этого изменения заменить на:

dbt State доступен для всех типов заданий: развертывания, непрерывной интеграции (CI) и слияния. В настройках выполнения каждого задания есть раскрывающийся список **dbt State** со значениями **On**, **Off** и **Inherited from environment**.

При включении dbt State для среды развертывания:
- Для новых заданий по умолчанию выбирается значение **Inherited from environment**, и dbt State включается автоматически.
- Существующие задания, у которых для **dbt State** выбрано значение **Off**, автоматически переключаются на **Inherited from environment**, что включает dbt State для этих заданий.
-->

Чтобы включить dbt State для отдельных заданий:

1. Перейдите в **Orchestration** > **Jobs**.
2. Выберите задание, для которого хотите включить dbt State.
3. Нажмите **Settings** > **Edit**.
4. В разделе **Execution settings** выберите в раскрывающемся списке **dbt State** значение **On**, чтобы явно включить эту функцию, или **Inherited from environment**, чтобы использовать настройку среды. Если вы выбираете **Inherited from environment**, сначала убедитесь, что dbt State [включен для среды](#enabling-dbt-state-on-environments) &mdash; иначе задание унаследует отключенное состояние.
5. Нажмите **Save**.

:::note
dbt State и State-aware orchestration являются взаимоисключающими функциями. При выборе **Inherited from environment** или **On** автоматически снимается флажок **State-aware orchestration**, а при включении **State-aware orchestration** для **dbt State** устанавливается значение **Off**.
:::

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
- [Включение dbt State в Studio](/docs/deploy/dbt-state-enable-studio)
