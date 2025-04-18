const SkeletonForm = () => {
  return (
    <div className='mx-auto w-full max-w-md animate-pulse rounded-lg bg-white p-6 shadow-md'>
      {/* Form Title Skeleton */}
      <div className='mb-6 h-8 w-3/4 rounded-md bg-gray-200'></div>

      {/* Input Field Skeletons */}
      <div className='mb-6 space-y-4'>
        {/* Field 1 */}
        <div>
          <div className='mb-2 h-4 w-1/4 rounded bg-gray-200'></div>
          <div className='h-10 w-full rounded-md bg-gray-200'></div>
        </div>

        {/* Field 2 */}
        <div>
          <div className='mb-2 h-4 w-1/3 rounded bg-gray-200'></div>
          <div className='h-10 w-full rounded-md bg-gray-200'></div>
        </div>

        {/* Field 3 */}
        <div>
          <div className='mb-2 h-4 w-1/4 rounded bg-gray-200'></div>
          <div className='h-10 w-full rounded-md bg-gray-200'></div>
        </div>

        {/* Field 4 - Textarea */}
        <div>
          <div className='mb-2 h-4 w-2/5 rounded bg-gray-200'></div>
          <div className='h-24 w-full rounded-md bg-gray-200'></div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className='mt-8 h-12 w-full rounded-md bg-gray-300'></div>
    </div>
  );
};

export default SkeletonForm;
