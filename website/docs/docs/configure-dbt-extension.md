---
title: "Настройка локального окружения"
sidebar_label: "Настройка локального окружения"
id: "configure-dbt-extension"
description: "Оптимизация локальной среды расширения dbt (файлы, переменные окружения, подключение)."
---

Независимо от того, используете ли вы сейчас <Constant name="dbt_platform" /> или разворачиваете решение самостоятельно с помощью <Constant name="fusion" />, либо вы пользователь <Constant name="core" />, который переходит на <Constant name="fusion" />, следуйте инструкциям на этой странице, чтобы:

<!-- no toc -->
- [Подготовить локальное окружение](#prepare-your-local-setup)
- [Задать переменные окружения локально](#set-environment-variables-locally)
- [Настроить расширение dbt](#configure-the-dbt-extension)

Если вы только начинаете работать с dbt или запускаете новый проект, эту страницу можно пропустить и сразу перейти к нашему [Quickstart для <Constant name="fusion_engine"/>](/guides/fusion?step=1), чтобы начать работу с расширением dbt.

Шаги немного различаются в зависимости от того, используете ли вы <Constant name="dbt_platform" /> или самостоятельно хостите решение с <Constant name="fusion" />.

- <Constant name="dbt_platform" /> &mdash; вы зеркалируете своё окружение <Constant name="dbt_platform" /> локально, чтобы получить доступ к возможностям на базе <Constant name="fusion" />, таким как <Constant name="mesh" />, deferral и другим. Если в вашем проекте используются переменные окружения, их также нужно будет задать локально, чтобы использовать возможности расширения VS Code.
- Self-hosted &mdash; при самостоятельном хостинге с <Constant name="fusion" /> или при переходе с <Constant name="core" /> на <Constant name="fusion" /> у вас, скорее всего, уже есть локальная настройка и переменные окружения. Используйте эту страницу, чтобы убедиться, что существующая конфигурация корректно работает с <Constant name="fusion_engine" /> и расширением VS Code.

## Предварительные требования {#prerequisites}

- Установлен <Constant name="fusion_engine" />
- Скачано и установлено расширение dbt для VS Code
- Базовое понимание [Git‑процессов](/docs/cloud/git/version-control-basics) и [структуры проекта dbt](/best-practices/how-we-structure/1-guide-overview)
- [Лицензия разработчика или аналитика](https://www.getdbt.com/pricing), если вы используете <Constant name="dbt_platform" />

## Подготовить локальное окружение {#prepare-your-local-setup}

В этом разделе мы пошагово разберём, как подготовить локальное окружение для расширения dbt в VS Code. Если вы пользователь <Constant name="dbt_platform" /> и установили расширение VS Code, выполните эти шаги. Если вы используете self‑hosted вариант, у вас, скорее всего, уже есть локальная настройка и переменные окружения, но вы можете проверить это, следуя данным шагам.

1. [Склонируйте](https://code.visualstudio.com/docs/sourcecontrol/overview#_cloning-a-repository) репозиторий вашего dbt‑проекта из Git‑провайдера на локальную машину. Если вы используете <Constant name="dbt_platform" />, клонируйте тот же репозиторий, который подключён к вашему проекту.
2. Убедитесь, что у вас есть файл [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml). В нём описывается подключение к вашему хранилищу данных. Если файла нет, выполните `dbt init` в терминале, чтобы настроить адаптер.
3. Проверьте корректность `profiles.yml` и конфигурации проекта, запустив `dbt debug`.
4. Добавьте файл `dbt_cloud.yml` из настроек аккаунта <Constant name="dbt_platform" />:
   - Перейдите в **Your profile** → **VS Code Extension** → **Download credentials**.
   - Скачайте файл `dbt_cloud.yml`, который включает ваш [**Personal access Token (PAT)**](/docs/dbt-cloud-apis/user-tokens), и поместите его в директорию `~/.dbt/`. Это зарегистрирует и подключит расширение к <Constant name="dbt_platform" /> и включит возможности платформы, такие как <Constant name="mesh" /> и deferral.
   - Проверьте, что `project_id` в файле `dbt_project.yml` соответствует проекту, над которым вы работаете.
5. Подтвердите соединение с рабочей станции (например, запустив `dbt debug` в терминале). Локальный компьютер должен напрямую подключаться к вашему хранилищу данных и Git.  
   - Пользователи <Constant name="dbt_platform" />: убедитесь, что ваш ноутбук или VPN разрешены; IP‑адреса <Constant name="dbt_platform" /> больше не применяются. При возникновении проблем обратитесь к администратору.
   - Пользователи <Constant name="core" />: скорее всего, это уже было настроено ранее.
6. (Опционально) Если в проекте используются переменные окружения, [найдите их](/docs/build/environment-variables#setting-and-overriding-environment-variables) в <Constant name="dbt_platform" /> и [задайте локально](#set-environment-variables-locally) в VS Code или Cursor.
   - Пользователи <Constant name="dbt_platform" />: скопируйте переменные окружения из вкладки **Deploy → Environments → Environment variables** в <Constant name="dbt_platform" />. Замаскированные секреты скрыты — для получения их значений обратитесь к администратору.  
    <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/navigate-to-env-vars.png" title="Environment variables tab"/>

## Задайте переменные окружения локально {#set-environment-variables-locally}

Переменные окружения используются для аутентификации и конфигурации.

Этот раздел в первую очередь актуален для пользователей [расширения dbt для VS Code](/docs/about-dbt-extension) и <Constant name="dbt_platform"/>, у которых переменные окружения являются частью настройки рабочего пространства. Если вы используете <Constant name="fusion"/> локально, вы также можете установить расширение VS Code и пользоваться его возможностями и действиями &mdash; однако настраивать эти переменные нужно только в том случае, если этого требует ваша конфигурация.

В таблице ниже показаны различные варианты и случаи, когда их следует использовать:

| Место | Влияет на | Состояние сессии | Когда использовать |
|-----------|----------|-----------|-----------|
| [**Shell profile** ](#configure-at-the-os--shell-level)| Terminal  | ✅ Постоянно | Переменные остаются активными глобально и доступны между сессиями терминала.|
| [**VS Code/Cursor settings**](#configure-in-the-vs-code-extension-settings) | Меню расширения + <Term id="lsp" /> | ✅ На профиль VS Code/Cursor | Рабочие процессы только в редакторе с использованием действий расширения. |
| [**Terminal session**](#configure-in-the-terminal-session)  | Только текущий терминал | ❌ Временно | Разовые проверки и тесты. |

:::tip 
Если вы хотите использовать и меню расширения VS Code, и терминал для запуска команд dbt, определите переменные и в `shell`‑профиле, и в настройках VS Code/Cursor. Так они будут доступны глобально в терминале и внутри VS Code/Cursor.
:::

#### Настройка на уровне ОС или shell {#configure-at-the-os-or-shell-level}
Определите переменные один раз на уровне операционной системы или shell, чтобы они были доступны во всех терминальных сессиях. Даже если вы закроете окно терминала, переменные сохранятся.

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

#### Настройки расширения VS Code {#configure-in-the-vs-code-extension-settings}

Чтобы использовать действия и кнопки меню расширения dbt, вы можете настроить переменные окружения напрямую в интерфейсе [VS Code User Settings](vscode://settings/dbt.environmentVariables) или в любом `.env`‑файле в корне проекта. Это относится как к пользовательским переменным, так и к автоматически создаваемым [переменным <Constant name="dbt_platform"/>](/docs/build/environment-variables) (например, `DBT_CLOUD_ENVIRONMENT_NAME`), от которых зависит ваш проект.

- Настройте переменные в **User Settings** VS Code или в любом `.env`‑файле, чтобы расширение их распознавало. Например, для возможностей на базе <Term id="lsp" />, пункта «Show build menu» и других функций.
- VS Code не наследует переменные, заданные в терминале VS Code или во внешних shell‑средах.
- Терминал использует системные переменные окружения и не наследует переменные, заданные в конфигурации расширения dbt для VS Code. Например, при запуске команды dbt в терминале переменные расширения использоваться не будут.

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

<TabItem value="env-file" label="Откройте файл .env">
1. В вашем dbt‑проекте создайте файл `.env` в корне (на одном уровне с `dbt_project.yml`).
2. Добавьте переменные окружения в файл. Например:
    ```env
    DBT_ENV_VAR1=my_value
    DBT_ENV_VAR2=another_value
    ```
3. Сохраните файл.
4. Перезагрузите расширение VS Code, чтобы применить изменения.
5. Проверьте изменения, запустив команду dbt через кнопку меню расширения в правом верхнем углу и изучив вывод.
</TabItem>

<!-- закомментировали, так как это может быть не лучшим способом настройки переменных окружения, и вместо этого мы рекомендуем файл .env: https://github.com/dbt-labs/dbt-core/issues/12106
<TabItem value="settings-json" label="Открыть Settings (JSON)">
1. Откройте [Command Palette](https://code.visualstudio.com/docs/configure/settings#_user-settings) (Cmd + Shift + P для Mac, Ctrl + Shift + P для Windows/Linux).
2. Затем выберите **Preferences: Open Settings (JSON)** в выпадающем меню.
3. Откройте файл [JSON](vscode://command/workbench.action.openSettingsJson).
4. Добавьте переменные окружения как JSON‑объект в файл `.vscode/settings.json` вашего dbt‑проекта. Например:
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

#### Настройка в сессии терминала {#configure-in-the-terminal-session}

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

## Настройка расширения dbt {#dbt-extension-settings}
<!-- moved content from website/docs/docs/fusion/install-fusion-cli.md to here -->

После установки расширения dbt и настройки локального окружения вы можете дополнительно сконфигурировать его под свой рабочий процесс разработки:

1. Откройте настройки VS Code, нажав `Ctrl+,` (Windows/Linux) или `Cmd+,` (Mac).
2. Найдите `dbt`. На этой странице вы сможете изменить параметры расширения в соответствии со своими потребностями.

<Lightbox src="/img/docs/extension/dbt-extension-settings.png" width="70%" title="Настройки расширения dbt в настройках VS Code."/>

## Следующие шаги {#next-steps}
Теперь, когда локальное окружение настроено, вы можете начать использовать расширение dbt для упрощения рабочих процессов разработки dbt. Ознакомьтесь со следующими материалами, чтобы продолжить:

- [О расширении dbt](/docs/about-dbt-extension)
- [Возможности расширения dbt](/docs/dbt-extension-features)
- [Зарегистрируйте расширение](/docs/install-dbt-extension#register-the-extension)
