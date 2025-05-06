import BackButton from '@/components/back-btn/back-button';
import { Badge as UIBadge } from '@/components/ui/badge';
import { PATH } from '@/enums/path';
import { StoreRent } from '@/enums/store-rent';
import { getVietnameseRentLabel } from '@/utils/format';

type ContractHeaderProps = {
  contractNumber?: string;
  status?: StoreRent;
  getStatusColor: (status: StoreRent) => string;
};

const ContractHeader = ({
  contractNumber,
  status,
  getStatusColor,
}: ContractHeaderProps) => {
  return (
    <div className='mb-6 space-y-2'>
      <BackButton routeTo={PATH.USER_STORES} />
      <h1 className='text-3xl font-bold'>Thông Tin Hợp Đồng</h1>
      <div className='flex items-center gap-6'>
        <p className='text-muted-foreground'>#{contractNumber}</p>
        <UIBadge
          className={`px-3 py-1 text-sm ${getStatusColor(status as StoreRent)}`}
        >
          {getVietnameseRentLabel(status as StoreRent)}
        </UIBadge>
      </div>
    </div>
  );
};
export default ContractHeader;
