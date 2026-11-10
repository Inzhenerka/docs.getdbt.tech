---
title: "Настройка dbt State"
sidebar_label: "Настройка dbt State"
description: "Узнайте, как установить и настроить dbt State в dbt v1, dbt platform и dbt v2."
id: "dbt-state-setup"
tags: ['dbt State']
availability: everywhere_usage
---

import LagToleranceRecommendationsTip from '/snippets/_lag-tolerance-recommendations-tip.md';

# Настройка dbt State

На этой странице описана настройка dbt State в <Constant name="core" />, <Constant name="fusion" /> и <Constant name="dbt_platform" />.

## Предварительные требования

Перед настройкой dbt State убедитесь, что у вас есть:

- **Поддерживаемая версия dbt**: dbt State встроен в <Constant name="dbt_platform" />, <Constant name="fusion_engine" /> и dbt v1.13. Он также доступен в виде плагина для dbt v1.7–1.12.
- **Поддерживаемая платформа данных**: Snowflake, Databricks, BigQuery или Redshift. Поддержка других хранилищ запланирована.
- **Учётная запись dbt**: dbt State использует вашу учётную запись dbt для аутентификации, даже если вы запускаете dbt локально или в неинтерактивной среде, например в конвейерах CI/CD или внешнем оркестраторе. Информацию о регистрации см. в разделе [О dbt State](/docs/deploy/dbt-state-about#signing-up-for-dbt-state), а сведения о ценах — в разделе [Использование и стоимость dbt State](/docs/platform/billing/dbt-state-usage).

## Настройка dbt State {#setting-up-dbt-state}

<Tabs queryString="user-type">
<TabItem value="self-hosted" label="Самостоятельно развёрнутый dbt">

Для аутентификации в сервисе dbt State требуется учётная запись dbt, даже при локальном запуске dbt. Переносить существующие рабочие процессы или приобретать пользовательские лицензии dbt не нужно.

1. Войдите в свою учётную запись dbt и начните пробный период dbt State.

   <VersionBlock firstVersion="1.13">

   1. Перейдите в каталог проекта:

      ```bash
      cd to/your/project
      ```

   2. Войдите в свою учётную запись dbt:

      ```bash
      dbt login
      ```

      Откроется окно браузера, в котором можно войти в учётную запись dbt или бесплатно создать новую. Если вы создаёте новую учётную запись:

      1. Введите своё имя и пароль.
      2. Выберите **Enable a trial of dbt State**.
      3. Примите условия использования и нажмите **Continue**.
      4. Войдите в <Constant name="dbt_platform" />.
      5. Настройте способ аутентификации.
      6. Подтвердите свой адрес электронной почты.

   3. Примите условия использования dbt State и нажмите **Start 30-day trial**.

      После начала пробного периода приостановить его нельзя. По его окончании вашей учётной записи предоставляется бесплатный ежемесячный лимит DATT, размер которого зависит от тарифного плана. Подробнее см. в разделе [Пробный период и оплата dbt State](/docs/deploy/dbt-state-trial).

   Вы также можете включать или отключать dbt State для отдельных запусков с помощью [флагов CLI](/reference/global-configs/about-global-configs) `--manage-state` или `--no-manage-state` либо задавать переменную окружения `DBT_ENGINE_MANAGE_STATE`.

   Чтобы включить dbt State для всех участников проекта, добавьте [`manage_state: true`](/reference/global-configs/about-global-configs) в блок `flags:` файла `dbt_project.yml`:

   ```yaml
   flags:
     manage_state: true
   ```

   </VersionBlock>

   <VersionBlock lastVersion="1.12">

   dbt State доступен в виде плагина для dbt v1.7–1.12. Если вы используете dbt v1.9 или более раннюю версию, рекомендуем перейти на [более новую версию, для которой продолжается поддержка](/docs/dbt-versions#latest-releases).

   1. Перейдите в каталог проекта:

      ```bash
      cd to/your/project
      ```

   2. Создайте и активируйте виртуальное окружение:

      ```bash
      python3 -m venv .venv
      source .venv/bin/activate
      ```

   3. Установите плагин dbt State:

      ```bash
      pip install dbt-state
      ```

   4. Выполните `dbt run` или `dbt build`.

      При первом выполнении `dbt run` или `dbt build` откроется окно браузера с предложением войти в учётную запись dbt или бесплатно создать новую. Если вы создаёте новую учётную запись:

      1. Введите своё имя и пароль.
      2. Выберите **Enable a trial of dbt State**.
      3. Примите условия использования и нажмите **Continue**.
      4. Войдите в <Constant name="dbt_platform" />.
      5. Настройте способ аутентификации.
      6. Подтвердите свой адрес электронной почты.

   5. Примите условия использования dbt State и нажмите **Start 30-day trial**.

      После начала пробного периода приостановить его нельзя. По его окончании вашей учётной записи предоставляется бесплатный ежемесячный лимит DATT, размер которого зависит от тарифного плана. Подробнее см. в разделе [Пробный период и оплата dbt State](/docs/deploy/dbt-state-trial).

   Флаги CLI `--manage-state` и `--no-manage-state` недоступны в старых версиях <Constant name="core" />. Для включения или отключения dbt State используйте переменную окружения (`DBT_ENGINE_ENABLE_STATE`) или флаг проекта (`enable_state`).

   </VersionBlock>

2. Выполните `dbt run` или `dbt build`.

   - **Первый запуск:** поскольку предыдущего состояния для сравнения нет, dbt создаёт каждый узел с нуля. dbt State сохраняет метаданные этого запуска для последующих сравнений.
   - **Последующие запуски:** dbt State сравнивает логику каждого узла и данные вышестоящих узлов с предыдущими сборками во всех средах. Он пересобирает узел, если его логика изменилась или если данные вышестоящих узлов изменились, а с момента последней сборки узла прошло больше времени, чем задано окном [`lag_tolerance`](#configuring-lag-tolerance). В остальных случаях он пропускает узел или клонирует существующий.

   Чтобы узнать, как dbt State оптимизирует запуски, см. [Примеры использования dbt State](/docs/deploy/dbt-state-examples).

3. Настройте среду оркестрации.

   - **Собственный оркестратор**: прежде чем использовать dbt State в собственном оркестраторе, создайте сервисный токен в <Constant name="dbt_platform" /> и настройте среду оркестрации для его использования. Инструкции см. в разделе [Настройка аутентификации для неинтерактивных сред](/docs/deploy/dbt-state-cicd). После настройки вы сможете запускать dbt с помощью своего оркестратора.
   - **<Constant name="dbt_platform" />**: перейдите в **Orchestration**, чтобы [создать среды](/docs/deploy/deploy-environments) и [задания](/docs/deploy/jobs), а затем [включить для них dbt State](/docs/deploy/dbt-state-enable-env-jobs).

4. [Убедитесь, что dbt State активен](#verify).

5. [Пригласите свою команду использовать dbt State](#invite).

</TabItem>
<TabItem value="existing-account" label="Существующая учётная запись dbt platform">

**Предварительное требование**: у вас должны быть права администратора в вашей учётной записи <Constant name="dbt_platform" />.

1. Начните пробный период dbt State. 

   1. В своей учётной записи <Constant name="dbt_platform" /> нажмите название учётной записи в левом нижнем углу над именем пользователя, затем нажмите **Account settings**.

   2. В разделе **Settings** перейдите в **Billing & Usage** > **Usage-based features**.

   3. На вкладке **State** нажмите **Start free trial**.

      После начала пробного периода приостановить его нельзя. По его окончании вашей учётной записи предоставляется бесплатный ежемесячный лимит DATT, размер которого зависит от тарифного плана. Подробнее см. в разделе [Пробный период и оплата dbt State](/docs/deploy/dbt-state-trial).

      :::info Продлённый пробный период для пользователей оркестрации с учётом состояния
      Если вы использовали оркестрацию с учётом состояния до 1 июня 2026 года, ваш пробный период dbt State будет продлён сверх 30 дней. Если продление не применилось к вашей учётной записи, свяжитесь с командой, которая её сопровождает.
      :::

   4. Ознакомьтесь с условиями использования и примите их.

   5. Нажмите **Start 30-day trial**.

2. Нажмите **Enable dbt State**.

3. Выберите, где включить dbt State. Доступны следующие варианты:

   - **By environment**: включает dbt State в выбранной среде развёртывания или разработки. 
   
      - Для сред развёртывания новые задания автоматически получают значение **Inherited from environment**, и dbt State включается для них без дополнительной настройки. Существующие задания не обновляются автоматически &mdash; необходимо [настроить каждое задание вручную](/docs/deploy/dbt-state-enable-env-jobs#enabling-dbt-state-on-individual-jobs). 
      - Для сред разработки этот вариант [включает dbt State в <Constant name="studio_ide" />](/docs/deploy/dbt-state-enable-studio).
      
      <!-- TODO (ORC-4324): После выпуска этой функции замените на:
      - **By environment**: включает dbt State в выбранной среде. Новые задания автоматически получают значение **Inherited from environment**, и dbt State включается для них без дополнительной настройки. Существующие задания, у которых для **dbt State** установлено значение **Off**, автоматически переключаются на **Inherited from environment**, что включает dbt State для этих заданий.
      -->
   - **By specific jobs**: включает dbt State для отдельных заданий. Чтобы включить его для других заданий, см. [Включение dbt State для отдельных заданий](/docs/deploy/dbt-state-enable-env-jobs#enabling-dbt-state-on-individual-jobs).

4. Нажмите **Enable dbt State**.

5. [Убедитесь, что dbt State активен](#verify).

6. [Пригласите свою команду использовать dbt State](#invite).

</TabItem>
</Tabs>

## Проверка активности dbt State {#verify}

После завершения запуска убедитесь, что dbt State активен:

- **В CLI:** проверьте, есть ли в выводе журнала сообщение вида `dbt State adapter: dbt-state v2.10.1 is enabled`.
- **В <Constant name="dbt_platform" />:** проверьте [представление журналов созданных ресурсов](/docs/deploy/dbt-state-interface#logs-view-of-built-resources), чтобы узнать, были ли они созданы или использованы повторно, либо откройте [вкладку **Explain**](/docs/deploy/dbt-state-interface#explain-tab) на странице сведений о запуске задания, чтобы увидеть решение State для каждого ресурса.

Если dbt State работает не так, как ожидалось, см. раздел [Отладка dbt State](#debugging-dbt-state).

## Приглашение участников команды {#invite}

Чем больше участников команды используют dbt State, тем эффективнее он работает: это даёт больше возможностей клонировать существующие узлы вместо их пересборки. Чтобы пригласить коллег:

- **В CLI (dbt v1.13+):** попросите коллег выполнить [`dbt login`](/reference/commands/login) после включения dbt State для учётной записи.
- **В <Constant name="dbt_platform" />:** перейдите в **Account settings** > **Users** и нажмите **Invite users**. Подробнее см. в разделе [Приглашение новых пользователей](/docs/platform/manage-access/invite-users#invite-new-users).

## Настройка допустимой задержки {#configuring-lag-tolerance}

Допустимая задержка определяет, сколько времени dbt State может не пересобирать узел при изменении данных вышестоящих узлов. Узел пересобирается только в том случае, если с момента его последней сборки прошло больше времени, чем задано окном допустимой задержки, и данные вышестоящих узлов изменились. Этот параметр можно задать на уровне проекта, среды или модели. Если он не настроен, `lag_tolerance` по умолчанию равен `45m`. Рекомендуем начать со следующего выражения Jinja:

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: "{{ '4h' if target.name == 'prod' else '7d' }}"
```

</File>

В этом примере модели для целевой конфигурации `prod` пересобираются, если с момента последней сборки прошло более 4 часов и данные вышестоящих узлов изменились. Во всех остальных средах модели пересобираются, если с момента последней сборки прошло более 7 дней и данные вышестоящих узлов изменились.

Подробнее см. в [справочнике по настройке `lag_tolerance`](/reference/resource-configs/lag-tolerance).

<LagToleranceRecommendationsTip />

## Отладка dbt State {#debugging-dbt-state}

Если dbt State работает не так, как ожидалось, можно указать переменную окружения `DBT_ENGINE_MANAGE_STATE` перед командой запуска, чтобы локализовать проблему:

```bash
DBT_ENGINE_MANAGE_STATE=0 dbt run --target dev --select "customers"
```

Чтобы после запуска узнать, какое решение dbt State принял для каждого узла и почему, выполните команду <VersionBlock firstVersion="2.0">[`dbt state explain`](/reference/commands/state-explain)</VersionBlock><VersionBlock lastVersion="1.99">[`dbt-state explain`](/reference/commands/state-explain)</VersionBlock>. Если вы используете <Constant name="dbt_platform" />, та же информация доступна без выполнения команды &mdash; перейдите на [вкладку **Explain**](/docs/deploy/dbt-state-interface#explain-tab) на странице сведений о запуске задания, чтобы увидеть подробное объяснение решения для каждого узла.

## Дальнейшие шаги

- [Переход с оркестрации с учётом состояния](/docs/deploy/dbt-state-migration)
- [`dbt login` с dbt State](/reference/commands/login?version=2.0#dbt-login-with-dbt-state)
- [Настройка отложенного разрешения ссылок (deferral)](/docs/deploy/dbt-state-deferral)
- [Настройка аутентификации для неинтерактивных сред](/docs/deploy/dbt-state-cicd)
- [Настройки dbt State](/reference/resource-configs/dbt-state-configs)
- [Мониторинг работы dbt State](/docs/deploy/dbt-state-interface)
