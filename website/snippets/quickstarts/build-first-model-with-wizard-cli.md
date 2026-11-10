### Создайте модель с помощью ИИ в dbt Wizard {#build-it-with-ai-using-dbt-wizard}

Не хотите писать SQL вручную? [CLI <Constant name="wizard" />](/docs/dbt-ai/wizard-cli?section=qs-build-with-ai-cli) может создать ту же модель прямо из терминала, опираясь на фактическую схему и граф зависимостей вашего проекта. Но будьте осторожны: говорят, что этот волшебник умеет <WizardPopcorn>творить заклинания</WizardPopcorn>.

1. Установите CLI <Constant name="wizard" />:

<Tabs groupId="operating-systems" queryString>

<TabItem value="macos" label="macOS/Linux">

```shell
curl -fsSL https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.sh | sh
```

</TabItem>

<TabItem value="windows" label="Windows (PowerShell)">

```powershell
irm https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.ps1 | iex
```

</TabItem>

</Tabs>

2. Запустите `wizard` в каталоге проекта, чтобы начать сеанс, а затем пройдите первоначальную настройку (если вы ещё этого не сделали).

<Lightbox src="/img/docs/wizard-cli-intro.png" title="Сеанс dbt Wizard в терминале" />

3. Введите запрос: «Создай модель customers, которая объединяет orders и customers и включает дату последнего заказа и общее количество заказов для каждого клиента».
4. Проверьте SQL, сгенерированный <Constant name="wizard" />, а затем примите его, чтобы сохранить модель.
5. Введите `dbt run`, чтобы построить её.

В любом случае вы получите одну и ту же работающую модель. Подробные инструкции по настройке см. в разделе [Локальное использование dbt Wizard](/docs/dbt-ai/wizard-cli).
