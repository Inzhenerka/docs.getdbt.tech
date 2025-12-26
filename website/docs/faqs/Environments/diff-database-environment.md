---
title: Могу ли я установить другое подключение на уровне окружения?
description: "Отдельные проекты для разных окружений как обходное решение"
sidebar_label: 'Установить разные подключения к базе данных на уровне окружения'
id: diff-database-environment
---

<Constant name="cloud" /> поддерживает [Connections](/docs/cloud/connect-data-platform/about-connections#connection-management), которые доступны всем пользователям <Constant name="cloud" />. Connections позволяют использовать разные подключения к платформам данных для разных окружений, устраняя необходимость дублировать проекты. Проекты могут использовать несколько подключений только одного и того же типа хранилища данных. Connections являются переиспользуемыми между проектами и окружениями.

В dbt Core вы можете поддерживать отдельные production- и development-окружения с помощью [`targets`](/reference/dbt-jinja-functions/target), определённых в [profile](/docs/core/connect-data-platform/profiles.yml). Пользователи dbt Core могут задавать разные targets в файле profiles.yml, что означает возможность иметь targets для разных хранилищ данных в рамках одного и того же профиля.
