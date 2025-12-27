---
title: "О гибридных проектах"
sidebar_label: "О гибридных проектах"
description: "Узнайте, как загружать артефакты dbt Core в dbt platform, чтобы создавать и настраивать hybrid‑проекты."
pagination_next: "docs/deploy/hybrid-setup"
---

# О гибридных проектах <Lifecycle status='managed_plus'/>

<IntroText>
Гибридные проекты позволяют вашей организации использовать дополняющие друг друга рабочие процессы <Constant name="core" /> и <Constant name="cloud" /> (когда одни команды деплоят проекты в <Constant name="core" />, а другие — в <Constant name="cloud" />) и бесшовно интегрировать эти процессы за счёт автоматической загрузки [артефактов](/reference/artifacts/dbt-artifacts) <Constant name="core" /> в <Constant name="cloud" />.
</IntroText>

:::tip Доступно в публичном превью
Гибридные проекты доступны в публичном превью для [аккаунтов <Constant name="cloud" /> Enterprise](https://www.getdbt.com/pricing).
:::

Пользователи <Constant name="core" /> могут без проблем загружать [артефакты](/reference/artifacts/dbt-artifacts), такие как [run results.json](/reference/artifacts/run-results-json), [manifest.json](/reference/artifacts/manifest-json), [catalog.json](/reference/artifacts/catalog-json), [sources.json](/reference/artifacts/sources-json) и другие &mdash; в <Constant name="cloud" /> после выполнения запуска в интерфейсе командной строки (CLI) <Constant name="core" />, что позволяет:

- Совместно работать пользователям <Constant name="cloud" /> и <Constant name="core" />, давая им возможность визуализировать и использовать [кросс-проектные ссылки](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) на dbt-модели, которые находятся в проектах Core.
- (Скоро) Новым пользователям, заинтересованным в [<Constant name="visual_editor" />](/docs/cloud/canvas), строить решения на основе dbt-моделей, уже созданных центральной командой данных в <Constant name="core" />, вместо того чтобы начинать с нуля.
- Пользователям <Constant name="core" /> и <Constant name="cloud" /> переходить в [<Constant name="explorer" />](/docs/explore/explore-projects) и просматривать свои модели и ассеты. Для доступа к <Constant name="explorer" /> необходима [лицензия только для чтения](/docs/cloud/manage-access/seats-and-users).

## Предварительные требования

Чтобы загружать артефакты, убедитесь, что выполнены следующие условия:

- Ваша организация использует тариф [<Constant name="cloud" /> Enterprise+](https://www.getdbt.com/pricing)
- Вы используете [release tracks <Constant name="cloud" />](/docs/dbt-versions/cloud-release-tracks), а ваш проект <Constant name="core" /> работает на dbt версии 1.10 или выше
- Вы [настроили](/docs/deploy/hybrid-setup#connect-project-in-dbt-cloud) гибридный проект в <Constant name="cloud" />
- Вы обновили существующий проект <Constant name="core" /> с учётом последних изменений и [настроили в нём доступ к моделям](/docs/deploy/hybrid-setup#make-dbt-core-models-public):
    - Убедитесь, что модели, которыми вы хотите делиться с другими проектами <Constant name="cloud" />, используют `access: public` в конфигурации модели. Это делает модели более доступными для обнаружения и повторного использования
    - Подробнее об [модификаторе доступа](/docs/mesh/govern/model-access#access-modifiers) и о том, как задать конфигурацию [`access`](/reference/resource-configs/access)
- Обновите [права доступа <Constant name="cloud" />](/docs/cloud/manage-access/enterprise-permissions), чтобы иметь возможность создавать новый проект в <Constant name="cloud" />

**Примечание:** Загрузка артефактов не расходует слоты запусков <Constant name="cloud" />.
