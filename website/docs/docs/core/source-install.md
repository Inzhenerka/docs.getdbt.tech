---
title: "Установка из исходного кода"
description: "Вы можете установить dbt Core из исходного кода на GitHub."
pagination_next: null
---

dbt Core и почти все его адаптеры являются программным обеспечением с открытым исходным кодом. Таким образом, кодовые базы доступны для свободного скачивания и сборки из исходного кода. Вы можете установить из исходного кода, если хотите получить последнюю версию или установить dbt из конкретного коммита. Это может быть полезно, когда вы вносите изменения или хотите отладить ранее внесенные изменения.

Чтобы скачать из исходного кода, вам нужно клонировать репозитории с GitHub, создав локальную копию, а затем установить локальную версию с помощью `pip`.

Скачивание и сборка dbt Core позволит вам внести свой вклад в проект, исправив ошибку или реализовав востребованную функцию. Для получения более подробной информации прочитайте [руководство по внесению изменений](https://github.com/dbt-labs/dbt-core/blob/HEAD/CONTRIBUTING.md).

### Установка dbt Core

Начиная с версии 1.8, установка адаптера не приводит к автоматической установке `dbt-core`. Это связано с тем, что версии адаптеров и dbt Core были разъединены, и мы больше не хотим перезаписывать существующие установки dbt-core.

<VersionBlock firstVersion="1.8">

Чтобы установить `dbt-core` только из исходного кода на GitHub:

```shell
git clone https://github.com/dbt-labs/dbt-core.git
cd dbt-core
python -m pip install -r requirements.txt
```

</VersionBlock>

<VersionBlock lastVersion="1.7">

Чтобы установить `dbt-core` и `dbt-postgres` из исходного кода на GitHub:

```shell
git clone https://github.com/dbt-labs/dbt-core.git
cd dbt-core
python -m pip install -r requirements.txt
```
</VersionBlock>

Чтобы установить в редактируемом режиме, который включает ваши локальные изменения по мере их внесения:

```shell
python -m pip install -e editable-requirements.txt` 
```
вместо этого.

### Установка адаптеров

Чтобы установить адаптер из исходного кода, вам сначала нужно найти его исходный репозиторий. Например, адаптер `dbt-redshift` находится по адресу https://github.com/dbt-labs/dbt-redshift.git, поэтому вы можете клонировать его и установить оттуда:

<VersionBlock firstVersion="1.8">

Вам также нужно будет установить `dbt-core` перед установкой адаптера.

</VersionBlock>

<VersionBlock lastVersion="1.7">

Вам _не_ нужно устанавливать `dbt-core` перед установкой адаптера — плагин включает `dbt-core` среди своих зависимостей, и он автоматически установит последнюю совместимую версию.
</VersionBlock>

```shell
git clone https://github.com/dbt-labs/dbt-redshift.git
cd dbt-redshift
python -m pip install .
```

Чтобы установить в редактируемом режиме, например, во время внесения изменений, используйте `python -m pip install -e .` вместо этого.

<FAQ path="Core/install-pip-os-prereqs" />
<FAQ path="Core/install-python-compatibility" />
<FAQ path="Core/install-pip-best-practices" />