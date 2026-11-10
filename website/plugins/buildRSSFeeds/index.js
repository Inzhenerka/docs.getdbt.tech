const fs = require('fs')
const Feed = require('feed').Feed
const matter = require('gray-matter')
const { createSlugger, parseMarkdownHeadingId } = require('@docusaurus/utils')

const siteUrl = 'https://docs.getdbt.tech'

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]

const RUSSIAN_MONTHS = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
]

const RUSSIAN_DATE_MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
]

function parseMonthYearHeading(heading) {
  const match = heading.match(/^(\p{L}+)\s+(\d{4})(?:\s+г\.)?$/iu)
  if (!match) return null
  const month = match[1].toLowerCase()
  const index = MONTH_NAMES.includes(month) ? MONTH_NAMES.indexOf(month) : RUSSIAN_MONTHS.indexOf(month)
  return index === -1 ? null : new Date(Number(match[2]), index, 1)
}

function parseFullDateHeading(heading) {
  const english = heading.match(/^([a-z]+)\s+(\d{1,2}),\s*(\d{4})$/i)
  const russian = heading.match(/^(\d{1,2})\s+([а-яё]+)\s+(\d{4})(?:\s+г\.)?$/i)
  if (!english && !russian) return null
  const month = english ? MONTH_NAMES.indexOf(english[1].toLowerCase()) :
    RUSSIAN_DATE_MONTHS.indexOf(russian[2].toLowerCase())
  const day = Number(english ? english[2] : russian[1])
  const year = Number(english ? english[3] : russian[3])
  if (month === -1 || day === 0) return null
  const date = new Date(year, month, day)
  return date.getMonth() === month ? date : null
}

function releaseHeadings(content) {
  const slugger = createSlugger()
  return content.split('\n').flatMap((line, order) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (!match) return []
    const { text, id } = parseMarkdownHeadingId(match[2].trim())
    return [{ level: match[1].length, heading: text, anchor: id ?? slugger.slug(text), order }]
  })
}

// Parses content into RSS items — one item per H2 or H3 heading. A reader
// "fires" (surfaces a new item) when it sees a new anchor-based id, so adding
// a heading produces a new feed entry regardless of the heading text.
//
// Dates drive feed ordering: an H2 (month section) takes the date parsed from
// its "Month Year" text, and each H3 inherits the date of the month section it
// sits under. H2s that aren't month headings, and any H3 that appears before
// the first month section, are skipped so the page intro can't leak in.
function parseItems(content, pageUrl) {
  const items = []
  let currentMonthDate = null

  releaseHeadings(content).forEach(({ level, heading, anchor, order }) => {
    if (level === 2) {
      const date = parseMonthYearHeading(heading)
      if (!date) return
      currentMonthDate = date
      const link = `${pageUrl}#${anchor}`
      items.push({
        title: `dbt platform release notes — ${heading}`,
        id: link,
        link,
        description: `New dbt platform release notes for ${heading}. Visit the page to see what's new, updated, and fixed.`,
        date,
        order,
      })
      return
    }

    if (level === 3) {
      if (!currentMonthDate) return
      const link = `${pageUrl}#${anchor}`
      items.push({
        title: `dbt platform release notes — ${heading}`,
        id: link,
        link,
        description: `New dbt platform release notes: ${heading}. Visit the page to see what's new, updated, and fixed.`,
        date: currentMonthDate,
        order,
      })
    }
  })

  return items
}

// Parses the single-tenant release notes into RSS items — one item per weekly
// release date. Dates are H2 headings in "Month Day, Year" form; the category
// headings nested under each date ("New", "Enhancements", "Fixes", and so on)
// are skipped so each weekly release surfaces as a single feed entry.
function parseDatedItems(content, pageUrl) {
  const items = []

  releaseHeadings(content).forEach(({ level, heading, anchor, order }) => {
    if (level !== 2) return
    const date = parseFullDateHeading(heading)
    if (!date) return

    const link = `${pageUrl}#${anchor}`
    items.push({
      title: `dbt single-tenant release notes — ${heading}`,
      id: link,
      link,
      description: `New dbt single-tenant release notes for ${heading}. Visit the page to see what's new, updated, and fixed.`,
      date,
      order,
    })
  })

  return items
}

function buildFeed({ title, description, pageUrl, feedPathPrefix, items }) {
  const today = new Date()
  const feed = new Feed({
    title,
    description,
    id: siteUrl,
    link: pageUrl,
    language: 'ru',
    image: 'https://www.getdbt.com/ui/img/blog/dbt-card.jpg',
    favicon: `${siteUrl}/img/favicon.svg`,
    copyright: `Copyright © ${today.getFullYear()} dbt Labs™, Inc. All Rights Reserved.`,
    updated: items[0].date,
    feedLinks: {
      rss2: `${siteUrl}/feeds/${feedPathPrefix}-rss.xml`,
      atom: `${siteUrl}/feeds/${feedPathPrefix}-atom.xml`,
      json: `${siteUrl}/feeds/${feedPathPrefix}-rss.json`,
    },
  })
  items.forEach(item => feed.addItem(item))
  fs.writeFileSync(`./static/feeds/${feedPathPrefix}-rss.xml`, feed.rss2())
  fs.writeFileSync(`./static/feeds/${feedPathPrefix}-atom.xml`, feed.atom1())
  fs.writeFileSync(`./static/feeds/${feedPathPrefix}-rss.json`, feed.json1())
  console.log(`"${title}" feed created with ${items.length} entries. Latest: ${items[0].title}`)
}

// Each entry describes one feed: the source page to read, the parser to run
// over it, the public page URL its items link to, and the feed metadata.
const FEEDS = [
  {
    sourcePath: 'docs/docs/dbt-versions/release-notes.md',
    parse: parseItems,
    pageUrl: `${siteUrl}/docs/dbt-versions/release-notes`,
    feedPathPrefix: 'release-notes',
    title: 'dbt platform release notes',
    description: 'dbt provides release notes for the dbt platform so you can see recent and historical changes.',
  },
  {
    sourcePath: 'docs/docs/dbt-versions/dbt-platform-release-notes-gen.md',
    parse: parseDatedItems,
    pageUrl: `${siteUrl}/docs/dbt-versions/dbt-platform-release-notes-gen`,
    feedPathPrefix: 'release-notes-st',
    title: 'dbt single-tenant release notes',
    description: 'dbt provides release notes for single-tenant so you can see recent and historical changes.',
  },
]

module.exports = function buildRSSFeedsPlugin() {
  return {
    name: 'docusaurus-build-rss-feeds-plugin',
    async loadContent() {

      // Skip generating RSS feeds in non-production environments
      if (process.env.NODE_ENV !== "production") {
        console.log('RSS Feeds are only generated in production. Skipping creation of RSS Feed.')
        return null
      }

      console.log('Generating RSS Feeds for dbt release notes')

      FEEDS.forEach(({ sourcePath, parse, pageUrl, feedPathPrefix, title, description }) => {
        try {
          const raw = fs.readFileSync(sourcePath, 'utf8')
          const { content } = matter(raw)
          const items = parse(content, pageUrl)

          if (!items.length) {
            console.warn(`No items found in ${sourcePath}. Skipping feed generation.`)
            return
          }

          items.sort((a, b) =>
            a.date.getTime() !== b.date.getTime()
              ? b.date - a.date
              : a.order - b.order
          )

          buildFeed({ title, description, pageUrl, feedPathPrefix, items })
        } catch (e) {
          console.warn(`Could not generate ${title} feed: ${e.message}`)
        }
      })
    },
  }
}
