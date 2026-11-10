:::info Сопоставление лицензий с помощью SCIM

<Constant name="dbt_platform"/> поддерживает автоматическое назначение лицензий с помощью SCIM со следующими вариантами для разных поставщиков удостоверений:


<Expandable alt_header="Показать варианты для каждого поставщика удостоверений">

- **Okta:** Включите переключатель **Ignore dbt license mapping** в разделе **Account settings > SSO & SCIM** и следуйте [документации по управлению лицензиями через Okta](/docs/platform/manage-access/scim-manage-user-licenses).
- **Entra ID:** Используйте [сопоставление групп Active Directory с лицензиями на основе SSO](/docs/platform/manage-access/seats-and-users#mapped-configuration). Оно работает совместно с активной конфигурацией SCIM для Entra ID. Оставьте переключатель **Ignore dbt license mapping** _выключенным_, поскольку его включение удаляет сопоставление лицензий для пользователей Entra ID. Сопоставление лицензий через SCIM с использованием [пользовательских атрибутов](https://learn.microsoft.com/en-us/entra/fundamentals/custom-security-attributes-overview) может быть возможно в зависимости от вашей конфигурации Entra ID, но такая настройка не поддерживается &mdash; **используйте её на свой страх и риск**.

</Expandable>

Дополнительные сведения см. в ответе на вопрос [Поддерживает ли SCIM автоматическое назначение лицензий?](/docs/platform/manage-access/scim-faq#does-scim-support-automatic-license-assignment) в разделе часто задаваемых вопросов.
:::
