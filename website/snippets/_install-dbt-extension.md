
import FusionManualInstall from '/snippets/_v2-manual-install.md';

Расширение dbt &mdash; доступное для [VS Code и Cursor](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview), а также [Windsurf](https://open-vsx.org/extension/dbtLabsInc/dbt) &mdash; делает разработку с dbt удобнее и эффективнее. Расширение поддерживается как в dbt v1, так и в v2 &mdash; о том, какие настройки требуются для тех или иных возможностей, см. в разделе [Совместимость версий](/docs/about-dbt-extension#version-compatibility).

:::note

Это единственное официальное расширение dbt Labs для VS Code. Другие расширения _могут_ работать вместе с расширением dbt для VS Code, но dbt Labs не тестирует и не поддерживает их.

:::

## Предварительные требования {#prerequisites}

Для использования расширения вам потребуется следующее:

<SimpleTable>

| Требование | Подробности |
| --- | --- |
| **Файлы проекта** | Вам потребуется файл `profiles.yml`. Для некоторых функций <Constant name="dbt_platform" /> или рабочих процессов с использованием учетных данных также может потребоваться файл [`dbt_cloud.yml`](/reference/dbt_cloud.yml). Для использования расширения проект в <Constant name="dbt_platform" /> не требуется. |
| **Редактор** | [VS Code](https://code.visualstudio.com/), [Cursor](https://www.cursor.com/en) или [Windsurf](https://windsurf.com/editor). |
| **Операционная система** | macOS, Windows или Linux. |
| **Локальная настройка** (необязательно) | [Настройте расширение](/docs/configure-dbt-extension), чтобы воспроизвести вашу среду dbt локально и задать все переменные окружения, необходимые для вашего проекта. |
| **Поддержка миграции проекта** (необязательно) | В расширение встроен [dbt-autofix](https://github.com/dbt-labs/dbt-autofix), поэтому вы можете устранять случаи использования устаревших возможностей на панели **Problems** или в одном pull request. Вы также можете использовать навык агента **Migrate dbt v1 to dbt v2** или самостоятельно [запустить dbt-autofix](/guides/prepare-v2-upgrade?step=5#what-the-autofix-tool-handles). |

</SimpleTable>

## Установите расширение {#install-the-extension}

1. В редакторе откройте вкладку **Extensions** и найдите `dbt`.
2. Найдите расширение от издателя `dbtLabsInc` или `dbt Labs Inc`, затем нажмите **Install**.

    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="90%" title="Поиск расширения"/>

3. Откройте проект dbt в редакторе. Убедитесь, что проект добавлен в текущую рабочую область.
4. Убедитесь, что расширение активно: в строке состояния должна отображаться надпись **dbt Extension**. Наведите указатель на эту надпись, чтобы просмотреть диагностическую информацию.

    <Lightbox src="/img/docs/extension/dbt-extension-statusbar.png" width="60%" title="Если отображается надпись 'dbt Extension', расширение активировано"/>

5. После активации расширение автоматически скачивает подходящий для вашей операционной системы языковой сервер dbt (<Term id="lsp"/>).

    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="Языковой сервер dbt будет установлен автоматически"/>

6. Если dbt не установлен, расширение предложит скачать и установить его. Следуйте инструкциям в уведомлении или [установите его вручную из командной строки](/docs/local/install-dbt-v2).

    <Lightbox src="/img/docs/extension/install-dbt-v2-engine.png" width="60%" title="Следуйте инструкциям, чтобы установить v2"/>

7. Запустите [инструмент обновления](/docs/upgrade-to-dbt-extension) в расширении VS Code, чтобы проверить готовность проекта к dbt v2 и устранить ошибки или заменить устаревшие настройки.
8. Необязательно. [Настройте локальное окружение](/docs/configure-dbt-extension) по образцу окружения <Constant name="dbt_platform" /> и [задайте переменные окружения](/docs/configure-dbt-extension#set-environment-variables-locally), необходимые проекту.

:::note Языковой сервер входит в состав dbt v2

Языковой сервер dbt входит в состав бинарного файла v2, а не скачивается отдельно &mdash; расширение запускает его через v2. Если вы устанавливаете v2 вручную (например, в изолированной среде), а не поручаете установку расширению, воспользуйтесь [матрицей совместимости версий](/docs/dbt-versions/dbt-version-compatibility), чтобы выбрать бинарный файл, совместимый с версией вашего расширения.

:::

Теперь вы готовы к работе с расширением dbt. Далее вы можете:

- Следовать [инструкциям по началу работы](/docs/install-dbt-extension#начало-работы), чтобы завершить настройку.
- [Обновить проект до dbt v2](/docs/upgrade-to-dbt-extension), если вы переходите с v1.
- [Войти](/docs/sign-in-dbt-extension) в учетную запись <Constant name="dbt_platform" />, если вы хотите использовать в расширении возможности <Constant name="dbt_platform" />, например вкладку **Catalog**.
- Ознакомиться с [ограничениями и неподдерживаемыми функциями](/docs/dbt/supported-features#limitations).

<Expandable alt_header="Установите dbt v2 из командной строки, если вы еще этого не сделали.">

<FusionManualInstall />

После установки выполните шаги из раздела [Начало работы](/docs/install-dbt-extension#начало-работы).

- Запуск `dbt init --fusion-upgrade` для начала настройки в терминале.
- Запуск команды **dbt: Register dbt extension** из палитры команд.
- Выбор пункта **Get started** в меню расширения.

</Expandable>

## Начало работы

После установки v2 и расширения dbt для VS Code на боковой панели появляется логотип dbt. Нажмите на него, чтобы открыть панель **Get started**.

Панель **Get started** — это постоянно доступный помощник по настройке в VS Code и Cursor. Она отслеживает состояние вашей среды и показывает наиболее важное следующее действие. По мере выхода новых версий v2 или изменения вашего проекта панель автоматически снова предлагает соответствующие шаги. Подробнее см. в разделе [Переход на dbt v2](/docs/upgrade-to-dbt-extension).

<Lightbox src="/img/docs/extension/vsce-get-started.png" width="100%" title="Панель Get started в VS Code с шагами настройки и выделенным текущим шагом."/>

Панель помогает выполнить следующие шаги:

1. **Install or update dbt v2**: определяет, отсутствует ли исполняемый файл v2 или устарела ли его версия, и позволяет установить или обновить его одним нажатием.
2. **Open project**: проверяет наличие файла `dbt_project.yml` в вашей рабочей области, чтобы перед продолжением убедиться, что открыт корректный проект dbt.
3. **Check dbt v2 compatibility**: помогает перевести проект на v2. Вы можете выбрать миграцию с помощью ИИ-агента или ручную настройку через CLI &mdash; см. раздел [Переход на dbt v2](/docs/upgrade-to-dbt-extension).
4. **Sign in**: проверяет, что вы вошли в учетную запись <Constant name="dbt_platform" />, которую расширение использует для доступа к возможностям <Constant name="dbt_platform" />, таким как вкладка **Catalog** &mdash; см. раздел [Вход в учетную запись](/docs/sign-in-dbt-extension).

Когда все шаги настройки выполнены, на панели отображается зеленая кнопка **Extension setup complete**.

<Lightbox src="/img/docs/extension/vsce-get-started-complete.png" width="100%" title="Панель Get started с надписью Extension setup complete и отметками о выполнении всех четырех шагов."/>
