Если у вас есть доступ к [<Constant name="wizard"/>](/docs/dbt-ai/wizard-ide) с включёнными [функциями ИИ](/docs/platform/manage-dbt-ai), вы можете воспользоваться навыком [миграции на <Constant name="fusion"/>](/docs/dbt-ai/wizard-ide#fusion-migration-workflow). Этот навык помогает исправлять ошибки совместимости прямо в <Constant name="studio_ide" /> с помощью <Constant name="wizard" /> &mdash; без ручного анализа логов. Он классифицирует каждую ошибку, автоматически применяет проверенные исправления и показывает, что препятствует дальнейшей миграции.

:::info
Процесс миграции на <Constant name="fusion" /> доступен через <Constant name="wizard" /> в <Constant name="studio_ide" />. Если вы используете VS Code или <Constant name="platform_cli" />, воспользуйтесь вместо этого [инструментом autofix](https://docs.getdbt.com/guides/dbt-package-compat?step=4).
:::

1. В списке заданий нажмите кнопку **Review job** для задания с успешным запуском.
   - Если кнопка **Review job** не отображается, включите переключатель **Show dbt v2 eligibility** в списке заданий.
2. Во всплывающем окне **<Constant name="fusion"/> eligibility unknown for this job** нажмите **Debug in Studio with dbt Wizard**.
3. dbt перенаправит вас в <Constant name="studio_ide" /> и переключит вашу персональную среду разработки на <Constant name="fusion" />.
4. Откроется <Constant name="wizard" /> и автоматически запустит навык миграции на <Constant name="fusion" /> со следующим запросом:
    ```
    I need help fixing dbt v2 compatibility issues in this project. Please investigate and resolve any deprecation warnings or incompatibilities. Please use the migrating-dbt-core-to-fusion skill to guide this.
    ```
5. Рассмотрите и одобрите запросы разрешений от <Constant name="wizard" />, чтобы он мог выполнять необходимые команды.
6. <Constant name="wizard" /> последовательно выполняет `dbt compile`, анализирует результаты и применяет исправления, пока компиляция не завершится успешно или не возникнет ошибка, которую он не сможет устранить. Если дальнейшая работа невозможна, он корректно завершает процесс, объясняет, что не удалось исправить, создаёт markdown-файл со сводкой всех внесённых изменений и предоставляет ссылку на него. 
7. Когда проект будет компилироваться без предупреждений и ошибок, создайте коммит и опубликуйте изменения.
8. После слияния изменений дождитесь повторного запуска задания или запустите его вручную на <Constant name="fusion"/>.

<Lightbox src="/img/docs/dbt-platform/v2-migration-workflow.gif" width="95%" title="Процесс миграции на v2 с помощью Developer Agent: анализ и исправление ошибок совместимости с v2 в Studio IDE." />
