<VersionBlock lastVersion="1.99">

:::tip Обновитесь для автоматического получения обновлений
Обновитесь до [v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2), чтобы запускать <Constant name="wizard"/> командой `wizard` и автоматически получать обновления.
:::

</VersionBlock>

<Steps>

<Step title="Установите dbt Wizard CLI">

Запустите установочный скрипт для вашей операционной системы:

macOS/Linux:

```bash
curl -fsSL https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.sh | sh
```

Windows (PowerShell):

```powershell
irm https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.ps1 | iex
```

Этот скрипт устанавливает <Constant name="wizard"/> в `/usr/local/bin/wizard` вместе с [dbt Information Schema](/docs/build/dbt-information-schema), благодаря которой <Constant name="wizard"/> отвечает с учётом контекста проекта.

</Step>

<Step title="Начните сеанс">

Проверьте установку и начните интерактивный сеанс:

```bash
wizard --version   # confirm the install
wizard             # start a session
```

</Step>

</Steps>

Информацию о настройке при первом запуске и оплате см. в разделе [Установка <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli).
