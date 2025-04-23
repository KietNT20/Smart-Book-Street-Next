import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileSkeleton() {
  return (
    <div className='container py-8'>
      <Skeleton className='h-10 w-24' />

      <div className='grid gap-6 md:grid-cols-3'>
        <Card className='md:col-span-2'>
          <CardHeader>
            <Skeleton className='mx-auto h-6 w-40' />
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>
                    <Skeleton className='mb-2 h-4 w-24' />
                    <Skeleton className='h-6 w-full' />
                  </div>
                ))}
              <div className='md:col-span-2'>
                <Skeleton className='mb-2 h-4 w-24' />
                <Skeleton className='h-6 w-full' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center text-center'>
              <Skeleton className='mb-4 h-40 w-40 rounded-full' />
              <Skeleton className='mb-2 h-6 w-40' />
              <Skeleton className='mb-4 h-4 w-32' />
              <Skeleton className='mb-2 h-5 w-48' />
              <Skeleton className='mt-4 h-10 w-full' />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
