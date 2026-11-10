import OpenAiProjectRegion from '/snippets/_open-ai-project-region.md';

Аккаунт <Constant name="dbt_platform"/> на любом тарифном плане может использовать провайдера dbt с <Term id="managed">управлением со стороны dbt Labs</Term>, чтобы сразу приступить к работе. Аккаунты на тарифных планах Starter, Enterprise и Enterprise+ также могут настроить собственного ИИ-провайдера с использованием своего ключа (BYOK). При использовании BYOK вызовы API и связанные с ними расходы оплачиваются вами в соответствии с тарифами этого провайдера.

Следующие инструкции описывают настройку ИИ-провайдера под управлением dbt Labs или с использованием BYOK для <Constant name="wizard" />. ИИ-провайдеры под управлением dbt администрируются dbt Labs и не требуют предоставления пользователем ключа API. Список ИИ-провайдеров в разделе **Account settings** может меняться по мере добавления dbt Labs <Term id="managed">управляемых</Term> моделей. Актуальный список моделей и провайдеров приведён в [таблице тарифов провайдеров моделей](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model).

**Чтобы настроить провайдера:**

1. Нажмите на название своего аккаунта и выберите **Account settings** в боковом меню.
2. В разделе **Settings** нажмите **AI features**.
3. В разделе **AI providers** нажмите **Edit**, чтобы настроить интеграцию с ИИ.
4. Для каждого провайдера выберите вариант **Key management** в раскрывающемся списке, затем выполните приведённые ниже действия для выбранного провайдера.

<Tabs queryString="wizard-ai-integration">
  
  <TabItem value="anthropic" label="Anthropic">

  **Под управлением dbt Labs**  

  Используйте этот вариант как управляемую альтернативу модели OpenAI, используемой по умолчанию.

  1. Если вариант **dbt Labs** ещё не выбран, выберите его в списке, чтобы использовать ключ Anthropic под управлением dbt Labs.
  2. Нажмите **Save**.

  **Под вашим управлением (BYOK)**
  1. Выберите **Anthropic** из доступных вариантов.
  2. Введите свой ключ API Anthropic.
  3. Нажмите **Save**.

  :::note Ограничения для эмбеддингов
  При использовании ключа API Anthropic <Constant name="dbt" /> продолжает использовать ключ OpenAI под управлением <Constant name="dbt" /> Labs для создания эмбеддингов в инструментах MCP `text_to_sql`, поскольку Anthropic не предоставляет собственных средств создания эмбеддингов.
  :::

  </TabItem>

  <TabItem value="openai" label="OpenAI">

  **Под управлением dbt Labs**  

  Этот вариант выбран по умолчанию. Используйте его, если хотите работать с ключами ИИ-провайдеров под управлением dbt. Подробнее см. в разделе [Модели и цены](/docs/dbt-ai/pricing-billing/overview?version=2.0).

  1. Если переключатель **dbt Labs** ещё не включён, включите его, чтобы использовать ключ под управлением dbt Labs.
  2. Нажмите **Save**.

  <Lightbox src="/img/docs/dbt-platform/account-integration-dbtlabs.png" width="85%" title="Пример страницы интеграции с dbt Labs" />

  **Под вашим управлением (BYOK)**

  1. Выберите **OpenAI** из доступных вариантов.
  2. Введите свой ключ API OpenAI.
  3. Нажмите **Save**.

  <Lightbox src="/img/docs/dbt-platform/account-integration-openai.png" width="85%" title="Пример страницы интеграции с OpenAI" />

  :::info Ограничение, связанное с размещением данных
  <OpenAiProjectRegion />
  :::

  - Для BYOK включите новейшие модели генерации текста, а также модель `text-embedding-3-small`.
  - Убедитесь, что в вашем проекте не включены ограничения на размещение данных. Проекты без настроек региона используют стандартную конечную точку OpenAI (`https://api.openai.com`) и поддерживают BYOK.

  </TabItem>

  <TabItem value="azure" label="Azure AI Foundry">

  **Только под вашим управлением (BYOK)**  

  Подробнее о развёртывании моделей в Azure см. в документации [Развёртывание моделей в Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai) и [Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/).

  Настройте учётные данные для своего развёртывания Azure AI Foundry в dbt следующим образом:

  1. Найдите сведения о своём развёртывании на портале Azure — в Azure AI Foundry или Azure OpenAI.
  2. Введите свой ключ API Azure.
  3. Заполните поля **Endpoint**, **API Version** и **Deployment / AI model name**.
  4. Нажмите **Save**.

  :::info Используйте полный целевой URI Azure
  В поле **Endpoint** введите полный целевой URI (Target URI) из Azure &mdash; не только базовый адрес конечной точки. Если указать только базовый адрес конечной точки, например `https://<resource>.openai.azure.com`, проверка учётных данных не пройдёт и настройка будет заблокирована.

  Поддерживаются следующие форматы:

  - `https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions?api-version=<version>`
  - `https://<resource>.openai.azure.com/openai/responses?api-version=<version>`
  :::

  <Lightbox src="/img/docs/dbt-platform/account-integration-azure-manual.png" width="85%" title="Пример раздела интеграции с Azure AI Foundry" />

  </TabItem>



</Tabs>
