---
title: "Настройка автоматических downstream exposures"
sidebar_label: "Настройка автоматических exposures"
description: "Настройте и визуализируйте exposures автоматически, авто‑генерируя их из дашбордов Tableau. Это помогает понять, как модели используются в downstream‑инструментах, и получить более богатую lineage."
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg
---

# Настройка автоматических downstream exposures в Tableau <Lifecycle status="managed,managed_plus" /> {#set-up-automatic-exposures-in-tableau}

<IntroText>
Настройте и автоматически заполняйте downstream exposures для поддерживаемых интеграций с BI‑инструментами, такими как Tableau. Визуализируйте и оркестрируйте их с помощью <a href="https://docs.getdbt.com/docs/explore/explore-projects">dbt Catalog</a> и [планировщика заданий <Constant name="cloud" />](/docs/deploy/job-scheduler), чтобы получить более полный и удобный опыт работы.

</IntroText>

Для data‑команды критически важно понимать контекст downstream‑сценариев использования и пользователей ваших дата‑продуктов. Используя автоматические downstream [exposures](/docs/build/exposures), вы можете:

- Лучше понимать, как модели используются в downstream‑аналитике, что улучшает управление данными и качество принимаемых решений.
- Снижать количество инцидентов и оптимизировать рабочие процессы, связывая upstream‑модели с downstream‑зависимостями.
- Автоматизировать отслеживание exposures для поддерживаемых BI‑инструментов, гарантируя, что lineage всегда актуален.
- [Оркестрировать exposures](/docs/cloud-integrations/orchestrate-exposures) для обновления базовых источников данных во время запланированных заданий dbt, повышая своевременность обновлений и снижая затраты. Оркестрация exposures — это способ гарантировать, что ваши BI‑инструменты регулярно обновляются с использованием [планировщика заданий <Constant name="cloud" />](/docs/deploy/job-scheduler). Подробнее см. на [предыдущей странице](/docs/cloud-integrations/downstream-exposures).

