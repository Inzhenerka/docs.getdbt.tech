<Constant name="wizard" /> поддерживает [модели <Term id="managed" />](/docs/dbt-ai/pricing-billing/overview#dbt-managed-providers) (оплата через dbt Labs, управлять ключом не требуется) и [модели с собственным ключом (BYOK)](/docs/dbt-ai/wizard-byok) (оплата напрямую провайдеру).

Ниже перечислены поддерживаемые провайдеры ИИ в зависимости от того, где вы работаете. Полный список доступных моделей см. в [таблице тарифов провайдеров моделей](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model). 

<Tabs defaultValue={props.defaultSurface || "platform"}>

<TabItem value="platform" label="dbt platform">

<SimpleTable>

| Провайдер | Доступ |
|---|---|
| [OpenAI](https://openai.com/policies/row-terms-of-use/) (по умолчанию) | dbt <Term id="managed" /> или BYOK |
| [Anthropic](https://www.anthropic.com/legal/consumer-terms)† | dbt <Term id="managed" /> или BYOK |
| Модели с открытыми весами (например, DeepSeek, Kimi и другие). | dbt <Term id="managed" /> |
| [Azure AI Foundry](https://www.microsoft.com/licensing/terms) / Azure OpenAI | BYOK |

</SimpleTable>

</TabItem>

<TabItem value="local" label="Локально (CLI)">

<SimpleTable>

| Провайдер | Доступ |
|---|---|
| [OpenAI](https://openai.com/policies/row-terms-of-use/) | dbt <Term id="managed" /> или BYOK |
| [Anthropic](https://www.anthropic.com/legal/consumer-terms)† | dbt <Term id="managed" /> или BYOK |
| Модели с открытыми весами (например, DeepSeek, Kimi и другие).  | dbt <Term id="managed" /> |
| [Azure AI Foundry](https://www.microsoft.com/licensing/terms) / Azure OpenAI | BYOK |
| [AWS Bedrock](https://aws.amazon.com/service-terms/) | BYOK |
| [Google Gemini](https://ai.google.dev/gemini-api/terms) | BYOK |
| [Snowflake Cortex](https://www.snowflake.com/en/legal/terms-of-service/) | BYOK |
| [Databricks Unity AI Gateway](https://www.databricks.com/legal/mcsa) | BYOK |

</SimpleTable>

Вы также можете подключить личную подписку OpenAI ChatGPT вместо ключа.

</TabItem>

</Tabs>

†Корпоративные лицензии и лицензии по подписке Anthropic (например, Claude Enterprise) не поддерживаются согласно [условиям использования](https://www.anthropic.com/legal/consumer-terms) Anthropic.
