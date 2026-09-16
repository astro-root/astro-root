import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRepositories, octokit } from "../lib/github.js";
import { languagesSvg } from "../lib/svg.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const repositories = await getRepositories();

    const totals = new Map<string, number>();

    for (const repository of repositories) {
      const { data } =
        await octokit.rest.repos.listLanguages({
          owner: "astro-root",
          repo: repository.name
        });

      for (const [language, bytes] of Object.entries(data)) {
        totals.set(
          language,
          (totals.get(language) ?? 0) + bytes
        );
      }
    }

    const totalBytes = Array.from(totals.values()).reduce(
      (sum, value) => sum + value,
      0
    );

    const languages = Array.from(totals.entries())
      .map(([name, bytes]) => ({
        name,
        percentage: totalBytes
          ? (bytes / totalBytes) * 100
          : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const svg = languagesSvg(languages);

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=172800"
    );

    res.setHeader(
      "Content-Type",
      "image/svg+xml; charset=utf-8"
    );

    return res.status(200).send(svg);
  } catch {
    return res.status(500).send("Failed to generate language statistics.");
  }
}
