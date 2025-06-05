
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Card from '@site/src/components/card';
import Hero from '@site/src/components/hero';
import PostCarousel from '@site/src/components/postCarousel';
import allBlogData from './../../.docusaurus/docusaurus-plugin-content-blog/default/p/blog-archive-f05.json'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDateTimeFormat } from '@docusaurus/theme-common/internal';
import { getSpotlightMember } from '../utils/get-spotlight-member';
import Link from '@docusaurus/Link';

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
          <section>
            <div className='container'>
              <div>
                <span className="eyebrow">Quickstart</span>
                <h2 className="heading-2">New to dbt? Start here.</h2>
              </div>
                <div className="home-card-grid">
                  <Card
                    title="Set up dbt Core"
                    tag="Guide"
                    body="Install and run your first model locally"
                    link="/guides/manual-install?step=1"
                    icon="settings"
                  />
                  <Card
                    title="Use dbt in the Cloud"
                    tag="Article"
                    body="Build faster with dbt Cloud's IDE"
                    link="/docs/get-started-dbt"
                    icon="zap"
                  />
                  <Card
                    title="Learn the basics"
                    tag="Guide"
                    body="Step-by-step tutorial with sample data"
                    link="/docs/build/projects"
                    icon="tool"
                  />
                </div>
              </div>
          </section>

          <section className='baton-1'>
            <div className='container'>
              <div>
                <span className="eyebrow">Documentation by product</span>
                <h2 className="heading-2">Explore the docs by product</h2>
              </div>
              <div className="home-card-grid">
                <Card
                  title="Copilot"
                  body="AI-powered assistant that automates code, tests, and documentation in your workflow."
                  link="/guides/manual-install?step=1"
                  icon="circle"
                />
                <Card
                  title="Mesh"
                  body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
                  link="/docs/get-started-dbt"
                  icon="circle"
                />
                <Card
                  title="Orchestrator"
                  body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
                  link="/docs/build/projects"
                  icon="circle"
                />
                <Card
                  title="Copilot"
                  body="AI-powered assistant that automates code, tests, and documentation in your workflow."
                  link="/guides/manual-install?step=1"
                  icon="circle"
                />
                <Card
                  title="Mesh"
                  body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
                  link="/docs/get-started-dbt"
                  icon="circle"
                />
                <Card
                  title="Orchestrator"
                  body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
                  link="/docs/build/projects"
                  icon="circle"
                />
              </div>
            </div>
          </section>

          <section>
            <div className='container'>
              <div>
                <span className="eyebrow">Docs highlights</span>
                <h2 className="heading-2">Dive deeper into dbt</h2>
                <p>Learn best practices, explore detailed configuration references, or review our APIs.</p>
              </div>
              <div className="home-link-grid">
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Documentation</h4>
                  <Link to="/">Documentation</Link>
                  <Link to="/">Product Docs</Link>
                  <Link to="/">Best Practices</Link>
                  <Link to="/">Copilot</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Guides</h4>
                  <Link to="/">Quickstart for dbt and Snowflake</Link>
                  <Link to="/">Quickstart for dbt and Databricks</Link>
                  <Link to="/">Airflow and dbt</Link>
                  <Link to="/">Debugging errors</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Reference Guides</h4>
                  <Link to="/">Command Reference</Link>
                  <Link to="/">Project Configurations</Link>
                  <Link to="/">dbt Artifacts</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Other Resources</h4>
                  <Link to="/">Release Notes</Link>
                  <Link to="/">Best Practices</Link>
                  <Link to="/">Developer Blog</Link>
                  <Link to="/">Join the Community</Link>
                </div>
              </div>
              </div>
          </section>

          <section className='baton-2'>
            <div className='container'>
              <div>
                <span className="eyebrow">Get help from others</span>
                <h2 className="heading-2">Join the dbt Community</h2>
                <p>Connect with thousands of developers solving real data problems every day.</p>
              </div>
              <div className="home-card-grid">
                <Card
                  title="Join Slack"
                  body="Ask questions, get answers, and meet people who speak your data language."
                  link="/guides/manual-install?step=1"
                  icon="annotation"
                />
                <Card
                  title="GitHub Discussions"
                  body="Join technical threads or open issues."
                  link="/docs/get-started-dbt"
                  icon="github-new"
                />
                <Card
                  title="Subscribe to the newsletter"
                  body="Get fresh community ideas, job posts, and tools delivered weekly."
                  link="/docs/build/projects"
                  icon="inbox"
                />
                <Card
                  title="Answer a question on Discourse"
                  body="Help someone solve a real problem—and build your reputation doing it."
                  link="/guides/manual-install?step=1"
                  icon="message"
                />
                <Card
                  title="Events and Meetups"
                  body="Join local and global dbt meetups."
                  link="/docs/get-started-dbt"
                  icon="globe"
                />
                <Card
                  title="Courses & Tutorials"
                  body="Learn dbt with hands-on guidance."
                  link="/docs/build/projects"
                  icon="forward"
                />
              </div>
            </div>
          </section>

          <section className="from-the-blog">
            <h2>The latest from the Developer Blog</h2>
            <PostCarousel blogPostData={recentBlogData} />
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
