import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getGitHubProjects, getTechnologyColor } from '../github';

/**
 * `lib/github.ts` drives the Projects section. It fetches repos, keeps only
 * those tagged `demo`, enriches them with languages, and degrades silently to
 * an empty list on any failure. These tests pin that contract by mocking
 * `fetch`.
 */

type FetchMock = ReturnType<typeof vi.fn>;

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as unknown as Response;
}

const baseRepo = {
  id: 1,
  name: 'demo-app',
  full_name: 'victornain26/demo-app',
  description: 'A demo app',
  html_url: 'https://github.com/victornain26/demo-app',
  homepage: 'https://demo.example.com',
  topics: ['demo'],
  language: 'TypeScript',
  stargazers_count: 12,
  updated_at: '2025-05-01T00:00:00Z',
  created_at: '2025-01-01T00:00:00Z',
  languages_url: 'https://api.github.com/repos/victornain26/demo-app/languages',
};

describe('getGitHubProjects', () => {
  let fetchMock: FetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns only repos tagged "demo" and maps them to Projects', async () => {
    fetchMock
      // repos list
      .mockResolvedValueOnce(
        jsonResponse([
          baseRepo,
          { ...baseRepo, id: 2, name: 'not-a-demo', topics: ['library'] },
        ]),
      )
      // languages for the demo repo
      .mockResolvedValueOnce(jsonResponse({ TypeScript: 1000, CSS: 200 }));

    const projects = await getGitHubProjects();

    expect(projects).toHaveLength(1);
    expect(projects[0]).toMatchObject({
      id: 1,
      name: 'demo-app',
      description: 'A demo app',
      demoUrl: 'https://demo.example.com',
      repoUrl: 'https://github.com/victornain26/demo-app',
      technologies: ['TypeScript', 'CSS'],
      stars: 12,
    });
  });

  it('excludes repos whose name contains a dot (e.g. username.github.io)', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse([{ ...baseRepo, name: 'victornain26.github.io' }]),
    );

    const projects = await getGitHubProjects();
    expect(projects).toEqual([]);
  });

  it('falls back to a default description and null demoUrl when fields are missing', async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse([{ ...baseRepo, description: null, homepage: null }]),
      )
      .mockResolvedValueOnce(jsonResponse({}));

    const [project] = await getGitHubProjects();
    expect(project?.description).toBe('Aucune description disponible');
    expect(project?.demoUrl).toBeNull();
    expect(project?.technologies).toEqual([]);
  });

  it('caps technologies at the top 5 languages, sorted by usage', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([baseRepo])).mockResolvedValueOnce(
      jsonResponse({
        Go: 10,
        TypeScript: 100,
        CSS: 50,
        HTML: 5,
        Python: 80,
        Ruby: 1,
      }),
    );

    const [project] = await getGitHubProjects();
    expect(project?.technologies).toEqual(['TypeScript', 'Python', 'CSS', 'Go', 'HTML']);
    expect(project?.technologies).toHaveLength(5);
  });

  it('sorts projects by most recently updated first', async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse([
          { ...baseRepo, id: 1, name: 'older', updated_at: '2025-01-01T00:00:00Z' },
          { ...baseRepo, id: 2, name: 'newer', updated_at: '2025-09-01T00:00:00Z' },
        ]),
      )
      // languages calls for both repos
      .mockResolvedValue(jsonResponse({ TypeScript: 1 }));

    const projects = await getGitHubProjects();
    expect(projects.map(p => p.name)).toEqual(['newer', 'older']);
  });

  it('returns [] when the repos request is not ok', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, false, 403));
    expect(await getGitHubProjects()).toEqual([]);
  });

  it('returns [] when fetch throws', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'));
    expect(await getGitHubProjects()).toEqual([]);
  });

  it('yields empty technologies (not a crash) when the languages request fails', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse([baseRepo]))
      .mockResolvedValueOnce(jsonResponse({}, false, 500));

    const [project] = await getGitHubProjects();
    expect(project?.technologies).toEqual([]);
  });
});

describe('getTechnologyColor', () => {
  it('returns the mapped color for a known technology', () => {
    expect(getTechnologyColor('TypeScript')).toBe('#3178C6');
    expect(getTechnologyColor('Python')).toBe('#3776AB');
  });

  it('returns the neutral fallback color for an unknown technology', () => {
    expect(getTechnologyColor('COBOL')).toBe('#6B7280');
    expect(getTechnologyColor('')).toBe('#6B7280');
  });
});
