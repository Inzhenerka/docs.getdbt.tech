import React, { useState, useMemo } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import styles from "./styles.module.css";

const CHANGELOG_BASE =
  "https://github.com/dbt-labs/dbt/blob/main/CHANGELOG-dbt.md";

/**
 * Fragment for a dbt release version, matching GitHub’s autolink for the
 * corresponding `## {version}` heading in CHANGELOG-dbt.md (e.g. `2.0.0-preview.172` → `200-preview172`).
 */
function versionToChangelogFragment(version) {
  return version
    .replace(/^v/i, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function changelogUrlForVersion(version) {
  return `${CHANGELOG_BASE}#${versionToChangelogFragment(version)}`;
}

/** dbt versions that should show a “release candidate” label in the UI. */
const FUSION_RELEASE_CANDIDATE_VERSIONS = new Set(["2.0.0-preview.173"]);

function isFusionReleaseCandidateVersion(version) {
  if (!version || typeof version !== "string") return false;
  const normalized = version.replace(/^v/i, "").toLowerCase();
  return FUSION_RELEASE_CANDIDATE_VERSIONS.has(normalized);
}

function ReleaseCandidateLabel({ version }) {
  if (!isFusionReleaseCandidateVersion(version)) return null;
  return (
    <span className={styles.releaseCandidateBadge}>Кандидат в релиз</span>
  );
}

const CHANNEL_LABELS = {
  dev: "Dev",
  canary: "Canary",
  latest: "Latest",
  "st-monday": "ST Monday",
  "st-wednesday": "ST Wednesday",
  "st-thursday": "ST Thursday",
};

function formatTimestamp(ts) {
  if (!ts) return "";
  const date = new Date(ts * 1000);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function compareVersions(a, b) {
  const parseVersion = (v) => {
    const match = v.match(
      /v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z]+)\.?(\d+)?)?/
    );
    if (!match) return [0, 0, 0, "", 0];
    return [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
      match[4] || "",
      parseInt(match[5] || "0", 10),
    ];
  };

  const pa = parseVersion(a);
  const pb = parseVersion(b);

  for (let i = 0; i < pa.length; i++) {
    if (pa[i] < pb[i]) return 1;
    if (pa[i] > pb[i]) return -1;
  }
  return 0;
}

// Public channels to display in "Current versions" section
const PUBLIC_CHANNELS = ["dev", "canary", "latest"];

function VersionCards({ versions }) {
  if (!versions) return null;

  // Filter to only show public channels (exclude ST releases)
  const channels = Object.entries(versions).filter(([channel]) =>
    PUBLIC_CHANNELS.includes(channel)
  );
  if (channels.length === 0) return null;

  return (
    <div>
      <h3 id="current-versions">Текущие версии</h3>
      <div className={styles.versionsGrid}>
        {channels.map(([channel, info]) => (
          <div key={channel} className={styles.versionCard}>
            <h4>{CHANNEL_LABELS[channel] || channel}</h4>
            <div className={styles.versionCardVersionRow}>
              <a
                href={changelogUrlForVersion(info.tag)}
                target="_blank"
                rel="noopener noreferrer"
                title="Открыть версию в журнале изменений dbt v2"
              >
                <code>{info.tag}</code>
              </a>
              <ReleaseCandidateLabel version={info.tag} />
            </div>
            <span className={styles.versionDate}>{info.date}</span> 
          </div>
        ))}
      </div>
    </div>
  );
}

function ReleaseItem({ version, data }) {
  const channels = data.released ? Object.keys(data.released) : [];

  const latestRelease = channels.reduce((latest, ch) => {
    const entry = data.released[ch];
    if (!latest || entry.timestamp > latest.timestamp) {
      return { ...entry, channel: ch };
    }
    return latest;
  }, null);

  const reason =
    latestRelease?.reason &&
    (typeof latestRelease.reason === "string"
      ? latestRelease.reason
      : JSON.stringify(latestRelease.reason));

  return (
    <div className={styles.releaseItem}>
      <div className={styles.releaseHeader}>
        <a
          href={changelogUrlForVersion(version)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.versionTag}
          title="Открыть релиз в журнале изменений dbt v2"
        >
          {version}
        </a>
        <ReleaseCandidateLabel version={version} />
        {data.known_bad ? (
          <span className={styles.badgeBad}>С известными проблемами</span>
        ) : (
          <span className={styles.badgeGood}>Без известных проблем</span>
        )}
        {channels.map((ch) => (
          <span key={ch} className={styles.channelBadge}>
            {CHANNEL_LABELS[ch] || ch}
          </span>
        ))}
      </div>
      <div className={styles.releaseDetails}>
        {latestRelease?.released_by && (
          <span className={styles.releaseDetail}>
            Автор релиза: <strong>{latestRelease.released_by}</strong>
          </span>
        )}
        {latestRelease?.timestamp && (
          <span className={styles.releaseDetail}>
            {formatTimestamp(latestRelease.timestamp)}
          </span>
        )}
      </div>
      {reason && <div className={styles.releaseReason}>{reason}</div>}
    </div>
  );
}

export default function FusionReleases() {
  const { releases, versions } = usePluginData(
    "docusaurus-build-fusion-releases-plugin"
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");

  const sortedReleases = useMemo(() => {
    if (!releases) return [];
    return Object.entries(releases).sort(([a], [b]) => compareVersions(a, b));
  }, [releases]);

  const allChannels = useMemo(() => {
    if (!releases) return [];
    const channels = new Set();
    Object.values(releases).forEach((data) => {
      if (data.released) {
        Object.keys(data.released).forEach((ch) => channels.add(ch));
      }
    });
    return Array.from(channels).sort();
  }, [releases]);

  const filteredReleases = useMemo(() => {
    return sortedReleases.filter(([version, data]) => {
      if (search && !version.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter === "good" && data.known_bad) return false;
      if (statusFilter === "bad" && !data.known_bad) return false;
      if (
        channelFilter !== "all" &&
        (!data.released || !data.released[channelFilter])
      ) {
        return false;
      }
      return true;
    });
  }, [sortedReleases, search, statusFilter, channelFilter]);

  if (!releases || !versions || Object.keys(releases).length === 0) {
    return (
      <div className={styles.error}>
        Данные о релизах недоступны. Попробуйте пересобрать сайт.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <VersionCards versions={versions} />

      <h3 id="all-releases">Все релизы</h3>

      {/* Client-side search/filter controls -- interactive chrome with no place
          in a static Markdown export; data-md-hide drops it from the generated
          Markdown while the rendered page keeps it. */}
      <div className={styles.controls} data-md-hide="true">
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск по версиям…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.filterGroup}>
          <label htmlFor="status-filter">Статус</label>
          <select
            id="status-filter"
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="good">Без известных проблем</option>
            <option value="bad">С известными проблемами</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="channel-filter">Канал</label>
          <select
            id="channel-filter"
            className={styles.filterSelect}
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
          >
            <option value="all">Все</option>
            {allChannels.map((ch) => (
              <option key={ch} value={ch}>
                {CHANNEL_LABELS[ch] || ch}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.resultCount} data-md-hide="true">
        Показано релизов: {filteredReleases.length} из {sortedReleases.length}
      </div>

      <div className={styles.releaseList}>
        {filteredReleases.length === 0 ? (
          <div className={styles.noResults}>
            По выбранным фильтрам релизы не найдены.
          </div>
        ) : (
          filteredReleases.map(([version, data]) => (
            <ReleaseItem key={version} version={version} data={data} />
          ))
        )}
      </div>
    </div>
  );
}
