import React from 'react';
import Layout from '@theme/Layout';
import Card from '@site/src/components/card';
import allBlogData from './../../.docusaurus/docusaurus-plugin-content-blog/default/p/blog-archive-61f.json';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDateTimeFormat } from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import BlogPostCard from '@site/src/components/blogPostCard';
import StructuredData from '@site/src/components/StructuredData';
import YoutubeVideo from '@site/src/components/youtube';

const bannerAnimation = require('@site/static/img/banner-white.svg');

function getBanner() {
  return { __html: bannerAnimation };
}

function Home() {
  // Use same date formatting as in theme's BlogPostItem component
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const formatDate = (blogDate) => dateTimeFormat.format(new Date(blogDate));

  const recentBlogData = allBlogData?.archive?.blogPosts
    ?.slice(0, 3)
    .reduce((accumulator, currentValue) => {
      let postMetaData = {
        title: currentValue.metadata.title,
        date: formatDate(currentValue.metadata.date),
        readingTime: Math.round(currentValue.metadata.readingTime),
        description: currentValue.metadata.description,
        link: currentValue.metadata.permalink,
        image: currentValue.metadata.image,
        tags: currentValue.metadata.tags,
      };
      accumulator.push(postMetaData);
      return accumulator;
    }, []);

  const { siteConfig } = useDocusaurusContext();

  return (
    <>
      <StructuredData
        type="WebPage"
        title="Центр разработчика dbt"
        description="Здесь вы найдёте всё, что нужно, чтобы быстрее создавать, документировать и вести совместную работу с dbt."
        url={siteConfig.url}
        tags={['dbt', 'документация', 'центр разработчика', 'трансформация данных']}
      />
      <Layout permalink="/" description="Документация, гайды и руководства по dbt на русском языке">
        <div
          className="container container--fluid home"
          data-md-root="true"
          style={{ padding: 0, background: '#FFF' }}
        >
          <header className="baton-hero baton-hero--compact">
            <div className="container">
              <div>
                <h1 className="heading-1 heading-1--tight">Документация dbt на русском языке</h1>
                <p className="hero-subcopy">
                Всё необходимое, чтобы выстраивать аналитику, документировать данные и работать с dbt в команде.
                </p>

                <div className="hero-cta hero-cta--tight">
                  <Link
                    id="hero-vs-code-cta"
                    className="hero-border-beam-cta"
                    to="/docs/local/install-dbt">
                    <span>Установить dbt</span>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <section className="translated-note section--compact">
            <div className="container">
              <div className="translated-note__card">
                <div className="translated-note__intro">
                  <h2 className="heading-3 translated-note__title">Это перевод</h2>
                  <p className="translated-note__copy">
                    Этот сайт — адаптированная версия документации по dbt.
                    На оригинальном англоязычном сайте достаточно поменять адрес, чтобы получить русскую версию страницы:
                  </p>                  
                  <div className="translated-note__swap-box">
                    <span className="translated-note__domain">https://docs.getdbt.com</span>
                    <span className="translated-note__arrow">→</span>
                    <span className="translated-note__domain translated-note__domain--accent">
                      https://docs.getdbt<span className="translated-note__domain-highlight">.tech</span>
                    </span>
                    </div>
                  <p className="translated-note__copy">
                    Мы приглашаем всех желающих вносить правки и улучшения в перевод, чтобы сделать его ещё точнее и
                    полезнее для сообщества. Если вы заметили неточность или хотите помочь улучшить перевод, присылайте
                    правки:
                  </p>
                  <div className="translated-note__links">
                    <a className="translated-note__link" href="https://github.com/Inzhenerka/docs.getdbt.tech">
                      в репозиторий
                    </a>
                    <span className="translated-note__or">или</span>
                    <a className="translated-note__link" href="https://t.me/inzhenerkatech_sup">
                      в поддержку
                    </a>
                  </div>
                </div>
                <div className="translated-note__media">
                  <img
                    className="translated-note__image"
                    src="/img/doudou-site.png"
                    alt="Скриншот сайта с русской версией документации"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="section--compact home-quickstart">
            <div className="container">
              <div>
                <span className="eyebrow">Быстрый старт</span>
                <h2 className="heading-2">Первый раз в dbt? Начните здесь</h2>
              </div>
              <div className="home-card-grid">
                <Card
                  headingLevel={3}
                  title="Начало работы с dbt"
                  tag="Руководство"
                  body="Настройте dbt и соберите первый проект по пошаговому руководству."
                  link="/docs/get-started-dbt"
                  icon="settings"
                />
                <Card
                  headingLevel={3}
                  title="О dbt"
                  tag="Статья"
                  body="Узнайте, как устроен dbt и как общий движок на Rust помогает ускорять обработку данных."
                  link="/docs/introduction"
                  icon="zap"
                />
                <Card
                  headingLevel={3}
                  title="Переход на платформу dbt"
                  tag="Руководство"
                  body="Перенесите самостоятельно размещённый dbt на платформу и настройте масштабируемые конвейеры данных."
                  link="/guides/dbt-migration-1?step=1"
                  icon="tool"
                />
              </div>
            </div>
          </section>

          <section className="section--compact home-video">
            <div className="container">
              <div className="home-video__content">
                <div>
                  <span className="eyebrow">Ознакомительное видео</span>
                  <h2 className="heading-2">Введение в dbt: основы моделирования данных</h2>
                  <p>Практический разбор dbt: как уйти от хаотичных SQL и ETL к управляемому хранилищу данных.
Без теории — реальные решения, подводные камни и лайфхаки, как dbt помогает команде и бизнесу.</p>
                </div>
                <div className="home-video__frame">
                  <YoutubeVideo id="BSge0lPJeHk" />
                </div>
              </div>
            </div>
          </section>

          <section className="baton-2 section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Получите помощь от сообщества</span>
                <h2 className="heading-2">Русскоязычное сообщество dbt</h2>
                <p>Общайтесь с тысячами разработчиков, которые каждый день решают реальные задачи с данными, на русском языке.</p>
              </div>
              <div className="home-card-grid">
                <Card
                  headingLevel={3}
                  title="dbt & modern data stack"
                  body="Главное русскоязычное сообщество по dbt. Помощь по любым вопросам"
                  link="https://t.me/dbt_users"
                  icon="dbt-bit"
                />
                <Card
                  headingLevel={3}
                  title="Data Engineers"
                  body="Большое сообщество инженеров данных. Чат с профессионалами"
                  link="https://t.me/hadoopusers"
                  icon="postgres"
                />
                <Card
                  headingLevel={3}
                    title="Это разве аналитика?"
                    body="Анализ данных и визуализация, интересные ссылки, вакансии, уроки, юмор и личный опыт"
                    link="https://t.me/eto_analytica"
                    icon="smiley-face"
                />
                <Card
                  headingLevel={3}
                    title="Data & IT Career"
                    body="Карьера в дата-профессиях и в ИТ в общем"
                    link="https://t.me/data_career"
                    icon="rocket"
                />
                <Card
                  headingLevel={3}
                    title="Data Whisperer"
                    body="Канал о больших данных"
                    link="https://t.me/data_whisperer"
                    icon="star"
                />
                <Card
                  headingLevel={3}
                    title="Дашбордец"
                    body="Уютный канал про дашборды - от бизнес-анализа до реализации на BI"
                    link="https://t.me/dashboardets"
                    icon="guides"
                />
                <Card
                  headingLevel={3}
                    title="Data Events"
                    body="Ивенты по Big Data, DE, BI, AI, ML, DS, DA, etc"
                    link="https://t.me/data_events"
                    icon="calendar"
                />
                <Card
                  headingLevel={3}
                    title="Data engineering events"
                    body="Мероприятия для инженеров данных"
                    link="https://t.me/DE_events"
                    icon="calendar"
                />
                <Card
                  headingLevel={3}
                  title="Онлайн-курсы"
                  body="Структурированные курсы для глубокого погружения в темы аналитики и инженерии"
                  link="https://inzhenerka.tech/working-with-data"
                  icon="computer"
                />
              </div>
            </div>
          </section>

          <section className="section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Подборка материалов</span>
                <h2 className="heading-2">Погрузитесь в dbt</h2>
                <p>Изучайте лучшие практики, подробные справочники по конфигурации или документацию по API.</p>
              </div>
              <div className="home-link-grid">
                <div className="home-link-grid-item">
                  <h3 className="heading-4">Документация</h3>
                  <Link to="/docs/dbt-apis/overview">Документация API</Link>
                  <Link to="/docs/introduction">Документация по продукту</Link>
                  <Link to="/best-practices">Лучшие практики</Link>
                  <Link to="/docs/platform/wizard-overview">dbt Wizard</Link>
                </div>
                <div className="home-link-grid-item">
                  <h3 className="heading-4">Гайды</h3>
                  <Link to="/guides/snowflake?step=1">Быстрый старт с dbt и Snowflake</Link>
                  <Link to="/guides/databricks?step=1">Быстрый старт с dbt и Databricks</Link>
                  <Link to="/guides/airflow-and-dbt-cloud?step=1">Airflow и dbt</Link>
                  <Link to="/guides/debug-errors?step=1">Отладка ошибок</Link>
                </div>
                <div className="home-link-grid-item">
                  <h3 className="heading-4">Справочники</h3>
                  <Link to="/reference/dbt-commands">Справочник команд</Link>
                  <Link to="/category/конфигурация-проекта">Конфигурации проекта</Link>
                  <Link to="/reference/artifacts/dbt-artifacts">Артефакты dbt</Link>
                </div>
                <div className="home-link-grid-item">
                  <h3 className="heading-4">Другое</h3>
                  <Link to="/docs/dbt-versions/release-notes">Что нового в dbt</Link>
                  <Link to="/blog">Блог разработчиков</Link>
                  <Link to="/community/join">Присоединиться к сообществу</Link>
                </div>
              </div>
            </div>
          </section>

          <section className="baton-2 section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Глобальная поддержка</span>
                <h2 className="heading-2">Международное сообщество dbt</h2>
                <p>Общайтесь с экспертами dbt по всему миру на официальных площадках dbt Labs.</p>
              </div>
              <div className="home-card-grid">
                <Card
                  headingLevel={3}
                  title="Присоединиться к Slack"
                  body="Задавайте вопросы, получайте ответы и знакомьтесь с людьми, которые говорят на вашем «языке данных»."
                  link="https://www.getdbt.com/community/join-the-community/"
                  icon="annotation"
                  target="_blank"
                />
                <Card
                  headingLevel={3}
                  title="GitHub Discussions"
                  body="Участвуйте в технических обсуждениях или открывайте issues."
                  link="https://github.com/dbt-labs/docs.getdbt.com"
                  icon="github-new"
                  target="_blank"
                />
                <Card
                  headingLevel={3}
                  title="Подписаться на рассылку"
                  body="Свежие идеи сообщества, вакансии и инструменты — каждую неделю."
                  link="https://www.getdbt.com/learn/newsletter"
                  icon="inbox"
                  target="_blank"
                />
                <Card
                  headingLevel={3}
                  title="Ответить на вопрос на Discourse"
                  body="Помогите кому-то решить реальную задачу — и укрепляйте свою репутацию."
                  link="https://discourse.getdbt.com/"
                  icon="message"
                />
                <Card
                  headingLevel={3}
                  title="Вебинары dbt Labs"
                  body="Смотрите предстоящие и записанные вебинары dbt Labs."
                  link="https://www.getdbt.com/resources/webinars"
                  icon="calendar"
                />
                <Card
                  headingLevel={3}
                  title="Мероприятия dbt"
                  body="Встречи, конференции и другие мероприятия сообщества."
                  link="https://www.getdbt.com/events"
                  icon="globe"
                />
                <Card
                  headingLevel={3}
                  title="Курсы и туториалы"
                  body="Изучайте dbt с практическими инструкциями."
                  link="https://learn.getdbt.com/catalog"
                  icon="forward"
                  target="_blank"
                />
              </div>
            </div>
          </section>

          <section className="baton-1 section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Документация по продуктам</span>
                <h2 className="heading-2">Изучите возможности dbt</h2>
              </div>
              <div className="home-card-grid">
                <Card
                  headingLevel={3}
                  title="dbt Wizard"
                  body="ИИ-агент для аналитической инженерии. Доступен на платформе dbt и в терминале."
                  link="/docs/platform/wizard-overview"
                  icon="dbt-copilot"
                />
                <Card
                  headingLevel={3}
                  title="Расширение для VS Code"
                  body="Бесплатное расширение для VS Code и Cursor с проверкой ошибок на лету, быстрым разбором проекта и графом зависимостей."
                  link="/docs/about-dbt-extension"
                  icon="vsce"
                  showBorderBeam
                />
                <Card
                  headingLevel={3}
                  title="dbt State"
                  body="Переиспользует результаты, когда данные и логика не изменились. Работает с локальным dbt и на платформе."
                  link="/docs/deploy/dbt-state-about"
                  icon="forward"
                />
                <Card
                  headingLevel={3}
                  title="dbt Orchestrator"
                  body="При каждом запуске определяет, какие модели нужно пересобрать с учётом изменений кода и данных."
                  link="/docs/deploy/state-aware-about"
                  icon="deploy"
                />
                <Card
                  headingLevel={3}
                  title="dbt Insights"
                  body="Исследуйте данные и выполняйте запросы в интерфейсе, который показывает контекст проекта."
                  link="/docs/explore/dbt-insights"
                  icon="insights"
                />
                <Card
                  headingLevel={3}
                  title="dbt Semantic Layer"
                  body="Определяйте метрики поверх существующих моделей. Семантический слой автоматически соединяет нужные данные."
                  link="/docs/use-dbt-semantic-layer/dbt-sl"
                  icon="semantic"
                />
                <Card
                  headingLevel={3}
                  title="dbt Catalog"
                  body="Находите модели и другие ресурсы dbt, изучайте зависимости и управляйте проектами."
                  link="/docs/explore/explore-projects"
                  icon="compass"
                />
                <Card
                  headingLevel={3}
                  title="Studio IDE"
                  body="Разрабатывайте, тестируйте и запускайте проекты dbt в браузере с поддержкой контроля версий."
                  link="/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide"
                  icon="dashboard"
                />
                <Card
                  headingLevel={3}
                  title="dbt Mesh"
                  body="Масштабируйте работу с данными, распределяя ответственность за проекты между командами."
                  link="/docs/mesh/about-mesh"
                  icon="lineage"
                />
              </div>
            </div>
          </section>

          <section className="static-bg section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">От команды dbt Labs</span>
                <h2 className="heading-2">Интересное в блоге разработчиков</h2>
                <p>Подробные разборы, лучшие практики и анонсы новых возможностей dbt.</p>
              </div>
              <div className="home-card-grid">
                {recentBlogData.map((item) => (
                  <BlogPostCard key={item.link} postMetaData={item} headingLevel={3} />
                ))}
              </div>
            </div>
          </section>
        </div>

        <div
          className="banner-animation"
          dangerouslySetInnerHTML={getBanner()}
        ></div>
      </Layout>
    </>
  );
}

export default Home;
