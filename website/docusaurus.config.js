import path from "path";
import math from "remark-math";
import katex from "rehype-katex";
const { themes } = require('prism-react-renderer')

const { versions, versionedPages, versionedCategories } = require("./dbt-versions");
require("dotenv").config();

/* Debugging */
var SITE_URL;
if (!process.env.CONTEXT || process.env.CONTEXT == "production") {
  SITE_URL = "https://docs.getdbt.tech";
} else {
  SITE_URL = process.env.DEPLOY_URL;
}

var GIT_BRANCH;
if (!process.env.CONTEXT || process.env.CONTEXT == "production") {
  GIT_BRANCH = "main";
} else {
  GIT_BRANCH = process.env.HEAD;
}

let { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME } = process.env;

let metatags = [{
  tagName: "meta",
  attributes: {
    name: "yandex-verification",
    content: "cab1b133f804e289",
  },
}];

console.log("DEBUG: CONTEXT =", process.env.CONTEXT);
console.log("DEBUG: DEPLOY_URL =", process.env.DEPLOY_URL);
console.log("DEBUG: SITE_URL = ", SITE_URL);
console.log("DEBUG: ALGOLIA_INDEX_NAME = ", ALGOLIA_INDEX_NAME);
console.log("DEBUG: metatags = ", metatags);

var siteSettings = {
  baseUrl: "/",
  tagline: "Документация, гайды и руководства по dbt на русском языке",
  title: "Документация dbt - перевод официального сайта на русский",
  url: SITE_URL,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  // trailingSlash: false,
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
    localeConfigs: {
      ru: {
        htmlLang: 'ru-RU',
      },
    },
  },
  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    image: "/img/avatar.png",
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    // Adding non-empty strings for Algolia config
    // allows Docusaurus to run locally without .env file
