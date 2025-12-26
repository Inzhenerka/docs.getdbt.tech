import FusionManualInstall from '/snippets/_fusion-manual-install.md';

Расширение dbt &mdash; доступно для [VS Code, Cursor](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview) и [Windsurf](https://open-vsx.org/extension/dbtLabsInc/dbt) &mdash; использует <Constant name="fusion_engine" />, чтобы сделать разработку в dbt более удобной и эффективной.

:::note

Это единственное официальное расширение dbt Labs для VS Code. Другие расширения _могут_ работать вместе с расширением dbt для VS Code, но они не тестируются и не поддерживаются dbt Labs. Актуальные обновления читайте в [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements).

:::

## Prerequisites

Перед установкой обязательно ознакомьтесь со страницей [Limitations](/docs/fusion/supported-features#limitations), так как некоторые функции пока не поддерживают <Constant name="fusion"/>.

Для использования расширения необходимо выполнить следующие требования:

| Prerequisite | Details |
| --- | --- |
| **<Constant name="fusion_engine" />** | [Расширение dbt для VS Code](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview) требует наличия бинарного файла <Constant name="fusion_engine" /> (небольшой исполняемый файл). Расширение предложит установить его автоматически, либо вы можете [установить его вручную](#install-fusion-manually) в любое время. <br /><br />[Зарегистрируйте email](#register-the-extension) в течение 14 дней после установки расширения dbt. Бесплатно для команд до 15 пользователей. |
| **Project files** | - Вам необходим файл конфигурации `profiles.yml`.<br /><br />⁃ В зависимости от выбранного [пути регистрации](#choose-your-registration-path), вам _может_ понадобиться [загрузить](#register-with-dbt_cloudyml) файл `dbt_cloud.yml`.<br /><br />⁃ Для использования расширения проект <Constant name="dbt_platform" /> не требуется. |
| **Editor** | Редактор кода [VS Code](https://code.visualstudio.com/), [Cursor](https://www.cursor.com/en) или [Windsurf](https://windsurf.com/editor). |
| **Operating systems** | Компьютер под управлением macOS, Windows или Linux. |
| **Configure your local setup** (Optional) | [Настройте расширение](/docs/configure-dbt-extension), чтобы локально воспроизвести вашу среду dbt, а также задайте локальные переменные окружения для использования возможностей расширения VS Code. |
| **Run dbt-autofix** (Optional) | Запустите [dbt-autofix](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-autofix), чтобы исправить ошибки и устаревшие элементы в вашем проекте dbt. |

## Install the extension

Чтобы установить расширение dbt для VS Code, выполните следующие шаги в выбранном редакторе:

1. Перейдите на вкладку **Extensions** и найдите `dbt`. Выберите расширение от издателя `dbtLabsInc` или `dbt Labs Inc` и нажмите **Install**.
    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="90%" title="Search for the extension"/>
2. Откройте dbt‑проект в среде VS Code, если вы ещё этого не сделали, и убедитесь, что он добавлен в текущее рабочее пространство. Если в строке состояния редактора отображается метка **dbt Extension**, значит расширение успешно установлено. Наведите курсор на эту метку, чтобы увидеть диагностическую информацию.
    <Lightbox src="/img/docs/extension/dbt-extension-statusbar.png" width="60%" title="If you see the 'dbt Extension` label, the extension is activated"/>
3. После активации расширение автоматически начнёт загрузку подходящего dbt Language Server (<Term id="lsp"/>) для вашей операционной системы.
    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="The dbt Language Server will be installed automatically"/>
4. Если dbt Fusion engine ещё не установлен на вашем компьютере, расширение предложит скачать и установить его. Следуйте инструкциям в уведомлении или [установите его вручную из командной строки](#install-fusion-manually).
    <Lightbox src="/img/docs/extension/install-dbt-fusion-engine.png" width="60%" title="Follow the prompt to install the dbt Fusion engine"/>
5. Запустите [инструмент обновления](#upgrade-to-fusion) расширения VS Code, чтобы подготовить ваш dbt‑проект к работе с Fusion и исправить ошибки и устаревшие конструкции.
6. (Необязательно) Если вы впервые используете расширение или VS Code/Cursor, вы можете [настроить локальную среду](/docs/configure-dbt-extension), чтобы она соответствовала вашей среде <Constant name="dbt_platform" />, и [задать локальные переменные окружения](/docs/configure-dbt-extension#configure-environment-variables) для использования функций расширения.

Расширение dbt установлено и готово к работе! Дальнейшие шаги:
- Перейдите к разделу [getting started](#getting-started), чтобы начать процесс онбординга через терминал и настроить окружение. Если вы столкнётесь с ошибками парсинга, можно также запустить инструмент [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation).
- <Expandable alt_header="Установите dbt Fusion engine из командной строки, если вы ещё этого не сделали.">

    <FusionManualInstall />
  3. Следуйте руководству [getting started](/docs/install-dbt-extension#getting-started), чтобы начать работу с расширением. Вы можете выбрать один из способов:
      - Запустить `dbtf init` для терминального онбординга.
      - Выполнить команду **Run dbt: Register dbt extension** через command palette.
      - Использовать кнопку **Get started** в меню расширения.
  </Expandable>
- [Зарегистрируйте расширение](#register-the-extension) с помощью email или учётной записи <Constant name="dbt_platform" />, чтобы продолжить использование после пробного периода.
- Ознакомьтесь с [ограничениями и неподдерживаемыми возможностями](/docs/fusion/supported-features#limitations), если вы ещё этого не сделали.

## Getting started

После установки <Constant name="fusion_engine"/> и расширения dbt для VS Code на боковой панели появится логотип dbt. Отсюда вы можете запускать рабочие процессы для начала работы, просматривать информацию о расширении и вашем dbt‑проекте, а также использовать полезные ссылки. Подробнее см. документацию [о меню расширения dbt](/docs/about-dbt-extension#the-dbt-extension-menu).

Начать работу с расширением можно несколькими способами:
- Запустить `dbtf init` для онбординга через терминал,
- Открыть **dbt: Register dbt extension** в command palette,
- Использовать кнопку **Get started** в меню расширения.

Ниже описаны шаги для начала работы через кнопку **Get started**:

1. В боковом меню нажмите на логотип dbt, чтобы открыть меню, и разверните раздел **Get started**.
2. Нажмите на статус **dbt Walkthrough**, чтобы открыть приветственный экран.
    <Lightbox src="/img/docs/extension/welcome-screen.png" width="80%" title="dbt VS Code extension welcome screen."/>
3. Последовательно выполните пункты для начала работы:
    - **Open your dbt project:** Открывает проводник файлов для выбора dbt‑проекта, который вы хотите открыть с Fusion.
    - **Check Fusion compatibility:** Запускает процесс [обновления до Fusion](#upgrade-to-fusion). Если возникнут ошибки парсинга, можно дополнительно запустить [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation).
    - **Explore features:** Открывает [документацию](/docs/about-dbt-extension) с описанием возможностей расширения.
    - [**Register:**](#register-the-extension) Запускает процесс регистрации для продолжения использования расширения после пробного периода.

## Upgrade to Fusion

:::note

Если у вас уже установлен <Constant name="fusion_engine" />, для использования инструмента обновления требуется версия `2.0.0-beta.66` или выше.

:::

Расширение dbt включает встроенный инструмент обновления, который пошагово помогает настроить <Constant name="fusion" /> и обновить dbt‑проект для поддержки всех его возможностей, а также устранить устаревший код. Чтобы начать:

1. В боковой панели VS Code нажмите на **логотип dbt**.
2. В открывшейся панели разверните раздел **Get started** и нажмите кнопку **Get started**.

    <Lightbox src="/img/docs/extension/fusion-onboarding-experience.png" width="80%" title="The dbt extension help pane and upgrade assistant." />

Вы также можете запустить процесс вручную, открыв CLI и выполнив команду:

```
dbt init --fusion-upgrade
```

Инструмент обновления проведёт вас через процесс апгрейда Fusion с помощью серии вопросов:
- **Do you have an existing dbt platform account?**: Если ответить `Y`, вы получите инструкции по загрузке профиля dbt platform для регистрации расширения. Ответ `N` пропустит этот шаг.
- **Ready to run a dbtf init?** (если файл `profiles.yml` отсутствует): Выполняется конфигурация dbt, включая подключение к хранилищу данных.
- **Ready to run a dbtf debug?** (если `profiles.yml` уже существует): Проверяет корректность конфигурации и возможность подключения к хранилищу данных.
- **Ready to run a dbtf parse?**: Проект dbt будет распарсен для проверки совместимости с <Constant name="fusion" />.
    - Если во время парсинга возникнут проблемы, вам будет предложено запустить [dbt-autofix](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation). Без устранения ошибок процесс обновления не может быть продолжен.
        :::tip AI Agents
        В некоторых случаях dbt-autofix не может исправить все ошибки и требуется ручное вмешательство. Для таких ситуаций инструмент dbt-autofix предоставляет файл [AI Agents.md](https://github.com/dbt-labs/dbt-autofix/blob/main/AGENTS.md), который позволяет использовать AI‑агентов для помощи в миграции после завершения работы dbt-autofix.
        :::
- **Ready to run a ‘dbtf compile -static-analysis off’?** (выполняется только после успешного parse): Компилирует проект без статического анализа, имитируя поведение dbt Core.
- **Ready to run a ‘dbtf compile’?**: Компилирует проект с полным статическим анализом <Constant name="fusion" />, проверяя корректность SQL с учётом таблиц и колонок в вашем хранилище.

    <Lightbox src="/img/docs/extension/fusion-onboarding-complete.png" width="70%" title="The message received when you have completed upgrading your project to the dbt Fusion engine." />

После завершения обновления вы готовы использовать все возможности <Constant name="fusion_engine" />!

## Register the extension

После загрузки расширения и установки <Constant name="fusion_engine" /> необходимо зарегистрировать расширение dbt для VS Code в течение 14 дней.

**Ключевые моменты:**
- Расширение бесплатно для организаций до 15 пользователей (см. [acceptable use policy](https://www.getdbt.com/dbt-assets/vscode-plugin-aup)).
- Регистрация связывает редактор с учётной записью dbt для дальнейшего использования.
- Проект <Constant name="dbt_platform" /> не требуется — достаточно учётной записи dbt.
- Если на машине уже есть корректный файл `dbt_cloud.yml`, расширение автоматически использует его и пропускает вход.
- Если у вас уже есть учётная запись dbt, вы будете перенаправлены в OAuth‑процесс входа.

<Expandable alt_header="Understanding regions">

Большинство пользователей могут войти через страницу регистрации расширения в браузере, используя регион по умолчанию `US1`. Если вход проходит успешно, значит у вас есть учётная запись в этом регионе.

Используйте файл учётных данных (`dbt_cloud.yml`) вместо входа через браузер, если:

- Вы не можете войти.
- Ваша организация использует нестандартный регион (`eu1`, `us2` и т. д.).
- Вы предпочитаете хранить учётные данные в файле.

Если вы не уверены, есть ли у вас учётная запись в `US1`, попробуйте войти или воспользоваться **Forgot password** на [us1.dbt.com](http://us1.dbt.com). Если учётная запись не найдена, продолжайте с [Register with `dbt_cloud.yml`](#register-with-dbt_cloudyml).
</Expandable>

## Troubleshooting
<!-- This anchor is linked from the  VS Code extension. Please do not change it -->

import FusionTroubleshooting from '/snippets/_fusion-troubleshooting.md';

<FusionTroubleshooting />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
