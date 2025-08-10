// lib/github.ts
export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  created_at: string;
  languages_url: string;
};

export type GitHubLanguages = {
  [key: string]: number;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  demoUrl: string | null;
  repoUrl: string;
  technologies: string[];
  stars: number;
  updatedAt: string;
  createdAt: string;
};

const GITHUB_USERNAME = 'victornain26'; // Remplacez par votre username GitHub
const GITHUB_API_URL = 'https://api.github.com';

/**
 * Récupère les repositories GitHub avec le topic "demo"
 */
export async function getGitHubProjects(): Promise<Project[]> {
  try {
    // Récupérer tous les repos de l'utilisateur
    const reposResponse = await fetch(
      `${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Website',
        },
        next: { revalidate: 3600 }, // Cache pour 1 heure
      },
    );

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos: GitHubRepo[] = await reposResponse.json();

    // Filtrer les repos avec le topic "demo"
    const demoRepos = repos.filter(
      repo => repo.topics.includes('demo') && !repo.name.includes('.'),
    );

    // Transformer en format Project
    const projects: Project[] = await Promise.all(
      demoRepos.map(async repo => {
        // Récupérer les langages pour ce repo
        const technologies = await getRepoLanguages(repo.languages_url);

        return {
          id: repo.id,
          name: repo.name,
          description: repo.description || 'Aucune description disponible',
          demoUrl: repo.homepage || null,
          repoUrl: repo.html_url,
          technologies,
          stars: repo.stargazers_count,
          updatedAt: repo.updated_at,
          createdAt: repo.created_at,
        };
      }),
    );

    return projects.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  } catch {
    // Silent error handling for production
    return [];
  }
}

/**
 * Récupère les langages utilisés dans un repository
 */
async function getRepoLanguages(languagesUrl: string): Promise<string[]> {
  try {
    const response = await fetch(languagesUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Website',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const languages: GitHubLanguages = await response.json();

    // Retourner les langages triés par usage (descending)
    return Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5) // Garder seulement les 5 principaux
      .map(([lang]) => lang);
  } catch {
    // Silent error handling for production
    return [];
  }
}

/**
 * Mappe les noms de langages vers des couleurs
 */
export function getTechnologyColor(tech: string): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178C6',
    JavaScript: '#F7DF1E',
    React: '#61DAFB',
    'Next.js': '#000000',
    Vue: '#4FC08D',
    Python: '#3776AB',
    Java: '#ED8B00',
    'C#': '#239120',
    Go: '#00ADD8',
    Rust: '#000000',
    PHP: '#777BB4',
    Ruby: '#CC342D',
    Swift: '#FA7343',
    Kotlin: '#0095D5',
    Dart: '#0175C2',
    HTML: '#E34F26',
    CSS: '#1572B6',
    SCSS: '#CF649A',
    Tailwind: '#06B6D4',
    Node: '#339933',
    Express: '#000000',
    MongoDB: '#47A248',
    PostgreSQL: '#336791',
    MySQL: '#4479A1',
    Redis: '#DC382D',
    Docker: '#2496ED',
    Kubernetes: '#326CE5',
  };

  return colors[tech] || '#6B7280';
}
