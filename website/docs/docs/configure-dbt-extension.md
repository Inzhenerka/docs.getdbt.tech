---
title: "Настройка локального окружения"
sidebar_label: "Настройка локального окружения"
id: "configure-dbt-extension"
description: "Оптимизируйте среду расширения VS Code (файлы, переменные окружения, подключение)."
availability: local_all
---

import EnvFileConsiderations from '/snippets/_env-file-considerations.md';

Независимо от того, используете ли вы <Constant name="dbt_platform" /> или самостоятельно размещаете dbt, следуйте инструкциям на этой странице, чтобы:

<!-- no toc -->
- [Подготовить локальное окружение](#prepare-your-local-setup)
- [Задать переменные окружения локально](#set-environment-variables-locally)
- [Настроить расширение dbt](#set-environment-variables-locally)

Если вы только знакомитесь с dbt или начинаете работу над новым проектом, можете пропустить эту страницу и перейти к [краткому руководству по dbt v2](/guides/dbt?step=1), чтобы начать работу с расширением dbt.

Шаги немного различаются в зависимости от того, используете ли вы <Constant name="dbt_platform" /> или самостоятельно развернутый dbt.

- <Constant name="dbt_platform" /> &mdash; Вы воспроизведете свою среду <Constant name="dbt_platform" /> локально, чтобы получить доступ к таким мощным возможностям, как <Constant name="mesh" />, отложенное разрешение ссылок (deferral) и другим. Если в вашем проекте есть переменные окружения, вы также зададите их локально, чтобы использовать возможности расширения для VS Code.
- Самостоятельное развертывание &mdash; Если вы самостоятельно развертываете dbt, у вас, скорее всего, уже настроены локальная среда и переменные окружения. Используйте эту страницу, чтобы убедиться, что ваша существующая локальная среда и переменные окружения корректно работают с расширением для VS Code.

## Предварительные требования {#prerequisites}

- Скачано и установлено расширение dbt для VS Code
- Базовое понимание [рабочих процессов Git](/docs/platform/git/version-control-basics) и [структуры проекта dbt](/best-practices/how-we-structure/1-guide-overview)
- [Лицензия разработчика или аналитика](https://www.getdbt.com/pricing)\*, если вы используете <Constant name="dbt_platform" />. Обратите внимание: [лицензия типа Analyst](/docs/platform/manage-access/about-user-access?version=1.12#licenses) больше не доступна для приобретения.

## Подготовить локальное окружение {#prepare-your-local-setup}

В этом разделе мы пошагово разберём, как подготовить локальное окружение для расширения dbt в VS Code. Если вы пользователь <Constant name="dbt_platform" /> и установили расширение VS Code, выполните эти шаги. Если вы используете self‑hosted вариант, у вас, скорее всего, уже есть локальная настройка и переменные окружения, но вы можете проверить это, следуя данным шагам.

1. [Клонируйте](https://code.visualstudio.com/docs/sourcecontrol/overview#_cloning-a-repository) репозиторий вашего проекта dbt у вашего Git-провайдера на локальный компьютер. Если вы используете <Constant name="dbt_platform" />, клонируйте тот же репозиторий, который подключён к вашему проекту.
2. Убедитесь, что у вас есть [файл `profiles.yml`](/docs/local/profiles.yml) для dbt. Этот файл определяет подключение к вашему хранилищу данных. Если его нет, выполните `dbt init` в терминале, чтобы настроить адаптер. 
3. Проверьте `profiles.yml` и конфигурацию проекта, выполнив `dbt debug`.
4. Добавьте файл `dbt_cloud.yml` из настроек аккаунта <Constant name="dbt_platform" />:
   - Перейдите в **Your profile** → **VS Code Extension** → **Download credentials**.
   - Поместите скачанный файл в каталог `~/.dbt/`. Это зарегистрирует расширение и подключит его к <Constant name="dbt_platform" />, а также включит функции платформы, такие как <Constant name="mesh" /> и отложенное разрешение ссылок (deferral). Структура файла и обязательные поля описаны в разделе [`dbt_cloud.yml`](/reference/dbt_cloud.yml).
   - Убедитесь, что `project-id` в [блоке `dbt-cloud` файла `dbt_project.yml`](/reference/dbt_cloud.yml#the-dbt-cloud-block-in-dbt_projectyml) соответствует проекту, над которым вы работаете.
5. Проверьте подключение с вашего рабочего компьютера (например, выполнив `dbt debug` в терминале). Ваш локальный компьютер подключается напрямую к хранилищу данных и Git.  
   - Пользователям <Constant name="dbt_platform" />: убедитесь, что доступ с вашего ноутбука или через VPN разрешён; IP-адреса <Constant name="dbt_platform" /> больше не применяются. При возникновении проблем обратитесь к администратору.
   - Пользователям <Constant name="core" />: скорее всего, это уже настроено.
6. (Необязательно) Если ваш проект использует переменные окружения, [найдите их](/docs/build/environment-variables#setting-and-overriding-environment-variables) в <Constant name="dbt_platform" /> и [задайте их](#set-environment-variables-locally) в VS Code или Cursor.
   - Пользователям <Constant name="dbt_platform" />: скопируйте все переменные окружения с вкладки **Deploy → Environments → Environment variables** в <Constant name="dbt_platform" />.  Замаскированные секреты скрыты.  Обратитесь к администратору, чтобы получить их значения.  
    <Lightbox src="/img/docs/dbt-platform/using-dbt-platform/Environment Variables/navigate-to-env-vars.png" title="Вкладка переменных окружения"/>

## Задайте переменные окружения локально {#set-environment-variables-locally}

Переменные окружения используются для аутентификации и конфигурации.

Этот раздел наиболее актуален для пользователей [расширения dbt для VS Code](/docs/about-dbt-extension) и <Constant name="dbt_platform"/>, у которых переменные окружения настроены как часть рабочей среды. Если вы используете dbt локально, вы также можете установить расширение для VS Code и пользоваться его возможностями и действиями &mdash; при этом настраивать эти переменные может не потребоваться, если только ваша конфигурация явно этого не требует.

В таблице ниже показаны различные варианты и случаи, когда их следует использовать:

| Место | Влияет на | Состояние сессии | Когда использовать |
|-----------|----------|-----------|-----------|
| [**Профиль оболочки** ](#configure-at-the-os-or-shell-level)| Терминал  | ✅ Постоянно | Переменные остаются активными глобально и доступны во всех сеансах терминала.|
| [**Настройки VS Code/Cursor**](#configure-in-the-vs-code-extension-settings) | Меню расширения + <Term id="lsp" /> | ✅ Для каждого профиля VS Code/Cursor | Рабочие процессы только в редакторе с использованием действий из меню расширения. |
| [**Сеанс терминала**](#configure-in-the-terminal-session)  | Только текущий терминал | ❌ Временно | Разовое тестирование. |

:::tip 
Если вы хотите использовать и меню расширения VS Code, и терминал для запуска команд dbt, определите переменные и в `shell`‑профиле, и в настройках VS Code/Cursor. Так они будут доступны глобально в терминале и внутри VS Code/Cursor.
:::

### Настройка на уровне ОС или оболочки {#configure-at-the-os-or-shell-level}
Определите переменные один раз на уровне ОС или оболочки, чтобы они были доступны во всех сеансах терминала. Даже если вы закроете окно терминала, переменные останутся вам доступны.

<Tabs>
<TabItem value="mac-linux" label="Mac / Linux">

1. Откройте файл конфигурации shell в текстовом редакторе с помощью следующих команд (если файл не существует, создайте его, например с помощью `vi ~/.zshrc` или `vi ~/.bashrc`):
    ```bash
    open -e ~/.zshrc ## for zsh (macOS)
    nano ~/.bashrc ## for bash (Linux or older macOS)
   ```
2. В открывшемся файле добавьте ваши переменные окружения. Например:
      - Для zsh (macOS):
        ```bash
            ## ~/.zshrc 
            export DBT_ENV_VAR1="my_value"
            export DBT_ENV_VAR2="another_value"
        ```
      - Для bash (Linux или более старых версий macOS):
        ```bash
            ## ~/.bashrc or ~/.bash_profile
            export DBT_ENV_VAR1="my_value"
            export DBT_ENV_VAR2="another_value"
        ```
3. Сохраните файл.  
4. Запустите новую shell‑сессию, закрыв и открыв терминал, либо выполнив `source ~/.zshrc` или `source ~/.bashrc` в терминале.
5. Проверьте переменные, выполнив `echo $DBT_ENV_VAR1` и `echo $DBT_ENV_VAR2` в терминале.<br />

Если значение выводится в терминал, всё настроено правильно. Эти переменные теперь будут доступны:
- Во всех будущих терминальных сессиях
- Для всех команд dbt, запускаемых в терминале

</TabItem>
<TabItem value="windows" label="Windows">
В Windows есть два способа создать постоянные переменные окружения: через PowerShell или через System Properties. 

Ниже приведены шаги для настройки переменных окружения с помощью PowerShell.

**PowerShell**
1. Выполните следующие команды в PowerShell:
  ```powershell
    [Environment]::SetEnvironmentVariable("DBT_ENV_VAR1","my_value","User")
    [Environment]::SetEnvironmentVariable("DBT_ENV_VAR2","another_value","User")
  ```
1. Это сохранит переменные на постоянной основе для вашей учётной записи пользователя. Чтобы сделать их доступными для всех пользователей системы, замените `"User"` на `"Machine"` (требуются права администратора).
2. Перезапустите VS Code или выберите **Developer: Reload Window**, чтобы изменения вступили в силу.
3. Проверьте изменения, выполнив `echo $DBT_ENV_VAR1` и `echo $DBT_ENV_VAR2` в терминале.

**System properties (Environment Variables)**
1. Нажмите **Start** → введите **Environment Variables** → откройте **Edit the system environment variables**. 
2. На вкладке **Advanced** нажмите **Environment Variables…**.
3. В разделе **User variables** нажмите **New…**.
4. Добавьте переменные и значения. Например:
    - Variable name: `DBT_ENV_VAR1`
    - Variable value: `my_value`
5. Повторите для остальных переменных и нажмите **OK**.
6. Перезапустите VS Code или Cursor.
7. Проверьте изменения, выполнив `echo $DBT_ENV_VAR1` и `echo $DBT_ENV_VAR2` в терминале.
</TabItem>
</Tabs>

#### О поддержке файлов `.env`

[dbt](/docs/local/install-dbt) и расширение dbt для VS Code могут автоматически считывать переменные окружения из файла `.env` в текущем рабочем каталоге (папке, в которую вы переходите с помощью `cd` и из которой запускаете команды dbt в терминале), если такой файл существует. Переменные окружения, заданные в файле `.env`, доступны при запуске команд dbt в терминале и при использовании действий меню расширения.

<EnvFileConsiderations />

### Настройка в параметрах расширения VS Code {#configure-in-the-vs-code-extension-settings}


Чтобы использовать действия меню и кнопки расширения dbt, можно настроить переменные окружения непосредственно в интерфейсе [пользовательских настроек VS Code](vscode://settings/dbt.environmentVariables) или в файле `.env` в текущем рабочем каталоге. Это относится как к вашим пользовательским переменным, так и к любым автоматическим [переменным <Constant name="dbt_platform"/>](/docs/build/environment-variables) (например, `DBT_CLOUD_ENVIRONMENT_NAME`), от которых зависит ваш проект.

- Настройте переменные в **пользовательских настройках** VS Code или в файле `.env`, чтобы расширение могло их распознать. Например, они будут доступны при использовании функций на базе <Term id="lsp" />, действия «Show build menu» и других возможностей.
- VS Code не наследует переменные, заданные в терминале VS Code или во внешних командных оболочках.
- Терминал использует системные переменные окружения и не наследует переменные, заданные в настройках расширения dbt для VS Code. Например, при запуске команды dbt в терминале переменные расширения dbt для VS Code не будут ни считываться, ни использоваться.

Чтобы настроить переменные окружения в VS Code/Cursor:

<Tabs>
<TabItem value="user-settings" label="Откройте User Settings">
1. Откройте [Command Palette](https://code.visualstudio.com/docs/configure/settings#_user-settings) (Cmd + Shift + P на Mac, Ctrl + Shift + P на Windows/Linux).
2. Выберите **Preferences: Open User Settings** в выпадающем списке. 
3. Откройте страницу [VS Code user settings](vscode://settings/dbt.environmentVariables).
4. Найдите `dbt.environmentVariables`.
5. В разделе **dbt:Environment Variables** добавьте нужные переменные и значения.
6. Нажмите **Ok**, чтобы сохранить изменения.
7. Перезагрузите расширение VS Code, чтобы применить изменения: откройте Command Palette и выберите **Developer: Reload Window**. 
8. Проверьте изменения, запустив команду dbt и изучив вывод.
</TabItem>

<TabItem value="env-file" label="Открыть файл .env">

1. Создайте файл `.env` в текущем рабочем каталоге (обычно в корне вашего проекта dbt, на том же уровне, что и файл `dbt_project.yml`).
2. Добавьте в файл переменные окружения. Например:
    ```env
    DBT_ENV_VAR1=my_value
    DBT_ENV_VAR2=another_value
    ```
3. Сохраните файл.
4. Перезагрузите расширение VS Code, чтобы применить изменения.
5. Проверьте изменения: запустите команду dbt с помощью кнопки меню расширения в правом верхнем углу и проверьте вывод. Например, команда `dbtf debug` покажет параметры подключения со значениями из `.env`:
   ```shell
   dbtf debug
   ...
   Debugging connection:
   "authenticator": "my_authenticator",
   "account": "my_account",
   "user": "my_user",
   "database": "my_database",        # Загружено из DBT_MY_DATABASE в .env
   "schema": "my_schema",            # Загружено из DBT_MY_SCHEMA в .env
   ```

</TabItem>

<!-- закомментировано, поскольку это может быть не лучшим способом настройки переменных окружения, и вместо него мы рекомендуем файл .env https://github.com/dbt-labs/dbt/issues/12106
<TabItem value="settings-json" label="Открыть настройки (JSON)">
1. Откройте [палитру команд](https://code.visualstudio.com/docs/configure/settings#_user-settings) (Cmd + Shift + P для Mac, Ctrl + Shift + P для Windows/Linux).
2. Затем выберите **Preferences: Open Settings (JSON)** в раскрывающемся меню. 
3. Откройте файл [JSON](vscode://command/workbench.action.openSettingsJson).
4. Добавьте переменные окружения в виде объекта JSON в файл `.vscode/settings.json` вашего проекта dbt. Например:
    ```json
    {
    "dbt.environmentVariables": {
      "DBT_ENV_VAR1": "test_santi_value" // замените DBT_ENV_VAR1 и test_santi_value на свою переменную и значение
     }
    }
    }
    ```
5. Сохраните изменения.
6. Перезагрузите расширение VS Code, чтобы применить изменения.
7. Проверьте изменения, запустив dbt‑команду и посмотрев вывод.
</TabItem>
-->
</Tabs>

### Настройка в сеансе терминала {#configure-in-the-terminal-session}

Переменные окружения можно задать прямо в терминальной сессии с помощью команды `export`. Важно учитывать следующее:
- Переменные будут видны только командам, запущенным в рамках этой сессии терминала. 
- Они действуют только в текущей сессии — при открытии нового терминала значения будут потеряны. 
- Встроенные кнопки и меню расширения dbt для VS Code эти переменные использовать не будут.

Чтобы задать переменные окружения в терминальной сессии:
1. Выполните следующую команду в терминале, заменив `DBT_ENV_VAR1` и `test1` на ваши значения.
    <Tabs>
    <TabItem value="mac-linux" label="Mac / Linux">

        ```bash
        export DBT_ENV_VAR1=test1
        ```

    </TabItem>
    <TabItem value="windows-cmd" label="Windows Cmd">
    Дополнительную информацию о команде `set` см. в [документации Microsoft](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1).

        ```bash
        set DBT_ENV_VAR1=test1 
        
        ```

    </TabItem>
    <TabItem value="windows-powershell" label="Windows PowerShell">
    Подробнее о синтаксисе `$env:` см. в [документации Microsoft](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables?view=powershell-7.5#use-the-variable-syntax).

        ```bash
        $env:DBT_ENV_VAR1 = "test1"
        ```

    </TabItem>
    </Tabs>
2. Проверьте изменения, запустив команду dbt и изучив вывод.

## Настройки расширения dbt {#dbt-extension-settings}
<!-- moved content from website/docs/docs/local/install-dbt?version=2.md to here -->

После установки расширения dbt и настройки локального окружения вы можете дополнительно сконфигурировать его под свой рабочий процесс разработки:

1. Откройте настройки VS Code, нажав `Ctrl+,` (Windows/Linux) или `Cmd+,` (Mac).
2. Введите `dbt` в строку поиска. На этой странице можно настроить параметры расширения в соответствии с вашими потребностями.

<Lightbox src="/img/docs/extension/dbt-extension-settings.png" width="70%" title="Настройки расширения dbt в настройках VS Code."/>

Следующие настройки наиболее актуальны, если вы устанавливаете dbt или управляете им самостоятельно. Большинству пользователей задавать их не нужно, поскольку расширение может автоматически загружать v2 и управлять им.

| Настройка                     | Описание |
| ----------------------------- | ----------- |
| `dbt.fusionPath`              | Путь к исполняемому файлу v2. Расширение запускает языковой сервер через этот файл (`dbt-fusion lsp`). Укажите этот путь, если устанавливаете v2 вручную &mdash; например, в [изолированной среде](/docs/dbt-versions/dbt-version-compatibility#verify-binaries-for-manual-and-air-gapped-installs) &mdash; вместо того чтобы позволить расширению загрузить его. |
| `dbt.badReleasesManifestPath` | Путь к локальной копии [манифеста заведомо проблемных выпусков](/docs/dbt-versions/dbt-version-compatibility#known-bad-releases). Используйте эту настройку, если у вас нет исходящего доступа к сети и вы распространяете манифест вместе с комплектом исполняемых файлов (например, при установке в изолированной среде). |
| `dbt.environmentVariables`    | Переменные окружения, которые расширение передаёт dbt. См. раздел [Настройка в параметрах расширения VS Code](#configure-in-the-vs-code-extension-settings). |

:::note Переход с отдельного исполняемого файла языкового сервера

В предыдущих версиях расширения использовались отдельные настройки `dbt.cliPath` и `dbt.lspPath` для двух разных исполняемых файлов. В текущих версиях используется единая настройка `dbt.fusionPath`, поскольку в dbt v2 CLI и языковой сервер поставляются в одном исполняемом файле. Если ранее вы настроили `dbt.lspPath`, перенесите этот путь в `dbt.fusionPath`. Подробнее см. в разделе [Совместимость версий](/docs/dbt-versions/dbt-version-compatibility).

:::

## Ассоциации файлов и другие расширения

Расширение dbt не зависит от [ассоциаций файлов](https://code.visualstudio.com/docs/languages/identifiers) `.sql`. Оно активируется при обнаружении вашего `dbt_project.yml`, поэтому функции <Term id="lsp" /> &mdash; такие как автодополнение, переход к определению и IntelliSense с учётом структуры базы данных &mdash; работают независимо от того, назначен ли вашим файлам тип `sql` или `jinja-sql`. Разница между этими двумя типами заключается только в подсветке синтаксиса и значке файла.

Ассоциация имеет значение для *других* расширений. Любое расширение, которое обрабатывает тип файлов `sql`, &mdash; будь то Snowflake, SQL Server или другой инструмент для работы с базами данных, &mdash; может перехватывать ваши файлы dbt и переопределять функции IntelliSense, которые иначе предоставляло бы расширение dbt. Например, расширение Snowflake обрабатывает только файлы, связанные с типом `snowflake-sql`. Поэтому `snowflake-sql` &mdash; неподходящая ассоциация для ваших файлов dbt: она передаёт их расширению Snowflake вместо того, чтобы обрабатывать их как файлы dbt. Если у вас установлено несколько расширений для работы с SQL, стоит проверить, какое из них обрабатывает ваши файлы `.sql`, чтобы избежать неожиданного поведения.

Если вы хотите использовать оба расширения, храните файлы разовых запросов в отдельном каталоге, исключённом из отслеживания Git, и ограничьте ассоциацию Snowflake только этим путём:

```json
{
  "files.associations": {
    "**/snowflake_sandbox/*.sql": "snowflake-sql",
    "*.sql": "sql"
  }
}
```

## Следующие шаги
Теперь, когда вы настроили локальную среду, можно начать использовать расширение dbt, чтобы упростить рабочие процессы разработки в dbt. Для начала ознакомьтесь со следующими материалами:

- [О расширении dbt](/docs/about-dbt-extension)
- [Возможности расширения dbt](/docs/dbt-extension-features)
- [Вход в систему](/docs/sign-in-dbt-extension)
