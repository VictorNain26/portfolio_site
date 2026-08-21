declare module '*.css' {
  const content: string;
  export default content;
}

declare module 'content-collections' {
  export type Post = {
    title: string;
    summary: string;
    coverImage: string;
    publishedAt: string;
    tags: string[];
    slug: string;
    content: string;
    mdx: {
      code: string;
    };
  }
  
  export const allPosts: Post[];
}

/* Embed Cal.com : le loader officiel (cf. components/CalEmbedScript.tsx) pose
 * `window.Cal`. Typage réduit aux instructions réellement utilisées ici. */
interface Window {
  Cal?: ((
    instruction: 'modal',
    args: {
      calLink: string;
      calOrigin?: string;
      config?: { layout?: 'month_view' | 'week_view' | 'column_view'; theme?: 'dark' | 'light' };
    },
  ) => void) & { instance?: unknown };
}
