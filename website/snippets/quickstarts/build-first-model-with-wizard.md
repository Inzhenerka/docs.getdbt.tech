### Создайте модель с помощью ИИ в dbt Wizard {#build-it-with-ai-using-dbt-wizard}

Не хотите писать SQL вручную? <Constant name="wizard" /> может создать для вас ту же модель прямо в <Constant name="studio_ide" /> или на [главной вкладке](/docs/platform/wizard-home?version=2&section=qs-build-with-ai), опираясь на фактическую схему и граф зависимостей вашего проекта. Но будьте осторожны: говорят, волшебник умеет <WizardPopcorn>творить заклинания</WizardPopcorn>.

1. Откройте <Constant name="wizard" /> в <Constant name="studio_ide" />.

<Lightbox src="/img/docs/dbt-platform/wizard-ide-refactor-lineage.png" width="95%" title="dbt Wizard выполняет рефакторинг модели и показывает граф зависимостей в интерфейсе чата."/>

2. Введите запрос: «Создай модель customers, которая объединяет orders и customers и включает дату последнего заказа и общее количество заказов для каждого клиента».
3. Проверьте SQL, сгенерированный <Constant name="wizard" />, затем примите его, чтобы сохранить модель.
4. Введите `dbt run`, чтобы построить модель.

В любом случае вы получите одну и ту же работающую модель. Узнайте больше о [dbt Wizard на платформе dbt](/docs/dbt-ai/wizard-ide?section=qs-build-with-ai).