В <Constant name="cloud" /> вы можете настраивать downstream exposures двумя способами:
- **Вручную** — [явно объявляя](/docs/build/exposures#declaring-an-exposure) их в YAML‑файлах проекта.
- **Автоматически** — <Constant name="cloud" /> [создаёт и визуализирует downstream exposures](/docs/cloud-integrations/downstream-exposures) автоматически для поддерживаемых интеграций, избавляя от необходимости вручную описывать их в YAML. Эти downstream exposures хранятся в системе метаданных dbt, отображаются в [<Constant name="explorer" />](/docs/explore/explore-projects) и ведут себя так же, как и ручные exposures. Однако они не существуют в YAML‑файлах.

:::info Tableau Server
Если вы используете Tableau Server, необходимо добавить [IP‑адреса <Constant name="cloud" /> для вашего региона](/docs/cloud/about-cloud/access-regions-ip-addresses) в allowlist.
:::

## Предварительные требования {#prerequisites}

Для настройки автоматических downstream exposures необходимо выполнить следующие условия:

1. Ваша среда и задания используют поддерживаемый [release track <Constant name="cloud" />](/docs/dbt-versions/cloud-release-tracks).
2. У вас есть аккаунт <Constant name="cloud" /> на тарифе [Enterprise или Enterprise+](https://www.getdbt.com/pricing/).
3. Для каждого проекта, который вы хотите исследовать, настроена среда деплоя [production](/docs/deploy/deploy-environments#set-as-production-environment) с как минимум одним успешным запуском задания.
4. У вас есть [необходимые права доступа](/docs/cloud/manage-access/enterprise-permissions) для редактирования настроек проекта или production‑среды в <Constant name="cloud" />.
5. В качестве BI‑инструмента используется Tableau, и включены разрешения на работу с метаданными (или вы работаете с администратором, который может их включить). Поддерживаются Tableau Cloud или Tableau Server с включённым Metadata API.
6. Настроен [Tableau personal access token (PAT)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm), создатель которого имеет права на просмотр источников данных. PAT наследует права своего создателя, поэтому убедитесь, что пользователь Tableau, создавший токен, имеет [права Connect](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_concepts_permissions.htm).

### Важные моменты {#considerations}
import ConsiderationsTableau from '/snippets/_auto-exposures-considerations-tb.md';

<ConsiderationsTableau/>

## Настройка downstream exposures {#set-up-downstream-exposures}

Настройте downstream exposures в [Tableau](#set-up-in-tableau) и в [<Constant name="cloud" />](#set-up-in-dbt-cloud), чтобы экстракты вашего BI‑инструмента обновлялись автоматически.

### Настройка в Tableau {#set-up-in-tableau}

В этом разделе описаны шаги по настройке интеграции в Tableau. Эти действия должен выполнить администратор сайта Tableau.

После настройки как в Tableau, так и в [<Constant name="cloud" />](#set-up-in-dbt-cloud), вы сможете [просматривать downstream exposures](#view-downstream-exposures) в <Constant name="explorer" />.

1. Включите [personal access tokens (PATs)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm) для вашей учётной записи Tableau.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-enable-pat.jpg" title="Включение PATs для учётной записи в Tableau"/>

2. Создайте PAT, который будет добавлен в <Constant name="cloud" /> для загрузки метаданных Tableau для downstream exposures. При создании токена у вас должны быть права доступа к коллекциям/папкам, так как PAT предоставляет только те права, которыми уже обладает его создатель.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-create-pat.jpg" title="Создание PAT для учётной записи в Tableau"/>

3. Скопируйте **Secret** и **Token name** для использования на следующем шаге в <Constant name="cloud" />. Secret отображается только один раз, поэтому сохраните его в надёжном месте (например, в менеджере паролей).
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-copy-token.jpg" title="Копирование secret и token name для ввода в dbt"/>

4. Скопируйте **Server URL** и **Sitename**. Их можно найти в URL, когда вы вошли в Tableau.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tablueau-serverurl.jpg" title="Определение Server URL и Sitename в Tableau"/>

   Например, если полный URL выглядит так: `10az.online.tableau.com/#/site/dbtlabspartner/explore`:
   - **Server URL** — это полностью квалифицированное доменное имя, в данном случае: `10az.online.tableau.com`
   - **Sitename** — это фрагмент пути сразу после `site` в URL, в данном случае: `dbtlabspartner`

5. После того как вы скопировали следующие данные, вы готовы настроить downstream exposures в <Constant name="cloud" />:
      - ServerURL
      - Sitename
      - Token name
      - Secret

### Настройка в dbt {#set-up-in-dbt}

1. В <Constant name="cloud" /> перейдите на **Dashboard** проекта, в который вы хотите добавить downstream exposure, и выберите **Settings**.
2. В разделе **Exposures** нажмите **Add integration**, чтобы добавить подключение к Tableau.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-add-integration.jpg" title="Выбор Add Integration для добавления подключения Tableau"/>
3. Введите данные для подключения exposure, полученные в Tableau на [предыдущем шаге](#set-up-in-tableau), и нажмите **Continue**. Обратите внимание, что все поля чувствительны к регистру.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-integration-details.jpg" title="Ввод данных подключения exposure"/>
4. Выберите коллекции, которые вы хотите включить для downstream exposures, и нажмите **Save**.

   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-select-collections.jpg" title="Выбор коллекций для downstream exposures"/>

      :::info
      <Constant name="cloud" /> автоматически импортирует и синхронизирует каждый workbook в выбранных коллекциях. Новые объекты, добавленные в коллекции, будут появляться в lineage в <Constant name="cloud" /> один раз в день — после ежедневной синхронизации и запуска задания.

      <Constant name="cloud" /> немедленно запускает синхронизацию при обновлении списка выбранных коллекций, добавляя новые workbooks и удаляя нерелевантные.
      :::

5. <Constant name="cloud" /> импортирует всё содержимое выбранных коллекций, и вы сможете продолжить [просмотр](#view-auto-exposures) в <Constant name="explorer" />.

   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="100%" title="Вид из dbt Catalog в lineage проекта с иконкой Tableau"/>

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>

## Оркестрация exposures <Lifecycle status="beta,managed,managed_plus"/> {#orchestrate-exposures}

[Оркестрируйте exposures](/docs/cloud-integrations/orchestrate-exposures) с помощью [планировщика заданий dbt Cloud](/docs/deploy/job-scheduler), чтобы проактивно обновлять базовые источники данных (extracts), на которых основаны ваши Tableau Workbooks.

- Оркестрация exposures с заданием `dbt build` гарантирует, что downstream exposures, такие как Tableau extracts, обновляются регулярно и автоматически.
- Вы можете управлять частотой этих обновлений, настраивая переменные окружения.

Чтобы настроить и проактивно запускать exposures с помощью планировщика заданий <Constant name="cloud" />, см. раздел [Orchestrate exposures](/docs/cloud-integrations/orchestrate-exposures).
