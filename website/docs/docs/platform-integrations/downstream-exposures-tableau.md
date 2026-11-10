---
title: "Настройка автоматических downstream exposures"
sidebar_label: "Настройка автоматических exposures"
description: "Настройте автоматическое создание и визуализацию exposures на основе дашбордов Tableau, чтобы понимать, как модели используются в зависимых инструментах, и получать более полную картину происхождения данных."
image: /img/docs/platform-integrations/auto-exposures/explorer-lineage2.png
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Настройка автоматических exposures в Tableau

<IntroText>
Настройте автоматическое заполнение downstream exposures для поддерживаемых интеграций с BI-инструментами, такими как Tableau. Визуализируйте их и управляйте их выполнением с помощью <a href="https://docs.getdbt.com/docs/explore/explore-projects">dbt Catalog</a> и [планировщика заданий <Constant name="dbt" />](/docs/deploy/job-scheduler), чтобы расширить возможности работы с ними.

</IntroText>

Команде по работе с данными крайне важно понимать, как и кем используются ее продукты данных в зависимых системах. Автоматические downstream [exposures](/docs/build/exposures) позволяют:

- Лучше понимать, как модели используются в зависимых аналитических системах, улучшая управление данными и принятие решений.
- Сокращать количество инцидентов и оптимизировать рабочие процессы, связывая исходные модели с зависимыми от них объектами.
- Автоматизировать отслеживание exposures для поддерживаемых BI-инструментов, поддерживая актуальность графа происхождения данных.
- [Оркестрировать exposures](/docs/platform-integrations/orchestrate-exposures) для обновления базовых источников данных во время запланированных заданий dbt, повышая своевременность обновлений и снижая затраты. Оркестрация exposures позволяет обеспечить регулярное обновление BI-инструментов с помощью [планировщика заданий <Constant name="dbt" />](/docs/deploy/job-scheduler). Подробнее см. на [предыдущей странице](/docs/platform-integrations/downstream-exposures).

