import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Card from '@site/src/components/card';
import allBlogData from './../../.docusaurus/docusaurus-plugin-content-blog/default/p/blog-archive-f05.json';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDateTimeFormat } from '@docusaurus/theme-common/internal';
import { getSpotlightMember } from '../utils/get-spotlight-member';
import { getInzhenerkaPromo } from '../utils/get-inzhenerka-promo';
import Link from '@docusaurus/Link';
import BlogPostCard from '@site/src/components/blogPostCard';
import StructuredData from '@site/src/components/StructuredData';

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

  const featuredResource = {
    title: "Как мы структурируем наши проекты dbt",
    description:
      "Наши практические рекомендации о том, как структурировать dbt-проект для успешной работы, а также понимание ключевых принципов построения аналитики.",
    link: "/best-practices/how-we-structure/1-guide-overview",
    image: "/img/structure-dbt-projects.png",
    sectionTitle: "Featured resource",
  };

  // Set spotlightSection to featuredResource by default
  let spotlightSection = featuredResource;

  // Check if featured community spotlight member set in Docusaurus config
  const { siteConfig } = useDocusaurusContext();
  let communitySpotlightMember =
    siteConfig?.themeConfig?.communitySpotlightMember || null;

  // Get spotlight member by ID or date if available
  const spotlightMember = getSpotlightMember(communitySpotlightMember);

  // Set Inzhenerka promo instead of community members
  spotlightSection = getInzhenerkaPromo() || spotlightSection;

  // note: we've removed the in-hero search input so that we can rely on navbar DocSearch (⌘K) only.

  return (
    <>
      <Head>
      </Head>
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
          style={{ padding: 0, background: '#FFF' }}
        >
          <header className="baton-hero baton-hero--compact">
            <div className="container">
              <div>
                <h1 className="heading-1 heading-1--tight">Документация dbt на русском языке</h1>
                <p className="hero-subcopy">
                Всё необходимое, чтобы выстраивать аналитику, документировать данные и работать с dbt в команде.
                </p>

                {/* quickstarts moved up with tightened spacing */}
                <div className="hero-cta hero-cta--tight">
                  <Link
                    id="hero-vs-code-cta"
                    className="hero-border-beam-cta"
                    to="/docs/get-started-dbt">
                      <span>Начать работу с dbt</span>
                      </Link>
                </div>
              </div>
            </div>
          </header>

          <section className="translated-note" style={{padding: "2rem"}}>
            <h2>Это перевод</h2>
            <p>
              Сайт является переведенной версией
              оригинальной документации по dbt. Мы приглашаем всех желающих
              вносить правки и улучшения в перевод, чтобы сделать его ещё точнее и
              полезнее для сообщества. Если вы заметили неточность или хотите
              помочь улучшить перевод, присылайте правки в
              <a href="https://github.com/Inzhenerka/docs.getdbt.tech" style={{marginLeft: '5px'}}>репозиторий</a> или в <a href="https://t.me/inzhenerkatech_sup" style={{marginLeft: '5px'}}>поддержку</a>.
            </p>
            <div>
              Сайт полностью дублирует оригинальный, поэтому для перевода любой страницы достаточно заменить
              адрес <b>https://docs.getdbt.com</b> на <b>https://docs.getdbt<span style={{color: '#ff6849'}}>.tech</span></b>.
            </div>
          </section>

          <section className="section--compact home-quickstart">
            <div className="container">
              <div>
                <span className="eyebrow">Quickstart</span>
                <h2 className="heading-2">New to dbt? Start here.</h2>
              </div>
              <div className="home-card-grid">
                <Card
                  title="dbt Fusion engine"
                  tag="Статья"
                  body="Узнайте о движке dbt Fusion и о том, как он позволяет dbt работать быстрее и масштабироваться как никогда раньше."
                  link="/docs/fusion"
                  icon="zap"
                />
                <Card
                  title="Get started with dbt"
                  tag="Гайд"
                  body="Быстро начните работу с нашими quickstart-руководствами."
                  link="/docs/get-started-dbt"
                  icon="settings"
                />
                <Card
                  title="Move to the dbt platform"
                  tag="Гайд"
                  body="Перейдите с dbt Core на мощную и очень быструю платформу dbt уже сегодня!"
                  link="/guides/core-to-cloud-1?step=1"
                  icon="tool"
                />
              </div>
            </div>
          </section>

          <section className="baton-1 section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Документация по продуктам</span>
                <h2 className="heading-2">Изучайте документацию по продуктам</h2>
              </div>
              <div className="home-card-grid">
                <Card
                  title="dbt Copilot"
                  body="AI-ассистент, который автоматизирует код, тесты и документацию в вашем рабочем процессе."
                  link="/docs/cloud/dbt-copilot"
                  icon="dbt-copilot"
                />
                <Card
                  title="VS Code Extension"
                  body="Бесплатный инструмент, который приносит всю мощь движка dbt Fusion в локальную среду: обнаружение ошибок в реальном времени, молниеносный парсинг, инсайты и подробный lineage — прямо в VS Code или Cursor."
                  link="/docs/about-dbt-extension"
                  icon="vsce"
                  showBorderBeam
                />
                <Card
                  title="dbt Orchestrator"
                  body="При каждом запуске job оркестрация с учетом state автоматически определяет, какие модели собирать, обнаруживая изменения в коде или данных."
                  link="/docs/deploy/state-aware-about"
                  icon="deploy"
                />
                <Card
                  title="dbt Insights"
                  body="dbt Insights помогает пользователям удобно исследовать и запрашивать данные в интуитивном, контекстном интерфейсе."
                  link="/docs/explore/dbt-insights"
                  icon="insights"
                />
                <Card
                  title="dbt Canvas"
                  body="dbt Canvas помогает быстро получать доступ к данным и трансформировать их с помощью визуального drag-and-drop интерфейса и встроенного AI для генерации пользовательского кода."
                  link="/docs/cloud/canvas"
                  icon="canvas"
                />
                <Card
                  title="dbt Semantic Layer"
                  body="dbt Semantic Layer устраняет дублирование кода: команды данных могут определять метрики поверх существующих моделей, а соединения данных (joins) обрабатываются автоматически."
                  link="/docs/use-dbt-semantic-layer/dbt-sl"
                  icon="semantic"
                />
                <Card
                  title="dbt Catalog"
                  body="Используйте dbt Catalog, чтобы просматривать и управлять проектами в dbt, помогая себе и другим разработчикам данных, аналитикам и потребителям находить и использовать ресурсы dbt."
                  link="/docs/explore/explore-projects"
                  icon="compass"
                />
                <Card
                  title="Studio IDE"
                  body="Интегрированная среда разработки dbt (Studio IDE) — единый веб‑интерфейс для создания, тестирования, запуска и ведения версий dbt‑проектов."
                  link="/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-cloud-ide"
                  icon="dashboard"
                />
                <Card
                  title="dbt Mesh"
                  body="dbt Mesh — фреймворк, который помогает организациям эффективно масштабировать команды и data assets."
                  link="/docs/mesh/about-mesh"
                  icon="lineage"
                />
              </div>
            </div>
          </section>

          <section className="section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Подборка материалов</span>
                <h2 className="heading-2">Погрузитесь глубже в dbt</h2>
                <p>Изучайте best practices, подробные справочники по конфигурации или документацию по нашим API.</p>
              </div>
              <div className="home-link-grid">
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Документация</h4>
                  <Link to="/docs/dbt-cloud-apis/overview">Документация API</Link>
                  <Link to="/docs/introduction">Документация по продукту</Link>
                  <Link to="/best-practices">Лучшие практики</Link>
                  <Link to="/docs/cloud/dbt-copilot">Copilot</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Гайды</h4>
                  <Link to="/guides/snowflake?step=1">Quickstart для dbt и Snowflake</Link>
                  <Link to="/guides/databricks?step=1">Quickstart для dbt и Databricks</Link>
                  <Link to="/guides/airflow-and-dbt-cloud?step=1">Airflow и dbt</Link>
                  <Link to="/guides/debug-errors?step=1">Отладка ошибок</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Справочники</h4>
                  <Link to="/reference/dbt-commands">Справочник команд</Link>
                  <Link to="/category/project-configs">Конфигурации проекта</Link>
                  <Link to="/reference/artifacts/dbt-artifacts">Артефакты dbt</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Другое</h4>
                  <Link to="/docs/dbt-versions/dbt-cloud-release-notes">Release notes</Link>
                  <Link to="/blog">Блог для разработчиков</Link>
                  <Link to="/community/join">Присоединиться к сообществу</Link>
                </div>
              </div>
            </div>
          </section>

          <section className="baton-2 section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Получите помощь от сообщества</span>
                <h2 className="heading-2">Присоединяйтесь к dbt Community</h2>
                <p>Общайтесь с тысячами разработчиков, которые каждый день решают реальные задачи с данными.</p>
              </div>
              <div className="home-card-grid">
                <Card
                  title="Присоединиться к Slack"
                  body="Задавайте вопросы, получайте ответы и знакомьтесь с людьми, которые говорят на вашем «языке данных»."
                  link="https://www.getdbt.com/community/join-the-community/"
                  icon="annotation"
                  target="_blank"
                />
                <Card
                  title="GitHub Discussions"
                  body="Участвуйте в технических обсуждениях или открывайте issues."
                  link="https://github.com/dbt-labs/docs.getdbt.com"
                  icon="github-new"
                  target="_blank"
                />
                <Card
                  title="Подписаться на рассылку"
                  body="Свежие идеи сообщества, вакансии и инструменты — каждую неделю."
                  link="https://www.getdbt.com/learn/newsletter"
                  icon="inbox"
                  target="_blank"
                />
                <Card
                  title="Ответить на вопрос на Discourse"
                  body="Помогите кому-то решить реальную задачу — и укрепляйте свою репутацию."
                  link="/community/forum"
                  icon="message"
                />
                <Card
                  title="События и митапы"
                  body="Присоединяйтесь к локальным и глобальным митапам dbt."
                  link="/community/events"
                  icon="globe"
                />
                <Card
                  title="Курсы и туториалы"
                  body="Изучайте dbt с практическими инструкциями."
                  link="https://learn.getdbt.com/catalog"
                  icon="forward"
                  target="_blank"
                />
                <Card
                  title="dbt & modern data stack"
                  body="Главное русскоязычное сообщество по dbt. Помощь по любым вопросам"
                  link="https://t.me/dbt_users"
                  icon="dbt-bit"
                />
                <Card
                  title="Data Engineers"
                  body="Большое сообщество инженеров данных. Чат с профессионалами"
                  link="https://t.me/hadoopusers"
                  icon="postgres"
                />
                <Card
                    title="Это разве аналитика?"
                    body="Анализ данных и визуализация, интересные ссылки, вакансии, уроки, юмор и личный опыт"
                    link="https://t.me/eto_analytica"
                    icon="smiley-face"
                />
                <Card
                    title="Data & IT Career"
                    body="Карьера в дата-профессиях и в ИТ в общем"
                    link="https://t.me/data_career"
                    icon="rocket"
                />
                <Card
                    title="Data Whisperer"
                    body="Navigating the Big Data Landscape"
                    link="https://t.me/data_whisperer"
                    icon="star"
                />
                <Card
                    title="Дашбордец"
                    body="Уютный канал про дашборды - от бизнес-анализа до реализации на BI"
                    link="https://t.me/dashboardets"
                    icon="guides"
                />
                <Card
                    title="Data Events"
                    body="Ивенты по Big Data, DE, BI, AI, ML, DS, DA, etc"
                    link="https://t.me/data_events"
                    icon="calendar"
                />
                <Card
                    title="Data engineering events"
                    body="Data engineering events 👷‍♂️👷"
                    link="https://t.me/DE_events"
                    icon="calendar"
                />
                <Card
                  title="Онлайн-курсы"
                  body="Структурированные курсы для глубокого погружения в темы аналитики и инженерии"
                  link="https://inzhenerka.tech/working-with-data"
                  icon="computer"
                />
              </div>
            </div>
          </section>

          <section className="static-bg section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">От команды</span>
                <h2 className="heading-2">Читайте блог для разработчиков</h2>
                <p>Подробные разборы, changelog’и, best practices и новости о новых возможностях от dbt Labs.</p>
              </div>
              <div className="home-card-grid">
                {recentBlogData.map((item) => (
                  <BlogPostCard key={item.link} postMetaData={item} />
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
