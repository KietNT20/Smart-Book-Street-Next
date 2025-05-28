export default function Loading() {
  return (
    <div className='flex min-h-screen w-screen items-center justify-center'>
      <div className='container mx-auto p-4 md:px-24'>
        <div className='space-y-4'>
          <div className='h-8 animate-pulse rounded bg-muted'></div>
          <div className='h-64 animate-pulse rounded bg-muted'></div>
          <div className='h-8 animate-pulse rounded bg-muted'></div>
          <div className='h-8 animate-pulse rounded bg-muted'></div>
          <div className='h-8 animate-pulse rounded bg-muted'></div>
          <div className='h-8 animate-pulse rounded bg-muted'></div>
        </div>
      </div>
    </div>
  );
}
