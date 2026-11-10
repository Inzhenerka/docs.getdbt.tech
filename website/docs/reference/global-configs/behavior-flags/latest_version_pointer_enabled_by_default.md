---
title: "Указатель на последнюю версию для версионируемых моделей"
id: "latest_version_pointer_enabled_by_default"
sidebar_label: "Указатель на последнюю версию включён по умолчанию"
---

| latest_version_pointer_enabled_by_default | <Constant name="dbt" /> **v1 Latest** | <Constant name="core" /> | <Constant name="fusion" /> |
|---|---|---|---|
| Добавлен | 2026.5 | 1.12.0 | Ранняя предварительная версия |
| Стабилизирован (по умолчанию → `true`) | — | — | Уже `true` |
| Удалён | — | — | — |

В <Constant name="core_v1" /> флаг `latest_version_pointer_enabled_by_default` по умолчанию имеет значение `false`. В <Constant name="fusion" /> этот флаг по умолчанию имеет значение `true`, что автоматически включает указатель на последнюю версию для всех версионируемых моделей.

Если установить значение `true`, dbt автоматически создаёт представление — [указатель на последнюю версию](/docs/mesh/govern/model-versions#pointing-to-the-latest-version) — для каждой версионируемой модели в проекте, без необходимости настраивать каждую модель отдельно. Представление-указатель получает базовое имя модели (например, `dim_customers`) и всегда указывает на объект базы данных для модели с `is_latest_version: true` (например, `dim_customers_v2`).

Без этого флага необходимо включать указатель для каждой модели отдельно, задавая [`latest_version_pointer.enabled: true`](/reference/resource-configs/latest_version_pointer) в конфигурации модели.
