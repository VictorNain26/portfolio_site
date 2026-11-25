import github from '../../data/github.json';
import { content } from './content';
import { checkBudget, documentsOf } from './knowledge';
import { reposSchema } from './repos';

// Built with the site: sync.yml redeploys when GitHub changes, so a new README reaches the
// assistant within a few hours.
export const persona = content.persona;
export const documents = documentsOf(reposSchema.parse(github));
checkBudget(persona, documents);
