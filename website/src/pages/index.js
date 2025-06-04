
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
    title: "How we structure our dbt projects",
    description:
      "Our hands-on learnings for how to structure your dbt project for success and gain insights into the principles of analytics engineering.",
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
  if (spotlightMember) {
    spotlightSection = spotlightMember;
  }

  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="ex1EMwuCGU33-nOpoOajLXEpMPgUYK5exBWePCu-0l0"
        />
      </Head>
      <Layout permalink="/">
        <div
          className="container container--fluid home"
          style={{ padding: "0", background: "#FFF" }}
        >
          <Hero
            heading="The dbt Developer Hub"
            subheading="Find everything you need to build, document, and collaborate with dbt — faster."
          />
          <section
          >
            <div className="popular-header">
              <span className="eyebrow">Quickstart</span>
              <h2 className="heading-2">New to dbt? Start here.</h2>
            </div>
            <div className="popular-resources">
              <div className="home-card-grid">
                <div>
                  <Card
                    title="Set up dbt Core"
                    tag="Guide"
                    body="Install and run your first model locally"
                    link="/guides/manual-install?step=1"
                    icon="settings"
                  />
                </div>
                <div>
                  <Card
                    title="Use dbt in the Cloud"
                    tag="Article"
                    body="Build faster with dbt Cloud's IDE"
                    link="/docs/get-started-dbt"
                    icon="zap"
                  />
                </div>
                <div>
                  <Card
                    title="Learn the basics"
                    tag="Guide"
                    body="Step-by-step tutorial with sample data"
                    link="/docs/build/projects"
                    icon="tool"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="from-the-blog">
            <h2>The latest from the Developer Blog</h2>
            <PostCarousel blogPostData={recentBlogData} />
          </section>

          <section className="from-the-community">
            <h2>From the dbt Community</h2>
            <div className="grid--3-col">
              <div>
                <Card
                  title="Join the community"
                  body="Connect with data practitioners from around the world."
                  link="/community/join"
                  icon="smiley-face"
                />
              </div>
              <div>
                <Card
                  title="Become a contributor"
                  body="Help build the resources the community uses to solve hard problems."
                  link="/community/contribute"
                  icon="pencil-paper"
                />
              </div>
              <div>
                <Card
                  title="Open source dbt Packages"
                  body="Take your dbt project to the next level with community built packages."
                  link="https://hub.getdbt.com/"
                  icon="packages"
                />
              </div>
            </div>
          </section>

          <section className="like-a-pro">
            <h2>Use dbt like a pro</h2>
            <div className="grid--3-col">
              <div>
                <Card
                  title="Best practices"
                  body="Learn battle tested strategies for analytics engineering best practices."
                  link="/best-practices"
                  icon="guides"
                />
              </div>
              <div>
                <Card
                  title="Community forum"
                  body="Get help and swap knowledge in the async forum."
                  link="/community/forum"
                  icon="discussions"
                />
              </div>
              <div>
                <Card
                  title="Online courses"
                  body="Structured video courses to give you a deep dive into analytics engineering topics."
                  link="https://learn.getdbt.com/"
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
