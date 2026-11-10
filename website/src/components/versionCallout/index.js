import React from 'react';
import Admonition from '@theme/Admonition'; 

const VersionCallout = ({ version }) => {
  if (!version) {
    return null;
  }

  return (
  <div>
    <Admonition
      type="tip"
      // data-md-hide keeps the emoji on the rendered callout but strips it from
      // the generated Markdown, where a bare string icon (unlike the default
      // aria-hidden SVG admonition icons) leaked as "💡Полезно знать".
      icon={<span data-md-hide="true">💡</span>}
      title="Полезно знать"
    >
      <span>
        Доступно начиная с dbt v{version} или в{' '}
        <a href="/docs/dbt-versions/dbt-release-tracks">канале релизов v1 Latest</a>.
      </span>
    </Admonition>
  </div>
);
};

export default VersionCallout;
