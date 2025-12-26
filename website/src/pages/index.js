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
                Найдите всё необходимое, чтобы создавать, документировать и работать с dbt в команде &mdash; быстрее и на русском.
                </p>

                {/* quickstarts moved up with tightened spacing */}
                <div className="hero-cta hero-cta--tight">
                  <Link
                    id="hero-vs-code-cta"
                    className="hero-border-beam-cta"
                    to="/docs/install-dbt-extension">
                      <span>Install dbt VS Code extension + Fusion</span>
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
                  tag="Article"
                  body="Learn about the dbt Fusion engine and see how it enables dbt to operate at speed and scale like never before."
                  link="/docs/fusion"
                  icon="zap"
                />
                <Card
                  title="Get started with dbt"
                  tag="Guide"
                  body="Build fast with our quickstart guides."
                  link="/docs/get-started-dbt"
                  icon="settings"
                />
                <Card
                  title="Move to the dbt platform"
                  tag="Guide"
                  body="Migrate from dbt Core to the powerful, lightning fast dbt platform today!"
                  link="/guides/core-to-cloud-1?step=1"
                  icon="tool"
                />
              </div>
            </div>
          </section>

          <section className="baton-1 section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Documentation by product</span>
                <h2 className="heading-2">Explore the docs by product</h2>
              </div>
              <div className="home-card-grid">
                <Card
                  title="dbt Copilot"
                  body="AI-powered assistant that automates code, tests, and documentation in your workflow."
                  link="/docs/cloud/dbt-copilot"
                  icon="dbt-copilot"
                />
                <Card
                  title="VS Code Extension"
                  body="This free tool brings the full power of the dbt Fusion engine into your local environment with features like live error detection, lightning-fast parse times, insights and rich lineage all in VS Code or Cursor."
                  link="/docs/about-dbt-extension"
                  icon="vsce"
                  showBorderBeam
                />
                <Card
                  title="dbt Orchestrator"
                  body="Every time a job runs, state-aware orchestration automatically determines which models to build by detecting changes in code or data."
                  link="/docs/deploy/state-aware-about"
                  icon="deploy"
                />
                <Card
                  title="dbt Insights"
                  body="dbt Insights in dbt empowers users to seamlessly explore and query data with an intuitive, context-rich interface."
                  link="/docs/explore/dbt-insights"
                  icon="insights"
                />
                <Card
                  title="dbt Canvas"
                  body="dbt Canvas helps you quickly access and transform data through a visual, drag-and-drop experience and with a built-in AI for custom code generation."
                  link="/docs/cloud/canvas"
                  icon="canvas"
                />
                <Card
                  title="dbt Semantic Layer"
                  body="The dbt Semantic Layer eliminates duplicate coding by allowing data teams to define metrics on top of existing models and automatically handling data joins."
                  link="/docs/use-dbt-semantic-layer/dbt-sl"
                  icon="semantic"
                />
                <Card
                  title="dbt Catalog"
                  body="Use dbt Catalog to navigate and manage your projects within dbt to help you and other data developers, analysts, and consumers discover and leverage your dbt resources."
                  link="/docs/explore/explore-projects"
                  icon="compass"
                />
                <Card
                  title="Studio IDE"
                  body="The dbt integrated development environment (Studio IDE) is a single web-based interface for building, testing, running, and version-controlling dbt projects."
                  link="/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-cloud-ide"
                  icon="dashboard"
                />
                <Card
                  title="dbt Mesh"
                  body="dbt Mesh is a framework that helps organizations scale their teams and data assets effectively."
                  link="/docs/mesh/about-mesh"
                  icon="lineage"
                />
              </div>
            </div>
          </section>

          <section className="section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Docs highlights</span>
                <h2 className="heading-2">Dive deeper into dbt</h2>
                <p>Learn best practices, explore detailed configuration references, or review our APIs.</p>
              </div>
              <div className="home-link-grid">
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Documentation</h4>
                  <Link to="/docs/dbt-cloud-apis/overview">API Docs</Link>
                  <Link to="/docs/introduction">Product Docs</Link>
                  <Link to="/best-practices">Best Practices</Link>
                  <Link to="/docs/cloud/dbt-copilot">Copilot</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Guides</h4>
                  <Link to="/guides/snowflake?step=1">Quickstart for dbt and Snowflake</Link>
                  <Link to="/guides/databricks?step=1">Quickstart for dbt and Databricks</Link>
                  <Link to="/guides/airflow-and-dbt-cloud?step=1">Airflow and dbt</Link>
                  <Link to="/guides/debug-errors?step=1">Debugging errors</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Reference Guides</h4>
                  <Link to="/reference/dbt-commands">Command Reference</Link>
                  <Link to="/category/project-configs">Project Configurations</Link>
                  <Link to="/reference/artifacts/dbt-artifacts">dbt Artifacts</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Other Resources</h4>
                  <Link to="/docs/dbt-versions/dbt-cloud-release-notes">Release Notes</Link>
                  <Link to="/blog">Developer Blog</Link>
                  <Link to="/community/join">Join the Community</Link>
                </div>
              </div>
            </div>
          </section>

          <section className="baton-2 section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Get help from others</span>
                <h2 className="heading-2">Join the dbt Community</h2>
                <p>Connect with thousands of developers solving real data problems every day.</p>
              </div>
              <div className="home-card-grid">
                <Card
                  title="Join Slack"
                  body="Ask questions, get answers, and meet people who speak your data language."
                  link="https://www.getdbt.com/community/join-the-community/"
                  icon="annotation"
                  target="_blank"
                />
                <Card
                  title="GitHub Discussions"
                  body="Join technical threads or open issues."
                  link="https://github.com/dbt-labs/docs.getdbt.com"
                  icon="github-new"
                  target="_blank"
                />
                <Card
                  title="Subscribe to the newsletter"
                  body="Get fresh community ideas, job posts, and tools delivered weekly."
                  link="https://www.getdbt.com/learn/newsletter"
                  icon="inbox"
                  target="_blank"
                />
                <Card
                  title="Answer a question on Discourse"
                  body="Help someone solve a real problem—and build your reputation doing it."
                  link="/community/forum"
                  icon="message"
                />
                <Card
                  title="Events and Meetups"
                  body="Join local and global dbt meetups."
                  link="/community/events"
                  icon="globe"
                />
                <Card
                  title="Courses & Tutorials"
                  body="Learn dbt with hands-on guidance."
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
                <span className="eyebrow">From the team</span>
                <h2 className="heading-2">Read the developer blog</h2>
                <p>Deep dives, changelogs, best practices, and new feature highlights from dbt Labs.</p>
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
