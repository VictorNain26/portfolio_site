import { Badge } from "@/components/ui/badge";

export default function TagChip({ tag }: { tag: string }) {
  return (
    <Badge
      className="
        bg-indigo-700/25 text-indigo-200
        hover:bg-indigo-700/40
        px-3 py-1 text-xs font-medium rounded-full
      "
    >
      #{tag}
    </Badge>
  );
}
