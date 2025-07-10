declare module '*.css' {
  const content: string;
  export default content;
}

declare namespace THREE {
  type Object3D = {
    // Add basic THREE.js types
    position: {
      x: number;
      y: number;
      z: number;
    };
    rotation: {
      x: number;
      y: number;
      z: number;
    };
    scale: {
      x: number;
      y: number;
      z: number;
    };
  }
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