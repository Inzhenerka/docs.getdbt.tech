
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Card from '@site/src/components/card';
import BlogPostCard from '@site/src/components/blogPostCard';
import Hero from '@site/src/components/hero';
import PostCarousel from '@site/src/components/postCarousel';
import allBlogData from './../../.docusaurus/docusaurus-plugin-content-blog/default/p/blog-archive-f05.json'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDateTimeFormat } from '@docusaurus/theme-common/internal';
import { getSpotlightMember } from '../utils/get-spotlight-member';
import { getInzhenerkaPromo } from '../utils/get-inzhenerka-promo';

const bannerAnimation = require('@site/static/img/banner-white.svg');

function getBanner() {
  return { __html: bannerAnimation };
}

function Home() {

  // Use same date formatting as in theme's BlogPostItem component
  // https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/BlogPostItem/Header/Info/index.tsx
  const dateTimeFormat = useDateTimeFormat({
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const formatDate = (blogDate) => dateTimeFormat.format(new Date(blogDate));

  const recentBlogData = allBlogData?.archive?.blogPosts
    ?.slice(0, 6)
    .reduce((accumulator, currentValue) => {
      let postMetaData = {
        title: currentValue.metadata.title,
        date: formatDate(currentValue.metadata.date),
        readingTime: Math.round(currentValue.metadata.readingTime),
        description: currentValue.metadata.description,
        link: currentValue.metadata.permalink,
      };
      accumulator.push(postMetaData);
      return accumulator;
    }, []);

  const featuredResource = {
    title: "Как мы структурируем наши проекты dbt",
    description:
      "Наши практические рекомендации по структурированию вашего проекта dbt для успеха и пониманию принципов инженерии аналитики.",
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
  // If found, update section to show community spotlight member
  // Otherwise, show featured resource
  const spotlightMember = getSpotlightMember(communitySpotlightMember);

  // Set Inzhenerka promo instead of community members
  spotlightSection = getInzhenerkaPromo() || spotlightSection;

  return (
    <>
      <Layout permalink="/" description="Документация, гайды и руководства по dbt на русском языке">
        <Head>
        </Head>
        <div
          className="container container--fluid home"
          style={{ padding: "0", background: "#FFF" }}
        >
          <Hero
            heading="Документация dbt на русском языке"
            subheading="Добро пожаловать в центр изучения dbt, общения с сообществом и совершенствования аналитических навыков"
            showGraphic
          />

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

          <section
            className={`resource-section row ${spotlightMember ? "has-spotlight-member" : ""}`}
          >
            <div className="popular-header">
              <h2>Популярные ресурсы</h2>
            </div>
            <div className="popular-resources">
              <div className="grid">
                <div>
                  <Card
                    title="Что такое dbt?"
                    body="dbt позволяет специалистам по данным применять лучшие практики разработки программного обеспечения и разрабатывать модульный, надежный аналитический код."
                    link="/docs/introduction"
                    icon="question-mark"
                  />
                </div>
                <div>
                  <Card
                    title="Начало работы"
                    body="Научитесь настраивать dbt и создавать свои первые модели. Вы также сможете протестировать и задокументировать проект, а затем запланировать выполнение задачи."
                    link="/docs/get-started-dbt"
                    icon="book"
                  />
                </div>
                <div>
                  <Card
                    title="Документация"
                    body="Узнайте все возможности dbt — от основ до продвинутых концепций."
                    link="/docs/build/projects"
                    icon="docs"
                  />
                </div>
                <div>
                  <Card
                    title="Поддерживаемые платформы данных"
                    body="dbt подключается к большинству основных баз, хранилищ, озер данных и SQL-движков."
                    link="/docs/supported-data-platforms"
                    icon="rocket"
                  />
                </div>
              </div>
            </div>
            <div className="featured-header">
              <h2>
                {spotlightSection?.sectionTitle
                  ? spotlightSection.sectionTitle
                  : "Featured resource"}
              </h2>
            </div>
            <div className="featured-resource">
              <BlogPostCard postMetaData={spotlightSection} />
            </div>
          </section>

          <section className="from-the-community">
            <h2>Сообщество dbt</h2>
            <div className="grid--3-col">
              <div>
                <Card
                  title="dbt & modern data stack"
                  body="Главное русскоязычное сообщество по dbt. Помощь по любым вопросам"
                  link="https://t.me/dbt_users"
                  icon="dbt-bit"
                />
              </div>
              <div>
                <Card
                  title="Data Engineers"
                  body="Большое сообщество инженеров данных. Чат с профессионалами"
                  link="https://t.me/hadoopusers"
                  icon="postgres"
                />
              </div>
              <div>
                <Card
                  title="Это разве аналитика?"
                  body="Анализ данных и визуализация, интересные ссылки, вакансии, уроки, юмор и личный опыт"
                  link="https://t.me/eto_analytica"
                  icon="smiley-face"
                />
              </div>
            </div>
          </section>

          <section className="from-the-blog">
            <h2>Последние статьи из блогов</h2>
            <PostCarousel blogPostData={recentBlogData} />
          </section>

          <section className="like-a-pro">
            <h2>Используй dbt как профессионал</h2>
            <div className="grid--3-col">
              <div>
                <Card
                  title="Лучшие практики"
                  body="Изучите проверенные стратегии для внедрения лучших практик аналитики"
                  link="/best-practices"
                  icon="guides"
                />
              </div>
              <div>
                <Card
                  title="Форум dbt Discourse"
                  body="Получай помощь и делись знаниями на международном форуме"
                  link="/community/forum"
                  icon="discussions"
                />
              </div>
              <div>
                <Card
                  title="Онлайн-курсы"
                  body="Структурированные курсы для глубокого погружения в темы аналитики и инженерии"
                  link="https://inzhenerka.tech/working-with-data"
                  icon="computer"
                />
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
