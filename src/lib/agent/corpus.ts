import github from '../../data/github.json';
import { projects } from '../../data/projects';
import { content } from './content';
import type { Knowledge } from './knowledge';
import { reposSchema } from './repos';

export const knowledge: Knowledge = { ...content, projects, repos: reposSchema.parse(github) };
