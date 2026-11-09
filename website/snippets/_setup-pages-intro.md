<ul>
<li><strong>Поддерживается</strong>: {props.meta.maintained_by}</li>
    <li><strong>Авторы</strong>: {props.meta.authors}</li>
    <li><strong>Репозиторий GitHub</strong>: <a href={`https://github.com/${props.meta.github_repo}`}>{props.meta.github_repo}</a>   <a href={`https://github.com/${props.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${props.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>Пакет PyPI</strong>: <code>{props.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${props.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${props.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Канал Slack</strong>: <a href={props.meta.slack_channel_link}>{props.meta.slack_channel_name}</a></li>
    <li><strong>Поддерживаемая версия dbt</strong>: {props.meta.min_core_version} и новее</li>
    <li><strong>Поддержка <Constant name="dbt" /></strong>: {props.meta.cloud_support}</li>
    <li><strong>Минимальная версия платформы данных</strong>: {props.meta.min_supported_version}</li>
    </ul>

<h2> Установка {props.meta.pypi_package}</h2>

{props.children}

{!props.children && (
  <>
    Use `pip` to install the adapter. Use the following command for installation:
  </>
)}

<code>python -m pip install {props.installPackages || props.meta.pypi_package}</code>

<h2> Настройка {props.meta.pypi_package} </h2>

<p>Конфигурацию, специфичную для {props.meta.platform_name}, см. на странице <a href={props.meta.config_page}>настроек {props.meta.platform_name}.</a> </p>
