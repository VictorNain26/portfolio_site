export function publishedPosts<T extends { data: { publishedAt: Date } }>(
  posts: T[],
  now: Date,
): T[] {
  return posts
    .filter(post => post.data.publishedAt <= now)
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}
