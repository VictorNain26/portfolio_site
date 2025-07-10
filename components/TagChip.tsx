import { Badge } from '@/components/ui/badge';

export default function TagChip({ tag }: { tag: string }) {
  return (
    <Badge className="rounded-full bg-indigo-700/25 px-3 py-1 text-xs font-medium text-indigo-200 hover:bg-indigo-700/40">
      #{tag}
    </Badge>
  );
}
