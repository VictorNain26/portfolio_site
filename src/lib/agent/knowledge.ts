import type { Project } from '../projects';
import type { Repo } from './repos';

export type Knowledge = { persona: string; projects: Project[]; repos: Repo[] };

// One citable item: a project or a public repo.
export type Document = { id: string; title: string; url: string; names: string[]; text: string };

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// The model copies markdown links it reads; answers must stay plain text.
export const unlink = (markdown: string) => markdown.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

export function documentsOf(knowledge: Knowledge): Document[] {
  return [
    ...knowledge.projects.map(project => ({
      id: `project:${slugify(project.name)}`,
      title: project.name,
      url: project.url,
      names: [project.name],
      text: `${project.name} (${project.status}) : ${project.tagline} Stack : ${project.stack.join(', ')}.`,
    })),
    ...knowledge.repos.map(repo => ({
      id: `repo:${repo.name}`,
      title: `${repo.name} sur GitHub`,
      url: repo.url,
      names: [repo.name],
      text: `${repo.name} : ${repo.description ?? 'sans description'} (${repo.language ?? 'langage non indiqué'}, dernier push ${repo.pushedAt.slice(0, 10)}${repo.archived ? ', archivé' : ''}).`,
    })),
  ];
}
