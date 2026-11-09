import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import { useDocsSidebar } from "@docusaurus/plugin-content-docs/client";
import { useLocalPathname } from "@docusaurus/theme-common/internal";
import styles from "./styles.module.css";

/* dbt Customizations:
 * Import Admonition for version banners, and version-related plugin, context, method
 * Get page path with useLocalPathname hook
 * Check if page available for current version
 * Check whether this version is a isPrerelease
 * Check End of Life date and show unsupported banner if deprecated version
 * useEffect to show banner content
 * Show Admonition banners if needed
 */
import Admonition from "@theme/Admonition";
import { usePluginData } from "@docusaurus/useGlobalData";
import VersionContext from "../../../../stores/VersionContext";
import pageVersionCheck from "../../../../utils/page-version-check";
import sanitizeHtml from "sanitize-html";

export default function DocRootLayoutMain({
  hiddenSidebarContainer,
  children,
}) {
  const sidebar = useDocsSidebar();

  // Get current page path
  const currentDocRoute = useLocalPathname();

  // Check if page available for current version

  const { versionedPages } = usePluginData(
    "docusaurus-build-global-data-plugin"
  );

  const {
    version: dbtVersion,
    EOLDate,
    isPrerelease,
    latestStableRelease,
  } = useContext(VersionContext);

  const { 
    pageAvailable, 
    firstAvailableVersion, 
    lastAvailableVersion 
  } = pageVersionCheck(dbtVersion, versionedPages, currentDocRoute);

  const hasFirstAvailableVersion =
    firstAvailableVersion && firstAvailableVersion !== "0";

  // Check whether this version is a isPrerelease, and show banner if so
  const [PreData, setPreData] = useState({
    showisPrereleaseBanner: false,
    isPrereleaseBannerText: "",
  });

  // Check End of Life date and show unsupported banner if deprecated version
  const [EOLData, setEOLData] = useState({
    showEOLBanner: false,
    EOLBannerText: "",
  });

  useEffect(() => {
    // If version is not isPrerelease, do not show banner
    if (!isPrerelease) {
      setPreData({
        showisPrereleaseBanner: false,
        isPrereleaseBannerText: "",
      });
    } else {
      // Check if this is v2 (version 2.x) or a v1 prerelease
      if (parseFloat(dbtVersion) >= 2) {
        setPreData({
          showisPrereleaseBanner: true,
          isPrereleaseBannerText: `Вы просматриваете предварительную версию документации для <a href="/docs/introduction">dbt v2</a>.`,
        });
      } else {
        // For other prerelease versions (like 1.11 beta)
        setPreData({
          showisPrereleaseBanner: true,
          isPrereleaseBannerText: `Вы просматриваете документацию для бета-версии dbt Core. Некоторые функции могут измениться до окончательного релиза. Подробнее в <a href="/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.13">руководстве по обновлению</a>.`,
        });
      }
    }
    // If EOLDate not set for version, do not show banner
    if (!EOLDate) {
      setEOLData({
        showEOLBanner: false,
        EOLBannerText: "",
      });
    } else {
      let threeMonths = new Date(EOLDate);
      threeMonths.setMonth(threeMonths.getMonth() - 3);
      if (new Date() > new Date(EOLDate)) {
        setEOLData({
          showEOLBanner: true,
          EOLBannerText: `Эта версия dbt Core <a href="/docs/dbt-versions">больше не поддерживается</a>. Исправления и обновления безопасности больше не выпускаются. Для повышения производительности, безопасности и доступа к новым возможностям рекомендуется обновиться до <a href="https://github.com/dbt-labs/dbt-core/releases/latest">последней стабильной версии</a>. У некоторых клиентов dbt может действовать расширенный <a href="/docs/dbt-versions">период критической поддержки</a>. `,
        });
      } else if (new Date() > threeMonths) {
        setEOLData({
          showEOLBanner: true,
          EOLBannerText: `Эта версия dbt Core приближается к концу своего <a href="/docs/dbt-versions">критического периода поддержки</a>. Для улучшения производительности, безопасности и функциональности обновитесь до <a href="https://github.com/dbt-labs/dbt-core/releases/latest">последней стабильной версии</a>.`,
        });
      } else {
        setEOLData({
          showEOLBanner: false,
          EOLBannerText: "",
        });
      }
    }
  }, [dbtVersion]);

  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced
      )}
    >
      <div
        className={clsx(
          "container padding-top--md padding-bottom--lg",
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced
        )}
      >
        {PreData.showisPrereleaseBanner && (
          <div className={styles.versionBanner}>
            <Admonition type="info" title="Важно">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(PreData.isPrereleaseBannerText),
                }}
              />
            </Admonition>
          </div>
        )}
        {EOLData.showEOLBanner && (
          <div className={styles.versionBanner}>
            <Admonition type="caution" title="Внимание">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(EOLData.EOLBannerText),
                }}
              />
            </Admonition>
          </div>
        )}
        {children}
      </div>
    </main>
  );
}
