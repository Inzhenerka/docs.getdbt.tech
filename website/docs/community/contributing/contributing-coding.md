---
title: "Вклад в код"
id: "contributing-coding"
---

### Вклад в пакеты dbt {#contribute-to-dbt-packages}

#### Обзор {#overview}

[dbt Packages](/docs/build/packages) — это самый простой способ для аналитических инженеров поучаствовать в контрибьютинге кода в сообщество dbt, поскольку dbt Packages по сути являются обычными [dbt Projects](/docs/build/projects). Если вы умеете создавать dbt Project, писать macro и делать ref на model, значит, вы можете создать dbt Package. Пакеты работают примерно так же, как библиотеки в других языках программирования. Они позволяют использовать заранее написанный, модульный код для решения типовых задач аналитической инженерии. Посмотреть все dbt Packages можно на [dbt Package Hub](https://hub.getdbt.com/).

#### Возможности для вклада {#contribution-opportunities}

- Создайте новый пакет для dbt Package Hub. Это может быть новый набор макросов или тестов, которые были полезны вам в ваших проектах, набор моделей для работы с часто используемым источником данных или что-то еще, что можно сделать в рамках проекта dbt.
- Улучшите существующий пакет: вы также можете помочь улучшить существующий пакет. Это можно сделать, создавая и участвуя в обсуждении Issues или добавляя функциональность для решения существующей проблемы через открытие PR.

#### Примеры вкладов {#sample-contributions}

- [dbt Expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest/)
- [dbt Artifacts](https://hub.getdbt.com/brooklyn-data/dbt_artifacts/latest/)

#### Начало работы {#get-started}

- Используйте пакеты в своих собственных проектах! Лучший способ понять, как улучшить пакет, — это применять его в production‑среде, а затем искать способы его доработки или улучшения.
- Ознакомьтесь со следующими материалами по разработке пакетов:
  - [Итак, вы хотите создать пакет dbt](/blog/so-you-want-to-build-a-package)
  - [Лучшие практики пакетов](https://github.com/dbt-labs/hubcap/blob/main/package-best-practices.md)
- Нужна помощь: посетите #package-ecosystem в Slack-сообществе dbt

### Участвуйте в развитии open source или source-available программного обеспечения dbt {#contribute-to-dbt-open-source-or-source-available-software}

#### Обзор {#overview-1}

<Constant name="core" /> и <Constant name="fusion_engine" />, адаптеры, инструменты, а также сайты, на которых работают Package Hub и Developer Hub, — всё это активные проекты, развиваемые сообществом. В отличие от dbt Packages, вклад в код этих проектов обычно требует некоторого рабочего знания языков программирования, отличных от SQL и Jinja, однако поддерживающее сообщество вокруг этих репозиториев может помочь вам развить соответствующие навыки. Даже не внося изменения в код, существует множество способов участвовать в коллективной разработке этих проектов — они описаны ниже. Подборку самых активных OSS/SA‑проектов, которые поддерживает dbt Labs, вы можете найти [здесь](/community/resources/oss-sa-projects).

#### Возможности для вклада {#contribution-opportunities-1}

Существует три основных способа внести вклад в проекты dbt. В качестве примера мы будем использовать <Constant name="fusion_engine" /> — это своего рода «входная точка» в экосистему dbt и отличное место для начала для новичков:

- [Открыть issue](https://github.com/dbt-labs/dbt-fusion/issues/new/choose), чтобы предложить улучшение или оставить обратную связь.
- Комментировать и участвовать в существующих [issues](https://github.com/dbt-labs/dbt-fusion/issues) или [discussions](https://github.com/dbt-labs/dbt-fuson/discussions). Это может быть, например, голосование за issue, которые были бы полезны вашей организации, комментарии с уточнениями к запросу на новую функциональность или описание того, как та или иная возможность повлияет на использование dbt в вашей работе.
- Создать pull request, который решает открытую Issue. Это предполагает написание кода и тестов, добавляющих новую функциональность или исправляющих баг, описанный в Issue, а затем асинхронное прохождение процесса code review с инженером dbt Labs. Обратите внимание, что при внесении вклада в <Constant name="core" /> требуются подписанные коммиты. Инструкции о том, как подписывать коммиты, см. в разделе [Signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits).

#### Примеры вкладов {#sample-contributions-1}

- Посмотрите [этот issue](https://github.com/dbt-labs/dbt-core/issues/3612), посвящённый улучшению сообщений об ошибках, а также [PR, который сообщество внесло для его исправления](https://github.com/dbt-labs/dbt-core/pull/3703).
- На основе указанного выше issue был создан [ещё один issue](https://github.com/dbt-labs/dbt-bigquery/issues/202) — уже не только для изменения текста ошибки, но и для улучшения поведения в целом. Это и есть добродетельный цикл разработки, движимой сообществом! Шаг за шагом мы, сообщество, формируем инструмент так, чтобы он лучше соответствовал нашим потребностям.

#### Начало работы {#get-started-1}

- Ознакомьтесь с [руководством по внесению вкладов](https://github.com/dbt-labs/dbt-core/blob/main/CONTRIBUTING.md) для <Constant name="core" /> и с разделом [Contributor Expectations](/community/resources/contributor-expectations).
- Если вы хотите внести вклад в <Constant name="fusion_engine" />, найдите задачу с меткой “[good first issue](https://github.com/dbt-labs/dbt-fusion/issues?q=is%3Aopen+is%3Aissue+label%3Agood_first_issue)” или поищите аналогичные метки в других репозиториях. Если есть сомнения, не стесняйтесь спросить у мейнтейнеров, с какой задачи лучше начать — они с радостью помогут и будут рады вашему участию!

#### Нужна помощь? {#need-help}

Следующие каналы в Slack-сообществе dbt — отличное место для вопросов:

- #dbt-core-development
- #adapter-ecosystem