//    algolia: {
//      apiKey: ALGOLIA_API_KEY ? ALGOLIA_API_KEY : "dbt",
//      indexName: ALGOLIA_INDEX_NAME ? ALGOLIA_INDEX_NAME : "dbt",
//      appId: ALGOLIA_APP_ID ? ALGOLIA_APP_ID : "dbt",
//      //debug: true,
//    },
    announcementBar: {
      id: "biweekly-demos",
      content: "Получи бесплатный доступ к симулятору Data Warehouse Analytics Engineer на базе dbt",
      backgroundColor: "#047377",
      textColor: "#fff",
      isCloseable: true,
    },
    announcementBarActive: true,
    announcementBarLink:
      "https://inzhenerka.tech/dbt",
    // Set community spotlight member on homepage
    // This is the ID for a specific file under docs/community/spotlight
    communitySpotlightMember: "original-dbt-athena-maintainers",
    prism: {
      theme: (() => {
        var theme = themes.nightOwl;
        // Add additional rule to nightowl theme in order to change
        // the color of YAML keys (to be different than values).
        // There weren't many Prism themes that differentiated
        // YAML keys and values. See link:
        // https://github.com/FormidableLabs/prism-react-renderer/tree/master/src/themes
        theme.styles.push({
          types: ["atrule"],
          style: {
            // color chosen from the nightowl theme palette
            // https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/themes/nightOwl.js#L83
            color: "rgb(255, 203, 139)",
          },
        });
        return theme;
      })(),
      additionalLanguages: ["bash"],
    },
    navbar: {
      hideOnScroll: true,
      logo: {
        src: "/img/dbt-logo.png",
        srcDark: "img/dbt-logo-light.png",
        alt: "site Logo",
      },
      items: [
        {
          label: "Документация",
          position: "left",
          items: [
            {
              label: "Документация dbt",
              to: "/docs/introduction",
              activeBaseRegex: "docs/(?!(dbt-cloud))",
            },
            {
              label: "dbt Cloud API",
              to: "/docs/dbt-cloud-apis/overview",
            },
            {
              label: "Лучшие практики",
              to: "/best-practices",
            },
            {
              label: "Что нового",
              to: "/docs/dbt-versions/dbt-cloud-release-notes",
            },
          ],
        },
        {
          to: "/guides",
          label: "Гайды",
          position: "left",
        },
        {
          to: "reference/references-overview",
          label: "Справочник",
          position: "left",
          activeBasePath: "reference",
        },
        {
          label: "Ресурсы",
          position: "right",
          items: [
            {
              label: "Обучение",
              href: "https://inzhenerka.tech/working-with-data",
            },
            {
              label: "Лучшие практики",
              to: "/best-practices",
            },
            {
              label: "Блог разработчиков",
              to: "/blog",
            },
          ],
        },
        {
          label: "Сообщество",
          position: "right",
          items: [
            {
              label: "⭐ dbt & modern data stack",
              to: "https://t.me/dbt_users",
            },
            {
              label: "⭐ INZHENERKA.TECH – Чат",
              to: "https://t.me/+xgMQWT0kBlUxNDNi",
            },
            {
              label: "Внести вклад",
              to: "/community/contribute",
            },
            {
              label: "Официальный форум",
              to: "/community/forum",
            },
            {
              label: "Мероприятия",
              to: "/community/events",
            },
            {
              label: "В центре внимания",
              to: "/community/spotlight",
            },
          ],
        },
        {
          label: "Записаться на курс",
          to: "https://inzhenerka.tech/dbt",
          position: "right",
          className: "nav-create-account button button--primary",
        },
      ],
    },
    footer: {
      links: [
        {
          html: `

          <div class='footer__items'>

          </div>

          <div class='footer__items--right'>
            <!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <a href='https://github.com/Inzhenerka/docs.getdbt.tech' title="GitHub" target="_blank" rel="noreferrer noopener"><svg class="fa-brands" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg></a>
          </div>
          `,
        },
      ],

      copyright: `&copy; ${new Date().getFullYear()} ООО "ИНЖЕНЕРКАТЕХ"<br>Основано на материалах компании dbt Labs, Inc. All Rights Reserved`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          remarkPlugins: [math],
          rehypePlugins: [katex],

          editUrl:
            "https://github.com/Inzhenerka/docs.getdbt.tech/edit/" +
            GIT_BRANCH +
            "/website/",
          showLastUpdateTime: true,
          //showLastUpdateAuthor: false,

          sidebarCollapsible: true,
          exclude: [
            'hover-terms.md'
          ]
        },
        blog: {
          blogTitle: "Блоги разработчиков | dbt",
          blogDescription:
            "Учебные материалы, обновления продукта и инсайты для разработчиков в блоге dbt Developer.",
          postsPerPage: 20,
          blogSidebarTitle: "Recent posts",
          blogSidebarCount: 5,
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
      },
    ],
  ],
  plugins: [
    [path.resolve("plugins/insertMetaTags"), { metatags }],
    path.resolve("plugins/svg"),
    path.resolve("plugins/customWebpackConfig"),
    [
      path.resolve("plugins/buildGlobalData"),
      { versionedPages, versionedCategories },
    ],
    path.resolve("plugins/buildAuthorPages"),
    path.resolve("plugins/buildSpotlightIndexPage"),
    path.resolve("plugins/buildQuickstartIndexPage"),
    path.resolve("plugins/buildRSSFeeds"),
  ],
  scripts: [
    {
      src: "https://code.jquery.com/jquery-3.4.1.min.js",
      defer: true,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/featherlight@1.7.14/release/featherlight.min.js",
      defer: true,
    },
    "https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js",
    "/js/headerLinkCopy.js",
    "/js/gtm.js",
    "/js/yam.js",
  ],
  stylesheets: [
    "/css/fonts.css",
    "/css/entypo.css",
    "/css/search.css",
    "/css/api.css",
    "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;500;600;700&display=swap",
    "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap",
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
    { rel: "icon", href: "/img/favicon.png", type: "image/png" },
    { rel: "icon", href: "/img/favicon.svg", type: "image/svg+xml" },
  ],
};

// If versions json file found, add versions dropdown to nav
if (versions) {
  siteSettings.themeConfig.navbar.items.push({
    label: "Versions",
    position: "left",
    className: "nav-versioning",
    items: [
      ...versions.reduce((acc, version) => {
        if (version?.version) {
          acc.push({
            label: `${version.version}`,
            href: "#",
          });
        }
        return acc;
      }, []),
    ],
  });
}

module.exports = siteSettings;
