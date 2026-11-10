---
title: "Настройка BYOK для dbt Wizard"
id: "wizard-byok"
description: "Используйте собственный API-ключ для работы с dbt Wizard CLI. Поддерживаются OpenAI, Anthropic, AWS Bedrock, Google Gemini, Snowflake Cortex (предварительная версия) и Databricks."
sidebar_label: "Настройка BYOK"
tags: [AI, Wizard, Configuration]
availability: local_all
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Настройка BYOK для <Constant name="wizard" /> <Lifecycle status="beta"/>

<IntroText>
Вы можете использовать CLI <Constant name="wizard" /> с собственными учетными данными (bring-your-own-key, BYOK): в этом случае вы предоставляете учетные данные поддерживаемого провайдера ИИ вместо использования инфраструктуры dbt Labs.
</IntroText>

Приведенные на этой странице инструкции по настройке BYOK относятся только к CLI. О настройке BYOK для <Constant name="dbt_platform" /> см. [Настройка BYOK для dbt Wizard в dbt platform](/docs/platform/wizard-byok-platform). 

Если вы не хотите самостоятельно заниматься настройкой и обслуживанием, [вариант под управлением dbt Labs (<Term id="managed" />)](/docs/platform/manage-dbt-ai#configure-ai-provider) готов к использованию без настройки и включает [пробные и ежемесячные кредиты на использование](/docs/dbt-ai/pricing-billing/trial-and-billing).

Под «ключом» в BYOK понимаются любые учетные данные, которые выбранный провайдер использует для аутентификации API-запросов: API-ключ для OpenAI или Anthropic, токен Bearer для AWS Bedrock или токен/PAT для Snowflake Cortex. После настройки провайдера с этими учетными данными <Constant name="wizard" /> использует их для прямого обращения к API провайдера, поэтому:

- Расходы на использование отражаются в вашем аккаунте провайдера, а не в аккаунте dbt Labs.
- Плату за токены взимает выбранный вами провайдер.

<WizardSupportedProviders defaultSurface="local" />

<WizardFeedbackCallout />

## Настройка провайдера

Вы можете настроить провайдера одним из следующих способов:

- [**Команды терминала**:](#configure-in-the-terminal) лучше всего подходят пользователям, которые хотят настраивать провайдеров из командной оболочки.
- [**Интерактивный сеанс**:](#configure-in-the-tui) лучше всего подходит большинству пользователей, работающих в текстовом пользовательском интерфейсе (TUI) <Constant name="wizard" />. Используйте слеш-команду `/providers`.
- [**Переменные окружения**:](#set-your-api-key) лучше всего подходят для запусков без пользовательского интерфейса, например `wizard exec`, автоматизации или временных локальных сеансов.

### Настройка в терминале {#configure-in-the-terminal}

В терминале используйте подкоманду `providers` для просмотра списка, настройки и включения провайдеров:

```bash
wizard providers list
wizard providers configure PROVIDER_NAME
wizard providers enable PROVIDER_NAME
```

Замените `PROVIDER_NAME` именем поддерживаемого провайдера, например `openai`, `anthropic`, `bedrock`, `azure`, `gemini`, `snowflake` или `databricks`. Затем следуйте подсказкам, чтобы ввести учетные данные.

Команда `wizard providers list` показывает настроенных провайдеров и их текущее состояние:

```bash
➜  jaffle-shop git:(mwong-v2) wizard providers list
provider              enabled  route      auth         models
dbt                   true     remote     dbt          3
openai                false    local      missing      3
openai_subscription   false    local      missing      1
anthropic             false    local      missing      3
bedrock               true     local      configured   15
azure                 false    local      missing      3
snowflake             false    local      missing      3
gemini                false    local      missing      3
```

Команда `configure` предлагает ввести учетные данные для выбранного провайдера. Чтобы использовать переменные окружения или задать ключ, не сохраняя его в истории команд оболочки, см. [Настройка API-ключа](#set-your-api-key).

Например, если вы используете OpenAI, выполните следующие команды и следуйте подсказкам для его настройки:

```bash
wizard providers configure openai
wizard providers enable openai
```

Чтобы сохранить API-ключ, не записывая его в историю команд оболочки:

```bash
printf '%s' 'sk-...' | wizard providers set-key PROVIDER_NAME
```

Учетные данные хранятся в `~/.dbt/wizard/provider-auth.json`. Настройки провайдеров хранятся в `~/.dbt/wizard/providers.json`.

### Настройка в TUI {#configure-in-the-tui}

Вы можете настраивать провайдеров в активном сеансе TUI CLI с помощью слеш-команды `/providers`:

```bash
/providers
```

В меню провайдеров вы можете:

* Включить или отключить провайдера.
* Добавить или обновить учетные данные.
* Выбрать доступные модели.
* Проверить, прошел ли провайдер аутентификацию и активен ли он.

Пример меню провайдеров:

```bash
/providers

  Model Providers
  Select a provider to inspect or update it.
 
› 1. dbt                  enabled; 3/3 models selected; uses dbt login; active
  2. openai               disabled; 3/3 models selected; missing credentials; needs setup
  3. openai_subscription  disabled; 1/1 models selected; not connected; needs setup
  4. anthropic            disabled; 3/3 models selected; authenticated; needs setup
  5. bedrock              enabled; 15/15 models selected; authenticated; active
  6. azure                disabled; 3/3 models selected; missing credentials; needs setup
  7. snowflake            disabled; 3/3 models selected; missing credentials; needs setup
  8. gemini               disabled; 3/3 models selected; missing credentials; needs setup
```

## Настройка API-ключа {#set-your-api-key}

<Tabs>
<TabItem value="interactive" label="Интерактивный сеанс" default>

При первом запуске <Constant name="wizard" /> в проекте мастер начальной настройки предложит выбрать провайдера.

1. В запросе **Configure a Provider** выберите провайдера.
2. Когда появится соответствующий запрос, вставьте API-ключ или учетные данные провайдера.
3. Выберите модель ИИ, чтобы завершить настройку.

Чтобы позднее добавить или сменить провайдера в активном сеансе, введите `/providers` в TUI.

При настройке провайдера через <Constant name="wizard" /> учетные данные сохраняются в `~/.dbt/wizard/provider-auth.json`.

</TabItem>
<TabItem value="env-var" label="Переменная окружения">

Задайте ключ через переменную окружения, если хотите:

* Запускать <Constant name="wizard" /> без пользовательского интерфейса, например с помощью `wizard exec`.
* Использовать ключ только в текущем [сеансе](/docs/dbt-ai/wizard-how-it-works#sessions) терминала.
* Повторно использовать один и тот же ключ в разных сеансах терминала.
* Не сохранять учетные данные в каталоге конфигурации <Constant name="wizard" />.

<Tabs>
<TabItem value="openai" label="OpenAI">

```bash
export OPENAI_API_KEY="sk-..."
```

</TabItem>
<TabItem value="anthropic" label="Anthropic">

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

</TabItem>
<TabItem value="bedrock" label="Amazon Bedrock">

```bash
export AWS_BEARER_TOKEN_BEDROCK="ABSK..."
```

</TabItem>

<TabItem value="azure" label="Azure AI Foundry">

```bash
export AZURE_API_KEY="..."
```

</TabItem>

<TabItem value="gemini" label="Google Gemini">

```bash
export GOOGLE_API_KEY="..."
```

</TabItem>

<TabItem value="snowflake" label="Snowflake Cortex">

```bash
export SNOWFLAKE_API_KEY="..."
```

</TabItem>

<TabItem value="databricks" label="Databricks">

```bash
export DATABRICKS_API_KEY="dapi..."
export DATABRICKS_API_BASE="https://adb-1234567890.azuredatabricks.net"
```

</TabItem>

</Tabs>

Чтобы переменная окружения была доступна в разных сеансах терминала, добавьте ее в файл профиля командной оболочки, например `.zshrc`, `.bashrc` или аналогичный.

Не добавляйте API-ключи в систему контроля версий, файлы проекта или общие конфигурационные файлы.

</TabItem>
</Tabs>

Чтобы сохранить учетные данные провайдера для дальнейшего использования, воспользуйтесь одним из следующих вариантов:

* `wizard providers configure PROVIDER_NAME`
* `wizard providers set-key PROVIDER_NAME`
* Переменная окружения провайдера

## Выбор модели ИИ

По умолчанию CLI <Constant name="wizard" /> использует модели под управлением dbt Labs. Переключиться на модель BYOK можно следующими способами:

<SimpleTable>
| Способ | Описание | Пример |
|---|---|---|
| Интерактивный сеанс | Измените модель ИИ интерактивно в TUI. | `/model` |
| Флаг запуска | Измените модель ИИ при запуске с помощью флага `-m`. | `wizard -m gpt-4o "refactor stg_orders to use incremental materialization"` |
| Файл конфигурации | Задайте модель ИИ по умолчанию в файле конфигурации (`~/.dbt/wizard/config.toml`); настройка применяется ко всем последующим сеансам. Выполните `wizard debug models`, чтобы получить список идентификаторов доступных моделей. | `model = "gpt-4o"` |
</SimpleTable>

После изменения модели перезапустите CLI <Constant name="wizard" />.

## Примеры

В следующих примерах используется описанный выше процесс настройки провайдера с учетом требований каждого провайдера к учетным данным.

### AWS Bedrock

AWS Bedrock поддерживается только в CLI. В настоящее время <Constant name="wizard" /> поддерживает Bedrock через API-ключ Amazon Bedrock, а не через полную цепочку учетных данных AWS. Убедитесь, что ваш аккаунт AWS имеет доступ к моделям Bedrock, которые вы планируете использовать, а ваш API-ключ Bedrock дает разрешение на их вызов.

```bash
export AWS_BEARER_TOKEN_BEDROCK="ABSK..."
wizard providers enable bedrock
wizard providers bedrock set-region us-east-1
wizard providers list
wizard debug models
```

Чтобы задать модель Bedrock по умолчанию, добавьте идентификатор модели в `~/.dbt/wizard/config.toml`:

```toml
model = "BEDROCK_MODEL_ID"
```

### Snowflake Cortex <Lifecycle status="preview"/>

Поддержка BYOK для Snowflake Cortex в CLI находится на стадии предварительной версии. Доступность и порядок настройки могут измениться. Убедитесь, что ваш аккаунт Snowflake имеет необходимые права для использования функций больших языковых моделей (LLM) Cortex. См. [документацию Snowflake Cortex](https://docs.snowflake.com/en/user-guide/snowflake-cortex/overview).

Вы можете [пройти аутентификацию](#authentication-options) в Snowflake Cortex с помощью API-токена или токена программного доступа (Programmatic Access Token, PAT) (для пользователей SSO и Okta).

```bash
wizard providers list
wizard providers enable snowflake
wizard providers configure snowflake
wizard providers list
wizard debug models
```

Команда `wizard providers configure snowflake` последовательно выводит следующие запросы:

```
Enable this provider? [Y/n]:
Models to enable [1]:
Snowflake account ID:
Snowflake API base override (optional):
Paste API key/token, or press enter to configure it later:
```

<SimpleTable>

| Запрос | Что ввести |
|--------|---------------|
| **Snowflake account ID** | Идентификатор вашего аккаунта Snowflake (например, `myorg-myaccount`) |
| **Snowflake API base override (optional)** | Оставьте поле пустым — оно требуется только для нестандартных или частных конечных точек Snowflake |
| **Paste API key/token** | Ваш токен аутентификации &mdash; см. [Варианты аутентификации](#authentication-options) в следующем разделе |

</SimpleTable>

#### Варианты аутентификации {#authentication-options}

Поле ключа/токена принимает обычный API-токен или токен программного доступа (PAT) в зависимости от конфигурации вашего аккаунта Snowflake. Оба типа вводятся в одном и том же месте: в ответ на запрос **Paste API key/token** в терминале или через **Set key/token** (пункт 3) в TUI.

1. В своем аккаунте Snowflake [создайте API-токен или PAT](https://docs.snowflake.com/en/user-guide/programmatic-access-tokens#label-pat-generate).
2. Выберите **Generate token** и скопируйте значение токена.
3. Вернитесь в <Constant name="wizard" /> и вставьте PAT в ответ на запрос ключа/токена. 

Чтобы задать модель Snowflake Cortex по умолчанию, добавьте идентификатор модели в `~/.dbt/wizard/config.toml`:

```toml
model = "SNOWFLAKE_CORTEX_MODEL_ID"
```

### Databricks Unity AI Gateway <Lifecycle status="beta"/>

<Constant name="wizard" /> подключается к Databricks через [Unity Catalog AI Gateway](https://docs.databricks.com/aws/en/ai-gateway/), поэтому вы используете собственные модели, обслуживаемые в вашем рабочем пространстве Databricks. Убедитесь, что [конечные точки обслуживания моделей](https://docs.databricks.com/en/machine-learning/model-serving/index.html), которые вы планируете использовать, развернуты, а ваш токен Databricks дает разрешение на отправку запросов к ним.

```bash
export DATABRICKS_API_KEY="dapi..."
wizard providers configure databricks
wizard providers enable databricks
wizard providers list
wizard debug models
```

Команда `wizard providers configure databricks` сначала запрашивает URL вашего рабочего пространства, а затем имя конечной точки обслуживания для каждой включаемой модели:

```
Enable this provider? [Y/n]:
Models to enable [1]:
Databricks workspace URL (e.g. https://adb-1234567890.azuredatabricks.net):
Endpoint name for databricks/claude-sonnet-4-6:
Paste API key/token, or press enter to configure it later:
```

<SimpleTable>

| Запрос | Что ввести |
|--------|---------------|
| **Databricks workspace URL** | URL вашего рабочего пространства Databricks (например, `https://adb-1234567890.azuredatabricks.net`) |
| **Endpoint name** | Имя конечной точки обслуживания для каждой модели (например, `databricks-claude-sonnet-4-6`). <Constant name="wizard" /> предлагает имя конечной точки по умолчанию для каждой модели |
| **Paste API key/token** | Ваш персональный токен доступа Databricks (PAT) |

</SimpleTable>

По умолчанию <Constant name="wizard" /> сопоставляет следующие модели с конечными точками обслуживания Databricks. Во время настройки вы можете переопределить любое имя конечной точки:

<SimpleTable>

| Модель | Имя конечной точки по умолчанию |
|-------|----------------------|
| `claude-sonnet-4-6` | `databricks-claude-sonnet-4-6` |
| `claude-opus-4-7` | `databricks-claude-opus-4-7` |
| `claude-haiku-4-5` | `databricks-claude-haiku-4-5` |
| `gpt-5.5` | `databricks-gpt-5-5` |
| `gpt-5.4` | `databricks-gpt-5-4` |
| `gpt-5.4-mini` | `databricks-gpt-5-4-mini` |

</SimpleTable>

Чтобы задать модель Databricks по умолчанию, добавьте идентификатор модели в `~/.dbt/wizard/config.toml`:

```toml
model = "databricks/claude-sonnet-4-6"
```

## Связанная документация

* [Установка <Constant name="wizard" />](/docs/dbt-ai/wizard-cli)
* [Справочник по конфигурации](/docs/dbt-ai/wizard-config)
* [dbt Wizard в Studio IDE](/docs/dbt-ai/wizard-ide)
