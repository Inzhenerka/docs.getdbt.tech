import OpenAiProjectRegion from '/snippets/_open-ai-project-region.md';

dbt Copilot поддерживает меньше провайдеров, чем <Constant name="wizard" />, в том числе использование собственного ключа (BYOK) на тарифных планах Starter, Enterprise и Enterprise+:

- Ключ API OpenAI, <Term id="managed" /> компанией dbt Labs
- Собственный ключ API OpenAI (BYOK)
- Собственный ключ API Azure OpenAI (BYOK)

Snowflake Cortex, AWS Bedrock, Azure AI Foundry и Anthropic не поддерживаются в dbt Copilot.

dbt Copilot предоставляет встроенную помощь в <Constant name="studio_ide" /> и <Constant name="insights" />. Настройте его отдельно от <Constant name="wizard" />, если ваша команда использует эти встроенные функции ИИ.

**Чтобы настроить провайдера:**

1. Нажмите на название своей учетной записи и выберите **Account settings** в боковом меню.
2. В разделе **Settings** нажмите **Copilot**.
3. В разделе **AI providers** нажмите **Edit**, чтобы настроить интеграцию с ИИ.
4. Выберите вариант **Key management** в раскрывающемся списке, затем выполните приведенные ниже действия для своего провайдера.

<Tabs queryString="copilot-ai-integration">

  <TabItem value="dbtlabs" label="dbt Labs OpenAI">

  1. Выберите переключатель **dbt Labs**, чтобы использовать ключ OpenAI, управляемый dbt Labs.
  2. Нажмите **Save**.

  <Lightbox src="/img/docs/dbt-platform/account-integration-dbtlabs.png" width="85%" title="Пример страницы интеграции с dbt Labs" />

  </TabItem>

  <TabItem value="openai" label="OpenAI">

  1. Выберите переключатель **OpenAI**, чтобы использовать собственный ключ OpenAI.
  2. Введите ключ API.
  3. Нажмите **Save**.

  <Lightbox src="/img/docs/dbt-platform/account-integration-openai.png" width="85%" title="Пример страницы интеграции с OpenAI" />

  :::info Ограничение по размещению данных
  <OpenAiProjectRegion />
  :::

  </TabItem>

  <TabItem value="azure" label="Azure OpenAI">


  Подробнее о развертывании собственной модели OpenAI в Azure см. в разделе [Развертывание моделей в Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai).

  Настройте учетные данные для своего развертывания Azure OpenAI в dbt следующим образом:

  1. Найдите параметры Azure OpenAI на странице сведений о развертывании в Azure.
  2. Введите свой ключ API Azure OpenAI.
  3. Укажите **Endpoint**, **API Version** и **Deployment / Model Name**.
  4. Нажмите **Save**.

  :::info Используйте полный URI назначения Azure
  В поле **Endpoint** введите полный URI назначения (Target URI) из Azure &mdash; не только базовый адрес конечной точки. Если указать только базовый адрес, например `https://<resource>.openai.azure.com`, проверка учетных данных не пройдет и завершить настройку не удастся.

  Поддерживаются следующие форматы:

  - `https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions?api-version=<version>`
  - `https://<resource>.openai.azure.com/openai/responses?api-version=<version>`
  :::

  <Lightbox src="/img/docs/dbt-platform/account-integration-azure-manual.png" width="85%" title="Пример раздела интеграции с Azure OpenAI" />

  - Для BYOK включите новейшие модели генерации текста, а также модель `text-embedding-3-small`.
  - Убедитесь, что в вашем проекте не включены ограничения на размещение данных.

  </TabItem>

</Tabs>
