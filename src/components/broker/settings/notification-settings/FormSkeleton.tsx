
import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
        <Skeleton key={index} className="w-full h-20" />
      ))}
      <Skeleton className="w-1/4 h-10 ml-auto" />
    </div>
  );
}
