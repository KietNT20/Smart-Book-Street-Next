import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="aspect-video rounded-xl" />
      </div>
      <Skeleton className="w-full h-full rounded-xl md:min-h-min" />
    </>
  );
}
