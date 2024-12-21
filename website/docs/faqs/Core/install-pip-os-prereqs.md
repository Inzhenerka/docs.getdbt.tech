---
title: "Есть ли у моей операционной системы предварительные требования?"
description: "Вы можете проверить, есть ли у вашей операционной системы предварительные требования для установки dbt Core."
sidebar_label: 'Системные требования dbt Core'
id: install-pip-os-prereqs.md

---

Ваша операционная система может требовать предварительной настройки перед установкой dbt Core с помощью pip. После загрузки и установки любых зависимостей, специфичных для вашей среды разработки, вы можете продолжить с [установкой dbt Core через pip](/docs/core/pip-install).

### CentOS

Для успешной установки и работы dbt Core на CentOS требуются Python и некоторые другие зависимости.

Чтобы установить Python и другие зависимости:

```shell

sudo yum install redhat-rpm-config gcc libffi-devel \
  python-devel openssl-devel

```

### MacOS

Для успешной установки и работы dbt Core на MacOS требуется Python версии 3.8 или выше.

Чтобы проверить версию Python:

```shell

python --version

```

Если вам нужна совместимая версия, вы можете загрузить и установить [Python версии 3.9 или выше для MacOS](https://www.python.org/downloads/macos).

Если ваш компьютер работает на архитектуре Apple M1, мы рекомендуем установить dbt через [Rosetta](https://support.apple.com/en-us/HT211861). Это необходимо для некоторых зависимостей, которые поддерживаются только на процессорах Intel.

### Ubuntu/Debian

Для успешной установки и работы dbt Core на Ubuntu требуются Python и другие зависимости.

Чтобы установить Python и другие зависимости:

```shell

sudo apt-get install git libpq-dev python-dev python3-pip
sudo apt-get remove python-cffi
sudo pip install --upgrade cffi
pip install cryptography~=3.4

```

### Windows

Для успешной установки и работы dbt Core на Windows требуются Python и git.

Установите [Git для Windows](https://git-scm.com/downloads) и [Python версии 3.9 или выше для Windows](https://www.python.org/downloads/windows/).

Если у вас есть дополнительные вопросы, пожалуйста, ознакомьтесь с [FAQ по совместимости с Python](/faqs/Core/install-python-compatibility)