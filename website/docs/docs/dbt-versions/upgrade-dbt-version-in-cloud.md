---
title: "Обновление версий в dbt platform"
id: "upgrade-dbt-version-in-cloud"
---

import FusionDWH from '/snippets/_fusion-dwh.md';
import FusionUpgradeSteps from '/snippets/_fusion-upgrade-steps.md';

В <Constant name="cloud" /> и [jobs](/docs/deploy/jobs), и [environments](/docs/dbt-cloud-environments) настраиваются для использования определённой версии <Constant name="core" />. Эту версию можно обновить в любой момент.

## Окружения

Перейдите на страницу настроек окружения и нажмите **Edit**. В выпадающем списке **dbt version** выберите нужный вариант. Вы можете выбрать [release track](#release-tracks), чтобы получать регулярные обновления (рекомендуется), либо устаревшую версию <Constant name="core" />. Перед тем как покинуть страницу, обязательно сохраните изменения.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-environment-settings.png" width="90%" title="Example environment settings in dbt"/>

### Трассы релизов

Начиная с 2024 года, ваш проект будет автоматически обновляться с выбранной вами периодичностью:

Трек **Latest** гарантирует, что у вас всегда будет актуальная функциональность <Constant name="cloud" />, а также ранний доступ к новым возможностям фреймворка dbt. Треки **Compatible** и **Extended** предназначены для клиентов, которым требуется более редкий график релизов, возможность тестировать новые версии dbt до их выхода в продуктив, и/или долгосрочная совместимость с последними open source‑релизами <Constant name="core" />.

Как лучшую практику, dbt Labs рекомендует сначала протестировать обновление в среде разработки; используйте настройку [Override dbt version](#override-dbt-version), чтобы протестировать _ваш_ проект на последней версии dbt перед обновлением ваших окружений развертывания и стандартной среды разработки для всех ваших коллег.

Чтобы обновить окружение в [<Constant name="cloud" /> Admin API](/docs/dbt-cloud-apis/admin-cloud-api) или с помощью [Terraform](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest), установите параметр `dbt_version` в значение, соответствующее нужному вам релизному треку:

- `Latest Fusion` <Lifecycle status="private_preview" /> (доступно для выбранных аккаунтов)
- `latest` (ранее назывался `versionless`; старое название по‑прежнему поддерживается)
- `compatible` (доступно для планов Starter, Enterprise, Enterprise+)
- `extended` (доступно для всех планов Enterprise)

### Переопределение версии dbt

Настройте свой проект так, чтобы он использовал версию dbt, отличную от той, которая настроена в вашей [среде разработки](/docs/dbt-cloud-environments#types-of-environments). Это _переопределение_ влияет только на вашу учетную запись пользователя и не затрагивает других. Используйте этот подход, чтобы безопасно протестировать новые возможности dbt перед обновлением версии dbt для проектов.

1. Нажмите на имя своей учетной записи в левой боковой панели и выберите **Account settings**.  
2. В боковом меню выберите **Credentials** и укажите проект. Откроется боковая панель.  
3. В боковой панели нажмите **Edit** и прокрутите до раздела **User development settings**.  
4. Выберите версию из выпадающего списка **dbt version** и нажмите **Save**.

Пример переопределения настроенной версии на трек релизов ["Latest"](/docs/dbt-versions/cloud-release-tracks) для выбранного проекта:

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-override-version.png" width="60%" title="Пример переопределения версии dbt в вашей учетной записи"/>

5. (Необязательно) Убедитесь, что <Constant name="cloud" /> будет использовать заданное вами переопределение для сборки проекта, выполнив команду `dbt build` в командной строке <Constant name="cloud_ide" />. Разверните раздел **System Logs** и найдите первую строку вывода. Она должна начинаться с `Running with dbt=` и содержать версию dbt, которую использует <Constant name="cloud" />. <br /><br />
   Для пользователей на release track в выводе будет отображаться `Running dbt...` вместо конкретной версии. Это отражает гибкость и непрерывные автоматические обновления, которые предоставляет функциональность release track.

## dbt Fusion engine <Lifecycle status="private_preview" />

dbt Labs представила новый [<Constant name="fusion_engine" />](/docs/fusion) — полностью переработанную с нуля версию dbt. В настоящее время он доступен в режиме private preview на платформе dbt. Подходящие клиенты могут обновлять окружения до Fusion, используя те же рабочие процессы, что и для v1.x, но обратите внимание на следующее:
- Если вы не видите release track `Latest Fusion` в списке доступных, уточните у своей команды по работе с аккаунтом dbt Labs, доступна ли вам эта возможность.
- Чтобы повысить совместимость вашего проекта, обновите все задания и окружения до release track `Latest` и ознакомьтесь с изменениями в нашем [руководстве по обновлению](/docs/dbt-versions/core-upgrade/upgrading-to-fusion).
- Убедитесь, что вы используете поддерживаемый адаптер и метод аутентификации:
  <FusionDWH /> 
- После обновления окружения(ий) разработки до `Latest Fusion` всем пользователям потребуется перезапустить IDE.

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions/upgrade-fusion.png" width="90%" title="Upgrade to the Fusion engine in your environment settings." />

### Обновление окружений до Fusion <Lifecycle status="private_preview" />

Когда вы будете готовы обновить свой проект (или проекты) до <Constant name="fusion_engine" />, в интерфейсе платформы dbt доступны инструменты, которые помогут начать работу. Ассистент обновления <Constant name="fusion" /> проведёт вас через процесс подготовки и обновления проектов.

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/fusion-upgrade-gui.png" width="60%" title="The Fusion upgrade assistant."/>

#### Предварительные требования

Чтобы воспользоваться ассистентом обновления, необходимо выполнить следующие условия:
- Ваш проект dbt должен быть обновлён до release track `Latest`.
- У вас должна быть лицензия `developer`.
- Для вашего аккаунта должна быть включена бета-функция <Constant name="Fusion" />. За дополнительной информацией обратитесь к вашему аккаунт-менеджеру.

#### Назначение доступа к обновлению

По умолчанию все пользователи могут просматривать рабочие процессы обновления <Constant name="fusion" />. Доступные им действия будут ограничены назначенными разрешениями и доступом к окружениям. Вы можете более точно настроить доступ к обновлению с помощью комбинации новой настройки аккаунта и набора разрешений `Fusion admin`.

В **Account settings**:
1. Перейдите на экран **Account**.
2. Нажмите **Edit**, прокрутите страницу вниз и установите флажок **Enable Fusion migration** permissions.
3. Нажмите **Save**.

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/fusion-migration-permissions.png" width="60%" title="Limit access to the Fusion upgrade workflows."/>

Это скрывает рабочие процессы обновления <Constant name="fusion" /> от пользователей, у которых нет набора разрешений `Fusion admin`, включая пользователей с самыми высокими уровнями администраторского доступа. Чтобы предоставить пользователям доступ к рабочим процессам обновления:
1. Перейдите к группе в **Account settings**.
2. Нажмите **Edit**.
3. Прокрутите до раздела **Access and permissions** и нажмите **Add permission**.
4. Выберите набор разрешений **Fusion admin** в выпадающем списке, а затем укажите проект(ы), к которым пользователи должны иметь доступ.
5. Нажмите **Save**.

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/assign-fusion-admin.png" width="60%" title="Assign Fusion admin to groups and projects."/>

Рабочие процессы обновления <Constant name="fusion" /> помогают выявить области проекта, которые требуют изменений, и предоставляют инструменты для ручного исправления и автоматического устранения ошибок.

#### Обновление окружения разработки

Чтобы начать процесс обновления до <Constant name="fusion" /> с помощью ассистента:
1. На главной странице проекта или в боковом меню нажмите кнопку **Start Fusion upgrade** или **Get started**. Вы будете перенаправлены в <Constant name="cloud_ide" />.
  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/start-upgrade.png" width="60%" title="Start the Fusion upgrade."/>
2. В верхней части <Constant name="cloud_ide" /> нажмите **Check deprecation warnings**.
  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/check-deprecations.png" width="60%" title="Begin the process of parsing for deprecation warnings."/>
3. dbt выполнит разбор проекта на предмет устаревших возможностей и отобразит список всех предупреждений о депрекации, а также предложит опцию **Autofix warnings**. Автоматическое исправление пытается автоматически устранить все синтаксические ошибки. Подробнее см. в разделе [Fix deprecation warnings](/docs/cloud/studio-ide/autofix-deprecations).
  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/check-deprecations.png" width="60%" title="Begin the process of parsing for deprecation warnings."/>
4. После устранения всех предупреждений о депрекации нажмите кнопку **Enable Fusion**. Это обновит ваше окружение разработки до Fusion!

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/autofix-success.png" width="60%" title="You're now ready to upgrade to Fusion in your development environment!"/>

Теперь, когда вы обновили окружение разработки до <Constant name="Fusion" />, вы готовы приступить к обновлению окружений Production, Staging и General. Следуйте стандартным процедурам вашей организации и используйте [release tracks](#release-tracks) для выполнения обновления.

<FusionUpgradeSteps />

## Задания

Каждая задача в <Constant name="cloud" /> может быть настроена так, чтобы наследовать параметры из окружения, к которому она относится.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/job-settings.png" width="200%" title="Settings of a dbt job"/>

Пример задания, показанный на скриншоте выше, принадлежит окружению "Prod". Оно наследует версию dbt из своего окружения, как показано в выборе **Inherited from ENVIRONMENT_NAME (DBT_VERSION)**. Вы также можете вручную переопределить версию dbt для конкретного задания, выбрав другую опцию из выпадающего меню.

## Поддерживаемые версии

dbt Labs всегда поощряла пользователей обновлять версии dbt Core каждый раз, когда выходит новая минорная версия. В декабре 2021 года мы выпустили первую мажорную версию dbt — `dbt 1.0`. Одновременно с этим релизом мы обновили нашу политику поддержки версий dbt Core в <Constant name="dbt_platform" />.

> **Начиная с версии v1.0, все последующие минорные версии доступны в <Constant name="cloud" />. Эти версии находятся на активной поддержке — с выпуском патчей и исправлений ошибок — в течение 1 года с момента их первоначального релиза. По завершении этого годового периода мы рекомендуем всем пользователям обновиться до более новой версии для получения дальнейшей поддержки и обслуживания.**

Мы предоставляем разные уровни поддержки для разных версий, которые могут включать новые функции, исправления ошибок или патчи безопасности:

<Snippet path="core-version-support" />

Мы продолжим обновлять следующую таблицу релизов, чтобы пользователи знали, когда мы планируем прекратить поддержку различных версий Core в <Constant name="cloud" />.

<Snippet path="core-versions-table" />

Начиная с версии v1.0, <Constant name="cloud" /> будет обеспечивать использование последнего совместимого patch-релиза `dbt-core` и плагинов, включая все самые свежие исправления. Вы также можете выбрать использование prerelease-версий этих patch-релизов до того, как они станут общедоступными.

<!--- TODO: Включить информацию о:
  - уведомлении пользователей, когда доступны новые минорные версии
  - уведомлении пользователей, когда используется минорная версия, приближающаяся к концу своего критического периода поддержки
  - автоматическом обновлении пользователей до следующей минорной версии, когда критическая поддержка заканчивается
--->

Чтобы узнать больше о поддержке версий и будущих релизах, см. [Understanding <Constant name="core" /> versions](/docs/dbt-versions/core).

### Нужна помощь с обновлением?

Если вам нужен дополнительный совет о том, как обновить ваши проекты dbt, ознакомьтесь с нашими [руководствами по миграции](/docs/dbt-versions/core-upgrade/) и нашей [страницей вопросов и ответов по обновлению](/docs/dbt-versions/upgrade-dbt-version-in-cloud#upgrading-legacy-versions-under-10).

### Тестирование изменений перед обновлением

Как только вы поймёте, какие изменения в коде вам нужно внести, можно приступать к их реализации. Мы рекомендуем:

- Создать отдельный dbt‑проект — «Upgrade project» — чтобы протестировать изменения перед тем, как применять их в основном dbt‑проекте.
- В «Upgrade project» подключиться к тому же репозиторию, который используется для вашего production‑проекта.
- В настройках среды разработки [settings](/docs/dbt-versions/upgrade-dbt-version-in-cloud) указать запуск последней версии <Constant name="core" />.
- Переключиться на ветку `dbt-version-upgrade`, внести необходимые изменения в проект и убедиться, что dbt‑проект успешно компилируется и выполняется с новой версией в <Constant name="cloud_ide" />.
  - Если обновление сразу до последней версии приводит к слишком большому количеству проблем, попробуйте тестировать проект последовательно на нескольких минорных версиях. Между удалёнными версиями <Constant name="core" /> (например, 1.0 → 1.10) прошли годы разработки и было несколько ломающих изменений. Вероятность столкнуться с проблемами при обновлении между соседними минорными версиями значительно ниже — именно поэтому рекомендуется обновляться регулярно.
- Когда ваш проект успешно компилируется и выполняется на последней версии dbt в среде разработки для ветки `dbt-version-upgrade`, попробуйте воспроизвести один из production‑джобов, запустив его на коде из этой ветки.
- Для этого можно создать новую deployment‑среду для тестирования, включить параметр custom branch (`ON`) и указать ветку `dbt-version-upgrade`. Также потребуется задать в этой среде последнюю версию dbt Core.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions/upgrade-environment.png" width="90%" title="Настройка тестовой среды" />

- Затем добавьте в новую тестовую среду job, который воспроизводит один из production‑джобов, на которые опирается ваша команда.
  - Если этот job выполняется без проблем, значит, всё готово к слиянию ветки в `main`.
  - После этого переведите среды разработки и deployment в основном dbt‑проекте на использование самой новой версии <Constant name="core" />.
