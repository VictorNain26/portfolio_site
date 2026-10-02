import type { Project } from '../../data/projects';
import { formatDate, publishedPosts } from '../posts';
import type { Repo } from './repos';

export type Post = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  publishedAt: Date;
};
export type Knowledge = { persona: string; projects: Project[]; posts: Post[]; repos: Repo[] };

// One citable item: a project, a published post or a public repo.
export type Document = { id: string; title: string; url: string; names: string[]; text: string };

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// The model copies markdown links it reads; answers must stay plain text.
const unlink = (markdown: string) => markdown.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

export function documentsOf(knowledge: Knowledge, now: Date, siteUrl: string): Document[] {
  const posts = publishedPosts(
    knowledge.posts.map(post => ({ data: post })),
    now,
  ).map(({ data }) => data);
  return [
    ...knowledge.projects.map(project => ({
      id: `project:${slugify(project.name)}`,
      title: project.name,
      url: project.url,
      names: [project.name],
      text: `${project.name} (${project.status}) : ${project.tagline} Stack : ${project.stack.join(', ')}.`,
    })),
    ...posts.map(post => ({
      id: `post:${post.slug}`,
      title: post.title,
      url: new URL(`/blog/${post.slug}`, siteUrl).href,
      names: [post.title],
      text: `${post.title} (publié le ${formatDate(post.publishedAt)})\n${post.summary}\n\n${unlink(post.body)}`,
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
