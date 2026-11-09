---
title: "О гибридных проектах"
sidebar_label: "О гибридных проектах"
description: "Узнайте, как загрузить артефакты dbt v1 на платформу dbt для создания и настройки гибридных проектов."
pagination_next: "docs/deploy/hybrid-setup"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# О гибридных проектах

<IntroText>
Гибридные проекты позволяют вашей организации использовать взаимодополняющие рабочие процессы <Constant name="core" /> и <Constant name="dbt" /> (когда одни команды развертывают проекты в <Constant name="core" />, а другие — в <Constant name="dbt" />) и бесшовно интегрировать эти процессы благодаря автоматической загрузке [артефактов](/reference/artifacts/dbt-artifacts) <Constant name="core" /> в <Constant name="dbt" />.
</IntroText>

:::tip Доступно в общедоступной предварительной версии
Гибридные проекты доступны в общедоступной предварительной версии для [аккаунтов <Constant name="dbt" /> Enterprise](https://www.getdbt.com/pricing).
:::

Пользователи <Constant name="core" /> могут без труда загружать [артефакты](/reference/artifacts/dbt-artifacts), такие как [run results.json](/reference/artifacts/run-results-json), [manifest.json](/reference/artifacts/manifest-json), [catalog.json](/reference/artifacts/catalog-json), [sources.json](/reference/artifacts/sources-json) и другие, в <Constant name="dbt" /> после выполнения запуска в интерфейсе командной строки (CLI) <Constant name="core" />, что открывает следующие возможности:

- Совместная работа с пользователями <Constant name="dbt" /> и <Constant name="core" />: они могут визуализировать модели dbt из проектов <Constant name="core" /> и создавать [межпроектные ссылки](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) на эти модели.
- (Скоро) Новые пользователи, заинтересованные в [<Constant name="canvas" />](/docs/platform/canvas), смогут использовать в качестве основы модели dbt, уже созданные центральной командой по работе с данными в <Constant name="core" />, вместо того чтобы начинать с нуля.
- Пользователи <Constant name="core" /> и <Constant name="dbt" /> могут перейти в [<Constant name="catalog" />](/docs/explore/explore-projects) и просматривать свои модели и ресурсы. Для просмотра <Constant name="catalog" /> необходимо [пользовательское место с доступом только для чтения](/docs/platform/manage-access/seats-and-users).

## Предварительные требования {#prerequisites}

Чтобы загружать артефакты, убедитесь, что выполнены следующие условия:

- Ваша организация использует [тариф <Constant name="dbt" /> Enterprise+](https://www.getdbt.com/pricing)
- Ваша учетная запись на платформе dbt использует [каналы выпуска](/docs/dbt-versions/dbt-release-tracks), а ваш проект настроен на [последнюю поддерживаемую версию](/docs/dbt-versions) dbt.
- Вы [настроили](/docs/deploy/hybrid-setup#create-hybrid-project) гибридный проект в <Constant name="dbt" />.
- Вы обновили существующий проект <Constant name="core" />, включив последние изменения, и [настроили доступ к моделям](/docs/deploy/hybrid-setup#make-dbt-models-public):
    - Убедитесь, что в конфигурации моделей, которыми вы хотите поделиться с другими проектами <Constant name="dbt" />, задано `access: public`. Это упрощает поиск моделей и их совместное использование
    - Узнайте больше о [модификаторах доступа](/docs/mesh/govern/model-access#access-modifiers) и настройке [параметра `access`](/reference/resource-configs/access)
- Обновите [права доступа в <Constant name="dbt" />](/docs/platform/manage-access/enterprise-permissions), чтобы создать новый проект в <Constant name="dbt" />

**Примечание:** Загрузка артефактов не занимает слоты запуска <Constant name="dbt" />.
