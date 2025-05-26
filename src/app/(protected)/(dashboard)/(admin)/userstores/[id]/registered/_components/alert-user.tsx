import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AlertUser = () => {
  return (
    <div className='flex h-[50vh] w-full flex-col items-center justify-center'>
      <Alert variant='destructive'>
        <AlertCircle className='size-4' />
        <AlertTitle>Không Tìm Thấy Hợp Đồng Này</AlertTitle>
        <AlertDescription>
          Không tìm thấy hợp đồng này. Vui lòng kiểm tra lại hợp đồng hoặc liên
          hệ với quản trị viên nếu bạn nghĩ rằng đây là một lỗi.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AlertUser;
