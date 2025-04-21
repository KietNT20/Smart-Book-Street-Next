import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardLoadingSkeleton() {
  return (
    <div className='space-y-6 p-6'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, index) => (
          <Card key={index} className='overflow-hidden'>
            <CardHeader className='pb-2'>
              <div className='h-5 w-3/4 animate-pulse rounded bg-muted'></div>
              <div className='mt-2 h-4 w-1/2 animate-pulse rounded bg-muted'></div>
            </CardHeader>
            <CardContent>
              <div className='h-12 animate-pulse rounded bg-muted'></div>
              <div className='mt-4 flex items-center justify-between'>
                <div className='h-4 w-1/3 animate-pulse rounded bg-muted'></div>
                <div className='h-6 w-6 animate-pulse rounded-full bg-muted'></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className='pb-2'>
          <div className='h-6 w-1/4 animate-pulse rounded bg-muted'></div>
        </CardHeader>
        <CardContent>
          {/* Table controls */}
          <div className='mb-4 flex items-center justify-between'>
            <div className='h-10 w-1/3 animate-pulse rounded bg-muted'></div>
            <div className='h-10 w-32 animate-pulse rounded bg-muted'></div>
          </div>

          {/* Table header */}
          <div className='rounded-t-md border'>
            <div className='grid grid-cols-6 gap-4 bg-muted/20 p-4'>
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className='h-5 animate-pulse rounded bg-muted'
                ></div>
              ))}
            </div>
          </div>

          <div className='rounded-b-md border-x border-b'>
            {[...Array(5)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid grid-cols-6 gap-4 p-4 ${rowIndex % 2 === 0 ? 'bg-muted/10' : ''}`}
              >
                {[...Array(6)].map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className={`h-5 animate-pulse rounded bg-muted ${
                      colIndex === 0
                        ? 'w-1/2'
                        : colIndex === 5
                          ? 'w-full'
                          : 'w-3/4'
                    }`}
                    style={{
                      animationDelay: `${(rowIndex * 6 + colIndex) * 0.05}s`,
                    }}
                  ></div>
                ))}
              </div>
            ))}
          </div>

          <div className='mt-4 flex items-center justify-between'>
            <div className='h-8 w-32 animate-pulse rounded bg-muted'></div>
            <div className='flex gap-2'>
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className='h-8 w-8 animate-pulse rounded bg-muted'
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
