Следующие инструменты интегрируются с dbt Semantic Layer:

<!-- не изменяйте порядок карточек, если это не согласовано с SL PM и командой Partnerships -->

<div className="grid--3-col">

<Card
    title="Power BI"
    link="/docs/cloud-integrations/semantic-layer/power-bi"
    body="Use reports to query the dbt Semantic Layer with Power BI and produce dashboards with trusted data."
    icon="pbi"/>

 <Card
    title="Tableau"
    link="/docs/cloud-integrations/semantic-layer/tableau"
    body="Узнайте, как подключиться к Tableau для выполнения запросов к метрикам и совместной работы с вашей командой."
    icon="tableau-software"/>
  
  <Card
    title="Google Sheets"
    link="/docs/cloud-integrations/semantic-layer/gsheets"
    body="Узнайте, как подключиться к Google Sheets для выполнения запросов к метрикам и совместной работы с вашей командой."
    icon="google-sheets-logo-icon"/>

  <Card
    title="Microsoft Excel"
    link="/docs/cloud-integrations/semantic-layer/excel"
    body="Подключитесь к Microsoft Excel, чтобы выполнять запросы к метрикам и работать совместно с вашей командой. Доступно для Excel Desktop или Excel Online."
    icon="excel"/>

  <div className="card-container">
    <Card
      title="Dot"
      link="https://docs.getdot.ai/dot/integrations/dbt-semantic-layer"
      body="Позвольте всем анализировать данные с помощью AI в Slack или Teams."
      icon="dot-ai"/>
      <a href="https://docs.getdot.ai/dot/integrations/dbt-semantic-layer"
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

Прежде чем подключиться к этим инструментам, вам необходимо сначала [настроить dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) и [создать токен службы](/docs/dbt-cloud-apis/service-tokens) для создания разрешений **Semantic Layer Only** и **Metadata Only**.