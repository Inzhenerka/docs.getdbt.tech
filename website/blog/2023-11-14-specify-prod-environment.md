---

title: Почему вам следует указать производственную среду в dbt Cloud
description: "Основная идея: Вы должны разделить свои среды в dbt Cloud в зависимости от их назначения (например, Производственная и Стадия/CI) и отметить одну из них как Производственную. Это улучшит ваш опыт CI и позволит использовать dbt Explorer."
slug: specify-prod-environment

authors: [joel_labes]

tags: [dbt Cloud]
hide_table_of_contents: false

date: 2023-11-14
is_featured: false

---

:::note Теперь вы можете использовать среду Staging!
Этот блог был написан до появления сред Staging. Теперь вы можете использовать dbt Cloud для поддержки обсуждаемых здесь шаблонов. Подробнее о [средах Staging](/docs/deploy/deploy-environments#staging-environment).
:::

:::tip Основная идея:
Вы должны [разделить свои задания](#how) по средам в dbt Cloud в зависимости от их назначения (например, Производственная и Стадия/CI) и установить одну из них как Производственную. Это улучшит ваш опыт CI и позволит использовать dbt Explorer.
:::

[Сегментация сред](/docs/environments-in-dbt) всегда была важной частью рабочего процесса аналитической инженерии:

- При разработке новых моделей вы можете [обрабатывать меньший подмножество ваших данных](/reference/dbt-jinja-functions/target#use-targetname-to-limit-data-in-dev) с помощью `target.name` или переменной окружения.
- Создавая ваши производственные модели в [другой схеме и базе данных](https://docs.getdbt.com/docs/build/custom-schemas#managing-environments), вы можете экспериментировать спокойно, не беспокоясь о том, что ваши изменения случайно повлияют на пользователей ниже по потоку.
- Использование выделенных учетных данных для производственных запусков, вместо индивидуальных учетных данных аналитического инженера, гарантирует, что ничего не сломается, когда этот давний сотрудник наконец-то завершит свою работу.

Исторически сложилось так, что dbt Cloud требовал отдельной среды для _разработки_, но не имел строгих требований к конфигурации вашей учетной записи. Это в основном работало – до тех пор, пока у вас не было ничего более сложного, чем CI-задание, смешанное с парой производственных заданий – потому что важные конструкции, такие как отложенные действия в CI и документация, были связаны только с одним заданием.

Но по мере того, как развертывания dbt в компаниях становились более сложными, предположение, что одного задания достаточно, больше не имеет смысла. Нам нужно обменять стратегию, ориентированную на задания, на более зрелый и масштабируемый подход, ориентированный на среду. Для поддержки этого недавнее изменение в dbt Cloud позволяет администраторам проектов [отметить одну из своих сред как Производственную среду](/docs/deploy/deploy-environments#set-as-production-environment-beta), так же как это давно возможно для среды разработки.

Явное разделение ваших производственных нагрузок позволяет dbt Cloud быть более умным с метаданными, которые он создает, и особенно важно для двух новых функций: dbt Explorer и пересмотренных рабочих процессов CI.

<!-- truncate -->

## Убедитесь, что dbt Explorer всегда имеет самую свежую информацию

**Старый способ**: Ваш сайт dbt docs основывался на запуске одного задания.

**Новый способ**: dbt Explorer использует метаданные из всех вызовов в определенной производственной среде, чтобы создать наиболее полное и актуальное понимание вашего проекта.

Поскольку dbt docs могли обновляться только одним заранее определенным заданием, пользователи, которым нужно было, чтобы их документация немедленно отражала изменения, развернутые в течение дня (независимо от того, какое задание их выполняло), были вынуждены запускать специальное задание, которое ничего не делало, кроме как регулярно запускало `dbt docs generate`.

API Discovery, который поддерживает dbt Explorer, поглощает все метаданные, сгенерированные любым вызовом dbt, что означает, что он всегда может быть актуальным с примененным состоянием вашего проекта. Однако не имеет смысла, чтобы dbt Explorer показывал документы на основе PR, который еще не был объединен.

Чтобы избежать этого смешения, вам нужно отметить среду как Производственную. Все запуски, завершенные в _этой_ среде, будут способствовать dbt Explorer, в то время как другие будут исключены. (Будущие версии Explorer будут поддерживать выбор среды, чтобы вы могли предварительно просмотреть изменения в документации.)

## Запускайте более компактный CI с отложением на уровне среды

**Старый способ**: [Slim CI](/guides/set-up-ci?step=2) откладывал на одно задание и обнаруживал изменения только на момент последнего времени сборки этого задания.

**Новый способ**: Изменения обнаруживаются независимо от задания, в котором они были развернуты, устраняя ложные срабатывания и избыточное построение моделей в CI.

Точно так же, как и dbt docs, полагаться на одно задание для определения вашего состояния для целей сравнения приводит к выбору между ненужным перестроением моделей, которые были развернуты другим заданием, или созданием специального задания, которое повторно запускает `dbt compile`, чтобы быть в курсе всех изменений.

Используя среду как арбитра состояния, всякий раз, когда в вашем производственном развертывании вносятся изменения, они немедленно будут учтены в последующих запусках Slim CI.

## Самый простой способ разделить ваши задания {#how}

<Lightbox src="/img/blog/2023-11-06-differentiate-prod-and-staging-environments/data-landscape.png" alt="Диаграмма, показывающая взаимодействие хранилища данных, git-репозитория и проекта dbt Cloud в средах Dev, CI и Prod." title="Ландшафт данных вашей организации должен разделять среды Dev, CI и Prod. Для этого настройте ваше хранилище данных, git-репозиторий и учетную запись dbt Cloud, как показано выше." width="100%"/>

Для большинства проектов переход от подхода, ориентированного на задания, к подходу, ориентированному на среду, к метаданным прост и сразу приносит дивиденды, как описано выше. Предполагая, что ваши задания Staging/CI и Production в настоящее время смешаны, вы можете их разделить следующим образом:

1. Создайте новую среду dbt Cloud под названием Staging
2. Для каждого задания, принадлежащего среде Staging, отредактируйте задание и обновите его среду
3. Отметьте [«Отметить как производственную среду»](/docs/deploy/deploy-environments#set-as-production-environment-beta) в настройках вашей оригинальной среды

## Заключение

До недавнего времени я считал среды в dbt Cloud способом использования различных учетных данных аутентификации в разных контекстах. И до недавнего времени я был в основном прав.

Но больше нет. Метаданные, которые создает dbt, критически важны для эффективных команд по работе с данными – будь то экономия затрат, обнаруживаемость, увеличение скорости разработки или надежные результаты по всей вашей организации – но они полностью эффективны только в том случае, если они сегментированы по среде, которая их создала.

Потратьте несколько минут на очистку ваших сред – это сделает всю разницу.