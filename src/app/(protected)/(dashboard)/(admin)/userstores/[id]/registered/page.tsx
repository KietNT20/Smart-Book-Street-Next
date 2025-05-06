'use client';

import { AlertDestructive } from '@/components/alert/alert-destructive';
import BackButton from '@/components/back-btn/back-button';
import { ConfirmModal } from '@/components/confirm-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { getVietnameseRentLabel } from '@/utils/format';
import { useState } from 'react';
import ContractDetailsTab from './_components/contract-details-tab';
import ContractHeader from './_components/contract-header';
import ContractSelector from './_components/contract-selector';
import LoadingSkeleton from './_components/loading-skeleton';
import StoreDetailsTab from './_components/store-details-tab';
import UserDetailsTab from './_components/user-details-tab';
import { useUserStoreRegistered } from './_hooks/use-userstore-registered';

type Props = {
  params: { id: string };
};

const UserStoreRegisteredPage = ({ params }: Props) => {
  const userId = params.id as string;
  const {
    userStore,
    isLoading,
    error,
    contract,
    store,
    user,
    startDate,
    endDate,
    getStatusColor,
    selectedContractIndex,
    setSelectedContractIndex,
    handleDeleteUserStore,
    router,
  } = useUserStoreRegistered({ userId });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingContract, setIsDeletingContract] = useState(false);

  useEntityBreadcrumb(
    PATH.USER_STORES,
    'Cửa hàng của người dùng',
    userId,
    user?.fullName
  );

  const handleConfirmDelete = () => {
    if (!contract) return;

    setIsDeletingContract(true);
    try {
      handleDeleteUserStore(contract.userId, contract.storeId);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting contract:', error);
    } finally {
      setIsDeletingContract(false);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !contract || !store) {
    router.replace(PATH.USER_STORES);
    return (
      <div>
        <BackButton routeTo={PATH.USER_STORES} />
        <div className='flex min-h-screen flex-col items-center justify-center'>
          <AlertDestructive
            title='Có lỗi xảy ra!'
            description='Không thể lấy thông tin hợp đồng. Hoặc hợp đồng không tồn tại.'
          />
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto'>
      <ContractHeader
        contractNumber={contract.contractNumber}
        status={contract.status}
        getStatusColor={getStatusColor}
      />

      <ContractSelector
        contracts={userStore}
        selectedIndex={selectedContractIndex}
        setSelectedIndex={setSelectedContractIndex}
        getStatusColor={getStatusColor}
      />

      {/* Tabs */}
      <Tabs defaultValue='details' className='w-full'>
        <TabsList>
          <TabsTrigger value='details'>Tình trạng hợp đồng</TabsTrigger>
          <TabsTrigger value='store'>Thông Tin Cửa Hàng</TabsTrigger>
          <TabsTrigger value='user'>Thông Tin Người Thuê</TabsTrigger>
        </TabsList>

        <TabsContent value='details' className='mt-4'>
          <ContractDetailsTab
            contract={contract}
            startDate={startDate}
            endDate={endDate}
            getVietnameseRentLabel={getVietnameseRentLabel}
            onDeleteClick={() => setIsDeleteModalOpen(true)}
          />
        </TabsContent>

        <TabsContent value='store' className='mt-4'>
          <StoreDetailsTab store={store} />
        </TabsContent>

        <TabsContent value='user' className='mt-4'>
          <UserDetailsTab user={user} />
        </TabsContent>
      </Tabs>
      {/* Confirm modal for delete action */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Xác nhận xóa hợp đồng'
        description={`Bạn có chắc chắn muốn xóa hợp đồng #${contract.contractNumber} này không? Hành động này không thể hoàn tác.`}
        confirmText='Xóa'
        cancelText='Hủy'
        variant='destructive'
        isLoading={isDeletingContract}
      />
    </div>
  );
};

export default UserStoreRegisteredPage;
