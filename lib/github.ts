import { Octokit } from "@octokit/rest";

const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error("GITHUB_TOKEN is not configured");
}

export const octokit = new Octokit({
  auth: token
});

export const USERNAME = "astro-root";

export async function getUser() {
  const { data } = await octokit.rest.users.getByUsername({
    username: USERNAME
  });

  return data;
}

export async function getRepositories() {
  const repositories = [];

  for await (const response of octokit.paginate.iterator(
    octokit.rest.repos.listForUser,
    {
      username: USERNAME,
      per_page: 100,
      type: "owner"
    }
  )) {
    repositories.push(...response.data);
  }

  return repositories.filter(
    repo => !repo.fork && !repo.archived
  );
}
