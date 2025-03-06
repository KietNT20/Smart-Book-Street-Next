import { Button } from '@/components/ui/button';

type Props = {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
};

const ViewControls = ({ viewMode, setViewMode }: Props) => {
  return (
    <div className='flex justify-end space-x-2'>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        size='sm'
        onClick={() => setViewMode('grid')}
        className='h-8 w-8 p-0'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <rect x='3' y='3' width='7' height='7' />
          <rect x='14' y='3' width='7' height='7' />
          <rect x='14' y='14' width='7' height='7' />
          <rect x='3' y='14' width='7' height='7' />
        </svg>
        <span className='sr-only'>Grid view</span>
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size='sm'
        onClick={() => setViewMode('list')}
        className='h-8 w-8 p-0'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <line x1='8' y1='6' x2='21' y2='6' />
          <line x1='8' y1='12' x2='21' y2='12' />
          <line x1='8' y1='18' x2='21' y2='18' />
          <line x1='3' y1='6' x2='3.01' y2='6' />
          <line x1='3' y1='12' x2='3.01' y2='12' />
          <line x1='3' y1='18' x2='3.01' y2='18' />
        </svg>
        <span className='sr-only'>List view</span>
      </Button>
    </div>
  );
};

export default ViewControls;