В <Constant name="dbt" /> можно настроить downstream exposures двумя способами:
- Вручную &mdash; [Явно объявить](/docs/build/exposures#declaring-an-exposure) их в YAML-файлах проекта.
- Автоматически &mdash; <Constant name="dbt" /> автоматически [создает и визуализирует downstream exposures](/docs/platform-integrations/downstream-exposures) для поддерживаемых интеграций, устраняя необходимость вручную описывать их в YAML. Эти downstream exposures хранятся в системе метаданных dbt, отображаются в [<Constant name="catalog" />](/docs/explore/explore-projects) и работают так же, как exposures, созданные вручную. Однако в YAML-файлах их нет.

:::info Tableau Server
Если вы используете Tableau Server, необходимо добавить [IP-адреса <Constant name="dbt" /> для вашего региона](/docs/platform/about-platform/access-regions-ip-addresses) в список разрешенных.
:::

## Предварительные требования

Для настройки автоматических downstream exposures должны выполняться следующие условия:

1. Ваша среда и задания используют поддерживаемый [канал выпуска <Constant name="dbt" />](/docs/dbt-versions/dbt-release-tracks).
2. У вас есть учетная запись <Constant name="dbt" /> с [тарифным планом Enterprise или Enterprise+](https://www.getdbt.com/pricing/).
3. Для каждого проекта, который вы хотите исследовать, настроена среда развертывания [production](/docs/deploy/deploy-environments#set-as-production-environment), в которой успешно выполнено хотя бы одно задание. 
4. У вас есть [необходимые разрешения](/docs/platform/manage-access/enterprise-permissions) для изменения настроек проекта или среды production в <Constant name="dbt" />.
5. Вы используете Tableau в качестве BI-инструмента и включили разрешения на доступ к метаданным самостоятельно или с помощью администратора. Поддерживаются Tableau Cloud и Tableau Server с включенным Metadata API.
6. Вы настроили [персональный токен доступа Tableau (PAT)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm), создатель которого имеет разрешение на просмотр источников данных. PAT наследует разрешения своего создателя, поэтому убедитесь, что у пользователя Tableau, создавшего токен, есть [разрешения Connect](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_concepts_permissions.htm).

### Особенности и ограничения
import ConsiderationsTableau from '/snippets/_auto-exposures-considerations-tb.md';

<ConsiderationsTableau/>

## Настройка downstream exposures

Настройте downstream exposures в [Tableau](#set-up-in-tableau) и [<Constant name="dbt" />](#set-up-in-dbt-cloud), чтобы обеспечить автоматическое обновление экстрактов вашего BI-инструмента.

### Настройка в Tableau {#set-up-in-tableau}

В этом разделе описаны шаги настройки интеграции в Tableau. Эти шаги должен выполнить администратор сайта Tableau. 

После настройки в Tableau и [<Constant name="dbt" />](#set-up-in-dbt-cloud) вы сможете [просматривать downstream exposures](#view-downstream-exposures) в <Constant name="catalog" />. 

1. Включите [персональные токены доступа (PAT)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm) для своей учетной записи Tableau.
   <Lightbox src="/img/docs/platform-integrations/auto-exposures/tableau-enable-pat.jpg" title="Включение PAT для учетной записи Tableau"/>

2. Создайте PAT для добавления в <Constant name="dbt" />, чтобы получать метаданные Tableau для downstream exposures. При создании токена у вас должно быть разрешение на доступ к коллекциям и папкам, поскольку PAT предоставляет доступ только в пределах существующих прав его создателя.
   <Lightbox src="/img/docs/platform-integrations/auto-exposures/tableau-create-pat.jpg" title="Создание PAT для учетной записи Tableau"/>

3. Скопируйте **Secret** и **Token name** для использования на одном из следующих шагов в <Constant name="dbt" />. Секрет отображается только один раз, поэтому сохраните его в безопасном месте (например, в менеджере паролей).
   <Lightbox src="/img/docs/platform-integrations/auto-exposures/tableau-copy-token.jpg" title="Копирование секрета и имени токена для ввода в dbt"/>

4. Скопируйте **Server URL** и **Sitename**. Их можно найти в URL после входа в Tableau.
   <Lightbox src="/img/docs/platform-integrations/auto-exposures/tablueau-serverurl.jpg" title="Поиск Server URL и Sitename в Tableau"/>

   Например, если полный URL выглядит так: `10az.online.tableau.com/#/site/dbtlabspartner/explore`:
   - **Server URL** — это полное доменное имя, в данном случае: `10az.online.tableau.com`
   - **Sitename** — это фрагмент пути сразу после `site` в URL, в данном случае: `dbtlabspartner` 

5. Скопировав следующие данные, вы можете перейти к настройке downstream exposures в <Constant name="dbt" />: 
      - ServerURL
      - Sitename
      - Token name
      - Secret

### Настройка в dbt {#set-up-in-dbt-cloud}

1. В <Constant name="dbt" /> перейдите на **Dashboard** проекта, в который хотите добавить downstream exposure, затем выберите **Settings**.
2. В разделе **Exposures** выберите **Add lineage integration**, чтобы добавить подключение к Tableau.
   <Lightbox src="/img/docs/platform-integrations/auto-exposures/cloud-add-integration.png" title="Выберите Add lineage integration, чтобы добавить подключение к Tableau."/>
3. Введите данные подключения для exposures, полученные из Tableau на [предыдущем шаге](#set-up-in-tableau), и нажмите **Continue**. Обратите внимание: все поля чувствительны к регистру.
   <Lightbox src="/img/docs/platform-integrations/auto-exposures/cloud-integration-details.png" title="Введите данные подключения для exposures."/>
4. Выберите коллекции, которые хотите включить в downstream exposures, и нажмите **Save**.

   <Lightbox src="/img/docs/platform-integrations/auto-exposures/cloud-select-collections.png" title="Выберите коллекции, которые хотите включить в downstream exposures."/>

      :::info
      <Constant name="dbt" /> автоматически импортирует и синхронизирует все рабочие книги из выбранных коллекций. Новые объекты, добавленные в коллекции, появляются на графе происхождения данных в <Constant name="dbt" /> раз в сутки &mdash; после ежедневной синхронизации и выполнения задания.

      <Constant name="dbt" /> запускает синхронизацию сразу после изменения списка выбранных коллекций, добавляя новые рабочие книги и удаляя те, которые больше не относятся к выбранным коллекциям.
      :::

5. <Constant name="dbt" /> импортирует все содержимое выбранных коллекций, после чего вы можете перейти к [его просмотру](#view-downstream-exposures) в <Constant name="catalog" />. 

   <Lightbox src="/img/docs/platform-integrations/auto-exposures/explorer-lineage2.png" width="100%" title="Отображение в dbt Catalog на графе происхождения данных проекта со значком Tableau."/>

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>

## Оркестрация exposures <Lifecycle status="beta,managed,managed_plus"/>

[Оркестрируйте exposures](/docs/platform-integrations/orchestrate-exposures) с помощью [планировщика заданий dbt Cloud](/docs/deploy/job-scheduler), чтобы заблаговременно обновлять базовые источники данных (экстракты), используемые в рабочих книгах Tableau.

Эта возможность в бета-версии требует, чтобы задания развертывания использовали [**v1 Latest**](/docs/dbt-versions/dbt-release-tracks) с <Constant name="core" />, и _недоступна_ в [**v2 Stable**](/docs/dbt-versions/dbt-release-tracks). Подробности настройки см. в разделе [Оркестрация exposures](/docs/platform-integrations/orchestrate-exposures).

- Оркестрация exposures с помощью задания `dbt build` обеспечивает регулярное автоматическое обновление downstream exposures, таких как экстракты Tableau.
- Вы можете управлять частотой этих обновлений, настраивая переменные среды.

Инструкции по настройке и заблаговременному запуску exposures с помощью планировщика заданий <Constant name="dbt" /> см. в разделе [Оркестрация exposures](/docs/platform-integrations/orchestrate-exposures).
