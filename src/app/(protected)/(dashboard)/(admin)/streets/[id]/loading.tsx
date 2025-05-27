import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='container mx-auto space-y-6 py-6'>
      {/* Header Skeleton */}
      <div className='flex items-center gap-4'>
        <Skeleton className='h-9 w-24' />
        <div className='space-y-2'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-96' />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Main Content Skeleton */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Image Skeleton */}
          <Card>
            <CardContent className='p-0'>
              <Skeleton className='aspect-video w-full rounded-lg' />
            </CardContent>
          </Card>

          {/* Description Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-16' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
