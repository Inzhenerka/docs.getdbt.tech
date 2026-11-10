При использовании <Term id="managed" /> инференса dbt вы можете в любой момент переключаться между поддерживаемыми управляемыми моделями с помощью раскрывающегося списка выбора модели рядом с элементом управления **Agent mode** (где вы выбираете **Ask for approval** или **Edit files automatically**). 

- В [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) и на [главной вкладке <Constant name="wizard" />](/docs/platform/wizard-home) откройте раскрывающийся список выбора модели рядом с элементом управления **Agent mode** на панели <Constant name="wizard" />, затем выберите модель.
- В списке отображаются доступные вам управляемые модели. Сведения о доступных моделях и тарифах на их токены приведены в [таблице тарифов поставщиков моделей](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model).
- Если вы [используете собственный ключ (BYOK)](/docs/dbt-ai/wizard-byok), <Constant name="wizard" /> использует поставщика и модель, настроенные для вашего ключа, а не модель из списка управляемых моделей.

<Lightbox src="/img/docs/dbt-platform/wizard-model-picker.png" width="95%" title="Раскрывающийся список выбора модели рядом с элементом управления Agent mode на панели Wizard." />
