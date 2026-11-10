---
title: Установка dbt OSS
id: install-dbt-v2
description: "Установите dbt OSS — основу dbt v2 с открытым исходным кодом."
sidebar_label: "Установка dbt OSS"
pagination_next: null
pagination_prev: null
availability: local_free
---


<VersionBlock lastVersion="1.99">

Эта страница посвящена установке dbt OSS — дистрибутива v2 с открытым исходным кодом под лицензией Apache 2.0. Чтобы просмотреть инструкции по установке, выберите **v2** в переключателе версий в навигации документации. Чтобы установить <Constant name="core_v1" />, обратитесь к разделу [Установка <Constant name="core_v1" />](/docs/local/install-dbt?version=1.12).

Чтобы обновить существующий проект с v1 до v2, обратитесь к разделу [Обновление до v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2?version=2.0).

Чтобы узнать о различиях между v1 и v2, обратитесь к разделу [Лицензирование dbt](/docs/dbt-licensing?version=2.0).

</VersionBlock>

<VersionBlock firstVersion="2.0">

Основа v2 с открытым исходным кодом распространяется под лицензией Apache 2.0. Большинству пользователей эта страница не нужна &mdash; [установите dbt обычным способом](/docs/local/install-dbt), следуя стандартным инструкциям. Эта страница предназначена для организаций, которым нужна именно кодовая база под лицензией Apache 2.0.

:::info Используйте изолированное окружение
Используйте `uv tool`, чтобы установить `dbt-oss` в отдельном изолированном окружении. Не устанавливайте `dbt-oss` в том же окружении, что и `dbt` или `dbt-core`, поскольку все они используют одну и ту же точку входа. Если у вас уже установлен `dbt`, обратитесь к разделу [Запуск dbt-oss параллельно с другими установленными версиями dbt](#run-dbt-oss-alongside-other-dbt-installs).
:::

## Установка

Перед установкой dbt OSS убедитесь, что на вашем компьютере установлен [uv](https://docs.astral.sh/uv/getting-started/installation/).

Установите `dbt-oss` с помощью `uv tool`:

```shell
uv tool install dbt-oss
```

Убедитесь, что номер установленной версии начинается с `2.`:

```shell
dbt --version
```

Подробные сведения об установке адаптеров см. в [репозитории `dbt`](https://github.com/dbt-labs/dbt).

## Запуск `dbt-oss` параллельно с другими установленными версиями dbt {#run-dbt-oss-alongside-other-dbt-installs}

Если у вас установлен `dbt` и вы хотите запускать `dbt-oss` параллельно с ним, используйте `uvx` с псевдонимом команды в оболочке, чтобы избежать конфликтов. Использование `uvx` обеспечивает запуск dbt OSS в отдельном изолированном окружении, не затрагивая существующую установку dbt.

Добавьте следующие строки в файл профиля оболочки. В этом примере используется `dbto`, но вы можете выбрать другое имя:

```shell
# ~/.zshrc or ~/.bashrc
alias dbto='uvx --from dbt-oss dbt'
```

Повторно загрузите файл профиля оболочки:

```shell
source ~/.zshrc   # or source ~/.bashrc
```

После этого вы сможете использовать `dbto <command>` (или выбранный вами псевдоним) вместо `dbt <command>` для вызова dbt OSS.

## Что входит в состав

- Среда выполнения dbt с открытым исходным кодом, написанная на Rust.
- Язык проектов dbt и семантика DAG.
- Стандартный набор команд dbt (`run`, `build`, `test`, `compile`, `parse` и другие).

## Что не входит в состав

При [стандартной установке <Constant name="dbt" />](/docs/local/install-dbt) вы получаете <Constant name="fusion" />, который дополняет основу с открытым исходным кодом следующими возможностями:

- Понимание SQL и статический анализ
- Возможности <Term id="lsp" /> (автодополнение, информация при наведении, отображение ошибок прямо в коде)
- `dbt lint` и диагностика ошибок
- Интеграция с расширением dbt для VS Code

Полный обзор возможностей dbt см. в разделе [Доступность v2](/docs/dbt/dbt-availability).

## Участие в разработке

Чтобы внести свой вклад, обратитесь к [репозиторию `dbt`](https://github.com/dbt-labs/dbt) и [руководству CONTRIBUTING](https://github.com/dbt-labs/dbt/blob/HEAD/CONTRIBUTING.md) или задайте вопрос в [сообществе dbt](/community/resources/getting-help).

## Лицензия

dbt OSS распространяется под лицензией Apache 2.0. См. [файл LICENSE](https://github.com/dbt-labs/dbt/blob/HEAD/LICENSE) в репозитории. Дополнительную информацию см. в разделе [Лицензирование dbt](/docs/dbt-licensing?version=2.0).

## Связанные материалы

- [Установка dbt](/docs/local/install-dbt) (стандартная установка)
- [Обновление до v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2)
- [Репозиторий `dbt` на GitHub](https://github.com/dbt-labs/dbt)

</VersionBlock>
