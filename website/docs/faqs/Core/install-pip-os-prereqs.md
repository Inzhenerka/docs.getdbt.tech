---
title: "Есть ли предварительные требования для моей операционной системы?"
description: "Вы можете проверить, есть ли для вашей операционной системы предварительные требования для установки dbt v1."
sidebar_label: 'Системные требования для dbt v1'
id: install-pip-os-prereqs.md

---

Перед установкой <Constant name="core" /> с помощью pip вашей операционной системе может потребоваться предварительная настройка. После загрузки и установки всех зависимостей, необходимых для вашей среды разработки, можно перейти к [установке <Constant name="core" /> с помощью pip](/docs/local/install-dbt).

### CentOS {#centos}

Для успешной установки и запуска <Constant name="core" /> в CentOS требуется Python и некоторые другие зависимости.

Чтобы установить Python и другие зависимости:

```shell

sudo yum install redhat-rpm-config gcc libffi-devel \
  python-devel openssl-devel

```

### MacOS {#macos}

Для macOS требуется Python версии 3.8 или выше, чтобы успешно установить и запустить <Constant name="core" />.

Чтобы проверить версию Python:

```shell

python --version

```

Если вам нужна совместимая версия, вы можете загрузить и установить [Python версии 3.9 или выше для MacOS](https://www.python.org/downloads/macos).

Если ваш компьютер работает на архитектуре Apple M1, мы рекомендуем установить dbt через [Rosetta](https://support.apple.com/en-us/HT211861). Это необходимо для некоторых зависимостей, которые поддерживаются только на процессорах Intel.

### Ubuntu/Debian {#ubuntudebian}

Для успешной установки и запуска <Constant name="core" /> в Ubuntu требуются Python и другие зависимости.

Чтобы установить Python и другие зависимости:

```shell

sudo apt-get install git libpq-dev python-dev python3-pip
sudo apt-get remove python-cffi
sudo pip install --upgrade cffi
pip install cryptography~=3.4

```

### Windows {#windows}

Для успешной установки и работы <Constant name="core" /> в Windows требуются Python и git.

Установите [<Constant name="git" /> для Windows](https://git-scm.com/downloads) и [Python версии 3.9 или выше для Windows](https://www.python.org/downloads/windows/).

Если у вас есть дополнительные вопросы, пожалуйста, ознакомьтесь с [FAQ по совместимости с Python](/faqs/Core/install-python-compatibility)