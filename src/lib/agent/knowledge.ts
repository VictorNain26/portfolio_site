import { PORTFOLIO_TOPIC, projectsFrom } from '../projects';
import type { Repo } from './repos';

// What the assistant knows besides the persona, and can cite: one document per project, plus the
// profile README.
export type Document = { id: string; title: string; url: string; names: string[]; text: string };

// The whole corpus, persona included, was 31 124 characters in November 2026 (seven repos, three
// of them cut at the README maximum of src/lib/github.ts). Past this, every question pays for a
// bigger prompt: the build fails and someone decides what goes.
export const MAX_CORPUS = 60_000;

// READMEs arrive as plain text, cleaned and cut when github.json is written (src/lib/github.ts).
const readmeOf = (repo: Repo | undefined) => repo?.readme?.trim() ?? '';

export function checkBudget(persona: string, documents: Document[], max = MAX_CORPUS): void {
  const size = persona.length + documents.reduce((sum, doc) => sum + doc.text.length, 0);
  if (size > max)
    throw new Error(
      `agent corpus: ${size} characters, over the ${max} budget (src/lib/agent/knowledge.ts)`,
    );
}

export function documentsOf(repos: Repo[]): Document[] {
  const byUrl = new Map(repos.map(repo => [repo.url, repo]));
  const projects = projectsFrom(repos).map(project => {
    const repo = byUrl.get(project.repo)!;
    const details = [
      `${project.name} (${project.status}, dépôt ${repo.name}, dernier push ${repo.pushedAt}) : ${project.tagline}`,
      project.stack.length > 0 && `Stack : ${project.stack.join(', ')}.`,
      repo.language && `Langage : ${repo.language}.`,
    ].filter(Boolean);
    return {
      id: `project:${repo.name}`,
      title: project.name,
      url: project.url,
      names: [...new Set([project.name, repo.name])],
      text: [details.join(' '), readmeOf(repo)].filter(Boolean).join('\n\n'),
    };
  });
  // The only repo listed without the topic is the profile one (src/lib/github.ts).
  const profile = repos
    .filter(repo => !repo.topics.includes(PORTFOLIO_TOPIC) && repo.readme)
    .map(repo => ({
      id: 'profile',
      title: 'Profil GitHub de Victor',
      url: repo.url,
      names: [repo.name],
      text: readmeOf(repo),
    }));
  return [...projects, ...profile];
}
