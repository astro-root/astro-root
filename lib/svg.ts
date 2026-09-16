export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function svgResponse(svg: string) {
  return {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    },
    body: svg
  };
}

export function statsSvg(data: {
  repositories: number;
  stars: number;
  forks: number;
  followers: number;
  following: number;
}) {
  const width = 495;
  const height = 195;

  const items = [
    ["Repositories", data.repositories],
    ["Stars", data.stars],
    ["Forks", data.forks],
    ["Followers", data.followers],
    ["Following", data.following]
  ];

  const cards = items
    .map((item, index) => {
      const x = 30 + (index % 2) * 235;
      const y = 45 + Math.floor(index / 2) * 48;

      return `
        <text x="${x}" y="${y}" fill="#94a3b8" font-size="12">
          ${escapeXml(item[0])}
        </text>
        <text x="${x}" y="${y + 20}" fill="#f8fafc" font-size="20" font-weight="700">
          ${item[1]}
        </text>
      `;
    })
    .join("");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" rx="12" fill="#0f172a"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="11" fill="none" stroke="#334155"/>

  <text x="30" y="28" fill="#f8fafc" font-size="16" font-weight="700">
    GitHub Stats
  </text>

  ${cards}
</svg>
`.trim();
}

export function languagesSvg(
  languages: Array<{
    name: string;
    percentage: number;
  }>
) {
  const width = 495;
  const height = 230;

  const rows = languages.slice(0, 6);

  const content = rows
    .map((language, index) => {
      const y = 55 + index * 27;
      const barWidth = Math.max(5, Math.round(language.percentage * 3.4));

      return `
        <text x="30" y="${y}" fill="#e2e8f0" font-size="12">
          ${escapeXml(language.name)}
        </text>

        <rect
          x="145"
          y="${y - 10}"
          width="250"
          height="8"
          rx="4"
          fill="#1e293b"
        />

        <rect
          x="145"
          y="${y - 10}"
          width="${barWidth}"
          height="8"
          rx="4"
          fill="#38bdf8"
        />

        <text x="410" y="${y}" fill="#94a3b8" font-size="12">
          ${language.percentage.toFixed(1)}%
        </text>
      `;
    })
    .join("");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" rx="12" fill="#0f172a"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="11" fill="none" stroke="#334155"/>

  <text x="30" y="30" fill="#f8fafc" font-size="16" font-weight="700">
    Top Languages
  </text>

  ${content}
</svg>
`.trim();
}
