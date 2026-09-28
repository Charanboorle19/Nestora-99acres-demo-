import { cn } from '../../utils/format'

export default function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}
