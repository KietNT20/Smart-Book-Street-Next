'use client';

import { Badge as UIBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StoreRent } from '@/enums/store-rent';
import { UserStore } from '@/types/user-types';
import { getVietnameseRentLabel } from '@/utils/format';

type ContractSelectorProps = {
  contracts: UserStore[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  getStatusColor: (status: StoreRent) => string;
};

const ContractSelector = ({
  contracts,
  selectedIndex,
  setSelectedIndex,
  getStatusColor,
}: ContractSelectorProps) => {
  if (contracts.length <= 1) return null;

  return (
    <div className='mb-6'>
      <h2 className='mb-2 text-lg font-medium'>Chọn hợp đồng:</h2>
      <div className='flex flex-wrap gap-2'>
        {contracts?.map((contract, index) => (
          <Button
            key={contract?.contractNumber}
            variant={selectedIndex === index ? 'default' : 'outline'}
            onClick={() => setSelectedIndex(index)}
            className='flex items-center gap-2'
          >
            <span>#{contract?.contractNumber}</span>
            <UIBadge
              className={`px-2 py-0.5 text-xs ${getStatusColor(
                contract?.status
              )}`}
            >
              {getVietnameseRentLabel(contract?.status)}
            </UIBadge>
          </Button>
        ))}
      </div>
    </div>
  );
};
export default ContractSelector;
