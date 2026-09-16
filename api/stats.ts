import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRepositories, getUser } from "../lib/github.js";
import { statsSvg } from "../lib/svg.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const user = await getUser();
    const repositories = await getRepositories();

    const stars = repositories.reduce(
      (total, repo) => total + repo.stargazers_count,
      0
    );

    const forks = repositories.reduce(
      (total, repo) => total + repo.forks_count,
      0
    );

    const svg = statsSvg({
      repositories: repositories.length,
      stars,
      forks,
      followers: user.followers,
      following: user.following
    });

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    res.setHeader(
      "Content-Type",
      "image/svg+xml; charset=utf-8"
    );

    return res.status(200).send(svg);
  } catch {
    return res.status(500).send("Failed to generate GitHub stats.");
  }
}
