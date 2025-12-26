<ul>
<li><strong>Поддерживается</strong>: {props.meta.maintained_by}</li>
<li><strong>Авторы</strong>: {props.meta.authors}</li>
<li><strong>GitHub-репозиторий</strong>: <a href={`https://github.com/${props.meta.github_repo}`}>{props.meta.github_repo}</a>   <a href={`https://github.com/${props.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${props.meta.github_repo}?style=for-the-badge`}/></a></li>
<li><strong>Пакет PyPI</strong>: <code>{props.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${props.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${props.meta.pypi_package}.svg`}/></a></li>
<li><strong>Канал в Slack</strong>: <a href={props.meta.slack_channel_link}>{props.meta.slack_channel_name}</a></li>
<li><strong>Поддерживаемая версия dbt Core</strong>: {props.meta.min_core_version} и новее</li>
<li><strong>Поддержка <Constant name="cloud" /></strong>: {props.meta.cloud_support}</li>
<li><strong>Минимальная версия платформы данных</strong>: {props.meta.min_supported_version}</li>
</ul>

<h2> Установка {props.meta.pypi_package}</h2>

Используйте `pip` для установки адаптера. До версии 1.8 установка адаптера автоматически устанавливала `dbt-core` и все дополнительные зависимости. Начиная с версии 1.8, установка адаптера **не** приводит к автоматической установке `dbt-core`. Это связано с тем, что версии адаптеров и dbt Core были отделены друг от друга, и теперь мы не хотим перезаписывать существующие установки dbt-core.

Используйте следующую команду для установки:

<code>python -m pip install dbt-core {props.meta.pypi_package}</code>

<h2> Configuring {props.meta.pypi_package} </h2>

<p>Для конфигурации, специфичной для {props.meta.platform_name}, пожалуйста, обратитесь к <a href={props.meta.config_page}>настройкам {props.meta.platform_name}.</a> </p>

<p>Для конфигурации, специфичной для {props.meta.platform_name}, пожалуйста, обратитесь к <a href={props.meta.config_page}>конфигурациям {props.meta.platform_name}.</a> </p>