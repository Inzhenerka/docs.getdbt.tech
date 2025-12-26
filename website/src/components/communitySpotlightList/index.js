import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';
import CommunitySpotlightCard from '../communitySpotlightCard'

const communityTitle = 'В центре внимания сообщества';
const communityDescription = "Сообщество dbt — это место, где живет и развивается аналитическая инженерия, и вы являетесь его частью! Каждый квартал мы будем выделять участников сообщества в рубрике «Сообщество в центре внимания». Это люди, которые внесли выдающийся вклад в развитие сообщества самыми разными способами. Мы все вас видим. Мы вас ценим. Вы потрясающие.";

// This date determines where the 'Previously on the Spotlight" text will show.
// Any spotlight members with a 'dateCreated' field before this date
// will be under the 'Previously..' header.
const currentSpotlightDate = new Date('2024-10-30')

function CommunitySpotlightList({ spotlightData }) {
  const { siteConfig } = useDocusaurusContext()

  // Build meta title from communityTitle and docusaurus config site title
  const metaTitle = `${communityTitle}${siteConfig?.title ? ` | ${siteConfig.title}` : ''}`

  // Split spotlight members into current and previous
  let currentSpotlightMembers = []
  let previousSpotlightMembers = []

  spotlightData?.map(member => {
    if(currentSpotlightDate > new Date(member?.data?.dateCreated)) {
      previousSpotlightMembers.push(member)
    } else {
      currentSpotlightMembers.push(member)
    }
  })
  
  return (
    <Layout>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        <meta property="description" content={communityDescription} />
        <meta property="og:description" content={communityDescription} />
      </Head>
      <Hero 
        heading={communityTitle} 
        subheading={communityDescription} 
        showGraphic={false} 
        customStyles={{marginBottom: 0}} 
        classNames='community-spotlight-hero'
        colClassNames='col--8'
        lightBackground={true}
      />
      <section id='spotlight-members-section'>
        <div className='container'>   
          {currentSpotlightMembers?.length || previousSpotlightMembers?.length ? (
            <>
              {currentSpotlightMembers?.map((member, i) => (
                <CommunitySpotlightCard frontMatter={member.data} key={i} />
              ))}
              {previousSpotlightMembers?.length ? (
                <>
                  <h2>Previously on the Spotlight</h2>
                  {previousSpotlightMembers.map((member, i) => (
                    <CommunitySpotlightCard frontMatter={member.data} key={i} />
                  ))}
                </>
              ) : ''}
            </>
          ) : 
            <p>No community spotlight members are available at this time. 😕</p>
          }
        </div>
      </section>
    </Layout>
  )
}

export default CommunitySpotlightList
