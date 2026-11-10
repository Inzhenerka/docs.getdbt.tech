Следующие инструменты интегрируются с dbt Semantic Layer:

<!-- не изменяйте порядок карточек, если это не согласовано с SL PM и командой Partnerships -->

<div className="grid--3-col">

<Card
    title="Power BI"
link="/docs/platform-integrations/semantic-layer/power-bi"
    body="Используйте отчеты для выполнения запросов к семантическому слою dbt через Power BI и создания дашбордов на основе достоверных данных."
    icon="pbi"/>

 <Card
    title="Tableau"
link="/docs/platform-integrations/semantic-layer/tableau"
    body="Узнайте, как подключиться к Tableau для выполнения запросов к метрикам и совместной работы с вашей командой."
    icon="tableau-software"/>
  
  <Card
    title="Google Sheets"
link="/docs/platform-integrations/semantic-layer/gsheets"
    body="Узнайте, как подключиться к Google Sheets для выполнения запросов к метрикам и совместной работы с вашей командой."
    icon="google-sheets-logo-icon"/>

  <Card
    title="Microsoft Excel"
link="/docs/platform-integrations/semantic-layer/excel"
    body="Подключитесь к Microsoft Excel, чтобы запрашивать метрики и совместно работать с командой. Доступно для Excel Desktop и Excel Online."
    icon="excel"/>

  <div className="card-container">
    <Card
      title="Omni"
      link="https://docs.omni.co/integrations/dbt/semantic-layer"
      body="Подключите Omni к семантическому слою dbt, чтобы запрашивать проверенные метрики прямо из модели данных Omni."
      icon="omni"/>
      <a href="https://docs.omni.co/integrations/dbt/semantic-layer"
      className="external-link"
      target="_blank"
      rel="noopener noreferrer">
      <Icon name='fa-external-link' />
    </a>
  </div>

  <div className="card-container">
    <Card
      title="Dot"
link="https://docs.getdot.ai/integrations/semantic-layers/dbt-semantic-layer"
      body="Подключите Dot к семантическому слою dbt, чтобы задавать вопросы в Slack, Microsoft Teams или через веб-интерфейс и получать ответы на основе ваших метрик."
      icon="dot-ai"/>
      <a href="https://docs.getdot.ai/integrations/semantic-layers/dbt-semantic-layer"
      className="external-link"
      target="_blank"
      rel="noopener noreferrer">
      <Icon name='fa-external-link' />
    </a>
  </div>

  <div className="card-container">
    <Card
      title="Hex"
      link="https://learn.hex.tech/docs/connect-to-data/data-connections/dbt-integration#dbt-semantic-layer-integration"
      body="Узнайте, как подключиться, анализировать метрики, работать совместно и открывать новые возможности данных."
      icon="hex"/>
      <a href="https://learn.hex.tech/docs/connect-to-data/data-connections/dbt-integration#dbt-semantic-layer-integration"
      className="external-link"
      target="_blank"
      rel="noopener noreferrer">
      <Icon name='fa-external-link' />
    </a>
  </div>

<div className="card-container">
  <Card
    title="Klipfolio PowerMetrics"
    body="Узнайте, как подключиться к упрощенному каталогу метрик и предоставлять аналитические данные, ориентированные на метрики, бизнес-пользователям."
    icon="klipfolio"
    link="https://support.klipfolio.com/hc/en-us/articles/18164546900759-PowerMetrics-Adding-dbt-Semantic-Layer-metrics"/>
    <a href="https://support.klipfolio.com/hc/en-us/articles/18164546900759-PowerMetrics-Adding-dbt-Semantic-Layer-metrics"
    className="external-link"
      target="_blank"
      rel="noopener noreferrer">
      <Icon name='fa-external-link' />
    </a>
</div>

<div className="card-container">
  <Card
    title="Mode"
    body="Узнайте, как подключиться, получить доступ и использовать надежные метрики и инсайты."
    link="https://mode.com/help/articles/supported-databases#dbt-semantic-layer"
    icon="mode"/>
    <a href="https://mode.com/help/articles/supported-databases#dbt-semantic-layer"
    className="external-link"
      target="_blank"
      rel="noopener noreferrer">
      <Icon name='fa-external-link' />
    </a>
</div>

<div className="card-container">
  <Card
    title="Push.ai"
    body="Узнайте, как подключиться и использовать метрики для создания отчетов и инсайтов, которые приводят к изменениям."
    link="https://docs.push.ai/data-sources/semantic-layers/dbt"
    icon="push"/>
    <a href="https://docs.push.ai/data-sources/semantic-layers/dbt"
    className="external-link"
      target="_blank"
      rel="noopener noreferrer">
      <Icon name='fa-external-link' />
    </a>
</div>

<div className="card-container">
  <Card
    title="Sigma (Preview)"
    body="Подключите Sigma к dbt Semantic Layer, чтобы использовать заранее определенные метрики dbt в рабочих книгах Sigma."
    link="https://help.sigmacomputing.com/docs/configure-a-dbt-semantic-layer-integration"
    icon="sigma"/>
    <a href="https://help.sigmacomputing.com/docs/configure-a-dbt-semantic-layer-integration"
    className="external-link"
      target="_blank"
      rel="noopener noreferrer">
      <Icon name='fa-external-link' />
    </a>
</div>


<div className="card-container">
  <Card
    title="Steep"
    body="Подключите Steep к dbt Semantic Layer для централизованной, масштабируемой аналитики."
    link="https://help.steep.app/integrations/dbt-cloud"
    icon="steep"/>
    <a href="https://help.steep.app/integrations/dbt-cloud"
    className="external-link"
      target="_blank"
      rel="noopener noreferrer">
      <Icon name='fa-external-link' />
    </a>
</div>

</div><br />

Прежде чем подключаться к этим инструментам, необходимо [настроить семантический слой dbt](/docs/use-dbt-semantic-layer/setup-sl) и [сгенерировать сервисный токен](/docs/dbt-apis/service-tokens), чтобы настроить разрешения **Semantic Layer Only** и **Metadata Only**.
