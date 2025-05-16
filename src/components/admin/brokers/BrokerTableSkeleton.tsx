
import { Skeleton } from "@/components/ui/skeleton";

export const BrokerTableSkeleton = () => (
  <div className="space-y-2">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border-b">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full max-w-[250px]" />
          <Skeleton className="h-4 w-full max-w-[200px]" />
        </div>
      </div>
    ))}
  </div>
);
