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

          <section className="translated-note section--compact">
            <div className="container">
              <div className="translated-note__card">
                <div className="translated-note__intro">
                  <h2 className="heading-3 translated-note__title">Это перевод</h2>
                  <p className="translated-note__copy">
                    Этот сайт — переведенная версия оригинальной документации по dbt и полностью ее дублирует.
                    Откройте нужную страницу на оригинальном сайте и замените домен, чтобы получить русскую версию:
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

          

          <section className="baton-2 section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Получите помощь от сообщества</span>
                <h2 className="heading-2">Присоединяйтесь к сообществу dbt</h2>
                <p>Общайтесь с тысячами разработчиков, которые каждый день решают реальные задачи с данными, на русском языке.</p>
              </div>
              <div className="home-card-grid">
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

          <section className="section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Подборка материалов</span>
                <h2 className="heading-2">Погрузитесь в dbt</h2>
                <p>Изучайте лучшие практики, подробные справочники по конфигурации или документацию по API.</p>
              </div>
              <div className="home-link-grid">
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Документация</h4>
                  <Link to="/docs/dbt-cloud-apis/overview">Документация API</Link>
                  <Link to="/docs/introduction">Документация по продукту</Link>
                  <Link to="/best-practices">Лучшие практики</Link>
                  <Link to="/docs/cloud/dbt-copilot">dbt Copilot</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Гайды</h4>
                  <Link to="/guides/snowflake?step=1">Быстрый старт с dbt и Snowflake</Link>
                  <Link to="/guides/databricks?step=1">Быстрый старт с dbt и Databricks</Link>
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
                  <Link to="/docs/dbt-versions/dbt-cloud-release-notes">Что нового в dbt</Link>
                  <Link to="/blog">Блог разработчиков</Link>
                  <Link to="/community/join">Присоединиться к сообществу</Link>
                </div>
              </div>
            </div>
          </section>

          <section className="baton-1 section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Глобальная поддержка</span>
                <h2 className="heading-2">Международное dbt Community</h2>
                <p>Общайтесь с экспертами dbt по всему миру на официальных площадках dbt Labs.</p>
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
