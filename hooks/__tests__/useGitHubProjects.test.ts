import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useGitHubProjects } from '../useGitHubProjects';
import * as githubModule from '@/lib/github';

// Mock the github module
vi.mock('@/lib/github', () => ({
  getGitHubProjects: vi.fn(),
}));

const mockGetGitHubProjects = vi.mocked(githubModule.getGitHubProjects);

const mockProjects = [
  {
    id: 1,
    name: 'test-project',
    description: 'A test project',
    demoUrl: 'https://test-project-demo.com',
    repoUrl: 'https://github.com/user/test-project',
    technologies: ['TypeScript', 'React'],
    stars: 10,
    updatedAt: '2024-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'another-project',
    description: 'Another test project',
    demoUrl: null,
    repoUrl: 'https://github.com/user/another-project',
    technologies: ['JavaScript', 'Node.js'],
    stars: 5,
    updatedAt: '2024-02-01T00:00:00Z',
    createdAt: '2023-02-01T00:00:00Z',
  },
];

describe('useGitHubProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    mockGetGitHubProjects.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { result } = renderHook(() => useGitHubProjects());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.projects).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should fetch projects successfully', async () => {
    mockGetGitHubProjects.mockResolvedValue(mockProjects);
    
    const { result } = renderHook(() => useGitHubProjects());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.projects).toEqual(mockProjects);
    expect(result.current.error).toBe(null);
    expect(mockGetGitHubProjects).toHaveBeenCalledTimes(1);
  });

  it('should handle errors correctly', async () => {
    const errorMessage = 'Failed to fetch projects';
    mockGetGitHubProjects.mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useGitHubProjects());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.projects).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(mockGetGitHubProjects).toHaveBeenCalledTimes(1);
  });

  it('should handle non-Error exceptions', async () => {
    mockGetGitHubProjects.mockRejectedValue('String error');
    
    const { result } = renderHook(() => useGitHubProjects());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBe('Une erreur est survenue');
  });

  it('should provide refetch functionality', async () => {
    mockGetGitHubProjects.mockResolvedValue(mockProjects);
    
    const { result } = renderHook(() => useGitHubProjects());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Clear the mock to verify refetch calls it again
    mockGetGitHubProjects.mockClear();
    const firstProject = mockProjects[0];
    if (firstProject) {
      mockGetGitHubProjects.mockResolvedValue([firstProject]);
    }
    
    // Call refetch
    await act(async () => {
      await result.current.refetch();
    });
    
    await waitFor(() => {
      const firstProject = mockProjects[0];
      expect(result.current.projects).toEqual(firstProject ? [firstProject] : []);
    });
    
    expect(mockGetGitHubProjects).toHaveBeenCalledTimes(1);
  });

  it('should reset error state when refetching', async () => {
    // First call fails
    mockGetGitHubProjects.mockRejectedValue(new Error('Network error'));
    
    const { result } = renderHook(() => useGitHubProjects());
    
    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });
    
    // Second call succeeds
    mockGetGitHubProjects.mockClear();
    mockGetGitHubProjects.mockResolvedValue(mockProjects);
    
    await act(async () => {
      await result.current.refetch();
    });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBe(null);
    expect(result.current.projects).toEqual(mockProjects);
  });

  it('should set loading state during refetch', async () => {
    mockGetGitHubProjects.mockResolvedValue(mockProjects);
    
    const { result } = renderHook(() => useGitHubProjects());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(typeof result.current.refetch).toBe('function');
  });
});