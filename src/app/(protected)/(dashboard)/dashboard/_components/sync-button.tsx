'use client';

import { Button } from '@/components/ui/button';
import { useSyncPersonData } from '@/hooks/use-person';

interface SyncButtonProps {
  onSync?: (syncTime: Date) => void;
}

const SyncButton = ({ onSync }: SyncButtonProps) => {
  const { syncData, isSyncing } = useSyncPersonData();

  const _onClick = () => {
    try {
      syncData();
      if (onSync) {
        onSync(new Date());
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  return (
    <Button onClick={_onClick} disabled={isSyncing}>
      {isSyncing ? 'Đang cập nhật...' : 'Cập nhật dữ liệu'}
    </Button>
  );
};

export default SyncButton;
