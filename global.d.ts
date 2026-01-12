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